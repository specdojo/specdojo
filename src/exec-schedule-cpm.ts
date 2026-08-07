import { type CpmNode, type CpmResult, type ScheduleIndex } from "./exec-types.js";
import { toArtifactPath, toScheduleFilePath } from "./exec-shared.js";
import { workingDayOffsetForDate } from "./exec-schedule-calendar.js";

export function topoSort(schedule: ScheduleIndex): { order: string[]; cycle?: string[] } {
  const indeg = new Map<string, number>();
  const out = new Map<string, string[]>();

  for (const id of schedule.nodes.keys()) {
    indeg.set(id, 0);
    out.set(id, []);
  }

  for (const node of schedule.nodes.values()) {
    for (const dep of node.depends_on) {
      out.get(dep)?.push(node.id);
      indeg.set(node.id, (indeg.get(node.id) ?? 0) + 1);
    }
  }

  const q: string[] = [];
  for (const [id, d] of indeg.entries()) if (d === 0) q.push(id);
  q.sort();

  const order: string[] = [];
  while (q.length) {
    const id = q.shift()!;
    order.push(id);
    for (const nxt of out.get(id)!) {
      indeg.set(nxt, (indeg.get(nxt) ?? 0) - 1);
      if ((indeg.get(nxt) ?? 0) === 0) {
        q.push(nxt);
        q.sort();
      }
    }
  }

  if (order.length !== schedule.nodes.size) {
    const rem = Array.from(indeg.entries())
      .filter(([, d]) => d > 0)
      .map(([id]) => id);
    return { order, cycle: rem };
  }
  return { order };
}

export function computeCpm(schedule: ScheduleIndex, projectPath: string): CpmResult {
  const { order, cycle } = topoSort(schedule);
  if (cycle && cycle.length)
    throw new Error(`schedule dependency cycle detected: ${cycle.join(", ")}`);

  const nodes: Record<string, CpmNode> = {};

  // schedule_file（生パス）ごとの start_date を、project_start_date を基準にした
  // 稼働日オフセットへ変換する。track が明示した start_date より前に開始しないための
  // es 下限（床）として使う。project_start_date が無い場合はオフセット 0。
  const fileStartOffsets = new Map<string, number>();
  if (schedule.start_date) {
    for (const [file, date] of schedule.file_start_dates) {
      fileStartOffsets.set(
        file,
        workingDayOffsetForDate(schedule.start_date, date, schedule.calendar),
      );
    }
  }

  for (const id of order) {
    const n = schedule.nodes.get(id)!;
    const startFloor = fileStartOffsets.get(n.schedule_file) ?? 0;
    const es =
      n.depends_on.length === 0
        ? startFloor
        : Math.max(startFloor, ...n.depends_on.map((d) => nodes[d].ef));
    const ef = es + n.duration_days;

    nodes[id] = {
      id,
      name: n.name,
      owner: n.owner,
      kind: n.kind,
      duration_days: n.duration_days,
      es,
      ef,
      ls: 0,
      lf: 0,
      slack: 0,
      depends_on: n.depends_on,
      schedule_file: toScheduleFilePath(projectPath, n.schedule_file),
      ...(n.tags ? { tags: n.tags } : {}),
    };
  }

  const projectDuration = Math.max(...Object.values(nodes).map((n) => n.ef), 0);

  const succ = new Map<string, string[]>();
  for (const id of schedule.nodes.keys()) succ.set(id, []);
  for (const n of schedule.nodes.values()) {
    for (const dep of n.depends_on) succ.get(dep)!.push(n.id);
  }

  const rev = [...order].reverse();
  for (const id of rev) {
    const s = succ.get(id)!;
    const lf = s.length === 0 ? projectDuration : Math.min(...s.map((child) => nodes[child].ls));
    const ls = lf - nodes[id].duration_days;
    nodes[id].lf = lf;
    nodes[id].ls = ls;
    nodes[id].slack = ls - nodes[id].es;
  }

  const critical = new Set(
    Object.values(nodes)
      .filter((n) => n.slack === 0)
      .map((n) => n.id),
  );
  const criticalNodes = Object.values(nodes).filter((n) => critical.has(n.id));
  // track 床の導入で起点 es は必ずしも 0 にならないため、critical ノードの
  // 最小 es を起点として検出する（単一 track では従来どおり es === 0）。
  const minCriticalEs = criticalNodes.length ? Math.min(...criticalNodes.map((n) => n.es)) : 0;
  const starts = criticalNodes
    .filter((n) => n.es === minCriticalEs)
    .sort((a, b) => a.id.localeCompare(b.id));

  const path: string[] = [];
  if (starts.length) {
    let cur = starts[0].id;
    path.push(cur);
    while (true) {
      const nexts = (succ.get(cur) ?? [])
        .filter((x) => critical.has(x))
        .filter((x) => nodes[x].es === nodes[cur].ef)
        .sort((a, b) => a.localeCompare(b));
      if (!nexts.length) break;
      cur = nexts[0];
      path.push(cur);
    }
  }

  return {
    schedule_path: toArtifactPath(projectPath),
    project_start_date: schedule.start_date,
    project_duration_days: projectDuration,
    nodes,
    critical_path: path,
  };
}
