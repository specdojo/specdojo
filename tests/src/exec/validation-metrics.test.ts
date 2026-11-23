import { EventEmitter } from "node:events";
import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import type * as ChildProcessModule from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, writeSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PassThrough } from "node:stream";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ParentValidationGate,
  runParentValidationBatch,
} from "../../../src/exec/parent-validation.js";
import { setActiveExecLocksDir } from "../../../src/exec/slot-lock.js";
import {
  collectValidationActivity,
  collectValidationLoad,
  trackExecutor,
  ValidationTestFiles,
  withValidationMetrics,
} from "../../../src/exec/validation-metrics.js";
import ParentValidationReporter from "../../helpers/parent-validation-reporter.js";
import type { TestModule } from "vitest/node";
import { executeAgent } from "../../../src/exec/run/agent.js";

vi.mock("node:child_process", async (importOriginal) => {
  const original = await importOriginal<typeof ChildProcessModule>();
  return { ...original, spawn: vi.fn(original.spawn) };
});

const directories: string[] = [];
function directory() {
  const path = mkdtempSync(join(tmpdir(), "validation-metrics-"));
  directories.push(path);
  return path;
}
function records(path: string): Record<string, unknown>[] {
  return readFileSync(path, "utf8")
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line) as Record<string, unknown>);
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  setActiveExecLocksDir(undefined);
  for (const path of directories.splice(0)) rmSync(path, { recursive: true, force: true });
});

describe("parent validation diagnostics", () => {
  it("samples PSI and byte-based memory/swap independently and tolerates missing proc files", () => {
    const root = directory();
    expect(collectValidationLoad(root)).toEqual({});
    mkdirSync(join(root, "pressure"));
    writeFileSync(
      join(root, "pressure", "io"),
      "some avg10=2.00 avg60=1.00 avg300=0.00 total=42\n",
    );
    writeFileSync(
      join(root, "meminfo"),
      "MemTotal: 100 kB\nMemAvailable: 30 kB\nSwapTotal: 50 kB\nSwapFree: 20 kB\n",
    );
    expect(collectValidationLoad(root)).toEqual({
      pressure: { io: "some avg10=2.00 avg60=1.00 avg300=0.00 total=42" },
      memory: {
        total_bytes: 102400,
        available_bytes: 30720,
        used_bytes: 71680,
        swap_total_bytes: 51200,
        swap_used_bytes: 30720,
      },
    });
  });

  it("counts primary/join runs and live executor children without double-counting local markers", () => {
    const root = directory();
    setActiveExecLocksDir(root);
    for (const lock of ["exec-run.lock", "exec-run-join/slot-1"]) {
      mkdirSync(join(root, lock), { recursive: true });
      writeFileSync(
        join(root, lock, "owner.json"),
        JSON.stringify({ actor: "test", pid: process.pid, token: "fixture" }),
      );
    }
    const stop = trackExecutor(process.pid, "/worktrees/item");
    try {
      const activity = collectValidationActivity();
      expect(activity.run_count).toBe(2);
      expect(activity.executor_count).toBe(1);
      expect(activity.executors[0]).toEqual({
        pid: process.pid,
        runner_pid: process.pid,
        worktree: "item",
      });
      writeFileSync(join(root, "metrics-executors", "broken.json"), "{");
      writeFileSync(
        join(root, "metrics-executors", "dead.json"),
        JSON.stringify({ pid: 2147483647, runner_pid: process.pid, worktree: "dead" }),
      );
      expect(collectValidationActivity().executor_count).toBe(1);
    } finally {
      stop();
    }
    expect(collectValidationActivity().executor_count).toBe(0);
  });

  it("keeps file notifications across chunks and retains active files after bounded output truncation", () => {
    const tracker = new ValidationTestFiles();
    tracker.observe('[parent-validation:test-file] {"event":"start","file":"tests/hang.test.ts"');
    tracker.observe("}\n" + "x".repeat(40_000));
    expect(tracker.snapshot().active_test_files).toEqual(["tests/hang.test.ts"]);
    expect(tracker.snapshot().output_tail.length).toBe(16384);
    tracker.observe(
      '\n[parent-validation:test-file] {"event":"end","file":"tests/hang.test.ts"}\n',
    );
    expect(tracker.snapshot().active_test_files).toEqual([]);
  });

  it("the Vitest reporter emits start/end notifications accepted by the tracker", () => {
    const tracker = new ValidationTestFiles();
    vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
      tracker.observe(String(chunk));
      return true;
    });
    const reporter = new ParentValidationReporter();
    const module = { moduleId: join(process.cwd(), "tests/active.test.ts") } as TestModule;
    reporter.onTestModuleStart(module);
    expect(tracker.snapshot().active_test_files).toEqual(["tests/active.test.ts"]);
    reporter.onTestModuleEnd(module);
    expect(tracker.snapshot().active_test_files).toEqual([]);
  });

  it("collects per-file durations from end notifications, slowest first", () => {
    const tracker = new ValidationTestFiles();
    const line = (value: object) => `[parent-validation:test-file] ${JSON.stringify(value)}\n`;
    tracker.observe(line({ event: "end", file: "tests/a.test.ts", duration_ms: 10 }));
    tracker.observe(line({ event: "end", file: "tests/b.test.ts", duration_ms: 30 }));
    tracker.observe(line({ event: "end", file: "tests/c.test.ts" }));
    expect(tracker.durationsSnapshot()).toEqual([
      { file: "tests/b.test.ts", duration_ms: 30 },
      { file: "tests/a.test.ts", duration_ms: 10 },
    ]);
  });

  it("persists both queued batches, measures wait, and appends validation outcomes in order", async () => {
    const path = join(directory(), "metrics.jsonl");
    const gate = new ParentValidationGate(1, () => undefined);
    let release!: () => void;
    let started!: () => void;
    const ready = new Promise<void>((resolve) => {
      started = resolve;
    });
    const first = withValidationMetrics("first", path, () =>
      gate.run("first", ["typecheck"], () =>
        runParentValidationBatch(["typecheck"], ".", async () => {
          started();
          await new Promise<void>((resolve) => {
            release = resolve;
          });
          return { exitCode: 0, stdout: "ok", stderr: "" };
        }),
      ),
    );
    await ready;
    const second = withValidationMetrics("second", path, () =>
      gate.run("second", ["lint-md"], () =>
        runParentValidationBatch(["lint-md"], ".", async () => ({
          exitCode: 1,
          stdout: "",
          stderr: "failure",
        })),
      ),
    );
    expect(records(path).filter((row) => row.event === "gate-queued")).toHaveLength(2);
    release();
    const results = await Promise.all([first, second]);
    expect(results.map((batch) => batch.validations[0].status)).toEqual(["passed", "failed"]);
    const rows = records(path);
    const ends = rows.filter((row) => row.event === "validation-end");
    expect(ends.map((row) => row.id)).toEqual(["typecheck", "lint-md"]);
    expect(
      ends.every((row) => Number(row.duration_ms) >= 0 && typeof row.started_at === "string"),
    ).toBe(true);
    expect(ends[1].gate_wait_ms).toBeGreaterThan(0);
    expect(rows[0].batch_id).not.toBe(rows.find((row) => row.label === "second")?.batch_id);
  });

  it("records real invoker timeout before SIGTERM, including still-active files and resource samples", async () => {
    vi.useFakeTimers();
    const path = join(directory(), "metrics.jsonl");
    let eventAtKill: unknown;
    const child = Object.assign(new EventEmitter(), {
      stdout: new PassThrough(),
      stderr: new PassThrough(),
      kill: vi.fn(() => {
        eventAtKill = records(path).at(-1)?.event;
        child.emit("close", null);
        return true;
      }),
    });
    // PJR-6690: the parent validation hands the child file descriptors instead of pipes, so the
    // fake child writes its reporter line to the stdout descriptor as a real child would.
    vi.mocked(spawn).mockImplementationOnce(((
      _command: string,
      _args: readonly string[],
      options: { stdio: unknown[] },
    ) => {
      const stdoutFd = options.stdio[1];
      if (typeof stdoutFd !== "number") throw new Error("expected a file descriptor for stdout");
      writeSync(
        stdoutFd,
        '[parent-validation:test-file] {"event":"start","file":"tests/hanging.test.ts"}\n',
      );
      return child as unknown as ChildProcessWithoutNullStreams;
    }) as unknown as typeof spawn);
    const batch = await withValidationMetrics("timeout", path, async () => {
      const pending = runParentValidationBatch(["test-unit"], ".");
      // Fake timers run callbacks in the advancing caller's async context, unlike real timers.
      await vi.advanceTimersByTimeAsync(600_000);
      return await pending;
    });
    expect(batch.validations[0].status).toBe("failed");
    const rows = records(path);
    const timeout = rows.find((row) => row.event === "validation-timeout");
    expect(timeout).toMatchObject({
      id: "test-unit",
      active_test_files: ["tests/hanging.test.ts"],
      timeout_ms: 600_000,
    });
    expect(timeout).toHaveProperty("load");
    expect(timeout).toHaveProperty("activity");
    expect(eventAtKill).toBe("validation-timeout");
    expect(child.kill).toHaveBeenCalledWith("SIGTERM");
    expect(rows.at(-1)).toMatchObject({
      event: "validation-end",
      timed_out: true,
      status: "failed",
    });
  });

  it("separates shared-lock wait from local wait without changing the batch result", async () => {
    const root = directory();
    const path = join(root, "metrics.jsonl");
    const occupied = join(root, "parent-validation", "slot-1");
    mkdirSync(occupied, { recursive: true });
    writeFileSync(
      join(occupied, "owner.json"),
      JSON.stringify({ actor: "other", pid: process.pid, token: "fixture" }),
    );
    const gate = new ParentValidationGate(
      1,
      () => {
        rmSync(occupied, { recursive: true, force: true });
      },
      root,
    );
    const result = await withValidationMetrics("shared", path, () =>
      gate.run("shared", ["typecheck"], async () => "unchanged"),
    );
    expect(result).toBe("unchanged");
    expect(records(path).find((row) => row.event === "gate-acquired")).toMatchObject({
      local_wait_ms: expect.any(Number),
      shared_wait_ms: expect.any(Number),
    });
    expect(Number(records(path).at(-1)?.shared_wait_ms)).toBeGreaterThan(0);
  });

  it("counts executor execution until close and excludes reporter execution", async () => {
    for (const role of ["executor", "reporter"] as const) {
      const child = Object.assign(new EventEmitter(), {
        pid: process.pid,
        stdin: new PassThrough(),
        stdout: new PassThrough(),
        stderr: new PassThrough(),
      });
      vi.mocked(spawn).mockReturnValueOnce(child as unknown as ChildProcessWithoutNullStreams);
      const pending = executeAgent(
        "fixture",
        "prompt",
        undefined,
        undefined,
        undefined,
        directory(),
        {},
        true,
        role,
      );
      expect(collectValidationActivity().executor_count).toBe(role === "executor" ? 1 : 0);
      child.emit("close", 0);
      expect((await pending).exitCode).toBe(0);
      expect(collectValidationActivity().executor_count).toBe(0);
    }
  });

  it("retains repository identity, records skipped validations, and preserves invoker errors", async () => {
    const path = join(directory(), "metrics.jsonl");
    const invoke = vi.fn(async () => ({ exitCode: 0, stdout: "ok", stderr: "" }));
    await withValidationMetrics("repos", path, () =>
      runParentValidationBatch(
        [
          { id: "typecheck", repo: "app" },
          { id: "lint-md", paths: ["docs/**"] },
        ],
        { project: ".", repos: { app: "." } },
        invoke,
        { changedPaths: ["app:src/index.ts"] },
      ),
    );
    expect(invoke).toHaveBeenCalledTimes(1);
    expect(records(path)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ event: "validation-start", repo: "app" }),
        expect.objectContaining({ event: "validation-skipped", id: "lint-md" }),
      ]),
    );
    await expect(
      withValidationMetrics("error", path, () =>
        runParentValidationBatch(["typecheck"], ".", async () => {
          throw new Error("fixture failure");
        }),
      ),
    ).rejects.toThrow("fixture failure");
    expect(records(path).at(-1)).toMatchObject({
      event: "validation-end",
      error: "Error: fixture failure",
    });
  });

  it("does not fail validation when the metrics destination is unwritable", async () => {
    const file = join(directory(), "file");
    writeFileSync(file, "not a directory");
    const batch = await withValidationMetrics("unwritable", join(file, "metrics.jsonl"), () =>
      runParentValidationBatch(["typecheck"], ".", async () => ({
        exitCode: 0,
        stdout: "ok",
        stderr: "",
      })),
    );
    expect(batch.validations[0].status).toBe("passed");
  });
});
