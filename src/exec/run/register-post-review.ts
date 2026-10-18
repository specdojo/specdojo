import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { resolveMemberCommand, type ExecDefaultsConfig } from "../agent-config.js";
import { buildSpecdojoFrontmatter } from "../../docs/frontmatter-namespace.js";
import { formatMarkdownFile } from "../../shared/markdown-format.js";
import { expandTemplate } from "../../shared/text.js";
import type { MemberRoster, ProjectMember } from "../../shared/specdojo-config.js";
import { execTemplatePath } from "../plans.js";
import { scaffoldResult, stripLeadingListMarker, updateResultStatus } from "../results.js";
import type { ExecEvidence } from "../evidence.js";
import { readPipelineState } from "../pipeline-state.js";
import { sanitizeRegisterConclusion, type RegisterItemTransition } from "../register.js";
import type { PjrItem, RegisterPaths } from "../../register/register.js";
import { gitOutput } from "../worktree.js";
import { worktreeStatusPaths } from "../worktree-ops.js";
import { runAgentPipeline } from "./agent-pipeline.js";
import { expandPromptRefs } from "./agent.js";
import {
  registerReporterManagedPaths,
  spawnRegisterTransition,
  type RegisterRunContext,
} from "./register-core.js";
import { commitRegisterState } from "./register-state.js";
import {
  resolveAgentOverride,
  resolvePinnedRateLimitRunOptions,
  selectCandidates,
  type AgentRunCandidate,
  type RunOpts,
} from "./shared.js";

export const DEFAULT_REGISTER_POST_REVIEW_EXECUTOR = "claude-expert-review-executor";

const ACCEPTED_POST_REVIEW_VERDICTS = new Set(["complete", "complete-with-findings"]);
const POST_REVIEW_VERDICTS = new Set(["complete", "complete-with-findings", "incomplete"]);
const AUTO_CLOSE_REGISTER_TYPES = new Set(["todo", "issue"]);

export type RegisterPostReviewDisposition = {
  transition: RegisterItemTransition;
  outcome: "success" | "failure";
  explanation: string;
};

export function registerPostReviewDisposition(params: {
  itemType: string;
  verdict: string | undefined;
  runnerImplementationChanged?: boolean;
}): RegisterPostReviewDisposition {
  const { itemType, verdict, runnerImplementationChanged = false } = params;
  if (verdict === "incomplete" || !verdict) {
    return {
      transition: "waiting",
      outcome: "failure",
      explanation: verdict === "incomplete" ? "review verdict is incomplete" : "review failed",
    };
  }
  if (!ACCEPTED_POST_REVIEW_VERDICTS.has(verdict)) {
    return {
      transition: "waiting",
      outcome: "failure",
      explanation: `review verdict is not accepted: ${verdict}`,
    };
  }
  if (!AUTO_CLOSE_REGISTER_TYPES.has(itemType)) {
    return {
      transition: "review",
      outcome: "success",
      explanation: `register type ${itemType} is not eligible for automatic close`,
    };
  }
  if (runnerImplementationChanged) {
    return {
      transition: "review",
      outcome: "success",
      explanation:
        "the integrated change modifies the running SpecDojo implementation; a new process smoke test and human close are required",
    };
  }
  return {
    transition: "done",
    outcome: "success",
    explanation: `review verdict is ${verdict}`,
  };
}

export function registerPostReviewVerdict(resultPath: string): string | undefined {
  if (!existsSync(resultPath)) return undefined;
  const match = readFileSync(resultPath, "utf8").match(
    /^- verdict:\s*(complete|complete-with-findings|incomplete|grade-stale|grade-unavailable|changed-during-review)\s*$/m,
  );
  return match?.[1];
}

export function changesModifyRunningSpecDojo(repoRoot: string, paths: readonly string[]): boolean {
  const packagePath = join(repoRoot, "package.json");
  if (!existsSync(packagePath)) return false;
  try {
    const manifest = JSON.parse(readFileSync(packagePath, "utf8")) as { name?: unknown };
    if (manifest.name !== "specdojo") return false;
  } catch {
    return false;
  }
  return paths.some((path) => {
    const normalized = path.replaceAll("\\", "/").replace(/^\.\//u, "");
    return (
      normalized.startsWith("src/") ||
      normalized.startsWith("tools/") ||
      normalized === "package.json" ||
      normalized === "package-lock.json" ||
      normalized === "npm-shrinkwrap.json" ||
      normalized === "pnpm-lock.yaml" ||
      normalized === "yarn.lock"
    );
  });
}

function candidateForMember(
  member: ProjectMember,
  execDefaults: ExecDefaultsConfig,
): (AgentRunCandidate & { actor: string }) | undefined {
  const command = resolveMemberCommand(execDefaults, member);
  return command ? { command, actor: member.nickname, provider: member.provider } : undefined;
}

export function resolveRegisterPostReviewAgents(
  roster: MemberRoster | null,
  opts: Pick<RunOpts, "reviewBy" | "reporterBy">,
  execDefaults: ExecDefaultsConfig,
): {
  executor: AgentRunCandidate & { actor: string };
  reporterCandidates: AgentRunCandidate[];
} {
  const reviewNickname = opts.reviewBy?.trim() || DEFAULT_REGISTER_POST_REVIEW_EXECUTOR;
  const executorResolution = resolveAgentOverride(
    "review",
    reviewNickname,
    {},
    roster,
    execDefaults,
    "executor",
  );
  if (executorResolution.kind !== "command") {
    const detail =
      executorResolution.kind === "error"
        ? executorResolution.message
        : `agent not found: ${reviewNickname}`;
    throw new Error(
      `Register post-review executor is unavailable (${detail.replace(/^--by/u, "--review-by")}). ` +
        "Specify --review-by <nickname>.",
    );
  }
  const executor = {
    command: executorResolution.command,
    actor: executorResolution.actor ?? reviewNickname,
    provider: executorResolution.provider,
  };

  const reporterNickname = opts.reporterBy?.trim();
  if (reporterNickname) {
    const reporterResolution = resolveAgentOverride(
      "review",
      reporterNickname,
      {},
      roster,
      execDefaults,
      "reporter",
    );
    if (reporterResolution.kind !== "command") {
      const detail =
        reporterResolution.kind === "error"
          ? reporterResolution.message
          : `agent not found: ${reporterNickname}`;
      throw new Error(detail.replace(/^--by/u, "--reporter-by"));
    }
    return {
      executor,
      reporterCandidates: [
        {
          command: reporterResolution.command,
          actor: reporterResolution.actor ?? reporterNickname,
          provider: reporterResolution.provider,
        },
      ],
    };
  }

  const reporterCandidates = selectCandidates(
    { capabilities: [], stage_role: "reporter" },
    roster,
    undefined,
    undefined,
    execDefaults,
  ).flatMap((member) => {
    const candidate = candidateForMember(member, execDefaults);
    return candidate ? [candidate] : [];
  });
  if (reporterCandidates.length === 0) {
    throw new Error(
      "No reporter is available for register post-review. Specify --reporter-by <nickname>.",
    );
  }
  return { executor, reporterCandidates };
}

function repoRelative(repoRoot: string, path: string): string {
  return relative(repoRoot, path).split(sep).join("/");
}

export async function generateRegisterPostReviewPlan(params: {
  context: RegisterRunContext;
  item: PjrItem;
  ticketPath: string;
  stem: string;
  editPlanPath: string;
  editResultPath: string;
  editEvidenceRef?: string;
  baseCommit: string;
  outputCommit: string;
}): Promise<{ taskId: string; planPath: string; resultPath: string }> {
  const { context, item, stem } = params;
  const taskId = `${item.id}-post-review`;
  const reviewStem = `${stem}-post-review`;
  const planPath = join(context.executionPath, "exec", "plans", `${reviewStem}-plan.md`);
  const resultPath = join(context.executionPath, "exec", "results", `${reviewStem}-result.md`);
  const templatePath = execTemplatePath("xrp-register-post-run-template.md");
  const frontmatter = buildSpecdojoFrontmatter([
    `id: ${context.projectId}:xrp-${reviewStem}`,
    "type: exec-plan",
    "rulebook: none",
    `task_id: ${taskId}`,
    `name: ${JSON.stringify(`${item.id} ${item.title} の統合後レビュー`)}`,
    "mode: review",
    "status: ready",
    `project_id: ${context.projectId}`,
    "origin: register",
  ]);
  const values: Record<string, string> = {
    _FRONTMATTER_: frontmatter,
    _ITEM_ID_: item.id,
    _ITEM_TITLE_: item.title,
    _ITEM_PATH_: repoRelative(context.repoRoot, params.ticketPath),
    _EDIT_PLAN_REF_: repoRelative(context.repoRoot, params.editPlanPath),
    _EDIT_RESULT_REF_: repoRelative(context.repoRoot, params.editResultPath),
    _EDIT_EVIDENCE_REF_: params.editEvidenceRef ?? "-",
    _BASE_COMMIT_: params.baseCommit,
    _OUTPUT_COMMIT_: params.outputCommit,
    _RESULT_REF_: repoRelative(context.repoRoot, resultPath),
  };
  const content = expandTemplate(readFileSync(templatePath, "utf8"), values);
  mkdirSync(dirname(planPath), { recursive: true });
  writeFileSync(planPath, content, "utf8");
  await formatMarkdownFile(planPath);
  return { taskId, planPath, resultPath };
}

function reviewRationale(resultPath: string): string {
  if (!existsSync(resultPath)) return "review result is unavailable";
  const content = readFileSync(resultPath, "utf8");
  const section = content.match(/## 2\. 判断根拠\s*\n([\s\S]*?)(?=\n## 3\.)/u)?.[1] ?? "";
  const rationale = section
    .split("\n")
    .map((line) => line.replace(/^\s*-\s*/u, "").trim())
    .filter(Boolean)
    .join(" ");
  return rationale || "review result recorded no rationale";
}

async function fillFailedReviewResult(resultPath: string, reason: string): Promise<void> {
  const safeReason = reason.replace(/\s+/gu, " ").trim();
  let content = readFileSync(resultPath, "utf8");
  content = content
    .replace(/_TODO_: 評価結果サイドカー[^\n]*/u, `統合後 review を完了できなかった: ${safeReason}`)
    .replace(/_TODO_: 変更内容[^\n]*/u, "- runner が統合後 review を完了できなかった。")
    .replace(/_TODO_: 未充足事項[^\n]*/u, `- ${stripLeadingListMarker(safeReason) || "理由なし"}`)
    .replace(/_TODO_: `approach`[^\n]*/u, "統合済みの出力は変更していない。")
    .replace(/- verdict: _TODO_（[^\n]*）/u, "- verdict: incomplete");
  writeFileSync(resultPath, content, "utf8");
  await formatMarkdownFile(resultPath);
}

async function forceIncompleteReviewResult(resultPath: string, reason: string): Promise<void> {
  let content = readFileSync(resultPath, "utf8");
  content = content.replace(
    /^- verdict:\s*(?:complete|complete-with-findings|incomplete|grade-stale|grade-unavailable|changed-during-review)\s*$/mu,
    "- verdict: incomplete",
  );
  const note = `- runner 判定: ${reason.replace(/\s+/gu, " ").trim()}`;
  if (!content.includes(note)) {
    content = content.replace(
      "\n## 4. approach に応じた確認",
      `\n${note}\n\n## 4. approach に応じた確認`,
    );
  }
  writeFileSync(resultPath, content, "utf8");
  await formatMarkdownFile(resultPath);
}

function editEvidenceRefAtRoot(params: {
  repoRoot: string;
  worktreePath: string;
  pipelineStatePath?: string;
}): string | undefined {
  if (!params.pipelineStatePath) return undefined;
  const stateRel = relative(params.worktreePath, params.pipelineStatePath);
  const rootStatePath = resolve(params.repoRoot, stateRel);
  if (!existsSync(rootStatePath)) return undefined;
  const state = readPipelineState(rootStatePath);
  const evidenceRef = state.stages.executor.artifact_ref;
  return evidenceRef && existsSync(resolve(params.repoRoot, evidenceRef)) ? evidenceRef : undefined;
}

function changedPathsBetween(repoRoot: string, baseCommit: string, outputCommit: string): string[] {
  return gitOutput(repoRoot, ["diff", "--name-only", `${baseCommit}..${outputCommit}`])
    .split("\n")
    .map((path) => path.trim())
    .filter(Boolean);
}

// post-review の記帳（個票・イベント・review の plan と result）の commit が hook で失敗すると、
// 記帳は作業ツリーに残ったまま次の項目へ進む。人が確かめて手で commit できるよう、失敗した
// hook の名前と最初のエラーの行（commitRegisterState の要約）、残ったファイル、hook の全出力の
// 置き場所を runner のログへ出す。
export function postReviewCommitFailureLines(params: {
  itemId: string;
  message: string;
  leftFiles: readonly string[];
  failureLogPath: string;
}): string[] {
  const summary = params.message.replace(/^git commit failed:\s*/u, "");
  // summarizeGitHookFailure は失敗した step を `<step>: <最初のエラーの行>` の形で先頭に置く。
  // git 自身の `fatal:` / `error:` は hook 名ではないため、hook 名として扱わない。
  const match = summary.match(/^([\w.-]+): (.*)$/su);
  const isHookName = match !== null && !/^(?:fatal|error|warning|hint)$/iu.test(match[1]!);
  const hook = isHookName ? match[1]! : "unknown";
  const firstError = isHookName ? match[2]! : summary;
  return [
    `Error: post-review bookkeeping commit failed for ${params.itemId}`,
    `  failed hook: ${hook}`,
    `  first error: ${firstError || "unknown"}`,
    `  uncommitted bookkeeping files: ${params.leftFiles.length > 0 ? params.leftFiles.join(", ") : "none"}`,
    `  full hook output: ${params.failureLogPath}`,
  ];
}

function reportPostReviewCommitFailure(params: {
  repoRoot: string;
  itemId: string;
  error: unknown;
  preexisting: readonly string[];
  failureLogPath: string;
}): void {
  const message = params.error instanceof Error ? params.error.message : String(params.error);
  const leftFiles = worktreeStatusPaths(params.repoRoot)
    .filter((path) => !params.preexisting.includes(path))
    .sort();
  const lines = postReviewCommitFailureLines({
    itemId: params.itemId,
    message,
    leftFiles,
    failureLogPath: repoRelative(params.repoRoot, params.failureLogPath),
  });
  process.stderr.write(`${lines.join("\n")}\n`);
}

export async function runRegisterPostReview(params: {
  context: RegisterRunContext;
  opts: RunOpts;
  registerPaths: RegisterPaths;
  item: PjrItem;
  ticketPath: string;
  stem: string;
  editPlanPath: string;
  editResultPath: string;
  baseCommit: string;
  outputCommit: string;
  worktreePath: string;
  editPipelineStatePath?: string;
}): Promise<{
  transition: RegisterItemTransition;
  outcome: "success" | "failure";
  reason: string;
  commit?: string;
}> {
  const { context, opts, item, registerPaths } = params;
  const agents = resolveRegisterPostReviewAgents(context.roster, opts, context.execDefaults);
  const editEvidenceRef = editEvidenceRefAtRoot({
    repoRoot: context.repoRoot,
    worktreePath: params.worktreePath,
    pipelineStatePath: params.editPipelineStatePath,
  });
  const preexisting = worktreeStatusPaths(context.repoRoot);
  const generated = await generateRegisterPostReviewPlan({
    context,
    item,
    ticketPath: params.ticketPath,
    stem: params.stem,
    editPlanPath: params.editPlanPath,
    editResultPath: params.editResultPath,
    ...(editEvidenceRef ? { editEvidenceRef } : {}),
    baseCommit: params.baseCommit,
    outputCommit: params.outputCommit,
  });
  await scaffoldResult({
    executionPath: context.executionPath,
    taskId: generated.taskId,
    mode: "review",
    projectId: context.projectId,
    origin: "register",
    planRef: repoRelative(context.executionPath, generated.planPath),
    agent: agents.executor.actor,
    startedAt: new Date().toISOString(),
    stem: `${params.stem}-post-review`,
  });

  process.stdout.write(
    `Running post-review for ${item.id}: ${agents.executor.actor} (executor), ${agents.reporterCandidates[0]?.actor ?? "reporter"} (reporter)\n`,
  );
  const reviewExecDefaults: ExecDefaultsConfig = {
    ...context.execDefaults,
    pipeline: { ...context.execDefaults.pipeline, parent_validations: [] },
  };
  const outcome = await runAgentPipeline({
    repoRoot: context.repoRoot,
    cwd: context.repoRoot,
    schedulePath: context.schedulePath,
    executionPath: context.executionPath,
    taskId: generated.taskId,
    executor: agents.executor,
    reporterCandidates: agents.reporterCandidates,
    planPath: generated.planPath,
    planPrompt: expandPromptRefs(readFileSync(generated.planPath, "utf8")),
    resultPath: generated.resultPath,
    registerPaths: registerReporterManagedPaths(registerPaths),
    execDefaults: reviewExecDefaults,
    providerConcurrencyGate: context.providerConcurrencyGate,
    mode: "review",
    executorRateLimitOptions: resolvePinnedRateLimitRunOptions(
      opts,
      context.execDefaults,
      context.roster,
      "executor",
      agents.executor,
    ),
    ...(opts.reporterBy
      ? {
          reporterRateLimitOptions: resolvePinnedRateLimitRunOptions(
            opts,
            context.execDefaults,
            context.roster,
            "reporter",
            agents.reporterCandidates[0]!,
          ),
        }
      : {}),
  });

  const reviewStatePath = resolve(context.repoRoot, outcome.stateRef);
  const reviewState = readPipelineState(reviewStatePath);
  const reviewActor = reviewState.stages.executor.actor ?? agents.executor.actor;
  const reviewEvidencePath = reviewState.stages.executor.artifact_ref
    ? resolve(context.repoRoot, reviewState.stages.executor.artifact_ref)
    : undefined;
  let reviewFailure = outcome.blockReason;
  if (reviewEvidencePath && existsSync(reviewEvidencePath)) {
    const evidence = JSON.parse(readFileSync(reviewEvidencePath, "utf8")) as ExecEvidence;
    const unexpected = evidence.attempt_changes ?? [];
    if (unexpected.length > 0) {
      reviewFailure = `review executor changed files: ${unexpected.map((change) => change.path).join(", ")}`;
    }
  }

  let verdict =
    outcome.exitCode === 0 ? registerPostReviewVerdict(generated.resultPath) : undefined;
  if (reviewFailure || !verdict) {
    const reason = reviewFailure ?? "review result has no verdict";
    if (registerPostReviewVerdict(generated.resultPath)) {
      await forceIncompleteReviewResult(generated.resultPath, reason);
    } else {
      await fillFailedReviewResult(generated.resultPath, reason);
    }
    verdict = "incomplete";
    await updateResultStatus(generated.resultPath, "blocked", new Date().toISOString(), reason);
  } else if (!POST_REVIEW_VERDICTS.has(verdict)) {
    const reason = `register post-review returned unsupported verdict ${verdict}`;
    await forceIncompleteReviewResult(generated.resultPath, reason);
    verdict = "incomplete";
    await updateResultStatus(generated.resultPath, "blocked", new Date().toISOString(), reason);
  } else {
    await updateResultStatus(generated.resultPath, "complete", new Date().toISOString());
  }

  const runnerImplementationChanged = changesModifyRunningSpecDojo(
    context.repoRoot,
    changedPathsBetween(context.repoRoot, params.baseCommit, params.outputCommit),
  );
  const disposition = registerPostReviewDisposition({
    itemType: item.type,
    verdict,
    runnerImplementationChanged,
  });
  const rationale = sanitizeRegisterConclusion(
    `post-run review verdict ${verdict}: ${reviewRationale(generated.resultPath)}; ${disposition.explanation}`,
  );

  if (disposition.transition === "done") {
    if (
      !spawnRegisterTransition(context.projectId, [
        "close",
        "--id",
        item.id,
        "--status",
        "done",
        "--by",
        reviewActor,
        "--reason",
        rationale,
      ])
    ) {
      throw new Error(`register close transition failed after post-review: ${item.id}`);
    }
  } else if (disposition.transition === "waiting") {
    if (
      !spawnRegisterTransition(context.projectId, [
        "wait",
        "--id",
        item.id,
        "--by",
        reviewActor,
        "--reason",
        rationale,
      ])
    ) {
      throw new Error(`register wait transition failed after post-review: ${item.id}`);
    }
  }

  const evidencePrefix = `${repoRelative(context.repoRoot, dirname(reviewStatePath))}/`;
  const managed = worktreeStatusPaths(context.repoRoot)
    .filter((path) => {
      const normalized = path.replaceAll("\\", "/");
      return (
        normalized === repoRelative(context.repoRoot, generated.planPath) ||
        normalized === repoRelative(context.repoRoot, generated.resultPath) ||
        normalized.startsWith(evidencePrefix)
      );
    })
    .map((path) => resolve(context.repoRoot, path));
  const commitFailureLogPath = join(dirname(reviewStatePath), "post-review-commit.log");
  try {
    commitRegisterState(
      context.repoRoot,
      registerPaths,
      `exec(register ${item.id}): post-review ${verdict}`,
      params.ticketPath,
      managed,
      commitFailureLogPath,
    );
  } catch (error) {
    reportPostReviewCommitFailure({
      repoRoot: context.repoRoot,
      itemId: item.id,
      error,
      preexisting,
      failureLogPath: commitFailureLogPath,
    });
    throw error;
  }
  const commit = gitOutput(context.repoRoot, ["rev-parse", "--short", "HEAD"]).trim();
  const introduced = worktreeStatusPaths(context.repoRoot).filter(
    (path) => !preexisting.includes(path),
  );
  if (introduced.length > 0) {
    process.stderr.write(
      `Warning: post-review left uncommitted files for ${item.id}: ${introduced.join(", ")}\n`,
    );
  }
  return {
    transition: disposition.transition,
    outcome: disposition.outcome,
    reason: rationale,
    commit: `committed ${commit}`,
  };
}
