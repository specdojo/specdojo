import { join } from "node:path";
import { resolveMemberCommand, type ExecDefaultsConfig } from "./agent-config.js";
import { canCompleteTask, readAllEventFiles, foldEventsToState } from "./events.js";
import { buildScheduleIndex } from "./schedule.js";
import { buildInitialStateFromStrategy } from "./schedule-initial.js";
import { qualifyTaskId, randomHex } from "./shared.js";
import {
  type AgentProvider,
  type MemberRoster,
  type ProjectMember,
} from "../shared/specdojo-config.js";
import { type ReadyTaskView } from "./types.js";
import {
  type AgentStageRole,
  type ScheduleIndex,
  type StateSnapshot,
  type TaskMode,
} from "./types.js";
import {
  generateSinglePlan,
  finalizeResultSectionsForDeliverable,
  targetDocIdsForScheduledTask,
  reviewGradeSubject,
} from "./plans.js";
import { ensureReviewGrade } from "../review/grade.js";
import { type ReviewGradeOutcome } from "../review/grade.js";
import { isResultUnfilled, readResultFrontmatterSnapshot, scaffoldResult } from "./results.js";
import { worktreeNameFromTaskId, type ExecWorktree } from "./worktree.js";
import { configuredProductRepos, plannedProjectWorktreePath } from "./task-repos.js";
import { checkpointAndEnsureWorktree, discardStaleExecWorktree } from "./worktree-ops.js";
import { pipelineStateLocation, type PipelineStageRole } from "./pipeline-state.js";
import {
  collectBusyActors,
  pinnedExecutor,
  pinnedReporter,
  resolveAgentOverride,
  resolveTaskPhaseContext,
  selectCandidates,
  type AgentRunCandidate,
  type ModeAgentOverrides,
  type ResolvedRequirements,
  type RunResult,
  type StageAgentOverrides,
} from "./run-shared.js";
import {
  buildExecutorPrompt,
  executorRequirements,
  loadPrompt,
  reportProductWorktrees,
  reporterRequirements,
  resolveReporterAgentCandidates,
} from "./run-agent.js";
import { integrateLogPath, spawnClaim, spawnRelease } from "./run-mode-shared.js";

export type PreparedTask = {
  task: ReadyTaskView;
  actor: string;
  agentCandidates: AgentRunCandidate[];
  plan: string;
  prompt: string;
  worktree: ExecWorktree;
  resultPath?: string;
  resultScaffold?: Record<string, unknown>;
  // Root-side copies of the execution checkpoint (plan / result / claim event). The exec branch
  // holds the commit; the root keeps these uncommitted until the merge releases them.
  checkpointPaths?: string[];
  priorLimitAttempts?: number;
  pipelineRunId?: string;
  pipelineResumeStage?: PipelineStageRole;
  pipelineStateRef?: string;
  reporterCandidates?: AgentRunCandidate[];
};

export type PlanGenPaths = {
  catalogPath?: string;
  rolesPath?: string;
  viewpointsPath?: string;
  projectContext?: string[];
};

export function findClaimEventPath(schedulePath: string, taskId: string): string | null {
  const claims = readAllEventFiles(schedulePath).filter(
    (item) => item.event.task_id === taskId && item.event.type === "claim",
  );
  return claims[claims.length - 1]?.path ?? null;
}

// review フェーズの前段で runner が対象文書へ grade を実行する（PJR-KCMH、PJR-2ZVS 3.6）。
// executor には実行させない。評価結果が最新（content_hash 一致）なら再実行しない。
// grade の失敗は review を止めず、結果を plan に示して review の verdict に委ねる。
export async function gradeBeforeReviewPlan(params: {
  task: ReadyTaskView;
  projectId: string | undefined;
  catalogPath: string | undefined;
  repoRoot: string;
  dryRun: boolean;
}): Promise<ReviewGradeOutcome | undefined> {
  const { task, projectId } = params;
  if ((task.mode ?? "edit") !== "review" || !projectId) return undefined;
  const subject = reviewGradeSubject(params.catalogPath ?? "", task);
  if (!subject) {
    process.stdout.write("  [grade] skipped: grade subject is not resolvable\n");
    return { action: "not-run", detail: "評価対象のパスを解決できない" };
  }
  process.stdout.write(`  [grade] checking ${subject.path} (--target ${subject.target})\n`);
  const outcome = await ensureReviewGrade({
    taskId: qualifyTaskId(projectId, task.id),
    projectId,
    subjectPath: subject.path,
    target: subject.target,
    repoRoot: params.repoRoot,
    dryRun: params.dryRun,
  });
  const summary =
    outcome.action === "skipped"
      ? "skipped: content_hash matches the stored grade"
      : outcome.action === "executed"
        ? `executed: run id ${outcome.runId}`
        : outcome.action === "failed"
          ? `failed: run id ${outcome.runId}; ${outcome.detail}`
          : `not run: ${outcome.detail}`;
  process.stdout.write(`  [grade] ${summary}\n`);
  return outcome;
}

export async function prepareSingleTask(
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
  // nickname whose command is resolved from agent-members.yaml; a mode without an override falls back
  // to normal auto-selection.
  const overrideResolution = resolveAgentOverride(
    mode,
    task.agent_pipeline
      ? (stageAgentOverrides.executor ?? agentNicknameOverride ?? pinnedExecutor(task))
      : (agentNicknameOverride ?? pinnedExecutor(task)),
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
      stageAgentOverrides.reporter ?? pinnedReporter(task),
    );
    if (reporterCandidates.length === 0) {
      process.stdout.write(
        `  No agents found for reporter stage${requirements?.proficiency ? `, proficiency: ${requirements.proficiency}` : ""}\n`,
      );
      return "failure";
    }
  }

  const reviewGradeOutcome = await gradeBeforeReviewPlan({
    task,
    projectId,
    catalogPath: planGenPaths.catalogPath,
    repoRoot,
    dryRun,
  });

  // Plans are generated on demand here; `exec refresh` does not manage them.
  await generateSinglePlan({
    executionPath,
    projectId: projectId ?? "",
    catalogPath: planGenPaths.catalogPath ?? "",
    rolesPath: planGenPaths.rolesPath,
    viewpointsPath: planGenPaths.viewpointsPath,
    projectContext: planGenPaths.projectContext,
    task,
    ...(reviewGradeOutcome ? { reviewGradeOutcome } : {}),
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
  // PJR-98G4: repos を宣言した project では <base>/<task>/project/ と <base>/<task>/<repo>/ を作る。
  const products = configuredProductRepos(schedulePath);

  if (dryRun) {
    const worktree: ExecWorktree = {
      path: plannedProjectWorktreePath(worktreeBase, worktreeTaskId, products),
      branch: `exec/${worktreeName}`,
      name: worktreeName,
      created: false,
    };
    process.stdout.write(`  [run] would setup: worktree ${worktree.path} (${worktree.branch})\n`);
    for (const product of products) {
      process.stdout.write(
        `  [run] would setup: worktree ${join(worktreeBase, worktreeName, product.name)} ` +
          `(${worktree.branch} in ${product.repoRoot})\n`,
      );
    }
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
    ...(finalizeSections ? { finalizeSections } : {}),
  });

  // Keep the execution checkpoint visible at root, but commit it only on the exec branch. The
  // successful merge later brings plan/result/claim and deliverables to root in one first-parent
  // commit (see runPreparedTask).
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
      products,
    });
    if (discarded) {
      process.stdout.write(`  [run] discarded stale worktree/branch: ${discarded}\n`);
    }
  }

  const checkpointPaths = [
    join(executionPath, "exec", "plans", `${task.id}-plan.md`),
    resultPath,
    claimEventPath,
  ];
  const checkpointFailureLogPath = pipelineRunId
    ? integrateLogPath(
        pipelineStateLocation({
          repoRoot,
          worktreePath: repoRoot,
          executionPath,
          taskId: task.id,
          runId: pipelineRunId,
        }).path,
      )
    : undefined;
  let worktree: ExecWorktree;
  try {
    worktree = checkpointAndEnsureWorktree({
      context: { repoRoot, schedulePath, executionPath },
      worktreeTaskId,
      base: worktreeBase,
      checkpointPaths,
      commitMessage: `exec(${task.id}): prepare execution`,
      products,
      failureLogPath: checkpointFailureLogPath,
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
  reportProductWorktrees(worktree);

  return {
    task,
    actor,
    agentCandidates,
    plan: planPrompt,
    prompt,
    worktree,
    resultPath,
    resultScaffold: readResultFrontmatterSnapshot(resultPath),
    checkpointPaths,
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

export function readCompletionPreflight(
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
