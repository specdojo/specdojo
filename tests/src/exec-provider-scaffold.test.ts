import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  applyProviderScaffoldPlan,
  buildProviderScaffoldPlan,
  listProviderTemplates,
  specdojoPackageRootDir,
} from "../../src/exec-provider-scaffold.js";

async function makeClaudeTemplateFixture(packageRoot: string): Promise<void> {
  const templateDir = path.join(packageRoot, "templates", "claude");
  await mkdir(path.join(templateDir, "agents"), { recursive: true });
  await writeFile(path.join(templateDir, "agents", "claude-edit-agent.md"), "# edit\n", "utf8");
  await writeFile(path.join(templateDir, "agents", "claude-review-agent.md"), "# review\n", "utf8");
  await writeFile(path.join(templateDir, "settings.edit.json"), '{"mode":"edit"}\n', "utf8");
  await writeFile(path.join(templateDir, "settings.review.json"), '{"mode":"review"}\n', "utf8");
  await writeFile(path.join(templateDir, "README.md"), "# readme\n", "utf8");
}

describe("specdojoPackageRootDir", () => {
  it("resolves the directory that contains package.json", () => {
    const root = specdojoPackageRootDir();

    expect(existsSync(path.join(root, "package.json"))).toBe(true);
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
        ".specdojo/claude/settings.review.json",
      ]);
      expect(plan.entries[0]?.destinationPath).toBe(
        path.join(repoRoot, ".claude", "agents", "claude-edit-agent.md"),
      );
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
        path.join(repoRoot, ".specdojo", "claude", "settings.review.json"),
        "utf8",
      );
      expect(copied).toBe('{"mode":"review"}\n');
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
