import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { load } from "js-yaml";
import fg from "fast-glob";
import { buildValidator, formatErrors } from "../helpers/schema.js";
import { flattenTemplateFrontmatter } from "../../src/template-frontmatter.js";

function extractFrontmatter(content: string, filePath: string): string {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error(`frontmatter が見つかりません: ${filePath}`);
  return match[1];
}

function applySubstitutions(text: string, subs: Array<[string, string]>): string {
  return subs.reduce((acc, [from, to]) => acc.replaceAll(from, to), text);
}

// register add が生成するファイルのプレースホルダと同じ置換ルール
const PJR_SUBSTITUTIONS: Array<[string, string]> = [
  ["_PRJ-0000_:_PJR-XXXX_", "prj-test-0001:pjr-0001"],
  ["_PRJ-0000_", "prj-test-0001"],
];

const PJR_FILES = fg
  .sync("docs/ja/specdojo/templates/pjr-*-template.md", { onlyFiles: true })
  .sort();

describe("register add — pjr テンプレート frontmatter スキーマ適合検証", () => {
  it.each(PJR_FILES)(
    "%s の生成物 frontmatter が deliverable-frontmatter スキーマに適合する",
    (filePath) => {
      const validator = buildValidator(
        "docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml",
      );
      const raw = readFileSync(resolve(filePath), "utf8");
      // テンプレート自身の frontmatter ではなく、生成物形（frontmatter_template を
      // 展開した出力 Frontmatter）を検証する。register が実際に生成する形に一致する。
      const flattened = flattenTemplateFrontmatter(raw);
      const data = load(
        applySubstitutions(extractFrontmatter(flattened, filePath), PJR_SUBSTITUTIONS),
      ) as Record<string, unknown>;

      expect(validator(data), formatErrors(validator.errors)).toBe(true);
    },
  );
});
