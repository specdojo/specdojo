import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'

interface DocIndex {
  version: number
  entries: Record<string, string>
}

const INDEX_REL = '.specdojo/doc-index.json'

// [[id]] or [[id|alt]] in any file — group1=id, group2=alt (undefined when absent)
const WIKILINK_RE = /\[\[([a-z][a-z0-9:_-]+)(?:\|([^\]]*))?\]\]/g

// YAML single-value keys where the value is a document ID
const YAML_SINGLE_KEY_RE =
  /^(\s*(?:rulebook|viewpoint):\s+)([a-z][a-z0-9:_-]+)(\s*)$/gm

// YAML list items that look like namespaced IDs (e.g. prj-0001:pm-roles) or vp-* IDs
const YAML_LIST_ITEM_RE = /^(\s*-\s+)((?:[a-z][a-z0-9-]+:[a-z][a-z0-9-]+|vp-[a-z][a-z0-9-]+))(\s*)$/gm

// Module-level shared state — used by both the link provider and extendMarkdownIt
let _wsUri: vscode.Uri | undefined       // full workspace URI (correct for remote/devcontainer)
let _workspaceRoot = ''                  // fsPath — used only for fs operations
let _index: Record<string, string> = {}

function loadIndex(): void {
  if (!_workspaceRoot) return
  const indexPath = path.join(_workspaceRoot, INDEX_REL)
  if (!fs.existsSync(indexPath)) return
  try {
    const data = JSON.parse(fs.readFileSync(indexPath, 'utf8')) as DocIndex
    _index = data.entries
  } catch {
    _index = {}
  }
}

function entryToUri(entry: string): vscode.Uri | undefined {
  if (!_wsUri) return undefined
  const colonIdx = entry.lastIndexOf(':')
  const hasLine = colonIdx > 0 && /^\d+$/.test(entry.slice(colonIdx + 1))
  const filePath = hasLine ? entry.slice(0, colonIdx) : entry
  const lineNumber = hasLine ? parseInt(entry.slice(colonIdx + 1), 10) - 1 : 0
  const uri = vscode.Uri.joinPath(_wsUri, filePath)
  return lineNumber > 0 ? uri.with({ fragment: `L${lineNumber + 1}` }) : uri
}

// The namespace prefix of the containing document's own id (e.g. `prj-0001` from
// `prj-0001:xrr-prj-overview`). Used to expand a bare `[[id]]` to `<namespace>:<id>`.
// Reads the first top-level `id:` line, which covers both Markdown frontmatter and
// top-level YAML documents.
function documentNamespace(text: string): string | undefined {
  const match = text.match(/^id:[ \t]*(\S+)/m)
  if (!match) return undefined
  const colon = match[1].indexOf(':')
  return colon > 0 ? match[1].slice(0, colon) : undefined
}

// Resolve a wikilink id to an index entry. An exact match wins; otherwise, when the id
// has no namespace, retry with the containing document's namespace so a bare local id
// (e.g. `prj-overview`) resolves within the same project (`prj-0001:prj-overview`).
function resolveEntry(id: string, namespace: string | undefined): string | undefined {
  const exact = _index[id]
  if (exact) return exact
  if (namespace && !id.includes(':')) return _index[`${namespace}:${id}`]
  return undefined
}

function resolveToUri(id: string, namespace?: string): vscode.Uri | undefined {
  const entry = resolveEntry(id, namespace)
  if (!entry) return undefined
  return entryToUri(entry)
}

class SpecdojoLinkProvider implements vscode.DocumentLinkProvider {
  constructor() {
    const folder = vscode.workspace.workspaceFolders?.[0]
    if (folder) {
      _wsUri = folder.uri
      _workspaceRoot = folder.uri.fsPath
      loadIndex()
    }
  }

  reloadIndex(): void {
    loadIndex()
  }

  provideDocumentLinks(document: vscode.TextDocument): vscode.DocumentLink[] {
    const links: vscode.DocumentLink[] = []
    const text = document.getText()
    const namespace = documentNamespace(text)

    let m: RegExpExecArray | null
    WIKILINK_RE.lastIndex = 0
    while ((m = WIKILINK_RE.exec(text)) !== null) {
      const id = m[1]
      const alt = m[2]
      const target = resolveToUri(id, namespace)
      if (target) {
        // [[id|alt]] → alt をクリック可能領域にする。[[id]] → id をクリック可能領域にする
        const linkStart = alt !== undefined
          ? m.index + 2 + id.length + 1  // skip past [[id|
          : m.index + 2
        const linkText = alt !== undefined ? alt : id
        const start = document.positionAt(linkStart)
        const end = document.positionAt(linkStart + linkText.length)
        links.push(new vscode.DocumentLink(new vscode.Range(start, end), target))
      }
    }

    if (document.languageId === 'yaml') {
      YAML_SINGLE_KEY_RE.lastIndex = 0
      while ((m = YAML_SINGLE_KEY_RE.exec(text)) !== null) {
        const id = m[2]
        const target = resolveToUri(id, namespace)
        if (target) {
          const idStart = m.index + m[1].length
          const start = document.positionAt(idStart)
          const end = document.positionAt(idStart + id.length)
          links.push(new vscode.DocumentLink(new vscode.Range(start, end), target))
        }
      }

      YAML_LIST_ITEM_RE.lastIndex = 0
      while ((m = YAML_LIST_ITEM_RE.exec(text)) !== null) {
        const id = m[2]
        const target = resolveToUri(id, namespace)
        if (target) {
          const idStart = m.index + m[1].length
          const start = document.positionAt(idStart)
          const end = document.positionAt(idStart + id.length)
          links.push(new vscode.DocumentLink(new vscode.Range(start, end), target))
        }
      }
    }

    return links
  }
}

export function activate(context: vscode.ExtensionContext) {
  const provider = new SpecdojoLinkProvider()

  context.subscriptions.push(
    vscode.languages.registerDocumentLinkProvider(
      [
        { language: 'markdown' },
        { language: 'yaml' },
      ],
      provider,
    ),
  )

  const watcher = vscode.workspace.createFileSystemWatcher(`**/${INDEX_REL}`)
  context.subscriptions.push(
    watcher,
    watcher.onDidChange(() => provider.reloadIndex()),
    watcher.onDidCreate(() => provider.reloadIndex()),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('specdojo.openById', async () => {
      const id = await vscode.window.showInputBox({
        prompt: 'Enter a SpecDojo document ID',
        placeHolder: 'e.g. prj-overview-rulebook or prj-0001:pm-roles',
      })
      if (!id) return

      if (!_wsUri || Object.keys(_index).length === 0) {
        vscode.window.showWarningMessage('SpecDojo index not found. Run: specdojo index build')
        return
      }
      const entry = _index[id]
      if (!entry) {
        vscode.window.showWarningMessage(`ID not found: ${id}`)
        return
      }
      const colonIdx = entry.lastIndexOf(':')
      const hasLine = colonIdx > 0 && /^\d+$/.test(entry.slice(colonIdx + 1))
      const filePath = hasLine ? entry.slice(0, colonIdx) : entry
      const lineNumber = hasLine ? parseInt(entry.slice(colonIdx + 1), 10) - 1 : 0
      const uri = vscode.Uri.joinPath(_wsUri, filePath)
      const doc = await vscode.workspace.openTextDocument(uri)
      await vscode.window.showTextDocument(doc, {
        selection: new vscode.Range(lineNumber, 0, lineNumber, 0),
      })
    }),
  )

  // Return the API so VSCode's markdown extension can call extendMarkdownIt
  return { extendMarkdownIt }
}

export function deactivate(): void {}

// Markdown preview support: converts [[id]] wikilinks into clickable links
export function extendMarkdownIt(md: any): any {
  // VS Code calls md.parse() directly (not md.render()).
  // Wrapping md.parse lets us identify the source document before inline rules fire.
  let _currentRenderFsPath = ''
  let _currentNamespace: string | undefined
  const origParse = md.parse.bind(md)
  md.parse = (src: string, env: any) => {
    _currentRenderFsPath = ''
    // Namespace of the document being rendered, so a bare [[id]] expands to <namespace>:<id>.
    _currentNamespace = documentNamespace(src)
    for (const doc of vscode.workspace.textDocuments) {
      if (doc.languageId === 'markdown' && doc.getText() === src) {
        _currentRenderFsPath = doc.uri.fsPath
        break
      }
    }
    return origParse(src, env)
  }

  // Use an inline rule so [[id]] is intercepted before markdown-it's link parser
  // splits the brackets into separate tokens.
  md.inline.ruler.before('link', 'specdojo_wikilink', (state: any, silent: boolean) => {
    const pos = state.pos

    // Must start with [[
    if (state.src.charCodeAt(pos) !== 0x5B || state.src.charCodeAt(pos + 1) !== 0x5B) return false

    // Find closing ]]
    const closeIndex = state.src.indexOf(']]', pos + 2)
    if (closeIndex === -1 || closeIndex > state.posMax) return false

    const inner = state.src.slice(pos + 2, closeIndex)
    const pipeIdx = inner.indexOf('|')
    const id = pipeIdx === -1 ? inner : inner.slice(0, pipeIdx)
    const displayText = pipeIdx === -1 ? id : inner.slice(pipeIdx + 1)
    if (!/^[a-z][a-z0-9:_-]+$/.test(id)) return false

    if (!silent) {
      const entry = _wsUri ? resolveEntry(id, _currentNamespace) : undefined

      if (entry) {
        const colonIdx = entry.lastIndexOf(':')
        const hasLine = colonIdx > 0 && /^\d+$/.test(entry.slice(colonIdx + 1))
        const filePath = hasLine ? entry.slice(0, colonIdx) : entry

        // Compute relative path from current document to target.
        // VS Code's preview resolves hrefs relative to the current document's directory.
        let href: string
        if (_currentRenderFsPath && _workspaceRoot) {
          const currentDir = path.dirname(_currentRenderFsPath)
          const targetAbs = path.join(_workspaceRoot, filePath)
          href = path.relative(currentDir, targetAbs).replace(/\\/g, '/')
          if (!href.startsWith('.')) href = './' + href
        } else {
          href = vscode.Uri.joinPath(_wsUri!, filePath).toString()
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

  return md
}
