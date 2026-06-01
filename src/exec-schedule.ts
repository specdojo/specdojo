import { existsSync, writeFileSync } from 'node:fs'
import { extname, join } from 'node:path'
import {
  type CpmResult,
  type ExecEventV1,
  type ScheduleIndex,
  type StateSnapshot,
  type ValidateResult,
} from './exec-types.js'
import { computeReadyIds, foldEventsToState, validateEventShape } from './exec-events.js'
import {
  ensureDir,
  listFilesRecursive,
  readJson,
  toArtifactPath,
  toScheduleFilePath,
  writeJson,
} from './exec-shared.js'
import {
  eventsDirForProject,
  executionRootForProject,
  generatedDirForProject,
} from './exec-project.js'
import {
  buildProgressSummaryLines,
  buildTimelineMarkdown,
  buildTimelineSvg,
} from './exec-schedule-timeline.js'
import { buildScheduleIndex } from './exec-schedule-index.js'
import { computeCpm, topoSort } from './exec-schedule-cpm.js'
import {
  buildReadySnapshot,
  orderReadyIds,
  writeReadyFiles,
  selectNextTask,
} from './exec-schedule-ready.js'
import { writeScheduleHashAndDiff } from './exec-schedule-hash.js'
import { buildInitialStateFromStrategy } from './exec-schedule-initial.js'
import { buildPhaseModeIndex, resolveTaskMode } from './exec-strategy.js'

export function validateAll(projectPath: string): ValidateResult {
  const errors: string[] = []
  const warnings: string[] = []

  const schedule = buildScheduleIndex(projectPath)
  const scheduleIds = new Set<string>(Array.from(schedule.nodes.keys()))

  if (schedule.nodes.size === 0) {
    warnings.push(`No schedule nodes loaded from sch-*.yaml under: ${projectPath}`)
  }

  for (const node of schedule.nodes.values()) {
    for (const dep of node.depends_on) {
      if (!schedule.nodes.has(dep)) {
        errors.push(`${node.schedule_file}: ${node.id} depends_on missing id: ${dep}`)
      }
    }
  }

  const topo = topoSort(schedule)
  if (topo.cycle && topo.cycle.length) {
    errors.push(`schedule dependency cycle detected (nodes involved): ${topo.cycle.join(', ')}`)
  }

  const eventsDir = eventsDirForProject(projectPath)
  if (!existsSync(eventsDir)) warnings.push(`No exec/events directory: ${eventsDir}`)

  const files = listFilesRecursive(eventsDir).filter(p => extname(p).toLowerCase() === '.json')
  let parsedEvents = 0

  for (const f of files) {
    let obj: unknown
    try {
      obj = readJson(f)
    } catch {
      errors.push(`${f}: failed to parse JSON`)
      continue
    }
    const shapeErrs = validateEventShape(obj, f)
    errors.push(...shapeErrs)
    if (shapeErrs.length === 0) {
      parsedEvents++
      const ev = obj as ExecEventV1
      if (!scheduleIds.has(ev.task_id))
        errors.push(`${f}: task_id ${ev.task_id} not found in sch-*.yaml`)
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    stats: {
      events: parsedEvents,
      event_files: files.length,
      schedule_ids: schedule.nodes.size,
      schedule_files: schedule.files.length,
    },
  }
}

export function printValidateResult(res: ValidateResult): void {
  process.stdout.write(res.ok ? 'OK: validation passed\n' : 'NG: validation failed\n')
  process.stdout.write(
    `stats: events=${res.stats.events}, event_files=${res.stats.event_files}, schedule_ids=${res.stats.schedule_ids}, schedule_files=${res.stats.schedule_files}\n`
  )
  if (res.warnings.length) {
    process.stdout.write('\nWarnings:\n')
    for (const w of res.warnings) process.stdout.write(`- ${w}\n`)
  }
  if (res.errors.length) {
    process.stdout.write('\nErrors:\n')
    for (const e of res.errors) process.stdout.write(`- ${e}\n`)
  }
}

export function exitWithCode(ok: boolean): void {
  process.exitCode = ok ? 0 : 1
}

export function writeCpmFiles(
  projectPath: string,
  cpm: CpmResult,
  stateSnapshot?: StateSnapshot
): void {
  const genDir = generatedDirForProject(projectPath)
  ensureDir(genDir)

  writeJson(join(genDir, 'cpm.json'), cpm)

  const rows = Object.values(cpm.nodes).sort((a, b) => a.es - b.es || a.id.localeCompare(b.id))
  const lines: string[] = []
  lines.push(`# CPM`)
  lines.push('')
  lines.push(`- project_duration_days: \`${cpm.project_duration_days}\``)
  lines.push('')
  lines.push(`| id | owner | kind | dur | ES | EF | LS | LF | slack | depends_on |`)
  lines.push(`|---|---|---:|---:|---:|---:|---:|---:|---:|---|`)
  for (const r of rows) {
    lines.push(
      `| \`${r.id}\` | ${r.owner ?? '-'} | ${r.kind} | ${r.duration_days} | ${r.es} | ${r.ef} | ${r.ls} | ${r.lf} | ${r.slack} | ${r.depends_on.join(', ')} |`
    )
  }
  lines.push('')
  writeFileSync(join(genDir, 'cpm.md'), lines.join('\n'), 'utf8')

  const cp: string[] = []
  cp.push(`# Critical Path`)
  cp.push('')
  cp.push(`- project_duration_days: \`${cpm.project_duration_days}\``)
  cp.push('')
  if (!cpm.critical_path.length) cp.push('_No critical path computed._')
  else {
    cp.push(`Critical path (one path, tie-broken):`)
    cp.push('')
    for (const id of cpm.critical_path) {
      const n = cpm.nodes[id]
      cp.push(`- \`${id}\`${n.name ? ` — ${n.name}` : ''} (ES=${n.es}, EF=${n.ef})`)
    }
  }
  cp.push('')
  writeFileSync(join(genDir, 'critical-path.md'), cp.join('\n'), 'utf8')

  const schedule = buildScheduleIndex(projectPath)
  const criticalSet = new Set(cpm.critical_path)
  const taskRows = rows.filter(row => row.kind === 'task')
  const stateCounts: Record<'todo' | 'doing' | 'blocked' | 'done' | 'cancelled', number> = {
    todo: 0,
    doing: 0,
    blocked: 0,
    done: 0,
    cancelled: 0,
  }

  for (const row of taskRows) {
    const state = stateSnapshot?.tasks[row.id]?.state ?? 'todo'
    stateCounts[state] += 1
  }

  const doneCount = stateCounts.done
  const totalTaskCount = taskRows.length
  const progressPercent =
    totalTaskCount > 0 ? ((doneCount / totalTaskCount) * 100).toFixed(1) : '0.0'
  const ready = computeReadyIds(schedule, {
    schedule_path: cpm.schedule_path,
    tasks: stateSnapshot?.tasks ?? {},
  })
  const readyOrdered = orderReadyIds(ready, cpm, 'critical-first')
  const criticalDoingCount = taskRows.filter(
    row => criticalSet.has(row.id) && (stateSnapshot?.tasks[row.id]?.state ?? 'todo') === 'doing'
  ).length
  const progressSummaryLines = buildProgressSummaryLines({
    cpm,
    schedule,
    stateCounts,
    totalTaskCount,
    readyCount: ready.length,
    nextTaskId: readyOrdered[0] ?? null,
    criticalDoingCount,
  })

  writeFileSync(
    join(genDir, 'timeline.svg'),
    buildTimelineSvg(cpm, schedule, stateSnapshot),
    'utf8'
  )
  writeFileSync(
    join(genDir, 'timeline.md'),
    buildTimelineMarkdown(cpm, {
      criticalPathTaskCount: criticalSet.size,
      progressPercent,
      doneTasks: `${doneCount}/${totalTaskCount}`,
      taskStateCounts: `todo=${stateCounts.todo}, doing=${stateCounts.doing}, blocked=${stateCounts.blocked}, done=${stateCounts.done}, cancelled=${stateCounts.cancelled}`,
      progressSummaryLines,
    }),
    'utf8'
  )
}

export function writeGeneratedCore(
  projectPath: string,
  events: { path: string; event: ExecEventV1 }[],
  schedule: ScheduleIndex,
  cpm: CpmResult | null
): StateSnapshot {
  const genDir = generatedDirForProject(projectPath)
  ensureDir(genDir)

  const jsonl = events.map(x => JSON.stringify(x.event)).join('\n') + (events.length ? '\n' : '')
  writeFileSync(join(genDir, 'exec.jsonl'), jsonl, 'utf8')

  const initialTasks = buildInitialStateFromStrategy(projectPath, schedule)
  const snapshot = foldEventsToState(events, schedule, projectPath, initialTasks)
  writeJson(join(genDir, 'state.json'), snapshot)

  const ready = computeReadyIds(schedule, snapshot)
  const readySnapshot = buildReadySnapshot(projectPath, schedule, ready, cpm)
  const executionPath = executionRootForProject(projectPath)
  const phaseModeIndex = buildPhaseModeIndex(projectPath, executionPath)
  for (const task of readySnapshot.tasks) {
    task.phase_mode = resolveTaskMode(task.local_id, task.id, phaseModeIndex)
  }
  writeReadyFiles(projectPath, readySnapshot)

  writeJson(join(genDir, 'metadata.json'), {
    schedule_path: toArtifactPath(projectPath),
    execution_path: toArtifactPath(executionRootForProject(projectPath)),
    generated_dir: toArtifactPath(genDir),
    schedule_files: schedule.files.map(p => toScheduleFilePath(projectPath, p)).sort(),
    event_files_count: events.length,
    default_scheduler_strategy: 'critical-first',
    derived_files: [
      'agent-briefs/index.md',
      'claim-next.json',
      'cpm.json',
      'cpm.md',
      'critical-path.md',
      'exec.jsonl',
      'metadata.json',
      'ready.json',
      'ready.md',
      'schedule-diff.md',
      'schedule-hash.json',
      'state.json',
      'task-catalog.md',
      'timeline.md',
      'timeline.svg',
    ],
  })

  return snapshot
}

export { buildScheduleIndex, computeCpm, selectNextTask, writeScheduleHashAndDiff }
