import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { lint } from "markdownlint/sync";
import yaml from "js-yaml";
import { escapeMarkdownInline, inlineCodeAnglePlaceholders } from "../../src/exec-shared.js";
import { generateRegisterPlan } from "../../src/exec-register.js";
import { specdojoRootDir } from "../../src/specdojo-config.js";
import type { PjrItem } from "../../src/register.js";
import type { RegisterPaths } from "../../src/register.js";

// PJR-0XXZ の close 時に実際に破損した種類の自由記述。アンダースコア入り識別子と
// `_TODO_` / `_ASSUMPTION_` プレースホルダを生のまま含む。
const PROBLEMATIC_DESCRIPTION =
  "run.register_date_timezone を導入する。値が未設定の場合は _TODO_ とし、" +
  "既定は my_default_value を採用する（_ASSUMPTION_）。";

function loadMarkdownlintConfig(): Record<string, unknown> {
  const configPath = path.join(specdojoRootDir(), ".markdownlint.yaml");
  const parsed = yaml.load(readFileSync(configPath, "utf8"));
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
});

describe("generateRegisterPlan の Markdown 安全性", () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "specdojo-register-plan-"));
  });

  afterEach(async () => {
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

    expect(first).toContain('name: "`prefix-<term>-suffix` を扱う"');
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
});
