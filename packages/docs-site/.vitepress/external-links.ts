import { existsSync, readFileSync, readdirSync } from "node:fs";
import * as path from "node:path";
import {
  SHARED_CONFIG_RELATIVE_PATH,
  readMarkdownDocId,
  resolveLocalConfigPath,
  resolveMainWorkingTreeRoot,
  type Warn,
} from "./product-repos.js";

// 別リポジトリの project の文書を指す wikilink（PJR-66ER）。
// 書き方は project 修飾の doc id のまま（[[prj-0002:pjr-xxxx]]）とし、手元の doc index で
// 引けない id のうち、接頭辞が external_projects の project_id に一致するものを、相手の
// リポジトリの索引でファイルへ引いて、source_url を元にした URL へ置き換える。
// 設定の読み取りは CLI（src/shared/specdojo-config.ts・local-config.ts）の規則のうち、
// 解決に要る path・project_id・source_url だけを写す（product-repos と同じ方針）。

export const DOC_INDEX_RELATIVE_PATH = ".specdojo/doc-index.json";

export type ExternalProjectLinkSource = {
  alias: string;
  projectId: string;
  // 相手のリポジトリのルート（絶対パス）。
  root: string;
  // リポジトリ相対のパスを足すと文書の URL になる基点（例: ".../blob/main"）。
  sourceUrl: string;
};

export type ExternalDocLink = {
  alias: string;
  href: string;
};

const defaultWarn: Warn = (message: string) => console.warn(`[external-links] ${message}`);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readJson(filePath: string, warn: Warn): unknown {
  if (!existsSync(filePath)) return undefined;
  try {
    return JSON.parse(readFileSync(filePath, "utf8")) as unknown;
  } catch (error) {
    warn(`skip ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
    return undefined;
  }
}

function asNonEmptyString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

// 共有の設定の external_projects を読み、ローカルの設定の path 差し替えと別名の追加を反映する。
// source_url の無い別名は URL を組み立てられないため対象にしない。
export function loadExternalProjectLinkSources(
  workspaceRoot: string,
  env: NodeJS.ProcessEnv = process.env,
  warn: Warn = defaultWarn,
): ExternalProjectLinkSource[] {
  const shared = readJson(path.join(workspaceRoot, SHARED_CONFIG_RELATIVE_PATH), warn);
  const sharedExternal =
    isRecord(shared) && isRecord(shared.external_projects) ? shared.external_projects : {};
  const local = readJson(resolveLocalConfigPath(workspaceRoot, env), warn);
  const localExternal =
    isRecord(local) && isRecord(local.external_projects) ? local.external_projects : {};

  const merged = new Map<string, Record<string, unknown>>();
  for (const [alias, entry] of Object.entries(sharedExternal)) {
    if (isRecord(entry)) merged.set(alias, { ...entry });
  }
  for (const [alias, entry] of Object.entries(localExternal)) {
    if (!isRecord(entry)) continue;
    const base = merged.get(alias);
    // 共有の別名はローカルで path だけを差し替えられる（CLI と同じ）。
    if (base) base.path = entry.path ?? base.path;
    else merged.set(alias, { ...entry });
  }

  const identityRoot = resolveMainWorkingTreeRoot(workspaceRoot);
  const sources: ExternalProjectLinkSource[] = [];
  for (const alias of [...merged.keys()].sort()) {
    const entry = merged.get(alias)!;
    const repoPath = asNonEmptyString(entry.path);
    const projectId = asNonEmptyString(entry.project_id);
    const sourceUrl = asNonEmptyString(entry.source_url);
    if (!repoPath || !projectId || !sourceUrl) continue;
    if (!/^https?:\/\//.test(sourceUrl)) {
      warn(`skip external project "${alias}": source_url must start with http:// or https://`);
      continue;
    }
    sources.push({
      alias,
      projectId,
      root: path.resolve(identityRoot, repoPath),
      sourceUrl: sourceUrl.replace(/\/+$/, ""),
    });
  }
  return sources;
}

function readDocIndexEntries(root: string, warn: Warn): Record<string, string> | undefined {
  const index = readJson(path.join(root, DOC_INDEX_RELATIVE_PATH), warn);
  if (!isRecord(index) || !isRecord(index.entries)) return undefined;
  return Object.fromEntries(
    Object.entries(index.entries).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );
}

function listMarkdownFiles(root: string): string[] {
  const files: string[] = [];
  const visit = (current: string): void => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
      const absolutePath = path.join(current, entry.name);
      if (entry.isDirectory()) visit(absolutePath);
      else if (entry.isFile() && entry.name.endsWith(".md")) files.push(absolutePath);
    }
  };
  visit(root);
  return files.sort();
}

// doc-index.json が無い場合（相手で `specdojo index build` を流していないなど）は、相手の設定の
// projects.<project_id>.base_path 配下の Markdown の frontmatter から id を集める。
function scanProjectMarkdownIds(
  source: ExternalProjectLinkSource,
  warn: Warn,
): Record<string, string> {
  const config = readJson(path.join(source.root, SHARED_CONFIG_RELATIVE_PATH), warn);
  const project =
    isRecord(config) && isRecord(config.projects) ? config.projects[source.projectId] : undefined;
  const basePath = isRecord(project) ? asNonEmptyString(project.base_path) : undefined;
  if (!basePath) {
    warn(
      `external project "${source.alias}": ${source.projectId} has no base_path in ${source.root}`,
    );
    return {};
  }
  const baseDir = path.resolve(source.root, basePath);
  if (!existsSync(baseDir)) {
    warn(`external project "${source.alias}": ${baseDir} not found`);
    return {};
  }
  const entries: Record<string, string> = {};
  for (const file of listMarkdownFiles(baseDir)) {
    const id = readMarkdownDocId(readFileSync(file, "utf8"));
    if (!id || entries[id]) continue;
    entries[id] = path.relative(source.root, file).split(path.sep).join("/");
  }
  return entries;
}

// doc index のエントリ（"docs/ja/a.yaml:42" のような行番号付きもある）を URL にする。
export function externalEntryHref(sourceUrl: string, entry: string): string {
  const match = entry.match(/^(.*):(\d+)$/);
  const filePath = (match ? match[1]! : entry).replace(/^\.?\/+/, "");
  const encoded = filePath.split("/").map(encodeURIComponent).join("/");
  return `${sourceUrl}/${encoded}${match ? `#L${match[2]}` : ""}`;
}

// 別名ごとに、相手の project の doc id（接頭辞が project_id のもの）を URL へ引く表を作る。
// 相手のリポジトリが無い場合（CI で checkout していないなど）は警告して飛ばす。
export function collectExternalDocLinks(
  sources: readonly ExternalProjectLinkSource[],
  warn: Warn = defaultWarn,
): Record<string, ExternalDocLink> {
  const links: Record<string, ExternalDocLink> = {};
  for (const source of sources) {
    if (!existsSync(source.root)) {
      warn(`skip external project "${source.alias}": ${source.root} not found`);
      continue;
    }
    const entries = readDocIndexEntries(source.root, warn) ?? scanProjectMarkdownIds(source, warn);
    const prefix = `${source.projectId}:`;
    for (const id of Object.keys(entries).sort()) {
      if (!id.startsWith(prefix)) continue;
      if (links[id]) {
        warn(`doc id "${id}" of "${source.alias}" is also declared by "${links[id].alias}"`);
        continue;
      }
      links[id] = { alias: source.alias, href: externalEntryHref(source.sourceUrl, entries[id]!) };
    }
  }
  return links;
}
