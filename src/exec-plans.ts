import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { load } from 'js-yaml'
import { specdojoRootDir } from './specdojo-config.js'
import { expandTemplate, listFilesRecursive, readJson } from './exec-shared.js'
import type {
  ExecPlanMeta,
  ReadySnapshot,
  ReadyTaskView,
  StateSnapshot,
  TaskMode,
} from './exec-types.js'
import type { CriteriaItem, DctDeliverableItem, DctDoc, DctSection } from './catalog-types.js'
import type { ReviewViewpoint, ReviewViewpointsDoc } from './review-types.js'

// ---------------------------------------------------------------------------
// Internal types
// ---------------------------------------------------------------------------

type PlanTask = ReadyTaskView & { mode: TaskMode }

type DeliverableInfo = {
  deliverable: DctDeliverableItem
  resolvedPath: string
}

// ---------------------------------------------------------------------------
// Catalog helpers
// ---------------------------------------------------------------------------

function joinBasePath(parent: string, child: string | undefined): string {
  if (!child) return parent
  if (child.startsWith('/')) return child
  return parent ? `${parent}/${child}` : `/${child}`
}

function searchSections(
  sections: DctSection[],
  parentBase: string,
  localId: string
): DeliverableInfo | null {
  for (const section of sections) {
    const sectionBase = joinBasePath(parentBase, section.base_path)
    for (const d of section.deliverables ?? []) {
      if (d.local_id === localId) {
        return {
          deliverable: d,
          resolvedPath: d.path ? `${sectionBase}/${d.path}` : sectionBase,
        }
      }
    }
    const found = searchSections(section.groups ?? [], sectionBase, localId)
    if (found) return found
  }
  return null
}

function findDeliverableInfo(catalogPath: string, localId: string): DeliverableInfo | null {
  if (!catalogPath || !existsSync(catalogPath)) return null
  const files = listFilesRecursive(catalogPath)
    .filter(f => /^dct-.+\.ya?ml$/i.test(f.split('/').pop() ?? ''))
    .sort()

  for (const filePath of files) {
    let doc: DctDoc
    try {
      doc = load(readFileSync(filePath, 'utf8')) as DctDoc
    } catch {
      continue
    }
    const found = searchSections(doc.groups, doc.base_path ?? '', localId)
    if (found) return found
  }
  return null
}

function loadViewpoints(viewpointsPath: string): Map<string, ReviewViewpoint> {
  if (!viewpointsPath || !existsSync(viewpointsPath)) return new Map()
  try {
    const doc = load(readFileSync(viewpointsPath, 'utf8')) as ReviewViewpointsDoc
    return new Map((doc.viewpoints ?? []).map(vp => [vp.id, vp]))
  } catch {
    return new Map()
  }
}

function repoRelativePath(absPath: string): string {
  const rel = relative(specdojoRootDir(), absPath)
  return rel.startsWith('/') ? rel : `/${rel}`
}

// ---------------------------------------------------------------------------
// Markdown builders
// ---------------------------------------------------------------------------

function frontmatter(meta: ExecPlanMeta): string {
  const lines = [
    '---',
    `id: ${meta.id}`,
    `type: ${meta.type}`,
    `rulebook: ${meta.rulebook}`,
    `task_id: ${meta.task_id}`,
    ...(meta.name ? [`name: ${meta.name}`] : []),
    `mode: ${meta.mode}`,
    `status: ${meta.status}`,
    `project_id: ${meta.project_id}`,
  ]
  if (meta.owner) lines.push(`owner: ${meta.owner}`)
  if (meta.on_critical_path) lines.push(`on_critical_path: true`)
  if (meta.viewpoints_ref) lines.push(`viewpoints_ref: ${meta.viewpoints_ref}`)
  lines.push('---')
  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Template-based generation (edit-plan / review-plan テンプレートの展開)
// ---------------------------------------------------------------------------

function templateFileName(mode: TaskMode): string {
  return mode === 'review' ? 'xrp-template.md' : 'xep-template.md'
}

function loadPlanTemplate(mode: TaskMode): string {
  const templatePath = join(specdojoRootDir(), 'docs/ja/specdojo/templates', templateFileName(mode))
  if (!existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`)
  }
  return readFileSync(templatePath, 'utf8')
}

function phaseDescriptionText(task: PlanTask): string {
  if (task.description) return task.description.trimEnd()
  return task.name ?? task.id
}

function deliverablePathLine(deliverable: DeliverableInfo | null): string {
  if (deliverable) return `- path: \`${deliverable.resolvedPath}\``
  return '- 成果物カタログに登録されていないタスク。タスク名を参照する。'
}

function rulebookRefLine(deliverable: DeliverableInfo | null): string {
  return `- rulebook: \`${deliverable?.deliverable.rulebook ?? 'none'}\``
}

function resultRefLine(resultRef: string): string {
  return `- result: \`${resultRef}\``
}

function doneCriteriaBlock(criteria: CriteriaItem[]): string {
  if (criteria.length === 0) {
    return '_TODO_: 対象成果物の done_criteria が見つかりません。カタログを確認してください。'
  }
  const lines = ['**done_criteria:**', '']
  for (const c of criteria) lines.push(`- ${c.text}`)
  return lines.join('\n')
}

function reviewViewpointsTable(criteria: CriteriaItem[]): string {
  if (criteria.length === 0) {
    return '_TODO_: 対象成果物の done_criteria が見つかりません。カタログを確認してください。'
  }
  const lines = ['| ID | ロール | viewpoint_id | 確認基準 |', '|---|---|---|---|']
  criteria.forEach((c, i) => {
    const vpId = `RVP-${String(i + 1).padStart(3, '0')}`
    lines.push(`| ${vpId} | ${c.roles.join(', ')} | ${c.viewpoint} | ${c.text} |`)
  })
  return lines.join('\n')
}

function reviewViewpointsDetail(criteria: CriteriaItem[], vpMap: Map<string, ReviewViewpoint>): string {
  if (criteria.length === 0) {
    return '_TODO_: 対象成果物の done_criteria が見つからないため、観点の詳細を提示できません。'
  }
  const lines: string[] = []
  criteria.forEach((c, i) => {
    const vpId = `RVP-${String(i + 1).padStart(3, '0')}`
    const vp = vpMap.get(c.viewpoint)
    if (i > 0) lines.push('')
    lines.push(`### ${vpId}（${c.roles.join(', ')}: ${c.viewpoint}）`)
    lines.push('')
    lines.push(`**確認基準**: ${c.text}`)
    if (vp?.coverage_types && vp.coverage_types.length > 0) {
      lines.push('')
      lines.push('**coverage_required:**')
      lines.push('')
      for (const ct of vp.coverage_types) lines.push(`- ${ct}`)
    }
    if (vp?.check) {
      lines.push('')
      lines.push(`**チェック観点:** ${vp.check}`)
    }
    if (vp?.evidence) {
      lines.push('')
      lines.push(`**エビデンス例:** ${vp.evidence}`)
    }
  })
  return lines.join('\n')
}

function buildEditPlanMarkdown(
  template: string,
  task: PlanTask,
  deliverable: DeliverableInfo | null,
  projectId: string,
  resultRef: string
): string {
  const cpm = task.cpm
  const onCriticalPath = cpm !== undefined && cpm.slack === 0

  const meta: ExecPlanMeta = {
    id: `xep-${task.id.toLowerCase()}`,
    type: 'exec-plan',
    rulebook: 'xep-rulebook',
    task_id: task.id,
    ...(task.name ? { name: task.name } : {}),
    mode: 'edit',
    status: 'ready',
    project_id: projectId,
    ...(task.owner ? { owner: task.owner } : {}),
    ...(onCriticalPath ? { on_critical_path: true as const } : {}),
  }

  const criteria: CriteriaItem[] = deliverable?.deliverable.done_criteria ?? []
  const values: Record<string, string> = {
    _FRONTMATTER_: frontmatter(meta),
    _PLAN_TITLE_: `Edit Plan: ${task.id}`,
    _PHASE_DESCRIPTION_: phaseDescriptionText(task),
    _DELIVERABLE_PATH_LINE_: deliverablePathLine(deliverable),
    _RESULT_REF_LINE_: resultRefLine(resultRef),
    _DONE_CRITERIA_BLOCK_: doneCriteriaBlock(criteria),
  }
  return expandTemplate(template, values)
}

function buildReviewPlanMarkdown(
  template: string,
  task: PlanTask,
  deliverable: DeliverableInfo | null,
  criteria: CriteriaItem[],
  vpMap: Map<string, ReviewViewpoint>,
  projectId: string,
  viewpointsRef: string,
  resultRef: string
): string {
  const cpm = task.cpm
  const onCriticalPath = cpm !== undefined && cpm.slack === 0

  const meta: ExecPlanMeta = {
    id: `xrp-${task.id.toLowerCase()}`,
    type: 'exec-plan',
    rulebook: 'xep-rulebook',
    task_id: task.id,
    ...(task.name ? { name: task.name } : {}),
    mode: 'review',
    status: 'ready',
    project_id: projectId,
    ...(task.owner ? { owner: task.owner } : {}),
    ...(onCriticalPath ? { on_critical_path: true as const } : {}),
    viewpoints_ref: viewpointsRef,
  }

  const values: Record<string, string> = {
    _FRONTMATTER_: frontmatter(meta),
    _PLAN_TITLE_: `Review Plan: ${task.id}`,
    _PHASE_DESCRIPTION_: phaseDescriptionText(task),
    _DELIVERABLE_PATH_LINE_: deliverablePathLine(deliverable),
    _RESULT_REF_LINE_: resultRefLine(resultRef),
    _RULEBOOK_REF_LINE_: rulebookRefLine(deliverable),
    _REVIEW_VIEWPOINTS_TABLE_: reviewViewpointsTable(criteria),
    _REVIEW_VIEWPOINTS_DETAIL_: reviewViewpointsDetail(criteria, vpMap),
  }
  return expandTemplate(template, values)
}

// ---------------------------------------------------------------------------
// Index builder
// ---------------------------------------------------------------------------

function buildPlanIndexMarkdown(tasks: PlanTask[]): string {
  const lines: string[] = []
  lines.push('# Exec Plan Index')
  lines.push('')
  lines.push('exec build が生成した実行プラン一覧。各プランは非正本であり、進捗は保持しない。')
  lines.push('')
  lines.push(`- plan_count: \`${tasks.length}\``)
  lines.push('')
  lines.push('| id | mode | owner | name | plan |')
  lines.push('|---|---|---|---|---|')
  for (const task of tasks) {
    const name = (task.name ?? task.id).replace(/\|/g, '\\|')
    lines.push(
      `| \`${task.id}\` | ${task.mode} | ${task.owner ?? '-'} | ${name} | [${task.id}-plan.md](./${task.id}-plan.md) |`
    )
  }
  lines.push('')
  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

export function generatePlans(
  executionPath: string,
  projectId: string,
  catalogPath: string,
  viewpointsPath: string | undefined,
  stateSnapshot: StateSnapshot | null
): void {
  const generatedDir = join(executionPath, 'generated')
  const readyJsonPath = join(generatedDir, 'ready.json')
  if (!existsSync(readyJsonPath)) return

  const ready = readJson(readyJsonPath) as ReadySnapshot
  const tasks = (Array.isArray(ready.tasks) ? ready.tasks : []) as PlanTask[]

  const plansDir = join(executionPath, 'exec', 'plans')

  // Preserve plan files for doing/blocked tasks so they remain accessible
  // after exec build without a separate claims snapshot.
  const activeTaskIds = new Set<string>()
  if (stateSnapshot) {
    for (const [taskId, state] of Object.entries(stateSnapshot.tasks)) {
      if (state.state === 'doing' || state.state === 'blocked') {
        activeTaskIds.add(taskId)
      }
    }
  }

  if (existsSync(plansDir)) {
    for (const entry of readdirSync(plansDir)) {
      if (entry === 'index.md') { rmSync(join(plansDir, entry)); continue }
      const taskId = entry.replace(/-plan\.md$/, '')
      if (activeTaskIds.has(taskId)) continue
      rmSync(join(plansDir, entry), { recursive: true, force: true })
    }
  }
  mkdirSync(plansDir, { recursive: true })

  const vpMap = viewpointsPath ? loadViewpoints(viewpointsPath) : new Map<string, ReviewViewpoint>()
  const vpRef = viewpointsPath ? repoRelativePath(viewpointsPath) : ''
  const editTemplate = loadPlanTemplate('edit')
  const reviewTemplate = loadPlanTemplate('review')

  for (const task of tasks) {
    const mode: TaskMode = task.mode ?? 'edit'
    const localId = task.local_id
    const deliverable = localId && catalogPath ? findDeliverableInfo(catalogPath, localId) : null
    const resultRef = `exec/results/${task.id}-result.md`
    const outPath = join(plansDir, `${task.id}-plan.md`)
    const criteria: CriteriaItem[] = deliverable?.deliverable.done_criteria ?? []

    const content =
      mode === 'review'
        ? buildReviewPlanMarkdown(
            reviewTemplate,
            { ...task, mode },
            deliverable,
            criteria,
            vpMap,
            projectId,
            vpRef,
            resultRef
          )
        : buildEditPlanMarkdown(editTemplate, { ...task, mode }, deliverable, projectId, resultRef)

    writeFileSync(outPath, content, 'utf8')
  }

  writeFileSync(
    join(plansDir, 'index.md'),
    buildPlanIndexMarkdown(tasks.map(t => ({ ...t, mode: t.mode ?? 'edit' }))),
    'utf8'
  )

  process.stdout.write(`Generated: ${plansDir}\n`)
}

export function planPathForTask(executionPath: string, taskId: string): string {
  return join(executionPath, 'exec', 'plans', `${taskId}-plan.md`)
}

export function loadPlan(executionPath: string, taskId: string): string | null {
  const planPath = planPathForTask(executionPath, taskId)
  if (existsSync(planPath)) return readFileSync(planPath, 'utf8')
  return null
}
