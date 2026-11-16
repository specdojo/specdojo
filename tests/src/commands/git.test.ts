import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { Command } from "commander";
import {
  gitExecutionPath,
  inspectGitArguments,
  registerGitCommand,
  unlockedGitWarning,
} from "../../../src/commands/git.js";
import { registerLifecyclePoolPath } from "../../../src/register/lifecycle-lock.js";
import {
  acquirePoolSlot,
  CrossProcessMutex,
  GIT_LOCK_TOKENS_ENV,
  readLockOwner,
  releaseLock,
  tryAcquireLock,
} from "../../../src/shared/cross-process-lock.js";
import { gitEnvironment } from "../../../src/shared/git-environment.js";

describe("Git argument classification", () => {
  it.each(["status", "log", "diff", "show", "ls-files", "rev-parse"])(
    "%s bypasses the lock",
    (command) => {
      expect(inspectGitArguments([command, "--help"]).needsLock).toBe(false);
    },
  );

  it.each([
    "commit",
    "merge",
    "add",
    "rm",
    "restore",
    "checkout",
    "switch",
    "reset",
    "rebase",
    "fetch",
    "branch",
    "tag",
    "config",
    "my-alias",
  ])("%s joins the lifecycle queue", (command) => {
    expect(inspectGitArguments([command]).needsLock).toBe(true);
  });

  it("parses repository options before classifying the subcommand", () => {
    const globals = ["-C", "first", "-Csubdir", "--git-dir=.git", "--work-tree", "."];
    expect(inspectGitArguments([...globals, "status"])).toEqual({ globals, needsLock: false });
    expect(inspectGitArguments([...globals, "add", "--", "status"])).toEqual({
      globals,
      needsLock: true,
    });
    expect(inspectGitArguments(["-c", "alias.save=commit", "save"]).needsLock).toBe(true);
  });

  it("locks file output and custom configuration even for a read command", () => {
    expect(inspectGitArguments(["diff", "--output=patch"]).needsLock).toBe(true);
    expect(inspectGitArguments(["log", "--output", "log.txt"]).needsLock).toBe(true);
    expect(inspectGitArguments(["-ccore.pager=custom", "log"]).needsLock).toBe(true);
    expect(inspectGitArguments(["--config-env=core.pager=PAGER", "log"]).needsLock).toBe(true);
  });

  it("rejects unrecognized routing options and missing values before executing Git", () => {
    expect(() => inspectGitArguments(["--future-option", "commit"])).toThrow("Unsupported");
    expect(() => inspectGitArguments(["-C"])).toThrow("Missing value");
  });

  it("keeps Git flags after -- out of Commander option parsing", async () => {
    const program = new Command();
    registerGitCommand(program);
    const command = program.commands[0];
    let received: string[] = [];
    command.action((args: string[]) => {
      received = args;
    });
    await program.parseAsync(
      ["git", "--project", "p", "--", "commit", "-m", "two words", "--", "--help"],
      { from: "user" },
    );
    expect(received).toEqual(["commit", "-m", "two words", "--", "--help"]);
    expect(command.opts().project).toBe("p");
  });
});

describe("Git lifecycle context", () => {
  it("resolves project execution_path including base_path without loading .env", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-git-config-"));
    try {
      mkdirSync(join(root, ".specdojo"));
      writeFileSync(
        join(root, ".specdojo/specdojo.config.json"),
        JSON.stringify({
          version: 1,
          current_project: "p",
          projects: { p: { base_path: "docs/p" }, q: { execution_path: "runs" } },
        }),
      );
      expect(gitExecutionPath(root, "p")).toBe(join(root, "docs/p/execution"));
      expect(gitExecutionPath(root, "q")).toBe(join(root, "runs"));
      expect(() => gitExecutionPath(root, "missing")).toThrow("Unknown project");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("warns during primary and join runs, and trusts only a live matching lifecycle token", async () => {
    const execution = mkdtempSync(join(tmpdir(), "specdojo-git-warning-"));
    const locks = join(execution, "exec", ".locks");
    mkdirSync(locks, { recursive: true });
    const primary = tryAcquireLock(join(locks, "exec-run.lock"), { actor: "runner" })!;
    try {
      expect(unlockedGitWarning(execution, {})).toContain("specdojo git -- commit");
      const mutex = new CrossProcessMutex(registerLifecyclePoolPath(execution), {
        actor: "runner",
      });
      await mutex.runExclusive(async () => {
        const owner = readLockOwner(join(registerLifecyclePoolPath(execution), "slot-1"))!;
        const env = gitEnvironment();
        expect(env[GIT_LOCK_TOKENS_ENV]).toContain(owner.token);
        expect(unlockedGitWarning(execution, env)).toBeUndefined();
        expect(unlockedGitWarning(execution, { [GIT_LOCK_TOKENS_ENV]: "forged" })).toContain(
          "warning",
        );
        await Promise.resolve();
        expect(gitEnvironment()[GIT_LOCK_TOKENS_ENV]).toBe(env[GIT_LOCK_TOKENS_ENV]);
      });
      expect(gitEnvironment()[GIT_LOCK_TOKENS_ENV]).toBe(process.env[GIT_LOCK_TOKENS_ENV]);
      releaseLock(primary);
      const joiner = await acquirePoolSlot(join(locks, "exec-run-join"), 1, { actor: "joiner" });
      try {
        expect(unlockedGitWarning(execution, {})).toContain("warning");
      } finally {
        releaseLock(joiner);
      }
      expect(unlockedGitWarning(execution, {})).toBeUndefined();
    } finally {
      releaseLock(primary);
      rmSync(execution, { recursive: true, force: true });
    }
  });
});
