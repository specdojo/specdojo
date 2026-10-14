import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { type Command } from "commander";
import {
  loadExecDefaultsConfig,
  ProviderConcurrencyGate,
  providerSlotPoolPath,
  resolveMaxConcurrency,
  resolveMaxConcurrentRuns,
  resolveMemberCommand,
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
import { qualifyTaskId, randomHex } from "./exec-shared.js";
import {
  specdojoRootDir,
  type AgentProvider,
  type MemberRoster,
  type ProjectMember,
} from "./specdojo-config.js";
import { type ReadyTaskView } from "./exec-types.js";
import { type CurrentState } from "./exec-types.js";
import {
  collectExecLockUsage,
  execLifecyclePoolPath,
  execLocksDir,
  formatExecLockUsage,
} from "./exec-run-lock.js";
import { CrossProcessMutex } from "./exec-slot-lock.js";
import { buildInPlaceStem } from "./exec-plans.js";
import { buildTaskView } from "./exec-task-view.js";
import {
  formatRegisterRunSummary,
  generateRegisterPlan,
  isRegisterFailureMode,
  normalizePjrId,
  parseRegisterIds,
  parseRegisterSelectionFilter,
  registerRunExitCode,
  requireRunnableRegisterItem,
  resolveRegisterRunTarget,
  sanitizeRegisterConclusion,
  selectRegisterItems,
  selectRegisterCommitPaths,
  selectRegisterRunArtifactResidue,
  ticketPathFromItem,
  type RegisterFailureMode,
  type RegisterItemSummary,
  type RegisterItemTransition,
} from "./exec-register.js";
import {
  loadRegisterItems,
  resolveRegisterPaths,
  type PjrItem,
  type RegisterPaths,
} from "./register.js";
import { registerEventFilePath } from "./register-events.js";
import {
  applyRegisterItemFields,
  CELL_NONE,
  displayIdFromTicketFilename,
  readRegisterItemContent,
  registerItemFieldsFromItem,
} from "./register-item.js";
import {
  isResultUnfilled,
  readResultFrontmatterSnapshot,
  scaffoldResult,
  updateResultStatus,
} from "./exec-results.js";
import {
  appendGitFailureLog,
  findExecWorktree,
  gitOutput,
  gitResult,
  resolveWorktreeBase,
  summarizeGitHookFailure,
  type ExecWorktree,
} from "./exec-worktree.js";
import {
  configuredProductRepos,
  missingProductWorktrees,
  withProductRepoPrompt,
  withProductWorktrees,
} from "./exec-task-repos.js";
import {
  abortMerge,
  checkpointAndEnsureWorktree,
  commitTargetPaths,
  commitWorktreeChanges,
  currentBranch,
  discardStaleExecWorktree,
  isExecBranchMergedIntoCurrent,
  mergeWorktreeIntoCurrent,
  normalizeResultWhitespace,
  releaseRootWorkingCopies,
  removeWorktree,
  stabilizeCommitTargets,
  stageCommitTargets,
  taskTargetsAtHead,
  unstageCommitTargets,
  WorktreeRemovedBranchDeletionError,
  worktreeStatusPaths,
} from "./exec-worktree-ops.js";
import {
  commitProductWorktrees,
  integrateTaskRepositories,
  projectMergeBlockers,
  PROJECT_REPO_NAME,
  RepoIntegrationError,
  syncTaskWorktreesWithIntegrationTargets,
  type IntegrationTargetSync,
} from "./exec-repo-integration.js";
import {
  productIntegrationTrace,
  recordResultTrace,
  refsTrailer,
  registerProjectMergeMessage,
  traceKey,
  withCommitTrailers,
} from "./exec-repo-trace.js";
import {
  failedParentValidationReason,
  parentValidationPoolPath,
  resolveParentValidationConcurrency,
} from "./exec-parent-validation.js";
import {
  findResumableRegisterRun,
  resolveRegisterResumeArtifacts,
  type RegisterResumeTarget,
} from "./exec-register-resume.js";
import {
  integratedRepoNames,
  loadPipelineResumeCheckpoint,
  pipelineStateLocation,
  readPipelineState,
} from "./exec-pipeline-state.js";
import {
  EXCLUSIVE_EXEC_RUN,
  buildTaskPhaseMap,
  configuredWorktreeBase,
  isRateLimitError,
  parseExecRunBusyPolicy,
  parseParallel,
  resolveAgentOverride,
  resolveExecDefaultsPath,
  resolveRegisterWorktree,
  resolveTaskPhaseContext,
  runCompletionDrivenWorkerPool,
  selectCandidates,
  withProjectExecRunLock,
  type AgentExecution,
  type AgentOverrideResolution,
  type AgentRunCandidate,
  type AsyncLock,
  type CompletionDrivenWorkerPoolResult,
  type ExecRunLockSharing,
  type ModeAgentOverrides,
  type ResolvedRequirements,
  type RunOpts,
  type RunResult,
  type StageAgentOverrides,
  type TaskPhaseContext,
} from "./exec-run-shared.js";
import {
  agentEnvironment,
  buildExecutorPrompt,
  executeAgent,
  executorRequirements,
  expandPromptRefs,
  extractBlockReason,
  loadPrompt,
  loadRosterForExecutionPath,
  pathInsideWorktree,
  reportProductWorktrees,
  reporterRequirements,
  resolveResumedCoverageTargets,
  runConfiguredParentValidationBatch,
  runConfiguredParentValidations,
  runWithRetry,
  type ParentValidationRunOptions,
} from "./exec-run-agent.js";
import {
  refreshParentValidationsForReporterResume,
  runAgentPipeline,
  runReporterStage,
} from "./exec-run-agent-pipeline.js";
import {
  type PlanGenPaths,
  type PreparedTask,
  downgradeUnfilledResult,
  findClaimEventPath,
  prepareSingleTask,
} from "./exec-run-schedule-prepare.js";
import { runPreparedTask } from "./exec-run-schedule-task.js";
import {
  rebuildStaleGeneratedTracksForCycle,
  resolveClaimingActor,
  runBatchMode,
  runManualMode,
} from "./exec-run-schedule-mode.js";
import { runInPlaceMode, spawnAgentInPlace } from "./exec-run-in-place.js";
import { runJobMode } from "./exec-run-job.js";
import {
  commitSubject,
  integrateLogPath,
  recordIntegrateStage,
  recordRepoIntegration,
  repoRelativePath,
  spawnBlock,
  spawnIndexBuild,
  spawnRefresh,
  spawnSelf,
  spawnValidate,
} from "./exec-run-mode-shared.js";

export {
  buildTaskPhaseMap,
  isRateLimitError,
  parseExecRunBusyPolicy,
  resolveAgentOverride,
  resolveRegisterWorktree,
  resolveTaskPhaseContext,
  runCompletionDrivenWorkerPool,
  selectCandidates,
};
export type {
  AgentExecution,
  AgentOverrideResolution,
  CompletionDrivenWorkerPoolResult,
  ModeAgentOverrides,
  ResolvedRequirements,
  RunOpts,
  RunResult,
  StageAgentOverrides,
  TaskPhaseContext,
};
export {
  buildExecutorPrompt,
  executeAgent,
  executorRequirements,
  expandPromptRefs,
  extractBlockReason,
  loadPrompt,
  loadRosterForExecutionPath,
  reporterRequirements,
  resolveResumedCoverageTargets,
  runConfiguredParentValidationBatch,
  runConfiguredParentValidations,
};
export type { ParentValidationRunOptions };
export {
  checkCompletionBeforeIntegration,
  downgradeUnfilledResult,
} from "./exec-run-schedule-prepare.js";
export type { CycleScheduleRebuildResult } from "./exec-run-schedule-mode.js";
export { rebuildStaleGeneratedTracksForCycle, resolveClaimingActor };
export { resolveInPlaceAgentPipeline, resolveInPlaceCommand } from "./exec-run-in-place.js";
export { commitSubject, pipelineRecoveryMeta } from "./exec-run-mode-shared.js";

// --register の単一 agent 実行（--by 指定時）の agent を解決する。owner（Role code）や
// role からの自動選択は行わない（PJR-ADZ6）。agent は全員 stage_role を持つ pipeline
// メンバーであり、owner・role から選ぶと pipeline 用でない agent（翻訳専用など）や
// result を書かない executor が単独で選ばれてしまうため。--by が無い場合の agent は
// resolveRegisterPipelineCommand が stage_role から選ぶ。
export function resolveRegisterCommand(
  item: { id: string; owner: string },
  roster: MemberRoster | null,
  opts: Pick<RunOpts, "by">,
  execDefaults: ExecDefaultsConfig = {},
): { command: string; actor: string } {
  const by = opts.by?.trim();
  if (!by) {
    throw new Error(
      `No agent specified for register item ${item.id} (owner: ${item.owner || "-"}). ` +
        "Specify --by <nickname>, or --executor-by <nickname> --reporter-by <nickname>.",
    );
  }
  const member = roster?.members.find((m) => m.nickname === by && m.type === "agent");
  const command = member ? resolveMemberCommand(execDefaults, member) : undefined;
  if (!command) throw new Error(`Agent command not found for actor: ${by}`);
  return { command, actor: by };
}

// --register を executor/reporter パイプラインで実行するかを判定する。--executor-by /
// --reporter-by の指定があれば pipeline、どちらも無く --by も無い場合も stage_role からの
// 自動選択で pipeline にする。--by だけを指定した場合に限り、従来の単一 agent 実行
// （resolveRegisterCommand）を使う。両者は互いに排他である。
export function isRegisterPipelineRequested(
  opts: Pick<RunOpts, "by" | "executorBy" | "reporterBy">,
): boolean {
  if (opts.executorBy || opts.reporterBy) return true;
  return !opts.by?.trim();
}

export type RegisterExecutorSelection =
  | { kind: "none" }
  | { kind: "shared"; executor: string }
  | { kind: "per-item"; executors: ReadonlyMap<string, string> };

// `--executor-by` keeps its original single-nickname form and additionally accepts a complete
// PJR-ID-to-nickname map. Requiring complete coverage makes an omitted item an input error instead
// of silently falling back to a different executor, while rejecting extra IDs catches typos and
// stale invocations before any register transition or worktree setup occurs.
export function parseRegisterExecutorSelection(
  raw: string | undefined,
  selectedIds: readonly string[],
): RegisterExecutorSelection {
  if (raw === undefined) return { kind: "none" };
  const value = raw.trim();
  if (!value) throw new Error("--executor-by must not be empty.");
  if (!value.includes("=")) return { kind: "shared", executor: value };

  const executors = new Map<string, string>();
  for (const entry of value.split(",")) {
    const parts = entry.split("=");
    if (parts.length !== 2) {
      throw new Error(
        `Invalid --executor-by item assignment: ${entry}. Use PJR-ID=nickname separated by commas.`,
      );
    }
    const id = normalizePjrId(parts[0]);
    const executor = parts[1].trim();
    if (!executor) {
      throw new Error(`Invalid --executor-by item assignment for ${id}: nickname is empty.`);
    }
    if (executors.has(id)) {
      throw new Error(`Duplicate --executor-by item assignment: ${id}.`);
    }
    executors.set(id, executor);
  }

  const selected = new Set(selectedIds);
  const outsideTarget = [...executors.keys()].filter((id) => !selected.has(id));
  if (outsideTarget.length > 0) {
    throw new Error(
      `--executor-by item assignments include IDs outside the register execution target: ${outsideTarget.join(", ")}.`,
    );
  }
  const missing = selectedIds.filter((id) => !executors.has(id));
  if (missing.length > 0) {
    throw new Error(
      `--executor-by item assignments must cover every selected register item; missing: ${missing.join(", ")}.`,
    );
  }
  return { kind: "per-item", executors };
}

function selectedRegisterExecutor(
  selection: RegisterExecutorSelection,
  itemId: string,
): string | undefined {
  if (selection.kind === "none") return undefined;
  return selection.kind === "shared" ? selection.executor : selection.executors.get(itemId);
}

// --register 向けの executor/reporter 解決。Schedule タスクの agent_pipeline と異なり、
// register 項目には per-item のパイプライン宣言が無いため、owner/role からの自動選択は行わない。
// --executor-by / --reporter-by は両方そろえて明示する。どちらも無い場合は stage_role:
// executor（mode: edit）と stage_role: reporter の agent から priority 順に自動選択する。
// stage_role を持たない agent（翻訳専用など）は候補に入らない（PJR-ADZ6）。
export function resolveRegisterPipelineCommand(
  roster: MemberRoster | null,
  opts: Pick<RunOpts, "executorBy" | "reporterBy">,
  execDefaults: ExecDefaultsConfig = {},
): {
  executor: AgentRunCandidate & { actor: string };
  reporterCandidates: AgentRunCandidate[];
} {
  if (!opts.executorBy && !opts.reporterBy) {
    return autoSelectRegisterPipelineAgents(roster, execDefaults);
  }
  if (!opts.executorBy || !opts.reporterBy) {
    throw new Error("--register pipeline execution requires both --executor-by and --reporter-by.");
  }
  const executorResolution = resolveAgentOverride(
    "edit",
    opts.executorBy,
    {},
    roster,
    execDefaults,
    "executor",
  );
  if (executorResolution.kind === "error") {
    throw new Error(executorResolution.message.replace(/^--by/, "--executor-by"));
  }
  if (executorResolution.kind !== "command") {
    throw new Error(`--executor-by agent not found in agent-members.yaml: ${opts.executorBy}`);
  }
  const reporterResolution = resolveAgentOverride(
    "edit",
    opts.reporterBy,
    {},
    roster,
    execDefaults,
    "reporter",
  );
  if (reporterResolution.kind === "error") {
    throw new Error(reporterResolution.message.replace(/^--by/, "--reporter-by"));
  }
  if (reporterResolution.kind !== "command") {
    throw new Error(`--reporter-by agent not found in agent-members.yaml: ${opts.reporterBy}`);
  }
  return {
    executor: {
      command: executorResolution.command,
      actor: executorResolution.actor ?? opts.executorBy,
      provider: executorResolution.provider,
    },
    reporterCandidates: [
      {
        command: reporterResolution.command,
        actor: reporterResolution.actor ?? opts.reporterBy,
        provider: reporterResolution.provider,
      },
    ],
  };
}

// --executor-by / --reporter-by も --by も無い --register 実行の agent を stage_role から選ぶ。
// executor は mode: edit の executor（mode 未指定を含む）、reporter は mode を問わない
// reporter を priority 順に候補とする。stage_role を持たない agent は selectCandidates の
// 段指定によって除外される。どちらかの段に候補が無い場合は明示指定を求めるエラーにする。
function autoSelectRegisterPipelineAgents(
  roster: MemberRoster | null,
  execDefaults: ExecDefaultsConfig,
): {
  executor: AgentRunCandidate & { actor: string };
  reporterCandidates: AgentRunCandidate[];
} {
  const toCandidates = (members: ProjectMember[]): (AgentRunCandidate & { actor: string })[] =>
    members.flatMap((member) => {
      const command = resolveMemberCommand(execDefaults, member);
      return command ? [{ command, actor: member.nickname, provider: member.provider }] : [];
    });
  const executor = toCandidates(
    selectCandidates(
      { capabilities: [], stage_role: "executor" },
      roster,
      "edit",
      undefined,
      execDefaults,
    ),
  )[0];
  const reporterCandidates = toCandidates(
    selectCandidates(
      { capabilities: [], stage_role: "reporter" },
      roster,
      undefined,
      undefined,
      execDefaults,
    ),
  );
  if (!executor || reporterCandidates.length === 0) {
    const missing = [
      ...(executor ? [] : ["stage_role: executor (mode: edit)"]),
      ...(reporterCandidates.length > 0 ? [] : ["stage_role: reporter"]),
    ];
    throw new Error(
      `No agent found for --register pipeline stage (${missing.join(", ")}). ` +
        "Specify --executor-by <nickname> --reporter-by <nickname>, or --by <nickname>.",
    );
  }
  return { executor, reporterCandidates };
}

// register の状態遷移を CLI 経由で実行する。register 側のガード（終端状態の拒否）と
// 派生ビュー再生成を一元的に通すため、直接ファイルを書き換えず自プロセスを spawn する。
function spawnRegisterTransition(
  projectId: string | undefined,
  args: string[],
  cwd?: string,
): boolean {
  const fullArgs = ["register", ...args];
  if (projectId) fullArgs.push("--project", projectId);
  return spawnSelf(fullArgs, cwd);
}

// 複数IDの直列実行で共有する、ID間で不変なセットアップ。paths/roster/execDefaults の
// 解決は register 全体で1回だけ行い、各IDの実行に使い回す。
type RegisterRunContext = {
  projectId: string;
  schedulePath: string;
  executionPath: string;
  repoRoot: string;
  roster: MemberRoster | null;
  execDefaults: ExecDefaultsConfig;
  providerConcurrencyGate: ProviderConcurrencyGate;
  registerCommit: boolean;
  // worktree モードでは成果物を worktree に隔離し、状態遷移は root で直列化する。
  worktree: boolean;
  worktreeBase: string;
};

// 成功したIDの実行によって生じた変更だけを1コミットにまとめる。開始前スナップショット
// （preexisting）に無いパスと runnerManaged を対象にし、利用者の既存変更は除外する。
// commit 後は hook が変更した対象を amend し、対象差分が消えるまで収束を検証する。
export function commitRegisterItemChanges(
  repoRoot: string,
  item: PjrItem,
  preexisting: readonly string[],
  runnerManaged: readonly string[] = [],
): { committed: boolean; sha?: string } {
  const remainingPaths = (): string[] =>
    selectRegisterCommitPaths(preexisting, worktreeStatusPaths(repoRoot), runnerManaged);
  const paths = remainingPaths();
  if (paths.length === 0) return { committed: false };

  try {
    stageCommitTargets(repoRoot, paths);
    const staged = gitResult(repoRoot, ["diff", "--cached", "--quiet", "--", ...paths]);
    if (staged.status === 0) return { committed: false };
    if (staged.status !== 1) throw new Error("Failed to inspect staged register changes.");

    const subject = commitSubject(`exec(register ${item.id}): `, item.title);
    gitOutput(repoRoot, ["commit", "-m", subject, "--", ...paths]);
    stabilizeCommitTargets(repoRoot, remainingPaths);
    const sha = gitOutput(repoRoot, ["rev-parse", "--short", "HEAD"]).trim();
    return { committed: true, sha };
  } catch (error) {
    unstageCommitTargets(repoRoot, [...paths, ...remainingPaths()]);
    throw error;
  }
}

function registerEventPathForTicket(
  registerPaths: RegisterPaths,
  ticketPath?: string | null,
): string | undefined {
  if (!ticketPath) return undefined;
  const displayId = displayIdFromTicketFilename(basename(ticketPath));
  return displayId
    ? registerEventFilePath(registerPaths.projectRegisterPath, displayId)
    : undefined;
}

function registerRunnerManagedPaths(
  repoRoot: string,
  registerPaths: RegisterPaths,
  planPath: string,
  resultPath: string,
  currentPaths: readonly string[],
  ticketPath?: string | null,
  additionalManagedPaths: readonly string[] = [],
): string[] {
  // 状態遷移の書き込み先は個票（正本）。pjr-index と派生ビューは生成物として同時に更新される。
  // 移行完了後の pjr-index.md は非追跡の生成物になり存在しないため、存在する場合のみ対象に含める
  // （存在しないパスを git add すると pathspec エラーになる）。
  const managed = [planPath, resultPath, ...additionalManagedPaths];
  if (existsSync(registerPaths.pjrIndexPath)) managed.push(registerPaths.pjrIndexPath);
  if (ticketPath) managed.push(ticketPath);
  const eventPath = registerEventPathForTicket(registerPaths, ticketPath);
  if (eventPath) managed.push(eventPath);
  const exact = new Set(managed.map((path) => repoRelativePath(repoRoot, path)));
  const prefixes = [registerPaths.generatedPath, registerPaths.controlsGeneratedPath].map(
    (path) => `${repoRelativePath(repoRoot, path)}/`,
  );
  for (const path of currentPaths) {
    const normalized = path.replaceAll("\\", "/");
    if (prefixes.some((prefix) => normalized.startsWith(prefix))) exact.add(path);
  }
  return [...exact];
}

function registerReporterManagedPaths(registerPaths: RegisterPaths): string[] {
  return [
    registerPaths.projectRegisterPath,
    registerPaths.generatedPath,
    registerPaths.controlsGeneratedPath,
  ];
}

// register 項目1件の in-place 実行。plan 生成 → `register start` → agent 実行 → 成否を
// register の状態遷移（成功: review / 失敗: waiting）と result に反映し、成功かつ
// registerCommit 有効なら当該IDの変更だけを commit する。ID別の結果を要約で返す。
// schedule のタスクではないため exec の claim/complete イベントは記録しない。
async function runSingleRegisterItem(
  context: RegisterRunContext,
  opts: RunOpts,
  pjrId: string,
): Promise<RegisterItemSummary> {
  const { projectId, schedulePath, executionPath, repoRoot } = context;
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
  const { command, actor } = pipelineAgents
    ? { command: pipelineAgents.executor.command, actor: pipelineAgents.executor.actor }
    : resolveRegisterCommand(item, context.roster, opts, context.execDefaults);
  const stem = buildInPlaceStem(pjrId.toLowerCase());

  // ID単位 commit のため、この項目が変更を生じる前の作業ツリー状態を記録する。
  const preexisting = context.registerCommit ? worktreeStatusPaths(repoRoot) : [];
  const residue = context.registerCommit ? selectRegisterRunArtifactResidue(preexisting) : [];
  if (residue.length > 0) {
    process.stderr.write(
      `Warning: pre-existing uncommitted register plan/result files detected before ${item.id}; ` +
        `left out of this item's commit:\n${residue.map((path) => `  ${path}`).join("\n")}\n`,
    );
  }

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
    ...(item.targets && item.targets.length > 0 ? { targets: item.targets } : {}),
  });
  const resultScaffold = readResultFrontmatterSnapshot(resultPath);

  process.stdout.write(`Register item: ${item.id} — ${item.title}  [${item.type}]\n`);
  process.stdout.write(`  Agent: ${actor}${pipelineAgents ? " (executor)" : ""}\n`);
  if (pipelineAgents) {
    process.stdout.write(`  Agent: ${pipelineAgents.reporterCandidates[0]?.actor} (reporter)\n`);
  }
  if (!spawnRegisterTransition(projectId, ["start", "--id", item.id, "--by", actor])) {
    throw new Error(`register start failed: ${item.id}`);
  }

  let exitCode: number;
  let pipelineBlockReason: string | undefined;
  if (pipelineAgents) {
    process.stdout.write(`Running ${item.id} in place (executor/reporter pipeline)\n`);
    const pipelineOutcome = await runAgentPipeline({
      repoRoot,
      cwd: repoRoot,
      schedulePath,
      executionPath,
      taskId: item.id,
      executor: pipelineAgents.executor,
      reporterCandidates: pipelineAgents.reporterCandidates,
      planPath,
      planPrompt: prompt,
      resultPath,
      registerPaths: registerReporterManagedPaths(registerPaths),
      execDefaults: context.execDefaults,
      providerConcurrencyGate: context.providerConcurrencyGate,
    });
    exitCode = pipelineOutcome.exitCode;
    pipelineBlockReason = pipelineOutcome.blockReason;
    if (pipelineOutcome.exitCode !== 0) {
      process.stdout.write(
        `run blocked: ${item.id} (${pipelineOutcome.blockReason ?? "pipeline failed"})\n`,
      );
    }
  } else {
    process.stdout.write(`Running ${item.id} in place: ${command}\n`);
    exitCode = await spawnAgentInPlace(
      command,
      prompt,
      repoRoot,
      schedulePath,
      executionPath,
      resultPath,
    );
  }

  // in-place 実行と同じ補助判定: agent が result 必須節を埋めずに終了コード 0 で
  // 終わった場合は block として扱う（runInPlaceMode と同じ理由）。pipeline モードでは
  // reporter が renderReporterResult で本文を埋めるため通常は該当しないが、
  // フォーマット不整合等の防御として同じチェックを維持する。
  let effectiveExit = exitCode;
  let blockReason: string | undefined = pipelineBlockReason;
  if (exitCode === 0 && isResultUnfilled(resultPath, "edit", resultScaffold)) {
    effectiveExit = 1;
    blockReason =
      "agent exited 0 but result is incomplete or its frontmatter differs from the scaffold (treated as blocked)";
    process.stdout.write(
      `run blocked: ${item.id} (result incomplete or frontmatter changed despite exit 0)\n`,
    );
  }

  await updateResultStatus(
    resultPath,
    effectiveExit === 0 ? "complete" : "blocked",
    new Date().toISOString(),
    blockReason,
  );

  if (effectiveExit === 0) {
    let transition: RegisterItemTransition = "review";
    let reason: string | undefined;
    if (!spawnRegisterTransition(projectId, ["review", "--id", item.id, "--by", actor])) {
      process.stderr.write(`register review transition failed: ${item.id}\n`);
      transition = "none";
      reason = "register review transition failed";
    }
    let commit = context.registerCommit ? "no-changes" : "off";
    if (context.registerCommit) {
      const currentPaths = worktreeStatusPaths(repoRoot);
      const runnerManaged = registerRunnerManagedPaths(
        repoRoot,
        registerPaths,
        planPath,
        resultPath,
        currentPaths,
        ticketPath,
        supersededPaths,
      );
      try {
        const result = commitRegisterItemChanges(repoRoot, item, preexisting, runnerManaged);
        if (result.committed) commit = `committed ${result.sha}`;
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        const commitReason = sanitizeRegisterConclusion(`register commit incomplete: ${detail}`);
        process.stderr.write(`run commit failed: ${item.id}: ${detail}\n`);
        if (
          spawnRegisterTransition(projectId, [
            "wait",
            "--id",
            item.id,
            "--reason",
            commitReason,
            "--by",
            actor,
          ])
        ) {
          transition = "waiting";
        } else {
          process.stderr.write(`register wait transition failed: ${item.id}\n`);
          transition = "none";
        }
        return {
          id: item.id,
          title: item.title,
          outcome: "failure",
          transition,
          commit: "incomplete",
          reason: commitReason,
        };
      }
    }
    process.stdout.write(
      `run done: ${item.id} (status: review — confirm and close with "register close")\n`,
    );
    return { id: item.id, title: item.title, outcome: "success", transition, commit, reason };
  }

  const waitingReason = sanitizeRegisterConclusion(
    blockReason ?? `agent exited with non-zero code (exit ${exitCode})`,
  );
  if (
    !spawnRegisterTransition(projectId, [
      "wait",
      "--id",
      item.id,
      "--reason",
      waitingReason,
      "--by",
      actor,
    ])
  ) {
    process.stderr.write(`register wait transition failed: ${item.id}\n`);
  }
  process.stdout.write(`run failed: ${item.id} (exit ${effectiveExit}; status: waiting)\n`);
  return {
    id: item.id,
    title: item.title,
    outcome: "failure",
    transition: "waiting",
    commit: context.registerCommit ? "skipped" : "off",
    reason: waitingReason,
  };
}

// register の状態遷移（start/review/wait）が変更した調整状態（pjr-index と派生ビュー）だけを
// 抽出する。worktree モードでは成功時の遷移を exec branch、失敗時の wait を root で commit
// する。plan/result は checkpoint と worktree merge が扱うため、ここでは含めない。
export function registerStatePaths(
  repoRoot: string,
  registerPaths: RegisterPaths,
  ticketPath?: string | null,
): string[] {
  const changed = worktreeStatusPaths(repoRoot);
  const exact = new Set([repoRelativePath(repoRoot, registerPaths.pjrIndexPath)]);
  if (ticketPath) exact.add(repoRelativePath(repoRoot, ticketPath));
  const eventPath = registerEventPathForTicket(registerPaths, ticketPath);
  if (eventPath) exact.add(repoRelativePath(repoRoot, eventPath));
  const prefixes = [registerPaths.generatedPath, registerPaths.controlsGeneratedPath].map(
    (path) => `${repoRelativePath(repoRoot, path)}/`,
  );
  const selected = new Set<string>();
  for (const path of changed) {
    const normalized = path.replaceAll("\\", "/");
    if (exact.has(normalized) || prefixes.some((prefix) => normalized.startsWith(prefix))) {
      selected.add(path);
    }
  }
  return [...selected].sort();
}

// register 状態遷移の pjr-index / 派生ビュー変更を root へ 1 コミットする。hook が対象を
// 整形した場合は同じ commit へ収束するまで amend する。commit 対象が無ければ何もしない。
function commitRegisterState(
  repoRoot: string,
  registerPaths: RegisterPaths,
  message: string,
  ticketPath?: string | null,
  additionalPaths: readonly string[] = [],
  failureLogPath?: string,
): void {
  const paths = [
    ...new Set([
      ...registerStatePaths(repoRoot, registerPaths, ticketPath),
      ...additionalPaths.map((path) => repoRelativePath(repoRoot, path)),
    ]),
  ];
  if (paths.length === 0) return;
  const remainingPaths = (): string[] => registerStatePaths(repoRoot, registerPaths, ticketPath);
  try {
    stageCommitTargets(repoRoot, paths);
    const staged = gitResult(repoRoot, ["diff", "--cached", "--quiet", "--", ...paths]);
    if (staged.status === 0) return;
    if (staged.status !== 1) throw new Error("Failed to inspect staged register-state changes.");
    const commit = gitResult(repoRoot, ["commit", "-m", message, "--", ...paths]);
    if (commit.status !== 0) {
      const output = [commit.stdout, commit.stderr]
        .filter((part): part is string => typeof part === "string" && part.length > 0)
        .join("\n");
      appendGitFailureLog(failureLogPath, [
        `=== ${new Date().toISOString()} git commit register state ===`,
        `exit: ${commit.status ?? "unknown"}`,
        "--- stdout ---",
        typeof commit.stdout === "string" ? commit.stdout : "",
        "--- stderr ---",
        typeof commit.stderr === "string" ? commit.stderr : "",
        "",
      ]);
      throw new Error(`git commit failed: ${summarizeGitHookFailure(output)}`);
    }
    stabilizeCommitTargets(repoRoot, remainingPaths, undefined, failureLogPath);
  } catch (error) {
    unstageCommitTargets(repoRoot, [...paths, ...remainingPaths()]);
    throw error;
  }
}

function registerPathsInsideWorktree(
  repoRoot: string,
  worktreePath: string,
  paths: RegisterPaths,
): RegisterPaths {
  return {
    ...paths,
    projectRegisterPath: pathInsideWorktree(repoRoot, worktreePath, paths.projectRegisterPath),
    pjrIndexPath: pathInsideWorktree(repoRoot, worktreePath, paths.pjrIndexPath),
    generatedPath: pathInsideWorktree(repoRoot, worktreePath, paths.generatedPath),
    controlsGeneratedPath: pathInsideWorktree(repoRoot, worktreePath, paths.controlsGeneratedPath),
  };
}

// root と task worktree の間で、同じ repo 相対パスのファイルを複製する。複製元に無いパスは
// 複製先からも消す（superseded result のような削除も追従させる）。
function copyRepoPaths(
  sourceRoot: string,
  targetRoot: string,
  repoRoot: string,
  paths: readonly string[],
): void {
  for (const path of paths) {
    const rel = repoRelativePath(repoRoot, path);
    const source = resolve(sourceRoot, rel);
    const target = resolve(targetRoot, rel);
    if (!existsSync(source)) {
      rmSync(target, { recursive: true, force: true });
      continue;
    }
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(source, target);
  }
}

// 失敗時に root へ戻すのは runner が生成・更新した plan / result だけに限定する。個票と
// event は agent が編集した未検証の本文を含みうるため、root に残してある checkpoint 版を
// wait 遷移の入力にする。派生ビューは遷移後に root で再生成する。
function registerFailureArtifactPaths(repoRoot: string, paths: readonly string[]): string[] {
  return paths.filter((path) =>
    /(?:^|\/)exec\/(?:plans|results)\//.test(repoRelativePath(repoRoot, path)),
  );
}

type PreservedRegisterTicket = {
  path: string;
  content: string;
};

// wait commit の個票は検証済みの root 本文を使う一方、exec branch には agent が編集した本文を
// 残す。root の frontmatter から lifecycle フィールドだけを重ね、resume 後も waiting 状態と
// 未統合の作業内容の両方を保持する。
function restorePreservedRegisterTicket(
  worktreePath: string,
  repoRoot: string,
  preserved: PreservedRegisterTicket | undefined,
): void {
  if (!preserved) return;
  const rel = repoRelativePath(repoRoot, preserved.path);
  const rootTicketPath = resolve(repoRoot, rel);
  const worktreeTicketPath = resolve(worktreePath, rel);
  if (!existsSync(rootTicketPath)) {
    mkdirSync(dirname(worktreeTicketPath), { recursive: true });
    writeFileSync(worktreeTicketPath, preserved.content, "utf8");
    return;
  }
  try {
    const rootContent = readFileSync(rootTicketPath, "utf8");
    const parsed = readRegisterItemContent(rootContent, basename(rel));
    if (!parsed) throw new Error(`could not parse register item: ${rel}`);
    const content = applyRegisterItemFields(preserved.content, {
      ...registerItemFieldsFromItem(parsed.item),
      block_reason: parsed.blockReason === CELL_NONE ? null : parsed.blockReason,
    });
    mkdirSync(dirname(worktreeTicketPath), { recursive: true });
    writeFileSync(worktreeTicketPath, content, "utf8");
  } catch (error) {
    // frontmatter 自体が壊れている場合も agent の作業を失わない。root の wait commit はすでに
    // clean な checkpoint 版で確定しているため、worktree 側だけ元の内容へ戻して警告する。
    mkdirSync(dirname(worktreeTicketPath), { recursive: true });
    writeFileSync(worktreeTicketPath, preserved.content, "utf8");
    process.stderr.write(
      `warning: could not apply the waiting lifecycle to ${rel} in the exec branch: ` +
        `${error instanceof Error ? error.message : String(error)}\n`,
    );
  }
}

// register の状態遷移（start / wait / review）が書き換える追跡ファイル（root 側の絶対パス）:
// 個票、append-only のイベント、存在する場合は登録簿本体（移行前のレイアウト）。gitignore 済みの
// 派生ビューは含めない。
function registerTransitionPaths(
  registerPaths: RegisterPaths,
  ticketPath: string | null,
): string[] {
  const paths: string[] = [];
  if (ticketPath) paths.push(ticketPath);
  const eventPath = registerEventPathForTicket(registerPaths, ticketPath);
  if (eventPath) paths.push(eventPath);
  if (existsSync(registerPaths.pjrIndexPath)) paths.push(registerPaths.pjrIndexPath);
  return paths;
}

// register 項目の実行管理ファイル（root 側の絶対パス）。再開時は plan / result /
// 遷移ファイルに加え、start 遷移で再生成された派生ビューも、初回 checkpoint と同じ基準で
// runner 管理パスとして扱う。この集合を失敗時の wait commit、merge 前の root 解放で使う。
function registerBookkeepingPaths(params: {
  repoRoot: string;
  registerPaths: RegisterPaths;
  planPath: string;
  resultPath: string;
  ticketPath: string | null;
}): string[] {
  const { repoRoot, registerPaths, planPath, resultPath, ticketPath } = params;
  return registerRunnerManagedPaths(
    repoRoot,
    registerPaths,
    planPath,
    resultPath,
    worktreeStatusPaths(repoRoot),
    ticketPath,
  ).map((path) => resolve(repoRoot, path));
}

// root の登録簿派生ビュー（pjr-index / generated）は非追跡の生成物で、merge や複製では更新され
// ない。個票の状態を root 側へ反映したあとに再生成して、root の表示を個票と揃える。失敗しても
// 実行結果には影響しないため警告に留める。
function rebuildRootRegisterViews(projectId: string, itemId: string): void {
  if (!spawnRegisterTransition(projectId, ["build"])) {
    process.stderr.write(`warning: could not rebuild register views at root for ${itemId}\n`);
  }
}

// register worktree 実行の失敗確定。worktree 側の plan / blocked result だけを root へ写し、
// 個票・event は root に残る検証済み checkpoint 版を基準に waiting へ遷移する。統合ブランチには
// `exec(register X): wait` commit 1件だけを作り、未検証の個票本文は exec branch に保持する。
// worktree が無い（checkpoint 前の失敗）場合は root の実行管理ファイルをそのまま commit する。
function registerWaitSummary(params: {
  repoRoot: string;
  projectId: string;
  registerPaths: RegisterPaths;
  item: PjrItem;
  ticketPath: string | null;
  reason: string;
  actor: string;
  // root 側の絶対パス。worktree がある場合は plan / result だけを root へ写してから遷移する。
  bookkeepingPaths: readonly string[];
  worktree?: ExecWorktree;
}): RegisterItemSummary {
  const { repoRoot, projectId, registerPaths, item, ticketPath, actor, worktree } = params;
  const blockReason = sanitizeRegisterConclusion(params.reason);
  const bookkeepingPaths = [...params.bookkeepingPaths];
  const preservedTicketPath =
    worktree && ticketPath ? pathInsideWorktree(repoRoot, worktree.path, ticketPath) : undefined;
  const preservedTicket: PreservedRegisterTicket | undefined =
    ticketPath && preservedTicketPath && existsSync(preservedTicketPath)
      ? { path: ticketPath, content: readFileSync(preservedTicketPath, "utf8") }
      : undefined;
  if (worktree) {
    copyRepoPaths(
      worktree.path,
      repoRoot,
      repoRoot,
      registerFailureArtifactPaths(repoRoot, bookkeepingPaths),
    );
  }
  let transition: RegisterItemTransition = "waiting";
  if (
    !spawnRegisterTransition(projectId, [
      "wait",
      "--id",
      item.id,
      "--reason",
      blockReason,
      "--by",
      actor,
    ])
  ) {
    process.stderr.write(`register wait transition failed: ${item.id}\n`);
    transition = "none";
  } else {
    const message = `exec(register ${item.id}): wait`;
    const committedPaths = commitRegisterWaitState({
      repoRoot,
      registerPaths,
      item,
      ticketPath,
      bookkeepingPaths,
      message,
    });
    if (worktree)
      syncExecBranchAfterWait({
        repoRoot,
        worktree,
        item,
        bookkeepingPaths: committedPaths,
        preservedTicket,
      });
  }
  return {
    id: item.id,
    title: item.title,
    outcome: "failure",
    transition,
    commit: "off",
    reason: blockReason,
  };
}

// waiting 遷移と実行管理ファイルを root へ 1 commit する。result は commit hook の markdownlint
// 対象で、失敗した run の result（scaffold のまま、または reporter の出力）が記法違反を含むと
// commit ごと失敗する。その場合は result を外して遷移だけを commit し（result は root に未 commit
// のまま残り、merge 前の解放で退避される）、実際に commit した集合を返す。
function commitRegisterWaitState(params: {
  repoRoot: string;
  registerPaths: RegisterPaths;
  item: PjrItem;
  ticketPath: string | null;
  bookkeepingPaths: readonly string[];
  message: string;
}): string[] {
  const { repoRoot, registerPaths, item, ticketPath, message } = params;
  const paths = [...params.bookkeepingPaths];
  const resultPaths = paths.filter((path) => isRegisterResultPath(repoRoot, path));
  for (const path of resultPaths) {
    if (existsSync(path)) normalizeResultWhitespace(path);
  }
  try {
    commitRegisterState(repoRoot, registerPaths, message, ticketPath, paths);
    return paths;
  } catch (error) {
    if (resultPaths.length === 0) throw error;
    const withoutResult = paths.filter((path) => !resultPaths.includes(path));
    process.stderr.write(
      `warning: wait commit of ${item.id} failed with the result included; retrying without it: ` +
        `${error instanceof Error ? error.message : String(error)}\n`,
    );
    gitResult(repoRoot, [
      "reset",
      "--quiet",
      "--",
      ...resultPaths.map((path) => repoRelativePath(repoRoot, path)),
    ]);
    commitRegisterState(repoRoot, registerPaths, message, ticketPath, withoutResult);
    return withoutResult;
  }
}

function isRegisterResultPath(repoRoot: string, path: string): boolean {
  return /\/exec\/results\/[^/]+-result\.md$/.test(repoRelativePath(repoRoot, path));
}

// wait commit と、その時点までに統合先へ入った変更を exec branch へ通常 merge する。
// worktree の記帳パスには、root へ複製した blocked result などが未 commit のまま残っている。
// そのままでは root の wait commit に上書きされるとして merge 開始前に拒否されるため、root に
// commit 済みの記帳パスだけを先に exec branch の HEAD へ戻す。checkpoint と wait commit は
// 共通祖先に存在しないイベントファイルなどを双方で追加するため、記帳パスの競合だけは root 側の
// 内容で解決する。それ以外の競合は自動解決せず、merge を abort する。
// merge commit は runner 内部の同期であり、失敗原因となった統合 hook を再実行しないよう
// --no-verify を指定する。同期に失敗した場合は root の記帳内容を worktree へ戻して保持する。
function syncExecBranchAfterWait(params: {
  repoRoot: string;
  worktree: ExecWorktree;
  item: PjrItem;
  bookkeepingPaths: readonly string[];
  preservedTicket?: PreservedRegisterTicket;
}): void {
  const { repoRoot, worktree, item } = params;
  const bookkeepingPaths = params.bookkeepingPaths.map((path) => repoRelativePath(repoRoot, path));
  try {
    const targetBranch = currentBranch(repoRoot);
    // The same content is already durable in the root wait commit. Releasing these working copies
    // is what lets a normal merge start; all other dirty paths remain untouched.
    releaseRootWorkingCopies(worktree.path, bookkeepingPaths);
    const mergeMessage = `exec(register ${item.id}): merge ${targetBranch} after wait`;
    const mergeResult = gitResult(worktree.path, [
      "merge",
      "--no-commit",
      "--no-ff",
      "--no-verify",
      "-m",
      mergeMessage,
      targetBranch,
    ]);
    if (mergeResult.status !== 0) {
      const mergeHead = gitResult(worktree.path, [
        "rev-parse",
        "--verify",
        "--quiet",
        "MERGE_HEAD",
      ]);
      if (mergeHead.status !== 0) {
        const stderr = typeof mergeResult.stderr === "string" ? mergeResult.stderr.trim() : "";
        throw new Error(
          `git merge failed before conflict resolution${stderr ? `: ${stderr}` : ""}`,
        );
      }
      const conflicted = gitOutput(worktree.path, ["diff", "--name-only", "--diff-filter=U", "-z"])
        .split("\0")
        .filter((path) => path.length > 0);
      const allowed = new Set(bookkeepingPaths);
      const unexpected = conflicted.filter((path) => !allowed.has(path));
      if (unexpected.length > 0) {
        throw new Error(
          `wait sync conflicts outside register bookkeeping: ${unexpected.join(", ")}`,
        );
      }
    }

    copyRepoPaths(repoRoot, worktree.path, repoRoot, params.bookkeepingPaths);
    restorePreservedRegisterTicket(worktree.path, repoRoot, params.preservedTicket);
    stageCommitTargets(worktree.path, bookkeepingPaths);
    const unresolved = gitOutput(worktree.path, ["diff", "--name-only", "--diff-filter=U"]).trim();
    if (unresolved) throw new Error(`wait sync has unresolved conflicts: ${unresolved}`);
    gitOutput(worktree.path, ["commit", "--no-verify", "-m", mergeMessage]);
  } catch (error) {
    abortMerge(worktree.path);
    // The pre-merge release is safe to repeat from root and restores the visible waiting state even
    // when the merge was rejected before MERGE_HEAD was created.
    copyRepoPaths(repoRoot, worktree.path, repoRoot, params.bookkeepingPaths);
    restorePreservedRegisterTicket(worktree.path, repoRoot, params.preservedTicket);
    process.stderr.write(
      `warning: could not sync the exec branch of ${item.id} with the wait commit; ` +
        `the resumed merge may still conflict: ` +
        `${error instanceof Error ? error.message : String(error)}\n`,
    );
  }
}

// register worktree 実行の Phase 3（成果物統合と状態遷移）。成功なら worktree の成果物を
// commit → worktree 側で register review → 統合ブランチへ merge commit 1件 → worktree 撤去、
// 失敗なら worktree を保持したまま waiting へ戻す（wait commit 1件）。通常実行・reporter 再開・
// 統合再開で同じ後処理を通す。統合ブランチの first-parent に増えるのは、成功時の merge commit
// （start → review の遷移事象、plan / result、成果物を含む）か失敗時の wait commit だけになる。
async function finalizeRegisterWorktreeRun(params: {
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
async function runSingleRegisterItemWorktree(
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

// 全体再実行が既存 run の未統合成果を破棄しないための保護。既存 worktree に再開可能な run
// （executor 成功済みで reporter か統合が未完了）が残っている場合だけ理由を返し、呼び出し側が
// 破壊的操作（discardStaleExecWorktree）の手前で中断できるようにする。--force-restart で無効化できる。
function protectResumableRegisterWorktree(
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
async function resumeRegisterIntegration(params: {
  context: RegisterRunContext;
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
async function resumeSingleRegisterItemWorktree(
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
  // PJR-98G4: プロダクトの worktree も揃っていることを再開の条件にする。欠けたまま再開すると、
  // agent がプロダクト側の変更先を失う。
  const products = configuredProductRepos(schedulePath);
  const worktree = withProductWorktrees(foundWorktree, products, worktreeTaskId);
  const missingProducts = missingProductWorktrees(products, worktree);
  if (missingProducts.length > 0) {
    return refuse(
      `product worktrees are missing for ${item.id}: ${missingProducts.join(", ")}; ` +
        `run the item again instead`,
    );
  }

  const lookup = findResumableRegisterRun({
    repoRoot,
    worktreePath: worktree.path,
    executionPath,
    taskId: item.id,
    ...(opts.resumeFrom === "executor" ? { resumeFrom: "executor" } : {}),
  });
  if (lookup.kind !== "resumable") return refuse(lookup.reason);
  const target = lookup.target;

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
    });

    const finalize = async (): Promise<RegisterItemSummary> =>
      finalizeRegisterWorktreeRun({
        context,
        registerPaths,
        item,
        ticketPath,
        worktree,
        stem: artifacts.stem,
        worktreeResultPath,
        resultScaffold,
        agentResult: outcome.runResult,
        stderr: outcome.blockReason ?? "",
        actor: executor.candidate.actor,
        bookkeepingPaths: bookkeepingPaths(),
        pipelineStatePath: resolve(worktree.path, outcome.stateRef),
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
    productWorktrees: worktree.repos,
  });

  const finalize = async (): Promise<RegisterItemSummary> =>
    finalizeRegisterWorktreeRun({
      context,
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
    });

  return lifecycleLock ? lifecycleLock.runExclusive(finalize) : finalize();
}

// register 項目の実行（複数ID）。in-place モードは指定順に1件ずつ直列実行し、各IDが plan/result
// 生成・start・agent実行・review/waiting 遷移まで完結してから次へ進む。worktree モードは成果物を
// worktree に隔離し、状態遷移を root で直列化する（--parallel で並列化可能）。失敗時は
// failureMode（stop: 残りを skip / continue: 継続）に従う。最後にID別の成否・状態遷移・
// commit結果を一覧表示し、いずれかが failure ならプロセス終了コードへ反映する。
async function runRegisterMode(opts: RunOpts): Promise<void> {
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
  const hasExecutorSelection = executorSelection.kind !== "none";
  const optsForItem = (pjrId: string): RunOpts => ({
    ...opts,
    executorBy: selectedRegisterExecutor(executorSelection, pjrId),
  });
  for (const duplicate of duplicates) {
    process.stdout.write(`Skipping duplicate register item id: ${duplicate}\n`);
  }
  const failureMode: RegisterFailureMode = opts.onFailure
    ? (opts.onFailure as RegisterFailureMode)
    : "stop";
  // --executor-by / --reporter-by は両方揃って初めて pipeline モードになる。片方だけの指定は
  // 曖昧なため、実行前に明示的なエラーで止める（isRegisterPipelineRequested は片方でも true を
  // 返すため、resolveRegisterPipelineCommand 側の対称チェックとは別に、ここで早期に検知する）。
  // 再開は state が示す段だけを実行する。stale executor の再実行では各 agent の明示指定を
  // 個別に許可し、省略時は state に記録された actor を使う。
  if (
    !opts.resume &&
    ((hasExecutorSelection && !opts.reporterBy) || (!hasExecutorSelection && opts.reporterBy))
  ) {
    throw new Error("--register pipeline execution requires both --executor-by and --reporter-by.");
  }

  const roster = loadRosterForExecutionPath(executionPath);
  const execDefaults = loadExecDefaultsConfig(
    resolveExecDefaultsPath(opts, schedulePath),
    executionPath,
  );
  const useWorktree = !!opts.worktree;
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
    }
    process.stdout.write(
      `[dry-run] cwd: ${useWorktree ? `${worktreeBase}/<worktree>` : repoRoot}\n`,
    );
    process.stdout.write(
      `[dry-run] transitions: start (in-progress) → review on success / waiting on failure\n`,
    );
    return;
  }

  const context: RegisterRunContext = {
    projectId,
    schedulePath,
    executionPath,
    repoRoot,
    roster,
    execDefaults,
    // provider の max_concurrency は、同じ project の exec run（主 run と --join run）を跨いで
    // ロックディレクトリの枠で統制する。
    providerConcurrencyGate: new ProviderConcurrencyGate(execDefaults, execLocksDir(executionPath)),
    registerCommit: !!opts.registerCommit,
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

export function registerRunCommand(exec: Command): void {
  const rcmd = exec
    .command("run")
    .description("Run AI agent for a ready task (--auto selects next by strategy)");

  rcmd.option("--project <projectId>", "Project id in .specdojo/specdojo.config.json");
  rcmd.option("--by <nickname>", "Select an agent-members.yaml agent for a manual target");
  rcmd.option("--auto", "Automatically select and run next ready task", false);
  rcmd.option("--task <taskId>", "Task ID to run (manual selection)");
  rcmd.option(
    "--deliverable <localId>",
    "Catalog deliverable local_id target (unique project-wide)",
  );
  rcmd.option("--plan <path>", "Run an existing plan file (in-place; no generation)");
  rcmd.option(
    "--register <pjrIds...>",
    "One or more project register item IDs (PJR-XXXX) to run; execution location defaults to run.register_execution in exec-defaults (in-place when unset)",
  );
  rcmd.option(
    "--register-filter",
    "Select register items deterministically with --register-types/--register-priorities/--register-statuses/--register-limit",
    false,
  );
  rcmd.option("--register-types <types>", "Comma-separated register item types");
  rcmd.option("--register-priorities <priorities>", "Comma-separated register priorities");
  rcmd.option("--register-statuses <statuses>", "Comma-separated register statuses");
  rcmd.option("--register-limit <n>", "Maximum selected register items");
  rcmd.option("--job <jobId>", "Materialize and run a reusable job definition");
  rcmd.option(
    "--input <key=value...>",
    "Job input values (repeat or provide multiple key=value pairs)",
  );
  rcmd.option("--scheduled-at <dateTime>", "Scheduled occurrence time for a Job Run");
  rcmd.option("--job-trigger <source>", "Job trigger source: manual|routine|ci", "manual");
  rcmd.option(
    "--register-commit",
    "With in-place --register: commit each successful item's changes as a separate commit (default: leave changes in the working tree). Ignored in worktree mode, which always commits",
    false,
  );
  rcmd.option(
    "--on-failure <mode>",
    "With --register: stop|continue remaining items after a failure (default: stop)",
  );
  rcmd.option(
    "--resume",
    "With register worktree mode: resume the stage where a run stopped (executor, reporter, or integration), reusing the existing worktree and checkpoints",
    false,
  );
  rcmd.option(
    "--resume-from <stage>",
    "With --resume: resume a reporter-stage run from executor instead (accepted value: executor)",
  );
  rcmd.option(
    "--force-restart",
    "With register worktree mode: re-run the whole item even when a resumable executor result exists (discards the worktree and its uncommitted changes)",
    false,
  );
  rcmd.option(
    "--worktree",
    "Use a git worktree and integrate back (requires --task, --register, or --job; Job runs are committed and reviewed before merge)",
    false,
  );
  rcmd.option(
    "--in-place",
    "Run a register item in the current working tree (overrides run.register_execution; cannot be combined with --worktree)",
    false,
  );
  rcmd.option(
    "--track-state",
    "Record claim/complete events (requires --task; --by optional, actor auto-derived from the resolved agent)",
    false,
  );
  rcmd.option(
    "--archive-on-success",
    "Archive the generated plan to exec/plans/done/ after a successful in-place run",
    false,
  );
  rcmd.option("--parallel <n>", "Number of worktree instances to run in parallel", "1");
  rcmd.option("--worktree-base <path>", "Override worktree base directory");
  rcmd.option(
    "--strategy <s>",
    "Task selection strategy: critical-first|fifo (default: critical-first)",
  );
  rcmd.option(
    "--loop",
    "Repeat rounds until no ready tasks remain, rebuilding doc-index and running exec refresh between rounds",
    false,
  );
  rcmd.option(
    "--max-rounds <n>",
    "Maximum number of rounds when using --loop (ignored without --loop)",
  );
  rcmd.option(
    "--if-busy <policy>",
    "When another exec is running for the project: skip|wait|fail (default: fail)",
    "fail",
  );
  rcmd.option(
    "--join",
    "With register worktree mode: run next to a running register worktree exec instead of waiting for it, sharing its provider caps, lifecycle serialization, and parent-validation slots (up to run.max_concurrent_runs; --if-busy applies when all join slots are taken)",
    false,
  );
  rcmd.option(
    "--exec-defaults <path>",
    "Path to exec-defaults.yaml global config (default: .specdojo/exec-defaults.yaml)",
  );
  rcmd.option("--agent-config <path>", "Deprecated alias for --exec-defaults");
  rcmd.option(
    "--edit-by <nickname>",
    "agent-members.yaml nickname for edit-mode tasks in --auto batch runs",
  );
  rcmd.option(
    "--review-by <nickname>",
    "agent-members.yaml nickname for review-mode tasks in --auto batch runs",
  );
  rcmd.option(
    "--executor-by <nickname>",
    "Executor nickname; with --register, also accepts PJR-ID=nickname assignments separated by commas. With --plan / --deliverable, runs the executor/reporter pipeline",
  );
  rcmd.option(
    "--reporter-by <nickname>",
    "agent-members.yaml reporter nickname for agent_pipeline tasks (with --plan / --deliverable, runs the executor/reporter pipeline)",
  );
  rcmd.option("--dry-run", "Print resolved command without executing", false);

  rcmd.action(async (opts: RunOpts) => {
    try {
      const isAuto = !!opts.auto;
      const hasTask = !!opts.task;
      const hasDeliverable = !!opts.deliverable;
      const hasPlan = !!opts.plan;
      const hasRegisterIds = !!opts.register;
      const hasRegisterFilter = !!opts.registerFilter;
      const hasRegister = hasRegisterIds || hasRegisterFilter;
      const hasJob = !!opts.job;
      const isManual = hasTask || hasDeliverable || hasPlan || hasRegister || hasJob;
      const isBatch = isAuto;

      if (hasRegisterIds && hasRegisterFilter) {
        process.stdout.write("Specify either --register or --register-filter, not both.\n");
        process.exitCode = 1;
        return;
      }
      if (
        (opts.registerTypes ||
          opts.registerPriorities ||
          opts.registerStatuses ||
          opts.registerLimit) &&
        !hasRegisterFilter
      ) {
        process.stdout.write(
          "--register-types, --register-priorities, --register-statuses, and --register-limit require --register-filter.\n",
        );
        process.exitCode = 1;
        return;
      }

      if (!isAuto && !isManual) {
        process.stdout.write(
          "Specify --auto, --by (with a manual target), --task, --deliverable, --plan, --register, or --job.\n",
        );
        process.exitCode = 1;
        return;
      }
      if ([hasTask, hasDeliverable, hasPlan, hasRegister, hasJob].filter(Boolean).length > 1) {
        process.stdout.write(
          "Specify at most one of --task, --deliverable, --plan, --register, --job.\n",
        );
        process.exitCode = 1;
        return;
      }
      if (hasRegister && opts.trackState) {
        process.stdout.write(
          "--track-state cannot be used with --register (state is tracked in the register itself).\n",
        );
        process.exitCode = 1;
        return;
      }
      if (opts.worktree && opts.inPlace) {
        process.stdout.write("Specify either --worktree or --in-place, not both.\n");
        process.exitCode = 1;
        return;
      }
      if (opts.inPlace && !hasRegister) {
        process.stdout.write("--in-place requires --register or --register-filter.\n");
        process.exitCode = 1;
        return;
      }
      if (hasRegister) {
        const { schedulePath, executionPath } = resolveProjectPaths({ project: opts.project });
        const execDefaults = loadExecDefaultsConfig(
          resolveExecDefaultsPath(opts, schedulePath),
          executionPath,
        );
        opts.worktree = resolveRegisterWorktree(opts, execDefaults);
      }
      if (hasRegister && !opts.worktree && parseParallel(opts.parallel) !== 1) {
        process.stdout.write(
          "--parallel with --register requires worktree mode; use --worktree or configure run.register_execution: worktree.\n",
        );
        process.exitCode = 1;
        return;
      }
      if (opts.join && !(hasRegister && opts.worktree)) {
        process.stdout.write(
          "--join requires --register (or --register-filter) in worktree mode.\n",
        );
        process.exitCode = 1;
        return;
      }
      if (hasRegister && opts.worktree && opts.registerCommit) {
        process.stdout.write(
          "Note: --register-commit is ignored in worktree mode; worktree runs always commit (checkpoint + merge back).\n",
        );
      }
      if ((opts.registerCommit || opts.onFailure) && !hasRegister) {
        process.stdout.write("--register-commit and --on-failure require --register.\n");
        process.exitCode = 1;
        return;
      }
      if ((opts.resume || opts.forceRestart) && !hasRegister) {
        process.stdout.write("--resume and --force-restart require --register.\n");
        process.exitCode = 1;
        return;
      }
      if (opts.resumeFrom && !opts.resume) {
        process.stdout.write("--resume-from requires --resume.\n");
        process.exitCode = 1;
        return;
      }
      if (opts.resumeFrom && opts.resumeFrom !== "executor") {
        process.stdout.write('--resume-from must be "executor".\n');
        process.exitCode = 1;
        return;
      }
      // 再開は既存 worktree の成果を再利用する操作のため、worktree 実行に限る。in-place 実行は
      // executor の変更が作業ツリーに残り、再開時のID単位 commit が対象を判別できない。
      if ((opts.resume || opts.forceRestart) && !opts.worktree) {
        process.stdout.write(
          "--resume and --force-restart require register worktree mode; use --worktree or configure run.register_execution: worktree.\n",
        );
        process.exitCode = 1;
        return;
      }
      if (opts.resume && opts.forceRestart) {
        process.stdout.write("Specify either --resume or --force-restart, not both.\n");
        process.exitCode = 1;
        return;
      }
      if ((opts.input || opts.scheduledAt) && !hasJob) {
        process.stdout.write("--input and --scheduled-at require --job.\n");
        process.exitCode = 1;
        return;
      }
      if (opts.jobTrigger && !["manual", "routine", "ci"].includes(opts.jobTrigger)) {
        process.stdout.write("--job-trigger must be manual, routine, or ci.\n");
        process.exitCode = 1;
        return;
      }
      if (opts.onFailure && !isRegisterFailureMode(opts.onFailure)) {
        process.stdout.write(`--on-failure must be "stop" or "continue": ${opts.onFailure}\n`);
        process.exitCode = 1;
        return;
      }
      if (isAuto && isManual) {
        process.stdout.write("Specify either --auto or a manual target, not both.\n");
        process.exitCode = 1;
        return;
      }
      if (isAuto && opts.by) {
        process.stdout.write(
          "--by requires a manual target; use --edit-by / --review-by with --auto.\n",
        );
        process.exitCode = 1;
        return;
      }
      if (opts.by && opts.executorBy) {
        process.stdout.write("Specify either --by or --executor-by, not both.\n");
        process.exitCode = 1;
        return;
      }
      if (opts.worktree && !hasTask && !hasRegister && !hasJob) {
        process.stdout.write("--worktree requires --task, --register, or --job.\n");
        process.exitCode = 1;
        return;
      }
      // --parallel is allowed for register worktree runs (handled above); reject it for other
      // manual targets, which run a single instance.
      if (isManual && !hasRegister && parseParallel(opts.parallel) !== 1) {
        process.stdout.write("--parallel cannot be used with a manual target.\n");
        process.exitCode = 1;
        return;
      }

      // register worktree 実行だけが共有資源をプロセス横断で統制するため、後から --join する
      // run を受け入れる。それ以外の run は従来どおり project 全体を排他する。
      const registerWorktreeLockSharing: ExecRunLockSharing =
        hasRegister && opts.worktree ? { shareable: true, join: !!opts.join } : EXCLUSIVE_EXEC_RUN;
      await withProjectExecRunLock(
        opts,
        "run",
        async () => {
          // Register-item run: use the configured location or an explicit CLI override, with state tracked
          // via register transitions (start → review / waiting) instead of exec events.
          if (hasRegister) {
            await runRegisterMode(opts);
            return;
          }

          if (hasJob) {
            await runJobMode(opts, resolveRegisterPipelineCommand);
            return;
          }

          // In-place manual run (default): generate the plan on demand and run in the
          // current repository. No validate/refresh pass — that is orchestration only.
          if (isManual && !opts.worktree) {
            await runInPlaceMode(opts);
            return;
          }

          process.stdout.write("[run] validate...\n");
          if (!spawnValidate(opts.project)) {
            process.stdout.write("[run] validate failed — exit\n");
            process.exitCode = 1;
            return;
          }
          process.stdout.write("[run] validate: ok\n[run] refresh...\n");
          if (!spawnRefresh(opts.project)) {
            process.stdout.write("[run] refresh failed — exit\n");
            process.exitCode = 1;
            return;
          }
          process.stdout.write("[run] refresh: ok\n");

          if (isBatch) {
            await runBatchMode(opts);
          } else {
            await runManualMode(opts);
          }
        },
        registerWorktreeLockSharing,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      process.stdout.write(message + "\n");
      process.exitCode = 1;
    }
  });
}

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
async function runCycleMode(opts: RunOpts): Promise<void> {
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
function prepareScheduleIntegrationResume(params: {
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
async function runResumeMode(opts: RunOpts): Promise<void> {
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
