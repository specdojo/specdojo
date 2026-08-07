import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
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
import { buildScheduleIndex } from "./exec-schedule.js";
import { buildInitialStateFromStrategy } from "./exec-schedule-initial.js";
import { readReadySnapshot } from "./exec-schedule-ready.js";
import { listFilesRecursive, qualifyTaskId, readYaml } from "./exec-shared.js";
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
import type { CurrentState, Proficiency, TaskMode } from "./exec-types.js";
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
  type RegisterFailureMode,
  type RegisterItemSummary,
  type RegisterItemTransition,
} from "./exec-register.js";
import type { PjrItem, RegisterPaths } from "./register.js";
import { isResultUnfilled, scaffoldResult, updateResultStatus } from "./exec-results.js";
import { completeJobRun, materializeJobRun } from "./job.js";
import {
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
  buildPhaseModeIndex,
  resolveApproach,
  resolveTaskCapabilities,
  resolveTaskExecution,
  resolveTaskMode,
  resolveTaskProficiency,
} from "./exec-strategy.js";

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
  worktree?: boolean;
  trackState?: boolean;
  archiveOnSuccess?: boolean;
  editBy?: string;
  reviewBy?: string;
  loop?: boolean;
  maxRounds?: string;
  parallel?: string;
  worktreeBase?: string;
  due?: boolean;
  ifBusy?: string;
};

type RunResult = "success" | "rate_limit" | "failure";

// Mode-specific agent overrides from --edit-by / --review-by. Each value is an agent
// nickname (not a raw command); the command is resolved from pm-members.yaml. undefined means
// "auto-select for that mode".
export type ModeAgentOverrides = {
  edit?: string;
  review?: string;
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
): AgentOverrideResolution {
  const nickname =
    agentNicknameOverride ??
    (mode === "review" ? modeAgentOverrides.review : modeAgentOverrides.edit);
  if (!nickname) return { kind: "none" };

  const flag = agentNicknameOverride ? "--by" : mode === "review" ? "--review-by" : "--edit-by";
  const member = roster?.members.find((m) => m.type === "agent" && m.nickname === nickname);
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
};

type PreparedTask = {
  task: ReadyTaskView;
  actor: string;
  agentCandidates: AgentRunCandidate[];
  prompt: string;
  worktree: ExecWorktree;
  resultPath?: string;
  priorLimitAttempts?: number;
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
  const localId = task.local_id;
  if (!localId) return null;

  const suffix = task.phase_suffix ?? extractPhaseSuffix(task.id);
  if (!suffix) return null;

  if (task.phase_set && task.phase_id) {
    return { localId, phaseSet: task.phase_set, phaseId: task.phase_id };
  }

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
  const { capabilities: required, proficiency } = requirements;
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
  commandLabel: "run" | "resume",
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
  stderr: string;
  limit?: AgentLimitSignal;
}> {
  if (!agentCommand.trim()) {
    return { result: "failure", exitCode: null, stderr: "Empty agent command" };
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
      stderr,
      limit: normalizeAgentLimit({
        output: combinedOutput,
        provider,
        cooldownSeconds,
      }),
    };
  }
  if (exitCode !== 0) {
    return { result: "failure", exitCode, stderr };
  }
  return { result: "success", exitCode: 0, stderr: "" };
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
): Promise<{ result: RunResult; stderr: string; attempts: number; limit?: AgentLimitSignal }> {
  const policy = resolveRateLimitPolicy(execDefaults, candidates[0]?.provider);
  let attempts = 0;

  // One pass tries every candidate in priority order with no wait between switches.
  const runPass = async (): Promise<{
    result: RunResult;
    stderr: string;
    limit?: AgentLimitSignal;
  }> => {
    let lastStderr = "";
    let lastLimit: AgentLimitSignal | undefined;
    for (let idx = 0; idx < candidates.length; idx++) {
      if (idx > 0) {
        process.stdout.write(
          `Rate limit detected. Switching to next agent (${idx + 1}/${candidates.length})...\n`,
        );
      }
      const detection = resolveRateLimitDetection(execDefaults, candidates[idx].provider);
      attempts++;
      const attempt = await executeAgent(
        candidates[idx].command,
        prompt,
        detection,
        candidates[idx].provider,
        policy?.cooldown_seconds,
        cwd,
        env,
      );
      lastStderr = attempt.stderr;
      lastLimit = attempt.limit;
      if (attempt.result !== "rate_limit")
        return { result: attempt.result, stderr: attempt.stderr };
    }
    return { result: "rate_limit", stderr: lastStderr, limit: lastLimit };
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
    lastLimit = result.limit;
    if (result.result !== "rate_limit") return { ...result, attempts };

    waitSeconds = Math.min(waitSeconds * retry.backoff_multiplier, retry.max_wait_seconds);
  }

  process.stdout.write(
    `Rate limit: all ${candidates.length} agent(s) exhausted after ${retry.max_attempts} attempt(s).\n`,
  );
  return { result: "rate_limit", stderr: lastStderr, attempts, limit: lastLimit };
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
  actorOverride: string | undefined,
  dryRun: boolean,
  skipClaim: boolean,
  worktreeBase: string,
  planGenPaths: PlanGenPaths,
  execDefaults: ExecDefaultsConfig,
  hasProviderCapacity?: (provider?: AgentProvider) => boolean,
): Promise<PreparedTask | RunResult | "deferred"> {
  const mode = task.mode ?? "edit";
  process.stdout.write(`Task: ${task.id}${task.name ? ` — ${task.name}` : ""}  [${mode}]\n`);

  // Mode-specific overrides (--edit-by / --review-by) let nightly batch runs route edit and
  // review to different agents (e.g. local LLMs) without editing the roster. They take an agent
  // nickname whose command is resolved from pm-members.yaml; a mode without an override falls back
  // to normal auto-selection.
  const overrideResolution = resolveAgentOverride(
    mode,
    agentNicknameOverride,
    modeAgentOverrides,
    roster,
    execDefaults,
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

    const requirements: ResolvedRequirements = {
      capabilities: task.capabilities ?? [],
      proficiency: task.proficiency,
    };

    const busyActors = collectBusyActors(schedulePath);
    const candidates = selectCandidates(requirements, roster, mode, busyActors, execDefaults);
    if (candidates.length === 0) {
      process.stdout.write(
        `  No agents found for mode: ${mode}, capabilities: [${requirements.capabilities.join(", ")}]${requirements.proficiency ? `, proficiency: ${requirements.proficiency}` : ""}\n`,
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

  const prompt = loadPrompt(executionPath, task.id);
  if (!prompt) {
    process.stdout.write(`  Plan not found for ${task.id}.\n`);
    return "failure";
  }

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
      prompt,
      worktree,
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
    prompt,
    worktree,
    resultPath,
  };
}

// An agent can exit 0 without doing the work (e.g. a permission-denied tool call is fed back as a
// tool error and the model ends its turn normally). The agent's core duty is to fill the result, so
// treat a still-scaffold result (mandatory sections left as _TODO_) as a block even on exit 0. This
// mirrors the in-place guard in runInPlaceMode; on the worktree path it also prevents an empty task
// from being committed, merged, and unblocking downstream tasks. Only a successful run is reconsidered;
// rate-limit and failure outcomes pass through unchanged.
export function downgradeUnfilledResult(
  agentResult: RunResult,
  resultPath: string | undefined,
  mode: TaskMode,
): { result: RunResult; unfilledBlock: boolean } {
  if (agentResult === "success" && resultPath && isResultUnfilled(resultPath, mode)) {
    return { result: "failure", unfilledBlock: true };
  }
  return { result: agentResult, unfilledBlock: false };
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

  process.stdout.write(`  Running: ${prepared.agentCandidates[0]?.command ?? ""}\n`);
  process.stdout.write(`  CWD: ${prepared.worktree.path}\n`);
  const { result, stderr, attempts, limit } = await runWithRetry(
    prepared.agentCandidates,
    prepared.prompt,
    execDefaults,
    prepared.worktree.path,
    agentEnvironment(repoRoot, prepared.worktree.path, schedulePath, executionPath),
  );

  const finalize = async (): Promise<RunResult> => {
    const completedAt = new Date().toISOString();
    const context = {
      repoRoot,
      schedulePath,
      executionPath,
      ...(catalogPath ? { catalogPath } : {}),
    };
    const worktreeResultPath = prepared.resultPath
      ? pathInsideWorktree(repoRoot, prepared.worktree.path, prepared.resultPath)
      : undefined;

    const { result: effectiveResult, unfilledBlock } = downgradeUnfilledResult(
      result,
      worktreeResultPath,
      prepared.task.mode ?? "edit",
    );

    if (effectiveResult === "success") {
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
      const totalAttempts = (prepared.priorLimitAttempts ?? 0) + attempts;
      const reason = limit
        ? `${limit.kind} reached${limit.resume_at ? `; resume_at=${limit.resume_at}` : ""}`
        : "rate limit reached";
      if (worktreeResultPath)
        await updateResultStatus(worktreeResultPath, "blocked", completedAt, reason);
      spawnBlock(
        projectId,
        prepared.task.id,
        prepared.actor,
        reason,
        limit
          ? limitEventMeta(limit, {
              attempts: totalAttempts,
              worktree: prepared.worktree.path,
            })
          : { limit_deferred: "false" },
      );
      process.stdout.write(
        limit?.auto_resume
          ? `  Deferred: ${prepared.task.id} until ${limit.resume_at} (worktree kept: ${prepared.worktree.path})\n`
          : `  Rate limited: ${prepared.task.id}; automatic resume unavailable (worktree kept: ${prepared.worktree.path})\n`,
      );
    } else {
      const blockReason = unfilledBlock
        ? "agent exited 0 but result mandatory sections remain unfilled (treated as blocked)"
        : extractBlockReason(stderr);
      if (worktreeResultPath)
        await updateResultStatus(worktreeResultPath, "blocked", completedAt, blockReason);
      spawnBlock(projectId, prepared.task.id, prepared.actor, blockReason);
      process.stdout.write(
        `  ${unfilledBlock ? "Blocked (result not filled)" : "Failed"}: ${prepared.task.id} (worktree kept: ${prepared.worktree.path})\n`,
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
): { command: string; actor: string } {
  const by = opts.by?.trim();
  if (by) {
    const member = roster?.members.find((m) => m.nickname === by && m.type === "agent");
    const command = member ? resolveMemberCommand(execDefaults, member) : undefined;
    if (!command) throw new Error(`Agent command not found for actor: ${by}`);
    return { command, actor: by };
  }

  if (task && (task.execution ?? "agent") === "human") {
    throw new Error(`Task requires human execution. Use --by <nickname> to override: ${task.id}`);
  }

  const candidates = selectCandidates(
    { capabilities: task?.capabilities ?? [], proficiency: task?.proficiency },
    roster,
    task?.mode ?? "edit",
    undefined,
    execDefaults,
  );
  const candidate = candidates[0];
  const command = candidate ? resolveMemberCommand(execDefaults, candidate) : undefined;
  if (!candidate || !command) throw new Error("No agent found. Specify --by <nickname>.");
  return { command, actor: candidate.nickname };
}

async function spawnAgentInPlace(
  command: string,
  prompt: string,
  cwd: string,
  schedulePath: string,
  executionPath: string,
): Promise<number> {
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
  return new Promise<number>((resolveExit) => {
    child.once("error", () => resolveExit(1));
    child.once("close", (code) => resolveExit(code ?? 1));
  });
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

  const { command, actor } = resolveInPlaceCommand(task, roster, opts, execDefaults);
  const label = slug ?? planPath;

  if (opts.dryRun) {
    process.stdout.write(`[dry-run] target: ${label} (state ignored)\n`);
    process.stdout.write(`[dry-run] command: ${command}\n`);
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

  const prompt = expandPromptRefs(readFileSync(planPath, "utf8"));

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
  }

  process.stdout.write(`Running ${label} in place: ${command}\n`);
  const exitCode = await spawnAgentInPlace(command, prompt, repoRoot, schedulePath, executionPath);

  // Some agents (notably `claude -p`) exit 0 even when they conclude they are blocked: a
  // permission-denied tool call is fed back as a tool error and the model ends its turn
  // normally. The agent's core duty is to fill the result, so treat a still-scaffold result
  // (mandatory sections left as _TODO_) as a block even on exit 0.
  let effectiveExit = exitCode;
  let blockReason: string | undefined;
  if (exitCode === 0 && resultPath && task && isResultUnfilled(resultPath, task.mode ?? "edit")) {
    effectiveExit = 1;
    blockReason =
      "agent exited 0 but result mandatory sections remain unfilled (treated as blocked)";
    process.stdout.write(`run blocked: ${label} (result not filled despite exit 0)\n`);
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
  if (exitCode === 0 && isResultUnfilled(resultPath, record.task.mode)) {
    effectiveExit = 1;
    reason = "agent exited 0 but result mandatory sections remain unfilled (treated as blocked)";
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
): string[] {
  const exact = new Set(
    [registerPaths.pjrIndexPath, planPath, resultPath].map((path) =>
      repoRelativePath(repoRoot, path),
    ),
  );
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
  requireRunnableRegisterItem(item);

  const { command, actor } = resolveRegisterCommand(
    item,
    context.roster,
    opts,
    context.execDefaults,
  );
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
  const { resultPath } = await scaffoldResult({
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

  process.stdout.write(`Register item: ${item.id} — ${item.title}  [${item.type}]\n`);
  process.stdout.write(`  Agent: ${actor}\n`);
  if (!spawnRegisterTransition(projectId, ["start", "--id", item.id])) {
    throw new Error(`register start failed: ${item.id}`);
  }

  process.stdout.write(`Running ${item.id} in place: ${command}\n`);
  const exitCode = await spawnAgentInPlace(command, prompt, repoRoot, schedulePath, executionPath);

  // in-place 実行と同じ補助判定: agent が result 必須節を埋めずに終了コード 0 で
  // 終わった場合は block として扱う（runInPlaceMode と同じ理由）。
  let effectiveExit = exitCode;
  let blockReason: string | undefined;
  if (exitCode === 0 && isResultUnfilled(resultPath, "edit")) {
    effectiveExit = 1;
    blockReason =
      "agent exited 0 but result mandatory sections remain unfilled (treated as blocked)";
    process.stdout.write(`run blocked: ${item.id} (result not filled despite exit 0)\n`);
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
      );
      try {
        const result = commitRegisterItemChanges(repoRoot, item, preexisting, runnerManaged);
        if (result.committed) commit = `committed ${result.sha}`;
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        const commitReason = sanitizeRegisterConclusion(`register commit incomplete: ${detail}`);
        process.stderr.write(`run commit failed: ${item.id}: ${detail}\n`);
        if (
          spawnRegisterTransition(projectId, [
            "wait",
            "--id",
            item.id,
            "--conclusion",
            commitReason,
          ])
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

  const conclusion = sanitizeRegisterConclusion(
    blockReason ?? `agent exited with non-zero code (exit ${exitCode})`,
  );
  if (!spawnRegisterTransition(projectId, ["wait", "--id", item.id, "--conclusion", conclusion])) {
    process.stderr.write(`register wait transition failed: ${item.id}\n`);
  }
  process.stdout.write(`run failed: ${item.id} (exit ${effectiveExit}; status: waiting)\n`);
  return {
    id: item.id,
    title: item.title,
    outcome: "failure",
    transition: "waiting",
    commit: context.registerCommit ? "skipped" : "off",
    reason: conclusion,
  };
}

// register の状態遷移（start/review/wait）が変更した調整状態（pjr-index と派生ビュー）だけを
// 抽出する。worktree モードでは各遷移を root（統合ブランチ）へ commit して作業ツリーを清潔に
// 保ち、後続 ID・並列実行の checkpoint / merge と干渉させない。plan/result は checkpoint と
// worktree merge が扱うため、ここでは含めない。
export function registerStatePaths(repoRoot: string, registerPaths: RegisterPaths): string[] {
  const changed = worktreeStatusPaths(repoRoot);
  const pjrRel = repoRelativePath(repoRoot, registerPaths.pjrIndexPath);
  const prefixes = [registerPaths.generatedPath, registerPaths.controlsGeneratedPath].map(
    (path) => `${repoRelativePath(repoRoot, path)}/`,
  );
  const selected = new Set<string>();
  for (const path of changed) {
    const normalized = path.replaceAll("\\", "/");
    if (normalized === pjrRel || prefixes.some((prefix) => normalized.startsWith(prefix))) {
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
): void {
  const paths = registerStatePaths(repoRoot, registerPaths);
  if (paths.length === 0) return;
  gitOutput(repoRoot, ["add", "--", ...paths]);
  const staged = gitResult(repoRoot, ["diff", "--cached", "--quiet", "--", ...paths]);
  if (staged.status === 0) return;
  if (staged.status !== 1) throw new Error("Failed to inspect staged register-state changes.");
  gitOutput(repoRoot, ["commit", "-m", message, "--", ...paths]);
  stabilizeCommitTargets(repoRoot, () => registerStatePaths(repoRoot, registerPaths));
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
  requireRunnableRegisterItem(item);

  const { command, actor } = resolveRegisterCommand(
    item,
    context.roster,
    opts,
    context.execDefaults,
  );
  const provider = context.roster?.members.find(
    (m) => m.nickname === actor && m.type === "agent",
  )?.provider;
  const stem = buildInPlaceStem(pjrId.toLowerCase());
  const worktreeTaskId = qualifyTaskId(projectId, item.id);

  const waitSummary = (reason: string): RegisterItemSummary => {
    const conclusion = sanitizeRegisterConclusion(reason);
    let transition: RegisterItemTransition = "waiting";
    if (
      !spawnRegisterTransition(projectId, ["wait", "--id", item.id, "--conclusion", conclusion])
    ) {
      process.stderr.write(`register wait transition failed: ${item.id}\n`);
      transition = "none";
    } else {
      commitRegisterState(repoRoot, registerPaths, `exec(register ${item.id}): wait`);
    }
    return {
      id: item.id,
      title: item.title,
      outcome: "failure",
      transition,
      commit: "off",
      reason: conclusion,
    };
  };

  // Phase 1: plan/result 生成 → register start → checkpoint → worktree 作成（root で直列化）。
  const setup = async (): Promise<
    { worktree: ExecWorktree; resultPath: string; prompt: string } | RegisterItemSummary
  > => {
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
    const { resultPath } = await scaffoldResult({
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
      return { worktree, resultPath, prompt };
    } catch (error) {
      // checkpoint 失敗時は start を巻き戻して waiting にする（worktree は未作成）。
      return waitSummary(
        `checkpoint failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  const prepared = lifecycleLock ? await lifecycleLock.runExclusive(setup) : await setup();
  if ("outcome" in prepared) return prepared;
  const { worktree, resultPath, prompt } = prepared;

  // Phase 2: agent を worktree 内で実行（ロック外・並列可能な長時間部分）。
  process.stdout.write(`Running ${item.id} in worktree: ${command}\n  CWD: ${worktree.path}\n`);
  const env = agentEnvironment(repoRoot, worktree.path, schedulePath, executionPath);
  const { result: agentResult, stderr } = await runWithRetry(
    [{ command, actor, provider }],
    prompt,
    context.execDefaults,
    worktree.path,
    env,
  );

  // Phase 3: 成果物統合と状態遷移（root で直列化）。
  const finalize = async (): Promise<RegisterItemSummary> => {
    const completedAt = new Date().toISOString();
    const worktreeResultPath = pathInsideWorktree(repoRoot, worktree.path, resultPath);
    const { result: effectiveResult, unfilledBlock } = downgradeUnfilledResult(
      agentResult,
      worktreeResultPath,
      "edit",
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
        commitRegisterState(repoRoot, registerPaths, `exec(register ${item.id}): review`);
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

    // 失敗 / rate limit: worktree は保持し（調査・再実行のため）、waiting へ遷移する。
    const reason = unfilledBlock
      ? "agent exited 0 but result mandatory sections remain unfilled (treated as blocked)"
      : agentResult === "rate_limit"
        ? "rate limit reached"
        : extractBlockReason(stderr);
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
  };

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

  if (opts.dryRun) {
    const modeLabel = useWorktree
      ? `worktree${parallel > 1 ? `, parallel: ${parallel}` : ", serial"}`
      : "in-place, serial";
    process.stdout.write(
      `[dry-run] register items (${modeLabel}): ${ids.join(", ")}  [on-failure: ${failureMode}, commit: ${useWorktree ? "always (worktree)" : opts.registerCommit ? "per-id" : "off"}]\n`,
    );
    for (const pjrId of ids) {
      const { item } = resolveRegisterRunTarget(projectId, pjrId);
      const category = requireRunnableRegisterItem(item);
      const { command, actor } = resolveRegisterCommand(item, roster, opts, execDefaults);
      const stem = buildInPlaceStem(pjrId.toLowerCase());
      process.stdout.write(
        `[dry-run] register item: ${item.id} — ${item.title}  [${item.type}/${category}]\n`,
      );
      process.stdout.write(`[dry-run]   actor: ${actor}\n`);
      process.stdout.write(`[dry-run]   command: ${command}\n`);
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
      runItem: (pjrId) => runSingleRegisterItemWorktree(context, opts, pjrId, lifecycleLock),
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
        ? await runSingleRegisterItemWorktree(context, opts, pjrId)
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
    "Repeat rounds until no ready tasks remain, running exec refresh between rounds",
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
      const state = snapshot.tasks[opts.task]?.state;
      if (state !== "doing") {
        process.stdout.write(
          `[resume] ${opts.task} is not in "doing" state (state: ${state ?? "unknown"}) — nothing to resume.\n`,
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
          resolved.actor,
          dryRun,
          true, // skipClaim: the task is already "doing" and remains claimed
          worktreeBase,
          planGenPaths,
          execDefaults,
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
      await withProjectExecRunLock(opts, "resume", () => runResumeMode(opts));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      process.stdout.write(message + "\n");
      process.exitCode = 1;
    }
  });
}
