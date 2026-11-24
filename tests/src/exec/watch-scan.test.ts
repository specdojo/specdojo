import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import type { QueueRecord } from "../../../src/exec/queue.js";
import type { StallObservation } from "../../../src/exec/watch-scan-classify.js";
import {
  collectQueueObservations,
  collectRegisterObservations,
  diffWatchScan,
  parseWatchLog,
  readRunLogs,
  renderWatchReport,
  reportDate,
  runWatchScan,
  type WatchScanContext,
} from "../../../src/exec/watch-scan.js";
import type { PjrItem } from "../../../src/register/item.js";

const NOW = "2026-11-14T00:00:00Z";

function limitObservation(since = "2026-11-13T14:23:56Z"): StallObservation {
  return {
    kind: "schedule-task",
    id: "T-KATA-WAVE-1-dct-index-040",
    state: "deferred",
    since,
    message: { source: "events/block.json", text: "quota_exhausted reached" },
    meta: { limit_kind: "quota_exhausted" },
    logs: [],
  };
}

describe("diffWatchScan", () => {
  it("appends one stalled line for a newly found stall", () => {
    const actual = diffWatchScan([], [limitObservation()], NOW);

    expect(actual.appended).toMatchObject([
      {
        v: 1,
        ts: NOW,
        event: "stalled",
        key: "schedule-task:T-KATA-WAVE-1-dct-index-040:deferred:2026-11-13T14:23:56Z",
        target: { kind: "schedule-task", id: "T-KATA-WAVE-1-dct-index-040" },
        state: "deferred",
        since: "2026-11-13T14:23:56Z",
        category: "usage_limit",
        detail: "quota_exhausted",
        basis: { source: "events/block.json", excerpt: "limit_kind=quota_exhausted" },
        by: "watch-scan",
      },
    ]);
    expect(actual.appended[0]).toHaveProperty("next_action");
    expect((actual.appended[0] as { next_action: string }).next_action).toContain("exec resume");
  });

  it("does not append the same stall again on the next scan", () => {
    const first = diffWatchScan([], [limitObservation()], NOW);

    const second = diffWatchScan(first.appended, [limitObservation()], "2026-11-14T00:30:00Z");

    expect(second.appended).toEqual([]);
    expect(second.current.map((line) => line.ts)).toEqual([NOW]);
  });

  it("appends a cleared line once the stall is no longer found", () => {
    const first = diffWatchScan([], [limitObservation()], NOW);

    const second = diffWatchScan(first.appended, [], "2026-11-14T00:30:00Z");

    expect(second.appended).toEqual([
      {
        v: 1,
        ts: "2026-11-14T00:30:00Z",
        event: "cleared",
        key: first.appended[0]!.key,
        target: { kind: "schedule-task", id: "T-KATA-WAVE-1-dct-index-040" },
        by: "watch-scan",
      },
    ]);
  });

  it("records the task again when it stalls from a new event", () => {
    const first = diffWatchScan([], [limitObservation()], NOW);

    const second = diffWatchScan(
      first.appended,
      [limitObservation("2026-11-13T20:00:00Z")],
      "2026-11-14T00:30:00Z",
    );

    expect(second.appended.map((line) => line.event)).toEqual(["stalled", "cleared"]);
  });
});

describe("parseWatchLog", () => {
  it("skips broken lines and reports their line numbers", () => {
    const valid = JSON.stringify({
      v: 1,
      ts: NOW,
      event: "cleared",
      key: "queue:q:stopped:x",
      target: { kind: "queue", id: "q" },
      by: "watch-scan",
    });

    const actual = parseWatchLog(`${valid}\n{broken\n{"v":2}\n`, "watch-events.jsonl");

    expect(actual.lines).toHaveLength(1);
    expect(actual.warnings).toEqual([
      "watch-events.jsonl:2: invalid JSON",
      "watch-events.jsonl:3: not a watch-scan line",
    ]);
  });
});

describe("renderWatchReport", () => {
  it("lists each stall with its category, basis, and next action", () => {
    const { current } = diffWatchScan([], [limitObservation()], NOW);

    const actual = renderWatchReport({
      projectId: "prj-0001",
      date: "2026-11-14",
      scannedAt: NOW,
      current,
      clearedToday: [],
      warnings: [],
    });

    expect(actual).toContain("id: prj-0001:watch-scan-report-20261114");
    expect(actual).toContain("- 使用量の上限（`usage_limit`）: 1");
    expect(actual).toContain("### 2.1. 使用量の上限");
    expect(actual).toContain("  - 根拠: `events/block.json` の `limit_kind=quota_exhausted`");
    expect(actual).toContain("  - 次にすべきこと: 解除の時刻を待って");
  });

  it("replaces backticks in an excerpt so the inline code stays closed", () => {
    const observation: StallObservation = {
      ...limitObservation(),
      meta: {},
      message: { source: "events/block.json", text: "agent-config-write: `package.json`" },
    };
    const { current } = diffWatchScan([], [observation], NOW);

    const actual = renderWatchReport({
      projectId: "prj-0001",
      date: "2026-11-14",
      scannedAt: NOW,
      current,
      clearedToday: [],
      warnings: [],
    });

    expect(actual).toContain("`agent-config-write: 'package.json'`");
  });
});

describe("reportDate", () => {
  it("uses the given time zone for the report date", () => {
    expect(reportDate(new Date("2026-11-13T23:30:00Z"), "Asia/Tokyo")).toBe("2026-11-14");
  });
});

describe("watch-scan file readers", () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "specdojo-watch-scan-"));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  function context(): WatchScanContext {
    return {
      root: dir,
      executionPath: path.join(dir, "execution"),
      now: new Date(NOW),
      staleMs: 2 * 3_600_000,
      runLive: false,
    };
  }

  it("reads the last failed attempt of each check and the integrate log, not the executor log", async () => {
    const runDir = path.join(dir, "run");
    await mkdir(runDir, { recursive: true });
    await writeFile(
      path.join(runDir, "parent-validation-attempt-1-test-unit.log"),
      "exit code: 1\nold",
      "utf8",
    );
    await writeFile(
      path.join(runDir, "parent-validation-attempt-2-test-unit.log"),
      "exit code: 1\nnew",
      "utf8",
    );
    await writeFile(
      path.join(runDir, "parent-validation-attempt-1-lint-md.log"),
      "exit code: 0\n",
      "utf8",
    );
    await writeFile(path.join(runDir, "integrate.log"), "commit-scope: ok", "utf8");
    await writeFile(path.join(runDir, "executor.log"), "rate limit reached", "utf8");

    const actual = readRunLogs(runDir, dir);

    expect(actual.map((log) => log.source)).toEqual([
      "run/parent-validation-attempt-2-test-unit.log",
      "run/integrate.log",
    ]);
  });

  it("finds waiting and review register items and skips a fresh in-progress item", async () => {
    const registerPath = path.join(dir, "register");
    await mkdir(path.join(registerPath, "events"), { recursive: true });
    await writeFile(
      path.join(registerPath, "events", "pjr-aaaa.yaml"),
      [
        "- v: 1",
        "  id: reg_00000000000000000000000000000001",
        '  ts: "2026-11-13T15:00:00Z"',
        "  action: wait",
        "  actor: sol-executor",
        "  from_status: in-progress",
        "  to_status: waiting",
        "  reason: rate limit reached",
        "  changes:",
        "    - field: status",
        "      from: in-progress",
        "      to: waiting",
        "",
      ].join("\n"),
      "utf8",
    );
    const items = [
      { id: "PJR-AAAA", status: "waiting", registeredAt: "2026-11-13T00:00:00Z" },
      { id: "PJR-BBBB", status: "in-progress", registeredAt: "2026-11-13T23:30:00Z" },
      { id: "PJR-CCCC", status: "open", registeredAt: "2026-11-13T00:00:00Z" },
    ] as PjrItem[];

    const actual = collectRegisterObservations(items, registerPath, context());

    expect(actual).toEqual([
      {
        kind: "register-item",
        id: "PJR-AAAA",
        state: "waiting",
        since: "2026-11-13T15:00:00Z",
        actor: "sol-executor",
        message: { source: "register/events/pjr-aaaa.yaml", text: "rate limit reached" },
        logs: [],
      },
    ]);
  });

  it("finds a stopped queue and a running queue whose lock is gone", () => {
    const base = {
      version: 1,
      project_id: "prj-0001",
      created_at: "2026-11-13T00:00:00Z",
      steps: [
        {
          index: 1,
          kind: "exec-run",
          argv: ["exec", "run", "--register", "PJR-QTZ7"],
          on_failure: "stop",
          status: "failed",
          summary: "exit code 1",
        },
      ],
    } as const;
    const records = [
      {
        ...base,
        queue_id: "stopped-q",
        updated_at: "2026-11-13T21:00:00Z",
        state: "stopped",
        stopped_step: 1,
        reason: "step 1 failed: exit code 1",
      },
      { ...base, queue_id: "running-q", updated_at: "2026-11-13T20:00:00Z", state: "running" },
      { ...base, queue_id: "live-q", updated_at: "2026-11-13T20:00:00Z", state: "running" },
    ] as unknown as QueueRecord[];

    const actual = collectQueueObservations(records, context(), (id) => id === "live-q");

    expect(actual.map((item) => [item.id, item.state, item.interrupted ?? false])).toEqual([
      ["stopped-q", "stopped", false],
      ["running-q", "running", true],
    ]);
    expect(actual[0]!.message?.text.split("\n")[0]).toBe(
      "step 1 (exec-run): specdojo exec run --register PJR-QTZ7",
    );
  });

  it("writes the log once per stall and rewrites the morning report on each scan", async () => {
    const registerPath = path.join(dir, "register");
    await mkdir(path.join(registerPath, "events"), { recursive: true });
    const items = [
      { id: "PJR-DDDD", status: "review", registeredAt: "2026-11-13T00:00:00Z" },
    ] as PjrItem[];
    const input = {
      projectId: "prj-test",
      root: dir,
      executionPath: path.join(dir, "execution"),
      register: { items, projectRegisterPath: registerPath },
      timeZone: "Asia/Tokyo",
      now: new Date(NOW),
      staleMs: 2 * 3_600_000,
      dryRun: false,
    };

    const first = runWatchScan(input);
    const second = runWatchScan({ ...input, now: new Date("2026-11-14T00:30:00Z") });

    const log = await readFile(first.logPath, "utf8");
    expect(log.trim().split("\n")).toHaveLength(1);
    expect(second.appended).toEqual([]);
    expect(path.relative(dir, second.reportPath)).toBe(
      path.join("execution", "reports", "watch-scan", "watch-scan-20261114.md"),
    );
    const report = await readFile(second.reportPath, "utf8");
    expect(report).toContain("- 最後に見た時刻: `2026-11-14T00:30:00Z`");
    expect(report).toContain(
      "- `PJR-DDDD`（register 項目、`review`、`2026-11-13T00:00:00Z` から）",
    );
  });
});
