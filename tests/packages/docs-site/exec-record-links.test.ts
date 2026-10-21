import { describe, expect, it } from "vitest";
import {
  resolveExecRecordWikilink,
  rewriteExecRecordMarkdownHref,
  type GitHubSource,
} from "../../../packages/docs-site/.vitepress/exec-record-links.js";

const source: GitHubSource = {
  repositoryUrl: "https://github.com/specdojo/specdojo",
  branch: "main",
};

const currentPage = "docs/ja/projects/prj-0001/execution/generated/exec-records.md";

describe("exec record links", () => {
  it("replaces a relative plan link with the GitHub file view", () => {
    expect(
      rewriteExecRecordMarkdownHref(
        "../exec/plans/pjr-example-20261022T000000Z-plan.md",
        currentPage,
        source,
      ),
    ).toBe(
      "https://github.com/specdojo/specdojo/blob/main/docs/ja/projects/prj-0001/execution/exec/plans/pjr-example-20261022T000000Z-plan.md",
    );
  });

  it("replaces a relative result link with the GitHub file view", () => {
    expect(
      rewriteExecRecordMarkdownHref(
        "../exec/results/pjr-example-20261022T000000Z-result.md",
        currentPage,
        source,
      ),
    ).toBe(
      "https://github.com/specdojo/specdojo/blob/main/docs/ja/projects/prj-0001/execution/exec/results/pjr-example-20261022T000000Z-result.md",
    );
  });

  it("resolves a plan wikilink to the GitHub file view", () => {
    expect(
      resolveExecRecordWikilink(
        "prj-0001:xep-example",
        {
          "prj-0001:xep-example":
            "docs/ja/projects/prj-0001/execution/exec/plans/example-plan.md:2",
        },
        source,
      ),
    ).toEqual({
      displayText: "prj-0001:xep-example",
      href: "https://github.com/specdojo/specdojo/blob/main/docs/ja/projects/prj-0001/execution/exec/plans/example-plan.md",
    });
  });

  it("preserves the display name of a result wikilink", () => {
    expect(
      resolveExecRecordWikilink(
        "prj-0001:xer-example|実行結果",
        {
          "prj-0001:xer-example":
            "docs/ja/projects/prj-0001/execution/exec/results/example-result.md",
        },
        source,
      ),
    ).toEqual({
      displayText: "実行結果",
      href: "https://github.com/specdojo/specdojo/blob/main/docs/ja/projects/prj-0001/execution/exec/results/example-result.md",
    });
  });

  it("does not change links or wikilinks outside plan and result", () => {
    expect(rewriteExecRecordMarkdownHref("../generated/dashboard.md", currentPage, source)).toBe(
      "../generated/dashboard.md",
    );
    expect(
      resolveExecRecordWikilink(
        "prj-0001:dashboard",
        { "prj-0001:dashboard": "docs/ja/projects/prj-0001/execution/generated/dashboard.md" },
        source,
      ),
    ).toBeUndefined();
  });
});
