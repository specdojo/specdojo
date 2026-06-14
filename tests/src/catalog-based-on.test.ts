import { afterEach, describe, expect, it } from 'vitest'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { validateBasedOn } from '../../src/catalog-build.js'

let rootDir: string

afterEach(() => {
  if (rootDir) rmSync(rootDir, { recursive: true, force: true })
})

type Item = {
  local_id: string
  depends_on?: string[]
  based_on?: string[]
  path?: string
  kind?: string
}

type FileSpec = { name: string; items: Item[] }

const PROJECT_ID = 'prj-test'

function deliverableYaml(item: Item): string {
  const lines = [
    `      - local_id: ${item.local_id}`,
    `        name: ${item.local_id}`,
    `        kind: ${item.kind ?? 'work'}`,
    `        overview: o`,
    `        path: ${item.path ?? `${item.local_id}.md`}`,
    `        done_criteria:`,
    `          - text: t`,
    `            roles: [PO]`,
    `            viewpoint: vp-x`,
  ]
  if (item.depends_on && item.depends_on.length > 0) {
    lines.splice(3, 0, `        depends_on: [${item.depends_on.join(', ')}]`)
  }
  return lines.join('\n')
}

// Writes one or more dct-*.yaml (all project_id prj-test, base_path /docs) plus
// each work deliverable's document with the given based_on list. Returns the
// catalog path.
function setup(files: FileSpec[]): { catalogPath: string } {
  rootDir = mkdtempSync(join(tmpdir(), 'specdojo-based-on-'))
  const catalogPath = join(rootDir, 'catalog')
  const docsDir = join(rootDir, 'docs')
  mkdirSync(catalogPath, { recursive: true })
  mkdirSync(docsDir, { recursive: true })

  for (const file of files) {
    const yaml = [
      `id: ${PROJECT_ID}:${file.name}`,
      'type: project',
      'status: draft',
      `project_id: ${PROJECT_ID}`,
      'domain: d',
      'base_path: /docs',
      'groups:',
      '  - deliverables:',
      file.items.map(deliverableYaml).join('\n'),
      '',
    ].join('\n')
    writeFileSync(join(catalogPath, `${file.name}.yaml`), yaml, 'utf8')

    for (const item of file.items) {
      if ((item.kind ?? 'work') !== 'work') continue
      const based = item.based_on ?? []
      const fm = ['---', `id: ${PROJECT_ID}:${item.local_id}`, 'type: project', 'status: draft']
      if (based.length > 0) {
        fm.push('based_on:')
        for (const b of based) fm.push(`  - ${b}`)
      } else {
        fm.push('based_on: []')
      }
      fm.push('---', '', `# ${item.local_id}`, '')
      writeFileSync(join(docsDir, item.path ?? `${item.local_id}.md`), fm.join('\n'), 'utf8')
    }
  }

  return { catalogPath }
}

function dct(name: string, items: Item[]): FileSpec {
  return { name, items }
}

describe('validateBasedOn', () => {
  it('based_on が直接の depends_on に含まれていれば ok（完全 ID）', () => {
    const { catalogPath } = setup([
      dct('dct-a', [{ local_id: 'a' }, { local_id: 'b', depends_on: ['a'], based_on: ['prj-test:a'] }]),
    ])

    const result = validateBasedOn(catalogPath, rootDir, new Set())

    expect(result.ok).toBe(true)
    expect(result.errors).toEqual([])
  })

  it('接頭辞なしのローカル参照も同一プロジェクトとして解決し閉包検査する', () => {
    const { catalogPath } = setup([
      dct('dct-a', [{ local_id: 'a' }, { local_id: 'b', depends_on: ['a'], based_on: ['a'] }]),
    ])

    const result = validateBasedOn(catalogPath, rootDir, new Set())

    expect(result.ok).toBe(true)
  })

  it('接頭辞なしローカル参照が前提依存でなければエラー', () => {
    const { catalogPath } = setup([
      dct('dct-a', [
        { local_id: 'a' },
        { local_id: 'b', depends_on: ['a'] },
        { local_id: 'c', depends_on: ['a'], based_on: ['b'] },
      ]),
    ])

    const result = validateBasedOn(catalogPath, rootDir, new Set())

    expect(result.ok).toBe(false)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]).toContain("based_on 'b' (prj-test:b)")
  })

  it('別ファイルの同一プロジェクト依存もプロジェクト全体の閉包で解決する', () => {
    const { catalogPath } = setup([
      dct('dct-base', [{ local_id: 'overview' }]),
      dct('dct-management', [{ local_id: 'org', depends_on: ['overview'], based_on: ['overview'] }]),
    ])

    const result = validateBasedOn(catalogPath, rootDir, new Set())

    expect(result.ok).toBe(true)
  })

  it('既知のグローバル/他プロジェクト参照は閉包検査の対象外', () => {
    const { catalogPath } = setup([
      dct('dct-a', [{ local_id: 'a', based_on: ['external-standard', 'prj-other:thing'] }]),
    ])
    const known = new Set(['external-standard', 'prj-other:thing'])

    const result = validateBasedOn(catalogPath, rootDir, known)

    expect(result.ok).toBe(true)
  })

  it('解決できない参照はエラー（resolve-or-error / typo 検出）', () => {
    const { catalogPath } = setup([dct('dct-a', [{ local_id: 'a', based_on: ['ghost-ref'] }])])

    const result = validateBasedOn(catalogPath, rootDir, new Set())

    expect(result.ok).toBe(false)
    expect(result.errors[0]).toContain("based_on 'ghost-ref' を解決できません")
  })

  it('同一プロジェクトの非カタログ文書（既知ID）は解決でき閉包検査の対象外', () => {
    const { catalogPath } = setup([dct('dct-a', [{ local_id: 'a', based_on: ['note'] }])])
    const known = new Set(['prj-test:note'])

    const result = validateBasedOn(catalogPath, rootDir, known)

    expect(result.ok).toBe(true)
  })

  it('文書ファイルが無い場合は警告にする', () => {
    const { catalogPath } = setup([dct('dct-a', [{ local_id: 'a' }])])
    rmSync(join(rootDir, 'docs', 'a.md'))

    const result = validateBasedOn(catalogPath, rootDir, new Set())

    expect(result.ok).toBe(true)
    expect(result.warnings).toHaveLength(1)
    expect(result.warnings[0]).toContain('a:')
  })

  it('based_on が自分自身を参照するとエラー', () => {
    const { catalogPath } = setup([dct('dct-a', [{ local_id: 'a', based_on: ['prj-test:a'] }])])

    const result = validateBasedOn(catalogPath, rootDir, new Set())

    expect(result.ok).toBe(false)
    expect(result.errors[0]).toContain('自分自身')
  })
})
