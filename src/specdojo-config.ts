import { type Command } from "commander";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import dotenv from "dotenv";
import yaml from "js-yaml";
import type { AgentStageRole, SchedulerStrategy, TaskMode } from "./exec-types.js";
import { runProviderScaffold, specdojoPackageRootDir } from "./exec-provider-scaffold.js";

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
  run?: SpecDojoRunConfig;
};

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

  return { configPath, config: parsed };
}

export function writeConfig(config: SpecDojoConfig): void {
  const configPath = defaultConfigPath();
  mkdirSync(dirname(configPath), { recursive: true });
  writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n", "utf8");
}

export function registerConfigCommands(program: Command): void {
  const cfg = program
    .command("config")
    .description("Config helpers (.specdojo/specdojo.config.json)");

  cfg
    .command("init")
    .description("Create .specdojo/specdojo.config.json template (does not overwrite existing)")
    .action(() => {
      const { configPath, config } = loadConfig();
      if (config) {
        process.stdout.write(`Already exists: ${configPath}\n`);
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
      writeConfig(template);
      process.stdout.write(`Created: ${configPath}\n`);
      process.stdout.write(
        "Next steps:\n" +
          "  1. Keep this repository beside the product repository as app1-specdojo/.\n" +
          "  2. Review the project ID and paths; worktrees default to ../app1-worktrees.\n" +
          "  3. Optional agent setup: npx specdojo config scaffold --provider <name>\n" +
          "  4. Create a register: npx specdojo register scaffold --project prj-0001\n" +
          `  5. Before using catalog or schedule, add the required paths: ${SPECDOJO_CONFIG_REFERENCE_URL}\n`,
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
    .action(async (opts) => {
      try {
        await runProviderScaffold(String(opts.provider), {
          packageRoot: specdojoPackageRootDir(),
          repoRoot: specdojoRootDir(),
          force: !!opts.force,
          dryRun: !!opts.dryRun,
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
