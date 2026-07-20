import { describe, expect, it } from "vitest";
import {
  buildEvent,
  canBlockTask,
  canCancelTask,
  canClaimTask,
  canCompleteTask,
  canReopenTask,
  canReleaseTask,
  canUnblockTask,
  computeReadyIds,
  foldEventsToState,
  isDependencySatisfied,
  validateEventShape,
} from "../../src/exec-events.js";
import type {
  ExecEventV1,
  ScheduleIndex,
  ScheduleNode,
  StateSnapshot,
} from "../../src/exec-types.js";

// ---- helpers -----------------------------------------------------------

function makeSchedule(
  tasks: Array<{
    id: string;
    depends_on?: string[];
    kind?: "task" | "milestone";
    owner?: string;
    duration?: number;
  }>,
): ScheduleIndex {
  const nodes = new Map<string, ScheduleNode>();
  for (const t of tasks) {
    nodes.set(t.id, {
      id: t.id,
      depends_on: t.depends_on ?? [],
      kind: t.kind ?? "task",
      owner: t.owner,
      duration_days: t.duration ?? 1,
      schedule_file: "/dummy/sch-test.yaml",
    });
  }
  return {
    nodes,
    files: ["/dummy/sch-test.yaml"],
    start_date: null,
    calendar: {
      timezone: "UTC",
      workdays: new Set([1, 2, 3, 4, 5]),
      holidays: new Set<string>(),
      work_hours_per_day: 8,
    },
    section_labels: {},
  };
}

function makeSnapshot(
  tasks: Record<string, { state: StateSnapshot["tasks"][string]["state"]; last_by?: string }>,
): StateSnapshot {
  return {
    schedule_path: ".",
    tasks: Object.fromEntries(
      Object.entries(tasks).map(([id, cur]) => [id, { state: cur.state, last_by: cur.last_by }]),
    ),
  };
}

function makeEvent(overrides: Partial<ExecEventV1> = {}): ExecEventV1 {
  return {
    v: 1,
    ts: "2026-06-01T00:00:00Z",
    type: "claim",
    task_id: "T-001",
    by: "agent-1",
    msg: "start",
    ...overrides,
  };
}

// ---- validateEventShape ------------------------------------------------

describe("validateEventShape", () => {
  it("正常なイベントはエラーなし", () => {
    expect(validateEventShape(makeEvent(), "test")).toHaveLength(0);
  });

  it("reopen イベントは有効", () => {
    expect(validateEventShape(makeEvent({ type: "reopen" }), "test")).toHaveLength(0);
  });

  it("v が 1 以外はエラー", () => {
    const errs = validateEventShape({ ...makeEvent(), v: 2 } as unknown as ExecEventV1, "test");
    expect(errs.some((e) => e.includes("v must be 1"))).toBe(true);
  });

  it("ts がミリ秒付きはエラー", () => {
    const errs = validateEventShape({ ...makeEvent(), ts: "2026-06-01T00:00:00.000Z" }, "test");
    expect(errs.some((e) => e.includes("ts must be"))).toBe(true);
  });

  it("未知の type はエラー", () => {
    const errs = validateEventShape(
      { ...makeEvent(), type: "unknown" as ExecEventV1["type"] },
      "test",
    );
    expect(errs.some((e) => e.includes("type must be one of"))).toBe(true);
  });

  it("task_id が空文字はエラー", () => {
    const errs = validateEventShape({ ...makeEvent(), task_id: "" }, "test");
    expect(errs.some((e) => e.includes("task_id"))).toBe(true);
  });

  it("by が空文字はエラー", () => {
    const errs = validateEventShape({ ...makeEvent(), by: "" }, "test");
    expect(errs.some((e) => e.includes("by"))).toBe(true);
  });

  it("JSON オブジェクトでない場合はエラー", () => {
    const errs = validateEventShape("not an object", "test");
    expect(errs.length).toBeGreaterThan(0);
  });
});

// ---- buildEvent --------------------------------------------------------

describe("buildEvent", () => {
  it("claim イベントを正しい構造で生成する", () => {
    const event = buildEvent("claim", { task: "T-001", by: "agent-1", msg: "start" });
    expect(event.v).toBe(1);
    expect(event.type).toBe("claim");
    expect(event.task_id).toBe("T-001");
    expect(event.by).toBe("agent-1");
    expect(event.msg).toBe("start");
  });

  it("ts が UTC ISO 秒形式", () => {
    const event = buildEvent("complete", { task: "T-001", by: "agent-1", msg: "done" });
    expect(event.ts).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
  });

  it("task が空のとき例外を投げる", () => {
    expect(() => buildEvent("claim", { task: "", by: "agent-1", msg: "x" })).toThrow();
  });

  it("by が空のとき例外を投げる", () => {
    expect(() => buildEvent("claim", { task: "T-001", by: "", msg: "x" })).toThrow();
  });

  it("meta キーと値を ref/meta フィールドとして格納する", () => {
    const event = buildEvent("link", {
      task: "T-001",
      by: "agent-1",
      msg: "link",
      ref: ["pr=https://example.com"],
      meta: ["key=value"],
    });
    expect(event.refs?.pr).toBe("https://example.com");
    expect(event.meta?.key).toBe("value");
  });
});

// ---- foldEventsToState -------------------------------------------------

describe("foldEventsToState", () => {
  it("イベントなしのとき全タスクが todo", () => {
    const schedule = makeSchedule([{ id: "A" }, { id: "B" }]);
    const snapshot = foldEventsToState([], schedule, "/dummy");
    expect(snapshot.tasks["A"].state).toBe("todo");
    expect(snapshot.tasks["B"].state).toBe("todo");
  });

  it("claim で todo → doing に遷移する", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const event = makeEvent({ type: "claim", task_id: "T-001", by: "agent-1" });
    const snapshot = foldEventsToState([{ path: "e.json", event }], schedule, "/dummy");
    expect(snapshot.tasks["T-001"].state).toBe("doing");
    expect(snapshot.tasks["T-001"].last_by).toBe("agent-1");
  });

  it("complete で doing → done に遷移する", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const events = [
      { path: "1.json", event: makeEvent({ type: "claim", task_id: "T-001", by: "agent-1" }) },
      {
        path: "2.json",
        event: makeEvent({ type: "complete", task_id: "T-001", by: "agent-1", msg: "done" }),
      },
    ];
    const snapshot = foldEventsToState(events, schedule, "/dummy");
    expect(snapshot.tasks["T-001"].state).toBe("done");
  });

  it("reopen で done → todo に遷移する", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const events = [
      { path: "1.json", event: makeEvent({ type: "claim", task_id: "T-001" }) },
      { path: "2.json", event: makeEvent({ type: "complete", task_id: "T-001" }) },
      { path: "3.json", event: makeEvent({ type: "reopen", task_id: "T-001", by: "indie" }) },
    ];
    const snapshot = foldEventsToState(events, schedule, "/dummy");
    expect(snapshot.tasks["T-001"].state).toBe("todo");
    expect(snapshot.tasks["T-001"].last_type).toBe("reopen");
  });

  it("done 以外への不正な reopen event は状態を変更しない", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const event = makeEvent({ type: "reopen", task_id: "T-001", by: "indie" });
    const snapshot = foldEventsToState([{ path: "1.json", event }], schedule, "/dummy");
    expect(snapshot.tasks["T-001"].state).toBe("todo");
  });

  it("block で doing → blocked に遷移する", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const events = [
      { path: "1.json", event: makeEvent({ type: "claim", task_id: "T-001", by: "agent-1" }) },
      {
        path: "2.json",
        event: makeEvent({ type: "block", task_id: "T-001", by: "agent-1", msg: "waiting" }),
      },
    ];
    const snapshot = foldEventsToState(events, schedule, "/dummy");
    expect(snapshot.tasks["T-001"].state).toBe("blocked");
  });

  it("unblock で blocked → doing に戻る", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const events = [
      { path: "1.json", event: makeEvent({ type: "claim", task_id: "T-001", by: "agent-1" }) },
      {
        path: "2.json",
        event: makeEvent({ type: "block", task_id: "T-001", by: "agent-1", msg: "waiting" }),
      },
      {
        path: "3.json",
        event: makeEvent({ type: "unblock", task_id: "T-001", by: "agent-2", msg: "resolved" }),
      },
    ];
    const snapshot = foldEventsToState(events, schedule, "/dummy");
    expect(snapshot.tasks["T-001"].state).toBe("doing");
  });

  it("cancel で todo から cancelled に遷移する", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const events = [
      {
        path: "1.json",
        event: makeEvent({ type: "cancel", task_id: "T-001", by: "agent-1", msg: "removed" }),
      },
    ];
    const snapshot = foldEventsToState(events, schedule, "/dummy");
    expect(snapshot.tasks["T-001"].state).toBe("cancelled");
  });

  it("release で doing から todo に戻る", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const events = [
      {
        path: "1.json",
        event: makeEvent({ type: "claim", task_id: "T-001", by: "agent-1", msg: "start" }),
      },
      {
        path: "2.json",
        event: makeEvent({ type: "release", task_id: "T-001", by: "agent-1", msg: "rollback" }),
      },
    ];
    const snapshot = foldEventsToState(events, schedule, "/dummy");
    expect(snapshot.tasks["T-001"].state).toBe("todo");
  });

  it("release で blocked から todo に戻る", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const events = [
      {
        path: "1.json",
        event: makeEvent({ type: "claim", task_id: "T-001", by: "agent-1", msg: "start" }),
      },
      {
        path: "2.json",
        event: makeEvent({ type: "block", task_id: "T-001", by: "agent-1", msg: "blocked" }),
      },
      {
        path: "3.json",
        event: makeEvent({ type: "release", task_id: "T-001", by: "agent-1", msg: "abandon" }),
      },
    ];
    const snapshot = foldEventsToState(events, schedule, "/dummy");
    expect(snapshot.tasks["T-001"].state).toBe("todo");
  });

  it("legacy cancel は doing から todo に戻る（後方互換）", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const events = [
      {
        path: "1.json",
        event: makeEvent({ type: "claim", task_id: "T-001", by: "agent-1", msg: "start" }),
      },
      {
        path: "2.json",
        event: makeEvent({ type: "cancel", task_id: "T-001", by: "agent-1", msg: "legacy" }),
      },
    ];
    const snapshot = foldEventsToState(events, schedule, "/dummy");
    expect(snapshot.tasks["T-001"].state).toBe("todo");
  });

  it("現行スケジュールに存在しない履歴イベントを state から除外する", () => {
    const schedule = makeSchedule([{ id: "T-CURRENT" }]);
    const event = makeEvent({ type: "complete", task_id: "T-RETIRED", by: "agent-1" });

    const snapshot = foldEventsToState([{ path: "e.json", event }], schedule, "/dummy");

    expect(snapshot.tasks["T-RETIRED"]).toBeUndefined();
    expect(snapshot.tasks["T-CURRENT"].state).toBe("todo");
  });
});

// ---- isDependencySatisfied ---------------------------------------------

describe("isDependencySatisfied", () => {
  it("存在しないタスク ID は false を返す", () => {
    const schedule = makeSchedule([{ id: "A" }]);
    const snapshot = makeSnapshot({ A: { state: "done" } });
    expect(isDependencySatisfied(schedule, snapshot, "UNKNOWN")).toBe(false);
  });

  it("task が done のとき true", () => {
    const schedule = makeSchedule([{ id: "A" }]);
    const snapshot = makeSnapshot({ A: { state: "done" } });
    expect(isDependencySatisfied(schedule, snapshot, "A")).toBe(true);
  });

  it("task が todo のとき false", () => {
    const schedule = makeSchedule([{ id: "A" }]);
    const snapshot = makeSnapshot({ A: { state: "todo" } });
    expect(isDependencySatisfied(schedule, snapshot, "A")).toBe(false);
  });

  it("milestone はすべての依存 task が done のとき true", () => {
    const schedule = makeSchedule([
      { id: "A" },
      { id: "B" },
      { id: "M", kind: "milestone", depends_on: ["A", "B"] },
    ]);
    const snapshot = makeSnapshot({ A: { state: "done" }, B: { state: "done" } });
    expect(isDependencySatisfied(schedule, snapshot, "M")).toBe(true);
  });

  it("milestone は依存 task が未完のとき false", () => {
    const schedule = makeSchedule([
      { id: "A" },
      { id: "B" },
      { id: "M", kind: "milestone", depends_on: ["A", "B"] },
    ]);
    const snapshot = makeSnapshot({ A: { state: "done" }, B: { state: "todo" } });
    expect(isDependencySatisfied(schedule, snapshot, "M")).toBe(false);
  });
});

// ---- computeReadyIds ---------------------------------------------------

describe("computeReadyIds", () => {
  it("依存なしの todo タスクは ready", () => {
    const schedule = makeSchedule([{ id: "A" }, { id: "B" }]);
    const snapshot = makeSnapshot({ A: { state: "todo" }, B: { state: "todo" } });
    expect(computeReadyIds(schedule, snapshot)).toEqual(["A", "B"]);
  });

  it("依存が未完のタスクは ready に含まれない", () => {
    const schedule = makeSchedule([{ id: "A" }, { id: "B", depends_on: ["A"] }]);
    const snapshot = makeSnapshot({ A: { state: "todo" }, B: { state: "todo" } });
    expect(computeReadyIds(schedule, snapshot)).toEqual(["A"]);
  });

  it("依存が done のタスクは ready に含まれる", () => {
    const schedule = makeSchedule([{ id: "A" }, { id: "B", depends_on: ["A"] }]);
    const snapshot = makeSnapshot({ A: { state: "done" }, B: { state: "todo" } });
    expect(computeReadyIds(schedule, snapshot)).toEqual(["B"]);
  });

  it("doing / blocked / done / cancelled のタスクは ready に含まれない", () => {
    const schedule = makeSchedule([
      { id: "DOING" },
      { id: "BLOCKED" },
      { id: "DONE" },
      { id: "CANCELLED" },
    ]);
    const snapshot = makeSnapshot({
      DOING: { state: "doing" },
      BLOCKED: { state: "blocked" },
      DONE: { state: "done" },
      CANCELLED: { state: "cancelled" },
    });
    expect(computeReadyIds(schedule, snapshot)).toEqual([]);
  });

  it("milestone ノードは ready リストに含まれない", () => {
    const schedule = makeSchedule([{ id: "A" }, { id: "M", kind: "milestone", depends_on: ["A"] }]);
    const snapshot = makeSnapshot({ A: { state: "done" } });
    expect(computeReadyIds(schedule, snapshot)).toEqual([]);
  });

  it("結果は ID 昇順でソートされる", () => {
    const schedule = makeSchedule([{ id: "C" }, { id: "A" }, { id: "B" }]);
    const snapshot = makeSnapshot({
      A: { state: "todo" },
      B: { state: "todo" },
      C: { state: "todo" },
    });
    expect(computeReadyIds(schedule, snapshot)).toEqual(["A", "B", "C"]);
  });
});

// ---- canClaimTask ------------------------------------------------------

describe("canClaimTask", () => {
  it("todo かつ依存なしで ok", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "todo" } });
    expect(canClaimTask(schedule, snapshot, "T-001").ok).toBe(true);
  });

  it("スケジュールに存在しないタスクは NG", () => {
    const schedule = makeSchedule([]);
    const snapshot = makeSnapshot({});
    expect(canClaimTask(schedule, snapshot, "UNKNOWN").ok).toBe(false);
  });

  it("milestone は claim できない", () => {
    const schedule = makeSchedule([{ id: "M", kind: "milestone" }]);
    const snapshot = makeSnapshot({ M: { state: "todo" } });
    expect(canClaimTask(schedule, snapshot, "M").ok).toBe(false);
  });

  it("doing 状態のタスクは claim できない", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "doing", last_by: "agent-1" } });
    expect(canClaimTask(schedule, snapshot, "T-001").ok).toBe(false);
  });

  it("done 状態のタスクは claim できない", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "done" } });
    expect(canClaimTask(schedule, snapshot, "T-001").ok).toBe(false);
  });

  it("owner ミスマッチ かつ allowOwnerMismatch=false は NG", () => {
    const schedule = makeSchedule([{ id: "T-001", owner: "BA" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "todo" } });
    const result = canClaimTask(schedule, snapshot, "T-001", "PO", false);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain("BA");
  });

  it("owner ミスマッチ かつ allowOwnerMismatch=true は ok", () => {
    const schedule = makeSchedule([{ id: "T-001", owner: "BA" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "todo" } });
    expect(canClaimTask(schedule, snapshot, "T-001", "PO", true).ok).toBe(true);
  });

  it("acting owner 未指定なら owner 付き task も claim できる", () => {
    const schedule = makeSchedule([{ id: "T-001", owner: "BA" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "todo" } });
    expect(canClaimTask(schedule, snapshot, "T-001").ok).toBe(true);
  });
});

// ---- canCompleteTask ---------------------------------------------------

describe("canCompleteTask", () => {
  it("doing かつ同一 actor で ok", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "doing", last_by: "agent-1" } });
    expect(canCompleteTask(schedule, snapshot, "T-001", "agent-1").ok).toBe(true);
  });

  it("todo 状態のタスクは complete できない", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "todo" } });
    expect(canCompleteTask(schedule, snapshot, "T-001", "agent-1").ok).toBe(false);
  });

  it("別の actor は complete できない", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "doing", last_by: "agent-1" } });
    expect(canCompleteTask(schedule, snapshot, "T-001", "agent-2").ok).toBe(false);
  });

  it("human が --force を付ければ別 actor のタスクを complete できる", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "doing", last_by: "agent-1" } });
    expect(
      canCompleteTask(schedule, snapshot, "T-001", "indie", { isHuman: true, force: true }).ok,
    ).toBe(true);
  });

  it("agent は --force を付けても別 actor のタスクを complete できない", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "doing", last_by: "agent-1" } });
    expect(
      canCompleteTask(schedule, snapshot, "T-001", "agent-2", { isHuman: false, force: true }).ok,
    ).toBe(false);
  });

  it("done 状態のタスクは complete できない", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "done" } });
    expect(canCompleteTask(schedule, snapshot, "T-001", "agent-1").ok).toBe(false);
  });

  it("blocked 状態のタスクは complete できない", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "blocked" } });
    expect(canCompleteTask(schedule, snapshot, "T-001", "agent-1").ok).toBe(false);
  });
});

// ---- canReopenTask -----------------------------------------------------

describe("canReopenTask", () => {
  it("human は後続が進行していない done task を reopen できる", () => {
    const schedule = makeSchedule([{ id: "A" }, { id: "B", depends_on: ["A"] }]);
    const snapshot = makeSnapshot({ A: { state: "done" }, B: { state: "todo" } });
    expect(canReopenTask(schedule, snapshot, "A", true).ok).toBe(true);
  });

  it("agent は done task を reopen できない", () => {
    const schedule = makeSchedule([{ id: "A" }]);
    const snapshot = makeSnapshot({ A: { state: "done" } });
    const result = canReopenTask(schedule, snapshot, "A", false);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain("human actor");
  });

  it("done 以外の task は reopen できない", () => {
    const schedule = makeSchedule([{ id: "A" }]);
    const snapshot = makeSnapshot({ A: { state: "todo" } });
    expect(canReopenTask(schedule, snapshot, "A", true).ok).toBe(false);
  });

  it.each(["doing", "blocked", "done"] as const)(
    "後続 task が %s の場合は reopen できない",
    (state) => {
      const schedule = makeSchedule([{ id: "A" }, { id: "B", depends_on: ["A"] }]);
      const snapshot = makeSnapshot({ A: { state: "done" }, B: { state } });
      const result = canReopenTask(schedule, snapshot, "A", true);
      expect(result.ok).toBe(false);
      expect(result.reason).toContain(`B (${state})`);
    },
  );

  it("milestone を介した後続 done task も検出する", () => {
    const schedule = makeSchedule([
      { id: "A" },
      { id: "M", kind: "milestone", depends_on: ["A"] },
      { id: "B", depends_on: ["M"] },
    ]);
    const snapshot = makeSnapshot({ A: { state: "done" }, B: { state: "done" } });
    const result = canReopenTask(schedule, snapshot, "A", true);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain("B (done)");
  });

  it("後続 task が todo / cancelled の場合は reopen できる", () => {
    const schedule = makeSchedule([
      { id: "A" },
      { id: "B", depends_on: ["A"] },
      { id: "C", depends_on: ["A"] },
    ]);
    const snapshot = makeSnapshot({
      A: { state: "done" },
      B: { state: "todo" },
      C: { state: "cancelled" },
    });
    expect(canReopenTask(schedule, snapshot, "A", true).ok).toBe(true);
  });
});

// ---- canBlockTask ------------------------------------------------------

describe("canBlockTask", () => {
  it("doing かつ同一 actor で ok", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "doing", last_by: "agent-1" } });
    expect(canBlockTask(schedule, snapshot, "T-001", "agent-1").ok).toBe(true);
  });

  it("todo 状態のタスクは block できない", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "todo" } });
    expect(canBlockTask(schedule, snapshot, "T-001", "agent-1").ok).toBe(false);
  });

  it("別の actor は block できない", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "doing", last_by: "agent-1" } });
    expect(canBlockTask(schedule, snapshot, "T-001", "agent-2").ok).toBe(false);
  });

  it("human が --force を付ければ別 actor のタスクを block できる", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "doing", last_by: "agent-1" } });
    expect(
      canBlockTask(schedule, snapshot, "T-001", "indie", { isHuman: true, force: true }).ok,
    ).toBe(true);
  });

  it("agent は --force を付けても別 actor のタスクを block できない", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "doing", last_by: "agent-1" } });
    expect(
      canBlockTask(schedule, snapshot, "T-001", "agent-2", { isHuman: false, force: true }).ok,
    ).toBe(false);
  });

  it("すでに blocked のタスクは block できない", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "blocked" } });
    expect(canBlockTask(schedule, snapshot, "T-001", "agent-1").ok).toBe(false);
  });
});

// ---- canUnblockTask ----------------------------------------------------

describe("canUnblockTask", () => {
  it("blocked 状態のタスクは任意の actor が unblock できる", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "blocked" } });
    expect(canUnblockTask(schedule, snapshot, "T-001").ok).toBe(true);
  });

  it("todo 状態のタスクは unblock できない", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "todo" } });
    expect(canUnblockTask(schedule, snapshot, "T-001").ok).toBe(false);
  });

  it("doing 状態のタスクは unblock できない", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "doing", last_by: "agent-1" } });
    expect(canUnblockTask(schedule, snapshot, "T-001").ok).toBe(false);
  });

  it("done 状態のタスクは unblock できない", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "done" } });
    expect(canUnblockTask(schedule, snapshot, "T-001").ok).toBe(false);
  });
});

// ---- canCancelTask -----------------------------------------------------

describe("canCancelTask", () => {
  it("todo 状態のタスクは cancel できる（→ cancelled）", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "todo" } });
    expect(canCancelTask(schedule, snapshot, "T-001").ok).toBe(true);
  });

  it("doing 状態のタスクは cancel できず release を案内する", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "doing", last_by: "agent-1" } });
    const result = canCancelTask(schedule, snapshot, "T-001");
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/use `release`/);
  });

  it("blocked 状態のタスクは cancel できず release を案内する", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "blocked", last_by: "agent-1" } });
    const result = canCancelTask(schedule, snapshot, "T-001");
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/use `release`/);
  });

  it("done 状態のタスクは cancel できない", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "done" } });
    expect(canCancelTask(schedule, snapshot, "T-001").ok).toBe(false);
  });

  it("すでに cancelled のタスクは cancel できない", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "cancelled" } });
    expect(canCancelTask(schedule, snapshot, "T-001").ok).toBe(false);
  });
});

// ---- canReleaseTask ----------------------------------------------------

describe("canReleaseTask", () => {
  it("doing かつ同一 actor で release できる", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "doing", last_by: "agent-1" } });
    expect(canReleaseTask(schedule, snapshot, "T-001", "agent-1").ok).toBe(true);
  });

  it("blocked かつ同一 actor で release できる", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "blocked", last_by: "agent-1" } });
    expect(canReleaseTask(schedule, snapshot, "T-001", "agent-1").ok).toBe(true);
  });

  it("doing のとき別の actor は release できない", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "doing", last_by: "agent-1" } });
    expect(canReleaseTask(schedule, snapshot, "T-001", "agent-2").ok).toBe(false);
  });

  it("blocked のとき別の actor は release できない", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "blocked", last_by: "agent-1" } });
    expect(canReleaseTask(schedule, snapshot, "T-001", "agent-2").ok).toBe(false);
  });

  it("human が --force を付ければ別 actor のタスクも release できる", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "blocked", last_by: "agent-1" } });
    expect(
      canReleaseTask(schedule, snapshot, "T-001", "indie", { isHuman: true, force: true }).ok,
    ).toBe(true);
  });

  it("agent は --force を付けても別 actor のタスクを release できない", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "doing", last_by: "agent-1" } });
    const result = canReleaseTask(schedule, snapshot, "T-001", "agent-2", {
      isHuman: false,
      force: true,
    });
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/a human may override with --force/);
  });

  it("todo 状態のタスクは release できない", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "todo" } });
    expect(canReleaseTask(schedule, snapshot, "T-001", "agent-1").ok).toBe(false);
  });

  it("done 状態のタスクは release できない", () => {
    const schedule = makeSchedule([{ id: "T-001" }]);
    const snapshot = makeSnapshot({ "T-001": { state: "done", last_by: "agent-1" } });
    expect(canReleaseTask(schedule, snapshot, "T-001", "agent-1").ok).toBe(false);
  });
});
