import { describe, expect, it } from 'vitest'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { buildDocIndex, lookupDocIndex } from '../../src/doc-index.js'
import type { DocIndex } from '../../src/doc-index.js'

function writeIndex(dir: string, entries: Record<string, string>): string {
  const index: DocIndex = { version: 1, entries }
  const indexPath = join(dir, 'doc-index.json')
  writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf8')
  return indexPath
}

describe('lookupDocIndex', () => {
  it('インデックスファイルが存在しない場合は undefined を返す', () => {
    const result = lookupDocIndex('some-id', '/nonexistent/path/doc-index.json')
    expect(result).toBeUndefined()
  })

  it('id がインデックスに存在する場合はパスを返す', () => {
    const dir = mkdtempSync(join(tmpdir(), 'specdojo-test-'))
    try {
      const indexPath = writeIndex(dir, { 'my-doc': 'docs/my-doc.md' })
      expect(lookupDocIndex('my-doc', indexPath)).toBe('docs/my-doc.md')
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('id がインデックスに存在しない場合は undefined を返す', () => {
    const dir = mkdtempSync(join(tmpdir(), 'specdojo-test-'))
    try {
      const indexPath = writeIndex(dir, { 'other-doc': 'docs/other.md' })
      expect(lookupDocIndex('missing-doc', indexPath)).toBeUndefined()
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('複数エントリのインデックスから正しい id のパスを返す', () => {
    const dir = mkdtempSync(join(tmpdir(), 'specdojo-test-'))
    try {
      const indexPath = writeIndex(dir, {
        'doc-a': 'docs/a.md',
        'doc-b': 'docs/b.md',
        'doc-c': 'docs/c.md',
      })
      expect(lookupDocIndex('doc-b', indexPath)).toBe('docs/b.md')
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('行番号付きパス（path:line 形式）もそのまま返す', () => {
    const dir = mkdtempSync(join(tmpdir(), 'specdojo-test-'))
    try {
      const indexPath = writeIndex(dir, { 'nested-id': 'docs/schedule.yaml:12' })
      expect(lookupDocIndex('nested-id', indexPath)).toBe('docs/schedule.yaml:12')
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})


describe('buildDocIndex', () => {
  it('Markdown frontmatter と YAML top-level id をインデックス化する', () => {
    const repoRoot = mkdtempSync(join(tmpdir(), 'specdojo-test-'))
    try {
      const docsRoot = join(repoRoot, 'docs')
      mkdirSync(join(docsRoot, 'ja'), { recursive: true })
      writeFileSync(
        join(docsRoot, 'ja', 'sample.md'),
        '---\nid: sample-doc\ntype: guide\nstatus: draft\n---\n\n# Sample\n',
        'utf8'
      )
      writeFileSync(
        join(docsRoot, 'ja', 'sample.yaml'),
        'id: sample-yaml\ntype: project\nstatus: draft\n',
        'utf8'
      )

      const outputPath = join(docsRoot, '.specdojo', 'doc-index.json')
      const result = buildDocIndex(docsRoot, outputPath, repoRoot)
      const index = JSON.parse(readFileSync(outputPath, 'utf8')) as DocIndex

      expect(result.count).toBe(2)
      expect(index.entries['sample-doc']).toBe('docs/ja/sample.md')
      expect(index.entries['sample-yaml']).toBe('docs/ja/sample.yaml')
    } finally {
      rmSync(repoRoot, { recursive: true, force: true })
    }
  })

  it('generated 配下を除外し、nested_id_files を収集する', () => {
    const repoRoot = mkdtempSync(join(tmpdir(), 'specdojo-test-'))
    try {
      const docsRoot = join(repoRoot, 'docs')
      mkdirSync(join(repoRoot, '.specdojo'), { recursive: true })
      mkdirSync(join(docsRoot, 'generated'), { recursive: true })
      writeFileSync(
        join(docsRoot, 'generated', 'ignored.md'),
        '---\nid: ignored-doc\ntype: guide\nstatus: draft\n---\n',
        'utf8'
      )
      writeFileSync(
        join(docsRoot, 'viewpoints.yaml'),
        [
          'id: viewpoints-root',
          'viewpoints:',
          '  - id: vp-with-path',
          '    path: docs/custom-target.md',
          '  - id: vp-with-line',
          '    name: line target',
          '',
        ].join('\n'),
        'utf8'
      )
      writeFileSync(
        join(repoRoot, '.specdojo', 'index-config.yaml'),
        [
          'nested_id_files:',
          '  - file: docs/viewpoints.yaml',
          '    collect_from:',
          '      - field: viewpoints',
          '        id_field: id',
          '        path_field: path',
          '',
        ].join('\n'),
        'utf8'
      )

      const outputPath = join(docsRoot, '.specdojo', 'doc-index.json')
      buildDocIndex(docsRoot, outputPath, repoRoot)
      const index = JSON.parse(readFileSync(outputPath, 'utf8')) as DocIndex

      expect(index.entries['ignored-doc']).toBeUndefined()
      expect(index.entries['viewpoints-root']).toBe('docs/viewpoints.yaml')
      expect(index.entries['vp-with-path']).toBe('docs/custom-target.md')
      expect(index.entries['vp-with-line']).toBe('docs/viewpoints.yaml:5')
    } finally {
      rmSync(repoRoot, { recursive: true, force: true })
    }
  })
})
