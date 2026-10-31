/** Commit types supported by register items and their configured defaults. */
export const VALID_COMMIT_TYPES = [
  "feat",
  "fix",
  "docs",
  "refactor",
  "test",
  "chore",
  "perf",
  "build",
  "ci",
  "style",
  "revert",
] as const;

export type CommitType = (typeof VALID_COMMIT_TYPES)[number];

export const COMMIT_SCOPE_RE = /^[a-z0-9][a-z0-9-]*$/;
