import { mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
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

// Tasks are derived from the track: local_id `alpha` + phase_suffix `010` on track `test`
// becomes `T-TEST-alpha-010`.
const TASK = {
  alpha: "T-TEST-alpha-010",
  beta: "T-TEST-beta-020",
  gamma: "T-TEST-gamma-030",
} as const;

function setupRepository(): string {
  const repo = mkdtempSync(join(tmpdir(), "specdojo-release-all-blocked-"));
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

  const taskLines = (["alpha", "beta", "gamma"] as const).flatMap((localId, index) => [
    `  - local_id: ${localId}`,
    `    phase_suffix: "0${index + 1}0"`,
    `    name: Task ${localId}`,
    "    duration_days: 1",
    "    depends_on: []",
    "    owner: DEV",
  ]);
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
      ...taskLines,
      "",
    ].join("\n"),
    "utf8",
  );

  return repo;
}

let eventSequence = 0;

function writeEvent(repo: string, type: string, taskId: string, by: string): void {
  eventSequence += 1;
  const ts = `2026-06-13T00:00:${String(eventSequence).padStart(2, "0")}Z`;
  const stamp = ts.replace(/[-:]/g, "").replace(".000", "");
  writeFileSync(
    join(repo, EVENTS_REL, `${stamp}_${by}_${taskId}_${type}.json`),
    JSON.stringify({ v: 1, ts, type, task_id: taskId, by, msg: `${type} ${taskId}` }, null, 2) +
      "\n",
    "utf8",
  );
}

function block(repo: string, taskId: string, by: string): void {
  writeEvent(repo, "claim", taskId, by);
  writeEvent(repo, "block", taskId, by);
}

function releaseEventTaskIds(repo: string): string[] {
  return readdirSync(join(repo, EVENTS_REL))
    .filter((name) => name.includes("_release"))
    .map((name) => name.replace(/^\d+T\d+Z_[^_]+_/, "").replace(/_release.*$/, ""));
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

describe("exec release --all-blocked", () => {
  function captureStdout(): string[] {
    const stdout: string[] = [];
    vi.spyOn(process.stdout, "write").mockImplementation((chunk: string | Uint8Array) => {
      stdout.push(typeof chunk === "string" ? chunk : Buffer.from(chunk).toString("utf8"));
      return true;
    });
    vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    return stdout;
  }

  it("releases every blocked task and leaves doing/todo tasks untouched", async () => {
    const repo = setupRepository();
    const stdout = captureStdout();
    try {
      process.chdir(repo);
      block(repo, TASK.alpha, "edit-agent");
      block(repo, TASK.beta, "edit-agent");
      writeEvent(repo, "claim", TASK.gamma, "edit-agent"); // doing, not blocked

      await runExec([
        "release",
        "--project",
        "test",
        "--by",
        "edit-agent",
        "--msg",
        "reset",
        "--all-blocked",
      ]);

      const output = stdout.join("");
      expect(output).toContain("Released 2 blocked task(s); skipped 0.");
      expect(releaseEventTaskIds(repo).sort()).toEqual([TASK.alpha, TASK.beta]);
      expect(process.exitCode).toBe(0);
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("skips a task blocked by another actor and reports the reason", async () => {
    const repo = setupRepository();
    const stdout = captureStdout();
    try {
      process.chdir(repo);
      block(repo, TASK.alpha, "edit-agent");
      block(repo, TASK.beta, "other-agent");

      await runExec([
        "release",
        "--project",
        "test",
        "--by",
        "edit-agent",
        "--msg",
        "reset",
        "--all-blocked",
      ]);

      const output = stdout.join("");
      expect(output).toContain("Released 1 blocked task(s); skipped 1.");
      expect(output).toContain(
        `skip ${TASK.beta}: task is being worked on by another actor: other-agent`,
      );
      expect(releaseEventTaskIds(repo)).toEqual([TASK.alpha]);
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("dry-run writes no release events", async () => {
    const repo = setupRepository();
    const stdout = captureStdout();
    try {
      process.chdir(repo);
      block(repo, TASK.alpha, "edit-agent");
      block(repo, TASK.beta, "edit-agent");

      await runExec([
        "release",
        "--project",
        "test",
        "--by",
        "edit-agent",
        "--msg",
        "reset",
        "--all-blocked",
        "--dry-run",
      ]);

      const output = stdout.join("");
      expect(output).toContain("[dry-run]");
      expect(output).toContain("Released 2 blocked task(s) (dry-run); skipped 0.");
      expect(releaseEventTaskIds(repo)).toEqual([]);
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("reports when there are no blocked tasks", async () => {
    const repo = setupRepository();
    const stdout = captureStdout();
    try {
      process.chdir(repo);
      writeEvent(repo, "claim", TASK.gamma, "edit-agent"); // doing only

      await runExec([
        "release",
        "--project",
        "test",
        "--by",
        "edit-agent",
        "--msg",
        "reset",
        "--all-blocked",
      ]);

      expect(stdout.join("")).toContain("No blocked tasks to release.");
      expect(process.exitCode).toBe(0);
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });
});
