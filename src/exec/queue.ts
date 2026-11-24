import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import {
  isLiveLock,
  releaseLock,
  tryAcquireLock,
  type LockHandle,
} from "../shared/cross-process-lock.js";

/**
 * Exec queue: an ordered reservation of existing specdojo commands (PJR-1565).
 *
 * A step is one of a fixed set of command kinds. Its argv is passed to the specdojo CLI without a
 * shell, so a queue cannot run arbitrary shell. Each step starts only after the previous child
 * process has exited (the runner awaits the process it spawned, never a process-name search).
 */

export type QueueStepKind = "grade" | "exec-run" | "post-integration";
export type QueueOnFailure = "stop" | "continue";
export type QueueStepStatus = "pending" | "running" | "succeeded" | "failed";
export type QueueState =
  "pending" | "running" | "stopped" | "succeeded" | "completed_with_failures" | "cancelled";

export type QueueStep = {
  index: number;
  kind: QueueStepKind;
  /** specdojo CLI argv for `grade` / `exec-run`; `["build-dist"]` for `post-integration`. */
  argv: string[];
  on_failure: QueueOnFailure;
  status: QueueStepStatus;
  started_at?: string;
  completed_at?: string;
  exit_code?: number | null;
  summary?: string;
};

export type QueueRecord = {
  version: 1;
  queue_id: string;
  project_id: string;
  created_at: string;
  updated_at: string;
  state: QueueState;
  steps: QueueStep[];
  /** 1-based index of the step that stopped the queue. */
  stopped_step?: number;
  reason?: string;
};

export type QueueStepOutcome = { exitCode: number | null; summary: string };
export type QueueStepExecutor = (step: QueueStep, record: QueueRecord) => Promise<QueueStepOutcome>;

const QUEUE_ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,63}$/;
const FINISHED_STATES: readonly QueueState[] = [
  "succeeded",
  "completed_with_failures",
  "cancelled",
];
const REJECTED_EXEC_RUN_OPTIONS = ["--job", "--plan"];
const EXEC_RUN_TARGET_OPTIONS = ["--register", "--register-filter", "--auto", "--task"];

export function queuesDirectory(executionPath: string): string {
  return join(executionPath, "queues");
}

export function queueRecordPath(executionPath: string, queueId: string): string {
  return join(queuesDirectory(executionPath), `${queueId}.json`);
}

/** Runtime lock under `exec/.locks/`, which Git already ignores. */
export function queueLockPath(executionPath: string, queueId: string): string {
  return join(executionPath, "exec", ".locks", `queue-${queueId}.lock`);
}

export function validateQueueId(queueId: string): string {
  if (!QUEUE_ID_PATTERN.test(queueId)) {
    throw new Error(
      `Invalid queue id: ${queueId} (use lowercase letters, digits and hyphens, up to 64 characters)`,
    );
  }
  return queueId;
}

function hasOption(argv: readonly string[], option: string): boolean {
  return argv.some((token) => token === option || token.startsWith(`${option}=`));
}

/**
 * Parse one `--step` value. The value is split on whitespace only; quoting is not supported, and
 * the leading words select the step kind from the allowlist.
 */
export function parseQueueStepSpec(
  spec: string,
  onFailure: QueueOnFailure,
  index: number,
  projectId: string,
): QueueStep {
  const where = `step ${index}`;
  const allTokens = spec.trim().split(/\s+/).filter(Boolean);
  // `exec queue status` prints steps as `specdojo exec run ...`, so accept that spelling too.
  const tokens = allTokens[0] === "specdojo" ? allTokens.slice(1) : allTokens;
  if (tokens.some((token) => /["'`\\]/.test(token))) {
    throw new Error(`${where}: quotes and backslashes are not supported (no shell is used)`);
  }
  const head = tokens.slice(0, 2).join(" ");
  const rest = tokens.slice(2);
  const base = { index, on_failure: onFailure, status: "pending" as const };
  const withProject = (argv: string[]): string[] =>
    hasOption(argv, "--project") ? argv : [...argv, "--project", projectId];
  if (head === "grade run") {
    return { ...base, kind: "grade", argv: withProject(["grade", "run", ...rest]) };
  }
  if (head === "exec run") {
    const rejected = REJECTED_EXEC_RUN_OPTIONS.find((option) => hasOption(rest, option));
    if (rejected) throw new Error(`${where}: exec run ${rejected} is not supported in a queue`);
    if (!EXEC_RUN_TARGET_OPTIONS.some((option) => hasOption(rest, option))) {
      throw new Error(
        `${where}: exec run needs one of ${EXEC_RUN_TARGET_OPTIONS.join(", ")} (register or schedule)`,
      );
    }
    return { ...base, kind: "exec-run", argv: withProject(["exec", "run", ...rest]) };
  }
  if (head === "post-integration build-dist" && rest.length === 0) {
    return { ...base, kind: "post-integration", argv: ["build-dist"] };
  }
  throw new Error(
    `${where}: unsupported step: ${spec.trim() || "(empty)"} (allowed: "grade run ...", "exec run ...", "post-integration build-dist")`,
  );
}

export function createQueueRecord(params: {
  queueId: string;
  projectId: string;
  steps: ReadonlyArray<{ spec: string; onFailure: QueueOnFailure }>;
  now?: string;
}): QueueRecord {
  validateQueueId(params.queueId);
  if (params.steps.length === 0) throw new Error("A queue needs at least one --step");
  const now = params.now ?? new Date().toISOString();
  return {
    version: 1,
    queue_id: params.queueId,
    project_id: params.projectId,
    created_at: now,
    updated_at: now,
    state: "pending",
    steps: params.steps.map((step, offset) =>
      parseQueueStepSpec(step.spec, step.onFailure, offset + 1, params.projectId),
    ),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isQueueStep(value: unknown): value is QueueStep {
  return (
    isRecord(value) &&
    typeof value.index === "number" &&
    (value.kind === "grade" || value.kind === "exec-run" || value.kind === "post-integration") &&
    Array.isArray(value.argv) &&
    value.argv.every((token) => typeof token === "string") &&
    (value.on_failure === "stop" || value.on_failure === "continue") &&
    ["pending", "running", "succeeded", "failed"].includes(String(value.status))
  );
}

export function parseQueueRecord(value: unknown, source: string): QueueRecord {
  if (
    !isRecord(value) ||
    value.version !== 1 ||
    typeof value.queue_id !== "string" ||
    typeof value.project_id !== "string" ||
    typeof value.created_at !== "string" ||
    typeof value.updated_at !== "string" ||
    ![
      "pending",
      "running",
      "stopped",
      "succeeded",
      "completed_with_failures",
      "cancelled",
    ].includes(String(value.state)) ||
    !Array.isArray(value.steps) ||
    !value.steps.every(isQueueStep)
  ) {
    throw new Error(`Invalid queue record: ${source}`);
  }
  return value as QueueRecord;
}

export function loadQueueRecord(path: string): QueueRecord {
  if (!existsSync(path)) throw new Error(`Queue not found: ${path}`);
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    throw new Error(`Invalid queue record JSON: ${path}`, { cause: error });
  }
  return parseQueueRecord(parsed, path);
}

export function writeQueueRecord(path: string, record: QueueRecord): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(record, null, 2)}\n`, "utf8");
}

export function listQueueRecords(executionPath: string): {
  records: QueueRecord[];
  errors: string[];
} {
  const directory = queuesDirectory(executionPath);
  if (!existsSync(directory)) return { records: [], errors: [] };
  const records: QueueRecord[] = [];
  const errors: string[] = [];
  for (const name of readdirSync(directory)
    .filter((entry) => entry.endsWith(".json"))
    .sort()) {
    try {
      records.push(loadQueueRecord(join(directory, name)));
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }
  return { records, errors };
}

export function isQueueFinished(record: QueueRecord): boolean {
  return FINISHED_STATES.includes(record.state);
}

export function queueStepDisplay(step: QueueStep): string {
  return step.kind === "post-integration"
    ? "post-integration build-dist"
    : `specdojo ${step.argv.join(" ")}`;
}

/** Steps to run on this invocation: unfinished steps, plus the failed step that stopped it. */
function stepNeedsRun(step: QueueStep): boolean {
  if (step.status === "succeeded") return false;
  return !(step.status === "failed" && step.on_failure === "continue");
}

export class QueueBusyError extends Error {
  constructor(queueId: string, lockDir: string) {
    super(`Queue ${queueId} is already running (lock: ${lockDir})`);
    this.name = "QueueBusyError";
  }
}

/**
 * Run a queue's steps in order. A stopped queue resumes at the failed step, and a step left
 * `running` by a runner that died is run again. Cancellation is checked before each step.
 */
export async function runQueue(params: {
  recordPath: string;
  lockDir: string;
  execute: QueueStepExecutor;
  log?: (line: string) => void;
  acquire?: (lockDir: string) => LockHandle | null;
  release?: (handle: LockHandle) => void;
}): Promise<QueueRecord> {
  const log = params.log ?? ((line: string) => process.stdout.write(line));
  const initial = loadQueueRecord(params.recordPath);
  const acquire =
    params.acquire ??
    ((lockDir: string) =>
      tryAcquireLock(lockDir, { actor: "exec-queue", label: `queue ${initial.queue_id}` }));
  const release = params.release ?? releaseLock;
  if (isQueueFinished(initial)) {
    log(`[queue] ${initial.queue_id}: already ${initial.state}\n`);
    return initial;
  }
  mkdirSync(dirname(params.lockDir), { recursive: true });
  const handle = acquire(params.lockDir);
  if (!handle) throw new QueueBusyError(initial.queue_id, params.lockDir);
  try {
    const record = loadQueueRecord(params.recordPath);
    // `exec queue cancel` edits the file while this runner holds the lock; keep that state.
    const syncCancellation = (): boolean => {
      const latest = loadQueueRecord(params.recordPath);
      if (latest.state === "cancelled" && record.state === "running") {
        record.state = "cancelled";
        record.reason = latest.reason;
      }
      return record.state === "cancelled";
    };
    const save = (): void => {
      syncCancellation();
      record.updated_at = new Date().toISOString();
      writeQueueRecord(params.recordPath, record);
    };
    record.state = "running";
    delete record.stopped_step;
    delete record.reason;
    save();
    for (const step of record.steps) {
      if (!stepNeedsRun(step)) continue;
      if (syncCancellation()) {
        save();
        log(`[queue] ${record.queue_id}: cancelled before step ${step.index}\n`);
        return record;
      }
      log(`[queue] ${record.queue_id}: step ${step.index} start: ${queueStepDisplay(step)}\n`);
      step.status = "running";
      step.started_at = new Date().toISOString();
      delete step.completed_at;
      delete step.exit_code;
      delete step.summary;
      save();
      let outcome: QueueStepOutcome;
      try {
        outcome = await params.execute(step, record);
      } catch (error) {
        outcome = {
          exitCode: null,
          summary: error instanceof Error ? error.message : String(error),
        };
      }
      step.status = outcome.exitCode === 0 ? "succeeded" : "failed";
      step.completed_at = new Date().toISOString();
      step.exit_code = outcome.exitCode;
      step.summary = outcome.summary;
      log(`[queue] ${record.queue_id}: step ${step.index} ${step.status}: ${outcome.summary}\n`);
      if (step.status === "failed" && step.on_failure === "stop" && !syncCancellation()) {
        record.state = "stopped";
        record.stopped_step = step.index;
        record.reason = `step ${step.index} failed: ${outcome.summary}`;
        save();
        log(`[queue] ${record.queue_id}: stopped at step ${step.index}\n`);
        return record;
      }
      save();
    }
    if (syncCancellation()) {
      save();
      return record;
    }
    record.state = record.steps.some((step) => step.status === "failed")
      ? "completed_with_failures"
      : "succeeded";
    save();
    log(`[queue] ${record.queue_id}: ${record.state}\n`);
    return record;
  } finally {
    release(handle);
  }
}

/** Mark a queue cancelled. A running runner stops before its next step. */
export function cancelQueue(recordPath: string, reason: string): QueueRecord {
  const record = loadQueueRecord(recordPath);
  if (record.state === "succeeded" || record.state === "completed_with_failures") {
    throw new Error(`Queue ${record.queue_id} is already ${record.state}`);
  }
  record.state = "cancelled";
  record.reason = reason;
  record.updated_at = new Date().toISOString();
  writeQueueRecord(recordPath, record);
  return record;
}

/** One-line progress for `exec queue status` and `exec status`. */
export function formatQueueSummary(record: QueueRecord, lockDir: string): string {
  const done = record.steps.filter(
    (step) => step.status === "succeeded" || step.status === "failed",
  ).length;
  const running = record.steps.find((step) => step.status === "running");
  // A record left `running` without a live lock means the runner died; `exec queue run` resumes it.
  const state =
    record.state === "running" && !isLiveLock(lockDir)
      ? "running (runner not alive)"
      : record.state;
  const parts = [`${record.queue_id}`, state, `${done}/${record.steps.length}`];
  if (running) parts.push(`current=step ${running.index}: ${queueStepDisplay(running)}`);
  if (record.stopped_step !== undefined) parts.push(`stopped=step ${record.stopped_step}`);
  if (record.reason) parts.push(`reason=${record.reason}`);
  return parts.join("\t");
}
