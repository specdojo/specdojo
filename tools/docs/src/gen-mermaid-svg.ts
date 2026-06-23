import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'
import * as crypto from 'crypto'
import { fileURLToPath } from 'url'

const DEFAULT_ROOT = path.resolve('docs')
const DEFAULT_OUT_DIR = path.resolve('public', 'mermaid')
const PUPPETEER_CONFIG = path.resolve('puppeteer-config.json')
const MERMAID_CONFIG = path.resolve('mermaid-config.json')

// ファイル単位の差分判定キャッシュ。outDir 配下に置き、生成済み SVG と一緒に gitignore される。
const MANIFEST_FILE = '.manifest.json'
const MANIFEST_VERSION = 1
const SVG_NAME_PATTERN = /^[0-9a-f]{8}\.svg$/

interface ManifestEntry {
  mtimeMs: number
  size: number
  hashes: string[]
}

interface Manifest {
  version: number
  files: Record<string, ManifestEntry>
}

/**
 * Mermaidコードの内容からハッシュを作って、SVGファイル名に使う
 * → 同じコードなら同じSVGを使い回せる
 */
function hashCode(code: string): string {
  return crypto.createHash('md5').update(code).digest('hex').slice(0, 8)
}

function svgPathFor(outDir: string, id: string): string {
  return path.join(outDir, `${id}.svg`)
}

function manifestPath(outDir: string): string {
  return path.join(outDir, MANIFEST_FILE)
}

function loadManifest(outDir: string): Manifest {
  try {
    const raw = fs.readFileSync(manifestPath(outDir), 'utf8')
    const parsed = JSON.parse(raw) as Partial<Manifest>
    if (parsed.version === MANIFEST_VERSION && parsed.files && typeof parsed.files === 'object') {
      return { version: MANIFEST_VERSION, files: parsed.files }
    }
  } catch {
    // 未生成・破損時はフルスキャンにフォールバックする
  }
  return { version: MANIFEST_VERSION, files: {} }
}

function saveManifest(outDir: string, manifest: Manifest): void {
  fs.mkdirSync(outDir, { recursive: true })
  // ファイル順を固定して差分を安定させる
  const files = Object.keys(manifest.files)
    .sort()
    .reduce<Record<string, ManifestEntry>>((acc, key) => {
      acc[key] = manifest.files[key]
      return acc
    }, {})
  fs.writeFileSync(
    manifestPath(outDir),
    JSON.stringify({ version: MANIFEST_VERSION, files }, null, 2),
    'utf8'
  )
}

function extractMermaidBlocks(markdown: string): string[] {
  // ✅ 行頭の ```mermaid ... ``` だけを拾う
  const mermaidBlocks = [...markdown.matchAll(/^```mermaid[^\n]*\n([\s\S]*?)^```/gm)]
  return mermaidBlocks.map(m => m[1]?.trim()).filter((v): v is string => !!v)
}

function collectMarkdownFiles(dir: string, acc: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const full = path.join(dir, entry.name)

    // .vitepress や public などは無視
    if (entry.isDirectory()) {
      if (entry.name === '.vitepress' || entry.name === 'public' || entry.name === 'node_modules') {
        continue
      }
      collectMarkdownFiles(full, acc)
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      acc.push(full)
    }
  }

  // 列挙順に依存せず再現性を確保する
  return acc.sort()
}

/**
 * SVG の viewBox を読み取り、その値で width / height 属性を上書きする。
 * すでに width="100%" などが付いていても削除してから付け直します。
 */
function normalizeSvgSize(svgPath: string): void {
  let svg = fs.readFileSync(svgPath, 'utf8')

  // viewBox="minX minY W H" を探す
  const vbMatch = svg.match(/viewBox="([^"]+)"/)
  if (!vbMatch) {
    return
  }

  const parts = vbMatch[1].trim().split(/\s+/)
  if (parts.length !== 4) {
    return
  }

  const [, , w, h] = parts // [minX, minY, width, height] を想定

  // 開始タグ <svg ...> をキャプチャ
  const tagMatch = svg.match(/<svg[^>]*>/)
  if (!tagMatch) {
    return
  }

  const originalTag = tagMatch[0]
  // "<svg" と ">" を除いた属性部分を取り出す
  const attrs = originalTag.slice('<svg'.length, -1) // 先頭 "<svg" と末尾 ">" を除去した部分

  // 属性文字列から既存の width / height を削除
  const cleanedAttrs = attrs.replace(/\swidth="[^"]*"/, '').replace(/\sheight="[^"]*"/, '')

  // 新しい svg タグを組み立て
  // cleanedAttrs は先頭にスペースを含んでいるので、そのまま連結してOK
  const newTag = `<svg width="${w}" height="${h}"${cleanedAttrs}>`

  // タグ全体を置き換え
  svg = svg.replace(originalTag, newTag)

  fs.writeFileSync(svgPath, svg, 'utf8')
}

function renderSvg(outDir: string, code: string): string {
  const id = hashCode(code)
  const svgPath = svgPathFor(outDir, id)

  // 既に同じコードのSVGがあれば再生成しない（ブロック単位キャッシュ）
  if (fs.existsSync(svgPath)) {
    return id
  }

  const tmpMmd = path.join(outDir, `.tmp-${id}.mmd`)
  fs.writeFileSync(tmpMmd, code, 'utf8')

  console.log(`🌀 Generating mermaid SVG: ${path.relative(process.cwd(), svgPath)}`)

  try {
    // mermaid-cli を使って .mmd → .svg
    execSync(
      `npx mmdc -p "${PUPPETEER_CONFIG}" -c "${MERMAID_CONFIG}" -i "${tmpMmd}" -o "${svgPath}"`,
      { stdio: 'inherit' }
    )

    // ✅ ここで width/height を viewBox から上書き
    normalizeSvgSize(svgPath)
  } finally {
    fs.rmSync(tmpMmd, { force: true })
  }

  return id
}

/**
 * 1 ファイルを処理して、そのファイルが参照する SVG ハッシュ一覧を返す。
 * manifest が渡され、mtime/size が一致し対応 SVG が揃っている場合は read せずスキップする。
 */
function processMarkdown(
  mdPath: string,
  rootDir: string,
  outDir: string,
  prevManifest?: Manifest
): string[] {
  const stat = fs.statSync(mdPath)

  if (prevManifest) {
    const relKey = path.relative(rootDir, mdPath)
    const prev = prevManifest.files[relKey]
    if (
      prev &&
      prev.mtimeMs === stat.mtimeMs &&
      prev.size === stat.size &&
      prev.hashes.every(id => fs.existsSync(svgPathFor(outDir, id)))
    ) {
      // 変更なし & 生成済み → 何もしない
      return prev.hashes
    }
  }

  const text = fs.readFileSync(mdPath, 'utf8')
  const mermaidBlocks = extractMermaidBlocks(text)
  if (mermaidBlocks.length === 0) {
    return []
  }

  console.log(`🌀 Generating mermaid SVG from: ${path.relative(process.cwd(), mdPath)}`)

  fs.mkdirSync(outDir, { recursive: true })

  const hashes: string[] = []
  for (const code of mermaidBlocks) {
    if (!code) continue
    hashes.push(renderSvg(outDir, code))
  }
  return hashes
}

/**
 * manifest に登録されたどのファイルからも参照されなくなった SVG を削除する。
 * 削除対象はハッシュ名の SVG（`<hash>.svg`）のみに限定する。
 */
function pruneOrphanSvgs(outDir: string, manifest: Manifest): void {
  if (!fs.existsSync(outDir)) return

  const referenced = new Set<string>()
  for (const entry of Object.values(manifest.files)) {
    for (const id of entry.hashes) referenced.add(`${id}.svg`)
  }

  for (const name of fs.readdirSync(outDir)) {
    if (!SVG_NAME_PATTERN.test(name)) continue
    if (referenced.has(name)) continue
    fs.rmSync(path.join(outDir, name), { force: true })
    console.log(`🧹 Removing orphan mermaid SVG: ${name}`)
  }
}

export function generateMermaidSvgs(options?: { rootDir?: string; outDir?: string }): void {
  const rootDir = options?.rootDir ?? DEFAULT_ROOT
  const outDir = options?.outDir ?? DEFAULT_OUT_DIR

  console.log('🔍 Scanning docs for mermaid code blocks...')

  const prevManifest = loadManifest(outDir)
  const nextManifest: Manifest = { version: MANIFEST_VERSION, files: {} }

  for (const mdPath of collectMarkdownFiles(rootDir)) {
    const stat = fs.statSync(mdPath)
    const hashes = processMarkdown(mdPath, rootDir, outDir, prevManifest)
    if (hashes.length > 0) {
      // mermaid を含むファイルのみ記録する（mtime/size で次回の差分判定に使う）
      nextManifest.files[path.relative(rootDir, mdPath)] = {
        mtimeMs: stat.mtimeMs,
        size: stat.size,
        hashes,
      }
    }
  }

  pruneOrphanSvgs(outDir, nextManifest)
  saveManifest(outDir, nextManifest)

  console.log('✅ Mermaid SVG generation done.')
}

export function generateMermaidSvgsForFile(
  mdPath: string,
  options?: { rootDir?: string; outDir?: string }
): void {
  const rootDir = options?.rootDir ?? DEFAULT_ROOT
  const outDir = options?.outDir ?? DEFAULT_OUT_DIR

  if (!mdPath.endsWith('.md')) return

  // 単一ファイル更新（dev のホットリロード等）では対象ファイルを常に処理し、
  // manifest の該当エントリだけを更新する。
  const manifest = loadManifest(outDir)
  const hashes = processMarkdown(mdPath, rootDir, outDir)
  const relKey = path.relative(rootDir, mdPath)
  if (hashes.length > 0) {
    const stat = fs.statSync(mdPath)
    manifest.files[relKey] = { mtimeMs: stat.mtimeMs, size: stat.size, hashes }
  } else {
    delete manifest.files[relKey]
  }
  saveManifest(outDir, manifest)
}

function isDirectRun(): boolean {
  const selfPath = fileURLToPath(import.meta.url)
  const invoked = process.argv[1] ? path.resolve(process.argv[1]) : ''
  return invoked === path.resolve(selfPath)
}

if (isDirectRun()) {
  generateMermaidSvgs()
}
