import { describe, expect, it } from 'vitest'
import { resolveClaimOwner } from '../../src/exec.js'
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
