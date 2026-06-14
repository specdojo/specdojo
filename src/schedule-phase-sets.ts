export type PhaseSetReference = string | { phase_set: string; iterations?: number }

export type PhaseSetSelection =
  | PhaseSetReference[]
  | {
      cycles?: number
      sequence: PhaseSetReference[]
    }

export type NormalizedPhaseSetReference = {
  phaseSet: string
  iterations: number
}

export type NormalizedPhaseSetSelection = {
  cycles: number
  sequence: NormalizedPhaseSetReference[]
}

export type ExpandedPhase<T> = {
  phase: T
  phaseSet: string
  phaseSetIndex: number
  cycleNumber: number
  iterationNumber: number
  cycle?: number
  iteration?: number
}

function positiveInteger(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1) {
    throw new Error(`${field} must be an integer greater than or equal to 1`)
  }
  return value
}

function normalizeReference(reference: PhaseSetReference): NormalizedPhaseSetReference {
  if (typeof reference === 'string') {
    if (!reference.trim()) throw new Error('phase_set must be a non-empty string')
    return { phaseSet: reference, iterations: 1 }
  }
  if (!reference || typeof reference !== 'object' || !reference.phase_set?.trim()) {
    throw new Error('phase_set reference must define phase_set')
  }
  return {
    phaseSet: reference.phase_set,
    iterations:
      reference.iterations === undefined
        ? 1
        : positiveInteger(reference.iterations, 'iterations'),
  }
}

export function normalizePhaseSetSelection(
  selection: PhaseSetSelection | undefined,
  fallbackPhaseSets: string[]
): NormalizedPhaseSetSelection {
  const resolved: PhaseSetSelection = selection ?? fallbackPhaseSets
  const cycles = Array.isArray(resolved)
    ? 1
    : resolved.cycles === undefined
      ? 1
      : positiveInteger(resolved.cycles, 'cycles')
  const sequence = Array.isArray(resolved) ? resolved : resolved.sequence
  if (!Array.isArray(sequence) || sequence.length === 0) {
    throw new Error('phase_sets sequence must contain at least one phase_set')
  }
  return { cycles, sequence: sequence.map(normalizeReference) }
}

export function phaseSetNames(selection: NormalizedPhaseSetSelection): string[] {
  return selection.sequence.map(reference => reference.phaseSet)
}

export function expandPhaseSetSelection<T>(
  selection: NormalizedPhaseSetSelection,
  phaseSets: Record<string, T[]>
): ExpandedPhase<T>[] {
  const expanded: ExpandedPhase<T>[] = []
  for (let cycleNumber = 1; cycleNumber <= selection.cycles; cycleNumber++) {
    for (let phaseSetIndex = 0; phaseSetIndex < selection.sequence.length; phaseSetIndex++) {
      const reference = selection.sequence[phaseSetIndex]
      const phases = phaseSets[reference.phaseSet] ?? []
      for (let iterationNumber = 1; iterationNumber <= reference.iterations; iterationNumber++) {
        for (const phase of phases) {
          expanded.push({
            phase,
            phaseSet: reference.phaseSet,
            phaseSetIndex,
            cycleNumber,
            iterationNumber,
            ...(selection.cycles > 1 ? { cycle: cycleNumber } : {}),
            ...(reference.iterations > 1 ? { iteration: iterationNumber } : {}),
          })
        }
      }
    }
  }
  return expanded
}

export function taskIterationSuffix(cycle?: number, iteration?: number): string {
  const parts: string[] = []
  if (cycle !== undefined) parts.push(`C${String(cycle).padStart(2, '0')}`)
  if (iteration !== undefined) parts.push(`I${String(iteration).padStart(2, '0')}`)
  return parts.length > 0 ? `-${parts.join('-')}` : ''
}

export function extractPhaseSuffix(taskId: string): string | undefined {
  return taskId.match(/-(\d{3})(?:-C\d+)?(?:-I\d+)?$/)?.[1]
}

export function extractLocalId(taskId: string): string | undefined {
  return taskId.match(/^T-[^-]+-(.+)-\d{3}(?:-C\d+)?(?:-I\d+)?$/)?.[1]
}
