import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { dump, load } from "../../../src/shared/yaml.js";
import { renderYamlPage } from "../../../src/docs/yaml-pages.js";

const fixtureDir = "tests/fixtures/yaml-pages";
const fixtures = readdirSync(fixtureDir).filter((name) => name.endsWith(".md.snap"));

function document(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value))
    throw new Error("Expected a YAML mapping");
  return value as Record<string, unknown>;
}

function items(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.map(document) : [];
}

function tables(page: string) {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .parse(page)
    .children.filter((node) => node.type === "table");
}

describe("typed YAML display pages", () => {
  it("keeps reviewable generated outputs for production and sample documents", () => {
    expect(fixtures).toHaveLength(24);
    for (const prefix of ["bdd", "pm-roles", "pm-members", "ifx-cmd", "tml", "dct"]) {
      expect(
        fixtures.some(
          (name) =>
            name.startsWith(`prj-0001--${prefix}`) || name.startsWith(`${prefix}-ai-provider`),
        ),
        prefix,
      ).toBe(true);
      expect(
        fixtures.some((name) => name.startsWith(`specdojo--${prefix}`)),
        prefix,
      ).toBe(true);
    }
  });

  it.each(fixtures)("renders tables and the entire folded source for %s", (name) => {
    const expected = readFileSync(`${fixtureDir}/${name}`, "utf8");
    const source = expected.match(/> このページは `([^`]+)` から/)?.[1];
    expect(source).toBeDefined();
    const content = readFileSync(source!, "utf8");
    const page = renderYamlPage(source!, content);
    expect(page).toBe(expected);
    const visible = page.split("<details>")[0];
    expect(visible).not.toContain("```yaml");
    expect(page).toContain("<details>\n<summary>YAML の正本を表示</summary>");
    expect(page).not.toContain("<details open");
    expect(page.trimEnd()).toMatch(/<\/details>$/);
    const longest = Math.max(2, ...(content.match(/`+/g) ?? []).map((run) => run.length));
    expect(page).toContain(
      `${"`".repeat(longest + 1)}yaml\n${content}${content.endsWith("\n") ? "" : "\n"}${"`".repeat(longest + 1)}`,
    );
    const parsedTables = tables(visible);
    expect(parsedTables.length).toBeGreaterThan(0);
    for (const table of parsedTables) {
      const columns = table.children[0].children.length;
      expect(table.children.every((row) => row.children.length === columns)).toBe(true);
    }

    const doc = document(load(content));
    // Check record counts independently of the fixture, including nested BDD and DCT entries.
    const rowsUnder = (header: string): number =>
      visible.split("\n").reduce((result, line, index, lines) => {
        if (!line.startsWith(`| ${header} |`)) return result;
        let rows = 0;
        for (let i = index + 2; lines[i]?.startsWith("| "); i++) rows++;
        return result + rows;
      }, 0);
    if (doc.entities) {
      expect(rowsUnder("論理名")).toBe(
        items(doc.entities).reduce((sum, entity) => sum + items(entity.fields).length, 0),
      );
      for (const entity of items(doc.entities)) {
        expect(visible).toContain(String(entity.logical_name));
        for (const field of items(entity.fields))
          expect(visible).toContain(String(field.logical_name));
      }
    }
    if (doc.roles) expect(rowsUnder("ロールコード")).toBe(items(doc.roles).length);
    if (doc.members) expect(rowsUnder("実行主体 ID")).toBe(items(doc.members).length);
    if (doc.tracks) expect(rowsUnder("トラック")).toBe(items(doc.tracks).length);
    if (doc.milestones) expect(rowsUnder("ID")).toBe(items(doc.milestones).length);
    if (doc.command) {
      expect(rowsUnder("コード")).toBe(items(doc.exit_codes).length);
      expect(visible).toContain("| 0 |");
      expect(visible).toContain("false");
    }
    if (Array.isArray(doc.files)) expect(rowsUnder("名称")).toBe(items(doc.files).length);
    if (doc.viewpoints) {
      expect(rowsUnder("ID")).toBe(
        [
          "categories",
          "coverage_types",
          "severity_levels",
          "verdict_definitions",
          "viewpoints",
        ].reduce((sum, key) => sum + items(doc[key]).length, 0),
      );
      if (doc.extends) {
        expect(visible).toContain("[[specdojo:pm-review-viewpoints]]");
        expect(visible).toContain("差分なし");
        expect(visible).toContain("無効化する共通定義");
      }
    }
    const countInGroups = (groups: Record<string, unknown>[], key: string): number =>
      groups.reduce(
        (sum, group) => sum + items(group[key]).length + countInGroups(items(group.groups), key),
        0,
      );
    if (doc.groups) {
      const key = doc.domain ? "deliverables" : "domains";
      expect(rowsUnder(doc.domain ? "成果物 ID" : "ドメイン")).toBe(
        countInGroups(items(doc.groups), key),
      );
    }
  });

  it("keeps multiline Markdown, literal pipes, placeholders, zero and false in their cells", () => {
    const content = dump({
      id: "pm-roles-edge",
      type: "project",
      roles: [
        {
          code: "DEV",
          name: "担当 | 一\r\n二",
          project_note:
            "[[prj-0001:pm-roles|ロール]] <project-id> `value_name` https://example.com",
        },
      ],
      note: "```yaml\nkey: value\n```",
    });
    const page = renderYamlPage("docs/ja/pm-roles-edge.yaml", content);
    const visible = page.split("<details>")[0];
    expect(visible).toContain("担当 \\| 一 二");
    expect(visible).toContain(
      "[[prj-0001:pm-roles\\|ロール]] &lt;project-id&gt; `value_name` <https://example.com>",
    );
    expect(tables(visible)[0].children[1].children).toHaveLength(3);
    expect(page).toContain("````yaml\n");
    expect(page).toContain(content);
  });

  const excluded = [
    "docs/ja/specdojo/templates/pm-roles-template.yaml",
    "docs/ja/specdojo/templates/pm-members-template.yaml",
    "docs/ja/specdojo/templates/ifx-cmd-template.yaml",
    "docs/ja/specdojo/samples/ifx-api-sample.yaml",
    "docs/ja/specdojo/samples/ifx-msg-sample.yaml",
    "docs/ja/specdojo/samples/job-sequence.yaml",
    "docs/ja/projects/prj-0001/schedule/sch-defaults.yaml",
    "docs/ja/projects/prj-0001/schedule/sch-strategy-launch.yaml",
    "docs/ja/projects/prj-0001/schedule/sch-track-launch.yaml",
    "docs/ja/projects/prj-0001/routines/rtn-dashboard-refresh.yaml",
    "docs/ja/projects/prj-0001/execution/grade/criteria/pm-roles-57aedddaed-done-criteria.yaml",
    "docs/ja/specdojo/schemas/v1/guide-content.schema.yaml",
  ];
  it.each(excluded)("preserves the plain YAML display of %s", (source) => {
    const content = readFileSync(source, "utf8");
    const page = renderYamlPage(source, content);
    expect(page).not.toContain("<details>");
    expect(tables(page)).toHaveLength(0);
    expect(page).toContain(content);
  });
});
