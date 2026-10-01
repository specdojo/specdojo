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
} from "./specdojo-config.js";
import {
  ensureExecWorktree,
  execBranchExists,
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
} from "./exec-worktree.js";

// PJR-98G4: 1 つのタスクがプロジェクトリポジトリと宣言済みのプロダクトリポジトリ（`repos`）を
// 変更する場合の worktree を扱う。`repos` を持たない project では、ここの関数はどれも空の結果を
// 返し、既存の 1 リポジトリ・`<worktree_base>/<task-id>/` 直下の配置を変えない。

export { PROJECT_REPO_WORKTREE_DIRNAME };

/** A declared product repository resolved for exec (absolute root and setup defaults). */
export type ProductRepo = {
  name: string;
  repoRoot: string;
  integrationBranch?: string;
  /** Run npm ci for tracked package-lock.json files. Defaults to true (same as the project). */
  install: boolean;
  /** Run `specdojo build` when the repository has a SpecDojo config. Defaults to true. */
  build: boolean;
};

export function resolveProductRepos(
  rootDir: string,
  project: SpecDojoProjectConfig,
): ProductRepo[] {
  return getProjectRepos(project).map((repo) => ({
    name: repo.name,
    repoRoot: resolveRepoRoot(rootDir, repo),
    ...(repo.integration_branch?.trim()
      ? { integrationBranch: repo.integration_branch.trim() }
      : {}),
    install: repo.setup?.install ?? true,
    build: repo.setup?.build ?? true,
  }));
}

/** Product repositories of the project whose schedule path is `schedulePath` ([] when none). */
export function configuredProductRepos(schedulePath: string): ProductRepo[] {
  const { config } = loadConfig();
  if (!config) return [];
  const rootDir = specdojoRootDir();
  for (const project of Object.values(config.projects)) {
    if (resolve(rootDir, getProjectSchedulePath(project)) === resolve(schedulePath)) {
      return resolveProductRepos(rootDir, project);
    }
  }
  return [];
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
  return opts.products.map((product) => {
    if (!existsSync(product.repoRoot)) {
      throw new Error(
        `Product repository "${product.name}" does not exist: ${product.repoRoot} (check repos[].path)`,
      );
    }
    const generate = product.build ? (opts.generateArtifacts ?? generateWorktreeArtifacts) : skip;
    const existing = findExecWorktree(product.repoRoot, opts.taskId);
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
  };
}

/** Registered product worktrees of a task (repositories without one are omitted). */
export function findProductWorktrees(
  products: readonly ProductRepo[],
  taskId: string,
): ProductWorktree[] {
  return products.flatMap((product) => {
    if (!existsSync(product.repoRoot)) return [];
    const found = findExecWorktree(product.repoRoot, taskId);
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

function isMergedIntoTarget(product: ProductWorktree): boolean {
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
    if (!isMergedIntoTarget(product)) {
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
    if (params.dryRun) {
      process.stdout.write(
        `[dry-run] git -C ${product.repoRoot} worktree remove --force ${product.path}\n`,
      );
      if (params.deleteBranch) {
        process.stdout.write(`[dry-run] git -C ${product.repoRoot} branch -d ${product.branch}\n`);
      }
      continue;
    }
    if (existsSync(product.path)) {
      // Guards (clean + merged) already ran; leftovers are ignored/regenerable files.
      gitOutput(product.repoRoot, ["worktree", "remove", "--force", product.path]);
    } else {
      gitResult(product.repoRoot, ["worktree", "prune"]);
    }
    if (params.deleteBranch) {
      // `-d` compares with the main checkout's HEAD, which may differ from integration_branch.
      // Use `-D` only for a branch verified to be merged into its integration target; otherwise
      // keep Git's safe `-d` so unintegrated product work is never deleted.
      const flag = isMergedIntoTarget(product) ? "-D" : "-d";
      gitOutput(product.repoRoot, ["branch", flag, product.branch]);
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
  const discarded: string[] = [];
  for (const product of products) {
    if (!existsSync(product.repoRoot)) continue;
    const existing = findExecWorktree(product.repoRoot, taskId);
    if (!existing && !execBranchExists(product.repoRoot, taskId)) continue;
    if (existing) {
      if (resolve(product.repoRoot) === resolve(existing.path)) {
        throw new Error(
          `Refusing to discard the main checkout of ${product.name} as stale residue: ${existing.branch}`,
        );
      }
      gitOutput(product.repoRoot, ["worktree", "remove", "--force", existing.path]);
    }
    const branch = `exec/${worktreeNameFromTaskId(taskId)}`;
    if (execBranchExists(product.repoRoot, taskId)) {
      gitOutput(product.repoRoot, ["branch", "-D", branch]);
    }
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
    return gitOutput(product.repoRoot, [
      "for-each-ref",
      "--format=%(refname:short)",
      "refs/heads/exec/",
    ])
      .split(/\r?\n/)
      .map((branch) => branch.trim())
      .filter((branch) => branch.startsWith(prefix) && !checkedOut.has(branch))
      .sort()
      .map((branch) => ({
        repo: product.name,
        branch,
        mergedIntoTarget:
          gitResult(product.repoRoot, ["merge-base", "--is-ancestor", branch, target]).status === 0,
      }));
  });
}

/** Delete merged orphan exec branches of product repositories with Git's safe `-d`. */
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
      gitOutput(product.repoRoot, ["branch", "-d", item.branch]);
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
 * keeps the project worktree as cwd. Returns [] for providers without a launch flag (opencode
 * restricts external directories in the agent definition, which the runner cannot change).
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
