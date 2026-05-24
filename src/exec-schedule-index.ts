import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { type ScheduleCalendar, type ScheduleIndex, type ScheduleNode } from './exec-types.js'
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

function applyScheduleCalendar(base: ScheduleCalendar, calendar: unknown): ScheduleCalendar | null {
  if (!calendar || typeof calendar !== 'object') return null

  const cal = calendar as Record<string, unknown>
  const parsed = cloneScheduleCalendar(base)
  if (typeof cal.timezone === 'string' && cal.timezone.trim()) {
    parsed.timezone = cal.timezone.trim()
  }
  if (Array.isArray(cal.workdays) && cal.workdays.length) {
    const workdays = new Set<number>()
    for (const token of cal.workdays) {
      if (typeof token !== 'string') continue
      const day = parseWorkdayToken(token)
      if (day !== null) workdays.add(day)
    }
    if (workdays.size) parsed.workdays = workdays
  }

  if (Array.isArray(cal.holidays) && cal.holidays.length) {
    for (const holiday of cal.holidays
      .map((value: unknown) => normalizeDateOnly(value))
      .filter(Boolean) as string[]) {
      parsed.holidays.add(holiday)
    }
  }

  if (
    typeof cal.work_hours_per_day === 'number' &&
    Number.isFinite(cal.work_hours_per_day) &&
    cal.work_hours_per_day > 0 &&
    cal.work_hours_per_day <= 24
  ) {
    parsed.work_hours_per_day = cal.work_hours_per_day
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

function extractScheduleStartDate(doc: unknown): string | null {
  if (!doc || typeof doc !== 'object') return null
  const d = doc as Record<string, unknown>
  const settings = d['settings']
  const settingsDate =
    settings && typeof settings === 'object'
      ? (settings as Record<string, unknown>)['start_date']
      : undefined
  return normalizeDateOnly(settingsDate ?? d['start_date'])
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

function scheduleSectionLabelForDoc(doc: unknown, fallback: string): string {
  const d = doc && typeof doc === 'object' ? (doc as Record<string, unknown>) : null
  const docKind = nonEmptyString(d?.['kind'])
  if (docKind === 'milestones') return 'milestones'

  const track = nonEmptyString(d?.['track'])
  return track ?? fallback
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
        const dd = defaultsDoc as Record<string, unknown>
        startDate = minDateOnly(startDate, extractScheduleStartDate(dd))
        const defaultCalendar = applyScheduleCalendar(
          defaultScheduleCalendar(),
          dd['calendar']
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
    let doc: unknown
    try {
      doc = readYaml(f)
    } catch {
      continue
    }
    if (!doc || typeof doc !== 'object') continue
    const d = doc as Record<string, unknown>

    const docKind = nonEmptyString(d['kind'])
    if (docKind === 'defaults' || docKind === 'strategy') {
      continue
    }
    if (docKind !== 'milestones' && docKind !== 'track') {
      throw new Error(`${f}: kind must be 'milestones' or 'track'`)
    }

    files.push(f)
    const scheduleFile = toScheduleFilePath(projectPath, f)
    sectionLabels[scheduleFile] = scheduleSectionLabelForDoc(d, scheduleFile)

    startDate = minDateOnly(startDate, extractScheduleStartDate(d))

    const docCalendar = applyScheduleCalendar(calendar, d['calendar'])
    if (docCalendar && d['calendar'] && typeof d['calendar'] === 'object') {
      if (!hasCalendar) {
        calendar = cloneScheduleCalendar(docCalendar)
        hasCalendar = true
      } else {
        calendar = mergeScheduleCalendar(calendar, docCalendar)
      }
    }

    const tasks = Array.isArray(d['tasks']) ? d['tasks'] : []
    const milestones = Array.isArray(d['milestones']) ? d['milestones'] : []

    for (const t of tasks) {
      if (!t || typeof t !== 'object') continue
      const tv = t as Record<string, unknown>
      const id = String(tv['id'] ?? '').trim()
      if (!id) continue
      nodes.set(id, {
        id,
        name: typeof tv['name'] === 'string' ? tv['name'] : undefined,
        owner: typeof tv['owner'] === 'string' ? tv['owner'] : undefined,
        depends_on: Array.isArray(tv['depends_on']) ? tv['depends_on'].map(String) : [],
        duration_days: typeof tv['duration_days'] === 'number' ? tv['duration_days'] : 0,
        kind: 'task',
        schedule_file: f,
      })
    }

    for (const m of milestones) {
      if (!m || typeof m !== 'object') continue
      const mv = m as Record<string, unknown>
      const id = String(mv['id'] ?? '').trim()
      if (!id) continue
      nodes.set(id, {
        id,
        name: typeof mv['name'] === 'string' ? mv['name'] : undefined,
        owner: typeof mv['owner'] === 'string' ? mv['owner'] : undefined,
        depends_on: Array.isArray(mv['depends_on']) ? mv['depends_on'].map(String) : [],
        duration_days: 0,
        kind: 'milestone',
        schedule_file: f,
      })
    }
  }

  return { nodes, files, start_date: startDate, calendar, section_labels: sectionLabels }
}
