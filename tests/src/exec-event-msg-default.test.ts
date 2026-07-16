import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Command } from "commander";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerExecCommands } from "../../src/exec.js";

const originalCwd = process.cwd();
const ENV_KEYS = ["SPECDOJO_PROJECT", "SPECDOJO_SCHEDULE_PATH", "SPECDOJO_EXECUTION_PATH"];
const originalEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));

function clearProjectEnv(): void {
  for (const key of ENV_KEYS) delete process.env[key];
}

async function runExec(args: string[]): Promise<void> {
  clearProjectEnv();
  process.exitCode = undefined;
  const program = new Command();
  program.exitOverride();
  registerExecCommands(program);
  await program.parseAsync(["node", "specdojo", "exec", ...args]);
}

const EVENTS_REL = join("execution", "exec", "events");

// local_id `alpha` + phase_suffix `010` on track `test` becomes `T-TEST-alpha-010`.
const TASK_ALPHA = "T-TEST-alpha-010";

function setupRepository(): string {
  const repo = mkdtempSync(join(tmpdir(), "specdojo-msg-default-"));
  mkdirSync(join(repo, ".specdojo"), { recursive: true });
  mkdirSync(join(repo, "schedule"), { recursive: true });
  mkdirSync(join(repo, EVENTS_REL), { recursive: true });

  writeFileSync(
    join(repo, ".specdojo", "specdojo.config.json"),
    JSON.stringify(
      {
        version: 1,
        current_project: "test",
        projects: { test: { schedule_path: "schedule", execution_path: "execution" } },
      },
      null,
      2,
    ) + "\n",
    "utf8",
  );

  writeFileSync(
    join(repo, "schedule", "sch-track-test.yaml"),
    [
      "kind: track",
      "id: test:sch-track-test",
      "type: project",
      "status: draft",
      "version: 1",
      "project_id: test",
      "track: test",
      "tasks:",
      "  - local_id: alpha",
      '    phase_suffix: "010"',
      "    name: Task alpha",
      "    duration_days: 1",
      "    depends_on: []",
      "    owner: DEV",
      "",
    ].join("\n"),
    "utf8",
  );

  return repo;
}

function writeClaimEvent(repo: string, taskId: string, by: string): void {
  const ts = "2026-06-13T00:00:01Z";
  const stamp = ts.replace(/[-:]/g, "");
  writeFileSync(
    join(repo, EVENTS_REL, `${stamp}_${by}_${taskId}_claim.json`),
    JSON.stringify({ v: 1, ts, type: "claim", task_id: taskId, by, msg: "claim" }, null, 2) + "\n",
    "utf8",
  );
}

function captureStdout(): string[] {
  const stdout: string[] = [];
  vi.spyOn(process.stdout, "write").mockImplementation((chunk: string | Uint8Array) => {
    stdout.push(typeof chunk === "string" ? chunk : Buffer.from(chunk).toString("utf8"));
    return true;
  });
  vi.spyOn(process.stderr, "write").mockImplementation(() => true);
  return stdout;
}

function parseDryRunEvent(stdout: string[]): Record<string, unknown> {
  const output = stdout.join("");
  const jsonText = output.slice(output.indexOf("{"));
  return JSON.parse(jsonText) as Record<string, unknown>;
}

afterEach(() => {
  process.chdir(originalCwd);
  clearProjectEnv();
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  process.exitCode = undefined;
  vi.restoreAllMocks();
});

describe("exec event --msg defaults", () => {
  it("claim without --msg writes the fixed default message", async () => {
    const repo = setupRepository();
    const stdout = captureStdout();
    try {
      process.chdir(repo);

      await runExec([
        "claim",
        "--project",
        "test",
        "--task",
        TASK_ALPHA,
        "--by",
        "edit-agent",
        "--dry-run",
      ]);

      expect(parseDryRunEvent(stdout)).toMatchObject({
        type: "claim",
        task_id: TASK_ALPHA,
        msg: "claim task",
      });
      expect(process.exitCode).toBe(0);
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("complete without --msg writes the fixed default message", async () => {
    const repo = setupRepository();
    const stdout = captureStdout();
    try {
      process.chdir(repo);
      writeClaimEvent(repo, TASK_ALPHA, "edit-agent");

      await runExec([
        "complete",
        "--project",
        "test",
        "--task",
        TASK_ALPHA,
        "--by",
        "edit-agent",
        "--dry-run",
      ]);

      expect(parseDryRunEvent(stdout)).toMatchObject({
        type: "complete",
        task_id: TASK_ALPHA,
        msg: "complete task",
      });
      expect(process.exitCode).toBe(0);
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("an explicit --msg overrides the default", async () => {
    const repo = setupRepository();
    const stdout = captureStdout();
    try {
      process.chdir(repo);
      writeClaimEvent(repo, TASK_ALPHA, "edit-agent");

      await runExec([
        "complete",
        "--project",
        "test",
        "--task",
        TASK_ALPHA,
        "--by",
        "edit-agent",
        "--msg",
        "charter finalized",
        "--dry-run",
      ]);

      expect(parseDryRunEvent(stdout)).toMatchObject({
        type: "complete",
        msg: "charter finalized",
      });
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("block without --msg is rejected because the message is the block reason", async () => {
    const repo = setupRepository();
    captureStdout();
    try {
      process.chdir(repo);

      await expect(
        runExec(["block", "--project", "test", "--task", TASK_ALPHA, "--by", "edit-agent"]),
      ).rejects.toThrow(/--msg/);
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("note without --msg is rejected because the message is the payload", async () => {
    const repo = setupRepository();
    captureStdout();
    try {
      process.chdir(repo);

      await expect(
        runExec(["note", "--project", "test", "--task", TASK_ALPHA, "--by", "edit-agent"]),
      ).rejects.toThrow(/--msg/);
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });
});
