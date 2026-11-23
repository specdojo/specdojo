import { afterEach, describe, expect, it, vi } from "vitest";
import { Command } from "commander";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  pairSectionOptions,
  replaceTicketSection,
  stripSectionNumber,
  validateSectionFile,
} from "../../../src/register/section.js";
import { registerRegisterCommands } from "../../../src/register/register.js";
import {
  appendRegisterEvent,
  buildRegisterEvent,
  readRegisterEventsFromContent,
  registerEventFilePath,
} from "../../../src/register/events.js";

const REGISTER_REL = "docs/ja/projects/prj-0001/controls/project-register";

const CONFIG = {
  version: 1,
  current_project: "prj-0001",
  kata_authority: "customer",
  projects: {
    "prj-0001": {
      base_path: "docs/ja/projects/prj-0001",
      catalog_path: "010-deliverables-catalog",
      schedule_path: "schedule",
      execution_path: "execution",
      members_path: "030-project-management/pm-members.yaml",
      project_register_path: "controls/project-register",
      run: { register_date_timezone: "UTC" },
    },
  },
};

function writeActorRosters(root: string): void {
  const humanPath = join(root, "docs/ja/projects/prj-0001/030-project-management/pm-members.yaml");
  mkdirSync(join(root, "docs/ja/projects/prj-0001/030-project-management"), {
    recursive: true,
  });
  writeFileSync(
    humanPath,
    [
      "id: prj-0001:pm-members",
      "type: project",
      "status: ready",
      "title: Test members",
      "rulebook: specdojo:pm-members-rulebook",
      "version: 1",
      "project_id: prj-0001",
      "members:",
      "  - nickname: po",
      "    display_name: Project Owner",
      "    roles: [PO]",
      "    type: human",
      "",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(
    join(root, ".specdojo/agent-members.yaml"),
    [
      "version: 1",
      "members:",
      "  - nickname: codex",
      "    display_name: Codex",
      "    roles: []",
      "    type: agent",
      "    provider: codex",
      "    capabilities: []",
      "    proficiency: normal",
      "    priority: 1",
      "aliases:",
      "  - nickname: legacy-codex",
      "    alias_of: codex",
      "",
    ].join("\n"),
    "utf8",
  );
}

function buildSampleTicket(body = "概要の説明"): string {
  return [
    "---",
    "specdojo:",
    "  id: prj-0001:pjr-ab12-topic",
    "  type: project",
    "  status: draft",
    "  rulebook: specdojo:pjr-rulebook",
    "  part_of:",
    "    - prj-0001:pjr-index",
    "  item_type: todo",
    "  item_status: open",
    "  priority: medium",
    "---",
    "",
    "# PJR-AB12 テスト用タスク",
    "",
    "## 1. 概要",
    "",
    body,
    "",
    "## 2. 入力",
    "",
    "- 前提条件1",
    "",
    "## 3. 完了条件",
    "",
    "- 完了条件1",
    "- 完了条件2",
    "",
    "## 4. 作業内容",
    "",
    "| No | 作業 | 状態 |",
    "| --- | --- | --- |",
    "| 1 | 作業1 | open |",
    "",
    "## 5. 対応結果",
    "",
    "_TODO_: 完了時に結果を書く",
    "",
  ].join("\n");
}

type Fixture = { root: string; registerDir: string };

function readEvents(registerDir: string, id: string) {
  const path = registerEventFilePath(registerDir, id);
  return readRegisterEventsFromContent(readFileSync(path, "utf8"), path);
}

function writeInitialEvent(
  registerDir: string,
  id: string,
  filename: string,
  ticket: string,
): void {
  const event = buildRegisterEvent({
    afterContent: ticket,
    filename,
    timeZone: "UTC",
    action: "add",
    actor: "test",
    reason: "item added",
    ts: "2026-08-01T00:00:00Z",
  });
  if (!event) throw new Error("initial event not built");
  const path = registerEventFilePath(registerDir, id);
  mkdirSync(join(registerDir, "events"), { recursive: true });
  writeFileSync(path, appendRegisterEvent(undefined, event), "utf8");
}

function withRepo(fn: (fixture: Fixture) => Promise<void> | void): Promise<void> {
  const originalCwd = process.cwd();
  const root = mkdtempSync(join(tmpdir(), "specdojo-section-test-"));
  return (async () => {
    try {
      mkdirSync(join(root, ".specdojo"), { recursive: true });
      writeFileSync(
        join(root, ".specdojo/specdojo.config.json"),
        `${JSON.stringify(CONFIG, null, 2)}\n`,
        "utf8",
      );
      writeActorRosters(root);
      const registerDir = join(root, REGISTER_REL);
      mkdirSync(registerDir, { recursive: true });
      cpSync(
        join(originalCwd, "docs/ja/specdojo/templates"),
        join(root, "docs/ja/specdojo/templates"),
        { recursive: true },
      );
      process.chdir(root);
      await fn({ root, registerDir });
    } finally {
      process.chdir(originalCwd);
      rmSync(root, { recursive: true, force: true });
    }
  })();
}

describe("Section utility functions", () => {
  describe("stripSectionNumber", () => {
    it("見出しから先頭の番号を除去する", () => {
      expect(stripSectionNumber("1. 概要")).toBe("概要");
      expect(stripSectionNumber("2. 入力")).toBe("入力");
      expect(stripSectionNumber("3. 完了条件")).toBe("完了条件");
      expect(stripSectionNumber("4. 作業内容")).toBe("作業内容");
      expect(stripSectionNumber("10. 判定基準")).toBe("判定基準");
      expect(stripSectionNumber("3.1. 詳細")).toBe("詳細");
      expect(stripSectionNumber("3.1 詳細")).toBe("詳細");
      expect(stripSectionNumber("完了条件")).toBe("完了条件");
      expect(stripSectionNumber("  完了条件  ")).toBe("完了条件");
    });
  });

  describe("validateSectionFile", () => {
    it("見出しを含まない有効なファイルを読み込める", () => {
      const root = mkdtempSync(join(tmpdir(), "validate-section-"));
      try {
        const filePath = join(root, "valid.md");
        const content =
          "- 差し替え完了条件1\n- 差し替え完了条件2\n\n```markdown\n# コードブロック内の見出しは許容\n```\n";
        writeFileSync(filePath, content, "utf8");
        expect(validateSectionFile(filePath)).toBe(content);
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    });

    it("ファイルが存在しない場合はエラーになる", () => {
      expect(() => validateSectionFile("/non/existent/path.md")).toThrow(
        "Cannot read section file: /non/existent/path.md",
      );
    });

    it("Markdown 見出しを含むファイルはエラーになる", () => {
      const root = mkdtempSync(join(tmpdir(), "validate-section-"));
      try {
        const filePath = join(root, "invalid.md");
        writeFileSync(filePath, "本文テキスト\n\n## 不正な見出し\n\n本文2", "utf8");
        expect(() => validateSectionFile(filePath)).toThrow(
          `Section file must not contain markdown headings: ${filePath}`,
        );

        const filePathH1 = join(root, "invalid-h1.md");
        writeFileSync(filePathH1, "# 不正なH1", "utf8");
        expect(() => validateSectionFile(filePathH1)).toThrow(
          `Section file must not contain markdown headings: ${filePathH1}`,
        );
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    });
  });

  describe("replaceTicketSection", () => {
    const originalTicket = buildSampleTicket();

    it("指定した章の本文を差し替え、見出し行は残る", () => {
      const newBody = "- 新しい完了条件A\n- 新しい完了条件B";
      const result = replaceTicketSection(originalTicket, "完了条件", newBody);
      expect(result.changed).toBe(true);
      expect(result.beforeBody).toBe("- 完了条件1\n- 完了条件2");

      expect(result.content).toContain(
        "## 3. 完了条件\n\n- 新しい完了条件A\n- 新しい完了条件B\n\n## 4. 作業内容",
      );
    });

    it("末尾の章の本文を差し替えられる", () => {
      const newBody = "結果完了: すべて合格";
      const result = replaceTicketSection(originalTicket, "対応結果", newBody);
      expect(result.changed).toBe(true);
      expect(result.beforeBody).toBe("_TODO_: 完了時に結果を書く");
      expect(result.content).toContain("## 5. 対応結果\n\n結果完了: すべて合格\n");
    });

    it("子見出しを含む章でも、次の同じ深さの見出しまでの本文全体を差し替える", () => {
      const ticketWithSubsections = [
        "---",
        "specdojo:",
        "  id: prj-0001:pjr-ab12-sub",
        "---",
        "",
        "# PJR-AB12 サブ見出し付き",
        "",
        "## 1. 完了条件",
        "",
        "親条件の説明",
        "",
        "### 1.1 詳細条件",
        "",
        "詳細条件の本文",
        "",
        "## 2. 次の章",
        "",
        "次の章の本文",
        "",
      ].join("\n");

      const newBody = "- 単一の完了条件リスト";
      const result = replaceTicketSection(ticketWithSubsections, "完了条件", newBody);
      expect(result.changed).toBe(true);
      expect(result.content).toContain(
        "## 1. 完了条件\n\n- 単一の完了条件リスト\n\n## 2. 次の章\n\n次の章の本文",
      );
      expect(result.content).not.toContain("### 1.1 詳細条件");
    });

    it("ほかの章と frontmatter は全く変わらない", () => {
      const newBody = "- 差し替えられた完了条件";
      const result = replaceTicketSection(originalTicket, "完了条件", newBody);

      // frontmatter の検証
      const originalFm = originalTicket.match(/^---\n[\s\S]*?\n---/)?.[0];
      const resultFm = result.content.match(/^---\n[\s\S]*?\n---/)?.[0];
      expect(resultFm).toBe(originalFm);

      // ほかの章（概要、入力、作業内容、対応結果）の検証
      expect(result.content).toContain("## 1. 概要\n\n概要の説明\n\n## 2. 入力");
      expect(result.content).toContain("## 2. 入力\n\n- 前提条件1\n\n## 3. 完了条件");
      expect(result.content).toContain(
        "## 4. 作業内容\n\n| No | 作業 | 状態 |\n| --- | --- | --- |\n| 1 | 作業1 | open |\n\n## 5. 対応結果",
      );
      expect(result.content).toContain("## 5. 対応結果\n\n_TODO_: 完了時に結果を書く");
    });

    it("同一内容で差し替えた場合は changed: false になる", () => {
      const existingBody = "- 完了条件1\n- 完了条件2";
      const result = replaceTicketSection(originalTicket, "完了条件", existingBody);
      expect(result.changed).toBe(false);
    });

    it("存在しない章名を指定した場合はエラーになる", () => {
      expect(() => replaceTicketSection(originalTicket, "存在しない章", "本文")).toThrow(
        'Section "存在しない章" not found in ticket',
      );
    });

    it("空文字の章名を指定した場合はエラーになる", () => {
      expect(() => replaceTicketSection(originalTicket, "  ", "本文")).toThrow(
        "Section name must not be empty",
      );
    });
  });
});

describe("register update --section CLI", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    process.exitCode = undefined;
  });

  async function runRegister(args: string[]): Promise<void> {
    const program = new Command();
    program.exitOverride();
    registerRegisterCommands(program);
    await program.parseAsync(["node", "specdojo", "register", ...args]);
  }

  it("register update で章の本文をファイルから差し替え、イベントを記録する", async () => {
    await withRepo(async ({ root, registerDir }) => {
      vi.spyOn(process.stdout, "write").mockReturnValue(true);
      const ticket = buildSampleTicket();
      const ticketPath = join(registerDir, "pjr-ab12-topic.md");
      writeFileSync(ticketPath, ticket, "utf8");
      writeInitialEvent(registerDir, "PJR-AB12", "pjr-ab12-topic.md", ticket);

      const sectionFile = join(root, "new-criteria.md");
      writeFileSync(
        sectionFile,
        "- CLI で章の本文を差し替えられること\n- エラー時に個票を変えないこと\n",
        "utf8",
      );

      // dry-run では書き換わらない
      await runRegister([
        "update",
        "--id",
        "PJR-AB12",
        "--section",
        "完了条件",
        "--section-file",
        sectionFile,
        "--dry-run",
      ]);
      expect(readFileSync(ticketPath, "utf8")).toBe(ticket);

      // 実行
      await runRegister([
        "update",
        "--id",
        "PJR-AB12",
        "--section",
        "完了条件",
        "--section-file",
        sectionFile,
      ]);

      const updatedTicket = readFileSync(ticketPath, "utf8");
      expect(updatedTicket).toContain(
        "## 3. 完了条件\n\n- CLI で章の本文を差し替えられること\n- エラー時に個票を変えないこと\n\n## 4. 作業内容",
      );
      // ほかの章が変わっていないこと
      expect(updatedTicket).toContain("## 1. 概要\n\n概要の説明\n\n## 2. 入力");
      expect(updatedTicket).toContain("## 2. 入力\n\n- 前提条件1\n\n## 3. 完了条件");
      expect(updatedTicket).toContain("## 5. 対応結果\n\n_TODO_: 完了時に結果を書く");

      // event の記録
      const events = readEvents(registerDir, "PJR-AB12");
      expect(events).toHaveLength(2);
      const lastEvent = events.at(-1)!;
      expect(lastEvent.action).toBe("update");
      expect(lastEvent.reason).toBe('section "完了条件" updated');
      expect(lastEvent.changes).toContainEqual({
        field: "section",
        from: "",
        to: "完了条件",
      });
      expect(process.exitCode).toBeUndefined();
    });
  });

  it("エラー時（存在しない章、読めないファイル、見出し含むファイル、不整合オプション）は個票を変更しない", async () => {
    await withRepo(async ({ root, registerDir }) => {
      vi.spyOn(process.stdout, "write").mockReturnValue(true);
      const stderrLines: string[] = [];
      vi.spyOn(process.stderr, "write").mockImplementation((str) => {
        stderrLines.push(String(str));
        return true;
      });

      const ticket = buildSampleTicket();
      const ticketPath = join(registerDir, "pjr-ab12-topic.md");
      writeFileSync(ticketPath, ticket, "utf8");
      writeInitialEvent(registerDir, "PJR-AB12", "pjr-ab12-topic.md", ticket);

      const validSectionFile = join(root, "valid.md");
      writeFileSync(validSectionFile, "- 本文のみ\n", "utf8");

      const invalidSectionFile = join(root, "heading.md");
      writeFileSync(invalidSectionFile, "## 見出しが含まれる\n", "utf8");

      // 1. --section のみ指定（不整合オプション）
      process.exitCode = undefined;
      stderrLines.length = 0;
      await runRegister(["update", "--id", "PJR-AB12", "--section", "完了条件"]);
      expect(process.exitCode).toBe(1);
      expect(stderrLines.join("")).toContain(
        "--section and --section-file must be specified together",
      );
      expect(readFileSync(ticketPath, "utf8")).toBe(ticket);

      // 2. --section-file のみ指定（不整合オプション）
      process.exitCode = undefined;
      stderrLines.length = 0;
      await runRegister(["update", "--id", "PJR-AB12", "--section-file", validSectionFile]);
      expect(process.exitCode).toBe(1);
      expect(stderrLines.join("")).toContain(
        "--section and --section-file must be specified together",
      );
      expect(readFileSync(ticketPath, "utf8")).toBe(ticket);

      // 3. 読めないファイル
      process.exitCode = undefined;
      stderrLines.length = 0;
      await runRegister([
        "update",
        "--id",
        "PJR-AB12",
        "--section",
        "完了条件",
        "--section-file",
        join(root, "not-exist.md"),
      ]);
      expect(process.exitCode).toBe(1);
      expect(stderrLines.join("")).toContain("Cannot read section file");
      expect(readFileSync(ticketPath, "utf8")).toBe(ticket);

      // 4. 見出しを含むファイル
      process.exitCode = undefined;
      stderrLines.length = 0;
      await runRegister([
        "update",
        "--id",
        "PJR-AB12",
        "--section",
        "完了条件",
        "--section-file",
        invalidSectionFile,
      ]);
      expect(process.exitCode).toBe(1);
      expect(stderrLines.join("")).toContain("Section file must not contain markdown headings");
      expect(readFileSync(ticketPath, "utf8")).toBe(ticket);

      // 5. 個票に存在しない章
      process.exitCode = undefined;
      stderrLines.length = 0;
      await runRegister([
        "update",
        "--id",
        "PJR-AB12",
        "--section",
        "存在しない章",
        "--section-file",
        validSectionFile,
      ]);
      expect(process.exitCode).toBe(1);
      expect(stderrLines.join("")).toContain('Section "存在しない章" not found in ticket');
      expect(readFileSync(ticketPath, "utf8")).toBe(ticket);

      // イベントも増えていないこと（1件のまま）
      expect(readEvents(registerDir, "PJR-AB12")).toHaveLength(1);
    });
  });

  it("--dry-run でも、存在しない章・読めないファイル・見出し含むファイルはエラーになる", async () => {
    await withRepo(async ({ root, registerDir }) => {
      const stdoutLines: string[] = [];
      vi.spyOn(process.stdout, "write").mockImplementation((str) => {
        stdoutLines.push(String(str));
        return true;
      });
      const stderrLines: string[] = [];
      vi.spyOn(process.stderr, "write").mockImplementation((str) => {
        stderrLines.push(String(str));
        return true;
      });

      const ticket = buildSampleTicket();
      const ticketPath = join(registerDir, "pjr-ab12-topic.md");
      writeFileSync(ticketPath, ticket, "utf8");
      writeInitialEvent(registerDir, "PJR-AB12", "pjr-ab12-topic.md", ticket);

      const validSectionFile = join(root, "valid.md");
      writeFileSync(validSectionFile, "- 本文のみ\n", "utf8");
      const invalidSectionFile = join(root, "heading.md");
      writeFileSync(invalidSectionFile, "## 見出しが含まれる\n", "utf8");

      const cases: Array<{ section: string; file: string; message: string }> = [
        {
          section: "存在しない章",
          file: validSectionFile,
          message: 'Section "存在しない章" not found in ticket',
        },
        {
          section: "完了条件",
          file: join(root, "not-exist.md"),
          message: "Cannot read section file",
        },
        {
          section: "完了条件",
          file: invalidSectionFile,
          message: "Section file must not contain markdown headings",
        },
      ];

      for (const testCase of cases) {
        process.exitCode = undefined;
        stderrLines.length = 0;
        stdoutLines.length = 0;
        await runRegister([
          "update",
          "--id",
          "PJR-AB12",
          "--section",
          testCase.section,
          "--section-file",
          testCase.file,
          "--dry-run",
        ]);
        expect(process.exitCode).toBe(1);
        expect(stderrLines.join("")).toContain(testCase.message);
        expect(stdoutLines.join("")).not.toContain("Would update");
        expect(readFileSync(ticketPath, "utf8")).toBe(ticket);
      }
    });
  });
});

describe("pairSectionOptions", () => {
  it("--section と --section-file を指定順に組にする", () => {
    expect(pairSectionOptions(["進行中", " 判断待ち "], ["a.md", "b.md"])).toEqual([
      { name: "進行中", file: "a.md" },
      { name: "判断待ち", file: "b.md" },
    ]);
  });

  it("指定がなければ空の配列を返す", () => {
    expect(pairSectionOptions(undefined, undefined)).toEqual([]);
  });

  it("数が合わない場合は数を含めてエラーにする", () => {
    expect(() => pairSectionOptions(["進行中"], undefined)).toThrow(
      /got 1 --section and 0 --section-file/,
    );
  });
});

describe("register add --section CLI", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    process.exitCode = undefined;
  });

  async function runRegister(args: string[]): Promise<void> {
    const program = new Command();
    program.exitOverride();
    registerRegisterCommands(program);
    await program.parseAsync(["node", "specdojo", "register", ...args]);
  }

  const ADD_HANDOFF_ARGS = [
    "add",
    "--type",
    "handoff",
    "--title",
    "引き継ぎ",
    "--topic",
    "handoff-test",
    "--id",
    "PJR-AB34",
    "--due",
    "-",
  ];

  it("起票時に複数の章をファイルの本文で埋め、ほかの章は template のまま残す", async () => {
    await withRepo(async ({ root, registerDir }) => {
      vi.spyOn(process.stdout, "write").mockReturnValue(true);
      const inProgress = join(root, "in-progress.md");
      const pending = join(root, "pending.md");
      writeFileSync(inProgress, "- review の項目:\n  - PJR-AB12 テスト\n", "utf8");
      writeFileSync(pending, "-\n", "utf8");

      await runRegister([
        ...ADD_HANDOFF_ARGS,
        "--section",
        "進行中",
        "--section-file",
        inProgress,
        "--section",
        "判断待ち",
        "--section-file",
        pending,
      ]);

      const ticket = readFileSync(join(registerDir, "pjr-ab34-handoff-test.md"), "utf8");
      expect(ticket).toContain(
        "## 3. 進行中\n\n- review の項目:\n  - PJR-AB12 テスト\n\n## 4. 判断待ち",
      );
      expect(ticket).toContain("## 4. 判断待ち\n\n-\n\n## 5. 注意点");
      expect(ticket).toContain("## 1. 引き継ぎ元と先\n\n_TODO_:");
      expect(process.exitCode).toBeUndefined();
    });
  });

  it("存在しない章を指定すると個票を作らずにエラーにする", async () => {
    await withRepo(async ({ root, registerDir }) => {
      vi.spyOn(process.stdout, "write").mockReturnValue(true);
      const stderr = vi.spyOn(process.stderr, "write").mockReturnValue(true);
      const body = join(root, "body.md");
      writeFileSync(body, "本文\n", "utf8");

      await runRegister([...ADD_HANDOFF_ARGS, "--section", "存在しない章", "--section-file", body]);

      expect(process.exitCode).toBe(1);
      expect(stderr.mock.calls.map((call) => String(call[0])).join("")).toContain(
        'Section "存在しない章" not found in ticket',
      );
      expect(existsSync(join(registerDir, "pjr-ab34-handoff-test.md"))).toBe(false);
    });
  });
});
