import { remark } from "remark";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import type { Root } from "mdast";

// 履歴蓄積ファイル（plan / result / pjr-NNNN-<topic> 等）で禁止する Markdown リンクの検出結果。
// リンク先ファイル名の変更で追従修正が必要になる `[]()` / 参照リンクを対象とする。
export interface ForbiddenLink {
  line: number;
  column: number;
  kind: "link" | "linkReference" | "definition";
  url: string;
  reason: string;
}

// スキーム付き外部参照（外部URL）とページ内アンカーは、リネームで壊れないため許容する。
const EXTERNAL_OR_ANCHOR_PATTERN = /^(?:[a-z][a-z0-9+.-]*:|#)/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// ノード配下のテキストを連結して取り出す。リンクの表示テキスト判定に使う。
function extractText(node: unknown): string {
  if (!isRecord(node)) return "";
  if (typeof node.value === "string") return node.value;
  if (Array.isArray(node.children)) {
    return (node.children as unknown[]).map(extractText).join("");
  }
  return "";
}

function nodePosition(node: Record<string, unknown>): { line: number; column: number } {
  const position = node.position;
  if (isRecord(position) && isRecord(position.start)) {
    const { line, column } = position.start as Record<string, unknown>;
    return {
      line: typeof line === "number" ? line : 0,
      column: typeof column === "number" ? column : 0,
    };
  }
  return { line: 0, column: 0 };
}

// 単一の link ノードが禁止対象かを判定する。
// - ページ内アンカー（`#...`）は許容。
// - 表示テキストが URL と一致するもの（bare URL / autolink literal / `<url>`）は許容。
// - それ以外（`docs/` 配下や相対パスへのリンク、外部URLにラベルを付けたリンク）は禁止。
function classifyLink(node: Record<string, unknown>): ForbiddenLink | null {
  const url = typeof node.url === "string" ? node.url : "";
  if (url.startsWith("#")) return null;

  const text = extractText(node).trim();
  if (text.length > 0 && text === url) return null; // bare URL / autolink

  const { line, column } = nodePosition(node);
  const isExternal = EXTERNAL_OR_ANCHOR_PATTERN.test(url);
  const reason = isExternal
    ? `外部URLはラベル付きリンク \`[表示名](URL)\` ではなく URL そのまま（bare / autolink）で記述してください: ${url}`
    : `\`docs/\` 配下の参照は \`[[id]]\`、\`docs/\` 外の参照はパス表記で記述してください（Markdown リンク \`[]()\` は禁止）: ${url || "(空URL)"}`;
  return { line, column, kind: "link", url, reason };
}

function collect(node: unknown, found: ForbiddenLink[]): void {
  if (!isRecord(node)) return;
  const type = node.type;

  if (type === "link") {
    const classified = classifyLink(node);
    if (classified) found.push(classified);
  } else if (type === "linkReference") {
    const { line, column } = nodePosition(node);
    const label = typeof node.label === "string" ? node.label : String(node.identifier ?? "");
    found.push({
      line,
      column,
      kind: "linkReference",
      url: label,
      reason: `参照スタイルのリンク \`[..][${label}]\` は禁止です。\`docs/\` 配下は \`[[id]]\`、それ以外はパス表記で記述してください`,
    });
  } else if (type === "definition") {
    const { line, column } = nodePosition(node);
    const url = typeof node.url === "string" ? node.url : "";
    found.push({
      line,
      column,
      kind: "definition",
      url,
      reason: `参照リンク定義 \`[ラベル]: ${url}\` は禁止です。\`docs/\` 配下は \`[[id]]\`、それ以外はパス表記で記述してください`,
    });
  }

  // image / imageReference は追跡せず、その配下も辿らない（画像は対象外）。
  if (type === "image" || type === "imageReference") return;

  if (Array.isArray(node.children)) {
    for (const child of node.children as unknown[]) collect(child, found);
  }
}

// Markdown 文字列を解析し、履歴蓄積ファイルで禁止する Markdown リンクの一覧を返す。
// `[[id]]` / `[[id|title]]` の wikilink は未定義参照としてプレーンテキスト扱いになり検出されない。
export function findForbiddenLinks(markdown: string): ForbiddenLink[] {
  const tree = remark().use(remarkFrontmatter).use(remarkGfm).parse(markdown) as Root;
  const found: ForbiddenLink[] = [];
  collect(tree, found);
  return found.sort((a, b) => a.line - b.line || a.column - b.column);
}
