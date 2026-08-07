import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import yaml from "js-yaml";
import { readSpecdojoNamespace } from "./frontmatter-namespace.js";

export interface DocIndex {
  version: number;
  // id → path  or  id → "path:line" (1-based line number)
  // 言語別（localized）を持つ ID は既定言語のパスを格納する（後方互換）。
  entries: Record<string, string>;
  // 同一論理 ID を複数言語で持つ場合の言語別パス。id → { locale → path }。
  // 言語スコープが有効（config.locales 設定時）かつ言語別文書が存在する場合のみ出力する。
  localized?: Record<string, Record<string, string>>;
}

export type DocIndexReplaceFormat = "markdown" | "path";
export type DocIndexMissingMode = "keep" | "marker";

export interface ReplaceDocIndexRefsOptions {
  format?: DocIndexReplaceFormat;
  missing?: DocIndexMissingMode;
  missingMarker?: string;
  // 参照元ファイルの言語。指定時は同一言語の variant を優先解決し、
  // 無ければ既定言語（entries）へフォールバックする。
  lang?: string;
}

export interface ReplaceDocIndexRefsResult {
  content: string;
  missingIds: string[];
}

export interface CollectFromSpec {
  field: string; // dot-separated path to the target field (arrays auto-expanded)
  // e.g. "viewpoints", "groups.deliverables"
  id_field?: string; // field name for the document ID within each item (default: 'id')
  path_field?: string; // field name for the referenced path within each item (default: 'path')
}

export interface NestedIdFile {
  file: string; // relative to repo root
  collect_from: CollectFromSpec[];
}

export interface IndexConfig {
  nested_id_files?: NestedIdFile[];
  // 言語スコープを有効化するロケール一覧（docs ルート直下のディレクトリ名）。
  // 例: ["ja", "en"]。設定した言語ディレクトリ配下の文書は、同一論理 ID を
  // 言語ごとに1件ずつ持てる（言語をまたぐ同一 ID は variant として扱い衝突にしない）。
  // 未設定時は言語スコープ無効（従来どおり Unit 全体で ID を一意にする）。
  locales?: string[];
}

const SKIP_DIRS = new Set(["node_modules", "dist", ".vitepress", "out"]);
const FILE_RE = /\.(md|yaml|yml)$/;
const DOC_ID_RE = /^[a-z][a-z0-9:_-]+$/;

class DuplicateDocIdError extends Error {}

// 言語スコープ対応の ID 収集器。id ごとに、言語中立（neutral）と言語別（byLocale）を
// 別管理する。同一スコープ内の重複はエラー、言語をまたぐ同一 ID は variant として許容する。
interface IdSource {
  path: string;
}
interface IdRecord {
  neutral?: IdSource;
  byLocale: Map<string, IdSource>;
}
type IdCollector = Map<string, IdRecord>;

// scanRelPath（scan ルート相対）先頭ディレクトリが locales に含まれればそのロケール、
// そうでなければ言語中立（null）を返す。locales 空なら常に中立（従来動作）。
function localeOfScanPath(scanRelPath: string, locales: Set<string>): string | null {
  if (locales.size === 0) return null;
  const first = scanRelPath.split("/")[0];
  return locales.has(first) ? first : null;
}

function addId(collector: IdCollector, id: string, path: string, locale: string | null): void {
  let record = collector.get(id);
  if (!record) {
    record = { byLocale: new Map() };
    collector.set(id, record);
  }

  if (locale === null) {
    if (record.neutral && record.neutral.path !== path) {
      throw new DuplicateDocIdError(
        `Duplicate document ID "${id}": ${record.neutral.path}, ${path}`,
      );
    }
    if (record.byLocale.size > 0) {
      const other = [...record.byLocale.values()][0];
      throw new DuplicateDocIdError(
        `Duplicate document ID "${id}": ${other.path}, ${path} (mixed language-neutral and localized)`,
      );
    }
    record.neutral = { path };
    return;
  }

  if (record.neutral) {
    throw new DuplicateDocIdError(
      `Duplicate document ID "${id}": ${record.neutral.path}, ${path} (mixed language-neutral and localized)`,
    );
  }
  const existing = record.byLocale.get(locale);
  if (existing && existing.path !== path) {
    throw new DuplicateDocIdError(
      `Duplicate document ID "${id}" in locale "${locale}": ${existing.path}, ${path}`,
    );
  }
  record.byLocale.set(locale, { path });
}

// 収集器から出力用の { entries（既定言語のフラット map）, localized } を構築する。
function buildIndexMaps(
  collector: IdCollector,
  localeOrder: string[],
): { entries: Record<string, string>; localized: Record<string, Record<string, string>> } {
  const entries: Record<string, string> = {};
  const localized: Record<string, Record<string, string>> = {};

  for (const id of [...collector.keys()].sort()) {
    const record = collector.get(id)!;
    if (record.neutral) {
      entries[id] = record.neutral.path;
      continue;
    }
    const localeMap: Record<string, string> = {};
    for (const locale of [...record.byLocale.keys()].sort()) {
      localeMap[locale] = record.byLocale.get(locale)!.path;
    }
    localized[id] = localeMap;
    const defaultLocale =
      localeOrder.find((locale) => record.byLocale.has(locale)) ?? Object.keys(localeMap)[0];
    entries[id] = localeMap[defaultLocale];
  }

  return { entries, localized };
}

// ---- Markdown frontmatter ----------------------------------------------

function extractIdFromMarkdown(content: string): string | undefined {
  // Markdown frontmatter の id は `specdojo:` 名前空間配下にある。
  const id = readSpecdojoNamespace(content).id;
  return typeof id === "string" ? id.trim() : undefined;
}

// ---- YAML top-level id -------------------------------------------------

function extractTopLevelId(parsed: unknown): string | undefined {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return undefined;
  const record = parsed as Record<string, unknown>;
  const id = record["id"];
  if (typeof id === "string" && DOC_ID_RE.test(id)) return id;
  // OpenAPI / AsyncAPI 形式（ifx-* 等）はトップレベルに独自キーを置けないため、
  // specdojo:document-metadata-standard に従い x-spec-meta.id をメタ情報の正本とする。
  const specMeta = record["x-spec-meta"];
  if (specMeta && typeof specMeta === "object" && !Array.isArray(specMeta)) {
    const nestedId = (specMeta as Record<string, unknown>)["id"];
    if (typeof nestedId === "string" && DOC_ID_RE.test(nestedId)) return nestedId;
  }
  return undefined;
}

// ---- dot-path resolution (arrays auto-expanded) ------------------------

function resolveItems(obj: unknown, fieldPath: string[]): unknown[] {
  if (fieldPath.length === 0) {
    if (Array.isArray(obj)) return obj;
    return obj !== undefined && obj !== null ? [obj] : [];
  }
  if (Array.isArray(obj)) {
    return obj.flatMap((item) => resolveItems(item, fieldPath));
  }
  if (!obj || typeof obj !== "object") return [];
  const [head, ...rest] = fieldPath;
  return resolveItems((obj as Record<string, unknown>)[head], rest);
}

// ---- line number lookup ------------------------------------------------

function findIdLine(lines: string[], id: string, idKey: string = "id"): number {
  const escaped = idKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`^\\s*(?:-\\s+)?${escaped}:\\s*(.+)$`);
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(re);
    if (m && m[1].trim() === id) {
      return i + 1; // 1-based
    }
  }
  return 1;
}

// ---- nested id collection ----------------------------------------------

function collectFromFields(
  parsed: unknown,
  specs: CollectFromSpec[],
  fileRelPath: string,
  content: string,
  collector: IdCollector,
  locale: string | null,
): void {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return;
  const lines = content.split("\n");

  for (const spec of specs) {
    const idKey = spec.id_field ?? "id";
    const pathKey = spec.path_field ?? "path";
    const fieldPath = spec.field.split(".");
    const items = resolveItems(parsed, fieldPath);

    for (const item of items) {
      if (!item || typeof item !== "object" || Array.isArray(item)) continue;
      const itemRec = item as Record<string, unknown>;
      const id = itemRec[idKey];
      if (typeof id !== "string" || !DOC_ID_RE.test(id)) continue;

      const pathVal = itemRec[pathKey];
      if (typeof pathVal === "string" && pathVal.trim()) {
        // item has a path field → use it as the index target (no line number)
        addId(collector, id, pathVal.trim(), locale);
      } else {
        // no path → use file:line
        const lineNum = findIdLine(lines, id, idKey);
        addId(collector, id, `${fileRelPath}:${lineNum}`, locale);
      }
    }
  }
}

// ---- file scanning -----------------------------------------------------

function scanFile(
  fullPath: string,
  rootDir: string,
  repoRoot: string,
  collector: IdCollector,
  nestedMap: Map<string, CollectFromSpec[]>,
  locales: Set<string>,
): void {
  // nestedMap keys are rootDir-relative; entry values are repoRoot-relative
  const scanRelPath = relative(rootDir, fullPath).replace(/\\/g, "/");
  const entryPath = relative(repoRoot, fullPath).replace(/\\/g, "/");
  const locale = localeOfScanPath(scanRelPath, locales);
  const isYaml = !fullPath.endsWith(".md");
  try {
    const content = readFileSync(fullPath, "utf8");
    if (isYaml) {
      const parsed = yaml.load(content);
      const topId = extractTopLevelId(parsed);
      if (topId) addId(collector, topId, entryPath, locale);
      const specs = nestedMap.get(scanRelPath);
      if (specs && specs.length > 0) {
        collectFromFields(parsed, specs, entryPath, content, collector, locale);
      }
    } else {
      const id = extractIdFromMarkdown(content);
      if (id && DOC_ID_RE.test(id)) addId(collector, id, entryPath, locale);
    }
  } catch (error) {
    if (error instanceof DuplicateDocIdError) throw error;
    // ignore unreadable / unparseable files
  }
}

function walkDir(
  dir: string,
  rootDir: string,
  repoRoot: string,
  collector: IdCollector,
  nestedMap: Map<string, CollectFromSpec[]>,
  locales: Set<string>,
): void {
  let items: string[];
  try {
    items = readdirSync(dir);
  } catch {
    return;
  }
  for (const item of items) {
    if (item.startsWith(".")) continue;
    if (SKIP_DIRS.has(item) || item === "generated") continue;
    const full = join(dir, item);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      walkDir(full, rootDir, repoRoot, collector, nestedMap, locales);
    } else if (FILE_RE.test(item)) {
      scanFile(full, rootDir, repoRoot, collector, nestedMap, locales);
    }
  }
}

// ---- config loading ----------------------------------------------------

const DEFAULT_CONFIG_REL = ".specdojo/index-config.yaml";

function loadIndexConfig(repoRoot: string, configPath?: string): IndexConfig {
  const p = join(repoRoot, configPath ?? DEFAULT_CONFIG_REL);
  if (!existsSync(p)) return {};
  try {
    const parsed = yaml.load(readFileSync(p, "utf8"));
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as IndexConfig;
    }
  } catch {
    // ignore
  }
  return {};
}

// ---- public API --------------------------------------------------------

// Scans docs and returns { entries, localized } without writing a file.
// Used both by buildDocIndex and by validators that need a fresh ID universe
// (avoids depending on a possibly-stale .specdojo/doc-index.json).
export function collectDocIndex(
  rootDir: string,
  repoRoot: string,
  configPath?: string,
): { entries: Record<string, string>; localized: Record<string, Record<string, string>> } {
  const config = loadIndexConfig(repoRoot, configPath);

  // Build nested map: scan-root-relative path → collect_from specs
  // Config `file` values are repo-root-relative; convert to scan-root-relative
  const nestedMap = new Map<string, CollectFromSpec[]>();
  for (const entry of config.nested_id_files ?? []) {
    if (entry.file && Array.isArray(entry.collect_from)) {
      const absPath = join(repoRoot, entry.file);
      const scanRelPath = relative(rootDir, absPath).replace(/\\/g, "/");
      nestedMap.set(scanRelPath, entry.collect_from);
    }
  }

  const localeOrder = (config.locales ?? []).filter(
    (locale): locale is string => typeof locale === "string" && locale.length > 0,
  );
  const locales = new Set(localeOrder);

  const collector: IdCollector = new Map();
  walkDir(rootDir, rootDir, repoRoot, collector, nestedMap, locales);
  return buildIndexMaps(collector, localeOrder);
}

// Scans docs and returns the flat id → path entries (default locale per id).
export function collectDocIndexEntries(
  rootDir: string,
  repoRoot: string,
  configPath?: string,
): Record<string, string> {
  return collectDocIndex(rootDir, repoRoot, configPath).entries;
}

export function buildDocIndex(
  rootDir: string,
  outputPath: string,
  repoRoot: string,
  configPath?: string,
): { count: number } {
  const { entries, localized } = collectDocIndex(rootDir, repoRoot, configPath);

  const index: DocIndex = {
    version: 1,
    entries,
    ...(Object.keys(localized).length > 0 ? { localized } : {}),
  };

  const outDir = dirname(outputPath);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  writeFileSync(outputPath, JSON.stringify(index, null, 2), "utf8");
  return { count: Object.keys(entries).length };
}

export function lookupDocIndex(id: string, indexPath: string): string | undefined {
  if (!existsSync(indexPath)) return undefined;
  const data = JSON.parse(readFileSync(indexPath, "utf8")) as DocIndex;
  return data.entries[id];
}

function readDocIndex(indexPath: string): DocIndex | null {
  if (!existsSync(indexPath)) return null;
  return JSON.parse(readFileSync(indexPath, "utf8")) as DocIndex;
}

function replacementForResolvedRef(
  id: string,
  title: string | undefined,
  path: string,
  format: DocIndexReplaceFormat,
): string {
  // path format: emit the canonical repo-relative path verbatim (tools/agents open it
  // from the run CWD). markdown format: emit a root-relative link (leading slash) so it
  // resolves against the site/repo root from any file depth (VitePress resolves a leading
  // slash against srcDir); a bare relative link would break from nested documents.
  if (format === "path") return path;
  const href = path.startsWith("/") ? path : `/${path}`;
  return `[${title ?? id}](${href})`;
}

function parseWikiRef(rawRef: string): { id: string; title?: string } {
  const separatorIndex = rawRef.indexOf("|");
  if (separatorIndex === -1) return { id: rawRef.trim() };

  const id = rawRef.slice(0, separatorIndex).trim();
  const title = rawRef.slice(separatorIndex + 1).trim();
  return title ? { id, title } : { id };
}

// Matches, in priority order: a fenced code block (3+ backticks/tildes), an
// inline code span (1+ backticks), or a [[id]] wiki reference. Code constructs
// are captured so [[id]] examples inside them stay literal (a rulebook may show
// the [[id|title]] syntax in backticks; those are not real references).
const DOC_REF_OR_CODE =
  /(?<fence>(?<fenceMarker>`{3,}|~{3,})[\s\S]*?\k<fenceMarker>)|(?<inline>(?<inlineMarker>`+)[\s\S]*?\k<inlineMarker>)|\[\[(?<ref>[^\]\n]+)\]\]/g;

export function replaceDocIndexRefs(
  content: string,
  indexPath: string,
  options: ReplaceDocIndexRefsOptions = {},
): ReplaceDocIndexRefsResult {
  const format = options.format ?? "markdown";
  const missing = options.missing ?? "keep";
  const missingMarker = options.missingMarker ?? "_MISSING_";
  const lang = options.lang;
  const index = readDocIndex(indexPath);
  const missingIds = new Set<string>();

  const replaced = content.replace(DOC_REF_OR_CODE, (match, ...args) => {
    const groups = args[args.length - 1] as Record<string, string | undefined>;
    // Code regions: keep verbatim so [[id]] inside them is neither rewritten nor
    // reported as missing.
    if (groups.ref === undefined) return match;

    const { id, title } = parseWikiRef(groups.ref);
    // 参照元の言語が指定されていれば同一言語の variant を優先し、
    // 無ければ既定言語（entries）へフォールバックする。
    const localizedPath = lang ? index?.localized?.[id]?.[lang] : undefined;
    const path = localizedPath ?? index?.entries[id];
    if (path) return replacementForResolvedRef(id, title, path, format);

    missingIds.add(id);
    return missing === "marker" ? missingMarker : match;
  });

  return {
    content: replaced,
    missingIds: [...missingIds],
  };
}
