import {
  type CpmNode,
  type CpmResult,
  type ExecState,
  type ScheduleIndex,
  type StateSnapshot,
} from "./exec-types.js";
import { formatDateOnlyUtc, formatDays } from "./exec-shared.js";
import {
  buildWorkingTaskSegments,
  dateForWorkingOffset,
  isWorkingDateUtc,
  timelineStartDate,
  workingMinutesPerDay,
  type WorkingTaskSegment,
} from "./exec-schedule-calendar.js";

export type TimelineMarkdownSummary = {
  criticalPathTaskCount: number;
  progressPercent: string;
  doneTasks: string;
  taskStateCounts: string;
  progressSummaryLines: string[];
};

function xmlEscape(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function dayLabelUtc(dt: Date): string {
  const mm = (dt.getUTCMonth() + 1).toString().padStart(2, "0");
  const dd = dt.getUTCDate().toString().padStart(2, "0");
  return `${mm}/${dd}`;
}

function stateColor(state: ExecState | "milestone" | "gate", critical: boolean): string {
  if (state === "gate") return "#7c3aed";
  if (state === "milestone") return "#b45309";
  if (state === "done") return "#16a34a";
  if (state === "doing") return "#2563eb";
  if (state === "blocked") return "#f59e0b";
  if (state === "cancelled") return "#6b7280";
  if (critical) return "#dc2626";
  return "#d1d5db";
}

export function buildTimelineSvg(
  cpm: CpmResult,
  schedule: ScheduleIndex,
  stateSnapshot?: StateSnapshot,
  options?: { title?: string },
): string {
  const title = options?.title ?? "プロジェクトタイムライン";
  const rows = Object.values(cpm.nodes).sort((a, b) => a.es - b.es || a.id.localeCompare(b.id));
  const criticalSet = new Set(cpm.critical_path);

  // コード列（col1）に表示する文字列。タスクは local_id-phase_suffix、
  // ゲート・マイルストーンは row.id をそのまま使う（描画ループと同じ導出規則）。
  const col1LabelFor = (row: CpmNode): string => {
    if (row.kind !== "task") return row.id;
    const scheduleNode = schedule.nodes.get(row.id);
    const localId = scheduleNode?.local_id ?? "";
    const phaseSuffix = scheduleNode?.phase_suffix ?? "";
    return localId && phaseSuffix ? `${localId}-${phaseSuffix}` : localId || phaseSuffix || row.id;
  };

  // フェーズセット列（col3）に表示する文字列。strategy.yaml の phase_sets
  // キー（例: retrofit-pass-2）で、同じフェーズの1回目・2回目などを区別する。
  // ゲート・マイルストーンには対応する phase_set がないため空文字にする。
  const col3LabelFor = (row: CpmNode): string => {
    if (row.kind !== "task") return "";
    return schedule.nodes.get(row.id)?.phase_set ?? "";
  };

  // Left panel column boundaries — col1（コード列）・col3（フェーズセット列）は、
  // このチャートに登場する最長の文字列がクリップされずに収まる幅へ動的に広げる。
  // col2（成果物名・168px）・col4（フェーズ名・142px）の幅は従来値を維持する。
  const monospaceCharWidthPx = 6.5;
  const col1MinWidth = 114;
  const col3MinWidth = 90;
  const colTextPadding = 6;
  const maxCol1Chars = rows.reduce((max, row) => Math.max(max, col1LabelFor(row).length), 0);
  const col1Width = Math.max(
    col1MinWidth,
    Math.ceil(maxCol1Chars * monospaceCharWidthPx) + colTextPadding,
  );
  const maxCol3Chars = rows.reduce((max, row) => Math.max(max, col3LabelFor(row).length), 0);
  const col3Width = Math.max(
    col3MinWidth,
    Math.ceil(maxCol3Chars * monospaceCharWidthPx) + colTextPadding,
  );
  const col2Width = 168;
  const col4Width = 142;
  const col1X = 8;
  const col1DivX = col1X + col1Width;
  const col2X = col1DivX + 4;
  const col2DivX = col2X + col2Width;
  const col3X = col2DivX + 4;
  const col3DivX = col3X + col3Width;
  const col4X = col3DivX + 4;
  const leftPad = col4X + col4Width;
  const topPad = 108;
  const bottomPad = 32;
  const rowHeight = 24;
  const sectionHeight = 30;
  const sectionGap = 8;
  const dayWidth = 56;
  const timelineStart = timelineStartDate(cpm.project_start_date);

  const isInitialComplete = (r: CpmNode) => r.tags?.includes("initial-complete") ?? false;
  const milestoneRows = rows.filter((r) => r.kind === "milestone");
  const taskRowsByFile = new Map<string, CpmNode[]>();
  let firstTaskFile: string | null = null;
  for (const row of rows) {
    if (row.kind !== "task") continue;
    if (isInitialComplete(row)) continue; // handled separately
    if (!firstTaskFile) firstTaskFile = row.schedule_file;
    const group = taskRowsByFile.get(row.schedule_file);
    if (group) group.push(row);
    else taskRowsByFile.set(row.schedule_file, [row]);
  }

  // Insert each gate row immediately after its last dependency task in the first task file section
  const gateRows = rows.filter((r) => r.kind === "gate");
  const insertedGateIds = new Set<string>();
  if (firstTaskFile && gateRows.length > 0) {
    const fileRows = taskRowsByFile.get(firstTaskFile) ?? [];
    const rowIndexById = new Map(fileRows.map((r, i) => [r.id, i]));

    // Sort gates by their insertion position descending so back-to-front splicing keeps indices stable
    const insertions = gateRows
      .map((gate) => {
        const depIndices = gate.depends_on
          .map((depId) => rowIndexById.get(depId) ?? -1)
          .filter((idx) => idx >= 0);
        return {
          gate,
          insertAfter: depIndices.length > 0 ? Math.max(...depIndices) : fileRows.length - 1,
        };
      })
      .sort((a, b) => b.insertAfter - a.insertAfter);

    for (const { gate, insertAfter } of insertions) {
      fileRows.splice(insertAfter + 1, 0, gate);
      insertedGateIds.add(gate.id);
    }
    taskRowsByFile.set(firstTaskFile, fileRows);
  }

  // Gates with no task section to attach to (e.g. milestones-only scope) are rendered
  // alongside milestones so the節目 stays visible.
  const orphanGateRows = gateRows.filter((r) => !insertedGateIds.has(r.id));

  const dayIndexOf = (dt: Date): number =>
    Math.floor((dt.getTime() - timelineStart.getTime()) / 86400000);

  // タスクバー・マイルストーン・ゲートが載る日（timelineStart からの日インデックス）。
  // アクティブでない日の連続区間は時間軸で圧縮表示する。
  const activeDays = new Set<number>();

  const taskSegments = new Map<string, WorkingTaskSegment[]>();
  let timelineEnd = new Date(timelineStart.getTime());
  for (const row of rows) {
    if (row.kind === "task") {
      const segments = cpm.project_start_date
        ? buildWorkingTaskSegments(
            cpm.project_start_date,
            row.es,
            row.duration_days,
            schedule.calendar,
          )
        : [
            {
              start: dateForWorkingOffset(row.es, cpm.project_start_date, schedule.calendar),
              end: dateForWorkingOffset(row.ef, cpm.project_start_date, schedule.calendar),
            },
          ];
      taskSegments.set(row.id, segments);
      const end = segments[segments.length - 1]?.end;
      if (end && end > timelineEnd) timelineEnd = end;
      if (isInitialComplete(row)) continue; // no bar → does not activate days
      for (const segment of segments) {
        const from = dayIndexOf(segment.start);
        // end が翌日 00:00 のとき翌日を誤って含めないよう 1ms 戻す
        const to = dayIndexOf(new Date(segment.end.getTime() - 1));
        for (let k = from; k <= to; k += 1) activeDays.add(k);
      }
      continue;
    }

    const milestoneAt = dateForWorkingOffset(row.es, cpm.project_start_date, schedule.calendar);
    if (milestoneAt > timelineEnd) timelineEnd = milestoneAt;
    activeDays.add(dayIndexOf(milestoneAt));
  }

  const totalDays = Math.max(
    1,
    Math.ceil((timelineEnd.getTime() - timelineStart.getTime()) / 86400000) + 1,
  );

  // 圧縮軸レイアウト: 非アクティブ日が minCompressRun 日以上連続する区間を
  // 1 本の gap カラムに畳む。それ以外は従来どおり dayWidth の day カラム。
  const minCompressRun = 3;
  const gapWidth = 48;
  type AxisColumn =
    | { kind: "day"; dayIndex: number; x: number }
    | { kind: "gap"; fromDay: number; days: number; x: number };
  const columns: AxisColumn[] = [];
  const dayX = new Map<number, number>();
  let cursorX = 0;
  let dayCursor = 0;
  while (dayCursor < totalDays) {
    if (!activeDays.has(dayCursor)) {
      let runEnd = dayCursor;
      while (runEnd < totalDays && !activeDays.has(runEnd)) runEnd += 1;
      const runLength = runEnd - dayCursor;
      if (runLength >= minCompressRun) {
        columns.push({ kind: "gap", fromDay: dayCursor, days: runLength, x: cursorX });
        for (let k = dayCursor; k < runEnd; k += 1) dayX.set(k, cursorX);
        cursorX += gapWidth;
        dayCursor = runEnd;
        continue;
      }
    }
    columns.push({ kind: "day", dayIndex: dayCursor, x: cursorX });
    dayX.set(dayCursor, cursorX);
    cursorX += dayWidth;
    dayCursor += 1;
  }
  const chartWidth = cursorX;
  const width = leftPad + chartWidth + 40;

  const xForDate = (dt: Date): number => {
    const midnight = new Date(dt.getTime());
    midnight.setUTCHours(0, 0, 0, 0);
    const dayIndex = dayIndexOf(midnight);
    const baseX = dayX.get(dayIndex) ?? 0;
    const minutesFromMidnight = dt.getUTCHours() * 60 + dt.getUTCMinutes();
    const relative = Math.max(
      0,
      Math.min(1, minutesFromMidnight / workingMinutesPerDay(schedule.calendar)),
    );
    return leftPad + baseX + relative * dayWidth;
  };

  const layoutRows: Array<{ type: "section"; label: string } | { type: "node"; row: CpmNode }> = [];

  // Milestones at the top (with orphan gates that had no task section to attach to)
  if (milestoneRows.length > 0 || orphanGateRows.length > 0) {
    layoutRows.push({ type: "section", label: "マイルストーン" });
    for (const row of milestoneRows) layoutRows.push({ type: "node", row });
    for (const row of orphanGateRows) layoutRows.push({ type: "node", row });
  }

  // Tasks (+ gates merged in) grouped by file
  // initial-complete rows appear first in the first task file section (no bar)
  const initialCompleteRows = rows.filter((r) => r.kind === "task" && isInitialComplete(r));
  let initialCompleteInserted = false;
  for (const [scheduleFile, fileRows] of taskRowsByFile.entries()) {
    layoutRows.push({
      type: "section",
      label: schedule.section_labels[scheduleFile] ?? scheduleFile,
    });
    if (!initialCompleteInserted && initialCompleteRows.length > 0) {
      for (const row of initialCompleteRows) layoutRows.push({ type: "node", row });
      initialCompleteInserted = true;
    }
    for (const row of fileRows) layoutRows.push({ type: "node", row });
  }

  const height =
    topPad +
    layoutRows.reduce(
      (sum, entry) => sum + (entry.type === "section" ? sectionHeight + sectionGap : rowHeight),
      0,
    ) +
    bottomPad;

  const parts: string[] = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${xmlEscape(title)}">`,
  );
  parts.push(`<style>
    text { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; fill: #1f2937; }
    .title { font-size: 18px; font-weight: 700; fill: #0f172a; }
    .caption { font-size: 11px; fill: #64748b; }
    .section { font-size: 13px; font-weight: 700; fill: #0f172a; }
    .label { font-size: 12px; font-weight: 600; fill: #1f2937; }
    .label-artifact { font-size: 11px; font-weight: 400; fill: #6b7280; }
    .label-id { font-size: 10px; font-family: ui-monospace, 'Courier New', monospace; fill: #9ca3af; }
    .label-phase-set { font-size: 10px; font-family: ui-monospace, 'Courier New', monospace; fill: #6b7280; }
    .axis { font-size: 11px; fill: #475569; }
    .col-div { stroke: #d7dee7; stroke-width: 1; }
    .grid { stroke: #d7dee7; stroke-width: 1; }
    .row-grid { stroke: #edf2f7; stroke-width: 1; }
    .shade { fill: #f8fafc; }
    .holiday { fill: #eff6ff; }
    .legend-label { font-size: 11px; fill: #475569; }
    .month-grid { stroke: #94a3b8; stroke-width: 2; }
    .gap { fill: #f1f5f9; }
    .gap-div { stroke: #94a3b8; stroke-width: 1; stroke-dasharray: 3 3; }
    .gap-label { font-size: 10px; fill: #64748b; }
  </style>`);
  parts.push(`<defs>
    <clipPath id="clip-col1"><rect x="${col1X}" y="0" width="${col1DivX - col1X}" height="${height}" /></clipPath>
    <clipPath id="clip-col2"><rect x="${col2X}" y="0" width="${col2DivX - col2X}" height="${height}" /></clipPath>
    <clipPath id="clip-col3"><rect x="${col3X}" y="0" width="${col3DivX - col3X}" height="${height}" /></clipPath>
    <clipPath id="clip-col4"><rect x="${col4X}" y="0" width="${leftPad - col4X}" height="${height}" /></clipPath>
  </defs>`);
  parts.push(`<rect x="0" y="0" width="${width}" height="${height}" fill="#fffdf8" />`);
  parts.push(`<rect x="0" y="0" width="${leftPad}" height="${height}" fill="#fffaf0" />`);
  parts.push(
    `<rect x="${leftPad}" y="0" width="${chartWidth + 40}" height="${height}" fill="#ffffff" />`,
  );
  parts.push(`<text class="title" x="16" y="28">${xmlEscape(title)}</text>`);
  parts.push(
    `<text class="caption" x="16" y="48">1 タスク 1 行で表示します。1 日の長さは ${schedule.calendar.work_hours_per_day} 時間で、休日と週末は空白のままとし、次の稼働日に作業を再開します。タスクが無い期間は ⋯ で圧縮表示します。</text>`,
  );
  parts.push(`<rect x="0" y="${topPad - 36}" width="${width}" height="28" fill="#fff7ed" />`);

  const legendY = 74;
  const legend = [
    { label: "todo", color: "#d1d5db" },
    { label: "doing", color: "#2563eb" },
    { label: "done", color: "#16a34a" },
    { label: "blocked", color: "#f59e0b" },
    { label: "critical", color: "#dc2626" },
    { label: "gate", color: "#7c3aed" },
  ];
  let legendX = 16;
  for (const item of legend) {
    parts.push(
      `<rect x="${legendX}" y="${legendY - 10}" width="14" height="14" rx="3" fill="${item.color}" />`,
    );
    parts.push(
      `<text class="legend-label" x="${legendX + 20}" y="${legendY + 4}">${xmlEscape(item.label)}</text>`,
    );
    legendX += 76;
  }
  parts.push(`<rect x="${legendX}" y="${legendY - 10}" width="14" height="14" fill="#eff6ff" />`);
  parts.push(`<text class="legend-label" x="${legendX + 20}" y="${legendY + 4}">holiday</text>`);
  legendX += 90;
  parts.push(
    `<rect x="${legendX}" y="${legendY - 10}" width="14" height="14" fill="#f8fafc" stroke="#d7dee7" />`,
  );
  parts.push(`<text class="legend-label" x="${legendX + 20}" y="${legendY + 4}">weekend</text>`);

  // Column header labels
  parts.push(`<text class="axis" x="${col1X}" y="${topPad - 18}">コード</text>`);
  parts.push(`<text class="axis" x="${col2X}" y="${topPad - 18}">成果物名</text>`);
  parts.push(`<text class="axis" x="${col3X}" y="${topPad - 18}">フェーズセット</text>`);
  parts.push(`<text class="axis" x="${col4X}" y="${topPad - 18}">フェーズ</text>`);

  for (const column of columns) {
    if (column.kind === "gap") {
      const x = leftPad + column.x;
      // 圧縮区間: 薄い塗り + 破線の区切り + 「⋯ N日」ラベル
      parts.push(
        `<rect class="gap" x="${x}" y="${topPad - 20}" width="${gapWidth}" height="${height - topPad}" />`,
      );
      parts.push(
        `<line class="gap-div" x1="${x}" y1="${topPad - 20}" x2="${x}" y2="${height - bottomPad}" />`,
      );
      parts.push(
        `<line class="gap-div" x1="${x + gapWidth}" y1="${topPad - 20}" x2="${x + gapWidth}" y2="${height - bottomPad}" />`,
      );
      parts.push(
        `<text class="gap-label" x="${x + gapWidth / 2}" y="${topPad - 18}" text-anchor="middle">⋯${column.days}日</text>`,
      );
      continue;
    }

    const dayStart = new Date(timelineStart.getTime() + column.dayIndex * 86400000);
    const x = leftPad + column.x;
    const isWorking = isWorkingDateUtc(dayStart, schedule.calendar);
    const dayOfWeek = dayStart.getUTCDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isMonthStart = dayStart.getUTCDate() === 1;
    const isHoliday = schedule.calendar.holidays.has(formatDateOnlyUtc(dayStart));

    if (isHoliday) {
      parts.push(
        `<rect class="holiday" x="${x}" y="${topPad - 20}" width="${dayWidth}" height="${height - topPad}" />`,
      );
    } else if (!isWorking || isWeekend) {
      parts.push(
        `<rect class="shade" x="${x}" y="${topPad - 20}" width="${dayWidth}" height="${height - topPad}" />`,
      );
    }
    parts.push(
      `<line class="${isMonthStart ? "month-grid" : "grid"}" x1="${x}" y1="${topPad - 20}" x2="${x}" y2="${height - bottomPad}" />`,
    );
    parts.push(
      `<text class="axis" x="${x + 6}" y="${topPad - 18}">${xmlEscape(dayLabelUtc(dayStart))}</text>`,
    );
  }
  parts.push(
    `<line class="grid" x1="${leftPad + chartWidth}" y1="${topPad - 20}" x2="${leftPad + chartWidth}" y2="${height - bottomPad}" />`,
  );
  // Vertical column dividers in left panel
  parts.push(
    `<line class="col-div" x1="${col1DivX}" y1="${topPad - 22}" x2="${col1DivX}" y2="${height - bottomPad}" />`,
  );
  parts.push(
    `<line class="col-div" x1="${col2DivX}" y1="${topPad - 22}" x2="${col2DivX}" y2="${height - bottomPad}" />`,
  );
  parts.push(
    `<line class="col-div" x1="${col3DivX}" y1="${topPad - 22}" x2="${col3DivX}" y2="${height - bottomPad}" />`,
  );

  let currentY = topPad;
  for (const entry of layoutRows) {
    if (entry.type === "section") {
      parts.push(
        `<rect x="0" y="${currentY - 18}" width="${width}" height="${sectionHeight}" fill="#f1f5f9" />`,
      );
      parts.push(`<text class="section" x="16" y="${currentY}">${xmlEscape(entry.label)}</text>`);
      parts.push(
        `<line class="grid" x1="0" y1="${currentY + 8}" x2="${width}" y2="${currentY + 8}" />`,
      );
      currentY += sectionHeight + sectionGap;
      continue;
    }

    const row = entry.row;
    const rowTop = currentY - 14;
    const rowMid = currentY - 2;
    const taskState =
      row.kind === "task"
        ? (stateSnapshot?.tasks[row.id]?.state ?? "todo")
        : row.kind === "gate"
          ? "gate"
          : "milestone";
    const fill = stateColor(taskState, criticalSet.has(row.id));
    const scheduleNode = schedule.nodes.get(row.id);

    if (row.kind === "gate") {
      parts.push(
        `<rect x="0" y="${currentY - 14}" width="${width}" height="${rowHeight}" fill="#f3e8ff" />`,
      );
    }
    if (row.kind === "task" && isInitialComplete(row)) {
      parts.push(
        `<rect x="0" y="${currentY - 14}" width="${width}" height="${rowHeight}" fill="#f8fafc" />`,
      );
    }

    if (row.kind === "task") {
      const shortId = col1LabelFor(row);
      const artifactName = scheduleNode?.artifact_name ?? "";
      const phaseSet = col3LabelFor(row);
      const taskName = row.name ?? "";
      parts.push(
        `<text class="label-id" x="${col1X}" y="${currentY}" clip-path="url(#clip-col1)">${xmlEscape(shortId)}</text>`,
      );
      if (artifactName)
        parts.push(
          `<text class="label-artifact" x="${col2X}" y="${currentY}" clip-path="url(#clip-col2)">${xmlEscape(artifactName)}</text>`,
        );
      if (phaseSet)
        parts.push(
          `<text class="label-phase-set" x="${col3X}" y="${currentY}" clip-path="url(#clip-col3)">${xmlEscape(phaseSet)}</text>`,
        );
      if (taskName)
        parts.push(
          `<text class="label" x="${col4X}" y="${currentY}" clip-path="url(#clip-col4)">${xmlEscape(taskName)}</text>`,
        );
    } else {
      const domainName = scheduleNode?.artifact_name ?? "";
      const milestoneName = row.name ?? "";
      parts.push(
        `<text class="label-id" x="${col1X}" y="${currentY}" clip-path="url(#clip-col1)">${xmlEscape(row.id)}</text>`,
      );
      if (domainName)
        parts.push(
          `<text class="label-artifact" x="${col2X}" y="${currentY}" clip-path="url(#clip-col2)">${xmlEscape(domainName)}</text>`,
        );
      if (milestoneName)
        parts.push(
          `<text class="label" x="${col4X}" y="${currentY}" clip-path="url(#clip-col4)">${xmlEscape(milestoneName)}</text>`,
        );
    }
    parts.push(
      `<line class="row-grid" x1="0" y1="${currentY + 8}" x2="${width}" y2="${currentY + 8}" />`,
    );

    if (row.kind === "task" && isInitialComplete(row)) {
      // No Gantt bar for completed deliverables — row label only
    } else if (row.kind === "task") {
      const segments = taskSegments.get(row.id) ?? [];
      for (const segment of segments) {
        const startX = xForDate(segment.start);
        const endX = xForDate(segment.end);
        const widthPx = Math.max(2, endX - startX);
        const stroke = criticalSet.has(row.id)
          ? "#991b1b"
          : taskState === "todo"
            ? "#9ca3af"
            : taskState === "blocked"
              ? "#b45309"
              : "#334155";
        parts.push(
          `<rect x="${startX}" y="${rowTop}" width="${widthPx}" height="12" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="${criticalSet.has(row.id) ? 1.25 : 0.75}" opacity="0.94" />`,
        );
      }
    } else if (row.kind === "gate") {
      const at = dateForWorkingOffset(row.es, cpm.project_start_date, schedule.calendar);
      const cx = xForDate(at);
      // Vertical bar with top/bottom caps (gate/barrier symbol)
      parts.push(
        `<rect x="${cx - 2}" y="${rowTop}" width="4" height="12" fill="${fill}" opacity="0.9" />`,
      );
      parts.push(
        `<rect x="${cx - 7}" y="${rowTop}" width="14" height="3" rx="1" fill="${fill}" opacity="0.9" />`,
      );
      parts.push(
        `<rect x="${cx - 7}" y="${rowTop + 9}" width="14" height="3" rx="1" fill="${fill}" opacity="0.9" />`,
      );
    } else {
      const at = dateForWorkingOffset(row.es, cpm.project_start_date, schedule.calendar);
      const cx = xForDate(at);
      parts.push(
        `<polygon points="${cx},${rowMid - 7} ${cx + 7},${rowMid} ${cx},${rowMid + 7} ${cx - 7},${rowMid}" fill="${fill}" />`,
      );
    }

    currentY += rowHeight;
  }

  parts.push(`</svg>`);
  return parts.join("\n");
}

export function buildTimelineMarkdown(
  cpm: CpmResult,
  summary: TimelineMarkdownSummary,
  options?: { title?: string; svgFileName?: string; scopeLabel?: string },
): string {
  const title = options?.title ?? "タイムライン";
  const svgFileName = options?.svgFileName ?? "timeline.svg";
  const scopeLabel = options?.scopeLabel ?? "full_schedule";

  const lines: string[] = [];
  lines.push(`# ${title}`);
  lines.push("");
  lines.push(...summary.progressSummaryLines);
  lines.push(`- schedule_path: \`${cpm.schedule_path}\``);
  if (cpm.project_start_date) lines.push(`- project_start_date: \`${cpm.project_start_date}\``);
  lines.push(`- project_duration_days: \`${formatDays(cpm.project_duration_days)}\``);
  lines.push(`- scope: \`${scopeLabel}\``);
  lines.push(`- critical_path_task_count: \`${summary.criticalPathTaskCount}\``);
  lines.push(`- progress_percent: \`${summary.progressPercent}%\``);
  lines.push(`- done_tasks: \`${summary.doneTasks}\``);
  lines.push(`- task_state_counts: \`${summary.taskStateCounts}\``);
  lines.push("");
  lines.push(`![${title}](./${svgFileName})`);
  lines.push("");
  return lines.join("\n");
}
