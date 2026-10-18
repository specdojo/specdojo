import { addWorkingDaysToDate } from "../exec/schedule/calendar.js";
import { buildScheduleIndex, defaultScheduleCalendar } from "../shared/schedule-index.js";
import type { ScheduleCalendar } from "../exec/types.js";
import { buildTimelineWaves, type TimelineIndex } from "./timeline-build.js";

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
