import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { load } from "js-yaml";
import { collectInitAnswers, runInit, type InitPrompter } from "../../../src/commands/init.js";
import { loadExecDefaultsConfig, resolveMemberCommand } from "../../../src/exec/agent-config.js";
import {
  loadMemberRoster,
  resolveAgentMember,
  type SpecDojoConfig,
} from "../../../src/shared/specdojo-config.js";

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
  it("collects the interactive choices in the documented order without prompting for catalog", async () => {
    const answers = [
      "prj-1234",
      "Example Project",
      "yes",
      "alice",
      "Alice",
      "claude,codex",
      "yes",
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
      catalog: undefined,
      devcontainer: false,
    });
    expect(prompts).toHaveLength(8);
    expect(prompts.some((prompt) => prompt.includes("Deliverables catalog"))).toBe(false);
    expect(closed).toBe(true);
  });

  it("preserves --catalog option in interactive mode without prompting", async () => {
    const answers = ["prj-1234", "Example Project", "yes", "alice", "Alice", "codex", "no", "no"];
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

    await expect(collectInitAnswers({ catalog: "small" }, prompter)).resolves.toEqual({
      projectId: "prj-1234",
      projectName: "Example Project",
      register: true,
      nickname: "alice",
      displayName: "Alice",
      providers: ["codex"],
      exec: false,
      catalog: "small",
      devcontainer: false,
    });
    expect(prompts).toHaveLength(8);
    expect(prompts.some((prompt) => prompt.includes("Deliverables catalog"))).toBe(false);
    expect(closed).toBe(true);
  });

  it("asks for the recommended preset only after selecting a Dev Container", async () => {
    const answers = ["", "", "", "", "", "", "", "yes", ""];
    const prompts: string[] = [];
    const prompter: InitPrompter = {
      async question(prompt) {
        prompts.push(prompt);
        return answers.shift() ?? "";
      },
      close() {},
    };

    await expect(collectInitAnswers({}, prompter)).resolves.toMatchObject({
      devcontainer: true,
      devcontainerPreset: "recommended",
    });
    expect(prompts.at(-1)).toBe("Add the recommended Dev Container settings? [Y/n]: ");
    expect(prompts).toHaveLength(9);
  });

  it("uses the recommended preset for --yes with --devcontainer and allows opting out", async () => {
    await expect(collectInitAnswers({ yes: true, devcontainer: true })).resolves.toMatchObject({
      devcontainer: true,
      devcontainerPreset: "recommended",
    });
    await expect(
      collectInitAnswers({ yes: true, devcontainer: true, devcontainerPreset: "none" }),
    ).resolves.not.toHaveProperty("devcontainerPreset");
    await expect(
      collectInitAnswers({ yes: true, devcontainerPreset: "recommended" }),
    ).rejects.toThrow("--devcontainer-preset requires --devcontainer");
  });

  it("retries only an invalid interactive question and keeps earlier answers", async () => {
    const answers = [
      "project-1234",
      "prj-1234",
      "Example Project",
      "maybe",
      "yes",
      "Alice!",
      "alice",
      "Alice",
      "claud",
      "none",
      "yes",
      "codex",
      "later",
      "no",
    ];
    const prompts: string[] = [];
    const errors: string[] = [];
    let closed = false;
    vi.spyOn(process.stderr, "write").mockImplementation((chunk) => {
      errors.push(String(chunk));
      return true;
    });
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
      providers: ["codex"],
      exec: true,
      catalog: undefined,
      devcontainer: false,
    });
    expect(prompts.filter((prompt) => prompt.startsWith("Project ID"))).toHaveLength(2);
    expect(prompts.filter((prompt) => prompt.startsWith("Project name"))).toHaveLength(1);
    expect(prompts.filter((prompt) => prompt.startsWith("Orchestrator providers"))).toHaveLength(3);
    expect(prompts.filter((prompt) => prompt.startsWith("Delegate work"))).toHaveLength(1);
    expect(prompts.filter((prompt) => prompt.startsWith("Create a Dev Container"))).toHaveLength(2);
    expect(prompts.some((prompt) => prompt.includes("Deliverables catalog"))).toBe(false);
    expect(errors.join("")).toContain("Available: claude, codex, opencode, antigravity, copilot");
    expect(errors.join("")).toContain("--exec requires at least one --provider");
    expect(errors.join("")).toContain("yes/no で答えてください: later");
    expect(closed).toBe(true);
  });

  it("still rejects invalid non-interactive options", async () => {
    await expect(collectInitAnswers({ provider: "claud" })).rejects.toThrow(
      "Unknown provider: claud",
    );
    await expect(collectInitAnswers({ provider: "none", exec: true })).rejects.toThrow(
      "--exec requires at least one --provider",
    );
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
      const executor = resolveAgentMember(roster, "codex-executor");
      const reporter = resolveAgentMember(roster, "codex-reporter");
      expect(executor).toMatchObject({
        nickname: "terra-executor",
        model: "gpt-5.6-terra",
        stage_role: "executor",
      });
      expect(reporter).toMatchObject({ nickname: "terra-reporter", stage_role: "reporter" });

      const defaults = loadExecDefaultsConfig(join(repo, ".specdojo/exec-defaults.yaml"));
      expect(defaults.pipeline?.parent_validations).toBeUndefined();
      expect(output.join("")).toContain(
        "Omitted pipeline.parent_validations: no supported npm scripts were found in package.json.",
      );
      expect(resolveMemberCommand(defaults, executor!)).toContain("--model gpt-5.6-terra");
      expect(resolveMemberCommand(defaults, reporter!)).toContain("codex exec");

      const packageJson = JSON.parse(readFileSync(join(repo, "package.json"), "utf8")) as {
        scripts: Record<string, string>;
      };
      expect(packageJson.scripts["orch:sol"]).toContain("-m gpt-5.6-sol");
      expect(packageJson.scripts["orch:terra"]).toContain("-m gpt-5.6-terra");
      expect(packageJson.scripts["orch:codex"]).toBeUndefined();
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

      const roster = load(readFileSync(join(repo, ".specdojo/agent-members.yaml"), "utf8")) as {
        members: Array<{ provider: string }>;
        aliases: Array<{ nickname: string; alias_of: string }>;
      };
      expect(new Set(roster.members.map((member) => member.provider))).toEqual(
        new Set(["claude", "opencode", "copilot"]),
      );
      // 選ばなかった provider（codex・antigravity）の実体を指す別名は書かない。
      expect(roster.aliases).toEqual([
        { nickname: "claude-executor", alias_of: "sonnet-executor" },
        { nickname: "claude-review-executor", alias_of: "sonnet-review-executor" },
        { nickname: "claude-reporter", alias_of: "sonnet-reporter" },
        { nickname: "opencode-executor", alias_of: "gemma-executor" },
        { nickname: "opencode-review-executor", alias_of: "gemma-review-executor" },
        { nickname: "opencode-reporter", alias_of: "gemma-reporter" },
      ]);
      const loaded = loadMemberRoster(repo, {});
      const execDefaults = loadExecDefaultsConfig(join(repo, ".specdojo/exec-defaults.yaml"));
      expect(
        resolveMemberCommand(execDefaults, resolveAgentMember(loaded, "claude-reporter")!),
      ).toBe(
        "claude -p --verbose --agent claude-reporter --model sonnet --settings .specdojo/claude/settings.report.json",
      );
      expect(
        resolveMemberCommand(execDefaults, resolveAgentMember(loaded, "opencode-review-executor")!),
      ).toBe(
        "opencode run --agent opencode-review-executor --model ollama-local/gemma4:31b-mlx-work-64k",
      );
      const defaults = load(readFileSync(join(repo, ".specdojo/exec-defaults.yaml"), "utf8")) as {
        providers: Record<string, unknown>;
      };
      expect(Object.keys(defaults.providers).sort()).toEqual(["claude", "copilot", "opencode"]);
      expect(existsSync(join(repo, ".github/agents/specdojo-orchestrator.md"))).toBe(true);
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("generates Antigravity members that carry a currently provided model", async () => {
    const repo = createRepo("specdojo-init-antigravity-");
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    try {
      process.chdir(repo);
      await runInit({ yes: true, provider: "antigravity", exec: true });

      const roster = loadMemberRoster(repo, {});
      const executor = resolveAgentMember(roster, "agy-executor");
      expect(executor).toMatchObject({
        nickname: "flash-executor",
        model: "gemini-3.8-flash-high",
      });
      const defaults = loadExecDefaultsConfig(join(repo, ".specdojo/exec-defaults.yaml"));
      expect(resolveMemberCommand(defaults, executor!)).toContain("--model gemini-3.8-flash-high");
      expect(roster?.members.map((member) => member.model).join(" ")).not.toMatch(
        /gemini-3\.1-pro/,
      );
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("recommends the Opus orchestrator for Claude", async () => {
    const repo = createRepo("specdojo-init-claude-next-step-");
    const output: string[] = [];
    vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
      output.push(String(chunk));
      return true;
    });
    try {
      process.chdir(repo);
      await runInit({ yes: true, provider: "claude", dryRun: true });

      expect(output.join("")).toContain("Run npm run orch:opus");
      expect(output.join("")).not.toContain("Run npm run orch:sonnet");
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it.each([
    ["codex", "orch:sol", "orch:codex"],
    ["antigravity", "orch:flash", "orch:agy"],
  ])("recommends the model-family orchestrator for %s", async (provider, expected, legacy) => {
    const repo = createRepo(`specdojo-init-${provider}-next-step-`);
    const output: string[] = [];
    vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
      output.push(String(chunk));
      return true;
    });
    try {
      process.chdir(repo);
      await runInit({ yes: true, provider, dryRun: true });

      expect(output.join("")).toContain(`Run npm run ${expected}`);
      expect(output.join("")).not.toContain(`Run npm run ${legacy}`);
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("passes --workspace-name to Dev Container scaffolding", async () => {
    const repo = createRepo("specdojo-init-devcontainer-");
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    try {
      process.chdir(repo);
      await runInit({
        yes: true,
        provider: "codex",
        devcontainer: true,
        workspaceName: "stable-workspace",
      });

      const devcontainer = JSON.parse(
        readFileSync(join(repo, ".devcontainer/devcontainer.json"), "utf8"),
      ) as {
        workspaceMount: string;
        workspaceFolder: string;
        features?: Record<string, { packages?: string }>;
      };
      expect(devcontainer.workspaceMount).toContain("target=/workspaces/stable-workspace,");
      expect(devcontainer.workspaceFolder).toBe(
        "/workspaces/stable-workspace/${localWorkspaceFolderBasename}",
      );
      expect(
        devcontainer.features?.["ghcr.io/rocker-org/devcontainer-features/apt-packages:1"]
          ?.packages,
      ).toContain("tmux");
      expect(
        devcontainer.features?.["ghcr.io/rocker-org/devcontainer-features/apt-packages:1"]
          ?.packages,
      ).toContain("vim-nox");
      expect(existsSync(join(repo, ".devcontainer/vim/vimrc"))).toBe(true);
      expect(existsSync(join(repo, ".devcontainer/emacs/init.el"))).toBe(true);
      const extensions = JSON.parse(
        readFileSync(join(repo, ".vscode/extensions.json"), "utf8"),
      ) as { recommendations: string[] };
      expect(extensions.recommendations).toContain("openai.chatgpt");
      expect(extensions.recommendations).toContain("davidanson.vscode-markdownlint");
      expect(existsSync(join(repo, ".devcontainer/remote-host/specdojo-tmux.sh.sample"))).toBe(
        true,
      );
      expect(existsSync(join(repo, ".devcontainer/remote-host/ssh-config.sample"))).toBe(true);
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("creates a deliverables catalog when --catalog is passed, and guides later addition when omitted", async () => {
    const repoWithCatalog = createRepo("specdojo-init-catalog-");
    const outputWithCatalog: string[] = [];
    vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
      outputWithCatalog.push(String(chunk));
      return true;
    });
    try {
      process.chdir(repoWithCatalog);
      await runInit({
        yes: true,
        project: "prj-1234",
        name: "Example Project",
        provider: "codex",
        catalog: "small",
      });

      const config = JSON.parse(
        readFileSync(join(repoWithCatalog, ".specdojo/specdojo.config.json"), "utf8"),
      ) as SpecDojoConfig;
      expect(config.projects["prj-1234"].catalog_path).toBe("010-deliverables-catalog");
      expect(
        existsSync(
          join(
            repoWithCatalog,
            "docs/ja/projects/prj-1234/010-deliverables-catalog/dct-index.yaml",
          ),
        ),
      ).toBe(true);
      expect(outputWithCatalog.join("")).not.toContain("When deliverables are ready");
    } finally {
      rmSync(repoWithCatalog, { recursive: true, force: true });
    }

    const repoWithoutCatalog = createRepo("specdojo-init-nocatalog-");
    const outputWithoutCatalog: string[] = [];
    vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
      outputWithoutCatalog.push(String(chunk));
      return true;
    });
    try {
      process.chdir(repoWithoutCatalog);
      await runInit({
        yes: true,
        project: "prj-1234",
        name: "Example Project",
        provider: "codex",
      });

      const config = JSON.parse(
        readFileSync(join(repoWithoutCatalog, ".specdojo/specdojo.config.json"), "utf8"),
      ) as SpecDojoConfig;
      expect(config.projects["prj-1234"].catalog_path).toBeUndefined();
      expect(
        existsSync(join(repoWithoutCatalog, "docs/ja/projects/prj-1234/010-deliverables-catalog")),
      ).toBe(false);
      expect(outputWithoutCatalog.join("")).toContain(
        "When deliverables are ready, configure catalog_path in .specdojo/specdojo.config.json and run npx specdojo catalog scaffold",
      );
    } finally {
      rmSync(repoWithoutCatalog, { recursive: true, force: true });
    }
  });
});
