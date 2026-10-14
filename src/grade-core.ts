import { createHash } from "node:crypto";
import yaml from "js-yaml";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { viewpointAppliesToDocument } from "./review-plan.js";
import type { ReviewViewpoint, ReviewViewpointsDoc } from "./review-types.js";
import { gradeContentHash, type GradeResult } from "./grade-result.js";

export type GradeTarget = "kata" | "deliverable";
export const GRADE_TARGETS: readonly GradeTarget[] = ["kata", "deliverable"];
export type GradeSeverity = "blocker" | "major" | "minor" | "note";
export type GradeVerdict = "pass" | "needs-work" | "fail";

export type GradeTargetFilters = {
  changedOnly?: boolean;
  dependencyChanged?: boolean;
  rulebookChanged?: boolean;
  unreviewed?: boolean;
  verdict?: GradeVerdict;
  minScore?: number;
  maxFindings?: number;
  ungraded?: boolean;
  incomplete?: boolean;
  rubricOutdated?: boolean;
};

export type GradePipelineState = {
  version: 1;
  project_id: string;
  target: GradeTarget;
  document: string;
  content_hash: string;
  stage_completed: number;
  stage_failed: number | null;
  stage_total: number;
  consecutive_failures: number;
  max_failures: number;
  last_run_id: string;
  updated_at: string;
};

export type GradeFindingInput = {
  id?: string;
  severity: GradeSeverity;
  /** Canonical executor wording. */
  message: string;
  /** Japanese display wording. It never participates in scoring or carry-over matching. */
  message_ja?: string;
  line?: number;
};

export type GradeLevelCorrection = {
  viewpoint: string;
  original_level: number;
  corrected_level: number;
};

type PreviousGradeFinding = Pick<GradeFindingInput, "severity" | "message" | "line"> & {
  rule: string;
};

export type GradeViewpointInput = {
  id: string;
  level: number;
  findings?: GradeFindingInput[];
};

export type GradeCriterionStatus = "satisfied" | "unsatisfied";

export type GradeCriterionInput = {
  id: string;
  status: GradeCriterionStatus;
  reason?: string;
};

export type GradeDocumentInput = {
  path: string;
  viewpoints: GradeViewpointInput[];
  level_corrections?: GradeLevelCorrection[];
  done_criteria?: GradeCriterionInput[];
};

export type GradeSubmission = {
  rubric: string;
  /** @deprecated grade apply ignores this agent-supplied value; use --by instead. */
  graded_by?: string;
  documents: GradeDocumentInput[];
};

export type GradeExecutorAnalysis = {
  viewpoints: GradeViewpointInput[];
  doneCriteria?: GradeCriterionInput[];
};

// 成果物カタログの done_criteria を plan / apply で扱うための定義。id はカタログの並び順から
// 採番し、同じカタログから生成する限り安定する。
export type GradeDoneCriterion = {
  id: string;
  text: string;
  roles: string[];
  viewpoint: string;
};

export type GradeDoneCriteriaContext = {
  definitions: GradeDoneCriterion[];
  detailRef: string;
};

export type GradeDoneCriteriaDetail = {
  id: string;
  document: string;
  path: string;
  graded_at: string;
  graded_by: string;
  content_hash: string;
  summary: { satisfied: number; unsatisfied: number; total: number };
  criteria: Array<GradeDoneCriterion & { status: GradeCriterionStatus; reason?: string }>;
};

export type GradeValidationIssue = { path: string; message: string };

export type MarkdownDocument = {
  data: Record<string, unknown>;
  body: string;
};

export const FINDING_RE =
  /^[ \t]*<!--[ \t]*specdojo:finding[ \t]+id=([^ \t]+)[ \t]+severity=(blocker|major|minor|note)[ \t]+rule=([^ \t]+)(?:[ \t]+line=([1-9][0-9]*))?[ \t]+(.*?)[ \t]*-->[ \t]*(?:\r?\n|$)/gm;
export const KATA_DIRS = ["rulebooks", "recipes", "samples", "templates"] as const;
export const KATA_REFERENCE_EXTENSIONS = new Set([".md", ".yaml", ".yml", ".json"]);
export const KATA_REFERENCE_FIELDS = ["rulebook", "recipe", "sample", "template"] as const;
export const CRITERION_ID_RE = /^DC-[0-9]{3,}$/;
export const CRITERION_STATUSES: readonly GradeCriterionStatus[] = ["satisfied", "unsatisfied"];
export const DONE_CRITERIA_SCHEMA = "docs/specdojo/schemas/v1/grade-done-criteria.schema.yaml";
const GRADE_PLACEHOLDER = "__SPECDOJO_GRADE_FLOW_PLACEHOLDER__";
const GRADE_FINDINGS_PLACEHOLDER = "__SPECDOJO_GRADE_FINDINGS_FLOW_PLACEHOLDER__";
const GRADE_UNSATISFIED_PLACEHOLDER = "__SPECDOJO_GRADE_UNSATISFIED_BLOCK_PLACEHOLDER__";
export const GRADE_PLAN_EMBEDDED_DOCUMENT_CHARACTER_LIMIT = 100_000;
export const SEVERITY_LEVEL_CAP: Record<GradeSeverity, number> = {
  blocker: 0,
  major: 2,
  minor: 3,
  note: 4,
};

export function preservePreviousFindingSeverities(
  body: string,
  viewpoints: readonly GradeViewpointInput[],
): GradeViewpointInput[] {
  const previousByMessage = new Map<string, GradeSeverity>();
  for (const finding of previousGradeFindings(body)) {
    const message = sanitizeCommentText(finding.message);
    const previous = previousByMessage.get(message);
    if (
      previous === undefined ||
      SEVERITY_LEVEL_CAP[finding.severity] < SEVERITY_LEVEL_CAP[previous]
    ) {
      previousByMessage.set(message, finding.severity);
    }
  }

  return viewpoints.map((viewpoint) => {
    const findings = (viewpoint.findings ?? []).map((finding) => {
      const previous = previousByMessage.get(sanitizeCommentText(finding.message));
      return previous !== undefined &&
        SEVERITY_LEVEL_CAP[previous] < SEVERITY_LEVEL_CAP[finding.severity]
        ? { ...finding, severity: previous }
        : { ...finding };
    });
    return {
      ...viewpoint,
      findings,
      level: Math.min(viewpoint.level, levelCapForFindings(findings)),
    };
  });
}

export function preserveStoredFindingSeverities(
  previous: GradeResult | undefined,
  viewpoints: readonly GradeViewpointInput[],
): GradeViewpointInput[] {
  const previousByMessage = new Map<string, GradeSeverity>();
  for (const finding of previous?.findings ?? []) {
    const message = sanitizeCommentText(finding.message);
    const stored = previousByMessage.get(message);
    if (stored === undefined || SEVERITY_LEVEL_CAP[finding.severity] < SEVERITY_LEVEL_CAP[stored]) {
      previousByMessage.set(message, finding.severity);
    }
  }
  return viewpoints.map((viewpoint) => {
    const findings = (viewpoint.findings ?? []).map((finding) => {
      const stored = previousByMessage.get(sanitizeCommentText(finding.message));
      return stored !== undefined &&
        SEVERITY_LEVEL_CAP[stored] < SEVERITY_LEVEL_CAP[finding.severity]
        ? { ...finding, severity: stored }
        : { ...finding };
    });
    return {
      ...viewpoint,
      findings,
      level: Math.min(viewpoint.level, levelCapForFindings(findings)),
    };
  });
}

export function levelCapForFindings(findings: readonly GradeFindingInput[]): number {
  const majorCount = findings.filter((finding) => finding.severity === "major").length;
  const severityCap = findings.reduce(
    (current, finding) => Math.min(current, SEVERITY_LEVEL_CAP[finding.severity]),
    4,
  );
  return majorCount >= 2 ? Math.min(severityCap, 1) : severityCap;
}

export function correctViewpointLevels(viewpoints: readonly GradeViewpointInput[]): {
  viewpoints: GradeViewpointInput[];
  corrections: GradeLevelCorrection[];
} {
  const corrections: GradeLevelCorrection[] = [];
  const corrected = viewpoints.map((viewpoint) => {
    const cap = levelCapForFindings(viewpoint.findings ?? []);
    const correctedLevel = Math.min(viewpoint.level, cap);
    if (correctedLevel !== viewpoint.level) {
      corrections.push({
        viewpoint: viewpoint.id,
        original_level: viewpoint.level,
        corrected_level: correctedLevel,
      });
    }
    return { ...viewpoint, level: correctedLevel };
  });
  return { viewpoints: corrected, corrections };
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseMarkdown(content: string, path: string): MarkdownDocument {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`${path}: Markdown frontmatter is required`);
  const parsed = yaml.load(match[1]);
  if (!isRecord(parsed) || !isRecord(parsed.specdojo)) {
    throw new Error(`${path}: frontmatter must contain a specdojo mapping`);
  }
  return { data: parsed, body: (match[2] ?? "").replace(/^(?:\r?\n)+/, "") };
}

function serializeGrade(grade: Record<string, unknown>): string {
  const gradeForDump = structuredClone(grade);
  const findings = isRecord(gradeForDump.findings) ? gradeForDump.findings : undefined;
  if (findings) gradeForDump.findings = GRADE_FINDINGS_PLACEHOLDER;
  const doneCriteria = isRecord(gradeForDump.done_criteria)
    ? gradeForDump.done_criteria
    : undefined;
  const unsatisfied =
    doneCriteria && isRecord(doneCriteria.unsatisfied) ? doneCriteria.unsatisfied : undefined;
  if (doneCriteria && unsatisfied) doneCriteria.unsatisfied = GRADE_UNSATISFIED_PLACEHOLDER;

  let dumped = yaml
    .dump(
      { grade: gradeForDump },
      // categories / viewpoints の各値だけをフロー化する。grade 全体や各 collection
      // までフロー化すると一行が長くなり、差分も読みづらくなる。
      { lineWidth: 120, noRefs: true, flowLevel: 3, quotingType: '"' },
    )
    .trimEnd();
  if (findings) {
    const inlineFindings = yaml
      .dump(findings, { lineWidth: -1, noRefs: true, flowLevel: 0 })
      .trimEnd();
    dumped = dumped.replace(GRADE_FINDINGS_PLACEHOLDER, inlineFindings);
  }
  if (unsatisfied) {
    // 未充足条件は viewpoints と同じく「条件ごとに1行、値はフロー」で記録する。
    // 条件数が増えても1行が伸びず、Prettier の整形後も同じ形を保つ。
    const blockUnsatisfied = yaml
      .dump(unsatisfied, { lineWidth: -1, noRefs: true, flowLevel: 1 })
      .trimEnd()
      .split("\n")
      .map((line) => `      ${line}`)
      .join("\n");
    dumped = dumped.replace(
      `    unsatisfied: ${GRADE_UNSATISFIED_PLACEHOLDER}`,
      `    unsatisfied:\n${blockUnsatisfied}`,
    );
  }
  // js-yaml は `{score: 100}`、Prettier は `{ score: 100 }` と出力する。
  // 最初から Prettier の形へ合わせ、整形と再評価の往復で差分が出ないようにする。
  return dumped.replace(/^(\s+[^:\n]+: )\{([^{}\n]*)\}$/gm, "$1{ $2 }");
}

export function serializeMarkdown(document: MarkdownDocument): string {
  const dataForDump = structuredClone(document.data);
  const specdojo = isRecord(dataForDump.specdojo) ? dataForDump.specdojo : undefined;
  const grade = specdojo && isRecord(specdojo.grade) ? specdojo.grade : undefined;
  if (!specdojo || !grade) {
    return `---\n${yaml.dump(dataForDump, { lineWidth: 120, noRefs: true }).trimEnd()}\n---\n\n${document.body.replace(/^\n+/, "")}`;
  }

  specdojo.grade = GRADE_PLACEHOLDER;
  const gradeBlock = serializeGrade(grade)
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n");
  const frontmatter = yaml
    .dump(dataForDump, { lineWidth: 120, noRefs: true })
    .trimEnd()
    .replace(`  grade: ${GRADE_PLACEHOLDER}`, gradeBlock);
  return `---\n${frontmatter}\n---\n\n${document.body.replace(/^\n+/, "")}`;
}

export function withoutFindingComments(body: string): string {
  return body.replace(FINDING_RE, "");
}

function normalizeContentForHash(body: string): string {
  return body
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n");
}

function previousGradeFindings(body: string): PreviousGradeFinding[] {
  return [...body.matchAll(FINDING_RE)].map((match) => ({
    severity: match[2] as GradeSeverity,
    rule: match[3],
    ...(match[4] ? { line: Number(match[4]) } : {}),
    message: match[5].trim(),
  }));
}

// 移行前のインライン grade を読み取る互換 API だけが使用する旧ハッシュ。
export function legacyInlineContentHash(document: MarkdownDocument): string {
  const cloned = structuredClone(document.data);
  const specdojo = isRecord(cloned.specdojo) ? cloned.specdojo : {};
  delete specdojo.grade;
  return createHash("sha256")
    .update(yaml.dump(cloned, { sortKeys: true, noRefs: true, lineWidth: -1 }))
    .update("\n")
    .update(normalizeContentForHash(withoutFindingComments(document.body)))
    .digest("hex");
}

function stableContentHash(document: MarkdownDocument): string {
  return gradeContentHash(serializeMarkdown(document));
}

// pipeline 状態は成果物そのもののハッシュで識別する。grade apply は成果物を変更しないため、
// grade / finding や空行を除外する正規化は不要である。
export function pipelineContentHash(document: MarkdownDocument): string {
  return stableContentHash(document);
}

export function sanitizeCommentText(value: string): string {
  return (
    value
      .replace(/--+/g, "—")
      .replace(/[\r\n]+/g, " ")
      // 山括弧プレースホルダは HTML コメント内でもプロジェクトの lint が検知する。
      // コメント内ではインラインコードが機能しないため、全角へ置き換えて退避する。
      .replace(/</g, "＜")
      .replace(/>/g, "＞")
      .trim()
  );
}

function findingComment(
  finding: Required<Pick<GradeFindingInput, "id">> & GradeFindingInput,
  rule: string,
): string {
  return `<!-- specdojo:finding id=${finding.id} severity=${finding.severity} rule=${rule} line=${finding.line ?? 1} ${sanitizeCommentText(finding.message)} -->`;
}

type MarkdownBlockRange = {
  startLine: number;
  endLine: number;
  isHtmlComment: boolean;
};

function markdownBlockRanges(body: string): MarkdownBlockRange[] {
  const root = unified().use(remarkParse).parse(body);
  return root.children.flatMap((node) => {
    const startLine = node.position?.start.line;
    const endLine = node.position?.end.line;
    return startLine === undefined || endLine === undefined
      ? []
      : [
          {
            startLine,
            endLine,
            isHtmlComment:
              node.type === "html" &&
              "value" in node &&
              typeof node.value === "string" &&
              /^\s*<!--[\s\S]*-->\s*$/.test(node.value),
          },
        ];
  });
}

function safeFindingInsertionIndex(
  blocks: readonly MarkdownBlockRange[],
  lines: readonly string[],
  requestedIndex: number,
): number {
  const requestedLine = requestedIndex + 1;
  const containingIndex = blocks.findIndex(
    (block) => block.startLine <= requestedLine && requestedLine <= block.endLine,
  );
  if (containingIndex === -1) return requestedIndex;

  let insertionStartLine = blocks[containingIndex].startLine;
  for (let index = containingIndex - 1; index >= 0; index -= 1) {
    const candidate = blocks[index];
    if (!candidate.isHtmlComment) break;
    const linesBetween = lines.slice(candidate.endLine, insertionStartLine - 1);
    if (linesBetween.some((line) => line.trim() !== "")) break;
    insertionStartLine = candidate.startLine;
  }
  return insertionStartLine - 1;
}

export function insertFindings(body: string, viewpoints: GradeViewpointInput[]): string {
  const bodyWithoutFindings = withoutFindingComments(body);
  const lines = bodyWithoutFindings.split("\n");
  const blocks = markdownBlockRanges(bodyWithoutFindings);
  const insertions = new Map<number, string[]>();
  const usedIds = new Set(
    viewpoints.flatMap((viewpoint) =>
      (viewpoint.findings ?? []).flatMap((finding) => (finding.id ? [finding.id] : [])),
    ),
  );
  let sequence = 0;
  for (const viewpoint of viewpoints) {
    for (const finding of viewpoint.findings ?? []) {
      let id = finding.id?.trim();
      if (!id) {
        do {
          sequence += 1;
          id = `F${String(sequence).padStart(3, "0")}`;
        } while (usedIds.has(id));
        usedIds.add(id);
      }
      const requestedIndex = Math.max(0, Math.min(lines.length, (finding.line ?? 1) - 1));
      // finding は対象行を含む最上位 Markdown ブロックの直前へ置く。これにより、
      // 入れ子リスト、表、引用、コードフェンス、複数行段落の内部を分断しない。
      // 対象行そのものはコメントの line 属性に残す。
      const index = safeFindingInsertionIndex(blocks, lines, requestedIndex);
      const existing = insertions.get(index) ?? [];
      existing.push(findingComment({ ...finding, id }, viewpoint.id));
      insertions.set(index, existing);
    }
  }
  const output: string[] = [];
  for (let index = 0; index <= lines.length; index += 1) {
    const comments = insertions.get(index) ?? [];
    // 直前が空行の場合は連続空行になるため詰める。agent が本文末尾を超える行番号を
    // 指定すると、末尾の空行の後ろへコメントが並び markdownlint の MD012 に触れる。
    if (comments.length > 0) {
      while (output.length > 0 && output[output.length - 1].trim() === "") output.pop();
      if (output.length > 0) output.push("");
    }
    output.push(...comments);
    if (index < lines.length) output.push(lines[index]);
  }
  return (
    output
      .join("\n")
      .replace(/^\n+/, "")
      .replace(/\n{3,}/g, "\n\n")
      // grade apply の出力だけで lint 可能な状態にする。走査は文書ごとの apply 間に
      // Prettier を実行しないため、入力由来の末尾空行をここで1改行へ正規化する。
      .replace(/(?:\n[ \t]*)*$/, "\n")
  );
}

export function gradedViewpoints(
  doc: ReviewViewpointsDoc,
  target: GradeTarget,
  metadata: Record<string, unknown>,
): ReviewViewpoint[] {
  return (doc.viewpoints ?? []).filter(
    (viewpoint) =>
      (viewpoint.grade_targets === undefined || viewpoint.grade_targets.includes(target)) &&
      viewpointAppliesToDocument(viewpoint, metadata),
  );
}

export function agentViewpoints(
  doc: ReviewViewpointsDoc,
  target: GradeTarget,
  metadata: Record<string, unknown>,
): ReviewViewpoint[] {
  return gradedViewpoints(doc, target, metadata).filter(
    (viewpoint) =>
      viewpoint.evaluation === "referential" || viewpoint.evaluation === "discretionary",
  );
}
