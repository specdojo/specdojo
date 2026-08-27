import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  agentGitStateViolation,
  captureAgentGitStateSnapshot,
  changedAgentGitStateFields,
} from "../../src/exec-agent-git-state.js";
import { gitEnvironment } from "../../src/exec-worktree.js";

function git(cwd: string, ...args: string[]): string {
  return execFileSync("git", args, { cwd, encoding: "utf8", env: gitEnvironment() }).trim();
}

function createRepository(): string {
  const repo = mkdtempSync(join(tmpdir(), "specdojo-agent-git-state-"));
  git(repo, "init");
  writeFileSync(join(repo, "README.md"), "# initial\n", "utf8");
  git(repo, "add", "README.md");
  git(repo, "commit", "-m", "initial");
  return repo;
}

function createLinkedWorktree(repo: string, name: string): string {
  const worktree = `${repo}-${name.replaceAll("/", "-")}-worktree`;
  git(repo, "worktree", "add", "-b", name, worktree);
  return worktree;
}

describe("agent Git state guard", () => {
  it("creates fixture commits without writing identity to local config", () => {
    const repo = createRepository();
    try {
      expect(git(repo, "config", "--local", "--list")).not.toMatch(/user\.(?:name|email)/);
      expect(git(repo, "log", "-1", "--format=%an <%ae>")).toBe(
        "SpecDojo Test <specdojo@example.invalid>",
      );
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("detects a commit created by an agent", () => {
    const repo = createRepository();
    try {
      const before = captureAgentGitStateSnapshot(repo);
      writeFileSync(join(repo, "agent.txt"), "unexpected commit\n", "utf8");
      git(repo, "add", "agent.txt");
      git(repo, "commit", "-m", "agent fixture commit");

      expect(changedAgentGitStateFields(repo, before)).toEqual(["HEAD"]);
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("ignores runner register commits outside the agent worktree", () => {
    const repo = createRepository();
    const worktree = createLinkedWorktree(repo, "exec/pjr-44cw-runner-transition");
    try {
      const before = captureAgentGitStateSnapshot(worktree);

      writeFileSync(join(repo, "register.md"), "start\n", "utf8");
      git(repo, "add", "register.md");
      git(repo, "commit", "-m", "exec(register PJR-EX5E): start");
      writeFileSync(join(repo, "register.md"), "wait\n", "utf8");
      git(repo, "add", "register.md");
      git(repo, "commit", "-m", "exec(register PJR-07M5): wait");
      git(repo, "config", "branch.exec/pjr-44cw-runner-transition.vscode-merge-base", "HEAD~1");

      expect(changedAgentGitStateFields(worktree, before)).toEqual([]);
    } finally {
      rmSync(worktree, { recursive: true, force: true });
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("still detects a commit in the agent worktree while runner commits are present", () => {
    const repo = createRepository();
    const worktree = createLinkedWorktree(repo, "exec/pjr-44cw-agent-change");
    try {
      const before = captureAgentGitStateSnapshot(worktree);

      writeFileSync(join(repo, "register.md"), "start\n", "utf8");
      git(repo, "add", "register.md");
      git(repo, "commit", "-m", "exec(register PJR-EX5E): start");
      writeFileSync(join(worktree, "agent.txt"), "unexpected commit\n", "utf8");
      git(worktree, "add", "agent.txt");
      git(worktree, "commit", "-m", "agent fixture commit");

      expect(changedAgentGitStateFields(worktree, before)).toEqual(["HEAD"]);
    } finally {
      rmSync(worktree, { recursive: true, force: true });
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("detects a core.bare change even when worktree commands become unavailable", () => {
    const repo = createRepository();
    try {
      const before = captureAgentGitStateSnapshot(repo);
      git(repo, "config", "core.bare", "true");

      expect(changedAgentGitStateFields(repo, before)).toContain("local-config");
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("formats a blocking reason with the changed fields", () => {
    expect(agentGitStateViolation(["HEAD", "local-config"])).toContain("fields=HEAD, local-config");
  });
});
