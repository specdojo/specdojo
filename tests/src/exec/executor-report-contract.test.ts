import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  buildExecutorEvidence,
  enforceExecutorReportContract,
  executorReportContractFailure,
  executorStageResumeHint,
  type ExecEvidence,
} from "../../../src/exec/evidence.js";

const VALID_RECORD = {
  location: "## 1. 概要",
  category: "repetition",
  action: "delete",
  reason: "同じ主張が 2 節にある",
  cause: { type: "document" },
};

function evidenceFromReport(report: Record<string, unknown>): ExecEvidence {
  return buildExecutorEvidence({
    taskId: "bes-index-080",
    runId: "run-1",
    actor: "executor",
    status: "succeeded",
    startedAt: "2026-11-15T00:00:00Z",
    completedAt: "2026-11-15T00:01:00Z",
    exitCode: 0,
    attempts: 1,
    stdout: `<specdojo_executor_evidence>${JSON.stringify(report)}</specdojo_executor_evidence>`,
    stderr: "",
    changes: [],
    diffStat: "",
    logRefPath: "executor.log",
  }).evidence;
}

describe("executorReportContractFailure", () => {
  it.each([
    ["missing", { completion_status: "complete", final_message: "done" }],
    ["not an array", { final_message: "done", condense_records: "none" }],
    ["malformed records", { final_message: "done", condense_records: [{ location: "x" }] }],
  ])("rejects a condense edit report whose condense_records is %s", (_label, report) => {
    const evidence = evidenceFromReport(report);

    const actual = executorReportContractFailure(evidence, { approach: "condense", mode: "edit" });

    expect(actual).toContain("condense_records required by approach condense");
  });

  it.each([
    ["an empty list", []],
    ["valid records", [VALID_RECORD]],
  ])("accepts a condense edit report with %s", (_label, records) => {
    const evidence = evidenceFromReport({ final_message: "done", condense_records: records });

    expect(
      executorReportContractFailure(evidence, { approach: "condense", mode: "edit" }),
    ).toBeUndefined();
  });

  it.each([
    [{ approach: "fully-guided", mode: "edit" }],
    [{ approach: "condense", mode: "review" }],
    [{}],
  ])("does not require condense_records for %j", (contract) => {
    const evidence = evidenceFromReport({ final_message: "done" });

    expect(executorReportContractFailure(evidence, contract)).toBeUndefined();
  });
});

describe("executorStageResumeHint", () => {
  it("names the schedule and register commands that resume from the executor", () => {
    expect(executorStageResumeHint({ kind: "schedule", taskId: "bes-index-080" })).toBe(
      "specdojo exec resume --task bes-index-080 --resume-from executor (add --executor-by <nickname> to switch the executor agent)",
    );
    expect(executorStageResumeHint({ kind: "register", itemId: "PJR-1GCD" })).toContain(
      "specdojo exec run --register PJR-1GCD --worktree --resume --resume-from executor",
    );
  });
});

describe("enforceExecutorReportContract", () => {
  let dir: string;
  let evidencePath: string;

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), "specdojo-contract-"));
    evidencePath = path.join(dir, "evidence.json");
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("marks and persists the evidence as an incomplete executor report with the resume step", () => {
    const evidence = evidenceFromReport({ completion_status: "complete", final_message: "done" });
    writeFileSync(evidencePath, JSON.stringify(evidence), "utf8");

    const reason = enforceExecutorReportContract({
      evidence,
      evidencePath,
      contract: { approach: "condense", mode: "edit" },
      resumeHint: executorStageResumeHint({ kind: "schedule", taskId: "bes-index-080" }),
    });

    expect(reason).toContain("lacks valid condense_records");
    expect(reason).toContain(
      "next: specdojo exec resume --task bes-index-080 --resume-from executor",
    );
    const persisted = JSON.parse(readFileSync(evidencePath, "utf8")) as ExecEvidence;
    expect(persisted.completion_status).toBe("incomplete");
    expect(persisted.block_reason).toBe(reason);
    expect(persisted.stage.status).toBe("succeeded");
  });

  it("leaves valid evidence and its file untouched", () => {
    const evidence = evidenceFromReport({ final_message: "done", condense_records: [] });
    writeFileSync(evidencePath, "unchanged", "utf8");

    const reason = enforceExecutorReportContract({
      evidence,
      evidencePath,
      contract: { approach: "condense", mode: "edit" },
      resumeHint: "resume",
    });

    expect(reason).toBeUndefined();
    expect(evidence.completion_status).toBeUndefined();
    expect(readFileSync(evidencePath, "utf8")).toBe("unchanged");
  });
});
