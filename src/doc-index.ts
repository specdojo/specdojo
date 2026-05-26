import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join, relative } from 'node:path'
import yaml from 'js-yaml'

export interface DocIndex {
  version: number
  // id → path  or  id → "path:line" (1-based line number)
  entries: Record<string, string>
}

export interface CollectFromSpec {
  field: string       // dot-separated path to the target field (arrays auto-expanded)
                      // e.g. "viewpoints", "groups.deliverables"
  id_field?: string   // field name for the document ID within each item (default: 'id')
  path_field?: string // field name for the referenced path within each item (default: 'path')
}

export interface NestedIdFile {
  file: string                   // relative to repo root
  collect_from: CollectFromSpec[]
}

export interface IndexConfig {
  nested_id_files?: NestedIdFile[]
}

const SKIP_DIRS = new Set(['node_modules', 'dist', '.vitepress', 'out'])
const FILE_RE = /\.(md|yaml|yml)$/
const DOC_ID_RE = /^[a-z][a-z0-9:_-]+$/

// ---- Markdown frontmatter ----------------------------------------------

function extractIdFromMarkdown(content: string): string | undefined {
  const fm = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!fm) return undefined
  const m = fm[1].match(/^id:\s*(.+)$/m)
  return m?.[1]?.trim()
}

// ---- YAML top-level id -------------------------------------------------

function extractTopLevelId(parsed: unknown): string | undefined {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return undefined
  const id = (parsed as Record<string, unknown>)['id']
  if (typeof id === 'string' && DOC_ID_RE.test(id)) return id
  return undefined
}

// ---- dot-path resolution (arrays auto-expanded) ------------------------

function resolveItems(obj: unknown, fieldPath: string[]): unknown[] {
  if (fieldPath.length === 0) {
    if (Array.isArray(obj)) return obj
    return obj !== undefined && obj !== null ? [obj] : []
  }
  if (Array.isArray(obj)) {
    return obj.flatMap(item => resolveItems(item, fieldPath))
  }
  if (!obj || typeof obj !== 'object') return []
  const [head, ...rest] = fieldPath
  return resolveItems((obj as Record<string, unknown>)[head], rest)
}

// ---- line number lookup ------------------------------------------------

function findIdLine(lines: string[], id: string, idKey: string = 'id'): number {
  const escaped = idKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`^\\s*(?:-\\s+)?${escaped}:\\s*(.+)$`)
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(re)
    if (m && m[1].trim() === id) {
      return i + 1 // 1-based
    }
  }
  return 1
}

// ---- nested id collection ----------------------------------------------

function collectFromFields(
  parsed: unknown,
  specs: CollectFromSpec[],
  fileRelPath: string,
  content: string,
  entries: Record<string, string>,
): void {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return
  const lines = content.split('\n')

  for (const spec of specs) {
    const idKey = spec.id_field ?? 'id'
    const pathKey = spec.path_field ?? 'path'
    const fieldPath = spec.field.split('.')
    const items = resolveItems(parsed, fieldPath)

    for (const item of items) {
      if (!item || typeof item !== 'object' || Array.isArray(item)) continue
      const itemRec = item as Record<string, unknown>
      const id = itemRec[idKey]
      if (typeof id !== 'string' || !DOC_ID_RE.test(id)) continue

      const pathVal = itemRec[pathKey]
      if (typeof pathVal === 'string' && pathVal.trim()) {
        // item has a path field → use it as the index target (no line number)
        entries[id] = pathVal.trim()
      } else {
        // no path → use file:line
        const lineNum = findIdLine(lines, id, idKey)
        entries[id] = `${fileRelPath}:${lineNum}`
      }
    }
  }
}

// ---- file scanning -----------------------------------------------------

function scanFile(
  fullPath: string,
  rootDir: string,
  repoRoot: string,
  entries: Record<string, string>,
  nestedMap: Map<string, CollectFromSpec[]>,
): void {
  // nestedMap keys are rootDir-relative; entry values are repoRoot-relative
  const scanRelPath = relative(rootDir, fullPath).replace(/\\/g, '/')
  const entryPath = relative(repoRoot, fullPath).replace(/\\/g, '/')
  const isYaml = !fullPath.endsWith('.md')
  try {
    const content = readFileSync(fullPath, 'utf8')
    if (isYaml) {
      const parsed = yaml.load(content)
      const topId = extractTopLevelId(parsed)
      if (topId) entries[topId] = entryPath
      const specs = nestedMap.get(scanRelPath)
      if (specs && specs.length > 0) {
        collectFromFields(parsed, specs, entryPath, content, entries)
      }
    } else {
      const id = extractIdFromMarkdown(content)
      if (id && DOC_ID_RE.test(id)) entries[id] = entryPath
    }
  } catch {
    // ignore unreadable / unparseable files
  }
}

function walkDir(
  dir: string,
  rootDir: string,
  repoRoot: string,
  entries: Record<string, string>,
  nestedMap: Map<string, CollectFromSpec[]>,
): void {
  let items: string[]
  try {
    items = readdirSync(dir)
  } catch {
    return
  }
  for (const item of items) {
    if (item.startsWith('.')) continue
    if (SKIP_DIRS.has(item) || item === 'generated') continue
    const full = join(dir, item)
    let st
    try {
      st = statSync(full)
    } catch {
      continue
    }
    if (st.isDirectory()) {
      walkDir(full, rootDir, repoRoot, entries, nestedMap)
    } else if (FILE_RE.test(item)) {
      scanFile(full, rootDir, repoRoot, entries, nestedMap)
    }
  }
}

// ---- config loading ----------------------------------------------------

const DEFAULT_CONFIG_REL = '.specdojo/index-config.yaml'

function loadIndexConfig(repoRoot: string, configPath?: string): IndexConfig {
  const p = join(repoRoot, configPath ?? DEFAULT_CONFIG_REL)
  if (!existsSync(p)) return {}
  try {
    const parsed = yaml.load(readFileSync(p, 'utf8'))
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as IndexConfig
    }
  } catch {
    // ignore
  }
  return {}
}

// ---- public API --------------------------------------------------------

export function buildDocIndex(
  rootDir: string,
  outputPath: string,
  repoRoot: string,
  configPath?: string,
): { count: number } {
  const config = loadIndexConfig(repoRoot, configPath)

  // Build nested map: scan-root-relative path → collect_from specs
  // Config `file` values are repo-root-relative; convert to scan-root-relative
  const nestedMap = new Map<string, CollectFromSpec[]>()
  for (const entry of config.nested_id_files ?? []) {
    if (entry.file && Array.isArray(entry.collect_from)) {
      const absPath = join(repoRoot, entry.file)
      const scanRelPath = relative(rootDir, absPath).replace(/\\/g, '/')
      nestedMap.set(scanRelPath, entry.collect_from)
    }
  }

  const entries: Record<string, string> = {}
  walkDir(rootDir, rootDir, repoRoot, entries, nestedMap)

  const index: DocIndex = {
    version: 1,
    entries,
  }

  const outDir = dirname(outputPath)
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })
  writeFileSync(outputPath, JSON.stringify(index, null, 2), 'utf8')
  return { count: Object.keys(entries).length }
}

export function lookupDocIndex(
  id: string,
  indexPath: string,
): string | undefined {
  if (!existsSync(indexPath)) return undefined
  const data = JSON.parse(readFileSync(indexPath, 'utf8')) as DocIndex
  return data.entries[id]
}
