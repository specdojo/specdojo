import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { load } from "../../../src/shared/yaml.js";
import { buildValidator } from "../../helpers/schema.js";

const require = createRequire(import.meta.url);
const createChecker = require("../../../packages/docs-lint/src/deliverable-type.cjs") as (
  root: string,
) => (
  metadata: unknown,
  path: string,
  source: string,
  hasSchema: boolean,
  format: "yaml",
) => string[];
const directories: string[] = [];
afterEach(() => {
  for (const directory of directories.splice(0))
    rmSync(directory, { recursive: true, force: true });
});

function workspace(): string {
  const root = mkdtempSync(join(tmpdir(), "specdojo-yaml-type-"));
  directories.push(root);
  const rulebook = join(root, "docs/ja/specdojo/rulebooks/example-rulebook.md");
  mkdirSync(dirname(rulebook), { recursive: true });
  writeFileSync(
    rulebook,
    "---\nspecdojo:\n  id: team:example-rulebook\n  type: rulebook\n  deliverable_type: api\n---\n",
  );
  writeFileSync(join(root, "schema.yaml"), "type: object\n");
  return root;
}

function check(root: string, metadata: unknown): string[] {
  return createChecker(root)(metadata, "docs/ja/example.yaml", "", true, "yaml");
}

function cli(root: string, args: string[]) {
  return spawnSync(
    process.execPath,
    [resolve("packages/docs-lint/bin/specdojo-docs-lint.js"), "yaml-schema", ...args],
    {
      cwd: root,
      encoding: "utf8",
    },
  );
}

describe("YAML deliverable metadata", () => {
  it.each(["domain", "command", "message"])("rejects legacy %s even with rulebook:none", (type) => {
    const errors = check(workspace(), { type, rulebook: "none" });
    expect(errors).toEqual([
      expect.stringContaining(`Set type to "${type === "domain" ? "data" : "api"}"`),
    ]);
  });

  it.each([false, true])("checks top-level and external metadata (external=%s)", (external) => {
    const root = workspace();
    const metadata = { type: "project", rulebook: "team:example-rulebook" };
    expect(check(root, external ? { "x-spec-meta": metadata } : metadata)).toContainEqual(
      expect.stringContaining('Set type to "api"'),
    );
    metadata.type = "api";
    expect(check(root, external ? { "x-spec-meta": metadata } : metadata)).toEqual([]);
  });

  it("checks the template metadata while keeping its own type", () => {
    const root = workspace();
    const metadata = {
      type: "template",
      rulebook: "none",
      metadata_template: { type: "project", rulebook: "team:example-rulebook" },
    };
    expect(check(root, metadata)).toEqual([expect.stringContaining("metadata_template.type")]);
    metadata.metadata_template.type = "api";
    expect(check(root, metadata)).toEqual([]);
    expect(check(root, { type: "template", rulebook: "team:example-rulebook" })).toEqual([]);
  });

  it("reports missing types, unresolved references, ambiguous IDs and missing declarations", () => {
    const root = workspace();
    expect(check(root, { rulebook: "team:example-rulebook" })).toEqual([
      expect.stringContaining("missing does not match"),
    ]);
    expect(check(root, { type: "api", rulebook: "team:missing-rulebook" })).toEqual([
      expect.stringContaining("was not found"),
    ]);
    const file = join(root, "docs/ja/specdojo/rulebooks/other.md");
    writeFileSync(file, "---\nspecdojo:\n  id: other:example-rulebook\n  type: rulebook\n---\n");
    expect(check(root, { type: "api", rulebook: "example-rulebook" })).toEqual([
      expect.stringContaining("is ambiguous"),
    ]);
    expect(check(root, { type: "api", rulebook: "other:example-rulebook" })).toEqual([
      expect.stringContaining("must declare deliverable_type"),
    ]);
  });

  it("does not interpret payload types or event types as artifact metadata", () => {
    expect(
      check(workspace(), {
        "x-spec-meta": { type: "api", rulebook: "team:example-rulebook" },
        components: {
          schemas: { Event: { type: "object", properties: { type: { const: "message" } } } },
        },
      }),
    ).toEqual([]);
  });

  it("matches every bundled YAML sample against its rulebook", () => {
    const root = process.cwd();
    const checkSample = createChecker(root);
    const files = [
      "bdd",
      "dct",
      "dct-index",
      "gl",
      "ifx-api",
      "ifx-cmd",
      "ifx-index",
      "ifx-msg",
      "pm-members",
      "pm-roles",
      "tml",
    ];
    for (const name of files) {
      const data = load(
        readFileSync(`docs/ja/specdojo/samples/${name}-sample.yaml`, "utf8"),
      ) as Record<string, unknown>;
      const metadata = (data["x-spec-meta"] ?? data) as Record<string, unknown>;
      expect(metadata.rulebook).toEqual(expect.any(String));
      expect(
        checkSample(data, `docs/ja/specdojo/samples/${name}-sample.yaml`, "", true, "yaml"),
        name,
      ).toEqual([]);
    }
  });
});

describe("YAML schemas", () => {
  it.each([
    ["bdd", "data", "domain"],
    ["ifx-cmd", "api", "command"],
    ["gl", "glossary", "project"],
  ])("accepts %s's artifact type and rejects the old value", (name, type, old) => {
    const data = load(
      readFileSync(`docs/ja/specdojo/samples/${name}-sample.yaml`, "utf8"),
    ) as Record<string, unknown>;
    const validate = buildValidator(`docs/specdojo/schemas/v1/${name}.schema.yaml`);
    expect(validate(data), JSON.stringify(validate.errors)).toBe(true);
    expect(data.type).toBe(type);
    expect(validate({ ...data, type: old })).toBe(false);
    const missing = { ...data };
    delete missing.type;
    expect(validate(missing)).toBe(false);
  });

  it("keeps the ifx-cmd template schema valid", () => {
    const validate = buildValidator("docs/specdojo/schemas/v1/ifx-cmd.schema.yaml");
    const template = load(
      readFileSync("docs/ja/specdojo/templates/ifx-cmd-template.yaml", "utf8"),
    ) as Record<string, unknown>;
    expect(validate(template)).toBe(true);
    expect(validate({ ...template, metadata_template: { type: "command" } })).toBe(false);
  });
});

describe("yaml-schema CLI metadata checking", () => {
  it("checks explicit files even if their structural schema accepts everything", () => {
    const root = workspace();
    writeFileSync(join(root, "example.yaml"), "type: project\nrulebook: team:example-rulebook\n");
    const result = cli(root, ["--schema", "schema.yaml", "--data", "example.yaml"]);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Set type to "api"');
  });

  it("checks modelines including none and validate=false, then succeeds after migration", () => {
    const root = workspace();
    const sources = {
      "ordinary.yaml":
        "# yaml-language-server: $schema=schema.yaml\ntype: command\nrulebook: team:example-rulebook\n",
      "external.yaml":
        "# specdojo-schema: none reason=external-asyncapi\nx-spec-meta:\n  type: message\n  rulebook: team:example-rulebook\n",
      "template.yaml":
        "# yaml-language-server: $schema=schema.yaml\n# specdojo-schema: validate=false reason=template\ntype: template\nmetadata_template:\n  type: command\n  rulebook: team:example-rulebook\n",
    };
    for (const [name, source] of Object.entries(sources)) writeFileSync(join(root, name), source);
    const result = cli(root, ["--modeline", ...Object.keys(sources)]);
    expect(result.status).toBe(1);
    for (const name of Object.keys(sources)) expect(result.stderr).toContain(name);
    expect(result.stderr).toContain('Set type to "api"');
    for (const [name, source] of Object.entries(sources))
      writeFileSync(join(root, name), source.replace(/type: (command|message)/g, "type: api"));
    const migrated = cli(root, ["--modeline", ...Object.keys(sources)]);
    expect(migrated.status, migrated.stderr).toBe(0);
  });
});
