import { randomUUID } from "node:crypto";
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import type { Command } from "commander";
import {
  defaultExecDefaultsPath,
  loadExecDefaultsConfig,
  resolveMemberCommand,
  resolveRateLimitDetection,
  type RateLimitDetection,
} from "./agent-config.js";
import {
  agentProtectedConfigViolation,
  isAgentProtectedConfigPath,
} from "./agent-protected-config.js";
import {
  recordExecutorEvidence,
  recordParentValidationFailureOutput,
  type EvidenceValidation,
} from "./evidence.js";
import { parentValidationLabels, type ParentValidationFailureOutput } from "./parent-validation.js";
import { activateResolvedProjectPaths, resolveProjectPaths } from "./project.js";
import {
  buildExecutorPrompt,
  isRateLimitError,
  loadRosterForExecutionPath,
  runConfiguredParentValidationBatch,
} from "./run/run.js";
import { parsePlanTaskIdentity } from "./plans.js";
import {
  deriveReporterFacts,
  evidenceForReporter,
  runReporterWithFormatRetry,
} from "./reporter.js";
import { ensureDir, safeSlug } from "./shared.js";
import {
  ensureExecWorktree,
  execBranchExists,
  findExecWorktree,
  formatGitResultFailure,
  gitOutput,
  gitResult,
  resolveWorktreeBase,
  type ExecWorktree,
} from "./worktree.js";
import { specdojoRootDir } from "../shared/specdojo-config.js";
import {
  TRIAL_PROMPT_SUFFIX,
  buildComparisonRecord,
  buildTrialBaseValidation,
  classifyReporterFailure,
  comparisonDir,
  comparisonPath,
  configuredWorktreeBase,
  hasValidExecutorEnvelope,
  parsePositiveInteger,
  parseRating,
  readComparison,
  repoRelative,
  resolveMember,
  spawnAgent,
  updateObjectiveMetrics,
  worktreeEnvironment,
  writeComparison,
  type AgentComparisonRecord,
  type AgentTrialRecord,
  type TrialAdoptOptions,
  type TrialAgentPair,
  type TrialRateOptions,
  type TrialRecordOptions,
  type TrialRunOptions,
} from "./trial-core.js";

async function runOneTrial(params: {
  record: AgentComparisonRecord;
  recordPath: string;
  trial: AgentTrialRecord;
  worktree: ExecWorktree;
  plan: string;
  prompt: string;
  executorCommand: string;
  reporterCommand?: string;
  reporterRateLimitDetection?: RateLimitDetection;
  parentValidationIds: string[];
  execDefaults: ReturnType<typeof loadExecDefaultsConfig>;
  repoRoot: string;
  schedulePath: string;
  executionPath: string;
}): Promise<void> {
  const { trial, worktree } = params;
  const startedAt = new Date();
  trial.status = "running";
  trial.started_at = startedAt.toISOString();
  writeComparison(params.recordPath, params.record);
  const outcome = await spawnAgent(
    params.executorCommand,
    params.prompt,
    worktree.path,
    worktreeEnvironment(params.repoRoot, worktree.path, params.schedulePath, params.executionPath),
  );
  const executorCompletedAt = new Date();
  trial.executor.duration_ms = executorCompletedAt.getTime() - startedAt.getTime();
  trial.parent_validation.configured_ids = [...params.parentValidationIds];
  let parentValidations: EvidenceValidation[] = [];
  let parentValidationFailureOutputs: ParentValidationFailureOutput[] = [];
  if (params.parentValidationIds.length === 0) {
    trial.parent_validation.status = "not_configured";
  } else if (outcome.exitCode !== 0) {
    trial.parent_validation.status = "not_run";
  } else {
    const parentValidationStartedAt = Date.now();
    const parentValidationBatch = await runConfiguredParentValidationBatch(
      params.execDefaults,
      worktree.path,
      {
        label: `${params.record.task_id} (${trial.trial_id})`,
      },
    );
    parentValidations = parentValidationBatch.validations;
    parentValidationFailureOutputs = parentValidationBatch.failureOutputs;
    trial.parent_validation.duration_ms = Date.now() - parentValidationStartedAt;
    trial.parent_validation.status = parentValidations.some(
      (validation) => validation.status !== "passed",
    )
      ? "failed"
      : "passed";
  }
  const runId = `${safeSlug(params.record.comparison_id)}-${trial.trial_id}`;
  const evidenceRecorded = recordExecutorEvidence({
    repoRoot: params.repoRoot,
    worktreePath: worktree.path,
    executionPath: params.executionPath,
    taskId: params.record.task_id,
    runId,
    actor: trial.agent,
    status: outcome.exitCode === 0 ? "succeeded" : "failed",
    startedAt: startedAt.toISOString(),
    completedAt: executorCompletedAt.toISOString(),
    exitCode: outcome.exitCode,
    attempts: 1,
    stdout: outcome.stdout,
    stderr: outcome.stderr,
    parentValidations,
  });
  evidenceRecorded.evidence = recordParentValidationFailureOutput({
    worktreePath: worktree.path,
    evidencePath: evidenceRecorded.evidencePath,
    evidence: evidenceRecorded.evidence,
    failureOutputs: parentValidationFailureOutputs,
  });
  const centralizedEvidenceDir = join(
    comparisonDir(params.executionPath, params.record.comparison_id),
    "trials",
    trial.trial_id,
  );
  ensureDir(centralizedEvidenceDir);
  const centralizedEvidencePath = join(centralizedEvidenceDir, "evidence.json");
  evidenceRecorded.evidence.log_refs = evidenceRecorded.evidence.log_refs.map((ref) => {
    const logName = basename(ref.path);
    const centralizedLogPath = join(centralizedEvidenceDir, logName);
    copyFileSync(join(dirname(evidenceRecorded.evidencePath), logName), centralizedLogPath);
    return { ...ref, path: repoRelative(params.repoRoot, centralizedLogPath) };
  });
  writeFileSync(
    centralizedEvidencePath,
    `${JSON.stringify(evidenceRecorded.evidence, null, 2)}\n`,
    "utf8",
  );
  trial.executor.exit_code = outcome.exitCode;
  trial.executor.attempts = 1;
  trial.executor.evidence_ref = repoRelative(params.repoRoot, centralizedEvidencePath);
  updateObjectiveMetrics(
    trial,
    evidenceRecorded.evidence,
    hasValidExecutorEnvelope(outcome.stdout),
  );

  let reporterSucceeded = true;
  if (outcome.exitCode === 0 && params.reporterCommand) {
    const reporterEvidence = evidenceForReporter(evidenceRecorded.evidence, {
      repoRoot: params.repoRoot,
      worktreePath: worktree.path,
      executionPath: params.executionPath,
    });
    const reporter = await runReporterWithFormatRetry({
      plan: params.plan,
      evidence: reporterEvidence,
      mode: parsePlanTaskIdentity(params.plan)?.mode ?? "edit",
      invoke: async (reporterPrompt) => {
        const reporterOutcome = await spawnAgent(
          params.reporterCommand as string,
          reporterPrompt,
          worktree.path,
          worktreeEnvironment(
            params.repoRoot,
            worktree.path,
            params.schedulePath,
            params.executionPath,
          ),
        );
        const result =
          reporterOutcome.exitCode === 0
            ? "success"
            : isRateLimitError(
                  reporterOutcome.exitCode,
                  `${reporterOutcome.stdout}\n${reporterOutcome.stderr}`,
                  params.reporterRateLimitDetection,
                )
              ? "rate_limit"
              : "failure";
        return {
          result,
          stdout: reporterOutcome.stdout,
          stderr: reporterOutcome.stderr,
        };
      },
    });
    trial.reporter.format_attempts = reporter.formatAttempts;
    trial.reporter.format_retries = Math.max(0, reporter.formatAttempts - 1);
    if (reporter.result === "success") {
      const facts = deriveReporterFacts(reporterEvidence, {
        mode: parsePlanTaskIdentity(params.plan)?.mode ?? "edit",
      });
      trial.reporter.structured_output = true;
      trial.reporter.outcome = facts.outcome;
      trial.reporter.output = reporter.output;
      reporterSucceeded = facts.outcome === "complete";
      if (reporterSucceeded) {
        trial.reporter.status = "succeeded";
      } else {
        trial.reporter.status = "blocked";
        trial.reporter.failure_category = "evidence_blocked";
        trial.reporter.failure_reason = facts.block_reason;
      }
    } else {
      trial.reporter.status = "failed";
      trial.reporter.failure_category = classifyReporterFailure(reporter.result, reporter.reason);
      trial.reporter.failure_reason = reporter.reason;
      reporterSucceeded = false;
    }
  }

  const completedAt = new Date();
  trial.completed_at = completedAt.toISOString();
  trial.duration_ms = completedAt.getTime() - startedAt.getTime();
  trial.status =
    outcome.exitCode === 0 &&
    trial.executor.validations_failed === 0 &&
    trial.parent_validation.status !== "failed" &&
    trial.parent_validation.status !== "not_run" &&
    reporterSucceeded
      ? "succeeded"
      : "failed";
  writeComparison(params.recordPath, params.record);
}

async function runPool(items: Array<() => Promise<void>>, parallel: number): Promise<void> {
  let next = 0;
  const workers = Array.from({ length: Math.min(parallel, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      await items[index]();
    }
  });
  await Promise.all(workers);
}

function parseTrialPair(value: string): TrialAgentPair {
  const separator = value.indexOf("=");
  const executor = value.slice(0, separator).trim();
  const reporter = value.slice(separator + 1).trim();
  if (separator < 1 || !executor || !reporter || reporter.includes("=")) {
    throw new Error(`--pair must use <executor>=<reporter>: ${value}`);
  }
  return { executor, reporter };
}

function resolveTrialDefinitions(opts: TrialRunOptions): {
  agents: string[];
  pairs?: TrialAgentPair[];
} {
  const agentValues = (opts.agent ?? []).map((value) => value.trim()).filter(Boolean);
  const pairValues = (opts.pair ?? []).map((value) => value.trim()).filter(Boolean);
  if (agentValues.length > 0 && pairValues.length > 0) {
    throw new Error("Use either --agent or --pair, not both.");
  }
  if (pairValues.length > 0) {
    if (opts.reporterBy) throw new Error("--pair cannot be combined with --reporter-by.");
    const pairs = pairValues.map(parseTrialPair);
    const keys = pairs.map((pair) => `${pair.executor}\0${pair.reporter}`);
    if (new Set(keys).size < 2 || new Set(keys).size !== keys.length) {
      throw new Error("exec trial run requires at least two distinct --pair values.");
    }
    return { agents: [...new Set(pairs.map((pair) => pair.executor))], pairs };
  }
  const agents = [...new Set(agentValues)];
  if (agents.length < 2) {
    throw new Error(
      "exec trial run requires at least two distinct --agent values or --pair values.",
    );
  }
  return { agents };
}

function resolveBaseCommit(repoRoot: string, revision: string): string {
  const args = ["rev-parse", "--verify", "--end-of-options", `${revision}^{commit}`];
  const result = gitResult(repoRoot, args);
  if (result.status !== 0) {
    throw new Error(
      `Trial base is not a commit: ${revision}; ${formatGitResultFailure(args, result)}`,
    );
  }
  return String(result.stdout).trim();
}

async function runTrials(opts: TrialRunOptions): Promise<void> {
  const paths = resolveProjectPaths({ project: opts.project });
  activateResolvedProjectPaths(paths);
  const repoRoot = specdojoRootDir();
  const projectId = paths.projectId ?? opts.project?.trim();
  if (!projectId) throw new Error("exec trial run requires a project id.");
  const planPath = resolve(opts.plan);
  if (!existsSync(planPath)) throw new Error(`Plan not found: ${planPath}`);
  const planContent = readFileSync(planPath, "utf8");
  const identity = parsePlanTaskIdentity(planContent);
  if (!identity)
    throw new Error("Trial plan must have SpecDojo task_id/mode/project_id frontmatter.");
  if (identity.projectId && identity.projectId !== projectId) {
    throw new Error(`Plan project_id ${identity.projectId} does not match --project ${projectId}.`);
  }
  const { agents, pairs } = resolveTrialDefinitions(opts);
  const parallel = parsePositiveInteger(opts.parallel ?? "1", "--parallel");
  const comparisonId = safeSlug(
    opts.comparison?.trim() ||
      `${identity.taskId}-${new Date().toISOString()}-${randomUUID().slice(0, 8)}`,
  );
  const recordPath = comparisonPath(paths.executionPath, comparisonId);
  if (existsSync(recordPath)) throw new Error(`Comparison already exists: ${comparisonId}`);
  const worktreeBase = resolveWorktreeBase(
    repoRoot,
    opts.worktreeBase,
    configuredWorktreeBase(paths.schedulePath),
  );
  const roster = loadRosterForExecutionPath(paths.executionPath);
  const defaults = loadExecDefaultsConfig(
    opts.execDefaults ?? defaultExecDefaultsPath(),
    paths.executionPath,
  );
  const executorCommands = new Map<string, string>();
  for (const agent of agents) {
    const command = resolveMemberCommand(defaults, resolveMember(roster, agent, "executor"));
    if (!command) throw new Error(`Agent command could not be resolved: ${agent}`);
    executorCommands.set(agent, command);
  }
  const reporterCommands = new Map<string, string>();
  const reporterRateLimitDetections = new Map<string, RateLimitDetection | undefined>();
  if (opts.reporterBy) {
    const reporterMember = resolveMember(roster, opts.reporterBy, "reporter");
    const reporterCommand = resolveMemberCommand(defaults, reporterMember);
    if (!reporterCommand)
      throw new Error(`Reporter command could not be resolved: ${opts.reporterBy}`);
    reporterCommands.set(opts.reporterBy, reporterCommand);
    reporterRateLimitDetections.set(
      opts.reporterBy,
      resolveRateLimitDetection(defaults, reporterMember.provider),
    );
  }
  for (const reporter of new Set(pairs?.map((pair) => pair.reporter) ?? [])) {
    const reporterMember = resolveMember(roster, reporter, "reporter");
    const reporterCommand = resolveMemberCommand(defaults, reporterMember);
    if (!reporterCommand) throw new Error(`Reporter command could not be resolved: ${reporter}`);
    reporterCommands.set(reporter, reporterCommand);
    reporterRateLimitDetections.set(
      reporter,
      resolveRateLimitDetection(defaults, reporterMember.provider),
    );
  }
  const parentValidationEntries = defaults.pipeline?.parent_validations ?? [];
  // Labels are `<id>` for the project repository and `<repo>:<id>` for a product repository.
  const parentValidationIds = parentValidationLabels(parentValidationEntries);
  const prompt = `${buildExecutorPrompt(planContent, parentValidationEntries).trimEnd()}${TRIAL_PROMPT_SUFFIX}`;
  const requestedRevision = opts.base?.trim() || "HEAD";
  const headCommit = resolveBaseCommit(repoRoot, "HEAD");
  const baseCommit = resolveBaseCommit(repoRoot, requestedRevision);
  const planRepoPath = repoRelative(repoRoot, planPath);
  const baseValidation = buildTrialBaseValidation({
    repoRoot,
    requestedRevision,
    resolvedCommit: baseCommit,
    headCommit,
    defaultedToHead: !opts.base?.trim(),
    planPath: planRepoPath,
    planContent,
  });
  const record = buildComparisonRecord({
    comparisonId,
    projectId,
    taskId: identity.taskId,
    createdAt: new Date().toISOString(),
    baseCommit,
    baseValidation,
    planPath: planRepoPath,
    planContent,
    prompt,
    agents,
    pairs,
    reporter: opts.reporterBy,
    worktreeBase,
    parentValidationIds,
  });
  if (opts.dryRun) {
    process.stdout.write(`${JSON.stringify(record, null, 2)}\n`);
    return;
  }
  writeComparison(recordPath, record);

  const prepared = new Map<string, ExecWorktree>();
  for (const trial of record.trials) {
    const worktreeTaskId = `${projectId}:trial:${comparisonId}:${trial.trial_id}`;
    if (findExecWorktree(repoRoot, worktreeTaskId) || execBranchExists(repoRoot, worktreeTaskId)) {
      throw new Error(`Trial worktree or branch already exists: ${trial.branch}`);
    }
    const worktree = ensureExecWorktree({
      repoRoot,
      worktreeBase,
      taskId: worktreeTaskId,
      startPoint: record.base_commit,
    });
    prepared.set(trial.trial_id, worktree);
    trial.status = "prepared";
    writeComparison(recordPath, record);
  }

  await runPool(
    record.trials.map((trial) => async () => {
      const worktree = prepared.get(trial.trial_id);
      if (!worktree) throw new Error(`Prepared worktree missing: ${trial.trial_id}`);
      await runOneTrial({
        record,
        recordPath,
        trial,
        worktree,
        plan: planContent,
        prompt,
        executorCommand: executorCommands.get(trial.agent) as string,
        reporterCommand: trial.reporter_agent
          ? reporterCommands.get(trial.reporter_agent)
          : undefined,
        reporterRateLimitDetection: trial.reporter_agent
          ? reporterRateLimitDetections.get(trial.reporter_agent)
          : undefined,
        parentValidationIds,
        execDefaults: defaults,
        repoRoot,
        schedulePath: paths.schedulePath,
        executionPath: paths.executionPath,
      });
    }),
    parallel,
  );
  process.stdout.write(`Comparison recorded: ${repoRelative(repoRoot, recordPath)}\n`);
}

function resolveRecord(opts: TrialRecordOptions): {
  record: AgentComparisonRecord;
  path: string;
  repoRoot: string;
} {
  const paths = resolveProjectPaths({ project: opts.project });
  activateResolvedProjectPaths(paths);
  const path = comparisonPath(paths.executionPath, opts.comparison);
  return { record: readComparison(path), path, repoRoot: specdojoRootDir() };
}

function findTrial(record: AgentComparisonRecord, selector: string): AgentTrialRecord {
  const matches = record.trials.filter(
    (trial) => trial.trial_id === selector || trial.agent === selector,
  );
  if (matches.length !== 1) throw new Error(`Trial not found or ambiguous: ${selector}`);
  return matches[0];
}

function statusTrials(opts: TrialRecordOptions): void {
  const { record } = resolveRecord(opts);
  process.stdout.write(
    `Comparison ${record.comparison_id} [${record.status}] task=${record.task_id}\n`,
  );
  process.stdout.write(
    `plan sha256=${record.plan.sha256} prompt sha256=${record.plan.prompt_sha256}\n`,
  );
  process.stdout.write(
    `base=${record.base_commit} requested=${record.base?.requested_revision ?? "(legacy)"} head_reference=${record.base?.head_commit_at_start ?? "unknown"} compatible=${record.base?.compatible ?? "unknown"} reporter_mode=${record.reporter_mode ?? "shared-or-none"}\n`,
  );
  for (const warning of record.base?.warnings ?? []) {
    process.stdout.write(`base warning: ${warning}\n`);
  }
  for (const trial of record.trials) {
    const reporterStatus =
      trial.reporter.status ?? (trial.reporter.structured_output ? "succeeded" : "not_run");
    const parentValidation = trial.parent_validation ?? {
      status: "not_configured",
      duration_ms: null,
      validations_passed: 0,
      validations_failed: 0,
      validations_not_run: 0,
    };
    process.stdout.write(
      `${trial.trial_id}\t${trial.status}\ttime(executor/parent/total)=${trial.executor.duration_ms ?? "-"}/${parentValidation.duration_ms ?? "-"}/${trial.duration_ms ?? "-"}ms\tfiles=${trial.executor.files_changed}\texecutor-validations(reported/passed/failed/not_run/requires_human)=${trial.executor.validations_reported ?? trial.executor.validations.length}/${trial.executor.validations_passed}/${trial.executor.validations_failed}/${trial.executor.validations_not_run}/${trial.executor.validations_requires_human ?? 0}\tparent-validations(status/passed/failed/not_run)=${parentValidation.status}/${parentValidation.validations_passed}/${parentValidation.validations_failed}/${parentValidation.validations_not_run}\treporter=${reporterStatus}/${trial.reporter.format_attempts}/${trial.reporter.failure_category ?? "-"}\n`,
    );
  }
}

function rateTrial(opts: TrialRateOptions): void {
  const { record, path } = resolveRecord(opts);
  const trial = findTrial(record, opts.trial);
  const judgment = parseRating(opts.judgmentQuality, "--judgment-quality");
  const writing = parseRating(opts.writingQuality, "--writing-quality");
  const scope = parseRating(opts.scopeAdherence, "--scope-adherence");
  if (judgment !== undefined) trial.subjective.judgment_quality = judgment;
  if (writing !== undefined) trial.subjective.writing_quality = writing;
  if (scope !== undefined) trial.subjective.scope_adherence = scope;
  if (opts.notes !== undefined) trial.subjective.notes = opts.notes.trim();
  writeComparison(path, record);
  process.stdout.write(`Rated trial: ${trial.trial_id}\n`);
}

function changedPaths(worktreePath: string): string[] {
  const output = gitOutput(worktreePath, [
    "status",
    "--porcelain=v1",
    "-z",
    "--untracked-files=all",
  ]);
  const paths: string[] = [];
  for (const record of output.split("\0").filter(Boolean)) {
    if (record.length >= 4) paths.push(record.slice(3));
  }
  return paths;
}

function removeTrialWorktree(
  repoRoot: string,
  trial: AgentTrialRecord,
  deleteUnmerged: boolean,
): void {
  const registered = findExecWorktree(repoRoot, trial.branch.slice("exec/".length));
  const worktreePath = registered?.path ?? trial.worktree;
  if (existsSync(worktreePath)) {
    gitOutput(repoRoot, ["worktree", "remove", "--force", worktreePath]);
  }
  if (
    gitResult(repoRoot, ["show-ref", "--verify", "--quiet", `refs/heads/${trial.branch}`])
      .status === 0
  ) {
    gitOutput(repoRoot, ["branch", deleteUnmerged ? "-D" : "-d", trial.branch]);
  }
}

function commitSelectedTrial(
  repoRoot: string,
  record: AgentComparisonRecord,
  trial: AgentTrialRecord,
): void {
  const protectedPaths = changedPaths(trial.worktree).filter(isAgentProtectedConfigPath);
  if (protectedPaths.length > 0) throw new Error(agentProtectedConfigViolation(protectedPaths));
  gitOutput(trial.worktree, ["add", "-A"]);
  const stagedArgs = ["diff", "--cached", "--quiet"];
  const staged = gitResult(trial.worktree, stagedArgs);
  if (staged.status === 1) {
    const commit = gitResult(trial.worktree, [
      "commit",
      "-m",
      `feat(trial): adopt ${record.task_id} from ${trial.agent}`,
    ]);
    if (commit.status !== 0) {
      gitResult(trial.worktree, ["reset", "--quiet"]);
      throw new Error(`Trial commit failed: ${commit.stderr || commit.stdout}`);
    }
  } else if (staged.status !== 0) {
    throw new Error(
      `Failed to inspect selected trial changes: ${formatGitResultFailure(stagedArgs, staged)}`,
    );
  }
  const ahead = Number(
    gitOutput(trial.worktree, ["rev-list", "--count", `${record.base_commit}..HEAD`]).trim(),
  );
  if (!Number.isFinite(ahead) || ahead < 1)
    throw new Error("Selected trial has no changes to adopt.");
}

function adoptTrial(opts: TrialAdoptOptions): void {
  const { record, path, repoRoot } = resolveRecord(opts);
  if (record.status !== "active") throw new Error(`Comparison is already ${record.status}.`);
  const selected = findTrial(record, opts.trial);
  if (selected.status !== "succeeded")
    throw new Error(`Only a succeeded trial can be adopted: ${selected.trial_id}`);
  if (opts.dryRun) {
    process.stdout.write(
      `[dry-run] adopt ${selected.branch}; discard ${record.trials.length - 1} other trial(s)\n`,
    );
    return;
  }
  commitSelectedTrial(repoRoot, record, selected);
  try {
    gitOutput(repoRoot, ["merge", "--no-ff", "--no-edit", selected.branch]);
  } catch (error) {
    gitResult(repoRoot, ["merge", "--abort"]);
    throw error;
  }
  removeTrialWorktree(repoRoot, selected, false);
  selected.status = "adopted";
  for (const trial of record.trials) {
    if (trial === selected) continue;
    removeTrialWorktree(repoRoot, trial, true);
    trial.status = "discarded";
  }
  record.status = "adopted";
  record.selected_trial_id = selected.trial_id;
  record.completed_at = new Date().toISOString();
  writeComparison(path, record);
  process.stdout.write(
    `Adopted trial ${selected.trial_id}; discarded remaining trial worktrees.\n`,
  );
}

function discardTrials(opts: TrialRecordOptions): void {
  const { record, path, repoRoot } = resolveRecord(opts);
  if (record.status !== "active") throw new Error(`Comparison is already ${record.status}.`);
  for (const trial of record.trials) {
    removeTrialWorktree(repoRoot, trial, true);
    trial.status = "discarded";
  }
  record.status = "discarded";
  record.completed_at = new Date().toISOString();
  writeComparison(path, record);
  process.stdout.write(`Discarded all trial worktrees; comparison record retained.\n`);
}

function commandError(error: unknown): void {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}

export function registerExecTrialCommands(exec: Command): void {
  const trial = exec.command("trial").description("Compare multiple agents on one immutable plan");
  trial
    .command("run")
    .requiredOption("--project <projectId>", "Project id")
    .requiredOption("--plan <path>", "Existing SpecDojo plan used unchanged by every trial")
    .option("--agent <nicknames...>", "Two or more executor agent nicknames")
    .option(
      "--pair <executor=reporter...>",
      "Two or more executor/reporter pairs (alternative to --agent)",
    )
    .option("--reporter-by <nickname>", "Shared reporter agent used to assess structured output")
    .option("--base <revision>", "Commit used as the trial worktree start point (default: HEAD)")
    .option("--comparison <id>", "Stable comparison id (generated when omitted)")
    .option("--parallel <n>", "Maximum concurrent trials", "1")
    .option("--worktree-base <path>", "Override worktree base directory")
    .option("--exec-defaults <path>", "Path to exec-defaults.yaml")
    .option("--dry-run", "Print the planned comparison without creating worktrees", false)
    .action(async (opts: TrialRunOptions) => {
      try {
        await runTrials(opts);
      } catch (error) {
        commandError(error);
      }
    });
  trial
    .command("status")
    .requiredOption("--project <projectId>", "Project id")
    .requiredOption("--comparison <id>", "Comparison id")
    .action((opts: TrialRecordOptions) => {
      try {
        statusTrials(opts);
      } catch (error) {
        commandError(error);
      }
    });
  trial
    .command("rate")
    .requiredOption("--project <projectId>", "Project id")
    .requiredOption("--comparison <id>", "Comparison id")
    .requiredOption("--trial <idOrAgent>", "Trial id or agent nickname")
    .option("--judgment-quality <1-5>", "Human judgment-quality rating")
    .option("--writing-quality <1-5>", "Human writing-quality rating")
    .option("--scope-adherence <1-5>", "Human scope-adherence rating")
    .option("--notes <text>", "Human evaluation notes")
    .action((opts: TrialRateOptions) => {
      try {
        rateTrial(opts);
      } catch (error) {
        commandError(error);
      }
    });
  trial
    .command("adopt")
    .requiredOption("--project <projectId>", "Project id")
    .requiredOption("--comparison <id>", "Comparison id")
    .requiredOption("--trial <idOrAgent>", "Succeeded trial to merge")
    .option("--dry-run", "Print adopt/discard actions", false)
    .action((opts: TrialAdoptOptions) => {
      try {
        adoptTrial(opts);
      } catch (error) {
        commandError(error);
      }
    });
  trial
    .command("discard")
    .requiredOption("--project <projectId>", "Project id")
    .requiredOption("--comparison <id>", "Comparison id")
    .action((opts: TrialRecordOptions) => {
      try {
        discardTrials(opts);
      } catch (error) {
        commandError(error);
      }
    });
}
