import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  planRegisterTimestampMigration,
  summarizeTimestampMigration,
  type GitTimestampResolver,
  type RegisterItemGitTimestamps,
} from "../../src/register-migrate-timestamps.js";

// 旧日付キーを持つ個票。移行対象の入力になる。
function buildTicket(id: string, fields: string[]): string {
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
    ...fields.map((line) => `  ${line}`),
    "---",
    "",
    `# ${id} 在庫初期値を決める`,
    "",
    "## 1. 概要",
    "",
    "開店時の在庫初期値を決める。",
    "",
  ].join("\n");
}

// Git 履歴の代わりに、個票ファイル名から時刻を返す解決関数を差し込む。
function resolverFor(byFilename: Record<string, RegisterItemGitTimestamps>): GitTimestampResolver {
  return ({ filename }) => byFilename[filename] ?? {};
}

function withRegisterDir(fn: (dir: string) => void): void {
  const dir = mkdtempSync(join(tmpdir(), "specdojo-register-timestamps-"));
  try {
    fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe("planRegisterTimestampMigration", () => {
  it("Git 履歴の時刻が旧日付と同じ暦日を指す場合はその時刻を採用する", () => {
    withRegisterDir((dir) => {
      writeFileSync(
        join(dir, "pjr-ab12-topic.md"),
        buildTicket("PJR-AB12", [
          "item_status: done",
          "priority: high",
          'registered_on: "2026-08-01"',
          'completed_on: "2026-08-05"',
        ]),
        "utf8",
      );

      const plan = planRegisterTimestampMigration({
        projectRegisterPath: dir,
        timeZone: "UTC",
        resolveGitTimestamps: resolverFor({
          "pjr-ab12-topic.md": {
            addedAt: "2026-08-01T03:12:45Z",
            closedAt: "2026-08-05T17:40:00Z",
          },
        }),
      });

      expect(plan.targetCount).toBe(1);
      expect(plan.entries[0]).toMatchObject({
        id: "PJR-AB12",
        registeredAt: "2026-08-01T03:12:45Z",
        registeredSource: "git",
        completedAt: "2026-08-05T17:40:00Z",
        completedSource: "git",
      });
      expect(plan.files[0].content).toContain('registered_at: "2026-08-01T03:12:45Z"');
      expect(plan.files[0].content).not.toContain("registered_on");
    });
  });

  it("Git 履歴が無い場合は旧日付にプロジェクトタイムゾーンの 21:00 を補う", () => {
    withRegisterDir((dir) => {
      writeFileSync(
        join(dir, "pjr-ab12-topic.md"),
        buildTicket("PJR-AB12", ["item_status: open", 'registered_on: "2026-08-01"']),
        "utf8",
      );

      const plan = planRegisterTimestampMigration({
        projectRegisterPath: dir,
        timeZone: "Asia/Tokyo",
        resolveGitTimestamps: resolverFor({}),
      });

      // Asia/Tokyo の 2026-08-01 21:00 は UTC の 12:00。
      expect(plan.entries[0]).toMatchObject({
        registeredAt: "2026-08-01T12:00:00Z",
        registeredSource: "fallback",
      });
      expect(plan.entries[0].completedAt).toBeUndefined();
    });
  });

  it("Git 履歴の時刻が旧日付と別の暦日を指す場合は、表示日を守るため 21:00 へ退避する", () => {
    withRegisterDir((dir) => {
      writeFileSync(
        join(dir, "pjr-ab12-topic.md"),
        buildTicket("PJR-AB12", ["item_status: open", 'registered_on: "2026-08-01"']),
        "utf8",
      );

      const plan = planRegisterTimestampMigration({
        projectRegisterPath: dir,
        timeZone: "UTC",
        // 個票ファイルが起票より後に作られた場合、追加コミットの時刻は起票時刻ではない。
        resolveGitTimestamps: resolverFor({
          "pjr-ab12-topic.md": { addedAt: "2026-09-20T05:00:00Z" },
        }),
      });

      expect(plan.entries[0]).toMatchObject({
        registeredAt: "2026-08-01T21:00:00Z",
        registeredSource: "fallback",
      });
    });
  });

  it("移行済みの個票と旧日付キーを持たない個票は対象にしない", () => {
    withRegisterDir((dir) => {
      writeFileSync(
        join(dir, "pjr-ab12-topic.md"),
        buildTicket("PJR-AB12", ["item_status: open", 'registered_at: "2026-08-01T03:12:45Z"']),
        "utf8",
      );
      writeFileSync(
        join(dir, "pjr-cd34-topic.md"),
        buildTicket("PJR-CD34", ["item_status: open"]),
        "utf8",
      );
      writeFileSync(join(dir, "pjr-index.md"), "# 登録簿\n", "utf8");

      const plan = planRegisterTimestampMigration({
        projectRegisterPath: dir,
        timeZone: "UTC",
        resolveGitTimestamps: resolverFor({}),
      });

      expect(plan).toMatchObject({ targetCount: 0, entries: [], files: [] });
    });
  });

  it("計画の段階では個票を書き換えず、元の内容を保持する", () => {
    withRegisterDir((dir) => {
      const path = join(dir, "pjr-ab12-topic.md");
      const original = buildTicket("PJR-AB12", [
        "item_status: open",
        'registered_on: "2026-08-01"',
      ]);
      writeFileSync(path, original, "utf8");

      const plan = planRegisterTimestampMigration({
        projectRegisterPath: dir,
        timeZone: "UTC",
        resolveGitTimestamps: resolverFor({}),
      });

      expect(readFileSync(path, "utf8")).toBe(original);
      expect(plan.files[0].originalContent).toBe(original);
    });
  });
});

describe("summarizeTimestampMigration", () => {
  it("復元できた件数と補完した件数を項目別に数える", () => {
    withRegisterDir((dir) => {
      writeFileSync(
        join(dir, "pjr-ab12-topic.md"),
        buildTicket("PJR-AB12", [
          "item_status: done",
          'registered_on: "2026-08-01"',
          'completed_on: "2026-08-05"',
        ]),
        "utf8",
      );
      writeFileSync(
        join(dir, "pjr-cd34-topic.md"),
        buildTicket("PJR-CD34", ["item_status: open", 'registered_on: "2026-08-02"']),
        "utf8",
      );

      const plan = planRegisterTimestampMigration({
        projectRegisterPath: dir,
        timeZone: "UTC",
        resolveGitTimestamps: resolverFor({
          "pjr-ab12-topic.md": { addedAt: "2026-08-01T03:12:45Z" },
        }),
      });

      expect(summarizeTimestampMigration(plan)).toBe(
        "items=2, registered(git=1, fallback=1), completed(git=0, fallback=1)",
      );
    });
  });
});
