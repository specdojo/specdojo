import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  utimesSync,
} from "node:fs";
import { spawn, type ChildProcess } from "node:child_process";
import { join } from "node:path";
import { ensureDir, nowUtcIsoSeconds, randomHex, writeJson } from "./exec-shared.js";

export type ExecRunBusyPolicy = "skip" | "wait" | "fail";

export type ExecRunLockOptions = {
  actor: string;
  ifBusy: ExecRunBusyPolicy;
  heartbeatMs?: number;
  staleMs?: number;
  pollMs?: number;
  onWait?: () => void;
};

export type ExecRunLockHandle = {
  lockDir: string;
  token: string;
  heartbeat: ChildProcess;
};

type ExecRunLockOwner = {
  actor: string;
  pid: number;
  token: string;
  acquired_at_utc: string;
};

export const EXEC_RUN_LOCK_HEARTBEAT_MS = 5_000;
export const EXEC_RUN_LOCK_STALE_MS = 30_000;
export const ROUTINE_EXEC_ENV = "SPECDOJO_ROUTINE_EXEC";
export const ROUTINE_BUSY_SKIP_EXIT_CODE = 75;
const EXEC_RUN_LOCK_POLL_MS = 200;

export class ExecRunBusyError extends Error {
  constructor(
    public readonly lockDir: string,
    public readonly owner: string,
  ) {
    super(`Exec run is busy for this project.\nLock: ${lockDir}\nOwner: ${owner}`);
    this.name = "ExecRunBusyError";
  }
}

export function execRunLockPath(executionPath: string): string {
  return join(executionPath, "exec", ".locks", "exec-run.lock");
}

function readOwner(lockDir: string): ExecRunLockOwner | null {
  try {
    return JSON.parse(readFileSync(join(lockDir, "owner.json"), "utf8")) as ExecRunLockOwner;
  } catch {
    return null;
  }
}

function formatOwner(lockDir: string): string {
  const owner = readOwner(lockDir);
  return owner ? JSON.stringify(owner) : "(owner metadata unavailable)";
}

function delay(ms: number): Promise<void> {
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

function tryRemoveStaleLock(lockDir: string, staleMs: number): boolean {
  let ageMs: number;
  try {
    ageMs = Date.now() - statSync(lockDir).mtimeMs;
  } catch (error) {
    if ((error as NodeJS.ErrnoException | null)?.code === "ENOENT") return true;
    throw error;
  }
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

export async function acquireExecRunLock(
  executionPath: string,
  opts: ExecRunLockOptions,
): Promise<ExecRunLockHandle | null> {
  const lockDir = execRunLockPath(executionPath);
  ensureDir(join(executionPath, "exec", ".locks"));
  const heartbeatMs = opts.heartbeatMs ?? EXEC_RUN_LOCK_HEARTBEAT_MS;
  const staleMs = opts.staleMs ?? EXEC_RUN_LOCK_STALE_MS;
  const pollMs = opts.pollMs ?? EXEC_RUN_LOCK_POLL_MS;
  const token = `${process.pid}-${randomHex(8)}`;
  let waitingAnnounced = false;

  while (true) {
    try {
      mkdirSync(lockDir);
      writeJson(join(lockDir, "owner.json"), {
        actor: opts.actor,
        pid: process.pid,
        token,
        acquired_at_utc: nowUtcIsoSeconds(),
      } satisfies ExecRunLockOwner);
      const now = new Date();
      utimesSync(lockDir, now, now);
      return {
        lockDir,
        token,
        heartbeat: startHeartbeat(lockDir, token, heartbeatMs),
      };
    } catch (error) {
      if ((error as NodeJS.ErrnoException | null)?.code !== "EEXIST") throw error;
    }

    if (tryRemoveStaleLock(lockDir, staleMs)) continue;

    if (opts.ifBusy === "skip") return null;
    if (opts.ifBusy === "fail") {
      throw new ExecRunBusyError(lockDir, formatOwner(lockDir));
    }
    if (!waitingAnnounced) {
      opts.onWait?.();
      waitingAnnounced = true;
    }
    await delay(pollMs);
  }
}

export function releaseExecRunLock(handle: ExecRunLockHandle): void {
  handle.heartbeat.kill();
  if (!existsSync(handle.lockDir)) return;
  const owner = readOwner(handle.lockDir);
  if (owner?.token !== handle.token) return;
  rmSync(handle.lockDir, { recursive: true, force: true });
}
