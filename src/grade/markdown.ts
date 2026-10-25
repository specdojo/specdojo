import { readFileSync, writeFileSync } from "node:fs";
import {
  FINDING_RE,
  insertFindings,
  isRecord,
  legacyInlineContentHash,
  parseMarkdown,
  preservePreviousFindingSeverities,
  serializeMarkdown,
  withoutFindingComments,
  type GradeCriterionInput,
  type GradeDocumentInput,
  type GradeDoneCriteriaContext,
  type GradeDoneCriteriaDetail,
  type GradeDoneCriterion,
  type GradeSeverity,
  type GradeTarget,
  type GradeVerdict,
  type MarkdownDocument,
} from "./core.js";
import { discoverGradeTargets } from "./target-discovery.js";
import { applicableDoneCriteria, deterministicResults } from "./plan.js";
import {
  gradeContentHash,
  gradeResultPath,
  markdownDocumentId,
  readGradeResultForDocument,
  resolveGradeResultsDirectory,
  validateGradeResult,
  writeGradeResult,
  type GradeResult,
  type StoredGradeFinding,
} from "./result.js";
import {
  assertRubric,
  relativePathFromRoot,
  repoRelativePath,
  resolveSafeMarkdownPath,
} from "./targets.js";
import type { GradeRubric, ReviewViewpointsDoc } from "../review/types.js";
import { specdojoRootDir } from "../shared/specdojo-config.js";

export function scoreDocument(
  input: GradeDocumentInput,
  rubric: GradeRubric,
  doc: ReviewViewpointsDoc,
  target: GradeTarget,
) {
  const definitions = new Map((doc.viewpoints ?? []).map((viewpoint) => [viewpoint.id, viewpoint]));
  const categoryLevels = new Map<string, number[]>();
  const counts: Record<GradeSeverity, number> = { blocker: 0, major: 0, minor: 0, note: 0 };
  const viewpointOutput: Record<string, { level: number; score: number }> = {};
  for (const result of input.viewpoints) {
    const definition = definitions.get(result.id)!;
    const values = categoryLevels.get(definition.category) ?? [];
    values.push(result.level);
    categoryLevels.set(definition.category, values);
    viewpointOutput[result.id] = { level: result.level, score: result.level * 25 };
    for (const finding of result.findings ?? []) counts[finding.severity] += 1;
  }
  const categories: Record<string, { score: number }> = {};
  let weighted = 0;
  let totalWeight = 0;
  for (const [category, levels] of categoryLevels) {
    const score = Math.round((levels.reduce((sum, level) => sum + level, 0) / levels.length) * 25);
    categories[category] = { score };
    const weight = rubric.weights[target][category] ?? 0;
    weighted += score * weight;
    totalWeight += weight;
  }
  const score = totalWeight > 0 ? Math.round(weighted / totalWeight) : 0;
  const verdict: GradeVerdict =
    counts.blocker > 0
      ? "fail"
      : counts.major > 0 || score < rubric.pass_score
        ? "needs-work"
        : "pass";
  return { score, verdict, categories, viewpoints: viewpointOutput, findings: counts };
}

// 比較リファレンスは ID で保存する。パスで保存すると文書を移動したときに参照が壊れる。
// 引数にはパスと ID のどちらも渡せる。パスの場合は Frontmatter の id を読み取る。
export function resolveGradeReferenceId(pathOrId: string, project?: string): string {
  const trimmed = pathOrId.trim();
  if (!trimmed.endsWith(".md")) return trimmed;
  const absolute = resolveSafeMarkdownPath(trimmed, specdojoRootDir(), project);
  const document = parseMarkdown(readFileSync(absolute, "utf8"), repoRelativePath(absolute));
  const metadata = document.data.specdojo;
  if (!isRecord(metadata) || typeof metadata.id !== "string" || metadata.id.length === 0) {
    throw new Error(`${repoRelativePath(absolute)}: reference document has no specdojo.id`);
  }
  return metadata.id;
}

// score と done_criteria の充足は別の軸として扱う。verdict は score と finding だけで決め、
// 充足状況は要約として並記する。score の閾値が充足判定を上書きせず、その逆も行わない。
export function summarizeDoneCriteria(
  definitions: readonly GradeDoneCriterion[],
  results: readonly GradeCriterionInput[],
  detailRef: string,
): Record<string, unknown> {
  const resultById = new Map(results.map((result) => [result.id, result]));
  const unsatisfied: Record<string, string[]> = {};
  let satisfied = 0;
  for (const criterion of definitions) {
    const result = resultById.get(criterion.id);
    if (result?.status === "satisfied") satisfied += 1;
    else unsatisfied[criterion.id] = [...criterion.roles];
  }
  return {
    satisfied,
    total: definitions.length,
    ...(Object.keys(unsatisfied).length > 0 ? { unsatisfied } : {}),
    detail_ref: detailRef,
  };
}

type GradeMarkdownOptions = {
  content: string;
  path: string;
  input: GradeDocumentInput;
  viewpoints: ReviewViewpointsDoc;
  target: GradeTarget;
  gradedBy: string;
  reference?: string;
  now?: Date;
  doneCriteria?: GradeDoneCriteriaContext;
};

export function gradeMarkdownDocument(opts: GradeMarkdownOptions): {
  content: string;
  detail?: GradeDoneCriteriaDetail;
} {
  const document = parseMarkdown(opts.content, opts.path);
  const specdojo = document.data.specdojo as Record<string, unknown>;
  const agentResults = preservePreviousFindingSeverities(document.body, opts.input.viewpoints);
  const evaluated = {
    ...opts.input,
    viewpoints: [...agentResults, ...deterministicResults(document, opts.viewpoints, opts.target)],
  };
  const rubric = assertRubric(opts.viewpoints);
  const summary = scoreDocument(evaluated, rubric, opts.viewpoints, opts.target);
  const body = insertFindings(document.body, evaluated.viewpoints);
  const gradedAt = (opts.now ?? new Date()).toISOString();
  const contentHash = legacyInlineContentHash({ data: document.data, body });
  const criteriaResults =
    opts.target === "deliverable" && opts.doneCriteria && opts.input.done_criteria
      ? opts.input.done_criteria
      : undefined;
  const applicableCriteriaDefinitions = opts.doneCriteria
    ? applicableDoneCriteria(opts.doneCriteria.definitions, opts.viewpoints, specdojo)
    : undefined;
  specdojo.grade = {
    rubric: rubric.id,
    ...(opts.reference ? { reference: resolveGradeReferenceId(opts.reference) } : {}),
    target: opts.target,
    verdict: summary.verdict,
    score: summary.score,
    graded_at: gradedAt,
    graded_by: opts.gradedBy,
    content_hash: contentHash,
    categories: summary.categories,
    viewpoints: summary.viewpoints,
    findings: summary.findings,
    ...(criteriaResults && opts.doneCriteria && applicableCriteriaDefinitions
      ? {
          done_criteria: summarizeDoneCriteria(
            applicableCriteriaDefinitions,
            criteriaResults,
            opts.doneCriteria.detailRef,
          ),
        }
      : {}),
  };
  const content = serializeMarkdown({ data: document.data, body });
  if (!criteriaResults || !opts.doneCriteria) return { content };

  const resultById = new Map(criteriaResults.map((result) => [result.id, result]));
  const criteria = opts.doneCriteria.definitions.map((criterion) => {
    const result = resultById.get(criterion.id);
    return {
      ...criterion,
      status: result?.status ?? ("unsatisfied" as const),
      ...(result?.reason ? { reason: result.reason } : {}),
    };
  });
  const satisfied = criteria.filter((criterion) => criterion.status === "satisfied").length;
  return {
    content,
    detail: {
      id: opts.doneCriteria.detailRef,
      document: typeof specdojo.id === "string" ? specdojo.id : opts.path,
      path: opts.path,
      graded_at: gradedAt,
      graded_by: opts.gradedBy,
      content_hash: contentHash,
      summary: { satisfied, unsatisfied: criteria.length - satisfied, total: criteria.length },
      criteria,
    },
  };
}

export function gradeMarkdownContent(opts: GradeMarkdownOptions): string {
  return gradeMarkdownDocument(opts).content;
}

export function validateGradedDocument(path: string): string[] {
  const absolute = resolveSafeMarkdownPath(path);
  const rel = repoRelativePath(absolute);
  return validateGradedMarkdown(readFileSync(absolute, "utf8"), rel);
}

export function validateGradeResultForDocument(opts: {
  path: string;
  target: GradeTarget;
  project?: string;
}): string[] {
  const absolute = resolveSafeMarkdownPath(opts.path, specdojoRootDir(), opts.project);
  const rel = repoRelativePath(absolute);
  const content = readFileSync(absolute, "utf8");
  const result = readGradeResultForDocument({ documentPath: rel, project: opts.project });
  if (!result) return [];
  return validateGradeResult(result, content, rel, opts.target);
}

export function validateGradedMarkdown(content: string, path: string): string[] {
  const document = parseMarkdown(content, path);
  const specdojo = document.data.specdojo as Record<string, unknown>;
  const grade = isRecord(specdojo.grade) ? specdojo.grade : null;
  if (!grade) return [`${path}: specdojo.grade is missing`];
  const findings = isRecord(grade.findings) ? grade.findings : {};
  const actual: Record<GradeSeverity, number> = { blocker: 0, major: 0, minor: 0, note: 0 };
  for (const match of document.body.matchAll(FINDING_RE)) actual[match[2] as GradeSeverity] += 1;
  const errors: string[] = [];
  for (const severity of Object.keys(actual) as GradeSeverity[]) {
    if (findings[severity] !== actual[severity])
      errors.push(
        `${path}: findings.${severity}=${String(findings[severity])}, comments=${actual[severity]}`,
      );
  }
  if (grade.content_hash !== legacyInlineContentHash(document))
    errors.push(`${path}: content changed after the last grade`);
  return errors;
}

export function migrateInlineGrades(opts: {
  project?: string;
  target?: GradeTarget;
  paths?: string[];
  dryRun?: boolean;
}): string[] {
  const rootDir = specdojoRootDir();
  const candidates =
    opts.paths && opts.paths.length > 0
      ? opts.paths.map((path) => resolveSafeMarkdownPath(path, rootDir, opts.project))
      : [
          ...(opts.target !== "deliverable"
            ? discoverGradeTargets({ target: "kata", project: opts.project }, rootDir)
            : []),
          ...(opts.target !== "kata"
            ? discoverGradeTargets({ target: "deliverable", project: opts.project }, rootDir)
            : []),
        ];
  const resultsDirectory = resolveGradeResultsDirectory(opts.project, rootDir);
  const changed: string[] = [];
  for (const absolute of candidates) {
    const rel = relativePathFromRoot(absolute, rootDir);
    const current = readFileSync(absolute, "utf8");
    if (!current.includes("specdojo:finding") && !/^  grade:\s*$/m.test(current)) continue;
    let document: MarkdownDocument;
    try {
      document = parseMarkdown(current, rel);
    } catch {
      continue;
    }
    const specdojo = document.data.specdojo as Record<string, unknown>;
    const legacyGrade = isRecord(specdojo.grade) ? structuredClone(specdojo.grade) : undefined;
    const legacyTarget = legacyGrade?.target;
    const target: GradeTarget =
      legacyTarget === "kata" || legacyTarget === "deliverable"
        ? legacyTarget
        : rel.startsWith("docs/ja/specdojo/")
          ? "kata"
          : "deliverable";
    if (opts.target && target !== opts.target) continue;

    const legacyFindings = [...document.body.matchAll(FINDING_RE)].map((match) => ({
      id: match[1],
      severity: match[2] as GradeSeverity,
      rule: match[3],
      line: match[4] ? Number(match[4]) : 1,
      message: match[5].trim(),
    }));
    delete specdojo.grade;
    document.body = withoutFindingComments(document.body)
      .replace(/\n{3,}/g, "\n\n")
      .replace(/(?:\n[ \t]*)*$/, "\n");
    const cleaned = serializeMarkdown(document);
    if (cleaned !== current) {
      changed.push(rel);
      if (!opts.dryRun) writeFileSync(absolute, cleaned, "utf8");
    }
    if (!legacyGrade) continue;

    const documentId = markdownDocumentId(cleaned, rel);
    const bodyLines = document.body.split(/\r?\n/);
    const findings: StoredGradeFinding[] = legacyFindings.map((finding) => ({
      ...finding,
      anchor: bodyLines[Math.min(bodyLines.length, finding.line) - 1]?.trim() ?? "",
      message_ja: finding.message,
    }));
    const counts: Record<GradeSeverity, number> = { blocker: 0, major: 0, minor: 0, note: 0 };
    for (const finding of findings) counts[finding.severity] += 1;
    if (
      typeof legacyGrade.rubric !== "string" ||
      (legacyGrade.verdict !== "pass" &&
        legacyGrade.verdict !== "needs-work" &&
        legacyGrade.verdict !== "fail") ||
      !Number.isSafeInteger(legacyGrade.score) ||
      typeof legacyGrade.graded_at !== "string" ||
      typeof legacyGrade.graded_by !== "string" ||
      !isRecord(legacyGrade.categories) ||
      !isRecord(legacyGrade.viewpoints)
    ) {
      throw new Error(`${rel}: legacy specdojo.grade is invalid`);
    }
    const result: GradeResult = {
      version: 1,
      document: documentId,
      path: rel,
      target,
      rubric: legacyGrade.rubric,
      ...(typeof legacyGrade.reference === "string" ? { reference: legacyGrade.reference } : {}),
      verdict: legacyGrade.verdict,
      score: legacyGrade.score as number,
      graded_at: legacyGrade.graded_at,
      graded_by: legacyGrade.graded_by,
      content_hash: gradeContentHash(cleaned),
      categories: legacyGrade.categories as GradeResult["categories"],
      viewpoints: legacyGrade.viewpoints as GradeResult["viewpoints"],
      finding_counts: counts,
      findings,
      ...(isRecord(legacyGrade.done_criteria) ? { done_criteria: legacyGrade.done_criteria } : {}),
    };
    const resultPath = gradeResultPath(resultsDirectory, documentId);
    if (writeGradeResult(resultPath, result, opts.dryRun)) {
      changed.push(repoRelativePath(resultPath));
    }
  }
  return changed;
}
