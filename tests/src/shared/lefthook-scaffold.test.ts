import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { load } from "js-yaml";
import {
  renderLefthookConfig,
  runLefthookScaffold,
} from "../../../src/shared/lefthook-scaffold.js";
import type { SpecDojoConfig } from "../../../src/shared/specdojo-config.js";

const packageRoot = process.cwd();

const configWithCatalog: SpecDojoConfig = {
  version: 1,
  current_project: "prj-0001",
  projects: {
    "prj-0001": {
      base_path: "docs/ja/projects/prj-0001",
      project_register_path: "controls/project-register",
      catalog_path: "010-deliverables-catalog",
    },
  },
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("lefthook scaffold", () => {
  it("generates the four staged-file checks when register and catalog are configured", () => {
    const content = renderLefthookConfig(configWithCatalog);

    expect(content).toContain('glob: "*.{md,yaml,yml}"');
    expect(content).toContain("specdojo-pre-commit.mjs prettier {staged_files}");
    expect(content).toContain("specdojo-pre-commit.mjs markdownlint {staged_files}");
    expect(content).toContain("specdojo-pre-commit.mjs register-build");
    expect(content).toContain("specdojo-pre-commit.mjs catalog-validate");
    expect(content).not.toContain("npm test");
  });

  it("omits catalog validation when no project has catalog_path", () => {
    const config: SpecDojoConfig = {
      ...configWithCatalog,
      projects: {
        "prj-0001": {
          base_path: "docs/ja/projects/prj-0001",
          project_register_path: "controls/project-register",
        },
      },
    };

    expect(renderLefthookConfig(config)).not.toContain("catalog-validate");
  });

  it("does not overwrite files or existing package entries without force", async () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "specdojo-lefthook-scaffold-"));
    const output: string[] = [];
    vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
      output.push(String(chunk));
      return true;
    });
    try {
      mkdirSync(join(repoRoot, "tools"), { recursive: true });
      writeFileSync(join(repoRoot, "lefthook.yml"), "keep: true\n", "utf8");
      writeFileSync(join(repoRoot, "tools/install-lefthook.mjs"), "// keep\n", "utf8");
      writeFileSync(join(repoRoot, ".markdownlint.yaml"), "MD013: true\n", "utf8");
      writeFileSync(join(repoRoot, ".markdownlintignore"), "custom/\n", "utf8");
      writeFileSync(
        join(repoRoot, "package.json"),
        `${JSON.stringify(
          {
            name: "fixture",
            scripts: { prepare: "custom prepare" },
            devDependencies: { prettier: "custom-version" },
          },
          null,
          2,
        )}\n`,
        "utf8",
      );

      await runLefthookScaffold({
        packageRoot,
        repoRoot,
        config: configWithCatalog,
        force: false,
        dryRun: false,
      });

      expect(readFileSync(join(repoRoot, "lefthook.yml"), "utf8")).toBe("keep: true\n");
      expect(readFileSync(join(repoRoot, "tools/install-lefthook.mjs"), "utf8")).toBe("// keep\n");
      expect(existsSync(join(repoRoot, ".markdownlint.jsonc"))).toBe(false);
      expect(readFileSync(join(repoRoot, ".markdownlint.yaml"), "utf8")).toBe("MD013: true\n");
      expect(readFileSync(join(repoRoot, ".markdownlintignore"), "utf8")).toBe("custom/\n");
      const packageJson = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8")) as {
        scripts: Record<string, string>;
        devDependencies: Record<string, string>;
      };
      expect(packageJson.scripts.prepare).toBe("custom prepare");
      expect(packageJson.scripts["pre-commit"]).toBe("lefthook run pre-commit");
      expect(packageJson.devDependencies.prettier).toBe("custom-version");
      expect(packageJson.devDependencies.lefthook).toBeTruthy();
      expect(packageJson.devDependencies["markdownlint-cli"]).toBeTruthy();
      expect(output.join("").indexOf("Planned package.json additions:")).toBeLessThan(
        output.join("").indexOf("Updated: package.json"),
      );

      await runLefthookScaffold({
        packageRoot,
        repoRoot,
        config: configWithCatalog,
        force: true,
        dryRun: false,
      });
      expect(readFileSync(join(repoRoot, "lefthook.yml"), "utf8")).toContain("pre-commit:");
      const forcedPackageJson = JSON.parse(
        readFileSync(join(repoRoot, "package.json"), "utf8"),
      ) as { scripts: Record<string, string>; devDependencies: Record<string, string> };
      expect(forcedPackageJson.scripts.prepare).toBe("custom prepare");
      expect(forcedPackageJson.devDependencies.prettier).toBe("custom-version");
      expect(existsSync(join(repoRoot, ".markdownlint.jsonc"))).toBe(false);
      expect(readFileSync(join(repoRoot, ".markdownlint.yaml"), "utf8")).toBe("MD013: true\n");
      expect(readFileSync(join(repoRoot, ".markdownlintignore"), "utf8")).toBe("custom/\n");
    } finally {
      rmSync(repoRoot, { recursive: true, force: true });
    }
  });

  it("creates markdownlint rules and excludes generated agent definitions", async () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "specdojo-lefthook-markdownlint-"));
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    try {
      writeFileSync(join(repoRoot, "package.json"), '{"name":"fixture"}\n', "utf8");

      await runLefthookScaffold({
        packageRoot,
        repoRoot,
        config: configWithCatalog,
        force: false,
        dryRun: false,
      });

      const content = readFileSync(join(repoRoot, ".markdownlintrc"), "utf8");
      expect(content.startsWith("{")).toBe(true);
      expect(existsSync(join(repoRoot, ".markdownlint.jsonc"))).toBe(false);
      const config = JSON.parse(content) as {
        MD013: boolean;
        MD041: boolean;
      };
      expect(config.MD013).toBe(false);
      expect(config.MD041).toBe(false);
      expect(load(readFileSync(join(repoRoot, ".markdownlint-cli2.yaml"), "utf8"))).toEqual({
        config: { extends: ".markdownlintrc" },
      });
      expect(readFileSync(join(repoRoot, ".markdownlintignore"), "utf8")).toBe(
        ".claude/agents/\n.github/agents/\n.opencode/agents/\n",
      );
      // Exercise the generated hook's actual markdownlint-cli entry point. MD013
      // must be disabled, while ordinary Markdown errors must still be detected.
      mkdirSync(join(repoRoot, "node_modules"));
      symlinkSync(
        join(packageRoot, "node_modules/markdownlint-cli"),
        join(repoRoot, "node_modules/markdownlint-cli"),
        "dir",
      );
      writeFileSync(join(repoRoot, "README.md"), `# Valid\n\n${"long line ".repeat(20).trim()}\n`);
      const runHookLint = () =>
        spawnSync(
          process.execPath,
          ["tools/specdojo-pre-commit.mjs", "markdownlint", "README.md"],
          {
            cwd: repoRoot,
            encoding: "utf8",
          },
        );
      const valid = runHookLint();
      expect(valid.status, valid.stderr).toBe(0);
      writeFileSync(join(repoRoot, "README.md"), "#Invalid heading\n");
      const invalid = runHookLint();
      expect(invalid.status).toBe(1);
      expect(invalid.stderr).toContain("MD018");
    } finally {
      rmSync(repoRoot, { recursive: true, force: true });
    }
  });

  it.each([
    ".markdownlint.jsonc",
    ".markdownlint.json",
    ".markdownlint.yaml",
    ".markdownlint.yml",
    ".markdownlintrc",
    ".markdownlint-cli2.yaml",
    ".markdownlint-cli2.yml",
    ".markdownlint-cli2.jsonc",
    ".markdownlint-cli2.cjs",
    ".markdownlint-cli2.mjs",
  ])("preserves existing %s even with force and shows missing settings", async (filename) => {
    const repoRoot = mkdtempSync(join(tmpdir(), "specdojo-lefthook-existing-lint-"));
    const output: string[] = [];
    vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
      output.push(String(chunk));
      return true;
    });
    try {
      const original = '{"MD013":true}\n';
      writeFileSync(join(repoRoot, filename), original);
      await runLefthookScaffold({
        packageRoot,
        repoRoot,
        config: configWithCatalog,
        force: true,
        dryRun: false,
      });
      expect(readFileSync(join(repoRoot, filename), "utf8")).toBe(original);
      expect(output.join("")).toContain("Merge any missing");
      expect(output.join("")).toContain("config:\n  extends: .markdownlintrc");
      if (filename === ".markdownlintrc") {
        expect(load(readFileSync(join(repoRoot, ".markdownlint-cli2.yaml"), "utf8"))).toEqual({
          config: { extends: ".markdownlintrc" },
        });
      } else {
        expect(existsSync(join(repoRoot, ".markdownlintrc"))).toBe(false);
        if (!filename.startsWith(".markdownlint-cli2.")) {
          expect(existsSync(join(repoRoot, ".markdownlint-cli2.yaml"))).toBe(false);
          expect(output.join("")).toContain("Migrate its rules to .markdownlintrc");
        }
      }
    } finally {
      rmSync(repoRoot, { recursive: true, force: true });
    }
  });

  it("previews both new configurations without writing during dry-run", async () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "specdojo-lefthook-lint-dry-"));
    const output: string[] = [];
    vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
      output.push(String(chunk));
      return true;
    });
    try {
      await runLefthookScaffold({
        packageRoot,
        repoRoot,
        config: configWithCatalog,
        force: false,
        dryRun: true,
      });
      for (const file of [".markdownlintrc", ".markdownlint-cli2.yaml", ".markdownlintignore"]) {
        expect(existsSync(join(repoRoot, file))).toBe(false);
        expect(output.join("")).toContain(`[dry-run] would write: ${file}`);
      }
    } finally {
      rmSync(repoRoot, { recursive: true, force: true });
    }
  });
});
