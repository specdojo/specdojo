import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { load } from 'js-yaml'
import { specdojoRootDir } from './specdojo-config.js'

// 参考資料（rulebook / recipe / sample / template）の解決を 1 か所に集約する。
// plan 生成（明示パスの注入）と validate（参照先の存在確認）の両方から使う。

const MISSING = '_MISSING_'
const DOCS_BASE = 'docs/ja/specdojo'

export type ReferenceMaterialKind = 'recipe' | 'sample' | 'template'

export type ReferenceMaterialRefs = {
  rulebook: string
  recipe: string
  sample: string
  template: string
}

type RulebookRefs = {
  recipe?: string
  sample?: string
  template?: string
  target_format?: string
}

const KIND_DIR: Record<ReferenceMaterialKind, string> = {
  recipe: 'recipes',
  sample: 'samples',
  template: 'templates',
}

function rulebookFsPath(rulebookId: string): string {
  return join(specdojoRootDir(), DOCS_BASE, 'rulebooks', `${rulebookId}.md`)
}

// rulebook frontmatter の recipe / sample / template / target_format を読む。
// ファイル不在・frontmatter なしの場合は空オブジェクトを返す。
export function loadRulebookRefs(rulebookId: string): RulebookRefs {
  const fsPath = rulebookFsPath(rulebookId)
  if (!existsSync(fsPath)) return {}
  const match = readFileSync(fsPath, 'utf8').match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}
  const data = load(match[1])
  if (typeof data !== 'object' || data === null) return {}
  const fm = data as Record<string, unknown>
  const str = (value: unknown): string | undefined =>
    typeof value === 'string' && value !== '' ? value : undefined
  return {
    recipe: str(fm.recipe),
    sample: str(fm.sample),
    template: str(fm.template),
    target_format: str(fm.target_format),
  }
}

// sample は対象成果物のフォーマットに合わせて拡張子が変わる。
function sampleExt(targetFormat: string | undefined): string {
  return targetFormat === 'yaml' ? 'yaml' : targetFormat === 'json' ? 'json' : 'md'
}

function repoRef(kind: ReferenceMaterialKind, id: string | undefined, ext: string): string {
  return id && id !== 'none' ? `/${DOCS_BASE}/${KIND_DIR[kind]}/${id}.${ext}` : MISSING
}

// 成果物の rulebook ID を起点に、recipe / sample / template の repo 相対パスを解決する。
// recipe / sample / template は rulebook frontmatter の宣言を正とする。
// rulebook 未指定・該当なしの項目は MISSING を返し、表示構造はテンプレート側に委ねる。
export function resolveReferenceMaterialRefs(rulebookId: string | undefined): ReferenceMaterialRefs {
  if (!rulebookId || rulebookId === 'none') {
    return { rulebook: MISSING, recipe: MISSING, sample: MISSING, template: MISSING }
  }
  const fm = loadRulebookRefs(rulebookId)
  return {
    rulebook: `/${DOCS_BASE}/rulebooks/${rulebookId}.md`,
    recipe: repoRef('recipe', fm.recipe, 'md'),
    sample: repoRef('sample', fm.sample, sampleExt(fm.target_format)),
    template: repoRef('template', fm.template, 'md'),
  }
}

export type DeclaredReference = {
  kind: ReferenceMaterialKind
  id: string
  fsPath: string
}

// rulebook frontmatter で宣言された recipe / sample / template の絶対パス一覧。
// none・未宣言は含めない（validate で存在確認するため）。
export function declaredReferences(rulebookId: string): DeclaredReference[] {
  const fm = loadRulebookRefs(rulebookId)
  const root = specdojoRootDir()
  const out: DeclaredReference[] = []
  const add = (kind: ReferenceMaterialKind, id: string | undefined, ext: string): void => {
    if (id && id !== 'none') {
      out.push({ kind, id, fsPath: join(root, DOCS_BASE, KIND_DIR[kind], `${id}.${ext}`) })
    }
  }
  add('recipe', fm.recipe, 'md')
  add('sample', fm.sample, sampleExt(fm.target_format))
  add('template', fm.template, 'md')
  return out
}
