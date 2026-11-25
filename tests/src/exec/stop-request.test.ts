import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  acknowledgeStopRequest,
  autoRunsDirectory,
  cancelStopRequest,
  discardStaleStopRequests,
  findApplicableStopRequest,
  finishStopRequest,
  formatStopRequest,
  listLiveAutoRuns,
  parseStopTarget,
  readStopRequest,
  registerAutoRun,
  requestStop,
  stopRecordsDirectory,
  type AutoRunMarker,
} from "../../../src/exec/stop-request.js";

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

function executionDir(): string {
  const root = mkdtempSync(join(tmpdir(), "specdojo-stop-"));
  roots.push(root);
  return join(root, "execution");
}

function marker(overrides: Partial<AutoRunMarker> = {}): AutoRunMarker {
  return {
    version: 1,
    pid: 4242,
    command: "run",
    started_at: "2026-11-25T10:00:00.000Z",
    loop: true,
    ...overrides,
  };
}

const alive = (pid: number) => pid === 4242;

describe("parseStopTarget", () => {
  it("selects the project, a track, or a queue", () => {
    expect(parseStopTarget({})).toEqual({ kind: "project" });
    expect(parseStopTarget({ track: "pm" })).toEqual({ kind: "track", track: "pm" });
    expect(parseStopTarget({ queue: "nightly" })).toEqual({ kind: "queue", queueId: "nightly" });
  });

  it("rejects both targets at once and an invalid track name", () => {
    expect(() => parseStopTarget({ track: "pm", queue: "nightly" })).toThrow(/either --track/);
    expect(() => parseStopTarget({ track: "../x" })).toThrow(/Invalid track name: \.\.\/x/);
  });
});

describe("requestStop", () => {
  it("writes a request when a matching auto run is alive", () => {
    const executionPath = executionDir();
    registerAutoRun(executionPath, marker({ track: "pm" }));

    const { request, runs } = requestStop({
      executionPath,
      target: { kind: "track", track: "pm" },
      message: " change settings ",
      isAlive: alive,
      now: "2026-11-25T11:00:00.000Z",
    });

    expect(request).toEqual({
      version: 1,
      target: { kind: "track", track: "pm" },
      message: "change settings",
      requested_at: "2026-11-25T11:00:00.000Z",
    });
    expect(runs.map((run) => run.pid)).toEqual([4242]);
    expect(readStopRequest(executionPath, { kind: "track", track: "pm" })).toEqual(request);
  });

  it("refuses a target that nothing running matches", () => {
    const executionPath = executionDir();
    registerAutoRun(executionPath, marker({ track: "pm" }));

    expect(() =>
      requestStop({
        executionPath,
        target: { kind: "track", track: "dev" },
        message: "x",
        isAlive: alive,
      }),
    ).toThrow("Nothing to stop: no exec run --auto / exec cycle is running for track dev");
    expect(() =>
      requestStop({
        executionPath,
        target: { kind: "queue", queueId: "nightly" },
        message: "x",
        isAlive: alive,
        isQueueRunning: () => false,
      }),
    ).toThrow("Nothing to stop: queue nightly is not running");
  });

  it("accepts a queue whose runner holds the lock even between auto runs", () => {
    const executionPath = executionDir();

    const { runs } = requestStop({
      executionPath,
      target: { kind: "queue", queueId: "nightly" },
      message: "x",
      isQueueRunning: (queueId) => queueId === "nightly",
    });

    expect(runs).toEqual([]);
  });

  it("refuses a second request for the same target and points to --cancel", () => {
    const executionPath = executionDir();
    registerAutoRun(executionPath, marker());
    const target = { kind: "project" } as const;
    requestStop({ executionPath, target, message: "first", isAlive: alive });

    expect(() => requestStop({ executionPath, target, message: "second", isAlive: alive })).toThrow(
      /already exists \(requested at .*: first\)\. Withdraw it with exec stop --cancel$/,
    );
  });

  it("rejects an empty message", () => {
    expect(() =>
      requestStop({ executionPath: executionDir(), target: { kind: "project" }, message: "  " }),
    ).toThrow("--msg must not be empty");
  });
});

describe("listLiveAutoRuns", () => {
  it("removes markers of processes that are gone", () => {
    const executionPath = executionDir();
    registerAutoRun(executionPath, marker());
    registerAutoRun(executionPath, marker({ pid: 9999 }));

    expect(listLiveAutoRuns(executionPath, alive).map((run) => run.pid)).toEqual([4242]);
    expect(readdirSync(autoRunsDirectory(executionPath))).toEqual(["4242.json"]);
  });
});

describe("cancelStopRequest", () => {
  it("removes the request and reports a missing one", () => {
    const executionPath = executionDir();
    registerAutoRun(executionPath, marker());
    requestStop({ executionPath, target: { kind: "project" }, message: "x", isAlive: alive });

    expect(cancelStopRequest(executionPath, { kind: "project" }).message).toBe("x");
    expect(() => cancelStopRequest(executionPath, { kind: "project" })).toThrow(
      "No stop request for every auto run of the project",
    );
  });
});

describe("findApplicableStopRequest and discardStaleStopRequests", () => {
  it("applies project, track, and queue requests made after the run started", () => {
    const executionPath = executionDir();
    const run = marker({ track: "pm", queue_id: "nightly" });
    registerAutoRun(executionPath, run);
    requestStop({
      executionPath,
      target: { kind: "queue", queueId: "nightly" },
      message: "queue",
      isAlive: alive,
      now: "2026-11-25T11:00:00.000Z",
    });

    expect(findApplicableStopRequest(executionPath, run)?.message).toBe("queue");
    expect(findApplicableStopRequest(executionPath, marker({ track: "dev" }))).toBeUndefined();
  });

  it("ignores and discards a project request left from before the run, but keeps queue requests", () => {
    const executionPath = executionDir();
    registerAutoRun(executionPath, marker({ queue_id: "nightly" }));
    const old = "2026-11-25T09:00:00.000Z";
    requestStop({
      executionPath,
      target: { kind: "project" },
      message: "old",
      isAlive: alive,
      now: old,
    });
    requestStop({
      executionPath,
      target: { kind: "queue", queueId: "nightly" },
      message: "queue",
      isAlive: alive,
      now: old,
    });
    const run = marker({ queue_id: "nightly" });

    expect(findApplicableStopRequest(executionPath, run)).toBeUndefined();
    expect(discardStaleStopRequests(executionPath, run).map((r) => r.message)).toEqual(["old"]);
    expect(readStopRequest(executionPath, { kind: "project" })).toBeUndefined();
    expect(readStopRequest(executionPath, { kind: "queue", queueId: "nightly" })?.message).toBe(
      "queue",
    );
  });
});

describe("acknowledgeStopRequest, finishStopRequest and formatStopRequest", () => {
  it("shows the waiting tasks, then records the stop and removes the request", () => {
    const executionPath = executionDir();
    const run = marker();
    registerAutoRun(executionPath, run);
    const { request } = requestStop({
      executionPath,
      target: { kind: "project" },
      message: "merge feature",
      isAlive: alive,
      now: "2026-11-25T11:00:00.000Z",
    });

    expect(formatStopRequest(request, [run])).toBe(
      "project\trequested: applies at the next scheduling point\trequested_at=2026-11-25T11:00:00.000Z\tmsg=merge feature",
    );
    const acknowledged = acknowledgeStopRequest(
      executionPath,
      request,
      4242,
      ["T-B", "T-A"],
      "2026-11-25T11:01:00.000Z",
    );
    expect(formatStopRequest(acknowledged, [run])).toContain(
      "draining: no new tasks; waiting for 2 running task(s) (T-A, T-B)",
    );
    expect(formatStopRequest(request, [])).toContain("requested: no matching run is alive");

    const path = finishStopRequest(
      executionPath,
      acknowledged,
      { stopped_by: "auto-run", drained_tasks: ["T-B", "T-A"] },
      "2026-11-25T11:30:00.123Z",
    );

    expect(path).toBe(join(stopRecordsDirectory(executionPath), "20261125T113000Z-project.json"));
    expect(JSON.parse(readFileSync(path, "utf8"))).toEqual({
      version: 1,
      target: { kind: "project" },
      message: "merge feature",
      requested_at: "2026-11-25T11:00:00.000Z",
      stopped_at: "2026-11-25T11:30:00.123Z",
      stopped_by: "auto-run",
      drained_tasks: ["T-A", "T-B"],
    });
    expect(readStopRequest(executionPath, { kind: "project" })).toBeUndefined();
  });

  it("does not recreate a request withdrawn before the acknowledgement", () => {
    const executionPath = executionDir();
    registerAutoRun(executionPath, marker());
    const { request } = requestStop({
      executionPath,
      target: { kind: "project" },
      message: "x",
      isAlive: alive,
    });
    cancelStopRequest(executionPath, { kind: "project" });

    acknowledgeStopRequest(executionPath, request, 4242, []);

    expect(existsSync(join(executionPath, "exec", ".locks", "stop-requests", "project.json"))).toBe(
      false,
    );
  });
});
