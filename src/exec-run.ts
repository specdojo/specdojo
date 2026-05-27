import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { type Command } from 'commander'
import {
  defaultAgentConfigPath,
  loadExecAgentConfig,
  resolveAgentCommand,
  resolveRouting,
  resolveTier,
  type ExecAgentConfig,
  type Tier,
} from './exec-agent-config.js'
import { activateResolvedProjectPaths, resolveProjectPaths } from './exec-project.js'
import { listFilesRecursive, readJson, readYaml, sleepMs } from './exec-shared.js'
import { loadConfig, specdojoRootDir } from './specdojo-config.js'
import { type ReadySnapshot, type ReadyTaskView } from './exec-types.js'
import { resolve } from 'node:path'

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
  difficulty?: string
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
  difficulty: string
}

type RunOpts = {
  project?: string
  by?: string
  count?: string
  strategy?: string
  agentConfig?: string
  dryRun?: boolean
  auto?: boolean
  task?: string
  agentCmd?: string
}

type RunResult = 'success' | 'rate_limit' | 'failure'

export function buildTaskPhaseMap(schedulePath: string): {
  localIdToRule: Map<string, { phaseSet: string; difficulty: string }>
  phaseSetSuffixToId: Map<string, string>
} {
  const localIdToRule = new Map<string, { phaseSet: string; difficulty: string }>()
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
      const difficulty = rule.difficulty ?? 'normal'
      for (const localId of rule.local_ids) {
        localIdToRule.set(localId, { phaseSet, difficulty })
      }
    }
  }

  return { localIdToRule, phaseSetSuffixToId }
}

function resolveTaskPhaseContext(
  task: ReadyTaskView,
  localIdToRule: Map<string, { phaseSet: string; difficulty: string }>,
  phaseSetSuffixToId: Map<string, string>
): TaskPhaseContext | null {
  const name = task.name ?? ''
  const localId = name.split(' ')[0]
  if (!localId) return null

  const rule = localIdToRule.get(localId)
  if (!rule) return null

  const parts = task.id.split('-')
  const suffix = parts[parts.length - 1]
  if (!/^\d{3}$/.test(suffix)) return null

  const phaseId = phaseSetSuffixToId.get(`${rule.phaseSet}:${suffix}`)
  if (!phaseId) return null

  return { localId, phaseSet: rule.phaseSet, phaseId, difficulty: rule.difficulty }
}

function isRateLimitError(
  exitCode: number | null,
  stderr: string,
  config: ExecAgentConfig
): boolean {
  const detection = config.rate_limit_policy?.detection
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

function executeAgent(
  agentCommand: string,
  prompt: string,
  config: ExecAgentConfig
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

  if (isRateLimitError(exitCode, stderr, config)) {
    return { result: 'rate_limit', exitCode, stderr }
  }
  if (exitCode !== 0) {
    return { result: 'failure', exitCode, stderr }
  }
  return { result: 'success', exitCode: 0, stderr: '' }
}

function runWithRetry(
  agentCommand: string,
  prompt: string,
  isOnCriticalPath: boolean,
  config: ExecAgentConfig
): RunResult {
  const first = executeAgent(agentCommand, prompt, config)
  if (first.result !== 'rate_limit') return first.result

  const policy = config.rate_limit_policy
  if (!isOnCriticalPath || !policy) {
    process.stdout.write(`Rate limit detected (non-critical). Skipping task.\n`)
    return 'rate_limit'
  }

  const onCritical = policy.on_critical
  const { retry } = onCritical
  const fallbackTier = onCritical.fallback_tier as Tier
  const fallbackEntry = config.tier_routing[fallbackTier]
  const fallbackCommand = fallbackEntry
    ? (config.agent_commands[fallbackEntry.cmd] ?? agentCommand)
    : agentCommand

  let waitSeconds = retry.initial_wait_seconds
  for (let attempt = 2; attempt <= retry.max_attempts; attempt++) {
    const actualWait = Math.min(waitSeconds, retry.max_wait_seconds)
    process.stdout.write(
      `Rate limit on critical path. Attempt ${attempt}/${retry.max_attempts}: waiting ${actualWait}s...\n`
    )
    sleepMs(actualWait * 1000)

    const result = executeAgent(fallbackCommand, prompt, config)
    if (result.result !== 'rate_limit') return result.result

    waitSeconds = Math.min(waitSeconds * retry.backoff_multiplier, retry.max_wait_seconds)
  }

  process.stdout.write(`Rate limit: all ${retry.max_attempts} attempts exhausted.\n`)
  return 'rate_limit'
}

function runSingleTask(
  task: ReadyTaskView,
  executionPath: string,
  agentConfig: ExecAgentConfig,
  localIdToRule: Map<string, { phaseSet: string; difficulty: string }>,
  phaseSetSuffixToId: Map<string, string>,
  agentCmdOverride: string | undefined,
  dryRun: boolean
): RunResult {
  process.stdout.write(`Task: ${task.id}${task.name ? ` — ${task.name}` : ''}\n`)

  let agentCommand = agentCmdOverride ?? ''

  if (!agentCommand) {
    const phaseCtx = resolveTaskPhaseContext(task, localIdToRule, phaseSetSuffixToId)
    if (!phaseCtx) {
      process.stdout.write(
        `  Cannot resolve phase context for "${task.name ?? task.id}": not found in sch-strategy files\n`
      )
      return 'failure'
    }

    const tierResult = resolveTier(
      phaseCtx.phaseSet,
      phaseCtx.phaseId,
      phaseCtx.difficulty,
      agentConfig
    )
    if (!tierResult) {
      process.stdout.write(
        `  No phase_tier_rule for (${phaseCtx.phaseSet}, ${phaseCtx.phaseId})\n`
      )
      return 'failure'
    }

    const routing = resolveRouting(tierResult.tier, tierResult.capabilities, agentConfig)
    if (!routing) {
      process.stdout.write(`  No tier_routing entry for tier "${tierResult.tier}"\n`)
      return 'failure'
    }

    const resolved = resolveAgentCommand(routing, agentConfig)
    if (!resolved) {
      process.stdout.write(`  No agent_command for cmd "${routing.cmd}"\n`)
      return 'failure'
    }

    agentCommand = resolved
    process.stdout.write(
      `  Phase: ${phaseCtx.phaseSet}/${phaseCtx.phaseId}  Difficulty: ${phaseCtx.difficulty}  Tier: ${tierResult.tier}  Agent: ${routing.cmd}\n`
    )
  }

  const brief = loadBrief(executionPath, task.id)
  if (!brief) {
    process.stdout.write(
      `  Agent brief not found for ${task.id}. Run: specdojo exec build\n`
    )
    return 'failure'
  }

  if (dryRun) {
    process.stdout.write(`  [dry-run] Command: ${agentCommand}\n`)
    process.stdout.write(`  [dry-run] Brief: ${brief.length} chars\n`)
    return 'success'
  }

  process.stdout.write(`  Running: ${agentCommand}\n`)

  const isOnCriticalPath = (task.cpm?.slack ?? 1) === 0
  const result = runWithRetry(agentCommand, brief, isOnCriticalPath, agentConfig)

  if (result === 'success') {
    process.stdout.write(`  Done: ${task.id}\n`)
  } else if (result === 'rate_limit') {
    process.stdout.write(`  Rate limited: ${task.id}\n`)
  } else {
    process.stdout.write(`  Failed: ${task.id}\n`)
  }

  return result
}

function runAutoMode(opts: RunOpts): void {
  const resolvedPaths = resolveProjectPaths({ project: opts.project })
  activateResolvedProjectPaths(resolvedPaths)
  const { schedulePath, executionPath } = resolvedPaths

  const agentConfigPath = resolveAgentConfigPath(opts, schedulePath)
  const agentConfig = loadExecAgentConfig(agentConfigPath)
  const { localIdToRule, phaseSetSuffixToId } = buildTaskPhaseMap(schedulePath)

  const readyJsonPath = join(executionPath, 'generated', 'ready.json')
  if (!existsSync(readyJsonPath)) {
    process.stdout.write(`ready.json not found: ${readyJsonPath}\nRun: specdojo exec build\n`)
    process.exitCode = 1
    return
  }

  const readySnapshot = readJson(readyJsonPath) as ReadySnapshot
  const strategy = opts.strategy ?? 'critical-first'
  const orderedIds: string[] =
    strategy === 'fifo'
      ? readySnapshot.strategies.fifo.ordered_task_ids
      : readySnapshot.strategies['critical-first'].ordered_task_ids

  if (orderedIds.length === 0) {
    process.stdout.write('No ready tasks.\n')
    return
  }

  const count = Math.max(1, parseInt(opts.count ?? '1', 10) || 1)
  const dryRun = !!opts.dryRun
  const taskMap = new Map(readySnapshot.tasks.map(t => [t.id, t]))

  let ran = 0
  for (const taskId of orderedIds) {
    if (ran >= count) break
    const task = taskMap.get(taskId)
    if (!task) continue

    const result = runSingleTask(
      task,
      executionPath,
      agentConfig,
      localIdToRule,
      phaseSetSuffixToId,
      undefined,
      dryRun
    )

    if (result === 'success') {
      ran++
    } else if (result === 'rate_limit' && (task.cpm?.slack ?? 1) === 0) {
      process.stdout.write(`Stopping: rate limit on critical task ${taskId}.\n`)
      process.exitCode = 1
      return
    }
  }

  if (ran === 0) {
    process.stdout.write('No tasks executed.\n')
    process.exitCode = 1
  } else {
    process.stdout.write(`Executed ${ran} task(s).\n`)
  }
}

function runManualMode(opts: RunOpts): void {
  const taskId = opts.task as string
  const resolvedPaths = resolveProjectPaths({ project: opts.project })
  activateResolvedProjectPaths(resolvedPaths)
  const { schedulePath, executionPath } = resolvedPaths

  const agentConfigPath = resolveAgentConfigPath(opts, schedulePath)
  const agentConfig = loadExecAgentConfig(agentConfigPath)
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
    executionPath,
    agentConfig,
    localIdToRule,
    phaseSetSuffixToId,
    opts.agentCmd,
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
  rcmd.option('--count <n>', 'Number of tasks to run (--auto only, default: 1)')
  rcmd.option(
    '--strategy <s>',
    'Task selection strategy: critical-first|fifo (default: critical-first)'
  )
  rcmd.option(
    '--agent-config <path>',
    'Path to exec-agent.yaml (default: .specdojo/exec-agent.yaml)'
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
