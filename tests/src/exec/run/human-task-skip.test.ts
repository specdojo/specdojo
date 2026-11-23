import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { runBatchMode } from "../../../../src/exec/run/schedule-mode.js";
import { prepareSingleTask, type PreparedTask } from "../../../../src/exec/run/schedule-prepare.js";
import { runPreparedTaskSafely } from "../../../../src/exec/run/schedule-task.js";
import { spawnRefresh } from "../../../../src/exec/run/mode-shared.js";
import type { ReadyTaskView } from "../../../../src/exec/types.js";

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

const originalCwd = process.cwd();
let repo: string;
let output: string[];

function task(id: string, execution?: "human"): ReadyTaskView {
  return {
    id,
    schedule_file: "sch-track-main.yaml",
    fifo_rank: 1,
    critical_first_rank: 1,
    ...(execution ? { execution } : {}),
  };
}

function writeReady(tasks: ReadyTaskView[]): void {
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

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("SPECDOJO_SCHEDULE_PATH", undefined);
  vi.stubEnv("SPECDOJO_EXECUTION_PATH", undefined);
  repo = mkdtempSync(join(tmpdir(), "specdojo-auto-human-"));
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
  );
  writeFileSync(
    join(repo, "schedule/sch-track-main.yaml"),
    "kind: track\ntrack: main\ntasks: []\n",
  );
  process.chdir(repo);
  process.exitCode = undefined;
  output = [];
  vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
    output.push(String(chunk));
    return true;
  });
  vi.spyOn(process.stderr, "write").mockReturnValue(true);
  vi.mocked(prepareSingleTask).mockImplementation(async (t) => prepared(t));
  vi.mocked(runPreparedTaskSafely).mockImplementation(async (p) => ({
    prepared: p,
    result: "success",
  }));
  vi.mocked(spawnRefresh).mockReturnValue(true);
});

afterEach(() => {
  process.chdir(originalCwd);
  process.exitCode = undefined;
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  rmSync(repo, { recursive: true, force: true });
});

describe("exec run --auto with human tasks", () => {
  it("skips human tasks even when --edit-by is given and runs the agent task", async () => {
    writeReady([task("H-1", "human"), task("A-1")]);

    await runBatchMode({ project: "test", editBy: "sol-executor", parallel: "2" });

    expect(vi.mocked(prepareSingleTask).mock.calls.map(([t]) => t.id)).toEqual(["A-1"]);
    expect(output.join("")).toContain("skipped: H-1");
    expect(process.exitCode).toBeUndefined();
  });

  it.each([true, false])(
    "exits 0 and reports the waiting count when only human tasks remain (dryRun=%s)",
    async (dryRun) => {
      writeReady([task("H-1", "human"), task("H-2", "human")]);

      await runBatchMode({ project: "test", editBy: "sol-executor", dryRun });

      expect(prepareSingleTask).not.toHaveBeenCalled();
      expect(output.join("")).toContain("2 task(s) waiting for human completion");
      expect(process.exitCode).toBeUndefined();
    },
  );

  it("fails when a preparation failure remains next to skipped human tasks", async () => {
    writeReady([task("H-1", "human"), task("A-1")]);
    vi.mocked(prepareSingleTask).mockResolvedValue("failure");

    await runBatchMode({ project: "test", editBy: "sol-executor", parallel: "2" });

    expect(output.join("")).toContain("no executable tasks");
    expect(process.exitCode).toBe(1);
  });
});
