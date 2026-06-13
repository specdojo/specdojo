import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join, relative, resolve, sep } from 'node:path'
import { type Command } from 'commander'
import {
  acquireSchedulerLock,
  foldEventsToState,
  readAllEventFiles,
  releaseSchedulerLock,
} from './exec-events.js'
import { activateResolvedProjectPaths, resolveProjectPaths } from './exec-project.js'
import {
  buildTaskPhaseMap,
  loadPrompt,
  loadRosterForExecutionPath,
  resolveTaskPhaseContext,
  selectCandidates,
} from './exec-run.js'
import { buildScheduleIndex } from './exec-schedule.js'
import { buildInitialStateFromStrategy } from './exec-schedule-initial.js'
import { readJson } from './exec-shared.js'
import {
  buildPhaseModeIndex,
  resolveApproach,
  resolveTaskCapabilities,
  resolveTaskExecution,
  resolveTaskMode,
  resolveTaskProficiency,
} from './exec-strategy.js'
import { type ReadySnapshot, type ReadyTaskView } from './exec-types.js'
import {
  ensureExecWorktree,
  execBranchExists,
  findExecWorktree,
  gitOutput,
  gitResult,
  resolveWorktreeBase,
  worktreeNameFromTaskId,
  type ExecWorktree,
} from './exec-worktree.js'
import { loadConfig, specdojoRootDir } from './specdojo-config.js'

type CommonOpts = {
  project?: string
  task: string
  dryRun?: boolean
  worktreeBase?: string
}

type AgentOpts = CommonOpts & {
  by?: string
  agentCmd?: string
}

type CommitOpts = CommonOpts & {
  message?: string
}

type MergeOpts = CommonOpts & {
  ffOnly?: boolean
}

type RemoveOpts = CommonOpts & {
  deleteBranch?: boolean
  force?: boolean
}

type TaskExecutionState = {
  actor?: string
  claimEventPath?: string
  state: string
}

type ProjectContext = ReturnType<typeof resolveProjectPaths> & {
  repoRoot: string
}

const DEFAULT_LOCK_TIMEOUT_MS = 10_000
const DEFAULT_LOCK_STALE_MS = 300_000

function commandError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error)
  process.stderr.write(`${message}\n`)
  process.exitCode = 1
}

function resolveContext(opts: { project?: string }): ProjectContext {
  const paths = resolveProjectPaths({ project: opts.project })
  activateResolvedProjectPaths(paths)
  return { ...paths, repoRoot: specdojoRootDir() }
}

function repoRelative(repoRoot: string, path: string): string {
  const value = relative(repoRoot, path)
  if (!value || value === '..' || value.startsWith(`..${sep}`)) {
    throw new Error(`Path is outside repository root: ${path}`)
  }
  return value.split(sep).join('/')
}

function configuredWorktreeBase(schedulePath: string): string | undefined {
  const { config } = loadConfig()
  if (!config) return undefined
  const rootDir = specdojoRootDir()
  for (const project of Object.values(config.projects)) {
    if (resolve(rootDir, project.schedule_path.trim()) === schedulePath) {
      return project.run?.worktree_base
    }
  }
  return undefined
}

function taskExecutionState(schedulePath: string, taskId: string): TaskExecutionState {
  const schedule = buildScheduleIndex(schedulePath)
  if (!schedule.nodes.has(taskId)) throw new Error(`Task not found in schedule: ${taskId}`)
  const events = readAllEventFiles(schedulePath)
  const initial = buildInitialStateFromStrategy(schedulePath, schedule)
  const snapshot = foldEventsToState(events, schedule, schedulePath, initial)
  const claims = events.filter(item => item.event.task_id === taskId && item.event.type === 'claim')
  const claim = claims[claims.length - 1]
  return {
    actor: claim?.event.by,
    claimEventPath: claim?.path,
    state: snapshot.tasks[taskId]?.state ?? 'todo',
  }
}

function requireDoingTask(schedulePath: string, taskId: string): Required<TaskExecutionState> {
  const state = taskExecutionState(schedulePath, taskId)
  if (state.state !== 'doing') {
    throw new Error(`Task must be doing before worktree execution: ${taskId} (${state.state})`)
  }
  if (!state.actor || !state.claimEventPath) {
    throw new Error(`Claim event not found for doing task: ${taskId}`)
  }
  return state as Required<TaskExecutionState>
}

function currentBranch(repoRoot: string): string {
  const branch = gitOutput(repoRoot, ['branch', '--show-current']).trim()
  if (!branch) throw new Error('Detached HEAD is not supported for exec worktree commands.')
  return branch
}

function requireWorktree(repoRoot: string, taskId: string): ExecWorktree {
  const worktree = findExecWorktree(repoRoot, taskId)
  if (!worktree) throw new Error(`Worktree is not prepared for task: ${taskId}`)
  if (!existsSync(worktree.path)) {
    throw new Error(`Registered worktree path does not exist: ${worktree.path}`)
  }
  return worktree
}

function requireInsideWorktree(repoRoot: string, worktree: ExecWorktree): void {
  if (resolve(repoRoot) !== resolve(worktree.path)) {
    throw new Error(`Run this command inside the task worktree: ${worktree.path}`)
  }
}

function statusPaths(repoRoot: string): string[] {
  const output = gitOutput(repoRoot, ['status', '--porcelain=v1', '-z', '--untracked-files=all'])
  const records = output.split('\0').filter(Boolean)
  const paths: string[] = []
  for (let index = 0; index < records.length; index++) {
    const record = records[index]
    if (record.length < 4) continue
    const status = record.slice(0, 2)
    paths.push(record.slice(3))
    if ((status.includes('R') || status.includes('C')) && records[index + 1]) {
      paths.push(records[++index])
    }
  }
  return paths
}

function taskPaths(context: ProjectContext, taskId: string): {
  planRel: string
  resultRel: string
  executionRel: string
} {
  const executionRel = repoRelative(context.repoRoot, context.executionPath)
  return {
    executionRel,
    planRel: `${executionRel}/exec/plans/${taskId}-plan.md`,
    resultRel: `${executionRel}/exec/results/${taskId}-result.md`,
  }
}

export function isCommitTargetPath(path: string, executionRel: string, resultRel: string): boolean {
  const normalized = path.replaceAll('\\', '/')
  if (normalized === resultRel) return true
  if (normalized.startsWith(`${executionRel}/exec/plans/`)) return false
  if (normalized.startsWith(`${executionRel}/exec/results/`)) return false
  if (normalized.startsWith(`${executionRel}/exec/events/`)) return false
  if (normalized.startsWith(`${executionRel}/generated/`)) return false
  return true
}

function commitTargetPaths(context: ProjectContext, worktree: ExecWorktree, taskId: string): string[] {
  const { executionRel, resultRel } = taskPaths(context, taskId)
  return statusPaths(worktree.path).filter(path =>
    isCommitTargetPath(path, executionRel, resultRel)
  )
}

function zeroSeparatedPaths(repoRoot: string, args: string[]): string[] {
  return gitOutput(repoRoot, args).split('\0').filter(Boolean)
}

function rootDirtyPaths(repoRoot: string): Set<string> {
  return new Set([
    ...zeroSeparatedPaths(repoRoot, ['diff', '--no-renames', '--name-only', '-z']),
    ...zeroSeparatedPaths(repoRoot, ['diff', '--cached', '--no-renames', '--name-only', '-z']),
    ...zeroSeparatedPaths(repoRoot, ['ls-files', '--others', '--exclude-standard', '-z']),
  ])
}

function taskView(schedulePath: string, executionPath: string, taskId: string): ReadyTaskView {
  const schedule = buildScheduleIndex(schedulePath)
  const node = schedule.nodes.get(taskId)
  if (!node || node.kind !== 'task') throw new Error(`Task not found in schedule: ${taskId}`)

  let task: ReadyTaskView = {
    id: taskId,
    local_id: node.local_id,
    name: node.name,
    owner: node.owner,
    schedule_file: node.schedule_file,
    fifo_rank: 0,
    critical_first_rank: 0,
  }
  const readyPath = join(executionPath, 'generated', 'ready.json')
  if (existsSync(readyPath)) {
    const ready = readJson(readyPath) as ReadySnapshot
    task = ready.tasks.find(item => item.id === taskId) ?? task
  }
  if (!task.local_id) {
    const parts = taskId.split('-')
    if (parts.length >= 4 && parts[0] === 'T') {
      task.local_id = parts.slice(2, parts.length - 1).join('-')
    }
  }
  if (task.local_id) {
    const phaseIndex = buildPhaseModeIndex(schedulePath)
    task.mode = task.mode ?? resolveTaskMode(task.local_id, task.id, phaseIndex)
    task.execution = task.execution ?? resolveTaskExecution(task.local_id, task.id, phaseIndex)
    task.approach = task.approach ?? resolveApproach(task.local_id, task.id, phaseIndex)
    task.capabilities =
      task.capabilities ?? resolveTaskCapabilities(task.local_id, task.id, phaseIndex)
    task.proficiency =
      task.proficiency ?? resolveTaskProficiency(task.local_id, task.id, phaseIndex)
  }
  return task
}

function resolveAgent(context: ProjectContext, taskId: string, opts: AgentOpts): {
  actor: string
  command: string
  prompt: string
} {
  const state = requireDoingTask(context.schedulePath, taskId)
  if (opts.by && opts.by !== state.actor) {
    throw new Error(`--by ${opts.by} does not match claim actor ${state.actor}.`)
  }
  const task = taskView(context.schedulePath, context.executionPath, taskId)
  const roster = loadRosterForExecutionPath(context.executionPath)
  let command = opts.agentCmd?.trim() ?? ''

  if (command) {
    const member = roster?.members.find(
      item => item.type === 'agent' && item.command && item.nickname === command
    )
    command = member?.command ?? command
  } else {
    if ((task.execution ?? 'agent') === 'human') {
      throw new Error(`Task requires human execution. Use --agent-cmd to override: ${taskId}`)
    }
    const member = roster?.members.find(
      item => item.nickname === state.actor && item.type === 'agent' && item.command
    )
    if (!member?.command) {
      throw new Error(`Agent command not found for claim actor: ${state.actor}`)
    }
    const maps = buildTaskPhaseMap(context.schedulePath)
    if (!resolveTaskPhaseContext(task, maps.localIdToPhaseSets, maps.phaseSetSuffixToId)) {
      throw new Error(`Cannot resolve phase context for task: ${taskId}`)
    }
    const candidates = selectCandidates(
      { capabilities: task.capabilities ?? [], proficiency: task.proficiency },
      roster,
      task.mode ?? 'edit'
    )
    if (!candidates.some(candidate => candidate.nickname === state.actor)) {
      throw new Error(`Claim actor does not satisfy task agent requirements: ${state.actor}`)
    }
    command = member.command
  }

  const prompt = loadPrompt(context.executionPath, taskId)
  if (!prompt) throw new Error(`Plan not found for task: ${taskId}`)
  return { actor: state.actor, command, prompt }
}

function printWorktree(worktree: ExecWorktree): void {
  process.stdout.write(`worktree: ${worktree.path}\nbranch: ${worktree.branch}\n`)
}

function prepare(opts: CommonOpts): void {
  const context = resolveContext(opts)
  const state = requireDoingTask(context.schedulePath, opts.task)
  const name = worktreeNameFromTaskId(opts.task)
  const branch = `exec/${name}`
  const base = resolveWorktreeBase(
    context.repoRoot,
    opts.worktreeBase,
    configuredWorktreeBase(context.schedulePath)
  )
  const planned: ExecWorktree = {
    path: resolve(base, name),
    branch,
    name,
    created: false,
  }

  if (opts.dryRun) {
    process.stdout.write(`[dry-run] claim actor: ${state.actor}\n`)
    process.stdout.write(`[dry-run] checkpoint: exec(${opts.task}): prepare execution\n`)
    printWorktree(findExecWorktree(context.repoRoot, opts.task) ?? planned)
    return
  }

  let lockDir = ''
  try {
    lockDir = acquireSchedulerLock(context.schedulePath, {
      actor: `worktree-prepare:${state.actor}`,
      lockTimeoutMs: DEFAULT_LOCK_TIMEOUT_MS,
      lockStaleMs: DEFAULT_LOCK_STALE_MS,
    })
    const lockedState = requireDoingTask(context.schedulePath, opts.task)
    const planPath = join(context.executionPath, 'exec', 'plans', `${opts.task}-plan.md`)
    const resultPath = join(context.executionPath, 'exec', 'results', `${opts.task}-result.md`)
    for (const path of [planPath, resultPath, lockedState.claimEventPath]) {
      if (!existsSync(path)) throw new Error(`Required execution file not found: ${path}`)
    }
    const existing = findExecWorktree(context.repoRoot, opts.task)
    if (existing) {
      printWorktree(existing)
      return
    }

    if (!execBranchExists(context.repoRoot, opts.task)) {
      if (currentBranch(context.repoRoot) === branch) {
        throw new Error(`Prepare must run from a branch other than ${branch}.`)
      }
      const staged = gitResult(context.repoRoot, ['diff', '--cached', '--quiet'])
      if (staged.status === 1) throw new Error('Root index has staged changes; commit or unstage them first.')
      if (staged.status !== 0) throw new Error('Failed to inspect staged changes in root worktree.')

      const paths = [planPath, resultPath, lockedState.claimEventPath].map(path =>
        repoRelative(context.repoRoot, path)
      )
      gitOutput(context.repoRoot, ['add', '--', ...paths])
      const checkpoint = gitResult(context.repoRoot, ['diff', '--cached', '--quiet', '--', ...paths])
      if (checkpoint.status === 1) {
        gitOutput(context.repoRoot, [
          'commit',
          '-m',
          `exec(${opts.task}): prepare execution`,
          '--',
          ...paths,
        ])
      } else if (checkpoint.status !== 0) {
        throw new Error('Failed to inspect execution checkpoint changes.')
      }
    }

    const worktree = ensureExecWorktree({
      repoRoot: context.repoRoot,
      worktreeBase: base,
      taskId: opts.task,
    })
    printWorktree(worktree)
  } finally {
    if (lockDir) releaseSchedulerLock(lockDir)
  }
}

function status(opts: CommonOpts): void {
  const context = resolveContext(opts)
  const state = taskExecutionState(context.schedulePath, opts.task)
  const worktree = findExecWorktree(context.repoRoot, opts.task)
  const branch = `exec/${worktreeNameFromTaskId(opts.task)}`
  process.stdout.write(`task: ${opts.task}\nstate: ${state.state}\n`)
  process.stdout.write(`claim-actor: ${state.actor ?? 'not found'}\n`)
  if (!worktree) {
    const base = resolveWorktreeBase(
      context.repoRoot,
      opts.worktreeBase,
      configuredWorktreeBase(context.schedulePath)
    )
    process.stdout.write(`worktree: not prepared (expected ${resolve(base, worktreeNameFromTaskId(opts.task))})\n`)
    process.stdout.write(`branch: ${branch}\n`)
    return
  }

  const { planRel, resultRel } = taskPaths(context, opts.task)
  const compareBase = gitOutput(context.repoRoot, ['merge-base', 'HEAD', branch]).trim()
  const merged = gitResult(context.repoRoot, ['merge-base', '--is-ancestor', branch, 'HEAD']).status === 0
  const resultChanged =
    gitResult(worktree.path, ['diff', '--quiet', compareBase, '--', resultRel]).status === 1
  let agentCommand = 'unavailable'
  try {
    agentCommand = resolveAgent(context, opts.task, { ...opts, task: opts.task }).command
  } catch {}

  printWorktree(worktree)
  process.stdout.write(`compare-base: ${compareBase}\n`)
  process.stdout.write(`agent-command: ${agentCommand}\n`)
  process.stdout.write(`plan: ${existsSync(resolve(worktree.path, planRel)) ? 'present' : 'missing'}\n`)
  process.stdout.write(`result: ${existsSync(resolve(worktree.path, resultRel)) ? 'present' : 'missing'}\n`)
  process.stdout.write(`result-changed: ${resultChanged ? 'yes' : 'no'}\n`)
  const changes = statusPaths(worktree.path)
  process.stdout.write(`uncommitted: ${changes.length > 0 ? changes.join(', ') : 'none'}\n`)
  process.stdout.write(`merged-into-current: ${merged ? 'yes' : 'no'}\n`)
}

async function agent(opts: AgentOpts): Promise<void> {
  const context = resolveContext(opts)
  const worktree = requireWorktree(context.repoRoot, opts.task)
  requireInsideWorktree(context.repoRoot, worktree)
  const resolved = resolveAgent(context, opts.task, opts)
  if (opts.dryRun) {
    process.stdout.write(`[dry-run] actor: ${resolved.actor}\n`)
    process.stdout.write(`[dry-run] command: ${resolved.command}\n`)
    process.stdout.write(`[dry-run] cwd: ${worktree.path}\n`)
    process.stdout.write(`[dry-run] plan: ${resolved.prompt.length} chars\n`)
    return
  }

  const child = spawn(resolved.command, {
    cwd: worktree.path,
    env: {
      ...process.env,
      SPECDOJO_SCHEDULE_PATH: context.schedulePath,
      SPECDOJO_EXECUTION_PATH: context.executionPath,
    },
    shell: true,
    stdio: ['pipe', 'inherit', 'inherit'],
  })
  child.stdin.end(resolved.prompt)
  const exitCode = await new Promise<number>(resolveExit => {
    child.once('error', () => resolveExit(1))
    child.once('close', code => resolveExit(code ?? 1))
  })
  if (exitCode !== 0) process.exitCode = exitCode
}

function commit(opts: CommitOpts): void {
  const context = resolveContext(opts)
  requireDoingTask(context.schedulePath, opts.task)
  const worktree = requireWorktree(context.repoRoot, opts.task)
  requireInsideWorktree(context.repoRoot, worktree)
  const paths = commitTargetPaths(context, worktree, opts.task)
  if (paths.length === 0) {
    process.stdout.write('No commit-target changes.\n')
    return
  }
  process.stdout.write(`commit-targets:\n${paths.map(path => `  ${path}`).join('\n')}\n`)
  if (opts.dryRun) return

  gitOutput(worktree.path, ['add', '-A', '--', ...paths])
  const staged = gitResult(worktree.path, ['diff', '--cached', '--quiet', '--', ...paths])
  if (staged.status === 0) {
    process.stdout.write('No staged commit-target changes.\n')
    return
  }
  if (staged.status !== 1) throw new Error('Failed to inspect staged worktree changes.')
  gitOutput(worktree.path, [
    'commit',
    '-m',
    opts.message?.trim() || `exec(${opts.task}): apply task changes`,
    '--',
    ...paths,
  ])
}

function merge(opts: MergeOpts): void {
  const context = resolveContext(opts)
  const worktree = requireWorktree(context.repoRoot, opts.task)
  const targetBranch = currentBranch(context.repoRoot)
  if (targetBranch === worktree.branch) {
    throw new Error(`Merge must run from a branch other than ${worktree.branch}.`)
  }
  let lockDir = ''
  try {
    if (!opts.dryRun) {
      lockDir = acquireSchedulerLock(context.schedulePath, {
        actor: `worktree-merge:${targetBranch}`,
        lockTimeoutMs: DEFAULT_LOCK_TIMEOUT_MS,
        lockStaleMs: DEFAULT_LOCK_STALE_MS,
      })
    }
    const dirty = commitTargetPaths(context, worktree, opts.task)
    if (dirty.length > 0) {
      throw new Error(`Worktree has uncommitted commit-target changes: ${dirty.join(', ')}`)
    }
    const compareBase = gitOutput(context.repoRoot, ['merge-base', 'HEAD', worktree.branch]).trim()
    const count = Number.parseInt(
      gitOutput(context.repoRoot, [
        'rev-list',
        '--count',
        `${compareBase}..${worktree.branch}`,
      ]).trim(),
      10
    )
    if (!Number.isFinite(count) || count < 1) {
      throw new Error(`No commits to merge from ${worktree.branch}.`)
    }
    const mergePaths = new Set(
      zeroSeparatedPaths(context.repoRoot, [
        'diff',
        '--no-renames',
        '--name-only',
        '-z',
        `${compareBase}..${worktree.branch}`,
      ])
    )
    const overlap = [...rootDirtyPaths(context.repoRoot)].filter(path => mergePaths.has(path))
    if (overlap.length > 0) {
      throw new Error(`Current worktree changes overlap merge paths: ${overlap.join(', ')}`)
    }
    if (opts.dryRun) {
      process.stdout.write(
        `[dry-run] git merge ${opts.ffOnly ? '--ff-only' : '--no-ff --no-edit'} ${worktree.branch}\n`
      )
      return
    }
    gitOutput(
      context.repoRoot,
      opts.ffOnly
        ? ['merge', '--ff-only', worktree.branch]
        : ['merge', '--no-ff', '--no-edit', worktree.branch]
    )
  } finally {
    if (lockDir) releaseSchedulerLock(lockDir)
  }
}

function remove(opts: RemoveOpts): void {
  const context = resolveContext(opts)
  const worktree = requireWorktree(context.repoRoot, opts.task)
  if (resolve(context.repoRoot) === resolve(worktree.path)) {
    throw new Error('Run remove from the merge-target worktree, not the task worktree.')
  }
  const dirty = commitTargetPaths(context, worktree, opts.task)
  const merged =
    gitResult(context.repoRoot, ['merge-base', '--is-ancestor', worktree.branch, 'HEAD']).status === 0
  if (!opts.force && dirty.length > 0) {
    throw new Error(`Worktree has uncommitted commit-target changes: ${dirty.join(', ')}`)
  }
  if (!opts.force && !merged) {
    throw new Error(`Exec branch is not merged into current HEAD: ${worktree.branch}`)
  }
  if (opts.force) {
    process.stderr.write('Warning: forcing worktree removal; uncommitted changes may be lost.\n')
  }
  if (opts.dryRun) {
    process.stdout.write(
      `[dry-run] git worktree remove${opts.force ? ' --force' : ''} ${worktree.path}\n`
    )
    if (opts.deleteBranch) process.stdout.write(`[dry-run] git branch -d ${worktree.branch}\n`)
    return
  }

  gitOutput(context.repoRoot, [
    'worktree',
    'remove',
    ...(opts.force ? ['--force'] : []),
    worktree.path,
  ])
  if (opts.deleteBranch) gitOutput(context.repoRoot, ['branch', '-d', worktree.branch])
}

function addCommonOptions(command: Command): Command {
  return command
    .option('--project <projectId>', 'Project id in .specdojo/specdojo.config.json')
    .requiredOption('--task <taskId>', 'Task ID')
}

export function registerExecWorktreeCommands(exec: Command): void {
  const worktree = exec.command('worktree').description('Manually manage task execution worktrees')

  const prepareCommand = addCommonOptions(
    worktree.command('prepare').description('Commit execution checkpoint and prepare worktree')
  )
  prepareCommand.option('--worktree-base <path>', 'Override worktree base directory')
  prepareCommand.option('--dry-run', 'Print planned operations without changing files', false)
  prepareCommand.action((opts: CommonOpts) => {
    try {
      prepare(opts)
    } catch (error) {
      commandError(error)
    }
  })

  const statusCommand = addCommonOptions(
    worktree.command('status').description('Show task worktree and Git status')
  )
  statusCommand.option('--worktree-base <path>', 'Override worktree base directory')
  statusCommand.action((opts: CommonOpts) => {
    try {
      status(opts)
    } catch (error) {
      commandError(error)
    }
  })

  const agentCommand = addCommonOptions(
    worktree.command('agent').description('Run the task agent once inside its worktree')
  )
  agentCommand.option('--by <actor>', 'Validate the claim actor')
  agentCommand.option('--agent-cmd <command>', 'Override agent command')
  agentCommand.option('--dry-run', 'Print the resolved command without executing', false)
  agentCommand.action(async (opts: AgentOpts) => {
    try {
      await agent(opts)
    } catch (error) {
      commandError(error)
    }
  })

  const commitCommand = addCommonOptions(
    worktree.command('commit').description('Commit task result and deliverable changes')
  )
  commitCommand.option('--message <message>', 'Override commit message')
  commitCommand.option('--dry-run', 'Print commit targets without committing', false)
  commitCommand.action((opts: CommitOpts) => {
    try {
      commit(opts)
    } catch (error) {
      commandError(error)
    }
  })

  const mergeCommand = addCommonOptions(
    worktree.command('merge').description('Merge the task exec branch into the current branch')
  )
  mergeCommand.option('--ff-only', 'Require a fast-forward merge', false)
  mergeCommand.option('--dry-run', 'Print the merge command without merging', false)
  mergeCommand.action((opts: MergeOpts) => {
    try {
      merge(opts)
    } catch (error) {
      commandError(error)
    }
  })

  const removeCommand = addCommonOptions(
    worktree.command('remove').description('Remove a merged task worktree')
  )
  removeCommand.option('--delete-branch', 'Delete the merged exec branch with git branch -d', false)
  removeCommand.option('--force', 'Force worktree removal even when dirty or unmerged', false)
  removeCommand.option('--dry-run', 'Print removal operations without changing Git state', false)
  removeCommand.action((opts: RemoveOpts) => {
    try {
      remove(opts)
    } catch (error) {
      commandError(error)
    }
  })
}
