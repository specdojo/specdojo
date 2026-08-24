import { afterEach, describe, expect, it } from "vitest";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { load } from "js-yaml";
import fg from "fast-glob";
import { runScaffold, scaffoldDoc } from "../../src/catalog-scaffold.js";
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

  it("title と rulebook をプロジェクトカタログへ引き継ぐ", () => {
    const template: DctTemplateDoc = {
      ...MINIMAL_TEMPLATE,
      title: "成果物カタログ（テスト）",
      rulebook: "specdojo:dct-rulebook",
    };
    const doc = scaffoldDoc(template, "prj-0001", "large");
    expect(doc.title).toBe("成果物カタログ（テスト）");
    expect(doc.rulebook).toBe("specdojo:dct-rulebook");
  });

  it("--var相当の変数をlocal_id・path・depends_on・noteへ一貫して展開する", () => {
    const template: DctTemplateDoc = {
      ...MINIMAL_TEMPLATE,
      groups: [
        {
          deliverables: [
            {
              local_id: "doc-_TERM_",
              name: "_TERM_ document",
              kind: "work",
              overview: "_TERM_ overview",
              path: "doc-_TERM_.md",
              depends_on: ["base-_TERM_"],
              note: "domain is _DOMAIN_",
            },
          ],
        },
      ],
    };

    const doc = scaffoldDoc(template, "prj-0001", "large", {
      TERM: "specdojo",
      DOMAIN: "documentation",
    });
    const deliverable = doc.groups[0]?.deliverables?.[0];
    expect(deliverable).toMatchObject({
      local_id: "doc-specdojo",
      name: "specdojo document",
      overview: "specdojo overview",
      path: "doc-specdojo.md",
      depends_on: ["base-specdojo"],
      note: "domain is documentation",
    });
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

describe("runScaffold — domain選択と変数展開", () => {
  const dirs: string[] = [];

  afterEach(() => {
    for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
  });

  function fixture(): { root: string; catalogPath: string; templatesPath: string } {
    const root = mkdtempSync(join(tmpdir(), "catalog-scaffold-"));
    dirs.push(root);
    const catalogPath = join(root, "docs", "ja", "projects", "prj-0001", "catalog");
    const templatesPath = join(root, "templates");
    mkdirSync(catalogPath, { recursive: true });
    mkdirSync(templatesPath, { recursive: true });
    return { root, catalogPath, templatesPath };
  }

  function writeTemplate(templatesPath: string, domain: string): void {
    writeFileSync(
      join(templatesPath, `dct-${domain}-template.yaml`),
      [
        `id: specdojo:dct-${domain}-template`,
        "type: template",
        "status: draft",
        `title: ${domain}`,
        "rulebook: specdojo:dct-rulebook",
        `domain: ${domain}`,
        `base_path: /docs/_PROJECT_ID_/${domain}`,
        "groups:",
        "  - deliverables:",
        "      - local_id: doc-_TERM_",
        "        name: Document",
        "        kind: work",
        "        overview: Overview",
        "        path: doc-_TERM_.md",
        "",
      ].join("\n"),
      "utf8",
    );
  }

  it("指定した複数domainだけを生成する", () => {
    const { catalogPath, templatesPath } = fixture();
    for (const domain of ["alpha", "beta", "gamma"]) writeTemplate(templatesPath, domain);

    const result = runScaffold({
      catalogPath,
      templatesPath,
      size: "large",
      projectId: "prj-0001",
      force: false,
      domains: ["alpha", "gamma"],
      variables: { TERM: "specdojo" },
    });

    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
    expect(readdirSync(catalogPath).sort()).toEqual(["dct-alpha.yaml", "dct-gamma.yaml"]);
    expect(readFileSync(join(catalogPath, "dct-alpha.yaml"), "utf8")).toContain(
      "local_id: doc-specdojo",
    );
  });

  it("未知domainがあれば部分生成せずエラーにする", () => {
    const { catalogPath, templatesPath } = fixture();
    writeTemplate(templatesPath, "alpha");

    const result = runScaffold({
      catalogPath,
      templatesPath,
      size: "large",
      projectId: "prj-0001",
      force: false,
      domains: ["alpha", "missing"],
    });

    expect(result.errors[0]).toContain("Unknown --domain: missing");
    expect(readdirSync(catalogPath)).toEqual([]);
  });

  it("未解決placeholderの成果物を除外し、IDを警告する", () => {
    const { catalogPath, templatesPath } = fixture();
    writeTemplate(templatesPath, "alpha");

    const result = runScaffold({
      catalogPath,
      templatesPath,
      size: "large",
      projectId: "prj-0001",
      force: false,
      domains: ["alpha"],
    });

    expect(result.errors).toEqual([]);
    expect(result.warnings[0]).toContain("excluded unresolved deliverables: doc-_TERM_");
    expect(existsSync(join(catalogPath, "dct-alpha.yaml"))).toBe(true);
    const output = load(
      readFileSync(join(catalogPath, "dct-alpha.yaml"), "utf8"),
    ) as DctTemplateDoc;
    expect(output.groups).toEqual([]);
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

  it("deliverables[] の recipe / sample / template 宣言を受け付けない", () => {
    const validator = buildValidator("docs/specdojo/schemas/v1/dct.schema.yaml");
    const data = load(readFileSync(resolve(files[0]!), "utf8")) as Record<string, unknown>;
    const groups = data.groups as Array<{ deliverables?: Array<Record<string, unknown>> }>;
    const deliverable = groups.find((group) => group.deliverables?.length)?.deliverables?.[0];
    expect(deliverable).toBeDefined();
    deliverable!.recipe = "not-needed";

    expect(validator(data)).toBe(false);
    expect(formatErrors(validator.errors)).toContain("additional properties");
  });
});
