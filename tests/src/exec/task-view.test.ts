import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { buildTaskView } from "../../../src/exec/task-view.js";
import { dump } from "../../../src/shared/yaml.js";

describe("buildTaskView agent", () => {
  let dir: string;

  function writeSchedule(trackAgent: unknown, phaseOverrides: unknown[] | undefined): void {
    writeFileSync(
      join(dir, "sch-strategy-launch.yaml"),
      dump({
        kind: "strategy",
        track: "launch",
        phase_sets: {
          review: [{ id: "review", task_suffix: "090", agent: { executor: "phase-executor" } }],
        },
        owner_rules: [
          {
            local_ids: ["doc"],
            owner: "ARC",
            phase_set: "review",
            ...(phaseOverrides ? { phase_overrides: phaseOverrides } : {}),
          },
        ],
      }),
      "utf8",
    );
    writeFileSync(
      join(dir, "sch-track-launch.yaml"),
      dump({
        kind: "track",
        id: "prj-test:sch-track-launch",
        project_id: "prj-test",
        track: "launch",
        settings: {},
        tasks: [
          {
            local_id: "doc",
            phase_suffix: "090",
            phase_set: "review",
            phase_id: "review",
            name: "Review",
            duration_days: 1,
            depends_on: [],
            owner: "ARC",
            ...(trackAgent ? { agent: trackAgent } : {}),
          },
        ],
      }),
      "utf8",
    );
  }

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "specdojo-task-view-agent-"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("uses the strategy phase agent when the track agent was not edited", () => {
    writeSchedule({ executor: "phase-executor" }, undefined);

    const task = buildTaskView(dir, join(dir, "execution"), "T-LAUNCH-doc-090");

    expect(task.agent).toEqual({ executor: "phase-executor" });
  });

  it("ignores an agent edited directly into the track", () => {
    writeSchedule({ executor: "edited-executor" }, undefined);

    const task = buildTaskView(dir, join(dir, "execution"), "T-LAUNCH-doc-090");

    expect(task.agent).toEqual({ executor: "phase-executor" });
  });

  it("uses phase_overrides over both the phase agent and an edited track agent", () => {
    writeSchedule({ executor: "edited-executor" }, [
      { phase: "review", agent: { executor: "override-executor" } },
    ]);

    const task = buildTaskView(dir, join(dir, "execution"), "T-LAUNCH-doc-090");

    expect(task.agent).toEqual({ executor: "override-executor" });
  });
});
