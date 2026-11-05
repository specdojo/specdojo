import { describe, expect, it } from "vitest";
import { computeEpicSchedules } from "../../../src/dashboard/epic-plan.js";
import { orderEpics } from "../../../src/register/epic.js";
import type { PjrItem } from "../../../src/register/item.js";
import { defaultScheduleCalendar } from "../../../src/shared/schedule-index.js";

function epic(id: string, extra: Partial<PjrItem> = {}): PjrItem {
  return {
    id,
    type: "epic",
    track: id.toLowerCase(),
    title: id,
    description: "",
    status: "open",
    priority: "medium",
    owner: "-",
    registeredAt: "2026-01-01T00:00:00Z",
    due: "_TODO_",
    completedAt: "-",
    conclusion: "-",
    ticket: "-",
    ...extra,
  };
}
function compute(items: PjrItem[], starts = new Map<string, string>()) {
  return computeEpicSchedules({
    items,
    projectId: "prj-test",
    timeZone: "Asia/Tokyo",
    starts,
    calendar: { ...defaultScheduleCalendar(), holidays: new Set(["2026-01-12"]) },
  });
}

describe("epic overall plan", () => {
  it("completed / in-progress / unstarted periods follow actual events, due dates and predecessors", () => {
    const items = [
      epic("PJR-0003", { dependsOn: ["prj-test:PJR-0002"], due: "2026-01-16" }),
      epic("PJR-0002", { status: "in-progress", dependsOn: ["PJR-0001"], due: "2026-01-09" }),
      epic("PJR-0001", { status: "done", completedAt: "2026-01-05T15:00:00Z", due: "2026-01-30" }),
    ];
    const result = compute(
      items,
      new Map([
        ["PJR-0001", "2026-01-01T15:00:00Z"],
        ["PJR-0002", "2026-01-06T15:00:00Z"],
      ]),
    );
    expect(result.schedule.map((row) => row.id)).toEqual(["PJR-0001", "PJR-0002", "PJR-0003"]);
    expect(result.schedule).toMatchObject([
      { startDate: "2026-01-02", endDate: "2026-01-06", estimateDays: 3 },
      { startDate: "2026-01-07", endDate: "2026-01-09", estimateDays: 3 },
      { startDate: "2026-01-13", endDate: "2026-01-16", estimateDays: 4 },
    ]);
    expect(result.plannedStartDate).toBe("2026-01-02");
  });

  it("missing due dates remain unknown and block downstream start inference", () => {
    const { schedule } = compute(
      [
        epic("PJR-0001", { status: "in-progress" }),
        epic("PJR-0002", { dependsOn: ["PJR-0001"], due: "2026-01-20" }),
        epic("PJR-0003", { due: "2026-01-22" }),
      ],
      new Map([["PJR-0001", "2026-01-02T00:00:00Z"]]),
    );
    expect(schedule[0]).toMatchObject({
      startDate: "2026-01-02",
      endDate: undefined,
      estimateDays: undefined,
    });
    expect(schedule[1].startDate).toBeUndefined();
    expect(schedule[2].startDate).toBeUndefined();
  });

  it("multiple prerequisites use the latest end, independently of input order", () => {
    const { schedule } = compute([
      epic("PJR-0003", { dependsOn: ["PJR-0001", "PJR-0002"] }),
      epic("PJR-0001", { status: "done", completedAt: "2026-01-08T00:00:00Z" }),
      epic("PJR-0002", { status: "done", completedAt: "2026-01-09T00:00:00Z" }),
    ]);
    expect(schedule[2].startDate).toBe("2026-01-13");
  });

  it("rejects qualified/local cycles and duplicate track ownership", () => {
    expect(() =>
      orderEpics(
        [
          epic("PJR-0001", { dependsOn: ["prj-test:PJR-0002"] }),
          epic("PJR-0002", { dependsOn: ["PJR-0001"] }),
        ],
        "prj-test",
      ),
    ).toThrow("cycle");
    expect(() =>
      orderEpics([epic("PJR-0001"), epic("PJR-0002", { track: "pjr-0001" })], "prj-test"),
    ).toThrow("Duplicate epic track");
    expect(() => orderEpics([epic("PJR-0001", { dependsOn: ["PJR-0001"] })], "prj-test")).toThrow(
      "cycle",
    );
  });
});
