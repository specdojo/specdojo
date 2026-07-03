import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { load } from "js-yaml";
import fg from "fast-glob";
import { scaffoldDoc } from "../../src/catalog-scaffold.js";
import type { DctTemplateDoc } from "../../src/catalog-types.js";
import { buildValidator, formatErrors } from "../helpers/schema.js";

const MINIMAL_TEMPLATE: DctTemplateDoc = {
  id: "dct-sample-template",
  type: "template",
  status: "draft",
  domain: "test",
  base_path: "/docs/ja/projects/_PROJECT_ID_/010-sample",
  groups: [
    {
      deliverables: [
        {
          local_id: "doc-a",
          name: "ドキュメントA",
          kind: "work",
          overview: "概要",
          path: "doc-a.md",
        },
        {
          local_id: "doc-b",
          name: "ドキュメントB（large 以上のみ）",
          kind: "work",
          overview: "概要",
          min_size: "large",
          path: "doc-b.md",
        },
      ],
    },
  ],
};

describe("scaffoldDoc — プレースホルダ置換", () => {
  it("id を <projectId>:<template-base-id> の形式で生成する", () => {
    const doc = scaffoldDoc(MINIMAL_TEMPLATE, "prj-0001", "large");
    expect(doc.id).toBe("prj-0001:dct-sample");
  });

  it("project_id を設定する", () => {
    const doc = scaffoldDoc(MINIMAL_TEMPLATE, "prj-0001", "large");
    expect(doc.project_id).toBe("prj-0001");
  });

  it("base_path の _PROJECT_ID_ を projectId に置き換える", () => {
    const doc = scaffoldDoc(MINIMAL_TEMPLATE, "prj-0001", "large");
    expect(doc.base_path).toBe("/docs/ja/projects/prj-0001/010-sample");
  });

  it("part_of の _PROJECT_ID_ を projectId に置き換える", () => {
    const template: DctTemplateDoc = {
      ...MINIMAL_TEMPLATE,
      part_of: ["_PROJECT_ID_:dct-index"],
    };
    const doc = scaffoldDoc(template, "prj-0001", "large");
    expect(doc.part_of).toEqual(["prj-0001:dct-index"]);
  });

  it("instance_id_pattern をプロジェクトカタログへ保持する", () => {
    const template: DctTemplateDoc = {
      ...MINIMAL_TEMPLATE,
      groups: [
        {
          deliverables: [
            {
              local_id: "doc-entry",
              instance_id_pattern: "doc-{sequence}-{term}",
              name: "反復ドキュメント",
              kind: "control",
              overview: "概要",
            },
          ],
        },
      ],
    };
    const doc = scaffoldDoc(template, "prj-0001", "large");
    expect(doc.groups[0]?.deliverables?.[0]?.instance_id_pattern).toBe("doc-{sequence}-{term}");
  });
});

describe("scaffoldDoc — サイズフィルタリング", () => {
  it("size=large のとき min_size: large の成果物が含まれる", () => {
    const doc = scaffoldDoc(MINIMAL_TEMPLATE, "prj-0001", "large");
    expect(doc.groups[0]?.deliverables).toHaveLength(2);
  });

  it("size=small のとき min_size: large の成果物が除外される", () => {
    const doc = scaffoldDoc(MINIMAL_TEMPLATE, "prj-0001", "small");
    expect(doc.groups[0]?.deliverables).toHaveLength(1);
    expect(doc.groups[0]?.deliverables?.[0]?.local_id).toBe("doc-a");
  });

  it("成果物がすべて除外されたセクションはグループから取り除かれる", () => {
    const template: DctTemplateDoc = {
      ...MINIMAL_TEMPLATE,
      groups: [
        {
          deliverables: [
            {
              local_id: "large-only",
              name: "Large Only",
              kind: "work",
              overview: "概要",
              min_size: "large",
              path: "large-only.md",
            },
          ],
        },
      ],
    };
    const doc = scaffoldDoc(template, "prj-0001", "small");
    expect(doc.groups).toHaveLength(0);
  });

  it("size=medium のとき min_size: small の成果物は含まれる", () => {
    const template: DctTemplateDoc = {
      ...MINIMAL_TEMPLATE,
      groups: [
        {
          deliverables: [
            {
              local_id: "small-doc",
              name: "Small Doc",
              kind: "work",
              overview: "概要",
              min_size: "small",
              path: "small-doc.md",
            },
          ],
        },
      ],
    };
    const doc = scaffoldDoc(template, "prj-0001", "medium");
    expect(doc.groups[0]?.deliverables).toHaveLength(1);
  });
});

describe("catalog scaffold — dct テンプレートスキーマ適合検証", () => {
  const files = fg
    .sync("docs/ja/specdojo/templates/dct-*-template.yaml", { onlyFiles: true })
    .sort();

  it.each(files)("%s を scaffold した出力が dct スキーマに適合する", (filePath) => {
    const validator = buildValidator("docs/specdojo/schemas/v1/dct.schema.yaml");
    const template = load(readFileSync(resolve(filePath), "utf8")) as DctTemplateDoc;
    const data = scaffoldDoc(template, "prj-0001", "large") as unknown as Record<string, unknown>;
    expect(validator(data), formatErrors(validator.errors)).toBe(true);
  });
});

describe("catalog scaffold — dct テンプレートファイル直接検証", () => {
  const files = fg
    .sync("docs/ja/specdojo/templates/dct-*-template.yaml", { onlyFiles: true })
    .sort();

  it.each(files)("%s が dct スキーマに適合する（type: template として直接検証）", (filePath) => {
    const validator = buildValidator("docs/specdojo/schemas/v1/dct.schema.yaml");
    const data = load(readFileSync(resolve(filePath), "utf8")) as unknown as Record<
      string,
      unknown
    >;
    expect(validator(data), formatErrors(validator.errors)).toBe(true);
  });
});
