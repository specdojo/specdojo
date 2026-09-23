import { describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  sortByRegisteredDesc,
  type PjrDisplayItem,
  type RegisterPaths,
} from "../../src/register.js";

function makeItem(overrides: Partial<PjrDisplayItem>): PjrDisplayItem {
  return {
    id: "PJR-0001",
    status: "open",
    title: "title",
    description: "-",
    type: "todo",
    priority: "medium",
    owner: "-",
    registered: "_TODO_",
    due: "-",
    completed: "-",
    conclusion: "-",
    ticket: "-",
    ...overrides,
  } as PjrDisplayItem;
}

function makePaths(root: string): RegisterPaths {
  return {
    projectId: "prj-test",
    projectRegisterPath: root,
    pjrIndexPath: join(root, "pjr-index.md"),
    generatedPath: join(root, "generated"),
    controlsGeneratedPath: join(root, "..", "generated"),
  } as RegisterPaths;
}

let eventSeq = 0;

function writeAddEvent(root: string, displayId: string, ts: string): void {
  const events = join(root, "events");
  mkdirSync(events, { recursive: true });
  eventSeq += 1;
  // id は reg_ + 32 桁の小文字 16 進が必須。連番から決定的に組み立てる。
  const eventId = `reg_${eventSeq.toString(16).padStart(32, "0")}`;
  writeFileSync(
    join(events, `${displayId.toLowerCase()}.yaml`),
    [
      "- v: 1",
      `  id: ${eventId}`,
      `  ts: "${ts}"`,
      "  action: add",
      "  actor: test",
      "  from_status: null",
      "  to_status: open",
      "  reason: item added",
      "  changes:",
      "    - field: status",
      '      from: ""',
      "      to: open",
      "",
    ].join("\n"),
    "utf8",
  );
}

describe("sortByRegisteredDesc", () => {
  it("新しい起票を先頭へ置く", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-view-order-"));
    try {
      const items = [
        makeItem({ id: "PJR-AAAA", registered: "2026-09-01" }),
        makeItem({ id: "PJR-BBBB", registered: "2026-09-10" }),
        makeItem({ id: "PJR-CCCC", registered: "2026-09-05" }),
      ];

      const actual = sortByRegisteredDesc(items, makePaths(root));

      expect(actual.map((item) => item.id)).toEqual(["PJR-BBBB", "PJR-CCCC", "PJR-AAAA"]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("同じ起票日では ID 昇順で安定させる", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-view-order-"));
    try {
      const items = [
        makeItem({ id: "PJR-ZZZZ", registered: "2026-09-10" }),
        makeItem({ id: "PJR-AAAA", registered: "2026-09-10" }),
      ];

      const actual = sortByRegisteredDesc(items, makePaths(root));

      expect(actual.map((item) => item.id)).toEqual(["PJR-AAAA", "PJR-ZZZZ"]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("registered が _TODO_ の項目は add イベントの ts で補う", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-view-order-"));
    try {
      writeAddEvent(root, "PJR-OLD1", "2026-08-01T00:00:00Z");
      writeAddEvent(root, "PJR-NEW1", "2026-09-20T00:00:00Z");
      const items = [
        makeItem({ id: "PJR-OLD1", registered: "_TODO_" }),
        makeItem({ id: "PJR-NEW1", registered: "_TODO_" }),
      ];

      const actual = sortByRegisteredDesc(items, makePaths(root));

      expect(actual.map((item) => item.id)).toEqual(["PJR-NEW1", "PJR-OLD1"]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("時刻を解決できない項目は末尾へ送り、解決できた項目の並びを乱さない", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-view-order-"));
    try {
      const items = [
        makeItem({ id: "PJR-NONE", registered: "_TODO_" }),
        makeItem({ id: "PJR-DATE", registered: "2026-09-01" }),
      ];

      const actual = sortByRegisteredDesc(items, makePaths(root));

      // add イベントが無い PJR-NONE は時刻を解決できないため末尾へ送る。
      expect(actual.map((item) => item.id)).toEqual(["PJR-DATE", "PJR-NONE"]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
