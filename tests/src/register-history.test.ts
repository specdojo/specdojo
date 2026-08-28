import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  buildRegisterHistoryEvents,
  collectRegisterHistoryEvents,
  formatRegisterHistoryEvents,
  parseRegisterLogOutput,
  type RegisterCommitEntry,
} from "../../src/register-history.js";
import { appendRegisterEvent, buildRegisterEvent } from "../../src/register-events.js";
import { gitEnvironment } from "../../src/exec-worktree.js";

// lefthook などの git フック配下でテストを実行すると、親の git が GIT_DIR / GIT_INDEX_FILE を
// 環境変数へ設定する。それを引き継いだまま git を起動すると、一時ディレクトリで実行したつもりの
// init / add / commit が実リポジトリへ適用される（core.bare の書き換えと不正コミットが発生する）。
// 一時リポジトリを扱う git はすべて隔離した環境で起動する。
function git(args: string[], cwd: string): void {
  execFileSync("git", args, { cwd, stdio: "ignore", env: gitEnvironment() });
}

const RECORD = "\u001e";
const UNIT = "\u001f";

const REGISTER_DIR = "docs/ja/projects/prj-0001/controls/project-register";

// git log --name-status の1コミット分の出力を組み立てる。
function logRecord(
  commit: string,
  date: string,
  author: string,
  subject: string,
  files: string[],
): string {
  return `${RECORD}${commit}${UNIT}${date}${UNIT}${author}${UNIT}${subject}\n${files.join("\n")}\n`;
}

// 個票ファイルの内容。登録項目フィールドは frontmatter 側で差し替える。
function ticket(
  fields: string[],
  title = "在庫初期値を決める",
  body = "開店時の在庫を決める。",
  docStatus = "draft",
): string {
  return [
    "---",
    "specdojo:",
    "  id: prj-0001:pjr-ab12-inventory-seed",
    "  type: project",
    `  status: ${docStatus}`,
    ...fields.map((line) => `  ${line}`),
    "---",
    "",
    `# PJR-AB12 ${title}`,
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

const OPEN_FIELDS = [
  "item_type: todo",
  "item_status: open",
  "priority: high",
  "owner: ARC",
  'registered_at: "2026-08-01T12:00:00Z"',
  'due_on: "2026-08-31"',
];

const DONE_FIELDS = [
  "item_type: todo",
  "item_status: done",
  "priority: high",
  "owner: ARC",
  'registered_at: "2026-08-01T12:00:00Z"',
  'due_on: "2026-08-31"',
  'completed_at: "2026-08-09T08:20:00Z"',
  "conclusion: 仕入れ最小ロットに合わせた",
];

describe("parseRegisterLogOutput", () => {
  it("コミットのヘッダーと name-status の行を1件ずつ組み立てる", () => {
    const output =
      logRecord("abc1234", "2026-08-01", "PM", "docs: add PJR-AB12", [
        `A\t${REGISTER_DIR}/pjr-ab12-inventory-seed.md`,
      ]) +
      logRecord("def5678", "2026-08-09", "ARC", "docs: close PJR-AB12", [
        `M\t${REGISTER_DIR}/pjr-ab12-inventory-seed.md`,
      ]);

    const actual = parseRegisterLogOutput(output);

    expect(actual).toEqual([
      {
        commit: "abc1234",
        date: "2026-08-01",
        author: "PM",
        subject: "docs: add PJR-AB12",
        files: [{ status: "A", path: `${REGISTER_DIR}/pjr-ab12-inventory-seed.md` }],
      },
      {
        commit: "def5678",
        date: "2026-08-09",
        author: "ARC",
        subject: "docs: close PJR-AB12",
        files: [{ status: "M", path: `${REGISTER_DIR}/pjr-ab12-inventory-seed.md` }],
      },
    ]);
  });

  it("rename の行から変更前後のパスを取り出す", () => {
    const output = logRecord("aaa1111", "2026-08-05", "ARC", "docs: renumber PJR-AB12", [
      `R100\t${REGISTER_DIR}/pjr-ab12-inventory-seed.md\t${REGISTER_DIR}/pjr-cd34-inventory-seed.md`,
    ]);

    expect(parseRegisterLogOutput(output)[0].files).toEqual([
      {
        status: "R100",
        path: `${REGISTER_DIR}/pjr-cd34-inventory-seed.md`,
        oldPath: `${REGISTER_DIR}/pjr-ab12-inventory-seed.md`,
      },
    ]);
  });

  it("出力が空のときは何も返さない", () => {
    expect(parseRegisterLogOutput("")).toEqual([]);
  });
});

describe("buildRegisterHistoryEvents", () => {
  const path = `${REGISTER_DIR}/pjr-ab12-inventory-seed.md`;

  it("個票の追加を added イベントとして記録する", () => {
    const commits: RegisterCommitEntry[] = [
      {
        commit: "abc1234",
        date: "2026-08-01",
        author: "PM",
        subject: "docs: add PJR-AB12",
        files: [{ status: "A", path }],
      },
    ];

    const actual = buildRegisterHistoryEvents(commits, () => ticket(OPEN_FIELDS));

    expect(actual).toHaveLength(1);
    expect(actual[0].id).toBe("PJR-AB12");
    expect(actual[0].kind).toBe("added");
    expect(actual[0].changes).toContainEqual({ field: "status", from: "", to: "open" });
    expect(actual[0].changes).toContainEqual({ field: "owner", from: "", to: "ARC" });
  });

  it("状態遷移と完了日・結論の変化を updated イベントの差分として記録する", () => {
    const commits: RegisterCommitEntry[] = [
      {
        commit: "def5678",
        date: "2026-08-09",
        author: "ARC",
        subject: "docs: close PJR-AB12",
        files: [{ status: "M", path }],
      },
    ];

    const actual = buildRegisterHistoryEvents(commits, (revision) =>
      revision.endsWith("^") ? ticket(OPEN_FIELDS) : ticket(DONE_FIELDS),
    );

    expect(actual).toHaveLength(1);
    expect(actual[0].kind).toBe("updated");
    expect(actual[0].changes).toEqual([
      { field: "status", from: "open", to: "done" },
      { field: "completed", from: "-", to: "2026-08-09" },
      { field: "conclusion", from: "-", to: "仕入れ最小ロットに合わせた" },
    ]);
  });

  it("waiting への遷移で conclusion ではなく block_reason の変化を記録する", () => {
    const commits: RegisterCommitEntry[] = [
      {
        commit: "wait1234",
        date: "2026-08-06",
        author: "ARC",
        subject: "exec(register PJR-AB12): wait",
        files: [{ status: "M", path }],
      },
    ];
    const waitingFields = [
      ...OPEN_FIELDS.map((line) => line.replace("item_status: open", "item_status: waiting")),
      "block_reason: 検証が失敗した",
    ];

    const actual = buildRegisterHistoryEvents(commits, (revision) =>
      revision.endsWith("^") ? ticket(OPEN_FIELDS) : ticket(waitingFields),
    );

    expect(actual[0].changes).toEqual([
      { field: "status", from: "open", to: "waiting" },
      { field: "block_reason", from: "-", to: "検証が失敗した" },
    ]);
    expect(actual[0].changes.some((change) => change.field === "conclusion")).toBe(false);
  });

  it("一覧の列に現れない変更（文書成熟度 status）だけのコミットはイベントにしない", () => {
    const commits: RegisterCommitEntry[] = [
      {
        commit: "bbb2222",
        date: "2026-08-05",
        author: "ARC",
        subject: "docs: promote ticket to ready",
        files: [{ status: "M", path }],
      },
    ];

    const actual = buildRegisterHistoryEvents(commits, (revision) =>
      revision.endsWith("^")
        ? ticket(OPEN_FIELDS, "在庫初期値を決める", "開店時の在庫を決める。", "draft")
        : ticket(OPEN_FIELDS, "在庫初期値を決める", "開店時の在庫を決める。", "ready"),
    );

    expect(actual).toEqual([]);
  });

  it("renumber による ID 付け替えを id の変更として記録する", () => {
    const renamedPath = `${REGISTER_DIR}/pjr-cd34-inventory-seed.md`;
    const commits: RegisterCommitEntry[] = [
      {
        commit: "aaa1111",
        date: "2026-08-05",
        author: "ARC",
        subject: "docs: renumber PJR-AB12",
        files: [{ status: "R100", path: renamedPath, oldPath: path }],
      },
    ];

    const actual = buildRegisterHistoryEvents(commits, () => ticket(OPEN_FIELDS));

    expect(actual).toHaveLength(1);
    expect(actual[0].id).toBe("PJR-CD34");
    expect(actual[0].changes[0]).toEqual({ field: "id", from: "PJR-AB12", to: "PJR-CD34" });
  });

  it("個票の削除を removed イベントとして記録する", () => {
    const commits: RegisterCommitEntry[] = [
      {
        commit: "ccc3333",
        date: "2026-08-06",
        author: "ARC",
        subject: "docs: remove PJR-AB12",
        files: [{ status: "D", path }],
      },
    ];

    const actual = buildRegisterHistoryEvents(commits, () => ticket(OPEN_FIELDS));

    expect(actual).toEqual([
      {
        id: "PJR-AB12",
        commit: "ccc3333",
        date: "2026-08-06",
        author: "ARC",
        subject: "docs: remove PJR-AB12",
        kind: "removed",
        file: path,
        changes: [],
      },
    ]);
  });

  it("個票以外のファイルと生成物は対象にしない", () => {
    const commits: RegisterCommitEntry[] = [
      {
        commit: "ddd4444",
        date: "2026-08-07",
        author: "ARC",
        subject: "docs: regenerate views",
        files: [
          { status: "M", path: `${REGISTER_DIR}/generated/pjr-index.md` },
          { status: "M", path: `${REGISTER_DIR}/README.md` },
        ],
      },
    ];

    expect(buildRegisterHistoryEvents(commits, () => ticket(OPEN_FIELDS))).toEqual([]);
  });

  it("--id 相当の絞り込みで指定した項目だけを残す", () => {
    const otherPath = `${REGISTER_DIR}/pjr-cd34-price-list.md`;
    const commits: RegisterCommitEntry[] = [
      {
        commit: "eee5555",
        date: "2026-08-08",
        author: "ARC",
        subject: "docs: add two items",
        files: [
          { status: "A", path },
          { status: "A", path: otherPath },
        ],
      },
    ];

    const actual = buildRegisterHistoryEvents(commits, () => ticket(OPEN_FIELDS), {
      ids: ["PJR-CD34"],
    });

    expect(actual.map((event) => event.id)).toEqual(["PJR-CD34"]);
  });

  it("statusOnly では状態遷移のないコミットを落とし、遷移に関わる項目だけを残す", () => {
    const commits: RegisterCommitEntry[] = [
      {
        commit: "fff6666",
        date: "2026-08-02",
        author: "ARC",
        subject: "docs: update owner",
        files: [{ status: "M", path }],
      },
      {
        commit: "999aaaa",
        date: "2026-08-09",
        author: "ARC",
        subject: "docs: close PJR-AB12",
        files: [{ status: "M", path }],
      },
    ];

    const readAt = (revision: string, _path: string): string => {
      if (revision.startsWith("fff6666")) {
        return revision.endsWith("^")
          ? ticket(OPEN_FIELDS)
          : ticket(OPEN_FIELDS.map((line) => line.replace("owner: ARC", "owner: PM")));
      }
      return revision.endsWith("^")
        ? ticket(OPEN_FIELDS, "在庫初期値を決める", "旧説明。")
        : ticket(DONE_FIELDS, "在庫初期値を決める", "新説明。");
    };

    const actual = buildRegisterHistoryEvents(commits, readAt, { statusOnly: true });

    expect(actual).toHaveLength(1);
    expect(actual[0].commit).toBe("999aaaa");
    expect(actual[0].changes.map((change) => change.field)).toEqual([
      "status",
      "completed",
      "conclusion",
    ]);
  });

  it("同一コミット内の複数個票をパス順に並べる", () => {
    const first = `${REGISTER_DIR}/pjr-ab12-inventory-seed.md`;
    const second = `${REGISTER_DIR}/pjr-cd34-price-list.md`;
    const commits: RegisterCommitEntry[] = [
      {
        commit: "abc1234",
        date: "2026-08-01",
        author: "PM",
        subject: "docs: add two items",
        files: [
          { status: "A", path: second },
          { status: "A", path: first },
        ],
      },
    ];

    const actual = buildRegisterHistoryEvents(commits, () => ticket(OPEN_FIELDS));

    expect(actual.map((event) => event.file)).toEqual([first, second]);
  });
});

describe("formatRegisterHistoryEvents", () => {
  it("日付・短縮 SHA・ID・種別・変更内容・件名を1行で並べる", () => {
    const actual = formatRegisterHistoryEvents([
      {
        id: "PJR-AB12",
        commit: "def5678901234567890",
        date: "2026-08-09",
        author: "ARC",
        subject: "docs: close PJR-AB12",
        kind: "updated",
        file: `${REGISTER_DIR}/pjr-ab12-inventory-seed.md`,
        changes: [
          { field: "status", from: "open", to: "done" },
          { field: "completed", from: "-", to: "2026-08-09" },
        ],
      },
    ]);

    expect(actual).toBe(
      "2026-08-09  def5678  PJR-AB12  updated  status: open -> done; completed: - -> 2026-08-09  # docs: close PJR-AB12",
    );
  });

  it("added では未定のプレースホルダを出さず、値のある項目だけを並べる", () => {
    const actual = formatRegisterHistoryEvents([
      {
        id: "PJR-AB12",
        commit: "abc1234567890",
        date: "2026-08-01",
        author: "PM",
        subject: "docs: add PJR-AB12",
        kind: "added",
        file: `${REGISTER_DIR}/pjr-ab12-inventory-seed.md`,
        changes: [
          { field: "status", from: "", to: "open" },
          { field: "owner", from: "", to: "_TODO_" },
          { field: "completed", from: "", to: "-" },
        ],
      },
    ]);

    expect(actual).toBe(
      "2026-08-01  abc1234  PJR-AB12  added    status=open  # docs: add PJR-AB12",
    );
  });

  it("removed ではファイル削除であることを示す", () => {
    const actual = formatRegisterHistoryEvents([
      {
        id: "PJR-AB12",
        commit: "ccc3333333333",
        date: "2026-08-06",
        author: "ARC",
        subject: "docs: remove PJR-AB12",
        kind: "removed",
        file: `${REGISTER_DIR}/pjr-ab12-inventory-seed.md`,
        changes: [],
      },
    ]);

    expect(actual).toBe(
      "2026-08-06  ccc3333  PJR-AB12  removed  (register item file removed)  # docs: remove PJR-AB12",
    );
  });
});

describe("collectRegisterHistoryEvents — append-only events", () => {
  it("複数の状態遷移を1コミットへまとめてもイベント粒度で再構成する", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-register-event-history-"));
    try {
      const registerDir = join(root, REGISTER_DIR);
      mkdirSync(registerDir, { recursive: true });
      const path = join(registerDir, "pjr-ab12-inventory-seed.md");
      const filename = "pjr-ab12-inventory-seed.md";

      let content = ticket(OPEN_FIELDS);
      const add = buildRegisterEvent({
        afterContent: content,
        filename,
        timeZone: "UTC",
        action: "add",
        actor: "pm",
        reason: "item added",
        ts: "2026-08-01T00:00:00Z",
        id: "reg_00000000000000000000000000000001",
      });
      if (!add) throw new Error("add event not built");
      content = appendRegisterEvent(content, add);

      let after = content.replace("item_status: open", "item_status: in-progress");
      const start = buildRegisterEvent({
        beforeContent: content,
        afterContent: after,
        filename,
        timeZone: "UTC",
        action: "start",
        actor: "agent",
        reason: "work started",
        ts: "2026-08-02T00:00:00Z",
        id: "reg_00000000000000000000000000000002",
      });
      if (!start) throw new Error("start event not built");
      content = appendRegisterEvent(after, start);

      after = content.replace("item_status: in-progress", "item_status: review");
      const review = buildRegisterEvent({
        beforeContent: content,
        afterContent: after,
        filename,
        timeZone: "UTC",
        action: "review",
        actor: "agent",
        reason: "ready for review",
        ts: "2026-08-03T00:00:00Z",
        id: "reg_00000000000000000000000000000003",
      });
      if (!review) throw new Error("review event not built");
      content = appendRegisterEvent(after, review);
      writeFileSync(path, content, "utf8");

      git(["init"], root);
      git(["config", "user.name", "test"], root);
      git(["config", "user.email", "test@example.com"], root);
      git(["add", "."], root);
      git(["commit", "-m", "squashed register transitions"], root);

      const events = collectRegisterHistoryEvents({
        repoRoot: root,
        registerPathspec: REGISTER_DIR,
        timeZone: "UTC",
      });
      expect(events.map((event) => event.action)).toEqual(["add", "start", "review"]);
      expect(events.map((event) => event.date)).toEqual([
        "2026-08-01T00:00:00Z",
        "2026-08-02T00:00:00Z",
        "2026-08-03T00:00:00Z",
      ]);
      expect(new Set(events.map((event) => event.commit)).size).toBe(3);
      expect(readFileSync(path, "utf8")).toContain("register_events:");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
