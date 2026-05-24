import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  type ClaimNextSnapshot,
  type CpmResult,
  type ReadySnapshot,
  type ScheduleIndex,
  type SchedulerStrategy,
} from './exec-types.js'
import { executionRootForProject, generatedDirForProject } from './exec-project.js'
import { ensureDir, toArtifactPath, toScheduleFilePath, writeJson } from './exec-shared.js'

export function orderReadyIds(
  ready: string[],
  cpm: CpmResult | null,
  strategy: SchedulerStrategy
): string[] {
  const ordered = [...ready]
  if (ordered.length === 0) return ordered

  if (strategy === 'fifo' || !cpm) {
    ordered.sort((a, b) => a.localeCompare(b))
    return ordered
  }

  ordered.sort((a, b) => {
    const an = cpm.nodes[a]
    const bn = cpm.nodes[b]
    if (an && bn) {
      if (an.slack !== bn.slack) return an.slack - bn.slack
      if (an.es !== bn.es) return an.es - bn.es
      return a.localeCompare(b)
    }
    if (an && !bn) return -1
    if (!an && bn) return 1
    return a.localeCompare(b)
  })

  return ordered
}

export function buildReadySnapshot(
  projectPath: string,
  schedule: ScheduleIndex,
  ready: string[],
  cpm: CpmResult | null
): ReadySnapshot {
  const fifo = orderReadyIds(ready, cpm, 'fifo')
  const criticalFirst = orderReadyIds(ready, cpm, 'critical-first')
  const fifoRank = new Map(fifo.map((id, idx) => [id, idx + 1]))
  const criticalRank = new Map(criticalFirst.map((id, idx) => [id, idx + 1]))
  const executionPath = executionRootForProject(projectPath)
  const generatedDir = generatedDirForProject(projectPath)

  const tasks = criticalFirst.map(id => {
    const node = schedule.nodes.get(id)
    const cpmNode = cpm?.nodes[id]
    return {
      id,
      name: node?.name,
      owner: node?.owner,
      schedule_file: node?.schedule_file ? toScheduleFilePath(projectPath, node.schedule_file) : '',
      fifo_rank: fifoRank.get(id) ?? 0,
      critical_first_rank: criticalRank.get(id) ?? 0,
      cpm: cpmNode
        ? {
            es: cpmNode.es,
            ef: cpmNode.ef,
            ls: cpmNode.ls,
            lf: cpmNode.lf,
            slack: cpmNode.slack,
          }
        : undefined,
    }
  })

  return {
    schedule_path: toArtifactPath(projectPath),
    execution_path: toArtifactPath(executionPath),
    generated_dir: toArtifactPath(generatedDir),
    ready_count: ready.length,
    default_strategy: 'critical-first',
    strategies: {
      'critical-first': {
        next_task_id: criticalFirst[0] ?? null,
        ordered_task_ids: criticalFirst,
      },
      fifo: {
        next_task_id: fifo[0] ?? null,
        ordered_task_ids: fifo,
      },
    },
    tasks,
  }
}

export function writeReadyFiles(projectPath: string, readySnapshot: ReadySnapshot): void {
  const genDir = generatedDirForProject(projectPath)
  ensureDir(genDir)

  writeJson(join(genDir, 'ready.json'), readySnapshot)

  const claimNext: ClaimNextSnapshot = {
    schedule_path: readySnapshot.schedule_path,
    execution_path: readySnapshot.execution_path,
    generated_dir: readySnapshot.generated_dir,
    default_strategy: readySnapshot.default_strategy,
    strategies: readySnapshot.strategies,
  }
  writeJson(join(genDir, 'claim-next.json'), claimNext)

  const lines: string[] = []
  lines.push(`# Ready Tasks`)
  lines.push('')
  lines.push(`- schedule_path: \`${readySnapshot.schedule_path}\``)
  lines.push(`- execution_path: \`${readySnapshot.execution_path}\``)
  lines.push(`- ready_count: \`${readySnapshot.ready_count}\``)
  lines.push(`- default_strategy: \`${readySnapshot.default_strategy}\``)
  lines.push('')
  lines.push(`## Claim Targets`)
  lines.push('')
  lines.push(`| strategy | next_task_id |`)
  lines.push(`|---|---|`)
  lines.push(
    `| critical-first | ${readySnapshot.strategies['critical-first'].next_task_id ? `\`${readySnapshot.strategies['critical-first'].next_task_id}\`` : '_none_'} |`
  )
  lines.push(
    `| fifo | ${readySnapshot.strategies.fifo.next_task_id ? `\`${readySnapshot.strategies.fifo.next_task_id}\`` : '_none_'} |`
  )
  lines.push('')

  if (!readySnapshot.tasks.length) {
    lines.push('_No ready tasks._')
    lines.push('')
  } else {
    lines.push(`## Ready Order (critical-first)`)
    lines.push('')
    lines.push(`| rank | id | owner | slack | ES | schedule_file |`)
    lines.push(`|---:|---|---|---:|---:|---|`)
    for (const task of readySnapshot.tasks) {
      lines.push(
        `| ${task.critical_first_rank} | \`${task.id}\` | ${task.owner ?? '-'} | ${task.cpm?.slack ?? '-'} | ${task.cpm?.es ?? '-'} | ${task.schedule_file || '-'} |`
      )
    }
    lines.push('')
    lines.push(`## FIFO Order`)
    lines.push('')
    for (const id of readySnapshot.strategies.fifo.ordered_task_ids) lines.push(`- \`${id}\``)
    lines.push('')
  }

  writeFileSync(join(genDir, 'ready.md'), lines.join('\n'), 'utf8')
}

export function selectNextTask(
  ready: string[],
  cpm: CpmResult | null,
  strategy: SchedulerStrategy
): string | null {
  return orderReadyIds(ready, cpm, strategy)[0] ?? null
}
