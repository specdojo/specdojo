import { describe, expect, it } from "vitest";
import { remark } from "remark";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkNoUnescapedAnglePlaceholder from "../../../packages/docs-lint/src/remark-no-unescaped-angle-placeholder.js";

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

  it("detects an unescaped placeholder in frontmatter", async () => {
    const reasons = await lint(
      ["---", "specdojo:", "  conclusion: dct-<domain>.yaml を生成する", "---", "", "# 文書"].join(
        "\n",
      ),
    );

    expect(reasons).toHaveLength(1);
    expect(reasons[0]).toContain("frontmatter");
    expect(reasons[0]).toContain("`dct-<domain>`");
  });

  it("does not flag a frontmatter placeholder already wrapped in inline code", async () => {
    const reasons = await lint(
      [
        "---",
        "specdojo:",
        '  conclusion: "`dct-<domain>.yaml` を生成する"',
        "---",
        "",
        "# 文書",
      ].join("\n"),
    );

    expect(reasons).toEqual([]);
  });

  it("detects a known HTML tag in frontmatter because generated table cells do not allow HTML", async () => {
    const reasons = await lint(
      ["---", "specdojo:", "  conclusion: 一行目<br>二行目", "---", "", "# 文書"].join("\n"),
    );

    expect(reasons).toHaveLength(1);
    expect(reasons[0]).toContain("`<br>`");
  });

  it("reports body and frontmatter violations as fatal errors", async () => {
    const file = await createProcessor().process({
      value: [
        "---",
        "specdojo:",
        "  conclusion: dct-<domain>.yaml を生成する",
        "---",
        "",
        "# 文書",
        "",
        "生成先は <lang> ディレクトリです。",
      ].join("\n"),
      path: "target.md",
    });

    expect(file.messages).toHaveLength(2);
    expect(file.messages.every((message) => message.fatal === true)).toBe(true);
  });
});

describe("remarkNoUnescapedAnglePlaceholder with representative document syntax", () => {
  it("produces no false positives when frontmatter, tables, HTML and code coexist", async () => {
    // docs 全体の検査は lint:fm が担う。単体テストは文書が増えても一定の入力で確認する。
    const markdown = [
      "---",
      "specdojo:",
      "  id: prj-test:example",
      '  conclusion: "`dct-<domain>.yaml` を生成する"',
      "---",
      "",
      "# 文書",
      "",
      "<!-- コメント -->",
      "",
      "| 対象 | 説明 |",
      "| --- | --- |",
      "| `prefix-<term>-suffix` | 一行目<br>二行目 |",
      "",
      "<details><summary>詳細</summary>",
      "",
      "参照: <https://example.com> / [[prj-test:overview|概要]]。",
      "",
      "```text",
      "path/to/<lang>/pjr-0001-<topic>.md",
      "```",
      "",
      "```mermaid",
      'flowchart LR; A["成果物<br/>文書"] --> B["plan"]',
      "```",
      "",
      "</details>",
      "",
    ].join("\n");

    expect(await lint(markdown)).toEqual([]);
  });
});
