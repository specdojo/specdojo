import { Command } from "commander";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerWatchScanCommand } from "../../../src/commands/watch-scan.js";
import { findTargetProcess, listProcesses } from "../../../src/exec/watch-control.js";

// PJR-3M4M: 2026-11-13〜14 の夜に止まった実例のうち、codex の使用量の上限（解除の時刻つきの
// 延期）と、負荷で test-unit が時間切れになった親の検証の失敗を、`orchestrator watch-scan` の
// CLI 経路で再現する。手当ては切り離した実際の子プロセスとして起動し、子は起動された引数を
// ログに書くだけの偽の specdojo とする（本物の再開は agent を起こすため）。

const originalCwd = process.cwd();
const originalArgv1 = process.argv[1];
const ENV_KEYS = ["SPECDOJO_PROJECT", "SPECDOJO_SCHEDULE_PATH", "SPECDOJO_EXECUTION_PATH"];
const originalEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));

const EVENTS_REL = join("execution", "exec", "events");
const LIMIT_TASK = "T-NIGHT-dct-index-040";
const TIMEOUT_TASK = "T-NIGHT-cnd-specdojo-070";
const TIMEOUT_RUN_REL = join("execution", "runs", "schedule", TIMEOUT_TASK, "run-1");

const repos: string[] = [];

afterEach(() => {
  process.chdir(originalCwd);
  process.argv[1] = originalArgv1;
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  process.exitCode = undefined;
  vi.restoreAllMocks();
  for (const repo of repos.splice(0)) rmSync(repo, { recursive: true, force: true });
});

function writeEvent(
  repo: string,
  event: { ts: string; type: string; task: string; by: string; msg: string; meta?: object },
): void {
  const stamp = event.ts.replace(/[-:]/g, "");
  writeFileSync(
    join(repo, EVENTS_REL, `${stamp}_${event.by}_${event.task}_${event.type}.json`),
    `${JSON.stringify({
      v: 1,
      ts: event.ts,
      type: event.type,
      task_id: event.task,
      by: event.by,
      msg: event.msg,
      ...(event.meta ? { meta: event.meta } : {}),
    })}\n`,
    "utf8",
  );
}

function setupNightRepository(): string {
  const repo = mkdtempSync(join(tmpdir(), "specdojo-watch-remedy-"));
  repos.push(repo);
  mkdirSync(join(repo, ".specdojo"), { recursive: true });
  mkdirSync(join(repo, "schedule"), { recursive: true });
  mkdirSync(join(repo, EVENTS_REL), { recursive: true });
  mkdirSync(join(repo, TIMEOUT_RUN_REL), { recursive: true });
  writeFileSync(
    join(repo, ".specdojo", "specdojo.config.json"),
    `${JSON.stringify({
      version: 1,
      current_project: "test",
      projects: { test: { schedule_path: "schedule", execution_path: "execution" } },
    })}\n`,
    "utf8",
  );
  writeFileSync(
    join(repo, ".specdojo", "exec-defaults.yaml"),
    [
      "watch:",
      "  remedies:",
      "    usage_limit: { action: wait }",
      "    load_timeout: { action: rerun }",
      "  max_attempts: 1",
      "",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(
    join(repo, "schedule", "sch-track-night.yaml"),
    [
      "kind: track",
      "id: test:sch-track-night",
      "type: project",
      "status: draft",
      "version: 1",
      "project_id: test",
      "track: night",
      "tasks:",
      ...[
        ["dct-index", "040"],
        ["cnd-specdojo", "070"],
      ].flatMap(([localId, suffix]) => [
        `  - local_id: ${localId}`,
        `    phase_suffix: "${suffix}"`,
        `    name: ${localId}`,
        "    duration_days: 1",
        "    depends_on: []",
        "    owner: DEV",
      ]),
      "",
    ].join("\n"),
    "utf8",
  );

  // codex の週の上限。解除の時刻が過ぎた延期（block の meta は runner が書く形のまま）。
  writeEvent(repo, {
    ts: "2026-11-13T14:00:00Z",
    type: "claim",
    task: LIMIT_TASK,
    by: "sol-executor",
    msg: "claim",
  });
  writeEvent(repo, {
    ts: "2026-11-13T14:23:56Z",
    type: "block",
    task: LIMIT_TASK,
    by: "sol-executor",
    msg: "quota_exhausted reached; resume_at=2026-11-13T14:37:00.000Z",
    meta: {
      limit_deferred: "true",
      limit_retryable: "true",
      limit_auto_resume: "true",
      limit_kind: "quota_exhausted",
      limit_provider: "codex",
      limit_resume_at: "2026-11-13T14:37:00.000Z",
      limit_attempts: "1",
    },
  });

  // agent 4 本と重なった負荷で、test-unit の 5 秒の制限が切れた親の検証の失敗。
  writeEvent(repo, {
    ts: "2026-11-13T16:00:00Z",
    type: "claim",
    task: TIMEOUT_TASK,
    by: "sol-executor",
    msg: "claim",
  });
  writeEvent(repo, {
    ts: "2026-11-13T16:14:18Z",
    type: "block",
    task: TIMEOUT_TASK,
    by: "sol-executor",
    msg: "parent validation failed: test-unit",
    meta: {
      limit_deferred: "false",
      pipeline_stage: "reporter",
      pipeline_state_ref: join(TIMEOUT_RUN_REL, "pipeline-state.json"),
      evidence_ref: join(TIMEOUT_RUN_REL, "evidence.json"),
    },
  });
  writeFileSync(
    join(repo, TIMEOUT_RUN_REL, "parent-validation-attempt-1-test-unit.log"),
    [
      "parent validation: test-unit",
      "exit code: 1",
      "timed out: no",
      " FAIL  tests/src/register/approach.test.ts > validateRegisterApproachTargets",
      "Error: Test timed out in 5000ms.",
      "",
    ].join("\n"),
    "utf8",
  );

  // 手当てとして起動される偽の specdojo。起動された引数を 1 行でログへ書く。
  const fake = join(repo, "fake-specdojo.mjs");
  writeFileSync(fake, 'process.stdout.write(process.argv.slice(2).join(" ") + "\\n");\n', "utf8");
  process.argv[1] = fake;
  return repo;
}

async function watchScan(): Promise<string> {
  for (const key of ENV_KEYS) delete process.env[key];
  const stdout: string[] = [];
  vi.spyOn(process.stdout, "write").mockImplementation((chunk: string | Uint8Array) => {
    stdout.push(typeof chunk === "string" ? chunk : Buffer.from(chunk).toString("utf8"));
    return true;
  });
  vi.spyOn(process.stderr, "write").mockImplementation(() => true);
  const program = new Command();
  program.exitOverride();
  registerWatchScanCommand(program.command("orchestrator"));
  await program.parseAsync(["node", "specdojo", "orchestrator", "watch-scan", "--project", "test"]);
  vi.restoreAllMocks();
  return stdout.join("");
}

async function waitForContent(path: string): Promise<string> {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (existsSync(path)) {
      const text = readFileSync(path, "utf8");
      if (text.endsWith("\n")) return text;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`remedy log was not written: ${path}`);
}

// 手当ての子が動いている間は、見張りがその対象を「動いているプロセス」として触らない（PJR-T4E0）。
// 次の見張りの前に、偽の specdojo が終わるのを待つ。
async function waitForRemedyExit(id: string): Promise<void> {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (!findTargetProcess(listProcesses(), id)) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`remedy process for ${id} did not exit`);
}

type LogLine = { event: string; target: { id: string }; log?: string; action?: string };

function watchLog(repo: string): LogLine[] {
  return readFileSync(join(repo, "execution", "watch", "watch-events.jsonl"), "utf8")
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line) as LogLine);
}

describe("orchestrator watch-scan remedies with the 2026-11-13 to 14 night", () => {
  it("resumes the due limit, reruns the timed-out checks, then stops at max_attempts", async () => {
    const repo = setupNightRepository();
    process.chdir(repo);

    await watchScan();
    const first = watchLog(repo).filter((line) => line.event === "remedy");
    expect(first.map((line) => [line.target.id, line.action])).toEqual([
      [LIMIT_TASK, "resume_due"],
    ]);
    expect(await waitForContent(join(repo, first[0]!.log!))).toBe(
      `exec resume --project test --task ${LIMIT_TASK} --if-busy skip --due\n`,
    );
    const notes = readdirSync(join(repo, EVENTS_REL)).filter((name) =>
      name.includes(`_watch-scan_${LIMIT_TASK}_note_`),
    );
    expect(notes).toHaveLength(1);
    await waitForRemedyExit(LIMIT_TASK);

    await watchScan();
    const second = watchLog(repo).filter((line) => line.event === "remedy");
    expect(second.map((line) => [line.target.id, line.action])).toEqual([
      [LIMIT_TASK, "resume_due"],
      [TIMEOUT_TASK, "rerun_checks"],
    ]);
    expect(await waitForContent(join(repo, second[1]!.log!))).toBe(
      `exec resume --project test --task ${TIMEOUT_TASK} --if-busy skip\n`,
    );
    await waitForRemedyExit(TIMEOUT_TASK);

    // 偽の再開は直さないため、どちらも止まったまま。上限は 2 回目、時間切れは 3 回目の見張りで
    // 回数の上限に達し、それぞれ 1 度だけ止める。
    const thirdOutput = await watchScan();
    await watchScan();
    const stopped = watchLog(repo).filter((line) => line.event === "remedy_stopped");
    expect(stopped.map((line) => line.target.id)).toEqual([LIMIT_TASK, TIMEOUT_TASK]);
    expect(thirdOutput).toContain(`remedy stopped ${TIMEOUT_TASK}`);
    expect(watchLog(repo).filter((line) => line.event === "remedy")).toHaveLength(2);

    const reports = readdirSync(join(repo, "execution", "reports", "watch-scan"));
    const report = readFileSync(
      join(repo, "execution", "reports", "watch-scan", reports[0]!),
      "utf8",
    );
    expect(report).toContain("## 4. 手当て");
    expect(report).toContain("（`resume_due`、1/1 回目）");
    expect(report).toContain("手当てを止めた（1 回まで手を打ったが止まったまま）");
  });
});
