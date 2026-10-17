import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { assertCheckpointInspection } from "../../../src/exec/worktree-ops-lifecycle.js";

describe("checkpoint inspection", () => {
  it("keeps the exit status and stderr summary in the error and full output in the failure log", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-checkpoint-inspection-"));
    try {
      const logPath = join(dir, "checkpoint.log");
      const args = ["diff", "--cached", "--quiet", "--", "plan.md"];
      const result = {
        status: 128,
        signal: null,
        stdout: "partial diff output",
        stderr: "fatal: unable to read the index",
      };

      expect(() => assertCheckpointInspection(args, result, logPath)).toThrow(
        /Failed to inspect execution checkpoint changes: git diff failed: exit 128 \/ fatal: unable to read the index/,
      );

      const log = readFileSync(logPath, "utf8");
      expect(log).toContain("git diff checkpoint inspection");
      expect(log).toContain("exit: 128");
      expect(log).toContain("partial diff output");
      expect(log).toContain("fatal: unable to read the index");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it.each([0, 1])("accepts git diff status %i", (status) => {
    expect(() =>
      assertCheckpointInspection(["diff", "--cached", "--quiet"], {
        status,
        signal: null,
      }),
    ).not.toThrow();
  });
});
