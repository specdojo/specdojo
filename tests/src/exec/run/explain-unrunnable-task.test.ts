import { describe, expect, it } from "vitest";
import { explainUnrunnableTask } from "../../../../src/exec/run/schedule-mode.js";
import type { CurrentState, ScheduleIndex } from "../../../../src/exec/types.js";

function schedule(nodes: Record<string, string[]>): ScheduleIndex {
  return {
    nodes: new Map(
      Object.entries(nodes).map(([id, dependsOn]) => [
        id,
        {
          id,
          depends_on: dependsOn,
          duration_days: 1,
          kind: "task",
          schedule_file: "sch-track-kata-wave.yaml",
        },
      ]),
    ),
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

const states = (m: Record<string, CurrentState["state"]>): Record<string, CurrentState> =>
  Object.fromEntries(Object.entries(m).map(([id, state]) => [id, { state }]));

describe("explainUnrunnableTask", () => {
  const sch = schedule({
    "T-KATA-WAVE-3-a-040": ["T-KATA-WAVE-3-a-020"],
    "T-KATA-WAVE-3-a-020": [],
  });

  it("names the unfinished dependency for a todo task", () => {
    const actual = explainUnrunnableTask(
      "T-KATA-WAVE-3-a-040",
      states({ "T-KATA-WAVE-3-a-040": "todo", "T-KATA-WAVE-3-a-020": "doing" }),
      sch,
    );

    expect(actual).toContain("T-KATA-WAVE-3-a-020");
    expect(actual).toContain("unfinished dependencies");
  });

  it("reports a done task as done", () => {
    const actual = explainUnrunnableTask(
      "T-KATA-WAVE-3-a-020",
      states({ "T-KATA-WAVE-3-a-020": "done" }),
      sch,
    );

    expect(actual).toMatch(/already done/);
  });

  it("lets a doing task with a hyphenated track resume", () => {
    const actual = explainUnrunnableTask(
      "T-KATA-WAVE-3-a-040",
      states({ "T-KATA-WAVE-3-a-040": "doing", "T-KATA-WAVE-3-a-020": "doing" }),
      sch,
    );

    expect(actual).toBeUndefined();
  });
});
