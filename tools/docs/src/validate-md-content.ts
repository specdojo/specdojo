#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { load } from 'js-yaml'
import { remark } from 'remark'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import fg from 'fast-glob'
import type { Heading, Node, Root, Table, TableRow } from 'mdast'

// ── Schema types ────────────────────────────────────────────────────────────

type ColumnRule = {
  pattern?: string
  enum?: string[]
}

type TableSchema = {
  required_columns: string[]
  optional_columns?: string[]
  /** 各行で指定グループ内の列のうち少なくとも1つが "-" 以外の値を持つこと */
  at_least_one_of?: string[][]
  column_rules?: Record<string, ColumnRule>
}

type SectionSchema = {
  /** 許容する見出しテキスト。配列の場合は先頭が正準名。 */
  heading: string | string[]
  level: number
  number: number
  required: boolean
  table?: TableSchema
}

type ContentSchema = {
  id: string
  title: string
  /** 正準（英語）列名 → エイリアスの配列。エイリアスは正準名に正規化される。 */
  column_aliases?: Record<string, string[]>
  sections: SectionSchema[]
}

type ValidationError = {
  location: string
  message: string
}

// ── Markdown parsing ─────────────────────────────────────────────────────────

function parseMarkdown(content: string): Root {
  return remark().use(remarkFrontmatter).use(remarkGfm).parse(content) as Root
}

/** mdast ノードからプレーンテキストを再帰的に抽出する */
function extractText(node: Node): string {
  if ('value' in node && typeof node.value === 'string') return node.value
  if ('children' in node && Array.isArray(node.children)) {
    return (node.children as Node[]).map(extractText).join('')
  }
  return ''
}

// ── Section / table search ───────────────────────────────────────────────────

function primaryHeading(section: SectionSchema): string {
  return Array.isArray(section.heading) ? section.heading[0] : section.heading
}

function findHeadingIndex(children: Node[], section: SectionSchema): number {
  const candidates = (Array.isArray(section.heading) ? section.heading : [section.heading])
    .map(h => `${section.number}. ${h}`)
  for (let i = 0; i < children.length; i++) {
    const node = children[i]
    if (node.type !== 'heading') continue
    const h = node as Heading
    if (h.depth !== section.level) continue
    if (candidates.includes(extractText(h).trim())) return i
  }
  return -1
}

function findSectionEnd(children: Node[], startIndex: number, level: number): number {
  for (let i = startIndex + 1; i < children.length; i++) {
    const node = children[i]
    if (node.type === 'heading' && (node as Heading).depth <= level) return i
  }
  return children.length
}

function findTable(children: Node[], start: number, end: number): Table | null {
  for (let i = start; i < end; i++) {
    if (children[i].type === 'table') return children[i] as Table
  }
  return null
}

/** canonical → aliases[] を alias → canonical の逆引きマップに展開する */
function buildAliasMap(aliases: Record<string, string[]>): Record<string, string> {
  const map: Record<string, string> = {}
  for (const [canonical, aliasList] of Object.entries(aliases)) {
    for (const alias of aliasList) {
      map[alias] = canonical
    }
  }
  return map
}

/** テーブルのヘッダー列名を取得する。aliases があれば正準名に正規化する。 */
function getHeaders(table: Table, aliases: Record<string, string> = {}): string[] {
  if (table.children.length === 0) return []
  return table.children[0].children.map(cell => {
    const raw = extractText(cell as Node).trim()
    return aliases[raw] ?? raw
  })
}

function getDataRows(table: Table): TableRow[] {
  return table.children.slice(1)
}

function lineOf(node: Node): number {
  return node.position?.start.line ?? 0
}

// ── Validation ───────────────────────────────────────────────────────────────

function validateTable(
  filePath: string,
  table: Table,
  schema: TableSchema,
  aliases: Record<string, string>,
  errors: ValidationError[]
): void {
  const headers = getHeaders(table, aliases)
  const headerSet = new Set(headers)

  // 必須列の存在確認
  for (const col of schema.required_columns) {
    if (!headerSet.has(col)) {
      errors.push({ location: filePath, message: `必須列 "${col}" がテーブルにありません` })
    }
  }

  // 未定義列の検出
  const knownColumns = new Set([
    ...schema.required_columns,
    ...(schema.optional_columns ?? []),
  ])
  for (const h of headers) {
    if (!knownColumns.has(h)) {
      errors.push({ location: filePath, message: `スキーマ未定義の列 "${h}" があります` })
    }
  }

  const rules = schema.column_rules ?? {}
  const atLeastOneOf = schema.at_least_one_of ?? []

  for (const row of getDataRows(table)) {
    const line = lineOf(row)
    const loc = `${filePath}:${line}`

    // 各セルの値を列名でマップ
    const cellValues: Record<string, string> = {}
    for (let i = 0; i < headers.length; i++) {
      const cell = row.children[i]
      cellValues[headers[i]] = cell ? extractText(cell as Node).trim() : ''
    }

    const rowId = cellValues['ID'] ?? `行${line}`

    // 列値のルールチェック
    for (const [colName, rule] of Object.entries(rules)) {
      const value = cellValues[colName]
      if (value === undefined) continue

      if (rule.enum !== undefined && !rule.enum.includes(value)) {
        errors.push({
          location: loc,
          message: `${rowId}: 列 "${colName}" の値 "${value}" は無効です（許容値: ${rule.enum.join(' | ')}）`,
        })
      }

      if (rule.pattern !== undefined) {
        const re = new RegExp(rule.pattern)
        if (!re.test(value)) {
          errors.push({
            location: loc,
            message: `${rowId}: 列 "${colName}" の値 "${value}" がパターン ${rule.pattern} に一致しません`,
          })
        }
      }
    }

    // at_least_one_of チェック
    for (const group of atLeastOneOf) {
      const hasValue = group.some(col => {
        const v = cellValues[col]
        return v !== undefined && v !== '-' && v !== ''
      })
      if (!hasValue) {
        errors.push({
          location: loc,
          message: `${rowId}: [${group.join(', ')}] のうち少なくとも1列に値が必要です`,
        })
      }
    }
  }
}

function validateFile(filePath: string, schema: ContentSchema): ValidationError[] {
  const content = readFileSync(resolve(filePath), 'utf8')
  const root = parseMarkdown(content)
  const children = root.children as Node[]
  const errors: ValidationError[] = []
  const aliases = buildAliasMap(schema.column_aliases ?? {})

  for (const section of schema.sections) {
    const headingIndex = findHeadingIndex(children, section)

    if (headingIndex === -1) {
      if (section.required) {
        errors.push({
          location: filePath,
          message: `必須セクション "${section.number}. ${primaryHeading(section)}" が見つかりません`,
        })
      }
      continue
    }

    if (!section.table) continue

    const sectionEnd = findSectionEnd(children, headingIndex, section.level)
    const table = findTable(children, headingIndex + 1, sectionEnd)

    if (!table) {
      errors.push({
        location: filePath,
        message: `セクション "${section.number}. ${primaryHeading(section)}" にテーブルがありません`,
      })
      continue
    }

    validateTable(filePath, table, section.table, aliases, errors)
  }

  return errors
}

// ── CLI ──────────────────────────────────────────────────────────────────────

function parseArgs(): { schemaPath: string; patterns: string[] } {
  const args = process.argv.slice(2)
  let schemaPath = ''
  const patterns: string[] = []

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--schema') {
      schemaPath = args[++i] ?? ''
    } else if (args[i] === '--data') {
      const p = args[++i]
      if (p) patterns.push(p)
    } else {
      patterns.push(args[i])
    }
  }

  if (!schemaPath) {
    throw new Error(
      'Usage: tsx validate-md-content.ts --schema <schema.yaml> --data <glob>'
    )
  }
  if (patterns.length === 0) {
    throw new Error('--data <glob> が必要です')
  }
  return { schemaPath, patterns }
}

function main(): void {
  const { schemaPath, patterns } = parseArgs()
  const schema = load(readFileSync(resolve(schemaPath), 'utf8')) as ContentSchema

  const files = fg
    .sync(patterns, { absolute: false, onlyFiles: true })
    .sort((a, b) => a.localeCompare(b))

  if (files.length === 0) {
    console.warn(`警告: ファイルが見つかりません: ${patterns.join(', ')}`)
    return
  }

  let hasError = false

  for (const filePath of files) {
    const errors = validateFile(filePath, schema)
    if (errors.length === 0) {
      console.log(`${filePath}: valid`)
      continue
    }
    hasError = true
    console.error(`${filePath}: invalid`)
    for (const err of errors) {
      console.error(`  - ${err.location}: ${err.message}`)
    }
  }

  if (hasError) process.exitCode = 1
}

main()
