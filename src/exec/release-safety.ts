import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { readLockOwner } from "./slot-lock.js";
import {
  acquireExecRunLock,
  execRunJoinPoolPath,
  execRunLockPath,
  EXEC_RUN_LOCK_TOKEN_ENV,
  releaseExecRunLock,
} from "./run/lock.js";
import {
  canReleaseTask,
  claimOwnerOf,
  isTakeOverEvent,
  type ForceOverride,
  type StoppedClaimRun,
} from "./events.js";
import type { ExecEventV1, ScheduleIndex, StateSnapshot } from "./types.js";

function runLockPaths(executionPath: string): string[] {
  const pool = execRunJoinPoolPath(executionPath);
  let slots: string[];
  try {
    slots = readdirSync(pool).filter((name) => /^slot-\d+$/.test(name));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    slots = [];
  }
  return [execRunLockPath(executionPath), ...slots.map((name) => join(pool, name))];
}

/** Unlike a stale heartbeat, only ESRCH proves that a recorded process has exited. */
function processAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ESRCH") return false;
    if (code === "EPERM") return true;
    throw error;
  }
}

function validRun(value: unknown): value is StoppedClaimRun {
  if (!value || typeof value !== "object") return false;
  const run = value as Partial<StoppedClaimRun>;
  return (
    Number.isSafeInteger(run.pid) &&
    run.pid! > 0 &&
    typeof run.lock_token === "string" &&
    run.lock_token.length > 0
  );
}

/** Bind the claim to its parent runner, rather than the short-lived claim CLI process. */
export function recordClaimRun(event: ExecEventV1, executionPath: string): void {
  // This field is CLI-owned; --meta must not supply unverified run evidence.
  if (event.meta) delete event.meta.claim_run;
  const token = process.env[EXEC_RUN_LOCK_TOKEN_ENV];
  if (!token) return;
  for (const path of runLockPaths(executionPath)) {
    const owner = readLockOwner(path);
    const run = owner && { pid: owner.pid, lock_token: owner.token };
    if (run && owner?.token === token && validRun(run) && processAlive(run.pid)) {
      event.meta = { ...event.meta, claim_run: run };
      return;
    }
  }
}

export type ReleaseCheck = {
  ok: boolean;
  reason?: string;
  meta?: Record<string, unknown>;
  cleanup?: () => void;
};

/** Called under the scheduler lock; hold the exec-run lock through the release write. */
export async function checkReleaseWithRunSafety(
  executionPath: string,
  state: {
    schedule: ScheduleIndex;
    snapshot: StateSnapshot;
    events: { event: ExecEventV1 }[];
  },
  taskId: string,
  actor: string,
  override: ForceOverride,
): Promise<ReleaseCheck> {
  const normal = canReleaseTask(state.schedule, state.snapshot, taskId, actor, override);
  if (normal.ok || actor !== "specdojo-orchestrator" || !override.force || override.isHuman) {
    return normal;
  }
  const refuse = (reason: string): ReleaseCheck => ({
    ok: false,
    reason: `${reason}; a human may override with --force`,
  });
  const owner = claimOwnerOf(state.snapshot.tasks[taskId]);
  const claim = [...state.events]
    .reverse()
    .find(
      ({ event }) =>
        event.task_id === taskId &&
        (event.type === "claim" || (event.type === "unblock" && isTakeOverEvent(event))),
    )?.event;
  const run = claim?.meta?.claim_run;
  if (!claim || claim.by !== owner || !validRun(run)) {
    return refuse(
      `cannot determine whether the claim run is stopped for task ${taskId}: missing or invalid claim lock/PID record`,
    );
  }
  try {
    if (processAlive(run.pid)) {
      return refuse(`claim run is running: task ${taskId}, PID ${run.pid}`);
    }
    // Resume may keep the original claim. A project lock with a different PID can therefore
    // still be running this task. Reject even unrelated live holders rather than guess.
    for (const path of runLockPaths(executionPath)) {
      try {
        statSync(path);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") continue;
        throw error;
      }
      const holder = readLockOwner(path);
      if (!holder || !validRun({ pid: holder.pid, lock_token: holder.token })) {
        return refuse(
          `cannot determine whether task ${taskId} is running: unreadable or invalid run lock ${path}`,
        );
      }
      if (processAlive(holder.pid)) {
        return refuse(`project run may be running task ${taskId}: PID ${holder.pid}, lock ${path}`);
      }
    }
    // Serialize with new runs/resumes. A dead but fresh lock is left intact until the existing
    // stale-lock policy permits acquisition. No lock/PID information is removed by this probe.
    const handle = await acquireExecRunLock(executionPath, { actor, ifBusy: "fail" });
    if (!handle) return refuse(`cannot acquire the run lock for task ${taskId}`);
    const check = canReleaseTask(state.schedule, state.snapshot, taskId, actor, {
      ...override,
      stoppedRun: run,
    });
    return {
      ...check,
      meta: check.ok ? { release_stopped_claim_run: run, release_claim_owner: owner } : undefined,
      cleanup: () => releaseExecRunLock(handle),
    };
  } catch (error) {
    return refuse(
      `cannot determine or lock the stopped claim run for task ${taskId}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
