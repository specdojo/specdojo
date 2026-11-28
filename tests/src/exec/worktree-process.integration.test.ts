import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { invokeParentValidation } from "../../../src/exec/parent-validation.js";
import { withValidationMetrics } from "../../../src/exec/validation-metrics.js";
import { runWorktreeProcess } from "../../../src/exec/worktree-process.js";

describe("asynchronous worktree processes", () => {
  it.each(["npm-ci", "specdojo-build", "build-if-stale", "yaml-pages-build"])(
    "detects a validation exit while %s is still running",
    async (operation) => {
      const root = await mkdtemp(join(tmpdir(), "worktree-process-"));
      try {
        const metricsPath = join(root, "metrics.jsonl");
        const validation = withValidationMetrics("test", metricsPath, () =>
          invokeParentValidation(
            {
              id: "validate-schema",
              command: process.execPath,
              args: ["-e", 'setTimeout(() => process.stdout.write("done\\n"), 100)'],
              displayCommand: "validation fixture",
              timeoutMs: 10000,
            },
            root,
          ),
        );
        let finished = false;
        const work = runWorktreeProcess(
          process.execPath,
          ["-e", "setTimeout(() => {}, 2000)"],
          { cwd: root, stdio: "pipe" },
          operation,
        ).then((result) => {
          finished = true;
          return result;
        });
        try {
          expect((await validation).exitCode).toBe(0);
          expect(finished).toBe(false);
          const timing = (await readFile(metricsPath, "utf8"))
            .trim()
            .split("\n")
            .map(
              (line) =>
                JSON.parse(line) as {
                  event: string;
                  detection_lag_ms: number;
                  event_loop_delay_max_ms: number;
                },
            )
            .find((line) => line.event === "validation-exit-timing");
          expect(timing?.detection_lag_ms).toBeLessThan(1000);
          expect(timing?.event_loop_delay_max_ms).toBeLessThan(1000);
        } finally {
          expect((await work).status).toBe(0);
        }
      } finally {
        await rm(root, { recursive: true, force: true });
      }
    },
  );

  it("preserves launch failures and nonzero exit codes", async () => {
    const missing = await runWorktreeProcess(
      "specdojo-nonexistent-fixture",
      [],
      { cwd: tmpdir(), stdio: "pipe" },
      "fixture",
    );
    expect(missing.error).toBeDefined();
    expect(missing.status).not.toBe(0);
    const failed = await runWorktreeProcess(
      process.execPath,
      ["-e", 'process.stderr.write("failed"); process.exitCode = 7'],
      { cwd: tmpdir(), stdio: "pipe" },
      "fixture",
    );
    expect(failed.status).toBe(7);
    expect(failed.stderr).toBe("failed");
  });
});
