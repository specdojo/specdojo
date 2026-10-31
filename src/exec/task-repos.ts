import { expandBranchTemplate } from "../shared/branch-template.js";
import { existsSync, readdirSync, rmdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  getProjectRepos,
  getProjectSchedulePath,
  loadConfig,
  PROJECT_REPO_WORKTREE_DIRNAME,
  resolveRepoRoot,
  specdojoRootDir,
  type AgentProvider,
  type SpecDojoProjectConfig,
  type SpecDojoRepoConfig,
} from "../shared/specdojo-config.js";
import {
  ensureExecWorktree,
  execWorktreePath,
  findExecWorktree,
  generateWorktreeArtifacts,
  gitOutput,
  gitResult,
  installWorktreeDependencies,
  listRegisteredWorktrees,
  worktreeNameFromTaskId,
  type ExecWorktree,
  type ProductWorktree,
} from "./worktree.js";

import {
  assertProductBranchAvailable,
  existingProductTaskBranch,
  forgetProductBranch,
  productBranchExists,
  productBranchRecords,
  recordedProductBranch,
  reserveProductBranch,
} from "./product-branch-records.js";

// PJR-98G4: 1 つのタスクがプロジェクトリポジトリと宣言済みのプロダクトリポジトリ（`repos`）を
// 変更する場合の worktree を扱う。`repos` を持たない project では、ここの関数はどれも空の結果を
// 返し、既存の 1 リポジトリ・`<worktree_base>/<task-id>/` 直下の配置を変えない。

export { PROJECT_REPO_WORKTREE_DIRNAME };

/** A declared product repository resolved for exec (absolute root and setup defaults). */
export type ProductRepo = {
  name: string;
  repoRoot: string;
  integrationBranch?: string;
  branchTemplate?: string;
  /** Resolved run-scoped product branch. */
  branch?: string;
  integrationStrategy?: SpecDojoRepoConfig["integration_strategy"];
  /** Run npm ci for tracked package-lock.json files. Defaults to true (same as the project). */
  install: boolean;
  /** Run `specdojo build` when the repository has a SpecDojo config. Defaults to true. */
  build: boolean;
};

export type IntegrationBranchOverrides = ReadonlyMap<string, string>;

/** Parse repeatable `<repo>=<branch>` values used by `exec run --integration-branch`. */
export function parseIntegrationBranchOverrides(
  values: string | readonly string[] | undefined,
): Map<string, string> {
  const entries = values === undefined ? [] : typeof values === "string" ? [values] : values;
  const overrides = new Map<string, string>();
  for (const entry of entries) {
    const separator = entry.indexOf("=");
    const repo = separator > 0 ? entry.slice(0, separator).trim() : "";
    const branch = separator > 0 ? entry.slice(separator + 1).trim() : "";
    if (!repo || !branch) {
      throw new Error(
        `--integration-branch must use <repo>=<branch> with non-empty values: ${entry}`,
      );
    }
    if (overrides.has(repo)) {
      throw new Error(`--integration-branch specifies repository "${repo}" more than once`);
    }
    overrides.set(repo, branch);
  }
  return overrides;
}

function isIntegrationBranchOverrides(
  value: string | readonly string[] | IntegrationBranchOverrides | undefined,
): value is IntegrationBranchOverrides {
  return value instanceof Map;
}

function toIntegrationBranchOverrides(
  value: string | readonly string[] | IntegrationBranchOverrides | undefined,
): IntegrationBranchOverrides {
  return isIntegrationBranchOverrides(value) ? value : parseIntegrationBranchOverrides(value);
}

function assertLocalIntegrationBranch(product: ProductRepo, branch: string): void {
  if (!existsSync(product.repoRoot)) {
    throw new Error(
      `Product repository "${product.name}" does not exist: ${product.repoRoot} (check repos[].path)`,
    );
  }
  const validName = gitResult(product.repoRoot, ["check-ref-format", "--branch", branch]);
  if (validName.status !== 0) {
    throw new Error(
      `--integration-branch for repository "${product.name}" is not a valid branch name: ${branch}`,
    );
  }
  const exists = gitResult(product.repoRoot, [
    "show-ref",
    "--verify",
    "--quiet",
    `refs/heads/${branch}`,
  ]);
  if (exists.status !== 0) {
    throw new Error(
      `--integration-branch for repository "${product.name}" is not a local branch: ${branch}`,
    );
  }
}

/** Resolve the configured target; undefined deliberately means "use the current branch". */
export function resolveProductIntegrationBranch(
  repo: Pick<SpecDojoRepoConfig, "name" | "integration_branch">,
  overrides: IntegrationBranchOverrides,
): string | undefined {
  const configuredBranch = repo.integration_branch?.trim();
  return overrides.get(repo.name) ?? (configuredBranch || undefined);
}

export function resolveProductRepos(
  rootDir: string,
  project: SpecDojoProjectConfig,
  integrationBranches?: string | readonly string[] | IntegrationBranchOverrides,
): ProductRepo[] {
  const overrides = toIntegrationBranchOverrides(integrationBranches);
  // Priority: run-scoped override → repos[].integration_branch → current branch (at use time).
  const configured = getProjectRepos(project);
  const configuredNames = new Set(configured.map((repo) => repo.name));
  const unknown = [...overrides.keys()].filter((name) => !configuredNames.has(name));
  if (unknown.length > 0) {
    throw new Error(
      `--integration-branch references undeclared product repositories: ${unknown.join(", ")}`,
    );
  }
  return configured.map((repo) => {
    const override = overrides.get(repo.name);
    const integrationBranch = resolveProductIntegrationBranch(repo, overrides);
    const product: ProductRepo = {
      name: repo.name,
      repoRoot: resolveRepoRoot(rootDir, repo),
      ...(integrationBranch ? { integrationBranch } : {}),
      ...(repo.branch_template ? { branchTemplate: repo.branch_template } : {}),
      ...(repo.integration_strategy ? { integrationStrategy: repo.integration_strategy } : {}),
      install: repo.setup?.install ?? true,
      build: repo.setup?.build ?? true,
    };
    if (override) assertLocalIntegrationBranch(product, override);
    return product;
  });
}

/** Product repositories of the project whose schedule path is `schedulePath` ([] when none). */
export function configuredProductRepos(
  schedulePath: string,
  integrationBranches?: string | readonly string[] | IntegrationBranchOverrides,
): ProductRepo[] {
  const overrides = toIntegrationBranchOverrides(integrationBranches);
  const { config } = loadConfig();
  const rootDir = specdojoRootDir();
  for (const project of Object.values(config?.projects ?? {})) {
    if (resolve(rootDir, getProjectSchedulePath(project)) === resolve(schedulePath)) {
      return resolveProductRepos(rootDir, project, overrides);
    }
  }
  if (overrides.size > 0) {
    throw new Error(
      `--integration-branch references undeclared product repositories: ${[...overrides.keys()].join(", ")}`,
    );
  }
  return [];
}

/** Declared product repositories represented as their current in-place checkouts. */
export function configuredProductCheckouts(schedulePath: string): ProductWorktree[] {
  return configuredProductRepos(schedulePath).map((product) => ({
    name: product.name,
    repoRoot: product.repoRoot,
    path: product.repoRoot,
    branch: productIntegrationTarget(product),
    created: false,
    ...(product.integrationBranch ? { integrationBranch: product.integrationBranch } : {}),
    ...(product.integrationStrategy ? { integrationStrategy: product.integrationStrategy } : {}),
  }));
}

/**
 * Run-scoped `--integration-branch` values recorded in the run checkpoint (`integration_branches`).
 * Only explicit overrides are recorded, so a run without the option keeps resolving its targets
 * from `repos[].integration_branch` or the current branch exactly as before.
 */
export function integrationBranchOverrideRecord(
  values: string | readonly string[] | undefined,
): Record<string, string> | undefined {
  const overrides = parseIntegrationBranchOverrides(values);
  return overrides.size > 0 ? Object.fromEntries(overrides) : undefined;
}

/**
 * Integration branch overrides for a resumed run. The checkpoint's overrides are reused so the
 * option does not have to be repeated; an explicit value must match the checkpoint, because a
 * run cannot change or add its integration target midway through execution.
 */
export function resumeIntegrationBranches(
  persisted: Readonly<Record<string, string>> | undefined,
  requested: string | readonly string[] | undefined,
): IntegrationBranchOverrides {
  const requestedOverrides = parseIntegrationBranchOverrides(requested);
  for (const [repo, branch] of requestedOverrides) {
    const original = persisted?.[repo];
    if (original !== branch) {
      throw new Error(
        `--integration-branch cannot change the resumed run target for "${repo}" ` +
          `(checkpoint: ${original ?? "not specified"}, requested: ${branch})`,
      );
    }
  }
  return new Map(Object.entries(persisted ?? {}));
}

/** Product repositories of the project `projectId` ([] when none or unknown). */
export function configuredProductReposForProject(projectId: string | undefined): ProductRepo[] {
  if (!projectId) return [];
  const { config } = loadConfig();
  const project = config?.projects[projectId];
  return project ? resolveProductRepos(specdojoRootDir(), project) : [];
}

/** Directory under `<worktree_base>/<task-name>/` used by the project worktree. */
export function projectRepoDirName(products: readonly ProductRepo[]): string | undefined {
  return products.length > 0 ? PROJECT_REPO_WORKTREE_DIRNAME : undefined;
}

/** Planned project worktree path (`<base>/<task>/` or `<base>/<task>/project/` with `repos`). */
export function plannedProjectWorktreePath(
  worktreeBase: string,
  taskId: string,
  products: readonly ProductRepo[],
): string {
  return execWorktreePath(worktreeBase, taskId, projectRepoDirName(products));
}

function currentBranchOrNull(repoRoot: string): string | null {
  const result = gitResult(repoRoot, ["branch", "--show-current"]);
  const branch = typeof result.stdout === "string" ? result.stdout.trim() : "";
  return result.status === 0 && branch ? branch : null;
}

/** Branch the product exec branch starts from and is integrated into. */
export function productIntegrationTarget(
  product: Pick<ProductRepo, "repoRoot" | "integrationBranch">,
): string {
  return product.integrationBranch ?? currentBranchOrNull(product.repoRoot) ?? "HEAD";
}

const skip = (): void => undefined;

export function preflightProductBranches(products: readonly ProductRepo[], taskId: string): void {
  for (const product of products) {
    if (!existsSync(product.repoRoot)) {
      throw new Error(
        `Product repository "${product.name}" does not exist: ${product.repoRoot} (check repos[].path)`,
      );
    }
    assertProductBranchAvailable(product.repoRoot, taskId, productBranchForTask(product, taskId));
  }
}

/** Reserve every name before recording register start or creating any product worktree. */
export function reserveProductBranches(products: readonly ProductRepo[], taskId: string): void {
  preflightProductBranches(products, taskId);
  for (const product of products) {
    reserveProductBranch(
      product.repoRoot,
      taskId,
      productBranchForTask(product, taskId),
      productIntegrationTarget(product),
    );
  }
}

/**
 * Create (or reuse) `<worktree_base>/<task-name>/<repo>/` for every product repository. A new
 * exec branch starts from the declared `integration_branch` (or the repository's current branch)
 * because the checkpoint commit belongs to the project repository only.
 */
export function ensureProductWorktrees(opts: {
  products: readonly ProductRepo[];
  worktreeBase: string;
  taskId: string;
  installDependencies?: (worktreePath: string) => void;
  generateArtifacts?: (worktreePath: string) => void;
}): ProductWorktree[] {
  reserveProductBranches(opts.products, opts.taskId);
  return opts.products.map((product) => {
    if (!existsSync(product.repoRoot)) {
      throw new Error(
        `Product repository "${product.name}" does not exist: ${product.repoRoot} (check repos[].path)`,
      );
    }
    const branch = productBranchForTask(product, opts.taskId);
    const generate = product.build ? (opts.generateArtifacts ?? generateWorktreeArtifacts) : skip;
    const existing = findExecWorktree(product.repoRoot, opts.taskId, branch);
    if (existing) {
      // Same as the project worktree on reuse: dependencies stay, generated files are rebuilt.
      generate(existing.path);
      return toProductWorktree(product, existing);
    }
    const worktree = ensureExecWorktree({
      repoRoot: product.repoRoot,
      worktreeBase: opts.worktreeBase,
      taskId: opts.taskId,
      repoDirName: product.name,
      branch,
      startPoint: productIntegrationTarget(product),
      installDependencies: product.install
        ? (opts.installDependencies ?? installWorktreeDependencies)
        : skip,
      generateArtifacts: generate,
    });
    return toProductWorktree(product, worktree);
  });
}

function toProductWorktree(product: ProductRepo, worktree: ExecWorktree): ProductWorktree {
  return {
    name: product.name,
    repoRoot: product.repoRoot,
    path: worktree.path,
    branch: worktree.branch,
    created: worktree.created,
    ...(product.integrationBranch ? { integrationBranch: product.integrationBranch } : {}),
    ...(product.integrationStrategy ? { integrationStrategy: product.integrationStrategy } : {}),
  };
}

/** Recorded names survive template/topic changes and do not depend on a branch prefix. */
export function productBranchForTask(
  product: ProductRepo,
  taskId: string,
  reuseRecorded = true,
): string {
  const separator = taskId.indexOf(":");
  const project = separator >= 0 ? taskId.slice(0, separator) : "";
  const id = separator >= 0 ? taskId.slice(separator + 1) : taskId;
  return (
    product.branch ??
    (reuseRecorded ? recordedProductBranch(product.repoRoot, taskId) : undefined) ??
    (product.branchTemplate
      ? expandBranchTemplate(product.branchTemplate, {
          project,
          id,
          topic: id.toLowerCase(),
          type: "feat",
          scope: "",
          title: id,
        })
      : `exec/${worktreeNameFromTaskId(taskId)}`)
  );
}

/** Registered product worktrees of a task (repositories without one are omitted). */
export function findProductWorktrees(
  products: readonly ProductRepo[],
  taskId: string,
): ProductWorktree[] {
  return products.flatMap((product) => {
    if (!existsSync(product.repoRoot)) return [];
    const branch = existingProductTaskBranch(product.repoRoot, taskId);
    if (!branch) return [];
    const found = findExecWorktree(product.repoRoot, taskId, branch);
    return found ? [toProductWorktree(product, found)] : [];
  });
}

/** Attach the task's product worktrees to the project worktree (no-op without `repos`). */
export function withProductWorktrees(
  worktree: ExecWorktree,
  products: readonly ProductRepo[],
  taskId: string,
): ExecWorktree {
  if (products.length === 0) return worktree;
  return { ...worktree, repos: findProductWorktrees(products, taskId) };
}

/** Repositories of a task that are missing a product worktree. */
export function missingProductWorktrees(
  products: readonly ProductRepo[],
  worktree: ExecWorktree,
): string[] {
  const present = new Set((worktree.repos ?? []).map((repo) => repo.name));
  return products.filter((product) => !present.has(product.name)).map((product) => product.name);
}

function statusPaths(worktreePath: string): string[] {
  return gitOutput(worktreePath, ["status", "--porcelain=v1", "-z", "--untracked-files=all"])
    .split("\0")
    .filter((record) => record.length >= 4)
    .map((record) => record.slice(3));
}

function commitsAhead(product: ProductWorktree): number {
  const target = productIntegrationTarget(product);
  const result = gitResult(product.repoRoot, [
    "rev-list",
    "--count",
    `${target}..${product.branch}`,
  ]);
  if (result.status !== 0 || typeof result.stdout !== "string") return 0;
  return Number.parseInt(result.stdout.trim(), 10) || 0;
}

function isMergedIntoTarget(
  product: Pick<ProductWorktree, "repoRoot" | "branch" | "integrationBranch">,
): boolean {
  const target = productIntegrationTarget(product);
  return (
    gitResult(product.repoRoot, ["merge-base", "--is-ancestor", product.branch, target]).status ===
    0
  );
}

/**
 * Describe product worktrees that hold work not yet in their integration target: uncommitted
 * changes or exec-branch commits. Only the exec run integrate stage (exec-repo-integration)
 * commits and merges product repositories; other paths (manual `exec worktree commit`) must not
 * integrate the project side and remove worktrees that still hold product work.
 */
export function pendingProductWorktreeChanges(worktree: ExecWorktree): string[] {
  const pending: string[] = [];
  for (const product of worktree.repos ?? []) {
    if (!existsSync(product.path)) continue;
    const dirty = statusPaths(product.path);
    const ahead = commitsAhead(product);
    if (dirty.length === 0 && ahead === 0) continue;
    const parts = [
      ...(dirty.length > 0
        ? [`uncommitted ${dirty.map((path) => `${product.name}:${path}`).join(", ")}`]
        : []),
      ...(ahead > 0 ? [`${ahead} commit(s) on ${product.branch}`] : []),
    ];
    pending.push(`${product.name} (${parts.join("; ")})`);
  }
  return pending;
}

export function assertNoPendingProductChanges(worktree: ExecWorktree): void {
  const pending = pendingProductWorktreeChanges(worktree);
  if (pending.length === 0) return;
  throw new Error(
    `product repository changes are not integrated: ${pending.join(" / ")}; ` +
      `product repositories are integrated only by exec run, so all task worktrees are kept`,
  );
}

/**
 * Check that every product worktree can be removed before any worktree of the task is removed,
 * so a partially removed task (some repositories gone, others kept) never occurs.
 */
export function productWorktreeRemovalBlockers(worktree: ExecWorktree): string[] {
  const blockers: string[] = [];
  for (const product of worktree.repos ?? []) {
    if (!existsSync(product.path)) continue;
    const dirty = statusPaths(product.path);
    if (dirty.length > 0) {
      blockers.push(
        `${product.name} has uncommitted changes: ${dirty.map((path) => `${product.name}:${path}`).join(", ")}`,
      );
    }
    if (product.integrationStrategy !== "branch-only" && !isMergedIntoTarget(product)) {
      blockers.push(
        `${product.name}: exec branch ${product.branch} is not merged into ${productIntegrationTarget(product)}`,
      );
    }
  }
  return blockers;
}

/** Remove product worktrees (and optionally their branches). Callers check blockers first. */
export function removeProductWorktrees(params: {
  worktree: ExecWorktree;
  deleteBranch?: boolean;
  dryRun?: boolean;
}): void {
  for (const product of params.worktree.repos ?? []) {
    const deleteBranch = params.deleteBranch && product.integrationStrategy !== "branch-only";
    if (params.dryRun) {
      process.stdout.write(
        `[dry-run] git -C ${product.repoRoot} worktree remove --force ${product.path}\n`,
      );
      if (deleteBranch) {
        process.stdout.write(`[dry-run] git -C ${product.repoRoot} branch -d ${product.branch}\n`);
      }
      continue;
    }
    if (existsSync(product.path)) {
      // Guards (clean, and merged unless branch-only) already ran.
      gitOutput(product.repoRoot, ["worktree", "remove", "--force", product.path]);
    } else {
      gitResult(product.repoRoot, ["worktree", "prune"]);
    }
    if (deleteBranch) {
      // `-d` compares with the main checkout's HEAD, which may differ from integration_branch.
      // Use `-D` only for a branch verified to be merged into its integration target; otherwise
      // keep Git's safe `-d` so unintegrated product work is never deleted.
      const flag = isMergedIntoTarget(product) ? "-D" : "-d";
      gitOutput(product.repoRoot, ["branch", flag, product.branch]);
      forgetProductBranch(product.repoRoot, product.branch);
    }
  }
}

/** Remove `<worktree_base>/<task-name>/` once every repository worktree under it is gone. */
export function removeEmptyTaskDirectory(worktree: ExecWorktree): void {
  if (!worktree.repos) return;
  const taskDir = dirname(worktree.path);
  if (!existsSync(taskDir)) return;
  try {
    if (readdirSync(taskDir).length === 0) rmdirSync(taskDir);
  } catch {
    // A leftover directory is harmless; the next prepare reuses or recreates it.
  }
}

/**
 * Discard abandoned product worktrees and exec branches of a task (fresh claim after a blocked
 * or cancelled lifecycle). Mirrors discardStaleExecWorktree for each product repository.
 */
export function discardStaleProductWorktrees(
  products: readonly ProductRepo[],
  taskId: string,
): string[] {
  // A retained branch is product-side review work, not abandoned scheduler residue.
  for (const product of products) {
    if (!existsSync(product.repoRoot)) continue;
    const branch = existingProductTaskBranch(product.repoRoot, taskId);
    if (
      product.integrationStrategy === "branch-only" &&
      branch &&
      productBranchExists(product.repoRoot, branch)
    ) {
      throw new Error(
        `${product.name}: retained exec branch ${branch} already exists; ` +
          `resume the existing run or finish product-side review and rename/remove the branch before a fresh run`,
      );
    }
  }
  const discarded: string[] = [];
  for (const product of products) {
    if (!existsSync(product.repoRoot)) continue;
    const branch = existingProductTaskBranch(product.repoRoot, taskId);
    if (!branch) continue;
    const existing = findExecWorktree(product.repoRoot, taskId, branch);
    if (existing) {
      if (resolve(product.repoRoot) === resolve(existing.path)) {
        throw new Error(
          `Refusing to discard the main checkout of ${product.name} as stale residue: ${branch}`,
        );
      }
      gitOutput(product.repoRoot, ["worktree", "remove", "--force", existing.path]);
    }
    if (productBranchExists(product.repoRoot, branch)) {
      gitOutput(product.repoRoot, ["branch", "-D", branch]);
    }
    forgetProductBranch(product.repoRoot, branch);
    discarded.push(`${product.name}:${branch}`);
  }
  return discarded;
}

export type OrphanedProductExecBranch = {
  repo: string;
  branch: string;
  mergedIntoTarget: boolean;
};

/** Exec branches of the project in each product repository that no worktree checks out. */
export function listOrphanedProductExecBranches(
  products: readonly ProductRepo[],
  projectId: string,
): OrphanedProductExecBranch[] {
  const prefix = `exec/${worktreeNameFromTaskId(projectId)}-`;
  return products.flatMap((product) => {
    if (!existsSync(product.repoRoot)) return [];
    const checkedOut = new Set(
      listRegisteredWorktrees(product.repoRoot)
        .map((worktree) => worktree.branch)
        .filter((branch): branch is string => !!branch),
    );
    const target = productIntegrationTarget(product);
    const legacyBranches = gitOutput(product.repoRoot, [
      "for-each-ref",
      "--format=%(refname:short)",
      "refs/heads/exec/",
    ])
      .split(/\r?\n/)
      .map((branch) => branch.trim())
      .filter((branch) => branch.startsWith(prefix));
    const records = productBranchRecords(product.repoRoot);
    const owned = records
      .filter((record) => record.taskId.startsWith(`${projectId}:`))
      .map((record) => record.branch);
    return [
      ...new Set([
        ...owned,
        ...legacyBranches.filter((branch) => !records.some((record) => record.branch === branch)),
      ]),
    ]
      .filter((branch) => !checkedOut.has(branch) && productBranchExists(product.repoRoot, branch))
      .sort()
      .map((branch) => ({
        repo: product.name,
        branch,
        mergedIntoTarget:
          gitResult(product.repoRoot, ["merge-base", "--is-ancestor", branch, target]).status === 0,
      }));
  });
}

/** Delete only orphan branches verified as merged into the product's integration target. */
export function pruneOrphanedProductExecBranches(params: {
  products: readonly ProductRepo[];
  projectId: string;
  dryRun?: boolean;
}): OrphanedProductExecBranch[] {
  const orphaned = listOrphanedProductExecBranches(params.products, params.projectId);
  for (const item of orphaned) {
    if (!item.mergedIntoTarget || params.dryRun) continue;
    const product = params.products.find((candidate) => candidate.name === item.repo);
    if (!product) continue;
    try {
      // The main checkout's HEAD need not be the integration target. Recheck that target
      // before using -D, just as removeProductWorktrees does for a non-orphan branch.
      if (!isMergedIntoTarget({ ...product, branch: item.branch })) continue;
      gitOutput(product.repoRoot, ["branch", "-D", item.branch]);
      forgetProductBranch(product.repoRoot, item.branch);
    } catch (error) {
      throw new Error(
        `Failed to delete merged orphaned exec branch ${item.repo}:${item.branch}; ` +
          `cause=${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  return orphaned;
}

// ── Agent environment and provider arguments ───────────────────────────────

export const REPO_NAMES_ENV = "SPECDOJO_REPO_NAMES";

/** `SPECDOJO_REPO_<NAME>` with `-` mapped to `_` (names are `[a-z0-9-]`, so this is injective). */
export function repoEnvironmentVariableName(name: string): string {
  return `SPECDOJO_REPO_${name.toUpperCase().replaceAll("-", "_")}`;
}

/**
 * Environment that tells the agent where each repository of the task is checked out.
 * `SPECDOJO_REPO_PROJECT` is the project worktree (the agent's cwd), `SPECDOJO_REPO_<NAME>`
 * each product worktree, and `SPECDOJO_REPO_NAMES` the comma-separated product names in
 * declaration order. Empty for tasks without product worktrees.
 */
export function productRepoEnvironment(
  projectWorktreePath: string,
  products: readonly Pick<ProductWorktree, "name" | "path">[] | undefined,
): Record<string, string> {
  if (!products || products.length === 0) return {};
  const env: Record<string, string> = {
    [repoEnvironmentVariableName(PROJECT_REPO_WORKTREE_DIRNAME)]: resolve(projectWorktreePath),
    [REPO_NAMES_ENV]: products.map((product) => product.name).join(","),
  };
  for (const product of products) {
    env[repoEnvironmentVariableName(product.name)] = resolve(product.path);
  }
  return env;
}

/**
 * Drop `SPECDOJO_REPO_*` inherited from the parent process (e.g. a runner started inside another
 * task's agent), so only the current task's repositories reach the agent and its sandbox flags.
 */
export function withoutInheritedRepoEnvironment(env: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  return Object.fromEntries(
    Object.entries(env).filter(([key]) => !key.startsWith("SPECDOJO_REPO_")),
  );
}

export type AgentRepoRoot = { name: string; path: string };

/** Product worktrees announced by productRepoEnvironment, in declaration order. */
export function productRootsFromEnvironment(env: NodeJS.ProcessEnv): AgentRepoRoot[] {
  const names = (env[REPO_NAMES_ENV] ?? "")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
  return names.flatMap((name) => {
    const path = env[repoEnvironmentVariableName(name)];
    return path ? [{ name, path }] : [];
  });
}

/**
 * Prompt section that tells the agent where the product worktrees are and how to name their
 * files. Empty without product worktrees, so single-repository prompts are unchanged.
 */
export function productRepoPromptSection(
  products: readonly Pick<ProductWorktree, "name" | "path">[] | undefined,
): string {
  if (!products || products.length === 0) return "";
  const rows = products.map(
    (product) =>
      `- \`${product.name}\`: ${resolve(product.path)} (environment variable ` +
      `\`${repoEnvironmentVariableName(product.name)}\`)`,
  );
  return [
    "",
    "# Task repositories",
    "",
    "This task spans several repositories. The working directory is the project repository " +
      "worktree. The product repositories are checked out as separate worktrees of the same task:",
    "",
    ...rows,
    "",
    "Edit product files under those absolute paths (or via the environment variables); paths " +
      "relative to the working directory refer to the project repository only. When reporting " +
      "a product file (for example in target_coverage), write it as `<repo>:<path>` relative to " +
      "that repository root, e.g. `" +
      `${products[0].name}:src/index.ts` +
      "`. Do not commit or change Git configuration in any repository.",
    "",
  ].join("\n");
}

/** Append productRepoPromptSection to a prompt (unchanged without product worktrees). */
export function withProductRepoPrompt(
  prompt: string,
  products: readonly Pick<ProductWorktree, "name" | "path">[] | undefined,
): string {
  const section = productRepoPromptSection(products);
  return section ? `${prompt.trimEnd()}\n${section}` : prompt;
}

function shellQuote(value: string): string {
  return `'${value.replaceAll("'", `'\\''`)}'`;
}

/**
 * Provider arguments that add the product worktrees as extra roots with write access. The agent
 * keeps the project worktree as cwd. Returns [] for providers without a launch flag. OpenCode's
 * orchestrator entry injects `permission.external_directory` through its runtime config instead.
 */
export function agentExtraRootArguments(
  provider: AgentProvider | undefined,
  dirs: readonly string[],
): string[] {
  if (dirs.length === 0) return [];
  const absolute = dirs.map((dir) => resolve(dir));
  switch (provider) {
    case "claude":
      // `--add-dir` makes the directory a working directory; `Edit(//<abs>/**)` is required because
      // the mode settings only allow edits under project-relative paths.
      return [
        "--add-dir",
        ...absolute,
        "--allowedTools",
        ...absolute.map((dir) => `Edit(/${dir}/**)`),
      ];
    case "codex":
    case "antigravity":
    case "copilot":
      return absolute.flatMap((dir) => ["--add-dir", dir]);
    default:
      return [];
  }
}

/** Append the extra-root arguments to a resolved shell command (unchanged when there are none). */
export function withAgentExtraRoots(
  command: string,
  provider: AgentProvider | undefined,
  dirs: readonly string[],
): string {
  const args = agentExtraRootArguments(provider, dirs);
  if (args.length === 0) return command;
  return `${command} ${args.map(shellQuote).join(" ")}`;
}
