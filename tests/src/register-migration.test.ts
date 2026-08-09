import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  applyRegisterMigrationPlan,
  loadRegisterItems,
  planRegisterMigration,
  type RegisterPaths,
} from "../../src/register.js";

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

function buildLegacyTicket(): string {
  return [
    "---",
    "specdojo:",
    "  id: prj-0001:pjr-ab12-existing",
    "  type: project",
    "  status: draft",
    "  rulebook: specdojo:pjr-rulebook",
    "  part_of:",
    "    - prj-0001:pjr-index",
    "  item_type: todo",
    "---",
    "",
    "# PJR-AB12 既存項目",
    "",
    "## 1. 概要",
    "",
    "既存個票にだけある詳細説明。",
    "",
    "## 2. 完了条件",
    "",
    "- 詳細な完了条件を保持する。",
    "",
  ].join("\n");
}

type Fixture = { root: string; paths: RegisterPaths };
let cleanup: (() => void) | undefined;

function makeFixture(): Fixture {
  const originalCwd = process.cwd();
  const root = mkdtempSync(join(tmpdir(), "specdojo-register-migration-"));
  mkdirSync(join(root, ".git"), { recursive: true });
  const registerDir = join(root, "docs/ja/projects/prj-0001/controls/project-register");
  mkdirSync(registerDir, { recursive: true });
  cpSync(
    join(originalCwd, "docs/ja/specdojo/templates"),
    join(root, "docs/ja/specdojo/templates"),
    { recursive: true },
  );
  process.chdir(root);
  cleanup = () => {
    process.chdir(originalCwd);
    rmSync(root, { recursive: true, force: true });
  };
  return {
    root,
    paths: {
      projectId: "prj-0001",
      projectRegisterPath: registerDir,
      pjrIndexPath: join(registerDir, "pjr-index.md"),
      generatedPath: join(registerDir, "generated"),
      controlsGeneratedPath: join(root, "docs/ja/projects/prj-0001/controls/generated"),
      registerDateTimeZone: "UTC",
    },
  };
}

afterEach(() => {
  cleanup?.();
  cleanup = undefined;
});

describe("register migration", () => {
  it("既存本文を保持して全行を個票化し、旧一覧を除去しても同じ項目値を復元する", () => {
    const { paths } = makeFixture();
    writeFileSync(
      paths.pjrIndexPath,
      buildIndex([
        "| PJR-AB12 | open | 既存項目 | 一覧の短い要約。 | todo | high | ARC | _TODO_ | _TODO_ | - | - | [pjr-ab12-existing](./pjr-ab12-existing.md) |",
        "| PJR-CD34 | done | 新規個票 | A\\|B を移行する。 | todo | medium | _TODO_ | 2026-08-01 | - | 2026-08-02 | 移行済み | - |",
      ]),
      "utf8",
    );
    const existingPath = join(paths.projectRegisterPath, "pjr-ab12-existing.md");
    writeFileSync(existingPath, buildLegacyTicket(), "utf8");

    const plan = planRegisterMigration(paths);
    expect(plan.sourceCount).toBe(2);
    expect(plan.createdCount).toBe(1);
    expect(plan.updatedCount).toBe(1);

    applyRegisterMigrationPlan(plan);

    expect(existsSync(paths.pjrIndexPath)).toBe(false);
    const existing = readFileSync(existingPath, "utf8");
    expect(existing).toContain("一覧の短い要約。");
    expect(existing).toContain("既存個票にだけある詳細説明。");
    expect(existing).toContain("詳細な完了条件を保持する。");
    expect(existing).toContain("  item_status: open");
    expect(existing).not.toContain("registered_at");
    expect(existing).not.toContain("due_on");

    const migrated = loadRegisterItems(paths).map((view) => view.item);
    expect(migrated).toHaveLength(2);
    expect(migrated[0]).toMatchObject({
      id: "PJR-AB12",
      status: "open",
      description: "一覧の短い要約。",
      registeredAt: "_TODO_",
      due: "_TODO_",
    });
    // 旧一覧の日付セルは、プロジェクトタイムゾーンの 21:00 を補って UTC の日時になる。
    expect(migrated[1]).toMatchObject({
      id: "PJR-CD34",
      status: "done",
      description: "A\\|B を移行する。",
      owner: "_TODO_",
      due: "-",
      completedAt: "2026-08-02T21:00:00Z",
      conclusion: "移行済み",
    });

    writeFileSync(
      paths.pjrIndexPath,
      [
        "---",
        "specdojo:",
        "  id: prj-0001:pjr-index",
        "  type: project",
        "  status: draft",
        "---",
        "",
        "# プロジェクト登録簿",
        "",
        "[登録項目一覧](./generated/pjr-index.md)",
        "",
      ].join("\n"),
      "utf8",
    );
    const rerun = planRegisterMigration(paths);
    expect(rerun).toMatchObject({
      sourceCount: 2,
      createdCount: 0,
      updatedCount: 0,
      unchangedCount: 2,
      files: [],
    });
  });

  it("全件検証で不整合があれば書き込み前に失敗し、部分適用を残さない", () => {
    const { paths } = makeFixture();
    const originalIndex = buildIndex([
      "| PJR-AB12 | closed | 不正状態 | 説明 | todo | high | ARC | 2026-08-01 | - | - | - | - |",
      "| PJR-CD34 | open | 後続項目 | 説明 | todo | high | ARC | 2026-08-01 | - | - | - | - |",
    ]);
    writeFileSync(paths.pjrIndexPath, originalIndex, "utf8");

    expect(() => planRegisterMigration(paths)).toThrow(
      /Migration verification failed|Invalid status/,
    );
    expect(readFileSync(paths.pjrIndexPath, "utf8")).toBe(originalIndex);
    expect(existsSync(join(paths.projectRegisterPath, "pjr-ab12-item.md"))).toBe(false);
    expect(existsSync(join(paths.projectRegisterPath, "pjr-cd34-item.md"))).toBe(false);
  });
});
