import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  utimesSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Command } from "commander";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerExecCommands } from "../../../src/exec/exec.js";
import { recordClaimRun } from "../../../src/exec/release-safety.js";
import {
  execRunLockPath,
  execRunJoinPoolPath,
  EXEC_RUN_LOCK_TOKEN_ENV,
} from "../../../src/exec/run/lock.js";
import type { ExecEventV1 } from "../../../src/exec/types.js";

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

function writeEvent(
  repo: string,
  type: string,
  taskId: string,
  by: string,
  meta?: Record<string, unknown>,
): void {
  eventSequence += 1;
  const ts = `2026-06-13T00:00:${String(eventSequence).padStart(2, "0")}Z`;
  const stamp = ts.replace(/[-:]/g, "").replace(".000", "");
  writeFileSync(
    join(repo, EVENTS_REL, `${stamp}_${by}_${taskId}_${type}.json`),
    JSON.stringify(
      { v: 1, ts, type, task_id: taskId, by, msg: `${type} ${taskId}`, meta },
      null,
      2,
    ) + "\n",
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

describe("orchestrator forced release safety", () => {
  let repo: string;
  let output: string[];
  const deadPid = 987654;
  const run = { pid: deadPid, lock_token: "original-run" };

  function startFixture(): void {
    repo = setupRepository();
    process.chdir(repo);
    eventSequence = 0;
    output = [];
    for (const stream of [process.stdout, process.stderr]) {
      vi.spyOn(stream, "write").mockImplementation((chunk: string | Uint8Array) => {
        output.push(String(chunk));
        return true;
      });
    }
    const kill = process.kill.bind(process);
    vi.spyOn(process, "kill").mockImplementation((pid, signal) => {
      if (pid === deadPid) throw Object.assign(new Error("gone"), { code: "ESRCH" });
      return kill(pid, signal);
    });
  }

  function claim(meta: Record<string, unknown> = { claim_run: run }): void {
    writeEvent(repo, "claim", TASK.alpha, "edit-agent", meta);
  }

  function lock(path: string, pid: number, stale = false): void {
    mkdirSync(path, { recursive: true });
    writeFileSync(
      join(path, "owner.json"),
      JSON.stringify({ actor: "exec-run", pid, token: "original-run" }),
    );
    if (stale) {
      const past = new Date(Date.now() - 60_000);
      utimesSync(path, past, past);
    }
  }

  async function release(extra: string[] = [], actor = "specdojo-orchestrator"): Promise<void> {
    await runExec([
      "release",
      "--project",
      "test",
      "--task",
      TASK.alpha,
      "--by",
      actor,
      "--force",
      ...extra,
    ]);
  }

  afterEach(() => {
    process.chdir(originalCwd);
    if (repo) rmSync(repo, { recursive: true, force: true });
  });

  it.each(["doing", "blocked"])(
    "releases a stopped %s claim and records the verified run",
    async (state) => {
      startFixture();
      claim();
      if (state === "blocked")
        writeEvent(repo, "block", TASK.alpha, "edit-agent", { unrelated: true });
      lock(execRunLockPath(join(repo, "execution")), deadPid, true);
      await release();
      expect(process.exitCode).toBe(0);
      const name = readdirSync(join(repo, EVENTS_REL)).find((entry) =>
        entry.includes("_release_"),
      )!;
      const event = JSON.parse(readFileSync(join(repo, EVENTS_REL, name), "utf8"));
      expect(event.by).toBe("specdojo-orchestrator");
      expect(event.meta).toMatchObject({
        release_stopped_claim_run: run,
        release_claim_owner: "edit-agent",
      });
      expect(existsSync(execRunLockPath(join(repo, "execution")))).toBe(false);
    },
  );

  it("uses the persisted run PID even after its lock was removed", async () => {
    startFixture();
    claim();
    await release();
    expect(releaseEventTaskIds(repo)).toEqual([TASK.alpha]);
  });

  it("does not reuse the old runner record after a human takes over", async () => {
    startFixture();
    claim();
    writeEvent(repo, "block", TASK.alpha, "edit-agent");
    writeEvent(repo, "unblock", TASK.alpha, "indie", { take_over: true });
    await release();
    expect(process.exitCode).toBe(1);
    expect(output.join("")).toContain("missing or invalid claim lock/PID record");
    expect(releaseEventTaskIds(repo)).toEqual([]);
  });

  it("preserves a stopped run's fresh lock until the stale-lock policy permits acquisition", async () => {
    startFixture();
    claim();
    const path = execRunLockPath(join(repo, "execution"));
    lock(path, deadPid);
    await release();
    expect(process.exitCode).toBe(1);
    expect(output.join("")).toContain("a human may override with --force");
    expect(existsSync(path)).toBe(true);
    expect(releaseEventTaskIds(repo)).toEqual([]);
  });

  it("refuses a live claim PID with task and PID in the message", async () => {
    startFixture();
    claim({ claim_run: { ...run, pid: process.pid } });
    await release();
    expect(process.exitCode).toBe(1);
    expect(output.join("")).toContain(`task ${TASK.alpha}, PID ${process.pid}`);
    expect(output.join("")).toContain("a human may override with --force");
    expect(releaseEventTaskIds(repo)).toEqual([]);
  });

  it.each([{}, { claim_run: { pid: 0, lock_token: "bad" } }, { claim_run: { pid: deadPid } }])(
    "refuses missing or invalid run metadata: %j",
    async (meta) => {
      startFixture();
      claim(meta);
      await release();
      expect(process.exitCode).toBe(1);
      expect(output.join("")).toContain("missing or invalid claim lock/PID record");
      expect(output.join("")).toContain("a human may override with --force");
      expect(releaseEventTaskIds(repo)).toEqual([]);
    },
  );

  it.each(["primary", "join"])(
    "refuses a resumed run with another PID in a stale %s lock",
    async (kind) => {
      startFixture();
      claim();
      const execution = join(repo, "execution");
      const path =
        kind === "primary"
          ? execRunLockPath(execution)
          : join(execRunJoinPoolPath(execution), "slot-1");
      lock(path, process.pid, true);
      await release();
      expect(process.exitCode).toBe(1);
      expect(output.join("")).toContain(`task ${TASK.alpha}: PID ${process.pid}`);
      expect(existsSync(path)).toBe(true);
      expect(releaseEventTaskIds(repo)).toEqual([]);
    },
  );

  it("refuses unreadable lock metadata", async () => {
    startFixture();
    claim();
    const path = execRunLockPath(join(repo, "execution"));
    mkdirSync(path, { recursive: true });
    writeFileSync(join(path, "owner.json"), "invalid json");
    await release();
    expect(process.exitCode).toBe(1);
    expect(output.join("")).toContain("unreadable or invalid run lock");
    expect(releaseEventTaskIds(repo)).toEqual([]);
  });

  it.each(["EPERM", "EIO"])("does not interpret process probe %s as stopped", async (code) => {
    startFixture();
    claim();
    vi.mocked(process.kill).mockImplementation(() => {
      throw Object.assign(new Error(code), { code });
    });
    await release();
    expect(process.exitCode).toBe(1);
    expect(output.join("")).toContain("a human may override with --force");
    expect(releaseEventTaskIds(repo)).toEqual([]);
  });

  it("skips live and unknown claims when releasing all blocked tasks", async () => {
    startFixture();
    claim();
    writeEvent(repo, "block", TASK.alpha, "edit-agent");
    writeEvent(repo, "claim", TASK.beta, "edit-agent", { claim_run: { ...run, pid: process.pid } });
    writeEvent(repo, "block", TASK.beta, "edit-agent");
    block(repo, TASK.gamma, "other-agent");
    await release(["--all-blocked"]);
    expect(releaseEventTaskIds(repo)).toEqual([TASK.alpha]);
    expect(output.join("")).toContain("Released 1 blocked task(s); skipped 2.");
  });

  it("dry-run keeps the claim and includes the stopped-run evidence", async () => {
    startFixture();
    claim();
    await release(["--dry-run"]);
    expect(releaseEventTaskIds(repo)).toEqual([]);
    expect(output.join("")).toContain("release_stopped_claim_run");
  });

  it("keeps other agents excluded even for a stopped claim", async () => {
    startFixture();
    claim();
    await release([], "night-orchestrator");
    expect(process.exitCode).toBe(1);
    expect(releaseEventTaskIds(repo)).toEqual([]);
  });

  it("records only a verified inherited runner PID and strips supplied evidence", () => {
    startFixture();
    const execution = join(repo, "execution");
    const path = execRunLockPath(execution);
    lock(path, process.pid);
    const event: ExecEventV1 = {
      v: 1,
      ts: "2026-06-13T00:00:01Z",
      type: "claim",
      task_id: TASK.alpha,
      by: "edit-agent",
      msg: "claim",
      meta: { claim_run: run },
    };
    const previous = process.env[EXEC_RUN_LOCK_TOKEN_ENV];
    try {
      delete process.env[EXEC_RUN_LOCK_TOKEN_ENV];
      recordClaimRun(event, execution);
      expect(event.meta?.claim_run).toBeUndefined();
      process.env[EXEC_RUN_LOCK_TOKEN_ENV] = "wrong-token";
      recordClaimRun(event, execution);
      expect(event.meta?.claim_run).toBeUndefined();
      process.env[EXEC_RUN_LOCK_TOKEN_ENV] = "original-run";
      recordClaimRun(event, execution);
      expect(event.meta?.claim_run).toEqual({ pid: process.pid, lock_token: "original-run" });
    } finally {
      if (previous === undefined) delete process.env[EXEC_RUN_LOCK_TOKEN_ENV];
      else process.env[EXEC_RUN_LOCK_TOKEN_ENV] = previous;
    }
  });
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
