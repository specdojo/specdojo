import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import yaml from 'js-yaml'
import { describe, expect, it } from 'vitest'
import { buildInitialStateFromStrategy } from '../../src/exec-schedule-initial.js'
import { buildScheduleIndex } from '../../src/exec-schedule-index.js'
import { generateScheduleTrack } from '../../src/schedule-generate.js'

function writeCatalog(dir: string): void {
  writeFileSync(
    join(dir, 'catalog.yaml'),
    yaml.dump({
      groups: [
        {
          name: 'sample',
          deliverables: [
            {
              local_id: 'doc',
              name: 'Document',
              kind: 'work',
              path: 'doc.md',
              depends_on: [],
            },
          ],
        },
      ],
    }),
    'utf8'
  )
}

function writeTrack(dir: string, tasks: unknown[]): void {
  writeFileSync(
    join(dir, 'sch-track-test.yaml'),
    yaml.dump({
      kind: 'track',
      id: 'prj-test:sch-track-test',
      type: 'project',
      status: 'draft',
      version: 1,
      project_id: 'prj-test',
      track: 'test',
      settings: {},
      tasks,
    }),
    'utf8'
  )
}

describe('generateScheduleTrack phase set repetition', () => {
  it('keeps catalog dependencies inside the earliest shared phase gate', () => {
    const dir = mkdtempSync(join(tmpdir(), 'specdojo-schedule-gate-dependency-'))
    try {
      writeFileSync(
        join(dir, 'catalog.yaml'),
        yaml.dump({
          groups: [
            {
              name: 'sample',
              deliverables: [
                { local_id: 'a', name: 'A', kind: 'work', path: 'a.md', depends_on: [] },
                { local_id: 'b', name: 'B', kind: 'work', path: 'b.md', depends_on: ['a'] },
              ],
            },
          ],
        }),
        'utf8'
      )
      const strategyPath = join(dir, 'sch-strategy-test.yaml')
      writeFileSync(
        strategyPath,
        yaml.dump({
          kind: 'strategy',
          id: 'prj-test:sch-strategy-test',
          type: 'project',
          status: 'draft',
          track: 'test',
          scope: {
            catalogs: [{ id: 'prj-test:catalog', path: '/catalog.yaml' }],
            include_kinds: ['work'],
          },
          phase_sets: {
            first: [{ id: 'draft', name: 'Draft', task_suffix: '010', duration_days: 1 }],
            align: [{ id: 'align', name: 'Align', task_suffix: '020', duration_days: 1 }],
            review: [{ id: 'review', name: 'Review', task_suffix: '030', duration_days: 1 }],
          },
          default_phase_sets: ['first', 'align', 'review'],
          owner_rules: [{ local_ids: ['a', 'b'], owner: 'BA' }],
          phase_gates: [
            {
              id: 'G-TEST-first',
              name: 'First complete',
              after_phase_sets: ['first'],
              owner: 'BA',
              scope: { local_ids: ['a', 'b'] },
            },
            {
              id: 'G-TEST-align',
              name: 'Align complete',
              after_phase_sets: ['align'],
              owner: 'BA',
              scope: { local_ids: ['a', 'b'] },
            },
          ],
        }),
        'utf8'
      )

      const result = generateScheduleTrack(strategyPath, dir)

      expect(result.errors).toEqual([])
      const bFirst = result.tasks.find(task => task.local_id === 'b' && task.phase_suffix === '010')
      expect(bFirst?.depends_on).toEqual(['T-TEST-a-010'])
      expect(result.tasks.find(task => task.local_id === 'a' && task.phase_suffix === '020')?.depends_on)
        .toContain('G-TEST-first')
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('expands cycles and iterations and creates a gate for each cycle', () => {
    const dir = mkdtempSync(join(tmpdir(), 'specdojo-schedule-repeat-'))
    try {
      writeCatalog(dir)
      const strategyPath = join(dir, 'sch-strategy-test.yaml')
      writeFileSync(
        strategyPath,
        yaml.dump({
          kind: 'strategy',
          id: 'prj-test:sch-strategy-test',
          type: 'project',
          status: 'draft',
          track: 'test',
          scope: {
            catalogs: [{ id: 'prj-test:catalog', path: '/catalog.yaml' }],
            include_kinds: ['work'],
          },
          phase_sets: {
            first: [
              { id: 'draft', name: 'Draft', task_suffix: '010', duration_days: 1 },
            ],
            final: [
              { id: 'finalize', name: 'Finalize', task_suffix: '020', duration_days: 1 },
            ],
            review: [
              { id: 'review', name: 'Review', task_suffix: '030', duration_days: 1 },
            ],
          },
          default_phase_sets: {
            cycles: 2,
            sequence: [
              { phase_set: 'first', iterations: 2 },
              { phase_set: 'final' },
              { phase_set: 'review' },
            ],
          },
          owner_rules: [{ local_ids: ['doc'], owner: 'BA' }],
          phase_gates: [
            {
              id: 'G-TEST-first',
              name: 'First complete',
              after_phase_sets: ['first'],
              owner: 'BA',
              scope: { local_ids: ['doc'] },
            },
            {
              id: 'G-TEST-final',
              name: 'Final complete',
              after_phase_sets: ['final'],
              owner: 'BA',
              scope: { local_ids: ['doc'] },
            },
          ],
        }),
        'utf8'
      )

      const result = generateScheduleTrack(strategyPath, dir)
      expect(result.errors).toEqual([])
      expect(result.tasks).toHaveLength(8)
      expect(result.tasks.map(task => [task.phase_suffix, task.cycle, task.iteration])).toEqual([
        ['010', 1, 1],
        ['010', 1, 2],
        ['020', 1, undefined],
        ['030', 1, undefined],
        ['010', 2, 1],
        ['010', 2, 2],
        ['020', 2, undefined],
        ['030', 2, undefined],
      ])
      expect(result.tasks[1].depends_on).toEqual(['T-TEST-doc-010-C01-I01'])
      expect(result.tasks[2].depends_on).toEqual([
        'T-TEST-doc-010-C01-I02',
        'G-TEST-first-C01',
      ])
      expect(result.tasks[3].depends_on).toEqual([
        'T-TEST-doc-020-C01',
        'G-TEST-final-C01',
      ])
      expect(result.tasks[4].depends_on).toEqual(['T-TEST-doc-030-C01'])
      expect(result.tasks[6].depends_on).toEqual([
        'T-TEST-doc-010-C02-I02',
        'G-TEST-first-C02',
      ])
      expect(result.tasks[7].depends_on).toEqual([
        'T-TEST-doc-020-C02',
        'G-TEST-final-C02',
      ])
      expect(result.milestones.map(milestone => milestone.id)).toEqual([
        'G-TEST-first-C01',
        'G-TEST-first-C02',
        'G-TEST-final-C01',
        'G-TEST-final-C02',
      ])

      writeTrack(dir, result.tasks)
      const schedule = buildScheduleIndex(dir)
      expect(schedule.nodes.get('T-TEST-doc-010-C01-I02')).toMatchObject({
        phase_suffix: '010',
        phase_set: 'first',
        phase_id: 'draft',
        cycle: 1,
        iteration: 2,
      })
      expect(schedule.nodes.has('T-TEST-doc-030-C02')).toBe(true)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('keeps existing task IDs for the array shorthand', () => {
    const dir = mkdtempSync(join(tmpdir(), 'specdojo-schedule-compatible-'))
    try {
      writeCatalog(dir)
      const strategyPath = join(dir, 'sch-strategy-test.yaml')
      writeFileSync(
        strategyPath,
        yaml.dump({
          kind: 'strategy',
          id: 'prj-test:sch-strategy-test',
          type: 'project',
          status: 'draft',
          track: 'test',
          scope: {
            catalogs: [{ id: 'prj-test:catalog', path: '/catalog.yaml' }],
            include_kinds: ['work'],
          },
          phase_sets: {
            first: [
              { id: 'draft', name: 'Draft', task_suffix: '010', duration_days: 1 },
            ],
            final: [
              { id: 'finalize', name: 'Finalize', task_suffix: '020', duration_days: 1 },
            ],
          },
          default_phase_sets: ['first', 'final'],
          owner_rules: [{ local_ids: ['doc'], owner: 'BA' }],
        }),
        'utf8'
      )

      const result = generateScheduleTrack(strategyPath, dir)
      expect(result.errors).toEqual([])
      expect(result.tasks.every(task => task.cycle === undefined)).toBe(true)
      expect(result.tasks.every(task => task.iteration === undefined)).toBe(true)
      writeTrack(dir, result.tasks)
      const schedule = buildScheduleIndex(dir)
      expect(schedule.nodes.has('T-TEST-doc-010')).toBe(true)
      expect(schedule.nodes.has('T-TEST-doc-020')).toBe(true)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('applies completed_through to an exact cycle and iteration', () => {
    const dir = mkdtempSync(join(tmpdir(), 'specdojo-schedule-initial-repeat-'))
    try {
      writeCatalog(dir)
      const strategyPath = join(dir, 'sch-strategy-test.yaml')
      writeFileSync(
        strategyPath,
        yaml.dump({
          kind: 'strategy',
          id: 'prj-test:sch-strategy-test',
          type: 'project',
          status: 'draft',
          track: 'test',
          scope: {
            catalogs: [{ id: 'prj-test:catalog', path: '/catalog.yaml' }],
            include_kinds: ['work'],
          },
          phase_sets: {
            first: [
              { id: 'draft', name: 'Draft', task_suffix: '010', duration_days: 1 },
            ],
            final: [
              { id: 'finalize', name: 'Finalize', task_suffix: '020', duration_days: 1 },
            ],
          },
          default_phase_sets: {
            cycles: 2,
            sequence: [{ phase_set: 'first', iterations: 2 }, { phase_set: 'final' }],
          },
          owner_rules: [{ local_ids: ['doc'], owner: 'BA' }],
          initial_state: {
            completed_deliverables: [
              {
                local_id: 'doc',
                completed_through: {
                  phase_set: 'first',
                  phase: 'draft',
                  cycle: 1,
                  iteration: 2,
                },
                completed_on: '2026-01-01',
                by: 'tester',
              },
            ],
          },
        }),
        'utf8'
      )

      const result = generateScheduleTrack(strategyPath, dir)
      expect(result.errors).toEqual([])
      expect(result.tasks).toHaveLength(6)
      writeTrack(dir, result.tasks)
      const schedule = buildScheduleIndex(dir)
      const initial = buildInitialStateFromStrategy(dir, schedule)
      expect(Object.keys(initial).sort()).toEqual([
        'T-TEST-doc-010-C01-I01',
        'T-TEST-doc-010-C01-I02',
      ])
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})
