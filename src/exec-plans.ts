import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { load } from 'js-yaml'
import { specdojoRootDir } from './specdojo-config.js'
import { expandTemplate, listFilesRecursive, readJson } from './exec-shared.js'
import { buildPhaseModeIndex, resolveApproachMode } from './exec-strategy.js'
import type {
  ApproachMode,
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

function criticalityText(slack: number | undefined): string {
  if (slack === undefined) return 'CPM 情報なし'
  if (slack === 0) return 'クリティカルパス上。遅延余裕なし。'
  return `遅延余裕あり（slack=${slack}）。`
}

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
  if (meta.approach_mode) lines.push(`approach_mode: ${meta.approach_mode}`)
  lines.push('---')
  return lines.join('\n')
}

function buildEditPlanMarkdown(
  task: PlanTask,
  deliverable: DeliverableInfo | null,
  projectId: string,
  resultRef: string
): string {
  const lines: string[] = []
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

  lines.push(frontmatter(meta))
  lines.push('')
  lines.push(`# Edit Plan: ${task.id}`)
  lines.push('')

  // Section 1: what to do in this phase (most important, shown first)
  lines.push('## 1. このフェーズで行うこと')
  lines.push('')
  if (task.description) {
    for (const line of task.description.trimEnd().split('\n')) {
      lines.push(line)
    }
  } else {
    lines.push(`${task.name ?? task.id}`)
  }
  lines.push('')

  // Section 2: target deliverable + result path
  lines.push('## 2. 対象成果物')
  lines.push('')
  if (deliverable) {
    lines.push(`- path: \`${deliverable.resolvedPath}\``)
    lines.push(`- result: \`${resultRef}\``)
    const criteria = deliverable.deliverable.done_criteria ?? []
    if (criteria.length > 0) {
      lines.push('')
      lines.push('**done_criteria:**')
      lines.push('')
      for (const c of criteria) {
        lines.push(`- ${c.text}`)
      }
    }
  } else {
    lines.push('- 成果物カタログに登録されていないタスク。タスク名を参照する。')
    lines.push(`- result: \`${resultRef}\``)
  }
  lines.push('')

  // Section 3: completion steps (no exit protocol)
  lines.push('## 3. 完了手順')
  lines.push('')
  lines.push('1. 「このフェーズで行うこと」に従って成果物を更新する。')
  lines.push('2. 必要な検証と lint を実行する。')
  lines.push('3. result の done_criteria_checked セクションを記入する。')
  lines.push('')

  // Section 4: termination conditions (merged from old 4 + 5)
  lines.push('## 4. 異常終了の条件')
  lines.push('')
  lines.push('- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。')
  lines.push('- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。')
  lines.push('- 異常終了時は complete ではなく block を記録する。')
  lines.push('')

  return lines.join('\n')
}

function buildReviewPlanMarkdown(
  task: PlanTask,
  deliverable: DeliverableInfo | null,
  criteria: CriteriaItem[],
  vpMap: Map<string, ReviewViewpoint>,
  projectId: string,
  viewpointsRef: string,
  resultRef: string
): string {
  const lines: string[] = []
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

  lines.push(frontmatter(meta))
  lines.push('')
  lines.push(`# Review Plan: ${task.id}`)
  lines.push('')

  // Section 1: what to do in this phase (most important, shown first)
  lines.push('## 1. このフェーズで行うこと')
  lines.push('')
  if (task.description) {
    for (const line of task.description.trimEnd().split('\n')) {
      lines.push(line)
    }
  } else {
    lines.push(`${task.name ?? task.id}`)
  }
  lines.push('')

  lines.push('## 2. 対象成果物')
  lines.push('')
  if (deliverable) {
    lines.push(`- path: \`${deliverable.resolvedPath}\``)
    lines.push(`- rulebook: \`${deliverable.deliverable.rulebook ?? 'none'}\``)
    lines.push(`- result: \`${resultRef}\``)
  } else {
    lines.push('- 成果物カタログに登録されていないタスク。タスク名を参照する。')
    lines.push(`- result: \`${resultRef}\``)
  }
  lines.push('')
  lines.push('## 3. レビュー観点')
  lines.push('')

  if (criteria.length > 0) {
    lines.push('| ID | ロール | viewpoint_id | 確認基準 |')
    lines.push('|---|---|---|---|')
    criteria.forEach((c, i) => {
      const vpId = `RVP-${String(i + 1).padStart(3, '0')}`
      lines.push(`| ${vpId} | ${c.roles.join(', ')} | ${c.viewpoint} | ${c.text} |`)
    })
    lines.push('')
    criteria.forEach((c, i) => {
      const vpId = `RVP-${String(i + 1).padStart(3, '0')}`
      const vp = vpMap.get(c.viewpoint)
      lines.push(`### ${vpId}（${c.roles.join(', ')}: ${c.viewpoint}）`)
      lines.push('')
      lines.push(`**確認基準**: ${c.text}`)
      lines.push('')
      if (vp?.coverage_types && vp.coverage_types.length > 0) {
        lines.push('**coverage_required:**')
        lines.push('')
        for (const ct of vp.coverage_types) {
          lines.push(`- ${ct}`)
        }
        lines.push('')
      }
      if (vp?.check) {
        lines.push(`**チェック観点:** ${vp.check}`)
        lines.push('')
      }
      if (vp?.evidence) {
        lines.push(`**エビデンス例:** ${vp.evidence}`)
        lines.push('')
      }
    })
  } else {
    lines.push('_TODO_: 対象成果物の done_criteria が見つかりません。カタログを確認してください。')
    lines.push('')
  }

  // Section 4: completion steps (no exit protocol)
  lines.push('## 4. 完了手順')
  lines.push('')
  lines.push('1. レビュー観点ごとに pass / fail / unclear を判定し、根拠を記入する。')
  lines.push('2. result の各レビュー観点セクションに記入する。')
  lines.push('')

  // Section 5: termination conditions (merged from old 4 + 5)
  lines.push('## 5. 異常終了の条件')
  lines.push('')
  lines.push('- done_criteria を満たさない・対象ファイル不明・依存未解決の場合は異常終了する（終了コード 1）。')
  lines.push('- 標準エラー出力に理由を出力する（例: `review-blocked: <reason>; criterion=<id>; ref=<path>`）。')
  lines.push('- 異常終了時は complete ではなく block を記録する。')
  lines.push('')

  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Template-based generation (approach_mode 別の edit-plan / review-plan テンプレート展開)
// ---------------------------------------------------------------------------

function templateFileName(mode: TaskMode, approachMode: ApproachMode): string {
  const prefix = mode === 'review' ? 'xrp' : 'xep'
  return `${prefix}-${approachMode}-template.md`
}

function loadPlanTemplate(mode: TaskMode, approachMode: ApproachMode): string | null {
  const templatePath = join(
    specdojoRootDir(),
    'docs/ja/specdojo/templates',
    templateFileName(mode, approachMode)
  )
  if (!existsSync(templatePath)) return null
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

function buildTemplatedEditPlan(
  template: string,
  task: PlanTask,
  deliverable: DeliverableInfo | null,
  projectId: string,
  resultRef: string,
  approachMode: ApproachMode
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
    approach_mode: approachMode,
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

function buildTemplatedReviewPlan(
  template: string,
  task: PlanTask,
  deliverable: DeliverableInfo | null,
  criteria: CriteriaItem[],
  vpMap: Map<string, ReviewViewpoint>,
  projectId: string,
  viewpointsRef: string,
  resultRef: string,
  approachMode: ApproachMode
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
    approach_mode: approachMode,
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
  schedulePath: string,
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
  const phaseModeIndex = buildPhaseModeIndex(schedulePath, executionPath)
  const fallbackNotices: string[] = []

  for (const task of tasks) {
    const mode: TaskMode = task.mode ?? 'edit'
    const localId = task.local_id
    const deliverable = localId && catalogPath ? findDeliverableInfo(catalogPath, localId) : null
    const resultRef = `exec/results/${task.id}-result.md`
    const outPath = join(plansDir, `${task.id}-plan.md`)
    const criteria: CriteriaItem[] = deliverable?.deliverable.done_criteria ?? []

    const approachMode = resolveApproachMode(localId, phaseModeIndex)
    const template = approachMode ? loadPlanTemplate(mode, approachMode) : null

    let content: string
    if (approachMode && template) {
      content =
        mode === 'review'
          ? buildTemplatedReviewPlan(
              template,
              { ...task, mode },
              deliverable,
              criteria,
              vpMap,
              projectId,
              vpRef,
              resultRef,
              approachMode
            )
          : buildTemplatedEditPlan(template, { ...task, mode }, deliverable, projectId, resultRef, approachMode)
    } else {
      if (!approachMode) {
        fallbackNotices.push(`${task.id}: approach_mode 未指定`)
      } else {
        fallbackNotices.push(`${task.id}: テンプレート未整備（${templateFileName(mode, approachMode)}）`)
      }
      content =
        mode === 'review'
          ? buildReviewPlanMarkdown({ ...task, mode }, deliverable, criteria, vpMap, projectId, vpRef, resultRef)
          : buildEditPlanMarkdown({ ...task, mode }, deliverable, projectId, resultRef)
    }

    writeFileSync(outPath, content, 'utf8')
  }

  writeFileSync(
    join(plansDir, 'index.md'),
    buildPlanIndexMarkdown(tasks.map(t => ({ ...t, mode: t.mode ?? 'edit' }))),
    'utf8'
  )

  process.stdout.write(`Generated: ${plansDir}\n`)
  if (fallbackNotices.length > 0) {
    process.stdout.write('Fallback (approach_mode テンプレート未適用):\n')
    for (const notice of fallbackNotices) {
      process.stdout.write(`  - ${notice}\n`)
    }
  }
}

export function planPathForTask(executionPath: string, taskId: string): string {
  return join(executionPath, 'exec', 'plans', `${taskId}-plan.md`)
}

export function loadPlan(executionPath: string, taskId: string): string | null {
  const planPath = planPathForTask(executionPath, taskId)
  if (existsSync(planPath)) return readFileSync(planPath, 'utf8')
  return null
}
