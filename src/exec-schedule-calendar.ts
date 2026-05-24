import { type ScheduleCalendar } from './exec-types.js'
import { formatDateOnlyUtc } from './exec-shared.js'

export type WorkingTaskSegment = {
  start: Date
  end: Date
}

function scheduleAnchorDateUtc(): number {
  return Date.UTC(2000, 0, 1, 0, 0, 0, 0)
}

export function workingMinutesPerDay(calendar: ScheduleCalendar): number {
  return Math.max(1, Math.round(calendar.work_hours_per_day * 60))
}

function endOfWorkingDayUtc(dt: Date, calendar: ScheduleCalendar): Date {
  const end = new Date(dt.getTime())
  end.setUTCHours(0, 0, 0, 0)
  end.setUTCMinutes(workingMinutesPerDay(calendar))
  return end
}

export function isWorkingDateUtc(dt: Date, calendar: ScheduleCalendar): boolean {
  const dateOnly = formatDateOnlyUtc(dt)
  return calendar.workdays.has(dt.getUTCDay()) && !calendar.holidays.has(dateOnly)
}

function advanceToNextWorkingInstantUtc(dt: Date, calendar: ScheduleCalendar): void {
  while (true) {
    if (!isWorkingDateUtc(dt, calendar)) {
      dt.setUTCDate(dt.getUTCDate() + 1)
      dt.setUTCHours(0, 0, 0, 0)
      continue
    }

    const minutesFromStart = dt.getUTCHours() * 60 + dt.getUTCMinutes()
    if (minutesFromStart >= workingMinutesPerDay(calendar)) {
      dt.setUTCDate(dt.getUTCDate() + 1)
      dt.setUTCHours(0, 0, 0, 0)
      continue
    }

    return
  }
}

export function addWorkingDayOffset(
  startDate: string,
  dayOffset: number,
  calendar: ScheduleCalendar
): Date {
  const [year, month, day] = startDate.split('-').map(Number)
  const dt = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))

  advanceToNextWorkingInstantUtc(dt, calendar)

  let remainingMinutes = Math.round(dayOffset * workingMinutesPerDay(calendar))
  while (remainingMinutes > 0) {
    advanceToNextWorkingInstantUtc(dt, calendar)

    const workingDayEnd = endOfWorkingDayUtc(dt, calendar)

    const usableMinutes = Math.round((workingDayEnd.getTime() - dt.getTime()) / (60 * 1000))
    if (remainingMinutes < usableMinutes) {
      dt.setUTCMinutes(dt.getUTCMinutes() + remainingMinutes)
      remainingMinutes = 0
      break
    }

    dt.setTime(workingDayEnd.getTime())
    remainingMinutes -= usableMinutes
  }

  advanceToNextWorkingInstantUtc(dt, calendar)
  return dt
}

export function buildWorkingTaskSegments(
  startDate: string,
  startOffset: number,
  durationDays: number,
  calendar: ScheduleCalendar
): WorkingTaskSegment[] {
  const cursor = addWorkingDayOffset(startDate, startOffset, calendar)
  let remainingMinutes = Math.round(durationDays * workingMinutesPerDay(calendar))
  const segments: WorkingTaskSegment[] = []

  while (remainingMinutes > 0) {
    advanceToNextWorkingInstantUtc(cursor, calendar)

    const workingDayEnd = endOfWorkingDayUtc(cursor, calendar)

    const usableMinutes = Math.round((workingDayEnd.getTime() - cursor.getTime()) / (60 * 1000))
    const segmentMinutes = Math.min(remainingMinutes, usableMinutes)
    const segmentStart = new Date(cursor.getTime())
    const segmentEnd = new Date(cursor.getTime())
    segmentEnd.setUTCMinutes(segmentEnd.getUTCMinutes() + segmentMinutes)

    segments.push({ start: segmentStart, end: segmentEnd })

    cursor.setTime(segmentEnd.getTime())
    remainingMinutes -= segmentMinutes
  }

  return segments
}

function timelineAnchorDate(startDate: string | null): Date {
  if (!startDate) return new Date(scheduleAnchorDateUtc())
  const [year, month, day] = startDate.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
}

export function dateForWorkingOffset(
  dayOffset: number,
  startDate: string | null,
  calendar: ScheduleCalendar
): Date {
  return startDate
    ? addWorkingDayOffset(startDate, dayOffset, calendar)
    : new Date(
        scheduleAnchorDateUtc() + Math.round(dayOffset * workingMinutesPerDay(calendar)) * 60 * 1000
      )
}

export function timelinePositionX(
  dt: Date,
  timelineStart: Date,
  calendar: ScheduleCalendar,
  dayWidth: number
): number {
  const midnight = new Date(dt.getTime())
  midnight.setUTCHours(0, 0, 0, 0)
  const dayIndex = Math.floor((midnight.getTime() - timelineStart.getTime()) / 86400000)
  const minutesFromMidnight = dt.getUTCHours() * 60 + dt.getUTCMinutes()
  const relative = Math.max(0, Math.min(1, minutesFromMidnight / workingMinutesPerDay(calendar)))
  return (dayIndex + relative) * dayWidth
}

export function timelineStartDate(startDate: string | null): Date {
  return timelineAnchorDate(startDate)
}
