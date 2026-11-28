import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import type { QueueRecord } from "../../../src/exec/queue.js";
import type { StallObservation } from "../../../src/exec/watch-scan-classify.js";
import {
  collectQueueObservations,
  collectRegisterObservations,
  diffWatchScan,
  openStalls,
  parseWatchLog,
  planWatchRemedies,
  readRunLogs,
  renderWatchReport,
  reportDate,
  runWatchScan,
  type WatchScanContext,
} from "../../../src/exec/watch-scan.js";
import { pauseWatch, resumeWatch } from "../../../src/exec/watch-control.js";
import type { PjrItem } from "../../../src/register/item.js";
import { resolveWatchRemedies } from "../../../src/exec/watch-remedy.js";

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

describe("diffWatchScan with held targets", () => {
  const hold = { reason: "live_process" as const, detail: "pid 42: specdojo exec resume" };

  it("neither records nor clears a stall whose target is held", () => {
    const first = diffWatchScan([], [limitObservation()], NOW);
    const held = new Map([["schedule-task:T-KATA-WAVE-1-dct-index-040", hold]]);

    const second = diffWatchScan(first.appended, [limitObservation()], "2026-11-14T00:30:00Z", {
      held,
    });

    expect(second.appended).toEqual([]);
    expect(second.current).toEqual([]);
    expect(second.held).toEqual([
      {
        target: { kind: "schedule-task", id: "T-KATA-WAVE-1-dct-index-040" },
        state: "deferred",
        since: "2026-11-13T14:23:56Z",
        hold,
        open: first.appended[0],
      },
    ]);
  });

  it("records the state the target reached when its stall clears", () => {
    const first = diffWatchScan([], [limitObservation()], NOW);

    const second = diffWatchScan(first.appended, [], "2026-11-14T00:30:00Z", {
      states: new Map([["schedule-task:T-KATA-WAVE-1-dct-index-040", "done"]]),
    });

    expect(second.appended).toMatchObject([{ event: "cleared", state: "done" }]);
  });

  it("keeps an open stall open across pause and resume lines in the log", () => {
    const first = diffWatchScan([], [limitObservation()], NOW);
    const control = {
      v: 1 as const,
      ts: NOW,
      event: "paused" as const,
      key: "watch-control:*",
      target: { kind: "watch-control" as const, id: "*" },
      by: "indie",
    };

    const second = diffWatchScan([...first.appended, control], [limitObservation()], NOW);

    expect(second.appended).toEqual([]);
  });
});

describe("openStalls", () => {
  it("keeps a stall open across the remedy lines written for it", () => {
    const first = diffWatchScan([], [limitObservation()], NOW);
    const key = first.appended[0]!.key;
    const target = { kind: "schedule-task", id: "T-KATA-WAVE-1-dct-index-040" } as const;

    const actual = openStalls([
      ...first.appended,
      {
        v: 1,
        ts: NOW,
        event: "remedy_stopped",
        key,
        target,
        category: "usage_limit",
        attempts: 3,
        reason: "max",
        by: "watch-scan",
      },
    ]);

    expect([...actual.keys()]).toEqual([key]);
  });
});

describe("planWatchRemedies", () => {
  const remedies = resolveWatchRemedies({
    remedies: { usage_limit: { action: "wait" }, load_timeout: { action: "rerun" } },
    max_attempts: 1,
  });
  const due = {
    ...limitObservation(),
    meta: {
      limit_kind: "quota_exhausted",
      limit_resume_at: "2026-11-13T14:37:00.000Z",
      limit_auto_resume: "true",
    },
  };
  const timeout: StallObservation = {
    kind: "schedule-task",
    id: "T-KATA-WAVE-1-cnd-specdojo-070",
    state: "blocked",
    since: "2026-11-13T16:00:00Z",
    message: { source: "events/block.json", text: "parent validation failed: test-unit" },
    meta: { pipeline_stage: "reporter", pipeline_state_ref: "runs/x/pipeline-state.json" },
    logs: [{ source: "a.log", text: "Error: Test timed out in 5000ms." }],
  };

  function plan(
    runLive: boolean,
    history: Parameters<typeof planWatchRemedies>[0]["history"] = [],
  ) {
    const { current } = diffWatchScan([], [due, timeout], NOW);
    return planWatchRemedies({
      projectId: "prj-0001",
      root: "/repo",
      executionPath: "/repo/execution",
      current,
      observations: new Map(
        [due, timeout].map((item) => [`${item.kind}:${item.id}:${item.state}:${item.since}`, item]),
      ),
      history,
      config: remedies,
      now: new Date(NOW),
      nowText: NOW,
      runLive,
    });
  }

  it("launches one remedy per scan, starting from the oldest stall", () => {
    const actual = plan(false);

    expect(actual.launched).toMatchObject({
      event: "remedy",
      target: { id: "T-KATA-WAVE-1-dct-index-040" },
      action: "resume_due",
      attempt: 1,
      max_attempts: 1,
      log: "execution/watch/remedies/20261114T000000Z-T-KATA-WAVE-1-dct-index-040.log",
      by: "watch-scan",
    });
  });

  it("launches nothing while another exec run holds the lock", () => {
    const actual = plan(true);

    expect(actual.launched).toBeUndefined();
    expect(actual.deferredByLock).toBe(true);
  });

  it("stops a target that reached max_attempts only once", () => {
    const launched = plan(false).launched!;
    const second = plan(false, [launched]);
    const third = plan(false, [launched, ...second.stopped]);

    expect(second.stopped.map((line) => line.target.id)).toEqual(["T-KATA-WAVE-1-dct-index-040"]);
    expect(second.launched?.target.id).toBe("T-KATA-WAVE-1-cnd-specdojo-070");
    expect(third.stopped).toEqual([]);
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
      listProcesses: () => [],
    };

    const first = runWatchScan(input);
    const diagnosisSection = "\n## 7. agent の診断案\n\n>     保存済みの診断案\n";
    await writeFile(
      first.reportPath,
      (await readFile(first.reportPath, "utf8")) + diagnosisSection,
    );
    const second = runWatchScan({ ...input, now: new Date("2026-11-14T00:30:00Z") });

    const log = await readFile(first.logPath, "utf8");
    expect(log.trim().split("\n")).toHaveLength(1);
    expect(second.appended).toEqual([]);
    expect(path.relative(dir, second.reportPath)).toBe(
      path.join("execution", "reports", "watch-scan", "watch-scan-20261114.md"),
    );
    const report = await readFile(second.reportPath, "utf8");
    // 診断の後処理へ進む前に落ちても、見張り本体が既存の節を保持する。
    expect(report.endsWith(diagnosisSection)).toBe(true);
    expect(report.split("## 7. agent の診断案")).toHaveLength(2);
    expect(report).toContain("- 最後に見た時刻: `2026-11-14T00:30:00Z`");
    expect(report).toContain("## 3. 見張りの対象外\n\n- なし");
    expect(report).toContain("## 4. 手当て\n\n- なし");
    expect(report).toContain(
      "- `PJR-DDDD`（register 項目、`review`、`2026-11-13T00:00:00Z` から）",
    );
  });

  async function writeLimitWait(): Promise<string> {
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
    return registerPath;
  }

  it("records the remedy before launching it and lists it in the morning report", async () => {
    const registerPath = await writeLimitWait();
    const items = [
      { id: "PJR-AAAA", status: "waiting", registeredAt: "2026-11-13T00:00:00Z" },
    ] as PjrItem[];
    const logged: string[] = [];
    const launch = vi.fn((argv: readonly string[], logPath: string) => {
      logged.push(path.relative(dir, logPath));
    });

    const outcome = runWatchScan({
      projectId: "prj-test",
      root: dir,
      executionPath: path.join(dir, "execution"),
      register: { items, projectRegisterPath: registerPath },
      timeZone: "UTC",
      now: new Date(NOW),
      staleMs: 2 * 3_600_000,
      dryRun: false,
      remedies: resolveWatchRemedies({ remedies: { usage_limit: { action: "wait" } } }),
      launch,
      isRunLive: () => false,
      listProcesses: () => [],
    });

    expect(launch).toHaveBeenCalledTimes(1);
    expect(launch.mock.calls[0]![0]).toEqual([
      "exec",
      "run",
      "--project",
      "prj-test",
      "--register",
      "PJR-AAAA",
      "--worktree",
      "--resume",
      "--if-busy",
      "skip",
    ]);
    expect(logged).toEqual([
      path.join("execution", "watch", "remedies", "20261114T000000Z-PJR-AAAA.log"),
    ]);
    const log = (await readFile(outcome.logPath, "utf8")).trim().split("\n");
    expect(log.map((line) => (JSON.parse(line) as { event: string }).event)).toEqual([
      "stalled",
      "remedy",
    ]);
    const report = await readFile(outcome.reportPath, "utf8");
    expect(report).toContain(
      "- `PJR-AAAA`（register 項目、`2026-11-14T00:00:00Z`）: 解除の時刻を過ぎたので同じ agent で再開する（`resume`、1/3 回目）",
    );
  });

  it("plans the remedy but launches nothing in a dry run", async () => {
    const registerPath = await writeLimitWait();
    const launch = vi.fn();

    const outcome = runWatchScan({
      projectId: "prj-test",
      root: dir,
      executionPath: path.join(dir, "execution"),
      register: {
        items: [
          { id: "PJR-AAAA", status: "waiting", registeredAt: "2026-11-13T00:00:00Z" },
        ] as PjrItem[],
        projectRegisterPath: registerPath,
      },
      timeZone: "UTC",
      now: new Date(NOW),
      staleMs: 2 * 3_600_000,
      dryRun: true,
      remedies: resolveWatchRemedies({ remedies: { usage_limit: { action: "wait" } } }),
      launch,
      isRunLive: () => false,
      listProcesses: () => [],
    });

    expect(launch).not.toHaveBeenCalled();
    expect(outcome.remedy.launched?.action).toBe("resume");
  });

  it("does nothing while the whole watch is paused", async () => {
    const registerPath = path.join(dir, "register");
    await mkdir(path.join(registerPath, "events"), { recursive: true });
    const executionPath = path.join(dir, "execution");
    pauseWatch(executionPath, { targets: [], by: "indie", now: NOW });

    const actual = runWatchScan({
      projectId: "prj-test",
      root: dir,
      executionPath,
      register: {
        items: [{ id: "PJR-DDDD", status: "review", registeredAt: NOW }] as PjrItem[],
        projectRegisterPath: registerPath,
      },
      timeZone: "UTC",
      now: new Date(NOW),
      staleMs: 2 * 3_600_000,
      dryRun: false,
    });

    expect(actual.skipped).toEqual({ reason: "paused", detail: `paused by indie at ${NOW}` });
    const log = await readFile(actual.logPath, "utf8");
    expect(log.trim().split("\n")).toHaveLength(1);
    await expect(readFile(actual.reportPath, "utf8")).rejects.toThrow(/ENOENT/);
  });

  it("lists a target marked as excluded in the report instead of the log", async () => {
    const registerPath = path.join(dir, "register");
    await mkdir(path.join(registerPath, "events"), { recursive: true });
    const executionPath = path.join(dir, "execution");
    pauseWatch(executionPath, {
      targets: ["PJR-DDDD"],
      by: "indie",
      reason: "fixing",
      now: NOW,
    });

    const actual = runWatchScan({
      projectId: "prj-test",
      root: dir,
      executionPath,
      register: {
        items: [{ id: "PJR-DDDD", status: "review", registeredAt: NOW }] as PjrItem[],
        projectRegisterPath: registerPath,
      },
      timeZone: "UTC",
      now: new Date(NOW),
      staleMs: 2 * 3_600_000,
      dryRun: false,
      listProcesses: () => [],
    });

    expect(actual.appended).toEqual([]);
    expect(actual.held.map((entry) => entry.hold.reason)).toEqual(["paused"]);
    const report = await readFile(actual.reportPath, "utf8");
    expect(report).toContain("## 3. 見張りの対象外");
    expect(report).toContain(
      `  - 触らない理由: 見張りの対象外の印（\`paused by indie at ${NOW}: fixing\`）`,
    );
  });
});

// PJR-T4E0 × PJR-3M4M: 手で始めた run・人やオーケストレーターの claim・止めた印の付いた対象には、
// 手当ての種類を選んでいても手を打たない。
describe("watch-scan remedies on targets a person or the orchestrator is working on", () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "specdojo-watch-held-remedy-"));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  async function writeLimitWait(actor: string): Promise<string> {
    const registerPath = path.join(dir, "register");
    await mkdir(path.join(registerPath, "events"), { recursive: true });
    await writeFile(
      path.join(registerPath, "events", "pjr-aaaa.yaml"),
      [
        "- v: 1",
        "  id: reg_00000000000000000000000000000001",
        '  ts: "2026-11-13T15:00:00Z"',
        "  action: wait",
        `  actor: ${actor}`,
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
    return registerPath;
  }

  async function writeInterruptedClaim(actor: string): Promise<string> {
    const registerPath = path.join(dir, "register");
    await mkdir(path.join(registerPath, "events"), { recursive: true });
    await writeFile(
      path.join(registerPath, "events", "pjr-bbbb.yaml"),
      [
        "- v: 1",
        "  id: reg_00000000000000000000000000000002",
        '  ts: "2026-11-13T15:00:00Z"',
        "  action: start",
        `  actor: ${actor}`,
        "  from_status: open",
        "  to_status: in-progress",
        "  reason: start",
        "  changes:",
        "    - field: status",
        "      from: open",
        "      to: in-progress",
        "",
      ].join("\n"),
      "utf8",
    );
    return registerPath;
  }

  function scan(
    registerPath: string,
    items: PjrItem[],
    extra: Partial<Parameters<typeof runWatchScan>[0]>,
  ) {
    const launch = vi.fn();
    const outcome = runWatchScan({
      projectId: "prj-test",
      root: dir,
      executionPath: path.join(dir, "execution"),
      register: { items, projectRegisterPath: registerPath },
      timeZone: "UTC",
      now: new Date(NOW),
      staleMs: 2 * 3_600_000,
      dryRun: false,
      remedies: resolveWatchRemedies({
        remedies: { usage_limit: { action: "wait" }, load_timeout: { action: "rerun" } },
      }),
      launch,
      isRunLive: () => false,
      listProcesses: () => [],
      ...extra,
    });
    return { outcome, launch };
  }

  const waitingItem = [
    { id: "PJR-AAAA", status: "waiting", registeredAt: "2026-11-13T00:00:00Z" },
  ] as PjrItem[];

  it("launches no remedy on a target marked as excluded", async () => {
    const registerPath = await writeLimitWait("sol-executor");
    pauseWatch(path.join(dir, "execution"), {
      targets: ["PJR-AAAA"],
      by: "indie",
      now: NOW,
    });

    const { outcome, launch } = scan(registerPath, waitingItem, {});

    expect(launch).not.toHaveBeenCalled();
    expect(outcome.remedy.launched).toBeUndefined();
    expect(outcome.held.map((entry) => [entry.target.id, entry.hold.reason])).toEqual([
      ["PJR-AAAA", "paused"],
    ]);
  });

  it("launches no remedy on a target a live process names", async () => {
    const registerPath = await writeLimitWait("sol-executor");

    const { outcome, launch } = scan(registerPath, waitingItem, {
      listProcesses: () => [
        { pid: 4242, argv: ["node", "specdojo", "exec", "run", "--register", "PJR-AAAA"] },
      ],
    });

    expect(launch).not.toHaveBeenCalled();
    expect(outcome.held.map((entry) => entry.hold.reason)).toEqual(["live_process"]);
  });

  it("launches no remedy on an in-progress item claimed by a person or the orchestrator", async () => {
    const registerPath = await writeInterruptedClaim("specdojo-orchestrator");
    const items = [
      { id: "PJR-BBBB", status: "in-progress", registeredAt: "2026-11-13T00:00:00Z" },
    ] as PjrItem[];

    const { outcome, launch } = scan(registerPath, items, {
      manualActors: new Set(["specdojo-orchestrator", "indie"]),
    });

    expect(outcome.warnings).toEqual([]);
    expect(launch).not.toHaveBeenCalled();
    expect(outcome.held.map((entry) => [entry.target.id, entry.hold.reason])).toEqual([
      ["PJR-BBBB", "manual_actor"],
    ]);
  });

  it("launches no remedy and writes nothing while the whole watch is paused", async () => {
    const registerPath = await writeLimitWait("sol-executor");
    pauseWatch(path.join(dir, "execution"), { targets: [], by: "indie", now: NOW });

    const { outcome, launch } = scan(registerPath, waitingItem, {});

    expect(launch).not.toHaveBeenCalled();
    expect(outcome.skipped?.reason).toBe("paused");
    expect(outcome.appended).toEqual([]);
  });

  it("launches the remedy again once the exclusion mark is removed", async () => {
    const registerPath = await writeLimitWait("sol-executor");
    const executionPath = path.join(dir, "execution");
    pauseWatch(executionPath, { targets: ["PJR-AAAA"], by: "indie", now: NOW });
    resumeWatch(executionPath, { targets: ["PJR-AAAA"], by: "indie", now: NOW });

    const { outcome, launch } = scan(registerPath, waitingItem, {});

    expect(launch).toHaveBeenCalledTimes(1);
    expect(outcome.remedy.launched?.target.id).toBe("PJR-AAAA");
  });
});
