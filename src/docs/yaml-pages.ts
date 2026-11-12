import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, posix } from "node:path";
import { dump, load } from "../shared/yaml.js";
import { collectDocIndexEntries } from "./doc-index.js";
import { isDctTemplateCatalog, renderCatalogTemplateBody } from "../shared/catalog-render.js";

// YAML は VitePress のページにならないため、doc-index に載っている YAML ごとに
// 同階層の generated/<name>.md へ表示用ページを生成する。
// wikilink・frontmatter リンクはこのページへ解決される。

// 自前で生成したページの識別マーカー。これを含まない既存ファイル
// （catalog build が生成する dct-*.md 等）は上書きしない。
export const YAML_PAGE_MARKER = "<!-- specdojo:generated-by=yaml-pages -->";

const YAML_FILE_RE = /\.ya?ml$/;
const DOC_ID_RE = /^[a-z][a-z0-9:_-]+$/;
const STATUS_VALUES = new Set(["draft", "ready", "deprecated"]);
const RULEBOOK_RE = /^(?:[a-z][a-z0-9-]*:)?[a-z0-9][a-z0-9-]*-rulebook$/;

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
  type?: string;
  status: "draft" | "ready" | "deprecated";
  rulebook: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// YAML 内の Markdown（wikilink やインラインコード）は保ち、表の区切りだけを整える。
function glossaryCell(value: string): string {
  return value
    .replace(/\s*[\r\n]+\s*/g, " ")
    .replace(
      /(\\*)\|/g,
      (_match, slashes: string) => `${slashes}${slashes.length % 2 === 0 ? "\\" : ""}|`,
    );
}

function glossaryText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function glossaryStrings(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function renderGlossaryBody(
  doc: Record<string, unknown>,
  terms: Record<string, unknown>[],
): string {
  const byId = new Map(terms.map((term) => [glossaryText(term.id), term]));
  const groups = new Map<string, Record<string, unknown>[]>();
  for (const term of terms) {
    const category = glossaryText(term.category);
    const group = groups.get(category) ?? [];
    group.push(term);
    groups.set(category, group);
  }

  const lines = [
    "<!-- prettier-ignore -->",
    "| ID | 言語 | 状態 | 用語の数 |",
    "| --- | --- | --- | --- |",
    `| ${[doc.id, doc.locale, doc.status].map((value) => glossaryCell(glossaryText(value)) || "-").join(" | ")} | ${terms.length} |`,
  ];

  let chapter = 0;
  for (const [category, group] of groups) {
    const categoryTerm = byId.get(category);
    const label = categoryTerm
      ? `${glossaryText(categoryTerm.term)}（${category}）`
      : category || "その他";
    lines.push(
      "",
      `## ${++chapter}. ${glossaryCell(label)}`,
      "",
      "<!-- prettier-ignore -->",
      "| 用語（ID） | 英語名と別名 | 定義 | 補足 | 関連 |",
      "| --- | --- | --- | --- | --- |",
    );
    for (const term of group) {
      const id = glossaryText(term.id);
      const names = [
        term.englishName ? `英語名: ${glossaryText(term.englishName)}` : "",
        glossaryStrings(term.aliases).length
          ? `別名: ${glossaryStrings(term.aliases).join("、")}`
          : "",
      ]
        .filter(Boolean)
        .join(" / ");
      const supplement = [
        ["notes", "注記"],
        ["example", "用例"],
        ["source", "出典"],
      ]
        .flatMap(([key, label]) => {
          const text = glossaryText(term[key]);
          // URL 単独の出典は autolink にして MD034 に合わせる。
          return text ? [`${label}: ${/^https?:\/\/\S+$/.test(text) ? `<${text}>` : text}`] : [];
        })
        .join(" / ");
      const related = glossaryStrings(term.relatedTerms)
        .map((ref) => {
          const target = byId.get(ref);
          const text = glossaryText(target?.term) || ref;
          return target ? `[${text.replace(/[[\]\\]/g, "\\$&")}](#${ref})` : `\`${ref}\``;
        })
        .join("、");
      const cells = [
        `<span id="${id}"></span>${glossaryText(term.term)}（\`${id}\`）`,
        names,
        glossaryText(term.definition),
        supplement,
        related,
      ];
      lines.push(`| ${cells.map((cell) => glossaryCell(cell) || "-").join(" | ")} |`);
    }
  }
  lines.push("", `## ${++chapter}. YAML の正本`, "");
  return lines.join("\n");
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
    parsed = load(content);
  } catch {
    parsed = undefined;
  }
  const record = isRecord(parsed) ? parsed : {};

  // OpenAPI / AsyncAPI 形式（ifx-* 等）はメタ情報を x-spec-meta に置く
  // （specdojo:document-metadata-standard）。トップレベルに無い項目はそちらへフォールバックする。
  const specMeta = isRecord(record["x-spec-meta"]) ? record["x-spec-meta"] : {};
  const readMeta = (key: string): unknown => record[key] ?? specMeta[key];

  const fileBase = posix
    .basename(yamlRelPath)
    .replace(YAML_FILE_RE, "")
    .replace(/[^a-z0-9:_-]/g, "-");
  const rawId = readMeta("id");
  const id = typeof rawId === "string" && DOC_ID_RE.test(rawId) ? rawId : fileBase;

  // 分類は配置パスから推測せず正本の値を引き継ぐ。欠落・旧値は YAML 検証で扱う。
  const rawType = readMeta("type");
  const type = typeof rawType === "string" ? rawType : undefined;

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

  return {
    id,
    ...(type !== undefined ? { type } : {}),
    status,
    rulebook,
    ...(title ? { title } : {}),
  };
}

// 表示ページの Markdown を組み立てる。用語集は分類ごとの表を描き、
// YAML 本文はコードブロックで埋め込み、
// 本文中のバッククォート連続より長いフェンスを使って壊れないようにする。
export function renderYamlPage(yamlRelPath: string, content: string): string {
  const { title, ...meta } = deriveMeta(yamlRelPath, content);
  // ジョブ定義・評価記録など、成果物の type を持たない YAML も索引に含まれる。
  // その表示ページは成果物メタ情報を宣言せず、正本の型検証に委ねる。
  const header =
    meta.type === undefined
      ? []
      : ["---", dump({ specdojo: meta }, { lineWidth: -1 }).trimEnd(), "---", ""];
  const fileName = posix.basename(yamlRelPath);
  const heading = title ?? fileName;
  const note = `> このページは \`${yamlRelPath}\` から生成された表示用ページです。正本は YAML ファイルであり、このページは再生成できます。`;

  // dct 成果物カタログのテンプレートは、YAML 丸写しのコードブロックでは可読性が低いため、
  // インスタンス（catalog build）と同じ表形式で本文を描画する。
  let parsed: unknown;
  try {
    parsed = load(content);
  } catch {
    parsed = undefined;
  }
  if (isDctTemplateCatalog(yamlRelPath, parsed)) {
    return [
      ...header,
      `# ${heading}`,
      "",
      note,
      "",
      YAML_PAGE_MARKER,
      "",
      renderCatalogTemplateBody(parsed),
      "",
    ].join("\n");
  }

  const backtickRuns = content.match(/`+/g) ?? [];
  const longestRun = backtickRuns.reduce((max, run) => Math.max(max, run.length), 0);
  const fence = "`".repeat(Math.max(3, longestRun + 1));

  const body = content.endsWith("\n") ? content : `${content}\n`;

  if (isRecord(parsed) && parsed.type === "glossary" && Array.isArray(parsed.terms)) {
    const terms = parsed.terms.filter(isRecord);
    return [
      ...header,
      `# ${heading}`,
      "",
      note,
      "",
      YAML_PAGE_MARKER,
      "",
      renderGlossaryBody(parsed, terms),
      "<details>",
      "<summary>YAML の正本を表示</summary>",
      "",
      "<!-- prettier-ignore -->",
      `${fence}yaml`,
      `${body}${fence}`,
      "",
      "</details>",
      "",
    ].join("\n");
  }

  return [
    ...header,
    `# ${heading}`,
    "",
    note,
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
  const entries = collectDocIndexEntries(rootDir, repoRoot, undefined, {
    includeBundledKata: false,
  });
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
