import { afterEach, describe, expect, it } from 'vitest'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { resolveProjectPaths } from '../../src/exec-project.js'

const ENV_KEYS = ['SPECDOJO_PROJECT', 'SPECDOJO_SCHEDULE_PATH', 'SPECDOJO_EXECUTION_PATH']
const originalEnv = Object.fromEntries(ENV_KEYS.map(key => [key, process.env[key]]))
const originalCwd = process.cwd()

function clearEnv(): void {
  for (const key of ENV_KEYS) delete process.env[key]
}

function writeConfig(dir: string): void {
  mkdirSync(join(dir, '.specdojo'), { recursive: true })
  writeFileSync(
    join(dir, '.specdojo', 'specdojo.config.json'),
    JSON.stringify(
      {
        version: 1,
        projects: {
          'prj-a': {
            schedule_path: 'docs/prj-a/schedule',
            execution_path: 'docs/prj-a/execution',
            catalog_path: 'docs/prj-a/catalog',
            roles_path: 'docs/prj-a/pm-roles.yaml',
          },
          'prj-b': {
            schedule_path: 'docs/prj-b/schedule',
            execution_path: 'docs/prj-b/execution',
          },
        },
      },
      null,
      2
    ),
    'utf8'
  )
}

function restoreEnv(): void {
  clearEnv()
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }
}

function withRepo<T>(fn: (dir: string) => T): T {
  const dir = mkdtempSync(join(tmpdir(), 'specdojo-test-'))
  try {
    mkdirSync(join(dir, 'docs'), { recursive: true })
    writeConfig(dir)
    process.chdir(dir)
    clearEnv()
    return fn(dir)
  } finally {
    process.chdir(originalCwd)
    rmSync(dir, { recursive: true, force: true })
    restoreEnv()
  }
}

afterEach(() => {
  process.chdir(originalCwd)
  restoreEnv()
})

describe('resolveProjectPaths', () => {
  it('--project を最優先で解決する', () => {
    withRepo(dir => {
      process.env.SPECDOJO_PROJECT = 'prj-a'
      const paths = resolveProjectPaths({ project: 'prj-b' })
      expect(paths.schedulePath).toBe(join(dir, 'docs/prj-b/schedule'))
      expect(paths.executionPath).toBe(join(dir, 'docs/prj-b/execution'))
    })
  })

  it('SPECDOJO_PROJECT を使って project を解決する', () => {
    withRepo(dir => {
      process.env.SPECDOJO_PROJECT = 'prj-b'
      const paths = resolveProjectPaths({})
      expect(paths.schedulePath).toBe(join(dir, 'docs/prj-b/schedule'))
      expect(paths.executionPath).toBe(join(dir, 'docs/prj-b/execution'))
    })
  })

  it('project 指定がない場合は config の先頭 project にフォールバックする', () => {
    withRepo(dir => {
      const paths = resolveProjectPaths({})
      expect(paths.schedulePath).toBe(join(dir, 'docs/prj-a/schedule'))
      expect(paths.executionPath).toBe(join(dir, 'docs/prj-a/execution'))
      expect(paths.catalogPath).toBe(join(dir, 'docs/prj-a/catalog'))
      expect(paths.rolesPath).toBe(join(dir, 'docs/prj-a/pm-roles.yaml'))
    })
  })

  it('roles_path 未設定の project では rolesPath は undefined になる', () => {
    withRepo(() => {
      const paths = resolveProjectPaths({ project: 'prj-b' })
      expect(paths.rolesPath).toBeUndefined()
    })
  })

  it('直接 path override は SPECDOJO_PROJECT より優先する', () => {
    withRepo(dir => {
      process.env.SPECDOJO_PROJECT = 'prj-b'
      process.env.SPECDOJO_SCHEDULE_PATH = 'custom/schedule'
      process.env.SPECDOJO_EXECUTION_PATH = 'custom/execution'
      const paths = resolveProjectPaths({})
      expect(paths.schedulePath).toBe(join(dir, 'custom/schedule'))
      expect(paths.executionPath).toBe(join(dir, 'custom/execution'))
      expect(paths.catalogPath).toBeUndefined()
    })
  })

  it('直接 path override は schedule/execution の片方だけだとエラーにする', () => {
    withRepo(() => {
      process.env.SPECDOJO_SCHEDULE_PATH = 'custom/schedule'
      expect(() => resolveProjectPaths({})).toThrow(
        'SPECDOJO_SCHEDULE_PATH and SPECDOJO_EXECUTION_PATH'
      )
    })
  })
})
