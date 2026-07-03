import { describe, expect, it } from "vitest";

import { flattenTemplateFrontmatter } from "../../src/template-frontmatter.js";

describe("flattenTemplateFrontmatter", () => {
  it("expands frontmatter_template into the document frontmatter and drops template self-metadata", () => {
    const template = [
      "---",
      "id: pjr-issue-template",
      "type: template",
      "status: draft",
      "frontmatter_template:",
      "  id: _PRJ-0000_:_PJR-XXXX_",
      "  type: project",
      "  status: draft",
      "  rulebook: pjr-index-rulebook",
      "  item_type: issue",
      "---",
      "",
      "# _PJR-XXXX_ _ISSUE_TITLE_",
      "",
      "_TODO_: 内容",
      "",
    ].join("\n");

    const actual = flattenTemplateFrontmatter(template);

    expect(actual).toBe(
      [
        "---",
        "id: _PRJ-0000_:_PJR-XXXX_",
        "type: project",
        "status: draft",
        "rulebook: pjr-index-rulebook",
        "item_type: issue",
        "---",
        "",
        "# _PJR-XXXX_ _ISSUE_TITLE_",
        "",
        "_TODO_: 内容",
        "",
      ].join("\n"),
    );
  });

  it("round-trips a nested list value with correct de-indentation", () => {
    const template = [
      "---",
      "id: pm-plan-template",
      "type: template",
      "status: draft",
      "frontmatter_template:",
      "  id: _PROJECT_ID_:pm-plan",
      "  type: project",
      "  status: ready",
      "  rulebook: pm-plan-rulebook",
      "  based_on:",
      "    - _PROJECT_ID_:pm-organization",
      "    - _PROJECT_ID_:pm-roles",
      "  supersedes: []",
      "---",
      "",
      "# プロジェクト管理計画",
      "",
    ].join("\n");

    const actual = flattenTemplateFrontmatter(template);

    expect(actual).toBe(
      [
        "---",
        "id: _PROJECT_ID_:pm-plan",
        "type: project",
        "status: ready",
        "rulebook: pm-plan-rulebook",
        "based_on:",
        "  - _PROJECT_ID_:pm-organization",
        "  - _PROJECT_ID_:pm-roles",
        "supersedes: []",
        "---",
        "",
        "# プロジェクト管理計画",
        "",
      ].join("\n"),
    );
  });

  it("preserves generation-time placeholders without substituting them", () => {
    const template = [
      "---",
      "id: pjr-index-template",
      "type: template",
      "status: draft",
      "frontmatter_template:",
      "  id: _PRJ-0000_:pjr-index",
      "  type: project",
      "  status: draft",
      "  rulebook: pjr-index-rulebook",
      "---",
      "",
      "# _PRJ-0000_ プロジェクト登録簿",
      "",
    ].join("\n");

    const actual = flattenTemplateFrontmatter(template);

    expect(actual).toContain("id: _PRJ-0000_:pjr-index");
    expect(actual).toContain("# _PRJ-0000_ プロジェクト登録簿");
    expect(actual).not.toContain("pjr-index-template");
  });

  it("returns input unchanged when there is no frontmatter_template field", () => {
    const doc = [
      "---",
      "id: some-doc",
      "type: project",
      "status: ready",
      "---",
      "",
      "# 本文",
      "",
    ].join("\n");

    expect(flattenTemplateFrontmatter(doc)).toBe(doc);
  });

  it("returns input unchanged when there is no frontmatter block", () => {
    const doc = "# タイトル\n\n本文だけのファイル\n";

    expect(flattenTemplateFrontmatter(doc)).toBe(doc);
  });
});
