import { createHash } from "node:crypto";
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import type { Command } from "commander";
import { buildSpecdojoFrontmatter } from "./frontmatter-namespace.js";
import { formatMarkdownFile } from "./exec-format.js";
import { execTemplatePath, injectCommonConventions, MISSING } from "./exec-plans.js";
import { expandTemplate, listFilesRecursive, writeJson } from "./exec-shared.js";
import { gitEnvironment } from "./exec-worktree.js";
import {
  isJobAgentTask,
  isJobCommandTask,
  getPath,
  loadAllJobs,
  loadJobDefinition,
  loadJobRunRecord,
  parseInputValue,
  parseJobInputs,
  renderJobTemplate,
  resolveJobPaths,
  validateJobInputValue,
  type JobCommandResult,
  type JobDefinition,
  type JobPaths,
  type JobPreconditionDefinition,
  type JobRunAttempt,
  type JobRunRecord,
  type JobRunReview,
  type JobStateFile,
  type JobTaskDefinition,
  type MaterializedJobRun,
} from "./job-definition.js";
import { specdojoRootDir } from "./specdojo-config.js";
import { selfRunCommand } from "./spawn-self.js";

export {
  isJobAgentTask,
  isJobCommandTask,
  jobDeclaresReview,
  jobRunUsesReviewedIntegration,
  loadAllJobs,
  loadJobDefinition,
  loadJobRunRecord,
  parseJobDefinition,
  parseJobInputs,
  renderJobTemplate,
  resolveJobPaths,
  resolveJobReviewAgentNominations,
} from "./job-definition.js";
export type {
  JobAgentDefinition,
  JobAgentTaskDefinition,
  JobCommandAnalysisDefinition,
  JobCommandResult,
  JobCommandTaskDefinition,
  JobDefinition,
  JobInputDefinition,
  JobInputType,
  JobPaths,
  JobPreconditionDefinition,
  JobReviewAgentNomination,
  JobReviewAgentSource,
  JobReviewDefinition,
  JobRunAttempt,
  JobRunRecord,
  JobRunReview,
  JobRunState,
  JobTaskDefinition,
  MaterializedJobRun,
} from "./job-definition.js";

export function jobCheckpoint(paths: JobPaths, jobId: string): Record<string, unknown> {
  return deriveJobState(paths).jobs[jobId]?.checkpoint ?? {};
}

export function deriveJobState(paths: JobPaths): JobStateFile {
  const state: JobStateFile = { version: 1, jobs: {} };
  if (!existsSync(paths.runsPath)) return state;
  for (const filePath of listFilesRecursive(paths.runsPath)
    .filter((path) => path.endsWith(".json"))
    .sort()) {
    try {
      const run = loadJobRunRecord(filePath);
      if (!run.checkpoint_after || (run.state !== "succeeded" && run.state !== "noop")) continue;
      const current = state.jobs[run.job_id];
      if (!current || current.updated_at < run.updated_at) {
        state.jobs[run.job_id] = {
          checkpoint: run.checkpoint_after,
          last_run_id: run.run_id,
          updated_at: run.updated_at,
        };
      }
    } catch {
      // Invalid Run files are reported by schema validation; a broken file must not erase
      // checkpoints that can still be derived from other valid history entries.
    }
  }
  return state;
}

function resolveInputs(
  definition: JobDefinition,
  raw: Record<string, string>,
  checkpoint: Record<string, unknown>,
): Record<string, unknown> {
  const definitions = definition.inputs ?? {};
  for (const key of Object.keys(raw)) {
    if (!definitions[key]) throw new Error(`Unknown input for ${definition.id}: ${key}`);
  }
  const values: Record<string, unknown> = {};
  for (const [key, input] of Object.entries(definitions)) {
    let value: unknown = raw[key];
    if (value === undefined && input.from_checkpoint)
      value = getPath(checkpoint, input.from_checkpoint);
    if (value === undefined && input.resolve === "git_head") {
      const result = spawnSync("git", ["rev-parse", "HEAD"], {
        cwd: specdojoRootDir(),
        encoding: "utf8",
        env: gitEnvironment(),
      });
      if (result.status !== 0) throw new Error(`Unable to resolve git HEAD for input ${key}`);
      value = result.stdout.trim();
    }
    if (value === undefined && input.default !== undefined) value = input.default;
    if (value === undefined) {
      if (input.required) throw new Error(`Missing required input for ${definition.id}: ${key}`);
      continue;
    }
    const parsed = parseInputValue(value, input.type, key);
    validateJobInputValue(parsed, input, key);
    if (input.git_revision) {
      if (input.type !== "string")
        throw new Error(`Input ${key} with git_revision must be a string`);
      const result = spawnSync("git", ["rev-parse", String(parsed)], {
        cwd: specdojoRootDir(),
        encoding: "utf8",
        env: gitEnvironment(),
      });
      if (result.status !== 0)
        throw new Error(`Unable to resolve git revision for input ${key}: ${parsed}`);
      values[key] = result.stdout.trim();
    } else {
      values[key] = parsed;
    }
  }
  return values;
}

function qualifyTargets(projectId: string, targets: string[]): string[] {
  return targets.map((target) => (target.includes(":") ? target : `${projectId}:${target}`));
}

function runIdFor(definition: JobDefinition, idempotencyKey: string): string {
  const slug = definition.id.slice(4);
  const digest = createHash("sha256").update(idempotencyKey).digest("hex").slice(0, 12);
  return `JBR-${slug}-${digest}`;
}

function repoRelative(absPath: string): string {
  return relative(specdojoRootDir(), absPath).replaceAll("\\", "/");
}

const MAX_COMMAND_OUTPUT_BYTES = 64 * 1024;

function appendCommandOutput(
  chunks: Buffer[],
  chunk: Buffer,
  capturedBytes: number,
): { capturedBytes: number; truncated: boolean } {
  if (capturedBytes >= MAX_COMMAND_OUTPUT_BYTES) {
    return { capturedBytes, truncated: chunk.length > 0 };
  }
  const remaining = MAX_COMMAND_OUTPUT_BYTES - capturedBytes;
  chunks.push(chunk.subarray(0, remaining));
  return {
    capturedBytes: capturedBytes + Math.min(chunk.length, remaining),
    truncated: chunk.length > remaining,
  };
}

function commandOutputText(chunks: Buffer[], truncated: boolean): string {
  const text = Buffer.concat(chunks).toString("utf8");
  return truncated ? text.replace(/\uFFFD$/u, "") : text;
}

/** Executes a materialized Job command directly in the runner process, never through an agent. */
export async function executeJobCommand(command: string, cwd: string): Promise<JobCommandResult> {
  const startedAt = new Date().toISOString();
  return await new Promise((resolveResult) => {
    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];
    let stdoutBytes = 0;
    let stderrBytes = 0;
    let stdoutTruncated = false;
    let stderrTruncated = false;
    let settled = false;
    const executable = process.platform === "win32" ? process.env.ComSpec || "cmd.exe" : "/bin/sh";
    const args =
      process.platform === "win32" ? ["/d", "/s", "/c", command] : ["-eu", "-c", command];
    const child = spawn(executable, args, {
      cwd,
      env: gitEnvironment(),
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });
    child.stdout.on("data", (chunk: Buffer) => {
      process.stdout.write(chunk);
      const appended = appendCommandOutput(stdoutChunks, chunk, stdoutBytes);
      stdoutBytes = appended.capturedBytes;
      stdoutTruncated ||= appended.truncated;
    });
    child.stderr.on("data", (chunk: Buffer) => {
      process.stderr.write(chunk);
      const appended = appendCommandOutput(stderrChunks, chunk, stderrBytes);
      stderrBytes = appended.capturedBytes;
      stderrTruncated ||= appended.truncated;
    });
    const finish = (exitCode: number | null, error?: string): void => {
      if (settled) return;
      settled = true;
      resolveResult({
        command,
        startedAt,
        completedAt: new Date().toISOString(),
        exitCode,
        stdout: commandOutputText(stdoutChunks, stdoutTruncated),
        stderr: commandOutputText(stderrChunks, stderrTruncated),
        stdoutTruncated,
        stderrTruncated,
        ...(error ? { error } : {}),
      });
    };
    child.once("error", (error) => finish(null, error.message));
    child.once("close", (code) => finish(code));
  });
}

export async function executeJobPrecondition(
  precondition: JobPreconditionDefinition,
  cwd: string,
): Promise<{ result: JobCommandResult; skipped: boolean; reason?: string }> {
  const result = await executeJobCommand(precondition.command, cwd);
  if (result.error) {
    throw new Error(`Job precondition spawn failed: ${result.error}`);
  }

  if (typeof precondition.skip_when === "number") {
    if (result.exitCode === precondition.skip_when) {
      return {
        result,
        skipped: true,
        reason: `precondition exited with code ${precondition.skip_when}`,
      };
    }
    if (result.exitCode !== 0) {
      throw new Error(`Job precondition exited with code ${result.exitCode ?? "unknown"}`);
    }
    return { result, skipped: false };
  }

  if (result.exitCode !== 0) {
    throw new Error(`Job precondition exited with code ${result.exitCode ?? "unknown"}`);
  }
  if (!result.stdout.trim()) {
    return { result, skipped: true, reason: "empty selection" };
  }
  return { result, skipped: false };
}

function jobPlanFrontmatter(
  projectId: string,
  definition: JobDefinition,
  record: JobRunRecord,
): string {
  const localId = `xep-${record.run_id.toLowerCase()}`;
  const inner = [
    `id: ${projectId}:${localId}`,
    "type: exec-plan",
    "rulebook: none",
    `task_id: ${record.run_id}`,
    `name: ${JSON.stringify(definition.name)}`,
    // A command Run's plan is consumed only by the optional analysis reporter. Exec result
    // frontmatter intentionally keeps the existing edit/review vocabulary for compatibility.
    `mode: ${isJobCommandTask(record.task) ? "edit" : record.task.mode}`,
    "status: ready",
    `project_id: ${projectId}`,
    "origin: job",
    `job_id: ${definition.id}`,
    `run_id: ${record.run_id}`,
  ];
  if (record.task.owner) inner.push(`owner: ${record.task.owner}`);
  if (record.task.targets) {
    inner.push("targets:");
    for (const target of record.task.targets) inner.push(`  - ${target}`);
  }
  if (record.task.paths) {
    inner.push("paths:");
    for (const path of record.task.paths) inner.push(`  - ${path}`);
  }
  return buildSpecdojoFrontmatter(inner);
}

export async function generateJobPlan(
  paths: JobPaths,
  definition: JobDefinition,
  record: JobRunRecord,
): Promise<string> {
  const templatePath = execTemplatePath("xep-job-template.md");
  if (!existsSync(templatePath)) throw new Error(`Template not found: ${templatePath}`);
  const planPath = join(paths.executionPath, "exec", "plans", `${record.run_id}-plan.md`);
  mkdirSync(resolve(planPath, ".."), { recursive: true });
  const commandTask = isJobCommandTask(record.task) ? record.task : undefined;
  const values: Record<string, string> = {
    _FRONTMATTER_: jobPlanFrontmatter(paths.projectId, definition, record),
    _JOB_ID_: definition.id,
    _JOB_NAME_: definition.name,
    _RUN_ID_: record.run_id,
    _SCHEDULED_AT_: record.scheduled_at,
    _JOB_DESCRIPTION_:
      commandTask?.analysis?.description ??
      (commandTask
        ? "コマンドの終了結果を evidence として記録する。agent による判断は行わない。"
        : isJobAgentTask(record.task)
          ? record.task.description
          : ""),
    _JOB_EXECUTION_: commandTask
      ? [
          "### 3.1. 決定論的コマンド",
          "",
          "runner が次の解決済みコマンドを agent の sandbox 外で直接実行する。",
          "",
          "```sh",
          commandTask.command,
          "```",
          "",
          commandTask.analysis
            ? "コマンドが成功した場合だけ、上記の判断を reporter agent が evidence に基づいて行う。"
            : "コマンドの終了コードから Run の成否を直接決定する。",
        ].join("\n")
      : "",
    _JOB_INPUTS_: JSON.stringify(record.inputs, null, 2),
    _JOB_TARGETS_: record.task.targets?.map((target) => `- [[${target}]]`).join("\n") ?? "- -",
    _JOB_PATHS_: record.task.paths?.map((path) => `- \`${path}\``).join("\n") ?? "- -",
    _RESULT_REF_: repoRelative(
      join(paths.executionPath, "exec", "results", `${record.run_id}-result.md`),
    ),
  };
  const body = expandTemplate(readFileSync(templatePath, "utf8"), values);
  const content = injectCommonConventions(body, MISSING, new Map<string, string>());
  writeFileSync(planPath, content, "utf8");
  await formatMarkdownFile(planPath);
  return planPath;
}

function jobReviewPlanFrontmatter(
  projectId: string,
  definition: JobDefinition,
  record: JobRunRecord,
): string {
  return buildSpecdojoFrontmatter([
    `id: ${projectId}:xrp-${record.run_id.toLowerCase()}-review`,
    "type: exec-plan",
    "rulebook: none",
    `task_id: ${record.run_id}-review`,
    `name: ${JSON.stringify(`${definition.name} の実行結果レビュー`)}`,
    "mode: review",
    "status: ready",
    `project_id: ${projectId}`,
    "origin: job",
    `job_id: ${definition.id}`,
    `run_id: ${record.run_id}`,
  ]);
}

export async function generateJobReviewPlan(
  paths: JobPaths,
  definition: JobDefinition,
  record: JobRunRecord,
  opts: { branch: string; baseCommit: string; outputCommit: string },
): Promise<{ planPath: string; resultPath: string }> {
  const templatePath = execTemplatePath("xrp-job-template.md");
  if (!existsSync(templatePath)) throw new Error(`Template not found: ${templatePath}`);
  const planPath = join(paths.executionPath, "exec", "plans", `${record.run_id}-review-plan.md`);
  const resultPath = join(
    paths.executionPath,
    "exec",
    "results",
    `${record.run_id}-review-result.md`,
  );
  mkdirSync(resolve(planPath, ".."), { recursive: true });
  const values: Record<string, string> = {
    _FRONTMATTER_: jobReviewPlanFrontmatter(paths.projectId, definition, record),
    _JOB_ID_: definition.id,
    _JOB_NAME_: definition.name,
    _RUN_ID_: record.run_id,
    _RUN_STATE_: record.state,
    _BRANCH_: opts.branch,
    _BASE_COMMIT_: opts.baseCommit,
    _OUTPUT_COMMIT_: opts.outputCommit,
    _JOB_DESCRIPTION_: definition.description ?? "-",
    _ANALYSIS_DESCRIPTION_: isJobCommandTask(record.task)
      ? (record.task.analysis?.description ?? "コマンドの終了結果と出力を確認する。")
      : record.task.description,
    _RESULT_REF_: repoRelative(resultPath),
    _RUN_RESULT_REF_: repoRelative(join(paths.executionPath, record.result_ref)),
  };
  const body = expandTemplate(readFileSync(templatePath, "utf8"), values);
  const content = injectCommonConventions(body, MISSING, new Map<string, string>(), "review");
  writeFileSync(planPath, content, "utf8");
  await formatMarkdownFile(planPath);
  return { planPath, resultPath };
}

export function recordJobRunReview(
  runPath: string,
  review: Omit<JobRunReview, "reviewed_at"> & { reviewed_at?: string },
): JobRunRecord {
  const record = loadJobRunRecord(runPath);
  const reviewedAt = review.reviewed_at ?? new Date().toISOString();
  const updated: JobRunRecord = {
    ...record,
    updated_at: reviewedAt,
    review: { ...review, reviewed_at: reviewedAt },
  };
  writeJson(runPath, updated);
  return updated;
}

export async function materializeJobRun(opts: {
  projectId?: string;
  jobId: string;
  inputs?: string[] | string;
  scheduledAt?: string;
  trigger?: "manual" | "routine" | "ci";
  dryRun?: boolean;
}): Promise<MaterializedJobRun> {
  const paths = resolveJobPaths(opts.projectId);
  const definition = loadJobDefinition(paths, opts.jobId);
  const checkpoint = jobCheckpoint(paths, definition.id);
  const scheduledAt = opts.scheduledAt
    ? new Date(opts.scheduledAt).toISOString()
    : new Date().toISOString();
  const inputs = resolveInputs(definition, parseJobInputs(opts.inputs), checkpoint);
  const identityContext = {
    job_id: definition.id,
    project_id: paths.projectId,
    specdojo: selfRunCommand(),
    scheduled_at: scheduledAt,
    inputs,
    checkpoint,
  };
  const idempotencyKey = renderJobTemplate(definition.run.idempotency_key, identityContext);
  if (!idempotencyKey.trim())
    throw new Error(`Resolved idempotency key is empty: ${definition.id}`);
  const runId = runIdFor(definition, idempotencyKey);
  const context = { ...identityContext, job_run_id: runId };
  const runPath = join(paths.runsPath, `${runId}.json`);
  const targets = definition.task.targets
    ? qualifyTargets(paths.projectId, definition.task.targets)
    : undefined;
  const task: JobTaskDefinition = {
    ...definition.task,
    ...(targets ? { targets } : {}),
  };
  if (isJobCommandTask(task)) {
    if (task.precondition) {
      task.precondition = {
        ...task.precondition,
        command: renderJobTemplate(task.precondition.command, context),
      };
    }
    task.command = renderJobTemplate(task.command, context);
    if (task.analysis) {
      task.analysis = {
        ...task.analysis,
        description: renderJobTemplate(task.analysis.description, context),
      };
    }
  } else {
    task.description = renderJobTemplate(task.description, context);
  }
  const now = new Date().toISOString();
  const existingRun = existsSync(runPath);
  let record: JobRunRecord;
  if (existingRun) {
    record = loadJobRunRecord(runPath);
    if (record.idempotency_key !== idempotencyKey || record.job_id !== definition.id) {
      throw new Error(`Job Run identity collision: ${runId}`);
    }
    if (record.state === "succeeded" || record.state === "noop") {
      return {
        definition,
        record,
        runPath,
        planPath: join(paths.executionPath, record.plan_ref),
        duplicateComplete: true,
      };
    }
  } else {
    record = {
      version: 1,
      run_id: runId,
      job_id: definition.id,
      idempotency_key: idempotencyKey,
      project_id: paths.projectId,
      trigger: opts.trigger ?? "manual",
      scheduled_at: scheduledAt,
      created_at: now,
      updated_at: now,
      state: "running",
      inputs,
      task,
      checkpoint_before: checkpoint,
      plan_ref: `exec/plans/${runId}-plan.md`,
      result_ref: `exec/results/${runId}-result.md`,
      attempts: [],
    };
  }
  if (!existingRun && !opts.dryRun && isJobCommandTask(task) && task.precondition) {
    const precondition = await executeJobPrecondition(task.precondition, specdojoRootDir());
    if (precondition.skipped) {
      return {
        definition,
        record,
        runPath,
        planPath: join(paths.executionPath, record.plan_ref),
        duplicateComplete: false,
        preconditionSkipped: true,
        preconditionReason: precondition.reason,
        preconditionResult: precondition.result,
      };
    }
  }
  const attempt: JobRunAttempt = {
    attempt: record.attempts.length + 1,
    started_at: now,
    status: "running",
  };
  record = {
    ...record,
    updated_at: now,
    state: "running",
    attempts: [...record.attempts, attempt],
  };
  if (!opts.dryRun) {
    mkdirSync(paths.runsPath, { recursive: true });
    writeJson(runPath, record);
  }
  const planPath = opts.dryRun
    ? join(paths.executionPath, record.plan_ref)
    : await generateJobPlan(paths, definition, record);
  return { definition, record, runPath, planPath, duplicateComplete: false };
}

export function completeJobRun(opts: {
  projectId?: string;
  runPath: string;
  status: "succeeded" | "failed" | "noop";
  reason?: string;
  evidenceRef?: string;
  exitCode?: number | null;
}): JobRunRecord {
  const paths = resolveJobPaths(opts.projectId);
  const record = loadJobRunRecord(opts.runPath);
  const definition = loadJobDefinition(paths, record.job_id);
  const completedAt = new Date().toISOString();
  const attempts = [...record.attempts];
  const current = attempts.at(-1);
  if (!current) throw new Error(`Job Run has no attempt: ${record.run_id}`);
  attempts[attempts.length - 1] = {
    ...current,
    completed_at: completedAt,
    status: opts.status,
    result_ref: record.result_ref,
    ...(opts.evidenceRef ? { evidence_ref: opts.evidenceRef } : {}),
    ...(opts.exitCode !== undefined ? { exit_code: opts.exitCode } : {}),
    ...(opts.reason ? { reason: opts.reason } : {}),
  };
  let checkpointAfter: Record<string, unknown> | undefined;
  const advanceOn = definition.checkpoint?.advance_on ?? ["succeeded", "noop"];
  if (definition.checkpoint && advanceOn.includes(opts.status as "succeeded" | "noop")) {
    const context = {
      job_id: definition.id,
      job_run_id: record.run_id,
      project_id: record.project_id,
      specdojo: selfRunCommand(),
      scheduled_at: record.scheduled_at,
      inputs: record.inputs,
      checkpoint: record.checkpoint_before,
    };
    checkpointAfter = Object.fromEntries(
      Object.entries(definition.checkpoint.values).map(([key, value]) => [
        key,
        renderJobTemplate(value, context),
      ]),
    );
  }
  const updated: JobRunRecord = {
    ...record,
    updated_at: completedAt,
    state: opts.status,
    attempts,
    ...(checkpointAfter ? { checkpoint_after: checkpointAfter } : {}),
  };
  writeJson(opts.runPath, updated);
  if (checkpointAfter) {
    const state = deriveJobState(paths);
    state.jobs[record.job_id] = {
      checkpoint: checkpointAfter,
      last_run_id: record.run_id,
      updated_at: completedAt,
    };
    mkdirSync(resolve(paths.statePath, ".."), { recursive: true });
    writeJson(paths.statePath, state);
  }
  return updated;
}

export function jobRunRelativePath(runPath: string): string {
  return repoRelative(runPath);
}

export function registerJobCommands(program: Command): void {
  const command = program.command("job").description("Reusable Job Definition and Run helpers");

  command
    .command("where")
    .description("Print resolved Job paths")
    .option("--project <projectId>", "Project id")
    .action((opts: { project?: string }) => {
      try {
        const paths = resolveJobPaths(opts.project);
        process.stdout.write(`project: ${paths.projectId}\n`);
        process.stdout.write(`jobs:    ${paths.jobsPath}\n`);
        process.stdout.write(`runs:    ${paths.runsPath}\n`);
        process.stdout.write(`state:   ${paths.statePath}\n`);
      } catch (error) {
        process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
        process.exitCode = 1;
      }
    });

  command
    .command("validate")
    .description("Validate job-*.yaml definitions")
    .option("--project <projectId>", "Project id")
    .action((opts: { project?: string }) => {
      try {
        const paths = resolveJobPaths(opts.project);
        const { jobs, errors } = loadAllJobs(paths.jobsPath);
        for (const error of errors) process.stderr.write(`ERROR: ${error}\n`);
        process.stdout.write(`Validated: ${jobs.length} job(s), ${errors.length} error(s)\n`);
        if (errors.length) process.exitCode = 1;
      } catch (error) {
        process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
        process.exitCode = 1;
      }
    });

  command
    .command("list")
    .description("List Job Definitions and latest checkpoint")
    .option("--project <projectId>", "Project id")
    .action((opts: { project?: string }) => {
      try {
        const paths = resolveJobPaths(opts.project);
        const { jobs, errors } = loadAllJobs(paths.jobsPath);
        const state = deriveJobState(paths);
        for (const job of jobs) {
          const latest = state.jobs[job.id];
          process.stdout.write(`${job.id}\t${latest?.last_run_id ?? "-"}\t${job.name}\n`);
        }
        for (const error of errors) process.stderr.write(`ERROR: ${error}\n`);
        if (errors.length) process.exitCode = 1;
      } catch (error) {
        process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
        process.exitCode = 1;
      }
    });
}
