import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { specdojoRootDir, type SpecDojoConfig } from "./specdojo-config.js";

export interface CodeWorkspaceFolder {
  name: string;
  path: string;
}

export interface CodeWorkspaceData {
  folders: CodeWorkspaceFolder[];
}

export interface WorkspaceScaffoldOptions {
  repoRoot?: string;
  projectId?: string;
  force?: boolean;
  dryRun?: boolean;
}

export interface WorkspaceScaffoldResult {
  status: "written" | "skipped";
  relativePath: string;
  absolutePath: string;
}

export function buildWorkspaceData(
  repoName: string,
  repos: ReadonlyArray<{ name: string; path: string }>,
): CodeWorkspaceData {
  return {
    folders: [
      { name: repoName, path: "." },
      ...repos.map((repo) => ({ name: repo.name, path: repo.path })),
    ],
  };
}

export function renderWorkspaceContent(
  repoName: string,
  repos: ReadonlyArray<{ name: string; path: string }>,
): string {
  const data = buildWorkspaceData(repoName, repos);
  return `${JSON.stringify(data, null, 2)}\n`;
}

export async function runWorkspaceScaffold(
  options: WorkspaceScaffoldOptions = {},
): Promise<WorkspaceScaffoldResult> {
  const repoRoot = options.repoRoot ? resolve(options.repoRoot) : specdojoRootDir();
  const configPath = join(repoRoot, ".specdojo", "specdojo.config.json");
  if (!existsSync(configPath)) {
    throw new Error(`No config found: ${configPath}`);
  }

  let config: SpecDojoConfig;
  try {
    config = JSON.parse(readFileSync(configPath, "utf8")) as SpecDojoConfig;
  } catch (error) {
    throw new Error(
      `Failed to parse config: ${configPath}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  const projectId = options.projectId || config.current_project;
  if (!projectId) {
    throw new Error("No current_project configured. Specify --project <id>.");
  }

  const project = config.projects?.[projectId];
  if (!project) {
    throw new Error(`Unknown project: ${projectId}`);
  }

  if (!project.repos || project.repos.length === 0) {
    throw new Error(
      `Project '${projectId}' has no 'repos' configured in ${configPath}. Declare 'repos' in the project configuration before scaffolding a multi-root workspace.`,
    );
  }

  const repoName = basename(repoRoot);
  const fileName = `${projectId}.code-workspace`;
  const filePath = join(repoRoot, fileName);

  if (existsSync(filePath) && !options.force) {
    if (options.dryRun) {
      process.stdout.write(
        `[dry-run] skipped: ${fileName} already exists (use --force to overwrite)\n`,
      );
    } else {
      process.stdout.write(`Skipped (already exists): ${fileName}\n`);
    }
    return {
      status: "skipped",
      relativePath: fileName,
      absolutePath: filePath,
    };
  }

  const content = renderWorkspaceContent(repoName, project.repos);

  if (options.dryRun) {
    process.stdout.write(`[dry-run] would write: ${fileName}\n`);
  } else {
    writeFileSync(filePath, content, "utf8");
    process.stdout.write(`Written: ${fileName}\n`);
  }

  return {
    status: "written",
    relativePath: fileName,
    absolutePath: filePath,
  };
}
