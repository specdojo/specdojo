import { describe, expect, it } from "vitest";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  aggregateRoutineActionResults,
  buildJobRunArgs,
  cronOccurrences,
  executeRoutineActions,
  formatRoutineLastRun,
  isRoutineDue,
  isoWeek,
  loadRoutines,
  parseIntervalMs,
  parseRoutineDoc,
  routineActionKindLabel,
  type RoutineDoc,
} from "../../src/routine.js";

function makeRoutine(overrides: Partial<RoutineDoc> = {}): RoutineDoc {
  return {
    id: "rtn-sample",
    interval: "1d",
    action: { kind: "job", job: "job-sample" },
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
  it("job kind の妥当な定義を受け入れる", () => {
    const { doc, errors } = parseRoutineDoc(
      {
        id: "rtn-daily-sweep",
        name: "日次スイープ",
        enabled: true,
        interval: "1d",
        action: {
          kind: "job",
          job: "job-register-sweep",
          inputs: { types: "todo", priorities: "high", statuses: "open", limit: "3" },
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
        kind: "job",
        job: "job-register-sweep",
        inputs: { types: "todo", priorities: "high", statuses: "open", limit: "3" },
      },
    });
  });

  it("id とファイル名の不一致を検出する", () => {
    const { doc, errors } = parseRoutineDoc(
      { id: "rtn-other", interval: "1d", action: { kind: "job", job: "job-auto" } },
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

  it("旧 action kind を拒否して Job への移行を要求する", () => {
    const { errors } = parseRoutineDoc(
      {
        id: "rtn-legacy",
        interval: "1d",
        action: { kind: "exec-auto" },
      },
      "rtn-legacy.yaml",
    );

    expect(errors).toEqual([
      'rtn-legacy.yaml: action.kind must be job (got "exec-auto")',
      "rtn-legacy.yaml: action.job must match job-<slug>",
    ]);
  });

  it("action の配列を受け入れ、段ごとの引数を保持する", () => {
    const { doc, errors } = parseRoutineDoc(
      {
        id: "rtn-sequential",
        interval: "1d",
        action: [
          { kind: "job", job: "job-first", inputs: { mode: "fifo" } },
          { kind: "job", job: "job-second", inputs: { mode: "critical-first" } },
          { kind: "job", job: "job-final-check", inputs: { mode: "strict" } },
        ],
      },
      "rtn-sequential.yaml",
    );

    expect(errors).toEqual([]);
    expect(doc?.action).toEqual([
      { kind: "job", job: "job-first", inputs: { mode: "fifo" } },
      { kind: "job", job: "job-second", inputs: { mode: "critical-first" } },
      { kind: "job", job: "job-final-check", inputs: { mode: "strict" } },
    ]);
  });

  it("空の action 配列と不正な段を段番号つきで報告する", () => {
    const empty = parseRoutineDoc(
      { id: "rtn-empty", interval: "1d", action: [] },
      "rtn-empty.yaml",
    );
    const invalid = parseRoutineDoc(
      {
        id: "rtn-invalid-step",
        interval: "1d",
        action: [{ kind: "job", job: "job-first" }, { kind: "unknown" }],
      },
      "rtn-invalid-step.yaml",
    );

    expect(empty.errors).toContain("rtn-empty.yaml: action must contain at least one action");
    expect(invalid.errors).toContain(
      'rtn-invalid-step.yaml: action[1].kind must be job (got "unknown")',
    );
  });

  it("取りこぼした cron 枠を実行しない policy を受け入れる", () => {
    const { doc, errors } = parseRoutineDoc(
      {
        id: "rtn-nightly",
        trigger: { cron: "0 2 * * *", timezone: "Asia/Tokyo" },
        policy: { missed_run: "skip", overlap: "skip" },
        action: { kind: "job", job: "job-nightly" },
      },
      "rtn-nightly.yaml",
    );

    expect(errors).toEqual([]);
    expect(doc?.policy).toEqual({ missed_run: "skip", overlap: "skip" });
  });
});

describe("aggregateRoutineActionResults", () => {
  it("failure、skipped、success の優先順で全体結果を返す", () => {
    expect(aggregateRoutineActionResults(["success", "success"])).toBe("success");
    expect(aggregateRoutineActionResults(["success", "skipped"])).toBe("skipped");
    expect(aggregateRoutineActionResults(["skipped", "failure", "success"])).toBe("failure");
  });
});

describe("routineActionKindLabel", () => {
  it("単一 kind と配列の実行順を表示する", () => {
    expect(routineActionKindLabel({ kind: "job", job: "job-first" })).toBe("job");
    expect(
      routineActionKindLabel([
        { kind: "job", job: "job-first" },
        { kind: "job", job: "job-second" },
      ]),
    ).toBe("job -> job");
  });
});

describe("executeRoutineActions", () => {
  it("失敗後も action を定義順に実行して段別結果を返す", () => {
    const executed: string[] = [];
    const results = executeRoutineActions(
      [
        { kind: "job", job: "job-first" },
        { kind: "job", job: "job-second" },
        { kind: "job", job: "job-check" },
      ],
      (action, index) => {
        executed.push(`${index}:${action.kind}`);
        return index === 1 ? "failure" : "success";
      },
    );

    expect(executed).toEqual(["1:job", "2:job", "3:job"]);
    expect(results).toEqual([
      { index: 1, kind: "job", result: "failure" },
      { index: 2, kind: "job", result: "success" },
      { index: 3, kind: "job", result: "success" },
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

  it("skips missed occurrences and selects only the current matching minute", () => {
    const doc = makeRoutine({
      interval: undefined,
      trigger: { cron: "0 2 * * *", timezone: "Asia/Tokyo" },
      policy: { missed_run: "skip" },
    });

    expect(cronOccurrences(doc, "2026-08-06T17:00:00Z", new Date("2026-08-08T03:00:00Z"))).toEqual(
      [],
    );
    expect(
      cronOccurrences(doc, "2026-08-06T17:00:00Z", new Date("2026-08-08T17:00:30Z")).map((date) =>
        date.toISOString(),
      ),
    ).toEqual(["2026-08-08T17:00:00.000Z"]);
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
        "id: rtn-b-auto\ninterval: 6h\naction:\n  kind: job\n  job: job-auto\n",
        "utf8",
      );
      await writeFile(
        path.join(dir, "rtn-a-sweep.yaml"),
        "id: rtn-a-sweep\ninterval: 1d\naction:\n  kind: job\n  job: job-sweep\n",
        "utf8",
      );
      await writeFile(
        path.join(dir, "rtn-broken.yaml"),
        "id: rtn-broken\naction:\n  kind: job\n  job: job-broken\n",
        "utf8",
      );
      await writeFile(
        path.join(dir, "rtn-a-sweep.yml"),
        "id: rtn-a-sweep\ninterval: 1d\naction:\n  kind: job\n  job: job-sweep\n",
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
