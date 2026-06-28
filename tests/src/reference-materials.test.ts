import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  declaredReferences,
  resolveDeliverableSchemaRef,
  resolveReferenceMaterialRefs,
} from "../../src/reference-materials.js";
import { validateRulebookReferenceMaterials } from "../../src/catalog-build.js";

// specdojoRootDir() は cwd から上方探索するため、temp ルートへ chdir して
// docs/ja/specdojo/* を温度差なく解決できるようにする。
const SPECDOJO = "docs/ja/specdojo";

describe("reference-materials", () => {
  let root: string;
  let originalCwd: string;

  beforeEach(() => {
    originalCwd = process.cwd();
    root = mkdtempSync(join(tmpdir(), "specdojo-refmat-"));
    // specdojoRootDir() が temp ルートで停止するよう config マーカーを置く。
    mkdirSync(join(root, ".specdojo"), { recursive: true });
    writeFileSync(join(root, ".specdojo", "specdojo.config.json"), "{}", "utf8");
    for (const dir of ["rulebooks", "recipes", "samples", "templates"]) {
      mkdirSync(join(root, SPECDOJO, dir), { recursive: true });
    }
    process.chdir(root);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    rmSync(root, { recursive: true, force: true });
  });

  function writeRulebook(id: string, frontmatter: string): void {
    writeFileSync(
      join(root, SPECDOJO, "rulebooks", `${id}.md`),
      `---\n${frontmatter}\n---\n\n# ${id}\n`,
      "utf8",
    );
  }

  describe("resolveReferenceMaterialRefs", () => {
    it("rulebook frontmatter の宣言から各参照先パスを解決する", () => {
      writeRulebook(
        "prj-overview-rulebook",
        [
          "id: prj-overview-rulebook",
          "type: rulebook",
          "status: draft",
          "target_format: markdown",
          "recipe: prj-overview-recipe",
          "sample: prj-overview-sample",
          "template: prj-overview-template",
        ].join("\n"),
      );

      const refs = resolveReferenceMaterialRefs("prj-overview-rulebook");

      expect(refs).toEqual({
        rulebook: "docs/ja/specdojo/rulebooks/prj-overview-rulebook.md",
        recipe: "docs/ja/specdojo/recipes/prj-overview-recipe.md",
        sample: "docs/ja/specdojo/samples/prj-overview-sample.md",
        template: "docs/ja/specdojo/templates/prj-overview-template.md",
      });
    });

    it("sample の拡張子は target_format に従う", () => {
      writeRulebook(
        "dct-rulebook",
        [
          "id: dct-rulebook",
          "type: rulebook",
          "status: draft",
          "target_format: yaml",
          "sample: dct-sample",
        ].join("\n"),
      );

      expect(resolveReferenceMaterialRefs("dct-rulebook").sample).toBe(
        "docs/ja/specdojo/samples/dct-sample.yaml",
      );
    });

    it("template の拡張子も target_format に従う", () => {
      writeRulebook(
        "pm-roles-rulebook",
        [
          "id: pm-roles-rulebook",
          "type: rulebook",
          "status: draft",
          "target_format: yaml",
          "template: pm-roles-template",
        ].join("\n"),
      );

      expect(resolveReferenceMaterialRefs("pm-roles-rulebook").template).toBe(
        "docs/ja/specdojo/templates/pm-roles-template.yaml",
      );
    });

    it("rulebook が未指定なら全項目を MISSING にする", () => {
      expect(resolveReferenceMaterialRefs(undefined)).toEqual({
        rulebook: "_MISSING_",
        recipe: "_MISSING_",
        sample: "_MISSING_",
        template: "_MISSING_",
      });
    });

    it("宣言の無い参照は MISSING にし、rulebook パスは規約で返す", () => {
      writeRulebook(
        "minimal-rulebook",
        ["id: minimal-rulebook", "type: rulebook", "status: draft"].join("\n"),
      );

      const refs = resolveReferenceMaterialRefs("minimal-rulebook");

      expect(refs.rulebook).toBe("docs/ja/specdojo/rulebooks/minimal-rulebook.md");
      expect(refs.recipe).toBe("_MISSING_");
      expect(refs.sample).toBe("_MISSING_");
      expect(refs.template).toBe("_MISSING_");
    });

    it("未宣言でも規定ディレクトリに慣例ファイルがあればそのパスを返す", () => {
      writeRulebook(
        "pm-organization-rulebook",
        [
          "id: pm-organization-rulebook",
          "type: rulebook",
          "status: draft",
          "target_format: markdown",
        ].join("\n"),
      );
      // sample のみ慣例ファイル名で実在し、recipe / template は存在しない。
      writeFileSync(
        join(root, SPECDOJO, "samples", "pm-organization-sample.md"),
        "# sample\n",
        "utf8",
      );

      const refs = resolveReferenceMaterialRefs("pm-organization-rulebook");

      expect(refs.sample).toBe("docs/ja/specdojo/samples/pm-organization-sample.md");
      expect(refs.recipe).toBe("_MISSING_");
      expect(refs.template).toBe("_MISSING_");
    });

    it("宣言が 'none' なら慣例ファイルが存在しても MISSING にする", () => {
      writeRulebook(
        "opt-out-rulebook",
        ["id: opt-out-rulebook", "type: rulebook", "status: draft", "sample: none"].join("\n"),
      );
      writeFileSync(join(root, SPECDOJO, "samples", "opt-out-sample.md"), "# sample\n", "utf8");

      expect(resolveReferenceMaterialRefs("opt-out-rulebook").sample).toBe("_MISSING_");
    });
  });

  describe("resolveDeliverableSchemaRef", () => {
    const SCHEMA_DIR = "docs/specdojo/schemas/v1";

    function writeSchema(stem: string): void {
      mkdirSync(join(root, SCHEMA_DIR), { recursive: true });
      writeFileSync(join(root, SCHEMA_DIR, `${stem}.schema.yaml`), "type: object\n", "utf8");
    }

    it("frontmatter の schema 宣言を正としてパスを解決する", () => {
      writeRulebook(
        "pm-roles-rulebook",
        [
          "id: pm-roles-rulebook",
          "type: rulebook",
          "status: draft",
          "target_format: yaml",
          "schema: pm-roles",
        ].join("\n"),
      );

      expect(resolveDeliverableSchemaRef("pm-roles-rulebook", "pm-roles")).toBe(
        "docs/specdojo/schemas/v1/pm-roles.schema.yaml",
      );
    });

    it("未宣言なら local_id の慣例 schema を実在確認して返す", () => {
      writeRulebook(
        "pm-roles-rulebook",
        ["id: pm-roles-rulebook", "type: rulebook", "status: draft", "target_format: yaml"].join(
          "\n",
        ),
      );
      writeSchema("pm-roles");

      expect(resolveDeliverableSchemaRef("pm-roles-rulebook", "pm-roles")).toBe(
        "docs/specdojo/schemas/v1/pm-roles.schema.yaml",
      );
    });

    it("local_id の schema が無ければ rulebook prefix の schema にフォールバックする", () => {
      writeRulebook(
        "bdd-rulebook",
        ["id: bdd-rulebook", "type: rulebook", "status: draft", "target_format: yaml"].join("\n"),
      );
      // 共有型インスタンス: bdd-purchase.schema.yaml は無く、型 schema bdd.schema.yaml のみ実在。
      writeSchema("bdd");

      expect(resolveDeliverableSchemaRef("bdd-rulebook", "bdd-purchase")).toBe(
        "docs/specdojo/schemas/v1/bdd.schema.yaml",
      );
    });

    it("target_format が yaml 以外なら MISSING にする", () => {
      writeRulebook(
        "prj-overview-rulebook",
        [
          "id: prj-overview-rulebook",
          "type: rulebook",
          "status: draft",
          "target_format: markdown",
        ].join("\n"),
      );
      writeSchema("prj-overview");

      expect(resolveDeliverableSchemaRef("prj-overview-rulebook", "prj-overview")).toBe(
        "_MISSING_",
      );
    });

    it("schema 宣言が 'none' なら慣例ファイルが存在しても MISSING にする", () => {
      writeRulebook(
        "pm-roles-rulebook",
        [
          "id: pm-roles-rulebook",
          "type: rulebook",
          "status: draft",
          "target_format: yaml",
          "schema: none",
        ].join("\n"),
      );
      writeSchema("pm-roles");

      expect(resolveDeliverableSchemaRef("pm-roles-rulebook", "pm-roles")).toBe("_MISSING_");
    });

    it("該当 schema が無ければ MISSING にする", () => {
      writeRulebook(
        "pm-roles-rulebook",
        ["id: pm-roles-rulebook", "type: rulebook", "status: draft", "target_format: yaml"].join(
          "\n",
        ),
      );

      expect(resolveDeliverableSchemaRef("pm-roles-rulebook", "pm-roles")).toBe("_MISSING_");
    });

    it("rulebook 未指定なら MISSING にする", () => {
      expect(resolveDeliverableSchemaRef(undefined, "pm-roles")).toBe("_MISSING_");
    });
  });

  describe("declaredReferences", () => {
    it("宣言された参照のみを kind / id / 絶対パスで返す", () => {
      writeRulebook(
        "prj-overview-rulebook",
        [
          "id: prj-overview-rulebook",
          "type: rulebook",
          "status: draft",
          "recipe: prj-overview-recipe",
          "template: prj-overview-template",
        ].join("\n"),
      );

      const refs = declaredReferences("prj-overview-rulebook");

      expect(refs.map((r) => r.kind)).toEqual(["recipe", "template"]);
      expect(refs.map((r) => r.id)).toEqual(["prj-overview-recipe", "prj-overview-template"]);
      expect(refs[0].fsPath).toBe(join(root, SPECDOJO, "recipes", "prj-overview-recipe.md"));
    });
  });

  describe("validateRulebookReferenceMaterials", () => {
    function writeCatalog(rulebookId: string): string {
      const catalogDir = join(root, "catalog");
      mkdirSync(catalogDir, { recursive: true });
      writeFileSync(
        join(catalogDir, "dct-test.yaml"),
        [
          "id: test:dct",
          "type: project",
          "status: draft",
          "project_id: test",
          "domain: test",
          "groups:",
          "  - deliverables:",
          "      - local_id: doc",
          "        name: Doc",
          "        kind: work",
          `        rulebook: ${rulebookId}`,
          "",
        ].join("\n"),
        "utf8",
      );
      return catalogDir;
    }

    it("宣言された参照先ファイルが存在しなければ警告する", () => {
      writeRulebook(
        "doc-rulebook",
        ["id: doc-rulebook", "type: rulebook", "status: draft", "recipe: doc-recipe"].join("\n"),
      );
      const catalogDir = writeCatalog("doc-rulebook");

      const { warnings } = validateRulebookReferenceMaterials(catalogDir);

      expect(warnings).toHaveLength(1);
      expect(warnings[0]).toContain("rulebook 'doc-rulebook' declares recipe 'doc-recipe'");
    });

    it("宣言された参照先ファイルが存在すれば警告しない", () => {
      writeRulebook(
        "doc-rulebook",
        ["id: doc-rulebook", "type: rulebook", "status: draft", "recipe: doc-recipe"].join("\n"),
      );
      writeFileSync(join(root, SPECDOJO, "recipes", "doc-recipe.md"), "# recipe\n", "utf8");
      const catalogDir = writeCatalog("doc-rulebook");

      expect(validateRulebookReferenceMaterials(catalogDir).warnings).toEqual([]);
    });
  });
});
