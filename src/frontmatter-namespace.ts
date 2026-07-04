// SpecDojo が所有する Markdown frontmatter は `specdojo:` 名前空間配下に置く
// （document-metadata-standard.md）。他フレームワークの frontmatter キーとの衝突を避け、
// トップレベルを第三者ツールへ明け渡すための共通ユーティリティ。
//
// 対象は Markdown frontmatter のみ。独立 YAML データファイル（dct-*.yaml / pm-*.yaml /
// sch-*.yaml など）は名前空間化しないため、本モジュールは使わない。

import yaml from "js-yaml";

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

function specdojoFromBlock(block: string): Record<string, unknown> {
  let parsed: unknown;
  try {
    parsed = yaml.load(block);
  } catch {
    return {};
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
  const namespace = (parsed as Record<string, unknown>).specdojo;
  if (!namespace || typeof namespace !== "object" || Array.isArray(namespace)) return {};
  return namespace as Record<string, unknown>;
}

// Markdown 文書先頭の frontmatter から `specdojo:` 名前空間オブジェクトを取り出す。
// frontmatter が無い / 解析不能 / `specdojo:` を欠く場合は空オブジェクトを返す。
export function readSpecdojoNamespace(content: string): Record<string, unknown> {
  const match = content.match(FRONTMATTER_RE);
  if (!match) return {};
  return specdojoFromBlock(match[1]);
}

// readSpecdojoNamespace と同じだが、frontmatter に続く本文も返す（read-modify-write 用）。
export function parseSpecdojoDocument(content: string): {
  data: Record<string, unknown>;
  body: string;
} {
  const match = content.match(FRONTMATTER_RE);
  if (!match) return { data: {}, body: content };
  return { data: specdojoFromBlock(match[1]), body: match[2] ?? "" };
}

// トップレベルの `key: value` 行群を `specdojo:` 配下へ字下げし、`---` で囲んだ
// frontmatter ブロック文字列にして返す。frontmatter を生成する各所で使う。
export function buildSpecdojoFrontmatter(innerLines: string[]): string {
  return [
    "---",
    "specdojo:",
    ...innerLines.map((line) => (line.length === 0 ? "" : `  ${line}`)),
    "---",
  ].join("\n");
}
