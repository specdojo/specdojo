import { describe, expect, it } from "vitest";
import { resolveInPlaceCommand, type RunOpts } from "../../src/exec-run.js";
import type { MemberRoster } from "../../src/specdojo-config.js";
import type { ReadyTaskView } from "../../src/exec-types.js";

function buildRoster(): MemberRoster {
  return {
    version: 1,
    project_id: "test",
    members: [
      {
        nickname: "claude-edit-agent",
        display_name: "Claude Edit",
        email: null,
        roles: ["DEV"],
        type: "agent",
        capabilities: ["web_search"],
        priority: 1,
        command: "claude -p --agent claude-edit-agent",
        mode: "edit",
      },
      {
        nickname: "executor",
        display_name: "Executor",
        email: null,
        roles: [],
        type: "agent",
        capabilities: ["exec"],
        priority: 1,
        command: "run executor",
        mode: "edit",
        stage_role: "executor",
        proficiency: "expert",
      },
      {
        nickname: "opencode-edit-agent",
        display_name: "OpenCode Edit",
        email: null,
        roles: ["DEV"],
        type: "agent",
        capabilities: ["web_search", "extra"],
        priority: 2,
        command: "opencode run --agent opencode-edit-agent",
        mode: "edit",
      },
    ],
  };
}

function buildTask(overrides: Partial<ReadyTaskView> = {}): ReadyTaskView {
  return {
    id: "T-TEST-doc-010",
    local_id: "doc",
    mode: "edit",
    capabilities: ["web_search"],
    schedule_file: "",
    fifo_rank: 0,
    critical_first_rank: 0,
    ...overrides,
  };
}

describe("resolveInPlaceCommand actor derivation", () => {
  it("auto-derives the actor from the capability-selected agent when --by is omitted", () => {
    const result = resolveInPlaceCommand(buildTask(), buildRoster(), {} as RunOpts);

    // Lowest priority wins; its nickname becomes the recorded actor (mirrors the worktree path).
    expect(result.command).toBe("claude -p --agent claude-edit-agent");
    expect(result.actor).toBe("claude-edit-agent");
  });

  it("uses --by as the actor and resolves its command", () => {
    const result = resolveInPlaceCommand(buildTask(), buildRoster(), {
      by: "opencode-edit-agent",
    } as RunOpts);

    expect(result.command).toBe("opencode run --agent opencode-edit-agent");
    expect(result.actor).toBe("opencode-edit-agent");
  });

  it("rejects an unknown --by nickname instead of accepting a raw command", () => {
    expect(() =>
      resolveInPlaceCommand(buildTask(), buildRoster(), {
        by: "node ./my-agent.js",
      } as RunOpts),
    ).toThrow(/Agent command not found for actor/);
  });

  it("allows a registered --by agent to override human execution", () => {
    const result = resolveInPlaceCommand(buildTask({ execution: "human" }), buildRoster(), {
      by: "claude-edit-agent",
    } as RunOpts);

    expect(result).toEqual({
      command: "claude -p --agent claude-edit-agent",
      actor: "claude-edit-agent",
    });
  });

  it("rejects human execution when --by is omitted", () => {
    expect(() =>
      resolveInPlaceCommand(buildTask({ execution: "human" }), buildRoster(), {} as RunOpts),
    ).toThrow(/Use --by <nickname> to override/);
  });

  it("selects an executor-stage agent from the pipeline stage requirements", () => {
    const result = resolveInPlaceCommand(
      buildTask({
        agent_pipeline: {
          stages: [
            { stage_role: "executor", capabilities: ["exec"], proficiency: "expert" },
            { stage_role: "reporter" },
          ],
        },
      }),
      buildRoster(),
      {} as RunOpts,
    );

    expect(result).toEqual({ command: "run executor", actor: "executor" });
  });

  it("rejects a legacy --by override for a pipeline executor stage", () => {
    expect(() =>
      resolveInPlaceCommand(
        buildTask({
          agent_pipeline: {
            stages: [{ stage_role: "executor" }, { stage_role: "reporter" }],
          },
        }),
        buildRoster(),
        { by: "claude-edit-agent" } as RunOpts,
      ),
    ).toThrow(/stage_role: executor/);
  });

  it("uses --executor-by for a pipeline task and rejects it for a legacy task", () => {
    const pipelineTask = buildTask({
      agent_pipeline: {
        stages: [{ stage_role: "executor" }, { stage_role: "reporter" }],
      },
    });

    expect(
      resolveInPlaceCommand(pipelineTask, buildRoster(), {
        executorBy: "executor",
      } as RunOpts),
    ).toEqual({ command: "run executor", actor: "executor" });
    expect(() =>
      resolveInPlaceCommand(buildTask(), buildRoster(), {
        executorBy: "executor",
      } as RunOpts),
    ).toThrow(/require an agent_pipeline task/);
  });
});
