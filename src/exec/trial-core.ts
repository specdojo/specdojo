import { spawn } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import {
  agentProtectedConfigViolation,
  captureAgentProtectedConfigSnapshot,
  changedAgentProtectedConfigPaths,
} from "./agent-protected-config.js";
import {
  agentGitStateViolation,
  captureAgentGitStateSnapshot,
  changedAgentGitStateFields,
} from "./agent-git-state.js";
import type { EvidenceValidation, ExecEvidence } from "./evidence.js";
import type { ReporterOutput } from "./reporter.js";
import { ensureDir, safeSlug } from "./shared.js";
import { gitEnvironment, gitResult, worktreeNameFromTaskId } from "./worktree.js";
import {
  getProjectSchedulePath,
  loadConfig,
  resolveAgentMember,
  specdojoRootDir,
  type MemberRoster,
  type ProjectMember,
} from "../shared/specdojo-config.js";

type TrialStatus =
  "pending" | "prepared" | "running" | "succeeded" | "failed" | "adopted" | "discarded";

type ReporterMode = "none" | "shared" | "paired";
type ReporterStatus = "not_run" | "succeeded" | "blocked" | "failed";
type ReporterFailureCategory =
  "evidence_blocked" | "invalid_output" | "invocation_failure" | "rate_limit";

export type TrialAgentPair = {
  executor: string;
  reporter: string;
};

export type TrialBaseValidation = {
  requested_revision: string;
  resolved_commit: string;
  head_commit_at_start: string;
  base_is_ancestor_of_head: boolean;
  defaulted_to_head: boolean;
  plan_path_exists_at_base: boolean;
  compatible: boolean;
  referenced_paths: Array<{ path: string; exists_at_base: boolean }>;
  missing_referenced_paths: string[];
  warnings: string[];
};

export type TrialSubjectiveRating = {
  judgment_quality: number | null;
  writing_quality: number | null;
  scope_adherence: number | null;
  notes: string;
};

export type AgentTrialRecord = {
  trial_id: string;
  agent: string;
  reporter_agent: string | null;
  worktree: string;
  branch: string;
  status: TrialStatus;
  started_at: string | null;
  completed_at: string | null;
  duration_ms: number | null;
  executor: {
    exit_code: number | null;
    attempts: number;
    duration_ms: number | null;
    structured_output: boolean;
    validations_reported: number;
    validations_passed: number;
    validations_failed: number;
    validations_not_run: number;
    validations_requires_human: number;
    files_changed: number;
    evidence_ref: string | null;
    final_message: string;
    validations: EvidenceValidation[];
    changes: Array<{ path: string; status: string }>;
    diff_summary: string;
  };
  parent_validation: {
    configured_ids: string[];
    status: "not_configured" | "not_run" | "passed" | "failed";
    duration_ms: number | null;
    validations_passed: number;
    validations_failed: number;
    validations_not_run: number;
  };
  reporter: {
    status: ReporterStatus;
    structured_output: boolean;
    format_attempts: number;
    format_retries: number;
    outcome: "complete" | "blocked" | null;
    output: ReporterOutput | null;
    failure_category: ReporterFailureCategory | null;
    failure_reason: string;
  };
  subjective: TrialSubjectiveRating;
};

export type AgentComparisonRecord = {
  schema_version: 1;
  comparison_id: string;
  project_id: string;
  task_id: string;
  status: "active" | "adopted" | "discarded";
  created_at: string;
  completed_at: string | null;
  base_commit: string;
  base: TrialBaseValidation;
  reporter_mode: ReporterMode;
  plan: {
    path: string;
    sha256: string;
    prompt_sha256: string;
  };
  selected_trial_id: string | null;
  trials: AgentTrialRecord[];
  agent_selection: {
    policy: "manual";
    target: "agent-members.yaml";
    rationale: string;
  };
};

export type TrialRunOptions = {
  project?: string;
  plan: string;
  agent?: string[];
  pair?: string[];
  reporterBy?: string;
  base?: string;
  comparison?: string;
  parallel?: string;
  worktreeBase?: string;
  execDefaults?: string;
  dryRun?: boolean;
};

export type TrialRecordOptions = { project?: string; comparison: string };

export type TrialRateOptions = TrialRecordOptions & {
  trial: string;
  judgmentQuality?: string;
  writingQuality?: string;
  scopeAdherence?: string;
  notes?: string;
};

export type TrialAdoptOptions = TrialRecordOptions & { trial: string; dryRun?: boolean };

export type SpawnOutcome = { exitCode: number | null; stdout: string; stderr: string };

export const TRIAL_PROMPT_SUFFIX = `

---

# Agent comparison trial instructions

This is an isolated comparison trial. Edit and validate the artifacts required by the plan, but
do not update task lifecycle state or create/update the result file. End the final response with
exactly one machine-readable executor evidence envelope as documented by SpecDojo.
`;

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function normalizePlanPathCandidate(value: string): string | null {
  const candidate = value
    .trim()
    .replace(/^\.\//u, "")
    .replace(/:\d+(?::\d+)?$/u, "")
    .replace(/[.,;]$/u, "");
  if (
    !candidate ||
    candidate.startsWith("/") ||
    candidate.includes("://") ||
    /[\s<>{}*?$]/u.test(candidate) ||
    candidate === ".env" ||
    candidate.startsWith("secrets/")
  ) {
    return null;
  }
  if (
    /^(?:\.specdojo|docs|scripts|src|tests|tools)\//u.test(candidate) ||
    /^(?:lefthook\.yml|package\.json|tsconfig[^/]*\.json|vitest[^/]*\.ts)$/u.test(candidate)
  ) {
    return candidate;
  }
  return null;
}

export function extractPlanRepoPaths(plan: string): string[] {
  const candidates: string[] = [];
  for (const match of plan.matchAll(/`([^`\n]+)`/gu)) candidates.push(match[1]);
  for (const match of plan.matchAll(/\]\(([^)\s]+)(?:\s+[^)]*)?\)/gu)) candidates.push(match[1]);
  return [
    ...new Set(
      candidates
        .map(normalizePlanPathCandidate)
        .filter((candidate): candidate is string => candidate !== null),
    ),
  ].sort();
}

function objectExistsAtCommit(repoRoot: string, commit: string, path: string): boolean {
  return gitResult(repoRoot, ["cat-file", "-e", `${commit}:${path}`]).status === 0;
}

export function buildTrialBaseValidation(params: {
  repoRoot: string;
  requestedRevision: string;
  resolvedCommit: string;
  headCommit: string;
  defaultedToHead: boolean;
  planPath: string;
  planContent: string;
}): TrialBaseValidation {
  const referencedPaths = extractPlanRepoPaths(params.planContent).map((path) => ({
    path,
    exists_at_base: objectExistsAtCommit(params.repoRoot, params.resolvedCommit, path),
  }));
  const missingReferencedPaths = referencedPaths
    .filter((entry) => !entry.exists_at_base)
    .map((entry) => entry.path);
  const planPathExistsAtBase = objectExistsAtCommit(
    params.repoRoot,
    params.resolvedCommit,
    params.planPath,
  );
  const warnings: string[] = [];
  const baseIsAncestorOfHead =
    gitResult(params.repoRoot, [
      "merge-base",
      "--is-ancestor",
      params.resolvedCommit,
      params.headCommit,
    ]).status === 0;
  if (!baseIsAncestorOfHead) {
    warnings.push(
      "The base commit is not an ancestor of HEAD; the current HEAD cannot be used as a linear reference result.",
    );
  }
  if (!planPathExistsAtBase) {
    warnings.push(
      "The plan file is not present at the base commit; the current plan content will still be supplied to every trial.",
    );
  }
  if (missingReferencedPaths.length > 0) {
    warnings.push(
      `Referenced paths missing at the base commit: ${missingReferencedPaths.join(", ")}`,
    );
  }
  return {
    requested_revision: params.requestedRevision,
    resolved_commit: params.resolvedCommit,
    head_commit_at_start: params.headCommit,
    base_is_ancestor_of_head: baseIsAncestorOfHead,
    defaulted_to_head: params.defaultedToHead,
    plan_path_exists_at_base: planPathExistsAtBase,
    compatible: baseIsAncestorOfHead && missingReferencedPaths.length === 0,
    referenced_paths: referencedPaths,
    missing_referenced_paths: missingReferencedPaths,
    warnings,
  };
}

export function classifyReporterFailure(
  result: "failure" | "rate_limit",
  reason: string,
): ReporterFailureCategory {
  if (result === "rate_limit") return "rate_limit";
  return reason.startsWith("reporter output invalid after")
    ? "invalid_output"
    : "invocation_failure";
}

export function hasValidExecutorEnvelope(stdout: string): boolean {
  const matches = [
    ...stdout.matchAll(
      /<specdojo_executor_evidence>\s*([\s\S]*?)\s*<\/specdojo_executor_evidence>/gu,
    ),
  ];
  const raw = matches.at(-1)?.[1];
  if (!raw) return false;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const report = value as Record<string, unknown>;
    return typeof report.final_message === "string" && Array.isArray(report.validations);
  } catch {
    return false;
  }
}

export function repoRelative(repoRoot: string, path: string): string {
  const value = relative(repoRoot, path);
  if (!value || value === ".." || value.startsWith(`..${sep}`)) {
    throw new Error(`Path is outside repository root: ${path}`);
  }
  return value.split(sep).join("/");
}

export function comparisonDir(executionPath: string, comparisonId: string): string {
  return join(executionPath, "exec", "trials", safeSlug(comparisonId));
}

export function comparisonPath(executionPath: string, comparisonId: string): string {
  return join(comparisonDir(executionPath, comparisonId), "comparison.json");
}

export function writeComparison(path: string, value: AgentComparisonRecord): void {
  ensureDir(dirname(path));
  const temporary = `${path}.${process.pid}.${randomUUID()}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  renameSync(temporary, path);
}

export function readComparison(path: string): AgentComparisonRecord {
  if (!existsSync(path)) throw new Error(`Comparison not found: ${path}`);
  return JSON.parse(readFileSync(path, "utf8")) as AgentComparisonRecord;
}

export function configuredWorktreeBase(schedulePath: string): string | undefined {
  const { config } = loadConfig();
  if (!config) return undefined;
  const rootDir = specdojoRootDir();
  for (const project of Object.values(config.projects)) {
    if (resolve(rootDir, getProjectSchedulePath(project)) === schedulePath) {
      return project.run?.worktree_base;
    }
  }
  return undefined;
}

export function parsePositiveInteger(value: string | undefined, flag: string): number {
  if (!value || !/^\d+$/.test(value) || Number(value) < 1) {
    throw new Error(`${flag} must be a positive integer: ${value ?? ""}`);
  }
  return Number(value);
}

export function parseRating(value: string | undefined, flag: string): number | undefined {
  if (value === undefined) return undefined;
  if (!/^[1-5]$/.test(value)) throw new Error(`${flag} must be an integer from 1 to 5.`);
  return Number(value);
}

export function resolveMember(
  roster: MemberRoster | null,
  nickname: string,
  stageRole: "executor" | "reporter",
): ProjectMember {
  const member = resolveAgentMember(roster, nickname);
  if (!member) throw new Error(`Agent nickname not found in agent-members.yaml: ${nickname}`);
  if (member.disabled) throw new Error(`Agent is disabled in agent-members.yaml: ${nickname}`);
  if (
    (stageRole === "reporter" && member.stage_role !== "reporter") ||
    (stageRole === "executor" && member.stage_role === "reporter")
  ) {
    throw new Error(`Agent must have stage_role: ${stageRole}: ${nickname}`);
  }
  return member;
}

export function spawnAgent(
  command: string,
  prompt: string,
  cwd: string,
  env: NodeJS.ProcessEnv,
): Promise<SpawnOutcome> {
  return new Promise((resolveOutcome) => {
    const protectedConfigBefore = captureAgentProtectedConfigSnapshot(cwd);
    const gitStateBefore = captureAgentGitStateSnapshot(cwd);
    const child = spawn(command, { cwd, env, shell: true, stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    let settled = false;
    child.stdin.on("error", () => undefined);
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk: string) => {
      stdout += chunk;
      process.stdout.write(chunk);
    });
    child.stderr.on("data", (chunk: string) => {
      stderr += chunk;
      process.stderr.write(chunk);
    });
    const finish = (outcome: SpawnOutcome): void => {
      if (settled) return;
      settled = true;
      const protectedChanges = changedAgentProtectedConfigPaths(cwd, protectedConfigBefore);
      if (protectedChanges.length > 0) {
        outcome.stderr += `${agentProtectedConfigViolation(protectedChanges)}\n`;
        outcome.exitCode = 1;
      }
      const gitStateChanges = changedAgentGitStateFields(cwd, gitStateBefore);
      if (gitStateChanges.length > 0) {
        outcome.stderr += `${agentGitStateViolation(gitStateChanges)}\n`;
        outcome.exitCode = 1;
      }
      resolveOutcome(outcome);
    };
    child.once("error", (error) => {
      stderr += `${error.message}\n`;
      finish({ exitCode: null, stdout, stderr });
    });
    child.once("close", (exitCode) => finish({ exitCode, stdout, stderr }));
    child.stdin.end(prompt);
  });
}

export function worktreeEnvironment(
  repoRoot: string,
  worktreePath: string,
  schedulePath: string,
  executionPath: string,
): NodeJS.ProcessEnv {
  return {
    ...gitEnvironment(),
    SPECDOJO_SCHEDULE_PATH: resolve(worktreePath, repoRelative(repoRoot, schedulePath)),
    SPECDOJO_EXECUTION_PATH: resolve(worktreePath, repoRelative(repoRoot, executionPath)),
  };
}

function blankTrial(params: {
  projectId: string;
  comparisonId: string;
  agent: string;
  trialId?: string;
  reporter?: string;
  worktreeBase: string;
  parentValidationIds?: string[];
}): AgentTrialRecord {
  const trialId = safeSlug(params.trialId ?? params.agent);
  const worktreeTaskId = `${params.projectId}:trial:${params.comparisonId}:${trialId}`;
  const name = worktreeNameFromTaskId(worktreeTaskId);
  return {
    trial_id: trialId,
    agent: params.agent,
    reporter_agent: params.reporter ?? null,
    worktree: resolve(params.worktreeBase, name),
    branch: `exec/${name}`,
    status: "pending",
    started_at: null,
    completed_at: null,
    duration_ms: null,
    executor: {
      exit_code: null,
      attempts: 0,
      duration_ms: null,
      structured_output: false,
      validations_reported: 0,
      validations_passed: 0,
      validations_failed: 0,
      validations_not_run: 0,
      validations_requires_human: 0,
      files_changed: 0,
      evidence_ref: null,
      final_message: "",
      validations: [],
      changes: [],
      diff_summary: "",
    },
    parent_validation: {
      configured_ids: [...(params.parentValidationIds ?? [])],
      status: params.parentValidationIds?.length ? "not_run" : "not_configured",
      duration_ms: null,
      validations_passed: 0,
      validations_failed: 0,
      validations_not_run: 0,
    },
    reporter: {
      status: "not_run",
      structured_output: false,
      format_attempts: 0,
      format_retries: 0,
      outcome: null,
      output: null,
      failure_category: null,
      failure_reason: "",
    },
    subjective: {
      judgment_quality: null,
      writing_quality: null,
      scope_adherence: null,
      notes: "",
    },
  };
}

export function buildComparisonRecord(params: {
  comparisonId: string;
  projectId: string;
  taskId: string;
  createdAt: string;
  baseCommit: string;
  baseValidation?: TrialBaseValidation;
  planPath: string;
  planContent: string;
  prompt: string;
  agents?: string[];
  pairs?: TrialAgentPair[];
  reporter?: string;
  worktreeBase: string;
  parentValidationIds?: string[];
}): AgentComparisonRecord {
  const reporterMode: ReporterMode = params.pairs ? "paired" : params.reporter ? "shared" : "none";
  const definitions =
    params.pairs ??
    (params.agents ?? []).map((agent) => ({ executor: agent, reporter: params.reporter }));
  const trialIds = definitions.map(({ executor, reporter }) =>
    safeSlug(reporterMode === "paired" ? `${executor}-${reporter}` : executor),
  );
  if (new Set(trialIds).size !== trialIds.length) {
    throw new Error("Trial executor/reporter selections must produce distinct trial ids.");
  }
  const baseValidation =
    params.baseValidation ??
    ({
      requested_revision: "HEAD",
      resolved_commit: params.baseCommit,
      head_commit_at_start: params.baseCommit,
      base_is_ancestor_of_head: true,
      defaulted_to_head: true,
      plan_path_exists_at_base: true,
      compatible: true,
      referenced_paths: [],
      missing_referenced_paths: [],
      warnings: [],
    } satisfies TrialBaseValidation);
  return {
    schema_version: 1,
    comparison_id: params.comparisonId,
    project_id: params.projectId,
    task_id: params.taskId,
    status: "active",
    created_at: params.createdAt,
    completed_at: null,
    base_commit: params.baseCommit,
    base: baseValidation,
    reporter_mode: reporterMode,
    plan: {
      path: params.planPath,
      sha256: sha256(params.planContent),
      prompt_sha256: sha256(params.prompt),
    },
    selected_trial_id: null,
    trials: definitions.map(({ executor, reporter }, index) =>
      blankTrial({
        projectId: params.projectId,
        comparisonId: params.comparisonId,
        agent: executor,
        trialId: trialIds[index],
        reporter,
        worktreeBase: params.worktreeBase,
        parentValidationIds: params.parentValidationIds,
      }),
    ),
    agent_selection: {
      policy: "manual",
      target: "agent-members.yaml",
      rationale:
        "A single comparison does not automatically change agent assignment. A human reviews objective and subjective results, then updates agent-members.yaml priority/capabilities when repeated evidence supports the change.",
    },
  };
}

export function updateObjectiveMetrics(
  trial: AgentTrialRecord,
  evidence: ExecEvidence,
  structuredOutput: boolean,
): void {
  trial.executor.structured_output = structuredOutput;
  trial.executor.files_changed = evidence.diff_summary.files_changed;
  trial.executor.final_message = evidence.final_message;
  trial.executor.validations = evidence.validations;
  trial.executor.changes = evidence.changes;
  trial.executor.diff_summary = evidence.diff_summary.summary;
  const executorValidations = evidence.validations.filter(
    (validation) => validation.source !== "runner",
  );
  trial.executor.validations_reported = executorValidations.length;
  trial.executor.validations_passed = 0;
  trial.executor.validations_failed = 0;
  trial.executor.validations_not_run = 0;
  trial.executor.validations_requires_human = 0;
  for (const validation of executorValidations) {
    if (validation.status === "passed") trial.executor.validations_passed++;
    else if (validation.status === "failed") trial.executor.validations_failed++;
    else if (validation.status === "not_run") trial.executor.validations_not_run++;
    else if (validation.status === "requires_human") {
      trial.executor.validations_requires_human++;
    }
  }

  const parentValidations = evidence.validations.filter(
    (validation) => validation.source === "runner",
  );
  trial.parent_validation.validations_passed = parentValidations.filter(
    (validation) => validation.status === "passed",
  ).length;
  trial.parent_validation.validations_failed = parentValidations.filter(
    (validation) => validation.status === "failed",
  ).length;
  trial.parent_validation.validations_not_run = parentValidations.filter(
    (validation) => validation.status === "not_run",
  ).length;
}
