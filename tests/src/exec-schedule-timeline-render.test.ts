import { describe, expect, it } from "vitest";
import { buildTimelineSvg } from "../../src/exec-schedule-timeline-render.js";
import type { CpmNode, CpmResult, ScheduleIndex } from "../../src/exec-types.js";

function node(partial: Partial<CpmNode> & Pick<CpmNode, "id" | "kind">): CpmNode {
  return {
    name: partial.name ?? partial.id,
    duration_days: partial.duration_days ?? 0,
    es: partial.es ?? 0,
    ef: partial.ef ?? partial.es ?? 0,
    ls: 0,
    lf: 0,
    slack: 0,
    depends_on: partial.depends_on ?? [],
    schedule_file: partial.schedule_file ?? "docs/x/schedule/sch-milestones.yaml",
    ...partial,
  };
}

function makeCpm(nodes: CpmNode[]): CpmResult {
  const map: Record<string, CpmNode> = {};
  for (const n of nodes) map[n.id] = n;
  return {
    schedule_path: "docs/x/schedule",
    project_start_date: "2026-06-15",
    project_duration_days: Math.max(0, ...nodes.map((n) => n.ef)),
    nodes: map,
    critical_path: [],
  };
}

function makeSchedule(): ScheduleIndex {
  return {
    nodes: new Map(),
    files: ["docs/x/schedule/sch-milestones.yaml"],
    start_date: "2026-06-15",
    calendar: {
      timezone: "UTC",
      workdays: new Set([0, 1, 2, 3, 4, 5, 6]),
      holidays: new Set<string>(),
      work_hours_per_day: 8,
    },
    section_labels: {},
    file_start_dates: new Map(),
  };
}

describe("buildTimelineSvg", () => {
  it("options.title を SVG タイトルと aria-label に反映する", () => {
    const svg = buildTimelineSvg(
      makeCpm([node({ id: "M-A", kind: "milestone" })]),
      makeSchedule(),
      undefined,
      {
        title: "マイルストーン概要",
      },
    );

    expect(svg).toContain('aria-label="マイルストーン概要"');
    expect(svg).toContain(">マイルストーン概要</text>");
  });

  it("task が無い scope でも gate をマイルストーン節に描画する", () => {
    // milestones-only scope: task セクションが無くても gate 行が消えないこと。
    const svg = buildTimelineSvg(
      makeCpm([
        node({ id: "M-DONE", kind: "milestone", es: 2, ef: 2 }),
        node({ id: "G-DATA-FLOW-retrofit-pass", kind: "gate", es: 3, ef: 3 }),
      ]),
      makeSchedule(),
    );

    expect(svg).toContain(">M-DONE</text>");
    expect(svg).toContain(">G-DATA-FLOW-retrofit-pass</text>");
  });

  it("タスクが無い長い期間を圧縮カラムに畳む", () => {
    // 全日稼働。es=0 と es=20 の間（1〜19 日）はタスクが無く圧縮対象。
    const svg = buildTimelineSvg(
      makeCpm([
        node({
          id: "T-A",
          kind: "task",
          es: 0,
          ef: 1,
          duration_days: 1,
          schedule_file: "docs/x/schedule/sch-track-launch.yaml",
        }),
        node({
          id: "T-B",
          kind: "task",
          es: 20,
          ef: 21,
          duration_days: 1,
          schedule_file: "docs/x/schedule/sch-track-launch.yaml",
        }),
      ]),
      makeSchedule(),
    );

    expect(svg).toContain('class="gap-label"');
    expect(svg).toContain("⋯");
  });

  it("短い空白期間（閾値未満）は圧縮しない", () => {
    // es=0 と es=2 の間の空白は 1 日のみ（minCompressRun=3 未満）。
    const svg = buildTimelineSvg(
      makeCpm([
        node({
          id: "T-A",
          kind: "task",
          es: 0,
          ef: 1,
          duration_days: 1,
          schedule_file: "docs/x/schedule/sch-track-launch.yaml",
        }),
        node({
          id: "T-B",
          kind: "task",
          es: 2,
          ef: 3,
          duration_days: 1,
          schedule_file: "docs/x/schedule/sch-track-launch.yaml",
        }),
      ]),
      makeSchedule(),
    );

    expect(svg).not.toContain('class="gap-label"');
  });
});
