import { extname, join, resolve } from "node:path";
import { mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import {
  type CurrentState,
  type ExecEventType,
  type ExecEventV1,
  type ExecState,
  type ScheduleIndex,
  type SchedulerLockOptions,
  type StateSnapshot,
} from "./exec-types.js";
import {
  collectRepeatable,
  ensureDir,
  isUtcIsoSeconds,
  listFilesRecursive,
  nowUtcIsoSeconds,
  parseKeyValuePairs,
  randomHex,
  readJson,
  requireNonEmpty,
  safeSlug,
  sleepMs,
  toArtifactPath,
  tsForFilenameUtc,
  writeJson,
} from "./exec-shared.js";
import { eventsDirForProject, executionRootForProject } from "./exec-project.js";

export { collectRepeatable };

export function validateEventShape(obj: unknown, source: string): string[] {
  const errs: string[] = [];
  function err(msg: string): void {
    errs.push(`${source}: ${msg}`);
  }

  if (!obj || typeof obj !== "object") {
    err("not a JSON object");
    return errs;
  }
  const o = obj as Record<string, unknown>;
  if (o.v !== 1) err("v must be 1");
  if (typeof o.ts !== "string" || !isUtcIsoSeconds(o.ts)) {
    err("ts must be UTC ISO seconds like 2026-03-05T03:10:00Z");
  }
  const allowed = new Set<ExecEventType>([
    "claim",
    "note",
    "block",
    "unblock",
    "complete",
    "reopen",
    "release",
    "cancel",
    "link",
    "estimate",
  ]);
  if (typeof o.type !== "string" || !allowed.has(o.type as ExecEventType)) {
    err(`type must be one of ${Array.from(allowed).join(", ")}`);
  }
  if (typeof o.task_id !== "string" || o.task_id.trim() === "") {
    err("task_id must be non-empty string");
  }
  if (typeof o.by !== "string" || o.by.trim() === "") err("by must be non-empty string");
  if (typeof o.msg !== "string") err("msg must be string");
  if (
    o.refs !== undefined &&
    (typeof o.refs !== "object" || o.refs === null || Array.isArray(o.refs))
  ) {
    err("refs must be object if provided");
  }
  if (
    o.meta !== undefined &&
    (typeof o.meta !== "object" || o.meta === null || Array.isArray(o.meta))
  ) {
    err("meta must be object if provided");
  }
  return errs;
}

export function readAllEventFiles(projectPath: string): { path: string; event: ExecEventV1 }[] {
  const dir = eventsDirForProject(projectPath);
  const files = listFilesRecursive(dir).filter((p) => extname(p).toLowerCase() === ".json");

  const items: { path: string; event: ExecEventV1 }[] = [];
  for (const f of files) items.push({ path: f, event: readJson(f) as ExecEventV1 });

  // Within the same timestamp, order by logical event sequence to prevent
  // e.g. 'cancel' (alphabetically before 'claim') from being processed first.
  const typeOrder: Record<string, number> = {
    claim: 1,
    note: 2,
    block: 3,
    complete: 3,
    estimate: 3,
    link: 3,
    unblock: 4,
    reopen: 4,
    release: 5,
    cancel: 5,
  };
  items.sort((a, b) => {
    if (a.event.ts < b.event.ts) return -1;
    if (a.event.ts > b.event.ts) return 1;
    const orderA = typeOrder[a.event.type] ?? 99;
    const orderB = typeOrder[b.event.type] ?? 99;
    if (orderA !== orderB) return orderA - orderB;
    return a.path.localeCompare(b.path);
  });

  return items;
}

export function buildEvent(type: ExecEventType, o: Record<string, unknown>): ExecEventV1 {
  const task_id = requireNonEmpty("task", o.task);
  const by = requireNonEmpty("by", o.by);
  const msg = requireNonEmpty("msg", o.msg);

  const refs = parseKeyValuePairs(o.ref as string[] | undefined);
  const metaPairs = parseKeyValuePairs(o.meta as string[] | undefined);
  const meta = metaPairs
    ? (Object.fromEntries(Object.entries(metaPairs)) as Record<string, unknown>)
    : undefined;

  const e: ExecEventV1 = { v: 1, ts: nowUtcIsoSeconds(), type, task_id, by, msg };
  if (o.runId) e.run_id = String(o.runId);
  if (refs) e.refs = refs;
  if (meta) e.meta = meta;
  return e;
}

export function writeEventFile(projectPath: string, event: ExecEventV1): string {
  const execDir = eventsDirForProject(projectPath);
  ensureDir(execDir);

  const tsPart = tsForFilenameUtc(event.ts);
  const byPart = safeSlug(event.by);
  const idPart = safeSlug(event.task_id);
  const rand = randomHex(2);

  const filename = `${tsPart}_${byPart}_${idPart}_${event.type}_${rand}.json`;
  const fullpath = join(execDir, filename);

  writeFileSync(fullpath, JSON.stringify(event, null, 2) + "\n", "utf8");
  return fullpath;
}

export function foldEventsToState(
  events: { path: string; event: ExecEventV1 }[],
  schedule: ScheduleIndex,
  projectPath: string,
  initialTasks?: Record<string, CurrentState>,
): StateSnapshot {
  const tasks: Record<string, CurrentState> = initialTasks ? { ...initialTasks } : {};

  function ensure(id: string): CurrentState {
    if (!tasks[id]) tasks[id] = { state: "todo" };
    return tasks[id];
  }

  for (const { event } of events) {
    if (!schedule.nodes.has(event.task_id)) continue;
    const cur = ensure(event.task_id);
    cur.last_ts = event.ts;
    cur.last_by = event.by;
    cur.last_type = event.type;
    cur.last_msg = event.msg;
    if (event.refs) cur.refs = event.refs;
    if (event.meta) cur.meta = event.meta;

    if (event.type === "claim") cur.state = "doing";
    else if (event.type === "block") cur.state = "blocked";
    else if (event.type === "unblock")
      cur.state = "doing"; // resume work; same actor continues
    else if (event.type === "complete") cur.state = "done";
    else if (event.type === "reopen") {
      // reopen corrects an erroneous completion without deleting the complete event.
      // Other states are left untouched (the command guard prevents emitting them).
      if (cur.state === "done") cur.state = "todo";
    } else if (event.type === "release") {
      // release returns an in-flight attempt to todo so the task can be re-executed.
      //   doing   → todo (claim released)
      //   blocked → todo (blocked attempt abandoned)
      // Other states are left untouched (the command guard prevents emitting them).
      if (cur.state === "doing" || cur.state === "blocked") cur.state = "todo";
    } else if (event.type === "cancel") {
      // Legacy cancel is state-dependent, kept for backward compatibility with events written
      // before `release` existed. New cancel commands run only from todo (→ cancelled); the
      // doing/blocked → todo transitions are now recorded as `release` events.
      //   todo    → cancelled (task permanently abandoned)
      //   doing   → todo      (legacy: claim released)
      //   blocked → todo      (legacy: attempt abandoned)
      if (cur.state === "todo") cur.state = "cancelled";
      else if (cur.state === "doing" || cur.state === "blocked") cur.state = "todo";
      else cur.state = "cancelled";
    }
  }

  for (const id of schedule.nodes.keys()) ensure(id);

  return {
    schedule_path: toArtifactPath(projectPath),
    tasks,
  };
}

export function isDependencySatisfied(
  schedule: ScheduleIndex,
  snapshot: StateSnapshot,
  nodeId: string,
  visiting = new Set<string>(),
): boolean {
  const node = schedule.nodes.get(nodeId);
  if (!node) return false;

  if (node.kind === "task") {
    return (snapshot.tasks[nodeId]?.state ?? "todo") === "done";
  }

  if (visiting.has(nodeId)) return false;
  visiting.add(nodeId);
  const ok = node.depends_on.every((dep) =>
    isDependencySatisfied(schedule, snapshot, dep, visiting),
  );
  visiting.delete(nodeId);
  return ok;
}

export function computeReadyIds(schedule: ScheduleIndex, snapshot: StateSnapshot): string[] {
  function stateOf(id: string): ExecState {
    return snapshot.tasks[id]?.state ?? "todo";
  }

  const ready: string[] = [];
  for (const n of schedule.nodes.values()) {
    if (n.kind !== "task") continue;
    const st = stateOf(n.id);
    if (st === "done" || st === "cancelled" || st === "doing" || st === "blocked") continue;
    if (n.depends_on.every((d) => isDependencySatisfied(schedule, snapshot, d))) ready.push(n.id);
  }
  ready.sort();
  return ready;
}

export function findDoingTasksForActor(snapshot: StateSnapshot, actor: string): string[] {
  return Object.entries(snapshot.tasks)
    .filter(([, st]) => st.state === "doing" && st.last_by === actor)
    .map(([taskId]) => taskId)
    .sort();
}

export function canClaimTask(
  schedule: ScheduleIndex,
  snapshot: StateSnapshot,
  taskId: string,
  actorOwner?: string,
  allowOwnerMismatch = false,
): { ok: boolean; reason?: string } {
  const node = schedule.nodes.get(taskId);
  if (!node) return { ok: false, reason: `task not found in schedule: ${taskId}` };
  if (node.kind !== "task") return { ok: false, reason: `cannot claim non-task node: ${taskId}` };

  if (node.owner && actorOwner && !allowOwnerMismatch && actorOwner !== node.owner) {
    return {
      ok: false,
      reason:
        `task assigned to owner ${node.owner}; acting owner is ${actorOwner ?? "(unspecified)"}. ` +
        `Use --owner ${node.owner}, SPECDOJO_OWNER=${node.owner}, or --allow-owner-mismatch.`,
    };
  }

  const cur = snapshot.tasks[taskId];
  const state = cur?.state ?? "todo";

  if (state === "doing") return { ok: false, reason: `task already doing: ${taskId}` };
  if (state === "done") return { ok: false, reason: `task already done: ${taskId}` };
  if (state === "cancelled") return { ok: false, reason: `task cancelled: ${taskId}` };
  if (state === "blocked") return { ok: false, reason: `task blocked: ${taskId}` };

  for (const dep of node.depends_on) {
    if (!isDependencySatisfied(schedule, snapshot, dep)) {
      return { ok: false, reason: `dependency not satisfied: ${dep}` };
    }
  }

  return { ok: true };
}

// A human actor may override the "owned by another actor" guard by passing
// --force, e.g. to release/complete/block a task held by a stuck agent.
// Agents never get this exception, preserving claim-stealing protection.
export type ForceOverride = {
  isHuman?: boolean;
  force?: boolean;
};

function canOverrideCrossActor(override?: ForceOverride): boolean {
  return !!override?.isHuman && !!override?.force;
}

function crossActorReason(lastBy: string | undefined): string {
  return (
    `task is being worked on by another actor: ${lastBy ?? "(unknown)"}` +
    ` (a human may override with --force)`
  );
}

export function canCompleteTask(
  schedule: ScheduleIndex,
  snapshot: StateSnapshot,
  taskId: string,
  actor: string,
  override?: ForceOverride,
): { ok: boolean; reason?: string } {
  const node = schedule.nodes.get(taskId);
  if (!node) return { ok: false, reason: `task not found in schedule: ${taskId}` };
  if (node.kind !== "task")
    return { ok: false, reason: `cannot complete non-task node: ${taskId}` };

  const cur = snapshot.tasks[taskId];
  const state = cur?.state ?? "todo";

  if (state === "todo") return { ok: false, reason: `task not started: ${taskId}` };
  if (state === "blocked") return { ok: false, reason: `task is blocked: ${taskId}` };
  if (state === "done") return { ok: false, reason: `task already done: ${taskId}` };
  if (state === "cancelled") return { ok: false, reason: `task cancelled: ${taskId}` };

  if (state !== "doing") return { ok: false, reason: `task is not doing: ${taskId}` };
  if (cur?.last_by !== actor && !canOverrideCrossActor(override)) {
    return { ok: false, reason: crossActorReason(cur?.last_by) };
  }

  return { ok: true };
}

// Reopening reverses a terminal completion and can invalidate dependency decisions. It is therefore
// human-only and is rejected while any downstream task is already in-flight or complete. Traversal
// passes through milestone/gate nodes so transitive task dependencies are guarded as well.
export function canReopenTask(
  schedule: ScheduleIndex,
  snapshot: StateSnapshot,
  taskId: string,
  isHuman: boolean,
): { ok: boolean; reason?: string } {
  const node = schedule.nodes.get(taskId);
  if (!node) return { ok: false, reason: `task not found in schedule: ${taskId}` };
  if (node.kind !== "task") return { ok: false, reason: `cannot reopen non-task node: ${taskId}` };
  if (!isHuman) return { ok: false, reason: `reopen requires a human actor: ${taskId}` };

  const state = snapshot.tasks[taskId]?.state ?? "todo";
  if (state !== "done") return { ok: false, reason: `task is not done: ${taskId} (${state})` };

  const reverseDependencies = new Map<string, string[]>();
  for (const candidate of schedule.nodes.values()) {
    for (const dependencyId of candidate.depends_on) {
      const dependents = reverseDependencies.get(dependencyId) ?? [];
      dependents.push(candidate.id);
      reverseDependencies.set(dependencyId, dependents);
    }
  }

  const visited = new Set<string>([taskId]);
  const queue = [...(reverseDependencies.get(taskId) ?? [])];
  const conflicting: string[] = [];
  while (queue.length > 0) {
    const dependentId = queue.shift() as string;
    if (visited.has(dependentId)) continue;
    visited.add(dependentId);

    const dependent = schedule.nodes.get(dependentId);
    if (!dependent) continue;
    if (dependent.kind === "task") {
      const dependentState = snapshot.tasks[dependentId]?.state ?? "todo";
      if (dependentState === "doing" || dependentState === "blocked" || dependentState === "done") {
        conflicting.push(`${dependentId} (${dependentState})`);
      }
    }
    queue.push(...(reverseDependencies.get(dependentId) ?? []));
  }

  if (conflicting.length > 0) {
    conflicting.sort((a, b) => a.localeCompare(b));
    return {
      ok: false,
      reason: `downstream task(s) must be reopened or released first: ${conflicting.join(", ")}`,
    };
  }

  return { ok: true };
}

export function canBlockTask(
  schedule: ScheduleIndex,
  snapshot: StateSnapshot,
  taskId: string,
  actor: string,
  override?: ForceOverride,
): { ok: boolean; reason?: string } {
  const node = schedule.nodes.get(taskId);
  if (!node) return { ok: false, reason: `task not found in schedule: ${taskId}` };
  if (node.kind !== "task") return { ok: false, reason: `cannot block non-task node: ${taskId}` };

  const cur = snapshot.tasks[taskId];
  const state = cur?.state ?? "todo";

  if (state === "todo") return { ok: false, reason: `task not started: ${taskId}` };
  if (state === "blocked") return { ok: false, reason: `task already blocked: ${taskId}` };
  if (state === "done") return { ok: false, reason: `task already done: ${taskId}` };
  if (state === "cancelled") return { ok: false, reason: `task cancelled: ${taskId}` };

  if (state !== "doing") return { ok: false, reason: `task is not doing: ${taskId}` };
  if (cur?.last_by !== actor && !canOverrideCrossActor(override)) {
    return { ok: false, reason: crossActorReason(cur?.last_by) };
  }

  return { ok: true };
}

export function canUnblockTask(
  schedule: ScheduleIndex,
  snapshot: StateSnapshot,
  taskId: string,
): { ok: boolean; reason?: string } {
  const node = schedule.nodes.get(taskId);
  if (!node) return { ok: false, reason: `task not found in schedule: ${taskId}` };
  if (node.kind !== "task") return { ok: false, reason: `cannot unblock non-task node: ${taskId}` };

  const cur = snapshot.tasks[taskId];
  const state = cur?.state ?? "todo";

  if (state === "todo") return { ok: false, reason: `task is not blocked: ${taskId}` };
  if (state === "doing") return { ok: false, reason: `task is not blocked: ${taskId}` };
  if (state === "done") return { ok: false, reason: `task already done: ${taskId}` };
  if (state === "cancelled") return { ok: false, reason: `task cancelled: ${taskId}` };

  if (state !== "blocked") return { ok: false, reason: `task is not blocked: ${taskId}` };

  return { ok: true };
}

// release returns a doing/blocked task to todo for re-execution. Only the claiming actor may
// release it (a human may override with --force), mirroring complete/block so an agent cannot
// reset another actor's in-flight work.
export function canReleaseTask(
  schedule: ScheduleIndex,
  snapshot: StateSnapshot,
  taskId: string,
  actor: string,
  override?: ForceOverride,
): { ok: boolean; reason?: string } {
  const node = schedule.nodes.get(taskId);
  if (!node) return { ok: false, reason: `task not found in schedule: ${taskId}` };
  if (node.kind !== "task") return { ok: false, reason: `cannot release non-task node: ${taskId}` };

  const cur = snapshot.tasks[taskId];
  const state = cur?.state ?? "todo";

  if (state === "todo") return { ok: false, reason: `task not started: ${taskId}` };
  if (state === "done") return { ok: false, reason: `task already done: ${taskId}` };
  if (state === "cancelled") return { ok: false, reason: `task cancelled: ${taskId}` };

  if (state !== "doing" && state !== "blocked") {
    return { ok: false, reason: `task is not doing or blocked: ${taskId}` };
  }
  if (cur?.last_by !== actor && !canOverrideCrossActor(override)) {
    return { ok: false, reason: crossActorReason(cur?.last_by) };
  }

  return { ok: true };
}

// cancel permanently terminates a not-yet-started task (todo → cancelled). In-flight tasks
// (doing/blocked) are returned to todo with `release`, not cancel.
export function canCancelTask(
  schedule: ScheduleIndex,
  snapshot: StateSnapshot,
  taskId: string,
): { ok: boolean; reason?: string } {
  const node = schedule.nodes.get(taskId);
  if (!node) return { ok: false, reason: `task not found in schedule: ${taskId}` };
  if (node.kind !== "task") return { ok: false, reason: `cannot cancel non-task node: ${taskId}` };

  const cur = snapshot.tasks[taskId];
  const state = cur?.state ?? "todo";

  if (state === "done") return { ok: false, reason: `task already done: ${taskId}` };
  if (state === "cancelled") return { ok: false, reason: `task already cancelled: ${taskId}` };
  if (state === "doing" || state === "blocked") {
    return {
      ok: false,
      reason: `task is ${state}; use \`release\` to return it to todo: ${taskId}`,
    };
  }

  return { ok: true };
}

function schedulerLockDir(projectPath: string): string {
  return join(executionRootForProject(projectPath), "exec", ".locks", "scheduler.lock");
}

export function acquireSchedulerLock(projectPath: string, opts: SchedulerLockOptions): string {
  const lockDir = schedulerLockDir(projectPath);
  const lockParent = resolve(lockDir, "..");
  ensureDir(lockParent);

  const start = Date.now();

  while (true) {
    try {
      mkdirSync(lockDir);
      writeJson(join(lockDir, "owner.json"), {
        actor: opts.actor,
        pid: process.pid,
        acquired_at_utc: nowUtcIsoSeconds(),
      });
      return lockDir;
    } catch (e: unknown) {
      if ((e as NodeJS.ErrnoException | null)?.code !== "EEXIST") throw e;

      try {
        const st = statSync(lockDir);
        const ageMs = Date.now() - st.mtimeMs;
        if (ageMs > opts.lockStaleMs) {
          rmSync(lockDir, { recursive: true, force: true });
          continue;
        }
      } catch {
        continue;
      }

      if (Date.now() - start > opts.lockTimeoutMs) {
        let ownerInfo = "";
        try {
          ownerInfo = readFileSync(join(lockDir, "owner.json"), "utf8");
        } catch {
          ownerInfo = "(owner metadata unavailable)";
        }
        throw new Error(
          `Failed to acquire scheduler lock within ${opts.lockTimeoutMs} ms.\n` +
            `Lock: ${lockDir}\n` +
            `Owner: ${ownerInfo}`,
        );
      }

      sleepMs(200);
    }
  }
}

export function releaseSchedulerLock(lockDir: string): void {
  rmSync(lockDir, { recursive: true, force: true });
}

export function schedulerLockPath(projectPath: string): string {
  return schedulerLockDir(projectPath);
}
