import { existsSync, readFileSync, statSync } from "node:fs";
import { basename, isAbsolute, join, resolve } from "node:path";
import type { ConfigLoadResult, SpecDojoConfig, SpecDojoRepoConfig } from "./specdojo-config.js";

/**
 * Untracked per-machine overrides of `.specdojo/specdojo.config.json` (PJR-NC9R). Only the keys
 * allowed below are accepted; the shared config stays the single source for everything else.
 */
export const LOCAL_CONFIG_RELATIVE_PATH = ".specdojo/specdojo.local.config.json";

/** Absolute path of the main working tree's local config, passed to processes in worktrees. */
export const LOCAL_CONFIG_ENV = "SPECDOJO_LOCAL_CONFIG";

/** Keys a local entry may set on a repository already declared in the shared config. */
const OVERRIDE_REPO_KEYS: readonly string[] = ["name", "path"];

export type LocalConfigOverride =
  | { project: string; repo: string; kind: "path"; path: string; shared_path: string }
  | { project: string; repo: string; kind: "added"; path: string };

export type LocalConfigApplication = {
  config: SpecDojoConfig;
  overrides: LocalConfigOverride[];
};

function readTextFileOrNull(path: string): string | null {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** True when `rootDir` is a linked worktree (its `.git` is a file, not a directory). */
function isLinkedWorktree(rootDir: string): boolean {
  const dotGit = join(resolve(rootDir), ".git");
  return existsSync(dotGit) && !statSync(dotGit).isDirectory();
}

/**
 * Root of the main working tree. A linked worktree resolves to the checkout that owns its
 * `.git/worktrees/<name>` directory; any other directory resolves to itself.
 */
export function repositoryIdentityRoot(rootDir: string): string {
  const root = resolve(rootDir);
  if (!isLinkedWorktree(root)) return root;
  const gitdirLine = readTextFileOrNull(join(root, ".git"))
    ?.split(/\r?\n/)
    .find((line) => line.startsWith("gitdir:"));
  if (!gitdirLine) return root;
  const gitdir = resolve(root, gitdirLine.slice("gitdir:".length).trim()).replaceAll("\\", "/");
  const marker = "/.git/worktrees/";
  const markerIndex = gitdir.lastIndexOf(marker);
  return markerIndex >= 0 ? gitdir.slice(0, markerIndex) : root;
}

/**
 * Local config path for `rootDir`. The main working tree reads its own file. A linked worktree
 * never trusts a file of the same name inside itself: it uses the path the parent passed in
 * `SPECDOJO_LOCAL_CONFIG`, or else the main working tree's file. The variable is ignored outside
 * linked worktrees so that it cannot leak into another repository's main checkout.
 */
export function resolveLocalConfigPath(
  rootDir: string,
  env: NodeJS.ProcessEnv = process.env,
): string {
  const root = resolve(rootDir);
  if (!isLinkedWorktree(root)) return join(root, LOCAL_CONFIG_RELATIVE_PATH);
  const fromEnv = env[LOCAL_CONFIG_ENV]?.trim();
  if (fromEnv) {
    if (!isAbsolute(fromEnv) || basename(fromEnv) !== basename(LOCAL_CONFIG_RELATIVE_PATH)) {
      throw new Error(
        `Invalid ${LOCAL_CONFIG_ENV}="${fromEnv}": expected an absolute path to ` +
          basename(LOCAL_CONFIG_RELATIVE_PATH),
      );
    }
    return fromEnv;
  }
  return join(repositoryIdentityRoot(root), LOCAL_CONFIG_RELATIVE_PATH);
}

/** Environment that hands the local config of `rootDir` to a child process in a worktree. */
export function localConfigEnvironment(
  rootDir: string,
  env: NodeJS.ProcessEnv = process.env,
): Record<string, string> {
  const path = resolveLocalConfigPath(rootDir, env);
  return existsSync(path) ? { [LOCAL_CONFIG_ENV]: path } : {};
}

function validateRepoEntry(
  entry: unknown,
  at: string,
  sharedRepo: SpecDojoRepoConfig | undefined,
  addedRepoKeys: ReadonlySet<string>,
): string[] {
  if (!isRecord(entry)) return [`${at} must be an object with name and path`];
  const errors: string[] = [];
  const allowed = sharedRepo ? OVERRIDE_REPO_KEYS : [...addedRepoKeys];
  for (const key of Object.keys(entry).sort()) {
    if (!allowed.includes(key)) {
      errors.push(
        sharedRepo
          ? `${at}: key "${key}" cannot override shared repository "${sharedRepo.name}" ` +
              `(allowed: ${OVERRIDE_REPO_KEYS.join(", ")})`
          : `${at}: unknown key "${key}"`,
      );
    }
  }
  if (typeof entry.path !== "string" || entry.path.trim().length === 0) {
    errors.push(`${at}.path must be a non-empty string`);
  }
  return errors;
}

/**
 * Apply a parsed local config to the shared config. Shared `repos[]` entries keep their order and
 * get the local `path` when a local entry has the same `name`; other local entries are appended
 * as local repositories. Every disallowed key or type error is reported with `localPath`.
 * Semantic checks (name pattern, path existence, ...) are left to the shared validator, which
 * runs on the merged result.
 */
export function applyLocalConfig(
  shared: SpecDojoConfig,
  local: unknown,
  localPath: string,
  addedRepoKeys: ReadonlySet<string>,
): LocalConfigApplication {
  const errors: string[] = [];
  const overrides: LocalConfigOverride[] = [];
  const projects = { ...shared.projects };
  const fail = (): never => {
    throw new Error(
      `Invalid ${LOCAL_CONFIG_RELATIVE_PATH} (${localPath}):\n` +
        errors.map((message) => `  - ${message}`).join("\n"),
    );
  };

  if (!isRecord(local)) {
    errors.push("expected { version: 1, projects: { ... } }");
    return fail();
  }
  for (const key of Object.keys(local).sort()) {
    if (key !== "version" && key !== "projects") {
      errors.push(`unknown key "${key}" (allowed: version, projects)`);
    }
  }
  if (local.version !== 1) errors.push("version must be 1");
  const localProjects = local.projects ?? {};
  if (!isRecord(localProjects)) errors.push("projects must be an object");

  for (const [projectId, value] of Object.entries(isRecord(localProjects) ? localProjects : {})) {
    const at = `projects.${projectId}`;
    const sharedProject = shared.projects[projectId];
    if (!sharedProject) {
      errors.push(`${at}: project is not declared in .specdojo/specdojo.config.json`);
      continue;
    }
    if (!isRecord(value)) {
      errors.push(`${at} must be an object`);
      continue;
    }
    for (const key of Object.keys(value).sort()) {
      if (key !== "repos") errors.push(`${at}: key "${key}" cannot be overridden (allowed: repos)`);
    }
    if (value.repos === undefined) continue;
    if (!Array.isArray(value.repos)) {
      errors.push(`${at}.repos must be an array`);
      continue;
    }

    const sharedRepos = sharedProject.repos ?? [];
    const merged = sharedRepos.map((repo) => ({ ...repo }));
    const seen = new Set<string>();
    value.repos.forEach((entry: unknown, index) => {
      const entryAt = `${at}.repos[${index}]`;
      const name = isRecord(entry) ? entry.name : undefined;
      if (typeof name !== "string" || name.trim().length === 0) {
        errors.push(`${entryAt}.name must be a non-empty string`);
        return;
      }
      if (seen.has(name)) {
        errors.push(`${entryAt}.name "${name}" is declared more than once`);
        return;
      }
      seen.add(name);
      const sharedRepo = sharedRepos.find((repo) => repo.name === name);
      const entryErrors = validateRepoEntry(entry, entryAt, sharedRepo, addedRepoKeys);
      errors.push(...entryErrors);
      if (entryErrors.length > 0 || !isRecord(entry)) return;
      const path = String(entry.path);
      if (sharedRepo) {
        const target = merged.find((repo) => repo.name === name);
        if (target) target.path = path;
        overrides.push({
          project: projectId,
          repo: name,
          kind: "path",
          path,
          shared_path: sharedRepo.path,
        });
      } else {
        // validateRepoEntry checked the keys; the shared validator checks values after the merge.
        merged.push({ ...(entry as SpecDojoRepoConfig) });
        overrides.push({ project: projectId, repo: name, kind: "added", path });
      }
    });
    projects[projectId] = { ...sharedProject, repos: merged };
  }

  if (errors.length > 0) return fail();
  return { config: { ...shared, projects }, overrides };
}

/** Read the local config for `rootDir`, or null when the file does not exist. */
export function readLocalConfig(
  rootDir: string,
  env: NodeJS.ProcessEnv = process.env,
): { path: string; value: unknown } | null {
  const path = resolveLocalConfigPath(rootDir, env);
  if (!existsSync(path)) {
    if (env[LOCAL_CONFIG_ENV]?.trim() && isLinkedWorktree(rootDir)) {
      throw new Error(`${LOCAL_CONFIG_ENV} points to a missing file: ${path}`);
    }
    return null;
  }
  const raw = readFileSync(path, "utf8");
  try {
    return { path, value: JSON.parse(raw) as unknown };
  } catch (error) {
    throw new Error(
      `Invalid ${LOCAL_CONFIG_RELATIVE_PATH} (${path}): ${error instanceof Error ? error.message : String(error)}`,
      { cause: error },
    );
  }
}

/** One line per local override, for `config show` and `where exec`. */
export function formatLocalOverride(override: LocalConfigOverride): string {
  return override.kind === "path"
    ? `projects.${override.project}.repos[${override.repo}].path = ${override.path} ` +
        `(local; shared: ${override.shared_path})`
    : `projects.${override.project}.repos[${override.repo}] = ${override.path} (local; added)`;
}

/** Lines describing the local config and its overrides, for `config show` and `where`. */
export function formatLocalConfigLines(result: ConfigLoadResult, projectId?: string): string[] {
  if (!result.localConfigPath) return ["local-config: none"];
  const overrides = (result.localOverrides ?? []).filter(
    (override) => projectId === undefined || override.project === projectId,
  );
  return [
    `local-config: ${result.localConfigPath}`,
    ...overrides.map((override) => `local-override: ${formatLocalOverride(override)}`),
  ];
}

/** `config show` output: config files, then each project's repos with their source. */
export function formatConfigShow(result: ConfigLoadResult, projectId?: string): string {
  if (!result.config) return `No config found: ${result.configPath}\n`;
  const config = result.config;
  if (projectId !== undefined && !config.projects[projectId]) {
    throw new Error(`Unknown project: ${projectId} (${result.configPath})`);
  }
  const lines = [`config: ${result.configPath}`, ...formatLocalConfigLines(result, projectId)];
  const projectIds = projectId === undefined ? Object.keys(config.projects).sort() : [projectId];
  for (const id of projectIds) {
    lines.push(`project: ${id}`);
    const repos = config.projects[id].repos ?? [];
    if (repos.length === 0) lines.push("  repos: none");
    for (const repo of repos) {
      const override = result.localOverrides?.find(
        (candidate) => candidate.project === id && candidate.repo === repo.name,
      );
      const source = !override
        ? "shared"
        : override.kind === "added"
          ? "local; added"
          : `local; shared: ${override.shared_path}`;
      lines.push(`  repo ${repo.name}: ${repo.path} (${source})`);
    }
  }
  return `${lines.join("\n")}\n`;
}
