import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { scaffoldResult, updateResultStatus } from '../../src/exec-results.js'

describe('scaffoldResult + updateResultStatus round-trip', () => {
  let executionPath: string

  beforeEach(() => {
    // Output goes to a temp execution path; the xer template is read from the repo.
    executionPath = join(mkdtempSync(join(tmpdir(), 'specdojo-exec-results-')), 'execution')
  })

  afterEach(() => {
    rmSync(executionPath, { recursive: true, force: true })
  })

  it('keeps started_at single-quoted after the status update re-serializes frontmatter', () => {
    const { resultPath } = scaffoldResult({
      executionPath,
      taskId: 'prj-overview',
      mode: 'edit',
      projectId: 'prj-0001',
      planRef: 'exec/plans/prj-overview-plan.md',
      agent: 'opencode-edit-agent',
      startedAt: '2026-06-20T00:00:00.000Z',
    })

    updateResultStatus(resultPath, 'complete', '2026-06-20T00:01:00.000Z')

    const frontmatter = readFileSync(resultPath, 'utf8').split('\n---')[0]
    // Re-serialization must not nest the quotes that scaffoldResult wrote.
    expect(frontmatter).toContain('started_at: "2026-06-20T00:00:00.000Z"')
    expect(frontmatter).not.toContain('""')
    expect(frontmatter).toContain('completed_at: "2026-06-20T00:01:00.000Z"')
    expect(frontmatter).toContain('status: complete')
    expect(frontmatter).toContain('id: prj-0001:xer-prj-overview')
  })
})
