import { Command } from "commander";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerConfigCommands } from "../../../src/shared/specdojo-config.js";
import {
  buildWorkspaceData,
  renderWorkspaceContent,
  runWorkspaceScaffold,
} from "../../../src/shared/workspace-scaffold.js";

const originalCwd = process.cwd();

async function runConfigCommand(args: string[]): Promise<void> {
  const program = new Command();
  program.exitOverride();
  registerConfigCommands(program);
  await program.parseAsync(["config", ...args], { from: "user" });
}

afterEach(() => {
  process.chdir(originalCwd);
  vi.restoreAllMocks();
  process.exitCode = undefined;
});

describe("workspace-scaffold content generation", () => {
  it("builds workspace data with project repo as . and repos in declared order", () => {
    const data = buildWorkspaceData("my-project-repo", [
      { name: "backend", path: "../backend" },
      { name: "frontend", path: "../frontend" },
    ]);

    expect(data).toEqual({
      folders: [
        { name: "my-project-repo", path: "." },
        { name: "backend", path: "../backend" },
        { name: "frontend", path: "../frontend" },
      ],
    });
  });

  it("produces identical folders to the hand-crafted prj-0002.code-workspace", () => {
    const content = renderWorkspaceContent("specdojo-prj-0002", [
      { name: "specdojo-lp", path: "../specdojo-lp" },
      { name: "specdojo-assets", path: "../specdojo-assets" },
    ]);

    const parsed = JSON.parse(content);
    expect(parsed.folders).toEqual([
      { name: "specdojo-prj-0002", path: "." },
      { name: "specdojo-lp", path: "../specdojo-lp" },
      { name: "specdojo-assets", path: "../specdojo-assets" },
    ]);
  });
});

describe("runWorkspaceScaffold", () => {
  it("throws when .specdojo/specdojo.config.json is missing", async () => {
    const tempDir = mkdtempSync(join(tmpdir(), "ws-scaffold-test-"));
    try {
      await expect(runWorkspaceScaffold({ repoRoot: tempDir })).rejects.toThrow("No config found");
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("throws when project has no repos declared", async () => {
    const tempDir = mkdtempSync(join(tmpdir(), "ws-scaffold-test-"));
    try {
      const configDir = join(tempDir, ".specdojo");
      mkdirSync(configDir, { recursive: true });
      writeFileSync(
        join(configDir, "specdojo.config.json"),
        JSON.stringify({
          version: 1,
          current_project: "prj-0001",
          projects: {
            "prj-0001": {
              base_path: "docs/ja/projects/prj-0001",
            },
          },
        }),
      );

      await expect(runWorkspaceScaffold({ repoRoot: tempDir })).rejects.toThrow(
        "Project 'prj-0001' has no 'repos' configured",
      );
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("throws when requested project does not exist in config", async () => {
    const tempDir = mkdtempSync(join(tmpdir(), "ws-scaffold-test-"));
    try {
      const configDir = join(tempDir, ".specdojo");
      mkdirSync(configDir, { recursive: true });
      writeFileSync(
        join(configDir, "specdojo.config.json"),
        JSON.stringify({
          version: 1,
          current_project: "prj-0001",
          projects: {
            "prj-0001": { base_path: "docs/ja/projects/prj-0001" },
          },
        }),
      );

      await expect(
        runWorkspaceScaffold({ repoRoot: tempDir, projectId: "prj-nonexistent" }),
      ).rejects.toThrow("Unknown project: prj-nonexistent");
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("scaffolds <project-id>.code-workspace successfully", async () => {
    const tempDir = mkdtempSync(join(tmpdir(), "ws-scaffold-test-"));
    const output: string[] = [];
    vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
      output.push(String(chunk));
      return true;
    });

    try {
      const configDir = join(tempDir, ".specdojo");
      mkdirSync(configDir, { recursive: true });
      writeFileSync(
        join(configDir, "specdojo.config.json"),
        JSON.stringify({
          version: 1,
          current_project: "prj-0002",
          projects: {
            "prj-0002": {
              base_path: "docs/ja/projects/prj-0002",
              repos: [
                { name: "app1", path: "../app1" },
                { name: "app2", path: "../app2" },
              ],
            },
          },
        }),
      );

      const result = await runWorkspaceScaffold({ repoRoot: tempDir });
      expect(result.status).toBe("written");
      expect(result.relativePath).toBe("prj-0002.code-workspace");

      const wsPath = join(tempDir, "prj-0002.code-workspace");
      expect(existsSync(wsPath)).toBe(true);

      const parsed = JSON.parse(readFileSync(wsPath, "utf8"));
      expect(parsed.folders).toEqual([
        { name: basename(tempDir), path: "." },
        { name: "app1", path: "../app1" },
        { name: "app2", path: "../app2" },
      ]);
      expect(output.join("")).toContain("Written: prj-0002.code-workspace\n");
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("does not overwrite existing workspace file unless force is set", async () => {
    const tempDir = mkdtempSync(join(tmpdir(), "ws-scaffold-test-"));
    const output: string[] = [];
    vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
      output.push(String(chunk));
      return true;
    });

    try {
      const configDir = join(tempDir, ".specdojo");
      mkdirSync(configDir, { recursive: true });
      writeFileSync(
        join(configDir, "specdojo.config.json"),
        JSON.stringify({
          version: 1,
          current_project: "prj-0002",
          projects: {
            "prj-0002": {
              base_path: "docs/ja/projects/prj-0002",
              repos: [{ name: "app1", path: "../app1" }],
            },
          },
        }),
      );

      const wsPath = join(tempDir, "prj-0002.code-workspace");
      writeFileSync(wsPath, '{"existing":true}\n');

      // First try without force: skipped
      const skipResult = await runWorkspaceScaffold({ repoRoot: tempDir });
      expect(skipResult.status).toBe("skipped");
      expect(readFileSync(wsPath, "utf8")).toBe('{"existing":true}\n');
      expect(output.join("")).toContain("Skipped (already exists): prj-0002.code-workspace\n");

      // Second try with force: overwritten
      output.length = 0;
      const forceResult = await runWorkspaceScaffold({ repoRoot: tempDir, force: true });
      expect(forceResult.status).toBe("written");
      const parsed = JSON.parse(readFileSync(wsPath, "utf8"));
      expect(parsed.folders).toBeDefined();
      expect(output.join("")).toContain("Written: prj-0002.code-workspace\n");
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("respects dry-run flag and does not write files", async () => {
    const tempDir = mkdtempSync(join(tmpdir(), "ws-scaffold-test-"));
    const output: string[] = [];
    vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
      output.push(String(chunk));
      return true;
    });

    try {
      const configDir = join(tempDir, ".specdojo");
      mkdirSync(configDir, { recursive: true });
      writeFileSync(
        join(configDir, "specdojo.config.json"),
        JSON.stringify({
          version: 1,
          current_project: "prj-0002",
          projects: {
            "prj-0002": {
              base_path: "docs/ja/projects/prj-0002",
              repos: [{ name: "app1", path: "../app1" }],
            },
          },
        }),
      );

      const wsPath = join(tempDir, "prj-0002.code-workspace");
      const result = await runWorkspaceScaffold({ repoRoot: tempDir, dryRun: true });
      expect(result.status).toBe("written");
      expect(existsSync(wsPath)).toBe(false);
      expect(output.join("")).toContain("[dry-run] would write: prj-0002.code-workspace\n");

      // If already exists, dry-run reports skipped
      writeFileSync(wsPath, "existing\n");
      output.length = 0;
      const skipResult = await runWorkspaceScaffold({ repoRoot: tempDir, dryRun: true });
      expect(skipResult.status).toBe("skipped");
      expect(output.join("")).toContain(
        "[dry-run] skipped: prj-0002.code-workspace already exists",
      );
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});

describe("config scaffold CLI command", () => {
  it("fails if no scaffold option is specified", async () => {
    const tempDir = mkdtempSync(join(tmpdir(), "ws-scaffold-cli-"));
    const stderr: string[] = [];
    vi.spyOn(process.stderr, "write").mockImplementation((chunk) => {
      stderr.push(String(chunk));
      return true;
    });

    try {
      process.chdir(tempDir);
      await runConfigCommand(["scaffold"]);
      expect(process.exitCode).toBe(1);
      expect(stderr.join("")).toContain(
        "Specify --provider <name>, --workspace, --lefthook, or --slidev to scaffold.",
      );
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("scaffolds workspace via config scaffold --workspace", async () => {
    const tempDir = mkdtempSync(join(tmpdir(), "ws-scaffold-cli-"));
    const stdout: string[] = [];
    vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
      stdout.push(String(chunk));
      return true;
    });

    try {
      const configDir = join(tempDir, ".specdojo");
      mkdirSync(configDir, { recursive: true });
      writeFileSync(
        join(configDir, "specdojo.config.json"),
        JSON.stringify({
          version: 1,
          current_project: "prj-0002",
          projects: {
            "prj-0002": {
              base_path: "docs/ja/projects/prj-0002",
              repos: [{ name: "my-app", path: "../my-app" }],
            },
          },
        }),
      );

      process.chdir(tempDir);
      await runConfigCommand(["scaffold", "--workspace"]);

      expect(existsSync(join(tempDir, "prj-0002.code-workspace"))).toBe(true);
      expect(stdout.join("")).toContain("Written: prj-0002.code-workspace\n");
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
