import { listFilesRecursive, readYaml } from './exec-shared.js'

export type TaskMode = 'exec' | 'review'

type StrategyPhaseMinimal = {
  task_suffix: string
  mode?: string
}

type StrategyMinimal = {
  phase_sets?: Record<string, StrategyPhaseMinimal[]>
  default_phase_set?: string
  owner_rules?: Array<{ local_ids: string[]; phase_set?: string }>
}

export type PhaseModeIndex = {
  localIdToPhaseSet: Map<string, string>
  phaseSetSuffixToMode: Map<string, TaskMode>
}

export function buildPhaseModeIndex(schedulePath: string): PhaseModeIndex {
  const localIdToPhaseSet = new Map<string, string>()
  const phaseSetSuffixToMode = new Map<string, TaskMode>()

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

    const defaultPhaseSet = strategy.default_phase_set ?? ''

    for (const [phaseSetName, phases] of Object.entries(strategy.phase_sets)) {
      if (!Array.isArray(phases)) continue
      for (const phase of phases) {
        if (!phase || typeof phase !== 'object') continue
        const suffix = String((phase as Record<string, unknown>).task_suffix ?? '')
        const rawMode = (phase as Record<string, unknown>).mode
        const mode: TaskMode = rawMode === 'review' ? 'review' : 'exec'
        if (suffix) phaseSetSuffixToMode.set(`${phaseSetName}:${suffix}`, mode)
      }
    }

    if (Array.isArray(strategy.owner_rules)) {
      for (const rule of strategy.owner_rules) {
        const phaseSet = rule.phase_set ?? defaultPhaseSet
        for (const localId of rule.local_ids ?? []) {
          localIdToPhaseSet.set(localId, phaseSet)
        }
      }
    }
  }

  return { localIdToPhaseSet, phaseSetSuffixToMode }
}

/**
 * Resolves the task mode for a given task.
 * Resolution order:
 *   1. Phase-level mode from sch-strategy (explicit)
 *   2. memberDefaultMode (fallback when phase has no mode)
 *   3. 'exec' (hard default)
 */
export function resolveTaskMode(
  localId: string | undefined,
  taskId: string,
  index: PhaseModeIndex,
  memberDefaultMode?: TaskMode
): TaskMode {
  if (localId) {
    const phaseSet = index.localIdToPhaseSet.get(localId)
    if (phaseSet) {
      const suffix = taskId.split('-').pop() ?? ''
      if (/^\d{3}$/.test(suffix)) {
        const mode = index.phaseSetSuffixToMode.get(`${phaseSet}:${suffix}`)
        if (mode !== undefined) return mode
      }
    }
  }
  return memberDefaultMode ?? 'exec'
}
