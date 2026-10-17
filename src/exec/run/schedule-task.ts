import { relative, resolve, sep } from "node:path";
import { type ExecDefaultsConfig } from "../agent-config.js";
import { limitEventMeta, type AgentLimitSignal } from "../limit.js";
import { type AgentStageRole } from "../types.js";
import {
  readResultFrontmatterSnapshot,
  renderReporterResult,
  updateResultStatus,
} from "../results.js";
import { gitOutput } from "../worktree.js";
import { withProductRepoPrompt } from "../task-repos.js";
import {
  commitTargetPaths,
  commitWorktreeChanges,
  isExecBranchMergedIntoCurrent,
  mergeWorktreeIntoCurrent,
  releaseRootWorkingCopies,
  removeWorktree,
  taskTargetsAtHead,
  WorktreeRemovedBranchDeletionError,
  worktreeStatusPaths,
} from "../worktree-ops.js";
import {
  commitProductWorktrees,
  integrateTaskRepositories,
  projectMergeBlockers,
  PROJECT_REPO_NAME,
  RepoIntegrationError,
} from "../repo-integration.js";
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
  loadPipelineResumeCheckpoint,
  pipelineStateLocation,
  updatePipelineStage,
  writePipelineState,
  type PipelineState,
} from "../pipeline-state.js";
import { type AsyncLock, type RateLimitRecoveryEvent, type RunResult } from "./shared.js";
import {
  agentEnvironment,
  appendParentValidationsToExecutorEvidence,
  buildExecutorPrompt,
  extractBlockReason,
  pathInsideWorktree,
  resumedTargetCoverageFailure,
  runWithRetry,
} from "./agent.js";
import { refreshParentValidationsForReporterResume } from "./agent-pipeline.js";
import {
  downgradeUnfilledResult,
  readCompletionPreflight,
  type PreparedTask,
} from "./schedule-prepare.js";
import {
  commitSubject,
  integrateLogPath,
  pipelineRecoveryMeta,
  recordIntegrateStage,
  recordRepoIntegration,
  repoRelativePath,
  spawnBlock,
  spawnComplete,
} from "./mode-shared.js";

export async function runPreparedTask(
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
  let reporterActor = prepared.reporterCandidates?.[0]?.actor;
  const reporterRateLimitEvents: RateLimitRecoveryEvent[] = [];
  let pipelineState: PipelineState | undefined;
  let pipelineStatePath: string | undefined;
  let pipelineStateRef: string | undefined;
  let resumeReporter = false;
  let resumeIntegration = false;

  if (!prepared.pipelineRunId) {
    process.stdout.write(`  Running: ${prepared.agentCandidates[0]?.command ?? ""}\n`);
    const outcome = await runWithRetry(
      prepared.agentCandidates,
      withProductRepoPrompt(prepared.prompt, prepared.worktree.repos),
      execDefaults,
      prepared.worktree.path,
      agentEnvironment(
        repoRoot,
        prepared.worktree.path,
        schedulePath,
        executionPath,
        prepared.worktree.repos,
      ),
      worktreeResultPath,
      prepared.executorRateLimitOptions,
    );
    result = outcome.result;
    stderr = outcome.stderr;
    exitCode = outcome.exitCode;
    stdout = outcome.stdout;
    attempts = outcome.attempts;
    limit = outcome.limit;
    prepared.actor = outcome.actor ?? prepared.actor;
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
      if (prepared.pipelineResumeStage === "integrate") {
        if (
          checkpoint.state.stages.executor.status !== "succeeded" ||
          checkpoint.state.stages.reporter.status !== "succeeded"
        ) {
          throw new Error(
            `integration resume requires succeeded executor and reporter stages for ${prepared.task.id}`,
          );
        }
        executorEvidenceRef = checkpoint.state.stages.executor.artifact_ref ?? undefined;
        resumeIntegration = true;
        process.stdout.write(
          `  Resuming runner-owned integration from pipeline state: ${prepared.pipelineStateRef}\n`,
        );
      } else if (
        prepared.pipelineResumeStage === "reporter" &&
        checkpoint.evidence &&
        checkpoint.state.stages.executor.artifact_ref
      ) {
        executorEvidence = checkpoint.evidence;
        executorEvidenceRef = checkpoint.state.stages.executor.artifact_ref;
        executorEvidencePath = resolve(prepared.worktree.path, executorEvidenceRef);
        resumeReporter = true;
        process.stdout.write(
          `  Resuming reporter from persisted executor evidence: ${executorEvidenceRef}\n`,
        );
        executorEvidence = await refreshParentValidationsForReporterResume({
          execDefaults,
          cwd: prepared.worktree.path,
          productWorktrees: prepared.worktree.repos,
          evidence: executorEvidence,
          evidencePath: executorEvidencePath,
        });
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

  if (prepared.pipelineResumeStage === "integrate" && !resumeIntegration) {
    throw new Error(
      `pipeline state is missing or invalid for integration resume: ${prepared.task.id}`,
    );
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

  if (
    prepared.pipelineRunId &&
    !resumeReporter &&
    !resumeIntegration &&
    pipelineState &&
    pipelineStatePath
  ) {
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
    const executorPrompt =
      prepared.pipelineResumeStage === "executor"
        ? buildExecutorPrompt(prepared.plan, execDefaults.pipeline?.parent_validations, {
            resumed: true,
            existingChanges: worktreeStatusPaths(prepared.worktree.path),
          })
        : prepared.prompt;
    const executorOutcome = await runWithRetry(
      prepared.agentCandidates,
      withProductRepoPrompt(executorPrompt, prepared.worktree.repos),
      execDefaults,
      prepared.worktree.path,
      agentEnvironment(
        repoRoot,
        prepared.worktree.path,
        schedulePath,
        executionPath,
        prepared.worktree.repos,
      ),
      worktreeResultPath,
      prepared.executorRateLimitOptions,
    );
    result = executorOutcome.result;
    stderr = executorOutcome.stderr;
    exitCode = executorOutcome.exitCode;
    stdout = executorOutcome.stdout;
    attempts = executorOutcome.attempts;
    limit = executorOutcome.limit;
    prepared.actor = executorOutcome.actor ?? prepared.actor;
    const recorded = recordExecutorEvidence({
      repoRoot,
      worktreePath: prepared.worktree.path,
      executionPath,
      taskId: prepared.task.id,
      runId: pipelineState.run_id,
      actor: executorOutcome.actor ?? prepared.actor,
      status:
        result === "success" ? "succeeded" : result === "rate_limit" ? "rate_limited" : "failed",
      startedAt: executorStartedAt,
      completedAt: new Date().toISOString(),
      exitCode,
      attempts,
      stdout,
      stderr,
      productWorktrees: prepared.worktree.repos,
      rateLimitEvents: executorOutcome.rateLimitEvents,
    });
    executorEvidenceRef = relative(prepared.worktree.path, recorded.evidencePath)
      .split(sep)
      .join("/");
    executorEvidencePath = recorded.evidencePath;
    executorEvidence = recorded.evidence;
    const coverageFailure =
      result === "success"
        ? resumedTargetCoverageFailure({
            resumed: prepared.pipelineResumeStage === "executor",
            plan: prepared.plan,
            evidence: executorEvidence,
            evidencePath: executorEvidencePath,
          })
        : undefined;
    if (result === "success" && coverageFailure) {
      result = "failure";
      stderr = coverageFailure;
      pipelineBlockReason = coverageFailure;
    }
    const executorCompletedAt = new Date().toISOString();
    pipelineState = updatePipelineStage(
      pipelineState,
      "executor",
      {
        status:
          result === "success"
            ? "succeeded"
            : executorOutcome.protectionBlock
              ? "blocked"
              : result === "rate_limit"
                ? "rate_limited"
                : "failed",
        attempts: pipelineState.stages.executor.attempts + attempts,
        actor: executorOutcome.actor ?? prepared.actor,
        completed_at: executorCompletedAt,
        artifact_ref: executorEvidenceRef,
        ...(executorOutcome.rateLimitEvents.length > 0
          ? { rate_limit_events: executorOutcome.rateLimitEvents }
          : {}),
      },
      executorCompletedAt,
    );
    writePipelineState(pipelineStatePath, pipelineState);
    process.stdout.write(`  Executor evidence: ${executorEvidenceRef}\n`);
    if (result === "success") {
      executorEvidence = await appendParentValidationsToExecutorEvidence({
        execDefaults,
        cwd: prepared.worktree.path,
        productWorktrees: prepared.worktree.repos,
        evidence: executorEvidence,
        evidencePath: executorEvidencePath,
      });
    }
  }

  if (prepared.pipelineRunId && result === "success" && !resumeIntegration) {
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
      const reporterEvidence = evidenceForReporter(executorEvidence, {
        repoRoot,
        worktreePath: prepared.worktree.path,
        executionPath,
        resultPath: worktreeResultPath,
      });
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
        evidence: reporterEvidence,
        mode: prepared.task.mode ?? "edit",
        invoke: async (reporterPrompt) => {
          const outcome = await runWithRetry(
            prepared.reporterCandidates ?? [],
            reporterPrompt,
            execDefaults,
            prepared.worktree.path,
            agentEnvironment(
              repoRoot,
              prepared.worktree.path,
              schedulePath,
              executionPath,
              prepared.worktree.repos,
            ),
            worktreeResultPath,
            prepared.reporterRateLimitOptions,
          );
          reporterAttempts += outcome.attempts;
          reporterActor = outcome.actor ?? reporterActor;
          reporterRateLimitEvents.push(...outcome.rateLimitEvents);
          if (outcome.limit) reporterLimit = outcome.limit;
          return { result: outcome.result, stdout: outcome.stdout, stderr: outcome.stderr };
        },
      });
      if (reporterRateLimitEvents.length > 0 && executorEvidence && executorEvidencePath) {
        executorEvidence.rate_limit_events = [
          ...(executorEvidence.rate_limit_events ?? []),
          ...reporterRateLimitEvents,
        ];
        reporterEvidence.rate_limit_events = executorEvidence.rate_limit_events;
        writeExecutorEvidence(executorEvidencePath, executorEvidence);
      }
      if (reporter.result === "success") {
        try {
          await renderReporterResult(worktreeResultPath, reporter.output, reporterEvidence);
          const facts = deriveReporterFacts(reporterEvidence, {
            mode: prepared.task.mode ?? "edit",
          });
          result = facts.outcome === "complete" ? "success" : "failure";
          pipelineBlockReason = facts.block_reason || undefined;
          if (pipelineBlockReason) stderr = pipelineBlockReason;
          process.stdout.write(
            `  Reporter complete: ${reporterActor ?? "reporter"} (format attempts: ${reporter.formatAttempts})\n`,
          );
          if (result === "success") {
            const reporterCompletedAt = new Date().toISOString();
            pipelineState = updatePipelineStage(
              pipelineState,
              "reporter",
              {
                status: "succeeded",
                attempts: pipelineState.stages.reporter.attempts + reporterAttempts,
                actor: reporterActor ?? null,
                completed_at: reporterCompletedAt,
                artifact_ref: relative(prepared.worktree.path, worktreeResultPath)
                  .split(sep)
                  .join("/"),
                ...(reporterRateLimitEvents.length > 0
                  ? { rate_limit_events: reporterRateLimitEvents }
                  : {}),
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
            actor: reporterActor ?? null,
            completed_at: reporterCompletedAt,
            artifact_ref:
              reporter.result === "success"
                ? relative(prepared.worktree.path, worktreeResultPath).split(sep).join("/")
                : pipelineState.stages.reporter.artifact_ref,
            ...(reporterRateLimitEvents.length > 0
              ? { rate_limit_events: reporterRateLimitEvents }
              : {}),
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

      // A previous attempt may have merged successfully and failed only while removing the
      // worktree. In that case the branch is already contained in HEAD: do not create another
      // commit or merge. Discard only runner-owned lifecycle diffs left by the failure handler,
      // then continue with removal and completion.
      const alreadyMerged =
        resumeIntegration &&
        isExecBranchMergedIntoCurrent({ context, worktree: prepared.worktree });
      try {
        if (alreadyMerged) {
          const lifecyclePaths = new Set(
            [worktreeResultPath, pipelineStatePath]
              .filter((path): path is string => !!path)
              .map((path) => relative(prepared.worktree.path, path).split(sep).join("/")),
          );
          const dirtyTargets = commitTargetPaths(context, prepared.worktree, prepared.task.id);
          const unexpected = dirtyTargets.filter((path) => !lifecyclePaths.has(path));
          if (unexpected.length > 0) {
            throw new Error(
              `already-merged worktree has new task changes: ${unexpected.join(", ")}`,
            );
          }
          if (dirtyTargets.length > 0) {
            gitOutput(prepared.worktree.path, [
              "restore",
              "--source=HEAD",
              "--staged",
              "--worktree",
              "--",
              ...dirtyTargets,
            ]);
          }
          // The merged versions are already at root HEAD; drop the root's stale working copies
          // of the checkpoint files so they do not linger as reverse diffs.
          releaseRootWorkingCopies(
            repoRoot,
            (prepared.checkpointPaths ?? []).map((path) => repoRelativePath(repoRoot, path)),
          );
          process.stdout.write(
            `  [integrate] already merged: ${prepared.worktree.branch} (skipping commit and merge)\n`,
          );
        } else {
          // Record completion and integration start before the first commit. The succeeded state
          // is committed on the project exec branch before its merge, so successful runs retain a
          // durable integrate checkpoint after all worktrees are removed.
          if (worktreeResultPath)
            await updateResultStatus(worktreeResultPath, "complete", completedAt);
          const integrateStartedAt = new Date().toISOString();
          recordIntegrateStage(pipelineStatePath, integrateStartedAt, (current) => ({
            status: "running",
            actor: prepared.actor,
            attempts: (current?.attempts ?? 0) + 1,
            started_at: integrateStartedAt,
            completed_at: null,
          }));
          const mergeMessage = commitSubject(
            `exec(${prepared.task.id}): `,
            prepared.task.name?.trim() || "apply task changes",
          );
          const productNames = (prepared.worktree.repos ?? []).map((product) => product.name);
          try {
            const productOutcomes = commitProductWorktrees({
              worktree: prepared.worktree,
              message: mergeMessage,
              targets: taskTargetsAtHead(context, prepared.worktree, prepared.task.id),
              scopeLogPath: integrateLogPath(pipelineStatePath),
              failureLogPath: integrateLogPath(pipelineStatePath),
              resultPath: worktreeResultPath,
            });
            const productRootNewFiles = productOutcomes.flatMap((outcome) =>
              outcome.rootNewFiles.map((path) => `${outcome.repo}:${path}`),
            );
            commitWorktreeChanges({
              context,
              worktree: prepared.worktree,
              taskId: prepared.task.id,
              scopeLogPath: integrateLogPath(pipelineStatePath),
              failureLogPath: integrateLogPath(pipelineStatePath),
              productsIntegratedByCaller: true,
              productRootNewFiles,
            });
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const repo =
              productNames.find((name) => message.startsWith(`${name}:`)) ?? PROJECT_REPO_NAME;
            recordRepoIntegration(pipelineStatePath, repo, {
              status: "failed",
              error: message,
            });
            throw new RepoIntegrationError({
              repo,
              cause: message,
              integrated: [],
              pending: [...productNames, PROJECT_REPO_NAME],
            });
          }

          integrateTaskRepositories({
            worktree: prepared.worktree,
            mergeMessage,
            checkProject: () =>
              projectMergeBlockers({
                context,
                worktree: prepared.worktree,
                taskId: prepared.task.id,
                releasePaths: prepared.checkpointPaths,
              }),
            beforeProjectMerge: () => {
              if (!pipelineStatePath) return;
              const integrateCompletedAt = new Date().toISOString();
              recordIntegrateStage(pipelineStatePath, integrateCompletedAt, () => ({
                status: "succeeded",
                completed_at: integrateCompletedAt,
              }));
              commitWorktreeChanges({
                context,
                worktree: prepared.worktree,
                taskId: prepared.task.id,
                failureLogPath: integrateLogPath(pipelineStatePath),
                productsIntegratedByCaller: true,
              });
            },
            mergeProject: () =>
              mergeWorktreeIntoCurrent({
                context,
                worktree: prepared.worktree,
                taskId: prepared.task.id,
                message: mergeMessage,
                releaseRootPaths: prepared.checkpointPaths,
                failureLogPath: integrateLogPath(pipelineStatePath),
              }),
            record: (repo, patch) => recordRepoIntegration(pipelineStatePath, repo, patch),
            failureLogPath: integrateLogPath(pipelineStatePath),
            lockPath: schedulePath,
          });
        }

        removeWorktree({
          context,
          worktree: prepared.worktree,
          taskId: prepared.task.id,
          deleteBranch: true,
        });
      } catch (error) {
        if (error instanceof WorktreeRemovedBranchDeletionError) {
          // The task changes are already merged and the worktree is gone. Keep task completion
          // independent from branch housekeeping, but make the residue and recovery command clear.
          process.stderr.write(`Warning: ${error.message}; run exec worktree prune.\n`);
        } else {
          const reason = error instanceof Error ? error.message : String(error);
          const integrateFailedAt = new Date().toISOString();
          recordIntegrateStage(pipelineStatePath, integrateFailedAt, () => ({
            status: "failed",
            completed_at: integrateFailedAt,
          }));
          if (worktreeResultPath)
            await updateResultStatus(worktreeResultPath, "blocked", completedAt, reason);
          spawnBlock(
            projectId,
            prepared.task.id,
            prepared.actor,
            reason,
            pipelineStateRef
              ? pipelineRecoveryMeta({
                  stage: "integrate",
                  evidenceRef: executorEvidenceRef,
                  stateRef: pipelineStateRef,
                  runId: pipelineState?.run_id ?? prepared.pipelineRunId,
                })
              : { limit_deferred: "false" },
          );
          process.stderr.write(`${reason}\n`);
          process.stdout.write(
            `  Blocked: ${prepared.task.id} (worktree kept: ${prepared.worktree.path})\n`,
          );
          return "failure";
        }
      }
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
          ? {
              ...limitEventMeta(activeLimit, {
                attempts: totalAttempts,
                worktree: prepared.worktree.path,
              }),
              ...(prepared.pipelineRunId
                ? pipelineRecoveryMeta({
                    stage: pipelineFailureStage,
                    evidenceRef: executorEvidenceRef,
                    stateRef: pipelineStateRef,
                    runId: pipelineState?.run_id ?? prepared.pipelineRunId,
                  })
                : {}),
            }
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

export type PreparedTaskOutcome = {
  prepared: PreparedTask;
  result: RunResult;
};

export async function runPreparedTaskSafely(
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
