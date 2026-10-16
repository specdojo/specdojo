import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { dump, load } from "./yaml.js";
import { getProjectExecutionPath, loadConfig, specdojoRootDir } from "./specdojo-config.js";
import { resolveSpecdojoPath } from "./docs/template-resolution.js";

export type StoredGradeTarget = "kata" | "deliverable";
export type StoredGradeSeverity = "blocker" | "major" | "minor" | "note";
export type StoredGradeVerdict = "pass" | "needs-work" | "fail";

export type StoredGradeFinding = {
  id: string;
  severity: StoredGradeSeverity;
  rule: string;
  line: number;
  anchor: string;
  /** Canonical executor wording used for carry-over matching. */
  message: string;
  /** Japanese display wording. Omitted by legacy results. */
  message_ja?: string;
};

export type StoredGradeLevelCorrection = {
  viewpoint: string;
  original_level: number;
  corrected_level: number;
};

export type GradeResult = {
  version: 1;
  document: string;
  path: string;
  target: StoredGradeTarget;
  rubric: string;
  reference?: string;
  verdict: StoredGradeVerdict;
  score: number;
  graded_at: string;
  graded_by: string;
  content_hash: string;
  /** Hashes of the comparison sources and dependencies the grade depended on, keyed by source. */
  source_hashes?: Record<string, string>;
  categories: Record<string, { score: number }>;
  viewpoints: Record<string, { level: number; score: number }>;
  finding_counts: Record<StoredGradeSeverity, number>;
  findings: StoredGradeFinding[];
  level_corrections?: StoredGradeLevelCorrection[];
  done_criteria?: Record<string, unknown>;
};

const GRADE_RESULT_SCHEMA = "docs/specdojo/schemas/v1/grade-result.schema.yaml";
const DOCUMENT_ID_RE = /^[a-z0-9][a-z0-9-:]*$/;
const SEVERITIES: readonly StoredGradeSeverity[] = ["blocker", "major", "minor", "note"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function gradeContentHash(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

export function markdownDocumentId(content: string, path: string): string {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error(`${path}: Markdown frontmatter is required`);
  const parsed = load(match[1]);
  const specdojo = isRecord(parsed) && isRecord(parsed.specdojo) ? parsed.specdojo : undefined;
  const id = specdojo?.id;
  if (typeof id !== "string" || !DOCUMENT_ID_RE.test(id)) {
    throw new Error(`${path}: specdojo.id is required to store a grade result`);
  }
  return id;
}

export function resolveGradeResultsDirectory(
  projectOption?: string,
  rootDir = specdojoRootDir(),
): string {
  const { config } = loadConfig();
  if (!config) throw new Error("grade commands require .specdojo/specdojo.config.json");
  const projectId =
    projectOption?.trim() || config.current_project || Object.keys(config.projects)[0] || "";
  const project = config.projects[projectId];
  if (!project) throw new Error(`Unknown project: ${projectId}`);
  return resolve(rootDir, getProjectExecutionPath(project), "grade", "results");
}

// ファイル名では名前空間区切りの ":" を "." に置き換える（Windows で ":" は使えない）。
// DOCUMENT_ID_RE は "." を許さないため、置換後も元の id と一対一に対応する。
export function gradeResultFileName(documentId: string): string {
  if (!DOCUMENT_ID_RE.test(documentId)) {
    throw new Error(`Invalid grade result document id: ${documentId}`);
  }
  return `${documentId.replace(/:/g, ".")}.yaml`;
}

export function gradeResultPath(resultsDirectory: string, documentId: string): string {
  return join(resultsDirectory, gradeResultFileName(documentId));
}

export function gradeResultPathForDocument(opts: {
  documentPath: string;
  project?: string;
  rootDir?: string;
}): string {
  const rootDir = opts.rootDir ?? specdojoRootDir();
  const absolute = resolve(rootDir, opts.documentPath);
  const content = readFileSync(absolute, "utf8");
  return gradeResultPath(
    resolveGradeResultsDirectory(opts.project, rootDir),
    markdownDocumentId(content, opts.documentPath),
  );
}

export function parseGradeResult(content: string, path: string): GradeResult {
  const parsed = load(content);
  if (!isRecord(parsed)) throw new Error(`${path}: grade result must be a mapping`);
  const result = parsed as Partial<GradeResult>;
  if (
    result.version !== 1 ||
    typeof result.document !== "string" ||
    typeof result.path !== "string" ||
    (result.target !== "kata" && result.target !== "deliverable") ||
    typeof result.rubric !== "string" ||
    (result.verdict !== "pass" && result.verdict !== "needs-work" && result.verdict !== "fail") ||
    !Number.isSafeInteger(result.score) ||
    typeof result.graded_at !== "string" ||
    typeof result.graded_by !== "string" ||
    typeof result.content_hash !== "string" ||
    !isRecord(result.categories) ||
    !isRecord(result.viewpoints) ||
    !isRecord(result.finding_counts) ||
    !Array.isArray(result.findings)
  ) {
    throw new Error(`${path}: invalid grade result`);
  }
  if (
    result.source_hashes !== undefined &&
    (!isRecord(result.source_hashes) ||
      Object.values(result.source_hashes).some(
        (hash) => typeof hash !== "string" || !/^[a-f0-9]{64}$/.test(hash),
      ))
  ) {
    throw new Error(`${path}: source_hashes must map sources to SHA-256 hex digests`);
  }
  return result as GradeResult;
}

export function readGradeResult(path: string): GradeResult | undefined {
  if (!existsSync(path)) return undefined;
  return parseGradeResult(readFileSync(path, "utf8"), path);
}

export function readGradeResultForDocument(opts: {
  documentPath: string;
  project?: string;
  rootDir?: string;
}): GradeResult | undefined {
  return readGradeResult(gradeResultPathForDocument(opts));
}

export function renderGradeResult(result: GradeResult, path: string): string {
  const schemaRef = relative(dirname(path), resolveSpecdojoPath(GRADE_RESULT_SCHEMA))
    .split(sep)
    .join("/");
  return `# yaml-language-server: $schema=${schemaRef}\n${dump(result, {
    lineWidth: 120,
    noRefs: true,
    quoteStyle: "double",
  })}`;
}

export function writeGradeResult(path: string, result: GradeResult, dryRun = false): boolean {
  const rendered = renderGradeResult(result, path);
  if (existsSync(path) && readFileSync(path, "utf8") === rendered) return false;
  if (!dryRun) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, rendered, "utf8");
  }
  return true;
}

export function gradeFindingCount(result: GradeResult): number {
  return SEVERITIES.reduce((sum, severity) => sum + result.finding_counts[severity], 0);
}

export function gradeFindingDisplayMessage(finding: StoredGradeFinding): string {
  return finding.message_ja?.trim() || finding.message;
}

function isJapaneseFindingMessage(message: string): boolean {
  // 英語の finding は対象文書の日本語を inline code で引用できるため、その引用は
  // 言語判定から外す。引用以外に仮名がある文、または漢字だけの短文を日本語と扱う。
  const prose = message.replace(/`[^`]*`/gu, "");
  if (/[\p{Script=Hiragana}\p{Script=Katakana}]/u.test(prose)) return true;
  return /\p{Script=Han}/u.test(prose) && !/[A-Za-z]/u.test(prose);
}

function translatableGradeFindings(result: GradeResult): Array<{
  finding: StoredGradeFinding;
  findingIndex: number;
}> {
  return result.findings
    .map((finding, findingIndex) => ({ finding, findingIndex }))
    .filter(({ finding }) => !isJapaneseFindingMessage(finding.message));
}

function selectTranslationTargets(
  result: GradeResult,
  translationIndex?: number,
): Array<{ finding: StoredGradeFinding; findingIndex: number; translationIndex: number }> {
  const targets = translatableGradeFindings(result).map((target, index) => ({
    ...target,
    translationIndex: index,
  }));
  if (translationIndex === undefined) return targets;
  const selected = targets[translationIndex];
  if (!selected) {
    throw new Error(
      `translation index out of range: index=${translationIndex}, count=${targets.length}`,
    );
  }
  return [selected];
}

export function gradeFindingTranslationInput(
  result: GradeResult,
  translationIndex?: number,
): string[] {
  return selectTranslationTargets(result, translationIndex).map(({ finding }) => finding.message);
}

export type GradeFindingTranslationRejection = {
  translation_index: number;
  finding_id: string;
  reason:
    | "invalid-output"
    | "count-mismatch"
    | "not-string"
    | "empty"
    | "missing-kana"
    | "missing-inline-code"
    | "extra-inline-code";
  detail?: string;
};

export type GradeFindingTranslationResult = {
  result: GradeResult;
  accepted: boolean;
  reason?: string;
  rejections: GradeFindingTranslationRejection[];
};

export function applyGradeFindingTranslations(
  result: GradeResult,
  translations: unknown,
  translationIndex?: number,
): GradeFindingTranslationResult {
  const targets = selectTranslationTargets(result, translationIndex);
  const targetFindingIndexes = new Set(targets.map(({ findingIndex }) => findingIndex));
  const localizedFindings = result.findings.map((finding, findingIndex) => {
    if (translationIndex === undefined || targetFindingIndexes.has(findingIndex)) {
      return { ...finding, message_ja: finding.message };
    }
    return { ...finding };
  });
  const fallback = (): GradeResult => ({ ...result, findings: localizedFindings });
  const rejectAll = (
    reason: GradeFindingTranslationRejection["reason"],
    detail?: string,
  ): GradeFindingTranslationRejection[] =>
    targets.map(({ finding, translationIndex: index }) => ({
      translation_index: index,
      finding_id: finding.id,
      reason,
      ...(detail ? { detail } : {}),
    }));
  if (!Array.isArray(translations)) {
    return {
      result: fallback(),
      accepted: false,
      reason: "translation output must be a string array",
      rejections: rejectAll("invalid-output", "translation output must be a string array"),
    };
  }
  if (translations.length !== targets.length) {
    const reason = `translation count mismatch: expected=${targets.length}, actual=${translations.length}`;
    return {
      result: fallback(),
      accepted: false,
      reason,
      rejections: rejectAll("count-mismatch", reason),
    };
  }

  const rejections: GradeFindingTranslationRejection[] = [];
  for (const [arrayIndex, value] of translations.entries()) {
    const target = targets[arrayIndex];
    let reason: GradeFindingTranslationRejection["reason"] | undefined;
    let detail: string | undefined;
    if (typeof value !== "string") {
      reason = "not-string";
    } else if (!value.trim()) {
      reason = "empty";
    } else if (!/[\p{Script=Hiragana}\p{Script=Katakana}]/u.test(value)) {
      reason = "missing-kana";
    } else {
      const sourceInlineCode = target.finding.message.match(/`[^`\r\n]*`/gu) ?? [];
      const translatedInlineCode = value.match(/`[^`\r\n]*`/gu) ?? [];
      const unmatchedTranslatedInlineCode = [...translatedInlineCode];
      const missingInlineCode = sourceInlineCode.find((code) => {
        const matchedIndex = unmatchedTranslatedInlineCode.indexOf(code);
        if (matchedIndex === -1) return true;
        unmatchedTranslatedInlineCode.splice(matchedIndex, 1);
        return false;
      });
      if (missingInlineCode) {
        reason = "missing-inline-code";
        detail = missingInlineCode;
      } else if (unmatchedTranslatedInlineCode.length > 0) {
        reason = "extra-inline-code";
        detail = unmatchedTranslatedInlineCode[0];
      }
    }
    if (reason) {
      rejections.push({
        translation_index: target.translationIndex,
        finding_id: target.finding.id,
        reason,
        ...(detail ? { detail } : {}),
      });
    } else {
      localizedFindings[target.findingIndex] = {
        ...localizedFindings[target.findingIndex],
        message_ja: (value as string).trim(),
      };
    }
  }

  return {
    accepted: rejections.length === 0,
    ...(rejections.length > 0
      ? { reason: `rejected ${rejections.length} of ${targets.length} translations` }
      : {}),
    rejections,
    result: { ...result, findings: localizedFindings },
  };
}

export function validateGradeResult(
  result: GradeResult,
  documentContent: string,
  documentPath: string,
  expectedTarget?: StoredGradeTarget,
): string[] {
  const errors: string[] = [];
  let documentId: string | undefined;
  try {
    documentId = markdownDocumentId(documentContent, documentPath);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  }
  if (documentId && result.document !== documentId) {
    errors.push(
      `${documentPath}: grade result document=${result.document}, expected=${documentId}`,
    );
  }
  if (result.path !== documentPath.replace(/\\/g, "/")) {
    errors.push(`${documentPath}: grade result path=${result.path}`);
  }
  if (expectedTarget && result.target !== expectedTarget) {
    errors.push(
      `${documentPath}: grade result target=${result.target}, expected=${expectedTarget}`,
    );
  }
  if (result.content_hash !== gradeContentHash(documentContent)) {
    errors.push(`${documentPath}: content changed after the last grade`);
  }
  for (const severity of SEVERITIES) {
    const count = result.findings.filter((finding) => finding.severity === severity).length;
    if (result.finding_counts[severity] !== count) {
      errors.push(
        `${documentPath}: finding_counts.${severity}=${String(result.finding_counts[severity])}, findings=${count}`,
      );
    }
  }
  return errors;
}
