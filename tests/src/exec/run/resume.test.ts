import { Command } from "commander";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerExecCommands } from "../../../../src/exec/exec.js";

afterEach(() => {
  process.exitCode = undefined;
  vi.restoreAllMocks();
});

describe("exec resume --resume-from", () => {
  it.each([
    {
      args: ["--task", "T-TEST-doc-010", "--resume-from", "reporter"],
      reason: '--resume-from must be "executor"',
    },
    { args: ["--resume-from", "executor"], reason: "--resume-from requires --task" },
    {
      args: ["--task", "T-TEST-doc-010", "--due", "--resume-from", "executor"],
      reason: "cannot be combined with --due",
    },
  ])(
    "rejects $args before resolving project paths or acquiring a lock",
    async ({ args, reason }) => {
      const stdout = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const program = new Command();
      program.exitOverride();
      registerExecCommands(program);
      await program.parseAsync(["node", "specdojo", "exec", "resume", ...args]);
      expect(process.exitCode).toBe(1);
      expect(stdout.mock.calls.flat().join("")).toContain(reason);
    },
  );
});
