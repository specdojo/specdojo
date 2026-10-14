import Ajv2020Module from "ajv/dist/2020.js";
import { extractJsonText } from "./agent-response.js";
import type { TaskMode } from "./exec-types.js";
import { REVIEW_VERDICTS, describeInvalidReviewVerdict, isReviewVerdict } from "./review-types.js";
import type { ReviewVerdict } from "./review-types.js";

export const MAX_TEXT_LENGTH = 4_000;

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
