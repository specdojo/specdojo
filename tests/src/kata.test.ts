import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  declaredIncludes,
  declaredKata,
  resolveDeliverableSchemaRef,
  resolveIncludedRulebooks,
  resolveKataRefs,
} from "../../src/kata.js";
import { practiceLocalId } from "../../src/practice-id.js";
import { validateRulebookKata } from "../../src/catalog-build.js";

// specdojoRootDir() は cwd から上方探索するため、temp ルートへ chdir して
// docs/ja/specdojo/* を温度差なく解決できるようにする。
const SPECDOJO = "docs/ja/specdojo";

describe("kata", () => {
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
    // SpecDojo frontmatter は `specdojo:` 名前空間配下に置く。フラットな key: value 行を
    // 2 スペース字下げして名前空間へ入れる。
    const nested = frontmatter
      .split("\n")
      .map((line) => (line.length === 0 ? "" : `  ${line}`))
      .join("\n");
    writeFileSync(
      join(root, SPECDOJO, "rulebooks", `${practiceLocalId(id)}.md`),
      `---\nspecdojo:\n${nested}\n---\n\n# ${id}\n`,
      "utf8",
    );
  }

  describe("resolveKataRefs", () => {
    it("rulebook frontmatter の宣言から各参照先パスを解決する", () => {
      writeRulebook(
        "specdojo:prj-overview-rulebook",
        [
          "id: specdojo:prj-overview-rulebook",
          "type: rulebook",
          "status: draft",
          "target_format: markdown",
          "recipe: specdojo:prj-overview-recipe",
          "sample: specdojo:prj-overview-sample",
          "template: specdojo:prj-overview-template",
        ].join("\n"),
      );

      const refs = resolveKataRefs("specdojo:prj-overview-rulebook");

      expect(refs).toEqual({
        rulebook: "docs/ja/specdojo/rulebooks/prj-overview-rulebook.md",
        recipe: "docs/ja/specdojo/recipes/prj-overview-recipe.md",
        sample: "docs/ja/specdojo/samples/prj-overview-sample.md",
        template: "docs/ja/specdojo/templates/prj-overview-template.md",
      });
    });

    it("sample の拡張子は target_format に従う", () => {
      writeRulebook(
        "specdojo:dct-rulebook",
        [
          "id: specdojo:dct-rulebook",
          "type: rulebook",
          "status: draft",
          "target_format: yaml",
          "sample: specdojo:dct-sample",
        ].join("\n"),
      );

      expect(resolveKataRefs("specdojo:dct-rulebook").sample).toBe(
        "docs/ja/specdojo/samples/dct-sample.yaml",
      );
    });

    it("複数 sample の宣言では先頭を既定例として解決する", () => {
      writeRulebook(
        "specdojo:opr-rulebook",
        [
          "id: specdojo:opr-rulebook",
          "type: rulebook",
          "status: draft",
          "sample:",
          "  - specdojo:opr-sample",
          "  - specdojo:opr-incident-sample",
        ].join("\n"),
      );

      expect(resolveKataRefs("specdojo:opr-rulebook").sample).toBe(
        "docs/ja/specdojo/samples/opr-sample.md",
      );
    });

    it("template の拡張子も target_format に従う", () => {
      writeRulebook(
        "specdojo:pm-roles-rulebook",
        [
          "id: specdojo:pm-roles-rulebook",
          "type: rulebook",
          "status: draft",
          "target_format: yaml",
          "template: specdojo:pm-roles-template",
        ].join("\n"),
      );

      expect(resolveKataRefs("specdojo:pm-roles-rulebook").template).toBe(
        "docs/ja/specdojo/templates/pm-roles-template.yaml",
      );
    });

    it("宣言 ID に対象形式と異なる実在ファイルがあれば実在する拡張子を使う", () => {
      writeRulebook(
        "specdojo:dct-index-rulebook",
        [
          "id: specdojo:dct-index-rulebook",
          "type: rulebook",
          "status: draft",
          "target_format: yaml",
          "template: specdojo:dct-index-template",
        ].join("\n"),
      );
      writeFileSync(
        join(root, SPECDOJO, "templates", "dct-index-template.md"),
        "# template\n",
        "utf8",
      );

      expect(resolveKataRefs("specdojo:dct-index-rulebook").template).toBe(
        "docs/ja/specdojo/templates/dct-index-template.md",
      );
    });

    it("rulebook が未指定なら全項目を MISSING にする", () => {
      expect(resolveKataRefs(undefined)).toEqual({
        rulebook: "_MISSING_",
        recipe: "_MISSING_",
        sample: "_MISSING_",
        template: "_MISSING_",
      });
    });

    it("undecided は文書 ID として解決せず全項目を MISSING にする", () => {
      expect(resolveKataRefs("undecided")).toEqual({
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

      const refs = resolveKataRefs("minimal-rulebook");

      expect(refs.rulebook).toBe("docs/ja/specdojo/rulebooks/minimal-rulebook.md");
      expect(refs.recipe).toBe("_MISSING_");
      expect(refs.sample).toBe("_MISSING_");
      expect(refs.template).toBe("_MISSING_");
    });

    it("未宣言の参照は慣例ファイルが存在しても MISSING にする", () => {
      writeRulebook(
        "specdojo:pm-organization-rulebook",
        [
          "id: specdojo:pm-organization-rulebook",
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

      const refs = resolveKataRefs("specdojo:pm-organization-rulebook");

      expect(refs.sample).toBe("_MISSING_");
      expect(refs.recipe).toBe("_MISSING_");
      expect(refs.template).toBe("_MISSING_");
    });

    it("宣言が 'not-needed' なら慣例ファイルが存在しても MISSING にする", () => {
      writeRulebook(
        "opt-out-rulebook",
        ["id: opt-out-rulebook", "type: rulebook", "status: draft", "sample: not-needed"].join(
          "\n",
        ),
      );
      writeFileSync(join(root, SPECDOJO, "samples", "opt-out-sample.md"), "# sample\n", "utf8");

      expect(resolveKataRefs("opt-out-rulebook").sample).toBe("_MISSING_");
    });

    it("kind: generated には rulebook の宣言があっても実践の型を適用しない", () => {
      writeRulebook(
        "specdojo:generated-rulebook",
        [
          "id: specdojo:generated-rulebook",
          "type: rulebook",
          "status: draft",
          "recipe: specdojo:generated-recipe",
          "sample: specdojo:generated-sample",
          "template: specdojo:generated-template",
        ].join("\n"),
      );

      expect(resolveKataRefs("specdojo:generated-rulebook", "generated")).toEqual({
        rulebook: "_MISSING_",
        recipe: "_MISSING_",
        sample: "_MISSING_",
        template: "_MISSING_",
      });
    });
  });

  describe("resolveDeliverableSchemaRef", () => {
    const SCHEMA_DIR = "docs/specdojo/schemas/v1";

    function writeSchema(stem: string): void {
      mkdirSync(join(root, SCHEMA_DIR), { recursive: true });
      writeFileSync(join(root, SCHEMA_DIR, `${stem}.schema.yaml`), "type: object\n", "utf8");
    }

    function writeYaml(relPath: string, schemaStem: string): void {
      writeSchema(schemaStem);
      mkdirSync(join(root, "docs/ja/projects/prj-0001/030-project-management"), {
        recursive: true,
      });
      writeFileSync(
        join(root, relPath),
        [
          "# yaml-language-server: $schema=../../../../specdojo/schemas/v1/" +
            `${schemaStem}.schema.yaml`,
          "id: prj-0001:pm-roles",
        ].join("\n"),
        "utf8",
      );
    }

    it("対象 YAML の modeline を正として repo 相対 schema パスを解決する", () => {
      writeYaml("docs/ja/projects/prj-0001/030-project-management/pm-roles.yaml", "pm-roles");

      expect(
        resolveDeliverableSchemaRef(
          "docs/ja/projects/prj-0001/030-project-management/pm-roles.yaml",
        ),
      ).toBe("docs/specdojo/schemas/v1/pm-roles.schema.yaml");
    });

    it("rulebook frontmatter の schema 宣言ではなく modeline を読む", () => {
      writeRulebook(
        "specdojo:pm-roles-rulebook",
        [
          "id: specdojo:pm-roles-rulebook",
          "type: rulebook",
          "status: draft",
          "target_format: yaml",
          "schema: other-schema",
        ].join("\n"),
      );
      writeYaml("docs/ja/projects/prj-0001/030-project-management/pm-roles.yaml", "pm-roles");

      expect(
        resolveDeliverableSchemaRef(
          "docs/ja/projects/prj-0001/030-project-management/pm-roles.yaml",
        ),
      ).toBe("docs/specdojo/schemas/v1/pm-roles.schema.yaml");
    });

    it("schema none 指示なら MISSING にする", () => {
      mkdirSync(join(root, "docs/ja/specdojo/samples"), { recursive: true });
      writeFileSync(
        join(root, "docs/ja/specdojo/samples/ifx-api-sample.yaml"),
        "# specdojo-schema: none reason=external-openapi\nopenapi: 3.0.3\n",
        "utf8",
      );

      expect(resolveDeliverableSchemaRef("docs/ja/specdojo/samples/ifx-api-sample.yaml")).toBe(
        "_MISSING_",
      );
    });

    it("modeline が無い YAML は MISSING にする", () => {
      mkdirSync(join(root, "docs/ja/projects/prj-0001/030-project-management"), {
        recursive: true,
      });
      writeFileSync(
        join(root, "docs/ja/projects/prj-0001/030-project-management/pm-roles.yaml"),
        "id: prj-0001:pm-roles\n",
        "utf8",
      );

      expect(
        resolveDeliverableSchemaRef(
          "docs/ja/projects/prj-0001/030-project-management/pm-roles.yaml",
        ),
      ).toBe("_MISSING_");
    });

    it("対象ファイル未指定なら MISSING にする", () => {
      expect(resolveDeliverableSchemaRef(undefined)).toBe("_MISSING_");
    });
  });

  describe("declaredKata", () => {
    it("宣言された参照のみを kind / id / 絶対パスで返す", () => {
      writeRulebook(
        "specdojo:prj-overview-rulebook",
        [
          "id: specdojo:prj-overview-rulebook",
          "type: rulebook",
          "status: draft",
          "recipe: specdojo:prj-overview-recipe",
          "template: specdojo:prj-overview-template",
        ].join("\n"),
      );

      const refs = declaredKata("specdojo:prj-overview-rulebook");

      expect(refs.map((r) => r.kind)).toEqual(["recipe", "template"]);
      expect(refs.map((r) => r.id)).toEqual([
        "specdojo:prj-overview-recipe",
        "specdojo:prj-overview-template",
      ]);
      expect(refs[0].fsPath).toBe(join(root, SPECDOJO, "recipes", "prj-overview-recipe.md"));
    });

    it("sample の配列宣言をすべて返す", () => {
      writeRulebook(
        "specdojo:opr-rulebook",
        [
          "id: specdojo:opr-rulebook",
          "type: rulebook",
          "status: draft",
          "sample:",
          "  - specdojo:opr-sample",
          "  - specdojo:opr-incident-sample",
        ].join("\n"),
      );

      expect(declaredKata("specdojo:opr-rulebook").map((ref) => ref.id)).toEqual([
        "specdojo:opr-sample",
        "specdojo:opr-incident-sample",
      ]);
    });
  });

  describe("resolveIncludedRulebooks", () => {
    it("include を宣言順・重複除去で解決し、実在するファイルのみ返す", () => {
      writeRulebook("a-mermaid-rulebook", ["id: a-mermaid-rulebook", "type: rulebook"].join("\n"));
      writeRulebook("b-mermaid-rulebook", ["id: b-mermaid-rulebook", "type: rulebook"].join("\n"));
      writeRulebook(
        "a-rulebook",
        [
          "id: a-rulebook",
          "type: rulebook",
          "status: draft",
          "includes:",
          "  - b-mermaid-rulebook",
          "  - a-mermaid-rulebook",
        ].join("\n"),
      );

      expect(resolveIncludedRulebooks("a-rulebook")).toEqual([
        "docs/ja/specdojo/rulebooks/b-mermaid-rulebook.md",
        "docs/ja/specdojo/rulebooks/a-mermaid-rulebook.md",
      ]);
    });

    it("実在しない include は除外する", () => {
      writeRulebook(
        "a-rulebook",
        [
          "id: a-rulebook",
          "type: rulebook",
          "status: draft",
          "includes:",
          "  - ghost-rulebook",
        ].join("\n"),
      );

      expect(resolveIncludedRulebooks("a-rulebook")).toEqual([]);
    });

    it("自己参照は除外する", () => {
      writeRulebook(
        "a-rulebook",
        ["id: a-rulebook", "type: rulebook", "status: draft", "includes:", "  - a-rulebook"].join(
          "\n",
        ),
      );

      expect(resolveIncludedRulebooks("a-rulebook")).toEqual([]);
    });

    it("rulebook 未指定・includes 未宣言なら空配列を返す", () => {
      writeRulebook("a-rulebook", ["id: a-rulebook", "type: rulebook", "status: draft"].join("\n"));

      expect(resolveIncludedRulebooks(undefined)).toEqual([]);
      expect(resolveIncludedRulebooks("none")).toEqual([]);
      expect(resolveIncludedRulebooks("a-rulebook")).toEqual([]);
    });
  });

  describe("declaredIncludes", () => {
    it("宣言された include を重複除去し、自己参照フラグ付きで返す", () => {
      writeRulebook(
        "a-rulebook",
        [
          "id: a-rulebook",
          "type: rulebook",
          "status: draft",
          "includes:",
          "  - b-mermaid-rulebook",
          "  - a-rulebook",
        ].join("\n"),
      );

      const includes = declaredIncludes("a-rulebook");

      expect(includes.map((i) => i.id)).toEqual(["b-mermaid-rulebook", "a-rulebook"]);
      expect(includes.map((i) => i.selfReference)).toEqual([false, true]);
      expect(includes[0].fsPath).toBe(join(root, SPECDOJO, "rulebooks", "b-mermaid-rulebook.md"));
    });
  });

  describe("validateRulebookKata", () => {
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

      const { warnings } = validateRulebookKata(catalogDir);

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

      expect(validateRulebookKata(catalogDir).warnings).toEqual([]);
    });

    it("実在する sample をどの rulebook も宣言していなければ警告する", () => {
      writeRulebook(
        "doc-rulebook",
        ["id: doc-rulebook", "type: rulebook", "status: draft"].join("\n"),
      );
      writeFileSync(
        join(root, SPECDOJO, "samples", "doc-sample.md"),
        "---\nspecdojo:\n  id: specdojo:doc-sample\n  type: sample\n  status: draft\n---\n\n# sample\n",
        "utf8",
      );
      const catalogDir = writeCatalog("doc-rulebook");

      const { warnings } = validateRulebookKata(catalogDir);

      expect(warnings).toHaveLength(1);
      expect(warnings[0]).toContain("sample 'doc-sample' exists but no rulebook declares it");
    });

    it("複数の sample がすべて宣言されていれば警告しない", () => {
      writeRulebook(
        "doc-rulebook",
        [
          "id: doc-rulebook",
          "type: rulebook",
          "status: draft",
          "sample:",
          "  - specdojo:doc-sample",
          "  - specdojo:doc-alternate-sample",
        ].join("\n"),
      );
      for (const id of ["doc-sample", "doc-alternate-sample"]) {
        writeFileSync(
          join(root, SPECDOJO, "samples", `${id}.md`),
          `---\nspecdojo:\n  id: specdojo:${id}\n  type: sample\n  status: draft\n---\n\n# sample\n`,
          "utf8",
        );
      }
      const catalogDir = writeCatalog("doc-rulebook");

      expect(validateRulebookKata(catalogDir).warnings).toEqual([]);
    });

    it("include 先ファイルが存在しなければ警告する", () => {
      writeRulebook(
        "doc-rulebook",
        [
          "id: doc-rulebook",
          "type: rulebook",
          "status: draft",
          "includes:",
          "  - ghost-rulebook",
        ].join("\n"),
      );
      const catalogDir = writeCatalog("doc-rulebook");

      const { warnings } = validateRulebookKata(catalogDir);

      expect(warnings).toHaveLength(1);
      expect(warnings[0]).toContain("rulebook 'doc-rulebook' includes 'ghost-rulebook'");
      expect(warnings[0]).toContain("missing");
    });

    it("自己参照の include を警告する", () => {
      writeRulebook(
        "doc-rulebook",
        [
          "id: doc-rulebook",
          "type: rulebook",
          "status: draft",
          "includes:",
          "  - doc-rulebook",
        ].join("\n"),
      );
      const catalogDir = writeCatalog("doc-rulebook");

      const { warnings } = validateRulebookKata(catalogDir);

      expect(warnings).toHaveLength(1);
      expect(warnings[0]).toContain("includes itself");
    });

    it("include 先が rulebook 種別でなければ警告する", () => {
      writeRulebook(
        "doc-rulebook",
        [
          "id: doc-rulebook",
          "type: rulebook",
          "status: draft",
          "includes:",
          "  - notation-rulebook",
        ].join("\n"),
      );
      // frontmatter の type を rulebook 以外にした include 先。
      writeFileSync(
        join(root, SPECDOJO, "rulebooks", "notation-rulebook.md"),
        "---\nspecdojo:\n  id: notation-rulebook\n  type: recipe\n  status: draft\n---\n\n# x\n",
        "utf8",
      );
      const catalogDir = writeCatalog("doc-rulebook");

      const { warnings } = validateRulebookKata(catalogDir);

      expect(warnings).toHaveLength(1);
      expect(warnings[0]).toContain("is not a rulebook");
    });

    it("実在する rulebook 種別の include は警告しない", () => {
      writeRulebook(
        "doc-rulebook",
        [
          "id: doc-rulebook",
          "type: rulebook",
          "status: draft",
          "includes:",
          "  - notation-rulebook",
        ].join("\n"),
      );
      writeRulebook(
        "notation-rulebook",
        ["id: notation-rulebook", "type: rulebook", "status: draft"].join("\n"),
      );
      const catalogDir = writeCatalog("doc-rulebook");

      expect(validateRulebookKata(catalogDir).warnings).toEqual([]);
    });
  });
});
