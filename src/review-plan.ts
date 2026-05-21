import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import yaml from 'js-yaml'
import { specdojoRootDir } from './specdojo-config.js'
import type { DctDeliverableItem, DctDoc, DctSection } from './catalog-types.js'
import type {
  MachineCheck,
  ReviewItem,
  ReviewPlanDoc,
  ReviewStage,
  ReviewViewpoint,
  ReviewViewpointsDoc,
} from './review-types.js'

type DeliverableLocation = {
  deliverable: DctDeliverableItem
  catalogFile: string
  basePath: string
}

function joinBasePath(parent: string, child: string | undefined): string {
  if (!child) return parent
  if (child.startsWith('/')) return child
  return parent ? `${parent}/${child}` : `/${child}`
}

function searchSections(
  sections: DctSection[],
  parentBase: string,
  localId: string
): { deliverable: DctDeliverableItem; basePath: string } | null {
  for (const section of sections) {
    const sectionBase = joinBasePath(parentBase, section.base_path)
    for (const d of section.deliverables ?? []) {
      if (d.local_id === localId) return { deliverable: d, basePath: sectionBase }
    }
    const found = searchSections(section.groups ?? [], sectionBase, localId)
    if (found) return found
  }
  return null
}

export function findDeliverable(
  catalogPath: string,
  localId: string
): DeliverableLocation | null {
  const files = readdirSync(catalogPath)
    .filter(f => /^dct-.+\.yaml$/.test(f))
    .sort()

  for (const f of files) {
    const filePath = join(catalogPath, f)
    const doc = yaml.load(readFileSync(filePath, 'utf8')) as DctDoc
    const result = searchSections(doc.groups, doc.base_path ?? '', localId)
    if (result) {
      return {
        deliverable: result.deliverable,
        catalogFile: filePath,
        basePath: result.basePath,
      }
    }
  }
  return null
}

function repoRelativePath(absPath: string): string {
  const rel = relative(specdojoRootDir(), absPath)
  return rel.startsWith('/') ? rel : `/${rel}`
}

function machineChecks(deliverablePath: string | undefined): MachineCheck[] {
  const isYaml = deliverablePath?.endsWith('.yaml') ?? false
  return [
    { name: 'lint:md', required: !isYaml },
    { name: 'schema', required: isYaml },
  ]
}

export function generateReviewPlan(opts: {
  catalogPath: string
  viewpointsPath: string
  localId: string
  stage: ReviewStage
  roleFilter: string | undefined
  projectId: string
}): ReviewPlanDoc {
  const { catalogPath, viewpointsPath, localId, stage, roleFilter, projectId } = opts

  const location = findDeliverable(catalogPath, localId)
  if (!location) {
    throw new Error(
      `Deliverable '${localId}' not found in catalogs under: ${catalogPath}`
    )
  }

  const { deliverable, catalogFile, basePath } = location
  const criteria = (deliverable.done_criteria ?? []).filter(
    c => !roleFilter || c.roles.includes(roleFilter)
  )

  if (criteria.length === 0) {
    const roleMsg = roleFilter ? ` for role '${roleFilter}'` : ''
    throw new Error(`No done_criteria found for '${localId}'${roleMsg}`)
  }

  if (!existsSync(viewpointsPath)) {
    throw new Error(
      `viewpoints_path not found: ${viewpointsPath}\n` +
        `Run: specdojo review scaffold --project <id>`
    )
  }

  const vpDoc = yaml.load(readFileSync(viewpointsPath, 'utf8')) as ReviewViewpointsDoc
  const vpMap = new Map<string, ReviewViewpoint>(vpDoc.viewpoints.map(vp => [vp.id, vp]))

  const reviewItems: ReviewItem[] = criteria.map((c, i) => {
    const vp = vpMap.get(c.viewpoint)
    return {
      id: `RVP-${String(i + 1).padStart(3, '0')}`,
      role: c.roles[0],
      viewpoint_id: c.viewpoint,
      done_criterion: c.text,
      coverage_required: vp?.coverage_types ?? [],
      evidence_required: ['target_document', 'deliverable_catalog'],
      expected_output: ['result', 'evidence', 'findings', 'unverified_scope'],
    }
  })

  const targetPath = deliverable.path
    ? `${basePath}/${deliverable.path}`
    : basePath

  return {
    id: `rvp-${localId}-${stage}`,
    project_id: projectId,
    target: {
      local_id: localId,
      path: targetPath,
      stage,
      version_ref: 'none',
    },
    inputs: {
      deliverable_catalog: repoRelativePath(catalogFile),
      rulebook: deliverable.rulebook ?? 'none',
      viewpoints: repoRelativePath(viewpointsPath),
      related_documents: [],
    },
    machine_checks_required: machineChecks(deliverable.path),
    review_items: reviewItems,
  }
}

export function expandViewpointsDoc(
  templatePath: string,
  projectId: string
): Record<string, unknown> {
  const template = yaml.load(readFileSync(templatePath, 'utf8')) as Record<string, unknown>
  return {
    ...template,
    id: `${projectId}:pm-review-viewpoints`,
    type: 'project',
    project_id: projectId,
  }
}

export function scaffoldViewpoints(opts: {
  templatePath: string
  projectId: string
  outputPath: string
  force: boolean
}): { written: boolean; skipped: boolean } {
  const { templatePath, projectId, outputPath, force } = opts

  if (existsSync(outputPath) && !force) {
    return { written: false, skipped: true }
  }

  const doc = expandViewpointsDoc(templatePath, projectId)

  const dir = outputPath.includes('/') ? outputPath.slice(0, outputPath.lastIndexOf('/')) : '.'
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

  writeFileSync(outputPath, yaml.dump(doc, { lineWidth: 120, noRefs: true }), 'utf8')
  return { written: true, skipped: false }
}

export function writeReviewPlan(opts: {
  reviewsPath: string
  plan: ReviewPlanDoc
  force: boolean
  dryRun: boolean
}): { outputPath: string; skipped: boolean } {
  const { reviewsPath, plan, force, dryRun } = opts
  const plansDir = join(reviewsPath, 'plans')
  const outputPath = join(plansDir, `${plan.id}.yaml`)

  if (!dryRun && existsSync(outputPath) && !force) {
    return { outputPath, skipped: true }
  }

  const outYaml = yaml.dump(plan, { lineWidth: 120, noRefs: true })

  if (dryRun) {
    process.stdout.write(outYaml)
    return { outputPath, skipped: false }
  }

  if (!existsSync(plansDir)) mkdirSync(plansDir, { recursive: true })
  writeFileSync(outputPath, outYaml, 'utf8')
  return { outputPath, skipped: false }
}
