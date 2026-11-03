import { mkdirSync, mkdtempSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Command } from "commander";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { registerRunCommand } from "../../../../src/exec/run/register-command.js";
import { runBatchMode } from "../../../../src/exec/run/schedule-mode.js";
import { prepareSingleTask, type PreparedTask } from "../../../../src/exec/run/schedule-prepare.js";
import { runPreparedTaskSafely } from "../../../../src/exec/run/schedule-task.js";
import { spawnIndexBuild, spawnRefresh } from "../../../../src/exec/run/mode-shared.js";
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
const selectedTrack = "data-flow-uc-rewrite";

function task(id: string, track: string): ReadyTaskView {
  return {
    id,
    schedule_file: `sch-track-${track}.yaml`,
    fifo_rank: 1,
    critical_first_rank: 1,
  };
}

const other = task("T-LAUNCH-other-105", "launch");
// A custom ID ensures filtering uses the schedule file, not a task ID prefix.
const first = task("custom-task", selectedTrack);
const second = task("T-DATA-FLOW-UC-REWRITE-second-010", selectedTrack);

function writeReady(tasks: ReadyTaskView[]): void {
  writeFileSync(
    join(repo, "execution/generated/ready.json"),
    JSON.stringify({
      schedule_path: "schedule",
      execution_path: "execution",
      generated_dir: "execution/generated",
      ready_count: tasks.length,
      default_strategy: "critical-first",
      strategies: {
        "critical-first": {
          next_task_id: tasks[0]?.id ?? null,
          ordered_task_ids: tasks.map((t) => t.id),
        },
        fifo: {
          next_task_id: tasks.at(-1)?.id ?? null,
          ordered_task_ids: tasks.map((t) => t.id).reverse(),
        },
      },
      tasks,
    }),
  );
}

function prepared(task: ReadyTaskView): PreparedTask {
  return {
    task,
    actor: "test-agent",
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
  repo = mkdtempSync(join(tmpdir(), "specdojo-auto-track-"));
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
  for (const track of [selectedTrack, "launch", "empty"]) {
    writeFileSync(
      join(repo, `schedule/sch-track-${track}.yaml`),
      `kind: track\ntrack: ${track}\ntasks: []\n`,
    );
  }
  process.chdir(repo);
  process.exitCode = undefined;
  output = [];
  vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
    output.push(String(chunk));
    return true;
  });
  vi.spyOn(process.stderr, "write").mockReturnValue(true);
  vi.mocked(prepareSingleTask).mockImplementation(async (task) => prepared(task));
  vi.mocked(runPreparedTaskSafely).mockImplementation(async (prepared) => ({
    prepared,
    result: "success",
  }));
  vi.mocked(spawnRefresh).mockReturnValue(true);
  writeReady([other, first, second]);
});

afterEach(() => {
  process.chdir(originalCwd);
  process.exitCode = undefined;
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  rmSync(repo, { recursive: true, force: true });
});

describe("exec run --auto --track", () => {
  it.each([
    { dryRun: true, parallel: "3", strategy: "critical-first", expected: [first, second] },
    { dryRun: false, parallel: "3", strategy: "critical-first", expected: [first, second] },
    { dryRun: false, parallel: "1", strategy: "fifo", expected: [second] },
  ])("filters before preparation ($dryRun, $parallel, $strategy)", async (opts) => {
    await runBatchMode({ project: "test", track: selectedTrack, ...opts });

    expect(vi.mocked(prepareSingleTask).mock.calls.map(([task]) => task)).toEqual(opts.expected);
    expect(vi.mocked(runPreparedTaskSafely).mock.calls.map(([p]) => p.task)).toEqual(opts.expected);
    expect(process.exitCode).toBeUndefined();
  });

  it("does not prepare another track after every selected task fails setup", async () => {
    vi.mocked(prepareSingleTask).mockRejectedValue(new Error("checkpoint failed"));

    await runBatchMode({ project: "test", track: selectedTrack, parallel: "3" });

    expect(vi.mocked(prepareSingleTask).mock.calls.map(([task]) => task)).toEqual([first, second]);
    expect(runPreparedTaskSafely).not.toHaveBeenCalled();
    expect(process.exitCode).toBe(1);
  });

  it("selects tasks from a .yml track schedule", async () => {
    renameSync(
      join(repo, `schedule/sch-track-${selectedTrack}.yaml`),
      join(repo, `schedule/sch-track-${selectedTrack}.yml`),
    );
    const ymlTask = { ...first, schedule_file: `schedule/sch-track-${selectedTrack}.yml` };
    writeReady([other, ymlTask]);

    await runBatchMode({ project: "test", track: selectedTrack, parallel: "3" });

    expect(vi.mocked(prepareSingleTask).mock.calls.map(([task]) => task)).toEqual([ymlTask]);
    expect(process.exitCode).toBeUndefined();
  });

  it("keeps the track restriction after execution failure and loop refresh", async () => {
    writeReady([first, other]);
    vi.mocked(runPreparedTaskSafely).mockImplementation(async (prepared) => ({
      prepared,
      result: "failure",
    }));
    vi.mocked(spawnRefresh).mockImplementation(() => {
      writeReady([other]);
      return true;
    });

    await runBatchMode({ project: "test", track: selectedTrack, loop: true, parallel: "3" });

    expect(spawnIndexBuild).toHaveBeenCalledOnce();
    expect(spawnRefresh).toHaveBeenCalledOnce();
    expect(vi.mocked(prepareSingleTask).mock.calls.map(([task]) => task)).toEqual([first]);
    expect(runPreparedTaskSafely).toHaveBeenCalledOnce();
    expect(process.exitCode).toBe(1);
  });

  it.each([true, false])(
    "rejects an unknown track before preparation (dry-run: %s)",
    async (dryRun) => {
      await expect(runBatchMode({ project: "test", track: "missing", dryRun })).rejects.toThrow(
        /Unknown schedule track: missing/,
      );
      expect(prepareSingleTask).not.toHaveBeenCalled();
      expect(runPreparedTaskSafely).not.toHaveBeenCalled();
    },
  );

  it("exits successfully when a known track has no Ready tasks", async () => {
    await runBatchMode({ project: "test", track: "empty", loop: true });

    expect(prepareSingleTask).not.toHaveBeenCalled();
    expect(output.join("")).toContain("no ready tasks");
    expect(process.exitCode).toBeUndefined();
  });

  it("preserves selection across tracks when --track is omitted", async () => {
    await runBatchMode({ project: "test", parallel: "3" });

    expect(vi.mocked(prepareSingleTask).mock.calls.map(([task]) => task)).toEqual([
      other,
      first,
      second,
    ]);
  });

  it.each([{ args: [] }, { args: ["--task", first.id] }, { args: ["--register", "PJR-AB12"] }])(
    "rejects --track without --auto ($args)",
    async ({ args }) => {
      const program = new Command();
      registerRunCommand(program.command("exec"));
      await program.parseAsync(["exec", "run", "--track", selectedTrack, ...args], {
        from: "user",
      });

      expect(output.join("")).toContain("--track requires --auto");
      expect(process.exitCode).toBe(1);
      expect(prepareSingleTask).not.toHaveBeenCalled();
    },
  );
});
