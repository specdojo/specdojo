import { relative, sep } from "node:path";
import type { ExecDefaultsConfig, ProviderConcurrencyGate } from "./exec-agent-config.js";
import {
  recordExecutorEvidence,
  recordParentValidationFailureOutput,
  recordReporterFailureOutput,
  snapshotWorktreeChanges,
  writeExecutorEvidence,
  type ExecEvidence,
} from "./exec-evidence.js";
import {
  failedParentValidationReason,
  hasRecordedParentValidations,
  parentValidationRoots,
  replaceParentValidationResults,
} from "./exec-parent-validation.js";
import {
  createPipelineState,
  pipelineStateLocation,
  updatePipelineStage,
  writePipelineState,
  type PipelineState,
} from "./exec-pipeline-state.js";
import {
  deriveReporterFacts,
  evidenceForReporter,
  runReporterWithFormatRetry,
} from "./exec-reporter.js";
import { renderReporterResult } from "./exec-results.js";
import { randomHex } from "./exec-shared.js";
import { withProductRepoPrompt } from "./exec-task-repos.js";
import type { TaskMode } from "./exec-types.js";
import type { ProductWorktree } from "./exec-worktree.js";
import { worktreeStatusPaths } from "./exec-worktree-ops.js";
import {
  agentEnvironment,
  appendParentValidationsToExecutorEvidence,
  buildExecutorPrompt,
  extractBlockReason,
  resumedTargetCoverageFailure,
  runConfiguredParentValidationBatch,
  runWithRetry,
} from "./exec-run-agent.js";
import type { AgentRunCandidate, RunResult } from "./exec-run-shared.js";

export async function refreshParentValidationsForReporterResume(params: {
  execDefaults: ExecDefaultsConfig;
  cwd: string;
  productWorktrees?: readonly ProductWorktree[];
  evidence: ExecEvidence;
  evidencePath: string;
  // 再開前に統合先の最新を取り込んだ場合は、記録済みの結果が成功でも検証し直す（PJR-GENJ）。
  force?: boolean;
  stageLabel?: string;
}): Promise<ExecEvidence> {
  const configuredEntries = params.execDefaults.pipeline?.parent_validations;
  const force = params.force === true && (configuredEntries?.length ?? 0) > 0;
  if (
    !force &&
    hasRecordedParentValidations(params.evidence.validations, configuredEntries) &&
    !failedParentValidationReason(params.evidence.validations)
  ) {
    return params.evidence;
  }

  process.stdout.write(
    `  Refreshing parent validations before ${params.stageLabel ?? "reporter"} resume` +
      `${force ? " (integration targets were merged into the worktree)" : ""}.\n`,
  );
  const parentValidationBatch = await runConfiguredParentValidationBatch(
    params.execDefaults,
    parentValidationRoots(params.cwd, params.productWorktrees),
    { label: params.evidence.task_id },
  );
  const evidenceWithValidations = replaceParentValidationResults(
    params.evidence,
    parentValidationBatch.validations,
  );
  const evidence = recordParentValidationFailureOutput({
    worktreePath: params.cwd,
    evidencePath: params.evidencePath,
    evidence: evidenceWithValidations,
    failureOutputs: parentValidationBatch.failureOutputs,
  });
  if (parentValidationBatch.failureOutputs.length === 0) {
    writeExecutorEvidence(params.evidencePath, evidence);
  }
  process.stdout.write(
    `  Refreshed executor evidence: ${relative(params.cwd, params.evidencePath).split(sep).join("/")}\n`,
  );
  return evidence;
}

// register pipeline の reporter 段だけを実行する。executor 直後の通常経路と、executor が
// 成功したまま reporter だけが失敗した run の再開経路の双方から共有し、reporter 起動・
// result 描画・pipeline-state 更新のみを担う（register の状態遷移と commit は呼び出し側）。
export async function runReporterStage(params: {
  repoRoot: string;
  cwd: string;
  schedulePath: string;
  executionPath: string;
  reporterCandidates: AgentRunCandidate[];
  planPrompt: string;
  resultPath: string;
  registerPaths?: readonly string[];
  execDefaults: ExecDefaultsConfig;
  evidence: ExecEvidence;
  evidencePath: string;
  state: PipelineState;
  statePath: string;
  providerConcurrencyGate?: ProviderConcurrencyGate;
  productWorktrees?: readonly ProductWorktree[];
  /** reporter が返す出力の mode。省略時は edit（Job Run の review だけが review を渡す）。 */
  mode?: TaskMode;
}): Promise<{
  exitCode: 0 | 1;
  runResult: RunResult;
  blockReason?: string;
  state: PipelineState;
}> {
  const { repoRoot, cwd, schedulePath, executionPath, reporterCandidates, execDefaults } = params;
  const env = agentEnvironment(repoRoot, cwd, schedulePath, executionPath, params.productWorktrees);
  const reporterEvidence = evidenceForReporter(params.evidence, {
    repoRoot,
    worktreePath: cwd,
    executionPath,
    resultPath: params.resultPath,
    ...(params.registerPaths ? { registerPaths: params.registerPaths } : {}),
  });
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
  const runReporter = () =>
    runReporterWithFormatRetry({
      plan: params.planPrompt,
      evidence: reporterEvidence,
      mode: params.mode ?? "edit",
      invoke: async (reporterPrompt) => {
        const reporterOutcome = await runWithRetry(
          reporterCandidates,
          reporterPrompt,
          execDefaults,
          cwd,
          env,
          params.resultPath,
        );
        reporterAttempts += reporterOutcome.attempts;
        return {
          result: reporterOutcome.result,
          stdout: reporterOutcome.stdout,
          stderr: reporterOutcome.stderr,
        };
      },
    });
  const reporter = params.providerConcurrencyGate
    ? await params.providerConcurrencyGate.run(
        reporterCandidates[0]?.provider,
        runReporter,
        `${params.evidence.task_id} reporter`,
      )
    : await runReporter();

  let exitCode: 0 | 1 = 1;
  let blockReason: string | undefined;
  if (reporter.result === "success") {
    try {
      await renderReporterResult(params.resultPath, reporter.output, reporterEvidence);
      const facts = deriveReporterFacts(reporterEvidence, { mode: params.mode ?? "edit" });
      exitCode = facts.outcome === "complete" ? 0 : 1;
      blockReason = facts.block_reason || undefined;
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

// 1件の plan/result を executor→reporter の2段階で実行する。register 項目と Job Run の
// 双方が使い、in-place（cwd: repoRoot）・worktree（cwd: worktree.path）から共有する。
// evidence・pipeline-state の記録先は
// Schedule タスクの pipeline と同じ形式（exec/evidence/<taskId>/<runId>/）にすることで、
// 監査証跡のフォーマットを実行経路によらず統一する。state には plan / result の参照も
// 記録し、reporter だけが失敗した場合に `--resume` が入力を復元できるようにする。
export async function runAgentPipeline(params: {
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
  registerPaths?: readonly string[];
  execDefaults: ExecDefaultsConfig;
  resumedExecutor?: boolean;
  initialChangeTargets?: readonly string[];
  resumeHandoff?: readonly string[];
  providerConcurrencyGate?: ProviderConcurrencyGate;
  productWorktrees?: readonly ProductWorktree[];
  runId?: string;
  /** reporter が返す出力の mode。省略時は edit。 */
  mode?: TaskMode;
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
  const runId = params.runId ?? `${new Date().toISOString().replace(/[-:.]/g, "")}-${randomHex(4)}`;
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

  const env = agentEnvironment(repoRoot, cwd, schedulePath, executionPath, params.productWorktrees);
  const executorPrompt = withProductRepoPrompt(
    buildExecutorPrompt(planPrompt, execDefaults.pipeline?.parent_validations, {
      mode: params.mode ?? "edit",
      resumed: params.resumedExecutor,
      ...(params.resumedExecutor ? { existingChanges: worktreeStatusPaths(cwd) } : {}),
      ...(params.resumedExecutor
        ? { initialChangeTargets: params.initialChangeTargets ?? [] }
        : {}),
      ...(params.resumedExecutor ? { resumeHandoff: params.resumeHandoff ?? [] } : {}),
    }),
    params.productWorktrees,
  );
  const changesBeforeAttempt = snapshotWorktreeChanges(cwd, params.productWorktrees);
  const runExecutor = () =>
    runWithRetry([executor], executorPrompt, execDefaults, cwd, env, resultPath);
  const outcome = params.providerConcurrencyGate
    ? await params.providerConcurrencyGate.run(executor.provider, runExecutor, `${taskId} executor`)
    : await runExecutor();
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
    changesBeforeAttempt,
    productWorktrees: params.productWorktrees,
  });
  const coverageFailure =
    outcome.result === "success"
      ? resumedTargetCoverageFailure({
          resumed: !!params.resumedExecutor,
          plan: planPrompt,
          evidence: recorded.evidence,
          evidencePath: recorded.evidencePath,
          initialChangeTargets: params.initialChangeTargets,
        })
      : undefined;
  const executorResult: RunResult = coverageFailure ? "failure" : outcome.result;
  const evidenceRef = relative(cwd, recorded.evidencePath).split(sep).join("/");
  const executorCompletedAt = new Date().toISOString();
  state = updatePipelineStage(
    state,
    "executor",
    {
      status:
        executorResult === "success"
          ? "succeeded"
          : outcome.protectionBlock
            ? "blocked"
            : executorResult === "rate_limit"
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

  if (executorResult !== "success") {
    const blockReason =
      coverageFailure ??
      (executorResult === "rate_limit"
        ? "executor rate limit reached"
        : extractBlockReason(outcome.stderr));
    return {
      exitCode: 1,
      runResult: executorResult,
      blockReason,
      stateRef: stateLocation.ref,
      evidenceRef,
    };
  }

  recorded.evidence = await appendParentValidationsToExecutorEvidence({
    execDefaults,
    cwd,
    productWorktrees: params.productWorktrees,
    evidence: recorded.evidence,
    evidencePath: recorded.evidencePath,
  });

  const reporterOutcome = await runReporterStage({
    repoRoot,
    cwd,
    schedulePath,
    executionPath,
    reporterCandidates,
    planPrompt,
    resultPath,
    registerPaths: params.registerPaths,
    execDefaults,
    evidence: recorded.evidence,
    evidencePath: recorded.evidencePath,
    state,
    statePath: stateLocation.path,
    providerConcurrencyGate: params.providerConcurrencyGate,
    productWorktrees: params.productWorktrees,
    mode: params.mode,
  });

  return {
    exitCode: reporterOutcome.exitCode,
    runResult: reporterOutcome.runResult,
    blockReason: reporterOutcome.blockReason,
    stateRef: stateLocation.ref,
    evidenceRef,
  };
}
