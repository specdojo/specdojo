import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { mechanicallyNotApplicableReason } from "../../../src/exec/reporter.js";

const COMMAND = "npm run validate:schema:file -- --schema s.yaml --data x.yaml";

async function reasonFor(files: Record<string, string>): Promise<string | undefined> {
  const dir = await mkdtemp(path.join(tmpdir(), "specdojo-schema-skip-"));
  try {
    for (const [name, content] of Object.entries(files)) {
      await mkdir(path.dirname(path.join(dir, name)), { recursive: true });
      await writeFile(path.join(dir, name), content, "utf8");
    }
    return mechanicallyNotApplicableReason(COMMAND, {
      packageScripts: { "validate:schema:file": "node x" },
      packageDependencies: new Set<string>(),
      specdojoConfig: null,
      changedPaths: Object.keys(files),
      repoRoot: dir,
    });
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

describe("validate:schema:file applicability", () => {
  it("is not required when only a validate=false template changed", async () => {
    const reason = await reasonFor({
      "t.yaml": "# specdojo-schema: validate=false reason=template\na: 1\n",
    });

    expect(reason).toMatch(/YAML ファイル/);
  });

  it("is not required when only a none directive with reason changed", async () => {
    const reason = await reasonFor({
      "t.yaml": "# specdojo-schema: none reason=external\na: 1\n",
    });

    expect(reason).toMatch(/YAML ファイル/);
  });

  it("stays required for an ordinary YAML", async () => {
    const reason = await reasonFor({ "t.yaml": "a: 1\n" });

    expect(reason).toBeUndefined();
  });

  it("stays required when a directive has no reason", async () => {
    const reason = await reasonFor({ "t.yaml": "# specdojo-schema: validate=false\na: 1\n" });

    expect(reason).toBeUndefined();
  });

  it("stays required when an ordinary YAML changes with a skipped template", async () => {
    const reason = await reasonFor({
      "t.yaml": "# specdojo-schema: validate=false reason=template\na: 1\n",
      "u.yaml": "a: 1\n",
    });

    expect(reason).toBeUndefined();
  });
});
