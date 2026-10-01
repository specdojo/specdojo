import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "js-yaml";
import Ajv2020Module from "ajv/dist/2020.js";
import addFormatsModule from "ajv-formats";
import { afterEach, describe, expect, it } from "vitest";
import {
  createPipelineState,
  integratedRepoNames,
  loadPipelineResumeCheckpoint,
  pipelineStateLocation,
  readPipelineState,
  updatePipelineRepoIntegration,
  updatePipelineStage,
  writePipelineState,
} from "../../src/exec-pipeline-state.js";
import type { ExecEvidence } from "../../src/exec-evidence.js";

const Ajv2020 = Ajv2020Module.default;
const addFormats = addFormatsModule.default;
const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

function setup(): { root: string; executionPath: string } {
  const root = mkdtempSync(join(tmpdir(), "specdojo-pipeline-state-"));
  roots.push(root);
  const executionPath = join(root, "execution");
  mkdirSync(executionPath, { recursive: true });
  return { root, executionPath };
}

function schemaPath(): string {
  return join(
    dirname(fileURLToPath(import.meta.url)),
    "..",
    "..",
    "docs",
    "specdojo",
    "schemas",
    "v1",
    "pipeline-state.schema.yaml",
  );
}

function evidence(taskId: string, runId: string): ExecEvidence {
  return {
    schema_version: 1,
    task_id: taskId,
    run_id: runId,
    stage: {
      role: "executor",
      actor: "executor-a",
      status: "succeeded",
      started_at: "2026-08-10T07:00:00Z",
      completed_at: "2026-08-10T07:01:00Z",
      exit_code: 0,
      attempts: 1,
    },
    changes: [],
    diff_summary: { files_changed: 0, summary: "" },
    validations: [],
    final_message: "done",
    log_refs: [],
  };
}

describe("pipeline state", () => {
  it("persists schema-valid stage state at a run-scoped path", () => {
    const { root, executionPath } = setup();
    const location = pipelineStateLocation({
      repoRoot: root,
      worktreePath: root,
      executionPath,
      taskId: "T-TEST-doc-010",
      runId: "run-1",
    });
    let state = createPipelineState({
      taskId: "T-TEST-doc-010",
      runId: "run-1",
      updatedAt: "2026-08-10T07:00:00Z",
      executorActor: "executor-a",
      reporterActor: "reporter-a",
    });
    state = updatePipelineStage(
      state,
      "executor",
      {
        status: "succeeded",
        attempts: 1,
        started_at: "2026-08-10T07:00:00Z",
        completed_at: "2026-08-10T07:01:00Z",
        artifact_ref: "execution/exec/evidence/T-TEST-doc-010/run-1/evidence.json",
      },
      "2026-08-10T07:01:00Z",
    );
    writePipelineState(location.path, state);

    expect(location.ref).toBe("execution/exec/evidence/T-TEST-doc-010/run-1/pipeline-state.json");
    expect(readPipelineState(location.path)).toEqual(state);

    const schema = load(readFileSync(schemaPath(), "utf8")) as Record<string, unknown>;
    const ajv = new Ajv2020({ allErrors: true, strict: false });
    addFormats(ajv);
    const validate = ajv.compile(schema);
    expect(validate(state), JSON.stringify(validate.errors)).toBe(true);
  });

  it("reuses only succeeded evidence matching the task and run", () => {
    const { root, executionPath } = setup();
    const taskId = "T-TEST-doc-010";
    const runId = "run-1";
    const location = pipelineStateLocation({
      repoRoot: root,
      worktreePath: root,
      executionPath,
      taskId,
      runId,
    });
    const evidenceRef = `execution/exec/evidence/${taskId}/${runId}/evidence.json`;
    let state = createPipelineState({
      taskId,
      runId,
      updatedAt: "2026-08-10T07:00:00Z",
    });
    state = updatePipelineStage(
      state,
      "executor",
      { status: "succeeded", attempts: 1, artifact_ref: evidenceRef },
      "2026-08-10T07:01:00Z",
    );
    writePipelineState(location.path, state);
    const evidencePath = join(root, evidenceRef);
    mkdirSync(dirname(evidencePath), { recursive: true });
    writeFileSync(evidencePath, `${JSON.stringify(evidence(taskId, runId))}\n`, "utf8");

    expect(
      loadPipelineResumeCheckpoint({ worktreePath: root, stateRef: location.ref, taskId })
        ?.evidence,
    ).toEqual(evidence(taskId, runId));

    writeFileSync(evidencePath, `${JSON.stringify(evidence(taskId, "different-run"))}\n`, "utf8");
    expect(
      loadPipelineResumeCheckpoint({ worktreePath: root, stateRef: location.ref, taskId })
        ?.evidence,
    ).toBeUndefined();
  });

  it("loads interrupted executor evidence as a resume lower-bound source without reusing it as succeeded", () => {
    const { root, executionPath } = setup();
    const taskId = "PJR-AB12";
    const runId = "run-rate-limited";
    const location = pipelineStateLocation({
      repoRoot: root,
      worktreePath: root,
      executionPath,
      taskId,
      runId,
    });
    const evidenceRef = `execution/exec/evidence/${taskId}/${runId}/evidence.json`;
    let state = createPipelineState({
      taskId,
      runId,
      updatedAt: "2026-08-10T07:00:00Z",
    });
    state = updatePipelineStage(
      state,
      "executor",
      { status: "rate_limited", attempts: 1, artifact_ref: evidenceRef },
      "2026-08-10T07:01:00Z",
    );
    writePipelineState(location.path, state);
    const interruptedEvidence: ExecEvidence = {
      ...evidence(taskId, runId),
      stage: {
        ...evidence(taskId, runId).stage,
        status: "rate_limited",
        exit_code: 75,
      },
      attempt_changes: [{ path: "docs/partial.md", status: "M" }],
    };
    const evidencePath = join(root, evidenceRef);
    mkdirSync(dirname(evidencePath), { recursive: true });
    writeFileSync(evidencePath, `${JSON.stringify(interruptedEvidence)}\n`, "utf8");

    const checkpoint = loadPipelineResumeCheckpoint({
      worktreePath: root,
      stateRef: location.ref,
      taskId,
    });

    expect(checkpoint?.executorEvidence).toEqual(interruptedEvidence);
    expect(checkpoint?.evidence).toBeUndefined();
  });

  it("records the runner-owned integrate stage on a state that has none", () => {
    const { root, executionPath } = setup();
    const location = pipelineStateLocation({
      repoRoot: root,
      worktreePath: root,
      executionPath,
      taskId: "PJR-AB12",
      runId: "run-1",
    });
    const created = createPipelineState({
      taskId: "PJR-AB12",
      runId: "run-1",
      updatedAt: "2026-08-10T07:00:00Z",
      executorActor: "executor-a",
      reporterActor: "reporter-a",
    });

    expect(created.stages.integrate).toBeUndefined();

    const running = updatePipelineStage(
      created,
      "integrate",
      {
        status: "running",
        actor: "reporter-a",
        attempts: 1,
        started_at: "2026-08-10T07:10:00Z",
      },
      "2026-08-10T07:10:00Z",
    );
    const failed = updatePipelineStage(
      running,
      "integrate",
      { status: "failed", completed_at: "2026-08-10T07:11:00Z" },
      "2026-08-10T07:11:00Z",
    );
    writePipelineState(location.path, failed);

    expect(readPipelineState(location.path).stages.integrate).toEqual({
      status: "failed",
      actor: "reporter-a",
      attempts: 1,
      started_at: "2026-08-10T07:10:00Z",
      completed_at: "2026-08-10T07:11:00Z",
      artifact_ref: null,
    });
    // 既存の段は統合段の記録で書き換えない。
    expect(readPipelineState(location.path).stages.executor).toEqual(created.stages.executor);

    const schema = load(readFileSync(schemaPath(), "utf8")) as Record<string, unknown>;
    const ajv = new Ajv2020({ allErrors: true, strict: false });
    addFormats(ajv);
    const validate = ajv.compile(schema);
    expect(validate(failed), JSON.stringify(validate.errors)).toBe(true);
  });

  it("records repository integration in declaration order while preserving old states", () => {
    const created = createPipelineState({
      taskId: "PJR-AB12",
      runId: "run-repos",
      updatedAt: "2026-08-10T07:00:00Z",
    });
    const running = updatePipelineStage(
      created,
      "integrate",
      { status: "running", attempts: 1 },
      "2026-08-10T07:01:00Z",
    );
    const firstFailed = updatePipelineRepoIntegration(
      running,
      "app1",
      { status: "failed", error: "hook rejected merge" },
      "2026-08-10T07:02:00Z",
    );
    const resumed = updatePipelineRepoIntegration(
      firstFailed,
      "app1",
      {
        status: "merged",
        commit: "abc123",
        merged_at: "2026-08-10T07:03:00Z",
      },
      "2026-08-10T07:03:00Z",
    );
    const completed = updatePipelineRepoIntegration(
      resumed,
      "project",
      { status: "merged", merged_at: "2026-08-10T07:04:00Z" },
      "2026-08-10T07:04:00Z",
    );

    expect(completed.stages.integrate?.repos).toEqual({
      app1: {
        status: "merged",
        commit: "abc123",
        merged_at: "2026-08-10T07:03:00Z",
      },
      project: {
        status: "merged",
        commit: null,
        merged_at: "2026-08-10T07:04:00Z",
      },
    });
    expect(Object.keys(completed.stages.integrate?.repos ?? {})).toEqual(["app1", "project"]);

    const schema = load(readFileSync(schemaPath(), "utf8")) as Record<string, unknown>;
    const ajv = new Ajv2020({ allErrors: true, strict: false });
    addFormats(ajv);
    const validate = ajv.compile(schema);
    expect(validate(completed), JSON.stringify(validate.errors)).toBe(true);
    // `repos` の無い旧形式も引き続き schema-valid。
    expect(validate(running), JSON.stringify(validate.errors)).toBe(true);
  });

  // PJR-6RN3: 再開前の統合先の取り込みから、統合済みのリポジトリを除外するために使う。
  it("lists only repositories recorded as merged or unchanged as integrated", () => {
    const created = createPipelineState({
      taskId: "PJR-AB12",
      runId: "run-1",
      updatedAt: "2026-08-10T07:00:00Z",
    });
    const records: Array<[string, "merged" | "unchanged" | "failed" | "pending"]> = [
      ["app1", "merged"],
      ["app2", "unchanged"],
      ["app3", "failed"],
      ["project", "pending"],
    ];
    const state = records.reduce(
      (current, [repo, status]) =>
        updatePipelineRepoIntegration(current, repo, { status }, "2026-08-10T07:01:00Z"),
      created,
    );

    expect([...integratedRepoNames(state)]).toEqual(["app1", "app2"]);
    expect(integratedRepoNames(created).size).toBe(0);
  });

  it("persists a schema-valid protection block separately from a process failure", () => {
    const { root, executionPath } = setup();
    const location = pipelineStateLocation({
      repoRoot: root,
      worktreePath: root,
      executionPath,
      taskId: "PJR-AB12",
      runId: "run-blocked",
    });
    const created = createPipelineState({
      taskId: "PJR-AB12",
      runId: "run-blocked",
      updatedAt: "2026-08-10T07:00:00Z",
    });
    const blocked = updatePipelineStage(
      created,
      "executor",
      { status: "blocked", attempts: 1, completed_at: "2026-08-10T07:01:00Z" },
      "2026-08-10T07:01:00Z",
    );
    writePipelineState(location.path, blocked);

    expect(readPipelineState(location.path).stages.executor.status).toBe("blocked");

    const schema = load(readFileSync(schemaPath(), "utf8")) as Record<string, unknown>;
    const ajv = new Ajv2020({ allErrors: true, strict: false });
    addFormats(ajv);
    const validate = ajv.compile(schema);
    expect(validate(blocked), JSON.stringify(validate.errors)).toBe(true);
  });

  it("rejects state references outside the worktree", () => {
    const { root } = setup();
    expect(
      loadPipelineResumeCheckpoint({
        worktreePath: root,
        stateRef: "../pipeline-state.json",
        taskId: "T-TEST-doc-010",
      }),
    ).toBeNull();
  });
});
