import { spawnSync } from "node:child_process";
import { existsSync, lstatSync, mkdirSync, unlinkSync } from "node:fs";
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

// git serializes index access through .git/index.lock and fails immediately (no wait) when it
// cannot acquire it. Under `exec run --parallel`, the parent's root-index operations and the
// concurrent worktree commits (each firing lefthook pre-commit hooks that invoke git) contend
// for that lock, surfacing as "Unable to create '.../index.lock'". A failed lock acquisition
// happens before git mutates anything, so retrying the same command is safe and idempotent.
const INDEX_LOCK_RETRY_ATTEMPTS = 5;
const INDEX_LOCK_RETRY_BASE_MS = 50;

export function isGitIndexLockContention(stderr: string): boolean {
  return (
    /Unable to create '[^']*index\.lock'/.test(stderr) ||
    /Another git process seems to be running/.test(stderr)
  );
}

// Synchronously block the thread. gitResult is intentionally spawnSync-based (blocking), and we
// want to wait for a contended index.lock to be released before retrying rather than busy-loop.
function sleepSync(milliseconds: number): void {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);
}

export function gitResult(repoRoot: string, args: string[]): ReturnType<typeof spawnSync> {
  const run = (): ReturnType<typeof spawnSync> =>
    spawnSync("git", ["-C", repoRoot, ...args], {
      encoding: "utf8",
      env: gitEnvironment(),
      stdio: ["ignore", "pipe", "pipe"],
    });

  let result = run();
  for (let attempt = 1; attempt <= INDEX_LOCK_RETRY_ATTEMPTS; attempt++) {
    if (result.status === 0) break;
    const stderr = typeof result.stderr === "string" ? result.stderr : "";
    if (!isGitIndexLockContention(stderr)) break;
    sleepSync(INDEX_LOCK_RETRY_BASE_MS * attempt); // 50, 100, 150, 200, 250 ms
    result = run();
  }
  return result;
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

function trackedPackageLockDirs(worktreePath: string): string[] {
  const output = gitOutput(worktreePath, [
    "ls-files",
    "-z",
    "--",
    "package-lock.json",
    "*/package-lock.json",
  ]);
  const dirs = new Set<string>();
  for (const entry of output.split("\0")) {
    if (!entry) continue;
    dirs.add(resolve(worktreePath, entry.slice(0, -"package-lock.json".length) || "."));
  }
  return [...dirs].sort();
}

export type NpmCiRunner = (packageDir: string) => void;

function runNpmCi(packageDir: string): void {
  const command = process.platform === "win32" ? "npm.cmd" : "npm";
  const result = spawnSync(command, ["ci", "--include=dev"], {
    cwd: packageDir,
    env: { ...process.env, CI: "true", LEFTHOOK: "0" },
    stdio: "inherit",
  });
  if (result.error) {
    throw new Error(`npm ci could not start in ${packageDir}: ${result.error.message}`);
  }
  if (result.status !== 0) {
    throw new Error(`npm ci failed in ${packageDir} (exit ${result.status ?? "unknown"})`);
  }
}

function removeLegacyNodeModulesLink(packageDir: string): void {
  const target = join(packageDir, "node_modules");
  if (!pathEntryExists(target) || !lstatSync(target).isSymbolicLink()) return;
  unlinkSync(target);
}

// Git worktree は独自の作業ツリーを持つだけで node_modules は引き継がないため、
// tracked package-lock.json ごとに npm ci を実行し、worktree 内へ独立して依存を配置する。
// 旧方式の共有 symlink は npm に辿らせず、先に link 自体だけを削除する。
export function installWorktreeDependencies(
  worktreePath: string,
  npmCi: NpmCiRunner = runNpmCi,
): void {
  for (const packageDir of trackedPackageLockDirs(resolve(worktreePath))) {
    if (!existsSync(join(packageDir, "package.json"))) {
      throw new Error(`package.json is missing next to package-lock.json: ${packageDir}`);
    }
    removeLegacyNodeModulesLink(packageDir);
    process.stdout.write(
      `Installing worktree dependencies: ${relative(worktreePath, packageDir) || "."}\n`,
    );
    npmCi(packageDir);
  }
}

export function ensureExecWorktree(opts: {
  repoRoot: string;
  worktreeBase: string;
  taskId: string;
  installDependencies?: (worktreePath: string) => void;
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
    (opts.installDependencies ?? installWorktreeDependencies)(worktreePath);
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

  (opts.installDependencies ?? installWorktreeDependencies)(worktreePath);
  return { path: worktreePath, branch, name, created: true };
}
