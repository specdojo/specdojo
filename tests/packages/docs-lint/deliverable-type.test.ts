import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { remark } from "remark";
import { buildValidator } from "../../helpers/schema.js";

const require = createRequire(import.meta.url);
const plugin = require("../../../packages/docs-lint/src/remark-frontmatter-ajv2020.cjs");
const directories: string[] = [];

afterEach(() => {
  for (const directory of directories.splice(0))
    rmSync(directory, { recursive: true, force: true });
});

function write(root: string, file: string, content: string): void {
  mkdirSync(dirname(join(root, file)), { recursive: true });
  writeFileSync(join(root, file), content);
}

function workspace(): string {
  const root = mkdtempSync(join(tmpdir(), "specdojo-deliverable-type-"));
  directories.push(root);
  write(root, "schema.yaml", "type: object\n");
  write(root, "package.json", '{"name":"example"}');
  return root;
}

function rulebook(root: string, id: string, type?: string, file?: string): void {
  write(
    root,
    file ?? `docs/ja/specdojo/rulebooks/${id.replace(":", "/")}.md`,
    `---\nspecdojo:\n  id: ${id}\n  type: rulebook\n  status: draft\n${type ? `  deliverable_type: ${type}\n` : ""}---\n`,
  );
}

function document(type: string, ref = "specdojo:example-rulebook"): string {
  return `---\nspecdojo:\n  id: example\n  type: ${type}\n  status: draft\n  rulebook: ${ref}\n---\n\n# Example\n`;
}

async function messages(
  root: string,
  markdown: string,
  file = "target.md",
  schema = "schema.yaml",
): Promise<string[]> {
  const processor = remark().use(plugin, {
    workspaceRoot: root,
    schemaRules: [{ glob: "target.md", schema }],
  });
  const result = await processor.process({ value: markdown, path: join(root, file) });
  return result.messages.map((message) => message.reason);
}

describe("rulebook deliverable type schemas", () => {
  const validateRulebook = buildValidator(
    "docs/specdojo/schemas/v1/rulebook-frontmatter.schema.yaml",
  );
  const validateDeliverable = buildValidator(
    "docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml",
  );

  it("requires a declaration on draft and ready rulebooks", () => {
    for (const status of ["draft", "ready"]) {
      expect(
        validateRulebook({ specdojo: { id: "example-rulebook", type: "rulebook", status } }),
      ).toBe(false);
      expect(validateRulebook.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            keyword: "required",
            params: { missingProperty: "deliverable_type" },
          }),
        ]),
      );
    }
  });

  it.each(["requirement", "glossary"])("accepts %s in a deliverable and a declaration", (type) => {
    expect(
      validateDeliverable({ specdojo: { id: "example", type, status: "draft", rulebook: "none" } }),
    ).toBe(true);
    expect(
      validateRulebook({
        specdojo: {
          id: "example-rulebook",
          type: "rulebook",
          status: "draft",
          deliverable_type: type,
        },
      }),
    ).toBe(true);
  });

  it.each(["domain", "screen", "sample", "template"])(
    "rejects %s as a declared deliverable type",
    (type) => {
      expect(
        validateRulebook({
          specdojo: {
            id: "example-rulebook",
            type: "rulebook",
            status: "draft",
            deliverable_type: type,
          },
        }),
      ).toBe(false);
    },
  );
});

describe("Markdown deliverable type matching in the frontmatter plugin", () => {
  it.each(["requirement", "glossary"])("accepts a matching %s", async (type) => {
    const root = workspace();
    rulebook(root, "specdojo:example-rulebook", type);
    expect(await messages(root, document(type))).toEqual([]);
  });

  it.each(["project", "sample", "data"])(
    "reports the declared replacement for %s",
    async (type) => {
      const root = workspace();
      rulebook(root, "specdojo:example-rulebook", "requirement");
      const reasons = await messages(root, document(type));
      expect(reasons).toHaveLength(1);
      expect(reasons[0]).toContain('declared deliverable_type is "requirement"');
      expect(reasons[0]).toContain('Set type to "requirement"');
    },
  );

  it("checks sample metadata even without a matching schema mapping", async () => {
    const root = workspace();
    rulebook(root, "specdojo:example-rulebook", "ui");
    expect(
      await messages(root, document("project"), "docs/ja/specdojo/samples/example-sample.md"),
    ).toEqual([expect.stringContaining('declared deliverable_type is "ui"')]);
  });

  it("checks generated frontmatter while preserving the template's own type", async () => {
    const root = workspace();
    rulebook(root, "specdojo:example-rulebook", "glossary");
    const template = `---\nspecdojo:\n  id: example-template\n  type: template\n  status: draft\n  frontmatter_template:\n    specdojo:\n      id: _ID_\n      type: project\n      rulebook: specdojo:example-rulebook\n---\n`;
    const reasons = await messages(
      root,
      template,
      "docs/ja/specdojo/templates/example-template.md",
    );
    expect(reasons).toEqual([
      expect.stringContaining("specdojo.frontmatter_template.specdojo.type"),
    ]);
    expect(
      await messages(root, template.replace("type: project", "type: glossary"), "template.md"),
    ).toEqual([]);
  });

  it("reports a missing declaration on a referenced rulebook", async () => {
    const root = workspace();
    rulebook(root, "specdojo:example-rulebook");
    expect(await messages(root, document("data"))).toEqual([
      expect.stringContaining("must declare deliverable_type"),
    ]);
  });

  it("reports missing type as a mismatch", async () => {
    const root = workspace();
    rulebook(root, "specdojo:example-rulebook", "data");
    expect(await messages(root, document("data").replace("  type: data\n", ""))).toEqual([
      expect.stringContaining("missing does not match"),
    ]);
  });

  it("leaves rulebook:none and YAML display pages outside matching", async () => {
    const root = workspace();
    expect(await messages(root, document("project", "none"))).toEqual([]);
    expect(
      await messages(
        root,
        document("sample") + "\n<!-- specdojo:generated-by=yaml-pages -->\n",
        "docs/ja/specdojo/samples/generated/example.md",
      ),
    ).toEqual([]);
  });

  it("still checks generated Markdown that is not a YAML display page", async () => {
    const root = workspace();
    rulebook(root, "specdojo:example-rulebook", "requirement");
    expect(
      await messages(root, document("project"), "docs/ja/product/generated/example.md"),
    ).toEqual([expect.stringContaining('declared deliverable_type is "requirement"')]);
  });

  it("does not compare a recipe's own type with the artifact it describes", async () => {
    const root = workspace();
    rulebook(root, "specdojo:example-rulebook", "flow");
    expect(await messages(root, document("recipe"))).toEqual([]);
  });

  it("still reports the declaration when an artifact mistakenly uses a dedicated type", async () => {
    const root = workspace();
    rulebook(root, "specdojo:example-rulebook", "flow");
    const reasons = await messages(
      root,
      document("recipe"),
      "target.md",
      resolve("docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml"),
    );
    expect(reasons).toContainEqual(expect.stringContaining('declared deliverable_type is "flow"'));
  });

  it("fails when the referenced rulebook cannot be resolved", async () => {
    const root = workspace();
    expect(await messages(root, document("data"))).toEqual([
      expect.stringContaining("was not found"),
    ]);
  });

  it("resolves exact authority-qualified IDs instead of basenames", async () => {
    const root = workspace();
    rulebook(
      root,
      "team:example-rulebook",
      "glossary",
      "docs/ja/specdojo/rulebooks/team/renamed.md",
    );
    rulebook(root, "specdojo:example-rulebook", "requirement");
    expect(await messages(root, document("glossary", "team:example-rulebook"))).toEqual([]);
    expect(await messages(root, document("glossary", "example-rulebook"))).toEqual([
      expect.stringContaining("is ambiguous"),
    ]);
  });

  it("accepts an unqualified ID only when it resolves uniquely", async () => {
    const root = workspace();
    rulebook(root, "team:example-rulebook", "data");
    expect(await messages(root, document("data", "example-rulebook"))).toEqual([]);
  });

  it("rejects duplicate local rulebook IDs", async () => {
    const root = workspace();
    rulebook(root, "specdojo:example-rulebook", "data");
    rulebook(
      root,
      "specdojo:example-rulebook",
      "ui",
      "docs/ja/specdojo/rulebooks/team/duplicate.md",
    );
    expect(await messages(root, document("data"))).toEqual([
      expect.stringContaining("is ambiguous"),
    ]);
  });

  it("uses installed rulebooks and gives local copies with the same ID precedence", async () => {
    const root = workspace();
    const installed = join(root, "node_modules/specdojo");
    write(installed, "package.json", '{"name":"specdojo"}');
    rulebook(installed, "specdojo:example-rulebook", "requirement");
    expect(await messages(root, document("project"))).toEqual([
      expect.stringContaining('declared deliverable_type is "requirement"'),
    ]);
    rulebook(root, "specdojo:example-rulebook", "data");
    expect(await messages(root, document("data"))).toEqual([]);
    rulebook(installed, "specdojo:other-rulebook", "ui");
    expect(await messages(root, document("ui", "specdojo:other-rulebook"))).toEqual([]);
  });

  it("does not use included rulebooks to override the primary declaration", async () => {
    const root = workspace();
    rulebook(root, "specdojo:example-rulebook", "data");
    rulebook(root, "specdojo:notation-rulebook", "ui");
    const file = "docs/ja/specdojo/rulebooks/specdojo/example-rulebook.md";
    // Includes contribute notation rules, not the primary artifact's type.
    rulebook(
      root,
      "specdojo:example-rulebook",
      "data\n  includes: [specdojo:notation-rulebook]",
      file,
    );
    expect(await messages(root, document("data"))).toEqual([]);
  });
});
