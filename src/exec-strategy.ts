import { existsSync } from 'node:fs'
import { listFilesRecursive, readYaml } from './exec-shared.js'

export type TaskMode = 'exec' | 'review'

type StrategyPhaseMinimal = {
  id: string
  task_suffix: string
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

/**
 * Builds a phase mode index by combining:
 *   1. sch-strategy: maps localId → phaseSet, phaseSet+phaseId → suffix
 *   2. exec-strategy: if a matched rule has capabilities:[review], marks those phases as 'review'
 * All other phases default to 'exec'.
 */
export function buildPhaseModeIndex(
  schedulePath: string,
  executionPath: string
): PhaseModeIndex {
  const localIdToPhaseSet = new Map<string, string>()
  // phaseSet:phaseId → suffix (used to cross-reference exec-strategy rules)
  const phaseSetPhaseIdToSuffix = new Map<string, string>()
  const phaseSetSuffixToMode = new Map<string, TaskMode>()

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

    const defaultPhaseSet = strategy.default_phase_set ?? ''

    for (const [phaseSetName, phases] of Object.entries(strategy.phase_sets)) {
      if (!Array.isArray(phases)) continue
      for (const phase of phases) {
        if (!phase || typeof phase !== 'object') continue
        const p = phase as Record<string, unknown>
        const suffix = String(p.task_suffix ?? '')
        const phaseId = String(p.id ?? '')
        if (suffix && phaseId) {
          phaseSetPhaseIdToSuffix.set(`${phaseSetName}:${phaseId}`, suffix)
          phaseSetSuffixToMode.set(`${phaseSetName}:${suffix}`, 'exec')
        }
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

  // Step 2: Read exec-strategy files; any rule with capabilities:[review] marks phases as 'review'
  if (existsSync(executionPath)) {
    const execStrategyFiles = listFilesRecursive(executionPath).filter(f =>
      /exec-strategy-.*\.(yaml|yml)$/.test(f)
    )

    for (const filePath of execStrategyFiles) {
      let config: { assignment_rules?: unknown[] }
      try {
        config = readYaml(filePath) as { assignment_rules?: unknown[] }
      } catch {
        continue
      }
      if (!Array.isArray(config?.assignment_rules)) continue

      for (const rule of config.assignment_rules) {
        if (!rule || typeof rule !== 'object') continue
        const r = rule as Record<string, unknown>
        const caps = Array.isArray(r.capabilities) ? (r.capabilities as string[]) : []
        if (!caps.includes('review')) continue

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
  }

  return { localIdToPhaseSet, phaseSetSuffixToMode }
}

/**
 * Resolves the task mode for a given task.
 * Resolution order:
 *   1. Phase-level mode from exec-strategy capabilities (via index)
 *   2. 'exec' (hard default)
 */
export function resolveTaskMode(
  localId: string | undefined,
  taskId: string,
  index: PhaseModeIndex
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
  return 'exec'
}
