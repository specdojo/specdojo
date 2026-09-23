import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  resolveSpecdojoPath,
  resolveSpecdojoReferencePathIfExists,
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

describe("resolveSpecdojoPath", () => {
  it("同名 schema は利用者リポジトリ側を優先する", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-resource-resolution-"));
    try {
      const repositoryRoot = join(root, "repository");
      const packageRoot = join(root, "package");
      const relativePath = "docs/specdojo/schemas/v1/example.schema.yaml";
      const repositoryPath = join(repositoryRoot, relativePath);
      mkdirSync(join(repositoryRoot, "docs/specdojo/schemas/v1"), { recursive: true });
      mkdirSync(join(packageRoot, "docs/specdojo/schemas/v1"), { recursive: true });
      writeFileSync(repositoryPath, "type: object\n", "utf8");
      writeFileSync(join(packageRoot, relativePath), "type: string\n", "utf8");

      expect(resolveSpecdojoPath(relativePath, { repositoryRoot, packageRoot })).toBe(
        repositoryPath,
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("利用者リポジトリに無い exec template は package 側へフォールバックする", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-resource-resolution-"));
    try {
      const repositoryRoot = join(root, "repository");
      const packageRoot = join(root, "package");
      const relativePath = "docs/ja/specdojo/exec-templates/xep-template.md";
      const bundledPath = join(packageRoot, relativePath);
      mkdirSync(join(packageRoot, "docs/ja/specdojo/exec-templates"), { recursive: true });
      writeFileSync(bundledPath, "template\n", "utf8");

      expect(resolveSpecdojoPath(relativePath, { repositoryRoot, packageRoot })).toBe(bundledPath);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("package 側の解決結果を plan 用のリポジトリ相対パスで返す", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-resource-resolution-"));
    try {
      const repositoryRoot = join(root, "repository");
      const packageRoot = join(repositoryRoot, "node_modules/specdojo");
      const relativePath = "docs/ja/specdojo/rulebooks/example-rulebook.md";
      mkdirSync(join(packageRoot, "docs/ja/specdojo/rulebooks"), { recursive: true });
      writeFileSync(join(packageRoot, relativePath), "# Rulebook\n", "utf8");

      expect(
        resolveSpecdojoReferencePathIfExists(relativePath, { repositoryRoot, packageRoot }),
      ).toBe("node_modules/specdojo/docs/ja/specdojo/rulebooks/example-rulebook.md");
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
