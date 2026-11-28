import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Command } from "commander";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { registerExecCommands } from "../../../../src/exec/exec.js";
import {
  createQueueRecord,
  loadQueueRecord,
  queueLockPath,
  queueRecordPath,
  runQueue,
  writeQueueRecord,
} from "../../../../src/exec/queue.js";
import { runBatchMode } from "../../../../src/exec/run/schedule-mode.js";
import { prepareSingleTask, type PreparedTask } from "../../../../src/exec/run/schedule-prepare.js";
import { runPreparedTaskSafely } from "../../../../src/exec/run/schedule-task.js";
import { findExecWorktree } from "../../../../src/exec/worktree.js";
import {
  EXEC_QUEUE_ID_ENV,
  EXEC_STOP_EXIT_CODE,
  finishStopRequest,
  readStopRequest,
} from "../../../../src/exec/stop-request.js";
import type { ReadyTaskView } from "../../../../src/exec/types.js";

// The agent boundary (task preparation = claim, and the task pipeline through integration) is
// replaced; the loop, the stop request files, the `exec stop` CLI and the queue runner are real.
vi.mock(import("../../../../src/exec/run/schedule-prepare.js"), async (importOriginal) => ({
  ...(await importOriginal()),
  prepareSingleTask: vi.fn(),
}));
vi.mock(import("../../../../src/exec/run/schedule-task.js"), async (importOriginal) => ({
  ...(await importOriginal()),
  runPreparedTaskSafely: vi.fn(),
}));
vi.mock(import("../../../../src/exec/run/mode-shared.js"), async (importOriginal) => ({
  ...(await importOriginal()),
  spawnIndexBuild: vi.fn(() => true),
  spawnRefresh: vi.fn(() => true),
}));
vi.mock(import("../../../../src/exec/worktree.js"), async (importOriginal) => ({
  ...(await importOriginal()),
  findExecWorktree: vi.fn(),
}));

const originalCwd = process.cwd();
let repo: string;
let output: string[];
let integrated: string[];
let ready: ReadyTaskView[];

function task(id: string): ReadyTaskView {
  return { id, schedule_file: "sch-track-main.yaml", fifo_rank: 1, critical_first_rank: 1 };
}

function writeReady(tasks: ReadyTaskView[]): void {
  ready = tasks;
  const ids = tasks.map((t) => t.id);
  writeFileSync(
    join(repo, "execution/generated/ready.json"),
    JSON.stringify({
      schedule_path: "schedule",
      execution_path: "execution",
      generated_dir: "execution/generated",
      ready_count: tasks.length,
      default_strategy: "critical-first",
      strategies: {
        "critical-first": { next_task_id: ids[0] ?? null, ordered_task_ids: ids },
        fifo: { next_task_id: ids[0] ?? null, ordered_task_ids: ids },
      },
      tasks,
    }),
  );
}

function prepared(t: ReadyTaskView): PreparedTask {
  return {
    task: t,
    actor: "test-agent",
    claimActor: "test-agent",
    agentCandidates: [],
    plan: "plan.md",
    prompt: "test",
    worktree: { path: join(repo, "worktree"), branch: "exec/test", name: "test", created: false },
  };
}

async function execCli(args: string[]): Promise<number> {
  const previous = process.exitCode;
  process.exitCode = undefined;
  const program = new Command();
  program.exitOverride();
  registerExecCommands(program);
  await program.parseAsync(["node", "specdojo", "exec", ...args, "--project", "test"]);
  const code = Number(process.exitCode ?? 0);
  process.exitCode = previous;
  return code;
}

/**
 * While a task runs, call its `during`; the task then "integrates": it is recorded and leaves
 * ready.json, as the next round's refresh would do.
 */
function runTasksCalling(during: Record<string, () => Promise<void>>): void {
  vi.mocked(runPreparedTaskSafely).mockImplementation(async (p) => {
    await during[p.task.id]?.();
    integrated.push(p.task.id);
    writeReady(ready.filter((t) => t.id !== p.task.id));
    return { prepared: p, result: "success" };
  });
}

function claimed(): string[] {
  return vi.mocked(prepareSingleTask).mock.calls.map(([t]) => t.id);
}

function stopRecords(): Array<Record<string, unknown>> {
  const directory = join(repo, "execution/exec/stops");
  if (!existsSync(directory)) return [];
  return readdirSync(directory)
    .sort()
    .map(
      (name) => JSON.parse(readFileSync(join(directory, name), "utf8")) as Record<string, unknown>,
    );
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("SPECDOJO_SCHEDULE_PATH", undefined);
  vi.stubEnv("SPECDOJO_EXECUTION_PATH", undefined);
  vi.stubEnv(EXEC_QUEUE_ID_ENV, undefined);
  repo = mkdtempSync(join(tmpdir(), "specdojo-auto-stop-"));
  mkdirSync(join(repo, ".specdojo"));
  mkdirSync(join(repo, "schedule"));
  mkdirSync(join(repo, "execution/generated"), { recursive: true });
  writeFileSync(
    join(repo, ".specdojo/specdojo.config.json"),
    JSON.stringify({
      version: 1,
      current_project: "test",
      projects: { test: { schedule_path: "schedule", execution_path: "execution" } },
    }),
    "utf8",
  );
  writeFileSync(
    join(repo, "schedule/sch-track-main.yaml"),
    "kind: track\ntrack: main\ntasks: []\n",
    "utf8",
  );
  process.chdir(repo);
  process.exitCode = undefined;
  output = [];
  integrated = [];
  vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
    output.push(String(chunk));
    return true;
  });
  vi.spyOn(process.stderr, "write").mockImplementation((chunk) => {
    output.push(String(chunk));
    return true;
  });
  vi.mocked(prepareSingleTask).mockImplementation(async (t) => prepared(t));
  vi.mocked(findExecWorktree).mockReturnValue(null);
});

afterEach(() => {
  process.chdir(originalCwd);
  process.exitCode = undefined;
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  rmSync(repo, { recursive: true, force: true });
});

describe("exec stop with exec run --auto --loop", () => {
  it("finishes the running task, claims nothing new, and exits with the stop code", async () => {
    writeReady([task("A-1"), task("B-1")]);
    let stopExit = -1;
    runTasksCalling({
      "A-1": async () => {
        stopExit = await execCli(["stop", "--msg", "change exec-defaults"]);
      },
    });

    await runBatchMode({ project: "test", loop: true, parallel: "1" });

    expect(stopExit).toBe(0);
    expect(claimed()).toEqual(["A-1"]);
    expect(integrated).toEqual(["A-1"]);
    expect(process.exitCode).toBe(EXEC_STOP_EXIT_CODE);
    expect(output.join("")).toContain("stopped by exec stop (every auto run of the project)");
    expect(readStopRequest(join(repo, "execution"), { kind: "project" })).toBeUndefined();
    expect(stopRecords()).toEqual([
      expect.objectContaining({
        target: { kind: "project" },
        message: "change exec-defaults",
        stopped_by: "auto-run",
      }),
    ]);
    expect(readdirSync(join(repo, "execution/exec/.locks/auto-runs"))).toEqual([]);
  });

  it("shows the draining run in exec status while the running task finishes", async () => {
    writeReady([task("A-1"), task("B-1")]);
    let status = "";
    runTasksCalling({
      "A-1": async () => {
        await execCli(["stop", "--msg", "merge a feature branch"]);
        // A-1 finishes later; B-1 is the second slot's task that already runs.
      },
      "B-1": async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
        const before = output.length;
        await execCli(["status"]);
        status = output.slice(before).join("");
      },
    });

    await runBatchMode({ project: "test", loop: true, parallel: "2" });

    expect(status).toContain("stop requests:");
    expect(status).toContain(
      "project\tdraining: no new tasks; waiting for 1 running task(s) (B-1)",
    );
    expect(integrated.sort()).toEqual(["A-1", "B-1"]);
    expect(process.exitCode).toBe(EXEC_STOP_EXIT_CODE);
  });

  it("keeps claiming when the request is withdrawn before the run exits", async () => {
    writeReady([task("A-1"), task("B-1")]);
    const exits: number[] = [];
    runTasksCalling({
      "A-1": async () => {
        exits.push(await execCli(["stop", "--msg", "rebuild dist"]));
        exits.push(await execCli(["stop", "--msg", "again"]));
        exits.push(await execCli(["stop", "--cancel"]));
      },
    });

    await runBatchMode({ project: "test", loop: true, parallel: "1" });

    expect(exits).toEqual([0, 1, 0]);
    expect(output.join("")).toContain(
      "A stop request for every auto run of the project already exists",
    );
    expect(claimed()).toEqual(["A-1", "B-1"]);
    expect(process.exitCode).toBeUndefined();
    expect(stopRecords()).toEqual([]);
  });

  it("refuses a request when no auto run is running for the target", async () => {
    expect(await execCli(["stop", "--msg", "nothing runs"])).toBe(1);
    expect(output.join("")).toContain(
      "Nothing to stop: no exec run --auto / exec cycle is running",
    );
    expect(await execCli(["stop", "--cancel"])).toBe(1);
    expect(output.join("")).toContain("No stop request for every auto run of the project");
  });

  it("stops only the run of the requested track", async () => {
    writeReady([task("A-1"), task("B-1")]);
    const exits: number[] = [];
    runTasksCalling({
      "A-1": async () => {
        exits.push(await execCli(["stop", "--track", "other", "--msg", "wrong track"]));
        exits.push(await execCli(["stop", "--track", "main", "--msg", "right track"]));
      },
    });

    await runBatchMode({ project: "test", loop: true, parallel: "1", track: "main" });

    expect(exits).toEqual([1, 0]);
    expect(claimed()).toEqual(["A-1"]);
    expect(process.exitCode).toBe(EXEC_STOP_EXIT_CODE);
  });
});

describe("exec stop --queue", () => {
  it("stops the queue at the draining step and resumes it with the same queue run", async () => {
    const executionPath = join(repo, "execution");
    const recordPath = queueRecordPath(executionPath, "nightly");
    writeQueueRecord(
      recordPath,
      createQueueRecord({
        queueId: "nightly",
        projectId: "test",
        steps: [
          { spec: "exec run --auto --loop", onFailure: "continue" },
          { spec: "grade run --target x", onFailure: "stop" },
        ],
      }),
    );
    writeReady([task("A-1"), task("B-1")]);
    let stopExit = -1;
    let queueStatus = "";
    runTasksCalling({
      "A-1": async () => {
        stopExit = await execCli(["stop", "--queue", "nightly", "--msg", "update settings"]);
        const before = output.length;
        await execCli(["queue", "status", "nightly"]);
        queueStatus = output.slice(before).join("");
      },
    });
    // Steps run the auto loop in-process as the queue's child, with the queue id it would inherit.
    const execute = async (step: { kind: string }) => {
      if (step.kind !== "exec-run") return { exitCode: 0, summary: "exit code 0" };
      vi.stubEnv(EXEC_QUEUE_ID_ENV, "nightly");
      process.exitCode = undefined;
      await runBatchMode({ project: "test", loop: true, parallel: "1" });
      const exitCode = Number(process.exitCode ?? 0);
      process.exitCode = undefined;
      vi.stubEnv(EXEC_QUEUE_ID_ENV, undefined);
      return { exitCode, summary: `exit code ${exitCode}` };
    };
    const stop = {
      pending: () => readStopRequest(executionPath, { kind: "queue", queueId: "nightly" })?.message,
      finish: (step: number) => {
        const request = readStopRequest(executionPath, { kind: "queue", queueId: "nightly" });
        if (request)
          finishStopRequest(executionPath, request, { stopped_by: "queue", queue_step: step });
      },
    };
    const lockDir = queueLockPath(executionPath, "nightly");

    const first = await runQueue({ recordPath, lockDir, execute, stop, log: () => undefined });

    expect(stopExit).toBe(0);
    expect(queueStatus).toContain("stop=requested (update settings)");
    expect(claimed()).toEqual(["A-1"]);
    expect(first.state).toBe("stopped");
    expect(first.stopped_step).toBe(1);
    expect(first.steps.map((s) => s.status)).toEqual(["pending", "pending"]);
    expect(stopRecords()).toEqual([
      expect.objectContaining({ stopped_by: "queue", queue_step: 1, message: "update settings" }),
    ]);

    const resumed = await runQueue({ recordPath, lockDir, execute, stop, log: () => undefined });

    expect(claimed()).toEqual(["A-1", "B-1"]);
    expect(integrated).toEqual(["A-1", "B-1"]);
    expect(resumed.state).toBe("succeeded");
    expect(loadQueueRecord(recordPath).steps.map((s) => s.status)).toEqual([
      "succeeded",
      "succeeded",
    ]);
  });
});
