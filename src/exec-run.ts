import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { basename, join, relative, resolve, sep } from "node:path";
import { type Command } from "commander";
import { selfRunArgs } from "./spawn-self.js";
import {
  defaultExecDefaultsPath,
  createProviderCapacityTracker,
  hasMemberCommandSource,
  loadExecDefaultsConfig,
  resolveMemberCommand,
  resolveRateLimitDetection,
  resolveRateLimitPolicy,
  type ExecDefaultsConfig,
  type RateLimitDetection,
} from "./exec-agent-config.js";
import { activateResolvedProjectPaths, resolveProjectPaths } from "./exec-project.js";
import {
  acquireSchedulerLock,
  buildEvent,
  canCompleteTask,
  readAllEventFiles,
  foldEventsToState,
  releaseSchedulerLock,
  writeEventFile,
} from "./exec-events.js";
import {
  limitEventMeta,
  normalizeAgentLimit,
  selectDueDeferredLimitTasks,
  type AgentLimitKind,
  type AgentLimitSignal,
} from "./exec-limit.js";
import { buildScheduleIndex, findStaleGeneratedTracks } from "./exec-schedule.js";
import { buildInitialStateFromStrategy } from "./exec-schedule-initial.js";
import { readReadySnapshot } from "./exec-schedule-ready.js";
import { listFilesRecursive, qualifyTaskId, randomHex, readYaml } from "./exec-shared.js";
import {
  getProjectExecutionPath,
  getProjectSchedulePath,
  loadConfig,
  loadMemberRoster,
  specdojoRootDir,
  type AgentProvider,
  type MemberRoster,
  type ProjectMember,
} from "./specdojo-config.js";
import { type ReadyTaskView } from "./exec-types.js";
import type {
  AgentStageRole,
  CurrentState,
  Proficiency,
  ScheduleIndex,
  StateSnapshot,
  TaskMode,
} from "./exec-types.js";
import {
  acquireExecRunLock,
  releaseExecRunLock,
  ROUTINE_BUSY_SKIP_EXIT_CODE,
  ROUTINE_EXEC_ENV,
  type ExecRunBusyPolicy,
} from "./exec-run-lock.js";
import { replaceDocIndexRefs } from "./doc-index.js";
import {
  extractLocalId,
  extractPhaseSuffix,
  normalizePhaseSetSelection,
  phaseSetNames,
  type PhaseSetSelection,
} from "./schedule-phase-sets.js";
import {
  archivePlan,
  buildInPlaceStem,
  generateDeliverablePlan,
  generateSinglePlan,
  loadPlan,
  parsePlanTaskIdentity,
  resolveDeliverableTarget,
  finalizeResultSectionsForDeliverable,
  reviewResultSectionsForDeliverable,
  targetDocIdsForScheduledTask,
  stemFromPlanPath,
} from "./exec-plans.js";
import { buildTaskView } from "./exec-task-view.js";
import {
  formatRegisterRunSummary,
  generateRegisterPlan,
  isRegisterFailureMode,
  parseRegisterIds,
  registerRunExitCode,
  requireRunnableRegisterItem,
  resolveRegisterRunTarget,
  sanitizeRegisterConclusion,
  selectRegisterCommitPaths,
  selectRegisterRunArtifactResidue,
  ticketPathFromItem,
  type RegisterFailureMode,
  type RegisterItemSummary,
  type RegisterItemTransition,
} from "./exec-register.js";
import type { PjrItem, RegisterPaths } from "./register.js";
import {
  isResultUnfilled,
  readResultFrontmatterSnapshot,
  renderReporterResult,
  scaffoldResult,
  updateResultStatus,
} from "./exec-results.js";
import { completeJobRun, materializeJobRun } from "./job.js";
import {
  findExecWorktree,
  gitOutput,
  gitResult,
  resolveWorktreeBase,
  worktreeNameFromTaskId,
  type ExecWorktree,
} from "./exec-worktree.js";
import {
  checkpointAndEnsureWorktree,
  commitWorktreeChanges,
  discardStaleExecWorktree,
  mergeWorktreeIntoCurrent,
  removeWorktree,
  stabilizeCommitTargets,
  worktreeStatusPaths,
} from "./exec-worktree-ops.js";
import {
  agentProtectedConfigViolation,
  captureAgentProtectedConfigSnapshot,
  changedAgentProtectedConfigPaths,
} from "./exec-agent-protected-config.js";
import {
  buildPhaseModeIndex,
  resolveApproach,
  resolveTaskCapabilities,
  resolveTaskExecution,
  resolveTaskMode,
  resolveTaskProficiency,
} from "./exec-strategy.js";
import {
  recordExecutorEvidence,
  recordReporterFailureOutput,
  writeExecutorEvidence,
  type ExecEvidence,
} from "./exec-evidence.js";
import {
  failedParentValidationReason,
  hasRecordedParentValidations,
  replaceParentValidationResults,
  resolveParentValidationDefinitions,
  runParentValidations,
} from "./exec-parent-validation.js";
import { runReporterWithFormatRetry } from "./exec-reporter.js";
import {
  findResumableRegisterRun,
  resolveRegisterResumeArtifacts,
} from "./exec-register-resume.js";
import {
  createPipelineState,
  loadPipelineResumeCheckpoint,
  pipelineStateLocation,
  updatePipelineStage,
  writePipelineState,
  type PipelineState,
} from "./exec-pipeline-state.js";

type StrategyPhase = {
  id: string;
  name: string;
  task_suffix: string;
  duration_days: number;
};

type StrategyOwnerRule = {
  local_ids: string[];
  owner: string;
  phase_set?: string;
  phase_sets?: PhaseSetSelection;
};

type StrategyFile = {
  phase_sets: Record<string, StrategyPhase[]>;
  default_phase_set?: string;
  default_phase_sets?: PhaseSetSelection;
  owner_rules: StrategyOwnerRule[];
};

export type TaskPhaseContext = {
  localId: string;
  phaseSet: string;
  phaseId: string;
};

export type RunOpts = {
  project?: string;
  by?: string;
  strategy?: string;
  execDefaults?: string;
  agentConfig?: string;
  dryRun?: boolean;
  auto?: boolean;
  task?: string;
  deliverable?: string;
  plan?: string;
  register?: string | string[];
  job?: string;
  input?: string | string[];
  scheduledAt?: string;
  jobTrigger?: string;
  registerCommit?: boolean;
  onFailure?: string;
  resume?: boolean;
  forceRestart?: boolean;
  worktree?: boolean;
  trackState?: boolean;
  archiveOnSuccess?: boolean;
  editBy?: string;
  reviewBy?: string;
  executorBy?: string;
  reporterBy?: string;
  loop?: boolean;
  maxRounds?: string;
  parallel?: string;
  worktreeBase?: string;
  due?: boolean;
  ifBusy?: string;
  cycleRebuildStaleTracks?: boolean;
};

type RunResult = "success" | "rate_limit" | "failure";

// Mode-specific agent overrides from --edit-by / --review-by. Each value is an agent
// nickname (not a raw command); the command is resolved from pm-members.yaml. undefined means
// "auto-select for that mode".
export type ModeAgentOverrides = {
  edit?: string;
  review?: string;
};

export type StageAgentOverrides = {
  executor?: string;
  reporter?: string;
};

// Outcome of resolving a per-task agent override.
//   none    — no override applies; fall back to auto-selection
//   command — resolved to a concrete command (with the actor nickname when known)
//   error   — an override was requested but could not be resolved (caller should fail the task)
export type AgentOverrideResolution =
  | { kind: "none" }
  | { kind: "command"; command: string; actor?: string; provider?: AgentProvider }
  | { kind: "error"; message: string };

// A runnable agent candidate: the shell command plus the provider it belongs to.
// The provider selects the per-provider failure-handling override in exec-defaults.yaml.
type AgentRunCandidate = { command: string; actor?: string; provider?: AgentProvider };

// Resolve the agent override for a task's mode. A single explicit --by nickname wins for every
// mode. Otherwise the mode-specific --edit-by / --review-by nickname applies. Commands are always
// resolved from pm-members.yaml and exec-defaults.yaml; raw command strings are not accepted.
export function resolveAgentOverride(
  mode: "edit" | "review",
  agentNicknameOverride: string | undefined,
  modeAgentOverrides: ModeAgentOverrides,
  roster: MemberRoster | null,
  execDefaults: ExecDefaultsConfig = {},
  stageRole?: AgentStageRole,
): AgentOverrideResolution {
  const nickname =
    agentNicknameOverride ??
    (mode === "review" ? modeAgentOverrides.review : modeAgentOverrides.edit);
  if (!nickname) return { kind: "none" };

  const flag = agentNicknameOverride ? "--by" : mode === "review" ? "--review-by" : "--edit-by";
  const member = roster?.members.find((m) => m.type === "agent" && m.nickname === nickname);
  if (member && stageRole !== undefined && member.stage_role !== stageRole) {
    return {
      kind: "error",
      message: `${flag} agent must have stage_role: ${stageRole} for this pipeline stage: ${nickname}`,
    };
  }
  let command: string | undefined;
  try {
    command = member ? resolveMemberCommand(execDefaults, member) : undefined;
  } catch (error) {
    return { kind: "error", message: error instanceof Error ? error.message : String(error) };
  }
  if (!member || !command) {
    return {
      kind: "error",
      message: `${flag} agent nickname not found in pm-members.yaml (or has no resolvable command): ${nickname}`,
    };
  }
  return {
    kind: "command",
    command,
    actor: member.nickname,
    provider: member.provider,
  };
}

export type ResolvedRequirements = {
  capabilities: string[];
  proficiency?: Proficiency;
  stage_role?: AgentStageRole;
};

type PreparedTask = {
  task: ReadyTaskView;
  actor: string;
  agentCandidates: AgentRunCandidate[];
  plan: string;
  prompt: string;
  worktree: ExecWorktree;
  resultPath?: string;
  resultScaffold?: Record<string, unknown>;
  priorLimitAttempts?: number;
  pipelineRunId?: string;
  pipelineResumeStage?: AgentStageRole;
  pipelineStateRef?: string;
  reporterCandidates?: AgentRunCandidate[];
};

type PlanGenPaths = {
  catalogPath?: string;
  rolesPath?: string;
  viewpointsPath?: string;
  projectContext?: string[];
};

type AsyncLock = {
  runExclusive: <T>(fn: () => Promise<T> | T) => Promise<T>;
};

class SerialAsyncLock implements AsyncLock {
  private tail: Promise<void> = Promise.resolve();

  async runExclusive<T>(fn: () => Promise<T> | T): Promise<T> {
    const previous = this.tail;
    let release!: () => void;
    this.tail = new Promise<void>((resolveTail) => {
      release = resolveTail;
    });
    await previous;
    try {
      return await fn();
    } finally {
      release();
    }
  }
}

export type CompletionDrivenWorkerPoolResult = {
  launched: number;
  completed: number;
};

export async function runCompletionDrivenWorkerPool<TItem, TResult>(options: {
  maxParallel: number;
  fillSlots: (openSlots: number) => Promise<TItem[]> | TItem[];
  runItem: (item: TItem) => Promise<TResult>;
  onSettled?: (
    item: TItem,
    result: TResult,
  ) => Promise<{ stop?: boolean } | void> | { stop?: boolean } | void;
}): Promise<CompletionDrivenWorkerPoolResult> {
  type RunningItem = {
    token: number;
    item: TItem;
    promise: Promise<{ token: number; item: TItem; result: TResult }>;
  };

  const running = new Map<number, RunningItem>();
  let nextToken = 1;
  let stop = false;
  let launched = 0;
  let completed = 0;

  const start = (item: TItem): void => {
    const token = nextToken++;
    running.set(token, {
      token,
      item,
      promise: options.runItem(item).then((result) => ({ token, item, result })),
    });
    launched++;
  };

  const refill = async (): Promise<void> => {
    if (stop || running.size >= options.maxParallel) return;
    const items = await options.fillSlots(options.maxParallel - running.size);
    for (const item of items) {
      if (running.size >= options.maxParallel) break;
      start(item);
    }
  };

  await refill();
  while (running.size > 0) {
    const outcome = await Promise.race(
      [...running.values()].map((runningItem) => runningItem.promise),
    );
    running.delete(outcome.token);
    completed++;
    const action = await options.onSettled?.(outcome.item, outcome.result);
    if (action?.stop) stop = true;
    await refill();
  }

  return { launched, completed };
}

export function buildTaskPhaseMap(schedulePath: string): {
  localIdToPhaseSets: Map<string, string[]>;
  phaseSetSuffixToId: Map<string, string>;
} {
  const localIdToPhaseSets = new Map<string, string[]>();
  const phaseSetSuffixToId = new Map<string, string>();

  const strategyFiles = listFilesRecursive(schedulePath).filter((f) =>
    /sch-strategy-.*\.(yaml|yml)$/.test(f),
  );

  for (const filePath of strategyFiles) {
    let strategy: StrategyFile;
    try {
      strategy = readYaml(filePath) as StrategyFile;
    } catch {
      continue;
    }
    if (!strategy?.phase_sets || !Array.isArray(strategy.owner_rules)) continue;

    let defaultPhaseSets: string[];
    try {
      defaultPhaseSets = phaseSetNames(
        normalizePhaseSetSelection(
          strategy.default_phase_sets,
          strategy.default_phase_set
            ? [strategy.default_phase_set]
            : Object.keys(strategy.phase_sets),
        ),
      );
    } catch {
      continue;
    }

    for (const [phaseSetName, phases] of Object.entries(strategy.phase_sets)) {
      for (const phase of phases) {
        phaseSetSuffixToId.set(`${phaseSetName}:${phase.task_suffix}`, phase.id);
      }
    }

    for (const rule of strategy.owner_rules) {
      let phaseSets: string[];
      try {
        phaseSets = rule.phase_sets
          ? phaseSetNames(normalizePhaseSetSelection(rule.phase_sets, []))
          : rule.phase_set
            ? [rule.phase_set]
            : defaultPhaseSets;
      } catch {
        continue;
      }
      for (const localId of rule.local_ids) {
        localIdToPhaseSets.set(localId, phaseSets);
      }
    }
  }

  return { localIdToPhaseSets, phaseSetSuffixToId };
}

export function resolveTaskPhaseContext(
  task: ReadyTaskView,
  localIdToPhaseSets: Map<string, string[]>,
  phaseSetSuffixToId: Map<string, string>,
): TaskPhaseContext | null {
  // ready.json/schedule 側で phase_set・phase_id が既に確定しているタスクは、それを正として
  // 直接返す。cross-deliverable-pass タスク（single local_id を持たず target_local_ids のみを
  // 持つ）はこの分岐でしか解決できないため、local_id の有無より先に判定する。ここで local_id
  // チェックを先にすると、target_local_ids しか持たないタスクは常に「not found in sch-strategy
  // files」で失敗する。
  if (task.phase_set && task.phase_id) {
    return { localId: task.local_id ?? "", phaseSet: task.phase_set, phaseId: task.phase_id };
  }

  const localId = task.local_id;
  if (!localId) return null;

  const suffix = task.phase_suffix ?? extractPhaseSuffix(task.id);
  if (!suffix) return null;

  const phaseSets = localIdToPhaseSets.get(localId);
  if (!phaseSets) return null;

  for (const phaseSet of task.phase_set ? [task.phase_set] : phaseSets) {
    const phaseId = phaseSetSuffixToId.get(`${phaseSet}:${suffix}`);
    if (phaseId) return { localId, phaseSet, phaseId };
  }

  return null;
}

export function selectCandidates(
  requirements: ResolvedRequirements,
  roster: MemberRoster | null,
  taskMode?: string,
  busyActors?: ReadonlySet<string>,
  execDefaults: ExecDefaultsConfig = {},
): ProjectMember[] {
  if (!roster) return [];
  const { capabilities: required, proficiency, stage_role: stageRole } = requirements;
  return roster.members
    .filter((m) => {
      // Runnable agents need a command source: a provider command_template or an
      // explicit member-level command override.
      if (m.type !== "agent" || !hasMemberCommandSource(execDefaults, m)) return false;
      // Temporarily disabled agents (e.g. to isolate one provider while testing rate limits)
      // are skipped during auto-selection.
      if (m.disabled === true) return false;
      const caps = m.capabilities ?? [];
      if (!required.every((c) => caps.includes(c))) return false;
      if (proficiency !== undefined && m.proficiency !== proficiency) return false;
      // Pipeline agents and legacy agents form disjoint auto-selection pools. This keeps newly
      // introduced executor/reporter definitions out of existing single-agent tasks while also
      // preventing legacy agents from silently filling a pipeline stage.
      if (stageRole === undefined) {
        if (m.stage_role !== undefined) return false;
      } else if (m.stage_role !== stageRole) {
        return false;
      }
      // If agent declares a mode and task has a mode, they must match.
      // Agents without a mode field are mode-agnostic and match any task.
      if (m.mode !== undefined && taskMode !== undefined && m.mode !== taskMode) return false;
      return true;
    })
    .sort((a, b) => {
      // Primary: agents already busy on a "doing" task sort last. This spreads parallel runs
      // across agents instead of piling every task onto the same top-priority command and
      // hitting its rate limit.
      const aBusy = busyActors?.has(a.nickname) ? 1 : 0;
      const bBusy = busyActors?.has(b.nickname) ? 1 : 0;
      if (aBusy !== bBusy) return aBusy - bBusy;
      // Secondary: priority (lower number = tried first)
      const aPriority = a.priority ?? 999;
      const bPriority = b.priority ?? 999;
      if (aPriority !== bPriority) return aPriority - bPriority;
      // Tertiary: fewest extra capabilities (tie-breaker within same priority)
      const aExtra = (a.capabilities?.length ?? 0) - required.length;
      const bExtra = (b.capabilities?.length ?? 0) - required.length;
      return aExtra - bExtra;
    });
}

// Collect the nicknames of actors currently working a "doing" task, derived from the event log
// (not the state.json cache) so freshly claimed tasks within the same parallel round are seen.
// Used to deprioritize busy agents during auto-selection. Failures degrade to "no busy info".
function collectBusyActors(schedulePath: string): Set<string> {
  const busy = new Set<string>();
  try {
    const sch = buildScheduleIndex(schedulePath);
    const evts = readAllEventFiles(schedulePath);
    const initTasks = buildInitialStateFromStrategy(schedulePath, sch);
    const snap = foldEventsToState(evts, sch, schedulePath, initTasks);
    for (const taskState of Object.values(snap.tasks ?? {})) {
      if (taskState?.state === "doing" && taskState.last_by) busy.add(taskState.last_by);
    }
  } catch {
    // ignore; selection falls back to priority-only ordering
  }
  return busy;
}

export function isRateLimitError(
  exitCode: number | null,
  output: string,
  detection: RateLimitDetection | undefined,
): boolean {
  if (!detection) return false;
  // exit_codes is a standalone signal: an exact configured code identifies a rate limit
  // on its own. Keep this list minimal (see exec-defaults.yaml) since generic codes like 1
  // also mean ordinary failure.
  if (detection.exit_codes && exitCode !== null && detection.exit_codes.includes(exitCode)) {
    return true;
  }
  if (detection.stderr_patterns) {
    // `output` is the agent's combined stdout+stderr: some CLIs print the limit notice to
    // stdout, not stderr (e.g. claude's "You've hit your session limit"), so scanning stderr
    // alone misses it. By default a pattern only counts when the process also failed (non-zero
    // or null exit). A successful run (exit 0) that merely echoes the phrase — e.g. an agent
    // editing a file containing the literal text "rate limit" — is not a rate limit.
    const requireNonzeroExit = detection.stderr_requires_nonzero_exit ?? true;
    if (!requireNonzeroExit || exitCode !== 0) {
      const lower = output.toLowerCase();
      for (const pattern of detection.stderr_patterns) {
        if (lower.includes(pattern.toLowerCase())) return true;
      }
    }
  }
  return false;
}

function resolveExecDefaultsPath(opts: RunOpts, schedulePath: string): string {
  if (opts.execDefaults) return opts.execDefaults;
  if (opts.agentConfig) return opts.agentConfig;

  const { config } = loadConfig();
  if (config) {
    const rootDir = specdojoRootDir();
    for (const project of Object.values(config.projects)) {
      const projSchedulePath = resolve(rootDir, getProjectSchedulePath(project));
      if (projSchedulePath === schedulePath && project.run?.exec_defaults) {
        return resolve(rootDir, project.run.exec_defaults);
      }
      if (projSchedulePath === schedulePath && project.run?.agent_config) {
        return resolve(rootDir, project.run.agent_config);
      }
    }
  }

  return defaultExecDefaultsPath();
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

function parseParallel(value: string | undefined): number {
  const text = value ?? "1";
  if (!/^\d+$/.test(text)) {
    throw new Error(`--parallel must be a positive integer: ${value ?? ""}`);
  }
  const parsed = Number.parseInt(text, 10);
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new Error(`--parallel must be a positive integer: ${value ?? ""}`);
  }
  return parsed;
}

export function parseExecRunBusyPolicy(value: string | undefined): ExecRunBusyPolicy {
  const policy = value ?? "fail";
  if (policy !== "skip" && policy !== "wait" && policy !== "fail") {
    throw new Error(`--if-busy must be "skip", "wait", or "fail": ${value ?? ""}`);
  }
  return policy;
}

async function withProjectExecRunLock(
  opts: RunOpts,
  commandLabel: "run" | "resume" | "cycle",
  action: () => Promise<void>,
): Promise<void> {
  const resolvedPaths = resolveProjectPaths({ project: opts.project });
  const policy = parseExecRunBusyPolicy(opts.ifBusy);
  const handle = await acquireExecRunLock(resolvedPaths.executionPath, {
    actor: opts.by ?? `exec-${commandLabel}`,
    ifBusy: policy,
    onWait: () => process.stdout.write(`[${commandLabel}] exec busy — waiting\n`),
  });

  if (!handle) {
    process.stdout.write(`[${commandLabel}] skipped: exec busy\n`);
    if (process.env[ROUTINE_EXEC_ENV] === "1") {
      process.exitCode = ROUTINE_BUSY_SKIP_EXIT_CODE;
    }
    return;
  }

  try {
    await action();
  } finally {
    releaseExecRunLock(handle);
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, ms));
}

export function expandPromptRefs(
  prompt: string,
  indexPath = resolve(specdojoRootDir(), ".specdojo/doc-index.json"),
): string {
  if (!existsSync(indexPath)) return prompt;

  // Agents open the referenced files directly, so resolve [[id]] refs to canonical
  // repo-relative paths (no leading slash) rather than markdown links. This keeps every
  // path in the agent-consumed plan in one form that resolves from the run CWD.
  const result = replaceDocIndexRefs(prompt, indexPath, {
    format: "path",
    missing: "keep",
  });
  if (result.missingIds.length > 0) {
    process.stderr.write(`Unresolved ID reference(s): ${result.missingIds.join(", ")}\n`);
  }
  return result.content;
}

export function loadPrompt(executionPath: string, taskId: string): string | null {
  const plan = loadPlan(executionPath, taskId);
  return plan ? expandPromptRefs(plan) : null;
}

function executorEvidenceContract(parentValidationIds: readonly string[]): string {
  const parentValidationCommands = resolveParentValidationDefinitions(parentValidationIds).map(
    (definition) => definition.displayCommand,
  );
  const parentValidationInstruction =
    parentValidationIds.length > 0
      ? `\nThe SpecDojo parent runner will execute these allowlisted validations after you exit: ${parentValidationIds.join(", ")} (${parentValidationCommands.join(", ")}). Do not run those commands inside the agent sandbox or report duplicate executor results for them. Run only the remaining sandbox-safe validations required by the plan. Parent-run results will be appended to evidence with source=runner and are authoritative.\n`
      : "";
  return `

---

# Pipeline executor stage instructions

This invocation is the executor stage of an executor/reporter pipeline. Edit and validate the
artifacts required by the plan, but do not create or update the result file. Any plan instruction
that assigns result writing or lifecycle transitions to the agent belongs to the later reporter or
runner stage and does not apply here.
${parentValidationInstruction}

End the final response with exactly one machine-readable report using this envelope. Do not place
Markdown fences around the JSON.

<specdojo_executor_evidence>
{"final_message":"concise outcome","validations":[{"command":"exact command","status":"passed|failed|not_run","summary":"concise result"}]}
</specdojo_executor_evidence>
`;
}

export function buildExecutorPrompt(
  plan: string,
  parentValidationIds: readonly string[] = [],
): string {
  return `${plan.trimEnd()}${executorEvidenceContract(parentValidationIds)}`;
}

async function runConfiguredParentValidations(
  execDefaults: ExecDefaultsConfig,
  cwd: string,
): Promise<Awaited<ReturnType<typeof runParentValidations>>> {
  const ids = execDefaults.pipeline?.parent_validations;
  if (!ids?.length) return [];
  process.stdout.write(`  Running parent validations: ${ids.join(", ")}\n`);
  const validations = await runParentValidations(ids, cwd);
  for (const validation of validations) {
    process.stdout.write(
      `  Parent validation ${validation.id ?? validation.command}: ${validation.status}\n`,
    );
  }
  return validations;
}

async function revalidateFailedParentValidationsForReporterResume(params: {
  execDefaults: ExecDefaultsConfig;
  cwd: string;
  evidence: ExecEvidence;
  evidencePath: string;
}): Promise<ExecEvidence> {
  if (!failedParentValidationReason(params.evidence.validations)) return params.evidence;

  process.stdout.write("  Re-running failed parent validations before reporter resume.\n");
  const parentValidations = await runConfiguredParentValidations(params.execDefaults, params.cwd);
  const evidence = replaceParentValidationResults(params.evidence, parentValidations);
  writeExecutorEvidence(params.evidencePath, evidence);
  process.stdout.write(
    `  Refreshed executor evidence: ${relative(params.cwd, params.evidencePath).split(sep).join("/")}\n`,
  );
  return evidence;
}

export function executorRequirements(task: ReadyTaskView): ResolvedRequirements | undefined {
  const executor = task.agent_pipeline?.stages[0];
  if (!executor || executor.stage_role !== "executor") return undefined;
  return {
    capabilities: executor.capabilities ?? [],
    proficiency: executor.proficiency,
    stage_role: "executor",
  };
}

export function reporterRequirements(task: ReadyTaskView): ResolvedRequirements | undefined {
  const reporter = task.agent_pipeline?.stages[1];
  if (!reporter || reporter.stage_role !== "reporter") return undefined;
  return {
    capabilities: reporter.capabilities ?? [],
    proficiency: reporter.proficiency,
    stage_role: "reporter",
  };
}

function resolveReporterAgentCandidates(
  task: ReadyTaskView,
  roster: MemberRoster | null,
  execDefaults: ExecDefaultsConfig,
  busyActors?: ReadonlySet<string>,
  nicknameOverride?: string,
): AgentRunCandidate[] {
  const requirements = reporterRequirements(task);
  if (!requirements) return [];
  if (nicknameOverride) {
    const resolution = resolveAgentOverride(
      task.mode ?? "edit",
      nicknameOverride,
      {},
      roster,
      execDefaults,
      "reporter",
    );
    if (resolution.kind === "error") {
      throw new Error(resolution.message.replace(/^--by/, "--reporter-by"));
    }
    if (resolution.kind === "command") {
      return [
        {
          command: resolution.command,
          actor: resolution.actor,
          provider: resolution.provider,
        },
      ];
    }
  }
  // Reporter behavior (turn captured evidence into a structured result; write nothing
  // else) does not vary between edit and review tasks, unlike the executor stage. Do not
  // filter reporter candidates by task.mode: a reporter member's own `mode` (if it has
  // one, e.g. to resolve a provider command_template placeholder) only affects command
  // construction, not eligibility.
  const candidates: AgentRunCandidate[] = [];
  for (const member of selectCandidates(
    requirements,
    roster,
    undefined,
    busyActors,
    execDefaults,
  )) {
    try {
      const command = resolveMemberCommand(execDefaults, member);
      if (command) candidates.push({ command, actor: member.nickname, provider: member.provider });
    } catch (error) {
      process.stdout.write(
        `  Skipping reporter ${member.nickname}: ${error instanceof Error ? error.message : String(error)}\n`,
      );
    }
  }
  return candidates;
}

export function loadRosterForExecutionPath(executionPath: string): MemberRoster | null {
  const { config } = loadConfig();
  if (!config) return null;

  const rootDir = specdojoRootDir();
  for (const project of Object.values(config.projects)) {
    const projExecPath = resolve(rootDir, getProjectExecutionPath(project));
    if (projExecPath === executionPath) {
      try {
        return loadMemberRoster(rootDir, project);
      } catch {
        return null;
      }
    }
  }
  return null;
}

async function executeAgent(
  agentCommand: string,
  prompt: string,
  detection: RateLimitDetection | undefined,
  provider: AgentProvider | undefined,
  cooldownSeconds: Partial<Record<AgentLimitKind, number>> | undefined,
  cwd: string,
  env: NodeJS.ProcessEnv,
): Promise<{
  result: RunResult;
  exitCode: number | null;
  stdout: string;
  stderr: string;
  limit?: AgentLimitSignal;
}> {
  if (!agentCommand.trim()) {
    return { result: "failure", exitCode: null, stdout: "", stderr: "Empty agent command" };
  }

  // stdout is piped (not inherited) so it can be scanned for rate-limit signals: some CLIs print
  // the limit notice to stdout, not stderr (e.g. claude's "session limit"). Each chunk is teed to
  // the parent's stdout so live output/logging is preserved.
  const child = spawn(agentCommand, {
    cwd,
    env,
    shell: true,
    stdio: ["pipe", "pipe", "pipe"],
  });
  // stdin を読まずに即終了するコマンドへの書き込みは EPIPE になる。未処理だと
  // プロセスごと落ちて失敗時の後処理（block 遷移・result 更新）が走らないため無視する。
  // 実行結果は終了コードで判定する。
  child.stdin.on("error", () => undefined);
  let stdout = "";
  let stderr = "";
  child.stdout.setEncoding("utf8");
  child.stdout.on("data", (chunk: string) => {
    stdout += chunk;
    process.stdout.write(chunk);
  });
  child.stderr.setEncoding("utf8");
  child.stderr.on("data", (chunk: string) => {
    stderr += chunk;
    process.stderr.write(chunk);
  });
  child.stdin.end(prompt);

  const exitCode = await new Promise<number | null>((resolveExit) => {
    child.once("error", (error) => {
      stderr += `${error.message}\n`;
      resolveExit(null);
    });
    child.once("close", (code) => resolveExit(code));
  });

  const combinedOutput = `${stdout}\n${stderr}`;
  if (isRateLimitError(exitCode, combinedOutput, detection)) {
    return {
      result: "rate_limit",
      exitCode,
      stdout,
      stderr,
      limit: normalizeAgentLimit({
        output: combinedOutput,
        provider,
        cooldownSeconds,
      }),
    };
  }
  if (exitCode !== 0) {
    return { result: "failure", exitCode, stdout, stderr };
  }
  return { result: "success", exitCode: 0, stdout, stderr: "" };
}

// Run the task's agent command, falling back through the remaining candidates on rate limit.
// The next-priority candidate is assumed to be a different account/provider, so we switch to it
// immediately (no wait). Only after every candidate is rate-limited do we wait+backoff and run
// another full pass, bounded by rate_limit_policy.on_critical.retry.max_attempts. Applies to all
// tasks (critical and non-critical) so a rate limit no longer stops the run outright.
//
// Detection is resolved per candidate from its provider (e.g. claude's "session limit" vs
// opencode's "timeout"/"out of memory"); the run-level retry/backoff policy is governed by the
// primary (highest-priority) candidate's provider.
async function runWithRetry(
  candidates: AgentRunCandidate[],
  prompt: string,
  execDefaults: ExecDefaultsConfig,
  cwd: string,
  env: NodeJS.ProcessEnv,
): Promise<{
  result: RunResult;
  exitCode: number | null;
  stdout: string;
  stderr: string;
  attempts: number;
  limit?: AgentLimitSignal;
}> {
  const policy = resolveRateLimitPolicy(execDefaults, candidates[0]?.provider);
  let attempts = 0;

  // One pass tries every candidate in priority order with no wait between switches.
  const runPass = async (): Promise<{
    result: RunResult;
    exitCode: number | null;
    stdout: string;
    stderr: string;
    limit?: AgentLimitSignal;
  }> => {
    let lastStderr = "";
    let lastStdout = "";
    let lastExitCode: number | null = null;
    let lastLimit: AgentLimitSignal | undefined;
    for (let idx = 0; idx < candidates.length; idx++) {
      if (idx > 0) {
        process.stdout.write(
          `Rate limit detected. Switching to next agent (${idx + 1}/${candidates.length})...\n`,
        );
      }
      const detection = resolveRateLimitDetection(execDefaults, candidates[idx].provider);
      attempts++;
      const protectedConfigBefore = captureAgentProtectedConfigSnapshot(cwd);
      const attempt = await executeAgent(
        candidates[idx].command,
        prompt,
        detection,
        candidates[idx].provider,
        policy?.cooldown_seconds,
        cwd,
        env,
      );
      const protectedConfigChanges = changedAgentProtectedConfigPaths(cwd, protectedConfigBefore);
      if (protectedConfigChanges.length > 0) {
        const reason = agentProtectedConfigViolation(protectedConfigChanges);
        process.stderr.write(`blocked: ${reason}\n`);
        return {
          result: "failure",
          exitCode: 1,
          stdout: attempt.stdout,
          stderr: `${attempt.stderr}${attempt.stderr.endsWith("\n") || !attempt.stderr ? "" : "\n"}${reason}\n`,
        };
      }
      lastStderr = attempt.stderr;
      lastStdout = attempt.stdout;
      lastExitCode = attempt.exitCode;
      lastLimit = attempt.limit;
      if (attempt.result !== "rate_limit")
        return {
          result: attempt.result,
          exitCode: attempt.exitCode,
          stdout: attempt.stdout,
          stderr: attempt.stderr,
        };
    }
    return {
      result: "rate_limit",
      exitCode: lastExitCode,
      stdout: lastStdout,
      stderr: lastStderr,
      limit: lastLimit,
    };
  };

  const firstPass = await runPass();
  if (firstPass.result !== "rate_limit") return { ...firstPass, attempts };

  // Every candidate is rate-limited. Without a policy we cannot bound further retries, so stop.
  if (!policy) {
    process.stdout.write(`Rate limit: all ${candidates.length} agent(s) exhausted.\n`);
    return { ...firstPass, attempts };
  }

  // Session and quota limits do not recover within the short in-process backoff loop. Keep their
  // explicit reset/cooldown for a later routine invocation instead of sleeping and retrying now.
  if (firstPass.limit?.kind === "session_limit" || firstPass.limit?.kind === "quota_exhausted") {
    return { ...firstPass, attempts };
  }

  const { retry } = policy.on_critical;
  let waitSeconds = retry.initial_wait_seconds;
  let lastStderr = firstPass.stderr;
  let lastStdout = firstPass.stdout;
  let lastExitCode = firstPass.exitCode;
  let lastLimit = firstPass.limit;

  // First pass counts as attempt 1; remaining passes wait+backoff before retrying all candidates.
  for (let pass = 2; pass <= retry.max_attempts; pass++) {
    const actualWait = Math.min(waitSeconds, retry.max_wait_seconds);
    process.stdout.write(
      `Rate limit: all agents exhausted (attempt ${pass}/${retry.max_attempts}). Waiting ${actualWait}s before retry...\n`,
    );
    await delay(actualWait * 1000);

    const result = await runPass();
    lastStderr = result.stderr;
    lastStdout = result.stdout;
    lastExitCode = result.exitCode;
    lastLimit = result.limit;
    if (result.result !== "rate_limit") return { ...result, attempts };

    waitSeconds = Math.min(waitSeconds * retry.backoff_multiplier, retry.max_wait_seconds);
  }

  process.stdout.write(
    `Rate limit: all ${candidates.length} agent(s) exhausted after ${retry.max_attempts} attempt(s).\n`,
  );
  return {
    result: "rate_limit",
    exitCode: lastExitCode,
    stdout: lastStdout,
    stderr: lastStderr,
    attempts,
    limit: lastLimit,
  };
}

function pathInsideWorktree(repoRoot: string, worktreePath: string, sourcePath: string): string {
  const repoRelative = relative(repoRoot, sourcePath);
  if (repoRelative === ".." || repoRelative.startsWith(`..${sep}`)) {
    throw new Error(`Project path is outside repository root: ${sourcePath}`);
  }
  return resolve(worktreePath, repoRelative);
}

function agentEnvironment(
  repoRoot: string,
  worktreePath: string,
  schedulePath: string,
  executionPath: string,
): NodeJS.ProcessEnv {
  return {
    ...process.env,
    SPECDOJO_SCHEDULE_PATH: pathInsideWorktree(repoRoot, worktreePath, schedulePath),
    SPECDOJO_EXECUTION_PATH: pathInsideWorktree(repoRoot, worktreePath, executionPath),
  };
}

function findClaimEventPath(schedulePath: string, taskId: string): string | null {
  const claims = readAllEventFiles(schedulePath).filter(
    (item) => item.event.task_id === taskId && item.event.type === "claim",
  );
  return claims[claims.length - 1]?.path ?? null;
}

async function prepareSingleTask(
  task: ReadyTaskView,
  projectId: string | undefined,
  repoRoot: string,
  schedulePath: string,
  executionPath: string,
  roster: MemberRoster | null,
  localIdToPhaseSets: Map<string, string[]>,
  phaseSetSuffixToId: Map<string, string>,
  agentNicknameOverride: string | undefined,
  modeAgentOverrides: ModeAgentOverrides,
  stageAgentOverrides: StageAgentOverrides,
  actorOverride: string | undefined,
  dryRun: boolean,
  skipClaim: boolean,
  worktreeBase: string,
  planGenPaths: PlanGenPaths,
  execDefaults: ExecDefaultsConfig,
  hasProviderCapacity?: (provider?: AgentProvider) => boolean,
  pipelineResume?: { stage?: AgentStageRole; stateRef?: string },
): Promise<PreparedTask | RunResult | "deferred"> {
  const mode = task.mode ?? "edit";
  process.stdout.write(`Task: ${task.id}${task.name ? ` — ${task.name}` : ""}  [${mode}]\n`);

  if (!task.agent_pipeline && (stageAgentOverrides.executor || stageAgentOverrides.reporter)) {
    process.stdout.write("  --executor-by / --reporter-by require an agent_pipeline task.\n");
    return "failure";
  }

  // Mode-specific overrides (--edit-by / --review-by) let nightly batch runs route edit and
  // review to different agents (e.g. local LLMs) without editing the roster. They take an agent
  // nickname whose command is resolved from pm-members.yaml; a mode without an override falls back
  // to normal auto-selection.
  const overrideResolution = resolveAgentOverride(
    mode,
    task.agent_pipeline
      ? (stageAgentOverrides.executor ?? agentNicknameOverride)
      : agentNicknameOverride,
    modeAgentOverrides,
    roster,
    execDefaults,
    task.agent_pipeline ? "executor" : undefined,
  );
  if (overrideResolution.kind === "error") {
    process.stdout.write(`  ${overrideResolution.message}\n`);
    return "failure";
  }
  const agentCandidates: AgentRunCandidate[] =
    overrideResolution.kind === "command"
      ? [
          {
            command: overrideResolution.command,
            actor: overrideResolution.actor,
            provider: overrideResolution.provider,
          },
        ]
      : [];
  let actor = actorOverride ?? "auto-agent";
  if (!actorOverride && overrideResolution.kind === "command" && overrideResolution.actor) {
    actor = overrideResolution.actor;
  }

  if (agentCandidates.length === 0) {
    // Human tasks cannot be run automatically without an explicit registered agent override.
    if ((task.execution ?? "agent") === "human") {
      process.stdout.write(
        `  Task "${task.name ?? task.id}" (${task.id}) has execution: human.\n` +
          `  This task requires human execution. Use --by <nickname> to override.\n`,
      );
      return "failure";
    }

    const phaseCtx = resolveTaskPhaseContext(task, localIdToPhaseSets, phaseSetSuffixToId);
    if (!phaseCtx) {
      process.stdout.write(
        `  Cannot resolve phase context for "${task.name ?? task.id}": not found in sch-strategy files\n`,
      );
      return "failure";
    }

    const requirements: ResolvedRequirements = executorRequirements(task) ?? {
      capabilities: task.capabilities ?? [],
      proficiency: task.proficiency,
    };

    const busyActors = collectBusyActors(schedulePath);
    const candidates = selectCandidates(requirements, roster, mode, busyActors, execDefaults);
    if (candidates.length === 0) {
      process.stdout.write(
        `  No agents found for mode: ${mode}, capabilities: [${requirements.capabilities.join(", ")}]${requirements.proficiency ? `, proficiency: ${requirements.proficiency}` : ""}${requirements.stage_role ? `, stage_role: ${requirements.stage_role}` : ""}\n`,
      );
      return "failure";
    }

    // Per-provider concurrency caps (exec-defaults providers.<name>.max_concurrency) drop any
    // candidate whose provider already reached its limit this round. If a non-capped provider
    // remains it becomes the primary; if every candidate's provider is at capacity, defer the
    // task to a later round before claiming or setting up its worktree.
    const available = hasProviderCapacity
      ? candidates.filter((c) => hasProviderCapacity(c.provider))
      : candidates;
    if (available.length === 0) {
      process.stdout.write(
        `  [run] deferred: ${task.id} — all candidate providers at concurrency cap this round\n`,
      );
      return "deferred";
    }

    // Expand each candidate's launch command. A broken provider template (unresolved
    // placeholder, ambiguous command_params) skips that candidate with a warning so a
    // misconfigured provider does not block fallback to other providers.
    const runnable: ProjectMember[] = [];
    for (const candidate of available) {
      try {
        const command = resolveMemberCommand(execDefaults, candidate);
        if (!command) continue;
        agentCandidates.push({
          command,
          actor: candidate.nickname,
          provider: candidate.provider,
        });
        runnable.push(candidate);
      } catch (error) {
        process.stdout.write(
          `  Skipping ${candidate.nickname}: ${error instanceof Error ? error.message : String(error)}\n`,
        );
      }
    }
    if (runnable.length === 0) {
      process.stdout.write(
        `  No agent with a resolvable command for mode: ${mode} (check providers.<provider>.command_template in exec-defaults.yaml)\n`,
      );
      return "failure";
    }
    if (!actorOverride) actor = runnable[0].nickname;
    process.stdout.write(
      `  Phase: ${phaseCtx.phaseSet}/${phaseCtx.phaseId}  Mode: ${mode}  Agent: ${runnable[0].nickname}\n`,
    );
  }

  let reporterCandidates: AgentRunCandidate[] | undefined;
  if (task.agent_pipeline) {
    const requirements = reporterRequirements(task);
    reporterCandidates = resolveReporterAgentCandidates(
      task,
      roster,
      execDefaults,
      collectBusyActors(schedulePath),
      stageAgentOverrides.reporter,
    );
    if (reporterCandidates.length === 0) {
      process.stdout.write(
        `  No agents found for reporter stage${requirements?.proficiency ? `, proficiency: ${requirements.proficiency}` : ""}\n`,
      );
      return "failure";
    }
  }

  // Plans are generated on demand here; `exec refresh` does not manage them.
  await generateSinglePlan({
    executionPath,
    projectId: projectId ?? "",
    catalogPath: planGenPaths.catalogPath ?? "",
    rolesPath: planGenPaths.rolesPath,
    viewpointsPath: planGenPaths.viewpointsPath,
    projectContext: planGenPaths.projectContext,
    task,
  });

  const planPrompt = loadPrompt(executionPath, task.id);
  if (!planPrompt) {
    process.stdout.write(`  Plan not found for ${task.id}.\n`);
    return "failure";
  }
  const prompt = task.agent_pipeline
    ? buildExecutorPrompt(planPrompt, execDefaults.pipeline?.parent_validations)
    : planPrompt;
  const pipelineRunId = task.agent_pipeline
    ? `${new Date().toISOString().replace(/[-:.]/g, "").replace("Z", "Z")}-${randomHex(4)}`
    : undefined;

  const worktreeTaskId = qualifyTaskId(projectId, task.id);
  const worktreeName = worktreeNameFromTaskId(worktreeTaskId);

  if (dryRun) {
    const worktree: ExecWorktree = {
      path: join(worktreeBase, worktreeName),
      branch: `exec/${worktreeName}`,
      name: worktreeName,
      created: false,
    };
    process.stdout.write(`  [run] would setup: worktree ${worktree.path} (${worktree.branch})\n`);
    const claimMsg = skipClaim
      ? `  [dry-run] already claimed: ${task.id} as ${actor} (skip claim)`
      : `  [dry-run] would claim: ${task.id} as ${actor}`;
    process.stdout.write(claimMsg + "\n");
    process.stdout.write(`  [dry-run] Command: ${agentCandidates[0]?.command ?? ""}\n`);
    process.stdout.write(`  [dry-run] CWD: ${worktree.path}\n`);
    process.stdout.write(`  [dry-run] Plan: ${prompt.length} chars\n`);
    return {
      task,
      actor,
      agentCandidates,
      plan: planPrompt,
      prompt,
      worktree,
      pipelineRunId,
      pipelineResumeStage: pipelineResume?.stage,
      pipelineStateRef: pipelineResume?.stateRef,
      reporterCandidates,
    };
  }

  if (skipClaim) {
    process.stdout.write(`  Already claimed: ${task.id} as ${actor}\n`);
  } else {
    process.stdout.write(`  Claiming: ${task.id} as ${actor}\n`);
    if (!spawnClaim(projectId, task.id, actor)) {
      process.stdout.write(`  Claim failed: ${task.id}\n`);
      return "failure";
    }
  }

  const planRef = `exec/plans/${task.id}-plan.md`;
  const startedAt = new Date().toISOString();
  const reviewSections =
    (task.mode ?? "edit") === "review"
      ? reviewResultSectionsForDeliverable(planGenPaths.catalogPath ?? "", task.local_id)
      : undefined;
  const finalizeSections =
    task.approach === "finalize" || task.approach === "bootstrap-finalize"
      ? finalizeResultSectionsForDeliverable(
          planGenPaths.catalogPath ?? "",
          task.local_id,
          task.approach,
        )
      : undefined;
  const targets = targetDocIdsForScheduledTask(
    planGenPaths.catalogPath ?? "",
    task,
    projectId ?? "",
  );
  const { resultPath } = await scaffoldResult({
    executionPath,
    taskId: task.id,
    mode: task.mode ?? "edit",
    projectId: projectId ?? "",
    planRef,
    agent: actor,
    startedAt,
    ...(task.approach ? { approach: task.approach } : {}),
    ...(targets ? { targets } : {}),
    ...(reviewSections ? { reviewSections } : {}),
    ...(finalizeSections ? { finalizeSections } : {}),
  });

  // Commit the execution checkpoint (plan/result/claim event) to root HEAD, then create the
  // worktree from that commit. This lets the agent's deliverable changes be committed and merged
  // back (see runPreparedTask), so later tasks branch from a HEAD that includes prior results.
  const claimEventPath = findClaimEventPath(schedulePath, task.id);
  if (!claimEventPath) {
    process.stdout.write(`  Claim event not found for ${task.id}\n`);
    return "failure";
  }

  // A fresh claim (not a resume) of a task that still owns an exec worktree/branch means a prior
  // lifecycle left residue. Discard it so the checkpoint commit below runs and the root scaffold is
  // committed instead of stranded as untracked changes that later trip the merge-back guard.
  if (!skipClaim) {
    const discarded = discardStaleExecWorktree({
      context: { repoRoot, schedulePath, executionPath },
      worktreeTaskId,
    });
    if (discarded) {
      process.stdout.write(`  [run] discarded stale worktree/branch: ${discarded}\n`);
    }
  }

  let worktree: ExecWorktree;
  try {
    worktree = checkpointAndEnsureWorktree({
      context: { repoRoot, schedulePath, executionPath },
      worktreeTaskId,
      base: worktreeBase,
      checkpointPaths: [
        join(executionPath, "exec", "plans", `${task.id}-plan.md`),
        resultPath,
        claimEventPath,
      ],
      commitMessage: `exec(${task.id}): prepare execution`,
    });
  } catch (error) {
    // We claimed this task in this call (skipClaim is false); the checkpoint failed, so release the
    // claim (doing → todo). Otherwise the task is stranded in "doing" with no worktree and drops out
    // of ready.json. Resumed tasks (skipClaim) were already doing, so leave their state untouched.
    if (!skipClaim) {
      spawnRelease(projectId, task.id, actor, "rollback: checkpoint failed");
      process.stdout.write(`  Claim rolled back (checkpoint failed): ${task.id}\n`);
    }
    throw error;
  }
  const setupAction = worktree.created ? "setup" : "reuse";
  process.stdout.write(`  [run] ${setupAction}: worktree ${worktree.path} (${worktree.branch})\n`);

  return {
    task,
    actor,
    agentCandidates,
    plan: planPrompt,
    prompt,
    worktree,
    resultPath,
    resultScaffold: readResultFrontmatterSnapshot(resultPath),
    pipelineRunId,
    pipelineResumeStage: pipelineResume?.stage,
    pipelineStateRef: pipelineResume?.stateRef,
    reporterCandidates,
  };
}

// An agent can exit 0 without doing the work (e.g. a permission-denied tool call is fed back as a
// tool error and the model ends its turn normally). The agent's core duty is to fill the result while
// preserving its scaffold frontmatter, so treat an incomplete or modified result as a block on exit 0. This
// mirrors the in-place guard in runInPlaceMode; on the worktree path it also prevents an empty task
// from being committed, merged, and unblocking downstream tasks. Only a successful run is reconsidered;
// rate-limit and failure outcomes pass through unchanged.
export function downgradeUnfilledResult(
  agentResult: RunResult,
  resultPath: string | undefined,
  mode: TaskMode,
  scaffoldFrontmatter?: Record<string, unknown>,
  originalScaffoldFrontmatter?: Record<string, unknown>,
): { result: RunResult; unfilledBlock: boolean } {
  if (
    agentResult === "success" &&
    resultPath &&
    isResultUnfilled(resultPath, mode, scaffoldFrontmatter, originalScaffoldFrontmatter)
  ) {
    return { result: "failure", unfilledBlock: true };
  }
  return { result: agentResult, unfilledBlock: false };
}

export function checkCompletionBeforeIntegration(
  schedule: ScheduleIndex,
  snapshot: StateSnapshot,
  taskId: string,
  actor: string,
): { ok: boolean; reason?: string } {
  return canCompleteTask(schedule, snapshot, taskId, actor);
}

function readCompletionPreflight(
  schedulePath: string,
  taskId: string,
  actor: string,
): { ok: boolean; reason?: string } {
  try {
    const schedule = buildScheduleIndex(schedulePath);
    const events = readAllEventFiles(schedulePath);
    const initialTasks = buildInitialStateFromStrategy(schedulePath, schedule);
    const snapshot = foldEventsToState(events, schedule, schedulePath, initialTasks);
    return checkCompletionBeforeIntegration(schedule, snapshot, taskId, actor);
  } catch (error) {
    return {
      ok: false,
      reason: `could not validate current task state: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

async function runPreparedTask(
  prepared: PreparedTask,
  projectId: string | undefined,
  repoRoot: string,
  schedulePath: string,
  executionPath: string,
  catalogPath: string | undefined,
  execDefaults: ExecDefaultsConfig,
  dryRun: boolean,
  lifecycleLock?: AsyncLock,
): Promise<RunResult> {
  if (dryRun) return "success";

  const worktreeResultPath = prepared.resultPath
    ? pathInsideWorktree(repoRoot, prepared.worktree.path, prepared.resultPath)
    : undefined;
  // A resumed worktree may legitimately contain runner-owned blocked lifecycle fields that differ
  // from the root checkpoint. Use the actual pre-run result for this attempt's exact comparison,
  // while retaining the root scaffold below to reject changes to immutable fields across attempts.
  const attemptResultScaffold = worktreeResultPath
    ? readResultFrontmatterSnapshot(worktreeResultPath)
    : undefined;

  process.stdout.write(`  CWD: ${prepared.worktree.path}\n`);
  let result: RunResult = "success";
  let stderr = "";
  let exitCode: number | null = 0;
  let stdout = "";
  let attempts = 0;
  let limit: AgentLimitSignal | undefined;
  let executorEvidenceRef: string | undefined;
  let executorEvidencePath: string | undefined;
  let executorEvidence: ReturnType<typeof recordExecutorEvidence>["evidence"] | undefined;
  let pipelineFailureStage: AgentStageRole = "executor";
  let pipelineBlockReason: string | undefined;
  let reporterLimit: AgentLimitSignal | undefined;
  let reporterAttempts = 0;
  let pipelineState: PipelineState | undefined;
  let pipelineStatePath: string | undefined;
  let pipelineStateRef: string | undefined;
  let resumeReporter = false;

  if (!prepared.pipelineRunId) {
    process.stdout.write(`  Running: ${prepared.agentCandidates[0]?.command ?? ""}\n`);
    const outcome = await runWithRetry(
      prepared.agentCandidates,
      prepared.prompt,
      execDefaults,
      prepared.worktree.path,
      agentEnvironment(repoRoot, prepared.worktree.path, schedulePath, executionPath),
    );
    result = outcome.result;
    stderr = outcome.stderr;
    exitCode = outcome.exitCode;
    stdout = outcome.stdout;
    attempts = outcome.attempts;
    limit = outcome.limit;
  }

  if (prepared.pipelineRunId && prepared.pipelineStateRef) {
    const checkpoint = loadPipelineResumeCheckpoint({
      worktreePath: prepared.worktree.path,
      stateRef: prepared.pipelineStateRef,
      taskId: prepared.task.id,
    });
    if (checkpoint) {
      pipelineState = checkpoint.state;
      pipelineStatePath = checkpoint.statePath;
      pipelineStateRef = prepared.pipelineStateRef;
      if (
        prepared.pipelineResumeStage === "reporter" &&
        checkpoint.evidence &&
        hasRecordedParentValidations(
          checkpoint.evidence.validations,
          execDefaults.pipeline?.parent_validations,
        )
      ) {
        executorEvidence = checkpoint.evidence;
        executorEvidenceRef = checkpoint.state.stages.executor.artifact_ref ?? undefined;
        executorEvidencePath = executorEvidenceRef
          ? resolve(prepared.worktree.path, executorEvidenceRef)
          : undefined;
        resumeReporter = true;
        process.stdout.write(
          `  Resuming reporter from persisted executor evidence: ${executorEvidenceRef}\n`,
        );
        if (failedParentValidationReason(executorEvidence.validations) && executorEvidenceRef) {
          executorEvidence = await revalidateFailedParentValidationsForReporterResume({
            execDefaults,
            cwd: prepared.worktree.path,
            evidence: executorEvidence,
            evidencePath: resolve(prepared.worktree.path, executorEvidenceRef),
          });
        }
      } else if (prepared.pipelineResumeStage === "reporter") {
        process.stdout.write(
          "  Persisted executor evidence is invalid; starting a new executor run.\n",
        );
        pipelineState = undefined;
        pipelineStatePath = undefined;
        pipelineStateRef = undefined;
      }
    }
  }

  if (prepared.pipelineRunId && !pipelineState) {
    const now = new Date().toISOString();
    const location = pipelineStateLocation({
      repoRoot,
      worktreePath: prepared.worktree.path,
      executionPath,
      taskId: prepared.task.id,
      runId: prepared.pipelineRunId,
    });
    pipelineState = createPipelineState({
      taskId: prepared.task.id,
      runId: prepared.pipelineRunId,
      updatedAt: now,
      executorActor: prepared.agentCandidates[0]?.actor ?? prepared.actor,
      reporterActor: prepared.reporterCandidates?.[0]?.actor,
    });
    pipelineStatePath = location.path;
    pipelineStateRef = location.ref;
    writePipelineState(pipelineStatePath, pipelineState);
  }

  if (prepared.pipelineRunId && !resumeReporter && pipelineState && pipelineStatePath) {
    const executorStartedAt = new Date().toISOString();
    pipelineState = updatePipelineStage(
      pipelineState,
      "executor",
      {
        status: "running",
        actor: prepared.agentCandidates[0]?.actor ?? prepared.actor,
        started_at: executorStartedAt,
        completed_at: null,
      },
      executorStartedAt,
    );
    writePipelineState(pipelineStatePath, pipelineState);
    process.stdout.write(`  Running executor: ${prepared.agentCandidates[0]?.command ?? ""}\n`);
    const executorOutcome = await runWithRetry(
      prepared.agentCandidates,
      prepared.prompt,
      execDefaults,
      prepared.worktree.path,
      agentEnvironment(repoRoot, prepared.worktree.path, schedulePath, executionPath),
    );
    result = executorOutcome.result;
    stderr = executorOutcome.stderr;
    exitCode = executorOutcome.exitCode;
    stdout = executorOutcome.stdout;
    attempts = executorOutcome.attempts;
    limit = executorOutcome.limit;
    const parentValidations =
      result === "success"
        ? await runConfiguredParentValidations(execDefaults, prepared.worktree.path)
        : [];
    const recorded = recordExecutorEvidence({
      repoRoot,
      worktreePath: prepared.worktree.path,
      executionPath,
      taskId: prepared.task.id,
      runId: pipelineState.run_id,
      actor: prepared.actor,
      status:
        result === "success" ? "succeeded" : result === "rate_limit" ? "rate_limited" : "failed",
      startedAt: executorStartedAt,
      completedAt: new Date().toISOString(),
      exitCode,
      attempts,
      stdout,
      stderr,
      parentValidations,
    });
    executorEvidenceRef = relative(prepared.worktree.path, recorded.evidencePath)
      .split(sep)
      .join("/");
    executorEvidencePath = recorded.evidencePath;
    executorEvidence = recorded.evidence;
    const executorCompletedAt = new Date().toISOString();
    pipelineState = updatePipelineStage(
      pipelineState,
      "executor",
      {
        status:
          result === "success" ? "succeeded" : result === "rate_limit" ? "rate_limited" : "failed",
        attempts: pipelineState.stages.executor.attempts + attempts,
        completed_at: executorCompletedAt,
        artifact_ref: executorEvidenceRef,
      },
      executorCompletedAt,
    );
    writePipelineState(pipelineStatePath, pipelineState);
    process.stdout.write(`  Executor evidence: ${executorEvidenceRef}\n`);
  }

  if (prepared.pipelineRunId && result === "success") {
    pipelineFailureStage = "reporter";
    if (
      !executorEvidence ||
      !worktreeResultPath ||
      !prepared.reporterCandidates?.length ||
      !pipelineState ||
      !pipelineStatePath
    ) {
      result = "failure";
      pipelineBlockReason = "reporter stage could not start because its managed inputs are missing";
      stderr = pipelineBlockReason;
    } else {
      const reporterStartedAt = new Date().toISOString();
      pipelineState = updatePipelineStage(
        pipelineState,
        "reporter",
        {
          status: "running",
          actor: prepared.reporterCandidates[0].actor ?? null,
          started_at: reporterStartedAt,
          completed_at: null,
        },
        reporterStartedAt,
      );
      writePipelineState(pipelineStatePath, pipelineState);
      process.stdout.write(`  Running reporter: ${prepared.reporterCandidates[0].command}\n`);
      const reporter = await runReporterWithFormatRetry({
        plan: prepared.plan,
        evidence: executorEvidence,
        mode: prepared.task.mode ?? "edit",
        invoke: async (reporterPrompt) => {
          const outcome = await runWithRetry(
            prepared.reporterCandidates ?? [],
            reporterPrompt,
            execDefaults,
            prepared.worktree.path,
            agentEnvironment(repoRoot, prepared.worktree.path, schedulePath, executionPath),
          );
          reporterAttempts += outcome.attempts;
          if (outcome.limit) reporterLimit = outcome.limit;
          return { result: outcome.result, stdout: outcome.stdout, stderr: outcome.stderr };
        },
      });
      if (reporter.result === "success") {
        try {
          await renderReporterResult(worktreeResultPath, reporter.output);
          const parentValidationFailure = failedParentValidationReason(
            executorEvidence.validations,
          );
          result =
            reporter.output.outcome === "complete" && !parentValidationFailure
              ? "success"
              : "failure";
          if (reporter.output.outcome === "blocked") {
            pipelineBlockReason = reporter.output.block_reason;
            stderr = reporter.output.block_reason;
          } else if (parentValidationFailure) {
            pipelineBlockReason = parentValidationFailure;
            stderr = parentValidationFailure;
          }
          process.stdout.write(
            `  Reporter complete: ${prepared.reporterCandidates[0].actor ?? "reporter"} (format attempts: ${reporter.formatAttempts})\n`,
          );
          if (result === "success") {
            const reporterCompletedAt = new Date().toISOString();
            pipelineState = updatePipelineStage(
              pipelineState,
              "reporter",
              {
                status: "succeeded",
                attempts: pipelineState.stages.reporter.attempts + reporterAttempts,
                completed_at: reporterCompletedAt,
                artifact_ref: relative(prepared.worktree.path, worktreeResultPath)
                  .split(sep)
                  .join("/"),
              },
              reporterCompletedAt,
            );
            writePipelineState(pipelineStatePath, pipelineState);
          }
        } catch (error) {
          result = "failure";
          pipelineBlockReason =
            error instanceof Error
              ? `reporter result rendering failed: ${error.message}`
              : String(error);
          stderr = pipelineBlockReason;
        }
      } else {
        result = reporter.result;
        pipelineBlockReason = reporter.reason;
        stderr = reporter.reason;
        if (executorEvidencePath) {
          executorEvidence = recordReporterFailureOutput({
            worktreePath: prepared.worktree.path,
            evidencePath: executorEvidencePath,
            evidence: executorEvidence,
            invocationOutputs: reporter.invocationOutputs,
          });
        }
      }
      if (result !== "success") {
        const reporterCompletedAt = new Date().toISOString();
        pipelineState = updatePipelineStage(
          pipelineState,
          "reporter",
          {
            status: result === "rate_limit" ? "rate_limited" : "failed",
            attempts: pipelineState.stages.reporter.attempts + reporterAttempts,
            completed_at: reporterCompletedAt,
            artifact_ref:
              reporter.result === "success"
                ? relative(prepared.worktree.path, worktreeResultPath).split(sep).join("/")
                : pipelineState.stages.reporter.artifact_ref,
          },
          reporterCompletedAt,
        );
        writePipelineState(pipelineStatePath, pipelineState);
      }
    }
  }

  const finalize = async (): Promise<RunResult> => {
    const completedAt = new Date().toISOString();
    const context = {
      repoRoot,
      schedulePath,
      executionPath,
      ...(catalogPath ? { catalogPath } : {}),
    };
    const downgraded = downgradeUnfilledResult(
      result,
      worktreeResultPath,
      prepared.task.mode ?? "edit",
      attemptResultScaffold,
      prepared.resultScaffold,
    );
    const effectiveResult: RunResult = downgraded.result;
    const unfilledBlock = downgraded.unfilledBlock;

    if (effectiveResult === "success") {
      // Validate the same state/actor constraints as `exec complete` before touching Git. In
      // particular, resume --by may run a different agent from the one that owns the claim; if we
      // merged first, the subsequent complete command would reject that actor and leave schedule
      // state at doing even though the deliverables had already landed and the worktree was gone.
      const completionPreflight = readCompletionPreflight(
        schedulePath,
        prepared.task.id,
        prepared.actor,
      );
      if (!completionPreflight.ok) {
        const reason = `completion preflight failed: ${completionPreflight.reason ?? "unknown reason"}`;
        process.stderr.write(`${reason}\n`);
        process.stdout.write(
          `  Blocked before integration: ${prepared.task.id} (worktree kept: ${prepared.worktree.path})\n`,
        );
        return "failure";
      }

      // Record completion in the worktree result, then commit (result + deliverables) onto the
      // exec branch and merge it into the current root branch so the changes are integrated.
      // Integration guards (e.g. human-only "ready" promotion) can reject the commit; treat such
      // a rejection as a block so the agent's run does not silently land or crash the loop.
      if (worktreeResultPath) await updateResultStatus(worktreeResultPath, "complete", completedAt);
      try {
        commitWorktreeChanges({ context, worktree: prepared.worktree, taskId: prepared.task.id });
        mergeWorktreeIntoCurrent({
          context,
          worktree: prepared.worktree,
          taskId: prepared.task.id,
        });
      } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        if (worktreeResultPath)
          await updateResultStatus(worktreeResultPath, "blocked", completedAt, reason);
        spawnBlock(projectId, prepared.task.id, prepared.actor, reason);
        process.stderr.write(`${reason}\n`);
        process.stdout.write(
          `  Blocked: ${prepared.task.id} (worktree kept: ${prepared.worktree.path})\n`,
        );
        return "failure";
      }
      removeWorktree({
        context,
        worktree: prepared.worktree,
        taskId: prepared.task.id,
        deleteBranch: true,
      });
      spawnComplete(projectId, prepared.task.id, prepared.actor);
      process.stdout.write(`  Done: ${prepared.task.id}\n`);
    } else if (effectiveResult === "rate_limit") {
      // Keep the worktree for the due-time resume path; do not merge partial changes.
      const activeLimit = pipelineFailureStage === "reporter" ? reporterLimit : limit;
      const activeAttempts = pipelineFailureStage === "reporter" ? reporterAttempts : attempts;
      const totalAttempts = (prepared.priorLimitAttempts ?? 0) + activeAttempts;
      const reason = activeLimit
        ? `${activeLimit.kind} reached${activeLimit.resume_at ? `; resume_at=${activeLimit.resume_at}` : ""}`
        : (pipelineBlockReason ?? "rate limit reached");
      if (worktreeResultPath)
        await updateResultStatus(worktreeResultPath, "blocked", completedAt, reason);
      spawnBlock(
        projectId,
        prepared.task.id,
        prepared.actor,
        reason,
        activeLimit
          ? limitEventMeta(activeLimit, {
              attempts: totalAttempts,
              worktree: prepared.worktree.path,
              ...(prepared.pipelineRunId
                ? pipelineRecoveryMeta({
                    stage: pipelineFailureStage,
                    evidenceRef: executorEvidenceRef,
                    stateRef: pipelineStateRef,
                    runId: pipelineState?.run_id ?? prepared.pipelineRunId,
                  })
                : {}),
            })
          : {
              limit_deferred: "false",
              ...(prepared.pipelineRunId
                ? pipelineRecoveryMeta({
                    stage: pipelineFailureStage,
                    evidenceRef: executorEvidenceRef,
                    stateRef: pipelineStateRef,
                    runId: pipelineState?.run_id ?? prepared.pipelineRunId,
                  })
                : {}),
            },
      );
      process.stdout.write(
        activeLimit?.auto_resume
          ? `  Deferred: ${prepared.task.id} until ${activeLimit.resume_at} (worktree kept: ${prepared.worktree.path})\n`
          : `  Rate limited: ${prepared.task.id}; automatic resume unavailable (worktree kept: ${prepared.worktree.path})\n`,
      );
    } else {
      const blockReason = unfilledBlock
        ? "agent exited 0 but result is incomplete or its frontmatter differs from the scaffold (treated as blocked)"
        : (pipelineBlockReason ?? extractBlockReason(stderr));
      if (worktreeResultPath)
        await updateResultStatus(worktreeResultPath, "blocked", completedAt, blockReason);
      spawnBlock(projectId, prepared.task.id, prepared.actor, blockReason, {
        limit_deferred: "false",
        ...(prepared.pipelineRunId
          ? pipelineRecoveryMeta({
              stage: pipelineFailureStage,
              evidenceRef: executorEvidenceRef,
              stateRef: pipelineStateRef,
              runId: pipelineState?.run_id ?? prepared.pipelineRunId,
            })
          : {}),
      });
      process.stdout.write(
        `  ${unfilledBlock ? "Blocked (result incomplete or frontmatter changed)" : "Failed"}: ${prepared.task.id} (worktree kept: ${prepared.worktree.path})\n`,
      );
    }

    return effectiveResult;
  };

  return lifecycleLock ? lifecycleLock.runExclusive(finalize) : finalize();
}

type PreparedTaskOutcome = {
  prepared: PreparedTask;
  result: RunResult;
};

async function runPreparedTaskSafely(
  prepared: PreparedTask,
  projectId: string | undefined,
  repoRoot: string,
  schedulePath: string,
  executionPath: string,
  catalogPath: string | undefined,
  execDefaults: ExecDefaultsConfig,
  dryRun: boolean,
  lifecycleLock?: AsyncLock,
): Promise<PreparedTaskOutcome> {
  try {
    const result = await runPreparedTask(
      prepared,
      projectId,
      repoRoot,
      schedulePath,
      executionPath,
      catalogPath,
      execDefaults,
      dryRun,
      lifecycleLock,
    );
    return { prepared, result };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`[run] error: ${prepared.worktree.name}: ${message}\n`);
    const block = async (): Promise<void> => {
      if (!dryRun) {
        const completedAt = new Date().toISOString();
        if (prepared.resultPath)
          await updateResultStatus(prepared.resultPath, "blocked", completedAt);
        spawnBlock(projectId, prepared.task.id, prepared.actor, `runner error: ${message}`);
      }
    };
    if (lifecycleLock) await lifecycleLock.runExclusive(block);
    else await block();
    return { prepared, result: "failure" };
  }
}

function spawnSelf(args: string[]): boolean {
  const [exe, fullArgs] = selfRunArgs(args);
  const result = spawnSync(exe, fullArgs, { stdio: "inherit", cwd: specdojoRootDir() });
  return result.status === 0;
}

function spawnValidate(projectId: string | undefined): boolean {
  const args = ["exec", "validate"];
  if (projectId) args.push("--project", projectId);
  return spawnSelf(args);
}

function spawnRefresh(projectId: string | undefined): boolean {
  const refreshArgs = ["exec", "refresh"];
  if (projectId) refreshArgs.push("--project", projectId);
  return spawnSelf(refreshArgs);
}

function spawnScheduleBuild(projectId: string | undefined, track: string): boolean {
  const args = ["schedule", "build", "--track", track, "--force"];
  if (projectId) args.push("--project", projectId);
  return spawnSelf(args);
}

// doc-index is project-independent (it scans the whole docs/ tree), so no --project is passed.
// Rebuilding it before Ready selection lets tasks resolve wikilinks/IDs to deliverables that a
// prior round or a prior cycle step just created (see scheduleAvailable and runCycleMode).
function spawnIndexBuild(): boolean {
  return spawnSelf(["index", "build"]);
}

function spawnClaim(projectId: string | undefined, taskId: string, by: string): boolean {
  const args = [
    "exec",
    "claim",
    "--task",
    taskId,
    "--by",
    by,
    "--msg",
    "auto-run",
    "--allow-multiple-doing",
  ];
  if (projectId) args.push("--project", projectId);
  return spawnSelf(args);
}

function spawnComplete(projectId: string | undefined, taskId: string, by: string): void {
  const args = ["exec", "complete", "--task", taskId, "--by", by, "--msg", "auto-complete"];
  if (projectId) args.push("--project", projectId);
  spawnSelf(args);
}

// Release a just-made claim (doing → todo) when setup fails after the claim, so the task is not
// stranded in "doing" with no worktree. Uses the claiming actor, so no cross-actor override needed.
function spawnRelease(
  projectId: string | undefined,
  taskId: string,
  by: string,
  reason: string,
): void {
  const args = [
    "exec",
    "release",
    "--task",
    taskId,
    "--by",
    by,
    "--msg",
    reason,
    "--allow-multiple-doing",
  ];
  if (projectId) args.push("--project", projectId);
  spawnSelf(args);
}

// block 上限。block イベントログを読みやすく保つため、stderr から取り出した理由を切り詰める。
const MAX_BLOCK_REASON_LENGTH = 500;

// agent の stderr から block イベント用の簡潔な理由を取り出す。テンプレートは異常終了時に
// `blocked: <reason>; need=...; ref=...`（review は `review-blocked: ...`）を出力させるため、
// その行を優先する。無ければ最後の非空行、それも無ければ汎用メッセージにフォールバックする。
export function extractBlockReason(stderr: string): string {
  const fallback = "agent exited with non-zero code";
  const lines = stderr
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const tagged = lines.find((line) => /^(blocked|review-blocked):/i.test(line));
  const reason = tagged ?? lines.at(-1);
  if (!reason) return fallback;
  const trimmed =
    reason.length > MAX_BLOCK_REASON_LENGTH
      ? `${reason.slice(0, MAX_BLOCK_REASON_LENGTH)}…`
      : reason;
  return `${fallback}: ${trimmed}`;
}

export function pipelineRecoveryMeta(input: {
  stage: AgentStageRole;
  evidenceRef?: string;
  stateRef?: string;
  runId?: string;
}): Record<string, string> {
  return {
    pipeline_stage: input.stage,
    ...(input.evidenceRef ? { evidence_ref: input.evidenceRef } : {}),
    ...(input.stateRef ? { pipeline_state_ref: input.stateRef } : {}),
    ...(input.runId ? { pipeline_run_id: input.runId } : {}),
  };
}

function spawnBlock(
  projectId: string | undefined,
  taskId: string,
  by: string,
  reason: string,
  meta: Record<string, string> = { limit_deferred: "false" },
): void {
  const args = ["exec", "block", "--task", taskId, "--by", by, "--msg", reason];
  for (const [key, value] of Object.entries(meta)) args.push("--meta", `${key}=${value}`);
  if (projectId) args.push("--project", projectId);
  spawnSelf(args);
}

async function runBatchMode(opts: RunOpts): Promise<void> {
  const resolvedPaths = resolveProjectPaths({ project: opts.project });
  activateResolvedProjectPaths(resolvedPaths);
  const { schedulePath, executionPath, catalogPath, rolesPath, viewpointsPath, projectContext } =
    resolvedPaths;
  // Use the resolved project id (which honors current_project / SPECDOJO_PROJECT), not the raw
  // --project flag. This keeps worktree branches project-qualified even when --project is omitted.
  const projectId = resolvedPaths.projectId ?? opts.project;
  const planGenPaths: PlanGenPaths = { catalogPath, rolesPath, viewpointsPath, projectContext };
  const repoRoot = specdojoRootDir();
  const worktreeBase = resolveWorktreeBase(
    repoRoot,
    opts.worktreeBase,
    configuredWorktreeBase(schedulePath),
  );
  const parallel = parseParallel(opts.parallel);

  const execDefaults = loadExecDefaultsConfig(
    resolveExecDefaultsPath(opts, schedulePath),
    executionPath,
  );
  const roster = loadRosterForExecutionPath(executionPath);
  const { localIdToPhaseSets, phaseSetSuffixToId } = buildTaskPhaseMap(schedulePath);

  const readyJsonPath = join(executionPath, "generated", "ready.json");
  const loop = !!opts.loop;
  const maxRounds = opts.maxRounds ? Math.max(1, parseInt(opts.maxRounds, 10) || 1) : null;
  const dryRun = !!opts.dryRun;
  const strategy = opts.strategy ?? "critical-first";

  const prepareReadyTasks = async (
    capacity: ReturnType<typeof createProviderCapacityTracker>,
    limit: number,
  ): Promise<{ preparedTasks: PreparedTask[]; readyCount: number }> => {
    if (!existsSync(readyJsonPath)) {
      process.stdout.write(`ready.json not found: ${readyJsonPath}\nRun: specdojo exec refresh\n`);
      process.exitCode = 1;
      return { preparedTasks: [], readyCount: 0 };
    }

    const readySnapshot = readReadySnapshot(readyJsonPath);
    const orderedIds: string[] =
      strategy === "fifo"
        ? readySnapshot.strategies.fifo.ordered_task_ids
        : readySnapshot.strategies["critical-first"].ordered_task_ids;

    if (orderedIds.length === 0) return { preparedTasks: [], readyCount: 0 };

    const taskMap = new Map(readySnapshot.tasks.map((t) => [t.id, t]));
    const preparedTasks: PreparedTask[] = [];

    for (const taskId of orderedIds) {
      if (preparedTasks.length >= limit) break;
      const task = taskMap.get(taskId);
      if (!task) continue;

      try {
        const prepared = await prepareSingleTask(
          task,
          projectId,
          repoRoot,
          schedulePath,
          executionPath,
          roster,
          localIdToPhaseSets,
          phaseSetSuffixToId,
          opts.by,
          { edit: opts.editBy, review: opts.reviewBy },
          { executor: opts.executorBy, reporter: opts.reporterBy },
          opts.by,
          dryRun,
          false,
          worktreeBase,
          planGenPaths,
          execDefaults,
          capacity.hasCapacity,
        );
        // "deferred": every candidate provider is at its cap; try it again after a slot frees.
        if (prepared === "deferred") continue;
        if (typeof prepared !== "string") {
          preparedTasks.push(prepared);
          capacity.reserve(prepared.agentCandidates[0]?.provider);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        process.stderr.write(`[run] setup error for ${task.id}: ${message}\n`);
      }
    }

    return { preparedTasks, readyCount: orderedIds.length };
  };

  if (!loop || dryRun) {
    const capacity = createProviderCapacityTracker(execDefaults);
    const { preparedTasks, readyCount } = await prepareReadyTasks(capacity, parallel);

    if (preparedTasks.length === 0) {
      process.stdout.write(
        readyCount === 0 ? "[run] no ready tasks — exit\n" : "[run] no executable tasks — exit\n",
      );
      if (readyCount > 0 || process.exitCode) process.exitCode = 1;
      return;
    }

    const outcomes = await Promise.all(
      preparedTasks.map((prepared) =>
        runPreparedTaskSafely(
          prepared,
          projectId,
          repoRoot,
          schedulePath,
          executionPath,
          catalogPath,
          execDefaults,
          dryRun,
        ),
      ),
    );
    const results = outcomes.map((outcome) => outcome.result);
    const completed = results.filter((result) => result === "success").length;
    process.stdout.write(`[run] all ${completed} instance(s) completed\n`);

    if (results.some((result) => result === "failure")) process.exitCode = 1;

    return;
  }

  const lifecycleLock = new SerialAsyncLock();
  const capacity = createProviderCapacityTracker(execDefaults);
  let schedulingPass = 0;
  let stopNewTasks = false;
  let lastReadyCount = 0;

  const scheduleAvailable = async (openSlots: number): Promise<PreparedTask[]> => {
    if (stopNewTasks || openSlots <= 0) return [];
    if (maxRounds !== null && schedulingPass >= maxRounds) {
      process.stdout.write(`[run] reached max-rounds ${maxRounds} — drain running tasks\n`);
      stopNewTasks = true;
      return [];
    }

    schedulingPass++;
    const roundSuffix = ` (round ${schedulingPass}${maxRounds !== null ? `/${maxRounds}` : "/-"})`;
    if (schedulingPass > 1) {
      // Rebuild doc-index before refresh so deliverables created by the previous round (e.g. a
      // newly authored document referenced by wikilink) are resolvable when this round's tasks
      // are prepared, instead of only becoming resolvable on a later, out-of-band index build.
      process.stdout.write(`[run] index build${roundSuffix}...\n`);
      if (!spawnIndexBuild()) {
        process.stdout.write("[run] index build failed — drain running tasks\n");
        process.exitCode = 1;
        stopNewTasks = true;
        return [];
      }
      // Only exec cycle opts into schedule regeneration. A strategy task completed by the prior
      // auto round can therefore expose the next track in this same cycle, while standalone
      // `exec run --auto --loop` keeps its existing refresh-only behavior.
      if (opts.cycleRebuildStaleTracks) {
        const rebuild = await rebuildStaleGeneratedTracksForCycle(schedulePath, projectId, false);
        if (rebuild.status === "failure") {
          process.exitCode = 1;
          stopNewTasks = true;
          return [];
        }
      }
      process.stdout.write(`[run] exec refresh${roundSuffix}...\n`);
      if (!spawnRefresh(projectId)) {
        process.stdout.write("[run] exec refresh failed — drain running tasks\n");
        process.exitCode = 1;
        stopNewTasks = true;
        return [];
      }
    }

    const { preparedTasks, readyCount } = await prepareReadyTasks(capacity, openSlots);
    lastReadyCount = readyCount;
    return preparedTasks;
  };

  const poolResult = await runCompletionDrivenWorkerPool<PreparedTask, PreparedTaskOutcome>({
    maxParallel: parallel,
    fillSlots: (openSlots) => lifecycleLock.runExclusive(() => scheduleAvailable(openSlots)),
    runItem: (prepared) =>
      runPreparedTaskSafely(
        prepared,
        projectId,
        repoRoot,
        schedulePath,
        executionPath,
        catalogPath,
        execDefaults,
        dryRun,
        lifecycleLock,
      ),
    onSettled: (prepared, outcome) => {
      capacity.release(prepared.agentCandidates[0]?.provider);

      if (outcome.result === "failure") process.exitCode = 1;

      const critical = (prepared.task.cpm?.slack ?? 1) === 0;
      if (critical && outcome.result === "failure") {
        process.stdout.write(`[run] stopping: failure on critical task.\n`);
        process.exitCode = 1;
        stopNewTasks = true;
        return { stop: true };
      }
    },
  });

  if (poolResult.launched === 0) {
    process.stdout.write(
      lastReadyCount > 0 ? "[run] no executable tasks — exit\n" : "[run] no ready tasks — exit\n",
    );
    if (lastReadyCount > 0 || process.exitCode) process.exitCode = 1;
    return;
  }

  process.stdout.write(
    `[run] all ${poolResult.completed} of ${poolResult.launched} launched instance(s) completed\n`,
  );
}

// For a task already in "doing" state, resume with the actor who claimed it so a re-run does not
// reselect a different agent. The actor is a roster nickname and its command is resolved later.
// `resumed` is true only when the claiming actor was adopted, which callers use to skip a claim.
export function resolveClaimingActor(
  taskState: CurrentState | undefined,
  byOverride: string | undefined,
): { actor: string | undefined; resumed: boolean } {
  if (byOverride) return { actor: byOverride, resumed: false };
  if (taskState?.state !== "doing" || !taskState.last_by) {
    return { actor: undefined, resumed: false };
  }
  const actor = taskState.last_by;
  process.stdout.write(`  Resuming with claiming actor: ${actor}\n`);
  return { actor, resumed: true };
}

async function runManualMode(opts: RunOpts): Promise<void> {
  const taskId = opts.task as string;
  const resolvedPaths = resolveProjectPaths({ project: opts.project });
  activateResolvedProjectPaths(resolvedPaths);
  const { schedulePath, executionPath, catalogPath, rolesPath, viewpointsPath, projectContext } =
    resolvedPaths;
  // Use the resolved project id (which honors current_project / SPECDOJO_PROJECT), not the raw
  // --project flag. This keeps worktree branches project-qualified even when --project is omitted.
  const projectId = resolvedPaths.projectId ?? opts.project;
  const planGenPaths: PlanGenPaths = { catalogPath, rolesPath, viewpointsPath, projectContext };
  const repoRoot = specdojoRootDir();
  const worktreeBase = resolveWorktreeBase(
    repoRoot,
    opts.worktreeBase,
    configuredWorktreeBase(schedulePath),
  );

  const execDefaults = loadExecDefaultsConfig(
    resolveExecDefaultsPath(opts, schedulePath),
    executionPath,
  );
  const roster = loadRosterForExecutionPath(executionPath);
  const { localIdToPhaseSets, phaseSetSuffixToId } = buildTaskPhaseMap(schedulePath);
  const phaseModeIndex = buildPhaseModeIndex(schedulePath);

  const readyJsonPath = join(executionPath, "generated", "ready.json");
  let task: ReadyTaskView = { id: taskId, schedule_file: "", fifo_rank: 0, critical_first_rank: 0 };
  if (existsSync(readyJsonPath)) {
    const snap = readReadySnapshot(readyJsonPath);
    const found = snap.tasks.find((t) => t.id === taskId);
    if (found) task = found;
  }
  // If task not in ready.json (e.g. already "doing"), derive local_id from task id pattern.
  if (!task.local_id) {
    const parts = taskId.split("-");
    const localId = extractLocalId(taskId);
    if (localId && parts[0] === "T" && parts[1]) {
      const track = parts[1];
      task = {
        ...task,
        local_id: localId,
        phase_suffix: extractPhaseSuffix(taskId),
        schedule_file: `sch-track-${track.toLowerCase()}.yaml`,
      };
    }
  }
  if (task.local_id) {
    task = {
      ...task,
      mode:
        task.mode ??
        resolveTaskMode(task.local_id, task.id, phaseModeIndex, task.phase_suffix, task.phase_set),
      execution:
        task.execution ??
        resolveTaskExecution(
          task.local_id,
          task.id,
          phaseModeIndex,
          task.phase_suffix,
          task.phase_set,
        ),
      approach:
        task.approach ??
        resolveApproach(task.local_id, task.id, phaseModeIndex, task.phase_suffix, task.phase_set),
    };
    if (!task.capabilities) {
      const capabilities = resolveTaskCapabilities(
        task.local_id,
        task.id,
        phaseModeIndex,
        task.phase_suffix,
        task.phase_set,
      );
      if (capabilities.length > 0) task.capabilities = capabilities;
    }
    task.proficiency =
      task.proficiency ??
      resolveTaskProficiency(
        task.local_id,
        task.id,
        phaseModeIndex,
        task.phase_suffix,
        task.phase_set,
      );
  }

  // If the task is already in "doing" state and --by is not specified,
  // use the actor who claimed it and their command to avoid re-selecting a different agent.
  // Read from events directly (not state.json cache) to reflect recent scheduler claims.
  let actorOverride = opts.by;
  let alreadyClaimed = false;
  if (!actorOverride) {
    try {
      const sch = buildScheduleIndex(schedulePath);
      const evts = readAllEventFiles(schedulePath);
      const initTasks = buildInitialStateFromStrategy(schedulePath, sch);
      const snap = foldEventsToState(evts, sch, schedulePath, initTasks);
      const resolved = resolveClaimingActor(snap.tasks?.[taskId], undefined);
      actorOverride = resolved.actor;
      alreadyClaimed = resolved.resumed;
    } catch {
      // ignore errors reading state; fall through to normal agent selection
    }
  }

  const prepared = await prepareSingleTask(
    task,
    projectId,
    repoRoot,
    schedulePath,
    executionPath,
    roster,
    localIdToPhaseSets,
    phaseSetSuffixToId,
    actorOverride,
    { edit: opts.editBy, review: opts.reviewBy },
    { executor: opts.executorBy, reporter: opts.reporterBy },
    actorOverride,
    !!opts.dryRun,
    alreadyClaimed,
    worktreeBase,
    planGenPaths,
    execDefaults,
  );

  if (typeof prepared === "string") {
    if (prepared === "failure") process.exitCode = 1;
    return;
  }

  const result = await runPreparedTask(
    prepared,
    projectId,
    repoRoot,
    schedulePath,
    executionPath,
    catalogPath,
    execDefaults,
    !!opts.dryRun,
  );
  if (result === "failure") process.exitCode = 1;
}

// Resolve the agent command and the actor for an in-place run, ignoring task state. Unlike the
// worktree flow, this never requires the task to be claimable. The actor is derived the same way
// as the worktree path (`prepareTask`): explicit --by wins, otherwise the resolved member's
// nickname. This lets --track-state record events without forcing --by.
export function resolveInPlaceCommand(
  task: ReadyTaskView | null,
  roster: MemberRoster | null,
  opts: RunOpts,
  execDefaults: ExecDefaultsConfig = {},
): { command: string; actor: string; provider?: AgentProvider } {
  if (!task?.agent_pipeline && (opts.executorBy || opts.reporterBy)) {
    throw new Error("--executor-by / --reporter-by require an agent_pipeline task.");
  }
  const by = (task?.agent_pipeline ? (opts.executorBy ?? opts.by) : opts.by)?.trim();
  if (by) {
    const member = roster?.members.find((m) => m.nickname === by && m.type === "agent");
    if (task?.agent_pipeline && member?.stage_role !== "executor") {
      throw new Error(`Agent must have stage_role: executor for this pipeline stage: ${by}`);
    }
    const command = member ? resolveMemberCommand(execDefaults, member) : undefined;
    if (!command) throw new Error(`Agent command not found for actor: ${by}`);
    return {
      command,
      actor: by,
      ...(member?.provider ? { provider: member.provider } : {}),
    };
  }

  if (task && (task.execution ?? "agent") === "human") {
    throw new Error(`Task requires human execution. Use --by <nickname> to override: ${task.id}`);
  }

  const candidates = selectCandidates(
    (task && executorRequirements(task)) ?? {
      capabilities: task?.capabilities ?? [],
      proficiency: task?.proficiency,
    },
    roster,
    task?.mode ?? "edit",
    undefined,
    execDefaults,
  );
  const candidate = candidates[0];
  const command = candidate ? resolveMemberCommand(execDefaults, candidate) : undefined;
  if (!candidate || !command) throw new Error("No agent found. Specify --by <nickname>.");
  return {
    command,
    actor: candidate.nickname,
    ...(candidate.provider ? { provider: candidate.provider } : {}),
  };
}

async function spawnAgentInPlace(
  command: string,
  prompt: string,
  cwd: string,
  schedulePath: string,
  executionPath: string,
): Promise<number> {
  const protectedConfigBefore = captureAgentProtectedConfigSnapshot(cwd);
  const child = spawn(command, {
    cwd,
    env: {
      ...process.env,
      SPECDOJO_SCHEDULE_PATH: schedulePath,
      SPECDOJO_EXECUTION_PATH: executionPath,
    },
    shell: true,
    stdio: ["pipe", "inherit", "inherit"],
  });
  // executeAgent と同じ理由で、stdin を読まないコマンドの EPIPE は無視する。
  child.stdin.on("error", () => undefined);
  child.stdin.end(prompt);
  const exitCode = await new Promise<number>((resolveExit) => {
    child.once("error", () => resolveExit(1));
    child.once("close", (code) => resolveExit(code ?? 1));
  });
  const protectedConfigChanges = changedAgentProtectedConfigPaths(cwd, protectedConfigBefore);
  if (protectedConfigChanges.length > 0) {
    process.stderr.write(`blocked: ${agentProtectedConfigViolation(protectedConfigChanges)}\n`);
    return 1;
  }
  return exitCode;
}

// Default run path: generate the plan on demand and run the agent in the current
// repository. No worktree, and no claim/complete events unless --track-state.
async function runInPlaceMode(opts: RunOpts): Promise<void> {
  const resolvedPaths = resolveProjectPaths({ project: opts.project });
  activateResolvedProjectPaths(resolvedPaths);
  const { schedulePath, executionPath, catalogPath, rolesPath, viewpointsPath, projectContext } =
    resolvedPaths;
  const repoRoot = specdojoRootDir();
  const projectId = resolvedPaths.projectId ?? opts.project ?? process.env.SPECDOJO_PROJECT ?? "";
  const roster = loadRosterForExecutionPath(executionPath);
  const execDefaults = loadExecDefaultsConfig(
    resolveExecDefaultsPath(opts, schedulePath),
    executionPath,
  );

  // --track-state controls whether this run records claim/complete events; it no longer affects
  // file naming. Task-identity runs (--task) always use the fixed `<task-id>` stem (shared with
  // claim / run --track-state), so an in-place result can be adopted by claim/complete without
  // renaming; re-runs overwrite the same plan/result and git history is the audit trail. Only
  // --deliverable / ad-hoc runs (no task identity) use a unique stem to avoid id collisions.
  const trackState = !!opts.trackState;

  const plansDir = join(executionPath, "exec", "plans");
  let planPath: string;
  let slug: string | undefined;
  // Shared plan/result stem. For --task it is the fixed task id; for bring-your-own --plan it is
  // recovered from the plan filename so re-running the same plan overwrites the tied result; for
  // --deliverable it is unique per run (`<slug>-<UTC>-<rand>`).
  let stem: string | undefined;
  let task: ReadyTaskView | null = null;
  // null target = bring-your-own --plan (not generated, not archived).
  let target: ReturnType<typeof resolveDeliverableTarget> | null = null;

  let planProjectId = "";
  // bring-your-own --plan の frontmatter から復元した targets。scaffold 時に catalog 再解決より優先する。
  let planTargets: string[] | undefined;
  if (opts.plan) {
    planPath = resolve(opts.plan);
    if (!existsSync(planPath)) throw new Error(`Plan not found: ${planPath}`);
    stem = stemFromPlanPath(planPath);
    // Recover task identity from the plan frontmatter so the result is scaffolded
    // with complete frontmatter (id/mode/plan_ref/started_at), matching the --task
    // path. Ad-hoc plans without a task_id keep the previous no-scaffold behavior.
    const identity = parsePlanTaskIdentity(readFileSync(planPath, "utf8"));
    if (identity) {
      slug = identity.taskId;
      planProjectId = identity.projectId;
      planTargets = identity.targets;
      task = {
        id: identity.taskId,
        // Derive the catalog local_id so a review result can resolve done_criteria. A scheduled
        // task id (T-<track>-<local_id>-NNN) yields the local_id; a deliverable plan's task_id is
        // already the local_id (slug).
        local_id: extractLocalId(identity.taskId) ?? identity.taskId,
        mode: identity.mode,
        approach: identity.approach,
        schedule_file: "",
        fifo_rank: 0,
        critical_first_rank: 0,
      };
    }
  } else if (opts.task) {
    const taskId = opts.task.trim();
    task = buildTaskView(schedulePath, executionPath, taskId);
    slug = taskId;
    stem = taskId;
    planPath = join(plansDir, `${stem}-plan.md`);
  } else {
    target = resolveDeliverableTarget(catalogPath ?? "", (opts.deliverable as string).trim());
    slug = target.slug;
    stem = buildInPlaceStem(slug);
    planPath = join(plansDir, `${stem}-plan.md`);
    task = {
      id: slug,
      local_id: target.localId,
      mode: "edit",
      schedule_file: "",
      fifo_rank: 0,
      critical_first_rank: 0,
    };
  }

  const { command, actor, provider } = resolveInPlaceCommand(task, roster, opts, execDefaults);
  const reporterCandidates =
    task?.agent_pipeline && task
      ? resolveReporterAgentCandidates(task, roster, execDefaults, undefined, opts.reporterBy)
      : undefined;
  if (task?.agent_pipeline && !reporterCandidates?.length) {
    throw new Error("No agent found for reporter pipeline stage.");
  }
  const label = slug ?? planPath;

  if (opts.dryRun) {
    process.stdout.write(`[dry-run] target: ${label} (state ignored)\n`);
    process.stdout.write(`[dry-run] command: ${command}\n`);
    if (reporterCandidates?.[0]) {
      process.stdout.write(`[dry-run] reporter command: ${reporterCandidates[0].command}\n`);
    }
    process.stdout.write(`[dry-run] cwd: ${repoRoot}\n`);
    process.stdout.write(`[dry-run] plan: ${planPath}\n`);
    return;
  }

  // Generate the plan on demand (skip for bring-your-own --plan).
  const generatedPlan = !opts.plan;
  if (opts.task && task) {
    await generateSinglePlan({
      executionPath,
      projectId,
      catalogPath: catalogPath ?? "",
      rolesPath,
      viewpointsPath,
      projectContext,
      task,
      ...(stem ? { stem } : {}),
    });
  } else if (target) {
    await generateDeliverablePlan({
      executionPath,
      projectId,
      catalogPath: catalogPath ?? "",
      rolesPath,
      viewpointsPath,
      projectContext,
      target,
      ...(stem ? { stem } : {}),
    });
  }

  const planPrompt = expandPromptRefs(readFileSync(planPath, "utf8"));
  const prompt = task?.agent_pipeline
    ? buildExecutorPrompt(planPrompt, execDefaults.pipeline?.parent_validations)
    : planPrompt;

  if (trackState) {
    if (!opts.task) throw new Error("--track-state requires --task.");
    if (!spawnClaim(projectId, opts.task.trim(), actor)) {
      throw new Error(
        `Claim failed for ${opts.task.trim()} (omit --track-state to run without state).`,
      );
    }
  }

  // Scaffold the result so the agent fills in a frontmatter-complete file (mirrors on-demand plan
  // generation). Skipped for bring-your-own --plan, where no managed task identity exists.
  // Idempotent: never clobbers an existing result (e.g. one created by claim above).
  let resultPath: string | undefined;
  let resultScaffold: Record<string, unknown> | undefined;
  if (task && slug) {
    const reviewSections =
      (task.mode ?? "edit") === "review"
        ? reviewResultSectionsForDeliverable(catalogPath ?? "", task.local_id)
        : undefined;
    const finalizeSections =
      task.approach === "finalize" || task.approach === "bootstrap-finalize"
        ? finalizeResultSectionsForDeliverable(catalogPath ?? "", task.local_id, task.approach)
        : undefined;
    const targets =
      planTargets ??
      targetDocIdsForScheduledTask(catalogPath ?? "", task, projectId || planProjectId);
    resultPath = (
      await scaffoldResult({
        executionPath,
        taskId: slug,
        mode: task.mode ?? "edit",
        projectId: projectId || planProjectId,
        planRef: `exec/plans/${stem ?? slug}-plan.md`,
        agent: actor,
        startedAt: new Date().toISOString(),
        ...(stem ? { stem } : {}),
        ...(task.approach ? { approach: task.approach } : {}),
        ...(targets ? { targets } : {}),
        ...(reviewSections ? { reviewSections } : {}),
        ...(finalizeSections ? { finalizeSections } : {}),
      })
    ).resultPath;
    resultScaffold = readResultFrontmatterSnapshot(resultPath);
  }

  process.stdout.write(`Running ${label} in place: ${command}\n`);
  let exitCode: number;
  let pipelineBlockReason: string | undefined;
  let pipelineEvidenceRef: string | undefined;
  let pipelineStateRef: string | undefined;
  let pipelineRunId: string | undefined;
  let pipelineFailureStage: AgentStageRole = "executor";
  if (task?.agent_pipeline) {
    const startedAt = new Date().toISOString();
    pipelineRunId = `${new Date().toISOString().replace(/[-:.]/g, "")}-${randomHex(4)}`;
    const stateLocation = pipelineStateLocation({
      repoRoot,
      worktreePath: repoRoot,
      executionPath,
      taskId: task.id,
      runId: pipelineRunId,
    });
    pipelineStateRef = stateLocation.ref;
    let pipelineState = createPipelineState({
      taskId: task.id,
      runId: pipelineRunId,
      updatedAt: startedAt,
      executorActor: actor,
      reporterActor: reporterCandidates?.[0]?.actor,
    });
    pipelineState = updatePipelineStage(
      pipelineState,
      "executor",
      { status: "running", started_at: startedAt },
      startedAt,
    );
    writePipelineState(stateLocation.path, pipelineState);
    const outcome = await runWithRetry(
      [{ command, actor, provider }],
      prompt,
      execDefaults,
      repoRoot,
      {
        ...process.env,
        SPECDOJO_SCHEDULE_PATH: schedulePath,
        SPECDOJO_EXECUTION_PATH: executionPath,
      },
    );
    const parentValidations =
      outcome.result === "success"
        ? await runConfiguredParentValidations(execDefaults, repoRoot)
        : [];
    const recorded = recordExecutorEvidence({
      repoRoot,
      worktreePath: repoRoot,
      executionPath,
      taskId: task.id,
      runId: pipelineRunId,
      actor,
      status:
        outcome.result === "success"
          ? "succeeded"
          : outcome.result === "rate_limit"
            ? "rate_limited"
            : "failed",
      startedAt,
      completedAt: new Date().toISOString(),
      exitCode: outcome.exitCode,
      attempts: outcome.attempts,
      stdout: outcome.stdout,
      stderr: outcome.stderr,
      parentValidations,
    });
    pipelineEvidenceRef = relative(repoRoot, recorded.evidencePath).split(sep).join("/");
    const executorCompletedAt = new Date().toISOString();
    pipelineState = updatePipelineStage(
      pipelineState,
      "executor",
      {
        status:
          outcome.result === "success"
            ? "succeeded"
            : outcome.result === "rate_limit"
              ? "rate_limited"
              : "failed",
        attempts: outcome.attempts,
        completed_at: executorCompletedAt,
        artifact_ref: pipelineEvidenceRef,
      },
      executorCompletedAt,
    );
    writePipelineState(stateLocation.path, pipelineState);
    process.stdout.write(`Executor evidence: ${pipelineEvidenceRef}\n`);
    if (outcome.result === "success") {
      pipelineFailureStage = "reporter";
      const reporterStartedAt = new Date().toISOString();
      pipelineState = updatePipelineStage(
        pipelineState,
        "reporter",
        {
          status: "running",
          actor: reporterCandidates?.[0]?.actor ?? null,
          started_at: reporterStartedAt,
        },
        reporterStartedAt,
      );
      writePipelineState(stateLocation.path, pipelineState);
      let reporterAttempts = 0;
      process.stdout.write(`Running reporter: ${reporterCandidates?.[0]?.command ?? ""}\n`);
      const reporter = await runReporterWithFormatRetry({
        plan: planPrompt,
        evidence: recorded.evidence,
        mode: task.mode ?? "edit",
        invoke: async (reporterPrompt) => {
          const reporterOutcome = await runWithRetry(
            reporterCandidates ?? [],
            reporterPrompt,
            execDefaults,
            repoRoot,
            {
              ...process.env,
              SPECDOJO_SCHEDULE_PATH: schedulePath,
              SPECDOJO_EXECUTION_PATH: executionPath,
            },
          );
          reporterAttempts += reporterOutcome.attempts;
          return {
            result: reporterOutcome.result,
            stdout: reporterOutcome.stdout,
            stderr: reporterOutcome.stderr,
          };
        },
      });
      if (reporter.result === "success" && resultPath) {
        try {
          await renderReporterResult(resultPath, reporter.output);
          const parentValidationFailure = failedParentValidationReason(
            recorded.evidence.validations,
          );
          exitCode = reporter.output.outcome === "complete" && !parentValidationFailure ? 0 : 1;
          pipelineBlockReason =
            reporter.output.outcome === "blocked"
              ? reporter.output.block_reason
              : parentValidationFailure;
          process.stdout.write(
            `Reporter complete: ${reporterCandidates?.[0]?.actor ?? "reporter"} (format attempts: ${reporter.formatAttempts})\n`,
          );
        } catch (error) {
          exitCode = 1;
          pipelineBlockReason =
            error instanceof Error
              ? `reporter result rendering failed: ${error.message}`
              : String(error);
        }
      } else if (reporter.result === "success") {
        exitCode = 1;
        pipelineBlockReason = "reporter result path is unavailable";
      } else {
        exitCode = 1;
        pipelineBlockReason = reporter.reason;
        recordReporterFailureOutput({
          worktreePath: repoRoot,
          evidencePath: recorded.evidencePath,
          evidence: recorded.evidence,
          invocationOutputs: reporter.invocationOutputs,
        });
      }
      const reporterCompletedAt = new Date().toISOString();
      pipelineState = updatePipelineStage(
        pipelineState,
        "reporter",
        {
          status:
            exitCode === 0
              ? "succeeded"
              : reporter.result === "rate_limit"
                ? "rate_limited"
                : "failed",
          attempts: reporterAttempts,
          completed_at: reporterCompletedAt,
          artifact_ref:
            reporter.result === "success" && resultPath
              ? relative(repoRoot, resultPath).split(sep).join("/")
              : null,
        },
        reporterCompletedAt,
      );
      writePipelineState(stateLocation.path, pipelineState);
    } else {
      pipelineBlockReason =
        outcome.result === "rate_limit"
          ? "executor rate limit reached"
          : extractBlockReason(outcome.stderr);
      exitCode = outcome.exitCode && outcome.exitCode !== 0 ? outcome.exitCode : 1;
    }
  } else {
    exitCode = await spawnAgentInPlace(command, prompt, repoRoot, schedulePath, executionPath);
  }

  // Some agents (notably `claude -p`) exit 0 even when they conclude they are blocked: a
  // permission-denied tool call is fed back as a tool error and the model ends its turn
  // normally. The agent's core duty is to fill the result while preserving its scaffold
  // frontmatter, so treat an incomplete or modified result as a block even on exit 0.
  let effectiveExit = exitCode;
  let blockReason: string | undefined = pipelineBlockReason;
  if (
    exitCode === 0 &&
    resultPath &&
    task &&
    isResultUnfilled(resultPath, task.mode ?? "edit", resultScaffold)
  ) {
    effectiveExit = 1;
    blockReason =
      "agent exited 0 but result is incomplete or its frontmatter differs from the scaffold (treated as blocked)";
    process.stdout.write(
      `run blocked: ${label} (result incomplete or frontmatter changed despite exit 0)\n`,
    );
  }

  // In-place runs do not write claim/complete events unless --track-state, but the result file's
  // own status is a file-level field, so reflect the outcome into it regardless.
  if (resultPath) {
    await updateResultStatus(
      resultPath,
      effectiveExit === 0 ? "complete" : "blocked",
      new Date().toISOString(),
      blockReason,
    );
  }

  if (trackState && opts.task) {
    if (effectiveExit === 0) spawnComplete(projectId, opts.task.trim(), actor);
    else
      spawnBlock(
        projectId,
        opts.task.trim(),
        actor,
        blockReason ?? "agent exited with non-zero code",
        {
          limit_deferred: "false",
          ...(pipelineRunId
            ? pipelineRecoveryMeta({
                stage: pipelineFailureStage,
                evidenceRef: pipelineEvidenceRef,
                stateRef: pipelineStateRef,
                runId: pipelineRunId,
              })
            : {}),
        },
      );
  }

  if (effectiveExit !== 0) {
    process.exitCode = effectiveExit;
    process.stdout.write(`run failed: ${label} (exit ${effectiveExit})\n`);
    return;
  }

  if (opts.archiveOnSuccess && generatedPlan && (stem ?? slug)) {
    const archived = archivePlan({ executionPath, slug: stem ?? (slug as string) });
    if (archived.to) process.stdout.write(`Archived plan: ${archived.to}\n`);
  }
  process.stdout.write(`run done: ${label}\n`);
}

async function runJobMode(opts: RunOpts): Promise<void> {
  const resolvedPaths = resolveProjectPaths({ project: opts.project });
  activateResolvedProjectPaths(resolvedPaths);
  const { schedulePath, executionPath } = resolvedPaths;
  const projectId = resolvedPaths.projectId ?? opts.project ?? process.env.SPECDOJO_PROJECT ?? "";
  if (!projectId) throw new Error("--job requires a project id.");

  const trigger =
    opts.jobTrigger === "ci"
      ? "ci"
      : process.env[ROUTINE_EXEC_ENV] === "1" || opts.jobTrigger === "routine"
        ? "routine"
        : "manual";
  const materialized = await materializeJobRun({
    projectId,
    jobId: (opts.job as string).trim(),
    inputs: opts.input,
    scheduledAt: opts.scheduledAt,
    trigger,
    dryRun: !!opts.dryRun,
  });
  const { definition, record, runPath, planPath } = materialized;
  if (materialized.duplicateComplete) {
    process.stdout.write(`Job Run already complete: ${record.run_id} (${record.state})\n`);
    return;
  }

  const task: ReadyTaskView = {
    id: record.run_id,
    local_id: record.task.targets?.[0] ?? record.run_id,
    name: definition.name,
    owner: record.task.owner,
    mode: record.task.mode,
    capabilities: record.task.capabilities,
    proficiency: record.task.proficiency,
    schedule_file: "",
    fifo_rank: 0,
    critical_first_rank: 0,
  };
  const roster = loadRosterForExecutionPath(executionPath);
  const execDefaults = loadExecDefaultsConfig(
    resolveExecDefaultsPath(opts, schedulePath),
    executionPath,
  );
  const { command, actor } = resolveInPlaceCommand(task, roster, opts, execDefaults);

  if (opts.dryRun) {
    process.stdout.write(`[dry-run] job: ${definition.id}\n`);
    process.stdout.write(`[dry-run] run: ${record.run_id}\n`);
    process.stdout.write(`[dry-run] scheduled_at: ${record.scheduled_at}\n`);
    process.stdout.write(`[dry-run] command: ${command}\n`);
    process.stdout.write(`[dry-run] plan: ${planPath}\n`);
    return;
  }

  const { resultPath } = await scaffoldResult({
    executionPath,
    taskId: record.run_id,
    mode: record.task.mode,
    projectId,
    origin: "job",
    jobId: definition.id,
    runId: record.run_id,
    planRef: record.plan_ref,
    agent: actor,
    startedAt: new Date().toISOString(),
    ...(record.task.targets ? { targets: record.task.targets } : {}),
  });
  const resultScaffold = readResultFrontmatterSnapshot(resultPath);
  const prompt = expandPromptRefs(readFileSync(planPath, "utf8"));
  process.stdout.write(`Running Job Run ${record.run_id} in place: ${command}\n`);
  const exitCode = await spawnAgentInPlace(
    command,
    prompt,
    specdojoRootDir(),
    schedulePath,
    executionPath,
  );
  let effectiveExit = exitCode;
  let reason: string | undefined;
  if (exitCode === 0 && isResultUnfilled(resultPath, record.task.mode, resultScaffold)) {
    effectiveExit = 1;
    reason =
      "agent exited 0 but result is incomplete or its frontmatter differs from the scaffold (treated as blocked)";
  }
  const completedAt = new Date().toISOString();
  await updateResultStatus(
    resultPath,
    effectiveExit === 0 ? "complete" : "blocked",
    completedAt,
    reason,
  );
  completeJobRun({
    projectId,
    runPath,
    status: effectiveExit === 0 ? "succeeded" : "failed",
    ...(reason ? { reason } : {}),
  });
  if (effectiveExit === 0) {
    process.stdout.write(`Job Run complete: ${record.run_id}\n`);
  } else {
    process.stdout.write(`Job Run failed: ${record.run_id}\n`);
    process.exitCode = effectiveExit || 1;
  }
}

// 登録項目の owner（Role code または agent nickname）から実行 agent を解決する。
// 優先順位: --by → owner の nickname 一致 → owner の Role code 一致
// （priority 昇順）→ edit-mode の汎用自動選択。owner はロールとして解釈するため、
// human member の nickname と一致しても human へは割り当てず自動選択へフォールバックする。
export function resolveRegisterCommand(
  item: { id: string; owner: string },
  roster: MemberRoster | null,
  opts: Pick<RunOpts, "by">,
  execDefaults: ExecDefaultsConfig = {},
): { command: string; actor: string } {
  const by = opts.by?.trim();
  if (by) {
    const member = roster?.members.find((m) => m.nickname === by && m.type === "agent");
    const command = member ? resolveMemberCommand(execDefaults, member) : undefined;
    if (!command) throw new Error(`Agent command not found for actor: ${by}`);
    return { command, actor: by };
  }

  const owner = item.owner.trim();
  const hasOwner = owner !== "" && owner !== "-" && owner !== "_TODO_";
  if (hasOwner && roster) {
    const nicknameMatch = roster.members.find(
      (m) =>
        m.nickname === owner &&
        m.type === "agent" &&
        hasMemberCommandSource(execDefaults, m) &&
        m.disabled !== true,
    );
    if (nicknameMatch) {
      const command = resolveMemberCommand(execDefaults, nicknameMatch);
      if (command) return { command, actor: nicknameMatch.nickname };
    }
    const roleMatches = roster.members
      .filter(
        (m) =>
          m.type === "agent" &&
          hasMemberCommandSource(execDefaults, m) &&
          m.disabled !== true &&
          (m.mode === undefined || m.mode === "edit") &&
          m.roles.includes(owner),
      )
      .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));
    const roleMatch = roleMatches[0];
    if (roleMatch) {
      const command = resolveMemberCommand(execDefaults, roleMatch);
      if (command) return { command, actor: roleMatch.nickname };
    }
  }

  const candidates = selectCandidates(
    { capabilities: [] },
    roster,
    "edit",
    undefined,
    execDefaults,
  );
  const candidate = candidates[0];
  const command = candidate ? resolveMemberCommand(execDefaults, candidate) : undefined;
  if (!candidate || !command) {
    throw new Error(
      `No agent found for register item ${item.id} (owner: ${item.owner || "-"}). Specify --by <nickname>.`,
    );
  }
  return { command, actor: candidate.nickname };
}

// --register が executor/reporter パイプラインで実行されたかどうかを、CLI フラグの有無から
// 判定する。owner/--by による従来の単一エージェント解決とは互いに排他（isRegisterPipelineRequested
// が true の間は resolveRegisterCommand を使わない）。
export function isRegisterPipelineRequested(
  opts: Pick<RunOpts, "executorBy" | "reporterBy">,
): boolean {
  return !!(opts.executorBy || opts.reporterBy);
}

// --register 向けの executor/reporter 解決。Schedule タスクの agent_pipeline と異なり、
// register 項目には per-item のパイプライン宣言が無いため、owner/role からの自動選択は行わず
// --executor-by / --reporter-by の明示指定のみを受け付ける。
export function resolveRegisterPipelineCommand(
  roster: MemberRoster | null,
  opts: Pick<RunOpts, "executorBy" | "reporterBy">,
  execDefaults: ExecDefaultsConfig = {},
): {
  executor: AgentRunCandidate & { actor: string };
  reporterCandidates: AgentRunCandidate[];
} {
  if (!opts.executorBy || !opts.reporterBy) {
    throw new Error("--register pipeline execution requires both --executor-by and --reporter-by.");
  }
  const executorResolution = resolveAgentOverride(
    "edit",
    opts.executorBy,
    {},
    roster,
    execDefaults,
    "executor",
  );
  if (executorResolution.kind === "error") {
    throw new Error(executorResolution.message.replace(/^--by/, "--executor-by"));
  }
  if (executorResolution.kind !== "command") {
    throw new Error(`--executor-by agent not found in pm-members.yaml: ${opts.executorBy}`);
  }
  const reporterResolution = resolveAgentOverride(
    "edit",
    opts.reporterBy,
    {},
    roster,
    execDefaults,
    "reporter",
  );
  if (reporterResolution.kind === "error") {
    throw new Error(reporterResolution.message.replace(/^--by/, "--reporter-by"));
  }
  if (reporterResolution.kind !== "command") {
    throw new Error(`--reporter-by agent not found in pm-members.yaml: ${opts.reporterBy}`);
  }
  return {
    executor: {
      command: executorResolution.command,
      actor: executorResolution.actor ?? opts.executorBy,
      provider: executorResolution.provider,
    },
    reporterCandidates: [
      {
        command: reporterResolution.command,
        actor: reporterResolution.actor ?? opts.reporterBy,
        provider: reporterResolution.provider,
      },
    ],
  };
}

// register pipeline の reporter 段だけを実行する。executor 直後の通常経路と、executor が
// 成功したまま reporter だけが失敗した run の再開経路の双方から共有し、reporter 起動・
// result 描画・pipeline-state 更新のみを担う（register の状態遷移と commit は呼び出し側）。
async function runRegisterReporterStage(params: {
  repoRoot: string;
  cwd: string;
  schedulePath: string;
  executionPath: string;
  reporterCandidates: AgentRunCandidate[];
  planPrompt: string;
  resultPath: string;
  execDefaults: ExecDefaultsConfig;
  evidence: ExecEvidence;
  evidencePath: string;
  state: PipelineState;
  statePath: string;
}): Promise<{
  exitCode: 0 | 1;
  runResult: RunResult;
  blockReason?: string;
  state: PipelineState;
}> {
  const { repoRoot, cwd, schedulePath, executionPath, reporterCandidates, execDefaults } = params;
  const env = agentEnvironment(repoRoot, cwd, schedulePath, executionPath);
  let state = params.state;

  const reporterStartedAt = new Date().toISOString();
  state = updatePipelineStage(
    state,
    "reporter",
    {
      status: "running",
      actor: reporterCandidates[0]?.actor ?? null,
      started_at: reporterStartedAt,
      completed_at: null,
    },
    reporterStartedAt,
  );
  writePipelineState(params.statePath, state);
  process.stdout.write(`  Running reporter: ${reporterCandidates[0]?.command ?? ""}\n`);

  let reporterAttempts = 0;
  const reporter = await runReporterWithFormatRetry({
    plan: params.planPrompt,
    evidence: params.evidence,
    mode: "edit",
    invoke: async (reporterPrompt) => {
      const reporterOutcome = await runWithRetry(
        reporterCandidates,
        reporterPrompt,
        execDefaults,
        cwd,
        env,
      );
      reporterAttempts += reporterOutcome.attempts;
      return {
        result: reporterOutcome.result,
        stdout: reporterOutcome.stdout,
        stderr: reporterOutcome.stderr,
      };
    },
  });

  let exitCode: 0 | 1 = 1;
  let blockReason: string | undefined;
  if (reporter.result === "success") {
    try {
      await renderReporterResult(params.resultPath, reporter.output);
      const parentValidationFailure = failedParentValidationReason(params.evidence.validations);
      exitCode = reporter.output.outcome === "complete" && !parentValidationFailure ? 0 : 1;
      blockReason =
        reporter.output.outcome === "blocked"
          ? reporter.output.block_reason
          : parentValidationFailure;
      process.stdout.write(
        `  Reporter complete: ${reporterCandidates[0]?.actor ?? "reporter"} (format attempts: ${reporter.formatAttempts})\n`,
      );
    } catch (error) {
      exitCode = 1;
      blockReason =
        error instanceof Error
          ? `reporter result rendering failed: ${error.message}`
          : String(error);
    }
  } else {
    blockReason = reporter.reason;
    recordReporterFailureOutput({
      worktreePath: cwd,
      evidencePath: params.evidencePath,
      evidence: params.evidence,
      invocationOutputs: reporter.invocationOutputs,
    });
  }

  const reporterCompletedAt = new Date().toISOString();
  state = updatePipelineStage(
    state,
    "reporter",
    {
      status:
        exitCode === 0 ? "succeeded" : reporter.result === "rate_limit" ? "rate_limited" : "failed",
      attempts: state.stages.reporter.attempts + reporterAttempts,
      completed_at: reporterCompletedAt,
      artifact_ref:
        reporter.result === "success"
          ? relative(cwd, params.resultPath).split(sep).join("/")
          : state.stages.reporter.artifact_ref,
    },
    reporterCompletedAt,
  );
  writePipelineState(params.statePath, state);

  const runResult: RunResult =
    exitCode === 0 ? "success" : reporter.result === "rate_limit" ? "rate_limit" : "failure";
  return { exitCode, runResult, blockReason, state };
}

// register 項目1件を executor→reporter の2段階で実行する。in-place（cwd: repoRoot）・
// worktree（cwd: worktree.path）の双方から共有する。evidence・pipeline-state の記録先は
// Schedule タスクの pipeline と同じ形式（exec/evidence/<taskId>/<runId>/）にすることで、
// 監査証跡のフォーマットを実行経路によらず統一する。state には plan / result の参照も
// 記録し、reporter だけが失敗した場合に `--resume` が入力を復元できるようにする。
async function runRegisterAgentPipeline(params: {
  repoRoot: string;
  cwd: string;
  schedulePath: string;
  executionPath: string;
  taskId: string;
  executor: AgentRunCandidate & { actor: string };
  reporterCandidates: AgentRunCandidate[];
  planPath: string;
  planPrompt: string;
  resultPath: string;
  execDefaults: ExecDefaultsConfig;
}): Promise<{
  exitCode: 0 | 1;
  runResult: RunResult;
  blockReason?: string;
  stateRef: string;
  evidenceRef?: string;
}> {
  const {
    repoRoot,
    cwd,
    schedulePath,
    executionPath,
    taskId,
    executor,
    reporterCandidates,
    planPrompt,
    resultPath,
    execDefaults,
  } = params;
  const startedAt = new Date().toISOString();
  const runId = `${new Date().toISOString().replace(/[-:.]/g, "")}-${randomHex(4)}`;
  const stateLocation = pipelineStateLocation({
    repoRoot,
    worktreePath: cwd,
    executionPath,
    taskId,
    runId,
  });
  let state = createPipelineState({
    taskId,
    runId,
    updatedAt: startedAt,
    executorActor: executor.actor,
    reporterActor: reporterCandidates[0]?.actor,
    // plan は root（統合ブランチ）で生成して checkpoint 済みのため、repo 相対パスが
    // worktree 内の相対パスと一致する。result は cwd（in-place は root、worktree 実行は
    // worktree）からの相対で、evidence の artifact_ref と同じ基準に揃える。
    artifacts: {
      plan_ref: relative(repoRoot, params.planPath).split(sep).join("/"),
      result_ref: relative(cwd, resultPath).split(sep).join("/"),
    },
  });
  state = updatePipelineStage(
    state,
    "executor",
    { status: "running", started_at: startedAt },
    startedAt,
  );
  writePipelineState(stateLocation.path, state);

  const env = agentEnvironment(repoRoot, cwd, schedulePath, executionPath);
  const executorPrompt = buildExecutorPrompt(planPrompt, execDefaults.pipeline?.parent_validations);
  const outcome = await runWithRetry([executor], executorPrompt, execDefaults, cwd, env);
  const parentValidations =
    outcome.result === "success" ? await runConfiguredParentValidations(execDefaults, cwd) : [];

  const recorded = recordExecutorEvidence({
    repoRoot,
    worktreePath: cwd,
    executionPath,
    taskId,
    runId,
    actor: executor.actor,
    status:
      outcome.result === "success"
        ? "succeeded"
        : outcome.result === "rate_limit"
          ? "rate_limited"
          : "failed",
    startedAt,
    completedAt: new Date().toISOString(),
    exitCode: outcome.exitCode,
    attempts: outcome.attempts,
    stdout: outcome.stdout,
    stderr: outcome.stderr,
    parentValidations,
  });
  const evidenceRef = relative(cwd, recorded.evidencePath).split(sep).join("/");
  const executorCompletedAt = new Date().toISOString();
  state = updatePipelineStage(
    state,
    "executor",
    {
      status:
        outcome.result === "success"
          ? "succeeded"
          : outcome.result === "rate_limit"
            ? "rate_limited"
            : "failed",
      attempts: outcome.attempts,
      completed_at: executorCompletedAt,
      artifact_ref: evidenceRef,
    },
    executorCompletedAt,
  );
  writePipelineState(stateLocation.path, state);
  process.stdout.write(`  Executor evidence: ${evidenceRef}\n`);

  if (outcome.result !== "success") {
    const blockReason =
      outcome.result === "rate_limit"
        ? "executor rate limit reached"
        : extractBlockReason(outcome.stderr);
    return {
      exitCode: 1,
      runResult: outcome.result,
      blockReason,
      stateRef: stateLocation.ref,
      evidenceRef,
    };
  }

  const reporterOutcome = await runRegisterReporterStage({
    repoRoot,
    cwd,
    schedulePath,
    executionPath,
    reporterCandidates,
    planPrompt,
    resultPath,
    execDefaults,
    evidence: recorded.evidence,
    evidencePath: recorded.evidencePath,
    state,
    statePath: stateLocation.path,
  });

  return {
    exitCode: reporterOutcome.exitCode,
    runResult: reporterOutcome.runResult,
    blockReason: reporterOutcome.blockReason,
    stateRef: stateLocation.ref,
    evidenceRef,
  };
}

// register の状態遷移を CLI 経由で実行する。register 側のガード（終端状態の拒否）と
// 派生ビュー再生成を一元的に通すため、直接ファイルを書き換えず自プロセスを spawn する。
function spawnRegisterTransition(projectId: string | undefined, args: string[]): boolean {
  const fullArgs = ["register", ...args];
  if (projectId) fullArgs.push("--project", projectId);
  return spawnSelf(fullArgs);
}

// 複数IDの直列実行で共有する、ID間で不変なセットアップ。paths/roster/execDefaults の
// 解決は register 全体で1回だけ行い、各IDの実行に使い回す。
type RegisterRunContext = {
  projectId: string;
  schedulePath: string;
  executionPath: string;
  repoRoot: string;
  roster: MemberRoster | null;
  execDefaults: ExecDefaultsConfig;
  registerCommit: boolean;
  // worktree モードでは成果物を worktree に隔離し、状態遷移は root で直列化する。
  worktree: boolean;
  worktreeBase: string;
};

// 成功したIDの実行によって生じた変更だけを1コミットにまとめる。開始前スナップショット
// （preexisting）に無いパスと runnerManaged を対象にし、利用者の既存変更は除外する。
// commit 後は hook が変更した対象を amend し、対象差分が消えるまで収束を検証する。
export function commitRegisterItemChanges(
  repoRoot: string,
  item: PjrItem,
  preexisting: readonly string[],
  runnerManaged: readonly string[] = [],
): { committed: boolean; sha?: string } {
  const remainingPaths = (): string[] =>
    selectRegisterCommitPaths(preexisting, worktreeStatusPaths(repoRoot), runnerManaged);
  const paths = remainingPaths();
  if (paths.length === 0) return { committed: false };

  gitOutput(repoRoot, ["add", "-A", "--", ...paths]);
  const staged = gitResult(repoRoot, ["diff", "--cached", "--quiet", "--", ...paths]);
  if (staged.status === 0) return { committed: false };
  if (staged.status !== 1) throw new Error("Failed to inspect staged register changes.");

  const title = item.title.replace(/\r?\n/g, " ").trim();
  gitOutput(repoRoot, ["commit", "-m", `exec(register ${item.id}): ${title}`, "--", ...paths]);
  stabilizeCommitTargets(repoRoot, remainingPaths);
  const sha = gitOutput(repoRoot, ["rev-parse", "--short", "HEAD"]).trim();
  return { committed: true, sha };
}

function repoRelativePath(repoRoot: string, path: string): string {
  return relative(repoRoot, path).split(sep).join("/");
}

function registerRunnerManagedPaths(
  repoRoot: string,
  registerPaths: RegisterPaths,
  planPath: string,
  resultPath: string,
  currentPaths: readonly string[],
  ticketPath?: string | null,
  additionalManagedPaths: readonly string[] = [],
): string[] {
  // 状態遷移の書き込み先は個票（正本）。pjr-index と派生ビューは生成物として同時に更新される。
  // 移行完了後の pjr-index.md は非追跡の生成物になり存在しないため、存在する場合のみ対象に含める
  // （存在しないパスを git add すると pathspec エラーになる）。
  const managed = [planPath, resultPath, ...additionalManagedPaths];
  if (existsSync(registerPaths.pjrIndexPath)) managed.push(registerPaths.pjrIndexPath);
  if (ticketPath) managed.push(ticketPath);
  const exact = new Set(managed.map((path) => repoRelativePath(repoRoot, path)));
  const prefixes = [registerPaths.generatedPath, registerPaths.controlsGeneratedPath].map(
    (path) => `${repoRelativePath(repoRoot, path)}/`,
  );
  for (const path of currentPaths) {
    const normalized = path.replaceAll("\\", "/");
    if (prefixes.some((prefix) => normalized.startsWith(prefix))) exact.add(path);
  }
  return [...exact];
}

// register 項目1件の in-place 実行。plan 生成 → `register start` → agent 実行 → 成否を
// register の状態遷移（成功: review / 失敗: waiting）と result に反映し、成功かつ
// registerCommit 有効なら当該IDの変更だけを commit する。ID別の結果を要約で返す。
// schedule のタスクではないため exec の claim/complete イベントは記録しない。
async function runSingleRegisterItem(
  context: RegisterRunContext,
  opts: RunOpts,
  pjrId: string,
): Promise<RegisterItemSummary> {
  const { projectId, schedulePath, executionPath, repoRoot } = context;
  const { registerPaths, item } = resolveRegisterRunTarget(projectId, pjrId);
  // 状態遷移の書き込み先（登録項目の正本）。commit 対象に必ず含める。
  const ticketPath = ticketPathFromItem(item, registerPaths.projectRegisterPath);
  requireRunnableRegisterItem(item);

  const pipelineMode = isRegisterPipelineRequested(opts);
  const pipelineAgents = pipelineMode
    ? resolveRegisterPipelineCommand(context.roster, opts, context.execDefaults)
    : undefined;
  // agent（result frontmatter へ記録する actor）は executor 側にする。Schedule の
  // agent_pipeline（scaffoldResult 呼び出し時に executor の actor を渡す）と揃える。
  const { command, actor } = pipelineAgents
    ? { command: pipelineAgents.executor.command, actor: pipelineAgents.executor.actor }
    : resolveRegisterCommand(item, context.roster, opts, context.execDefaults);
  const stem = buildInPlaceStem(pjrId.toLowerCase());

  // ID単位 commit のため、この項目が変更を生じる前の作業ツリー状態を記録する。
  const preexisting = context.registerCommit ? worktreeStatusPaths(repoRoot) : [];
  const residue = context.registerCommit ? selectRegisterRunArtifactResidue(preexisting) : [];
  if (residue.length > 0) {
    process.stderr.write(
      `Warning: pre-existing uncommitted register plan/result files detected before ${item.id}; ` +
        `left out of this item's commit:\n${residue.map((path) => `  ${path}`).join("\n")}\n`,
    );
  }

  const { planPath } = await generateRegisterPlan({
    executionPath,
    projectId,
    registerPaths,
    item,
    stem,
  });
  const prompt = expandPromptRefs(readFileSync(planPath, "utf8"));
  const { resultPath, supersededPaths } = await scaffoldResult({
    executionPath,
    taskId: item.id,
    mode: "edit",
    projectId,
    origin: "register",
    planRef: `exec/plans/${stem}-plan.md`,
    agent: actor,
    startedAt: new Date().toISOString(),
    stem,
  });
  const resultScaffold = readResultFrontmatterSnapshot(resultPath);

  process.stdout.write(`Register item: ${item.id} — ${item.title}  [${item.type}]\n`);
  process.stdout.write(`  Agent: ${actor}${pipelineAgents ? " (executor)" : ""}\n`);
  if (pipelineAgents) {
    process.stdout.write(`  Agent: ${pipelineAgents.reporterCandidates[0]?.actor} (reporter)\n`);
  }
  if (!spawnRegisterTransition(projectId, ["start", "--id", item.id])) {
    throw new Error(`register start failed: ${item.id}`);
  }

  let exitCode: number;
  let pipelineBlockReason: string | undefined;
  if (pipelineAgents) {
    process.stdout.write(`Running ${item.id} in place (executor/reporter pipeline)\n`);
    const pipelineOutcome = await runRegisterAgentPipeline({
      repoRoot,
      cwd: repoRoot,
      schedulePath,
      executionPath,
      taskId: item.id,
      executor: pipelineAgents.executor,
      reporterCandidates: pipelineAgents.reporterCandidates,
      planPath,
      planPrompt: prompt,
      resultPath,
      execDefaults: context.execDefaults,
    });
    exitCode = pipelineOutcome.exitCode;
    pipelineBlockReason = pipelineOutcome.blockReason;
    if (pipelineOutcome.exitCode !== 0) {
      process.stdout.write(
        `run blocked: ${item.id} (${pipelineOutcome.blockReason ?? "pipeline failed"})\n`,
      );
    }
  } else {
    process.stdout.write(`Running ${item.id} in place: ${command}\n`);
    exitCode = await spawnAgentInPlace(command, prompt, repoRoot, schedulePath, executionPath);
  }

  // in-place 実行と同じ補助判定: agent が result 必須節を埋めずに終了コード 0 で
  // 終わった場合は block として扱う（runInPlaceMode と同じ理由）。pipeline モードでは
  // reporter が renderReporterResult で本文を埋めるため通常は該当しないが、
  // フォーマット不整合等の防御として同じチェックを維持する。
  let effectiveExit = exitCode;
  let blockReason: string | undefined = pipelineBlockReason;
  if (exitCode === 0 && isResultUnfilled(resultPath, "edit", resultScaffold)) {
    effectiveExit = 1;
    blockReason =
      "agent exited 0 but result is incomplete or its frontmatter differs from the scaffold (treated as blocked)";
    process.stdout.write(
      `run blocked: ${item.id} (result incomplete or frontmatter changed despite exit 0)\n`,
    );
  }

  await updateResultStatus(
    resultPath,
    effectiveExit === 0 ? "complete" : "blocked",
    new Date().toISOString(),
    blockReason,
  );

  if (effectiveExit === 0) {
    let transition: RegisterItemTransition = "review";
    let reason: string | undefined;
    if (!spawnRegisterTransition(projectId, ["review", "--id", item.id])) {
      process.stderr.write(`register review transition failed: ${item.id}\n`);
      transition = "none";
      reason = "register review transition failed";
    }
    let commit = context.registerCommit ? "no-changes" : "off";
    if (context.registerCommit) {
      const currentPaths = worktreeStatusPaths(repoRoot);
      const runnerManaged = registerRunnerManagedPaths(
        repoRoot,
        registerPaths,
        planPath,
        resultPath,
        currentPaths,
        ticketPath,
        supersededPaths,
      );
      try {
        const result = commitRegisterItemChanges(repoRoot, item, preexisting, runnerManaged);
        if (result.committed) commit = `committed ${result.sha}`;
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        const commitReason = sanitizeRegisterConclusion(`register commit incomplete: ${detail}`);
        process.stderr.write(`run commit failed: ${item.id}: ${detail}\n`);
        if (
          spawnRegisterTransition(projectId, ["wait", "--id", item.id, "--reason", commitReason])
        ) {
          transition = "waiting";
        } else {
          process.stderr.write(`register wait transition failed: ${item.id}\n`);
          transition = "none";
        }
        return {
          id: item.id,
          title: item.title,
          outcome: "failure",
          transition,
          commit: "incomplete",
          reason: commitReason,
        };
      }
    }
    process.stdout.write(
      `run done: ${item.id} (status: review — confirm and close with "register close")\n`,
    );
    return { id: item.id, title: item.title, outcome: "success", transition, commit, reason };
  }

  const waitingReason = sanitizeRegisterConclusion(
    blockReason ?? `agent exited with non-zero code (exit ${exitCode})`,
  );
  if (!spawnRegisterTransition(projectId, ["wait", "--id", item.id, "--reason", waitingReason])) {
    process.stderr.write(`register wait transition failed: ${item.id}\n`);
  }
  process.stdout.write(`run failed: ${item.id} (exit ${effectiveExit}; status: waiting)\n`);
  return {
    id: item.id,
    title: item.title,
    outcome: "failure",
    transition: "waiting",
    commit: context.registerCommit ? "skipped" : "off",
    reason: waitingReason,
  };
}

// register の状態遷移（start/review/wait）が変更した調整状態（pjr-index と派生ビュー）だけを
// 抽出する。worktree モードでは各遷移を root（統合ブランチ）へ commit して作業ツリーを清潔に
// 保ち、後続 ID・並列実行の checkpoint / merge と干渉させない。plan/result は checkpoint と
// worktree merge が扱うため、ここでは含めない。
export function registerStatePaths(
  repoRoot: string,
  registerPaths: RegisterPaths,
  ticketPath?: string | null,
): string[] {
  const changed = worktreeStatusPaths(repoRoot);
  const exact = new Set([repoRelativePath(repoRoot, registerPaths.pjrIndexPath)]);
  if (ticketPath) exact.add(repoRelativePath(repoRoot, ticketPath));
  const prefixes = [registerPaths.generatedPath, registerPaths.controlsGeneratedPath].map(
    (path) => `${repoRelativePath(repoRoot, path)}/`,
  );
  const selected = new Set<string>();
  for (const path of changed) {
    const normalized = path.replaceAll("\\", "/");
    if (exact.has(normalized) || prefixes.some((prefix) => normalized.startsWith(prefix))) {
      selected.add(path);
    }
  }
  return [...selected].sort();
}

// register 状態遷移の pjr-index / 派生ビュー変更を root へ 1 コミットする。hook が対象を
// 整形した場合は同じ commit へ収束するまで amend する。commit 対象が無ければ何もしない。
function commitRegisterState(
  repoRoot: string,
  registerPaths: RegisterPaths,
  message: string,
  ticketPath?: string | null,
): void {
  const paths = registerStatePaths(repoRoot, registerPaths, ticketPath);
  if (paths.length === 0) return;
  gitOutput(repoRoot, ["add", "--", ...paths]);
  const staged = gitResult(repoRoot, ["diff", "--cached", "--quiet", "--", ...paths]);
  if (staged.status === 0) return;
  if (staged.status !== 1) throw new Error("Failed to inspect staged register-state changes.");
  gitOutput(repoRoot, ["commit", "-m", message, "--", ...paths]);
  stabilizeCommitTargets(repoRoot, () => registerStatePaths(repoRoot, registerPaths, ticketPath));
}

// register worktree 実行の失敗確定。waiting へ遷移し、その状態変更（個票・登録簿・派生ビュー）を
// root へ commit して作業ツリーを清潔に保つ。通常実行と reporter 再開で共有する。
function registerWaitSummary(params: {
  repoRoot: string;
  projectId: string;
  registerPaths: RegisterPaths;
  item: PjrItem;
  ticketPath: string | null;
  reason: string;
}): RegisterItemSummary {
  const { repoRoot, projectId, registerPaths, item, ticketPath } = params;
  const blockReason = sanitizeRegisterConclusion(params.reason);
  let transition: RegisterItemTransition = "waiting";
  if (!spawnRegisterTransition(projectId, ["wait", "--id", item.id, "--reason", blockReason])) {
    process.stderr.write(`register wait transition failed: ${item.id}\n`);
    transition = "none";
  } else {
    commitRegisterState(repoRoot, registerPaths, `exec(register ${item.id}): wait`, ticketPath);
  }
  return {
    id: item.id,
    title: item.title,
    outcome: "failure",
    transition,
    commit: "off",
    reason: blockReason,
  };
}

// register worktree 実行の Phase 3（成果物統合と状態遷移）。成功なら worktree の成果物を
// commit → 統合ブランチへ merge → worktree 撤去 → register review、失敗なら worktree を
// 保持したまま waiting へ戻す。通常実行と reporter 再開で同じ後処理を通す。
async function finalizeRegisterWorktreeRun(params: {
  context: RegisterRunContext;
  registerPaths: RegisterPaths;
  item: PjrItem;
  ticketPath: string | null;
  worktree: ExecWorktree;
  stem: string;
  worktreeResultPath: string;
  resultScaffold: Record<string, unknown>;
  agentResult: RunResult;
  stderr: string;
}): Promise<RegisterItemSummary> {
  const { context, registerPaths, item, ticketPath, worktree, stem, agentResult } = params;
  const { projectId, schedulePath, executionPath, repoRoot } = context;
  const wtContext = { repoRoot, schedulePath, executionPath };
  const waitSummary = (reason: string): RegisterItemSummary =>
    registerWaitSummary({ repoRoot, projectId, registerPaths, item, ticketPath, reason });

  const completedAt = new Date().toISOString();
  const worktreeResultPath = params.worktreeResultPath;
  const { result: effectiveResult, unfilledBlock } = downgradeUnfilledResult(
    agentResult,
    worktreeResultPath,
    "edit",
    params.resultScaffold,
  );

  if (effectiveResult === "success") {
    await updateResultStatus(worktreeResultPath, "complete", completedAt);
    const title = item.title.replace(/\r?\n/g, " ").trim();
    try {
      commitWorktreeChanges({
        context: wtContext,
        worktree,
        taskId: stem,
        message: `exec(register ${item.id}): ${title}`,
      });
      mergeWorktreeIntoCurrent({ context: wtContext, worktree, taskId: stem });
    } catch (error) {
      const reason = sanitizeRegisterConclusion(
        `integrate failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      await updateResultStatus(worktreeResultPath, "blocked", completedAt, reason);
      process.stdout.write(`  Blocked: ${item.id} (worktree kept: ${worktree.path})\n`);
      const summary = waitSummary(reason);
      return { ...summary, commit: "incomplete" };
    }
    removeWorktree({ context: wtContext, worktree, taskId: stem, deleteBranch: true });

    let transition: RegisterItemTransition = "review";
    let reason: string | undefined;
    if (!spawnRegisterTransition(projectId, ["review", "--id", item.id])) {
      process.stderr.write(`register review transition failed: ${item.id}\n`);
      transition = "none";
      reason = "register review transition failed";
    } else {
      commitRegisterState(repoRoot, registerPaths, `exec(register ${item.id}): review`, ticketPath);
    }
    const sha = gitOutput(repoRoot, ["rev-parse", "--short", "HEAD"]).trim();
    process.stdout.write(
      `run done: ${item.id} (status: review — confirm and close with "register close")\n`,
    );
    return {
      id: item.id,
      title: item.title,
      outcome: "success",
      transition,
      commit: `committed ${sha}`,
      reason,
    };
  }

  // 失敗 / rate limit: worktree は保持し（調査・再開のため）、waiting へ遷移する。
  const reason = unfilledBlock
    ? "agent exited 0 but result is incomplete or its frontmatter differs from the scaffold (treated as blocked)"
    : agentResult === "rate_limit"
      ? "rate limit reached"
      : extractBlockReason(params.stderr);
  await updateResultStatus(
    worktreeResultPath,
    "blocked",
    completedAt,
    sanitizeRegisterConclusion(reason),
  );
  process.stdout.write(
    `run failed: ${item.id} (status: waiting; worktree kept: ${worktree.path})\n`,
  );
  return waitSummary(reason);
}

// register 項目1件の worktree 実行。成果物は worktree に隔離し、状態遷移（start/review/wait）は
// root（統合ブランチ）で lifecycleLock 直列化して pjr-index の競合を避ける。フローは
// Phase1: plan/result 生成 → register start → checkpoint（plan/result/pjr-index/views を root
// HEAD へ commit）→ worktree 作成、Phase2: worktree で agent 実行、Phase3: 成功なら成果物を
// commit → merge back → worktree 撤去 → register review、失敗/rate limit なら register wait。
async function runSingleRegisterItemWorktree(
  context: RegisterRunContext,
  opts: RunOpts,
  pjrId: string,
  lifecycleLock?: AsyncLock,
): Promise<RegisterItemSummary> {
  const { projectId, schedulePath, executionPath, repoRoot, worktreeBase } = context;
  const wtContext = { repoRoot, schedulePath, executionPath };
  const { registerPaths, item } = resolveRegisterRunTarget(projectId, pjrId);
  // 状態遷移の書き込み先（登録項目の正本）。commit 対象に必ず含める。
  const ticketPath = ticketPathFromItem(item, registerPaths.projectRegisterPath);
  requireRunnableRegisterItem(item);

  const pipelineMode = isRegisterPipelineRequested(opts);
  const pipelineAgents = pipelineMode
    ? resolveRegisterPipelineCommand(context.roster, opts, context.execDefaults)
    : undefined;
  // agent（result frontmatter へ記録する actor）は executor 側にする。Schedule の
  // agent_pipeline（scaffoldResult 呼び出し時に executor の actor を渡す）と揃える。
  const { command, actor, provider } = pipelineAgents
    ? {
        command: pipelineAgents.executor.command,
        actor: pipelineAgents.executor.actor,
        provider: pipelineAgents.executor.provider,
      }
    : {
        ...resolveRegisterCommand(item, context.roster, opts, context.execDefaults),
        provider: undefined as AgentProvider | undefined,
      };
  const resolvedProvider =
    provider ??
    context.roster?.members.find((m) => m.nickname === actor && m.type === "agent")?.provider;
  const stem = buildInPlaceStem(pjrId.toLowerCase());
  const worktreeTaskId = qualifyTaskId(projectId, item.id);

  const waitSummary = (reason: string): RegisterItemSummary =>
    registerWaitSummary({ repoRoot, projectId, registerPaths, item, ticketPath, reason });

  // Phase 1: plan/result 生成 → register start → checkpoint → worktree 作成（root で直列化）。
  const setup = async (): Promise<
    | {
        worktree: ExecWorktree;
        planPath: string;
        resultPath: string;
        resultScaffold: Record<string, unknown>;
        prompt: string;
      }
    | RegisterItemSummary
  > => {
    // executor が成功した run の worktree を、全体再実行が破棄しないよう保護する。
    // discardStaleExecWorktree は worktree と exec ブランチを強制削除するため、未コミットの
    // executor 成果が失われる。この場合は何も壊さずに中断し、再開か明示的な破棄を促す。
    const protection = protectResumableRegisterWorktree(context, opts, item.id, worktreeTaskId);
    if (protection) {
      process.stderr.write(`${protection}\n`);
      return {
        id: item.id,
        title: item.title,
        outcome: "failure",
        transition: "none",
        commit: "off",
        reason: sanitizeRegisterConclusion(protection),
      };
    }

    const discarded = discardStaleExecWorktree({ context: wtContext, worktreeTaskId });
    if (discarded) process.stdout.write(`  [run] discarded stale worktree/branch: ${discarded}\n`);

    const { planPath } = await generateRegisterPlan({
      executionPath,
      projectId,
      registerPaths,
      item,
      stem,
    });
    const prompt = expandPromptRefs(readFileSync(planPath, "utf8"));
    const { resultPath, supersededPaths } = await scaffoldResult({
      executionPath,
      taskId: item.id,
      mode: "edit",
      projectId,
      origin: "register",
      planRef: `exec/plans/${stem}-plan.md`,
      agent: actor,
      startedAt: new Date().toISOString(),
      stem,
    });
    const resultScaffold = readResultFrontmatterSnapshot(resultPath);

    process.stdout.write(`Register item: ${item.id} — ${item.title}  [${item.type}]\n`);
    process.stdout.write(`  Agent: ${actor}\n`);
    if (!spawnRegisterTransition(projectId, ["start", "--id", item.id])) {
      throw new Error(`register start failed: ${item.id}`);
    }

    const checkpointRel = registerRunnerManagedPaths(
      repoRoot,
      registerPaths,
      planPath,
      resultPath,
      worktreeStatusPaths(repoRoot),
      ticketPath,
      supersededPaths,
    );
    const checkpointPaths = checkpointRel.map((rel) => resolve(repoRoot, rel));
    try {
      const worktree = checkpointAndEnsureWorktree({
        context: wtContext,
        worktreeTaskId,
        base: worktreeBase,
        checkpointPaths,
        commitMessage: `exec(register ${item.id}): start`,
      });
      const setupAction = worktree.created ? "setup" : "reuse";
      process.stdout.write(
        `  [run] ${setupAction}: worktree ${worktree.path} (${worktree.branch})\n`,
      );
      return { worktree, planPath, resultPath, resultScaffold, prompt };
    } catch (error) {
      // checkpoint 失敗時は start を巻き戻して waiting にする（worktree は未作成）。
      return waitSummary(
        `checkpoint failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  const prepared = lifecycleLock ? await lifecycleLock.runExclusive(setup) : await setup();
  if ("outcome" in prepared) return prepared;
  const { worktree, planPath, resultPath, resultScaffold, prompt } = prepared;

  // Phase 2: agent を worktree 内で実行（ロック外・並列可能な長時間部分）。
  const env = agentEnvironment(repoRoot, worktree.path, schedulePath, executionPath);
  let agentResult: RunResult;
  let stderr = "";
  if (pipelineAgents) {
    process.stdout.write(
      `Running ${item.id} in worktree (executor/reporter pipeline)\n  CWD: ${worktree.path}\n`,
    );
    const worktreeResultPathForPipeline = pathInsideWorktree(repoRoot, worktree.path, resultPath);
    const pipelineOutcome = await runRegisterAgentPipeline({
      repoRoot,
      cwd: worktree.path,
      schedulePath,
      executionPath,
      taskId: item.id,
      executor: pipelineAgents.executor,
      reporterCandidates: pipelineAgents.reporterCandidates,
      planPath,
      planPrompt: prompt,
      resultPath: worktreeResultPathForPipeline,
      execDefaults: context.execDefaults,
    });
    agentResult = pipelineOutcome.runResult;
    stderr = pipelineOutcome.blockReason ?? "";
  } else {
    process.stdout.write(`Running ${item.id} in worktree: ${command}\n  CWD: ${worktree.path}\n`);
    const outcome = await runWithRetry(
      [{ command, actor, provider: resolvedProvider }],
      prompt,
      context.execDefaults,
      worktree.path,
      env,
    );
    agentResult = outcome.result;
    stderr = outcome.stderr;
  }

  // Phase 3: 成果物統合と状態遷移（root で直列化）。通常実行と reporter 再開で共通化する。
  const finalize = async (): Promise<RegisterItemSummary> =>
    finalizeRegisterWorktreeRun({
      context,
      registerPaths,
      item,
      ticketPath,
      worktree,
      stem,
      worktreeResultPath: pathInsideWorktree(repoRoot, worktree.path, resultPath),
      resultScaffold,
      agentResult,
      stderr,
    });

  return lifecycleLock ? lifecycleLock.runExclusive(finalize) : finalize();
}

// 全体再実行が executor の未コミット成果を破棄しないための保護。既存 worktree に executor
// 成功済み・reporter 未完了の run が残っている場合だけ理由を返し、呼び出し側が破壊的操作
// （discardStaleExecWorktree）の手前で中断できるようにする。--force-restart で無効化できる。
function protectResumableRegisterWorktree(
  context: RegisterRunContext,
  opts: RunOpts,
  taskId: string,
  worktreeTaskId: string,
): string | null {
  if (opts.forceRestart) return null;
  const worktree = findExecWorktree(context.repoRoot, worktreeTaskId);
  if (!worktree) return null;
  const lookup = findResumableRegisterRun({
    repoRoot: context.repoRoot,
    worktreePath: worktree.path,
    executionPath: context.executionPath,
    taskId,
  });
  if (lookup.kind !== "resumable") return null;
  return (
    `refusing to re-run ${taskId}: executor already succeeded in run ${lookup.target.runId} and ` +
    `its changes are still uncommitted in ${worktree.path}. ` +
    `Resume the reporter with --resume, or discard the worktree with --force-restart.`
  );
}

// reporter 再開に使う agent を解決する。--reporter-by を優先し、省略時は再開対象 run の
// pipeline-state に記録された reporter actor（通常は前回と同じ agent）へフォールバックする。
export function resolveRegisterResumeReporter(
  roster: MemberRoster | null,
  opts: Pick<RunOpts, "reporterBy">,
  execDefaults: ExecDefaultsConfig,
  recordedActor: string | null,
):
  | { kind: "command"; candidate: AgentRunCandidate & { actor: string } }
  | { kind: "error"; message: string } {
  const nickname = (opts.reporterBy ?? recordedActor ?? "").trim();
  if (!nickname) {
    return {
      kind: "error",
      message: "reporter agent is unknown for this run; specify --reporter-by <nickname>",
    };
  }
  const resolution = resolveAgentOverride("edit", nickname, {}, roster, execDefaults, "reporter");
  if (resolution.kind === "error") {
    return { kind: "error", message: resolution.message.replace(/^--by/, "--reporter-by") };
  }
  if (resolution.kind !== "command") {
    return { kind: "error", message: `reporter agent not found in pm-members.yaml: ${nickname}` };
  }
  return {
    kind: "command",
    candidate: {
      command: resolution.command,
      actor: resolution.actor ?? nickname,
      provider: resolution.provider,
    },
  };
}

// register 項目1件の reporter 再開。executor が成功したまま reporter だけが失敗した run を、
// worktree と executor の未コミット成果を保持したまま reporter 段からやり直す。入力は対象 run の
// `pipeline-state.json`（plan / result の参照と stage 状態）と `evidence.json`（executor の記録）で、
// 成功後の commit → merge → register review は通常実行と同じ finalizeRegisterWorktreeRun を通す。
// 再開できない場合（worktree 不在、executor 未完了、evidence 欠損）は破壊的操作を行わず理由を返す。
async function resumeSingleRegisterItemWorktree(
  context: RegisterRunContext,
  opts: RunOpts,
  pjrId: string,
  lifecycleLock?: AsyncLock,
): Promise<RegisterItemSummary> {
  const { projectId, schedulePath, executionPath, repoRoot } = context;
  const { registerPaths, item } = resolveRegisterRunTarget(projectId, pjrId);
  const ticketPath = ticketPathFromItem(item, registerPaths.projectRegisterPath);
  requireRunnableRegisterItem(item);

  // 再開できない場合は register の状態も worktree も変更せず、理由だけを返す。
  const refuse = (reason: string): RegisterItemSummary => {
    process.stderr.write(`resume refused: ${item.id}: ${reason}\n`);
    return {
      id: item.id,
      title: item.title,
      outcome: "failure",
      transition: "none",
      commit: "off",
      reason: sanitizeRegisterConclusion(reason),
    };
  };

  const worktreeTaskId = qualifyTaskId(projectId, item.id);
  const worktree = findExecWorktree(repoRoot, worktreeTaskId);
  if (!worktree) {
    return refuse(`no exec worktree to resume for ${item.id}; run the item again instead`);
  }

  const lookup = findResumableRegisterRun({
    repoRoot,
    worktreePath: worktree.path,
    executionPath,
    taskId: item.id,
  });
  if (lookup.kind !== "resumable") return refuse(lookup.reason);
  const target = lookup.target;

  if (
    !hasRecordedParentValidations(
      target.evidence.validations,
      context.execDefaults.pipeline?.parent_validations,
    )
  ) {
    return refuse(
      `parent validation configuration changed or its results are missing for run ${target.runId}; restart the executor run`,
    );
  }

  const artifacts = resolveRegisterResumeArtifacts({
    repoRoot,
    worktreePath: worktree.path,
    executionPath,
    taskId: item.id,
    state: target.state,
  });
  if (!artifacts) return refuse(`cannot restore the plan/result of run ${target.runId}`);

  // plan は root（統合ブランチ）の checkpoint 済みファイルを正本にする。worktree 側の plan は
  // agent が書き換えられるため、再開のプロンプト入力には使わない。
  const planPath = resolve(repoRoot, artifacts.planRef);
  if (!existsSync(planPath))
    return refuse(`plan not found for the resumed run: ${artifacts.planRef}`);
  const worktreeResultPath = resolve(worktree.path, artifacts.resultRef);
  if (!existsSync(worktreeResultPath)) {
    return refuse(`result not found in the worktree: ${artifacts.resultRef}`);
  }
  const prompt = expandPromptRefs(readFileSync(planPath, "utf8"));

  const reporter = resolveRegisterResumeReporter(
    context.roster,
    opts,
    context.execDefaults,
    target.state.stages.reporter.actor,
  );
  if (reporter.kind === "error") return refuse(reporter.message);

  process.stdout.write(`Register item: ${item.id} — ${item.title}  [${item.type}]\n`);
  process.stdout.write(
    `  Resuming reporter from run ${target.runId} (executor evidence: ${target.evidenceRef})\n` +
      `  CWD: ${worktree.path}\n  Agent: ${reporter.candidate.actor} (reporter)\n`,
  );

  // waiting のまま reporter を走らせないよう、通常実行と同じく in-progress へ戻す。状態変更は
  // root で直列化し、merge 前に作業ツリーを清潔にするため即時 commit する。
  const begin = (): RegisterItemSummary | null => {
    if (!spawnRegisterTransition(projectId, ["start", "--id", item.id])) {
      return refuse(`register start failed: ${item.id}`);
    }
    commitRegisterState(repoRoot, registerPaths, `exec(register ${item.id}): resume`, ticketPath);
    return null;
  };
  const beginFailure = lifecycleLock ? await lifecycleLock.runExclusive(begin) : begin();
  if (beginFailure) return beginFailure;

  const evidence = await revalidateFailedParentValidationsForReporterResume({
    execDefaults: context.execDefaults,
    cwd: worktree.path,
    evidence: target.evidence,
    evidencePath: resolve(worktree.path, target.evidenceRef),
  });

  const resultScaffold = readResultFrontmatterSnapshot(worktreeResultPath);
  const outcome = await runRegisterReporterStage({
    repoRoot,
    cwd: worktree.path,
    schedulePath,
    executionPath,
    reporterCandidates: [reporter.candidate],
    planPrompt: prompt,
    resultPath: worktreeResultPath,
    execDefaults: context.execDefaults,
    evidence,
    evidencePath: resolve(worktree.path, target.evidenceRef),
    state: target.state,
    statePath: target.statePath,
  });

  const finalize = async (): Promise<RegisterItemSummary> =>
    finalizeRegisterWorktreeRun({
      context,
      registerPaths,
      item,
      ticketPath,
      worktree,
      stem: artifacts.stem,
      worktreeResultPath,
      resultScaffold,
      agentResult: outcome.runResult,
      stderr: outcome.blockReason ?? "",
    });

  return lifecycleLock ? lifecycleLock.runExclusive(finalize) : finalize();
}

// register 項目の実行（複数ID）。in-place モードは指定順に1件ずつ直列実行し、各IDが plan/result
// 生成・start・agent実行・review/waiting 遷移まで完結してから次へ進む。worktree モードは成果物を
// worktree に隔離し、状態遷移を root で直列化する（--parallel で並列化可能）。失敗時は
// failureMode（stop: 残りを skip / continue: 継続）に従う。最後にID別の成否・状態遷移・
// commit結果を一覧表示し、いずれかが failure ならプロセス終了コードへ反映する。
async function runRegisterMode(opts: RunOpts): Promise<void> {
  const resolvedPaths = resolveProjectPaths({ project: opts.project });
  activateResolvedProjectPaths(resolvedPaths);
  const { schedulePath, executionPath } = resolvedPaths;
  const repoRoot = specdojoRootDir();
  const projectId = resolvedPaths.projectId ?? opts.project ?? process.env.SPECDOJO_PROJECT ?? "";
  if (!projectId) {
    throw new Error(
      "--register requires a project id. Use --project <id> or set current_project in specdojo.config.json.",
    );
  }

  const { ids, duplicates } = parseRegisterIds(opts.register);
  for (const duplicate of duplicates) {
    process.stdout.write(`Skipping duplicate register item id: ${duplicate}\n`);
  }
  const failureMode: RegisterFailureMode = opts.onFailure
    ? (opts.onFailure as RegisterFailureMode)
    : "stop";
  // --executor-by / --reporter-by は両方揃って初めて pipeline モードになる。片方だけの指定は
  // 曖昧なため、実行前に明示的なエラーで止める（isRegisterPipelineRequested は片方でも true を
  // 返すため、resolveRegisterPipelineCommand 側の対称チェックとは別に、ここで早期に検知する）。
  // 再開は reporter 段だけを実行するため、executor の指定は不要（指定されても使わない）。
  if (
    !opts.resume &&
    ((opts.executorBy && !opts.reporterBy) || (!opts.executorBy && opts.reporterBy))
  ) {
    throw new Error("--register pipeline execution requires both --executor-by and --reporter-by.");
  }

  const roster = loadRosterForExecutionPath(executionPath);
  const execDefaults = loadExecDefaultsConfig(
    resolveExecDefaultsPath(opts, schedulePath),
    executionPath,
  );
  const useWorktree = !!opts.worktree;
  const parallel = parseParallel(opts.parallel);
  const worktreeBase = resolveWorktreeBase(
    repoRoot,
    opts.worktreeBase,
    configuredWorktreeBase(schedulePath),
  );

  if (opts.dryRun && opts.resume) {
    process.stdout.write(`[dry-run] resume reporter for register items: ${ids.join(", ")}\n`);
    for (const pjrId of ids) {
      const { item } = resolveRegisterRunTarget(projectId, pjrId);
      requireRunnableRegisterItem(item);
      const worktree = findExecWorktree(repoRoot, qualifyTaskId(projectId, item.id));
      if (!worktree) {
        process.stdout.write(`[dry-run]   ${item.id}: no exec worktree — not resumable\n`);
        continue;
      }
      const lookup = findResumableRegisterRun({
        repoRoot,
        worktreePath: worktree.path,
        executionPath,
        taskId: item.id,
      });
      process.stdout.write(
        lookup.kind === "resumable"
          ? `[dry-run]   ${item.id}: resume run ${lookup.target.runId} in ${worktree.path}\n`
          : `[dry-run]   ${item.id}: not resumable (${lookup.reason})\n`,
      );
    }
    return;
  }

  if (opts.dryRun) {
    const modeLabel = useWorktree
      ? `worktree${parallel > 1 ? `, parallel: ${parallel}` : ", serial"}`
      : "in-place, serial";
    process.stdout.write(
      `[dry-run] register items (${modeLabel}): ${ids.join(", ")}  [on-failure: ${failureMode}, commit: ${useWorktree ? "always (worktree)" : opts.registerCommit ? "per-id" : "off"}]\n`,
    );
    const pipelineMode = isRegisterPipelineRequested(opts);
    for (const pjrId of ids) {
      const { item } = resolveRegisterRunTarget(projectId, pjrId);
      const category = requireRunnableRegisterItem(item);
      const stem = buildInPlaceStem(pjrId.toLowerCase());
      process.stdout.write(
        `[dry-run] register item: ${item.id} — ${item.title}  [${item.type}/${category}]\n`,
      );
      if (pipelineMode) {
        const { executor, reporterCandidates } = resolveRegisterPipelineCommand(
          roster,
          opts,
          execDefaults,
        );
        process.stdout.write(`[dry-run]   executor: ${executor.actor}\n`);
        process.stdout.write(`[dry-run]   executor command: ${executor.command}\n`);
        process.stdout.write(`[dry-run]   reporter: ${reporterCandidates[0]?.actor}\n`);
        process.stdout.write(`[dry-run]   reporter command: ${reporterCandidates[0]?.command}\n`);
      } else {
        const { command, actor } = resolveRegisterCommand(item, roster, opts, execDefaults);
        process.stdout.write(`[dry-run]   actor: ${actor}\n`);
        process.stdout.write(`[dry-run]   command: ${command}\n`);
      }
      process.stdout.write(
        `[dry-run]   plan: ${join(executionPath, "exec", "plans", `${stem}-plan.md`)}\n`,
      );
    }
    process.stdout.write(
      `[dry-run] cwd: ${useWorktree ? `${worktreeBase}/<worktree>` : repoRoot}\n`,
    );
    process.stdout.write(
      `[dry-run] transitions: start (in-progress) → review on success / waiting on failure\n`,
    );
    return;
  }

  const context: RegisterRunContext = {
    projectId,
    schedulePath,
    executionPath,
    repoRoot,
    roster,
    execDefaults,
    registerCommit: !!opts.registerCommit,
    worktree: useWorktree,
    worktreeBase,
  };

  const skippedSummary = (pjrId: string): RegisterItemSummary => ({
    id: pjrId,
    title: "-",
    outcome: "skipped",
    transition: "none",
    commit: "skipped",
    reason: "stopped after an earlier failure (--on-failure stop)",
  });

  const summaries: RegisterItemSummary[] = [];
  // 再開は既存 worktree の reporter 段だけを実行する。それ以外の経路（plan 生成・executor 実行）
  // は通らないため、通常実行と同じ並列・直列の枠だけを共有する。
  const runItem = (pjrId: string, lifecycleLock?: AsyncLock): Promise<RegisterItemSummary> =>
    opts.resume
      ? resumeSingleRegisterItemWorktree(context, opts, pjrId, lifecycleLock)
      : runSingleRegisterItemWorktree(context, opts, pjrId, lifecycleLock);

  if (useWorktree && parallel > 1) {
    // 並列実行: 成果物は worktree ごとに隔離し、状態遷移は lifecycleLock で直列化する。
    // stop 指定でも実行中の項目は完走し、未着手の残りだけを skipped にする。
    const lifecycleLock = new SerialAsyncLock();
    const queue = [...ids];
    const byId = new Map<string, RegisterItemSummary>();
    let stop = false;
    await runCompletionDrivenWorkerPool<string, RegisterItemSummary>({
      maxParallel: parallel,
      fillSlots: (openSlots) => (stop ? [] : queue.splice(0, openSlots)),
      runItem: (pjrId) => runItem(pjrId, lifecycleLock),
      onSettled: (pjrId, summary) => {
        byId.set(pjrId, summary);
        if (summary.outcome === "failure" && failureMode === "stop") {
          stop = true;
          return { stop: true };
        }
      },
    });
    for (const pjrId of ids) summaries.push(byId.get(pjrId) ?? skippedSummary(pjrId));
  } else {
    let stopped = false;
    for (const pjrId of ids) {
      if (stopped) {
        summaries.push(skippedSummary(pjrId));
        continue;
      }
      const summary = useWorktree
        ? await runItem(pjrId)
        : await runSingleRegisterItem(context, opts, pjrId);
      summaries.push(summary);
      if (summary.outcome === "failure" && failureMode === "stop") stopped = true;
    }
  }

  process.stdout.write(`${formatRegisterRunSummary(summaries)}\n`);
  const exitCode = registerRunExitCode(summaries);
  if (exitCode !== 0) process.exitCode = exitCode;
}

export function registerRunCommand(exec: Command): void {
  const rcmd = exec
    .command("run")
    .description("Run AI agent for a ready task (--auto selects next by strategy)");

  rcmd.option("--project <projectId>", "Project id in .specdojo/specdojo.config.json");
  rcmd.option("--by <nickname>", "Select a pm-members.yaml agent for a manual target");
  rcmd.option("--auto", "Automatically select and run next ready task", false);
  rcmd.option("--task <taskId>", "Task ID to run (manual selection)");
  rcmd.option(
    "--deliverable <localId>",
    "Catalog deliverable local_id target (unique project-wide)",
  );
  rcmd.option("--plan <path>", "Run an existing plan file (in-place; no generation)");
  rcmd.option(
    "--register <pjrIds...>",
    "One or more project register item IDs (PJR-XXXX) to run; tracks state via register transitions. In place and serial by default; add --worktree to isolate deliverables (and --parallel to run concurrently)",
  );
  rcmd.option("--job <jobId>", "Materialize and run a reusable job definition");
  rcmd.option(
    "--input <key=value...>",
    "Job input values (repeat or provide multiple key=value pairs)",
  );
  rcmd.option("--scheduled-at <dateTime>", "Scheduled occurrence time for a Job Run");
  rcmd.option("--job-trigger <source>", "Job trigger source: manual|routine|ci", "manual");
  rcmd.option(
    "--register-commit",
    "With --register (in-place only): commit each successful item's changes as a separate commit (default: leave changes in the working tree). Ignored with --worktree, which always commits",
    false,
  );
  rcmd.option(
    "--on-failure <mode>",
    "With --register: stop|continue remaining items after a failure (default: stop)",
  );
  rcmd.option(
    "--resume",
    "With --register --worktree: resume only the reporter stage of a run whose executor succeeded, reusing the existing worktree and evidence",
    false,
  );
  rcmd.option(
    "--force-restart",
    "With --register --worktree: re-run the whole item even when a resumable executor result exists (discards the worktree and its uncommitted changes)",
    false,
  );
  rcmd.option(
    "--worktree",
    "Isolate execution in a git worktree and integrate back (requires --task or --register)",
    false,
  );
  rcmd.option(
    "--track-state",
    "Record claim/complete events (requires --task; --by optional, actor auto-derived from the resolved agent)",
    false,
  );
  rcmd.option(
    "--archive-on-success",
    "Archive the generated plan to exec/plans/done/ after a successful in-place run",
    false,
  );
  rcmd.option("--parallel <n>", "Number of worktree instances to run in parallel", "1");
  rcmd.option("--worktree-base <path>", "Override worktree base directory");
  rcmd.option(
    "--strategy <s>",
    "Task selection strategy: critical-first|fifo (default: critical-first)",
  );
  rcmd.option(
    "--loop",
    "Repeat rounds until no ready tasks remain, rebuilding doc-index and running exec refresh between rounds",
    false,
  );
  rcmd.option(
    "--max-rounds <n>",
    "Maximum number of rounds when using --loop (ignored without --loop)",
  );
  rcmd.option(
    "--if-busy <policy>",
    "When another exec is running for the project: skip|wait|fail (default: fail)",
    "fail",
  );
  rcmd.option(
    "--exec-defaults <path>",
    "Path to exec-defaults.yaml global config (default: .specdojo/exec-defaults.yaml)",
  );
  rcmd.option("--agent-config <path>", "Deprecated alias for --exec-defaults");
  rcmd.option(
    "--edit-by <nickname>",
    "pm-members.yaml agent nickname for edit-mode tasks in --auto batch runs",
  );
  rcmd.option(
    "--review-by <nickname>",
    "pm-members.yaml agent nickname for review-mode tasks in --auto batch runs",
  );
  rcmd.option(
    "--executor-by <nickname>",
    "pm-members.yaml executor agent nickname for agent_pipeline tasks",
  );
  rcmd.option(
    "--reporter-by <nickname>",
    "pm-members.yaml reporter agent nickname for agent_pipeline tasks",
  );
  rcmd.option("--dry-run", "Print resolved command without executing", false);

  rcmd.action(async (opts: RunOpts) => {
    try {
      const isAuto = !!opts.auto;
      const hasTask = !!opts.task;
      const hasDeliverable = !!opts.deliverable;
      const hasPlan = !!opts.plan;
      const hasRegister = !!opts.register;
      const hasJob = !!opts.job;
      const isManual = hasTask || hasDeliverable || hasPlan || hasRegister || hasJob;
      const isBatch = isAuto;

      if (!isAuto && !isManual) {
        process.stdout.write(
          "Specify --auto, --by (with a manual target), --task, --deliverable, --plan, --register, or --job.\n",
        );
        process.exitCode = 1;
        return;
      }
      if ([hasTask, hasDeliverable, hasPlan, hasRegister, hasJob].filter(Boolean).length > 1) {
        process.stdout.write(
          "Specify at most one of --task, --deliverable, --plan, --register, --job.\n",
        );
        process.exitCode = 1;
        return;
      }
      if (hasRegister && opts.trackState) {
        process.stdout.write(
          "--track-state cannot be used with --register (state is tracked in the register itself).\n",
        );
        process.exitCode = 1;
        return;
      }
      if (hasRegister && !opts.worktree && parseParallel(opts.parallel) !== 1) {
        process.stdout.write(
          "--parallel with --register requires --worktree (in-place register items run serially).\n",
        );
        process.exitCode = 1;
        return;
      }
      if (hasRegister && opts.worktree && opts.registerCommit) {
        process.stdout.write(
          "Note: --register-commit is ignored with --worktree; worktree runs always commit (checkpoint + merge back).\n",
        );
      }
      if ((opts.registerCommit || opts.onFailure) && !hasRegister) {
        process.stdout.write("--register-commit and --on-failure require --register.\n");
        process.exitCode = 1;
        return;
      }
      if ((opts.resume || opts.forceRestart) && !hasRegister) {
        process.stdout.write("--resume and --force-restart require --register.\n");
        process.exitCode = 1;
        return;
      }
      // 再開は既存 worktree の成果を再利用する操作のため、worktree 実行に限る。in-place 実行は
      // executor の変更が作業ツリーに残り、再開時のID単位 commit が対象を判別できない。
      if ((opts.resume || opts.forceRestart) && !opts.worktree) {
        process.stdout.write("--resume and --force-restart require --worktree with --register.\n");
        process.exitCode = 1;
        return;
      }
      if (opts.resume && opts.forceRestart) {
        process.stdout.write("Specify either --resume or --force-restart, not both.\n");
        process.exitCode = 1;
        return;
      }
      if ((opts.input || opts.scheduledAt) && !hasJob) {
        process.stdout.write("--input and --scheduled-at require --job.\n");
        process.exitCode = 1;
        return;
      }
      if (opts.jobTrigger && !["manual", "routine", "ci"].includes(opts.jobTrigger)) {
        process.stdout.write("--job-trigger must be manual, routine, or ci.\n");
        process.exitCode = 1;
        return;
      }
      if (hasJob && opts.worktree) {
        process.stdout.write("--worktree is not yet supported with --job.\n");
        process.exitCode = 1;
        return;
      }
      if (opts.onFailure && !isRegisterFailureMode(opts.onFailure)) {
        process.stdout.write(`--on-failure must be "stop" or "continue": ${opts.onFailure}\n`);
        process.exitCode = 1;
        return;
      }
      if (isAuto && isManual) {
        process.stdout.write("Specify either --auto or a manual target, not both.\n");
        process.exitCode = 1;
        return;
      }
      if (isAuto && opts.by) {
        process.stdout.write(
          "--by requires a manual target; use --edit-by / --review-by with --auto.\n",
        );
        process.exitCode = 1;
        return;
      }
      if (opts.by && opts.executorBy) {
        process.stdout.write("Specify either --by or --executor-by, not both.\n");
        process.exitCode = 1;
        return;
      }
      if (opts.worktree && !hasTask && !hasRegister) {
        process.stdout.write("--worktree requires --task or --register.\n");
        process.exitCode = 1;
        return;
      }
      // --parallel is allowed for register worktree runs (handled above); reject it for other
      // manual targets, which run a single instance.
      if (isManual && !hasRegister && parseParallel(opts.parallel) !== 1) {
        process.stdout.write("--parallel cannot be used with a manual target.\n");
        process.exitCode = 1;
        return;
      }

      await withProjectExecRunLock(opts, "run", async () => {
        // Register-item run: in place (default) or in a worktree (--worktree), with state tracked
        // via register transitions (start → review / waiting) instead of exec events.
        if (hasRegister) {
          await runRegisterMode(opts);
          return;
        }

        if (hasJob) {
          await runJobMode(opts);
          return;
        }

        // In-place manual run (default): generate the plan on demand and run in the
        // current repository. No validate/refresh pass — that is orchestration only.
        if (isManual && !opts.worktree) {
          await runInPlaceMode(opts);
          return;
        }

        process.stdout.write("[run] validate...\n");
        if (!spawnValidate(opts.project)) {
          process.stdout.write("[run] validate failed — exit\n");
          process.exitCode = 1;
          return;
        }
        process.stdout.write("[run] validate: ok\n[run] refresh...\n");
        if (!spawnRefresh(opts.project)) {
          process.stdout.write("[run] refresh failed — exit\n");
          process.exitCode = 1;
          return;
        }
        process.stdout.write("[run] refresh: ok\n");

        if (isBatch) {
          await runBatchMode(opts);
        } else {
          await runManualMode(opts);
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      process.stdout.write(message + "\n");
      process.exitCode = 1;
    }
  });
}

export type CycleScheduleRebuildResult = {
  status: "not-needed" | "success" | "failure";
  tracks: string[];
};

type CycleScheduleRebuildDependencies = {
  buildTrack?: (track: string) => boolean | Promise<boolean>;
  write?: (message: string) => void;
};

// Rebuild only generated tracks whose strategy input is missing a generated track or has a newer
// mtime. The same structured detector feeds exec validate warnings, keeping manual validation and
// cycle automation on one freshness rule. No output is emitted when every track is fresh.
export async function rebuildStaleGeneratedTracksForCycle(
  schedulePath: string,
  projectId: string | undefined,
  dryRun: boolean,
  dependencies: CycleScheduleRebuildDependencies = {},
): Promise<CycleScheduleRebuildResult> {
  const staleTracks = findStaleGeneratedTracks(schedulePath);
  if (staleTracks.length === 0) return { status: "not-needed", tracks: [] };

  const write = dependencies.write ?? ((message: string) => process.stdout.write(message));
  const buildTrack =
    dependencies.buildTrack ?? ((track: string) => spawnScheduleBuild(projectId, track));
  const tracks: string[] = [];

  for (const stale of staleTracks) {
    const projectArgs = projectId ? ` --project ${projectId}` : "";
    if (dryRun) {
      write(`  [dry-run] specdojo schedule build --track ${stale.track} --force${projectArgs}\n`);
      tracks.push(stale.track);
      continue;
    }

    write(
      `[cycle] step 3/5: rebuild stale schedule track ${basename(stale.strategyFile)} (${stale.reason})\n`,
    );
    if (!(await buildTrack(stale.track))) {
      write(`[cycle] schedule build failed for track ${stale.track} — aborting auto step\n`);
      return { status: "failure", tracks: [...tracks, stale.track] };
    }
    tracks.push(stale.track);
  }

  return { status: "success", tracks };
}

// exec cycle: run limit-resume, doc-index rebuild, stale schedule rebuild, schedule refresh, and
// the auto loop as one
// ordered sequence while holding a single project exec-run lock for the whole run. Ordering does
// not depend on routine file order or cron time offsets, and no manual run / other routine / CI
// can interleave between the steps. The individual steps (runResumeMode, index build,
// schedule build, validate/refresh, runBatchMode) do not acquire the exec-run lock themselves, so
// the later steps never busy-skip against this run's own lock.
//
// Step failure policy (fixed and documented so results are predictable):
//   - resume:  a re-deferred or failed limit task must not block Ready tasks, so a resume failure
//              is recorded but the cycle still proceeds to index/refresh + auto.
//   - index:   doc-index feeds wikilink/ID resolution for Ready task plans; if it fails, tasks may
//              reference deliverables the previous cycle just created but cannot resolve them
//              reliably, so the cycle aborts the remaining steps.
//   - schedule: stale generated tracks must be rebuilt before validation/refresh; if any build
//               fails, the cycle stops instead of selecting tasks from an old track.
//   - refresh: validate/refresh feeds ready.json; if it fails the auto step cannot select tasks
//              safely, so the cycle aborts the remaining step.
//   - auto:    failures are recorded; nothing runs after it.
// The cycle exits non-zero when any executed step failed. Busy at start is handled by the shared
// exec-run lock (--if-busy skip records a routine "skipped"; wait/fail behave as for run/resume).
async function runCycleMode(opts: RunOpts): Promise<void> {
  const resolvedPaths = resolveProjectPaths({ project: opts.project });
  const projectId = resolvedPaths.projectId ?? opts.project;
  const dryRun = !!opts.dryRun;
  const stepOutcomes: string[] = [];
  let anyFailure = false;

  // runResumeMode / runBatchMode report failure via process.exitCode. Read and reset it around
  // each step so one step's exit code cannot leak into the next step's outcome.
  const takeStepFailure = (): boolean => {
    const failed = process.exitCode !== undefined && process.exitCode !== 0;
    process.exitCode = 0;
    return failed;
  };

  // Step 1/5: resume due deferred-limit tasks.
  process.stdout.write("[cycle] step 1/5: resume due deferred-limit tasks\n");
  process.exitCode = 0;
  await runResumeMode({ ...opts, due: true });
  if (takeStepFailure()) {
    anyFailure = true;
    stepOutcomes.push("resume=failure");
    process.stdout.write("[cycle] resume reported failures — continuing to run Ready tasks\n");
  } else {
    stepOutcomes.push("resume=success");
  }

  // Step 2/5: rebuild doc-index before recalculating schedule state, so deliverables created by
  // the resume step, or left unindexed by a prior cycle run, are resolvable before Ready
  // selection instead of only becoming resolvable on a later, out-of-band index build.
  process.stdout.write("[cycle] step 2/5: rebuild doc index\n");
  if (dryRun) {
    process.stdout.write("  [dry-run] specdojo index build\n");
    stepOutcomes.push("index=success");
  } else if (!spawnIndexBuild()) {
    stepOutcomes.push("index=failure");
    process.stdout.write("[cycle] index build failed — aborting auto step\n");
    process.stdout.write(`[cycle] summary: ${stepOutcomes.join(", ")}\n`);
    process.exitCode = 1;
    return;
  } else {
    stepOutcomes.push("index=success");
  }

  // Step 3/5 is conditional: regenerate only stale/missing generated tracks. It intentionally
  // emits nothing and adds nothing to the summary when no rebuild is needed.
  const rebuild = await rebuildStaleGeneratedTracksForCycle(
    resolvedPaths.schedulePath,
    projectId,
    dryRun,
  );
  if (rebuild.status === "failure") {
    stepOutcomes.push("schedule=failure");
    process.stdout.write(`[cycle] summary: ${stepOutcomes.join(", ")}\n`);
    process.exitCode = 1;
    return;
  }
  if (rebuild.status === "success") stepOutcomes.push("schedule=success");

  // Step 4/5: validate + refresh schedule state before selecting Ready tasks.
  process.stdout.write("[cycle] step 4/5: validate + refresh schedule state\n");
  if (dryRun) {
    process.stdout.write("  [dry-run] specdojo exec validate\n");
    process.stdout.write("  [dry-run] specdojo exec refresh\n");
    stepOutcomes.push("refresh=success");
  } else if (!spawnValidate(projectId)) {
    stepOutcomes.push("refresh=failure(validate)");
    process.stdout.write("[cycle] validate failed — aborting auto step\n");
    process.stdout.write(`[cycle] summary: ${stepOutcomes.join(", ")}\n`);
    process.exitCode = 1;
    return;
  } else if (!spawnRefresh(projectId)) {
    stepOutcomes.push("refresh=failure(refresh)");
    process.stdout.write("[cycle] refresh failed — aborting auto step\n");
    process.stdout.write(`[cycle] summary: ${stepOutcomes.join(", ")}\n`);
    process.exitCode = 1;
    return;
  } else {
    stepOutcomes.push("refresh=success");
  }

  // Step 5/5: run Ready tasks (auto loop). In dry-run the refresh above is skipped, so ready.json
  // may be stale/absent; preview the planned auto invocation instead of reading the cache.
  process.stdout.write("[cycle] step 5/5: run Ready tasks (--auto)\n");
  if (dryRun) {
    const autoArgs = ["exec", "run", "--auto"];
    if (projectId) autoArgs.push("--project", projectId);
    if (opts.strategy) autoArgs.push("--strategy", opts.strategy);
    if (opts.parallel) autoArgs.push("--parallel", opts.parallel);
    if (opts.executorBy) autoArgs.push("--executor-by", opts.executorBy);
    if (opts.reporterBy) autoArgs.push("--reporter-by", opts.reporterBy);
    if (opts.loop) {
      autoArgs.push("--loop");
      if (opts.maxRounds) autoArgs.push("--max-rounds", opts.maxRounds);
    }
    process.stdout.write(`  [dry-run] specdojo ${autoArgs.join(" ")}\n`);
    stepOutcomes.push("auto=success");
  } else {
    process.exitCode = 0;
    await runBatchMode({ ...opts, auto: true, cycleRebuildStaleTracks: true });
    if (takeStepFailure()) {
      anyFailure = true;
      stepOutcomes.push("auto=failure");
    } else {
      stepOutcomes.push("auto=success");
    }
  }

  process.stdout.write(`[cycle] summary: ${stepOutcomes.join(", ")}\n`);
  if (anyFailure) process.exitCode = 1;
}

export function registerCycleCommand(exec: Command): void {
  const cmd = exec
    .command("cycle")
    .description(
      "Run limit-resume, doc-index rebuild, stale track rebuild, schedule refresh, and the --auto loop as one ordered sequence under a single project lock",
    );

  cmd.option("--project <projectId>", "Project id in .specdojo/specdojo.config.json");
  cmd.option(
    "--strategy <s>",
    "Task selection strategy for the auto step: critical-first|fifo (default: critical-first)",
  );
  cmd.option("--parallel <n>", "Number of tasks to resume / run in parallel", "1");
  cmd.option("--loop", "Repeat the auto step until no Ready tasks remain", false);
  cmd.option("--max-rounds <n>", "Maximum number of auto rounds when using --loop");
  cmd.option(
    "--edit-by <nickname>",
    "pm-members.yaml agent nickname for edit-mode tasks (resume + auto)",
  );
  cmd.option(
    "--review-by <nickname>",
    "pm-members.yaml agent nickname for review-mode tasks (resume + auto)",
  );
  cmd.option(
    "--executor-by <nickname>",
    "pm-members.yaml executor agent nickname for pipeline tasks (resume + auto)",
  );
  cmd.option(
    "--reporter-by <nickname>",
    "pm-members.yaml reporter agent nickname for pipeline tasks (resume + auto)",
  );
  cmd.option("--worktree-base <path>", "Override worktree base directory");
  cmd.option(
    "--exec-defaults <path>",
    "Path to exec-defaults.yaml global config (default: .specdojo/exec-defaults.yaml)",
  );
  cmd.option(
    "--if-busy <policy>",
    "When another exec is running for the project: skip|wait|fail (default: fail)",
    "fail",
  );
  cmd.option("--dry-run", "Print resolved steps without executing", false);

  cmd.action(async (opts: RunOpts) => {
    try {
      await withProjectExecRunLock(opts, "cycle", () => runCycleMode(opts));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      process.stdout.write(message + "\n");
      process.exitCode = 1;
    }
  });
}

// Resume tasks left in "doing" state by an interrupted run. Unlike --auto (which selects from
// ready.json and provably excludes "doing"/"blocked" tasks), resume folds the event log to find
// in-flight tasks and re-runs each on its existing worktree, reusing the claiming actor and the
// partially-filled result (scaffoldResult is idempotent; the worktree is reused). No validate/build
// pass — selection comes from events, not the generated cache.
async function runResumeMode(opts: RunOpts): Promise<void> {
  const resolvedPaths = resolveProjectPaths({ project: opts.project });
  activateResolvedProjectPaths(resolvedPaths);
  const { schedulePath, executionPath, catalogPath, rolesPath, viewpointsPath, projectContext } =
    resolvedPaths;
  const projectId = resolvedPaths.projectId ?? opts.project;
  const planGenPaths: PlanGenPaths = { catalogPath, rolesPath, viewpointsPath, projectContext };
  const repoRoot = specdojoRootDir();
  const worktreeBase = resolveWorktreeBase(
    repoRoot,
    opts.worktreeBase,
    configuredWorktreeBase(schedulePath),
  );
  const parallel = parseParallel(opts.parallel);
  const dryRun = !!opts.dryRun;
  const execDefaults = loadExecDefaultsConfig(
    resolveExecDefaultsPath(opts, schedulePath),
    executionPath,
  );
  const roster = loadRosterForExecutionPath(executionPath);
  const { localIdToPhaseSets, phaseSetSuffixToId } = buildTaskPhaseMap(schedulePath);

  // Resolve current state from the event log (not the state.json cache) so freshly claimed/blocked
  // tasks within a just-interrupted run are reflected.
  const schedule = buildScheduleIndex(schedulePath);
  const events = readAllEventFiles(schedulePath);
  const initTasks = buildInitialStateFromStrategy(schedulePath, schedule);
  let snapshot = foldEventsToState(events, schedule, schedulePath, initTasks);
  let doingIds: string[];

  if (opts.due) {
    let lockDir = "";
    try {
      lockDir = acquireSchedulerLock(schedulePath, {
        actor: opts.by ?? "exec-limit-resume",
        lockTimeoutMs: 10_000,
        lockStaleMs: 300_000,
      });
      // Re-fold after acquiring the scheduler lock. A concurrent routine may have already
      // unblocked the task; only tasks that are still blocked and due are claimed below.
      const lockedEvents = readAllEventFiles(schedulePath);
      snapshot = foldEventsToState(lockedEvents, schedule, schedulePath, initTasks);
      let dueTasks = selectDueDeferredLimitTasks(snapshot);
      if (opts.task) dueTasks = dueTasks.filter((task) => task.taskId === opts.task);
      doingIds = dueTasks.map((task) => task.taskId);

      if (!dryRun) {
        for (const task of dueTasks) {
          const existingMeta = snapshot.tasks[task.taskId]?.meta ?? {};
          const meta = Object.entries(existingMeta).map(
            ([key, value]) => `${key}=${String(value)}`,
          );
          meta.push("limit_resume_claimed=true");
          const event = buildEvent("unblock", {
            task: task.taskId,
            by: task.actor || "exec-limit-resume",
            msg: `automatic limit resume due at ${task.resumeAt}`,
            meta,
          });
          writeEventFile(schedulePath, event);
        }
      }
      // Use the post-unblock state for actor/command resolution below. In dry-run mode this is
      // only an in-memory projection; otherwise it mirrors the events just written.
      for (const task of dueTasks) {
        snapshot.tasks[task.taskId] = {
          ...snapshot.tasks[task.taskId],
          state: "doing",
          last_by: task.actor || "exec-limit-resume",
          last_type: "unblock",
        };
      }
    } finally {
      if (lockDir) releaseSchedulerLock(lockDir);
    }
  } else {
    doingIds = Object.entries(snapshot.tasks)
      .filter(([, st]) => st.state === "doing")
      .map(([id]) => id)
      .sort();

    if (opts.task) {
      const taskState = snapshot.tasks[opts.task];
      const canResumeBlockedReporter =
        taskState?.state === "blocked" &&
        taskState.meta?.pipeline_stage === "reporter" &&
        typeof taskState.meta?.pipeline_state_ref === "string";
      if (canResumeBlockedReporter) {
        const actor = taskState.last_by ?? opts.by ?? "exec-pipeline-resume";
        if (!dryRun) {
          const meta = Object.entries(taskState.meta ?? {}).map(
            ([key, value]) => `${key}=${String(value)}`,
          );
          meta.push("pipeline_resume_claimed=true");
          writeEventFile(
            schedulePath,
            buildEvent("unblock", {
              task: opts.task,
              by: actor,
              msg: "resume reporter from persisted pipeline state",
              meta,
            }),
          );
        }
        snapshot.tasks[opts.task] = {
          ...taskState,
          state: "doing",
          last_by: actor,
          last_type: "unblock",
        };
      } else if (taskState?.state !== "doing") {
        process.stdout.write(
          `[resume] ${opts.task} is not resumable (state: ${taskState?.state ?? "unknown"}) — nothing to resume.\n`,
        );
        process.exitCode = 1;
        return;
      }
      doingIds = [opts.task];
    }
  }

  if (doingIds.length === 0) {
    process.stdout.write(
      opts.due
        ? "[resume] no due deferred-limit tasks — exit\n"
        : '[resume] no "doing" tasks to resume — exit\n',
    );
    return;
  }

  process.stdout.write(
    opts.due
      ? `[resume] ${doingIds.length} due deferred-limit task(s): ${doingIds.join(", ")}\n`
      : `[resume] ${doingIds.length} doing task(s): ${doingIds.join(", ")}\n`,
  );

  for (let offset = 0; offset < doingIds.length; offset += parallel) {
    const batch = doingIds.slice(offset, offset + parallel);
    const preparedTasks: PreparedTask[] = [];
    for (const taskId of batch) {
      try {
        const task = buildTaskView(schedulePath, executionPath, taskId);
        const resolved = resolveClaimingActor(snapshot.tasks[taskId], opts.by);
        const prepared = await prepareSingleTask(
          task,
          projectId,
          repoRoot,
          schedulePath,
          executionPath,
          roster,
          localIdToPhaseSets,
          phaseSetSuffixToId,
          resolved.actor,
          { edit: opts.editBy, review: opts.reviewBy },
          { executor: opts.executorBy, reporter: opts.reporterBy },
          resolved.actor,
          dryRun,
          true, // skipClaim: the task is already "doing" and remains claimed
          worktreeBase,
          planGenPaths,
          execDefaults,
          undefined,
          {
            stage:
              snapshot.tasks[taskId]?.meta?.pipeline_stage === "reporter"
                ? "reporter"
                : snapshot.tasks[taskId]?.meta?.pipeline_stage === "executor"
                  ? "executor"
                  : undefined,
            stateRef:
              typeof snapshot.tasks[taskId]?.meta?.pipeline_state_ref === "string"
                ? snapshot.tasks[taskId]?.meta?.pipeline_state_ref
                : undefined,
          },
        );
        if (typeof prepared !== "string") {
          const attempts = snapshot.tasks[taskId]?.meta?.limit_attempts;
          prepared.priorLimitAttempts =
            typeof attempts === "string" && /^\d+$/.test(attempts)
              ? Number.parseInt(attempts, 10)
              : 0;
          preparedTasks.push(prepared);
        } else if (prepared === "failure") process.exitCode = 1;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        process.stderr.write(`[resume] setup error for ${taskId}: ${message}\n`);
        if (opts.due && !dryRun) {
          spawnBlock(
            projectId,
            taskId,
            snapshot.tasks[taskId]?.last_by ?? "exec-limit-resume",
            `resume setup error: ${message}`,
          );
        }
        process.exitCode = 1;
      }
    }

    if (preparedTasks.length === 0) continue;

    const settled = await Promise.allSettled(
      preparedTasks.map((prepared) =>
        runPreparedTask(
          prepared,
          projectId,
          repoRoot,
          schedulePath,
          executionPath,
          catalogPath,
          execDefaults,
          dryRun,
        ),
      ),
    );
    for (const [index, result] of settled.entries()) {
      if (result.status === "rejected") {
        const prepared = preparedTasks[index];
        const message =
          result.reason instanceof Error ? result.reason.message : String(result.reason);
        process.stderr.write(`[resume] error: ${prepared.worktree.name}: ${message}\n`);
        if (!dryRun) {
          const completedAt = new Date().toISOString();
          if (prepared.resultPath)
            await updateResultStatus(prepared.resultPath, "blocked", completedAt);
          spawnBlock(projectId, prepared.task.id, prepared.actor, `runner error: ${message}`);
        }
        process.exitCode = 1;
      } else if (result.value === "failure") {
        process.exitCode = 1;
      }
    }
  }
}

export function registerResumeCommand(exec: Command): void {
  const cmd = exec
    .command("resume")
    .description(
      'Resume tasks left in "doing" state, or due deferred-limit tasks, on existing worktrees',
    );

  cmd.option("--project <projectId>", "Project id in .specdojo/specdojo.config.json");
  cmd.option("--task <taskId>", 'Resume only this task ("doing", or due with --due)');
  cmd.option(
    "--due",
    "Atomically claim and resume only retryable limit blocks whose resume time has arrived",
    false,
  );
  cmd.option(
    "--by <nickname>",
    "Select a pm-members.yaml agent (default: the agent that claimed the task)",
  );
  cmd.option(
    "--edit-by <nickname>",
    "pm-members.yaml agent nickname for edit-mode tasks (overrides the claiming actor)",
  );
  cmd.option(
    "--review-by <nickname>",
    "pm-members.yaml agent nickname for review-mode tasks (overrides the claiming actor)",
  );
  cmd.option(
    "--executor-by <nickname>",
    "pm-members.yaml executor agent nickname for pipeline tasks",
  );
  cmd.option(
    "--reporter-by <nickname>",
    "pm-members.yaml reporter agent nickname for pipeline tasks",
  );
  cmd.option("--parallel <n>", "Number of tasks to resume in parallel", "1");
  cmd.option("--worktree-base <path>", "Override worktree base directory");
  cmd.option(
    "--exec-defaults <path>",
    "Path to exec-defaults.yaml global config (default: .specdojo/exec-defaults.yaml)",
  );
  cmd.option(
    "--if-busy <policy>",
    "When another exec is running for the project: skip|wait|fail (default: fail)",
    "fail",
  );
  cmd.option("--dry-run", "Print resolved commands without executing", false);

  cmd.action(async (opts: RunOpts) => {
    try {
      if (opts.by && opts.executorBy) {
        process.stdout.write("Specify either --by or --executor-by, not both.\n");
        process.exitCode = 1;
        return;
      }
      await withProjectExecRunLock(opts, "resume", () => runResumeMode(opts));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      process.stdout.write(message + "\n");
      process.exitCode = 1;
    }
  });
}
