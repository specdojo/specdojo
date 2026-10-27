import { createHash } from "node:crypto";
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { load } from "./yaml.js";
import {
  getProjectExecutionPath,
  loadConfig,
  resolveRepoRoot,
  specdojoRootDir,
} from "./specdojo-config.js";

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

const DOCUMENT_ID_RE = /^[a-z0-9][a-z0-9-:]*$/;
export const SEVERITIES: readonly StoredGradeSeverity[] = ["blocker", "major", "minor", "note"];

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
  const { config } = loadConfig(rootDir);
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
  resultsDirectory?: string;
}): string {
  const rootDir = opts.rootDir ?? specdojoRootDir();
  const absolute = resolve(rootDir, opts.documentPath);
  const content = readFileSync(absolute, "utf8");
  const { config } = loadConfig(rootDir);
  const projectId =
    opts.project?.trim() || config?.current_project || Object.keys(config?.projects ?? {})[0];
  const project = projectId ? config?.projects[projectId] : undefined;
  const documentRealPath = realpathSync(absolute);
  // 宣言済み repo の実体で判定し、相対・絶対パスや worktree の配置によらず同じ場所を使う。
  const repo = (project?.repos ?? [])
    .map((entry) => {
      const root = resolveRepoRoot(rootDir, entry);
      return { name: entry.name, root: existsSync(root) ? realpathSync(root) : root };
    })
    .sort((a, b) => b.root.length - a.root.length)
    .find(({ root }) => {
      const rel = relative(root, documentRealPath);
      return rel !== ".." && !rel.startsWith(`..${sep}`) && !isAbsolute(rel);
    });
  const resultsDirectory = opts.resultsDirectory
    ? resolve(rootDir, opts.resultsDirectory)
    : resolveGradeResultsDirectory(opts.project, rootDir);
  return gradeResultPath(
    repo ? join(resultsDirectory, repo.name) : resultsDirectory,
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

export function gradeFindingDisplayMessage(finding: StoredGradeFinding): string {
  return finding.message_ja?.trim() || finding.message;
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

export function gradeFindingCount(result: GradeResult): number {
  return SEVERITIES.reduce((sum, severity) => sum + result.finding_counts[severity], 0);
}
