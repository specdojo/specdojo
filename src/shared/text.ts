// East Asian Wide / Fullwidth code point ranges. Characters in these ranges occupy two terminal
// columns, so they must count as 2 when aligning columns (e.g. Japanese task names in `exec status`).
const WIDE_CODE_POINT_RANGES: ReadonlyArray<readonly [number, number]> = [
  [0x1100, 0x115f], // Hangul Jamo
  [0x2329, 0x232a], // angle brackets
  [0x2e80, 0x303e], // CJK radicals, Kangxi, CJK symbols and punctuation
  [0x3041, 0x33ff], // Hiragana, Katakana, CJK symbols, enclosed CJK
  [0x3400, 0x4dbf], // CJK Unified Ideographs Extension A
  [0x4e00, 0x9fff], // CJK Unified Ideographs
  [0xa000, 0xa4cf], // Yi
  [0xac00, 0xd7a3], // Hangul Syllables
  [0xf900, 0xfaff], // CJK Compatibility Ideographs
  [0xfe10, 0xfe19], // Vertical forms
  [0xfe30, 0xfe6f], // CJK Compatibility Forms, Small Form Variants
  [0xff00, 0xff60], // Fullwidth Forms
  [0xffe0, 0xffe6], // Fullwidth signs
  [0x1f300, 0x1faff], // Emoji and pictographs
  [0x20000, 0x3fffd], // CJK Unified Ideographs Extension B and beyond
];

function isWideCodePoint(cp: number): boolean {
  return WIDE_CODE_POINT_RANGES.some(([start, end]) => cp >= start && cp <= end);
}

// Returns the terminal display width of a string, counting East Asian Wide / Fullwidth characters
// as 2 columns and everything else as 1. Iterates by code point so surrogate pairs count once.
export function displayWidth(text: string): number {
  let width = 0;
  for (const ch of text) {
    width += isWideCodePoint(ch.codePointAt(0) ?? 0) ? 2 : 1;
  }
  return width;
}

// Pads a string on the right with spaces until it reaches the given display width. Uses
// displayWidth so full-width characters are accounted for; returns the string unchanged if it is
// already at least that wide.
export function padEndDisplay(text: string, width: number): string {
  const pad = width - displayWidth(text);
  return pad > 0 ? text + " ".repeat(pad) : text;
}

export function expandTemplate(template: string, values: Record<string, string>): string {
  let result = template;
  for (const [placeholder, value] of Object.entries(values)) {
    result = result.split(placeholder).join(value);
  }
  // 置換値が改行で始まる場合（depends_on の入れ子リストなど）、template 側の
  // `: _PLACEHOLDER_` の空白が行末に残る。生成 plan は prettier の整形対象外
  // （.prettierignore）で checkpoint commit 時に markdownlint の MD009 が直接効くため、
  // ここで行末の空白を取り除く。
  // 置換値が空のとき（夜間の承認の印がない register 個票の _AUTOPILOT_CONSTRAINTS_、
  // agent の Job の _JOB_EXECUTION_、保守系の _PROJECT_CONTEXT_ など）、前後の空行が重なって
  // MD012 で checkpoint commit が止まるため、2 行以上続く空行を 1 行にまとめる（PJR-283N）。
  return result.replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n");
}

// 登録簿の自由記述（title / description 列など）を Markdown 本文へ埋め込む際の安全化。
// `register_date_timezone` のようなアンダースコア入り識別子や `_TODO_` / `_ASSUMPTION_` が、
// 強調記号（`_..._` / `*...*`）として誤解釈され、生成 plan が markdownlint の MD049
// （強調スタイル不統一）で失敗する事故を防ぐ。
//
// バックスラッシュエスケープ（`\_`）は使わない。生成パイプライン末尾の prettier が「不要」と
// 判定した抑制を正規化で除去してしまい、生のアンダースコアへ戻るためである。代わりに `_` や `*`
// を含む ASCII トークンをバッククォートの code span で包み、prettier を通しても安定させる。
// code span 内は強調解釈されないため MD049 を確実に回避できる。既存の code span は著者が意図した
// 記法として温存する。日本語などマルチバイト文字は ASCII トークン境界となり巻き込まない。
const MARKDOWN_CODE_SPAN = /(`+)[\s\S]*?\1/g;
// バックティック（0x60）を除く印字可能 ASCII の連続。空白とマルチバイト文字で区切られる。
const ASCII_RUN = /[\x21-\x5f\x61-\x7e]+/g;

function replaceOutsideMarkdownCodeSpans(
  text: string,
  replace: (segment: string) => string,
): string {
  let result = "";
  let lastIndex = 0;
  for (const match of text.matchAll(MARKDOWN_CODE_SPAN)) {
    const start = match.index ?? 0;
    result += replace(text.slice(lastIndex, start));
    result += match[0];
    lastIndex = start + match[0].length;
  }
  result += replace(text.slice(lastIndex));
  return result;
}

// Markdown コードスパン外にある山括弧トークンをインラインコード化する。
// 山括弧に連結する英数字・ハイフン・アンダースコア・ドットは、記述規約どおり同じ範囲で囲む。
// ドットを含めるのは `dct-<domain>.yaml` のような拡張子付きの参照を分断しないためだが、
// 文末の句点を巻き込まないよう、末尾のドットはコードスパンの外へ戻す。
export function inlineCodeAnglePlaceholders(text: string): string {
  const placeholder = /[A-Za-z0-9._-]*(?:<[^<>\r\n]+>[A-Za-z0-9._-]*)+/g;
  const wrapToken = (token: string): string => {
    const trailing = token.match(/\.+$/)?.[0] ?? "";
    const body = trailing ? token.slice(0, -trailing.length) : token;
    return `\`${body}\`${trailing}`;
  };
  return replaceOutsideMarkdownCodeSpans(text, (segment) =>
    segment.replace(placeholder, wrapToken),
  );
}

export function escapeMarkdownInline(text: string): string {
  return replaceOutsideMarkdownCodeSpans(inlineCodeAnglePlaceholders(text), codeSpanRiskyTokens);
}

function codeSpanRiskyTokens(segment: string): string {
  return segment.replace(ASCII_RUN, (run) => (/[_*]/.test(run) ? `\`${run}\`` : run));
}

// ESC(0x1B) / CSI(0x9B) で始まる ANSI エスケープシーケンス（SGR の色指定や OSC など）。
// lefthook などが失敗時に返す色付きボックス UI の制御コードを表す。ansi-regex 相当。
const ANSI_ESCAPE =
  /[\u001b\u009b][[\]()#;?]*(?:(?:(?:[a-zA-Z\d]*(?:;[a-zA-Z\d]*)*)?\u0007)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-ntqry=><~]))/g;
// タブ(0x09)・改行(0x0A)・復帰(0x0D) を除く C0/C1 制御文字。改行類は呼び出し側で
// 1 行化などの整形を行うため、ここでは残す。
const CONTROL_CHARS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/g;

// subprocess の生出力をユーザー向け文字列（Markdown の表セル・result の理由欄など）へ
// 埋め込む前に、ANSI エスケープシーケンスとその他のターミナル制御文字を除去する。
// これを怠ると色付き出力を返すコマンド（lefthook 等）の失敗理由が制御コードごと
// 書き込まれ、表示や Markdown 構造が壊れる。
export function stripTerminalControlSequences(text: string): string {
  return text.replace(ANSI_ESCAPE, "").replace(CONTROL_CHARS, "");
}

/** Redacts common credential forms before subprocess output is persisted as evidence. */
export function redactSensitiveText(value: string): string {
  return value
    .replace(/\bBearer\s+[A-Za-z0-9._~+/=-]+/giu, "Bearer [REDACTED]")
    .replace(/\b(sk-(?:proj-)?[A-Za-z0-9_-]{8,}|gh[opsu]_[A-Za-z0-9_]{8,})\b/gu, "[REDACTED]")
    .replace(
      /\b(api[_-]?key|access[_-]?token|auth(?:orization)?|password|passwd|secret)\b(\s*[:=]\s*)([^\s,;]+)/giu,
      "$1$2[REDACTED]",
    );
}
