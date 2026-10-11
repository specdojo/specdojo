import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  utimesSync,
} from "node:fs";
import { spawn, type ChildProcess } from "node:child_process";
import { join } from "node:path";
import { ensureDir, nowUtcIsoSeconds, randomHex, writeJson } from "./exec-shared.js";

// Cross-process locks and counting semaphores built on atomic `mkdir`. Every held lock is a
// directory with an `owner.json` and a detached heartbeat process that keeps its mtime fresh.
// A lock whose heartbeat stopped (the owner crashed) becomes stale after `staleMs` and may be
// taken over. A pool is a directory of numbered slot locks (`slot-1` … `slot-<limit>`).

export const LOCK_HEARTBEAT_MS = 5_000;
export const LOCK_STALE_MS = 30_000;
export const LOCK_POLL_MS = 200;

// The lock directory of the project whose exec-run lock this process holds. Gates that are
// reached through many call paths (parent validations) read it instead of having the directory
// threaded through every caller. One `exec run` process serves one project.
let activeExecLocksDir: string | undefined;

export function setActiveExecLocksDir(dir: string | undefined): void {
  activeExecLocksDir = dir;
}

export function getActiveExecLocksDir(): string | undefined {
  return activeExecLocksDir;
}

export type LockOwner = {
  actor: string;
  pid: number;
  token: string;
  acquired_at_utc: string;
  // Free-form description of what the holder is doing (item ID, validation label, ...).
  label?: string;
  // exec-run lock only: whether the holder tolerates `--join` runs next to it.
  shareable?: boolean;
};

export type LockOwnerInput = {
  actor: string;
  label?: string;
  shareable?: boolean;
};

export type LockHandle = {
  lockDir: string;
  token: string;
  heartbeat: ChildProcess;
};

export type LockTimingOptions = {
  heartbeatMs?: number;
  staleMs?: number;
};

export type PoolSlotStatus = {
  name: string;
  lockDir: string;
  owner: LockOwner | null;
  ageMs: number;
  stale: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function readLockOwner(lockDir: string): LockOwner | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(join(lockDir, "owner.json"), "utf8"));
  } catch {
    return null;
  }
  if (!isRecord(parsed)) return null;
  const { actor, pid, token, acquired_at_utc: acquiredAt, label, shareable } = parsed;
  if (typeof actor !== "string" || typeof pid !== "number" || typeof token !== "string") {
    return null;
  }
  return {
    actor,
    pid,
    token,
    acquired_at_utc: typeof acquiredAt === "string" ? acquiredAt : "",
    ...(typeof label === "string" ? { label } : {}),
    ...(typeof shareable === "boolean" ? { shareable } : {}),
  };
}

export function formatLockOwner(lockDir: string): string {
  const owner = readLockOwner(lockDir);
  return owner ? JSON.stringify(owner) : "(owner metadata unavailable)";
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const HEARTBEAT_SCRIPT = String.raw`
const fs = require("node:fs");
const path = require("node:path");
const [lockDir, token, intervalText, parentText] = process.argv.slice(1);
const ownerPath = path.join(lockDir, "owner.json");
const intervalMs = Number(intervalText);
const parentPid = Number(parentText);
function heartbeat() {
  try {
    process.kill(parentPid, 0);
    const owner = JSON.parse(fs.readFileSync(ownerPath, "utf8"));
    if (owner.token !== token) process.exit(0);
    const now = new Date();
    fs.utimesSync(lockDir, now, now);
  } catch {
    process.exit(0);
  }
}
heartbeat();
setInterval(heartbeat, intervalMs);
`;

function startHeartbeat(lockDir: string, token: string, intervalMs: number): ChildProcess {
  // A separate process keeps the heartbeat alive while the runner is inside spawnSync-based
  // validate / refresh / git operations. It exits when the owner PID or token disappears.
  const heartbeat = spawn(
    process.execPath,
    ["-e", HEARTBEAT_SCRIPT, lockDir, token, String(intervalMs), String(process.pid)],
    { detached: true, stdio: "ignore" },
  );
  heartbeat.unref();
  return heartbeat;
}

function lockAgeMs(lockDir: string): number | null {
  try {
    return Date.now() - statSync(lockDir).mtimeMs;
  } catch (error) {
    if ((error as NodeJS.ErrnoException | null)?.code === "ENOENT") return null;
    throw error;
  }
}

/** Removes the lock when its heartbeat stopped. Returns true when the lock no longer exists. */
export function tryRemoveStaleLock(lockDir: string, staleMs: number = LOCK_STALE_MS): boolean {
  const ageMs = lockAgeMs(lockDir);
  if (ageMs === null) return true;
  if (ageMs <= staleMs) return false;

  const staleDir = `${lockDir}.stale-${process.pid}-${randomHex(4)}`;
  try {
    // Rename first so a competing process can never make us delete its newly acquired lock.
    renameSync(lockDir, staleDir);
  } catch (error) {
    if ((error as NodeJS.ErrnoException | null)?.code === "ENOENT") return true;
    throw error;
  }
  rmSync(staleDir, { recursive: true, force: true });
  return true;
}

/** True when the lock exists and its heartbeat is fresh. */
export function isLiveLock(lockDir: string, staleMs: number = LOCK_STALE_MS): boolean {
  const ageMs = lockAgeMs(lockDir);
  return ageMs !== null && ageMs <= staleMs;
}

/** Creates the lock directory atomically. Returns null when another holder already owns it. */
export function tryCreateLock(
  lockDir: string,
  owner: LockOwnerInput,
  heartbeatMs: number = LOCK_HEARTBEAT_MS,
): LockHandle | null {
  try {
    mkdirSync(lockDir);
  } catch (error) {
    if ((error as NodeJS.ErrnoException | null)?.code === "EEXIST") return null;
    throw error;
  }
  const token = `${process.pid}-${randomHex(8)}`;
  writeJson(join(lockDir, "owner.json"), {
    actor: owner.actor,
    pid: process.pid,
    token,
    acquired_at_utc: nowUtcIsoSeconds(),
    ...(owner.label !== undefined ? { label: owner.label } : {}),
    ...(owner.shareable !== undefined ? { shareable: owner.shareable } : {}),
  } satisfies LockOwner);
  const now = new Date();
  utimesSync(lockDir, now, now);
  return { lockDir, token, heartbeat: startHeartbeat(lockDir, token, heartbeatMs) };
}

/** Tries once, taking over a stale lock if necessary. */
export function tryAcquireLock(
  lockDir: string,
  owner: LockOwnerInput,
  timing: LockTimingOptions = {},
): LockHandle | null {
  const heartbeatMs = timing.heartbeatMs ?? LOCK_HEARTBEAT_MS;
  const handle = tryCreateLock(lockDir, owner, heartbeatMs);
  if (handle) return handle;
  if (!tryRemoveStaleLock(lockDir, timing.staleMs ?? LOCK_STALE_MS)) return null;
  return tryCreateLock(lockDir, owner, heartbeatMs);
}

export function releaseLock(handle: LockHandle): void {
  handle.heartbeat.kill();
  if (!existsSync(handle.lockDir)) return;
  if (readLockOwner(handle.lockDir)?.token !== handle.token) return;
  rmSync(handle.lockDir, { recursive: true, force: true });
}

export function poolSlotPath(poolDir: string, index: number): string {
  return join(poolDir, `slot-${index}`);
}

/** Takes the first free slot among `slot-1` … `slot-<limit>`. Returns null when all are held. */
export function tryAcquirePoolSlot(
  poolDir: string,
  limit: number,
  owner: LockOwnerInput,
  timing: LockTimingOptions = {},
): LockHandle | null {
  ensureDir(poolDir);
  for (let index = 1; index <= limit; index++) {
    const handle = tryAcquireLock(poolSlotPath(poolDir, index), owner, timing);
    if (handle) return handle;
  }
  return null;
}

export type WaitOptions = LockTimingOptions & {
  pollMs?: number;
  // Called once, the first time the caller has to wait.
  onWait?: () => void;
};

/** Waits until one of the pool slots is free and takes it. */
export async function acquirePoolSlot(
  poolDir: string,
  limit: number,
  owner: LockOwnerInput,
  options: WaitOptions = {},
): Promise<LockHandle> {
  const pollMs = options.pollMs ?? LOCK_POLL_MS;
  let waitingAnnounced = false;
  while (true) {
    const handle = tryAcquirePoolSlot(poolDir, limit, owner, options);
    if (handle) return handle;
    if (!waitingAnnounced) {
      options.onWait?.();
      waitingAnnounced = true;
    }
    await delay(pollMs);
  }
}

/** Lists the slot locks that currently exist in the pool, including stale ones. */
export function listPoolSlots(poolDir: string, staleMs: number = LOCK_STALE_MS): PoolSlotStatus[] {
  if (!existsSync(poolDir)) return [];
  const names = readdirSync(poolDir)
    .filter((name) => /^slot-\d+$/.test(name))
    .sort((a, b) => Number(a.slice(5)) - Number(b.slice(5)));
  const slots: PoolSlotStatus[] = [];
  for (const name of names) {
    const lockDir = join(poolDir, name);
    const ageMs = lockAgeMs(lockDir);
    if (ageMs === null) continue;
    slots.push({ name, lockDir, owner: readLockOwner(lockDir), ageMs, stale: ageMs > staleMs });
  }
  return slots;
}

/** Owners of the pool slots whose heartbeat is fresh. */
export function livePoolHolders(
  poolDir: string,
  staleMs: number = LOCK_STALE_MS,
): PoolSlotStatus[] {
  return listPoolSlots(poolDir, staleMs).filter((slot) => !slot.stale);
}

/**
 * A mutex shared by every process that uses the same directory. Calls from the same process are
 * queued in arrival order first, so only one of them polls the directory at a time.
 */
export class CrossProcessMutex {
  private tail: Promise<void> = Promise.resolve();

  constructor(
    readonly poolDir: string,
    private readonly owner: LockOwnerInput,
    private readonly options: WaitOptions = {},
  ) {}

  async runExclusive<T>(fn: () => Promise<T> | T): Promise<T> {
    const previous = this.tail;
    let releaseLocal!: () => void;
    this.tail = new Promise<void>((resolveTail) => {
      releaseLocal = resolveTail;
    });
    await previous;
    try {
      const handle = await acquirePoolSlot(this.poolDir, 1, this.owner, this.options);
      try {
        return await fn();
      } finally {
        releaseLock(handle);
      }
    } finally {
      releaseLocal();
    }
  }
}
