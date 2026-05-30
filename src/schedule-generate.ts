import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
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
  phase_sets?: string[]
  phase_set?: string
}

type CrossDomainDep = {
  dependent: string
  requires: string
  note?: string
}

type PhaseGateScope = {
  catalogs?: string[]
  groups?: Array<{ catalog_id: string; name: string }>
  local_ids?: string[]
}

type PhaseGate = {
  id: string
  name: string
  after_phase_sets: string[]
  owner: string
  scope: PhaseGateScope
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
  settings?: { start_date?: string }
  scope: StrategyScope
  phase_sets: Record<string, StrategyPhase[]>
  default_phase_sets?: string[]
  default_phase_set?: string
  task_id_pattern: string
  owner_rules: OwnerRule[]
  cross_domain_dependencies?: CrossDomainDep[]
  phase_gates?: PhaseGate[]
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
  startDate: string | null
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

function getOwner(localId: string, rules: OwnerRule[]): string | null {
  for (const rule of rules) {
    if (rule.local_ids.includes(localId)) return rule.owner
  }
  return null
}

function resolveGateScope(scope: PhaseGateScope, sorted: DeliverableInfo[]): string[] {
  const result = new Set<string>()
  for (const catalogId of scope.catalogs ?? []) {
    for (const d of sorted) {
      if (d.catalogId === catalogId) result.add(d.local_id)
    }
  }
  for (const g of scope.groups ?? []) {
    for (const d of sorted) {
      if (d.catalogId === g.catalog_id && d.groupName === g.name) result.add(d.local_id)
    }
  }
  for (const localId of scope.local_ids ?? []) {
    result.add(localId)
  }
  return [...result]
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
  if (!strategy?.scope || !strategy?.phase_sets || !strategy?.owner_rules) {
    throw new Error(
      `${strategyPath}: missing required fields (scope, phase_sets, or owner_rules)`
    )
  }

  const projectId = String(strategy.id ?? '').split(':')[0] ?? 'unknown'
  const track = String(strategy.track ?? '')
  const startDate = strategy.settings?.start_date ?? null

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

  if (errors.length > 0) return { projectId, track, startDate, tasks: [], milestones: [], errors, warnings }

  // Topological sort
  const crossDeps = strategy.cross_domain_dependencies ?? []
  let sorted: DeliverableInfo[]
  try {
    sorted = topoSort(allDeliverables, crossDeps)
  } catch (err) {
    errors.push(err instanceof Error ? err.message : String(err))
    return { projectId, track, startDate, tasks: [], milestones: [], errors, warnings }
  }

  // Resolve default phase set names
  const defaultPhaseSetNames: string[] =
    strategy.default_phase_sets ??
    (strategy.default_phase_set ? [strategy.default_phase_set] : Object.keys(strategy.phase_sets))

  // Map local_id → finalize task ID for dependency resolution
  const finalizeTaskId = new Map<string, string>()
  // Track phase boundary (last pre-finalize task / first finalize task) per deliverable
  type Boundary = { lastPreFinalizeId: string | null; firstFinalizeId: string | null }
  const boundaries = new Map<string, Boundary>()
  // Use a Map to allow post-generation patching for phase gates
  const taskMap = new Map<string, GeneratedTask>()

  for (const d of sorted) {
    const ownerRule = strategy.owner_rules.find(r => r.local_ids.includes(d.local_id))
    const phaseSetNames: string[] =
      ownerRule?.phase_sets ??
      (ownerRule?.phase_set ? [ownerRule.phase_set] : null) ??
      defaultPhaseSetNames
    const phases = phaseSetNames.flatMap(name => strategy.phase_sets[name] ?? [])
    if (phases.length === 0) {
      warnings.push(`No phases resolved for '${d.local_id}' (phase_sets: ${phaseSetNames.join(', ')}) — skipping`)
      continue
    }

    const owner = getOwner(d.local_id, strategy.owner_rules)
    if (!owner) {
      errors.push(`No owner_rule found for local_id: ${d.local_id}`)
      continue
    }

    // Compute the set of suffixes belonging to the last phase_set (= finalize-pass)
    const lastPhaseSetName = phaseSetNames[phaseSetNames.length - 1]
    const lastPhaseSetSuffixes = new Set(
      (strategy.phase_sets[lastPhaseSetName] ?? []).map(p => p.task_suffix)
    )

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
    let lastPreFinalizeId: string | null = null
    let firstFinalizeId: string | null = null

    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i]
      const taskId = expandTaskId(
        strategy.task_id_pattern,
        d.domain_code,
        d.artifact_code,
        phase.task_suffix
      )
      taskMap.set(taskId, {
        id: taskId,
        name: `${d.local_id} ${phase.name}`,
        duration_days: phase.duration_days,
        depends_on: i === 0 ? [...firstDeps] : [prevId!],
        owner,
      })
      if (!lastPhaseSetSuffixes.has(phase.task_suffix)) {
        lastPreFinalizeId = taskId
      } else if (firstFinalizeId === null) {
        firstFinalizeId = taskId
      }
      prevId = taskId
    }
    if (prevId) finalizeTaskId.set(d.local_id, prevId)
    boundaries.set(d.local_id, { lastPreFinalizeId, firstFinalizeId })
  }

  if (errors.length > 0) return { projectId, track, startDate, tasks: [], milestones: [], errors, warnings }

  // Process phase gates: create gate milestones and patch first finalize-pass tasks
  const milestones: GeneratedMilestone[] = []

  for (const gate of strategy.phase_gates ?? []) {
    const scopedLocalIds = resolveGateScope(gate.scope, sorted)
    if (scopedLocalIds.length === 0) {
      warnings.push(`phase_gate ${gate.id}: no deliverables found in scope`)
      continue
    }

    const gateDeps = scopedLocalIds
      .map(id => boundaries.get(id)?.lastPreFinalizeId)
      .filter((id): id is string => id !== null && id !== undefined)

    if (gateDeps.length === 0) {
      warnings.push(`phase_gate ${gate.id}: no pre-finalize tasks found in scope`)
      continue
    }

    milestones.push({ id: gate.id, name: gate.name, depends_on: gateDeps, owner: gate.owner })

    for (const localId of scopedLocalIds) {
      const firstFinalizeId = boundaries.get(localId)?.firstFinalizeId
      if (!firstFinalizeId) continue
      const task = taskMap.get(firstFinalizeId)
      if (!task || task.depends_on.includes(gate.id)) continue
      task.depends_on.push(gate.id)
    }
  }

  const tasks = [...taskMap.values()]

  // Build per-group milestones from group_milestones config
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

  return { projectId, track, startDate, tasks, milestones, errors, warnings }
}
