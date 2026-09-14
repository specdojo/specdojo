import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { type Command } from "commander";
import yaml from "js-yaml";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { extractJsonText } from "./agent-response.js";
import { collectResolvedDeliverables, loadCatalogDocs } from "./catalog-build.js";
import { isTrashedPath, resolveBasePath } from "./catalog-paths.js";
import { resolveViewpointsDoc } from "./review-plan.js";
import type { GradeRubric, ReviewViewpoint, ReviewViewpointsDoc } from "./review-types.js";
import {
  assertValidActor,
  getProjectCatalogPath,
  getProjectExecutionPath,
  getProjectViewpointsPath,
  loadConfig,
  loadMemberRoster,
  specdojoRootDir,
  type MemberRoster,
  type SpecDojoProjectConfig,
} from "./specdojo-config.js";
import { listFilesRecursive } from "./exec-shared.js";

export type GradeTarget = "kata" | "deliverable";
export type GradeSeverity = "blocker" | "major" | "minor" | "note";
export type GradeVerdict = "pass" | "needs-work" | "fail";

export type GradeTargetFilters = {
  changedOnly?: boolean;
  verdict?: GradeVerdict;
  minScore?: number;
  maxFindings?: number;
  ungraded?: boolean;
  incomplete?: boolean;
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
  message: string;
  line?: number;
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

type MarkdownDocument = {
  data: Record<string, unknown>;
  body: string;
};

const FINDING_RE =
  /^[ \t]*<!--[ \t]*specdojo:finding[ \t]+id=([^ \t]+)[ \t]+severity=(blocker|major|minor|note)[ \t]+rule=([^ \t]+)(?:[ \t]+line=([1-9][0-9]*))?[ \t]+(.*?)[ \t]*-->[ \t]*(?:\r?\n|$)/gm;
const KATA_DIRS = ["rulebooks", "recipes", "samples", "templates"] as const;
const KATA_REFERENCE_EXTENSIONS = new Set([".md", ".yaml", ".yml", ".json"]);
const KATA_REFERENCE_FIELDS = ["rulebook", "recipe", "sample", "template"] as const;
const CRITERION_ID_RE = /^DC-[0-9]{3,}$/;
const CRITERION_STATUSES: readonly GradeCriterionStatus[] = ["satisfied", "unsatisfied"];
const DONE_CRITERIA_SCHEMA = "docs/specdojo/schemas/v1/grade-done-criteria.schema.yaml";
const GRADE_PLACEHOLDER = "__SPECDOJO_GRADE_FLOW_PLACEHOLDER__";
const GRADE_FINDINGS_PLACEHOLDER = "__SPECDOJO_GRADE_FINDINGS_FLOW_PLACEHOLDER__";
const GRADE_UNSATISFIED_PLACEHOLDER = "__SPECDOJO_GRADE_UNSATISFIED_BLOCK_PLACEHOLDER__";
const SEVERITY_LEVEL_CAP: Record<GradeSeverity, number> = {
  blocker: 0,
  major: 2,
  minor: 3,
  note: 4,
};

function preservePreviousFindingSeverities(
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

function levelCapForFindings(findings: readonly GradeFindingInput[]): number {
  const majorCount = findings.filter((finding) => finding.severity === "major").length;
  const severityCap = findings.reduce(
    (current, finding) => Math.min(current, SEVERITY_LEVEL_CAP[finding.severity]),
    4,
  );
  return majorCount >= 2 ? Math.min(severityCap, 1) : severityCap;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseMarkdown(content: string, path: string): MarkdownDocument {
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

function serializeMarkdown(document: MarkdownDocument): string {
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

function withoutFindingComments(body: string): string {
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

function stableContentHash(document: MarkdownDocument): string {
  const cloned = structuredClone(document.data);
  const specdojo = isRecord(cloned.specdojo) ? cloned.specdojo : {};
  delete specdojo.grade;
  return createHash("sha256")
    .update(yaml.dump(cloned, { sortKeys: true, noRefs: true, lineWidth: -1 }))
    .update("\n")
    .update(normalizeContentForHash(withoutFindingComments(document.body)))
    .digest("hex");
}

function sanitizeCommentText(value: string): string {
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

function insertFindings(body: string, viewpoints: GradeViewpointInput[]): string {
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

function resolveProject(projectOption?: string): {
  id: string;
  project: SpecDojoProjectConfig;
} {
  const { config } = loadConfig();
  if (!config) throw new Error("grade commands require .specdojo/specdojo.config.json");
  const id =
    projectOption?.trim() || config.current_project || Object.keys(config.projects)[0] || "";
  const project = config.projects[id];
  if (!project) throw new Error(`Unknown project: ${id}`);
  return { id, project };
}

function loadViewpoints(projectOption?: string): ReviewViewpointsDoc {
  const { project } = resolveProject(projectOption);
  const path = getProjectViewpointsPath(project);
  if (!path) throw new Error("viewpoints_path is required for grade");
  return resolveViewpointsDoc(resolve(specdojoRootDir(), path));
}

export function resolveGradeActor(actor: string, roster: MemberRoster | null): string {
  const normalized = actor.trim();
  if (!normalized) throw new Error("--by must be a non-empty pm-members.yaml nickname");
  if (!roster) throw new Error("members_path is required for grade apply --by");
  assertValidActor(normalized, roster);
  if (roster.members.filter((member) => member.nickname === normalized).length !== 1) {
    throw new Error(`Duplicate actor nickname in members_path: ${normalized}`);
  }
  return normalized;
}

function assertRubric(doc: ReviewViewpointsDoc): GradeRubric {
  const rubric = doc.grade_rubric;
  if (!rubric) throw new Error("Resolved viewpoints do not define grade_rubric");
  return rubric;
}

function relativePathFromRoot(path: string, rootDir: string): string {
  return relative(rootDir, path).replace(/\\/g, "/");
}

function repoRelativePath(path: string): string {
  return relativePathFromRoot(path, specdojoRootDir());
}

type KataReference = {
  id: string;
  path: string;
  kind: (typeof KATA_DIRS)[number];
  references: string[];
};

function referenceIds(metadata: Record<string, unknown>): string[] {
  return KATA_REFERENCE_FIELDS.flatMap((field) => {
    const value = metadata[field];
    if (typeof value === "string") return [value];
    if (Array.isArray(value))
      return value.filter((item): item is string => typeof item === "string");
    return [];
  }).filter((id) => id !== "none" && id !== "undecided");
}

function parseKataReference(path: string, kind: KataReference["kind"]): KataReference | null {
  try {
    const extension = extname(path).toLowerCase();
    let metadata: Record<string, unknown>;
    if (extension === ".md") {
      metadata = parseMarkdown(readFileSync(path, "utf8"), repoRelativePath(path)).data
        .specdojo as Record<string, unknown>;
    } else {
      const parsed = yaml.load(readFileSync(path, "utf8"));
      if (!isRecord(parsed)) return null;
      metadata = isRecord(parsed.specdojo) ? parsed.specdojo : parsed;
    }
    const id = typeof metadata.id === "string" ? metadata.id.trim() : "";
    if (!id) return null;
    return { id, path, kind, references: referenceIds(metadata) };
  } catch {
    // Some reusable snippets in Kata directories are Markdown fragments rather than documents.
    return null;
  }
}

function loadKataReferences(): KataReference[] {
  const root = specdojoRootDir();
  return KATA_DIRS.flatMap((kind) =>
    listFilesRecursive(join(root, "docs/ja/specdojo", kind))
      .filter((path) => KATA_REFERENCE_EXTENSIONS.has(extname(path).toLowerCase()))
      .flatMap((path) => {
        const reference = parseKataReference(path, kind);
        return reference ? [reference] : [];
      }),
  );
}

function resolveGradeReferencePathsFromCatalog(path: string, catalog: KataReference[]): string[] {
  const target = resolveSafeMarkdownPath(path);
  const targetDocument = parseMarkdown(readFileSync(target, "utf8"), repoRelativePath(target));
  const targetMetadata = targetDocument.data.specdojo as Record<string, unknown>;
  const targetId = typeof targetMetadata.id === "string" ? targetMetadata.id.trim() : "";
  if (!targetId) return [];

  const byId = new Map(catalog.map((item) => [item.id, item]));
  const selected = new Map<string, KataReference>();
  const add = (item: KataReference | undefined) => {
    if (item && item.path !== target) selected.set(item.id, item);
  };

  for (const id of referenceIds(targetMetadata)) add(byId.get(id));
  for (const item of catalog) if (item.references.includes(targetId)) add(item);

  // A document and the directly linked rulebook/recipe form the anchor of a Kata set.
  // Follow their declared links, but do not recursively traverse sibling back-links.
  for (let depth = 0; depth < 2; depth += 1) {
    for (const item of [...selected.values()]) {
      if (item.kind !== "rulebooks" && item.kind !== "recipes") continue;
      for (const id of item.references) add(byId.get(id));
    }
  }
  return [...selected.values()].map((item) => item.path).sort();
}

export function resolveGradeReferencePaths(path: string): string[] {
  return resolveGradeReferencePathsFromCatalog(path, loadKataReferences());
}

function gradeReferenceExampleFamily(
  target: GradeTarget,
  path: string,
  metadata: Record<string, unknown>,
): string | null {
  if (target === "kata") {
    const rel = repoRelativePath(path);
    const kind = KATA_DIRS.find((candidate) => rel.startsWith(`docs/ja/specdojo/${candidate}/`));
    if (kind) return kind;
  }
  const type = typeof metadata.type === "string" ? metadata.type.trim() : "";
  return type || null;
}

type GradeReferenceExample = {
  path: string;
  family: string | null;
  status: string;
};

function parseGradeReferenceExample(
  path: string,
  target: GradeTarget,
): GradeReferenceExample | null {
  try {
    const absolute = resolveSafeMarkdownPath(path);
    const document = parseMarkdown(readFileSync(absolute, "utf8"), repoRelativePath(absolute));
    const metadata = document.data.specdojo as Record<string, unknown>;
    return {
      path: absolute,
      family: gradeReferenceExampleFamily(target, absolute, metadata),
      status: typeof metadata.status === "string" ? metadata.status.trim() : "",
    };
  } catch {
    return null;
  }
}

function selectGradeReferenceExampleFromCatalog(opts: {
  target: GradeTarget;
  path: string;
  candidates: GradeReferenceExample[];
  random?: () => number;
}): string | undefined {
  const target = resolveSafeMarkdownPath(opts.path);
  const targetDocument = parseMarkdown(readFileSync(target, "utf8"), repoRelativePath(target));
  const targetMetadata = targetDocument.data.specdojo as Record<string, unknown>;
  const family = gradeReferenceExampleFamily(opts.target, target, targetMetadata);
  if (!family) return undefined;

  // 同種別だけを候補にする。種別が違うと構造も目的も異なり、記載水準の基準として
  // 誤りを招く。template はプレースホルダを正解と誤解させ、rulebook は recipe の
  // 基準にならない。該当がなければリファレンスなしで評価する。
  const candidates = opts.candidates
    .filter(
      (candidate) =>
        candidate.path !== target && candidate.family === family && candidate.status === "ready",
    )
    .map((candidate) => candidate.path)
    .sort();
  if (candidates.length === 0) return undefined;

  const random = opts.random ?? Math.random;
  const sample = random();
  const normalizedSample = Number.isFinite(sample) ? Math.max(0, sample) : 0;
  const index = Math.min(Math.floor(normalizedSample * candidates.length), candidates.length - 1);
  return candidates[index];
}

export function selectGradeReferenceExample(opts: {
  target: GradeTarget;
  path: string;
  candidates: string[];
  random?: () => number;
}): string | undefined {
  return selectGradeReferenceExampleFromCatalog({
    ...opts,
    candidates: opts.candidates.flatMap((candidate) => {
      const parsed = parseGradeReferenceExample(candidate, opts.target);
      return parsed ? [parsed] : [];
    }),
  });
}

function resolveSafeMarkdownPath(input: string, root = specdojoRootDir()): string {
  const absolute = resolve(root, input);
  const rel = relativePathFromRoot(absolute, root);
  if (rel.startsWith("../") || isAbsolute(rel))
    throw new Error(`Path is outside repository: ${input}`);
  if (extname(absolute).toLowerCase() !== ".md") {
    throw new Error(`${input}: grade currently writes inline findings only for Markdown`);
  }
  if (!existsSync(absolute)) throw new Error(`Document not found: ${input}`);
  return absolute;
}

function resolveSafeRepositoryPath(input: string, option: string): string {
  const root = specdojoRootDir();
  const absolute = resolve(root, input);
  const rel = relative(root, absolute);
  if (rel.startsWith("../") || isAbsolute(rel)) {
    throw new Error(`${option} must be inside the repository`);
  }
  return absolute;
}

function isGeneratedGradeTarget(path: string, rootDir = specdojoRootDir()): boolean {
  return relativePathFromRoot(path, rootDir).split("/").includes("generated");
}

function isTrashedGradeTarget(path: string, rootDir = specdojoRootDir()): boolean {
  return isTrashedPath(relativePathFromRoot(path, rootDir));
}

type DeliverableCatalogEntry = {
  path: string;
  localId: string;
  doneCriteria: GradeDoneCriterion[];
};

function criterionId(index: number): string {
  return `DC-${String(index + 1).padStart(3, "0")}`;
}

// カタログの Markdown 成果物を絶対パスで引ける形にする。grade の対象探索と
// done_criteria の解決が同じ集合を見るよう、両者はこの関数を共有する。
function loadDeliverableCatalog(
  projectOption?: string,
  root = specdojoRootDir(),
): Map<string, DeliverableCatalogEntry> {
  const { project } = resolveProject(projectOption);
  const catalog = getProjectCatalogPath(project);
  if (!catalog) throw new Error("catalog_path is required for deliverable grading");
  const entries = new Map<string, DeliverableCatalogEntry>();
  for (const loaded of loadCatalogDocs(resolve(root, catalog))) {
    const resolved: Parameters<typeof collectResolvedDeliverables>[2] = [];
    collectResolvedDeliverables(
      loaded.doc.groups,
      resolveBasePath("", loaded.doc.base_path),
      resolved,
    );
    for (const item of resolved) {
      if (item.item.kind === "generated" || !item.item.path) continue;
      if (!item.resolvedPath.endsWith(".md")) continue;
      if (isTrashedPath(item.resolvedPath)) continue;
      const path = resolve(root, item.resolvedPath);
      if (!existsSync(path) || entries.has(path)) continue;
      entries.set(path, {
        path,
        localId: item.item.local_id,
        doneCriteria: (item.item.done_criteria ?? []).map((criterion, index) => ({
          id: criterionId(index),
          text: criterion.text,
          roles: [...criterion.roles],
          viewpoint: criterion.viewpoint,
        })),
      });
    }
  }
  return entries;
}

// 成果物ごとの done_criteria 定義を、submission が使うリポジトリ相対パスで引ける形にする。
// カタログに無い文書（--path で明示した非カタログ文書）は含めず、plan と apply は
// 定義が無い文書を「完了条件なし」として扱う。
export function resolveDeliverableDoneCriteria(
  paths: readonly string[],
  projectOption?: string,
): Map<string, GradeDoneCriterion[]> {
  const catalog = loadDeliverableCatalog(projectOption);
  const result = new Map<string, GradeDoneCriterion[]>();
  for (const path of paths) {
    const entry = catalog.get(resolveSafeMarkdownPath(path));
    if (entry && entry.doneCriteria.length > 0) {
      result.set(repoRelativePath(entry.path), entry.doneCriteria);
    }
  }
  return result;
}

function gradePipelineStateDirectory(projectOption?: string, rootDir = specdojoRootDir()): string {
  const { project } = resolveProject(projectOption);
  return resolve(rootDir, getProjectExecutionPath(project), "grade", "pipeline");
}

function gradePipelineStatePath(
  documentPath: string,
  projectOption?: string,
  rootDir = specdojoRootDir(),
): string {
  const relativeDocument = relativePathFromRoot(resolve(rootDir, documentPath), rootDir);
  const stem = basename(relativeDocument, extname(relativeDocument)).replace(
    /[^A-Za-z0-9._-]/g,
    "-",
  );
  const digest = createHash("sha256").update(relativeDocument).digest("hex").slice(0, 12);
  return join(gradePipelineStateDirectory(projectOption, rootDir), `${stem}-${digest}.json`);
}

function parseGradePipelineState(value: unknown, path: string): GradePipelineState {
  if (!isRecord(value)) throw new Error(`${path}: grade pipeline state must be an object`);
  const integer = (key: keyof GradePipelineState, minimum: number): number => {
    const candidate = value[key];
    if (!Number.isSafeInteger(candidate) || (candidate as number) < minimum) {
      throw new Error(`${path}: ${key} must be an integer >= ${minimum}`);
    }
    return candidate as number;
  };
  const text = (key: keyof GradePipelineState): string => {
    const candidate = value[key];
    if (typeof candidate !== "string" || !candidate.trim()) {
      throw new Error(`${path}: ${key} must be a non-empty string`);
    }
    return candidate;
  };
  const target = value.target;
  if (target !== "kata" && target !== "deliverable") {
    throw new Error(`${path}: target must be kata or deliverable`);
  }
  const stageFailed = value.stage_failed;
  if (stageFailed !== null && (!Number.isSafeInteger(stageFailed) || (stageFailed as number) < 1)) {
    throw new Error(`${path}: stage_failed must be null or a positive integer`);
  }
  const state: GradePipelineState = {
    version: integer("version", 1) as 1,
    project_id: text("project_id"),
    target,
    document: text("document"),
    content_hash: text("content_hash"),
    stage_completed: integer("stage_completed", 0),
    stage_failed: stageFailed as number | null,
    stage_total: integer("stage_total", 1),
    consecutive_failures: integer("consecutive_failures", 0),
    max_failures: integer("max_failures", 1),
    last_run_id: text("last_run_id"),
    updated_at: text("updated_at"),
  };
  if (state.version !== 1) throw new Error(`${path}: unsupported grade pipeline state version`);
  if (!/^[a-f0-9]{64}$/.test(state.content_hash)) {
    throw new Error(`${path}: content_hash must be a SHA-256 hex digest`);
  }
  if (
    isAbsolute(state.document) ||
    !state.document.startsWith("docs/") ||
    state.document.split("/").includes("..")
  ) {
    throw new Error(`${path}: document must be a repository-relative path below docs/`);
  }
  if (state.stage_completed >= state.stage_total) {
    throw new Error(`${path}: completed pipeline state must be removed`);
  }
  if (state.stage_failed !== null && state.stage_failed !== state.stage_completed + 1) {
    throw new Error(`${path}: stage_failed must immediately follow stage_completed`);
  }
  if (
    (state.stage_failed === null && state.consecutive_failures !== 0) ||
    (state.stage_failed !== null && state.consecutive_failures < 1)
  ) {
    throw new Error(`${path}: consecutive_failures does not match stage_failed`);
  }
  return state;
}

function loadGradePipelineStates(
  projectOption?: string,
  rootDir = specdojoRootDir(),
): Map<string, GradePipelineState> {
  const states = new Map<string, GradePipelineState>();
  const projectId = resolveProject(projectOption).id;
  for (const path of listFilesRecursive(gradePipelineStateDirectory(projectOption, rootDir))) {
    if (!path.endsWith(".json")) continue;
    const state = parseGradePipelineState(
      JSON.parse(readFileSync(path, "utf8")),
      relativePathFromRoot(path, rootDir),
    );
    if (state.project_id !== projectId) {
      throw new Error(`${relativePathFromRoot(path, rootDir)}: project_id must be ${projectId}`);
    }
    states.set(state.document, state);
  }
  return states;
}

function currentGradePipelineState(
  document: MarkdownDocument,
  path: string,
  state: GradePipelineState | undefined,
  target?: GradeTarget,
): GradePipelineState | undefined {
  if (!state || state.document !== path || (target !== undefined && state.target !== target)) {
    return undefined;
  }
  return state.content_hash === stableContentHash(document) ? state : undefined;
}

function isIncompleteGradePipelineState(state: GradePipelineState | undefined): boolean {
  return state !== undefined && state.consecutive_failures < state.max_failures;
}

export function readGradePipelineState(opts: {
  target: GradeTarget;
  project?: string;
  path: string;
}): GradePipelineState | undefined {
  const absolute = resolveSafeMarkdownPath(opts.path);
  const relativeDocument = repoRelativePath(absolute);
  const statePath = gradePipelineStatePath(relativeDocument, opts.project);
  if (!existsSync(statePath)) return undefined;
  const state = parseGradePipelineState(
    JSON.parse(readFileSync(statePath, "utf8")),
    repoRelativePath(statePath),
  );
  const projectId = resolveProject(opts.project).id;
  if (state.project_id !== projectId) {
    throw new Error(`${repoRelativePath(statePath)}: project_id must be ${projectId}`);
  }
  const document = parseMarkdown(readFileSync(absolute, "utf8"), relativeDocument);
  return currentGradePipelineState(document, relativeDocument, state, opts.target);
}

export function listExhaustedGradePipelineStates(opts: {
  target: GradeTarget;
  project?: string;
}): GradePipelineState[] {
  const states = loadGradePipelineStates(opts.project);
  return [...states.values()]
    .filter((state) => {
      if (state.target !== opts.target || state.consecutive_failures < state.max_failures)
        return false;
      const absolute = resolve(specdojoRootDir(), state.document);
      if (!existsSync(absolute)) return false;
      const document = parseMarkdown(readFileSync(absolute, "utf8"), state.document);
      return currentGradePipelineState(document, state.document, state, opts.target) !== undefined;
    })
    .sort((left, right) => left.document.localeCompare(right.document));
}

export function recordGradePipelineStage(opts: {
  target: GradeTarget;
  project?: string;
  path: string;
  runId: string;
  stage: number;
  stageTotal: number;
  maxFailures: number;
  status: "passed" | "failed" | "complete";
  now?: Date;
}): GradePipelineState | undefined {
  const absolute = resolveSafeMarkdownPath(opts.path);
  const relativeDocument = repoRelativePath(absolute);
  const statePath = gradePipelineStatePath(relativeDocument, opts.project);
  if (opts.status === "complete") {
    if (existsSync(statePath)) unlinkSync(statePath);
    return undefined;
  }
  if (
    !Number.isSafeInteger(opts.stage) ||
    opts.stage < 1 ||
    !Number.isSafeInteger(opts.stageTotal) ||
    opts.stageTotal < opts.stage ||
    !Number.isSafeInteger(opts.maxFailures) ||
    opts.maxFailures < 1
  ) {
    throw new Error("grade pipeline stage, total, and failure limit are invalid");
  }
  const document = parseMarkdown(readFileSync(absolute, "utf8"), relativeDocument);
  const previous = readGradePipelineState({
    target: opts.target,
    project: opts.project,
    path: relativeDocument,
  });
  const previousCompleted = previous?.stage_completed ?? 0;
  if (opts.stage !== previousCompleted + 1) {
    throw new Error(
      `grade pipeline stage ${opts.stage} must immediately follow completed stage ${previousCompleted}`,
    );
  }
  const stageCompleted =
    opts.status === "passed" ? opts.stage : Math.min(previousCompleted, opts.stage - 1);
  if (stageCompleted >= opts.stageTotal) {
    if (existsSync(statePath)) unlinkSync(statePath);
    return undefined;
  }
  const state: GradePipelineState = {
    version: 1,
    project_id: resolveProject(opts.project).id,
    target: opts.target,
    document: relativeDocument,
    content_hash: stableContentHash(document),
    stage_completed: stageCompleted,
    stage_failed: opts.status === "failed" ? opts.stage : null,
    stage_total: opts.stageTotal,
    consecutive_failures:
      opts.status === "failed"
        ? previous?.stage_failed === opts.stage
          ? previous.consecutive_failures + 1
          : 1
        : 0,
    max_failures: opts.maxFailures,
    last_run_id: opts.runId,
    updated_at: (opts.now ?? new Date()).toISOString(),
  };
  mkdirSync(dirname(statePath), { recursive: true });
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
  return state;
}

export function discoverGradeTargets(
  opts: {
    target: GradeTarget;
    project?: string;
    paths?: string[];
  } & GradeTargetFilters,
  rootDir = specdojoRootDir(),
): string[] {
  validateGradeTargetFilters(opts);
  let candidates: string[];
  if (opts.paths && opts.paths.length > 0) {
    candidates = opts.paths.map((path) => resolveSafeMarkdownPath(path, rootDir));
    const generated = candidates.find((path) => isGeneratedGradeTarget(path, rootDir));
    if (generated) {
      throw new Error(
        `${relativePathFromRoot(generated, rootDir)}: generated documents cannot be graded`,
      );
    }
    const trashed = candidates.find((path) => isTrashedGradeTarget(path, rootDir));
    if (trashed) {
      throw new Error(
        `${relativePathFromRoot(trashed, rootDir)}: trashed documents cannot be graded`,
      );
    }
  } else if (opts.target === "kata") {
    candidates = KATA_DIRS.flatMap((dir) =>
      listFilesRecursive(join(rootDir, "docs/ja/specdojo", dir)).filter((path) =>
        path.endsWith(".md"),
      ),
    );
  } else {
    candidates = [...loadDeliverableCatalog(opts.project, rootDir).keys()];
  }
  const unique = [...new Set(candidates)]
    .filter((path) => !isGeneratedGradeTarget(path, rootDir))
    .filter((path) => !isTrashedGradeTarget(path, rootDir))
    .sort();
  if (
    !opts.changedOnly &&
    opts.verdict === undefined &&
    opts.minScore === undefined &&
    opts.maxFindings === undefined &&
    !opts.ungraded &&
    !opts.incomplete
  ) {
    return unique;
  }
  const pipelineStates = opts.incomplete
    ? loadGradePipelineStates(opts.project, rootDir)
    : new Map<string, GradePipelineState>();
  return unique.filter((path) => {
    const rel = relativePathFromRoot(path, rootDir);
    const document = parseMarkdown(readFileSync(path, "utf8"), rel);
    const pipelineState = currentGradePipelineState(
      document,
      rel,
      pipelineStates.get(rel),
      opts.target,
    );
    return matchesParsedGradeTargetFilters(
      document,
      rel,
      opts,
      isIncompleteGradePipelineState(pipelineState),
    );
  });
}

function validateGradeTargetFilters(filters: GradeTargetFilters): void {
  if (
    filters.verdict !== undefined &&
    filters.verdict !== "pass" &&
    filters.verdict !== "needs-work" &&
    filters.verdict !== "fail"
  ) {
    throw new Error("--verdict must be pass, needs-work, or fail");
  }
  if (
    filters.minScore !== undefined &&
    (!Number.isSafeInteger(filters.minScore) || filters.minScore < 0 || filters.minScore > 100)
  ) {
    throw new Error("--min-score must be an integer between 0 and 100");
  }
  if (
    filters.maxFindings !== undefined &&
    (!Number.isSafeInteger(filters.maxFindings) || filters.maxFindings < 0)
  ) {
    throw new Error("--max-findings must be a non-negative integer");
  }
  if (
    filters.ungraded &&
    (filters.verdict !== undefined ||
      filters.minScore !== undefined ||
      filters.maxFindings !== undefined)
  ) {
    throw new Error("--ungraded cannot be combined with --verdict, --min-score, or --max-findings");
  }
}

function storedGradeScore(grade: Record<string, unknown>, path: string): number {
  const score = grade.score;
  if (!Number.isSafeInteger(score) || (score as number) < 0 || (score as number) > 100) {
    throw new Error(`${path}: specdojo.grade.score must be an integer between 0 and 100`);
  }
  return score as number;
}

function storedFindingCount(grade: Record<string, unknown>, path: string): number {
  const findings = grade.findings;
  if (!isRecord(findings)) throw new Error(`${path}: specdojo.grade.findings is missing`);
  return (["blocker", "major", "minor", "note"] as const).reduce((total, severity) => {
    const count = findings[severity];
    if (!Number.isSafeInteger(count) || (count as number) < 0) {
      throw new Error(
        `${path}: specdojo.grade.findings.${severity} must be a non-negative integer`,
      );
    }
    return total + (count as number);
  }, 0);
}

function matchesParsedGradeTargetFilters(
  document: MarkdownDocument,
  path: string,
  filters: GradeTargetFilters,
  incomplete = false,
): boolean {
  const specdojo = document.data.specdojo as Record<string, unknown>;
  const grade = isRecord(specdojo.grade) ? specdojo.grade : undefined;
  if (filters.incomplete && !incomplete) return false;
  if (filters.ungraded && grade !== undefined) return false;
  if (filters.verdict !== undefined && grade?.verdict !== filters.verdict) return false;
  if (
    filters.minScore !== undefined &&
    (grade === undefined || storedGradeScore(grade, path) < filters.minScore)
  ) {
    return false;
  }
  if (
    filters.maxFindings !== undefined &&
    (grade === undefined || storedFindingCount(grade, path) > filters.maxFindings)
  ) {
    return false;
  }
  return !filters.changedOnly || grade?.content_hash !== stableContentHash(document);
}

export function matchesGradeTargetFilters(
  content: string,
  path: string,
  filters: GradeTargetFilters,
  pipelineState?: GradePipelineState,
): boolean {
  validateGradeTargetFilters(filters);
  const document = parseMarkdown(content, path);
  const currentState = currentGradePipelineState(document, path, pipelineState);
  return matchesParsedGradeTargetFilters(
    document,
    path,
    filters,
    isIncompleteGradePipelineState(currentState),
  );
}

function continuousViewpoints(doc: ReviewViewpointsDoc, target: GradeTarget): ReviewViewpoint[] {
  return (doc.viewpoints ?? []).filter(
    (viewpoint) =>
      viewpoint.continuous === true &&
      viewpoint.evaluation !== "human" &&
      (viewpoint.grade_targets === undefined || viewpoint.grade_targets.includes(target)),
  );
}

function agentViewpoints(doc: ReviewViewpointsDoc, target: GradeTarget): ReviewViewpoint[] {
  return continuousViewpoints(doc, target).filter((viewpoint) => viewpoint.evaluation === "agent");
}

function deterministicResults(
  document: MarkdownDocument,
  definitions: ReviewViewpointsDoc,
  target: GradeTarget,
): GradeViewpointInput[] {
  const results: GradeViewpointInput[] = [];
  for (const viewpoint of continuousViewpoints(definitions, target).filter(
    (item) => item.evaluation === "deterministic",
  )) {
    const findings: GradeFindingInput[] = [];
    const specdojo = document.data.specdojo as Record<string, unknown>;
    if (viewpoint.id === "vp-arc-document-structure") {
      for (const key of ["id", "type", "status"] as const) {
        if (typeof specdojo[key] !== "string" || !String(specdojo[key]).trim()) {
          findings.push({
            severity: "major",
            message: `Frontmatter の specdojo.${key} が未設定です。`,
            line: 1,
          });
        }
      }
      if (!/^#\s+\S/m.test(document.body)) {
        findings.push({ severity: "major", message: "本文に H1 見出しがありません。", line: 1 });
      }
    }
    if (viewpoint.id === "vp-qe-config-validity") {
      const placeholderLine = document.body
        .split("\n")
        .findIndex((line) => /(?:_TODO_|_ASSUMPTION_)/.test(line));
      if (placeholderLine >= 0) {
        findings.push({
          severity: "major",
          message: "未解決の _TODO_ / _ASSUMPTION_ が残っています。",
          line: placeholderLine + 1,
        });
      }
    }
    const cap = levelCapForFindings(findings);
    results.push({ id: viewpoint.id, level: cap, findings });
  }
  return results;
}

function doneCriteriaPlanLines(
  doneCriteria: readonly GradeDoneCriterion[],
  definitions: ReviewViewpointsDoc,
): string[] {
  const titles = new Map(
    (definitions.viewpoints ?? []).map((viewpoint) => [viewpoint.id, viewpoint.title]),
  );
  return [
    "### 3.4. 完了条件（done_criteria）",
    "",
    "成果物カタログが対象へ宣言する完了条件である。viewpoint と rubric による level 判定とは別の軸として、各条件を現在の本文の根拠だけで `satisfied` / `unsatisfied` のどちらかに判定する。score や level の高低から充足を推論せず、条件文が要求する内容を本文で確認できるかだけで判定する。`roles` は条件の確認責任を持つ Role code、`viewpoint` は条件を見る観点であり、`evaluation: human` の観点に紐づく条件も本文の根拠で一次判定する。",
    "",
    ...doneCriteria.map((criterion) => {
      const title = titles.get(criterion.viewpoint);
      const viewpoint = title ? `${criterion.viewpoint}（${title}）` : criterion.viewpoint;
      return `- ${criterion.id} [roles=${criterion.roles.join(",")}; viewpoint=${viewpoint}]: ${criterion.text}`;
    }),
    "",
  ];
}

export function renderGradePlan(opts: {
  target: GradeTarget;
  path: string;
  references?: string[];
  referenceExample?: string;
  viewpoints: ReviewViewpointsDoc;
  projectId: string;
  doneCriteria?: GradeDoneCriterion[];
}): string {
  const rubric = assertRubric(opts.viewpoints);
  const viewpoints = agentViewpoints(opts.viewpoints, opts.target);
  const absolute = resolveSafeMarkdownPath(opts.path);
  const rel = repoRelativePath(absolute);
  const document = parseMarkdown(readFileSync(absolute, "utf8"), rel);
  const metadata = document.data.specdojo as Record<string, unknown>;
  const documentId = typeof metadata.id === "string" ? metadata.id : rel;
  const priorFindings = previousGradeFindings(document.body);
  const taskHash = createHash("sha256").update(rel).digest("hex").slice(0, 12).toUpperCase();
  const taskId = `GRADE-${opts.target.toUpperCase()}-${taskHash}`;
  const references = (opts.references ?? []).map((reference) =>
    repoRelativePath(resolveSafeRepositoryPath(reference, "reference")),
  );
  const referenceExample = opts.referenceExample
    ? repoRelativePath(resolveSafeMarkdownPath(opts.referenceExample))
    : undefined;
  const doneCriteria = opts.target === "deliverable" ? (opts.doneCriteria ?? []) : [];
  const lines = [
    "---",
    yaml
      .dump(
        {
          specdojo: {
            id: `${opts.projectId}:grade-${opts.target}-${taskHash.toLowerCase()}-plan`,
            type: "exec-plan",
            rulebook: "none",
            task_id: taskId,
            name: `grade: ${rel}`,
            mode: "review",
            status: "ready",
            project_id: opts.projectId,
            targets: [documentId],
          },
        },
        { lineWidth: 120, noRefs: true },
      )
      .trimEnd(),
    "---",
    "",
    `# Review Plan: ${taskId} grade: ${rel}`,
    "",
    "この plan は grade pipeline の executor stage 用である。評価と根拠の記述だけを行い、GradeSubmission JSON は作成しない。後続の reporter が判定内容を変更せず JSON へ構造化する。",
    "",
    "## 1. このタスクで行うこと",
    "",
    `評価対象 \`${rel}\` を共通 viewpoint と category rubric で 0-4 判定する。deterministic viewpoint は CLI が判定するため、agent の出力には含めない。`,
    "",
    "## 2. 対象項目",
    "",
    `- \`target\`: ${opts.target}`,
    `- \`rubric\`: ${rubric.id}`,
    `- \`document_id\`: ${documentId}`,
    `- \`評価対象\`: \`${rel}\``,
    "",
    "### 参考資料",
    "",
    "参考資料は評価対象ではなく、成果物間整合を判定するための材料である。参考資料自体を評価しない。",
    "",
    ...(references.length > 0 ? references.map((reference) => `- \`${reference}\``) : ["- なし"]),
    "",
    // 比較リファレンスは任意である。指定がない場合は節ごと省略する。空の節を残すと
    // 候補が存在しないのか指定していないのかを読み手が区別できない。
    ...(referenceExample
      ? [
          "### 良い実例（比較リファレンス）",
          "",
          "`status: ready` の文書から選んだ比較材料である。記載水準を具体化するために使い、評価対象へ含めず、内容を正解として機械的に模倣しない。`ready` は品質保証ではないため、実例自体の問題を評価対象へ転用しない。",
          "",
          `- \`${referenceExample}\``,
          "",
        ]
      : []),
    "## 3. 進め方",
    "",
    "1. 評価対象をファイル読み取りツールで全文読み、実行ログに読み取り操作を残す。plan に対象本文は埋め込まれていないため、この手順を省略しない。",
    "2. 参考資料と良い実例がある場合は列挙された全ファイルを全文読み、実行ログに各パスの読み取り操作を残す。参考資料や良い実例を評価対象と混同しない。",
    "3. 良い実例がある場合は、章ごとの具体性、根拠の密度、過不足を評価対象と比較して記載水準を判定する。表現の類似や実例自体の欠点を評価理由にせず、rubric と viewpoint を最終的な判定基準にする。",
    "4. 評価対象を次の rubric と viewpoint に照らし、各 viewpoint を 0-4 で判定する。ある viewpoint の finding の有無から、ほかの viewpoint の判定を推論しない。",
    "5. level 3 以下には finding を付ける。finding には severity（blocker / major / minor / note）、対象直前の本文行番号、具体的な修正理由を含める。line は Frontmatter を除く本文の1始まり（通常は H1 が1行目）とする。level 4 は finding なしとする。",
    "6. 前回の指摘を対象の現在内容と照合し、解消済みか確認する。未解消なら前回の message を変更せず今回の finding に含め、severity は前回と同等以上を指定する。前回の rule は前回評価時の分類として扱い、各 viewpoint は現在の根拠から独立に評価する。前回の問題が解消され、別の軽微な問題だけが残るため severity を引き下げる場合は、その根拠を新しい finding の message に含める。",
    "7. 前回の指摘の確認だけで終了せず、前回の指摘にない問題もすべての viewpoint で独立して検出する。",
    ...(doneCriteria.length > 0
      ? [
          "8. 完了条件（done_criteria）を1件ずつ本文の根拠と照合し、`satisfied` / `unsatisfied` を判定する。viewpoint の level や総合 score とは独立した判定であり、level が高いことを理由に条件を満たしたとみなさない。`unsatisfied` には不足している内容を1行で記す。",
        ]
      : []),
    "",
    "### 3.1. 前回の指摘",
    "",
    "対象文書に現在記録されている finding の事実情報を示す。",
    "",
    ...(priorFindings.length > 0
      ? ["```json", JSON.stringify(priorFindings, null, 2), "```"]
      : ["- なし"]),
    "",
    "### 3.2. Rubric",
    "",
    ...rubric.levels.map(
      (level) =>
        `- ${level.level} (${level.name}, review=${level.review_verdict}): ${level.description}`,
    ),
    "",
    "### 3.3. Viewpoints",
    "",
    ...viewpoints.map(
      (viewpoint) =>
        `- ${viewpoint.id} [${viewpoint.category}/${viewpoint.evaluation}]: ${viewpoint.check} Evidence: ${viewpoint.evidence}`,
    ),
    "",
    ...(doneCriteria.length > 0 ? doneCriteriaPlanLines(doneCriteria, opts.viewpoints) : []),
    "## 4. 完了手順",
    "",
    "1. すべての agent viewpoint の判定と、必要な finding が揃っていることを確認する。",
    "2. 最終応答では各 viewpoint を次のマーカーで1回ずつ宣言する。マーカー間には根拠や検討過程を自由形式で詳しく記述してよい。JSON、Markdown コードフェンス、GradeSubmission は出力しない。",
    "3. `LEVEL` と各 `FINDING` は reporter が忠実性を機械検証する申告値である。message は1行で具体的に記し、reporter が一字一句コピーできるようにする。finding がない場合は `FINDING` 行を記さない。",
    "4. すべての viewpoint marker、0-4 の level、level 3 以下の finding、severity と非空 message が揃っていることを確認する。",
    ...(doneCriteria.length > 0
      ? [
          "5. 完了条件は `[DONE_CRITERIA]` と `[END DONE_CRITERIA]` で囲んだブロックを1回だけ置き、列挙されたすべての条件 ID を1行ずつ `<ID>: satisfied` または `<ID>: unsatisfied: <不足内容>` の形で申告する。列挙にない ID を追加せず、ID を省略しない。",
        ]
      : []),
    "",
    "```text",
    ...viewpoints.flatMap((viewpoint) => [
      `[VIEWPOINT ${viewpoint.id}]`,
      "LEVEL: <0-4>",
      "根拠を自由形式で記述する。",
      "FINDING <severity> line=<line>: level 3 以下の場合だけ、具体的な修正理由を1行で記述する。",
      "[END VIEWPOINT]",
      "",
    ]),
    ...(doneCriteria.length > 0
      ? [
          "[DONE_CRITERIA]",
          ...doneCriteria.map(
            (criterion) => `${criterion.id}: <satisfied|unsatisfied>: 不足内容を1行で記述する。`,
          ),
          "[END DONE_CRITERIA]",
          "",
        ]
      : []),
    "```",
    "",
    "## 5. 異常終了の条件",
    "",
    "- 評価対象、参考資料、または良い実例を読み取れない場合は、内容を推測せず異常終了する。",
    "- rubric または viewpoint に不足があり、全項目を判定できない場合は異常終了する。",
    "- すべての viewpoint の level と finding を申告できない場合は異常終了する。",
    ...(doneCriteria.length > 0
      ? ["- 列挙された完了条件のいずれかを判定できない場合は異常終了する。"]
      : []),
  ];
  return `${lines.join("\n")}\n`;
}

export function renderGradeReporterPlan(opts: {
  target: GradeTarget;
  path: string;
  viewpoints: ReviewViewpointsDoc;
  projectId: string;
  doneCriteria?: GradeDoneCriterion[];
}): string {
  const rubric = assertRubric(opts.viewpoints);
  const viewpoints = agentViewpoints(opts.viewpoints, opts.target);
  const absolute = resolveSafeMarkdownPath(opts.path);
  const rel = repoRelativePath(absolute);
  const document = parseMarkdown(readFileSync(absolute, "utf8"), rel);
  const metadata = document.data.specdojo as Record<string, unknown>;
  const documentId = typeof metadata.id === "string" ? metadata.id : rel;
  const taskHash = createHash("sha256").update(rel).digest("hex").slice(0, 12).toUpperCase();
  const taskId = `GRADE-${opts.target.toUpperCase()}-${taskHash}-REPORTER`;
  const doneCriteria = opts.target === "deliverable" ? (opts.doneCriteria ?? []) : [];
  const lines = [
    "---",
    yaml
      .dump(
        {
          specdojo: {
            id: `${opts.projectId}:grade-${opts.target}-${taskHash.toLowerCase()}-reporter-plan`,
            type: "exec-plan",
            rulebook: "none",
            task_id: taskId,
            name: `grade reporter: ${rel}`,
            mode: "review",
            status: "ready",
            project_id: opts.projectId,
            targets: [documentId],
          },
        },
        { lineWidth: 120, noRefs: true },
      )
      .trimEnd(),
    "---",
    "",
    `# Reporter Plan: ${taskId} grade: ${rel}`,
    "",
    "この plan は grade pipeline の reporter stage 用である。executor の最終応答が `<grade_executor_output>` としてこの plan と一緒に渡される。評価やファイル読み取りは行わず、申告済みの判定を GradeSubmission JSON へ忠実に構造化する。",
    "",
    "## 1. このタスクで行うこと",
    "",
    "executor が申告した全 viewpoint の level と finding を、追加・省略・変更せず GradeSubmission JSON へ写す。",
    "",
    "## 2. 対象項目",
    "",
    `- \`target\`: ${opts.target}`,
    `- \`rubric\`: ${rubric.id}`,
    `- \`document_id\`: ${documentId}`,
    `- \`評価対象\`: \`${rel}\``,
    "",
    "## 3. 進め方",
    "",
    "1. `<grade_executor_output>` の `[VIEWPOINT <id>]` ごとに `LEVEL` とすべての `FINDING` を読み取る。対象文書や参考資料は読まない。",
    "2. level、severity、line、message を executor の申告どおりにコピーする。message の要約、言い換え、校正を行わない。",
    "3. executor が述べていない finding を追加せず、述べた finding を省略しない。finding の `id` は出力しない。",
    "4. marker が欠けている、値が曖昧、または GradeSubmission の検証規則と矛盾する場合は推測せず異常終了する。",
    ...(doneCriteria.length > 0
      ? [
          "5. `[DONE_CRITERIA]` ブロックの各行を `done_criteria` へ写す。`id` と `status`（`satisfied` / `unsatisfied`）は申告どおりにコピーし、`unsatisfied` に続く不足内容は `reason` へ一字一句コピーする。条件の追加・省略・判定変更を行わない。",
        ]
      : []),
    "",
    "## 4. 完了手順",
    "",
    "1. facts である `rubric` と `path` を次のテンプレートから変更しない。",
    "2. すべての agent viewpoint が1回ずつあり、level と finding が executor の申告と一致することを確認する。",
    ...(doneCriteria.length > 0
      ? [
          "3. `done_criteria` の各要素が executor の申告した ID と status に一致することを確認する。",
          "4. 正常終了時の最終応答は GradeSubmission JSON オブジェクト1個だけとする。前置き、要約、Markdown コードフェンスを含めない。",
        ]
      : [
          "3. 正常終了時の最終応答は GradeSubmission JSON オブジェクト1個だけとする。前置き、要約、Markdown コードフェンスを含めない。",
        ]),
    "",
    "```json",
    JSON.stringify(
      {
        rubric: rubric.id,
        documents: [
          {
            path: rel,
            viewpoints: viewpoints.map((viewpoint) => ({
              id: viewpoint.id,
              level: 4,
              findings: [],
            })),
            ...(doneCriteria.length > 0
              ? {
                  done_criteria: doneCriteria.map((criterion) => ({
                    id: criterion.id,
                    status: "satisfied",
                  })),
                }
              : {}),
          },
        ],
      },
      null,
      2,
    ),
    "```",
    "",
    "## 5. 異常終了の条件",
    "",
    "- `<grade_executor_output>` が渡されていない、または marker 契約を解析できない場合は異常終了する。",
    "- executor の申告を変更しなければ GradeSubmission の契約を満たせない場合は異常終了する。",
  ];
  return `${lines.join("\n")}\n`;
}

function gradePlanFilename(path: string): string {
  const rel = repoRelativePath(path);
  const stem = basename(path, extname(path))
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const hash = createHash("sha256").update(rel).digest("hex").slice(0, 10);
  return `${stem || "document"}-${hash}-grade-plan.md`;
}

function gradeReporterPlanFilename(path: string): string {
  return gradePlanFilename(path).replace(/-grade-plan\.md$/, "-grade-reporter-plan.md");
}

export function writeGradePlans(opts: {
  target: GradeTarget;
  paths: string[];
  referenceExampleCandidates: string[];
  // 明示指定があれば選定を行わず固定する。比較実験では選定の揺れを排除する必要があり、
  // 運用でも特定の実例へ水準を揃えたい場合がある。
  referenceExampleOverride?: string;
  viewpoints: ReviewViewpointsDoc;
  projectId: string;
  outputDirectory: string;
  random?: () => number;
  // リポジトリ相対パスをキーにした done_criteria 定義。deliverable の plan だけが使う。
  doneCriteriaByPath?: ReadonlyMap<string, GradeDoneCriterion[]>;
}): {
  path: string;
  changed: boolean;
  reporterPath: string;
  reporterChanged: boolean;
  target: string;
  referenceExample?: string;
}[] {
  const outputDirectory = resolveSafeRepositoryPath(opts.outputDirectory, "--out");
  if (opts.paths.length === 0) return [];
  mkdirSync(outputDirectory, { recursive: true });
  const kataReferences = loadKataReferences();
  const referenceExamples = opts.referenceExampleCandidates.flatMap((candidate) => {
    const parsed = parseGradeReferenceExample(candidate, opts.target);
    return parsed ? [parsed] : [];
  });
  return opts.paths.map((path) => {
    const absolute = resolveSafeMarkdownPath(path);
    const output = join(outputDirectory, gradePlanFilename(absolute));
    const reporterOutput = join(outputDirectory, gradeReporterPlanFilename(absolute));
    const referenceExample =
      opts.referenceExampleOverride ??
      selectGradeReferenceExampleFromCatalog({
        target: opts.target,
        path: absolute,
        candidates: referenceExamples,
        random: opts.random,
      });
    const doneCriteria = opts.doneCriteriaByPath?.get(repoRelativePath(absolute));
    const content = renderGradePlan({
      target: opts.target,
      path: absolute,
      references: resolveGradeReferencePathsFromCatalog(absolute, kataReferences),
      referenceExample,
      viewpoints: opts.viewpoints,
      projectId: opts.projectId,
      doneCriteria,
    });
    const reporterContent = renderGradeReporterPlan({
      target: opts.target,
      path: absolute,
      viewpoints: opts.viewpoints,
      projectId: opts.projectId,
      doneCriteria,
    });
    const changed = !existsSync(output) || readFileSync(output, "utf8") !== content;
    const reporterChanged =
      !existsSync(reporterOutput) || readFileSync(reporterOutput, "utf8") !== reporterContent;
    if (changed) writeFileSync(output, content, "utf8");
    if (reporterChanged) writeFileSync(reporterOutput, reporterContent, "utf8");
    return {
      path: repoRelativePath(output),
      changed,
      reporterPath: repoRelativePath(reporterOutput),
      reporterChanged,
      target: repoRelativePath(absolute),
      referenceExample,
    };
  });
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

  for (const [lineIndex, line] of raw.split(/\r?\n/).entries()) {
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

export function validateGradeReporterFidelity(opts: {
  executorOutput: string;
  submission: GradeSubmission;
  viewpoints: ReviewViewpointsDoc;
  target: GradeTarget;
  expectedPath: string;
  doneCriteria?: GradeDoneCriterion[];
}): GradeValidationIssue[] {
  let analysis: GradeExecutorAnalysis;
  try {
    analysis = parseGradeExecutorAnalysis(opts.executorOutput);
  } catch (error) {
    return [
      {
        path: "$analysis",
        message: error instanceof Error ? error.message : String(error),
      },
    ];
  }

  const rubric = assertRubric(opts.viewpoints);
  const analysisIssues = validateGradeSubmission(
    {
      rubric: rubric.id,
      documents: [
        {
          path: opts.expectedPath,
          viewpoints: analysis.viewpoints,
          ...(analysis.doneCriteria ? { done_criteria: analysis.doneCriteria } : {}),
        },
      ],
    },
    opts.viewpoints,
    opts.target,
    opts.doneCriteria
      ? { doneCriteriaByPath: new Map([[opts.expectedPath, opts.doneCriteria]]) }
      : {},
  ).map((issue) => ({ path: `$analysis.${issue.path}`, message: issue.message }));
  if (analysisIssues.length > 0) return analysisIssues;

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
  const required = agentViewpoints(doc, target);
  const allowed = new Map(required.map((viewpoint) => [viewpoint.id, viewpoint]));
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
    const normalizedDocumentPath = repoRelativePath(resolve(specdojoRootDir(), document.path));
    issues.push(
      ...validateDoneCriteriaInput({
        where,
        target,
        value: document.done_criteria,
        expected:
          options.doneCriteriaByPath?.get(document.path) ??
          options.doneCriteriaByPath?.get(normalizedDocumentPath),
      }),
    );
    const ids = new Set<string>();
    const findingIds = new Set<string>();
    for (const [viewpointIndex, result] of document.viewpoints.entries()) {
      const resultPath = `${where}.viewpoints[${viewpointIndex}]`;
      if (!result || !allowed.has(result.id)) {
        issues.push({
          path: resultPath,
          message: `unknown or non-continuous viewpoint: ${result?.id ?? ""}`,
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
    for (const viewpoint of required) {
      if (!ids.has(viewpoint.id)) {
        issues.push({ path: where, message: `missing agent viewpoint: ${viewpoint.id}` });
      }
    }
  }
  return issues;
}

function scoreDocument(
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
  const verdict =
    counts.blocker > 0
      ? "fail"
      : counts.major > 0 || score < rubric.pass_score
        ? "needs-work"
        : "pass";
  return { score, verdict, categories, viewpoints: viewpointOutput, findings: counts };
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
  const schemaRef = relative(dirname(detailPath), resolve(specdojoRootDir(), DONE_CRITERIA_SCHEMA))
    .split(sep)
    .join("/");
  return `# yaml-language-server: $schema=${schemaRef}\n${yaml.dump(detail, { lineWidth: 120, noRefs: true, quotingType: '"' })}`;
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
}): string[] {
  const issues = validateGradeSubmission(opts.submission, opts.viewpoints, opts.target, {
    doneCriteriaByPath: opts.doneCriteriaByPath,
  });
  if (issues.length > 0)
    throw new Error(issues.map((issue) => `${issue.path}: ${issue.message}`).join("\n"));
  const changed: string[] = [];
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

// 比較リファレンスは ID で保存する。パスで保存すると文書を移動したときに参照が壊れる。
// 引数にはパスと ID のどちらも渡せる。パスの場合は Frontmatter の id を読み取る。
export function resolveGradeReferenceId(pathOrId: string): string {
  const trimmed = pathOrId.trim();
  if (!trimmed.endsWith(".md")) return trimmed;
  const absolute = resolveSafeMarkdownPath(trimmed);
  const document = parseMarkdown(readFileSync(absolute, "utf8"), repoRelativePath(absolute));
  const metadata = document.data.specdojo;
  if (!isRecord(metadata) || typeof metadata.id !== "string" || metadata.id.length === 0) {
    throw new Error(`${repoRelativePath(absolute)}: reference document has no specdojo.id`);
  }
  return metadata.id;
}

// score と done_criteria の充足は別の軸として扱う。verdict は score と finding だけで決め、
// 充足状況は要約として並記する。score の閾値が充足判定を上書きせず、その逆も行わない。
function summarizeDoneCriteria(
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
  const contentHash = stableContentHash({ data: document.data, body });
  const criteriaResults =
    opts.target === "deliverable" && opts.doneCriteria && opts.input.done_criteria
      ? opts.input.done_criteria
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
    ...(criteriaResults && opts.doneCriteria
      ? {
          done_criteria: summarizeDoneCriteria(
            opts.doneCriteria.definitions,
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
  if (grade.content_hash !== stableContentHash(document))
    errors.push(`${path}: content changed after the last grade`);
  return errors;
}

function collectPathOption(value: string, previous: string[]): string[] {
  return [...previous, value];
}

function requireTarget(value: string): GradeTarget {
  if (value !== "kata" && value !== "deliverable")
    throw new Error("--target must be kata or deliverable");
  return value;
}

function requireGradeVerdict(value: string): GradeVerdict {
  if (value !== "pass" && value !== "needs-work" && value !== "fail") {
    throw new Error("--verdict must be pass, needs-work, or fail");
  }
  return value;
}

function requireMaxFindings(value: string): number {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 0) {
    throw new Error("--max-findings must be a non-negative integer");
  }
  return parsed;
}

function requireMinScore(value: string): number {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 0 || parsed > 100) {
    throw new Error("--min-score must be an integer between 0 and 100");
  }
  return parsed;
}

function requirePositiveInteger(value: string): number {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new Error("value must be a positive integer");
  }
  return parsed;
}

function requirePipelineStatus(value: string): "passed" | "failed" | "complete" {
  if (value !== "passed" && value !== "failed" && value !== "complete") {
    throw new Error("--status must be passed, failed, or complete");
  }
  return value;
}

function commandError(error: unknown): void {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}

export function registerGradeCommand(program: Command): void {
  const grade = program
    .command("grade")
    .description("Continuously assess Kata and deliverable content quality");
  const addSelection = (command: Command) =>
    command
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
      .option("--incomplete", "Select documents with a retryable incomplete pipeline", false);

  addSelection(
    grade.command("list").description("Print selected document paths without writing grade plans"),
  ).action((options) => {
    try {
      const paths = discoverGradeTargets({
        target: requireTarget(options.target),
        project: options.project,
        paths: options.path,
        changedOnly: options.changedOnly,
        verdict: options.verdict,
        minScore: options.minScore,
        maxFindings: options.maxFindings,
        ungraded: options.ungraded,
        incomplete: options.incomplete,
      });
      for (const path of paths) process.stdout.write(`${repoRelativePath(path)}\n`);
    } catch (error) {
      commandError(error);
    }
  });

  addSelection(
    grade
      .command("plan")
      .description("Write reusable executor and reporter plans per selected document"),
  )
    .option("--out <directory>", "Write plans below this repository-relative directory")
    .option("--reference <path>", "Use this document as the comparison reference")
    .option(
      "--random-reference",
      "Select a comparison reference at random from ready documents",
      false,
    )
    .action((options) => {
      try {
        const target = requireTarget(options.target);
        const viewpoints = loadViewpoints(options.project);
        const { id: projectId, project } = resolveProject(options.project);
        const paths = discoverGradeTargets({
          target,
          project: options.project,
          paths: options.path,
          changedOnly: options.changedOnly,
          verdict: options.verdict,
          minScore: options.minScore,
          maxFindings: options.maxFindings,
          ungraded: options.ungraded,
          incomplete: options.incomplete,
        });
        if (options.reference && options.randomReference) {
          throw new Error("--reference and --random-reference cannot be combined");
        }
        // 比較リファレンスは既定で付けない。効果が未実証であり、付けると executor の
        // 読み込み対象が増えるためである。利用する場合は明示的に指定する。
        const referenceExampleCandidates = options.randomReference
          ? discoverGradeTargets({ target, project: options.project, changedOnly: false })
          : [];
        const outputDirectory =
          options.out ??
          join(getProjectExecutionPath(project), "grade", "generated", "plans", target);
        const plans = writeGradePlans({
          target,
          paths,
          referenceExampleCandidates,
          referenceExampleOverride: options.reference,
          viewpoints,
          projectId,
          outputDirectory,
          doneCriteriaByPath:
            target === "deliverable"
              ? resolveDeliverableDoneCriteria(paths, options.project)
              : undefined,
        });
        for (const plan of plans) {
          // 無作為選定を求めたのに同種別の ready が無い場合は、種別を跨いで代用せず
          // リファレンスなしで続行する。種別が違うと記載水準の基準として誤りを招く。
          // 気づかないまま基準なしで評価し続けることを避けるため警告する。
          if (options.randomReference && !plan.referenceExample) {
            process.stderr.write(
              `warning: no ready reference of the same kind for ${plan.target}; grading without a reference\n`,
            );
          }
          process.stdout.write(`${plan.changed ? "written" : "unchanged"}: ${plan.path}\n`);
          process.stdout.write(
            `${plan.reporterChanged ? "written" : "unchanged"}: ${plan.reporterPath}\n`,
          );
        }
        process.stdout.write(`Planned: ${plans.length} document(s)\n`);
      } catch (error) {
        commandError(error);
      }
    });

  addSelection(
    grade
      .command("apply")
      .description("Validate reporter fidelity and JSON, calculate scores, and update documents"),
  )
    .requiredOption("--from <path>", "GradeSubmission JSON produced by the assessment agent")
    .requiredOption("--by <nickname>", "Grading agent nickname from pm-members.yaml")
    .option(
      "--analysis-from <path>",
      "Executor analysis used to verify reporter fidelity (omit only for legacy one-stage output)",
    )
    .option(
      "--reference <pathOrId>",
      "Comparison reference used during grading; recorded as a document id",
    )
    .option("--dry-run", "Validate and list updates without writing", false)
    .action((options) => {
      try {
        const target = requireTarget(options.target);
        const viewpoints = loadViewpoints(options.project);
        const { project } = resolveProject(options.project);
        const gradedBy = resolveGradeActor(
          options.by,
          loadMemberRoster(specdojoRootDir(), project),
        );
        const submission = parseGradeSubmission(
          readFileSync(resolveSafeRepositoryPath(options.from, "--from"), "utf8"),
        );
        const selected = new Set(
          discoverGradeTargets({
            target,
            project: options.project,
            paths: options.path,
            changedOnly: options.changedOnly,
            verdict: options.verdict,
            minScore: options.minScore,
            maxFindings: options.maxFindings,
            ungraded: options.ungraded,
            incomplete: options.incomplete,
          }).map(repoRelativePath),
        );
        const doneCriteriaByPath =
          target === "deliverable"
            ? resolveDeliverableDoneCriteria([...selected], options.project)
            : undefined;
        if (options.analysisFrom) {
          if (selected.size !== 1) {
            throw new Error("--analysis-from requires exactly one selected --path");
          }
          const expectedPath = [...selected][0];
          const fidelityIssues = validateGradeReporterFidelity({
            executorOutput: readFileSync(
              resolveSafeRepositoryPath(options.analysisFrom, "--analysis-from"),
              "utf8",
            ),
            submission,
            viewpoints,
            target,
            expectedPath,
            doneCriteria: doneCriteriaByPath?.get(expectedPath),
          });
          if (fidelityIssues.length > 0) {
            throw new Error(
              fidelityIssues.map((issue) => `${issue.path}: ${issue.message}`).join("\n"),
            );
          }
        }
        for (const document of submission.documents)
          if (!selected.has(repoRelativePath(resolve(specdojoRootDir(), document.path))))
            throw new Error(`${document.path}: not selected by the current grade filters`);
        const changed = applyGradeSubmission({
          submission,
          viewpoints,
          target,
          gradedBy,
          reference: options.reference,
          dryRun: options.dryRun,
          doneCriteriaByPath,
          criteriaDirectory: join(getProjectExecutionPath(project), "grade", "criteria"),
        });
        for (const path of changed)
          process.stdout.write(`${options.dryRun ? "would update" : "updated"}: ${path}\n`);
        process.stdout.write(
          `Graded: ${submission.documents.length}, updated: ${changed.length}\n`,
        );
      } catch (error) {
        commandError(error);
      }
    });

  addSelection(
    grade.command("validate").description("Validate stored grade hashes and finding counts"),
  ).action((options) => {
    try {
      const target = requireTarget(options.target);
      const paths = discoverGradeTargets({
        target,
        project: options.project,
        paths: options.path,
        changedOnly: options.changedOnly,
        verdict: options.verdict,
        minScore: options.minScore,
        maxFindings: options.maxFindings,
        ungraded: options.ungraded,
        incomplete: options.incomplete,
      });
      const errors = paths.flatMap(validateGradedDocument);
      for (const error of errors) process.stderr.write(`ERROR: ${error}\n`);
      process.stdout.write(`Validated: ${paths.length} document(s), ${errors.length} error(s)\n`);
      if (errors.length > 0) process.exitCode = 1;
    } catch (error) {
      commandError(error);
    }
  });

  grade
    .command("state")
    .description("Read or update persistent per-document grade pipeline state")
    .requiredOption("--target <target>", "kata or deliverable")
    .option("--project <projectId>", "Project id in specdojo.config.json")
    .option("--path <path>", "Markdown document whose pipeline state is read or updated")
    .option("--status <status>", "Record passed, failed, or complete", requirePipelineStatus)
    .option("--stage <number>", "Current pipeline stage", requirePositiveInteger)
    .option("--stage-total <number>", "Total pipeline stages", requirePositiveInteger, 3)
    .option(
      "--max-failures <number>",
      "Consecutive failures allowed before reporting only",
      requirePositiveInteger,
      3,
    )
    .option("--run-id <id>", "Job Run id that observed this state")
    .option("--exhausted", "List documents whose consecutive failure limit was reached", false)
    .action((options) => {
      try {
        const target = requireTarget(options.target);
        if (options.exhausted) {
          if (options.path || options.status) {
            throw new Error("--exhausted cannot be combined with --path or --status");
          }
          for (const state of listExhaustedGradePipelineStates({
            target,
            project: options.project,
          })) {
            process.stdout.write(`${state.document}\n`);
          }
          return;
        }
        if (!options.path) throw new Error("--path is required unless --exhausted is used");
        if (options.status) {
          if (!options.runId) throw new Error("--run-id is required with --status");
          if (!options.stage) throw new Error("--stage is required with --status");
          const state = recordGradePipelineStage({
            target,
            project: options.project,
            path: options.path,
            runId: options.runId,
            stage: options.stage,
            stageTotal: options.stageTotal,
            maxFailures: options.maxFailures,
            status: options.status,
          });
          if (state) process.stdout.write(`${JSON.stringify(state)}\n`);
          return;
        }
        const state = readGradePipelineState({
          target,
          project: options.project,
          path: options.path,
        });
        if (state) process.stdout.write(`${JSON.stringify(state)}\n`);
      } catch (error) {
        commandError(error);
      }
    });
}
