import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { load } from 'js-yaml'
import { specdojoRootDir } from './specdojo-config.js'
import {
  expandTemplate,
  listFilesRecursive,
  nowUtcIsoSeconds,
  randomHex,
  tsForFilenameUtc,
} from './exec-shared.js'
import type { Approach, ExecPlanMeta, ReadyTaskView, TaskMode } from './exec-types.js'
import type { CriteriaItem, DctDeliverableItem, DctDoc, DctSection } from './catalog-types.js'
import type { ReviewViewpoint, ReviewViewpointsDoc } from './review-types.js'
import type { RoleDefinition, RolesDoc } from './role-types.js'

// ---------------------------------------------------------------------------
// Internal types
// ---------------------------------------------------------------------------

type PlanTask = ReadyTaskView & { mode: TaskMode }

type DeliverableInfo = {
  deliverable: DctDeliverableItem
  resolvedPath: string
}

const MISSING = '_MISSING_'

function execDocId(projectId: string, prefix: 'xep' | 'xrp', taskId: string): string {
  const localId = `${prefix}-${taskId.toLowerCase()}`
  return projectId ? `${projectId}:${localId}` : localId
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

export type ResolvedDeliverable = {
  domain: string
  localId: string
  // Filename slug for ad-hoc plans. `local_id` is unique project-wide (catalog
  // validate warns otherwise), so the bare local_id is used.
  slug: string
  info: DeliverableInfo
}

function loadCatalogDocs(catalogPath: string): DctDoc[] {
  if (!catalogPath || !existsSync(catalogPath)) return []
  const files = listFilesRecursive(catalogPath)
    .filter(f => /^dct-.+\.ya?ml$/i.test(f.split('/').pop() ?? ''))
    .sort()

  const docs: DctDoc[] = []
  for (const filePath of files) {
    try {
      docs.push(load(readFileSync(filePath, 'utf8')) as DctDoc)
    } catch {
      continue
    }
  }
  return docs
}

// Resolve a `--deliverable` identifier (a bare `local_id`) to a catalog deliverable.
// `local_id` is unique project-wide (catalog validate warns otherwise); an ambiguous
// match is an error rather than a silent first match.
export function resolveDeliverableTarget(catalogPath: string, value: string): ResolvedDeliverable {
  const localId = value.trim()
  if (!localId) throw new Error('deliverable identifier is empty')
  const docs = loadCatalogDocs(catalogPath)

  const matches: ResolvedDeliverable[] = []
  for (const doc of docs) {
    const info = searchSections(doc.groups, doc.base_path ?? '', localId)
    if (info) matches.push({ domain: doc.domain, localId, slug: localId, info })
  }
  if (matches.length === 0) throw new Error(`deliverable not found: ${localId}`)
  if (matches.length > 1) {
    const domains = matches.map(m => m.domain).join(', ')
    throw new Error(
      `ambiguous deliverable: ${localId} (defined in domains: ${domains}). ` +
        `local_id must be unique project-wide; run catalog validate.`
    )
  }
  return matches[0]
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

function loadRoles(rolesPath: string | undefined): Map<string, RoleDefinition> {
  if (!rolesPath || !existsSync(rolesPath)) return new Map()
  try {
    const doc = load(readFileSync(rolesPath, 'utf8')) as RolesDoc
    return new Map((doc.roles ?? []).map(role => [role.code, role]))
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
  if (meta.approach) lines.push(`approach: ${meta.approach}`)
  if (meta.viewpoints_ref) lines.push(`viewpoints_ref: ${meta.viewpoints_ref}`)
  lines.push('---')
  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Template-based generation (edit-plan / review-plan テンプレートの展開)
// ---------------------------------------------------------------------------

// レビュー観点 1 件ぶんの記述ブロック断片。prose ラベル（確認基準・チェック観点など）は
// 言語別 docs/<lang>/.../templates のこの断片に置き、コードは値のみを供給する。
const REVIEW_VIEWPOINT_DETAIL_TEMPLATE = 'xrp-viewpoint-detail-template.md'

function templatesDir(): string {
  return join(specdojoRootDir(), 'docs/ja/specdojo/templates')
}

function templatePrefix(mode: TaskMode): string {
  return mode === 'review' ? 'xrp' : 'xep'
}

function standardTemplateFileName(mode: TaskMode): string {
  return `${templatePrefix(mode)}-template.md`
}

function approachTemplateFileName(mode: TaskMode, approach: Approach): string {
  return `${templatePrefix(mode)}-${approach}-template.md`
}

function usesDeliverableSelfReview(approach: Approach | undefined): boolean {
  return (
    approach === undefined ||
    approach === 'fully-guided' ||
    approach === 'recipe-guided' ||
    approach === 'freeform'
  )
}

// Selects <prefix>-<approach>-template.md when it exists, otherwise falls back
// to the standard <prefix>-template.md (xep-template.md / xrp-template.md).
function resolvePlanTemplatePath(mode: TaskMode, approach: Approach | undefined): string {
  if (approach) {
    const candidatePath = join(templatesDir(), approachTemplateFileName(mode, approach))
    if (existsSync(candidatePath)) return candidatePath
  }
  return join(templatesDir(), standardTemplateFileName(mode))
}

function readTemplate(templatePath: string, cache: Map<string, string>): string {
  const cached = cache.get(templatePath)
  if (cached !== undefined) return cached
  if (!existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`)
  }
  const content = readFileSync(templatePath, 'utf8')
  cache.set(templatePath, content)
  return content
}

function loadPlanTemplate(
  mode: TaskMode,
  approach: Approach | undefined,
  cache: Map<string, string>
): string {
  return readTemplate(resolvePlanTemplatePath(mode, approach), cache)
}

function loadViewpointDetailTemplate(cache: Map<string, string>): string {
  return readTemplate(join(templatesDir(), REVIEW_VIEWPOINT_DETAIL_TEMPLATE), cache)
}

function phaseDescriptionText(task: PlanTask): string {
  if (task.description) return task.description.trimEnd()
  return task.name ?? task.id
}

function deliverablePath(deliverable: DeliverableInfo | null): string {
  return deliverable?.resolvedPath ?? MISSING
}

function deliverableName(deliverable: DeliverableInfo | null): string {
  return deliverable?.deliverable.name ?? MISSING
}

// dct の生成ビュー（catalog-build.ts）の「根拠」列と同じ表記に合わせる。
function deliverableDependsOn(deliverable: DeliverableInfo | null): string {
  if (!deliverable) return MISSING
  const deps = deliverable.deliverable.depends_on ?? []
  if (deps.length === 0) return '-'
  return deps.map(d => `\`${d}\``).join(', ')
}

function deliverableOverview(deliverable: DeliverableInfo | null): string {
  return deliverable?.deliverable.overview ?? MISSING
}

// dct の rulebook フィールドは ID（例: prj-overview-rulebook）。docs-structure-guide の
// 規約に従い、ファイル未作成でも一意に定まる固定パスへ展開する。
function rulebookRef(deliverable: DeliverableInfo | null): string {
  const rulebook = deliverable?.deliverable.rulebook
  return rulebook ? `/docs/ja/specdojo/rulebooks/${rulebook}.md` : MISSING
}

function reviewViewpointRows(criteria: CriteriaItem[]): string {
  if (criteria.length === 0) return MISSING
  const lines: string[] = []
  criteria.forEach((c, i) => {
    const vpId = `RVP-${String(i + 1).padStart(3, '0')}`
    lines.push(`| ${vpId} | ${c.roles.join(', ')} | ${c.viewpoint} | ${c.text} |`)
  })
  return lines.join('\n')
}

// coverage_types はビューポート任意項目。持たない観点では coverage_required ブロック
// ごと省略し、持つ観点では見出し付きブロックを返す。末尾の空行で後続の `**チェック観点:**`
// と段落を分離する。
function viewpointCoverage(vp: ReviewViewpoint | undefined): string {
  if (!vp?.coverage_types || vp.coverage_types.length === 0) return ''
  const items = vp.coverage_types.map(ct => `- ${ct}`).join('\n')
  return `**coverage_required:**\n\n${items}\n\n`
}

// レビュー観点ごとに detail 断片テンプレートを展開して結合する。prose ラベルは
// detailTemplate 側にあり、ここでは値を差し込むだけ。値が無い項目は他のプレースホルダと
// 同様に MISSING にし、表示構造はテンプレート側に委ねる。
export function reviewViewpointDetails(
  criteria: CriteriaItem[],
  vpMap: Map<string, ReviewViewpoint>,
  detailTemplate: string
): string {
  if (criteria.length === 0) return MISSING
  return criteria
    .map((c, i) => {
      const vpId = `RVP-${String(i + 1).padStart(3, '0')}`
      const vp = vpMap.get(c.viewpoint)
      return expandTemplate(detailTemplate, {
        _VP_ID_: vpId,
        _VP_ROLES_: c.roles.join(', '),
        _VP_VIEWPOINT_: c.viewpoint,
        _VP_CRITERION_: c.text,
        _VP_COVERAGE_: viewpointCoverage(vp),
        _VP_CHECK_: vp?.check ?? MISSING,
        _VP_EVIDENCE_: vp?.evidence ?? MISSING,
      }).trimEnd()
    })
    .join('\n\n')
}

// owner ロール視点の記述ガイドを構成するデータ値。prose ラベルや見出しは
// テンプレート側（言語別 docs/<lang>/.../templates）に置き、ここでは値のみを供給する。
type OwnerRoleFields = {
  // owner の Role code（role 名が pm-roles.yaml にあれば `code（name）` 形式）。
  label: string
  // pm-roles.yaml の責務（project_note）。
  note: string
  // pm-review-viewpoints.yaml の該当 role 観点（`- title: check` の箇条書き）。
  viewpoints: string
}

// owner の Role code から、pm-roles.yaml の責務（project_note）と
// pm-review-viewpoints.yaml の該当 role 観点を取り出す。owner 未設定や情報欠落時は
// 他のプレースホルダと同様に MISSING を返し、表示構造はテンプレート側に委ねる。
export function ownerRoleFields(
  owner: string | undefined,
  roleMap: Map<string, RoleDefinition>,
  vpMap: Map<string, ReviewViewpoint>
): OwnerRoleFields {
  if (!owner) {
    return { label: MISSING, note: MISSING, viewpoints: MISSING }
  }

  const role = roleMap.get(owner)
  const label = role?.name ? `${owner}（${role.name}）` : owner
  const note = role?.project_note ?? MISSING

  const roleViewpoints = [...vpMap.values()].filter(vp => vp.role === owner)
  const viewpoints =
    roleViewpoints.length > 0
      ? roleViewpoints.map(vp => `- ${vp.title}: ${vp.check}`).join('\n')
      : MISSING

  return { label, note, viewpoints }
}

function buildEditPlanMarkdown(
  template: string,
  detailTemplate: string,
  task: PlanTask,
  deliverable: DeliverableInfo | null,
  roleMap: Map<string, RoleDefinition>,
  vpMap: Map<string, ReviewViewpoint>,
  projectId: string,
  viewpointsRef: string,
  resultRef: string
): string {
  const cpm = task.cpm
  const onCriticalPath = cpm !== undefined && cpm.slack === 0

  const meta: ExecPlanMeta = {
    id: execDocId(projectId, 'xep', task.id),
    type: 'exec-plan',
    rulebook: 'xep-rulebook',
    task_id: task.id,
    ...(task.name ? { name: task.name } : {}),
    mode: 'edit',
    status: 'ready',
    project_id: projectId,
    ...(task.owner ? { owner: task.owner } : {}),
    ...(onCriticalPath ? { on_critical_path: true as const } : {}),
    ...(task.approach ? { approach: task.approach } : {}),
    ...(usesDeliverableSelfReview(task.approach) && viewpointsRef
      ? { viewpoints_ref: viewpointsRef }
      : {}),
  }

  const criteria: CriteriaItem[] = deliverable?.deliverable.done_criteria ?? []
  const ownerRole = ownerRoleFields(task.owner, roleMap, vpMap)
  const values: Record<string, string> = {
    _FRONTMATTER_: frontmatter(meta),
    _TASK_ID_: task.id,
    _PHASE_DESCRIPTION_: phaseDescriptionText(task),
    _DELIVERABLE_NAME_: deliverableName(deliverable),
    _DELIVERABLE_DEPENDS_ON_: deliverableDependsOn(deliverable),
    _DELIVERABLE_OVERVIEW_: deliverableOverview(deliverable),
    _DELIVERABLE_PATH_: deliverablePath(deliverable),
    _RESULT_REF_: resultRef,
    _OWNER_ROLE_LABEL_: ownerRole.label,
    _OWNER_ROLE_NOTE_: ownerRole.note,
    _OWNER_ROLE_VIEWPOINTS_: ownerRole.viewpoints,
    _REVIEW_VIEWPOINT_ROWS_: reviewViewpointRows(criteria),
    _REVIEW_VIEWPOINT_DETAILS_: reviewViewpointDetails(criteria, vpMap, detailTemplate),
  }
  return expandTemplate(template, values)
}

function buildReviewPlanMarkdown(
  template: string,
  detailTemplate: string,
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
    id: execDocId(projectId, 'xrp', task.id),
    type: 'exec-plan',
    rulebook: 'xep-rulebook',
    task_id: task.id,
    ...(task.name ? { name: task.name } : {}),
    mode: 'review',
    status: 'ready',
    project_id: projectId,
    ...(task.owner ? { owner: task.owner } : {}),
    ...(onCriticalPath ? { on_critical_path: true as const } : {}),
    ...(task.approach ? { approach: task.approach } : {}),
    viewpoints_ref: viewpointsRef,
  }

  const values: Record<string, string> = {
    _FRONTMATTER_: frontmatter(meta),
    _TASK_ID_: task.id,
    _PHASE_DESCRIPTION_: phaseDescriptionText(task),
    _DELIVERABLE_NAME_: deliverableName(deliverable),
    _DELIVERABLE_DEPENDS_ON_: deliverableDependsOn(deliverable),
    _DELIVERABLE_OVERVIEW_: deliverableOverview(deliverable),
    _DELIVERABLE_PATH_: deliverablePath(deliverable),
    _RESULT_REF_: resultRef,
    _RULEBOOK_REF_: rulebookRef(deliverable),
    _REVIEW_VIEWPOINT_ROWS_: reviewViewpointRows(criteria),
    _REVIEW_VIEWPOINT_DETAILS_: reviewViewpointDetails(criteria, vpMap, detailTemplate),
  }
  return expandTemplate(template, values)
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

// Shared per-task plan rendering. Used by the full generatePlans loop and the
// single-task generateSinglePlan (manual re-run support).
type PlanGenContext = {
  plansDir: string
  executionPath: string
  projectId: string
  catalogPath: string
  vpMap: Map<string, ReviewViewpoint>
  roleMap: Map<string, RoleDefinition>
  vpRef: string
  templateCache: Map<string, string>
}

function writeTaskPlan(
  ctx: PlanGenContext,
  task: PlanTask,
  override?: { deliverable?: DeliverableInfo | null; outPath?: string }
): string {
  const mode: TaskMode = task.mode ?? 'edit'
  const localId = task.local_id
  const deliverable =
    override?.deliverable !== undefined
      ? override.deliverable
      : localId && ctx.catalogPath
        ? findDeliverableInfo(ctx.catalogPath, localId)
        : null
  const resultRef = `${repoRelativePath(ctx.executionPath)}/exec/results/${task.id}-result.md`
  const outPath = override?.outPath ?? join(ctx.plansDir, `${task.id}-plan.md`)
  const criteria: CriteriaItem[] = deliverable?.deliverable.done_criteria ?? []
  const planTask: PlanTask = { ...task, mode }
  const template = loadPlanTemplate(mode, task.approach, ctx.templateCache)

  const content =
    mode === 'review'
      ? buildReviewPlanMarkdown(
          template,
          loadViewpointDetailTemplate(ctx.templateCache),
          planTask,
          deliverable,
          criteria,
          ctx.vpMap,
          ctx.projectId,
          ctx.vpRef,
          resultRef
        )
      : buildEditPlanMarkdown(
          template,
          loadViewpointDetailTemplate(ctx.templateCache),
          planTask,
          deliverable,
          ctx.roleMap,
          ctx.vpMap,
          ctx.projectId,
          ctx.vpRef,
          resultRef
        )

  writeFileSync(outPath, content, 'utf8')
  return outPath
}

// Regenerate the plan for a single task without touching other plan files,
// the index, or task state. Intended for manually re-running a completed task:
// `exec build` deletes done-task plans, so this rebuilds just the one plan on demand.
export function generateSinglePlan(opts: {
  executionPath: string
  projectId: string
  catalogPath: string
  rolesPath?: string
  viewpointsPath?: string
  task: ReadyTaskView
  outPath?: string
}): string {
  const ctx = newPlanGenContext(opts)
  return writeTaskPlan(
    ctx,
    { ...opts.task, mode: opts.task.mode ?? 'edit' },
    opts.outPath ? { outPath: opts.outPath } : undefined
  )
}

// Generate a plan directly from a catalog deliverable, independent of the
// schedule. The slug (`<domain>-<local_id>`) names the plan unless `outPath`
// overrides it. CPM is absent for ad-hoc targets; owner is absent unless the
// caller resolves it (e.g. from sch-strategy owner_rules via a track).
export function generateDeliverablePlan(opts: {
  executionPath: string
  projectId: string
  catalogPath: string
  rolesPath?: string
  viewpointsPath?: string
  target: ResolvedDeliverable
  mode?: TaskMode
  approach?: Approach
  owner?: string
  outPath?: string
}): string {
  const ctx = newPlanGenContext(opts)
  const task: PlanTask = {
    id: opts.target.slug,
    local_id: opts.target.localId,
    name: opts.target.info.deliverable.name,
    mode: opts.mode ?? 'edit',
    ...(opts.approach ? { approach: opts.approach } : {}),
    ...(opts.owner ? { owner: opts.owner } : {}),
    schedule_file: '',
    fifo_rank: 0,
    critical_first_rank: 0,
  }
  return writeTaskPlan(ctx, task, { deliverable: opts.target.info, outPath: opts.outPath })
}

function newPlanGenContext(opts: {
  executionPath: string
  projectId: string
  catalogPath: string
  rolesPath?: string
  viewpointsPath?: string
}): PlanGenContext {
  const plansDir = join(opts.executionPath, 'exec', 'plans')
  mkdirSync(plansDir, { recursive: true })

  return {
    plansDir,
    executionPath: opts.executionPath,
    projectId: opts.projectId,
    catalogPath: opts.catalogPath,
    vpMap: opts.viewpointsPath
      ? loadViewpoints(opts.viewpointsPath)
      : new Map<string, ReviewViewpoint>(),
    roleMap: loadRoles(opts.rolesPath),
    vpRef: opts.viewpointsPath ? repoRelativePath(opts.viewpointsPath) : '',
    templateCache: new Map<string, string>(),
  }
}

// Move a completed plan to exec/plans/done/ with a unique UTC + random suffix
// (same convention as event filenames), or delete it. The plan is regenerable
// from the catalog, so deletion is safe; the result remains as the record.
export function archivePlan(opts: {
  executionPath: string
  slug: string
  delete?: boolean
}): { from: string; to?: string; deleted: boolean } {
  const plansDir = join(opts.executionPath, 'exec', 'plans')
  const from = join(plansDir, `${opts.slug}-plan.md`)
  if (!existsSync(from)) throw new Error(`plan not found: ${from}`)

  if (opts.delete) {
    rmSync(from, { force: true })
    return { from, deleted: true }
  }

  const doneDir = join(plansDir, 'done')
  mkdirSync(doneDir, { recursive: true })
  const stamp = tsForFilenameUtc(nowUtcIsoSeconds())
  const to = join(doneDir, `${opts.slug}-${stamp}-${randomHex(2)}-plan.md`)
  renameSync(from, to)
  return { from, to, deleted: false }
}

export function planPathForTask(executionPath: string, taskId: string): string {
  return join(executionPath, 'exec', 'plans', `${taskId}-plan.md`)
}

export function loadPlan(executionPath: string, taskId: string): string | null {
  const planPath = planPathForTask(executionPath, taskId)
  if (existsSync(planPath)) return readFileSync(planPath, 'utf8')
  return null
}
