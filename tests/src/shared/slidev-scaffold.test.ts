import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resolveConfig } from "prettier";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { runSlidevScaffold, SLIDEV_KATA_PATTERNS } from "../../../src/shared/slidev-scaffold.js";

let repoRoot: string;
let output: string[];

beforeEach(() => {
  repoRoot = mkdtempSync(join(tmpdir(), "specdojo-slidev-"));
  output = [];
  vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
    output.push(String(chunk));
    return true;
  });
});

afterEach(() => {
  rmSync(repoRoot, { recursive: true, force: true });
  vi.restoreAllMocks();
});

function readPackage(): {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
} {
  return JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8")) as ReturnType<
    typeof readPackage
  >;
}

describe("Slidev scaffold", () => {
  it("previews additions, creates settings, and applies the parser only to Slidev kata", async () => {
    writeFileSync(join(repoRoot, "package.json"), '{"name":"fixture"}\n');
    let sawPreviewBeforeWrite = false;
    vi.mocked(process.stdout.write).mockImplementation((chunk) => {
      output.push(String(chunk));
      if (String(chunk).startsWith("Planned Slidev .markdownlintignore")) {
        sawPreviewBeforeWrite =
          !existsSync(join(repoRoot, ".prettierrc")) && readPackage().devDependencies === undefined;
      }
      return true;
    });
    await runSlidevScaffold({ repoRoot, dryRun: false });
    expect(sawPreviewBeforeWrite).toBe(true);
    expect(readPackage().devDependencies).toEqual({
      "@slidev/cli": "^53.0.0",
      "prettier-plugin-slidev": "^1.0.5",
      prettier: "^3.8.4",
    });
    for (const file of [
      "docs/ja/specdojo/samples/edu-scratch/lesson-slidev-sample.md",
      "docs/ja/specdojo/templates/edu-scratch/lesson-slidev-template.md",
      "docs/ja/specdojo/samples/lesson-slidev-sample.md",
    ]) {
      await expect(resolveConfig(join(repoRoot, file))).resolves.toMatchObject({
        parser: "slidev",
        plugins: ["prettier-plugin-slidev"],
      });
    }
    for (const file of [
      "README.md",
      "docs/ja/specdojo/samples/edu-scratch/lesson-sample.md",
      "docs/ja/projects/prj-0001/lesson-slidev-sample.md",
    ]) {
      expect((await resolveConfig(join(repoRoot, file)))?.parser).toBeUndefined();
    }
    expect(readFileSync(join(repoRoot, ".markdownlintignore"), "utf8")).toBe(
      `${SLIDEV_KATA_PATTERNS.join("\n")}\n`,
    );
  });

  it("keeps existing settings and dependencies byte for byte on repeated runs", async () => {
    const prettier =
      '{"tabWidth":4,"overrides":[{"files":"*.md","options":{"parser":"markdown"}}]}\n';
    const ignore = "custom/\n!important.md\n";
    writeFileSync(join(repoRoot, ".prettierrc"), prettier);
    writeFileSync(join(repoRoot, ".markdownlintignore"), ignore);
    writeFileSync(
      join(repoRoot, "package.json"),
      JSON.stringify({
        dependencies: { "@slidev/cli": "custom-cli" },
        devDependencies: { "prettier-plugin-slidev": "custom-plugin", prettier: "custom-prettier" },
        scripts: { build: "custom-build" },
      }),
    );
    const original = readFileSync(join(repoRoot, "package.json"), "utf8");
    await runSlidevScaffold({ repoRoot, dryRun: false });
    await runSlidevScaffold({ repoRoot, dryRun: false });
    expect(readFileSync(join(repoRoot, "package.json"), "utf8")).toBe(original);
    expect(readFileSync(join(repoRoot, ".prettierrc"), "utf8")).toBe(prettier);
    expect(readFileSync(join(repoRoot, ".markdownlintignore"), "utf8")).toBe(ignore);
    expect(output.join("")).toContain("Merge the overrides above manually");
    expect(output.join("")).toContain("Add any missing patterns above manually");
  });

  it("adds only missing devDependencies while preserving formatting and unrelated entries", async () => {
    writeFileSync(
      join(repoRoot, "package.json"),
      '{\n\t"scripts": {"build": "custom"},\n\t"dependencies": {"@slidev/cli": "custom"},\n\t"devDependencies": {"other": "1"}\n}\n',
    );
    await runSlidevScaffold({ repoRoot, dryRun: false });
    expect(readPackage()).toMatchObject({
      scripts: { build: "custom" },
      dependencies: { "@slidev/cli": "custom" },
      devDependencies: { other: "1", "prettier-plugin-slidev": "^1.0.5" },
    });
    expect(readPackage().devDependencies).not.toHaveProperty("@slidev/cli");
    expect(readFileSync(join(repoRoot, "package.json"), "utf8")).toContain('\n\t"scripts"');
    const first = readFileSync(join(repoRoot, "package.json"), "utf8");
    await runSlidevScaffold({ repoRoot, dryRun: false });
    expect(readFileSync(join(repoRoot, "package.json"), "utf8")).toBe(first);
  });

  it.each([".prettierrc.yaml", "prettier.config.mjs", ".prettierrc.ts", "package.json#prettier"])(
    "recognizes an existing %s without adding a competing configuration",
    async (file) => {
      if (file === "package.json#prettier") {
        writeFileSync(join(repoRoot, "package.json"), '{"prettier":{"semi":false}}\n');
      } else {
        writeFileSync(join(repoRoot, file), "// custom config\n");
      }
      await runSlidevScaffold({ repoRoot, dryRun: false });
      expect(existsSync(join(repoRoot, ".prettierrc"))).toBe(false);
      expect(output.join("")).toContain(`Kept existing ${file}`);
    },
  );

  it.each([true, false])(
    "dry-run leaves files unchanged (existing package: %s)",
    async (existing) => {
      if (existing) writeFileSync(join(repoRoot, "package.json"), '{"name":"fixture"}\n');
      await runSlidevScaffold({ repoRoot, dryRun: true });
      expect(existsSync(join(repoRoot, ".prettierrc"))).toBe(false);
      expect(existsSync(join(repoRoot, ".markdownlintignore"))).toBe(false);
      expect(existsSync(join(repoRoot, "package.json"))).toBe(existing);
      if (existing)
        expect(readFileSync(join(repoRoot, "package.json"), "utf8")).toBe('{"name":"fixture"}\n');
      expect(output.join("")).toContain("Planned package.json additions");
      expect(output.join("")).toContain("[dry-run] would write: .prettierrc");
    },
  );

  it("shows required dependencies without creating a missing package.json", async () => {
    await runSlidevScaffold({ repoRoot, dryRun: false });
    expect(existsSync(join(repoRoot, "package.json"))).toBe(false);
    expect(output.join("")).toContain("Create it and add the entries above");
    expect(existsSync(join(repoRoot, ".prettierrc"))).toBe(true);
  });

  it.each(["{", "[]", '{"devDependencies":[]}', '{"dependencies":"invalid"}'])(
    "rejects invalid package data %s before writing settings",
    async (content) => {
      writeFileSync(join(repoRoot, "package.json"), content);
      await expect(runSlidevScaffold({ repoRoot, dryRun: false })).rejects.toThrow();
      expect(readFileSync(join(repoRoot, "package.json"), "utf8")).toBe(content);
      expect(existsSync(join(repoRoot, ".prettierrc"))).toBe(false);
      expect(existsSync(join(repoRoot, ".markdownlintignore"))).toBe(false);
    },
  );
});
