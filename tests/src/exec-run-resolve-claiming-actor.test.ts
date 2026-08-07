import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveClaimingActor } from "../../src/exec-run.js";
import type { CurrentState } from "../../src/exec-types.js";

function doingState(lastBy?: string): CurrentState {
  return { state: "doing", ...(lastBy ? { last_by: lastBy } : {}) };
}

describe("resolveClaimingActor", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("adopts the claiming actor nickname for a doing task", () => {
    vi.spyOn(process.stdout, "write").mockReturnValue(true);

    const result = resolveClaimingActor(doingState("opencode-edit-agent"), undefined);

    expect(result).toEqual({
      actor: "opencode-edit-agent",
      resumed: true,
    });
  });

  it("keeps the claiming actor but does not resolve a command when the actor is unknown to the roster", () => {
    vi.spyOn(process.stdout, "write").mockReturnValue(true);

    const result = resolveClaimingActor(doingState("stranger"), undefined);

    expect(result).toEqual({ actor: "stranger", resumed: true });
  });

  it("lets an explicit --by win without adopting the claiming actor (resumed: false)", () => {
    const write = vi.spyOn(process.stdout, "write").mockReturnValue(true);

    const result = resolveClaimingActor(doingState("opencode-edit-agent"), "human-reviewer");

    expect(result).toEqual({ actor: "human-reviewer", resumed: false });
    expect(write).not.toHaveBeenCalled();
  });

  it("does not resume a task that is not in doing state", () => {
    const write = vi.spyOn(process.stdout, "write").mockReturnValue(true);

    const result = resolveClaimingActor(
      { state: "blocked", last_by: "opencode-edit-agent" },
      undefined,
    );

    expect(result).toEqual({ actor: undefined, resumed: false });
    expect(write).not.toHaveBeenCalled();
  });

  it("does not resume when state is missing (undefined)", () => {
    const result = resolveClaimingActor(undefined, undefined);

    expect(result).toEqual({ actor: undefined, resumed: false });
  });
});
