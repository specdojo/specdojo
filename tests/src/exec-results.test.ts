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

  it('expands the review result sections placeholder when reviewSections is provided', () => {
    const { resultPath } = scaffoldResult({
      executionPath,
      taskId: 'prj-overview',
      mode: 'review',
      projectId: 'prj-0001',
      planRef: 'exec/plans/prj-overview-plan.md',
      agent: 'codex-review-agent',
      startedAt: '2026-06-20T00:00:00.000Z',
      reviewSections: '### RVP-001（BA: vp-ba-business-value）\n\n**確認基準**: x',
    })

    const body = readFileSync(resultPath, 'utf8')
    expect(body).toContain('### RVP-001（BA: vp-ba-business-value）')
    expect(body).not.toContain('_REVIEW_RESULT_SECTIONS_')
  })

  it('falls back to a language-neutral _TODO_ marker when a review result has no reviewSections', () => {
    const { resultPath } = scaffoldResult({
      executionPath,
      taskId: 'prj-overview',
      mode: 'review',
      projectId: 'prj-0001',
      planRef: 'exec/plans/prj-overview-plan.md',
      agent: 'codex-review-agent',
      startedAt: '2026-06-20T00:00:00.000Z',
    })

    const body = readFileSync(resultPath, 'utf8')
    // The placeholder is replaced; no Japanese fallback prose is hardcoded in code.
    expect(body).not.toContain('_REVIEW_RESULT_SECTIONS_')
    expect(body).toContain('## 1. レビュー観点別結果')
  })

  it('uses the stem for the result file name and doc id while keeping task_id', () => {
    const stem = 'prj-overview-20260620t125519z-0328'
    const { resultPath, created } = scaffoldResult({
      executionPath,
      taskId: 'prj-overview',
      stem,
      mode: 'review',
      projectId: 'prj-0001',
      planRef: `exec/plans/${stem}-plan.md`,
      agent: 'codex-review-agent',
      startedAt: '2026-06-20T00:00:00.000Z',
    })

    expect(created).toBe(true)
    expect(resultPath.endsWith(`${stem}-result.md`)).toBe(true)
    const frontmatter = readFileSync(resultPath, 'utf8').split('\n---')[0]
    // id is unique per stem (no doc-index collision); task_id stays the bare task id.
    expect(frontmatter).toContain(`id: prj-0001:xrr-${stem}`)
    expect(frontmatter).toContain('task_id: prj-overview')
    expect(frontmatter).toContain(`plan_ref: exec/plans/${stem}-plan.md`)
  })
})
