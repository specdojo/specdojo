#!/usr/bin/env node

import { readFileSync, readdirSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { load } from 'js-yaml'
import fg from 'fast-glob'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import Ajv2020 from 'ajv/dist/2020'
import { scaffoldDoc } from '../../../src/catalog-scaffold.js'
import type { ProjectSize } from '../../../src/catalog-scaffold.js'
import type { DctTemplateDoc } from '../../../src/catalog-types.js'
import { expandViewpointsDoc } from '../../../src/review-plan.js'

type JsonObject = Record<string, unknown>

type SubstitutionRule = {
  kind: 'md-frontmatter' | 'yaml'
  pattern: string
  schema: string
  substitutions: Array<[string, string]>
}

// scaffoldDoc() を呼んで展開した DctDoc を dct.schema.yaml で検証する
type DctScaffoldRule = {
  kind: 'dct-scaffold'
  pattern: string
  schema: string
  projectId: string
  size: ProjectSize
}

// expandViewpointsDoc() を呼んで展開した doc を pm-review-viewpoints.schema.yaml で検証する
type ReviewScaffoldRule = {
  kind: 'review-scaffold'
  pattern: string
  schema: string
  projectId: string
}

type TemplateRule = SubstitutionRule | DctScaffoldRule | ReviewScaffoldRule

const RULES: TemplateRule[] = [
  {
    kind: 'dct-scaffold',
    pattern: 'docs/ja/specdojo/templates/dct-*-template.yaml',
    schema: 'docs/specdojo/schemas/v1/dct.schema.yaml',
    projectId: 'prj-0001',
    size: 'large',
  },
  {
    kind: 'md-frontmatter',
    pattern: 'docs/ja/specdojo/templates/pjr-*-template.md',
    schema: 'docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml',
    substitutions: [['_PRJ-0000_:_PJR-XXXX_', 'prj-test-0001:pjr-0001']],
  },
  {
    kind: 'review-scaffold',
    pattern: 'docs/ja/specdojo/templates/pm-review-viewpoints-template.yaml',
    schema: 'docs/specdojo/schemas/v1/pm-review-viewpoints.schema.yaml',
    projectId: 'prj-0001',
  },
]

function extractFrontmatter(content: string, filePath: string): string {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) throw new Error(`frontmatter が見つかりません: ${filePath}`)
  return match[1]
}

function applySubstitutions(
  text: string,
  substitutions: Array<[string, string]>
): string {
  return substitutions.reduce((acc, [from, to]) => acc.replaceAll(from, to), text)
}

function buildValidator(schemaPath: string) {
  const schema = load(readFileSync(resolve(schemaPath), 'utf8')) as JsonObject
  const schemaUri = typeof schema.$schema === 'string' ? schema.$schema : ''
  const ajv = schemaUri.includes('draft/2020-12/')
    ? new Ajv2020({ allErrors: true, strict: false })
    : new Ajv({ allErrors: true, strict: false })
  addFormats(ajv)

  const schemaDir = dirname(resolve(schemaPath))
  const currentName = basename(schemaPath)
  for (const entry of readdirSync(schemaDir)) {
    if (!entry.endsWith('.schema.yaml') || entry === currentName) continue
    const sibling = load(readFileSync(join(schemaDir, entry), 'utf8')) as JsonObject
    ajv.addSchema(sibling, entry)
  }

  return ajv.compile(schema)
}

function expandData(rule: TemplateRule, filePath: string): JsonObject {
  const raw = readFileSync(resolve(filePath), 'utf8')

  if (rule.kind === 'dct-scaffold') {
    const template = load(raw) as DctTemplateDoc
    return scaffoldDoc(template, rule.projectId, rule.size) as unknown as JsonObject
  }

  if (rule.kind === 'review-scaffold') {
    return expandViewpointsDoc(resolve(filePath), rule.projectId) as JsonObject
  }

  const target = rule.kind === 'md-frontmatter' ? extractFrontmatter(raw, filePath) : raw
  return load(applySubstitutions(target, rule.substitutions)) as JsonObject
}

function validateRule(rule: TemplateRule): boolean {
  const validate = buildValidator(rule.schema)

  const files = fg
    .sync(rule.pattern, { absolute: false, onlyFiles: true })
    .sort((a, b) => a.localeCompare(b))

  if (files.length === 0) {
    console.warn(`警告: テンプレートが見つかりません: ${rule.pattern}`)
    return false
  }

  let hasError = false

  for (const filePath of files) {
    let data: JsonObject
    try {
      data = expandData(rule, filePath)
    } catch (err) {
      console.error(
        `${filePath}: エラー - ${err instanceof Error ? err.message : String(err)}`
      )
      hasError = true
      continue
    }

    const valid = validate(data)
    if (valid) {
      console.log(`${filePath}: valid`)
      continue
    }

    hasError = true
    console.error(`${filePath}: invalid`)
    for (const error of validate.errors ?? []) {
      console.error(`  - ${error.instancePath || '/'}: ${error.message ?? 'validation error'}`)
    }
  }

  return hasError
}

function main(): void {
  let hasError = false
  for (const rule of RULES) {
    if (validateRule(rule)) hasError = true
  }
  if (hasError) process.exitCode = 1
}

main()
