import { describe, expect, it } from "vitest";
import {
  resolveInPlaceAgentPipeline,
  resolveInPlaceCommand,
  type RunOpts,
} from "../../src/exec-run.js";
import type { MemberRoster } from "../../src/specdojo-config.js";
import type { AgentPipeline, ReadyTaskView } from "../../src/exec-types.js";

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
        nickname: "backup-executor",
        display_name: "Backup Executor",
        email: null,
        roles: [],
        type: "agent",
        capabilities: [],
        priority: 2,
        command: "run backup-executor",
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

  it("uses the nickname pinned by the task when --by is omitted", () => {
    const result = resolveInPlaceCommand(
      buildTask({ agent: "executor", capabilities: [] }),
      buildRoster(),
      {} as RunOpts,
    );

    // The pinned nickname wins over capability-based auto selection, so a Job definition
    // decides its own delegation target.
    expect(result).toEqual({ command: "run executor", actor: "executor" });
  });

  it("lets --by override the nickname pinned by the task", () => {
    const result = resolveInPlaceCommand(buildTask({ agent: "executor" }), buildRoster(), {
      by: "opencode-edit-agent",
    } as RunOpts);

    expect(result.actor).toBe("opencode-edit-agent");
  });

  it("rejects a pinned nickname that is not a registered agent", () => {
    expect(() =>
      resolveInPlaceCommand(buildTask({ agent: "missing-agent" }), buildRoster(), {} as RunOpts),
    ).toThrow(/Agent command not found for actor: missing-agent/);
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

  it("uses a schedule-pinned executor before auto selection and lets --executor-by override it", () => {
    const pipelineTask = buildTask({
      agent: { executor: "executor" },
      agent_pipeline: {
        stages: [{ stage_role: "executor" }, { stage_role: "reporter" }],
      },
    });

    expect(resolveInPlaceCommand(pipelineTask, buildRoster(), {} as RunOpts).actor).toBe(
      "executor",
    );
    expect(
      resolveInPlaceCommand(pipelineTask, buildRoster(), {
        executorBy: "backup-executor",
      } as RunOpts).actor,
    ).toBe("backup-executor");
  });
});

function buildRosterWithReporter(): MemberRoster {
  const roster = buildRoster();
  roster.members.push({
    nickname: "reporter",
    display_name: "Reporter",
    email: null,
    roles: [],
    type: "agent",
    priority: 1,
    command: "run reporter",
    stage_role: "reporter",
  });
  return roster;
}

describe("resolveInPlaceAgentPipeline", () => {
  it("synthesizes the executor/reporter pipeline for a --plan run with both stage flags", () => {
    const task = buildTask({ mode: "review", capabilities: [] });

    const pipeline = resolveInPlaceAgentPipeline(
      task,
      buildRosterWithReporter(),
      { executorBy: "executor", reporterBy: "reporter" },
      "plan",
    );

    expect(pipeline).toEqual({
      stages: [{ stage_role: "executor" }, { stage_role: "reporter" }],
    });
    // The synthesized pipeline lets the in-place command resolver accept --executor-by.
    expect(
      resolveInPlaceCommand({ ...task, agent_pipeline: pipeline }, buildRosterWithReporter(), {
        executorBy: "executor",
      } as RunOpts),
    ).toEqual({ command: "run executor", actor: "executor" });
  });

  it("opts in to the pipeline when only --reporter-by is given", () => {
    expect(
      resolveInPlaceAgentPipeline(
        buildTask(),
        buildRosterWithReporter(),
        { reporterBy: "reporter" },
        "plan",
      ),
    ).toEqual({ stages: [{ stage_role: "executor" }, { stage_role: "reporter" }] });
  });

  it("keeps a single-agent run when --by names a legacy agent", () => {
    expect(
      resolveInPlaceAgentPipeline(buildTask(), buildRoster(), { by: "claude-edit-agent" }, "plan"),
    ).toBeUndefined();
  });

  it("rejects a pipeline executor passed to --by and points to --executor-by / --reporter-by", () => {
    expect(() =>
      resolveInPlaceAgentPipeline(buildTask(), buildRoster(), { by: "executor" }, "plan"),
    ).toThrow(
      /--by executor is a pipeline executor agent \(stage_role: executor\).*--plan with --executor-by executor --reporter-by <reporter>/,
    );
  });

  it("rejects a pipeline reporter passed to --by", () => {
    expect(() =>
      resolveInPlaceAgentPipeline(
        buildTask(),
        buildRosterWithReporter(),
        { by: "reporter" },
        "deliverable",
      ),
    ).toThrow(
      /stage_role: reporter.*--deliverable with --executor-by <executor> --reporter-by reporter/,
    );
  });

  it("rejects stage flags for an ad-hoc plan without task_id", () => {
    expect(() =>
      resolveInPlaceAgentPipeline(null, buildRoster(), { executorBy: "executor" }, "plan"),
    ).toThrow(/--plan pipeline execution requires a plan with task_id/);
  });

  it("rejects --by combined with stage flags", () => {
    expect(() =>
      resolveInPlaceAgentPipeline(
        buildTask(),
        buildRosterWithReporter(),
        { by: "executor", reporterBy: "reporter" },
        "plan",
      ),
    ).toThrow(/--by cannot be combined with --executor-by \/ --reporter-by/);
  });

  it("returns an existing task pipeline unchanged", () => {
    const agentPipeline: AgentPipeline = {
      stages: [{ stage_role: "executor", capabilities: ["exec"] }, { stage_role: "reporter" }],
    };

    expect(
      resolveInPlaceAgentPipeline(
        buildTask({ agent_pipeline: agentPipeline }),
        buildRoster(),
        { by: "executor" },
        "plan",
      ),
    ).toBe(agentPipeline);
  });
});
