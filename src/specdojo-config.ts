import { type Command } from "commander";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, posix, resolve } from "node:path";
import dotenv from "dotenv";
import yaml from "js-yaml";
import type { AgentStageRole, SchedulerStrategy, TaskMode } from "./exec-types.js";
import { runProviderScaffold, specdojoPackageRootDir } from "./exec-provider-scaffold.js";
import {
  ensureGitignore,
  formatGitignoreReport,
  gitignorePatternsForLayouts,
  type ProjectGitignoreLayout,
} from "./specdojo-gitignore.js";

export type SpecDojoRunConfig = {
  exec_defaults?: string;
  /** @deprecated Use exec_defaults. */
  agent_config?: string;
  worktree_base?: string;
  /**
   * IANA time zone name used to compute the pjr-index registration date (登録日) and completion
   * date (完了日) defaults. The date is derived with Intl.DateTimeFormat's timeZone option so it
   * never depends on the host/container TZ environment variable. Defaults to `UTC`.
   */
  register_date_timezone?: string;
};

/** Default IANA time zone for register date derivation when run.register_date_timezone is unset. */
export const DEFAULT_REGISTER_DATE_TIMEZONE = "UTC";

export const SPECDOJO_CONFIG_REFERENCE_URL =
  "https://specdojo.github.io/specdojo/ja/specdojo/references/specdojo-config-reference.html";

export type SpecDojoProjectConfig = {
  /**
   * Optional repo-root-relative prefix shared by every project document path below
   * (catalog/schedule/execution/members/reviews/roles/viewpoints/project_register/routines/jobs). When set, those
   * fields are interpreted relative to `base_path`. `run.*` paths are NOT affected and stay
   * repo-root relative. Resolve project paths via the getProject*Path accessors so base_path is
   * applied consistently.
   */
  base_path?: string;
  catalog_path?: string;
  schedule_path?: string;
  execution_path?: string;
  timeline_path?: string;
  members_path?: string;
  roles_path?: string;
  viewpoints_path?: string;
  project_register_path?: string;
  routines_path?: string;
  jobs_path?: string;
  /**
   * Project-level document ids supplied to deliverable edit/review plans independently from
   * catalog depends_on. Omit to use the default prj-overview context; set [] to opt out.
   */
  project_context?: string[];
  /**
   * Product repositories that tasks of this project may change in addition to the project
   * repository itself. The project repository is implicit and never declared here. Omit (or set
   * []) to keep the single-repository behavior.
   */
  repos?: SpecDojoRepoConfig[];
  run?: SpecDojoRunConfig;
};

/** Whether exec prepares a worktree of the repository with dependency install and/or build. */
export type SpecDojoRepoSetup = {
  install?: boolean;
  build?: boolean;
};

export type SpecDojoRepoConfig = {
  /** Prefix used in targets/paths (`<name>:<path>`). Must match REPO_NAME_PATTERN. */
  name: string;
  /** Repository root, relative to the SpecDojo root. */
  path: string;
  /** Branch exec integrates into. Omit to use the repository's current branch. */
  integration_branch?: string;
  setup?: SpecDojoRepoSetup;
};

export const REPO_NAME_PATTERN = /^[a-z0-9-]+$/;

export const DEFAULT_PROJECT_CONTEXT = ["prj-overview"] as const;

// Agent runtime provider family. Selects which providers.<name> override in
// exec-defaults.yaml applies to a member's failure handling.
export type AgentProvider = "opencode" | "claude" | "codex" | "copilot" | "antigravity" | "custom";

// Member launch profiles include the task-facing executor modes plus the reporter-only
// profile. `report` never becomes a TaskMode: reporter eligibility is resolved by stage_role.
export type AgentMode = TaskMode | "report";

export type ProjectMember = {
  nickname: string;
  display_name: string;
  email: string | null;
  roles: string[];
  type: "human" | "agent";
  provider?: AgentProvider; // agent only: runtime CLI that executes the command
  persona?: string;
  focus?: string[];
  capabilities?: string[]; // agent only: tool access (e.g. web_search)
  proficiency?: "low" | "normal" | "high" | "expert"; // agent only: quality tier
  priority?: number; // agent only: tiebreaker within same profile (lower = tried first)
  command?: string; // agent only: shell command executed by exec run
  mode?: AgentMode; // agent only: launch profile; report is reserved for stage_role: reporter
  stage_role?: AgentStageRole; // agent only: pipeline stage; omit for legacy flow
  disabled?: boolean; // agent only: when true, excluded from exec run --auto candidate selection
  scheduler_strategy?: SchedulerStrategy;
  note?: string;
};

export type MemberRoster = {
  version: number;
  project_id: string;
  members: ProjectMember[];
};

export type SpecDojoConfig = {
  version: 1;
  current_project?: string;
  projects: Record<string, SpecDojoProjectConfig>;
};

export type ConfigLoadResult = {
  configPath: string;
  config: SpecDojoConfig | null;
};

function findUpward(startDir: string, name: string): string | null {
  let currentDir = resolve(startDir);

  while (true) {
    const candidate = resolve(currentDir, name);
    if (existsSync(candidate)) return candidate;

    const parentDir = resolve(currentDir, "..");
    if (parentDir === currentDir) return null;
    currentDir = parentDir;
  }
}

export function specdojoRootDir(): string {
  const configPath = findUpward(process.cwd(), join(".specdojo", "specdojo.config.json"));
  if (configPath) return dirname(dirname(configPath));

  const gitMarker = findUpward(process.cwd(), ".git");
  if (gitMarker) return dirname(gitMarker);

  return process.cwd();
}

export function loadEnv(): void {
  // Load .env from the repository root if present.
  // Safe if missing.
  dotenv.config({ path: resolve(specdojoRootDir(), ".env"), quiet: true });
}

export function defaultConfigPath(): string {
  return join(specdojoRootDir(), ".specdojo", "specdojo.config.json");
}

// Join a project document path with the project's base_path, returning a repo-root-relative path.
// An empty/undefined base_path leaves the path unchanged (full backward compatibility).
function withBasePath(project: SpecDojoProjectConfig, relPath: string): string {
  const base = project.base_path?.trim();
  const rel = relPath.trim();
  return base ? join(base, rel) : rel;
}

function withOptionalBasePath(
  project: SpecDojoProjectConfig,
  relPath: string | undefined,
): string | undefined {
  if (!relPath || !relPath.trim()) return undefined;
  return withBasePath(project, relPath);
}

// schedule と execution は project 直下の固定ディレクトリに置く。設定を省いても既定値へ
// 解決することで、登録簿だけを使う構成でも path 設定を書かずに始められる。戻り値は
// string のままなので、呼び出し側の扱いは変わらない。
export function getProjectSchedulePath(project: SpecDojoProjectConfig): string {
  return withBasePath(project, project.schedule_path?.trim() || "schedule");
}

export function getProjectExecutionPath(project: SpecDojoProjectConfig): string {
  return withBasePath(project, project.execution_path?.trim() || "execution");
}

// Timeline lives in a fixed cross-cutting directory under the project root, so an
// unset timeline_path falls back to "timeline" instead of disabling the command.
export function getProjectTimelinePath(project: SpecDojoProjectConfig): string {
  return withBasePath(project, project.timeline_path?.trim() || "timeline");
}

export function getProjectMembersPath(project: SpecDojoProjectConfig): string | undefined {
  return withOptionalBasePath(project, project.members_path);
}

export function getProjectCatalogPath(project: SpecDojoProjectConfig): string | undefined {
  return withOptionalBasePath(project, project.catalog_path);
}

export function getProjectRolesPath(project: SpecDojoProjectConfig): string | undefined {
  return withOptionalBasePath(project, project.roles_path);
}

export function getProjectViewpointsPath(project: SpecDojoProjectConfig): string | undefined {
  return withOptionalBasePath(project, project.viewpoints_path);
}

export function getProjectRegisterPath(project: SpecDojoProjectConfig): string | undefined {
  return withOptionalBasePath(project, project.project_register_path);
}

export function getProjectRoutinesPath(project: SpecDojoProjectConfig): string | undefined {
  return withOptionalBasePath(project, project.routines_path);
}

export function getProjectJobsPath(project: SpecDojoProjectConfig): string | undefined {
  return withOptionalBasePath(project, project.jobs_path);
}

export function getProjectContext(project: SpecDojoProjectConfig): string[] {
  return project.project_context === undefined
    ? [...DEFAULT_PROJECT_CONTEXT]
    : [...project.project_context];
}

export function getProjectRepos(project: SpecDojoProjectConfig): SpecDojoRepoConfig[] {
  return project.repos ? project.repos.map((repo) => ({ ...repo })) : [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const REPO_KEYS = new Set(["name", "path", "integration_branch", "setup"]);
const REPO_SETUP_KEYS = new Set(["install", "build"]);

/**
 * Validate `projects.<projectId>.repos`. Returns one message per problem (empty when valid) so
 * loadConfig can report every misconfigured repository at once. `path` is resolved from
 * `rootDir` (the SpecDojo root) and must exist.
 */
export function validateProjectRepos(
  projectId: string,
  project: SpecDojoProjectConfig,
  projectIds: readonly string[],
  rootDir: string,
): string[] {
  const repos: unknown = project.repos;
  if (repos === undefined) return [];
  const where = `projects.${projectId}.repos`;
  if (!Array.isArray(repos)) return [`${where} must be an array`];

  const errors: string[] = [];
  const seen = new Map<string, number>();
  repos.forEach((repo: unknown, index) => {
    const at = `${where}[${index}]`;
    if (!isRecord(repo)) {
      errors.push(`${at} must be an object with name and path`);
      return;
    }
    for (const key of Object.keys(repo).sort()) {
      if (!REPO_KEYS.has(key)) errors.push(`${at}: unknown key "${key}"`);
    }

    const name = repo.name;
    if (typeof name !== "string" || !REPO_NAME_PATTERN.test(name)) {
      errors.push(
        `${at}.name must match ${String(REPO_NAME_PATTERN)} (got ${JSON.stringify(name)})`,
      );
    } else {
      const firstIndex = seen.get(name);
      if (firstIndex !== undefined) {
        errors.push(`${at}.name "${name}" duplicates ${where}[${firstIndex}].name`);
      } else {
        seen.set(name, index);
      }
      if (projectIds.includes(name)) {
        errors.push(
          `${at}.name "${name}" collides with project id "${name}"; ` +
            `"${name}:<...>" in targets would be ambiguous between a repository path and a doc id`,
        );
      }
    }

    const path = repo.path;
    if (typeof path !== "string" || path.trim().length === 0) {
      errors.push(`${at}.path must be a non-empty string`);
    } else if (isAbsolute(path)) {
      errors.push(`${at}.path must be relative to the SpecDojo root (got absolute "${path}")`);
    } else {
      const absolutePath = resolve(rootDir, path);
      if (!existsSync(absolutePath)) {
        errors.push(`${at}.path "${path}" does not exist (resolved to ${absolutePath})`);
      } else if (!statSync(absolutePath).isDirectory()) {
        errors.push(`${at}.path "${path}" is not a directory (resolved to ${absolutePath})`);
      }
    }

    if (
      repo.integration_branch !== undefined &&
      !isOmittedOrNonEmptyString(repo.integration_branch)
    ) {
      errors.push(`${at}.integration_branch must be a non-empty string when present`);
    }

    const setup = repo.setup;
    if (setup !== undefined) {
      if (!isRecord(setup)) {
        errors.push(`${at}.setup must be an object ({ install?: boolean, build?: boolean })`);
      } else {
        for (const [key, value] of Object.entries(setup).sort(([a], [b]) => a.localeCompare(b))) {
          if (!REPO_SETUP_KEYS.has(key)) errors.push(`${at}.setup: unknown key "${key}"`);
          else if (typeof value !== "boolean") errors.push(`${at}.setup.${key} must be a boolean`);
        }
      }
    }
  });
  return errors;
}

/**
 * A `targets` / `paths` value split by repository. `repo` means the value had the
 * `<repo>:<path>` form with a declared repository name; `project` means the value is unchanged
 * (a doc id for targets, a project-repository path for paths).
 */
export type RepoQualifiedRef =
  { kind: "repo"; repo: string; path: string } | { kind: "project"; value: string };

/**
 * Resolve a `targets` / `paths` value. The value is a repository path only when the prefix
 * before the first `:` is a declared repository name; any other value (including doc ids such as
 * `prj-0001:foo` and un-prefixed values) is returned unchanged as `project`.
 */
export function resolveRepoQualifiedRef(
  value: string,
  repos: readonly Pick<SpecDojoRepoConfig, "name">[],
): RepoQualifiedRef {
  const trimmed = value.trim();
  const separator = trimmed.indexOf(":");
  if (separator <= 0) return { kind: "project", value: trimmed };

  const prefix = trimmed.slice(0, separator);
  if (!repos.some((repo) => repo.name === prefix)) return { kind: "project", value: trimmed };

  const rawPath = trimmed.slice(separator + 1).replaceAll("\\", "/");
  if (rawPath.trim().length === 0) {
    throw new Error(`Invalid repository path "${value}": the path after "${prefix}:" is empty`);
  }
  if (posix.isAbsolute(rawPath) || /^[A-Za-z]:\//.test(rawPath)) {
    throw new Error(
      `Invalid repository path "${value}": the path must be relative to repository "${prefix}"`,
    );
  }
  const normalized = posix.normalize(rawPath).replace(/\/+$/, "");
  if (normalized === ".." || normalized.startsWith("../")) {
    throw new Error(`Invalid repository path "${value}": the path escapes repository "${prefix}"`);
  }
  return { kind: "repo", repo: prefix, path: normalized === "" ? "." : normalized };
}

/**
 * Resolve a `<repo>:<path>` value to an absolute path under the declared repository. Returns
 * null for values that are not repository-qualified so callers keep their current handling.
 */
export function resolveRepoQualifiedPath(
  rootDir: string,
  project: SpecDojoProjectConfig,
  value: string,
): { repo: string; path: string; absolutePath: string } | null {
  const repos = getProjectRepos(project);
  const ref = resolveRepoQualifiedRef(value, repos);
  if (ref.kind !== "repo") return null;
  const repo = repos.find((candidate) => candidate.name === ref.repo);
  if (!repo) return null;
  return {
    repo: ref.repo,
    path: ref.path,
    absolutePath: resolve(rootDir, repo.path, ref.path),
  };
}

export function loadMemberRoster(
  baseDir: string,
  project: SpecDojoProjectConfig,
): MemberRoster | null {
  const membersPath = getProjectMembersPath(project);
  if (!membersPath) return null;

  const fullPath = resolve(baseDir, membersPath);
  if (!existsSync(fullPath)) {
    throw new Error(`members_path not found: ${fullPath}`);
  }

  const raw = readFileSync(fullPath, "utf8");
  const parsed = yaml.load(raw) as MemberRoster;
  if (!parsed || !Array.isArray(parsed.members)) {
    throw new Error(`Invalid members file: ${fullPath} (expected { members: [...] })`);
  }

  return parsed;
}

export function assertValidActor(actor: string, roster: MemberRoster | null): void {
  if (!roster) return;
  const known = roster.members.map((m) => m.nickname);
  if (!known.includes(actor)) {
    throw new Error(
      `Unknown actor: "${actor}". Must be one of: ${known.join(", ")}\n` +
        `Register the nickname in members_path file before use.`,
    );
  }
}

function isOmittedOrNonEmptyString(value: unknown): boolean {
  if (value === undefined) return true;
  return typeof value === "string" && value.trim().length > 0;
}

function isValidProjectConfig(project: unknown): project is SpecDojoProjectConfig {
  if (!project || typeof project !== "object" || Array.isArray(project)) return false;

  const candidate = project as {
    schedule_path?: unknown;
    execution_path?: unknown;
    project_context?: unknown;
  };
  // 省略は既定値へ解決するため許容する。ただし指定したうえでの空文字は、設定漏れと
  // 意図的な省略を区別できないため引き続き不正として扱う。
  if (!isOmittedOrNonEmptyString(candidate.schedule_path)) return false;
  if (!isOmittedOrNonEmptyString(candidate.execution_path)) return false;
  if (
    candidate.project_context !== undefined &&
    (!Array.isArray(candidate.project_context) ||
      !candidate.project_context.every((ref) => typeof ref === "string" && ref.trim().length > 0))
  ) {
    return false;
  }
  return true;
}

export function loadConfig(): ConfigLoadResult {
  loadEnv();

  const configPath = defaultConfigPath();
  if (!existsSync(configPath)) {
    return { configPath, config: null };
  }

  const raw = readFileSync(configPath, "utf8");
  const parsed = JSON.parse(raw) as SpecDojoConfig;

  if (!parsed || parsed.version !== 1 || typeof parsed.projects !== "object") {
    throw new Error(
      `Invalid .specdojo/specdojo.config.json: expected { version: 1, projects: { ... } }`,
    );
  }

  for (const [projectId, project] of Object.entries(parsed.projects)) {
    if (!isValidProjectConfig(project)) {
      throw new Error(
        `Invalid .specdojo/specdojo.config.json: projects.${projectId} must omit ` +
          `schedule_path/execution_path or set them to non-empty strings, ` +
          `and project_context must be a string[] when present`,
      );
    }
  }

  const projectIds = Object.keys(parsed.projects);
  const rootDir = dirname(dirname(configPath));
  const repoErrors = projectIds
    .sort()
    .flatMap((projectId) =>
      validateProjectRepos(projectId, parsed.projects[projectId], projectIds, rootDir),
    );
  if (repoErrors.length > 0) {
    throw new Error(
      `Invalid .specdojo/specdojo.config.json (${configPath}):\n` +
        repoErrors.map((message) => `  - ${message}`).join("\n"),
    );
  }

  return { configPath, config: parsed };
}

export function writeConfig(config: SpecDojoConfig): void {
  const configPath = defaultConfigPath();
  mkdirSync(dirname(configPath), { recursive: true });
  writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n", "utf8");
}

// Resolve the repo-root-relative paths whose generated/ outputs must stay untracked.
// members/roles/viewpoints are single files, so they never hold a generated/ directory.
export function projectGitignoreLayout(project: SpecDojoProjectConfig): ProjectGitignoreLayout {
  const projectPaths = [
    getProjectCatalogPath(project),
    getProjectSchedulePath(project),
    getProjectExecutionPath(project),
    getProjectTimelinePath(project),
    getProjectRegisterPath(project),
    getProjectRoutinesPath(project),
    getProjectJobsPath(project),
  ].filter((path): path is string => path !== undefined);
  return {
    basePath: project.base_path,
    projectPaths,
    executionPath: getProjectExecutionPath(project),
  };
}

function writeGitignoreForConfig(config: SpecDojoConfig, dryRun: boolean): void {
  const layouts = Object.keys(config.projects)
    .sort()
    .map((id) => projectGitignoreLayout(config.projects[id]));
  const result = ensureGitignore(specdojoRootDir(), gitignorePatternsForLayouts(layouts), {
    dryRun,
  });
  process.stdout.write(formatGitignoreReport(result, dryRun));
}

export function registerConfigCommands(program: Command): void {
  const cfg = program
    .command("config")
    .description("Config helpers (.specdojo/specdojo.config.json)");

  cfg
    .command("init")
    .description(
      "Create .specdojo/specdojo.config.json template (does not overwrite existing) " +
        "and add the lines excluding specdojo outputs to .gitignore",
    )
    .option("--dry-run", "Show the planned config and .gitignore lines without writing", false)
    .action((opts: { dryRun?: boolean }) => {
      const dryRun = !!opts.dryRun;
      const { configPath, config } = loadConfig();
      if (config) {
        process.stdout.write(`Already exists: ${configPath}\n`);
        writeGitignoreForConfig(config, dryRun);
        return;
      }
      const template: SpecDojoConfig = {
        version: 1,
        current_project: "prj-0001",
        projects: {
          "prj-0001": {
            base_path: "docs/ja/projects/prj-0001",
            project_register_path: "controls/project-register",
            project_context: ["prj-overview"],
            run: {
              worktree_base: "../app1-worktrees",
            },
          },
        },
      };
      if (dryRun) {
        process.stdout.write(`Would create (dry-run): ${configPath}\n`);
      } else {
        writeConfig(template);
        process.stdout.write(`Created: ${configPath}\n`);
      }
      writeGitignoreForConfig(template, dryRun);
      if (dryRun) return;
      process.stdout.write(
        "Next steps:\n" +
          "  1. Keep this repository beside the product repository as app1-specdojo/.\n" +
          "  2. Review the project ID and paths; worktrees default to ../app1-worktrees.\n" +
          "  3. Optional agent setup: npx specdojo config scaffold --provider <name>\n" +
          "  4. Create a register: npx specdojo register scaffold --project prj-0001\n" +
          `  5. Before using catalog or schedule, add the required paths: ${SPECDOJO_CONFIG_REFERENCE_URL}\n` +
          '  6. To let tasks change the product repository, declare it under "repos" ' +
          '(e.g. { "name": "app1", "path": "../app1" }) and write targets/paths as app1:<path>.\n',
      );
    });

  cfg
    .command("scaffold")
    .description("Scaffold agent/settings templates for a provider")
    .requiredOption(
      "--provider <name>",
      "Provider template to copy (antigravity|claude|codex|copilot|opencode)",
    )
    .option("--force", "Overwrite existing files", false)
    .option("--dry-run", "Show planned files without writing", false)
    .option(
      "--global",
      "Merge provider permissions into user-level settings (currently antigravity only)",
      false,
    )
    .action(async (opts) => {
      try {
        await runProviderScaffold(String(opts.provider), {
          packageRoot: specdojoPackageRootDir(),
          repoRoot: specdojoRootDir(),
          force: !!opts.force,
          dryRun: !!opts.dryRun,
          global: !!opts.global,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        process.stderr.write(`${message}\n`);
        process.exitCode = 1;
      }
    });
}

export function registerProjectCommands(program: Command): void {
  const pj = program.command("project").description("Project registry commands");

  pj.command("list")
    .description("List projects from .specdojo/specdojo.config.json")
    .action(() => {
      const { configPath, config } = loadConfig();
      if (!config) {
        process.stdout.write(`No config found: ${configPath}\n`);
        process.stdout.write(`Run: specdojo config init\n`);
        process.exitCode = 1;
        return;
      }

      const entries = Object.entries(config.projects).sort((a, b) => a[0].localeCompare(b[0]));
      if (entries.length === 0) {
        process.stdout.write(`No projects in ${configPath}\n`);
        return;
      }

      for (const [id, project] of entries) {
        const schedulePath = getProjectSchedulePath(project);
        const executionPath = getProjectExecutionPath(project);
        const suffix = executionPath ? `\t${executionPath}` : "";
        process.stdout.write(`${id}\t${schedulePath}${suffix}\n`);
      }
    });
}
