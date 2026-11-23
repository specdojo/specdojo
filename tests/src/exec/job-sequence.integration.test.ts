import { spawn } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { dump } from "../../../src/shared/yaml.js";
import { type JobRunRecord, type JobCommandStepDefinition } from "../../../src/job/job.js";
import { validateRunRecordLayout } from "../../../src/exec/validate-records.js";
import {
  acquireExecRunLock,
  EXEC_RUN_LOCK_TOKEN_ENV,
  releaseExecRunLock,
} from "../../../src/exec/run/lock.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const cli = join(root, "src/specdojo.ts");
const dirs: string[] = [];

function fixture(steps: JobCommandStepDefinition[], extra: Record<string, unknown> = {}): string {
  const repo = mkdtempSync(join(tmpdir(), "specdojo-sequence-"));
  dirs.push(repo);
  for (const dir of [".specdojo", "jobs", "schedule", "execution", "routines"])
    mkdirSync(join(repo, dir));
  symlinkSync(join(root, "node_modules"), join(repo, "node_modules"), "dir");
  writeFileSync(
    join(repo, ".specdojo/specdojo.config.json"),
    JSON.stringify({
      version: 1,
      current_project: "test",
      projects: {
        test: {
          jobs_path: "jobs",
          schedule_path: "schedule",
          execution_path: "execution",
          routines_path: "routines",
        },
      },
    }),
  );
  writeFileSync(
    join(repo, "jobs/job-sequence.yaml"),
    dump({
      id: "job-sequence",
      name: "Sequence fixture",
      task: { mode: "command", steps, ...extra },
      run: { idempotency_key: "{{job_id}}:{{scheduled_at}}" },
    }),
  );
  return repo;
}

function invoke(repo: string, args: string[]): Promise<{ code: number | null; output: string }> {
  return new Promise((resolveRun, reject) => {
    const env: NodeJS.ProcessEnv = { ...process.env, XDG_STATE_HOME: join(repo, "state") };
    delete env[EXEC_RUN_LOCK_TOKEN_ENV];
    delete env.SPECDOJO_ROOT;
    const child = spawn(process.execPath, ["--import", "tsx", cli, ...args, "--project", "test"], {
      cwd: repo,
      env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    child.stdout.on("data", (chunk: Buffer) => {
      output += chunk.toString();
    });
    child.stderr.on("data", (chunk: Buffer) => {
      output += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => resolveRun({ code, output }));
  });
}

function run(repo: string, args: string[] = []) {
  return invoke(repo, [
    "exec",
    "run",
    "--job",
    "job-sequence",
    "--scheduled-at",
    "2026-11-17T01:00:00Z",
    ...args,
  ]);
}

function record(repo: string): JobRunRecord {
  const path = join(repo, "execution/jobs/runs");
  return JSON.parse(
    readFileSync(
      join(
        path,
        readdirSync(path).find((name) => name.endsWith(".json"))!,
      ),
      "utf8",
    ),
  ) as JobRunRecord;
}

afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe("command Job sequence", () => {
  it("awaits each command and records success and per-step evidence", async () => {
    const repo = fixture([
      { id: "first", command: "sleep 0.05; echo first >> order" },
      { id: "second", command: "echo second >> order" },
    ]);
    const result = await run(repo);
    expect(result, result.output).toMatchObject({ code: 0 });
    expect(readFileSync(join(repo, "order"), "utf8")).toBe("first\nsecond\n");
    const saved = record(repo);
    expect(saved.state).toBe("succeeded");
    expect(saved.attempts[0].steps?.map((step) => step.status)).toEqual(["succeeded", "succeeded"]);
    for (const step of saved.attempts[0].steps ?? [])
      expect(existsSync(join(repo, step.evidence_ref!))).toBe(true);
    const issues = validateRunRecordLayout({
      executionPath: join(repo, "execution"),
      repoRoot: repo,
      lockPolicy: "tracked",
    });
    expect(issues).toEqual([]);
  });

  it.each(["stop", "continue"] as const)(
    "finalizes a failed Run with on_failure=%s",
    async (onFailure) => {
      const repo = fixture([
        { id: "fail", command: "exit 9", on_failure: onFailure },
        { id: "after", command: "echo ran > after" },
      ]);
      expect((await run(repo)).code).toBe(1);
      const saved = record(repo);
      expect(saved.state).toBe("failed");
      expect(saved.attempts[0]).toMatchObject({ status: "failed", exit_code: 1 });
      expect(saved.attempts[0].steps?.map((step) => step.status)).toEqual([
        "failed",
        onFailure === "stop" ? "deferred" : "succeeded",
      ]);
      expect(existsSync(join(repo, "after"))).toBe(onFailure === "continue");
    },
  );

  it("uses state as well as exit code and never parses success-looking logs", async () => {
    const repo = fixture([
      {
        id: "wait",
        command: "echo 'job run complete'; echo '{\"state\":\"running\"}' > state.json",
        completion: {
          path: "state.json",
          field: "state",
          succeeded: ["succeeded"],
          deferred: ["running"],
        },
      },
      { id: "after", command: "echo bad > after" },
    ]);
    expect((await run(repo)).code).toBe(75);
    expect(record(repo).state).toBe("failed");
    expect(record(repo).attempts[0].steps?.map((step) => step.status)).toEqual([
      "deferred",
      "deferred",
    ]);
    expect(existsSync(join(repo, "after"))).toBe(false);
  });

  it.each(["missing.json", "invalid.json"])(
    "fails closed for an unavailable or malformed completion file: %s",
    async (path) => {
      const repo = fixture([
        {
          id: "check",
          command: "echo invalid > invalid.json",
          completion: { path, field: "state", succeeded: ["done"] },
        },
      ]);
      expect((await run(repo)).code).toBe(1);
      expect(record(repo).state).toBe("failed");
    },
  );

  it("accepts a nested Markdown frontmatter state", async () => {
    const repo = fixture([
      {
        id: "check",
        command: "printf '%s\\n' '---' 'specdojo:' '  item_status: review' '---' > ticket.md",
        completion: { path: "ticket.md", field: "specdojo.item_status", succeeded: ["review"] },
      },
    ]);
    expect((await run(repo)).code).toBe(0);
    expect(record(repo).attempts[0].steps?.[0].status).toBe("succeeded");
  });

  it("records lock timeout as deferred and does not run the precondition or steps", async () => {
    const repo = fixture([{ id: "build", command: "echo bad > after" }], {
      lock_wait_seconds: 0,
      precondition: { command: "echo bad > precondition", skip_when: "empty-output" },
    });
    const held = await acquireExecRunLock(join(repo, "execution"), {
      actor: "prior",
      ifBusy: "fail",
    });
    try {
      expect((await run(repo)).code).toBe(75);
      const saved = record(repo);
      expect(saved.state).toBe("failed");
      expect(saved.attempts[0].steps?.[0]).toMatchObject({
        status: "deferred",
        reason: expect.stringContaining("timed out"),
      });
      expect(existsSync(join(repo, "after"))).toBe(false);
      expect(existsSync(join(repo, "precondition"))).toBe(false);
    } finally {
      releaseExecRunLock(held!);
    }
  });

  it("waits for a prior lock, then inherits that lock in nested exec commands", async () => {
    const repo = fixture(
      [{ id: "child", command: "{{specdojo}} exec run --project test --job job-child" }],
      { lock_wait_seconds: 10 },
    );
    writeFileSync(
      join(repo, "jobs/job-child.yaml"),
      dump({
        id: "job-child",
        name: "Child",
        task: { mode: "command", command: "echo child > after" },
        run: { idempotency_key: "{{job_id}}:{{scheduled_at}}" },
      }),
    );
    const held = await acquireExecRunLock(join(repo, "execution"), {
      actor: "prior",
      ifBusy: "fail",
    });
    const waiting = run(repo);
    setTimeout(() => releaseExecRunLock(held!), 500);
    const result = await waiting;
    expect(result, result.output).toMatchObject({ code: 0 });
    expect(readFileSync(join(repo, "after"), "utf8")).toBe("child\n");
  });

  it("keeps frozen steps on retry and preserves each attempt's outcomes", async () => {
    const repo = fixture([{ id: "retry", command: "test -f allow" }]);
    expect((await run(repo)).code).toBe(1);
    const job = join(repo, "jobs/job-sequence.yaml");
    writeFileSync(job, readFileSync(job, "utf8").replace("test -f allow", "exit 99"));
    writeFileSync(join(repo, "allow"), "yes");
    expect((await run(repo)).code).toBe(0);
    const saved = record(repo);
    expect(saved.state).toBe("succeeded");
    expect(saved.attempts.map((attempt) => attempt.steps?.[0].status)).toEqual([
      "failed",
      "succeeded",
    ]);
    expect(saved.attempts[0].steps?.[0].evidence_ref).not.toBe(
      saved.attempts[1].steps?.[0].evidence_ref,
    );
    expect((await run(repo)).code).toBe(0);
    expect(record(repo).attempts).toHaveLength(2);
  });

  it("dry-run resolves commands without executing them or creating a Run", async () => {
    const repo = fixture([{ id: "check", command: "echo {{project_id}} > after" }]);
    const result = await run(repo, ["--dry-run"]);
    expect(result.code).toBe(0);
    expect(result.output).toContain("echo test > after");
    expect(existsSync(join(repo, "after"))).toBe(false);
    expect(existsSync(join(repo, "execution/jobs/runs"))).toBe(false);
  });

  it("terminates a timed-out command before continuing and records deferral", async () => {
    const repo = fixture([
      {
        id: "timeout",
        command: "sleep 10; echo bad > late",
        timeout_seconds: 1,
        on_failure: "continue",
      },
      { id: "after", command: "echo yes > after" },
    ]);
    expect((await run(repo)).code).toBe(75);
    expect(record(repo).state).toBe("failed");
    expect(record(repo).attempts[0].steps?.map((step) => step.status)).toEqual([
      "deferred",
      "succeeded",
    ]);
    expect(existsSync(join(repo, "late"))).toBe(false);
    expect(existsSync(join(repo, "after"))).toBe(true);
  });

  it("routine run --due completes the sequence without an agent", async () => {
    const repo = fixture([{ id: "routine", command: "echo yes > after" }]);
    writeFileSync(
      join(repo, "routines/rtn-sequence.yaml"),
      dump({
        id: "rtn-sequence",
        name: "Sequence",
        enabled: true,
        trigger: { cron: "* * * * *", timezone: "UTC" },
        action: { kind: "job", job: "job-sequence" },
        policy: { missed_run: "latest", overlap: "skip" },
      }),
    );
    const result = await invoke(repo, ["routine", "run", "--due"]);
    expect(result, result.output).toMatchObject({ code: 0 });
    expect(existsSync(join(repo, "after"))).toBe(true);
    expect(record(repo).state).toBe("succeeded");
  });
});
