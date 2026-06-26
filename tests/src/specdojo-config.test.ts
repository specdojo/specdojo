import { describe, expect, it } from 'vitest'
import {
  assertValidActor,
  getProjectCatalogPath,
  getProjectMembersPath,
  getProjectSchedulePath,
} from '../../src/specdojo-config.js'
import type { MemberRoster, SpecDojoProjectConfig } from '../../src/specdojo-config.js'

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

describe('project path accessors with base_path', () => {
  function project(overrides: Partial<SpecDojoProjectConfig>): SpecDojoProjectConfig {
    return {
      schedule_path: '030-project-management/schedule',
      execution_path: '030-project-management/execution',
      ...overrides,
    }
  }

  it('joins base_path with each document path', () => {
    const config = project({
      base_path: 'docs/ja/projects/prj-0001',
      catalog_path: '010-deliverables-catalog',
      members_path: '030-project-management/020-organization/pm-members.yaml',
    })

    expect(getProjectSchedulePath(config)).toBe(
      'docs/ja/projects/prj-0001/030-project-management/schedule'
    )
    expect(getProjectCatalogPath(config)).toBe(
      'docs/ja/projects/prj-0001/010-deliverables-catalog'
    )
    expect(getProjectMembersPath(config)).toBe(
      'docs/ja/projects/prj-0001/030-project-management/020-organization/pm-members.yaml'
    )
  })

  it('leaves paths unchanged when base_path is omitted', () => {
    const config = project({
      catalog_path: 'docs/ja/projects/prj-0001/010-deliverables-catalog',
    })

    expect(getProjectSchedulePath(config)).toBe('030-project-management/schedule')
    expect(getProjectCatalogPath(config)).toBe(
      'docs/ja/projects/prj-0001/010-deliverables-catalog'
    )
  })

  it('returns undefined for optional paths that are not set', () => {
    const config = project({ base_path: 'docs/ja/projects/prj-0001' })

    expect(getProjectCatalogPath(config)).toBeUndefined()
    expect(getProjectMembersPath(config)).toBeUndefined()
  })
})
