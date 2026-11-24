import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { ExecEvidence } from "../../../../src/exec/evidence.js";
import {
  pruneVanishedInitialChangeTargets,
  recordExcludedCoverageTargets,
  resumedTargetCoverageFailure,
} from "../../../../src/exec/run/agent.js";

const TARGETLESS_PLAN = ["---", "specdojo:", "  task_id: PJR-AB12", "---", "", "# Plan", ""].join(
  "\n",
);
const DECLARED_PLAN = [
  "---",
  "specdojo:",
  "  task_id: PJR-AB12",
  "  targets:",
  "    - docs/declared.md",
  "---",
  "",
  "# Plan",
  "",
].join("\n");

function makeEvidence(): ExecEvidence {
  return {
    schema_version: 1,
    task_id: "PJR-AB12",
    run_id: "run-1",
    stage: {
      role: "executor",
      actor: "exec-1",
      status: "succeeded",
      started_at: "2026-11-21T00:00:00Z",
      completed_at: "2026-11-21T00:10:00Z",
      exit_code: 0,
      attempts: 1,
    },
    changes: [{ path: "docs/ticket.md", status: "M" }],
    diff_summary: { files_changed: 1, summary: "1 file changed" },
    validations: [],
    final_message: "done",
    completion_status: "complete",
    log_refs: [],
  };
}

describe("resumed target coverage", () => {
  let dir: string;
  let evidencePath: string;

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), "specdojo-resumed-coverage-"));
    evidencePath = path.join(dir, "evidence.json");
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("marks a coverage gap as incomplete work with the missing target and the resume hint", () => {
    const evidence = makeEvidence();

    const reason = resumedTargetCoverageFailure({
      resumed: true,
      plan: TARGETLESS_PLAN,
      evidence,
      evidencePath,
      initialChangeTargets: ["dist/stray.html"],
      resumeHint: "resume with --resume-from executor",
    });

    expect(reason).toBe(
      "resumed executor did not account for every plan target: dist/stray.html; resume with --resume-from executor",
    );
    const written = JSON.parse(readFileSync(evidencePath, "utf8")) as ExecEvidence;
    expect(written.stage.status).toBe("succeeded");
    expect(written.completion_status).toBe("incomplete");
    expect(written.block_reason).toBe(reason);
  });

  it("returns no failure once every lower-bound target is excluded", () => {
    const evidence = makeEvidence();

    const reason = resumedTargetCoverageFailure({
      resumed: true,
      plan: TARGETLESS_PLAN,
      evidence,
      evidencePath,
      initialChangeTargets: [],
    });

    expect(reason).toBeUndefined();
    expect(evidence.completion_status).toBe("complete");
  });

  it("never prunes when the plan declares targets", () => {
    const actual = pruneVanishedInitialChangeTargets({
      plan: DECLARED_PLAN,
      initialChangeTargets: ["dist/stray.html"],
      worktreePath: dir,
    });

    expect(actual).toEqual({ targets: ["dist/stray.html"], excluded: [] });
  });

  it("records excluded targets in the evidence file", () => {
    const evidence = makeEvidence();

    recordExcludedCoverageTargets(evidence, evidencePath, [
      { target: "dist/stray.html", reason: "deleted before resume" },
    ]);

    const written = JSON.parse(readFileSync(evidencePath, "utf8")) as ExecEvidence;
    expect(written.excluded_coverage_targets).toEqual([
      { target: "dist/stray.html", reason: "deleted before resume" },
    ]);
  });
});
