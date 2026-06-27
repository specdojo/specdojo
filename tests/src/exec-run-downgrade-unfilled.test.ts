import { afterEach, describe, expect, it } from 'vitest'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { downgradeUnfilledResult } from '../../src/exec-run.js'

const FRONTMATTER = ['---', 'id: x', 'type: exec-result', 'mode: edit', 'status: in_progress', '---'].join(
  '\n'
)

const UNFILLED_EDIT_BODY = [
  '## 1. 実施内容',
  '',
  '_TODO_: 実施した内容の要約を記入する。',
  '',
  '## 2. 変更ファイル',
  '',
  '_TODO_: 変更したファイルのパスを記入する。',
  '',
].join('\n')

const FILLED_EDIT_BODY = [
  '## 1. 実施内容',
  '',
  '比較表を更新した。',
  '',
  '## 2. 変更ファイル',
  '',
  '- docs/foo.md',
  '',
].join('\n')

let dir: string

function writeResult(body: string): string {
  dir = mkdtempSync(join(tmpdir(), 'specdojo-downgrade-'))
  const path = join(dir, 'result.md')
  writeFileSync(path, `${FRONTMATTER}\n${body}`, 'utf8')
  return path
}

describe('downgradeUnfilledResult', () => {
  afterEach(() => {
    if (dir) rmSync(dir, { recursive: true, force: true })
  })

  it('downgrades a successful run to a block when the result is still unfilled', () => {
    const resultPath = writeResult(UNFILLED_EDIT_BODY)

    const outcome = downgradeUnfilledResult('success', resultPath, 'edit')

    expect(outcome).toEqual({ result: 'failure', unfilledBlock: true })
  })

  it('keeps a successful run when the result mandatory sections are filled', () => {
    const resultPath = writeResult(FILLED_EDIT_BODY)

    const outcome = downgradeUnfilledResult('success', resultPath, 'edit')

    expect(outcome).toEqual({ result: 'success', unfilledBlock: false })
  })

  it('does not reconsider a rate-limit outcome even if the result is unfilled', () => {
    const resultPath = writeResult(UNFILLED_EDIT_BODY)

    const outcome = downgradeUnfilledResult('rate_limit', resultPath, 'edit')

    expect(outcome).toEqual({ result: 'rate_limit', unfilledBlock: false })
  })

  it('does not reconsider a failure outcome', () => {
    const resultPath = writeResult(UNFILLED_EDIT_BODY)

    const outcome = downgradeUnfilledResult('failure', resultPath, 'edit')

    expect(outcome).toEqual({ result: 'failure', unfilledBlock: false })
  })

  it('keeps a successful run when there is no result path to inspect', () => {
    const outcome = downgradeUnfilledResult('success', undefined, 'edit')

    expect(outcome).toEqual({ result: 'success', unfilledBlock: false })
  })
})
