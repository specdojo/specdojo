import { existsSync } from 'node:fs'
import { extname, resolve } from 'node:path'
import { readYaml } from './exec-shared.js'
import type { DctDoc, DctSection } from './catalog-types.js'

// --- Strategy file types ---

type StrategyScope = {
  catalogs: Array<{ id: string; path: string }>
  include_kinds: string[]
}

type StrategyPhase = {
  id: string
  name: string
  task_suffix: string
  duration_days: number
}

type OwnerRule = {
  local_ids: string[]
  owner: string
}

type CrossDomainDep = {
  dependent: string
  requires: string
  note?: string
}

type MilestoneConfig = {
  id: string
  name: string
  owner: string
  date_hint?: string
  tags?: string[]
}

type GroupMilestone = {
  catalog_id: string
  group?: string
  milestone: MilestoneConfig
}

type StrategyDoc = {
  id: string
  type: string
  status: string
  track: string
  scope: StrategyScope
  phases: Record<string, StrategyPhase[]>
  task_id_pattern: string
  owner_rules: OwnerRule[]
  cross_domain_dependencies?: CrossDomainDep[]
  group_milestones?: GroupMilestone[]
}

// --- Intermediate types ---

type DeliverableInfo = {
  local_id: string
  artifact_code: string
  domain_code: string
  path: string
  depends_on: string[]
  catalogId: string
  groupName: string | null
}

// --- Output types ---

export type GeneratedTask = {
  id: string
  name: string
  duration_days: number
  depends_on: string[]
  owner: string
}

export type GeneratedMilestone = {
  id: string
  name: string
  depends_on: string[]
  owner: string
  date_hint?: string
  tags?: string[]
}

export type GenerateResult = {
  projectId: string
  track: string
  tasks: GeneratedTask[]
  milestones: GeneratedMilestone[]
  errors: string[]
  warnings: string[]
}

// --- Helpers ---

function collectDeliverables(
  sections: DctSection[],
  domainCode: string,
  includeKinds: string[],
  catalogId: string,
  topLevelGroup: string | null,
  out: DeliverableInfo[]
): void {
  for (const section of sections) {
    // Lock the top-level group name on the first call; preserve it for nested calls.
    const effectiveGroup = topLevelGroup ?? section.name ?? null
    if (section.groups) {
      collectDeliverables(section.groups, domainCode, includeKinds, catalogId, effectiveGroup, out)
    }
    if (!section.deliverables) continue
    for (const item of section.deliverables) {
      if (!includeKinds.includes(item.kind)) continue
      if (!item.path) continue
      out.push({
        local_id: item.local_id,
        artifact_code: item.artifact_code ?? item.local_id.toUpperCase().replace(/-/g, '').slice(0, 8),
        domain_code: domainCode,
        path: item.path,
        depends_on: item.depends_on ?? [],
        catalogId,
        groupName: effectiveGroup,
      })
    }
  }
}

function detectFormat(filePath: string): string {
  const ext = extname(filePath).toLowerCase()
  return ext === '.yaml' || ext === '.yml' ? 'yaml' : 'markdown'
}

function getOwner(localId: string, rules: OwnerRule[]): string | null {
  for (const rule of rules) {
    if (rule.local_ids.includes(localId)) return rule.owner
  }
  return null
}

function expandTaskId(
  pattern: string,
  domainCode: string,
  artifactCode: string,
  phaseSuffix: string
): string {
  return pattern
    .replace('{domain_code}', domainCode)
    .replace('{artifact_code}', artifactCode)
    .replace('{phase_suffix}', phaseSuffix)
}

function topoSort(
  deliverables: DeliverableInfo[],
  crossDeps: CrossDomainDep[]
): DeliverableInfo[] {
  const byId = new Map(deliverables.map(d => [d.local_id, d]))

  const extraDeps = new Map<string, Set<string>>()
  for (const cd of crossDeps) {
    if (!byId.has(cd.dependent) || !byId.has(cd.requires)) continue
    if (!extraDeps.has(cd.dependent)) extraDeps.set(cd.dependent, new Set())
    extraDeps.get(cd.dependent)!.add(cd.requires)
  }

  const visited = new Set<string>()
  const inStack = new Set<string>()
  const sorted: DeliverableInfo[] = []

  function visit(id: string): void {
    if (visited.has(id)) return
    if (inStack.has(id)) throw new Error(`Circular dependency detected involving: ${id}`)
    inStack.add(id)
    const d = byId.get(id)
    if (d) {
      for (const dep of d.depends_on) {
        if (byId.has(dep)) visit(dep)
      }
      for (const dep of extraDeps.get(id) ?? []) visit(dep)
    }
    inStack.delete(id)
    visited.add(id)
    if (d) sorted.push(d)
  }

  for (const d of deliverables) visit(d.local_id)
  return sorted
}

// --- Main export ---

export function generateScheduleTrack(strategyPath: string, baseDir: string): GenerateResult {
  const errors: string[] = []
  const warnings: string[] = []

  const strategy = readYaml(strategyPath) as StrategyDoc
  if (!strategy?.scope || !strategy?.phases || !strategy?.owner_rules) {
    throw new Error(
      `${strategyPath}: missing required fields (scope, phases, or owner_rules)`
    )
  }

  const projectId = String(strategy.id ?? '').split(':')[0] ?? 'unknown'
  const track = String(strategy.track ?? '')

  // Load deliverables from catalogs
  const allDeliverables: DeliverableInfo[] = []
  for (const ref of strategy.scope.catalogs) {
    // Paths start with '/' and are relative to repo root (baseDir)
    const catalogPath = resolve(baseDir, ref.path.replace(/^\//, ''))
    if (!existsSync(catalogPath)) {
      errors.push(`Catalog not found: ${catalogPath}`)
      continue
    }
    const doc = readYaml(catalogPath) as DctDoc
    if (!doc?.groups) {
      errors.push(`${catalogPath}: missing groups field`)
      continue
    }
    const domainCode = doc.domain_code ?? doc.domain.toUpperCase().slice(0, 3)
    collectDeliverables(doc.groups, domainCode, strategy.scope.include_kinds, ref.id, null, allDeliverables)
  }

  if (errors.length > 0) return { projectId, track, tasks: [], milestones: [], errors, warnings }

  // Topological sort
  const crossDeps = strategy.cross_domain_dependencies ?? []
  let sorted: DeliverableInfo[]
  try {
    sorted = topoSort(allDeliverables, crossDeps)
  } catch (err) {
    errors.push(err instanceof Error ? err.message : String(err))
    return { projectId, track, tasks: [], milestones: [], errors, warnings }
  }

  // Map local_id → finalize task ID for dependency resolution
  const finalizeTaskId = new Map<string, string>()
  const tasks: GeneratedTask[] = []

  for (const d of sorted) {
    const format = detectFormat(d.path)
    const phases = strategy.phases[format] ?? strategy.phases['markdown']
    if (!phases || phases.length === 0) {
      warnings.push(`No phases defined for format '${format}' (${d.local_id}) — skipping`)
      continue
    }

    const owner = getOwner(d.local_id, strategy.owner_rules)
    if (!owner) {
      errors.push(`No owner_rule found for local_id: ${d.local_id}`)
      continue
    }

    // First phase: depends on finalize tasks of catalog deps + cross-domain deps
    const firstDeps = new Set<string>()
    for (const dep of d.depends_on) {
      const fin = finalizeTaskId.get(dep)
      if (fin) firstDeps.add(fin)
    }
    for (const cd of crossDeps) {
      if (cd.dependent !== d.local_id) continue
      const fin = finalizeTaskId.get(cd.requires)
      if (fin) firstDeps.add(fin)
    }

    let prevId: string | null = null
    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i]
      const taskId = expandTaskId(
        strategy.task_id_pattern,
        d.domain_code,
        d.artifact_code,
        phase.task_suffix
      )
      tasks.push({
        id: taskId,
        name: `${d.local_id} ${phase.name}`,
        duration_days: phase.duration_days,
        depends_on: i === 0 ? [...firstDeps] : [prevId!],
        owner,
      })
      prevId = taskId
    }
    if (prevId) finalizeTaskId.set(d.local_id, prevId)
  }

  if (errors.length > 0) return { projectId, track, tasks: [], milestones: [], errors, warnings }

  // Build per-group milestones from group_milestones config
  const milestones: GeneratedMilestone[] = []
  for (const gm of strategy.group_milestones ?? []) {
    const groupDeliverables = sorted.filter(d => {
      if (d.catalogId !== gm.catalog_id) return false
      return gm.group !== undefined ? d.groupName === gm.group : d.groupName === null
    })

    if (groupDeliverables.length === 0) {
      warnings.push(
        `group_milestones: no work deliverables for catalog_id=${gm.catalog_id} group=${gm.group ?? '(unnamed)'}`
      )
      continue
    }

    // Leaf deliverables within the group: not required by any sibling in the same group
    const groupIds = new Set(groupDeliverables.map(d => d.local_id))
    const dependedUponWithinGroup = new Set<string>()
    for (const d of groupDeliverables) {
      for (const dep of d.depends_on) {
        if (groupIds.has(dep)) dependedUponWithinGroup.add(dep)
      }
    }

    const leafFinalizeIds = groupDeliverables
      .filter(d => !dependedUponWithinGroup.has(d.local_id))
      .map(d => finalizeTaskId.get(d.local_id))
      .filter((id): id is string => id !== undefined)

    if (leafFinalizeIds.length === 0) {
      warnings.push(
        `group_milestones: no finalize tasks for catalog_id=${gm.catalog_id} group=${gm.group ?? '(unnamed)'}`
      )
      continue
    }

    const mc = gm.milestone
    milestones.push({
      id: mc.id,
      name: mc.name,
      depends_on: leafFinalizeIds,
      owner: mc.owner,
      ...(mc.date_hint !== undefined ? { date_hint: mc.date_hint } : {}),
      ...(mc.tags !== undefined ? { tags: mc.tags } : {}),
    })
  }

  return { projectId, track, tasks, milestones, errors, warnings }
}
