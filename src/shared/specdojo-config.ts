import { type Command } from "commander";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, isAbsolute, join, posix, relative, resolve } from "node:path";
import dotenv from "dotenv";
import { dump, load } from "./yaml.js";
import Ajv2020Module from "ajv/dist/2020.js";
import type { ValidateFunction } from "ajv";
import type { AgentStageRole, SchedulerStrategy, TaskMode } from "./agent-types.js";
import { runProviderScaffold, specdojoPackageRootDir } from "./provider-scaffold.js";
import { runWorkspaceScaffold } from "./workspace-scaffold.js";
import { runLefthookScaffold } from "./lefthook-scaffold.js";
import { runSlidevScaffold, SLIDEV_KATA_PATTERNS } from "./slidev-scaffold.js";
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
  /** Parent-runner validations appended to pipeline.parent_validations from exec_defaults. */
  parent_validations?: Array<string | { id: string; repo: string }>;
  /** Remove matching ID/repository pairs from exec_defaults before appending parent_validations. */
  parent_validations_exclude?: Array<string | { id: string; repo: string }>;
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
  /** Branch that receives direct project-register commits. */
  integration_branch?: string;
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

/** A project register hosted by another repository and addressed locally by an alias. */
export type SpecDojoExternalProjectConfig = {
  /** Repository root, relative to the SpecDojo root. */
  path: string;
  /** Project id understood by the SpecDojo installation in the external repository. */
  project_id: string;
};

export const REPO_NAME_PATTERN = /^[a-z0-9-]+$/;

/**
 * Directory name of the project repository worktree under `<worktree_base>/<task-id>/` when the
 * project declares `repos`. Product worktrees sit beside it as `<task-id>/<repo-name>/`, so a
 * repository must not use this name.
 */
export const PROJECT_REPO_WORKTREE_DIRNAME = "project";

function readTextFileOrNull(path: string): string | null {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return null;
  }
}

/**
 * True when `rootDir` is the project worktree of a multi-repository exec task, i.e.
 * `<worktree_base>/<task-name>/project/` checked out on `exec/<task-name>`. Detected from the
 * linked worktree's `.git` file and HEAD only (no git process), so it is cheap enough to run on
 * every config load.
 */
export function isMultiRepoProjectWorktree(rootDir: string): boolean {
  const root = resolve(rootDir);
  if (basename(root) !== PROJECT_REPO_WORKTREE_DIRNAME) return false;
  const dotGit = join(root, ".git");
  if (!existsSync(dotGit) || statSync(dotGit).isDirectory()) return false;
  const gitdirLine = readTextFileOrNull(dotGit)
    ?.split(/\r?\n/)
    .find((line) => line.startsWith("gitdir:"));
  if (!gitdirLine) return false;
  const gitdir = resolve(root, gitdirLine.slice("gitdir:".length).trim());
  const head = readTextFileOrNull(join(gitdir, "HEAD"))?.trim();
  return head === `ref: refs/heads/exec/${basename(dirname(root))}`;
}

/**
 * Absolute root of a declared repository. Normally `path` is resolved from the SpecDojo root.
 * Inside the project worktree of a multi-repository exec task, the repository is the sibling
 * worktree `<task-name>/<repo-name>/`, so `path` (written for the main checkout) is not used.
 */
export function resolveRepoRoot(
  rootDir: string,
  repo: Pick<SpecDojoRepoConfig, "name" | "path">,
): string {
  if (isMultiRepoProjectWorktree(rootDir)) return join(dirname(resolve(rootDir)), repo.name);
  return resolve(rootDir, repo.path);
}

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
  model?: string; // agent only: provider model identifier, including its version
  effort?: string; // agent only: provider-specific reasoning effort
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

export type AgentAlias = {
  nickname: string;
  alias_of: string;
};

export type MemberRoster = {
  version: number;
  project_id?: string;
  members: ProjectMember[];
  aliases?: AgentAlias[];
};

// Register events also have a small set of product-owned actors that do not represent a
// roster member. Keep this list closed: accepting arbitrary strings would make the audit log
// impossible to trace back to either a person, an agent, or a known SpecDojo component.
export const RESERVED_REGISTER_ACTORS = [
  "SpecDojo",
  "specdojo-orchestrator",
  "night-orchestrator",
] as const;

// Resolve either a concrete agent nickname or a backward-compatible alias to the concrete
// member. Alias validity is checked while loading the roster, but keep the traversal guarded so
// callers and tests that construct a roster directly cannot loop forever on malformed input.
export function resolveAgentMember(
  roster: MemberRoster | null,
  nickname: string,
): ProjectMember | undefined {
  if (!roster) return undefined;

  const members = new Map(
    roster.members
      .filter((member) => member.type === "agent")
      .map((member) => [member.nickname, member] as const),
  );
  const direct = members.get(nickname);
  if (direct) return direct;

  const aliases = new Map(
    (roster.aliases ?? []).map((alias) => [alias.nickname, alias.alias_of] as const),
  );
  const seen = new Set<string>();
  let current = nickname;
  while (!seen.has(current)) {
    seen.add(current);
    const target = aliases.get(current);
    if (!target) return undefined;
    const member = members.get(target);
    if (member) return member.disabled ? undefined : member;
    current = target;
  }
  return undefined;
}

export function resolveRegisterActor(actor: string, roster: MemberRoster | null): string {
  const normalized = actor.trim();
  if (!normalized) {
    throw new Error("Register event actor must not be empty");
  }
  if ((RESERVED_REGISTER_ACTORS as readonly string[]).includes(normalized)) return normalized;

  const agent = resolveAgentMember(roster, normalized);
  if (agent) return agent.nickname;

  const humans =
    roster?.members.filter((member) => member.type === "human" && member.nickname === normalized) ??
    [];
  if (humans.length === 1) return humans[0].nickname;
  if (humans.length > 1) {
    throw new Error(`Duplicate human actor nickname in members_path: ${normalized}`);
  }

  const rosterNames = [
    ...(roster?.members.map((member) => member.nickname) ?? []),
    ...(roster?.aliases?.map((alias) => alias.nickname) ?? []),
  ];
  const accepted = [...new Set([...rosterNames, ...RESERVED_REGISTER_ACTORS])].sort();
  throw new Error(
    `Unknown register actor: "${normalized}". Use a human nickname from members_path, ` +
      `an agent nickname or alias from agent_members_path, or a reserved actor: ` +
      accepted.join(", "),
  );
}

export type SpecDojoConfig = {
  version: 1;
  current_project?: string;
  /** Repository-wide authority used by locally authored kata. */
  kata_authority?: string;
  /** Repository-wide protected agent registry. Must stay under .specdojo/. */
  agent_members_path?: string;
  projects: Record<string, SpecDojoProjectConfig>;
  /** External project registers delegated to the SpecDojo installation in another repository. */
  external_projects?: Record<string, SpecDojoExternalProjectConfig>;
};

export const DEFAULT_AGENT_MEMBERS_PATH = ".specdojo/agent-members.yaml";

export const KATA_AUTHORITY_PATTERN = /^(?!prj-)(?!specdojo$)[a-z][a-z0-9-]*$/;

function repositoryIdentityRoot(rootDir: string): string {
  const root = resolve(rootDir);
  const dotGit = join(root, ".git");
  if (!existsSync(dotGit) || statSync(dotGit).isDirectory()) return root;
  const gitdirLine = readTextFileOrNull(dotGit)
    ?.split(/\r?\n/)
    .find((line) => line.startsWith("gitdir:"));
  if (!gitdirLine) return root;
  const gitdir = resolve(root, gitdirLine.slice("gitdir:".length).trim()).replaceAll("\\", "/");
  const marker = "/.git/worktrees/";
  const markerIndex = gitdir.lastIndexOf(marker);
  return markerIndex >= 0 ? gitdir.slice(0, markerIndex) : root;
}

export function defaultKataAuthority(rootDir: string = specdojoRootDir()): string {
  const directoryName = basename(repositoryIdentityRoot(rootDir));
  const normalized = directoryName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const withLetterPrefix = /^[a-z]/.test(normalized) ? normalized : `repo-${normalized}`;
  const withoutReservedAuthority =
    withLetterPrefix === "specdojo" || withLetterPrefix.startsWith("prj-")
      ? `repo-${withLetterPrefix}`
      : withLetterPrefix;
  return KATA_AUTHORITY_PATTERN.test(withoutReservedAuthority)
    ? withoutReservedAuthority
    : "repository";
}

export function getKataAuthority(
  config: SpecDojoConfig | null,
  rootDir: string = specdojoRootDir(),
): string {
  return config?.kata_authority?.trim() || defaultKataAuthority(rootDir);
}

export function isSpecdojoSourceRepository(rootDir: string = specdojoRootDir()): boolean {
  try {
    const pkg = JSON.parse(readFileSync(join(rootDir, "package.json"), "utf8")) as {
      name?: unknown;
    };
    return pkg.name === "specdojo" && existsSync(join(rootDir, "src", "specdojo.ts"));
  } catch {
    return false;
  }
}

type AgentMemberRoster = {
  version: number;
  members: ProjectMember[];
  aliases?: AgentAlias[];
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

/** Default worktree directory beside the repository, derived from its directory name. */
export function defaultWorktreeBase(rootDir: string = specdojoRootDir()): string {
  return `../${basename(resolve(rootDir))}-worktrees`;
}

export function loadEnv(rootDir: string = specdojoRootDir()): void {
  // Load .env from the repository root if present.
  // Safe if missing.
  dotenv.config({ path: resolve(rootDir, ".env"), quiet: true });
}

export function defaultConfigPath(rootDir: string = specdojoRootDir()): string {
  return join(resolve(rootDir), ".specdojo", "specdojo.config.json");
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
const EXTERNAL_PROJECT_KEYS = new Set(["path", "project_id"]);

export type ResolvedExternalProject = SpecDojoExternalProjectConfig & {
  alias: string;
  repoRoot: string;
};

/** Resolve a configured external-project repository from the SpecDojo root. */
export function resolveExternalProjectRoot(
  rootDir: string,
  project: Pick<SpecDojoExternalProjectConfig, "path">,
): string {
  return resolve(rootDir, project.path);
}

/** Return external projects in configuration order with absolute repository roots. */
export function resolveExternalProjects(
  rootDir: string,
  config: Pick<SpecDojoConfig, "external_projects">,
): ResolvedExternalProject[] {
  return Object.entries(config.external_projects ?? {}).map(([alias, project]) => ({
    alias,
    ...project,
    repoRoot: resolveExternalProjectRoot(rootDir, project),
  }));
}

/** Validate top-level `external_projects` declarations. */
export function validateExternalProjects(
  externalProjects: unknown,
  projectIds: readonly string[],
  rootDir: string,
): string[] {
  if (externalProjects === undefined) return [];
  if (!isRecord(externalProjects)) return ["external_projects must be an object"];

  const errors: string[] = [];
  for (const [alias, value] of Object.entries(externalProjects)) {
    const at = `external_projects.${alias}`;
    if (!REPO_NAME_PATTERN.test(alias)) {
      errors.push(
        `external project alias ${JSON.stringify(alias)} must match ${String(REPO_NAME_PATTERN)}`,
      );
    }
    if (projectIds.includes(alias)) {
      errors.push(`${at} collides with local project id "${alias}"`);
    }
    if (!isRecord(value)) {
      errors.push(`${at} must be an object with path and project_id`);
      continue;
    }
    for (const key of Object.keys(value).sort()) {
      if (!EXTERNAL_PROJECT_KEYS.has(key)) errors.push(`${at}: unknown key "${key}"`);
    }

    const path = value.path;
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

    if (typeof value.project_id !== "string" || value.project_id.trim().length === 0) {
      errors.push(`${at}.project_id must be a non-empty string`);
    }
  }
  return errors;
}

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
    } else if (name === PROJECT_REPO_WORKTREE_DIRNAME) {
      errors.push(
        `${at}.name "${name}" is reserved: the project repository worktree uses ` +
          `<worktree_base>/<task-id>/${PROJECT_REPO_WORKTREE_DIRNAME}/`,
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
      const absolutePath =
        typeof name === "string" && REPO_NAME_PATTERN.test(name)
          ? resolveRepoRoot(rootDir, { name, path })
          : resolve(rootDir, path);
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
    absolutePath: resolve(resolveRepoRoot(rootDir, repo), ref.path),
  };
}

export function loadMemberRoster(
  baseDir: string,
  project: SpecDojoProjectConfig,
): MemberRoster | null {
  const membersPath = getProjectMembersPath(project);
  let humanRoster: MemberRoster | undefined;
  let humanFullPath: string | undefined;
  if (membersPath) {
    humanFullPath = resolve(baseDir, membersPath);
    if (!existsSync(humanFullPath)) {
      throw new Error(`members_path not found: ${humanFullPath}`);
    }

    const parsed = readYamlFile(humanFullPath) as MemberRoster;
    if (!parsed || !Array.isArray(parsed.members)) {
      throw new Error(`Invalid members file: ${humanFullPath} (expected { members: [...] })`);
    }

    const legacyAgent = parsed.members.find((member) => member?.type === "agent");
    if (legacyAgent) {
      throw new Error(
        `Invalid members file: ${humanFullPath}: agent '${legacyAgent.nickname ?? "<unknown>"}' ` +
          `must be moved to ${resolve(baseDir, configuredAgentMembersPath(baseDir))}. ` +
          `Run: specdojo config migrate-members --dry-run`,
      );
    }
    validateMemberFile("pm-members.schema.yaml", humanFullPath, parsed);
    humanRoster = parsed;
  }

  const agentMembersPath = configuredAgentMembersPath(baseDir);
  const agentFullPath = resolve(baseDir, agentMembersPath);
  let agentRoster: AgentMemberRoster | undefined;
  if (existsSync(agentFullPath)) {
    agentRoster = readYamlFile(agentFullPath) as AgentMemberRoster;
    if (!agentRoster || !Array.isArray(agentRoster.members)) {
      throw new Error(`Invalid agent members file: ${agentFullPath} (expected { members: [...] })`);
    }
    const human = agentRoster.members.find((member) => member?.type === "human");
    if (human) {
      throw new Error(
        `Invalid agent members file: ${agentFullPath}: human '${human.nickname ?? "<unknown>"}' is not allowed`,
      );
    }
    validateMemberFile("agent-members.schema.yaml", agentFullPath, agentRoster);
    validateAgentAliases(agentFullPath, agentRoster);
  }

  if (!humanRoster && !agentRoster) return null;

  const membersWithSources = [
    ...(humanRoster?.members.map((member) => ({ member, source: humanFullPath as string })) ?? []),
    ...(agentRoster?.members.map((member) => ({ member, source: agentFullPath })) ?? []),
  ];
  const seen = new Map<string, string>();
  for (const { member, source } of membersWithSources) {
    const previousSource = seen.get(member.nickname);
    if (previousSource) {
      throw new Error(
        `Duplicate member nickname '${member.nickname}' across ${previousSource} and ${source}`,
      );
    }
    seen.set(member.nickname, source);
  }
  for (const alias of agentRoster?.aliases ?? []) {
    const previousSource = seen.get(alias.nickname);
    if (previousSource) {
      throw new Error(
        `Duplicate member or alias nickname '${alias.nickname}' across ${previousSource} and ${agentFullPath}`,
      );
    }
  }

  const members = membersWithSources.map(({ member }) => member);
  const aliases = agentRoster?.aliases;
  if (humanRoster) return { ...humanRoster, members, ...(aliases ? { aliases } : {}) };
  return { version: agentRoster?.version ?? 1, members, ...(aliases ? { aliases } : {}) };
}

function validateAgentAliases(path: string, roster: AgentMemberRoster): void {
  const members = new Map<string, ProjectMember>();
  for (const member of roster.members) {
    if (members.has(member.nickname)) {
      throw new Error(`Invalid agent members file: ${path}: duplicate member '${member.nickname}'`);
    }
    members.set(member.nickname, member);
  }

  const aliases = new Map<string, string>();
  for (const alias of roster.aliases ?? []) {
    if (members.has(alias.nickname)) {
      throw new Error(
        `Invalid agent alias '${alias.nickname}' in ${path}: name conflicts with a member`,
      );
    }
    if (aliases.has(alias.nickname)) {
      throw new Error(`Invalid agent alias '${alias.nickname}' in ${path}: duplicate alias name`);
    }
    aliases.set(alias.nickname, alias.alias_of);
  }

  const resolved = new Set<string>();
  const resolveAlias = (nickname: string, chain: string[]): void => {
    if (resolved.has(nickname)) return;
    const cycleStart = chain.indexOf(nickname);
    if (cycleStart >= 0) {
      const cycle = [...chain.slice(cycleStart), nickname].join(" -> ");
      throw new Error(`Invalid agent alias '${nickname}' in ${path}: alias cycle ${cycle}`);
    }

    const target = aliases.get(nickname);
    if (!target) return;
    const member = members.get(target);
    if (member) {
      if (member.disabled) {
        throw new Error(
          `Invalid agent alias '${nickname}' in ${path}: alias_of '${target}' resolves to a disabled member`,
        );
      }
      resolved.add(nickname);
      return;
    }
    if (!aliases.has(target)) {
      throw new Error(
        `Invalid agent alias '${nickname}' in ${path}: alias_of '${target}' does not resolve to a member`,
      );
    }
    resolveAlias(target, [...chain, nickname]);
    resolved.add(nickname);
  };

  for (const nickname of aliases.keys()) resolveAlias(nickname, []);
}

const Ajv2020 = Ajv2020Module.default;
const memberSchemaValidators = new Map<string, ValidateFunction>();

function readYamlFile(path: string): unknown {
  try {
    return load(readFileSync(path, "utf8"));
  } catch (error) {
    throw new Error(
      `Invalid YAML: ${path}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

function memberSchemaValidator(schemaName: string): ValidateFunction {
  const schemaDir = join(specdojoPackageRootDir(), "docs", "specdojo", "schemas", "v1");
  const cacheKey = `${schemaDir}/${schemaName}`;
  const cached = memberSchemaValidators.get(cacheKey);
  if (cached) return cached;
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  ajv.addFormat("email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  for (const entry of ["exec-common.schema.yaml", "pm-members.schema.yaml"]) {
    if (entry === schemaName) continue;
    const path = join(schemaDir, entry);
    if (existsSync(path)) ajv.addSchema(readYamlFile(path) as object, entry);
  }
  const validator = ajv.compile(readYamlFile(join(schemaDir, schemaName)) as object);
  memberSchemaValidators.set(cacheKey, validator);
  return validator;
}

function validateMemberFile(schemaName: string, path: string, value: unknown): void {
  const validate = memberSchemaValidator(schemaName);
  if (validate(value)) return;
  const details = (validate.errors ?? [])
    .map((error) => `${error.instancePath || "/"} ${error.message ?? "is invalid"}`)
    .join("; ");
  throw new Error(`Schema validation failed: ${path}: ${details}`);
}

function dumpMemberFile(path: string, schemaName: string, value: unknown): string {
  const schemaPath = join(
    specdojoPackageRootDir(),
    "docs",
    "specdojo",
    "schemas",
    "v1",
    schemaName,
  );
  const schemaRef = relative(dirname(path), schemaPath).replaceAll("\\", "/");
  return (
    `# yaml-language-server: $schema=${schemaRef}\n` + dump(value, { lineWidth: 100, noRefs: true })
  );
}

function configuredAgentMembersPath(baseDir: string): string {
  const configPath = resolve(baseDir, ".specdojo", "specdojo.config.json");
  if (!existsSync(configPath)) return DEFAULT_AGENT_MEMBERS_PATH;
  const parsed = JSON.parse(readFileSync(configPath, "utf8")) as Partial<SpecDojoConfig>;
  const configured = parsed.agent_members_path?.trim() || DEFAULT_AGENT_MEMBERS_PATH;
  assertProtectedAgentMembersPath(configured, configPath);
  return configured;
}

function assertProtectedAgentMembersPath(path: string, source: string): void {
  const normalized = path.replaceAll("\\", "/");
  if (
    isAbsolute(path) ||
    !normalized.startsWith(".specdojo/") ||
    normalized.includes("../") ||
    !/\.ya?ml$/i.test(normalized)
  ) {
    throw new Error(
      `Invalid agent_members_path in ${source}: expected a repository-relative YAML path under .specdojo/`,
    );
  }
}

export function assertValidActor(actor: string, roster: MemberRoster | null): void {
  if (!roster) return;
  const known = roster.members.map((m) => m.nickname);
  if (!known.includes(actor)) {
    throw new Error(
      `Unknown actor: "${actor}". Must be one of: ${known.join(", ")}\n` +
        `Register a human in members_path or an agent in agent_members_path before use.`,
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
    integration_branch?: unknown;
    project_context?: unknown;
  };
  // 省略は既定値へ解決するため許容する。ただし指定したうえでの空文字は、設定漏れと
  // 意図的な省略を区別できないため引き続き不正として扱う。
  if (!isOmittedOrNonEmptyString(candidate.schedule_path)) return false;
  if (!isOmittedOrNonEmptyString(candidate.execution_path)) return false;
  if (!isOmittedOrNonEmptyString(candidate.integration_branch)) return false;
  if (
    candidate.project_context !== undefined &&
    (!Array.isArray(candidate.project_context) ||
      !candidate.project_context.every((ref) => typeof ref === "string" && ref.trim().length > 0))
  ) {
    return false;
  }
  return true;
}

export function loadConfig(configRootDir: string = specdojoRootDir()): ConfigLoadResult {
  loadEnv(configRootDir);

  const configPath = defaultConfigPath(configRootDir);
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

  if (parsed.agent_members_path !== undefined) {
    if (!isOmittedOrNonEmptyString(parsed.agent_members_path)) {
      throw new Error(
        `Invalid .specdojo/specdojo.config.json: agent_members_path must be a non-empty string`,
      );
    }
    assertProtectedAgentMembersPath(parsed.agent_members_path, configPath);
  }

  if (
    parsed.kata_authority !== undefined &&
    (typeof parsed.kata_authority !== "string" ||
      !KATA_AUTHORITY_PATTERN.test(parsed.kata_authority))
  ) {
    throw new Error(
      `Invalid .specdojo/specdojo.config.json: kata_authority must match ${KATA_AUTHORITY_PATTERN}`,
    );
  }

  for (const [projectId, project] of Object.entries(parsed.projects)) {
    if (!isValidProjectConfig(project)) {
      throw new Error(
        `Invalid .specdojo/specdojo.config.json: projects.${projectId} must omit ` +
          `schedule_path/execution_path/integration_branch or set them to non-empty strings, ` +
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
  const externalProjectErrors = validateExternalProjects(
    parsed.external_projects,
    projectIds,
    rootDir,
  );
  const configErrors = [...repoErrors, ...externalProjectErrors];
  if (configErrors.length > 0) {
    throw new Error(
      `Invalid .specdojo/specdojo.config.json (${configPath}):\n` +
        configErrors.map((message) => `  - ${message}`).join("\n"),
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
      const worktreeBase = defaultWorktreeBase();
      const template: SpecDojoConfig = {
        version: 1,
        current_project: "prj-0001",
        projects: {
          "prj-0001": {
            base_path: "docs/ja/projects/prj-0001",
            project_register_path: "controls/project-register",
            project_context: ["prj-overview"],
            run: {
              worktree_base: worktreeBase,
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
          `  2. Review the project ID and paths; worktrees default to ${worktreeBase}.\n` +
          "  3. Optional agent setup: npx specdojo config scaffold --provider <name>\n" +
          "  4. Create a register: npx specdojo register scaffold --project prj-0001\n" +
          `  5. Before using catalog or schedule, add the required paths: ${SPECDOJO_CONFIG_REFERENCE_URL}\n` +
          '  6. To let tasks change the product repository, declare it under "repos" ' +
          '(e.g. { "name": "app1", "path": "../app1" }) and write targets/paths as app1:<path>.\n',
      );
    });

  cfg
    .command("migrate-members")
    .description("Move agent entries from project pm-members.yaml files to protected agent members")
    .option("--project <projectId>", "Migrate only one project (default: all configured projects)")
    .option("--dry-run", "Show planned changes without writing", false)
    .action((opts: { project?: string; dryRun?: boolean }) => {
      try {
        migrateAgentMembers({ projectId: opts.project, dryRun: !!opts.dryRun });
      } catch (error) {
        process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
        process.exitCode = 1;
      }
    });

  cfg
    .command("scaffold")
    .description("Scaffold provider settings, a VS Code multi-root workspace, Git hooks, or Slidev")
    .option(
      "--provider <name>",
      "Provider template to copy (antigravity|claude|codex|copilot|opencode)",
    )
    .option(
      "--workspace",
      "Generate VS Code multi-root workspace (<project-id>.code-workspace) from repos config",
      false,
    )
    .option("--lefthook", "Generate pre-commit hooks for SpecDojo repositories", false)
    .option("--slidev", "Set up Slidev and formatting for kata", false)
    .option(
      "--project <id>",
      "Target project ID for workspace scaffolding (defaults to current_project)",
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
        if (!opts.provider && !opts.workspace && !opts.lefthook && !opts.slidev) {
          throw new Error(
            "Specify --provider <name>, --workspace, --lefthook, or --slidev to scaffold.",
          );
        }
        if (opts.global && !opts.provider) {
          throw new Error("--global requires --provider antigravity");
        }
        if (opts.provider) {
          await runProviderScaffold(String(opts.provider), {
            packageRoot: specdojoPackageRootDir(),
            repoRoot: specdojoRootDir(),
            force: !!opts.force,
            dryRun: !!opts.dryRun,
            global: !!opts.global,
          });
        }
        if (opts.workspace) {
          await runWorkspaceScaffold({
            repoRoot: specdojoRootDir(),
            projectId: opts.project ? String(opts.project) : undefined,
            force: !!opts.force,
            dryRun: !!opts.dryRun,
          });
        }
        if (opts.lefthook) {
          const { configPath, config } = loadConfig();
          if (!config) {
            throw new Error(`No config found: ${configPath}. Run specdojo config init first.`);
          }
          await runLefthookScaffold({
            packageRoot: specdojoPackageRootDir(),
            repoRoot: specdojoRootDir(),
            config,
            slidevKataPatterns: opts.slidev ? SLIDEV_KATA_PATTERNS : [],
            force: !!opts.force,
            dryRun: !!opts.dryRun,
          });
        }
        if (opts.slidev) {
          await runSlidevScaffold({ repoRoot: specdojoRootDir(), dryRun: !!opts.dryRun });
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        process.stderr.write(`${message}\n`);
        process.exitCode = 1;
      }
    });
}

export function migrateAgentMembers(options: {
  projectId?: string;
  dryRun: boolean;
  rootDir?: string;
}): void {
  const rootDir = options.rootDir ? resolve(options.rootDir) : specdojoRootDir();
  const configPath = join(rootDir, ".specdojo", "specdojo.config.json");
  if (!existsSync(configPath)) throw new Error(`No config found: ${configPath}`);
  const config = JSON.parse(readFileSync(configPath, "utf8")) as SpecDojoConfig;

  const projectEntries: Array<[string, SpecDojoProjectConfig | undefined]> = options.projectId
    ? [[options.projectId, config.projects[options.projectId]]]
    : Object.entries(config.projects);
  if (options.projectId && !config.projects[options.projectId]) {
    throw new Error(`Unknown project: ${options.projectId}`);
  }

  const agentRelPath = config.agent_members_path?.trim() || DEFAULT_AGENT_MEMBERS_PATH;
  assertProtectedAgentMembersPath(agentRelPath, configPath);
  const agentPath = resolve(rootDir, agentRelPath);
  let existingAgents: AgentMemberRoster = { version: 1, members: [] };
  if (existsSync(agentPath)) {
    existingAgents = readYamlFile(agentPath) as AgentMemberRoster;
    validateMemberFile("agent-members.schema.yaml", agentPath, existingAgents);
    validateAgentAliases(agentPath, existingAgents);
  }

  const agentNicknames = new Set([
    ...existingAgents.members.map((member) => member.nickname),
    ...(existingAgents.aliases ?? []).map((alias) => alias.nickname),
  ]);
  const moved: ProjectMember[] = [];
  const updates: Array<{ path: string; roster: MemberRoster; count: number }> = [];
  for (const [projectId, project] of projectEntries) {
    if (!project) continue;
    const relPath = getProjectMembersPath(project);
    if (!relPath) throw new Error(`projects.${projectId}.members_path is required`);
    const path = resolve(rootDir, relPath);
    if (!existsSync(path)) throw new Error(`members_path not found: ${path}`);
    const roster = readYamlFile(path) as MemberRoster;
    if (!roster || !Array.isArray(roster.members)) {
      throw new Error(`Invalid members file: ${path} (expected { members: [...] })`);
    }
    const humans = roster.members.filter((member) => member.type !== "agent");
    const agents = roster.members.filter((member) => member.type === "agent");
    const humanNicknames = new Set<string>();
    for (const human of humans) {
      if (humanNicknames.has(human.nickname)) {
        throw new Error(`Duplicate human nickname '${human.nickname}' while migrating ${path}`);
      }
      humanNicknames.add(human.nickname);
    }
    for (const agent of agents) {
      if (agentNicknames.has(agent.nickname)) {
        throw new Error(
          `Duplicate agent member or alias nickname '${agent.nickname}' while migrating ${path}`,
        );
      }
      agentNicknames.add(agent.nickname);
      moved.push(agent);
    }
    const humanRoster = { ...roster, members: humans };
    validateMemberFile("pm-members.schema.yaml", path, humanRoster);
    updates.push({ path, roster: humanRoster, count: agents.length });
  }

  const mergedAgents = {
    ...existingAgents,
    version: existingAgents.version || 1,
    members: [...existingAgents.members, ...moved],
  } satisfies AgentMemberRoster;
  validateMemberFile("agent-members.schema.yaml", agentPath, mergedAgents);
  validateAgentAliases(agentPath, mergedAgents);
  for (const update of updates) {
    for (const human of update.roster.members) {
      if (agentNicknames.has(human.nickname)) {
        throw new Error(
          `Duplicate member nickname '${human.nickname}' across ${update.path} and ${agentPath}`,
        );
      }
    }
  }

  const verb = options.dryRun ? "Would move" : "Moved";
  for (const update of updates) {
    process.stdout.write(`${verb} ${update.count} agent member(s) from ${update.path}\n`);
  }
  process.stdout.write(
    `${options.dryRun ? "Would write" : "Wrote"} ${mergedAgents.members.length} agent member(s) to ${agentPath}\n`,
  );
  if (options.dryRun) return;

  for (const update of updates) {
    writeFileSync(
      update.path,
      dumpMemberFile(update.path, "pm-members.schema.yaml", update.roster),
      "utf8",
    );
  }
  mkdirSync(dirname(agentPath), { recursive: true });
  writeFileSync(
    agentPath,
    dumpMemberFile(agentPath, "agent-members.schema.yaml", mergedAgents),
    "utf8",
  );
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
