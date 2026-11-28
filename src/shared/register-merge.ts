import { gitOutput, gitResult } from "./git.js";
import {
  isInBranchScope,
  isInSyncScope,
  resolveSyncBranchTargets,
  type RegisterBranchTarget,
} from "./register-branch.js";

/** Outcome per sync branch; `source` is the sync branch, `branch` the current branch. */
export type RegisterBranchMergeOutcome =
  | { status: "on-register-branch"; source: string; branch: string }
  | { status: "up-to-date"; source: string; branch: string }
  | { status: "merged"; source: string; branch: string; commit: string };

export type RegisterMergeOutcome =
  { status: "disabled" } | { status: "checked"; branches: RegisterBranchMergeOutcome[] };

const EMPTY_TREE = "4b825dc642cb6eb9a060e54bf8d69288fbee4904";

function splitPaths(output: string): string[] {
  return output.split("\0").filter(Boolean);
}

function currentBranch(worktree: string): string | undefined {
  const result = gitResult(worktree, ["symbolic-ref", "--quiet", "--short", "HEAD"]);
  return result.status === 0 ? String(result.stdout).trim() : undefined;
}

function revision(worktree: string, spec: string): string | undefined {
  const result = gitResult(worktree, ["rev-parse", "--verify", "--quiet", `${spec}^{commit}`]);
  return result.status === 0 ? String(result.stdout).trim() : undefined;
}

function isAncestor(worktree: string, ancestor: string, descendant: string): boolean {
  return gitResult(worktree, ["merge-base", "--is-ancestor", ancestor, descendant]).status === 0;
}

/**
 * Merges every remote sync branch into the current branch, one way and with `--no-ff`, in the
 * order register then exec-events. A sync branch only adds bookkeeping on top of develop, so a
 * merge never conflicts unless develop edited a synced file directly; that case is aborted and
 * reported, and the later sync branches are not merged.
 */
export function mergeRegisterBranch(projectId: string): RegisterMergeOutcome {
  const targets = resolveSyncBranchTargets(projectId);
  if (!targets.length) return { status: "disabled" };
  const branch = currentBranch(targets[0]!.repoRoot);
  if (!branch) throw new Error("Register merge requires a checked-out branch (HEAD is detached).");
  // A sync branch must never receive another sync branch's bookkeeping.
  if (targets.some((target) => target.branch === branch)) {
    return {
      status: "checked",
      branches: targets.map((target) => ({
        status: "on-register-branch",
        source: target.branch,
        branch,
      })),
    };
  }
  return { status: "checked", branches: targets.map((target) => mergeOneBranch(target, branch)) };
}

function mergeOneBranch(target: RegisterBranchTarget, branch: string): RegisterBranchMergeOutcome {
  const worktree = target.repoRoot;
  const isRegisterPath = (path: string): boolean => isInBranchScope(target, path);
  if (revision(worktree, "MERGE_HEAD")) {
    throw new Error("Register merge cannot start while another merge is in progress.");
  }
  if (gitResult(worktree, ["diff", "--cached", "--quiet"]).status !== 0) {
    throw new Error("Register merge requires no staged changes; commit or unstage them first.");
  }
  const dirty = splitPaths(
    gitOutput(worktree, [
      "status",
      "--porcelain=v1",
      "-z",
      "--untracked-files=all",
      "--no-renames",
    ]),
  )
    .map((record) => record.slice(3))
    .filter(isRegisterPath);
  if (dirty.length) {
    throw new Error(
      `Register files have uncommitted changes on ${branch}; they belong to ${target.branch}: ` +
        dirty.join(", "),
    );
  }

  gitOutput(worktree, ["fetch", "--", target.remote, `refs/heads/${target.branch}`]);
  const remoteHead = gitOutput(worktree, ["rev-parse", "FETCH_HEAD"]).trim();
  if (isAncestor(worktree, remoteHead, "HEAD")) {
    return { status: "up-to-date", source: target.branch, branch };
  }

  const outside = splitPaths(
    gitOutput(worktree, ["diff", "--name-only", "-z", "--no-renames", `HEAD...${remoteHead}`]),
  ).filter((path) => !isRegisterPath(path));
  if (outside.length) {
    throw new Error(
      `Register branch ${target.branch} changes paths outside bookkeeping; refusing to merge: ` +
        outside.join(", "),
    );
  }

  const message = `chore(register): merge ${target.branch} into ${branch}`;
  const merge = gitResult(worktree, ["merge", "--no-ff", "--no-edit", "-m", message, remoteHead]);
  if (merge.status !== 0) {
    // The index was clean before the merge, so aborting only discards the merge attempt.
    if (revision(worktree, "MERGE_HEAD")) gitResult(worktree, ["merge", "--abort"]);
    throw new Error(
      `Register merge into ${branch} failed and was aborted. Register files were probably changed ` +
        `directly on ${branch}; restore them from ${target.branch} and retry.\n` +
        `${String(merge.stdout ?? "")}${String(merge.stderr ?? "")}`.trim(),
    );
  }
  return {
    status: "merged",
    source: target.branch,
    branch,
    commit: gitOutput(worktree, ["rev-parse", "HEAD"]).trim(),
  };
}

export type RegisterGuardMode = { kind: "staged" } | { kind: "range"; range: string };

export type RegisterGuardResult =
  { status: "disabled" } | { status: "checked"; violations: string[] };

function blobAt(worktree: string, commit: string, path: string): string | undefined {
  const result = gitResult(worktree, ["rev-parse", "--verify", "--quiet", `${commit}:${path}`]);
  return result.status === 0 ? String(result.stdout).trim() : undefined;
}

function stagedBlob(worktree: string, path: string): string | undefined {
  const line = String(gitOutput(worktree, ["ls-files", "--stage", "-z", "--", path]))
    .split("\0")
    .find(Boolean);
  return line ? line.split(" ")[1] : undefined;
}

function registerRefs(
  targets: readonly RegisterBranchTarget[],
  extra: readonly string[],
): string[] {
  const candidates = [
    ...targets.flatMap((target) => [
      `refs/remotes/${target.remote}/${target.branch}`,
      `refs/heads/${target.branch}`,
    ]),
    ...extra,
  ];
  const repoRoot = targets[0]!.repoRoot;
  return [...new Set(candidates.flatMap((ref) => revision(repoRoot, ref) ?? []))];
}

/**
 * Register content a parent carries: the newest register commit already merged into that parent.
 * A register-branch commit is its own base; develop's base is the last merged register commit.
 */
function registerBases(worktree: string, parent: string, refs: readonly string[]): string[] {
  return refs.flatMap((ref) => {
    const result = gitResult(worktree, ["merge-base", parent, ref]);
    return result.status === 0 ? [String(result.stdout).trim()] : [];
  });
}

function violationsFor(
  targets: readonly RegisterBranchTarget[],
  label: string,
  changed: readonly string[],
  blobOf: (path: string) => string | undefined,
  otherParents: readonly string[],
  refs: readonly string[],
): string[] {
  const worktree = targets[0]!.repoRoot;
  const bases = otherParents.flatMap((parent) => registerBases(worktree, parent, refs));
  return changed
    .filter((path) => isInSyncScope(targets, path))
    .filter((path) => {
      const blob = blobOf(path);
      return !bases.some((base) => blobAt(worktree, base, path) === blob);
    })
    .map((path) => `${label}: ${path}`);
}

/**
 * Detects direct edits of synced files (register and exec events) outside the sync branches.
 * A change is allowed only when its content equals what a merged-in parent received from a
 * sync branch. On a sync branch itself, its scope is enforced by `register branch-check`.
 */
export function checkRegisterGuard(
  projectId: string,
  mode: RegisterGuardMode,
): RegisterGuardResult {
  const targets = resolveSyncBranchTargets(projectId);
  if (!targets.length) return { status: "disabled" };
  const worktree = targets[0]!.repoRoot;

  if (mode.kind === "staged") {
    const branch = currentBranch(worktree);
    if (targets.some((target) => target.branch === branch)) {
      return { status: "checked", violations: [] };
    }
    const head = revision(worktree, "HEAD");
    const changed = splitPaths(
      gitOutput(worktree, [
        "diff",
        "--cached",
        "--name-only",
        "-z",
        "--no-renames",
        head ?? EMPTY_TREE,
      ]),
    );
    const mergeHead = revision(worktree, "MERGE_HEAD");
    const parents = mergeHead ? [mergeHead] : [];
    const refs = registerRefs(targets, parents);
    return {
      status: "checked",
      violations: violationsFor(
        targets,
        "staged",
        changed,
        (path) => stagedBlob(worktree, path),
        parents,
        refs,
      ),
    };
  }

  const refs = registerRefs(targets, []);
  const lines = gitOutput(worktree, ["rev-list", "--parents", mode.range, "--"]).trim();
  const violations: string[] = [];
  for (const line of lines ? lines.split("\n") : []) {
    const [commit, firstParent, ...otherParents] = line.split(" ") as [string, ...string[]];
    // Commits made on a sync branch itself are the source of truth.
    if (refs.some((ref) => isAncestor(worktree, commit, ref))) continue;
    const changed = splitPaths(
      gitOutput(worktree, [
        "diff",
        "--name-only",
        "-z",
        "--no-renames",
        firstParent ?? EMPTY_TREE,
        commit,
      ]),
    );
    violations.push(
      ...violationsFor(
        targets,
        commit.slice(0, 12),
        changed,
        (path) => blobAt(worktree, commit, path),
        otherParents,
        refs,
      ),
    );
  }
  return { status: "checked", violations };
}
