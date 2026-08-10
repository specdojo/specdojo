import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import type { ExecEvidence } from "./exec-evidence.js";
import { ensureDir, safeSlug } from "./exec-shared.js";
import type { AgentStageRole } from "./exec-types.js";

export type PipelineStageStatus = "pending" | "running" | "succeeded" | "failed" | "rate_limited";

export type PipelineStageState = {
  status: PipelineStageStatus;
  actor: string | null;
  attempts: number;
  started_at: string | null;
  completed_at: string | null;
  artifact_ref: string | null;
};

export type PipelineState = {
  schema_version: 1;
  task_id: string;
  run_id: string;
  updated_at: string;
  stages: Record<AgentStageRole, PipelineStageState>;
};

export type PipelineStateLocation = {
  path: string;
  ref: string;
};

function emptyStage(actor?: string): PipelineStageState {
  return {
    status: "pending",
    actor: actor ?? null,
    attempts: 0,
    started_at: null,
    completed_at: null,
    artifact_ref: null,
  };
}

export function createPipelineState(input: {
  taskId: string;
  runId: string;
  updatedAt: string;
  executorActor?: string;
  reporterActor?: string;
}): PipelineState {
  return {
    schema_version: 1,
    task_id: input.taskId,
    run_id: input.runId,
    updated_at: input.updatedAt,
    stages: {
      executor: emptyStage(input.executorActor),
      reporter: emptyStage(input.reporterActor),
    },
  };
}

function executionRelative(repoRoot: string, executionPath: string): string {
  const rel = relative(repoRoot, executionPath);
  if (rel === ".." || rel.startsWith(`..${sep}`)) {
    throw new Error(`Execution path is outside repository root: ${executionPath}`);
  }
  return rel;
}

export function pipelineStateLocation(input: {
  repoRoot: string;
  worktreePath: string;
  executionPath: string;
  taskId: string;
  runId: string;
}): PipelineStateLocation {
  const path = join(
    input.worktreePath,
    executionRelative(input.repoRoot, input.executionPath),
    "exec",
    "evidence",
    safeSlug(input.taskId),
    safeSlug(input.runId),
    "pipeline-state.json",
  );
  return { path, ref: relative(input.worktreePath, path).split(sep).join("/") };
}

function isStageState(value: unknown): value is PipelineStageState {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const stage = value as Record<string, unknown>;
  return (
    (stage.status === "pending" ||
      stage.status === "running" ||
      stage.status === "succeeded" ||
      stage.status === "failed" ||
      stage.status === "rate_limited") &&
    (typeof stage.actor === "string" || stage.actor === null) &&
    Number.isSafeInteger(stage.attempts) &&
    (stage.attempts as number) >= 0 &&
    (typeof stage.started_at === "string" || stage.started_at === null) &&
    (typeof stage.completed_at === "string" || stage.completed_at === null) &&
    (typeof stage.artifact_ref === "string" || stage.artifact_ref === null)
  );
}

export function isPipelineState(value: unknown): value is PipelineState {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const state = value as Record<string, unknown>;
  if (
    state.schema_version !== 1 ||
    typeof state.task_id !== "string" ||
    !state.task_id ||
    typeof state.run_id !== "string" ||
    !state.run_id ||
    typeof state.updated_at !== "string" ||
    !state.stages ||
    typeof state.stages !== "object" ||
    Array.isArray(state.stages)
  ) {
    return false;
  }
  const stages = state.stages as Record<string, unknown>;
  return isStageState(stages.executor) && isStageState(stages.reporter);
}

export function readPipelineState(path: string): PipelineState {
  const parsed: unknown = JSON.parse(readFileSync(path, "utf8"));
  if (!isPipelineState(parsed)) throw new Error(`Invalid pipeline state: ${path}`);
  return parsed;
}

export function writePipelineState(path: string, state: PipelineState): void {
  ensureDir(dirname(path));
  const temporaryPath = `${path}.tmp`;
  writeFileSync(temporaryPath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
  renameSync(temporaryPath, path);
}

export function updatePipelineStage(
  state: PipelineState,
  role: AgentStageRole,
  patch: Partial<PipelineStageState>,
  updatedAt: string,
): PipelineState {
  return {
    ...state,
    updated_at: updatedAt,
    stages: {
      ...state.stages,
      [role]: { ...state.stages[role], ...patch },
    },
  };
}

function resolveArtifactRef(worktreePath: string, ref: string): string | null {
  const root = resolve(worktreePath);
  const path = resolve(root, ref);
  const rel = relative(root, path);
  if (rel === ".." || rel.startsWith(`..${sep}`) || rel === "") return null;
  return path;
}

function isSucceededExecutorEvidence(
  value: unknown,
  taskId: string,
  runId: string,
): value is ExecEvidence {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const evidence = value as Partial<ExecEvidence>;
  return (
    evidence.schema_version === 1 &&
    evidence.task_id === taskId &&
    evidence.run_id === runId &&
    evidence.stage?.role === "executor" &&
    evidence.stage.status === "succeeded" &&
    Number.isSafeInteger(evidence.stage.attempts) &&
    evidence.stage.attempts >= 1
  );
}

export function loadPipelineResumeCheckpoint(input: {
  worktreePath: string;
  stateRef: string;
  taskId: string;
}): {
  state: PipelineState;
  statePath: string;
  evidence?: ExecEvidence;
} | null {
  const statePath = resolveArtifactRef(input.worktreePath, input.stateRef);
  if (!statePath || !existsSync(statePath)) return null;

  let state: PipelineState;
  try {
    state = readPipelineState(statePath);
  } catch {
    return null;
  }
  if (state.task_id !== input.taskId) return null;

  const evidenceRef = state.stages.executor.artifact_ref;
  if (state.stages.executor.status !== "succeeded" || !evidenceRef) {
    return { state, statePath };
  }
  const evidencePath = resolveArtifactRef(input.worktreePath, evidenceRef);
  if (!evidencePath || !existsSync(evidencePath)) return { state, statePath };
  try {
    const evidence: unknown = JSON.parse(readFileSync(evidencePath, "utf8"));
    return isSucceededExecutorEvidence(evidence, input.taskId, state.run_id)
      ? { state, statePath, evidence }
      : { state, statePath };
  } catch {
    return { state, statePath };
  }
}
