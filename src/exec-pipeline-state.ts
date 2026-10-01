import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import type { ExecEvidence } from "./exec-evidence.js";
import { ensureDir, safeSlug } from "./exec-shared.js";
import type { AgentStageRole } from "./exec-types.js";

export type PipelineStageStatus =
  "pending" | "running" | "succeeded" | "failed" | "rate_limited" | "blocked";

// 統合段（commit → merge → worktree 撤去）は agent ではなく runner が実行する段。executor /
// reporter と同じ粒度で記録し、agent 段が成功したまま統合だけ失敗した run を特定できるようにする。
export type PipelineStageRole = AgentStageRole | "integrate";

export type PipelineStageState = {
  status: PipelineStageStatus;
  actor: string | null;
  attempts: number;
  started_at: string | null;
  completed_at: string | null;
  artifact_ref: string | null;
};

// PJR-0WAA: 複数リポジトリの統合で、リポジトリごとの統合状態を記録する。
// - merged: 統合先へ merge 済み（`commit` は統合先の merge commit。プロジェクトは state 自体を
//   含む merge commit になるため null）
// - unchanged: exec branch に commit が無く、統合する変更が無い
// - pending: 未統合
// - failed: 事前検査または merge に失敗した
export type PipelineRepoIntegrationStatus = "pending" | "merged" | "unchanged" | "failed";

export type PipelineRepoIntegrationState = {
  status: PipelineRepoIntegrationStatus;
  commit: string | null;
  merged_at: string | null;
  error?: string;
};

// `repos` は `repos` を宣言した project の統合だけが書く任意項目。キーはリポジトリ名
// （プロジェクトリポジトリは `project`）で、統合の順（宣言順のプロダクト、最後にプロジェクト）に並ぶ。
// 旧形式の state（`repos` 無し）はプロジェクトリポジトリ 1 つの統合として読む。
export type PipelineIntegrateStageState = PipelineStageState & {
  repos?: Record<string, PipelineRepoIntegrationState>;
};

// integrate は統合段を持たない旧 run の state に存在しないため任意項目とする。
export type PipelineStages = Record<AgentStageRole, PipelineStageState> & {
  integrate?: PipelineIntegrateStageState;
};

// run の入力成果物への参照（worktree 相対・POSIX 区切り）。reporter だけを再開するとき、
// どの plan と result を対象にするかを state から復元するために使う。旧 run が書いた state には
// 存在しないため任意項目とする。
export type PipelineArtifactRefs = {
  plan_ref: string;
  result_ref: string;
};

export type PipelineState = {
  schema_version: 1;
  task_id: string;
  run_id: string;
  updated_at: string;
  stages: PipelineStages;
  artifacts?: PipelineArtifactRefs;
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
  artifacts?: PipelineArtifactRefs;
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
    ...(input.artifacts ? { artifacts: input.artifacts } : {}),
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
      stage.status === "rate_limited" ||
      stage.status === "blocked") &&
    (typeof stage.actor === "string" || stage.actor === null) &&
    Number.isSafeInteger(stage.attempts) &&
    (stage.attempts as number) >= 0 &&
    (typeof stage.started_at === "string" || stage.started_at === null) &&
    (typeof stage.completed_at === "string" || stage.completed_at === null) &&
    (typeof stage.artifact_ref === "string" || stage.artifact_ref === null)
  );
}

function isRepoIntegrationState(value: unknown): value is PipelineRepoIntegrationState {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const repo = value as Record<string, unknown>;
  return (
    (repo.status === "pending" ||
      repo.status === "merged" ||
      repo.status === "unchanged" ||
      repo.status === "failed") &&
    (typeof repo.commit === "string" || repo.commit === null) &&
    (typeof repo.merged_at === "string" || repo.merged_at === null) &&
    (repo.error === undefined || typeof repo.error === "string")
  );
}

function isIntegrateStageState(value: unknown): value is PipelineIntegrateStageState {
  if (!isStageState(value)) return false;
  const repos = (value as Record<string, unknown>).repos;
  if (repos === undefined) return true;
  if (!repos || typeof repos !== "object" || Array.isArray(repos)) return false;
  return Object.values(repos).every(isRepoIntegrationState);
}

function isArtifactRefs(value: unknown): value is PipelineArtifactRefs {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const refs = value as Record<string, unknown>;
  return (
    typeof refs.plan_ref === "string" &&
    !!refs.plan_ref &&
    typeof refs.result_ref === "string" &&
    !!refs.result_ref
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
  if (state.artifacts !== undefined && !isArtifactRefs(state.artifacts)) return false;
  const stages = state.stages as Record<string, unknown>;
  if (stages.integrate !== undefined && !isIntegrateStageState(stages.integrate)) return false;
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
  role: PipelineStageRole,
  patch: Partial<PipelineStageState>,
  updatedAt: string,
): PipelineState {
  // integrate は旧 run の state に無いため、未記録なら空の段から作り始める。
  const stages: PipelineStages = { ...state.stages };
  stages[role] = { ...(stages[role] ?? emptyStage()), ...patch };
  return { ...state, updated_at: updatedAt, stages };
}

/**
 * Record the integration state of one repository under `stages.integrate.repos`. Other repositories
 * and the stage fields are kept; a repository recorded for the first time is appended (so the keys
 * follow the integration order).
 */
export function updatePipelineRepoIntegration(
  state: PipelineState,
  repo: string,
  patch: Partial<PipelineRepoIntegrationState>,
  updatedAt: string,
): PipelineState {
  const integrate: PipelineIntegrateStageState = state.stages.integrate ?? emptyStage();
  const current: PipelineRepoIntegrationState = integrate.repos?.[repo] ?? {
    status: "pending",
    commit: null,
    merged_at: null,
  };
  const next: PipelineRepoIntegrationState = { ...current, ...patch };
  // 成功へ変わった記録に、前回の失敗理由を残さない。
  if (next.status !== "failed" && patch.error === undefined) delete next.error;
  return {
    ...state,
    updated_at: updatedAt,
    stages: {
      ...state.stages,
      integrate: { ...integrate, repos: { ...(integrate.repos ?? {}), [repo]: next } },
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

function isExecutorEvidence(value: unknown, taskId: string, runId: string): value is ExecEvidence {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const evidence = value as Partial<ExecEvidence>;
  return (
    evidence.schema_version === 1 &&
    evidence.task_id === taskId &&
    evidence.run_id === runId &&
    evidence.stage?.role === "executor" &&
    (evidence.stage.status === "succeeded" ||
      evidence.stage.status === "failed" ||
      evidence.stage.status === "rate_limited") &&
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
  executorEvidence?: ExecEvidence;
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

  const recordedEvidenceRef = state.stages.executor.artifact_ref;
  const evidenceRef =
    recordedEvidenceRef ??
    (state.stages.executor.status === "running"
      ? relative(input.worktreePath, join(dirname(statePath), "evidence.json"))
          .split(sep)
          .join("/")
      : null);
  if (!evidenceRef) return { state, statePath };
  const evidencePath = resolveArtifactRef(input.worktreePath, evidenceRef);
  if (!evidencePath || !existsSync(evidencePath)) return { state, statePath };
  try {
    const evidence: unknown = JSON.parse(readFileSync(evidencePath, "utf8"));
    if (!isExecutorEvidence(evidence, input.taskId, state.run_id)) return { state, statePath };
    return {
      state,
      statePath,
      executorEvidence: evidence,
      ...(evidence.stage.status === "succeeded" &&
      (state.stages.executor.status === "succeeded" || state.stages.executor.status === "running")
        ? { evidence }
        : {}),
    };
  } catch {
    return { state, statePath };
  }
}
