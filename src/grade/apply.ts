import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { dump } from "../yaml.js";
import { extractJsonText } from "../agent-response.js";
import {
  CRITERION_ID_RE,
  CRITERION_STATUSES,
  DONE_CRITERIA_SCHEMA,
  SEVERITY_LEVEL_CAP,
  agentViewpoints,
  correctViewpointLevels,
  isRecord,
  levelCapForFindings,
  parseMarkdown,
  preserveStoredFindingSeverities,
  sanitizeCommentText,
  type GradeCriterionInput,
  type GradeCriterionStatus,
  type GradeDoneCriteriaDetail,
  type GradeDoneCriterion,
  type GradeExecutorAnalysis,
  type GradeFindingInput,
  type GradeSeverity,
  type GradeSubmission,
  type GradeTarget,
  type GradeValidationIssue,
  type GradeViewpointInput,
} from "./core.js";
import { applicableDoneCriteria, deterministicResults, gradePlanFilename } from "./plan.js";
import {
  gradeContentHash,
  gradeResultPath,
  markdownDocumentId,
  readGradeResult,
  writeGradeResult,
  type GradeResult,
  type StoredGradeFinding,
} from "./result.js";
import {
  gradeMarkdownDocument,
  resolveGradeReferenceId,
  scoreDocument,
  summarizeDoneCriteria,
} from "./markdown.js";
import {
  assertRubric,
  createGradeSourceContext,
  gradeSourceHashes,
  repoRelativePath,
  resolveSafeMarkdownPath,
  resolveSafeRepositoryPath,
} from "./targets.js";
import type { ReviewViewpointsDoc } from "../review/types.js";
import { specdojoRootDir } from "../specdojo-config.js";
import { resolveSpecdojoPath } from "../docs/template-resolution.js";

export function normalizeGradeExecutorLine(line: string): string {
  let normalized = line.replace(/^\s*(?:>\s*)*(?:[-*+]\s+)?/, "");
  const wrappedMarker = normalized.match(
    /^\*\*(\[(?:END )?(?:VIEWPOINT[^\]]*|DONE_CRITERIA)\])\*\*\s*$/,
  );
  if (wrappedMarker) return wrappedMarker[1];
  const wrappedLevel = normalized.match(/^\*\*(LEVEL:\s*[0-4])\*\*\s*$/);
  if (wrappedLevel) return wrappedLevel[1];
  normalized = normalized.replace(
    /^\*\*(LEVEL|FINDING(?:\s+[a-z]+)?(?:\s+line=[0-9]+)?|DC-[0-9]{3,})(:?)\*\*(:?)/,
    (_match, head: string, innerColon: string, outerColon: string) =>
      `${head}${innerColon}${outerColon}`,
  );
  return normalized;
}

export function parseGradeExecutorAnalysis(raw: string): GradeExecutorAnalysis {
  const viewpoints: GradeViewpointInput[] = [];
  let doneCriteria: GradeCriterionInput[] | undefined;
  let inDoneCriteria = false;
  let current:
    | {
        id: string;
        level?: number;
        findings: GradeFindingInput[];
      }
    | undefined;

  for (const [lineIndex, rawLine] of raw.split(/\r?\n/).entries()) {
    const line = normalizeGradeExecutorLine(rawLine);
    if (/^\[DONE_CRITERIA\]\s*$/.test(line)) {
      if (current) throw new Error(`line ${lineIndex + 1}: DONE_CRITERIA inside VIEWPOINT`);
      if (doneCriteria !== undefined) {
        throw new Error(`line ${lineIndex + 1}: duplicate DONE_CRITERIA block`);
      }
      doneCriteria = [];
      inDoneCriteria = true;
      continue;
    }
    if (/^\[END DONE_CRITERIA\]\s*$/.test(line)) {
      if (!inDoneCriteria) {
        throw new Error(`line ${lineIndex + 1}: unexpected END DONE_CRITERIA marker`);
      }
      inDoneCriteria = false;
      continue;
    }
    if (inDoneCriteria) {
      if (line.trim() === "") continue;
      const criterion = line.match(
        /^(DC-[0-9]{3,}):\s*(satisfied|unsatisfied)(?:\s*[:：]\s*(\S.*?))?\s*$/,
      );
      if (!criterion) {
        throw new Error(`line ${lineIndex + 1}: malformed DONE_CRITERIA entry`);
      }
      doneCriteria!.push({
        id: criterion[1],
        status: criterion[2] as GradeCriterionStatus,
        ...(criterion[3] ? { reason: criterion[3].trim() } : {}),
      });
      continue;
    }
    const start = line.match(/^\[VIEWPOINT ([A-Za-z0-9][A-Za-z0-9._-]*)\]\s*$/);
    if (start) {
      if (current) {
        throw new Error(`line ${lineIndex + 1}: nested VIEWPOINT marker`);
      }
      current = { id: start[1], findings: [] };
      continue;
    }
    if (/^\[END VIEWPOINT\]\s*$/.test(line)) {
      if (!current) throw new Error(`line ${lineIndex + 1}: unexpected END VIEWPOINT marker`);
      if (current.level === undefined) {
        throw new Error(`viewpoint ${current.id}: LEVEL is required`);
      }
      viewpoints.push({ id: current.id, level: current.level, findings: current.findings });
      current = undefined;
      continue;
    }
    if (!current) continue;

    const level = line.match(/^LEVEL:\s*([0-4])\s*$/);
    if (level) {
      if (current.level !== undefined) {
        throw new Error(`line ${lineIndex + 1}: duplicate LEVEL for ${current.id}`);
      }
      current.level = Number(level[1]);
      continue;
    }
    if (/^LEVEL\s*:/.test(line)) {
      throw new Error(`line ${lineIndex + 1}: malformed LEVEL for ${current.id}`);
    }
    const finding = line.match(
      /^FINDING\s+(blocker|major|minor|note)(?:\s+line=([1-9][0-9]*))?:\s*(\S.*)\s*$/,
    );
    if (finding) {
      current.findings.push({
        severity: finding[1] as GradeSeverity,
        ...(finding[2] ? { line: Number(finding[2]) } : {}),
        message: finding[3].trim(),
      });
      continue;
    }
    if (/^FINDING(?:\s|:)/.test(line)) {
      throw new Error(`line ${lineIndex + 1}: malformed FINDING for ${current.id}`);
    }
  }

  if (current) throw new Error(`viewpoint ${current.id}: END VIEWPOINT marker is required`);
  if (inDoneCriteria) throw new Error("END DONE_CRITERIA marker is required");
  if (viewpoints.length === 0) throw new Error("No VIEWPOINT markers found in executor analysis");
  return { viewpoints, ...(doneCriteria !== undefined ? { doneCriteria } : {}) };
}

function normalizeFindingMessageForFidelity(message: string): string {
  return message
    .normalize("NFC")
    .replace(/[、，]/gu, ",")
    .replace(/[。．]/gu, ".")
    .replace(/！/gu, "!")
    .replace(/？/gu, "?")
    .replace(/：/gu, ":")
    .replace(/；/gu, ";")
    .replace(/\s+/gu, " ")
    .trim()
    .replace(/\s*([,.;:!?])\s*/gu, "$1");
}

function findingFidelityKey(finding: GradeFindingInput): string {
  return JSON.stringify({
    severity: finding.severity,
    line: finding.line ?? null,
    message: normalizeFindingMessageForFidelity(finding.message),
  });
}

function unmatchedFindings(
  declared: readonly GradeFindingInput[],
  reported: readonly GradeFindingInput[],
): { declared: GradeFindingInput[]; reported: GradeFindingInput[] } {
  const remainingReported = reported.map((finding) => ({
    finding,
    matched: false,
  }));
  const unmatchedDeclared: GradeFindingInput[] = [];
  for (const finding of declared) {
    const key = findingFidelityKey(finding);
    const match = remainingReported.find(
      (candidate) => !candidate.matched && findingFidelityKey(candidate.finding) === key,
    );
    if (match) match.matched = true;
    else unmatchedDeclared.push(finding);
  }
  return {
    declared: unmatchedDeclared,
    reported: remainingReported
      .filter((candidate) => !candidate.matched)
      .map((candidate) => candidate.finding),
  };
}

function findingDifferenceMessage(
  declared: GradeFindingInput,
  reported: GradeFindingInput,
): string {
  const differences: string[] = [];
  if (declared.severity !== reported.severity) {
    differences.push(`severity executor=${declared.severity} reporter=${reported.severity}`);
  }
  if (declared.line !== reported.line) {
    differences.push(
      `line executor=${declared.line ?? "none"} reporter=${reported.line ?? "none"}`,
    );
  }
  if (
    normalizeFindingMessageForFidelity(declared.message) !==
    normalizeFindingMessageForFidelity(reported.message)
  ) {
    differences.push(
      `message executor=${JSON.stringify(declared.message)} reporter=${JSON.stringify(reported.message)}`,
    );
  }
  return differences.join("; ");
}

function findingSimilarity(declared: GradeFindingInput, reported: GradeFindingInput): number {
  return (
    Number(declared.severity === reported.severity) +
    Number(declared.line === reported.line) +
    Number(
      normalizeFindingMessageForFidelity(declared.message) ===
        normalizeFindingMessageForFidelity(reported.message),
    )
  );
}

function doneCriteriaFidelityIssues(
  declared: readonly GradeCriterionInput[] | undefined,
  reported: readonly GradeCriterionInput[] | undefined,
): GradeValidationIssue[] {
  const issues: GradeValidationIssue[] = [];
  const where = "documents[0].done_criteria";
  if (declared === undefined && reported === undefined) return issues;
  if (declared === undefined) {
    issues.push({ path: where, message: "reporter added done_criteria not declared by executor" });
    return issues;
  }
  const reportedById = new Map((reported ?? []).map((criterion) => [criterion.id, criterion]));
  for (const criterion of declared) {
    const match = reportedById.get(criterion.id);
    if (!match) {
      issues.push({ path: where, message: `reporter omitted executor criterion: ${criterion.id}` });
      continue;
    }
    reportedById.delete(criterion.id);
    if (match.status !== criterion.status) {
      issues.push({
        path: `${where}.${criterion.id}`,
        message: `reporter status ${match.status} differs from executor status ${criterion.status}`,
      });
    }
    if (
      normalizeFindingMessageForFidelity(criterion.reason ?? "") !==
      normalizeFindingMessageForFidelity(match.reason ?? "")
    ) {
      issues.push({
        path: `${where}.${criterion.id}`,
        message: `reporter changed executor reason: executor=${JSON.stringify(criterion.reason ?? "")} reporter=${JSON.stringify(match.reason ?? "")}`,
      });
    }
  }
  for (const id of reportedById.keys()) {
    issues.push({
      path: where,
      message: `reporter added criterion not declared by executor: ${id}`,
    });
  }
  return issues;
}

export type GradeExecutorConversionOptions = {
  executorOutput: string;
  viewpoints: ReviewViewpointsDoc;
  target: GradeTarget;
  expectedPath: string;
  doneCriteria?: GradeDoneCriterion[];
};

type GradeExecutorConversion =
  | { analysis: GradeExecutorAnalysis; submission: GradeSubmission; issues: [] }
  | { analysis?: undefined; submission?: undefined; issues: GradeValidationIssue[] };

// executor の marker を parse し、GradeSubmission へ機械的に変換したうえで既存の
// GradeSubmission 検証にかける。severity が定める上限より level が高い場合は、判定を甘くしない
// 方向へ level だけを補正し、補正前後を submission に残す。それ以外の marker 契約違反と
// done_criteria の過不足は拒否する。
function convertGradeExecutorOutput(opts: GradeExecutorConversionOptions): GradeExecutorConversion {
  let analysis: GradeExecutorAnalysis;
  try {
    analysis = parseGradeExecutorAnalysis(opts.executorOutput);
  } catch (error) {
    return {
      issues: [
        {
          path: "$analysis",
          message: error instanceof Error ? error.message : String(error),
        },
      ],
    };
  }

  const rubric = assertRubric(opts.viewpoints);
  const corrected = correctViewpointLevels(analysis.viewpoints);
  const submission: GradeSubmission = {
    rubric: rubric.id,
    documents: [
      {
        path: opts.expectedPath,
        viewpoints: corrected.viewpoints,
        ...(corrected.corrections.length > 0 ? { level_corrections: corrected.corrections } : {}),
        ...(analysis.doneCriteria ? { done_criteria: analysis.doneCriteria } : {}),
      },
    ],
  };
  const issues = validateGradeSubmission(
    submission,
    opts.viewpoints,
    opts.target,
    opts.doneCriteria
      ? { doneCriteriaByPath: new Map([[opts.expectedPath, opts.doneCriteria]]) }
      : {},
  ).map((issue) => ({ path: `$analysis.${issue.path}`, message: issue.message }));
  if (issues.length > 0) return { issues };
  return { analysis, submission, issues: [] };
}

// executor の分析から GradeSubmission を生成する。LLM の reporter を通さずに grade を記録する
// 既定の経路で使う。拒否時は issues を返し、呼び出し側は executor を再実行する。
export function buildGradeSubmissionFromAnalysis(opts: GradeExecutorConversionOptions): {
  submission?: GradeSubmission;
  issues: GradeValidationIssue[];
} {
  const conversion = convertGradeExecutorOutput(opts);
  if (conversion.submission === undefined) return { issues: conversion.issues };
  return { submission: conversion.submission, issues: [] };
}

export function validateGradeReporterFidelity(opts: {
  executorOutput: string;
  submission: GradeSubmission;
  viewpoints: ReviewViewpointsDoc;
  target: GradeTarget;
  expectedPath: string;
  doneCriteria?: GradeDoneCriterion[];
}): GradeValidationIssue[] {
  const conversion = convertGradeExecutorOutput(opts);
  if (conversion.analysis === undefined) return conversion.issues;
  const analysis = conversion.analysis;

  if (opts.submission.documents.length !== 1) {
    return [
      { path: "documents", message: "reporter submission must contain exactly one document" },
    ];
  }
  const document = opts.submission.documents[0];
  if (document.path !== opts.expectedPath) {
    return [
      {
        path: "documents[0].path",
        message: `reporter path must remain ${opts.expectedPath}`,
      },
    ];
  }

  const issues: GradeValidationIssue[] = [];
  const reportedById = new Map(document.viewpoints.map((viewpoint) => [viewpoint.id, viewpoint]));
  for (const declared of analysis.viewpoints) {
    const reported = reportedById.get(declared.id);
    if (!reported) {
      issues.push({
        path: `documents[0].viewpoints`,
        message: `reporter omitted executor viewpoint: ${declared.id}`,
      });
      continue;
    }
    if (reported.level !== declared.level) {
      issues.push({
        path: `documents[0].viewpoints.${declared.id}.level`,
        message: `reporter level ${reported.level} differs from executor level ${declared.level}`,
      });
    }
    const unmatched = unmatchedFindings(declared.findings ?? [], reported.findings ?? []);
    while (unmatched.declared.length > 0 && unmatched.reported.length > 0) {
      const executorFinding = unmatched.declared.shift()!;
      let bestIndex = 0;
      for (let index = 1; index < unmatched.reported.length; index += 1) {
        if (
          findingSimilarity(executorFinding, unmatched.reported[index]) >
          findingSimilarity(executorFinding, unmatched.reported[bestIndex])
        ) {
          bestIndex = index;
        }
      }
      const reporterFinding = unmatched.reported.splice(bestIndex, 1)[0];
      issues.push({
        path: `documents[0].viewpoints.${declared.id}.findings`,
        message: `reporter changed executor finding: ${findingDifferenceMessage(executorFinding, reporterFinding)}`,
      });
    }
    for (const finding of unmatched.declared) {
      issues.push({
        path: `documents[0].viewpoints.${declared.id}.findings`,
        message: `reporter omitted executor finding: ${JSON.stringify(finding)}`,
      });
    }
    for (const finding of unmatched.reported) {
      issues.push({
        path: `documents[0].viewpoints.${declared.id}.findings`,
        message: `reporter added finding not declared by executor: ${JSON.stringify(finding)}`,
      });
    }
  }
  issues.push(...doneCriteriaFidelityIssues(analysis.doneCriteria, document.done_criteria));
  return issues;
}

export function parseGradeSubmission(raw: string): GradeSubmission {
  let value: unknown;
  try {
    value = JSON.parse(extractJsonText(raw));
  } catch (error) {
    throw new Error(
      `Grade submission must be JSON: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  if (
    !isRecord(value) ||
    typeof value.rubric !== "string" ||
    (value.graded_by !== undefined && typeof value.graded_by !== "string") ||
    !Array.isArray(value.documents)
  ) {
    throw new Error("Grade submission requires rubric and documents[]");
  }
  return value as GradeSubmission;
}

export type GradeSubmissionValidationOptions = {
  // リポジトリ相対パスをキーにした done_criteria 定義。指定した文書は列挙された条件 ID を
  // 過不足なく申告しなければならない。未指定の文書は書式だけを検証する。
  doneCriteriaByPath?: ReadonlyMap<string, GradeDoneCriterion[]>;
};

function validateDoneCriteriaInput(opts: {
  where: string;
  target: GradeTarget;
  value: unknown;
  expected?: GradeDoneCriterion[];
}): GradeValidationIssue[] {
  const issues: GradeValidationIssue[] = [];
  const { where, value, expected } = opts;
  if (value === undefined) {
    if (expected && expected.length > 0) {
      issues.push({ path: where, message: "done_criteria[] is required for this deliverable" });
    }
    return issues;
  }
  if (!Array.isArray(value)) {
    issues.push({ path: `${where}.done_criteria`, message: "done_criteria must be an array" });
    return issues;
  }
  if (opts.target !== "deliverable") {
    issues.push({
      path: `${where}.done_criteria`,
      message: "done_criteria is accepted only for deliverable targets",
    });
    return issues;
  }
  const expectedIds = expected ? new Set(expected.map((criterion) => criterion.id)) : undefined;
  const seen = new Set<string>();
  for (const [index, entry] of value.entries()) {
    const entryPath = `${where}.done_criteria[${index}]`;
    if (
      !isRecord(entry) ||
      typeof entry.id !== "string" ||
      !CRITERION_ID_RE.test(entry.id) ||
      typeof entry.status !== "string" ||
      !CRITERION_STATUSES.includes(entry.status as GradeCriterionStatus)
    ) {
      issues.push({ path: entryPath, message: "id (DC-NNN) and status are required" });
      continue;
    }
    if (entry.reason !== undefined && typeof entry.reason !== "string") {
      issues.push({ path: `${entryPath}.reason`, message: "reason must be a string" });
    }
    if (
      entry.status === "unsatisfied" &&
      !(typeof entry.reason === "string" && entry.reason.trim())
    ) {
      issues.push({ path: entryPath, message: "unsatisfied requires a non-empty reason" });
    }
    if (seen.has(entry.id)) {
      issues.push({ path: entryPath, message: `duplicate criterion: ${entry.id}` });
    }
    seen.add(entry.id);
    if (expectedIds && !expectedIds.has(entry.id)) {
      issues.push({ path: entryPath, message: `unknown criterion: ${entry.id}` });
    }
  }
  for (const id of expectedIds ?? []) {
    if (!seen.has(id)) issues.push({ path: where, message: `missing criterion: ${id}` });
  }
  return issues;
}

export function validateGradeSubmission(
  submission: GradeSubmission,
  doc: ReviewViewpointsDoc,
  target: GradeTarget,
  options: GradeSubmissionValidationOptions = {},
): GradeValidationIssue[] {
  const issues: GradeValidationIssue[] = [];
  const rubric = assertRubric(doc);
  if (submission.rubric !== rubric.id)
    issues.push({ path: "$", message: `rubric must be ${rubric.id}` });
  const paths = new Set<string>();
  for (const [documentIndex, document] of submission.documents.entries()) {
    const where = `documents[${documentIndex}]`;
    if (!document || typeof document.path !== "string" || !Array.isArray(document.viewpoints)) {
      issues.push({ path: where, message: "path and viewpoints[] are required" });
      continue;
    }
    if (paths.has(document.path))
      issues.push({ path: where, message: `duplicate path: ${document.path}` });
    paths.add(document.path);
    const absoluteDocumentPath = resolve(specdojoRootDir(), document.path);
    const normalizedDocumentPath = repoRelativePath(absoluteDocumentPath);
    const metadata = existsSync(absoluteDocumentPath)
      ? (parseMarkdown(readFileSync(absoluteDocumentPath, "utf8"), normalizedDocumentPath).data
          .specdojo as Record<string, unknown>)
      : {};
    const required = agentViewpoints(doc, target, metadata);
    const allowed = new Map(required.map((viewpoint) => [viewpoint.id, viewpoint]));
    const expectedDoneCriteria =
      options.doneCriteriaByPath?.get(document.path) ??
      options.doneCriteriaByPath?.get(normalizedDocumentPath);
    issues.push(
      ...validateDoneCriteriaInput({
        where,
        target,
        value: document.done_criteria,
        expected: expectedDoneCriteria
          ? applicableDoneCriteria(expectedDoneCriteria, doc, metadata)
          : undefined,
      }),
    );
    const ids = new Set<string>();
    const findingIds = new Set<string>();
    for (const [viewpointIndex, result] of document.viewpoints.entries()) {
      const resultPath = `${where}.viewpoints[${viewpointIndex}]`;
      if (!result || !allowed.has(result.id)) {
        issues.push({
          path: resultPath,
          message: `unknown or non-applicable viewpoint: ${result?.id ?? ""}`,
        });
        continue;
      }
      if (ids.has(result.id))
        issues.push({ path: resultPath, message: `duplicate viewpoint: ${result.id}` });
      ids.add(result.id);
      if (!Number.isInteger(result.level) || result.level < 0 || result.level > 4) {
        issues.push({ path: resultPath, message: "level must be an integer from 0 to 4" });
      }
      const findings = result.findings ?? [];
      if (!Array.isArray(findings)) {
        issues.push({ path: resultPath, message: "findings must be an array" });
        continue;
      }
      if (result.level < 4 && findings.length === 0) {
        issues.push({ path: resultPath, message: "level 0-3 requires at least one finding" });
      }
      for (const [findingIndex, finding] of findings.entries()) {
        if (
          !finding ||
          !Object.hasOwn(SEVERITY_LEVEL_CAP, finding.severity) ||
          typeof finding.message !== "string" ||
          !finding.message.trim()
        ) {
          issues.push({
            path: `${resultPath}.findings[${findingIndex}]`,
            message: "severity and non-empty message are required",
          });
          continue;
        }
        if (
          finding.message_ja !== undefined &&
          (typeof finding.message_ja !== "string" || !finding.message_ja.trim())
        ) {
          issues.push({
            path: `${resultPath}.findings[${findingIndex}].message_ja`,
            message: "message_ja must be a non-empty string when present",
          });
        }
        if (finding.id !== undefined) {
          if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(finding.id)) {
            issues.push({
              path: `${resultPath}.findings[${findingIndex}].id`,
              message: "id must contain only letters, digits, dot, underscore, or hyphen",
            });
          } else if (findingIds.has(finding.id)) {
            issues.push({
              path: `${resultPath}.findings[${findingIndex}].id`,
              message: `duplicate finding id: ${finding.id}`,
            });
          }
          findingIds.add(finding.id);
        }
        if (finding.line !== undefined && (!Number.isInteger(finding.line) || finding.line < 1)) {
          issues.push({
            path: `${resultPath}.findings[${findingIndex}].line`,
            message: "line must be a positive integer",
          });
        }
      }
      const cap = levelCapForFindings(findings);
      if (result.level > cap)
        issues.push({ path: resultPath, message: `finding severity caps level at ${cap}` });
    }
    if (document.level_corrections !== undefined) {
      if (!Array.isArray(document.level_corrections)) {
        issues.push({ path: `${where}.level_corrections`, message: "must be an array" });
      } else {
        for (const [index, correction] of document.level_corrections.entries()) {
          const correctedViewpoint = document.viewpoints.find(
            (viewpoint) => viewpoint.id === correction?.viewpoint,
          );
          if (
            !correction ||
            typeof correction.viewpoint !== "string" ||
            !correctedViewpoint ||
            !Number.isInteger(correction.original_level) ||
            !Number.isInteger(correction.corrected_level) ||
            correction.original_level < 0 ||
            correction.original_level > 4 ||
            correction.corrected_level < 0 ||
            correction.corrected_level >= correction.original_level ||
            correctedViewpoint.level !== correction.corrected_level
          ) {
            issues.push({
              path: `${where}.level_corrections[${index}]`,
              message:
                "viewpoint and matching downward original/corrected levels from 0 to 4 are required",
            });
          }
        }
      }
    }
    for (const viewpoint of required) {
      if (!ids.has(viewpoint.id)) {
        issues.push({ path: where, message: `missing agent viewpoint: ${viewpoint.id}` });
      }
    }
  }
  return issues;
}

// 詳細ファイルは成果物ごとに1件で、再評価のたびに上書きする。時点の記録は git 履歴が担う。
// grade 本体と同じ方式であり、実行ごとにファイルを増やすと最新の評価を判別できなくなる。
export function doneCriteriaDetailPath(criteriaDirectory: string, documentPath: string): string {
  const absolute = resolveSafeMarkdownPath(documentPath);
  const directory = resolveSafeRepositoryPath(criteriaDirectory, "criteria directory");
  return join(
    directory,
    gradePlanFilename(absolute).replace(/-grade-plan\.md$/, "-done-criteria.yaml"),
  );
}

function doneCriteriaDetailId(documentId: string | undefined, documentPath: string): string {
  if (documentId) return `${documentId}-grade-criteria`;
  const hash = createHash("sha256")
    .update(repoRelativePath(documentPath))
    .digest("hex")
    .slice(0, 10);
  return `grade-criteria-${hash}`;
}

export function renderDoneCriteriaDetail(
  detail: GradeDoneCriteriaDetail,
  detailPath: string,
): string {
  const schemaRef = relative(dirname(detailPath), resolveSpecdojoPath(DONE_CRITERIA_SCHEMA))
    .split(sep)
    .join("/");
  return `# yaml-language-server: $schema=${schemaRef}\n${dump(detail, { lineWidth: 120, noRefs: true, quoteStyle: "double" })}`;
}

export function applyGradeSubmission(opts: {
  submission: GradeSubmission;
  viewpoints: ReviewViewpointsDoc;
  target: GradeTarget;
  gradedBy: string;
  reference?: string;
  dryRun?: boolean;
  now?: Date;
  doneCriteriaByPath?: ReadonlyMap<string, GradeDoneCriterion[]>;
  criteriaDirectory?: string;
  resultsDirectory?: string;
  project?: string;
}): string[] {
  const issues = validateGradeSubmission(opts.submission, opts.viewpoints, opts.target, {
    doneCriteriaByPath: opts.doneCriteriaByPath,
  });
  if (issues.length > 0)
    throw new Error(issues.map((issue) => `${issue.path}: ${issue.message}`).join("\n"));
  const changed: string[] = [];
  const sourceContext = opts.resultsDirectory
    ? createGradeSourceContext(opts.project, specdojoRootDir())
    : undefined;
  for (const input of opts.submission.documents) {
    const absolute = resolveSafeMarkdownPath(input.path);
    const rel = repoRelativePath(absolute);
    const current = readFileSync(absolute, "utf8");
    const definitions = opts.doneCriteriaByPath?.get(rel);
    const detailPath =
      definitions && input.done_criteria && opts.criteriaDirectory
        ? doneCriteriaDetailPath(opts.criteriaDirectory, absolute)
        : undefined;
    if (definitions && input.done_criteria && !detailPath) {
      throw new Error(`${rel}: criteriaDirectory is required to record done_criteria`);
    }
    if (opts.resultsDirectory) {
      const documentId = markdownDocumentId(current, rel);
      const resultPath = gradeResultPath(opts.resultsDirectory, documentId);
      const previous = readGradeResult(resultPath);
      const document = parseMarkdown(current, rel);
      const agentResults = preserveStoredFindingSeverities(previous, input.viewpoints);
      const correctionByViewpoint = new Map(
        (input.level_corrections ?? []).map((correction) => [
          correction.viewpoint,
          { ...correction },
        ]),
      );
      for (const [index, result] of agentResults.entries()) {
        const submitted = input.viewpoints[index];
        if (submitted && result.level < submitted.level) {
          const existing = correctionByViewpoint.get(result.id);
          correctionByViewpoint.set(result.id, {
            viewpoint: result.id,
            original_level: existing?.original_level ?? submitted.level,
            corrected_level: result.level,
          });
        }
      }
      const levelCorrections = [...correctionByViewpoint.values()];
      const evaluated = {
        ...input,
        viewpoints: [
          ...agentResults,
          ...deterministicResults(document, opts.viewpoints, opts.target),
        ],
      };
      const rubric = assertRubric(opts.viewpoints);
      const summary = scoreDocument(evaluated, rubric, opts.viewpoints, opts.target);
      const gradedAt = (opts.now ?? new Date()).toISOString();
      const usedIds = new Set<string>();
      let sequence = 0;
      const bodyLines = document.body.split(/\r?\n/);
      const findings: StoredGradeFinding[] = evaluated.viewpoints.flatMap((viewpoint) =>
        (viewpoint.findings ?? []).map((finding) => {
          let id = finding.id?.trim();
          if (!id || usedIds.has(id)) {
            do {
              sequence += 1;
              id = `F${String(sequence).padStart(3, "0")}`;
            } while (usedIds.has(id));
          }
          usedIds.add(id);
          const line = Math.max(1, finding.line ?? 1);
          return {
            id,
            severity: finding.severity,
            rule: viewpoint.id,
            line,
            anchor: bodyLines[Math.min(bodyLines.length, line) - 1]?.trim() ?? "",
            message: sanitizeCommentText(finding.message),
            message_ja: sanitizeCommentText(finding.message_ja ?? finding.message),
          };
        }),
      );
      const criteriaResults =
        opts.target === "deliverable" && definitions && input.done_criteria && detailPath
          ? input.done_criteria
          : undefined;
      const detailRef = criteriaResults ? doneCriteriaDetailId(documentId, absolute) : undefined;
      const sourceHashes = sourceContext
        ? gradeSourceHashes(absolute, document, opts.viewpoints, opts.target, sourceContext)
        : undefined;
      const result: GradeResult = {
        version: 1,
        document: documentId,
        path: rel,
        target: opts.target,
        rubric: rubric.id,
        ...(opts.reference ? { reference: resolveGradeReferenceId(opts.reference) } : {}),
        verdict: summary.verdict,
        score: summary.score,
        graded_at: gradedAt,
        graded_by: opts.gradedBy,
        content_hash: gradeContentHash(current),
        ...(sourceHashes && Object.keys(sourceHashes).length > 0
          ? { source_hashes: sourceHashes }
          : {}),
        categories: summary.categories,
        viewpoints: summary.viewpoints,
        finding_counts: summary.findings,
        findings,
        ...(levelCorrections.length > 0 ? { level_corrections: levelCorrections } : {}),
        ...(criteriaResults && definitions && detailRef
          ? { done_criteria: summarizeDoneCriteria(definitions, criteriaResults, detailRef) }
          : {}),
      };
      if (criteriaResults && definitions && detailPath && detailRef) {
        const resultById = new Map(criteriaResults.map((criterion) => [criterion.id, criterion]));
        const criteria = definitions.map((definition) => {
          const criterion = resultById.get(definition.id);
          return {
            ...definition,
            status: criterion?.status ?? ("unsatisfied" as const),
            ...(criterion?.reason ? { reason: criterion.reason } : {}),
          };
        });
        const satisfied = criteria.filter((criterion) => criterion.status === "satisfied").length;
        const detail: GradeDoneCriteriaDetail = {
          id: detailRef,
          document: documentId,
          path: rel,
          graded_at: gradedAt,
          graded_by: opts.gradedBy,
          content_hash: result.content_hash,
          summary: { satisfied, unsatisfied: criteria.length - satisfied, total: criteria.length },
          criteria,
        };
        const rendered = renderDoneCriteriaDetail(detail, detailPath);
        if (!existsSync(detailPath) || readFileSync(detailPath, "utf8") !== rendered) {
          changed.push(repoRelativePath(detailPath));
          if (!opts.dryRun) {
            mkdirSync(dirname(detailPath), { recursive: true });
            writeFileSync(detailPath, rendered, "utf8");
          }
        }
      }
      if (writeGradeResult(resultPath, result, opts.dryRun)) {
        changed.push(repoRelativePath(resultPath));
      }
      continue;
    }
    const documentId = parseMarkdown(current, rel).data.specdojo as Record<string, unknown>;
    const graded = gradeMarkdownDocument({
      content: current,
      path: rel,
      input,
      viewpoints: opts.viewpoints,
      target: opts.target,
      gradedBy: opts.gradedBy,
      reference: opts.reference,
      now: opts.now,
      doneCriteria:
        definitions && detailPath
          ? {
              definitions,
              detailRef: doneCriteriaDetailId(
                typeof documentId.id === "string" ? documentId.id : undefined,
                absolute,
              ),
            }
          : undefined,
    });
    // 詳細を先に永続化してから成果物へ detail_ref を書く。途中で詳細の書き込みに失敗しても、
    // 存在しない参照だけが成果物へ残る状態を避ける。
    if (graded.detail && detailPath) {
      const rendered = renderDoneCriteriaDetail(graded.detail, detailPath);
      const detailRel = repoRelativePath(detailPath);
      if (!existsSync(detailPath) || readFileSync(detailPath, "utf8") !== rendered) {
        changed.push(detailRel);
        if (!opts.dryRun) {
          mkdirSync(dirname(detailPath), { recursive: true });
          writeFileSync(detailPath, rendered, "utf8");
        }
      }
    }
    if (graded.content !== current) {
      changed.push(rel);
      if (!opts.dryRun) writeFileSync(absolute, graded.content, "utf8");
    }
  }
  return changed;
}
