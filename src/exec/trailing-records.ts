import { lstatSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  gitOutput,
  gitResult,
  repoRelative,
  stageCommitTargets,
  summarizeGitHookFailure,
  unstageCommitTargets,
  worktreeStatusPaths,
} from "../shared/git.js";
import { acquireSchedulerLock, isExecEventV1, releaseSchedulerLock } from "./events.js";
import { eventsDirForProject } from "./project.js";
import {
  planConventionsDirectory,
  recordIdentity,
  runItemDirectory,
  runRecordLocation,
  runRecordsDirectory,
} from "./run-records.js";
import { missingRunRecords } from "./validate-records.js";
import { normalizeResultWhitespace, stabilizeCommitTargets } from "./worktree-ops-commit.js";

// runner は Schedule タスクの complete・block・release などのイベントを統合の commit の後に書き、
// 失敗・延期した run の plan / result の作業コピーも root に残す。run の終わりにこれらを
// 記帳の commit 1 件として統合ブランチへ入れる（PJR-DVNV）。人が書いたイベントは、従来どおり
// 書いた人が commit するため対象にしない。

export const TRAILING_RECORDS_COMMIT_SUBJECT = "exec(run): record execution events and run records";

const SCHEDULER_LOCK_TIMEOUT_MS = 10_000;
const SCHEDULER_LOCK_STALE_MS = 300_000;

export type TrailingRecordsContext = {
  repoRoot: string;
  schedulePath: string;
  executionPath: string;
  // イベントの `by` が runner（agent-members の agent）かどうか。
  isRunnerActor: (actor: string) => boolean;
};

export type TrailingRecordsSelection = {
  events: string[];
  runRecords: string[];
  paths: string[];
  // 必須の記録（plan・result・evidence）がそろわないため記帳しない run のディレクトリ。
  incompleteRuns: string[];
};

export type TrailingRecordsReport = {
  committed: string[];
  remaining: string[];
  incompleteRuns?: string[];
  commit?: string;
  error?: string;
};

function prefixOf(repoRoot: string, directory: string): string {
  return `${repoRelative(repoRoot, directory)}/`;
}

function isFile(repoRoot: string, path: string): boolean {
  return lstatSync(resolve(repoRoot, path), { throwIfNoEntry: false })?.isFile() === true;
}

function readRunnerEventTaskId(context: TrailingRecordsContext, path: string): string | undefined {
  try {
    const raw: unknown = JSON.parse(readFileSync(resolve(context.repoRoot, path), "utf8"));
    if (!isExecEventV1(raw, path)) return undefined;
    return context.isRunnerActor(raw.by) ? raw.task_id : undefined;
  } catch {
    // 壊れたイベントは exec validate が報告する。記帳では推測で commit しない。
    return undefined;
  }
}

// root の未 commit のファイルから、runner が書いた記録だけを選ぶ。
// - イベント: `exec/events/*.json` のうち、`by` が runner のもの。
// - run の記録: 上のイベントの task の `runs/schedule/<task>/` 配下（失敗・延期・再開前の試行を含む）。
// - plan の共通規約: run の記録を 1 件以上選んだ場合の `plan-conventions/` 配下（内容で命名される）。
// 削除や存在しないパスは選ばない。結果はソート済みで返す。
export function selectTrailingRunRecords(
  context: TrailingRecordsContext,
  dirtyPaths: readonly string[] = worktreeStatusPaths(context.repoRoot),
): TrailingRecordsSelection {
  const { repoRoot } = context;
  const eventsPrefix = prefixOf(repoRoot, eventsDirForProject(context.schedulePath));
  const schedulePrefix = prefixOf(
    repoRoot,
    resolve(runRecordsDirectory(context.executionPath), "schedule"),
  );
  const conventionsPrefix = prefixOf(repoRoot, planConventionsDirectory(context.executionPath));
  const files = [...new Set(dirtyPaths.map((path) => path.replaceAll("\\", "/")))]
    .filter((path) => isFile(repoRoot, path))
    .sort();

  const events: string[] = [];
  const taskIds = new Set<string>();
  for (const path of files) {
    if (!path.startsWith(eventsPrefix) || !path.endsWith(".json")) continue;
    const taskId = readRunnerEventTaskId(context, path);
    if (!taskId) continue;
    events.push(path);
    taskIds.add(taskId);
  }

  const itemPrefixes = [...taskIds].map((taskId) =>
    prefixOf(
      repoRoot,
      runItemDirectory(
        context.executionPath,
        "schedule",
        recordIdentity(taskId, "schedule").itemId,
      ),
    ),
  );
  const candidates = files.filter(
    (path) =>
      path.startsWith(schedulePrefix) && itemPrefixes.some((prefix) => path.startsWith(prefix)),
  );
  const { kept: runRecords, incompleteRuns } = dropIncompleteRuns(context, candidates);
  const conventions =
    runRecords.length > 0 ? files.filter((path) => path.startsWith(conventionsPrefix)) : [];
  return {
    events,
    runRecords,
    paths: [...events, ...runRecords, ...conventions].sort(),
    incompleteRuns,
  };
}

// setup や executor の起動前に止まった run は plan だけを残す。これを commit すると、commit 先の
// `exec validate --records-only`（CI と pre-push）が missing で落ちる（PJR-1ZQK）。配置の規約は
// 「記録がそろった revision を対象にする」ため、commit 後の状態で必須の記録が欠ける run は記帳せず、
// 作業ツリーに残して報告する。`isPresent` を省くと作業ツリーの通常ファイルで判定する。
function dropIncompleteRuns(
  context: TrailingRecordsContext,
  paths: readonly string[],
  isPresent?: (path: string) => boolean,
): { kept: string[]; incompleteRuns: string[] } {
  const { repoRoot, executionPath } = context;
  const runOf = (path: string) => {
    const directory = dirname(resolve(repoRoot, path));
    return runRecordLocation(executionPath, directory) ? directory : undefined;
  };
  const incomplete = new Set<string>();
  const checked = new Set<string>();
  for (const path of paths) {
    const directory = runOf(path);
    if (!directory || checked.has(directory)) continue;
    checked.add(directory);
    const missing = missingRunRecords(
      executionPath,
      directory,
      isPresent ? { isFile: (absolute) => isPresent(repoRelative(repoRoot, absolute)) } : {},
    );
    if (missing.length > 0) incomplete.add(directory);
  }
  return {
    kept: paths.filter((path) => {
      const directory = runOf(path);
      return !directory || !incomplete.has(directory);
    }),
    incompleteRuns: [...incomplete].map((directory) => repoRelative(repoRoot, directory)).sort(),
  };
}

function isTrackedAtHead(repoRoot: string, path: string): boolean {
  return gitResult(repoRoot, ["cat-file", "-e", `HEAD:${path}`]).status === 0;
}

function remainingOf(repoRoot: string, paths: readonly string[]): string[] {
  const wanted = new Set(paths);
  return worktreeStatusPaths(repoRoot).filter((path) => wanted.has(path));
}

// 指定パスだけを 1 commit にする。hook（整形・markdownlint・認証情報の検査）は通常どおり走らせ、
// 整形で変わった分は同じ commit へ収束させる。失敗した場合は stage を戻して例外を投げる。
function commitPaths(repoRoot: string, paths: readonly string[], message: string): void {
  try {
    stageCommitTargets(repoRoot, paths);
    const staged = gitResult(repoRoot, ["diff", "--cached", "--quiet", "--", ...paths]);
    if (staged.status === 0) return;
    const commit = gitResult(repoRoot, ["commit", "-m", message, "--", ...paths]);
    if (commit.status !== 0) {
      const output = [commit.stdout, commit.stderr]
        .filter((part): part is string => typeof part === "string" && part.length > 0)
        .join("\n");
      throw new Error(`git commit failed: ${summarizeGitHookFailure(output)}`);
    }
    stabilizeCommitTargets(repoRoot, () => remainingOf(repoRoot, paths));
  } catch (error) {
    unstageCommitTargets(repoRoot, paths);
    throw error;
  }
}

function headCommit(repoRoot: string): string {
  return gitOutput(repoRoot, ["rev-parse", "--short", "HEAD"]).trim();
}

// runner の記録を記帳の commit にする。統合と同じ scheduler lock で直列化し、index.lock の競合は
// gitResult が再試行する。result.md の記法違反で hook に拒否された場合は result.md を外して
// もう一度試す。それでも失敗した場合は残ったファイルを返し、commit しないまま終える。
export function commitTrailingRunRecords(
  context: TrailingRecordsContext & { message?: string },
): TrailingRecordsReport {
  const { repoRoot } = context;
  const message = context.message ?? TRAILING_RECORDS_COMMIT_SUBJECT;
  let lockDir = "";
  let selected: string[] = [];
  let incompleteRuns: string[] = [];
  try {
    lockDir = acquireSchedulerLock(context.schedulePath, {
      actor: "exec-trailing-records",
      lockTimeoutMs: SCHEDULER_LOCK_TIMEOUT_MS,
      lockStaleMs: SCHEDULER_LOCK_STALE_MS,
    });
    const selection = selectTrailingRunRecords(context);
    selected = selection.paths;
    incompleteRuns = selection.incompleteRuns;
    const withIncomplete = incompleteRuns.length > 0 ? { incompleteRuns } : {};
    if (selected.length === 0) return { committed: [], remaining: [], ...withIncomplete };
    const results = selected.filter((path) => path.endsWith("/result.md"));
    for (const path of results) normalizeResultWhitespace(resolve(repoRoot, path));
    try {
      commitPaths(repoRoot, selected, message);
      return {
        committed: selected,
        remaining: remainingOf(repoRoot, selected),
        commit: headCommit(repoRoot),
        ...withIncomplete,
      };
    } catch (error) {
      if (results.length === 0) throw error;
      // result.md を外した run は、HEAD に result がなければ記録がそろわないので、その run ごと外す。
      const withoutResultSet = new Set(selected.filter((path) => !results.includes(path)));
      const retry = dropIncompleteRuns(
        context,
        [...withoutResultSet],
        (path) => withoutResultSet.has(path) || isTrackedAtHead(repoRoot, path),
      );
      const withoutResults = retry.kept;
      incompleteRuns = [...new Set([...incompleteRuns, ...retry.incompleteRuns])].sort();
      process.stderr.write(
        `warning: execution-record commit failed with result.md included; retrying without them: ` +
          `${error instanceof Error ? error.message : String(error)}\n`,
      );
      if (withoutResults.length === 0) throw error;
      commitPaths(repoRoot, withoutResults, message);
      return {
        committed: withoutResults,
        remaining: remainingOf(repoRoot, selected),
        commit: headCommit(repoRoot),
        ...(incompleteRuns.length > 0 ? { incompleteRuns } : {}),
      };
    }
  } catch (error) {
    const remaining = selected.length > 0 ? remainingOf(repoRoot, selected) : [];
    return {
      committed: [],
      remaining,
      error: error instanceof Error ? error.message : String(error),
      ...(incompleteRuns.length > 0 ? { incompleteRuns } : {}),
    };
  } finally {
    if (lockDir) releaseSchedulerLock(lockDir);
  }
}

// 記帳の結果を run の出力へ書く。残ったファイルがあれば、ファイルと次の操作を stderr に出す。
export function reportTrailingRunRecords(report: TrailingRecordsReport, label: string): void {
  if (report.commit && report.committed.length > 0) {
    process.stdout.write(
      `[${label}] recorded ${report.committed.length} execution record(s) in ${report.commit}\n`,
    );
  }
  if (report.error) {
    process.stderr.write(`warning: could not commit execution records: ${report.error}\n`);
  }
  if (report.incompleteRuns && report.incompleteRuns.length > 0) {
    process.stderr.write(
      `warning: ${report.incompleteRuns.length} run(s) lack plan.md, result.md or evidence.json ` +
        `and were left uncommitted so that exec validate --records-only keeps passing:\n` +
        report.incompleteRuns.map((path) => `  ${path}/\n`).join("") +
        `  next: resume the run to complete its records, or remove the directory ` +
        `if the run stopped before the executor started\n`,
    );
  }
  if (report.remaining.length > 0) {
    process.stderr.write(
      `warning: ${report.remaining.length} execution record(s) remain uncommitted:\n` +
        report.remaining.map((path) => `  ${path}\n`).join("") +
        `  next: fix the cause above, then commit them with git add/commit, ` +
        `or run the next exec run/resume to retry the bookkeeping commit\n`,
    );
  }
}

// exec branch の先端にある、その task の run の記録のパス（root 側の絶対パス）。記帳の commit が統合
// ブランチへ先に入れた作業コピーと、exec branch 側で更新された同じファイルは両側の追加として
// 競合する。統合の merge では、これらの競合を exec branch 側（最新の記録）で解決する。
export function branchOwnedRunRecordPaths(params: {
  repoRoot: string;
  executionPath: string;
  branch: string;
  taskId: string;
}): string[] {
  const identity = recordIdentity(params.taskId, "schedule");
  const directory = runItemDirectory(params.executionPath, identity.origin, identity.itemId);
  const listed = gitResult(params.repoRoot, [
    "ls-tree",
    "-r",
    "-z",
    "--name-only",
    params.branch,
    "--",
    repoRelative(params.repoRoot, directory),
  ]);
  if (listed.status !== 0 || typeof listed.stdout !== "string") return [];
  return listed.stdout
    .split("\0")
    .filter(Boolean)
    .sort()
    .map((path) => resolve(params.repoRoot, path));
}
