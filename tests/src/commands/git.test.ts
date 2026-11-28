import * as childProcess from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { Command } from "commander";
import {
  commitPathspecs,
  gitExecutionPath,
  inspectGitArguments,
  registerGitCommand,
  runSerializedGit,
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

// Expose configurable exports so spies can observe the native ESM process boundary.
vi.mock("node:child_process", async (importOriginal) => ({
  ...(await importOriginal<typeof import("node:child_process")>()),
}));

describe("commitPathspecs", () => {
  it("returns the pathspec after -- of a commit, skipping global options", () => {
    expect(
      commitPathspecs(["-C", "repo", "commit", "-m", "subject", "--", "a.md", "b.yaml"]),
    ).toEqual(["a.md", "b.yaml"]);
  });

  it("returns nothing for a commit without -- or for other commands", () => {
    expect(commitPathspecs(["commit", "-m", "subject"])).toEqual([]);
    expect(commitPathspecs(["add", "--", "a.md"])).toEqual([]);
  });
});

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
    "blame",
    "ls-remote",
    "show-ref",
    "for-each-ref",
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
    expect(inspectGitArguments(["-c", "alias.save=commit", "commit"]).needsLock).toBe(true);
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
    expect(() => inspectGitArguments(["--exec-path=custom", "commit"])).toThrow("Unsupported");
  });

  it("does not treat option values, messages or pathspecs as commands", () => {
    expect(inspectGitArguments(["-C", "push", "status"]).needsLock).toBe(false);
    expect(inspectGitArguments(["-c", "alias.publish=push", "status"]).needsLock).toBe(true);
    expect(inspectGitArguments(["commit", "-m", "push", "--", "send-pack"]).needsLock).toBe(true);
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

describe("Git remote-write guard", () => {
  const rejectedArguments = [
    ["push", "origin", "HEAD"],
    ["push", "--dry-run"],
    ["-C", "repo", "push"],
    ["-Crepo", "push"],
    ["-c", "push.default=current", "push"],
    ["-cpush.default=current", "push"],
    ["--config-env", "push.default=DEFAULT", "push"],
    ["--config-env=push.default=DEFAULT", "push"],
    ["--git-dir=.git", "--work-tree", ".", "--no-pager", "push"],
    ["--namespace=example", "-C", "repo", "-c", "alias.push=status", "push"],
    ["send-pack", "origin", "HEAD"],
    ["-C", "repo", "send-pack", "origin", "HEAD"],
    ["http-push", "https://example.invalid/repo", "HEAD"],
    ["receive-pack", "repo"],
    ["publish"],
    ["-c", "alias.publish=push", "publish"],
    ["-c", "alias.save=commit", "save"],
    ["-calias.publish=!git push", "publish"],
    ["-c", "alias.first=second", "-c", "alias.second=push", "first"],
    ["--config-env=alias.publish=ALIAS", "publish"],
    ["remote-ext", "origin", "git push"],
    ["remote-https", "origin", "https://example.invalid/repo"],
    ["for-each-repo", "--config=repo.paths", "push"],
    ["bisect", "run", "git", "push"],
    ["submodule", "foreach", "git push"],
    ["my-alias"],
  ];

  it.each(rejectedArguments.map((args) => [args.join(" "), args] as const))(
    "rejects %s before starting any Git process",
    async (_label, args) => {
      const unexpectedGit = () => {
        throw new Error("Git must not start");
      };
      const spawn = vi.spyOn(childProcess, "spawn").mockImplementation(unexpectedGit);
      const spawnSync = vi.spyOn(childProcess, "spawnSync").mockImplementation(unexpectedGit);
      try {
        await expect(runSerializedGit(args, { project: "p" })).rejects.toThrow(
          "Push must be performed by a human or through the guarded entry point planned in PJR-D4RJ",
        );
        expect(spawn).not.toHaveBeenCalled();
        expect(spawnSync).not.toHaveBeenCalled();
      } finally {
        vi.restoreAllMocks();
      }
    },
  );
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
