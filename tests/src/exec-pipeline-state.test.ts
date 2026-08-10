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
  loadPipelineResumeCheckpoint,
  pipelineStateLocation,
  readPipelineState,
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

    const schemaPath = join(
      dirname(fileURLToPath(import.meta.url)),
      "..",
      "..",
      "docs",
      "specdojo",
      "schemas",
      "v1",
      "pipeline-state.schema.yaml",
    );
    const schema = load(readFileSync(schemaPath, "utf8")) as Record<string, unknown>;
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
