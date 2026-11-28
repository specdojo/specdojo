import { describe, expect, it } from "vitest";
import { isAgentReadyPromotion } from "../../../src/exec/worktree-ops-commit.js";

describe("agent ready promotion", () => {
  const ready = "id: d\nstatus: ready\n";
  const draft = "id: d\nstatus: draft\n";

  it("ignores ready fixtures and other non-document files", () => {
    expect(isAgentReadyPromotion("tests/fixtures/d.yaml", ready)).toBe(false);
    expect(isAgentReadyPromotion("tools/d.yaml", ready, draft)).toBe(false);
    expect(isAgentReadyPromotion("docs-copy/d.yaml", ready)).toBe(false);
  });

  it("blocks new and promoted deliverables and kata documents under docs", () => {
    expect(isAgentReadyPromotion("docs/project/d.yaml", ready)).toBe(true);
    expect(isAgentReadyPromotion("docs/project/d.yaml", ready, draft)).toBe(true);
    expect(isAgentReadyPromotion("docs/kata/d.md", "---\nspecdojo:\n  status: ready\n---\n")).toBe(
      true,
    );
    expect(isAgentReadyPromotion("docs/project/d.yaml", ready, ready)).toBe(false);
    expect(isAgentReadyPromotion("docs/project/d.yaml", draft)).toBe(false);
  });
});
