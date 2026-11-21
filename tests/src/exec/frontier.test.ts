import { mkdtempSync, mkdirSync, rmSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { load } from "../../../src/shared/yaml.js";
import {
  loadMemberRoster,
  type MemberRoster,
  type ProjectMember,
} from "../../../src/shared/specdojo-config.js";
import { parseJobDefinition } from "../../../src/job/definition.js";
import { resolveMemberCommand, type ExecDefaultsConfig } from "../../../src/exec/agent-config.js";
import {
  buildPhaseModeIndex,
  resolveAgentPipeline,
  resolveTaskProficiency,
} from "../../../src/exec/strategy.js";
import {
  applyRegisterDifficultyRouting,
  resolveRegisterPipelineCommand,
} from "../../../src/exec/run/register-core.js";
import { resolveInPlaceCommand } from "../../../src/exec/run/in-place.js";
import {
  resolvePinnedRateLimitRunOptions,
  selectCandidates,
} from "../../../src/exec/run/shared.js";
import type { ReadyTaskView } from "../../../src/exec/types.js";

const defaults: ExecDefaultsConfig = {
  providers: {
    codex: {
      command_template: "codex exec --model {model} --effort {effort}",
      command_params: {
        by_proficiency: { expert: { effort: "high" }, frontier: { effort: "xhigh" } },
      },
    },
  },
};

function member(overrides: Partial<ProjectMember> = {}): ProjectMember {
  return {
    nickname: "frontier-executor",
    display_name: "Frontier Executor",
    type: "agent",
    email: null,
    roles: [],
    provider: "codex",
    model: "frontier-model",
    capabilities: ["exec"],
    proficiency: "frontier",
    mode: "edit",
    priority: 1,
    ...overrides,
  };
}

function roster(members: ProjectMember[]): MemberRoster {
  return { version: 1, members };
}

function task(overrides: Partial<ReadyTaskView> = {}): ReadyTaskView {
  return {
    id: "T-TEST-doc-010",
    mode: "edit",
    schedule_file: "",
    fifo_rank: 0,
    critical_first_rank: 0,
    ...overrides,
  };
}

describe("frontier selection", () => {
  it.each([undefined, "executor", "reporter"] as const)(
    "excludes frontier from automatic primary and fallback pools for role %s even when ordinary agents are busy",
    (stageRole) => {
      const members = roster([
        member({ stage_role: stageRole }),
        member({ nickname: "expert", proficiency: "expert", priority: 2, stage_role: stageRole }),
        member({ nickname: "normal", proficiency: "normal", priority: 3, stage_role: stageRole }),
      ]);
      const requirements = { capabilities: ["exec"], stage_role: stageRole };
      expect(
        selectCandidates(
          requirements,
          members,
          "edit",
          new Set(["expert", "normal"]),
          defaults,
        ).map((candidate) => candidate.nickname),
      ).toEqual(["expert", "normal"]);
      expect(
        selectCandidates(requirements, roster([members.members[0]]), "edit", undefined, defaults),
      ).toEqual([]);
      expect(
        selectCandidates(
          { ...requirements, proficiency: "frontier" },
          members,
          "edit",
          undefined,
          defaults,
        ).map((candidate) => candidate.nickname),
      ).toEqual(["frontier-executor"]);
      expect(
        selectCandidates(
          { ...requirements, proficiency: "expert" },
          members,
          "edit",
          undefined,
          defaults,
        ).map((candidate) => candidate.nickname),
      ).toEqual(["expert"]);
    },
  );

  it("keeps capabilities, mode, role and disabled filters for an explicit frontier request", () => {
    const members = roster([
      member({ stage_role: "executor" }),
      member({ nickname: "no-tools", stage_role: "executor", capabilities: [] }),
      member({ nickname: "review", stage_role: "executor", mode: "review" }),
      member({ nickname: "reporter", stage_role: "reporter" }),
      member({ nickname: "disabled", stage_role: "executor", disabled: true }),
    ]);
    expect(
      selectCandidates(
        { capabilities: ["exec"], proficiency: "frontier", stage_role: "executor" },
        members,
        "edit",
        undefined,
        defaults,
      ).map((candidate) => candidate.nickname),
    ).toEqual(["frontier-executor"]);
  });

  it.each(["cli", "job", "strategy"] as const)(
    "allows a frontier executor pinned by %s",
    (source) => {
      const members = roster([member({ stage_role: "executor" })]);
      members.aliases = [{ nickname: "frontier-alias", alias_of: "frontier-executor" }];
      const selectedTask = task({
        agent_pipeline: { stages: [{ stage_role: "executor" }, { stage_role: "reporter" }] },
        ...(source === "job" ? { agent: "frontier-alias" } : {}),
        ...(source === "strategy" ? { agent: { executor: "frontier-alias" } } : {}),
      });
      expect(
        resolveInPlaceCommand(
          selectedTask,
          members,
          source === "cli" ? { executorBy: "frontier-alias" } : {},
          defaults,
        ),
      ).toMatchObject({
        actor: "frontier-executor",
        command: "codex exec --model frontier-model --effort xhigh",
      });
    },
  );

  it("allows a named frontier fallback and difficulty routing while excluding it from register auto selection", () => {
    const members = roster([
      member({ stage_role: "executor" }),
      member({ nickname: "ordinary", proficiency: "expert", priority: 2, stage_role: "executor" }),
      member({
        nickname: "reporter",
        proficiency: "normal",
        command: "report",
        stage_role: "reporter",
      }),
    ]);
    expect(resolveRegisterPipelineCommand(members, {}, defaults).executor.actor).toBe("ordinary");
    expect(
      resolveRegisterPipelineCommand(
        members,
        { executorBy: "frontier-executor", reporterBy: "reporter" },
        defaults,
      ).executor.actor,
    ).toBe("frontier-executor");
    const routedDefaults: ExecDefaultsConfig = {
      ...defaults,
      routing: {
        hard: {
          executor_by: "frontier-executor",
          reporter_by: "reporter",
          on_rate_limit: "fallback",
          fallback_executor_by: "frontier-executor",
        },
      },
    };
    const routed = applyRegisterDifficultyRouting({ difficulty: "hard" }, {}, routedDefaults);
    expect(resolveRegisterPipelineCommand(members, routed, routedDefaults).executor.actor).toBe(
      "frontier-executor",
    );
    expect(
      resolvePinnedRateLimitRunOptions(
        { onRateLimit: "fallback", fallbackExecutorBy: "frontier-executor" },
        defaults,
        members,
        "executor",
        { actor: "ordinary", command: "ordinary", provider: "codex" },
      ).fallbackCandidate?.actor,
    ).toBe("frontier-executor");
  });
});

describe("frontier command configuration", () => {
  it("expands the frontier effort while retaining the concrete member model", () => {
    expect(resolveMemberCommand(defaults, member())).toBe(
      "codex exec --model frontier-model --effort xhigh",
    );
  });

  it.each([undefined, "custom command"])(
    "rejects missing provider mapping before launch (override: %s)",
    (command) => {
      expect(() =>
        resolveMemberCommand(
          { providers: { codex: { command_template: "codex exec" } } },
          member({ command }),
        ),
      ).toThrow(/frontier-executor.*providers\.codex\.command_params\.by_proficiency\.frontier/);
    },
  );

  it("does not substitute nickname or mode settings for missing frontier mapping", () => {
    const config: ExecDefaultsConfig = {
      providers: {
        codex: {
          command_template: "codex exec --effort {effort}",
          command_params: {
            by_mode: { edit: { effort: "high" } },
            by_nickname: { "frontier-executor": { effort: "xhigh" } },
          },
        },
      },
    };
    expect(() => resolveMemberCommand(config, member())).toThrow(/by_proficiency\.frontier/);
  });

  it("accepts empty frontier opt-in and preserves mode-based roles", () => {
    const config: ExecDefaultsConfig = {
      providers: {
        claude: {
          command_template: "claude --agent {agent} --model {model}",
          command_params: {
            by_proficiency: { frontier: {} },
            by_mode: { review: { agent: "reviewer" } },
          },
        },
      },
    };
    expect(resolveMemberCommand(config, member({ provider: "claude", mode: "review" }))).toBe(
      "claude --agent reviewer --model frontier-model",
    );
  });

  it.each(["codex", "claude", "opencode", "antigravity", "copilot"] as const)(
    "ships frontier command support for %s",
    (provider) => {
      const config = load(
        readFileSync("templates/init-exec-defaults.yaml", "utf8"),
      ) as ExecDefaultsConfig;
      expect(config.providers?.[provider]?.command_params?.by_proficiency?.frontier).toBeDefined();
      if (provider === "codex")
        expect(resolveMemberCommand(config, member())).toContain('model_reasoning_effort="xhigh"');
    },
  );
});

describe("frontier inputs", () => {
  it("loads frontier members through roster schema validation", () => {
    const directory = mkdtempSync(join(tmpdir(), "specdojo-frontier-members-"));
    try {
      mkdirSync(join(directory, ".specdojo"));
      writeFileSync(
        join(directory, ".specdojo/agent-members.yaml"),
        JSON.stringify(roster([member()])),
      );
      expect(loadMemberRoster(directory, { base_path: "docs/test" })?.members[0].proficiency).toBe(
        "frontier",
      );
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("accepts frontier in Job input and rejects unknown tiers", () => {
    const job = {
      id: "job-frontier",
      name: "Frontier",
      task: { mode: "edit", description: "write", targets: ["doc"], proficiency: "frontier" },
      run: { idempotency_key: "{{job_id}}" },
    };
    const parsed = parseJobDefinition(job, "job-frontier.yaml");
    expect(parsed.errors).toEqual([]);
    expect(parsed.job?.task).toMatchObject({ proficiency: "frontier" });
    expect(
      parseJobDefinition(
        { ...job, task: { ...job.task, proficiency: "unknown" } },
        "job-frontier.yaml",
      ).errors,
    ).toContain("job-frontier.yaml: task.proficiency must be low|normal|high|expert|frontier");
  });

  it("retains frontier in phases, overrides, cross-deliverable passes and pipeline stages", () => {
    const directory = mkdtempSync(join(tmpdir(), "specdojo-frontier-strategy-"));
    try {
      writeFileSync(
        join(directory, "sch-strategy-test.yaml"),
        JSON.stringify({
          kind: "strategy",
          track: "test",
          phase_sets: {
            first: [
              {
                id: "draft",
                task_suffix: "010",
                proficiency: "frontier",
                agent_pipeline: {
                  stages: [
                    { stage_role: "executor", proficiency: "frontier" },
                    { stage_role: "reporter", proficiency: "frontier" },
                  ],
                },
              },
              { id: "review", task_suffix: "020", proficiency: "expert" },
            ],
          },
          owner_rules: [
            { local_ids: ["doc"], phase_set: "first" },
            {
              local_ids: ["special"],
              phase_set: "first",
              phase_overrides: [{ phase: "review", proficiency: "frontier" }],
            },
          ],
          cross_deliverable_passes: [{ id: "dedup", task_suffix: "060", proficiency: "frontier" }],
        }),
      );
      const index = buildPhaseModeIndex(directory);
      expect(resolveTaskProficiency("doc", "T-TEST-doc-010", index, "010", "first")).toBe(
        "frontier",
      );
      expect(resolveTaskProficiency("special", "T-TEST-special-020", index, "020", "first")).toBe(
        "frontier",
      );
      expect(resolveTaskProficiency(undefined, "T-TEST-dedup-060", index, "060")).toBe("frontier");
      expect(
        resolveAgentPipeline("doc", "T-TEST-doc-010", index, "010", "first")?.stages.map(
          (stage) => stage.proficiency,
        ),
      ).toEqual(["frontier", "frontier"]);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
