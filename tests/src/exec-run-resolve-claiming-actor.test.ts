import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveClaimingActor } from "../../src/exec-run.js";
import type { MemberRoster } from "../../src/specdojo-config.js";
import type { CurrentState } from "../../src/exec-types.js";

function buildRoster(): MemberRoster {
  return {
    version: 1,
    project_id: "test",
    members: [
      {
        nickname: "opencode-edit-agent",
        display_name: "OpenCode Edit",
        email: null,
        roles: ["DEV"],
        type: "agent",
        capabilities: ["web_search"],
        priority: 1,
        command: "opencode run --agent opencode-edit-agent",
        mode: "edit",
      },
    ],
  };
}

function doingState(lastBy?: string): CurrentState {
  return { state: "doing", ...(lastBy ? { last_by: lastBy } : {}) };
}

describe("resolveClaimingActor", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("adopts the claiming actor and resolves its command for a doing task", () => {
    vi.spyOn(process.stdout, "write").mockReturnValue(true);

    const result = resolveClaimingActor(
      doingState("opencode-edit-agent"),
      buildRoster(),
      undefined,
      undefined,
    );

    expect(result).toEqual({
      actor: "opencode-edit-agent",
      agentCmd: "opencode run --agent opencode-edit-agent",
      resumed: true,
    });
  });

  it("keeps the claiming actor but does not resolve a command when the actor is unknown to the roster", () => {
    vi.spyOn(process.stdout, "write").mockReturnValue(true);

    const result = resolveClaimingActor(
      doingState("stranger"),
      buildRoster(),
      undefined,
      undefined,
    );

    expect(result).toEqual({ actor: "stranger", agentCmd: undefined, resumed: true });
  });

  it("lets an explicit --by win without adopting the claiming actor (resumed: false)", () => {
    const write = vi.spyOn(process.stdout, "write").mockReturnValue(true);

    const result = resolveClaimingActor(
      doingState("opencode-edit-agent"),
      buildRoster(),
      "human-reviewer",
      undefined,
    );

    expect(result).toEqual({ actor: "human-reviewer", agentCmd: undefined, resumed: false });
    expect(write).not.toHaveBeenCalled();
  });

  it("keeps a --cmd command override over the claiming member command", () => {
    vi.spyOn(process.stdout, "write").mockReturnValue(true);

    const result = resolveClaimingActor(
      doingState("opencode-edit-agent"),
      buildRoster(),
      undefined,
      "node ./my-agent.js",
    );

    expect(result).toEqual({
      actor: "opencode-edit-agent",
      agentCmd: "node ./my-agent.js",
      resumed: true,
    });
  });

  it("does not resume a task that is not in doing state", () => {
    const write = vi.spyOn(process.stdout, "write").mockReturnValue(true);

    const result = resolveClaimingActor(
      { state: "blocked", last_by: "opencode-edit-agent" },
      buildRoster(),
      undefined,
      undefined,
    );

    expect(result).toEqual({ actor: undefined, agentCmd: undefined, resumed: false });
    expect(write).not.toHaveBeenCalled();
  });

  it("does not resume when state is missing (undefined)", () => {
    const result = resolveClaimingActor(undefined, buildRoster(), undefined, "fallback-cmd");

    expect(result).toEqual({ actor: undefined, agentCmd: "fallback-cmd", resumed: false });
  });
});
