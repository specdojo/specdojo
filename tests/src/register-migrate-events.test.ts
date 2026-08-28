import { describe, expect, it } from "vitest";
import { legacyHistoryEventToRegisterEvent } from "../../src/register.js";

// 同じ個票が Git 履歴上で複数回 `added` として現れる状況（worktree のブランチで作成した個票が
// 統合ブランチへ再度追加された場合など）を再現する。実データの移行で PJR-0159 が該当し、
// 状態連鎖の検証に失敗した。
const ADD_CHANGES = [
  { field: "status", from: "", to: "open" },
  { field: "title", from: "", to: "在庫初期値を決める" },
  { field: "owner", from: "", to: "ARC" },
];

function historyEvent(overrides: Partial<Parameters<typeof legacyHistoryEventToRegisterEvent>[0]>) {
  return {
    id: "PJR-AB12",
    commit: "abc1234567890",
    date: "2026-08-01T00:00:00Z",
    author: "PM",
    subject: "docs: add PJR-AB12",
    kind: "added" as const,
    changes: ADD_CHANGES,
    ...overrides,
  };
}

describe("legacyHistoryEventToRegisterEvent", () => {
  it("最初の added は起点として from_status を null にする", () => {
    const event = legacyHistoryEventToRegisterEvent(historyEvent({}), {
      isFirst: true,
      currentStatus: null,
      fallbackStatus: "open",
    });
    expect(event.action).toBe("add");
    expect(event.from_status).toBeNull();
    expect(event.to_status).toBe("open");
  });

  it("2件目以降の added は更新として直前の状態へ接続する", () => {
    const event = legacyHistoryEventToRegisterEvent(
      historyEvent({ commit: "def4567890123", subject: "docs: re-add PJR-AB12" }),
      { isFirst: false, currentStatus: "open", fallbackStatus: "open" },
    );
    expect(event.action).toBe("update");
    expect(event.from_status).toBe("open");
    expect(event.to_status).toBe("open");
    // 実際には状態が変わらないため、status の差分は残さない（from_status / to_status と矛盾させない）。
    expect(event.changes.some((change) => change.field === "status")).toBe(false);
    expect(event.changes).toContainEqual({ field: "owner", from: "", to: "ARC" });
  });

  it("再追加の直前が終了状態でも、その状態から接続する", () => {
    const event = legacyHistoryEventToRegisterEvent(
      historyEvent({
        commit: "0123456789abc",
        changes: [{ field: "status", from: "", to: "done" }],
      }),
      { isFirst: false, currentStatus: "done", fallbackStatus: "done" },
    );
    expect(event.from_status).toBe("done");
    expect(event.to_status).toBe("done");
    expect(event.changes).toEqual([]);
  });

  it("event ID は commit・項目 ID・変更内容から決定的に定まる", () => {
    const context = { isFirst: true, currentStatus: null, fallbackStatus: "open" };
    const first = legacyHistoryEventToRegisterEvent(historyEvent({}), context);
    const second = legacyHistoryEventToRegisterEvent(historyEvent({}), context);
    expect(first.id).toBe(second.id);
  });
});
