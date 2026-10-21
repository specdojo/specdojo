import { join } from "node:path";
import { loadExecDefaultsConfig, ProviderConcurrencyGate } from "../agent-config.js";
import { activateResolvedProjectPaths, resolveProjectPaths } from "../project.js";
import { qualifyTaskId } from "../shared.js";
import { specdojoRootDir } from "../../shared/specdojo-config.js";
import { execLifecyclePoolPath, execLocksDir } from "./lock.js";
import { CrossProcessMutex } from "../slot-lock.js";
import { buildInPlaceStem } from "../plans.js";
import {
  formatRegisterRunSummary,
  parseRegisterIds,
  parseRegisterSelectionFilter,
  registerRunExitCode,
  requireRunnableRegisterItem,
  resolveRegisterRunTarget,
  selectRegisterItems,
  type RegisterFailureMode,
  type RegisterItemSummary,
} from "../register.js";
import { loadRegisterItems, resolveRegisterPaths } from "../../register/register.js";
import { findExecWorktree, resolveWorktreeBase } from "../worktree.js";
import { findResumableRegisterRun } from "../register-resume.js";
import {
  configuredWorktreeBase,
  parseParallel,
  resolveExecDefaultsPath,
  runCompletionDrivenWorkerPool,
  type AsyncLock,
  type RunOpts,
} from "./shared.js";
import { loadRosterForExecutionPath } from "./agent.js";
import {
  applyRegisterDifficultyRouting,
  resolveRegisterCommand,
  isRegisterPipelineRequested,
  parseRegisterExecutorSelection,
  selectedRegisterExecutor,
  resolveRegisterPipelineCommand,
  type RegisterRunContext,
  runSingleRegisterItem,
} from "./register-core.js";
import { runSingleRegisterItemWorktree } from "./register-worktree.js";
import { resumeSingleRegisterItemWorktree } from "./register-resume.js";
import { resolveRegisterPostReviewAgents } from "./register-post-review.js";

// register 項目の実行（複数ID）。in-place モードは指定順に1件ずつ直列実行し、各IDが plan/result
// 生成・start・agent実行・review/waiting 遷移まで完結してから次へ進む。worktree モードは成果物を
// worktree に隔離し、状態遷移を root で直列化する（--parallel で並列化可能）。失敗時は
// failureMode（stop: 残りを skip / continue: 継続）に従う。最後にID別の成否・状態遷移・
// commit結果を一覧表示し、いずれかが failure ならプロセス終了コードへ反映する。
export async function runRegisterMode(opts: RunOpts): Promise<void> {
  const resolvedPaths = resolveProjectPaths({ project: opts.project });
  activateResolvedProjectPaths(resolvedPaths);
  const { schedulePath, executionPath } = resolvedPaths;
  const repoRoot = specdojoRootDir();
  const projectId = resolvedPaths.projectId ?? opts.project ?? process.env.SPECDOJO_PROJECT ?? "";
  if (!projectId) {
    throw new Error(
      "--register requires a project id. Use --project <id> or set current_project in specdojo.config.json.",
    );
  }

  const selectionFilter = opts.registerFilter
    ? parseRegisterSelectionFilter({
        types: opts.registerTypes,
        priorities: opts.registerPriorities,
        statuses: opts.registerStatuses,
        limit: opts.registerLimit,
      })
    : undefined;
  const selectedIds = selectionFilter
    ? selectRegisterItems(
        loadRegisterItems(resolveRegisterPaths({ project: projectId })).map((view) => view.item),
        selectionFilter,
      ).map((item) => item.id)
    : undefined;
  const { ids, duplicates } = selectedIds
    ? { ids: selectedIds, duplicates: [] }
    : parseRegisterIds(opts.register);
  const executorSelection = parseRegisterExecutorSelection(opts.executorBy, ids);
  if (ids.length === 0) {
    process.stdout.write("No matching register items.\n");
    return;
  }
  for (const duplicate of duplicates) {
    process.stdout.write(`Skipping duplicate register item id: ${duplicate}\n`);
  }
  const failureMode: RegisterFailureMode = opts.onFailure
    ? (opts.onFailure as RegisterFailureMode)
    : "stop";
  const roster = loadRosterForExecutionPath(executionPath);
  const execDefaults = loadExecDefaultsConfig(
    resolveExecDefaultsPath(opts, schedulePath),
    executionPath,
  );
  const optsForItem = (pjrId: string): RunOpts => {
    const { item } = resolveRegisterRunTarget(projectId, pjrId);
    const itemOptions: RunOpts = {
      ...opts,
      executorBy: selectedRegisterExecutor(executorSelection, pjrId),
    };
    const routed = applyRegisterDifficultyRouting(item, itemOptions, execDefaults);
    // A resume without explicit stage overrides must keep the actors recorded in pipeline state.
    // The route still supplies recovery behavior and fallbacks for those pinned actors.
    return opts.resume
      ? {
          ...routed,
          executorBy: itemOptions.executorBy,
          reporterBy: itemOptions.reporterBy,
        }
      : routed;
  };
  // Validate the effective per-item selection before creating worktrees or changing register
  // state. A route may supply the counterpart of one explicitly overridden stage.
  if (!opts.resume) {
    for (const pjrId of ids) {
      const itemOpts = optsForItem(pjrId);
      if (
        (itemOpts.executorBy && !itemOpts.reporterBy) ||
        (!itemOpts.executorBy && itemOpts.reporterBy)
      ) {
        throw new Error(
          "--register pipeline execution requires both --executor-by and --reporter-by, either explicitly or from the item's difficulty route.",
        );
      }
    }
  }
  const useWorktree = !!opts.worktree;
  const postReviewAgents = opts.postReview
    ? resolveRegisterPostReviewAgents(roster, opts, execDefaults)
    : undefined;
  const parallel = parseParallel(opts.parallel);
  const worktreeBase = resolveWorktreeBase(
    repoRoot,
    opts.worktreeBase,
    configuredWorktreeBase(schedulePath),
  );

  if (opts.dryRun && opts.resume) {
    process.stdout.write(`[dry-run] resume pipeline for register items: ${ids.join(", ")}\n`);
    for (const pjrId of ids) {
      const { item } = resolveRegisterRunTarget(projectId, pjrId);
      requireRunnableRegisterItem(item);
      const worktree = findExecWorktree(repoRoot, qualifyTaskId(projectId, item.id));
      if (!worktree) {
        process.stdout.write(`[dry-run]   ${item.id}: no exec worktree — not resumable\n`);
        continue;
      }
      const lookup = findResumableRegisterRun({
        repoRoot,
        worktreePath: worktree.path,
        executionPath,
        taskId: item.id,
        ...(opts.resumeFrom === "executor" ? { resumeFrom: "executor" } : {}),
      });
      process.stdout.write(
        lookup.kind === "resumable"
          ? `[dry-run]   ${item.id}: resume the ${lookup.target.stage} stage of run ${lookup.target.runId} in ${worktree.path}\n`
          : `[dry-run]   ${item.id}: not resumable (${lookup.reason})\n`,
      );
    }
    return;
  }

  if (opts.dryRun) {
    const modeLabel = useWorktree
      ? `worktree${parallel > 1 ? `, parallel: ${parallel}` : ", serial"}`
      : "in-place, serial";
    process.stdout.write(
      `[dry-run] register items (${modeLabel}): ${ids.join(", ")}  [on-failure: ${failureMode}, commit: ${useWorktree ? "always (worktree)" : opts.registerCommit ? "per-id" : "off"}]\n`,
    );
    const pipelineMode = isRegisterPipelineRequested(opts);
    for (const pjrId of ids) {
      const itemOpts = optsForItem(pjrId);
      const { item } = resolveRegisterRunTarget(projectId, pjrId);
      const category = requireRunnableRegisterItem(item);
      const stem = buildInPlaceStem(pjrId.toLowerCase());
      process.stdout.write(
        `[dry-run] register item: ${item.id} — ${item.title}  [${item.type}/${category}]\n`,
      );
      if (pipelineMode) {
        const { executor, reporterCandidates } = resolveRegisterPipelineCommand(
          roster,
          itemOpts,
          execDefaults,
        );
        process.stdout.write(`[dry-run]   executor: ${executor.actor}\n`);
        process.stdout.write(`[dry-run]   executor command: ${executor.command}\n`);
        process.stdout.write(`[dry-run]   reporter: ${reporterCandidates[0]?.actor}\n`);
        process.stdout.write(`[dry-run]   reporter command: ${reporterCandidates[0]?.command}\n`);
      } else {
        const { command, actor } = resolveRegisterCommand(item, roster, itemOpts, execDefaults);
        process.stdout.write(`[dry-run]   actor: ${actor}\n`);
        process.stdout.write(`[dry-run]   command: ${command}\n`);
      }
      process.stdout.write(
        `[dry-run]   plan: ${join(executionPath, "exec", "plans", `${stem}-plan.md`)}\n`,
      );
      if (postReviewAgents) {
        process.stdout.write(
          `[dry-run]   post-review executor: ${postReviewAgents.executor.actor}\n`,
        );
        process.stdout.write(
          `[dry-run]   post-review reporter: ${postReviewAgents.reporterCandidates[0]?.actor}\n`,
        );
      }
    }
    process.stdout.write(
      `[dry-run] cwd: ${useWorktree ? `${worktreeBase}/<worktree>` : repoRoot}\n`,
    );
    process.stdout.write(
      `[dry-run] transitions: start (in-progress) → review on success / waiting on failure${postReviewAgents ? "; after integration, post-review closes eligible todo/issue items or returns incomplete items to waiting" : ""}\n`,
    );
    return;
  }

  const context: RegisterRunContext = {
    projectId,
    schedulePath,
    executionPath,
    ...(resolvedPaths.catalogPath ? { catalogPath: resolvedPaths.catalogPath } : {}),
    ...(resolvedPaths.rolesPath ? { rolesPath: resolvedPaths.rolesPath } : {}),
    ...(resolvedPaths.viewpointsPath ? { viewpointsPath: resolvedPaths.viewpointsPath } : {}),
    ...(resolvedPaths.projectContext ? { projectContext: resolvedPaths.projectContext } : {}),
    repoRoot,
    roster,
    execDefaults,
    // provider の max_concurrency は、同じ project の exec run（主 run と --join run）を跨いで
    // ロックディレクトリの枠で統制する。
    providerConcurrencyGate: new ProviderConcurrencyGate(execDefaults, execLocksDir(executionPath)),
    registerCommit: !!opts.registerCommit,
    postReview: !!opts.postReview,
    worktree: useWorktree,
    worktreeBase,
  };

  const skippedSummary = (pjrId: string): RegisterItemSummary => ({
    id: pjrId,
    title: "-",
    outcome: "skipped",
    transition: "none",
    commit: "skipped",
    reason: "stopped after an earlier failure (--on-failure stop)",
  });

  const summaries: RegisterItemSummary[] = [];
  // 再開は既存 worktree の reporter 段だけを実行する。それ以外の経路（plan 生成・executor 実行）
  // は通らないため、通常実行と同じ並列・直列の枠だけを共有する。
  const runItem = (pjrId: string, lifecycleLock?: AsyncLock): Promise<RegisterItemSummary> =>
    opts.resume
      ? resumeSingleRegisterItemWorktree(context, optsForItem(pjrId), pjrId, lifecycleLock)
      : runSingleRegisterItemWorktree(context, optsForItem(pjrId), pjrId, lifecycleLock);

  // worktree 実行の root 側の手順（start 遷移・checkpoint・merge・wait commit・派生ビューの
  // 再生成）は、同じ project の別プロセス（--join run）とも重ならないよう、ロックディレクトリの
  // mutex で直列化する。一方の run が root に記帳ファイルを書いている途中で、もう一方の統合が
  // 始まらない。直列実行でも別プロセスと重なり得るため、並列・直列の両方で使う。
  const lifecycleLock: AsyncLock | undefined = useWorktree
    ? new CrossProcessMutex(
        execLifecyclePoolPath(executionPath),
        { actor: opts.by ?? "exec-run", label: ids.join(",") },
        {
          onWait: () =>
            process.stdout.write(
              "  Waiting for the register lifecycle lock held by another exec run\n",
            ),
        },
      )
    : undefined;

  if (useWorktree && parallel > 1) {
    // 並列実行: 成果物は worktree ごとに隔離し、状態遷移は lifecycleLock で直列化する。
    // stop 指定でも実行中の項目は完走し、未着手の残りだけを skipped にする。
    const queue = [...ids];
    const byId = new Map<string, RegisterItemSummary>();
    let stop = false;
    await runCompletionDrivenWorkerPool<string, RegisterItemSummary>({
      maxParallel: parallel,
      fillSlots: (openSlots) => (stop ? [] : queue.splice(0, openSlots)),
      runItem: (pjrId) => runItem(pjrId, lifecycleLock),
      onSettled: (pjrId, summary) => {
        byId.set(pjrId, summary);
        if (summary.outcome === "failure" && failureMode === "stop") {
          stop = true;
          return { stop: true };
        }
      },
    });
    for (const pjrId of ids) summaries.push(byId.get(pjrId) ?? skippedSummary(pjrId));
  } else {
    let stopped = false;
    for (const pjrId of ids) {
      if (stopped) {
        summaries.push(skippedSummary(pjrId));
        continue;
      }
      const summary = useWorktree
        ? await runItem(pjrId, lifecycleLock)
        : await runSingleRegisterItem(context, optsForItem(pjrId), pjrId);
      summaries.push(summary);
      if (summary.outcome === "failure" && failureMode === "stop") stopped = true;
    }
  }

  process.stdout.write(`${formatRegisterRunSummary(summaries)}\n`);
  const exitCode = registerRunExitCode(summaries);
  if (exitCode !== 0) process.exitCode = exitCode;
}
