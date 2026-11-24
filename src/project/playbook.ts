import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { Command } from "commander";
import { flattenTemplateFrontmatter } from "../docs/template-frontmatter.js";
import { resolveSpecdojoTemplatePath } from "../docs/template-resolution.js";
import {
  getProjectPlaybookPath,
  loadConfig,
  loadEnv,
  specdojoRootDir,
} from "../shared/specdojo-config.js";

const PLAYBOOK_TEMPLATE_FILE = "pm-orchestrator-playbook-template.md";

export interface PlaybookPaths {
  projectId: string;
  playbookPath: string;
}

function printCommandError(error: unknown): void {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}

export function resolvePlaybookPaths(opts: { project?: string }): PlaybookPaths {
  loadEnv();
  const { config, configPath } = loadConfig();
  if (!config) {
    throw new Error("playbook commands require specdojo.config.json.\nRun: specdojo config init");
  }
  const projectId =
    opts.project?.trim() ||
    process.env.SPECDOJO_PROJECT?.trim() ||
    config.current_project?.trim() ||
    Object.keys(config.projects)[0] ||
    "";
  if (!projectId) {
    throw new Error("No project specified. Use --project <id> or SPECDOJO_PROJECT.");
  }
  const project = config.projects[projectId];
  if (!project) {
    throw new Error(`Unknown project: ${projectId} (check ${configPath})`);
  }
  return {
    projectId,
    playbookPath: resolve(specdojoRootDir(), getProjectPlaybookPath(project)),
  };
}

export function printPlaybookPaths(opts: { project?: string }): void {
  try {
    const paths = resolvePlaybookPaths(opts);
    const note = existsSync(paths.playbookPath) ? "" : " (does not exist)";
    process.stdout.write(`project:  ${paths.projectId}\n`);
    process.stdout.write(`playbook: ${paths.playbookPath}${note}\n`);
  } catch (error) {
    printCommandError(error);
  }
}

/** Fill the template's generation-time placeholders; the remaining `_TODO_` slots stay for authors. */
export function renderPlaybookTemplate(rawTemplate: string, projectId: string): string {
  return flattenTemplateFrontmatter(rawTemplate)
    .replace(/_PROJECT_ID_/g, projectId)
    .replace(/_PROJECT_NAME_/g, projectId);
}

export interface PlaybookScaffoldResult {
  path: string;
  content: string;
  created: boolean;
}

export function scaffoldPlaybook(
  paths: PlaybookPaths,
  options: { dryRun?: boolean; templatePath?: string } = {},
): PlaybookScaffoldResult {
  if (existsSync(paths.playbookPath)) {
    throw new Error(`Playbook already exists (not overwritten): ${paths.playbookPath}`);
  }
  const templatePath = options.templatePath ?? resolveSpecdojoTemplatePath(PLAYBOOK_TEMPLATE_FILE);
  const content = renderPlaybookTemplate(readFileSync(templatePath, "utf8"), paths.projectId);
  if (options.dryRun) return { path: paths.playbookPath, content, created: false };
  mkdirSync(dirname(paths.playbookPath), { recursive: true });
  writeFileSync(paths.playbookPath, content, { encoding: "utf8", flag: "wx" });
  return { path: paths.playbookPath, content, created: true };
}

export function registerPlaybookCommands(program: Command): void {
  const playbook = program
    .command("playbook")
    .description("Orchestrator playbook (operations notes) helpers");
  playbook
    .command("scaffold")
    .description("Create the playbook from the template at the path `where playbook` prints")
    .option("--project <projectId>", "Project id in specdojo.config.json")
    .option("--dry-run", "Print the generated content without writing", false)
    .action((opts: { project?: string; dryRun?: boolean }) => {
      try {
        const result = scaffoldPlaybook(resolvePlaybookPaths(opts), { dryRun: opts.dryRun });
        if (result.created) process.stdout.write(`Created: ${result.path}\n`);
        else process.stdout.write(`=== ${result.path} ===\n${result.content}\n`);
      } catch (error) {
        printCommandError(error);
      }
    });
}
