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
  git(repo, "config", "user.name", "SpecDojo Test");
  git(repo, "config", "user.email", "specdojo@example.invalid");
  writeFileSync(join(repo, "README.md"), "# initial\n", "utf8");
  git(repo, "add", "README.md");
  git(repo, "commit", "-m", "initial");
  return repo;
}

describe("agent Git state guard", () => {
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
