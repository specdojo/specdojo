import { type CpmNode, type CpmResult, type ScheduleIndex } from "./exec-types.js";

export type GanttChartScopeSpec = {
  // 出力ファイル名の基底（拡張子なし）。例: "gantt-chart", "gantt-chart-track-launch"。
  fileBase: string;
  // SVG タイトルおよび Markdown H1。
  title: string;
  // Markdown の scope フィールド値。例: "full_schedule", "milestones", "track:launch"。
  scopeLabel: string;
  // SVG に描画するノード ID 集合。null は全ノード（full）を意味する。
  renderIds: Set<string> | null;
  // critical path を色付け・件数表示するか。full のみ true。
  keepCriticalPath: boolean;
  // 進捗サマリーの母集団となる task ID 集合。null は全 task（プロジェクト全体）。
  progressIds: Set<string> | null;
};

function trackNameFromScheduleFilePath(file: string): string | null {
  const match = /sch-track-(.+)\.ya?ml$/.exec(file);
  return match ? match[1] : null;
}

export function scheduleTrackNames(schedule: ScheduleIndex): string[] {
  const names = new Set<string>();
  for (const file of schedule.files) {
    const track = trackNameFromScheduleFilePath(file);
    if (track) names.add(track);
  }
  return [...names].sort((a, b) => a.localeCompare(b));
}

// 開始（最小 es）が早い track から順に返す。同着はトラック名昇順。
function tracksOrderedByStart(cpm: CpmResult): string[] {
  const minEsByTrack = new Map<string, number>();
  for (const node of Object.values(cpm.nodes)) {
    if (node.kind !== "task") continue;
    const track = trackNameFromScheduleFilePath(node.schedule_file);
    if (!track) continue;
    const current = minEsByTrack.get(track);
    if (current === undefined || node.es < current) minEsByTrack.set(track, node.es);
  }
  return [...minEsByTrack.entries()]
    .sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]))
    .map(([track]) => track);
}

function nodeBelongsToTrack(node: CpmNode, track: string): boolean {
  if (node.kind === "task") {
    return trackNameFromScheduleFilePath(node.schedule_file) === track;
  }
  // gate/milestone は track を id 接頭辞（G-<TRACK>- / M-<TRACK>-）で表す。
  const upper = track.toUpperCase();
  return node.id.startsWith(`G-${upper}-`) || node.id.startsWith(`M-${upper}-`);
}

function trackRenderIds(cpm: CpmResult, track: string): Set<string> {
  const ids = new Set<string>();
  for (const node of Object.values(cpm.nodes)) {
    if (nodeBelongsToTrack(node, track)) ids.add(node.id);
  }
  return ids;
}

function trackTaskIds(cpm: CpmResult, track: string): Set<string> {
  const ids = new Set<string>();
  for (const node of Object.values(cpm.nodes)) {
    if (node.kind === "task" && nodeBelongsToTrack(node, track)) ids.add(node.id);
  }
  return ids;
}

function milestoneRenderIds(cpm: CpmResult): Set<string> {
  const ids = new Set<string>();
  for (const node of Object.values(cpm.nodes)) {
    if (node.kind === "milestone" || node.kind === "gate") ids.add(node.id);
  }
  return ids;
}

// cpm.nodes を id 集合で絞り込んだ CpmResult を返す。project_duration_days は
// 部分集合の最大 ef で再計算し、critical_path は keepCriticalPath 時のみ残す。
export function filterCpmNodes(
  cpm: CpmResult,
  ids: Set<string>,
  keepCriticalPath: boolean,
): CpmResult {
  const nodes: Record<string, CpmNode> = {};
  for (const [id, node] of Object.entries(cpm.nodes)) {
    if (ids.has(id)) nodes[id] = node;
  }
  const projectDuration = Object.values(nodes).reduce((max, node) => Math.max(max, node.ef), 0);
  return {
    ...cpm,
    nodes,
    project_duration_days: projectDuration,
    critical_path: keepCriticalPath ? cpm.critical_path.filter((id) => ids.has(id)) : [],
  };
}

// full / milestones / track-<name> の順で生成対象 scope を列挙する。
export function buildGanttChartScopeSpecs(cpm: CpmResult): GanttChartScopeSpec[] {
  const specs: GanttChartScopeSpec[] = [
    {
      fileBase: "gantt-chart",
      title: "プロジェクトガントチャート",
      scopeLabel: "full_schedule",
      renderIds: null,
      keepCriticalPath: true,
      progressIds: null,
    },
    {
      fileBase: "gantt-chart-milestones",
      title: "マイルストーン概要",
      scopeLabel: "milestones",
      renderIds: milestoneRenderIds(cpm),
      keepCriticalPath: false,
      // マイルストーン概要はプロジェクト全体の進捗を示す。
      progressIds: null,
    },
  ];

  for (const track of tracksOrderedByStart(cpm)) {
    specs.push({
      fileBase: `gantt-chart-track-${track}`,
      title: `トラックガントチャート（${track}）`,
      scopeLabel: `track:${track}`,
      renderIds: trackRenderIds(cpm, track),
      keepCriticalPath: false,
      progressIds: trackTaskIds(cpm, track),
    });
  }

  return specs;
}
