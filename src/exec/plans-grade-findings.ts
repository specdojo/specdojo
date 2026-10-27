import { gradeFindingDisplayMessage } from "../shared/grade-result.js";
import type { StoredGradeFinding } from "../shared/grade-result.js";

// 引用した文書や finding 本文の Markdown を、plan 自身のリンクとして解釈させない。
function inlineCode(value: string): string {
  const text = value.replace(/\r\n?|\n/g, " ").trim();
  const longestRun = Math.max(0, ...(text.match(/`+/g) ?? []).map((run) => run.length));
  const delimiter = "`".repeat(longestRun + 1);
  // 端のバッククォートと区切りが結合しないよう、表示時に除去される空白を加える。
  const padding = /^`|`$/.test(text) ? " " : "";
  return `${delimiter}${padding}${text}${padding}${delimiter}`;
}

export function planGradeFindingText(finding: StoredGradeFinding): string {
  const anchor = inlineCode(JSON.stringify(finding.anchor));
  const message = inlineCode(gradeFindingDisplayMessage(finding));
  // register の箇条書き先頭でも [判定情報]: 本文 が参照リンク定義にならないようにする。
  return `\\[${finding.severity}/${finding.rule}; line=${finding.line}; anchor=${anchor}\\]: ${message}`;
}
