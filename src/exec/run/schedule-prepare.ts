import { withPlanConventionsFiles } from "../../shared/plan-conventions.js";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { ensureReviewGrade, type ReviewGradeOutcome } from "../../review/grade.js";
import { findDeliverableInfo } from "../plans-core.js";
import { enforceKataReviewVerdict, scheduleKataReviewSubjects } from "../review-kata.js";
import {
  type AgentProvider,
  type MemberRoster,
  type ProjectMember,
} from "../../shared/specdojo-config.js";
import { resolveMemberCommand, type ExecDefaultsConfig } from "../agent-config.js";
import { canCompleteTask, foldEventsToState, readAllEventFiles } from "../events.js";
import { gradeCheckpointPaths } from "../grade-checkpoint.js";
import { pipelineStateLocation, type PipelineStageRole } from "../pipeline-state.js";
import {
  finalizeResultSectionsForDeliverable,
  generateSinglePlan,
  reviewGradeSubject,
  targetDocIdsForScheduledTask,
} from "../plans.js";
import type { RegisterResumeTarget } from "../register-resume.js";
import { isResultUnfilled, readResultFrontmatterSnapshot, scaffoldResult } from "../results.js";
import { findRunRecord, recordPathForRead, recordRef, recordStem } from "../run-records.js";
import { buildInitialStateFromStrategy } from "../schedule/initial.js";
import { buildScheduleIndex } from "../schedule/schedule.js";
import { qualifyTaskId } from "../shared.js";
import {
  configuredProductRepos,
  plannedProjectWorktreePath,
  preflightProductBranches,
  productBranchForTask,
} from "../task-repos.js";
import {
  type AgentStageRole,
  type ReadyTaskView,
  type ScheduleIndex,
  type StateSnapshot,
  type TaskMode,
} from "../types.js";
import { checkpointAndEnsureWorktree, discardStaleExecWorktree } from "../worktree-ops.js";
import { findExecWorktree, worktreeNameFromTaskId, type ExecWorktree } from "../worktree.js";
import {
  buildExecutorPrompt,
  executorRequirements,
  loadPrompt,
  pathInsideWorktree,
  reportProductWorktrees,
  reporterRequirements,
  resolveReporterAgentCandidates,
} from "./agent.js";
import { integrateLogPath, spawnClaim, spawnRelease } from "./mode-shared.js";
import {
  collectBusyActors,
  pinnedExecutor,
  pinnedReporter,
  resolveAgentOverride,
  resolveExecDefaultsPath,
  resolvePinnedRateLimitRunOptions,
  resolveTaskPhaseContext,
  selectCandidates,
  type AgentRunCandidate,
  type ModeAgentOverrides,
  type PinnedRateLimitRunOptions,
  type ResolvedRequirements,
  type RunOpts,
  type RunResult,
  type StageAgentOverrides,
} from "./shared.js";

export type PreparedTask = {
  task: ReadyTaskView;
  // The actor that ran the latest agent stage. Fallback and stage overrides may replace it.
  actor: string;
  // The actor that holds the claim this runner made or resumed. Lifecycle events (complete /
  // block) use it so a stage run by another agent still passes the same-actor guard.
  claimActor: string;
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
  initialChangeTargets?: readonly string[];
  resumeHandoff?: readonly string[];
  reporterCandidates?: AgentRunCandidate[];
  executorRateLimitOptions?: PinnedRateLimitRunOptions;
  reporterRateLimitOptions?: PinnedRateLimitRunOptions;
  // Runner-side grade before the review plan; a failed grade blocks completion (PJR-M18B).
  reviewGradeOutcome?: ReviewGradeOutcome;
};

export type PlanGenPaths = {
  catalogPath?: string;
  rolesPath?: string;
  viewpointsPath?: string;
  projectContext?: string[];
};

export function findClaimEventPath(
  schedulePath: string,
  taskId: string,
  worktreeRef?: { repoRoot: string; worktreePath: string },
): string | null {
  const claims = readAllEventFiles(schedulePath).filter(
    (item) => item.event.task_id === taskId && item.event.type === "claim",
  );
  if (worktreeRef && existsSync(worktreeRef.worktreePath)) {
    for (let i = claims.length - 1; i >= 0; i -= 1) {
      const candidate = claims[i]!.path;
      if (
        existsSync(pathInsideWorktree(worktreeRef.repoRoot, worktreeRef.worktreePath, candidate))
      ) {
        return candidate;
      }
    }
  }
  return claims[claims.length - 1]?.path ?? null;
}

// review フェーズの前段で runner が対象文書へ grade を実行する（PJR-KCMH、PJR-2ZVS 3.6）。
// executor には実行させない。評価結果が最新（content_hash 一致）なら再実行しない。
// grade は失敗すると再試行する。それでも失敗した場合も review は止めず、結果を plan に示すが、
// runner はそのタスクを done にせず blocked にする（PJR-M18B）。
export async function gradeBeforeReviewPlan(params: {
  task: ReadyTaskView;
  projectId: string | undefined;
  catalogPath: string | undefined;
  repoRoot: string;
  dryRun: boolean;
  by?: string;
  execDefaultsPath?: string;
}): Promise<ReviewGradeOutcome | undefined> {
  const { task, projectId } = params;
  if ((task.mode ?? "edit") !== "review" || !projectId) return undefined;
  const subject = reviewGradeSubject(params.catalogPath ?? "", task);
  if (!subject) {
    process.stdout.write("  [grade] skipped: grade subject is not resolvable\n");
  }
  if (subject)
    process.stdout.write(`  [grade] checking ${subject.path} (--target ${subject.target})\n`);
  const outcome: ReviewGradeOutcome = subject
    ? await ensureReviewGrade({
        taskId: qualifyTaskId(projectId, task.id),
        projectId,
        subjectPath: subject.path,
        target: subject.target,
        repoRoot: params.repoRoot,
        dryRun: params.dryRun,
        by: params.by,
        execDefaultsPath: params.execDefaultsPath,
      })
    : { action: "not-run", detail: "評価対象のパスを解決できない" };
  const deliverable =
    task.local_id && params.catalogPath
      ? findDeliverableInfo(params.catalogPath, task.local_id)
      : null;
  for (const kata of scheduleKataReviewSubjects(task, deliverable, projectId)) {
    if (kata.path === subject?.path && subject?.target === "kata") continue;
    process.stdout.write(`  [grade] checking ${kata.label}: ${kata.path} (--target kata)\n`);
    const kataOutcome = await ensureReviewGrade({
      taskId: qualifyTaskId(projectId, task.id),
      projectId,
      subjectPath: kata.path === "_MISSING_" ? "" : kata.path,
      target: "kata",
      repoRoot: params.repoRoot,
      dryRun: params.dryRun,
      by: params.by,
      execDefaultsPath: params.execDefaultsPath,
    });
    if (kataOutcome.action === "failed" || kataOutcome.action === "not-run") {
      process.stdout.write(`  [grade] ${kata.label}: ${kataOutcome.detail}\n`);
    }
  }
  const summary =
    outcome.action === "skipped"
      ? "skipped: content_hash matches the stored grade"
      : outcome.action === "executed"
        ? `executed: run id ${outcome.runId}`
        : outcome.action === "failed"
          ? `failed after ${outcome.attempts} attempt(s): run id ${outcome.runId}; ${outcome.detail}`
          : `not run: ${outcome.detail}`;
  process.stdout.write(`  [grade] ${summary}\n`);
  return outcome;
}

export function enforceScheduleKataReview(params: {
  task: ReadyTaskView;
  catalogPath: string | undefined;
  resultPath: string;
  projectId: string | undefined;
  rootDir: string;
}): void {
  if (params.task.mode !== "review" || !params.projectId) return;
  const deliverable =
    params.task.local_id && params.catalogPath
      ? findDeliverableInfo(params.catalogPath, params.task.local_id)
      : null;
  enforceKataReviewVerdict(
    params.resultPath,
    scheduleKataReviewSubjects(params.task, deliverable, params.projectId),
    params.projectId,
    params.rootDir,
  );
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
  pipelineResume?: {
    stage?: AgentStageRole;
    stateRef?: string;
    executorTarget?: Extract<RegisterResumeTarget, { stage: "executor" }>;
    worktree?: ExecWorktree;
  },
  rateLimitOverrides: Pick<
    RunOpts,
    "onRateLimit" | "fallbackExecutorBy" | "fallbackReporterBy" | "execDefaults" | "agentConfig"
  > = {},
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
  if (
    overrideResolution.kind === "command" &&
    overrideResolution.actor &&
    (!skipClaim || (Boolean(stageAgentOverrides.executor) && pipelineResume?.stage !== "reporter"))
  ) {
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
  let reporterPinned = false;
  if (task.agent_pipeline) {
    const requirements = reporterRequirements(task);
    const reporterNickname = stageAgentOverrides.reporter ?? pinnedReporter(task);
    reporterPinned = !!reporterNickname || !!pipelineResume;
    reporterCandidates = resolveReporterAgentCandidates(
      task,
      roster,
      execDefaults,
      collectBusyActors(schedulePath),
      reporterNickname,
    );
    if (reporterCandidates.length === 0) {
      process.stdout.write(
        `  No agents found for reporter stage${requirements?.proficiency ? `, proficiency: ${requirements.proficiency}` : ""}\n`,
      );
      return "failure";
    }
  }

  const executorRateLimitOptions =
    overrideResolution.kind === "command" || !!pipelineResume
      ? resolvePinnedRateLimitRunOptions(
          rateLimitOverrides,
          execDefaults,
          roster,
          "executor",
          agentCandidates[0],
        )
      : undefined;
  const reporterRateLimitOptions =
    reporterPinned && reporterCandidates?.[0]
      ? resolvePinnedRateLimitRunOptions(
          rateLimitOverrides,
          execDefaults,
          roster,
          "reporter",
          reporterCandidates[0],
        )
      : undefined;

  // A resumed claim stays with the actor that already holds it, even when a stage override
  // selects another agent to run.
  const claimActor = skipClaim ? (actorOverride ?? actor) : actor;

  if (pipelineResume?.executorTarget) {
    const { executorTarget, worktree } = pipelineResume;
    if (!worktree) throw new Error(`no exec worktree to resume executor for ${task.id}`);
    const worktreeExecutionPath = pathInsideWorktree(repoRoot, worktree.path, executionPath);
    const planPrompt = loadPrompt(worktreeExecutionPath, task.id);
    const resultPath = recordPathForRead(executionPath, "result", task.id);
    const worktreeResultPath = pathInsideWorktree(repoRoot, worktree.path, resultPath);
    if (!planPrompt || !existsSync(resultPath) || !existsSync(worktreeResultPath)) {
      throw new Error(`plan or result is missing for executor resume: ${task.id}`);
    }
    const claimEventPath = findClaimEventPath(schedulePath, task.id, {
      repoRoot,
      worktreePath: worktree.path,
    });
    if (!claimEventPath) throw new Error(`claim event is missing for executor resume: ${task.id}`);
    reportProductWorktrees(worktree);
    return {
      task,
      actor,
      claimActor,
      agentCandidates,
      plan: planPrompt,
      prompt: buildExecutorPrompt(planPrompt, execDefaults.pipeline?.parent_validations),
      worktree,
      resultPath,
      resultScaffold: readResultFrontmatterSnapshot(resultPath),
      checkpointPaths: withPlanConventionsFiles([
        recordPathForRead(executionPath, "plan", task.id),
        resultPath,
        claimEventPath,
        ...gradeCheckpointPaths({ repoRoot, executionPath }),
      ]),
      pipelineRunId: executorTarget.runId,
      pipelineResumeStage: "executor",
      pipelineStateRef: executorTarget.stateRef,
      initialChangeTargets: executorTarget.initialChanges,
      resumeHandoff: executorTarget.handoff,
      reporterCandidates,
      executorRateLimitOptions,
      reporterRateLimitOptions,
    };
  }

  const reviewGradeOutcome = await gradeBeforeReviewPlan({
    task,
    projectId,
    catalogPath: planGenPaths.catalogPath,
    repoRoot,
    dryRun,
    by: agentCandidates[0]?.actor,
    execDefaultsPath: resolveExecDefaultsPath(rateLimitOverrides, schedulePath),
  });

  // Plans are generated on demand here; `exec refresh` does not manage them.
  if (!skipClaim || !findRunRecord(executionPath, "plan", task.id))
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
    ? recordStem(recordPathForRead(executionPath, "plan", task.id))
    : undefined;

  const worktreeTaskId = qualifyTaskId(projectId, task.id);
  const worktreeName = worktreeNameFromTaskId(worktreeTaskId);
  // PJR-98G4: repos を宣言した project では <base>/<task>/project/ と <base>/<task>/<repo>/ を作る。
  const products = configuredProductRepos(schedulePath).map((product) => ({
    ...product,
    branch: productBranchForTask(product, worktreeTaskId, skipClaim),
  }));
  preflightProductBranches(products, worktreeTaskId);

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
          `(${productBranchForTask(product, worktreeTaskId)} in ${product.repoRoot})\n`,
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
      claimActor,
      agentCandidates,
      plan: planPrompt,
      prompt,
      worktree,
      pipelineRunId,
      pipelineResumeStage: pipelineResume?.stage,
      pipelineStateRef: pipelineResume?.stateRef,
      reporterCandidates,
      executorRateLimitOptions,
      reporterRateLimitOptions,
      ...(reviewGradeOutcome ? { reviewGradeOutcome } : {}),
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

  const planRef = recordRef(executionPath, recordPathForRead(executionPath, "plan", task.id));
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
  const existingWorktree = skipClaim ? findExecWorktree(repoRoot, worktreeTaskId) : null;
  const claimEventPath = findClaimEventPath(
    schedulePath,
    task.id,
    existingWorktree ? { repoRoot, worktreePath: existingWorktree.path } : undefined,
  );
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

  const checkpointPaths = withPlanConventionsFiles([
    recordPathForRead(executionPath, "plan", task.id),
    resultPath,
    claimEventPath,
    ...gradeCheckpointPaths({ repoRoot, executionPath }),
  ]);
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
    claimActor,
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
    executorRateLimitOptions,
    reporterRateLimitOptions,
    ...(reviewGradeOutcome ? { reviewGradeOutcome } : {}),
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
