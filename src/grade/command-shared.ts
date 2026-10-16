import { type Command } from "commander";
import type { GradeTarget, GradeVerdict } from "./core.js";

export function collectPathOption(value: string, previous: string[]): string[] {
  return [...previous, value];
}

export function requireTarget(value: string): GradeTarget {
  if (value !== "kata" && value !== "deliverable")
    throw new Error("--target must be kata or deliverable");
  return value;
}

export function requireGradeVerdict(value: string): GradeVerdict {
  if (value !== "pass" && value !== "needs-work" && value !== "fail") {
    throw new Error("--verdict must be pass, needs-work, or fail");
  }
  return value;
}

export function requireMaxFindings(value: string): number {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 0) {
    throw new Error("--max-findings must be a non-negative integer");
  }
  return parsed;
}

export function requireMinScore(value: string): number {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 0 || parsed > 100) {
    throw new Error("--min-score must be an integer between 0 and 100");
  }
  return parsed;
}

export function requirePositiveInteger(value: string): number {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new Error("value must be a positive integer");
  }
  return parsed;
}

export function requireNonNegativeInteger(value: string): number {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 0) {
    throw new Error("value must be a non-negative integer");
  }
  return parsed;
}

export function requirePipelineStatus(value: string): "passed" | "failed" | "complete" {
  if (value !== "passed" && value !== "failed" && value !== "complete") {
    throw new Error("--status must be passed, failed, or complete");
  }
  return value;
}

export function commandError(error: unknown): void {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}

export function addGradeSelectionOptions(command: Command): Command {
  return command
    .requiredOption("--target <target>", "kata or deliverable")
    .option("--project <projectId>", "Project id in specdojo.config.json")
    .option(
      "--path <path>",
      "Grade only this Markdown document (repeatable)",
      collectPathOption,
      [],
    )
    .option("--changed-only", "Select documents changed since their latest grade", false)
    .option(
      "--dependency-changed",
      "Select documents whose dependencies have been graded more recently",
      false,
    )
    .option(
      "--rulebook-changed",
      "Select documents whose declared rulebook has been graded more recently",
      false,
    )
    .option(
      "--unreviewed",
      "Select ungraded or changed documents that do not have a schedule task",
      false,
    )
    .option(
      "--verdict <verdict>",
      "Select documents with this latest verdict: pass, needs-work, or fail",
      requireGradeVerdict,
    )
    .option(
      "--min-score <score>",
      "Select graded documents with at least this score (0-100)",
      requireMinScore,
    )
    .option(
      "--max-findings <count>",
      "Select graded documents with at most this many findings",
      requireMaxFindings,
    )
    .option("--ungraded", "Select documents without a stored grade", false)
    .option("--incomplete", "Select documents with a retryable incomplete pipeline", false)
    .option(
      "--rubric-outdated",
      "Select graded documents whose stored result was not graded with the current rubric",
      false,
    );
}
