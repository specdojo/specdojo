import { describe, expect, it } from "vitest";
import { findForbiddenLinks } from "../../../../tools/docs/src/history-links.js";

describe("findForbiddenLinks", () => {
  it("flags an inline markdown link to a local path", () => {
    const findings = findForbiddenLinks("See [ルール](../instructions/markdown.instructions.md).");

    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      kind: "link",
      url: "../instructions/markdown.instructions.md",
    });
  });

  it("flags a labeled external URL because it should be written bare", () => {
    const findings = findForbiddenLinks("See [Anthropic](https://www.anthropic.com).");

    expect(findings).toHaveLength(1);
    expect(findings[0].kind).toBe("link");
    expect(findings[0].reason).toContain("URL そのまま");
  });

  it("flags reference-style links and their definitions", () => {
    const findings = findForbiddenLinks("See [ルール][ref].\n\n[ref]: ./markdown.instructions.md");

    const kinds = findings.map((f) => f.kind).sort();
    expect(kinds).toEqual(["definition", "linkReference"]);
  });

  it("does not flag wikilinks with display title", () => {
    const findings = findForbiddenLinks("See [[prj-0001:pjr-index|登録簿]] for details.");

    expect(findings).toEqual([]);
  });

  it("does not flag bare wikilinks", () => {
    const findings = findForbiddenLinks("See [[specdojo:id-and-file-naming-standard]].");

    expect(findings).toEqual([]);
  });

  it("does not flag bare paths written as plain text", () => {
    const findings = findForbiddenLinks("参照: .github/instructions/markdown.instructions.md");

    expect(findings).toEqual([]);
  });

  it("does not flag a bare URL rendered as an autolink literal", () => {
    const findings = findForbiddenLinks("参照: https://www.anthropic.com/docs");

    expect(findings).toEqual([]);
  });

  it("does not flag an explicit autolink", () => {
    const findings = findForbiddenLinks("参照: <https://www.anthropic.com/docs>");

    expect(findings).toEqual([]);
  });

  it("does not flag images", () => {
    const findings = findForbiddenLinks("![図](../assets/diagram.png)");

    expect(findings).toEqual([]);
  });

  it("does not flag intra-document anchors", () => {
    const findings = findForbiddenLinks("[完了条件](#2-完了条件) を参照。");

    expect(findings).toEqual([]);
  });

  it("reports the line where the forbidden link appears", () => {
    const markdown = "# 見出し\n\n本文\n\nSee [x](./y.md) here.";
    const findings = findForbiddenLinks(markdown);

    expect(findings).toHaveLength(1);
    expect(findings[0].line).toBe(5);
  });
});
