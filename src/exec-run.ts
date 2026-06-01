import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { type Command } from 'commander'
import { selfRunArgs } from './spawn-self.js'
import {
  defaultAgentConfigPath,
  loadExecAgentGlobalConfig,
  loadExecStrategyConfig,
  resolveAssignment,
  type ExecAgentGlobalConfig,
  type ExecStrategyConfig,
  type RateLimitDetection,
  type RateLimitPolicy,
  type ResolvedRequirements,
} from './exec-agent-config.js'
import { activateResolvedProjectPaths, resolveProjectPaths } from './exec-project.js'
import { listFilesRecursive, readJson, readYaml, sleepMs } from './exec-shared.js'
import {
  loadConfig,
  loadMemberRoster,
  specdojoRootDir,
  type MemberRoster,
  type ProjectMember,
} from './specdojo-config.js'
import { type ReadySnapshot, type ReadyTaskView } from './exec-types.js'

type StrategyPhase = {
  id: string
  name: string
  task_suffix: string
  duration_days: number
}

type StrategyOwnerRule = {
  local_ids: string[]
  owner: string
  phase_set?: string
}

type StrategyFile = {
  phase_sets: Record<string, StrategyPhase[]>
  default_phase_set?: string
  owner_rules: StrategyOwnerRule[]
}

type TaskPhaseContext = {
  localId: string
  phaseSet: string
  phaseId: string
}

type RunOpts = {
  project?: string
  by?: string
  strategy?: string
  agentConfig?: string
  dryRun?: boolean
  auto?: boolean
  task?: string
  agentCmd?: string
  loop?: boolean
  maxRounds?: string
}

type RunResult = 'success' | 'rate_limit' | 'failure'

export function buildTaskPhaseMap(schedulePath: string): {
  localIdToRule: Map<string, { phaseSet: string }>
  phaseSetSuffixToId: Map<string, string>
} {
  const localIdToRule = new Map<string, { phaseSet: string }>()
  const phaseSetSuffixToId = new Map<string, string>()

  const strategyFiles = listFilesRecursive(schedulePath).filter(f =>
    /sch-strategy-.*\.(yaml|yml)$/.test(f)
  )

  for (const filePath of strategyFiles) {
    let strategy: StrategyFile
    try {
      strategy = readYaml(filePath) as StrategyFile
    } catch {
      continue
    }
    if (!strategy?.phase_sets || !Array.isArray(strategy.owner_rules)) continue

    const defaultPhaseSet = strategy.default_phase_set ?? ''

    for (const [phaseSetName, phases] of Object.entries(strategy.phase_sets)) {
      for (const phase of phases) {
        phaseSetSuffixToId.set(`${phaseSetName}:${phase.task_suffix}`, phase.id)
      }
    }

    for (const rule of strategy.owner_rules) {
      const phaseSet = rule.phase_set ?? defaultPhaseSet
      for (const localId of rule.local_ids) {
        localIdToRule.set(localId, { phaseSet })
      }
    }
  }

  return { localIdToRule, phaseSetSuffixToId }
}

function resolveTaskPhaseContext(
  task: ReadyTaskView,
  localIdToRule: Map<string, { phaseSet: string }>,
  phaseSetSuffixToId: Map<string, string>
): TaskPhaseContext | null {
  const localId = task.local_id
  if (!localId) return null

  const rule = localIdToRule.get(localId)
  if (!rule) return null

  const parts = task.id.split('-')
  const suffix = parts[parts.length - 1]
  if (!/^\d{3}$/.test(suffix)) return null

  const phaseId = phaseSetSuffixToId.get(`${rule.phaseSet}:${suffix}`)
  if (!phaseId) return null

  return { localId, phaseSet: rule.phaseSet, phaseId }
}

function selectCandidates(
  requirements: ResolvedRequirements,
  roster: MemberRoster | null
): ProjectMember[] {
  if (!roster) return []
  const { capabilities: required, proficiency } = requirements
  return roster.members
    .filter(m => {
      if (m.type !== 'agent' || !m.command) return false
      const caps = m.capabilities ?? []
      if (!required.every(c => caps.includes(c))) return false
      if (proficiency !== undefined && m.proficiency !== proficiency) return false
      return true
    })
    .sort((a, b) => {
      const aExtra = (a.capabilities?.length ?? 0) - required.length
      const bExtra = (b.capabilities?.length ?? 0) - required.length
      if (aExtra !== bExtra) return aExtra - bExtra
      return (a.priority ?? 999) - (b.priority ?? 999)
    })
}

function isRateLimitError(
  exitCode: number | null,
  stderr: string,
  detection: RateLimitDetection | undefined
): boolean {
  if (!detection) return false
  if (detection.exit_codes && exitCode !== null && detection.exit_codes.includes(exitCode)) {
    return true
  }
  if (detection.stderr_patterns) {
    const lower = stderr.toLowerCase()
    for (const pattern of detection.stderr_patterns) {
      if (lower.includes(pattern.toLowerCase())) return true
    }
  }
  return false
}

function resolveAgentConfigPath(opts: RunOpts, schedulePath: string): string {
  if (opts.agentConfig) return opts.agentConfig

  const { config } = loadConfig()
  if (config) {
    const rootDir = specdojoRootDir()
    for (const project of Object.values(config.projects)) {
      const projSchedulePath = resolve(rootDir, project.schedule_path.trim())
      if (projSchedulePath === schedulePath && project.run?.agent_config) {
        return resolve(rootDir, project.run.agent_config)
      }
    }
  }

  return defaultAgentConfigPath()
}

function loadBrief(executionPath: string, taskId: string): string | null {
  const briefPath = join(executionPath, 'generated', 'agent-briefs', `${taskId}.md`)
  if (!existsSync(briefPath)) return null
  return readFileSync(briefPath, 'utf8')
}

function loadRosterForExecutionPath(executionPath: string): MemberRoster | null {
  const { config } = loadConfig()
  if (!config) return null

  const rootDir = specdojoRootDir()
  for (const project of Object.values(config.projects)) {
    const projExecPath = resolve(rootDir, project.execution_path.trim())
    if (projExecPath === executionPath) {
      try {
        return loadMemberRoster(rootDir, project)
      } catch {
        return null
      }
    }
  }
  return null
}

function executeAgent(
  agentCommand: string,
  prompt: string,
  detection: RateLimitDetection | undefined
): { result: RunResult; exitCode: number | null; stderr: string } {
  const parts = agentCommand.split(/\s+/).filter(Boolean)
  if (parts.length === 0) {
    return { result: 'failure', exitCode: null, stderr: 'Empty agent command' }
  }

  const spawnResult = spawnSync(parts[0], [...parts.slice(1), prompt], {
    stdio: ['ignore', 'inherit', 'pipe'],
    encoding: 'utf8',
  })

  const stderr = typeof spawnResult.stderr === 'string' ? spawnResult.stderr : ''
  const exitCode = spawnResult.status

  if (stderr) process.stderr.write(stderr)

  if (isRateLimitError(exitCode, stderr, detection)) {
    return { result: 'rate_limit', exitCode, stderr }
  }
  if (exitCode !== 0) {
    return { result: 'failure', exitCode, stderr }
  }
  return { result: 'success', exitCode: 0, stderr: '' }
}

function runWithRetry(
  agentCommands: string[],
  prompt: string,
  isOnCriticalPath: boolean,
  globalConfig: ExecAgentGlobalConfig,
  policy: RateLimitPolicy | undefined
): RunResult {
  const detection = globalConfig.rate_limit_detection

  const first = executeAgent(agentCommands[0], prompt, detection)
  if (first.result !== 'rate_limit') return first.result

  if (!isOnCriticalPath || !policy) {
    process.stdout.write(`Rate limit detected (non-critical). Skipping task.\n`)
    return 'rate_limit'
  }

  const { retry } = policy.on_critical
  let waitSeconds = retry.initial_wait_seconds
  let attemptCount = 1

  for (let idx = 1; idx < agentCommands.length; idx++) {
    if (attemptCount >= retry.max_attempts) break

    const actualWait = Math.min(waitSeconds, retry.max_wait_seconds)
    process.stdout.write(
      `Rate limit on critical path (attempt ${attemptCount}/${retry.max_attempts}). Waiting ${actualWait}s, trying next member...\n`
    )
    sleepMs(actualWait * 1000)
    attemptCount++

    const result = executeAgent(agentCommands[idx], prompt, detection)
    if (result.result !== 'rate_limit') return result.result

    waitSeconds = Math.min(waitSeconds * retry.backoff_multiplier, retry.max_wait_seconds)
  }

  process.stdout.write(
    `Rate limit: all ${agentCommands.length} member(s) exhausted after ${attemptCount} attempt(s).\n`
  )
  return 'rate_limit'
}

function runSingleTask(
  task: ReadyTaskView,
  projectId: string | undefined,
  executionPath: string,
  strategyConfig: ExecStrategyConfig,
  globalConfig: ExecAgentGlobalConfig,
  roster: MemberRoster | null,
  localIdToRule: Map<string, { phaseSet: string }>,
  phaseSetSuffixToId: Map<string, string>,
  agentCmdOverride: string | undefined,
  actorOverride: string | undefined,
  dryRun: boolean
): RunResult {
  const mode = task.phase_mode ?? 'exec'
  process.stdout.write(`Task: ${task.id}${task.name ? ` — ${task.name}` : ''}  [${mode}]\n`)

  const agentCommands: string[] = agentCmdOverride ? [agentCmdOverride] : []
  let actor = actorOverride ?? 'auto-agent'

  if (agentCommands.length === 0) {
    const phaseCtx = resolveTaskPhaseContext(task, localIdToRule, phaseSetSuffixToId)
    if (!phaseCtx) {
      process.stdout.write(
        `  Cannot resolve phase context for "${task.name ?? task.id}": not found in sch-strategy files\n`
      )
      return 'failure'
    }

    const requirements = resolveAssignment(phaseCtx.phaseSet, phaseCtx.phaseId, strategyConfig)
    if (!requirements) {
      process.stdout.write(
        `  No assignment_rule matched (${phaseCtx.phaseSet}, ${phaseCtx.phaseId}, mode: ${mode})\n`
      )
      return 'failure'
    }

    const candidates = selectCandidates(requirements, roster)
    if (candidates.length === 0) {
      process.stdout.write(
        `  No agents found for capabilities: [${requirements.capabilities.join(', ')}]${requirements.proficiency ? `, proficiency: ${requirements.proficiency}` : ''}\n`
      )
      return 'failure'
    }

    for (const candidate of candidates) {
      agentCommands.push(candidate.command!)
    }
    if (!actorOverride) actor = candidates[0].nickname
    process.stdout.write(
      `  Phase: ${phaseCtx.phaseSet}/${phaseCtx.phaseId}  Mode: ${mode}  Agent: ${candidates[0].nickname}\n`
    )
  }

  const brief = loadBrief(executionPath, task.id)
  if (!brief) {
    process.stdout.write(`  Agent brief not found for ${task.id}. Run: specdojo exec build\n`)
    return 'failure'
  }

  if (dryRun) {
    process.stdout.write(`  [dry-run] would claim: ${task.id} as ${actor}\n`)
    process.stdout.write(`  [dry-run] Command: ${agentCommands[0]}\n`)
    process.stdout.write(`  [dry-run] Brief: ${brief.length} chars\n`)
    return 'success'
  }

  process.stdout.write(`  Claiming: ${task.id} as ${actor}\n`)
  if (!spawnClaim(projectId, task.id, actor)) {
    process.stdout.write(`  Claim failed: ${task.id}\n`)
    return 'failure'
  }

  process.stdout.write(`  Running: ${agentCommands[0]}\n`)

  const isOnCriticalPath = (task.cpm?.slack ?? 1) === 0
  const result = runWithRetry(
    agentCommands,
    brief,
    isOnCriticalPath,
    globalConfig,
    strategyConfig.rate_limit_policy
  )

  if (result === 'success') {
    spawnComplete(projectId, task.id, actor)
    process.stdout.write(`  Done: ${task.id}\n`)
  } else if (result === 'rate_limit') {
    spawnBlock(projectId, task.id, actor, 'rate limit reached')
    process.stdout.write(`  Rate limited: ${task.id}\n`)
  } else {
    spawnBlock(projectId, task.id, actor, 'agent exited with non-zero code')
    process.stdout.write(`  Failed: ${task.id}\n`)
  }

  return result
}

function spawnBuild(projectId: string | undefined): boolean {
  const buildArgs = ['exec', 'build']
  if (projectId) buildArgs.push('--project', projectId)
  const [exe, fullArgs] = selfRunArgs(buildArgs)
  const result = spawnSync(exe, fullArgs, { stdio: 'inherit' })
  return result.status === 0
}

function spawnClaim(projectId: string | undefined, taskId: string, by: string): boolean {
  const args = ['exec', 'claim', '--task', taskId, '--by', by, '--msg', 'auto-run']
  if (projectId) args.push('--project', projectId)
  const [exe, fullArgs] = selfRunArgs(args)
  const result = spawnSync(exe, fullArgs, { stdio: 'inherit' })
  return result.status === 0
}

function spawnComplete(projectId: string | undefined, taskId: string, by: string): void {
  const args = ['exec', 'complete', '--task', taskId, '--by', by, '--msg', 'auto-complete']
  if (projectId) args.push('--project', projectId)
  const [exe, fullArgs] = selfRunArgs(args)
  spawnSync(exe, fullArgs, { stdio: 'inherit' })
}

function spawnBlock(
  projectId: string | undefined,
  taskId: string,
  by: string,
  reason: string
): void {
  const args = ['exec', 'block', '--task', taskId, '--by', by, '--msg', reason]
  if (projectId) args.push('--project', projectId)
  const [exe, fullArgs] = selfRunArgs(args)
  spawnSync(exe, fullArgs, { stdio: 'inherit' })
}

function runAutoMode(opts: RunOpts): void {
  const resolvedPaths = resolveProjectPaths({ project: opts.project })
  activateResolvedProjectPaths(resolvedPaths)
  const { schedulePath, executionPath } = resolvedPaths

  const globalConfig = loadExecAgentGlobalConfig(resolveAgentConfigPath(opts, schedulePath))
  const strategyConfig = loadExecStrategyConfig(executionPath)
  const roster = loadRosterForExecutionPath(executionPath)
  const { localIdToRule, phaseSetSuffixToId } = buildTaskPhaseMap(schedulePath)

  const readyJsonPath = join(executionPath, 'generated', 'ready.json')
  const loop = !!opts.loop
  const maxRounds = opts.maxRounds ? Math.max(1, parseInt(opts.maxRounds, 10) || 1) : null
  const dryRun = !!opts.dryRun
  const strategy = opts.strategy ?? 'critical-first'

  let round = 0

  for (;;) {
    round++

    if (!existsSync(readyJsonPath)) {
      process.stdout.write(`ready.json not found: ${readyJsonPath}\nRun: specdojo exec build\n`)
      process.exitCode = 1
      return
    }

    const readySnapshot = readJson(readyJsonPath) as ReadySnapshot
    const orderedIds: string[] =
      strategy === 'fifo'
        ? readySnapshot.strategies.fifo.ordered_task_ids
        : readySnapshot.strategies['critical-first'].ordered_task_ids

    if (orderedIds.length === 0) {
      process.stdout.write('[run] no ready tasks — exit\n')
      return
    }

    const roundSuffix = loop
      ? ` (round ${round}${maxRounds !== null ? `/${maxRounds}` : '/-'})`
      : ''
    const taskMap = new Map(readySnapshot.tasks.map(t => [t.id, t]))
    let ranThisRound = 0

    for (const taskId of orderedIds) {
      const task = taskMap.get(taskId)
      if (!task) continue

      const result = runSingleTask(
        task,
        opts.project,
        executionPath,
        strategyConfig,
        globalConfig,
        roster,
        localIdToRule,
        phaseSetSuffixToId,
        undefined,
        opts.by,
        dryRun
      )

      if (result === 'success') {
        ranThisRound++
      } else if (result === 'rate_limit' && (task.cpm?.slack ?? 1) === 0) {
        process.stdout.write(`[run] stopping: rate limit on critical task ${taskId}.\n`)
        process.exitCode = 1
        return
      }
    }

    process.stdout.write(`[run] all ${ranThisRound} instance(s) completed${roundSuffix}\n`)

    if (!loop) return

    if (maxRounds !== null && round >= maxRounds) {
      process.stdout.write(`[run] reached max-rounds ${maxRounds} — exit\n`)
      return
    }

    const nextRoundSuffix = ` (round ${round + 1}${maxRounds !== null ? `/${maxRounds}` : '/-'})`
    process.stdout.write(`[run] exec build${nextRoundSuffix}...\n`)
    if (!spawnBuild(opts.project)) {
      process.stdout.write('[run] exec build failed — exit\n')
      process.exitCode = 1
      return
    }
  }
}

function runManualMode(opts: RunOpts): void {
  const taskId = opts.task as string
  const resolvedPaths = resolveProjectPaths({ project: opts.project })
  activateResolvedProjectPaths(resolvedPaths)
  const { schedulePath, executionPath } = resolvedPaths

  const globalConfig = loadExecAgentGlobalConfig(resolveAgentConfigPath(opts, schedulePath))
  const strategyConfig = loadExecStrategyConfig(executionPath)
  const roster = loadRosterForExecutionPath(executionPath)
  const { localIdToRule, phaseSetSuffixToId } = buildTaskPhaseMap(schedulePath)

  const readyJsonPath = join(executionPath, 'generated', 'ready.json')
  let task: ReadyTaskView = { id: taskId, schedule_file: '', fifo_rank: 0, critical_first_rank: 0 }
  if (existsSync(readyJsonPath)) {
    const snap = readJson(readyJsonPath) as ReadySnapshot
    const found = snap.tasks.find(t => t.id === taskId)
    if (found) task = found
  }

  const result = runSingleTask(
    task,
    opts.project,
    executionPath,
    strategyConfig,
    globalConfig,
    roster,
    localIdToRule,
    phaseSetSuffixToId,
    opts.agentCmd,
    opts.by,
    !!opts.dryRun
  )

  if (result === 'failure') process.exitCode = 1
}

export function registerRunCommand(exec: Command): void {
  const rcmd = exec
    .command('run')
    .description('Run AI agent for a ready task (--auto selects next by strategy)')

  rcmd.option('--project <projectId>', 'Project id in .specdojo/specdojo.config.json')
  rcmd.option('--by <actor>', 'Actor / agent nickname (informational)')
  rcmd.option('--auto', 'Automatically select and run next ready task', false)
  rcmd.option('--task <taskId>', 'Task ID to run (manual selection)')
  rcmd.option(
    '--strategy <s>',
    'Task selection strategy: critical-first|fifo (default: critical-first)'
  )
  rcmd.option(
    '--loop',
    'Repeat rounds until no ready tasks remain, running exec build between rounds',
    false
  )
  rcmd.option(
    '--max-rounds <n>',
    'Maximum number of rounds when using --loop (ignored without --loop)'
  )
  rcmd.option(
    '--agent-config <path>',
    'Path to exec-agent.yaml global config (default: .specdojo/exec-agent.yaml)'
  )
  rcmd.option(
    '--agent-cmd <command>',
    'Override agent command string, e.g. "opencode run --agent edit-agent" (--task mode only)'
  )
  rcmd.option('--dry-run', 'Print resolved command without executing', false)

  rcmd.action((opts: RunOpts) => {
    try {
      const isAuto = !!opts.auto
      const isManual = !!opts.task

      if (!isAuto && !isManual) {
        process.stdout.write('Specify --auto or --task <taskId>.\n')
        process.exitCode = 1
        return
      }
      if (isAuto && isManual) {
        process.stdout.write('Specify either --auto or --task, not both.\n')
        process.exitCode = 1
        return
      }

      if (isAuto) {
        runAutoMode(opts)
      } else {
        runManualMode(opts)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      process.stdout.write(message + '\n')
      process.exitCode = 1
    }
  })
}
