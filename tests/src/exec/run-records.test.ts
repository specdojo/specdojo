import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { collectExecRecords } from "../../../src/dashboard/exec-records.js";
import { pipelineStateLocation } from "../../../src/exec/pipeline-state.js";
import { generateSinglePlan } from "../../../src/exec/plans.js";
import { scaffoldResult } from "../../../src/exec/results.js";
import { taskPaths } from "../../../src/exec/worktree-ops-commit.js";
import {
  findRunRecord,
  listRunRecords,
  recordIdentity,
  recordRef,
  resumeStatePaths,
  runRecordPaths,
  snapshotRunAttempt,
  taskEvidencePaths,
  taskRecordPaths,
} from "../../../src/exec/run-records.js";

const roots: string[] = [];
function fixture(): string {
  const root = mkdtempSync(join(tmpdir(), "specdojo-run-records-"));
  roots.push(root);
  return root;
}
function write(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("run record layout", () => {
  it.each([
    ["register", "PJR-AB12"],
    ["schedule", "T-TEST-doc-010"],
    ["job", "JBR-example-123"],
  ] as const)("groups %s records under the item and run", (origin, item) => {
    const records = runRecordPaths("execution", origin, item, "run-1");
    const directory = join("execution", "runs", origin, item, "run-1");
    expect(records).toMatchObject({
      directory,
      plan: join(directory, "plan.md"),
      result: join(directory, "result.md"),
      evidence: join(directory, "evidence.json"),
      state: join(directory, "pipeline-state.json"),
    });
    expect(records.log("executor.log")).toBe(join(directory, "executor.log"));
  });

  it("keeps review runs under the original register item or job execution", () => {
    expect(recordIdentity("PJR-AB12-post-review")).toEqual({
      origin: "register",
      itemId: "PJR-AB12",
    });
    expect(recordIdentity("JBR-example-123-review")).toEqual({
      origin: "job",
      itemId: "JBR-example-123",
    });
    expect(
      taskRecordPaths("execution", "PJR-AB12-post-review", "run-1-post-review").directory,
    ).toBe(join("execution", "runs", "register", "PJR-AB12", "run-1-post-review"));
  });

  it("preserves long run identities and rejects traversal segments", () => {
    const run = `${"task-".repeat(20)}-20261107T010203Z-aabbccdd`;
    expect(runRecordPaths("execution", "schedule", "T-TEST", run).directory.endsWith(run)).toBe(
      true,
    );
    expect(() => runRecordPaths("execution", "schedule", "..", "run")).toThrow();
    expect(() => runRecordPaths("execution", "schedule", "task", "..")).toThrow();
  });

  it("reads both layouts and prefers the new record for a task", () => {
    const execution = fixture();
    const legacy = join(execution, "exec", "plans", "T-TEST-plan.md");
    write(legacy, "---\nspecdojo:\n  task_id: T-TEST\n---\nlegacy\n");
    expect(findRunRecord(execution, "plan", "T-TEST")).toBe(legacy);
    const next = taskRecordPaths(execution, "T-TEST", "run-1");
    write(next.plan, "---\nspecdojo:\n  task_id: T-TEST\n---\nnew\n");
    expect(findRunRecord(execution, "plan", "T-TEST")).toBe(next.plan);
    expect(findRunRecord(execution, "plan", "run-1")).toBe(next.plan);
    expect(listRunRecords(execution, "plan")).toEqual([next.plan, legacy]);
    expect(readFileSync(legacy, "utf8")).toContain("legacy");
  });

  it("finds legacy resume state using the historical truncated task directory", () => {
    const execution = fixture();
    const taskId = `T-${"long-".repeat(20)}`;
    const state = join(
      execution,
      "exec",
      "evidence",
      taskId.slice(0, 80),
      "run-1",
      "pipeline-state.json",
    );
    write(state, "{}");
    expect(resumeStatePaths(execution, taskId)).toEqual([state]);
    expect(taskEvidencePaths(execution, taskId, "run-1").state).toBe(state);
    expect(
      pipelineStateLocation({
        repoRoot: execution,
        worktreePath: execution,
        executionPath: execution,
        taskId,
        runId: "run-1",
      }).path,
    ).toBe(state);
  });

  it("resolves commit records from the worktree after root copies have been released", () => {
    const repoRoot = fixture();
    const worktree = join(repoRoot, "worktree");
    const records = taskRecordPaths(join(worktree, "execution"), "T-TEST", "run-1");
    for (const path of [records.plan, records.result])
      write(path, "---\nspecdojo:\n  task_id: T-TEST\n---\n");
    expect(
      taskPaths(
        { repoRoot, executionPath: join(repoRoot, "execution"), schedulePath: "" },
        "T-TEST",
        worktree,
      ),
    ).toMatchObject({
      planRel: "execution/runs/schedule/T-TEST/run-1/plan.md",
      resultRel: "execution/runs/schedule/T-TEST/run-1/result.md",
    });
  });

  it("writes a generated plan and its result together while preserving document ids", async () => {
    const executionPath = fixture();
    const task = {
      id: "T-TEST",
      mode: "edit" as const,
      schedule_file: "",
      fifo_rank: 0,
      critical_first_rank: 0,
    };
    const planPath = await generateSinglePlan({
      executionPath,
      projectId: "test",
      catalogPath: "",
      task,
    });
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: task.id,
      mode: "edit",
      projectId: "test",
      planRef: recordRef(executionPath, planPath),
      agent: "test-agent",
      startedAt: "2026-11-07T00:00:00Z",
    });
    expect(dirname(resultPath)).toBe(dirname(planPath));
    expect(readFileSync(planPath, "utf8")).toContain("id: test:xep-t-test");
    expect(readFileSync(resultPath, "utf8")).toContain("id: test:xer-t-test");
    expect(existsSync(join(executionPath, "exec"))).toBe(false);
    const nextPlan = await generateSinglePlan({
      executionPath,
      projectId: "test",
      catalogPath: "",
      task,
    });
    expect(nextPlan).not.toBe(planPath);
    expect(findRunRecord(executionPath, "plan", task.id)).toBe(nextPlan);
  });

  it("projects state paths into a worktree without changing the relative layout", () => {
    const root = fixture();
    const worktree = join(root, "worktree");
    const state = pipelineStateLocation({
      repoRoot: root,
      worktreePath: worktree,
      executionPath: join(root, "execution"),
      taskId: "PJR-AB12",
      runId: "run-1",
    });
    expect(state.path).toBe(
      taskRecordPaths(join(worktree, "execution"), "PJR-AB12", "run-1").state,
    );
    expect(state.ref).toBe("execution/runs/register/PJR-AB12/run-1/pipeline-state.json");
  });

  it("keeps previous executor checkpoint evidence when resuming a run", () => {
    const records = taskRecordPaths(fixture(), "PJR-AB12", "run-1");
    write(records.state, "old state");
    write(records.evidence, "old evidence");
    write(records.log("executor.log"), "old log");
    snapshotRunAttempt(records.state);
    write(records.evidence, "next evidence");
    snapshotRunAttempt(records.state);
    expect(readFileSync(join(records.directory, "evidence.attempt-1.json"), "utf8")).toBe(
      "old evidence",
    );
    expect(readFileSync(join(records.directory, "evidence.attempt-2.json"), "utf8")).toBe(
      "next evidence",
    );
  });

  it("keeps dashboard rows distinct when tasks share the same run id", () => {
    const execution = fixture();
    for (const id of ["PJR-AB12", "PJR-CD34"])
      write(
        taskRecordPaths(execution, id, "run-1").plan,
        `---\nspecdojo:\n  task_id: ${id}\n---\n`,
      );
    expect(collectExecRecords(join(execution, "exec"))).toHaveLength(2);
  });
});
