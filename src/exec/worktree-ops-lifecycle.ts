import { copyFileSync, existsSync, lstatSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { stripTerminalControlSequences } from "./shared.js";
import {
  discardStaleProductWorktrees,
  ensureProductWorktrees,
  projectRepoDirName,
  productWorktreeRemovalBlockers,
  removeEmptyTaskDirectory,
  removeProductWorktrees,
  type ProductRepo,
} from "./task-repos.js";
import {
  appendGitFailureLog,
  appendGitResultFailureLog,
  ensureExecWorktree,
  execBranchExists,
  findExecWorktree,
  formatGitResultFailure,
  generateWorktreeArtifacts,
  gitOutput,
  gitResult,
  listRegisteredWorktrees,
  summarizeGitHookFailure,
  worktreeNameFromTaskId,
  type ExecWorktree,
  type GitCommandOutcome,
  type ProductWorktree,
} from "./worktree.js";
import {
  commitTargetPaths,
  currentBranch,
  repoRelative,
  stageCommitTargets,
  unstageCommitTargets,
  worktreeStatusPaths,
  zeroSeparatedPaths,
  type WorktreeOpsContext,
} from "./worktree-ops-commit.js";

// Remove a task worktree once its commit-target changes are committed and merged.
export function removeWorktree(params: {
  context: WorktreeOpsContext;
  worktree: ExecWorktree;
  taskId: string;
  force?: boolean;
  deleteBranch?: boolean;
  dryRun?: boolean;
}): void {
  const { context, worktree, taskId } = params;
  if (resolve(context.repoRoot) === resolve(worktree.path)) {
    throw new Error("Run remove from the merge-target worktree, not the task worktree.");
  }
  const dirty = commitTargetPaths(context, worktree, taskId);
  const merged =
    gitResult(context.repoRoot, ["merge-base", "--is-ancestor", worktree.branch, "HEAD"]).status ===
    0;
  if (!params.force && dirty.length > 0) {
    throw new Error(`Worktree has uncommitted commit-target changes: ${dirty.join(", ")}`);
  }
  if (!params.force && !merged) {
    throw new Error(`Exec branch is not merged into current HEAD: ${worktree.branch}`);
  }
  // プロダクト worktree もすべて撤去できることを先に確かめる。一部のリポジトリだけを撤去した
  // 状態を作らないため、検査はどの worktree を消すよりも前に行う。
  const productBlockers = params.force ? [] : productWorktreeRemovalBlockers(worktree);
  if (productBlockers.length > 0) {
    throw new Error(`Product worktrees cannot be removed: ${productBlockers.join("; ")}`);
  }
  // Past the guards, any remaining uncommitted files are non-commit-target bookkeeping
  // (doc-index, generated/, events) that were intentionally excluded from the task commit.
  // git refuses to remove a worktree while those are dirty, so force past them: they are
  // regenerable, and the tool already judged the worktree removable.
  const leftover = worktreeStatusPaths(worktree.path);
  const forceGit = params.force || leftover.length > 0;
  if (params.force) {
    process.stderr.write("Warning: forcing worktree removal; uncommitted changes may be lost.\n");
  } else if (leftover.length > 0) {
    process.stderr.write(`Discarding regenerated files in worktree: ${leftover.join(", ")}\n`);
  }
  if (params.dryRun) {
    removeProductWorktrees({ worktree, deleteBranch: params.deleteBranch, dryRun: true });
    process.stdout.write(
      `[dry-run] git worktree remove${forceGit ? " --force" : ""} ${worktree.path}\n`,
    );
    if (params.deleteBranch) process.stdout.write(`[dry-run] git branch -d ${worktree.branch}\n`);
    return;
  }

  removeProductWorktrees({ worktree, deleteBranch: params.deleteBranch });
  gitOutput(context.repoRoot, [
    "worktree",
    "remove",
    ...(forceGit ? ["--force"] : []),
    worktree.path,
  ]);
  removeEmptyTaskDirectory(worktree);
  if (params.deleteBranch) {
    try {
      gitOutput(context.repoRoot, ["branch", "-d", worktree.branch]);
    } catch (error) {
      // worktree removal and branch deletion cannot be atomic: Git refuses to delete a branch
      // while it is checked out. Make the resulting state explicit so the caller does not report
      // that the worktree was preserved and operators can recover it with `worktree prune`.
      throw new WorktreeRemovedBranchDeletionError(worktree.branch, error);
    }
  }
}

export type OrphanedExecBranch = {
  branch: string;
  mergedIntoCurrent: boolean;
};

export class WorktreeRemovedBranchDeletionError extends Error {
  readonly branch: string;

  constructor(branch: string, cause: unknown) {
    super(
      `Worktree was removed, but exec branch deletion failed and the branch remains: ` +
        `${branch}; cause=${cause instanceof Error ? cause.message : String(cause)}`,
    );
    this.name = "WorktreeRemovedBranchDeletionError";
    this.branch = branch;
  }
}

// List project-scoped exec branches that are no longer checked out by any registered worktree.
// A failed/interrupted run intentionally keeps both its worktree and branch, so it is not an
// orphan. The merged flag lets callers distinguish safely removable residue from unintegrated
// work that must be preserved.
export function listOrphanedExecBranches(params: {
  repoRoot: string;
  projectId: string;
}): OrphanedExecBranch[] {
  const { repoRoot, projectId } = params;
  const projectPrefix = `exec/${worktreeNameFromTaskId(projectId)}-`;
  const registeredBranches = new Set(
    listRegisteredWorktrees(repoRoot)
      .map((worktree) => worktree.branch)
      .filter((branch): branch is string => !!branch),
  );
  const branches = gitOutput(repoRoot, [
    "for-each-ref",
    "--format=%(refname:short)",
    "refs/heads/exec/",
  ])
    .split(/\r?\n/)
    .map((branch) => branch.trim())
    .filter((branch) => branch.startsWith(projectPrefix) && !registeredBranches.has(branch))
    .sort();

  return branches.map((branch) => ({
    branch,
    mergedIntoCurrent:
      gitResult(repoRoot, ["merge-base", "--is-ancestor", branch, "HEAD"]).status === 0,
  }));
}

// Delete only merged orphan branches with Git's safe `-d`. Unmerged branches are always retained,
// even if the caller asks for a real prune. A deletion failure is not swallowed: gitOutput's
// stderr-backed reason is propagated so the execution log records why residue remains.
export function pruneOrphanedExecBranches(params: {
  repoRoot: string;
  projectId: string;
  dryRun?: boolean;
}): OrphanedExecBranch[] {
  const current = currentBranch(params.repoRoot);
  if (current.startsWith("exec/")) {
    throw new Error("Run worktree prune from the merge-target worktree, not an exec branch.");
  }

  const orphaned = listOrphanedExecBranches(params);
  for (const item of orphaned) {
    if (!item.mergedIntoCurrent) continue;
    if (!params.dryRun) {
      try {
        gitOutput(params.repoRoot, ["branch", "-d", item.branch]);
      } catch (error) {
        throw new Error(
          `Failed to delete merged orphaned exec branch ${item.branch}; ` +
            `cause=${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
  }
  return orphaned;
}

// A fresh claim of a task that still owns an exec worktree/branch means a prior lifecycle
// (e.g. blocked or cancelled, then reset to todo) left residue behind. The scheduler has abandoned
// that branch, so discard it before re-preparing: otherwise checkpointAndEnsureWorktree reuses the
// stale worktree, skips the checkpoint commit, and the freshly-scaffolded root plan/result/claim
// files never reach the exec branch (the merge would land the stale branch's versions instead).
// Returns the discarded branch name for logging, or null when no residue existed.
export function discardStaleExecWorktree(params: {
  context: WorktreeOpsContext;
  worktreeTaskId: string;
  /** Declared product repositories whose task worktrees/branches are discarded together. */
  products?: readonly ProductRepo[];
}): string | null {
  const { context, worktreeTaskId } = params;
  const branch = `exec/${worktreeNameFromTaskId(worktreeTaskId)}`;
  const existing = findExecWorktree(context.repoRoot, worktreeTaskId);
  // プロダクト側の残骸は、プロジェクト側に残骸が無くても片付ける（作成途中で失敗した場合など）。
  const discardedProducts = discardStaleProductWorktrees(params.products ?? [], worktreeTaskId);
  if (!existing && !execBranchExists(context.repoRoot, worktreeTaskId)) {
    return discardedProducts.length > 0 ? discardedProducts.join(", ") : null;
  }
  if (existing) {
    if (resolve(context.repoRoot) === resolve(existing.path)) {
      throw new Error(`Refusing to discard the merge-target worktree as stale residue: ${branch}`);
    }
    // Force past any uncommitted/blocked state in the abandoned worktree; its branch is discarded
    // next, so nothing here is worth preserving.
    gitOutput(context.repoRoot, ["worktree", "remove", "--force", existing.path]);
    if ((params.products ?? []).length > 0) removeEmptyTaskDirectory({ ...existing, repos: [] });
  }
  // The branch is unmerged (the scheduler reset the task to todo), so a safe `-d` would fail; use
  // `-D` to drop it deliberately.
  if (execBranchExists(context.repoRoot, worktreeTaskId)) {
    gitOutput(context.repoRoot, ["branch", "-D", branch]);
  }
  return [branch, ...discardedProducts].join(", ");
}

function copyCheckpointPath(sourceRoot: string, targetRoot: string, relPath: string): void {
  const source = resolve(sourceRoot, relPath);
  const target = resolve(targetRoot, relPath);
  if (!existsSync(source)) {
    rmSync(target, { recursive: true, force: true });
    return;
  }
  const stat = lstatSync(source);
  if (!stat.isFile()) {
    throw new Error(`Execution checkpoint path must be a file: ${relPath}`);
  }
  mkdirSync(resolve(target, ".."), { recursive: true });
  copyFileSync(source, target);
}

export function assertCheckpointInspection(
  args: readonly string[],
  result: GitCommandOutcome,
  failureLogPath?: string,
): void {
  if (result.status === 0 || result.status === 1) return;
  appendGitResultFailureLog(failureLogPath, "git diff checkpoint inspection", result);
  throw new Error(
    `Failed to inspect execution checkpoint changes: ${formatGitResultFailure(args, result)}`,
  );
}

// Create the task worktree from the current integration HEAD, then commit the execution
// checkpoint (plan / result / claim or register-start bookkeeping) on the exec branch only. The
// root keeps its uncommitted copies so the task state stays visible there while the agent runs;
// the merge releases them (releaseRootWorkingCopies) right before the exec branch lands.
// Consequently the prepare/start bookkeeping is reachable through the merge DAG without adding a
// first-parent commit to the integration branch.
//
// PJR-98G4: with declared product repositories the project worktree moves to
// `<base>/<task-name>/project/` and each product gets `<base>/<task-name>/<repo>/`. The checkpoint
// commit stays in the project repository; product exec branches start from their integration
// target.
//
// PJR-NN43: `specdojo build` in the project worktree loads the config, which checks that every
// `repos[].path` (`../<repo>` beside `project/`) exists. The product worktrees are therefore
// created before the project build (and before the checkpoint commit, whose hooks may load the
// config as well).
export function checkpointAndEnsureWorktree(params: {
  context: WorktreeOpsContext;
  worktreeTaskId: string;
  base: string;
  checkpointPaths: string[];
  commitMessage: string;
  products?: readonly ProductRepo[];
  failureLogPath?: string;
}): ExecWorktree {
  const products = params.products ?? [];
  let repos: ProductWorktree[] = [];
  const worktree = checkpointAndEnsureProjectWorktree(params, projectRepoDirName(products), () => {
    if (products.length === 0) return;
    repos = ensureProductWorktrees({
      products,
      worktreeBase: params.base,
      taskId: params.worktreeTaskId,
    });
  });
  if (products.length === 0) return worktree;
  return { ...worktree, repos };
}

function checkpointAndEnsureProjectWorktree(
  params: {
    context: WorktreeOpsContext;
    worktreeTaskId: string;
    base: string;
    checkpointPaths: string[];
    commitMessage: string;
    failureLogPath?: string;
  },
  repoDirName: string | undefined,
  ensureSiblingWorktrees: () => void,
): ExecWorktree {
  const { context, worktreeTaskId, base } = params;
  const branch = `exec/${worktreeNameFromTaskId(worktreeTaskId)}`;
  // The project build runs only after the sibling product worktrees exist (see above).
  const ensureProjectWorktree = (): ExecWorktree => {
    const worktree = ensureExecWorktree({
      repoRoot: context.repoRoot,
      worktreeBase: base,
      taskId: worktreeTaskId,
      repoDirName,
      generateArtifacts: () => undefined,
    });
    ensureSiblingWorktrees();
    generateWorktreeArtifacts(worktree.path);
    return worktree;
  };

  const existing = findExecWorktree(context.repoRoot, worktreeTaskId);
  if (existing) {
    // 依存と違い、生成物は前回実行時のまま古くなる。生成段階を持たない版が作成した
    // worktree では存在すらしない。再利用時も作り直し、生成物起因の検証失敗を避ける。
    // 前回の準備がプロダクト worktree の作成前に失敗した場合に備え、先にそれらを揃える。
    ensureSiblingWorktrees();
    generateWorktreeArtifacts(existing.path);
    return existing;
  }

  if (!execBranchExists(context.repoRoot, worktreeTaskId)) {
    if (currentBranch(context.repoRoot) === branch) {
      throw new Error(`Prepare must run from a branch other than ${branch}.`);
    }
    const paths = params.checkpointPaths.map((path) => repoRelative(context.repoRoot, path));
    const stagedFiles = zeroSeparatedPaths(context.repoRoot, [
      "diff",
      "--cached",
      "--no-renames",
      "--name-only",
      "-z",
    ]);
    const checkpointPaths = new Set(paths);
    const overlapping = stagedFiles.filter((path) => checkpointPaths.has(path));
    if (overlapping.length > 0) {
      throw new Error(
        `Root index has staged checkpoint changes; commit or unstage them first:\n${overlapping.join("\n")}`,
      );
    }
    if (stagedFiles.length > 0) {
      process.stderr.write(
        `Warning: root index has unrelated staged changes; preserving them while preparing the checkpoint:\n` +
          `${stagedFiles.map((path) => `  ${path}`).join("\n")}\n`,
      );
    }

    const worktree = ensureProjectWorktree();
    for (const path of paths) copyCheckpointPath(context.repoRoot, worktree.path, path);
    stageCommitTargets(worktree.path, paths);
    const checkpointArgs = ["diff", "--cached", "--quiet", "--", ...paths];
    const checkpoint = gitResult(worktree.path, checkpointArgs);
    assertCheckpointInspection(checkpointArgs, checkpoint, params.failureLogPath);
    if (checkpoint.status === 1) {
      const committed = gitResult(worktree.path, [
        "commit",
        "-m",
        params.commitMessage,
        "--",
        ...paths,
      ]);
      if (committed.status !== 0) {
        // A failing git hook (pre-commit / commit-msg) aborts the commit but leaves the staged
        // paths in the index. Unstage only this checkpoint so a hook or caller's unrelated staged
        // paths remain intact.
        unstageCommitTargets(worktree.path, paths);
        // hook（lefthook 等）の生出力には ANSI エスケープや制御文字が含まれうる。この detail は
        // register 経路で pjr-index の結論列・result の理由欄へ伝播するため、ここで除去して
        // 表示崩れを防ぐ（register 側の sanitize と二重だが、非 register の呼び出し元も守る）。
        const output = [committed.stdout, committed.stderr]
          .map((part) =>
            typeof part === "string" ? stripTerminalControlSequences(part).trim() : "",
          )
          .filter(Boolean)
          .join("\n");
        appendGitFailureLog(params.failureLogPath, [
          `=== ${new Date().toISOString()} git commit checkpoint ===`,
          `exit: ${committed.status ?? "unknown"}`,
          "--- stdout ---",
          typeof committed.stdout === "string" ? committed.stdout : "",
          "--- stderr ---",
          typeof committed.stderr === "string" ? committed.stderr : "",
          "",
        ]);
        throw new Error(
          `Checkpoint commit failed (${params.commitMessage}); staged changes rolled back ` +
            `(likely a failing git hook): ${summarizeGitHookFailure(output)}`,
        );
      }
    }
    return worktree;
  }

  return ensureProjectWorktree();
}
