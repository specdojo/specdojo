import { existsSync, readFileSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import type { ExecEvidence } from "./exec-evidence.js";
import {
  PARENT_VALIDATION_PROJECT_REPO,
  failedParentValidationReason,
} from "./exec-parent-validation.js";
import type { TaskMode } from "./exec-types.js";
import {
  getProjectExecutionPath,
  resolveRepoRoot,
  specdojoRootDir,
  type SpecDojoConfig,
  type SpecDojoProjectConfig,
  type SpecDojoRepoConfig,
} from "./specdojo-config.js";
import {
  MAX_TEXT_LENGTH,
  parseReporterOutput,
  reporterOutputSchemaForMode,
  type ReporterOutput,
} from "./exec-reporter-output.js";

export {
  REPORTER_OUTPUT_SCHEMA,
  REVIEW_VERDICTS,
  parseReporterOutput,
  reporterOutputSchemaForMode,
} from "./exec-reporter-output.js";
export type {
  EditReporterOutput,
  ReporterOutput,
  ReviewReporterOutput,
  ReviewVerdict,
} from "./exec-reporter-output.js";

const REPORTER_FORMAT_ATTEMPTS = 3;

export type ReporterFacts = {
  outcome: "complete" | "blocked";
  changed_files: Array<{ path: string; status: string }>;
  block_reason: string;
};

/** Scripts and dependency names declared by one repository's package.json. */
export type PackageManifestFacts = {
  scripts: Readonly<Record<string, string>>;
  dependencies: ReadonlySet<string>;
};

export type ReporterFactOptions = {
  /** Review completion is decided by its verdict, not by optional executor checks left unrun. */
  mode?: TaskMode;
  packageScripts?: Readonly<Record<string, string>>;
  packageDependencies?: ReadonlySet<string>;
  /** Configuration used to decide whether a SpecDojo subcommand applies to its target project. */
  specdojoConfig?: SpecDojoConfig | null;
  /**
   * Project the run targets. A SpecDojo subcommand without `--project` is judged against this
   * project instead of `current_project`, and product repositories are looked up in it.
   */
  projectId?: string;
  /** package.json facts of the project's product repositories, keyed by repository name. */
  productPackageManifests?: Readonly<Record<string, PackageManifestFacts>>;
  /**
   * Repository-relative paths the executor changed, excluding runner-managed records. When set,
   * `catalog validate` applies only if a change reaches the project documents
   * (`docs/ja/projects/`), matching the validation table of the plan's common conventions.
   */
  changedPaths?: readonly string[];
};

export type ReporterEvidence = ExecEvidence & {
  /** Runner-derived facts supplied only to the reporter; they are not persisted in evidence.json. */
  runner_context?: {
    mechanically_not_applicable: Array<{ command: string; reason: string }>;
    runner_managed_attempt_changes: Array<{ path: string; status: string }>;
  };
  /**
   * Project the run targets, resolved by the runner. Not persisted in evidence.json; it lets
   * deriveReporterFacts judge validations against the same project as evidenceForReporter.
   */
  runner_scope?: { project_id: string };
};

export type ReporterEvidenceScope = {
  /** Root of the primary project repository. */
  repoRoot: string;
  /** Root used when evidence change paths were collected. */
  worktreePath: string;
  /** Resolved project execution path in the primary repository. */
  executionPath: string;
  /** Result path in the evidence worktree. */
  resultPath?: string;
  /** Resolved project register and derived-view paths in the primary repository. */
  registerPaths?: readonly string[];
  /** Project the run targets. Derived from `executionPath` and the configuration when omitted. */
  projectId?: string;
  /** Injectable repository facts used by tests and non-default runners. */
  factOptions?: ReporterFactOptions;
};

function isProjectConfig(value: unknown): value is SpecDojoProjectConfig {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Finds the single configured project whose execution directory is `executionPath`. Returns
 * undefined when no project or more than one project matches, so ambiguity never picks a project.
 */
function projectIdForExecutionPath(
  config: SpecDojoConfig | null,
  repoRoot: string,
  executionPath: string,
): string | undefined {
  if (!config) return undefined;
  const target = resolve(executionPath);
  const matches = Object.keys(config.projects)
    .sort()
    .filter((projectId) => {
      const project: unknown = config.projects[projectId];
      if (!isProjectConfig(project)) return false;
      return resolve(repoRoot, getProjectExecutionPath(project)) === target;
    });
  return matches.length === 1 ? matches[0] : undefined;
}

function repoRelativePath(root: string, path: string): string {
  return relative(root, path).split(sep).join("/").replace(/^\.\//u, "");
}

function pathIsWithin(path: string, root: string): boolean {
  return path === root || path.startsWith(`${root}/`);
}

function isRunnerManagedChangePath(path: string, scope: ReporterEvidenceScope): boolean {
  const normalized = path.replaceAll("\\", "/").replace(/^\.\//u, "");
  // exec/ 配下（evidence・plans・results・events・.locks など）はすべて runner の記録であり、
  // executor の成果物ではない。
  const execRoot = repoRelativePath(scope.repoRoot, join(scope.executionPath, "exec"));
  const managedRoots = [
    execRoot,
    ...(scope.registerPaths ?? []).map((path) => repoRelativePath(scope.repoRoot, path)),
  ];
  const resultPath = scope.resultPath
    ? repoRelativePath(scope.worktreePath, scope.resultPath)
    : undefined;
  return managedRoots.some((root) => pathIsWithin(normalized, root)) || normalized === resultPath;
}

function isRunnerManagedChange(
  change: ExecEvidence["changes"][number],
  scope: ReporterEvidenceScope,
): boolean {
  // A rename can contain two repository-relative paths. Exclude the entry only when every side
  // is runner-managed so a move between a managed location and a deliverable remains visible.
  return change.path.split(" -> ").every((path) => isRunnerManagedChangePath(path, scope));
}

/**
 * Builds the bounded evidence view used by the reporter and result renderer. Runner-owned
 * bookkeeping remains in the persisted evidence, but it is not presented as executor output.
 */
export function evidenceForReporter(
  evidence: ExecEvidence,
  scope: ReporterEvidenceScope,
): ReporterEvidence {
  const changes = evidence.changes.filter((change) => !isRunnerManagedChange(change, scope));
  const attemptChanges = evidence.attempt_changes?.filter(
    (change) => !isRunnerManagedChange(change, scope),
  );
  // `attempt_changes` excludes lifecycle changes that existed before the executor started. Its
  // removed entries therefore tell the reporter that the executor really touched runner-owned
  // bookkeeping, without putting those paths back into the authoritative deliverable list.
  const runnerManagedAttemptChanges = (evidence.attempt_changes ?? []).filter((change) =>
    isRunnerManagedChange(change, scope),
  );
  const factOptions = scope.factOptions ?? {};
  const config =
    factOptions.specdojoConfig === undefined ? defaultSpecdojoConfig() : factOptions.specdojoConfig;
  const projectId =
    scope.projectId ??
    factOptions.projectId ??
    projectIdForExecutionPath(config, scope.repoRoot, scope.executionPath);
  const scopedFactOptions: ReporterFactOptions = {
    ...factOptions,
    ...(projectId ? { projectId } : {}),
    changedPaths: changes.map((change) => change.path),
  };
  const mechanicallyNotApplicable = evidence.validations.flatMap((validation) => {
    if (validation.source === "runner" || validation.status !== "not_run") return [];
    const reason = mechanicallyNotApplicableReason(validation.command, scopedFactOptions);
    return reason === undefined ? [] : [{ command: validation.command, reason }];
  });
  const filtered =
    changes.length !== evidence.changes.length ||
    attemptChanges?.length !== evidence.attempt_changes?.length;
  const scoped: ReporterEvidence = projectId
    ? { ...evidence, runner_scope: { project_id: projectId } }
    : evidence;
  const selected: ReporterEvidence = filtered
    ? {
        ...scoped,
        changes,
        ...(attemptChanges ? { attempt_changes: attemptChanges } : {}),
        diff_summary: {
          files_changed: changes.length,
          summary: changes
            .map((change) => `${change.status} ${change.path}`)
            .join("\n")
            .slice(0, MAX_TEXT_LENGTH),
        },
      }
    : scoped;
  if (mechanicallyNotApplicable.length === 0 && runnerManagedAttemptChanges.length === 0) {
    return selected;
  }
  return {
    ...selected,
    runner_context: {
      mechanically_not_applicable: mechanicallyNotApplicable,
      runner_managed_attempt_changes: runnerManagedAttemptChanges,
    },
  };
}

/**
 * Derives result facts only from runner-owned evidence. Reporter prose is deliberately absent
 * from this decision so an LLM cannot change paths or turn a failed run into a completed one.
 */
export function deriveReporterFacts(
  evidence: ReporterEvidence,
  options: ReporterFactOptions = {},
): ReporterFacts {
  const changedFiles = evidence.changes.map(({ path, status }) => ({ path, status }));
  if (evidence.stage.status !== "succeeded" || evidence.stage.exit_code !== 0) {
    const blockReason =
      evidence.block_reason ||
      (evidence.stage.status === "rate_limited"
        ? "executor rate limit reached"
        : evidence.stage.exit_code === null
          ? "executor failed without an exit code"
          : evidence.stage.exit_code !== 0
            ? `executor exited with code ${evidence.stage.exit_code}`
            : "executor stage failed");
    return { outcome: "blocked", changed_files: changedFiles, block_reason: blockReason };
  }

  const validationFailure = failedParentValidationReason(evidence.validations);
  if (validationFailure) {
    return {
      outcome: "blocked",
      changed_files: changedFiles,
      block_reason: validationFailure,
    };
  }
  const packageScripts = options.packageScripts ?? defaultPackageScripts();
  const packageDependencies = options.packageDependencies ?? defaultPackageDependencies();
  const specdojoConfig =
    options.specdojoConfig === undefined ? defaultSpecdojoConfig() : options.specdojoConfig;
  const projectId = options.projectId ?? evidence.runner_scope?.project_id;
  const applicabilityOptions: ReporterFactOptions = {
    packageScripts,
    packageDependencies,
    specdojoConfig,
    ...(projectId ? { projectId } : {}),
    ...(options.productPackageManifests
      ? { productPackageManifests: options.productPackageManifests }
      : {}),
    changedPaths: options.changedPaths ?? evidence.changes.map((change) => change.path),
  };
  const passedCommandsByRepo = new Map<string, Set<string>>();
  const runnerPassedCommandsByRepo = new Map<string, Set<string>>();
  const addPassedCommand = (
    target: Map<string, Set<string>>,
    repo: string,
    command: string,
  ): void => {
    const commands = target.get(repo) ?? new Set<string>();
    commands.add(command);
    target.set(repo, commands);
  };
  // sandbox で実行できない検証を executor が not_run（親 runner へ委譲）と記録し、runner が
  // 同じリポジトリで同じコマンドを実行して通した場合は満たされたものとして扱う。executor の
  // failed は runner の結果で打ち消さない（PJR-2GZE）。
  for (const validation of evidence.validations) {
    if (validation.status !== "passed") continue;
    if (validation.source === "runner") {
      const repo = validation.repo ?? PARENT_VALIDATION_PROJECT_REPO;
      const command = normalizeValidationCommand(validation.command);
      addPassedCommand(runnerPassedCommandsByRepo, repo, command);
      addPassedCommand(passedCommandsByRepo, repo, command);
      continue;
    }
    const manifest = commandManifest(
      normalizeValidationCommand(validation.command),
      applicabilityOptions,
      specdojoConfig,
    );
    addPassedCommand(
      passedCommandsByRepo,
      manifest.repoName ?? PARENT_VALIDATION_PROJECT_REPO,
      manifest.command,
    );
  }
  // `npm run check` のような合成コマンドを executor が not_run（親 runner へ委譲）とした場合は、
  // 対象リポジトリの package.json の script を展開し、構成する各コマンドが同じリポジトリの
  // 親検証か executor 自身の検証で通っていれば満たされたものとして扱う（PJR-SDWF）。
  const isDelegatedValidationSatisfied = (command: string): boolean => {
    const manifest = commandManifest(
      normalizeValidationCommand(command),
      applicabilityOptions,
      specdojoConfig,
    );
    const repo = manifest.repoName ?? PARENT_VALIDATION_PROJECT_REPO;
    const runnerPassedCommands = runnerPassedCommandsByRepo.get(repo) ?? new Set<string>();
    if (runnerPassedCommands.has(manifest.command)) return true;
    const passedCommands = passedCommandsByRepo.get(repo) ?? new Set<string>();
    const components = compositeComponents(manifest.command, manifest.scripts);
    return (
      components !== undefined &&
      components.every((component) =>
        isComponentSatisfied(component, passedCommands, manifest.scripts),
      )
    );
  };
  // runner が担う検証（index build）の executor 側の not_run / not_applicable は満たしたものとする。
  // runner の再生成が失敗した場合は worktree の準備で run が止まり、runner の記録に失敗が残れば
  // 上の failedParentValidationReason で block するため、ここまで到達しない。
  const executorValidationFailures = evidence.validations.filter((validation) => {
    if (validation.source === "runner") return false;
    if (validation.status === "passed" || validation.status === "requires_human") return false;
    // review executor の任意確認は verdict の判断材料であり、未実施・適用外そのものを
    // pipeline の失敗にしない。実行して失敗した確認だけは mode にかかわらず block する。
    if (
      options.mode === "review" &&
      (validation.status === "not_run" || validation.status === "not_applicable")
    ) {
      return false;
    }
    if (
      (validation.status === "not_run" || validation.status === "not_applicable") &&
      runnerOwnedValidationReason(validation.command) !== undefined
    ) {
      return false;
    }
    if (validation.status === "not_applicable") {
      return !isValidNotApplicableValidation(
        validation.command,
        validation.reason,
        applicabilityOptions,
      );
    }
    return !(
      validation.status === "not_run" &&
      (isDelegatedValidationSatisfied(validation.command) ||
        mechanicallyNotApplicableReason(validation.command, applicabilityOptions) !== undefined)
    );
  });
  if (executorValidationFailures.length > 0) {
    return {
      outcome: "blocked",
      changed_files: changedFiles,
      block_reason: `executor validation failed or not run: ${executorValidationFailures
        .map((validation) => validation.command)
        .join(", ")}`,
    };
  }
  return { outcome: "complete", changed_files: changedFiles, block_reason: "" };
}

// `npm test` は単体テストと統合テストの全件ゲートであり、親 runner は同じ範囲を
// `npm run test:unit` と `npm run test:integration` に分けて実行する。
const COMMAND_EQUIVALENTS: Readonly<Record<string, readonly string[]>> = {
  "npm test": ["npm run test:unit", "npm run test:integration"],
};
const MAX_COMPOSITE_DEPTH = 5;

function normalizeValidationCommand(command: string): string {
  const collapsed = command.trim().replace(/\s+/g, " ");
  if (collapsed === "npm t" || collapsed === "npm run test") return "npm test";
  return collapsed.replace(/^npm run-script /, "npm run ");
}

function scriptNameOf(command: string): string | undefined {
  if (command === "npm test") return "test";
  return /^npm run ([A-Za-z0-9:_.-]+)$/.exec(command)?.[1];
}

// 適用条件の反証では npm が解決する script 名だけを取り出す。後続引数の有無は script の
// 存在を変えない。一方、委譲・合成コマンドの同一性判定は scriptNameOf の完全一致を保つ。
function invokedScriptNameOf(command: string): string | undefined {
  if (command === "npm test") return "test";
  return /^npm run ([A-Za-z0-9:_.-]+)(?:\s|$)/u.exec(command)?.[1];
}

function npxPackageNameOf(command: string): string | undefined {
  return /^npx\s+((?:@[A-Za-z0-9_.-]+\/)?[A-Za-z0-9_.-]+)(?:\s|$)/u.exec(command)?.[1];
}

type SpecdojoCommandApplicability =
  | { recognized: false }
  | { recognized: true; applicable: true }
  | { recognized: true; applicable: false; reason: string }
  | { recognized: true; applicable: undefined };

function specdojoCommandArgs(command: string): string | undefined {
  const normalized = normalizeValidationCommand(command);
  return (
    /^(?:npx\s+)?specdojo\s+(.+)$/u.exec(normalized)?.[1] ??
    /^(?:(?:node --import tsx|npx tsx|tsx)\s+(?:\.\/)?src\/specdojo\.ts|node\s+(?:\.\/)?dist\/specdojo\.js)\s+(.+)$/u.exec(
      normalized,
    )?.[1]
  );
}

/**
 * Returns why a validation is owned by the runner rather than the executor. `specdojo index build`
 * writes `.specdojo/doc-index.json`, which agents may not write; the runner regenerates the index
 * while preparing the worktree and before integration, so the executor cannot and need not run it.
 * Other SpecDojo subcommands return undefined and keep their usual `not_run` handling.
 */
export function runnerOwnedValidationReason(command: string): string | undefined {
  const args = specdojoCommandArgs(command);
  if (args === undefined || !/^index\s+build(?:\s|$)/u.test(args)) return undefined;
  return "index は runner が worktree の準備と統合の前に再生成する";
}

const PROJECT_DOCUMENTS_ROOT = "docs/ja/projects/";

function changesReachProjectDocuments(changedPaths: readonly string[]): boolean {
  return changedPaths
    .flatMap((path) => path.split(" -> "))
    .some((path) =>
      path.replaceAll("\\", "/").replace(/^\.\//u, "").startsWith(PROJECT_DOCUMENTS_ROOT),
    );
}

function projectOptionOf(args: string): string | undefined {
  return /(?:^|\s)--project(?:=|\s+)([A-Za-z0-9_-]+)(?=\s|$)/u.exec(args)?.[1];
}

function specdojoCommandApplicability(
  command: string,
  config: SpecDojoConfig | null,
  runProjectId: string | undefined,
  changedPaths?: readonly string[],
): SpecdojoCommandApplicability {
  const args = specdojoCommandArgs(command);
  if (args === undefined) return { recognized: false };
  if (!/^catalog\s+validate(?:\s|$)/u.test(args)) {
    return { recognized: true, applicable: undefined };
  }

  const configuredProjectId = config?.current_project;
  // 明示の --project を優先し、次に run の対象 project を使う。current_project は run の対象を
  // 特定できない場合の最後の手段にとどめる（別 project の catalog_path で判定しないため）。
  const projectId =
    projectOptionOf(args) ??
    runProjectId ??
    (typeof configuredProjectId === "string" ? configuredProjectId : undefined);
  const project = projectId ? config?.projects[projectId] : undefined;
  if (!project || typeof project !== "object" || Array.isArray(project)) {
    return { recognized: true, applicable: undefined };
  }
  if (typeof project.catalog_path === "string" && project.catalog_path.trim()) {
    // plan の共通規約は catalog validate を docs/ja/projects/ 配下の変更に限って求める。
    if (changedPaths !== undefined && !changesReachProjectDocuments(changedPaths)) {
      return {
        recognized: true,
        applicable: false,
        reason: `変更が ${PROJECT_DOCUMENTS_ROOT} 配下に及ばない`,
      };
    }
    return { recognized: true, applicable: true };
  }
  if (project.catalog_path !== undefined) {
    return { recognized: true, applicable: undefined };
  }
  return {
    recognized: true,
    applicable: false,
    reason: `project '${projectId}' に catalog_path が設定されていない`,
  };
}

/**
 * Returns the runner-owned reason when a command is mechanically known not to apply. Unknown
 * applicability deliberately returns undefined so an ordinary `not_run` continues to block.
 */
export function mechanicallyNotApplicableReason(
  command: string,
  options: ReporterFactOptions = {},
): string | undefined {
  const normalized = normalizeValidationCommand(command);
  const config =
    options.specdojoConfig === undefined ? defaultSpecdojoConfig() : options.specdojoConfig;
  const specdojo = specdojoCommandApplicability(
    normalized,
    config,
    options.projectId,
    options.changedPaths,
  );
  if (specdojo.recognized) {
    return specdojo.applicable === false ? specdojo.reason : undefined;
  }

  const manifest = commandManifest(normalized, options, config);
  const packageJson =
    manifest.repoName === undefined ? "package.json" : `${manifest.repoName} の package.json`;
  const scriptName = invokedScriptNameOf(manifest.command);
  if (scriptName !== undefined && manifest.scripts[scriptName] === undefined) {
    return `${packageJson} に npm script '${scriptName}' がない`;
  }
  const packageName = npxPackageNameOf(manifest.command);
  if (packageName !== undefined && !manifest.dependencies.has(packageName)) {
    return `${packageJson} の dependencies / devDependencies に '${packageName}' がない`;
  }
  return undefined;
}

function isValidNotApplicableValidation(
  command: string,
  reason: string | undefined,
  options: ReporterFactOptions,
): boolean {
  if (!reason?.trim()) return false;
  const normalized = normalizeValidationCommand(command);
  const config =
    options.specdojoConfig === undefined ? defaultSpecdojoConfig() : options.specdojoConfig;
  const specdojo = specdojoCommandApplicability(
    normalized,
    config,
    options.projectId,
    options.changedPaths,
  );
  if (specdojo.recognized) return specdojo.applicable !== true;
  const manifest = commandManifest(normalized, options, config);
  const scriptName = invokedScriptNameOf(manifest.command);
  if (scriptName !== undefined && manifest.scripts[scriptName] !== undefined) return false;
  const packageName = npxPackageNameOf(manifest.command);
  return packageName === undefined || !manifest.dependencies.has(packageName);
}

type CommandManifest = PackageManifestFacts & {
  /** Command with any product-repository `--prefix` option removed. */
  command: string;
  /** Product repository the command targets; undefined for the project repository. */
  repoName?: string;
};

const PREFIX_OPTION_PATTERN = /(?:^|\s)--prefix(?:=|\s+)(\S+)(?=\s|$)/u;

function normalizeRepoPathText(path: string): string {
  return path.replaceAll("\\", "/").replace(/^\.\//u, "").replace(/\/+$/u, "");
}

function declaredRepos(
  config: SpecDojoConfig | null,
  projectId: string | undefined,
): SpecDojoRepoConfig[] {
  const targetProjectId = projectId ?? config?.current_project;
  const project: unknown = targetProjectId ? config?.projects[targetProjectId] : undefined;
  if (!isProjectConfig(project) || !Array.isArray(project.repos)) return [];
  // 設定ファイル由来の値なので、型の宣言に頼らず name と path が文字列の要素だけを使う。
  return project.repos.filter(
    (repo: unknown): repo is SpecDojoRepoConfig =>
      typeof repo === "object" &&
      repo !== null &&
      typeof (repo as { name?: unknown }).name === "string" &&
      typeof (repo as { path?: unknown }).path === "string",
  );
}

/**
 * Identifies a command that targets a declared product repository, either through
 * `--prefix <repo>` (the repository name or its configured path) or a `<repo>:<path>` argument.
 */
function productRepoCommand(
  command: string,
  repos: readonly SpecDojoRepoConfig[],
): { repo: SpecDojoRepoConfig; command: string } | undefined {
  const prefix = PREFIX_OPTION_PATTERN.exec(command)?.[1];
  if (prefix !== undefined) {
    const value = normalizeRepoPathText(prefix);
    const repo = repos.find(
      (candidate) => candidate.name === value || normalizeRepoPathText(candidate.path) === value,
    );
    if (!repo) return undefined;
    return {
      repo,
      command: normalizeValidationCommand(command.replace(PREFIX_OPTION_PATTERN, " ")),
    };
  }
  const tokens = command.split(" ");
  const repo = repos.find((candidate) =>
    tokens.some((token) => token.startsWith(`${candidate.name}:`)),
  );
  return repo ? { repo, command } : undefined;
}

const productManifestCache = new Map<string, PackageManifestFacts>();

function productPackageManifest(
  repo: SpecDojoRepoConfig,
  options: ReporterFactOptions,
): PackageManifestFacts {
  const injected = options.productPackageManifests?.[repo.name];
  if (injected) return injected;
  const packageJsonPath = join(resolveRepoRoot(specdojoRootDir(), repo), "package.json");
  const cached = productManifestCache.get(packageJsonPath);
  if (cached) return cached;
  const manifest = readPackageManifest(packageJsonPath);
  productManifestCache.set(packageJsonPath, manifest);
  return manifest;
}

/**
 * Selects the package.json that decides a command's applicability: the product repository's
 * when the command targets one declared by the run's project, otherwise the project repository's.
 */
function commandManifest(
  command: string,
  options: ReporterFactOptions,
  config: SpecDojoConfig | null,
): CommandManifest {
  const product = productRepoCommand(command, declaredRepos(config, options.projectId));
  if (product) {
    return {
      ...productPackageManifest(product.repo, options),
      command: product.command,
      repoName: product.repo.name,
    };
  }
  return {
    scripts: options.packageScripts ?? defaultPackageScripts(),
    dependencies: options.packageDependencies ?? defaultPackageDependencies(),
    command,
  };
}

// package.json の script が npm script の呼び出しを `&&` でつないだだけの合成なら、直下の構成
// コマンドを返す。それ以外（任意のシェル、引数付きなど）は合成として扱わない。
function compositeComponents(
  command: string,
  scripts: Readonly<Record<string, string>>,
): string[] | undefined {
  const name = scriptNameOf(command);
  const body = name === undefined ? undefined : scripts[name];
  if (body === undefined) return undefined;
  const parts = body.split("&&").map((part) => normalizeValidationCommand(part));
  if (parts.length < 2 || parts.some((part) => scriptNameOf(part) === undefined)) return undefined;
  return parts;
}

// executor は `npm run <name>` の代わりに script の中身（例: `node --import tsx src/specdojo.ts
// catalog validate`）を直接実行して記録することがある。tsx の起動の書き方の違いだけをそろえて比べる。
// 対象のプロジェクトを指定する `--project <id>` は検証の範囲を変えないため、比較では取り除く。
function normalizeScriptBody(command: string): string {
  return normalizeValidationCommand(command)
    .replace(/^(?:node --import tsx|npx tsx) /, "tsx ")
    .replace(/ --project(?:=| )[A-Za-z0-9_-]+(?= |$)/g, "");
}

// 構成コマンドは、それ自体が通っていれば満たす。通っていなければ、同等のコマンドの組、script の
// 中身の直接実行、さらに合成ならその構成コマンドの順に確かめる（runner が合成の script を丸ごと
// 実行して通した場合に、中身を分解して探さないため）。
function isComponentSatisfied(
  command: string,
  passed: ReadonlySet<string>,
  scripts: Readonly<Record<string, string>>,
  depth = 0,
): boolean {
  if (passed.has(command)) return true;
  if (depth < MAX_COMPOSITE_DEPTH) {
    const components = compositeComponents(command, scripts);
    if (
      components?.every((component) => isComponentSatisfied(component, passed, scripts, depth + 1))
    ) {
      return true;
    }
  }
  const equivalents = COMMAND_EQUIVALENTS[command];
  if (equivalents !== undefined && equivalents.every((equivalent) => passed.has(equivalent))) {
    return true;
  }
  const name = scriptNameOf(command);
  const body = name === undefined ? undefined : scripts[name];
  if (body === undefined) return false;
  const normalizedBody = normalizeScriptBody(body);
  return [...passed].some((candidate) => normalizeScriptBody(candidate) === normalizedBody);
}

let cachedPackageManifest:
  | {
      scripts: Readonly<Record<string, string>>;
      dependencies: ReadonlySet<string>;
    }
  | undefined;
let cachedSpecdojoConfig: SpecDojoConfig | null | undefined;

function defaultPackageManifest(): {
  scripts: Readonly<Record<string, string>>;
  dependencies: ReadonlySet<string>;
} {
  if (cachedPackageManifest) return cachedPackageManifest;
  cachedPackageManifest = readPackageManifest(join(specdojoRootDir(), "package.json"));
  return cachedPackageManifest;
}

function defaultPackageScripts(): Readonly<Record<string, string>> {
  return defaultPackageManifest().scripts;
}

function defaultPackageDependencies(): ReadonlySet<string> {
  return defaultPackageManifest().dependencies;
}

function defaultSpecdojoConfig(): SpecDojoConfig | null {
  if (cachedSpecdojoConfig !== undefined) return cachedSpecdojoConfig;
  const configPath = join(specdojoRootDir(), ".specdojo", "specdojo.config.json");
  if (!existsSync(configPath)) {
    cachedSpecdojoConfig = null;
    return cachedSpecdojoConfig;
  }
  try {
    const parsed = JSON.parse(readFileSync(configPath, "utf8")) as Partial<SpecDojoConfig>;
    cachedSpecdojoConfig =
      parsed.version === 1 &&
      typeof parsed.projects === "object" &&
      parsed.projects !== null &&
      !Array.isArray(parsed.projects)
        ? (parsed as SpecDojoConfig)
        : null;
  } catch {
    cachedSpecdojoConfig = null;
  }
  return cachedSpecdojoConfig;
}

export function readPackageScripts(packageJsonPath: string): Readonly<Record<string, string>> {
  return readPackageManifest(packageJsonPath).scripts;
}

function readPackageManifest(packageJsonPath: string): {
  scripts: Readonly<Record<string, string>>;
  dependencies: ReadonlySet<string>;
} {
  const empty = { scripts: {}, dependencies: new Set<string>() };
  if (!existsSync(packageJsonPath)) return empty;
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  } catch (error) {
    process.stderr.write(
      `warning: cannot read package scripts from ${packageJsonPath}: ${String(error)}\n`,
    );
    return empty;
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return empty;
  const manifest = parsed as {
    scripts?: unknown;
    dependencies?: unknown;
    devDependencies?: unknown;
  };
  const scripts =
    typeof manifest.scripts === "object" &&
    manifest.scripts !== null &&
    !Array.isArray(manifest.scripts)
      ? Object.fromEntries(
          Object.entries(manifest.scripts).filter(
            (entry): entry is [string, string] => typeof entry[1] === "string",
          ),
        )
      : {};
  const dependencyEntries = [manifest.dependencies, manifest.devDependencies].flatMap((section) =>
    typeof section === "object" && section !== null && !Array.isArray(section)
      ? Object.entries(section).filter(
          (entry): entry is [string, string] => typeof entry[1] === "string",
        )
      : [],
  );
  return { scripts, dependencies: new Set(dependencyEntries.map(([name]) => name)) };
}

export function buildReporterPrompt(opts: {
  plan: string;
  evidence: ReporterEvidence;
  mode: TaskMode;
  validationError?: string;
}): string {
  const correction = opts.validationError
    ? `\nThe previous response failed validation: ${opts.validationError}\nReturn a corrected JSON value.\n`
    : "";
  const reviewGuidance =
    opts.mode === "review"
      ? `\n\nFor review mode, the executor did not re-grade the deliverable; it judged task completion
from the stored grade result. Record that judgement in verdict and put unmet items and improvement
instructions in improvements. If evidence.final_message identifies "確認できなかった範囲",
record that scope in rationale or improvements and reflect it in the verdict.`
      : "";
  return `You are the reporter stage of a SpecDojo executor/reporter pipeline.
Use only the supplied plan and bounded executor evidence. Do not edit or inspect files. Do not
invent facts that are absent from evidence. Return exactly one JSON object matching the supplied
JSON Schema, without Markdown fences or commentary. The runner owns frontmatter, outcome,
block_reason, the authoritative changed-file list, and Markdown rendering. It derives those facts
mechanically from evidence; your response supplies prose associated with evidence paths.

The runner renders your free-text JSON fields as Markdown. Wrap every identifier or field name
containing an underscore in inline code (for example, \`depends_on\`) so Markdown parsers do not
misread it as emphasis.

The plan below was written as generic instructions for a single agent that both edits the
deliverable and records its own result. In this pipeline, those two responsibilities are split:
the executor already completed the deliverable edit and intentionally left the result file
untouched because the runner writes it from your prose and machine facts. For edit mode, identify
each changed_files summary with the exact path from its evidence.changes entry. The runner matches
descriptions by path: order does not matter, missing descriptions use a default message, and paths
absent from evidence are discarded. Do not include statuses. An empty changes list requires an
empty changed_files list. Validation entries with source="runner" were executed by the parent
process and remain authoritative machine facts. Do not turn them into outcome or block_reason
fields. When runner_context is present, it contains additional authoritative facts: do not ask for
a command in mechanically_not_applicable to be run, because the runner already determined that it
does not apply and will preserve that handoff itself. Paths in runner_managed_attempt_changes were
materially changed during the executor attempt but are intentionally absent from changed_files;
do not request confirmation solely because the executor mentions one of those changes while the
path is absent from changed_files.${reviewGuidance}${correction}
<specdojo_plan>
${opts.plan.trimEnd()}
</specdojo_plan>

<specdojo_executor_evidence>
${JSON.stringify(opts.evidence, null, 2)}
</specdojo_executor_evidence>

<specdojo_reporter_output_schema mode="${opts.mode}">
${JSON.stringify(reporterOutputSchemaForMode(opts.mode), null, 2)}
</specdojo_reporter_output_schema>
`;
}

export type ReporterInvocation = (prompt: string) => Promise<{
  result: "success" | "failure" | "rate_limit";
  stdout: string;
  stderr: string;
}>;

export type ReporterInvocationOutput = {
  stdout: string;
  stderr: string;
};

export async function runReporterWithFormatRetry(opts: {
  plan: string;
  evidence: ExecEvidence;
  mode: TaskMode;
  invoke: ReporterInvocation;
  maxFormatAttempts?: number;
}): Promise<
  | { result: "success"; output: ReporterOutput; formatAttempts: number }
  | {
      result: "failure" | "rate_limit";
      reason: string;
      formatAttempts: number;
      invocationOutputs: ReporterInvocationOutput[];
    }
> {
  const maxAttempts = opts.maxFormatAttempts ?? REPORTER_FORMAT_ATTEMPTS;
  let validationError: string | undefined;
  const invocationOutputs: ReporterInvocationOutput[] = [];
  for (let formatAttempts = 1; formatAttempts <= maxAttempts; formatAttempts++) {
    const attempt = await opts.invoke(
      buildReporterPrompt({
        plan: opts.plan,
        evidence: opts.evidence,
        mode: opts.mode,
        ...(validationError ? { validationError } : {}),
      }),
    );
    invocationOutputs.push({ stdout: attempt.stdout, stderr: attempt.stderr });
    if (attempt.result !== "success") {
      return {
        result: attempt.result,
        reason: attempt.stderr.trim() || `reporter exited with ${attempt.result}`,
        formatAttempts,
        invocationOutputs,
      };
    }
    const parsed = parseReporterOutput(attempt.stdout, opts.mode);
    if (parsed.output) return { result: "success", output: parsed.output, formatAttempts };
    validationError = parsed.error ?? "unknown schema validation error";
  }
  return {
    result: "failure",
    reason: `reporter output invalid after ${maxAttempts} format attempts: ${validationError ?? "unknown validation error"}`,
    formatAttempts: maxAttempts,
    invocationOutputs,
  };
}
