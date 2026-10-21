import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative, sep } from "node:path";
import { dump } from "../shared/yaml.js";
import { resolveSpecdojoPath } from "../docs/template-resolution.js";
import type {
  StoredGradeTarget,
  StoredGradeSeverity,
  StoredGradeVerdict,
  StoredGradeFinding,
  StoredGradeLevelCorrection,
  GradeResult,
} from "../shared/grade-result.js";
import {
  SEVERITIES,
  gradeContentHash,
  markdownDocumentId,
  resolveGradeResultsDirectory,
  gradeResultFileName,
  gradeResultPath,
  gradeResultPathForDocument,
  parseGradeResult,
  gradeFindingDisplayMessage,
  readGradeResult,
  readGradeResultForDocument,
  gradeFindingCount,
} from "../shared/grade-result.js";

export type {
  StoredGradeTarget,
  StoredGradeSeverity,
  StoredGradeVerdict,
  StoredGradeFinding,
  StoredGradeLevelCorrection,
  GradeResult,
};

export {
  SEVERITIES,
  gradeContentHash,
  markdownDocumentId,
  resolveGradeResultsDirectory,
  gradeResultFileName,
  gradeResultPath,
  gradeResultPathForDocument,
  parseGradeResult,
  gradeFindingDisplayMessage,
  readGradeResult,
  readGradeResultForDocument,
  gradeFindingCount,
};

const GRADE_RESULT_SCHEMA = "docs/specdojo/schemas/v1/grade-result.schema.yaml";

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
