import { existsSync } from 'node:fs'
import { listFilesRecursive, readYaml } from './exec-shared.js'
import type { ApproachMode, TaskKind, TaskMode } from './exec-types.js'

type StrategyPhaseMinimal = {
  id: string
  task_suffix: string
  execution?: 'agent' | 'human'
  approach_mode?: unknown
  task_kind?: unknown
}

type StrategyPhaseOverrideMinimal = {
  phase: string
  execution?: 'agent' | 'human'
  approach_mode?: unknown
  task_kind?: unknown
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

type ExecStrategyMinimal = {
  default_mode?: TaskMode
  assignment_rules?: unknown[]
}

export type PhaseModeIndex = {
  localIdToPhaseSets: Map<string, string[]>
  phaseSetSuffixToMode: Map<string, TaskMode>
  phaseSetSuffixToExecution: Map<string, 'agent' | 'human'>
  suffixToExecution: Map<string, 'agent' | 'human'>
  phaseSetSuffixToApproachMode: Map<string, ApproachMode>
  phaseSetSuffixToTaskKind: Map<string, TaskKind>
  localIdSuffixToApproachMode: Map<string, ApproachMode>
  localIdSuffixToTaskKind: Map<string, TaskKind>
  defaultMode: TaskMode
}

function isTaskMode(value: unknown): value is TaskMode {
  return value === 'edit' || value === 'review'
}

function isApproachMode(value: unknown): value is ApproachMode {
  return value === 'fully-guided' || value === 'recipe-guided' || value === 'freeform'
}

function isTaskKind(value: unknown): value is TaskKind {
  return (
    value === 'deliverable-edit' ||
    value === 'deliverable-review' ||
    value === 'reference-maintenance'
  )
}

/**
 * Builds a phase mode index by combining:
 *   1. sch-strategy: maps localId → phaseSet, phaseSet+phaseId → suffix
 *   2. exec-strategy: default_mode declares the fallback mode for unmatched phases
 *      (hard default: 'edit'); rules with mode: review mark matching phases as 'review'.
 */
export function buildPhaseModeIndex(
  schedulePath: string,
  executionPath: string
): PhaseModeIndex {
  const localIdToPhaseSets = new Map<string, string[]>()
  // phaseSet:phaseId → suffix (used to cross-reference exec-strategy rules and phase_overrides)
  const phaseSetPhaseIdToSuffix = new Map<string, string>()
  const phaseSetSuffixToMode = new Map<string, TaskMode>()
  const phaseSetSuffixToExecution = new Map<string, 'agent' | 'human'>()
  // Global suffix → execution: suffixes are unique within a track across all phase sets.
  const suffixToExecution = new Map<string, 'agent' | 'human'>()
  // phaseSet:suffix → approach_mode/task_kind declared on the phase definition (phase_sets[phaseSet][phase])
  const phaseSetSuffixToApproachMode = new Map<string, ApproachMode>()
  const phaseSetSuffixToTaskKind = new Map<string, TaskKind>()
  // localId:suffix → approach_mode/task_kind declared on owner_rules[].phase_overrides (takes precedence)
  const localIdSuffixToApproachMode = new Map<string, ApproachMode>()
  const localIdSuffixToTaskKind = new Map<string, TaskKind>()

  // Step 0: Read exec-strategy files once; reused for default_mode and assignment_rules.
  const execStrategyConfigs: ExecStrategyMinimal[] = []
  if (existsSync(executionPath)) {
    const execStrategyFiles = listFilesRecursive(executionPath).filter(f =>
      /exec-strategy-.*\.(yaml|yml)$/.test(f)
    )
    for (const filePath of execStrategyFiles) {
      try {
        execStrategyConfigs.push(readYaml(filePath) as ExecStrategyMinimal)
      } catch {
        continue
      }
    }
  }

  let defaultMode: TaskMode = 'edit'
  for (const config of execStrategyConfigs) {
    if (isTaskMode(config.default_mode)) {
      defaultMode = config.default_mode
      break
    }
  }

  // Step 1: Read sch-strategy files to build phase maps
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
          phaseSetSuffixToMode.set(`${phaseSetName}:${suffix}`, defaultMode)
          // execution: manual or auto (default: auto)
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
          const overrideApproachMode = isApproachMode(override.approach_mode)
            ? override.approach_mode
            : undefined
          const overrideTaskKind = isTaskKind(override.task_kind) ? override.task_kind : undefined
          if (overrideApproachMode === undefined && overrideTaskKind === undefined) continue

          for (const phaseSetName of phaseSetNames) {
            const suffix = phaseSetPhaseIdToSuffix.get(`${phaseSetName}:${override.phase}`)
            if (!suffix) continue
            for (const localId of localIds) {
              if (overrideApproachMode !== undefined) {
                localIdSuffixToApproachMode.set(`${localId}:${suffix}`, overrideApproachMode)
              }
              if (overrideTaskKind !== undefined) {
                localIdSuffixToTaskKind.set(`${localId}:${suffix}`, overrideTaskKind)
              }
            }
          }
        }
      }
    }
  }

  // Step 2: assignment_rules with mode: review mark matching phases as 'review'.
  // Legacy support: rules with capabilities: [review] (no mode field) also mark as 'review'.
  for (const config of execStrategyConfigs) {
    if (!Array.isArray(config.assignment_rules)) continue

    for (const rule of config.assignment_rules) {
      if (!rule || typeof rule !== 'object') continue
      const r = rule as Record<string, unknown>

      // Determine mode: explicit mode field takes precedence; legacy capabilities:[review] fallback
      const explicitMode = typeof r.mode === 'string' ? r.mode : undefined
      const caps = Array.isArray(r.capabilities) ? (r.capabilities as string[]) : []
      const isReview =
        explicitMode === 'review' || (explicitMode === undefined && caps.includes('review'))
      if (!isReview) continue

      const rulePhaseSet = typeof r.phase_set === 'string' ? r.phase_set : undefined
      const rulePhase = typeof r.phase === 'string' ? r.phase : undefined

      for (const [key, suffix] of phaseSetPhaseIdToSuffix.entries()) {
        const colonIdx = key.indexOf(':')
        const keyPhaseSet = key.slice(0, colonIdx)
        const keyPhaseId = key.slice(colonIdx + 1)
        if (rulePhaseSet !== undefined && rulePhaseSet !== keyPhaseSet) continue
        if (rulePhase !== undefined && rulePhase !== keyPhaseId) continue
        phaseSetSuffixToMode.set(`${keyPhaseSet}:${suffix}`, 'review')
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
    localIdSuffixToApproachMode,
    localIdSuffixToTaskKind,
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
 *   1. Phase-level mode from exec-strategy (via index), checked across all phase sets
 *      assigned to the deliverable's local_id
 *   2. exec-strategy's default_mode (falls back to 'edit' when not declared)
 */
export function resolveTaskMode(
  localId: string | undefined,
  taskId: string,
  index: PhaseModeIndex
): TaskMode {
  if (localId) {
    const phaseSets = index.localIdToPhaseSets.get(localId)
    if (phaseSets) {
      const suffix = taskId.split('-').pop() ?? ''
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
