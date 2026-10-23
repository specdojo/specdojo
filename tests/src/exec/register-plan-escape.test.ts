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
  const configPath = path.join(specdojoRootDir(), ".markdownlint.yaml");
  const parsed = load(readFileSync(configPath, "utf8"));
  return typeof parsed === "object" && parsed !== null ? (parsed as Record<string, unknown>) : {};
}

function emphasisViolations(content: string): string[] {
  const results = lint({ strings: { doc: content }, config: loadMarkdownlintConfig() });
  return (results.doc ?? [])
    .filter((issue) => (issue.ruleNames ?? []).some((n) => n === "MD049" || n === "MD050"))
    .map((issue) => (issue.ruleNames ?? []).join("/"));
}

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
    const rulebooksPath = path.join(dir, "docs", "ja", "specdojo", "rulebooks");
    await mkdir(templatesPath, { recursive: true });
    await mkdir(rulebooksPath, { recursive: true });
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
        "  id: prj-test:test-rulebook",
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
    await mkdir(templatesPath, { recursive: true });
    await mkdir(path.join(dir, ".specdojo"), { recursive: true });
    await writeFile(
      path.join(dir, ".specdojo", "specdojo.config.json"),
      JSON.stringify({ version: 1, kata_authority: "customer", projects: {} }),
      "utf8",
    );
    await writeFile(path.join(dir, "package.json"), '{"name":"customer"}\n', "utf8");
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
    const catalogPath = await writeCatalog();
    const ticket = await writeTicket();
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

  it("approach の有無によらず、共通の規約は参照パスと要点だけを本文に載せる", async () => {
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
  });

  it("kata maintenance approach は指定した kata id を直接の編集対象にする", async () => {
    const outPath = path.join(dir, "plan-with-kata-approach.md");
    await writeKataFixture();
    const catalogPath = await writeCatalog("prj-test:test-rulebook");
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
        targets: ["prj-test:test-rulebook"],
        ticket,
      }),
      stem: "xep-pjr-test",
      outPath,
    });

    const content = await readFile(outPath, "utf8");

    expect(content).toContain("origin: register");
    expect(content).toContain("approach: rulebook-maintenance");
    expect(content).toContain("targets:\n    - prj-test:test-rulebook");
    expect(content).toContain("docs/ja/specdojo/rulebooks/test-rulebook.md");
    expect(content).toContain("register-specific criterion is satisfied");
  });

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
    expect(content).toContain("手本の成果物は読み取り専用");
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
