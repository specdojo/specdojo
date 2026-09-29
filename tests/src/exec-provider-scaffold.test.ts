import { afterEach, describe, expect, it, vi } from "vitest";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  applyProviderScaffoldPlan,
  buildProviderScaffoldPlan,
  listProviderTemplates,
  mergeProviderGlobalSettings,
  runProviderScaffold,
  specdojoPackageRootDir,
} from "../../src/exec-provider-scaffold.js";

async function makeClaudeTemplateFixture(packageRoot: string): Promise<void> {
  const templateDir = path.join(packageRoot, "templates", "claude");
  await mkdir(path.join(templateDir, "agents"), { recursive: true });
  await writeFile(path.join(templateDir, "agents", "claude-edit-agent.md"), "# edit\n", "utf8");
  await writeFile(path.join(templateDir, "agents", "claude-review-agent.md"), "# review\n", "utf8");
  await writeFile(path.join(templateDir, "settings.edit.json"), '{"mode":"edit"}\n', "utf8");
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
    // 無効なルールを残すと CLI が警告を出すため、deny は Edit(**) と git 操作だけにする。
    expect(settings.permissions?.deny).toEqual([
      "Edit(**)",
      "Bash(git add *)",
      "Bash(git commit *)",
    ]);
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
        "read_file(.env)",
        "write_file(.specdojo/exec-defaults.yaml)",
        "write_file(package.json)",
      ]),
    );
    expect(execDefaults).not.toContain("--dangerously-skip-permissions");
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
      expect(pkg.scripts["orch:opus"]).toBe("claude --agent specdojo-orchestrator --model opus");
      expect(pkg.scripts["orch:sonnet"]).toBe(
        "claude --agent specdojo-orchestrator --model sonnet",
      );
      expect(pkg.scripts.test).toBe("echo test");
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
          "claude --agent specdojo-orchestrator --model sonnet",
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
        "claude --agent specdojo-orchestrator --model opus",
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
