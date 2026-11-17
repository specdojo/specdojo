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
const runCases = ["register", "schedule", "job"].flatMap((origin) =>
  ["plan", "result"].map((kind) => ({ origin, kind })),
);

describe("exec record links", () => {
  it.each(runCases)(
    "rewrites a $origin run $kind link from the records index",
    ({ origin, kind }) => {
      const recordPath = `runs/${origin}/ITEM/run-id/${kind}.md`;
      const expected = `${source.repositoryUrl}/blob/main/docs/ja/projects/prj-0001/execution/${recordPath}`;
      expect(
        rewriteExecRecordMarkdownHref(`../${recordPath}?raw=1#details`, currentPage, source),
      ).toBe(`${expected}?raw=1#details`);
      expect(
        rewriteExecRecordMarkdownHref(
          `/ja/projects/prj-0001/execution/${recordPath}`,
          currentPage.replace(/^docs\//, ""),
          source,
        ),
      ).toBe(expected);
    },
  );

  it.each(runCases)("resolves a $origin run $kind wikilink", ({ origin, kind }) => {
    const recordPath = `docs/ja/projects/prj-0001/execution/runs/${origin}/ITEM/run-id/${kind}.md`;
    expect(
      resolveExecRecordWikilink(
        "prj-0001:record|実行記録",
        { "prj-0001:record": `./${recordPath.replace(/\//g, "\\")}:2` },
        source,
      ),
    ).toEqual({
      displayText: "実行記録",
      href: `${source.repositoryUrl}/blob/main/${recordPath}`,
    });
  });

  it.each([
    "../runs/register/ITEM/run-id/notes.md",
    "../runs/register/ITEM/run-id/plan.attempt-1.md",
    "../runs/register/ITEM/plan.md",
    "../runs/register/ITEM/run-id/nested/result.md",
    "../jobs/runs/register/ITEM/run-id/result.md",
    "#details",
    "https://example.com/execution/runs/register/ITEM/run-id/plan.md",
  ])("preserves non-record or external Markdown link %s", (href) => {
    expect(rewriteExecRecordMarkdownHref(href, currentPage, source)).toBe(href);
  });

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
