import { readFileSync } from "node:fs";
import { isAbsolute, relative, resolve, sep } from "node:path";
import { load } from "../../shared/yaml.js";
import {
  executeJobCommand,
  jobCommandText,
  recordJobSteps,
  type JobCommandResult,
  type JobCommandTaskDefinition,
  type JobStepResult,
} from "../../job/job.js";
import { recordCommandEvidence } from "../evidence.js";

function completionState(
  task: NonNullable<JobCommandTaskDefinition["steps"]>[number],
  cwd: string,
): { status: "succeeded" | "failed" | "deferred"; reason: string } {
  if (!task.completion) return { status: "succeeded", reason: "command exited 0" };
  const rule = task.completion;
  const path = resolve(cwd, rule.path);
  const rel = relative(cwd, path);
  if (isAbsolute(rule.path) || rel === ".." || rel.startsWith(`..${sep}`))
    return { status: "failed", reason: "completion.path must stay inside the repository" };
  try {
    const text = readFileSync(path, "utf8");
    const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
    const document: unknown = path.endsWith(".json") ? JSON.parse(text) : load(frontmatter ?? text);
    let value: unknown = document;
    for (const field of rule.field.split(".")) {
      value =
        typeof value === "object" && value !== null && Object.hasOwn(value, field)
          ? (value as Record<string, unknown>)[field]
          : undefined;
    }
    if (typeof value === "string" && rule.succeeded.includes(value))
      return { status: "succeeded", reason: "exit 0 and completion state accepted" };
    if (typeof value === "string" && rule.deferred?.includes(value))
      return { status: "deferred", reason: "completion state requires a later retry" };
    return { status: "failed", reason: "completion state missing or not accepted" };
  } catch {
    return { status: "failed", reason: "completion state file unavailable or invalid" };
  }
}

/** Runs frozen commands serially. Logs are evidence only, never a completion protocol. */
export async function executeJobSequence(params: {
  task: JobCommandTaskDefinition;
  runId: string;
  attempt: number;
  runPath: string;
  cwd: string;
  executionPath: string;
  deferredReason?: string;
}): Promise<JobCommandResult> {
  const { task, runId, runPath, cwd, executionPath, deferredReason } = params;
  const startedAt = new Date().toISOString();
  const steps: JobStepResult[] = (task.steps ?? []).map(({ id }) => ({
    id,
    status: "deferred",
    reason: deferredReason ?? "preceding step has not completed",
  }));
  recordJobSteps(runPath, steps);
  if (!deferredReason) {
    for (const [index, step] of (task.steps ?? []).entries()) {
      steps[index] = { id: step.id, status: "running", started_at: new Date().toISOString() };
      recordJobSteps(runPath, steps);
      let outcome: JobCommandResult;
      try {
        outcome = await executeJobCommand(
          step.command,
          cwd,
          step.timeout_seconds === undefined ? {} : { timeoutMs: step.timeout_seconds * 1000 },
        );
      } catch {
        steps[index] = {
          ...steps[index],
          status: "failed",
          completed_at: new Date().toISOString(),
          reason: "command execution threw",
        };
        recordJobSteps(runPath, steps);
        if (step.on_failure !== "continue") break;
        continue;
      }
      const verdict = outcome.timedOut
        ? {
            status: "deferred" as const,
            reason: `command exceeded ${step.timeout_seconds} seconds`,
          }
        : outcome.error
          ? { status: "failed" as const, reason: "command could not be executed" }
          : outcome.exitCode === 75
            ? {
                status: "deferred" as const,
                reason: "command exited 75 (temporary unavailability)",
              }
            : outcome.exitCode !== 0
              ? {
                  status: "failed" as const,
                  reason: `command exited ${outcome.exitCode ?? "by signal"}`,
                }
              : completionState(step, cwd);
      steps[index] = {
        id: step.id,
        ...verdict,
        started_at: outcome.startedAt,
        completed_at: outcome.completedAt,
        exit_code: outcome.exitCode,
      };
      recordJobSteps(runPath, steps);
      const evidence = recordCommandEvidence({
        repoRoot: cwd,
        worktreePath: cwd,
        executionPath,
        taskId: runId,
        runId,
        stepLabel: `attempt-${params.attempt}-${step.id}`,
        actor: "specdojo-runner",
        command: step.command,
        shell: process.platform === "win32" ? process.env.ComSpec || "cmd.exe" : "/bin/sh -eu",
        startedAt: outcome.startedAt,
        completedAt: outcome.completedAt,
        exitCode: outcome.exitCode,
        stdout: outcome.stdout,
        stderr: outcome.stderr,
        stdoutTruncated: outcome.stdoutTruncated,
        stderrTruncated: outcome.stderrTruncated,
        ...(outcome.error ? { error: outcome.error } : {}),
      });
      steps[index] = {
        id: step.id,
        ...verdict,
        started_at: outcome.startedAt,
        completed_at: outcome.completedAt,
        exit_code: outcome.exitCode,
        evidence_ref: relative(cwd, evidence.evidencePath).split(sep).join("/"),
      };
      recordJobSteps(runPath, steps);
      if (verdict.status !== "succeeded" && step.on_failure !== "continue") break;
    }
  }
  const failed = steps.some((step) => step.status === "failed");
  const deferred = steps.some((step) => step.status === "deferred");
  return {
    command: jobCommandText(task),
    startedAt,
    completedAt: new Date().toISOString(),
    exitCode: failed ? 1 : deferred ? 75 : 0,
    stdout: JSON.stringify({ steps }),
    stderr: "",
    stdoutTruncated: false,
    stderrTruncated: false,
    ...(failed || deferred
      ? { reason: deferredReason ?? "sequence contains failed or deferred steps" }
      : {}),
  };
}
