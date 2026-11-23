import { afterEach, describe, expect, it, vi } from "vitest";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  ORCHESTRATOR_NPM_SCRIPTS,
  applyProviderScaffoldPlan,
  buildProviderScaffoldPlan,
  listProviderTemplates,
  runProviderScaffold,
  specdojoPackageRootDir,
} from "../../../src/shared/provider-scaffold.js";
import {
  PROTECTED_DIRECTORY_PREFIXES,
  PROTECTED_EXACT_PATHS,
} from "../../../src/exec/agent-protected-config.js";

async function makeClaudeTemplateFixture(packageRoot: string): Promise<void> {
  const templateDir = path.join(packageRoot, "templates", "claude");
  await mkdir(path.join(templateDir, "agents"), { recursive: true });
  await writeFile(path.join(templateDir, "agents", "claude-edit-agent.md"), "# edit\n", "utf8");
  await writeFile(path.join(templateDir, "agents", "claude-review-agent.md"), "# review\n", "utf8");
  await writeFile(path.join(templateDir, "settings.edit.json"), '{"mode":"edit"}\n', "utf8");
  await writeFile(
    path.join(templateDir, "settings.orchestrator.json"),
    '{"mode":"orchestrator"}\n',
    "utf8",
  );
  await writeFile(path.join(templateDir, "settings.review.json"), '{"mode":"review"}\n', "utf8");
  await writeFile(path.join(templateDir, "settings.report.json"), '{"mode":"report"}\n', "utf8");
  await writeFile(path.join(templateDir, "README.md"), "# readme\n", "utf8");
}

const CLAUDE_EDIT_GIT_REMOVE_DENIES = [
  "Bash(git rm -r *)",
  "Bash(git rm -f *)",
  "Bash(git rm --force *)",
  "Bash(git rm --cached *)",
  "Bash(git mv -f *)",
  "Bash(git mv --force *)",
];

const CLAUDE_REMOTE_WRITE_DENIES = [
  "Bash(git push)",
  "Bash(git push *)",
  "Bash(gh *)",
  "Bash(/usr/bin/git push)",
  "Bash(/usr/bin/git push *)",
  "Bash(/usr/bin/gh *)",
  "Bash(/usr/local/bin/git push)",
  "Bash(/usr/local/bin/git push *)",
  "Bash(/usr/local/bin/gh *)",
];

const CLAUDE_ORCHESTRATOR_READ_ALLOWS = [
  "Bash(gh pr list:*)",
  "Bash(gh pr view:*)",
  "Bash(gh release view:*)",
  "Bash(gh run list:*)",
  "Bash(gh run view:*)",
];

const CLAUDE_ORCHESTRATOR_WRITE_DENIES = [
  "Bash(git push:*)",
  "Bash(/usr/bin/gh:*)",
  "Bash(/usr/local/bin/gh:*)",
  "Bash(gh api:*)",
  "Bash(gh pr close:*)",
  "Bash(gh pr create:*)",
  "Bash(gh pr merge:*)",
  "Bash(gh release create:*)",
  "Bash(gh release delete:*)",
  "Bash(gh release edit:*)",
  "Bash(gh release upload:*)",
  "Bash(gh repo archive:*)",
  "Bash(gh repo create:*)",
  "Bash(gh repo delete:*)",
  "Bash(gh repo edit:*)",
  "Bash(gh repo fork:*)",
  "Bash(gh repo rename:*)",
  "Bash(gh repo sync:*)",
];

afterEach(() => {
  vi.restoreAllMocks();
  process.exitCode = undefined;
});

describe("specdojoPackageRootDir", () => {
  it("resolves the directory that contains package.json", () => {
    const root = specdojoPackageRootDir();

    expect(existsSync(path.join(root, "package.json"))).toBe(true);
  });

  it("ships a reporter profile that cannot edit files or commit changes", async () => {
    const settings = JSON.parse(
      await readFile(
        path.join(specdojoPackageRootDir(), "templates", "claude", "settings.report.json"),
        "utf8",
      ),
    ) as { permissions?: { allow?: string[]; deny?: string[] } };

    expect(settings.permissions?.allow).toBeUndefined();
    // Write(path) は claude CLI の権限判定の対象外で、Edit(path) が全ファイル編集ツールを覆う。
    // 無効なルールを残すと CLI が警告を出すため、deny は有効な Edit/Bash rule だけにする。
    expect(settings.permissions?.deny).toEqual([
      "Edit(**)",
      "Bash(git add *)",
      "Bash(git commit *)",
      ...CLAUDE_REMOTE_WRITE_DENIES,
    ]);
  });

  it("ships an edit profile that covers the repository except runner-protected paths", async () => {
    const settings = JSON.parse(
      await readFile(
        path.join(specdojoPackageRootDir(), "templates", "claude", "settings.edit.json"),
        "utf8",
      ),
    ) as { permissions?: { allow?: string[]; deny?: string[] } };

    expect(settings.permissions?.allow).toContain("Edit(**)");
    expect(settings.permissions?.deny).toEqual([
      ...PROTECTED_DIRECTORY_PREFIXES.map((prefix) => `Edit(${prefix}**)`),
      ...[...PROTECTED_EXACT_PATHS].map((protectedPath) => `Edit(./${protectedPath})`),
      ...CLAUDE_EDIT_GIT_REMOVE_DENIES,
      ...CLAUDE_REMOTE_WRITE_DENIES,
    ]);
  });

  it("ships full GitHub CLI denials for every Claude pipeline role", async () => {
    const templateRoot = path.join(specdojoPackageRootDir(), "templates", "claude");
    for (const fileName of ["settings.edit.json", "settings.review.json", "settings.report.json"]) {
      const settings = JSON.parse(await readFile(path.join(templateRoot, fileName), "utf8")) as {
        permissions?: { deny?: string[] };
      };
      expect(settings.permissions?.deny).toEqual(
        expect.arrayContaining(CLAUDE_REMOTE_WRITE_DENIES),
      );
    }
  });

  it("ships a separate Claude orchestrator profile with read-only GitHub CLI access", async () => {
    const settings = JSON.parse(
      await readFile(
        path.join(specdojoPackageRootDir(), "templates", "claude", "settings.orchestrator.json"),
        "utf8",
      ),
    ) as { permissions?: { allow?: string[]; deny?: string[] } };

    expect(settings.permissions?.allow).toEqual(
      expect.arrayContaining(["Edit(**)", ...CLAUDE_ORCHESTRATOR_READ_ALLOWS]),
    );
    expect(settings.permissions?.deny).toEqual(
      expect.arrayContaining(CLAUDE_ORCHESTRATOR_WRITE_DENIES),
    );
    expect(settings.permissions?.deny).not.toContain("Bash(gh *)");
    expect(settings.permissions?.deny?.some((rule) => rule.startsWith("Edit("))).toBe(false);
    expect(ORCHESTRATOR_NPM_SCRIPTS.claude?.["orch:opus"]).toContain(
      "--settings .specdojo/claude/settings.orchestrator.json",
    );
    expect(ORCHESTRATOR_NPM_SCRIPTS.claude?.["orch:sonnet"]).toContain(
      "--settings .specdojo/claude/settings.orchestrator.json",
    );
  });

  it("ships command denials for Codex and OpenCode", async () => {
    const packageRoot = specdojoPackageRootDir();
    const codexRules = await readFile(
      path.join(packageRoot, "templates", "codex", "rules", "specdojo.rules"),
      "utf8",
    );
    expect(codexRules).toContain('["git", "/usr/bin/git", "/usr/local/bin/git"]');
    expect(codexRules).toContain('["gh", "/usr/bin/gh", "/usr/local/bin/gh"]');
    expect(codexRules.match(/decision = "forbidden"/g)).toHaveLength(4);

    for (const fileName of ["opencode-executor.md", "opencode-review-executor.md"]) {
      const agent = await readFile(
        path.join(packageRoot, "templates", "opencode", "agents", fileName),
        "utf8",
      );
      expect(agent).toContain('    "git push*": deny');
      expect(agent).toContain('    "gh *": deny');
    }

    const opencodeOrchestrator = await readFile(
      path.join(packageRoot, "templates", "opencode", "agents", "specdojo-orchestrator.md"),
      "utf8",
    );
    expect(opencodeOrchestrator).toContain('    "gh pr view*": allow');
    expect(opencodeOrchestrator).toContain('    "gh release view*": allow');
    expect(opencodeOrchestrator).toContain('    "gh api*": deny');
    expect(opencodeOrchestrator).toContain('    "gh pr create*": deny');
    expect(opencodeOrchestrator).not.toContain('    "gh *": deny');
    expect(opencodeOrchestrator).toContain("  edit: allow");
    expect(opencodeOrchestrator).not.toContain('    ".specdojo/**": deny');
    expect(opencodeOrchestrator).toContain("model: ollama-local/gemma4:31b-mlx-work-64k");
  });

  it("ships Codex agent definitions that do not use retired or migration models", async () => {
    const packageRoot = specdojoPackageRootDir();
    const agentsDir = path.join(packageRoot, "templates", "codex", "agents");
    const fileNames = (await readdir(agentsDir)).filter((name) => name.endsWith(".toml")).sort();

    expect(fileNames).toEqual([
      "codex-executor.toml",
      "codex-expert-executor.toml",
      "codex-expert-review-executor.toml",
      "codex-review-executor.toml",
      "specdojo-orchestrator.toml",
    ]);

    const agentModels: Record<string, string> = {};
    for (const fileName of fileNames) {
      const content = await readFile(path.join(agentsDir, fileName), "utf8");
      const match = /^model\s*=\s*"([^"]+)"/m.exec(content);
      expect(match).not.toBeNull();
      const model = match![1]!;
      agentModels[fileName] = model;

      // 根拠: learn.chatgpt.com/docs/models。提供終了モデルと移行用 gpt-5.6-* を禁止する。
      expect(model).not.toBe("gpt-5.4-mini");
      expect(model).not.toBe("gpt-5.5");
      expect(model).not.toMatch(/^gpt-5\.6/);
    }

    expect(agentModels).toEqual({
      "codex-executor.toml": "gpt-6-luna",
      "codex-expert-executor.toml": "gpt-6.1-sol",
      "codex-expert-review-executor.toml": "gpt-6.1-sol",
      "codex-review-executor.toml": "gpt-6-luna",
      "specdojo-orchestrator.toml": "gpt-6.1-sol",
    });
  });
});

describe("listProviderTemplates", () => {
  it("returns provider directory names sorted by name", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));
    try {
      await mkdir(path.join(dir, "templates", "opencode"), { recursive: true });
      await mkdir(path.join(dir, "templates", "claude"), { recursive: true });
      await writeFile(path.join(dir, "templates", "not-a-provider.txt"), "x\n", "utf8");

      const actual = await listProviderTemplates(dir);

      expect(actual).toEqual(["claude", "opencode"]);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("returns an empty list when templates directory is missing", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));
    try {
      const actual = await listProviderTemplates(dir);

      expect(actual).toEqual([]);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});

describe("buildProviderScaffoldPlan", () => {
  it("copies provider agent member snippets under their agent registry name", async () => {
    const packageRoot = specdojoPackageRootDir();
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));
    try {
      const plan = await buildProviderScaffoldPlan({
        packageRoot,
        repoRoot: dir,
        provider: "copilot",
      });

      expect(plan.entries.map((entry) => entry.destinationRelPath)).toContain(
        ".specdojo/copilot/agent-members-snippet.yaml",
      );
      expect(plan.entries.map((entry) => entry.destinationRelPath)).not.toContain(
        ".specdojo/copilot/pm-members-snippet.yaml",
      );
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("maps agents to .<provider>/agents and other files to .specdojo/<provider>, excluding README.md", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));
    try {
      const packageRoot = path.join(dir, "pkg");
      const repoRoot = path.join(dir, "repo");
      await makeClaudeTemplateFixture(packageRoot);
      await mkdir(repoRoot, { recursive: true });

      const plan = await buildProviderScaffoldPlan({ packageRoot, repoRoot, provider: "claude" });

      expect(plan.provider).toBe("claude");
      expect(plan.entries.map((entry) => entry.destinationRelPath)).toEqual([
        ".claude/agents/claude-edit-agent.md",
        ".claude/agents/claude-review-agent.md",
        ".specdojo/claude/settings.edit.json",
        ".specdojo/claude/settings.orchestrator.json",
        ".specdojo/claude/settings.report.json",
        ".specdojo/claude/settings.review.json",
      ]);
      expect(plan.entries[0]?.destinationPath).toBe(
        path.join(repoRoot, ".claude", "agents", "claude-edit-agent.md"),
      );
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("maps Codex command rules to the project-local discovery path", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));
    try {
      const repoRoot = path.join(dir, "repo");
      await mkdir(repoRoot, { recursive: true });

      const plan = await buildProviderScaffoldPlan({
        packageRoot: specdojoPackageRootDir(),
        repoRoot,
        provider: "codex",
      });

      expect(plan.entries.map((entry) => entry.destinationRelPath)).toContain(
        ".codex/rules/specdojo.rules",
      );
      expect(plan.entries.map((entry) => entry.destinationRelPath)).not.toContain(
        ".specdojo/codex/rules/specdojo.rules",
      );
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("maps OpenCode agents to .opencode/agents and opencode.json to repository root", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));
    try {
      const repoRoot = path.join(dir, "repo");
      await mkdir(repoRoot, { recursive: true });

      const plan = await buildProviderScaffoldPlan({
        packageRoot: specdojoPackageRootDir(),
        repoRoot,
        provider: "opencode",
      });

      expect(plan.provider).toBe("opencode");
      expect(plan.entries.map((entry) => entry.destinationRelPath)).toEqual([
        ".agents/skills/specdojo-exec-in-session/SKILL.md",
        ".opencode/agents/opencode-executor.md",
        ".opencode/agents/opencode-reporter.md",
        ".opencode/agents/opencode-review-executor.md",
        ".opencode/agents/specdojo-orchestrator.md",
        "opencode.json",
      ]);
      const opencodeJsonEntry = plan.entries.find((e) => e.destinationRelPath === "opencode.json");
      expect(opencodeJsonEntry?.destinationPath).toBe(path.join(repoRoot, "opencode.json"));
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("rejects an unknown provider with the available provider list", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));
    try {
      const packageRoot = path.join(dir, "pkg");
      await makeClaudeTemplateFixture(packageRoot);

      await expect(
        buildProviderScaffoldPlan({ packageRoot, repoRoot: dir, provider: "codex" }),
      ).rejects.toThrow(/Unknown provider template: codex\. Available: claude/);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});

describe("buildProviderScaffoldPlan skill distribution", () => {
  const SKILL_CANONICAL = ".agents/skills/specdojo-exec-in-session/SKILL.md";
  const CLAUDE_SKILL_WRAPPER = ".claude/skills/specdojo-exec-in-session/SKILL.md";

  it.each([
    ["claude", [SKILL_CANONICAL, CLAUDE_SKILL_WRAPPER]],
    ["codex", [SKILL_CANONICAL]],
    ["opencode", [SKILL_CANONICAL]],
    ["copilot", [SKILL_CANONICAL]],
  ])("places the skill files that %s reads", async (provider, expected) => {
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));
    try {
      const plan = await buildProviderScaffoldPlan({
        packageRoot: specdojoPackageRootDir(),
        repoRoot: dir,
        provider,
      });

      const skillPaths = plan.entries
        .map((entry) => entry.destinationRelPath)
        .filter((relPath) => relPath.includes("/skills/"));
      expect(skillPaths).toEqual(expected);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("ships the canonical skill and the Claude Code wrapper unchanged from their sources", async () => {
    const packageRoot = specdojoPackageRootDir();
    const read = (relPath: string) => readFile(path.join(packageRoot, relPath), "utf8");

    expect(await read("templates/agent-skills/specdojo-exec-in-session/SKILL.md")).toBe(
      await read(SKILL_CANONICAL),
    );
    expect(await read("templates/claude/skills/specdojo-exec-in-session/SKILL.md")).toBe(
      await read(CLAUDE_SKILL_WRAPPER),
    );
  });

  it("does not list or accept the shared skill directory as a provider", async () => {
    const packageRoot = specdojoPackageRootDir();

    expect(await listProviderTemplates(packageRoot)).not.toContain("agent-skills");
    await expect(
      buildProviderScaffoldPlan({ packageRoot, repoRoot: packageRoot, provider: "agent-skills" }),
    ).rejects.toThrow(/Unknown provider template: agent-skills/);
  });

  it("keeps an existing skill without force and replaces it with force", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));
    try {
      const packageRoot = specdojoPackageRootDir();
      const existingPath = path.join(dir, ...SKILL_CANONICAL.split("/"));
      await mkdir(path.dirname(existingPath), { recursive: true });
      await writeFile(existingPath, "# customized\n", "utf8");
      const plan = await buildProviderScaffoldPlan({
        packageRoot,
        repoRoot: dir,
        provider: "claude",
      });

      const outcomes = await applyProviderScaffoldPlan(plan, { force: false });

      const skipped = outcomes.filter((outcome) => !outcome.written);
      expect(skipped.map((outcome) => outcome.entry.destinationRelPath)).toEqual([SKILL_CANONICAL]);
      expect(await readFile(existingPath, "utf8")).toBe("# customized\n");
      expect(existsSync(path.join(dir, ...CLAUDE_SKILL_WRAPPER.split("/")))).toBe(true);

      await applyProviderScaffoldPlan(plan, { force: true });

      expect(await readFile(existingPath, "utf8")).toBe(
        await readFile(path.join(packageRoot, ...SKILL_CANONICAL.split("/")), "utf8"),
      );
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});

describe("applyProviderScaffoldPlan", () => {
  it("copies template files to the destinations, creating directories", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));
    try {
      const packageRoot = path.join(dir, "pkg");
      const repoRoot = path.join(dir, "repo");
      await makeClaudeTemplateFixture(packageRoot);
      await mkdir(repoRoot, { recursive: true });
      const plan = await buildProviderScaffoldPlan({ packageRoot, repoRoot, provider: "claude" });

      const outcomes = await applyProviderScaffoldPlan(plan, { force: false });

      expect(outcomes.every((outcome) => outcome.written)).toBe(true);
      const copied = await readFile(
        path.join(repoRoot, ".specdojo", "claude", "settings.report.json"),
        "utf8",
      );
      expect(copied).toBe('{"mode":"report"}\n');
      expect(existsSync(path.join(repoRoot, ".claude", "agents", "README.md"))).toBe(false);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("skips existing files without force and overwrites them with force", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));
    try {
      const packageRoot = path.join(dir, "pkg");
      const repoRoot = path.join(dir, "repo");
      await makeClaudeTemplateFixture(packageRoot);
      const existingPath = path.join(repoRoot, ".specdojo", "claude", "settings.edit.json");
      await mkdir(path.dirname(existingPath), { recursive: true });
      await writeFile(existingPath, '{"customized":true}\n', "utf8");
      const plan = await buildProviderScaffoldPlan({ packageRoot, repoRoot, provider: "claude" });

      const outcomes = await applyProviderScaffoldPlan(plan, { force: false });

      const skipped = outcomes.filter((outcome) => !outcome.written);
      expect(skipped.map((outcome) => outcome.entry.destinationRelPath)).toEqual([
        ".specdojo/claude/settings.edit.json",
      ]);
      expect(await readFile(existingPath, "utf8")).toBe('{"customized":true}\n');

      const forcedOutcomes = await applyProviderScaffoldPlan(plan, { force: true });

      expect(forcedOutcomes.every((outcome) => outcome.written)).toBe(true);
      expect(await readFile(existingPath, "utf8")).toBe('{"mode":"edit"}\n');
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});

describe("runProviderScaffold", () => {
  it("rejects global mode for unsupported providers before writing repository files", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));
    try {
      const packageRoot = path.join(dir, "pkg");
      const repoRoot = path.join(dir, "repo");
      await makeClaudeTemplateFixture(packageRoot);

      await expect(
        runProviderScaffold("claude", {
          packageRoot,
          repoRoot,
          force: false,
          dryRun: false,
          global: true,
        }),
      ).rejects.toThrow(/does not define global settings/);
      expect(existsSync(path.join(repoRoot, ".claude"))).toBe(false);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("adds npm scripts for the provider when package.json exists", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));
    try {
      const packageRoot = path.join(dir, "pkg");
      const repoRoot = path.join(dir, "repo");
      await makeClaudeTemplateFixture(packageRoot);
      await mkdir(repoRoot, { recursive: true });
      await writeFile(
        path.join(repoRoot, "package.json"),
        JSON.stringify({ name: "test", scripts: { test: "echo test" } }),
        "utf8",
      );

      // stdoutをモックしないとログが出るがとりあえずOKとする
      vi.spyOn(process.stdout, "write").mockImplementation(() => true);

      try {
        await runProviderScaffold("claude", { packageRoot, repoRoot, force: false, dryRun: false });
      } finally {
        vi.restoreAllMocks();
      }

      const pkg = JSON.parse(await readFile(path.join(repoRoot, "package.json"), "utf8"));
      expect(pkg.scripts["orch:opus"]).toBe(
        "specdojo orchestrator launch --provider claude -- --agent specdojo-orchestrator --model opus --settings .specdojo/claude/settings.orchestrator.json",
      );
      expect(pkg.scripts["orch:sonnet"]).toBe(
        "specdojo orchestrator launch --provider claude -- --agent specdojo-orchestrator --model sonnet --settings .specdojo/claude/settings.orchestrator.json",
      );
      expect(pkg.scripts.test).toBe("echo test");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it.each([
    {
      provider: "codex",
      scripts: {
        "orch:sol":
          'specdojo orchestrator launch --provider codex -- -m gpt-6.1-sol "$(cat .specdojo/codex/orchestrator.md)"',
        "orch:luna":
          'specdojo orchestrator launch --provider codex -- -m gpt-6-luna "$(cat .specdojo/codex/orchestrator.md)"',
      },
      legacy: "orch:codex",
    },
    {
      provider: "opencode",
      scripts: {
        "orch:opencode":
          "specdojo orchestrator launch --provider opencode -- --agent specdojo-orchestrator",
      },
      legacy: undefined,
    },
  ])("adds model-family npm scripts for $provider", async ({ provider, scripts, legacy }) => {
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));
    try {
      const packageRoot = path.join(dir, "pkg");
      const repoRoot = path.join(dir, "repo");
      const templateDir = path.join(packageRoot, "templates", provider);
      await mkdir(templateDir, { recursive: true });
      await writeFile(path.join(templateDir, "orchestrator.md"), "# orchestrator\n", "utf8");
      await mkdir(repoRoot, { recursive: true });
      await writeFile(
        path.join(repoRoot, "package.json"),
        JSON.stringify({ name: "test", scripts: {} }),
        "utf8",
      );
      vi.spyOn(process.stdout, "write").mockImplementation(() => true);

      await runProviderScaffold(provider, {
        packageRoot,
        repoRoot,
        force: false,
        dryRun: false,
      });

      const pkg = JSON.parse(await readFile(path.join(repoRoot, "package.json"), "utf8"));
      expect(pkg.scripts).toMatchObject(scripts);
      if (legacy) expect(pkg.scripts[legacy]).toBeUndefined();
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("keeps legacy scripts while adding their model-family replacements", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));
    try {
      const packageRoot = path.join(dir, "pkg");
      const repoRoot = path.join(dir, "repo");
      const templateDir = path.join(packageRoot, "templates", "codex");
      await mkdir(templateDir, { recursive: true });
      await writeFile(path.join(templateDir, "orchestrator.md"), "# orchestrator\n", "utf8");
      await mkdir(repoRoot, { recursive: true });
      await writeFile(
        path.join(repoRoot, "package.json"),
        JSON.stringify({ name: "test", scripts: { "orch:codex": "custom codex" } }),
        "utf8",
      );
      vi.spyOn(process.stdout, "write").mockImplementation(() => true);

      await runProviderScaffold("codex", {
        packageRoot,
        repoRoot,
        force: true,
        dryRun: false,
      });

      const pkg = JSON.parse(await readFile(path.join(repoRoot, "package.json"), "utf8"));
      expect(pkg.scripts["orch:codex"]).toBe("custom codex");
      expect(pkg.scripts["orch:sol"]).toContain("-m gpt-6.1-sol");
      expect(pkg.scripts["orch:luna"]).toContain("-m gpt-6-luna");
      expect(pkg.scripts["orch:terra"]).toBeUndefined();
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("does not overwrite existing npm scripts even with force", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));
    try {
      const packageRoot = path.join(dir, "pkg");
      const repoRoot = path.join(dir, "repo");
      await makeClaudeTemplateFixture(packageRoot);
      await mkdir(repoRoot, { recursive: true });
      await writeFile(
        path.join(repoRoot, "package.json"),
        JSON.stringify({ name: "test", scripts: { "orch:opus": "custom" } }),
        "utf8",
      );

      vi.spyOn(process.stdout, "write").mockImplementation(() => true);

      try {
        await runProviderScaffold("claude", { packageRoot, repoRoot, force: false, dryRun: false });

        const pkg = JSON.parse(await readFile(path.join(repoRoot, "package.json"), "utf8"));
        expect(pkg.scripts["orch:opus"]).toBe("custom");

        await runProviderScaffold("claude", { packageRoot, repoRoot, force: true, dryRun: false });

        const pkgForced = JSON.parse(await readFile(path.join(repoRoot, "package.json"), "utf8"));
        // 利用者が書き換えたスクリプトは、テンプレートを配置し直すときも保つ。
        expect(pkgForced.scripts["orch:opus"]).toBe("custom");
        expect(pkgForced.scripts["orch:sonnet"]).toBe(
          "specdojo orchestrator launch --provider claude -- --agent specdojo-orchestrator --model sonnet --settings .specdojo/claude/settings.orchestrator.json",
        );
      } finally {
        vi.restoreAllMocks();
      }
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("reports a broken package.json and sets a failing exit code", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));
    try {
      const packageRoot = path.join(dir, "pkg");
      const repoRoot = path.join(dir, "repo");
      await makeClaudeTemplateFixture(packageRoot);
      await mkdir(repoRoot, { recursive: true });
      await writeFile(path.join(repoRoot, "package.json"), "{ not json", "utf8");
      vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const stderr = vi.spyOn(process.stderr, "write").mockImplementation(() => true);

      await runProviderScaffold("claude", { packageRoot, repoRoot, force: false, dryRun: false });

      expect(process.exitCode).toBe(1);
      expect(stderr.mock.calls.map((call) => String(call[0])).join("")).toMatch(
        /Failed to update package\.json .*package\.json/,
      );
      expect(await readFile(path.join(repoRoot, "package.json"), "utf8")).toBe("{ not json");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("keeps the indentation of an existing package.json", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));
    try {
      const packageRoot = path.join(dir, "pkg");
      const repoRoot = path.join(dir, "repo");
      await makeClaudeTemplateFixture(packageRoot);
      await mkdir(repoRoot, { recursive: true });
      await writeFile(
        path.join(repoRoot, "package.json"),
        JSON.stringify({ name: "test" }, null, 4) + "\n",
        "utf8",
      );
      vi.spyOn(process.stdout, "write").mockImplementation(() => true);

      await runProviderScaffold("claude", { packageRoot, repoRoot, force: false, dryRun: false });

      const content = await readFile(path.join(repoRoot, "package.json"), "utf8");
      expect(content).toMatch(/^\{\n {4}"name"/);
      expect(JSON.parse(content).scripts["orch:opus"]).toBe(
        "specdojo orchestrator launch --provider claude -- --agent specdojo-orchestrator --model opus --settings .specdojo/claude/settings.orchestrator.json",
      );
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("does not write changes on dryRun", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));
    try {
      const packageRoot = path.join(dir, "pkg");
      const repoRoot = path.join(dir, "repo");
      await makeClaudeTemplateFixture(packageRoot);
      await mkdir(repoRoot, { recursive: true });
      await writeFile(
        path.join(repoRoot, "package.json"),
        JSON.stringify({ name: "test", scripts: {} }),
        "utf8",
      );

      vi.spyOn(process.stdout, "write").mockImplementation(() => true);

      try {
        await runProviderScaffold("claude", { packageRoot, repoRoot, force: false, dryRun: true });
      } finally {
        vi.restoreAllMocks();
      }

      const pkg = JSON.parse(await readFile(path.join(repoRoot, "package.json"), "utf8"));
      expect(pkg.scripts["orch:opus"]).toBeUndefined();
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("scaffolds OpenCode settings with ollama-local connection and mlx-work-64k models into an empty repository", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));
    try {
      const repoRoot = path.join(dir, "repo");
      await mkdir(repoRoot, { recursive: true });
      vi.spyOn(process.stdout, "write").mockImplementation(() => true);

      await runProviderScaffold("opencode", {
        packageRoot: specdojoPackageRootDir(),
        repoRoot,
        force: false,
        dryRun: false,
      });

      expect(existsSync(path.join(repoRoot, "opencode.json"))).toBe(true);
      expect(existsSync(path.join(repoRoot, ".opencode/agents/opencode-executor.md"))).toBe(true);
      expect(existsSync(path.join(repoRoot, ".opencode/agents/specdojo-orchestrator.md"))).toBe(
        true,
      );

      const opencodeJson = JSON.parse(
        await readFile(path.join(repoRoot, "opencode.json"), "utf8"),
      ) as {
        provider: Record<
          string,
          { npm: string; options: { baseURL: string }; models: Record<string, unknown> }
        >;
        model: string;
      };
      expect(opencodeJson.provider["ollama-local"]).toBeDefined();
      expect(opencodeJson.provider["ollama-local"]?.npm).toBe("@ai-sdk/openai-compatible");
      expect(opencodeJson.provider["ollama-local"]?.options.baseURL).toBe(
        "http://host.docker.internal:11434/v1",
      );
      expect(Object.keys(opencodeJson.provider["ollama-local"]?.models ?? {}).sort()).toEqual([
        "gemma4:26b-mlx-work-64k",
        "gemma4:31b-mlx-work-64k",
        "qwen3.8:27b-mlx-work-64k",
      ]);
      expect(opencodeJson.model).toBe("ollama-local/gemma4:31b-mlx-work-64k");

      const orchestrator = await readFile(
        path.join(repoRoot, ".opencode/agents/specdojo-orchestrator.md"),
        "utf8",
      );
      expect(orchestrator).toContain("model: ollama-local/gemma4:31b-mlx-work-64k");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("does not overwrite existing opencode.json without force", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));
    try {
      const repoRoot = path.join(dir, "repo");
      await mkdir(repoRoot, { recursive: true });
      await writeFile(
        path.join(repoRoot, "opencode.json"),
        JSON.stringify({ custom: "preserved" }),
        "utf8",
      );
      vi.spyOn(process.stdout, "write").mockImplementation(() => true);

      await runProviderScaffold("opencode", {
        packageRoot: specdojoPackageRootDir(),
        repoRoot,
        force: false,
        dryRun: false,
      });

      const opencodeJson = JSON.parse(await readFile(path.join(repoRoot, "opencode.json"), "utf8"));
      expect(opencodeJson).toEqual({ custom: "preserved" });
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
