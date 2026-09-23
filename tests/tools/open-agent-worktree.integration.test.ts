import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { gitEnvironment } from "../../src/exec-worktree.js";

const scriptPath = path.resolve("tools/worktree/open-agent-worktree.sh");
const fixtures: string[] = [];

function git(cwd: string, ...args: string[]): string {
  return execFileSync("git", args, {
    cwd,
    env: gitEnvironment(),
    encoding: "utf8",
  }).trim();
}

function createFixture(): { repo: string; worktree: string } {
  const root = mkdtempSync(path.join(tmpdir(), "specdojo-agent-worktree-"));
  fixtures.push(root);
  const repo = path.join(root, "repo");
  const worktree = path.join(root, "worktrees", "codex-work");
  mkdirSync(repo);
  git(repo, "init", "--initial-branch=main");
  writeFileSync(path.join(repo, "README.md"), "fixture\n", "utf8");
  git(repo, "add", "README.md");
  git(repo, "commit", "-m", "initial");
  return { repo, worktree };
}

afterEach(() => {
  for (const root of fixtures.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("tools/worktree/open-agent-worktree.sh", () => {
  it("creates and reattaches the namespaced branch at the standard path", () => {
    const { repo, worktree } = createFixture();

    execFileSync(scriptPath, ["codex-work", process.execPath, "-e", "process.exit(0)"], {
      cwd: repo,
      env: gitEnvironment(),
    });
    expect(git(worktree, "branch", "--show-current")).toBe("worktree/codex-work");

    git(repo, "worktree", "remove", worktree);
    execFileSync(scriptPath, ["codex-work", process.execPath, "-e", "process.exit(0)"], {
      cwd: repo,
      env: gitEnvironment(),
    });
    expect(git(worktree, "branch", "--show-current")).toBe("worktree/codex-work");
  });

  it("refuses to start an agent when the existing worktree uses another branch", () => {
    const { repo, worktree } = createFixture();
    mkdirSync(path.dirname(worktree), { recursive: true });
    git(repo, "worktree", "add", "-b", "codex-work", worktree);

    const result = spawnSync(
      scriptPath,
      ["codex-work", process.execPath, "-e", "process.exit(0)"],
      {
        cwd: repo,
        env: gitEnvironment(),
        encoding: "utf8",
      },
    );

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("actual=codex-work expected=worktree/codex-work");
  });
});
