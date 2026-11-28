import { spawn } from "node:child_process";
import { performance } from "node:perf_hooks";
import type { GitProcessOutcome } from "../shared/git.js";
import { EventLoopStallTracker } from "./validation-exit-timing.js";

/** Keep preparation and merge timings separate from parent-validation timings. */
export async function timeWorktreeOperation<T>(
  operation: string,
  work: () => Promise<T>,
): Promise<T> {
  const started = performance.now();
  const at = new Date().toISOString();
  const tracker = new EventLoopStallTracker();
  try {
    return await work();
  } finally {
    const timing = {
      event: "worktree-operation-timing",
      at,
      operation,
      duration_ms: Math.round(performance.now() - started),
      event_loop_delay_max_ms: Math.round(tracker.stop()),
    };
    try {
      process.stderr.write(`${JSON.stringify(timing)}\n`);
    } catch {
      // Diagnostics must not turn a successful preparation or merge into a failure.
    }
  }
}

/** Inherit output as before; settle on close so hooks and output finish before the next step. */
export function runWorktreeProcess(
  command: string,
  args: readonly string[],
  options: {
    cwd: string;
    env?: NodeJS.ProcessEnv;
    stdio: "inherit" | "pipe";
    shell?: false;
    maxBuffer?: number;
  },
  operation: string,
): Promise<GitProcessOutcome & { stdout: string; stderr: string }> {
  return timeWorktreeOperation(
    operation,
    () =>
      new Promise((resolve) => {
        let error: Error | undefined;
        const stdout: Buffer[] = [];
        const stderr: Buffer[] = [];
        let size = 0;
        const child = spawn(command, args, {
          cwd: options.cwd,
          env: options.env,
          stdio: options.stdio === "inherit" ? "inherit" : ["ignore", "pipe", "pipe"],
          shell: false,
        });
        const collect = (chunks: Buffer[]) => (chunk: Buffer) => {
          size += chunk.length;
          if (size > (options.maxBuffer ?? 16 * 1024 * 1024)) {
            error ??= Object.assign(new Error("worktree process output exceeded maxBuffer"), {
              code: "ENOBUFS",
            });
            child.kill("SIGTERM");
            return;
          }
          chunks.push(chunk);
        };
        child.stdout?.on("data", collect(stdout));
        child.stderr?.on("data", collect(stderr));
        child.on("error", (cause) => {
          error = cause;
        });
        child.on("close", (status, signal) =>
          resolve({
            status,
            signal,
            ...(error ? { error } : {}),
            stdout: Buffer.concat(stdout).toString("utf8"),
            stderr: Buffer.concat(stderr).toString("utf8"),
          }),
        );
      }),
  );
}
