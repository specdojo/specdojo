// Markdown 成果物テンプレートは、自身の Frontmatter に生成物の Frontmatter を
// `frontmatter_template` フィールドとして持つ（document-metadata-standard.md の
// `生成物 Frontmatter 雛形`）。本モジュールはテンプレートを「生成物形」へ平坦化する。

// テンプレートの `frontmatter_template` を出力 Frontmatter として展開し、テンプレート
// 自身のメタ情報（`id: *-template` など）を取り除いた文字列を返す。生成時プレースホルダ
// （`_PROJECT_ID_` / `_PRJ-0000_` 等）は温存し、実値への置換は呼び出し側が行う。
//
// `frontmatter_template` を持たないテンプレートや Frontmatter を持たない入力は、
// そのまま返す（変換前テンプレートとの後方互換のため）。
//
// 平坦化は YAML 再シリアライズではなく 2 スペースの de-indent で行う。テンプレート生成時
// （`docs/ja/specdojo/standards/template-authoring-standard.md`）に `frontmatter_template`
// 配下へ 2 スペースで退避した元 Frontmatter を、バイト等価で復元することを意図している。
export function flattenTemplateFrontmatter(raw: string): string {
  const match = raw.match(/^---\n([\s\S]*?)\n---(\n|$)/);
  if (!match) return raw;

  const fmBlock = match[1];
  const rest = raw.slice(match[0].length);

  const fmLines = fmBlock.split("\n");
  const ftIndex = fmLines.findIndex((line) => /^frontmatter_template:[ \t]*$/.test(line));
  if (ftIndex === -1) return raw;

  const nested: string[] = [];
  for (const line of fmLines.slice(ftIndex + 1)) {
    if (line.length === 0) {
      nested.push("");
    } else if (line.startsWith("  ")) {
      nested.push(line.slice(2));
    } else {
      // `frontmatter_template` の後に兄弟キー（未インデント行）が現れた場合は、
      // それ以降を生成物 Frontmatter に含めない。変換済みテンプレートでは
      // `frontmatter_template` が最後のトップレベルキーであり、通常は発生しない。
      break;
    }
  }

  return `---\n${nested.join("\n")}\n---\n${rest}`;
}
