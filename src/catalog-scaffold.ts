import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import yaml from 'js-yaml'
import type { DctDeliverableItem, DctDoc, DctSection, DctTemplateDoc } from './catalog-types.js'

export type ProjectSize = 'small' | 'medium' | 'large'

// js-yaml serializes all non-empty arrays in block style.
// Restore flow style for the `roles` field to match template formatting.
function applyFlowStyleRoles(yamlStr: string): string {
  return yamlStr.replace(
    /^(\s+roles):\n(\s+- [^\n]+\n)+/gm,
    (match, rolesPrefix) => {
      const items = [...match.matchAll(/^\s+- (.+)$/gm)].map(m => m[1].trim())
      return `${rolesPrefix}: [${items.join(', ')}]\n`
    }
  )
}

const SIZE_ORDER: Record<ProjectSize, number> = { small: 0, medium: 1, large: 2 }

function meetsSize(minSize: string | undefined, target: ProjectSize): boolean {
  if (!minSize) return true
  return (SIZE_ORDER[minSize as ProjectSize] ?? 0) <= SIZE_ORDER[target]
}

function filterDeliverable(item: DctDeliverableItem): DctDeliverableItem {
  const { min_size: _ms, ...rest } = item
  return rest
}

function filterSection(section: DctSection, size: ProjectSize): DctSection | null {
  if (!meetsSize(section.min_size, size)) return null

  const { min_size: _ms, ...rest } = section

  const result: DctSection = {}
  if (rest.name !== undefined) result.name = rest.name
  if (rest.base_path !== undefined) result.base_path = rest.base_path
  if (rest.note !== undefined) result.note = rest.note

  if (rest.deliverables) {
    const deliverables = rest.deliverables
      .filter(d => meetsSize(d.min_size, size))
      .map(filterDeliverable)
    if (deliverables.length > 0) result.deliverables = deliverables
  }

  if (rest.groups) {
    const groups = rest.groups
      .map(g => filterSection(g, size))
      .filter((g): g is DctSection => g !== null)
    if (groups.length > 0) result.groups = groups
  }

  if (!result.deliverables && !result.groups) return null

  return result
}

// Extract project_id from resolved catalog path (e.g. .../projects/prj-0001/...)
export function deriveProjectId(catalogPath: string): string | null {
  const m = catalogPath.match(/\/projects\/([^/]+)\//)
  return m ? m[1] : null
}

export function scaffoldDoc(template: DctTemplateDoc, projectId: string, size: ProjectSize): DctDoc {
  const PLACEHOLDER = '_PRJ-0000_'
  const replace = (s: string) => s.replaceAll(PLACEHOLDER, projectId)

  const groups = template.groups
    .map(g => filterSection(g, size))
    .filter((g): g is DctSection => g !== null)

  const doc: DctDoc = {
    id: `${projectId}:${template.id.replace(/-template$/, '')}`,
    type: 'project',
    status: template.status,
    ...(template.part_of && template.part_of.length > 0
      ? { part_of: template.part_of.map(replace) }
      : {}),
    project_id: projectId,
    domain: template.domain,
    ...(template.domain_code ? { domain_code: template.domain_code } : {}),
    ...(template.base_path ? { base_path: replace(template.base_path) } : {}),
    groups,
  }

  return doc
}

export function runScaffold(opts: {
  catalogPath: string
  templatesPath: string
  size: ProjectSize
  projectId: string | null
  force: boolean
}): { written: string[]; skipped: string[]; errors: string[] } {
  const { catalogPath, templatesPath, size, force } = opts
  const written: string[] = []
  const skipped: string[] = []
  const errors: string[] = []

  const projectId = opts.projectId ?? deriveProjectId(catalogPath)
  if (!projectId) {
    errors.push(
      `Cannot derive project_id from catalog_path: ${catalogPath}\n` +
        `Use --project-id <id> to specify it explicitly.`
    )
    return { written, skipped, errors }
  }

  mkdirSync(catalogPath, { recursive: true })

  const templateFiles = readdirSync(templatesPath)
    .filter(f => /^dct-.+\.yaml$/.test(f))
    .sort()

  if (templateFiles.length === 0) {
    errors.push(`No dct-*.yaml template files found in: ${templatesPath}`)
    return { written, skipped, errors }
  }

  for (const f of templateFiles) {
    const templatePath = join(templatesPath, f)
    const outputFilename = f.replace(/-template(\.yaml)$/, '$1')
    const outputPath = join(catalogPath, outputFilename)

    if (existsSync(outputPath) && !force) {
      skipped.push(outputPath)
      continue
    }

    try {
      const raw = readFileSync(templatePath, 'utf8')
      const template = yaml.load(raw) as DctTemplateDoc
      const scaffolded = scaffoldDoc(template, projectId, size)
      const out = yaml.dump(scaffolded, {
        lineWidth: 120,
        noRefs: true,
        quotingType: "'",
        forceQuotes: false,
      })
      writeFileSync(outputPath, applyFlowStyleRoles(out), 'utf8')
      written.push(outputPath)
    } catch (err) {
      errors.push(`${templatePath}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  return { written, skipped, errors }
}
