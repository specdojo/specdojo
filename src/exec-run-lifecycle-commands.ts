import { existsSync } from "node:fs";
import { join } from "node:path";
import { type Command } from "commander";
import {
  loadExecDefaultsConfig,
  providerSlotPoolPath,
  resolveMaxConcurrency,
  resolveMaxConcurrentRuns,
  type ExecDefaultsConfig,
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
import { selectDueDeferredLimitTasks } from "./exec-limit.js";
import { buildScheduleIndex } from "./exec-schedule.js";
import { buildInitialStateFromStrategy } from "./exec-schedule-initial.js";
import { qualifyTaskId } from "./exec-shared.js";
import { specdojoRootDir, type AgentProvider } from "./shared/specdojo-config.js";
import { type ReadyTaskView, type CurrentState } from "./exec-types.js";
import { collectExecLockUsage, execLocksDir, formatExecLockUsage } from "./exec-run-lock.js";
import { buildTaskView } from "./exec-task-view.js";
import { readResultFrontmatterSnapshot, updateResultStatus } from "./exec-results.js";
import { findExecWorktree, resolveWorktreeBase } from "./exec-worktree.js";
import { configuredProductRepos, withProductWorktrees } from "./exec-task-repos.js";
import {
  parentValidationPoolPath,
  resolveParentValidationConcurrency,
} from "./exec-parent-validation.js";
import { loadPipelineResumeCheckpoint } from "./exec-pipeline-state.js";
import {
  buildTaskPhaseMap,
  configuredWorktreeBase,
  parseParallel,
  resolveExecDefaultsPath,
  withProjectExecRunLock,
  type RunOpts,
} from "./exec-run-shared.js";
import { loadRosterForExecutionPath, pathInsideWorktree } from "./exec-run-agent.js";
import {
  type PlanGenPaths,
  type PreparedTask,
  findClaimEventPath,
  prepareSingleTask,
} from "./exec-run-schedule-prepare.js";
import { runPreparedTask } from "./exec-run-schedule-task.js";
import {
  rebuildStaleGeneratedTracksForCycle,
  resolveClaimingActor,
  runBatchMode,
} from "./exec-run-schedule-mode.js";
import {
  spawnBlock,
  spawnIndexBuild,
  spawnRefresh,
  spawnValidate,
} from "./exec-run-mode-shared.js";

// 同じ project の exec run が共有する枠（主 run・--join run・register lifecycle・provider の
// max_concurrency・親検証）の上限と現在の使用数を表示する。ロックは取得しない。
export function formatExecSlotsReport(
  executionPath: string,
  execDefaults: ExecDefaultsConfig,
): string {
  const lockRoot = execLocksDir(executionPath);
  const providers = Object.keys(execDefaults.providers ?? {}).sort() as AgentProvider[];
  const providerPools = providers.flatMap((provider) => {
    const cap = resolveMaxConcurrency(execDefaults, provider);
    return cap === undefined
      ? []
      : [
          {
            name: `provider ${provider}`,
            path: providerSlotPoolPath(lockRoot, provider),
            limit: cap,
          },
        ];
  });
  const parentValidationPools = execDefaults.pipeline?.parent_validations?.length
    ? [
        {
          name: "parent validations",
          path: parentValidationPoolPath(lockRoot),
          limit: resolveParentValidationConcurrency(
            execDefaults.pipeline.parent_validation_concurrency,
          ),
        },
      ]
    : [];
  const entries = collectExecLockUsage(executionPath, {
    joinLimit: resolveMaxConcurrentRuns(execDefaults) - 1,
    pools: [...providerPools, ...parentValidationPools],
  });
  return (
    `max concurrent runs: ${resolveMaxConcurrentRuns(execDefaults)}\n` +
    formatExecLockUsage(entries)
  );
}

export function registerSlotsCommand(exec: Command): void {
  const cmd = exec
    .command("slots")
    .description(
      "Show the limits and current usage of the slots shared by concurrent exec runs of a project",
    );
  cmd.option("--project <projectId>", "Project id in .specdojo/specdojo.config.json");
  cmd.option(
    "--exec-defaults <path>",
    "Path to exec-defaults.yaml global config (default: .specdojo/exec-defaults.yaml)",
  );
  cmd.action((opts: RunOpts) => {
    try {
      const { schedulePath, executionPath } = resolveProjectPaths({ project: opts.project });
      const execDefaults = loadExecDefaultsConfig(
        resolveExecDefaultsPath(opts, schedulePath),
        executionPath,
      );
      process.stdout.write(formatExecSlotsReport(executionPath, execDefaults));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      process.stdout.write(message + "\n");
      process.exitCode = 1;
    }
  });
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
export async function runCycleMode(opts: RunOpts): Promise<void> {
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
    "agent-members.yaml nickname for edit-mode tasks (resume + auto)",
  );
  cmd.option(
    "--review-by <nickname>",
    "agent-members.yaml nickname for review-mode tasks (resume + auto)",
  );
  cmd.option(
    "--executor-by <nickname>",
    "agent-members.yaml executor nickname for pipeline tasks (resume + auto)",
  );
  cmd.option(
    "--reporter-by <nickname>",
    "agent-members.yaml reporter nickname for pipeline tasks (resume + auto)",
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

// Restore a Schedule pipeline at its runner-owned integration stage without resolving or starting
// an agent. The block event supplies the run-scoped state reference; both agent stages must still
// be succeeded and the original worktree/result must exist before any lifecycle state is changed.
export function prepareScheduleIntegrationResume(params: {
  task: ReadyTaskView;
  taskState: CurrentState | undefined;
  actor: string;
  projectId: string | undefined;
  repoRoot: string;
  executionPath: string;
  schedulePath: string;
}): PreparedTask {
  const { task, taskState, actor, projectId, repoRoot, executionPath, schedulePath } = params;
  const stateRef =
    typeof taskState?.meta?.pipeline_state_ref === "string"
      ? taskState.meta.pipeline_state_ref
      : undefined;
  if (!stateRef) {
    throw new Error(`integration resume has no pipeline_state_ref for ${task.id}`);
  }

  const worktreeTaskId = qualifyTaskId(projectId, task.id);
  const foundWorktree = findExecWorktree(repoRoot, worktreeTaskId);
  if (!foundWorktree) throw new Error(`no exec worktree to resume integration for ${task.id}`);
  const worktree = withProductWorktrees(
    foundWorktree,
    configuredProductRepos(schedulePath),
    worktreeTaskId,
  );

  const checkpoint = loadPipelineResumeCheckpoint({
    worktreePath: worktree.path,
    stateRef,
    taskId: task.id,
  });
  if (!checkpoint) throw new Error(`pipeline state is missing or invalid for ${task.id}`);
  if (
    checkpoint.state.stages.executor.status !== "succeeded" ||
    checkpoint.state.stages.reporter.status !== "succeeded"
  ) {
    throw new Error(
      `integration resume requires succeeded executor and reporter stages for ${task.id}`,
    );
  }

  const resultPath = join(executionPath, "exec", "results", `${task.id}-result.md`);
  const worktreeResultPath = pathInsideWorktree(repoRoot, worktree.path, resultPath);
  if (!existsSync(resultPath) || !existsSync(worktreeResultPath)) {
    throw new Error(`result is missing for integration resume: ${task.id}-result.md`);
  }
  // 統合再開でも、root に未 commit のまま残る claim / plan / result の作業コピーを merge 前に
  // 解放できるよう、通常実行と同じ checkpoint パスを持たせる。
  const claimEventPath = findClaimEventPath(schedulePath, task.id);
  const checkpointPaths = [
    join(executionPath, "exec", "plans", `${task.id}-plan.md`),
    resultPath,
    ...(claimEventPath ? [claimEventPath] : []),
  ];

  return {
    task,
    actor,
    agentCandidates: [],
    plan: "",
    prompt: "",
    worktree,
    resultPath,
    resultScaffold: readResultFrontmatterSnapshot(resultPath),
    checkpointPaths,
    pipelineRunId: checkpoint.state.run_id,
    pipelineResumeStage: "integrate",
    pipelineStateRef: stateRef,
  };
}

// Resume tasks left in "doing" state by an interrupted run. Unlike --auto (which selects from
// ready.json and provably excludes "doing"/"blocked" tasks), resume folds the event log to find
// in-flight tasks and re-runs each on its existing worktree, reusing the claiming actor and the
// partially-filled result (scaffoldResult is idempotent; the worktree is reused). No validate/build
// pass — selection comes from events, not the generated cache.
export async function runResumeMode(opts: RunOpts): Promise<void> {
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
      const blockedPipelineStage = taskState?.meta?.pipeline_stage;
      const canResumeBlockedPipeline =
        taskState?.state === "blocked" &&
        (blockedPipelineStage === "executor" ||
          blockedPipelineStage === "reporter" ||
          blockedPipelineStage === "integrate") &&
        typeof taskState.meta?.pipeline_state_ref === "string";
      if (canResumeBlockedPipeline) {
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
              msg:
                blockedPipelineStage === "integrate"
                  ? "resume integration from persisted pipeline state"
                  : blockedPipelineStage === "reporter"
                    ? "resume reporter from persisted pipeline state"
                    : "resume executor from persisted pipeline state",
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
        const prepared =
          snapshot.tasks[taskId]?.meta?.pipeline_stage === "integrate"
            ? prepareScheduleIntegrationResume({
                task,
                taskState: snapshot.tasks[taskId],
                actor: resolved.actor ?? snapshot.tasks[taskId]?.last_by ?? "exec-pipeline-resume",
                projectId,
                repoRoot,
                executionPath,
                schedulePath,
              })
            : await prepareSingleTask(
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
      "Resume in-flight tasks, blocked reporter/integration stages, or due deferred-limit tasks on existing worktrees",
    );

  cmd.option("--project <projectId>", "Project id in .specdojo/specdojo.config.json");
  cmd.option(
    "--task <taskId>",
    'Resume only this task ("doing", blocked pipeline stage, or due with --due)',
  );
  cmd.option(
    "--due",
    "Atomically claim and resume only retryable limit blocks whose resume time has arrived",
    false,
  );
  cmd.option(
    "--by <nickname>",
    "Select an agent-members.yaml agent (default: the agent that claimed the task)",
  );
  cmd.option(
    "--edit-by <nickname>",
    "agent-members.yaml nickname for edit-mode tasks (overrides the claiming actor)",
  );
  cmd.option(
    "--review-by <nickname>",
    "agent-members.yaml nickname for review-mode tasks (overrides the claiming actor)",
  );
  cmd.option("--executor-by <nickname>", "agent-members.yaml executor nickname for pipeline tasks");
  cmd.option("--reporter-by <nickname>", "agent-members.yaml reporter nickname for pipeline tasks");
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
