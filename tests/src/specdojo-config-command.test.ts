import { Command } from "commander";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveCatalogPath } from "../../src/catalog.js";
import {
  registerConfigCommands,
  SPECDOJO_CONFIG_REFERENCE_URL,
} from "../../src/specdojo-config.js";
import { DEFAULT_GITIGNORE_PATTERNS, GITIGNORE_HEADER } from "../../src/specdojo-gitignore.js";

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
});

describe("config onboarding commands", () => {
  it("creates a register-ready config in an empty directory and prints the next steps", async () => {
    const repo = mkdtempSync(join(tmpdir(), "specdojo-config-init-"));
    const output: string[] = [];
    vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
      output.push(String(chunk));
      return true;
    });

    try {
      mkdirSync(join(repo, ".git"));
      process.chdir(repo);
      await runConfigCommand(["init"]);

      const configPath = join(repo, ".specdojo", "specdojo.config.json");
      expect(JSON.parse(readFileSync(configPath, "utf8"))).toEqual({
        version: 1,
        current_project: "prj-0001",
        projects: {
          "prj-0001": {
            base_path: "docs/ja/projects/prj-0001",
            project_register_path: "controls/project-register",
            project_context: ["prj-overview"],
            run: {
              worktree_base: "../app1-worktrees",
            },
          },
        },
      });
      expect(output.join("")).toContain("app1-specdojo/");
      expect(output.join("")).toContain("../app1-worktrees");
      expect(output.join("")).toContain("npx specdojo config scaffold --provider <name>");
      expect(output.join("")).toContain("npx specdojo register scaffold --project prj-0001");
      expect(output.join("")).toContain(SPECDOJO_CONFIG_REFERENCE_URL);
      expect(output.join("")).toContain('declare it under "repos"');
      expect(output.join("")).toContain("app1:<path>");

      expect(() => resolveCatalogPath({ project: "prj-0001" })).toThrow(
        SPECDOJO_CONFIG_REFERENCE_URL,
      );
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("scaffolds provider files from the package through the config command", async () => {
    const repo = mkdtempSync(join(tmpdir(), "specdojo-config-scaffold-"));
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);

    try {
      mkdirSync(join(repo, ".git"));
      process.chdir(repo);
      await runConfigCommand(["scaffold", "--provider", "codex"]);

      expect(existsSync(join(repo, ".codex", "agents", "codex-executor.toml"))).toBe(true);
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });
});

describe("config init .gitignore", () => {
  function captureStdout(): string[] {
    const output: string[] = [];
    vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
      output.push(String(chunk));
      return true;
    });
    return output;
  }

  it("creates a .gitignore excluding specdojo outputs with untrack guidance", async () => {
    const repo = mkdtempSync(join(tmpdir(), "specdojo-config-gitignore-"));
    const output = captureStdout();

    try {
      mkdirSync(join(repo, ".git"));
      process.chdir(repo);
      await runConfigCommand(["init"]);

      expect(readFileSync(join(repo, ".gitignore"), "utf8")).toBe(
        `${GITIGNORE_HEADER}\n${DEFAULT_GITIGNORE_PATTERNS.join("\n")}\n`,
      );
      expect(output.join("")).toContain("Added: docs/**/generated/*");
      expect(output.join("")).toContain("git rm -r --cached");
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("appends only missing lines to an existing .gitignore and is idempotent on rerun", async () => {
    const repo = mkdtempSync(join(tmpdir(), "specdojo-config-gitignore-"));
    const output = captureStdout();

    try {
      mkdirSync(join(repo, ".git"));
      writeFileSync(join(repo, ".gitignore"), "node_modules/\n.specdojo/doc-index.json\n", "utf8");
      process.chdir(repo);
      await runConfigCommand(["init"]);
      const afterFirst = readFileSync(join(repo, ".gitignore"), "utf8");
      output.length = 0;
      await runConfigCommand(["init"]);

      expect(afterFirst.startsWith("node_modules/\n.specdojo/doc-index.json\n\n")).toBe(true);
      expect(afterFirst.match(/\.specdojo\/doc-index\.json/g)).toHaveLength(1);
      expect(readFileSync(join(repo, ".gitignore"), "utf8")).toBe(afterFirst);
      expect(output.join("")).toContain("Already exists:");
      expect(output.join("")).toContain("Skipped (already present): docs/**/generated/*");
      expect(output.join("")).not.toContain("git rm -r --cached");
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("shows the planned lines without writing anything with --dry-run", async () => {
    const repo = mkdtempSync(join(tmpdir(), "specdojo-config-gitignore-"));
    const output = captureStdout();

    try {
      mkdirSync(join(repo, ".git"));
      process.chdir(repo);
      await runConfigCommand(["init", "--dry-run"]);

      expect(existsSync(join(repo, ".gitignore"))).toBe(false);
      expect(existsSync(join(repo, ".specdojo", "specdojo.config.json"))).toBe(false);
      expect(output.join("")).toContain("Would add: docs/**/generated/*");
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });
});
