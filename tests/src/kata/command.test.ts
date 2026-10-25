import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Command } from "commander";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as packagePaths from "../../../src/shared/package-paths.js";
import * as specdojoConfig from "../../../src/shared/specdojo-config.js";
import {
  ejectKata,
  findKataResource,
  installAllKata,
  listKataResources,
  registerKataCommands,
} from "../../../src/kata/command.js";

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
    vi.restoreAllMocks();
    rmSync(temporaryRoot, { recursive: true, force: true });
  });

  function writeAt(root: string, relativePath: string, content: string | Uint8Array): string {
    const absolutePath = join(root, relativePath);
    mkdirSync(join(absolutePath, ".."), { recursive: true });
    writeFileSync(absolutePath, content, "utf8");
    return absolutePath;
  }

  const roots = (): { repositoryRoot: string; packageRoot: string } => ({
    repositoryRoot,
    packageRoot,
  });

  it("hides referenced-only kinds from the default listing and reveals them with all", () => {
    writeAt(
      packageRoot,
      "docs/ja/specdojo/rulebooks/example-rulebook.md",
      markdown("specdojo:example-rulebook"),
    );
    writeAt(
      packageRoot,
      "docs/ja/specdojo/exec-templates/xep-example-template.md",
      "_FRONTMATTER_\n",
    );
    writeAt(packageRoot, "docs/specdojo/schemas/v1/example.schema.yaml", "title: example\n");

    const listed = listKataResources({ roots: roots() }).map((resource) => resource.id);
    const all = listKataResources({ all: true, roots: roots() });

    expect(listed).toEqual(["specdojo:example-rulebook"]);
    expect(all.map((resource) => [resource.id, resource.kind, resource.ejectable])).toEqual([
      ["xep-example-template", "exec-template", false],
      ["specdojo:example-rulebook", "rulebook", true],
      ["example.schema", "schema", false],
    ]);
  });

  it("lists a referenced-only kind when the kind filter selects it", () => {
    writeAt(
      packageRoot,
      "docs/ja/specdojo/exec-templates/xep-example-template.md",
      "_FRONTMATTER_\n",
    );

    const resources = listKataResources({ kind: "exec-template", roots: roots() });

    expect(resources.map((resource) => resource.id)).toEqual(["xep-example-template"]);
    expect(resources[0].ejectable).toBe(false);
  });

  it("finds a referenced-only resource by id so that show can read it", () => {
    const sourcePath = writeAt(
      packageRoot,
      "docs/ja/specdojo/exec-templates/xep-example-template.md",
      "_FRONTMATTER_\n",
    );

    expect(findKataResource("xep-example-template", { roots: roots() }).resolvedPath).toBe(
      sourcePath,
    );
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

  it("lists and shows only this repository authority from its authority subdirectory", () => {
    writeAt(
      repositoryRoot,
      ".specdojo/specdojo.config.json",
      JSON.stringify({ version: 1, kata_authority: "customer", projects: {} }),
    );
    const localPath = writeAt(
      repositoryRoot,
      "docs/ja/specdojo/rulebooks/customer/payment-rulebook.md",
      markdown("customer:payment-rulebook", "customer"),
    );
    writeAt(
      repositoryRoot,
      "docs/ja/specdojo/rulebooks/foreign/foreign-rulebook.md",
      markdown("foreign:foreign-rulebook", "foreign"),
    );
    writeAt(
      repositoryRoot,
      "docs/ja/specdojo/rulebooks/misplaced-rulebook.md",
      markdown("customer:misplaced-rulebook", "misplaced"),
    );

    const resources = listKataResources({ roots: roots() });
    expect(resources.map((resource) => resource.id)).toContain("customer:payment-rulebook");
    expect(resources.map((resource) => resource.id)).not.toContain("foreign:foreign-rulebook");
    expect(resources.map((resource) => resource.id)).not.toContain("customer:misplaced-rulebook");
    expect(findKataResource("customer:payment-rulebook", { roots: roots() }).resolvedPath).toBe(
      localPath,
    );
  });

  it("reads the legacy directory with guidance and prefers a duplicate canonical kata", () => {
    writeAt(
      repositoryRoot,
      ".specdojo/specdojo.config.json",
      JSON.stringify({ version: 1, kata_authority: "customer", projects: {} }),
    );
    const legacyOnlyPath = writeAt(
      repositoryRoot,
      "docs/ja/kata/rulebooks/legacy-rulebook.md",
      markdown("customer:legacy-rulebook", "legacy"),
    );
    writeAt(
      repositoryRoot,
      "docs/ja/kata/rulebooks/payment-rulebook.md",
      markdown("customer:payment-rulebook", "legacy duplicate"),
    );
    const canonicalPath = writeAt(
      repositoryRoot,
      "docs/ja/specdojo/rulebooks/customer/payment-rulebook.md",
      markdown("customer:payment-rulebook", "canonical"),
    );
    const warning = vi.spyOn(process.stderr, "write").mockImplementation(() => true);

    const resources = listKataResources({ roots: roots() });
    expect(
      resources.filter((resource) => resource.id === "customer:payment-rulebook"),
    ).toHaveLength(1);
    expect(findKataResource("customer:payment-rulebook", { roots: roots() }).resolvedPath).toBe(
      canonicalPath,
    );
    expect(findKataResource("customer:legacy-rulebook", { roots: roots() }).resolvedPath).toBe(
      legacyOnlyPath,
    );
    const warnings = warning.mock.calls.flat().join("");
    expect(warnings).toContain("legacy path");
    expect(warnings).toContain("both");
    warning.mockRestore();
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

  it.each([
    ["md", markdown("specdojo:format-sample")],
    ["mdx", markdown("specdojo:format-sample")],
    ["yaml", "id: specdojo:format-sample\n"],
    ["yml", "id: specdojo:format-sample\n"],
    ["json", '{"id":"specdojo:format-sample"}\n'],
  ])("keeps %s kata discoverable beside companion files", (extension, content) => {
    const filePath = `docs/ja/specdojo/samples/format-sample.${extension}`;
    for (const root of [packageRoot, repositoryRoot]) {
      writeAt(root, filePath, content);
      writeAt(root, "docs/ja/specdojo/samples/format-sample.css", "body {}\n");
      writeAt(root, "docs/ja/specdojo/samples/format-sample/image.png", new Uint8Array([0, 255]));
      writeAt(root, "docs/ja/specdojo/samples/unrelated.txt", "notes\n");
    }

    const resources = listKataResources({ kind: "sample", all: true, roots: roots() });
    expect(resources.map((resource) => [resource.id, resource.difference])).toEqual([
      ["specdojo:format-sample", "same"],
    ]);
    expect(findKataResource("format-sample", { roots: roots() }).relativePath).toBe(filePath);
    expect(ejectKata("format-sample", { dryRun: true, roots: roots() }).relativePath).toBe(
      filePath,
    );
  });

  it("keeps filename fallback IDs for supported formats without a declared ID", () => {
    for (const extension of ["md", "mdx", "yaml", "yml", "json"]) {
      writeAt(packageRoot, `docs/ja/specdojo/templates/fallback.${extension}`, "{}\n");
    }
    expect(listKataResources({ roots: roots() }).map((resource) => resource.id)).toEqual([
      "fallback",
      "fallback",
      "fallback",
      "fallback",
      "fallback",
    ]);
  });

  it("excludes companion files from authored and legacy kata listings", () => {
    writeAt(
      repositoryRoot,
      ".specdojo/specdojo.config.json",
      JSON.stringify({
        version: 1,
        kata_authority: "customer",
        projects: {},
      }),
    );
    for (const directory of ["docs/ja/specdojo/samples/customer", "docs/ja/kata/samples"]) {
      writeAt(repositoryRoot, `${directory}/lesson.md`, markdown("customer:lesson"));
      writeAt(repositoryRoot, `${directory}/lesson.css`, "body {}\n");
      writeAt(repositoryRoot, `${directory}/lesson/image.svg`, "<svg/>\n");
    }
    vi.spyOn(process.stderr, "write").mockImplementation(() => true);

    expect(
      listKataResources({ kind: "sample", roots: roots() }).map((resource) => resource.id),
    ).toEqual(["customer:lesson"]);
  });

  it("copies companions with their parent ID and protects each existing file", () => {
    const main = "docs/ja/specdojo/samples/lesson.md";
    const css = "docs/ja/specdojo/samples/lesson.css";
    const image = "docs/ja/specdojo/samples/lesson/images/example.png";
    const binary = new Uint8Array([0, 255, 128, 10]);
    writeAt(packageRoot, main, markdown("specdojo:lesson"));
    writeAt(packageRoot, css, "body {}\n");
    writeAt(packageRoot, image, binary);
    writeAt(packageRoot, "docs/ja/specdojo/samples/lesson-extra.css", "other\n");
    writeAt(packageRoot, "docs/ja/specdojo/samples/lesson/generated/ignored.svg", "generated\n");
    writeAt(packageRoot, "docs/ja/specdojo/samples/lesson/other.json", '{"id":"specdojo:other"}');

    const dryRun = ejectKata("lesson", { dryRun: true, roots: roots() });
    expect(
      dryRun.companions.map((result) => [result.id, result.relativePath, result.action]),
    ).toEqual([
      ["specdojo:lesson", css, "copy"],
      ["specdojo:lesson", image, "copy"],
    ]);
    expect(existsSync(join(repositoryRoot, "docs"))).toBe(false);

    writeAt(repositoryRoot, css, "local CSS\n");
    const copied = ejectKata("lesson", { roots: roots() });
    expect(copied.action).toBe("copy");
    expect(copied.companions.map((result) => result.action)).toEqual(["skip", "copy"]);
    expect(readFileSync(join(repositoryRoot, css), "utf8")).toBe("local CSS\n");
    expect(readFileSync(join(repositoryRoot, image))).toEqual(Buffer.from(binary));
    expect(existsSync(join(repositoryRoot, "docs/ja/specdojo/samples/lesson-extra.css"))).toBe(
      false,
    );
    expect(existsSync(join(repositoryRoot, "docs/ja/specdojo/samples/lesson/other.json"))).toBe(
      false,
    );
    expect(listKataResources({ roots: roots() }).map((resource) => resource.id)).toEqual([
      "specdojo:lesson",
      "specdojo:other",
    ]);

    const forcedPreview = ejectKata("lesson", { dryRun: true, force: true, roots: roots() });
    expect(forcedPreview.companions.every((result) => result.action === "overwrite")).toBe(true);
    expect(readFileSync(join(repositoryRoot, css), "utf8")).toBe("local CSS\n");
    const forced = ejectKata("lesson", { force: true, roots: roots() });
    expect(forced.companions.every((result) => result.action === "overwrite")).toBe(true);
    expect(readFileSync(join(repositoryRoot, css), "utf8")).toBe("body {}\n");

    rmSync(join(repositoryRoot, image));
    const repaired = ejectKata("lesson", { roots: roots() });
    expect(repaired.action).toBe("skip");
    expect(repaired.companions.map((result) => result.action)).toEqual(["skip", "copy"]);
  });

  it.each([
    ["same", "same"],
    ["changed-css", "modified"],
    ["missing-css", "modified"],
    ["extra-css", "modified"],
    ["changed-image", "modified"],
    ["missing-image", "modified"],
    ["extra-image", "modified"],
  ])("reports companion differences on the parent kata: %s", (scenario, difference) => {
    const main = "docs/ja/specdojo/samples/lesson.md";
    const css = "docs/ja/specdojo/samples/lesson.css";
    const image = "docs/ja/specdojo/samples/lesson/image.png";
    for (const root of [packageRoot, repositoryRoot]) {
      writeAt(root, main, markdown("specdojo:lesson"));
      writeAt(root, css, "body {}\n");
      writeAt(root, image, new Uint8Array([0, 255]));
    }
    if (scenario === "changed-css") writeAt(repositoryRoot, css, "local\n");
    if (scenario === "missing-css") rmSync(join(repositoryRoot, css));
    if (scenario === "extra-css") {
      writeAt(repositoryRoot, "docs/ja/specdojo/samples/lesson.scss", "local\n");
    }
    if (scenario === "changed-image") writeAt(repositoryRoot, image, new Uint8Array([0, 254]));
    if (scenario === "missing-image") rmSync(join(repositoryRoot, image));
    if (scenario === "extra-image") {
      writeAt(repositoryRoot, "docs/ja/specdojo/samples/lesson/extra.svg", "<svg/>\n");
    }
    expect(
      listKataResources({ roots: roots() }).map((resource) => [resource.id, resource.difference]),
    ).toEqual([["specdojo:lesson", difference]]);
  });

  it("prints only kata in list/status and includes companions in eject dry-run output", async () => {
    const main = "docs/ja/specdojo/samples/lesson.md";
    const css = "docs/ja/specdojo/samples/lesson.css";
    const image = "docs/ja/specdojo/samples/lesson/image.png";
    writeAt(packageRoot, main, markdown("specdojo:lesson"));
    writeAt(packageRoot, css, "body {}\n");
    writeAt(packageRoot, image, new Uint8Array([0, 255]));
    writeAt(repositoryRoot, css, "local\n");
    vi.spyOn(packagePaths, "specdojoPackageRootDir").mockReturnValue(packageRoot);
    vi.spyOn(specdojoConfig, "specdojoRootDir").mockReturnValue(repositoryRoot);
    const output = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    const run = async (args: string[]): Promise<string> => {
      output.mockClear();
      const program = new Command();
      registerKataCommands(program);
      await program.parseAsync(["kata", ...args], { from: "user" });
      return output.mock.calls.map(([text]) => String(text)).join("");
    };

    const listed = await run(["list", "--kind", "sample"]);
    expect(listed.trim().split("\n")).toHaveLength(2);
    expect(listed).not.toContain(css);
    const status = await run(["status", "--kind", "sample"]);
    expect(status.trim().split("\n")).toHaveLength(2);
    expect(status).not.toContain("package-missing");
    expect(status).not.toContain(css);
    const preview = await run(["eject", "--id", "lesson", "--dry-run"]);
    expect(preview).toBe(
      [
        `DRY-RUN\tcopy\tsample\tspecdojo:lesson\t${main}\n`,
        `DRY-RUN\tskip\tsample\tspecdojo:lesson\t${css}\n`,
        `DRY-RUN\tcopy\tsample\tspecdojo:lesson\t${image}\n`,
      ].join(""),
    );
    expect(existsSync(join(repositoryRoot, main))).toBe(false);
    expect(existsSync(join(repositoryRoot, image))).toBe(false);
    expect(readFileSync(join(repositoryRoot, css), "utf8")).toBe("local\n");

    const copied = await run(["eject", "--id", "lesson"]);
    expect(copied).toContain(`SKIP\tskip\tsample\tspecdojo:lesson\t${css}`);
    expect(copied).toContain(`COPY\tcopy\tsample\tspecdojo:lesson\t${image}`);
    const changed = await run(["status", "--kind", "sample"]);
    expect(changed).toContain(`sample\tejected\tmodified\tspecdojo:lesson\t${main}`);
  });

  it("installs companions once per path and omits unrelated assets", () => {
    writeAt(packageRoot, "docs/ja/specdojo/samples/lesson.md", markdown("specdojo:lesson"));
    writeAt(packageRoot, "docs/ja/specdojo/samples/lesson.yaml", "id: specdojo:other-lesson\n");
    const css = "docs/ja/specdojo/samples/lesson.css";
    const image = "docs/ja/specdojo/samples/lesson/image.svg";
    writeAt(packageRoot, css, "body {}\n");
    writeAt(packageRoot, image, "<svg/>\n");
    writeAt(packageRoot, "docs/ja/specdojo/samples/unrelated.css", "other\n");
    expect(installAllKata({ dryRun: true, roots: roots() })).toHaveLength(4);
    expect(existsSync(join(repositoryRoot, "docs"))).toBe(false);
    const results = installAllKata({ roots: roots() });
    expect(results).toHaveLength(4);
    expect(results.filter((result) => result.relativePath === css)).toHaveLength(1);
    expect(readFileSync(join(repositoryRoot, image), "utf8")).toBe("<svg/>\n");
    expect(existsSync(join(repositoryRoot, "docs/ja/specdojo/samples/unrelated.css"))).toBe(false);
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
