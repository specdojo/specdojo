import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Command } from "commander";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerExecCommands } from "../../src/exec.js";
import {
  acquireExecRunLock,
  releaseExecRunLock,
  ROUTINE_BUSY_SKIP_EXIT_CODE,
  ROUTINE_EXEC_ENV,
} from "../../src/exec-run-lock.js";

const originalCwd = process.cwd();
const originalRoutineEnv = process.env[ROUTINE_EXEC_ENV];

async function runExec(args: string[]): Promise<void> {
  process.exitCode = undefined;
  const program = new Command();
  program.exitOverride();
  registerExecCommands(program);
  await program.parseAsync(["node", "specdojo", "exec", ...args]);
}

afterEach(() => {
  process.chdir(originalCwd);
  process.exitCode = undefined;
  if (originalRoutineEnv === undefined) delete process.env[ROUTINE_EXEC_ENV];
  else process.env[ROUTINE_EXEC_ENV] = originalRoutineEnv;
  vi.restoreAllMocks();
});

describe("exec run --if-busy", () => {
  it("手動 skip は正常終了し、routine 呼び出しには skipped を通知する", async () => {
    const repo = mkdtempSync(join(tmpdir(), "specdojo-exec-run-busy-"));
    const executionPath = join(repo, "execution");
    mkdirSync(join(repo, ".specdojo"), { recursive: true });
    mkdirSync(join(repo, "schedule"), { recursive: true });
    mkdirSync(executionPath, { recursive: true });
    writeFileSync(
      join(repo, ".specdojo", "specdojo.config.json"),
      JSON.stringify({
        version: 1,
        current_project: "test",
        projects: { test: { schedule_path: "schedule", execution_path: "execution" } },
      }),
      "utf8",
    );

    const output: string[] = [];
    vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
      output.push(String(chunk));
      return true;
    });

    try {
      process.chdir(repo);
      const held = await acquireExecRunLock(executionPath, { actor: "held", ifBusy: "fail" });
      expect(held).not.toBeNull();

      delete process.env[ROUTINE_EXEC_ENV];
      await runExec(["run", "--project", "test", "--plan", "missing.md", "--if-busy", "skip"]);
      expect(output.join("")).toContain("[run] skipped: exec busy");
      expect(process.exitCode).toBeUndefined();

      process.env[ROUTINE_EXEC_ENV] = "1";
      await runExec(["run", "--project", "test", "--plan", "missing.md", "--if-busy", "skip"]);
      expect(process.exitCode).toBe(ROUTINE_BUSY_SKIP_EXIT_CODE);

      releaseExecRunLock(held!);
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("手動の既定は fail", async () => {
    const repo = mkdtempSync(join(tmpdir(), "specdojo-exec-run-busy-"));
    const executionPath = join(repo, "execution");
    mkdirSync(join(repo, ".specdojo"), { recursive: true });
    mkdirSync(join(repo, "schedule"), { recursive: true });
    mkdirSync(executionPath, { recursive: true });
    writeFileSync(
      join(repo, ".specdojo", "specdojo.config.json"),
      JSON.stringify({
        version: 1,
        current_project: "test",
        projects: { test: { schedule_path: "schedule", execution_path: "execution" } },
      }),
      "utf8",
    );

    const output: string[] = [];
    vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
      output.push(String(chunk));
      return true;
    });

    try {
      process.chdir(repo);
      delete process.env[ROUTINE_EXEC_ENV];
      const held = await acquireExecRunLock(executionPath, { actor: "held", ifBusy: "fail" });
      expect(held).not.toBeNull();

      await runExec(["run", "--project", "test", "--plan", "missing.md"]);
      expect(output.join("")).toContain("Exec run is busy for this project");
      expect(process.exitCode).toBe(1);

      releaseExecRunLock(held!);
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });
});
