import { describe, expect, it } from "vitest";
import {
  limitEventMeta,
  normalizeAgentLimit,
  selectDueDeferredLimitTasks,
} from "../../src/exec-limit.js";
import type { StateSnapshot } from "../../src/exec-types.js";

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
