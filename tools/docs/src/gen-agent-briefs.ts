#!/usr/bin/env node

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { dirname, extname, join } from 'node:path'
import { load } from 'js-yaml'

type ReadyTask = {
  id: string
  name?: string
  owner?: string
  schedule_file: string
  fifo_rank: number
  critical_first_rank: number
  cpm?: {
    es: number
    ef: number
    ls: number
    lf: number
    slack: number
  }
}

type ReadyJson = {
  schedule_path: string
  execution_path: string
  generated_dir: string
  ready_count: number
  default_strategy: string
  tasks?: ReadyTask[]
}

type ScheduleTask = {
  id: string
  wbs?: string
  name?: string
  owner?: string
  duration_days?: number
  depends_on?: string[]
  tags?: string[]
  notes?: string
}

type ScheduleMilestone = {
  id: string
  name?: string
  owner?: string
  depends_on?: string[]
  tags?: string[]
  notes?: string
}

type ScheduleDoc = {
  project_id?: string
  tasks?: ScheduleTask[]
  milestones?: ScheduleMilestone[]
}

type TaskDetail = {
  id: string
  name: string
  owner: string
  scheduleFile: string
  kind: 'task' | 'milestone'
  wbs: string
  durationDays: string
  dependsOn: string[]
  tags: string[]
  notes: string
  deliverables: string[]
}

type WbsDoc = {
  wbs?: Array<{
    id?: string
    deliverables?: Array<{
      path?: string
    }>
  }>
}

function parseArgs(argv: string[]): {
  schedulePath: string
  executionPath: string
  cliProject: string
} {
  let schedulePath = ''
  let executionPath = ''
  let cliProject = ''

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--schedule-path') {
      schedulePath = argv[++i] ?? ''
    } else if (arg === '--execution-path') {
      executionPath = argv[++i] ?? ''
    } else if (arg === '--cli-project') {
      cliProject = argv[++i] ?? ''
    }
  }

  if (!schedulePath || !executionPath) {
    throw new Error('Usage: gen-agent-briefs.ts --schedule-path <path> --execution-path <path>')
  }

  return { schedulePath, executionPath, cliProject }
}

function listFilesRecursive(dirPath: string): string[] {
  const out: string[] = []
  for (const name of readdirSync(dirPath)) {
    const fullPath = join(dirPath, name)
    const st = statSync(fullPath)
    if (st.isDirectory()) out.push(...listFilesRecursive(fullPath))
    else out.push(fullPath)
  }
  return out
}

function isScheduleYaml(filePath: string): boolean {
  const base = filePath.split('/').pop() ?? filePath
  const ext = extname(base).toLowerCase()
  if (ext !== '.yaml' && ext !== '.yml') return false
  if (base === 'schedule-defaults.yaml' || base === 'schedule-defaults.yml') return false
  return /^sch-.+\.ya?ml$/i.test(base)
}

function isWbsYaml(filePath: string): boolean {
  const base = filePath.split('/').pop() ?? filePath
  const ext = extname(base).toLowerCase()
  if (ext !== '.yaml' && ext !== '.yml') return false
  return /^wbs-.+\.ya?ml$/i.test(base)
}

function safeString(value: unknown, fallback = ''): string {
  if (typeof value !== 'string') return fallback
  const trimmed = value.trim()
  return trimmed || fallback
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map(v => String(v).trim()).filter(Boolean)
}

function cleanupCell(text: string): string {
  return text.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ').trim()
}

function readJsonFile<T>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, 'utf8')) as T
}

function relativeScheduleFile(schedulePath: string, filePath: string): string {
  const normalized = schedulePath.endsWith('/') ? schedulePath : `${schedulePath}/`
  if (filePath.startsWith(normalized)) return filePath.slice(normalized.length)
  return filePath
}

function inferArtifactKind(taskId: string, tags: string[]): string {
  if (taskId.endsWith('-INS')) return 'instruction の起草・レビュー'
  if (taskId.endsWith('-SMP')) return 'sample の起草・レビュー'
  if (tags.includes('rulebook-lifecycle')) return 'rules の起草・レビュー'
  if (tags.includes('derivatives-lifecycle')) return '派生成果物の起草・レビュー'
  return 'タスク定義に従う作業'
}

function criticalityText(slack: number | undefined): string {
  if (slack === undefined) return 'CPM 情報なし'
  if (slack === 0) return 'クリティカルパス上。遅延余裕なし。'
  return `遅延余裕あり（slack=${slack}）。`
}

function wbsPathForSchedule(schedulePath: string): string {
  return join(dirname(schedulePath), '050-wbs')
}

function loadWbsDeliverables(schedulePath: string): Map<string, string[]> {
  const out = new Map<string, string[]>()
  const wbsPath = wbsPathForSchedule(schedulePath)
  if (!existsSync(wbsPath)) return out

  for (const filePath of listFilesRecursive(wbsPath).filter(isWbsYaml).sort()) {
    let doc: WbsDoc
    try {
      doc = load(readFileSync(filePath, 'utf8')) as WbsDoc
    } catch {
      continue
    }

    for (const item of Array.isArray(doc?.wbs) ? doc.wbs : []) {
      const id = safeString(item?.id)
      if (!id) continue
      const deliverables = Array.isArray(item?.deliverables)
        ? item.deliverables.map(deliverable => safeString(deliverable?.path)).filter(Boolean)
        : []
      out.set(id, deliverables)
    }
  }

  return out
}

function selectArtifactCandidates(detail: TaskDetail): string[] {
  const deliverables = detail.deliverables
  if (deliverables.length === 0) return []

  if (detail.id.endsWith('-INS')) {
    const instructionPaths = deliverables.filter(path => path.includes('/instructions/'))
    return instructionPaths.length > 0 ? instructionPaths : deliverables
  }
  if (detail.id.endsWith('-SMP')) {
    const samplePaths = deliverables.filter(path => path.includes('/samples/'))
    return samplePaths.length > 0 ? samplePaths : deliverables
  }
  if (detail.tags.includes('rulebook-lifecycle')) {
    const rulePaths = deliverables.filter(path => path.includes('/rulebooks/'))
    return rulePaths.length > 0 ? rulePaths : deliverables
  }

  return deliverables
}

function selectSecondaryArtifactCandidates(detail: TaskDetail, primaryPaths: string[]): string[] {
  if (detail.deliverables.length === 0) return []
  const primarySet = new Set(primaryPaths)
  return detail.deliverables.filter(path => !primarySet.has(path))
}

function loadTaskDetails(schedulePath: string): {
  projectId: string
  byId: Map<string, TaskDetail>
} {
  const byId = new Map<string, TaskDetail>()
  let projectId = ''
  const wbsDeliverables = loadWbsDeliverables(schedulePath)

  for (const filePath of listFilesRecursive(schedulePath).filter(isScheduleYaml).sort()) {
    let doc: ScheduleDoc
    try {
      doc = load(readFileSync(filePath, 'utf8')) as ScheduleDoc
    } catch {
      continue
    }
    const kind = safeString((doc as any)?.kind)
    if (kind !== 'track' && kind !== 'milestones' && kind !== 'schedule') continue

    if (!projectId) projectId = safeString(doc?.project_id)
    const scheduleFile = relativeScheduleFile(schedulePath, filePath)

    for (const task of Array.isArray(doc?.tasks) ? doc.tasks : []) {
      const id = safeString(task?.id)
      if (!id) continue
      byId.set(id, {
        id,
        name: safeString(task?.name, id),
        owner: safeString(task?.owner, '-'),
        scheduleFile,
        kind: 'task',
        wbs: safeString(task?.wbs, '-'),
        durationDays: typeof task?.duration_days === 'number' ? String(task.duration_days) : '-',
        dependsOn: toStringArray(task?.depends_on),
        tags: toStringArray(task?.tags),
        notes: safeString(task?.notes, '-'),
        deliverables: wbsDeliverables.get(safeString(task?.wbs)) ?? [],
      })
    }

    for (const milestone of Array.isArray(doc?.milestones) ? doc.milestones : []) {
      const id = safeString(milestone?.id)
      if (!id) continue
      byId.set(id, {
        id,
        name: safeString(milestone?.name, id),
        owner: safeString(milestone?.owner, '-'),
        scheduleFile,
        kind: 'milestone',
        wbs: '-',
        durationDays: '0',
        dependsOn: toStringArray(milestone?.depends_on),
        tags: toStringArray(milestone?.tags),
        notes: safeString(milestone?.notes, '-'),
        deliverables: [],
      })
    }
  }

  return { projectId, byId }
}

function buildBriefMarkdown(
  projectId: string,
  cliProject: string,
  readyTask: ReadyTask,
  detail: TaskDetail
): string {
  const lines: string[] = []
  const cpm = readyTask.cpm
  const artifactKind = inferArtifactKind(readyTask.id, detail.tags)
  const commandProject = cliProject || projectId || '<project-id>'
  const primaryArtifactCandidates = selectArtifactCandidates(detail)
  const secondaryArtifactCandidates = selectSecondaryArtifactCandidates(
    detail,
    primaryArtifactCandidates
  )

  lines.push(`# Agent Brief: ${readyTask.id}`)
  lines.push('')
  lines.push('このブリーフは ready 時点の実行ビューであり、進捗の正本ではない。')
  lines.push('進捗・監査・状態判定は exec/events のイベントログを参照する。')
  lines.push('')
  lines.push('## 1. タスク概要')
  lines.push('')
  lines.push(`- task_id: \`${readyTask.id}\``)
  lines.push(`- project_id: \`${projectId || '-'}\``)
  lines.push(`- specdojo_cli_project: \`${commandProject}\``)
  lines.push(`- name: ${detail.name}`)
  lines.push(`- owner: ${detail.owner}`)
  lines.push(`- kind: ${detail.kind}`)
  lines.push(`- artifact_kind: ${artifactKind}`)
  lines.push(`- schedule_file: \`${detail.scheduleFile}\``)
  lines.push(`- wbs: \`${detail.wbs}\``)
  lines.push(`- duration_days: \`${detail.durationDays}\``)
  lines.push('')
  lines.push('## 2. 実施内容')
  lines.push('')
  lines.push(`- primary_goal: ${detail.name}`)
  lines.push(`- schedule_notes: ${detail.notes}`)
  lines.push(
    `- tags: ${detail.tags.length ? detail.tags.map(tag => `\`${tag}\``).join(', ') : '-'}`
  )
  lines.push('')
  lines.push('## 3. 対象成果物候補')
  lines.push('')
  lines.push('primary_paths:')
  lines.push('')
  if (primaryArtifactCandidates.length > 0) {
    for (const path of primaryArtifactCandidates) {
      lines.push(`- ${path}`)
    }
  } else {
    lines.push('- deliverables 未定義。WBS または schedule から対象を確認する。')
  }
  lines.push('')
  lines.push('secondary_paths:')
  lines.push('')
  if (secondaryArtifactCandidates.length > 0) {
    for (const path of secondaryArtifactCandidates) {
      lines.push(`- ${path}`)
    }
  } else {
    lines.push('- なし')
  }
  lines.push('')
  lines.push('## 4. 依存と優先度')
  lines.push('')
  lines.push(
    `- depends_on: ${detail.dependsOn.length ? detail.dependsOn.map(id => `\`${id}\``).join(', ') : '-'}`
  )
  lines.push(`- critical_first_rank: \`${readyTask.critical_first_rank}\``)
  lines.push(`- fifo_rank: \`${readyTask.fifo_rank}\``)
  lines.push(`- urgency: ${criticalityText(cpm?.slack)}`)
  if (cpm) {
    lines.push(
      `- CPM: \`ES=${cpm.es}, EF=${cpm.ef}, LS=${cpm.ls}, LF=${cpm.lf}, slack=${cpm.slack}\``
    )
  }
  lines.push('')
  lines.push('## 5. 実行ガイド')
  lines.push('')
  lines.push('1. 対象 task を claim する。')
  lines.push('2. 対応する rules / instruction / sample の対象を特定する。')
  lines.push('3. task 名と notes に沿って成果物を更新する。')
  lines.push('4. 必要な検証と lint を実行する。')
  lines.push('5. 完了時のみ complete、問題があれば block を記録する。')
  lines.push('')
  lines.push('```bash')
  lines.push(
    `specdojo exec claim --project ${commandProject} --task ${readyTask.id} --by <agent> --msg "start"`
  )
  lines.push(`# edit / validate / lint`)
  lines.push(
    `specdojo exec complete --project ${commandProject} --task ${readyTask.id} --by <agent> --msg "done"`
  )
  lines.push('```')
  lines.push('')
  lines.push('## 6. block 時の記録テンプレート')
  lines.push('')
  lines.push('- block_conditions: 依存未解決、レビュー不能、対象ファイル不明、lint/test 未解消')
  lines.push('- block_msg_template:')
  lines.push('')
  lines.push('```text')
  lines.push('blocked: <reason>; need=<next action>; ref=<path or issue>')
  lines.push('```')
  lines.push('')
  lines.push('```bash')
  lines.push(
    `specdojo exec block --project ${commandProject} --task ${readyTask.id} --by <agent> --msg "blocked: <reason>; need=<next action>; ref=<path or issue>"`
  )
  lines.push('```')
  lines.push('')
  lines.push('## 7. 注意事項')
  lines.push('')
  lines.push('- このファイルに進捗を追記しない。状態は events のみを正本とする。')
  lines.push('- 依存未解決やレビュー不能時は complete ではなく block を記録する。')
  lines.push('- Agent-Ultra 前提でも最終承認の扱いは schedule と運用ルールに従う。')
  lines.push('')
  lines.push('## 8. 参照先')
  lines.push('')
  lines.push(`- ready source: \`generated/ready.json\``)
  lines.push(`- task catalog: \`generated/task-catalog.md\``)
  lines.push(`- CPM summary: \`generated/cpm.md\``)
  lines.push(`- critical path: \`generated/critical-path.md\``)
  lines.push(`- execution events: \`exec/events/*.json\``)
  lines.push('')

  return lines.join('\n')
}

function buildIndexMarkdown(ready: ReadyJson, details: Map<string, TaskDetail>): string {
  const lines: string[] = []
  const tasks = Array.isArray(ready.tasks) ? ready.tasks : []

  lines.push('# Agent Brief Index')
  lines.push('')
  lines.push('ready.json をもとに生成した Agent 向け実行ブリーフ一覧。')
  lines.push('各ブリーフは非正本であり、進捗は保持しない。')
  lines.push('')
  lines.push(`- ready_count: \`${ready.ready_count}\``)
  lines.push(`- default_strategy: \`${ready.default_strategy}\``)
  lines.push('')
  lines.push('| id | owner | name | critical_rank | fifo_rank | slack | brief |')
  lines.push('|---|---|---|---:|---:|---:|---|')

  for (const readyTask of tasks) {
    const detail = details.get(readyTask.id)
    const slack = readyTask.cpm?.slack ?? '-'
    lines.push(
      `| \`${readyTask.id}\` | ${cleanupCell(detail?.owner ?? readyTask.owner ?? '-')} | ${cleanupCell(detail?.name ?? readyTask.name ?? readyTask.id)} | ${readyTask.critical_first_rank} | ${readyTask.fifo_rank} | ${slack} | [${readyTask.id}.md](./${readyTask.id}.md) |`
    )
  }

  lines.push('')
  return lines.join('\n')
}

function buildClaimSnapshotIndexMarkdown(briefsDir: string): string {
  const lines: string[] = []
  const taskDirs = existsSync(briefsDir)
    ? readdirSync(briefsDir)
        .map(name => ({ name, path: join(briefsDir, name) }))
        .filter(entry => statSync(entry.path).isDirectory())
        .sort((a, b) => a.name.localeCompare(b.name))
    : []

  lines.push('# Claim Brief Snapshot Index')
  lines.push('')
  lines.push('claim 時点で固定保存した Agent ブリーフの一覧。')
  lines.push('')
  lines.push('| task_id | snapshots | latest | latest_file |')
  lines.push('|---|---:|---|---|')

  for (const taskDir of taskDirs) {
    const files = readdirSync(taskDir.path)
      .filter(name => name.endsWith('.md'))
      .sort((a, b) => a.localeCompare(b))
    const latest = files.at(-1)
    if (!latest) continue
    lines.push(
      `| \`${taskDir.name}\` | ${files.length} | \`${latest.replace(/\.md$/, '')}\` | [${latest}](./${taskDir.name}/${latest}) |`
    )
  }

  lines.push('')
  return lines.join('\n')
}

function main(): void {
  const { schedulePath, executionPath, cliProject } = parseArgs(process.argv)
  const generatedDir = join(executionPath, 'generated')
  const briefsDir = join(generatedDir, 'agent-briefs')
  const ready = readJsonFile<ReadyJson>(join(generatedDir, 'ready.json'))
  const { projectId, byId } = loadTaskDetails(schedulePath)
  const tasks = Array.isArray(ready.tasks) ? ready.tasks : []
  const claimsDir = join(executionPath, 'exec', 'agent-briefs', 'claims')

  rmSync(briefsDir, { recursive: true, force: true })
  mkdirSync(briefsDir, { recursive: true })
  mkdirSync(claimsDir, { recursive: true })

  for (const readyTask of tasks) {
    const detail = byId.get(readyTask.id)
    if (!detail) continue
    const outPath = join(briefsDir, `${readyTask.id}.md`)
    writeFileSync(outPath, buildBriefMarkdown(projectId, cliProject, readyTask, detail), 'utf8')
  }

  writeFileSync(join(briefsDir, 'index.md'), buildIndexMarkdown(ready, byId), 'utf8')
  writeFileSync(join(claimsDir, 'index.md'), buildClaimSnapshotIndexMarkdown(claimsDir), 'utf8')
  process.stdout.write(`Generated: ${briefsDir}\n`)
}

main()
