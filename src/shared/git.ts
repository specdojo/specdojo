import { spawnSync } from "node:child_process";
import {
  appendFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
} from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { gitEnvironment } from "./git-environment.js";
import { redactSensitiveText, stripTerminalControlSequences } from "./text.js";

export { GIT_LOCAL_ENV_VARS, gitEnvironment } from "./git-environment.js";

// git serializes index access through .git/index.lock and fails immediately (no wait) when it
// cannot acquire it. Under `exec run --parallel`, the parent's root-index operations and the
// concurrent worktree commits (each firing lefthook pre-commit hooks that invoke git) contend
// for that lock, surfacing as "Unable to create '.../index.lock'". A failed lock acquisition
// happens before git mutates anything, so retrying the same command is safe and idempotent.
// 並行の run の統合や記帳と重なると、ロックは数百ミリ秒より長く保持される（PJR-G90K）。
// 手の commit の pre-commit hook が負荷の下で十数分ロックを握ることもあるため（PJR-964D）、
// 最初の 10 回は 1.5 秒間隔、その後は 5 秒間隔で、既定 20 分まで解放を待つ。
// ロックのファイルは消さない（実際に動いている git がありうる）。
export const INDEX_LOCK_RETRY_ATTEMPTS = 10;
export const INDEX_LOCK_RETRY_WAIT_MS = 1500;
export const INDEX_LOCK_LONG_RETRY_WAIT_MS = 5000;
export const DEFAULT_INDEX_LOCK_WAIT_MS = 20 * 60 * 1000;
// 待っている間の告知の間隔。最初の取り合いで 1 回告げ、その後はこの間隔で経過を出す。
export const INDEX_LOCK_PROGRESS_INTERVAL_MS = 30 * 1000;

let configuredIndexLockWaitMilliseconds = DEFAULT_INDEX_LOCK_WAIT_MS;

// exec-defaults の `run.git_index_lock_wait_seconds` を、この process の git 操作へ反映する。
// src/shared は exec を import できないため、exec 側の設定の読み込みから値を渡す。
export function configureIndexLockWait(milliseconds: number = DEFAULT_INDEX_LOCK_WAIT_MS): void {
  if (!Number.isFinite(milliseconds) || milliseconds < 0) {
    throw new Error(
      `index.lock wait must be a non-negative number of milliseconds: ${milliseconds}`,
    );
  }
  configuredIndexLockWaitMilliseconds = milliseconds;
}

export function indexLockWaitMilliseconds(): number {
  return configuredIndexLockWaitMilliseconds;
}
// dubious ownership と、`.git` がある cwd での not-a-repository は一時的に起き、すぐの
// 再試行では収まらないことがある（並行実行中の統合段で確認した）。両方で上限を共有する。
const TRANSIENT_GIT_RETRY_DELAYS_MS = [2000, 5000, 10000] as const;

// 英語の `Unable to create '<path>/index.lock': File exists.` に加え、翻訳された git の
// メッセージ（日本語など）でも引用符で囲まれた index.lock のパスが出るため、それも拾う。
const INDEX_LOCK_QUOTED_PATH = /['"‘’“「]([^'"‘’“”「」\r\n]*index\.lock)['"’”」]/u;

export function gitIndexLockPath(stderr: string): string | undefined {
  return INDEX_LOCK_QUOTED_PATH.exec(stderr)?.[1];
}

export function isGitIndexLockContention(stderr: string): boolean {
  return (
    /Unable to create '[^']*index\.lock'/.test(stderr) ||
    /Another git process seems to be running/.test(stderr) ||
    /別の\s*git\s*プロセス/iu.test(stderr) ||
    gitIndexLockPath(stderr) !== undefined
  );
}

export function isGitDubiousOwnership(stderr: string): boolean {
  return /fatal:\s+detected dubious ownership in repository\b/i.test(stderr);
}

export function isGitNotRepositoryWithGitMetadata(stderr: string, repoRoot: string): boolean {
  if (!/\bnot a git repository\b/i.test(stderr)) return false;
  try {
    const metadata = lstatSync(join(resolve(repoRoot), ".git"));
    return metadata.isFile() || metadata.isDirectory();
  } catch {
    return false;
  }
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

export type TransientGitRetryReason = "dubious ownership" | "not a git repository";

// Kept as a public compatibility type for callers that only consume retry timing.
export type DubiousOwnershipRetryNotice = {
  attempt: number;
  maxAttempts: number;
  waitMilliseconds: number;
};

export type TransientGitRetryNotice = DubiousOwnershipRetryNotice & {
  reason: TransientGitRetryReason | "index.lock contention";
  // index.lock の待機だけが持つ。経過は最初の取り合いからの時間、上限は待ち時間の設定。
  elapsedMilliseconds?: number;
  limitMilliseconds?: number;
  lockPath?: string;
};

export type IndexLockWaitOptions = {
  limitMilliseconds?: number;
  now?: () => number;
  // ロックを握るプロセスがいない（古いロックが残った）と判断できるときに true を返す。
  isLockOrphaned?: (lockPath: string) => boolean;
};

// 待つのをやめた理由を stderr の末尾へ足す。formatGitCommandFailure の要約は error 行を拾う。
function appendStderr<T extends RetryableGitResult>(result: T, line: string): T {
  const stderr = typeof result.stderr === "string" ? result.stderr : "";
  const separator = stderr === "" || stderr.endsWith("\n") ? "" : "\n";
  return { ...result, stderr: `${stderr}${separator}${line}\n` };
}

export function formatWaitDuration(milliseconds: number): string {
  const totalSeconds = Math.round(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return seconds === 0 ? `${minutes}m` : `${minutes}m${seconds}s`;
}

// 告知の分母。短い間隔の回数に、残りの時間を長い間隔で割った回数を足す。
function indexLockMaxAttempts(limitMilliseconds: number): number {
  const shortPhase = INDEX_LOCK_RETRY_ATTEMPTS * INDEX_LOCK_RETRY_WAIT_MS;
  if (limitMilliseconds <= shortPhase) {
    return Math.max(1, Math.ceil(limitMilliseconds / INDEX_LOCK_RETRY_WAIT_MS));
  }
  return (
    INDEX_LOCK_RETRY_ATTEMPTS +
    Math.ceil((limitMilliseconds - shortPhase) / INDEX_LOCK_LONG_RETRY_WAIT_MS)
  );
}

// Linux の /proc から、名前が git のプロセスが 1 つでも動いているかを調べる。どのプロセスが
// ロックを握るかを git は記録しないため、git が 1 つも動いていないときだけ「握り手がいない」と
// みなす（hook を実行中の git commit も git として残る）。/proc を読めない環境では undefined。
export function hasRunningGitProcess(procRoot = "/proc"): boolean | undefined {
  let entries: string[];
  try {
    entries = readdirSync(procRoot);
  } catch {
    return undefined;
  }
  for (const entry of entries) {
    if (!/^\d+$/.test(entry)) continue;
    let name: string;
    try {
      name = readFileSync(join(procRoot, entry, "comm"), "utf8").trim();
    } catch {
      // 調べている間に終了したプロセスは数えない。
      continue;
    }
    if (name === "git" || name.startsWith("git-")) return true;
  }
  return false;
}

// ロックのファイルが残っていて、git のプロセスが 1 つも動いていなければ古いロックとみなす。
export function isIndexLockOrphaned(lockPath: string, procRoot = "/proc"): boolean {
  return existsSync(lockPath) && hasRunningGitProcess(procRoot) === false;
}

export type TransientGitRecovery = (reason: TransientGitRetryReason) => boolean;

export function transientGitFailureReason(
  stderr: string,
  repoRoot?: string,
): TransientGitRetryReason | undefined {
  if (isGitDubiousOwnership(stderr)) return "dubious ownership";
  if (repoRoot !== undefined && isGitNotRepositoryWithGitMetadata(stderr, repoRoot)) {
    return "not a git repository";
  }
  return undefined;
}

export function runGitWithTransientRetry<T extends RetryableGitResult>(
  run: () => T,
  onTransientFailureRetry: (notice: TransientGitRetryNotice) => void = () => undefined,
  sleep: (milliseconds: number) => void = sleepSync,
  repoRoot?: string,
  recoverFromTransientFailure?: TransientGitRecovery,
  indexLockWait: IndexLockWaitOptions = {},
): T {
  const limitMilliseconds = indexLockWait.limitMilliseconds ?? indexLockWaitMilliseconds();
  const now = indexLockWait.now ?? Date.now;
  const isLockOrphaned = indexLockWait.isLockOrphaned ?? isIndexLockOrphaned;
  let indexLockRetries = 0;
  let indexLockStartedAt: number | undefined;
  let nextProgressAt = 0;
  let transientFailureRetries = 0;
  let result = run();

  while (result.status !== 0) {
    const stderr = typeof result.stderr === "string" ? result.stderr : "";
    const transientFailure = transientGitFailureReason(stderr, repoRoot);
    if (transientFailure !== undefined) {
      // Some multi-step Git commands can finish their mutation before a later ownership check
      // reports a transient failure. Give those commands a chance to verify/reconcile their
      // postcondition before blindly repeating a non-idempotent operation.
      if (recoverFromTransientFailure?.(transientFailure)) {
        return { ...result, status: 0, stderr: "" } as T;
      }
      if (transientFailureRetries < TRANSIENT_GIT_RETRY_DELAYS_MS.length) {
        const waitMilliseconds = TRANSIENT_GIT_RETRY_DELAYS_MS[transientFailureRetries];
        transientFailureRetries += 1;
        onTransientFailureRetry({
          attempt: transientFailureRetries,
          maxAttempts: TRANSIENT_GIT_RETRY_DELAYS_MS.length,
          waitMilliseconds,
          reason: transientFailure,
        });
        sleep(waitMilliseconds);
        result = run();
        continue;
      }
    }
    if (!isGitIndexLockContention(stderr)) break;

    const lockPath = gitIndexLockPath(stderr);
    indexLockStartedAt ??= now();
    const elapsedMilliseconds = now() - indexLockStartedAt;
    if (elapsedMilliseconds >= limitMilliseconds) {
      return appendStderr(
        result,
        `error: index.lock was not released within ${formatWaitDuration(limitMilliseconds)}` +
          " (run.git_index_lock_wait_seconds in exec-defaults)",
      );
    }
    // 短い取り合いの間は古いロックか判断しない（git の起動と終了の合間に見えうる）。
    if (indexLockRetries >= INDEX_LOCK_RETRY_ATTEMPTS && lockPath && isLockOrphaned(lockPath)) {
      return appendStderr(
        result,
        `error: index.lock looks stale: no running git process holds ${lockPath}` +
          ` after ${formatWaitDuration(elapsedMilliseconds)};` +
          " remove it after confirming no git uses the repository",
      );
    }
    const interval =
      indexLockRetries < INDEX_LOCK_RETRY_ATTEMPTS
        ? INDEX_LOCK_RETRY_WAIT_MS
        : INDEX_LOCK_LONG_RETRY_WAIT_MS;
    const waitMilliseconds = Math.min(interval, limitMilliseconds - elapsedMilliseconds);
    indexLockRetries += 1;
    if (indexLockRetries === 1 || elapsedMilliseconds >= nextProgressAt) {
      nextProgressAt =
        (Math.floor(elapsedMilliseconds / INDEX_LOCK_PROGRESS_INTERVAL_MS) + 1) *
        INDEX_LOCK_PROGRESS_INTERVAL_MS;
      onTransientFailureRetry({
        attempt: indexLockRetries,
        maxAttempts: indexLockMaxAttempts(limitMilliseconds),
        waitMilliseconds,
        reason: "index.lock contention",
        elapsedMilliseconds,
        limitMilliseconds,
        ...(lockPath ? { lockPath } : {}),
      });
    }
    sleep(waitMilliseconds);
    result = run();
  }
  return result;
}

// spawnSync の既定の maxBuffer（1 MiB）では、未追跡のファイルが多い作業場所の
// `git status --porcelain` などが打ち切られ、子プロセスが SIGTERM で止められる。
export const GIT_OUTPUT_MAX_BUFFER = 256 * 1024 * 1024;

export function gitResult(
  repoRoot: string,
  args: string[],
  recoverFromTransientFailure?: TransientGitRecovery,
  // 隔離済みの Git 環境へ足す変数（統合の commit の LEFTHOOK_EXCLUDE など）。
  extraEnv?: Readonly<Record<string, string>>,
): ReturnType<typeof spawnSync> {
  const cwd = resolve(repoRoot);
  const run = (): ReturnType<typeof spawnSync> =>
    spawnSync("git", ["-C", cwd, ...args], {
      // `-C` だけに依存せず、子プロセス自体も対象 repository から起動する。linked worktree の
      // `.git` が相対 gitdir の場合も、resume 中の diff を runner の cwd から切り離す。
      cwd,
      encoding: "utf8",
      env: { ...gitEnvironment(), ...extraEnv },
      maxBuffer: GIT_OUTPUT_MAX_BUFFER,
      stdio: ["ignore", "pipe", "pipe"],
    });

  return runGitWithTransientRetry(
    run,
    (notice) => {
      const { attempt, maxAttempts, waitMilliseconds, reason } = notice;
      const summary = summarizeGitArguments(args);
      if (notice.elapsedMilliseconds !== undefined && notice.limitMilliseconds !== undefined) {
        const lock = notice.lockPath ? `, lock: ${notice.lockPath}` : "";
        process.stderr.write(
          "warning: waiting for index.lock to be released" +
            ` (elapsed ${formatWaitDuration(notice.elapsedMilliseconds)}` +
            ` / limit ${formatWaitDuration(notice.limitMilliseconds)}${lock}` +
            `, cwd: ${repoRoot}${summary ? `, args: ${summary}` : ""})\n`,
        );
        return;
      }
      process.stderr.write(
        `warning: git command failed with ${reason}; retrying in ${waitMilliseconds / 1000}s` +
          ` (attempt ${attempt}/${maxAttempts}, cwd: ${repoRoot}${summary ? `, args: ${summary}` : ""})\n`,
      );
    },
    sleepSync,
    cwd,
    recoverFromTransientFailure,
  );
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
  // 複数行の commit message などは 1 行へ畳む。改行が残ると要約が失敗理由の行から離れ、
  // 出力の最後の行が引数の断片だけになって失敗に気づきにくい（PJR-Y3XS）。
  const parts = head.map((arg) =>
    abbreviate(arg.replace(/\s+/g, " ").trim(), MAX_GIT_ARGUMENT_LENGTH),
  );
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

export interface GitProcessOutcome {
  status: number | null;
  signal: NodeJS.Signals | null;
  error?: Error;
}

export interface GitCommandOutcome extends GitProcessOutcome {
  stdout?: unknown;
  stderr?: unknown;
}

// 起動の失敗や出力の上限超過（ENOBUFS）では stderr が空になるため、spawnSync の
// error と signal から原因を組み立てる。git 自身が終了コードを返した場合は空文字を返す。
export function describeGitProcessFailure(outcome: GitProcessOutcome): string {
  const parts: string[] = [];
  const error = outcome.error;
  if (error) {
    const code = "code" in error && typeof error.code === "string" ? error.code : undefined;
    const message = error.message.trim();
    if (code === "ENOBUFS") {
      parts.push(`output exceeded maxBuffer (ENOBUFS): ${message}`);
    } else if (code && !message.includes(code)) {
      parts.push(`${code}: ${message}`);
    } else {
      parts.push(message || "spawn error");
    }
  }
  if (outcome.signal) parts.push(`terminated by signal ${outcome.signal}`);
  return parts.join("; ");
}

export function formatGitCommandFailure(
  args: readonly string[],
  stderr: string,
  processFailure = "",
): string {
  const subcommandIndex = args.findIndex((arg) => !arg.startsWith("-"));
  const label = subcommandIndex === -1 ? "git" : `git ${args[subcommandIndex]}`;
  const summary = summarizeGitArguments(
    subcommandIndex === -1
      ? args
      : [...args.slice(0, subcommandIndex), ...args.slice(subcommandIndex + 1)],
  );
  const detail = summary ? ` (args: ${summary})` : "";
  // gitResult は index.lock の取り合いをやり直したうえで失敗を返す。どのロックが残っていたかを
  // 要約の切り詰めに左右されず先頭に残す（ロックは runner が消さないため、人が確かめる手掛かり）。
  const lockPath = isGitIndexLockContention(stderr) ? gitIndexLockPath(stderr) : undefined;
  // 原因の候補: 手の commit などの hook がまだ動いている、または異常終了した git の古いロック。
  const lockNotice = lockPath
    ? `index.lock is still held (lock: ${lockPath};` +
      " a git hook such as pre-commit may still be running, or a crashed git left a stale lock)"
    : "";
  const cause = [processFailure.trim(), lockNotice, summarizeGitStderr(stderr)]
    .filter((part) => part !== "")
    .join(" / ");
  return cause ? `${label} failed: ${cause}${detail}` : `${label} failed${detail}`;
}

// gitResult を直接扱う呼び出し元でも、gitOutput と同じ stderr 要約に加えて終了コードを
// 必ず残す。status が null の起動失敗・signal 終了では describeGitProcessFailure が原因を補う。
export function formatGitResultFailure(args: readonly string[], result: GitCommandOutcome): string {
  const stderr = typeof result.stderr === "string" ? result.stderr : "";
  const processFailure = [`exit ${result.status ?? "unknown"}`, describeGitProcessFailure(result)]
    .filter(Boolean)
    .join("; ");
  return formatGitCommandFailure(args, stderr, processFailure);
}

// lefthook などの hook 出力から、block reason に載せる失敗ステップ名と最初のエラー行を
// 取り出し、Vitest の失敗テスト名・集計があれば末尾から補う。罫線や ANSI 制御は監査ログには
// 残す一方、短い理由には混ぜない。
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

  const stepHeaders: Array<{ step: string; index: number }> = [];
  for (const [index, line] of lines.entries()) {
    const match = line.match(/^(.+?)\s*[❯▶]\s*$/u);
    if (match) stepHeaders.push({ step: match[1]!.trim(), index });
  }
  // parallel: true の lefthook は成功した step の出力も並べるため、最初の step 見出しが
  // 失敗した step とは限らない。末尾の summary で失敗印（🥊 など）が付いた step を優先する。
  const failedSteps = lines
    // step 名には空白や括弧を含む description も使われる。末尾の所要時間だけを除く。
    .map((line) => line.match(/^(?:🥊|✗|✘|✕|❌)️?\s*(.+?)(?:\s+\([\d.]+\s+seconds?\))?$/u)?.[1])
    .filter((name): name is string => name !== undefined && !/^lefthook(?:\s|$)/u.test(name));
  const selected =
    stepHeaders.find((header) => failedSteps.includes(header.step)) ?? stepHeaders[0];
  const step = selected?.step ?? failedSteps[0] ?? "";
  const stepIndex = selected?.index ?? -1;
  const sectionEnd =
    selected === undefined
      ? lines.length
      : (stepHeaders.find((header) => header.index > selected.index)?.index ?? lines.length);

  const isDecoration = (line: string): boolean =>
    /^(?:hook output|summary:|exit status\b|failed steps?:|skip(?:ped)?\b)/i.test(line) ||
    /^[✓✔✗✘✕❯▶]+$/u.test(line);
  const isCandidate = (line: string): boolean =>
    line !== step && !isDecoration(line) && !/[❯▶]\s*$/u.test(line);
  const sectionLines = lines.slice(stepIndex + 1, sectionEnd).filter(isCandidate);
  // 整形ツールが出す "(unchanged)" などの進捗行より、error を含む行を最初のエラーとして選ぶ。
  // テストの失敗（FAIL の行）があるときは、それが原因なので error を含む行より優先する。
  // 引数の誤りを確かめるテストの通常の出力（unknown option など）を原因と読み違えないため。
  // 型検査などの診断（error TS1234）は位置つきの原因なので、FAIL の行よりさらに優先する。
  const errorLine =
    sectionLines.find((line) => /\berror TS\d+/u.test(line)) ??
    lines.find((line) => /^FAIL\b/u.test(line)) ??
    sectionLines.find((line) => /\berror\b/i.test(line)) ??
    sectionLines[0] ??
    lines.slice(stepIndex + 1).find(isCandidate);

  const primary =
    step && errorLine
      ? `${step}: ${errorLine}`
      : step ||
        (lines.find((line) => /(?:\bCONFLICT\b|\bfatal:|\berror:|\bfailed\b)/i.test(line)) ??
          lines.find((line) => !isDecoration(line)) ??
          lines[0]!);
  const tail = lines
    .filter((line) => /^(?:FAIL\b|Test Files\b|Tests\b)/iu.test(line))
    .filter((line) => !primary.includes(line))
    .slice(-3);
  const summary = [primary, ...tail].join("; ");
  const limit = 400;
  if (summary.length <= limit) return summary;
  const marker = " … ";
  const retained = limit - marker.length;
  return `${summary.slice(0, Math.ceil(retained / 2))}${marker}${summary.slice(-Math.floor(retained / 2))}`;
}

/** Appends redacted Git/hook diagnostics to a run-scoped evidence log. */
export function appendGitFailureLog(path: string | undefined, lines: readonly string[]): void {
  if (!path) return;
  mkdirSync(dirname(path), { recursive: true });
  appendFileSync(path, redactSensitiveText(`${lines.join("\n")}\n`), "utf8");
}

/** Appends a complete gitResult failure record while keeping the caller's operation label. */
export function appendGitResultFailureLog(
  path: string | undefined,
  label: string,
  result: GitCommandOutcome,
): void {
  appendGitFailureLog(path, [
    `=== ${new Date().toISOString()} ${label} ===`,
    `exit: ${result.status ?? "unknown"}`,
    `signal: ${result.signal ?? "none"}`,
    `error: ${result.error?.message ?? "none"}`,
    "--- stdout ---",
    typeof result.stdout === "string" ? result.stdout : "",
    "--- stderr ---",
    typeof result.stderr === "string" ? result.stderr : "",
    "",
  ]);
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

export function gitOutput(
  repoRoot: string,
  args: string[],
  recoverFromTransientFailure?: TransientGitRecovery,
): string {
  const result = gitResult(repoRoot, args, recoverFromTransientFailure);
  if (result.status !== 0 || result.error) {
    const stderr = typeof result.stderr === "string" ? result.stderr : "";
    throw new GitCommandError(
      formatGitCommandFailure(args, stderr, describeGitProcessFailure(result)),
      args,
      stderr,
    );
  }
  return typeof result.stdout === "string" ? result.stdout : "";
}

export function repoRelative(repoRoot: string, path: string): string {
  const value = relative(repoRoot, path);
  if (!value || value === ".." || value.startsWith(`..${sep}`)) {
    throw new Error(`Path is outside repository root: ${path}`);
  }
  return value.split(sep).join("/");
}

export function worktreeStatusPaths(repoRoot: string): string[] {
  const output = gitOutput(repoRoot, ["status", "--porcelain=v1", "-z", "--untracked-files=all"]);
  const records = output.split("\0").filter(Boolean);
  const paths: string[] = [];
  for (let index = 0; index < records.length; index++) {
    const record = records[index];
    if (record.length < 4) continue;
    const status = record.slice(0, 2);
    paths.push(record.slice(3));
    if ((status.includes("R") || status.includes("C")) && records[index + 1]) {
      paths.push(records[++index]);
    }
  }
  return paths;
}

export function selectStageablePaths(repoRoot: string, paths: readonly string[]): string[] {
  if (paths.length === 0) return [];
  const indexed = new Set(
    gitOutput(repoRoot, ["ls-files", "--full-name", "-z", "--", ...paths])
      .split("\0")
      .filter(Boolean),
  );
  const existsInWorktree = (path: string): boolean =>
    lstatSync(resolve(repoRoot, path), { throwIfNoEntry: false }) !== undefined;
  return paths.filter((path) => indexed.has(path) || existsInWorktree(path));
}

export function stageCommitTargets(repoRoot: string, paths: readonly string[]): void {
  const stageable = selectStageablePaths(repoRoot, paths);
  if (stageable.length === 0) return;
  gitOutput(repoRoot, ["add", "-A", "--", ...stageable]);
}

// 呼び出し元が stage した対象だけを戻し、作業ツリーと無関係な staged 変更は保持する。
export function unstageCommitTargets(repoRoot: string, paths: readonly string[]): void {
  const unique = [...new Set(paths)];
  if (unique.length === 0) return;
  gitOutput(repoRoot, ["reset", "--quiet", "--", ...unique]);
}

// `git commit -- <pathspec>`（--only）は一時 index で commit する。pre-commit hook の整形と
// `git add`（lefthook の stage_fixed）は一時 index にだけ入り、本来の index には hook 前の内容が
// 残る。HEAD と作業ツリーは整形後で一致するのに、index だけが整形前を staged として持ち、次の統合を
// stagedMergeBlocker で止める（PJR-Y3XS）。commit 対象のうち作業ツリーが HEAD と一致するパスだけを
// HEAD へ戻す。作業ツリーが HEAD と異なるパスは、利用者の作業の可能性があるため触らない。
// 戻したパス（リポジトリルート起点）を返す。
export function restoreIndexAfterPathspecCommit(
  cwd: string,
  pathspecs: readonly string[],
  globals: readonly string[] = [],
): string[] {
  if (pathspecs.length === 0) return [];
  const zeroSeparated = (output: string): string[] => output.split("\0").filter(Boolean);
  const staged = zeroSeparated(
    gitOutput(cwd, [
      ...globals,
      "diff",
      "--cached",
      "--no-renames",
      "--no-relative",
      "--name-only",
      "-z",
      "--",
      ...pathspecs,
    ]),
  );
  if (staged.length === 0) return [];
  const topLiteral = (path: string): string => `:(top,literal)${path}`;
  const differsFromHead = new Set(
    zeroSeparated(
      gitOutput(cwd, [
        ...globals,
        "diff",
        "--no-renames",
        "--no-relative",
        "--name-only",
        "-z",
        "HEAD",
        "--",
        ...staged.map(topLiteral),
      ]),
    ),
  );
  const restorable = staged.filter((path) => !differsFromHead.has(path));
  if (restorable.length === 0) return [];
  gitOutput(cwd, [...globals, "reset", "--quiet", "--", ...restorable.map(topLiteral)]);
  return restorable;
}

// A non-fast-forward merge requires a clean index even when staged paths do not overlap the
// incoming diff. Never reset or commit another operation's staged work on its behalf.
export function stagedMergeBlocker(repoRoot: string): string | undefined {
  const paths = gitOutput(repoRoot, ["diff", "--cached", "--no-renames", "--name-only", "-z"])
    .split("\0")
    .filter(Boolean);
  if (paths.length === 0) return undefined;
  return (
    `Staged changes in integration target ${repoRoot}: ${paths.join(", ")}. ` +
    `Commit them, or run git restore --staged -- <path> for each listed path in that worktree ` +
    `(file contents are preserved), then retry integration.`
  );
}
