import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { acquireSchedulerLock, releaseSchedulerLock } from "./exec-events.js";
import type { PipelineRepoIntegrationState } from "./exec-pipeline-state.js";
import { productIntegrationTarget } from "./exec-task-repos.js";
import {
  abortMerge,
  commitTargetPaths,
  isExecBranchMergedIntoCurrent,
  REGISTER_NEW_FILE_DIR_PREFIXES,
  repoRelative,
  stabilizeCommitTargets,
  stageCommitTargets,
  worktreeStatusPaths,
  type WorktreeOpsContext,
} from "./exec-worktree-ops.js";
import {
  gitOutput,
  gitResult,
  listRegisteredWorktrees,
  summarizeGitHookFailure,
  type ExecWorktree,
  type ProductWorktree,
} from "./exec-worktree.js";
import { PROJECT_REPO_WORKTREE_DIRNAME, resolveRepoQualifiedRef } from "./specdojo-config.js";

// PJR-0WAA: 1 つのタスクがプロジェクトリポジトリと宣言済みのプロダクトリポジトリ（`repos`）を
// 変更する場合の統合段。commit 対象の算出と commit はリポジトリごとに行い、統合の前に全リポジトリ
// で merge 可否を確かめる。統合は宣言順にプロダクト、最後にプロジェクトの順で行い、リポジトリ別の
// 状態を pipeline state（`stages.integrate.repos`）へ記録する。再開では統合済みのリポジトリを
// Git の状態から判定して飛ばし、失敗した位置から続ける。`repos` を持たない project では、
// プロジェクト側の手順だけを従来どおりの順で実行する。

/** Name under which the project repository is recorded in `stages.integrate.repos`. */
export const PROJECT_REPO_NAME = PROJECT_REPO_WORKTREE_DIRNAME;

const DEFAULT_LOCK_TIMEOUT_MS = 10_000;
const DEFAULT_LOCK_STALE_MS = 300_000;

// プロダクト側でも生成物として再生成されるため commit 対象にしないパス。
const PRODUCT_EXCLUDED_PATHS: ReadonlySet<string> = new Set([".specdojo/doc-index.json"]);

function zeroSeparated(cwd: string, args: string[]): string[] {
  return gitOutput(cwd, args).split("\0").filter(Boolean);
}

function gitText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

// ── commit 対象の算出と commit ─────────────────────────────────────────────

/**
 * Split `targets` of the task by product repository: `<repo>:<path>` values whose prefix is a
 * product of the task become repository-relative paths. Doc ids and invalid values are ignored
 * (the project side and the config validation handle them).
 */
export function productTargetPaths(
  targets: readonly string[],
  products: readonly Pick<ProductWorktree, "name">[],
): Map<string, string[]> {
  const byRepo = new Map<string, string[]>();
  for (const target of targets) {
    let ref: ReturnType<typeof resolveRepoQualifiedRef>;
    try {
      ref = resolveRepoQualifiedRef(target, products);
    } catch {
      continue;
    }
    if (ref.kind !== "repo" || ref.path === ".") continue;
    byRepo.set(ref.repo, [...(byRepo.get(ref.repo) ?? []), ref.path]);
  }
  return byRepo;
}

export type ProductCommitPartition = { targets: string[]; outOfScope: string[] };

/**
 * Commit targets of a product worktree. Changes and deletions of files tracked at HEAD are always
 * committed. A new file is committed only under the known deliverable directories, a top-level
 * directory tracked at HEAD, or a path named by the task's `<repo>:<path>` targets, so scratch
 * files the agent left at the repository root are not committed (same policy as register tasks).
 */
export function partitionProductCommitTargets(
  product: Pick<ProductWorktree, "path">,
  targetPaths: readonly string[] = [],
): ProductCommitPartition {
  const candidates = worktreeStatusPaths(product.path).filter(
    (path) => !PRODUCT_EXCLUDED_PATHS.has(path),
  );
  if (candidates.length === 0) return { targets: [], outOfScope: [] };
  const tracked = new Set(
    zeroSeparated(product.path, [
      "ls-tree",
      "-r",
      "--name-only",
      "--full-tree",
      "-z",
      "HEAD",
      "--",
      ...candidates,
    ]),
  );
  const allowedPrefixes = [
    ...REGISTER_NEW_FILE_DIR_PREFIXES,
    ...zeroSeparated(product.path, ["ls-tree", "-d", "--name-only", "-z", "HEAD"]).map(
      (dir) => `${dir}/`,
    ),
    ...targetPaths.map((path) => `${path}/`),
  ];
  const allowedFiles = new Set(targetPaths);
  const targets: string[] = [];
  const outOfScope: string[] = [];
  for (const path of candidates) {
    const allowed =
      tracked.has(path) ||
      allowedFiles.has(path) ||
      allowedPrefixes.some((prefix) => path.startsWith(prefix));
    (allowed ? targets : outOfScope).push(path);
  }
  return { targets, outOfScope };
}

export type ProductCommitOutcome = {
  repo: string;
  targets: string[];
  outOfScope: string[];
  committed: boolean;
};

/** Commit the commit targets of one product worktree onto its exec branch. */
export function commitProductWorktree(
  product: ProductWorktree,
  params: { message: string; targetPaths?: readonly string[] },
): ProductCommitOutcome {
  const targetPaths = params.targetPaths ?? [];
  const { targets, outOfScope } = partitionProductCommitTargets(product, targetPaths);
  if (targets.length === 0) {
    return { repo: product.name, targets, outOfScope, committed: false };
  }
  stageCommitTargets(product.path, targets);
  const staged = gitResult(product.path, ["diff", "--cached", "--quiet", "--", ...targets]);
  if (staged.status === 0) return { repo: product.name, targets, outOfScope, committed: false };
  if (staged.status !== 1) {
    throw new Error(`${product.name}: failed to inspect staged changes in ${product.path}`);
  }
  const commit = gitResult(product.path, ["commit", "-m", params.message, "--", ...targets]);
  if (commit.status !== 0) {
    // hook が失敗すると stage が残る。範囲を限った reset で後続の検査を誤らせない。
    gitResult(product.path, ["reset", "--quiet", "--", ...targets]);
    const output = [gitText(commit.stdout), gitText(commit.stderr)].filter(Boolean).join("\n");
    throw new Error(`${product.name}: commit failed: ${summarizeGitHookFailure(output)}`);
  }
  stabilizeCommitTargets(
    product.path,
    () => partitionProductCommitTargets(product, targetPaths).targets,
  );
  return { repo: product.name, targets, outOfScope, committed: true };
}

/**
 * Commit every product worktree of the task (declaration order). Out-of-scope files stay in the
 * worktree and are reported to stdout and `scopeLogPath`; the pre-integration check then blocks
 * the integration so they are never discarded with the worktree.
 */
export function commitProductWorktrees(params: {
  worktree: ExecWorktree;
  message: string;
  targets?: readonly string[];
  scopeLogPath?: string;
}): ProductCommitOutcome[] {
  const products = params.worktree.repos ?? [];
  if (products.length === 0) return [];
  const targetPaths = productTargetPaths(params.targets ?? [], products);
  const outcomes: ProductCommitOutcome[] = [];
  for (const product of products) {
    if (!existsSync(product.path)) continue;
    const outcome = commitProductWorktree(product, {
      message: params.message,
      targetPaths: targetPaths.get(product.name),
    });
    if (outcome.targets.length > 0) {
      process.stdout.write(
        `commit-targets (${product.name}):\n${outcome.targets
          .map((path) => `  ${product.name}:${path}`)
          .join("\n")}\n`,
      );
    }
    if (outcome.outOfScope.length > 0) {
      const warning =
        `commit-scope: skipped non-target changes (left in worktree):\n` +
        `${outcome.outOfScope.map((path) => `  ${product.name}:${path}`).join("\n")}\n`;
      process.stdout.write(warning);
      if (params.scopeLogPath) {
        mkdirSync(dirname(params.scopeLogPath), { recursive: true });
        appendFileSync(params.scopeLogPath, warning, "utf8");
      }
    }
    outcomes.push(outcome);
  }
  return outcomes;
}

// ── 統合状態の判定 ─────────────────────────────────────────────────────────

/**
 * - merged: the exec branch was merged into the integration target (its tip is an ancestor of the
 *   target but not on the target's first-parent line, since the runner merges with a merge commit)
 * - unchanged: the exec branch has no commits of its own (its tip is on the first-parent line)
 * - pending: the exec branch has commits that are not in the integration target
 */
export type ProductMergeState = "merged" | "unchanged" | "pending";

export function productMergeState(product: ProductWorktree): ProductMergeState {
  const target = productIntegrationTarget(product);
  const tip = gitResult(product.repoRoot, ["rev-parse", "--verify", `${product.branch}^{commit}`]);
  if (tip.status !== 0) return "pending";
  const ancestor = gitResult(product.repoRoot, [
    "merge-base",
    "--is-ancestor",
    product.branch,
    target,
  ]);
  if (ancestor.status !== 0) return "pending";
  const firstParent = gitOutput(product.repoRoot, ["rev-list", "--first-parent", target])
    .split("\n")
    .map((line) => line.trim());
  return firstParent.includes(gitText(tip.stdout).trim()) ? "unchanged" : "merged";
}

// ── 事前検査 ───────────────────────────────────────────────────────────────

export type RepoIntegrationBlocker = { repo: string; message: string };

type MergeTreeResult =
  | { kind: "clean"; tree: string }
  | { kind: "conflicts"; paths: string[] }
  | { kind: "error"; detail: string };

// 作業ツリーを変えずに merge の結果を求める（git 2.38 以降の `merge-tree --write-tree`）。
function mergeTree(repoRoot: string, target: string, branch: string): MergeTreeResult {
  const result = gitResult(repoRoot, [
    "merge-tree",
    "--write-tree",
    "--name-only",
    "--no-messages",
    target,
    branch,
  ]);
  const lines = gitText(result.stdout)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (result.status === 0 && lines[0]) return { kind: "clean", tree: lines[0] };
  if (result.status === 1) return { kind: "conflicts", paths: [...new Set(lines.slice(1))] };
  const detail = gitText(result.stderr).trim() || `exit ${result.status ?? "unknown"}`;
  return { kind: "error", detail };
}

function mergeChangedPaths(repoRoot: string, target: string, branch: string): Set<string> {
  return new Set(
    zeroSeparated(repoRoot, ["diff", "--no-renames", "--name-only", "-z", `${target}...${branch}`]),
  );
}

function dirtyPaths(cwd: string): Set<string> {
  return new Set([
    ...zeroSeparated(cwd, ["diff", "--no-renames", "--name-only", "-z"]),
    ...zeroSeparated(cwd, ["diff", "--cached", "--no-renames", "--name-only", "-z"]),
    ...zeroSeparated(cwd, ["ls-files", "--others", "--exclude-standard", "-z"]),
  ]);
}

function mergeInProgress(cwd: string): boolean {
  return gitResult(cwd, ["rev-parse", "--verify", "--quiet", "MERGE_HEAD"]).status === 0;
}

// 統合先ブランチを checkout している worktree（主 checkout を含む）。無ければ undefined。
function checkoutOfBranch(repoRoot: string, branch: string): string | undefined {
  return listRegisteredWorktrees(repoRoot).find((worktree) => worktree.branch === branch)?.path;
}

function branchExists(repoRoot: string, branch: string): boolean {
  return (
    gitResult(repoRoot, ["rev-parse", "--verify", "--quiet", `refs/heads/${branch}`]).status === 0
  );
}

/**
 * Reasons why a product repository cannot be integrated. Checked for every repository before any
 * of them is merged, so a failure found here leaves every repository unintegrated.
 */
export function productMergeBlockers(product: ProductWorktree): RepoIntegrationBlocker[] {
  const block = (message: string): RepoIntegrationBlocker => ({ repo: product.name, message });
  if (!existsSync(product.path)) return [block(`worktree is missing: ${product.path}`)];
  const blockers: RepoIntegrationBlocker[] = [];
  const leftover = worktreeStatusPaths(product.path).filter(
    (path) => !PRODUCT_EXCLUDED_PATHS.has(path),
  );
  if (leftover.length > 0) {
    blockers.push(
      block(
        `uncommitted changes outside the commit scope: ` +
          leftover.map((path) => `${product.name}:${path}`).join(", "),
      ),
    );
  }
  const target = productIntegrationTarget(product);
  if (target === "HEAD" || !branchExists(product.repoRoot, target)) {
    blockers.push(
      block(
        `integration branch ${target === "HEAD" ? "(detached HEAD)" : target} is not a local ` +
          `branch; set repos[].integration_branch`,
      ),
    );
    return blockers;
  }
  if (target === product.branch) {
    blockers.push(block(`integration branch must differ from the exec branch ${product.branch}`));
    return blockers;
  }
  if (productMergeState(product) !== "pending") return blockers;

  const merged = mergeTree(product.repoRoot, target, product.branch);
  if (merged.kind === "conflicts") {
    blockers.push(block(`merge conflicts with ${target}: ${merged.paths.join(", ")}`));
  } else if (merged.kind === "error") {
    blockers.push(block(`cannot check the merge into ${target}: ${merged.detail}`));
  }
  const checkout = checkoutOfBranch(product.repoRoot, target);
  if (checkout) {
    if (mergeInProgress(checkout)) {
      blockers.push(block(`a merge is in progress in ${checkout}`));
    } else {
      const changed = mergeChangedPaths(product.repoRoot, target, product.branch);
      const overlap = [...dirtyPaths(checkout)].filter((path) => changed.has(path));
      if (overlap.length > 0) {
        blockers.push(
          block(`uncommitted changes in ${checkout} overlap merge paths: ${overlap.join(", ")}`),
        );
      }
    }
  }
  return blockers;
}

/**
 * Reasons why the project exec branch cannot be merged into the branch checked out at the project
 * root. Conflicts on `ownedPaths` (the item's own bookkeeping) are resolved by the merge itself and
 * root working copies of `releasePaths` are released right before the merge, so neither blocks.
 */
export function projectMergeBlockers(params: {
  context: WorktreeOpsContext;
  worktree: ExecWorktree;
  taskId: string;
  releasePaths?: readonly string[];
  ownedPaths?: readonly string[];
}): RepoIntegrationBlocker[] {
  const { context, worktree } = params;
  const repoRoot = context.repoRoot;
  const block = (message: string): RepoIntegrationBlocker => ({ repo: PROJECT_REPO_NAME, message });
  if (isExecBranchMergedIntoCurrent({ context, worktree })) return [];
  const target = gitText(gitResult(repoRoot, ["branch", "--show-current"]).stdout).trim();
  if (!target) return [block("detached HEAD is not supported as the integration target")];
  if (target === worktree.branch) {
    return [block(`merge must run from a branch other than ${worktree.branch}`)];
  }
  if (mergeInProgress(repoRoot)) return [block(`a merge is in progress in ${repoRoot}`)];

  const blockers: RepoIntegrationBlocker[] = [];
  const uncommitted = commitTargetPaths(context, worktree, params.taskId);
  if (uncommitted.length > 0) {
    blockers.push(block(`uncommitted commit-target changes: ${uncommitted.join(", ")}`));
  }
  const toRelative = (paths: readonly string[] | undefined): Set<string> =>
    new Set((paths ?? []).map((path) => repoRelative(repoRoot, resolve(path))));
  const owned = toRelative(params.ownedPaths);
  const released = toRelative(params.releasePaths);
  const merged = mergeTree(repoRoot, "HEAD", worktree.branch);
  if (merged.kind === "conflicts") {
    const unexpected = merged.paths.filter((path) => !owned.has(path));
    if (unexpected.length > 0) {
      blockers.push(block(`merge conflicts with ${target}: ${unexpected.join(", ")}`));
    }
  } else if (merged.kind === "error") {
    blockers.push(block(`cannot check the merge into ${target}: ${merged.detail}`));
  }
  const changed = mergeChangedPaths(repoRoot, "HEAD", worktree.branch);
  const overlap = [...dirtyPaths(repoRoot)].filter(
    (path) => changed.has(path) && !released.has(path),
  );
  if (overlap.length > 0) {
    blockers.push(block(`uncommitted changes at root overlap merge paths: ${overlap.join(", ")}`));
  }
  return blockers;
}

// ── プロダクトの merge ─────────────────────────────────────────────────────

function appendFailureLog(path: string | undefined, lines: string[]): void {
  if (!path) return;
  mkdirSync(dirname(path), { recursive: true });
  appendFileSync(path, `${lines.join("\n")}\n`, "utf8");
}

/**
 * Merge the product exec branch into its integration target with a merge commit and return the
 * merge commit. When the target is checked out (normally the product's main checkout), a regular
 * `git merge --no-ff` updates that working tree; a failed merge is aborted. Otherwise the merge
 * commit is written with `merge-tree` / `commit-tree` and the branch is moved with a
 * compare-and-swap `update-ref`, so a concurrent update of the target is never overwritten.
 */
export function mergeProductIntoTarget(params: {
  product: ProductWorktree;
  message: string;
  failureLogPath?: string;
}): string {
  const { product, message } = params;
  const target = productIntegrationTarget(product);
  const checkout = checkoutOfBranch(product.repoRoot, target);
  const header = `=== ${new Date().toISOString()} ${product.name}: merge ${product.branch} into ${target} ===`;
  if (checkout) {
    const result = gitResult(checkout, ["merge", "--no-ff", "-m", message, product.branch]);
    if (result.status === 0) return gitOutput(checkout, ["rev-parse", "HEAD"]).trim();
    const output = [gitText(result.stdout), gitText(result.stderr)].filter(Boolean).join("\n");
    const abort = mergeInProgress(checkout) ? abortMerge(checkout) : undefined;
    appendFailureLog(params.failureLogPath, [
      header,
      `git -C ${checkout} merge --no-ff ${product.branch}`,
      `exit: ${result.status ?? "unknown"}`,
      output,
      "--- merge --abort ---",
      abort ? `exit: ${abort.status ?? "unknown"}` : "not required",
      "",
    ]);
    const summary = summarizeGitHookFailure(output);
    if (abort && abort.status !== 0) {
      throw new Error(
        `git merge into ${target} failed: ${summary}; automatic git merge --abort failed; ` +
          `run git merge --abort manually in ${checkout} before continuing`,
      );
    }
    throw new Error(`git merge into ${target} failed: ${summary}`);
  }

  const merged = mergeTree(product.repoRoot, target, product.branch);
  if (merged.kind !== "clean") {
    const detail =
      merged.kind === "conflicts" ? `conflicts: ${merged.paths.join(", ")}` : merged.detail;
    appendFailureLog(params.failureLogPath, [header, `merge-tree: ${detail}`, ""]);
    throw new Error(`merge into ${target} failed: ${detail}`);
  }
  const parent = gitOutput(product.repoRoot, ["rev-parse", `refs/heads/${target}`]).trim();
  const tip = gitOutput(product.repoRoot, ["rev-parse", `${product.branch}^{commit}`]).trim();
  const commit = gitOutput(product.repoRoot, [
    "commit-tree",
    merged.tree,
    "-p",
    parent,
    "-p",
    tip,
    "-m",
    message,
  ]).trim();
  const update = gitResult(product.repoRoot, [
    "update-ref",
    "-m",
    `exec: merge ${product.branch}`,
    `refs/heads/${target}`,
    commit,
    parent,
  ]);
  if (update.status !== 0) {
    const detail = gitText(update.stderr).trim() || `exit ${update.status ?? "unknown"}`;
    appendFailureLog(params.failureLogPath, [header, `update-ref: ${detail}`, ""]);
    throw new Error(`failed to update ${target}: ${detail}`);
  }
  return commit;
}

// ── 再開前の統合先取り込み ─────────────────────────────────────────────────

// PJR-GENJ: `--resume` で reporter 段・統合段から再開する前に、統合先ブランチの最新を各リポジトリの
// exec branch と worktree へ取り込む。取り込まないまま親検証を実行すると、統合先で直した不具合が
// 検証に反映されず、同じ失敗を繰り返す。executor の成果は worktree に未 commit のまま残っているため、
// 通常の merge（`--no-commit`）で取り込み、未 commit の変更と重なる場合は Git が merge を拒否する。
// 競合は自動解決せず merge を中止して理由を返す。ただし `theirsPaths`（項目自身の記帳ファイル）の
// 競合だけは統合先の内容で解決する。wait commit 後の統合先が記帳の正本になるためである。

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

/**
 * Merge `target` into the branch checked out at `cwd` (an exec worktree) with a merge commit.
 * Uncommitted changes in the worktree are kept as they are. Conflicts on `theirsPaths`
 * (repository-relative) take the target side; any other conflict, or a merge that Git refuses to
 * start (for example because it would overwrite uncommitted changes), aborts the merge and throws.
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
    const output = [gitText(merge.stdout), gitText(merge.stderr)]
      .join("\n")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .join(" ");
    throw new Error(
      `${repo}: cannot merge ${target} into the exec branch` + (output ? `: ${output}` : ""),
    );
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
    throw error;
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

// ── 統合段 ─────────────────────────────────────────────────────────────────

export type RepoIntegrationRecorder = (
  repo: string,
  patch: Partial<PipelineRepoIntegrationState>,
) => void;

/** Integration failure that names the integrated and the remaining repositories. */
export class RepoIntegrationError extends Error {
  readonly repo: string;
  readonly integrated: readonly string[];
  readonly pending: readonly string[];

  constructor(params: {
    repo: string;
    cause: string;
    integrated: readonly string[];
    pending: readonly string[];
  }) {
    super(
      `${params.repo}: ${params.cause}; integrated repositories: ` +
        `${params.integrated.length > 0 ? params.integrated.join(", ") : "none"}; ` +
        `not integrated: ${params.pending.join(", ")}`,
    );
    this.name = "RepoIntegrationError";
    this.repo = params.repo;
    this.integrated = params.integrated;
    this.pending = params.pending;
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Integrate a task. Without product worktrees this runs `beforeProjectMerge` and `mergeProject`
 * only (the single-repository sequence, unchanged). With product worktrees:
 *
 * 1. check every product that still has commits to integrate and the project (`checkProject`); if
 *    any repository cannot be integrated, nothing is merged
 * 2. merge the products in declaration order, skipping those already merged (resume)
 * 3. run `beforeProjectMerge` (record and commit the project-side state) and `mergeProject`
 *
 * Each repository's state is passed to `record`. The project is recorded as merged before
 * `beforeProjectMerge` commits the state, because its merge commit contains the state itself;
 * a failure overwrites the record with `failed`. Failures are thrown as RepoIntegrationError.
 */
export function integrateTaskRepositories(params: {
  worktree: ExecWorktree;
  mergeMessage: string;
  // プロダクト側の merge commit の message。省略時は `mergeMessage`。プロジェクト側の記帳
  // （遷移・executor など）をプロダクトの履歴へ複製しないために分ける（PJR-30SW）。
  productMergeMessage?: string;
  checkProject: () => RepoIntegrationBlocker[];
  beforeProjectMerge: () => void;
  mergeProject: () => void;
  record?: RepoIntegrationRecorder;
  failureLogPath?: string;
  // 同じプロジェクトの並行タスクがプロダクトの統合先を同時に更新しないよう、プロジェクトの
  // merge と同じ scheduler lock で直列化する（schedule path）。
  lockPath?: string;
}): void {
  const products = params.worktree.repos ?? [];
  if (products.length === 0) {
    params.beforeProjectMerge();
    params.mergeProject();
    return;
  }
  const record: RepoIntegrationRecorder = params.record ?? (() => undefined);
  const order = [...products.map((product) => product.name), PROJECT_REPO_NAME];
  const done = new Set<string>();
  // 統合済み（merge 済み、または統合する変更が無い）のリポジトリ。
  const integratedLabels = (): string[] => order.filter((name) => done.has(name));
  const pendingNames = (): string[] => order.filter((name) => !done.has(name));
  const fail = (repo: string, cause: string): RepoIntegrationError => {
    record(repo, { status: "failed", error: cause });
    return new RepoIntegrationError({
      repo,
      cause,
      integrated: integratedLabels(),
      pending: pendingNames(),
    });
  };

  const states = new Map<string, ProductMergeState>();
  for (const product of products) {
    const state = productMergeState(product);
    states.set(product.name, state);
    if (state === "pending") continue;
    done.add(product.name);
    process.stdout.write(
      `  [integrate] ${product.name}: ${state === "merged" ? "already merged" : "no changes"}; skipped\n`,
    );
  }

  // `checkProject` は project worktree の未 commit 対象も検査する。state を先に書くと、その
  // runner-owned 変更自体を未 commit と誤認するため、全 repository の検査後に初期状態を記録する。
  const recordInitialStates = (): void => {
    for (const product of products) {
      const status = states.get(product.name) ?? "pending";
      record(
        product.name,
        status === "pending" ? { status, commit: null, merged_at: null } : { status },
      );
    }
    record(PROJECT_REPO_NAME, { status: "pending", commit: null, merged_at: null });
  };

  // 1. 事前検査。どれか 1 つでも統合できなければ、どのリポジトリも統合しない。
  const blockers = [...products.flatMap(productMergeBlockers), ...params.checkProject()];
  if (blockers.length > 0) {
    recordInitialStates();
    const failedRepos = [...new Set(blockers.map((blocker) => blocker.repo))];
    for (const repo of failedRepos) {
      const messages = blockers.filter((blocker) => blocker.repo === repo);
      record(repo, { status: "failed", error: messages.map((item) => item.message).join("; ") });
    }
    for (const name of pendingNames()) {
      if (!failedRepos.includes(name)) record(name, { status: "pending" });
    }
    throw new RepoIntegrationError({
      repo: failedRepos.join(", "),
      cause:
        `pre-integration check failed (no repository was integrated in this attempt): ` +
        blockers.map((blocker) => `${blocker.repo}: ${blocker.message}`).join("; "),
      integrated: integratedLabels(),
      pending: pendingNames(),
    });
  }
  recordInitialStates();

  // 2. 宣言順にプロダクトを統合する。
  for (const product of products) {
    if (states.get(product.name) !== "pending") continue;
    let lockDir = "";
    let commit: string;
    try {
      if (params.lockPath) {
        lockDir = acquireSchedulerLock(params.lockPath, {
          actor: `worktree-merge:${product.name}`,
          lockTimeoutMs: DEFAULT_LOCK_TIMEOUT_MS,
          lockStaleMs: DEFAULT_LOCK_STALE_MS,
        });
      }
      commit = mergeProductIntoTarget({
        product,
        message: params.productMergeMessage ?? params.mergeMessage,
        failureLogPath: params.failureLogPath,
      });
    } catch (error) {
      throw fail(product.name, errorMessage(error));
    } finally {
      if (lockDir) releaseSchedulerLock(lockDir);
    }
    done.add(product.name);
    record(product.name, { status: "merged", commit, merged_at: new Date().toISOString() });
    process.stdout.write(
      `  [integrate] ${product.name}: merged ${product.branch} into ` +
        `${productIntegrationTarget(product)} (${commit.slice(0, 12)})\n`,
    );
  }

  // 3. 最後にプロジェクトを統合する。
  record(PROJECT_REPO_NAME, {
    status: "merged",
    commit: null,
    merged_at: new Date().toISOString(),
  });
  try {
    params.beforeProjectMerge();
    params.mergeProject();
  } catch (error) {
    throw fail(PROJECT_REPO_NAME, errorMessage(error));
  }
  done.add(PROJECT_REPO_NAME);
}
