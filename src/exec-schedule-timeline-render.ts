import { type CpmNode, type CpmResult, type ExecState, type ScheduleIndex, type StateSnapshot } from './exec-types.js'
import { formatDateOnlyUtc } from './exec-shared.js'
import {
  buildWorkingTaskSegments,
  dateForWorkingOffset,
  isWorkingDateUtc,
  timelinePositionX,
  timelineStartDate,
  type WorkingTaskSegment,
} from './exec-schedule-calendar.js'

export type TimelineMarkdownSummary = {
  criticalPathTaskCount: number
  progressPercent: string
  doneTasks: string
  taskStateCounts: string
  progressSummaryLines: string[]
}

function xmlEscape(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function dayLabelUtc(dt: Date): string {
  const mm = (dt.getUTCMonth() + 1).toString().padStart(2, '0')
  const dd = dt.getUTCDate().toString().padStart(2, '0')
  return `${mm}/${dd}`
}

function stateColor(state: ExecState | 'milestone', critical: boolean): string {
  if (state === 'milestone') return '#b45309'
  if (state === 'done') return '#16a34a'
  if (state === 'doing') return '#2563eb'
  if (state === 'blocked') return '#f59e0b'
  if (state === 'cancelled') return '#6b7280'
  if (critical) return '#dc2626'
  return '#d1d5db'
}

export function buildTimelineSvg(
  cpm: CpmResult,
  schedule: ScheduleIndex,
  stateSnapshot?: StateSnapshot
): string {
  const rows = Object.values(cpm.nodes).sort((a, b) => a.es - b.es || a.id.localeCompare(b.id))
  const criticalSet = new Set(cpm.critical_path)
  const leftPad = 380
  const topPad = 108
  const bottomPad = 32
  const rowHeight = 24
  const sectionHeight = 30
  const sectionGap = 8
  const dayWidth = 56
  const timelineStart = timelineStartDate(cpm.project_start_date)

  const milestoneRows = rows.filter(r => r.kind === 'milestone')
  const taskRowsByFile = new Map<string, CpmNode[]>()
  for (const row of rows) {
    if (row.kind !== 'task') continue
    const group = taskRowsByFile.get(row.schedule_file)
    if (group) group.push(row)
    else taskRowsByFile.set(row.schedule_file, [row])
  }

  const taskSegments = new Map<string, WorkingTaskSegment[]>()
  let timelineEnd = new Date(timelineStart.getTime())
  for (const row of rows) {
    if (row.kind === 'task') {
      const segments = cpm.project_start_date
        ? buildWorkingTaskSegments(
            cpm.project_start_date,
            row.es,
            row.duration_days,
            schedule.calendar
          )
        : [
            {
              start: dateForWorkingOffset(row.es, cpm.project_start_date, schedule.calendar),
              end: dateForWorkingOffset(row.ef, cpm.project_start_date, schedule.calendar),
            },
          ]
      taskSegments.set(row.id, segments)
      const end = segments[segments.length - 1]?.end
      if (end && end > timelineEnd) timelineEnd = end
      continue
    }

    const milestoneAt = dateForWorkingOffset(row.es, cpm.project_start_date, schedule.calendar)
    if (milestoneAt > timelineEnd) timelineEnd = milestoneAt
  }

  const totalDays = Math.max(
    1,
    Math.ceil((timelineEnd.getTime() - timelineStart.getTime()) / 86400000) + 1
  )
  const chartWidth = totalDays * dayWidth
  const width = leftPad + chartWidth + 40

  const layoutRows: Array<{ type: 'section'; label: string } | { type: 'node'; row: CpmNode }> = []

  // Milestones at the top
  if (milestoneRows.length > 0) {
    layoutRows.push({ type: 'section', label: 'マイルストーン' })
    for (const row of milestoneRows) layoutRows.push({ type: 'node', row })
  }

  // Tasks grouped by file
  for (const [scheduleFile, fileRows] of taskRowsByFile.entries()) {
    layoutRows.push({
      type: 'section',
      label: schedule.section_labels[scheduleFile] ?? scheduleFile,
    })
    for (const row of fileRows) layoutRows.push({ type: 'node', row })
  }

  const height =
    topPad +
    layoutRows.reduce(
      (sum, entry) => sum + (entry.type === 'section' ? sectionHeight + sectionGap : rowHeight),
      0
    ) +
    bottomPad

  const parts: string[] = []
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="プロジェクトタイムライン">`
  )
  parts.push(`<style>
    text { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; fill: #1f2937; }
    .title { font-size: 18px; font-weight: 700; fill: #0f172a; }
    .caption { font-size: 11px; fill: #64748b; }
    .section { font-size: 13px; font-weight: 700; fill: #0f172a; }
    .label { font-size: 12px; font-weight: 500; }
    .axis { font-size: 11px; fill: #475569; }
    .grid { stroke: #d7dee7; stroke-width: 1; }
    .row-grid { stroke: #edf2f7; stroke-width: 1; }
    .shade { fill: #f8fafc; }
    .holiday { fill: #eff6ff; }
    .legend-label { font-size: 11px; fill: #475569; }
  </style>`)
  parts.push(`<rect x="0" y="0" width="${width}" height="${height}" fill="#fffdf8" />`)
  parts.push(`<rect x="0" y="0" width="${leftPad}" height="${height}" fill="#fffaf0" />`)
  parts.push(
    `<rect x="${leftPad}" y="0" width="${chartWidth + 40}" height="${height}" fill="#ffffff" />`
  )
  parts.push(`<text class="title" x="16" y="28">プロジェクトタイムライン</text>`)
  parts.push(
    `<text class="caption" x="16" y="48">1 タスク 1 行で表示します。1 日の長さは ${schedule.calendar.work_hours_per_day} 時間で、休日と週末は空白のままとし、次の稼働日に作業を再開します。</text>`
  )
  parts.push(`<rect x="0" y="${topPad - 36}" width="${width}" height="28" fill="#fff7ed" />`)

  const legendY = 74
  const legend = [
    { label: 'todo', color: '#d1d5db' },
    { label: 'doing', color: '#2563eb' },
    { label: 'done', color: '#16a34a' },
    { label: 'blocked', color: '#f59e0b' },
    { label: 'critical', color: '#dc2626' },
  ]
  let legendX = 16
  for (const item of legend) {
    parts.push(
      `<rect x="${legendX}" y="${legendY - 10}" width="14" height="14" rx="3" fill="${item.color}" />`
    )
    parts.push(
      `<text class="legend-label" x="${legendX + 20}" y="${legendY + 4}">${xmlEscape(item.label)}</text>`
    )
    legendX += 76
  }
  parts.push(`<rect x="${legendX}" y="${legendY - 10}" width="14" height="14" fill="#eff6ff" />`)
  parts.push(`<text class="legend-label" x="${legendX + 20}" y="${legendY + 4}">holiday</text>`)
  legendX += 90
  parts.push(
    `<rect x="${legendX}" y="${legendY - 10}" width="14" height="14" fill="#f8fafc" stroke="#d7dee7" />`
  )
  parts.push(`<text class="legend-label" x="${legendX + 20}" y="${legendY + 4}">weekend</text>`)

  for (let dayIndex = 0; dayIndex < totalDays; dayIndex += 1) {
    const dayStart = new Date(timelineStart.getTime() + dayIndex * 86400000)
    const x = leftPad + dayIndex * dayWidth
    const isWorking = isWorkingDateUtc(dayStart, schedule.calendar)
    if (!isWorking) {
      const shadeClass = schedule.calendar.holidays.has(formatDateOnlyUtc(dayStart))
        ? 'holiday'
        : 'shade'
      parts.push(
        `<rect class="${shadeClass}" x="${x}" y="${topPad - 20}" width="${dayWidth}" height="${height - topPad}" />`
      )
    }
    parts.push(
      `<line class="grid" x1="${x}" y1="${topPad - 20}" x2="${x}" y2="${height - bottomPad}" />`
    )
    parts.push(
      `<text class="axis" x="${x + 6}" y="${topPad - 18}">${xmlEscape(dayLabelUtc(dayStart))}</text>`
    )
  }
  parts.push(
    `<line class="grid" x1="${leftPad + chartWidth}" y1="${topPad - 20}" x2="${leftPad + chartWidth}" y2="${height - bottomPad}" />`
  )

  let currentY = topPad
  for (const entry of layoutRows) {
    if (entry.type === 'section') {
      parts.push(
        `<rect x="0" y="${currentY - 18}" width="${width}" height="${sectionHeight}" fill="#f1f5f9" />`
      )
      parts.push(`<text class="section" x="16" y="${currentY}">${xmlEscape(entry.label)}</text>`)
      parts.push(
        `<line class="grid" x1="0" y1="${currentY + 8}" x2="${width}" y2="${currentY + 8}" />`
      )
      currentY += sectionHeight + sectionGap
      continue
    }

    const row = entry.row
    const rowTop = currentY - 14
    const rowMid = currentY - 2
    const taskState =
      row.kind === 'task' ? (stateSnapshot?.tasks[row.id]?.state ?? 'todo') : 'milestone'
    const fill = stateColor(taskState, criticalSet.has(row.id))
    const label = row.name ? `${row.id} ${row.name}` : row.id

    parts.push(`<text class="label" x="16" y="${currentY}">${xmlEscape(label)}</text>`)
    parts.push(
      `<line class="row-grid" x1="0" y1="${currentY + 8}" x2="${width}" y2="${currentY + 8}" />`
    )

    if (row.kind === 'task') {
      const segments = taskSegments.get(row.id) ?? []
      for (const segment of segments) {
        const startX =
          leftPad + timelinePositionX(segment.start, timelineStart, schedule.calendar, dayWidth)
        const endX =
          leftPad + timelinePositionX(segment.end, timelineStart, schedule.calendar, dayWidth)
        const widthPx = Math.max(2, endX - startX)
        const stroke = criticalSet.has(row.id)
          ? '#991b1b'
          : taskState === 'todo'
            ? '#9ca3af'
            : taskState === 'blocked'
              ? '#b45309'
              : '#334155'
        parts.push(
          `<rect x="${startX}" y="${rowTop}" width="${widthPx}" height="12" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="${criticalSet.has(row.id) ? 1.25 : 0.75}" opacity="0.94" />`
        )
      }
    } else {
      const at = dateForWorkingOffset(row.es, cpm.project_start_date, schedule.calendar)
      const cx = leftPad + timelinePositionX(at, timelineStart, schedule.calendar, dayWidth)
      parts.push(
        `<polygon points="${cx},${rowMid - 7} ${cx + 7},${rowMid} ${cx},${rowMid + 7} ${cx - 7},${rowMid}" fill="${fill}" />`
      )
    }

    currentY += rowHeight
  }

  parts.push(`</svg>`)
  return parts.join('\n')
}

export function buildTimelineMarkdown(cpm: CpmResult, summary: TimelineMarkdownSummary): string {
  const lines: string[] = []
  lines.push(`# タイムライン`)
  lines.push('')
  lines.push(...summary.progressSummaryLines)
  lines.push(`- schedule_path: \`${cpm.schedule_path}\``)
  if (cpm.project_start_date) lines.push(`- project_start_date: \`${cpm.project_start_date}\``)
  lines.push(`- project_duration_days: \`${cpm.project_duration_days}\``)
  lines.push(`- scope: \`full_schedule\``)
  lines.push(`- critical_path_task_count: \`${summary.criticalPathTaskCount}\``)
  lines.push(`- progress_percent: \`${summary.progressPercent}%\``)
  lines.push(`- done_tasks: \`${summary.doneTasks}\``)
  lines.push(`- task_state_counts: \`${summary.taskStateCounts}\``)
  lines.push('')
  lines.push(`![プロジェクトタイムライン](./timeline.svg)`)
  lines.push('')
  return lines.join('\n')
}
