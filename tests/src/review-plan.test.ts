import { describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import yaml from "js-yaml";
import { expandViewpointsDoc, scaffoldViewpoints } from "../../src/review-plan.js";
import { buildValidator, formatErrors } from "../helpers/schema.js";

const TEMPLATE_PATH = "docs/ja/specdojo/templates/pm-review-viewpoints-template.yaml";

describe("expandViewpointsDoc", () => {
  it("id を <projectId>:pm-review-viewpoints の形式で設定する", () => {
    const doc = expandViewpointsDoc(resolve(TEMPLATE_PATH), "prj-0001");
    expect(doc.id).toBe("prj-0001:pm-review-viewpoints");
  });

  it('type を "project" に設定する', () => {
    const doc = expandViewpointsDoc(resolve(TEMPLATE_PATH), "prj-0001");
    expect(doc.type).toBe("project");
  });

  it("project_id を設定する", () => {
    const doc = expandViewpointsDoc(resolve(TEMPLATE_PATH), "prj-0001");
    expect(doc.project_id).toBe("prj-0001");
  });

  it("テンプレートの他のフィールドを保持する", () => {
    const doc = expandViewpointsDoc(resolve(TEMPLATE_PATH), "prj-0001");
    expect(doc).toHaveProperty("categories");
    expect(doc).toHaveProperty("viewpoints");
  });

  it("生成物メタを metadata_template から平坦化し、テンプレート自身のメタを出力しない", () => {
    const doc = expandViewpointsDoc(resolve(TEMPLATE_PATH), "prj-0001");

    expect(doc.title).toBe("レビュー観点一覧");
    expect(doc.status).toBe("draft");
    expect(doc).not.toHaveProperty("metadata_template");
  });

  it("metadata_template を持たないテンプレートはファイルパスを含むエラーになる", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-test-"));
    try {
      const templatePath = join(dir, "no-metadata-template.yaml");
      writeFileSync(templatePath, "id: broken-template\ntype: template\n", "utf8");

      expect(() => expandViewpointsDoc(templatePath, "prj-0001")).toThrow(
        /metadata_template is missing or not a mapping: .*no-metadata-template\.yaml/,
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe("scaffoldViewpoints", () => {
  function withTempDir<T>(fn: (dir: string) => T): T {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-test-"));
    try {
      return fn(dir);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }

  it("出力先が存在しない場合は中間ディレクトリごと作成して書き込む", () => {
    withTempDir((dir) => {
      const outputPath = join(dir, "nested", "pm-review-viewpoints.yaml");

      const actual = scaffoldViewpoints({
        templatePath: resolve(TEMPLATE_PATH),
        projectId: "prj-0001",
        outputPath,
        force: false,
      });

      expect(actual).toEqual({ written: true, skipped: false });
      const doc = yaml.load(readFileSync(outputPath, "utf8")) as Record<string, unknown>;
      expect(doc.id).toBe("prj-0001:pm-review-viewpoints");
    });
  });

  it("出力先が既存かつ force なしの場合は skip して上書きしない", () => {
    withTempDir((dir) => {
      const outputPath = join(dir, "pm-review-viewpoints.yaml");
      writeFileSync(outputPath, "existing: true\n", "utf8");

      const actual = scaffoldViewpoints({
        templatePath: resolve(TEMPLATE_PATH),
        projectId: "prj-0001",
        outputPath,
        force: false,
      });

      expect(actual).toEqual({ written: false, skipped: true });
      expect(readFileSync(outputPath, "utf8")).toBe("existing: true\n");
    });
  });

  it("出力先が既存でも force ありの場合は上書きする", () => {
    withTempDir((dir) => {
      const outputPath = join(dir, "pm-review-viewpoints.yaml");
      writeFileSync(outputPath, "existing: true\n", "utf8");

      const actual = scaffoldViewpoints({
        templatePath: resolve(TEMPLATE_PATH),
        projectId: "prj-0001",
        outputPath,
        force: true,
      });

      expect(actual).toEqual({ written: true, skipped: false });
      const doc = yaml.load(readFileSync(outputPath, "utf8")) as Record<string, unknown>;
      expect(doc.project_id).toBe("prj-0001");
    });
  });
});

describe("review scaffold — pm-review-viewpoints テンプレートスキーマ適合検証", () => {
  it("pm-review-viewpoints-template.yaml を展開した出力が pm-review-viewpoints スキーマに適合する", () => {
    const validator = buildValidator("docs/specdojo/schemas/v1/pm-review-viewpoints.schema.yaml");
    const data = expandViewpointsDoc(resolve(TEMPLATE_PATH), "prj-0001");
    expect(validator(data), formatErrors(validator.errors)).toBe(true);
  });
});
