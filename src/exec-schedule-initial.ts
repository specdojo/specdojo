import { type CurrentState, type ScheduleIndex } from './exec-types.js'
import { listFilesRecursive, normalizeDateOnly, readYaml } from './exec-shared.js'

type StrategyPhase = {
  id: string
  task_suffix: string
}

type StrategyOwnerRule = {
  local_ids: string[]
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

    const defaultPhaseSet = strategy.default_phase_set ?? ''

    // local_id → phase_set
    const localIdPhaseSetMap = new Map<string, string>()
    for (const rule of strategy.owner_rules ?? []) {
      const phaseSet = rule.phase_set ?? defaultPhaseSet
      for (const localId of rule.local_ids) {
        localIdPhaseSetMap.set(localId, phaseSet)
      }
    }

    // phase_set → ordered phase ids
    const phaseOrderMap = new Map<string, string[]>()
    // "phase_set:suffix" → phase_id
    const suffixToPhaseId = new Map<string, string>()
    for (const [phaseSetName, phases] of Object.entries(strategy.phase_sets)) {
      phaseOrderMap.set(phaseSetName, phases.map(p => p.id))
      for (const phase of phases) {
        suffixToPhaseId.set(`${phaseSetName}:${phase.task_suffix}`, phase.id)
      }
    }

    for (const entry of strategy.initial_state.completed_deliverables) {
      const { local_id, completed_through, by, note } = entry
      const completedDate = normalizeDateOnly(entry.completed_on) ?? '1970-01-01'
      const completedTs = `${completedDate}T00:00:00Z`

      const phaseSet = localIdPhaseSetMap.get(local_id) ?? defaultPhaseSet
      const phaseOrder = phaseOrderMap.get(phaseSet)
      if (!phaseOrder?.length) continue

      const throughIndex = completed_through
        ? phaseOrder.indexOf(completed_through)
        : phaseOrder.length - 1
      if (throughIndex < 0) continue

      for (const node of schedule.nodes.values()) {
        if (node.kind !== 'task') continue
        if (!node.name?.startsWith(`${local_id} `)) continue

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
        const phaseId = suffixToPhaseId.get(`${phaseSet}:${suffix}`)
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
