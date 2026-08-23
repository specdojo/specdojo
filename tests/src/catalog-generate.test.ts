import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { load } from "js-yaml";
import { runGenerate } from "../../src/catalog-generate.js";

// A self-contained fixture: a catalog dir (dct-*.yaml), a templates dir, and an
// output repo root, all under a fresh temp directory so the real repo is untouched.
type Fixture = { dir: string; catalogPath: string; templatesPath: string; repoRoot: string };

let fx: Fixture;

async function makeFixture(): Promise<Fixture> {
  const dir = await mkdtemp(path.join(tmpdir(), "catalog-generate-"));
  const catalogPath = path.join(dir, "catalog");
  const templatesPath = path.join(dir, "templates");
  const repoRoot = path.join(dir, "root");
  mkdirSync(catalogPath, { recursive: true });
  mkdirSync(templatesPath, { recursive: true });
  mkdirSync(repoRoot, { recursive: true });
  return { dir, catalogPath, templatesPath, repoRoot };
}

function writeCatalog(fixture: Fixture, body: string): void {
  writeFileSync(path.join(fixture.catalogPath, "dct-demo.yaml"), body, "utf8");
}

function run(fixture: Fixture, force = false, dryRun = false, dctNames: string[] = []) {
  return runGenerate({
    catalogPath: fixture.catalogPath,
    templatesPath: fixture.templatesPath,
    repoRoot: fixture.repoRoot,
    projectId: null,
    force,
    dryRun,
    dctNames,
  });
}

function writeNamedCatalog(fixture: Fixture, fileName: string, body: string): void {
  writeFileSync(path.join(fixture.catalogPath, fileName), body, "utf8");
}

function catalogWith(domain: string, localId: string): string {
  return `id: prjx:dct-${domain}
type: project
status: draft
project_id: prjx
domain: ${domain}
base_path: /out
groups:
  - deliverables:
      - local_id: ${localId}
        name: ${localId}
        kind: work
        overview: 概要
        path: ${localId}.md
`;
}

function outPath(fixture: Fixture, rel: string): string {
  return path.join(fixture.repoRoot, "out", rel);
}

const CATALOG_ONE_WORK_MD = `id: prjx:dct-demo
type: project
status: draft
project_id: prjx
domain: demo
base_path: /out
groups:
  - deliverables:
      - local_id: prj-charter
        name: プロジェクト憲章
        kind: work
        depends_on: [prj-overview]
        overview: プロジェクトの正式な認可と権限委譲を文書化
        path: prj-charter.md
        rulebook: specdojo:prj-charter-rulebook
`;

beforeEach(async () => {
  fx = await makeFixture();
});

afterEach(async () => {
  await rm(fx.dir, { recursive: true, force: true });
});

describe("runGenerate — テンプレートがない成果物", () => {
  it("カタログ情報から Frontmatter・H1・overview・_TODO_ を持つ Markdown 雛形を生成する", () => {
    writeCatalog(fx, CATALOG_ONE_WORK_MD);

    const result = run(fx);

    expect(result.errors).toEqual([]);
    expect(result.written).toEqual(["out/prj-charter.md"]);

    const content = readFileSync(outPath(fx, "prj-charter.md"), "utf8");
    expect(content).toContain("id: prjx:prj-charter");
    expect(content).toContain("type: project");
    expect(content).toContain("status: draft");
    expect(content).toContain("rulebook: specdojo:prj-charter-rulebook");
    expect(content).toContain("based_on:");
    expect(content).toContain("- prjx:prj-overview");
    expect(content).toContain("# プロジェクト憲章");
    expect(content).toContain("プロジェクトの正式な認可と権限委譲を文書化");
    expect(content).toContain("_TODO_: 本文を記述する");
  });

  it("YAML 成果物にはメタ情報のみの YAML 雛形を生成する", () => {
    writeCatalog(
      fx,
      `id: prjx:dct-demo
type: project
status: draft
project_id: prjx
domain: demo
base_path: /out
groups:
  - deliverables:
      - local_id: pm-roles
        name: 役割定義
        kind: work
        overview: ロール定義
        path: pm-roles.yaml
        rulebook: specdojo:pm-roles-rulebook
`,
    );

    const result = run(fx);

    expect(result.written).toEqual(["out/pm-roles.yaml"]);
    const doc = load(readFileSync(outPath(fx, "pm-roles.yaml"), "utf8"));
    expect(doc).toEqual({
      id: "prjx:pm-roles",
      type: "project",
      status: "draft",
      rulebook: "specdojo:pm-roles-rulebook",
    });
  });

  it("rulebook が undecided の場合は生成物へ未判断値を転記しない", () => {
    writeCatalog(
      fx,
      `id: prjx:dct-demo
type: project
status: draft
project_id: prjx
domain: demo
base_path: /out
groups:
  - deliverables:
      - local_id: undecided-md
        name: 未判断 Markdown
        kind: work
        overview: rulebook の要否が未判断
        path: undecided-md.md
        rulebook: undecided
      - local_id: undecided-yaml
        name: 未判断 YAML
        kind: work
        overview: rulebook の要否が未判断
        path: undecided-yaml.yaml
        rulebook: undecided
`,
    );

    const result = run(fx);

    expect(result.errors).toEqual([]);
    expect(readFileSync(outPath(fx, "undecided-md.md"), "utf8")).not.toContain("rulebook:");
    expect(load(readFileSync(outPath(fx, "undecided-yaml.yaml"), "utf8"))).toEqual({
      id: "prjx:undecided-yaml",
      type: "project",
      status: "draft",
    });
  });
});

describe("runGenerate — テンプレートがある成果物", () => {
  it("Markdown テンプレートを平坦化し _PROJECT_ID_ を置換、記入プレースホルダは残す", () => {
    writeCatalog(fx, CATALOG_ONE_WORK_MD);
    writeFileSync(
      path.join(fx.templatesPath, "prj-charter-template.md"),
      `---
specdojo:
  id: specdojo:prj-charter-template
  type: template
  status: draft
  frontmatter_template:
    specdojo:
      id: _PROJECT_ID_:prj-charter
      type: project
      status: ready
      rulebook: specdojo:prj-charter-rulebook
---

# プロジェクト憲章: _PROJECT_NAME_

_TODO_: 本文を記述する。
`,
      "utf8",
    );

    const result = run(fx);

    expect(result.written).toEqual(["out/prj-charter.md"]);
    const content = readFileSync(outPath(fx, "prj-charter.md"), "utf8");
    // frontmatter_template が生成物 Frontmatter へ平坦化されている
    expect(content).toContain("  id: prjx:prj-charter");
    expect(content).toContain("  status: ready");
    expect(content).not.toContain("frontmatter_template");
    expect(content).not.toContain("id: specdojo:prj-charter-template");
    // 生成時プレースホルダは置換、記入プレースホルダは温存
    expect(content).not.toContain("_PROJECT_ID_");
    expect(content).toContain("_PROJECT_NAME_");
    expect(content).toContain("_TODO_: 本文を記述する。");
  });

  it("YAML テンプレートの metadata_template を展開し _PROJECT_ID_ を置換する", () => {
    writeCatalog(
      fx,
      `id: prjx:dct-demo
type: project
status: draft
project_id: prjx
domain: demo
base_path: /out
groups:
  - deliverables:
      - local_id: pm-roles
        name: 役割定義
        kind: work
        overview: ロール定義
        path: pm-roles.yaml
        rulebook: specdojo:pm-roles-rulebook
`,
    );
    writeFileSync(
      path.join(fx.templatesPath, "pm-roles-template.yaml"),
      `id: specdojo:pm-roles-template
type: template
status: draft
metadata_template:
  id: _PROJECT_ID_:pm-roles
  type: project
  status: draft
  rulebook: specdojo:pm-roles-rulebook
roles:
  - id: _ROLE_ID_
    project_id: _PROJECT_ID_
`,
      "utf8",
    );

    const result = run(fx);

    expect(result.written).toEqual(["out/pm-roles.yaml"]);
    const doc = load(readFileSync(outPath(fx, "pm-roles.yaml"), "utf8")) as Record<string, unknown>;
    expect(doc.id).toBe("prjx:pm-roles");
    expect(doc).not.toHaveProperty("metadata_template");
    // 本文（roles）は保持し、_PROJECT_ID_ のみ置換、記入プレースホルダは温存
    expect(doc.roles).toEqual([{ id: "_ROLE_ID_", project_id: "prjx" }]);
  });
});

describe("runGenerate — 生成対象の絞り込みと上書き防止", () => {
  it("kind が work 以外（control / generated）の成果物は生成しない", () => {
    writeCatalog(
      fx,
      `id: prjx:dct-demo
type: project
status: draft
project_id: prjx
domain: demo
base_path: /out
groups:
  - deliverables:
      - local_id: pjr-index
        name: 登録簿
        kind: control
        overview: 登録簿
        path: pjr-index.md
      - local_id: pjr-open
        name: 未完一覧
        kind: generated
        overview: 生成ビュー
        path: pjr-open.md
`,
    );

    const result = run(fx);

    expect(result.written).toEqual([]);
    expect(existsSync(outPath(fx, "pjr-index.md"))).toBe(false);
    expect(existsSync(outPath(fx, "pjr-open.md"))).toBe(false);
  });

  it("既存ファイルは上書きせず skip し、--force で上書きする", () => {
    writeCatalog(fx, CATALOG_ONE_WORK_MD);
    const target = outPath(fx, "prj-charter.md");
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, "既存の本文", "utf8");

    const first = run(fx);
    expect(first.written).toEqual([]);
    expect(first.skipped).toEqual(["out/prj-charter.md"]);
    expect(readFileSync(target, "utf8")).toBe("既存の本文");

    const forced = run(fx, true);
    expect(forced.written).toEqual(["out/prj-charter.md"]);
    expect(readFileSync(target, "utf8")).not.toBe("既存の本文");
  });

  it("--dry-run では書き込まず生成予定のみ報告する", () => {
    writeCatalog(fx, CATALOG_ONE_WORK_MD);

    const result = run(fx, false, true);

    expect(result.written).toEqual(["out/prj-charter.md"]);
    expect(existsSync(outPath(fx, "prj-charter.md"))).toBe(false);
  });
});

describe("runGenerate — dct フィルタ", () => {
  beforeEach(() => {
    writeNamedCatalog(
      fx,
      "dct-project-definition.yaml",
      catalogWith("project-definition", "prj-charter"),
    );
    writeNamedCatalog(
      fx,
      "dct-project-management.yaml",
      catalogWith("project-management", "pm-plan"),
    );
  });

  it("--dct 指定時は該当 dct のみ生成する", () => {
    const result = run(fx, false, false, ["project-definition"]);

    expect(result.written).toEqual(["out/prj-charter.md"]);
    expect(existsSync(outPath(fx, "pm-plan.md"))).toBe(false);
  });

  it("dct- プレフィックスや .yaml 付きの指定も一致する", () => {
    const result = run(fx, false, false, ["dct-project-management.yaml"]);

    expect(result.written).toEqual(["out/pm-plan.md"]);
  });

  it("複数指定で複数 dct を対象にできる", () => {
    const result = run(fx, false, false, ["project-definition", "project-management"]);

    expect(result.written).toEqual(["out/prj-charter.md", "out/pm-plan.md"]);
  });

  it("一致する dct が無い場合はエラーを返し何も生成しない", () => {
    const result = run(fx, false, false, ["nope"]);

    expect(result.written).toEqual([]);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toMatch(/No dct-\*\.yaml matches: nope/);
    expect(existsSync(outPath(fx, "prj-charter.md"))).toBe(false);
  });
});

describe("runGenerate — 入力の不備", () => {
  it("dct-*.yaml が無い場合はエラーを返す", () => {
    const result = run(fx);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toMatch(/No dct-\*\.yaml files found/);
  });
});
