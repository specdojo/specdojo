import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import yaml from 'js-yaml'
import type {
  DctDeliverableItem,
  DctDoc,
  DctSection,
  DctValidationResult,
} from './catalog-types.js'

// leading "/" = absolute from repo root (strip "/"); otherwise join with parent
function resolveBasePath(parentBase: string, childBase: string | undefined): string {
  if (!childBase) return parentBase
  if (childBase.startsWith('/')) return childBase.slice(1)
  return parentBase ? `${parentBase}/${childBase}` : childBase
}

function formatDependsOn(deps: string[] | undefined): string {
  if (!deps || deps.length === 0) return '-'
  return deps.map(d => `\`${d}\``).join(', ')
}

function renderTable(deliverables: DctDeliverableItem[]): string[] {
  const lines: string[] = []
  lines.push('| local-id | 成果物名 | 種別 | 根拠 | 概要 |')
  lines.push('| --- | --- | --- | --- | --- |')
  for (const item of deliverables) {
    const localId = `\`${item.local_id}\``
    const deps = formatDependsOn(item.depends_on)
    lines.push(`| ${localId} | ${item.name} | ${item.kind} | ${deps} | ${item.overview} |`)
  }
  return lines
}

function renderDoneCriteria(deliverables: DctDeliverableItem[]): string[] {
  const lines: string[] = []
  for (const item of deliverables) {
    if (item.kind !== 'work' || !item.done_criteria || item.done_criteria.length === 0) continue
    lines.push('')
    lines.push(`**\`${item.local_id}\`** の完了条件:`)
    lines.push('')
    for (const criterion of item.done_criteria) {
      lines.push(`- ${criterion.text}`)
    }
  }
  return lines
}

function renderSections(
  sections: DctSection[],
  parentBase: string,
  depth: number,
  prefix: number[]
): string[] {
  const lines: string[] = []
  const hashes = '#'.repeat(depth + 1)
  let counter = 0

  for (const section of sections) {
    const sectionBase = resolveBasePath(parentBase, section.base_path)

    if (!section.name) {
      // Unnamed section: output content without heading
      if (section.base_path) {
        lines.push('')
        lines.push(`- 配置先: \`${sectionBase}\``)
      }
      if (section.note) {
        lines.push('')
        lines.push(section.note)
      }
      if (section.deliverables && section.deliverables.length > 0) {
        lines.push('')
        lines.push(...renderTable(section.deliverables))
        lines.push(...renderDoneCriteria(section.deliverables))
      }
      if (section.groups && section.groups.length > 0) {
        lines.push(...renderSections(section.groups, sectionBase, depth, prefix))
      }
      continue
    }

    counter++
    const nums = [...prefix, counter]
    const numStr = nums.join('.')

    lines.push('')
    lines.push(`${hashes} ${numStr}. ${section.name}`)

    if (section.base_path) {
      lines.push('')
      lines.push(`- 配置先: \`${sectionBase}\``)
    }

    if (section.note) {
      lines.push('')
      lines.push(section.note)
    }

    if (section.deliverables && section.deliverables.length > 0) {
      lines.push('')
      lines.push(...renderTable(section.deliverables))
      lines.push(...renderDoneCriteria(section.deliverables))
    }

    if (section.groups && section.groups.length > 0) {
      lines.push(...renderSections(section.groups, sectionBase, depth + 1, nums))
    }
  }

  return lines
}

function buildFrontmatter(doc: DctDoc): string[] {
  const lines: string[] = ['---']
  lines.push(`id: ${doc.id}`)
  lines.push(`type: ${doc.type}`)
  lines.push(`status: ${doc.status}`)
  if (doc.part_of && doc.part_of.length > 0) {
    lines.push('part_of:')
    for (const p of doc.part_of) {
      const val = p.includes(':') ? `'${p}'` : p
      lines.push(`  - ${val}`)
    }
  }
  lines.push('rulebook: dct-rulebook')
  lines.push('---')
  return lines
}

export function buildMarkdown(doc: DctDoc): string {
  const lines: string[] = []

  lines.push(...buildFrontmatter(doc))
  lines.push('')
  lines.push(`# 成果物カタログ: ${doc.domain}`)
  lines.push('')
  lines.push(`- project-id: \`${doc.project_id}\``)
  lines.push(`- ドメイン: \`${doc.domain}\``)

  const topBase = resolveBasePath('', doc.base_path)
  lines.push(...renderSections(doc.groups, topBase, 1, []))
  lines.push('')

  return lines.join('\n')
}

export function validateDctDoc(doc: DctDoc, filePath: string): DctValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!doc.id) errors.push(`${filePath}: missing required field: id`)
  if (doc.type !== 'project') errors.push(`${filePath}: type must be 'project', got: ${doc.type}`)
  if (!['draft', 'ready', 'deprecated'].includes(doc.status)) {
    errors.push(`${filePath}: invalid status: ${doc.status}`)
  }
  if (!doc.project_id) errors.push(`${filePath}: missing required field: project_id`)
  if (!doc.domain) errors.push(`${filePath}: missing required field: domain`)
  if (!doc.groups || !Array.isArray(doc.groups) || doc.groups.length === 0) {
    errors.push(`${filePath}: groups must be a non-empty array`)
  }

  const localIds = new Set<string>()

  function collectIds(sections: DctSection[]): void {
    for (const section of sections) {
      if (section.deliverables) {
        for (const item of section.deliverables) {
          if (localIds.has(item.local_id)) {
            errors.push(`${filePath}: duplicate local_id: ${item.local_id}`)
          } else {
            localIds.add(item.local_id)
          }
          if (item.kind === 'work') {
            if (!item.path) errors.push(`${filePath}: ${item.local_id}: kind:work requires path`)
            if (!item.done_criteria || item.done_criteria.length === 0) {
              errors.push(`${filePath}: ${item.local_id}: kind:work requires done_criteria`)
            }
          }
        }
      }
      if (section.groups) collectIds(section.groups)
    }
  }

  if (doc.groups) collectIds(doc.groups)

  function checkDeps(sections: DctSection[]): void {
    for (const section of sections) {
      if (section.deliverables) {
        for (const item of section.deliverables) {
          if (item.depends_on) {
            for (const dep of item.depends_on) {
              if (!localIds.has(dep)) {
                warnings.push(
                  `${filePath}: ${item.local_id}: depends_on '${dep}' not found in this file`
                )
              }
            }
          }
        }
      }
      if (section.groups) checkDeps(section.groups)
    }
  }

  if (doc.groups) checkDeps(doc.groups)

  return { ok: errors.length === 0, errors, warnings }
}

export function buildCatalog(catalogPath: string): { generated: string[]; errors: string[] } {
  const outputDir = join(catalogPath, 'generated')
  mkdirSync(outputDir, { recursive: true })

  const generated: string[] = []
  const errors: string[] = []

  const files = readdirSync(catalogPath)
    .filter(f => /^dct-.+\.yaml$/.test(f))
    .sort()

  for (const f of files) {
    const filePath = join(catalogPath, f)
    try {
      const raw = readFileSync(filePath, 'utf8')
      const doc = yaml.load(raw) as DctDoc
      const validation = validateDctDoc(doc, filePath)
      if (!validation.ok) {
        errors.push(...validation.errors)
        continue
      }
      const md = buildMarkdown(doc)
      const outName = basename(f, '.yaml') + '.md'
      const outPath = join(outputDir, outName)
      writeFileSync(outPath, md, 'utf8')
      generated.push(outPath)
    } catch (err) {
      errors.push(`${filePath}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  return { generated, errors }
}
