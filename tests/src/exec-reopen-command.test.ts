import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Command } from "commander";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerExecCommands } from "../../src/exec.js";

const originalCwd = process.cwd();
const ENV_KEYS = ["SPECDOJO_PROJECT", "SPECDOJO_SCHEDULE_PATH", "SPECDOJO_EXECUTION_PATH"];
const originalEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));
const EVENTS_REL = join("execution", "exec", "events");
const TASK_A = "T-TEST-alpha-010";
const TASK_B = "T-TEST-beta-020";

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

function setupRepository(): string {
  const repo = mkdtempSync(join(tmpdir(), "specdojo-reopen-"));
  mkdirSync(join(repo, ".specdojo"), { recursive: true });
  mkdirSync(join(repo, "schedule"), { recursive: true });
  mkdirSync(join(repo, EVENTS_REL), { recursive: true });

  writeFileSync(
    join(repo, ".specdojo", "specdojo.config.json"),
    JSON.stringify(
      {
        version: 1,
        current_project: "test",
        projects: {
          test: {
            schedule_path: "schedule",
            execution_path: "execution",
            members_path: "members.yaml",
          },
        },
      },
      null,
      2,
    ) + "\n",
    "utf8",
  );
  writeFileSync(
    join(repo, "members.yaml"),
    [
      "members:",
      "  - nickname: indie",
      "    type: human",
      "    roles: [PO]",
      "  - nickname: edit-agent",
      "    type: agent",
      "    roles: []",
      "",
    ].join("\n"),
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
      "  - local_id: beta",
      '    phase_suffix: "020"',
      "    name: Task beta",
      "    duration_days: 1",
      "    depends_on: [T-TEST-alpha-010]",
      "",
    ].join("\n"),
    "utf8",
  );
  writeEvent(repo, "claim", TASK_A, "edit-agent", 1);
  writeEvent(repo, "complete", TASK_A, "edit-agent", 2);
  return repo;
}

function writeEvent(repo: string, type: string, taskId: string, by: string, second: number): void {
  const ts = `2026-07-20T00:00:${String(second).padStart(2, "0")}Z`;
  const stamp = ts.replace(/[-:]/g, "");
  writeFileSync(
    join(repo, EVENTS_REL, `${stamp}_${by}_${taskId}_${type}.json`),
    JSON.stringify({ v: 1, ts, type, task_id: taskId, by, msg: `${type} task` }, null, 2) + "\n",
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

describe("exec reopen", () => {
  it("human actor が done task の reopen event を記録する", async () => {
    const repo = setupRepository();
    const stdout = captureStdout();
    try {
      process.chdir(repo);
      await runExec([
        "reopen",
        "--project",
        "test",
        "--task",
        TASK_A,
        "--by",
        "indie",
        "--msg",
        "completion criteria unmet",
      ]);

      const reopenFile = readdirSync(join(repo, EVENTS_REL)).find((name) =>
        name.includes("_reopen_"),
      );
      expect(reopenFile).toBeDefined();
      const event = JSON.parse(
        readFileSync(join(repo, EVENTS_REL, reopenFile as string), "utf8"),
      ) as Record<string, unknown>;
      expect(event).toMatchObject({
        type: "reopen",
        task_id: TASK_A,
        by: "indie",
        msg: "completion criteria unmet",
      });
      expect(stdout.join("")).toContain("_reopen_");
      expect(process.exitCode).toBe(0);
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("agent actor の reopen を拒否する", async () => {
    const repo = setupRepository();
    const stdout = captureStdout();
    try {
      process.chdir(repo);
      await runExec([
        "reopen",
        "--project",
        "test",
        "--task",
        TASK_A,
        "--by",
        "edit-agent",
        "--msg",
        "retry",
      ]);

      expect(stdout.join("")).toContain("reopen requires a human actor");
      expect(process.exitCode).toBe(1);
      expect(readdirSync(join(repo, EVENTS_REL)).some((name) => name.includes("_reopen_"))).toBe(
        false,
      );
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("進行済みの後続 task がある場合は reopen を拒否する", async () => {
    const repo = setupRepository();
    const stdout = captureStdout();
    try {
      writeEvent(repo, "claim", TASK_B, "edit-agent", 3);
      writeEvent(repo, "complete", TASK_B, "edit-agent", 4);
      process.chdir(repo);
      await runExec([
        "reopen",
        "--project",
        "test",
        "--task",
        TASK_A,
        "--by",
        "indie",
        "--msg",
        "upstream completion invalid",
      ]);

      expect(stdout.join("")).toContain(
        `downstream task(s) must be reopened or released first: ${TASK_B} (done)`,
      );
      expect(process.exitCode).toBe(1);
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });
});
