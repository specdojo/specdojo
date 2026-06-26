import { describe, expect, it } from 'vitest'
import {
  extractBlockReason,
  resolveAgentOverride,
  selectCandidates,
} from '../../src/exec-run.js'
import type { MemberRoster, ProjectMember } from '../../src/specdojo-config.js'

function agent(overrides: Partial<ProjectMember> & { nickname: string }): ProjectMember {
  return {
    display_name: overrides.nickname,
    email: null,
    roles: [],
    type: 'agent',
    capabilities: ['web_search'],
    command: `run --agent ${overrides.nickname}`,
    mode: 'edit',
    ...overrides,
  }
}

function roster(members: ProjectMember[]): MemberRoster {
  return { version: 1, project_id: 'test', members }
}

describe('extractBlockReason', () => {
  it('prefers the tagged `blocked:` line from edit agents', () => {
    const stderr = [
      'some warning from the toolchain',
      'blocked: depends_on dct-foo unresolved; need=resolve dependency; ref=docs/foo.md',
    ].join('\n')

    const actual = extractBlockReason(stderr)

    expect(actual).toBe(
      'agent exited with non-zero code: blocked: depends_on dct-foo unresolved; need=resolve dependency; ref=docs/foo.md'
    )
  })

  it('prefers the tagged `review-blocked:` line from review agents', () => {
    const stderr = 'review-blocked: target file missing; criterion=RVP-001; ref=docs/bar.md\n'

    const actual = extractBlockReason(stderr)

    expect(actual).toBe(
      'agent exited with non-zero code: review-blocked: target file missing; criterion=RVP-001; ref=docs/bar.md'
    )
  })

  it('falls back to the last non-empty line when no tagged line is present', () => {
    const stderr = 'line one\nfatal: something went wrong\n\n'

    const actual = extractBlockReason(stderr)

    expect(actual).toBe('agent exited with non-zero code: fatal: something went wrong')
  })

  it('returns the generic message when stderr is empty', () => {
    expect(extractBlockReason('')).toBe('agent exited with non-zero code')
    expect(extractBlockReason('   \n  \n')).toBe('agent exited with non-zero code')
  })

  it('truncates an overly long reason to keep the block event log readable', () => {
    const longReason = `blocked: ${'x'.repeat(600)}`
    const actual = extractBlockReason(longReason)

    expect(actual.startsWith('agent exited with non-zero code: blocked: ')).toBe(true)
    expect(actual.endsWith('…')).toBe(true)
    // prefix + first 500 chars of the reason + ellipsis
    expect(actual.length).toBe('agent exited with non-zero code: '.length + 500 + 1)
  })
})

describe('selectCandidates', () => {
  const requirements = { capabilities: ['web_search'] }

  it('orders candidates by priority ascending, then fewest extra capabilities', () => {
    const members = roster([
      agent({ nickname: 'high', priority: 2 }),
      agent({ nickname: 'low', priority: 1 }),
      agent({ nickname: 'low-extra', priority: 1, capabilities: ['web_search', 'extra'] }),
    ])

    const actual = selectCandidates(requirements, members, 'edit').map(m => m.nickname)

    expect(actual).toEqual(['low', 'low-extra', 'high'])
  })

  it('sorts busy agents last so parallel runs spread across agents', () => {
    const members = roster([
      agent({ nickname: 'top', priority: 1 }),
      agent({ nickname: 'next', priority: 2 }),
    ])

    const actual = selectCandidates(requirements, members, 'edit', new Set(['top'])).map(
      m => m.nickname
    )

    // `top` has the best priority but is busy, so it drops behind the idle `next`.
    expect(actual).toEqual(['next', 'top'])
  })

  it('keeps priority order among busy agents when all candidates are busy', () => {
    const members = roster([
      agent({ nickname: 'high', priority: 2 }),
      agent({ nickname: 'low', priority: 1 }),
    ])

    const actual = selectCandidates(
      requirements,
      members,
      'edit',
      new Set(['high', 'low'])
    ).map(m => m.nickname)

    expect(actual).toEqual(['low', 'high'])
  })
})

describe('resolveAgentOverride', () => {
  const members = roster([
    agent({ nickname: 'opencode-edit', command: 'opencode run --agent edit', mode: 'edit' }),
    agent({ nickname: 'opencode-review', command: 'opencode run --agent review', mode: 'review' }),
  ])

  it('resolves the edit nickname to its pm-members command for edit-mode tasks', () => {
    const actual = resolveAgentOverride(
      'edit',
      undefined,
      { edit: 'opencode-edit', review: 'opencode-review' },
      members
    )

    expect(actual).toEqual({
      kind: 'command',
      command: 'opencode run --agent edit',
      actor: 'opencode-edit',
    })
  })

  it('resolves the review nickname to its pm-members command for review-mode tasks', () => {
    const actual = resolveAgentOverride(
      'review',
      undefined,
      { edit: 'opencode-edit', review: 'opencode-review' },
      members
    )

    expect(actual).toEqual({
      kind: 'command',
      command: 'opencode run --agent review',
      actor: 'opencode-review',
    })
  })

  it('returns none when the mode has no override', () => {
    const actual = resolveAgentOverride('review', undefined, { edit: 'opencode-edit' }, members)

    expect(actual).toEqual({ kind: 'none' })
  })

  it('returns an error when the nickname is not in pm-members', () => {
    const actual = resolveAgentOverride('edit', undefined, { edit: 'ghost-agent' }, members)

    expect(actual.kind).toBe('error')
    if (actual.kind === 'error') {
      expect(actual.message).toContain('--edit-agent')
      expect(actual.message).toContain('ghost-agent')
    }
  })

  it('lets a single explicit override win over the mode-specific override', () => {
    const actual = resolveAgentOverride(
      'edit',
      'opencode-review',
      { edit: 'opencode-edit', review: 'opencode-review' },
      members
    )

    expect(actual).toEqual({
      kind: 'command',
      command: 'opencode run --agent review',
      actor: 'opencode-review',
    })
  })

  it('treats an unknown explicit override as a raw command string', () => {
    const actual = resolveAgentOverride('edit', 'some custom --cmd', {}, members)

    expect(actual).toEqual({ kind: 'command', command: 'some custom --cmd', actor: undefined })
  })
})
