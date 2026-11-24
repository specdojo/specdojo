import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { runBatchMode } from "../../../../src/exec/run/schedule-mode.js";
import { prepareSingleTask, type PreparedTask } from "../../../../src/exec/run/schedule-prepare.js";
import { runPreparedTaskSafely } from "../../../../src/exec/run/schedule-task.js";
import { spawnRefresh } from "../../../../src/exec/run/mode-shared.js";
import type { ReadyTaskView } from "../../../../src/exec/types.js";
import { ChangeScopeBlockedError, ChangeScopeGate } from "../../../../src/exec/run/change-scope.js";
import { findExecWorktree } from "../../../../src/exec/worktree.js";

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
      projects: {
        test: {
          schedule_path: "schedule",
          execution_path: "execution",
          project_register_path: "register",
        },
      },
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
  vi.mocked(findExecWorktree).mockReturnValue(null);
});

afterEach(() => {
  process.chdir(originalCwd);
  process.exitCode = undefined;
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  rmSync(repo, { recursive: true, force: true });
});

describe("exec run --auto with human tasks", () => {
  it("retries a scope-blocked task after another task settles", async () => {
    writeReady([task("A-1"), task("B-1")]);
    let blocked = true;
    const finish = vi.fn(async () => {});
    vi.spyOn(ChangeScopeGate.prototype, "tryAcquire").mockImplementation(async (id) => {
      if (id === "A-1" && blocked) throw new ChangeScopeBlockedError("waiting for B-1");
      return { waits: [], finish, cancelPreparation: vi.fn(async () => {}) };
    });
    vi.mocked(runPreparedTaskSafely).mockImplementation(async (p) => {
      blocked = false;
      return { prepared: p, result: "success" };
    });

    await runBatchMode({ project: "test", loop: true, parallel: "2" });

    expect(vi.mocked(prepareSingleTask).mock.calls.map(([t]) => t.id)).toEqual(["B-1", "A-1"]);
    expect(output.join("")).toContain("change scope blocked: 1");
    expect(output.join("")).toContain("deferred this round: none (0)");
    expect(process.exitCode).toBeUndefined();
  });
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
    expect(readdirSync(join(repo, "execution/exec/.locks/change-scopes"))).toEqual([]);
  });

  it("releases the reservation when plan generation throws", async () => {
    writeReady([task("A-1")]);
    vi.mocked(prepareSingleTask).mockRejectedValue(new Error("plan generation failed"));

    await runBatchMode({ project: "test" });

    expect(process.stderr.write).toHaveBeenCalledWith(
      expect.stringContaining("setup error for A-1: plan generation failed"),
    );
    expect(process.exitCode).toBe(1);
    expect(readdirSync(join(repo, "execution/exec/.locks/change-scopes"))).toEqual([]);
  });

  it.each([
    { state: "todo", worktree: false, removed: true },
    { state: "todo", worktree: true, removed: false },
    { state: "doing", worktree: false, removed: false },
    { state: "blocked", worktree: false, removed: false },
  ])(
    "recovers only unused todo reservations: $state, worktree=$worktree",
    async ({ state, worktree, removed }) => {
      writeReady([task("A-1")]);
      writeFileSync(
        join(repo, "schedule/sch-track-main.yaml"),
        "kind: track\ntrack: main\ntasks:\n  - id: T-OLD\n",
      );
      const directory = join(repo, "execution/exec/.locks/change-scopes");
      mkdirSync(directory, { recursive: true });
      const record = join(directory, `${createHash("sha256").update("T-OLD").digest("hex")}.json`);
      writeFileSync(
        record,
        JSON.stringify({
          item: "T-OLD",
          state: "blocked",
          scope: { paths: ["project:src/run.ts"], unknown: false },
        }),
      );
      if (state !== "todo") {
        mkdirSync(join(repo, "execution/exec/events"), { recursive: true });
        writeFileSync(
          join(repo, "execution/exec/events/old.json"),
          JSON.stringify({
            v: 1,
            ts: "2026-11-23T00:00:00Z",
            task_id: "T-OLD",
            type: state === "doing" ? "claim" : "block",
            by: "test-agent",
            msg: "old run",
          }),
        );
      }
      if (worktree) {
        vi.mocked(findExecWorktree).mockReturnValue({
          path: join(repo, "old"),
          branch: "exec/old",
          name: "old",
          created: false,
        });
      }

      await runBatchMode({ project: "test", unknownScope: "serialize" });

      expect(existsSync(record)).toBe(!removed);
      expect(prepareSingleTask).toHaveBeenCalledTimes(removed ? 1 : 0);
      expect(process.exitCode).toBe(removed ? undefined : 1);
    },
  );

  it("recovers a register preparation's orphan before a schedule run", async () => {
    writeReady([task("A-1")]);
    mkdirSync(join(repo, "register"));
    writeFileSync(
      join(repo, "register/pjr-ab12-test.md"),
      `---
specdojo:
  id: test:pjr-ab12-test
  type: project
  status: draft
  item_type: todo
  item_status: open
---

# PJR-AB12 Test
`,
    );
    const directory = join(repo, "execution/exec/.locks/change-scopes");
    mkdirSync(directory, { recursive: true });
    const record = join(directory, `${createHash("sha256").update("PJR-AB12").digest("hex")}.json`);
    writeFileSync(
      record,
      JSON.stringify({ item: "PJR-AB12", state: "blocked", scope: { paths: [], unknown: true } }),
    );

    await runBatchMode({ project: "test", unknownScope: "serialize" });

    expect(existsSync(record)).toBe(false);
    expect(prepareSingleTask).toHaveBeenCalledTimes(1);
    expect(process.exitCode).toBeUndefined();
  });
});
