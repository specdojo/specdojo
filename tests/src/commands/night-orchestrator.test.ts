import { describe, expect, it } from "vitest";
import {
  consecutiveFailureCount,
  parseRegisterRunSummary,
  renderNightReport,
  requiresDerivedApproval,
  selectApprovedNightItems,
} from "../../../src/commands/night-orchestrator.js";
import type { PjrItem } from "../../../src/register/register.js";

function item(id: string, overrides: Partial<PjrItem> = {}): PjrItem {
  return {
    id,
    status: "open",
    title: id,
    description: "test",
    type: "todo",
    priority: "medium",
    owner: "DEV",
    registeredAt: "2026-10-19T00:00:00Z",
    due: "-",
    completedAt: "-",
    conclusion: "-",
    ticket: `${id}.md`,
    ...overrides,
  };
}

describe("night orchestrator", () => {
  it("承認のない個票と実行対象外の type/status を queue に入れない", () => {
    const selected = selectApprovedNightItems(
      [
        item("PJR-AB12", { autopilot: "approved" }),
        item("PJR-AB13"),
        item("PJR-AB14", { autopilot: "approved", type: "decision" }),
        item("PJR-AB15", { autopilot: "approved", status: "waiting" }),
        item("PJR-AB17", { autopilot: "approved", type: "epic", track: "business" }),
        item("PJR-AB16", { autopilot: "approved", type: "issue" }),
      ],
      10,
    );
    expect(selected.map((entry) => entry.id)).toEqual(["PJR-AB12", "PJR-AB16"]);
  });

  it("一晩の件数上限を ID 順で適用する", () => {
    const selected = selectApprovedNightItems(
      ["PJR-AB15", "PJR-AB12", "PJR-AB14"].map((id) => item(id, { autopilot: "approved" })),
      2,
    );
    expect(selected.map((entry) => entry.id)).toEqual(["PJR-AB12", "PJR-AB14"]);
  });

  it("run summary を読み、成功で連続失敗数をリセットする", () => {
    const outcomes = parseRegisterRunSummary(`Register run summary:
  PJR-AB12  failure  transition=waiting  commit=incomplete  reason=blocked
  PJR-AB13  success  transition=done  commit=committed abc123
  PJR-AB14  failure  transition=waiting  commit=incomplete  reason=failed`);
    expect(outcomes).toHaveLength(3);
    expect(consecutiveFailureCount(1, outcomes)).toBe(1);
  });

  it("承認範囲外の失敗だけを derived approval の対象にする", () => {
    expect(
      requiresDerivedApproval({
        id: "PJR-AB12",
        outcome: "failure",
        transition: "waiting",
        reason: "protected configuration change required",
      }),
    ).toBe(true);
    expect(
      requiresDerivedApproval({
        id: "PJR-AB13",
        outcome: "failure",
        transition: "waiting",
        reason: "unit test failed",
      }),
    ).toBe(false);
  });

  it("close・waiting・新しい承認待ちを朝報告へまとめる", () => {
    const report = renderNightReport({
      projectId: "prj-0001",
      startedAt: "2026-10-19T17:00:00.000Z",
      completedAt: "2026-10-19T17:10:00.000Z",
      selected: [
        item("PJR-AB12", { autopilot: "approved" }),
        item("PJR-AB13", { autopilot: "approved" }),
      ],
      outcomes: [
        { id: "PJR-AB12", outcome: "success", transition: "done" },
        { id: "PJR-AB13", outcome: "failure", transition: "waiting", reason: "protected" },
      ],
      approvalIssues: new Map([["PJR-AB13", "PJR-CD34"]]),
    });
    expect(report).toContain("- close: PJR-AB12");
    expect(report).toContain("- `waiting`: PJR-AB13");
    expect(report).toContain("PJR-CD34（PJR-AB13 由来）");
  });
});
