import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { ScheduleCalendar, ScheduleIndex, ScheduleNode } from './exec-types.js'
import {
  isSchYamlFilename,
  listFilesRecursive,
  normalizeDateOnly,
  readYaml,
  toScheduleFilePath,
} from './exec-shared.js'

function defaultScheduleCalendar(): ScheduleCalendar {
  return {
    timezone: 'UTC',
    workdays: new Set([1, 2, 3, 4, 5]),
    holidays: new Set<string>(),
    work_hours_per_day: 24,
  }
}

function parseWorkdayToken(value: string): number | null {
  const key = value.trim().slice(0, 3).toLowerCase()
  const map: Record<string, number> = {
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6,
  }
  return key in map ? map[key] : null
}

function cloneScheduleCalendar(calendar: ScheduleCalendar): ScheduleCalendar {
  return {
    timezone: calendar.timezone,
    workdays: new Set(calendar.workdays),
    holidays: new Set(calendar.holidays),
    work_hours_per_day: calendar.work_hours_per_day,
  }
}

function applyScheduleCalendar(base: ScheduleCalendar, calendar: any): ScheduleCalendar | null {
  if (!calendar || typeof calendar !== 'object') return null

  const parsed = cloneScheduleCalendar(base)
  if (typeof calendar.timezone === 'string' && calendar.timezone.trim()) {
    parsed.timezone = calendar.timezone.trim()
  }
  if (Array.isArray(calendar.workdays) && calendar.workdays.length) {
    const workdays = new Set<number>()
    for (const token of calendar.workdays) {
      if (typeof token !== 'string') continue
      const day = parseWorkdayToken(token)
      if (day !== null) workdays.add(day)
    }
    if (workdays.size) parsed.workdays = workdays
  }

  if (Array.isArray(calendar.holidays) && calendar.holidays.length) {
    for (const holiday of calendar.holidays
      .map((value: unknown) => normalizeDateOnly(value))
      .filter(Boolean) as string[]) {
      parsed.holidays.add(holiday)
    }
  }

  if (
    typeof calendar.work_hours_per_day === 'number' &&
    Number.isFinite(calendar.work_hours_per_day) &&
    calendar.work_hours_per_day > 0 &&
    calendar.work_hours_per_day <= 24
  ) {
    parsed.work_hours_per_day = calendar.work_hours_per_day
  }

  return parsed
}

function mergeScheduleCalendar(base: ScheduleCalendar, extra: ScheduleCalendar): ScheduleCalendar {
  const merged = cloneScheduleCalendar(base)
  merged.timezone = extra.timezone
  merged.workdays = new Set(extra.workdays)
  merged.work_hours_per_day = extra.work_hours_per_day
  for (const holiday of extra.holidays) merged.holidays.add(holiday)
  return merged
}

function extractScheduleStartDate(doc: any): string | null {
  return normalizeDateOnly(doc?.settings?.start_date ?? doc?.start_date)
}

function minDateOnly(a: string | null, b: string | null): string | null {
  if (!a) return b
  if (!b) return a
  return a <= b ? a : b
}

function nonEmptyString(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function scheduleSectionLabelForDoc(doc: any, fallback: string): string {
  const docKind = nonEmptyString(doc?.kind)
  if (docKind === 'milestones') return 'milestones'

  const domain = nonEmptyString(doc?.domain)
  const container = nonEmptyString(doc?.container)
  if (domain && container) return `${domain} / ${container}`
  return domain ?? fallback
}

export function buildScheduleIndex(projectPath: string): ScheduleIndex {
  const all = listFilesRecursive(projectPath)
  const candidateFiles = all.filter(p => isSchYamlFilename(p))
  const files: string[] = []
  const defaultsPath = join(projectPath, 'sch-defaults.yaml')

  const nodes = new Map<string, ScheduleNode>()
  const sectionLabels: Record<string, string> = {}
  let startDate: string | null = null
  let calendar = defaultScheduleCalendar()
  let hasCalendar = false

  if (existsSync(defaultsPath)) {
    try {
      const defaultsDoc = readYaml(defaultsPath)
      if (defaultsDoc && typeof defaultsDoc === 'object') {
        startDate = minDateOnly(startDate, extractScheduleStartDate(defaultsDoc))
        const defaultCalendar = applyScheduleCalendar(
          defaultScheduleCalendar(),
          defaultsDoc.calendar
        )
        if (defaultCalendar) {
          calendar = defaultCalendar
          hasCalendar = true
        }
      }
    } catch {
      // Ignore malformed defaults here; schema/editor validation should catch it.
    }
  }

  for (const f of candidateFiles) {
    let doc: any
    try {
      doc = readYaml(f)
    } catch {
      continue
    }
    if (!doc || typeof doc !== 'object') continue

    const docKind = nonEmptyString(doc?.kind)
    if (docKind === 'defaults' || docKind === 'strategy') {
      continue
    }
    if (docKind !== 'milestones' && docKind !== 'track') {
      throw new Error(`${f}: kind must be 'milestones' or 'track'`)
    }

    files.push(f)
    const scheduleFile = toScheduleFilePath(projectPath, f)
    sectionLabels[scheduleFile] = scheduleSectionLabelForDoc(doc, scheduleFile)

    startDate = minDateOnly(startDate, extractScheduleStartDate(doc))

    const docCalendar = applyScheduleCalendar(calendar, doc.calendar)
    if (docCalendar && doc.calendar && typeof doc.calendar === 'object') {
      if (!hasCalendar) {
        calendar = cloneScheduleCalendar(docCalendar)
        hasCalendar = true
      } else {
        calendar = mergeScheduleCalendar(calendar, docCalendar)
      }
    }

    const tasks = Array.isArray(doc.tasks) ? doc.tasks : []
    const milestones = Array.isArray(doc.milestones) ? doc.milestones : []

    for (const t of tasks) {
      if (!t || typeof t !== 'object') continue
      const id = String(t.id ?? '').trim()
      if (!id) continue
      nodes.set(id, {
        id,
        name: typeof t.name === 'string' ? t.name : undefined,
        owner: typeof t.owner === 'string' ? t.owner : undefined,
        depends_on: Array.isArray(t.depends_on) ? t.depends_on.map(String) : [],
        duration_days: typeof t.duration_days === 'number' ? t.duration_days : 0,
        kind: 'task',
        schedule_file: f,
      })
    }

    for (const m of milestones) {
      if (!m || typeof m !== 'object') continue
      const id = String(m.id ?? '').trim()
      if (!id) continue
      nodes.set(id, {
        id,
        name: typeof m.name === 'string' ? m.name : undefined,
        owner: typeof m.owner === 'string' ? m.owner : undefined,
        depends_on: Array.isArray(m.depends_on) ? m.depends_on.map(String) : [],
        duration_days: 0,
        kind: 'milestone',
        schedule_file: f,
      })
    }
  }

  return { nodes, files, start_date: startDate, calendar, section_labels: sectionLabels }
}
