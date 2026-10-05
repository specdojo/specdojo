import { describe, it, expect } from "vitest";
import { lint as markdownlint } from "markdownlint/promise";

// @ts-expect-error: CJS custom rule is not typed
import rule from "../../../packages/docs-lint/src/markdownlint-rule-no-chinese-glyphs.cjs";

describe("MD061/no-chinese-glyphs", () => {
  const lint = async (content: string) => {
    // @ts-expect-error: markdown-it types are not installed
    const mdIt = (await import("markdown-it")).default;
    return markdownlint({
      strings: { "test.md": content },
      config: {
        default: false,
        "no-chinese-glyphs": true,
      },
      customRules: [rule],
      markdownItFactory: mdIt,
    });
  };

  it("detects simplified Chinese glyphs and displays corresponding Japanese glyphs", async () => {
    const result = await lint("これは业务です。\n时と这个も検出します。");
    const errors = result["test.md"]?.filter((e) => e.ruleNames.includes("no-chinese-glyphs"));
    expect(errors).toHaveLength(5);

    expect(errors![0].lineNumber).toBe(1);
    expect(errors![0].errorDetail).toContain("中国語の簡体字 '业' を検知しました。日本語の '業'");

    expect(errors![1].lineNumber).toBe(1);
    expect(errors![1].errorDetail).toContain("中国語の簡体字 '务' を検知しました。日本語の '務'");

    expect(errors![2].lineNumber).toBe(2);
    expect(errors![2].errorDetail).toContain("中国語の簡体字 '时' を検知しました。日本語の '時'");

    expect(errors![3].lineNumber).toBe(2);
    expect(errors![3].errorDetail).toContain("中国語の簡体字 '这' を検知しました。日本語の '這'");

    expect(errors![4].lineNumber).toBe(2);
    expect(errors![4].errorDetail).toContain("中国語の簡体字 '个' を検知しました。日本語の '個'");
  });

  it("ignores code blocks", async () => {
    const result = await lint("```\n业务\n```");
    const errors = result["test.md"]?.filter((e) => e.ruleNames.includes("no-chinese-glyphs"));
    expect(errors).toHaveLength(0);
  });

  it("ignores inline code", async () => {
    const result = await lint("これは `业务` です。");
    const errors = result["test.md"]?.filter((e) => e.ruleNames.includes("no-chinese-glyphs"));
    expect(errors).toHaveLength(0);
  });

  it("ignores links (URLs and link text)", async () => {
    const result = await lint("[这个名字](https://example.com/业) は無視されます。");
    const errors = result["test.md"]?.filter((e) => e.ruleNames.includes("no-chinese-glyphs"));
    expect(errors).toHaveLength(0);
  });

  it("ignores content using markdownlint-disable", async () => {
    const result = await lint("<!-- markdownlint-disable no-chinese-glyphs -->\n这是中国语。");
    const errors = result["test.md"]?.filter((e) => e.ruleNames.includes("no-chinese-glyphs"));
    expect(errors).toHaveLength(0);
  });
});
