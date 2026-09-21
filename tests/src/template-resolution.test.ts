import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  resolveSpecdojoTemplatePath,
  resolveSpecdojoTemplatesDir,
} from "../../src/template-resolution.js";

const TEMPLATE_DIR = "docs/ja/specdojo/templates";

function writeTemplate(root: string, fileName: string): string {
  const templatePath = join(root, TEMPLATE_DIR, fileName);
  mkdirSync(join(root, TEMPLATE_DIR), { recursive: true });
  writeFileSync(templatePath, "template\n", "utf8");
  return templatePath;
}

describe("resolveSpecdojoTemplatePath", () => {
  it("利用者リポジトリのテンプレートを同梱テンプレートより優先する", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-template-resolution-"));
    try {
      const repositoryRoot = join(root, "repository");
      const packageRoot = join(root, "package");
      const repositoryPath = writeTemplate(repositoryRoot, "pjr-todo-template.md");
      writeTemplate(packageRoot, "pjr-todo-template.md");

      expect(
        resolveSpecdojoTemplatePath("pjr-todo-template.md", { repositoryRoot, packageRoot }),
      ).toBe(repositoryPath);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("利用者リポジトリに無ければ同梱テンプレートへフォールバックする", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-template-resolution-"));
    try {
      const repositoryRoot = join(root, "repository");
      const packageRoot = join(root, "package");
      const bundledPath = writeTemplate(packageRoot, "pjr-todo-template.md");

      expect(
        resolveSpecdojoTemplatePath("pjr-todo-template.md", { repositoryRoot, packageRoot }),
      ).toBe(bundledPath);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("どちらにも無い場合は探索した両方のパスを示す", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-template-resolution-"));
    try {
      const repositoryRoot = join(root, "repository");
      const packageRoot = join(root, "package");
      const repositoryPath = join(repositoryRoot, TEMPLATE_DIR, "missing-template.md");
      const bundledPath = join(packageRoot, TEMPLATE_DIR, "missing-template.md");

      expect(() =>
        resolveSpecdojoTemplatePath("missing-template.md", { repositoryRoot, packageRoot }),
      ).toThrow(
        new RegExp(
          `Searched repository template: ${repositoryPath}\\n` +
            `Searched bundled package template: ${bundledPath}`,
        ),
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe("resolveSpecdojoTemplatesDir", () => {
  it("利用者リポジトリに無ければ同梱テンプレートディレクトリへフォールバックする", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-template-resolution-"));
    try {
      const repositoryRoot = join(root, "repository");
      const packageRoot = join(root, "package");
      writeTemplate(packageRoot, "dct-data-flow-template.yaml");

      expect(resolveSpecdojoTemplatesDir({ repositoryRoot, packageRoot })).toBe(
        join(packageRoot, TEMPLATE_DIR),
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
