import { describe, expect, it } from "vitest";
import {
  buildGanttChartScopeSpecs,
  filterCpmNodes,
  scheduleTrackNames,
} from "../../src/exec-schedule-gantt-chart-scope.js";
import type { CpmNode, CpmResult, ScheduleIndex } from "../../src/exec-types.js";

function node(partial: Partial<CpmNode> & Pick<CpmNode, "id" | "kind">): CpmNode {
  return {
    name: partial.id,
    duration_days: partial.duration_days ?? 1,
    es: partial.es ?? 0,
    ef: partial.ef ?? (partial.es ?? 0) + (partial.duration_days ?? 1),
    ls: 0,
    lf: 0,
    slack: 0,
    depends_on: partial.depends_on ?? [],
    schedule_file: partial.schedule_file ?? "docs/x/schedule/sch-track-launch.yaml",
    ...partial,
  };
}

function makeCpm(nodes: CpmNode[], criticalPath: string[] = []): CpmResult {
  const map: Record<string, CpmNode> = {};
  for (const n of nodes) map[n.id] = n;
  return {
    schedule_path: "docs/x/schedule",
    project_start_date: "2026-06-15",
    project_duration_days: Math.max(0, ...nodes.map((n) => n.ef)),
    nodes: map,
    critical_path: criticalPath,
  };
}

describe("scheduleTrackNames", () => {
  it("sch-track-<name>.yaml から track 名を昇順で抽出する", () => {
    const schedule = {
      files: [
        "docs/x/schedule/sch-track-launch.yaml",
        "docs/x/schedule/sch-milestones.yaml",
        "docs/x/schedule/sch-track-data-flow.yaml",
      ],
    } as unknown as ScheduleIndex;

    expect(scheduleTrackNames(schedule)).toEqual(["data-flow", "launch"]);
  });
});

describe("filterCpmNodes", () => {
  it("id 集合で絞り込み project_duration_days を部分集合の最大 ef で再計算する", () => {
    const cpm = makeCpm(
      [
        node({ id: "A", kind: "task", es: 0, ef: 2 }),
        node({ id: "B", kind: "task", es: 2, ef: 10 }),
      ],
      ["A", "B"],
    );

    const filtered = filterCpmNodes(cpm, new Set(["A"]), false);

    expect(Object.keys(filtered.nodes)).toEqual(["A"]);
    expect(filtered.project_duration_days).toBe(2);
  });

  it("keepCriticalPath=false のとき critical_path を空にする", () => {
    const cpm = makeCpm([node({ id: "A", kind: "task" })], ["A"]);

    expect(filterCpmNodes(cpm, new Set(["A"]), false).critical_path).toEqual([]);
    expect(filterCpmNodes(cpm, new Set(["A"]), true).critical_path).toEqual(["A"]);
  });
});

describe("buildGanttChartScopeSpecs", () => {
  const cpm = makeCpm([
    node({
      id: "T-LAUNCH-a-005",
      kind: "task",
      es: 0,
      ef: 1,
      schedule_file: "docs/x/schedule/sch-track-launch.yaml",
    }),
    node({
      id: "T-DATA-FLOW-b-005",
      kind: "task",
      es: 52,
      ef: 53,
      schedule_file: "docs/x/schedule/sch-track-data-flow.yaml",
    }),
    node({ id: "M-LAUNCH-done", kind: "milestone", es: 1, ef: 1 }),
    node({ id: "G-DATA-FLOW-retrofit-pass", kind: "gate", es: 53, ef: 53 }),
  ]);

  it("full → milestones → track（開始が早い順）の順で scope を列挙する", () => {
    const specs = buildGanttChartScopeSpecs(cpm);

    expect(specs.map((s) => s.scopeLabel)).toEqual([
      "full_schedule",
      "milestones",
      "track:launch",
      "track:data-flow",
    ]);
  });

  it("full scope は全ノード描画・critical path 表示・全 task 進捗", () => {
    const full = buildGanttChartScopeSpecs(cpm)[0];

    expect(full.renderIds).toBeNull();
    expect(full.keepCriticalPath).toBe(true);
    expect(full.progressIds).toBeNull();
  });

  it("milestones scope は milestone/gate のみ描画し進捗はプロジェクト全体", () => {
    const milestones = buildGanttChartScopeSpecs(cpm).find((s) => s.scopeLabel === "milestones")!;

    expect([...milestones.renderIds!].sort()).toEqual([
      "G-DATA-FLOW-retrofit-pass",
      "M-LAUNCH-done",
    ]);
    expect(milestones.keepCriticalPath).toBe(false);
    expect(milestones.progressIds).toBeNull();
  });

  it("track scope は task を schedule_file、gate/milestone を id 接頭辞で収集する", () => {
    const dataFlow = buildGanttChartScopeSpecs(cpm).find(
      (s) => s.scopeLabel === "track:data-flow",
    )!;

    expect([...dataFlow.renderIds!].sort()).toEqual([
      "G-DATA-FLOW-retrofit-pass",
      "T-DATA-FLOW-b-005",
    ]);
    // 進捗母集団は task のみ（gate は含めない）。
    expect([...dataFlow.progressIds!]).toEqual(["T-DATA-FLOW-b-005"]);
    expect(dataFlow.keepCriticalPath).toBe(false);
  });
});
