import { afterEach, describe, expect, it, vi } from "vitest";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { load } from "js-yaml";
import {
  ORCHESTRATOR_NPM_SCRIPTS,
  applyProviderScaffoldPlan,
  buildProviderScaffoldPlan,
  listProviderTemplates,
  mergeProviderGlobalSettings,
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

const ANTIGRAVITY_GLOBAL_SETTINGS = {
  permissions: {
    allow: ["command(git status)", "command(npm run)"],
    deny: ["command(git push)", "write_file(.specdojo/)"],
  },
};

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

async function makeAntigravityTemplateFixture(packageRoot: string): Promise<void> {
  const templateDir = path.join(packageRoot, "templates", "antigravity");
  await mkdir(templateDir, { recursive: true });
  await writeFile(path.join(templateDir, "orchestrator.md"), "# orchestrator\n", "utf8");
  await writeFile(
    path.join(templateDir, "settings.global.json"),
    `${JSON.stringify(ANTIGRAVITY_GLOBAL_SETTINGS, null, 2)}\n`,
    "utf8",
  );
}

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

    expect(settings.permissions?.allow).toEqual(["Edit(**)"]);
    expect(settings.permissions?.deny).toEqual([
      ...PROTECTED_DIRECTORY_PREFIXES.map((prefix) => `Edit(${prefix}**)`),
      ...[...PROTECTED_EXACT_PATHS].map((protectedPath) => `Edit(./${protectedPath})`),
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

  it("ships command denials for Codex, OpenCode, and Antigravity", async () => {
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

    const antigravity = JSON.parse(
      await readFile(
        path.join(packageRoot, "templates", "antigravity", "settings.global.json"),
        "utf8",
      ),
    ) as { permissions: { deny: string[] } };
    expect(antigravity.permissions.deny).toEqual(
      expect.arrayContaining([
        "command(git push)",
        "command(gh)",
        "command(/usr/bin/git push)",
        "command(/usr/bin/gh)",
      ]),
    );
  });

  it("ships scoped Antigravity permissions without the all-permissions bypass", async () => {
    const packageRoot = specdojoPackageRootDir();
    const settings = JSON.parse(
      await readFile(
        path.join(packageRoot, "templates", "antigravity", "settings.global.json"),
        "utf8",
      ),
    ) as { permissions: { allow: string[]; deny: string[] } };
    const execDefaults = await readFile(
      path.join(packageRoot, "templates", "antigravity", "exec-defaults-snippet.yaml"),
      "utf8",
    );

    // グローバル設定は利用者のすべてのリポジトリに効くため、読み取りの git コマンドだけを許可する。
    expect(settings.permissions.allow).toEqual([
      "command(git status)",
      "command(git diff)",
      "command(git log)",
      "command(git show)",
    ]);
    expect(settings.permissions.deny).toEqual(
      expect.arrayContaining([
        "command(git push)",
        "command(gh)",
        "read_file(.env)",
        "write_file(.specdojo/exec-defaults.yaml)",
        "write_file(package.json)",
      ]),
    );
    expect(execDefaults).not.toContain("--dangerously-skip-permissions");
    expect(execDefaults).toContain("--model {model}");
    expect(execDefaults).not.toMatch(/gemini-3\.1-pro|claude-sonnet-4-6|claude-opus-4-6/);
  });

  it("ships Antigravity members that carry currently provided models by model family", async () => {
    const packageRoot = specdojoPackageRootDir();
    const snippet = load(
      await readFile(
        path.join(packageRoot, "templates", "antigravity", "agent-members-snippet.yaml"),
        "utf8",
      ),
    ) as { members: Array<{ nickname: string; model?: string }> };

    // model の ID は実体の model の 1 か所に書き、実体の名前は model の系統で付ける（PJR-ZM1K）。
    expect(
      Object.fromEntries(snippet.members.map((member) => [member.nickname, member.model])),
    ).toEqual({
      "flash-executor": "gemini-3.8-flash-medium",
      "flash-high-executor": "gemini-3.8-flash-high",
      "flash-high-review-executor": "gemini-3.8-flash-high",
      "flash-reporter": "gemini-3.8-flash-medium",
      "agy-sonnet-executor": "claude-sonnet-5-5-medium",
      "agy-opus-executor": "claude-opus-5-5-high",
      "agy-opus-review-executor": "claude-opus-5-5-high",
      "agy-gpt-oss-executor": "gpt-oss-120b-medium",
    });
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

  it("keeps the opt-in global settings template out of the repository plan", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));
    try {
      const packageRoot = path.join(dir, "pkg");
      const repoRoot = path.join(dir, "repo");
      await makeAntigravityTemplateFixture(packageRoot);

      const plan = await buildProviderScaffoldPlan({
        packageRoot,
        repoRoot,
        provider: "antigravity",
      });

      expect(plan.entries.map((entry) => entry.destinationRelPath)).toEqual([
        ".specdojo/antigravity/orchestrator.md",
      ]);
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

describe("mergeProviderGlobalSettings", () => {
  it("preserves existing settings, appends missing permissions, and backs up the original", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));
    try {
      const packageRoot = path.join(dir, "pkg");
      const homeDir = path.join(dir, "home");
      const settingsDir = path.join(homeDir, ".gemini", "antigravity-cli");
      const settingsPath = path.join(settingsDir, "settings.json");
      const original = {
        colorScheme: "dark",
        permissions: {
          allow: ["command(custom)"],
          deny: ["command(git push)"],
          customList: ["keep-me"],
        },
      };
      const originalContent = `${JSON.stringify(original, null, 4)}\n`;
      await makeAntigravityTemplateFixture(packageRoot);
      await mkdir(settingsDir, { recursive: true });
      await writeFile(settingsPath, originalContent, "utf8");
      vi.spyOn(process.stdout, "write").mockImplementation(() => true);

      await mergeProviderGlobalSettings("antigravity", {
        packageRoot,
        homeDir,
        dryRun: false,
      });

      const merged = JSON.parse(await readFile(settingsPath, "utf8"));
      expect(merged).toEqual({
        colorScheme: "dark",
        permissions: {
          allow: ["command(custom)", "command(git status)", "command(npm run)"],
          deny: ["command(git push)", "write_file(.specdojo/)"],
          customList: ["keep-me"],
        },
      });
      const backups = (await readdir(settingsDir)).filter((name) =>
        name.startsWith("settings.json.backup-"),
      );
      expect(backups).toHaveLength(1);
      expect(await readFile(path.join(settingsDir, backups[0]!), "utf8")).toBe(originalContent);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("shows additions on dry-run without writing settings or a backup", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));
    try {
      const packageRoot = path.join(dir, "pkg");
      const homeDir = path.join(dir, "home");
      const settingsDir = path.join(homeDir, ".gemini", "antigravity-cli");
      const settingsPath = path.join(settingsDir, "settings.json");
      const original = '{"colorScheme":"terminal"}\n';
      const output: string[] = [];
      await makeAntigravityTemplateFixture(packageRoot);
      await mkdir(settingsDir, { recursive: true });
      await writeFile(settingsPath, original, "utf8");
      vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
        output.push(String(chunk));
        return true;
      });

      await mergeProviderGlobalSettings("antigravity", {
        packageRoot,
        homeDir,
        dryRun: true,
      });

      expect(await readFile(settingsPath, "utf8")).toBe(original);
      expect((await readdir(settingsDir)).filter((name) => name.includes(".backup-"))).toEqual([]);
      expect(output.join("")).toContain(
        "[dry-run] global settings diff: ~/.gemini/antigravity-cli/settings.json",
      );
      expect(output.join("")).toContain('+ "command(git status)"');
      expect(output.join("")).toContain('+ "write_file(.specdojo/)"');
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("is idempotent and does not create another backup when nothing is added", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));
    try {
      const packageRoot = path.join(dir, "pkg");
      const homeDir = path.join(dir, "home");
      const settingsDir = path.join(homeDir, ".gemini", "antigravity-cli");
      await makeAntigravityTemplateFixture(packageRoot);
      vi.spyOn(process.stdout, "write").mockImplementation(() => true);

      await mergeProviderGlobalSettings("antigravity", {
        packageRoot,
        homeDir,
        dryRun: false,
      });
      await mergeProviderGlobalSettings("antigravity", {
        packageRoot,
        homeDir,
        dryRun: false,
      });

      expect((await readdir(settingsDir)).filter((name) => name.includes(".backup-"))).toEqual([]);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("rejects an invalid existing permission list without modifying it", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));
    try {
      const packageRoot = path.join(dir, "pkg");
      const homeDir = path.join(dir, "home");
      const settingsDir = path.join(homeDir, ".gemini", "antigravity-cli");
      const settingsPath = path.join(settingsDir, "settings.json");
      const original = '{"permissions":{"allow":"all"}}\n';
      await makeAntigravityTemplateFixture(packageRoot);
      await mkdir(settingsDir, { recursive: true });
      await writeFile(settingsPath, original, "utf8");

      await expect(
        mergeProviderGlobalSettings("antigravity", {
          packageRoot,
          homeDir,
          dryRun: false,
        }),
      ).rejects.toThrow(/permissions\.allow must be an array of strings/);
      expect(await readFile(settingsPath, "utf8")).toBe(original);
      expect((await readdir(settingsDir)).filter((name) => name.includes(".backup-"))).toEqual([]);
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
  it("does not touch user-level settings unless global is explicitly enabled", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));
    try {
      const packageRoot = path.join(dir, "pkg");
      const repoRoot = path.join(dir, "repo");
      const homeDir = path.join(dir, "home");
      await makeAntigravityTemplateFixture(packageRoot);
      await mkdir(repoRoot, { recursive: true });
      vi.spyOn(process.stdout, "write").mockImplementation(() => true);

      await runProviderScaffold("antigravity", {
        packageRoot,
        repoRoot,
        homeDir,
        force: false,
        dryRun: false,
      });

      expect(existsSync(path.join(homeDir, ".gemini", "antigravity-cli", "settings.json"))).toBe(
        false,
      );
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("merges provider permissions into the injected temporary home with global enabled", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));
    try {
      const packageRoot = path.join(dir, "pkg");
      const repoRoot = path.join(dir, "repo");
      const homeDir = path.join(dir, "home");
      await makeAntigravityTemplateFixture(packageRoot);
      await mkdir(repoRoot, { recursive: true });
      vi.spyOn(process.stdout, "write").mockImplementation(() => true);

      await runProviderScaffold("antigravity", {
        packageRoot,
        repoRoot,
        homeDir,
        force: false,
        dryRun: false,
        global: true,
      });

      const settings = JSON.parse(
        await readFile(path.join(homeDir, ".gemini", "antigravity-cli", "settings.json"), "utf8"),
      );
      expect(settings).toEqual(ANTIGRAVITY_GLOBAL_SETTINGS);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

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
          homeDir: path.join(dir, "home"),
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
      provider: "antigravity",
      scripts: {
        "orch:flash":
          'specdojo orchestrator launch --provider antigravity -- --add-dir "$(pwd)" --model gemini-3.8-flash-high -i "$(cat .specdojo/antigravity/orchestrator.md)"',
      },
      legacy: "orch:agy",
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
});
