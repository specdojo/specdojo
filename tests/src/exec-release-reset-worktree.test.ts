import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Command } from "commander";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerExecCommands } from "../../src/exec.js";
import { findExecWorktree, gitEnvironment } from "../../src/exec-worktree.js";

const originalCwd = process.cwd();
const ENV_KEYS = ["SPECDOJO_PROJECT", "SPECDOJO_SCHEDULE_PATH", "SPECDOJO_EXECUTION_PATH"];
const originalEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));

function git(cwd: string, ...args: string[]): string {
  return execFileSync("git", args, { cwd, encoding: "utf8", env: gitEnvironment() }).trim();
}

function clearProjectEnv(): void {
  for (const key of ENV_KEYS) delete process.env[key];
}

async function runExec(args: string[]): Promise<void> {
  clearProjectEnv();
  process.exitCode = undefined;
  const program = new Command();
  program.exitOverride();
  registerExecCommands(program);
  await program.parseAsync(["node", "specdojo", "exec", ...args]);
  // Event commands set exitCode 0 on success; worktree subcommands leave it undefined. Either is ok.
  expect(process.exitCode ?? 0).toBe(0);
}

function setupRepository(): { repo: string; worktreeBase: string; taskId: string } {
  const repo = mkdtempSync(join(tmpdir(), "specdojo-cancel-reset-repo-"));
  const worktreeBase = mkdtempSync(join(tmpdir(), "specdojo-cancel-reset-base-"));
  const taskId = "T-TEST-doc-010";
  mkdirSync(join(repo, ".specdojo"), { recursive: true });
  mkdirSync(join(repo, "schedule"), { recursive: true });
  mkdirSync(join(repo, "execution", "exec", "events"), { recursive: true });
  mkdirSync(join(repo, "execution", "exec", "plans"), { recursive: true });
  mkdirSync(join(repo, "execution", "exec", "results"), { recursive: true });

  writeFileSync(
    join(repo, ".specdojo", "specdojo.config.json"),
    JSON.stringify(
      {
        version: 1,
        current_project: "test",
        projects: {
          test: {
            schedule_path: "schedule",
            execution_path: "execution",
            run: { worktree_base: worktreeBase },
          },
        },
      },
      null,
      2,
    ) + "\n",
    "utf8",
  );
  writeFileSync(
    join(repo, "schedule", "sch-track-test.yaml"),
    [
      "kind: track",
      "id: test:sch-track-test",
      "type: project",
      "status: draft",
      "version: 1",
      "project_id: test",
      "track: test",
      "tasks:",
      "  - local_id: doc",
      '    phase_suffix: "010"',
      "    name: Test document",
      "    duration_days: 1",
      "    depends_on: []",
      "    owner: DEV",
      "",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(join(repo, "README.md"), "# test\n", "utf8");

  git(repo, "init");
  git(repo, "config", "user.name", "SpecDojo Test");
  git(repo, "config", "user.email", "specdojo@example.invalid");
  git(repo, "add", ".specdojo/specdojo.config.json", "schedule/sch-track-test.yaml", "README.md");
  git(repo, "commit", "-m", "initial");

  writeFileSync(
    join(repo, "execution", "exec", "events", "20260613T000000Z_agent_T-TEST-doc-010_claim.json"),
    JSON.stringify(
      {
        v: 1,
        ts: "2026-06-13T00:00:00Z",
        type: "claim",
        task_id: taskId,
        by: "edit-agent",
        msg: "manual execution",
      },
      null,
      2,
    ) + "\n",
    "utf8",
  );
  writeFileSync(
    join(repo, "execution", "exec", "plans", `${taskId}-plan.md`),
    "# Plan\n\nUpdate README.\n",
    "utf8",
  );
  writeFileSync(
    join(repo, "execution", "exec", "results", `${taskId}-result.md`),
    "# Result\n",
    "utf8",
  );
  return { repo, worktreeBase, taskId };
}

afterEach(() => {
  process.chdir(originalCwd);
  clearProjectEnv();
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  process.exitCode = undefined;
  vi.restoreAllMocks();
});

describe("exec release --reset-worktree", () => {
  it("discards the prepared worktree and branch after releasing a doing task", async () => {
    const { repo, worktreeBase, taskId } = setupRepository();
    const worktreeTaskId = `test:${taskId}`;
    const stdout: string[] = [];
    vi.spyOn(process.stdout, "write").mockImplementation((chunk: string | Uint8Array) => {
      stdout.push(typeof chunk === "string" ? chunk : Buffer.from(chunk).toString("utf8"));
      return true;
    });
    vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    try {
      process.chdir(repo);
      await runExec(["worktree", "prepare", "--project", "test", "--task", taskId]);
      const prepared = findExecWorktree(repo, worktreeTaskId);
      expect(prepared).not.toBeNull();
      expect(prepared!.branch).toBe("exec/test-T-TEST-doc-010");

      stdout.length = 0;
      await runExec([
        "release",
        "--project",
        "test",
        "--task",
        taskId,
        "--by",
        "edit-agent",
        "--msg",
        "abandon blocked attempt; reset to todo",
        "--reset-worktree",
      ]);

      const output = stdout.join("");
      expect(output).toContain("reset worktree: discarded exec/test-T-TEST-doc-010");
      expect(output).toContain("_release_");
      // The worktree and its branch are gone.
      expect(findExecWorktree(repo, worktreeTaskId)).toBeNull();
      expect(() =>
        git(repo, "show-ref", "--verify", "refs/heads/exec/test-T-TEST-doc-010"),
      ).toThrow();
    } finally {
      process.chdir(originalCwd);
      const worktree = findExecWorktree(repo, worktreeTaskId);
      if (worktree) git(repo, "worktree", "remove", "--force", worktree.path);
      rmSync(repo, { recursive: true, force: true });
      rmSync(worktreeBase, { recursive: true, force: true });
    }
  });

  it("reports no residue when no worktree exists for the task", async () => {
    const { repo, worktreeBase, taskId } = setupRepository();
    const stdout: string[] = [];
    vi.spyOn(process.stdout, "write").mockImplementation((chunk: string | Uint8Array) => {
      stdout.push(typeof chunk === "string" ? chunk : Buffer.from(chunk).toString("utf8"));
      return true;
    });
    vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    try {
      process.chdir(repo);
      await runExec([
        "release",
        "--project",
        "test",
        "--task",
        taskId,
        "--by",
        "edit-agent",
        "--msg",
        "abandon claim; reset to todo",
        "--reset-worktree",
      ]);

      const output = stdout.join("");
      expect(output).toContain("reset worktree: no worktree or branch for test:T-TEST-doc-010");
      expect(output).toContain("_release_");
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
      rmSync(worktreeBase, { recursive: true, force: true });
    }
  });

  it("dry-run reports the planned worktree discard without removing it", async () => {
    const { repo, worktreeBase, taskId } = setupRepository();
    const worktreeTaskId = `test:${taskId}`;
    const stdout: string[] = [];
    vi.spyOn(process.stdout, "write").mockImplementation((chunk: string | Uint8Array) => {
      stdout.push(typeof chunk === "string" ? chunk : Buffer.from(chunk).toString("utf8"));
      return true;
    });
    vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    try {
      process.chdir(repo);
      await runExec(["worktree", "prepare", "--project", "test", "--task", taskId]);
      expect(findExecWorktree(repo, worktreeTaskId)).not.toBeNull();

      stdout.length = 0;
      await runExec([
        "release",
        "--project",
        "test",
        "--task",
        taskId,
        "--by",
        "edit-agent",
        "--msg",
        "preview reset",
        "--reset-worktree",
        "--dry-run",
      ]);

      const output = stdout.join("");
      expect(output).toContain("[dry-run]");
      expect(output).toContain("reset worktree: discard exec/test:T-TEST-doc-010");
      // Nothing was removed.
      expect(findExecWorktree(repo, worktreeTaskId)).not.toBeNull();
    } finally {
      process.chdir(originalCwd);
      const worktree = findExecWorktree(repo, worktreeTaskId);
      if (worktree) git(repo, "worktree", "remove", "--force", worktree.path);
      rmSync(repo, { recursive: true, force: true });
      rmSync(worktreeBase, { recursive: true, force: true });
    }
  });

  it("discards worktrees for blocked tasks released via --all-blocked", async () => {
    const { repo, worktreeBase, taskId } = setupRepository();
    const worktreeTaskId = `test:${taskId}`;
    const stdout: string[] = [];
    vi.spyOn(process.stdout, "write").mockImplementation((chunk: string | Uint8Array) => {
      stdout.push(typeof chunk === "string" ? chunk : Buffer.from(chunk).toString("utf8"));
      return true;
    });
    vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    try {
      process.chdir(repo);
      // setupRepository leaves the task doing; prepare the worktree, then block it so
      // --all-blocked picks it up while a stale worktree still exists.
      await runExec(["worktree", "prepare", "--project", "test", "--task", taskId]);
      expect(findExecWorktree(repo, worktreeTaskId)).not.toBeNull();
      writeFileSync(
        join(
          repo,
          "execution",
          "exec",
          "events",
          "20260613T000100Z_agent_T-TEST-doc-010_block.json",
        ),
        JSON.stringify(
          {
            v: 1,
            ts: "2026-06-13T00:01:00Z",
            type: "block",
            task_id: taskId,
            by: "edit-agent",
            msg: "blocked",
          },
          null,
          2,
        ) + "\n",
        "utf8",
      );

      stdout.length = 0;
      await runExec([
        "release",
        "--project",
        "test",
        "--by",
        "edit-agent",
        "--msg",
        "reset all blocked",
        "--all-blocked",
        "--reset-worktree",
      ]);

      const output = stdout.join("");
      expect(output).toContain("Released 1 blocked task(s); skipped 0.");
      expect(output).toContain("reset worktree: discarded exec/test-T-TEST-doc-010");
      expect(findExecWorktree(repo, worktreeTaskId)).toBeNull();
      expect(() =>
        git(repo, "show-ref", "--verify", "refs/heads/exec/test-T-TEST-doc-010"),
      ).toThrow();
    } finally {
      process.chdir(originalCwd);
      const worktree = findExecWorktree(repo, worktreeTaskId);
      if (worktree) git(repo, "worktree", "remove", "--force", worktree.path);
      rmSync(repo, { recursive: true, force: true });
      rmSync(worktreeBase, { recursive: true, force: true });
    }
  });
});
