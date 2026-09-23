// Markdown 成果物テンプレートは、自身の Frontmatter に生成物の Frontmatter を
// `frontmatter_template` フィールドとして持つ（document-metadata-standard.md の
// `生成物 Frontmatter 雛形`）。本モジュールはテンプレートを「生成物形」へ平坦化する。

// grade が Markdown 本文へ付与する finding は評価対象への注釈であり、テンプレートから
// 生成する成果物の一部ではない。生成処理で共通利用できるよう、平坦化と同じ境界で除去する。
const FINDING_COMMENT_LINE_RE =
  /^[ \t]*<!--[ \t]*specdojo:finding(?:[ \t]+[^\r\n]*?)?[ \t]*-->[ \t]*$/;

function lineBody(line: string): string {
  return line.replace(/\r\n$|[\r\n]$/, "");
}

function isBlankLine(line: string): boolean {
  return /^[ \t]*$/.test(lineBody(line));
}

export function stripSpecdojoFindingComments(raw: string): string {
  if (!raw.includes("specdojo:finding")) return raw;

  const lines = raw.match(/[^\r\n]*(?:\r\n|\r|\n|$)/g) ?? [];
  if (lines.at(-1) === "") lines.pop();

  const output: string[] = [];
  for (let index = 0; index < lines.length; ) {
    const line = lines[index];
    if (!isBlankLine(line) && !FINDING_COMMENT_LINE_RE.test(lineBody(line))) {
      output.push(line);
      index += 1;
      continue;
    }

    const whitespaceBlock: string[] = [];
    let hasFinding = false;
    while (index < lines.length) {
      const candidate = lines[index];
      const finding = FINDING_COMMENT_LINE_RE.test(lineBody(candidate));
      if (!isBlankLine(candidate) && !finding) break;
      whitespaceBlock.push(candidate);
      hasFinding ||= finding;
      index += 1;
    }

    if (!hasFinding) {
      output.push(...whitespaceBlock);
      continue;
    }

    // finding の前後にあった空行は、コメント除去後には同じ空白ブロックになる。
    // そのブロックだけを1空行へ畳み、finding と無関係な空白は変更しない。
    const blankLine = whitespaceBlock.find(isBlankLine);
    // 文末では、呼び出し側が保持する最終改行だけで十分。空行まで残すと MD012 になる。
    if (blankLine !== undefined && index < lines.length) output.push(blankLine);
  }

  return output.join("");
}

// テンプレートの `frontmatter_template` を出力 Frontmatter として展開し、テンプレート
// 自身のメタ情報（`id: *-template` など）と finding コメントを取り除いた文字列を返す。
// 生成時プレースホルダ（`_PROJECT_ID_` 等）は温存し、実値への置換は呼び出し側が行う。
//
// `frontmatter_template` を持たないテンプレートや Frontmatter を持たない入力は、finding
// コメントの除去以外はそのまま返す（変換前テンプレートとの後方互換のため）。
//
// SpecDojo の Frontmatter は `specdojo:` 名前空間配下に置くため、テンプレートでは
// `frontmatter_template` はインデント 2（`specdojo:` の子）に、その中身（生成物 Frontmatter
// = `specdojo:` ラッパー込み）はインデント 4 に退避される。平坦化は YAML 再シリアライズでは
// なく 4 スペースの de-indent で行い、退避前の生成物 Frontmatter をバイト等価で復元する。
export function flattenTemplateFrontmatter(raw: string): string {
  const sanitized = stripSpecdojoFindingComments(raw);
  const match = sanitized.match(/^---\n([\s\S]*?)\n---(\n|$)/);
  if (!match) return sanitized;

  const fmBlock = match[1];
  const rest = sanitized.slice(match[0].length);

  const fmLines = fmBlock.split("\n");
  const ftIndex = fmLines.findIndex((line) => /^  frontmatter_template:[ \t]*$/.test(line));
  if (ftIndex === -1) return sanitized;

  const nested: string[] = [];
  for (const line of fmLines.slice(ftIndex + 1)) {
    if (line.length === 0) {
      nested.push("");
    } else if (line.startsWith("    ")) {
      nested.push(line.slice(4));
    } else {
      // `frontmatter_template` の後に兄弟キー（インデント 2 以下）が現れた場合は、
      // それ以降を生成物 Frontmatter に含めない。変換済みテンプレートでは
      // `frontmatter_template` が `specdojo:` 配下の最後のキーであり、通常は発生しない。
      break;
    }
  }

  return `---\n${nested.join("\n")}\n---\n${rest}`;
}
