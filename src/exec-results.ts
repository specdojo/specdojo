import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { specdojoRootDir } from './specdojo-config.js'
import { expandTemplate } from './exec-shared.js'
import type { ExecResultMeta, TaskMode } from './exec-types.js'

// ---------------------------------------------------------------------------
// Frontmatter helpers
// ---------------------------------------------------------------------------

function serializeFrontmatter(meta: ExecResultMeta): string {
  const lines = [
    '---',
    `id: ${meta.id}`,
    `type: ${meta.type}`,
    `task_id: ${meta.task_id}`,
    `mode: ${meta.mode}`,
    `status: ${meta.status}`,
    `project_id: ${meta.project_id}`,
    `plan_ref: ${meta.plan_ref}`,
    `started_at: "${meta.started_at}"`,
  ]
  if (meta.completed_at) lines.push(`completed_at: "${meta.completed_at}"`)
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
// Template-based generation (edit-result / review-result テンプレートの展開)
// ---------------------------------------------------------------------------

function templateFileName(mode: TaskMode): string {
  return mode === 'review' ? 'xrr-template.md' : 'xer-template.md'
}

function loadResultTemplate(mode: TaskMode): string {
  const templatePath = join(specdojoRootDir(), 'docs/ja/specdojo/templates', templateFileName(mode))
  if (!existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`)
  }
  return readFileSync(templatePath, 'utf8')
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
}): { resultPath: string; created: boolean } {
  const { executionPath, taskId, mode, projectId, planRef, agent, startedAt } = opts
  const resultPath = resultPathForTask(executionPath, taskId)

  // Idempotent: claim and exec run can both reach this; never clobber an in-progress result.
  if (existsSync(resultPath)) {
    return { resultPath, created: false }
  }

  const resultsDir = join(executionPath, 'exec', 'results')
  if (!existsSync(resultsDir)) mkdirSync(resultsDir, { recursive: true })

  const template = loadResultTemplate(mode)

  const meta: ExecResultMeta = {
    id: mode === 'review' ? `xrr-${taskId.toLowerCase()}` : `xer-${taskId.toLowerCase()}`,
    type: 'exec-result',
    task_id: taskId,
    mode,
    status: 'in_progress',
    project_id: projectId,
    plan_ref: planRef,
    started_at: startedAt,
    agent,
  }

  const content = expandTemplate(template, { _FRONTMATTER_: serializeFrontmatter(meta) })

  writeFileSync(resultPath, content, 'utf8')
  return { resultPath, created: true }
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
    type: 'exec-result',
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
