import { describe, expect, it } from "vitest";
import {
  countRecentRemedies,
  decideRemedy,
  resolveWatchRemedies,
  usageLimitResumeAt,
  type RemedyStall,
  type ResolvedWatchRemedies,
  type WatchRemedyConfig,
} from "../../../src/exec/watch-remedy.js";

const NOW = new Date("2026-11-14T00:00:00Z");
const PIPELINE_META = {
  pipeline_stage: "executor",
  pipeline_state_ref: "docs/ja/projects/prj-0001/execution/runs/schedule/x/pipeline-state.json",
};

function config(watch: WatchRemedyConfig): ResolvedWatchRemedies {
  return resolveWatchRemedies(watch);
}

function stall(overrides: Partial<RemedyStall> = {}): RemedyStall {
  return {
    key: "schedule-task:T-1:deferred:2026-11-13T14:23:56Z",
    target: { kind: "schedule-task", id: "T-1" },
    state: "deferred",
    since: "2026-11-13T14:23:56Z",
    category: "usage_limit",
    ...overrides,
  };
}

function decide(target: RemedyStall, watch: WatchRemedyConfig, attempts = 0) {
  return decideRemedy({
    stall: target,
    config: config(watch),
    projectId: "prj-0001",
    now: NOW,
    attempts,
  });
}

describe("resolveWatchRemedies", () => {
  it("takes no action for any category when the watch block is omitted", () => {
    expect(resolveWatchRemedies(undefined)).toEqual({
      usageLimit: { action: "none", switchAfterMs: 12 * 3_600_000, unknownResumeWaitMs: 3_600_000 },
      loadTimeout: "none",
      targetSync: "none",
      maxAttempts: 3,
      attemptWindowMs: 24 * 3_600_000,
    });
  });

  it("rejects fallback without a fallback agent", () => {
    expect(() => config({ remedies: { usage_limit: { action: "fallback" } } })).toThrow(
      /usage_limit\.action: fallback requires fallback_executor_by or fallback_reporter_by/,
    );
  });

  it("names the setting when an action is not one of the choices", () => {
    expect(() =>
      config({ remedies: { load_timeout: { action: "retry" as unknown as "rerun" } } }),
    ).toThrow(/watch\.remedies\.load_timeout\.action must be one of none, rerun: retry/);
  });

  it("rejects a malformed duration", () => {
    expect(() => config({ attempt_window: "1 day" })).toThrow(/watch\.attempt_window must be/);
  });
});

describe("decideRemedy", () => {
  it("leaves a stall that needs a decision alone even when every remedy is on", () => {
    const actual = decide(stall({ category: "needs_decision" }), {
      remedies: {
        usage_limit: { action: "wait" },
        load_timeout: { action: "rerun" },
        needs_target_sync: { action: "sync" },
      },
    });

    expect(actual).toEqual({ kind: "none", reason: "手当ての対象外の種類" });
  });

  it("takes no action when the category's remedy is not selected", () => {
    expect(decide(stall(), {})).toEqual({ kind: "none", reason: "手当てを選んでいない" });
  });

  it("waits for a usage limit until its resume time", () => {
    const actual = decide(stall({ meta: { limit_resume_at: "2026-11-14T03:00:00.000Z" } }), {
      remedies: { usage_limit: { action: "wait" } },
    });

    expect(actual).toEqual({ kind: "wait", until: "2026-11-14T03:00:00.000Z" });
  });

  it("resumes a due deferred-limit task with exec resume --due", () => {
    const actual = decide(
      stall({
        meta: { limit_resume_at: "2026-11-13T14:37:00.000Z", limit_auto_resume: "true" },
      }),
      { remedies: { usage_limit: { action: "wait" } } },
    );

    expect(actual).toEqual({
      kind: "launch",
      plan: {
        action: "resume_due",
        argv: [
          "exec",
          "resume",
          "--project",
          "prj-0001",
          "--task",
          "T-1",
          "--if-busy",
          "skip",
          "--due",
        ],
        summary: "解除の時刻を過ぎたので同じ agent で再開する",
      },
    });
  });

  it("switches to the fallback agent when the pinned agent's limit lasts days", () => {
    const actual = decide(
      stall({ meta: { ...PIPELINE_META, limit_resume_at: "2026-11-17T00:00:00.000Z" } }),
      {
        remedies: {
          usage_limit: {
            action: "wait",
            fallback_executor_by: "sonnet-executor",
            fallback_reporter_by: "sonnet-reporter",
          },
        },
      },
    );

    expect(actual).toMatchObject({
      kind: "launch",
      plan: {
        action: "switch_agent",
        argv: [
          "exec",
          "resume",
          "--project",
          "prj-0001",
          "--task",
          "T-1",
          "--if-busy",
          "skip",
          "--executor-by",
          "sonnet-executor",
          "--reporter-by",
          "sonnet-reporter",
        ],
      },
    });
  });

  it("does not switch agents for a schedule task without a pipeline stage", () => {
    const actual = decide(stall(), {
      remedies: { usage_limit: { action: "fallback", fallback_executor_by: "sonnet-executor" } },
    });

    expect(actual.kind).toBe("none");
  });

  it("resumes a register item after the unknown-resume wait with the same agent", () => {
    const actual = decide(
      stall({
        key: "register-item:PJR-AAAA:waiting:2026-11-13T15:00:00Z",
        target: { kind: "register-item", id: "PJR-AAAA" },
        state: "waiting",
        since: "2026-11-13T15:00:00Z",
        message: "rate limit reached",
      }),
      { remedies: { usage_limit: { action: "wait" } } },
    );

    expect(actual).toMatchObject({
      kind: "launch",
      plan: {
        action: "resume",
        argv: [
          "exec",
          "run",
          "--project",
          "prj-0001",
          "--register",
          "PJR-AAAA",
          "--worktree",
          "--resume",
          "--if-busy",
          "skip",
        ],
      },
    });
  });

  it("resumes a stage stopped by a load timeout so the failed checks run again", () => {
    const actual = decide(
      stall({ category: "load_timeout", state: "blocked", meta: { ...PIPELINE_META } }),
      { remedies: { load_timeout: { action: "rerun" } } },
    );

    expect(actual).toMatchObject({
      kind: "launch",
      plan: {
        action: "rerun_checks",
        argv: ["exec", "resume", "--project", "prj-0001", "--task", "T-1", "--if-busy", "skip"],
      },
    });
  });

  it("syncs an executor-stage task through --resume-from executor", () => {
    const actual = decide(
      stall({ category: "needs_target_sync", state: "blocked", meta: { ...PIPELINE_META } }),
      { remedies: { needs_target_sync: { action: "sync" } } },
    );

    expect(actual).toMatchObject({
      kind: "launch",
      plan: { action: "sync_target", argv: expect.arrayContaining(["--resume-from", "executor"]) },
    });
  });

  it("retries only the integration of an integrate-stage task, which syncs first", () => {
    const actual = decide(
      stall({
        category: "needs_target_sync",
        state: "blocked",
        meta: { ...PIPELINE_META, pipeline_stage: "integrate" },
      }),
      { remedies: { needs_target_sync: { action: "sync" } } },
    );

    expect(actual).toMatchObject({
      kind: "launch",
      plan: {
        argv: ["exec", "resume", "--project", "prj-0001", "--task", "T-1", "--if-busy", "skip"],
      },
    });
  });

  it("stops once the target reached max_attempts", () => {
    const actual = decide(
      stall({ category: "load_timeout", state: "blocked", meta: { ...PIPELINE_META } }),
      { remedies: { load_timeout: { action: "rerun" } }, max_attempts: 2 },
      2,
    );

    expect(actual).toEqual({ kind: "stop", attempts: 2 });
  });
});

describe("usageLimitResumeAt", () => {
  it("reads resume_at from a register wait reason", () => {
    const actual = usageLimitResumeAt(
      stall({ message: "rate_limit reached; resume_at=2026-11-14T01:00:00.000Z" }),
      config({}),
    );

    expect(new Date(actual).toISOString()).toBe("2026-11-14T01:00:00.000Z");
  });
});

describe("countRecentRemedies", () => {
  it("counts only the target's remedies inside the window", () => {
    const target = { kind: "schedule-task", id: "T-1" } as const;
    const lines = [
      { event: "remedy", ts: "2026-11-12T00:00:00Z", target },
      { event: "remedy", ts: "2026-11-13T12:00:00Z", target },
      { event: "remedy", ts: "2026-11-13T13:00:00Z", target: { kind: "schedule-task", id: "T-2" } },
      { event: "stalled", ts: "2026-11-13T13:00:00Z", target },
    ];

    expect(countRecentRemedies(lines, target, NOW, 24 * 3_600_000)).toBe(1);
  });
});
