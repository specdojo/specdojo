import { describe, expect, it } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  applyRegisterItemFields,
  applyRegisterItemTimestamps,
  descriptionFromBody,
  displayIdFromTicketFilename,
  loadRegisterItemDocs,
  readRegisterItemContent,
  readRegisterItemLegacyDates,
  registerItemFieldsFromItem,
  setRegisterItemDescription,
  setRegisterItemTitle,
  titleFromBody,
  toDisplayItem,
  validateRegisterItemDocs,
  type PjrItem,
} from "../../src/register-item.js";
import { buildValidator } from "../helpers/schema.js";

// 登録項目の個票。frontmatter の登録項目フィールドは可変にして、
// 移行済み（item_status あり）と未移行（なし）の両方を作れるようにする。
function buildItemFile(extraFields: string[] = [], body?: string): string {
  return [
    "---",
    "specdojo:",
    "  id: prj-0001:pjr-ab12-inventory-seed",
    "  type: project",
    "  status: draft",
    "  rulebook: specdojo:pjr-rulebook",
    "  part_of:",
    "    - prj-0001:pjr-index",
    "  item_type: todo",
    ...extraFields.map((line) => `  ${line}`),
    "---",
    "",
    "# PJR-AB12 駄菓子の在庫初期値を決める",
    "",
    "## 1. 概要",
    "",
    body ?? "開店時の在庫初期値を決める。仕入れ先の最小ロットに合わせる。",
    "",
    "## 2. 完了条件",
    "",
    "- 初期値が決まっている。",
    "",
  ].join("\n");
}

const MIGRATED_FIELDS = [
  "item_status: in-progress",
  "priority: high",
  "owner: ARC",
  'registered_at: "2026-08-01T12:34:56Z"',
  'due_on: "2026-08-31"',
];

describe("displayIdFromTicketFilename", () => {
  it("個票ファイル名から表示 ID を大文字で取り出す", () => {
    expect(displayIdFromTicketFilename("pjr-ab12-inventory-seed.md")).toBe("PJR-AB12");
  });

  it("旧来の数字 4 桁 ID も従来どおり解釈する", () => {
    expect(displayIdFromTicketFilename("pjr-0137-register-id-uniqueness.md")).toBe("PJR-0137");
  });

  it("一覧本体や命名規約外のファイルは対象外にする", () => {
    expect(displayIdFromTicketFilename("pjr-index.md")).toBeUndefined();
    expect(displayIdFromTicketFilename("pjr-views.md")).toBeUndefined();
  });
});

describe("titleFromBody / descriptionFromBody — 一覧列の導出", () => {
  it("H1 から表示 ID を除いた部分をタイトルにする", () => {
    expect(titleFromBody("# PJR-AB12 駄菓子の在庫初期値を決める", "PJR-AB12")).toBe(
      "駄菓子の在庫初期値を決める",
    );
  });

  it("最初の章の段落を説明にし、セル区切りの `|` をエスケープする", () => {
    const body = ["# PJR-AB12 題名", "", "## 1. 概要", "", "A|B を決める。", ""].join("\n");

    expect(descriptionFromBody(body)).toBe("A\\|B を決める。");
  });

  it("未記入プレースホルダの段落は `_TODO_` として扱う", () => {
    const body = ["# PJR-AB12 題名", "", "## 1. 概要", "", "_TODO_: 作業と理由を書く。", ""].join(
      "\n",
    );

    expect(descriptionFromBody(body)).toBe("_TODO_");
  });
});

describe("readRegisterItemContent — 個票からの一覧行の導出", () => {
  it("frontmatter の登録項目フィールドを一覧の値として返す", () => {
    const parsed = readRegisterItemContent(
      buildItemFile(MIGRATED_FIELDS),
      "pjr-ab12-inventory-seed.md",
    );

    expect(parsed?.hasRegisterFields).toBe(true);
    expect(parsed?.item).toEqual({
      id: "PJR-AB12",
      status: "in-progress",
      title: "駄菓子の在庫初期値を決める",
      description: "開店時の在庫初期値を決める。仕入れ先の最小ロットに合わせる。",
      type: "todo",
      priority: "high",
      owner: "ARC",
      registeredAt: "2026-08-01T12:34:56Z",
      due: "2026-08-31",
      completedAt: "-",
      conclusion: "-",
      ticket: "[pjr-ab12-inventory-seed](./pjr-ab12-inventory-seed.md)",
    });
  });

  it("登録項目フィールドを持たない個票は hasRegisterFields=false を返す", () => {
    const parsed = readRegisterItemContent(buildItemFile(), "pjr-ab12-inventory-seed.md");

    expect(parsed?.hasRegisterFields).toBe(false);
    // 省略キーは一覧の表示プレースホルダへ変換する。
    expect(parsed?.item.owner).toBe("_TODO_");
    expect(parsed?.item.registeredAt).toBe("_TODO_");
  });

  it("期限の未定（キー省略）と期限なし（null）を表示上も区別する", () => {
    const undecided = readRegisterItemContent(buildItemFile(), "pjr-ab12-inventory-seed.md");
    const none = readRegisterItemContent(
      buildItemFile(["due_on: null"]),
      "pjr-ab12-inventory-seed.md",
    );

    expect(undecided?.item.due).toBe("_TODO_");
    expect(none?.item.due).toBe("-");
  });

  it("命名規約外のファイル名は undefined を返す", () => {
    expect(readRegisterItemContent(buildItemFile(), "notes.md")).toBeUndefined();
  });
});

describe("toDisplayItem — 保存した日時から一覧の暦日を導出する", () => {
  const item: PjrItem = {
    id: "PJR-AB12",
    status: "done",
    title: "題名",
    description: "説明",
    type: "todo",
    priority: "medium",
    owner: "ARC",
    registeredAt: "2026-08-01T15:30:00Z",
    due: "2026-08-31",
    completedAt: "2026-08-05T15:30:00Z",
    conclusion: "-",
    ticket: "-",
  };

  it("プロジェクトタイムゾーンへ変換した暦日を登録日・完了日にする", () => {
    expect(toDisplayItem(item, "UTC")).toMatchObject({
      registered: "2026-08-01",
      completed: "2026-08-05",
    });
    // UTC 15:30 は Asia/Tokyo では翌日 00:30 になる。
    expect(toDisplayItem(item, "Asia/Tokyo")).toMatchObject({
      registered: "2026-08-02",
      completed: "2026-08-06",
    });
  });

  it("期限は瞬間ではなく暦日のため、タイムゾーン変換の対象にしない", () => {
    expect(toDisplayItem(item, "Asia/Tokyo").due).toBe("2026-08-31");
  });

  it("プレースホルダ（`_TODO_` / `-`）はそのまま表示値として残す", () => {
    const undecided: PjrItem = { ...item, registeredAt: "_TODO_", completedAt: "-" };

    expect(toDisplayItem(undecided, "Asia/Tokyo")).toMatchObject({
      registered: "_TODO_",
      completed: "-",
    });
  });
});

describe("readRegisterItemLegacyDates / applyRegisterItemTimestamps — 日時への移行", () => {
  const legacyFields = [
    "item_status: done",
    "priority: high",
    "owner: ARC",
    'registered_on: "2026-08-01"',
    'due_on: "2026-08-31"',
    'completed_on: "2026-08-05"',
  ];

  it("移行前の個票から旧日付キーを読み出す", () => {
    expect(readRegisterItemLegacyDates(buildItemFile(legacyFields))).toEqual({
      registeredOn: "2026-08-01",
      completedOn: "2026-08-05",
    });
  });

  it("移行済み・frontmatter 無しの内容では旧日付キーを返さない", () => {
    expect(readRegisterItemLegacyDates(buildItemFile(MIGRATED_FIELDS))).toEqual({
      registeredOn: undefined,
      completedOn: undefined,
    });
    expect(readRegisterItemLegacyDates("# 見出しのみ\n")).toEqual({});
  });

  it("旧日付キーを取り除き、UTC の日時キーへ置き換える", () => {
    const migrated = applyRegisterItemTimestamps(buildItemFile(legacyFields), {
      registeredAt: "2026-08-01T12:34:56Z",
      completedAt: "2026-08-05T09:00:00Z",
    });

    expect(migrated).not.toContain("registered_on");
    expect(migrated).not.toContain("completed_on");
    expect(migrated).toContain('  registered_at: "2026-08-01T12:34:56Z"');
    expect(migrated).toContain('  completed_at: "2026-08-05T09:00:00Z"');
    // 期限は暦日のまま維持し、本文も書き換えない。
    expect(migrated).toContain('  due_on: "2026-08-31"');
    expect(migrated).toContain("# PJR-AB12 駄菓子の在庫初期値を決める");
  });

  it("完了日を持たない項目は完了日時のキーを追加しない", () => {
    const migrated = applyRegisterItemTimestamps(
      buildItemFile(["item_status: open", 'registered_on: "2026-08-01"']),
      { registeredAt: "2026-08-01T12:34:56Z" },
    );

    expect(migrated).toContain('  registered_at: "2026-08-01T12:34:56Z"');
    expect(migrated).not.toContain("completed_at");
  });
});

describe("loadRegisterItemDocs — 登録簿ディレクトリの走査", () => {
  it("個票だけを ID 昇順で読み、一覧本体と無関係なファイルを除外する", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-register-items-"));
    try {
      writeFileSync(join(dir, "pjr-zz99-later.md"), buildItemFile(MIGRATED_FIELDS), "utf8");
      writeFileSync(join(dir, "pjr-ab12-inventory-seed.md"), buildItemFile(), "utf8");
      writeFileSync(join(dir, "pjr-index.md"), "# 登録簿\n", "utf8");
      writeFileSync(join(dir, "README.md"), "# readme\n", "utf8");

      const docs = loadRegisterItemDocs(dir);

      expect(docs.map((doc) => doc.id)).toEqual(["PJR-AB12", "PJR-ZZ99"]);
      expect(docs[0].hasRegisterFields).toBe(false);
      expect(docs[1].hasRegisterFields).toBe(true);
      expect(docs[1].path).toBe(join(dir, "pjr-zz99-later.md"));
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("ディレクトリが存在しない場合は空配列を返す", () => {
    expect(loadRegisterItemDocs(join(tmpdir(), "specdojo-missing-register-dir"))).toEqual([]);
  });
});

describe("validateRegisterItemDocs — 個票正本の横断検証", () => {
  it("重複した表示 ID と、ファイル名・frontmatter ID の不一致を対象ファイル付きで報告する", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-register-validation-"));
    try {
      writeFileSync(join(dir, "pjr-ab12-first.md"), buildItemFile(MIGRATED_FIELDS), "utf8");
      writeFileSync(
        join(dir, "pjr-ab12-second.md"),
        buildItemFile(MIGRATED_FIELDS).replace("pjr-ab12-inventory-seed", "pjr-cd34-second"),
        "utf8",
      );

      expect(validateRegisterItemDocs(dir).errors).toEqual([
        'pjr-ab12-first.md: PJR-AB12 must match frontmatter id "prj-0001:pjr-ab12-inventory-seed" (expected *:pjr-ab12-first)',
        'pjr-ab12-second.md: PJR-AB12 must match frontmatter id "prj-0001:pjr-cd34-second" (expected *:pjr-ab12-second)',
        "PJR-AB12: duplicate register item ID in pjr-ab12-first.md and pjr-ab12-second.md",
      ]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe("register-item-frontmatter schema — enum 検証", () => {
  it("不正な item_status と priority を拒否する", () => {
    const validator = buildValidator(
      "docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml",
    );
    const data = {
      specdojo: {
        id: "prj-0001:pjr-ab12-inventory-seed",
        type: "project",
        status: "draft",
        rulebook: "specdojo:pjr-rulebook",
        part_of: ["prj-0001:pjr-index"],
        item_type: "todo",
        item_status: "running",
        priority: "urgent",
      },
    };

    expect(validator(data)).toBe(false);
    expect(validator.errors?.map((error) => error.instancePath)).toEqual(
      expect.arrayContaining(["/specdojo/item_status", "/specdojo/priority"]),
    );
  });
});

describe("applyRegisterItemFields — 個票 frontmatter への書き込み", () => {
  it("登録項目フィールドを追記し、日時を引用符付き文字列で書く", () => {
    const updated = applyRegisterItemFields(buildItemFile(), {
      item_status: "review",
      priority: "high",
      owner: "ARC",
      registered_at: "2026-08-01T12:34:56Z",
    });

    expect(updated).toContain("  item_status: review");
    expect(updated).toContain("  priority: high");
    expect(updated).toContain('  registered_at: "2026-08-01T12:34:56Z"');
    // 本文は書き換えない。
    expect(updated).toContain("# PJR-AB12 駄菓子の在庫初期値を決める");
    expect(updated).toContain("## 2. 完了条件");
  });

  it("値 null のキーは削除する（reopen で完了日時を消す場合）", () => {
    const closed = applyRegisterItemFields(buildItemFile(MIGRATED_FIELDS), {
      item_status: "done",
      completed_at: "2026-08-05T09:00:00Z",
    });

    const reopened = applyRegisterItemFields(closed, {
      item_status: "open",
      completed_at: null,
    });

    expect(closed).toContain('  completed_at: "2026-08-05T09:00:00Z"');
    expect(reopened).not.toContain("completed_at");
    expect(reopened).toContain("  item_status: open");
  });

  it("キー順を登録項目の並びへ正規化する", () => {
    const updated = applyRegisterItemFields(buildItemFile(), {
      conclusion: "対応済み",
      item_status: "done",
      completed_at: "2026-08-05T09:00:00Z",
    });

    const keys = [...updated.matchAll(/^ {2}([a-z_]+):/gm)].map((match) => match[1]);
    expect(keys).toEqual([
      "id",
      "type",
      "status",
      "rulebook",
      "part_of",
      "item_type",
      "item_status",
      "completed_at",
      "conclusion",
    ]);
  });

  it("frontmatter が無い場合は文脈付きで失敗する", () => {
    expect(() => applyRegisterItemFields("# 見出しのみ\n", { item_status: "open" })).toThrow(
      /frontmatter not found in register item file/,
    );
  });
});

describe("setRegisterItemTitle / setRegisterItemDescription — 本文側の項目値", () => {
  it("H1 のタイトルだけを差し替え、表示 ID は保持する", () => {
    const updated = setRegisterItemTitle(buildItemFile(), "在庫初期値を見直す");

    expect(updated).toContain("# PJR-AB12 在庫初期値を見直す");
  });

  it("最初の章の段落を差し替える", () => {
    const updated = setRegisterItemDescription(buildItemFile(), "仕入れ先変更に伴う見直し。");

    expect(updated).toContain("仕入れ先変更に伴う見直し。");
    expect(updated).not.toContain("開店時の在庫初期値を決める。");
    expect(updated).toContain("## 2. 完了条件");
  });
});

describe("registerItemFieldsFromItem — 一覧値から frontmatter フィールドへの写像", () => {
  it("表示プレースホルダはキー削除（null）へ変換する", () => {
    const item: PjrItem = {
      id: "PJR-AB12",
      status: "open",
      title: "題名",
      description: "説明",
      type: "todo",
      priority: "medium",
      owner: "_TODO_",
      registeredAt: "2026-08-01T12:34:56Z",
      due: "-",
      completedAt: "-",
      conclusion: "-",
      ticket: "-",
    };

    expect(registerItemFieldsFromItem(item)).toEqual({
      item_type: "todo",
      item_status: "open",
      priority: "medium",
      owner: null,
      registered_at: "2026-08-01T12:34:56Z",
      due_on: null,
      completed_at: null,
      conclusion: null,
    });
  });

  it("期限未定はキー削除、期限なしは YAML null へ写像する", () => {
    const base: PjrItem = {
      id: "PJR-AB12",
      status: "open",
      title: "題名",
      description: "説明",
      type: "todo",
      priority: "medium",
      owner: "ARC",
      registeredAt: "2026-08-01T12:34:56Z",
      due: "_TODO_",
      completedAt: "-",
      conclusion: "-",
      ticket: "-",
    };

    const undecided = applyRegisterItemFields(buildItemFile(["due_on: null"]), {
      due_on: registerItemFieldsFromItem(base).due_on,
    });
    const none = applyRegisterItemFields(buildItemFile(), {
      due_on: registerItemFieldsFromItem({ ...base, due: "-" }).due_on,
    });

    expect(undecided).not.toContain("due_on");
    expect(none).toContain("  due_on: null");
  });
});
