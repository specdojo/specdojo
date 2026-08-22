import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { load } from "js-yaml";
import { afterEach, describe, expect, it } from "vitest";
import {
  buildCatalog,
  buildDctIndexMarkdown,
  loadDctIndex,
  validateCatalogIndex,
} from "../../src/catalog-build.js";
import type { DctIndexDoc } from "../../src/catalog-types.js";
import { buildValidator, formatErrors } from "../helpers/schema.js";

let root = "";

afterEach(() => {
  if (root) rmSync(root, { recursive: true, force: true });
  root = "";
});

function dctYaml(fileId: string, domain: string): string {
  return [
    `id: prj-0001:${fileId}`,
    "type: project",
    "status: draft",
    "project_id: prj-0001",
    `domain: ${domain}`,
    "groups:",
    "  - deliverables:",
    `      - local_id: ${fileId}`,
    `        name: ${fileId}`,
    "        kind: control",
    `        overview: ${fileId} overview`,
    "",
  ].join("\n");
}

function indexDoc(groups: DctIndexDoc["groups"]): DctIndexDoc {
  return {
    id: "prj-0001:dct-index",
    type: "project",
    status: "draft",
    title: "成果物カタログ",
    rulebook: "specdojo:dct-index-rulebook",
    project_id: "prj-0001",
    size: "large",
    groups,
  };
}

function makeCatalog(files: Record<string, string>, index: DctIndexDoc): string {
  root = mkdtempSync(join(tmpdir(), "specdojo-index-"));
  const catalogPath = join(root, "catalog");
  mkdirSync(catalogPath, { recursive: true });
  for (const [file, content] of Object.entries(files)) {
    writeFileSync(join(catalogPath, file), content, "utf8");
  }
  writeFileSync(join(catalogPath, "dct-index.yaml"), JSON.stringify(index), "utf8");
  return catalogPath;
}

describe("dct-index", () => {
  it("renders one table per group in declaration order with the standard columns", () => {
    const doc = indexDoc([
      {
        name: "第1グループ",
        domains: [
          { domain: "beta", name: "ベータ", overview: "ベータを管理する。" },
          { domain: "alpha", name: "アルファ", overview: "アルファを管理する。" },
        ],
      },
      {
        name: "第2グループ",
        domains: [{ domain: "gamma", name: "ガンマ", overview: "ガンマを管理する。" }],
      },
    ]);
    const template = readFileSync(
      resolve("docs/ja/specdojo/templates/dct-index-template.md"),
      "utf8",
    );

    const markdown = buildDctIndexMarkdown(doc, template);

    expect(markdown).toContain("| ドメイン | 名称 | 成果物カタログ | 概要 |");
    expect(markdown.indexOf("### 2.1. 第1グループ")).toBeLessThan(
      markdown.indexOf("### 2.2. 第2グループ"),
    );
    expect(markdown.indexOf("`beta`")).toBeLessThan(markdown.indexOf("`alpha`"));
    expect(markdown).toContain("[dct-beta](./dct-beta.md)");
  });

  it("builds one index row for a domain split across physical files deterministically", () => {
    const index = indexDoc([
      {
        name: "データ",
        domains: [
          { domain: "data-model", name: "データモデル", overview: "データ構造を管理する。" },
        ],
      },
    ]);
    const catalogPath = makeCatalog(
      {
        "dct-data-model-b.yaml": dctYaml("dct-data-model-b", "data-model"),
        "dct-data-model-a.yaml": dctYaml("dct-data-model-a", "data-model"),
      },
      index,
    );

    const first = buildCatalog(catalogPath);
    const firstMarkdown = readFileSync(join(catalogPath, "generated", "dct-index.md"), "utf8");
    const second = buildCatalog(catalogPath);
    const secondMarkdown = readFileSync(join(catalogPath, "generated", "dct-index.md"), "utf8");

    expect(first.errors).toEqual([]);
    expect(second.errors).toEqual([]);
    expect(firstMarkdown).toBe(secondMarkdown);
    expect(firstMarkdown.match(/\| `data-model` \|/g)).toHaveLength(1);
    expect(first.generated.some((path) => path.endsWith("dct-index.md"))).toBe(true);
  });

  it("reports domains present on only one side of the declaration/source comparison", () => {
    const catalogPath = makeCatalog(
      { "dct-actual.yaml": dctYaml("dct-actual", "actual") },
      indexDoc([
        {
          name: "不一致",
          domains: [{ domain: "declared", name: "宣言のみ", overview: "宣言のみ。" }],
        },
      ]),
    );

    const result = validateCatalogIndex(catalogPath);

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.stringContaining("declared domain 'declared' has no dct-*.yaml source"),
        expect.stringContaining("domain 'actual' from dct-*.yaml is not declared"),
      ]),
    );
  });

  it("loads project size only from dct-index.yaml", () => {
    const catalogPath = makeCatalog(
      { "dct-alpha.yaml": dctYaml("dct-alpha", "alpha") },
      indexDoc([
        {
          name: "A",
          domains: [{ domain: "alpha", name: "A", overview: "A を管理する。" }],
        },
      ]),
    );

    expect(loadDctIndex(catalogPath)?.size).toBe("large");
  });

  it("validates the YAML sample against dct-index.schema.yaml", () => {
    const validator = buildValidator("docs/specdojo/schemas/v1/dct-index.schema.yaml");
    const sample = load(
      readFileSync(resolve("docs/ja/specdojo/samples/dct-index-sample.yaml"), "utf8"),
    );

    expect(validator(sample), formatErrors(validator.errors)).toBe(true);
  });
});
