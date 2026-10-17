import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { qualifyTaskId, randomHex } from "./shared.js";
import { type AgentProvider } from "../shared/specdojo-config.js";
import { buildInPlaceStem } from "./plans.js";
import {
  generateRegisterPlan,
  requireRunnableRegisterItem,
  resolveRegisterRunTarget,
  sanitizeRegisterConclusion,
  ticketPathFromItem,
  type RegisterItemSummary,
} from "./register.js";
import { type PjrItem, type RegisterPaths } from "../register/register.js";
import { readResultFrontmatterSnapshot, scaffoldResult, updateResultStatus } from "./results.js";
import { findExecWorktree, gitOutput, type ExecWorktree } from "./worktree.js";
import { configuredProductRepos, withProductRepoPrompt } from "./task-repos.js";
import {
  checkpointAndEnsureWorktree,
  commitTargetPaths,
  commitWorktreeChanges,
  discardStaleExecWorktree,
  isExecBranchMergedIntoCurrent,
  mergeWorktreeIntoCurrent,
  removeWorktree,
  taskTargetsAtHead,
  WorktreeRemovedBranchDeletionError,
  worktreeStatusPaths,
} from "./worktree-ops.js";
import {
  commitProductWorktrees,
  integrateTaskRepositories,
  projectMergeBlockers,
  PROJECT_REPO_NAME,
  RepoIntegrationError,
} from "./repo-integration.js";
import {
  productIntegrationTrace,
  recordResultTrace,
  refsTrailer,
  registerProjectMergeMessage,
  traceKey,
  withCommitTrailers,
} from "./repo-trace.js";
import { pipelineStateLocation, readPipelineState } from "./pipeline-state.js";
import { findResumableRegisterRun } from "./register-resume.js";
import { type AsyncLock, type RunOpts, type RunResult } from "./run-shared.js";
import {
  agentEnvironment,
  expandPromptRefs,
  extractBlockReason,
  pathInsideWorktree,
  reportProductWorktrees,
  runWithRetry,
} from "./run-agent.js";
import { runAgentPipeline } from "./run-agent-pipeline.js";
import { downgradeUnfilledResult } from "./run-schedule-prepare.js";
import {
  commitSubject,
  integrateLogPath,
  recordIntegrateStage,
  recordRepoIntegration,
  repoRelativePath,
} from "./run-mode-shared.js";
import {
  resolveRegisterCommand,
  isRegisterPipelineRequested,
  resolveRegisterPipelineCommand,
  spawnRegisterTransition,
  type RegisterRunContext,
  registerRunnerManagedPaths,
  registerReporterManagedPaths,
} from "./run-register-core.js";
import {
  commitRegisterState,
  registerPathsInsideWorktree,
  rebuildRootRegisterViews,
  registerWaitSummary,
} from "./run-register-state.js";

// 全体再実行が既存 run の未統合成果を破棄しないための保護。既存 worktree に再開可能な run
// （executor 成功済みで reporter か統合が未完了）が残っている場合だけ理由を返し、呼び出し側が
// 破壊的操作（discardStaleExecWorktree）の手前で中断できるようにする。--force-restart で無効化できる。
export function protectResumableRegisterWorktree(
  context: RegisterRunContext,
  opts: RunOpts,
  taskId: string,
  worktreeTaskId: string,
): string | null {
  if (opts.forceRestart) return null;
  const worktree = findExecWorktree(context.repoRoot, worktreeTaskId);
  if (!worktree) return null;
  const lookup = findResumableRegisterRun({
    repoRoot: context.repoRoot,
    worktreePath: worktree.path,
    executionPath: context.executionPath,
    taskId,
  });
  if (lookup.kind !== "resumable") return null;
  const { stage, runId } = lookup.target;
  const stopped =
    stage === "integrate"
      ? `run ${runId} finished the reporter but not the integration`
      : stage === "reporter"
        ? `executor already succeeded in run ${runId}`
        : `executor was interrupted in run ${runId}`;
  return (
    `refusing to re-run ${taskId}: ${stopped}; ` +
    `its changes are still unintegrated in ${worktree.path}. ` +
    `Resume the ${stage} stage with --resume, or discard the worktree with --force-restart.`
  );
}

// register worktree 実行の Phase 3（成果物統合と状態遷移）。成功なら worktree の成果物を
// commit → worktree 側で register review → 統合ブランチへ merge commit 1件 → worktree 撤去、
// 失敗なら worktree を保持したまま waiting へ戻す（wait commit 1件）。通常実行・reporter 再開・
// 統合再開で同じ後処理を通す。統合ブランチの first-parent に増えるのは、成功時の merge commit
// （start → review の遷移事象、plan / result、成果物を含む）か失敗時の wait commit だけになる。
export async function finalizeRegisterWorktreeRun(params: {
  context: RegisterRunContext;
  registerPaths: RegisterPaths;
  item: PjrItem;
  ticketPath: string | null;
  worktree: ExecWorktree;
  stem: string;
  worktreeResultPath: string;
  resultScaffold: Record<string, unknown>;
  agentResult: RunResult;
  stderr: string;
  actor: string;
  // root 側の実行管理ファイル（plan / result / 個票 / イベント）。merge 前に解放し、失敗時は
  // wait commit にまとめる。
  bookkeepingPaths: readonly string[];
  // pipeline 実行の run state（統合段の記録先）。単一 agent 実行では未指定。
  pipelineStatePath?: string;
  // 統合段の再試行。前回の attempt が merge 済みで後段だけ失敗した場合に備え、
  // 取り込み済みの exec ブランチを再 merge せず後続の手順を続ける。
  resumedIntegration?: boolean;
  // runner 自身が判定した失敗理由（統合再開前の親検証の失敗など）。agent の stderr から理由を
  // 抜き出さず、この文言を waiting の理由にする。
  runnerBlockReason?: string;
}): Promise<RegisterItemSummary> {
  const { context, registerPaths, item, ticketPath, worktree, stem, agentResult, actor } = params;
  const { projectId, schedulePath, executionPath, repoRoot } = context;
  const wtContext = { repoRoot, schedulePath, executionPath };
  const worktreeRegisterPaths = registerPathsInsideWorktree(repoRoot, worktree.path, registerPaths);
  const worktreeTicketPath = ticketPath
    ? pathInsideWorktree(repoRoot, worktree.path, ticketPath)
    : null;
  const waitSummary = (reason: string): RegisterItemSummary =>
    registerWaitSummary({
      repoRoot,
      projectId,
      registerPaths,
      item,
      ticketPath,
      reason,
      actor,
      worktree,
      bookkeepingPaths: params.bookkeepingPaths,
    });

  const completedAt = new Date().toISOString();
  const worktreeResultPath = params.worktreeResultPath;
  const { result: effectiveResult, unfilledBlock } = downgradeUnfilledResult(
    agentResult,
    worktreeResultPath,
    "edit",
    params.resultScaffold,
  );

  if (effectiveResult === "success") {
    // A prior integration attempt may have completed the merge and failed only while removing the
    // worktree. The register item and result at root are already in their final review/complete
    // state, so an integration resume must only clean up. Replaying start/review or advancing the
    // exec branch here would force a second merge commit for the same task.
    if (
      params.resumedIntegration &&
      isExecBranchMergedIntoCurrent({ context: wtContext, worktree })
    ) {
      try {
        const lifecyclePaths = new Set(
          [worktreeResultPath, params.pipelineStatePath]
            .filter((path): path is string => !!path)
            .map((path) => repoRelativePath(worktree.path, path)),
        );
        const dirtyTargets = commitTargetPaths(wtContext, worktree, stem);
        const unexpected = dirtyTargets.filter((path) => !lifecyclePaths.has(path));
        if (unexpected.length > 0) {
          throw new Error(`already-merged worktree has new task changes: ${unexpected.join(", ")}`);
        }
        if (dirtyTargets.length > 0) {
          gitOutput(worktree.path, [
            "restore",
            "--source=HEAD",
            "--staged",
            "--worktree",
            "--",
            ...dirtyTargets,
          ]);
        }
        process.stdout.write(
          `  [integrate] already merged: ${worktree.branch} (skipping transitions, commit, and merge)\n`,
        );
        removeWorktree({ context: wtContext, worktree, taskId: stem, deleteBranch: true });
      } catch (error) {
        if (error instanceof WorktreeRemovedBranchDeletionError) {
          process.stderr.write(`Warning: ${error.message}; run exec worktree prune.\n`);
        } else {
          const reason = sanitizeRegisterConclusion(
            `integrate cleanup failed: ${error instanceof Error ? error.message : String(error)}`,
          );
          const integrateFailedAt = new Date().toISOString();
          recordIntegrateStage(params.pipelineStatePath, integrateFailedAt, () => ({
            status: "failed",
            completed_at: integrateFailedAt,
          }));
          process.stdout.write(`  Blocked: ${item.id} (worktree kept: ${worktree.path})\n`);
          return {
            id: item.id,
            title: item.title,
            outcome: "failure",
            transition: "review",
            commit: "incomplete",
            reason,
          };
        }
      }

      rebuildRootRegisterViews(projectId, item.id);
      const sha = gitOutput(repoRoot, ["rev-parse", "--short", "HEAD"]).trim();
      process.stdout.write(
        `run done: ${item.id} (status: review — confirm and close with "register close")\n`,
      );
      return {
        id: item.id,
        title: item.title,
        outcome: "success",
        transition: "review",
        commit: `committed ${sha}`,
      };
    }

    await updateResultStatus(worktreeResultPath, "complete", completedAt);
    const subject = commitSubject(`exec(register ${item.id}): `, item.title);
    // PJR-30SW: プロダクト側の commit と merge commit、プロジェクト側の merge commit に
    // `Refs: <project-id>:<item-id>` を付ける（PJR-1SXK）。
    const itemTraceKey = traceKey(projectId, item.id);
    const productMessage = withCommitTrailers(subject, [refsTrailer(projectId, item.id)]);
    const integrateStartedAt = new Date().toISOString();
    recordIntegrateStage(params.pipelineStatePath, integrateStartedAt, (current) => ({
      status: "running",
      actor,
      attempts: (current?.attempts ?? 0) + 1,
      started_at: integrateStartedAt,
      completed_at: null,
    }));
    try {
      const productNames = (worktree.repos ?? []).map((product) => product.name);
      try {
        const productOutcomes = commitProductWorktrees({
          worktree,
          message: productMessage,
          targets: taskTargetsAtHead(wtContext, worktree, stem),
          scopeLogPath: integrateLogPath(params.pipelineStatePath),
          failureLogPath: integrateLogPath(params.pipelineStatePath),
          resultPath: worktreeResultPath,
        });
        const productRootNewFiles = productOutcomes.flatMap((outcome) =>
          outcome.rootNewFiles.map((path) => `${outcome.repo}:${path}`),
        );
        commitWorktreeChanges({
          context: wtContext,
          worktree,
          taskId: stem,
          message: subject,
          scopeLogPath: integrateLogPath(params.pipelineStatePath),
          failureLogPath: integrateLogPath(params.pipelineStatePath),
          productsIntegratedByCaller: true,
          productRootNewFiles,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const repo =
          productNames.find((name) => message.startsWith(`${name}:`)) ?? PROJECT_REPO_NAME;
        recordRepoIntegration(params.pipelineStatePath, repo, {
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

      let executor = actor;
      let reporter = "-";
      if (params.pipelineStatePath && existsSync(params.pipelineStatePath)) {
        const state = readPipelineState(params.pipelineStatePath);
        executor = state.stages.executor.actor ?? executor;
        reporter = state.stages.reporter.actor ?? reporter;
      }
      const mergeMessage = registerProjectMergeMessage({
        subject,
        executor,
        reporter,
        projectId,
        itemId: item.id,
      });
      integrateTaskRepositories({
        worktree,
        mergeMessage,
        productMergeMessage: productMessage,
        checkProject: () =>
          projectMergeBlockers({
            context: wtContext,
            worktree,
            taskId: stem,
            releasePaths: params.bookkeepingPaths,
            ownedPaths: params.bookkeepingPaths,
          }),
        beforeProjectMerge: () => {
          // review は exec branch 側（worktree）で記録し、最後の project merge commit に
          // 同梱する。統合ブランチで遷移すると first-parent に独立した commit が増える。
          if (
            !spawnRegisterTransition(
              projectId,
              ["review", "--id", item.id, "--by", actor],
              worktree.path,
            )
          ) {
            throw new Error(`register review transition failed: ${item.id}`);
          }
          // プロダクトの統合後・プロジェクトの統合前に、統合先の commit snapshot を result の
          // trace 表へ記録し、プロジェクト側の merge commit に同梱する。宣言の無い project では
          // 記録せず、result は従来どおりになる。
          const products = worktree.repos ?? [];
          const tracePaths: string[] = [];
          if (products.length > 0 && existsSync(worktreeResultPath)) {
            recordResultTrace({
              resultPath: worktreeResultPath,
              traceKey: itemTraceKey,
              traces: products.map(productIntegrationTrace),
            });
            tracePaths.push(worktreeResultPath);
          }
          const integrateCompletedAt = new Date().toISOString();
          recordIntegrateStage(params.pipelineStatePath, integrateCompletedAt, () => ({
            status: "succeeded",
            completed_at: integrateCompletedAt,
          }));
          commitRegisterState(
            worktree.path,
            worktreeRegisterPaths,
            `exec(register ${item.id}): review`,
            worktreeTicketPath,
            [...(params.pipelineStatePath ? [params.pipelineStatePath] : []), ...tracePaths],
            integrateLogPath(params.pipelineStatePath),
          );
        },
        mergeProject: () =>
          mergeWorktreeIntoCurrent({
            context: wtContext,
            worktree,
            taskId: stem,
            message: mergeMessage,
            releaseRootPaths: [...params.bookkeepingPaths],
            // waiting を複数回経た項目では、wait 時の同期後も統合先と exec branch の双方で
            // 記帳ファイルが変わる。項目自身の記帳ファイルだけの競合は exec branch 側で解決する。
            resolveConflictsWithBranchPaths: [...params.bookkeepingPaths],
            failureLogPath: integrateLogPath(params.pipelineStatePath),
          }),
        record: (repo, patch) => recordRepoIntegration(params.pipelineStatePath, repo, patch),
        failureLogPath: integrateLogPath(params.pipelineStatePath),
        lockPath: schedulePath,
      });
      // 撤去も統合の一部として扱う。merge 前に失敗した場合は waiting へ戻し、merge 後の撤去
      // だけが失敗した場合は review を維持して `--resume` で cleanup だけをやり直す。撤去後の
      // branch 削除だけが失敗した場合は、成果の統合を取り消さず cleanup 警告として扱う。
      removeWorktree({ context: wtContext, worktree, taskId: stem, deleteBranch: true });
    } catch (error) {
      if (error instanceof WorktreeRemovedBranchDeletionError) {
        // The task changes are already merged and the worktree is gone. Treat the integration as
        // complete while preserving an explicit cleanup warning in the run log.
        process.stderr.write(`Warning: ${error.message}; run exec worktree prune.\n`);
      } else {
        const reason = sanitizeRegisterConclusion(
          `integrate failed: ${error instanceof Error ? error.message : String(error)}`,
        );
        const integrateFailedAt = new Date().toISOString();
        recordIntegrateStage(params.pipelineStatePath, integrateFailedAt, () => ({
          status: "failed",
          completed_at: integrateFailedAt,
        }));
        // The merge may already have succeeded and only worktree removal failed. Root now contains
        // the complete result and review transition; adding a wait commit would create a second
        // first-parent entry and a resume would create a third. Keep review intact and let
        // integration resume perform cleanup only.
        if (isExecBranchMergedIntoCurrent({ context: wtContext, worktree })) {
          rebuildRootRegisterViews(projectId, item.id);
          process.stdout.write(`  Blocked: ${item.id} (worktree kept: ${worktree.path})\n`);
          return {
            id: item.id,
            title: item.title,
            outcome: "failure",
            transition: "review",
            commit: "incomplete",
            reason,
          };
        }
        await updateResultStatus(worktreeResultPath, "blocked", completedAt, reason);
        process.stdout.write(`  Blocked: ${item.id} (worktree kept: ${worktree.path})\n`);
        const summary = waitSummary(reason);
        return { ...summary, commit: "incomplete" };
      }
    }

    // review は merge で root の個票に入る。非追跡の派生ビューだけ root で作り直す。
    rebuildRootRegisterViews(projectId, item.id);
    const sha = gitOutput(repoRoot, ["rev-parse", "--short", "HEAD"]).trim();
    process.stdout.write(
      `run done: ${item.id} (status: review — confirm and close with "register close")\n`,
    );
    return {
      id: item.id,
      title: item.title,
      outcome: "success",
      transition: "review",
      commit: `committed ${sha}`,
    };
  }

  // 失敗 / rate limit: worktree は保持し（調査・再開のため）、waiting へ遷移する。
  const reason = params.runnerBlockReason
    ? params.runnerBlockReason
    : unfilledBlock
      ? "agent exited 0 but result is incomplete or its frontmatter differs from the scaffold (treated as blocked)"
      : agentResult === "rate_limit"
        ? "rate limit reached"
        : extractBlockReason(params.stderr);
  await updateResultStatus(
    worktreeResultPath,
    "blocked",
    completedAt,
    sanitizeRegisterConclusion(reason),
  );
  process.stdout.write(
    `run failed: ${item.id} (status: waiting; worktree kept: ${worktree.path})\n`,
  );
  return waitSummary(reason);
}

// register 項目1件の worktree 実行。成果物は worktree に隔離し、短い setup/finalize だけを
// lifecycleLock で直列化する。start の checkpoint と成功時の review は exec branch に置き、
// project develop の first-parent には task 単位の merge commit だけを追加する。失敗時は
// start を含む管理成果物を root へ戻し、wait 遷移と同じ commit にまとめる。
export async function runSingleRegisterItemWorktree(
  context: RegisterRunContext,
  opts: RunOpts,
  pjrId: string,
  lifecycleLock?: AsyncLock,
): Promise<RegisterItemSummary> {
  const { projectId, schedulePath, executionPath, repoRoot, worktreeBase } = context;
  const wtContext = { repoRoot, schedulePath, executionPath };
  const { registerPaths, item } = resolveRegisterRunTarget(projectId, pjrId);
  // 状態遷移の書き込み先（登録項目の正本）。commit 対象に必ず含める。
  const ticketPath = ticketPathFromItem(item, registerPaths.projectRegisterPath);
  requireRunnableRegisterItem(item);

  const pipelineMode = isRegisterPipelineRequested(opts);
  const pipelineAgents = pipelineMode
    ? resolveRegisterPipelineCommand(context.roster, opts, context.execDefaults)
    : undefined;
  // agent（result frontmatter へ記録する actor）は executor 側にする。Schedule の
  // agent_pipeline（scaffoldResult 呼び出し時に executor の actor を渡す）と揃える。
  const { command, actor, provider } = pipelineAgents
    ? {
        command: pipelineAgents.executor.command,
        actor: pipelineAgents.executor.actor,
        provider: pipelineAgents.executor.provider,
      }
    : {
        ...resolveRegisterCommand(item, context.roster, opts, context.execDefaults),
        provider: undefined as AgentProvider | undefined,
      };
  const resolvedProvider =
    provider ??
    context.roster?.members.find((m) => m.nickname === actor && m.type === "agent")?.provider;
  const stem = buildInPlaceStem(pjrId.toLowerCase());
  const worktreeTaskId = qualifyTaskId(projectId, item.id);
  const pipelineRunId = pipelineAgents
    ? `${new Date().toISOString().replace(/[-:.]/g, "")}-${randomHex(4)}`
    : undefined;
  // PJR-98G4: repos を宣言した project では、プロダクトの worktree も同じタスクの下に作る。
  const products = configuredProductRepos(schedulePath);

  // Phase 1: plan/result 生成 → register start → checkpoint → worktree 作成（root で直列化）。
  const setup = async (): Promise<
    | {
        worktree: ExecWorktree;
        planPath: string;
        resultPath: string;
        resultScaffold: Record<string, unknown>;
        prompt: string;
        bookkeepingPaths: string[];
      }
    | RegisterItemSummary
  > => {
    // executor が成功した run の worktree を、全体再実行が破棄しないよう保護する。
    // discardStaleExecWorktree は worktree と exec ブランチを強制削除するため、未コミットの
    // executor 成果が失われる。この場合は何も壊さずに中断し、再開か明示的な破棄を促す。
    const protection = protectResumableRegisterWorktree(context, opts, item.id, worktreeTaskId);
    if (protection) {
      process.stderr.write(`${protection}\n`);
      return {
        id: item.id,
        title: item.title,
        outcome: "failure",
        transition: "none",
        commit: "off",
        reason: sanitizeRegisterConclusion(protection),
      };
    }

    const discarded = discardStaleExecWorktree({ context: wtContext, worktreeTaskId, products });
    if (discarded) process.stdout.write(`  [run] discarded stale worktree/branch: ${discarded}\n`);

    const { planPath } = await generateRegisterPlan({
      executionPath,
      projectId,
      registerPaths,
      item,
      stem,
    });
    const prompt = expandPromptRefs(readFileSync(planPath, "utf8"));
    const { resultPath, supersededPaths } = await scaffoldResult({
      executionPath,
      taskId: item.id,
      mode: "edit",
      projectId,
      origin: "register",
      planRef: `exec/plans/${stem}-plan.md`,
      agent: actor,
      startedAt: new Date().toISOString(),
      stem,
    });
    const resultScaffold = readResultFrontmatterSnapshot(resultPath);

    process.stdout.write(`Register item: ${item.id} — ${item.title}  [${item.type}]\n`);
    process.stdout.write(`  Agent: ${actor}\n`);
    if (!spawnRegisterTransition(projectId, ["start", "--id", item.id, "--by", actor])) {
      throw new Error(`register start failed: ${item.id}`);
    }

    const checkpointRel = registerRunnerManagedPaths(
      repoRoot,
      registerPaths,
      planPath,
      resultPath,
      worktreeStatusPaths(repoRoot),
      ticketPath,
      supersededPaths,
    );
    const checkpointPaths = checkpointRel.map((rel) => resolve(repoRoot, rel));
    const checkpointFailureLogPath = pipelineRunId
      ? integrateLogPath(
          pipelineStateLocation({
            repoRoot,
            worktreePath: repoRoot,
            executionPath,
            taskId: item.id,
            runId: pipelineRunId,
          }).path,
        )
      : undefined;
    try {
      const worktree = checkpointAndEnsureWorktree({
        context: wtContext,
        worktreeTaskId,
        base: worktreeBase,
        checkpointPaths,
        commitMessage: `exec(register ${item.id}): start`,
        products,
        failureLogPath: checkpointFailureLogPath,
      });
      const setupAction = worktree.created ? "setup" : "reuse";
      process.stdout.write(
        `  [run] ${setupAction}: worktree ${worktree.path} (${worktree.branch})\n`,
      );
      reportProductWorktrees(worktree);
      return {
        worktree,
        planPath,
        resultPath,
        resultScaffold,
        prompt,
        bookkeepingPaths: checkpointPaths,
      };
    } catch (error) {
      // checkpoint 失敗時は exec branch に commit が無く、root の実行管理ファイルが正本のまま。
      // start を巻き戻して waiting にし、その状態を root の wait commit 1件にまとめる
      // （作りかけの worktree は次回実行の discardStaleExecWorktree が片付ける）。
      return registerWaitSummary({
        repoRoot,
        projectId,
        registerPaths,
        item,
        ticketPath,
        reason: `checkpoint failed: ${error instanceof Error ? error.message : String(error)}`,
        actor,
        bookkeepingPaths: [
          ...checkpointPaths,
          ...(checkpointFailureLogPath && existsSync(checkpointFailureLogPath)
            ? [checkpointFailureLogPath]
            : []),
        ],
      });
    }
  };

  const prepared = lifecycleLock ? await lifecycleLock.runExclusive(setup) : await setup();
  if ("outcome" in prepared) return prepared;
  const { worktree, planPath, resultPath, resultScaffold, prompt, bookkeepingPaths } = prepared;

  // Phase 2: agent を worktree 内で実行（ロック外・並列可能な長時間部分）。
  const env = agentEnvironment(
    repoRoot,
    worktree.path,
    schedulePath,
    executionPath,
    worktree.repos,
  );
  let agentResult: RunResult;
  let stderr = "";
  // pipeline 実行のみ run state を持つ。統合段の記録先として Phase 3 へ渡す。
  let pipelineStatePath: string | undefined;
  if (pipelineAgents) {
    process.stdout.write(
      `Running ${item.id} in worktree (executor/reporter pipeline)\n  CWD: ${worktree.path}\n`,
    );
    const worktreeResultPathForPipeline = pathInsideWorktree(repoRoot, worktree.path, resultPath);
    const pipelineOutcome = await runAgentPipeline({
      repoRoot,
      cwd: worktree.path,
      schedulePath,
      executionPath,
      taskId: item.id,
      executor: pipelineAgents.executor,
      reporterCandidates: pipelineAgents.reporterCandidates,
      planPath,
      planPrompt: prompt,
      resultPath: worktreeResultPathForPipeline,
      registerPaths: registerReporterManagedPaths(registerPaths),
      execDefaults: context.execDefaults,
      providerConcurrencyGate: context.providerConcurrencyGate,
      productWorktrees: worktree.repos,
      runId: pipelineRunId,
    });
    agentResult = pipelineOutcome.runResult;
    stderr = pipelineOutcome.blockReason ?? "";
    pipelineStatePath = resolve(worktree.path, pipelineOutcome.stateRef);
  } else {
    process.stdout.write(`Running ${item.id} in worktree: ${command}\n  CWD: ${worktree.path}\n`);
    const outcome = await runWithRetry(
      [{ command, actor, provider: resolvedProvider }],
      withProductRepoPrompt(prompt, worktree.repos),
      context.execDefaults,
      worktree.path,
      env,
      pathInsideWorktree(repoRoot, worktree.path, resultPath),
    );
    agentResult = outcome.result;
    stderr = outcome.stderr;
  }

  // Phase 3: 成果物統合と状態遷移（root で直列化）。通常実行と再開経路で共通化する。
  const finalize = async (): Promise<RegisterItemSummary> =>
    finalizeRegisterWorktreeRun({
      context,
      registerPaths,
      item,
      ticketPath,
      worktree,
      stem,
      worktreeResultPath: pathInsideWorktree(repoRoot, worktree.path, resultPath),
      resultScaffold,
      agentResult,
      stderr,
      actor,
      bookkeepingPaths,
      pipelineStatePath,
    });

  return lifecycleLock ? lifecycleLock.runExclusive(finalize) : finalize();
}
