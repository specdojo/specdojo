import { Command } from "commander";
import { createHash } from "node:crypto";
import {
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
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerWatchScanCommand } from "../../../src/commands/watch-scan.js";
import { runWatchDiagnosis, diagnosisNight } from "../../../src/exec/watch-diagnosis.js";
import { type WatchScanOutcome, type WatchStalledLine } from "../../../src/exec/watch-scan.js";
import type { ExecDefaultsConfig } from "../../../src/exec/agent-config.js";
import type { MemberRoster } from "../../../src/shared/specdojo-config.js";
import { releaseLock, tryAcquireLock } from "../../../src/shared/cross-process-lock.js";

const originalCwd = process.cwd();
const repos: string[] = [];
const keys = ["SPECDOJO_PROJECT", "SPECDOJO_SCHEDULE_PATH", "SPECDOJO_EXECUTION_PATH"];
const originalEnv = keys.map((key) => process.env[key]);
afterEach(() => {
  process.chdir(originalCwd);
  keys.forEach((key, index) => {
    if (originalEnv[index] === undefined) delete process.env[key];
    else process.env[key] = originalEnv[index];
  });
  process.exitCode = undefined;
  vi.restoreAllMocks();
  for (const repo of repos.splice(0)) rmSync(repo, { recursive: true, force: true });
});

function setup(
  script = 'process.stdout.write("診断: 検査の設定を確認する案。次の手: 人が差分を確認。\\n" + JSON.stringify({args: process.argv.slice(2), prompt}));',
) {
  const root = mkdtempSync(join(tmpdir(), "watch-diagnosis-"));
  repos.push(root);
  for (const dir of [
    ".specdojo",
    "schedule",
    "execution/exec/events",
    "execution/reports/watch-scan",
  ])
    mkdirSync(join(root, dir), { recursive: true });
  writeFileSync(
    join(root, "fake-agent.mjs"),
    `let prompt = ''; for await (const chunk of process.stdin) prompt += chunk; ${script}\n`,
  );
  writeFileSync(join(root, "playbook.md"), "# 運用メモ\n統合の前に人が判断する。\n");
  const member = {
    nickname: "diagnoser",
    type: "agent" as const,
    provider: "custom" as const,
    mode: "review" as const,
    display_name: "Diagnoser",
    email: null,
    roles: ["DEV"],
  };
  const roster: MemberRoster = { version: 1, members: [member] };
  const config: ExecDefaultsConfig = {
    watch: { diagnosis: { by: member.nickname, max_per_night: 1, timeout_seconds: 5 } },
    providers: {
      custom: { command_template: `node "${join(root, "fake-agent.mjs")}" {nickname} {mode}` },
    },
  };
  const stall: WatchStalledLine = {
    v: 1,
    ts: "2026-11-27T13:00:00Z",
    event: "stalled",
    key: "schedule-task:T-NIGHT-check-010:blocked:2026-11-27T12:00:00Z",
    target: { kind: "schedule-task", id: "T-NIGHT-check-010" },
    state: "blocked",
    since: "2026-11-27T12:00:00Z",
    category: "needs_decision",
    detail: "validation_failure",
    basis: { source: "event.json", excerpt: "parent validation failed: typecheck" },
    next_action: "失敗した検査を読む",
    by: "watch-scan",
  };
  const reportPath = join(root, "execution/reports/watch-scan/report.md");
  writeFileSync(reportPath, "# 朝報告\n\n見張りの結果\n");
  const outcome: WatchScanOutcome = {
    current: [stall],
    held: [],
    appended: [],
    warnings: [],
    logPath: join(root, "execution/watch/watch-events.jsonl"),
    reportPath,
    remedy: { stopped: [], waiting: [], deferredByLock: false },
  };
  const input = {
    outcome,
    config,
    roster,
    executionPath: join(root, "execution"),
    root,
    playbookPath: join(root, "playbook.md"),
    now: new Date("2026-11-27T13:00:00Z"),
    timeZone: "Asia/Tokyo",
    dryRun: false,
    enabled: true,
  };
  return { root, config, roster, input, stall, reportPath };
}

function records(root: string) {
  return readdirSync(join(root, "execution/watch/diagnoses"))
    .filter((file) => file.endsWith(".json"))
    .map(
      (file) =>
        JSON.parse(readFileSync(join(root, "execution/watch/diagnoses", file), "utf8")) as {
          status: string;
          proposal: string;
          night: string;
        },
    );
}

function seedRecord(
  input: ReturnType<typeof setup>["input"],
  status: "running" | "interrupted" | "proposed",
  retry = false,
): string {
  const stall = input.outcome.current[0]!;
  const directory = join(input.executionPath, "watch/diagnoses");
  mkdirSync(directory, { recursive: true });
  const path = join(
    directory,
    `${createHash("sha256").update(stall.key).digest("hex")}${retry ? ".retry" : ""}.json`,
  );
  // 所有者などの新しいメタデータを持たない既存形式の記録も回復する。
  writeFileSync(
    path,
    JSON.stringify({
      key: stall.key,
      target: stall.target,
      night: diagnosisNight(input.now, input.timeZone),
      by: "diagnoser",
      started_at: input.now.toISOString(),
      status,
      proposal: status === "proposed" ? "保存済みの診断案" : "診断中",
    }),
  );
  return path;
}

describe("headless watch diagnosis", () => {
  it("recovers an abandoned legacy reservation, counts it against the night limit, and retries once on a later night", async () => {
    const { input, root, reportPath } = setup();
    const original = seedRecord(input, "running");
    // コンテナ再起動後に残る、心拍の途絶えたロック。
    const lockPath = join(input.executionPath, "watch/diagnoses/.launch-lock");
    mkdirSync(lockPath);
    const stale = new Date(Date.now() - 60_000);
    utimesSync(lockPath, stale, stale);

    await runWatchDiagnosis({ ...input, enabled: false });
    expect(records(root)).toHaveLength(1);
    expect(JSON.parse(readFileSync(original, "utf8"))).toMatchObject({ status: "interrupted" });
    expect(readFileSync(reportPath, "utf8")).toContain("`interrupted`");
    await runWatchDiagnosis(input);
    expect(records(root)).toHaveLength(1);
    expect(readFileSync(reportPath, "utf8")).toContain("診断上限");

    input.now = new Date("2026-11-28T13:00:00Z");
    await Promise.all([runWatchDiagnosis(input), runWatchDiagnosis(input)]);
    expect(records(root)).toHaveLength(2);
    expect(
      records(root)
        .map((record) => record.status)
        .sort(),
    ).toEqual(["interrupted", "proposed"]);
    expect(
      records(root)
        .map((record) => record.night)
        .sort(),
    ).toEqual(["2026-11-27", "2026-11-28"]);
    expect(JSON.parse(readFileSync(original, "utf8"))).toMatchObject({ status: "interrupted" });
    input.now = new Date("2026-11-29T13:00:00Z");
    await runWatchDiagnosis(input);
    expect(records(root)).toHaveLength(2);
  });

  it("counts a retry in the same night and does not launch another stall over the limit", async () => {
    const { input, root, stall, reportPath } = setup();
    seedRecord(input, "running");
    input.config.watch!.diagnosis!.max_per_night = 2;
    await runWatchDiagnosis(input);
    expect(records(root)).toHaveLength(2);
    expect(
      records(root)
        .map((record) => record.status)
        .sort(),
    ).toEqual(["interrupted", "proposed"]);
    input.outcome.current = [{ ...stall, key: `${stall.key}-new` }];
    await runWatchDiagnosis(input);
    expect(records(root)).toHaveLength(2);
    expect(readFileSync(reportPath, "utf8")).toContain("診断上限");
  });

  it("does not retry again after the retry itself was interrupted, including on later nights", async () => {
    const { input, root } = setup();
    seedRecord(input, "interrupted");
    seedRecord(input, "running", true);
    input.config.watch!.diagnosis!.max_per_night = 10;
    await runWatchDiagnosis(input);
    expect(records(root).map((record) => record.status)).toEqual(["interrupted", "interrupted"]);
    input.now = new Date("2026-11-28T13:00:00Z");
    await runWatchDiagnosis(input);
    expect(records(root)).toHaveLength(2);
  });

  it("keeps a live reservation running and includes saved proposals when the launch lock is busy", async () => {
    const { input, root, reportPath, stall } = setup();
    seedRecord(input, "running");
    seedRecord(
      { ...input, outcome: { ...input.outcome, current: [{ ...stall, key: "past" }] } },
      "proposed",
    );
    const lock = tryAcquireLock(join(input.executionPath, "watch/diagnoses/.launch-lock"), {
      actor: "test-diagnosis",
    });
    expect(lock).not.toBeNull();
    try {
      await runWatchDiagnosis(input);
      expect(
        records(root)
          .map((record) => record.status)
          .sort(),
      ).toEqual(["proposed", "running"]);
      expect(readFileSync(reportPath, "utf8")).toContain("保存済みの診断案");
    } finally {
      if (lock) releaseLock(lock);
    }
  });

  it("publishes saved proposals and the reservation before starting the agent", async () => {
    const { input, root, stall, reportPath } = setup(`
      const fs = await import('node:fs');
      const report = fs.readFileSync('execution/reports/watch-scan/report.md', 'utf8');
      if (!report.includes('保存済みの診断案') || !report.includes('\x60running\x60')) process.exit(1);
      process.stdout.write('起動前の報告を確認した');
    `);
    seedRecord(
      { ...input, outcome: { ...input.outcome, current: [{ ...stall, key: "past" }] } },
      "proposed",
    );
    input.config.watch!.diagnosis!.max_per_night = 3;
    await runWatchDiagnosis(input);
    expect(records(root).every((record) => record.status === "proposed")).toBe(true);
    expect(readFileSync(reportPath, "utf8")).toContain("起動前の報告を確認した");
  });

  it("launches through the CLI with roster/template, passes playbook and reason, and only writes watch/report files", async () => {
    const { root } = setup();
    writeFileSync(
      join(root, ".specdojo/specdojo.config.json"),
      JSON.stringify({
        version: 1,
        current_project: "test",
        projects: {
          test: {
            base_path: ".",
            schedule_path: "schedule",
            execution_path: "execution",
            playbook_path: "playbook.md",
          },
        },
      }),
    );
    writeFileSync(
      join(root, ".specdojo/agent-members.yaml"),
      "version: 1\nmembers:\n  - nickname: diagnoser\n    display_name: Diagnoser\n    type: agent\n    provider: custom\n    mode: review\n    roles: [DEV]\n    capabilities: []\n    proficiency: normal\n    priority: 1\n",
    );
    writeFileSync(
      join(root, ".specdojo/exec-defaults.yaml"),
      `watch:\n  diagnosis: { by: diagnoser, timeout_seconds: 5 }\nproviders:\n  custom:\n    command_template: 'node "${join(root, "fake-agent.mjs")}" {nickname} {mode}'\n`,
    );
    writeFileSync(
      join(root, "schedule/sch-track-night.yaml"),
      'kind: track\nid: test:sch-track-night\ntype: project\nstatus: draft\nversion: 1\nproject_id: test\ntrack: night\ntasks:\n  - local_id: check\n    phase_suffix: "010"\n    name: Check\n    duration_days: 1\n    depends_on: []\n    owner: DEV\n',
    );
    for (const [type, ts, msg] of [
      ["claim", "2026-11-27T12:00:00Z", "claim"],
      ["block", "2026-11-27T12:01:00Z", "parent validation failed: typecheck"],
    ])
      writeFileSync(
        join(root, `execution/exec/events/${type}.json`),
        JSON.stringify({ v: 1, ts, type, task_id: "T-NIGHT-check-010", by: "executor", msg }),
      );
    const before = [
      ".specdojo/specdojo.config.json",
      ".specdojo/agent-members.yaml",
      ".specdojo/exec-defaults.yaml",
      "schedule/sch-track-night.yaml",
      "execution/exec/events/block.json",
      "execution/exec/events/claim.json",
    ].map((file) => [file, readFileSync(join(root, file), "utf8")] as const);
    process.chdir(root);
    for (const key of keys) delete process.env[key];
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    const scan = async (flags: string[] = []) => {
      const program = new Command();
      registerWatchScanCommand(program.command("orchestrator"));
      await program.parseAsync([
        "node",
        "specdojo",
        "orchestrator",
        "watch-scan",
        "--project",
        "test",
        ...flags,
      ]);
    };
    await scan(["--dry-run"]);
    expect(readdirSync(join(root, "execution"))).not.toContain("watch");
    await scan(["--no-diagnosis"]);
    expect(records(root)).toHaveLength(0);
    await scan();
    expect(process.exitCode).toBeUndefined();
    const [record] = records(root);
    expect(record?.status).toBe("proposed");
    expect(record?.proposal).toContain('"args":["diagnoser","review"]');
    expect(record?.proposal).toContain("運用メモ");
    expect(record?.proposal).toContain("parent validation failed: typecheck");
    expect(record?.proposal).toContain(
      "claim・再開・release・commit・設定変更・登録簿の記帳は禁止",
    );
    await scan();
    expect(records(root)).toHaveLength(1);
    const report = readdirSync(join(root, "execution/reports/watch-scan")).find((file) =>
      file.startsWith("watch-scan-"),
    )!;
    expect(readFileSync(join(root, "execution/reports/watch-scan", report), "utf8")).toContain(
      "診断: 検査の設定を確認する案",
    );
    for (const [file, content] of before)
      expect(readFileSync(join(root, file), "utf8")).toBe(content);
    expect(readdirSync(join(root, "execution/exec/events"))).toHaveLength(2);
  });

  it("limits the whole night across midnight and never retries the same stall on a later night", async () => {
    const { input, root, reportPath, stall } = setup();
    await runWatchDiagnosis(input);
    input.now = new Date("2026-11-27T16:00:00Z"); // 翌日の午前 1 時
    input.outcome.current = [{ ...stall, key: `${stall.key}-new` }];
    await runWatchDiagnosis(input);
    expect(records(root)).toHaveLength(1);
    expect(readFileSync(reportPath, "utf8")).toContain("診断上限");
    input.now = new Date("2026-11-28T13:00:00Z");
    input.outcome.current = [stall];
    await runWatchDiagnosis(input);
    expect(records(root)).toHaveLength(1);
    input.outcome.current = [{ ...stall, key: `${stall.key}-new` }];
    await runWatchDiagnosis(input);
    expect(records(root)).toHaveLength(2);
  });

  it.each(["failed", "timeout"])(
    "records %s without interrupting the morning report or retrying",
    async (status) => {
      const { input, root, reportPath } = setup(
        status === "failed"
          ? 'process.stderr.write("fake error"); process.exitCode = 1;'
          : "setInterval(() => undefined, 1000);",
      );
      input.config.watch!.diagnosis!.timeout_seconds = 1;
      await runWatchDiagnosis(input);
      expect(records(root)[0]?.status).toBe(status);
      expect(readFileSync(reportPath, "utf8")).toContain("見張りの結果");
      await runWatchDiagnosis(input);
      expect(records(root)).toHaveLength(1);
    },
  );

  it("reserves a stall before launching when scans overlap", async () => {
    const { input, root } = setup();
    await Promise.all([runWatchDiagnosis(input), runWatchDiagnosis(input)]);
    expect(records(root)).toHaveLength(1);
    expect(records(root)[0]?.status).toBe("proposed");
  });

  it.each([
    "disabled",
    "other-category",
    "held",
    "paused",
    "dry-run",
    "edit-member",
    "missing-playbook",
    "bad-config",
  ])("does not launch for %s", async (kind) => {
    const { input, root } = setup();
    if (kind === "disabled") input.config.watch = {};
    if (kind === "other-category") input.outcome.current[0]!.category = "unknown";
    if (kind === "held") input.outcome.current = [];
    if (kind === "paused") input.outcome.skipped = { reason: "paused", detail: "user paused" };
    if (kind === "dry-run") input.dryRun = true;
    if (kind === "edit-member") input.roster.members[0]!.mode = "edit";
    if (kind === "missing-playbook") input.playbookPath = join(root, "absent.md");
    if (kind === "bad-config") input.config.watch!.diagnosis!.timeout_seconds = 0;
    vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    await expect(runWatchDiagnosis(input)).resolves.toBeUndefined();
    if (kind !== "dry-run" && kind !== "paused") expect(records(root)).toHaveLength(0);
  });

  it("uses the project's local noon boundary", () => {
    expect(diagnosisNight(new Date("2026-11-27T02:59:59Z"), "Asia/Tokyo")).toBe("2026-11-26");
    expect(diagnosisNight(new Date("2026-11-27T03:00:00Z"), "Asia/Tokyo")).toBe("2026-11-27");
  });
});
