import { afterEach, describe, expect, it, vi } from "vitest";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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
    // 登録日列（Owner と Due の間）を正しい位置から読み取る。
    expect(items[0].registered).toBe("2026-01-01");
    expect(items[0].due).toBe("2026-01-01");
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
      "| ID | Status | Title | Description | Type | Priority | Owner | Registered | Due | Completed | Conclusion | Ticket |",
    );
    expect(heading.separator).toBe(
      "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
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
    registered: "_TODO_",
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
