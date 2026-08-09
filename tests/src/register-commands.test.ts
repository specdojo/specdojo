import { afterEach, describe, expect, it, vi } from "vitest";
import { Command } from "commander";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { registerRegisterCommands } from "../../src/register.js";

// register サブコマンドの読み書き先が個票 frontmatter であることを、CLI 経由で確認する。
// 一時リポジトリを cwd にして specdojoRootDir() / loadConfig() を temp 内へ閉じ込める。

const REGISTER_REL = "docs/ja/projects/prj-0001/controls/project-register";

const CONFIG = {
  version: 1,
  current_project: "prj-0001",
  projects: {
    "prj-0001": {
      base_path: "docs/ja/projects/prj-0001",
      catalog_path: "010-deliverables-catalog",
      schedule_path: "schedule",
      execution_path: "execution",
      project_register_path: "controls/project-register",
      run: { register_date_timezone: "UTC" },
    },
  },
};

function buildIndex(rows: string[]): string {
  return [
    "---",
    "specdojo:",
    "  id: prj-0001:pjr-index",
    "  type: project",
    "  status: ready",
    "---",
    "",
    "# プロジェクト登録簿",
    "",
    "## 1. 登録項目一覧",
    "",
    "<!-- prettier-ignore -->",
    "| ID | ステータス | タイトル | 説明 | 分類 | 優先度 | 担当 | 登録日 | 期限 | 完了日 | 結論 | 個票 |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ...rows,
    "",
  ].join("\n");
}

function buildTicket(id: string, extraFields: string[], body = "個票本文の説明。"): string {
  return [
    "---",
    "specdojo:",
    `  id: prj-0001:${id.toLowerCase()}-topic`,
    "  type: project",
    "  status: draft",
    "  rulebook: specdojo:pjr-rulebook",
    "  part_of:",
    "    - prj-0001:pjr-index",
    "  item_type: todo",
    ...extraFields.map((line) => `  ${line}`),
    "---",
    "",
    `# ${id} 在庫初期値を決める`,
    "",
    "## 1. 概要",
    "",
    body,
    "",
    "## 2. 完了条件",
    "",
    "- 初期値が決まっている。",
    "",
  ].join("\n");
}

type Fixture = { root: string; registerDir: string };

// テンプレート（個票・派生ビュー）は実リポジトリのものを temp へ複製し、生成処理を成立させる。
function withRepo(fn: (fixture: Fixture) => Promise<void> | void): Promise<void> {
  const originalCwd = process.cwd();
  const root = mkdtempSync(join(tmpdir(), "specdojo-register-cli-"));
  return (async () => {
    try {
      mkdirSync(join(root, ".specdojo"), { recursive: true });
      writeFileSync(
        join(root, ".specdojo/specdojo.config.json"),
        `${JSON.stringify(CONFIG, null, 2)}\n`,
        "utf8",
      );
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

async function runRegister(args: string[]): Promise<void> {
  const program = new Command();
  program.exitOverride();
  registerRegisterCommands(program);
  await program.parseAsync(["register", ...args], { from: "user" });
}

describe("register CLI — 個票 frontmatter への読み書き", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    process.exitCode = undefined;
  });

  it("add は個票を作成し、構造化フィールドを frontmatter へ書く（表へ行を追記しない）", async () => {
    await withRepo(async ({ registerDir }) => {
      writeFileSync(join(registerDir, "pjr-index.md"), buildIndex([]), "utf8");
      vi.spyOn(process.stdout, "write").mockReturnValue(true);

      await runRegister([
        "add",
        "--type",
        "todo",
        "--title",
        "在庫初期値を決める",
        "--description",
        "開店時の在庫初期値を決める。",
        "--topic",
        "inventory-seed",
        "--id",
        "PJR-AB12",
        "--priority",
        "high",
        "--owner",
        "ARC",
        "--registered",
        "2026-08-01",
        "--due",
        "2026-08-31",
      ]);

      const ticket = readFileSync(join(registerDir, "pjr-ab12-inventory-seed.md"), "utf8");
      expect(ticket).toContain("  item_type: todo");
      expect(ticket).toContain("  item_status: open");
      expect(ticket).toContain("  priority: high");
      expect(ticket).toContain("  owner: ARC");
      expect(ticket).toContain('  registered_on: "2026-08-01"');
      expect(ticket).toContain('  due_on: "2026-08-31"');
      expect(ticket).toContain("# PJR-AB12 在庫初期値を決める");
      expect(ticket).toContain("開店時の在庫初期値を決める。");
      // 未定値（完了日・結論）はキーを置かない。
      expect(ticket).not.toContain("completed_on");
      expect(ticket).not.toContain("conclusion");

      // 一覧本体には行を追記しない（生成ビューとして扱う）。
      expect(readFileSync(join(registerDir, "pjr-index.md"), "utf8")).not.toContain("PJR-AB12");
      // 派生ビューは個票の走査から生成される。
      expect(readFileSync(join(registerDir, "generated/pjr-views.md"), "utf8")).toContain(
        "PJR-AB12",
      );
    });
  });

  it("add は既存 ID と衝突する場合に stderr へ理由を出して失敗する", async () => {
    await withRepo(async ({ registerDir }) => {
      writeFileSync(join(registerDir, "pjr-index.md"), buildIndex([]), "utf8");
      writeFileSync(
        join(registerDir, "pjr-ab12-topic.md"),
        buildTicket("PJR-AB12", ["item_status: open", "priority: high"]),
        "utf8",
      );
      vi.spyOn(process.stdout, "write").mockReturnValue(true);
      const stderr = vi.spyOn(process.stderr, "write").mockReturnValue(true);

      await runRegister([
        "add",
        "--type",
        "todo",
        "--title",
        "重複",
        "--id",
        "PJR-AB12",
        "--registered",
        "2026-08-01",
      ]);

      expect(process.exitCode).toBe(1);
      expect(String(stderr.mock.calls[0][0])).toMatch(
        /ID already exists in the project register: PJR-AB12/,
      );
    });
  });

  it.each([
    "--reserve",
    "--local",
    "--strict-sync",
    "--integration-branch",
    "--integration-worktree",
  ])("%s は廃止済みのため Commander の未知オプションとして拒否する", async (removedOption) => {
    const removedArgs = [removedOption];
    if (removedOption.startsWith("--integration-")) removedArgs.push("value");
    await expect(
      runRegister(["add", "--type", "todo", "--title", "x", ...removedArgs]),
    ).rejects.toThrow(new RegExp(`unknown option '${removedOption}`));
  });

  it("状態遷移（start / close）は個票 frontmatter を更新する", async () => {
    await withRepo(async ({ registerDir }) => {
      const ticketPath = join(registerDir, "pjr-ab12-topic.md");
      writeFileSync(join(registerDir, "pjr-index.md"), buildIndex([]), "utf8");
      writeFileSync(
        ticketPath,
        buildTicket("PJR-AB12", [
          "item_status: open",
          "priority: high",
          "owner: ARC",
          'registered_on: "2026-08-01"',
        ]),
        "utf8",
      );
      vi.spyOn(process.stdout, "write").mockReturnValue(true);

      await runRegister(["start", "--id", "PJR-AB12"]);
      expect(readFileSync(ticketPath, "utf8")).toContain("  item_status: in-progress");

      await runRegister([
        "close",
        "--id",
        "PJR-AB12",
        "--completed",
        "2026-08-05",
        "--conclusion",
        "初期値を決定した",
      ]);

      const closed = readFileSync(ticketPath, "utf8");
      expect(closed).toContain("  item_status: done");
      expect(closed).toContain('  completed_on: "2026-08-05"');
      expect(closed).toContain("  conclusion: 初期値を決定した");
      // 文書成熟度（status）は登録項目の処理状態とは別軸で昇格する。
      expect(closed).toContain("  status: ready");
    });
  });

  it("reopen は完了日のキーを削除して活動中の状態へ戻す", async () => {
    await withRepo(async ({ registerDir }) => {
      const ticketPath = join(registerDir, "pjr-ab12-topic.md");
      writeFileSync(join(registerDir, "pjr-index.md"), buildIndex([]), "utf8");
      writeFileSync(
        ticketPath,
        buildTicket("PJR-AB12", [
          "item_status: done",
          "priority: high",
          'registered_on: "2026-08-01"',
          'completed_on: "2026-08-05"',
        ]),
        "utf8",
      );
      vi.spyOn(process.stdout, "write").mockReturnValue(true);

      await runRegister(["reopen", "--id", "PJR-AB12"]);

      const reopened = readFileSync(ticketPath, "utf8");
      expect(reopened).toContain("  item_status: open");
      expect(reopened).not.toContain("completed_on");
    });
  });

  it("update は frontmatter のフィールドと本文のタイトル・説明を更新する", async () => {
    await withRepo(async ({ registerDir }) => {
      const ticketPath = join(registerDir, "pjr-ab12-topic.md");
      writeFileSync(join(registerDir, "pjr-index.md"), buildIndex([]), "utf8");
      writeFileSync(
        ticketPath,
        buildTicket("PJR-AB12", [
          "item_status: open",
          "priority: high",
          'registered_on: "2026-08-01"',
        ]),
        "utf8",
      );
      vi.spyOn(process.stdout, "write").mockReturnValue(true);

      await runRegister([
        "update",
        "--id",
        "PJR-AB12",
        "--priority",
        "low",
        "--owner",
        "PO",
        "--due",
        "2026-09-30",
        "--title",
        "在庫初期値を見直す",
        "--description",
        "仕入れ先変更に伴う見直し。",
      ]);

      const updated = readFileSync(ticketPath, "utf8");
      expect(updated).toContain("  priority: low");
      expect(updated).toContain("  owner: PO");
      expect(updated).toContain('  due_on: "2026-09-30"');
      expect(updated).toContain("# PJR-AB12 在庫初期値を見直す");
      expect(updated).toContain("仕入れ先変更に伴う見直し。");
    });
  });

  it("未移行（pjr-index の行のみ）の項目は、遷移時に行の値を個票 frontmatter へ移す", async () => {
    await withRepo(async ({ registerDir }) => {
      const ticketPath = join(registerDir, "pjr-ab12-topic.md");
      writeFileSync(
        join(registerDir, "pjr-index.md"),
        buildIndex([
          "| PJR-AB12 | open | 行タイトル | 行説明 | todo | medium | ARC | 2026-01-10 | 2026-02-01 | - | - | [pjr-ab12-topic](./pjr-ab12-topic.md) |",
        ]),
        "utf8",
      );
      writeFileSync(ticketPath, buildTicket("PJR-AB12", []), "utf8");
      vi.spyOn(process.stdout, "write").mockReturnValue(true);

      await runRegister(["review", "--id", "PJR-AB12"]);

      const migrated = readFileSync(ticketPath, "utf8");
      expect(migrated).toContain("  item_status: review");
      expect(migrated).toContain("  priority: medium");
      expect(migrated).toContain("  owner: ARC");
      expect(migrated).toContain('  registered_on: "2026-01-10"');
      expect(migrated).toContain('  due_on: "2026-02-01"');
    });
  });

  it("個票が無い項目の遷移は、書き込み先が無いことを理由に失敗する", async () => {
    await withRepo(async ({ registerDir }) => {
      writeFileSync(
        join(registerDir, "pjr-index.md"),
        buildIndex([
          "| PJR-CD34 | open | 行のみ | 説明 | todo | medium | ARC | 2026-01-10 | - | - | - | - |",
        ]),
        "utf8",
      );
      vi.spyOn(process.stdout, "write").mockReturnValue(true);
      const stderr = vi.spyOn(process.stderr, "write").mockReturnValue(true);

      await runRegister(["start", "--id", "PJR-CD34"]);

      expect(process.exitCode).toBe(1);
      expect(String(stderr.mock.calls[0][0])).toMatch(/PJR-CD34 has no ticket file/);
    });
  });

  it("--dry-run は個票を書き換えず、変更予定のフィールドを表示する", async () => {
    await withRepo(async ({ registerDir }) => {
      const ticketPath = join(registerDir, "pjr-ab12-topic.md");
      writeFileSync(join(registerDir, "pjr-index.md"), buildIndex([]), "utf8");
      const original = buildTicket("PJR-AB12", [
        "item_status: open",
        "priority: high",
        'registered_on: "2026-08-01"',
      ]);
      writeFileSync(ticketPath, original, "utf8");
      const stdout = vi.spyOn(process.stdout, "write").mockReturnValue(true);

      await runRegister(["start", "--id", "PJR-AB12", "--dry-run"]);

      expect(readFileSync(ticketPath, "utf8")).toBe(original);
      const printed = stdout.mock.calls.map((call) => String(call[0])).join("");
      expect(printed).toContain(`Would update ${ticketPath}`);
      expect(printed).toContain("item_status: in-progress");
    });
  });

  it("build は個票の走査から派生ビューを生成する", async () => {
    await withRepo(async ({ registerDir }) => {
      writeFileSync(join(registerDir, "pjr-index.md"), buildIndex([]), "utf8");
      writeFileSync(
        join(registerDir, "pjr-ab12-topic.md"),
        buildTicket("PJR-AB12", [
          "item_status: open",
          "priority: high",
          "owner: ARC",
          'registered_on: "2026-08-01"',
        ]),
        "utf8",
      );
      vi.spyOn(process.stdout, "write").mockReturnValue(true);

      await runRegister(["build", "--scope", "register"]);

      const views = readFileSync(join(registerDir, "generated/pjr-views.md"), "utf8");
      expect(views).toContain("| PJR-AB12 | open | 在庫初期値を決める | 個票本文の説明。");
      expect(existsSync(join(registerDir, "generated/pjr-views.md"))).toBe(true);
    });
  });
});
