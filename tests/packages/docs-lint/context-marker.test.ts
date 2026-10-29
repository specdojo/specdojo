import { describe, expect, it } from "vitest";
import { remark } from "remark";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdContent from "../../../packages/docs-lint/src/remark-md-content.js";

async function lint(body: string, metadata = "specdojo:\n  status: draft") {
  return remark()
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(remarkMdContent, {})
    .process({ value: `---\n${metadata}\n---\n\n# Proposal\n\n${body}\n`, path: "proposal.md" });
}

describe("context marker in document lint", () => {
  it.each([
    ["ready", true],
    ["draft", undefined],
    ["deprecated", undefined],
  ])("reports %s with fatal=%s without a content schema", async (status, fatal) => {
    const file = await lint("_CONTEXT_: 技術を選定する。", `specdojo:\n  status: ${status}`);
    expect(file.messages).toHaveLength(1);
    expect(file.messages[0].fatal).toBe(fatal);
    expect(file.messages[0]).toMatchObject({
      source: "context-marker",
      ruleId: "unresolved-context",
      line: 8,
      column: 1,
    });
  });

  it.each(["specdojo: {}", "status: ready", "specdojo: null", "specdojo: [ready]"])(
    "reports info when specdojo.status is not ready: %s",
    async (metadata) => {
      const file = await lint("_CONTEXT_: 指示。", metadata);
      expect(file.messages).toHaveLength(1);
      expect(file.messages[0].fatal).toBeUndefined();
    },
  );

  it("reports info without frontmatter and does not throw for malformed YAML", async () => {
    const processor = remark().use(remarkFrontmatter).use(remarkMdContent, {});
    for (const value of ["_CONTEXT_: 指示。", "---\nspecdojo: [\n---\n\n_CONTEXT_: 指示。"]) {
      const file = await processor.process(value);
      expect(file.messages).toHaveLength(1);
      expect(file.messages[0].fatal).toBeUndefined();
    }
  });

  it("finds instructions in lists and blockquotes, including multiline paragraphs", async () => {
    const file = await lint(
      [
        "_CONTEXT_: 文書全体への指示。",
        "続き。",
        "",
        "- _CONTEXT_: リスト内の指示。",
        "",
        "> _CONTEXT_: 引用内の指示。",
      ].join("\n"),
    );
    expect(file.messages).toHaveLength(3);
    expect(file.messages.every((message) => message.fatal === undefined)).toBe(true);
  });

  it("ignores documentation, code examples, headings, tables and other markers", async () => {
    const file = await lint(
      [
        "`_CONTEXT_:` の書き方。",
        "",
        "本文中の _CONTEXT_: という説明。",
        "",
        "\\_CONTEXT\\_: エスケープした引用。",
        "",
        "## 1. _CONTEXT_ の説明",
        "",
        "```markdown",
        "_CONTEXT_: コード例。",
        "```",
        "",
        "    _CONTEXT_: インデントしたコード例。",
        "",
        "| 記法 | 説明 |",
        "| --- | --- |",
        "| _CONTEXT_: | 表内の説明 |",
        "",
        "_TODO_: 別の目印。",
        "",
        "_CONTEXT_ は説明。",
      ].join("\n"),
      "specdojo:\n  status: ready",
    );
    expect(file.messages).toEqual([]);
  });

  it("accepts a document once its instruction paragraph is removed", async () => {
    expect((await lint("本文へ反映済み。", "specdojo:\n  status: ready")).messages).toEqual([]);
  });
});
