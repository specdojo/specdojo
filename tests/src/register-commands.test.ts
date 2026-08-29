import { afterEach, describe, expect, it, vi } from "vitest";
import { Command } from "commander";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { registerRegisterCommands } from "../../src/register.js";
import { readRegisterEventsFromContent } from "../../src/register-events.js";

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

  it("scaffold は generated 配下の一覧を作成し、追跡対象の参照ページは作らない", async () => {
    await withRepo(async ({ registerDir }) => {
      vi.spyOn(process.stdout, "write").mockReturnValue(true);

      await runRegister(["scaffold"]);

      expect(existsSync(join(registerDir, "pjr-index.md"))).toBe(false);
      const generated = readFileSync(join(registerDir, "generated/pjr-index.md"), "utf8");
      expect(generated).toContain("id: prj-0001:pjr-index");
      expect(generated).toContain("status: ready");
      expect(generated).toContain("## 1. 登録項目一覧");
    });
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
        "2026-08-01T23:30:00+09:00",
        "--due",
        "2026-08-31",
      ]);

      const ticket = readFileSync(join(registerDir, "pjr-ab12-inventory-seed.md"), "utf8");
      expect(ticket).toContain("  item_type: todo");
      expect(ticket).toContain("  item_status: open");
      expect(ticket).toContain("  priority: high");
      expect(ticket).toContain("  owner: ARC");
      // タイムゾーン付きの指定は UTC へ正規化して保存する。
      expect(ticket).toContain('  registered_at: "2026-08-01T14:30:00Z"');
      expect(ticket).toContain('  due_on: "2026-08-31"');
      expect(ticket).toContain("# PJR-AB12 在庫初期値を決める");
      expect(ticket).toContain("開店時の在庫初期値を決める。");
      expect(readRegisterEventsFromContent(ticket, "pjr-ab12-inventory-seed.md")[0]).toMatchObject({
        action: "add",
        actor: "manual",
        from_status: null,
        to_status: "open",
      });
      // 未定値（完了日時・結論）はキーを置かない。
      expect(ticket).not.toContain("completed_at");
      expect(ticket).not.toContain("conclusion");

      // 一覧本体には行を追記しない（生成ビューとして扱う）。
      expect(readFileSync(join(registerDir, "pjr-index.md"), "utf8")).not.toContain("PJR-AB12");
      // 派生ビューは個票の走査から生成される。
      expect(readFileSync(join(registerDir, "generated/pjr-views-by-status.md"), "utf8")).toContain(
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
        "2026-08-01T00:00:00Z",
      ]);

      expect(process.exitCode).toBe(1);
      expect(String(stderr.mock.calls[0][0])).toMatch(
        /ID already exists in the project register: PJR-AB12/,
      );
    });
  });

  it("add は description の山括弧プレースホルダを個票本文で code span 化する", async () => {
    await withRepo(async ({ registerDir }) => {
      writeFileSync(join(registerDir, "pjr-index.md"), buildIndex([]), "utf8");
      vi.spyOn(process.stdout, "write").mockReturnValue(true);

      await runRegister([
        "add",
        "--type",
        "todo",
        "--title",
        "プレースホルダを扱う",
        "--description",
        "dct-<domain>.yaml と <phase>. を確認する。",
        "--topic",
        "angle-placeholder",
        "--id",
        "PJR-AB12",
        "--registered",
        "2026-08-01T00:00:00Z",
      ]);

      const ticket = readFileSync(join(registerDir, "pjr-ab12-angle-placeholder.md"), "utf8");
      expect(ticket).toContain("`dct-<domain>.yaml` と `<phase>`. を確認する。");
    });
  });

  it("build は個票ファイル名と frontmatter ID の不一致を検出して失敗する", async () => {
    await withRepo(async ({ registerDir }) => {
      writeFileSync(
        join(registerDir, "pjr-ab12-topic.md"),
        buildTicket("PJR-CD34", ["item_status: open", "priority: high"]),
        "utf8",
      );
      const stderr = vi.spyOn(process.stderr, "write").mockReturnValue(true);

      await runRegister(["build"]);

      expect(process.exitCode).toBe(1);
      expect(String(stderr.mock.calls[0][0])).toContain(
        'pjr-ab12-topic.md: PJR-AB12 must match frontmatter id "prj-0001:pjr-cd34-topic"',
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
          'registered_at: "2026-08-01T12:00:00Z"',
        ]),
        "utf8",
      );
      vi.spyOn(process.stdout, "write").mockReturnValue(true);

      await runRegister(["start", "--id", "PJR-AB12", "--by", "codex"]);
      const started = readFileSync(ticketPath, "utf8");
      expect(started).toContain("  item_status: in-progress");
      expect(readRegisterEventsFromContent(started, ticketPath)[0]).toMatchObject({
        action: "start",
        actor: "codex",
        from_status: "open",
        to_status: "in-progress",
      });

      // 同じ遷移の再実行は現在値もイベント列も増やさない。
      await runRegister(["start", "--id", "PJR-AB12", "--by", "codex"]);
      expect(
        readRegisterEventsFromContent(readFileSync(ticketPath, "utf8"), ticketPath),
      ).toHaveLength(1);

      await runRegister([
        "close",
        "--id",
        "PJR-AB12",
        "--completed",
        "2026-08-05T10:15:30Z",
        "--conclusion",
        "初期値を決定した",
        "--by",
        "po",
      ]);

      const closed = readFileSync(ticketPath, "utf8");
      expect(closed).toContain("  item_status: done");
      expect(closed).toContain('  completed_at: "2026-08-05T10:15:30Z"');
      expect(closed).toContain("  conclusion: 初期値を決定した");
      // 文書成熟度（status）は登録項目の処理状態とは別軸で昇格する。
      expect(closed).toContain("  status: ready");
      const events = readRegisterEventsFromContent(closed, ticketPath);
      expect(events).toHaveLength(2);
      expect(events[1]).toMatchObject({
        action: "close",
        actor: "po",
        previous_event_id: events[0].id,
        from_status: "in-progress",
        to_status: "done",
      });
    });
  });

  it("wait はブロック理由を conclusion と分けて frontmatter へ記録する", async () => {
    await withRepo(async ({ registerDir }) => {
      const ticketPath = join(registerDir, "pjr-ab12-topic.md");
      writeFileSync(join(registerDir, "pjr-index.md"), buildIndex([]), "utf8");
      writeFileSync(
        ticketPath,
        buildTicket("PJR-AB12", [
          "item_status: open",
          "priority: high",
          'registered_at: "2026-08-01T12:00:00Z"',
        ]),
        "utf8",
      );
      vi.spyOn(process.stdout, "write").mockReturnValue(true);

      await runRegister([
        "wait",
        "--id",
        "PJR-AB12",
        "--reason",
        "dct-<domain>.yaml と <phase>. を確認する",
      ]);

      const waiting = readFileSync(ticketPath, "utf8");
      expect(waiting).toContain('block_reason: "`dct-<domain>.yaml` と `<phase>`. を確認する"');
      expect(waiting).not.toContain("conclusion:");

      await runRegister(["start", "--id", "PJR-AB12"]);
      await runRegister(["review", "--id", "PJR-AB12"]);
      await runRegister(["close", "--id", "PJR-AB12", "--completed", "2026-08-05T10:15:30Z"]);

      const completed = readFileSync(ticketPath, "utf8");
      expect(completed).toContain("item_status: done");
      expect(completed).toContain("block_reason:");
      expect(completed).not.toContain("conclusion:");
    });
  });

  it("wait の旧 --conclusion オプションも block_reason へ記録する", async () => {
    await withRepo(async ({ registerDir }) => {
      const ticketPath = join(registerDir, "pjr-ab12-topic.md");
      writeFileSync(join(registerDir, "pjr-index.md"), buildIndex([]), "utf8");
      writeFileSync(
        ticketPath,
        buildTicket("PJR-AB12", ["item_status: open", "priority: high"]),
        "utf8",
      );
      vi.spyOn(process.stdout, "write").mockReturnValue(true);

      await runRegister(["wait", "--id", "PJR-AB12", "--conclusion", "互換オプション"]);

      const waiting = readFileSync(ticketPath, "utf8");
      expect(waiting).toContain("block_reason: 互換オプション");
      expect(waiting).not.toContain("conclusion:");
    });
  });

  it("update は conclusion を更新・削除できる", async () => {
    await withRepo(async ({ registerDir }) => {
      const ticketPath = join(registerDir, "pjr-ab12-topic.md");
      writeFileSync(join(registerDir, "pjr-index.md"), buildIndex([]), "utf8");
      writeFileSync(
        ticketPath,
        buildTicket("PJR-AB12", ["item_status: review", "priority: high"]),
        "utf8",
      );
      vi.spyOn(process.stdout, "write").mockReturnValue(true);

      await runRegister(["update", "--id", "PJR-AB12", "--conclusion", "初期値を決定した"]);
      expect(readFileSync(ticketPath, "utf8")).toContain("conclusion: 初期値を決定した");

      await runRegister(["update", "--id", "PJR-AB12", "--conclusion", "-"]);
      expect(readFileSync(ticketPath, "utf8")).not.toContain("conclusion:");
    });
  });

  it("reopen は完了日時のキーを削除して活動中の状態へ戻す", async () => {
    await withRepo(async ({ registerDir }) => {
      const ticketPath = join(registerDir, "pjr-ab12-topic.md");
      writeFileSync(join(registerDir, "pjr-index.md"), buildIndex([]), "utf8");
      writeFileSync(
        ticketPath,
        buildTicket("PJR-AB12", [
          "item_status: done",
          "priority: high",
          'registered_at: "2026-08-01T12:00:00Z"',
          'completed_at: "2026-08-05T10:15:30Z"',
        ]),
        "utf8",
      );
      vi.spyOn(process.stdout, "write").mockReturnValue(true);

      await runRegister(["reopen", "--id", "PJR-AB12"]);

      const reopened = readFileSync(ticketPath, "utf8");
      expect(reopened).toContain("  item_status: open");
      expect(reopened).not.toContain("completed_at");
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
          'registered_at: "2026-08-01T12:00:00Z"',
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

  it("update --topic は個票名・文書 ID・参照・event・生成ビューを一括更新する", async () => {
    await withRepo(async ({ root, registerDir }) => {
      const oldTicketPath = join(registerDir, "pjr-ab12-topic.md");
      const newTicketPath = join(registerDir, "pjr-ab12-inventory-policy.md");
      writeFileSync(
        join(registerDir, "pjr-index.md"),
        buildIndex([
          "| PJR-AB12 | open | 在庫初期値を決める | 個票本文の説明。 | todo | high | - | _TODO_ | - | - | - | [pjr-ab12-topic](./pjr-ab12-topic.md) |",
        ]),
        "utf8",
      );
      writeFileSync(
        oldTicketPath,
        buildTicket("PJR-AB12", ["item_status: open", "priority: high"]),
        "utf8",
      );
      const referencePath = join(root, "docs/ja/topic-reference.md");
      writeFileSync(
        referencePath,
        "詳細は [[prj-0001:pjr-ab12-topic|登録項目]] を参照。\n",
        "utf8",
      );
      vi.spyOn(process.stdout, "write").mockReturnValue(true);

      await runRegister([
        "update",
        "--id",
        "PJR-AB12",
        "--topic",
        "inventory-policy",
        "--title",
        "在庫方針を決める",
        "--by",
        "ARC",
        "--reason",
        "主題変更",
      ]);

      expect(existsSync(oldTicketPath)).toBe(false);
      const updated = readFileSync(newTicketPath, "utf8");
      expect(updated).toContain("id: prj-0001:pjr-ab12-inventory-policy");
      expect(updated).toContain("# PJR-AB12 在庫方針を決める");
      expect(readFileSync(referencePath, "utf8")).toContain(
        "[[prj-0001:pjr-ab12-inventory-policy|登録項目]]",
      );
      // 移行前の pjr-index.md は読み取り互換の入力であり正本ではないため、topic 変更では更新しない。
      expect(readFileSync(join(registerDir, "generated/pjr-index.md"), "utf8")).toContain(
        "pjr-ab12-inventory-policy.md",
      );

      const event = readRegisterEventsFromContent(updated, newTicketPath)[0];
      expect(event).toMatchObject({ action: "update", actor: "ARC", reason: "主題変更" });
      expect(event.changes).toContainEqual({
        field: "id",
        from: "prj-0001:pjr-ab12-topic",
        to: "prj-0001:pjr-ab12-inventory-policy",
      });
    });
  });

  it("update --topic --dry-run は変更対象を表示するだけでファイルを更新しない", async () => {
    await withRepo(async ({ registerDir }) => {
      const ticketPath = join(registerDir, "pjr-ab12-topic.md");
      writeFileSync(join(registerDir, "pjr-index.md"), buildIndex([]), "utf8");
      const original = buildTicket("PJR-AB12", ["item_status: open", "priority: high"]);
      writeFileSync(ticketPath, original, "utf8");
      const stdout = vi.spyOn(process.stdout, "write").mockReturnValue(true);

      await runRegister(["update", "--id", "PJR-AB12", "--topic", "inventory-policy", "--dry-run"]);

      expect(readFileSync(ticketPath, "utf8")).toBe(original);
      expect(existsSync(join(registerDir, "pjr-ab12-inventory-policy.md"))).toBe(false);
      const printed = stdout.mock.calls.map((call) => String(call[0])).join("");
      expect(printed).toContain("Would change topic for PJR-AB12: topic → inventory-policy");
      expect(printed).toContain("Rename:");
    });
  });

  it("update --topic は不正な形式と既存ファイルへの衝突を拒否する", async () => {
    await withRepo(async ({ registerDir }) => {
      const ticketPath = join(registerDir, "pjr-ab12-topic.md");
      writeFileSync(join(registerDir, "pjr-index.md"), buildIndex([]), "utf8");
      writeFileSync(
        ticketPath,
        buildTicket("PJR-AB12", ["item_status: open", "priority: high"]),
        "utf8",
      );
      vi.spyOn(process.stdout, "write").mockReturnValue(true);
      const stderr = vi.spyOn(process.stderr, "write").mockReturnValue(true);

      await runRegister(["update", "--id", "PJR-AB12", "--topic", "Bad--Topic"]);
      expect(process.exitCode).toBe(1);
      expect(String(stderr.mock.calls.at(-1)?.[0])).toContain("Invalid topic");
      expect(readFileSync(ticketPath, "utf8")).toContain("pjr-ab12-topic");

      process.exitCode = undefined;
      writeFileSync(join(registerDir, "pjr-ab12-inventory-policy.md"), "occupied\n", "utf8");
      await runRegister(["update", "--id", "PJR-AB12", "--topic", "inventory-policy"]);
      expect(process.exitCode).toBe(1);
      expect(String(stderr.mock.calls.at(-1)?.[0])).toContain("Target ticket file already exists");
      expect(existsSync(ticketPath)).toBe(true);
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
      // 旧一覧の登録日セルは暦日しか持たないため、21:00（プロジェクトタイムゾーン）を補う。
      expect(migrated).toContain('  registered_at: "2026-01-10T21:00:00Z"');
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
        'registered_at: "2026-08-01T12:00:00Z"',
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

  it("close は日時オプションを省略すると実行時刻を UTC で記録する", async () => {
    await withRepo(async ({ registerDir }) => {
      const ticketPath = join(registerDir, "pjr-ab12-topic.md");
      writeFileSync(join(registerDir, "pjr-index.md"), buildIndex([]), "utf8");
      writeFileSync(
        ticketPath,
        buildTicket("PJR-AB12", [
          "item_status: in-progress",
          "priority: high",
          'registered_at: "2026-08-01T12:00:00Z"',
        ]),
        "utf8",
      );
      vi.spyOn(process.stdout, "write").mockReturnValue(true);
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-08-05T10:15:30.500Z"));

      try {
        await runRegister(["close", "--id", "PJR-AB12"]);
      } finally {
        vi.useRealTimers();
      }

      expect(readFileSync(ticketPath, "utf8")).toContain('  completed_at: "2026-08-05T10:15:30Z"');
    });
  });

  it("close はタイムゾーンを含まない日時を拒否し、受け付ける書式を示す", async () => {
    await withRepo(async ({ registerDir }) => {
      writeFileSync(join(registerDir, "pjr-index.md"), buildIndex([]), "utf8");
      writeFileSync(
        join(registerDir, "pjr-ab12-topic.md"),
        buildTicket("PJR-AB12", ["item_status: open", "priority: high"]),
        "utf8",
      );
      vi.spyOn(process.stdout, "write").mockReturnValue(true);
      const stderr = vi.spyOn(process.stderr, "write").mockReturnValue(true);

      await runRegister(["close", "--id", "PJR-AB12", "--completed", "2026-08-05"]);

      expect(process.exitCode).toBe(1);
      expect(String(stderr.mock.calls[0][0])).toMatch(
        /Must be an RFC 3339 date-time with a time zone/,
      );
    });
  });

  it("migrate は旧 registered_on / completed_on を UTC の日時へ移し、表示日を変えない", async () => {
    await withRepo(async ({ registerDir }) => {
      // 一覧の個票化はすでに済んでいる旧構成（pjr-index.md は表を持たない案内ページ）を入力にする。
      const ticketPath = join(registerDir, "pjr-ab12-topic.md");
      writeFileSync(
        ticketPath,
        buildTicket("PJR-AB12", [
          "item_status: done",
          "priority: high",
          "owner: ARC",
          'registered_on: "2026-08-01"',
          'completed_on: "2026-08-05"',
        ]),
        "utf8",
      );
      const stdout = vi.spyOn(process.stdout, "write").mockReturnValue(true);
      await runRegister(["scaffold"]);

      await runRegister(["migrate"]);

      const migrated = readFileSync(ticketPath, "utf8");
      // Git 履歴が無い一時リポジトリでは、旧日付に 21:00（UTC 設定）を補う。
      expect(migrated).toContain('  registered_at: "2026-08-01T21:00:00Z"');
      expect(migrated).toContain('  completed_at: "2026-08-05T21:00:00Z"');
      expect(migrated).not.toContain("registered_on");
      expect(migrated).not.toContain("completed_on");

      const printed = stdout.mock.calls.map((call) => String(call[0])).join("");
      expect(printed).toContain("Migrated register timestamps: items=1");

      // 一覧に出る暦日は移行前後で変わらない。
      const views = readFileSync(join(registerDir, "generated/pjr-index.md"), "utf8");
      expect(views).toContain("| ARC | 2026-08-01 | _TODO_ | 2026-08-05 |");
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
          'registered_at: "2026-08-01T12:00:00Z"',
        ]),
        "utf8",
      );
      vi.spyOn(process.stdout, "write").mockReturnValue(true);

      await runRegister(["build", "--scope", "register"]);

      const views = readFileSync(join(registerDir, "generated/pjr-views-by-status.md"), "utf8");
      expect(views).toContain("| PJR-AB12 | open | 在庫初期値を決める | 個票本文の説明。");
      expect(existsSync(join(registerDir, "generated/pjr-views-by-priority.md"))).toBe(true);
      expect(existsSync(join(registerDir, "generated/pjr-views-by-owner.md"))).toBe(true);
    });
  });
});
