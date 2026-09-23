import { createHash } from "node:crypto";
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";
import yaml from "js-yaml";
import type { Command } from "commander";
import { buildSpecdojoFrontmatter } from "./frontmatter-namespace.js";
import { formatMarkdownFile } from "./exec-format.js";
import { execTemplatePath, injectCommonConventions, MISSING } from "./exec-plans.js";
import { expandTemplate, listFilesRecursive, readJson, writeJson } from "./exec-shared.js";
import { gitEnvironment } from "./exec-worktree.js";
import {
  getProjectJobsPath,
  getProjectExecutionPath,
  loadConfig,
  loadEnv,
  specdojoRootDir,
  type SpecDojoProjectConfig,
} from "./specdojo-config.js";
import type { Proficiency, TaskMode } from "./exec-types.js";
import { selfRunCommand } from "./spawn-self.js";

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

export type JobAgentTaskDefinition = {
  mode: TaskMode;
  owner?: string;
  description: string;
  targets?: string[];
  paths?: string[];
  agent?: JobAgentDefinition;
  capabilities?: string[];
  proficiency?: Proficiency;
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

type JobStateFile = {
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

// Same nickname shape as pm-members.schema.yaml. The roster is not loaded here, so a
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

// Parses task.agent and reports why it was rejected. Unknown keys are refused so a typo
// (for example `reporters`) cannot silently drop the reporter stage.
function parseJobAgent(value: unknown): { agent?: JobAgentDefinition; error?: string } {
  if (!isRecord(value)) {
    return { error: "task.agent must be a mapping with executor and optional reporter" };
  }
  const unknownKeys = Object.keys(value).filter((key) => key !== "executor" && key !== "reporter");
  if (unknownKeys.length > 0) {
    return { error: `task.agent has unknown key(s): ${unknownKeys.sort().join(", ")}` };
  }
  if (!isAgentNickname(value.executor)) {
    return { error: "task.agent.executor must be an agent nickname from pm-members.yaml" };
  }
  if (value.reporter !== undefined && !isAgentNickname(value.reporter)) {
    return { error: "task.agent.reporter must be an agent nickname from pm-members.yaml" };
  }
  return {
    agent: {
      executor: value.executor.trim(),
      ...(isAgentNickname(value.reporter) ? { reporter: value.reporter.trim() } : {}),
    },
  };
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
    Array.isArray(value.attempts) &&
    value.attempts.every(isJobRunAttempt)
  );
}

function readJobRunRecord(filePath: string): JobRunRecord {
  const raw = readJson(filePath);
  if (!isJobRunRecord(raw)) throw new Error(`Invalid Job Run file: ${filePath}`);
  return raw;
}

function validateJobInputValue(value: unknown, input: JobInputDefinition, key: string): void {
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
    const common = {
      ...(targets ? { targets: targets.map((target) => target.trim()) } : {}),
      ...(paths ? { paths: paths.map((path) => path.trim()) } : {}),
      ...(typeof value.task.owner === "string" ? { owner: value.task.owner.trim() } : {}),
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
            errors.push("task.analysis.agent must be an agent nickname from pm-members.yaml");
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

function parseInputValue(value: unknown, type: JobInputType, key: string): unknown {
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

function getPath(source: Record<string, unknown>, path: string): unknown {
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
      const run = readJobRunRecord(filePath);
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
    `name: "${definition.name.replaceAll('"', "'")}"`,
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
    record = readJobRunRecord(runPath);
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
  const record = readJobRunRecord(opts.runPath);
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
