#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { remark } from 'remark'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import fg from 'fast-glob'
import type { Point, Position } from 'unist'
import remarkMdContent from './remark-md-content.js'

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
    throw new Error('Usage: tsx validate-md-content.ts --schema <schema.yaml> --data <glob>')
  }
  if (patterns.length === 0) {
    throw new Error('--data <glob> が必要です')
  }
  return { schemaPath, patterns }
}

function startLine(place: Point | Position | null | undefined): number {
  if (!place) return 0
  return 'start' in place ? place.start.line : place.line
}

function main(): void {
  const { schemaPath, patterns } = parseArgs()

  const processor = remark()
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(remarkMdContent, {
      schemas: { [schemaPath]: ['**'] },
    })

  const files = fg
    .sync(patterns, { absolute: false, onlyFiles: true })
    .sort((a, b) => a.localeCompare(b))

  if (files.length === 0) {
    console.warn(`警告: ファイルが見つかりません: ${patterns.join(', ')}`)
    return
  }

  let hasError = false

  for (const filePath of files) {
    const content = readFileSync(resolve(filePath), 'utf8')
    const vfile = processor.processSync({ value: content, path: resolve(filePath) })

    if (vfile.messages.length === 0) {
      console.log(`${filePath}: valid`)
      continue
    }

    hasError = true
    console.error(`${filePath}: invalid`)
    for (const msg of vfile.messages) {
      const line = startLine(msg.place ?? undefined)
      console.error(`  - ${filePath}:${line}: ${msg.reason}`)
    }
  }

  if (hasError) process.exitCode = 1
}

main()
