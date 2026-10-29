import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { gitOutput, gitResult, worktreeStatusPaths } from "../shared/git.js";
import {
  loadConfig,
  resolveExternalProjectRoot,
  specdojoRootDir,
  type SpecDojoConfig,
  type SpecDojoProjectConfig,
} from "../shared/specdojo-config.js";

const CROSS_PROJECT_TRANSITIONS = new Set([
  "start",
  "wait",
  "review",
  "close",
  "reject",
  "defer",
  "reopen",
]);

export function resolveProjectIntegrationBranch(
  projectId: string,
  project: Pick<SpecDojoProjectConfig, "integration_branch">,
): string {
  return project.integration_branch?.trim() || `project/${projectId}/develop`;
}

function currentBranch(repoRoot: string): string | undefined {
  const result = gitResult(repoRoot, ["symbolic-ref", "--quiet", "--short", "HEAD"]);
  // register の既存単体利用は Git 初期化前でも許している。branch を読めない場所では
  // current_project へフォールバックし、別 project の記帳を選んだときだけ Git を必須にする。
  if (result.status !== 0) return undefined;
  return typeof result.stdout === "string" ? result.stdout.trim() : undefined;
}

function worktreeForBranch(repoRoot: string, branch: string): string | undefined {
  const output = gitOutput(repoRoot, ["worktree", "list", "--porcelain"]);
  let path: string | undefined;
  for (const line of output.split(/\r?\n/)) {
    if (line.startsWith("worktree ")) {
      path = resolve(line.slice("worktree ".length));
    } else if (line === `branch refs/heads/${branch}`) {
      return path;
    } else if (line === "") {
      path = undefined;
    }
  }
  return undefined;
}

function requireLocalBranch(repoRoot: string, projectId: string, branch: string): void {
  const result = gitResult(repoRoot, ["show-ref", "--verify", "--quiet", `refs/heads/${branch}`]);
  if (result.status === 0) return;
  if (result.status === 1) {
    throw new Error(
      `Integration branch for project ${projectId} does not exist locally: ${branch}`,
    );
  }
  throw new Error(`Failed to inspect integration branch for project ${projectId}: ${branch}`);
}

function configuredCurrentProject(
  config: SpecDojoConfig,
  branch: string | undefined,
): string | undefined {
  const projectIds = Object.keys(config.projects).sort((left, right) => right.length - left.length);
  if (branch) {
    const exact = projectIds.find(
      (projectId) =>
        resolveProjectIntegrationBranch(projectId, config.projects[projectId]) === branch,
    );
    if (exact) return exact;
    const named = projectIds.find(
      (projectId) =>
        branch.startsWith(`feature/${projectId}/`) || branch.startsWith(`exec/${projectId}-`),
    );
    if (named) return named;
  }
  return config.current_project?.trim() || projectIds[0];
}

export type CrossProjectMutationTarget = {
  projectId: string;
  branch: string;
};

export function assertCrossProjectMutationAllowed(
  command: string,
  projectId: string,
  commit: boolean | undefined,
): void {
  if (command !== "add") {
    if (CROSS_PROJECT_TRANSITIONS.has(command)) {
      throw new Error(
        `Cross-project register ${command} is not supported for ${projectId}. ` +
          `Run the command in the worktree for project ${projectId}.`,
      );
    }
    throw new Error(
      `Cross-project register ${command} is not supported for ${projectId}. ` +
        `Only register add --project ${projectId} --commit can write to another project.`,
    );
  }
  if (!commit) {
    throw new Error(
      `Cross-project register add requires --commit so the item is not left in another worktree.`,
    );
  }
}

export function resolveCrossProjectMutationTarget(
  command: string,
  opts: { project?: string; commit?: boolean },
): CrossProjectMutationTarget | undefined {
  const projectId = opts.project?.trim();
  if (!projectId) return undefined;

  const repoRoot = specdojoRootDir();
  const { config, configPath } = loadConfig(repoRoot);
  if (!config) throw new Error(`register commands require specdojo.config.json (${configPath})`);
  const project = config.projects[projectId];
  if (!project) {
    const externalProject = config.external_projects?.[projectId];
    if (externalProject) {
      const targetRoot = resolveExternalProjectRoot(repoRoot, externalProject);
      throw new Error(
        `Cross-repository register ${command} is not supported for external project ${projectId}. ` +
          `Run the command in ${targetRoot} for project ${externalProject.project_id}.`,
      );
    }
    throw new Error(`Unknown project: ${projectId} (check ${configPath})`);
  }

  const branch = resolveProjectIntegrationBranch(projectId, project);
  const branchNow = currentBranch(repoRoot);
  if (branchNow === branch) return undefined;
  if (configuredCurrentProject(config, branchNow) === projectId) return undefined;

  assertCrossProjectMutationAllowed(command, projectId, opts.commit);
  requireLocalBranch(repoRoot, projectId, branch);
  return { projectId, branch };
}

function removeTemporaryWorktree(repoRoot: string, path: string, parent: string): void {
  gitOutput(repoRoot, ["worktree", "remove", path]);
  rmSync(parent, { recursive: true, force: true });
}

export async function inCrossProjectWorktree<T>(
  target: CrossProjectMutationTarget,
  operation: () => Promise<T>,
): Promise<T> {
  const repoRoot = specdojoRootDir();
  const existing = worktreeForBranch(repoRoot, target.branch);
  const temporaryParent = existing
    ? undefined
    : mkdtempSync(join(tmpdir(), `specdojo-register-${target.projectId}-`));
  const worktreePath = existing ?? join(temporaryParent!, "worktree");
  if (!existing) {
    try {
      gitOutput(repoRoot, ["worktree", "add", worktreePath, target.branch]);
    } catch (error) {
      rmSync(temporaryParent!, { recursive: true, force: true });
      throw error;
    }
  }

  const originalDirectory = process.cwd();
  let succeeded = false;
  try {
    process.chdir(worktreePath);
    const result = await operation();
    succeeded = true;
    return result;
  } finally {
    process.chdir(originalDirectory);
    if (temporaryParent && succeeded) {
      removeTemporaryWorktree(repoRoot, worktreePath, temporaryParent);
    } else if (temporaryParent && worktreeStatusPaths(worktreePath).length === 0) {
      removeTemporaryWorktree(repoRoot, worktreePath, temporaryParent);
    }
  }
}
