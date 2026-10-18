import { describe, expect, it } from "vitest";
import {
  decidePinnedWait,
  limitEventMeta,
  normalizeAgentLimit,
  selectDueDeferredLimitTasks,
} from "../../../src/exec/limit.js";
import type { StateSnapshot } from "../../../src/exec/types.js";

describe("normalizeAgentLimit", () => {
  const observedAt = new Date("2026-07-25T20:00:00.000Z");

  it("Claude Code の session limit と翌日の UTC reset 時刻を保持する", () => {
    const actual = normalizeAgentLimit({
      provider: "claude",
      output: "You've hit your session limit · resets 4:10am (UTC)",
      observedAt,
    });

    expect(actual).toMatchObject({
      kind: "session_limit",
      retryable: true,
      auto_resume: true,
      resume_at: "2026-07-26T04:10:00.000Z",
      resume_source: "provider_reset",
    });
  });

  it("Codex の retry-after を絶対時刻へ変換する", () => {
    const actual = normalizeAgentLimit({
      provider: "codex",
      output: "429 Too Many Requests; retry-after: 120",
      observedAt,
    });

    expect(actual).toMatchObject({
      kind: "rate_limit",
      retryable: true,
      auto_resume: true,
      resume_at: "2026-07-25T20:02:00.000Z",
      resume_source: "retry_after",
    });
  });

  it("timezone を省略した try again at をローカル時刻として読む", () => {
    const localObservedAt = new Date(2026, 6, 25, 1, 0, 0);
    const actual = normalizeAgentLimit({
      provider: "codex",
      output: "You've hit your usage limit. Try again at 1:29 AM",
      observedAt: localObservedAt,
    });
    const resumeAt = new Date(actual.resume_at ?? "invalid");

    expect(actual.resume_source).toBe("provider_reset");
    expect(resumeAt.getHours()).toBe(1);
    expect(resumeAt.getMinutes()).toBe(29);
    expect(resumeAt.getTime()).toBeGreaterThan(localObservedAt.getTime());
  });

  it("時刻不明では推定せず、明示 cooldown がある場合だけ再開時刻を設定する", () => {
    const unknown = normalizeAgentLimit({
      provider: "codex",
      output: "rate limit reached",
      observedAt,
    });
    expect(unknown.auto_resume).toBe(false);
    expect(unknown.resume_at).toBeUndefined();

    const configured = normalizeAgentLimit({
      provider: "codex",
      output: "rate limit reached",
      observedAt,
      cooldownSeconds: { rate_limit: 300 },
    });
    expect(configured).toMatchObject({
      auto_resume: true,
      resume_at: "2026-07-25T20:05:00.000Z",
      resume_source: "cooldown_policy",
    });
  });

  it("週次 quota exhausted は cooldown があっても自動再開しない", () => {
    const actual = normalizeAgentLimit({
      provider: "codex",
      output: "weekly limit reached; resets tomorrow",
      observedAt,
      cooldownSeconds: { rate_limit: 300 },
    });

    expect(actual).toMatchObject({
      kind: "quota_exhausted",
      retryable: false,
      auto_resume: false,
    });
    expect(actual.resume_at).toBeUndefined();
  });
});

describe("selectDueDeferredLimitTasks", () => {
  const signal = normalizeAgentLimit({
    provider: "claude",
    output: "You've hit your session limit · resets 4:10am (UTC)",
    observedAt: new Date("2026-07-25T20:00:00.000Z"),
  });
  const dueMeta = limitEventMeta(signal, {
    attempts: 3,
    worktree: "/tmp/worktrees/task-a",
  });

  const snapshot: StateSnapshot = {
    schedule_path: "schedule",
    tasks: {
      DUE: { state: "blocked", last_by: "claude-edit-agent", meta: dueMeta },
      EARLY: {
        state: "blocked",
        last_by: "claude-edit-agent",
        meta: { ...dueMeta, limit_resume_at: "2026-07-26T06:00:00.000Z" },
      },
      NORMAL_BLOCK: {
        state: "blocked",
        last_by: "codex-edit-agent",
        meta: { limit_deferred: "false" },
      },
      QUOTA: {
        state: "blocked",
        last_by: "codex-edit-agent",
        meta: {
          ...dueMeta,
          limit_retryable: "false",
          limit_kind: "quota_exhausted",
        },
      },
      ALREADY_RESUMING: {
        state: "doing",
        last_by: "claude-edit-agent",
        meta: dueMeta,
      },
    },
  };

  it("due かつ retryable な blocked task だけを抽出する", () => {
    const actual = selectDueDeferredLimitTasks(snapshot, new Date("2026-07-26T04:10:00.000Z"));

    expect(actual).toEqual([
      {
        taskId: "DUE",
        actor: "claude-edit-agent",
        provider: "claude",
        kind: "session_limit",
        resumeAt: "2026-07-26T04:10:00.000Z",
        attempts: 3,
        worktree: "/tmp/worktrees/task-a",
      },
    ]);
  });
});

describe("normalizeAgentLimit の解除時刻（PJR-NJ6J）", () => {
  const codexNotice =
    "ERROR: You’ve hit your usage limit. Upgrade to Pro (https://chatgpt.com/explore/pro), " +
    "visit https://chatgpt.com/settings/usage to purchase more credits or try again at 11:17 PM.";

  it("transcript に先に現れた reset 時刻の例ではなく、末尾の codex の通知から解除時刻を読む", () => {
    // 2026-10-18 19:03:45（ローカル時刻）に止まった PJR-8TGQ の実行を再現する。
    const observedAt = new Date(2026, 9, 18, 19, 3, 45);
    const output = [
      "exec",
      "/bin/bash -lc 'sed -n 1,200p .specdojo/exec-defaults.yaml'",
      '    #   "You\'ve hit your session limit · resets 4:10am (UTC)"',
      codexNotice,
      codexNotice,
      "tokens used",
      "240,441",
    ].join("\n");

    const actual = normalizeAgentLimit({ provider: "codex", output, observedAt });

    expect(actual).toMatchObject({
      kind: "quota_exhausted",
      auto_resume: true,
      resume_at: new Date(2026, 9, 18, 23, 17, 0).toISOString(),
      resume_source: "provider_reset",
      raw_message: codexNotice,
    });
  });

  it("23 時台に午前 1 時の解除を受けたら翌日の 1 時にする", () => {
    const observedAt = new Date(2026, 9, 18, 23, 30, 0);

    const actual = normalizeAgentLimit({
      provider: "codex",
      output: "You've hit your usage limit. Try again at 1:05 AM.",
      observedAt,
    });

    expect(actual.resume_at).toBe(new Date(2026, 9, 19, 1, 5, 0).toISOString());
  });

  it("12:15 AM を真夜中の 0 時 15 分として翌日に繰り越す", () => {
    const observedAt = new Date(2026, 9, 18, 23, 0, 0);

    const actual = normalizeAgentLimit({
      provider: "codex",
      output: "You've hit your usage limit. Try again at 12:15 AM.",
      observedAt,
    });

    expect(actual.resume_at).toBe(new Date(2026, 9, 19, 0, 15, 0).toISOString());
  });

  it("12:15 PM を正午の 12 時 15 分として同じ日にする", () => {
    const observedAt = new Date(2026, 9, 18, 11, 0, 0);

    const actual = normalizeAgentLimit({
      provider: "codex",
      output: "You've hit your usage limit. Try again at 12:15 PM.",
      observedAt,
    });

    expect(actual.resume_at).toBe(new Date(2026, 9, 18, 12, 15, 0).toISOString());
  });

  it("agy の相対の Resets in を観測時刻からの経過で読む", () => {
    const observedAt = new Date("2026-10-18T10:00:00.000Z");

    const short = normalizeAgentLimit({
      provider: "antigravity",
      output:
        "error: Individual quota reached. Please upgrade your subscription to increase your limits. Resets in 4h36m50s.",
      observedAt,
    });
    const long = normalizeAgentLimit({
      provider: "antigravity",
      output: "Individual quota reached. Resets in 85h46m36s.",
      observedAt,
    });

    expect(short).toMatchObject({
      auto_resume: true,
      resume_at: "2026-10-18T14:36:50.000Z",
      resume_source: "provider_reset",
    });
    expect(long.resume_at).toBe("2026-10-21T23:46:36.000Z");
  });
});

describe("decidePinnedWait", () => {
  const now = new Date("2026-10-18T10:03:45.000Z");
  const limitAt = (resumeAt: string | undefined) =>
    normalizeAgentLimit({
      provider: "codex",
      output: resumeAt ? `usage limit; retry-after: ${resumeAt}` : "usage limit reached",
      observedAt: now,
    });

  it("上限より短ければ解除の時刻まで待つ", () => {
    const actual = decidePinnedWait(limitAt("15195"), now, 28_800);

    expect(actual).toEqual({
      action: "wait",
      resumeAt: new Date("2026-10-18T14:17:00.000Z"),
      waitMilliseconds: 15_195_000,
    });
  });

  it("解除の時刻を読めなければ、その旨と元の出力の行を出す", () => {
    const actual = decidePinnedWait(limitAt(undefined), now, 28_800);

    expect(actual).toEqual({
      action: "skip",
      reason: "unreadable",
      message:
        "Pinned-agent wait skipped: resume time could not be read from the agent output. " +
        "Limit line: usage limit reached",
    });
  });

  it("上限を超える場合は、解除の時刻と待つ秒数と上限を出す", () => {
    const actual = decidePinnedWait(limitAt("65175"), now, 28_800);

    expect(actual).toEqual({
      action: "skip",
      reason: "exceeds",
      message:
        "Pinned-agent wait skipped: resume time 2026-10-19T04:10:00.000Z (retry_after) is " +
        "65175s away and exceeds the limit of 28800s.",
    });
  });

  it("解除の時刻を過ぎていれば、過ぎた旨を出す", () => {
    const actual = decidePinnedWait(limitAt("60"), new Date("2026-10-18T10:05:00.000Z"), 28_800);

    expect(actual).toMatchObject({ action: "skip", reason: "past" });
  });
});
