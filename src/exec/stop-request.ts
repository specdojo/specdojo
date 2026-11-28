import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

/**
 * Drain stop for `exec run --auto` / `exec cycle` and exec queues (PJR-32PN).
 *
 * `exec stop` leaves a request file. A running auto run reads it at each scheduling point: it
 * claims no new task, lets the running tasks finish through integration, then exits with
 * EXEC_STOP_EXIT_CODE. A queue runner stops before its next step, and a queue step that exits with
 * that code goes back to `pending` so the same `exec queue run <queueId>` resumes it.
 *
 * Requests and auto-run markers are runtime state under `exec/.locks/` (ignored by Git). The fact
 * that a run stopped on request is kept under `exec/stops/` and committed with the run records.
 */

/** Exit code of a run or queue that stopped on an `exec stop` request. */
export const EXEC_STOP_EXIT_CODE = 76;
/** Set by the queue runner on its child processes so an auto run knows which queue it serves. */
export const EXEC_QUEUE_ID_ENV = "SPECDOJO_EXEC_QUEUE_ID";

export type StopTarget =
  { kind: "project" } | { kind: "track"; track: string } | { kind: "queue"; queueId: string };

export type StopRequest = {
  version: 1;
  target: StopTarget;
  message: string;
  requested_at: string;
  /** Set when an auto run first saw the request and stopped claiming new tasks. */
  acknowledged_at?: string;
  acknowledged_pid?: number;
  /** Tasks the acknowledging run was still waiting for at its last scheduling point. */
  waiting_for?: string[];
};

export type AutoRunMarker = {
  version: 1;
  pid: number;
  command: "run" | "cycle";
  started_at: string;
  loop: boolean;
  track?: string;
  queue_id?: string;
};

export type StopRecord = {
  version: 1;
  target: StopTarget;
  message: string;
  requested_at: string;
  stopped_at: string;
  stopped_by: "auto-run" | "queue";
  /** Tasks that were running when the request was seen and finished before the exit. */
  drained_tasks?: string[];
  queue_step?: number;
};

const TRACK_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;

function locksDirectory(executionPath: string): string {
  return join(executionPath, "exec", ".locks");
}

export function stopRequestsDirectory(executionPath: string): string {
  return join(locksDirectory(executionPath), "stop-requests");
}

export function autoRunsDirectory(executionPath: string): string {
  return join(locksDirectory(executionPath), "auto-runs");
}

export function stopRecordsDirectory(executionPath: string): string {
  return join(executionPath, "exec", "stops");
}

export function stopTargetKey(target: StopTarget): string {
  if (target.kind === "project") return "project";
  if (target.kind === "track") return `track-${target.track}`;
  return `queue-${target.queueId}`;
}

export function describeStopTarget(target: StopTarget): string {
  if (target.kind === "project") return "every auto run of the project";
  if (target.kind === "track") return `track ${target.track}`;
  return `queue ${target.queueId}`;
}

export function stopRequestPath(executionPath: string, target: StopTarget): string {
  return join(stopRequestsDirectory(executionPath), `${stopTargetKey(target)}.json`);
}

export function parseStopTarget(opts: { track?: string; queue?: string }): StopTarget {
  if (opts.track !== undefined && opts.queue !== undefined) {
    throw new Error("Use either --track or --queue, not both");
  }
  if (opts.track !== undefined) {
    if (!TRACK_PATTERN.test(opts.track)) throw new Error(`Invalid track name: ${opts.track}`);
    return { kind: "track", track: opts.track };
  }
  if (opts.queue !== undefined) return { kind: "queue", queueId: opts.queue };
  return { kind: "project" };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStopTarget(value: unknown): value is StopTarget {
  if (!isRecord(value)) return false;
  if (value.kind === "project") return true;
  if (value.kind === "track") return typeof value.track === "string";
  return value.kind === "queue" && typeof value.queueId === "string";
}

function readJson(path: string): unknown {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    throw new Error(`Invalid JSON: ${path}`, { cause: error });
  }
}

function writeJson(path: string, value: unknown): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function parseStopRequest(value: unknown, source: string): StopRequest {
  if (
    !isRecord(value) ||
    value.version !== 1 ||
    !isStopTarget(value.target) ||
    typeof value.message !== "string" ||
    typeof value.requested_at !== "string"
  ) {
    throw new Error(`Invalid stop request: ${source}`);
  }
  return value as StopRequest;
}

export function readStopRequest(
  executionPath: string,
  target: StopTarget,
): StopRequest | undefined {
  const path = stopRequestPath(executionPath, target);
  if (!existsSync(path)) return undefined;
  return parseStopRequest(readJson(path), path);
}

export function listStopRequests(executionPath: string): StopRequest[] {
  const directory = stopRequestsDirectory(executionPath);
  if (!existsSync(directory)) return [];
  return readdirSync(directory)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => {
      const path = join(directory, name);
      return parseStopRequest(readJson(path), path);
    });
}

export function isProcessAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    // EPERM: the process exists but belongs to another user.
    return (error as NodeJS.ErrnoException).code === "EPERM";
  }
}

function parseAutoRunMarker(value: unknown): AutoRunMarker | undefined {
  if (
    !isRecord(value) ||
    value.version !== 1 ||
    typeof value.pid !== "number" ||
    (value.command !== "run" && value.command !== "cycle") ||
    typeof value.started_at !== "string" ||
    typeof value.loop !== "boolean"
  ) {
    return undefined;
  }
  return value as AutoRunMarker;
}

/** Record that this process runs an auto run; returns the function that removes the marker. */
export function registerAutoRun(executionPath: string, marker: AutoRunMarker): () => void {
  const path = join(autoRunsDirectory(executionPath), `${marker.pid}.json`);
  writeJson(path, marker);
  return () => rmSync(path, { force: true });
}

/** Auto runs whose process is alive. Markers left by a process that died are removed. */
export function listLiveAutoRuns(
  executionPath: string,
  isAlive: (pid: number) => boolean = isProcessAlive,
): AutoRunMarker[] {
  const directory = autoRunsDirectory(executionPath);
  if (!existsSync(directory)) return [];
  const live: AutoRunMarker[] = [];
  for (const name of readdirSync(directory)
    .filter((entry) => entry.endsWith(".json"))
    .sort()) {
    const path = join(directory, name);
    let marker: AutoRunMarker | undefined;
    try {
      marker = parseAutoRunMarker(JSON.parse(readFileSync(path, "utf8")));
    } catch {
      marker = undefined;
    }
    if (marker && isAlive(marker.pid)) live.push(marker);
    else rmSync(path, { force: true });
  }
  return live;
}

export function autoRunMatches(run: AutoRunMarker, target: StopTarget): boolean {
  if (target.kind === "project") return true;
  if (target.kind === "track") return run.track === target.track;
  return run.queue_id === target.queueId;
}

/**
 * Create a stop request. It is refused when the same target already has one, or when nothing that
 * the request could stop is running.
 */
export function requestStop(params: {
  executionPath: string;
  target: StopTarget;
  message: string;
  /** Whether the queue runner holds its lock; used for queue targets. */
  isQueueRunning?: (queueId: string) => boolean;
  isAlive?: (pid: number) => boolean;
  now?: string;
}): { request: StopRequest; runs: AutoRunMarker[] } {
  const { executionPath, target } = params;
  const message = params.message.trim();
  if (!message) throw new Error("--msg must not be empty");
  const existing = readStopRequest(executionPath, target);
  if (existing) {
    throw new Error(
      `A stop request for ${describeStopTarget(target)} already exists ` +
        `(requested at ${existing.requested_at}: ${existing.message}). ` +
        `Withdraw it with exec stop --cancel${stopTargetOptions(target)}`,
    );
  }
  const runs = listLiveAutoRuns(executionPath, params.isAlive).filter((run) =>
    autoRunMatches(run, target),
  );
  const queueRunning =
    target.kind === "queue" && (params.isQueueRunning?.(target.queueId) ?? false);
  if (runs.length === 0 && !queueRunning) {
    const what =
      target.kind === "queue"
        ? `queue ${target.queueId} is not running`
        : `no exec run --auto / exec cycle is running for ${describeStopTarget(target)}`;
    throw new Error(`Nothing to stop: ${what} (see exec status)`);
  }
  const request: StopRequest = {
    version: 1,
    target,
    message,
    requested_at: params.now ?? new Date().toISOString(),
  };
  writeJson(stopRequestPath(executionPath, target), request);
  return { request, runs };
}

export function stopTargetOptions(target: StopTarget): string {
  if (target.kind === "track") return ` --track ${target.track}`;
  if (target.kind === "queue") return ` --queue ${target.queueId}`;
  return "";
}

/** Withdraw a stop request. A run that has not exited yet resumes claiming at its next refill. */
export function cancelStopRequest(executionPath: string, target: StopTarget): StopRequest {
  const request = readStopRequest(executionPath, target);
  if (!request) throw new Error(`No stop request for ${describeStopTarget(target)}`);
  rmSync(stopRequestPath(executionPath, target), { force: true });
  return request;
}

function candidateTargets(run: AutoRunMarker): StopTarget[] {
  const targets: StopTarget[] = [{ kind: "project" }];
  if (run.track !== undefined) targets.push({ kind: "track", track: run.track });
  if (run.queue_id !== undefined) targets.push({ kind: "queue", queueId: run.queue_id });
  return targets;
}

/**
 * The request that applies to this run, if any. Requests older than the run are left by a run
 * that already exited and are removed by discardStaleStopRequests instead.
 */
export function findApplicableStopRequest(
  executionPath: string,
  run: AutoRunMarker,
): StopRequest | undefined {
  for (const target of candidateTargets(run)) {
    let request: StopRequest | undefined;
    try {
      request = readStopRequest(executionPath, target);
    } catch {
      // A broken request file must not stop the run; exec status reports it.
      request = undefined;
    }
    if (request && request.requested_at >= run.started_at) return request;
  }
  return undefined;
}

/**
 * Remove project / track requests that predate this run. Only one auto run holds the project exec
 * lock at a time, so such a request was meant for a run that is gone. Queue requests belong to the
 * queue runner and are kept.
 */
export function discardStaleStopRequests(executionPath: string, run: AutoRunMarker): StopRequest[] {
  const discarded: StopRequest[] = [];
  for (const target of candidateTargets(run)) {
    if (target.kind === "queue") continue;
    let request: StopRequest | undefined;
    try {
      request = readStopRequest(executionPath, target);
    } catch {
      request = undefined;
    }
    if (request && request.requested_at < run.started_at) {
      rmSync(stopRequestPath(executionPath, target), { force: true });
      discarded.push(request);
    }
  }
  return discarded;
}

/** Note on the request that a run saw it and is waiting for the listed tasks. */
export function acknowledgeStopRequest(
  executionPath: string,
  request: StopRequest,
  pid: number,
  waitingFor: readonly string[],
  now: string = new Date().toISOString(),
): StopRequest {
  const path = stopRequestPath(executionPath, request.target);
  // The request may have been withdrawn after it was read; do not recreate it.
  if (!existsSync(path)) return request;
  const updated: StopRequest = {
    ...request,
    acknowledged_at: request.acknowledged_at ?? now,
    acknowledged_pid: pid,
    waiting_for: [...waitingFor].sort(),
  };
  writeJson(path, updated);
  return updated;
}

function compactTimestamp(iso: string): string {
  return iso.replace(/[-:]/g, "").replace(/\.\d+/, "");
}

/** Remove the request and keep the fact that it stopped a run under `exec/stops/`. */
export function finishStopRequest(
  executionPath: string,
  request: StopRequest,
  details: Pick<StopRecord, "stopped_by" | "drained_tasks" | "queue_step">,
  now: string = new Date().toISOString(),
): string {
  const record: StopRecord = {
    version: 1,
    target: request.target,
    message: request.message,
    requested_at: request.requested_at,
    stopped_at: now,
    ...details,
  };
  if (record.drained_tasks) record.drained_tasks = [...record.drained_tasks].sort();
  const path = join(
    stopRecordsDirectory(executionPath),
    `${compactTimestamp(now)}-${stopTargetKey(request.target)}.json`,
  );
  writeJson(path, record);
  rmSync(stopRequestPath(executionPath, request.target), { force: true });
  return path;
}

/** One line for `exec status` / `exec queue status`. */
export function formatStopRequest(
  request: StopRequest,
  liveRuns: readonly AutoRunMarker[],
): string {
  const running =
    request.target.kind === "queue"
      ? true
      : liveRuns.some((run) => autoRunMatches(run, request.target));
  const state = request.acknowledged_at
    ? `draining: no new tasks; waiting for ${request.waiting_for?.length ?? 0} running task(s)` +
      (request.waiting_for && request.waiting_for.length > 0
        ? ` (${request.waiting_for.join(", ")})`
        : "")
    : running
      ? "requested: applies at the next scheduling point"
      : "requested: no matching run is alive";
  return [
    stopTargetKey(request.target),
    state,
    `requested_at=${request.requested_at}`,
    `msg=${request.message}`,
  ].join("\t");
}
