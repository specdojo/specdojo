import type { AsyncLock } from "./shared.js";

export type CleanupOutcome = { ok: true } | { ok: false; error: unknown };

// 統合の後の片付け（worktree と exec branch の撤去）。`run` はロックの外で走り、`after` は
// 片付けの結果を受けて、もう一度ロックの中で記帳を仕上げる。
export class DeferredCleanup<T> {
  constructor(
    readonly run: () => Promise<void> | void,
    readonly after: (outcome: CleanupOutcome) => Promise<T> | T,
  ) {}
}

function runLocked<T>(lock: AsyncLock | undefined, fn: () => Promise<T> | T): Promise<T> {
  return lock ? lock.runExclusive(fn) : Promise.resolve().then(fn);
}

// PJR-NHT7: 遅いファイルシステムでは `git worktree remove` が数十分かかる。統合と記帳は
// ロックの中で行い、片付けはロックを解放してから行う。片付けの間、別の項目の記帳や
// `specdojo git` はロックを待たない。`integrate` が DeferredCleanup 以外を返した場合は、
// それをそのまま結果にする。
export async function runWithDeferredCleanup<T>(
  lock: AsyncLock | undefined,
  integrate: () => Promise<T | DeferredCleanup<T>> | T | DeferredCleanup<T>,
): Promise<T> {
  const integrated = await runLocked(lock, integrate);
  if (!(integrated instanceof DeferredCleanup)) return integrated;
  let outcome: CleanupOutcome;
  try {
    await integrated.run();
    outcome = { ok: true };
  } catch (error) {
    outcome = { ok: false, error };
  }
  return runLocked(lock, () => integrated.after(outcome));
}
