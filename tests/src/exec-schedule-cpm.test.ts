import { describe, expect, it } from 'vitest'
import { computeCpm, topoSort } from '../../src/exec-schedule-cpm.js'
import type { ScheduleIndex } from '../../src/exec-types.js'

function makeSchedule(
  tasks: Array<{
    id: string
    duration?: number
    depends_on?: string[]
    kind?: 'task' | 'milestone'
  }>
): ScheduleIndex {
  const nodes = new Map<string, ScheduleIndex['nodes'] extends Map<string, infer V> ? V : never>()
  for (const t of tasks) {
    nodes.set(t.id, {
      id: t.id,
      name: t.id,
      depends_on: t.depends_on ?? [],
      duration_days: t.duration ?? 1,
      kind: t.kind ?? 'task',
      schedule_file: '/dummy/sch-test.yaml',
    })
  }
  return {
    nodes,
    files: ['/dummy/sch-test.yaml'],
    start_date: null,
    calendar: {
      timezone: 'UTC',
      workdays: new Set([1, 2, 3, 4, 5]),
      holidays: new Set<string>(),
      work_hours_per_day: 8,
    },
    section_labels: {},
  }
}

describe('topoSort', () => {
  it('タスクが1件の場合はそのまま返す', () => {
    const schedule = makeSchedule([{ id: 'A' }])
    const { order, cycle } = topoSort(schedule)
    expect(order).toEqual(['A'])
    expect(cycle).toBeUndefined()
  })

  it('空のスケジュールは空配列を返す', () => {
    const schedule = makeSchedule([])
    const { order, cycle } = topoSort(schedule)
    expect(order).toEqual([])
    expect(cycle).toBeUndefined()
  })

  it('直列チェーンを依存順にソートする', () => {
    const schedule = makeSchedule([
      { id: 'C', depends_on: ['B'] },
      { id: 'B', depends_on: ['A'] },
      { id: 'A' },
    ])
    const { order } = topoSort(schedule)
    expect(order.indexOf('A')).toBeLessThan(order.indexOf('B'))
    expect(order.indexOf('B')).toBeLessThan(order.indexOf('C'))
  })

  it('依存なしの並列タスクは ID 昇順でソートする', () => {
    const schedule = makeSchedule([{ id: 'C' }, { id: 'A' }, { id: 'B' }])
    const { order } = topoSort(schedule)
    expect(order).toEqual(['A', 'B', 'C'])
  })

  it('共通の親を持つ並列タスクは親の後に並ぶ', () => {
    const schedule = makeSchedule([
      { id: 'A' },
      { id: 'B', depends_on: ['A'] },
      { id: 'C', depends_on: ['A'] },
    ])
    const { order } = topoSort(schedule)
    expect(order[0]).toBe('A')
    expect(new Set(order.slice(1))).toEqual(new Set(['B', 'C']))
  })

  it('循環依存を検出し cycle に含まれるノードを返す', () => {
    const schedule = makeSchedule([
      { id: 'A', depends_on: ['B'] },
      { id: 'B', depends_on: ['A'] },
    ])
    const { cycle } = topoSort(schedule)
    expect(cycle).toBeDefined()
    expect(cycle).toHaveLength(2)
    expect(cycle).toContain('A')
    expect(cycle).toContain('B')
  })

  it('3ノード循環を検出する', () => {
    const schedule = makeSchedule([
      { id: 'A', depends_on: ['C'] },
      { id: 'B', depends_on: ['A'] },
      { id: 'C', depends_on: ['B'] },
    ])
    const { cycle } = topoSort(schedule)
    expect(cycle).toBeDefined()
    expect(cycle!.length).toBeGreaterThan(0)
  })
})

describe('computeCpm', () => {
  it('単一タスクのプロジェクト期間はそのタスクの日数と等しい', () => {
    const schedule = makeSchedule([{ id: 'A', duration: 3 }])
    const result = computeCpm(schedule, '/dummy')
    expect(result.project_duration_days).toBe(3)
    expect(result.nodes['A'].es).toBe(0)
    expect(result.nodes['A'].ef).toBe(3)
    expect(result.nodes['A'].slack).toBe(0)
  })

  it('直列チェーンのプロジェクト期間は各タスクの合計日数', () => {
    const schedule = makeSchedule([
      { id: 'A', duration: 2 },
      { id: 'B', duration: 3, depends_on: ['A'] },
    ])
    const result = computeCpm(schedule, '/dummy')
    expect(result.project_duration_days).toBe(5)
    expect(result.nodes['A'].es).toBe(0)
    expect(result.nodes['A'].ef).toBe(2)
    expect(result.nodes['B'].es).toBe(2)
    expect(result.nodes['B'].ef).toBe(5)
  })

  it('並列タスクのプロジェクト期間は最長経路の日数', () => {
    // A(2) と B(4) は並列, C(1) は両方に依存
    // ES(C) = max(EF(A), EF(B)) = max(2, 4) = 4  →  5
    const schedule = makeSchedule([
      { id: 'A', duration: 2 },
      { id: 'B', duration: 4 },
      { id: 'C', duration: 1, depends_on: ['A', 'B'] },
    ])
    const result = computeCpm(schedule, '/dummy')
    expect(result.project_duration_days).toBe(5)
    expect(result.nodes['C'].es).toBe(4)
  })

  it('クリティカルパス上のタスクは slack = 0', () => {
    // A(1) と B(3) は並列, C(1) は両方に依存
    // B が長いので B → C がクリティカルパス, A は slack > 0
    const schedule = makeSchedule([
      { id: 'A', duration: 1 },
      { id: 'B', duration: 3 },
      { id: 'C', duration: 1, depends_on: ['A', 'B'] },
    ])
    const result = computeCpm(schedule, '/dummy')
    expect(result.nodes['B'].slack).toBe(0)
    expect(result.nodes['C'].slack).toBe(0)
    expect(result.nodes['A'].slack).toBeGreaterThan(0)
  })

  it('critical_path に slack = 0 のタスクが含まれる', () => {
    const schedule = makeSchedule([
      { id: 'A', duration: 2 },
      { id: 'B', duration: 3, depends_on: ['A'] },
    ])
    const result = computeCpm(schedule, '/dummy')
    expect(result.critical_path).toContain('A')
    expect(result.critical_path).toContain('B')
    expect(result.critical_path.indexOf('A')).toBeLessThan(result.critical_path.indexOf('B'))
  })

  it('ls と lf が正しく計算される', () => {
    // A(1) と B(3) は並列, C(1) は両方に依存
    // LF(A) = LS(C) = 3, LS(A) = 3 - 1 = 2, slack(A) = LS(A) - ES(A) = 2 - 0 = 2
    const schedule = makeSchedule([
      { id: 'A', duration: 1 },
      { id: 'B', duration: 3 },
      { id: 'C', duration: 1, depends_on: ['A', 'B'] },
    ])
    const result = computeCpm(schedule, '/dummy')
    expect(result.nodes['A'].ls).toBe(2)
    expect(result.nodes['A'].lf).toBe(3)
    expect(result.nodes['A'].slack).toBe(2)
  })

  it('循環依存があるとエラーを投げる', () => {
    const schedule = makeSchedule([
      { id: 'A', depends_on: ['B'] },
      { id: 'B', depends_on: ['A'] },
    ])
    expect(() => computeCpm(schedule, '/dummy')).toThrow('cycle')
  })

  it('start_date を引き継ぐ', () => {
    const schedule = makeSchedule([{ id: 'A' }])
    schedule.start_date = '2026-06-01'
    const result = computeCpm(schedule, '/dummy')
    expect(result.project_start_date).toBe('2026-06-01')
  })
})
