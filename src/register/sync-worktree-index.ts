import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { readSpecdojoNamespace } from "../shared/frontmatter-namespace.js";
import { getProjectRegisterPath, loadConfig } from "../shared/specdojo-config.js";
import { resolveRegisterPaths } from "./core.js";
import { writeDerivedViews } from "./views.js";

function hasValidRegisterIndex(registerDir: string): boolean {
  const index = join(registerDir, "generated", "pjr-index.md");
  if (!existsSync(index)) return false;
  try {
    const id = readSpecdojoNamespace(readFileSync(index, "utf8")).id;
    return typeof id === "string" && id.endsWith(":pjr-index");
  } catch {
    return false;
  }
}

/**
 * Generates the git-ignored register views in a sync worktree before it commits (PJR-MACP).
 * The worktree of a sync branch starts without `generated/pjr-index.md`, and a pre-commit
 * `index build` then rejects the commit. Only registers whose index is missing or invalid are
 * built, so repeated commits in the same worktree do not rebuild the views. A build failure is
 * reported as a warning and the commit proceeds: repositories without such a hook do not need
 * the views, and repositories with it still report the hook's own error.
 */
export function ensureSyncWorktreeRegisterIndexes(worktree: string): string[] {
  const { config } = loadConfig(worktree);
  if (!config) return [];
  const built: string[] = [];
  for (const projectId of Object.keys(config.projects).sort()) {
    const registerPath = getProjectRegisterPath(config.projects[projectId]!);
    if (!registerPath) continue;
    const registerDir = resolve(worktree, registerPath);
    if (!existsSync(registerDir) || hasValidRegisterIndex(registerDir)) continue;
    // Register path resolution and cross-project relations read the root from the cwd.
    const originalDirectory = process.cwd();
    try {
      process.chdir(worktree);
      writeDerivedViews(resolveRegisterPaths({ project: projectId }), "all");
      built.push(projectId);
    } catch (error) {
      const cause = error instanceof Error ? error.message : String(error);
      process.stderr.write(
        `Warning: could not build register views for ${projectId} in sync worktree ${worktree}: ${cause}\n`,
      );
    } finally {
      process.chdir(originalDirectory);
    }
  }
  return built;
}
