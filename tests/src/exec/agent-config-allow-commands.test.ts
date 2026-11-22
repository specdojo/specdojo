import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { resolveMemberCommand, type ExecDefaultsConfig } from "../../../src/exec/agent-config.js";
import { opencodeAllowCommandsConfig } from "../../../src/exec/opencode-permissions.js";
import { withAgentExtraRoots } from "../../../src/exec/task-repos.js";

const config: ExecDefaultsConfig = {
  providers: {
    claude: {
      command_template: "claude -p --agent {nickname} --settings settings.{mode}.json",
      allow_commands: ["Bash(npx playwright test *)", "Bash(make lint)"],
    },
  },
};

function member(mode: "edit" | "review") {
  return { nickname: "worker", provider: "claude" as const, mode };
}

describe("providers.claude.allow_commands", () => {
  it("appends quoted --allowedTools to edit-mode commands", () => {
    const actual = resolveMemberCommand(config, member("edit"));

    expect(actual).toBe(
      "claude -p --agent worker --settings settings.edit.json --allowedTools 'Bash(npx playwright test *)' 'Bash(make lint)'",
    );
  });

  it("leaves review-mode commands unchanged", () => {
    const actual = resolveMemberCommand(config, member("review"));

    expect(actual).toBe("claude -p --agent worker --settings settings.review.json");
  });

  it("rejects rules that could break shell quoting", () => {
    const broken: ExecDefaultsConfig = {
      providers: {
        claude: { ...config.providers?.claude, allow_commands: ["Bash(echo 'x')"] },
      },
    };

    expect(() => resolveMemberCommand(broken, member("edit"))).toThrow(/allow_commands/);
  });
});

describe("providers.opencode.allow_commands", () => {
  const opencodeConfig: ExecDefaultsConfig = {
    providers: {
      opencode: {
        command_template: "opencode run --agent {nickname}",
        allow_commands: ["Bash(npx playwright test *)"],
      },
    },
  };

  function opencodeMember(mode: "edit" | "review") {
    return { nickname: "worker", provider: "opencode" as const, mode };
  }

  it("prefixes edit-mode commands with agent permission.bash allow rules in OPENCODE_CONFIG_CONTENT", () => {
    const actual = resolveMemberCommand(opencodeConfig, opencodeMember("edit"));

    expect(actual).toBe(
      `OPENCODE_CONFIG_CONTENT='{"agent":{"worker":{"permission":{"bash":{"npx playwright test *":"allow"}}}}}' opencode run --agent worker`,
    );
    expect(actual).not.toContain("OPENCODE_PERMISSION");
  });

  it("sorts added rules after the definition's deny and keeps other commands denied", () => {
    const definition =
      '{"agent":{"worker":{"permission":{"bash":{"*":"deny","git push*":"deny"}}}}}';

    const merged = JSON.parse(
      opencodeAllowCommandsConfig(definition, "worker", ["npx tsc*", "make lint"]),
    ) as { agent: { worker: { permission: { bash: Record<string, string> } } } };

    const bash = merged.agent.worker.permission.bash;
    expect(Object.keys(bash)).toEqual(["*", "git push*", "npx tsc*", "make lint"]);
    expect(bash["*"]).toBe("deny");
    expect(bash["git push*"]).toBe("deny");
    expect(bash["npx tsc*"]).toBe("allow");
  });

  it("keeps allow_commands when extra roots are added to the same command", () => {
    const command = resolveMemberCommand(opencodeConfig, opencodeMember("edit")) ?? "";

    const actual = withAgentExtraRoots(command, "opencode", ["/repo/app1"], {
      cwd: "/repo/main",
      env: {},
    });

    const match = /^OPENCODE_CONFIG_CONTENT='(.*)' opencode run --agent worker$/.exec(actual);
    expect(actual.match(/OPENCODE_CONFIG_CONTENT=/g)).toHaveLength(1);
    const parsed = JSON.parse(match?.[1] ?? "{}") as {
      agent: { worker: { permission: Record<string, Record<string, string>> } };
    };
    expect(parsed.agent.worker.permission.bash).toEqual({ "npx playwright test *": "allow" });
    expect(parsed.agent.worker.permission.external_directory["/repo/app1/**"]).toBe("allow");
  });

  it("leaves review-mode commands unchanged", () => {
    const actual = resolveMemberCommand(opencodeConfig, opencodeMember("review"));

    expect(actual).toBe("opencode run --agent worker");
  });
});

describe("templates/opencode/agents/opencode-executor.md", () => {
  const text = readFileSync("templates/opencode/agents/opencode-executor.md", "utf8");

  it.each([
    '"npx tsc*": allow',
    '"npx vitest*": allow',
    '"npx eslint*": allow',
    '"npx markdownlint-cli2*": allow',
    '"git rm docs/*": allow',
    '"git rm src/*": allow',
    '"git rm tests/*": allow',
  ])("allows %s", (rule) => {
    expect(text).toContain(rule);
  });

  it("denies git push, rm -rf, gh, and recursive or forced git rm", () => {
    for (const rule of [
      '"git push*": deny',
      '"rm -rf*": deny',
      '"gh *": deny',
      '"git rm -r*": deny',
      '"git rm -f*": deny',
    ]) {
      expect(text).toContain(rule);
    }
    expect(text).not.toMatch(/"(rm|rm \*|git rm \*|git rm\*)": allow/);
  });
});

describe("templates/claude/settings.edit.json", () => {
  const settings = JSON.parse(readFileSync("templates/claude/settings.edit.json", "utf8")) as {
    permissions: { allow: string[]; deny: string[] };
  };

  it.each([
    "Bash(npm run *)",
    "Bash(npx prettier *)",
    "Bash(npx markdownlint-cli2 *)",
    "Bash(npx eslint *)",
    "Bash(npx tsc *)",
    "Bash(npx vitest *)",
  ])("allows %s", (rule) => {
    expect(settings.permissions.allow).toContain(rule);
  });

  it("does not allow destructive commands and keeps deny for git push and gh", () => {
    const bashAllows = settings.permissions.allow.filter((rule) => rule.startsWith("Bash("));

    expect(bashAllows.some((rule) => /git|rm |gh /.test(rule))).toBe(false);
    expect(settings.permissions.deny).toContain("Bash(git push *)");
    expect(settings.permissions.deny).toContain("Bash(gh *)");
  });
});
