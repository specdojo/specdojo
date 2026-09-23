import { describe, expect, it } from "vitest";
import { formatMarkdownTable } from "../packages/vscode-specdojo/src/markdown-table.js";

describe("formatMarkdownTable", () => {
  it("formats only the table containing the cursor", () => {
    const input = [
      "|a|bbb|c|",
      "|-|--|----|",
      "|1|  2|3|",
      "",
      "| untouched | table |",
      "| --- | --- |",
      "| value | value |",
    ].join("\n");

    expect(formatMarkdownTable(input, 3)).toBe(
      [
        "| a | bbb | c |",
        "| --- | --- | --- |",
        "| 1 | 2 | 3 |",
        "",
        "| untouched | table |",
        "| --- | --- |",
        "| value | value |",
      ].join("\n"),
    );
  });

  it("preserves indentation and normalizes delimiter alignment", () => {
    const input = ["  | left | center | right |", "  | :-- | :-: | --: |", "  | a | b | c |"].join(
      "\n",
    );

    expect(formatMarkdownTable(input, 1)).toBe(
      ["  | left | center | right |", "  | :--- | :---: | ---: |", "  | a | b | c |"].join("\n"),
    );
  });

  it("returns the input unchanged when the cursor is outside a Markdown table", () => {
    const input = ["paragraph", "", "| a | b |", "| --- | --- |"].join("\n");

    expect(formatMarkdownTable(input, 1)).toBe(input);
    expect(formatMarkdownTable(input, 99)).toBe(input);
  });

  it("matches the legacy formatter's LF output for changed CRLF input", () => {
    const input = "|a|b|\r\n|-|-|\r\n|1|2|\r\n";

    expect(formatMarkdownTable(input, 2)).toBe("| a | b |\n| --- | --- |\n| 1 | 2 |\n");
  });

  it("preserves legacy CRLF input when the table needs no changes", () => {
    const input = "| a | b |\r\n| --- | --- |\r\n| 1 | 2 |\r\n";

    expect(formatMarkdownTable(input, 2)).toBe(input);
  });
});
