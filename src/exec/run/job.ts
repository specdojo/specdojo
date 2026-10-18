import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { relative, resolve, sep } from "node:path";
import { selfRunArgs } from "../../shared/spawn-self.js";
import {
  loadExecDefaultsConfig,
  resolveMemberCommand,
  type ExecDefaultsConfig,
} from "../agent-config.js";
import { activateResolvedProjectPaths, resolveProjectPaths } from "../project.js";
import { specdojoRootDir, type MemberRoster } from "../../shared/specdojo-config.js";
import { type ReadyTaskView } from "../types.js";
import { ROUTINE_BUSY_SKIP_EXIT_CODE, ROUTINE_EXEC_ENV } from "./lock.js";
import {
  isResultUnfilled,
  readResultFrontmatterSnapshot,
  renderReporterResult,
  scaffoldResult,
  stripLeadingListMarker,
  updateResultStatus,
} from "../results.js";
import { formatMarkdownFile } from "../format.js";
import {
  completeJobRun,
  executeJobCommand,
  generateJobReviewPlan,
  isJobCommandTask,
  jobRunUsesReviewedIntegration,
  loadJobDefinition,
  loadJobRunRecord,
  materializeJobRun,
  recordJobRunReview,
  resolveJobPaths,
  resolveJobReviewAgentNominations,
  type JobDefinition,
  type JobReviewAgentNomination,
  type JobRunRecord,
} from "../../job/job.js";
import {
  ensureExecWorktree,
  formatGitResultFailure,
  gitOutput,
  gitResult,
  resolveWorktreeBase,
  summarizeGitHookFailure,
} from "../worktree.js";
import {
  mergeWorktreeIntoCurrent,
  removeWorktree,
  stabilizeCommitTargets,
  stageCommitTargets,
  worktreeStatusPaths,
} from "../worktree-ops.js";
import { recordCommandEvidence } from "../evidence.js";
import { evidenceForReporter } from "../reporter.js";
import {
  createPipelineState,
  pipelineStateLocation,
  updatePipelineStage,
  writePipelineState,
} from "../pipeline-state.js";
import {
  configuredWorktreeBase,
  resolveAgentOverride,
  resolveExecDefaultsPath,
  selectCandidates,
  type AgentRunCandidate,
  type RunOpts,
} from "./shared.js";
import {
  executorRequirements,
  expandPromptRefs,
  loadRosterForExecutionPath,
  resolveReporterAgentCandidates,
} from "./agent.js";
import { runAgentPipeline, runReporterStage } from "./agent-pipeline.js";
import { resolveInPlaceCommand, spawnAgentInPlace } from "./in-place.js";

export type JobPipelineAgentResolver = (
  roster: MemberRoster | null,
  opts: Pick<RunOpts, "executorBy" | "reporterBy">,
  execDefaults: ExecDefaultsConfig,
) => {
  executor: AgentRunCandidate & { actor: string };
  reporterCandidates: AgentRunCandidate[];
};

async function runCommandJobMode(params: {
  opts: RunOpts;
  record: JobRunRecord;
  runPath: string;
  planPath: string;
  projectId: string;
  schedulePath: string;
  executionPath: string;
}): Promise<void> {
  const { opts, record, runPath, planPath, projectId, schedulePath, executionPath } = params;
  if (!isJobCommandTask(record.task)) throw new Error("Expected a command Job task.");
  if (opts.by || opts.executorBy) {
    throw new Error(
      "--by and --executor-by are not available for command Jobs; the runner executes command.",
    );
  }
  if (opts.reporterBy && !record.task.analysis) {
    throw new Error("--reporter-by requires task.analysis on a command Job.");
  }
  const repoRoot = specdojoRootDir();
  const roster = loadRosterForExecutionPath(executionPath);
  const execDefaults = loadExecDefaultsConfig(
    resolveExecDefaultsPath(opts, schedulePath),
    executionPath,
  );
  const analysisNickname = record.task.analysis
    ? opts.reporterBy?.trim() || record.task.analysis.agent
    : undefined;
  const analysisResolution = analysisNickname
    ? resolveAgentOverride("edit", analysisNickname, {}, roster, execDefaults, "reporter")
    : undefined;
  if (analysisResolution?.kind === "error") throw new Error(analysisResolution.message);
  if (analysisResolution && analysisResolution.kind !== "command") {
    throw new Error(`Analysis agent not found: ${analysisNickname ?? ""}`);
  }
  const analysisCandidate =
    analysisResolution?.kind === "command"
      ? {
          command: analysisResolution.command,
          actor: analysisResolution.actor ?? analysisNickname,
          provider: analysisResolution.provider,
        }
      : undefined;

  if (opts.dryRun) {
    process.stdout.write(`[dry-run] execution: runner command\n`);
    if (record.task.precondition) {
      process.stdout.write(`[dry-run] precondition:\n${record.task.precondition.command}\n`);
      process.stdout.write(
        `[dry-run] precondition skip_when: ${record.task.precondition.skip_when}\n`,
      );
    }
    process.stdout.write(`[dry-run] command:\n${record.task.command}\n`);
    if (analysisCandidate) {
      process.stdout.write(
        `[dry-run] agent: ${analysisCandidate.actor ?? ""} (analysis reporter)\n`,
      );
      process.stdout.write(`[dry-run] reporter command: ${analysisCandidate.command}\n`);
    }
    process.stdout.write(`[dry-run] plan: ${planPath}\n`);
    return;
  }

  const resultActor = analysisCandidate?.actor ?? "specdojo-runner";
  const { resultPath } = await scaffoldResult({
    executionPath,
    taskId: record.run_id,
    mode: "edit",
    projectId,
    origin: "job",
    jobId: record.job_id,
    runId: record.run_id,
    planRef: record.plan_ref,
    agent: resultActor,
    startedAt: new Date().toISOString(),
    ...(record.task.targets ? { targets: record.task.targets } : {}),
  });
  const evidenceRunId = `attempt-${record.attempts.length}`;
  process.stdout.write(`Running Job Run ${record.run_id} command in place.\n`);
  const commandOutcome = await executeJobCommand(record.task.command, repoRoot);
  const commandPartial =
    !commandOutcome.error &&
    record.task.partial_exit_code !== undefined &&
    commandOutcome.exitCode === record.task.partial_exit_code;
  const recorded = recordCommandEvidence({
    repoRoot,
    worktreePath: repoRoot,
    executionPath,
    taskId: record.run_id,
    runId: evidenceRunId,
    actor: "specdojo-runner",
    command: record.task.command,
    shell: process.platform === "win32" ? process.env.ComSpec || "cmd.exe" : "/bin/sh -eu",
    startedAt: commandOutcome.startedAt,
    completedAt: commandOutcome.completedAt,
    exitCode: commandOutcome.exitCode,
    stdout: commandOutcome.stdout,
    stderr: commandOutcome.stderr,
    stdoutTruncated: commandOutcome.stdoutTruncated,
    stderrTruncated: commandOutcome.stderrTruncated,
    accepted: commandPartial,
    ...(commandOutcome.error ? { error: commandOutcome.error } : {}),
  });
  const evidenceRef = relative(repoRoot, recorded.evidencePath).split(sep).join("/");
  process.stdout.write(`Command evidence: ${evidenceRef}\n`);

  const commandSucceeded = commandOutcome.exitCode === 0 && !commandOutcome.error;
  const commandAccepted = commandSucceeded || commandPartial;
  if (!commandAccepted || !analysisCandidate) {
    const reporterEvidence = evidenceForReporter(recorded.evidence, {
      repoRoot,
      worktreePath: repoRoot,
      executionPath,
      resultPath,
    });
    const reason = commandAccepted
      ? undefined
      : commandOutcome.error
        ? `command spawn failed: ${commandOutcome.error}`
        : `command exited with code ${commandOutcome.exitCode ?? "unknown"}`;
    await renderReporterResult(
      resultPath,
      {
        schema_version: 1,
        mode: "edit",
        summary: [
          commandSucceeded
            ? "runner が解決済みコマンドを直接実行し、終了コード 0 を確認した。"
            : commandPartial
              ? `runner が解決済みコマンドを直接実行し、部分成功の終了コード ${commandOutcome.exitCode} を確認した。`
              : `runner が解決済みコマンドを直接実行したが、${reason}。`,
        ],
        changed_files: reporterEvidence.changes.map(({ path }) => ({
          path,
          summary: "runner command の実行後に検出した変更",
        })),
        handoff: [`command evidence: ${evidenceRef}`],
        approach:
          "Job Definition から materialize したコマンドを agent の解釈を介さず実行し、runner evidence を正本とした。",
      },
      reporterEvidence,
    );
    await updateResultStatus(
      resultPath,
      commandAccepted ? "complete" : "blocked",
      new Date().toISOString(),
      reason,
    );
    completeJobRun({
      projectId,
      runPath,
      status: commandSucceeded ? "succeeded" : commandPartial ? "partial" : "failed",
      evidenceRef,
      exitCode: commandOutcome.exitCode,
      ...(reason ? { reason } : {}),
    });
    if (commandSucceeded) {
      process.stdout.write(`Job Run complete: ${record.run_id}\n`);
    } else if (commandPartial) {
      process.stdout.write(`Job Run partial: ${record.run_id}\n`);
      if (record.trigger === "routine") {
        process.stdout.write(`[routine-job] complete run_id=${record.run_id} state=partial\n`);
      }
    } else {
      process.stdout.write(`Job Run failed: ${record.run_id}\n`);
      process.exitCode = commandOutcome.exitCode || 1;
    }
    return;
  }

  const stateLocation = pipelineStateLocation({
    repoRoot,
    worktreePath: repoRoot,
    executionPath,
    taskId: record.run_id,
    runId: evidenceRunId,
  });
  let state = createPipelineState({
    taskId: record.run_id,
    runId: evidenceRunId,
    updatedAt: commandOutcome.completedAt,
    executorActor: "specdojo-runner",
    reporterActor: analysisCandidate.actor,
    artifacts: {
      plan_ref: relative(repoRoot, planPath).split(sep).join("/"),
      result_ref: relative(repoRoot, resultPath).split(sep).join("/"),
    },
  });
  state = updatePipelineStage(
    state,
    "executor",
    {
      status: "succeeded",
      attempts: 1,
      started_at: commandOutcome.startedAt,
      completed_at: commandOutcome.completedAt,
      artifact_ref: evidenceRef,
    },
    commandOutcome.completedAt,
  );
  writePipelineState(stateLocation.path, state);
  const reporterOutcome = await runReporterStage({
    repoRoot,
    cwd: repoRoot,
    schedulePath,
    executionPath,
    reporterCandidates: [analysisCandidate],
    planPrompt: expandPromptRefs(readFileSync(planPath, "utf8")),
    resultPath,
    execDefaults,
    evidence: recorded.evidence,
    evidencePath: recorded.evidencePath,
    state,
    statePath: stateLocation.path,
  });
  const reason = reporterOutcome.blockReason;
  await updateResultStatus(
    resultPath,
    reporterOutcome.exitCode === 0 ? "complete" : "blocked",
    new Date().toISOString(),
    reason,
  );
  completeJobRun({
    projectId,
    runPath,
    status: reporterOutcome.exitCode === 0 ? (commandPartial ? "partial" : "succeeded") : "failed",
    evidenceRef,
    exitCode: commandOutcome.exitCode,
    ...(reason ? { reason } : {}),
  });
  if (reporterOutcome.exitCode === 0) {
    process.stdout.write(`Job Run ${commandPartial ? "partial" : "complete"}: ${record.run_id}\n`);
    if (commandPartial && record.trigger === "routine") {
      process.stdout.write(`[routine-job] complete run_id=${record.run_id} state=partial\n`);
    }
  } else {
    process.stdout.write(`Job Run failed: ${record.run_id}\n`);
    process.exitCode = 1;
  }
}

const ACCEPTED_JOB_REVIEW_VERDICTS = new Set(["complete", "complete-with-findings"]);

function acceptsJobReview(record: JobRunRecord, verdict: string | undefined): boolean {
  if (!verdict) return false;
  if (record.state === "partial") return verdict === "complete-with-findings";
  return record.state === "succeeded" && ACCEPTED_JOB_REVIEW_VERDICTS.has(verdict);
}

function jobChildArgs(opts: RunOpts, projectId: string, scheduledAt: string): string[] {
  const args = ["exec", "run", "--job", String(opts.job), "--project", projectId];
  const inputs = Array.isArray(opts.input) ? opts.input : opts.input ? [opts.input] : [];
  for (const input of inputs) args.push("--input", input);
  args.push("--scheduled-at", scheduledAt);
  if (opts.jobTrigger) args.push("--job-trigger", opts.jobTrigger);
  if (opts.by) args.push("--by", opts.by);
  if (opts.reporterBy) args.push("--reporter-by", opts.reporterBy);
  if (opts.execDefaults) args.push("--exec-defaults", opts.execDefaults);
  return args;
}

function commitJobPaths(
  worktreePath: string,
  paths: readonly string[],
  subject: string,
  body: string,
): string {
  const unique = [...new Set(paths)].sort();
  if (unique.length === 0) throw new Error("Job Run produced no tracked output to commit.");
  stageCommitTargets(worktreePath, unique);
  const stagedArgs = ["diff", "--cached", "--quiet", "--", ...unique];
  const staged = gitResult(worktreePath, stagedArgs);
  if (staged.status === 0) throw new Error("Job Run output has no staged changes.");
  if (staged.status !== 1) {
    throw new Error(
      `Failed to inspect staged Job Run output: ${formatGitResultFailure(stagedArgs, staged)}`,
    );
  }
  const commit = gitResult(worktreePath, ["commit", "-m", subject, "-m", body, "--", ...unique]);
  if (commit.status !== 0) {
    const output = [commit.stdout, commit.stderr]
      .filter((part): part is string => typeof part === "string" && part.length > 0)
      .join("\n");
    throw new Error(`git commit failed: ${summarizeGitHookFailure(output)}`);
  }
  stabilizeCommitTargets(worktreePath, () =>
    worktreeStatusPaths(worktreePath).filter((path) => unique.includes(path)),
  );
  return gitOutput(worktreePath, ["rev-parse", "HEAD"]).trim();
}

function jobReviewVerdict(resultPath: string): string | undefined {
  const match = readFileSync(resultPath, "utf8").match(
    /^- verdict:\s*(complete|complete-with-findings|incomplete|grade-stale|grade-unavailable|changed-during-review)\s*$/m,
  );
  return match?.[1];
}

async function fillIncompleteJobReviewResult(resultPath: string, reason: string): Promise<void> {
  const safeReason = reason.replace(/\s+/g, " ").trim();
  let content = readFileSync(resultPath, "utf8");
  content = content
    .replace(
      /_TODO_: 評価結果サイドカー[^\n]*/,
      `Job Run の review を完了できなかった: ${safeReason}`,
    )
    .replace(
      /_TODO_: 変更内容[^\n]*/,
      `- runner が review を完了できなかったため統合不可と判断した。`,
    )
    .replace(/_TODO_: 未充足事項[^\n]*/, `- ${stripLeadingListMarker(safeReason) || "理由なし"}`)
    .replace(/_TODO_: `approach`[^\n]*/, "Job Run の出力は変更していない。")
    .replace(/- verdict: _TODO_（[^\n]*）/, "- verdict: incomplete");
  writeFileSync(resultPath, content, "utf8");
  await formatMarkdownFile(resultPath);
}

async function overrideJobReviewDecision(
  resultPath: string,
  verdict: string,
  reason: string,
): Promise<void> {
  let content = readFileSync(resultPath, "utf8");
  content = content.replace(
    /^- verdict:\s*(?:complete|complete-with-findings|incomplete|grade-stale|grade-unavailable|changed-during-review)\s*$/m,
    `- verdict: ${verdict}`,
  );
  const instruction = `- runner 判定: ${reason.replace(/\s+/g, " ").trim()}`;
  if (!content.includes(instruction)) {
    content = content.replace(
      "\n## 4. approach に応じた確認",
      `\n${instruction}\n\n## 4. approach に応じた確認`,
    );
  }
  writeFileSync(resultPath, content, "utf8");
  await formatMarkdownFile(resultPath);
}

// Child process marker for the Job executed inside the review worktree. The child must run
// the Job in place; without it a Job that declares task.review would re-enter the worktree.
const JOB_REVIEW_WORKTREE_CHILD_ENV = "SPECDOJO_JOB_REVIEW_WORKTREE_CHILD";

function jobReviewAgentSourceLabel(
  nomination: JobReviewAgentNomination,
  cliFlag: "--review-by" | "--reporter-by",
): string {
  return nomination.source === "cli"
    ? cliFlag
    : `task.review.agent.${cliFlag === "--review-by" ? "executor" : "reporter"}`;
}

function resolveJobReviewAgents(
  task: ReadyTaskView,
  roster: MemberRoster | null,
  execDefaults: ExecDefaultsConfig,
  opts: RunOpts,
  definition: Pick<JobDefinition, "task">,
): {
  executor: AgentRunCandidate & { actor: string };
  reporterCandidates: AgentRunCandidate[];
} {
  // Resolution order: --review-by / --reporter-by, then the Job's task.review.agent, then
  // capability based auto selection.
  const nominations = resolveJobReviewAgentNominations(
    { reviewBy: opts.reviewBy, reporterBy: opts.reporterBy },
    definition,
  );
  const override = resolveAgentOverride(
    "review",
    nominations.executor?.nickname,
    {},
    roster,
    execDefaults,
    "executor",
  );
  if (override.kind === "error") {
    throw new Error(
      nominations.executor
        ? override.message.replace(
            /^--by/,
            jobReviewAgentSourceLabel(nominations.executor, "--review-by"),
          )
        : override.message,
    );
  }
  let executor: AgentRunCandidate & { actor: string };
  if (override.kind === "command") {
    executor = {
      command: override.command,
      actor: override.actor ?? String(nominations.executor?.nickname),
      provider: override.provider,
    };
  } else {
    const requirements = executorRequirements(task);
    const member = requirements
      ? selectCandidates(requirements, roster, "review", undefined, execDefaults)[0]
      : undefined;
    const command = member ? resolveMemberCommand(execDefaults, member) : undefined;
    if (!member || !command) throw new Error("No review executor is available for Job Run review.");
    executor = { command, actor: member.nickname, provider: member.provider };
  }
  let reporterCandidates: AgentRunCandidate[];
  try {
    reporterCandidates = resolveReporterAgentCandidates(
      task,
      roster,
      execDefaults,
      undefined,
      nominations.reporter?.nickname,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (nominations.reporter?.source !== "job") throw error;
    throw new Error(
      message.replace(
        /^--reporter-by/,
        jobReviewAgentSourceLabel(nominations.reporter, "--reporter-by"),
      ),
      { cause: error },
    );
  }
  if (reporterCandidates.length === 0) {
    throw new Error("No reporter is available for Job Run review.");
  }
  return { executor, reporterCandidates };
}

function jobReviewTaskView(runId: string, jobName: string): ReadyTaskView {
  return {
    id: `${runId}-review`,
    local_id: runId,
    name: `${jobName} の実行結果レビュー`,
    mode: "review",
    schedule_file: "",
    fifo_rank: 0,
    critical_first_rank: 0,
    agent_pipeline: {
      stages: [{ stage_role: "executor" }, { stage_role: "reporter" }],
    },
  };
}

function describeJobReviewAgent(
  actor: string | undefined,
  nomination: JobReviewAgentNomination | undefined,
  cliFlag: "--review-by" | "--reporter-by",
): string {
  const source = nomination ? jobReviewAgentSourceLabel(nomination, cliFlag) : "auto";
  return `${actor ?? "(unknown)"} (${source})`;
}

async function runJobWorktreeMode(opts: RunOpts): Promise<void> {
  const resolvedPaths = resolveProjectPaths({ project: opts.project });
  activateResolvedProjectPaths(resolvedPaths);
  const { schedulePath, executionPath } = resolvedPaths;
  const projectId = resolvedPaths.projectId ?? opts.project ?? process.env.SPECDOJO_PROJECT ?? "";
  if (!projectId) throw new Error("--job requires a project id.");
  const trigger =
    opts.jobTrigger === "ci"
      ? "ci"
      : process.env[ROUTINE_EXEC_ENV] === "1" || opts.jobTrigger === "routine"
        ? "routine"
        : "manual";
  const preview = await materializeJobRun({
    projectId,
    jobId: String(opts.job).trim(),
    inputs: opts.input,
    scheduledAt: opts.scheduledAt,
    trigger,
    dryRun: true,
  });
  if (preview.duplicateComplete) {
    process.stdout.write(
      `Job Run already complete: ${preview.record.run_id} (${preview.record.state})\n`,
    );
    if (trigger === "routine" && preview.record.state === "partial") {
      process.stdout.write(
        `[routine-job] complete run_id=${preview.record.run_id} state=partial\n`,
      );
    }
    return;
  }
  if (opts.dryRun) {
    process.stdout.write(`[dry-run] job worktree: ${projectId}-${preview.record.run_id}\n`);
    process.stdout.write(`[dry-run] job: ${preview.definition.id}\n`);
    process.stdout.write(`[dry-run] run: ${preview.record.run_id}\n`);
    process.stdout.write("[dry-run] lifecycle: execute -> commit -> review -> merge|waiting\n");
    process.stdout.write(
      `[dry-run] review declared by job: ${preview.definition.task.review ? "yes" : "no (--worktree)"}\n`,
    );
    const nominations = resolveJobReviewAgentNominations(
      { reviewBy: opts.reviewBy, reporterBy: opts.reporterBy },
      preview.definition,
    );
    try {
      const roster = loadRosterForExecutionPath(executionPath);
      const execDefaults = loadExecDefaultsConfig(
        resolveExecDefaultsPath(opts, schedulePath),
        executionPath,
      );
      const agents = resolveJobReviewAgents(
        jobReviewTaskView(preview.record.run_id, preview.definition.name),
        roster,
        execDefaults,
        opts,
        preview.definition,
      );
      process.stdout.write(
        `[dry-run] review executor: ${describeJobReviewAgent(agents.executor.actor, nominations.executor, "--review-by")}\n`,
      );
      process.stdout.write(
        `[dry-run] review reporter: ${describeJobReviewAgent(agents.reporterCandidates[0]?.actor, nominations.reporter, "--reporter-by")}\n`,
      );
    } catch (error) {
      process.stdout.write(
        `[dry-run] review agents: unresolved (${error instanceof Error ? error.message : String(error)})\n`,
      );
    }
    return;
  }

  const repoRoot = specdojoRootDir();
  const baseCommit = gitOutput(repoRoot, ["rev-parse", "HEAD"]).trim();
  const worktreeBase = resolveWorktreeBase(
    repoRoot,
    opts.worktreeBase,
    configuredWorktreeBase(schedulePath),
  );
  const worktreeTaskId = `${projectId}-${preview.record.run_id}`;
  const worktree = ensureExecWorktree({ repoRoot, worktreeBase, taskId: worktreeTaskId });
  // materializeJobRun resolves an omitted --scheduled-at to the manual launch time. Reuse that
  // exact slot in the child so the worktree writes the Job Run that the parent previewed.
  const childArgs = jobChildArgs(opts, projectId, preview.record.scheduled_at);
  const [executable, fullArgs] = selfRunArgs(childArgs);
  process.stdout.write(`Running Job Run ${preview.record.run_id} in ${worktree.path}.\n`);
  const child = spawnSync(executable, fullArgs, {
    cwd: worktree.path,
    env: {
      ...process.env,
      [ROUTINE_EXEC_ENV]: trigger === "routine" ? "1" : "0",
      [JOB_REVIEW_WORKTREE_CHILD_ENV]: "1",
    },
    stdio: "inherit",
  });
  if (child.status === ROUTINE_BUSY_SKIP_EXIT_CODE) {
    removeWorktree({
      context: { repoRoot, schedulePath, executionPath },
      worktree,
      taskId: `${preview.record.run_id}-review`,
      force: true,
      deleteBranch: true,
    });
    process.exitCode = ROUTINE_BUSY_SKIP_EXIT_CODE;
    return;
  }

  const executionRel = relative(repoRoot, executionPath);
  const worktreeExecutionPath = resolve(worktree.path, executionRel);
  const worktreeJobPaths = resolveJobPaths(projectId);
  const runPath = resolve(worktree.path, relative(repoRoot, preview.runPath));
  if (!existsSync(runPath)) {
    throw new Error(`Job Run record was not created in worktree: ${preview.record.run_id}`);
  }
  let record = loadJobRunRecord(runPath);
  const outputPaths = worktreeStatusPaths(worktree.path);
  const outputCommit = commitJobPaths(
    worktree.path,
    outputPaths,
    `chore(routine): ${preview.definition.name}`,
    `Job Run: ${record.run_id}\nState: ${record.state}`,
  );

  const reviewTaskId = `${record.run_id}-review`;
  const reviewTask = jobReviewTaskView(record.run_id, preview.definition.name);
  const { planPath, resultPath } = await generateJobReviewPlan(
    {
      ...worktreeJobPaths,
      jobsPath: resolve(worktree.path, relative(repoRoot, worktreeJobPaths.jobsPath)),
      executionPath: worktreeExecutionPath,
      runsPath: resolve(worktree.path, relative(repoRoot, worktreeJobPaths.runsPath)),
      statePath: resolve(worktree.path, relative(repoRoot, worktreeJobPaths.statePath)),
    },
    preview.definition,
    record,
    { branch: worktree.branch, baseCommit, outputCommit },
  );
  const rootExecDefaultsPath = resolve(repoRoot, resolveExecDefaultsPath(opts, schedulePath));
  const execDefaultsRelative = relative(repoRoot, rootExecDefaultsPath);
  const execDefaultsPath =
    execDefaultsRelative === ".." || execDefaultsRelative.startsWith(`..${sep}`)
      ? rootExecDefaultsPath
      : resolve(worktree.path, execDefaultsRelative);
  const execDefaults = loadExecDefaultsConfig(execDefaultsPath, worktreeExecutionPath);
  const originalCwd = process.cwd();
  let reviewReason: string | undefined;
  let verdict: string | undefined;
  try {
    process.chdir(worktree.path);
    const roster = loadRosterForExecutionPath(worktreeExecutionPath);
    const agents = resolveJobReviewAgents(
      reviewTask,
      roster,
      execDefaults,
      opts,
      preview.definition,
    );
    await scaffoldResult({
      executionPath: worktreeExecutionPath,
      taskId: reviewTaskId,
      mode: "review",
      projectId,
      origin: "job",
      jobId: record.job_id,
      runId: record.run_id,
      planRef: relative(worktree.path, planPath).split(sep).join("/"),
      agent: agents.executor.actor,
      startedAt: new Date().toISOString(),
      stem: reviewTaskId,
    });
    const reviewOutcome = await runAgentPipeline({
      repoRoot: worktree.path,
      cwd: worktree.path,
      schedulePath: resolve(worktree.path, relative(repoRoot, schedulePath)),
      executionPath: worktreeExecutionPath,
      taskId: reviewTaskId,
      executor: agents.executor,
      reporterCandidates: agents.reporterCandidates,
      planPath,
      planPrompt: expandPromptRefs(readFileSync(planPath, "utf8")),
      resultPath,
      execDefaults,
      mode: "review",
    });
    reviewReason = reviewOutcome.blockReason;
    await updateResultStatus(
      resultPath,
      reviewOutcome.exitCode === 0 ? "complete" : "blocked",
      new Date().toISOString(),
      reviewReason,
    );
    verdict = reviewOutcome.exitCode === 0 ? jobReviewVerdict(resultPath) : undefined;
    if (!verdict && reviewOutcome.exitCode === 0) reviewReason = "review result has no verdict";
  } catch (error) {
    reviewReason = error instanceof Error ? error.message : String(error);
    if (!existsSync(resultPath)) {
      await scaffoldResult({
        executionPath: worktreeExecutionPath,
        taskId: reviewTaskId,
        mode: "review",
        projectId,
        origin: "job",
        jobId: record.job_id,
        runId: record.run_id,
        planRef: relative(worktree.path, planPath).split(sep).join("/"),
        agent: "specdojo-runner",
        startedAt: new Date().toISOString(),
        stem: reviewTaskId,
      });
    }
    await fillIncompleteJobReviewResult(resultPath, reviewReason);
    await updateResultStatus(resultPath, "blocked", new Date().toISOString(), reviewReason);
    verdict = "incomplete";
  } finally {
    process.chdir(originalCwd);
  }

  const allowedReviewPrefixes = [
    `${relative(worktree.path, worktreeExecutionPath).split(sep).join("/")}/exec/evidence/${reviewTaskId}/`,
  ];
  const allowedReviewFiles = new Set([
    relative(worktree.path, planPath).split(sep).join("/"),
    relative(worktree.path, resultPath).split(sep).join("/"),
    relative(worktree.path, runPath).split(sep).join("/"),
  ]);
  const reviewChanges = worktreeStatusPaths(worktree.path);
  const unexpected = reviewChanges.filter(
    (path) =>
      !allowedReviewFiles.has(path) &&
      !allowedReviewPrefixes.some((prefix) => path.startsWith(prefix)),
  );
  if (unexpected.length > 0) {
    reviewReason = `review executor changed Job output: ${unexpected.join(", ")}`;
    verdict = "changed-during-review";
    await overrideJobReviewDecision(resultPath, verdict, reviewReason);
  }
  if (unexpected.length === 0 && record.state !== "succeeded" && record.state !== "partial") {
    reviewReason = record.attempts.at(-1)?.reason ?? `Job Run state is ${record.state}`;
    verdict = "incomplete";
    await overrideJobReviewDecision(resultPath, verdict, reviewReason);
  }
  if (!reviewReason && verdict && !ACCEPTED_JOB_REVIEW_VERDICTS.has(verdict)) {
    reviewReason = `review verdict is ${verdict}`;
  }
  record = recordJobRunReview(runPath, {
    plan_ref: relative(worktree.path, planPath).split(sep).join("/"),
    result_ref: relative(worktree.path, resultPath).split(sep).join("/"),
    branch: worktree.branch,
    ...(verdict ? { verdict: verdict as NonNullable<JobRunRecord["review"]>["verdict"] } : {}),
    ...(reviewReason ? { reason: reviewReason } : {}),
  });
  const committableReviewPaths = worktreeStatusPaths(worktree.path).filter(
    (path) =>
      allowedReviewFiles.has(path) ||
      allowedReviewPrefixes.some((prefix) => path.startsWith(prefix)),
  );
  commitJobPaths(
    worktree.path,
    committableReviewPaths,
    `chore(routine): review ${record.run_id}`,
    `Job Run: ${record.run_id}\nState: ${record.state}\nVerdict: ${verdict ?? "unavailable"}`,
  );

  const accepted = acceptsJobReview(record, verdict) && unexpected.length === 0;
  if (!accepted) {
    const reason =
      record.state !== "succeeded" && record.state !== "partial"
        ? `Job Run state is ${record.state}`
        : (reviewReason ??
          `review verdict ${verdict ?? "unavailable"} is not accepted for Job Run state ${record.state}`);
    process.stdout.write(
      `[routine-job] waiting run_id=${record.run_id} review=${verdict ?? "unavailable"} worktree=${worktree.path} reason=${reason}\n`,
    );
    process.exitCode = child.status || 1;
    return;
  }

  mergeWorktreeIntoCurrent({
    context: { repoRoot, schedulePath, executionPath },
    worktree,
    taskId: reviewTaskId,
    message: `chore(routine): merge ${record.run_id}`,
  });
  removeWorktree({
    context: { repoRoot, schedulePath, executionPath },
    worktree,
    taskId: reviewTaskId,
    deleteBranch: true,
  });
  process.stdout.write(
    `[routine-job] merged run_id=${record.run_id} state=${record.state} review=${verdict} branch=${worktree.branch}\n`,
  );
}

export async function runJobMode(
  opts: RunOpts,
  resolvePipelineAgents: JobPipelineAgentResolver,
): Promise<void> {
  const resolvedPaths = resolveProjectPaths({ project: opts.project });
  activateResolvedProjectPaths(resolvedPaths);
  const isWorktreeChild = process.env[JOB_REVIEW_WORKTREE_CHILD_ENV] === "1";
  if (!isWorktreeChild) {
    // A Job's task.review declaration takes precedence over the caller: it routes the Run
    // through the reviewed integration path even without --worktree (routine action.commit).
    const reviewProjectId =
      resolvedPaths.projectId ?? opts.project ?? process.env.SPECDOJO_PROJECT ?? "";
    const definition = loadJobDefinition(
      resolveJobPaths(reviewProjectId || undefined),
      String(opts.job).trim(),
    );
    if (jobRunUsesReviewedIntegration(definition, { worktree: opts.worktree, isWorktreeChild })) {
      await runJobWorktreeMode(opts);
      return;
    }
  }
  const { schedulePath, executionPath } = resolvedPaths;
  const projectId = resolvedPaths.projectId ?? opts.project ?? process.env.SPECDOJO_PROJECT ?? "";
  if (!projectId) throw new Error("--job requires a project id.");

  const trigger =
    opts.jobTrigger === "ci"
      ? "ci"
      : process.env[ROUTINE_EXEC_ENV] === "1" || opts.jobTrigger === "routine"
        ? "routine"
        : "manual";
  const materialized = await materializeJobRun({
    projectId,
    jobId: (opts.job as string).trim(),
    inputs: opts.input,
    scheduledAt: opts.scheduledAt,
    trigger,
    dryRun: !!opts.dryRun,
  });
  const { definition, record, runPath, planPath } = materialized;
  if (materialized.preconditionSkipped) {
    process.stdout.write(
      `Job skipped: ${definition.id} (${materialized.preconditionReason ?? "precondition"})\n`,
    );
    if (trigger === "routine") process.exitCode = ROUTINE_BUSY_SKIP_EXIT_CODE;
    return;
  }
  if (materialized.duplicateComplete) {
    process.stdout.write(`Job Run already complete: ${record.run_id} (${record.state})\n`);
    if (trigger === "routine" && record.state === "partial") {
      process.stdout.write(`[routine-job] complete run_id=${record.run_id} state=partial\n`);
    }
    return;
  }

  if (isJobCommandTask(record.task)) {
    await runCommandJobMode({
      opts,
      record,
      runPath,
      planPath,
      projectId,
      schedulePath,
      executionPath,
    });
    return;
  }

  const task: ReadyTaskView = {
    id: record.run_id,
    local_id: record.task.targets?.[0] ?? record.run_id,
    name: definition.name,
    owner: record.task.owner,
    mode: record.task.mode,
    agent: record.task.agent?.executor,
    capabilities: record.task.capabilities,
    proficiency: record.task.proficiency,
    schedule_file: "",
    fifo_rank: 0,
    critical_first_rank: 0,
  };
  const roster = loadRosterForExecutionPath(executionPath);
  const execDefaults = loadExecDefaultsConfig(
    resolveExecDefaultsPath(opts, schedulePath),
    executionPath,
  );
  // Job Definition が executor と reporter の双方を指名した場合は、register 項目と同じ
  // executor/reporter pipeline で実行する（result は reporter が書く）。reporter が無い
  // 場合は従来どおり単一 agent 実行で、その agent が result まで記入する。
  // --by は運用者による単発の差し替えとして単一 agent 実行を選ぶ。
  const executorBy = opts.executorBy?.trim() || record.task.agent?.executor;
  const reporterBy = opts.reporterBy?.trim() || record.task.agent?.reporter;
  const pipelineAgents =
    !opts.by?.trim() && executorBy && reporterBy
      ? resolvePipelineAgents(roster, { executorBy, reporterBy }, execDefaults)
      : undefined;
  const { command, actor } = pipelineAgents
    ? { command: pipelineAgents.executor.command, actor: pipelineAgents.executor.actor }
    : resolveInPlaceCommand(
        task,
        roster,
        { ...opts, executorBy: undefined, reporterBy: undefined },
        execDefaults,
      );

  if (opts.dryRun) {
    process.stdout.write(`[dry-run] job: ${definition.id}\n`);
    process.stdout.write(`[dry-run] run: ${record.run_id}\n`);
    process.stdout.write(`[dry-run] scheduled_at: ${record.scheduled_at}\n`);
    process.stdout.write(`[dry-run] agent: ${actor}${pipelineAgents ? " (executor)" : ""}\n`);
    process.stdout.write(`[dry-run] command: ${command}\n`);
    if (pipelineAgents) {
      const reporter = pipelineAgents.reporterCandidates[0];
      process.stdout.write(`[dry-run] agent: ${reporter?.actor ?? ""} (reporter)\n`);
      process.stdout.write(`[dry-run] reporter command: ${reporter?.command ?? ""}\n`);
    }
    process.stdout.write(`[dry-run] plan: ${planPath}\n`);
    return;
  }

  const { resultPath } = await scaffoldResult({
    executionPath,
    taskId: record.run_id,
    mode: record.task.mode,
    projectId,
    origin: "job",
    jobId: definition.id,
    runId: record.run_id,
    planRef: record.plan_ref,
    agent: actor,
    startedAt: new Date().toISOString(),
    ...(record.task.targets ? { targets: record.task.targets } : {}),
  });
  const resultScaffold = readResultFrontmatterSnapshot(resultPath);
  const prompt = expandPromptRefs(readFileSync(planPath, "utf8"));
  const repoRoot = specdojoRootDir();
  let exitCode: number;
  let reason: string | undefined;
  if (pipelineAgents) {
    process.stdout.write(
      `Running Job Run ${record.run_id} in place (executor/reporter pipeline): ${command}\n`,
    );
    const pipelineOutcome = await runAgentPipeline({
      repoRoot,
      cwd: repoRoot,
      schedulePath,
      executionPath,
      taskId: record.run_id,
      executor: pipelineAgents.executor,
      reporterCandidates: pipelineAgents.reporterCandidates,
      planPath,
      planPrompt: prompt,
      resultPath,
      execDefaults,
    });
    exitCode = pipelineOutcome.exitCode;
    reason = pipelineOutcome.blockReason;
  } else {
    process.stdout.write(`Running Job Run ${record.run_id} in place: ${command}\n`);
    exitCode = await spawnAgentInPlace(command, prompt, repoRoot, schedulePath, executionPath);
  }
  let effectiveExit = exitCode;
  if (exitCode === 0 && isResultUnfilled(resultPath, record.task.mode, resultScaffold)) {
    effectiveExit = 1;
    reason =
      "agent exited 0 but result is incomplete or its frontmatter differs from the scaffold (treated as blocked)";
  }
  const completedAt = new Date().toISOString();
  await updateResultStatus(
    resultPath,
    effectiveExit === 0 ? "complete" : "blocked",
    completedAt,
    reason,
  );
  completeJobRun({
    projectId,
    runPath,
    status: effectiveExit === 0 ? "succeeded" : "failed",
    ...(reason ? { reason } : {}),
  });
  if (effectiveExit === 0) {
    process.stdout.write(`Job Run complete: ${record.run_id}\n`);
  } else {
    process.stdout.write(`Job Run failed: ${record.run_id}\n`);
    process.exitCode = effectiveExit || 1;
  }
}
