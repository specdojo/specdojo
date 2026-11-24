import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Command } from "commander";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { registerRegisterCommands } from "../../../src/register/register.js";

const PROJECT = "sample";

describe("register branch-push arguments and preconditions", () => {
  const originalCwd = process.cwd();
  let dir: string;
  let stderr: string[];

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "specdojo-branch-push-"));
    mkdirSync(join(dir, ".specdojo"));
    writeFileSync(
      join(dir, ".specdojo", "specdojo.config.json"),
      JSON.stringify({
        version: 1,
        current_project: PROJECT,
        projects: {
          [PROJECT]: {
            base_path: "docs/sample",
            project_register_path: "controls/project-register",
            execution_path: "execution",
            register_sync: { enabled: false },
          },
        },
      }),
      "utf8",
    );
    process.chdir(dir);
    stderr = [];
    vi.spyOn(process.stdout, "write").mockReturnValue(true);
    vi.spyOn(process.stderr, "write").mockImplementation((chunk) => {
      stderr.push(String(chunk));
      return true;
    });
  });

  afterEach(() => {
    process.chdir(originalCwd);
    try {
      vi.restoreAllMocks();
      process.exitCode = undefined;
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  function parse(...args: string[]): Promise<Command> {
    const program = new Command().exitOverride();
    program.configureOutput({ writeErr: (message) => stderr.push(message) });
    registerRegisterCommands(program);
    program.commands.forEach((command) => {
      command.exitOverride();
      command.commands.forEach((sub) => sub.exitOverride());
    });
    return program.parseAsync(["register", "branch-push", ...args], { from: "user" });
  }

  it("rejects an option that would name another branch", async () => {
    await expect(parse("--project", PROJECT, "--branch", "main")).rejects.toThrow(
      /unknown option '--branch'/,
    );
  });

  it("rejects a positional ref argument", async () => {
    await expect(parse("--project", PROJECT, "refs/heads/main")).rejects.toThrow(
      /too many arguments/,
    );
  });

  it("stops with exit code 1 and the reason when register_sync is not enabled", async () => {
    await parse("--project", PROJECT);

    expect(process.exitCode).toBe(1);
    expect(stderr.join("")).toContain("register_sync is not enabled for sample; nothing to push.");
  });
});
