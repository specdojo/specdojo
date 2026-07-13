import { describe, expect, it } from "vitest";
import {
  hasMemberCommandSource,
  resolveMemberCommand,
  type ExecDefaultsConfig,
} from "../../src/exec-agent-config.js";
import type { ProjectMember } from "../../src/specdojo-config.js";

function buildMember(overrides: Partial<ProjectMember> = {}): ProjectMember {
  return {
    nickname: "claude-edit-agent",
    display_name: "Claude Edit Agent",
    email: null,
    roles: [],
    type: "agent",
    provider: "claude",
    mode: "edit",
    proficiency: "normal",
    ...overrides,
  };
}

const claudeTemplateConfig: ExecDefaultsConfig = {
  providers: {
    claude: {
      command_template:
        "claude -p --agent {nickname} --settings .specdojo/claude/settings.{mode}.json",
    },
  },
};

const codexTemplateConfig: ExecDefaultsConfig = {
  providers: {
    codex: {
      command_template: 'codex exec --model {model} -c model_reasoning_effort="{effort}"',
      command_params: {
        by_proficiency: {
          normal: { model: "gpt-5.4-mini", effort: "medium" },
          expert: { model: "gpt-5.5", effort: "high" },
        },
      },
    },
  },
};

describe("resolveMemberCommand", () => {
  it("expands built-in placeholders from member attributes", () => {
    const actual = resolveMemberCommand(claudeTemplateConfig, buildMember());

    expect(actual).toBe(
      "claude -p --agent claude-edit-agent --settings .specdojo/claude/settings.edit.json",
    );
  });

  it("expands the same template differently per member mode", () => {
    const actual = resolveMemberCommand(
      claudeTemplateConfig,
      buildMember({ nickname: "claude-review-agent", mode: "review" }),
    );

    expect(actual).toBe(
      "claude -p --agent claude-review-agent --settings .specdojo/claude/settings.review.json",
    );
  });

  it("expands by_proficiency variables for the member's proficiency", () => {
    const normal = resolveMemberCommand(
      codexTemplateConfig,
      buildMember({ nickname: "codex-edit-agent", provider: "codex", proficiency: "normal" }),
    );
    const expert = resolveMemberCommand(
      codexTemplateConfig,
      buildMember({
        nickname: "codex-expert-edit-agent",
        provider: "codex",
        proficiency: "expert",
      }),
    );

    expect(normal).toBe('codex exec --model gpt-5.4-mini -c model_reasoning_effort="medium"');
    expect(expert).toBe('codex exec --model gpt-5.5 -c model_reasoning_effort="high"');
  });

  it("expands by_mode variables for the member's mode", () => {
    const config: ExecDefaultsConfig = {
      providers: {
        copilot: {
          command_template: 'copilot -p --agent {nickname} --allow-tool "{allow_tools}"',
          command_params: {
            by_mode: {
              edit: { allow_tools: "read,write" },
              review: { allow_tools: "read" },
            },
          },
        },
      },
    };

    const actual = resolveMemberCommand(
      config,
      buildMember({ nickname: "copilot-review-agent", provider: "copilot", mode: "review" }),
    );

    expect(actual).toBe('copilot -p --agent copilot-review-agent --allow-tool "read"');
  });

  it("prefers the member-level command override over the provider template", () => {
    const actual = resolveMemberCommand(
      claudeTemplateConfig,
      buildMember({ command: "custom-agent run --profile special" }),
    );

    expect(actual).toBe("custom-agent run --profile special");
  });

  it("returns undefined when the member has no override and the provider has no template", () => {
    const actual = resolveMemberCommand({}, buildMember({ provider: "custom" }));

    expect(actual).toBeUndefined();
  });

  it("throws with member context when a placeholder stays unresolved", () => {
    const member = buildMember({
      nickname: "codex-edit-agent",
      provider: "codex",
      proficiency: undefined,
    });

    expect(() => resolveMemberCommand(codexTemplateConfig, member)).toThrow(
      /\{model\}.*providers\.codex\.command_template.*codex-edit-agent/,
    );
  });

  it("throws when a variable is defined in both by_mode and by_proficiency", () => {
    const config: ExecDefaultsConfig = {
      providers: {
        codex: {
          command_template: "codex exec --model {model}",
          command_params: {
            by_mode: { edit: { model: "from-mode" } },
            by_proficiency: { normal: { model: "from-proficiency" } },
          },
        },
      },
    };

    expect(() => resolveMemberCommand(config, buildMember({ provider: "codex" }))).toThrow(
      /\{model\}.*both by_mode and by_proficiency/,
    );
  });

  it("throws when command_params redefines a built-in variable", () => {
    const config: ExecDefaultsConfig = {
      providers: {
        claude: {
          command_template: "claude -p --agent {nickname}",
          command_params: {
            by_mode: { edit: { nickname: "hijacked" } },
          },
        },
      },
    };

    expect(() => resolveMemberCommand(config, buildMember())).toThrow(
      /must not redefine built-in variable \{nickname\}/,
    );
  });
});

describe("hasMemberCommandSource", () => {
  it("accepts a member with a command override and no template", () => {
    const actual = hasMemberCommandSource({}, buildMember({ provider: "custom", command: "run" }));

    expect(actual).toBe(true);
  });

  it("accepts a member whose provider declares a command_template", () => {
    const actual = hasMemberCommandSource(claudeTemplateConfig, buildMember());

    expect(actual).toBe(true);
  });

  it("rejects a member with neither an override nor a provider template", () => {
    const actual = hasMemberCommandSource({}, buildMember());

    expect(actual).toBe(false);
  });
});
