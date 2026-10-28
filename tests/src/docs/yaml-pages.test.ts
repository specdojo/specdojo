import { describe, expect, it } from "vitest";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { load } from "../../../src/shared/yaml.js";
import { buildValidator } from "../../helpers/schema.js";
import {
  buildYamlPages,
  renderYamlPage,
  yamlPageRelPath,
  YAML_PAGE_MARKER,
} from "../../../src/docs/yaml-pages.js";

describe("yamlPageRelPath", () => {
  it("returns the generated/<name>.md path next to the YAML file", () => {
    const actual = yamlPageRelPath("docs/ja/projects/prj-0001/pm-roles.yaml");

    expect(actual).toBe("docs/ja/projects/prj-0001/generated/pm-roles.md");
  });
});

describe("renderYamlPage", () => {
  const sampleTypes: Record<string, string> = {
    "bdd-sample.yaml": "data",
    "dct-index-sample.yaml": "project",
    "dct-sample.yaml": "project",
    "gl-sample.yaml": "glossary",
    "ifx-api-sample.yaml": "api",
    "ifx-cmd-sample.yaml": "api",
    "ifx-index-sample.yaml": "api",
    "ifx-msg-sample.yaml": "api",
    "pm-members-sample.yaml": "project",
    "pm-roles-sample.yaml": "project",
    "tml-sample.yaml": "project",
  };

  it("covers every bundled YAML sample", () => {
    expect(
      readdirSync("docs/ja/specdojo/samples")
        .filter((name) => /\.ya?ml$/.test(name))
        .sort(),
    ).toEqual(Object.keys(sampleTypes).sort());
  });

  it.each(Object.entries(sampleTypes))(
    "inherits %s's type and produces valid frontmatter",
    (name, type) => {
      const path = `docs/ja/specdojo/samples/${name}`;
      const page = renderYamlPage(path, readFileSync(path, "utf8"));
      const metadata = load(page.split("---")[1]) as { specdojo: { type: string } };
      expect(metadata.specdojo.type).toBe(type);
      const validate = buildValidator(
        "docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml",
      );
      expect(validate(metadata), JSON.stringify(validate.errors)).toBe(true);
    },
  );

  it.each(["samples", "templates", "projects/example"])(
    "inherits type regardless of placement in %s",
    (directory) => {
      const page = renderYamlPage(
        `docs/ja/${directory}/example.yaml`,
        "id: example\ntype: glossary\n",
      );
      expect(page).toContain("  type: glossary\n");
    },
  );

  it("preserves the template's own type instead of the generated artifact type", () => {
    const path = "docs/ja/specdojo/templates/ifx-cmd-template.yaml";
    const page = renderYamlPage(path, readFileSync(path, "utf8"));
    const metadata = load(page.split("---")[1]) as { specdojo: { type: string } };
    expect(metadata.specdojo.type).toBe("template");
  });

  it("does not invent a type when the source omits it", () => {
    const page = renderYamlPage("docs/ja/specdojo/samples/example.yaml", "id: example\n");
    expect(page).toMatch(/^# example.yaml\n/);
    expect(page).not.toContain("specdojo:\n");
    expect(page).toContain(YAML_PAGE_MARKER);
    expect(page).toContain("```yaml\nid: example\n");
  });

  it("derives frontmatter from the YAML metadata and embeds the content in a yaml fence", () => {
    const content =
      "id: specdojo:pm-roles-sample\ntype: project\nstatus: ready\nrulebook: specdojo:pm-roles-rulebook\n";

    const page = renderYamlPage("docs/ja/specdojo/samples/pm-roles-sample.yaml", content);

    expect(page).toContain("  id: specdojo:pm-roles-sample\n");
    expect(page).toContain("  type: project\n");
    expect(page).toContain("  status: ready\n");
    expect(page).toContain("  rulebook: specdojo:pm-roles-rulebook\n");
    expect(page).toContain("# pm-roles-sample.yaml");
    expect(page).toContain(YAML_PAGE_MARKER);
    expect(page).toContain("```yaml\nid: specdojo:pm-roles-sample\n");
  });

  it("uses the YAML title as the page heading and keeps it out of the frontmatter", () => {
    const content =
      "id: prj-0001:pm-roles\ntype: project\nstatus: ready\ntitle: ロール一覧\nrulebook: specdojo:pm-roles-rulebook\n";

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
    expect(page).toContain("  type: domain\n");
    expect(page).toContain("  status: draft\n");
    expect(page).toContain("  rulebook: none\n");
  });

  it("reads id and status from x-spec-meta and the heading from info.title for OpenAPI YAML", () => {
    const content = [
      "openapi: 3.0.3",
      "info:",
      "  title: 決済サービスAPI",
      "x-spec-meta:",
      "  id: specdojo:ifx-api-sample",
      "  type: api",
      "  status: draft",
      "",
    ].join("\n");

    const page = renderYamlPage("docs/ja/specdojo/samples/ifx-api-sample.yaml", content);

    expect(page).toContain("  id: specdojo:ifx-api-sample\n");
    expect(page).toContain("  type: api\n");
    expect(page).toContain("  status: draft\n");
    expect(page).toContain("# 決済サービスAPI\n");
  });

  it("uses a longer fence when the YAML content contains triple backticks", () => {
    const content = "id: specdojo:gl-sample\nnote: |\n  ```yaml\n  nested: fence\n  ```\n";

    const page = renderYamlPage("docs/ja/specdojo/samples/gl-sample.yaml", content);

    expect(page).toContain("````yaml\n");
    expect(page).toContain("\n````\n");
  });

  it("renders dct catalog templates as a readable table instead of a yaml code block", () => {
    const content = [
      "id: specdojo:dct-architecture-template",
      "type: template",
      "status: draft",
      "title: 成果物カタログ（アーキテクチャ）",
      "rulebook: specdojo:dct-rulebook",
      "domain: architecture",
      "base_path: /docs/ja/product/030-architecture",
      "groups:",
      "  - name: C4",
      "    base_path: 010-c4",
      "    deliverables:",
      "      - local_id: cxd-_CONTEXT_",
      "        name: C4コンテキスト図",
      "        kind: work",
      "        overview: 対象システムと外部との関係を定義する",
      "        path: cxd-_CONTEXT_.md",
      "        done_criteria:",
      "          - text: 境界が業務観点で表現されていること",
      "            roles: [BA]",
      "            viewpoint: vp-ba-requirements-completeness",
      "",
    ].join("\n");

    const page = renderYamlPage(
      "docs/ja/specdojo/templates/dct-architecture-template.yaml",
      content,
    );

    expect(page).toContain("# 成果物カタログ（アーキテクチャ）\n");
    expect(page).toContain("| local-id | 成果物名 | 種別 | 根拠 | 概要 |");
    expect(page).toContain("| `cxd-_CONTEXT_` | C4コンテキスト図 | work | - |");
    expect(page).toContain("**`cxd-_CONTEXT_`** の完了条件:");
    expect(page).toContain(YAML_PAGE_MARKER);
    expect(page).not.toContain("```yaml");
  });
});

describe("buildYamlPages", () => {
  it("refreshes untyped internal YAML pages without declaring artifact frontmatter", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-yaml-pages-"));
    try {
      const projectDir = join(dir, "docs/ja/projects/prj-0001");
      mkdirSync(join(projectDir, "generated"), { recursive: true });
      writeFileSync(join(projectDir, "job-example.yaml"), "id: job-example\nname: Example\n");
      const pagePath = join(projectDir, "generated/job-example.md");
      writeFileSync(
        pagePath,
        `---\nspecdojo:\n  id: job-example\n  status: draft\n---\n\n${YAML_PAGE_MARKER}\n`,
      );

      const result = buildYamlPages(join(dir, "docs"), dir);
      expect(result.written).toEqual(["docs/ja/projects/prj-0001/generated/job-example.md"]);
      const page = readFileSync(pagePath, "utf8");
      expect(page).toMatch(/^# job-example.yaml\n/);
      expect(page).toContain(YAML_PAGE_MARKER);
      expect(page).toContain("```yaml\nid: job-example\n");
      expect(buildYamlPages(join(dir, "docs"), dir).unchanged).toEqual(result.written);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("writes display pages for indexed YAML files and rewrites them when the source changes", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-yaml-pages-"));

    try {
      const projectDir = join(dir, "docs", "ja", "projects", "prj-0001");
      mkdirSync(projectDir, { recursive: true });
      const source = join(projectDir, "pm-roles.yaml");
      writeFileSync(source, "id: prj-0001:pm-roles\ntype: project\nstatus: draft\n", "utf8");

      const first = buildYamlPages(join(dir, "docs"), dir);

      const pagePath = join(projectDir, "generated", "pm-roles.md");
      expect(first.written).toEqual(["docs/ja/projects/prj-0001/generated/pm-roles.md"]);
      expect(readFileSync(pagePath, "utf8")).toContain("  id: prj-0001:pm-roles\n");
      expect(readFileSync(pagePath, "utf8")).toContain("  type: project\n");

      const second = buildYamlPages(join(dir, "docs"), dir);
      expect(second.written).toEqual([]);
      expect(second.unchanged).toEqual(["docs/ja/projects/prj-0001/generated/pm-roles.md"]);

      writeFileSync(source, "id: prj-0001:pm-roles\ntype: project\nstatus: ready\n", "utf8");
      const third = buildYamlPages(join(dir, "docs"), dir);
      expect(third.written).toEqual(["docs/ja/projects/prj-0001/generated/pm-roles.md"]);
      expect(readFileSync(pagePath, "utf8")).toContain("  status: ready\n");
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
