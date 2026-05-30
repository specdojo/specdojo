import { afterEach, describe, expect, it } from 'vitest'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { buildReadySnapshot, orderReadyIds, selectNextTask, writeReadyFiles } from '../../src/exec-schedule-ready.js'
import type { CpmResult, ScheduleIndex } from '../../src/exec-types.js'


const ENV_KEYS = ['SPECDOJO_PROJECT', 'SPECDOJO_SCHEDULE_PATH', 'SPECDOJO_EXECUTION_PATH']
const originalEnv = Object.fromEntries(ENV_KEYS.map(key => [key, process.env[key]]))
const originalCwd = process.cwd()

function restoreEnv(): void {
  for (const key of ENV_KEYS) delete process.env[key]
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }
}

function makeSchedule(projectDir: string): ScheduleIndex {
  return {
    nodes: new Map([
      [
        'A',
        {
          id: 'A',
          name: 'Task A',
          owner: 'BA',
          kind: 'task',
          duration_days: 1,
          depends_on: [],
          schedule_file: join(projectDir, 'schedule', 'sch-track.yaml'),
        },
      ],
      [
        'B',
        {
          id: 'B',
          name: 'Task B',
          owner: 'DEV',
          kind: 'task',
          duration_days: 1,
          depends_on: [],
          schedule_file: join(projectDir, 'schedule', 'sch-track.yaml'),
        },
      ],
    ]),
    files: [join(projectDir, 'schedule', 'sch-track.yaml')],
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

afterEach(() => {
  process.chdir(originalCwd)
  restoreEnv()
})

function makeCpm(
  nodes: Record<string, { slack: number; es: number; ef?: number; ls?: number; lf?: number }>
): CpmResult {
  const fullNodes: CpmResult['nodes'] = {}
  for (const [id, n] of Object.entries(nodes)) {
    fullNodes[id] = {
      id,
      kind: 'task',
      duration_days: 1,
      es: n.es,
      ef: n.ef ?? n.es + 1,
      ls: n.ls ?? n.es + n.slack,
      lf: n.lf ?? n.es + 1 + n.slack,
      slack: n.slack,
      depends_on: [],
      schedule_file: '/dummy/sch-test.yaml',
    }
  }
  return {
    schedule_path: '/dummy',
    project_start_date: null,
    project_duration_days: 1,
    nodes: fullNodes,
    critical_path: [],
  }
}

describe('orderReadyIds', () => {
  it('空の配列はそのまま返す', () => {
    expect(orderReadyIds([], null, 'fifo')).toEqual([])
    expect(orderReadyIds([], null, 'critical-first')).toEqual([])
  })

  describe('fifo 戦略', () => {
    it('ID の昇順にソートする', () => {
      const result = orderReadyIds(['C', 'A', 'B'], null, 'fifo')
      expect(result).toEqual(['A', 'B', 'C'])
    })

    it('cpm が null でない場合も ID 昇順にソートする', () => {
      const cpm = makeCpm({ A: { slack: 0, es: 0 }, B: { slack: 5, es: 0 }, C: { slack: 2, es: 0 } })
      const result = orderReadyIds(['C', 'A', 'B'], cpm, 'fifo')
      expect(result).toEqual(['A', 'B', 'C'])
    })

    it('1件の場合はそのまま返す', () => {
      expect(orderReadyIds(['X'], null, 'fifo')).toEqual(['X'])
    })
  })

  describe('critical-first 戦略', () => {
    it('cpm が null の場合は ID 昇順にフォールバックする', () => {
      const result = orderReadyIds(['C', 'A', 'B'], null, 'critical-first')
      expect(result).toEqual(['A', 'B', 'C'])
    })

    it('slack が小さいタスクを先に並べる', () => {
      const cpm = makeCpm({
        A: { slack: 5, es: 0 },
        B: { slack: 0, es: 0 },
        C: { slack: 2, es: 0 },
      })
      const result = orderReadyIds(['A', 'B', 'C'], cpm, 'critical-first')
      expect(result[0]).toBe('B')
      expect(result[1]).toBe('C')
      expect(result[2]).toBe('A')
    })

    it('slack が同じ場合は ES が小さいタスクを先に並べる', () => {
      const cpm = makeCpm({
        A: { slack: 0, es: 3 },
        B: { slack: 0, es: 1 },
        C: { slack: 0, es: 1 },
      })
      const result = orderReadyIds(['A', 'B', 'C'], cpm, 'critical-first')
      expect(result[0]).not.toBe('A')
      expect(result[2]).toBe('A')
    })

    it('slack と ES が同じ場合は ID 昇順にソートする', () => {
      const cpm = makeCpm({
        A: { slack: 0, es: 0 },
        B: { slack: 0, es: 0 },
        C: { slack: 0, es: 0 },
      })
      const result = orderReadyIds(['C', 'A', 'B'], cpm, 'critical-first')
      expect(result).toEqual(['A', 'B', 'C'])
    })

    it('cpm にないタスクは cpm にあるタスクの後に並ぶ', () => {
      const cpm = makeCpm({ A: { slack: 0, es: 0 } })
      const result = orderReadyIds(['Z', 'A'], cpm, 'critical-first')
      expect(result[0]).toBe('A')
      expect(result[1]).toBe('Z')
    })

    it('cpm にないタスクが複数ある場合は互いに ID 昇順に並ぶ', () => {
      const cpm = makeCpm({ A: { slack: 0, es: 0 } })
      const result = orderReadyIds(['Z', 'A', 'Y'], cpm, 'critical-first')
      expect(result[0]).toBe('A')
      expect(result.slice(1)).toEqual(['Y', 'Z'])
    })
  })
})

describe('selectNextTask', () => {
  it('空の配列は null を返す', () => {
    expect(selectNextTask([], null, 'fifo')).toBeNull()
    expect(selectNextTask([], null, 'critical-first')).toBeNull()
  })

  it('fifo の場合は ID 昇順の先頭タスクを返す', () => {
    expect(selectNextTask(['C', 'A', 'B'], null, 'fifo')).toBe('A')
  })

  it('critical-first の場合は slack 最小のタスクを返す', () => {
    const cpm = makeCpm({
      A: { slack: 5, es: 0 },
      B: { slack: 0, es: 0 },
    })
    expect(selectNextTask(['A', 'B'], cpm, 'critical-first')).toBe('B')
  })
})


describe('buildReadySnapshot', () => {
  it('critical-first と fifo の順序、rank、CPM 情報を含む snapshot を作る', () => {
    const dir = mkdtempSync(join(tmpdir(), 'specdojo-test-'))
    try {
      const projectPath = join(dir, 'schedule')
      const executionPath = join(dir, 'execution')
      mkdirSync(projectPath, { recursive: true })
      mkdirSync(executionPath, { recursive: true })
      mkdirSync(join(dir, '.specdojo'), { recursive: true })
      writeFileSync(
        join(dir, '.specdojo', 'specdojo.config.json'),
        JSON.stringify(
          {
            version: 1,
            projects: {
              'prj-a': {
                schedule_path: 'schedule',
                execution_path: 'execution',
              },
            },
          },
          null,
          2
        ),
        'utf8'
      )
      process.chdir(dir)
      restoreEnv()

      const cpm = makeCpm({ A: { slack: 3, es: 0 }, B: { slack: 0, es: 0 } })
      const snapshot = buildReadySnapshot(projectPath, makeSchedule(dir), ['A', 'B'], cpm)

      expect(snapshot.ready_count).toBe(2)
      expect(snapshot.default_strategy).toBe('critical-first')
      expect(snapshot.strategies['critical-first'].ordered_task_ids).toEqual(['B', 'A'])
      expect(snapshot.strategies.fifo.ordered_task_ids).toEqual(['A', 'B'])
      expect(snapshot.strategies['critical-first'].next_task_id).toBe('B')
      expect(snapshot.tasks.map(task => task.id)).toEqual(['B', 'A'])
      expect(snapshot.tasks[0].critical_first_rank).toBe(1)
      expect(snapshot.tasks[0].fifo_rank).toBe(2)
      expect(snapshot.tasks[0].cpm?.slack).toBe(0)
    } finally {
      process.chdir(originalCwd)
      rmSync(dir, { recursive: true, force: true })
      restoreEnv()
    }
  })
})

describe('writeReadyFiles', () => {
  it('ready.json、claim-next.json、ready.md を書き出す', () => {
    const dir = mkdtempSync(join(tmpdir(), 'specdojo-test-'))
    try {
      const projectPath = join(dir, 'schedule')
      const executionPath = join(dir, 'execution')
      mkdirSync(projectPath, { recursive: true })
      mkdirSync(executionPath, { recursive: true })
      mkdirSync(join(dir, '.specdojo'), { recursive: true })
      writeFileSync(
        join(dir, '.specdojo', 'specdojo.config.json'),
        JSON.stringify(
          {
            version: 1,
            projects: {
              'prj-a': {
                schedule_path: 'schedule',
                execution_path: 'execution',
              },
            },
          },
          null,
          2
        ),
        'utf8'
      )
      process.chdir(dir)
      restoreEnv()

      const cpm = makeCpm({ A: { slack: 0, es: 0 } })
      const snapshot = buildReadySnapshot(projectPath, makeSchedule(dir), ['A'], cpm)
      writeReadyFiles(projectPath, snapshot)

      const generatedDir = join(executionPath, 'generated')
      const ready = JSON.parse(readFileSync(join(generatedDir, 'ready.json'), 'utf8'))
      const claimNext = JSON.parse(readFileSync(join(generatedDir, 'claim-next.json'), 'utf8'))
      const readyMd = readFileSync(join(generatedDir, 'ready.md'), 'utf8')

      expect(ready.ready_count).toBe(1)
      expect(claimNext.strategies['critical-first'].next_task_id).toBe('A')
      expect(readyMd).toContain('# Ready Tasks')
      expect(readyMd).toContain('`A`')
    } finally {
      process.chdir(originalCwd)
      rmSync(dir, { recursive: true, force: true })
      restoreEnv()
    }
  })
})
