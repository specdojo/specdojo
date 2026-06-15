import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { readYaml } from './exec-shared.js'
import type { DctDoc, DctSection } from './catalog-types.js'
import {
  expandPhaseSetSelection,
  normalizePhaseSetSelection,
  taskIterationSuffix,
  type PhaseSetSelection,
} from './schedule-phase-sets.js'

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
  description?: string
}

type OwnerRule = {
  local_ids: string[]
  owner: string
  phase_sets?: PhaseSetSelection
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
  artifact_name?: string
  after_phase_sets: string[]
  owner: string
  scope: PhaseGateScope
}

type MilestoneConfig = {
  id: string
  name: string
  owner: string
  artifact_name?: string
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
  default_phase_sets?: PhaseSetSelection
  default_phase_set?: string
  owner_rules: OwnerRule[]
  cross_domain_dependencies?: CrossDomainDep[]
  phase_gates?: PhaseGate[]
  group_milestones?: GroupMilestone[]
  initial_state?: {
    completed_deliverables?: Array<{ local_id: string; completed_through?: unknown }>
  }
}

// --- Intermediate types ---

type DeliverableInfo = {
  local_id: string
  path: string
  depends_on: string[]
  catalogId: string
  groupName: string | null
}

// --- Output types ---

export type GeneratedTask = {
  local_id?: string
  phase_suffix?: string
  phase_set?: string
  phase_id?: string
  cycle?: number
  iteration?: number
  name: string
  duration_days: number
  depends_on: string[]
  owner: string
  tags?: string[]
  description?: string
}

export type GeneratedMilestone = {
  id: string
  name: string
  artifact_name?: string
  depends_on: string[]
  owner: string
  date_hint?: string
  tags?: string[]
}

export type BuildResult = {
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
  includeKinds: string[],
  catalogId: string,
  topLevelGroup: string | null,
  out: DeliverableInfo[]
): void {
  for (const section of sections) {
    // Lock the top-level group name on the first call; preserve it for nested calls.
    const effectiveGroup = topLevelGroup ?? section.name ?? null
    if (section.groups) {
      collectDeliverables(section.groups, includeKinds, catalogId, effectiveGroup, out)
    }
    if (!section.deliverables) continue
    for (const item of section.deliverables) {
      if (!includeKinds.includes(item.kind)) continue
      if (!item.path) continue
      out.push({
        local_id: item.local_id,
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

function buildTaskId(
  track: string,
  localId: string,
  phaseSuffix: string,
  cycle?: number,
  iteration?: number
): string {
  return `T-${track.toUpperCase()}-${localId}-${phaseSuffix}${taskIterationSuffix(cycle, iteration)}`
}

function topoSort(deliverables: DeliverableInfo[], crossDeps: CrossDomainDep[]): DeliverableInfo[] {
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

export function buildScheduleTrack(strategyPath: string, baseDir: string): BuildResult {
  const errors: string[] = []
  const warnings: string[] = []

  const strategy = readYaml(strategyPath) as StrategyDoc
  if (!strategy?.scope || !strategy?.phase_sets || !strategy?.owner_rules) {
    throw new Error(`${strategyPath}: missing required fields (scope, phase_sets, or owner_rules)`)
  }

  const track = String(strategy.track ?? '')

  const projectId = String(strategy.id ?? '').split(':')[0] ?? 'unknown'
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
    collectDeliverables(doc.groups, strategy.scope.include_kinds, ref.id, null, allDeliverables)
  }

  if (errors.length > 0)
    return { projectId, track, startDate, tasks: [], milestones: [], errors, warnings }

  // Topological sort
  const crossDeps = strategy.cross_domain_dependencies ?? []
  let sorted: DeliverableInfo[]
  try {
    sorted = topoSort(allDeliverables, crossDeps)
  } catch (err) {
    errors.push(err instanceof Error ? err.message : String(err))
    return { projectId, track, startDate, tasks: [], milestones: [], errors, warnings }
  }

  const fallbackPhaseSets = strategy.default_phase_set
    ? [strategy.default_phase_set]
    : Object.keys(strategy.phase_sets)
  let defaultPhaseSets
  try {
    defaultPhaseSets = normalizePhaseSetSelection(strategy.default_phase_sets, fallbackPhaseSets)
  } catch (err) {
    errors.push(err instanceof Error ? err.message : String(err))
    return { projectId, track, startDate, tasks: [], milestones: [], errors, warnings }
  }

  // Completed deliverables: generate a single 000 task instead of full phase expansion
  const completedLocalIds = new Set(
    (strategy.initial_state?.completed_deliverables ?? [])
      .filter(c => c.completed_through === undefined)
      .map(c => c.local_id)
  )

  // Map local_id → finalize task ID for dependency resolution
  const finalizeTaskId = new Map<string, string>()
  type CycleBoundary = {
    lastPreFinalizeId: string | null
    phaseSets: Array<{
      phaseSet: string
      firstTaskId: string
      lastTaskId: string
      nextTaskId: string | null
    }>
  }
  type Boundary = {
    cycles: number
    byCycle: Map<number, CycleBoundary>
  }
  const boundaries = new Map<string, Boundary>()
  const gateScopes = (strategy.phase_gates ?? []).map(gate => ({
    gate,
    localIds: new Set(resolveGateScope(gate.scope, sorted)),
  }))

  function resolveDependencyTaskId(dependent: string, required: string): string | undefined {
    const boundary = boundaries.get(required)?.byCycle.get(1)
    if (!boundary) return finalizeTaskId.get(required)

    const commonGateBoundaries = gateScopes
      .filter(({ localIds }) => localIds.has(dependent) && localIds.has(required))
      .map(({ gate }) => {
        let match: { index: number; taskId: string } | null = null
        for (let i = 0; i < boundary.phaseSets.length; i++) {
          const phaseSet = boundary.phaseSets[i]
          if (gate.after_phase_sets.includes(phaseSet.phaseSet)) {
            match = { index: i, taskId: phaseSet.lastTaskId }
          }
        }
        return match
      })
      .filter((match): match is { index: number; taskId: string } => match !== null)
      .sort((a, b) => a.index - b.index)

    return (
      commonGateBoundaries[0]?.taskId ??
      boundary.lastPreFinalizeId ??
      finalizeTaskId.get(required)
    )
  }

  // Use a Map to allow post-generation patching for phase gates
  const taskMap = new Map<string, GeneratedTask>()

  for (const d of sorted) {
    // Completed deliverables: single 000 task (no phase expansion, no Gantt bar)
    if (completedLocalIds.has(d.local_id)) {
      const owner = getOwner(d.local_id, strategy.owner_rules) ?? 'PM'
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
      const taskId = buildTaskId(track, d.local_id, '000')
      taskMap.set(taskId, {
        local_id: d.local_id,
        phase_suffix: '000',
        name: '完了済み',
        duration_days: 0.001,
        depends_on: [...firstDeps],
        owner,
        tags: ['initial-complete'],
      })
      finalizeTaskId.set(d.local_id, taskId)
      boundaries.set(d.local_id, {
        cycles: 1,
        byCycle: new Map([[1, { lastPreFinalizeId: null, phaseSets: [] }]]),
      })
      continue
    }

    const ownerRule = strategy.owner_rules.find(r => r.local_ids.includes(d.local_id))
    let selection
    try {
      selection = ownerRule?.phase_sets
        ? normalizePhaseSetSelection(ownerRule.phase_sets, [])
        : ownerRule?.phase_set
          ? normalizePhaseSetSelection([ownerRule.phase_set], [])
          : defaultPhaseSets
    } catch (err) {
      errors.push(`${d.local_id}: ${err instanceof Error ? err.message : String(err)}`)
      continue
    }
    const expandedPhases = expandPhaseSetSelection(selection, strategy.phase_sets)
    if (expandedPhases.length === 0) {
      warnings.push(
        `No phases resolved for '${d.local_id}' (phase_sets: ${selection.sequence.map(ref => ref.phaseSet).join(', ')}) — skipping`
      )
      continue
    }

    const owner = getOwner(d.local_id, strategy.owner_rules)
    if (!owner) {
      errors.push(`No owner_rule found for local_id: ${d.local_id}`)
      continue
    }

    const lastPhaseSetIndex = selection.sequence.length - 1

    // Keep dependencies inside the earliest phase gate shared by both deliverables.
    // Otherwise a pre-gate task could wait on a post-gate task and create a cycle.
    // Completed deliverables have no expanded boundary, so fall back to their 000 task.
    const firstDeps = new Set<string>()
    for (const dep of d.depends_on) {
      const depId = resolveDependencyTaskId(d.local_id, dep)
      if (depId) firstDeps.add(depId)
    }
    for (const cd of crossDeps) {
      if (cd.dependent !== d.local_id) continue
      const depId = resolveDependencyTaskId(d.local_id, cd.requires)
      if (depId) firstDeps.add(depId)
    }
    let prevId: string | null = null
    const byCycle = new Map<number, CycleBoundary>()

    for (let i = 0; i < expandedPhases.length; i++) {
      const expanded = expandedPhases[i]
      const phase = expanded.phase
      const taskId = buildTaskId(
        track,
        d.local_id,
        phase.task_suffix,
        expanded.cycle,
        expanded.iteration
      )
      if (taskMap.has(taskId)) {
        errors.push(
          `Duplicate generated task ID '${taskId}'. Use iterations instead of repeating the same phase_set reference.`
        )
        continue
      }
      taskMap.set(taskId, {
        local_id: d.local_id,
        phase_suffix: phase.task_suffix,
        phase_set: expanded.phaseSet,
        phase_id: phase.id,
        ...(expanded.cycle !== undefined ? { cycle: expanded.cycle } : {}),
        ...(expanded.iteration !== undefined ? { iteration: expanded.iteration } : {}),
        name: phase.name,
        duration_days: phase.duration_days,
        depends_on: i === 0 ? [...firstDeps] : [prevId!],
        owner,
        ...(phase.description ? { description: phase.description } : {}),
      })
      const boundary = byCycle.get(expanded.cycleNumber) ?? {
        lastPreFinalizeId: null,
        phaseSets: [],
      }
      const phaseSetBoundary = boundary.phaseSets[expanded.phaseSetIndex]
      if (phaseSetBoundary) {
        phaseSetBoundary.lastTaskId = taskId
      } else {
        boundary.phaseSets[expanded.phaseSetIndex] = {
          phaseSet: expanded.phaseSet,
          firstTaskId: taskId,
          lastTaskId: taskId,
          nextTaskId: null,
        }
      }
      if (expanded.phaseSetIndex < lastPhaseSetIndex) {
        boundary.lastPreFinalizeId = taskId
      }
      byCycle.set(expanded.cycleNumber, boundary)
      prevId = taskId
    }
    for (const boundary of byCycle.values()) {
      for (let i = 0; i < boundary.phaseSets.length - 1; i++) {
        boundary.phaseSets[i].nextTaskId = boundary.phaseSets[i + 1].firstTaskId
      }
    }
    if (prevId) finalizeTaskId.set(d.local_id, prevId)
    boundaries.set(d.local_id, { cycles: selection.cycles, byCycle })
  }

  if (errors.length > 0)
    return { projectId, track, startDate, tasks: [], milestones: [], errors, warnings }

  // Process phase gates and block the phase_set immediately following each configured boundary.
  const milestones: GeneratedMilestone[] = []

  for (const gate of strategy.phase_gates ?? []) {
    const scopedLocalIds = resolveGateScope(gate.scope, sorted)
    if (scopedLocalIds.length === 0) {
      warnings.push(`phase_gate ${gate.id}: no deliverables found in scope`)
      continue
    }

    const maxCycles = Math.max(...scopedLocalIds.map(id => boundaries.get(id)?.cycles ?? 1))
    for (let cycleNumber = 1; cycleNumber <= maxCycles; cycleNumber++) {
      const gateId =
        maxCycles > 1 ? `${gate.id}-C${String(cycleNumber).padStart(2, '0')}` : gate.id
      const gateDeps = scopedLocalIds
        .map(id => {
          const phaseSets = boundaries.get(id)?.byCycle.get(cycleNumber)?.phaseSets ?? []
          return phaseSets
            .filter(boundary => gate.after_phase_sets.includes(boundary.phaseSet))
            .at(-1)?.lastTaskId
        })
        .filter((id): id is string => id !== null && id !== undefined)

      if (gateDeps.length === 0) {
        warnings.push(`phase_gate ${gateId}: no matching phase_set tasks found in scope`)
        continue
      }

      milestones.push({
        id: gateId,
        name: maxCycles > 1 ? `${gate.name} (cycle ${cycleNumber})` : gate.name,
        ...(gate.artifact_name !== undefined ? { artifact_name: gate.artifact_name } : {}),
        depends_on: gateDeps,
        owner: gate.owner,
      })

      for (const localId of scopedLocalIds) {
        const phaseSets = boundaries.get(localId)?.byCycle.get(cycleNumber)?.phaseSets ?? []
        const nextTaskId = phaseSets
          .filter(boundary => gate.after_phase_sets.includes(boundary.phaseSet))
          .at(-1)?.nextTaskId
        if (!nextTaskId) continue
        const task = taskMap.get(nextTaskId)
        if (!task || task.depends_on.includes(gateId)) continue
        task.depends_on.push(gateId)
      }
    }
  }

  const tasks = [...taskMap.values()]

  // Build per-group milestones from group_milestones config
  for (const gm of strategy.group_milestones ?? []) {
    const groupDeliverables = sorted.filter(d => {
      if (d.catalogId !== gm.catalog_id) return false
      return gm.group !== undefined ? d.groupName === gm.group : true
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
      ...(mc.artifact_name !== undefined ? { artifact_name: mc.artifact_name } : {}),
      depends_on: leafFinalizeIds,
      owner: mc.owner,
      ...(mc.date_hint !== undefined ? { date_hint: mc.date_hint } : {}),
      ...(mc.tags !== undefined ? { tags: mc.tags } : {}),
    })
  }

  return { projectId, track, startDate, tasks, milestones, errors, warnings }
}
