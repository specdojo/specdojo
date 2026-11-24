import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  getProjectCatalogPath,
  getProjectTimelinePath,
  getProjectSchedulePath,
  getProjectRegisterPath,
  loadConfig,
  loadEnv,
  specdojoRootDir,
} from "../shared/specdojo-config.js";

function resolveTimelinePaths(opts: { project?: string }): {
  timelinePath: string;
  catalogPath: string | null;
  schedulePath: string;
  repoRoot: string;
  projectId: string;
  registerPath?: string;
} {
  loadEnv();
  const { config, configPath } = loadConfig();
  const baseDir = specdojoRootDir();

  const projectId =
    opts.project?.trim() ||
    process.env.SPECDOJO_PROJECT?.trim() ||
    (config ? Object.keys(config.projects)[0] : "");

  if (!config) {
    throw new Error(`timeline commands require specdojo.config.json.\nRun: specdojo config init`);
  }
  if (!projectId) {
    throw new Error(`No project specified. Use --project <id> or SPECDOJO_PROJECT.`);
  }

  const project = config.projects[projectId];
  if (!project) {
    throw new Error(`Unknown project: ${projectId} (check ${configPath})`);
  }

  const catalogPath = getProjectCatalogPath(project);
  const registerPath = getProjectRegisterPath(project);

  return {
    timelinePath: resolve(baseDir, getProjectTimelinePath(project)),
    schedulePath: resolve(baseDir, getProjectSchedulePath(project)),
    repoRoot: baseDir,
    projectId,
    catalogPath: catalogPath ? resolve(baseDir, catalogPath) : null,
    ...(registerPath ? { registerPath: resolve(baseDir, registerPath) } : {}),
  };
}

function printCommandError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  process.stdout.write(message + "\n");
  process.exitCode = 1;
}

export function printTimelinePaths(opts: { project?: string }): void {
  try {
    const { timelinePath, catalogPath } = resolveTimelinePaths(opts);
    process.stdout.write(`timeline-path: ${timelinePath}\n`);
    process.stdout.write(`catalog-path: ${catalogPath ?? "(not configured)"}\n`);

    const indexFile = join(timelinePath, "tml-index.yaml");
    process.stdout.write(
      `tml-index: ${indexFile}${existsSync(indexFile) ? "" : " (does not exist)"}\n`,
    );
  } catch (error) {
    printCommandError(error);
  }
}
