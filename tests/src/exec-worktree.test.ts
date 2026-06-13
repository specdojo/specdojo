import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { describe, expect, it } from 'vitest'
import {
  ensureExecWorktree,
  resolveWorktreeBase,
  worktreeNameFromTaskId,
} from '../../src/exec-worktree.js'

function git(cwd: string, ...args: string[]): string {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim()
}

function createGitRepository(): string {
  const repo = mkdtempSync(join(tmpdir(), 'specdojo-worktree-repo-'))
  git(repo, 'init')
  git(repo, 'config', 'user.name', 'SpecDojo Test')
  git(repo, 'config', 'user.email', 'specdojo@example.invalid')
  writeFileSync(join(repo, 'README.md'), '# test\n', 'utf8')
  git(repo, 'add', 'README.md')
  git(repo, 'commit', '-m', 'initial')
  return repo
}

describe('exec worktree', () => {
  it('resolves override, configured, and default worktree bases', () => {
    const root = resolve('/tmp/specdojo-root')
    expect(resolveWorktreeBase(root, '/tmp/custom', '../configured')).toBe(resolve('/tmp/custom'))
    expect(resolveWorktreeBase(root, undefined, '../configured')).toBe(
      resolve(root, '../configured')
    )
    expect(resolveWorktreeBase(root, undefined, undefined)).toBe(resolve(root, '../worktrees'))
  })

  it('creates and reuses a task worktree', () => {
    const repo = createGitRepository()
    const base = mkdtempSync(join(tmpdir(), 'specdojo-worktree-base-'))
    try {
      const created = ensureExecWorktree({
        repoRoot: repo,
        worktreeBase: base,
        taskId: 'prj-0001:T-LAUNCH-pm-plan-010',
      })

      expect(created.created).toBe(true)
      expect(created.name).toBe('prj-0001-T-LAUNCH-pm-plan-010')
      expect(created.branch).toBe('exec/prj-0001-T-LAUNCH-pm-plan-010')
      expect(existsSync(join(created.path, 'README.md'))).toBe(true)
      expect(git(created.path, 'branch', '--show-current')).toBe(created.branch)

      const reused = ensureExecWorktree({
        repoRoot: repo,
        worktreeBase: base,
        taskId: 'prj-0001:T-LAUNCH-pm-plan-010',
      })
      expect(reused).toEqual({ ...created, created: false })
    } finally {
      rmSync(repo, { recursive: true, force: true })
      rmSync(base, { recursive: true, force: true })
    }
  })

  it('normalizes task ids for worktree and branch names', () => {
    expect(worktreeNameFromTaskId('prj-0001:T-LAUNCH-pm-plan-010')).toBe(
      'prj-0001-T-LAUNCH-pm-plan-010'
    )
    expect(() => worktreeNameFromTaskId('***')).toThrow('Task ID')
  })

  it('rejects a worktree base inside the repository', () => {
    const repo = createGitRepository()
    try {
      expect(() =>
        ensureExecWorktree({
          repoRoot: repo,
          worktreeBase: join(repo, 'worktrees'),
          taskId: 'T-LAUNCH-pm-plan-010',
        })
      ).toThrow('outside the repository')
    } finally {
      rmSync(repo, { recursive: true, force: true })
    }
  })
})
