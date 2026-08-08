import { describe, expect, it } from "vitest";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  buildExecAutoArgs,
  buildExecResumeArgs,
  buildJobRunArgs,
  buildRegisterRunArgs,
  cronOccurrences,
  formatRoutineLastRun,
  isRoutineDue,
  isoWeek,
  loadRoutines,
  parseIntervalMs,
  parseRoutineDoc,
  selectRegisterItems,
  type RoutineDoc,
} from "../../src/routine.js";
import type { PjrItem } from "../../src/register.js";

function makeRoutine(overrides: Partial<RoutineDoc> = {}): RoutineDoc {
  return {
    id: "rtn-sample",
    interval: "1d",
    action: { kind: "exec-auto" },
    ...overrides,
  };
}

function makeItem(overrides: Partial<PjrItem> = {}): PjrItem {
  return {
    id: "PJR-0001",
    status: "open",
    title: "サンプル項目",
    description: "説明",
    type: "todo",
    priority: "high",
    owner: "ARC",
    registered: "_TODO_",
    due: "-",
    completed: "-",
    conclusion: "-",
    ticket: "-",
    ...overrides,
  };
}

describe("parseIntervalMs", () => {
  it("m / h / d / w の単位をミリ秒へ変換する", () => {
    expect(parseIntervalMs("30m")).toBe(30 * 60_000);
    expect(parseIntervalMs("6h")).toBe(6 * 3_600_000);
    expect(parseIntervalMs("1d")).toBe(86_400_000);
    expect(parseIntervalMs("2w")).toBe(2 * 604_800_000);
  });

  it("不正な形式はエラーを投げる", () => {
    expect(() => parseIntervalMs("0m")).toThrow(/Invalid interval/);
    expect(() => parseIntervalMs("1x")).toThrow(/Invalid interval/);
    expect(() => parseIntervalMs("daily")).toThrow(/Invalid interval/);
  });
});

describe("isRoutineDue", () => {
  const now = new Date("2026-07-10T12:00:00Z");

  it("last_run が無ければ due になる", () => {
    expect(isRoutineDue(makeRoutine(), undefined, now)).toBe(true);
  });

  it("interval 経過後は due になる", () => {
    expect(isRoutineDue(makeRoutine({ interval: "1d" }), "2026-07-09T12:00:00Z", now)).toBe(true);
  });

  it("interval 未経過なら due にならない", () => {
    expect(isRoutineDue(makeRoutine({ interval: "1d" }), "2026-07-09T12:00:01Z", now)).toBe(false);
  });

  it("不正な last_run は due として扱う", () => {
    expect(isRoutineDue(makeRoutine(), "not-a-date", now)).toBe(true);
  });
});

describe("parseRoutineDoc", () => {
  it("register kind の妥当な定義を受け入れる", () => {
    const { doc, errors } = parseRoutineDoc(
      {
        id: "rtn-daily-sweep",
        name: "日次スイープ",
        enabled: true,
        interval: "1d",
        action: {
          kind: "register",
          filter: { types: ["todo"], priorities: ["high"], statuses: ["open"] },
          limit: 3,
        },
      },
      "rtn-daily-sweep.yaml",
    );

    expect(errors).toEqual([]);
    expect(doc).toEqual({
      id: "rtn-daily-sweep",
      name: "日次スイープ",
      enabled: true,
      interval: "1d",
      action: {
        kind: "register",
        filter: { types: ["todo"], priorities: ["high"], statuses: ["open"] },
        limit: 3,
      },
    });
  });

  it("id とファイル名の不一致を検出する", () => {
    const { doc, errors } = parseRoutineDoc(
      { id: "rtn-other", interval: "1d", action: { kind: "exec-auto" } },
      "rtn-daily.yaml",
    );

    expect(doc).toBeUndefined();
    expect(errors).toEqual([
      'rtn-daily.yaml: id "rtn-other" must match the file name base "rtn-daily"',
    ]);
  });

  it("不正な interval と未知の kind をファイル名つきで報告する", () => {
    const { errors } = parseRoutineDoc(
      { id: "rtn-bad", interval: "daily", action: { kind: "cron" } },
      "rtn-bad.yaml",
    );

    expect(errors.some((e) => e.includes("Invalid interval"))).toBe(true);
    expect(errors.some((e) => e.includes("action.kind"))).toBe(true);
    expect(errors.every((e) => e.startsWith("rtn-bad.yaml: "))).toBe(true);
  });

  it("filter の未知の値を報告する", () => {
    const { errors } = parseRoutineDoc(
      {
        id: "rtn-bad-filter",
        interval: "1d",
        action: { kind: "register", filter: { types: ["epic"] } },
      },
      "rtn-bad-filter.yaml",
    );

    expect(errors).toEqual([
      'rtn-bad-filter.yaml: action.filter.types contains unknown value "epic". Allowed: todo, question, risk, issue, change-request, decision, note',
    ]);
  });
});

describe("selectRegisterItems", () => {
  const items: PjrItem[] = [
    makeItem({ id: "PJR-0003", type: "todo", priority: "low" }),
    makeItem({ id: "PJR-0001", type: "todo", priority: "high" }),
    makeItem({ id: "PJR-0002", type: "issue", priority: "high" }),
    makeItem({ id: "PJR-0004", type: "note", priority: "high" }),
    makeItem({ id: "PJR-0005", type: "todo", priority: "high", status: "done" }),
    makeItem({ id: "PJR-0006", type: "todo", priority: "high", status: "waiting" }),
  ];

  it("既定では open かつ実行可能 type の項目を ID 昇順で返す", () => {
    const actual = selectRegisterItems(items, { kind: "register" });

    expect(actual.map((item) => item.id)).toEqual(["PJR-0001", "PJR-0002", "PJR-0003"]);
  });

  it("types / priorities / statuses / limit で絞り込む", () => {
    const actual = selectRegisterItems(items, {
      kind: "register",
      filter: { types: ["todo"], priorities: ["high"], statuses: ["open", "waiting"] },
      limit: 1,
    });

    expect(actual.map((item) => item.id)).toEqual(["PJR-0001"]);
  });

  it("実行対象外 type は filter に含まれていても選ばない", () => {
    const actual = selectRegisterItems(items, {
      kind: "register",
      filter: { types: ["note"] },
    });

    expect(actual).toEqual([]);
  });
});

describe("buildExecAutoArgs", () => {
  it("最小構成で --if-busy skip を渡す", () => {
    expect(buildExecAutoArgs({ kind: "exec-auto" }, "prj-test")).toEqual([
      "exec",
      "run",
      "--auto",
      "--project",
      "prj-test",
      "--if-busy",
      "skip",
    ]);
  });

  it("strategy / parallel / loop / max_rounds をオプションへ変換する", () => {
    const actual = buildExecAutoArgs(
      { kind: "exec-auto", strategy: "fifo", parallel: 2, loop: true, max_rounds: 3 },
      "prj-test",
    );

    expect(actual).toEqual([
      "exec",
      "run",
      "--auto",
      "--project",
      "prj-test",
      "--if-busy",
      "skip",
      "--strategy",
      "fifo",
      "--parallel",
      "2",
      "--loop",
      "--max-rounds",
      "3",
    ]);
  });

  it("loop なしの max_rounds は引数に含めない", () => {
    const actual = buildExecAutoArgs({ kind: "exec-auto", max_rounds: 3 }, "prj-test");

    expect(actual).toEqual(["exec", "run", "--auto", "--project", "prj-test", "--if-busy", "skip"]);
  });
});

describe("buildExecResumeArgs", () => {
  it("due な延期 task の再開コマンドへ変換する", () => {
    expect(buildExecResumeArgs({ kind: "exec-resume", parallel: 2 }, "prj-test")).toEqual([
      "exec",
      "resume",
      "--due",
      "--project",
      "prj-test",
      "--if-busy",
      "skip",
      "--parallel",
      "2",
    ]);
  });
});

describe("buildRegisterRunArgs", () => {
  it("register 実行へ --if-busy skip を渡す", () => {
    expect(buildRegisterRunArgs("PJR-0001", "prj-test")).toEqual([
      "exec",
      "run",
      "--register",
      "PJR-0001",
      "--project",
      "prj-test",
      "--if-busy",
      "skip",
    ]);
  });
});

describe("cron Job routine", () => {
  it("calculates a weekly occurrence in the configured timezone", () => {
    const doc = makeRoutine({
      interval: undefined,
      trigger: { cron: "0 17 * * 5", timezone: "Asia/Tokyo" },
      action: { kind: "job", job: "job-weekly-report" },
    });
    const occurrences = cronOccurrences(
      doc,
      "2026-08-06T08:00:00Z",
      new Date("2026-08-07T08:02:00Z"),
    );
    expect(occurrences.map((date) => date.toISOString())).toEqual(["2026-08-07T08:00:00.000Z"]);
    expect(isoWeek(occurrences[0], "Asia/Tokyo")).toBe("2026-W32");
  });

  it("builds exec run --job arguments with occurrence inputs", () => {
    expect(
      buildJobRunArgs(
        {
          kind: "job",
          job: "job-weekly-report",
          inputs: { period: "{{scheduled_at | iso_week}}" },
        },
        "prj-test",
        new Date("2026-08-07T08:00:00Z"),
        "Asia/Tokyo",
      ),
    ).toEqual([
      "exec",
      "run",
      "--job",
      "job-weekly-report",
      "--project",
      "prj-test",
      "--scheduled-at",
      "2026-08-07T08:00:00.000Z",
      "--job-trigger",
      "routine",
      "--if-busy",
      "skip",
      "--input",
      "period=2026-W32",
    ]);
  });
});

describe("formatRoutineLastRun", () => {
  it("skipped を failure と区別して表示する", () => {
    expect(formatRoutineLastRun({ last_run: "2026-08-07T03:17:09Z", last_result: "skipped" })).toBe(
      "2026-08-07T03:17:09Z (skipped)",
    );
  });
});

describe("loadRoutines", () => {
  it("rtn-*.yaml をソート順に読み込み、不正ファイルと id 重複をエラーへ集約する", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-routine-"));

    try {
      await writeFile(
        path.join(dir, "rtn-b-auto.yaml"),
        "id: rtn-b-auto\ninterval: 6h\naction:\n  kind: exec-auto\n",
        "utf8",
      );
      await writeFile(
        path.join(dir, "rtn-a-sweep.yaml"),
        "id: rtn-a-sweep\ninterval: 1d\naction:\n  kind: register\n",
        "utf8",
      );
      await writeFile(
        path.join(dir, "rtn-broken.yaml"),
        "id: rtn-broken\naction:\n  kind: exec-auto\n",
        "utf8",
      );
      await writeFile(
        path.join(dir, "rtn-a-sweep.yml"),
        "id: rtn-a-sweep\ninterval: 1d\naction:\n  kind: register\n",
        "utf8",
      );
      await writeFile(path.join(dir, "notes.md"), "# not a routine\n", "utf8");

      const { routines, errors } = loadRoutines(dir);

      expect(routines.map((entry) => entry.doc.id)).toEqual(["rtn-a-sweep", "rtn-b-auto"]);
      expect(
        errors.some((e) => e.startsWith("rtn-broken.yaml: interval or trigger is required")),
      ).toBe(true);
      expect(
        errors.some(
          (e) => e.includes("rtn-a-sweep.yml") && e.includes('duplicate routine id "rtn-a-sweep"'),
        ),
      ).toBe(true);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
