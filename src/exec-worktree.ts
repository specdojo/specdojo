import { spawnSync } from "node:child_process";
import { existsSync, lstatSync, mkdirSync, symlinkSync } from "node:fs";
import { isAbsolute, join, relative, resolve, sep } from "node:path";

export type ExecWorktree = {
  path: string;
  branch: string;
  name: string;
  created: boolean;
};

export type RegisteredWorktree = {
  path: string;
  branch?: string;
};

const GIT_LOCAL_ENV_VARS = [
  "GIT_ALTERNATE_OBJECT_DIRECTORIES",
  "GIT_COMMON_DIR",
  "GIT_DIR",
  "GIT_GRAFT_FILE",
  "GIT_IMPLICIT_WORK_TREE",
  "GIT_INDEX_FILE",
  "GIT_NO_REPLACE_OBJECTS",
  "GIT_OBJECT_DIRECTORY",
  "GIT_PREFIX",
  "GIT_REPLACE_REF_BASE",
  "GIT_SHALLOW_FILE",
  "GIT_WORK_TREE",
] as const;

export function gitEnvironment(): NodeJS.ProcessEnv {
  const env = { ...process.env };
  for (const name of GIT_LOCAL_ENV_VARS) delete env[name];
  return env;
}

export function gitResult(repoRoot: string, args: string[]): ReturnType<typeof spawnSync> {
  return spawnSync("git", ["-C", repoRoot, ...args], {
    encoding: "utf8",
    env: gitEnvironment(),
    stdio: ["ignore", "pipe", "pipe"],
  });
}

export function gitOutput(repoRoot: string, args: string[]): string {
  const result = gitResult(repoRoot, args);
  if (result.status !== 0) {
    const stderr = typeof result.stderr === "string" ? result.stderr.trim() : "";
    throw new Error(`git ${args.join(" ")} failed${stderr ? `: ${stderr}` : ""}`);
  }
  return typeof result.stdout === "string" ? result.stdout : "";
}

export function worktreeNameFromTaskId(value: string): string {
  const slug = value
    .trim()
    .replace(/[^A-Za-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!slug) throw new Error(`Task ID cannot be used as a worktree name: ${value}`);
  return slug;
}

export function resolveWorktreeBase(
  repoRoot: string,
  override: string | undefined,
  configured: string | undefined,
): string {
  const value = override?.trim() || configured?.trim() || "../worktrees";
  return isAbsolute(value) ? resolve(value) : resolve(repoRoot, value);
}

export function listRegisteredWorktrees(repoRoot: string): RegisteredWorktree[] {
  const output = gitOutput(repoRoot, ["worktree", "list", "--porcelain"]);
  const result: RegisteredWorktree[] = [];
  let currentPath: string | undefined;
  let currentBranch: string | undefined;

  function pushCurrent(): void {
    if (currentPath) result.push({ path: currentPath, branch: currentBranch });
    currentPath = undefined;
    currentBranch = undefined;
  }

  for (const line of output.split(/\r?\n/)) {
    if (line.startsWith("worktree ")) {
      pushCurrent();
      currentPath = resolve(line.slice("worktree ".length));
    } else if (currentPath && line.startsWith("branch refs/heads/")) {
      currentBranch = line.slice("branch refs/heads/".length);
    } else if (line === "") {
      pushCurrent();
    }
  }
  pushCurrent();

  return result;
}

export function findExecWorktree(repoRoot: string, taskId: string): ExecWorktree | null {
  const name = worktreeNameFromTaskId(taskId);
  const branch = `exec/${name}`;
  const registered = listRegisteredWorktrees(repoRoot).find((item) => item.branch === branch);
  if (!registered) return null;
  return { path: registered.path, branch, name, created: false };
}

export function execBranchExists(repoRoot: string, taskId: string): boolean {
  const branch = `exec/${worktreeNameFromTaskId(taskId)}`;
  return (
    gitResult(repoRoot, ["show-ref", "--verify", "--quiet", `refs/heads/${branch}`]).status === 0
  );
}

function pathEntryExists(target: string): boolean {
  try {
    lstatSync(target);
    return true;
  } catch {
    return false;
  }
}

// Git worktree は独自の作業ツリーを持つだけで node_modules は引き継がないため、
// pre-commit フック（vitest / tsx 等）が依存解決できず commit が失敗する。
// 同一マシン・同一プラットフォーム前提で、リポジトリの node_modules を共有リンクする。
export function ensureNodeModulesLink(repoRoot: string, worktreePath: string): void {
  const source = join(repoRoot, "node_modules");
  if (!existsSync(source)) return;
  const target = join(worktreePath, "node_modules");
  if (pathEntryExists(target)) return;
  symlinkSync(source, target, "dir");
}

export function ensureExecWorktree(opts: {
  repoRoot: string;
  worktreeBase: string;
  taskId: string;
}): ExecWorktree {
  const repoRoot = resolve(opts.repoRoot);
  const baseRelative = relative(repoRoot, resolve(opts.worktreeBase));
  if (baseRelative === "" || (!baseRelative.startsWith(`..${sep}`) && baseRelative !== "..")) {
    throw new Error(`Worktree base must be outside the repository: ${opts.worktreeBase}`);
  }
  const name = worktreeNameFromTaskId(opts.taskId);
  const branch = `exec/${name}`;
  const worktreePath = resolve(join(opts.worktreeBase, name));
  const registered = listRegisteredWorktrees(repoRoot);
  const registeredAtPath = registered.find((item) => item.path === worktreePath);

  if (registeredAtPath) {
    if (!existsSync(worktreePath)) {
      throw new Error(`Registered worktree path does not exist: ${worktreePath}`);
    }
    if (registeredAtPath.branch !== branch) {
      throw new Error(
        `Worktree ${worktreePath} uses branch ${registeredAtPath.branch ?? "(detached)"}; expected ${branch}`,
      );
    }
    ensureNodeModulesLink(repoRoot, worktreePath);
    return { path: worktreePath, branch, name, created: false };
  }

  if (existsSync(worktreePath)) {
    throw new Error(`Worktree path already exists but is not registered: ${worktreePath}`);
  }

  mkdirSync(opts.worktreeBase, { recursive: true });
  const branchExists =
    gitResult(repoRoot, ["show-ref", "--verify", "--quiet", `refs/heads/${branch}`]).status === 0;
  const args = branchExists
    ? ["worktree", "add", worktreePath, branch]
    : ["worktree", "add", worktreePath, "-b", branch];
  gitOutput(repoRoot, args);

  ensureNodeModulesLink(repoRoot, worktreePath);
  return { path: worktreePath, branch, name, created: true };
}
