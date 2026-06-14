import { execFileSync } from 'node:child_process'
import { chmodSync, existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { describe, expect, it } from 'vitest'
import {
  ensureExecWorktree,
  execBranchExists,
  findExecWorktree,
  listRegisteredWorktrees,
  resolveWorktreeBase,
  worktreeNameFromTaskId,
} from '../../src/exec-worktree.js'
import {
  isCommitTargetPath,
  stabilizeCommitTargets,
} from '../../src/exec-worktree-command.js'

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
      expect(execBranchExists(repo, 'prj-0001:T-LAUNCH-pm-plan-010')).toBe(true)
      expect(findExecWorktree(repo, 'prj-0001:T-LAUNCH-pm-plan-010')).toEqual({
        ...created,
        created: false,
      })
      expect(listRegisteredWorktrees(repo)).toContainEqual({
        path: created.path,
        branch: created.branch,
      })

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

  it('ignores repository-local Git environment inherited from hooks', () => {
    const repo = createGitRepository()
    const base = mkdtempSync(join(tmpdir(), 'specdojo-worktree-base-'))
    const originalIndexFile = process.env.GIT_INDEX_FILE
    try {
      process.env.GIT_INDEX_FILE = '.git/index'
      const created = ensureExecWorktree({
        repoRoot: repo,
        worktreeBase: base,
        taskId: 'prj-0001:T-LAUNCH-pm-plan-010',
      })
      expect(created.created).toBe(true)
      expect(existsSync(join(created.path, 'README.md'))).toBe(true)
    } finally {
      if (originalIndexFile === undefined) delete process.env.GIT_INDEX_FILE
      else process.env.GIT_INDEX_FILE = originalIndexFile
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

  it('selects result and deliverable paths while excluding execution bookkeeping', () => {
    const execution = 'docs/project/execution'
    const result = `${execution}/exec/results/T-001-result.md`

    expect(isCommitTargetPath('docs/project/deliverable.md', execution, result)).toBe(true)
    expect(isCommitTargetPath(result, execution, result)).toBe(true)
    expect(
      isCommitTargetPath(`${execution}/exec/results/T-002-result.md`, execution, result)
    ).toBe(false)
    expect(isCommitTargetPath(`${execution}/exec/plans/T-001-plan.md`, execution, result)).toBe(
      false
    )
    expect(isCommitTargetPath(`${execution}/exec/events/event.json`, execution, result)).toBe(
      false
    )
    expect(isCommitTargetPath(`${execution}/generated/state.json`, execution, result)).toBe(false)
  })

  it('amends files generated by a pre-commit hook into the task commit', () => {
    const repo = createGitRepository()
    try {
      const hookPath = join(repo, '.git', 'hooks', 'pre-commit')
      writeFileSync(hookPath, '#!/bin/sh\nprintf "generated\\n" > generated.txt\n', 'utf8')
      chmodSync(hookPath, 0o755)

      writeFileSync(join(repo, 'README.md'), '# changed\n', 'utf8')
      git(repo, 'add', 'README.md')
      git(repo, 'commit', '-m', 'task change', '--', 'README.md')

      stabilizeCommitTargets(repo, () =>
        git(repo, 'status', '--porcelain', '--', 'generated.txt') ? ['generated.txt'] : []
      )

      expect(git(repo, 'show', 'HEAD:generated.txt')).toBe('generated')
      expect(git(repo, 'status', '--porcelain')).toBe('')
      expect(git(repo, 'rev-list', '--count', 'HEAD')).toBe('2')
    } finally {
      rmSync(repo, { recursive: true, force: true })
    }
  })
})
