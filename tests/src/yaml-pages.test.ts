import { describe, expect, it } from "vitest";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  buildYamlPages,
  renderYamlPage,
  yamlPageRelPath,
  YAML_PAGE_MARKER,
} from "../../src/yaml-pages.js";

describe("yamlPageRelPath", () => {
  it("returns the generated/<name>.md path next to the YAML file", () => {
    const actual = yamlPageRelPath("docs/ja/projects/prj-0001/pm-roles.yaml");

    expect(actual).toBe("docs/ja/projects/prj-0001/generated/pm-roles.md");
  });
});

describe("renderYamlPage", () => {
  it("derives frontmatter from the YAML metadata and embeds the content in a yaml fence", () => {
    const content = "id: pm-roles-sample\nstatus: ready\nrulebook: pm-roles-rulebook\n";

    const page = renderYamlPage("docs/ja/specdojo/samples/pm-roles-sample.yaml", content);

    expect(page).toContain("  id: pm-roles-sample\n");
    expect(page).toContain("  type: sample\n");
    expect(page).toContain("  status: ready\n");
    expect(page).toContain("  rulebook: pm-roles-rulebook\n");
    expect(page).toContain("# pm-roles-sample.yaml");
    expect(page).toContain(YAML_PAGE_MARKER);
    expect(page).toContain("```yaml\nid: pm-roles-sample\n");
  });

  it("uses the YAML title as the page heading and keeps it out of the frontmatter", () => {
    const content =
      "id: prj-0001:pm-roles\nstatus: ready\ntitle: ロール一覧\nrulebook: pm-roles-rulebook\n";

    const page = renderYamlPage("docs/ja/projects/prj-0001/pm-roles.yaml", content);

    expect(page).toContain("# ロール一覧\n");
    const frontmatter = page.split("---")[1];
    expect(frontmatter).not.toContain("title:");
  });

  it("falls back to the file name heading when the YAML has no title", () => {
    const content = "id: prj-0001:pm-roles\nstatus: ready\n";

    const page = renderYamlPage("docs/ja/projects/prj-0001/pm-roles.yaml", content);

    expect(page).toContain("# pm-roles.yaml\n");
  });

  it("falls back to filename base id, draft status, and rulebook none for out-of-schema values", () => {
    const content = "type: domain\nstatus: published\nrulebook: not a rulebook id\n";

    const page = renderYamlPage("docs/ja/projects/prj-0001/bdd-common.yaml", content);

    expect(page).toContain("  id: bdd-common\n");
    expect(page).toContain("  type: project\n");
    expect(page).toContain("  status: draft\n");
    expect(page).toContain("  rulebook: none\n");
  });

  it("reads id and status from x-spec-meta and the heading from info.title for OpenAPI YAML", () => {
    const content = [
      "openapi: 3.0.3",
      "info:",
      "  title: 決済サービスAPI",
      "x-spec-meta:",
      "  id: ifx-api-sample",
      "  type: api",
      "  status: draft",
      "",
    ].join("\n");

    const page = renderYamlPage("docs/ja/specdojo/samples/ifx-api-sample.yaml", content);

    expect(page).toContain("  id: ifx-api-sample\n");
    expect(page).toContain("  type: sample\n");
    expect(page).toContain("  status: draft\n");
    expect(page).toContain("# 決済サービスAPI\n");
  });

  it("uses a longer fence when the YAML content contains triple backticks", () => {
    const content = "id: gl-sample\nnote: |\n  ```yaml\n  nested: fence\n  ```\n";

    const page = renderYamlPage("docs/ja/specdojo/samples/gl-sample.yaml", content);

    expect(page).toContain("````yaml\n");
    expect(page).toContain("\n````\n");
  });
});

describe("buildYamlPages", () => {
  it("writes display pages for indexed YAML files and rewrites them when the source changes", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-yaml-pages-"));

    try {
      const projectDir = join(dir, "docs", "ja", "projects", "prj-0001");
      mkdirSync(projectDir, { recursive: true });
      const source = join(projectDir, "pm-roles.yaml");
      writeFileSync(source, "id: prj-0001:pm-roles\nstatus: draft\n", "utf8");

      const first = buildYamlPages(join(dir, "docs"), dir);

      const pagePath = join(projectDir, "generated", "pm-roles.md");
      expect(first.written).toEqual(["docs/ja/projects/prj-0001/generated/pm-roles.md"]);
      expect(readFileSync(pagePath, "utf8")).toContain("id: prj-0001:pm-roles");

      const second = buildYamlPages(join(dir, "docs"), dir);
      expect(second.written).toEqual([]);
      expect(second.unchanged).toEqual(["docs/ja/projects/prj-0001/generated/pm-roles.md"]);

      writeFileSync(source, "id: prj-0001:pm-roles\nstatus: ready\n", "utf8");
      const third = buildYamlPages(join(dir, "docs"), dir);
      expect(third.written).toEqual(["docs/ja/projects/prj-0001/generated/pm-roles.md"]);
      expect(readFileSync(pagePath, "utf8")).toContain("status: ready");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("does not overwrite an existing generated page that lacks the yaml-pages marker", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-yaml-pages-"));

    try {
      const catalogDir = join(dir, "docs", "ja", "projects", "prj-0001", "catalog");
      mkdirSync(join(catalogDir, "generated"), { recursive: true });
      writeFileSync(
        join(catalogDir, "dct-testing.yaml"),
        "id: prj-0001:dct-testing\nstatus: draft\n",
        "utf8",
      );
      const foreignPage = join(catalogDir, "generated", "dct-testing.md");
      writeFileSync(foreignPage, "# catalog build output\n", "utf8");

      const result = buildYamlPages(join(dir, "docs"), dir);

      expect(result.skippedForeign).toEqual([
        "docs/ja/projects/prj-0001/catalog/generated/dct-testing.md",
      ]);
      expect(readFileSync(foreignPage, "utf8")).toBe("# catalog build output\n");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("ignores indexed YAML files outside docs/ja and docs/en", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-yaml-pages-"));

    try {
      const schemaDir = join(dir, "docs", "specdojo", "schemas");
      mkdirSync(schemaDir, { recursive: true });
      writeFileSync(join(schemaDir, "sample.schema.yaml"), "id: sample-schema\n", "utf8");

      const result = buildYamlPages(join(dir, "docs"), dir);

      expect(result.written).toEqual([]);
      expect(existsSync(join(schemaDir, "generated"))).toBe(false);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
