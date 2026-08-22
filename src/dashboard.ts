import { mkdirSync, existsSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";
import type { Command } from "commander";
import { defaultScheduleCalendar, buildScheduleIndex } from "./exec-schedule-index.js";
import { addWorkingDaysToDate } from "./exec-schedule-calendar.js";
import type { ScheduleCalendar, StateSnapshot } from "./exec-types.js";
import { readJson, toArtifactPath } from "./exec-shared.js";
import {
  getProjectExecutionPath,
  getProjectRoutinesPath,
  getProjectSchedulePath,
  getProjectTimelinePath,
  loadConfig,
  loadEnv,
  specdojoRootDir,
} from "./specdojo-config.js";
import type { SpecDojoProjectConfig } from "./specdojo-config.js";
import { resolveRegisterPaths, loadRegisterItems, type PjrItem } from "./register.js";
import {
  buildTimelineWaves,
  loadTimelineIndex,
  type TimelineIndex,
  type TimelineTrackPlan,
} from "./timeline-build.js";
// routine の due 判定は機械可読な正本（interval / trigger + last_scheduled_for / last_run）から同じ
// 関数で算出する。CLI 出力の転記ではなく、routine.ts の実装へ流用して文言解析に依存しない。
import { type RoutineDoc, isRoutineDue, cronOccurrences } from "./routine.js";

// ================================
// Types
// ================================

function generatedBanner(command: string): string {
  return `> このページは \`${command}\` が生成した派生ビューです。正本は Schedule / Timeline（tml-index.yaml）/ 登録簿個票 / routine（rtn-*.yaml・generated/routine-state.json）の機械可読な成果物であり、このページを手編集しても次回のビルドで失われます。`;
}

export type DashboardPaths = {
  projectId: string;
  projectPath: string;
  schedulePath?: string;
  timelinePath: string;
  executionGeneratedPath: string;
  routinesPath?: string;
};

// ================================
// Path resolution
// ================================

function resolveProjectConfig(opts: { project?: string }): {
  projectId: string;
  project: SpecDojoProjectConfig;
} {
  loadEnv();
  const { config, configPath } = loadConfig();
  const baseDir = specdojoRootDir();

  const resolvedId =
    opts.project?.trim() ||
    process.env.SPECDOJO_PROJECT?.trim() ||
    (config ? Object.keys(config.projects)[0] : "");

  if (!config) {
    throw new Error(`dashboard commands require specdojo.config.json.\nRun: specdojo config init`);
  }
  if (!resolvedId) {
    throw new Error("No project specified. Use --project <id> or SPECDOJO_PROJECT.");
  }
  const project = config.projects[resolvedId];
  if (!project) {
    throw new Error(`Unknown project: ${resolvedId} (check ${configPath})`);
  }

  return { projectId: resolvedId, project };
}

export function resolveDashboardPaths(opts: { project?: string }): DashboardPaths {
  const { projectId, project } = resolveProjectConfig(opts);
  const baseDir = specdojoRootDir();

  return {
    projectId,
    projectPath: join(baseDir, getProjectTimelinePath(project), ".."),
    schedulePath: join(baseDir, getProjectSchedulePath(project)),
    executionGeneratedPath: join(join(baseDir, getProjectExecutionPath(project)), "generated"),
    timelinePath: join(baseDir, getProjectTimelinePath(project)),
    routinesPath: (() => {
      const p = getProjectRoutinesPath(project);
      return p ? join(baseDir, p) : undefined;
    })(),
  };
}

// ================================
// 2. Timeline aggregation (date-axis Gantt planning)
// ================================

export type TimelineTrackSchedule = {
  track: string;
  order: number;
  domains: string[];
  status: "not_started" | "draft" | "primary";
  estimateDays?: number;
  parallel_group?: string;
  depends_on: string[];
  startDate?: string;
  endDate?: string;
  wave: number;
};

// tml-index の tracks を order → wave に集約し、planned_start_date と稼働日カレンダーで各トラックの
// 予定開始日・終了日を算出する。横軸は日付であり、wave 番号ではない。
export function computeTimelineTrackSchedules(
  index: TimelineIndex,
  calendar: ScheduleCalendar,
): { schedule: TimelineTrackSchedule[]; plannedStartDate: string | undefined } {
  const waves = buildTimelineWaves(index.tracks);
  const waveNumberByOrder = new Map<number, number>();
  for (const wave of waves) {
    for (const tk of wave.tracks) waveNumberByOrder.set(tk.order, wave.wave);
  }

  const startByTrack = new Map<string, string | undefined>();
  const endByTrack = new Map<string, string | undefined>();
  let cursor: string | undefined = index.planned_start_date;

  for (const wave of waves) {
    const waveStart = cursor;
    let waveEnd: string | undefined;
    for (const tk of wave.tracks) {
      startByTrack.set(tk.track, waveStart);
      if (tk.catalog_duration_estimate_days && waveStart) {
        const end = addWorkingDaysToDate(waveStart, tk.catalog_duration_estimate_days, calendar);
        endByTrack.set(tk.track, end);
        if (!waveEnd || end > waveEnd) waveEnd = end;
      } else {
        endByTrack.set(tk.track, undefined);
      }
    }
    // 次 wave の手始め。本 wave に推定日数のあるトラックがあれば最遅完了日の翌稼働日で、
    // 未定のトラックだけなら直前の手始め日をそのまま受け継ぐ（後続波まで日付が伝播する）。
    cursor = waveEnd ? addWorkingDaysToDate(waveEnd, 1, calendar) : cursor;
  }

  const schedule: TimelineTrackSchedule[] = index.tracks.map((tk) => ({
    track: tk.track,
    order: tk.order,
    domains: tk.domains,
    status: tk.catalog_status,
    estimateDays: tk.catalog_duration_estimate_days,
    parallel_group: tk.parallel_group,
    depends_on: tk.depends_on,
    startDate: startByTrack.get(tk.track),
    endDate: endByTrack.get(tk.track),
    wave: waveNumberByOrder.get(tk.order) ?? 0,
  }));

  return { schedule, plannedStartDate: index.planned_start_date };
}

// 稼働日カレンダーの機械可読正本：tml-index.planned_start_date を起点にし、Schedule 側
// （sch-defaults.yaml と各 sch-*.yaml）の calendar を buildScheduleIndex から復用する。
// 両方とも YAML 正本から機械的に読み取り、表示文言の解析に依存しない。
export function resolveDashboardCalendar(schedulePath: string): ScheduleCalendar {
  try {
    return buildScheduleIndex(schedulePath).calendar;
  } catch {
    return defaultScheduleCalendar();
  }
}

// ================================
// Timeline Gantt SVG (x-axis = date)
// ================================

function xmlEscape(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function statusColor(status: TimelineTrackSchedule["status"]): string {
  if (status === "primary") return "#16a34a";
  if (status === "draft") return "#2563eb";
  return "#d1d5db";
}

// 予定日付の無いトラックはバーを持たずラベルのみ表示する（手始め日 or 推定稼働日が未設定）。
export function buildTimelineGanttSvg(
  schedule: TimelineTrackSchedule[],
  plannedStartDate: string | undefined,
  title = "トラック計画ガントチャート",
): string {
  const dayWidth = 30;
  const rowHeight = 26;
  const leftPad = 240;
  const topPad = 56;
  const bottomPad = 20;

  // バーは startDate かつ endDate 両方を持つトラックへ。開始日のみのトラックは着手順の着手点として
  // 四角（diamond）で表示する。軸の範囲は endDate が無いトラックも startDate を含めて算出する。
  const fullRows = schedule.filter((row) => row.startDate);
  if (fullRows.length === 0 || !plannedStartDate) {
    return noDataTimelineSvg(
      title,
      plannedStartDate
        ? "トラックの予定開始日・終了日を算出できませんでした。"
        : "計画開始日（tml-index.yaml の planned_start_date）が未設定です。",
    );
  }

  const parseMs = (dateOnly: string): number => {
    const [year, month, day] = dateOnly.split("-").map(Number);
    return Date.UTC(year, month - 1, day, 0, 0, 0, 0);
  };
  const startMs = parseMs(plannedStartDate);
  let endMs = startMs;
  for (const row of fullRows) {
    const last = row.endDate ?? row.startDate!;
    if (parseMs(last) > endMs) endMs = parseMs(last);
  }
  const totalDays = Math.max(1, Math.ceil((endMs - startMs) / 86_400_000) + 1);
  const width = leftPad + totalDays * dayWidth + 24;
  const height = topPad + schedule.length * rowHeight + bottomPad;

  const xForDate = (dateOnly: string): number => {
    const daysDiff = Math.floor((parseMs(dateOnly) - startMs) / 86_400_000);
    return leftPad + daysDiff * dayWidth;
  };

  const parts: string[] = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${xmlEscape(title)}">`,
  );
  parts.push(`<style>
    text { font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; fill: #1f2937; }
        .tl-title { font-size: 16px; font-weight: 700; fill: #0f172a; }
        .tl-caption { font-size: 11px; fill: #64748b; }
        .tl-label { font-size: 11px; font-weight: 600; fill: #1f2937; }
        .tl-axis { font-size: 10px; fill: #475569; }
        .tl-grid { stroke: #e2e8f0; stroke-width: 1; }
        .tl-month-grid { stroke: #94a3b8; stroke-width: 1.5; }
        .tl-note { font-size: 10px; fill: #9ca3af; }
      </style>`);
  parts.push(`<rect x="0" y="0" width="${width}" height="${height}" fill="#fffdf8" />`);
  parts.push(`<text class="tl-title" x="16" y="24">${xmlEscape(title)}</text>`);
  parts.push(
    `<text class="tl-caption" x="16" y="42">横軸は日付。予定開始日・予定終了日は tml-index.yaml の planned_start_date と catalog_duration_estimate_days（推定稼働日数）から算出。</text>`,
  );

  for (let offset = 0; offset < totalDays; offset++) {
    const dayMs = startMs + offset * 86_400_000;
    if (new Date(dayMs).getUTCDate() !== 1) continue;
    const x = leftPad + offset * dayWidth;
    parts.push(
      `<line class="tl-month-grid" x1="${x}" y1="${topPad - 22}" x2="${x}" y2="${height - bottomPad}" />`,
    );
    parts.push(
      `<text class="tl-axis" x="${x + 4}" y="${topPad - 8}">${xmlEscape(new Date(dayMs).toISOString().slice(0, 7))}</text>`,
    );
  }

  parts.push(
    `<line class="tl-grid" x1="${leftPad}" y1="${topPad - 22}" x2="${leftPad}" y2="${height - bottomPad}" />`,
  );

  let currentY = topPad;
  for (const row of schedule) {
    parts.push(`<text class="tl-label" x="8" y="${currentY + 14}">${xmlEscape(row.track)}</text>`);
    if (row.startDate && row.endDate) {
      const x1 = xForDate(row.startDate);
      const x2 = xForDate(row.endDate);
      const barWidth = Math.max(4, x2 - x1);
      parts.push(
        `<rect x="${x1}" y="${currentY + 6}" width="${barWidth}" height="12" rx="3" fill="${statusColor(row.status)}" opacity="0.9" />`,
      );
    } else if (row.startDate) {
      // 開始日のみ（推定稼働日数未定）: 着手点の diamond マーカーで表示。
      const cx = xForDate(row.startDate);
      parts.push(
        `<polygon points="${cx},${currentY + 2} ${cx + 6},${currentY + 8} ${cx},${currentY + 14} ${cx - 6},${currentY + 8}" fill="${statusColor(row.status)}" opacity="0.85" />`,
      );
      parts.push(
        `<text class="tl-note" x="${xForDate(row.startDate) + 8}" y="${currentY + 14}">${xmlEscape(datePlanNote(row))}</text>`,
      );
    } else {
      parts.push(
        `<text class="tl-note" x="${leftPad + 4}" y="${currentY + 14}">${xmlEscape(datePlanNote(row))}</text>`,
      );
    }
    parts.push(
      `<line class="tl-grid" x1="0" y1="${currentY + rowHeight}" x2="${width}" y2="${currentY + rowHeight}" />`,
    );
    currentY += rowHeight;
  }
  parts.push(`</svg>`);
  return parts.join("\n");
}

function datePlanNote(row: TimelineTrackSchedule): string {
  if (!row.startDate) return "手始め日未定";
  if (row.endDate === undefined || !row.estimateDays)
    return `着手順 ${row.order}（推定稼働日数未定）`;
  return `${row.startDate} ~ ${row.endDate}`;
}

function noDataTimelineSvg(title: string, message: string): string {
  const width = 560;
  const height = 120;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${xmlEscape(title)}">`,
    `<rect x="0" y="0" width="${width}" height="${height}" fill="#fffdf8" />`,
    `<text class="tl-title" x="16" y="24">${xmlEscape(title)}</text>`,
    `<text x="16" y="72" font-size="13" fill="#64748b">${xmlEscape(message)}</text>`,
    `</svg>`,
  ].join("\n");
}

// ================================
// 3. Register aggregation (ticket frontmatter = source of truth)
// ================================

type RegisterAggregates = {
  statusCounts: Record<string, number>;
  priorityCounts: Record<string, number>;
  total: number;
  error?: string;
};

function aggregateRegister(projectId: string): RegisterAggregates {
  const result: RegisterAggregates = {
    statusCounts: {},
    priorityCounts: {},
    total: 0,
  };
  try {
    const paths = resolveRegisterPaths({ project: projectId });
    const items = loadRegisterItems(paths);
    for (const view of items) {
      const item: PjrItem = view.item;
      result.statusCounts[item.status] = (result.statusCounts[item.status] ?? 0) + 1;
      result.priorityCounts[item.priority] = (result.priorityCounts[item.priority] ?? 0) + 1;
    }
    result.total = items.length;
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
  }
  return result;
}

// ================================
// 4. Routine aggregation (rtn-*.yaml + generated/routine-state.json)
// ================================

export type DashboardRoutineRow = {
  id: string;
  name?: string;
  enabled: boolean;
  schedule: string;
  kind: string;
  lastRun: string;
  due: "due" | "-" | "disabled";
};

type RoutineAggregates = {
  rows: DashboardRoutineRow[];
  error?: string;
};

export type DashboardRoutineStateEntry = {
  last_run?: string;
  last_result?: string;
  last_scheduled_for?: string;
};

// routine ファイル（rtn-*.yaml）を読み、状態ファイル generated/routine-state.json と突き合わせて
// 最終実行・実行結果・due 状況を得る。CLI 出力（routine list）の転記に依存しない。
function aggregateRoutines(routinesPath: string | undefined): RoutineAggregates {
  if (!routinesPath || !existsSync(routinesPath)) return { rows: [] };

  const result: RoutineAggregates = { rows: [], error: undefined };
  const stateEntries = readRoutineStateEntries(
    join(routinesPath, "generated", "routine-state.json"),
  );
  const now = new Date();

  const files = readdirSync(routinesPath)
    .filter((name) => /^rtn-.*\.(ya?ml)$/.test(name))
    .sort();

  for (const file of files) {
    try {
      const doc = parseRoutineFileSafe(join(routinesPath, file));
      if (!doc?.id || typeof doc.id !== "string") continue;
      buildRoutineRow(result, doc, stateEntries, now);
    } catch {
      result.error = `routine file parse failed: ${file}`;
    }
  }

  result.rows.sort((a, b) => a.id.localeCompare(b.id));
  return result;
}

// generated/routine-state.json の routines.<id> が状態の正本。破損時は空。
function readRoutineStateEntries(statePath: string): Record<string, DashboardRoutineStateEntry> {
  const entries: Record<string, DashboardRoutineStateEntry> = {};
  if (!existsSync(statePath)) return entries;

  try {
    const parsed = readJson(statePath) as Record<string, unknown>;
    const routines = parsed?.routines;
    if (routines && typeof routines === "object") {
      for (const [id, value] of Object.entries(routines as Record<string, unknown>)) {
        if (value && typeof value === "object") {
          const entry = value as Record<string, unknown>;
          entries[id] = {
            last_run: typeof entry.last_run === "string" ? entry.last_run : undefined,
            last_result: typeof entry.last_result === "string" ? entry.last_result : undefined,
            last_scheduled_for:
              typeof entry.last_scheduled_for === "string" ? entry.last_scheduled_for : undefined,
          };
        }
      }
    }
  } catch {
    return {};
  }

  return entries;
}

function parseRoutineFileSafe(filePath: string): RoutineDoc | undefined {
  let parsed: unknown;
  try {
    parsed = yaml.load(readFileSync(filePath, "utf8"));
  } catch {
    return undefined;
  }
  if (!parsed || typeof parsed !== "object") return undefined;
  return parsed as RoutineDoc;
}

// routine 1 行を機械可読な正本から集計し、due は now と状態から判定する。
function buildRoutineRow(
  result: RoutineAggregates,
  doc: RoutineDoc,
  stateEntries: Record<string, DashboardRoutineStateEntry>,
  now: Date,
): void {
  const id = String(doc.id);
  const enabled = doc.enabled === undefined ? true : (doc.enabled as boolean);
  const kind =
    doc.action && typeof doc.action === "object"
      ? String((doc.action as Record<string, unknown>).kind ?? "-")
      : "-";

  const stateEntry = stateEntries[id];
  let lastRun = "-";
  if (stateEntry?.last_run) {
    lastRun = stateEntry.last_result
      ? `${stateEntry.last_run} (${stateEntry.last_result})`
      : stateEntry.last_run;
  }

  result.rows.push({
    id,
    name: typeof doc.name === "string" ? doc.name : undefined,
    enabled,
    schedule: routineScheduleLabel(doc),
    kind,
    lastRun,
    due: computeRoutineDue(doc, stateEntry, enabled, now),
  });
}

// interval / trigger + 現在時刻 + 状態（last_run / last_scheduled_for）から due を機械的に判定する。
export function computeRoutineDue(
  doc: RoutineDoc,
  stateEntry: DashboardRoutineStateEntry | undefined,
  enabled: boolean,
  now: Date,
): "due" | "-" | "disabled" {
  if (!enabled) return "disabled";

  if (doc.trigger) {
    const occurrences = cronOccurrences(doc, stateEntry?.last_scheduled_for, now);
    return occurrences.length > 0 ? "due" : "-";
  }
  if (doc.interval) {
    return isRoutineDue(doc, stateEntry?.last_run, now) ? "due" : "-";
  }

  return "-";
}

// interval / trigger を表すラベル。interval 優先、なければ trigger.cron。
function routineScheduleLabel(doc: RoutineDoc): string {
  if (typeof doc.interval === "string") return doc.interval;
  const trigger = doc.trigger;
  if (trigger && typeof trigger.cron === "string") return `cron: ${trigger.cron}`;
  return "-";
}

// ================================
// Markdown rendering
// ================================

function escapeCell(text: string): string {
  return text.replace(/\|/g, "\\|").replace(/\n/g, " ").trim();
}

const STATUS_ORDER = [
  "open",
  "in-progress",
  "waiting",
  "review",
  "decided",
  "done",
  "deferred",
  "rejected",
];
const PRIORITY_ORDER = ["high", "medium", "low"];

function countTable(
  keyLabel: string,
  counts: Record<string, number>,
  order: readonly string[],
): string {
  const orderedKeys = Object.keys(counts)
    .sort((a, b) => {
      const ai = order.indexOf(a);
      const bi = order.indexOf(b);
      const rankA = ai === -1 ? order.length : ai;
      const rankB = bi === -1 ? order.length : bi;
      return rankA !== rankB ? rankA - rankB : a.localeCompare(b);
    })
    .filter((key) => counts[key] > 0);

  if (orderedKeys.length === 0) return "（該当項目なし）";

  const lines: string[] = [];
  lines.push(`| ${keyLabel} | 件数 |`);
  lines.push("| --- | ---: |");
  for (const key of orderedKeys) lines.push(`| \`${key}\` | ${counts[key]} |`);

  return lines.join("\n");
}

// ================================
// Section renderers
// ================================

function renderScheduleSection(paths: DashboardPaths): string[] {
  const lines = ["## 1. Schedule進捗", ""];

  if (!existsSync(paths.executionGeneratedPath)) {
    lines.push(
      "- Schedule はまだ生成されていません（`specdojo exec refresh` を実行してください）。",
    );
    lines.push("");
    return lines;
  }

  try {
    const state = existsSync(join(paths.executionGeneratedPath, "state.json"))
      ? (readJson(join(paths.executionGeneratedPath, "state.json")) as StateSnapshot)
      : undefined;

    const ready = existsSync(join(paths.executionGeneratedPath, "ready.json"))
      ? readJson(join(paths.executionGeneratedPath, "ready.json"))
      : undefined;

    if (state) {
      const counts: Record<string, number> = {
        todo: 0,
        doing: 0,
        blocked: 0,
        done: 0,
        cancelled: 0,
      };
      for (const taskState of Object.values(state.tasks)) {
        const s = taskState.state;
        if (s in counts) counts[s] += 1;
      }
      const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
      const doneEquivalent = counts.done + counts.doing * 0.5;
      const percent = total > 0 ? ((doneEquivalent / total) * 100).toFixed(1) : "0.0";
      lines.push(`- 進捗率（done＋doing×0.5）: \`${percent}%\``);
      lines.push(
        `- 状態別: \`todo=${counts.todo}, doing=${counts.doing}, blocked=${counts.blocked}, done=${counts.done}, cancelled=${counts.cancelled}\``,
      );

      lines.push("");
    }

    if (ready && typeof ready === "object") {
      const r = ready as {
        ready_count?: number;
        strategies?: Record<string, { next_task_id?: string | null }>;
      };
      lines.push(`- 着手可能タスク（ready）: \`${r.ready_count ?? 0}\`件`);
      if (r.strategies?.["critical-first"]?.next_task_id) {
        lines.push(
          `- 次の着手候補（critical-first）: \`${r.strategies["critical-first"].next_task_id}\``,
        );
      }
      lines.push("");
    }
  } catch {
    lines.push("- Schedule の集計に失敗しました（state.json / ready.json が不正）。");
    lines.push("");
  }

  lines.push("- 詳細ガントチャート: [`execution/generated/gantt-chart.md`](./gantt-chart.md)");
  lines.push("![Scheduleガントチャート](./gantt-chart.svg)");
  lines.push("");
  return lines;
}

function renderTimelineSection(paths: DashboardPaths): string[] {
  const lines = ["## 2. タイムライン（トラック着手順序）", ""];
  const indexPath = join(paths.timelinePath, "tml-index.yaml");

  if (!existsSync(indexPath)) {
    lines.push("- タイムラインデータを読み込めませんでした（tml-index.yaml が存在しません）。");
    lines.push("");
    return lines;
  }

  try {
    const { index } = loadTimelineIndex(indexPath);
    const scheduleReadyTracks = index.tracks
      .filter((t) => t.catalog_status === "primary")
      .map((t) => t.track)
      .sort();

    const waves = buildTimelineWaves(index.tracks);

    const calendar = resolveDashboardCalendar(paths.schedulePath ?? paths.timelinePath);
    const { schedule, plannedStartDate } = computeTimelineTrackSchedules(index, calendar);

    lines.push(`- 計画開始日（planned_start_date）: \`${plannedStartDate ?? "-"}\``);
    lines.push(`- wave数: \`${waves.length}\``);
    lines.push(
      `- Schedule展開準備状況（catalog_status=primary）: \`${scheduleReadyTracks.join(", ") || "-"}\``,
    );
    lines.push("");

    lines.push("### Wave・トラック一覧");
    lines.push("");
    lines.push(
      "| wave | track | catalog_status | 推定稼働日数 | 予定開始日 | 予定終了日 | parallel_group | depends_on |",
    );
    lines.push("| ---: | --- | --- | ---: | --- | --- | --- | --- |");
    for (const wave of waves) {
      for (const tk of wave.tracks) {
        const row = schedule.find((s) => s.track === tk.track);
        if (!row) continue;
        lines.push(
          `| ${wave.wave} | \`${tk.track}\` | \`${tk.catalog_status}\` | ${formatEstimate(tk)} | ${row.startDate ?? "-"} | ${row.endDate ?? "-"} | ${escapeCell(row.parallel_group ?? "-")} | ${escapeCell(row.depends_on.join(", ") || "-")} |`,
        );
      }
    }
    lines.push("");

    lines.push("### トラック計画ガントチャート");
    lines.push("");
    lines.push("![トラック計画ガントチャート](./dashboard-timeline-gantt.svg)");
    lines.push("");

    return lines;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    lines.push(`- タイムラインの集計に失敗しました: ${message}`);
    lines.push("");
    return lines;
  }
}

function formatEstimate(track: TimelineTrackPlan): string {
  return track.catalog_duration_estimate_days === undefined
    ? "-"
    : String(track.catalog_duration_estimate_days);
}

function renderRegisterSection(projectId: string): string[] {
  const agg = aggregateRegister(projectId);
  const lines = ["## 3. 登録簿状況", ""];

  if (agg.error) {
    lines.push(`- 登録簿の集計に失敗しました: ${agg.error}`);
    lines.push("");
    return lines;
  }

  lines.push(`- 総件数: \`${agg.total}\``);
  lines.push("");
  lines.push("### 状態別");
  lines.push("");
  lines.push(countTable("状態", agg.statusCounts, STATUS_ORDER));
  lines.push("");
  lines.push("### 優先度別");
  lines.push("");
  lines.push(countTable("優先度", agg.priorityCounts, PRIORITY_ORDER));
  lines.push("");

  return lines;
}

function renderRoutineSection(paths: DashboardPaths): string[] {
  const agg = aggregateRoutines(paths.routinesPath);
  const lines = ["## 4. routine実行状況", ""];

  if (agg.error) lines.push(`- routine 集計に失敗しました: ${agg.error}`);
  if (agg.rows.length === 0) {
    lines.push("- （定義された routine がありません）");
    lines.push("");
    return lines;
  }

  lines.push("| id | name | enabled | 間隔 / cron | kind | 最終実行 / 結果 | due |");
  lines.push("| --- | --- | --- | --- | --- | --- | :---: |");
  for (const row of agg.rows) {
    lines.push(
      `| \`${row.id}\` | ${escapeCell(row.name ?? "-")} | ${row.enabled ? "enabled" : "disabled"} | \`${escapeCell(row.schedule)}\` | \`${row.kind}\` | ${escapeCell(row.lastRun)} | ${row.due} |`,
    );
  }

  lines.push("");
  return lines;
}

// ================================
// Build entry
// ================================

export type DashboardBuildResult = {
  projectId: string;
  generatedFiles: string[];
  errors: string[];
  warnings: string[];
};

export function buildDashboardMarkdown(paths: DashboardPaths): string {
  const lines: string[] = [];
  const nowLabel = new Date().toISOString().replace(/\.\d{3}Z$/, "");

  lines.push("# プロジェクトダッシュボード");
  lines.push("");
  lines.push(`- project_id: \`${paths.projectId}\``);
  lines.push(`- generated_at: \`${nowLabel}\``);
  lines.push(`- 再生成: \`specdojo dashboard build --project ${paths.projectId}\``);
  lines.push("");
  lines.push(generatedBanner("specdojo dashboard build"));
  lines.push("");

  lines.push(...renderScheduleSection(paths));
  lines.push(...renderTimelineSection(paths));
  lines.push(...renderRegisterSection(paths.projectId));
  lines.push(...renderRoutineSection(paths));

  // 各セクションは次のセクションとの区切りとして空行で終わる。最後のセクションの空行を
  // そのまま残すと、書き出し時に付ける改行と合わさって末尾が空行2行になり markdownlint の
  // MD012 に触れるため、ここで末尾の空行を落とす。
  return lines.join("\n").replace(/\n+$/, "");
}

export function writeDashboard(paths: DashboardPaths): {
  markdown: string;
  generatedFiles: string[];
} {
  mkdirSync(paths.executionGeneratedPath, { recursive: true });

  const markdown = buildDashboardMarkdown(paths);
  const generatedFiles: string[] = [];

  const mdPath = join(paths.executionGeneratedPath, "dashboard.md");
  writeFileSync(mdPath, markdown + "\n", "utf8");
  generatedFiles.push(toArtifactPath(mdPath));

  // timeline gantt SVG を並置。tml-index が無い／壊れている場合はスキップ。
  const indexPath = join(paths.timelinePath, "tml-index.yaml");
  if (existsSync(indexPath)) {
    try {
      const { index } = loadTimelineIndex(indexPath);
      const calendar = resolveDashboardCalendar(paths.schedulePath ?? paths.timelinePath);
      const { schedule, plannedStartDate } = computeTimelineTrackSchedules(index, calendar);
      const svgPath = join(paths.executionGeneratedPath, "dashboard-timeline-gantt.svg");
      writeFileSync(svgPath, buildTimelineGanttSvg(schedule, plannedStartDate) + "\n", "utf8");
      generatedFiles.push(toArtifactPath(svgPath));
    } catch {
      // SVG 生成失敗は markdown に影響しないため破棄（renderTimelineSection でエラー表示済み）。
    }
  }

  return { markdown, generatedFiles };
}

export function buildDashboard(opts: { project?: string }): DashboardBuildResult {
  const paths = resolveDashboardPaths(opts);
  const { generatedFiles } = writeDashboard(paths);
  return { projectId: paths.projectId, generatedFiles, errors: [], warnings: [] };
}

// build-command ステップで使う出力先の解決を公開する。
export function dashboardOutputFiles(paths: DashboardPaths): string[] {
  return ["dashboard.md", "dashboard-timeline-gantt.svg"].map((name) =>
    toArtifactPath(join(paths.executionGeneratedPath, name)),
  );
}

// ================================
// CLI command
// ================================

function printCommandError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  process.stdout.write(message + "\n");
  process.exitCode = 1;
}

export function registerDashboardCommands(program: Command): void {
  const dash = program.command("dashboard").description("Per-project dashboard build commands");

  const bcmd = dash
    .command("build")
    .description("Generate per-project dashboard.md and timeline Gantt chart SVG")
    .option("--project <id>", "Project id in specdojo.config.json")
    .option("--dry-run", "Print generated content to stdout without writing", false);

  bcmd.action((opts) => {
    try {
      if (opts.dryRun) {
        const paths = resolveDashboardPaths(opts);
        process.stdout.write(`\n# --- (dry-run) dashboard.md ---\n\n`);
        process.stdout.write(buildDashboardMarkdown(paths) + "\n");
        return;
      }

      const result = buildDashboard(opts);
      if (result.errors.length > 0) {
        for (const error of result.errors) printCommandError(new Error(error));
        return;
      }

      process.stdout.write(
        `Generated dashboard: ${result.generatedFiles.map((f) => `\n   ${f}`).join("")}\n`,
      );
    } catch (error) {
      printCommandError(error);
    }
  });
}

// build-command で使う path 解決ヘルパーを公開する。
export {
  getProjectExecutionPath,
  getProjectRoutinesPath,
  getProjectSchedulePath,
  getProjectTimelinePath,
};
