import { gitOutput, gitResult } from "./exec-worktree.js";
import { PROJECT_REPO_WORKTREE_DIRNAME } from "./shared/specdojo-config.js";

/** Name under which the project repository is recorded in `stages.integrate.repos`. */
export const PROJECT_REPO_NAME = PROJECT_REPO_WORKTREE_DIRNAME;

export function zeroSeparated(cwd: string, args: string[]): string[] {
  return gitOutput(cwd, args).split("\0").filter(Boolean);
}

export function gitText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function dirtyPaths(cwd: string): Set<string> {
  return new Set([
    ...zeroSeparated(cwd, ["diff", "--no-renames", "--name-only", "-z"]),
    ...zeroSeparated(cwd, ["diff", "--cached", "--no-renames", "--name-only", "-z"]),
    ...zeroSeparated(cwd, ["ls-files", "--others", "--exclude-standard", "-z"]),
  ]);
}

export function mergeInProgress(cwd: string): boolean {
  return gitResult(cwd, ["rev-parse", "--verify", "--quiet", "MERGE_HEAD"]).status === 0;
}

export function branchExists(repoRoot: string, branch: string): boolean {
  return (
    gitResult(repoRoot, ["rev-parse", "--verify", "--quiet", `refs/heads/${branch}`]).status === 0
  );
}
