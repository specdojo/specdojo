import { describe, expect, it } from "vitest";
import {
  isExecBusySkipOutput,
  isRoutineEntryDue,
  ROUTINE_BUSY_RETRY_LIMIT,
  settleRoutineSkip,
  type RoutineDoc,
  type RoutineStateEntry,
} from "../../../src/routine/routine.js";
import { formatRoutineStatus } from "../../../src/routine/status.js";

const intervalDoc: RoutineDoc = {
  id: "rtn-interval",
  interval: "1d",
  action: { kind: "job", job: "job-test" },
};

function cronDoc(missedRun?: "skip" | "latest" | "all"): RoutineDoc {
  return {
    id: "rtn-cron",
    trigger: { cron: "0 9 * * *", timezone: "UTC" },
    ...(missedRun ? { policy: { missed_run: missedRun } } : {}),
    action: { kind: "job", job: "job-test" },
  };
}

const previous: RoutineStateEntry = {
  last_run: "2026-11-15T09:00:05Z",
  last_result: "success",
  last_scheduled_for: "2026-11-15T09:00:00.000Z",
};

const completedSkip: RoutineStateEntry = {
  last_run: "2026-11-16T09:00:05Z",
  last_result: "skipped",
  last_scheduled_for: "2026-11-16T09:00:00.000Z",
};

describe("isExecBusySkipOutput", () => {
  it("exec run / resume の busy skip 出力を検出する", () => {
    expect(isExecBusySkipOutput("Preparing...\n[run] skipped: exec busy\n")).toBe(true);
    expect(isExecBusySkipOutput("[resume] skipped: exec busy\n")).toBe(true);
  });

  it("Job の前提条件による skip は busy としない", () => {
    expect(isExecBusySkipOutput("Job skipped: job-test (no targets)\n")).toBe(false);
  });
});

describe("settleRoutineSkip", () => {
  it("cron の busy skip は last_scheduled_for を開始前の値へ戻し、流し直し待ちにする", () => {
    const settled = settleRoutineSkip(cronDoc("latest"), previous, completedSkip, "skipped", true);

    expect(settled).toEqual({
      entry: {
        ...completedSkip,
        last_scheduled_for: "2026-11-15T09:00:00.000Z",
        last_skip_reason: "busy",
        busy_skip_count: 1,
      },
      skipReason: "busy",
      retryPending: true,
    });
  });

  it("初回の cron の busy skip は last_scheduled_for を消して直近の回を due に残す", () => {
    const settled = settleRoutineSkip(cronDoc("all"), undefined, completedSkip, "skipped", true);

    expect(settled.entry.last_scheduled_for).toBeUndefined();
    expect(settled.retryPending).toBe(true);
  });

  it("missed_run が skip の cron は busy skip でも済んだ回として扱う", () => {
    const settled = settleRoutineSkip(cronDoc("skip"), previous, completedSkip, "skipped", true);

    expect(settled.entry.last_scheduled_for).toBe("2026-11-16T09:00:00.000Z");
    expect(settled.entry.busy_skip_count).toBeUndefined();
    expect(settled).toMatchObject({ skipReason: "busy", retryPending: false });
  });

  it("前提条件による skip は済んだ回として扱い、内訳を precondition にする", () => {
    const settled = settleRoutineSkip(cronDoc("latest"), previous, completedSkip, "skipped", false);

    expect(settled.entry).toEqual({ ...completedSkip, last_skip_reason: "precondition" });
    expect(settled.retryPending).toBe(false);
  });

  it("失敗の回は流し直さず、続いていた busy skip の数を消す", () => {
    const settled = settleRoutineSkip(
      intervalDoc,
      { ...previous, busy_skip_count: 3, last_skip_reason: "busy" },
      { last_run: "2026-11-16T09:00:05Z", last_result: "failure", busy_skip_count: 3 },
      "failure",
      false,
    );

    expect(settled.entry).toEqual({ last_run: "2026-11-16T09:00:05Z", last_result: "failure" });
    expect(settled.retryPending).toBe(false);
  });

  it("busy skip が上限を超えたら済んだ回として扱い、理由を last_reason に残す", () => {
    const settled = settleRoutineSkip(
      intervalDoc,
      { last_run: "2026-11-16T08:00:05Z", busy_skip_count: ROUTINE_BUSY_RETRY_LIMIT },
      { last_run: "2026-11-16T09:00:05Z", last_result: "skipped", last_reason: "exec busy" },
      "skipped",
      true,
    );

    expect(settled.retryPending).toBe(false);
    expect(settled.entry.busy_skip_count).toBeUndefined();
    expect(settled.entry.last_reason).toBe(
      `exec busy; busy skip retry limit (${ROUTINE_BUSY_RETRY_LIMIT}) reached; occurrence not retried`,
    );
  });
});

describe("isRoutineEntryDue", () => {
  const now = new Date("2026-11-16T10:00:00Z");

  it("busy skip の流し直し待ちの interval routine は interval の経過前でも due にする", () => {
    const entry = { last_run: "2026-11-16T09:00:05Z", busy_skip_count: 1 };

    expect(isRoutineEntryDue(intervalDoc, entry, now)).toBe(true);
    expect(isRoutineEntryDue(intervalDoc, { last_run: entry.last_run }, now)).toBe(false);
  });

  it("cron routine は last_scheduled_for から due を判定する", () => {
    expect(
      isRoutineEntryDue(
        cronDoc("latest"),
        { last_scheduled_for: previous.last_scheduled_for },
        now,
      ),
    ).toBe(true);
    expect(
      isRoutineEntryDue(cronDoc("latest"), { last_scheduled_for: "2026-11-16T09:00:00.000Z" }, now),
    ).toBe(false);
  });
});

describe("formatRoutineStatus", () => {
  it("busy skip の数と、履歴の skip の内訳・流し直し待ちを表示する", () => {
    const lines = formatRoutineStatus(
      cronDoc("latest"),
      {
        last_run: "2026-11-16T09:00:05Z",
        last_result: "skipped",
        last_skip_reason: "busy",
        last_scheduled_for: "2026-11-15T09:00:00.000Z",
        busy_skip_count: 2,
      },
      [
        {
          version: 1,
          routine_id: "rtn-other",
          scheduled_for: "2026-11-16T09:00:00.000Z",
          started_at: "2026-11-16T09:00:01Z",
          completed_at: "2026-11-16T09:00:02Z",
          result: "success",
          job_run_ids: [],
        },
        {
          version: 1,
          routine_id: "rtn-cron",
          scheduled_for: "2026-11-16T09:00:00.000Z",
          started_at: "2026-11-16T09:00:05Z",
          completed_at: "2026-11-16T09:00:06Z",
          result: "skipped",
          job_run_ids: [],
          skip_reason: "busy",
          retry_pending: true,
        },
      ],
      new Date("2026-11-16T10:00:00Z"),
      5,
    );

    expect(lines).toEqual([
      "rtn-cron",
      "  schedule:     cron 0 9 * * * (UTC)  missed_run=latest",
      "  enabled:      yes",
      "  due:          due",
      "  last run:     2026-11-16T09:00:05Z (skipped, busy)",
      "  scheduled to: 2026-11-15T09:00:00.000Z",
      "  busy skips:   2 (retried on the next routine run --due)",
      "  recent runs:",
      "    2026-11-16T09:00:05Z  scheduled_for=2026-11-16T09:00:00.000Z  skipped (busy, retry pending)",
    ]);
  });
});
