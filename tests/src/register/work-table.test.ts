import { describe, expect, it } from "vitest";
import {
  registerWorkTableIssueMessage,
  registerWorkTableIssues,
} from "../../../src/register/work-table.js";

function ticketWithRows(rows: string[]): string {
  return [
    "---",
    "specdojo:",
    "  id: prj-0001:pjr-ab12-topic",
    "  item_type: todo",
    "---",
    "",
    "# PJR-AB12 題名",
    "",
    "## 4. 作業内容",
    "",
    "| No  | 作業 | 担当 | 状態 | メモ |",
    "| --- | ---- | ---- | ---- | ---- |",
    ...rows,
    "",
    "## 5. 対応結果",
    "",
    "| No  | 状態 | メモ |",
    "| --- | ---- | ---- |",
    "| 1   | open | -    |",
    "",
  ].join("\n");
}

describe("registerWorkTableIssues", () => {
  it("returns no issues when every row is done or remains open with a reason", () => {
    const content = ticketWithRows([
      "| 1   | 実装 | DEV  | done | -    |",
      "| 2   | grade 起動 | DEV  | open | executor から起動できない |",
    ]);

    expect(registerWorkTableIssues(content)).toEqual([]);
  });

  it("reports a non-done row without a reason and a row that still contains _TODO_", () => {
    const content = ticketWithRows([
      "| 1   | 実装 | DEV  | open | -    |",
      "| 2   | _TODO_ | _TODO_ | open | -  |",
      "| 3   | 文書 | DEV  | in-progress |  |",
    ]);

    expect(registerWorkTableIssues(content)).toEqual([
      'row 1 is "open" without a reason in メモ',
      "row 2 still contains _TODO_",
      'row 3 is "in-progress" without a reason in メモ',
    ]);
  });

  it("ignores tickets without a 作業内容 table or a 状態 column", () => {
    expect(registerWorkTableIssues("# PJR-AB12 題名\n\n## 1. 概要\n\n本文\n")).toEqual([]);
    expect(
      registerWorkTableIssues(
        ["## 4. 作業内容", "", "| No  | 作業 |", "| --- | ---- |", "| 1   | 実装 |"].join("\n"),
      ),
    ).toEqual([]);
  });

  it("treats _TODO_ inside inline code as text rather than an unfilled marker", () => {
    const content = ticketWithRows(["| 1   | `_TODO_` の行を検査する | DEV  | done | -    |"]);

    expect(registerWorkTableIssues(content)).toEqual([]);
  });

  it("does not split cells at an escaped pipe", () => {
    const content = ticketWithRows(["| 1   | [[a\\|b]] | DEV  | done | -    |"]);

    expect(registerWorkTableIssues(content)).toEqual([]);
  });
});

describe("registerWorkTableIssueMessage", () => {
  it("names the item, lists the issues, and states how to fix the table", () => {
    expect(registerWorkTableIssueMessage("PJR-AB12", ["row 1 still contains _TODO_"])).toBe(
      "the 作業内容 table of PJR-AB12 does not match the work done: row 1 still contains _TODO_. " +
        "Set each row to done, or write why it remains in メモ.",
    );
  });
});
