import { Command } from 'commander'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { loadConfig, loadEnv, specdojoRootDir } from './specdojo-config.js'

// ================================
// Types
// ================================

type RegisterPaths = {
  projectId: string
  projectRegisterPath: string
  pjrIndexPath: string
  generatedPath: string
  controlsGeneratedPath: string
}

type PjrItem = {
  id: string
  status: string
  title: string
  description: string
  type: string
  priority: string
  owner: string
  due: string
  completed: string
  conclusion: string
  ticket: string
}

// ================================
// Constants
// ================================

const VALID_STATUSES = [
  'open', 'in-progress', 'waiting', 'review',
  'decided', 'done', 'deferred', 'rejected',
] as const

const VALID_TYPES = [
  'todo', 'question', 'risk', 'issue',
  'change-request', 'decision', 'dependency', 'note',
] as const

const VALID_PRIORITIES = ['high', 'medium', 'low'] as const

const TABLE_HEADER = '| ID | ステータス | タイトル | 説明 | 分類 | 優先度 | 担当 | 期限 | 完了日 | 結論 | 個票 |'
const TABLE_SEPARATOR = '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |'

// ================================
// Path Resolution
// ================================

function resolveRegisterPaths(opts: { project?: string }): RegisterPaths {
  loadEnv()
  const { config, configPath } = loadConfig()
  const baseDir = dirname(configPath)

  const projectId =
    opts.project?.trim() ||
    process.env.SPECDOJO_PROJECT?.trim() ||
    (config ? Object.keys(config.projects)[0] : '')

  if (!config) {
    throw new Error(`register commands require specdojo.config.json.\nRun: specdojo config init`)
  }
  if (!projectId) {
    throw new Error(`No project specified. Use --project <id> or SPECDOJO_PROJECT.`)
  }

  const project = config.projects[projectId]
  if (!project) {
    throw new Error(`Unknown project: ${projectId} (check ${configPath})`)
  }

  const rawRegisterPath = project.project_register_path?.trim()
  if (!rawRegisterPath) {
    throw new Error(
      `project_register_path not set for project '${projectId}' in ${configPath}.\n` +
      `Add "project_register_path": "<path>" to the project config.`
    )
  }

  const absRegisterPath = resolve(baseDir, rawRegisterPath)
  return {
    projectId,
    projectRegisterPath: absRegisterPath,
    pjrIndexPath: join(absRegisterPath, 'pjr-index.md'),
    generatedPath: join(absRegisterPath, 'generated'),
    controlsGeneratedPath: join(dirname(absRegisterPath), 'generated'),
  }
}

// ================================
// Markdown Table Parsing
// ================================

function parseTableCells(line: string): string[] {
  // Replace escaped pipes with placeholder before splitting
  const PIPE = '\x01'
  const normalized = line.replace(/\\\|/g, PIPE)
  const cells = normalized
    .split('|')
    .map(c => c.replace(new RegExp(PIPE, 'g'), '\\|').trim())
  // Remove first and last empty elements (line starts and ends with |)
  return cells.slice(1, cells.length - 1)
}

function isTableSeparator(line: string): boolean {
  return line.startsWith('|') && /\|\s*---+\s*\|/.test(line)
}

function parsePjrIndex(content: string): PjrItem[] {
  const lines = content.split('\n')
  const items: PjrItem[] = []
  let inSection = false

  for (const line of lines) {
    if (/^## 1\.\s+登録項目一覧/.test(line)) {
      inSection = true
      continue
    }
    if (inSection && /^## /.test(line)) break
    if (!inSection) continue
    if (!line.startsWith('|') || isTableSeparator(line)) continue

    const cells = parseTableCells(line)
    if (cells.length < 11) continue
    if (!/^PJR-\d{4}$/.test(cells[0])) continue

    items.push({
      id: cells[0],
      status: cells[1],
      title: cells[2],
      description: cells[3],
      type: cells[4],
      priority: cells[5],
      owner: cells[6],
      due: cells[7],
      completed: cells[8],
      conclusion: cells[9],
      ticket: cells[10],
    })
  }

  return items
}

function getNextPjrId(items: PjrItem[]): string {
  const maxNum = items.reduce((max, item) => {
    const m = item.id.match(/^PJR-(\d{4})$/)
    return m ? Math.max(max, parseInt(m[1], 10)) : max
  }, 0)
  return `PJR-${String(maxNum + 1).padStart(4, '0')}`
}

function formatTableRow(item: PjrItem): string {
  return `| ${item.id} | ${item.status} | ${item.title} | ${item.description} | ${item.type} | ${item.priority} | ${item.owner} | ${item.due} | ${item.completed} | ${item.conclusion} | ${item.ticket} |`
}

function insertRowAfterLast(content: string, newRow: string): string {
  const lines = content.split('\n')
  let inSection = false
  let lastRowIndex = -1
  let separatorIndex = -1

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (/^## 1\.\s+登録項目一覧/.test(line)) {
      inSection = true
      continue
    }
    if (inSection && /^## /.test(line)) break
    if (!inSection) continue

    if (isTableSeparator(line)) {
      separatorIndex = i
      continue
    }

    if (line.startsWith('|')) {
      const cells = parseTableCells(line)
      if (cells.length >= 1 && /^PJR-\d{4}$/.test(cells[0])) {
        lastRowIndex = i
      }
    }
  }

  const insertAfter = lastRowIndex !== -1 ? lastRowIndex : separatorIndex
  if (insertAfter === -1) {
    throw new Error('Could not find table structure in pjr-index.md')
  }

  lines.splice(insertAfter + 1, 0, newRow)
  return lines.join('\n')
}

// ================================
// Validation
// ================================

function validateFields(opts: {
  status: string
  type: string
  priority: string
  due: string
  completed: string
  id?: string
}): void {
  const errors: string[] = []

  if (!(VALID_STATUSES as readonly string[]).includes(opts.status)) {
    errors.push(`Invalid status: "${opts.status}". Must be one of: ${VALID_STATUSES.join(', ')}`)
  }
  if (!(VALID_TYPES as readonly string[]).includes(opts.type)) {
    errors.push(`Invalid type: "${opts.type}". Must be one of: ${VALID_TYPES.join(', ')}`)
  }
  if (!(VALID_PRIORITIES as readonly string[]).includes(opts.priority)) {
    errors.push(`Invalid priority: "${opts.priority}". Must be one of: ${VALID_PRIORITIES.join(', ')}`)
  }
  if (opts.id && !/^PJR-\d{4}$/.test(opts.id)) {
    errors.push(`Invalid ID: "${opts.id}". Must match PJR-XXXX (e.g., PJR-0001)`)
  }
  if (!/^(\d{4}-\d{2}-\d{2}|-|_TODO_)$/.test(opts.due)) {
    errors.push(`Invalid due: "${opts.due}". Must be YYYY-MM-DD, -, or _TODO_`)
  }
  if (!/^(\d{4}-\d{2}-\d{2}|-)$/.test(opts.completed)) {
    errors.push(`Invalid completed: "${opts.completed}". Must be YYYY-MM-DD or -`)
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'))
  }
}

// ================================
// Slug
// ================================

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .trim()
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'item'
  )
}

// ================================
// Ticket Generation
// ================================

function getTitlePlaceholder(type: string): string {
  return `_${type.toUpperCase().replace(/-/g, '_')}_TITLE_`
}

function generateTicket(opts: {
  projectId: string
  displayId: string
  type: string
  title: string
  templatePath: string
}): string {
  if (!existsSync(opts.templatePath)) {
    throw new Error(`Template not found: ${opts.templatePath}`)
  }

  let content = readFileSync(opts.templatePath, 'utf8')
  const pjrLower = opts.displayId.toLowerCase()

  // Replace frontmatter id pattern first to keep it lowercase
  content = content.replace(/_PRJ-0000_:_PJR-XXXX_/g, `${opts.projectId}:${pjrLower}`)
  // Replace remaining project id placeholder
  content = content.replace(/_PRJ-0000_/g, opts.projectId)
  // Replace display id placeholder with uppercase
  content = content.replace(/_PJR-XXXX_/g, opts.displayId)
  // Replace type-specific title placeholder
  const titlePh = getTitlePlaceholder(opts.type)
  content = content.replace(new RegExp(titlePh.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), opts.title)

  return content
}

// ================================
// Derived View Generation
// ================================

function adjustTicketLink(ticket: string, prefix: string): string {
  if (ticket === '-') return ticket
  return ticket.replace(/\]\(\.\//g, `](${prefix}`)
}

function rebaseItems(items: PjrItem[], prefix: string): PjrItem[] {
  return items.map(it => ({ ...it, ticket: adjustTicketLink(it.ticket, prefix) }))
}

function makeTable(items: PjrItem[]): string {
  const rows = items.map(formatTableRow)
  return [TABLE_HEADER, TABLE_SEPARATOR, ...rows].join('\n')
}

function derivedViewNote(): string {
  return '> このファイルは `pjr-index.md` から生成された派生ビューです。正本は `pjr-index.md` と各 `pjr-XXXX-<topic>.md` であり、このファイルは再生成可能です。'
}

function generateOpenItemsView(items: PjrItem[]): string {
  const filtered = items.filter(it => !['done', 'rejected', 'deferred'].includes(it.status))
  return [
    '# 未完了項目一覧',
    '',
    derivedViewNote(),
    '',
    '<!-- prettier-ignore -->',
    makeTable(filtered),
    '',
  ].join('\n')
}

function generateByOwnerView(items: PjrItem[]): string {
  const grouped = new Map<string, PjrItem[]>()
  for (const item of items) {
    const key = item.owner || '-'
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(item)
  }

  const sections: string[] = [
    '# 担当者別一覧',
    '',
    derivedViewNote(),
  ]

  let num = 1
  for (const owner of [...grouped.keys()].sort()) {
    sections.push('', `## ${num}. ${owner}`, '', '<!-- prettier-ignore -->', makeTable(grouped.get(owner)!))
    num++
  }

  return sections.join('\n') + '\n'
}

function generateByPriorityView(items: PjrItem[]): string {
  const sections: string[] = [
    '# 優先度別一覧',
    '',
    derivedViewNote(),
  ]

  let num = 1
  for (const priority of VALID_PRIORITIES) {
    const filtered = items.filter(it => it.priority === priority)
    sections.push('', `## ${num}. ${priority}`, '', '<!-- prettier-ignore -->', makeTable(filtered))
    num++
  }

  return sections.join('\n') + '\n'
}

function generateByStatusView(items: PjrItem[]): string {
  const sections: string[] = [
    '# 状態別一覧',
    '',
    derivedViewNote(),
  ]

  let num = 1
  for (const status of VALID_STATUSES) {
    const filtered = items.filter(it => it.status === status)
    if (filtered.length === 0) continue
    sections.push('', `## ${num}. ${status}`, '', '<!-- prettier-ignore -->', makeTable(filtered))
    num++
  }

  return sections.join('\n') + '\n'
}

function generateTypeFilterView(items: PjrItem[], type: string, title: string): string {
  const filtered = items.filter(it => it.type === type)
  return [
    `# ${title}`,
    '',
    derivedViewNote(),
    '',
    '<!-- prettier-ignore -->',
    makeTable(filtered),
    '',
  ].join('\n')
}

// ================================
// Error Handling & Shared Helpers
// ================================

function printCommandError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error)
  process.stdout.write(message + '\n')
  process.exitCode = 1
}

function addProjectOption(cmd: Command): Command {
  return cmd.option('--project <projectId>', 'Project id in specdojo.config.json')
}

// ================================
// Command Registration
// ================================

export function registerRegisterCommands(program: Command): void {
  const reg = program.command('register').description('Project register (pjr-index.md) commands')

  // --- scaffold ---
  const scmd = reg.command('scaffold').description('Generate pjr-index.md from template')
  addProjectOption(scmd)
  scmd.option('--project-id <id>', 'Project ID to embed (defaults to --project value)')
  scmd.option('--force', 'Overwrite existing pjr-index.md', false)
  scmd.option('--dry-run', 'Print generated content to stdout without writing', false)
  scmd.action(opts => {
    try {
      const paths = resolveRegisterPaths(opts)
      const embedId = opts.projectId?.trim() || paths.projectId

      const templatePath = join(specdojoRootDir(), 'docs/ja/specdojo/templates/pjr-index-template.md')
      if (!existsSync(templatePath)) {
        throw new Error(`Template not found: ${templatePath}`)
      }

      if (!opts.force && existsSync(paths.pjrIndexPath)) {
        process.stdout.write(
          `Skipped (already exists; use --force to overwrite): ${paths.pjrIndexPath}\n`
        )
        return
      }

      let content = readFileSync(templatePath, 'utf8')
      content = content.replace(/_PRJ-0000_/g, embedId)

      if (opts.dryRun) {
        process.stdout.write(content)
        return
      }

      mkdirSync(paths.projectRegisterPath, { recursive: true })
      mkdirSync(paths.generatedPath, { recursive: true })
      writeFileSync(paths.pjrIndexPath, content, 'utf8')
      process.stdout.write(`Created: ${paths.pjrIndexPath}\n`)
      process.stdout.write(`Created: ${paths.generatedPath}/\n`)
    } catch (error) {
      printCommandError(error)
    }
  })

  // --- add ---
  const acmd = reg.command('add').description('Add a new item to pjr-index.md')
  addProjectOption(acmd)
  acmd.requiredOption('--type <type>', `Item type: ${VALID_TYPES.join(' | ')}`)
  acmd.requiredOption('--title <title>', 'Short title for the item')
  acmd.option('--description <text>', 'Description shown in the list', '_TODO_')
  acmd.option('--priority <priority>', `Priority: ${VALID_PRIORITIES.join(' | ')}`, 'medium')
  acmd.option('--status <status>', `Status: ${VALID_STATUSES.join(' | ')}`, 'open')
  acmd.option('--owner <owner>', 'Owner or role', '_TODO_')
  acmd.option('--due <date>', 'Due date (YYYY-MM-DD, -, or _TODO_)', '_TODO_')
  acmd.option('--completed <date>', 'Completion date (YYYY-MM-DD or -)', '-')
  acmd.option('--conclusion <text>', 'Conclusion or resolution summary', '-')
  acmd.option('--id <id>', 'Display ID (e.g., PJR-0061); auto-incremented if omitted')
  acmd.option('--ticket', 'Also generate individual ticket file', false)
  acmd.option('--topic <topic>', 'Topic slug for ticket filename; derived from --title if omitted')
  acmd.option('--force', 'Overwrite existing ticket file', false)
  acmd.option('--dry-run', 'Print new row and ticket content without writing', false)
  acmd.action(opts => {
    try {
      const paths = resolveRegisterPaths(opts)

      if (!existsSync(paths.pjrIndexPath)) {
        throw new Error(
          `pjr-index.md not found: ${paths.pjrIndexPath}\n` +
          `Run: specdojo register scaffold --project ${opts.project || paths.projectId}`
        )
      }

      const originalContent = readFileSync(paths.pjrIndexPath, 'utf8')
      const existingItems = parsePjrIndex(originalContent)

      const displayId = opts.id?.trim() || getNextPjrId(existingItems)

      validateFields({
        status: opts.status,
        type: opts.type,
        priority: opts.priority,
        due: opts.due,
        completed: opts.completed,
        id: displayId,
      })

      if (opts.id && existingItems.some(it => it.id === displayId)) {
        throw new Error(`ID already exists in pjr-index.md: ${displayId}`)
      }

      const topic = opts.topic?.trim() || slugify(opts.title)
      const ticketFilename = `${displayId.toLowerCase()}-${topic}.md`
      const ticketRef = opts.ticket
        ? `[${ticketFilename.replace('.md', '')}](./${ticketFilename})`
        : '-'

      const newItem: PjrItem = {
        id: displayId,
        status: opts.status,
        title: opts.title,
        description: opts.description,
        type: opts.type,
        priority: opts.priority,
        owner: opts.owner,
        due: opts.due,
        completed: opts.completed,
        conclusion: opts.conclusion,
        ticket: ticketRef,
      }

      const newRow = formatTableRow(newItem)

      if (opts.dryRun) {
        process.stdout.write(`New row:\n${newRow}\n`)
        if (opts.ticket) {
          const templatePath = join(
            specdojoRootDir(),
            `docs/ja/specdojo/templates/pjr-${opts.type}-template.md`
          )
          const ticketContent = generateTicket({
            projectId: paths.projectId,
            displayId,
            type: opts.type,
            title: opts.title,
            templatePath,
          })
          process.stdout.write(`\nTicket (${ticketFilename}):\n${ticketContent}\n`)
        }
        return
      }

      const updatedContent = insertRowAfterLast(originalContent, newRow)
      writeFileSync(paths.pjrIndexPath, updatedContent, 'utf8')
      process.stdout.write(`Updated: ${paths.pjrIndexPath} (added ${displayId})\n`)

      if (opts.ticket) {
        const ticketPath = join(paths.projectRegisterPath, ticketFilename)
        if (!opts.force && existsSync(ticketPath)) {
          process.stdout.write(
            `Skipped ticket (already exists; use --force to overwrite): ${ticketPath}\n`
          )
        } else {
          const templatePath = join(
            specdojoRootDir(),
            `docs/ja/specdojo/templates/pjr-${opts.type}-template.md`
          )
          const ticketContent = generateTicket({
            projectId: paths.projectId,
            displayId,
            type: opts.type,
            title: opts.title,
            templatePath,
          })
          writeFileSync(ticketPath, ticketContent, 'utf8')
          process.stdout.write(`Created ticket: ${ticketPath}\n`)
        }
      }
    } catch (error) {
      printCommandError(error)
    }
  })

  // --- build ---
  const bcmd = reg.command('build').description('Generate derived views from pjr-index.md')
  addProjectOption(bcmd)
  bcmd.option('--scope <scope>', 'Generation scope: register | controls | all', 'all')
  bcmd.option('--dry-run', 'Print generated content without writing', false)
  bcmd.action(opts => {
    try {
      const paths = resolveRegisterPaths(opts)

      if (!existsSync(paths.pjrIndexPath)) {
        throw new Error(
          `pjr-index.md not found: ${paths.pjrIndexPath}\n` +
          `Run: specdojo register scaffold --project ${opts.project || paths.projectId}`
        )
      }

      const validScopes = ['register', 'controls', 'all']
      if (!validScopes.includes(opts.scope)) {
        throw new Error(`Invalid scope: "${opts.scope}". Must be one of: ${validScopes.join(', ')}`)
      }

      const content = readFileSync(paths.pjrIndexPath, 'utf8')
      const items = parsePjrIndex(content)

      // Ticket links in pjr-index.md use ./ relative to project-register/.
      // Rebase them so links remain valid from each generated/ directory.
      const pjrDirName = basename(paths.projectRegisterPath)
      const regItems = rebaseItems(items, '../')
      const ctrlItems = rebaseItems(items, `../${pjrDirName}/`)

      type ViewFile = { path: string; content: string }
      const registerViews: ViewFile[] = []
      const controlsViews: ViewFile[] = []

      if (opts.scope === 'register' || opts.scope === 'all') {
        registerViews.push(
          { path: join(paths.generatedPath, 'pjr-open-items.md'), content: generateOpenItemsView(regItems) },
          { path: join(paths.generatedPath, 'pjr-by-owner.md'), content: generateByOwnerView(regItems) },
          { path: join(paths.generatedPath, 'pjr-by-priority.md'), content: generateByPriorityView(regItems) },
          { path: join(paths.generatedPath, 'pjr-by-status.md'), content: generateByStatusView(regItems) },
        )
      }

      if (opts.scope === 'controls' || opts.scope === 'all') {
        controlsViews.push(
          { path: join(paths.controlsGeneratedPath, 'pm-risk-register.md'), content: generateTypeFilterView(ctrlItems, 'risk', 'リスク登録簿') },
          { path: join(paths.controlsGeneratedPath, 'pm-issue-log.md'), content: generateTypeFilterView(ctrlItems, 'issue', '課題ログ') },
          { path: join(paths.controlsGeneratedPath, 'pm-change-request-log.md'), content: generateTypeFilterView(ctrlItems, 'change-request', '変更要求ログ') },
          { path: join(paths.controlsGeneratedPath, 'pm-decision-log.md'), content: generateTypeFilterView(ctrlItems, 'decision', '決定記録') },
        )
      }

      const allViews = [...registerViews, ...controlsViews]

      if (opts.dryRun) {
        for (const view of allViews) {
          process.stdout.write(`=== ${view.path} ===\n${view.content}\n\n`)
        }
        return
      }

      if (registerViews.length > 0) {
        mkdirSync(paths.generatedPath, { recursive: true })
      }
      if (controlsViews.length > 0) {
        mkdirSync(paths.controlsGeneratedPath, { recursive: true })
      }

      for (const view of allViews) {
        writeFileSync(view.path, view.content, 'utf8')
        process.stdout.write(`Generated: ${view.path}\n`)
      }
    } catch (error) {
      printCommandError(error)
    }
  })
}
