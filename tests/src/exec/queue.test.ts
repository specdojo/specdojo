import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type { LockHandle } from "../../../src/shared/cross-process-lock.js";
import {
  cancelQueue,
  createQueueRecord,
  formatQueueSummary,
  listQueueRecords,
  loadQueueRecord,
  parseQueueStepSpec,
  QueueBusyError,
  queueLockPath,
  queueRecordPath,
  runQueue,
  writeQueueRecord,
  type QueueOnFailure,
  type QueueStep,
  type QueueStepOutcome,
} from "../../../src/exec/queue.js";

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

function executionDir(): string {
  const root = mkdtempSync(join(tmpdir(), "specdojo-queue-"));
  roots.push(root);
  return join(root, "execution");
}

// The lock itself is covered by cross-process-lock tests; these tests replace it with a fake.
const fakeLock = {
  acquire: (lockDir: string): LockHandle =>
    ({ lockDir, token: "test", heartbeat: { kill: () => true } }) as unknown as LockHandle,
  release: () => undefined,
};

function createQueue(
  executionPath: string,
  steps: Array<{ spec: string; onFailure: QueueOnFailure }>,
): string {
  const path = queueRecordPath(executionPath, "nightly");
  writeQueueRecord(
    path,
    createQueueRecord({
      queueId: "nightly",
      projectId: "prj-0001",
      steps,
      now: "2026-11-18T00:00:00.000Z",
    }),
  );
  return path;
}

/** Records the start and end of each step; the listed steps exit with code 1. */
function recordingExecutor(failing: number[] = []) {
  const events: string[] = [];
  const execute = async (step: QueueStep): Promise<QueueStepOutcome> => {
    events.push(`start ${step.index}`);
    await new Promise((resolve) => setTimeout(resolve, 5));
    events.push(`end ${step.index}`);
    const exitCode = failing.includes(step.index) ? 1 : 0;
    return { exitCode, summary: `exit code ${exitCode}` };
  };
  return { events, execute };
}

const threeSteps = (middle: QueueOnFailure) => [
  { spec: "grade run --kind rulebook", onFailure: "stop" as const },
  { spec: "exec run --register PJR-AAAA PJR-BBBB", onFailure: middle },
  { spec: "post-integration build-dist", onFailure: "stop" as const },
];

describe("parseQueueStepSpec", () => {
  it("accepts a leading specdojo the same as the bare step", () => {
    const bare = parseQueueStepSpec("exec run --auto", "stop", 1, "prj-0001");
    const prefixed = parseQueueStepSpec("specdojo exec run --auto", "stop", 1, "prj-0001");

    expect(prefixed).toEqual(bare);
    expect(prefixed.argv).toEqual(["exec", "run", "--auto", "--project", "prj-0001"]);
  });

  it("maps grade run to the specdojo argv and adds the queue project", () => {
    const step = parseQueueStepSpec("grade run --kind rulebook", "stop", 1, "prj-0001");

    expect(step).toMatchObject({
      kind: "grade",
      argv: ["grade", "run", "--kind", "rulebook", "--project", "prj-0001"],
      status: "pending",
    });
  });

  it("keeps an explicit --project of an exec run step", () => {
    const step = parseQueueStepSpec(
      "exec run --auto --project prj-0002",
      "continue",
      2,
      "prj-0001",
    );

    expect(step.argv).toEqual(["exec", "run", "--auto", "--project", "prj-0002"]);
    expect(step.on_failure).toBe("continue");
  });

  it("accepts the build-dist post-integration step without arguments", () => {
    expect(parseQueueStepSpec("post-integration build-dist", "stop", 3, "prj-0001")).toMatchObject({
      kind: "post-integration",
      argv: ["build-dist"],
    });
  });

  it("rejects commands outside the allowlist", () => {
    expect(() => parseQueueStepSpec("npm run build", "stop", 1, "prj-0001")).toThrow(
      /step 1: unsupported step: npm run build/,
    );
    expect(() => parseQueueStepSpec("post-integration build-dist --x", "stop", 1, "p")).toThrow(
      /unsupported step/,
    );
  });

  it("rejects quotes because no shell interprets the step", () => {
    expect(() => parseQueueStepSpec("grade run --kind 'rulebook'", "stop", 2, "p")).toThrow(
      /step 2: quotes and backslashes are not supported/,
    );
  });

  it("requires a register or schedule target and rejects job and plan runs", () => {
    expect(() => parseQueueStepSpec("exec run --by codex", "stop", 1, "p")).toThrow(
      /needs one of --register/,
    );
    expect(() => parseQueueStepSpec("exec run --job job-x --auto", "stop", 1, "p")).toThrow(
      /--job is not supported/,
    );
  });
});

describe("createQueueRecord", () => {
  it("rejects an empty queue and an invalid id", () => {
    expect(() => createQueueRecord({ queueId: "q", projectId: "p", steps: [] })).toThrow(
      /at least one --step/,
    );
    expect(() =>
      createQueueRecord({ queueId: "Bad Id", projectId: "p", steps: threeSteps("stop") }),
    ).toThrow(/Invalid queue id: Bad Id/);
  });

  it("writes a queue that is listed and reloaded unchanged", () => {
    const executionPath = executionDir();
    const path = createQueue(executionPath, threeSteps("stop"));

    const { records, errors } = listQueueRecords(executionPath);

    expect(errors).toEqual([]);
    expect(records).toEqual([loadQueueRecord(path)]);
    expect(records[0]).toMatchObject({ queue_id: "nightly", state: "pending" });
    expect(records[0].steps.map((step) => step.index)).toEqual([1, 2, 3]);
  });
});

describe("runQueue", () => {
  it("starts each step only after the previous one ends and finishes as succeeded", async () => {
    const executionPath = executionDir();
    const recordPath = createQueue(executionPath, threeSteps("stop"));
    const { events, execute } = recordingExecutor();

    const record = await runQueue({
      recordPath,
      lockDir: queueLockPath(executionPath, "nightly"),
      execute,
      log: () => undefined,
      ...fakeLock,
    });

    expect(events).toEqual(["start 1", "end 1", "start 2", "end 2", "start 3", "end 3"]);
    expect(record.state).toBe("succeeded");
    expect(loadQueueRecord(recordPath).steps.map((step) => step.status)).toEqual([
      "succeeded",
      "succeeded",
      "succeeded",
    ]);
  });

  it("stops at a failed stop step and records the step and reason", async () => {
    const executionPath = executionDir();
    const recordPath = createQueue(executionPath, threeSteps("stop"));
    const { events, execute } = recordingExecutor([2]);

    const record = await runQueue({
      recordPath,
      lockDir: queueLockPath(executionPath, "nightly"),
      execute,
      log: () => undefined,
      ...fakeLock,
    });

    expect(events).toEqual(["start 1", "end 1", "start 2", "end 2"]);
    const saved = loadQueueRecord(recordPath);
    expect(saved).toMatchObject({
      state: "stopped",
      stopped_step: 2,
      reason: "step 2 failed: exit code 1",
    });
    expect(saved.steps.map((step) => step.status)).toEqual(["succeeded", "failed", "pending"]);
    expect(record.state).toBe("stopped");
    expect(formatQueueSummary(saved, queueLockPath(executionPath, "nightly"))).toBe(
      "nightly\tstopped\t2/3\tstopped=step 2\treason=step 2 failed: exit code 1",
    );
  });

  it("continues past a failed continue step and finishes with failures", async () => {
    const executionPath = executionDir();
    const recordPath = createQueue(executionPath, threeSteps("continue"));
    const { events, execute } = recordingExecutor([2]);

    const record = await runQueue({
      recordPath,
      lockDir: queueLockPath(executionPath, "nightly"),
      execute,
      log: () => undefined,
      ...fakeLock,
    });

    expect(events).toEqual(["start 1", "end 1", "start 2", "end 2", "start 3", "end 3"]);
    expect(record.state).toBe("completed_with_failures");
  });

  it("resumes a stopped queue at the failed step without rerunning finished steps", async () => {
    const executionPath = executionDir();
    const recordPath = createQueue(executionPath, threeSteps("stop"));
    const lockDir = queueLockPath(executionPath, "nightly");
    await runQueue({
      recordPath,
      lockDir,
      execute: recordingExecutor([2]).execute,
      log: () => undefined,
      ...fakeLock,
    });
    const retry = recordingExecutor();

    const record = await runQueue({
      recordPath,
      lockDir,
      execute: retry.execute,
      log: () => undefined,
      ...fakeLock,
    });

    expect(retry.events).toEqual(["start 2", "end 2", "start 3", "end 3"]);
    expect(record.state).toBe("succeeded");
    expect(record.stopped_step).toBeUndefined();
  });

  it("stops before the next step when the queue is cancelled during a step", async () => {
    const executionPath = executionDir();
    const recordPath = createQueue(executionPath, threeSteps("stop"));
    const started: number[] = [];

    const record = await runQueue({
      recordPath,
      lockDir: queueLockPath(executionPath, "nightly"),
      execute: async (step) => {
        started.push(step.index);
        cancelQueue(recordPath, "user cancelled");
        return { exitCode: 0, summary: "exit code 0" };
      },
      log: () => undefined,
      ...fakeLock,
    });

    expect(started).toEqual([1]);
    expect(record).toMatchObject({ state: "cancelled", reason: "user cancelled" });
  });

  it("refuses to run a queue whose lock is held by another runner", async () => {
    const executionPath = executionDir();
    const recordPath = createQueue(executionPath, threeSteps("stop"));
    const { events, execute } = recordingExecutor();

    await expect(
      runQueue({
        recordPath,
        lockDir: queueLockPath(executionPath, "nightly"),
        execute,
        log: () => undefined,
        acquire: () => null,
        release: () => undefined,
      }),
    ).rejects.toThrow(QueueBusyError);
    expect(events).toEqual([]);
    expect(loadQueueRecord(recordPath).state).toBe("pending");
  });

  it("records a step whose executor throws as failed", async () => {
    const executionPath = executionDir();
    const recordPath = createQueue(executionPath, threeSteps("stop"));

    const record = await runQueue({
      recordPath,
      lockDir: queueLockPath(executionPath, "nightly"),
      execute: async () => {
        throw new Error("spawn ENOENT");
      },
      log: () => undefined,
      ...fakeLock,
    });

    expect(record).toMatchObject({ state: "stopped", reason: "step 1 failed: spawn ENOENT" });
    expect(record.steps[0]).toMatchObject({ status: "failed", exit_code: null });
  });
});
