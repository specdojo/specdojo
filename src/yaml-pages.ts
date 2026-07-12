import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, posix } from "node:path";
import yaml from "js-yaml";
import { collectDocIndexEntries } from "./doc-index.js";

// YAML は VitePress のページにならないため、doc-index に載っている YAML ごとに
// 同階層の generated/<name>.md へ表示用ページ（本文を yaml コードブロックで埋め込んだ
// Markdown）を生成する。wikilink・frontmatter リンクはこのページへ解決される。

// 自前で生成したページの識別マーカー。これを含まない既存ファイル
// （catalog build が生成する dct-*.md 等）は上書きしない。
export const YAML_PAGE_MARKER = "<!-- specdojo:generated-by=yaml-pages -->";

const YAML_FILE_RE = /\.ya?ml$/;
const DOC_ID_RE = /^[a-z][a-z0-9:_-]+$/;
const STATUS_VALUES = new Set(["draft", "ready", "deprecated"]);
const RULEBOOK_RE = /^[a-z0-9][a-z0-9-]*-rulebook$/;

// 生成対象は VitePress の rewrites（docs/ja → /ja 等）で URL が安定する範囲に限る。
// docs/specdojo/schemas 等は rewrite 対象外のため除外する。
const PAGE_TARGET_PREFIXES = ["docs/ja/", "docs/en/"];

export interface YamlPagesResult {
  written: string[];
  unchanged: string[];
  skippedForeign: string[];
}

interface YamlPageMeta {
  id: string;
  type: "sample" | "template" | "project";
  status: "draft" | "ready" | "deprecated";
  rulebook: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// doc-index の "path:42" 形式から行番号サフィックスを除去する。
function stripLineSuffix(entry: string): string {
  const colonIndex = entry.lastIndexOf(":");
  if (colonIndex <= 0) return entry;
  return /^\d+$/.test(entry.slice(colonIndex + 1)) ? entry.slice(0, colonIndex) : entry;
}

// doc-index エントリから、表示ページ生成対象の YAML パス（repo ルート相対）を集める。
export function collectYamlSourcePaths(entries: Record<string, string>): string[] {
  const paths = new Set<string>();
  for (const entry of Object.values(entries)) {
    const entryPath = stripLineSuffix(entry);
    if (!YAML_FILE_RE.test(entryPath)) continue;
    if (!PAGE_TARGET_PREFIXES.some((prefix) => entryPath.startsWith(prefix))) continue;
    paths.add(entryPath);
  }
  return [...paths].sort();
}

// YAML パス（repo ルート相対）から表示ページのパスを導出する。
// 例: docs/ja/foo/pm-roles.yaml → docs/ja/foo/generated/pm-roles.md
export function yamlPageRelPath(yamlRelPath: string): string {
  const dir = posix.dirname(yamlRelPath);
  const pageName = posix.basename(yamlRelPath).replace(YAML_FILE_RE, ".md");
  return posix.join(dir, "generated", pageName);
}

// title は生成ページの H1 にのみ使い、frontmatter（deliverable-frontmatter スキーマ準拠）には含めない。
function deriveMeta(yamlRelPath: string, content: string): YamlPageMeta & { title?: string } {
  let parsed: unknown;
  try {
    parsed = yaml.load(content);
  } catch {
    parsed = undefined;
  }
  const record = isRecord(parsed) ? parsed : {};

  // OpenAPI / AsyncAPI 形式（ifx-* 等）はメタ情報を x-spec-meta に置く
  // （document-metadata-standard）。トップレベルに無い項目はそちらへフォールバックする。
  const specMeta = isRecord(record["x-spec-meta"]) ? record["x-spec-meta"] : {};
  const readMeta = (key: string): unknown => record[key] ?? specMeta[key];

  const fileBase = posix
    .basename(yamlRelPath)
    .replace(YAML_FILE_RE, "")
    .replace(/[^a-z0-9:_-]/g, "-");
  const rawId = readMeta("id");
  const id = typeof rawId === "string" && DOC_ID_RE.test(rawId) ? rawId : fileBase;

  // type は deliverable-frontmatter スキーマの enum に収まるよう配置パスから決める
  // （YAML 側の type は "domain" 等スキーマ外の値を取りうる）。
  const type = yamlRelPath.includes("/samples/")
    ? "sample"
    : yamlRelPath.includes("/templates/")
      ? "template"
      : "project";

  const rawStatus = readMeta("status");
  const status =
    typeof rawStatus === "string" && STATUS_VALUES.has(rawStatus)
      ? (rawStatus as YamlPageMeta["status"])
      : "draft";

  const rawRulebook = readMeta("rulebook");
  const rulebook =
    typeof rawRulebook === "string" && RULEBOOK_RE.test(rawRulebook) ? rawRulebook : "none";

  // OpenAPI / AsyncAPI では表題は info.title に置かれるため、最後のフォールバックとする。
  const info = isRecord(record["info"]) ? record["info"] : {};
  const rawTitle = readMeta("title") ?? info["title"];
  const title =
    typeof rawTitle === "string" && rawTitle.trim() !== "" ? rawTitle.trim() : undefined;

  return { id, type, status, rulebook, ...(title ? { title } : {}) };
}

// 表示ページの Markdown を組み立てる。YAML 本文はコードブロックで埋め込み、
// 本文中のバッククォート連続より長いフェンスを使って壊れないようにする。
export function renderYamlPage(yamlRelPath: string, content: string): string {
  const { title, ...meta } = deriveMeta(yamlRelPath, content);
  const frontmatter = yaml.dump({ specdojo: meta }, { lineWidth: -1 }).trimEnd();
  const fileName = posix.basename(yamlRelPath);
  const heading = title ?? fileName;

  const backtickRuns = content.match(/`+/g) ?? [];
  const longestRun = backtickRuns.reduce((max, run) => Math.max(max, run.length), 0);
  const fence = "`".repeat(Math.max(3, longestRun + 1));

  const body = content.endsWith("\n") ? content : `${content}\n`;

  return [
    "---",
    frontmatter,
    "---",
    "",
    `# ${heading}`,
    "",
    `> このページは \`${yamlRelPath}\` から生成された表示用ページです。正本は YAML ファイルであり、このページは再生成できます。`,
    "",
    YAML_PAGE_MARKER,
    "",
    "<!-- prettier-ignore -->",
    `${fence}yaml`,
    `${body}${fence}`,
    "",
  ].join("\n");
}

// doc-index を走査して表示ページを生成する。マーカーのない既存ファイルは
// 他ステップの生成物とみなして上書きせず、内容が同一なら書き込みを省略する。
export function buildYamlPages(rootDir: string, repoRoot: string): YamlPagesResult {
  const entries = collectDocIndexEntries(rootDir, repoRoot);
  const result: YamlPagesResult = { written: [], unchanged: [], skippedForeign: [] };

  for (const yamlRelPath of collectYamlSourcePaths(entries)) {
    const sourcePath = join(repoRoot, yamlRelPath);
    let content: string;
    try {
      content = readFileSync(sourcePath, "utf8");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to read YAML source: ${yamlRelPath} (${message})`);
    }

    const pageRelPath = yamlPageRelPath(yamlRelPath);
    const pagePath = join(repoRoot, pageRelPath);
    const page = renderYamlPage(yamlRelPath, content);

    if (existsSync(pagePath)) {
      const existing = readFileSync(pagePath, "utf8");
      if (!existing.includes(YAML_PAGE_MARKER)) {
        result.skippedForeign.push(pageRelPath);
        continue;
      }
      if (existing === page) {
        result.unchanged.push(pageRelPath);
        continue;
      }
    } else {
      mkdirSync(dirname(pagePath), { recursive: true });
    }

    writeFileSync(pagePath, page, "utf8");
    result.written.push(pageRelPath);
  }

  return result;
}
