import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
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

      const config = JSON.parse(readFileSync(join(repoRoot, ".markdownlint.jsonc"), "utf8")) as {
        MD013: boolean;
        MD041: boolean;
      };
      expect(config.MD013).toBe(false);
      expect(config.MD041).toBe(false);
      expect(readFileSync(join(repoRoot, ".markdownlintignore"), "utf8")).toBe(
        ".claude/agents/\n.github/agents/\n.opencode/agents/\n",
      );
    } finally {
      rmSync(repoRoot, { recursive: true, force: true });
    }
  });
});
