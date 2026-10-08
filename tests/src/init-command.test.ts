import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import yaml from "js-yaml";
import { collectInitAnswers, runInit, type InitPrompter } from "../../src/init-command.js";
import { loadExecDefaultsConfig, resolveMemberCommand } from "../../src/exec-agent-config.js";
import { loadMemberRoster, type SpecDojoConfig } from "../../src/specdojo-config.js";

const originalCwd = process.cwd();

afterEach(() => {
  process.chdir(originalCwd);
  process.exitCode = undefined;
  vi.restoreAllMocks();
});

function createRepo(prefix: string): string {
  const repo = mkdtempSync(join(tmpdir(), prefix));
  mkdirSync(join(repo, ".git"));
  writeFileSync(
    join(repo, "package.json"),
    `${JSON.stringify({ name: "fixture", private: true, scripts: {} }, null, 2)}\n`,
    "utf8",
  );
  return repo;
}

describe("specdojo init", () => {
  it("collects the interactive choices in the documented order", async () => {
    const answers = [
      "prj-1234",
      "Example Project",
      "yes",
      "alice",
      "Alice",
      "claude,codex",
      "yes",
      "small",
      "no",
    ];
    const prompts: string[] = [];
    let closed = false;
    const prompter: InitPrompter = {
      async question(prompt) {
        prompts.push(prompt);
        return answers.shift() ?? "";
      },
      close() {
        closed = true;
      },
    };

    await expect(collectInitAnswers({}, prompter)).resolves.toEqual({
      projectId: "prj-1234",
      projectName: "Example Project",
      register: true,
      nickname: "alice",
      displayName: "Alice",
      providers: ["claude", "codex"],
      exec: true,
      catalog: "small",
      devcontainer: false,
    });
    expect(prompts).toHaveLength(9);
    expect(closed).toBe(true);
  });

  it("creates a non-interactive exec-ready configuration and resolves its agents", async () => {
    const repo = createRepo("specdojo-init-");
    const output: string[] = [];
    vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
      output.push(String(chunk));
      return true;
    });
    try {
      process.chdir(repo);
      await runInit({
        yes: true,
        project: "prj-1234",
        name: "Example Project",
        nickname: "alice",
        displayName: "Alice",
        provider: "codex",
        exec: true,
      });

      const config = JSON.parse(
        readFileSync(join(repo, ".specdojo/specdojo.config.json"), "utf8"),
      ) as SpecDojoConfig;
      expect(config.projects["prj-1234"].members_path).toBe(
        "030-project-management/pm-members.yaml",
      );
      expect(config.agent_members_path).toBe(".specdojo/agent-members.yaml");
      expect(config.projects["prj-1234"].run?.worktree_base).toBe(`../${basename(repo)}-worktrees`);
      expect(
        existsSync(
          join(repo, "docs/ja/projects/prj-1234/controls/project-register/generated/pjr-index.md"),
        ),
      ).toBe(true);

      const roster = loadMemberRoster(repo, config.projects["prj-1234"]);
      const executor = roster?.members.find((member) => member.nickname === "codex-executor");
      const reporter = roster?.members.find((member) => member.nickname === "codex-reporter");
      expect(executor?.stage_role).toBe("executor");
      expect(reporter?.stage_role).toBe("reporter");

      const defaults = loadExecDefaultsConfig(join(repo, ".specdojo/exec-defaults.yaml"));
      expect(defaults.pipeline?.parent_validations).toBeUndefined();
      expect(output.join("")).toContain(
        "Omitted pipeline.parent_validations: no supported npm scripts were found in package.json.",
      );
      expect(resolveMemberCommand(defaults, executor!)).toContain("codex exec");
      expect(resolveMemberCommand(defaults, reporter!)).toContain("codex exec");

      const packageJson = JSON.parse(readFileSync(join(repo, "package.json"), "utf8")) as {
        scripts: Record<string, string>;
      };
      expect(packageJson.scripts["orch:codex"]).toContain("specdojo/codex/orchestrator.md");
      expect(output.join("")).toContain(
        "npx specdojo exec run --register <id> --executor-by codex-executor --reporter-by codex-reporter",
      );
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("includes only parent validations backed by package.json scripts", async () => {
    const repo = createRepo("specdojo-init-validations-");
    writeFileSync(
      join(repo, "package.json"),
      `${JSON.stringify(
        {
          name: "fixture",
          private: true,
          scripts: { "lint:ts": "eslint .", "test:unit": "vitest run" },
        },
        null,
        2,
      )}\n`,
      "utf8",
    );
    const output: string[] = [];
    vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
      output.push(String(chunk));
      return true;
    });
    try {
      process.chdir(repo);
      await runInit({ yes: true, provider: "codex", exec: true });

      const defaults = loadExecDefaultsConfig(join(repo, ".specdojo/exec-defaults.yaml"));
      expect(defaults.pipeline?.parent_validations).toEqual(["lint-ts", "test-unit"]);
      expect(output.join("")).toContain("Included parent validation: lint-ts (npm run lint:ts)");
      expect(output.join("")).toContain(
        'Skipped parent validation: lint-fm (package.json script "lint:fm" was not found)',
      );
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("does not write in dry-run mode and reports existing files as skipped", async () => {
    const repo = createRepo("specdojo-init-dry-");
    mkdirSync(join(repo, ".specdojo"));
    writeFileSync(join(repo, ".specdojo/specdojo.config.json"), '{"keep":true}\n', "utf8");
    const output: string[] = [];
    vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
      output.push(String(chunk));
      return true;
    });
    try {
      process.chdir(repo);
      await runInit({ yes: true, provider: "codex", exec: true, dryRun: true });

      expect(readFileSync(join(repo, ".specdojo/specdojo.config.json"), "utf8")).toBe(
        '{"keep":true}\n',
      );
      expect(existsSync(join(repo, ".specdojo/agent-members.yaml"))).toBe(false);
      expect(existsSync(join(repo, ".gitignore"))).toBe(false);
      expect(output.join("")).toContain("Skipped (already exists): .specdojo/specdojo.config.json");
      expect(output.join("")).toContain("[dry-run] would write: .specdojo/agent-members.yaml");
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("uses only the selected providers in the protected rosters", async () => {
    const repo = createRepo("specdojo-init-providers-");
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    try {
      process.chdir(repo);
      await runInit({ yes: true, provider: "claude,opencode,copilot", exec: true });

      const roster = yaml.load(
        readFileSync(join(repo, ".specdojo/agent-members.yaml"), "utf8"),
      ) as { members: Array<{ provider: string }> };
      expect(new Set(roster.members.map((member) => member.provider))).toEqual(
        new Set(["claude", "opencode", "copilot"]),
      );
      const defaults = yaml.load(
        readFileSync(join(repo, ".specdojo/exec-defaults.yaml"), "utf8"),
      ) as { providers: Record<string, unknown> };
      expect(Object.keys(defaults.providers).sort()).toEqual(["claude", "copilot", "opencode"]);
      expect(existsSync(join(repo, ".github/agents/specdojo-orchestrator.md"))).toBe(true);
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });
});
