import { describe, expect, it } from 'vitest'
import { buildMarkdown, validateDctDoc } from '../../src/catalog-build.js'
import type { DctDoc, DctDeliverableItem, DctSection } from '../../src/catalog-types.js'

function makeDoc(overrides: Partial<DctDoc> = {}): DctDoc {
  return {
    id: 'dct-test',
    type: 'project',
    status: 'draft',
    project_id: 'prj-test',
    domain: 'テスト領域',
    groups: [{ name: 'グループA', deliverables: [] }],
    ...overrides,
  }
}

function makeWorkItem(overrides: Partial<DctDeliverableItem> = {}): DctDeliverableItem {
  return {
    local_id: 'item-1',
    name: 'テスト成果物',
    kind: 'work',
    overview: '概要',
    path: 'docs/item-1.md',
    done_criteria: [{ text: '完了基準', roles: [], viewpoint: '' }],
    ...overrides,
  }
}

function makeSection(overrides: Partial<DctSection> = {}): DctSection {
  return { name: 'セクション', deliverables: [], ...overrides }
}

describe('validateDctDoc', () => {
  describe('必須フィールドの検証', () => {
    it('全フィールドが正しい場合は ok:true を返す', () => {
      const result = validateDctDoc(makeDoc(), '/dummy/dct.yaml')
      expect(result.ok).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('id が空の場合はエラーを返す', () => {
      const result = validateDctDoc(makeDoc({ id: '' }), '/dummy/dct.yaml')
      expect(result.ok).toBe(false)
      expect(result.errors.some(e => e.includes('id'))).toBe(true)
    })

    it('type が project 以外の場合はエラーを返す', () => {
      const doc = makeDoc()
      // @ts-expect-error intentional invalid type
      doc.type = 'template'
      const result = validateDctDoc(doc, '/dummy/dct.yaml')
      expect(result.ok).toBe(false)
      expect(result.errors.some(e => e.includes('type'))).toBe(true)
    })

    it('status が無効値の場合はエラーを返す', () => {
      const doc = makeDoc()
      // @ts-expect-error intentional invalid status
      doc.status = 'unknown'
      const result = validateDctDoc(doc, '/dummy/dct.yaml')
      expect(result.ok).toBe(false)
      expect(result.errors.some(e => e.includes('status'))).toBe(true)
    })

    it('project_id が空の場合はエラーを返す', () => {
      const result = validateDctDoc(makeDoc({ project_id: '' }), '/dummy/dct.yaml')
      expect(result.ok).toBe(false)
      expect(result.errors.some(e => e.includes('project_id'))).toBe(true)
    })

    it('domain が空の場合はエラーを返す', () => {
      const result = validateDctDoc(makeDoc({ domain: '' }), '/dummy/dct.yaml')
      expect(result.ok).toBe(false)
      expect(result.errors.some(e => e.includes('domain'))).toBe(true)
    })

    it('groups が空配列の場合はエラーを返す', () => {
      const result = validateDctDoc(makeDoc({ groups: [] }), '/dummy/dct.yaml')
      expect(result.ok).toBe(false)
      expect(result.errors.some(e => e.includes('groups'))).toBe(true)
    })

    it('エラーメッセージにファイルパスが含まれる', () => {
      const result = validateDctDoc(makeDoc({ id: '' }), '/path/to/my-doc.yaml')
      expect(result.errors[0]).toContain('/path/to/my-doc.yaml')
    })
  })

  describe('local_id の重複検証', () => {
    it('local_id に大文字が含まれる場合はエラーを返す', () => {
      const item = makeWorkItem({ local_id: 'item-UPPER' })
      const doc = makeDoc({ groups: [makeSection({ deliverables: [item] })] })
      const result = validateDctDoc(doc, '/dummy/dct.yaml')
      expect(result.ok).toBe(false)
      expect(result.errors.some(e => e.includes('invalid local_id'))).toBe(true)
    })

    it('同一 local_id が複数ある場合はエラーを返す', () => {
      const items: DctDeliverableItem[] = [
        makeWorkItem({ local_id: 'dup-id' }),
        makeWorkItem({ local_id: 'dup-id' }),
      ]
      const doc = makeDoc({ groups: [makeSection({ deliverables: items })] })
      const result = validateDctDoc(doc, '/dummy/dct.yaml')
      expect(result.ok).toBe(false)
      expect(result.errors.some(e => e.includes('dup-id'))).toBe(true)
    })

    it('異なる local_id はエラーにならない', () => {
      const items: DctDeliverableItem[] = [
        makeWorkItem({ local_id: 'item-a' }),
        makeWorkItem({ local_id: 'item-b' }),
      ]
      const doc = makeDoc({ groups: [makeSection({ deliverables: items })] })
      const result = validateDctDoc(doc, '/dummy/dct.yaml')
      expect(result.ok).toBe(true)
    })

    it('ネストした groups の local_id も重複検証される', () => {
      const inner = makeSection({
        name: '内部',
        deliverables: [makeWorkItem({ local_id: 'shared-id' })],
      })
      const outer = makeSection({
        name: '外部',
        deliverables: [makeWorkItem({ local_id: 'shared-id' })],
        groups: [inner],
      })
      const result = validateDctDoc(makeDoc({ groups: [outer] }), '/dummy/dct.yaml')
      expect(result.ok).toBe(false)
      expect(result.errors.some(e => e.includes('shared-id'))).toBe(true)
    })
  })

  describe('instance_id_pattern の検証', () => {
    it('小文字プレースホルダーを含むIDパターンを許可する', () => {
      const item = makeWorkItem({ instance_id_pattern: 'item-{sequence}-{term}' })
      const doc = makeDoc({ groups: [makeSection({ deliverables: [item] })] })
      const result = validateDctDoc(doc, '/dummy/dct.yaml')
      expect(result.ok).toBe(true)
    })

    it('大文字プレースホルダーを含むIDパターンはエラーを返す', () => {
      const item = makeWorkItem({ instance_id_pattern: 'item-{TERM}' })
      const doc = makeDoc({ groups: [makeSection({ deliverables: [item] })] })
      const result = validateDctDoc(doc, '/dummy/dct.yaml')
      expect(result.ok).toBe(false)
      expect(result.errors.some(e => e.includes('invalid instance_id_pattern'))).toBe(true)
    })
  })

  describe('kind:work の必須フィールド検証', () => {
    it('kind:work に path がない場合はエラーを返す', () => {
      const item = makeWorkItem({ path: undefined })
      const doc = makeDoc({ groups: [makeSection({ deliverables: [item] })] })
      const result = validateDctDoc(doc, '/dummy/dct.yaml')
      expect(result.ok).toBe(false)
      expect(result.errors.some(e => e.includes('path'))).toBe(true)
    })

    it('kind:work に done_criteria がない場合はエラーを返す', () => {
      const item = makeWorkItem({ done_criteria: [] })
      const doc = makeDoc({ groups: [makeSection({ deliverables: [item] })] })
      const result = validateDctDoc(doc, '/dummy/dct.yaml')
      expect(result.ok).toBe(false)
      expect(result.errors.some(e => e.includes('done_criteria'))).toBe(true)
    })

    it('kind:control は path / done_criteria なしでもエラーにならない', () => {
      const item: DctDeliverableItem = {
        local_id: 'ctrl-1',
        name: '管理成果物',
        kind: 'control',
        overview: '概要',
      }
      const doc = makeDoc({ groups: [makeSection({ deliverables: [item] })] })
      const result = validateDctDoc(doc, '/dummy/dct.yaml')
      expect(result.ok).toBe(true)
    })
  })

  describe('depends_on の外部参照警告', () => {
    it('同一ファイル内に存在しない depends_on は警告を返す', () => {
      const item = makeWorkItem({ local_id: 'item-a', depends_on: ['nonexistent'] })
      const doc = makeDoc({ groups: [makeSection({ deliverables: [item] })] })
      const result = validateDctDoc(doc, '/dummy/dct.yaml')
      expect(result.ok).toBe(true)
      expect(result.warnings.some(w => w.includes('nonexistent'))).toBe(true)
    })

    it('同一ファイル内に存在する depends_on は警告にならない', () => {
      const items: DctDeliverableItem[] = [
        makeWorkItem({ local_id: 'item-a' }),
        makeWorkItem({ local_id: 'item-b', depends_on: ['item-a'] }),
      ]
      const doc = makeDoc({ groups: [makeSection({ deliverables: items })] })
      const result = validateDctDoc(doc, '/dummy/dct.yaml')
      expect(result.ok).toBe(true)
      expect(result.warnings).toHaveLength(0)
    })

    it('knownLocalIds に含まれていれば別ファイルの depends_on でも警告にならない', () => {
      const item = makeWorkItem({ local_id: 'item-a', depends_on: ['cross-file-dep'] })
      const doc = makeDoc({ groups: [makeSection({ deliverables: [item] })] })
      const known = new Set(['item-a', 'cross-file-dep'])

      const result = validateDctDoc(doc, '/dummy/dct.yaml', known)

      expect(result.ok).toBe(true)
      expect(result.warnings).toHaveLength(0)
    })

    it('knownLocalIds を渡してもカタログ全体に無い depends_on は警告を返す', () => {
      const item = makeWorkItem({ local_id: 'item-a', depends_on: ['ghost'] })
      const doc = makeDoc({ groups: [makeSection({ deliverables: [item] })] })
      const known = new Set(['item-a'])

      const result = validateDctDoc(doc, '/dummy/dct.yaml', known)

      expect(result.warnings.some(w => w.includes('ghost') && w.includes('catalog'))).toBe(true)
    })
  })
})

describe('buildMarkdown', () => {
  it('各成果物テーブルの直前に prettier-ignore を出力する', () => {
    const sections = [
      makeSection({ name: 'セクションA', deliverables: [makeWorkItem()] }),
      makeSection({
        name: 'セクションB',
        deliverables: [makeWorkItem({ local_id: 'item-2' })],
      }),
    ]
    const markdown = buildMarkdown(makeDoc({ groups: sections }))

    expect(markdown.match(/<!-- prettier-ignore -->\n\| local-id/g)).toHaveLength(2)
  })

  it('instance_id_pattern がある場合だけ実体IDパターン列を出力する', () => {
    const recurring: DctDeliverableItem = {
      local_id: 'item-entry',
      instance_id_pattern: 'item-{sequence}-{term}',
      name: '反復成果物',
      kind: 'control',
      overview: '概要',
    }
    const doc = makeDoc({ groups: [makeSection({ deliverables: [recurring] })] })
    const markdown = buildMarkdown(doc)
    expect(markdown).toContain('| local-id | 実体IDパターン |')
    expect(markdown).toContain('| `item-entry` | `item-{sequence}-{term}` |')
  })
})
