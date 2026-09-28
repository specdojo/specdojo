import { join } from "node:path";
import { ensureDir } from "./exec-shared.js";
import {
  delay,
  formatLockOwner,
  isLiveLock,
  LOCK_HEARTBEAT_MS,
  LOCK_POLL_MS,
  LOCK_STALE_MS,
  livePoolHolders,
  readLockOwner,
  releaseLock,
  tryAcquireLock,
  tryAcquirePoolSlot,
  type LockHandle,
} from "./exec-slot-lock.js";

export type ExecRunBusyPolicy = "skip" | "wait" | "fail";

export type ExecRunLockOptions = {
  actor: string;
  ifBusy: ExecRunBusyPolicy;
  // Whether this run tolerates `--join` runs next to it. Only runs whose shared resources are
  // coordinated across processes (register runs in worktree mode) may set this.
  shareable?: boolean;
  // Join a running shareable run instead of requiring exclusive access. `limit` is the number of
  // join slots (the total number of concurrent runs minus the primary one).
  join?: { limit: number };
  heartbeatMs?: number;
  staleMs?: number;
  pollMs?: number;
  onWait?: () => void;
};

export type ExecRunLockHandle = LockHandle;

export const EXEC_RUN_LOCK_HEARTBEAT_MS = LOCK_HEARTBEAT_MS;
export const EXEC_RUN_LOCK_STALE_MS = LOCK_STALE_MS;
export const EXEC_RUN_LOCK_TOKEN_ENV = "SPECDOJO_EXEC_RUN_LOCK_TOKEN";
export const ROUTINE_EXEC_ENV = "SPECDOJO_ROUTINE_EXEC";
export const ROUTINE_BUSY_SKIP_EXIT_CODE = 75;

export class ExecRunBusyError extends Error {
  constructor(
    public readonly lockDir: string,
    public readonly owner: string,
  ) {
    super(`Exec run is busy for this project.\nLock: ${lockDir}\nOwner: ${owner}`);
    this.name = "ExecRunBusyError";
  }
}

export function execLocksDir(executionPath: string): string {
  return join(executionPath, "exec", ".locks");
}

export function execRunLockPath(executionPath: string): string {
  return join(execLocksDir(executionPath), "exec-run.lock");
}

// `--join` runs hold one of these slots instead of the primary exec-run.lock.
export function execRunJoinPoolPath(executionPath: string): string {
  return join(execLocksDir(executionPath), "exec-run-join");
}

export function inheritsExecRunLock(executionPath: string): boolean {
  const inheritedToken = process.env[EXEC_RUN_LOCK_TOKEN_ENV];
  if (!inheritedToken) return false;
  if (readLockOwner(execRunLockPath(executionPath))?.token === inheritedToken) return true;
  return livePoolHolders(execRunJoinPoolPath(executionPath)).some(
    (slot) => slot.owner?.token === inheritedToken,
  );
}

function describeHolders(executionPath: string, staleMs: number): string {
  const primary = execRunLockPath(executionPath);
  const lines: string[] = [];
  if (isLiveLock(primary, staleMs)) lines.push(formatLockOwner(primary));
  for (const slot of livePoolHolders(execRunJoinPoolPath(executionPath), staleMs)) {
    lines.push(`${slot.name}: ${slot.owner ? JSON.stringify(slot.owner) : "(owner unavailable)"}`);
  }
  return lines.length > 0 ? lines.join("\n") : "(owner metadata unavailable)";
}

// Acquisition without `--join` keeps the historical behaviour: the primary lock is taken, and a
// live `--join` run that outlived its primary counts as busy for a non-shareable run. The check
// runs after taking the primary lock, and joiners check the primary after taking their slot, so
// a non-shareable run and a joiner can never both proceed. A shareable primary coordinates its
// shared resources across processes, so live joiners do not block it.
function tryAcquireExclusive(
  executionPath: string,
  opts: ExecRunLockOptions,
  staleMs: number,
): ExecRunLockHandle | null {
  const shareable = opts.shareable ?? false;
  const handle = tryAcquireLock(
    execRunLockPath(executionPath),
    { actor: opts.actor, shareable },
    { heartbeatMs: opts.heartbeatMs, staleMs },
  );
  if (!handle) return null;
  if (shareable) return handle;
  if (livePoolHolders(execRunJoinPoolPath(executionPath), staleMs).length === 0) return handle;
  releaseLock(handle);
  return null;
}

function tryAcquireJoin(
  executionPath: string,
  opts: ExecRunLockOptions,
  limit: number,
  staleMs: number,
): ExecRunLockHandle | null {
  if (limit < 1) return null;
  const handle = tryAcquirePoolSlot(
    execRunJoinPoolPath(executionPath),
    limit,
    { actor: opts.actor, shareable: true },
    { heartbeatMs: opts.heartbeatMs, staleMs },
  );
  if (!handle) return null;
  const primary = execRunLockPath(executionPath);
  // The primary run must tolerate joiners. Owners written by older versions carry no
  // `shareable` field and are treated as exclusive.
  if (!isLiveLock(primary, staleMs) || readLockOwner(primary)?.shareable === true) return handle;
  releaseLock(handle);
  return null;
}

export async function acquireExecRunLock(
  executionPath: string,
  opts: ExecRunLockOptions,
): Promise<ExecRunLockHandle | null> {
  ensureDir(execLocksDir(executionPath));
  const staleMs = opts.staleMs ?? EXEC_RUN_LOCK_STALE_MS;
  const pollMs = opts.pollMs ?? LOCK_POLL_MS;
  let waitingAnnounced = false;

  while (true) {
    const handle = opts.join
      ? tryAcquireJoin(executionPath, opts, opts.join.limit, staleMs)
      : tryAcquireExclusive(executionPath, opts, staleMs);
    if (handle) return handle;

    if (opts.ifBusy === "skip") return null;
    if (opts.ifBusy === "fail") {
      throw new ExecRunBusyError(
        opts.join ? execRunJoinPoolPath(executionPath) : execRunLockPath(executionPath),
        describeHolders(executionPath, staleMs),
      );
    }
    if (!waitingAnnounced) {
      opts.onWait?.();
      waitingAnnounced = true;
    }
    await delay(pollMs);
  }
}

export function releaseExecRunLock(handle: ExecRunLockHandle): void {
  releaseLock(handle);
}

// Serializes the register lifecycle steps that write the root worktree (start transition,
// checkpoint, merge, wait commit, view rebuild) across every exec run of the project.
export function execLifecyclePoolPath(executionPath: string): string {
  return join(execLocksDir(executionPath), "exec-lifecycle");
}

export type ExecLockUsageEntry = {
  name: string;
  path: string;
  limit: number;
  holders: string[];
};

function describeSlotOwner(slot: {
  name: string;
  owner: { actor: string; pid: number; label?: string; acquired_at_utc: string } | null;
}): string {
  if (!slot.owner) return `${slot.name}: (owner unavailable)`;
  const label = slot.owner.label ? ` ${slot.owner.label}` : "";
  return `${slot.name}: ${slot.owner.actor}${label} (pid ${slot.owner.pid}, since ${slot.owner.acquired_at_utc})`;
}

/**
 * Current usage of the project's cross-process locks. `pools` lists additional slot pools
 * (provider caps, parent validations) with their configured limits. Stale slots whose heartbeat
 * stopped are not counted.
 */
export function collectExecLockUsage(
  executionPath: string,
  params: {
    joinLimit: number;
    pools: readonly { name: string; path: string; limit: number }[];
    staleMs?: number;
  },
): ExecLockUsageEntry[] {
  const staleMs = params.staleMs ?? EXEC_RUN_LOCK_STALE_MS;
  const primary = execRunLockPath(executionPath);
  const primaryOwner = isLiveLock(primary, staleMs) ? readLockOwner(primary) : null;
  const primaryHolders = isLiveLock(primary, staleMs)
    ? [
        primaryOwner
          ? `${primaryOwner.actor} (pid ${primaryOwner.pid}, since ${primaryOwner.acquired_at_utc}, ${primaryOwner.shareable === true ? "joinable" : "exclusive"})`
          : "(owner unavailable)",
      ]
    : [];
  const pool = (name: string, path: string, limit: number): ExecLockUsageEntry => ({
    name,
    path,
    limit,
    holders: livePoolHolders(path, staleMs).map(describeSlotOwner),
  });
  return [
    { name: "exec run (primary)", path: primary, limit: 1, holders: primaryHolders },
    pool("exec run (--join)", execRunJoinPoolPath(executionPath), params.joinLimit),
    pool("register lifecycle", execLifecyclePoolPath(executionPath), 1),
    ...params.pools.map((entry) => pool(entry.name, entry.path, entry.limit)),
  ];
}

export function formatExecLockUsage(entries: readonly ExecLockUsageEntry[]): string {
  const lines: string[] = [];
  for (const entry of entries) {
    lines.push(`${entry.name}: ${entry.holders.length}/${entry.limit}`);
    for (const holder of entry.holders) lines.push(`  ${holder}`);
  }
  return `${lines.join("\n")}\n`;
}
