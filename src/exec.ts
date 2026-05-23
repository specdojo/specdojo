import { Command } from 'commander'
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
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
  defaultConfigPath,
  loadConfig,
  loadMemberRoster,
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
import { ExecEventType, ExecEventV1, SchedulerStrategy } from './exec-types.js'
import { nowUtcIsoSeconds, requireNonEmpty, safeSlug, tsForFilenameUtc } from './exec-shared.js'
import { generateAgentBriefs, writeClaimBriefSnapshotIndex } from './exec-agent-briefs.js'
import { generateTaskCatalog } from './exec-task-catalog.js'

const KNOWN_OWNER_LABELS = ['PO', 'PM', 'BA', 'ARC', 'DEV', 'QE', 'UX', 'OPS'] as const
const KNOWN_OWNER_LABELS_TEXT = KNOWN_OWNER_LABELS.join('|')

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
    opts: any
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
}

function resolveProjectContext(opts: { project?: string }): {
  schedulePath: string
  executionPath: string
  catalogPath?: string
} {
  const resolvedPaths = resolveProjectPaths({ project: opts.project })
  activateResolvedProjectPaths(resolvedPaths)
  return resolvedPaths
}

function loadRosterForOpts(opts: { project?: string }) {
  const { config, configPath } = loadConfig()
  if (!config) return null

  const projectId =
    opts.project?.trim() ||
    process.env.SPECDOJO_PROJECT?.trim() ||
    Object.keys(config.projects)[0] ||
    ''
  const project = config.projects[projectId]
  if (!project) return null

  const baseDir = dirname(configPath)
  return loadMemberRoster(baseDir, project)
}

function findRosterMember(roster: ReturnType<typeof loadRosterForOpts>, actor: string) {
  return roster?.members.find(member => member.nickname === actor) ?? null
}

function resolveClaimOwner(
  opts: { owner?: string },
  actor: string,
  roster: ReturnType<typeof loadRosterForOpts> = null
): string {
  const cliOwner = typeof opts.owner === 'string' ? opts.owner.trim().toUpperCase() : ''
  const envOwner =
    typeof process.env.SPECDOJO_OWNER === 'string'
      ? process.env.SPECDOJO_OWNER.trim().toUpperCase()
      : ''
  const rosterMemberRoles = findRosterMember(roster, actor)?.roles
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

  return cliOwner || envOwner || rosterOwner || actor
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


function saveClaimBriefSnapshot(
  executionPath: string,
  taskId: string,
  actor: string,
  eventTs: string
): void {
  const sourcePath = join(executionPath, 'generated', 'agent-briefs', `${taskId}.md`)
  if (!existsSync(sourcePath)) {
    throw new Error(`agent brief source not found for snapshot: ${sourcePath}`)
  }

  const claimsDir = join(executionPath, 'exec', 'agent-briefs', 'claims')
  const snapshotDir = join(claimsDir, taskId)
  mkdirSync(snapshotDir, { recursive: true })
  const fileName = `${tsForFilenameUtc(eventTs)}--${safeSlug(actor)}.md`
  copyFileSync(sourcePath, join(snapshotDir, fileName))
  writeClaimBriefSnapshotIndex(claimsDir)
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
  const snapshot = foldEventsToState(events, schedule, projectPath)
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

function runSimpleEventCommand(opts: any, type: ExecEventType): void {
  try {
    const { schedulePath } = resolveProjectContext(opts)
    const actor = requireNonEmpty('by', opts.by)
    const roster = loadRosterForOpts(opts)
    assertValidActor(actor, roster)
    const event = buildEvent(type, opts)
    const out = writeEventFile(schedulePath, event)
    process.stdout.write(out + '\n')
    exitWithCode(true)
  } catch (error) {
    printCommandError(error, false)
  }
}

function runLockedEventCommand(opts: any, action: LockedEventAction): void {
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
      const claimOwner = resolveClaimOwner(opts, actor, roster)
      const cpm = computeCpm(state.schedule, schedulePath)
      writeGeneratedCore(schedulePath, state.events, state.schedule, cpm)
      writeScheduleHashAndDiff(schedulePath, state.schedule)
      writeCpmFiles(schedulePath, cpm, state.snapshot)
      generateTaskCatalog(schedulePath, executionPath)
      generateAgentBriefs(
        schedulePath,
        executionPath,
        opts.project ?? process.env.SPECDOJO_PROJECT ?? '',
        resolveProjectContext(opts).catalogPath ?? ''
      )
      saveClaimBriefSnapshot(executionPath, taskId, actor, event.ts)
      event.meta = {
        ...(event.meta ?? {}),
        claim_owner: claimOwner,
      }
      if (plannedOwner) event.meta.planned_owner = plannedOwner
      if (plannedOwner && claimOwner !== plannedOwner && opts.allowOwnerMismatch) {
        event.meta.owner_override = true
      }
    }
    const out = writeEventFile(schedulePath, event)
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
      check: ({ schedule, snapshot }, taskId, actor, opts) =>
        canClaimTask(
          schedule,
          snapshot,
          taskId,
          resolveClaimOwner(opts, actor, loadRosterForOpts(opts)),
          !!opts.allowOwnerMismatch
        ),
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
      const { schedulePath } = resolveProjectContext(opts)
      const res = validateAll(schedulePath)
      printValidateResult(res)
      exitWithCode(res.ok)
    } catch (error) {
      printCommandError(error, false)
    }
  })

  const bcmd = exec.command('build').description('Generate all files under generated/')
  addProjectOptions(bcmd)
  bcmd.action(opts => {
    try {
      const { schedulePath, executionPath, catalogPath } = resolveProjectContext(opts)

      const res = validateAll(schedulePath)
      printValidateResult(res)
      if (!res.ok) {
        exitWithCode(false)
        return
      }

      const schedule = buildScheduleIndex(schedulePath)
      const events = readAllEventFiles(schedulePath)
      const cpm = computeCpm(schedule, schedulePath)

      const snapshot = writeGeneratedCore(schedulePath, events, schedule, cpm)
      writeScheduleHashAndDiff(schedulePath, schedule)
      writeCpmFiles(schedulePath, cpm, snapshot)
      generateTaskCatalog(schedulePath, executionPath)
      generateAgentBriefs(
        schedulePath,
        executionPath,
        opts.project ?? process.env.SPECDOJO_PROJECT ?? '',
        catalogPath ?? ''
      )

      process.stdout.write(`\nGenerated: ${generatedDirForProject(schedulePath)}\n`)
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
      const { schedulePath } = resolveProjectContext(opts)
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

      const readyForOwner = ready.filter(taskId => {
        const claimCheck = canClaimTask(
          state.schedule,
          state.snapshot,
          taskId,
          claimOwner,
          allowOwnerMismatch
        )
        return claimCheck.ok
      })

      const next = selectNextTask(readyForOwner, cpm, strategy)
      if (!next) {
        if (ready.length > 0 && !allowOwnerMismatch) {
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

      const ev: ExecEventV1 = {
        v: 1,
        ts: nowUtcIsoSeconds(),
        type: 'claim',
        task_id: next,
        by: actor,
        msg,
        meta: {
          claim_owner: claimOwner,
          planned_owner: state.schedule.nodes.get(next)?.owner,
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
