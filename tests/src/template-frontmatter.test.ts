import { describe, expect, it } from "vitest";

import {
  flattenTemplateFrontmatter,
  stripSpecdojoFindingComments,
} from "../../src/template-frontmatter.js";

describe("flattenTemplateFrontmatter", () => {
  it("expands frontmatter_template into the document frontmatter and drops template self-metadata", () => {
    const template = [
      "---",
      "specdojo:",
      "  id: specdojo:pjr-issue-template",
      "  type: template",
      "  status: draft",
      "  frontmatter_template:",
      "    specdojo:",
      "      id: _PROJECT_ID_:_PJR-XXXX_",
      "      type: project",
      "      status: draft",
      "      rulebook: specdojo:pjr-rulebook",
      "      item_type: issue",
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
        "specdojo:",
        "  id: _PROJECT_ID_:_PJR-XXXX_",
        "  type: project",
        "  status: draft",
        "  rulebook: specdojo:pjr-rulebook",
        "  item_type: issue",
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
      "specdojo:",
      "  id: specdojo:pm-plan-template",
      "  type: template",
      "  status: draft",
      "  frontmatter_template:",
      "    specdojo:",
      "      id: _PROJECT_ID_:pm-plan",
      "      type: project",
      "      status: ready",
      "      rulebook: specdojo:pm-plan-rulebook",
      "      based_on:",
      "        - _PROJECT_ID_:pm-organization",
      "        - _PROJECT_ID_:pm-roles",
      "      supersedes: []",
      "---",
      "",
      "# プロジェクト管理計画",
      "",
    ].join("\n");

    const actual = flattenTemplateFrontmatter(template);

    expect(actual).toBe(
      [
        "---",
        "specdojo:",
        "  id: _PROJECT_ID_:pm-plan",
        "  type: project",
        "  status: ready",
        "  rulebook: specdojo:pm-plan-rulebook",
        "  based_on:",
        "    - _PROJECT_ID_:pm-organization",
        "    - _PROJECT_ID_:pm-roles",
        "  supersedes: []",
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
      "specdojo:",
      "  id: specdojo:pjr-index-template",
      "  type: template",
      "  status: draft",
      "  frontmatter_template:",
      "    specdojo:",
      "      id: _PROJECT_ID_:pjr-index",
      "      type: project",
      "      status: draft",
      "      rulebook: specdojo:pjr-rulebook",
      "---",
      "",
      "# _PROJECT_ID_ プロジェクト登録簿",
      "",
    ].join("\n");

    const actual = flattenTemplateFrontmatter(template);

    expect(actual).toContain("id: _PROJECT_ID_:pjr-index");
    expect(actual).toContain("# _PROJECT_ID_ プロジェクト登録簿");
    expect(actual).not.toContain("specdojo:pjr-index-template");
  });

  it("removes grade finding comments while preserving other HTML comments", () => {
    const template = [
      "---",
      "specdojo:",
      "  id: specdojo:pjr-todo-template",
      "  type: template",
      "  status: draft",
      "  frontmatter_template:",
      "    specdojo:",
      "      id: _PROJECT_ID_:_PJR_DOCUMENT_ID_",
      "      type: project",
      "      status: draft",
      "---",
      "",
      "<!-- specdojo:finding id=F001 severity=major rule=vp-test line=1 修正対象 -->",
      "# _PJR-XXXX_ _TODO_TITLE_",
      "",
      "<!-- specdojo:view-slot=table -->",
      "",
      "  <!--   specdojo:finding id=F002 severity=minor rule=vp-test 本文の指摘   -->  ",
      "_TODO_: 内容",
      "",
    ].join("\n");

    const actual = flattenTemplateFrontmatter(template);

    expect(actual).not.toContain("specdojo:finding");
    expect(actual).toContain("<!-- specdojo:view-slot=table -->");
    expect(actual).toContain("# _PJR-XXXX_ _TODO_TITLE_");
  });

  it("collapses only the blank-line block left by removed finding comments", () => {
    const template = [
      "---",
      "specdojo:",
      "  id: specdojo:pm-decision-log-template",
      "  type: template",
      "  status: draft",
      "  frontmatter_template:",
      "    specdojo:",
      "      id: _PROJECT_ID_:pm-decision-log",
      "      type: project",
      "      status: draft",
      "---",
      "",
      "# 決定記録",
      "",
      "<!-- specdojo:finding id=F001 severity=major rule=vp-test line=1 修正対象 -->",
      "",
      "<!-- specdojo:finding id=F002 severity=minor rule=vp-test line=2 修正対象 -->",
      "",
      "> 決定事項を記録する。",
      "",
      "## 1. 一覧",
      "",
    ].join("\n");

    expect(flattenTemplateFrontmatter(template)).toBe(
      [
        "---",
        "specdojo:",
        "  id: _PROJECT_ID_:pm-decision-log",
        "  type: project",
        "  status: draft",
        "---",
        "",
        "# 決定記録",
        "",
        "> 決定事項を記録する。",
        "",
        "## 1. 一覧",
        "",
      ].join("\n"),
    );
  });

  it("preserves a separate blank-line block when removing a finding", () => {
    const input = [
      "# タイトル",
      "",
      "",
      "意図的に離した本文",
      "",
      "<!-- specdojo:finding id=F001 severity=major rule=vp-test line=1 修正対象 -->",
      "",
      "次の本文",
      "",
    ].join("\n");

    expect(stripSpecdojoFindingComments(input)).toBe(
      ["# タイトル", "", "", "意図的に離した本文", "", "次の本文", ""].join("\n"),
    );
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
