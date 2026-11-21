import { afterEach, describe, expect, it, vi } from "vitest";
import {
  canBlockTask,
  canCompleteTask,
  canUnblockTask,
  claimOwnerOf,
  findDoingTasksForActor,
  foldEventsToState,
} from "../../../src/exec/events.js";
import {
  checkCompletionBeforeIntegration,
  resolveClaimingActor,
} from "../../../src/exec/run/run.js";
import type { ExecEventV1, ScheduleIndex, ScheduleNode } from "../../../src/exec/types.js";

function makeSchedule(taskId: string): ScheduleIndex {
  const node: ScheduleNode = {
    id: taskId,
    depends_on: [],
    kind: "task",
    duration_days: 1,
    schedule_file: "/dummy/sch-test.yaml",
  };
  return {
    nodes: new Map([[taskId, node]]),
    files: ["/dummy/sch-test.yaml"],
    start_date: null,
    calendar: {
      timezone: "UTC",
      workdays: new Set([1, 2, 3, 4, 5]),
      holidays: new Set<string>(),
      work_hours_per_day: 8,
    },
    section_labels: {},
    file_start_dates: new Map(),
  };
}

function event(
  second: number,
  type: ExecEventV1["type"],
  by: string,
  meta?: Record<string, unknown>,
): { path: string; event: ExecEventV1 } {
  const ts = `2026-11-15T00:00:${String(second).padStart(2, "0")}Z`;
  return {
    path: `${second}.json`,
    event: { v: 1, ts, type, task_id: "T-001", by, msg: type, ...(meta ? { meta } : {}) },
  };
}

const AGENT = "luna-executor";
const HUMAN = "indie";
const pipelineMeta = {
  pipeline_stage: "reporter",
  pipeline_state_ref: "runs/x/pipeline-state.json",
};

describe("unblock by a human keeps the agent claim", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("keeps the agent as claim owner after a plain human unblock", () => {
    const schedule = makeSchedule("T-001");

    const snapshot = foldEventsToState(
      [
        event(1, "claim", AGENT),
        event(2, "block", AGENT, pipelineMeta),
        event(3, "unblock", HUMAN),
      ],
      schedule,
      "/dummy",
    );

    expect(snapshot.tasks["T-001"]).toMatchObject({
      state: "doing",
      last_by: HUMAN,
      claimed_by: AGENT,
      meta: pipelineMeta,
    });
  });

  it("lets the resumed agent run pass the completion preflight after a human unblock", () => {
    vi.spyOn(process.stdout, "write").mockReturnValue(true);
    const schedule = makeSchedule("T-001");
    const snapshot = foldEventsToState(
      [
        event(1, "claim", AGENT),
        event(2, "block", AGENT, pipelineMeta),
        event(3, "unblock", HUMAN),
      ],
      schedule,
      "/dummy",
    );

    const resumed = resolveClaimingActor(snapshot.tasks["T-001"], undefined);

    expect(resumed).toEqual({ actor: AGENT, resumed: true });
    expect(checkCompletionBeforeIntegration(schedule, snapshot, "T-001", AGENT)).toEqual({
      ok: true,
    });
    expect(canCompleteTask(schedule, snapshot, "T-001", HUMAN).ok).toBe(false);
  });

  it("lets the agent block again when the resumed stage fails after a human unblock", () => {
    const schedule = makeSchedule("T-001");
    const snapshot = foldEventsToState(
      [event(1, "claim", AGENT), event(2, "block", AGENT), event(3, "unblock", HUMAN)],
      schedule,
      "/dummy",
    );

    expect(canBlockTask(schedule, snapshot, "T-001", AGENT)).toEqual({ ok: true });
    expect(findDoingTasksForActor(snapshot, AGENT)).toEqual(["T-001"]);
    expect(findDoingTasksForActor(snapshot, HUMAN)).toEqual([]);
  });

  it("does not move the claim when another actor writes a note", () => {
    const schedule = makeSchedule("T-001");

    const snapshot = foldEventsToState(
      [event(1, "claim", AGENT), event(2, "note", HUMAN)],
      schedule,
      "/dummy",
    );

    expect(claimOwnerOf(snapshot.tasks["T-001"])).toBe(AGENT);
  });

  it("moves the claim to the executor that the runner switched to on resume", () => {
    const schedule = makeSchedule("T-001");

    const snapshot = foldEventsToState(
      [
        event(1, "claim", AGENT),
        event(2, "block", AGENT),
        event(3, "unblock", HUMAN),
        event(4, "release", AGENT),
        event(5, "claim", "codex-executor", { pipeline_resume_claimed: "true" }),
      ],
      schedule,
      "/dummy",
    );

    expect(claimOwnerOf(snapshot.tasks["T-001"])).toBe("codex-executor");
    expect(canCompleteTask(schedule, snapshot, "T-001", "codex-executor").ok).toBe(true);
  });

  it("clears the claim owner once the task returns to todo", () => {
    const schedule = makeSchedule("T-001");

    const snapshot = foldEventsToState(
      [event(1, "claim", AGENT), event(2, "release", AGENT)],
      schedule,
      "/dummy",
    );

    expect(snapshot.tasks["T-001"].claimed_by).toBeUndefined();
  });
});

describe("unblock --take-over", () => {
  it("makes the human the claim owner so they can complete without --force", () => {
    const schedule = makeSchedule("T-001");

    const snapshot = foldEventsToState(
      [
        event(1, "claim", AGENT),
        event(2, "block", AGENT, pipelineMeta),
        event(3, "unblock", HUMAN, { take_over: true }),
      ],
      schedule,
      "/dummy",
    );

    expect(claimOwnerOf(snapshot.tasks["T-001"])).toBe(HUMAN);
    expect(canCompleteTask(schedule, snapshot, "T-001", HUMAN)).toEqual({ ok: true });
    expect(canCompleteTask(schedule, snapshot, "T-001", AGENT).reason).toMatch(
      /being worked on by another actor: indie/,
    );
  });

  it("treats the CLI string value take_over=true as a take-over", () => {
    const schedule = makeSchedule("T-001");

    const snapshot = foldEventsToState(
      [
        event(1, "claim", AGENT),
        event(2, "block", AGENT),
        event(3, "unblock", HUMAN, { take_over: "true" }),
      ],
      schedule,
      "/dummy",
    );

    expect(claimOwnerOf(snapshot.tasks["T-001"])).toBe(HUMAN);
  });

  it("rejects a take-over requested by an agent", () => {
    const schedule = makeSchedule("T-001");
    const snapshot = foldEventsToState(
      [event(1, "claim", AGENT), event(2, "block", AGENT)],
      schedule,
      "/dummy",
    );

    const result = canUnblockTask(schedule, snapshot, "T-001", { requested: true, isHuman: false });

    expect(result).toEqual({ ok: false, reason: "--take-over requires a human actor: T-001" });
    expect(canUnblockTask(schedule, snapshot, "T-001", { requested: true, isHuman: true }).ok).toBe(
      true,
    );
  });
});

// PJR-ZSRD: a review reopened by a human and run again must pass the completion preflight with
// the agent that claimed it, even when a fallback or human unblock changed the latest actor.
describe("review reopened and run again", () => {
  const REVIEWER = "sol-review-executor";
  const FALLBACK = "luna-review-executor";
  const reopenedEvents = [
    event(1, "claim", REVIEWER),
    event(2, "complete", REVIEWER),
    event(3, "reopen", HUMAN),
    event(4, "claim", REVIEWER),
  ];

  it("passes the completion preflight for the agent that claimed the reopened review", () => {
    const schedule = makeSchedule("T-001");
    const snapshot = foldEventsToState(reopenedEvents, schedule, "/dummy");

    expect(claimOwnerOf(snapshot.tasks["T-001"])).toBe(REVIEWER);
    expect(checkCompletionBeforeIntegration(schedule, snapshot, "T-001", REVIEWER)).toEqual({
      ok: true,
    });
    expect(checkCompletionBeforeIntegration(schedule, snapshot, "T-001", FALLBACK).ok).toBe(false);
  });

  it("keeps the reopened claim owner after a block and a human unblock", () => {
    const schedule = makeSchedule("T-001");
    const snapshot = foldEventsToState(
      [...reopenedEvents, event(5, "block", REVIEWER, pipelineMeta), event(6, "unblock", HUMAN)],
      schedule,
      "/dummy",
    );
    const owner = claimOwnerOf(snapshot.tasks["T-001"]);

    expect(snapshot.tasks["T-001"]).toMatchObject({ last_by: HUMAN, claimed_by: REVIEWER });
    expect(owner).toBe(REVIEWER);
    expect(checkCompletionBeforeIntegration(schedule, snapshot, "T-001", REVIEWER)).toEqual({
      ok: true,
    });
  });
});
