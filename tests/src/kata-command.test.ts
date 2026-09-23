import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Command } from "commander";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  ejectKata,
  findKataResource,
  installAllKata,
  listKataResources,
  registerKataCommands,
} from "../../src/kata-command.js";

function markdown(id: string, body = "package"): string {
  return `---\nspecdojo:\n  id: ${id}\n  type: rulebook\n  status: draft\n---\n\n# ${body}\n`;
}

describe("kata commands", () => {
  let temporaryRoot: string;
  let repositoryRoot: string;
  let packageRoot: string;

  beforeEach(() => {
    temporaryRoot = mkdtempSync(join(tmpdir(), "specdojo-kata-command-"));
    repositoryRoot = join(temporaryRoot, "repository");
    packageRoot = join(temporaryRoot, "package");
    mkdirSync(repositoryRoot, { recursive: true });
    mkdirSync(packageRoot, { recursive: true });
  });

  afterEach(() => {
    rmSync(temporaryRoot, { recursive: true, force: true });
  });

  function writeAt(root: string, relativePath: string, content: string): string {
    const absolutePath = join(root, relativePath);
    mkdirSync(join(absolutePath, ".."), { recursive: true });
    writeFileSync(absolutePath, content, "utf8");
    return absolutePath;
  }

  const roots = (): { repositoryRoot: string; packageRoot: string } => ({
    repositoryRoot,
    packageRoot,
  });

  it("lists repository overrides before package resources and filters by kind", () => {
    writeAt(
      packageRoot,
      "docs/ja/specdojo/rulebooks/example-rulebook.md",
      markdown("specdojo:example-rulebook"),
    );
    writeAt(
      repositoryRoot,
      "docs/ja/specdojo/rulebooks/example-rulebook.md",
      markdown("specdojo:example-rulebook", "repository"),
    );
    writeAt(
      packageRoot,
      "docs/ja/specdojo/samples/example-sample.yaml",
      "id: specdojo:example-sample\ntype: sample\n",
    );

    const resources = listKataResources({ roots: roots() });
    const rulebook = resources.find((resource) => resource.id === "specdojo:example-rulebook");
    const sample = resources.find((resource) => resource.id === "specdojo:example-sample");

    expect(rulebook).toMatchObject({
      kind: "rulebook",
      source: "repository",
      state: "ejected",
      difference: "modified",
    });
    expect(sample).toMatchObject({
      kind: "sample",
      source: "node_modules",
      state: "referenced",
      difference: "-",
    });
    expect(listKataResources({ kind: "sample", roots: roots() })).toHaveLength(1);
    expect(() => listKataResources({ kind: "guide", roots: roots() })).toThrow("Unknown kata kind");
  });

  it("shows the repository version using either a full ID or local ID", () => {
    writeAt(
      packageRoot,
      "docs/ja/specdojo/rulebooks/example-rulebook.md",
      markdown("specdojo:example-rulebook"),
    );
    const repositoryPath = writeAt(
      repositoryRoot,
      "docs/ja/specdojo/rulebooks/example-rulebook.md",
      markdown("specdojo:example-rulebook", "repository"),
    );

    expect(findKataResource("specdojo:example-rulebook", { roots: roots() }).resolvedPath).toBe(
      repositoryPath,
    );
    expect(findKataResource("example-rulebook", { roots: roots() }).resolvedPath).toBe(
      repositoryPath,
    );
  });

  it("reports same, modified, and package-missing ejected files", () => {
    const same = markdown("specdojo:same-rulebook");
    writeAt(packageRoot, "docs/ja/specdojo/rulebooks/same-rulebook.md", same);
    writeAt(repositoryRoot, "docs/ja/specdojo/rulebooks/same-rulebook.md", same);
    writeAt(
      packageRoot,
      "docs/ja/specdojo/rulebooks/changed-rulebook.md",
      markdown("specdojo:changed-rulebook"),
    );
    writeAt(
      repositoryRoot,
      "docs/ja/specdojo/rulebooks/changed-rulebook.md",
      markdown("specdojo:changed-rulebook", "changed"),
    );
    writeAt(
      repositoryRoot,
      "docs/ja/specdojo/standards/local-standard.md",
      markdown("project:local-standard"),
    );

    const differences = Object.fromEntries(
      listKataResources({ roots: roots() }).map((resource) => [resource.id, resource.difference]),
    );
    expect(differences).toEqual({
      "specdojo:changed-rulebook": "modified",
      "specdojo:same-rulebook": "same",
      "project:local-standard": "package-missing",
    });
  });

  it("ejects to the canonical path, supports dry-run, and requires force to overwrite", () => {
    const relativePath = "docs/ja/specdojo/templates/example-template.md";
    writeAt(packageRoot, relativePath, markdown("specdojo:example-template"));

    const dryRun = ejectKata("specdojo:example-template", { dryRun: true, roots: roots() });
    expect(dryRun.action).toBe("copy");
    expect(existsSync(join(repositoryRoot, relativePath))).toBe(false);

    expect(ejectKata("specdojo:example-template", { roots: roots() }).action).toBe("copy");
    writeFileSync(join(repositoryRoot, relativePath), "local\n", "utf8");
    expect(ejectKata("specdojo:example-template", { roots: roots() }).action).toBe("skip");
    expect(readFileSync(join(repositoryRoot, relativePath), "utf8")).toBe("local\n");

    expect(ejectKata("specdojo:example-template", { force: true, roots: roots() }).action).toBe(
      "overwrite",
    );
    expect(readFileSync(join(repositoryRoot, relativePath), "utf8")).toContain(
      "specdojo:example-template",
    );
  });

  it("rejects exec templates and schemas because they are package-versioned", () => {
    writeAt(
      packageRoot,
      "docs/ja/specdojo/exec-templates/xep-example-template.md",
      "_FRONTMATTER_\n",
    );
    writeAt(packageRoot, "docs/specdojo/schemas/v1/example.schema.yaml", "type: object\n");

    expect(() => ejectKata("xep-example-template", { roots: roots() })).toThrow(
      "Cannot eject exec-template",
    );
    expect(() => ejectKata("example.schema", { roots: roots() })).toThrow("Cannot eject schema");
  });

  it("installs all ejectable kinds but excludes package-versioned resources", () => {
    const fixtures = [
      ["rulebooks", "example-rulebook.md", markdown("specdojo:example-rulebook")],
      ["standards", "example-standard.md", markdown("specdojo:example-standard")],
      ["recipes", "example-recipe.md", markdown("specdojo:example-recipe")],
      ["samples", "example-sample.yaml", "id: specdojo:example-sample\n"],
      ["templates", "example-template.json", '{"id":"specdojo:example-template"}\n'],
    ] as const;
    for (const [directory, name, content] of fixtures) {
      writeAt(packageRoot, `docs/ja/specdojo/${directory}/${name}`, content);
    }
    writeAt(packageRoot, "docs/ja/specdojo/exec-templates/xep-example.md", "template\n");
    writeAt(packageRoot, "docs/specdojo/schemas/v1/example.schema.yaml", "type: object\n");
    writeAt(repositoryRoot, "docs/ja/specdojo/recipes/example-recipe.md", "local\n");

    const results = installAllKata({ roots: roots() });

    expect(results).toHaveLength(5);
    expect(results.find((result) => result.kind === "recipe")?.action).toBe("skip");
    expect(
      readFileSync(join(repositoryRoot, "docs/ja/specdojo/recipes/example-recipe.md"), "utf8"),
    ).toBe("local\n");
    expect(existsSync(join(repositoryRoot, "docs/ja/specdojo/exec-templates/xep-example.md"))).toBe(
      false,
    );
    expect(existsSync(join(repositoryRoot, "docs/specdojo/schemas/v1/example.schema.yaml"))).toBe(
      false,
    );
  });

  it("registers list, show, status, eject, and install with dry-run options", () => {
    const program = new Command();
    registerKataCommands(program);

    const kata = program.commands.find((command) => command.name() === "kata");
    expect(kata?.commands.map((command) => command.name())).toEqual([
      "list",
      "show",
      "status",
      "eject",
      "install",
    ]);
    for (const command of kata?.commands ?? []) {
      expect(command.options.some((option) => option.long === "--dry-run")).toBe(true);
    }
  });
});
