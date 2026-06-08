import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { resolveClaimOwner } from '../../src/exec.js'
import { resolveAssignment } from '../../src/exec-agent-config.js'
import { buildTaskPhaseMap } from '../../src/exec-run.js'
import { buildPhaseModeIndex, resolveTaskExecution } from '../../src/exec-strategy.js'
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
  it('assignment_rules can match task_kind', () => {
    const config = {
      assignment_rules: [
        {
          mode: 'review' as const,
          capabilities: ['review-agent'],
          proficiency: 'normal',
        },
        {
          task_kind: 'reference-maintenance' as const,
          capabilities: ['reference-maintenance'],
          proficiency: 'expert',
        },
        {
          task_kind: 'deliverable' as const,
          capabilities: ['standard-edit'],
          proficiency: 'normal',
        },
      ],
    }

    expect(resolveAssignment('any-pass', 'improve', config, 'edit', 'reference-maintenance')).toEqual(
      {
        capabilities: ['reference-maintenance'],
        proficiency: 'expert',
      }
    )
    expect(resolveAssignment('any-pass', 'improve', config, 'review', 'deliverable')).toEqual({
      capabilities: ['review-agent'],
      proficiency: 'normal',
    })
    expect(resolveAssignment('any-pass', 'improve', config, 'edit', 'deliverable')).toEqual({
      capabilities: ['standard-edit'],
      proficiency: 'normal',
    })
    expect(resolveAssignment('any-pass', 'improve', config, 'edit')).toEqual({
      capabilities: ['standard-edit'],
      proficiency: 'normal',
    })
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

  it('phase_overrides.execution takes precedence over phase execution', () => {
    const scheduleDir = mkdtempSync(join(tmpdir(), 'specdojo-exec-strategy-'))
    const executionDir = mkdtempSync(join(tmpdir(), 'specdojo-exec-execution-'))
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

      const index = buildPhaseModeIndex(scheduleDir, executionDir)

      expect(resolveTaskExecution('doc', 'T-LAUNCH-doc-010', index)).toBe('human')
    } finally {
      rmSync(scheduleDir, { recursive: true, force: true })
      rmSync(executionDir, { recursive: true, force: true })
    }
  })
})
