import { afterEach, describe, expect, it, vi } from "vitest";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { load } from "js-yaml";
import fg from "fast-glob";
import { buildValidator, formatErrors } from "../helpers/schema.js";
import { flattenTemplateFrontmatter } from "../../src/template-frontmatter.js";
import {
  type RegisterAddFields,
  PJR_ID_RE,
  type PjrItem,
  type RegisterPaths,
  extractTableHeading,
  generatePjrId,
  generateDerivedViewFiles,
  injectRegisterRows,
  injectViewSlots,
  loadRegisterItems,
  parsePjrIndex,
  parseTicketFilename,
  planRegisterItem,
  planRenumber,
  renumberPjrItem,
  renumberReferences,
  renumberTicketContent,
  ticketTopicFromFilename,
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
  "| ID | Status | Title | Description | Type | Priority | Owner | Registered | Due | Completed | Conclusion | Ticket |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  "| PJR-0001 | open | first | desc | todo | high | ARC | 2026-01-01 | 2026-01-01 | - | - | - |",
  "",
  "## 2. Derived Views",
  "",
  "| ID | should-not | be | parsed | x | x | x | x | x | x | x | x |",
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

const DEFAULT_ADD_FIELDS: RegisterAddFields = {
  type: "todo",
  title: "登録項目",
  description: "_TODO_",
  priority: "medium",
  status: "open",
  owner: "_TODO_",
  registeredAt: "2026-08-09T12:00:00Z",
  due: "_TODO_",
  completedAt: "-",
  conclusion: "-",
};

describe("PJR-ID の乱数衝突救済", () => {
  it("既存 ID またはブロックリストに衝突した候補は再抽選する", () => {
    const candidates = ["PJR-0001", "PJR-DAMN", "PJR-AB12"];
    let index = 0;

    expect(generatePjrId(["PJR-0001"], () => candidates[index++])).toBe("PJR-AB12");
  });

  it("作成時に既存 ID を明示した場合は書き込み前に拒否する", () => {
    expect(() =>
      planRegisterItem({
        existingIds: ["PJR-AB12"],
        explicitId: "PJR-AB12",
        fields: DEFAULT_ADD_FIELDS,
        topic: "sample",
      }),
    ).toThrow(/ID already exists in the project register: PJR-AB12/);
  });

  it("採番済み ID を避けた個票ファイル名を返す", () => {
    const result = planRegisterItem({
      existingIds: ["PJR-0001"],
      fields: DEFAULT_ADD_FIELDS,
      topic: "sample",
    });

    expect(result.assignedId).toMatch(PJR_ID_RE);
    expect(result.assignedId).not.toBe("PJR-0001");
    expect(result.ticketFilename).toBe(`${result.assignedId.toLowerCase()}-sample.md`);
  });
});

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
    const items = parsePjrIndex(EN_PJR_INDEX, "UTC");

    expect(items).toHaveLength(1);
    expect(items[0].id).toBe("PJR-0001");
    expect(items[0].status).toBe("open");
    expect(items[0].owner).toBe("ARC");
    // 登録日列（Owner と Due の間）を正しい位置から読み取り、暦日へ 21:00 を補って日時にする。
    expect(items[0].registeredAt).toBe("2026-01-01T21:00:00Z");
    expect(items[0].due).toBe("2026-01-01");
  });

  it("章 2 以降のテーブル行は解釈しない", () => {
    const items = parsePjrIndex(EN_PJR_INDEX, "UTC");

    expect(items.map((it) => it.id)).toEqual(["PJR-0001"]);
  });
});

describe("extractTableHeading — 見出し行を pjr-index から採用", () => {
  it("章 1 テーブルの見出し行と区切り行を返す", () => {
    const heading = extractTableHeading(EN_PJR_INDEX);

    expect(heading.header).toBe(
      "| ID | Status | Title | Description | Type | Priority | Owner | Registered | Due | Completed | Conclusion | Ticket |",
    );
    expect(heading.separator).toBe(
      "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    );
  });

  it("登録項目一覧テーブルが無い場合は文脈付きで失敗する", () => {
    const content = "# Project Register\n\n## 1. Registered Items\n\n本文のみ\n";

    expect(() => extractTableHeading(content)).toThrow(
      /header row not found in the register list source/,
    );
  });
});

describe("injectRegisterRows — 一覧 template へ行を差し込む", () => {
  it("章 1 テーブルの区切り行直後へ行を挿入し、後続の章を保持する", () => {
    const rows = ["| PJR-0002 | open | b |", "| PJR-0003 | open | c |"];

    const actual = injectRegisterRows(EN_PJR_INDEX, rows);

    const lines = actual.split("\n");
    const separatorIndex = lines.findIndex((line) => /^\|\s*---/.test(line));
    expect(lines.slice(separatorIndex + 1, separatorIndex + 3)).toEqual(rows);
    expect(actual).toContain("## 2. Derived Views");
  });

  it("行が空でもテーブル構造を壊さない", () => {
    const actual = injectRegisterRows(EN_PJR_INDEX, []);

    expect(actual).toBe(EN_PJR_INDEX);
  });

  it("章 1 のテーブルが無い template は文脈付きで失敗する", () => {
    const content = "# Project Register\n\n## 1. Registered Items\n\n本文のみ\n";

    expect(() => injectRegisterRows(content, ["| PJR-0001 |"])).toThrow(
      /Register table not found in template: pjr-index-template.md/,
    );
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
      "  rulebook: specdojo:pjr-rulebook",
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
    registeredAt: "_TODO_",
    due: "-",
    completedAt: "2026-07-26T12:00:00Z",
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
      "  rulebook: specdojo:pjr-rulebook",
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
        registerDateTimeZone: "UTC",
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

  it.each([
    ["インラインコード", "プレースホルダ記法 `_TODO_` を説明する。"],
    ["バッククォートのフェンスコード", "```md\n_TODO_\n```"],
    ["チルダのフェンスコード", "~~~md\n_TODO_\n~~~"],
  ])("close 相当: %s 内の _TODO_ は無視して ready へ昇格する", (_label, body) => {
    withTempRepo((paths, ticketPath) => {
      writeFileSync(ticketPath, buildTicket("draft", body), "utf8");
      const item = makeItem("[pjr-0001-topic](./pjr-0001-topic.md)");

      updateTicketStatusForItem({ paths, item, targetStatus: "ready", dryRun: false });

      expect(readFileSync(ticketPath, "utf8")).toContain("  status: ready");
    });
  });

  it("警告: コード範囲の外にも _TODO_ が残る場合は draft を保つ", () => {
    withTempRepo((paths, ticketPath) => {
      const original = buildTicket("draft", "記法 `_TODO_` の説明。\n\n対応結果: _TODO_");
      writeFileSync(ticketPath, original, "utf8");
      const item = makeItem("[pjr-0001-topic](./pjr-0001-topic.md)");

      updateTicketStatusForItem({ paths, item, targetStatus: "ready", dryRun: false });

      expect(readFileSync(ticketPath, "utf8")).toBe(original);
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

describe("loadRegisterItems — 個票正本と未移行行の解決", () => {
  const buildIndex = (rows: string[]): string =>
    [
      "# Project Register",
      "",
      "## 1. Registered Items",
      "",
      "<!-- prettier-ignore -->",
      "| ID | Status | Title | Description | Type | Priority | Owner | Registered | Due | Completed | Conclusion | Ticket |",
      "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
      ...rows,
      "",
    ].join("\n");

  const buildTicket = (id: string, extraFields: string[]): string =>
    [
      "---",
      "specdojo:",
      `  id: prj-0001:${id.toLowerCase()}-topic`,
      "  type: project",
      "  status: draft",
      "  rulebook: specdojo:pjr-rulebook",
      "  item_type: todo",
      ...extraFields.map((line) => `  ${line}`),
      "---",
      "",
      `# ${id} 個票のタイトル`,
      "",
      "## 1. 概要",
      "",
      "個票本文の説明。",
      "",
    ].join("\n");

  const withRegisterDir = (fn: (paths: RegisterPaths, dir: string) => void): void => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-register-load-"));
    try {
      const paths: RegisterPaths = {
        projectId: "prj-0001",
        projectRegisterPath: dir,
        pjrIndexPath: join(dir, "pjr-index.md"),
        generatedPath: join(dir, "generated"),
        controlsGeneratedPath: join(dir, "generated"),
        registerDateTimeZone: "UTC",
      };
      fn(paths, dir);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  };

  it("登録項目フィールドを持つ個票を正本として採用し、pjr-index の行より優先する", () => {
    withRegisterDir((paths, dir) => {
      writeFileSync(
        join(dir, "pjr-ab12-topic.md"),
        buildTicket("PJR-AB12", [
          "item_status: review",
          "priority: high",
          "owner: ARC",
          'registered_at: "2026-08-01T12:00:00Z"',
        ]),
        "utf8",
      );
      writeFileSync(
        paths.pjrIndexPath,
        buildIndex([
          "| PJR-AB12 | open | 旧タイトル | 旧説明 | todo | low | PO | 2026-01-01 | - | - | - | - |",
        ]),
        "utf8",
      );

      const views = loadRegisterItems(paths);

      expect(views).toHaveLength(1);
      expect(views[0].source).toBe("ticket");
      expect(views[0].ticketPath).toBe(join(dir, "pjr-ab12-topic.md"));
      expect(views[0].item.status).toBe("review");
      expect(views[0].item.title).toBe("個票のタイトル");
      expect(views[0].item.priority).toBe("high");
    });
  });

  it("未移行の個票は pjr-index の行を値とし、書き込み先として個票パスを持つ", () => {
    withRegisterDir((paths, dir) => {
      writeFileSync(join(dir, "pjr-ab12-topic.md"), buildTicket("PJR-AB12", []), "utf8");
      writeFileSync(
        paths.pjrIndexPath,
        buildIndex([
          "| PJR-AB12 | waiting | 行タイトル | 行説明 | todo | low | PO | 2026-01-01 | - | - | - | [pjr-ab12-topic](./pjr-ab12-topic.md) |",
        ]),
        "utf8",
      );

      const views = loadRegisterItems(paths);

      expect(views[0].source).toBe("index");
      expect(views[0].item.status).toBe("waiting");
      expect(views[0].item.title).toBe("行タイトル");
      expect(views[0].ticketPath).toBe(join(dir, "pjr-ab12-topic.md"));
    });
  });

  it("個票が無い行も一覧に残し、ID 昇順で返す", () => {
    withRegisterDir((paths, dir) => {
      writeFileSync(
        join(dir, "pjr-zz99-topic.md"),
        buildTicket("PJR-ZZ99", ["item_status: open", "priority: medium"]),
        "utf8",
      );
      writeFileSync(
        paths.pjrIndexPath,
        buildIndex([
          "| PJR-CD34 | open | 行のみ | 説明 | todo | medium | ARC | 2026-01-01 | - | - | - | - |",
        ]),
        "utf8",
      );

      const views = loadRegisterItems(paths);

      expect(views.map((view) => view.id)).toEqual(["PJR-CD34", "PJR-ZZ99"]);
      expect(views[0].ticketPath).toBeUndefined();
      expect(views[1].source).toBe("ticket");
    });
  });
});

describe("generateDerivedViewFiles — 個票を入力とする生成ビュー", () => {
  const buildTicket = (id: string, title: string, extraFields: string[]): string =>
    [
      "---",
      "specdojo:",
      `  id: prj-0001:${id.toLowerCase()}-topic`,
      "  type: project",
      "  status: draft",
      "  rulebook: specdojo:pjr-rulebook",
      "  item_type: todo",
      ...extraFields.map((line) => `  ${line}`),
      "---",
      "",
      `# ${id} ${title}`,
      "",
      "## 1. 概要",
      "",
      "個票本文の説明。",
      "",
    ].join("\n");

  const withRegisterDir = (fn: (paths: RegisterPaths, dir: string) => void): void => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-register-views-"));
    try {
      const paths: RegisterPaths = {
        projectId: "prj-0001",
        projectRegisterPath: join(dir, "project-register"),
        pjrIndexPath: join(dir, "project-register", "pjr-index.md"),
        generatedPath: join(dir, "project-register", "generated"),
        controlsGeneratedPath: join(dir, "generated"),
        registerDateTimeZone: "UTC",
      };
      mkdirSync(paths.projectRegisterPath, { recursive: true });
      fn(paths, paths.projectRegisterPath);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  };

  // 個票のみ（pjr-index.md なし）で一覧が生成できることが、一覧を生成物へ移す前提になる。
  const writeTwoTickets = (dir: string): void => {
    writeFileSync(
      join(dir, "pjr-zz99-topic.md"),
      buildTicket("PJR-ZZ99", "後の項目", [
        "item_status: open",
        "priority: low",
        "owner: PO",
        'registered_at: "2026-08-02T15:00:00Z"',
      ]),
      "utf8",
    );
    writeFileSync(
      join(dir, "pjr-ab12-topic.md"),
      buildTicket("PJR-AB12", "先の項目", [
        "item_status: review",
        "priority: high",
        "owner: ARC",
        'registered_at: "2026-08-01T12:00:00Z"',
      ]),
      "utf8",
    );
  };

  const findView = (views: { path: string; content: string }[], fileName: string): string => {
    const view = views.find((candidate) => candidate.path.endsWith(fileName));
    if (!view) throw new Error(`生成ビューが見つかりません: ${fileName}`);
    return view.content;
  };

  it("pjr-index.md が無くても個票から一覧を generated/ へ生成する", () => {
    withRegisterDir((paths, dir) => {
      writeTwoTickets(dir);

      const views = generateDerivedViewFiles(paths, "register");

      expect(views.map((view) => view.path)).toEqual([
        join(paths.generatedPath, "pjr-index.md"),
        join(paths.generatedPath, "pjr-views-by-status.md"),
        join(paths.generatedPath, "pjr-views-by-priority.md"),
        join(paths.generatedPath, "pjr-views-by-owner.md"),
      ]);
      expect(existsSync(paths.pjrIndexPath)).toBe(false);
    });
  });

  it("一覧の行は ID 昇順で、個票リンクを generated/ 起点へ付け替える", () => {
    withRegisterDir((paths, dir) => {
      writeTwoTickets(dir);

      const content = findView(generateDerivedViewFiles(paths, "register"), "pjr-index.md");

      const rows = content.split("\n").filter((line) => line.startsWith("| PJR-"));
      expect(rows).toHaveLength(2);
      expect(rows[0]).toContain("| PJR-AB12 | review | 先の項目 |");
      expect(rows[0]).toContain("[pjr-ab12-topic](../pjr-ab12-topic.md)");
      expect(rows[1]).toContain("| PJR-ZZ99 | open | 後の項目 |");
    });
  });

  it("同一入力から同一出力を返す（生成が決定的）", () => {
    withRegisterDir((paths, dir) => {
      writeTwoTickets(dir);

      const first = generateDerivedViewFiles(paths, "all");
      const second = generateDerivedViewFiles(paths, "all");

      expect(second).toEqual(first);
    });
  });

  it("controls スコープでは登録簿一覧を生成しない", () => {
    withRegisterDir((paths, dir) => {
      writeTwoTickets(dir);

      const views = generateDerivedViewFiles(paths, "controls");

      expect(views.some((view) => view.path.endsWith(join("generated", "pjr-index.md")))).toBe(
        false,
      );
    });
  });

  it("登録項目が無い場合は列見出しだけの一覧を生成する", () => {
    withRegisterDir((paths) => {
      const content = findView(generateDerivedViewFiles(paths, "register"), "pjr-index.md");

      expect(content).toContain("## 1. 登録項目一覧");
      expect(content.split("\n").filter((line) => line.startsWith("| PJR-"))).toEqual([]);
      expect(content).toContain("specdojo register build");
    });
  });
});

describe("ticketTopicFromFilename — 個票ファイル名から topic を取り出す", () => {
  it("ID 接頭辞に一致する場合は topic を返す", () => {
    expect(ticketTopicFromFilename("PJR-0137", "pjr-0137-register-id-uniqueness.md")).toBe(
      "register-id-uniqueness",
    );
  });

  it("ID 接頭辞と一致しない場合は undefined を返す", () => {
    expect(ticketTopicFromFilename("PJR-0137", "pjr-0099-other.md")).toBeUndefined();
  });
});

describe("renumberTicketContent — 個票本文の再採番", () => {
  it("frontmatter の doc id と H1 の表示 ID を新しい ID へ更新する", () => {
    const content = [
      "---",
      "specdojo:",
      "  id: prj-0001:pjr-0137-register-id-uniqueness",
      "  type: project",
      "---",
      "",
      "# PJR-0137 pjr-indexの重複ID検知と再採番",
      "",
      "本文。",
      "",
    ].join("\n");

    const updated = renumberTicketContent(
      content,
      "PJR-0137",
      "PJR-0140",
      "register-id-uniqueness",
    );

    expect(updated).toContain("  id: prj-0001:pjr-0140-register-id-uniqueness");
    expect(updated).toContain("# PJR-0140 pjr-indexの重複ID検知と再採番");
    expect(updated).not.toContain("pjr-0137");
    expect(updated).not.toContain("# PJR-0137 ");
  });
});

describe("renumberReferences — 参照リンク・targets の doc id 置換", () => {
  it("wikilink と targets に含まれる doc id を置き換え、changed を返す", () => {
    const content = [
      "targets:",
      "  - prj-0001:pjr-0137-register-id-uniqueness",
      "",
      "詳細は [[prj-0001:pjr-0137-register-id-uniqueness|一意性]] を参照。",
    ].join("\n");

    const { content: updated, changed } = renumberReferences(
      content,
      "prj-0001:pjr-0137-register-id-uniqueness",
      "prj-0001:pjr-0140-register-id-uniqueness",
    );

    expect(changed).toBe(true);
    expect(updated).not.toContain("pjr-0137");
    expect(updated).toContain("- prj-0001:pjr-0140-register-id-uniqueness");
    expect(updated).toContain("[[prj-0001:pjr-0140-register-id-uniqueness|一意性]]");
  });

  it("doc id を含まない場合は変更なしで changed=false を返す", () => {
    const content = "無関係な本文";
    const { content: updated, changed } = renumberReferences(
      content,
      "prj-0001:pjr-0137-register-id-uniqueness",
      "prj-0001:pjr-0140-register-id-uniqueness",
    );

    expect(changed).toBe(false);
    expect(updated).toBe(content);
  });
});

describe("planRenumber / renumberPjrItem — 再採番の一括更新", () => {
  const buildIndex = (rows: string[]): string =>
    [
      "# Project Register",
      "",
      "## 1. Registered Items",
      "",
      "<!-- prettier-ignore -->",
      "| ID | Status | Title | Description | Type | Priority | Owner | Registered | Due | Completed | Conclusion | Ticket |",
      "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
      ...rows,
      "",
    ].join("\n");

  const ticketBody = (id: string): string =>
    [
      "---",
      "specdojo:",
      "  id: prj-0001:pjr-0137-register-id-uniqueness",
      "  type: project",
      "  status: draft",
      "---",
      "",
      `# ${id} pjr-indexの重複ID検知と再採番`,
      "",
      "本文。",
      "",
    ].join("\n");

  // specdojoRootDir() が temp を指すよう cwd を切り替える。参照走査を temp 内に閉じる。
  const withTempRepo = (
    fn: (paths: RegisterPaths, root: string) => void,
    indexRows: string[] = [
      "| PJR-0137 | open | dup | - | todo | medium | ARC | _TODO_ | - | - | - | [pjr-0137-register-id-uniqueness](./pjr-0137-register-id-uniqueness.md) |",
    ],
  ): void => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-renumber-"));
    const originalCwd = process.cwd();
    try {
      mkdirSync(join(root, ".git"), { recursive: true });
      const registerDir = join(root, "docs/ja/projects/prj-0001/controls/project-register");
      mkdirSync(registerDir, { recursive: true });
      writeFileSync(join(registerDir, "pjr-index.md"), buildIndex(indexRows), "utf8");
      writeFileSync(
        join(registerDir, "pjr-0137-register-id-uniqueness.md"),
        ticketBody("PJR-0137"),
        "utf8",
      );
      const paths: RegisterPaths = {
        projectId: "prj-0001",
        projectRegisterPath: registerDir,
        pjrIndexPath: join(registerDir, "pjr-index.md"),
        generatedPath: join(registerDir, "generated"),
        controlsGeneratedPath: join(root, "docs/ja/projects/prj-0001/controls/generated"),
        registerDateTimeZone: "UTC",
      };
      process.chdir(root);
      fn(paths, root);
    } finally {
      process.chdir(originalCwd);
      rmSync(root, { recursive: true, force: true });
    }
  };

  it("plan がインデックス行・個票リネーム・参照 targets の更新を含む", () => {
    withTempRepo((paths, root) => {
      const planDir = join(root, "docs/ja/projects/prj-0001/execution/exec/plans");
      mkdirSync(planDir, { recursive: true });
      const planPath = join(planDir, "foo-plan.md");
      writeFileSync(
        planPath,
        ["targets:", "  - prj-0001:pjr-0137-register-id-uniqueness", ""].join("\n"),
        "utf8",
      );

      const plan = planRenumber(paths, "PJR-0137", "PJR-0140");

      expect(plan.ticketRename?.from).toBe(
        join(paths.projectRegisterPath, "pjr-0137-register-id-uniqueness.md"),
      );
      expect(plan.ticketRename?.to).toBe(
        join(paths.projectRegisterPath, "pjr-0140-register-id-uniqueness.md"),
      );

      const indexWrite = plan.writes.find((w) => w.path === paths.pjrIndexPath);
      expect(indexWrite?.content).toContain("| PJR-0140 | open | dup |");
      expect(indexWrite?.content).toContain("[pjr-0140-register-id-uniqueness]");
      expect(indexWrite?.content).not.toContain("PJR-0137");

      const ticketWrite = plan.writes.find((w) => w.path === plan.ticketRename?.to);
      expect(ticketWrite?.content).toContain("  id: prj-0001:pjr-0140-register-id-uniqueness");

      const planWrite = plan.writes.find((w) => w.path === planPath);
      expect(planWrite?.content).toContain("- prj-0001:pjr-0140-register-id-uniqueness");
    });
  });

  it("再採番先の ID が既に使われている場合は何も書き換えずにエラーで終了する", () => {
    withTempRepo(
      (paths) => {
        expect(() => planRenumber(paths, "PJR-0137", "PJR-0140")).toThrow(
          /Target ID already exists/,
        );
      },
      [
        "| PJR-0137 | open | dup | - | todo | medium | ARC | _TODO_ | - | - | - | [pjr-0137-register-id-uniqueness](./pjr-0137-register-id-uniqueness.md) |",
        "| PJR-0140 | open | other | desc | todo | medium | ARC | _TODO_ | - | - | - | - |",
      ],
    );
  });

  it("dry-run では何も書き換えず、個票ファイルが元のまま残る", () => {
    withTempRepo((paths) => {
      const stdout = vi.spyOn(process.stdout, "write").mockReturnValue(true);

      renumberPjrItem({ paths, fromId: "PJR-0137", toId: "PJR-0140", dryRun: true });

      expect(
        existsSync(join(paths.projectRegisterPath, "pjr-0137-register-id-uniqueness.md")),
      ).toBe(true);
      expect(
        existsSync(join(paths.projectRegisterPath, "pjr-0140-register-id-uniqueness.md")),
      ).toBe(false);
      const printed = stdout.mock.calls.some((call) =>
        String(call[0]).includes("Would renumber PJR-0137 → PJR-0140"),
      );
      expect(printed).toBe(true);
      vi.restoreAllMocks();
    });
  });

  it("同じ ID への再採番はエラーになる", () => {
    withTempRepo((paths) => {
      expect(() =>
        renumberPjrItem({ paths, fromId: "PJR-0137", toId: "PJR-0137", dryRun: true }),
      ).toThrow(/must differ/);
    });
  });
});
