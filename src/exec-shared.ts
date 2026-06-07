import { randomBytes } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { basename, join, relative } from 'node:path'
import yaml from 'js-yaml'
import { specdojoRootDir } from './specdojo-config.js'

export function nowUtcIsoSeconds(): string {
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')
}

export function isUtcIsoSeconds(ts: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(ts)
}

export function tsForFilenameUtc(ts: string): string {
  return ts.replace(/[-:]/g, '').replace('T', 'T')
}

export function safeSlug(s: string): string {
  return s
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^A-Za-z0-9._-]/g, '_')
    .slice(0, 80)
}

export function randomHex(bytes: number): string {
  return randomBytes(bytes).toString('hex')
}

export function ensureDir(path: string): void {
  if (!existsSync(path)) mkdirSync(path, { recursive: true })
}

export function requireNonEmpty(name: string, v: unknown): string {
  if (typeof v !== 'string' || v.trim().length === 0) throw new Error(`${name} is required`)
  return v.trim()
}

export function collectRepeatable(value: string, previous: string[]): string[] {
  return previous.concat([value])
}

export function expandTemplate(template: string, values: Record<string, string>): string {
  let result = template
  for (const [placeholder, value] of Object.entries(values)) {
    result = result.split(placeholder).join(value)
  }
  return result
}

export function parseKeyValuePairs(
  pairs: string[] | undefined
): Record<string, string> | undefined {
  if (!pairs || pairs.length === 0) return undefined
  const out: Record<string, string> = {}
  for (const p of pairs) {
    const idx = p.indexOf('=')
    if (idx <= 0) throw new Error(`Invalid key=value: ${p}`)
    const k = p.slice(0, idx).trim()
    const v = p.slice(idx + 1).trim()
    if (!k) throw new Error(`Empty key in: ${p}`)
    out[k] = v
  }
  return Object.keys(out).length ? out : undefined
}

export function listFilesRecursive(dir: string): string[] {
  const out: string[] = []
  if (!existsSync(dir)) return out
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) out.push(...listFilesRecursive(full))
    else if (st.isFile()) out.push(full)
  }
  return out
}

export function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, 'utf8'))
}

export function writeJson(path: string, data: unknown): void {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf8')
}

export function readYaml(path: string): unknown {
  return yaml.load(readFileSync(path, 'utf8'))
}

export function isSchYamlFilename(path: string): boolean {
  const name = basename(path)
  return /^sch-.*\.(yaml|yml)$/.test(name)
}

export function sleepMs(ms: number): void {
  const sab = new SharedArrayBuffer(4)
  const int32 = new Int32Array(sab)
  Atomics.wait(int32, 0, 0, ms)
}

export function toPortablePath(path: string): string {
  return path.replace(/\\/g, '/')
}

export function toArtifactPath(path: string): string {
  const rel = relative(specdojoRootDir(), path)
  return toPortablePath(rel || '.')
}

export function toScheduleFilePath(schedulePath: string, filePath: string): string {
  return toPortablePath(relative(schedulePath, filePath) || '.')
}

export function formatDateOnlyUtc(dt: Date): string {
  const yyyy = dt.getUTCFullYear().toString().padStart(4, '0')
  const mm = (dt.getUTCMonth() + 1).toString().padStart(2, '0')
  const dd = dt.getUTCDate().toString().padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function normalizeDateOnly(value: unknown): string | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return formatDateOnlyUtc(value)
  if (typeof value !== 'string') return null

  const trimmed = value.trim()
  if (!trimmed) return null
  const m = trimmed.match(/^(\d{4}-\d{2}-\d{2})/)
  if (m) return m[1]

  const dt = new Date(trimmed)
  if (Number.isNaN(dt.getTime())) return null
  return formatDateOnlyUtc(dt)
}
