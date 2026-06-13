import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { isAbsolute, join, relative, resolve, sep } from 'node:path'

export type ExecWorktree = {
  path: string
  branch: string
  name: string
  created: boolean
}

const GIT_LOCAL_ENV_VARS = [
  'GIT_ALTERNATE_OBJECT_DIRECTORIES',
  'GIT_COMMON_DIR',
  'GIT_DIR',
  'GIT_GRAFT_FILE',
  'GIT_IMPLICIT_WORK_TREE',
  'GIT_INDEX_FILE',
  'GIT_NO_REPLACE_OBJECTS',
  'GIT_OBJECT_DIRECTORY',
  'GIT_PREFIX',
  'GIT_REPLACE_REF_BASE',
  'GIT_SHALLOW_FILE',
  'GIT_WORK_TREE',
] as const

function gitEnvironment(): NodeJS.ProcessEnv {
  const env = { ...process.env }
  for (const name of GIT_LOCAL_ENV_VARS) delete env[name]
  return env
}

function git(repoRoot: string, args: string[]): ReturnType<typeof spawnSync> {
  return spawnSync('git', ['-C', repoRoot, ...args], {
    encoding: 'utf8',
    env: gitEnvironment(),
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

export function worktreeNameFromTaskId(value: string): string {
  const slug = value
    .trim()
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
  if (!slug) throw new Error(`Task ID cannot be used as a worktree name: ${value}`)
  return slug
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
  taskId: string
}): ExecWorktree {
  const repoRoot = resolve(opts.repoRoot)
  const baseRelative = relative(repoRoot, resolve(opts.worktreeBase))
  if (baseRelative === '' || (!baseRelative.startsWith(`..${sep}`) && baseRelative !== '..')) {
    throw new Error(`Worktree base must be outside the repository: ${opts.worktreeBase}`)
  }
  const name = worktreeNameFromTaskId(opts.taskId)
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
