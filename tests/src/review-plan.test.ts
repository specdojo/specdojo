import { describe, expect, it } from 'vitest'
import { resolve } from 'node:path'
import { expandViewpointsDoc } from '../../src/review-plan.js'
import { buildValidator, formatErrors } from '../helpers/schema.js'

const TEMPLATE_PATH = 'docs/ja/specdojo/templates/pm-review-viewpoints-template.yaml'

describe('expandViewpointsDoc', () => {
  it('id を <projectId>:pm-review-viewpoints の形式で設定する', () => {
    const doc = expandViewpointsDoc(resolve(TEMPLATE_PATH), 'prj-0001')
    expect(doc.id).toBe('prj-0001:pm-review-viewpoints')
  })

  it('type を "project" に設定する', () => {
    const doc = expandViewpointsDoc(resolve(TEMPLATE_PATH), 'prj-0001')
    expect(doc.type).toBe('project')
  })

  it('project_id を設定する', () => {
    const doc = expandViewpointsDoc(resolve(TEMPLATE_PATH), 'prj-0001')
    expect(doc.project_id).toBe('prj-0001')
  })

  it('テンプレートの他のフィールドを保持する', () => {
    const doc = expandViewpointsDoc(resolve(TEMPLATE_PATH), 'prj-0001')
    expect(doc).toHaveProperty('categories')
    expect(doc).toHaveProperty('viewpoints')
  })
})

describe('review scaffold — pm-review-viewpoints テンプレートスキーマ適合検証', () => {
  it('pm-review-viewpoints-template.yaml を展開した出力が pm-review-viewpoints スキーマに適合する', () => {
    const validator = buildValidator(
      'docs/specdojo/schemas/v1/pm-review-viewpoints.schema.yaml'
    )
    const data = expandViewpointsDoc(resolve(TEMPLATE_PATH), 'prj-0001')
    expect(validator(data), formatErrors(validator.errors)).toBe(true)
  })
})
