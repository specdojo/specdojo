import { spawn } from 'node:child_process'
import { existsSync, rmSync } from 'node:fs'
import { type Command } from 'commander'
import { activateResolvedProjectPaths, resolveProjectPaths } from './exec-project.js'
import { generateSinglePlan } from './exec-plans.js'
import {
  buildTaskPhaseMap,
  loadPrompt,
  loadRosterForExecutionPath,
  resolveTaskPhaseContext,
  selectCandidates,
} from './exec-run.js'
import { requireNonEmpty } from './exec-shared.js'
import { specdojoRootDir, type MemberRoster } from './specdojo-config.js'
import { type ReadyTaskView } from './exec-types.js'
import { buildTaskView } from './exec-worktree-command.js'

type RerunOpts = {
  project?: string
  task?: string
  by?: string
  agentCmd?: string
  keepPlan?: boolean
  dryRun?: boolean
}

// Resolve the agent command for a re-run without consulting task state. Unlike
// the worktree `resolveAgent`, this never requires the task to be `doing`, so a
// completed task can be re-executed against a freshly regenerated plan.
function resolveRerunCommand(
  task: ReadyTaskView,
  roster: MemberRoster | null,
  opts: RerunOpts,
  schedulePath: string
): string {
  const override = opts.agentCmd?.trim()
  if (override) {
    const member = roster?.members.find(
      m => m.type === 'agent' && m.command && m.nickname === override
    )
    return member?.command ?? override
  }

  if ((task.execution ?? 'agent') === 'human') {
    throw new Error(`Task requires human execution. Use --agent-cmd to override: ${task.id}`)
  }

  const requestedActor = opts.by?.trim()
  if (requestedActor) {
    const member = roster?.members.find(
      m => m.nickname === requestedActor && m.type === 'agent' && m.command
    )
    if (!member?.command) {
      throw new Error(`Agent command not found for actor: ${requestedActor}`)
    }
    return member.command
  }

  const maps = buildTaskPhaseMap(schedulePath)
  if (!resolveTaskPhaseContext(task, maps.localIdToPhaseSets, maps.phaseSetSuffixToId)) {
    throw new Error(`Cannot resolve phase context for task: ${task.id}`)
  }
  const candidates = selectCandidates(
    { capabilities: task.capabilities ?? [], proficiency: task.proficiency },
    roster,
    task.mode ?? 'edit'
  )
  const command = candidates[0]?.command
  if (!command) throw new Error(`No agent found for task: ${task.id}`)
  return command
}

async function spawnAgentInPlace(
  command: string,
  prompt: string,
  cwd: string,
  schedulePath: string,
  executionPath: string
): Promise<number> {
  const child = spawn(command, {
    cwd,
    env: {
      ...process.env,
      SPECDOJO_SCHEDULE_PATH: schedulePath,
      SPECDOJO_EXECUTION_PATH: executionPath,
    },
    shell: true,
    stdio: ['pipe', 'inherit', 'inherit'],
  })
  child.stdin.end(prompt)
  return new Promise<number>(resolveExit => {
    child.once('error', () => resolveExit(1))
    child.once('close', code => resolveExit(code ?? 1))
  })
}

async function rerunTask(opts: RerunOpts): Promise<void> {
  const taskId = requireNonEmpty('task', opts.task)
  const paths = resolveProjectPaths({ project: opts.project })
  activateResolvedProjectPaths(paths)
  const { schedulePath, executionPath, catalogPath, rolesPath, viewpointsPath } = paths
  const repoRoot = specdojoRootDir()

  const task = buildTaskView(schedulePath, executionPath, taskId)
  const planPath = generateSinglePlan({
    executionPath,
    projectId: opts.project ?? process.env.SPECDOJO_PROJECT ?? '',
    catalogPath: catalogPath ?? '',
    rolesPath,
    viewpointsPath,
    task,
  })

  try {
    const roster = loadRosterForExecutionPath(executionPath)
    const command = resolveRerunCommand(task, roster, opts, schedulePath)
    const prompt = loadPrompt(executionPath, taskId)
    if (!prompt) throw new Error(`Plan not found for task: ${taskId}`)

    if (opts.dryRun) {
      process.stdout.write(`[dry-run] task: ${taskId} (state ignored)\n`)
      process.stdout.write(`[dry-run] command: ${command}\n`)
      process.stdout.write(`[dry-run] cwd: ${repoRoot}\n`)
      process.stdout.write(`[dry-run] plan: ${prompt.length} chars\n`)
      return
    }

    process.stdout.write(`Re-running ${taskId} (state ignored): ${command}\n`)
    const exitCode = await spawnAgentInPlace(
      command,
      prompt,
      repoRoot,
      schedulePath,
      executionPath
    )
    if (exitCode !== 0) {
      process.exitCode = exitCode
      process.stdout.write(`rerun failed: ${taskId} (exit ${exitCode})\n`)
      return
    }
    process.stdout.write(`rerun done: ${taskId}\n`)
  } finally {
    if (!opts.keepPlan && existsSync(planPath)) {
      rmSync(planPath, { force: true })
    }
  }
}

export function registerRerunCommand(exec: Command): void {
  const cmd = exec
    .command('rerun')
    .description(
      'Regenerate a task plan and run its agent in place, ignoring task state (no claim/complete events). Removes the plan afterward.'
    )
  cmd.option('--project <projectId>', 'Project id in .specdojo/specdojo.config.json')
  cmd.requiredOption('--task <taskId>', 'Task ID to re-run')
  cmd.option('--by <actor>', 'Agent nickname to run as (defaults to a capability-matched agent)')
  cmd.option('--agent-cmd <command>', 'Override agent command string')
  cmd.option('--keep-plan', 'Keep the regenerated plan file after running', false)
  cmd.option('--dry-run', 'Resolve and print the command without executing', false)
  cmd.action(async (opts: RerunOpts) => {
    try {
      await rerunTask(opts)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      process.stderr.write(`${message}\n`)
      process.exitCode = 1
    }
  })
}
