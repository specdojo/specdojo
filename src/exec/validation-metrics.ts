import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import {
  appendFileSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join } from "node:path";
import { performance } from "node:perf_hooks";
import { getActiveExecLocksDir, isLiveLock, livePoolHolders, readLockOwner } from "./slot-lock.js";
import { redactSensitiveText } from "./evidence.js";

// Diagnostics are observational: inaccessible /proc, locks, or output must never fail a run.
function optional<T>(read: () => T): T | undefined {
  try {
    return read();
  } catch {
    return undefined;
  }
}

export function collectValidationLoad(procRoot = "/proc") {
  const pressure = Object.fromEntries(
    ["cpu", "memory", "io"].flatMap((resource) => {
      const value = optional(() =>
        readFileSync(join(procRoot, "pressure", resource), "utf8").trim(),
      );
      return value === undefined ? [] : [[resource, value]];
    }),
  );
  const memory = optional(() => {
    const text = readFileSync(join(procRoot, "meminfo"), "utf8");
    const fields = Object.fromEntries(
      [...text.matchAll(/^(\w+):\s+(\d+) kB$/gm)].map((match) => [
        match[1],
        Number(match[2]) * 1024,
      ]),
    );
    if (
      ![fields.MemTotal, fields.MemAvailable, fields.SwapTotal, fields.SwapFree].every(
        Number.isFinite,
      )
    )
      return undefined;
    return {
      total_bytes: fields.MemTotal,
      available_bytes: fields.MemAvailable,
      used_bytes: fields.MemTotal - fields.MemAvailable,
      swap_total_bytes: fields.SwapTotal,
      swap_used_bytes: fields.SwapTotal - fields.SwapFree,
    };
  });
  const loadavg = optional(() => readFileSync(join(procRoot, "loadavg"), "utf8").trim());
  return {
    ...(Object.keys(pressure).length ? { pressure } : {}),
    ...(memory ? { memory } : {}),
    ...(loadavg ? { loadavg } : {}),
  };
}

type ExecutorActivity = { pid: number; runner_pid: number; worktree: string };
const localExecutors = new Map<string, ExecutorActivity>();

/** Called only while an executor child is alive; no command, prompt, or environment is stored. */
export function trackExecutor(pid: number | undefined, cwd: string): () => void {
  if (!pid) return () => undefined;
  const key = `${process.pid}-${pid}-${randomUUID()}`;
  const activity = { pid, runner_pid: process.pid, worktree: basename(cwd) };
  localExecutors.set(key, activity);
  const root = getActiveExecLocksDir();
  const file = root ? join(root, "metrics-executors", `${key}.json`) : undefined;
  if (file)
    optional(() => {
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, JSON.stringify(activity));
    });
  return () => {
    localExecutors.delete(key);
    if (file) optional(() => unlinkSync(file));
  };
}

function alive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return (error as NodeJS.ErrnoException).code === "EPERM";
  }
}

export function collectValidationActivity(lockRoot = getActiveExecLocksDir()) {
  const executors = new Map(localExecutors);
  const runs: { pid: number; actor: string }[] = [];
  if (lockRoot) {
    optional(() => {
      const primary = join(lockRoot, "exec-run.lock");
      const owner = isLiveLock(primary) ? readLockOwner(primary) : null;
      if (owner) runs.push({ pid: owner.pid, actor: owner.actor });
      for (const slot of livePoolHolders(join(lockRoot, "exec-run-join"))) {
        if (slot.owner) runs.push({ pid: slot.owner.pid, actor: slot.owner.actor });
      }
    });
    const directory = join(lockRoot, "metrics-executors");
    for (const name of optional(() => readdirSync(directory)) ?? []) {
      if (!name.endsWith(".json")) continue;
      optional(() => {
        const value = JSON.parse(readFileSync(join(directory, name), "utf8")) as ExecutorActivity;
        if (
          Number.isSafeInteger(value.pid) &&
          value.pid > 0 &&
          Number.isSafeInteger(value.runner_pid) &&
          value.runner_pid > 0 &&
          typeof value.worktree === "string" &&
          alive(value.pid) &&
          alive(value.runner_pid)
        )
          executors.set(name.slice(0, -5), value);
      });
    }
  }
  return {
    scope: lockRoot ? "project-locks" : "process",
    run_count: lockRoot ? runs.length : 1,
    runs: lockRoot ? runs : [{ pid: process.pid }],
    executor_count: executors.size,
    executors: [...executors.values()],
  };
}

type MetricsContext = { batch: string; label: string; path?: string; gateWaitMs: number };
const contexts = new AsyncLocalStorage<MetricsContext>();

export function withValidationMetrics<T>(
  label: string,
  path: string | undefined,
  task: () => Promise<T>,
): Promise<T> {
  return contexts.run({ batch: randomUUID(), label, path, gateWaitMs: 0 }, task);
}

export function validationMetric(event: string, fields: Record<string, unknown> = {}): void {
  const context = contexts.getStore();
  if (!context) return;
  optional(() => {
    const line =
      redactSensitiveText(
        JSON.stringify({
          schema_version: 1,
          batch_id: context.batch,
          label: context.label,
          runner_pid: process.pid,
          event,
          at: new Date().toISOString(),
          gate_wait_ms: context.gateWaitMs,
          ...fields,
          load: collectValidationLoad(),
          activity: collectValidationActivity(),
        }),
      ) + "\n";
    if (context.path) {
      mkdirSync(dirname(context.path), { recursive: true });
      appendFileSync(context.path, line);
    } else process.stdout.write(`  Parent validation metrics: ${line}`);
  });
}

export function recordValidationGateWait(start: number, localWaitMs: number): void {
  const context = contexts.getStore();
  const total = performance.now() - start;
  if (context) context.gateWaitMs = total;
  validationMetric("gate-acquired", {
    local_wait_ms: localWaitMs,
    shared_wait_ms: Math.max(0, total - localWaitMs),
  });
}

export const TEST_FILE_METRIC_PREFIX = "[parent-validation:test-file] ";

/** Bounded stream parser; active files come from notifications, never guessed from completed tests. */
export class ValidationTestFiles {
  private pending = "";
  private readonly active = new Set<string>();
  private tail = "";

  observe(chunk: string): void {
    this.tail = (this.tail + chunk).slice(-16_384);
    const lines = (this.pending + chunk).split("\n");
    this.pending = (lines.pop() ?? "").slice(-16_384);
    for (const line of lines) {
      const index = line.indexOf(TEST_FILE_METRIC_PREFIX);
      if (index < 0) continue;
      optional(() => {
        const value = JSON.parse(line.slice(index + TEST_FILE_METRIC_PREFIX.length)) as {
          event: string;
          file: string;
        };
        if (typeof value.file !== "string" || value.file.length > 4096) return;
        if (value.event === "start" && this.active.size < 256) this.active.add(value.file);
        if (value.event === "end") this.active.delete(value.file);
      });
    }
  }

  snapshot() {
    return { active_test_files: [...this.active], output_tail: redactSensitiveText(this.tail) };
  }
}
