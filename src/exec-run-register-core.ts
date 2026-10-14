import { existsSync, readFileSync } from "node:fs";
import { basename } from "node:path";
import {
  resolveMemberCommand,
  type ExecDefaultsConfig,
  type ProviderConcurrencyGate,
} from "./exec-agent-config.js";
import { type MemberRoster, type ProjectMember } from "./specdojo-config.js";
import { buildInPlaceStem } from "./exec-plans.js";
import {
  generateRegisterPlan,
  normalizePjrId,
  requireRunnableRegisterItem,
  resolveRegisterRunTarget,
  sanitizeRegisterConclusion,
  selectRegisterCommitPaths,
  selectRegisterRunArtifactResidue,
  ticketPathFromItem,
  type RegisterItemSummary,
  type RegisterItemTransition,
} from "./exec-register.js";
import { type PjrItem, type RegisterPaths } from "./register.js";
import { registerEventFilePath } from "./register-events.js";
import { displayIdFromTicketFilename } from "./register-item.js";
import {
  isResultUnfilled,
  readResultFrontmatterSnapshot,
  scaffoldResult,
  updateResultStatus,
} from "./exec-results.js";
import { gitOutput, gitResult } from "./exec-worktree.js";
import {
  stabilizeCommitTargets,
  stageCommitTargets,
  unstageCommitTargets,
  worktreeStatusPaths,
} from "./exec-worktree-ops.js";
import {
  resolveAgentOverride,
  selectCandidates,
  type AgentRunCandidate,
  type RunOpts,
} from "./exec-run-shared.js";
import { expandPromptRefs } from "./exec-run-agent.js";
import { runAgentPipeline } from "./exec-run-agent-pipeline.js";
import { spawnAgentInPlace } from "./exec-run-in-place.js";
import { commitSubject, repoRelativePath, spawnSelf } from "./exec-run-mode-shared.js";

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

export function selectedRegisterExecutor(
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
export function autoSelectRegisterPipelineAgents(
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
export function spawnRegisterTransition(
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
export type RegisterRunContext = {
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

export function registerEventPathForTicket(
  registerPaths: RegisterPaths,
  ticketPath?: string | null,
): string | undefined {
  if (!ticketPath) return undefined;
  const displayId = displayIdFromTicketFilename(basename(ticketPath));
  return displayId
    ? registerEventFilePath(registerPaths.projectRegisterPath, displayId)
    : undefined;
}

export function registerRunnerManagedPaths(
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

export function registerReporterManagedPaths(registerPaths: RegisterPaths): string[] {
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
export async function runSingleRegisterItem(
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
