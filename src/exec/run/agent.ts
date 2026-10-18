import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { basename, relative, resolve, sep } from "node:path";
import {
  resolveMemberCommand,
  resolveRateLimitDetection,
  resolveRateLimitPolicy,
  type ExecDefaultsConfig,
  type RateLimitDetection,
} from "../agent-config.js";
import {
  decidePinnedWait,
  normalizeAgentLimit,
  type AgentLimitKind,
  type AgentLimitSignal,
} from "../limit.js";
import { replaceDocIndexRefs } from "../../docs/doc-index.js";
import { loadPlan, parsePlanTaskIdentity } from "../plans.js";
import type { ReadyTaskView, TaskMode } from "../types.js";
import {
  recordParentValidationFailureOutput,
  validateResumedTargetCoverage,
  writeExecutorEvidence,
  type ExecEvidence,
} from "../evidence.js";
import {
  parentValidationDisplayCommands,
  parentValidationGateFor,
  parentValidationLabels,
  parentValidationRoots,
  recordedParentValidationLabel,
  replaceParentValidationResults,
  runParentValidationBatch,
  type ParentValidationBatchResult,
  type ParentValidationEntry,
  type ParentValidationInvoker,
  type ParentValidationRoots,
} from "../parent-validation.js";
import {
  getProjectExecutionPath,
  loadConfig,
  loadMemberRoster,
  specdojoRootDir,
  type AgentProvider,
  type MemberRoster,
} from "../../shared/specdojo-config.js";
import {
  agentProtectedConfigViolation,
  captureAgentProtectedConfigAcrossRepos,
  changedAgentProtectedConfigAcrossRepos,
  qualifiedRepoPaths,
} from "../agent-protected-config.js";
import {
  agentGitStateViolation,
  captureAgentGitStateAcrossRepos,
  changedAgentGitStateAcrossRepos,
  qualifiedGitStateFields,
} from "../agent-git-state.js";
import {
  recordGitStateBlockAcrossRepos,
  recordProtectedConfigBlockAcrossRepos,
} from "../protection-handoff.js";
import {
  productRepoEnvironment,
  productRootsFromEnvironment,
  withAgentExtraRoots,
  withoutInheritedRepoEnvironment,
} from "../task-repos.js";
import { gitEnvironment, type ExecWorktree, type ProductWorktree } from "../worktree.js";
import {
  isRateLimitError,
  resolveAgentOverride,
  selectCandidates,
  type AgentExecution,
  type AgentRunCandidate,
  type PinnedRateLimitRunOptions,
  type RateLimitRecoveryEvent,
  type ResolvedRequirements,
  type RunResult,
} from "./shared.js";

function delay(ms: number): Promise<void> {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, ms));
}

export function expandPromptRefs(
  prompt: string,
  indexPath = resolve(specdojoRootDir(), ".specdojo/doc-index.json"),
): string {
  if (!existsSync(indexPath)) return prompt;

  // Agents open the referenced files directly, so resolve [[id]] refs to canonical
  // repo-relative paths (no leading slash) rather than markdown links. This keeps every
  // path in the agent-consumed plan in one form that resolves from the run CWD.
  const result = replaceDocIndexRefs(prompt, indexPath, {
    format: "path",
    missing: "keep",
  });
  if (result.missingIds.length > 0) {
    process.stderr.write(`Unresolved ID reference(s): ${result.missingIds.join(", ")}\n`);
  }
  return result.content;
}

export function loadPrompt(executionPath: string, taskId: string): string | null {
  const plan = loadPlan(executionPath, taskId);
  return plan ? expandPromptRefs(plan) : null;
}

type ExecutorPromptOptions = {
  mode?: TaskMode;
  resumed?: boolean;
  existingChanges?: readonly string[];
  initialChangeTargets?: readonly string[];
  resumeHandoff?: readonly string[];
  coverageSource?: "declared" | "initial-changes" | "none";
};

export function resolveResumedCoverageTargets(
  plan: string,
  initialChangeTargets: readonly string[] = [],
): { source: "declared" | "initial-changes" | "none"; targets: string[] } {
  const declared = [
    ...new Set((parsePlanTaskIdentity(plan)?.targets ?? []).map((target) => target.trim())),
  ].filter(Boolean);
  if (declared.length > 0) return { source: "declared", targets: declared };
  const initial = [...new Set(initialChangeTargets.map((target) => target.trim()))].filter(Boolean);
  return initial.length > 0
    ? { source: "initial-changes", targets: initial }
    : { source: "none", targets: [] };
}

function executorEvidenceContract(
  parentValidations: readonly ParentValidationEntry[],
  options: ExecutorPromptOptions = {},
): string {
  const parentValidationLabelList = parentValidationLabels(parentValidations);
  const parentValidationCommands = parentValidationDisplayCommands(parentValidations);
  const parentValidationInstruction =
    parentValidationLabelList.length > 0
      ? `\nThe SpecDojo parent runner will execute these allowlisted validations after you exit: ${parentValidationLabelList.join(", ")} (${parentValidationCommands.join(", ")}). Do not run those commands inside the agent sandbox or report duplicate executor results for them. Run only the remaining sandbox-safe validations required by the plan. Parent-run results will be appended to evidence with source=runner and are authoritative.\n`
      : "";
  const coverage = {
    source: options.coverageSource ?? "none",
    targets: [...(options.initialChangeTargets ?? [])],
  };
  const coverageInstruction =
    coverage.source === "initial-changes"
      ? `The plan declares no \`targets\`. The paths below were materially changed by the first
executor attempt and are an incomplete lower bound, not an upper bound on the work required.
Inspect the entire plan and any additional artifacts it requires. For each lower-bound path,
include one \`target_coverage\` entry and use the path exactly as the entry's \`target\` value:
${coverage.targets.map((target) => `- \`${target}\``).join("\n")}`
      : coverage.source === "declared"
        ? `For each entry in plan frontmatter \`targets\`, include one \`target_coverage\` entry in
the evidence envelope. Use the target ID exactly as written in the plan. Declared targets take
priority over any files recorded by an earlier attempt.`
        : `The plan declares no \`targets\` and no first-attempt change lower bound was recorded.
Omit \`target_coverage\` and state in \`final_message\` which artifacts you verified and which
remain unverified.`;
  const resumeInstruction = options.resumed
    ? `
This executor invocation resumes an interrupted attempt. Existing worktree changes may represent
only a partial implementation; they are not proof that the plan is complete. Re-read the entire
plan before reporting success. ${coverageInstruction}

${
  options.resumeHandoff?.length
    ? `The previous attempt left these failure details. Address them before reporting success:\n${options.resumeHandoff.map((detail) => `- ${detail}`).join("\n")}\n`
    : ""
}

A changed target must use status \`changed\`, provide its
repository-relative \`path\`, and actually be present in the cumulative worktree diff. A target
that legitimately needs no change must use status \`unchanged\` and provide a concrete \`reason\`;
the runner will preserve that reason in the result. If you cannot account for every target, exit
non-zero instead of claiming completion.${
        options.existingChanges?.length
          ? `\n\nChanges already present when this resumed invocation started:\n${options.existingChanges.map((path) => `- \`${path}\``).join("\n")}`
          : ""
      }
`
    : "";
  const targetCoverageExample = options.resumed
    ? ',"target_coverage":[{"target":"exact declared target id or lower-bound path","status":"changed|unchanged","path":"repo-relative path for changed targets","reason":"required when unchanged"}]'
    : "";
  const reviewValidationInstruction =
    options.mode === "review"
      ? `
For a review task, report only checks you actually ran in \`validations\`. Do not add optional
checks you chose not to run as \`not_run\` or \`not_applicable\`. Describe them instead in
\`final_message\` under "確認できなかった範囲" so the reporter can record that scope in the
review result and reflect it in the verdict.
`
      : "";
  return `

---

# Pipeline executor stage instructions

This invocation is the executor stage of an executor/reporter pipeline. Edit and validate the
artifacts required by the plan, but do not create or update the result file. Any plan instruction
that assigns result writing or lifecycle transitions to the agent belongs to the later reporter or
runner stage and does not apply here.

The parent runner owns Git commits and repository configuration. Do not run git commit or change
local, global, or system Git configuration, including user.name and user.email. A Git state change
will stop the pipeline before validation, reporting, commit, or merge.

Do not create disposable or scratch files at the repository root; place them in \`tmp/\` within
the worktree or outside the repository. Files under \`tmp/\` are excluded from commits.

When writing Markdown in the final evidence, wrap identifiers or field names containing an
underscore in inline code (for example, \`depends_on\`).
${parentValidationInstruction}
${resumeInstruction}
${reviewValidationInstruction}

Use validation status \`requires_human\` only for a check that cannot run from the agent sandbox,
such as launching a real agent CLI, consuming a usage quota or incurring a charge, or requiring
credentials or a host-side operation. Do not use it for a check that could run but was skipped;
report that as \`not_run\`. A \`requires_human\` check is carried into the result as a human handoff
and does not block pipeline completion.

Use validation status \`not_applicable\` when the repository does not meet a check's applicability
conditions, and include a non-empty \`reason\`. The runner carries it into the result without
blocking completion, but rejects the claim when it can confirm the check applies:
- \`npm run <script>\` / \`npm test\`: the script exists in package.json. The placeholder \`test\`
  script that \`npm init\` writes (\`echo "Error: no test specified" && exit 1\`) counts as absent.
- \`npx <package>\`: the package is in package.json dependencies or devDependencies.
- A command that targets a declared product repository (a \`<repo>:<path>\` argument or
  \`--prefix <repo>\`) is judged by that repository's package.json, not the project repository's.
- \`specdojo catalog validate\`: the run's target project (or \`--project <id>\`) sets \`catalog_path\`
  and your changes reach \`docs/ja/projects/\`. A project without \`catalog_path\`, or changes
  outside \`docs/ja/projects/\`, is a valid reason; state it in \`reason\`.

Do not run or report \`specdojo index build\`. It writes \`.specdojo/doc-index.json\`, which the
agent may not write, and the runner regenerates the index while preparing the worktree and before
integration.

End the final response with exactly one machine-readable report using this envelope. Do not place
Markdown fences around the JSON.

<specdojo_executor_evidence>
{"final_message":"concise outcome","validations":[{"command":"exact command","status":"passed|failed|not_run|not_applicable|requires_human","summary":"concise result or required human check","reason":"required when status is not_applicable"}]${targetCoverageExample}}
</specdojo_executor_evidence>
`;
}

export function buildExecutorPrompt(
  plan: string,
  parentValidations: readonly ParentValidationEntry[] = [],
  options: ExecutorPromptOptions = {},
): string {
  const coverage = resolveResumedCoverageTargets(plan, options.initialChangeTargets);
  return `${plan.trimEnd()}${executorEvidenceContract(parentValidations, {
    ...options,
    mode: options.mode ?? parsePlanTaskIdentity(plan)?.mode ?? "edit",
    initialChangeTargets: coverage.targets,
    coverageSource: coverage.source,
  })}`;
}

export function resumedTargetCoverageFailure(params: {
  resumed: boolean;
  plan: string;
  evidence: ExecEvidence;
  evidencePath: string;
  initialChangeTargets?: readonly string[];
}): string | undefined {
  if (!params.resumed) return undefined;
  const targets = resolveResumedCoverageTargets(params.plan, params.initialChangeTargets).targets;
  const coverage = validateResumedTargetCoverage(targets, params.evidence);
  if (coverage.ok) return undefined;

  params.evidence.stage.status = "failed";
  writeExecutorEvidence(params.evidencePath, params.evidence);
  return coverage.reason;
}

export type ParentValidationRunOptions = {
  // Identifies the waiting item in gate logs (task / register ID). Defaults to the cwd name.
  label?: string;
  invoke?: ParentValidationInvoker;
};

// 同じ exec run 内の親検証は run 全体の gate（既定 1 本）で直列化する。executor と reporter は
// gate の外で並列に動き、検証だけが順番待ちになる。`cwd` に文字列を渡すとプロジェクト worktree
// だけを持つ run として扱い、プロダクトリポジトリへ割り当てた検証は failed になる（PJR-V96B）。
export async function runConfiguredParentValidationBatch(
  execDefaults: ExecDefaultsConfig,
  cwd: string | ParentValidationRoots,
  options: ParentValidationRunOptions = {},
): Promise<ParentValidationBatchResult> {
  const entries = execDefaults.pipeline?.parent_validations;
  if (!entries?.length) return { validations: [], failureOutputs: [] };
  const labels = parentValidationLabels(entries);
  const label = options.label ?? basename(typeof cwd === "string" ? cwd : cwd.project);
  const batch = await parentValidationGateFor(execDefaults).run(label, labels, async () => {
    process.stdout.write(`  Running parent validations (${label}): ${labels.join(", ")}\n`);
    return await runParentValidationBatch(entries, cwd, options.invoke);
  });
  for (const validation of batch.validations) {
    process.stdout.write(
      `  Parent validation ${recordedParentValidationLabel(validation)}: ${validation.status}\n`,
    );
  }
  return batch;
}

export async function runConfiguredParentValidations(
  execDefaults: ExecDefaultsConfig,
  cwd: string | ParentValidationRoots,
  options: ParentValidationRunOptions = {},
): Promise<ParentValidationBatchResult["validations"]> {
  return (await runConfiguredParentValidationBatch(execDefaults, cwd, options)).validations;
}

// executor のプロセス結果は親検証より先に checkpoint する。親検証は長時間かかり得るため、
// その途中で runner が終了しても agent 出力と変更一覧を失わないよう、ここでは保存済み evidence
// へ runner-owned validation だけを追記する。
export async function appendParentValidationsToExecutorEvidence(params: {
  execDefaults: ExecDefaultsConfig;
  cwd: string;
  productWorktrees?: readonly ProductWorktree[];
  evidence: ExecEvidence;
  evidencePath: string;
}): Promise<ExecEvidence> {
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
  return evidence;
}

export function executorRequirements(task: ReadyTaskView): ResolvedRequirements | undefined {
  const executor = task.agent_pipeline?.stages[0];
  if (!executor || executor.stage_role !== "executor") return undefined;
  return {
    capabilities: executor.capabilities ?? [],
    proficiency: executor.proficiency,
    stage_role: "executor",
  };
}

export function reporterRequirements(task: ReadyTaskView): ResolvedRequirements | undefined {
  const reporter = task.agent_pipeline?.stages[1];
  if (!reporter || reporter.stage_role !== "reporter") return undefined;
  return {
    capabilities: reporter.capabilities ?? [],
    proficiency: reporter.proficiency,
    stage_role: "reporter",
  };
}

export function resolveReporterAgentCandidates(
  task: ReadyTaskView,
  roster: MemberRoster | null,
  execDefaults: ExecDefaultsConfig,
  busyActors?: ReadonlySet<string>,
  nicknameOverride?: string,
): AgentRunCandidate[] {
  const requirements = reporterRequirements(task);
  if (!requirements) return [];
  if (nicknameOverride) {
    const resolution = resolveAgentOverride(
      task.mode ?? "edit",
      nicknameOverride,
      {},
      roster,
      execDefaults,
      "reporter",
    );
    if (resolution.kind === "error") {
      throw new Error(resolution.message.replace(/^--by/, "--reporter-by"));
    }
    if (resolution.kind === "command") {
      return [
        {
          command: resolution.command,
          actor: resolution.actor,
          provider: resolution.provider,
        },
      ];
    }
  }
  // Reporter behavior (turn captured evidence into a structured result; write nothing
  // else) does not vary between edit and review tasks, unlike the executor stage. Do not
  // filter reporter candidates by task.mode: a reporter member's own `mode` (if it has
  // one, e.g. to resolve a provider command_template placeholder) only affects command
  // construction, not eligibility.
  const candidates: AgentRunCandidate[] = [];
  for (const member of selectCandidates(
    requirements,
    roster,
    undefined,
    busyActors,
    execDefaults,
  )) {
    try {
      const command = resolveMemberCommand(execDefaults, member);
      if (command) candidates.push({ command, actor: member.nickname, provider: member.provider });
    } catch (error) {
      process.stdout.write(
        `  Skipping reporter ${member.nickname}: ${error instanceof Error ? error.message : String(error)}\n`,
      );
    }
  }
  return candidates;
}

export function loadRosterForExecutionPath(executionPath: string): MemberRoster | null {
  const { config } = loadConfig();
  if (!config) return null;

  const rootDir = specdojoRootDir();
  for (const project of Object.values(config.projects)) {
    const projExecPath = resolve(rootDir, getProjectExecutionPath(project));
    if (projExecPath === executionPath) {
      return loadMemberRoster(rootDir, project);
    }
  }
  return null;
}

export async function executeAgent(
  agentCommand: string,
  prompt: string,
  detection: RateLimitDetection | undefined,
  provider: AgentProvider | undefined,
  cooldownSeconds: Partial<Record<AgentLimitKind, number>> | undefined,
  cwd: string,
  env: NodeJS.ProcessEnv,
  quiet = false,
): Promise<AgentExecution> {
  if (!agentCommand.trim()) {
    return { result: "failure", exitCode: null, stdout: "", stderr: "Empty agent command" };
  }

  // stdout is piped (not inherited) so it can be scanned for rate-limit signals: some CLIs print
  // the limit notice to stdout, not stderr (e.g. claude's "session limit"). Unless quiet, each
  // chunk is teed to the parent's stdout so live output/logging is preserved.
  const child = spawn(agentCommand, {
    cwd,
    env,
    shell: true,
    stdio: ["pipe", "pipe", "pipe"],
  });
  // stdin を読まずに即終了するコマンドへの書き込みは EPIPE になる。未処理だと
  // プロセスごと落ちて失敗時の後処理（block 遷移・result 更新）が走らないため無視する。
  // 実行結果は終了コードで判定する。
  child.stdin.on("error", () => undefined);
  let stdout = "";
  let stderr = "";
  child.stdout.setEncoding("utf8");
  child.stdout.on("data", (chunk: string) => {
    stdout += chunk;
    if (!quiet) process.stdout.write(chunk);
  });
  child.stderr.setEncoding("utf8");
  child.stderr.on("data", (chunk: string) => {
    stderr += chunk;
    process.stderr.write(chunk);
  });
  child.stdin.end(prompt);

  const exitCode = await new Promise<number | null>((resolveExit) => {
    child.once("error", (error) => {
      stderr += `${error.message}\n`;
      resolveExit(null);
    });
    child.once("close", (code) => resolveExit(code));
  });

  const combinedOutput = `${stdout}\n${stderr}`;
  if (isRateLimitError(exitCode, combinedOutput, detection)) {
    return {
      result: "rate_limit",
      exitCode,
      stdout,
      stderr,
      limit: normalizeAgentLimit({
        output: combinedOutput,
        provider,
        cooldownSeconds,
      }),
    };
  }
  if (exitCode !== 0) {
    return { result: "failure", exitCode, stdout, stderr };
  }
  return { result: "success", exitCode: 0, stdout, stderr: "" };
}

// Run the task's agent command, falling back through the remaining candidates on rate limit.
// The next-priority candidate is assumed to be a different account/provider, so we switch to it
// immediately (no wait). Only after every candidate is rate-limited do we wait+backoff and run
// another full pass, bounded by rate_limit_policy.on_critical.retry.max_attempts. Applies to all
// tasks (critical and non-critical) so a rate limit no longer stops the run outright.
//
// Detection is resolved per candidate from its provider (e.g. claude's "session limit" vs
// opencode's "timeout"/"out of memory"); the run-level retry/backoff policy is governed by the
// primary (highest-priority) candidate's provider.
// 保護機構が block したとき、result へ自動記録できたかを実行ログにも残す。記録できない場合
// （result 未 scaffold など）は、申し送りが result に無いことが分かるよう理由を出力する。
export function reportProtectionHandoffRecord(recorded: boolean, resultPath?: string): void {
  process.stdout.write(
    recorded
      ? `  Handoff recorded in result: ${resultPath}\n`
      : "  Handoff not recorded: no writable result for this run\n",
  );
}

//
// resultPath は保護機構が block したときの申し送り記録先（agent が動く cwd 側の result）。
// 未指定でも block と終了コードの扱いは変わらない。
function rateLimitPrefix(result: RunResult): string {
  return result === "rate_limit" ? "rate limit reached; " : "";
}

export async function runWithRetry(
  candidates: AgentRunCandidate[],
  prompt: string,
  execDefaults: ExecDefaultsConfig,
  cwd: string,
  env: NodeJS.ProcessEnv,
  resultPath?: string,
  pinned?: PinnedRateLimitRunOptions,
): Promise<{
  result: RunResult;
  exitCode: number | null;
  stdout: string;
  stderr: string;
  attempts: number;
  limit?: AgentLimitSignal;
  protectionBlock?: true;
  actor?: string;
  rateLimitEvents: RateLimitRecoveryEvent[];
}> {
  const policy = resolveRateLimitPolicy(execDefaults, candidates[0]?.provider);
  let attempts = 0;
  // PJR-98G4: agentEnvironment が渡したプロダクト worktree を、provider の追加ディレクトリと
  // 保護設定・Git 状態の検査対象に加える。宣言の無い project では cwd だけになる。
  const productRoots = productRootsFromEnvironment(env);
  const agentRepos = [
    { root: cwd },
    ...productRoots.map((root) => ({ name: root.name, root: root.path })),
  ];

  // One pass tries every candidate in priority order with no wait between switches.
  const runPass = async (
    passCandidates = candidates,
  ): Promise<{
    result: RunResult;
    exitCode: number | null;
    stdout: string;
    stderr: string;
    limit?: AgentLimitSignal;
    protectionBlock?: true;
    actor?: string;
  }> => {
    let lastStderr = "";
    let lastStdout = "";
    let lastExitCode: number | null = null;
    let lastLimit: AgentLimitSignal | undefined;
    let lastActor: string | undefined;
    for (let idx = 0; idx < passCandidates.length; idx++) {
      if (idx > 0) {
        process.stdout.write(
          `Rate limit detected. Switching to next agent (${idx + 1}/${passCandidates.length})...\n`,
        );
      }
      const candidate = passCandidates[idx];
      const detection = resolveRateLimitDetection(execDefaults, candidate.provider);
      const candidatePolicy = resolveRateLimitPolicy(execDefaults, candidate.provider);
      attempts++;
      lastActor = candidate.actor;
      const protectedConfigBefore = captureAgentProtectedConfigAcrossRepos(agentRepos);
      const gitStateBefore = captureAgentGitStateAcrossRepos(agentRepos);
      const attempt = await executeAgent(
        withAgentExtraRoots(
          candidate.command,
          candidate.provider,
          productRoots.map((root) => root.path),
        ),
        prompt,
        detection,
        candidate.provider,
        candidatePolicy?.cooldown_seconds,
        cwd,
        env,
      );
      const protectedConfigChanges = changedAgentProtectedConfigAcrossRepos(protectedConfigBefore);
      if (protectedConfigChanges.length > 0) {
        // 利用上限で止まった場合も保護の検査は飛ばさない。止まった理由として利用上限を先に記録する。
        const reason =
          rateLimitPrefix(attempt.result) +
          agentProtectedConfigViolation(qualifiedRepoPaths(protectedConfigChanges));
        process.stderr.write(`blocked: ${reason}\n`);
        reportProtectionHandoffRecord(
          recordProtectedConfigBlockAcrossRepos({
            resultPath,
            changes: protectedConfigChanges,
            reason,
          }),
          resultPath,
        );
        return {
          result: "failure",
          exitCode: 1,
          stdout: attempt.stdout,
          stderr: `${attempt.stderr}${attempt.stderr.endsWith("\n") || !attempt.stderr ? "" : "\n"}${reason}\n`,
          protectionBlock: true,
          actor: candidate.actor,
        };
      }
      const gitStateChanges = changedAgentGitStateAcrossRepos(gitStateBefore);
      if (gitStateChanges.length > 0) {
        // 利用上限で止まった場合も保護の検査は飛ばさない。止まった理由として利用上限を先に記録する。
        const reason =
          rateLimitPrefix(attempt.result) +
          agentGitStateViolation(qualifiedGitStateFields(gitStateChanges));
        process.stderr.write(`blocked: ${reason}\n`);
        reportProtectionHandoffRecord(
          recordGitStateBlockAcrossRepos({
            resultPath,
            changes: gitStateChanges,
            reason,
          }),
          resultPath,
        );
        return {
          result: "failure",
          exitCode: 1,
          stdout: attempt.stdout,
          stderr: `${attempt.stderr}${attempt.stderr.endsWith("\n") || !attempt.stderr ? "" : "\n"}${reason}\n`,
          protectionBlock: true,
          actor: candidate.actor,
        };
      }
      lastStderr = attempt.stderr;
      lastStdout = attempt.stdout;
      lastExitCode = attempt.exitCode;
      lastLimit = attempt.limit;
      if (attempt.result !== "rate_limit")
        return {
          result: attempt.result,
          exitCode: attempt.exitCode,
          stdout: attempt.stdout,
          stderr: attempt.stderr,
          actor: candidate.actor,
        };
    }
    return {
      result: "rate_limit",
      exitCode: lastExitCode,
      stdout: lastStdout,
      stderr: lastStderr,
      limit: lastLimit,
      actor: lastActor,
    };
  };

  const recoveryEvents: RateLimitRecoveryEvent[] = [];
  const firstPass = await runPass(pinned ? candidates.slice(0, 1) : candidates);
  if (firstPass.result !== "rate_limit") {
    return { ...firstPass, attempts, rateLimitEvents: recoveryEvents };
  }

  if (pinned) {
    const primary = candidates[0];
    if (pinned.action === "fallback" && pinned.fallbackCandidate) {
      const fallback = pinned.fallbackCandidate;
      const resumedAt = (pinned.now?.() ?? new Date()).toISOString();
      process.stdout.write(
        `Rate limit detected for pinned agent ${primary?.actor ?? "-"}. ` +
          `Falling back to ${fallback.actor} at ${resumedAt}.\n`,
      );
      recoveryEvents.push({
        action: "fallback",
        from_actor: primary?.actor ?? "unknown",
        to_actor: fallback.actor,
        resumed_at: resumedAt,
      });
      const fallbackResult = await runPass([fallback]);
      return { ...fallbackResult, attempts, rateLimitEvents: recoveryEvents };
    }

    if (pinned.action === "wait") {
      const decision = decidePinnedWait(
        firstPass.limit,
        pinned.now?.() ?? new Date(),
        pinned.maxWaitSeconds,
      );
      if (decision.action === "wait") {
        const { resumeAt, waitMilliseconds } = decision;
        process.stdout.write(
          `Rate limit detected for pinned agent ${primary?.actor ?? "-"}. ` +
            `Waiting until ${resumeAt.toISOString()} before resuming the same stage.\n`,
        );
        await (pinned.sleep ?? delay)(waitMilliseconds);
        const resumedAt = (pinned.now?.() ?? new Date()).toISOString();
        recoveryEvents.push({
          action: "wait",
          from_actor: primary?.actor ?? "unknown",
          to_actor: primary?.actor ?? "unknown",
          resume_at: resumeAt.toISOString(),
          resumed_at: resumedAt,
        });
        const resumed = await runPass(candidates.slice(0, 1));
        return { ...resumed, attempts, rateLimitEvents: recoveryEvents };
      }
      process.stdout.write(`${decision.message}\n`);
    }
    return { ...firstPass, attempts, rateLimitEvents: recoveryEvents };
  }

  // Every candidate is rate-limited. Without a policy we cannot bound further retries, so stop.
  if (!policy) {
    process.stdout.write(`Rate limit: all ${candidates.length} agent(s) exhausted.\n`);
    return { ...firstPass, attempts, rateLimitEvents: recoveryEvents };
  }

  // Session and quota limits do not recover within the short in-process backoff loop. Keep their
  // explicit reset/cooldown for a later routine invocation instead of sleeping and retrying now.
  if (firstPass.limit?.kind === "session_limit" || firstPass.limit?.kind === "quota_exhausted") {
    return { ...firstPass, attempts, rateLimitEvents: recoveryEvents };
  }

  const { retry } = policy.on_critical;
  let waitSeconds = retry.initial_wait_seconds;
  let lastStderr = firstPass.stderr;
  let lastStdout = firstPass.stdout;
  let lastExitCode = firstPass.exitCode;
  let lastLimit = firstPass.limit;

  // First pass counts as attempt 1; remaining passes wait+backoff before retrying all candidates.
  for (let pass = 2; pass <= retry.max_attempts; pass++) {
    const actualWait = Math.min(waitSeconds, retry.max_wait_seconds);
    process.stdout.write(
      `Rate limit: all agents exhausted (attempt ${pass}/${retry.max_attempts}). Waiting ${actualWait}s before retry...\n`,
    );
    await delay(actualWait * 1000);

    const result = await runPass();
    lastStderr = result.stderr;
    lastStdout = result.stdout;
    lastExitCode = result.exitCode;
    lastLimit = result.limit;
    if (result.result !== "rate_limit") {
      return { ...result, attempts, rateLimitEvents: recoveryEvents };
    }

    waitSeconds = Math.min(waitSeconds * retry.backoff_multiplier, retry.max_wait_seconds);
  }

  process.stdout.write(
    `Rate limit: all ${candidates.length} agent(s) exhausted after ${retry.max_attempts} attempt(s).\n`,
  );
  return {
    result: "rate_limit",
    exitCode: lastExitCode,
    stdout: lastStdout,
    stderr: lastStderr,
    attempts,
    limit: lastLimit,
    actor: candidates.at(-1)?.actor,
    rateLimitEvents: recoveryEvents,
  };
}

export function pathInsideWorktree(
  repoRoot: string,
  worktreePath: string,
  sourcePath: string,
): string {
  const repoRelative = relative(repoRoot, sourcePath);
  if (repoRelative === ".." || repoRelative.startsWith(`..${sep}`)) {
    throw new Error(`Project path is outside repository root: ${sourcePath}`);
  }
  return resolve(worktreePath, repoRelative);
}

export function reportProductWorktrees(worktree: ExecWorktree): void {
  for (const product of worktree.repos ?? []) {
    process.stdout.write(
      `  [run] ${product.created ? "setup" : "reuse"}: worktree ${product.path} ` +
        `(${product.branch} in ${product.name})\n`,
    );
  }
}

// productWorktrees（PJR-98G4）は、cwd（プロジェクト worktree）以外に agent が書き込むプロダクト
// worktree。SPECDOJO_REPO_<NAME> で絶対パスを渡し、runWithRetry はここから provider の追加
// ディレクトリと保護検査の対象を導く。
export function agentEnvironment(
  repoRoot: string,
  worktreePath: string,
  schedulePath: string,
  executionPath: string,
  productWorktrees?: readonly ProductWorktree[],
): NodeJS.ProcessEnv {
  return {
    ...withoutInheritedRepoEnvironment(gitEnvironment()),
    SPECDOJO_SCHEDULE_PATH: pathInsideWorktree(repoRoot, worktreePath, schedulePath),
    SPECDOJO_EXECUTION_PATH: pathInsideWorktree(repoRoot, worktreePath, executionPath),
    ...productRepoEnvironment(worktreePath, productWorktrees),
  };
}

const MAX_BLOCK_REASON_LENGTH = 500;

// agent の stderr から block イベント用の簡潔な理由を取り出す。テンプレートは異常終了時に
// `blocked: <reason>; need=...; ref=...`（review は `review-blocked: ...`）を出力させるため、
// その行を優先する。無ければ最後の非空行、それも無ければ汎用メッセージにフォールバックする。
export function extractBlockReason(stderr: string): string {
  const fallback = "agent exited with non-zero code";
  const lines = stderr
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const tagged = lines.find((line) => /^(blocked|review-blocked):/i.test(line));
  const reason = tagged ?? lines.at(-1);
  if (!reason) return fallback;
  const trimmed =
    reason.length > MAX_BLOCK_REASON_LENGTH
      ? `${reason.slice(0, MAX_BLOCK_REASON_LENGTH)}…`
      : reason;
  return `${fallback}: ${trimmed}`;
}
