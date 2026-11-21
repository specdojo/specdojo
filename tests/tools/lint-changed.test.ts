import { describe, expect, it } from "vitest";
// @ts-expect-error tools/lint-changed.mjs は型宣言を持たない plain JS の入口である。
import { selectFiles } from "../../tools/lint-changed.mjs";

describe("lint-changed selectFiles", () => {
  const changed = ["README.md", "docs/a/b.md", "docs/a/c.mdx", "src/x.ts", "docs/a/b.md"];

  it("selects every changed Markdown file for md without duplicates", () => {
    expect(selectFiles("md", changed)).toEqual(["README.md", "docs/a/b.md"]);
  });

  it("selects only Markdown and MDX under docs for fm", () => {
    expect(selectFiles("fm", changed)).toEqual(["docs/a/b.md", "docs/a/c.mdx"]);
  });
});
