import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { resolveClaimOwner } from '../../src/exec.js'
import {
  buildTaskPhaseMap,
  expandPromptRefs,
  resolveTaskPhaseContext,
} from '../../src/exec-run.js'
import {
  buildPhaseModeIndex,
  resolveApproach,
  resolveTaskCapabilities,
  resolveTaskExecution,
  resolveTaskMode,
  resolveTaskProficiency,
} from '../../src/exec-strategy.js'
import type { MemberRoster } from '../../src/specdojo-config.js'

function makeRoster(members: MemberRoster['members']): MemberRoster {
  return {
    version: 1,
    project_id: 'prj-test',
    members,
  }
}

describe('resolveClaimOwner', () => {
  it('roles が空の汎用 agent は owner 未指定を返す', () => {
    const roster = makeRoster([
      {
        nickname: 'edit-agent',
        display_name: 'Edit Agent',
        email: null,
        roles: [],
        type: 'agent',
      },
    ])

    expect(resolveClaimOwner({}, 'edit-agent', roster)).toBe('')
  })

  it('roles を持つ member は先頭 role を既定 owner にする', () => {
    const roster = makeRoster([
      {
        nickname: 'indie',
        display_name: 'Indie Hacker',
        email: null,
        roles: ['PO', 'PM'],
        type: 'human',
      },
    ])

    expect(resolveClaimOwner({}, 'indie', roster)).toBe('PO')
  })

  it('CLI の --owner は roster より優先する', () => {
    const roster = makeRoster([
      {
        nickname: 'indie',
        display_name: 'Indie Hacker',
        email: null,
        roles: ['PO'],
        type: 'human',
      },
    ])

    expect(resolveClaimOwner({ owner: 'ba' }, 'indie', roster)).toBe('BA')
  })
})

describe('exec strategy metadata resolution', () => {
  it('phase metadata carries mode, approach, capabilities, and proficiency', () => {
    const dir = mkdtempSync(join(tmpdir(), 'specdojo-phase-meta-'))
    try {
      writeFileSync(
        join(dir, 'sch-strategy-test.yaml'),
        [
          'phase_sets:',
          '  reference-pass:',
          '    - id: improve',
          '      task_suffix: "020"',
          '      mode: edit',
          '      approach: rulebook-maintenance',
          '      capabilities: [web_search]',
          '      proficiency: expert',
          '  review-pass:',
          '    - id: review',
          '      task_suffix: "030"',
          '      mode: review',
          '      proficiency: normal',
          'default_phase_sets: [reference-pass, review-pass]',
          'owner_rules:',
          '  - local_ids: [doc]',
          '    owner: BA',
          '',
        ].join('\n'),
        'utf8'
      )

      const index = buildPhaseModeIndex(dir)

      expect(resolveTaskMode('doc', 'T-LAUNCH-doc-020', index)).toBe('edit')
      expect(resolveApproach('doc', 'T-LAUNCH-doc-020', index)).toBe('rulebook-maintenance')
      expect(resolveTaskCapabilities('doc', 'T-LAUNCH-doc-020', index)).toEqual(['web_search'])
      expect(resolveTaskProficiency('doc', 'T-LAUNCH-doc-020', index)).toBe('expert')
      expect(resolveTaskMode('doc', 'T-LAUNCH-doc-030', index)).toBe('review')
      expect(resolveTaskProficiency('doc', 'T-LAUNCH-doc-030', index)).toBe('normal')
      expect(resolveTaskMode('doc', 'T-LAUNCH-doc-020-C01-I02', index)).toBe('edit')
      expect(resolveTaskCapabilities('doc', 'T-LAUNCH-doc-020-C01-I02', index)).toEqual([
        'web_search',
      ])
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('exec run phase map keeps ordered phase_sets for a deliverable', () => {
    const dir = mkdtempSync(join(tmpdir(), 'specdojo-exec-run-'))
    try {
      writeFileSync(
        join(dir, 'sch-strategy-test.yaml'),
        [
          'phase_sets:',
          '  first-pass:',
          '    - id: draft',
          '      task_suffix: "010"',
          '  finalize-pass:',
          '    - id: align',
          '      task_suffix: "040"',
          'default_phase_sets: [first-pass, finalize-pass]',
          'owner_rules:',
          '  - local_ids: [doc]',
          '    owner: BA',
          '',
        ].join('\n'),
        'utf8'
      )

      const { localIdToPhaseSets, phaseSetSuffixToId } = buildTaskPhaseMap(dir)

      expect(localIdToPhaseSets.get('doc')).toEqual(['first-pass', 'finalize-pass'])
      expect(phaseSetSuffixToId.get('finalize-pass:040')).toBe('align')
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('exec run phase map expands object-form phase_sets and resolves repeated task IDs', () => {
    const dir = mkdtempSync(join(tmpdir(), 'specdojo-exec-run-repeat-'))
    try {
      writeFileSync(
        join(dir, 'sch-strategy-test.yaml'),
        [
          'phase_sets:',
          '  first-pass:',
          '    - id: draft',
          '      task_suffix: "010"',
          'default_phase_sets:',
          '  cycles: 2',
          '  sequence:',
          '    - phase_set: first-pass',
          '      iterations: 2',
          'owner_rules:',
          '  - local_ids: [doc]',
          '    owner: BA',
          '',
        ].join('\n'),
        'utf8'
      )

      const maps = buildTaskPhaseMap(dir)
      expect(maps.localIdToPhaseSets.get('doc')).toEqual(['first-pass'])
      expect(
        resolveTaskPhaseContext(
          {
            id: 'T-LAUNCH-doc-010-C02-I02',
            local_id: 'doc',
            schedule_file: 'sch-track-launch.yaml',
            fifo_rank: 1,
            critical_first_rank: 1,
          },
          maps.localIdToPhaseSets,
          maps.phaseSetSuffixToId
        )
      ).toEqual({ localId: 'doc', phaseSet: 'first-pass', phaseId: 'draft' })
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('phase_overrides.execution takes precedence over phase execution', () => {
    const scheduleDir = mkdtempSync(join(tmpdir(), 'specdojo-exec-strategy-'))
    try {
      writeFileSync(
        join(scheduleDir, 'sch-strategy-test.yaml'),
        [
          'phase_sets:',
          '  first-pass:',
          '    - id: draft',
          '      task_suffix: "010"',
          '      execution: agent',
          'default_phase_set: first-pass',
          'owner_rules:',
          '  - local_ids: [doc]',
          '    owner: BA',
          '    phase_overrides:',
          '      - phase: draft',
          '        execution: human',
          '',
        ].join('\n'),
        'utf8'
      )

      const index = buildPhaseModeIndex(scheduleDir)

      expect(resolveTaskExecution('doc', 'T-LAUNCH-doc-010', index)).toBe('human')
    } finally {
      rmSync(scheduleDir, { recursive: true, force: true })
    }
  })
})

describe('expandPromptRefs', () => {
  it('exec run が [[id]] を Markdown リンク形式に展開する', () => {
    const dir = mkdtempSync(join(tmpdir(), 'specdojo-exec-prompt-'))
    try {
      const indexPath = join(dir, 'doc-index.json')
      writeFileSync(
        indexPath,
        JSON.stringify({
          version: 1,
          entries: {
            'sample-doc': 'docs/sample.md',
          },
        }),
        'utf8'
      )

      expect(expandPromptRefs('See [[sample-doc]].', indexPath)).toBe(
        'See [sample-doc](docs/sample.md).'
      )
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})
