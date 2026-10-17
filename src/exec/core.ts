import { type Command } from "commander";
import {
  acquireSchedulerLock,
  buildEvent,
  canReleaseTask,
  collectRepeatable,
  findDoingTasksForActor,
  foldEventsToState,
  readAllEventFiles,
  releaseSchedulerLock,
  writeEventFile,
} from "./events.js";
import { activateResolvedProjectPaths, resolveProjectPaths } from "./project.js";
import {
  assertValidActor,
  loadConfig,
  loadMemberRoster,
  specdojoRootDir,
} from "../shared/specdojo-config.js";
import {
  buildScheduleIndex,
  computeCpm,
  exitWithCode,
  printValidateResult,
  validateAll,
  writeCpmFiles,
  writeGeneratedCore,
  writeScheduleHashAndDiff,
} from "./schedule/schedule.js";
import type { Approach, ExecEventType, SchedulerStrategy, TaskMode } from "./types.js";
import { qualifyTaskId, requireNonEmpty } from "./shared.js";
import { finalizeResultSectionsForDeliverable, targetDocIdsForScheduledTask } from "./plans.js";
import { resetResultForClaim, scaffoldResult } from "./results.js";
import { discardStaleExecWorktree } from "./worktree-ops.js";
import { configuredProductRepos } from "./task-repos.js";
import { buildInitialStateFromStrategy } from "./schedule/initial.js";
import {
  buildPhaseModeIndex,
  resolveApproach,
  resolveTaskExecution,
  resolveTaskMode,
} from "./strategy.js";

export const KNOWN_OWNER_LABELS = ["PO", "PM", "BA", "ARC", "DEV", "QE", "UX", "OPS"] as const;
export const KNOWN_OWNER_LABELS_TEXT = KNOWN_OWNER_LABELS.join("|");

const KNOWN_APPROACHES = [
  "fully-guided",
  "recipe-guided",
  "freeform",
  "bootstrap",
  "retrofit",
  "cross-deliverable-dedup",
  "rulebook-maintenance",
  "recipe-maintenance",
  "sample-maintenance",
  "template-maintenance",
  "finalize",
  "bootstrap-finalize",
] as const;

export function parseTaskMode(value: unknown): TaskMode {
  const mode = typeof value === "string" ? value.trim().toLowerCase() : "edit";
  if (mode !== "edit" && mode !== "review") {
    throw new Error(`Invalid --mode value: ${mode}. Use one of: edit|review.`);
  }
  return mode;
}

export function parseApproach(value: unknown): Approach {
  const approach = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (!KNOWN_APPROACHES.includes(approach as Approach)) {
    throw new Error(
      `Invalid --approach value: ${approach}. Use one of: ${KNOWN_APPROACHES.join("|")}.`,
    );
  }
  return approach as Approach;
}

export type ExecCommandOpts = {
  project?: string;
  by?: string;
  task?: string;
  msg?: string;
  ref?: string[];
  meta?: string[];
  runId?: string;
  allowMultipleDoing?: boolean;
  lockTimeoutMs?: string;
  lockStaleMs?: string;
  owner?: string;
  allowOwnerMismatch?: boolean;
  strategy?: string;
  dryRun?: boolean;
  force?: boolean;
  resetWorktree?: boolean;
  allBlocked?: boolean;
};

export type LoadedExecState = {
  schedule: ReturnType<typeof buildScheduleIndex>;
  events: ReturnType<typeof readAllEventFiles>;
  snapshot: ReturnType<typeof foldEventsToState>;
};

export type LockedEventAction = {
  type: "claim" | "complete" | "reopen" | "block" | "unblock" | "release" | "cancel";
  check: (
    state: LoadedExecState,
    taskId: string,
    actor: string,
    opts: ExecCommandOpts,
  ) => { ok: boolean; reason?: string };
  requireSingleDoing?: boolean;
};

export function addProjectOptions(cmd: Command): Command {
  return cmd.option("--project <projectId>", "Project id in specdojo.config.json (e.g. shj-0001)");
}

export function addLockOptions(cmd: Command): Command {
  return cmd
    .option("--allow-multiple-doing", "Allow this actor to hold multiple doing tasks", false)
    .option("--lock-timeout-ms <ms>", "Lock acquisition timeout in ms", "10000")
    .option("--lock-stale-ms <ms>", "Lock stale threshold in ms", "300000");
}

export function addForceOption(cmd: Command): Command {
  return cmd.option(
    "--force",
    "Human actor only: override the guard on a task held by another actor",
    false,
  );
}

export function addOwnerOptions(cmd: Command): Command {
  return cmd
    .option(
      "--owner <owner>",
      `Planned owner label for assignment checks (${KNOWN_OWNER_LABELS_TEXT}; defaults to SPECDOJO_OWNER, roster owner, or actor)`,
    )
    .option("--allow-owner-mismatch", "Allow claiming a task assigned to a different owner", false);
}

// Fixed default messages for routine state transitions. Events whose message carries the
// reason itself (note / block / unblock / reopen / cancel) have no default and keep --msg required.
export const DEFAULT_EVENT_MESSAGES: Partial<Record<ExecEventType, string>> = {
  claim: "claim task",
  complete: "complete task",
  release: "release task",
  link: "link refs",
  estimate: "update estimate",
};

export function addCommonAddOptions(
  cmd: Command,
  options?: { requireTask?: boolean; msgDefault?: string },
): Command {
  addProjectOptions(cmd);
  // `release --all-blocked` operates on every blocked task instead of a single --task, so the task
  // option must be optional for that command. The single-task path still validates it via
  // requireNonEmpty before building the event.
  if (options?.requireTask === false) {
    cmd.option("--task <taskId>", "Task/Milestone ID");
  } else {
    cmd.requiredOption("--task <taskId>", "Task/Milestone ID");
  }
  cmd.requiredOption("--by <actor>", "Actor (human/agent)");
  if (options?.msgDefault !== undefined) {
    cmd.option("--msg <message>", "Short message", options.msgDefault);
  } else {
    cmd.requiredOption("--msg <message>", "Short message");
  }
  return cmd
    .option("--run-id <id>", "Correlation id")
    .option("--ref <k=v...>", "refs key=value (repeatable)", collectRepeatable, [])
    .option("--meta <k=v...>", "meta key=value (repeatable)", collectRepeatable, [])
    .option("--dry-run", "Print event JSON without writing to disk", false);
}

export function resolveProjectContext(opts: { project?: string }): {
  schedulePath: string;
  executionPath: string;
  catalogPath?: string;
  rolesPath?: string;
  viewpointsPath?: string;
  projectContext?: string[];
} {
  const resolvedPaths = resolveProjectPaths({ project: opts.project });
  activateResolvedProjectPaths(resolvedPaths);
  return resolvedPaths;
}

export function loadRosterForOpts(opts: { project?: string }) {
  const { config } = loadConfig();
  if (!config) return null;

  const projectId = resolveProjectId(opts);
  const project = config.projects[projectId];
  if (!project) return null;

  return loadMemberRoster(specdojoRootDir(), project);
}

export function resolveProjectId(opts: { project?: string }): string {
  const { config } = loadConfig();
  return (
    opts.project?.trim() ||
    process.env.SPECDOJO_PROJECT?.trim() ||
    config?.current_project?.trim() ||
    Object.keys(config?.projects ?? {})[0] ||
    ""
  );
}

export function findRosterMember(roster: ReturnType<typeof loadRosterForOpts>, actor: string) {
  return roster?.members.find((member) => member.nickname === actor) ?? null;
}

// The --force override is honored only for actors registered as humans in the
// roster, so agents cannot steal a task another actor is working on.
export function resolveForceOverride(
  opts: ExecCommandOpts,
  actor: string,
): { isHuman: boolean; force: boolean } {
  const isHuman = findRosterMember(loadRosterForOpts(opts), actor)?.type === "human";
  return { isHuman, force: !!opts.force };
}

export function resolveClaimOwner(
  opts: { owner?: string },
  actor: string,
  roster: ReturnType<typeof loadRosterForOpts> = null,
  taskOwner?: string,
): string {
  const cliOwner = typeof opts.owner === "string" ? opts.owner.trim().toUpperCase() : "";
  const envOwner =
    typeof process.env.SPECDOJO_OWNER === "string"
      ? process.env.SPECDOJO_OWNER.trim().toUpperCase()
      : "";
  const rosterMemberRoles = findRosterMember(roster, actor)?.roles ?? [];
  // For multi-role actors, prefer the role matching the task's planned owner.
  const matchedRole =
    taskOwner && rosterMemberRoles.length > 1
      ? (rosterMemberRoles
          .find(
            (r) =>
              r.trim().toUpperCase() === taskOwner.toUpperCase() &&
              KNOWN_OWNER_LABELS.includes(
                r.trim().toUpperCase() as (typeof KNOWN_OWNER_LABELS)[number],
              ),
          )
          ?.trim()
          .toUpperCase() ?? "")
      : "";
  const rosterOwner =
    Array.isArray(rosterMemberRoles) && rosterMemberRoles.length > 0
      ? rosterMemberRoles[0].trim().toUpperCase()
      : "";

  if (cliOwner && !KNOWN_OWNER_LABELS.includes(cliOwner as (typeof KNOWN_OWNER_LABELS)[number])) {
    throw new Error(`Invalid --owner value: ${cliOwner}. Use one of: ${KNOWN_OWNER_LABELS_TEXT}.`);
  }
  if (envOwner && !KNOWN_OWNER_LABELS.includes(envOwner as (typeof KNOWN_OWNER_LABELS)[number])) {
    throw new Error(
      `Invalid SPECDOJO_OWNER value: ${envOwner}. Use one of: ${KNOWN_OWNER_LABELS_TEXT}.`,
    );
  }
  if (
    rosterOwner &&
    !KNOWN_OWNER_LABELS.includes(rosterOwner as (typeof KNOWN_OWNER_LABELS)[number])
  ) {
    throw new Error(
      `Invalid roster owner for actor ${actor}: ${rosterOwner}. Use one of: ${KNOWN_OWNER_LABELS_TEXT}.`,
    );
  }

  return cliOwner || envOwner || matchedRole || rosterOwner || "";
}

export function resolveSchedulerStrategy(
  opts: { strategy?: string },
  actor: string,
  roster: ReturnType<typeof loadRosterForOpts> = null,
): SchedulerStrategy {
  const cliStrategy = typeof opts.strategy === "string" ? opts.strategy.trim().toLowerCase() : "";
  const rosterStrategy = findRosterMember(roster, actor)?.scheduler_strategy ?? "";
  const strategy = (cliStrategy || rosterStrategy || "critical-first") as SchedulerStrategy;

  if (strategy !== "critical-first" && strategy !== "fifo") {
    throw new Error(`Invalid --strategy value: ${strategy}. Use one of: critical-first|fifo.`);
  }

  return strategy;
}

export function printCommandError(error: unknown, fail = true): void {
  const message = error instanceof Error ? error.message : String(error);
  process.stdout.write(message + "\n");
  if (fail) exitWithCode(false);
  else process.exitCode = 1;
}

export function loadValidatedExecState(projectPath: string): LoadedExecState | null {
  const res = validateAll(projectPath);
  if (!res.ok) {
    printValidateResult(res);
    exitWithCode(false);
    return null;
  }

  const schedule = buildScheduleIndex(projectPath);
  const events = readAllEventFiles(projectPath);
  const initialTasks = buildInitialStateFromStrategy(projectPath, schedule);
  const snapshot = foldEventsToState(events, schedule, projectPath, initialTasks);
  return { schedule, events, snapshot };
}

export function ensureActorCanClaimNext(
  snapshot: LoadedExecState["snapshot"],
  actor: string,
  allowMultipleDoing: boolean,
): boolean {
  const doingTasks = findDoingTasksForActor(snapshot, actor);
  if (allowMultipleDoing || doingTasks.length === 0) return true;

  process.stdout.write(
    `Actor ${actor} already has doing task(s): ${doingTasks.join(", ")}\n` +
      `Use --allow-multiple-doing to override.\n`,
  );
  exitWithCode(false);
  return false;
}

export async function scaffoldClaimResult(opts: {
  schedulePath: string;
  executionPath: string;
  catalogPath?: string;
  state: LoadedExecState;
  taskId: string;
  projectId: string;
  actor: string;
  startedAt: string;
}): Promise<void> {
  const scheduleNode = opts.state.schedule.nodes.get(opts.taskId);
  const localId = scheduleNode?.local_id;
  const phaseModeIndex = buildPhaseModeIndex(opts.schedulePath);
  const mode = resolveTaskMode(
    localId,
    opts.taskId,
    phaseModeIndex,
    scheduleNode?.phase_suffix,
    scheduleNode?.phase_set,
  );
  const approach = resolveApproach(
    localId,
    opts.taskId,
    phaseModeIndex,
    scheduleNode?.phase_suffix,
    scheduleNode?.phase_set,
  );
  const execution = resolveTaskExecution(
    localId,
    opts.taskId,
    phaseModeIndex,
    scheduleNode?.phase_suffix,
    scheduleNode?.phase_set,
  );
  const finalizeSections =
    approach === "finalize" || approach === "bootstrap-finalize"
      ? finalizeResultSectionsForDeliverable(opts.catalogPath ?? "", localId, approach)
      : undefined;
  const targets = targetDocIdsForScheduledTask(
    opts.catalogPath ?? "",
    {
      local_id: localId,
      target_local_ids: scheduleNode?.target_local_ids,
      approach,
    },
    opts.projectId,
  );
  const result = await scaffoldResult({
    executionPath: opts.executionPath,
    taskId: opts.taskId,
    mode,
    projectId: opts.projectId,
    ...(execution === "agent" ? { planRef: `exec/plans/${opts.taskId}-plan.md` } : {}),
    agent: opts.actor,
    startedAt: opts.startedAt,
    execution,
    ...(approach ? { approach } : {}),
    ...(targets ? { targets } : {}),
    ...(finalizeSections ? { finalizeSections } : {}),
  });
  if (!result.created) {
    await resetResultForClaim(result.resultPath, opts.actor, opts.startedAt, execution);
  }
}

export function runSimpleEventCommand(opts: ExecCommandOpts, type: ExecEventType): void {
  try {
    const { schedulePath } = resolveProjectContext(opts);
    const actor = requireNonEmpty("by", opts.by);
    const roster = loadRosterForOpts(opts);
    assertValidActor(actor, roster);
    const event = buildEvent(type, opts);
    if (opts.dryRun) {
      process.stdout.write(`[dry-run] ${JSON.stringify(event, null, 2)}\n`);
      exitWithCode(true);
      return;
    }
    const out = writeEventFile(schedulePath, event);
    process.stdout.write(out + "\n");
    exitWithCode(true);
  } catch (error) {
    printCommandError(error, false);
  }
}

export async function runLockedEventCommand(
  opts: ExecCommandOpts,
  action: LockedEventAction,
): Promise<void> {
  let lockDir = "";

  try {
    const { schedulePath, executionPath, catalogPath } = resolveProjectContext(opts);
    const actor = requireNonEmpty("by", opts.by);
    const roster = loadRosterForOpts(opts);
    assertValidActor(actor, roster);
    let taskId = typeof opts.task === "string" ? opts.task.trim() : "";
    const allowMultipleDoing = !!opts.allowMultipleDoing;
    const lockTimeoutMs = Number(opts.lockTimeoutMs);
    const lockStaleMs = Number(opts.lockStaleMs);

    lockDir = acquireSchedulerLock(schedulePath, { actor, lockTimeoutMs, lockStaleMs });

    const state = loadValidatedExecState(schedulePath);
    if (!state) return;

    if (!taskId && action.type === "complete") {
      const doingTasks = findDoingTasksForActor(state.snapshot, actor);
      if (doingTasks.length === 0) {
        throw new Error(`Actor ${actor} has no doing task to complete.`);
      }
      if (doingTasks.length > 1) {
        throw new Error(
          `Actor ${actor} has multiple doing tasks: ${doingTasks.join(", ")}. Specify --task.`,
        );
      }
      taskId = doingTasks[0];
    }
    if (!taskId) taskId = requireNonEmpty("task", opts.task);

    const resolvedOpts = { ...opts, task: taskId };

    if (
      action.requireSingleDoing &&
      !ensureActorCanClaimNext(state.snapshot, actor, allowMultipleDoing)
    ) {
      return;
    }

    const check = action.check(state, taskId, actor, resolvedOpts);
    if (!check.ok) {
      process.stdout.write(`Cannot ${action.type} ${taskId}: ${check.reason}\n`);
      exitWithCode(false);
      return;
    }

    const event = buildEvent(action.type, resolvedOpts);
    if (action.type === "claim") {
      const plannedOwner = state.schedule.nodes.get(taskId)?.owner;
      const claimOwner = resolveClaimOwner(resolvedOpts, actor, roster, plannedOwner);
      const cpm = computeCpm(state.schedule, schedulePath);
      writeGeneratedCore(schedulePath, state.events, state.schedule, cpm);
      writeScheduleHashAndDiff(schedulePath, state.schedule);
      writeCpmFiles(schedulePath, cpm, state.snapshot);
      event.meta = {
        ...(event.meta ?? {}),
        claim_owner: claimOwner,
      };
      if (plannedOwner) event.meta.planned_owner = plannedOwner;
      if (plannedOwner && claimOwner !== plannedOwner && resolvedOpts.allowOwnerMismatch) {
        event.meta.owner_override = true;
      }
    }
    if (opts.dryRun) {
      process.stdout.write(`[dry-run] ${JSON.stringify(event, null, 2)}\n`);
      if (action.type === "release" && opts.resetWorktree) {
        resetExecWorktreeForTask({
          projectId: resolveProjectId(opts),
          taskId,
          schedulePath,
          executionPath,
          dryRun: true,
        });
      }
      exitWithCode(true);
      return;
    }
    const out = writeEventFile(schedulePath, event);
    if (action.type === "claim") {
      await scaffoldClaimResult({
        schedulePath,
        executionPath,
        catalogPath,
        taskId,
        state,
        projectId: resolveProjectId(opts),
        actor,
        startedAt: new Date().toISOString(),
      });
    }
    // The release event has been persisted (the task is now todo), so a retained exec worktree is
    // stale residue. --reset-worktree discards it eagerly instead of waiting for the next claim to
    // clean it up via discardStaleExecWorktree.
    if (action.type === "release" && opts.resetWorktree) {
      resetExecWorktreeForTask({
        projectId: resolveProjectId(opts),
        taskId,
        schedulePath,
        executionPath,
        dryRun: false,
      });
    }
    process.stdout.write(out + "\n");
    exitWithCode(true);
  } catch (error) {
    printCommandError(error);
  } finally {
    if (lockDir) {
      try {
        releaseSchedulerLock(lockDir);
      } catch {}
    }
  }
}

// Discards the exec worktree and branch left behind by a now-released task. A released task is back
// in todo, so any retained worktree is stale residue. `dryRun` only prints what would be discarded.
export function resetExecWorktreeForTask(args: {
  projectId: string;
  taskId: string;
  schedulePath: string;
  executionPath: string;
  dryRun: boolean;
}): void {
  const worktreeTaskId = qualifyTaskId(args.projectId, args.taskId);
  if (args.dryRun) {
    process.stdout.write(`[dry-run] reset worktree: discard exec/${worktreeTaskId}\n`);
    return;
  }
  const discarded = discardStaleExecWorktree({
    context: {
      repoRoot: specdojoRootDir(),
      schedulePath: args.schedulePath,
      executionPath: args.executionPath,
    },
    worktreeTaskId,
    // PJR-98G4: repos を宣言した project では、プロダクト側の worktree と exec branch も破棄する。
    products: configuredProductRepos(args.schedulePath),
  });
  process.stdout.write(
    discarded
      ? `reset worktree: discarded ${discarded}\n`
      : `reset worktree: no worktree or branch for ${worktreeTaskId}\n`,
  );
}

// `release --all-blocked`: return every blocked task in the project to todo under a single scheduler
// lock. Tasks blocked by a different actor are skipped unless --force is given (humans only); each
// skip is reported with its reason. --reset-worktree discards each released task's stale worktree.
export async function runReleaseAllBlocked(opts: ExecCommandOpts): Promise<void> {
  let lockDir = "";

  try {
    const { schedulePath, executionPath } = resolveProjectContext(opts);
    const actor = requireNonEmpty("by", opts.by);
    const roster = loadRosterForOpts(opts);
    assertValidActor(actor, roster);
    requireNonEmpty("msg", opts.msg);
    if (opts.task) {
      process.stdout.write("Note: --all-blocked ignores --task.\n");
    }
    const lockTimeoutMs = Number(opts.lockTimeoutMs);
    const lockStaleMs = Number(opts.lockStaleMs);

    lockDir = acquireSchedulerLock(schedulePath, { actor, lockTimeoutMs, lockStaleMs });

    const state = loadValidatedExecState(schedulePath);
    if (!state) return;

    const projectId = resolveProjectId(opts);
    const blockedTaskIds = Object.entries(state.snapshot.tasks)
      .filter(([, cs]) => cs.state === "blocked")
      .map(([taskId]) => taskId)
      .sort((a, b) => a.localeCompare(b));

    if (blockedTaskIds.length === 0) {
      process.stdout.write("No blocked tasks to release.\n");
      exitWithCode(true);
      return;
    }

    const released: string[] = [];
    const skipped: { taskId: string; reason: string }[] = [];
    const override = resolveForceOverride(opts, actor);

    // Releasing one task does not change another task's releasability, so a single snapshot read is
    // sufficient even though the in-memory snapshot is not re-folded after each write.
    for (const taskId of blockedTaskIds) {
      const check = canReleaseTask(state.schedule, state.snapshot, taskId, actor, override);
      if (!check.ok) {
        skipped.push({ taskId, reason: check.reason ?? "not releasable" });
        continue;
      }

      const event = buildEvent("release", { ...opts, task: taskId });
      if (opts.dryRun) {
        process.stdout.write(`[dry-run] ${JSON.stringify(event, null, 2)}\n`);
        if (opts.resetWorktree) {
          resetExecWorktreeForTask({
            projectId,
            taskId,
            schedulePath,
            executionPath,
            dryRun: true,
          });
        }
        released.push(taskId);
        continue;
      }

      const out = writeEventFile(schedulePath, event);
      if (opts.resetWorktree) {
        resetExecWorktreeForTask({ projectId, taskId, schedulePath, executionPath, dryRun: false });
      }
      process.stdout.write(out + "\n");
      released.push(taskId);
    }

    const dryRunSuffix = opts.dryRun ? " (dry-run)" : "";
    process.stdout.write(
      `\nReleased ${released.length} blocked task(s)${dryRunSuffix}; skipped ${skipped.length}.\n`,
    );
    for (const s of skipped) {
      process.stdout.write(`  skip ${s.taskId}: ${s.reason}\n`);
    }
    exitWithCode(true);
  } catch (error) {
    printCommandError(error);
  } finally {
    if (lockDir) {
      try {
        releaseSchedulerLock(lockDir);
      } catch {}
    }
  }
}
