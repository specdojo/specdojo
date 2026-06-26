import { existsSync, readFileSync } from 'node:fs'
import { relative, resolve, sep } from 'node:path'
import { load } from 'js-yaml'
import { acquireSchedulerLock, releaseSchedulerLock } from './exec-events.js'
import {
  ensureExecWorktree,
  execBranchExists,
  findExecWorktree,
  gitOutput,
  gitResult,
  worktreeNameFromTaskId,
  type ExecWorktree,
} from './exec-worktree.js'

const DEFAULT_LOCK_TIMEOUT_MS = 10_000
const DEFAULT_LOCK_STALE_MS = 300_000
const MAX_COMMIT_STABILIZATION_ATTEMPTS = 3

// Minimal context shared by worktree operations. Structurally compatible with the
// ProjectContext used by the CLI commands and the resolved paths used by exec run.
export type WorktreeOpsContext = {
  repoRoot: string
  schedulePath: string
  executionPath: string
}

export function repoRelative(repoRoot: string, path: string): string {
  const value = relative(repoRoot, path)
  if (!value || value === '..' || value.startsWith(`..${sep}`)) {
    throw new Error(`Path is outside repository root: ${path}`)
  }
  return value.split(sep).join('/')
}

export function currentBranch(repoRoot: string): string {
  const branch = gitOutput(repoRoot, ['branch', '--show-current']).trim()
  if (!branch) throw new Error('Detached HEAD is not supported for exec worktree commands.')
  return branch
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

export function worktreeStatusPaths(repoRoot: string): string[] {
  return statusPaths(repoRoot)
}

export function taskPaths(
  context: WorktreeOpsContext,
  taskId: string
): {
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
  // doc-index は root と worktree の双方で再生成される生成物。commit-target に含めると
  // merge 時の overlap ガードで衝突するため除外する。
  if (normalized === '.specdojo/doc-index.json') return false
  if (normalized.startsWith(`${executionRel}/exec/plans/`)) return false
  if (normalized.startsWith(`${executionRel}/exec/results/`)) return false
  if (normalized.startsWith(`${executionRel}/exec/events/`)) return false
  if (normalized.startsWith(`${executionRel}/generated/`)) return false
  return true
}

// Reads a deliverable's frontmatter `status`. Markdown deliverables carry it in the
// leading `---` frontmatter block; yaml/json deliverables carry it as a top-level field.
// Returns undefined when absent or unparsable (treated as "not ready").
export function deliverableStatus(content: string, relPath: string): string | undefined {
  let source = content
  if (/\.md$/i.test(relPath)) {
    const fm = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    if (!fm) return undefined
    source = fm[1]
  }
  let parsed: unknown
  try {
    parsed = load(source)
  } catch {
    return undefined
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return undefined
  const status = (parsed as Record<string, unknown>).status
  return typeof status === 'string' ? status : undefined
}

// Promotion of a deliverable's frontmatter status to "ready" is a human-only gate.
// Agents commit their changes through commitWorktreeChanges, so reject (block) any run
// that transitions a deliverable to "ready" here; humans promote out-of-band via a direct
// edit and git commit, which never passes through this path.
function assertNoAgentReadyPromotion(
  context: WorktreeOpsContext,
  worktree: ExecWorktree,
  taskId: string,
  paths: string[]
): void {
  const { resultRel } = taskPaths(context, taskId)
  const promoted: string[] = []
  for (const relPath of paths) {
    if (relPath === resultRel) continue
    const absPath = resolve(worktree.path, relPath)
    if (!existsSync(absPath)) continue // deletion is not a promotion
    if (deliverableStatus(readFileSync(absPath, 'utf8'), relPath) !== 'ready') continue
    const base = gitResult(worktree.path, ['show', `HEAD:${relPath}`])
    const baseStatus =
      base.status === 0 && typeof base.stdout === 'string'
        ? deliverableStatus(base.stdout, relPath)
        : undefined
    if (baseStatus !== 'ready') promoted.push(relPath)
  }
  if (promoted.length > 0) {
    throw new Error(
      `Deliverable status promotion to "ready" is human-only and must not be done by an agent run: ${promoted.join(', ')}`
    )
  }
}

export function commitTargetPaths(
  context: WorktreeOpsContext,
  worktree: ExecWorktree,
  taskId: string
): string[] {
  const { executionRel, resultRel } = taskPaths(context, taskId)
  return statusPaths(worktree.path).filter(path =>
    isCommitTargetPath(path, executionRel, resultRel)
  )
}

export function stabilizeCommitTargets(
  repoRoot: string,
  listRemainingPaths: () => string[],
  maxAttempts = MAX_COMMIT_STABILIZATION_ATTEMPTS
): void {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const paths = listRemainingPaths()
    if (paths.length === 0) return

    gitOutput(repoRoot, ['add', '-A', '--', ...paths])
    const staged = gitResult(repoRoot, ['diff', '--cached', '--quiet', '--', ...paths])
    if (staged.status === 0) {
      throw new Error(`Failed to stage post-hook commit-target changes: ${paths.join(', ')}`)
    }
    if (staged.status !== 1) throw new Error('Failed to inspect post-hook worktree changes.')

    gitOutput(repoRoot, ['commit', '--amend', '--no-edit', '--', ...paths])
  }

  const dirty = listRemainingPaths()
  if (dirty.length > 0) {
    throw new Error(`Pre-commit hooks kept changing commit-target files: ${dirty.join(', ')}`)
  }
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

// Commit the task result and deliverable changes inside the worktree onto its exec branch.
// Excludes plans, events, generated files, and other tasks' results (see isCommitTargetPath).
export function commitWorktreeChanges(params: {
  context: WorktreeOpsContext
  worktree: ExecWorktree
  taskId: string
  message?: string
  dryRun?: boolean
}): { targets: string[]; committed: boolean } {
  const { context, worktree, taskId } = params
  const paths = commitTargetPaths(context, worktree, taskId)
  if (paths.length === 0) {
    process.stdout.write('No commit-target changes.\n')
    return { targets: [], committed: false }
  }
  assertNoAgentReadyPromotion(context, worktree, taskId, paths)
  process.stdout.write(`commit-targets:\n${paths.map(path => `  ${path}`).join('\n')}\n`)
  if (params.dryRun) return { targets: paths, committed: false }

  gitOutput(worktree.path, ['add', '-A', '--', ...paths])
  const staged = gitResult(worktree.path, ['diff', '--cached', '--quiet', '--', ...paths])
  if (staged.status === 0) {
    process.stdout.write('No staged commit-target changes.\n')
    return { targets: paths, committed: false }
  }
  if (staged.status !== 1) throw new Error('Failed to inspect staged worktree changes.')
  gitOutput(worktree.path, [
    'commit',
    '-m',
    params.message?.trim() || `exec(${taskId}): apply task changes`,
    '--',
    ...paths,
  ])
  stabilizeCommitTargets(worktree.path, () => commitTargetPaths(context, worktree, taskId))
  return { targets: paths, committed: true }
}

// Merge the task exec branch into the branch currently checked out at repoRoot.
// Serializes with the scheduler lock so parallel merges do not race on root HEAD.
export function mergeWorktreeIntoCurrent(params: {
  context: WorktreeOpsContext
  worktree: ExecWorktree
  taskId: string
  ffOnly?: boolean
  dryRun?: boolean
}): void {
  const { context, worktree, taskId } = params
  const targetBranch = currentBranch(context.repoRoot)
  if (targetBranch === worktree.branch) {
    throw new Error(`Merge must run from a branch other than ${worktree.branch}.`)
  }
  let lockDir = ''
  try {
    if (!params.dryRun) {
      lockDir = acquireSchedulerLock(context.schedulePath, {
        actor: `worktree-merge:${targetBranch}`,
        lockTimeoutMs: DEFAULT_LOCK_TIMEOUT_MS,
        lockStaleMs: DEFAULT_LOCK_STALE_MS,
      })
    }
    const dirty = commitTargetPaths(context, worktree, taskId)
    if (dirty.length > 0) {
      throw new Error(`Worktree has uncommitted commit-target changes: ${dirty.join(', ')}`)
    }
    const compareBase = gitOutput(context.repoRoot, ['merge-base', 'HEAD', worktree.branch]).trim()
    const count = Number.parseInt(
      gitOutput(context.repoRoot, ['rev-list', '--count', `${compareBase}..${worktree.branch}`]).trim(),
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
    if (params.dryRun) {
      process.stdout.write(
        `[dry-run] git merge ${params.ffOnly ? '--ff-only' : '--no-ff --no-edit'} ${worktree.branch}\n`
      )
      return
    }
    gitOutput(
      context.repoRoot,
      params.ffOnly
        ? ['merge', '--ff-only', worktree.branch]
        : ['merge', '--no-ff', '--no-edit', worktree.branch]
    )
  } finally {
    if (lockDir) releaseSchedulerLock(lockDir)
  }
}

// Remove a task worktree once its commit-target changes are committed and merged.
export function removeWorktree(params: {
  context: WorktreeOpsContext
  worktree: ExecWorktree
  taskId: string
  force?: boolean
  deleteBranch?: boolean
  dryRun?: boolean
}): void {
  const { context, worktree, taskId } = params
  if (resolve(context.repoRoot) === resolve(worktree.path)) {
    throw new Error('Run remove from the merge-target worktree, not the task worktree.')
  }
  const dirty = commitTargetPaths(context, worktree, taskId)
  const merged =
    gitResult(context.repoRoot, ['merge-base', '--is-ancestor', worktree.branch, 'HEAD']).status === 0
  if (!params.force && dirty.length > 0) {
    throw new Error(`Worktree has uncommitted commit-target changes: ${dirty.join(', ')}`)
  }
  if (!params.force && !merged) {
    throw new Error(`Exec branch is not merged into current HEAD: ${worktree.branch}`)
  }
  // Past the guards, any remaining uncommitted files are non-commit-target bookkeeping
  // (doc-index, generated/, events) that were intentionally excluded from the task commit.
  // git refuses to remove a worktree while those are dirty, so force past them: they are
  // regenerable, and the tool already judged the worktree removable.
  const leftover = worktreeStatusPaths(worktree.path)
  const forceGit = params.force || leftover.length > 0
  if (params.force) {
    process.stderr.write('Warning: forcing worktree removal; uncommitted changes may be lost.\n')
  } else if (leftover.length > 0) {
    process.stderr.write(`Discarding regenerated files in worktree: ${leftover.join(', ')}\n`)
  }
  if (params.dryRun) {
    process.stdout.write(
      `[dry-run] git worktree remove${forceGit ? ' --force' : ''} ${worktree.path}\n`
    )
    if (params.deleteBranch) process.stdout.write(`[dry-run] git branch -d ${worktree.branch}\n`)
    return
  }

  gitOutput(context.repoRoot, [
    'worktree',
    'remove',
    ...(forceGit ? ['--force'] : []),
    worktree.path,
  ])
  if (params.deleteBranch) gitOutput(context.repoRoot, ['branch', '-d', worktree.branch])
}

// Commit the execution checkpoint (plan/result/claim event) onto root HEAD, then create
// the task worktree from that commit. Reuses an existing worktree or exec branch when present.
export function checkpointAndEnsureWorktree(params: {
  context: WorktreeOpsContext
  taskId: string
  worktreeTaskId: string
  base: string
  planPath: string
  resultPath: string
  claimEventPath: string
}): ExecWorktree {
  const { context, taskId, worktreeTaskId, base } = params
  const branch = `exec/${worktreeNameFromTaskId(worktreeTaskId)}`

  const existing = findExecWorktree(context.repoRoot, worktreeTaskId)
  if (existing) return existing

  if (!execBranchExists(context.repoRoot, worktreeTaskId)) {
    if (currentBranch(context.repoRoot) === branch) {
      throw new Error(`Prepare must run from a branch other than ${branch}.`)
    }
    const staged = gitResult(context.repoRoot, ['diff', '--cached', '--quiet'])
    if (staged.status === 1) {
      throw new Error('Root index has staged changes; commit or unstage them first.')
    }
    if (staged.status !== 0) throw new Error('Failed to inspect staged changes in root worktree.')

    const paths = [params.planPath, params.resultPath, params.claimEventPath].map(path =>
      repoRelative(context.repoRoot, path)
    )
    gitOutput(context.repoRoot, ['add', '--', ...paths])
    const checkpoint = gitResult(context.repoRoot, ['diff', '--cached', '--quiet', '--', ...paths])
    if (checkpoint.status === 1) {
      gitOutput(context.repoRoot, [
        'commit',
        '-m',
        `exec(${taskId}): prepare execution`,
        '--',
        ...paths,
      ])
    } else if (checkpoint.status !== 0) {
      throw new Error('Failed to inspect execution checkpoint changes.')
    }
  }

  return ensureExecWorktree({ repoRoot: context.repoRoot, worktreeBase: base, taskId: worktreeTaskId })
}
