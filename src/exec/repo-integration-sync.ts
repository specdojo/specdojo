import { existsSync } from "node:fs";
import { productIntegrationTarget } from "./task-repos.js";
import { abortMerge } from "./worktree-ops.js";
import { gitOutput, gitResult, type ExecWorktree } from "./worktree.js";
import {
  PROJECT_REPO_NAME,
  branchExists,
  dirtyPaths,
  gitText,
  mergeInProgress,
  zeroSeparated,
} from "./repo-integration-git.js";

export type IntegrationTargetSyncStatus = "merged" | "up-to-date" | "skipped";

export type IntegrationTargetSync = {
  repo: string;
  target: string;
  status: IntegrationTargetSyncStatus;
  detail?: string;
};

function isAncestor(cwd: string, ancestor: string, descendant: string): boolean {
  return gitResult(cwd, ["merge-base", "--is-ancestor", ancestor, descendant]).status === 0;
}

function hasPathAt(cwd: string, ref: string, path: string): boolean {
  return gitResult(cwd, ["cat-file", "-e", `${ref}:${path}`]).status === 0;
}

function gitFailure(result: ReturnType<typeof gitResult>): string {
  return [gitText(result.stdout), gitText(result.stderr)]
    .join("\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ");
}

type StashedWorktree = {
  oid: string;
  untrackedPaths: string[];
};

function stashWorktreeChanges(cwd: string, repo: string): StashedWorktree | undefined {
  if (dirtyPaths(cwd).size === 0) return undefined;
  const untrackedPaths = zeroSeparated(cwd, ["ls-files", "--others", "--exclude-standard", "-z"]);
  const stash = gitResult(cwd, [
    "stash",
    "push",
    "--include-untracked",
    "--message",
    `specdojo: ${repo} integration-target sync`,
  ]);
  if (stash.status !== 0) {
    const detail = gitFailure(stash) || `exit ${stash.status ?? "unknown"}`;
    throw new Error(`${repo}: cannot preserve uncommitted changes before sync: ${detail}`);
  }
  return {
    oid: gitOutput(cwd, ["rev-parse", "--verify", "refs/stash"]).trim(),
    untrackedPaths,
  };
}

function dropStash(cwd: string, stashOid: string): void {
  const stashes = gitOutput(cwd, ["stash", "list", "--format=%H"])
    .split("\n")
    .map((line) => line.trim());
  const index = stashes.indexOf(stashOid);
  if (index >= 0) gitOutput(cwd, ["stash", "drop", `stash@{${index}}`]);
}

function applyStashedWorktree(cwd: string, stashOid: string): ReturnType<typeof gitResult> {
  // `--index` は merge commit 側の index と衝突し、同一ファイルの非競合 hunk も戻せないため使わない。
  return gitResult(cwd, ["stash", "apply", "--quiet", stashOid]);
}

function treeObjectAt(cwd: string, ref: string, path: string): string | undefined {
  const entry = gitResult(cwd, ["ls-tree", "-z", ref, "--", path]);
  if (entry.status !== 0) return undefined;
  const output = gitText(entry.stdout);
  const separator = output.indexOf("\t");
  if (separator < 0) return undefined;
  return output.slice(0, separator).split(" ").at(-1);
}

function classifyTrackedStashedUntrackedPaths(
  cwd: string,
  stash: StashedWorktree,
): { identical: string[]; conflicting: string[] } {
  const identical: string[] = [];
  const conflicting: string[] = [];
  const untrackedRef = `${stash.oid}^3`;
  for (const path of stash.untrackedPaths) {
    const mergedObject = treeObjectAt(cwd, "HEAD", path);
    if (!mergedObject) continue;
    const stashedObject = treeObjectAt(cwd, untrackedRef, path);
    (stashedObject === mergedObject ? identical : conflicting).push(path);
  }
  return { identical, conflicting };
}

function restoreOriginalWorktree(params: {
  cwd: string;
  repo: string;
  originalHead: string;
  stash: StashedWorktree;
  reason: string;
}): never {
  const reset = gitResult(params.cwd, ["reset", "--hard", params.originalHead]);
  if (reset.status === 0 && params.stash.untrackedPaths.length > 0) {
    gitResult(params.cwd, ["clean", "-d", "-f", "--", ...params.stash.untrackedPaths]);
  }
  if (reset.status !== 0) {
    const detail = gitFailure(reset) || `exit ${reset.status ?? "unknown"}`;
    throw new Error(
      `${params.repo}: ${params.reason}; failed to restore the original HEAD: ${detail}; ` +
        `executor changes remain preserved in stash ${params.stash.oid}`,
    );
  }
  const restored = applyStashedWorktree(params.cwd, params.stash.oid);
  if (restored.status !== 0) {
    const detail = gitFailure(restored) || `exit ${restored.status ?? "unknown"}`;
    throw new Error(
      `${params.repo}: ${params.reason}; failed to restore executor changes: ${detail}; ` +
        `executor changes remain preserved in stash ${params.stash.oid}`,
    );
  }
  dropStash(params.cwd, params.stash.oid);
  throw new Error(`${params.repo}: ${params.reason}`);
}

/**
 * Merge `target` into the branch checked out at `cwd` (an exec worktree) with a merge commit.
 * Uncommitted changes (including untracked files) are stashed before the merge and restored
 * without restoring the old index. Conflicts on `theirsPaths` (repository-relative) take the
 * target side. Any other committed conflict aborts the merge. If restoring the stash conflicts,
 * the merge commit is rolled back and the executor changes are restored on the original HEAD.
 */
export function syncWorktreeWithIntegrationTarget(params: {
  repo: string;
  cwd: string;
  target: string;
  message: string;
  theirsPaths?: readonly string[];
}): IntegrationTargetSync {
  const { repo, cwd, target, message } = params;
  if (isAncestor(cwd, target, "HEAD")) return { repo, target, status: "up-to-date" };

  const originalHead = gitOutput(cwd, ["rev-parse", "HEAD"]).trim();
  const stash = stashWorktreeChanges(cwd, repo);

  const merge = gitResult(cwd, [
    "merge",
    "--no-commit",
    "--no-ff",
    "--no-verify",
    "-m",
    message,
    target,
  ]);
  if (merge.status !== 0 && !mergeInProgress(cwd)) {
    const output = gitFailure(merge);
    const reason = `cannot merge ${target} into the exec branch` + (output ? `: ${output}` : "");
    if (stash) {
      restoreOriginalWorktree({ cwd, repo, originalHead, stash, reason });
    }
    throw new Error(`${repo}: ${reason}`);
  }

  try {
    const conflicted = zeroSeparated(cwd, ["diff", "--name-only", "--diff-filter=U", "-z"]);
    const theirs = new Set(params.theirsPaths ?? []);
    const unexpected = conflicted.filter((path) => !theirs.has(path));
    if (unexpected.length > 0) {
      throw new Error(`${repo}: merge conflicts with ${target}: ${unexpected.join(", ")}`);
    }
    for (const path of conflicted) {
      if (hasPathAt(cwd, target, path)) {
        gitOutput(cwd, ["checkout", target, "--", path]);
        gitOutput(cwd, ["add", "--", path]);
      } else {
        gitOutput(cwd, ["rm", "--quiet", "--force", "--", path]);
      }
    }
    const unresolved = zeroSeparated(cwd, ["diff", "--name-only", "--diff-filter=U", "-z"]);
    if (unresolved.length > 0) {
      throw new Error(`${repo}: unresolved conflicts with ${target}: ${unresolved.join(", ")}`);
    }
    // The merge is runner-internal; hooks would re-run the very checks the resume is about to run.
    gitOutput(cwd, ["commit", "--no-verify", "-m", message]);
  } catch (error) {
    if (mergeInProgress(cwd)) abortMerge(cwd);
    if (stash) {
      restoreOriginalWorktree({
        cwd,
        repo,
        originalHead,
        stash,
        reason: error instanceof Error ? error.message.replace(`${repo}: `, "") : String(error),
      });
    }
    throw error;
  }

  if (stash) {
    const trackedUntracked = classifyTrackedStashedUntrackedPaths(cwd, stash);
    if (trackedUntracked.conflicting.length > 0) {
      restoreOriginalWorktree({
        cwd,
        repo,
        originalHead,
        stash,
        reason:
          `uncommitted executor changes conflict with ${target}: ` +
          `untracked files differ from tracked integration files: ${trackedUntracked.conflicting.join(", ")}`,
      });
    }
    if (trackedUntracked.identical.length > 0) {
      const removed = gitResult(cwd, [
        "rm",
        "--quiet",
        "--force",
        "--",
        ...trackedUntracked.identical,
      ]);
      if (removed.status !== 0) {
        const detail = gitFailure(removed) || `exit ${removed.status ?? "unknown"}`;
        restoreOriginalWorktree({
          cwd,
          repo,
          originalHead,
          stash,
          reason: `cannot prepare identical untracked files for restore: ${detail}`,
        });
      }
    }
    const restored = applyStashedWorktree(cwd, stash.oid);
    if (restored.status !== 0) {
      const detail = gitFailure(restored) || `exit ${restored.status ?? "unknown"}`;
      restoreOriginalWorktree({
        cwd,
        repo,
        originalHead,
        stash,
        reason: `uncommitted executor changes conflict with ${target}: ${detail}`,
      });
    }
    if (trackedUntracked.identical.length > 0) {
      const resolved = gitResult(cwd, ["checkout", "HEAD", "--", ...trackedUntracked.identical]);
      if (resolved.status !== 0) {
        const detail = gitFailure(resolved) || `exit ${resolved.status ?? "unknown"}`;
        restoreOriginalWorktree({
          cwd,
          repo,
          originalHead,
          stash,
          reason: `cannot finish restoring identical untracked files: ${detail}`,
        });
      }
    }
    dropStash(cwd, stash.oid);
  }
  return { repo, target, status: "merged" };
}

/**
 * Bring every repository of a task up to date with its integration target before a resumed stage
 * re-runs parent validations: products in declaration order, then the project. A product whose
 * integration target is not a local branch is skipped (the integration preflight reports it).
 * Products named in `integratedProducts` are skipped too: merging into an already integrated exec
 * branch would make the integration stage merge it again.
 * Throws on the first repository that cannot be synced; earlier repositories keep their merge.
 */
export function syncTaskWorktreesWithIntegrationTargets(params: {
  worktree: ExecWorktree;
  projectTarget: string;
  message: string;
  // project worktree からの相対パス。項目自身の記帳ファイルで、競合時は統合先の内容を採る。
  projectTheirsPaths?: readonly string[];
  // PJR-6RN3: 前回の統合段で統合済み（merged / unchanged）と記録されたプロダクト名。
  integratedProducts?: ReadonlySet<string>;
}): IntegrationTargetSync[] {
  const synced: IntegrationTargetSync[] = [];
  for (const product of params.worktree.repos ?? []) {
    const target = productIntegrationTarget(product);
    if (product.integrationStrategy === "branch-only" || product.integrationStrategy === "ff") {
      synced.push({
        repo: product.name,
        target,
        status: "skipped",
        detail:
          product.integrationStrategy === "ff"
            ? "fast-forward only (ff)"
            : "product-side review (branch-only)",
      });
      continue;
    }
    if (params.integratedProducts?.has(product.name)) {
      synced.push({ repo: product.name, target, status: "skipped", detail: "already integrated" });
      continue;
    }
    if (!existsSync(product.path)) {
      synced.push({ repo: product.name, target, status: "skipped", detail: "worktree missing" });
      continue;
    }
    if (target === "HEAD" || target === product.branch || !branchExists(product.repoRoot, target)) {
      synced.push({
        repo: product.name,
        target,
        status: "skipped",
        detail: "integration branch is not a local branch",
      });
      continue;
    }
    synced.push(
      syncWorktreeWithIntegrationTarget({
        repo: product.name,
        cwd: product.path,
        target,
        message: params.message,
      }),
    );
  }
  synced.push(
    syncWorktreeWithIntegrationTarget({
      repo: PROJECT_REPO_NAME,
      cwd: params.worktree.path,
      target: params.projectTarget,
      message: params.message,
      theirsPaths: params.projectTheirsPaths,
    }),
  );
  return synced;
}
