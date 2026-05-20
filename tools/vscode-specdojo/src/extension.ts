import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'

interface DocIndex {
  version: number
  generated_at: string
  entries: Record<string, string>
}

const INDEX_GLOB = '**/docs/.specdojo/doc-index.json'
const INDEX_REL = 'docs/.specdojo/doc-index.json'

// [[id]] in any file
const WIKILINK_RE = /\[\[([a-z][a-z0-9:_-]+)\]\]/g

// YAML single-value keys where the value is a document ID
const YAML_SINGLE_KEY_RE =
  /^(\s*(?:rulebook|viewpoint):\s+)([a-z][a-z0-9:_-]+)(\s*)$/gm

// YAML list items that look like namespaced IDs (e.g. prj-0001:pm-roles)
// or vp-* IDs on their own line
const YAML_LIST_ITEM_RE = /^(\s*-\s+)((?:[a-z][a-z0-9-]+:[a-z][a-z0-9-]+|vp-[a-z][a-z0-9-]+))(\s*)$/gm

class SpecdojoLinkProvider implements vscode.DocumentLinkProvider {
  private index: Record<string, string> = {}
  private workspaceRoot = ''

  constructor() {
    const ws = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
    if (ws) {
      this.workspaceRoot = ws
      this.reloadIndex()
    }
  }

  reloadIndex(): void {
    if (!this.workspaceRoot) return
    const indexPath = path.join(this.workspaceRoot, INDEX_REL)
    if (!fs.existsSync(indexPath)) return
    try {
      const data = JSON.parse(fs.readFileSync(indexPath, 'utf8')) as DocIndex
      this.index = data.entries
    } catch {
      this.index = {}
    }
  }

  provideDocumentLinks(document: vscode.TextDocument): vscode.DocumentLink[] {
    const links: vscode.DocumentLink[] = []
    const text = document.getText()

    // [[id]] in any file
    let m: RegExpExecArray | null
    WIKILINK_RE.lastIndex = 0
    while ((m = WIKILINK_RE.exec(text)) !== null) {
      const id = m[1]
      const target = this.resolve(id)
      if (target) {
        const start = document.positionAt(m.index + 2)
        const end = document.positionAt(m.index + 2 + id.length)
        links.push(new vscode.DocumentLink(new vscode.Range(start, end), target))
      }
    }

    if (document.languageId === 'yaml') {
      // rulebook: <id>  and  viewpoint: <id>
      YAML_SINGLE_KEY_RE.lastIndex = 0
      while ((m = YAML_SINGLE_KEY_RE.exec(text)) !== null) {
        const id = m[2]
        const target = this.resolve(id)
        if (target) {
          const idStart = m.index + m[1].length
          const start = document.positionAt(idStart)
          const end = document.positionAt(idStart + id.length)
          links.push(new vscode.DocumentLink(new vscode.Range(start, end), target))
        }
      }

      // - prj-0001:id  or  - vp-xxx
      YAML_LIST_ITEM_RE.lastIndex = 0
      while ((m = YAML_LIST_ITEM_RE.exec(text)) !== null) {
        const id = m[2]
        const target = this.resolve(id)
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

  private resolve(id: string): vscode.Uri | undefined {
    if (!this.workspaceRoot) return undefined
    const entry = this.index[id]
    if (!entry) return undefined
    // entry is either "path" or "path:line" (1-based)
    const colonIdx = entry.lastIndexOf(':')
    const hasLine = colonIdx > 0 && /^\d+$/.test(entry.slice(colonIdx + 1))
    const filePath = hasLine ? entry.slice(0, colonIdx) : entry
    const lineNumber = hasLine ? parseInt(entry.slice(colonIdx + 1), 10) - 1 : 0
    const uri = vscode.Uri.file(path.join(this.workspaceRoot, filePath))
    // Encode line number in the fragment (L{line}) — VSCode file links support this
    return lineNumber > 0
      ? uri.with({ fragment: `L${lineNumber + 1}` })
      : uri
  }
}

export function activate(context: vscode.ExtensionContext): void {
  const provider = new SpecdojoLinkProvider()

  // Register for markdown and yaml
  context.subscriptions.push(
    vscode.languages.registerDocumentLinkProvider(
      [
        { scheme: 'file', language: 'markdown' },
        { scheme: 'file', language: 'yaml' },
      ],
      provider,
    ),
  )

  // Reload index when it changes
  const watcher = vscode.workspace.createFileSystemWatcher(`**/${INDEX_REL}`)
  watcher.onDidChange(() => provider.reloadIndex())
  watcher.onDidCreate(() => provider.reloadIndex())
  context.subscriptions.push(watcher)

  // Command: open by ID via quick pick
  context.subscriptions.push(
    vscode.commands.registerCommand('specdojo.openById', async () => {
      const id = await vscode.window.showInputBox({
        prompt: 'Enter a SpecDojo document ID',
        placeHolder: 'e.g. prj-overview-rulebook or prj-0001:pm-roles',
      })
      if (!id) return

      const ws = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
      if (!ws) return
      const indexPath = path.join(ws, INDEX_REL)
      if (!fs.existsSync(indexPath)) {
        vscode.window.showWarningMessage(
          `SpecDojo index not found. Run: specdojo index build`,
        )
        return
      }
      const data = JSON.parse(fs.readFileSync(indexPath, 'utf8')) as DocIndex
      const entry = data.entries[id]
      if (!entry) {
        vscode.window.showWarningMessage(`ID not found: ${id}`)
        return
      }
      const colonIdx = entry.lastIndexOf(':')
      const hasLine = colonIdx > 0 && /^\d+$/.test(entry.slice(colonIdx + 1))
      const filePath = hasLine ? entry.slice(0, colonIdx) : entry
      const lineNumber = hasLine ? parseInt(entry.slice(colonIdx + 1), 10) - 1 : 0
      const uri = vscode.Uri.file(path.join(ws, filePath))
      const doc = await vscode.workspace.openTextDocument(uri)
      await vscode.window.showTextDocument(doc, {
        selection: new vscode.Range(lineNumber, 0, lineNumber, 0),
      })
    }),
  )
}

export function deactivate(): void {}
