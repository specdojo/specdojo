import { existsSync, readFileSync } from "node:fs";
import { addWorkingDaysToDate, isWorkingDateUtc } from "../exec/schedule/calendar.js";
import type { ScheduleCalendar } from "../exec/types.js";
import { epicPredecessors, orderEpics } from "../register/epic.js";
import { registerDateFromTimestamp } from "../register/date.js";
import { loadRegisterItemDocs, type PjrItem } from "../register/item.js";
import { readRegisterEventsFromContent, registerEventFilePath } from "../register/events.js";
import type { TimelineTrackSchedule } from "./dashboard-timeline.js";

export type EpicSchedule = TimelineTrackSchedule & {
  id: string;
  title: string;
  itemStatus: string;
};

export function computeEpicSchedules(opts: {
  items: PjrItem[];
  projectId: string;
  calendar: ScheduleCalendar;
  timeZone: string;
  starts: Map<string, string>;
}): { schedule: EpicSchedule[]; plannedStartDate: string | undefined } {
  const epics = orderEpics(opts.items, opts.projectId);
  const byId = new Map(epics.map((item) => [item.id, item]));
  const rows = new Map<string, EpicSchedule>();
  for (const item of epics) {
    const predecessors = epicPredecessors(item, opts.projectId, byId);
    const actualStart = opts.starts.get(item.id);
    const completed = ["done", "decided", "rejected"].includes(item.status);
    const endDate = completed
      ? registerDateFromTimestamp(item.completedAt, opts.timeZone)
      : /^\d{4}-\d{2}-\d{2}$/.test(item.due)
        ? item.due
        : undefined;
    let startDate = actualStart ? registerDateFromTimestamp(actualStart, opts.timeZone) : undefined;
    if (!startDate && !completed && item.status === "open" && predecessors.length > 0) {
      const ends = predecessors.map((p) => rows.get(p.id)?.endDate);
      if (ends.every((end): end is string => end !== undefined)) {
        startDate = addWorkingDaysToDate(ends.sort().at(-1)!, 1, opts.calendar);
      }
    }
    // Unknown start/end stays unknown; do not fabricate a date or propagate it downstream.
    let estimateDays: number | undefined;
    if (startDate && endDate && endDate >= startDate) {
      estimateDays = 0;
      const cursor = new Date(`${startDate}T00:00:00Z`);
      const end = new Date(`${endDate}T00:00:00Z`);
      while (cursor <= end) {
        if (isWorkingDateUtc(cursor, opts.calendar)) estimateDays += 1;
        cursor.setUTCDate(cursor.getUTCDate() + 1);
      }
    }
    rows.set(item.id, {
      id: item.id,
      title: item.title,
      itemStatus: item.status,
      track: item.track!,
      domains: item.domains ?? [],
      status: completed ? "primary" : item.status === "open" ? "not_started" : "draft",
      order: rows.size + 1,
      wave: 1 + Math.max(0, ...predecessors.map((p) => rows.get(p.id)?.wave ?? 0)),
      depends_on: predecessors.map((p) => p.track!),
      startDate,
      endDate: endDate === "-" || endDate === "_TODO_" ? undefined : endDate,
      estimateDays,
    });
  }
  const schedule = [...rows.values()];
  const plannedStartDate = schedule
    .flatMap((row) => (row.startDate ? [row.startDate] : []))
    .sort()[0];
  return { schedule, plannedStartDate };
}

export function loadEpicSchedules(opts: {
  registerPath: string;
  projectId: string;
  calendar: ScheduleCalendar;
  timeZone: string;
}): ReturnType<typeof computeEpicSchedules> {
  const items = loadRegisterItemDocs(opts.registerPath).map((doc) => doc.item);
  const starts = new Map<string, string>();
  for (const item of items.filter((item) => item.type === "epic")) {
    const file = registerEventFilePath(opts.registerPath, item.id);
    const events = existsSync(file)
      ? readRegisterEventsFromContent(readFileSync(file, "utf8"), file)
      : [];
    const start = events
      .filter((event) => event.action === "start")
      .map((event) => event.ts)
      .sort()[0];
    if (start) starts.set(item.id, start);
  }
  return computeEpicSchedules({ ...opts, items, starts });
}
