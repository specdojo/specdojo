import { existsSync, readFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import yaml from "js-yaml";
import { listFilesRecursive, readJson } from "./exec-shared.js";
import {
  getProjectExecutionPath,
  getProjectJobsPath,
  loadConfig,
  loadEnv,
  specdojoRootDir,
  type SpecDojoProjectConfig,
} from "./specdojo-config.js";
import type { Proficiency, TaskMode } from "./exec-types.js";

export type JobInputType = "string" | "integer" | "boolean" | "list";

export type JobInputDefinition = {
  type: JobInputType;
  required?: boolean;
  default?: unknown;
  enum?: Array<string | number | boolean>;
  minimum?: number;
  maximum?: number;
  from_checkpoint?: string;
  resolve?: "git_head";
  git_revision?: boolean;
};

// Nicknames of the agents a Job delegates to. Pinning nicknames keeps the delegation
// target explicit in the definition instead of depending on capability based auto
// selection. With a reporter the Run executes as an executor/reporter pipeline.
export type JobAgentDefinition = {
  executor: string;
  reporter?: string;
};

// Declares that a Run's output is reviewed before it is integrated. A Job with this
// declaration always runs in an exec worktree, is committed by the runner, reviewed, and
// merged only on an accepted verdict, whether a routine or a manual `exec run --job`
// starts it. The optional agent pins the review executor/reporter by nickname.
export type JobReviewDefinition = {
  agent?: JobAgentDefinition;
};

export type JobAgentTaskDefinition = {
  mode: TaskMode;
  owner?: string;
  description: string;
  targets?: string[];
  paths?: string[];
  agent?: JobAgentDefinition;
  capabilities?: string[];
  proficiency?: Proficiency;
  review?: JobReviewDefinition;
};

export type JobCommandAnalysisDefinition = {
  agent: string;
  description: string;
};

export type JobPreconditionDefinition = {
  command: string;
  skip_when: "empty-output" | number;
};

export type JobCommandTaskDefinition = {
  mode: "command";
  owner?: string;
  precondition?: JobPreconditionDefinition;
  command: string;
  analysis?: JobCommandAnalysisDefinition;
  targets?: string[];
  paths?: string[];
  review?: JobReviewDefinition;
};

export type JobTaskDefinition = JobAgentTaskDefinition | JobCommandTaskDefinition;

export type JobDefinition = {
  id: string;
  name: string;
  description?: string;
  inputs?: Record<string, JobInputDefinition>;
  task: JobTaskDefinition;
  run: { idempotency_key: string };
  checkpoint?: {
    values: Record<string, string>;
    advance_on?: Array<"succeeded" | "noop">;
  };
};

export type JobRunState = "running" | "succeeded" | "failed" | "noop";

export type JobRunAttempt = {
  attempt: number;
  started_at: string;
  completed_at?: string;
  status: "running" | "succeeded" | "failed" | "noop";
  result_ref?: string;
  evidence_ref?: string;
  exit_code?: number | null;
  reason?: string;
};

export type JobRunReview = {
  plan_ref: string;
  result_ref: string;
  reviewed_at: string;
  branch: string;
  verdict?:
    | "complete"
    | "complete-with-findings"
    | "incomplete"
    | "grade-stale"
    | "grade-unavailable"
    | "changed-during-review";
  reason?: string;
};

export type JobRunRecord = {
  version: 1;
  run_id: string;
  job_id: string;
  idempotency_key: string;
  project_id: string;
  trigger: "manual" | "routine" | "ci";
  scheduled_at: string;
  created_at: string;
  updated_at: string;
  state: JobRunState;
  inputs: Record<string, unknown>;
  task: JobTaskDefinition;
  checkpoint_before: Record<string, unknown>;
  checkpoint_after?: Record<string, unknown>;
  plan_ref: string;
  result_ref: string;
  attempts: JobRunAttempt[];
  review?: JobRunReview;
};

export type JobPaths = {
  projectId: string;
  jobsPath: string;
  executionPath: string;
  runsPath: string;
  statePath: string;
};

export type MaterializedJobRun = {
  definition: JobDefinition;
  record: JobRunRecord;
  runPath: string;
  planPath: string;
  duplicateComplete: boolean;
  preconditionSkipped?: boolean;
  preconditionReason?: string;
  preconditionResult?: JobCommandResult;
};

export type JobCommandResult = {
  command: string;
  startedAt: string;
  completedAt: string;
  exitCode: number | null;
  stdout: string;
  stderr: string;
  stdoutTruncated: boolean;
  stderrTruncated: boolean;
  error?: string;
};

export type JobStateFile = {
  version: 1;
  jobs: Record<
    string,
    { checkpoint: Record<string, unknown>; last_run_id: string; updated_at: string }
  >;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isJobCommandTask(task: JobTaskDefinition): task is JobCommandTaskDefinition {
  return task.mode === "command";
}

export function isJobAgentTask(task: JobTaskDefinition): task is JobAgentTaskDefinition {
  return task.mode === "edit" || task.mode === "review";
}

function validStringList(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => typeof item === "string" && item.trim())
  );
}

// Same nickname shape as agent-members.schema.yaml. The roster is not loaded here, so a
// definition only guarantees the format; an unknown nickname fails when the Run resolves
// the agent command.
function isAgentNickname(value: unknown): value is string {
  return typeof value === "string" && /^[a-z0-9][a-z0-9_-]{0,62}$/.test(value.trim());
}

function isJobAgentDefinition(value: unknown): value is JobAgentDefinition {
  return (
    isRecord(value) &&
    isAgentNickname(value.executor) &&
    (value.reporter === undefined || isAgentNickname(value.reporter))
  );
}

// Parses task.agent (or another nomination such as task.review.agent) and reports why it was
// rejected. Unknown keys are refused so a typo (for example `reporters`) cannot silently drop
// the reporter stage.
function parseJobAgent(
  value: unknown,
  fieldName = "task.agent",
): { agent?: JobAgentDefinition; error?: string } {
  if (!isRecord(value)) {
    return { error: `${fieldName} must be a mapping with executor and optional reporter` };
  }
  const unknownKeys = Object.keys(value).filter((key) => key !== "executor" && key !== "reporter");
  if (unknownKeys.length > 0) {
    return { error: `${fieldName} has unknown key(s): ${unknownKeys.sort().join(", ")}` };
  }
  if (!isAgentNickname(value.executor)) {
    return { error: `${fieldName}.executor must be an agent nickname from agent-members.yaml` };
  }
  if (value.reporter !== undefined && !isAgentNickname(value.reporter)) {
    return { error: `${fieldName}.reporter must be an agent nickname from agent-members.yaml` };
  }
  return {
    agent: {
      executor: value.executor.trim(),
      ...(isAgentNickname(value.reporter) ? { reporter: value.reporter.trim() } : {}),
    },
  };
}

// Parses task.review. The mapping itself is the declaration; an empty mapping declares the
// reviewed integration without pinning agents, which are then auto selected.
function parseJobReview(value: unknown): { review?: JobReviewDefinition; errors: string[] } {
  if (!isRecord(value)) {
    return { errors: ["task.review must be a mapping with an optional agent"] };
  }
  const errors: string[] = [];
  const unknownKeys = Object.keys(value).filter((key) => key !== "agent");
  if (unknownKeys.length > 0) {
    errors.push(`task.review has unknown key(s): ${unknownKeys.sort().join(", ")}`);
  }
  let agent: JobAgentDefinition | undefined;
  if (value.agent !== undefined) {
    const parsed = parseJobAgent(value.agent, "task.review.agent");
    if (parsed.error) errors.push(parsed.error);
    agent = parsed.agent;
  }
  if (errors.length > 0) return { errors };
  return { review: agent ? { agent } : {}, errors };
}

function isJobReviewDefinition(value: unknown): value is JobReviewDefinition {
  return isRecord(value) && (value.agent === undefined || isJobAgentDefinition(value.agent));
}

/** True when the Job declares that its Run output is reviewed before integration. */
export function jobDeclaresReview(definition: Pick<JobDefinition, "task">): boolean {
  return definition.task.review !== undefined;
}

export type JobReviewAgentSource = "cli" | "job";

export type JobReviewAgentNomination = { nickname: string; source: JobReviewAgentSource };

/**
 * Resolves the review agent nicknames of a Job Run review. The order is the CLI flag
 * (`--review-by` / `--reporter-by`), then the Job's task.review.agent, then auto selection
 * (an undefined entry means the caller auto selects).
 */
export function resolveJobReviewAgentNominations(
  cli: { reviewBy?: string; reporterBy?: string },
  definition: Pick<JobDefinition, "task">,
): { executor?: JobReviewAgentNomination; reporter?: JobReviewAgentNomination } {
  const nominate = (
    cliValue: string | undefined,
    jobValue: string | undefined,
  ): JobReviewAgentNomination | undefined => {
    const fromCli = cliValue?.trim();
    if (fromCli) return { nickname: fromCli, source: "cli" };
    const fromJob = jobValue?.trim();
    if (fromJob) return { nickname: fromJob, source: "job" };
    return undefined;
  };
  const agent = definition.task.review?.agent;
  const executor = nominate(cli.reviewBy, agent?.executor);
  const reporter = nominate(cli.reporterBy, agent?.reporter);
  return {
    ...(executor ? { executor } : {}),
    ...(reporter ? { reporter } : {}),
  };
}

/**
 * Decides whether a Job Run takes the reviewed integration path (exec worktree, runner
 * commit, review, merge by verdict). The Job's task.review declaration wins over the
 * caller: a declared Job is always reviewed, and `--worktree` (passed by a routine with the
 * legacy `action.commit: true`) still opts an undeclared Job in for compatibility. The child
 * process that executes the Job inside the worktree never re-enters this path.
 */
export function jobRunUsesReviewedIntegration(
  definition: Pick<JobDefinition, "task">,
  opts: { worktree?: boolean; isWorktreeChild?: boolean },
): boolean {
  if (opts.isWorktreeChild) return false;
  return jobDeclaresReview(definition) || !!opts.worktree;
}

function isJobRunState(value: unknown): value is JobRunState {
  return value === "running" || value === "succeeded" || value === "failed" || value === "noop";
}

function isJobTaskDefinition(value: unknown): value is JobTaskDefinition {
  if (!isRecord(value)) return false;
  if (value.owner !== undefined && typeof value.owner !== "string") return false;
  if (
    !(["targets", "paths"] as const).every(
      (field) => value[field] === undefined || validStringList(value[field]),
    )
  )
    return false;
  if (value.review !== undefined && !isJobReviewDefinition(value.review)) return false;
  if (value.mode === "command") {
    return (
      typeof value.command === "string" &&
      (value.precondition === undefined ||
        (isRecord(value.precondition) &&
          typeof value.precondition.command === "string" &&
          (value.precondition.skip_when === "empty-output" ||
            (Number.isSafeInteger(value.precondition.skip_when) &&
              Number(value.precondition.skip_when) >= 0 &&
              Number(value.precondition.skip_when) <= 255)))) &&
      (value.analysis === undefined ||
        (isRecord(value.analysis) &&
          isAgentNickname(value.analysis.agent) &&
          typeof value.analysis.description === "string"))
    );
  }
  if (value.mode !== "edit" && value.mode !== "review") return false;
  if (typeof value.description !== "string") return false;
  if (value.agent !== undefined && !isJobAgentDefinition(value.agent)) return false;
  return (["capabilities"] as const).every(
    (field) => value[field] === undefined || validStringList(value[field]),
  );
}

function isJobRunAttempt(value: unknown): value is JobRunAttempt {
  return (
    isRecord(value) &&
    typeof value.attempt === "number" &&
    typeof value.started_at === "string" &&
    isJobRunState(value.status) &&
    (value.evidence_ref === undefined || typeof value.evidence_ref === "string") &&
    (value.exit_code === undefined ||
      value.exit_code === null ||
      typeof value.exit_code === "number")
  );
}

function isJobRunReview(value: unknown): value is JobRunReview {
  return (
    isRecord(value) &&
    typeof value.plan_ref === "string" &&
    typeof value.result_ref === "string" &&
    typeof value.reviewed_at === "string" &&
    typeof value.branch === "string" &&
    (value.verdict === undefined ||
      [
        "complete",
        "complete-with-findings",
        "incomplete",
        "grade-stale",
        "grade-unavailable",
        "changed-during-review",
      ].includes(String(value.verdict))) &&
    (value.reason === undefined || typeof value.reason === "string")
  );
}

function isJobRunRecord(value: unknown): value is JobRunRecord {
  if (!isRecord(value)) return false;
  const stringFields = [
    "run_id",
    "job_id",
    "idempotency_key",
    "project_id",
    "scheduled_at",
    "created_at",
    "updated_at",
    "plan_ref",
    "result_ref",
  ] as const;
  return (
    value.version === 1 &&
    stringFields.every((field) => typeof value[field] === "string") &&
    (value.trigger === "manual" || value.trigger === "routine" || value.trigger === "ci") &&
    isJobRunState(value.state) &&
    isRecord(value.inputs) &&
    isJobTaskDefinition(value.task) &&
    isRecord(value.checkpoint_before) &&
    (value.checkpoint_after === undefined || isRecord(value.checkpoint_after)) &&
    (value.review === undefined || isJobRunReview(value.review)) &&
    Array.isArray(value.attempts) &&
    value.attempts.every(isJobRunAttempt)
  );
}

function readJobRunRecord(filePath: string): JobRunRecord {
  const raw = readJson(filePath);
  if (!isJobRunRecord(raw)) throw new Error(`Invalid Job Run file: ${filePath}`);
  return raw;
}

export function loadJobRunRecord(filePath: string): JobRunRecord {
  return readJobRunRecord(filePath);
}

export function validateJobInputValue(
  value: unknown,
  input: JobInputDefinition,
  key: string,
): void {
  const values = input.type === "list" ? (value as string[]) : [value];
  if (input.enum) {
    for (const item of values) {
      if (!input.enum.includes(item as string | number | boolean)) {
        throw new Error(`Input ${key} must be one of: ${input.enum.join(", ")}`);
      }
    }
  }
  if (input.type === "integer") {
    const integer = value as number;
    if (input.minimum !== undefined && integer < input.minimum) {
      throw new Error(`Input ${key} must be at least ${input.minimum}`);
    }
    if (input.maximum !== undefined && integer > input.maximum) {
      throw new Error(`Input ${key} must be at most ${input.maximum}`);
    }
  }
}

export function parseJobDefinition(
  value: unknown,
  fileName: string,
): { job?: JobDefinition; errors: string[] } {
  const errors: string[] = [];
  if (!isRecord(value)) return { errors: [`${fileName}: job file must be a YAML mapping`] };

  const expectedId = fileName.replace(/\.(yaml|yml)$/, "");
  const id = typeof value.id === "string" ? value.id.trim() : "";
  if (!/^job-[a-z0-9][a-z0-9-]*$/.test(id)) errors.push("id must match job-<slug>");
  if (id && id !== expectedId)
    errors.push(`id "${id}" must match the file name base "${expectedId}"`);
  const name = typeof value.name === "string" ? value.name.trim() : "";
  if (!name) errors.push("name is required");

  const inputDefinitions: Record<string, JobInputDefinition> = {};
  if (value.inputs !== undefined) {
    if (!isRecord(value.inputs)) errors.push("inputs must be a mapping");
    else {
      for (const [key, raw] of Object.entries(value.inputs)) {
        if (!/^[a-z][a-z0-9_]*$/.test(key)) {
          errors.push(`inputs.${key} must use lowercase snake_case`);
          continue;
        }
        if (!isRecord(raw)) {
          errors.push(`inputs.${key} must be a mapping`);
          continue;
        }
        const unknownInputKeys = Object.keys(raw).filter(
          (field) =>
            ![
              "type",
              "required",
              "default",
              "enum",
              "minimum",
              "maximum",
              "from_checkpoint",
              "resolve",
              "git_revision",
            ].includes(field),
        );
        if (unknownInputKeys.length > 0) {
          errors.push(`inputs.${key} has unknown key(s): ${unknownInputKeys.sort().join(", ")}`);
        }
        const type = raw.type;
        if (type !== "string" && type !== "integer" && type !== "boolean" && type !== "list") {
          errors.push(`inputs.${key}.type must be string|integer|boolean|list`);
          continue;
        }
        if (raw.required !== undefined && typeof raw.required !== "boolean") {
          errors.push(`inputs.${key}.required must be a boolean`);
        }
        if (raw.from_checkpoint !== undefined && typeof raw.from_checkpoint !== "string") {
          errors.push(`inputs.${key}.from_checkpoint must be a string`);
        }
        if (raw.resolve !== undefined && raw.resolve !== "git_head") {
          errors.push(`inputs.${key}.resolve must be git_head`);
        }
        if (raw.git_revision !== undefined && typeof raw.git_revision !== "boolean") {
          errors.push(`inputs.${key}.git_revision must be a boolean`);
        }
        const enumValues = raw.enum;
        if (
          enumValues !== undefined &&
          (!Array.isArray(enumValues) ||
            enumValues.length === 0 ||
            new Set(enumValues).size !== enumValues.length ||
            enumValues.some((item) =>
              type === "integer"
                ? !Number.isSafeInteger(item)
                : type === "boolean"
                  ? typeof item !== "boolean"
                  : typeof item !== "string",
            ))
        ) {
          errors.push(
            `inputs.${key}.enum must be a non-empty unique list of ${type === "list" ? "string" : type} values`,
          );
        }
        if (
          raw.minimum !== undefined &&
          (type !== "integer" || !Number.isSafeInteger(raw.minimum))
        ) {
          errors.push(`inputs.${key}.minimum is only allowed as an integer constraint`);
        }
        if (
          raw.maximum !== undefined &&
          (type !== "integer" || !Number.isSafeInteger(raw.maximum))
        ) {
          errors.push(`inputs.${key}.maximum is only allowed as an integer constraint`);
        }
        if (
          Number.isSafeInteger(raw.minimum) &&
          Number.isSafeInteger(raw.maximum) &&
          Number(raw.minimum) > Number(raw.maximum)
        ) {
          errors.push(`inputs.${key}.minimum must not exceed maximum`);
        }
        const definition: JobInputDefinition = {
          type,
          ...(typeof raw.required === "boolean" ? { required: raw.required } : {}),
          ...(raw.default !== undefined ? { default: raw.default } : {}),
          ...(Array.isArray(enumValues)
            ? { enum: enumValues as Array<string | number | boolean> }
            : {}),
          ...(Number.isSafeInteger(raw.minimum) ? { minimum: Number(raw.minimum) } : {}),
          ...(Number.isSafeInteger(raw.maximum) ? { maximum: Number(raw.maximum) } : {}),
          ...(typeof raw.from_checkpoint === "string"
            ? { from_checkpoint: raw.from_checkpoint }
            : {}),
          ...(raw.resolve === "git_head" ? { resolve: "git_head" } : {}),
          ...(typeof raw.git_revision === "boolean" ? { git_revision: raw.git_revision } : {}),
        };
        if (raw.default !== undefined) {
          try {
            const parsedDefault = parseInputValue(raw.default, type, key);
            validateJobInputValue(parsedDefault, definition, key);
          } catch (error) {
            errors.push(
              `inputs.${key}.default is invalid: ${error instanceof Error ? error.message : String(error)}`,
            );
          }
        }
        inputDefinitions[key] = definition;
      }
    }
  }

  let task: JobTaskDefinition | undefined;
  if (!isRecord(value.task)) errors.push("task is required and must be a mapping");
  else {
    const mode = value.task.mode;
    const targets = validStringList(value.task.targets) ? value.task.targets : undefined;
    const paths = validStringList(value.task.paths) ? value.task.paths : undefined;
    if (value.task.targets !== undefined && !targets)
      errors.push("task.targets must be a non-empty string list");
    if (value.task.paths !== undefined && !paths)
      errors.push("task.paths must be a non-empty string list");
    if (value.task.owner !== undefined && typeof value.task.owner !== "string")
      errors.push("task.owner must be a string");
    let review: JobReviewDefinition | undefined;
    if (value.task.review !== undefined) {
      const parsedReview = parseJobReview(value.task.review);
      errors.push(...parsedReview.errors);
      review = parsedReview.review;
    }
    const common = {
      ...(targets ? { targets: targets.map((target) => target.trim()) } : {}),
      ...(paths ? { paths: paths.map((path) => path.trim()) } : {}),
      ...(typeof value.task.owner === "string" ? { owner: value.task.owner.trim() } : {}),
      ...(review ? { review } : {}),
    };

    if (mode === "command") {
      const command = typeof value.task.command === "string" ? value.task.command.trim() : "";
      if (!command) errors.push("task.command is required for command mode");
      let precondition: JobPreconditionDefinition | undefined;
      if (value.task.precondition !== undefined) {
        if (!isRecord(value.task.precondition)) {
          errors.push("task.precondition must be a mapping with command and skip_when");
        } else {
          const unknownPreconditionKeys = Object.keys(value.task.precondition).filter(
            (key) => key !== "command" && key !== "skip_when",
          );
          if (unknownPreconditionKeys.length > 0) {
            errors.push(
              `task.precondition has unknown key(s): ${unknownPreconditionKeys.sort().join(", ")}`,
            );
          }
          const preconditionCommand =
            typeof value.task.precondition.command === "string"
              ? value.task.precondition.command.trim()
              : "";
          if (!preconditionCommand) errors.push("task.precondition.command is required");
          const skipWhen = value.task.precondition.skip_when;
          if (
            skipWhen !== "empty-output" &&
            (!Number.isSafeInteger(skipWhen) || Number(skipWhen) < 0 || Number(skipWhen) > 255)
          ) {
            errors.push(
              "task.precondition.skip_when must be empty-output or an exit code from 0 to 255",
            );
          }
          if (
            preconditionCommand &&
            (skipWhen === "empty-output" || Number.isSafeInteger(skipWhen))
          ) {
            precondition = {
              command: preconditionCommand,
              skip_when: skipWhen as "empty-output" | number,
            };
          }
        }
      }
      let analysis: JobCommandAnalysisDefinition | undefined;
      if (value.task.analysis !== undefined) {
        if (!isRecord(value.task.analysis)) {
          errors.push("task.analysis must be a mapping with agent and description");
        } else {
          const unknownAnalysisKeys = Object.keys(value.task.analysis).filter(
            (key) => key !== "agent" && key !== "description",
          );
          if (unknownAnalysisKeys.length > 0) {
            errors.push(
              `task.analysis has unknown key(s): ${unknownAnalysisKeys.sort().join(", ")}`,
            );
          }
          if (!isAgentNickname(value.task.analysis.agent)) {
            errors.push("task.analysis.agent must be an agent nickname from agent-members.yaml");
          }
          const analysisDescription =
            typeof value.task.analysis.description === "string"
              ? value.task.analysis.description.trim()
              : "";
          if (!analysisDescription) errors.push("task.analysis.description is required");
          if (isAgentNickname(value.task.analysis.agent) && analysisDescription) {
            analysis = {
              agent: value.task.analysis.agent.trim(),
              description: analysisDescription,
            };
          }
        }
      }
      if (value.task.agent !== undefined)
        errors.push("task.agent is not allowed in command mode; use task.analysis.agent");
      if (value.task.description !== undefined)
        errors.push(
          "task.description is not allowed in command mode; use task.analysis.description",
        );
      if (value.task.capabilities !== undefined || value.task.proficiency !== undefined) {
        errors.push("task.capabilities and task.proficiency are not allowed in command mode");
      }
      if (command)
        task = {
          mode: "command",
          ...(precondition ? { precondition } : {}),
          command,
          ...(analysis ? { analysis } : {}),
          ...common,
        };
    } else {
      if (mode !== "edit" && mode !== "review") {
        errors.push("task.mode must be edit, review, or command");
      }
      const description =
        typeof value.task.description === "string" ? value.task.description.trim() : "";
      if (!description) errors.push("task.description is required");
      if (!targets && !paths)
        errors.push("task.targets or task.paths must be a non-empty string list");
      let agent: JobAgentDefinition | undefined;
      if (value.task.agent !== undefined) {
        const parsedAgent = parseJobAgent(value.task.agent);
        if (parsedAgent.error) errors.push(parsedAgent.error);
        agent = parsedAgent.agent;
      }
      if (
        value.task.analysis !== undefined ||
        value.task.command !== undefined ||
        value.task.precondition !== undefined
      ) {
        errors.push(
          "task.command, task.precondition, and task.analysis are only allowed in command mode",
        );
      }
      if (value.task.capabilities !== undefined && !validStringList(value.task.capabilities)) {
        errors.push("task.capabilities must be a non-empty string list");
      }
      const proficiency = value.task.proficiency;
      if (
        proficiency !== undefined &&
        !["low", "normal", "high", "expert"].includes(String(proficiency))
      ) {
        errors.push("task.proficiency must be low|normal|high|expert");
      }
      if ((mode === "edit" || mode === "review") && description && (targets || paths)) {
        task = {
          mode,
          description,
          ...common,
          ...(agent ? { agent } : {}),
          ...(validStringList(value.task.capabilities)
            ? { capabilities: value.task.capabilities }
            : {}),
          ...(proficiency !== undefined ? { proficiency: proficiency as Proficiency } : {}),
        };
      }
    }
  }

  const idempotencyKey =
    isRecord(value.run) && typeof value.run.idempotency_key === "string"
      ? value.run.idempotency_key.trim()
      : "";
  if (!idempotencyKey) errors.push("run.idempotency_key is required");

  let checkpoint: JobDefinition["checkpoint"];
  if (value.checkpoint !== undefined) {
    if (!isRecord(value.checkpoint) || !isRecord(value.checkpoint.values)) {
      errors.push("checkpoint.values must be a mapping");
    } else {
      const values: Record<string, string> = {};
      for (const [key, raw] of Object.entries(value.checkpoint.values)) {
        if (!/^[a-z][a-z0-9_]*$/.test(key) || typeof raw !== "string") {
          errors.push(`checkpoint.values.${key} must be a string with a lowercase snake_case key`);
        } else values[key] = raw;
      }
      const advance = value.checkpoint.advance_on;
      if (
        advance !== undefined &&
        (!Array.isArray(advance) || advance.some((item) => item !== "succeeded" && item !== "noop"))
      ) {
        errors.push("checkpoint.advance_on must contain succeeded and/or noop");
      }
      checkpoint = {
        values,
        ...(Array.isArray(advance) ? { advance_on: advance as Array<"succeeded" | "noop"> } : {}),
      };
    }
  }

  if (errors.length > 0 || !task) return { errors: errors.map((error) => `${fileName}: ${error}`) };
  return {
    job: {
      id,
      name,
      ...(typeof value.description === "string" ? { description: value.description } : {}),
      ...(Object.keys(inputDefinitions).length ? { inputs: inputDefinitions } : {}),
      task,
      run: { idempotency_key: idempotencyKey },
      ...(checkpoint ? { checkpoint } : {}),
    },
    errors: [],
  };
}

function configProject(projectId?: string): { id: string; project: SpecDojoProjectConfig } {
  loadEnv();
  const { config, configPath } = loadConfig();
  if (!config) throw new Error(`job commands require specdojo.config.json: ${configPath}`);
  const id = projectId?.trim() || process.env.SPECDOJO_PROJECT?.trim() || config.current_project;
  if (!id) throw new Error("Project id is required. Use --project or set current_project.");
  const project = config.projects[id];
  if (!project) throw new Error(`Unknown project: ${id}`);
  return { id, project };
}

export function resolveJobPaths(projectId?: string): JobPaths {
  const { id, project } = configProject(projectId);
  const jobsPath = getProjectJobsPath(project);
  if (!jobsPath) throw new Error(`jobs_path not set for project '${id}' in specdojo.config.json`);
  const root = specdojoRootDir();
  const executionPath = resolve(root, getProjectExecutionPath(project));
  const absoluteJobsPath = resolve(root, jobsPath);
  return {
    projectId: id,
    jobsPath: absoluteJobsPath,
    executionPath,
    runsPath: join(executionPath, "jobs", "runs"),
    statePath: join(executionPath, "jobs", "generated", "job-state.json"),
  };
}

export function loadJobDefinition(paths: JobPaths, jobId: string): JobDefinition {
  const normalized = jobId.trim();
  if (!/^job-[a-z0-9][a-z0-9-]*$/.test(normalized)) throw new Error(`Invalid job id: ${jobId}`);
  const candidates = [
    join(paths.jobsPath, `${normalized}.yaml`),
    join(paths.jobsPath, `${normalized}.yml`),
  ];
  const filePath = candidates.find(existsSync);
  if (!filePath) throw new Error(`Job not found: ${normalized} (in ${paths.jobsPath})`);
  const parsed = parseJobDefinition(yaml.load(readFileSync(filePath, "utf8")), basename(filePath));
  if (!parsed.job) throw new Error(parsed.errors.join("\n"));
  return parsed.job;
}

export function loadAllJobs(jobsPath: string): { jobs: JobDefinition[]; errors: string[] } {
  if (!existsSync(jobsPath)) return { jobs: [], errors: [] };
  const jobs: JobDefinition[] = [];
  const errors: string[] = [];
  for (const filePath of listFilesRecursive(jobsPath)
    .filter((path) => /(?:^|\/)job-[^/]+\.ya?ml$/.test(path))
    .sort()) {
    try {
      const parsed = parseJobDefinition(
        yaml.load(readFileSync(filePath, "utf8")),
        basename(filePath),
      );
      errors.push(...parsed.errors);
      if (parsed.job) jobs.push(parsed.job);
    } catch (error) {
      errors.push(
        `${basename(filePath)}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  return { jobs, errors };
}

export function parseJobInputs(raw: string[] | string | undefined): Record<string, string> {
  const result: Record<string, string> = {};
  for (const token of raw === undefined ? [] : Array.isArray(raw) ? raw : [raw]) {
    const index = token.indexOf("=");
    if (index <= 0) throw new Error(`Invalid --input value: ${token}. Use key=value.`);
    const key = token.slice(0, index).trim();
    if (!/^[a-z][a-z0-9_]*$/.test(key)) throw new Error(`Invalid input key: ${key}`);
    if (Object.hasOwn(result, key)) throw new Error(`Duplicate input: ${key}`);
    result[key] = token.slice(index + 1);
  }
  return result;
}

export function parseInputValue(value: unknown, type: JobInputType, key: string): unknown {
  if (type === "string") return String(value);
  if (type === "integer") {
    const parsed = typeof value === "number" ? value : Number(value);
    if (!Number.isSafeInteger(parsed)) throw new Error(`Input ${key} must be an integer`);
    return parsed;
  }
  if (type === "boolean") {
    if (value === true || value === "true") return true;
    if (value === false || value === "false") return false;
    throw new Error(`Input ${key} must be true or false`);
  }
  if (Array.isArray(value)) return value.map(String);
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getPath(source: Record<string, unknown>, path: string): unknown {
  let current: unknown = source;
  for (const part of path.split(".")) {
    if (!isRecord(current) || !Object.hasOwn(current, part)) return undefined;
    current = current[part];
  }
  return current;
}

function templateValue(value: unknown): string {
  return Array.isArray(value) ? value.join(",") : String(value ?? "");
}

export function renderJobTemplate(
  template: string,
  context: {
    job_id: string;
    job_run_id?: string;
    project_id: string;
    specdojo: string;
    scheduled_at: string;
    inputs: Record<string, unknown>;
    checkpoint: Record<string, unknown>;
  },
): string {
  return template.replace(/\{\{\s*([a-z_][a-z0-9_.]*)\s*\}\}/gi, (_match, path: string) => {
    if (path === "job_id") return context.job_id;
    if (path === "job_run_id") {
      if (!context.job_run_id) {
        throw new Error("Job template value job_run_id is unavailable before Run identity exists");
      }
      return context.job_run_id;
    }
    if (path === "project_id") return context.project_id;
    if (path === "specdojo") return context.specdojo;
    if (path === "scheduled_at") return context.scheduled_at;
    if (path.startsWith("inputs.")) return templateValue(getPath(context.inputs, path.slice(7)));
    if (path.startsWith("checkpoint."))
      return templateValue(getPath(context.checkpoint, path.slice(11)));
    throw new Error(`Unknown job template value: ${path}`);
  });
}
