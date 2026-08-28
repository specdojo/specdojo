import { spawn } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { copyFileSync, existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import type { Command } from "commander";
import {
  defaultExecDefaultsPath,
  loadExecDefaultsConfig,
  resolveMemberCommand,
  resolveRateLimitDetection,
  type RateLimitDetection,
} from "./exec-agent-config.js";
import {
  agentProtectedConfigViolation,
  captureAgentProtectedConfigSnapshot,
  changedAgentProtectedConfigPaths,
  isAgentProtectedConfigPath,
} from "./exec-agent-protected-config.js";
import {
  agentGitStateViolation,
  captureAgentGitStateSnapshot,
  changedAgentGitStateFields,
} from "./exec-agent-git-state.js";
import {
  recordExecutorEvidence,
  type EvidenceValidation,
  type ExecEvidence,
} from "./exec-evidence.js";
import { activateResolvedProjectPaths, resolveProjectPaths } from "./exec-project.js";
import {
  buildExecutorPrompt,
  isRateLimitError,
  loadRosterForExecutionPath,
  runConfiguredParentValidations,
} from "./exec-run.js";
import { parsePlanTaskIdentity } from "./exec-plans.js";
import { runReporterWithFormatRetry, type ReporterOutput } from "./exec-reporter.js";
import { ensureDir, safeSlug } from "./exec-shared.js";
import {
  ensureExecWorktree,
  execBranchExists,
  findExecWorktree,
  gitEnvironment,
  gitOutput,
  gitResult,
  resolveWorktreeBase,
  worktreeNameFromTaskId,
  type ExecWorktree,
} from "./exec-worktree.js";
import {
  getProjectSchedulePath,
  loadConfig,
  specdojoRootDir,
  type MemberRoster,
  type ProjectMember,
} from "./specdojo-config.js";

type TrialStatus =
  | "pending"
  | "prepared"
  | "running"
  | "succeeded"
  | "failed"
  | "adopted"
  | "discarded";

type ReporterMode = "none" | "shared" | "paired";
type ReporterStatus = "not_run" | "succeeded" | "blocked" | "failed";
type ReporterFailureCategory =
  | "reported_blocked"
  | "invalid_output"
  | "invocation_failure"
  | "rate_limit";

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
    target: "pm-members.yaml";
    rationale: string;
  };
};

type TrialRunOptions = {
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

type TrialRecordOptions = { project?: string; comparison: string };

type TrialRateOptions = TrialRecordOptions & {
  trial: string;
  judgmentQuality?: string;
  writingQuality?: string;
  scopeAdherence?: string;
  notes?: string;
};

type TrialAdoptOptions = TrialRecordOptions & { trial: string; dryRun?: boolean };

type SpawnOutcome = { exitCode: number | null; stdout: string; stderr: string };

const TRIAL_PROMPT_SUFFIX = `

---

# Agent comparison trial instructions

This is an isolated comparison trial. Edit and validate the artifacts required by the plan, but
do not update task lifecycle state or create/update the result file. End the final response with
exactly one machine-readable executor evidence envelope as documented by SpecDojo.
`;

function sha256(value: string): string {
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

function hasValidExecutorEnvelope(stdout: string): boolean {
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

function repoRelative(repoRoot: string, path: string): string {
  const value = relative(repoRoot, path);
  if (!value || value === ".." || value.startsWith(`..${sep}`)) {
    throw new Error(`Path is outside repository root: ${path}`);
  }
  return value.split(sep).join("/");
}

function comparisonDir(executionPath: string, comparisonId: string): string {
  return join(executionPath, "exec", "trials", safeSlug(comparisonId));
}

function comparisonPath(executionPath: string, comparisonId: string): string {
  return join(comparisonDir(executionPath, comparisonId), "comparison.json");
}

function writeComparison(path: string, value: AgentComparisonRecord): void {
  ensureDir(dirname(path));
  const temporary = `${path}.${process.pid}.${randomUUID()}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  renameSync(temporary, path);
}

function readComparison(path: string): AgentComparisonRecord {
  if (!existsSync(path)) throw new Error(`Comparison not found: ${path}`);
  return JSON.parse(readFileSync(path, "utf8")) as AgentComparisonRecord;
}

function configuredWorktreeBase(schedulePath: string): string | undefined {
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

function parsePositiveInteger(value: string | undefined, flag: string): number {
  if (!value || !/^\d+$/.test(value) || Number(value) < 1) {
    throw new Error(`${flag} must be a positive integer: ${value ?? ""}`);
  }
  return Number(value);
}

function parseRating(value: string | undefined, flag: string): number | undefined {
  if (value === undefined) return undefined;
  if (!/^[1-5]$/.test(value)) throw new Error(`${flag} must be an integer from 1 to 5.`);
  return Number(value);
}

function resolveMember(
  roster: MemberRoster | null,
  nickname: string,
  stageRole: "executor" | "reporter",
): ProjectMember {
  const member = roster?.members.find(
    (candidate) => candidate.type === "agent" && candidate.nickname === nickname,
  );
  if (!member) throw new Error(`Agent nickname not found in pm-members.yaml: ${nickname}`);
  if (member.disabled) throw new Error(`Agent is disabled in pm-members.yaml: ${nickname}`);
  if (
    (stageRole === "reporter" && member.stage_role !== "reporter") ||
    (stageRole === "executor" && member.stage_role === "reporter")
  ) {
    throw new Error(`Agent must have stage_role: ${stageRole}: ${nickname}`);
  }
  return member;
}

function spawnAgent(
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

function worktreeEnvironment(
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
      target: "pm-members.yaml",
      rationale:
        "A single comparison does not automatically change agent assignment. A human reviews objective and subjective results, then updates pm-members.yaml priority/capabilities when repeated evidence supports the change.",
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
  for (const validation of executorValidations) {
    if (validation.status === "passed") trial.executor.validations_passed++;
    else if (validation.status === "failed") trial.executor.validations_failed++;
    else trial.executor.validations_not_run++;
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

async function runOneTrial(params: {
  record: AgentComparisonRecord;
  recordPath: string;
  trial: AgentTrialRecord;
  worktree: ExecWorktree;
  plan: string;
  prompt: string;
  executorCommand: string;
  reporterCommand?: string;
  reporterRateLimitDetection?: RateLimitDetection;
  parentValidationIds: string[];
  execDefaults: ReturnType<typeof loadExecDefaultsConfig>;
  repoRoot: string;
  schedulePath: string;
  executionPath: string;
}): Promise<void> {
  const { trial, worktree } = params;
  const startedAt = new Date();
  trial.status = "running";
  trial.started_at = startedAt.toISOString();
  writeComparison(params.recordPath, params.record);
  const outcome = await spawnAgent(
    params.executorCommand,
    params.prompt,
    worktree.path,
    worktreeEnvironment(params.repoRoot, worktree.path, params.schedulePath, params.executionPath),
  );
  const executorCompletedAt = new Date();
  trial.executor.duration_ms = executorCompletedAt.getTime() - startedAt.getTime();
  trial.parent_validation.configured_ids = [...params.parentValidationIds];
  let parentValidations: EvidenceValidation[] = [];
  if (params.parentValidationIds.length === 0) {
    trial.parent_validation.status = "not_configured";
  } else if (outcome.exitCode !== 0) {
    trial.parent_validation.status = "not_run";
  } else {
    const parentValidationStartedAt = Date.now();
    parentValidations = await runConfiguredParentValidations(params.execDefaults, worktree.path);
    trial.parent_validation.duration_ms = Date.now() - parentValidationStartedAt;
    trial.parent_validation.status = parentValidations.some(
      (validation) => validation.status !== "passed",
    )
      ? "failed"
      : "passed";
  }
  const runId = `${safeSlug(params.record.comparison_id)}-${trial.trial_id}`;
  const evidenceRecorded = recordExecutorEvidence({
    repoRoot: params.repoRoot,
    worktreePath: worktree.path,
    executionPath: params.executionPath,
    taskId: params.record.task_id,
    runId,
    actor: trial.agent,
    status: outcome.exitCode === 0 ? "succeeded" : "failed",
    startedAt: startedAt.toISOString(),
    completedAt: executorCompletedAt.toISOString(),
    exitCode: outcome.exitCode,
    attempts: 1,
    stdout: outcome.stdout,
    stderr: outcome.stderr,
    parentValidations,
  });
  const centralizedEvidenceDir = join(
    comparisonDir(params.executionPath, params.record.comparison_id),
    "trials",
    trial.trial_id,
  );
  ensureDir(centralizedEvidenceDir);
  const centralizedLogPath = join(centralizedEvidenceDir, "executor.log");
  const worktreeLogPath = join(dirname(evidenceRecorded.evidencePath), "executor.log");
  copyFileSync(worktreeLogPath, centralizedLogPath);
  const centralizedEvidencePath = join(centralizedEvidenceDir, "evidence.json");
  evidenceRecorded.evidence.log_refs = evidenceRecorded.evidence.log_refs.map((ref) => ({
    ...ref,
    path: repoRelative(params.repoRoot, centralizedLogPath),
  }));
  writeFileSync(
    centralizedEvidencePath,
    `${JSON.stringify(evidenceRecorded.evidence, null, 2)}\n`,
    "utf8",
  );
  trial.executor.exit_code = outcome.exitCode;
  trial.executor.attempts = 1;
  trial.executor.evidence_ref = repoRelative(params.repoRoot, centralizedEvidencePath);
  updateObjectiveMetrics(
    trial,
    evidenceRecorded.evidence,
    hasValidExecutorEnvelope(outcome.stdout),
  );

  let reporterSucceeded = true;
  if (outcome.exitCode === 0 && params.reporterCommand) {
    const reporter = await runReporterWithFormatRetry({
      plan: params.plan,
      evidence: evidenceRecorded.evidence,
      mode: parsePlanTaskIdentity(params.plan)?.mode ?? "edit",
      invoke: async (reporterPrompt) => {
        const reporterOutcome = await spawnAgent(
          params.reporterCommand as string,
          reporterPrompt,
          worktree.path,
          worktreeEnvironment(
            params.repoRoot,
            worktree.path,
            params.schedulePath,
            params.executionPath,
          ),
        );
        const result =
          reporterOutcome.exitCode === 0
            ? "success"
            : isRateLimitError(
                  reporterOutcome.exitCode,
                  `${reporterOutcome.stdout}\n${reporterOutcome.stderr}`,
                  params.reporterRateLimitDetection,
                )
              ? "rate_limit"
              : "failure";
        return {
          result,
          stdout: reporterOutcome.stdout,
          stderr: reporterOutcome.stderr,
        };
      },
    });
    trial.reporter.format_attempts = reporter.formatAttempts;
    trial.reporter.format_retries = Math.max(0, reporter.formatAttempts - 1);
    if (reporter.result === "success") {
      trial.reporter.structured_output = true;
      trial.reporter.outcome = reporter.output.outcome;
      trial.reporter.output = reporter.output;
      reporterSucceeded = reporter.output.outcome === "complete";
      if (reporterSucceeded) {
        trial.reporter.status = "succeeded";
      } else {
        trial.reporter.status = "blocked";
        trial.reporter.failure_category = "reported_blocked";
        trial.reporter.failure_reason = reporter.output.block_reason;
      }
    } else {
      trial.reporter.status = "failed";
      trial.reporter.failure_category = classifyReporterFailure(reporter.result, reporter.reason);
      trial.reporter.failure_reason = reporter.reason;
      reporterSucceeded = false;
    }
  }

  const completedAt = new Date();
  trial.completed_at = completedAt.toISOString();
  trial.duration_ms = completedAt.getTime() - startedAt.getTime();
  trial.status =
    outcome.exitCode === 0 &&
    trial.executor.validations_failed === 0 &&
    trial.parent_validation.status !== "failed" &&
    trial.parent_validation.status !== "not_run" &&
    reporterSucceeded
      ? "succeeded"
      : "failed";
  writeComparison(params.recordPath, params.record);
}

async function runPool(items: Array<() => Promise<void>>, parallel: number): Promise<void> {
  let next = 0;
  const workers = Array.from({ length: Math.min(parallel, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      await items[index]();
    }
  });
  await Promise.all(workers);
}

function parseTrialPair(value: string): TrialAgentPair {
  const separator = value.indexOf("=");
  const executor = value.slice(0, separator).trim();
  const reporter = value.slice(separator + 1).trim();
  if (separator < 1 || !executor || !reporter || reporter.includes("=")) {
    throw new Error(`--pair must use <executor>=<reporter>: ${value}`);
  }
  return { executor, reporter };
}

function resolveTrialDefinitions(opts: TrialRunOptions): {
  agents: string[];
  pairs?: TrialAgentPair[];
} {
  const agentValues = (opts.agent ?? []).map((value) => value.trim()).filter(Boolean);
  const pairValues = (opts.pair ?? []).map((value) => value.trim()).filter(Boolean);
  if (agentValues.length > 0 && pairValues.length > 0) {
    throw new Error("Use either --agent or --pair, not both.");
  }
  if (pairValues.length > 0) {
    if (opts.reporterBy) throw new Error("--pair cannot be combined with --reporter-by.");
    const pairs = pairValues.map(parseTrialPair);
    const keys = pairs.map((pair) => `${pair.executor}\0${pair.reporter}`);
    if (new Set(keys).size < 2 || new Set(keys).size !== keys.length) {
      throw new Error("exec trial run requires at least two distinct --pair values.");
    }
    return { agents: [...new Set(pairs.map((pair) => pair.executor))], pairs };
  }
  const agents = [...new Set(agentValues)];
  if (agents.length < 2) {
    throw new Error(
      "exec trial run requires at least two distinct --agent values or --pair values.",
    );
  }
  return { agents };
}

function resolveBaseCommit(repoRoot: string, revision: string): string {
  const result = gitResult(repoRoot, [
    "rev-parse",
    "--verify",
    "--end-of-options",
    `${revision}^{commit}`,
  ]);
  if (result.status !== 0) throw new Error(`Trial base is not a commit: ${revision}`);
  return String(result.stdout).trim();
}

async function runTrials(opts: TrialRunOptions): Promise<void> {
  const paths = resolveProjectPaths({ project: opts.project });
  activateResolvedProjectPaths(paths);
  const repoRoot = specdojoRootDir();
  const projectId = paths.projectId ?? opts.project?.trim();
  if (!projectId) throw new Error("exec trial run requires a project id.");
  const planPath = resolve(opts.plan);
  if (!existsSync(planPath)) throw new Error(`Plan not found: ${planPath}`);
  const planContent = readFileSync(planPath, "utf8");
  const identity = parsePlanTaskIdentity(planContent);
  if (!identity)
    throw new Error("Trial plan must have SpecDojo task_id/mode/project_id frontmatter.");
  if (identity.projectId && identity.projectId !== projectId) {
    throw new Error(`Plan project_id ${identity.projectId} does not match --project ${projectId}.`);
  }
  const { agents, pairs } = resolveTrialDefinitions(opts);
  const parallel = parsePositiveInteger(opts.parallel ?? "1", "--parallel");
  const comparisonId = safeSlug(
    opts.comparison?.trim() ||
      `${identity.taskId}-${new Date().toISOString()}-${randomUUID().slice(0, 8)}`,
  );
  const recordPath = comparisonPath(paths.executionPath, comparisonId);
  if (existsSync(recordPath)) throw new Error(`Comparison already exists: ${comparisonId}`);
  const worktreeBase = resolveWorktreeBase(
    repoRoot,
    opts.worktreeBase,
    configuredWorktreeBase(paths.schedulePath),
  );
  const roster = loadRosterForExecutionPath(paths.executionPath);
  const defaults = loadExecDefaultsConfig(
    opts.execDefaults ?? defaultExecDefaultsPath(),
    paths.executionPath,
  );
  const executorCommands = new Map<string, string>();
  for (const agent of agents) {
    const command = resolveMemberCommand(defaults, resolveMember(roster, agent, "executor"));
    if (!command) throw new Error(`Agent command could not be resolved: ${agent}`);
    executorCommands.set(agent, command);
  }
  const reporterCommands = new Map<string, string>();
  const reporterRateLimitDetections = new Map<string, RateLimitDetection | undefined>();
  if (opts.reporterBy) {
    const reporterMember = resolveMember(roster, opts.reporterBy, "reporter");
    const reporterCommand = resolveMemberCommand(defaults, reporterMember);
    if (!reporterCommand)
      throw new Error(`Reporter command could not be resolved: ${opts.reporterBy}`);
    reporterCommands.set(opts.reporterBy, reporterCommand);
    reporterRateLimitDetections.set(
      opts.reporterBy,
      resolveRateLimitDetection(defaults, reporterMember.provider),
    );
  }
  for (const reporter of new Set(pairs?.map((pair) => pair.reporter) ?? [])) {
    const reporterMember = resolveMember(roster, reporter, "reporter");
    const reporterCommand = resolveMemberCommand(defaults, reporterMember);
    if (!reporterCommand) throw new Error(`Reporter command could not be resolved: ${reporter}`);
    reporterCommands.set(reporter, reporterCommand);
    reporterRateLimitDetections.set(
      reporter,
      resolveRateLimitDetection(defaults, reporterMember.provider),
    );
  }
  const parentValidationIds = defaults.pipeline?.parent_validations ?? [];
  const prompt = `${buildExecutorPrompt(planContent, parentValidationIds).trimEnd()}${TRIAL_PROMPT_SUFFIX}`;
  const requestedRevision = opts.base?.trim() || "HEAD";
  const headCommit = resolveBaseCommit(repoRoot, "HEAD");
  const baseCommit = resolveBaseCommit(repoRoot, requestedRevision);
  const planRepoPath = repoRelative(repoRoot, planPath);
  const baseValidation = buildTrialBaseValidation({
    repoRoot,
    requestedRevision,
    resolvedCommit: baseCommit,
    headCommit,
    defaultedToHead: !opts.base?.trim(),
    planPath: planRepoPath,
    planContent,
  });
  const record = buildComparisonRecord({
    comparisonId,
    projectId,
    taskId: identity.taskId,
    createdAt: new Date().toISOString(),
    baseCommit,
    baseValidation,
    planPath: planRepoPath,
    planContent,
    prompt,
    agents,
    pairs,
    reporter: opts.reporterBy,
    worktreeBase,
    parentValidationIds,
  });
  if (opts.dryRun) {
    process.stdout.write(`${JSON.stringify(record, null, 2)}\n`);
    return;
  }
  writeComparison(recordPath, record);

  const prepared = new Map<string, ExecWorktree>();
  for (const trial of record.trials) {
    const worktreeTaskId = `${projectId}:trial:${comparisonId}:${trial.trial_id}`;
    if (findExecWorktree(repoRoot, worktreeTaskId) || execBranchExists(repoRoot, worktreeTaskId)) {
      throw new Error(`Trial worktree or branch already exists: ${trial.branch}`);
    }
    const worktree = ensureExecWorktree({
      repoRoot,
      worktreeBase,
      taskId: worktreeTaskId,
      startPoint: record.base_commit,
    });
    prepared.set(trial.trial_id, worktree);
    trial.status = "prepared";
    writeComparison(recordPath, record);
  }

  await runPool(
    record.trials.map((trial) => async () => {
      const worktree = prepared.get(trial.trial_id);
      if (!worktree) throw new Error(`Prepared worktree missing: ${trial.trial_id}`);
      await runOneTrial({
        record,
        recordPath,
        trial,
        worktree,
        plan: planContent,
        prompt,
        executorCommand: executorCommands.get(trial.agent) as string,
        reporterCommand: trial.reporter_agent
          ? reporterCommands.get(trial.reporter_agent)
          : undefined,
        reporterRateLimitDetection: trial.reporter_agent
          ? reporterRateLimitDetections.get(trial.reporter_agent)
          : undefined,
        parentValidationIds,
        execDefaults: defaults,
        repoRoot,
        schedulePath: paths.schedulePath,
        executionPath: paths.executionPath,
      });
    }),
    parallel,
  );
  process.stdout.write(`Comparison recorded: ${repoRelative(repoRoot, recordPath)}\n`);
}

function resolveRecord(opts: TrialRecordOptions): {
  record: AgentComparisonRecord;
  path: string;
  repoRoot: string;
} {
  const paths = resolveProjectPaths({ project: opts.project });
  activateResolvedProjectPaths(paths);
  const path = comparisonPath(paths.executionPath, opts.comparison);
  return { record: readComparison(path), path, repoRoot: specdojoRootDir() };
}

function findTrial(record: AgentComparisonRecord, selector: string): AgentTrialRecord {
  const matches = record.trials.filter(
    (trial) => trial.trial_id === selector || trial.agent === selector,
  );
  if (matches.length !== 1) throw new Error(`Trial not found or ambiguous: ${selector}`);
  return matches[0];
}

function statusTrials(opts: TrialRecordOptions): void {
  const { record } = resolveRecord(opts);
  process.stdout.write(
    `Comparison ${record.comparison_id} [${record.status}] task=${record.task_id}\n`,
  );
  process.stdout.write(
    `plan sha256=${record.plan.sha256} prompt sha256=${record.plan.prompt_sha256}\n`,
  );
  process.stdout.write(
    `base=${record.base_commit} requested=${record.base?.requested_revision ?? "(legacy)"} head_reference=${record.base?.head_commit_at_start ?? "unknown"} compatible=${record.base?.compatible ?? "unknown"} reporter_mode=${record.reporter_mode ?? "shared-or-none"}\n`,
  );
  for (const warning of record.base?.warnings ?? []) {
    process.stdout.write(`base warning: ${warning}\n`);
  }
  for (const trial of record.trials) {
    const reporterStatus =
      trial.reporter.status ?? (trial.reporter.structured_output ? "succeeded" : "not_run");
    const parentValidation = trial.parent_validation ?? {
      status: "not_configured",
      duration_ms: null,
      validations_passed: 0,
      validations_failed: 0,
      validations_not_run: 0,
    };
    process.stdout.write(
      `${trial.trial_id}\t${trial.status}\ttime(executor/parent/total)=${trial.executor.duration_ms ?? "-"}/${parentValidation.duration_ms ?? "-"}/${trial.duration_ms ?? "-"}ms\tfiles=${trial.executor.files_changed}\texecutor-validations(reported/passed/failed/not_run)=${trial.executor.validations_reported ?? trial.executor.validations.length}/${trial.executor.validations_passed}/${trial.executor.validations_failed}/${trial.executor.validations_not_run}\tparent-validations(status/passed/failed/not_run)=${parentValidation.status}/${parentValidation.validations_passed}/${parentValidation.validations_failed}/${parentValidation.validations_not_run}\treporter=${reporterStatus}/${trial.reporter.format_attempts}/${trial.reporter.failure_category ?? "-"}\n`,
    );
  }
}

function rateTrial(opts: TrialRateOptions): void {
  const { record, path } = resolveRecord(opts);
  const trial = findTrial(record, opts.trial);
  const judgment = parseRating(opts.judgmentQuality, "--judgment-quality");
  const writing = parseRating(opts.writingQuality, "--writing-quality");
  const scope = parseRating(opts.scopeAdherence, "--scope-adherence");
  if (judgment !== undefined) trial.subjective.judgment_quality = judgment;
  if (writing !== undefined) trial.subjective.writing_quality = writing;
  if (scope !== undefined) trial.subjective.scope_adherence = scope;
  if (opts.notes !== undefined) trial.subjective.notes = opts.notes.trim();
  writeComparison(path, record);
  process.stdout.write(`Rated trial: ${trial.trial_id}\n`);
}

function changedPaths(worktreePath: string): string[] {
  const output = gitOutput(worktreePath, [
    "status",
    "--porcelain=v1",
    "-z",
    "--untracked-files=all",
  ]);
  const paths: string[] = [];
  for (const record of output.split("\0").filter(Boolean)) {
    if (record.length >= 4) paths.push(record.slice(3));
  }
  return paths;
}

function removeTrialWorktree(
  repoRoot: string,
  trial: AgentTrialRecord,
  deleteUnmerged: boolean,
): void {
  const registered = findExecWorktree(repoRoot, trial.branch.slice("exec/".length));
  const worktreePath = registered?.path ?? trial.worktree;
  if (existsSync(worktreePath)) {
    gitOutput(repoRoot, ["worktree", "remove", "--force", worktreePath]);
  }
  if (
    gitResult(repoRoot, ["show-ref", "--verify", "--quiet", `refs/heads/${trial.branch}`])
      .status === 0
  ) {
    gitOutput(repoRoot, ["branch", deleteUnmerged ? "-D" : "-d", trial.branch]);
  }
}

function commitSelectedTrial(
  repoRoot: string,
  record: AgentComparisonRecord,
  trial: AgentTrialRecord,
): void {
  const protectedPaths = changedPaths(trial.worktree).filter(isAgentProtectedConfigPath);
  if (protectedPaths.length > 0) throw new Error(agentProtectedConfigViolation(protectedPaths));
  gitOutput(trial.worktree, ["add", "-A"]);
  const staged = gitResult(trial.worktree, ["diff", "--cached", "--quiet"]);
  if (staged.status === 1) {
    const commit = gitResult(trial.worktree, [
      "commit",
      "-m",
      `feat(trial): adopt ${record.task_id} from ${trial.agent}`,
    ]);
    if (commit.status !== 0) {
      gitResult(trial.worktree, ["reset", "--quiet"]);
      throw new Error(`Trial commit failed: ${commit.stderr || commit.stdout}`);
    }
  } else if (staged.status !== 0) {
    throw new Error("Failed to inspect selected trial changes.");
  }
  const ahead = Number(
    gitOutput(trial.worktree, ["rev-list", "--count", `${record.base_commit}..HEAD`]).trim(),
  );
  if (!Number.isFinite(ahead) || ahead < 1)
    throw new Error("Selected trial has no changes to adopt.");
}

function adoptTrial(opts: TrialAdoptOptions): void {
  const { record, path, repoRoot } = resolveRecord(opts);
  if (record.status !== "active") throw new Error(`Comparison is already ${record.status}.`);
  const selected = findTrial(record, opts.trial);
  if (selected.status !== "succeeded")
    throw new Error(`Only a succeeded trial can be adopted: ${selected.trial_id}`);
  if (opts.dryRun) {
    process.stdout.write(
      `[dry-run] adopt ${selected.branch}; discard ${record.trials.length - 1} other trial(s)\n`,
    );
    return;
  }
  commitSelectedTrial(repoRoot, record, selected);
  try {
    gitOutput(repoRoot, ["merge", "--no-ff", "--no-edit", selected.branch]);
  } catch (error) {
    gitResult(repoRoot, ["merge", "--abort"]);
    throw error;
  }
  removeTrialWorktree(repoRoot, selected, false);
  selected.status = "adopted";
  for (const trial of record.trials) {
    if (trial === selected) continue;
    removeTrialWorktree(repoRoot, trial, true);
    trial.status = "discarded";
  }
  record.status = "adopted";
  record.selected_trial_id = selected.trial_id;
  record.completed_at = new Date().toISOString();
  writeComparison(path, record);
  process.stdout.write(
    `Adopted trial ${selected.trial_id}; discarded remaining trial worktrees.\n`,
  );
}

function discardTrials(opts: TrialRecordOptions): void {
  const { record, path, repoRoot } = resolveRecord(opts);
  if (record.status !== "active") throw new Error(`Comparison is already ${record.status}.`);
  for (const trial of record.trials) {
    removeTrialWorktree(repoRoot, trial, true);
    trial.status = "discarded";
  }
  record.status = "discarded";
  record.completed_at = new Date().toISOString();
  writeComparison(path, record);
  process.stdout.write(`Discarded all trial worktrees; comparison record retained.\n`);
}

function commandError(error: unknown): void {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}

export function registerExecTrialCommands(exec: Command): void {
  const trial = exec.command("trial").description("Compare multiple agents on one immutable plan");
  trial
    .command("run")
    .requiredOption("--project <projectId>", "Project id")
    .requiredOption("--plan <path>", "Existing SpecDojo plan used unchanged by every trial")
    .option("--agent <nicknames...>", "Two or more executor agent nicknames")
    .option(
      "--pair <executor=reporter...>",
      "Two or more executor/reporter pairs (alternative to --agent)",
    )
    .option("--reporter-by <nickname>", "Shared reporter agent used to assess structured output")
    .option("--base <revision>", "Commit used as the trial worktree start point (default: HEAD)")
    .option("--comparison <id>", "Stable comparison id (generated when omitted)")
    .option("--parallel <n>", "Maximum concurrent trials", "1")
    .option("--worktree-base <path>", "Override worktree base directory")
    .option("--exec-defaults <path>", "Path to exec-defaults.yaml")
    .option("--dry-run", "Print the planned comparison without creating worktrees", false)
    .action(async (opts: TrialRunOptions) => {
      try {
        await runTrials(opts);
      } catch (error) {
        commandError(error);
      }
    });
  trial
    .command("status")
    .requiredOption("--project <projectId>", "Project id")
    .requiredOption("--comparison <id>", "Comparison id")
    .action((opts: TrialRecordOptions) => {
      try {
        statusTrials(opts);
      } catch (error) {
        commandError(error);
      }
    });
  trial
    .command("rate")
    .requiredOption("--project <projectId>", "Project id")
    .requiredOption("--comparison <id>", "Comparison id")
    .requiredOption("--trial <idOrAgent>", "Trial id or agent nickname")
    .option("--judgment-quality <1-5>", "Human judgment-quality rating")
    .option("--writing-quality <1-5>", "Human writing-quality rating")
    .option("--scope-adherence <1-5>", "Human scope-adherence rating")
    .option("--notes <text>", "Human evaluation notes")
    .action((opts: TrialRateOptions) => {
      try {
        rateTrial(opts);
      } catch (error) {
        commandError(error);
      }
    });
  trial
    .command("adopt")
    .requiredOption("--project <projectId>", "Project id")
    .requiredOption("--comparison <id>", "Comparison id")
    .requiredOption("--trial <idOrAgent>", "Succeeded trial to merge")
    .option("--dry-run", "Print adopt/discard actions", false)
    .action((opts: TrialAdoptOptions) => {
      try {
        adoptTrial(opts);
      } catch (error) {
        commandError(error);
      }
    });
  trial
    .command("discard")
    .requiredOption("--project <projectId>", "Project id")
    .requiredOption("--comparison <id>", "Comparison id")
    .action((opts: TrialRecordOptions) => {
      try {
        discardTrials(opts);
      } catch (error) {
        commandError(error);
      }
    });
}
