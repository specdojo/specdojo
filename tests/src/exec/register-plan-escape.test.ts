import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { lint } from "markdownlint/sync";
import { load } from "js-yaml";
import { escapeMarkdownInline, inlineCodeAnglePlaceholders } from "../../../src/exec/shared.js";
import { generateRegisterPlan } from "../../../src/exec/register.js";
import { specdojoRootDir } from "../../../src/shared/specdojo-config.js";
import type { PjrItem } from "../../../src/register/register.js";
import type { RegisterPaths } from "../../../src/register/register.js";

// PJR-0XXZ の close 時に実際に破損した種類の自由記述。アンダースコア入り識別子と
// `_TODO_` / `_ASSUMPTION_` プレースホルダを生のまま含む。
const PROBLEMATIC_DESCRIPTION =
  "run.register_date_timezone を導入する。値が未設定の場合は _TODO_ とし、" +
  "既定は my_default_value を採用する（_ASSUMPTION_）。";
const originalCwd = process.cwd();
const originalPackageRoot = process.env.SPECDOJO_PACKAGE_ROOT;
const specdojoSourceRoot = specdojoRootDir();

function loadMarkdownlintConfig(): Record<string, unknown> {
  const configPath = path.join(specdojoSourceRoot, ".markdownlint.yaml");
  const parsed = load(readFileSync(configPath, "utf8"));
  return typeof parsed === "object" && parsed !== null ? (parsed as Record<string, unknown>) : {};
}

function ruleViolations(content: string, ruleNames: readonly string[]): string[] {
  const results = lint({ strings: { doc: content }, config: loadMarkdownlintConfig() });
  return (results.doc ?? [])
    .filter((issue) => (issue.ruleNames ?? []).some((n) => ruleNames.includes(n)))
    .map((issue) => `${issue.lineNumber}: ${(issue.ruleNames ?? []).join("/")}`);
}

function emphasisViolations(content: string): string[] {
  return ruleViolations(content, ["MD049", "MD050"]).map((issue) => issue.replace(/^\d+: /, ""));
}

const KATA_KINDS = ["rulebook", "recipe", "sample", "template"] as const;

describe("escapeMarkdownInline", () => {
  it("アンダースコア入り識別子を code span で包んで強調記号化を防ぐ", () => {
    expect(escapeMarkdownInline("register_date_timezone")).toBe("`register_date_timezone`");
  });

  it("マルチバイト文字はトークン境界となり巻き込まない", () => {
    expect(escapeMarkdownInline("既定はmy_default_valueを採用")).toBe(
      "既定は`my_default_value`を採用",
    );
  });

  it("`_TODO_` プレースホルダも code span 化する", () => {
    expect(escapeMarkdownInline("未設定は _TODO_ とする")).toBe("未設定は `_TODO_` とする");
  });

  it("アスタリスクを含むトークンも code span 化する", () => {
    expect(escapeMarkdownInline("a*b")).toBe("`a*b`");
  });

  it("既存のバッククォート code span は温存し二重化しない", () => {
    expect(escapeMarkdownInline("識別子 `register_date_timezone` を使う")).toBe(
      "識別子 `register_date_timezone` を使う",
    );
  });

  it("山括弧プレースホルダは連結範囲ごと code span 化する", () => {
    expect(escapeMarkdownInline("dct-<domain>.yaml と prefix-<term>-suffix")).toBe(
      "`dct-<domain>.yaml` と `prefix-<term>-suffix`",
    );
  });

  it("既存の複数バッククォート code span も温存する", () => {
    expect(escapeMarkdownInline("``dct-<domain>.yaml`` と <phase>.")).toBe(
      "``dct-<domain>.yaml`` と `<phase>`.",
    );
  });

  it("`_` / `*` を含まない ASCII や日本語は変化しない", () => {
    expect(escapeMarkdownInline("普通の説明文 PJR-TEST です")).toBe("普通の説明文 PJR-TEST です");
  });
});

describe("inlineCodeAnglePlaceholders", () => {
  it("register build と plan 生成で共有する変換が再適用しても安定する", () => {
    const once = inlineCodeAnglePlaceholders("dct-<domain>.yaml と <phase>.");

    expect(once).toBe("`dct-<domain>.yaml` と `<phase>`.");
    expect(inlineCodeAnglePlaceholders(once)).toBe(once);
  });

  it("HTTP(S) autolink は山括弧プレースホルダとしてコード化しない", () => {
    const value = "homepage は <https://specdojo.org>。";

    expect(inlineCodeAnglePlaceholders(value)).toBe(value);
  });
});

describe("generateRegisterPlan の Markdown 安全性", () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "specdojo-register-plan-"));
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    if (originalPackageRoot === undefined) delete process.env.SPECDOJO_PACKAGE_ROOT;
    else process.env.SPECDOJO_PACKAGE_ROOT = originalPackageRoot;
    await rm(dir, { recursive: true, force: true });
  });

  function makeItem(overrides: Partial<PjrItem> = {}): PjrItem {
    return {
      id: "PJR-TEST",
      status: "open",
      title: "register_date_timezone の _TODO_ を解消する",
      description: PROBLEMATIC_DESCRIPTION,
      type: "todo",
      priority: "medium",
      owner: "ARC",
      registeredAt: "2026-08-08T12:00:00Z",
      due: "2026-08-31",
      completedAt: "-",
      conclusion: "-",
      ticket: "-",
      ...overrides,
    };
  }

  function makeRegisterPaths(): RegisterPaths {
    const registerDir = path.join(dir, "register");
    return {
      projectId: "prj-test",
      projectRegisterPath: registerDir,
      pjrIndexPath: path.join(registerDir, "pjr-index.md"),
      generatedPath: path.join(dir, "generated"),
      controlsGeneratedPath: path.join(dir, "controls-generated"),
      registerDateTimeZone: "UTC",
    };
  }

  async function writeCatalog(rulebook = "specdojo:pjr-rulebook"): Promise<string> {
    const catalogPath = path.join(dir, "catalog");
    await mkdir(catalogPath, { recursive: true });
    await writeFile(
      path.join(catalogPath, "dct-test.yaml"),
      [
        "id: dct-test",
        "type: project",
        "status: draft",
        "project_id: prj-test",
        "domain: test",
        "base_path: docs/test",
        "groups:",
        "  - name: test",
        "    deliverables:",
        "      - local_id: overview",
        "        name: Test Overview",
        "        kind: work",
        "        overview: Test deliverable overview.",
        "        path: overview.md",
        `        rulebook: ${rulebook}`,
        "        done_criteria:",
        "          - text: catalog criterion is satisfied",
        "            roles: [ARC]",
        "",
      ].join("\n"),
      "utf8",
    );
    return catalogPath;
  }

  async function writeTicket(): Promise<string> {
    const registerPath = makeRegisterPaths().projectRegisterPath;
    await mkdir(registerPath, { recursive: true });
    const filename = "pjr-test-approach.md";
    await writeFile(
      path.join(registerPath, filename),
      [
        "# PJR-TEST approach plan",
        "",
        "## 1. 概要",
        "",
        "Test overview.",
        "",
        "## 2. 完了条件",
        "",
        "- register-specific criterion is satisfied",
        "",
        "## 3. 作業内容",
        "",
        "- test",
        "",
      ].join("\n"),
      "utf8",
    );
    return `[pjr-test-approach](./${filename})`;
  }

  async function writeKataFixture(): Promise<void> {
    const templatesPath = path.join(dir, "docs", "ja", "specdojo", "exec-templates");
    const rulebooksPath = path.join(dir, "docs", "ja", "specdojo", "rulebooks", "customer");
    await mkdir(templatesPath, { recursive: true });
    await mkdir(rulebooksPath, { recursive: true });
    await mkdir(path.join(dir, ".specdojo"), { recursive: true });
    await writeFile(
      path.join(dir, ".specdojo", "specdojo.config.json"),
      JSON.stringify({ version: 1, kata_authority: "customer", projects: {} }),
      "utf8",
    );
    for (const filename of [
      "xep-common-conventions-template.md",
      "xep-rulebook-maintenance-template.md",
    ]) {
      await writeFile(
        path.join(templatesPath, filename),
        await readFile(
          path.join(specdojoSourceRoot, "docs", "ja", "specdojo", "exec-templates", filename),
          "utf8",
        ),
        "utf8",
      );
    }
    await writeFile(
      path.join(rulebooksPath, "test-rulebook.md"),
      [
        "---",
        "specdojo:",
        "  id: customer:test-rulebook",
        "  type: rulebook",
        "  status: draft",
        "---",
        "",
        "# Test Rulebook",
        "",
      ].join("\n"),
      "utf8",
    );
  }

  async function writeAuthoringFixture(): Promise<void> {
    const templatesPath = path.join(dir, "docs", "ja", "specdojo", "exec-templates");
    const deliverablesPath = path.join(dir, "docs", "test");
    await mkdir(templatesPath, { recursive: true });
    await mkdir(deliverablesPath, { recursive: true });
    await mkdir(path.join(dir, ".specdojo"), { recursive: true });
    await writeFile(
      path.join(dir, ".specdojo", "specdojo.config.json"),
      JSON.stringify({ version: 1, kata_authority: "customer", projects: {} }),
      "utf8",
    );
    await writeFile(path.join(dir, "package.json"), '{"name":"customer"}\n', "utf8");
    await writeFile(
      path.join(deliverablesPath, "overview.md"),
      [
        "---",
        "specdojo:",
        "  id: prj-test:overview",
        "  type: project",
        "  status: draft",
        "---",
        "",
        "# Test Overview",
        "",
      ].join("\n"),
      "utf8",
    );
    for (const filename of [
      "xep-common-conventions-template.md",
      "xep-rulebook-authoring-template.md",
      "xep-recipe-authoring-template.md",
    ]) {
      await writeFile(
        path.join(templatesPath, filename),
        await readFile(
          path.join(specdojoSourceRoot, "docs", "ja", "specdojo", "exec-templates", filename),
          "utf8",
        ),
        "utf8",
      );
    }
  }

  it("アンダースコア入り識別子や _TODO_ を含む項目でも MD049/MD050 違反を出さない", async () => {
    const outPath = path.join(dir, "plan.md");
    await generateRegisterPlan({
      executionPath: path.join(dir, "execution"),
      projectId: "prj-test",
      registerPaths: makeRegisterPaths(),
      item: makeItem(),
      stem: "xep-pjr-test",
      outPath,
    });

    const content = await readFile(outPath, "utf8");

    expect(content).toContain("`register_date_timezone`");
    expect(emphasisViolations(content)).toEqual([]);
  });

  it("title と description の山括弧プレースホルダをコード化し、再生成しても二重化しない", async () => {
    const outPath = path.join(dir, "plan.md");
    const input = {
      executionPath: path.join(dir, "execution"),
      projectId: "prj-test",
      registerPaths: makeRegisterPaths(),
      item: makeItem({
        title: "prefix-<term>-suffix を扱う",
        description: "`dct-<domain>.yaml` と sch-track-<track>.yaml を確認し、末尾は <phase>.",
      }),
      stem: "xep-pjr-test",
      outPath,
    };

    await generateRegisterPlan(input);
    const first = await readFile(outPath, "utf8");
    await generateRegisterPlan(input);
    const second = await readFile(outPath, "utf8");

    expect(first).toContain('name: "prefix-<term>-suffix を扱う"');
    expect(first).toContain("# Edit Plan: PJR-TEST `prefix-<term>-suffix` を扱う");
    expect(first).toContain("`dct-<domain>.yaml`");
    expect(first).toContain("`sch-track-<track>.yaml`");
    expect(first).toContain("`<phase>`.");
    expect(first).not.toContain("``dct-<domain>.yaml``");
    expect(second).toBe(first);
  });

  it("エスケープ前の生の説明文は MD049/MD050 違反を起こす（回帰の根拠）", () => {
    // 修正前の埋め込み（生の自由記述をそのまま本文へ挿入）を再現し、
    // エスケープが違反回避に効いていることを対照として示す。
    const rawBody = ["# 見出し", "", PROBLEMATIC_DESCRIPTION, "", "*強調* テキスト", ""].join("\n");

    expect(emphasisViolations(rawBody).length).toBeGreaterThan(0);
  });

  it("個票が targets を宣言していれば plan frontmatter に targets が含まれる", async () => {
    const outPath = path.join(dir, "plan-with-targets.md");
    await generateRegisterPlan({
      executionPath: path.join(dir, "execution"),
      projectId: "prj-test",
      registerPaths: makeRegisterPaths(),
      item: makeItem({
        targets: ["prj-test:cdfd-overview", "prj-test:cdfd-check"],
      }),
      stem: "xep-pjr-test",
      outPath,
    });

    const content = await readFile(outPath, "utf8");

    expect(content).toContain("targets:");
    expect(content).toContain("  - prj-test:cdfd-overview");
    expect(content).toContain("  - prj-test:cdfd-check");
    expect(content).toContain("origin: register");
  });

  it("成果物 approach は schedule と同じテンプレートに DCT と個票の完了条件を載せる", async () => {
    const outPath = path.join(dir, "plan-with-item-approach.md");
    // 対象検証の索引走査を temp 内へ閉じ込め、package 側への探索も fixture に限定する。
    // schedule と共有する実テンプレートは必要なファイルだけを読み込む。
    await mkdir(path.join(dir, ".specdojo"), { recursive: true });
    await writeFile(
      path.join(dir, ".specdojo", "specdojo.config.json"),
      JSON.stringify({ version: 1, projects: {} }),
      "utf8",
    );
    for (const relativePath of [
      "exec-templates/xep-common-conventions-template.md",
      "exec-templates/xep-fully-guided-template.md",
      "rulebooks/pjr-rulebook.md",
    ]) {
      const targetPath = path.join(dir, "docs/ja/specdojo", relativePath);
      await mkdir(path.dirname(targetPath), { recursive: true });
      await writeFile(
        targetPath,
        await readFile(path.join(specdojoSourceRoot, "docs/ja/specdojo", relativePath), "utf8"),
        "utf8",
      );
    }
    const catalogPath = await writeCatalog();
    const ticket = await writeTicket();
    process.env.SPECDOJO_PACKAGE_ROOT = dir;
    process.chdir(dir);
    await generateRegisterPlan({
      executionPath: path.join(dir, "execution"),
      projectId: "prj-test",
      catalogPath,
      registerPaths: makeRegisterPaths(),
      item: makeItem({
        approach: "fully-guided",
        targets: ["prj-test:overview"],
        ticket,
      }),
      stem: "xep-pjr-test",
      outPath,
    });

    const content = await readFile(outPath, "utf8");

    expect(content).toContain("origin: register");
    expect(content).toContain("approach: fully-guided");
    expect(content).toContain("targets:\n    - prj-test:overview");
    expect(content).toContain("# Edit Plan: PJR-TEST");
    expect(content).toContain("Test Overview");
    expect(content).toContain("catalog criterion is satisfied");
    expect(content).toContain("## 個票の追加完了条件");
    expect(content).toContain("register-specific criterion is satisfied");
  });

  it("autopilot 承認済みの項目だけ plan に夜間実行の制約を載せる", async () => {
    const approvedOutPath = path.join(dir, "plan-approved.md");
    await generateRegisterPlan({
      executionPath: path.join(dir, "execution"),
      projectId: "prj-test",
      registerPaths: makeRegisterPaths(),
      item: makeItem({ autopilot: "approved" }),
      stem: "xep-pjr-approved",
      outPath: approvedOutPath,
    });
    const unapprovedOutPath = path.join(dir, "plan-unapproved.md");
    await generateRegisterPlan({
      executionPath: path.join(dir, "execution"),
      projectId: "prj-test",
      registerPaths: makeRegisterPaths(),
      item: makeItem(),
      stem: "xep-pjr-unapproved",
      outPath: unapprovedOutPath,
    });

    expect(await readFile(approvedOutPath, "utf8")).toContain("### 夜間 autopilot の制約");
    expect(await readFile(unapprovedOutPath, "utf8")).not.toContain("### 夜間 autopilot の制約");
  });

  it("autopilot の承認の有無によらず、plan に空行が 2 行以上続かない", async () => {
    // 実リポジトリの plan は .prettierignore で整形対象外のため、Prettier が空行をまとめない
    // 条件をそろえる。
    await writeFile(path.join(dir, ".prettierignore"), "*.md\n", "utf8");
    const outputs: string[] = [];
    for (const [stem, item] of [
      ["xep-pjr-blank-approved", makeItem({ autopilot: "approved" })],
      ["xep-pjr-blank-unapproved", makeItem()],
    ] as const) {
      const outPath = path.join(dir, `${stem}.md`);
      await generateRegisterPlan({
        executionPath: path.join(dir, "execution"),
        projectId: "prj-test",
        registerPaths: makeRegisterPaths(),
        item,
        stem,
        outPath,
      });
      outputs.push(await readFile(outPath, "utf8"));
    }

    for (const content of outputs) {
      expect(content).not.toMatch(/\n{3,}/);
      const results = lint({ strings: { doc: content }, config: loadMarkdownlintConfig() });
      const md012 = (results.doc ?? []).filter((issue) =>
        (issue.ruleNames ?? []).includes("MD012"),
      );
      expect(md012).toEqual([]);
    }
  });

  // generateRegisterPlan を 2 回呼ぶ。カタログ付きの 2 回目が約 1.5 秒かかり、単独で約 1.6 秒、
  // 変換キャッシュがない負荷時は 6.5 秒を観測した（PJR-SNHK）。既定の 5 秒に余裕がないため、この test に限って 30 秒へ広げる。
  it(
    "approach の有無によらず、共通の規約は参照パスと要点だけを本文に載せる",
    { timeout: 30_000 },
    async () => {
      const referencePath = "docs/ja/specdojo/exec-templates/xep-common-conventions-template.md";
      const plainOutPath = path.join(dir, "plan-plain.md");
      await generateRegisterPlan({
        executionPath: path.join(dir, "execution"),
        projectId: "prj-test",
        registerPaths: makeRegisterPaths(),
        item: makeItem(),
        stem: "xep-pjr-plain",
        outPath: plainOutPath,
      });
      const approachOutPath = path.join(dir, "plan-approach.md");
      await generateRegisterPlan({
        executionPath: path.join(dir, "execution"),
        projectId: "prj-test",
        catalogPath: await writeCatalog(),
        registerPaths: makeRegisterPaths(),
        item: makeItem({ approach: "fully-guided", targets: ["prj-test:overview"] }),
        stem: "xep-pjr-approach",
        outPath: approachOutPath,
      });

      for (const outPath of [plainOutPath, approachOutPath]) {
        const content = await readFile(outPath, "utf8");
        expect(content, outPath).toContain(`共通の規約の詳細 \`${referencePath}\` を読み`);
        expect(content, outPath).toContain("`[[id|title]]` 形式");
        expect(content, outPath).not.toContain("全件を1回だけ実行して対象限定の実行を省く");
        expect(content, outPath).not.toContain("| 変更したファイル");
        expect(content, outPath).not.toContain("plan-essentials:");
      }
    },
  );

  it("kata maintenance approach は指定した kata id を直接の編集対象にする", async () => {
    const outPath = path.join(dir, "plan-with-kata-approach.md");
    await writeKataFixture();
    const catalogPath = await writeCatalog("customer:test-rulebook");
    const ticket = await writeTicket();
    process.env.SPECDOJO_PACKAGE_ROOT = dir;
    process.chdir(dir);
    await generateRegisterPlan({
      executionPath: path.join(dir, "execution"),
      projectId: "prj-test",
      catalogPath,
      registerPaths: makeRegisterPaths(),
      item: makeItem({
        approach: "rulebook-maintenance",
        targets: ["customer:test-rulebook"],
        ticket,
      }),
      stem: "xep-pjr-test",
      outPath,
    });

    const content = await readFile(outPath, "utf8");

    expect(content).toContain("origin: register");
    expect(content).toContain("approach: rulebook-maintenance");
    expect(content).toContain("targets:\n    - customer:test-rulebook");
    expect(content).toContain("docs/ja/specdojo/rulebooks/customer/test-rulebook.md");
    expect(content).toContain("register-specific criterion is satisfied");
  });

  it.each(["project", "sample"])(
    "sample-maintenance の個票から type: %s の sample の plan を生成する",
    async (type) => {
      await writeKataFixture();
      const templatesPath = path.join(dir, "docs/ja/specdojo/exec-templates");
      await writeFile(
        path.join(templatesPath, "xep-sample-maintenance-template.md"),
        await readFile(
          path.join(
            specdojoSourceRoot,
            "docs/ja/specdojo/exec-templates/xep-sample-maintenance-template.md",
          ),
          "utf8",
        ),
        "utf8",
      );
      const samplePath = "docs/ja/kata/samples/test-sample.md";
      await mkdir(path.dirname(path.join(dir, samplePath)), { recursive: true });
      await writeFile(
        path.join(dir, samplePath),
        `---\nspecdojo:\n  id: customer:test-sample\n  type: ${type}\n  status: draft\n  rulebook: customer:test-rulebook\n---\n\n# Test Sample\n`,
        "utf8",
      );
      const ticket = await writeTicket();
      process.env.SPECDOJO_PACKAGE_ROOT = dir;
      process.chdir(dir);
      const outPath = path.join(dir, "sample-plan.md");
      await generateRegisterPlan({
        executionPath: path.join(dir, "execution"),
        projectId: "prj-test",
        registerPaths: makeRegisterPaths(),
        item: makeItem({
          approach: "sample-maintenance",
          targets: ["customer:test-sample"],
          ticket,
        }),
        stem: "xep-pjr-sample",
        outPath,
      });
      const content = await readFile(outPath, "utf8");
      expect(content).toContain("origin: register");
      expect(content).toContain("approach: sample-maintenance");
      expect(content).toContain("targets:\n    - customer:test-sample");
      expect(content).toContain(samplePath);
      expect(content).toContain("register-specific criterion is satisfied");
    },
  );

  it("kata authoring approach は新規 id、配置、標準、手本、参照更新条件を plan に載せる", async () => {
    const outPath = path.join(dir, "plan-with-authoring-approach.md");
    await writeAuthoringFixture();
    const catalogPath = await writeCatalog("undecided");
    process.env.SPECDOJO_PACKAGE_ROOT = dir;
    process.chdir(dir);

    await generateRegisterPlan({
      executionPath: path.join(dir, "execution"),
      projectId: "prj-test",
      catalogPath,
      registerPaths: makeRegisterPaths(),
      item: makeItem({
        approach: "rulebook-authoring",
        targets: ["customer:test-rulebook", "prj-test:overview"],
      }),
      stem: "xep-pjr-authoring",
      outPath,
    });

    const content = await readFile(outPath, "utf8");
    expect(content).toContain("approach: rulebook-authoring");
    expect(content).toContain("docs/ja/specdojo/rulebooks/customer/test-rulebook.md");
    expect(content).toContain("specdojo:rulebook-authoring-standard");
    expect(content).toContain("`prj-test:overview`: Test Overview");
    expect(content).toContain("手本ファイルは読み取り専用");
    expect(content).toContain("`undecided` または未記入");
    expect(content).toContain("すでに別の kata を指す場合は上書きせず");
  });

  it("recipe authoring は手本 rulebook の not-needed を未判断として扱わない", async () => {
    const outPath = path.join(dir, "plan-with-recipe-authoring-approach.md");
    await writeAuthoringFixture();
    const rulebooksPath = path.join(dir, "docs", "ja", "specdojo", "rulebooks");
    await mkdir(rulebooksPath, { recursive: true });
    await writeFile(
      path.join(rulebooksPath, "test-rulebook.md"),
      [
        "---",
        "specdojo:",
        "  id: specdojo:test-rulebook",
        "  type: rulebook",
        "  status: draft",
        "  recipe: not-needed",
        "---",
        "",
      ].join("\n"),
      "utf8",
    );
    const catalogPath = await writeCatalog("specdojo:test-rulebook");
    process.env.SPECDOJO_PACKAGE_ROOT = dir;
    process.chdir(dir);

    await generateRegisterPlan({
      executionPath: path.join(dir, "execution"),
      projectId: "prj-test",
      catalogPath,
      registerPaths: makeRegisterPaths(),
      item: makeItem({
        approach: "recipe-authoring",
        targets: ["customer:test-recipe", "prj-test:overview"],
      }),
      stem: "xep-pjr-recipe-authoring",
      outPath,
    });

    const content = await readFile(outPath, "utf8");
    expect(content).toContain("現在の参照: `not-needed`");
    expect(content).toContain("`not-needed` も意図的な判断として上書きしない");
  });

  async function writeNoCatalogKataFixture(): Promise<void> {
    const templatesPath = path.join(dir, "docs", "ja", "specdojo", "exec-templates");
    await mkdir(templatesPath, { recursive: true });
    await mkdir(path.join(dir, ".specdojo"), { recursive: true });
    await writeFile(
      path.join(dir, ".specdojo", "specdojo.config.json"),
      JSON.stringify({ version: 1, kata_authority: "customer", projects: {} }),
      "utf8",
    );
    await writeFile(path.join(dir, "package.json"), '{"name":"customer"}\n', "utf8");
    const filenames = ["xep-common-conventions-template.md"];
    for (const kind of KATA_KINDS) {
      filenames.push(`xep-${kind}-maintenance-template.md`, `xep-${kind}-authoring-template.md`);
      const kataDir = path.join(dir, "docs", "ja", "specdojo", `${kind}s`, "customer");
      await mkdir(kataDir, { recursive: true });
      await writeFile(
        path.join(kataDir, `test-${kind}.md`),
        [
          "---",
          "specdojo:",
          `  id: customer:test-${kind}`,
          `  type: ${kind}`,
          "  status: draft",
          "---",
          "",
          `# Test ${kind}`,
          "",
        ].join("\n"),
        "utf8",
      );
    }
    for (const filename of filenames) {
      await writeFile(
        path.join(templatesPath, filename),
        await readFile(
          path.join(specdojoSourceRoot, "docs", "ja", "specdojo", "exec-templates", filename),
          "utf8",
        ),
        "utf8",
      );
    }
  }

  it.each(KATA_KINDS.flatMap((kind) => [`${kind}-maintenance`, `${kind}-authoring`] as const))(
    "カタログと pm-roles のない project の %s plan は MD036 違反を出さない",
    async (approach) => {
      const outPath = path.join(dir, `plan-${approach}.md`);
      await writeNoCatalogKataFixture();
      const kind = approach.split("-")[0];
      const target = approach.endsWith("-authoring")
        ? `customer:new-${kind}`
        : `customer:test-${kind}`;
      process.env.SPECDOJO_PACKAGE_ROOT = dir;
      process.chdir(dir);

      await generateRegisterPlan({
        executionPath: path.join(dir, "execution"),
        projectId: "prj-test",
        registerPaths: makeRegisterPaths(),
        item: makeItem({ approach, targets: [target], owner: "BA" }),
        stem: `xep-pjr-${approach}`,
        outPath,
      });

      const content = await readFile(outPath, "utf8");
      expect(content).toContain(`approach: ${approach}`);
      expect(content).not.toMatch(/^_MISSING_$/m);
      expect(ruleViolations(content, ["MD036"])).toEqual([]);
    },
  );

  it("個票が targets を宣言していなければ plan frontmatter に targets が含まれない", async () => {
    const outPath = path.join(dir, "plan-without-targets.md");
    await generateRegisterPlan({
      executionPath: path.join(dir, "execution"),
      projectId: "prj-test",
      registerPaths: makeRegisterPaths(),
      item: makeItem(),
      stem: "xep-pjr-test",
      outPath,
    });

    const content = await readFile(outPath, "utf8");

    expect(content).not.toContain("targets:");
    expect(content).toContain("origin: register");
  });

  it('タイトルに特殊文字 (*_\\":#) を含む項目の plan の frontmatter が YAML として読め、元のタイトルと一致する', async () => {
    const outPath = path.join(dir, "plan-special-chars.md");
    const titleWithSpecialChars = 'タイトル * _ \\ " : # を含む';
    await generateRegisterPlan({
      executionPath: path.join(dir, "execution"),
      projectId: "prj-test",
      registerPaths: makeRegisterPaths(),
      item: makeItem({ title: titleWithSpecialChars }),
      stem: "xep-pjr-test",
      outPath,
    });

    const content = await readFile(outPath, "utf8");
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    expect(match).not.toBeNull();
    const frontmatterYaml = match![1];

    // JS-YAML で YAML として正しくパースできるか確認
    const parsed = load(frontmatterYaml) as { specdojo: { name: string } };

    // name が元のタイトルと完全に一致するか確認
    expect(parsed.specdojo.name).toBe(titleWithSpecialChars);
  });

  it("edit / investigate plan の対象項目に一覧のパスを含めず、進め方で一覧を読まないことを明示し、ステータス変更禁止の指示は維持する", async () => {
    const registerPaths = makeRegisterPaths();
    const indexPathRelative = path.relative(process.cwd(), registerPaths.pjrIndexPath);

    // 1. edit カテゴリ (todo)
    const editOutPath = path.join(dir, "plan-edit.md");
    await generateRegisterPlan({
      executionPath: path.join(dir, "execution"),
      projectId: "prj-test",
      registerPaths,
      item: makeItem({ type: "todo" }),
      stem: "xep-pjr-edit",
      outPath: editOutPath,
    });
    const editContent = await readFile(editOutPath, "utf8");
    expect(editContent).not.toContain(indexPathRelative);
    expect(editContent).not.toMatch(/- `登録簿`:/);
    expect(editContent).toContain(
      "1. 個票（存在する場合）を読み、目的・完了条件・制約を把握する。登録簿の一覧は大きいため読まない。",
    );
    expect(editContent).toContain(
      "登録簿（`pjr-index.md`）の行と個票のステータス項目は変更しない。",
    );

    // 2. investigate カテゴリ (question)
    const investigateOutPath = path.join(dir, "plan-investigate.md");
    await generateRegisterPlan({
      executionPath: path.join(dir, "execution"),
      projectId: "prj-test",
      registerPaths,
      item: makeItem({ type: "question" }),
      stem: "xep-pjr-investigate",
      outPath: investigateOutPath,
    });
    const investigateContent = await readFile(investigateOutPath, "utf8");
    expect(investigateContent).not.toContain(indexPathRelative);
    expect(investigateContent).not.toMatch(/- `登録簿`:/);
    expect(investigateContent).toContain(
      "1. 個票（存在する場合）を読み、問い・リスク内容・判断に必要な条件を把握する。登録簿の一覧は大きいため読まない。",
    );
    expect(investigateContent).toContain(
      "登録簿（`pjr-index.md`）の行と個票のステータス項目・結論列は変更しない。",
    );
  });
});
