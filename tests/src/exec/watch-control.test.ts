import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  decideWatchHold,
  findTargetProcess,
  listProcesses,
  pauseWatch,
  readWatchControl,
  resumeWatch,
  watchActionGate,
  watchControlPath,
  watchEventsLogPath,
  type WatchControl,
  type WatchHoldContext,
} from "../../../src/exec/watch-control.js";

const NOW = "2026-11-14T00:00:00Z";

describe("pauseWatch / resumeWatch", () => {
  let executionPath: string;

  beforeEach(async () => {
    executionPath = await mkdtemp(path.join(tmpdir(), "specdojo-watch-control-"));
  });

  afterEach(async () => {
    await rm(executionPath, { recursive: true, force: true });
  });

  it("pauses the whole watch when no target is given and records it in the watch log", async () => {
    const lines = pauseWatch(executionPath, {
      targets: [],
      by: "indie",
      reason: "release work",
      now: NOW,
    });

    expect(lines).toEqual([
      {
        v: 1,
        ts: NOW,
        event: "paused",
        key: "watch-control:*",
        target: { kind: "watch-control", id: "*" },
        by: "indie",
        reason: "release work",
      },
    ]);
    expect(readWatchControl(executionPath).all).toEqual({
      by: "indie",
      at: NOW,
      reason: "release work",
    });
    const log = await readFile(watchEventsLogPath(executionPath), "utf8");
    expect(
      log
        .trim()
        .split("\n")
        .map((line) => JSON.parse(line).event),
    ).toEqual(["paused"]);
  });

  it("marks targets once and resumes only the marked ones", () => {
    pauseWatch(executionPath, { targets: ["PJR-AAAA", "PJR-BBBB"], by: "indie", now: NOW });

    const again = pauseWatch(executionPath, { targets: ["PJR-AAAA"], by: "indie", now: NOW });
    const resumed = resumeWatch(executionPath, {
      targets: ["PJR-AAAA", "PJR-CCCC"],
      by: "indie",
      now: "2026-11-14T01:00:00Z",
    });

    expect(again).toEqual([]);
    expect(resumed.map((line) => [line.event, line.target.id])).toEqual([["resumed", "PJR-AAAA"]]);
    expect(Object.keys(readWatchControl(executionPath).targets)).toEqual(["PJR-BBBB"]);
  });

  it("reports the control file path when it is not valid JSON", async () => {
    await mkdir(path.dirname(watchControlPath(executionPath)), { recursive: true });
    await writeFile(watchControlPath(executionPath), "{broken", "utf8");

    expect(() => readWatchControl(executionPath)).toThrow(/watch-control\.json/);
  });
});

describe("findTargetProcess", () => {
  it("finds a process whose arguments name the target", () => {
    const actual = findTargetProcess(
      [
        { pid: 10, argv: ["node", "specdojo", "exec", "resume", "--register", "PJR-QTZ7"] },
        { pid: 11, argv: ["node", "specdojo", "exec", "run", "--task=T-KATA-005"] },
      ],
      "T-KATA-005",
    );

    expect(actual?.pid).toBe(11);
  });

  it("finds a process working in the target's worktree", () => {
    const actual = findTargetProcess(
      [{ pid: 12, argv: ["npx", "vitest"], cwd: "/work/worktrees/prj-0001-PJR-QTZ7/tests" }],
      "PJR-QTZ7",
    );

    expect(actual?.pid).toBe(12);
  });

  it("ignores the watch and exec watch processes that name the target", () => {
    const actual = findTargetProcess(
      [{ pid: 13, argv: ["node", "specdojo", "exec", "watch", "--target", "PJR-QTZ7"] }],
      "PJR-QTZ7",
    );

    expect(actual).toBeUndefined();
  });

  it("does not match an id that only shares a suffix inside a longer word", () => {
    const actual = findTargetProcess(
      [{ pid: 14, argv: ["node", "x", "PJR-QTZ70"], cwd: "/work/worktrees/prj-0001-PJR-QTZ70" }],
      "PJR-QTZ7",
    );

    expect(actual).toBeUndefined();
  });
});

describe("decideWatchHold", () => {
  const control: WatchControl = {
    v: 1,
    targets: { "PJR-MARK": { by: "indie", at: NOW, reason: "fixing kata menu" } },
  };

  function context(overrides: Partial<WatchHoldContext> = {}): WatchHoldContext {
    return {
      control,
      manualActors: new Set(["indie", "specdojo-orchestrator"]),
      processes: [],
      ...overrides,
    };
  }

  it("holds a target marked as excluded from the watch", () => {
    const actual = decideWatchHold(
      { kind: "register-item", id: "PJR-MARK", state: "waiting", actor: "sol-executor" },
      context(),
    );

    expect(actual).toEqual({
      reason: "paused",
      detail: `paused by indie at ${NOW}: fixing kata menu`,
    });
  });

  it("holds a schedule task claimed by a person", () => {
    const actual = decideWatchHold(
      { kind: "schedule-task", id: "T-1", state: "blocked", actor: "indie" },
      context(),
    );

    expect(actual).toEqual({ reason: "manual_actor", detail: "claimed by indie" });
  });

  it("keeps a register item a person moved to review in the watch", () => {
    const actual = decideWatchHold(
      { kind: "register-item", id: "PJR-REVW", state: "review", actor: "indie" },
      context(),
    );

    expect(actual).toBeUndefined();
  });

  it("holds a target named by a running process", () => {
    const actual = decideWatchHold(
      { kind: "schedule-task", id: "T-2", state: "blocked", actor: "sol-executor" },
      context({ processes: [{ pid: 42, argv: ["specdojo", "exec", "resume", "--task", "T-2"] }] }),
    );

    expect(actual).toEqual({
      reason: "live_process",
      detail: "pid 42: specdojo exec resume --task T-2",
    });
  });

  it("leaves an agent's stalled task without a running process in the watch", () => {
    const actual = decideWatchHold(
      { kind: "schedule-task", id: "T-3", state: "blocked", actor: "sol-executor" },
      context(),
    );

    expect(actual).toBeUndefined();
  });
});

describe("watchActionGate", () => {
  it("refuses while the whole watch is paused", () => {
    const actual = watchActionGate(
      "/unused",
      { v: 1, all: { by: "indie", at: NOW }, targets: {} },
      () => false,
    );

    expect(actual).toEqual({
      allowed: false,
      reason: "paused",
      detail: `paused by indie at ${NOW}`,
    });
  });

  it("refuses while another run holds the run lock", () => {
    const actual = watchActionGate("/unused", { v: 1, targets: {} }, () => true);

    expect(actual).toMatchObject({ allowed: false, reason: "busy" });
  });

  it("allows remedies when the watch runs and no run holds the lock", () => {
    expect(watchActionGate("/unused", { v: 1, targets: {} }, () => false)).toEqual({
      allowed: true,
    });
  });
});

describe("listProcesses", () => {
  let procRoot: string;

  beforeEach(async () => {
    procRoot = await mkdtemp(path.join(tmpdir(), "specdojo-proc-"));
  });

  afterEach(async () => {
    await rm(procRoot, { recursive: true, force: true });
  });

  it("reads the arguments and working directory of each numeric entry", async () => {
    await mkdir(path.join(procRoot, "200"));
    await writeFile(path.join(procRoot, "200", "cmdline"), "node\0specdojo\0exec\0run\0", "utf8");
    await symlink(procRoot, path.join(procRoot, "200", "cwd"));
    await mkdir(path.join(procRoot, "self"));

    const actual = listProcesses(procRoot);

    expect(actual).toEqual([
      { pid: 200, argv: ["node", "specdojo", "exec", "run"], cwd: procRoot },
    ]);
  });

  it("returns an empty list when the process directory cannot be read", () => {
    expect(listProcesses(path.join(procRoot, "missing"))).toEqual([]);
  });
});
