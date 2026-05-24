import { describe, expect, it } from 'vitest'
import { assertValidActor } from '../../src/specdojo-config.js'
import type { MemberRoster } from '../../src/specdojo-config.js'

function makeRoster(nicknames: string[]): MemberRoster {
  return {
    version: 1,
    project_id: 'prj-test',
    members: nicknames.map(nickname => ({
      nickname,
      display_name: nickname,
      email: null,
      roles: [],
      type: 'human' as const,
    })),
  }
}

describe('assertValidActor', () => {
  it('roster が null の場合は何もしない', () => {
    expect(() => assertValidActor('anyone', null)).not.toThrow()
  })

  it('roster に登録されているニックネームはエラーにならない', () => {
    const roster = makeRoster(['alice', 'bob'])
    expect(() => assertValidActor('alice', roster)).not.toThrow()
    expect(() => assertValidActor('bob', roster)).not.toThrow()
  })

  it('roster に存在しないニックネームはエラーを投げる', () => {
    const roster = makeRoster(['alice', 'bob'])
    expect(() => assertValidActor('charlie', roster)).toThrow('charlie')
  })

  it('エラーメッセージに既知のメンバー一覧が含まれる', () => {
    const roster = makeRoster(['alice', 'bob'])
    expect(() => assertValidActor('unknown', roster)).toThrow(/alice.*bob|bob.*alice/)
  })

  it('roster が空の場合は全てのニックネームでエラーを投げる', () => {
    const roster = makeRoster([])
    expect(() => assertValidActor('alice', roster)).toThrow()
  })
})
