import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import {
  loadExecDefaultsConfig,
  resolveMemberCommand,
  type ExecDefaultsConfig,
} from "../agent-config.js";
import { activateResolvedProjectPaths, resolveProjectPaths } from "../project.js";
import { randomHex } from "../shared.js";
import {
  specdojoRootDir,
  resolveAgentMember,
  type AgentProvider,
  type MemberRoster,
} from "../../shared/specdojo-config.js";
import { type AgentPipeline, type ReadyTaskView } from "../types.js";
import { type AgentStageRole } from "../types.js";
import { extractLocalId } from "../../schedule/phase-sets.js";
import {
  archivePlan,
  buildInPlaceStem,
  generateDeliverablePlan,
  generateSinglePlan,
  parsePlanTaskIdentity,
  resolveDeliverableTarget,
  finalizeResultSectionsForDeliverable,
  targetDocIdsForScheduledTask,
  stemFromPlanPath,
} from "../plans.js";
import { buildTaskView } from "../task-view.js";
import {
  isResultUnfilled,
  readResultFrontmatterSnapshot,
  renderReporterResult,
  scaffoldResult,
  updateResultStatus,
} from "../results.js";
import { gitEnvironment } from "../worktree.js";
import {
  agentProtectedConfigViolation,
  captureAgentProtectedConfigSnapshot,
  changedAgentProtectedConfigPaths,
} from "../agent-protected-config.js";
import {
  agentGitStateViolation,
  captureAgentGitStateSnapshot,
  changedAgentGitStateFields,
} from "../agent-git-state.js";
import { recordGitStateBlock, recordProtectedConfigBlock } from "../protection-handoff.js";
import {
  recordExecutorEvidence,
  recordReporterFailureOutput,
  writeExecutorEvidence,
} from "../evidence.js";
import {
  deriveReporterFacts,
  evidenceForReporter,
  runReporterWithFormatRetry,
} from "../reporter.js";
import {
  createPipelineState,
  pipelineStateLocation,
  updatePipelineStage,
  writePipelineState,
} from "../pipeline-state.js";
import {
  pinnedExecutor,
  pinnedReporter,
  resolvePinnedRateLimitRunOptions,
  resolveExecDefaultsPath,
  selectCandidates,
  type RateLimitRecoveryEvent,
  type RunOpts,
} from "./shared.js";
import {
  appendParentValidationsToExecutorEvidence,
  buildExecutorPrompt,
  executorRequirements,
  expandPromptRefs,
  extractBlockReason,
  loadRosterForExecutionPath,
  reportProtectionHandoffRecord,
  resolveReporterAgentCandidates,
  runWithRetry,
} from "./agent.js";
import { gradeBeforeReviewPlan } from "./schedule-prepare.js";
import { pipelineRecoveryMeta, spawnBlock, spawnClaim, spawnComplete } from "./mode-shared.js";
import {
  configuredProductCheckouts,
  productRepoEnvironment,
  withoutInheritedRepoEnvironment,
  withAgentExtraRoots,
} from "../task-repos.js";

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
  // A task definition can pin the delegated agent by nickname (Job `task.agent`). An explicit
  // --by still wins so an operator can redirect a single run without editing the definition.
  const by = (
    task?.agent_pipeline
      ? (opts.executorBy ?? opts.by ?? pinnedExecutor(task))
      : (opts.by ?? pinnedExecutor(task))
  )?.trim();
  if (by) {
    const member = resolveAgentMember(roster, by);
    if (task?.agent_pipeline && member?.stage_role !== "executor") {
      throw new Error(`Agent must have stage_role: executor for this pipeline stage: ${by}`);
    }
    const command = member ? resolveMemberCommand(execDefaults, member) : undefined;
    if (!member || !command) throw new Error(`Agent command not found for actor: ${by}`);
    return {
      command,
      actor: member.nickname,
      ...(member.provider ? { provider: member.provider } : {}),
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

// Default two-stage pipeline for in-place runs whose task has no schedule definition (a
// bring-your-own --plan or --deliverable). Stage requirements are left open so explicit
// --executor-by / --reporter-by nicknames (or stage_role-based auto selection) decide the agents.
const DEFAULT_IN_PLACE_AGENT_PIPELINE: AgentPipeline = {
  stages: [{ stage_role: "executor" }, { stage_role: "reporter" }],
};

// Decide whether an in-place run without a schedule-defined task (--plan / --deliverable) uses
// the executor/reporter pipeline. --executor-by / --reporter-by opt in to the pipeline. A --by
// nickname that names a pipeline stage agent is rejected as a configuration error: an executor
// stage agent never writes the result, so a single-agent run would always end with an unfilled
// result instead of a meaningful outcome.
export function resolveInPlaceAgentPipeline(
  task: ReadyTaskView | null,
  roster: MemberRoster | null,
  opts: Pick<RunOpts, "by" | "executorBy" | "reporterBy">,
  source: "plan" | "deliverable",
): AgentPipeline | undefined {
  if (task?.agent_pipeline) return task.agent_pipeline;
  const flag = source === "plan" ? "--plan" : "--deliverable";
  if (opts.executorBy || opts.reporterBy) {
    if (opts.by) {
      throw new Error("--by cannot be combined with --executor-by / --reporter-by.");
    }
    if (!task) {
      throw new Error(
        `${flag} pipeline execution requires a plan with task_id in its frontmatter (the reporter fills the scaffolded result).`,
      );
    }
    return DEFAULT_IN_PLACE_AGENT_PIPELINE;
  }
  const by = opts.by?.trim();
  if (!by) return undefined;
  const member = resolveAgentMember(roster, by);
  if (member?.stage_role === "executor") {
    throw new Error(
      `--by ${by} is a pipeline executor agent (stage_role: executor) and does not write the result. ` +
        `Run ${flag} with --executor-by ${by} --reporter-by <reporter> instead.`,
    );
  }
  if (member?.stage_role === "reporter") {
    throw new Error(
      `--by ${by} is a pipeline reporter agent (stage_role: reporter) and cannot run a plan by itself. ` +
        `Run ${flag} with --executor-by <executor> --reporter-by ${by} instead.`,
    );
  }
  return undefined;
}

export async function spawnAgentInPlace(
  command: string,
  prompt: string,
  cwd: string,
  schedulePath: string,
  executionPath: string,
  resultPath?: string,
  provider?: AgentProvider,
): Promise<number> {
  const protectedConfigBefore = captureAgentProtectedConfigSnapshot(cwd);
  const gitStateBefore = captureAgentGitStateSnapshot(cwd);
  const products = configuredProductCheckouts(schedulePath);
  const child = spawn(
    withAgentExtraRoots(
      command,
      provider,
      products.map((product) => product.path),
    ),
    {
      cwd,
      env: {
        ...withoutInheritedRepoEnvironment(gitEnvironment()),
        SPECDOJO_SCHEDULE_PATH: schedulePath,
        SPECDOJO_EXECUTION_PATH: executionPath,
        ...productRepoEnvironment(cwd, products),
      },
      shell: true,
      stdio: ["pipe", "inherit", "inherit"],
    },
  );
  // executeAgent と同じ理由で、stdin を読まないコマンドの EPIPE は無視する。
  child.stdin.on("error", () => undefined);
  child.stdin.end(prompt);
  const exitCode = await new Promise<number>((resolveExit) => {
    child.once("error", () => resolveExit(1));
    child.once("close", (code) => resolveExit(code ?? 1));
  });
  const protectedConfigChanges = changedAgentProtectedConfigPaths(cwd, protectedConfigBefore);
  if (protectedConfigChanges.length > 0) {
    const reason = agentProtectedConfigViolation(protectedConfigChanges);
    process.stderr.write(`blocked: ${reason}\n`);
    reportProtectionHandoffRecord(
      recordProtectedConfigBlock({
        resultPath,
        repoRoot: cwd,
        paths: protectedConfigChanges,
        reason,
      }),
      resultPath,
    );
    return 1;
  }
  const gitStateChanges = changedAgentGitStateFields(cwd, gitStateBefore);
  if (gitStateChanges.length > 0) {
    const reason = agentGitStateViolation(gitStateChanges);
    process.stderr.write(`blocked: ${reason}\n`);
    reportProtectionHandoffRecord(
      recordGitStateBlock({
        resultPath,
        repoRoot: cwd,
        before: gitStateBefore,
        fields: gitStateChanges,
        reason,
      }),
      resultPath,
    );
    return 1;
  }
  return exitCode;
}

// Default run path: generate the plan on demand and run the agent in the current
// repository. No worktree, and no claim/complete events unless --track-state.
export async function runInPlaceMode(opts: RunOpts): Promise<void> {
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

  // --plan / --deliverable tasks carry no schedule-defined agent_pipeline. Opt in to the
  // executor/reporter pipeline via --executor-by / --reporter-by, and reject a pipeline stage
  // agent passed to --by before it runs (it would leave the result unfilled).
  if (!opts.task) {
    const pipeline = resolveInPlaceAgentPipeline(
      task,
      roster,
      opts,
      opts.plan ? "plan" : "deliverable",
    );
    if (pipeline && task) task.agent_pipeline = pipeline;
  }

  const { command, actor, provider } = resolveInPlaceCommand(task, roster, opts, execDefaults);
  const reporterCandidates =
    task?.agent_pipeline && task
      ? resolveReporterAgentCandidates(
          task,
          roster,
          execDefaults,
          undefined,
          opts.reporterBy ?? pinnedReporter(task),
        )
      : undefined;
  if (task?.agent_pipeline && !reporterCandidates?.length) {
    throw new Error("No agent found for reporter pipeline stage.");
  }
  const label = slug ?? planPath;

  if (opts.dryRun) {
    process.stdout.write(`[dry-run] target: ${label} (state ignored)\n`);
    process.stdout.write(`[dry-run] agent: ${actor}\n`);
    process.stdout.write(`[dry-run] command: ${command}\n`);
    if (reporterCandidates?.[0]) {
      process.stdout.write(`[dry-run] reporter agent: ${reporterCandidates[0].actor ?? "-"}\n`);
      process.stdout.write(`[dry-run] reporter command: ${reporterCandidates[0].command}\n`);
    }
    process.stdout.write(`[dry-run] cwd: ${repoRoot}\n`);
    process.stdout.write(`[dry-run] plan: ${planPath}\n`);
    return;
  }

  // Generate the plan on demand (skip for bring-your-own --plan).
  const generatedPlan = !opts.plan;
  if (opts.task && task) {
    const reviewGradeOutcome = await gradeBeforeReviewPlan({
      task,
      projectId,
      catalogPath,
      repoRoot,
      dryRun: false,
    });
    await generateSinglePlan({
      executionPath,
      projectId,
      catalogPath: catalogPath ?? "",
      rolesPath,
      viewpointsPath,
      projectContext,
      task,
      ...(stem ? { stem } : {}),
      ...(reviewGradeOutcome ? { reviewGradeOutcome } : {}),
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
        ...gitEnvironment(),
        SPECDOJO_SCHEDULE_PATH: schedulePath,
        SPECDOJO_EXECUTION_PATH: executionPath,
      },
      resultPath,
      (opts.executorBy ?? opts.by ?? pinnedExecutor(task))
        ? resolvePinnedRateLimitRunOptions(opts, execDefaults, roster, "executor", {
            command,
            actor,
            provider,
          })
        : undefined,
    );
    const recorded = recordExecutorEvidence({
      repoRoot,
      worktreePath: repoRoot,
      executionPath,
      taskId: task.id,
      runId: pipelineRunId,
      actor: outcome.actor ?? actor,
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
      rateLimitEvents: outcome.rateLimitEvents,
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
            : outcome.protectionBlock
              ? "blocked"
              : outcome.result === "rate_limit"
                ? "rate_limited"
                : "failed",
        attempts: outcome.attempts,
        actor: outcome.actor ?? actor,
        completed_at: executorCompletedAt,
        artifact_ref: pipelineEvidenceRef,
        ...(outcome.rateLimitEvents.length > 0
          ? { rate_limit_events: outcome.rateLimitEvents }
          : {}),
      },
      executorCompletedAt,
    );
    writePipelineState(stateLocation.path, pipelineState);
    process.stdout.write(`Executor evidence: ${pipelineEvidenceRef}\n`);
    if (outcome.result === "success") {
      recorded.evidence = await appendParentValidationsToExecutorEvidence({
        execDefaults,
        cwd: repoRoot,
        evidence: recorded.evidence,
        evidencePath: recorded.evidencePath,
      });
    }
    if (outcome.result === "success") {
      pipelineFailureStage = "reporter";
      const reporterEvidence = evidenceForReporter(recorded.evidence, {
        repoRoot,
        worktreePath: repoRoot,
        executionPath,
        ...(resultPath ? { resultPath } : {}),
      });
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
      let reporterActor = reporterCandidates?.[0]?.actor;
      const reporterRateLimitEvents: RateLimitRecoveryEvent[] = [];
      process.stdout.write(`Running reporter: ${reporterCandidates?.[0]?.command ?? ""}\n`);
      const reporter = await runReporterWithFormatRetry({
        plan: planPrompt,
        evidence: reporterEvidence,
        mode: task.mode ?? "edit",
        invoke: async (reporterPrompt) => {
          const reporterOutcome = await runWithRetry(
            reporterCandidates ?? [],
            reporterPrompt,
            execDefaults,
            repoRoot,
            {
              ...gitEnvironment(),
              SPECDOJO_SCHEDULE_PATH: schedulePath,
              SPECDOJO_EXECUTION_PATH: executionPath,
            },
            resultPath,
            (opts.reporterBy ?? pinnedReporter(task))
              ? resolvePinnedRateLimitRunOptions(
                  opts,
                  execDefaults,
                  roster,
                  "reporter",
                  reporterCandidates![0],
                )
              : undefined,
          );
          reporterAttempts += reporterOutcome.attempts;
          reporterActor = reporterOutcome.actor ?? reporterActor;
          reporterRateLimitEvents.push(...reporterOutcome.rateLimitEvents);
          return {
            result: reporterOutcome.result,
            stdout: reporterOutcome.stdout,
            stderr: reporterOutcome.stderr,
          };
        },
      });
      if (reporterRateLimitEvents.length > 0) {
        recorded.evidence.rate_limit_events = [
          ...(recorded.evidence.rate_limit_events ?? []),
          ...reporterRateLimitEvents,
        ];
        reporterEvidence.rate_limit_events = recorded.evidence.rate_limit_events;
        writeExecutorEvidence(recorded.evidencePath, recorded.evidence);
      }
      if (reporter.result === "success" && resultPath) {
        try {
          await renderReporterResult(resultPath, reporter.output, reporterEvidence);
          const facts = deriveReporterFacts(reporterEvidence, { mode: task.mode ?? "edit" });
          exitCode = facts.outcome === "complete" ? 0 : 1;
          pipelineBlockReason = facts.block_reason || undefined;
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
          actor: reporterActor ?? null,
          completed_at: reporterCompletedAt,
          artifact_ref:
            reporter.result === "success" && resultPath
              ? relative(repoRoot, resultPath).split(sep).join("/")
              : null,
          ...(reporterRateLimitEvents.length > 0
            ? { rate_limit_events: reporterRateLimitEvents }
            : {}),
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
    exitCode = await spawnAgentInPlace(
      command,
      prompt,
      repoRoot,
      schedulePath,
      executionPath,
      resultPath,
      provider,
    );
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
