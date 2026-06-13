import { describe, expect, it } from 'vitest'
import { ownerRoleFields, reviewViewpointDetails } from '../../src/exec-plans.js'
import type { CriteriaItem } from '../../src/catalog-types.js'
import type { RoleDefinition } from '../../src/role-types.js'
import type { ReviewViewpoint } from '../../src/review-types.js'

function roleMapOf(roles: RoleDefinition[]): Map<string, RoleDefinition> {
  return new Map(roles.map(role => [role.code, role]))
}

function vpMapOf(viewpoints: ReviewViewpoint[]): Map<string, ReviewViewpoint> {
  return new Map(viewpoints.map(vp => [vp.id, vp]))
}

const PO_VIEWPOINTS: ReviewViewpoint[] = [
  {
    id: 'vp-po-purpose-alignment',
    role: 'PO',
    category: 'purpose',
    title: '目的・スコープとの整合',
    check: '目的、スコープ、優先順位、公開方針と矛盾していないか。',
    evidence: '目的、対象範囲、判断理由。',
    default_severity: 'major',
  },
  {
    id: 'vp-ba-business-value',
    role: 'BA',
    category: 'business',
    title: '業務価値との対応',
    check: '業務目的、利用者、期待効果と対応しているか。',
    evidence: '背景、目的、利用者。',
    default_severity: 'major',
  },
]

describe('ownerRoleFields', () => {
  it('owner 未設定の場合は全フィールドを MISSING にする', () => {
    const actual = ownerRoleFields(undefined, roleMapOf([]), vpMapOf([]))

    expect(actual).toEqual({ label: '_MISSING_', note: '_MISSING_', viewpoints: '_MISSING_' })
  })

  it('owner の責務（project_note）と該当 role の観点を値として返す', () => {
    const roles = roleMapOf([
      { code: 'PO', name: 'Project Owner', project_note: '最終判断・スコープを担う。' },
    ])
    const actual = ownerRoleFields('PO', roles, vpMapOf(PO_VIEWPOINTS))

    expect(actual.label).toBe('PO（Project Owner）')
    expect(actual.note).toBe('最終判断・スコープを担う。')
    expect(actual.viewpoints).toBe(
      '- 目的・スコープとの整合: 目的、スコープ、優先順位、公開方針と矛盾していないか。'
    )
  })

  it('owner と一致しない role の観点は含めない', () => {
    const roles = roleMapOf([{ code: 'PO', name: 'Project Owner', project_note: 'note' }])
    const actual = ownerRoleFields('PO', roles, vpMapOf(PO_VIEWPOINTS))

    expect(actual.viewpoints).not.toContain('業務価値との対応')
  })

  it('roles に未登録の owner では label を code のみ・note を MISSING にする', () => {
    const actual = ownerRoleFields('PO', roleMapOf([]), vpMapOf(PO_VIEWPOINTS))

    expect(actual.label).toBe('PO')
    expect(actual.note).toBe('_MISSING_')
    expect(actual.viewpoints).toContain('- 目的・スコープとの整合:')
  })

  it('該当 role の観点が無い場合は viewpoints を MISSING にする', () => {
    const roles = roleMapOf([{ code: 'DEV', name: 'Developer', project_note: 'note' }])
    const actual = ownerRoleFields('DEV', roles, vpMapOf(PO_VIEWPOINTS))

    expect(actual.viewpoints).toBe('_MISSING_')
  })
})

// detail テンプレートの prose ラベルは本物のテンプレートファイル側にあるため、
// テストでは値の差し込みだけを検証する最小の断片を使う。
const DETAIL_TEMPLATE = [
  '### _VP_ID_（_VP_ROLES_: _VP_VIEWPOINT_）',
  '',
  'criterion: _VP_CRITERION_',
  'coverage: _VP_COVERAGE_',
  'check: _VP_CHECK_',
  'evidence: _VP_EVIDENCE_',
].join('\n')

describe('reviewViewpointDetails', () => {
  it('criteria が空の場合は MISSING を返す', () => {
    expect(reviewViewpointDetails([], vpMapOf([]), DETAIL_TEMPLATE)).toBe('_MISSING_')
  })

  it('観点ごとにテンプレートへ値を差し込み RVP 連番を付ける', () => {
    const criteria: CriteriaItem[] = [
      { text: '目的と整合しているか。', roles: ['PO'], viewpoint: 'vp-po-purpose-alignment' },
    ]
    const actual = reviewViewpointDetails(criteria, vpMapOf(PO_VIEWPOINTS), DETAIL_TEMPLATE)

    expect(actual).toContain('### RVP-001（PO: vp-po-purpose-alignment）')
    expect(actual).toContain('criterion: 目的と整合しているか。')
    expect(actual).toContain('check: 目的、スコープ、優先順位、公開方針と矛盾していないか。')
    expect(actual).toContain('evidence: 目的、対象範囲、判断理由。')
  })

  it('coverage_types が無い観点は coverage を MISSING にする', () => {
    const criteria: CriteriaItem[] = [
      { text: 't', roles: ['PO'], viewpoint: 'vp-po-purpose-alignment' },
    ]
    const actual = reviewViewpointDetails(criteria, vpMapOf(PO_VIEWPOINTS), DETAIL_TEMPLATE)

    expect(actual).toContain('coverage: _MISSING_')
  })

  it('viewpoint が map に無い場合は check / evidence を MISSING にする', () => {
    const criteria: CriteriaItem[] = [{ text: 't', roles: ['QE'], viewpoint: 'vp-unknown' }]
    const actual = reviewViewpointDetails(criteria, vpMapOf(PO_VIEWPOINTS), DETAIL_TEMPLATE)

    expect(actual).toContain('check: _MISSING_')
    expect(actual).toContain('evidence: _MISSING_')
  })

  it('複数観点は空行区切りで連番が増える', () => {
    const criteria: CriteriaItem[] = [
      { text: 'a', roles: ['PO'], viewpoint: 'vp-po-purpose-alignment' },
      { text: 'b', roles: ['BA'], viewpoint: 'vp-ba-business-value' },
    ]
    const actual = reviewViewpointDetails(criteria, vpMapOf(PO_VIEWPOINTS), DETAIL_TEMPLATE)

    expect(actual).toContain('### RVP-001（PO: vp-po-purpose-alignment）')
    expect(actual).toContain('### RVP-002（BA: vp-ba-business-value）')
    expect(actual).toContain('）\n\ncriterion: a')
  })
})
