import { execFileSync } from "node:child_process";
import {
  chmodSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { join, relative, resolve } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import {
  ensureExecWorktree,
  execBranchExists,
  findExecWorktree,
  gitEnvironment,
  installWorktreeDependencies,
  isGitIndexLockContention,
  listRegisteredWorktrees,
  resolveWorktreeBase,
  worktreeNameFromTaskId,
} from "../../src/exec-worktree.js";
import { isCommitTargetPath, stabilizeCommitTargets } from "../../src/exec-worktree-command.js";

function git(cwd: string, ...args: string[]): string {
  return execFileSync("git", args, { cwd, encoding: "utf8", env: gitEnvironment() }).trim();
}

function createGitRepository(): string {
  const repo = mkdtempSync(join(tmpdir(), "specdojo-worktree-repo-"));
  git(repo, "init");
  git(repo, "config", "user.name", "SpecDojo Test");
  git(repo, "config", "user.email", "specdojo@example.invalid");
  writeFileSync(join(repo, "README.md"), "# test\n", "utf8");
  git(repo, "add", "README.md");
  git(repo, "commit", "-m", "initial");
  return repo;
}

function addNpmPackage(repo: string, packagePath = "."): void {
  const packageDir = resolve(repo, packagePath);
  const name = packagePath === "." ? "fixture-root" : "fixture-package";
  mkdirSync(packageDir, { recursive: true });
  writeFileSync(
    join(packageDir, "package.json"),
    `${JSON.stringify({ name, version: "1.0.0" }, null, 2)}\n`,
    "utf8",
  );
  writeFileSync(
    join(packageDir, "package-lock.json"),
    `${JSON.stringify(
      {
        name,
        version: "1.0.0",
        lockfileVersion: 3,
        requires: true,
        packages: { "": { name, version: "1.0.0" } },
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
  git(repo, "add", relative(repo, join(packageDir, "package.json")));
  git(repo, "add", relative(repo, join(packageDir, "package-lock.json")));
}

describe("isGitIndexLockContention", () => {
  it("detects the index.lock contention message git prints under parallel access", () => {
    const stderr =
      "fatal: Unable to create '/workspaces/specdojo-workspace/specdojo/.git/index.lock': File exists.";

    expect(isGitIndexLockContention(stderr)).toBe(true);
  });

  it("detects the secondary 'Another git process seems to be running' notice", () => {
    expect(
      isGitIndexLockContention("Another git process seems to be running in this repository"),
    ).toBe(true);
  });

  it("does not treat ordinary git failures as lock contention", () => {
    expect(isGitIndexLockContention("error: pathspec 'missing.md' did not match any file(s)")).toBe(
      false,
    );
    expect(isGitIndexLockContention("")).toBe(false);
  });
});

describe("exec worktree", () => {
  it("resolves override, configured, and default worktree bases", () => {
    const root = resolve("/tmp/specdojo-root");
    expect(resolveWorktreeBase(root, "/tmp/custom", "../configured")).toBe(resolve("/tmp/custom"));
    expect(resolveWorktreeBase(root, undefined, "../configured")).toBe(
      resolve(root, "../configured"),
    );
    expect(resolveWorktreeBase(root, undefined, undefined)).toBe(resolve(root, "../worktrees"));
  });

  it("creates and reuses a task worktree", () => {
    const repo = createGitRepository();
    const base = mkdtempSync(join(tmpdir(), "specdojo-worktree-base-"));
    try {
      const created = ensureExecWorktree({
        repoRoot: repo,
        worktreeBase: base,
        taskId: "prj-0001:T-LAUNCH-pm-plan-010",
      });

      expect(created.created).toBe(true);
      expect(created.name).toBe("prj-0001-T-LAUNCH-pm-plan-010");
      expect(created.branch).toBe("exec/prj-0001-T-LAUNCH-pm-plan-010");
      expect(existsSync(join(created.path, "README.md"))).toBe(true);
      expect(git(created.path, "branch", "--show-current")).toBe(created.branch);
      expect(execBranchExists(repo, "prj-0001:T-LAUNCH-pm-plan-010")).toBe(true);
      expect(findExecWorktree(repo, "prj-0001:T-LAUNCH-pm-plan-010")).toEqual({
        ...created,
        created: false,
      });
      expect(listRegisteredWorktrees(repo)).toContainEqual({
        path: created.path,
        branch: created.branch,
      });

      const reused = ensureExecWorktree({
        repoRoot: repo,
        worktreeBase: base,
        taskId: "prj-0001:T-LAUNCH-pm-plan-010",
      });
      expect(reused).toEqual({ ...created, created: false });
    } finally {
      rmSync(repo, { recursive: true, force: true });
      rmSync(base, { recursive: true, force: true });
    }
  });

  it("creates a new worktree from an explicit start point", () => {
    const repo = createGitRepository();
    const base = mkdtempSync(join(tmpdir(), "specdojo-worktree-base-"));
    try {
      const startPoint = git(repo, "rev-parse", "HEAD");
      writeFileSync(join(repo, "later.txt"), "later\n", "utf8");
      git(repo, "add", "later.txt");
      git(repo, "commit", "-m", "later");

      const created = ensureExecWorktree({
        repoRoot: repo,
        worktreeBase: base,
        taskId: "prj-0001:trial:cmp-001:agent-a",
        startPoint,
      });

      expect(git(created.path, "rev-parse", "HEAD")).toBe(startPoint);
      expect(existsSync(join(created.path, "later.txt"))).toBe(false);
    } finally {
      rmSync(repo, { recursive: true, force: true });
      rmSync(base, { recursive: true, force: true });
    }
  });

  it("installs root and package-local dependencies inside a newly created worktree", () => {
    const repo = createGitRepository();
    const base = mkdtempSync(join(tmpdir(), "specdojo-worktree-base-"));
    try {
      addNpmPackage(repo);
      addNpmPackage(repo, "tools/vscode-specdojo");
      git(repo, "commit", "-m", "add packages");
      const installed: string[] = [];

      const created = ensureExecWorktree({
        repoRoot: repo,
        worktreeBase: base,
        taskId: "prj-0001:T-LAUNCH-pm-plan-010",
        installDependencies: (worktreePath) =>
          installWorktreeDependencies(worktreePath, (packageDir) => {
            installed.push(relative(worktreePath, packageDir) || ".");
            mkdirSync(join(packageDir, "node_modules"));
            writeFileSync(join(packageDir, "node_modules", "marker.txt"), "ok\n", "utf8");
          }),
      });

      expect(installed).toEqual([".", "tools/vscode-specdojo"]);
      for (const packagePath of installed) {
        const nodeModules = resolve(created.path, packagePath, "node_modules");
        expect(lstatSync(nodeModules).isDirectory()).toBe(true);
        expect(lstatSync(nodeModules).isSymbolicLink()).toBe(false);
        expect(existsSync(join(nodeModules, "marker.txt"))).toBe(true);
      }
    } finally {
      rmSync(repo, { recursive: true, force: true });
      rmSync(base, { recursive: true, force: true });
    }
  });

  it("replaces a legacy node_modules symlink without modifying its source", () => {
    const repo = createGitRepository();
    const base = mkdtempSync(join(tmpdir(), "specdojo-worktree-base-"));
    try {
      addNpmPackage(repo);
      git(repo, "commit", "-m", "add package");
      const created = ensureExecWorktree({
        repoRoot: repo,
        worktreeBase: base,
        taskId: "prj-0001:T-LAUNCH-pm-plan-010",
        installDependencies: () => undefined,
      });

      const sourceNodeModules = join(repo, "node_modules");
      mkdirSync(sourceNodeModules);
      writeFileSync(join(sourceNodeModules, "source-marker.txt"), "keep\n", "utf8");
      symlinkSync(sourceNodeModules, join(created.path, "node_modules"), "dir");

      const reused = ensureExecWorktree({
        repoRoot: repo,
        worktreeBase: base,
        taskId: "prj-0001:T-LAUNCH-pm-plan-010",
        installDependencies: (worktreePath) =>
          installWorktreeDependencies(worktreePath, (packageDir) => {
            expect(existsSync(join(packageDir, "node_modules"))).toBe(false);
            mkdirSync(join(packageDir, "node_modules"));
            writeFileSync(join(packageDir, "node_modules", "local-marker.txt"), "ok\n", "utf8");
          }),
      });

      const installed = join(reused.path, "node_modules");
      expect(reused.created).toBe(false);
      expect(lstatSync(installed).isDirectory()).toBe(true);
      expect(lstatSync(installed).isSymbolicLink()).toBe(false);
      expect(existsSync(join(installed, "local-marker.txt"))).toBe(true);
      expect(existsSync(join(sourceNodeModules, "source-marker.txt"))).toBe(true);
    } finally {
      rmSync(repo, { recursive: true, force: true });
      rmSync(base, { recursive: true, force: true });
    }
  });

  it("does not install dependencies when the worktree has no tracked package-lock", () => {
    const repo = createGitRepository();
    const base = mkdtempSync(join(tmpdir(), "specdojo-worktree-base-"));
    try {
      const created = ensureExecWorktree({
        repoRoot: repo,
        worktreeBase: base,
        taskId: "prj-0001:T-LAUNCH-pm-plan-010",
      });

      expect(existsSync(join(created.path, "node_modules"))).toBe(false);
    } finally {
      rmSync(repo, { recursive: true, force: true });
      rmSync(base, { recursive: true, force: true });
    }
  });

  it("keeps a newly created worktree when dependency installation fails", () => {
    const repo = createGitRepository();
    const base = mkdtempSync(join(tmpdir(), "specdojo-worktree-base-"));
    const taskId = "prj-0001:T-LAUNCH-pm-plan-010";
    try {
      addNpmPackage(repo);
      git(repo, "commit", "-m", "add package");

      expect(() =>
        ensureExecWorktree({
          repoRoot: repo,
          worktreeBase: base,
          taskId,
          installDependencies: () => {
            throw new Error("npm ci failed");
          },
        }),
      ).toThrow("npm ci failed");

      const worktree = findExecWorktree(repo, taskId);
      expect(worktree).not.toBeNull();
      expect(existsSync(worktree?.path ?? "")).toBe(true);
    } finally {
      rmSync(repo, { recursive: true, force: true });
      rmSync(base, { recursive: true, force: true });
    }
  });

  it("ignores repository-local Git environment inherited from hooks", () => {
    const repo = createGitRepository();
    const base = mkdtempSync(join(tmpdir(), "specdojo-worktree-base-"));
    const originalIndexFile = process.env.GIT_INDEX_FILE;
    try {
      process.env.GIT_INDEX_FILE = ".git/index";
      const created = ensureExecWorktree({
        repoRoot: repo,
        worktreeBase: base,
        taskId: "prj-0001:T-LAUNCH-pm-plan-010",
      });
      expect(created.created).toBe(true);
      expect(existsSync(join(created.path, "README.md"))).toBe(true);
    } finally {
      if (originalIndexFile === undefined) delete process.env.GIT_INDEX_FILE;
      else process.env.GIT_INDEX_FILE = originalIndexFile;
      rmSync(repo, { recursive: true, force: true });
      rmSync(base, { recursive: true, force: true });
    }
  });

  it("normalizes task ids for worktree and branch names", () => {
    expect(worktreeNameFromTaskId("prj-0001:T-LAUNCH-pm-plan-010")).toBe(
      "prj-0001-T-LAUNCH-pm-plan-010",
    );
    expect(() => worktreeNameFromTaskId("***")).toThrow("Task ID");
  });

  it("rejects a worktree base inside the repository", () => {
    const repo = createGitRepository();
    try {
      expect(() =>
        ensureExecWorktree({
          repoRoot: repo,
          worktreeBase: join(repo, "worktrees"),
          taskId: "T-LAUNCH-pm-plan-010",
        }),
      ).toThrow("outside the repository");
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("selects result and deliverable paths while excluding execution bookkeeping", () => {
    const execution = "docs/project/execution";
    const result = `${execution}/exec/results/T-001-result.md`;

    expect(isCommitTargetPath("docs/project/deliverable.md", execution, result)).toBe(true);
    expect(isCommitTargetPath(result, execution, result)).toBe(true);
    expect(isCommitTargetPath(`${execution}/exec/results/T-002-result.md`, execution, result)).toBe(
      false,
    );
    expect(isCommitTargetPath(`${execution}/exec/plans/T-001-plan.md`, execution, result)).toBe(
      false,
    );
    expect(isCommitTargetPath(`${execution}/exec/events/event.json`, execution, result)).toBe(
      false,
    );
    expect(isCommitTargetPath(`${execution}/generated/state.json`, execution, result)).toBe(false);
  });

  it("excludes the regenerated doc-index so merges do not overlap on it", () => {
    const execution = "docs/project/execution";
    const result = `${execution}/exec/results/T-001-result.md`;

    expect(isCommitTargetPath(".specdojo/doc-index.json", execution, result)).toBe(false);
  });

  it("amends files generated by a pre-commit hook into the task commit", () => {
    const repo = createGitRepository();
    try {
      const hookPath = join(repo, ".git", "hooks", "pre-commit");
      writeFileSync(hookPath, '#!/bin/sh\nprintf "generated\\n" > generated.txt\n', "utf8");
      chmodSync(hookPath, 0o755);

      writeFileSync(join(repo, "README.md"), "# changed\n", "utf8");
      git(repo, "add", "README.md");
      git(repo, "commit", "-m", "task change", "--", "README.md");

      stabilizeCommitTargets(repo, () =>
        git(repo, "status", "--porcelain", "--", "generated.txt") ? ["generated.txt"] : [],
      );

      expect(git(repo, "show", "HEAD:generated.txt")).toBe("generated");
      expect(git(repo, "status", "--porcelain")).toBe("");
      expect(git(repo, "rev-list", "--count", "HEAD")).toBe("2");
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });
});
