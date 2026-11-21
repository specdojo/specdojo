import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { gitEnvironment } from "../../src/shared/git-environment.js";

const packageRoot = process.cwd();
const fixtures: string[] = [];

function git(cwd: string, ...args: string[]): string {
  return execFileSync("git", args, {
    cwd,
    env: gitEnvironment(),
    input: "",
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  }).trim();
}

function fixture(linked: boolean, command: string): string {
  const root = mkdtempSync(join(tmpdir(), "specdojo-merge-hook-"));
  fixtures.push(root);
  const repo = join(root, "main");
  mkdirSync(repo);
  git(repo, "init", "--initial-branch=main");
  // Plumbing creates the history without invoking unrelated commit hooks or changing Git config.
  const tree = git(repo, "mktree");
  const base = git(repo, "commit-tree", tree, "-m", "chore: initial");
  const incoming = git(repo, "commit-tree", tree, "-p", base, "-m", "fix: incoming");
  git(repo, "update-ref", "refs/heads/main", base);
  git(repo, "update-ref", "refs/heads/incoming", incoming);
  const cwd = linked ? join(root, "linked job") : repo;
  if (linked) git(repo, "worktree", "add", "-b", "job", cwd, base);
  symlinkSync(join(packageRoot, "node_modules"), join(cwd, "node_modules"), "dir");
  copyFileSync(join(packageRoot, "commitlint.config.cjs"), join(cwd, "commitlint.config.cjs"));
  writeFileSync(
    join(cwd, "lefthook.yml"),
    `commit-msg:\n  commands:\n    commitlint:\n      run: ${command}\n`,
  );
  execFileSync(join(packageRoot, "node_modules/.bin/lefthook"), ["install"], {
    cwd,
    env: gitEnvironment(),
    stdio: "pipe",
  });
  return cwd;
}

function merge(cwd: string, message: string) {
  return spawnSync("git", ["merge", "--no-ff", "-m", message, "incoming"], {
    cwd,
    env: gitEnvironment(),
    encoding: "utf8",
  });
}

afterEach(() => {
  for (const root of fixtures.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("commit-msg during merge (PJR-A7CR)", () => {
  it("旧 $1 は主の作業ツリーの古い COMMIT_EDITMSG を検査し、不正な merge を通す", () => {
    const cwd = fixture(false, "npx commitlint --edit $1");
    writeFileSync(
      resolve(cwd, git(cwd, "rev-parse", "--git-path", "COMMIT_EDITMSG")),
      "fix: stale\n",
    );
    const result = merge(cwd, "invalid merge message");
    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(git(cwd, "log", "-1", "--format=%s")).toBe("invalid merge message");
  });

  it("旧 $1 は新しい linked worktree で COMMIT_EDITMSG がないため失敗する", () => {
    const cwd = fixture(true, "npx commitlint --edit $1");
    const result = merge(cwd, "fix(exec): merge approved register");
    expect(result.status).not.toBe(0);
    expect(result.stdout + result.stderr).toMatch(/COMMIT_EDITMSG/);
    expect(result.stdout + result.stderr).toMatch(/ENOENT|No commit message file found/);
  });

  // Protected lefthook.yml is changed by the orchestrator. Exercise its proposed command
  // here so the runner can validate the fix before that configuration is applied.
  describe.each([false, true])("提案した {1}（linked=%s）", (linked) => {
    it("正しい merge メッセージを通し、古い不正メッセージを読まない", () => {
      const cwd = fixture(linked, 'npx commitlint --edit "{1}"');
      writeFileSync(
        resolve(cwd, git(cwd, "rev-parse", "--git-path", "COMMIT_EDITMSG")),
        "invalid stale message\n",
      );
      const result = merge(cwd, "fix(exec): merge approved register");
      expect(result.status, result.stdout + result.stderr).toBe(0);
      expect(git(cwd, "log", "-1", "--format=%s")).toBe("fix(exec): merge approved register");
      expect(git(cwd, "rev-list", "--parents", "-1", "HEAD").split(" ")).toHaveLength(3);
    });

    it("古い正しいメッセージがあっても不正な merge メッセージを拒否する", () => {
      const cwd = fixture(linked, 'npx commitlint --edit "{1}"');
      writeFileSync(
        resolve(cwd, git(cwd, "rev-parse", "--git-path", "COMMIT_EDITMSG")),
        "fix: stale\n",
      );
      const result = merge(cwd, "invalid merge message");
      expect(result.status).not.toBe(0);
      expect(result.stdout + result.stderr).toContain("invalid merge message");
      expect(result.stdout + result.stderr).toMatch(/type-empty|subject-empty/);
      expect(git(cwd, "log", "-1", "--format=%s")).toBe("chore: initial");
    });
  });
});
