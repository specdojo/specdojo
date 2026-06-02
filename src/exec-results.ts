import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { ExecResultMeta, TaskMode } from './exec-types.js'

// ---------------------------------------------------------------------------
// Frontmatter helpers
// ---------------------------------------------------------------------------

function serializeFrontmatter(meta: ExecResultMeta): string {
  const lines = [
    '---',
    `id: ${meta.id}`,
    `task_id: ${meta.task_id}`,
    `mode: ${meta.mode}`,
    `status: ${meta.status}`,
    `project_id: ${meta.project_id}`,
    `plan_ref: ${meta.plan_ref}`,
    `started_at: ${meta.started_at}`,
  ]
  if (meta.completed_at) lines.push(`completed_at: ${meta.completed_at}`)
  if (meta.agent) lines.push(`agent: ${meta.agent}`)
  lines.push('---')
  return lines.join('\n')
}

function parseFrontmatter(content: string): { meta: Record<string, string>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) return { meta: {}, body: content }
  const meta: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
  }
  return { meta, body: match[2] }
}

// ---------------------------------------------------------------------------
// Scaffold builders
// ---------------------------------------------------------------------------

function buildEditResultBody(): string {
  const lines: string[] = []
  lines.push('')
  lines.push('## 1. done_criteria 確認')
  lines.push('')
  lines.push('_TODO_: プランの done_criteria を確認してチェックを記入する。')
  lines.push('')
  lines.push('<!-- 例:')
  lines.push('- [x] 目的・背景・ゴールが記述されている')
  lines.push('- [ ] ステークホルダーの役割が明記されている')
  lines.push('-->')
  lines.push('')
  lines.push('## 2. 実施内容')
  lines.push('')
  lines.push('_TODO_: 実施した内容の要約を記入する。')
  lines.push('')
  lines.push('## 3. 変更ファイル')
  lines.push('')
  lines.push('_TODO_: 変更したファイルのパスを記入する。')
  lines.push('')
  lines.push('## 4. 申し送り')
  lines.push('')
  lines.push('_TODO_: 後続タスクへの申し送り事項を記入する（なければ削除）。')
  lines.push('')
  return lines.join('\n')
}

function buildReviewResultBody(): string {
  const lines: string[] = []
  lines.push('')
  lines.push('## 1. レビュー観点別結果')
  lines.push('')
  lines.push('_TODO_: プランの各 RVP-XXX セクションに対して結果を記入する。')
  lines.push('')
  lines.push('<!-- 各観点の記入例:')
  lines.push('### RVP-001')
  lines.push('')
  lines.push('- result: pass | fail | unclear')
  lines.push('- evidence: （根拠・参照箇所）')
  lines.push('- notes: （補足）')
  lines.push('-->')
  lines.push('')
  lines.push('## 2. findings')
  lines.push('')
  lines.push('_TODO_: 問題点・指摘事項を記入する（なければ削除）。')
  lines.push('')
  lines.push('## 3. decision')
  lines.push('')
  lines.push('- recommendation: _TODO_（approve / revise / reject）')
  lines.push('')
  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function resultPathForTask(executionPath: string, taskId: string): string {
  return join(executionPath, 'exec', 'results', `${taskId}-result.md`)
}

export function scaffoldResult(opts: {
  executionPath: string
  taskId: string
  mode: TaskMode
  projectId: string
  planRef: string
  agent: string
  startedAt: string
}): string {
  const { executionPath, taskId, mode, projectId, planRef, agent, startedAt } = opts
  const resultsDir = join(executionPath, 'exec', 'results')
  if (!existsSync(resultsDir)) mkdirSync(resultsDir, { recursive: true })

  const resultPath = resultPathForTask(executionPath, taskId)

  const meta: ExecResultMeta = {
    id: mode === 'review' ? `xrr-${taskId}` : `xer-${taskId}`,
    task_id: taskId,
    mode,
    status: 'in_progress',
    project_id: projectId,
    plan_ref: planRef,
    started_at: startedAt,
    agent,
  }

  const body = mode === 'review' ? buildReviewResultBody() : buildEditResultBody()

  writeFileSync(resultPath, serializeFrontmatter(meta) + body, 'utf8')
  return resultPath
}

export function updateResultStatus(
  resultPath: string,
  status: 'complete' | 'blocked',
  completedAt: string
): void {
  if (!existsSync(resultPath)) return

  const content = readFileSync(resultPath, 'utf8')
  const { meta: existingMeta, body } = parseFrontmatter(content)

  const updatedMeta: ExecResultMeta = {
    id: existingMeta.id ?? '',
    task_id: existingMeta.task_id ?? '',
    mode: (existingMeta.mode as TaskMode) ?? 'edit',
    status,
    project_id: existingMeta.project_id ?? '',
    plan_ref: existingMeta.plan_ref ?? '',
    started_at: existingMeta.started_at ?? '',
    completed_at: completedAt,
    agent: existingMeta.agent,
  }

  writeFileSync(resultPath, serializeFrontmatter(updatedMeta) + body, 'utf8')
}
