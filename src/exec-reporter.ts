import Ajv2020Module from "ajv/dist/2020.js";
import type { ExecEvidence } from "./exec-evidence.js";
import type { TaskMode } from "./exec-types.js";

const MAX_TEXT_LENGTH = 4_000;
const MAX_ITEMS = 1_000;
const REPORTER_FORMAT_ATTEMPTS = 3;

type ReporterOutcome = "complete" | "blocked";

export type EditReporterOutput = {
  schema_version: 1;
  mode: "edit";
  outcome: ReporterOutcome;
  summary: string[];
  changed_files: Array<{ path: string; summary: string }>;
  handoff: string[];
  approach: string;
  block_reason: string;
};

export type ReviewReporterOutput = {
  schema_version: 1;
  mode: "review";
  outcome: ReporterOutcome;
  viewpoint_results: Array<{
    id: string;
    result: "pass" | "fail" | "unclear";
    evidence: string[];
    notes: string;
  }>;
  findings: string[];
  approach: string;
  recommendation: "approve" | "revise" | "reject";
  block_reason: string;
};

export type ReporterOutput = EditReporterOutput | ReviewReporterOutput;

export const REPORTER_OUTPUT_SCHEMA = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  oneOf: [
    {
      type: "object",
      additionalProperties: false,
      required: [
        "schema_version",
        "mode",
        "outcome",
        "summary",
        "changed_files",
        "handoff",
        "approach",
        "block_reason",
      ],
      properties: {
        schema_version: { const: 1 },
        mode: { const: "edit" },
        outcome: { enum: ["complete", "blocked"] },
        summary: { type: "array", minItems: 1, maxItems: 100, items: { $ref: "#/$defs/text" } },
        changed_files: {
          type: "array",
          maxItems: MAX_ITEMS,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["path", "summary"],
            properties: {
              path: { type: "string", minLength: 1, maxLength: 1_000 },
              summary: { $ref: "#/$defs/text" },
            },
          },
        },
        handoff: { type: "array", maxItems: 100, items: { $ref: "#/$defs/text" } },
        approach: { $ref: "#/$defs/text" },
        block_reason: { type: "string", maxLength: MAX_TEXT_LENGTH },
      },
      allOf: [
        {
          if: { properties: { outcome: { const: "blocked" } } },
          then: { properties: { block_reason: { type: "string", pattern: "\\S" } } },
          else: { properties: { block_reason: { type: "string", maxLength: 0 } } },
        },
      ],
    },
    {
      type: "object",
      additionalProperties: false,
      required: [
        "schema_version",
        "mode",
        "outcome",
        "viewpoint_results",
        "findings",
        "approach",
        "recommendation",
        "block_reason",
      ],
      properties: {
        schema_version: { const: 1 },
        mode: { const: "review" },
        outcome: { enum: ["complete", "blocked"] },
        viewpoint_results: {
          type: "array",
          maxItems: 100,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["id", "result", "evidence", "notes"],
            properties: {
              id: { type: "string", pattern: "^RVP-[0-9]{3}$" },
              result: { enum: ["pass", "fail", "unclear"] },
              evidence: {
                type: "array",
                minItems: 1,
                maxItems: 100,
                items: { $ref: "#/$defs/text" },
              },
              notes: { type: "string", maxLength: MAX_TEXT_LENGTH },
            },
          },
        },
        findings: { type: "array", maxItems: 100, items: { $ref: "#/$defs/text" } },
        approach: { $ref: "#/$defs/text" },
        recommendation: { enum: ["approve", "revise", "reject"] },
        block_reason: { type: "string", maxLength: MAX_TEXT_LENGTH },
      },
      allOf: [
        {
          if: { properties: { outcome: { const: "blocked" } } },
          then: { properties: { block_reason: { type: "string", pattern: "\\S" } } },
          else: { properties: { block_reason: { type: "string", maxLength: 0 } } },
        },
      ],
    },
  ],
  $defs: {
    text: { type: "string", minLength: 1, maxLength: MAX_TEXT_LENGTH },
  },
} as const;

const Ajv2020 = Ajv2020Module.default;
const validateReporterSchema = new Ajv2020({ allErrors: true, strict: true }).compile(
  REPORTER_OUTPUT_SCHEMA,
);

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function exactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
}

function isText(value: unknown, allowEmpty = false): value is string {
  return (
    typeof value === "string" &&
    value.length <= MAX_TEXT_LENGTH &&
    (allowEmpty || value.trim().length > 0)
  );
}

function isTextArray(value: unknown, maxItems = 100, minItems = 0): value is string[] {
  return (
    Array.isArray(value) &&
    value.length >= minItems &&
    value.length <= maxItems &&
    value.every((item) => isText(item))
  );
}

function validateCommon(value: Record<string, unknown>, mode: TaskMode): string | undefined {
  if (value.schema_version !== 1) return "schema_version must equal 1";
  if (value.mode !== mode) return `mode must equal ${mode}`;
  if (value.outcome !== "complete" && value.outcome !== "blocked") {
    return "outcome must be complete or blocked";
  }
  if (!isText(value.block_reason, true)) return "block_reason must be a bounded string";
  if (value.outcome === "blocked" && !String(value.block_reason).trim()) {
    return "block_reason is required when outcome is blocked";
  }
  if (value.outcome === "complete" && String(value.block_reason).length > 0) {
    return "block_reason must be empty when outcome is complete";
  }
  if (!isText(value.approach)) return "approach must be a non-empty bounded string";
  return undefined;
}

function validateEdit(value: Record<string, unknown>): string | undefined {
  const keys = [
    "schema_version",
    "mode",
    "outcome",
    "summary",
    "changed_files",
    "handoff",
    "approach",
    "block_reason",
  ];
  if (!exactKeys(value, keys)) return "edit output has missing or additional properties";
  const common = validateCommon(value, "edit");
  if (common) return common;
  if (!isTextArray(value.summary, 100, 1)) return "summary must contain 1-100 bounded strings";
  if (!isTextArray(value.handoff, 100)) return "handoff must contain at most 100 bounded strings";
  if (!Array.isArray(value.changed_files) || value.changed_files.length > MAX_ITEMS) {
    return "changed_files must be an array with at most 1000 items";
  }
  for (const file of value.changed_files) {
    if (!isRecord(file) || !exactKeys(file, ["path", "summary"])) {
      return "changed_files entries have missing or additional properties";
    }
    if (typeof file.path !== "string" || !file.path.trim() || file.path.length > 1_000) {
      return "changed_files path must be a non-empty bounded string";
    }
    if (!isText(file.summary)) return "changed_files summary must be a non-empty bounded string";
  }
  return undefined;
}

function validateReview(value: Record<string, unknown>): string | undefined {
  const keys = [
    "schema_version",
    "mode",
    "outcome",
    "viewpoint_results",
    "findings",
    "approach",
    "recommendation",
    "block_reason",
  ];
  if (!exactKeys(value, keys)) return "review output has missing or additional properties";
  const common = validateCommon(value, "review");
  if (common) return common;
  if (!isTextArray(value.findings, 100)) return "findings must contain at most 100 bounded strings";
  if (!Array.isArray(value.viewpoint_results) || value.viewpoint_results.length > 100) {
    return "viewpoint_results must be an array with at most 100 items";
  }
  const ids = new Set<string>();
  for (const viewpoint of value.viewpoint_results) {
    if (!isRecord(viewpoint) || !exactKeys(viewpoint, ["id", "result", "evidence", "notes"])) {
      return "viewpoint_results entries have missing or additional properties";
    }
    if (typeof viewpoint.id !== "string" || !/^RVP-[0-9]{3}$/.test(viewpoint.id)) {
      return "viewpoint id must match RVP-NNN";
    }
    if (ids.has(viewpoint.id)) return `duplicate viewpoint id: ${viewpoint.id}`;
    ids.add(viewpoint.id);
    if (
      viewpoint.result !== "pass" &&
      viewpoint.result !== "fail" &&
      viewpoint.result !== "unclear"
    ) {
      return "viewpoint result must be pass, fail, or unclear";
    }
    if (!isTextArray(viewpoint.evidence, 100, 1)) {
      return "viewpoint evidence must contain 1-100 bounded strings";
    }
    if (!isText(viewpoint.notes, true)) return "viewpoint notes must be a bounded string";
  }
  if (
    value.recommendation !== "approve" &&
    value.recommendation !== "revise" &&
    value.recommendation !== "reject"
  ) {
    return "recommendation must be approve, revise, or reject";
  }
  return undefined;
}

export function parseReporterOutput(
  raw: string,
  mode: TaskMode,
): { output?: ReporterOutput; error?: string } {
  let value: unknown;
  try {
    value = JSON.parse(raw.trim());
  } catch (error) {
    return {
      error: `response is not a single JSON value: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
  if (!isRecord(value)) return { error: "response root must be an object" };
  if (!validateReporterSchema(value)) {
    const details = (validateReporterSchema.errors ?? [])
      .slice(0, 5)
      .map(
        (error) =>
          `${error.instancePath || "/"} ${error.keyword}: ${error.message ?? "invalid value"}`,
      )
      .join("; ");
    return { error: `response does not match reporter JSON Schema: ${details}` };
  }
  const validationError = mode === "edit" ? validateEdit(value) : validateReview(value);
  return validationError
    ? { error: validationError }
    : { output: value as unknown as ReporterOutput };
}

export function buildReporterPrompt(opts: {
  plan: string;
  evidence: ExecEvidence;
  mode: TaskMode;
  validationError?: string;
}): string {
  const correction = opts.validationError
    ? `\nThe previous response failed validation: ${opts.validationError}\nReturn a corrected JSON value.\n`
    : "";
  return `You are the reporter stage of a SpecDojo executor/reporter pipeline.
Use only the supplied plan and bounded executor evidence. Do not edit or inspect files. Do not
invent facts that are absent from evidence. Return exactly one JSON object matching the supplied
JSON Schema, without Markdown fences or commentary. Use outcome=blocked when the evidence cannot
support a complete result. The runner owns frontmatter and Markdown rendering: it writes your JSON
response, verbatim, into the plan's result file.

The plan below was written as generic instructions for a single agent that both edits the
deliverable and records its own result. In this pipeline, those two responsibilities are split:
the executor already completed the deliverable edit and intentionally left the result file
untouched (its evidence may say so explicitly) because writing the result is your job, not its.
Your JSON response IS the act of recording the result — returning a well-formed response with
outcome="complete" satisfies the plan's "record to result" and "result must not remain unfilled"
instructions; you do not need file access to fulfill them. Do not treat the executor's evidence
noting an untouched result file as a reason to block. Reserve outcome=blocked for cases where the
evidence itself shows the deliverable work is incomplete, incorrect, unverifiable, or otherwise
falls short of the plan's completion criteria for the edit itself. Validation entries with
source="runner" were executed by the SpecDojo parent process from a fixed allowlist and are
authoritative. If any runner validation is failed or not_run, return outcome="blocked" and cite
that validation; never replace or contradict its status.${correction}
<specdojo_plan>
${opts.plan.trimEnd()}
</specdojo_plan>

<specdojo_executor_evidence>
${JSON.stringify(opts.evidence, null, 2)}
</specdojo_executor_evidence>

<specdojo_reporter_output_schema mode="${opts.mode}">
${JSON.stringify(REPORTER_OUTPUT_SCHEMA, null, 2)}
</specdojo_reporter_output_schema>
`;
}

export type ReporterInvocation = (prompt: string) => Promise<{
  result: "success" | "failure" | "rate_limit";
  stdout: string;
  stderr: string;
}>;

export async function runReporterWithFormatRetry(opts: {
  plan: string;
  evidence: ExecEvidence;
  mode: TaskMode;
  invoke: ReporterInvocation;
  maxFormatAttempts?: number;
}): Promise<
  | { result: "success"; output: ReporterOutput; formatAttempts: number }
  | { result: "failure" | "rate_limit"; reason: string; formatAttempts: number }
> {
  const maxAttempts = opts.maxFormatAttempts ?? REPORTER_FORMAT_ATTEMPTS;
  let validationError: string | undefined;
  for (let formatAttempts = 1; formatAttempts <= maxAttempts; formatAttempts++) {
    const attempt = await opts.invoke(
      buildReporterPrompt({
        plan: opts.plan,
        evidence: opts.evidence,
        mode: opts.mode,
        ...(validationError ? { validationError } : {}),
      }),
    );
    if (attempt.result !== "success") {
      return {
        result: attempt.result,
        reason: attempt.stderr.trim() || `reporter exited with ${attempt.result}`,
        formatAttempts,
      };
    }
    const parsed = parseReporterOutput(attempt.stdout, opts.mode);
    if (parsed.output) return { result: "success", output: parsed.output, formatAttempts };
    validationError = parsed.error ?? "unknown schema validation error";
  }
  return {
    result: "failure",
    reason: `reporter output invalid after ${maxAttempts} format attempts: ${validationError ?? "unknown validation error"}`,
    formatAttempts: maxAttempts,
  };
}
