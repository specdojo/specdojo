import Ajv2020Module from "ajv/dist/2020.js";
import { join, relative, sep } from "node:path";
import { extractJsonText } from "./agent-response.js";
import type { ExecEvidence } from "./exec-evidence.js";
import {
  PARENT_VALIDATION_PROJECT_REPO,
  failedParentValidationReason,
} from "./exec-parent-validation.js";
import type { TaskMode } from "./exec-types.js";
import { REVIEW_VERDICTS, describeInvalidReviewVerdict, isReviewVerdict } from "./review-types.js";
import type { ReviewVerdict } from "./review-types.js";

const MAX_TEXT_LENGTH = 4_000;
const REPORTER_FORMAT_ATTEMPTS = 3;

export type EditReporterOutput = {
  schema_version: 1;
  mode: "edit";
  summary: string[];
  changed_files: Array<{ path: string; summary: string }>;
  handoff: string[];
  approach: string;
};

// review の verdict の正本は review-types.ts であり、verdict_definitions と同じ語彙を使う。
export { REVIEW_VERDICTS };
export type { ReviewVerdict };

// review は成果物を再評価しない。評価結果の確認、判断根拠、改善指示、verdict を記録する。
export type ReviewReporterOutput = {
  schema_version: 1;
  mode: "review";
  grade_check: string;
  rationale: string[];
  improvements: string[];
  approach: string;
  verdict: ReviewVerdict;
};

export type ReporterOutput = EditReporterOutput | ReviewReporterOutput;

export type ReporterFacts = {
  outcome: "complete" | "blocked";
  changed_files: Array<{ path: string; status: string }>;
  block_reason: string;
};

export type ReporterEvidenceScope = {
  /** Root of the primary project repository. */
  repoRoot: string;
  /** Root used when evidence change paths were collected. */
  worktreePath: string;
  /** Resolved project execution path in the primary repository. */
  executionPath: string;
  /** Result path in the evidence worktree. */
  resultPath?: string;
  /** Resolved project register and derived-view paths in the primary repository. */
  registerPaths?: readonly string[];
};

function repoRelativePath(root: string, path: string): string {
  return relative(root, path).split(sep).join("/").replace(/^\.\//u, "");
}

function pathIsWithin(path: string, root: string): boolean {
  return path === root || path.startsWith(`${root}/`);
}

function isRunnerManagedChangePath(path: string, scope: ReporterEvidenceScope): boolean {
  const normalized = path.replaceAll("\\", "/").replace(/^\.\//u, "");
  // exec/ 配下（evidence・plans・results・events・.locks など）はすべて runner の記録であり、
  // executor の成果物ではない。
  const execRoot = repoRelativePath(scope.repoRoot, join(scope.executionPath, "exec"));
  const managedRoots = [
    execRoot,
    ...(scope.registerPaths ?? []).map((path) => repoRelativePath(scope.repoRoot, path)),
  ];
  const resultPath = scope.resultPath
    ? repoRelativePath(scope.worktreePath, scope.resultPath)
    : undefined;
  return managedRoots.some((root) => pathIsWithin(normalized, root)) || normalized === resultPath;
}

function isRunnerManagedChange(
  change: ExecEvidence["changes"][number],
  scope: ReporterEvidenceScope,
): boolean {
  // A rename can contain two repository-relative paths. Exclude the entry only when every side
  // is runner-managed so a move between a managed location and a deliverable remains visible.
  return change.path.split(" -> ").every((path) => isRunnerManagedChangePath(path, scope));
}

/**
 * Builds the bounded evidence view used by the reporter and result renderer. Runner-owned
 * bookkeeping remains in the persisted evidence, but it is not presented as executor output.
 */
export function evidenceForReporter(
  evidence: ExecEvidence,
  scope: ReporterEvidenceScope,
): ExecEvidence {
  const changes = evidence.changes.filter((change) => !isRunnerManagedChange(change, scope));
  const attemptChanges = evidence.attempt_changes?.filter(
    (change) => !isRunnerManagedChange(change, scope),
  );
  const filtered =
    changes.length !== evidence.changes.length ||
    attemptChanges?.length !== evidence.attempt_changes?.length;
  if (!filtered) return evidence;

  return {
    ...evidence,
    changes,
    ...(attemptChanges ? { attempt_changes: attemptChanges } : {}),
    diff_summary: {
      files_changed: changes.length,
      summary: changes
        .map((change) => `${change.status} ${change.path}`)
        .join("\n")
        .slice(0, MAX_TEXT_LENGTH),
    },
  };
}

/**
 * Derives result facts only from runner-owned evidence. Reporter prose is deliberately absent
 * from this decision so an LLM cannot change paths or turn a failed run into a completed one.
 */
export function deriveReporterFacts(evidence: ExecEvidence): ReporterFacts {
  const changedFiles = evidence.changes.map(({ path, status }) => ({ path, status }));
  if (evidence.stage.status !== "succeeded" || evidence.stage.exit_code !== 0) {
    const blockReason =
      evidence.block_reason ||
      (evidence.stage.status === "rate_limited"
        ? "executor rate limit reached"
        : evidence.stage.exit_code === null
          ? "executor failed without an exit code"
          : evidence.stage.exit_code !== 0
            ? `executor exited with code ${evidence.stage.exit_code}`
            : "executor stage failed");
    return { outcome: "blocked", changed_files: changedFiles, block_reason: blockReason };
  }

  const validationFailure = failedParentValidationReason(evidence.validations);
  if (validationFailure) {
    return {
      outcome: "blocked",
      changed_files: changedFiles,
      block_reason: validationFailure,
    };
  }
  // sandbox で実行できない検証を executor が not_run（親 runner へ委譲）と記録し、runner が
  // 同じコマンドを project で実行して通した場合は満たされたものとして扱う。executor の failed は
  // runner の結果で打ち消さない。
  const runnerPassedCommands = new Set(
    evidence.validations
      .filter(
        (validation) =>
          validation.source === "runner" &&
          validation.status === "passed" &&
          (validation.repo === undefined || validation.repo === PARENT_VALIDATION_PROJECT_REPO),
      )
      .map((validation) => validation.command.trim()),
  );
  const executorValidationFailures = evidence.validations.filter(
    (validation) =>
      validation.source !== "runner" &&
      validation.status !== "passed" &&
      validation.status !== "requires_human" &&
      !(validation.status === "not_run" && runnerPassedCommands.has(validation.command.trim())),
  );
  if (executorValidationFailures.length > 0) {
    return {
      outcome: "blocked",
      changed_files: changedFiles,
      block_reason: `executor validation failed or not run: ${executorValidationFailures
        .map((validation) => validation.command)
        .join(", ")}`,
    };
  }
  return { outcome: "complete", changed_files: changedFiles, block_reason: "" };
}

export const REPORTER_OUTPUT_SCHEMA = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  oneOf: [
    {
      type: "object",
      additionalProperties: false,
      required: ["schema_version", "mode", "summary", "changed_files", "handoff", "approach"],
      properties: {
        schema_version: { const: 1 },
        mode: { const: "edit" },
        summary: { type: "array", minItems: 1, maxItems: 100, items: { $ref: "#/$defs/text" } },
        changed_files: {
          type: "array",
          maxItems: 1_000,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["path", "summary"],
            properties: {
              path: { $ref: "#/$defs/text" },
              summary: { $ref: "#/$defs/text" },
            },
          },
        },
        handoff: { type: "array", maxItems: 100, items: { $ref: "#/$defs/text" } },
        approach: { $ref: "#/$defs/text" },
      },
    },
    {
      type: "object",
      additionalProperties: false,
      required: [
        "schema_version",
        "mode",
        "grade_check",
        "rationale",
        "improvements",
        "approach",
        "verdict",
      ],
      properties: {
        schema_version: { const: 1 },
        mode: { const: "review" },
        grade_check: { $ref: "#/$defs/text" },
        rationale: { type: "array", minItems: 1, maxItems: 100, items: { $ref: "#/$defs/text" } },
        improvements: { type: "array", maxItems: 100, items: { $ref: "#/$defs/text" } },
        approach: { $ref: "#/$defs/text" },
        verdict: { enum: [...REVIEW_VERDICTS] },
      },
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

// oneOf の各分岐は `properties.mode.const` で mode を固定している。分岐の並び順に依存せず、
// mode から Ajv の schemaPath の接頭辞（`#/oneOf/<index>/`）を求める。
function reporterSchemaBranchPath(mode: TaskMode): string | undefined {
  const index = REPORTER_OUTPUT_SCHEMA.oneOf.findIndex(
    (branch) => branch.properties.mode.const === mode,
  );
  return index >= 0 ? `#/oneOf/${index}/` : undefined;
}

/** Returns the single-mode schema supplied to the selected reporter agent. */
export function reporterOutputSchemaForMode(mode: TaskMode): Record<string, unknown> {
  const branch = REPORTER_OUTPUT_SCHEMA.oneOf.find(
    (candidate) => candidate.properties.mode.const === mode,
  );
  if (!branch) throw new Error(`Reporter schema branch not found for mode: ${mode}`);
  return {
    $schema: REPORTER_OUTPUT_SCHEMA.$schema,
    ...branch,
    $defs: REPORTER_OUTPUT_SCHEMA.$defs,
  };
}

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
  if (!isText(value.approach)) return "approach must be a non-empty bounded string";
  return undefined;
}

function validateEdit(value: Record<string, unknown>): string | undefined {
  const keys = ["schema_version", "mode", "summary", "changed_files", "handoff", "approach"];
  if (!exactKeys(value, keys)) return "edit output has missing or additional properties";
  const common = validateCommon(value, "edit");
  if (common) return common;
  if (!isTextArray(value.summary, 100, 1)) return "summary must contain 1-100 bounded strings";
  if (!isTextArray(value.handoff, 100)) return "handoff must contain at most 100 bounded strings";
  if (!Array.isArray(value.changed_files) || value.changed_files.length > 1_000) {
    return "changed_files must be an array with at most 1000 items";
  }
  for (const file of value.changed_files) {
    if (!isRecord(file) || !exactKeys(file, ["path", "summary"])) {
      return "changed_files entries have missing or additional properties";
    }
    if (!isText(file.path)) return "changed_files path must be a non-empty bounded string";
    if (!isText(file.summary)) return "changed_files summary must be a non-empty bounded string";
  }
  return undefined;
}

// 改訂前の decision.recommendation（approve / revise / reject）と verdict_definitions の旧値は、
// review の verdict へ統一した（PJR-XTAN）。
function legacyReviewVocabularyError(value: Record<string, unknown>): string | undefined {
  if (Object.hasOwn(value, "recommendation")) {
    return `recommendation was replaced by verdict; ${describeInvalidReviewVerdict(value.recommendation)}`;
  }
  if (typeof value.verdict === "string" && !isReviewVerdict(value.verdict)) {
    return `verdict is invalid: ${describeInvalidReviewVerdict(value.verdict)}`;
  }
  return undefined;
}

function validateReview(value: Record<string, unknown>): string | undefined {
  const keys = [
    "schema_version",
    "mode",
    "grade_check",
    "rationale",
    "improvements",
    "approach",
    "verdict",
  ];
  if (!exactKeys(value, keys)) return "review output has missing or additional properties";
  const common = validateCommon(value, "review");
  if (common) return common;
  if (!isText(value.grade_check)) return "grade_check must be a non-empty bounded string";
  if (!isTextArray(value.rationale, 100, 1)) return "rationale must contain 1-100 bounded strings";
  if (!isTextArray(value.improvements, 100)) {
    return "improvements must contain at most 100 bounded strings";
  }
  if (!isReviewVerdict(value.verdict)) {
    return `verdict is invalid: ${describeInvalidReviewVerdict(value.verdict)}`;
  }
  return undefined;
}

export function parseReporterOutput(
  raw: string,
  mode: TaskMode,
): { output?: ReporterOutput; error?: string } {
  let value: unknown;
  try {
    value = JSON.parse(extractJsonText(raw));
  } catch (error) {
    return {
      error: `response is not a single JSON value: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
  if (!isRecord(value)) return { error: "response root must be an object" };
  // 旧語彙はスキーマの汎用エラーでは移行先が分からないため、スキーマ検証より先に移行先を示す。
  const legacyError = mode === "review" ? legacyReviewVocabularyError(value) : undefined;
  if (legacyError) return { error: legacyError };
  if (!validateReporterSchema(value)) {
    // スキーマは edit / review の oneOf なので、両方の分岐のエラーが混ざる。先頭だけを
    // 表示すると期待する mode と無関係な分岐のエラーで原因が隠れるため、mode の分岐に絞る。
    const errors = validateReporterSchema.errors ?? [];
    const modeBranch = reporterSchemaBranchPath(mode);
    const modeErrors = modeBranch
      ? errors.filter((error) => error.schemaPath.startsWith(modeBranch))
      : [];
    const details = (modeErrors.length > 0 ? modeErrors : errors)
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
  const reviewGuidance =
    opts.mode === "review"
      ? `\n\nFor review mode, the executor did not re-grade the deliverable; it judged task completion
from the stored grade result. Record that judgement in verdict and put unmet items and improvement
instructions in improvements.`
      : "";
  return `You are the reporter stage of a SpecDojo executor/reporter pipeline.
Use only the supplied plan and bounded executor evidence. Do not edit or inspect files. Do not
invent facts that are absent from evidence. Return exactly one JSON object matching the supplied
JSON Schema, without Markdown fences or commentary. The runner owns frontmatter, outcome,
block_reason, the authoritative changed-file list, and Markdown rendering. It derives those facts
mechanically from evidence; your response supplies prose associated with evidence paths.

The runner renders your free-text JSON fields as Markdown. Wrap every identifier or field name
containing an underscore in inline code (for example, \`depends_on\`) so Markdown parsers do not
misread it as emphasis.

The plan below was written as generic instructions for a single agent that both edits the
deliverable and records its own result. In this pipeline, those two responsibilities are split:
the executor already completed the deliverable edit and intentionally left the result file
untouched because the runner writes it from your prose and machine facts. For edit mode, identify
each changed_files summary with the exact path from its evidence.changes entry. The runner matches
descriptions by path: order does not matter, missing descriptions use a default message, and paths
absent from evidence are discarded. Do not include statuses. An empty changes list requires an
empty changed_files list. Validation entries with source="runner" were executed by the parent
process and remain authoritative machine facts. Do not turn them into outcome or block_reason
fields.${reviewGuidance}${correction}
<specdojo_plan>
${opts.plan.trimEnd()}
</specdojo_plan>

<specdojo_executor_evidence>
${JSON.stringify(opts.evidence, null, 2)}
</specdojo_executor_evidence>

<specdojo_reporter_output_schema mode="${opts.mode}">
${JSON.stringify(reporterOutputSchemaForMode(opts.mode), null, 2)}
</specdojo_reporter_output_schema>
`;
}

export type ReporterInvocation = (prompt: string) => Promise<{
  result: "success" | "failure" | "rate_limit";
  stdout: string;
  stderr: string;
}>;

export type ReporterInvocationOutput = {
  stdout: string;
  stderr: string;
};

export async function runReporterWithFormatRetry(opts: {
  plan: string;
  evidence: ExecEvidence;
  mode: TaskMode;
  invoke: ReporterInvocation;
  maxFormatAttempts?: number;
}): Promise<
  | { result: "success"; output: ReporterOutput; formatAttempts: number }
  | {
      result: "failure" | "rate_limit";
      reason: string;
      formatAttempts: number;
      invocationOutputs: ReporterInvocationOutput[];
    }
> {
  const maxAttempts = opts.maxFormatAttempts ?? REPORTER_FORMAT_ATTEMPTS;
  let validationError: string | undefined;
  const invocationOutputs: ReporterInvocationOutput[] = [];
  for (let formatAttempts = 1; formatAttempts <= maxAttempts; formatAttempts++) {
    const attempt = await opts.invoke(
      buildReporterPrompt({
        plan: opts.plan,
        evidence: opts.evidence,
        mode: opts.mode,
        ...(validationError ? { validationError } : {}),
      }),
    );
    invocationOutputs.push({ stdout: attempt.stdout, stderr: attempt.stderr });
    if (attempt.result !== "success") {
      return {
        result: attempt.result,
        reason: attempt.stderr.trim() || `reporter exited with ${attempt.result}`,
        formatAttempts,
        invocationOutputs,
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
    invocationOutputs,
  };
}
