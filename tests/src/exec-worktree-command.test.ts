import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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

async function runExecWorktree(args: string[]): Promise<void> {
  clearProjectEnv();
  process.exitCode = undefined;
  const program = new Command();
  program.exitOverride();
  registerExecCommands(program);
  await program.parseAsync(["node", "specdojo", "exec", "worktree", ...args]);
  expect(process.exitCode).toBeUndefined();
}

function setupRepository(): { repo: string; worktreeBase: string; taskId: string } {
  const repo = mkdtempSync(join(tmpdir(), "specdojo-worktree-command-repo-"));
  const worktreeBase = mkdtempSync(join(tmpdir(), "specdojo-worktree-command-base-"));
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

describe("exec worktree commands", () => {
  it("prepares, commits, merges, and removes a task worktree", async () => {
    const { repo, worktreeBase, taskId } = setupRepository();
    const worktreeTaskId = `test:${taskId}`;
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    try {
      process.chdir(repo);
      await runExecWorktree(["prepare", "--project", "test", "--task", taskId]);

      const worktree = findExecWorktree(repo, worktreeTaskId);
      expect(worktree).not.toBeNull();
      // Branch is project-qualified; the bare task id no longer resolves a worktree.
      expect(worktree!.branch).toBe("exec/test-T-TEST-doc-010");
      expect(findExecWorktree(repo, taskId)).toBeNull();
      expect(git(repo, "log", "-1", "--pretty=%s")).toBe(`exec(${taskId}): prepare execution`);

      process.chdir(worktree!.path);
      await runExecWorktree(["status", "--project", "test", "--task", taskId]);
      await runExecWorktree([
        "agent",
        "--project",
        "test",
        "--task",
        taskId,
        "--by",
        "edit-agent",
        "--agent-cmd",
        `node -e "let s='';process.stdin.on('data',d=>s+=d);process.stdin.on('end',()=>require('node:fs').writeFileSync('agent-ran.txt',s))"`,
      ]);
      expect(readFileSync(join(worktree!.path, "agent-ran.txt"), "utf8")).toContain(
        "Update README.",
      );

      writeFileSync(join(worktree!.path, "README.md"), "# updated\n", "utf8");
      writeFileSync(
        join(worktree!.path, "execution", "exec", "results", `${taskId}-result.md`),
        "# Result\n\nComplete.\n",
        "utf8",
      );
      await runExecWorktree(["commit", "--project", "test", "--task", taskId]);
      expect(git(worktree!.path, "log", "-1", "--pretty=%s")).toBe(
        `exec(${taskId}): apply task changes`,
      );

      process.chdir(repo);
      await runExecWorktree(["merge", "--project", "test", "--task", taskId]);
      expect(readFileSync(join(repo, "README.md"), "utf8")).toBe("# updated\n");

      await runExecWorktree(["remove", "--project", "test", "--task", taskId, "--delete-branch"]);
      expect(findExecWorktree(repo, worktreeTaskId)).toBeNull();
      expect(() => git(repo, "show-ref", "--verify", `refs/heads/${worktree!.branch}`)).toThrow();
    } finally {
      process.chdir(originalCwd);
      const worktree = findExecWorktree(repo, worktreeTaskId);
      if (worktree) git(repo, "worktree", "remove", "--force", worktree.path);
      rmSync(repo, { recursive: true, force: true });
      rmSync(worktreeBase, { recursive: true, force: true });
    }
  });
});
