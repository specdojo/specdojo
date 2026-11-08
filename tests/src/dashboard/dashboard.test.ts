import { describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  aggregateActionRequired,
  buildDashboardMarkdown,
  buildDailyRoutineRows,
  buildExecRecordsMarkdown,
  buildRegisterCandidates,
  collectExecRecords,
  collapseFrequentRoutineRows,
  formatZonedDateTime,
  buildTimelineGanttSvg,
  computeRoutineDue,
  computeTimelineTrackSchedules,
  dashboardOutputFiles,
  latestExecBlockReasons,
  latestRegisterWaitReason,
  rankRegisterCandidates,
  sanitizeDashboardCell,
  type DashboardRegisterCandidate,
  type DashboardPaths,
  type TimelineTrackSchedule,
} from "../../../src/dashboard/dashboard.js";
import {
  addWorkingDaysToDate,
  countWorkingDaysBetween,
} from "../../../src/exec/schedule/calendar.js";
import type { ScheduleCalendar } from "../../../src/exec/types.js";
import type { TimelineIndex, TimelineTrackPlan } from "../../../src/dashboard/timeline-build.js";
import type { RoutineDoc } from "../../../src/routine/routine.js";
import type { RegisterItemView } from "../../../src/register/register.js";

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
    expect(svg).toContain("開始日を確定できる項目がありません");
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

// ---- exec records ------------------------------------------------------------

describe("collectExecRecords", () => {
  it("plan と result を stem ごとにまとめ、開始日時の新しい順に並べる", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-exec-records-"));

    try {
      const execPath = join(root, "exec");
      const run = (task: string, stem: string, file: string) => {
        const directory = join(root, "runs", "schedule", task, stem);
        mkdirSync(directory, { recursive: true });
        return join(directory, file);
      };
      writeFileSync(
        run("T-OLD", "t-old", "plan.md"),
        "---\nspecdojo:\n  task_id: T-OLD\n  mode: edit\n---\n\n# Plan\n",
        "utf8",
      );
      writeFileSync(
        run("T-OLD", "t-old", "result.md"),
        '---\nspecdojo:\n  task_id: T-OLD\n  mode: edit\n  status: complete\n  started_at: "2026-01-01T00:00:00Z"\n---\n\n# Result\n',
        "utf8",
      );
      writeFileSync(
        run("T-NEW", "t-new", "result.md"),
        '---\nspecdojo:\n  task_id: T-NEW\n  mode: review\n  status: doing\n  started_at: "2026-02-01T00:00:00Z"\n---\n\n# Result\n',
        "utf8",
      );
      writeFileSync(
        run("T-PLAN", "t-plan-only", "plan.md"),
        "---\nspecdojo:\n  task_id: T-PLAN\n---\n\n# Plan\n",
        "utf8",
      );

      const rows = collectExecRecords(execPath);

      expect(rows).toEqual([
        {
          stem: "runs/schedule/T-NEW/t-new",
          taskId: "T-NEW",
          mode: "review",
          status: "doing",
          startedAt: "2026-02-01T00:00:00Z",
          resultFile: "../runs/schedule/T-NEW/t-new/result.md",
        },
        {
          stem: "runs/schedule/T-OLD/t-old",
          taskId: "T-OLD",
          mode: "edit",
          status: "complete",
          startedAt: "2026-01-01T00:00:00Z",
          planFile: "../runs/schedule/T-OLD/t-old/plan.md",
          resultFile: "../runs/schedule/T-OLD/t-old/result.md",
        },
        {
          stem: "runs/schedule/T-PLAN/t-plan-only",
          taskId: "T-PLAN",
          planFile: "../runs/schedule/T-PLAN/t-plan-only/plan.md",
        },
      ]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("exec ディレクトリが無い場合は空配列を返す", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-exec-records-"));

    try {
      expect(collectExecRecords(join(root, "missing"))).toEqual([]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe("buildExecRecordsMarkdown", () => {
  it("plan と result へ generated からの相対リンクを張る", () => {
    const markdown = buildExecRecordsMarkdown("prj-test", [
      {
        stem: "t-a",
        taskId: "T-A",
        planFile: "../runs/schedule/T-A/t-a/plan.md",
        resultFile: "../runs/schedule/T-A/t-a/result.md",
      },
      { stem: "t-b", taskId: "T-B", planFile: "../runs/schedule/T-B/t-b/plan.md" },
    ]);

    expect(markdown).toContain("[plan](../runs/schedule/T-A/t-a/plan.md)");
    expect(markdown).toContain("[result](../runs/schedule/T-A/t-a/result.md)");
    expect(markdown).toContain(
      "| - | `T-B` | - | - | [plan](../runs/schedule/T-B/t-b/plan.md) | - |",
    );
    expect(markdown.endsWith("\n")).toBe(false);
  });
});

describe("sanitizeDashboardCell", () => {
  it("制御文字と ANSI を除去し、パイプをエスケープして長文を省略する", () => {
    const esc = String.fromCharCode(0x1b);
    const nul = String.fromCharCode(0);
    const reason = `${esc}[31mcheckpoint failed${esc}[0m: Preparing worktree\rUpdating files: 50%\n${nul}detail | ${"x".repeat(300)}`;

    const actual = sanitizeDashboardCell(reason);

    expect(actual).toContain(
      "checkpoint failed: Preparing worktree Updating files: 50% detail \\|",
    );
    expect(actual.endsWith("…")).toBe(true);
    expect(actual).not.toContain(esc);
    expect(actual).not.toMatch(/[\u0000-\u001f\u007f-\u009f]/u);
    expect(actual.replace(/\\\|/g, "")).not.toContain("|");
    expect(sanitizeDashboardCell("x".repeat(201))).toBe(`${"x".repeat(200)}…`);

    const tableRow = `| register | \`PJR-TEST\` | ${actual} | 再実行 |`;
    expect(tableRow.match(/(?<!\\)\|/gu)).toHaveLength(5);
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

  it("集約した routine に部分成功があれば partial を表示する", () => {
    const history = ["05:00", "06:00", "07:00"].map((time, index) => ({
      version: 1 as const,
      routine_id: "rtn-grade-recheck",
      scheduled_for: `2026-09-19T${time}:00.000Z`,
      started_at: `2026-09-19T${time}:01Z`,
      completed_at: `2026-09-19T${time}:02Z`,
      result: index === 1 ? ("partial" as const) : ("success" as const),
      job_run_ids: [],
    }));

    expect(
      collapseFrequentRoutineRows(
        buildDailyRoutineRows([], history, new Date("2026-09-19T08:30:00Z")),
      )[0]?.result,
    ).toBe("partial");
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
  it("dashboard.md・実行記録一覧・Gantt SVG・カタログ検出の 4 件を返す", () => {
    const paths: DashboardPaths = {
      projectId: "prj-0001",
      projectPath: "docs/ja/projects/prj-0001",
      timelinePath: "docs/ja/projects/prj-0001/timeline",
      executionGeneratedPath: "docs/ja/projects/prj-0001/execution/generated",
    };
    const files = dashboardOutputFiles(paths);
    expect(files).toHaveLength(4);
    expect(files.some((f) => f.endsWith("dashboard.md"))).toBe(true);
    expect(files.some((f) => f.endsWith("exec-records.md"))).toBe(true);
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

// ---- Action-first dashboard layout (PJR-0F94) --------------------------------

describe("PJR-0F94 action-first dashboard layout", () => {
  it("章の順序が指示どおり（人の対応、おすすめ、実行中epic、終わったepic、routine、Grade、全体集計、実行記録）である", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-dashboard-layout-"));

    try {
      const markdown = buildDashboardMarkdown({
        projectId: "prj-test",
        projectPath: join(root, "project"),
        timelinePath: join(root, "project", "timeline"),
        executionGeneratedPath: join(root, "project", "execution", "generated"),
      });

      const sectionHeaders = [
        "## 1. 人の対応が要るもの",
        "## 2. おすすめの登録項目",
        "## 3. 実行中の epic",
        "## 4. 終わった epic",
        "## 5. routine",
        "## 6. Grade",
        "## 7. 全体の集計",
        "## 8. 実行記録",
      ];

      let lastIndex = -1;
      for (const header of sectionHeaders) {
        const index = markdown.indexOf(header);
        expect(index, `見出し「${header}」が存在する`).toBeGreaterThan(-1);
        expect(index, `見出し「${header}」が前章より後にある`).toBeGreaterThan(lastIndex);
        lastIndex = index;
      }

      // 空リポジトリでは各章に「- ありません」が出ること
      expect(markdown).toContain("## 1. 人の対応が要るもの\n\n- ありません");
      expect(markdown).toContain("## 2. おすすめの登録項目\n\n- ありません");
      expect(markdown).toContain("## 3. 実行中の epic\n\n- ありません");
      expect(markdown).toContain("## 4. 終わった epic\n\n- ありません");
      expect(markdown).toContain("## 5. routine\n\n- ありません");
      expect(markdown).toContain("## 6. Grade\n\n- ありません");
      expect(markdown).toContain("## 7. 全体の集計\n\n- ありません");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("おすすめから先行の項目がそろわないものと deferred が外れ、done な依存を持つものと依存なしは残る", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-rec-test-"));

    try {
      const regDir = join(root, "controls", "project-register");
      mkdirSync(regDir, { recursive: true });

      const writeTicket = (id: string, fm: Record<string, unknown>) => {
        const fmLines = Object.entries(fm).map(([k, v]) => {
          if (Array.isArray(v)) {
            return `  ${k}:\n${v.map((item) => `    - ${item}`).join("\n")}`;
          }
          return `  ${k}: ${JSON.stringify(v)}`;
        });
        const content = `---\nspecdojo:\n  id: prj-test:${id.toLowerCase()}\n${fmLines.join("\n")}\n---\n\n# ${id} Title\n\nDesc\n`;
        writeFileSync(join(regDir, `${id.toLowerCase()}-topic.md`), content, "utf8");
      };

      // 依存先となる項目
      writeTicket("PJR-D001", { item_status: "done", item_type: "todo", priority: "medium" });
      writeTicket("PJR-D002", { item_status: "open", item_type: "todo", priority: "medium" });

      // おすすめ候補テスト項目
      // 1. 依存なし open todo -> 残る
      writeTicket("PJR-0001", { item_status: "open", item_type: "todo", priority: "high" });
      // 2. 完了した D001 に依存する open todo -> 残る
      writeTicket("PJR-0002", {
        item_status: "open",
        item_type: "todo",
        priority: "medium",
        depends_on: ["PJR-D001"],
      });
      // 3. 未完了の D002 に依存する open todo -> 外れる
      writeTicket("PJR-0003", {
        item_status: "open",
        item_type: "todo",
        priority: "medium",
        depends_on: ["PJR-D002"],
      });
      // 4. deferred の todo -> 外れる
      writeTicket("PJR-0004", { item_status: "deferred", item_type: "todo", priority: "high" });
      // 5. rejected の todo -> 外れる
      writeTicket("PJR-0005", { item_status: "rejected", item_type: "todo", priority: "high" });
      // 6. done の todo -> 外れる
      writeTicket("PJR-0006", { item_status: "done", item_type: "todo", priority: "high" });

      const candidates = buildRegisterCandidates({
        projectId: "prj-test",
        projectRegisterPath: regDir,
        pjrIndexPath: join(regDir, "pjr-index.md"),
        generatedPath: join(regDir, "generated"),
        controlsGeneratedPath: join(regDir, "generated"),
        registerDateTimeZone: "UTC",
      });

      const candidateIds = candidates.map((c) => c.id);
      expect(candidateIds).toContain("PJR-0001");
      expect(candidateIds).toContain("PJR-0002");
      expect(candidateIds).not.toContain("PJR-0003");
      expect(candidateIds).not.toContain("PJR-0004");
      expect(candidateIds).not.toContain("PJR-0005");
      expect(candidateIds).not.toContain("PJR-0006");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("人の対応が要るものに review と人の判断待ち（decision / question）、waiting、human schedule が抽出される", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-action-req-test-"));

    try {
      const regDir = join(root, "controls", "project-register");
      const genDir = join(root, "execution", "generated");
      mkdirSync(regDir, { recursive: true });
      mkdirSync(genDir, { recursive: true });

      const paths: DashboardPaths = {
        projectId: "prj-test",
        projectPath: root,
        timelinePath: join(root, "timeline"),
        executionGeneratedPath: genDir,
        registerPath: regDir,
        schedulePath: join(root, "schedule"),
      };

      // 1. ready.json に human タスクを作成
      writeFileSync(
        join(genDir, "ready.json"),
        JSON.stringify({
          schedule_path: "",
          execution_path: "",
          generated_dir: "",
          ready_count: 1,
          default_strategy: "critical-first",
          strategies: {
            "critical-first": { next_task_id: "T-HUMAN-01", ordered_task_ids: ["T-HUMAN-01"] },
            fifo: { next_task_id: "T-HUMAN-01", ordered_task_ids: ["T-HUMAN-01"] },
          },
          tasks: [
            {
              id: "T-HUMAN-01",
              name: "人手確定作業",
              execution: "human",
              fifo_rank: 1,
              critical_first_rank: 1,
              schedule_file: "sch.yaml",
            },
          ],
        }),
        "utf8",
      );

      const dummyView = (
        id: string,
        status: string,
        type: string,
        title: string,
      ): RegisterItemView => ({
        id,
        item: {
          id,
          status,
          type,
          title,
          description: "",
          owner: "-",
          registeredAt: "-",
          due: "-",
          completedAt: "-",
          conclusion: "-",
          ticket: `${id.toLowerCase()}.md`,
          priority: "medium",
        },
        ticketPath: join(regDir, `${id.toLowerCase()}.md`),
        source: "ticket",
      });

      const views: RegisterItemView[] = [
        dummyView("PJR-REV1", "review", "todo", "レビュー待ち項目"),
        dummyView("PJR-DEC1", "open", "decision", "方針決定待ち"),
        dummyView("PJR-QUE1", "open", "question", "要件確認待ち"),
        dummyView("PJR-WAI1", "waiting", "todo", "解除待ち項目"),
        dummyView("PJR-IGN1", "open", "todo", "通常 open 項目"),
      ];

      const rows = aggregateActionRequired(paths, views, new Map());

      expect(rows.map((r) => [r.kind, r.id, r.nextAction])).toEqual([
        ["review", "PJR-REV1", "close の確認待ち"],
        ["decision", "PJR-DEC1", "意思決定を行い状態を更新"],
        ["question", "PJR-QUE1", "回答・判断を行い状態を更新"],
        ["waiting", "PJR-WAI1", "待機理由の解消"],
        ["human", "T-HUMAN-01", "人手確定作業を実施"],
      ]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("完了した子項目や終わった epic、routine 定義、Grade 全体表、全体集計が ::: details で折りたたまれる", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-collapse-test-"));

    try {
      const regDir = join(root, "controls", "project-register");
      const genDir = join(root, "execution", "generated");
      const gradeDir = join(root, "execution", "grade", "results");
      const routinesDir = join(root, "routines");
      mkdirSync(regDir, { recursive: true });
      mkdirSync(genDir, { recursive: true });
      mkdirSync(gradeDir, { recursive: true });
      mkdirSync(routinesDir, { recursive: true });

      const paths: DashboardPaths = {
        projectId: "prj-test",
        projectPath: root,
        timelinePath: join(root, "timeline"),
        executionGeneratedPath: genDir,
        registerPath: regDir,
        gradeResultsPath: gradeDir,
        routinesPath: routinesDir,
      };

      // 終わった epic と実行中の epic の個票
      writeFileSync(
        join(regDir, "pjr-00e1-ep01.md"),
        "---\nspecdojo:\n  id: prj-test:pjr-00e1\n  item_status: done\n  item_type: epic\n  track: trk1\n---\n\n# PJR-00E1 完了したEpic\n",
        "utf8",
      );
      writeFileSync(
        join(regDir, "pjr-00e2-ep02.md"),
        "---\nspecdojo:\n  id: prj-test:pjr-00e2\n  item_status: open\n  item_type: epic\n  track: trk2\n---\n\n# PJR-00E2 実行中のEpic\n",
        "utf8",
      );
      // 実行中 epic の完了した子項目
      writeFileSync(
        join(regDir, "pjr-00c1-ch01.md"),
        "---\nspecdojo:\n  id: prj-test:pjr-00c1\n  item_status: done\n  item_type: todo\n  derived_from:\n    - PJR-00E2\n---\n\n# PJR-00C1 完了子項目\n",
        "utf8",
      );

      // routine 定義
      writeFileSync(
        join(routinesDir, "rtn-test.yaml"),
        "id: rtn-test\nname: テストルーチン\nenabled: true\ntrigger:\n  cron: '0 0 * * *'\n",
        "utf8",
      );

      // Grade 結果
      writeFileSync(
        join(gradeDir, "res1.yaml"),
        [
          "version: 1",
          "document: prj-test:doc-a",
          "path: docs/doc-a.md",
          "target: deliverable",
          "rubric: grade-rubric-v1",
          "verdict: pass",
          "score: 95",
          'graded_at: "2026-09-20T00:00:00.000Z"',
          "graded_by: executor",
          `content_hash: "${"0".repeat(64)}"`,
          "categories:",
          "  quality:",
          "    score: 95",
          "viewpoints:",
          "  vp-test:",
          "    level: 4",
          "    score: 95",
          "finding_counts:",
          "  blocker: 0",
          "  major: 0",
          "  minor: 0",
          "  note: 0",
          "findings: []",
          "",
        ].join("\n"),
        "utf8",
      );

      // Schedule state
      writeFileSync(
        join(genDir, "state.json"),
        JSON.stringify({
          schedule_path: "",
          tasks: { "T-1": { state: "done" } },
        }),
        "utf8",
      );

      const markdown = buildDashboardMarkdown(paths);

      // 1. 完了した子項目の折りたたみ
      expect(markdown).toContain("::: details 完了した子項目（1件）");
      // 2. 終わった epic の折りたたみ
      expect(markdown).toContain("::: details 終わった epic の一覧（1件）");
      // 3. routine 定義一覧の折りたたみ
      expect(markdown).toContain("::: details routine 定義一覧（1件）");
      // 4. Grade 全体の表の折りたたみ
      expect(markdown).toContain("::: details 全体の表（1件）");
      // 5. 全体の集計の折りたたみ
      expect(markdown).toContain("::: details 全体の集計");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("実行中の epic と終わった epic に開始日・終了日・稼働日数が表示される", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-epic-dates-test-"));

    try {
      const regDir = join(root, "controls", "project-register");
      mkdirSync(regDir, { recursive: true });

      const paths: DashboardPaths = {
        projectId: "prj-test",
        projectPath: root,
        timelinePath: join(root, "timeline"),
        executionGeneratedPath: join(root, "execution", "generated"),
        registerPath: regDir,
      };

      // 1. 完了した epic（開始日・終了日・稼働日数が計算できるもの）
      writeFileSync(
        join(regDir, "pjr-00e1-done.md"),
        [
          "---",
          "specdojo:",
          "  id: prj-test:pjr-00e1",
          "  item_status: done",
          "  item_type: epic",
          "  track: trk1",
          '  start_on: "2026-01-05"',
          '  completed_at: "2026-01-09T00:00:00Z"',
          "---",
          "",
          "# PJR-00E1 完了Epic",
          "",
        ].join("\n"),
        "utf8",
      );

      // 2. 実行中の epic（開始日のみで期限なし）
      writeFileSync(
        join(regDir, "pjr-00e2-open.md"),
        [
          "---",
          "specdojo:",
          "  id: prj-test:pjr-00e2",
          "  item_status: in-progress",
          "  item_type: epic",
          "  track: trk2",
          '  start_on: "2026-01-12"',
          "---",
          "",
          "# PJR-00E2 実行中Epic",
          "",
        ].join("\n"),
        "utf8",
      );

      // 3. 実行中の epic（開始日・終了日がそろっているもの）
      writeFileSync(
        join(regDir, "pjr-00e3-open.md"),
        [
          "---",
          "specdojo:",
          "  id: prj-test:pjr-00e3",
          "  item_status: open",
          "  item_type: epic",
          "  track: trk3",
          '  start_on: "2026-01-12"',
          '  due_on: "2026-01-16"',
          "---",
          "",
          "# PJR-00E3 期限あり実行中Epic",
          "",
        ].join("\n"),
        "utf8",
      );

      const markdown = buildDashboardMarkdown(paths);

      // 終わった epic の表ヘッダーと行
      expect(markdown).toContain("| id | title | track | 開始日 | 終了日 | 稼働日数 |");
      expect(markdown).toContain(
        "| [PJR-00E1](../../controls/project-register/pjr-00e1-done.md) | 完了Epic | `trk1` | 2026-01-05 | 2026-01-09 | 5 |",
      );

      // 実行中の epic
      // 期限なし: 開始日はあり、終了日は未定、稼働日数は -
      expect(markdown).toContain(
        "### [PJR-00E2](../../controls/project-register/pjr-00e2-open.md) 実行中Epic",
      );
      expect(markdown).toContain("- 開始日: 2026-01-12\n- 終了日: 未定\n- 稼働日数: -");

      // 期限あり: 開始日・終了日・稼働日数がそろう
      expect(markdown).toContain(
        "### [PJR-00E3](../../controls/project-register/pjr-00e3-open.md) 期限あり実行中Epic",
      );
      expect(markdown).toContain("- 開始日: 2026-01-12\n- 終了日: 2026-01-16\n- 稼働日数: 5");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
