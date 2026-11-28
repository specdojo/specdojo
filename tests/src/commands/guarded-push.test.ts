import * as childProcess from "node:child_process";
import { Command } from "commander";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerGuardedPushCommand, runGuardedPush } from "../../../src/commands/guarded-push.js";
import { AGENT_ROLE_ENV } from "../../../src/shared/agent-role.js";

vi.mock("node:child_process", async (importOriginal) => ({
  ...(await importOriginal<typeof childProcess>()),
}));

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("guarded-push input boundary", () => {
  it.each(["executor", "reporter", "", "unknown"])(
    "refuses the agent role %j before any Git process or config access",
    async (role) => {
      vi.stubEnv(AGENT_ROLE_ENV, role);
      const sync = vi.spyOn(childProcess, "spawnSync");
      const spawn = vi.spyOn(childProcess, "spawn");
      await expect(runGuardedPush({ project: "p", cwd: "missing" })).rejects.toThrow(
        "forbidden during executor/reporter",
      );
      expect(sync).not.toHaveBeenCalled();
      expect(spawn).not.toHaveBeenCalled();
    },
  );

  it.each([
    "main",
    "project/q/develop",
    "project/p/register",
    "feature/q/topic",
    "feature/p/",
    "refs/heads/feature/p/topic",
    "refs/tags/v1",
    "+feature/p/topic",
    "feature/p/topic:main",
    "feature/p/*",
  ])("refuses branch %s before Git starts", async (branch) => {
    vi.stubEnv(AGENT_ROLE_ENV, undefined);
    const sync = vi.spyOn(childProcess, "spawnSync");
    await expect(runGuardedPush({ project: "p", branch })).rejects.toThrow();
    expect(sync).not.toHaveBeenCalled();
  });

  it.each([
    ["--force"],
    ["--force-with-lease"],
    ["--tags"],
    ["--all"],
    ["--mirror"],
    ["--delete"],
    ["--receive-pack", "program"],
    ["--", "+HEAD:refs/heads/main"],
    ["origin", "HEAD"],
  ])("does not accept arbitrary Git arguments %j", async (...args) => {
    const program = new Command();
    program.exitOverride().configureOutput({ writeErr: () => undefined });
    registerGuardedPushCommand(program);
    const sync = vi.spyOn(childProcess, "spawnSync");
    await expect(
      program.parseAsync(["guarded-push", "--project", "p", ...args], { from: "user" }),
    ).rejects.toThrow();
    expect(sync).not.toHaveBeenCalled();
  });
});
