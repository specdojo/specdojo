import { type CurrentState, type ScheduleIndex } from './exec-types.js'
import { listFilesRecursive, normalizeDateOnly, readYaml } from './exec-shared.js'

type StrategyPhase = {
  id: string
  task_suffix: string
}

type StrategyOwnerRule = {
  local_ids: string[]
  phase_sets?: string[]
  phase_set?: string
}

type CompletedDeliverable = {
  local_id: string
  completed_through?: string
  completed_on: string | Date
  by: string
  note?: string
}

type StrategyForInitial = {
  phase_sets?: Record<string, StrategyPhase[]>
  default_phase_sets?: string[]
  default_phase_set?: string
  owner_rules?: StrategyOwnerRule[]
  initial_state?: {
    completed_deliverables?: CompletedDeliverable[]
  }
}

export function buildInitialStateFromStrategy(
  schedulePath: string,
  schedule: ScheduleIndex
): Record<string, CurrentState> {
  const initial: Record<string, CurrentState> = {}

  const strategyFiles = listFilesRecursive(schedulePath).filter(f =>
    /sch-strategy-.*\.(yaml|yml)$/.test(f)
  )

  for (const filePath of strategyFiles) {
    let strategy: StrategyForInitial
    try {
      strategy = readYaml(filePath) as StrategyForInitial
    } catch {
      continue
    }
    if (!strategy?.initial_state?.completed_deliverables?.length) continue
    if (!strategy.phase_sets) continue
    const phaseSets = strategy.phase_sets

    // Resolve default phase set names (supports both singular and plural)
    const defaultPhaseSetNames: string[] =
      strategy.default_phase_sets ??
      (strategy.default_phase_set ? [strategy.default_phase_set] : Object.keys(phaseSets))

    // suffix → phase_id (global; assumes unique suffixes across all phase_sets)
    const suffixToPhaseId = new Map<string, string>()
    for (const phases of Object.values(phaseSets)) {
      for (const phase of phases) {
        suffixToPhaseId.set(phase.task_suffix, phase.id)
      }
    }

    // local_id → ordered phase ids (combined from the deliverable's phase_sets)
    const localIdPhasesMap = new Map<string, string[]>()
    for (const rule of strategy.owner_rules ?? []) {
      const rulePhaseSetNames: string[] =
        rule.phase_sets ?? (rule.phase_set ? [rule.phase_set] : null) ?? defaultPhaseSetNames
      const combinedPhaseIds = rulePhaseSetNames.flatMap(name =>
        (phaseSets[name] ?? []).map(p => p.id)
      )
      for (const localId of rule.local_ids) {
        localIdPhasesMap.set(localId, combinedPhaseIds)
      }
    }

    for (const entry of strategy.initial_state.completed_deliverables) {
      const { local_id, completed_through, by, note } = entry
      const completedDate = normalizeDateOnly(entry.completed_on) ?? '1970-01-01'
      const completedTs = `${completedDate}T00:00:00Z`

      const phaseOrder =
        localIdPhasesMap.get(local_id) ??
        defaultPhaseSetNames.flatMap(name => (phaseSets[name] ?? []).map(p => p.id))
      if (!phaseOrder.length) continue

      const throughIndex = completed_through
        ? phaseOrder.indexOf(completed_through)
        : phaseOrder.length - 1
      if (throughIndex < 0) continue

      for (const node of schedule.nodes.values()) {
        if (node.kind !== 'task') continue
        // Prefer explicit local_id field; fall back to name-prefix matching
        const nodeLocalId = node.local_id ?? node.name?.split(' ')[0]
        if (nodeLocalId !== local_id) continue

        const nodeParts = node.id.split('-')
        const suffix = nodeParts[nodeParts.length - 1]

        if (completed_through === undefined) {
          // All phases complete — mark regardless of whether the suffix is in the strategy
          initial[node.id] = {
            state: 'done',
            last_ts: completedTs,
            last_by: by,
            last_type: 'complete',
            last_msg: note ?? 'initial state',
            meta: { initial_state: true },
          }
          continue
        }

        // completed_through is specified — check phase order
        const phaseId = suffixToPhaseId.get(suffix)
        if (!phaseId) continue

        const phaseIndex = phaseOrder.indexOf(phaseId)
        if (phaseIndex < 0 || phaseIndex > throughIndex) continue

        initial[node.id] = {
          state: 'done',
          last_ts: completedTs,
          last_by: by,
          last_type: 'complete',
          last_msg: note ?? 'initial state',
          meta: { initial_state: true },
        }
      }
    }
  }

  return initial
}
