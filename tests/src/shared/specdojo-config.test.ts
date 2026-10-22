import { describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { load as loadYaml } from "js-yaml";
import { specdojoPackageRootDir } from "../../../src/shared/package-paths.js";
import {
  assertValidActor,
  getProjectCatalogPath,
  getKataAuthority,
  getProjectContext,
  getProjectMembersPath,
  getProjectExecutionPath,
  getProjectSchedulePath,
  loadConfig,
  loadMemberRoster,
  migrateAgentMembers,
  resolveAgentMember,
} from "../../../src/shared/specdojo-config.js";
import type {
  MemberRoster,
  SpecDojoConfig,
  SpecDojoProjectConfig,
} from "../../../src/shared/specdojo-config.js";

describe("kata authority", () => {
  it("uses an explicit repository-wide authority", () => {
    const config = {
      version: 1,
      kata_authority: "customer-docs",
      projects: {},
    } satisfies SpecDojoConfig;
    expect(getKataAuthority(config, "/tmp/ignored")).toBe("customer-docs");
  });

  it("derives a lowercase hyphenated authority from the repository directory", () => {
    expect(getKataAuthority(null, "/tmp/Customer Docs")).toBe("customer-docs");
    expect(getKataAuthority(null, "/tmp/123")).toBe("repo-123");
    expect(getKataAuthority(null, "/tmp/specdojo")).toBe("repo-specdojo");
    expect(getKataAuthority(null, "/tmp/prj-example")).toBe("repo-prj-example");
  });

  it.each(["Customer_Docs", "prj-example", "specdojo"])(
    "rejects invalid or reserved configured authority %s",
    (kataAuthority) => {
      const root = mkdtempSync(join(tmpdir(), "specdojo-kata-authority-"));
      const configPath = join(root, ".specdojo", "specdojo.config.json");
      mkdirSync(dirname(configPath), { recursive: true });
      writeFileSync(
        configPath,
        JSON.stringify({ version: 1, kata_authority: kataAuthority, projects: {} }),
        "utf8",
      );

      try {
        expect(() => loadConfig(root)).toThrow(/kata_authority must match/);
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    },
  );
});

function makeRoster(nicknames: string[]): MemberRoster {
  return {
    version: 1,
    project_id: "prj-test",
    members: nicknames.map((nickname) => ({
      nickname,
      display_name: nickname,
      email: null,
      roles: [],
      type: "human" as const,
    })),
  };
}

describe("assertValidActor", () => {
  it("roster が null の場合は何もしない", () => {
    expect(() => assertValidActor("anyone", null)).not.toThrow();
  });

  it("roster に登録されているニックネームはエラーにならない", () => {
    const roster = makeRoster(["alice", "bob"]);
    expect(() => assertValidActor("alice", roster)).not.toThrow();
    expect(() => assertValidActor("bob", roster)).not.toThrow();
  });

  it("roster に存在しないニックネームはエラーを投げる", () => {
    const roster = makeRoster(["alice", "bob"]);
    expect(() => assertValidActor("charlie", roster)).toThrow("charlie");
  });

  it("エラーメッセージに既知のメンバー一覧が含まれる", () => {
    const roster = makeRoster(["alice", "bob"]);
    expect(() => assertValidActor("unknown", roster)).toThrow(/alice.*bob|bob.*alice/);
  });

  it("roster が空の場合は全てのニックネームでエラーを投げる", () => {
    const roster = makeRoster([]);
    expect(() => assertValidActor("alice", roster)).toThrow();
  });
});

describe("schedule and execution path defaults", () => {
  it("falls back to the conventional directory when the path is omitted", () => {
    const config = { base_path: "docs/ja/projects/prj-x" } as SpecDojoProjectConfig;

    expect(getProjectSchedulePath(config)).toBe("docs/ja/projects/prj-x/schedule");
    expect(getProjectExecutionPath(config)).toBe("docs/ja/projects/prj-x/execution");
  });

  it("keeps an explicit path so existing projects are unaffected", () => {
    const config = {
      base_path: "docs/ja/projects/prj-y",
      schedule_path: "sch",
      execution_path: "exe",
    } as SpecDojoProjectConfig;

    expect(getProjectSchedulePath(config)).toBe("docs/ja/projects/prj-y/sch");
    expect(getProjectExecutionPath(config)).toBe("docs/ja/projects/prj-y/exe");
  });

  it("treats a blank path as omitted", () => {
    const config = {
      base_path: "docs/ja/projects/prj-z",
      schedule_path: "   ",
      execution_path: "",
    } as SpecDojoProjectConfig;

    expect(getProjectSchedulePath(config)).toBe("docs/ja/projects/prj-z/schedule");
    expect(getProjectExecutionPath(config)).toBe("docs/ja/projects/prj-z/execution");
  });
});

describe("project path accessors with base_path", () => {
  function project(overrides: Partial<SpecDojoProjectConfig>): SpecDojoProjectConfig {
    return {
      schedule_path: "schedule",
      execution_path: "execution",
      ...overrides,
    };
  }

  it("joins base_path with each document path", () => {
    const config = project({
      base_path: "docs/ja/projects/prj-0001",
      catalog_path: "010-deliverables-catalog",
      members_path: "030-project-management/pm-members.yaml",
    });

    expect(getProjectSchedulePath(config)).toBe("docs/ja/projects/prj-0001/schedule");
    expect(getProjectCatalogPath(config)).toBe(
      "docs/ja/projects/prj-0001/010-deliverables-catalog",
    );
    expect(getProjectMembersPath(config)).toBe(
      "docs/ja/projects/prj-0001/030-project-management/pm-members.yaml",
    );
  });

  it("leaves paths unchanged when base_path is omitted", () => {
    const config = project({
      catalog_path: "docs/ja/projects/prj-0001/010-deliverables-catalog",
    });

    expect(getProjectSchedulePath(config)).toBe("schedule");
    expect(getProjectCatalogPath(config)).toBe(
      "docs/ja/projects/prj-0001/010-deliverables-catalog",
    );
  });

  it("returns undefined for optional paths that are not set", () => {
    const config = project({ base_path: "docs/ja/projects/prj-0001" });

    expect(getProjectCatalogPath(config)).toBeUndefined();
    expect(getProjectMembersPath(config)).toBeUndefined();
  });

  it("project_context は省略時に prj-overview、空配列で opt-out になる", () => {
    expect(getProjectContext(project({}))).toEqual(["prj-overview"]);
    expect(getProjectContext(project({ project_context: [] }))).toEqual([]);
    expect(
      getProjectContext(project({ project_context: ["project-why", "prj-shared:policy"] })),
    ).toEqual(["project-why", "prj-shared:policy"]);
  });
});

function write(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

const humanRoster = `
id: prj-test:pm-members
type: project
status: draft
title: Members
rulebook: specdojo:pm-members-rulebook
version: 1
project_id: prj-test
members:
  - nickname: alice
    display_name: Alice
    email: null
    roles: [PO]
    type: human
`;

const agentMember = `
  - nickname: codex-executor
    display_name: Codex Executor
    email: null
    roles: []
    type: agent
    provider: codex
    capabilities: [exec]
    proficiency: expert
    priority: 1
    mode: edit
    stage_role: executor
`;

const modelAgentMember = `
  - nickname: sol-executor
    display_name: Sol Executor
    email: null
    roles: []
    type: agent
    provider: codex
    model: gpt-5.6-sol
    effort: high
    capabilities: [exec]
    proficiency: expert
    priority: 1
    mode: edit
    stage_role: executor
`;

describe("split human and agent member registries", () => {
  it("loads concrete model members and validated aliases without resolving them", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-members-"));
    write(
      join(root, ".specdojo", "agent-members.yaml"),
      `version: 1\nmembers:${modelAgentMember}aliases:\n  - nickname: codex-expert-executor\n    alias_of: sol-executor\n`,
    );

    const roster = loadMemberRoster(root, {});

    expect(roster?.members.map((member) => member.nickname)).toEqual(["sol-executor"]);
    expect(roster?.aliases).toEqual([
      { nickname: "codex-expert-executor", alias_of: "sol-executor" },
    ]);
  });

  it("loads the repository agent registry when the project has no human roster", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-members-"));
    write(join(root, ".specdojo", "agent-members.yaml"), `version: 1\nmembers:${agentMember}`);

    const roster = loadMemberRoster(root, {});

    expect(roster?.members.map((member) => member.nickname)).toEqual(["codex-executor"]);
    expect(roster?.project_id).toBeUndefined();
  });

  it("rejects an alias cycle and reports the roster file and alias name", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-members-"));
    const path = join(root, ".specdojo", "agent-members.yaml");
    write(
      path,
      `version: 1\nmembers:${modelAgentMember}aliases:\n  - nickname: old-a\n    alias_of: old-b\n  - nickname: old-b\n    alias_of: old-a\n`,
    );

    expect(() => loadMemberRoster(root, {})).toThrow(
      /Invalid agent alias 'old-a' in .*agent-members\.yaml: alias cycle/,
    );
  });

  it("rejects an alias whose target does not exist", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-members-"));
    const path = join(root, ".specdojo", "agent-members.yaml");
    write(
      path,
      `version: 1\nmembers:${modelAgentMember}aliases:\n  - nickname: missing-alias\n    alias_of: missing-member\n`,
    );

    expect(() => loadMemberRoster(root, {})).toThrow(
      /Invalid agent alias 'missing-alias' in .*agent-members\.yaml:.*missing-member/,
    );
  });

  it("rejects an alias that resolves to a disabled member", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-members-"));
    const path = join(root, ".specdojo", "agent-members.yaml");
    write(
      path,
      `version: 1\nmembers:${modelAgentMember.replace("    display_name", "    disabled: true\n    display_name")}aliases:\n  - nickname: disabled-alias\n    alias_of: sol-executor\n`,
    );

    expect(() => loadMemberRoster(root, {})).toThrow(
      /Invalid agent alias 'disabled-alias' in .*agent-members\.yaml:.*disabled/,
    );
  });

  it("loads a configured agent registry path when the project has no human roster", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-members-"));
    write(
      join(root, ".specdojo", "specdojo.config.json"),
      JSON.stringify({
        version: 1,
        agent_members_path: ".specdojo/custom-agents.yaml",
        projects: { "prj-test": {} },
      }),
    );
    write(join(root, ".specdojo", "custom-agents.yaml"), `version: 1\nmembers:${agentMember}`);

    const roster = loadMemberRoster(root, {});

    expect(roster?.members.map((member) => member.nickname)).toEqual(["codex-executor"]);
  });

  it.each(["copilot", "antigravity"])(
    "ships a schema-valid %s agent registry snippet",
    (provider) => {
      const root = mkdtempSync(join(tmpdir(), "specdojo-members-"));
      const snippet = readFileSync(
        join(specdojoPackageRootDir(), "templates", provider, "agent-members-snippet.yaml"),
        "utf8",
      );
      write(join(root, ".specdojo", "agent-members.yaml"), snippet);

      expect(loadMemberRoster(root, {})?.members.length).toBeGreaterThan(0);
    },
  );

  it("keeps returning null when neither human nor agent registry exists", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-members-"));

    expect(loadMemberRoster(root, {})).toBeNull();
  });

  it("validates and combines the project human roster with the repository agent registry", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-members-"));
    write(join(root, "members.yaml"), humanRoster);
    write(join(root, ".specdojo", "agent-members.yaml"), `version: 1\nmembers:${agentMember}`);

    const roster = loadMemberRoster(root, { members_path: "members.yaml" });

    expect(roster?.members.map((member) => member.nickname)).toEqual(["alice", "codex-executor"]);
  });

  it("reports duplicate nicknames across both files", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-members-"));
    write(join(root, "members.yaml"), humanRoster.replaceAll("alice", "codex-executor"));
    write(join(root, ".specdojo", "agent-members.yaml"), `version: 1\nmembers:${agentMember}`);

    expect(() => loadMemberRoster(root, { members_path: "members.yaml" })).toThrow(
      /Duplicate member nickname 'codex-executor'/,
    );
  });

  it("rejects an agent in pm-members.yaml and points to the migration command", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-members-"));
    write(join(root, "members.yaml"), humanRoster.replace(/  - nickname:[\s\S]*$/, agentMember));

    expect(() => loadMemberRoster(root, { members_path: "members.yaml" })).toThrow(
      /codex-executor.*config migrate-members --dry-run/,
    );
  });

  it("rejects a human in agent-members.yaml", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-members-"));
    write(join(root, "members.yaml"), humanRoster);
    write(
      join(root, ".specdojo", "agent-members.yaml"),
      `version: 1\nmembers:\n  - nickname: bob\n    display_name: Bob\n    roles: []\n    type: human\n`,
    );

    expect(() => loadMemberRoster(root, { members_path: "members.yaml" })).toThrow(
      /human 'bob' is not allowed/,
    );
  });

  it("migrates agents and leaves dry-run unchanged", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-members-"));
    const membersPath = join(root, "project", "pm-members.yaml");
    const mixed = humanRoster.replace(
      /members:[\s\S]*$/,
      `members:\n${humanRoster.split("members:\n")[1]}${agentMember}`,
    );
    write(membersPath, mixed);
    write(
      join(root, ".specdojo", "specdojo.config.json"),
      JSON.stringify({
        version: 1,
        projects: { "prj-test": { base_path: "project", members_path: "pm-members.yaml" } },
      }),
    );

    migrateAgentMembers({ rootDir: root, dryRun: true });
    expect(readFileSync(membersPath, "utf8")).toBe(mixed);
    expect(() => readFileSync(join(root, ".specdojo", "agent-members.yaml"), "utf8")).toThrow();

    migrateAgentMembers({ rootDir: root, dryRun: false });
    const humans = loadYaml(readFileSync(membersPath, "utf8")) as { members: unknown[] };
    const agents = loadYaml(
      readFileSync(join(root, ".specdojo", "agent-members.yaml"), "utf8"),
    ) as { members: unknown[] };
    expect(humans.members).toHaveLength(1);
    expect(agents.members).toHaveLength(1);
  });
});

describe("resolveAgentMember", () => {
  const concrete = {
    nickname: "sol-executor",
    display_name: "Sol Executor",
    email: null,
    roles: [],
    type: "agent" as const,
    provider: "codex" as const,
  };
  const roster: MemberRoster = {
    version: 1,
    members: [concrete],
    aliases: [
      { nickname: "codex-expert-executor", alias_of: "current-expert" },
      { nickname: "current-expert", alias_of: "sol-executor" },
    ],
  };

  it("resolves concrete names and alias chains to the concrete member", () => {
    expect(resolveAgentMember(roster, "sol-executor")?.nickname).toBe("sol-executor");
    expect(resolveAgentMember(roster, "codex-expert-executor")?.nickname).toBe("sol-executor");
  });

  it("returns undefined for an unknown name or malformed alias cycle", () => {
    expect(resolveAgentMember(roster, "unknown")).toBeUndefined();
    expect(
      resolveAgentMember(
        {
          version: 1,
          members: [concrete],
          aliases: [
            { nickname: "old-a", alias_of: "old-b" },
            { nickname: "old-b", alias_of: "old-a" },
          ],
        },
        "old-a",
      ),
    ).toBeUndefined();
  });
});
