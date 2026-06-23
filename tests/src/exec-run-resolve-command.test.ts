import { describe, expect, it } from 'vitest'
import { resolveInPlaceCommand, type RunOpts } from '../../src/exec-run.js'
import type { MemberRoster } from '../../src/specdojo-config.js'
import type { ReadyTaskView } from '../../src/exec-types.js'

function buildRoster(): MemberRoster {
  return {
    version: 1,
    project_id: 'test',
    members: [
      {
        nickname: 'claude-edit-agent',
        display_name: 'Claude Edit',
        email: null,
        roles: ['DEV'],
        type: 'agent',
        capabilities: ['web_search'],
        priority: 1,
        command: 'claude -p --agent claude-edit-agent',
        mode: 'edit',
      },
      {
        nickname: 'opencode-edit-agent',
        display_name: 'OpenCode Edit',
        email: null,
        roles: ['DEV'],
        type: 'agent',
        capabilities: ['web_search', 'extra'],
        priority: 2,
        command: 'opencode run --agent opencode-edit-agent',
        mode: 'edit',
      },
    ],
  }
}

function buildTask(overrides: Partial<ReadyTaskView> = {}): ReadyTaskView {
  return {
    id: 'T-TEST-doc-010',
    local_id: 'doc',
    mode: 'edit',
    capabilities: ['web_search'],
    schedule_file: '',
    fifo_rank: 0,
    critical_first_rank: 0,
    ...overrides,
  }
}

describe('resolveInPlaceCommand actor derivation', () => {
  it('auto-derives the actor from the capability-selected agent when neither --by nor --cmd is given', () => {
    const result = resolveInPlaceCommand(buildTask(), buildRoster(), {} as RunOpts)

    // Lowest priority wins; its nickname becomes the recorded actor (mirrors the worktree path).
    expect(result.command).toBe('claude -p --agent claude-edit-agent')
    expect(result.actor).toBe('claude-edit-agent')
  })

  it('uses --by as the actor and resolves its command', () => {
    const result = resolveInPlaceCommand(buildTask(), buildRoster(), {
      by: 'opencode-edit-agent',
    } as RunOpts)

    expect(result.command).toBe('opencode run --agent opencode-edit-agent')
    expect(result.actor).toBe('opencode-edit-agent')
  })

  it('derives the actor from a --cmd nickname override', () => {
    const result = resolveInPlaceCommand(buildTask(), buildRoster(), {
      cmd: 'opencode-edit-agent',
    } as RunOpts)

    expect(result.command).toBe('opencode run --agent opencode-edit-agent')
    expect(result.actor).toBe('opencode-edit-agent')
  })

  it('falls back to the auto-agent placeholder for a raw --cmd command string', () => {
    const result = resolveInPlaceCommand(buildTask(), buildRoster(), {
      cmd: 'node ./my-agent.js',
    } as RunOpts)

    expect(result.command).toBe('node ./my-agent.js')
    expect(result.actor).toBe('auto-agent')
  })

  it('prefers an explicit --by over a raw --cmd command string for the actor', () => {
    const result = resolveInPlaceCommand(buildTask(), buildRoster(), {
      by: 'claude-edit-agent',
      cmd: 'node ./my-agent.js',
    } as RunOpts)

    expect(result.command).toBe('node ./my-agent.js')
    expect(result.actor).toBe('claude-edit-agent')
  })
})
