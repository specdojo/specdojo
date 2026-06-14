import { type CurrentState, type ScheduleIndex } from './exec-types.js'
import { listFilesRecursive, normalizeDateOnly, readYaml } from './exec-shared.js'
import {
  expandPhaseSetSelection,
  normalizePhaseSetSelection,
  type NormalizedPhaseSetSelection,
  type PhaseSetSelection,
} from './schedule-phase-sets.js'

type StrategyPhase = {
  id: string
  task_suffix: string
}

type StrategyOwnerRule = {
  local_ids: string[]
  phase_sets?: PhaseSetSelection
  phase_set?: string
}

type CompletedThrough =
  | string
  | {
      phase_set: string
      phase: string
      cycle?: number
      iteration?: number
    }

type CompletedDeliverable = {
  local_id: string
  completed_through?: CompletedThrough
  completed_on: string | Date
  by: string
  note?: string
}

type StrategyForInitial = {
  phase_sets?: Record<string, StrategyPhase[]>
  default_phase_sets?: PhaseSetSelection
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

    let defaultSelection: NormalizedPhaseSetSelection
    try {
      defaultSelection = normalizePhaseSetSelection(
        strategy.default_phase_sets,
        strategy.default_phase_set ? [strategy.default_phase_set] : Object.keys(phaseSets)
      )
    } catch {
      continue
    }

    const localIdSelections = new Map<string, NormalizedPhaseSetSelection>()
    for (const rule of strategy.owner_rules ?? []) {
      let selection: NormalizedPhaseSetSelection
      try {
        selection = rule.phase_sets
          ? normalizePhaseSetSelection(rule.phase_sets, [])
          : rule.phase_set
            ? normalizePhaseSetSelection([rule.phase_set], [])
            : defaultSelection
      } catch {
        continue
      }
      for (const localId of rule.local_ids) {
        localIdSelections.set(localId, selection)
      }
    }

    for (const entry of strategy.initial_state.completed_deliverables) {
      const { local_id, completed_through, by, note } = entry
      const completedDate = normalizeDateOnly(entry.completed_on) ?? '1970-01-01'
      const completedTs = `${completedDate}T00:00:00Z`

      const expanded = expandPhaseSetSelection(
        localIdSelections.get(local_id) ?? defaultSelection,
        phaseSets
      )
      if (!expanded.length) continue

      const throughIndex =
        completed_through === undefined
          ? expanded.length - 1
          : typeof completed_through === 'string'
            ? expanded.findIndex(item => item.phase.id === completed_through)
            : expanded.findIndex(
                item =>
                  item.phaseSet === completed_through.phase_set &&
                  item.phase.id === completed_through.phase &&
                  (completed_through.cycle === undefined ||
                    item.cycleNumber === completed_through.cycle) &&
                  (completed_through.iteration === undefined ||
                    item.iterationNumber === completed_through.iteration)
              )
      if (throughIndex < 0) continue

      for (const node of schedule.nodes.values()) {
        if (node.kind !== 'task') continue
        // Use explicit local_id field only
        if (node.local_id !== local_id) continue

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

        const phaseIndex = expanded.findIndex(
          item =>
            (node.phase_set ? item.phaseSet === node.phase_set : true) &&
            (node.phase_id
              ? item.phase.id === node.phase_id
              : item.phase.task_suffix === node.phase_suffix) &&
            (node.cycle === undefined || item.cycleNumber === node.cycle) &&
            (node.iteration === undefined || item.iterationNumber === node.iteration)
        )
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
