import { spawnSync } from "node:child_process";
import { existsSync, lstatSync, mkdirSync, unlinkSync } from "node:fs";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { stripTerminalControlSequences } from "./exec-shared.js";
import { gitEnvironment } from "./git-environment.js";

export { GIT_LOCAL_ENV_VARS, gitEnvironment } from "./git-environment.js";

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

export function isGitDubiousOwnership(stderr: string): boolean {
  return /fatal:\s+detected dubious ownership in repository\b/i.test(stderr);
}

// Synchronously block the thread. gitResult is intentionally spawnSync-based (blocking), and we
// want to wait for a contended index.lock to be released before retrying rather than busy-loop.
function sleepSync(milliseconds: number): void {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);
}

type RetryableGitResult = {
  status: number | null;
  stderr: unknown;
};

export function runGitWithTransientRetry<T extends RetryableGitResult>(
  run: () => T,
  onDubiousOwnershipRetry: () => void = () => undefined,
): T {
  let indexLockRetries = 0;
  let canRetryDubiousOwnership = true;
  let result = run();

  while (result.status !== 0) {
    const stderr = typeof result.stderr === "string" ? result.stderr : "";
    if (canRetryDubiousOwnership && isGitDubiousOwnership(stderr)) {
      canRetryDubiousOwnership = false;
      onDubiousOwnershipRetry();
      result = run();
      continue;
    }
    if (indexLockRetries < INDEX_LOCK_RETRY_ATTEMPTS && isGitIndexLockContention(stderr)) {
      indexLockRetries += 1;
      sleepSync(INDEX_LOCK_RETRY_BASE_MS * indexLockRetries); // 50, 100, 150, 200, 250 ms
      result = run();
      continue;
    }
    break;
  }
  return result;
}

export function gitResult(repoRoot: string, args: string[]): ReturnType<typeof spawnSync> {
  const run = (): ReturnType<typeof spawnSync> =>
    spawnSync("git", ["-C", repoRoot, ...args], {
      encoding: "utf8",
      env: gitEnvironment(),
      stdio: ["ignore", "pipe", "pipe"],
    });

  return runGitWithTransientRetry(run, () => {
    const summary = summarizeGitArguments(args);
    process.stderr.write(
      `warning: git command failed with dubious ownership; retrying once` +
        ` (cwd: ${repoRoot}${summary ? `, args: ${summary}` : ""})\n`,
    );
  });
}

// git 失敗メッセージは register イベントの reason、result の block_reason、実行ログの一覧行の
// いずれでも長さ上限で切り詰められて記録される。commit のように pathspec が全件並ぶコマンドでは、
// 引数をそのまま連ねると失敗原因（stderr）が上限の外へ押し出されて残らない。原因を先頭付近へ置き、
// 引数は pathspec を件数へ要約したうえで末尾に添える。
const MAX_GIT_ARGUMENT_LENGTH = 40;
const MAX_GIT_ARGUMENT_SUMMARY_LENGTH = 120;

function abbreviate(value: string, limit: number): string {
  return value.length <= limit ? value : `${value.slice(0, Math.max(0, limit - 1))}…`;
}

// `--` 以降の pathspec は件数へ、それ以外の引数は 1 件ずつ長さを制限して要約する。
export function summarizeGitArguments(args: readonly string[]): string {
  const separatorIndex = args.indexOf("--");
  const head = separatorIndex === -1 ? args : args.slice(0, separatorIndex);
  const parts = head.map((arg) => abbreviate(arg, MAX_GIT_ARGUMENT_LENGTH));
  if (separatorIndex !== -1) {
    const pathCount = args.length - separatorIndex - 1;
    parts.push(`-- ${pathCount} ${pathCount === 1 ? "path" : "paths"}`);
  }
  return abbreviate(parts.join(" "), MAX_GIT_ARGUMENT_SUMMARY_LENGTH);
}

// git は進捗を `\r` で上書きしながら stderr へ書く（`Updating files: 52% (2412/4638)` など）。
// 失敗理由へ stderr 全文を載せると進捗が文字数を占有し、register の block_reason が
// 切り詰められた際に、進捗の後ろへ出る原因行が失われる。行ごとに `\r` の最終表示だけを
// 残し、進捗だけの行を落としたうえで、原因が書かれる側から行を採る。
const GIT_PROGRESS_LINE =
  /^(?:remote: )?(?:Updating files|Receiving objects|Resolving deltas|Counting objects|Compressing objects|Writing objects|Enumerating objects|Checking out files|Unpacking objects|Filtering content)\b.*?\d+%/u;

const GIT_CAUSE_LINE =
  /(?:\bfatal\b|\berror\b|\bwarning\b|\bCONFLICT\b|\bdenied\b|\bNo space left\b)/i;

const GIT_FAILURE_REASON_MAX_LENGTH = 400;

export function summarizeGitStderr(
  stderr: string,
  maxLength: number = GIT_FAILURE_REASON_MAX_LENGTH,
): string {
  const lines = stripTerminalControlSequences(stderr)
    .split("\n")
    // `\r` は同じ行の上書きを表すため、最後に表示された内容だけを残す。
    .map((line) => line.split("\r").at(-1) ?? "")
    .map((line) => line.trim())
    .filter((line) => line !== "" && !GIT_PROGRESS_LINE.test(line));
  if (lines.length === 0) return "";

  const causes = lines.filter((line) => GIT_CAUSE_LINE.test(line));
  // 原因を示す行が無い場合は、進捗の後ろに残った末尾側の行を採る。先頭は
  // `Preparing worktree ...` のような手順の告知で、失敗の原因を含まない。
  const selected = causes.length > 0 ? causes : lines.slice(-2);
  const joined = selected.join(" / ");
  return joined.length <= maxLength ? joined : `${joined.slice(0, maxLength - 1)}…`;
}

export function formatGitCommandFailure(args: readonly string[], stderr: string): string {
  const subcommandIndex = args.findIndex((arg) => !arg.startsWith("-"));
  const label = subcommandIndex === -1 ? "git" : `git ${args[subcommandIndex]}`;
  const summary = summarizeGitArguments(
    subcommandIndex === -1
      ? args
      : [...args.slice(0, subcommandIndex), ...args.slice(subcommandIndex + 1)],
  );
  const detail = summary ? ` (args: ${summary})` : "";
  const cause = summarizeGitStderr(stderr);
  return cause ? `${label} failed: ${cause}${detail}` : `${label} failed${detail}`;
}

// lefthook などの hook 出力から、block reason に載せる「失敗ステップ名 + 最初のエラー行」
// を取り出す。罫線や ANSI 制御は監査ログには残す一方、短い理由には混ぜない。
export function summarizeGitHookFailure(output: string): string {
  const lines = stripTerminalControlSequences(output)
    .split(/\r?\n/)
    .map((line) =>
      line
        .trim()
        .replace(/^[│┃║╎┆┊┋┇┌┐└┘├┤┬┴┼╭╮╰╯┏┓┗┛─━═\s]+/u, "")
        .replace(/[│┃║╎┆┊┋┇┌┐└┘├┤┬┴┼╭╮╰╯┏┓┗┛─━═\s]+$/u, "")
        .trim(),
    )
    .filter(Boolean);
  if (lines.length === 0) return "unknown hook failure";

  let step = "";
  let stepIndex = -1;
  for (const [index, line] of lines.entries()) {
    const match = line.match(/^(.+?)\s*[❯▶]\s*$/u);
    if (!match) continue;
    step = match[1]!.trim();
    stepIndex = index;
    break;
  }

  const isDecoration = (line: string): boolean =>
    /^(?:hook output|summary:|exit status\b|failed steps?:|skip(?:ped)?\b)/i.test(line) ||
    /^[✓✔✗✘✕❯▶]+$/u.test(line);
  const errorLine = lines
    .slice(stepIndex >= 0 ? stepIndex + 1 : 0)
    .find((line) => line !== step && !isDecoration(line) && !/[❯▶]\s*$/u.test(line));

  if (step && errorLine) return `${step}: ${errorLine}`;
  if (step) return step;
  return (
    lines.find((line) => /(?:\bCONFLICT\b|\bfatal:|\berror:|\bfailed\b)/i.test(line)) ??
    lines.find((line) => !isDecoration(line)) ??
    lines[0]!
  );
}

// message は block reason 向けに要約する一方、調査に必要な stderr 全文は失わない。
export class GitCommandError extends Error {
  constructor(
    message: string,
    readonly args: readonly string[],
    readonly stderr: string,
  ) {
    super(message);
    this.name = "GitCommandError";
  }
}

export function gitOutput(repoRoot: string, args: string[]): string {
  const result = gitResult(repoRoot, args);
  if (result.status !== 0) {
    const stderr = typeof result.stderr === "string" ? result.stderr : "";
    throw new GitCommandError(formatGitCommandFailure(args, stderr), args, stderr);
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

export function ensureExecWorktree(opts: {
  repoRoot: string;
  worktreeBase: string;
  taskId: string;
  startPoint?: string;
  installDependencies?: (worktreePath: string) => void;
  generateArtifacts?: (worktreePath: string) => void;
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
    (opts.generateArtifacts ?? generateWorktreeArtifacts)(worktreePath);
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
    : [
        "worktree",
        "add",
        worktreePath,
        "-b",
        branch,
        ...(opts.startPoint ? [opts.startPoint] : []),
      ];
  gitOutput(repoRoot, args);

  (opts.installDependencies ?? installWorktreeDependencies)(worktreePath);
  (opts.generateArtifacts ?? generateWorktreeArtifacts)(worktreePath);
  return { path: worktreePath, branch, name, created: true };
}
