import { lstatSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { acquireSchedulerLock, releaseSchedulerLock } from "./exec-events.js";
import { rebuildRegisterTicketFromEvents, unionRegisterEventLogs } from "./register/event-merge.js";
import { displayIdFromRegisterEventFilename, REGISTER_EVENTS_DIRNAME } from "./register/events.js";
import { displayIdFromTicketFilename } from "./register/item.js";
import {
  appendGitFailureLog,
  gitOutput,
  gitResult,
  summarizeGitHookFailure,
  type ExecWorktree,
} from "./exec-worktree.js";
import {
  commitTargetPaths,
  currentBranch,
  repoRelative,
  rootDirtyPaths,
  zeroSeparatedPaths,
  type WorktreeOpsContext,
} from "./exec-worktree-ops-commit.js";

const DEFAULT_LOCK_TIMEOUT_MS = 10_000;
const DEFAULT_LOCK_STALE_MS = 300_000;

// A root working copy of an execution bookkeeping file (plan / result / claim or register event)
// captured before the merge releases it. `content` is null when the path did not exist.
type RootWorkingCopy = { rel: string; content: Buffer | null };

// The checkpoint commit lives on the exec branch only, so the root keeps its own uncommitted copy
// of the bookkeeping files while the task runs (the schedule/register state must stay visible at
// root). Before the exec branch is merged those copies must yield to the committed versions,
// otherwise the overlap guard below rejects the merge. Capture them so a failed merge can put the
// root back exactly as it was.
export function releaseRootWorkingCopies(repoRoot: string, relPaths: string[]): RootWorkingCopy[] {
  const snapshot: RootWorkingCopy[] = [];
  try {
    for (const rel of new Set(relPaths)) {
      const absolute = resolve(repoRoot, rel);
      const exists = lstatSync(absolute, { throwIfNoEntry: false }) !== undefined;
      snapshot.push({ rel, content: exists ? readFileSync(absolute) : null });
      restoreToHead(repoRoot, rel);
    }
  } catch (error) {
    // Releasing is itself allowed to fail (for example because a path unexpectedly became a
    // directory). Put back every copy already touched before propagating the failure; otherwise a
    // merge that never started could still discard root-side execution state.
    restoreRootWorkingCopies(repoRoot, snapshot);
    throw error;
  }
  return snapshot;
}

export function restoreRootWorkingCopies(repoRoot: string, snapshot: RootWorkingCopy[]): void {
  for (const { rel, content } of snapshot) {
    const absolute = resolve(repoRoot, rel);
    if (content === null) {
      rmSync(absolute, { recursive: true, force: true });
      continue;
    }
    mkdirSync(resolve(absolute, ".."), { recursive: true });
    writeFileSync(absolute, content);
  }
}

// `git merge --abort` (reset --merge) refuses to run when a tracked file's cached stat no longer
// matches the file even though its content is unchanged ("not uptodate"), which happens when another
// process in the same working tree (for example a routine) touches files during the merge. Refresh
// the index first so a stat-only drift cannot leave the tree mid-merge.
export function abortMerge(repoRoot: string): ReturnType<typeof gitResult> {
  gitResult(repoRoot, ["update-index", "-q", "--refresh"]);
  return gitResult(repoRoot, ["merge", "--abort"]);
}

// `controls/project-register/events/pjr-xxxx.yaml` 形式のイベントファイルなら表示 ID を返す。
function registerEventDisplayId(path: string): string | undefined {
  if (basename(dirname(path)) !== REGISTER_EVENTS_DIRNAME) return undefined;
  return displayIdFromRegisterEventFilename(basename(path));
}

// Resolve an in-progress merge whose conflicts are all on exec-branch-owned paths, then complete
// the merge commit. Register event files are resolved as the union of both sides and the matching
// ticket is rebuilt from the merge-target-only events; other paths take the exec branch side. Returns the resolved paths, or null when the
// merge has no conflicts (for example a hook rejection), conflicts on other paths, or cannot be
// completed; the caller then aborts the merge. The commit uses --no-verify because a regular
// `git merge` does not run pre-commit either, and only the item's own bookkeeping was resolved.
function resolveBranchOwnedConflicts(params: {
  repoRoot: string;
  branchOwnedPaths: string[];
  message?: string;
}): string[] | null {
  const { repoRoot } = params;
  const conflicted = zeroSeparatedPaths(repoRoot, ["diff", "--name-only", "--diff-filter=U", "-z"]);
  if (conflicted.length === 0) return null;
  const owned = new Set(params.branchOwnedPaths);
  if (conflicted.some((path) => !owned.has(path))) return null;
  const stagesOf = (path: string): (string | undefined)[] =>
    gitOutput(repoRoot, ["ls-files", "-u", "-z", "--", path])
      .split("\0")
      .filter(Boolean)
      .map((entry) => entry.split("\t")[0]?.split(" ")[2]);
  // イベントファイルは両側の和集合で解決し、対応する個票はイベントから再構築する。
  // 和集合で解決できないものは従来どおり exec branch 側で解決する。
  const handled = new Set<string>();
  for (const path of conflicted) {
    const displayId = registerEventDisplayId(path);
    if (!displayId) continue;
    const stages = stagesOf(path);
    if (!stages.includes("2") || !stages.includes("3")) continue;
    const ours = gitResult(repoRoot, ["show", `:2:${path}`]);
    const theirs = gitResult(repoRoot, ["show", `:3:${path}`]);
    if (ours.status !== 0 || theirs.status !== 0) continue;
    const union = unionRegisterEventLogs(String(ours.stdout), String(theirs.stdout), path);
    if (!union.ok) {
      process.stdout.write(
        `  [integrate] could not union register events; using the exec branch side: ${union.reason}\n`,
      );
      continue;
    }
    writeFileSync(resolve(repoRoot, path), union.content, "utf8");
    if (gitResult(repoRoot, ["add", "--", path]).status !== 0) return null;
    handled.add(path);
    process.stdout.write(
      `  [integrate] merged register events as a union: ${path} ` +
        `(kept ${union.oursOnlyIds.size} event(s) only on the merge target)\n`,
    );
    const ticketPath = conflicted.find(
      (candidate) =>
        dirname(candidate) === dirname(dirname(path)) &&
        displayIdFromTicketFilename(basename(candidate)) === displayId,
    );
    if (!ticketPath || !stagesOf(ticketPath).includes("3")) continue;
    const ticket = gitResult(repoRoot, ["show", `:3:${ticketPath}`]);
    if (ticket.status !== 0) continue;
    let rebuilt: ReturnType<typeof rebuildRegisterTicketFromEvents>;
    try {
      rebuilt = rebuildRegisterTicketFromEvents(
        String(ticket.stdout),
        union.events,
        union.oursOnlyIds,
      );
    } catch (error) {
      process.stdout.write(
        `  [integrate] could not rebuild ${ticketPath} from events; using the exec branch side: ` +
          `${error instanceof Error ? error.message : String(error)}\n`,
      );
      continue;
    }
    writeFileSync(resolve(repoRoot, ticketPath), rebuilt.content, "utf8");
    if (gitResult(repoRoot, ["add", "--", ticketPath]).status !== 0) return null;
    handled.add(ticketPath);
    if (rebuilt.appliedFields.length > 0) {
      process.stdout.write(
        `  [integrate] rebuilt ${ticketPath} from merge-target events: ${rebuilt.appliedFields.join(", ")}\n`,
      );
    }
  }
  for (const path of conflicted) {
    if (handled.has(path)) continue;
    const stages = stagesOf(path);
    const step = stages.includes("3")
      ? gitResult(repoRoot, ["checkout", "--theirs", "--", path])
      : gitResult(repoRoot, ["rm", "--quiet", "--", path]);
    if (step.status !== 0) return null;
    if (stages.includes("3") && gitResult(repoRoot, ["add", "--", path]).status !== 0) return null;
  }
  const unresolved = zeroSeparatedPaths(repoRoot, ["diff", "--name-only", "--diff-filter=U", "-z"]);
  if (unresolved.length > 0) return null;
  const commit = gitResult(repoRoot, [
    "commit",
    "--no-verify",
    ...(params.message ? ["-m", params.message] : ["--no-edit"]),
  ]);
  return commit.status === 0 ? conflicted : null;
}

// Merge the task exec branch into the branch currently checked out at repoRoot.
// Serializes with the scheduler lock so parallel merges do not race on root HEAD.
// `releaseRootPaths` are root-side working copies of bookkeeping files that the exec branch also
// carries (see releaseRootWorkingCopies); they are restored when the merge does not complete.
export function mergeWorktreeIntoCurrent(params: {
  context: WorktreeOpsContext;
  worktree: ExecWorktree;
  taskId: string;
  message?: string;
  releaseRootPaths?: string[];
  // Paths owned by the exec branch (the item's own bookkeeping: ticket / event / plan / result).
  // When the merge conflicts only on these paths, the conflict is resolved with the exec branch
  // side (the latest bookkeeping after the resume) and the merge is completed instead of aborted.
  resolveConflictsWithBranchPaths?: string[];
  ffOnly?: boolean;
  dryRun?: boolean;
  failureLogPath?: string;
}): void {
  const { context, worktree, taskId } = params;
  const targetBranch = currentBranch(context.repoRoot);
  if (targetBranch === worktree.branch) {
    throw new Error(`Merge must run from a branch other than ${worktree.branch}.`);
  }
  let lockDir = "";
  let released: RootWorkingCopy[] = [];
  let merged = false;
  const releasePaths = (params.releaseRootPaths ?? []).map((path) =>
    repoRelative(context.repoRoot, path),
  );
  const releasePathSet = new Set(releasePaths);
  try {
    if (!params.dryRun) {
      lockDir = acquireSchedulerLock(context.schedulePath, {
        actor: `worktree-merge:${targetBranch}`,
        lockTimeoutMs: DEFAULT_LOCK_TIMEOUT_MS,
        lockStaleMs: DEFAULT_LOCK_STALE_MS,
      });
      released = releaseRootWorkingCopies(context.repoRoot, releasePaths);
    }
    const dirty = commitTargetPaths(context, worktree, taskId);
    if (dirty.length > 0) {
      throw new Error(`Worktree has uncommitted commit-target changes: ${dirty.join(", ")}`);
    }
    const compareBase = gitOutput(context.repoRoot, ["merge-base", "HEAD", worktree.branch]).trim();
    const count = Number.parseInt(
      gitOutput(context.repoRoot, [
        "rev-list",
        "--count",
        `${compareBase}..${worktree.branch}`,
      ]).trim(),
      10,
    );
    if (!Number.isFinite(count) || count < 1) {
      throw new Error(`No commits to merge from ${worktree.branch}.`);
    }
    const mergePaths = new Set(
      zeroSeparatedPaths(context.repoRoot, [
        "diff",
        "--no-renames",
        "--name-only",
        "-z",
        `${compareBase}..${worktree.branch}`,
      ]),
    );
    const overlap = [...rootDirtyPaths(context.repoRoot)].filter(
      (path) => mergePaths.has(path) && !(params.dryRun && releasePathSet.has(path)),
    );
    if (overlap.length > 0) {
      throw new Error(`Current worktree changes overlap merge paths: ${overlap.join(", ")}`);
    }
    if (params.dryRun) {
      process.stdout.write(
        `[dry-run] git merge ${params.ffOnly ? "--ff-only" : params.message ? `--no-ff -m ${JSON.stringify(params.message)}` : "--no-ff --no-edit"} ${worktree.branch}\n`,
      );
      return;
    }
    const mergeArgs = params.ffOnly
      ? ["merge", "--ff-only", worktree.branch]
      : params.message
        ? ["merge", "--no-ff", "-m", params.message, worktree.branch]
        : ["merge", "--no-ff", "--no-edit", worktree.branch];
    const mergeResult = gitResult(context.repoRoot, mergeArgs);
    if (mergeResult.status === 0) {
      merged = true;
    } else {
      const mergeOutput = [mergeResult.stdout, mergeResult.stderr]
        .filter((part): part is string => typeof part === "string" && part.length > 0)
        .join(mergeResult.stdout && mergeResult.stderr ? "\n" : "");
      const mergeInProgress =
        gitResult(context.repoRoot, ["rev-parse", "--verify", "--quiet", "MERGE_HEAD"]).status ===
        0;
      const resolved =
        mergeInProgress && !params.ffOnly
          ? resolveBranchOwnedConflicts({
              repoRoot: context.repoRoot,
              branchOwnedPaths: (params.resolveConflictsWithBranchPaths ?? []).map((path) =>
                repoRelative(context.repoRoot, path),
              ),
              message: params.message,
            })
          : null;
      if (resolved && resolved.length > 0) {
        merged = true;
        process.stdout.write(
          `  [integrate] resolved bookkeeping conflicts with ${worktree.branch}: ${resolved.join(", ")}\n`,
        );
        return;
      }
      const abortResult = mergeInProgress ? abortMerge(context.repoRoot) : undefined;

      if (params.failureLogPath) {
        mkdirSync(resolve(params.failureLogPath, ".."), { recursive: true });
        const abortOutput = abortResult
          ? [abortResult.stdout, abortResult.stderr]
              .filter((part): part is string => typeof part === "string" && part.length > 0)
              .join(abortResult.stdout && abortResult.stderr ? "\n" : "")
          : "";
        appendGitFailureLog(params.failureLogPath, [
          `=== ${new Date().toISOString()} git ${mergeArgs.join(" ")} ===`,
          `exit: ${mergeResult.status ?? "unknown"}`,
          "--- stdout ---",
          typeof mergeResult.stdout === "string" ? mergeResult.stdout : "",
          "--- stderr ---",
          typeof mergeResult.stderr === "string" ? mergeResult.stderr : "",
          "--- merge --abort ---",
          abortResult ? `exit: ${abortResult.status ?? "unknown"}` : "not required",
          abortOutput,
          "",
        ]);
      }

      const summary = summarizeGitHookFailure(mergeOutput);
      if (abortResult && abortResult.status !== 0) {
        const abortOutput = [abortResult.stdout, abortResult.stderr]
          .filter((part): part is string => typeof part === "string" && part.length > 0)
          .join("\n");
        const abortSummary = summarizeGitHookFailure(abortOutput);
        const instruction =
          `automatic git merge --abort failed; run git merge --abort manually in ` +
          `${context.repoRoot} before continuing`;
        process.stderr.write(`error: ${instruction}; ${abortSummary}\n`);
        throw new Error(`git merge failed: ${summary}; ${instruction}; ${abortSummary}`);
      }
      throw new Error(`git merge failed: ${summary}`);
    }
  } finally {
    if (!merged && released.length > 0) restoreRootWorkingCopies(context.repoRoot, released);
    if (lockDir) releaseSchedulerLock(lockDir);
  }
}

// Whether the task exec branch is already contained in the merge-target HEAD. The integrate
// stage retry uses this to stay idempotent: when a previous attempt merged but failed afterwards
// (for example while removing the worktree), re-running the merge would fail with "No commits to
// merge", so the retry skips the merge and continues with the remaining integration steps.
// exec ブランチが統合ブランチへ merge 済みかを判定する。ancestor 判定だけでは、exec ブランチが
// 作成直後（先端が統合ブランチ上の commit のまま）の場合も true になる。runner の統合は
// --no-ff で merge するため、merge 済みなら先端は HEAD の first-parent 連鎖には含まれない。
// 先端が first-parent 連鎖上にあるなら、task の commit がまだ無い状態とみなす。
export function isExecBranchMergedIntoCurrent(params: {
  context: WorktreeOpsContext;
  worktree: ExecWorktree;
}): boolean {
  const repoRoot = params.context.repoRoot;
  const isAncestor =
    gitResult(repoRoot, ["merge-base", "--is-ancestor", params.worktree.branch, "HEAD"]).status ===
    0;
  if (!isAncestor) return false;
  const tip = gitResult(repoRoot, ["rev-parse", "--verify", `${params.worktree.branch}^{commit}`]);
  if (tip.status !== 0 || typeof tip.stdout !== "string") return false;
  const firstParentChain = gitOutput(repoRoot, ["rev-list", "--first-parent", "HEAD"])
    .split("\n")
    .map((line) => line.trim());
  return !firstParentChain.includes(tip.stdout.trim());
}

// Put a root path back to its HEAD state: tracked files are restored, paths absent from HEAD are
// removed (and unstaged if a hook or caller had staged them).
function restoreToHead(repoRoot: string, relPath: string): void {
  const tracked = gitResult(repoRoot, ["ls-files", "--error-unmatch", "--", relPath]).status === 0;
  if (tracked) {
    gitOutput(repoRoot, ["restore", "--source=HEAD", "--staged", "--worktree", "--", relPath]);
  } else {
    gitResult(repoRoot, ["reset", "--quiet", "--", relPath]);
    rmSync(resolve(repoRoot, relPath), { recursive: true, force: true });
  }
}
