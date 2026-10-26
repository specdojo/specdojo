import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { type ExecDefaultsConfig } from "../agent-config.js";
import { qualifyTaskId } from "../shared.js";
import { type MemberRoster } from "../../shared/specdojo-config.js";
import {
  requireRunnableRegisterItem,
  resolveRegisterRunTarget,
  sanitizeRegisterConclusion,
  ticketPathFromItem,
  type RegisterItemSummary,
} from "../register.js";
import { type PjrItem, type RegisterPaths } from "../../register/register.js";
import { readResultFrontmatterSnapshot } from "../results.js";
import { findExecWorktree, type ExecWorktree } from "../worktree.js";
import {
  configuredProductRepos,
  missingProductWorktrees,
  resumeIntegrationBranches,
  withProductWorktrees,
  type ProductRepo,
} from "../task-repos.js";
import { currentBranch, isExecBranchMergedIntoCurrent } from "../worktree-ops.js";
import {
  syncTaskWorktreesWithIntegrationTargets,
  type IntegrationTargetSync,
} from "../repo-integration.js";
import { failedParentValidationReason } from "../parent-validation.js";
import {
  findResumableRegisterRun,
  resolveRegisterResumeArtifacts,
  type RegisterResumeTarget,
} from "../register-resume.js";
import { integratedRepoNames } from "../pipeline-state.js";
import {
  resolveAgentOverride,
  resolvePinnedRateLimitRunOptions,
  rateLimitRecoveryReason,
  type AgentRunCandidate,
  type AsyncLock,
  type RunOpts,
} from "./shared.js";
import { expandPromptRefs } from "./agent.js";
import {
  refreshParentValidationsForReporterResume,
  runAgentPipeline,
  runReporterStage,
} from "./agent-pipeline.js";
import { repoRelativePath } from "./mode-shared.js";
import {
  spawnRegisterTransition,
  type RegisterRunContext,
  registerReporterManagedPaths,
} from "./register-core.js";
import {
  copyRepoPaths,
  registerTransitionPaths,
  registerBookkeepingPaths,
  rebuildRootRegisterViews,
} from "./register-state.js";
import { finalizeRegisterWorktreeRun } from "./register-worktree.js";

// reporter 再開に使う agent を解決する。--reporter-by を優先し、省略時は再開対象 run の
// pipeline-state に記録された reporter actor（通常は前回と同じ agent）へフォールバックする。
export function resolveRegisterResumeReporter(
  roster: MemberRoster | null,
  opts: Pick<RunOpts, "reporterBy">,
  execDefaults: ExecDefaultsConfig,
  recordedActor: string | null,
):
  | { kind: "command"; candidate: AgentRunCandidate & { actor: string } }
  | { kind: "error"; message: string } {
  const nickname = (opts.reporterBy ?? recordedActor ?? "").trim();
  if (!nickname) {
    return {
      kind: "error",
      message: "reporter agent is unknown for this run; specify --reporter-by <nickname>",
    };
  }
  const resolution = resolveAgentOverride("edit", nickname, {}, roster, execDefaults, "reporter");
  if (resolution.kind === "error") {
    return { kind: "error", message: resolution.message.replace(/^--by/, "--reporter-by") };
  }
  if (resolution.kind !== "command") {
    return {
      kind: "error",
      message: `reporter agent not found in agent-members.yaml: ${nickname}`,
    };
  }
  return {
    kind: "command",
    candidate: {
      command: resolution.command,
      actor: resolution.actor ?? nickname,
      provider: resolution.provider,
    },
  };
}

// stale な running executor を既存 worktree 上で再実行するときの agent を解決する。
// --executor-by を優先し、省略時は pipeline-state に記録された actor を引き継ぐ。
export function resolveRegisterResumeExecutor(
  roster: MemberRoster | null,
  opts: Pick<RunOpts, "executorBy">,
  execDefaults: ExecDefaultsConfig,
  recordedActor: string | null,
):
  | { kind: "command"; candidate: AgentRunCandidate & { actor: string } }
  | { kind: "error"; message: string } {
  const nickname = (opts.executorBy ?? recordedActor ?? "").trim();
  if (!nickname) {
    return {
      kind: "error",
      message: "executor agent is unknown for this run; specify --executor-by <nickname>",
    };
  }
  const resolution = resolveAgentOverride("edit", nickname, {}, roster, execDefaults, "executor");
  if (resolution.kind === "error") {
    return { kind: "error", message: resolution.message.replace(/^--by/, "--executor-by") };
  }
  if (resolution.kind !== "command") {
    return {
      kind: "error",
      message: `executor agent not found in agent-members.yaml: ${nickname}`,
    };
  }
  return {
    kind: "command",
    candidate: {
      command: resolution.command,
      actor: resolution.actor ?? nickname,
      provider: resolution.provider,
    },
  };
}

// 統合段だけの再開。executor と reporter が成功済みで、commit → merge → worktree 撤去のいずれかが
// 失敗した run を、agent を1つも起動せずに統合からやり直す。worktree の成果物と evidence をそのまま
// 使い、成功なら通常実行と同じ review 遷移、merge 前の失敗なら waiting へ戻す。すでに merge
// 済みなら review を維持して cleanup だけを再試行する（失敗時も worktree は保持する）。
export async function resumeRegisterIntegration(params: {
  context: RegisterRunContext;
  opts: RunOpts;
  registerPaths: RegisterPaths;
  item: PjrItem;
  ticketPath: string | null;
  worktree: ExecWorktree;
  target: RegisterResumeTarget;
  stem: string;
  worktreeResultPath: string;
  actor: string;
  bookkeepingPaths: () => readonly string[];
  begin: (actor: string, transitionReason: string) => Promise<RegisterItemSummary | null>;
  lifecycleLock?: AsyncLock;
  // 再開前に統合先の最新を worktree へ取り込んだか（PJR-GENJ）。取り込んだ場合は親検証をやり直す。
  syncedIntegrationTargets?: boolean;
}): Promise<RegisterItemSummary> {
  const { item, worktree, target, worktreeResultPath, actor } = params;

  process.stdout.write(`Register item: ${item.id} — ${item.title}  [${item.type}]\n`);
  process.stdout.write(
    `  Resuming integration from run ${target.runId} (reporter result: ${params.stem}-result.md)\n` +
      `  CWD: ${worktree.path}\n  Actor: ${actor} (runner-owned integration)\n`,
  );

  // waiting のまま統合しないよう、通常実行と同じく in-progress へ戻してから統合する。ただし
  // merge 済みで worktree 撤去だけを再試行する場合は、root はすでに review なので遷移を
  // 再記録しない（finalize は cleanup だけを行う）。
  let validationFailure: string | undefined;
  if (
    !isExecBranchMergedIntoCurrent({
      context: {
        repoRoot: params.context.repoRoot,
        schedulePath: params.context.schedulePath,
        executionPath: params.context.executionPath,
      },
      worktree,
    })
  ) {
    const beginFailure = await params.begin(actor, "integration resumed");
    if (beginFailure) return beginFailure;

    // PJR-GENJ: 統合先の最新を取り込んだ worktree で親検証をやり直し、失敗なら統合せず waiting へ
    // 戻す。前回の親検証が失敗・未記録の場合も同じく検証してから統合する。
    if (target.stage === "integrate") {
      const evidence = await refreshParentValidationsForReporterResume({
        execDefaults: params.context.execDefaults,
        cwd: worktree.path,
        productWorktrees: worktree.repos,
        evidence: target.evidence,
        evidencePath: resolve(worktree.path, target.evidenceRef),
        force: params.syncedIntegrationTargets,
        stageLabel: "integration",
      });
      validationFailure = failedParentValidationReason(evidence.validations);
    }
  }

  // reporter が記入済みの result をそのまま使う。agent は起動しないため、成果は success 扱いで
  // 統合だけを実行する（result が未記入なら finalize 側の downgrade が blocked に落とす）。
  const resultScaffold = readResultFrontmatterSnapshot(worktreeResultPath);
  const finalize = async (): Promise<RegisterItemSummary> =>
    finalizeRegisterWorktreeRun({
      context: params.context,
      opts: params.opts,
      registerPaths: params.registerPaths,
      item,
      ticketPath: params.ticketPath,
      worktree,
      stem: params.stem,
      worktreeResultPath,
      resultScaffold,
      agentResult: validationFailure ? "failure" : "success",
      stderr: validationFailure ?? "",
      ...(validationFailure ? { runnerBlockReason: validationFailure } : {}),
      actor,
      bookkeepingPaths: params.bookkeepingPaths(),
      pipelineStatePath: target.statePath,
      resumedIntegration: true,
    });

  return params.lifecycleLock ? params.lifecycleLock.runExclusive(finalize) : finalize();
}

// register 項目1件の再開。途中で止まった run を、既存 worktree と evidence を保持したまま
// 止まった段からやり直す。running のまま残った executor は同じ plan/result と worktree 上で
// 再実行し、reporter 段の再開は reporter だけを起動する。統合段は agent を起動せずに
// commit → merge → worktree 撤去だけをやり直す。入力は対象 run の
// `pipeline-state.json`（plan / result の参照と stage 状態）と `evidence.json`（executor の記録）で、
// 成功後の commit → merge → register review は通常実行と同じ finalizeRegisterWorktreeRun を通す。
// 再開できない場合（worktree 不在、入力成果物欠損など）は破壊的操作を行わず理由を返す。
export async function resumeSingleRegisterItemWorktree(
  context: RegisterRunContext,
  opts: RunOpts,
  pjrId: string,
  lifecycleLock?: AsyncLock,
): Promise<RegisterItemSummary> {
  const { projectId, schedulePath, executionPath, repoRoot } = context;
  const { registerPaths, item } = resolveRegisterRunTarget(projectId, pjrId);
  const ticketPath = ticketPathFromItem(item, registerPaths.projectRegisterPath);
  requireRunnableRegisterItem(item);

  // 再開できない場合は register の状態も worktree も変更せず、理由だけを返す。
  const refuse = (reason: string): RegisterItemSummary => {
    process.stderr.write(`resume refused: ${item.id}: ${reason}\n`);
    return {
      id: item.id,
      title: item.title,
      outcome: "failure",
      transition: "none",
      commit: "off",
      reason: sanitizeRegisterConclusion(reason),
    };
  };

  const worktreeTaskId = qualifyTaskId(projectId, item.id);
  const foundWorktree = findExecWorktree(repoRoot, worktreeTaskId);
  if (!foundWorktree) {
    return refuse(`no exec worktree to resume for ${item.id}; run the item again instead`);
  }
  const lookup = findResumableRegisterRun({
    repoRoot,
    worktreePath: foundWorktree.path,
    executionPath,
    taskId: item.id,
    ...(opts.resumeFrom === "executor" ? { resumeFrom: "executor" } : {}),
  });
  if (lookup.kind !== "resumable") return refuse(lookup.reason);
  const target = lookup.target;

  // PJR-XRAB: run 開始時の --integration-branch を checkpoint から引き継ぐ。再開時に別の統合先を
  // 指定することは認めない（run の途中で統合先が変わると、開始点と統合先が食い違う）。
  let products: ProductRepo[];
  let integrationBranchOverrides: Record<string, string> | undefined;
  try {
    const overrides = resumeIntegrationBranches(
      target.state.integration_branches,
      opts.integrationBranch,
    );
    products = configuredProductRepos(schedulePath, overrides);
    integrationBranchOverrides = overrides.size > 0 ? Object.fromEntries(overrides) : undefined;
  } catch (error) {
    return refuse(error instanceof Error ? error.message : String(error));
  }
  // PJR-98G4: プロダクトの worktree も揃っていることを再開の条件にする。欠けたまま再開すると、
  // agent がプロダクト側の変更先を失う。
  const worktree = withProductWorktrees(foundWorktree, products, worktreeTaskId);
  const missingProducts = missingProductWorktrees(products, worktree);
  if (missingProducts.length > 0) {
    return refuse(
      `product worktrees are missing for ${item.id}: ${missingProducts.join(", ")}; ` +
        `run the item again instead`,
    );
  }

  const artifacts = resolveRegisterResumeArtifacts({
    repoRoot,
    worktreePath: worktree.path,
    executionPath,
    taskId: item.id,
    state: target.state,
  });
  if (!artifacts) return refuse(`cannot restore the plan/result of run ${target.runId}`);

  const worktreeResultPath = resolve(worktree.path, artifacts.resultRef);
  if (!existsSync(worktreeResultPath)) {
    return refuse(`result not found in the worktree: ${artifacts.resultRef}`);
  }

  // root 側の実行管理ファイル。plan / result は前回の wait commit で統合ブランチに入っている。
  // begin は個票と event を root へ写し、派生ビューを再生成する。その後の差分を拾うため、
  // 再開開始前に集合を固定せず finalize の直前に評価する。
  const bookkeepingPaths = (): string[] =>
    registerBookkeepingPaths({
      repoRoot,
      executionPath,
      registerPaths,
      planPath: resolve(repoRoot, artifacts.planRef),
      resultPath: resolve(repoRoot, artifacts.resultRef),
      ticketPath,
    });

  // waiting のまま再開しないよう、通常実行と同じく in-progress へ戻す。遷移は exec branch
  // 側の worktree で記録し（統合ブランチに独立した resume commit を作らない）、成功時は
  // review とともに merge commit へ畳み込む。再び失敗した場合は finalize が start / wait を
  // root の wait commit 1件へまとめる。root には個票・イベントを未 commit のまま写し、
  // 実行中の状態が root からも見えるようにする（merge 前に解放する）。
  const begin = async (
    actor: string,
    transitionReason: string,
  ): Promise<RegisterItemSummary | null> => {
    const start = (): RegisterItemSummary | null => {
      if (
        !spawnRegisterTransition(
          projectId,
          ["start", "--id", item.id, "--by", actor, "--reason", transitionReason],
          worktree.path,
        )
      ) {
        return refuse(`register start failed: ${item.id}`);
      }
      copyRepoPaths(
        worktree.path,
        repoRoot,
        repoRoot,
        registerTransitionPaths(registerPaths, ticketPath),
      );
      rebuildRootRegisterViews(projectId, item.id);
      return null;
    };
    return lifecycleLock ? lifecycleLock.runExclusive(start) : start();
  };

  // PJR-GENJ / PJR-PG6W: どの段の再開でも、親検証または agent の起動前に統合先の最新を exec
  // branch と worktree へ取り込む。wait 後に統合先で直した不具合や、人が適用した保護対象設定を
  // executor に反映するためである。register の遷移（begin）より前に行い、取り込めない場合は状態を
  // 変えずに再開を拒否する。merge 済みで撤去だけが残る統合再開は取り込まない。
  // PJR-6RN3: 前回の統合段で統合済み（merged / unchanged）と記録されたプロダクトも取り込まない。
  // 取り込むと exec branch に新しい merge commit ができ、統合段がそのプロダクトを再び統合する。
  let syncedIntegrationTargets = false;
  if (
    !isExecBranchMergedIntoCurrent({
      context: { repoRoot, schedulePath, executionPath },
      worktree,
    })
  ) {
    let synced: IntegrationTargetSync[];
    try {
      const projectTarget = currentBranch(repoRoot);
      process.stdout.write(
        `  Syncing integration targets before ${target.stage} resume: ${item.id}\n`,
      );
      synced = syncTaskWorktreesWithIntegrationTargets({
        worktree,
        projectTarget,
        message: `exec(register ${item.id}): merge integration target before resume`,
        projectTheirsPaths: bookkeepingPaths().map((path) => repoRelativePath(repoRoot, path)),
        integratedProducts: integratedRepoNames(target.state),
      });
    } catch (error) {
      return refuse(
        `cannot sync the worktree with the integration target before resume: ` +
          `${error instanceof Error ? error.message : String(error)}; ` +
          `resolve it in ${worktree.path} and resume again`,
      );
    }
    for (const entry of synced) {
      process.stdout.write(
        `  [sync] ${entry.repo}: ${entry.status} (${entry.target})` +
          `${entry.detail ? ` — ${entry.detail}` : ""}\n`,
      );
    }
    syncedIntegrationTargets = synced.some((entry) => entry.status === "merged");
  }

  if (target.stage === "integrate") {
    // 統合は runner の作業だが、register の遷移とイベントには実行者が必要になる。前回 run の
    // reporter（無ければ executor）を引き継ぎ、--reporter-by で明示指定もできる。
    const actor = (
      opts.reporterBy ??
      target.state.stages.reporter.actor ??
      target.state.stages.executor.actor ??
      ""
    ).trim();
    if (!actor) {
      return refuse(
        `the actor of run ${target.runId} is unknown; specify --reporter-by <nickname>`,
      );
    }
    return resumeRegisterIntegration({
      context,
      opts,
      registerPaths,
      item,
      ticketPath,
      worktree,
      target,
      stem: artifacts.stem,
      worktreeResultPath,
      actor,
      bookkeepingPaths,
      begin,
      lifecycleLock,
      syncedIntegrationTargets,
    });
  }

  // plan は root（統合ブランチ）の checkpoint 済みファイルを正本にする。worktree 側の plan は
  // agent が書き換えられるため、再開のプロンプト入力には使わない。
  const planPath = resolve(repoRoot, artifacts.planRef);
  if (!existsSync(planPath))
    return refuse(`plan not found for the resumed run: ${artifacts.planRef}`);
  const prompt = expandPromptRefs(readFileSync(planPath, "utf8"));

  if (target.stage === "executor") {
    const executor = resolveRegisterResumeExecutor(
      context.roster,
      opts,
      context.execDefaults,
      target.state.stages.executor.actor,
    );
    if (executor.kind === "error") return refuse(executor.message);
    const reporter = resolveRegisterResumeReporter(
      context.roster,
      opts,
      context.execDefaults,
      target.state.stages.reporter.actor,
    );
    if (reporter.kind === "error") return refuse(reporter.message);

    process.stdout.write(`Register item: ${item.id} — ${item.title}  [${item.type}]\n`);
    process.stdout.write(
      `  Resuming executor from run ${target.runId} in a new pipeline checkpoint\n` +
        `  CWD: ${worktree.path}\n  Agent: ${executor.candidate.actor} (executor)\n`,
    );

    const beginFailure = await begin(executor.candidate.actor, "executor resumed");
    if (beginFailure) return beginFailure;

    const resultScaffold = readResultFrontmatterSnapshot(worktreeResultPath);
    const outcome = await runAgentPipeline({
      repoRoot,
      cwd: worktree.path,
      schedulePath,
      executionPath,
      taskId: item.id,
      executor: executor.candidate,
      reporterCandidates: [reporter.candidate],
      planPath,
      planPrompt: prompt,
      resultPath: worktreeResultPath,
      registerPaths: registerReporterManagedPaths(registerPaths),
      execDefaults: context.execDefaults,
      resumedExecutor: true,
      initialChangeTargets: target.initialChanges,
      resumeHandoff: target.handoff,
      providerConcurrencyGate: context.providerConcurrencyGate,
      productWorktrees: worktree.repos,
      ...(integrationBranchOverrides ? { integrationBranchOverrides } : {}),
      executorRateLimitOptions: resolvePinnedRateLimitRunOptions(
        opts,
        context.execDefaults,
        context.roster,
        "executor",
        executor.candidate,
      ),
      reporterRateLimitOptions: resolvePinnedRateLimitRunOptions(
        opts,
        context.execDefaults,
        context.roster,
        "reporter",
        reporter.candidate,
      ),
    });

    const finalize = async (): Promise<RegisterItemSummary> =>
      finalizeRegisterWorktreeRun({
        context,
        opts,
        registerPaths,
        item,
        ticketPath,
        worktree,
        stem: artifacts.stem,
        worktreeResultPath,
        resultScaffold,
        agentResult: outcome.runResult,
        stderr: outcome.blockReason ?? "",
        runnerBlockReason: outcome.blockReason,
        actor: executor.candidate.actor,
        bookkeepingPaths: bookkeepingPaths(),
        pipelineStatePath: resolve(worktree.path, outcome.stateRef),
        transitionReason: rateLimitRecoveryReason(outcome.rateLimitEvents) || undefined,
      });
    return lifecycleLock ? lifecycleLock.runExclusive(finalize) : finalize();
  }

  const reporter = resolveRegisterResumeReporter(
    context.roster,
    opts,
    context.execDefaults,
    target.state.stages.reporter.actor,
  );
  if (reporter.kind === "error") return refuse(reporter.message);

  process.stdout.write(`Register item: ${item.id} — ${item.title}  [${item.type}]\n`);
  process.stdout.write(
    `  Resuming reporter from run ${target.runId} (executor evidence: ${target.evidenceRef})\n` +
      `  CWD: ${worktree.path}\n  Agent: ${reporter.candidate.actor} (reporter)\n`,
  );

  const beginFailure = await begin(reporter.candidate.actor, "reporter resumed");
  if (beginFailure) return beginFailure;

  const evidence = await refreshParentValidationsForReporterResume({
    execDefaults: context.execDefaults,
    cwd: worktree.path,
    productWorktrees: worktree.repos,
    evidence: target.evidence,
    evidencePath: resolve(worktree.path, target.evidenceRef),
    force: syncedIntegrationTargets,
  });

  const resultScaffold = readResultFrontmatterSnapshot(worktreeResultPath);
  const outcome = await runReporterStage({
    repoRoot,
    cwd: worktree.path,
    schedulePath,
    executionPath,
    reporterCandidates: [reporter.candidate],
    planPrompt: prompt,
    resultPath: worktreeResultPath,
    registerPaths: registerReporterManagedPaths(registerPaths),
    execDefaults: context.execDefaults,
    evidence,
    evidencePath: resolve(worktree.path, target.evidenceRef),
    state: target.state,
    statePath: target.statePath,
    providerConcurrencyGate: context.providerConcurrencyGate,
    rateLimitOptions: resolvePinnedRateLimitRunOptions(
      opts,
      context.execDefaults,
      context.roster,
      "reporter",
      reporter.candidate,
    ),
    productWorktrees: worktree.repos,
  });

  const finalize = async (): Promise<RegisterItemSummary> =>
    finalizeRegisterWorktreeRun({
      context,
      opts,
      registerPaths,
      item,
      ticketPath,
      worktree,
      stem: artifacts.stem,
      worktreeResultPath,
      resultScaffold,
      agentResult: outcome.runResult,
      stderr: outcome.blockReason ?? "",
      actor: reporter.candidate.actor,
      bookkeepingPaths: bookkeepingPaths(),
      pipelineStatePath: target.statePath,
      transitionReason:
        rateLimitRecoveryReason(outcome.state.stages.reporter.rate_limit_events ?? []) || undefined,
    });

  return lifecycleLock ? lifecycleLock.runExclusive(finalize) : finalize();
}
