import { Command } from "commander";
import { registerRegisterCommands } from "../../../src/register/register.js";
import { registerExecCommands } from "../../../src/exec/commands.js";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const sourceRoot = process.cwd();
const originalPackageRoot = process.env.SPECDOJO_PACKAGE_ROOT;
let root: string;
function write(path: string, text: string): void {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), text);
}
async function cli(...args: string[]): Promise<void> {
  const program = new Command();
  program.exitOverride();
  registerRegisterCommands(program);
  registerExecCommands(program);
  await program.parseAsync(args, { from: "user" });
  expect(process.exitCode).not.toBe(1);
}

const registerDir = "docs/ja/projects/prj-test/register";
function ticket(): string {
  return readFileSync(join(root, registerDir, "pjr-ab12-note.md"), "utf8");
}

describe("catalog-less register add -> exec plan CLI", () => {
  beforeEach(() => {
    process.exitCode = undefined;
    root = mkdtempSync(join(tmpdir(), "specdojo-catalogless-cli-"));
    write(
      ".specdojo/specdojo.config.json",
      JSON.stringify({
        version: 1,
        current_project: "prj-test",
        kata_authority: "customer",
        projects: {
          "prj-test": {
            base_path: "docs/ja/projects/prj-test",
            project_register_path: "register",
            execution_path: "execution",
          },
        },
      }),
    );
    write("package.json", '{"name":"customer"}');
    write(
      "docs/ja/specdojo/rulebooks/customer/note-rulebook.md",
      "---\nspecdojo:\n  id: customer:note-rulebook\n  type: rulebook\n  status: draft\n  recipe: customer:note-recipe\n  sample: customer:note-sample\n  template: not-needed\n---\n\n# Note rules\n",
    );
    process.chdir(root);
    process.env.SPECDOJO_PACKAGE_ROOT = sourceRoot;
    for (const kind of ["recipe", "sample"]) {
      write(
        `docs/ja/specdojo/${kind}s/customer/note-${kind}.md`,
        `---\nspecdojo:\n  id: customer:note-${kind}\n  type: ${kind}\n  status: draft\n---\n\n# ${kind}\n`,
      );
    }
  });
  afterEach(() => {
    process.chdir(sourceRoot);
    if (originalPackageRoot === undefined) delete process.env.SPECDOJO_PACKAGE_ROOT;
    else process.env.SPECDOJO_PACKAGE_ROOT = originalPackageRoot;
    process.exitCode = undefined;
    rmSync(root, { recursive: true, force: true });
  });

  it.each([
    "fully-guided",
    "recipe-guided",
    "freeform",
    "retrofit",
    "bootstrap",
    "finalize",
    "bootstrap-finalize",
  ])("registers and generates %s without catalog_path", async (approach) => {
    const existing = approach.endsWith("finalize");
    if (existing)
      write(
        "docs/ja/product/note.md",
        "---\nspecdojo:\n  id: prj-test:note\n  type: project\n  status: draft\n  rulebook: customer:note-rulebook\n---\n\n# Note\n",
      );
    await cli(
      "register",
      "add",
      "--type",
      "todo",
      "--id",
      "PJR-AB12",
      "--topic",
      "note",
      "--title",
      "Write note",
      "--description",
      "Explain inputs",
      "--by",
      "SpecDojo",
      "--approach",
      approach,
      "--target",
      "prj-test:note",
      ...(existing
        ? []
        : [
            "--target-path",
            "docs/ja/product/note.md",
            "--target-rulebook",
            approach === "bootstrap" ? "customer:new-rulebook" : "customer:note-rulebook",
          ]),
    );
    expect(ticket()).toContain(`approach: ${approach}`);
    await cli("exec", "plan", "--register", "PJR-AB12", "--out", "note-plan.md");
    const plan = readFileSync(join(root, "note-plan.md"), "utf8");
    expect(plan).toContain("origin: register");
    expect(plan).toContain("docs/ja/product/note.md");
    expect(plan).toContain("カタログの `done_criteria` はない");
    expect(plan).toContain("prj-test:note");
    if (approach === "bootstrap")
      expect(plan).toContain("docs/ja/specdojo/rulebooks/customer/new-rulebook.md");
  });

  it("updates, validates and removes explicit target fields", async () => {
    await cli(
      "register",
      "add",
      "--type",
      "todo",
      "--id",
      "PJR-AB12",
      "--topic",
      "note",
      "--title",
      "Write note",
      "--by",
      "SpecDojo",
    );
    await cli(
      "register",
      "update",
      "--id",
      "PJR-AB12",
      "--by",
      "SpecDojo",
      "--approach",
      "fully-guided",
      "--target",
      "prj-test:note",
      "--target-path",
      "docs/ja/product/note.md",
      "--target-rulebook",
      "customer:note-rulebook",
    );
    expect(ticket()).toContain("target_path: docs/ja/product/note.md");
    expect(ticket()).toContain("target_rulebook: customer:note-rulebook");
    await cli(
      "register",
      "update",
      "--id",
      "PJR-AB12",
      "--by",
      "SpecDojo",
      "--target-path",
      "docs/ja/product/renamed.md",
    );
    await cli("exec", "plan", "--register", "PJR-AB12", "--out", "note-plan.md");
    expect(readFileSync(join(root, "note-plan.md"), "utf8")).toContain(
      "docs/ja/product/renamed.md",
    );
    await cli(
      "register",
      "update",
      "--id",
      "PJR-AB12",
      "--by",
      "SpecDojo",
      "--approach",
      "-",
      "--target",
      "-",
      "--target-path",
      "-",
      "--target-rulebook",
      "-",
    );
    expect(ticket()).not.toContain("target_path:");
    expect(ticket()).not.toContain("target_rulebook:");
  });
});
