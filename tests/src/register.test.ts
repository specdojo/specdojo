import { afterEach, describe, expect, it, vi } from "vitest";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { load } from "js-yaml";
import fg from "fast-glob";
import { buildValidator, formatErrors } from "../helpers/schema.js";
import { flattenTemplateFrontmatter } from "../../src/template-frontmatter.js";
import {
  type PjrItem,
  type RegisterPaths,
  extractTableHeading,
  injectViewSlots,
  parsePjrIndex,
  parseTicketFilename,
  updateTicketFrontmatterStatus,
  updateTicketStatusForItem,
} from "../../src/register.js";

// 章番号アンカーと見出し流用が言語非依存であることを固定する。
// 見出し文言・列名を英語にしても、章 1 を登録項目一覧として解釈できることを検証する。
const EN_PJR_INDEX = [
  "# Project Register",
  "",
  "## 1. Registered Items",
  "",
  "<!-- prettier-ignore -->",
  "| ID | Status | Title | Description | Type | Priority | Owner | Due | Completed | Conclusion | Ticket |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  "| PJR-0001 | open | first | desc | todo | high | ARC | 2026-01-01 | - | - | - |",
  "",
  "## 2. Derived Views",
  "",
  "| ID | should-not | be | parsed | x | x | x | x | x | x | x |",
].join("\n");

function extractFrontmatter(content: string, filePath: string): string {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error(`frontmatter が見つかりません: ${filePath}`);
  return match[1];
}

function applySubstitutions(text: string, subs: Array<[string, string]>): string {
  return subs.reduce((acc, [from, to]) => acc.replaceAll(from, to), text);
}

// register add が生成するファイルのプレースホルダと同じ置換ルール
const PJR_SUBSTITUTIONS: Array<[string, string]> = [
  ["_PJR_DOCUMENT_ID_", "prj-test-0001:pjr-0001-sample-topic"],
  ["_PROJECT_ID_", "prj-test-0001"],
];

const PJR_FILES = fg
  .sync("docs/ja/specdojo/templates/pjr-*-template.md", { onlyFiles: true })
  .sort();

describe("register add — pjr テンプレート frontmatter スキーマ適合検証", () => {
  it.each(PJR_FILES)(
    "%s の生成物 frontmatter が deliverable-frontmatter スキーマに適合する",
    (filePath) => {
      const validator = buildValidator(
        "docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml",
      );
      const raw = readFileSync(resolve(filePath), "utf8");
      // テンプレート自身の frontmatter ではなく、生成物形（frontmatter_template を
      // 展開した出力 Frontmatter）を検証する。register が実際に生成する形に一致する。
      const flattened = flattenTemplateFrontmatter(raw);
      const data = load(
        applySubstitutions(extractFrontmatter(flattened, filePath), PJR_SUBSTITUTIONS),
      ) as Record<string, unknown>;

      expect(validator(data), formatErrors(validator.errors)).toBe(true);
      if (raw.includes("_PJR_DOCUMENT_ID_")) {
        expect(data).toMatchObject({
          specdojo: {
            id: "prj-test-0001:pjr-0001-sample-topic",
            part_of: ["prj-test-0001:pjr-index"],
          },
        });
        expect(flattened).not.toContain("## 1. 基本情報");
      }
    },
  );
});

describe("parsePjrIndex — 章番号アンカーの言語非依存", () => {
  it("見出し文言が英語でも章 1 のテーブルを解釈する", () => {
    const items = parsePjrIndex(EN_PJR_INDEX);

    expect(items).toHaveLength(1);
    expect(items[0].id).toBe("PJR-0001");
    expect(items[0].status).toBe("open");
    expect(items[0].owner).toBe("ARC");
  });

  it("章 2 以降のテーブル行は解釈しない", () => {
    const items = parsePjrIndex(EN_PJR_INDEX);

    expect(items.map((it) => it.id)).toEqual(["PJR-0001"]);
  });
});

describe("extractTableHeading — 見出し行を pjr-index から採用", () => {
  it("章 1 テーブルの見出し行と区切り行を返す", () => {
    const heading = extractTableHeading(EN_PJR_INDEX);

    expect(heading.header).toBe(
      "| ID | Status | Title | Description | Type | Priority | Owner | Due | Completed | Conclusion | Ticket |",
    );
    expect(heading.separator).toBe(
      "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    );
  });

  it("登録項目一覧テーブルが無い場合は文脈付きで失敗する", () => {
    const content = "# Project Register\n\n## 1. Registered Items\n\n本文のみ\n";

    expect(() => extractTableHeading(content)).toThrow(/header row not found in pjr-index.md/);
  });
});

describe("injectViewSlots — 派生ビュー template の slot 差し込み", () => {
  it("slot 行を周囲の空行を保ったまま置換する", () => {
    const template = "# View\n\n## 1. 状態別\n\n<!-- specdojo:view-slot=by-status -->\n";

    const actual = injectViewSlots(template, { "by-status": "### 1.1. open\n\n| a |" });

    expect(actual).toBe("# View\n\n## 1. 状態別\n\n### 1.1. open\n\n| a |\n");
  });

  it("template に無い slot を指定すると失敗する", () => {
    const template = "# View\n\n<!-- specdojo:view-slot=table -->\n";

    expect(() => injectViewSlots(template, { table: "x", missing: "y" })).toThrow(
      /View-slot not found in template: missing/,
    );
  });

  it("template の未知 slot は失敗する", () => {
    const template = "# View\n\n<!-- specdojo:view-slot=unknown -->\n";

    expect(() => injectViewSlots(template, { table: "x" })).toThrow(
      /Unknown view-slot in template: unknown/,
    );
  });
});

describe("parseTicketFilename — 個票セルからファイル名を取り出す", () => {
  it("相対リンクセルからファイル名を返す", () => {
    const cell = "[pjr-0001-auth-boundary](./pjr-0001-auth-boundary.md)";

    expect(parseTicketFilename(cell)).toBe("pjr-0001-auth-boundary.md");
  });

  it("個票なし（`-`）は undefined を返す", () => {
    expect(parseTicketFilename("-")).toBeUndefined();
  });
});

describe("updateTicketFrontmatterStatus — 個票 Frontmatter の status 書き換え", () => {
  const ticket = (status: string): string =>
    [
      "---",
      "specdojo:",
      "  id: prj-0001:pjr-0001-topic",
      "  type: project",
      `  status: ${status}`,
      "  rulebook: pjr-rulebook",
      "---",
      "",
      "# PJR-0001 タイトル",
      "",
      "本文",
      "",
    ].join("\n");

  it("draft を ready へ書き換え、本文を保持する", () => {
    const result = updateTicketFrontmatterStatus(ticket("draft"), "ready");

    expect(result.changed).toBe(true);
    expect(result.content).toContain("  status: ready");
    expect(result.content).not.toContain("  status: draft");
    expect(result.content).toContain("# PJR-0001 タイトル");
  });

  it("既に目的の status なら changed=false で内容を変えない", () => {
    const input = ticket("ready");
    const result = updateTicketFrontmatterStatus(input, "ready");

    expect(result.changed).toBe(false);
    expect(result.content).toBe(input);
  });

  it("frontmatter が無い場合は文脈付きで失敗する", () => {
    expect(() => updateTicketFrontmatterStatus("# 見出しのみ\n", "ready")).toThrow(
      /frontmatter not found/,
    );
  });
});

describe("updateTicketStatusForItem — close / reject に伴う個票 status 遷移", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const makeItem = (ticketCell: string): PjrItem => ({
    id: "PJR-0001",
    status: "done",
    title: "t",
    description: "d",
    type: "todo",
    priority: "medium",
    owner: "ARC",
    due: "-",
    completed: "2026-07-26",
    conclusion: "-",
    ticket: ticketCell,
  });

  const buildTicket = (status: string, body: string): string =>
    [
      "---",
      "specdojo:",
      "  id: prj-0001:pjr-0001-topic",
      "  type: project",
      `  status: ${status}`,
      "  rulebook: pjr-rulebook",
      "---",
      "",
      "# PJR-0001 タイトル",
      "",
      body,
      "",
    ].join("\n");

  const withTempRepo = (fn: (paths: RegisterPaths, ticketPath: string) => void): void => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-ticket-"));
    try {
      const paths: RegisterPaths = {
        projectId: "prj-0001",
        projectRegisterPath: dir,
        pjrIndexPath: join(dir, "pjr-index.md"),
        generatedPath: join(dir, "generated"),
        controlsGeneratedPath: join(dir, "generated"),
      };
      const ticketPath = join(dir, "pjr-0001-topic.md");
      fn(paths, ticketPath);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  };

  it("close 相当: 必須節に _TODO_ が無ければ ready へ昇格する", () => {
    withTempRepo((paths, ticketPath) => {
      writeFileSync(ticketPath, buildTicket("draft", "対応結果を記述済み"), "utf8");
      const item = makeItem("[pjr-0001-topic](./pjr-0001-topic.md)");

      updateTicketStatusForItem({ paths, item, targetStatus: "ready", dryRun: false });

      expect(readFileSync(ticketPath, "utf8")).toContain("  status: ready");
    });
  });

  it("警告: 本文に _TODO_ が残る場合は ready へ昇格せず draft を保つ", () => {
    withTempRepo((paths, ticketPath) => {
      const original = buildTicket("draft", "対応結果: _TODO_");
      writeFileSync(ticketPath, original, "utf8");
      const item = makeItem("[pjr-0001-topic](./pjr-0001-topic.md)");
      const stdout = vi.spyOn(process.stdout, "write").mockReturnValue(true);

      updateTicketStatusForItem({ paths, item, targetStatus: "ready", dryRun: false });

      expect(readFileSync(ticketPath, "utf8")).toBe(original);
      const warned = stdout.mock.calls.some((call) =>
        String(call[0]).includes("unresolved _TODO_"),
      );
      expect(warned).toBe(true);
    });
  });

  it("reject 相当: _TODO_ が残っていても deprecated へ更新する", () => {
    withTempRepo((paths, ticketPath) => {
      writeFileSync(ticketPath, buildTicket("draft", "対応結果: _TODO_"), "utf8");
      const item = makeItem("[pjr-0001-topic](./pjr-0001-topic.md)");

      updateTicketStatusForItem({ paths, item, targetStatus: "deprecated", dryRun: false });

      expect(readFileSync(ticketPath, "utf8")).toContain("  status: deprecated");
    });
  });

  it("個票なし（個票列が `-`）はエラーにならず何も書き換えない", () => {
    withTempRepo((paths) => {
      const item = makeItem("-");

      expect(() =>
        updateTicketStatusForItem({ paths, item, targetStatus: "ready", dryRun: false }),
      ).not.toThrow();
    });
  });

  it("dry-run では個票を書き換えず、変更予定を表示する", () => {
    withTempRepo((paths, ticketPath) => {
      const original = buildTicket("draft", "対応結果を記述済み");
      writeFileSync(ticketPath, original, "utf8");
      const item = makeItem("[pjr-0001-topic](./pjr-0001-topic.md)");
      const stdout = vi.spyOn(process.stdout, "write").mockReturnValue(true);

      updateTicketStatusForItem({ paths, item, targetStatus: "ready", dryRun: true });

      expect(readFileSync(ticketPath, "utf8")).toBe(original);
      const previewed = stdout.mock.calls.some((call) =>
        String(call[0]).includes("Would update ticket status → ready"),
      );
      expect(previewed).toBe(true);
    });
  });
});
