import { afterEach, describe, expect, it, vi } from "vitest";
import { checkCompletionBeforeIntegration, resolveClaimingActor } from "../../src/exec-run.js";
import type { CurrentState, ScheduleIndex, StateSnapshot } from "../../src/exec-types.js";

function doingState(lastBy?: string): CurrentState {
  return { state: "doing", ...(lastBy ? { last_by: lastBy } : {}) };
}

describe("resolveClaimingActor", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("adopts the claiming actor nickname for a doing task", () => {
    vi.spyOn(process.stdout, "write").mockReturnValue(true);

    const result = resolveClaimingActor(doingState("opencode-edit-agent"), undefined);

    expect(result).toEqual({
      actor: "opencode-edit-agent",
      resumed: true,
    });
  });

  it("keeps the claiming actor but does not resolve a command when the actor is unknown to the roster", () => {
    vi.spyOn(process.stdout, "write").mockReturnValue(true);

    const result = resolveClaimingActor(doingState("stranger"), undefined);

    expect(result).toEqual({ actor: "stranger", resumed: true });
  });

  it("lets an explicit --by win without adopting the claiming actor (resumed: false)", () => {
    const write = vi.spyOn(process.stdout, "write").mockReturnValue(true);

    const result = resolveClaimingActor(doingState("opencode-edit-agent"), "human-reviewer");

    expect(result).toEqual({ actor: "human-reviewer", resumed: false });
    expect(write).not.toHaveBeenCalled();
  });

  it("does not resume a task that is not in doing state", () => {
    const write = vi.spyOn(process.stdout, "write").mockReturnValue(true);

    const result = resolveClaimingActor(
      { state: "blocked", last_by: "opencode-edit-agent" },
      undefined,
    );

    expect(result).toEqual({ actor: undefined, resumed: false });
    expect(write).not.toHaveBeenCalled();
  });

  it("does not resume when state is missing (undefined)", () => {
    const result = resolveClaimingActor(undefined, undefined);

    expect(result).toEqual({ actor: undefined, resumed: false });
  });
});

function scheduleWithTask(taskId: string): ScheduleIndex {
  return {
    nodes: new Map([
      [
        taskId,
        {
          id: taskId,
          depends_on: [],
          duration_days: 1,
          kind: "task",
          schedule_file: "sch-track-test.yaml",
        },
      ],
    ]),
    files: [],
    start_date: null,
    section_labels: {},
    calendar: {
      timezone: "Asia/Tokyo",
      workdays: new Set([1, 2, 3, 4, 5]),
      holidays: new Set(),
      work_hours_per_day: 8,
    },
    file_start_dates: new Map(),
  };
}

function snapshotWithTask(taskId: string, state: CurrentState): StateSnapshot {
  return { schedule_path: "schedule", tasks: { [taskId]: state } };
}

describe("checkCompletionBeforeIntegration", () => {
  const taskId = "T-TEST-doc-010";

  it("allows integration when the completing actor owns the doing task", () => {
    const result = checkCompletionBeforeIntegration(
      scheduleWithTask(taskId),
      snapshotWithTask(taskId, doingState("claiming-agent")),
      taskId,
      "claiming-agent",
    );

    expect(result).toEqual({ ok: true });
  });

  it("rejects integration before Git operations when the actor differs from the claim", () => {
    const result = checkCompletionBeforeIntegration(
      scheduleWithTask(taskId),
      snapshotWithTask(taskId, doingState("claiming-agent")),
      taskId,
      "resume-agent",
    );

    expect(result).toEqual({
      ok: false,
      reason:
        "task is being worked on by another actor: claiming-agent (a human may override with --force)",
    });
  });

  it("rejects integration when the task is no longer doing", () => {
    const result = checkCompletionBeforeIntegration(
      scheduleWithTask(taskId),
      snapshotWithTask(taskId, { state: "blocked", last_by: "claiming-agent" }),
      taskId,
      "claiming-agent",
    );

    expect(result).toEqual({ ok: false, reason: `task is blocked: ${taskId}` });
  });
});
