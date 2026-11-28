import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Command } from "commander";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { checkLines, INITIAL_CHECK_HINT } from "../../../src/register/branch-push.js";
import { registerRegisterCommands } from "../../../src/register/register.js";

const PROJECT = "sample";

describe("checkLines", () => {
  const target = {
    registerPath: "docs/sample/controls/project-register",
    eventsPath: "docs/sample/execution/exec/events",
    branch: "project/sample/register",
    scope: ["docs/sample/controls/project-register", "docs/sample/execution/exec/events"],
  };

  it("adds the hint of the real run when the check would stop", () => {
    const lines = checkLines(
      { scopeViolations: ["0123456789ab: product.txt"], shapeViolations: [] },
      target,
      INITIAL_CHECK_HINT,
    );

    expect(lines[0]).toBe("Checks: failed; the push would stop.");
    expect(lines[1]).toContain("0123456789ab: product.txt");
    expect(lines.at(-1)).toBe(INITIAL_CHECK_HINT);
  });

  it("shows only the passed line without the hint when the check passes", () => {
    const lines = checkLines(
      { scopeViolations: [], shapeViolations: [] },
      target,
      INITIAL_CHECK_HINT,
    );

    expect(lines).toEqual(["Checks: passed."]);
  });
});

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

  it("rejects a --sync value that is not a sync branch kind", async () => {
    await parse("--project", PROJECT, "--sync", "main");

    expect(process.exitCode).toBe(1);
    expect(stderr.join("")).toContain("--sync must be one of register, exec-events: main");
  });

  it("stops with exit code 1 and the reason when register_sync is not enabled", async () => {
    await parse("--project", PROJECT);

    expect(process.exitCode).toBe(1);
    expect(stderr.join("")).toContain("register_sync is not enabled for sample; nothing to push.");
  });
});
