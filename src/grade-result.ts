import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import yaml from "js-yaml";
import { getProjectExecutionPath, loadConfig, specdojoRootDir } from "./specdojo-config.js";
import { resolveSpecdojoPath } from "./template-resolution.js";

export type StoredGradeTarget = "kata" | "deliverable";
export type StoredGradeSeverity = "blocker" | "major" | "minor" | "note";
export type StoredGradeVerdict = "pass" | "needs-work" | "fail";

export type StoredGradeFinding = {
  id: string;
  severity: StoredGradeSeverity;
  rule: string;
  line: number;
  anchor: string;
  message: string;
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
  categories: Record<string, { score: number }>;
  viewpoints: Record<string, { level: number; score: number }>;
  finding_counts: Record<StoredGradeSeverity, number>;
  findings: StoredGradeFinding[];
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
  const parsed = yaml.load(match[1]);
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
  const parsed = yaml.load(content);
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
  return `# yaml-language-server: $schema=${schemaRef}\n${yaml.dump(result, {
    lineWidth: 120,
    noRefs: true,
    quotingType: '"',
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
