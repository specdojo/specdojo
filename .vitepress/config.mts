import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'
import * as crypto from 'crypto'
import { specdojoSidebarItems } from './specdojo-sidebar-items'
import type { Plugin } from 'vite'
import { generateMermaidSvgs, generateMermaidSvgsForFile } from '../tools/docs/src/gen-mermaid-svg'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { existsSync, readFileSync } from 'node:fs'

const CONFIG_DIR = path.dirname(fileURLToPath(import.meta.url))
const WORKSPACE_ROOT = path.resolve(CONFIG_DIR, '..')
const CONTENT_ROOT = path.join(WORKSPACE_ROOT, 'docs')
const MERMAID_OUT_DIR = path.join(WORKSPACE_ROOT, 'public', 'mermaid')

// [[id]] wikilink index — loaded once at build/dev startup
function loadDocIndex(workspaceRoot: string): Record<string, string> {
  const p = path.join(workspaceRoot, '.specdojo', 'doc-index.json')
  if (!existsSync(p)) return {}
  try {
    return (JSON.parse(readFileSync(p, 'utf8')) as { entries: Record<string, string> }).entries
  } catch {
    return {}
  }
}
const docIndex = loadDocIndex(WORKSPACE_ROOT)

// doc id を doc-index で docs ルート相対パス（"ja/..."）へ解決する。Markdown 以外は対象外。
function resolveDocRelPath(id: string): string | undefined {
  const entry = docIndex[id]
  if (!entry) return undefined
  // 行番号サフィックスを除去（例: "docs/ja/foo.yaml:42" → "docs/ja/foo.yaml"）
  const colonIndex = entry.lastIndexOf(':')
  const hasLine = colonIndex > 0 && /^\d+$/.test(entry.slice(colonIndex + 1))
  const entryPath = hasLine ? entry.slice(0, colonIndex) : entry
  if (!entryPath.endsWith('.md')) return undefined
  return entryPath.startsWith('docs/') ? entryPath.slice(5) : entryPath
}

// frontmatter（FrontmatterTable が展開する五階層まで）の文字列値・文字列配列要素のうち
// doc-index に存在する id をサイトルート相対の href（doc id → "/ja/....html"）へ解決する。
// 自ページへの id は除外する。
const FRONTMATTER_LINK_MAX_DEPTH = 5

function collectFrontmatterDocLinks(
  frontmatter: Record<string, unknown>,
  currentRelPath: string
): Record<string, string> {
  const links: Record<string, string> = {}

  const addCandidate = (candidate: string): void => {
    if (links[candidate]) return
    const docsRelPath = resolveDocRelPath(candidate)
    if (!docsRelPath || docsRelPath === currentRelPath) return
    links[candidate] = '/' + docsRelPath.replace(/\.md$/, '.html')
  }

  const visit = (value: unknown, depth: number): void => {
    if (typeof value === 'string') {
      addCandidate(value)
      return
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === 'string') addCandidate(item)
      }
      return
    }
    if (value !== null && typeof value === 'object' && depth < FRONTMATTER_LINK_MAX_DEPTH) {
      for (const childValue of Object.values(value)) visit(childValue, depth + 1)
    }
  }

  for (const value of Object.values(frontmatter)) visit(value, 1)

  return links
}

const specdojoItems = {
  ja: {
    text: 'specdojo',
    collapsed: false,
    items: specdojoSidebarItems,
  },
}

// GitHub Pages の公開パス: https://specdojo.github.io/specdojo/
const base = '/specdojo/'

const hashCode = (code: string): string =>
  crypto.createHash('md5').update(code).digest('hex').slice(0, 8)

type SidebarItem = {
  text?: string
  link?: string
  items?: SidebarItem[]
  collapsed?: boolean
}

const mermaidSvgAutoGenerate = (): Plugin => {
  let timer: NodeJS.Timeout | undefined
  let running = false
  let pending = false
  const pendingFiles = new Set<string>()
  let isSsrBuild = false

  const run = (reason: string) => {
    if (running) {
      pending = true
      return
    }

    running = true
    try {
      if (pendingFiles.size > 0) {
        const files = [...pendingFiles]
        pendingFiles.clear()
        console.log(`[mermaid] generating svgs for ${files.length} file(s) (${reason})`)
        for (const file of files)
          generateMermaidSvgsForFile(file, { rootDir: CONTENT_ROOT, outDir: MERMAID_OUT_DIR })
      } else {
        console.log(`[mermaid] generating svgs (${reason})`)
        generateMermaidSvgs({ rootDir: CONTENT_ROOT, outDir: MERMAID_OUT_DIR })
      }
    } finally {
      running = false
      if (pending) {
        pending = false
        run('pending')
      }
    }
  }

  const schedule = (reason: string, delayMs = 250) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => run(reason), delayMs)
  }

  const scheduleFile = (file: string, reason: string, delayMs = 250) => {
    pendingFiles.add(file)
    schedule(reason, delayMs)
  }

  const shouldHandle = (file: string): boolean => {
    if (!file) return false
    if (!file.endsWith('.md')) return false
    return file.startsWith(CONTENT_ROOT + path.sep)
  }

  return {
    name: 'mermaid-svg-auto-generate',

    configResolved(config) {
      // VitePress build は client build と SSR build を連続実行するため、
      // buildStart が2回呼ばれる。SVG生成は1回で十分なので SSR 側はスキップする。
      isSsrBuild = Boolean(config.build?.ssr)
    },

    buildStart() {
      if (isSsrBuild) return
      run('buildStart')
    },

    configureServer(server) {
      schedule('startup', 0)

      server.watcher.on('add', file => {
        if (!shouldHandle(file)) return
        scheduleFile(file, 'md:add')
      })
    },

    handleHotUpdate(ctx) {
      if (!shouldHandle(ctx.file)) return

      // Markdown の再描画より先に SVG を用意したいので同期的に実行
      pendingFiles.add(ctx.file)
      run('hotUpdate')
      ctx.server.ws.send({ type: 'full-reload' })
      return []
    },
  }
}

/**
 * 追加したいロケールはここに足すだけでOK
 * - locale: URL と docs/<locale>/ のディレクトリ名に使う
 * - label: 言語セレクター表示名
 * - lang: <html lang="..."> に使う
 */
const LOCALES = [
  { locale: 'ja', label: '日本語', lang: 'ja' },
  { locale: 'en', label: 'English', lang: 'en' },
] as const
type Locale = (typeof LOCALES)[number]['locale']

// link から末尾要素（拡張子なし想定）を取り出す："/foo/010-bar" -> "010-bar"
const getBaseFromLink = (link?: string): string => {
  if (!link) return ''
  const clean = link.split('#')[0].replace(/\/+$/, '')
  return clean.split('/').pop() ?? ''
}

// 判定：README / *rulebook
const isReadme = (item: SidebarItem): boolean => {
  return getBaseFromLink(item.link).toLowerCase() === 'readme'
}

const isRulebook = (item: SidebarItem): boolean => {
  return getBaseFromLink(item.link).toLowerCase().endsWith('rulebook')
}

// 既に /<locale>/ が付いているかを LOCALES から判定（将来増えてもOK）
const isAlreadyPrefixedByAnyLocale = (path: string): boolean => {
  return LOCALES.some(({ locale }) => path === `/${locale}` || path.startsWith(`/${locale}/`))
}

// ソート用のキー：
// 1) README（最優先）
// 2) *rulebook（次）
// 3) その他：先頭 xxx- を削除した名前でファイル名順
const sortKey = (item: SidebarItem): { bucket: number; name: string } => {
  if (isReadme(item)) return { bucket: 0, name: '' }
  if (isRulebook(item)) return { bucket: 1, name: getBaseFromLink(item.link).toLowerCase() }
  return { bucket: 2, name: getBaseFromLink(item.link).toLowerCase() }
}

const normalizeAndPrefixLink = (link: string, locale: Locale): string => {
  // hash は保持して、パス部分だけ正規化
  const [path0, hash] = link.split('#')
  const path = path0.startsWith('/') ? path0 : `/${path0}`

  const prefixedPath = isAlreadyPrefixedByAnyLocale(path)
    ? path
    : path === '/'
      ? `/${locale}/`
      : `/${locale}${path}`

  return hash ? `${prefixedPath}#${hash}` : prefixedPath
}

const PROJECTS_SEGMENT_TEXT: Record<string, string> = {
  projects: 'プロジェクト',
  '010-deliverables-catalog': '成果物カタログ',
  '020-project-definition': 'プロジェクト定義',
  '030-project-management': 'プロジェクトマネジメント',
  '040-product-change': 'プロダクト変更',
  '010-management-plan': '管理計画',
  '020-organization': '組織体制',
  controls: '管理台帳・管理ビュー',
  'project-register': 'プロジェクト登録簿',
  reporting: 'レポート',
  'progress-reports': '進捗報告',
  'meeting-minutes': '議事録',
  execution: '実行管理',
  exec: '実行ワークスペース',
  events: 'イベントログ',
  plans: '実行プラン',
  results: '実行結果',
  generated: '生成物',
  reviews: 'レビュー',
  schedule: 'スケジュール',
  '010-as-is': '現状定義',
  '010-business-specifications': '業務仕様',
  '020-impact-analysis': '影響調査',
  '030-traceability': 'トレーサビリティ',
  '040-migration': '移行',
}

const PROJECTS_FILE_TEXT: Record<string, string> = {
  index: '一覧',
  cpm: 'クリティカルパス分析',
  'critical-path': 'クリティカルパス',
  ready: '着手可能タスク',
  'schedule-diff': 'スケジュール差分',
  'task-catalog': 'タスクカタログ',
  timeline: 'タイムライン',
}

const stripMarkdownFrontmatter = (content: string): string =>
  content.startsWith('---\n') ? content.replace(/^---\n[\s\S]*?\n---\n?/, '') : content

const readFrontmatterString = (content: string, key: string): string | undefined => {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return undefined

  const line = match[1].match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm'))?.[1]
  if (!line || line.startsWith('[') || line.startsWith('{')) return undefined

  return line.replace(/^['"]|['"]$/g, '').trim() || undefined
}

const readMarkdownTitle = (content: string): string | undefined => {
  const body = stripMarkdownFrontmatter(content)
  return body.match(/^#\s+(.+?)\s*$/m)?.[1]?.trim()
}

const docsPathFromLink = (link: string): string | undefined => {
  const clean = link.split('#')[0].replace(/^\/+/, '').replace(/\/+$/, '')
  if (!clean) return undefined

  return path.join(WORKSPACE_ROOT, 'docs', `${clean}.md`)
}

const readProjectsMenuTextFromMarkdown = (link: string): string | undefined => {
  const filePath = docsPathFromLink(link)
  if (!filePath || !existsSync(filePath)) return undefined

  const content = readFileSync(filePath, 'utf8')
  const frontmatterTitle = readFrontmatterString(content, 'title')
  if (frontmatterTitle) return frontmatterTitle

  const frontmatterName = readFrontmatterString(content, 'name')
  if (frontmatterName) {
    const type = readFrontmatterString(content, 'type')
    if (type === 'exec-plan') return `実行計画: ${frontmatterName}`
    if (type === 'exec-result') return `実行結果: ${frontmatterName}`
    return frontmatterName
  }

  return readMarkdownTitle(content)
}

const isProjectsLink = (link: string, locale: Locale): boolean => {
  return link === `/${locale}/projects` || link.startsWith(`/${locale}/projects/`)
}

const toProjectsMenuText = (item: SidebarItem, locale: Locale): string | undefined => {
  if (item.link) {
    const markdownTitle = readProjectsMenuTextFromMarkdown(item.link)
    if (markdownTitle) return markdownTitle

    const base = getBaseFromLink(item.link)
    return PROJECTS_FILE_TEXT[base] ?? PROJECTS_SEGMENT_TEXT[base]
  }

  const text = item.text ?? ''
  return PROJECTS_SEGMENT_TEXT[text]
}

const isHandbookTop = (item: SidebarItem): boolean => {
  const link = item.link ?? ''
  const text = (item.text ?? '').toString().toLowerCase()
  return link.includes('/specdojo/') || text === 'specdojo'
}

// 再帰的に: 表示名整形（xxx-削除）、並び替え
const transformSidebar = (
  items: SidebarItem[],
  locale: Locale,
  parentIsProjects = false
): SidebarItem[] => {
  const transformed = items
    .filter(it => !isHandbookTop(it)) // handbook トップは自動生成側に含めない
    .map(it => {
      const next: SidebarItem = { ...it }

      // prev/next 解決
      if (next.link) next.link = normalizeAndPrefixLink(next.link, locale)

      const currentIsProjects =
        parentIsProjects ||
        (next.text ?? '').toString() === 'projects' ||
        Boolean(next.link && isProjectsLink(next.link, locale))
      if (currentIsProjects) {
        const text = toProjectsMenuText(next, locale)
        if (text) next.text = text
      }

      // 子も同じルールで処理
      if (next.items) next.items = transformSidebar(next.items, locale, currentIsProjects)

      return next
    })

  // 「生成物」グループ（generated フォルダ）はグループ化せず、子を同一階層へ展開する。
  const flattened = transformed.flatMap(it =>
    !it.link && it.text === '生成物' && it.items ? it.items : [it]
  )

  flattened.sort((a, b) => {
    const ka = sortKey(a)
    const kb = sortKey(b)
    if (ka.bucket !== kb.bucket) return ka.bucket - kb.bucket
    return ka.name.localeCompare(kb.name, 'ja')
  })

  return flattened
}

// ★ここ重要：言語フォルダを documentRootPath にする
const makeSidebar = (locale: Locale): SidebarItem[] =>
  transformSidebar(
    generateSidebar({
      documentRootPath: 'docs',
      scanStartPath: locale, // locale の中をスキャン
      useTitleFromFileHeading: false,
      collapseDepth: 2,
      collapsed: true,
    }) as SidebarItem[],
    locale
  )

const sidebarJaAuto = makeSidebar('ja')
const sidebarEnAuto = makeSidebar('en')

export default defineConfig({
  title: 'SpecDojo',
  description: 'Documentation for SpecDojo',
  base,

  // srcDir 省略時は root（リポジトリルート）と同一になる。
  // サイトに含めるのは docs/ 配下の Markdown のみとし、
  // リポジトリ直下の README 等やローカル作業用ディレクトリは除外する。
  srcExclude: ['*.md', 'local/**', 'workspaces/**'],

  // サイドバー折りたたみ状態の復元（初回描画前に同期実行し、ちらつきを防ぐ）
  head: [
    [
      'script',
      {},
      `(function(){try{if(localStorage.getItem('vp-sidebar-collapsed')==='true'){document.documentElement.classList.add('vp-sidebar-collapsed')}}catch(e){}})()`,
    ],
  ],

  // pjr-index-template.md は scaffold 元のため、標準派生ビューへの相対リンクが
  // テンプレート置き場では解決できない。生成先（各プロジェクトの project-register/）では
  // specdojo build が生成するファイルであり、この5リンクに限り dead link 検査を除外する。
  ignoreDeadLinks: [
    /^\.\/(\.\.\/)?generated\/(pjr-views|pm-risk-register|pm-issue-log|pm-change-request-log|pm-decision-log)$/,
  ],

  // 物理パスは docs/ja, docs/en のままで、
  // 公開URL（および i18n のロケール判定）は /ja/, /en/ に揃える。
  rewrites: {
    'docs/index.md': 'index.md',
    'docs/ja/:rest*': 'ja/:rest*',
    'docs/en/:rest*': 'en/:rest*',
  },

  themeConfig: {
    // ビルド時に生成したインデックスでブラウザ内検索を行う（外部サービス不要）
    search: {
      provider: 'local',
      options: {
        locales: {
          ja: {
            translations: {
              button: {
                buttonText: '検索',
                buttonAriaLabel: '検索',
              },
              modal: {
                displayDetails: '詳細を表示',
                resetButtonTitle: '検索条件をリセット',
                backButtonTitle: '検索を閉じる',
                noResultsText: '検索結果が見つかりませんでした',
                footer: {
                  selectText: '選択',
                  selectKeyAriaLabel: 'enter',
                  navigateText: '移動',
                  navigateUpKeyAriaLabel: '上矢印',
                  navigateDownKeyAriaLabel: '下矢印',
                  closeText: '閉じる',
                  closeKeyAriaLabel: 'esc',
                },
              },
            },
          },
        },
      },
    },
  },

  locales: {
    ja: {
      label: '日本語',
      lang: 'ja',
      // 言語メニューで押したときのリンク先（日本語トップ）
      link: '/ja/',
      themeConfig: {
        nav: [
          { text: 'ホーム', link: '/ja/' },
          { text: 'SpecDojo', link: '/ja/specdojo/guides/docs-phases-overview' },
          {
            text: 'プロジェクト',
            link: '/ja/projects/prj-0001/020-project-definition/prj-overview',
          },
        ],
        sidebar: [specdojoItems.ja, ...sidebarJaAuto],
        langMenuLabel: '言語',
      },
    },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      themeConfig: {
        nav: [{ text: 'Home', link: '/en/' }],
        sidebar: sidebarEnAuto,
        langMenuLabel: 'Language',
      },
    },
  },

  // FrontmatterTable が doc id をリンク表示できるよう、解決済み href を pageData へ載せる。
  transformPageData(pageData) {
    const frontmatterDocLinks = collectFrontmatterDocLinks(
      pageData.frontmatter,
      pageData.relativePath
    )
    if (Object.keys(frontmatterDocLinks).length > 0) {
      return { frontmatterDocLinks }
    }
  },

  markdown: {
    //
    // ```mermaid ... ``` のコードブロックを
    // <img src="/mermaid/<hash>.svg"> に差し替える
    // （Markdownファイルは書き換えない。HTML生成時だけ差し替え）
    //
    config: md => {
      // front matter の title を先頭H1として注入（既にH1があれば何もしない）
      md.core.ruler.after('block', 'frontmatter-h1', (state: any) => {
        const fmTitle = state.env?.frontmatter?.title
        if (!fmTitle) return

        const hasH1 = state.tokens.some((t: any) => t.type === 'heading_open' && t.tag === 'h1')
        if (hasH1) return

        const Token = state.Token
        const open = new Token('heading_open', 'h1', 1)
        open.markup = '#'
        open.block = true

        const inline = new Token('inline', '', 0)
        inline.content = String(fmTitle)
        inline.children = []

        const close = new Token('heading_close', 'h1', -1)
        close.markup = '#'
        close.block = true

        // 文書の先頭に H1 を差し込む
        state.tokens.unshift(close)
        state.tokens.unshift(inline)
        state.tokens.unshift(open)
      })

      // インラインコード `...` は必ず v-pre を付けて出力
      //    → `{{ ... }}` を Vue がパースしなくなる
      md.renderer.rules.code_inline = (tokens, idx) => {
        const token = tokens[idx]
        const content = md.utils.escapeHtml(token.content)
        return `<code v-pre>${content}</code>`
      }

      const defaultFence = md.renderer.rules.fence

      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        const info = (token.info || '').trim()

        if (info === 'mermaid') {
          const code = token.content.trim()
          const id = hashCode(code)
          const src = `/mermaid/${id}.svg`

          // 800x800 を超える場合はスクロールさせるためのラッパーを用意
          // 具体的な判定は CSS / JS 側で行う想定（ここではクラスだけ付与）
          return `
              <p class="mermaid-container">
                <img src="${src}" alt="mermaid diagram" loading="lazy" class="mermaid-image">
              </p>\n`
        }

        // それ以外のコードブロックはデフォルトの描画
        return defaultFence
          ? defaultFence(tokens, idx, options, env, self)
          : self.renderToken(tokens, idx, options)
      }

      // [[id]] wikilink → VitePress 内部リンク
      md.inline.ruler.before('link', 'specdojo_wikilink', (state: any, silent: boolean) => {
        const pos = state.pos
        if (state.src.charCodeAt(pos) !== 0x5b || state.src.charCodeAt(pos + 1) !== 0x5b)
          return false

        const closeIndex = state.src.indexOf(']]', pos + 2)
        if (closeIndex === -1 || closeIndex > state.posMax) return false

        const inner = state.src.slice(pos + 2, closeIndex)
        const pipeIdx = inner.indexOf('|')
        const id = pipeIdx === -1 ? inner : inner.slice(0, pipeIdx)
        const displayText = pipeIdx === -1 ? id : inner.slice(pipeIdx + 1)
        if (!/^[a-z][a-z0-9:_-]+$/.test(id)) return false

        if (!silent) {
          const entry = docIndex[id]
          if (entry) {
            // Strip line number suffix (e.g. "docs/ja/foo.yaml:42" → "docs/ja/foo.yaml")
            const colonIdx = entry.lastIndexOf(':')
            const hasLine = colonIdx > 0 && /^\d+$/.test(entry.slice(colonIdx + 1))
            const entryPath = hasLine ? entry.slice(0, colonIdx) : entry

            // Index entries are workspace-root-relative ("docs/ja/...").
            // Strip "docs/" to get docs-root-relative path ("ja/...").
            const docsRelTarget = entryPath.startsWith('docs/') ? entryPath.slice(5) : entryPath

            // Compute href relative to the current file (VitePress sets env.relativePath)
            const currentRelPath = state.env?.relativePath as string | undefined
            let href: string
            if (currentRelPath) {
              const rel = path
                .relative(path.dirname(currentRelPath), docsRelTarget)
                .replace(/\\/g, '/')
              href = rel.startsWith('.') ? rel : './' + rel
            } else {
              href = '/' + docsRelTarget
            }

            let token = state.push('link_open', 'a', 1)
            token.attrSet('href', href)
            token = state.push('text', '', 0)
            token.content = displayText
            state.push('link_close', 'a', -1)
          } else {
            const token = state.push('text', '', 0)
            token.content = `[[${inner}]]`
          }
        }

        state.pos = closeIndex + 2
        return true
      })
    },
  },

  vite: {
    plugins: [mermaidSvgAutoGenerate()],
    build: {
      // 最大のチャンクはローカル検索インデックス（@localSearchIndex*）で、
      // 検索モーダルを開いたときだけ動的 import される遅延ロード対象。
      // ドキュメント増加に伴い 500kB を超えるが初期表示には影響しないため、
      // 警告しきい値を引き上げて誤検知を抑制する。
      chunkSizeWarningLimit: 3000,
    },
  },
})
