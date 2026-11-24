import { resolve } from "node:path";
import { repoRelative, worktreeStatusPaths } from "../shared/git.js";

/** Include canonical grade sidecars, including deletions, in the execution checkpoint. */
export function gradeCheckpointPaths(
  context: {
    repoRoot: string;
    executionPath: string;
  },
  /**
   * When given, result sidecars are limited to these repo-relative paths (the task's own
   * subjects). Other samples' root-side results stay at root, so parallel tasks do not each carry
   * and later conflict on the same sidecar (PJR-A54F).
   */
  ownResultPaths?: readonly string[],
): string[] {
  const execution = repoRelative(context.repoRoot, context.executionPath);
  const own = ownResultPaths ? new Set(ownResultPaths) : undefined;
  return worktreeStatusPaths(context.repoRoot)
    .filter((path) => isGradeCheckpointPath(path, execution))
    .filter((path) => !own || !path.startsWith(`${execution}/grade/results/`) || own.has(path))
    .map((path) => resolve(context.repoRoot, path));
}

export function isGradeCheckpointPath(path: string, execution: string): boolean {
  return ["results", "criteria", "pipeline"].some((kind) =>
    path.startsWith(`${execution}/grade/${kind}/`),
  );
}
