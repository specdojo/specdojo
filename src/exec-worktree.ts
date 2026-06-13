import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { isAbsolute, join, relative, resolve, sep } from 'node:path'

export type ExecWorktree = {
  path: string
  branch: string
  name: string
  created: boolean
}

function git(repoRoot: string, args: string[]): ReturnType<typeof spawnSync> {
  return spawnSync('git', ['-C', repoRoot, ...args], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}

function gitOutput(repoRoot: string, args: string[]): string {
  const result = git(repoRoot, args)
  if (result.status !== 0) {
    const stderr = typeof result.stderr === 'string' ? result.stderr.trim() : ''
    throw new Error(`git ${args.join(' ')} failed${stderr ? `: ${stderr}` : ''}`)
  }
  return typeof result.stdout === 'string' ? result.stdout : ''
}

export function worktreeSlug(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'agent'
}

export function resolveWorktreeBase(
  repoRoot: string,
  override: string | undefined,
  configured: string | undefined
): string {
  const value = override?.trim() || configured?.trim() || '../worktrees'
  return isAbsolute(value) ? resolve(value) : resolve(repoRoot, value)
}

function registeredWorktrees(repoRoot: string): Map<string, string | undefined> {
  const output = gitOutput(repoRoot, ['worktree', 'list', '--porcelain'])
  const result = new Map<string, string | undefined>()
  let currentPath: string | undefined

  for (const line of output.split(/\r?\n/)) {
    if (line.startsWith('worktree ')) {
      currentPath = resolve(line.slice('worktree '.length))
      result.set(currentPath, undefined)
    } else if (currentPath && line.startsWith('branch refs/heads/')) {
      result.set(currentPath, line.slice('branch refs/heads/'.length))
    } else if (line === '') {
      currentPath = undefined
    }
  }

  return result
}

export function ensureExecWorktree(opts: {
  repoRoot: string
  worktreeBase: string
  instanceName: string
  slot: number
}): ExecWorktree {
  const repoRoot = resolve(opts.repoRoot)
  if (!Number.isInteger(opts.slot) || opts.slot < 1) {
    throw new Error(`Worktree slot must be a positive integer: ${opts.slot}`)
  }
  const baseRelative = relative(repoRoot, resolve(opts.worktreeBase))
  if (baseRelative === '' || (!baseRelative.startsWith(`..${sep}`) && baseRelative !== '..')) {
    throw new Error(`Worktree base must be outside the repository: ${opts.worktreeBase}`)
  }
  const name = `${worktreeSlug(opts.instanceName)}-${opts.slot}`
  const branch = `exec/${name}`
  const worktreePath = resolve(join(opts.worktreeBase, name))
  const registered = registeredWorktrees(repoRoot)
  const registeredBranch = registered.get(worktreePath)

  if (registered.has(worktreePath)) {
    if (!existsSync(worktreePath)) {
      throw new Error(`Registered worktree path does not exist: ${worktreePath}`)
    }
    if (registeredBranch !== branch) {
      throw new Error(
        `Worktree ${worktreePath} uses branch ${registeredBranch ?? '(detached)'}; expected ${branch}`
      )
    }
    return { path: worktreePath, branch, name, created: false }
  }

  if (existsSync(worktreePath)) {
    throw new Error(`Worktree path already exists but is not registered: ${worktreePath}`)
  }

  mkdirSync(opts.worktreeBase, { recursive: true })
  const branchExists =
    git(repoRoot, ['show-ref', '--verify', '--quiet', `refs/heads/${branch}`]).status === 0
  const args = branchExists
    ? ['worktree', 'add', worktreePath, branch]
    : ['worktree', 'add', worktreePath, '-b', branch]
  gitOutput(repoRoot, args)

  return { path: worktreePath, branch, name, created: true }
}
