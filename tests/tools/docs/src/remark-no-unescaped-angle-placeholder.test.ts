import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fastGlob from "fast-glob";
import { remark } from "remark";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkNoUnescapedAnglePlaceholder from "../../../../tools/docs/src/remark-no-unescaped-angle-placeholder.js";

const repoRoot = path.resolve(fileURLToPath(new URL(".", import.meta.url)), "../../../..");

function createProcessor() {
  return remark()
    .use(remarkFrontmatter, ["yaml"])
    .use(remarkGfm)
    .use(remarkNoUnescapedAnglePlaceholder);
}

async function lint(markdown: string): Promise<string[]> {
  const file = await createProcessor().process({ value: markdown, path: "target.md" });
  return file.messages.map((message) => message.reason);
}

describe("remarkNoUnescapedAnglePlaceholder", () => {
  it("detects the unescaped <lang> placeholder that broke docs:build in PJR-0145", async () => {
    const reasons = await lint("生成先は <lang> ディレクトリです。");

    expect(reasons).toHaveLength(1);
    expect(reasons[0]).toContain("`<lang>`");
  });

  it("detects the unescaped <topic> placeholder that broke docs:build in PJR-0146", async () => {
    const reasons = await lint("ファイル名は pjr-0001-<topic>.md です。");

    expect(reasons).toHaveLength(1);
    expect(reasons[0]).toContain("`<topic>`");
  });

  it("detects hyphenated placeholders such as <project-id>", async () => {
    const reasons = await lint("プロジェクトIDは <project-id> です。");

    expect(reasons).toHaveLength(1);
    expect(reasons[0]).toContain("`<project-id>`");
  });

  it("detects a generic type expression written in prose (Array<string>)", async () => {
    const reasons = await lint("戻り値は Array<string> です。");

    expect(reasons).toHaveLength(1);
    expect(reasons[0]).toContain("`<string>`");
  });

  it("detects a placeholder embedded in a hyphenated token (prefix-<term>-suffix)", async () => {
    const reasons = await lint("識別子は prefix-<term>-suffix になります。");

    expect(reasons).toHaveLength(1);
    expect(reasons[0]).toContain("`<term>`");
  });

  it("does not flag placeholders wrapped in inline code", async () => {
    const reasons = await lint("生成先は `<lang>` ディレクトリで、`<project-id>` も同様です。");

    expect(reasons).toEqual([]);
  });

  it("does not flag legitimate HTML used in the docs (br / details / summary)", async () => {
    const reasons = await lint(
      "一行目<br>二行目\n\n<details><summary>詳細</summary>本文</details>",
    );

    expect(reasons).toEqual([]);
  });

  it("does not flag placeholders that appear only inside fenced code blocks", async () => {
    const markdown = ["```text", "path/to/<lang>/index.md", "```", ""].join("\n");

    const reasons = await lint(markdown);

    expect(reasons).toEqual([]);
  });

  it("does not flag HTML comments or autolinks", async () => {
    const reasons = await lint("<!-- メモ -->\n\nURL は <https://example.com> です。");

    expect(reasons).toEqual([]);
  });
});

describe("remarkNoUnescapedAnglePlaceholder against the real docs tree", () => {
  it("produces no false positives on the existing docs/ markdown", async () => {
    const files = await fastGlob("docs/**/*.md", { cwd: repoRoot, absolute: true });

    const violations: string[] = [];
    for (const absPath of files) {
      const markdown = await readFile(absPath, "utf8");
      const file = await createProcessor().process({ value: markdown, path: absPath });
      for (const message of file.messages) {
        violations.push(`${path.relative(repoRoot, absPath)}: ${message.reason}`);
      }
    }

    expect(violations).toEqual([]);
  });
});
