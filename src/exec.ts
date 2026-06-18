import { type Command } from 'commander'
import { existsSync } from 'node:fs'
import { join, resolve as pathResolve } from 'node:path'
import { validateCatalogLocalIds } from './catalog-build.js'
import {
  acquireSchedulerLock,
  buildEvent,
  canBlockTask,
  canCancelTask,
  canClaimTask,
  canCompleteTask,
  canUnblockTask,
  collectRepeatable,
  computeReadyIds,
  findDoingTasksForActor,
  foldEventsToState,
  readAllEventFiles,
  releaseSchedulerLock,
  schedulerLockPath,
  writeEventFile,
} from './exec-events.js'
import {
  activateResolvedProjectPaths,
  eventsDirForProject,
  generatedDirForProject,
  resolveProjectPaths,
} from './exec-project.js'
import {
  assertValidActor,
  loadConfig,
  loadMemberRoster,
  specdojoRootDir,
} from './specdojo-config.js'
import {
  buildScheduleIndex,
  computeCpm,
  exitWithCode,
  printValidateResult,
  selectNextTask,
  validateAll,
  writeCpmFiles,
  writeGeneratedCore,
  writeScheduleHashAndDiff,
} from './exec-schedule.js'
import { type Approach, type ExecEventType, type ExecEventV1, type ReadySnapshot, type SchedulerStrategy, type StateSnapshot, type TaskMode } from './exec-types.js'
import { nowUtcIsoSeconds, readJson, requireNonEmpty } from './exec-shared.js'
import {
  archivePlan,
  generateDeliverablePlan,
  generateSinglePlan,
  resolveDeliverableTarget,
} from './exec-plans.js'
import { scaffoldResult } from './exec-results.js'
import { scaffoldViewpoints } from './review-plan.js'
import { registerRunCommand } from './exec-run.js'
import { buildTaskView } from './exec-task-view.js'
import { registerExecWorktreeCommands } from './exec-worktree-command.js'
import { buildInitialStateFromStrategy } from './exec-schedule-initial.js'
import {
  buildPhaseModeIndex,
  resolveApproach,
  resolveOwnerForLocalId,
  resolveTaskMode,
} from './exec-strategy.js'

const KNOWN_OWNER_LABELS = ['PO', 'PM', 'BA', 'ARC', 'DEV', 'QE', 'UX', 'OPS'] as const
const KNOWN_OWNER_LABELS_TEXT = KNOWN_OWNER_LABELS.join('|')

const KNOWN_APPROACHES = [
  'fully-guided',
  'recipe-guided',
  'freeform',
  'rulebook-maintenance',
  'recipe-maintenance',
  'sample-maintenance',
  'template-maintenance',
] as const

function parseTaskMode(value: unknown): TaskMode {
  const mode = typeof value === 'string' ? value.trim().toLowerCase() : 'edit'
  if (mode !== 'edit' && mode !== 'review') {
    throw new Error(`Invalid --mode value: ${mode}. Use one of: edit|review.`)
  }
  return mode
}

function parseApproach(value: unknown): Approach {
  const approach = typeof value === 'string' ? value.trim().toLowerCase() : ''
  if (!KNOWN_APPROACHES.includes(approach as Approach)) {
    throw new Error(
      `Invalid --approach value: ${approach}. Use one of: ${KNOWN_APPROACHES.join('|')}.`
    )
  }
  return approach as Approach
}

type ExecCommandOpts = {
  project?: string
  by?: string
  task?: string
  msg?: string
  ref?: string[]
  meta?: string[]
  runId?: string
  allowMultipleDoing?: boolean
  lockTimeoutMs?: string
  lockStaleMs?: string
  owner?: string
  allowOwnerMismatch?: boolean
  strategy?: string
  dryRun?: boolean
}

type LoadedExecState = {
  schedule: ReturnType<typeof buildScheduleIndex>
  events: ReturnType<typeof readAllEventFiles>
  snapshot: ReturnType<typeof foldEventsToState>
}

type LockedEventAction = {
  type: 'claim' | 'complete' | 'block' | 'unblock' | 'cancel'
  check: (
    state: LoadedExecState,
    taskId: string,
    actor: string,
    opts: ExecCommandOpts
  ) => { ok: boolean; reason?: string }
  requireSingleDoing?: boolean
}

function addProjectOptions(cmd: Command): Command {
  return cmd.option('--project <projectId>', 'Project id in specdojo.config.json (e.g. shj-0001)')
}

function addLockOptions(cmd: Command): Command {
  return cmd
    .option('--allow-multiple-doing', 'Allow this actor to hold multiple doing tasks', false)
    .option('--lock-timeout-ms <ms>', 'Lock acquisition timeout in ms', '10000')
    .option('--lock-stale-ms <ms>', 'Lock stale threshold in ms', '300000')
}

function addOwnerOptions(cmd: Command): Command {
  return cmd
    .option(
      '--owner <owner>',
      `Planned owner label for assignment checks (${KNOWN_OWNER_LABELS_TEXT}; defaults to SPECDOJO_OWNER, roster owner, or actor)`
    )
    .option('--allow-owner-mismatch', 'Allow claiming a task assigned to a different owner', false)
}

function addCommonAddOptions(cmd: Command): Command {
  addProjectOptions(cmd)
  return cmd
    .requiredOption('--task <taskId>', 'Task/Milestone ID')
    .requiredOption('--by <actor>', 'Actor (human/agent)')
    .requiredOption('--msg <message>', 'Short message')
    .option('--run-id <id>', 'Correlation id')
    .option('--ref <k=v...>', 'refs key=value (repeatable)', collectRepeatable, [])
    .option('--meta <k=v...>', 'meta key=value (repeatable)', collectRepeatable, [])
    .option('--dry-run', 'Print event JSON without writing to disk', false)
}

function resolveProjectContext(opts: { project?: string }): {
  schedulePath: string
  executionPath: string
  catalogPath?: string
  rolesPath?: string
  viewpointsPath?: string
} {
  const resolvedPaths = resolveProjectPaths({ project: opts.project })
  activateResolvedProjectPaths(resolvedPaths)
  return resolvedPaths
}

function loadRosterForOpts(opts: { project?: string }) {
  const { config } = loadConfig()
  if (!config) return null

  const projectId = resolveProjectId(opts)
  const project = config.projects[projectId]
  if (!project) return null

  return loadMemberRoster(specdojoRootDir(), project)
}

function resolveProjectId(opts: { project?: string }): string {
  const { config } = loadConfig()
  return (
    opts.project?.trim() ||
    process.env.SPECDOJO_PROJECT?.trim() ||
    config?.current_project?.trim() ||
    Object.keys(config?.projects ?? {})[0] ||
    ''
  )
}

function findRosterMember(roster: ReturnType<typeof loadRosterForOpts>, actor: string) {
  return roster?.members.find(member => member.nickname === actor) ?? null
}

export function resolveClaimOwner(
  opts: { owner?: string },
  actor: string,
  roster: ReturnType<typeof loadRosterForOpts> = null,
  taskOwner?: string
): string {
  const cliOwner = typeof opts.owner === 'string' ? opts.owner.trim().toUpperCase() : ''
  const envOwner =
    typeof process.env.SPECDOJO_OWNER === 'string'
      ? process.env.SPECDOJO_OWNER.trim().toUpperCase()
      : ''
  const rosterMemberRoles = findRosterMember(roster, actor)?.roles ?? []
  // For multi-role actors, prefer the role matching the task's planned owner.
  const matchedRole =
    taskOwner && rosterMemberRoles.length > 1
      ? rosterMemberRoles.find(
          r =>
            r.trim().toUpperCase() === taskOwner.toUpperCase() &&
            KNOWN_OWNER_LABELS.includes(
              r.trim().toUpperCase() as (typeof KNOWN_OWNER_LABELS)[number]
            )
        )?.trim().toUpperCase() ?? ''
      : ''
  const rosterOwner =
    Array.isArray(rosterMemberRoles) && rosterMemberRoles.length > 0
      ? rosterMemberRoles[0].trim().toUpperCase()
      : ''

  if (cliOwner && !KNOWN_OWNER_LABELS.includes(cliOwner as (typeof KNOWN_OWNER_LABELS)[number])) {
    throw new Error(`Invalid --owner value: ${cliOwner}. Use one of: ${KNOWN_OWNER_LABELS_TEXT}.`)
  }
  if (envOwner && !KNOWN_OWNER_LABELS.includes(envOwner as (typeof KNOWN_OWNER_LABELS)[number])) {
    throw new Error(
      `Invalid SPECDOJO_OWNER value: ${envOwner}. Use one of: ${KNOWN_OWNER_LABELS_TEXT}.`
    )
  }
  if (
    rosterOwner &&
    !KNOWN_OWNER_LABELS.includes(rosterOwner as (typeof KNOWN_OWNER_LABELS)[number])
  ) {
    throw new Error(
      `Invalid roster owner for actor ${actor}: ${rosterOwner}. Use one of: ${KNOWN_OWNER_LABELS_TEXT}.`
    )
  }

  return cliOwner || envOwner || matchedRole || rosterOwner || ''
}

function resolveSchedulerStrategy(
  opts: { strategy?: string },
  actor: string,
  roster: ReturnType<typeof loadRosterForOpts> = null
): SchedulerStrategy {
  const cliStrategy = typeof opts.strategy === 'string' ? opts.strategy.trim().toLowerCase() : ''
  const rosterStrategy = findRosterMember(roster, actor)?.scheduler_strategy ?? ''
  const strategy = (cliStrategy || rosterStrategy || 'critical-first') as SchedulerStrategy

  if (strategy !== 'critical-first' && strategy !== 'fifo') {
    throw new Error(`Invalid --strategy value: ${strategy}. Use one of: critical-first|fifo.`)
  }

  return strategy
}

function printCommandError(error: unknown, fail = true): void {
  const message = error instanceof Error ? error.message : String(error)
  process.stdout.write(message + '\n')
  if (fail) exitWithCode(false)
  else process.exitCode = 1
}

function loadValidatedExecState(projectPath: string): LoadedExecState | null {
  const res = validateAll(projectPath)
  if (!res.ok) {
    printValidateResult(res)
    exitWithCode(false)
    return null
  }

  const schedule = buildScheduleIndex(projectPath)
  const events = readAllEventFiles(projectPath)
  const initialTasks = buildInitialStateFromStrategy(projectPath, schedule)
  const snapshot = foldEventsToState(events, schedule, projectPath, initialTasks)
  return { schedule, events, snapshot }
}

function ensureActorCanClaimNext(
  snapshot: LoadedExecState['snapshot'],
  actor: string,
  allowMultipleDoing: boolean
): boolean {
  const doingTasks = findDoingTasksForActor(snapshot, actor)
  if (allowMultipleDoing || doingTasks.length === 0) return true

  process.stdout.write(
    `Actor ${actor} already has doing task(s): ${doingTasks.join(', ')}\n` +
      `Use --allow-multiple-doing to override.\n`
  )
  exitWithCode(false)
  return false
}

function scaffoldClaimResult(opts: {
  schedulePath: string
  executionPath: string
  state: LoadedExecState
  taskId: string
  projectId: string
  actor: string
  startedAt: string
}): void {
  const scheduleNode = opts.state.schedule.nodes.get(opts.taskId)
  const localId = scheduleNode?.local_id
  const phaseModeIndex = buildPhaseModeIndex(opts.schedulePath)
  const mode = resolveTaskMode(
    localId,
    opts.taskId,
    phaseModeIndex,
    scheduleNode?.phase_suffix,
    scheduleNode?.phase_set
  )
  const approach = resolveApproach(
    localId,
    opts.taskId,
    phaseModeIndex,
    scheduleNode?.phase_suffix,
    scheduleNode?.phase_set
  )
  scaffoldResult({
    executionPath: opts.executionPath,
    taskId: opts.taskId,
    mode,
    projectId: opts.projectId,
    planRef: `exec/plans/${opts.taskId}-plan.md`,
    agent: opts.actor,
    startedAt: opts.startedAt,
    ...(approach ? { approach } : {}),
  })
}

function runSimpleEventCommand(opts: ExecCommandOpts, type: ExecEventType): void {
  try {
    const { schedulePath } = resolveProjectContext(opts)
    const actor = requireNonEmpty('by', opts.by)
    const roster = loadRosterForOpts(opts)
    assertValidActor(actor, roster)
    const event = buildEvent(type, opts)
    if (opts.dryRun) {
      process.stdout.write(`[dry-run] ${JSON.stringify(event, null, 2)}\n`)
      exitWithCode(true)
      return
    }
    const out = writeEventFile(schedulePath, event)
    process.stdout.write(out + '\n')
    exitWithCode(true)
  } catch (error) {
    printCommandError(error, false)
  }
}

function runLockedEventCommand(opts: ExecCommandOpts, action: LockedEventAction): void {
  let lockDir = ''

  try {
    const { schedulePath, executionPath } = resolveProjectContext(opts)
    const actor = requireNonEmpty('by', opts.by)
    const roster = loadRosterForOpts(opts)
    assertValidActor(actor, roster)
    const taskId = requireNonEmpty('task', opts.task)
    const allowMultipleDoing = !!opts.allowMultipleDoing
    const lockTimeoutMs = Number(opts.lockTimeoutMs)
    const lockStaleMs = Number(opts.lockStaleMs)

    lockDir = acquireSchedulerLock(schedulePath, { actor, lockTimeoutMs, lockStaleMs })

    const state = loadValidatedExecState(schedulePath)
    if (!state) return

    if (
      action.requireSingleDoing &&
      !ensureActorCanClaimNext(state.snapshot, actor, allowMultipleDoing)
    ) {
      return
    }

    const check = action.check(state, taskId, actor, opts)
    if (!check.ok) {
      process.stdout.write(`Cannot ${action.type} ${taskId}: ${check.reason}\n`)
      exitWithCode(false)
      return
    }

    const event = buildEvent(action.type, opts)
    if (action.type === 'claim') {
      const plannedOwner = state.schedule.nodes.get(taskId)?.owner
      const claimOwner = resolveClaimOwner(opts, actor, roster, plannedOwner)
      const cpm = computeCpm(state.schedule, schedulePath)
      writeGeneratedCore(schedulePath, state.events, state.schedule, cpm)
      writeScheduleHashAndDiff(schedulePath, state.schedule)
      writeCpmFiles(schedulePath, cpm, state.snapshot)
      event.meta = {
        ...(event.meta ?? {}),
        claim_owner: claimOwner,
      }
      if (plannedOwner) event.meta.planned_owner = plannedOwner
      if (plannedOwner && claimOwner !== plannedOwner && opts.allowOwnerMismatch) {
        event.meta.owner_override = true
      }
    }
    if (opts.dryRun) {
      process.stdout.write(`[dry-run] ${JSON.stringify(event, null, 2)}\n`)
      exitWithCode(true)
      return
    }
    const out = writeEventFile(schedulePath, event)
    if (action.type === 'claim') {
      scaffoldClaimResult({
        schedulePath,
        executionPath,
        taskId,
        state,
        projectId: resolveProjectId(opts),
        actor,
        startedAt: new Date().toISOString(),
      })
    }
    process.stdout.write(out + '\n')
    exitWithCode(true)
  } catch (error) {
    printCommandError(error)
  } finally {
    if (lockDir) {
      try {
        releaseSchedulerLock(lockDir)
      } catch {}
    }
  }
}

export function registerExecCommands(program: Command): void {
  const exec = program.command('exec').description('Execution helpers')
  const lockedActions: Record<LockedEventAction['type'], LockedEventAction> = {
    claim: {
      type: 'claim',
      requireSingleDoing: true,
      check: ({ schedule, snapshot }, taskId, actor, opts) => {
        const taskOwner = schedule.nodes.get(taskId)?.owner
        return canClaimTask(
          schedule,
          snapshot,
          taskId,
          resolveClaimOwner(opts, actor, loadRosterForOpts(opts), taskOwner),
          !!opts.allowOwnerMismatch
        )
      },
    },
    complete: {
      type: 'complete',
      check: ({ schedule, snapshot }, taskId, actor) =>
        canCompleteTask(schedule, snapshot, taskId, actor),
    },
    block: {
      type: 'block',
      check: ({ schedule, snapshot }, taskId, actor) =>
        canBlockTask(schedule, snapshot, taskId, actor),
    },
    unblock: {
      type: 'unblock',
      check: ({ schedule, snapshot }, taskId) => canUnblockTask(schedule, snapshot, taskId),
    },
    cancel: {
      type: 'cancel',
      check: ({ schedule, snapshot }, taskId, actor) =>
        canCancelTask(schedule, snapshot, taskId, actor),
    },
  }

  const types: ExecEventType[] = [
    'claim',
    'note',
    'block',
    'unblock',
    'complete',
    'cancel',
    'link',
    'estimate',
  ]

  for (const t of types) {
    const cmd = exec.command(t).description(`Write ${t} event JSON into exec/events/ (UTC)`)
    addCommonAddOptions(cmd)

    if (t in lockedActions) addLockOptions(cmd)
    if (t === 'claim') addOwnerOptions(cmd)

    if (t in lockedActions) {
      cmd.action(opts => runLockedEventCommand(opts, lockedActions[t as LockedEventAction['type']]))
    } else {
      cmd.action(opts => runSimpleEventCommand(opts, t))
    }
  }

  const vcmd = exec.command('validate').description('Validate schedule + events')
  addProjectOptions(vcmd)
  vcmd.action(opts => {
    try {
      const { schedulePath, catalogPath } = resolveProjectContext(opts)
      const res = validateAll(schedulePath)
      printValidateResult(res)
      // Scheduled tasks resolve their deliverable by bare local_id, so warn when a
      // local_id is not unique project-wide across the catalogs.
      if (catalogPath && existsSync(catalogPath)) {
        for (const warn of validateCatalogLocalIds(catalogPath).warnings) {
          process.stdout.write(`WARN:  ${warn}\n`)
        }
      }
      exitWithCode(res.ok)
    } catch (error) {
      printCommandError(error, false)
    }
  })

  const bcmd = exec.command('build').description('Generate all files under generated/')
  addProjectOptions(bcmd)
  bcmd.action(opts => {
    try {
      const { schedulePath } = resolveProjectContext(opts)

      const res = validateAll(schedulePath)
      printValidateResult(res)
      if (!res.ok) {
        exitWithCode(false)
        return
      }

      const schedule = buildScheduleIndex(schedulePath)
      const events = readAllEventFiles(schedulePath)
      const cpm = computeCpm(schedule, schedulePath)

      // Plans are generated on demand by `exec plan` / `exec run`, not by build.
      const snapshot = writeGeneratedCore(schedulePath, events, schedule, cpm)
      writeScheduleHashAndDiff(schedulePath, schedule)
      writeCpmFiles(schedulePath, cpm, snapshot)

      process.stdout.write(`\nGenerated: ${generatedDirForProject(schedulePath)}\n`)
      exitWithCode(true)
    } catch (error) {
      printCommandError(error, false)
    }
  })

  const planCmd = exec
    .command('plan')
    .description(
      'Generate a plan for a task or catalog deliverable (schedule-independent; does not change state or events)'
    )
  addProjectOptions(planCmd)
  planCmd.option('--task <taskId>', 'Scheduled task ID to generate the plan for')
  planCmd.option('--deliverable <localId>', 'Catalog deliverable local_id (unique project-wide)')
  planCmd.option('--mode <mode>', 'edit|review (deliverable target)', 'edit')
  planCmd.option('--approach <approach>', 'Approach template (deliverable target)')
  planCmd.option(
    '--track <track>',
    'Track to resolve the owner role from sch-strategy owner_rules (deliverable target)'
  )
  planCmd.option('--out <path>', 'Override output path')
  planCmd.action(opts => {
    try {
      const { schedulePath, executionPath, catalogPath, rolesPath, viewpointsPath } =
        resolveProjectContext(opts)
      const hasTask = typeof opts.task === 'string' && opts.task.trim() !== ''
      const hasDeliverable = typeof opts.deliverable === 'string' && opts.deliverable.trim() !== ''
      if (hasTask === hasDeliverable) {
        throw new Error('Specify exactly one of --task or --deliverable.')
      }
      const projectId = resolveProjectId(opts)
      const outOverride = typeof opts.out === 'string' && opts.out.trim() ? opts.out.trim() : undefined

      let outPath: string
      if (hasTask) {
        const task = buildTaskView(schedulePath, executionPath, (opts.task as string).trim())
        outPath = generateSinglePlan({
          executionPath,
          projectId,
          catalogPath: catalogPath ?? '',
          rolesPath,
          viewpointsPath,
          task,
          ...(outOverride ? { outPath: outOverride } : {}),
        })
      } else {
        const target = resolveDeliverableTarget(catalogPath ?? '', (opts.deliverable as string).trim())
        const track = typeof opts.track === 'string' && opts.track.trim() ? opts.track.trim() : undefined
        const owner = resolveOwnerForLocalId(schedulePath, target.localId, track)
        outPath = generateDeliverablePlan({
          executionPath,
          projectId,
          catalogPath: catalogPath ?? '',
          rolesPath,
          viewpointsPath,
          target,
          mode: parseTaskMode(opts.mode),
          ...(opts.approach ? { approach: parseApproach(opts.approach) } : {}),
          ...(owner ? { owner } : {}),
          ...(outOverride ? { outPath: outOverride } : {}),
        })
      }
      process.stdout.write(`Generated: ${outPath}\n`)
      exitWithCode(true)
    } catch (error) {
      printCommandError(error, false)
    }
  })

  const archiveCmd = exec
    .command('archive')
    .description('Archive a completed plan to exec/plans/done/ (or delete it)')
  addProjectOptions(archiveCmd)
  archiveCmd.option('--task <taskId>', 'Scheduled task ID whose plan to archive')
  archiveCmd.option('--deliverable <localId>', 'Catalog deliverable local_id (unique project-wide)')
  archiveCmd.option('--delete', 'Delete the plan instead of moving it to done/', false)
  archiveCmd.action(opts => {
    try {
      const { executionPath, catalogPath } = resolveProjectContext(opts)
      const hasTask = typeof opts.task === 'string' && opts.task.trim() !== ''
      const hasDeliverable = typeof opts.deliverable === 'string' && opts.deliverable.trim() !== ''
      if (hasTask === hasDeliverable) {
        throw new Error('Specify exactly one of --task or --deliverable.')
      }
      const slug = hasTask
        ? (opts.task as string).trim()
        : resolveDeliverableTarget(catalogPath ?? '', (opts.deliverable as string).trim()).slug

      const result = archivePlan({ executionPath, slug, delete: !!opts.delete })
      process.stdout.write(
        result.deleted ? `Deleted: ${result.from}\n` : `Archived: ${result.from} -> ${result.to}\n`
      )
      exitWithCode(true)
    } catch (error) {
      printCommandError(error, false)
    }
  })

  const scmd = exec
    .command('scheduler')
    .description('Auto-claim next task safely (with project-level lock).')
  addProjectOptions(scmd)
  scmd.requiredOption('--by <actor>', 'Actor (agent name)')
  addOwnerOptions(scmd)
  scmd.option(
    '--strategy <strategy>',
    'critical-first|fifo (defaults to member profile or critical-first)'
  )
  scmd.option('--dry-run', 'Do not write; print selected task only', false)
  scmd.option('--msg <message>', 'Claim message', 'auto-claim')
  addLockOptions(scmd)

  scmd.action(opts => {
    let lockDir = ''

    try {
      const { schedulePath, executionPath } = resolveProjectContext(opts)
      const actor = requireNonEmpty('by', opts.by)
      const roster = loadRosterForOpts(opts)
      assertValidActor(actor, roster)
      const strategy = resolveSchedulerStrategy(opts, actor, roster)
      const dryRun = !!opts.dryRun
      const msg = String(opts.msg ?? 'auto-claim')
      const claimOwner = resolveClaimOwner(opts, actor, roster)
      const allowOwnerMismatch = !!opts.allowOwnerMismatch
      const allowMultipleDoing = !!opts.allowMultipleDoing
      const lockTimeoutMs = Number(opts.lockTimeoutMs)
      const lockStaleMs = Number(opts.lockStaleMs)

      lockDir = acquireSchedulerLock(schedulePath, { actor, lockTimeoutMs, lockStaleMs })

      const state = loadValidatedExecState(schedulePath)
      if (!state) return
      if (!ensureActorCanClaimNext(state.snapshot, actor, allowMultipleDoing)) return

      const ready = computeReadyIds(state.schedule, state.snapshot)

      let cpm = null
      try {
        cpm = computeCpm(state.schedule, schedulePath)
      } catch {
        cpm = null
      }

      // Collect all valid owner labels for this actor.
      // Single-role actors use claimOwner; multi-role actors (e.g. indie) check every role.
      const actorAllRoles = findRosterMember(roster, actor)
        ?.roles
        ?.map(r => r.trim().toUpperCase())
        .filter(r => KNOWN_OWNER_LABELS.includes(r as (typeof KNOWN_OWNER_LABELS)[number])) ?? []
      const ownerCandidates =
        actorAllRoles.length > 1 ? actorAllRoles : (claimOwner ? [claimOwner] : [])

      const readyForOwner = ready.filter(taskId => {
        if (ownerCandidates.length === 0) {
          return canClaimTask(
            state.schedule, state.snapshot, taskId, claimOwner, allowOwnerMismatch
          ).ok
        }
        // Pass if any of the actor's roles can claim the task
        return ownerCandidates.some(
          role => canClaimTask(state.schedule, state.snapshot, taskId, role, allowOwnerMismatch).ok
        )
      })

      // Filter by actor mode and execution type from ready.json.
      // Agent actors (with mode set) skip tasks with wrong mode or execution: human.
      const actorMember = findRosterMember(roster, actor)
      const actorMode = actorMember?.mode
      const isAgent = actorMember?.type === 'agent'
      let readyForMode = readyForOwner
      if (actorMode || isAgent) {
        const readyJsonPath = join(generatedDirForProject(schedulePath), 'ready.json')
        if (existsSync(readyJsonPath)) {
          const readySnapshot = readJson(readyJsonPath) as ReadySnapshot
          const taskInfoMap = new Map(
            (readySnapshot.tasks ?? []).map(t => [t.id, t])
          )
          readyForMode = readyForOwner.filter(taskId => {
            const taskInfo = taskInfoMap.get(taskId)
            if (!taskInfo) return true
            // Agents skip manual tasks
            if (isAgent && (taskInfo.execution ?? 'agent') === 'human') return false
            // Mode filter: skip tasks with different mode
            if (actorMode && (taskInfo.mode ?? 'edit') !== actorMode) return false
            return true
          })
        }
      }

      const next = selectNextTask(readyForMode, cpm, strategy)
      if (!next) {
        if (readyForOwner.length > 0 && (actorMode || isAgent)) {
          process.stdout.write(
            `No ready ${actorMode ?? 'agent'} task for ${actor}. ` +
              `${readyForOwner.length} task(s) ready but require different mode or are human-only.\n`
          )
        } else if (ready.length > 0 && !allowOwnerMismatch) {
          process.stdout.write(
            `No ready task assigned to owner ${claimOwner}. Use --owner <${KNOWN_OWNER_LABELS_TEXT}>, SPECDOJO_OWNER, or --allow-owner-mismatch.\n`
          )
        } else {
          process.stdout.write('No ready task to claim.\n')
        }
        exitWithCode(true)
        return
      }

      if (dryRun) {
        process.stdout.write(next + '\n')
        exitWithCode(true)
        return
      }

      // For multi-role actors, use the role that matches the selected task's owner.
      const plannedOwner = state.schedule.nodes.get(next)?.owner ?? ''
      const effectiveClaimOwner =
        ownerCandidates.length > 1 && ownerCandidates.includes(plannedOwner)
          ? plannedOwner
          : claimOwner

      const ev: ExecEventV1 = {
        v: 1,
        ts: nowUtcIsoSeconds(),
        type: 'claim',
        task_id: next,
        by: actor,
        msg,
        meta: {
          claim_owner: effectiveClaimOwner,
          planned_owner: plannedOwner || undefined,
          scheduler_strategy: strategy,
          claimed_via: 'dojo-exec-scheduler',
        },
      }
      if (
        ev.meta?.planned_owner &&
        ev.meta.claim_owner !== ev.meta.planned_owner &&
        allowOwnerMismatch
      ) {
        ev.meta.owner_override = true
      }

      const out = writeEventFile(schedulePath, ev)
      scaffoldClaimResult({
        schedulePath,
        executionPath,
        state,
        taskId: next,
        projectId: resolveProjectId(opts),
        actor,
        startedAt: ev.ts,
      })
      process.stdout.write(out + '\n')
      exitWithCode(true)
    } catch (error) {
      printCommandError(error)
    } finally {
      if (lockDir) {
        try {
          releaseSchedulerLock(lockDir)
        } catch {
          // ignore
        }
      }
    }
  })

  registerRunCommand(exec)
  registerExecWorktreeCommands(exec)

  // exec scaffold: creates project setup files (viewpoints etc.)
  const scaffoldCmd = exec
    .command('scaffold')
    .description('Scaffold project setup files (pm-review-viewpoints.yaml, etc.)')
  addProjectOptions(scaffoldCmd)
  scaffoldCmd.option('--force', 'Overwrite existing files', false)
  scaffoldCmd.action(opts => {
    try {
      const { config } = loadConfig()
      if (!config) throw new Error('specdojo.config.json not found. Run: specdojo config init')

      const projectId =
        opts.project?.trim() ||
        process.env.SPECDOJO_PROJECT?.trim() ||
        config.current_project?.trim() ||
        Object.keys(config.projects)[0] ||
        ''
      if (!projectId) throw new Error('No project specified. Use --project <id>.')

      const project = config.projects[projectId]
      if (!project) throw new Error(`Unknown project: ${projectId}`)

      const baseDir = specdojoRootDir()
      const templatePath = join(
        baseDir,
        'docs',
        'ja',
        'specdojo',
        'templates',
        'pm-review-viewpoints-template.yaml'
      )

      if (project.viewpoints_path) {
        const outputPath = pathResolve(baseDir, project.viewpoints_path.trim())
        const result = scaffoldViewpoints({
          templatePath,
          projectId,
          outputPath,
          force: !!opts.force,
        })
        if (result.written) {
          process.stdout.write(`Written: ${outputPath}\n`)
        } else {
          process.stdout.write(`Skipped (already exists): ${outputPath}\n`)
        }
      } else {
        process.stdout.write(
          `viewpoints_path not set for project '${projectId}'. Add it to specdojo.config.json.\n`
        )
      }
    } catch (error) {
      printCommandError(error, false)
    }
  })

  const statusCmd = exec
    .command('status')
    .description('Show tasks filtered by state and actor')
  addProjectOptions(statusCmd)
  statusCmd.option('--by <actor>', 'Filter by actor nickname')
  statusCmd.option(
    '--state <state>',
    'Filter by state: todo|doing|blocked|done|cancelled (default: doing)',
    'doing'
  )
  statusCmd.action(opts => {
    try {
      const { schedulePath } = resolveProjectContext(opts)

      // Compute state directly from events (not from cached state.json)
      const state = loadValidatedExecState(schedulePath)
      if (!state) return
      const snapshot: StateSnapshot = state.snapshot
      const schedule = state.schedule

      const filterState = String(opts.state ?? 'doing')
      const filterBy = typeof opts.by === 'string' ? opts.by.trim() : undefined

      const entries = Object.entries(snapshot.tasks)
        .filter(([, cs]) => cs.state === filterState)
        .filter(([, cs]) => !filterBy || cs.last_by === filterBy)
        .sort(([a], [b]) => a.localeCompare(b))

      if (entries.length === 0) {
        const byMsg = filterBy ? ` for ${filterBy}` : ''
        process.stdout.write(`No ${filterState} tasks${byMsg}.\n`)
        exitWithCode(true)
        return
      }

      const byMsg = filterBy ? ` for ${filterBy}` : ''
      process.stdout.write(`${filterState} tasks${byMsg}:\n\n`)
      process.stdout.write(`  ${'task_id'.padEnd(40)} ${'name'.padEnd(20)} by            claimed_at\n`)
      process.stdout.write(`  ${'-'.repeat(40)} ${'-'.repeat(20)} ${'-'.repeat(14)} --------------------\n`)
      for (const [taskId, cs] of entries) {
        const node = schedule.nodes.get(taskId)
        const name = (node?.name ?? '-').slice(0, 18)
        const by = (cs.last_by ?? '-').slice(0, 12)
        const ts = cs.last_ts ?? '-'
        process.stdout.write(`  ${taskId.padEnd(40)} ${name.padEnd(20)} ${by.padEnd(14)} ${ts}\n`)
      }
      process.stdout.write('')
      exitWithCode(true)
    } catch (error) {
      printCommandError(error, false)
    }
  })

  const wcmd = exec.command('where').description('Print resolved paths')
  addProjectOptions(wcmd)
  wcmd.action(opts => {
    try {
      const resolvedPaths = resolveProjectContext(opts)
      process.stdout.write(`schedule-path: ${resolvedPaths.schedulePath}\n`)
      process.stdout.write(`execution-path: ${resolvedPaths.executionPath}\n`)
      const projectPath = resolvedPaths.schedulePath
      process.stdout.write(`exec/events : ${eventsDirForProject(projectPath)}\n`)
      process.stdout.write(`generated   : ${generatedDirForProject(projectPath)}\n`)
      process.stdout.write(`scheduler-lock: ${schedulerLockPath(projectPath)}\n`)
    } catch (error) {
      printCommandError(error, false)
    }
  })
}
