export {
  REGISTER_NEW_FILE_DIR_PREFIXES,
  ROOT_NEW_FILES_HANDOFF_LABEL,
  applyRootNewFilesHandoff,
  assertResultMarkdownlint,
  commitTargetPaths,
  commitWorktreeChanges,
  currentBranch,
  deliverableStatus,
  isCommitTargetPath,
  normalizeResultWhitespace,
  partitionCommitTargets,
  recordRootNewFilesHandoff,
  repoRelative,
  resolveCommitScope,
  selectStageablePaths,
  stabilizeCommitTargets,
  stageCommitTargets,
  taskPaths,
  taskTargetsAtHead,
  unstageCommitTargets,
  worktreeStatusPaths,
} from "./worktree-ops-commit.js";
export type { CommitScope, WorktreeOpsContext } from "./worktree-ops-commit.js";
export {
  abortMerge,
  isExecBranchMergedIntoCurrent,
  mergeWorktreeIntoCurrent,
  releaseRootWorkingCopies,
  restoreRootWorkingCopies,
} from "./worktree-ops-merge.js";
export {
  WorktreeRemovedBranchDeletionError,
  checkpointAndEnsureWorktree,
  discardStaleExecWorktree,
  listOrphanedExecBranches,
  pruneOrphanedExecBranches,
  removeWorktree,
} from "./worktree-ops-lifecycle.js";
export type { OrphanedExecBranch } from "./worktree-ops-lifecycle.js";
