import { describe, expect, it } from "vitest";
// @ts-expect-error tools/lint-changed.mjs は型宣言を持たない plain JS の入口である。
import { selectFiles, withYamlPages } from "../../tools/lint-changed.mjs";

describe("lint-changed withYamlPages", () => {
  it("adds the existing display page of each changed YAML under docs/ja or docs/en", () => {
    const changed = [
      "docs/ja/a/ifx-index.yaml",
      "docs/en/b/pm-roles.yml",
      "docs/ja/a/no-page.yaml",
      "docs/specdojo/schemas/v1/x.schema.yaml",
      "src/x.ts",
    ];
    const pages = new Set(["docs/ja/a/generated/ifx-index.md", "docs/en/b/generated/pm-roles.md"]);

    const actual = withYamlPages(changed, (path: string) => pages.has(path));

    expect(selectFiles("md", actual)).toEqual([
      "docs/en/b/generated/pm-roles.md",
      "docs/ja/a/generated/ifx-index.md",
    ]);
  });
});

describe("lint-changed selectFiles", () => {
  const changed = ["README.md", "docs/a/b.md", "docs/a/c.mdx", "src/x.ts", "docs/a/b.md"];

  it("selects every changed Markdown file for md without duplicates", () => {
    expect(selectFiles("md", changed)).toEqual(["README.md", "docs/a/b.md"]);
  });

  it("selects only Markdown and MDX under docs for fm", () => {
    expect(selectFiles("fm", changed)).toEqual(["docs/a/b.md", "docs/a/c.mdx"]);
  });
});
