import { listFilesRecursive, readYaml } from './exec-shared.js'
import type { Approach, Proficiency, TaskMode } from './exec-types.js'
import {
  extractPhaseSuffix,
  normalizePhaseSetSelection,
  phaseSetNames,
  type PhaseSetSelection,
} from './schedule-phase-sets.js'

type StrategyPhaseMinimal = {
  id: string
  task_suffix: string
  execution?: 'agent' | 'human'
  mode?: unknown
  approach?: unknown
  capabilities?: unknown
  proficiency?: unknown
}

type StrategyPhaseOverrideMinimal = {
  phase: string
  execution?: 'agent' | 'human'
  mode?: unknown
  approach?: unknown
  capabilities?: unknown
  proficiency?: unknown
}

type StrategyMinimal = {
  phase_sets?: Record<string, StrategyPhaseMinimal[]>
  default_phase_sets?: PhaseSetSelection
  default_phase_set?: string
  owner_rules?: Array<{
    local_ids: string[]
    phase_sets?: PhaseSetSelection
    phase_set?: string
    phase_overrides?: StrategyPhaseOverrideMinimal[]
  }>
}

export type PhaseModeIndex = {
  localIdToPhaseSets: Map<string, string[]>
  phaseSetSuffixToMode: Map<string, TaskMode>
  phaseSetSuffixToExecution: Map<string, 'agent' | 'human'>
  suffixToExecution: Map<string, 'agent' | 'human'>
  phaseSetSuffixToApproach: Map<string, Approach>
  phaseSetSuffixToCapabilities: Map<string, string[]>
  phaseSetSuffixToProficiency: Map<string, Proficiency>
  localIdSuffixToExecution: Map<string, 'agent' | 'human'>
  localIdSuffixToMode: Map<string, TaskMode>
  localIdSuffixToApproach: Map<string, Approach>
  localIdSuffixToCapabilities: Map<string, string[]>
  localIdSuffixToProficiency: Map<string, Proficiency>
  defaultMode: TaskMode
}

function isTaskMode(value: unknown): value is TaskMode {
  return value === 'edit' || value === 'review'
}

function isApproach(value: unknown): value is Approach {
  return (
    value === 'fully-guided' ||
    value === 'recipe-guided' ||
    value === 'freeform' ||
    value === 'rulebook-maintenance' ||
    value === 'recipe-maintenance' ||
    value === 'sample-maintenance' ||
    value === 'template-maintenance'
  )
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
 * definitions carry runtime task metadata such as mode, execution, approach,
 * capabilities, and proficiency.
 */
export function buildPhaseModeIndex(schedulePath: string): PhaseModeIndex {
  const localIdToPhaseSets = new Map<string, string[]>()
  // phaseSet:phaseId → suffix (used to cross-reference phase_overrides)
  const phaseSetPhaseIdToSuffix = new Map<string, string>()
  const phaseSetSuffixToMode = new Map<string, TaskMode>()
  const phaseSetSuffixToExecution = new Map<string, 'agent' | 'human'>()
  // Global suffix → execution: suffixes are unique within a track across all phase sets.
  const suffixToExecution = new Map<string, 'agent' | 'human'>()
  // phaseSet:suffix → approach declared on the phase definition (phase_sets[phaseSet][phase])
  const phaseSetSuffixToApproach = new Map<string, Approach>()
  const phaseSetSuffixToCapabilities = new Map<string, string[]>()
  const phaseSetSuffixToProficiency = new Map<string, Proficiency>()
  // localId:suffix → metadata declared on owner_rules[].phase_overrides (takes precedence)
  const localIdSuffixToExecution = new Map<string, 'agent' | 'human'>()
  const localIdSuffixToMode = new Map<string, TaskMode>()
  const localIdSuffixToApproach = new Map<string, Approach>()
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

    let defaultPhaseSetNames: string[]
    try {
      defaultPhaseSetNames = phaseSetNames(
        normalizePhaseSetSelection(
          strategy.default_phase_sets,
          strategy.default_phase_set ? [strategy.default_phase_set] : Object.keys(strategy.phase_sets)
        )
      )
    } catch {
      continue
    }

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
          if (isApproach(p.approach)) {
            phaseSetSuffixToApproach.set(`${phaseSetName}:${suffix}`, p.approach)
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
        let rulePhaseSetNames: string[]
        try {
          rulePhaseSetNames = rule.phase_sets
            ? phaseSetNames(normalizePhaseSetSelection(rule.phase_sets, []))
            : rule.phase_set
              ? [rule.phase_set]
              : defaultPhaseSetNames
        } catch {
          continue
        }
        const localIds = rule.local_ids ?? []
        for (const localId of localIds) {
          localIdToPhaseSets.set(localId, rulePhaseSetNames)
        }

        for (const override of rule.phase_overrides ?? []) {
          if (!override || typeof override !== 'object') continue
          const overrideExecution = isExecution(override.execution) ? override.execution : undefined
          const overrideMode = isTaskMode(override.mode) ? override.mode : undefined
          const overrideApproach = isApproach(override.approach) ? override.approach : undefined
          const overrideCapabilities = asCapabilityList(override.capabilities)
          const overrideProficiency = isProficiency(override.proficiency)
            ? override.proficiency
            : undefined
          if (
            overrideExecution === undefined &&
            overrideMode === undefined &&
            overrideApproach === undefined &&
            overrideCapabilities === undefined &&
            overrideProficiency === undefined
          )
            continue

          for (const phaseSetName of rulePhaseSetNames) {
            const suffix = phaseSetPhaseIdToSuffix.get(`${phaseSetName}:${override.phase}`)
            if (!suffix) continue
            for (const localId of localIds) {
              if (overrideExecution !== undefined) {
                localIdSuffixToExecution.set(`${localId}:${suffix}`, overrideExecution)
              }
              if (overrideMode !== undefined) {
                localIdSuffixToMode.set(`${localId}:${suffix}`, overrideMode)
              }
              if (overrideApproach !== undefined) {
                localIdSuffixToApproach.set(`${localId}:${suffix}`, overrideApproach)
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
    phaseSetSuffixToApproach,
    phaseSetSuffixToCapabilities,
    phaseSetSuffixToProficiency,
    localIdSuffixToExecution,
    localIdSuffixToMode,
    localIdSuffixToApproach,
    localIdSuffixToCapabilities,
    localIdSuffixToProficiency,
    defaultMode,
  }
}

/**
 * Resolves the approach for a given task.
 * Resolution order:
 *   1. owner_rules[].phase_overrides[].approach (per-deliverable, takes precedence)
 *   2. Phase-level approach from phase_sets[phase_set][phase], checked across all
 *      phase sets assigned to the deliverable's local_id
 *   3. undefined when not declared at either level
 */
export function resolveApproach(
  localId: string | undefined,
  taskId: string,
  index: PhaseModeIndex,
  phaseSuffix?: string,
  phaseSet?: string
): Approach | undefined {
  if (!localId) return undefined
  const suffix = phaseSuffix ?? extractPhaseSuffix(taskId)
  if (!suffix) return undefined

  const overridden = index.localIdSuffixToApproach.get(`${localId}:${suffix}`)
  if (overridden !== undefined) return overridden

  const phaseSets = phaseSet ? [phaseSet] : index.localIdToPhaseSets.get(localId)
  if (phaseSets) {
    for (const phaseSet of phaseSets) {
      const approach = index.phaseSetSuffixToApproach.get(`${phaseSet}:${suffix}`)
      if (approach !== undefined) return approach
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
  index: PhaseModeIndex,
  phaseSuffix?: string,
  phaseSet?: string
): TaskMode {
  if (localId) {
    const suffix = phaseSuffix ?? extractPhaseSuffix(taskId)
    if (suffix) {
      const overridden = index.localIdSuffixToMode.get(`${localId}:${suffix}`)
      if (overridden !== undefined) return overridden
    }

    const phaseSets = phaseSet ? [phaseSet] : index.localIdToPhaseSets.get(localId)
    if (phaseSets) {
      if (suffix) {
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
  index: PhaseModeIndex,
  phaseSuffix?: string,
  phaseSet?: string
): string[] {
  if (!localId) return []
  const suffix = phaseSuffix ?? extractPhaseSuffix(taskId)
  if (!suffix) return []

  const overridden = index.localIdSuffixToCapabilities.get(`${localId}:${suffix}`)
  if (overridden !== undefined) return overridden

  const phaseSets = phaseSet ? [phaseSet] : index.localIdToPhaseSets.get(localId)
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
  index: PhaseModeIndex,
  phaseSuffix?: string,
  phaseSet?: string
): Proficiency | undefined {
  if (!localId) return undefined
  const suffix = phaseSuffix ?? extractPhaseSuffix(taskId)
  if (!suffix) return undefined

  const overridden = index.localIdSuffixToProficiency.get(`${localId}:${suffix}`)
  if (overridden !== undefined) return overridden

  const phaseSets = phaseSet ? [phaseSet] : index.localIdToPhaseSets.get(localId)
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
  index: PhaseModeIndex,
  phaseSuffix?: string,
  phaseSet?: string
): 'agent' | 'human' {
  const suffix = phaseSuffix ?? extractPhaseSuffix(taskId)
  if (!suffix) return 'agent'

  if (localId) {
    const overridden = index.localIdSuffixToExecution.get(`${localId}:${suffix}`)
    if (overridden !== undefined) return overridden
  }

  // First try phaseSet-specific lookup (works when owner_rule has explicit phase_set(s))
  if (localId) {
    const phaseSets = phaseSet ? [phaseSet] : index.localIdToPhaseSets.get(localId)
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
