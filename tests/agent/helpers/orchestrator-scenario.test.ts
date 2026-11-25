import { describe, expect, it } from "vitest";
import {
  checkAfterApproval,
  compareBeforeApproval,
  parseClaudeJsonResult,
  type RepositoryState,
} from "./orchestrator-scenario.js";

const TICKET = "docs/ja/projects/prj-0001/controls/project-register/pjr-fa01-add-faq-section.md";
const EVENT = "docs/ja/projects/prj-0001/controls/project-register/events/pjr-fa01.yaml";

const baseline: RepositoryState = { head: "aaa", status: "", tickets: {}, events: {} };
const approved: RepositoryState = {
  head: "bbb",
  status: "",
  tickets: { [TICKET]: "h1" },
  events: { [EVENT]: "h2" },
};
const expectedFields = {
  item_type: "todo",
  item_status: "open",
  priority: "medium",
  owner: "owner",
  due_on: "2026-11-30",
  difficulty: "medium",
};

describe("parseClaudeJsonResult", () => {
  it("reads the session, reply, duration and cost from claude -p json output", () => {
    const stdout = JSON.stringify({
      type: "result",
      is_error: false,
      result: "起票してよろしいですか？",
      session_id: "s-1",
      duration_ms: 1200,
      total_cost_usd: 0.05,
    });

    expect(parseClaudeJsonResult(`${stdout}\n`)).toEqual({
      sessionId: "s-1",
      isError: false,
      resultText: "起票してよろしいですか？",
      durationMs: 1200,
      costUsd: 0.05,
    });
  });

  it("rejects output that is not JSON with the head of the output", () => {
    expect(() => parseClaudeJsonResult("Error: not logged in")).toThrow(
      /claude output is not JSON: Error: not logged in/,
    );
  });
});

describe("compareBeforeApproval", () => {
  it("returns no failures when nothing changed", () => {
    expect(compareBeforeApproval(baseline, { ...baseline })).toEqual([]);
  });

  it("reports a moved HEAD, a dirty tree and an added ticket before approval", () => {
    const after: RepositoryState = {
      head: "bbb",
      status: "?? x.md",
      tickets: { [TICKET]: "h1" },
      events: {},
    };

    expect(compareBeforeApproval(baseline, after)).toEqual([
      "HEAD moved: aaa -> bbb",
      "working tree changed:\n?? x.md",
      `ticket added: ${TICKET}`,
    ]);
  });
});

describe("checkAfterApproval", () => {
  it("accepts one committed ticket with the expected fields and an add event", () => {
    const failures = checkAfterApproval({
      before: baseline,
      after: approved,
      committedFiles: [TICKET, EVENT],
      readTicketFields: () => expectedFields,
      readEventActions: () => ["add"],
    });

    expect(failures).toEqual([]);
  });

  it("reports an uncommitted ticket and a wrong owner", () => {
    const failures = checkAfterApproval({
      before: baseline,
      after: { ...approved, head: "aaa" },
      committedFiles: [],
      readTicketFields: () => ({ ...expectedFields, owner: "indie" }),
      readEventActions: () => ["add"],
    });

    expect(failures).toEqual([
      "HEAD did not move (no commit)",
      "ticket owner: expected owner, got indie",
      `ticket is not committed: ${TICKET}`,
      `event is not committed: ${EVENT}`,
    ]);
  });
});
