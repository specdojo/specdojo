import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Command } from "commander";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { runGenerateTarget } from "../../../src/catalog/generate.js";
import { registerDeliverableCommands } from "../../../src/deliverable/deliverable.js";

type Fixture = {
  dir: string;
  catalogPath: string;
  templatesPath: string;
  rulebooksPath: string;
  repoRoot: string;
};

let fx: Fixture;

async function makeFixture(): Promise<Fixture> {
  const dir = await mkdtemp(path.join(tmpdir(), "deliverable-scaffold-"));
  const catalogPath = path.join(dir, "catalog");
  const templatesPath = path.join(dir, "templates");
  const rulebooksPath = path.join(dir, "rulebooks");
  const repoRoot = path.join(dir, "root");
  mkdirSync(catalogPath, { recursive: true });
  mkdirSync(templatesPath, { recursive: true });
  mkdirSync(rulebooksPath, { recursive: true });
  mkdirSync(repoRoot, { recursive: true });

  // Minimal specdojo.config.json for CLI commands
  const specdojoDir = path.join(repoRoot, ".specdojo");
  mkdirSync(specdojoDir, { recursive: true });
  writeFileSync(
    path.join(specdojoDir, "specdojo.config.json"),
    JSON.stringify({
      version: 1,
      current_project: "prjx",
      projects: {
        prjx: {
          catalog_path: catalogPath,
        },
      },
    }),
    "utf8",
  );

  return { dir, catalogPath, templatesPath, rulebooksPath, repoRoot };
}

function writeRulebook(fixture: Fixture, localId: string, template?: string): void {
  const templateLine = template === undefined ? "" : `  template: ${template}\n`;
  writeFileSync(
    path.join(fixture.rulebooksPath, `${localId}-rulebook.md`),
    `---\nspecdojo:\n  id: specdojo:${localId}-rulebook\n  type: rulebook\n  status: draft\n${templateLine}---\n`,
    "utf8",
  );
}

function writeTemplate(fixture: Fixture, localId: string, content: string): void {
  writeFileSync(path.join(fixture.templatesPath, `${localId}-template.md`), content, "utf8");
}

function writeCatalog(fixture: Fixture, body: string): void {
  writeFileSync(path.join(fixture.catalogPath, "dct-demo.yaml"), body, "utf8");
}

const CATALOG_WITH_TWO_DELIVERABLES = `id: prjx:dct-demo
type: project
status: draft
project_id: prjx
domain: demo
base_path: /out
groups:
  - deliverables:
      - local_id: prj-charter
        name: プロジェクト憲章
        kind: work
        depends_on: [prj-overview]
        overview: プロジェクトの認可
        path: prj-charter.md
        rulebook: specdojo:prj-charter-rulebook
      - local_id: prj-scope
        name: スコープ記述書
        kind: work
        overview: プロジェクトのスコープ
        path: prj-scope.md
        rulebook: specdojo:prj-scope-rulebook
`;

describe("deliverable scaffold single target", () => {
  const originalCwd = process.cwd();

  beforeEach(async () => {
    fx = await makeFixture();
    process.chdir(fx.repoRoot);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await rm(fx.dir, { recursive: true, force: true });
  });

  it("scaffolds only the specified deliverable from catalog", () => {
    writeCatalog(fx, CATALOG_WITH_TWO_DELIVERABLES);
    writeRulebook(fx, "prj-charter", "specdojo:prj-charter-template");
    writeTemplate(
      fx,
      "prj-charter",
      `---\nspecdojo:\n  id: specdojo:prj-charter-template\n  type: template\n  status: ready\n  frontmatter_template:\n    specdojo:\n      id: _PROJECT_ID_:_LOCAL_ID_\n      type: project\n      status: draft\n      rulebook: specdojo:prj-charter-rulebook\n---\n\n# _DELIVERABLE_NAME_\n\n本文`,
    );
    writeRulebook(fx, "prj-scope");

    const result = runGenerateTarget({
      catalogPath: fx.catalogPath,
      templatesPath: fx.templatesPath,
      rulebooksPath: fx.rulebooksPath,
      repoRoot: fx.repoRoot,
      projectId: "prjx",
      targetId: "prjx:prj-charter",
      force: false,
    });

    expect(result.errors).toEqual([]);
    expect(result.written).toEqual(["out/prj-charter.md"]);
    expect(result.skipped).toEqual([]);

    const charterPath = path.join(fx.repoRoot, "out/prj-charter.md");
    expect(existsSync(charterPath)).toBe(true);

    const charterContent = readFileSync(charterPath, "utf8");
    expect(charterContent).toContain("id: prjx:prj-charter");
    expect(charterContent).toContain("status: draft");
    expect(charterContent).toContain("rulebook: specdojo:prj-charter-rulebook");
    expect(charterContent).toContain("# プロジェクト憲章");

    // The other deliverable must NOT be scaffolded
    const scopePath = path.join(fx.repoRoot, "out/prj-scope.md");
    expect(existsSync(scopePath)).toBe(false);
  });

  it("scaffolds a catalog-less deliverable with template", () => {
    writeRulebook(fx, "custom", "specdojo:custom-template");
    writeTemplate(
      fx,
      "custom",
      `---\nspecdojo:\n  id: specdojo:custom-template\n  type: template\n  status: ready\n  frontmatter_template:\n    specdojo:\n      id: _PROJECT_ID_:_LOCAL_ID_\n      type: project\n      status: draft\n      rulebook: specdojo:custom-rulebook\n---\n\n# Custom Heading\n\nCustom body`,
    );

    const result = runGenerateTarget({
      catalogPath: fx.catalogPath,
      templatesPath: fx.templatesPath,
      rulebooksPath: fx.rulebooksPath,
      repoRoot: fx.repoRoot,
      projectId: "prjx",
      targetId: "prjx:custom-doc",
      targetPath: "out/custom-doc.md",
      targetRulebook: "specdojo:custom-rulebook",
      force: false,
    });

    expect(result.errors).toEqual([]);
    expect(result.written).toEqual(["out/custom-doc.md"]);

    const docPath = path.join(fx.repoRoot, "out/custom-doc.md");
    expect(existsSync(docPath)).toBe(true);

    const docContent = readFileSync(docPath, "utf8");
    expect(docContent).toContain("id: prjx:custom-doc");
    expect(docContent).toContain("status: draft");
    expect(docContent).toContain("rulebook: specdojo:custom-rulebook");
    expect(docContent).toContain("# Custom Heading");
  });

  it("scaffolds a catalog-less deliverable without template as minimal fallback", () => {
    // Rulebook with template: not-needed
    writeRulebook(fx, "no-template", "not-needed");

    const result = runGenerateTarget({
      catalogPath: fx.catalogPath,
      templatesPath: fx.templatesPath,
      rulebooksPath: fx.rulebooksPath,
      repoRoot: fx.repoRoot,
      projectId: "prjx",
      targetId: "prjx:minimal-doc",
      targetPath: "out/minimal-doc.md",
      targetRulebook: "specdojo:no-template-rulebook",
      force: false,
    });

    expect(result.errors).toEqual([]);
    expect(result.written).toEqual(["out/minimal-doc.md"]);

    const docPath = path.join(fx.repoRoot, "out/minimal-doc.md");
    expect(existsSync(docPath)).toBe(true);

    const docContent = readFileSync(docPath, "utf8");
    expect(docContent).toContain("id: prjx:minimal-doc");
    expect(docContent).toContain("status: draft");
    expect(docContent).toContain("rulebook: specdojo:no-template-rulebook");
    expect(docContent).toContain("# minimal-doc");
    expect(docContent).toContain("_TODO_: 本文を記述する");
  });

  it("skips existing files unless --force is given, and supports dry-run", () => {
    writeCatalog(fx, CATALOG_WITH_TWO_DELIVERABLES);
    writeRulebook(fx, "prj-charter");

    const charterPath = path.join(fx.repoRoot, "out/prj-charter.md");
    mkdirSync(path.dirname(charterPath), { recursive: true });
    writeFileSync(charterPath, "existing content", "utf8");

    // 1. Without force: should skip
    const resultSkip = runGenerateTarget({
      catalogPath: fx.catalogPath,
      templatesPath: fx.templatesPath,
      rulebooksPath: fx.rulebooksPath,
      repoRoot: fx.repoRoot,
      projectId: "prjx",
      targetId: "prjx:prj-charter",
      force: false,
    });

    expect(resultSkip.written).toEqual([]);
    expect(resultSkip.skipped).toEqual(["out/prj-charter.md"]);
    expect(readFileSync(charterPath, "utf8")).toBe("existing content");

    // 2. With dryRun and force: should report written but not change file
    const resultDryRun = runGenerateTarget({
      catalogPath: fx.catalogPath,
      templatesPath: fx.templatesPath,
      rulebooksPath: fx.rulebooksPath,
      repoRoot: fx.repoRoot,
      projectId: "prjx",
      targetId: "prjx:prj-charter",
      force: true,
      dryRun: true,
    });
    expect(resultDryRun.written).toEqual(["out/prj-charter.md"]);
    expect(readFileSync(charterPath, "utf8")).toBe("existing content");

    // 3. With force: should overwrite
    const resultForce = runGenerateTarget({
      catalogPath: fx.catalogPath,
      templatesPath: fx.templatesPath,
      rulebooksPath: fx.rulebooksPath,
      repoRoot: fx.repoRoot,
      projectId: "prjx",
      targetId: "prjx:prj-charter",
      force: true,
    });
    expect(resultForce.written).toEqual(["out/prj-charter.md"]);
    expect(readFileSync(charterPath, "utf8")).not.toBe("existing content");
  });

  it("rejects path pointing outside the repository", () => {
    writeRulebook(fx, "custom");

    const result = runGenerateTarget({
      catalogPath: fx.catalogPath,
      templatesPath: fx.templatesPath,
      rulebooksPath: fx.rulebooksPath,
      repoRoot: fx.repoRoot,
      projectId: "prjx",
      targetId: "prjx:escaped",
      targetPath: "../outside.md",
      targetRulebook: "specdojo:custom-rulebook",
      force: false,
    });

    expect(result.written).toEqual([]);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toMatch(/--target-path points outside the repository/);
  });

  it("errors when --target and --dct are used together in deliverable scaffold", () => {
    const program = new Command();
    program.exitOverride();
    registerDeliverableCommands(program);

    let output = "";
    const originalStdoutWrite = process.stdout.write;
    process.stdout.write = ((chunk: unknown) => {
      output += String(chunk);
      return true;
    }) as typeof process.stdout.write;

    try {
      program.parse([
        "node",
        "specdojo",
        "deliverable",
        "scaffold",
        "--target",
        "prj-charter",
        "--dct",
        "demo",
      ]);
    } finally {
      process.stdout.write = originalStdoutWrite;
    }

    expect(output).toContain("Cannot specify both --target and --dct");
  });

  it("errors when --target-path is used without --target", () => {
    const program = new Command();
    program.exitOverride();
    registerDeliverableCommands(program);

    let output = "";
    const originalStdoutWrite = process.stdout.write;
    process.stdout.write = ((chunk: unknown) => {
      output += String(chunk);
      return true;
    }) as typeof process.stdout.write;

    try {
      program.parse([
        "node",
        "specdojo",
        "deliverable",
        "scaffold",
        "--target-path",
        "docs/ja/product/test.md",
      ]);
    } finally {
      process.stdout.write = originalStdoutWrite;
    }

    expect(output).toContain("--target-path and --target-rulebook require --target");
  });

  it("scaffolds via CLI --target from catalog", () => {
    writeCatalog(fx, CATALOG_WITH_TWO_DELIVERABLES);
    writeRulebook(fx, "prj-charter");

    const program = new Command();
    program.exitOverride();
    registerDeliverableCommands(program);

    let output = "";
    const originalStdoutWrite = process.stdout.write;
    process.stdout.write = ((chunk: unknown) => {
      output += String(chunk);
      return true;
    }) as typeof process.stdout.write;

    try {
      program.parse(["node", "specdojo", "deliverable", "scaffold", "--target", "prj-charter"]);
    } finally {
      process.stdout.write = originalStdoutWrite;
    }

    expect(output).toContain("Created: out/prj-charter.md");
    expect(existsSync(path.join(fx.repoRoot, "out/prj-charter.md"))).toBe(true);
  });

  it("scaffolds via CLI --target for catalog-less deliverable with --dry-run", () => {
    writeRulebook(fx, "custom");

    const program = new Command();
    program.exitOverride();
    registerDeliverableCommands(program);

    let output = "";
    const originalStdoutWrite = process.stdout.write;
    process.stdout.write = ((chunk: unknown) => {
      output += String(chunk);
      return true;
    }) as typeof process.stdout.write;

    try {
      program.parse([
        "node",
        "specdojo",
        "deliverable",
        "scaffold",
        "--target",
        "my-doc",
        "--target-path",
        "out/my-doc.md",
        "--target-rulebook",
        "specdojo:custom-rulebook",
        "--dry-run",
      ]);
    } finally {
      process.stdout.write = originalStdoutWrite;
    }

    expect(output).toContain("Would create: out/my-doc.md");
    expect(existsSync(path.join(fx.repoRoot, "out/my-doc.md"))).toBe(false);
  });
});
