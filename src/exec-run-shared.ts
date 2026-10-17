import { basename, resolve } from "node:path";
import {
  defaultExecDefaultsPath,
  hasMemberCommandSource,
  loadExecDefaultsConfig,
  resolveMaxConcurrentRuns,
  resolveMemberCommand,
  resolveRegisterExecution,
  type ExecDefaultsConfig,
  type RateLimitDetection,
} from "./exec-agent-config.js";
import { resolveProjectPaths } from "./exec-project.js";
import type { AgentLimitSignal } from "./exec-limit.js";
import { buildInitialStateFromStrategy } from "./exec-schedule-initial.js";
import { buildScheduleIndex } from "./exec-schedule.js";
import { listFilesRecursive, readYaml } from "./exec-shared.js";
import {
  getProjectSchedulePath,
  loadConfig,
  specdojoRootDir,
  type AgentProvider,
  type MemberRoster,
  type ProjectMember,
} from "./shared/specdojo-config.js";
import {
  acquireExecRunLock,
  EXEC_RUN_LOCK_TOKEN_ENV,
  execLocksDir,
  inheritsExecRunLock,
  releaseExecRunLock,
  ROUTINE_BUSY_SKIP_EXIT_CODE,
  ROUTINE_EXEC_ENV,
  type ExecRunBusyPolicy,
} from "./exec-run-lock.js";
import { getActiveExecLocksDir, setActiveExecLocksDir } from "./exec-slot-lock.js";
import { readAllEventFiles, foldEventsToState } from "./exec-events.js";
import {
  extractPhaseSuffix,
  normalizePhaseSetSelection,
  phaseSetNames,
  type PhaseSetSelection,
} from "./schedule/phase-sets.js";
import type { AgentStageRole, Proficiency } from "./exec-types.js";
import type { ReadyTaskView } from "./exec-types.js";

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
  registerFilter?: boolean;
  registerTypes?: string;
  registerPriorities?: string;
  registerStatuses?: string;
  registerLimit?: string;
  job?: string;
  input?: string | string[];
  scheduledAt?: string;
  jobTrigger?: string;
  registerCommit?: boolean;
  onFailure?: string;
  resume?: boolean;
  resumeFrom?: string;
  forceRestart?: boolean;
  worktree?: boolean;
  inPlace?: boolean;
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
  join?: boolean;
  cycleRebuildStaleTracks?: boolean;
};

export type RunResult = "success" | "rate_limit" | "failure";

export type AgentExecution = {
  result: RunResult;
  exitCode: number | null;
  stdout: string;
  stderr: string;
  limit?: AgentLimitSignal;
};

// Mode-specific agent overrides from --edit-by / --review-by. Each value is an agent
// nickname (not a raw command); the command is resolved from agent-members.yaml. undefined means
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
export type AgentRunCandidate = { command: string; actor?: string; provider?: AgentProvider };

export function pinnedExecutor(task: ReadyTaskView | null | undefined): string | undefined {
  return typeof task?.agent === "string" ? task.agent : task?.agent?.executor;
}

export function pinnedReporter(task: ReadyTaskView | null | undefined): string | undefined {
  return typeof task?.agent === "object" ? task.agent.reporter : undefined;
}

// Resolve the agent override for a task's mode. A single explicit --by nickname wins for every
// mode. Otherwise the mode-specific --edit-by / --review-by nickname applies. Commands are always
// resolved from agent-members.yaml and exec-defaults.yaml; raw command strings are not accepted.
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
      message: `${flag} agent nickname not found in agent-members.yaml (or has no resolvable command): ${nickname}`,
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

export type AsyncLock = {
  runExclusive: <T>(fn: () => Promise<T> | T) => Promise<T>;
};

export class SerialAsyncLock implements AsyncLock {
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
export function collectBusyActors(schedulePath: string): Set<string> {
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

export function resolveExecDefaultsPath(opts: RunOpts, schedulePath: string): string {
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

export function parseParallel(value: string | undefined): number {
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

export function resolveRegisterWorktree(
  opts: Pick<RunOpts, "worktree" | "inPlace">,
  execDefaults: ExecDefaultsConfig,
): boolean {
  if (opts.worktree && opts.inPlace) {
    throw new Error("Specify either --worktree or --in-place, not both.");
  }
  if (opts.worktree) return true;
  if (opts.inPlace) return false;
  return resolveRegisterExecution(execDefaults) === "worktree";
}

// How the run shares the project exec-run lock. Only register worktree runs coordinate their
// shared resources (agent slots, root lifecycle, parent validations) across processes, so only
// they may run next to other processes.
export type ExecRunLockSharing = {
  // The run tolerates `--join` runs next to it.
  shareable: boolean;
  // The run joins a running shareable run (`--join`).
  join: boolean;
};

export const EXCLUSIVE_EXEC_RUN: ExecRunLockSharing = { shareable: false, join: false };

function resolveJoinSlotLimit(opts: RunOpts, schedulePath: string, executionPath: string): number {
  const execDefaults = loadExecDefaultsConfig(
    resolveExecDefaultsPath(opts, schedulePath),
    executionPath,
  );
  return resolveMaxConcurrentRuns(execDefaults) - 1;
}

export async function withProjectExecRunLock(
  opts: RunOpts,
  commandLabel: "run" | "resume" | "cycle",
  action: () => Promise<void>,
  sharing: ExecRunLockSharing = EXCLUSIVE_EXEC_RUN,
): Promise<void> {
  const resolvedPaths = resolveProjectPaths({ project: opts.project });
  const locksDir = execLocksDir(resolvedPaths.executionPath);
  const previousLocksDir = getActiveExecLocksDir();
  if (inheritsExecRunLock(resolvedPaths.executionPath)) {
    setActiveExecLocksDir(locksDir);
    try {
      await action();
    } finally {
      setActiveExecLocksDir(previousLocksDir);
    }
    return;
  }
  const policy = parseExecRunBusyPolicy(opts.ifBusy);
  const joinLimit = sharing.join
    ? resolveJoinSlotLimit(opts, resolvedPaths.schedulePath, resolvedPaths.executionPath)
    : 0;
  if (sharing.join && joinLimit < 1) {
    throw new Error(
      "--join is disabled: run.max_concurrent_runs in exec-defaults is 1 (raise it to allow joining runs)",
    );
  }
  const handle = await acquireExecRunLock(resolvedPaths.executionPath, {
    actor: opts.by ?? `exec-${commandLabel}`,
    ifBusy: policy,
    shareable: sharing.shareable || sharing.join,
    ...(sharing.join ? { join: { limit: joinLimit } } : {}),
    onWait: () =>
      process.stdout.write(
        sharing.join
          ? `[${commandLabel}] exec busy — waiting for a join slot (see "exec slots")\n`
          : `[${commandLabel}] exec busy — waiting\n`,
      ),
  });

  if (!handle) {
    process.stdout.write(`[${commandLabel}] skipped: exec busy\n`);
    if (process.env[ROUTINE_EXEC_ENV] === "1") {
      process.exitCode = ROUTINE_BUSY_SKIP_EXIT_CODE;
    }
    return;
  }
  if (sharing.join) {
    process.stdout.write(
      `[${commandLabel}] running as a joined exec (${basename(handle.lockDir)})\n`,
    );
  }

  const previousInheritedToken = process.env[EXEC_RUN_LOCK_TOKEN_ENV];
  process.env[EXEC_RUN_LOCK_TOKEN_ENV] = handle.token;
  setActiveExecLocksDir(locksDir);
  try {
    await action();
  } finally {
    setActiveExecLocksDir(previousLocksDir);
    if (previousInheritedToken === undefined) delete process.env[EXEC_RUN_LOCK_TOKEN_ENV];
    else process.env[EXEC_RUN_LOCK_TOKEN_ENV] = previousInheritedToken;
    releaseExecRunLock(handle);
  }
}
