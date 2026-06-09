import { listFilesRecursive, readYaml } from './exec-shared.js'
import type { ApproachMode, Proficiency, TaskKind, TaskMode } from './exec-types.js'

type StrategyPhaseMinimal = {
  id: string
  task_suffix: string
  execution?: 'agent' | 'human'
  mode?: unknown
  approach_mode?: unknown
  task_kind?: unknown
  capabilities?: unknown
  proficiency?: unknown
}

type StrategyPhaseOverrideMinimal = {
  phase: string
  execution?: 'agent' | 'human'
  mode?: unknown
  approach_mode?: unknown
  task_kind?: unknown
  capabilities?: unknown
  proficiency?: unknown
}

type StrategyMinimal = {
  phase_sets?: Record<string, StrategyPhaseMinimal[]>
  default_phase_sets?: string[]
  default_phase_set?: string
  owner_rules?: Array<{
    local_ids: string[]
    phase_sets?: string[]
    phase_set?: string
    phase_overrides?: StrategyPhaseOverrideMinimal[]
  }>
}

export type PhaseModeIndex = {
  localIdToPhaseSets: Map<string, string[]>
  phaseSetSuffixToMode: Map<string, TaskMode>
  phaseSetSuffixToExecution: Map<string, 'agent' | 'human'>
  suffixToExecution: Map<string, 'agent' | 'human'>
  phaseSetSuffixToApproachMode: Map<string, ApproachMode>
  phaseSetSuffixToTaskKind: Map<string, TaskKind>
  phaseSetSuffixToCapabilities: Map<string, string[]>
  phaseSetSuffixToProficiency: Map<string, Proficiency>
  localIdSuffixToExecution: Map<string, 'agent' | 'human'>
  localIdSuffixToMode: Map<string, TaskMode>
  localIdSuffixToApproachMode: Map<string, ApproachMode>
  localIdSuffixToTaskKind: Map<string, TaskKind>
  localIdSuffixToCapabilities: Map<string, string[]>
  localIdSuffixToProficiency: Map<string, Proficiency>
  defaultMode: TaskMode
}

function isTaskMode(value: unknown): value is TaskMode {
  return value === 'edit' || value === 'review'
}

function isApproachMode(value: unknown): value is ApproachMode {
  return value === 'fully-guided' || value === 'recipe-guided' || value === 'freeform'
}

function isTaskKind(value: unknown): value is TaskKind {
  return value === 'deliverable' || value === 'reference-maintenance'
}

function isProficiency(value: unknown): value is Proficiency {
  return value === 'low' || value === 'normal' || value === 'high' || value === 'expert'
}

function isExecution(value: unknown): value is 'agent' | 'human' {
  return value === 'agent' || value === 'human'
}

function asCapabilityList(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined
  const caps = value.filter((item): item is string => typeof item === 'string' && item.length > 0)
  return caps.length === value.length ? caps : undefined
}

/**
 * Builds a phase metadata index from sch-strategy files.
 * sch-strategy maps localId → phaseSet and phaseSet+phaseId → suffix, and phase
 * definitions carry runtime task metadata such as mode, execution, approach_mode,
 * task_kind, capabilities, and proficiency.
 */
export function buildPhaseModeIndex(schedulePath: string): PhaseModeIndex {
  const localIdToPhaseSets = new Map<string, string[]>()
  // phaseSet:phaseId → suffix (used to cross-reference phase_overrides)
  const phaseSetPhaseIdToSuffix = new Map<string, string>()
  const phaseSetSuffixToMode = new Map<string, TaskMode>()
  const phaseSetSuffixToExecution = new Map<string, 'agent' | 'human'>()
  // Global suffix → execution: suffixes are unique within a track across all phase sets.
  const suffixToExecution = new Map<string, 'agent' | 'human'>()
  // phaseSet:suffix → approach_mode/task_kind declared on the phase definition (phase_sets[phaseSet][phase])
  const phaseSetSuffixToApproachMode = new Map<string, ApproachMode>()
  const phaseSetSuffixToTaskKind = new Map<string, TaskKind>()
  const phaseSetSuffixToCapabilities = new Map<string, string[]>()
  const phaseSetSuffixToProficiency = new Map<string, Proficiency>()
  // localId:suffix → metadata declared on owner_rules[].phase_overrides (takes precedence)
  const localIdSuffixToExecution = new Map<string, 'agent' | 'human'>()
  const localIdSuffixToMode = new Map<string, TaskMode>()
  const localIdSuffixToApproachMode = new Map<string, ApproachMode>()
  const localIdSuffixToTaskKind = new Map<string, TaskKind>()
  const localIdSuffixToCapabilities = new Map<string, string[]>()
  const localIdSuffixToProficiency = new Map<string, Proficiency>()

  const defaultMode: TaskMode = 'edit'

  // Step 1: Read sch-strategy files to build phase maps and phase metadata.
  const strategyFiles = listFilesRecursive(schedulePath).filter(f =>
    /sch-strategy-.*\.(yaml|yml)$/.test(f)
  )

  for (const filePath of strategyFiles) {
    let strategy: StrategyMinimal
    try {
      strategy = readYaml(filePath) as StrategyMinimal
    } catch {
      continue
    }
    if (!strategy?.phase_sets) continue

    const defaultPhaseSetNames: string[] =
      strategy.default_phase_sets ??
      (strategy.default_phase_set ? [strategy.default_phase_set] : Object.keys(strategy.phase_sets))

    for (const [phaseSetName, phases] of Object.entries(strategy.phase_sets)) {
      if (!Array.isArray(phases)) continue
      for (const phase of phases) {
        if (!phase || typeof phase !== 'object') continue
        const p = phase as Record<string, unknown>
        const suffix = String(p.task_suffix ?? '')
        const phaseId = String(p.id ?? '')
        if (suffix && phaseId) {
          phaseSetPhaseIdToSuffix.set(`${phaseSetName}:${phaseId}`, suffix)
          phaseSetSuffixToMode.set(
            `${phaseSetName}:${suffix}`,
            isTaskMode(p.mode) ? p.mode : defaultMode
          )
          // execution: human or agent (default: agent)
          const execution = p.execution === 'human' ? 'human' : 'agent'
          phaseSetSuffixToExecution.set(`${phaseSetName}:${suffix}`, execution)
          // Global map: suffix is unique within a track across all phase sets
          suffixToExecution.set(suffix, execution)
          if (isApproachMode(p.approach_mode)) {
            phaseSetSuffixToApproachMode.set(`${phaseSetName}:${suffix}`, p.approach_mode)
          }
          if (isTaskKind(p.task_kind)) {
            phaseSetSuffixToTaskKind.set(`${phaseSetName}:${suffix}`, p.task_kind)
          }
          const capabilities = asCapabilityList(p.capabilities)
          if (capabilities !== undefined) {
            phaseSetSuffixToCapabilities.set(`${phaseSetName}:${suffix}`, capabilities)
          }
          if (isProficiency(p.proficiency)) {
            phaseSetSuffixToProficiency.set(`${phaseSetName}:${suffix}`, p.proficiency)
          }
        }
      }
    }

    if (Array.isArray(strategy.owner_rules)) {
      for (const rule of strategy.owner_rules) {
        const phaseSetNames =
          rule.phase_sets ?? (rule.phase_set ? [rule.phase_set] : null) ?? defaultPhaseSetNames
        const localIds = rule.local_ids ?? []
        for (const localId of localIds) {
          localIdToPhaseSets.set(localId, phaseSetNames)
        }

        for (const override of rule.phase_overrides ?? []) {
          if (!override || typeof override !== 'object') continue
          const overrideExecution = isExecution(override.execution) ? override.execution : undefined
          const overrideMode = isTaskMode(override.mode) ? override.mode : undefined
          const overrideApproachMode = isApproachMode(override.approach_mode)
            ? override.approach_mode
            : undefined
          const overrideTaskKind = isTaskKind(override.task_kind) ? override.task_kind : undefined
          const overrideCapabilities = asCapabilityList(override.capabilities)
          const overrideProficiency = isProficiency(override.proficiency)
            ? override.proficiency
            : undefined
          if (
            overrideExecution === undefined &&
            overrideMode === undefined &&
            overrideApproachMode === undefined &&
            overrideTaskKind === undefined &&
            overrideCapabilities === undefined &&
            overrideProficiency === undefined
          )
            continue

          for (const phaseSetName of phaseSetNames) {
            const suffix = phaseSetPhaseIdToSuffix.get(`${phaseSetName}:${override.phase}`)
            if (!suffix) continue
            for (const localId of localIds) {
              if (overrideExecution !== undefined) {
                localIdSuffixToExecution.set(`${localId}:${suffix}`, overrideExecution)
              }
              if (overrideMode !== undefined) {
                localIdSuffixToMode.set(`${localId}:${suffix}`, overrideMode)
              }
              if (overrideApproachMode !== undefined) {
                localIdSuffixToApproachMode.set(`${localId}:${suffix}`, overrideApproachMode)
              }
              if (overrideTaskKind !== undefined) {
                localIdSuffixToTaskKind.set(`${localId}:${suffix}`, overrideTaskKind)
              }
              if (overrideCapabilities !== undefined) {
                localIdSuffixToCapabilities.set(`${localId}:${suffix}`, overrideCapabilities)
              }
              if (overrideProficiency !== undefined) {
                localIdSuffixToProficiency.set(`${localId}:${suffix}`, overrideProficiency)
              }
            }
          }
        }
      }
    }
  }

  return {
    localIdToPhaseSets,
    phaseSetSuffixToMode,
    phaseSetSuffixToExecution,
    suffixToExecution,
    phaseSetSuffixToApproachMode,
    phaseSetSuffixToTaskKind,
    phaseSetSuffixToCapabilities,
    phaseSetSuffixToProficiency,
    localIdSuffixToExecution,
    localIdSuffixToMode,
    localIdSuffixToApproachMode,
    localIdSuffixToTaskKind,
    localIdSuffixToCapabilities,
    localIdSuffixToProficiency,
    defaultMode,
  }
}

/**
 * Resolves the approach_mode for a given task.
 * Resolution order:
 *   1. owner_rules[].phase_overrides[].approach_mode (per-deliverable, takes precedence)
 *   2. Phase-level approach_mode from phase_sets[phase_set][phase], checked across all
 *      phase sets assigned to the deliverable's local_id
 *   3. undefined when not declared at either level
 */
export function resolveApproachMode(
  localId: string | undefined,
  taskId: string,
  index: PhaseModeIndex
): ApproachMode | undefined {
  if (!localId) return undefined
  const suffix = taskId.split('-').pop() ?? ''
  if (!/^\d{3}$/.test(suffix)) return undefined

  const overridden = index.localIdSuffixToApproachMode.get(`${localId}:${suffix}`)
  if (overridden !== undefined) return overridden

  const phaseSets = index.localIdToPhaseSets.get(localId)
  if (phaseSets) {
    for (const phaseSet of phaseSets) {
      const mode = index.phaseSetSuffixToApproachMode.get(`${phaseSet}:${suffix}`)
      if (mode !== undefined) return mode
    }
  }
  return undefined
}

/**
 * Resolves the task_kind for a given task.
 * Resolution order:
 *   1. owner_rules[].phase_overrides[].task_kind (per-deliverable, takes precedence)
 *   2. Phase-level task_kind from phase_sets[phase_set][phase], checked across all
 *      phase sets assigned to the deliverable's local_id
 *   3. undefined when not declared at either level
 */
export function resolveTaskKind(
  localId: string | undefined,
  taskId: string,
  index: PhaseModeIndex
): TaskKind | undefined {
  if (!localId) return undefined
  const suffix = taskId.split('-').pop() ?? ''
  if (!/^\d{3}$/.test(suffix)) return undefined

  const overridden = index.localIdSuffixToTaskKind.get(`${localId}:${suffix}`)
  if (overridden !== undefined) return overridden

  const phaseSets = index.localIdToPhaseSets.get(localId)
  if (phaseSets) {
    for (const phaseSet of phaseSets) {
      const kind = index.phaseSetSuffixToTaskKind.get(`${phaseSet}:${suffix}`)
      if (kind !== undefined) return kind
    }
  }
  return undefined
}

/**
 * Resolves the task mode for a given task.
 * Resolution order:
 *   1. owner_rules[].phase_overrides[].mode (per-deliverable, takes precedence)
 *   2. Phase-level mode from phase_sets[phase_set][phase]
 *   3. 'edit' when not declared at either level
 */
export function resolveTaskMode(
  localId: string | undefined,
  taskId: string,
  index: PhaseModeIndex
): TaskMode {
  if (localId) {
    const suffix = taskId.split('-').pop() ?? ''
    if (/^\d{3}$/.test(suffix)) {
      const overridden = index.localIdSuffixToMode.get(`${localId}:${suffix}`)
      if (overridden !== undefined) return overridden
    }

    const phaseSets = index.localIdToPhaseSets.get(localId)
    if (phaseSets) {
      if (/^\d{3}$/.test(suffix)) {
        for (const phaseSet of phaseSets) {
          const mode = index.phaseSetSuffixToMode.get(`${phaseSet}:${suffix}`)
          if (mode !== undefined) return mode
        }
      }
    }
  }
  return index.defaultMode
}

/**
 * Resolves required capabilities for a given task.
 * Resolution order:
 *   1. owner_rules[].phase_overrides[].capabilities (per-deliverable, takes precedence)
 *   2. Phase-level capabilities from phase_sets[phase_set][phase]
 *   3. [] when not declared at either level
 */
export function resolveTaskCapabilities(
  localId: string | undefined,
  taskId: string,
  index: PhaseModeIndex
): string[] {
  if (!localId) return []
  const suffix = taskId.split('-').pop() ?? ''
  if (!/^\d{3}$/.test(suffix)) return []

  const overridden = index.localIdSuffixToCapabilities.get(`${localId}:${suffix}`)
  if (overridden !== undefined) return overridden

  const phaseSets = index.localIdToPhaseSets.get(localId)
  if (phaseSets) {
    for (const phaseSet of phaseSets) {
      const capabilities = index.phaseSetSuffixToCapabilities.get(`${phaseSet}:${suffix}`)
      if (capabilities !== undefined) return capabilities
    }
  }
  return []
}

/**
 * Resolves required proficiency for a given task.
 * Resolution order:
 *   1. owner_rules[].phase_overrides[].proficiency (per-deliverable, takes precedence)
 *   2. Phase-level proficiency from phase_sets[phase_set][phase]
 *   3. undefined when not declared at either level
 */
export function resolveTaskProficiency(
  localId: string | undefined,
  taskId: string,
  index: PhaseModeIndex
): Proficiency | undefined {
  if (!localId) return undefined
  const suffix = taskId.split('-').pop() ?? ''
  if (!/^\d{3}$/.test(suffix)) return undefined

  const overridden = index.localIdSuffixToProficiency.get(`${localId}:${suffix}`)
  if (overridden !== undefined) return overridden

  const phaseSets = index.localIdToPhaseSets.get(localId)
  if (phaseSets) {
    for (const phaseSet of phaseSets) {
      const proficiency = index.phaseSetSuffixToProficiency.get(`${phaseSet}:${suffix}`)
      if (proficiency !== undefined) return proficiency
    }
  }
  return undefined
}

/**
 * Resolves whether the task should be executed by an agent or a human.
 * Reads from sch-strategy phase execution field via the index.
 * Default: 'agent'.
 */
export function resolveTaskExecution(
  localId: string | undefined,
  taskId: string,
  index: PhaseModeIndex
): 'agent' | 'human' {
  const suffix = taskId.split('-').pop() ?? ''
  if (!/^\d{3}$/.test(suffix)) return 'agent'

  if (localId) {
    const overridden = index.localIdSuffixToExecution.get(`${localId}:${suffix}`)
    if (overridden !== undefined) return overridden
  }

  // First try phaseSet-specific lookup (works when owner_rule has explicit phase_set(s))
  if (localId) {
    const phaseSets = index.localIdToPhaseSets.get(localId)
    if (phaseSets) {
      for (const phaseSet of phaseSets) {
        const execution = index.phaseSetSuffixToExecution.get(`${phaseSet}:${suffix}`)
        if (execution !== undefined) return execution
      }
    }
  }
  // Fallback: global suffix map (covers default_phase_sets case)
  return index.suffixToExecution.get(suffix) ?? 'agent'
}
