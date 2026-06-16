import { spawn, spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join, relative, resolve, sep } from 'node:path'
import { type Command } from 'commander'
import { selfRunArgs } from './spawn-self.js'
import {
  defaultExecDefaultsPath,
  loadExecDefaultsConfig,
  type ExecDefaultsConfig,
  type RateLimitDetection,
} from './exec-agent-config.js'
import { activateResolvedProjectPaths, resolveProjectPaths } from './exec-project.js'
import { readAllEventFiles, foldEventsToState } from './exec-events.js'
import { buildScheduleIndex } from './exec-schedule.js'
import { buildInitialStateFromStrategy } from './exec-schedule-initial.js'
import { listFilesRecursive, readJson, readYaml } from './exec-shared.js'
import {
  loadConfig,
  loadMemberRoster,
  specdojoRootDir,
  type MemberRoster,
  type ProjectMember,
} from './specdojo-config.js'
import { type ReadySnapshot, type ReadyTaskView } from './exec-types.js'
import type { Proficiency } from './exec-types.js'
import { replaceDocIndexRefs } from './doc-index.js'
import {
  extractLocalId,
  extractPhaseSuffix,
  normalizePhaseSetSelection,
  phaseSetNames,
  type PhaseSetSelection,
} from './schedule-phase-sets.js'
import {
  archivePlan,
  generateDeliverablePlan,
  generateSinglePlan,
  loadPlan,
  resolveDeliverableTarget,
} from './exec-plans.js'
import { buildTaskView } from './exec-task-view.js'
import { scaffoldResult, updateResultStatus } from './exec-results.js'
import {
  resolveWorktreeBase,
  worktreeNameFromTaskId,
  type ExecWorktree,
} from './exec-worktree.js'
import {
  checkpointAndEnsureWorktree,
  commitWorktreeChanges,
  mergeWorktreeIntoCurrent,
  removeWorktree,
} from './exec-worktree-ops.js'
import {
  buildPhaseModeIndex,
  resolveApproach,
  resolveTaskCapabilities,
  resolveTaskExecution,
  resolveTaskMode,
  resolveTaskProficiency,
} from './exec-strategy.js'

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
  phase_sets?: PhaseSetSelection
}

type StrategyFile = {
  phase_sets: Record<string, StrategyPhase[]>
  default_phase_set?: string
  default_phase_sets?: PhaseSetSelection
  owner_rules: StrategyOwnerRule[]
}

export type TaskPhaseContext = {
  localId: string
  phaseSet: string
  phaseId: string
}

type RunOpts = {
  project?: string
  by?: string
  strategy?: string
  execDefaults?: string
  agentConfig?: string
  dryRun?: boolean
  auto?: boolean
  task?: string
  deliverable?: string
  plan?: string
  worktree?: boolean
  trackState?: boolean
  archiveOnSuccess?: boolean
  agentCmd?: string
  cmd?: string
  loop?: boolean
  maxRounds?: string
  parallel?: string
  worktreeBase?: string
}

type RunResult = 'success' | 'rate_limit' | 'failure'

export type ResolvedRequirements = {
  capabilities: string[]
  proficiency?: Proficiency
}

type PreparedTask = {
  task: ReadyTaskView
  actor: string
  agentCommands: string[]
  prompt: string
  worktree: ExecWorktree
  resultPath?: string
}

export function buildTaskPhaseMap(schedulePath: string): {
  localIdToPhaseSets: Map<string, string[]>
  phaseSetSuffixToId: Map<string, string>
} {
  const localIdToPhaseSets = new Map<string, string[]>()
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

    let defaultPhaseSets: string[]
    try {
      defaultPhaseSets = phaseSetNames(
        normalizePhaseSetSelection(
          strategy.default_phase_sets,
          strategy.default_phase_set ? [strategy.default_phase_set] : Object.keys(strategy.phase_sets)
        )
      )
    } catch {
      continue
    }

    for (const [phaseSetName, phases] of Object.entries(strategy.phase_sets)) {
      for (const phase of phases) {
        phaseSetSuffixToId.set(`${phaseSetName}:${phase.task_suffix}`, phase.id)
      }
    }

    for (const rule of strategy.owner_rules) {
      let phaseSets: string[]
      try {
        phaseSets = rule.phase_sets
          ? phaseSetNames(normalizePhaseSetSelection(rule.phase_sets, []))
          : rule.phase_set
            ? [rule.phase_set]
            : defaultPhaseSets
      } catch {
        continue
      }
      for (const localId of rule.local_ids) {
        localIdToPhaseSets.set(localId, phaseSets)
      }
    }
  }

  return { localIdToPhaseSets, phaseSetSuffixToId }
}

export function resolveTaskPhaseContext(
  task: ReadyTaskView,
  localIdToPhaseSets: Map<string, string[]>,
  phaseSetSuffixToId: Map<string, string>
): TaskPhaseContext | null {
  const localId = task.local_id
  if (!localId) return null

  const suffix = task.phase_suffix ?? extractPhaseSuffix(task.id)
  if (!suffix) return null

  if (task.phase_set && task.phase_id) {
    return { localId, phaseSet: task.phase_set, phaseId: task.phase_id }
  }

  const phaseSets = localIdToPhaseSets.get(localId)
  if (!phaseSets) return null

  for (const phaseSet of task.phase_set ? [task.phase_set] : phaseSets) {
    const phaseId = phaseSetSuffixToId.get(`${phaseSet}:${suffix}`)
    if (phaseId) return { localId, phaseSet, phaseId }
  }

  return null
}

export function selectCandidates(
  requirements: ResolvedRequirements,
  roster: MemberRoster | null,
  taskMode?: string
): ProjectMember[] {
  if (!roster) return []
  const { capabilities: required, proficiency } = requirements
  return roster.members
    .filter(m => {
      if (m.type !== 'agent' || !m.command) return false
      const caps = m.capabilities ?? []
      if (!required.every(c => caps.includes(c))) return false
      if (proficiency !== undefined && m.proficiency !== proficiency) return false
      // If agent declares a mode and task has a mode, they must match.
      // Agents without a mode field are mode-agnostic and match any task.
      if (m.mode !== undefined && taskMode !== undefined && m.mode !== taskMode) return false
      return true
    })
    .sort((a, b) => {
      // Primary: priority (lower number = tried first)
      const aPriority = a.priority ?? 999
      const bPriority = b.priority ?? 999
      if (aPriority !== bPriority) return aPriority - bPriority
      // Secondary: fewest extra capabilities (tie-breaker within same priority)
      const aExtra = (a.capabilities?.length ?? 0) - required.length
      const bExtra = (b.capabilities?.length ?? 0) - required.length
      return aExtra - bExtra
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

function resolveExecDefaultsPath(opts: RunOpts, schedulePath: string): string {
  if (opts.execDefaults) return opts.execDefaults
  if (opts.agentConfig) return opts.agentConfig

  const { config } = loadConfig()
  if (config) {
    const rootDir = specdojoRootDir()
    for (const project of Object.values(config.projects)) {
      const projSchedulePath = resolve(rootDir, project.schedule_path.trim())
      if (projSchedulePath === schedulePath && project.run?.exec_defaults) {
        return resolve(rootDir, project.run.exec_defaults)
      }
      if (projSchedulePath === schedulePath && project.run?.agent_config) {
        return resolve(rootDir, project.run.agent_config)
      }
    }
  }

  return defaultExecDefaultsPath()
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

function parseParallel(value: string | undefined): number {
  const text = value ?? '1'
  if (!/^\d+$/.test(text)) {
    throw new Error(`--parallel must be a positive integer: ${value ?? ''}`)
  }
  const parsed = Number.parseInt(text, 10)
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new Error(`--parallel must be a positive integer: ${value ?? ''}`)
  }
  return parsed
}

function delay(ms: number): Promise<void> {
  return new Promise(resolveDelay => setTimeout(resolveDelay, ms))
}

export function expandPromptRefs(
  prompt: string,
  indexPath = resolve(specdojoRootDir(), '.specdojo/doc-index.json')
): string {
  if (!existsSync(indexPath)) return prompt

  const result = replaceDocIndexRefs(prompt, indexPath, {
    format: 'markdown',
    missing: 'keep',
  })
  if (result.missingIds.length > 0) {
    process.stderr.write(`Unresolved ID reference(s): ${result.missingIds.join(', ')}\n`)
  }
  return result.content
}

export function loadPrompt(executionPath: string, taskId: string): string | null {
  const plan = loadPlan(executionPath, taskId)
  return plan ? expandPromptRefs(plan) : null
}

export function loadRosterForExecutionPath(executionPath: string): MemberRoster | null {
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

async function executeAgent(
  agentCommand: string,
  prompt: string,
  detection: RateLimitDetection | undefined,
  cwd: string,
  env: NodeJS.ProcessEnv
): Promise<{ result: RunResult; exitCode: number | null; stderr: string }> {
  if (!agentCommand.trim()) {
    return { result: 'failure', exitCode: null, stderr: 'Empty agent command' }
  }

  const child = spawn(agentCommand, {
    cwd,
    env,
    shell: true,
    stdio: ['pipe', 'inherit', 'pipe'],
  })
  let stderr = ''
  child.stderr.setEncoding('utf8')
  child.stderr.on('data', (chunk: string) => {
    stderr += chunk
    process.stderr.write(chunk)
  })
  child.stdin.end(prompt)

  const exitCode = await new Promise<number | null>(resolveExit => {
    child.once('error', error => {
      stderr += `${error.message}\n`
      resolveExit(null)
    })
    child.once('close', code => resolveExit(code))
  })

  if (isRateLimitError(exitCode, stderr, detection)) {
    return { result: 'rate_limit', exitCode, stderr }
  }
  if (exitCode !== 0) {
    return { result: 'failure', exitCode, stderr }
  }
  return { result: 'success', exitCode: 0, stderr: '' }
}

async function runWithRetry(
  agentCommands: string[],
  prompt: string,
  isOnCriticalPath: boolean,
  execDefaults: ExecDefaultsConfig,
  cwd: string,
  env: NodeJS.ProcessEnv
): Promise<RunResult> {
  const detection = execDefaults.rate_limit_detection
  const policy = execDefaults.rate_limit_policy

  const first = await executeAgent(agentCommands[0], prompt, detection, cwd, env)
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
    await delay(actualWait * 1000)
    attemptCount++

    const result = await executeAgent(agentCommands[idx], prompt, detection, cwd, env)
    if (result.result !== 'rate_limit') return result.result

    waitSeconds = Math.min(waitSeconds * retry.backoff_multiplier, retry.max_wait_seconds)
  }

  process.stdout.write(
    `Rate limit: all ${agentCommands.length} member(s) exhausted after ${attemptCount} attempt(s).\n`
  )
  return 'rate_limit'
}

function pathInsideWorktree(repoRoot: string, worktreePath: string, sourcePath: string): string {
  const repoRelative = relative(repoRoot, sourcePath)
  if (repoRelative === '..' || repoRelative.startsWith(`..${sep}`)) {
    throw new Error(`Project path is outside repository root: ${sourcePath}`)
  }
  return resolve(worktreePath, repoRelative)
}

function agentEnvironment(
  repoRoot: string,
  worktreePath: string,
  schedulePath: string,
  executionPath: string
): NodeJS.ProcessEnv {
  return {
    ...process.env,
    SPECDOJO_SCHEDULE_PATH: pathInsideWorktree(repoRoot, worktreePath, schedulePath),
    SPECDOJO_EXECUTION_PATH: pathInsideWorktree(repoRoot, worktreePath, executionPath),
  }
}

function findClaimEventPath(schedulePath: string, taskId: string): string | null {
  const claims = readAllEventFiles(schedulePath).filter(
    item => item.event.task_id === taskId && item.event.type === 'claim'
  )
  return claims[claims.length - 1]?.path ?? null
}

function prepareSingleTask(
  task: ReadyTaskView,
  projectId: string | undefined,
  repoRoot: string,
  schedulePath: string,
  executionPath: string,
  roster: MemberRoster | null,
  localIdToPhaseSets: Map<string, string[]>,
  phaseSetSuffixToId: Map<string, string>,
  agentCmdOverride: string | undefined,
  actorOverride: string | undefined,
  dryRun: boolean,
  skipClaim: boolean,
  worktreeBase: string
): PreparedTask | RunResult {
  const mode = task.mode ?? 'edit'
  process.stdout.write(`Task: ${task.id}${task.name ? ` — ${task.name}` : ''}  [${mode}]\n`)

  const explicitMember = agentCmdOverride
    ? roster?.members.find(
        member =>
          member.type === 'agent' &&
          member.command &&
          (member.nickname === agentCmdOverride || member.command === agentCmdOverride)
      )
    : undefined
  const agentCommands: string[] = agentCmdOverride
    ? [explicitMember?.command ?? agentCmdOverride]
    : []
  let actor = actorOverride ?? 'auto-agent'
  if (!actorOverride && explicitMember) actor = explicitMember.nickname

  if (agentCommands.length === 0) {
    // Human tasks cannot be run automatically without explicit --agent-cmd override.
    if ((task.execution ?? 'agent') === 'human') {
      process.stdout.write(
        `  Task "${task.name ?? task.id}" (${task.id}) has execution: human.\n` +
          `  This task requires human execution. Use --agent-cmd to override.\n`
      )
      return 'failure'
    }

    const phaseCtx = resolveTaskPhaseContext(task, localIdToPhaseSets, phaseSetSuffixToId)
    if (!phaseCtx) {
      process.stdout.write(
        `  Cannot resolve phase context for "${task.name ?? task.id}": not found in sch-strategy files\n`
      )
      return 'failure'
    }

    const requirements: ResolvedRequirements = {
      capabilities: task.capabilities ?? [],
      proficiency: task.proficiency,
    }

    const candidates = selectCandidates(requirements, roster, mode)
    if (candidates.length === 0) {
      process.stdout.write(
        `  No agents found for mode: ${mode}, capabilities: [${requirements.capabilities.join(', ')}]${requirements.proficiency ? `, proficiency: ${requirements.proficiency}` : ''}\n`
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

  const prompt = loadPrompt(executionPath, task.id)
  if (!prompt) {
    process.stdout.write(`  Plan not found for ${task.id}. Run: specdojo exec build\n`)
    return 'failure'
  }

  const worktreeName = worktreeNameFromTaskId(task.id)

  if (dryRun) {
    const worktree: ExecWorktree = {
      path: join(worktreeBase, worktreeName),
      branch: `exec/${worktreeName}`,
      name: worktreeName,
      created: false,
    }
    process.stdout.write(`  [run] would setup: worktree ${worktree.path} (${worktree.branch})\n`)
    const claimMsg = skipClaim
      ? `  [dry-run] already claimed: ${task.id} as ${actor} (skip claim)`
      : `  [dry-run] would claim: ${task.id} as ${actor}`
    process.stdout.write(claimMsg + '\n')
    process.stdout.write(`  [dry-run] Command: ${agentCommands[0]}\n`)
    process.stdout.write(`  [dry-run] CWD: ${worktree.path}\n`)
    process.stdout.write(`  [dry-run] Plan: ${prompt.length} chars\n`)
    return {
      task,
      actor,
      agentCommands,
      prompt,
      worktree,
    }
  }

  if (skipClaim) {
    process.stdout.write(`  Already claimed: ${task.id} as ${actor}\n`)
  } else {
    process.stdout.write(`  Claiming: ${task.id} as ${actor}\n`)
    if (!spawnClaim(projectId, task.id, actor)) {
      process.stdout.write(`  Claim failed: ${task.id}\n`)
      return 'failure'
    }
  }

  const planRef = `exec/plans/${task.id}-plan.md`
  const startedAt = new Date().toISOString()
  const { resultPath } = scaffoldResult({
    executionPath,
    taskId: task.id,
    mode: task.mode ?? 'edit',
    projectId: projectId ?? '',
    planRef,
    agent: actor,
    startedAt,
    ...(task.approach ? { approach: task.approach } : {}),
  })

  // Commit the execution checkpoint (plan/result/claim event) to root HEAD, then create the
  // worktree from that commit. This lets the agent's deliverable changes be committed and merged
  // back (see runPreparedTask), so later tasks branch from a HEAD that includes prior results.
  const claimEventPath = findClaimEventPath(schedulePath, task.id)
  if (!claimEventPath) {
    process.stdout.write(`  Claim event not found for ${task.id}\n`)
    return 'failure'
  }

  const worktree = checkpointAndEnsureWorktree({
    context: { repoRoot, schedulePath, executionPath },
    taskId: task.id,
    base: worktreeBase,
    planPath: join(executionPath, 'exec', 'plans', `${task.id}-plan.md`),
    resultPath,
    claimEventPath,
  })
  const setupAction = worktree.created ? 'setup' : 'reuse'
  process.stdout.write(`  [run] ${setupAction}: worktree ${worktree.path} (${worktree.branch})\n`)

  return {
    task,
    actor,
    agentCommands,
    prompt,
    worktree,
    resultPath,
  }
}

async function runPreparedTask(
  prepared: PreparedTask,
  projectId: string | undefined,
  repoRoot: string,
  schedulePath: string,
  executionPath: string,
  execDefaults: ExecDefaultsConfig,
  dryRun: boolean
): Promise<RunResult> {
  if (dryRun) return 'success'

  process.stdout.write(`  Running: ${prepared.agentCommands[0]}\n`)
  process.stdout.write(`  CWD: ${prepared.worktree.path}\n`)
  const isOnCriticalPath = (prepared.task.cpm?.slack ?? 1) === 0
  const result = await runWithRetry(
    prepared.agentCommands,
    prepared.prompt,
    isOnCriticalPath,
    execDefaults,
    prepared.worktree.path,
    agentEnvironment(repoRoot, prepared.worktree.path, schedulePath, executionPath)
  )

  const completedAt = new Date().toISOString()
  const context = { repoRoot, schedulePath, executionPath }
  const worktreeResultPath = prepared.resultPath
    ? pathInsideWorktree(repoRoot, prepared.worktree.path, prepared.resultPath)
    : undefined

  if (result === 'success') {
    // Record completion in the worktree result, then commit (result + deliverables) onto the
    // exec branch and merge it into the current root branch so the changes are integrated.
    if (worktreeResultPath) updateResultStatus(worktreeResultPath, 'complete', completedAt)
    commitWorktreeChanges({ context, worktree: prepared.worktree, taskId: prepared.task.id })
    mergeWorktreeIntoCurrent({ context, worktree: prepared.worktree, taskId: prepared.task.id })
    removeWorktree({
      context,
      worktree: prepared.worktree,
      taskId: prepared.task.id,
      deleteBranch: true,
    })
    spawnComplete(projectId, prepared.task.id, prepared.actor)
    process.stdout.write(`  Done: ${prepared.task.id}\n`)
  } else if (result === 'rate_limit') {
    // Keep the worktree for inspection / resume; do not merge a blocked task's changes.
    if (worktreeResultPath) updateResultStatus(worktreeResultPath, 'blocked', completedAt)
    spawnBlock(projectId, prepared.task.id, prepared.actor, 'rate limit reached')
    process.stdout.write(
      `  Rate limited: ${prepared.task.id} (worktree kept: ${prepared.worktree.path})\n`
    )
  } else {
    if (worktreeResultPath) updateResultStatus(worktreeResultPath, 'blocked', completedAt)
    spawnBlock(projectId, prepared.task.id, prepared.actor, 'agent exited with non-zero code')
    process.stdout.write(
      `  Failed: ${prepared.task.id} (worktree kept: ${prepared.worktree.path})\n`
    )
  }

  return result
}

function spawnSelf(args: string[]): boolean {
  const [exe, fullArgs] = selfRunArgs(args)
  const result = spawnSync(exe, fullArgs, { stdio: 'inherit', cwd: specdojoRootDir() })
  return result.status === 0
}

function spawnValidate(projectId: string | undefined): boolean {
  const args = ['exec', 'validate']
  if (projectId) args.push('--project', projectId)
  return spawnSelf(args)
}

function spawnBuild(projectId: string | undefined): boolean {
  const buildArgs = ['exec', 'build']
  if (projectId) buildArgs.push('--project', projectId)
  return spawnSelf(buildArgs)
}

function spawnClaim(projectId: string | undefined, taskId: string, by: string): boolean {
  const args = [
    'exec',
    'claim',
    '--task',
    taskId,
    '--by',
    by,
    '--msg',
    'auto-run',
    '--allow-multiple-doing',
  ]
  if (projectId) args.push('--project', projectId)
  return spawnSelf(args)
}

function spawnComplete(projectId: string | undefined, taskId: string, by: string): void {
  const args = ['exec', 'complete', '--task', taskId, '--by', by, '--msg', 'auto-complete']
  if (projectId) args.push('--project', projectId)
  spawnSelf(args)
}

function spawnBlock(
  projectId: string | undefined,
  taskId: string,
  by: string,
  reason: string
): void {
  const args = ['exec', 'block', '--task', taskId, '--by', by, '--msg', reason]
  if (projectId) args.push('--project', projectId)
  spawnSelf(args)
}

async function runBatchMode(opts: RunOpts): Promise<void> {
  const resolvedPaths = resolveProjectPaths({ project: opts.project })
  activateResolvedProjectPaths(resolvedPaths)
  const { schedulePath, executionPath } = resolvedPaths
  const repoRoot = specdojoRootDir()
  const worktreeBase = resolveWorktreeBase(
    repoRoot,
    opts.worktreeBase,
    configuredWorktreeBase(schedulePath)
  )
  const parallel = parseParallel(opts.parallel)

  const execDefaults = loadExecDefaultsConfig(
    resolveExecDefaultsPath(opts, schedulePath),
    executionPath
  )
  const roster = loadRosterForExecutionPath(executionPath)
  const { localIdToPhaseSets, phaseSetSuffixToId } = buildTaskPhaseMap(schedulePath)

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
    const preparedTasks: PreparedTask[] = []

    for (const taskId of orderedIds) {
      if (preparedTasks.length >= parallel) break
      const task = taskMap.get(taskId)
      if (!task) continue

      try {
        const prepared = prepareSingleTask(
          task,
          opts.project,
          repoRoot,
          schedulePath,
          executionPath,
          roster,
          localIdToPhaseSets,
          phaseSetSuffixToId,
          opts.cmd,
          opts.by,
          dryRun,
          false,
          worktreeBase
        )
        if (typeof prepared !== 'string') preparedTasks.push(prepared)
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        process.stderr.write(`[run] setup error for ${task.id}: ${message}\n`)
      }
    }

    if (preparedTasks.length === 0) {
      process.stdout.write('[run] no executable tasks — exit\n')
      process.exitCode = 1
      return
    }

    const settledResults = await Promise.allSettled(
      preparedTasks.map(prepared =>
        runPreparedTask(
          prepared,
          opts.project,
          repoRoot,
          schedulePath,
          executionPath,
          execDefaults,
          dryRun
        )
      )
    )
    const results: RunResult[] = settledResults.map((settled, index) => {
      if (settled.status === 'fulfilled') return settled.value
      const prepared = preparedTasks[index]
      const message =
        settled.reason instanceof Error ? settled.reason.message : String(settled.reason)
      process.stderr.write(`[run] error: ${prepared.worktree.name}: ${message}\n`)
      if (!dryRun) {
        const completedAt = new Date().toISOString()
        if (prepared.resultPath) updateResultStatus(prepared.resultPath, 'blocked', completedAt)
        spawnBlock(opts.project, prepared.task.id, prepared.actor, `runner error: ${message}`)
      }
      return 'failure'
    })
    const completed = results.filter(result => result === 'success').length
    process.stdout.write(`[run] all ${completed} instance(s) completed${roundSuffix}\n`)

    if (results.some(result => result === 'failure')) process.exitCode = 1

    const criticalRateLimit = results.some(
      (result, index) =>
        result === 'rate_limit' && (preparedTasks[index].task.cpm?.slack ?? 1) === 0
    )
    if (criticalRateLimit) {
      process.stdout.write('[run] stopping: rate limit on critical task.\n')
      process.exitCode = 1
      return
    }

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

async function runManualMode(opts: RunOpts): Promise<void> {
  const taskId = opts.task as string
  const resolvedPaths = resolveProjectPaths({ project: opts.project })
  activateResolvedProjectPaths(resolvedPaths)
  const { schedulePath, executionPath } = resolvedPaths
  const repoRoot = specdojoRootDir()
  const worktreeBase = resolveWorktreeBase(
    repoRoot,
    opts.worktreeBase,
    configuredWorktreeBase(schedulePath)
  )

  const execDefaults = loadExecDefaultsConfig(
    resolveExecDefaultsPath(opts, schedulePath),
    executionPath
  )
  const roster = loadRosterForExecutionPath(executionPath)
  const { localIdToPhaseSets, phaseSetSuffixToId } = buildTaskPhaseMap(schedulePath)
  const phaseModeIndex = buildPhaseModeIndex(schedulePath)

  const readyJsonPath = join(executionPath, 'generated', 'ready.json')
  let task: ReadyTaskView = { id: taskId, schedule_file: '', fifo_rank: 0, critical_first_rank: 0 }
  if (existsSync(readyJsonPath)) {
    const snap = readJson(readyJsonPath) as ReadySnapshot
    const found = snap.tasks.find(t => t.id === taskId)
    if (found) task = found
  }
  // If task not in ready.json (e.g. already "doing"), derive local_id from task id pattern.
  if (!task.local_id) {
    const parts = taskId.split('-')
    const localId = extractLocalId(taskId)
    if (localId && parts[0] === 'T' && parts[1]) {
      const track = parts[1]
      task = {
        ...task,
        local_id: localId,
        phase_suffix: extractPhaseSuffix(taskId),
        schedule_file: `sch-track-${track.toLowerCase()}.yaml`,
      }
    }
  }
  if (task.local_id) {
    task = {
      ...task,
      mode:
        task.mode ??
        resolveTaskMode(task.local_id, task.id, phaseModeIndex, task.phase_suffix, task.phase_set),
      execution:
        task.execution ??
        resolveTaskExecution(
          task.local_id,
          task.id,
          phaseModeIndex,
          task.phase_suffix,
          task.phase_set
        ),
      approach:
        task.approach ??
        resolveApproach(task.local_id, task.id, phaseModeIndex, task.phase_suffix, task.phase_set),
    }
    if (!task.capabilities) {
      const capabilities = resolveTaskCapabilities(
        task.local_id,
        task.id,
        phaseModeIndex,
        task.phase_suffix,
        task.phase_set
      )
      if (capabilities.length > 0) task.capabilities = capabilities
    }
    task.proficiency =
      task.proficiency ??
      resolveTaskProficiency(
        task.local_id,
        task.id,
        phaseModeIndex,
        task.phase_suffix,
        task.phase_set
      )
  }

  // If the task is already in "doing" state and --by/--agent-cmd are not specified,
  // use the actor who claimed it and their command to avoid re-selecting a different agent.
  // Read from events directly (not state.json cache) to reflect recent scheduler claims.
  let actorOverride = opts.by
  let agentCmdOverride = opts.agentCmd ?? opts.cmd
  let alreadyClaimed = false
  if (!actorOverride) {
    try {
      const sch = buildScheduleIndex(schedulePath)
      const evts = readAllEventFiles(schedulePath)
      const initTasks = buildInitialStateFromStrategy(schedulePath, sch)
      const snap = foldEventsToState(evts, sch, schedulePath, initTasks)
      const taskState = snap.tasks?.[taskId]
      if (taskState?.state === 'doing' && taskState.last_by) {
        actorOverride = taskState.last_by
        alreadyClaimed = true
        if (!agentCmdOverride && roster) {
          const claimingMember = roster.members.find(
            m => m.nickname === actorOverride && m.type === 'agent' && m.command
          )
          if (claimingMember?.command) {
            agentCmdOverride = claimingMember.command
            process.stdout.write(
              `  Resuming with claiming actor: ${actorOverride} (${agentCmdOverride})\n`
            )
          } else {
            process.stdout.write(`  Resuming with claiming actor: ${actorOverride}\n`)
          }
        }
      }
    } catch {
      // ignore errors reading state; fall through to normal agent selection
    }
  }

  const prepared = prepareSingleTask(
    task,
    opts.project,
    repoRoot,
    schedulePath,
    executionPath,
    roster,
    localIdToPhaseSets,
    phaseSetSuffixToId,
    agentCmdOverride,
    actorOverride,
    !!opts.dryRun,
    alreadyClaimed,
    worktreeBase
  )

  if (typeof prepared === 'string') {
    if (prepared === 'failure') process.exitCode = 1
    return
  }

  const result = await runPreparedTask(
    prepared,
    opts.project,
    repoRoot,
    schedulePath,
    executionPath,
    execDefaults,
    !!opts.dryRun
  )
  if (result === 'failure') process.exitCode = 1
}

// Resolve the agent command for an in-place run, ignoring task state. Unlike the
// worktree flow, this never requires the task to be claimable.
function resolveInPlaceCommand(
  task: ReadyTaskView | null,
  roster: MemberRoster | null,
  opts: RunOpts
): string {
  const override = (opts.agentCmd ?? opts.cmd)?.trim()
  if (override) {
    const member = roster?.members.find(
      m => m.type === 'agent' && m.command && m.nickname === override
    )
    return member?.command ?? override
  }

  if (task && (task.execution ?? 'agent') === 'human') {
    throw new Error(`Task requires human execution. Use --cmd to override: ${task.id}`)
  }

  const by = opts.by?.trim()
  if (by) {
    const member = roster?.members.find(
      m => m.nickname === by && m.type === 'agent' && m.command
    )
    if (!member?.command) throw new Error(`Agent command not found for actor: ${by}`)
    return member.command
  }

  const candidates = selectCandidates(
    { capabilities: task?.capabilities ?? [], proficiency: task?.proficiency },
    roster,
    task?.mode ?? 'edit'
  )
  const command = candidates[0]?.command
  if (!command) throw new Error('No agent found. Specify --cmd <command>.')
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

// Default run path: generate the plan on demand and run the agent in the current
// repository. No worktree, and no claim/complete events unless --track-state.
async function runInPlaceMode(opts: RunOpts): Promise<void> {
  const resolvedPaths = resolveProjectPaths({ project: opts.project })
  activateResolvedProjectPaths(resolvedPaths)
  const { schedulePath, executionPath, catalogPath, rolesPath, viewpointsPath } = resolvedPaths
  const repoRoot = specdojoRootDir()
  const projectId = opts.project ?? process.env.SPECDOJO_PROJECT ?? ''
  const roster = loadRosterForExecutionPath(executionPath)

  const plansDir = join(executionPath, 'exec', 'plans')
  let planPath: string
  let slug: string | undefined
  let task: ReadyTaskView | null = null
  // null target = bring-your-own --plan (not generated, not archived).
  let target: ReturnType<typeof resolveDeliverableTarget> | null = null

  if (opts.plan) {
    planPath = resolve(opts.plan)
    if (!existsSync(planPath)) throw new Error(`Plan not found: ${planPath}`)
  } else if (opts.task) {
    const taskId = opts.task.trim()
    task = buildTaskView(schedulePath, executionPath, taskId)
    slug = taskId
    planPath = join(plansDir, `${taskId}-plan.md`)
  } else {
    target = resolveDeliverableTarget(catalogPath ?? '', (opts.deliverable as string).trim())
    slug = target.slug
    planPath = join(plansDir, `${slug}-plan.md`)
    task = {
      id: slug,
      local_id: target.localId,
      mode: 'edit',
      schedule_file: '',
      fifo_rank: 0,
      critical_first_rank: 0,
    }
  }

  const command = resolveInPlaceCommand(task, roster, opts)
  const label = slug ?? planPath

  if (opts.dryRun) {
    process.stdout.write(`[dry-run] target: ${label} (state ignored)\n`)
    process.stdout.write(`[dry-run] command: ${command}\n`)
    process.stdout.write(`[dry-run] cwd: ${repoRoot}\n`)
    process.stdout.write(`[dry-run] plan: ${planPath}\n`)
    return
  }

  // Generate the plan on demand (skip for bring-your-own --plan).
  const generatedPlan = !opts.plan
  if (opts.task && task) {
    generateSinglePlan({
      executionPath,
      projectId,
      catalogPath: catalogPath ?? '',
      rolesPath,
      viewpointsPath,
      task,
    })
  } else if (target) {
    generateDeliverablePlan({
      executionPath,
      projectId,
      catalogPath: catalogPath ?? '',
      rolesPath,
      viewpointsPath,
      target,
    })
  }

  const prompt = expandPromptRefs(readFileSync(planPath, 'utf8'))

  const trackState = !!opts.trackState
  const actor = opts.by?.trim() ?? ''
  if (trackState) {
    if (!opts.task) throw new Error('--track-state requires --task.')
    if (!actor) throw new Error('--track-state requires --by <actor>.')
    if (!spawnClaim(projectId, opts.task.trim(), actor)) {
      throw new Error(`Claim failed for ${opts.task.trim()} (omit --track-state to run without state).`)
    }
  }

  process.stdout.write(`Running ${label} in place: ${command}\n`)
  const exitCode = await spawnAgentInPlace(command, prompt, repoRoot, schedulePath, executionPath)

  if (trackState && opts.task) {
    if (exitCode === 0) spawnComplete(projectId, opts.task.trim(), actor)
    else spawnBlock(projectId, opts.task.trim(), actor, 'agent exited with non-zero code')
  }

  if (exitCode !== 0) {
    process.exitCode = exitCode
    process.stdout.write(`run failed: ${label} (exit ${exitCode})\n`)
    return
  }

  if (opts.archiveOnSuccess && generatedPlan && slug) {
    const archived = archivePlan({ executionPath, slug })
    if (archived.to) process.stdout.write(`Archived plan: ${archived.to}\n`)
  }
  process.stdout.write(`run done: ${label}\n`)
}

export function registerRunCommand(exec: Command): void {
  const rcmd = exec
    .command('run')
    .description('Run AI agent for a ready task (--auto selects next by strategy)')

  rcmd.option('--project <projectId>', 'Project id in .specdojo/specdojo.config.json')
  rcmd.option('--by <actor>', 'Actor / agent nickname (informational)')
  rcmd.option('--auto', 'Automatically select and run next ready task', false)
  rcmd.option('--task <taskId>', 'Task ID to run (manual selection)')
  rcmd.option('--deliverable <id>', 'Catalog deliverable target: <local_id> or <domain>/<local_id>')
  rcmd.option('--plan <path>', 'Run an existing plan file (in-place; no generation)')
  rcmd.option(
    '--worktree',
    'Isolate execution in a git worktree and integrate back (requires --task)',
    false
  )
  rcmd.option('--track-state', 'Record claim/complete events (requires --task and --by)', false)
  rcmd.option(
    '--archive-on-success',
    'Archive the generated plan to exec/plans/done/ after a successful in-place run',
    false
  )
  rcmd.option(
    '--cmd <command>',
    'Agent nickname or command string (selects a ready-task batch unless a manual target is used)'
  )
  rcmd.option('--parallel <n>', 'Number of worktree instances to run in parallel', '1')
  rcmd.option('--worktree-base <path>', 'Override worktree base directory')
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
    '--exec-defaults <path>',
    'Path to exec-defaults.yaml global config (default: .specdojo/exec-defaults.yaml)'
  )
  rcmd.option('--agent-config <path>', 'Deprecated alias for --exec-defaults')
  rcmd.option(
    '--agent-cmd <command>',
    'Override agent command string, e.g. "opencode run --agent edit-agent" (--task mode only)'
  )
  rcmd.option('--dry-run', 'Print resolved command without executing', false)

  rcmd.action(async (opts: RunOpts) => {
    try {
      const isAuto = !!opts.auto
      const hasTask = !!opts.task
      const hasDeliverable = !!opts.deliverable
      const hasPlan = !!opts.plan
      const isManual = hasTask || hasDeliverable || hasPlan
      const hasCommand = !!opts.cmd
      const isBatch = isAuto || (!isManual && hasCommand)

      if (!isAuto && !isManual && !hasCommand) {
        process.stdout.write('Specify --auto, --cmd, --task, --deliverable, or --plan.\n')
        process.exitCode = 1
        return
      }
      if ([hasTask, hasDeliverable, hasPlan].filter(Boolean).length > 1) {
        process.stdout.write('Specify at most one of --task, --deliverable, --plan.\n')
        process.exitCode = 1
        return
      }
      if (isAuto && isManual) {
        process.stdout.write('Specify either --auto or a manual target, not both.\n')
        process.exitCode = 1
        return
      }
      if (isAuto && hasCommand) {
        process.stdout.write('Specify either --auto or --cmd, not both.\n')
        process.exitCode = 1
        return
      }
      if (opts.agentCmd && !isManual) {
        process.stdout.write('--agent-cmd requires a manual target. Use --cmd for batch execution.\n')
        process.exitCode = 1
        return
      }
      if (opts.worktree && !hasTask) {
        process.stdout.write('--worktree requires --task.\n')
        process.exitCode = 1
        return
      }
      if (isManual && parseParallel(opts.parallel) !== 1) {
        process.stdout.write('--parallel cannot be used with a manual target.\n')
        process.exitCode = 1
        return
      }

      // In-place manual run (default): generate the plan on demand and run in the
      // current repository. No validate/build pass — that is orchestration only.
      if (isManual && !opts.worktree) {
        await runInPlaceMode(opts)
        return
      }

      process.stdout.write('[run] validate...\n')
      if (!spawnValidate(opts.project)) {
        process.stdout.write('[run] validate failed — exit\n')
        process.exitCode = 1
        return
      }
      process.stdout.write('[run] validate: ok\n[run] build...\n')
      if (!spawnBuild(opts.project)) {
        process.stdout.write('[run] build failed — exit\n')
        process.exitCode = 1
        return
      }
      process.stdout.write('[run] build: ok\n')

      if (isBatch) {
        await runBatchMode(opts)
      } else {
        await runManualMode(opts)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      process.stdout.write(message + '\n')
      process.exitCode = 1
    }
  })
}
