import { readFileSync, readdirSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { load } from 'js-yaml'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import Ajv2020 from 'ajv/dist/2020'

type JsonObject = Record<string, unknown>

export function buildValidator(schemaPath: string) {
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

export function formatErrors(errors: unknown): string {
  if (!Array.isArray(errors)) return 'validation error'
  return (errors as Array<{ instancePath?: string; message?: string }>)
    .map(e => `${e.instancePath || '/'}: ${e.message ?? 'validation error'}`)
    .join('\n')
}
