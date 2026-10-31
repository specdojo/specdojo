import { spawnSync } from "node:child_process";
import { existsSync, lstatSync, mkdirSync, rmSync, unlinkSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import {
  describeGitProcessFailure,
  formatGitCommandFailure,
  GitCommandError,
  gitEnvironment,
  gitOutput,
  gitResult,
} from "../shared/git.js";

export {
  appendGitFailureLog,
  appendGitResultFailureLog,
  describeGitProcessFailure,
  formatGitCommandFailure,
  formatGitResultFailure,
  GIT_LOCAL_ENV_VARS,
  GIT_OUTPUT_MAX_BUFFER,
  GitCommandError,
  gitEnvironment,
  gitOutput,
  gitResult,
  isGitDubiousOwnership,
  isGitIndexLockContention,
  isGitNotRepositoryWithGitMetadata,
  runGitWithTransientRetry,
  summarizeGitArguments,
  summarizeGitHookFailure,
  summarizeGitStderr,
  transientGitFailureReason,
} from "../shared/git.js";
export type {
  DubiousOwnershipRetryNotice,
  GitCommandOutcome,
  GitProcessOutcome,
  TransientGitRecovery,
  TransientGitRetryNotice,
  TransientGitRetryReason,
} from "../shared/git.js";

export type ExecWorktree = {
  path: string;
  branch: string;
  name: string;
  created: boolean;
  /**
   * Worktrees of the product repositories declared in `repos`, in declaration order. Absent for
   * projects without `repos`, which keep the single `<worktree_base>/<task-id>/` worktree.
   */
  repos?: ProductWorktree[];
};

/** Worktree of one declared product repository at `<worktree_base>/<task-id>/<name>/`. */
export type ProductWorktree = {
  /** Repository name from `repos[].name`. */
  name: string;
  /** Root of the product repository's main checkout (where the exec branch is created). */
  repoRoot: string;
  path: string;
  branch: string;
  created: boolean;
  /** Declared `integration_branch`; undefined means the repository's current branch. */
  integrationBranch?: string;
  /** Omitted means the conventional local merge commit. */
  integrationStrategy?: "merge" | "branch-only" | "ff";
};

export type RegisteredWorktree = {
  path: string;
  branch?: string;
};

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

export function findExecWorktree(
  repoRoot: string,
  taskId: string,
  branchOverride?: string,
): ExecWorktree | null {
  const name = worktreeNameFromTaskId(taskId);
  const branch = branchOverride ?? `exec/${name}`;
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
    env: { ...gitEnvironment(), CI: "true", LEFTHOOK: "0" },
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
// lock が無い worktree は導入しない。依存が無いまま検証が失敗したときに原因を追えるよう、
// 導入しなかったことをログに残す（PJR-86Q5）。
export function installWorktreeDependencies(
  worktreePath: string,
  npmCi: NpmCiRunner = runNpmCi,
): void {
  const packageDirs = trackedPackageLockDirs(resolve(worktreePath));
  if (packageDirs.length === 0) {
    process.stdout.write(
      `Skipping worktree dependencies: no tracked package-lock.json in ${worktreePath}\n`,
    );
    return;
  }
  for (const packageDir of packageDirs) {
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

export type WorktreeArtifactBuilder = (worktreePath: string) => void;

const SPECDOJO_CONFIG_REL = join(".specdojo", "specdojo.config.json");

// 生成物の失敗は成果物の失敗と混同されやすい。準備段階であることと、生成物が worktree ごとに
// 作り直しになる理由をメッセージ本体へ含める。
export function formatWorktreeBuildFailure(worktreePath: string, detail: string): string {
  return (
    `Worktree preparation failed: specdojo build ${detail} in ${worktreePath}. ` +
    `Generated docs are gitignored and must be rebuilt per worktree, so this is a ` +
    `preparation failure, not a task deliverable failure.`
  );
}

export type WorktreeCommand = { command: string; args: string[] };

// build は worktree 内で完結させる。依存と同じく、worktree の checkout にある CLI を使うため、
// 実行元プロセスの entry（テストランナー等）へは依存しない。SpecDojo 自身のリポジトリでは
// src の entry を worktree の tsx で、CLI を依存として使うリポジトリでは
// node_modules/.bin/specdojo を使う。
export function resolveWorktreeBuildCommand(worktreePath: string): WorktreeCommand | null {
  const root = resolve(worktreePath);
  const sourceEntry = join(root, "src", "specdojo.ts");
  const localTsx = join(root, "node_modules", ".bin", "tsx");
  if (existsSync(sourceEntry) && existsSync(localTsx)) {
    return { command: process.execPath, args: [localTsx, sourceEntry, "build"] };
  }
  const installedCli = join(
    root,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "specdojo.cmd" : "specdojo",
  );
  if (existsSync(installedCli)) return { command: installedCli, args: ["build"] };
  const builtEntry = join(root, "dist", "specdojo.js");
  if (existsSync(builtEntry)) return { command: process.execPath, args: [builtEntry, "build"] };
  return null;
}

// worktree を cwd にして build を実行する。child は cwd から .specdojo/specdojo.config.json を
// 辿るため、生成先は worktree 側になる。
function runWorktreeBuild(worktreePath: string): void {
  const resolved = resolveWorktreeBuildCommand(worktreePath);
  if (!resolved) {
    process.stdout.write(
      `Skipping worktree artifact generation: no SpecDojo CLI in ${worktreePath}\n`,
    );
    return;
  }
  process.stdout.write("Generating worktree artifacts: specdojo build\n");
  const result = spawnSync(resolved.command, resolved.args, {
    cwd: worktreePath,
    env: { ...gitEnvironment(), CI: "true", LEFTHOOK: "0" },
    stdio: "inherit",
  });
  if (result.error) {
    throw new Error(
      formatWorktreeBuildFailure(worktreePath, `could not start: ${result.error.message}`),
    );
  }
  if (result.status !== 0) {
    throw new Error(
      formatWorktreeBuildFailure(worktreePath, `exited with ${result.status ?? "unknown"}`),
    );
  }
}

// 生成物（docs/**/generated と .specdojo/doc-index.json）は .gitignore 済みで worktree へ
// 複製されない。生成物の存在を前提とする検証は、成果物と無関係に失敗するため、依存の install
// 直後にまとめて生成する。生成対象が増えても追従が要らないよう、scope を絞らず build を通しで
// 実行する（全 scope で数秒。npm ci に対して無視できる）。
export function generateWorktreeArtifacts(
  worktreePath: string,
  build: WorktreeArtifactBuilder = runWorktreeBuild,
): void {
  const root = resolve(worktreePath);
  // SpecDojo の設定を持たないリポジトリには生成物が無い。build は失敗するだけなので実行しない。
  if (!existsSync(join(root, SPECDOJO_CONFIG_REL))) return;
  build(root);
}

/**
 * Path of a task worktree. Without `repoDirName` (projects without `repos`) the worktree is
 * `<base>/<task-name>/`; with it, each repository gets `<base>/<task-name>/<repoDirName>/`.
 */
export function execWorktreePath(
  worktreeBase: string,
  taskId: string,
  repoDirName?: string,
): string {
  const name = worktreeNameFromTaskId(taskId);
  return resolve(repoDirName ? join(worktreeBase, name, repoDirName) : join(worktreeBase, name));
}

function branchTip(repoRoot: string, branch: string): string | undefined {
  const args = ["rev-parse", "--verify", "--quiet", `refs/heads/${branch}^{commit}`];
  const result = gitResult(repoRoot, args);
  if (result.status === 1 && !result.error) return undefined;
  if (result.status !== 0 || result.error) {
    const stderr = typeof result.stderr === "string" ? result.stderr : "";
    throw new GitCommandError(
      formatGitCommandFailure(args, stderr, describeGitProcessFailure(result)),
      args,
      stderr,
    );
  }
  if (typeof result.stdout !== "string") return undefined;
  return result.stdout.trim();
}

function assertExpectedBranchTip(repoRoot: string, branch: string, expectedCommit: string): void {
  const actualCommit = branchTip(repoRoot, branch);
  if (actualCommit === expectedCommit) return;
  throw new Error(
    `Existing branch ${branch} points to ${actualCommit ?? "an unreadable commit"}; ` +
      `expected ${expectedCommit}. Refusing to delete or reuse it.`,
  );
}

function recoverWorktreeAddAfterTransientFailure(params: {
  repoRoot: string;
  worktreePath: string;
  branch: string;
  expectedCommit: string;
  branchWasCreatedByAdd: boolean;
}): boolean {
  const { repoRoot, worktreePath, branch, expectedCommit, branchWasCreatedByAdd } = params;
  let registered = listRegisteredWorktrees(repoRoot);
  const registeredAtPath = registered.find((item) => item.path === worktreePath);

  if (registeredAtPath) {
    if (registeredAtPath.branch !== branch) {
      throw new Error(
        `Worktree ${worktreePath} uses branch ${registeredAtPath.branch ?? "(detached)"}; ` +
          `expected ${branch}. Refusing to remove it after a transient Git failure.`,
      );
    }
    assertExpectedBranchTip(repoRoot, branch, expectedCommit);
    if (existsSync(worktreePath)) return true;

    // The add registered the worktree but did not leave its directory behind. Prune only the
    // missing registration; a live worktree at another path is never removed by this recovery.
    gitOutput(repoRoot, ["worktree", "prune", "--expire=now"]);
    registered = listRegisteredWorktrees(repoRoot);
    if (registered.some((item) => item.path === worktreePath)) {
      throw new Error(`Failed to prune incomplete worktree registration: ${worktreePath}`);
    }
  }

  const registeredForBranch = registered.find((item) => item.branch === branch);
  if (registeredForBranch) {
    throw new Error(
      `Branch ${branch} is already checked out at ${registeredForBranch.path}; ` +
        `refusing to alter it after a transient Git failure.`,
    );
  }

  // ensureExecWorktree rejected a pre-existing unregistered path before starting `worktree add`,
  // so an unregistered entry appearing here belongs to the failed attempt and is safe to remove.
  if (existsSync(worktreePath)) rmSync(worktreePath, { recursive: true, force: true });

  const actualCommit = branchTip(repoRoot, branch);
  if (actualCommit === undefined) return false;
  assertExpectedBranchTip(repoRoot, branch, expectedCommit);
  if (branchWasCreatedByAdd) gitOutput(repoRoot, ["branch", "-D", branch]);
  return false;
}

export function ensureExecWorktree(opts: {
  repoRoot: string;
  worktreeBase: string;
  taskId: string;
  startPoint?: string;
  /** Explicit product branch; project worktrees keep their conventional name. */
  branch?: string;
  /** Directory under `<base>/<task-name>/` for multi-repository tasks (see execWorktreePath). */
  repoDirName?: string;
  installDependencies?: (worktreePath: string) => void;
  generateArtifacts?: (worktreePath: string) => void;
}): ExecWorktree {
  const repoRoot = resolve(opts.repoRoot);
  const baseRelative = relative(repoRoot, resolve(opts.worktreeBase));
  if (baseRelative === "" || (!baseRelative.startsWith(`..${sep}`) && baseRelative !== "..")) {
    throw new Error(`Worktree base must be outside the repository: ${opts.worktreeBase}`);
  }
  const name = worktreeNameFromTaskId(opts.taskId);
  const branch = opts.branch ?? `exec/${name}`;
  const worktreePath = execWorktreePath(opts.worktreeBase, opts.taskId, opts.repoDirName);
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
    (opts.generateArtifacts ?? generateWorktreeArtifacts)(worktreePath);
    return { path: worktreePath, branch, name, created: false };
  }

  if (existsSync(worktreePath)) {
    throw new Error(`Worktree path already exists but is not registered: ${worktreePath}`);
  }

  mkdirSync(dirname(worktreePath), { recursive: true });
  const expectedCommit = gitOutput(repoRoot, [
    "rev-parse",
    "--verify",
    `${opts.startPoint ?? "HEAD"}^{commit}`,
  ]).trim();
  const branchExists = branchTip(repoRoot, branch) !== undefined;
  const registeredForBranch = registered.find((item) => item.branch === branch);
  if (registeredForBranch) {
    throw new Error(`Branch ${branch} is already checked out at ${registeredForBranch.path}`);
  }
  if (branchExists) assertExpectedBranchTip(repoRoot, branch, expectedCommit);
  const args = branchExists
    ? ["worktree", "add", worktreePath, branch]
    : [
        "worktree",
        "add",
        worktreePath,
        "-b",
        branch,
        ...(opts.startPoint ? [opts.startPoint] : []),
      ];
  gitOutput(repoRoot, args, () =>
    recoverWorktreeAddAfterTransientFailure({
      repoRoot,
      worktreePath,
      branch,
      expectedCommit,
      branchWasCreatedByAdd: !branchExists,
    }),
  );

  (opts.installDependencies ?? installWorktreeDependencies)(worktreePath);
  (opts.generateArtifacts ?? generateWorktreeArtifacts)(worktreePath);
  return { path: worktreePath, branch, name, created: true };
}
