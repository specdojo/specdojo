import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, extname, join } from 'node:path'
import { load } from 'js-yaml'

type CpmNode = {
  id: string
  es: number
  ef: number
  ls: number
  lf: number
  slack: number
}

type CpmJson = {
  nodes?: Record<string, CpmNode>
}

type StateJson = {
  tasks?: Record<string, { state?: string }>
}

type CatalogRow = {
  id: string
  kind: 'task' | 'milestone'
  owner: string
  what: string
  primaryPaths: string[]
  secondaryPaths: string[]
  dependsOn: string[]
  durationDays: number
  scheduleFile: string
  es: string
  ef: string
  ls: string
  lf: string
  slack: string
  state: string
}

type WbsDoc = {
  wbs?: Array<{
    id?: string
    deliverables?: Array<{
      id?: string
      path?: string
    }>
  }>
}

function listFilesRecursive(dirPath: string): string[] {
  const out: string[] = []
  const names = readdirSync(dirPath)
  for (const name of names) {
    const fullPath = join(dirPath, name)
    const st = statSync(fullPath)
    if (st.isDirectory()) {
      out.push(...listFilesRecursive(fullPath))
    } else {
      out.push(fullPath)
    }
  }
  return out
}

function isScheduleYaml(filePath: string): boolean {
  const base = filePath.split('/').pop() ?? filePath
  const ext = extname(base).toLowerCase()
  if (ext !== '.yaml' && ext !== '.yml') return false
  if (base === 'schedule-defaults.yaml' || base === 'schedule-defaults.yml') return false
  return /^sch-.+\.ya?ml$/i.test(base)
}

function isWbsYaml(filePath: string): boolean {
  const base = filePath.split('/').pop() ?? filePath
  const ext = extname(base).toLowerCase()
  if (ext !== '.yaml' && ext !== '.yml') return false
  return /^wbs-.+\.ya?ml$/i.test(base)
}

function safeString(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.trim()
}

function toArrayOfStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map(v => String(v).trim()).filter(Boolean)
}

function cleanupCell(text: string): string {
  return text.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ').trim()
}

function pickWhat(task: unknown): string {
  const t = task as Record<string, unknown>
  const notes = safeString(t?.notes)
  const name = safeString(t?.name)
  return notes || name || '-'
}

function toScheduleFile(projectPath: string, filePath: string): string {
  const normalizedProject = projectPath.endsWith('/') ? projectPath : `${projectPath}/`
  if (filePath.startsWith(normalizedProject)) return filePath.slice(normalizedProject.length)
  return filePath
}

function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8')) as T
  } catch {
    return fallback
  }
}

function wbsPathForSchedule(schedulePath: string): string {
  return join(dirname(schedulePath), '050-wbs')
}

function loadWbsDeliverables(schedulePath: string): Map<string, string[]> {
  const out = new Map<string, string[]>()
  const wbsPath = wbsPathForSchedule(schedulePath)

  try {
    const files = listFilesRecursive(wbsPath)
      .filter(isWbsYaml)
      .sort((a, b) => a.localeCompare(b))

    for (const filePath of files) {
      let doc: WbsDoc
      try {
        doc = load(readFileSync(filePath, 'utf8')) as WbsDoc
      } catch {
        continue
      }

      for (const item of Array.isArray(doc?.wbs) ? doc.wbs : []) {
        const id = safeString(item?.id)
        if (!id) continue
        const deliverables = Array.isArray(item?.deliverables)
          ? item.deliverables.map(entry => safeString(entry?.path)).filter(Boolean)
          : []
        out.set(id, deliverables)
      }
    }
  } catch {
    return out
  }

  return out
}

function selectPrimaryArtifactCandidates(
  taskId: string,
  tags: string[],
  deliverables: string[]
): string[] {
  if (deliverables.length === 0) return []

  if (taskId.endsWith('-SMP')) {
    const samplePaths = deliverables.filter(path => path.includes('/samples/'))
    return samplePaths.length > 0 ? samplePaths : deliverables
  }
  if (tags.includes('rulebook-lifecycle')) {
    const rulePaths = deliverables.filter(path => path.includes('/rulebooks/'))
    return rulePaths.length > 0 ? rulePaths : deliverables
  }

  return deliverables
}

function selectSecondaryArtifactCandidates(
  deliverables: string[],
  primaryPaths: string[]
): string[] {
  if (deliverables.length === 0) return []
  const primarySet = new Set(primaryPaths)
  return deliverables.filter(path => !primarySet.has(path))
}

function buildRows(schedulePath: string, generatedDir: string): CatalogRow[] {
  const cpm = readJsonFile<CpmJson>(join(generatedDir, 'cpm.json'), {})
  const state = readJsonFile<StateJson>(join(generatedDir, 'state.json'), {})
  const wbsDeliverables = loadWbsDeliverables(schedulePath)

  const cpmById = cpm.nodes ?? {}
  const stateById = state.tasks ?? {}

  const files = listFilesRecursive(schedulePath)
    .filter(isScheduleYaml)
    .sort((a, b) => a.localeCompare(b))
  const rows: CatalogRow[] = []

  for (const filePath of files) {
    let doc: Record<string, unknown>
    try {
      doc = load(readFileSync(filePath, 'utf8')) as Record<string, unknown>
    } catch {
      continue
    }
    const tasks = Array.isArray(doc?.tasks) ? doc.tasks : []
    const milestones = Array.isArray(doc?.milestones) ? doc.milestones : []
    if (safeString(doc?.kind) !== 'schedule') continue

    for (const t of tasks) {
      const task = t as Record<string, unknown>
      const id = safeString(task?.id)
      if (!id) continue
      const cpmNode = cpmById[id]
      const wbsId = safeString(task?.wbs)
      const deliverables = wbsDeliverables.get(wbsId) ?? []
      const tags = toArrayOfStrings(task?.tags)
      const primaryPaths = selectPrimaryArtifactCandidates(id, tags, deliverables)
      const secondaryPaths = selectSecondaryArtifactCandidates(deliverables, primaryPaths)
      rows.push({
        id,
        kind: 'task',
        owner: safeString(task?.owner) || '-',
        what: pickWhat(task),
        primaryPaths,
        secondaryPaths,
        dependsOn: toArrayOfStrings(task?.depends_on),
        durationDays: typeof task?.duration_days === 'number' ? task.duration_days : 0,
        scheduleFile: toScheduleFile(schedulePath, filePath),
        es: cpmNode ? String(cpmNode.es) : '-',
        ef: cpmNode ? String(cpmNode.ef) : '-',
        ls: cpmNode ? String(cpmNode.ls) : '-',
        lf: cpmNode ? String(cpmNode.lf) : '-',
        slack: cpmNode ? String(cpmNode.slack) : '-',
        state: stateById[id]?.state ?? 'todo',
      })
    }

    for (const m of milestones) {
      const milestone = m as Record<string, unknown>
      const id = safeString(milestone?.id)
      if (!id) continue
      const cpmNode = cpmById[id]
      rows.push({
        id,
        kind: 'milestone',
        owner: safeString(milestone?.owner) || '-',
        what: pickWhat(milestone),
        primaryPaths: [],
        secondaryPaths: [],
        dependsOn: toArrayOfStrings(milestone?.depends_on),
        durationDays: 0,
        scheduleFile: toScheduleFile(schedulePath, filePath),
        es: cpmNode ? String(cpmNode.es) : '-',
        ef: cpmNode ? String(cpmNode.ef) : '-',
        ls: cpmNode ? String(cpmNode.ls) : '-',
        lf: cpmNode ? String(cpmNode.lf) : '-',
        slack: cpmNode ? String(cpmNode.slack) : '-',
        state: stateById[id]?.state ?? 'todo',
      })
    }
  }

  rows.sort((a, b) => {
    if (a.scheduleFile !== b.scheduleFile) return a.scheduleFile.localeCompare(b.scheduleFile)
    return a.id.localeCompare(b.id)
  })

  return rows
}

function buildMarkdown(rows: CatalogRow[]): string {
  const lines: string[] = []
  lines.push('# Task Catalog')
  lines.push('')
  lines.push('Generated by `specdojo exec build`. Human-readable summary of schedule tasks.')
  lines.push('')
  lines.push(`- total_items: \`${rows.length}\``)
  lines.push('')
  lines.push(
    '| id | kind | owner | what | primary_paths | secondary_paths | depends_on | dur | ES | EF | LS | LF | slack | state | schedule_file |'
  )
  lines.push('|---|---|---|---|---|---|---|---:|---:|---:|---:|---:|---:|---|---|')

  for (const r of rows) {
    lines.push(
      `| \`${cleanupCell(r.id)}\` | ${r.kind} | ${cleanupCell(r.owner)} | ${cleanupCell(r.what)} | ${cleanupCell(r.primaryPaths.join(', ')) || '-'} | ${cleanupCell(r.secondaryPaths.join(', ')) || '-'} | ${cleanupCell(r.dependsOn.join(', ')) || '-'} | ${r.durationDays} | ${r.es} | ${r.ef} | ${r.ls} | ${r.lf} | ${r.slack} | ${cleanupCell(r.state)} | ${cleanupCell(r.scheduleFile)} |`
    )
  }

  lines.push('')
  return lines.join('\n')
}

export function generateTaskCatalog(schedulePath: string, executionPath: string): void {
  const generatedDir = join(executionPath, 'generated')
  const rows = buildRows(schedulePath, generatedDir)
  const outPath = join(generatedDir, 'task-catalog.md')
  writeFileSync(outPath, buildMarkdown(rows), 'utf8')
  process.stdout.write(`Generated: ${outPath}\n`)
}
