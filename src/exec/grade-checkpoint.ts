import { resolve } from "node:path";
import { repoRelative, worktreeStatusPaths } from "../shared/git.js";

/** Include canonical grade sidecars, including deletions, in the execution checkpoint. */
export function gradeCheckpointPaths(context: {
  repoRoot: string;
  executionPath: string;
}): string[] {
  const execution = repoRelative(context.repoRoot, context.executionPath);
  return worktreeStatusPaths(context.repoRoot)
    .filter((path) => isGradeCheckpointPath(path, execution))
    .map((path) => resolve(context.repoRoot, path));
}

export function isGradeCheckpointPath(path: string, execution: string): boolean {
  return ["results", "criteria", "pipeline"].some((kind) =>
    path.startsWith(`${execution}/grade/${kind}/`),
  );
}
