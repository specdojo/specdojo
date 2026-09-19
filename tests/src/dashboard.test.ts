import { describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  buildDashboardMarkdown,
  buildDailyRoutineRows,
  collapseFrequentRoutineRows,
  formatZonedDateTime,
  buildTimelineGanttSvg,
  computeRoutineDue,
  computeTimelineTrackSchedules,
  dashboardOutputFiles,
  latestExecBlockReasons,
  latestRegisterWaitReason,
  rankRegisterCandidates,
  type DashboardRegisterCandidate,
  type DashboardPaths,
  type TimelineTrackSchedule,
} from "../../src/dashboard.js";
import { addWorkingDaysToDate, countWorkingDaysBetween } from "../../src/exec-schedule-calendar.js";
import type { ScheduleCalendar } from "../../src/exec-types.js";
import type { TimelineIndex, TimelineTrackPlan } from "../../src/timeline-build.js";
import type { RoutineDoc } from "../../src/routine.js";

// 平日のみ稼働・休日なしのカレンダー。addWorkingDaysToDate / countWorkingDaysBetween は
// work_hours_per_day に依存しない（isWorkingDateUtc は曜日・休日のみ判定）ため値は任意。
function makeCalendar(overrides: Partial<ScheduleCalendar> = {}): ScheduleCalendar {
  return {
    timezone: "UTC",
    workdays: new Set([1, 2, 3, 4, 5]),
    holidays: new Set<string>(),
    work_hours_per_day: 24,
    ...overrides,
  };
}

// 2026-01-05 は月曜日（exec-schedule-calendar.test.ts の前提）。週末は飛ばすため日付演算に用いる。

describe("addWorkingDaysToDate", () => {
  it("dayOffset が 0 以下なら開始日をそのまま返す", () => {
    const cal = makeCalendar();
    expect(addWorkingDaysToDate("2026-01-05", 0, cal)).toBe("2026-01-05");
    expect(addWorkingDaysToDate("2026-01-05", -3, cal)).toBe("2026-01-05");
  });

  it("週末を飛ばして稼働日のみ数えて予定日へ伸ばす", () => {
    const cal = makeCalendar();
    // 金 2026-01-09 + 稼働 2 日 = 月 01-12, 火 01-13 → 2026-01-13
    expect(addWorkingDaysToDate("2026-01-09", 2, cal)).toBe("2026-01-13");
    // 月 2026-01-05 + 稼働 3 日 = 火・水・木 → 2026-01-08
    expect(addWorkingDaysToDate("2026-01-05", 3, cal)).toBe("2026-01-08");
  });

  it("稼働日を上限に数えて指定日を超えない（count と対称）", () => {
    const cal = makeCalendar();
    // 月〜金（01-05〜01-09）の間の稼働日数は 3（火・水・木）。金から4稼働日後は翌週木曜。
    expect(countWorkingDaysBetween("2026-01-05", "2026-01-09", cal)).toBe(3);
    expect(addWorkingDaysToDate("2026-01-09", 4, cal)).toBe("2026-01-15");
  });
});

describe("countWorkingDaysBetween", () => {
  it("target が start 以下なら 0 を返す", () => {
    const cal = makeCalendar();
    expect(countWorkingDaysBetween("2026-01-09", "2026-01-05", cal)).toBe(0);
    expect(countWorkingDaysBetween("2026-01-05", "2026-01-05", cal)).toBe(0);
  });

  it("週末を含まず稼働日のみカウントする（上限は排他）", () => {
    const cal = makeCalendar();
    // 金 01-09 から翌週月 01-13 の間（排他）の稼働日は 月 01-12 のみ → 1
    expect(countWorkingDaysBetween("2026-01-09", "2026-01-13", cal)).toBe(1);
  });

  it("休日で挟まれた区間も稼働日のみが数えられる", () => {
    const cal = makeCalendar({ holidays: new Set(["2026-01-06"]) });
    // 月〜金の間に火（01-06）を休日にする。稼働日は水・木・金 → 0.5 相当ではなく 3。
    // here we count working days strictly between 01-05(Mon) and 01-09(Fri): Tue(holiday),Wed,Thu = 2
    expect(countWorkingDaysBetween("2026-01-05", "2026-01-09", cal)).toBe(2);
  });
});

// ---- computeTimelineTrackSchedules -------------------------------------------

function makeTrackPlan(overrides: Partial<TimelineTrackPlan> = {}): TimelineTrackPlan {
  return {
    track: "t",
    domains: ["d"],
    catalog_status: "draft",
    order: 1,
    depends_on: [],
    ...overrides,
  };
}

// wave1 は推定日数なしの lead track（launch）。wave2/wave3 で日付伝播と chaining を検証。
function makeIndex(overrides: Partial<TimelineIndex> = {}): TimelineIndex {
  return {
    id: "tml-prj-x",
    project_id: "prj-0001",
    status: "draft",
    planned_start_date: "2026-01-05",
    tracks: [
      // wave1: 推定日数なし → cursor は plan 開始日を保持。
      makeTrackPlan({
        track: "launch",
        order: 1,
        catalog_status: "primary",
        depends_on: [],
      }),
      // wave2: launch に依存。推定日数ありで予定終了が算出される。
      makeTrackPlan({
        track: "alpha",
        order: 2,
        catalog_status: "draft",
        catalog_duration_estimate_days: 3,
        parallel_group: "grp-a",
        depends_on: ["launch"],
      }),
      // wave3: alpha に依存。直前 wave の最遅完了の翌稼働日へ着手。
      makeTrackPlan({
        track: "gamma",
        order: 3,
        catalog_status: "draft",
        catalog_duration_estimate_days: 2,
        depends_on: ["alpha"],
      }),
    ],
    ...overrides,
  };
}

describe("computeTimelineTrackSchedules", () => {
  it("计划開始日を起点に wave ごとの予定を開始/終了日へ展開する", () => {
    const cal = makeCalendar();
    const index = makeIndex();
    const { schedule, plannedStartDate } = computeTimelineTrackSchedules(index, cal);

    expect(plannedStartDate).toBe("2026-01-05");
    expect(schedule.map((r) => r.track)).toEqual(["launch", "alpha", "gamma"]);

    const launch = schedule.find((r) => r.track === "launch")!;
    const alpha = schedule.find((r) => r.track === "alpha")!;
    const gamma = schedule.find((r) => r.track === "gamma")!;

    // launch は推定日数なし → 着手点は plan 開始日、終了日は未定。
    expect(launch.startDate).toBe("2026-01-05");
    expect(launch.endDate).toBeUndefined();
    expect(launch.wave).toBe(1);
    expect(launch.estimateDays).toBeUndefined();

    // 直前 wave（launch, 推定日数なし）でも cursor は plan 開始日を保持 → alpha も 01-05 から着手。
    expect(alpha.startDate).toBe("2026-01-05");
    expect(alpha.endDate).toBe("2026-01-08"); // 01-05 + 3 稼働日（火・水・木）
    expect(alpha.wave).toBe(2);

    // gamma は alpha の終了(01-08)の翌稼働日(金 01-09)から着手、+2 稼働日で 翌月水 → 01-13?
    // addWorkingDaysToDate("2026-01-09", 2) = 火 01-13。
    expect(gamma.startDate).toBe("2026-01-09");
    expect(gamma.endDate).toBe("2026-01-13");
    expect(gamma.wave).toBe(3);
  });

  it("予定終了日の無い wave では次 wave へ着手点が伝播する（cursor 受け継ぎ）", () => {
    const cal = makeCalendar();
    // launch(推定なし) のみの wave1。wave2 も推定なし → plan 開始日を保持したまま。
    const index = makeIndex({
      tracks: [
        makeTrackPlan({ track: "launch", order: 1 }),
        makeTrackPlan({ track: "beta", order: 2, depends_on: ["launch"] }),
      ],
    });
    const { schedule } = computeTimelineTrackSchedules(index, cal);
    const launch = schedule.find((r) => r.track === "launch")!;
    const beta = schedule.find((r) => r.track === "beta")!;
    expect(launch.startDate).toBe("2026-01-05");
    expect(beta.startDate).toBe("2026-01-05"); // 推定なしでも着手点は plan 開始日へ伝播
    expect(beta.endDate).toBeUndefined();
  });

  it("planned_start_date が未設定なら日付は算出されない", () => {
    const cal = makeCalendar();
    const index = makeIndex({ planned_start_date: undefined });
    const { schedule, plannedStartDate } = computeTimelineTrackSchedules(index, cal);
    expect(plannedStartDate).toBeUndefined();
    for (const row of schedule) expect(row.startDate).toBeUndefined();
  });

  it("休日が入ると予定終了日が後ろにずれる", () => {
    const cal = makeCalendar({ holidays: new Set(["2026-01-07"]) }); // 水を休日に
    const index = makeIndex({
      planned_start_date: "2026-01-05",
      tracks: [makeTrackPlan({ track: "launch", order: 1, catalog_duration_estimate_days: 3 })],
    });
    const { schedule } = computeTimelineTrackSchedules(index, cal);
    // 01-05 + 3 稼働日（火・木・金、水は休日）= 金 01-09
    expect(schedule[0].endDate).toBe("2026-01-09");
  });
});

// ---- buildTimelineGanttSvg ---------------------------------------------------

function makeRow(overrides: Partial<TimelineTrackSchedule> = {}): TimelineTrackSchedule {
  return {
    track: "x",
    order: 1,
    domains: ["d"],
    status: "draft",
    depends_on: [],
    wave: 1,
    ...overrides,
  };
}

describe("buildTimelineGanttSvg", () => {
  it("バーと開始点 diamond・トラック名・軸キャプションを描画する", () => {
    const schedule: TimelineTrackSchedule[] = [
      makeRow({ track: "alpha", startDate: "2026-01-05", endDate: "2026-01-08", status: "draft" }),
      makeRow({
        track: "launch",
        startDate: "2026-01-05",
        status: "primary", // 終了日のない開始点
      }),
    ];
    const svg = buildTimelineGanttSvg(schedule, "2026-01-05");

    expect(svg).toContain("<svg");
    expect(svg).toContain('role="img"');
    expect(svg).toContain('aria-label="トラック計画ガントチャート"');
    // 横軸は日付である旨のキャプション。
    expect(svg).toContain("横軸は日付");
    // 予定開始/終了の両方を持つトラックはバー（rect）として描画。
    expect(svg).toContain("<rect");
    // 開始日のみのトラックは diamond（polygon）マーカー。
    expect(svg).toContain("<polygon");
    // 各トラック名がラベルとして表示される。
    expect(svg).toContain(">alpha</text>");
    expect(svg).toContain(">launch</text>");
  });

  it("planned_start_date が未設定なら no-data メッセージを返す", () => {
    const schedule: TimelineTrackSchedule[] = [makeRow({ track: "alpha" })];
    const svg = buildTimelineGanttSvg(schedule, undefined);
    expect(svg).toContain('role="img"');
    expect(svg).toContain("planned_start_date");
    // 背景 rect は存在するが、工程バーと開始点マーカーは描画されない。
    expect(svg).not.toContain('rx="3"');
    expect(svg).not.toContain("<polygon");
  });

  it("予定開始日の全無効なら no-data を返す", () => {
    const schedule: TimelineTrackSchedule[] = [makeRow({ track: "alpha", startDate: undefined })];
    const svg = buildTimelineGanttSvg(schedule, "2026-01-05");
    expect(svg).toContain('role="img"');
    expect(svg).not.toContain('rx="3"');
    expect(svg).not.toContain("<polygon");
  });
});

// ---- buildDashboardMarkdown --------------------------------------------------

describe("buildDashboardMarkdown", () => {
  it("末尾を空行で終えない", () => {
    // 各セクションは区切りの空行で終わるため、そのまま連結すると書き出し時の改行と合わさって
    // 末尾が空行2行になり markdownlint の MD012 に触れる。
    const root = mkdtempSync(join(tmpdir(), "specdojo-dashboard-"));

    try {
      const markdown = buildDashboardMarkdown({
        projectId: "prj-test",
        projectPath: join(root, "project"),
        timelinePath: join(root, "project", "timeline"),
        executionGeneratedPath: join(root, "project", "execution", "generated"),
      });

      expect(markdown.endsWith("\n")).toBe(false);
      expect(`${markdown}\n`).not.toMatch(/\n\n$/);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe("daily briefing", () => {
  it("Asia/Tokyo の日付境界で昨日の実績と本日の予定を分ける", () => {
    const rows = buildDailyRoutineRows(
      [
        {
          id: "rtn-dashboard-refresh",
          enabled: true,
          trigger: { cron: "0 5 * * *", timezone: "Asia/Tokyo" },
          action: { kind: "job", job: "job-dashboard-build" },
        },
      ],
      [
        {
          version: 1,
          routine_id: "rtn-dashboard-refresh",
          scheduled_for: "2026-09-18T20:00:00.000Z",
          started_at: "2026-09-18T20:00:01Z",
          completed_at: "2026-09-18T20:00:02Z",
          result: "success",
          job_run_ids: ["JBR-dashboard-yesterday"],
        },
      ],
      new Date("2026-09-20T00:30:00Z"),
    );

    expect(rows.map((row) => [row.day, row.scheduledFor, row.result])).toEqual([
      ["昨日", "2026-09-18T20:00:00.000Z", "success"],
      ["本日", "2026-09-19T20:00:00.000Z", "未実行"],
    ]);
  });

  it("予定時刻が未到来なら予定、過ぎていて履歴がなければ未実行にする", () => {
    const rows = buildDailyRoutineRows(
      [
        {
          id: "rtn-grade-recheck",
          enabled: true,
          trigger: { cron: "0 6,18 * * *", timezone: "Asia/Tokyo" },
          action: { kind: "job", job: "job-grade-kata" },
        },
      ],
      [],
      new Date("2026-09-20T00:30:00Z"),
    );

    expect(rows.map((row) => [row.scheduledFor, row.result])).toEqual([
      ["2026-09-19T21:00:00.000Z", "未実行"],
      ["2026-09-20T09:00:00.000Z", "予定"],
    ]);
  });

  it("1 日に 3 回以上動く routine は最新の実行 1 行に実行回数をまとめる", () => {
    const history = ["05:00", "06:00", "07:00"].map((time, index) => ({
      version: 1 as const,
      routine_id: "rtn-dashboard-refresh",
      scheduled_for: `2026-09-19T${time}:00.000Z`,
      started_at: `2026-09-19T${time}:01Z`,
      completed_at: `2026-09-19T${time}:02Z`,
      result: index === 1 ? ("failure" as const) : ("success" as const),
      job_run_ids: [],
    }));
    const rows = collapseFrequentRoutineRows(
      buildDailyRoutineRows([], history, new Date("2026-09-19T08:30:00Z")),
    );

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      routineId: "rtn-dashboard-refresh",
      scheduledFor: "2026-09-19T07:00:00.000Z",
      runCount: 3,
      result: "failure",
    });
  });

  it("formatZonedDateTime は指定タイムゾーンの月日と時分だけを返す", () => {
    expect(formatZonedDateTime("2026-09-18T20:00:00.000Z", "Asia/Tokyo")).toBe("09-19 05:00");
    expect(formatZonedDateTime("not-a-date", "Asia/Tokyo")).toBe("not-a-date");
  });

  it("期日、優先度、関連 open PJR、登録日時の順で候補を並べる", () => {
    const candidate = (
      id: string,
      overrides: Partial<DashboardRegisterCandidate>,
    ): DashboardRegisterCandidate => ({
      id,
      title: id,
      type: "todo",
      priority: "medium",
      due: "2026-09-25",
      registeredAt: "2026-09-10T00:00:00Z",
      relatedOpenPjrCount: 0,
      ...overrides,
    });
    const ranked = rankRegisterCandidates(
      [
        candidate("PJR-0006", { registeredAt: "2026-09-09T00:00:00Z" }),
        candidate("PJR-0005", { registeredAt: "2026-09-08T00:00:00Z" }),
        candidate("PJR-0004", { relatedOpenPjrCount: 1 }),
        candidate("PJR-0003", { priority: "low" }),
        candidate("PJR-0002", { due: "2026-09-21", priority: "low" }),
        candidate("PJR-0001", { due: "2026-09-19", priority: "low" }),
      ],
      "2026-09-20",
    );

    expect(ranked.map((row) => row.id)).toEqual([
      "PJR-0001",
      "PJR-0002",
      "PJR-0005",
      "PJR-0006",
      "PJR-0004",
      "PJR-0003",
    ]);
  });

  it("waiting と blocked の最新理由を event から抽出する", () => {
    const waitReason = latestRegisterWaitReason([
      {
        v: 1,
        id: "reg_11111111111111111111111111111111",
        ts: "2026-09-18T00:00:00Z",
        action: "wait",
        actor: "agent",
        from_status: "open",
        to_status: "waiting",
        reason: "最初の待機理由",
        changes: [{ field: "status", from: "open", to: "waiting" }],
      },
      {
        v: 1,
        id: "reg_22222222222222222222222222222222",
        ts: "2026-09-19T00:00:00Z",
        action: "wait",
        actor: "agent",
        from_status: "in-progress",
        to_status: "waiting",
        reason: "最新の待機理由",
        changes: [{ field: "status", from: "in-progress", to: "waiting" }],
      },
    ]);
    const blockReasons = latestExecBlockReasons(
      ["T-BLOCKED"],
      [
        {
          v: 1,
          ts: "2026-09-18T00:00:00Z",
          type: "block",
          task_id: "T-BLOCKED",
          by: "agent",
          msg: "old",
        },
        {
          v: 1,
          ts: "2026-09-19T00:00:00Z",
          type: "block",
          task_id: "T-BLOCKED",
          by: "agent",
          msg: "latest",
        },
      ],
    );

    expect(waitReason).toBe("最新の待機理由");
    expect(blockReasons.get("T-BLOCKED")).toBe("latest");
  });
});

// ---- dashboardOutputFiles ----------------------------------------------------

describe("dashboardOutputFiles", () => {
  it("dashboard.md と Gantt SVG の 2 件を返す", () => {
    const paths: DashboardPaths = {
      projectId: "prj-0001",
      projectPath: "docs/ja/projects/prj-0001",
      timelinePath: "docs/ja/projects/prj-0001/timeline",
      executionGeneratedPath: "docs/ja/projects/prj-0001/execution/generated",
    };
    const files = dashboardOutputFiles(paths);
    expect(files).toHaveLength(2);
    expect(files.some((f) => f.endsWith("dashboard.md"))).toBe(true);
    expect(files.some((f) => f.endsWith("dashboard-timeline-gantt.svg"))).toBe(true);
  });
});

describe("computeRoutineDue", () => {
  const cronRoutine: RoutineDoc = {
    id: "rtn-dashboard-test",
    trigger: { cron: "* * * * *", timezone: "UTC" },
    action: { kind: "job", job: "job-dashboard-test" },
  };

  it("cron routine は last_scheduled_for より後の発火予定からdueを判定する", () => {
    const now = new Date("2026-01-05T00:02:30Z");
    expect(
      computeRoutineDue(
        cronRoutine,
        {
          last_run: "2026-01-05T00:02:00Z",
          last_scheduled_for: "2026-01-05T00:01:00Z",
        },
        true,
        now,
      ),
    ).toBe("due");
  });

  it("無効なroutineは実行履歴にかかわらずdisabledを返す", () => {
    expect(computeRoutineDue(cronRoutine, undefined, false, new Date("2026-01-05T00:02:30Z"))).toBe(
      "disabled",
    );
  });
});
