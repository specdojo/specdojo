import { type ScheduleCalendar } from "./exec-types.js";
import { formatDateOnlyUtc } from "./exec-shared.js";

export type WorkingTaskSegment = {
  start: Date;
  end: Date;
};

function scheduleAnchorDateUtc(): number {
  return Date.UTC(2000, 0, 1, 0, 0, 0, 0);
}

export function workingMinutesPerDay(calendar: ScheduleCalendar): number {
  return Math.max(1, Math.round(calendar.work_hours_per_day * 60));
}

function endOfWorkingDayUtc(dt: Date, calendar: ScheduleCalendar): Date {
  const end = new Date(dt.getTime());
  end.setUTCHours(0, 0, 0, 0);
  end.setUTCMinutes(workingMinutesPerDay(calendar));
  return end;
}

export function isWorkingDateUtc(dt: Date, calendar: ScheduleCalendar): boolean {
  const dateOnly = formatDateOnlyUtc(dt);
  return calendar.workdays.has(dt.getUTCDay()) && !calendar.holidays.has(dateOnly);
}

function advanceToNextWorkingInstantUtc(dt: Date, calendar: ScheduleCalendar): void {
  assertCalendarHasWorkingDay(calendar);
  while (true) {
    if (!isWorkingDateUtc(dt, calendar)) {
      dt.setUTCDate(dt.getUTCDate() + 1);
      dt.setUTCHours(0, 0, 0, 0);
      continue;
    }

    const minutesFromStart = dt.getUTCHours() * 60 + dt.getUTCMinutes();
    if (minutesFromStart >= workingMinutesPerDay(calendar)) {
      dt.setUTCDate(dt.getUTCDate() + 1);
      dt.setUTCHours(0, 0, 0, 0);
      continue;
    }

    return;
  }
}

export function addWorkingDayOffset(
  startDate: string,
  dayOffset: number,
  calendar: ScheduleCalendar,
): Date {
  const [year, month, day] = startDate.split("-").map(Number);
  const dt = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));

  advanceToNextWorkingInstantUtc(dt, calendar);

  let remainingMinutes = Math.round(dayOffset * workingMinutesPerDay(calendar));
  while (remainingMinutes > 0) {
    advanceToNextWorkingInstantUtc(dt, calendar);

    const workingDayEnd = endOfWorkingDayUtc(dt, calendar);

    const usableMinutes = Math.round((workingDayEnd.getTime() - dt.getTime()) / (60 * 1000));
    if (remainingMinutes < usableMinutes) {
      dt.setUTCMinutes(dt.getUTCMinutes() + remainingMinutes);
      remainingMinutes = 0;
      break;
    }

    dt.setTime(workingDayEnd.getTime());
    remainingMinutes -= usableMinutes;
  }

  advanceToNextWorkingInstantUtc(dt, calendar);
  return dt;
}

export function workingDayOffsetForDate(
  startDate: string,
  targetDate: string,
  calendar: ScheduleCalendar,
): number {
  const toMidnightUtc = (dateOnly: string): Date => {
    const [year, month, day] = dateOnly.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  };

  const cursor = toMidnightUtc(startDate);
  const target = toMidnightUtc(targetDate);
  advanceToNextWorkingInstantUtc(cursor, calendar);
  advanceToNextWorkingInstantUtc(target, calendar);
  if (target.getTime() <= cursor.getTime()) return 0;

  let count = 0;
  while (cursor.getTime() < target.getTime()) {
    if (isWorkingDateUtc(cursor, calendar)) count += 1;
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return count;
}

export function buildWorkingTaskSegments(
  startDate: string,
  startOffset: number,
  durationDays: number,
  calendar: ScheduleCalendar,
): WorkingTaskSegment[] {
  const cursor = addWorkingDayOffset(startDate, startOffset, calendar);
  let remainingMinutes = Math.round(durationDays * workingMinutesPerDay(calendar));
  const segments: WorkingTaskSegment[] = [];

  while (remainingMinutes > 0) {
    advanceToNextWorkingInstantUtc(cursor, calendar);

    const workingDayEnd = endOfWorkingDayUtc(cursor, calendar);

    const usableMinutes = Math.round((workingDayEnd.getTime() - cursor.getTime()) / (60 * 1000));
    const segmentMinutes = Math.min(remainingMinutes, usableMinutes);
    const segmentStart = new Date(cursor.getTime());
    const segmentEnd = new Date(cursor.getTime());
    segmentEnd.setUTCMinutes(segmentEnd.getUTCMinutes() + segmentMinutes);

    segments.push({ start: segmentStart, end: segmentEnd });

    cursor.setTime(segmentEnd.getTime());
    remainingMinutes -= segmentMinutes;
  }

  return segments;
}

function ganttChartAnchorDate(startDate: string | null): Date {
  if (!startDate) return new Date(scheduleAnchorDateUtc());
  const [year, month, day] = startDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
}

export function dateForWorkingOffset(
  dayOffset: number,
  startDate: string | null,
  calendar: ScheduleCalendar,
): Date {
  return startDate
    ? addWorkingDayOffset(startDate, dayOffset, calendar)
    : new Date(
        scheduleAnchorDateUtc() +
          Math.round(dayOffset * workingMinutesPerDay(calendar)) * 60 * 1000,
      );
}

export function ganttChartPositionX(
  dt: Date,
  ganttChartStart: Date,
  calendar: ScheduleCalendar,
  dayWidth: number,
): number {
  const midnight = new Date(dt.getTime());
  midnight.setUTCHours(0, 0, 0, 0);
  const dayIndex = Math.floor((midnight.getTime() - ganttChartStart.getTime()) / 86400000);
  const minutesFromMidnight = dt.getUTCHours() * 60 + dt.getUTCMinutes();
  const relative = Math.max(0, Math.min(1, minutesFromMidnight / workingMinutesPerDay(calendar)));
  return (dayIndex + relative) * dayWidth;
}

export function ganttChartStartDate(startDate: string | null): Date {
  return ganttChartAnchorDate(startDate);
}

function parseDateOnlyUtc(dateOnly: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
    throw new Error(`invalid date-only value: ${dateOnly}`);
  }

  const [year, month, day] = dateOnly.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  if (formatDateOnlyUtc(parsed) !== dateOnly) {
    throw new Error(`invalid date-only value: ${dateOnly}`);
  }
  return parsed;
}

function assertCalendarHasWorkingDay(calendar: ScheduleCalendar): void {
  if (![...calendar.workdays].some((day) => Number.isInteger(day) && day >= 0 && day <= 6)) {
    throw new Error("calendar.workdays must contain at least one weekday");
  }
}

// 計画開始日（yyyy-mm-dd）から推定稼働日数を暦日へ伸ばした予定終了日（yyyy-mm-dd）を返す。
// 稼働日のみ数え、休日・週末は飛ばす。dayOffset <= 0 の場合 start 当日を返す。
// 用途: Timeline 用 Gantt chart の各トラックの予定開始日・予定終了日の算出。
export function addWorkingDaysToDate(
  startDate: string,
  dayOffset: number,
  calendar: ScheduleCalendar,
): string {
  if (!Number.isFinite(dayOffset) || dayOffset <= 0) return startDate;
  assertCalendarHasWorkingDay(calendar);

  const target = parseDateOnlyUtc(startDate);
  let remaining = Math.round(dayOffset);
  while (remaining > 0) {
    const next = new Date(target.getTime() + 86_400_000);
    if (!Number.isFinite(next.getTime())) {
      throw new Error(`working-day calculation exceeded the supported date range: ${startDate}`);
    }

    // 非稼働日でもカーソルは必ず進める。進めないと週末・休日で無限ループになる。
    target.setTime(next.getTime());
    if (isWorkingDateUtc(next, calendar)) {
      remaining -= 1;
    }
  }
  return formatDateOnlyUtc(target);
}

// 開始日・終了日を含めず、2 つの日付間にある稼働日数を返す。target <= start なら 0。
export function countWorkingDaysBetween(
  startDate: string,
  targetDate: string,
  calendar: ScheduleCalendar,
): number {
  const cursor = parseDateOnlyUtc(startDate);
  const endMs = parseDateOnlyUtc(targetDate).getTime();
  if (endMs <= cursor.getTime()) return 0;
  assertCalendarHasWorkingDay(calendar);

  let count = 0;
  while (true) {
    const next = new Date(cursor.getTime() + 86_400_000);
    if (next.getTime() >= endMs) break;
    if (isWorkingDateUtc(next, calendar)) count += 1;
    cursor.setTime(next.getTime());
  }
  return count;
}
