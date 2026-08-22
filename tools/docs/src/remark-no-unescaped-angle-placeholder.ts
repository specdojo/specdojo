import type { Plugin } from "unified";
import type { Root, Html, Yaml } from "mdast";
import type { VFile } from "vfile";
import { load } from "js-yaml";

// 実在する HTML 要素名（許可リスト）。
// remark は本文中の `<xxx>` を、tag 名が HTML 文法に合致すると `html` ノードとして解釈する。
// ここに含まれる tag 名は正規の HTML 利用（例: `<br>` / `<details>` / `<summary>`）とみなし、
// 許可リスト外の tag 名（例: `<lang>` / `<topic>` / `<project-id>`）を未エスケープの
// 山括弧プレースホルダとして検知する。
//
// 出典: HTML Living Standard の要素一覧（廃止要素・SVG/MathML の代表要素を含む）。
const KNOWN_HTML_TAGS: ReadonlySet<string> = new Set([
  // Document / metadata
  "html",
  "head",
  "title",
  "base",
  "link",
  "meta",
  "style",
  "body",
  // Sectioning
  "article",
  "section",
  "nav",
  "aside",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hgroup",
  "header",
  "footer",
  "address",
  "main",
  // Grouping content
  "p",
  "hr",
  "pre",
  "blockquote",
  "ol",
  "ul",
  "menu",
  "li",
  "dl",
  "dt",
  "dd",
  "figure",
  "figcaption",
  "div",
  // Text-level semantics
  "a",
  "em",
  "strong",
  "small",
  "s",
  "cite",
  "q",
  "dfn",
  "abbr",
  "ruby",
  "rt",
  "rp",
  "data",
  "time",
  "code",
  "var",
  "samp",
  "kbd",
  "sub",
  "sup",
  "i",
  "b",
  "u",
  "mark",
  "bdi",
  "bdo",
  "span",
  "br",
  "wbr",
  // Edits
  "ins",
  "del",
  // Embedded content
  "picture",
  "source",
  "img",
  "iframe",
  "embed",
  "object",
  "param",
  "video",
  "audio",
  "track",
  "map",
  "area",
  // Tabular data
  "table",
  "caption",
  "colgroup",
  "col",
  "tbody",
  "thead",
  "tfoot",
  "tr",
  "td",
  "th",
  // Forms
  "form",
  "label",
  "input",
  "button",
  "select",
  "datalist",
  "optgroup",
  "option",
  "textarea",
  "output",
  "progress",
  "meter",
  "fieldset",
  "legend",
  // Interactive elements
  "details",
  "summary",
  "dialog",
  // Scripting
  "script",
  "noscript",
  "template",
  "slot",
  "canvas",
  // Obsolete but still parsed as HTML by browsers / VitePress
  "acronym",
  "big",
  "center",
  "font",
  "strike",
  "tt",
  // SVG / MathML の代表要素（本文に埋め込まれ得るため許可）
  "svg",
  "math",
]);

// html ノード値から tag 名を抽出する。開始/終了/自己終了タグの tag 名を列挙する。
// コメント（`<!-- -->`）・DOCTYPE（`<!...>`）は tag ではないためマッチしない。
function extractTagNames(htmlValue: string): string[] {
  const names: string[] = [];
  const tagPattern = /<\/?([a-zA-Z][a-zA-Z0-9-]*)/g;
  let match: RegExpExecArray | null;
  while ((match = tagPattern.exec(htmlValue)) !== null) {
    names.push(match[1]);
  }
  return names;
}

function collectHtmlNodes(tree: Root): Html[] {
  const found: Html[] = [];
  const walk = (node: unknown): void => {
    if (typeof node !== "object" || node === null) return;
    const n = node as { type?: string; children?: unknown[] };
    if (n.type === "html") found.push(node as Html);
    if (Array.isArray(n.children)) {
      for (const child of n.children) walk(child);
    }
  };
  walk(tree);
  return found;
}

function collectYamlNodes(tree: Root): Yaml[] {
  return tree.children.filter((node): node is Yaml => node.type === "yaml");
}

function collectStringValues(value: unknown, found: string[]): void {
  if (typeof value === "string") {
    found.push(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStringValues(item, found);
    return;
  }
  if (typeof value === "object" && value !== null) {
    for (const item of Object.values(value)) collectStringValues(item, found);
  }
}

// YAML frontmatter は Markdown AST の inlineCode ノードへ分解されないため、文字列値の
// backtick code span を先に除外してから、コードスパン外の山括弧トークンを列挙する。
function findUnescapedAnglePlaceholders(text: string): string[] {
  const placeholder = /[A-Za-z0-9_-]*(?:<[^<>\r\n]+>[A-Za-z0-9_-]*)+/g;
  const codeSpan = /(`+)[\s\S]*?\1/g;
  const found: string[] = [];
  let lastIndex = 0;

  const collect = (segment: string): void => {
    for (const match of segment.matchAll(placeholder)) found.push(match[0]);
  };
  for (const match of text.matchAll(codeSpan)) {
    const index = match.index ?? 0;
    collect(text.slice(lastIndex, index));
    lastIndex = index + match[0].length;
  }
  collect(text.slice(lastIndex));
  return found;
}

const remarkNoUnescapedAnglePlaceholder: Plugin<[], Root> = function () {
  return function transformer(tree: Root, file: VFile): void {
    for (const node of collectHtmlNodes(tree)) {
      const tagNames = extractTagNames(node.value);
      for (const tagName of tagNames) {
        if (KNOWN_HTML_TAGS.has(tagName.toLowerCase())) continue;
        file.message(
          `未エスケープの山括弧プレースホルダ \`<${tagName}>\` を検知しました。` +
            "実在しない HTML タグ名のため、VitePress の Vue コンパイラが未クローズタグと解釈し " +
            "docs:build が失敗します。インラインコード（バッククォート）で囲んでください（例: " +
            `\`<${tagName}>\`）。`,
          node,
        );
      }
    }

    // remark-frontmatter は YAML を本文の html ノードにしないため、従来の検査では
    // conclusion などに書かれた山括弧を見落としていた。YAML を値として解析し、
    // コードスパン外の山括弧は実在 HTML 名も含めて報告する。frontmatter の文字列は
    // 登録簿セルなどへ再利用され得るため、HTML として通す用途を想定しない。
    for (const node of collectYamlNodes(tree)) {
      let parsed: unknown;
      try {
        parsed = load(node.value);
      } catch {
        // YAML 構文エラーは frontmatter schema plugin に任せる。
        continue;
      }
      const values: string[] = [];
      collectStringValues(parsed, values);
      for (const value of values) {
        for (const token of findUnescapedAnglePlaceholders(value)) {
          file.message(
            `frontmatter に未エスケープの山括弧 \`${token}\` を検知しました。` +
              `インラインコード（例: \`${token}\`）で囲んでください。`,
            node,
          );
        }
      }
    }
  };
};

export default remarkNoUnescapedAnglePlaceholder;
