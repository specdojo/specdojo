import { existsSync } from "node:fs";
import { basename, join } from "node:path";
import { createProviderCapacityTracker, loadExecDefaultsConfig } from "../agent-config.js";
import { activateResolvedProjectPaths, resolveProjectPaths } from "../project.js";
import { readAllEventFiles, foldEventsToState } from "../events.js";
import { buildScheduleIndex, findStaleGeneratedTracks } from "../schedule/schedule.js";
import { buildInitialStateFromStrategy } from "../schedule/initial.js";
import { readReadySnapshot } from "../schedule/ready.js";
import { specdojoRootDir } from "../../shared/specdojo-config.js";
import { type ReadyTaskView } from "../types.js";
import { type CurrentState } from "../types.js";
import { extractLocalId, extractPhaseSuffix } from "../../schedule/phase-sets.js";
import { resolveWorktreeBase } from "../worktree.js";
import {
  buildPhaseModeIndex,
  resolveAgentAssignment,
  resolveAgentPipeline,
  resolveApproach,
  resolveTaskCapabilities,
  resolveTaskExecution,
  resolveTaskMode,
  resolveTaskProficiency,
} from "../strategy.js";
import {
  SerialAsyncLock,
  buildTaskPhaseMap,
  configuredWorktreeBase,
  parseParallel,
  resolveExecDefaultsPath,
  runCompletionDrivenWorkerPool,
  type RunOpts,
} from "./shared.js";
import { loadRosterForExecutionPath } from "./agent.js";
import { type PlanGenPaths, type PreparedTask, prepareSingleTask } from "./schedule-prepare.js";
import {
  type PreparedTaskOutcome,
  runPreparedTask,
  runPreparedTaskSafely,
} from "./schedule-task.js";
import { spawnIndexBuild, spawnRefresh, spawnScheduleBuild } from "./mode-shared.js";

export type CycleScheduleRebuildResult = {
  status: "not-needed" | "success" | "failure";
  tracks: string[];
};

export type CycleScheduleRebuildDependencies = {
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

export async function runBatchMode(opts: RunOpts): Promise<void> {
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
          undefined,
          opts,
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

export async function runManualMode(opts: RunOpts): Promise<void> {
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
    task.agent_pipeline =
      task.agent_pipeline ??
      resolveAgentPipeline(
        task.local_id,
        task.id,
        phaseModeIndex,
        task.phase_suffix,
        task.phase_set,
      );
    task.agent =
      task.agent ??
      resolveAgentAssignment(
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
    undefined,
    undefined,
    opts,
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
