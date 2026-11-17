import { describe, expect, it } from "vitest";
import { appendSmokeTargets, verifySmokeEvents } from "../../../src/exec/smoke.js";
import type { RegisterEventV1 } from "../../../src/register/events.js";

const marker = (ids: string) =>
  `<!-- specdojo:smoke-targets -->\n${ids}\n<!-- /specdojo:smoke-targets -->`;

describe("appendSmokeTargets", () => {
  it("appends only missing IDs within the legacy completion list", () => {
    const content = "# smoke\n\n- 対象（PJR-AB12・PJR-CD34）のうち最新を確認。\n\n既存 PJR-EF56";
    const updated = appendSmokeTargets(content, ["PJR-CD34", "PJR-EF56", "PJR-EF56"]);
    expect(updated).toBe(content.replace("PJR-CD34）のうち", "PJR-CD34・PJR-EF56）のうち"));
    expect(appendSmokeTargets(updated, ["PJR-EF56"])).toBe(updated);
  });

  it("supports an empty or populated explicit list in any project", () => {
    expect(appendSmokeTargets(marker(""), ["PJR-AB12"])).toContain("\nPJR-AB12\n<!-- /specdojo");
    const updated = appendSmokeTargets(marker("PJR-AB12"), ["PJR-CD34"]);
    expect(updated).toContain("PJR-AB12\nPJR-CD34\n");
    expect(appendSmokeTargets(updated, ["PJR-AB12", "PJR-CD34"])).toBe(updated);
  });

  it.each(["No target list", marker("") + marker(""), "（PJR-AB12）のうち\n（PJR-CD34）のうち"])(
    "rejects missing or ambiguous lists: %s",
    (content) => expect(() => appendSmokeTargets(content, ["PJR-EF56"])).toThrow("Expected one"),
  );
});

function event(action: RegisterEventV1["action"], actor = "sonnet-executor"): RegisterEventV1 {
  return {
    v: 1,
    id: `reg_${action}`,
    ts: "2026-11-17T00:00:00Z",
    action,
    actor,
    from_status: action === "review" ? "in-progress" : "open",
    to_status: action === "review" ? "review" : "in-progress",
    reason: "test",
    changes: [],
  };
}

describe("verifySmokeEvents", () => {
  const start = event("start");
  const review = event("review");
  const old = [
    event("update"),
    { ...start, id: "previous-start" },
    { ...review, id: "previous-review" },
  ];

  it("requires events from the current invocation and returns their concrete actor evidence", () => {
    expect(verifySmokeEvents(old, [...old, start, review], "sonnet-executor")).toEqual({
      start,
      review,
    });
  });

  it("does not accept a previous successful run", () => {
    expect(() => verifySmokeEvents(old, old, "sonnet-executor")).toThrow("one new start");
  });

  it.each([
    [review, start],
    [start],
    [review],
    [start, start, review],
    [start, event("wait"), review],
    [start, review, event("close")],
    [{ ...start, to_status: "open" }, review],
    [start, { ...review, from_status: "waiting" }],
    [start, { ...review, actor: "claude-executor" }],
    [{ ...start, actor: "another-executor" }, review],
  ])("rejects incomplete, interrupted, reordered or wrongly attributed events (%#)", (...fresh) => {
    expect(() => verifySmokeEvents(old, [...old, ...fresh], "sonnet-executor")).toThrow();
  });

  it("rejects rewritten event history", () => {
    expect(() =>
      verifySmokeEvents(old, [event("close"), ...old.slice(1), start, review], "sonnet-executor"),
    ).toThrow("history changed");
  });
});
