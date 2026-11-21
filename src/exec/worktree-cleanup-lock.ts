import { join } from "node:path";
import { ensureDir } from "../shared/fs.js";
import { isLiveLock, releaseLock, tryAcquireLock, type LockHandle } from "./slot-lock.js";
import { worktreeNameFromTaskId } from "./worktree.js";

// PJR-NHT7: 統合の後の片付けは exec-lifecycle のロックの外で行う。その間に同じ項目の再実行・
// 再開・`exec worktree remove` が同じ worktree を消し始めないよう、worktree ごとのロックを取る。
// ロックは heartbeat を持つため、片付けの途中でプロセスが落ちても古くなれば次の操作が引き継ぐ。
export function worktreeCleanupLockDir(executionPath: string, worktreeTaskId: string): string {
  return join(
    executionPath,
    "exec",
    ".locks",
    "worktree-cleanup",
    worktreeNameFromTaskId(worktreeTaskId),
  );
}

export function isWorktreeCleanupInProgress(
  executionPath: string,
  worktreeTaskId: string,
): boolean {
  return isLiveLock(worktreeCleanupLockDir(executionPath, worktreeTaskId));
}

export function worktreeCleanupInProgressReason(worktreeTaskId: string): string {
  return (
    `the worktree of ${worktreeTaskId} is still being removed after its integration; ` +
    `retry after the cleanup finishes`
  );
}

// 取れなかった場合（別の片付けが進行中）は null を返す。呼び出し側は片付けを始めない。
export function tryAcquireWorktreeCleanupLock(
  executionPath: string,
  worktreeTaskId: string,
  actor: string,
): LockHandle | null {
  const lockDir = worktreeCleanupLockDir(executionPath, worktreeTaskId);
  ensureDir(join(lockDir, ".."));
  return tryAcquireLock(lockDir, { actor, label: `worktree cleanup ${worktreeTaskId}` });
}

export function releaseWorktreeCleanupLock(handle: LockHandle): void {
  releaseLock(handle);
}
