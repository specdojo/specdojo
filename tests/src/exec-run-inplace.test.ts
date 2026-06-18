import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Command } from 'commander'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { registerExecCommands } from '../../src/exec.js'

const originalCwd = process.cwd()
const ENV_KEYS = ['SPECDOJO_PROJECT', 'SPECDOJO_SCHEDULE_PATH', 'SPECDOJO_EXECUTION_PATH']
const originalEnv = Object.fromEntries(ENV_KEYS.map(key => [key, process.env[key]]))

const FAKE_AGENT_CMD =
  `node -e "let s='';process.stdin.on('data',d=>s+=d);` +
  `process.stdin.on('end',()=>require('node:fs').writeFileSync('agent-ran.txt',s))"`

function clearProjectEnv(): void {
  for (const key of ENV_KEYS) delete process.env[key]
}

async function runExec(args: string[]): Promise<void> {
  clearProjectEnv()
  process.exitCode = undefined
  const program = new Command()
  program.exitOverride()
  registerExecCommands(program)
  await program.parseAsync(['node', 'specdojo', 'exec', ...args])
}

function setupRepository(): { repo: string; executionPath: string } {
  const repo = mkdtempSync(join(tmpdir(), 'specdojo-run-inplace-'))
  mkdirSync(join(repo, '.specdojo'), { recursive: true })
  mkdirSync(join(repo, 'schedule'), { recursive: true })
  mkdirSync(join(repo, 'catalog'), { recursive: true })
  mkdirSync(join(repo, 'execution', 'exec', 'events'), { recursive: true })
  mkdirSync(join(repo, 'docs', 'ja', 'specdojo', 'templates'), { recursive: true })

  writeFileSync(
    join(repo, '.specdojo', 'specdojo.config.json'),
    JSON.stringify(
      {
        version: 1,
        current_project: 'test',
        projects: {
          test: { schedule_path: 'schedule', execution_path: 'execution', catalog_path: 'catalog' },
        },
      },
      null,
      2
    ) + '\n',
    'utf8'
  )
  writeFileSync(
    join(repo, 'schedule', 'sch-track-test.yaml'),
    [
      'kind: track',
      'id: test:sch-track-test',
      'type: project',
      'status: draft',
      'version: 1',
      'project_id: test',
      'track: test',
      'tasks:',
      '  - local_id: doc',
      '    phase_suffix: "010"',
      '    name: Test document',
      '    duration_days: 1',
      '    depends_on: []',
      '    owner: DEV',
      '',
    ].join('\n'),
    'utf8'
  )
  writeFileSync(
    join(repo, 'catalog', 'dct-test.yaml'),
    [
      'id: test:dct',
      'type: project',
      'status: draft',
      'project_id: test',
      'domain: test',
      'base_path: /docs/test',
      'groups:',
      '  - deliverables:',
      '      - local_id: doc',
      '        name: Test document',
      '        kind: work',
      '        overview: Overview text',
      '        path: doc.md',
      '        done_criteria:',
      '          - text: Content is complete',
      '            roles: [DEV]',
      '            viewpoint: vp-dev-quality',
      '',
    ].join('\n'),
    'utf8'
  )
  writeFileSync(
    join(repo, 'docs', 'ja', 'specdojo', 'templates', 'xep-template.md'),
    '_FRONTMATTER_\n\n# Edit Plan: _TASK_ID_\n\n_REVIEW_VIEWPOINT_ROWS_\n',
    'utf8'
  )
  writeFileSync(
    join(repo, 'docs', 'ja', 'specdojo', 'templates', 'xer-template.md'),
    '_FRONTMATTER_\n\n## 1. 自己レビュー結果\n',
    'utf8'
  )
  writeFileSync(
    join(repo, 'docs', 'ja', 'specdojo', 'templates', 'xrp-viewpoint-detail-template.md'),
    '### _VP_ID_\n\n_VP_CHECK_\n',
    'utf8'
  )

  return { repo, executionPath: join(repo, 'execution') }
}

afterEach(() => {
  process.chdir(originalCwd)
  clearProjectEnv()
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }
  process.exitCode = undefined
  vi.restoreAllMocks()
})

describe('exec run (in-place, default)', () => {
  it('runs --task in the current repo with the generated plan and writes no events', async () => {
    const { repo, executionPath } = setupRepository()
    vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
    try {
      process.chdir(repo)
      await runExec(['run', '--project', 'test', '--task', 'T-TEST-doc-010', '--cmd', FAKE_AGENT_CMD])

      const received = readFileSync(join(repo, 'agent-ran.txt'), 'utf8')
      expect(received).toContain('# Edit Plan: T-TEST-doc-010')
      expect(received).toContain('Content is complete')

      // Default in-place run keeps the plan, creates no worktree, and writes no events.
      expect(existsSync(join(executionPath, 'exec', 'plans', 'T-TEST-doc-010-plan.md'))).toBe(true)
      expect(readdirSync(join(executionPath, 'exec', 'events'))).toHaveLength(0)
      expect(process.exitCode).toBeUndefined()

      // The result is scaffolded so the agent fills a frontmatter-complete file (incl. mode),
      // and its status reflects the successful exit even without --track-state events.
      const result = readFileSync(
        join(executionPath, 'exec', 'results', 'T-TEST-doc-010-result.md'),
        'utf8'
      )
      expect(result).toContain('mode: edit')
      expect(result).toContain('status: complete')
    } finally {
      process.chdir(originalCwd)
      rmSync(repo, { recursive: true, force: true })
    }
  })

  it('runs --deliverable from the catalog (schedule-independent)', async () => {
    const { repo, executionPath } = setupRepository()
    vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
    try {
      process.chdir(repo)
      await runExec(['run', '--project', 'test', '--deliverable', 'doc', '--cmd', FAKE_AGENT_CMD])

      expect(readFileSync(join(repo, 'agent-ran.txt'), 'utf8')).toContain('Content is complete')
      expect(existsSync(join(executionPath, 'exec', 'plans', 'doc-plan.md'))).toBe(true)
    } finally {
      process.chdir(originalCwd)
      rmSync(repo, { recursive: true, force: true })
    }
  })

  it('archives the plan to done/ with --archive-on-success', async () => {
    const { repo, executionPath } = setupRepository()
    vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
    try {
      process.chdir(repo)
      await runExec([
        'run',
        '--project',
        'test',
        '--deliverable',
        'doc',
        '--cmd',
        FAKE_AGENT_CMD,
        '--archive-on-success',
      ])

      expect(existsSync(join(executionPath, 'exec', 'plans', 'doc-plan.md'))).toBe(false)
      const doneFiles = readdirSync(join(executionPath, 'exec', 'plans', 'done'))
      expect(doneFiles).toHaveLength(1)
      expect(doneFiles[0]).toMatch(/^doc-\d{8}T\d{6}Z-[0-9a-f]{4}-plan\.md$/)
    } finally {
      process.chdir(originalCwd)
      rmSync(repo, { recursive: true, force: true })
    }
  })

  it('dry-run resolves without generating a plan or running the agent', async () => {
    const { repo, executionPath } = setupRepository()
    const lines: string[] = []
    vi.spyOn(process.stdout, 'write').mockImplementation((chunk: string | Uint8Array) => {
      lines.push(String(chunk))
      return true
    })
    try {
      process.chdir(repo)
      await runExec([
        'run',
        '--project',
        'test',
        '--deliverable',
        'doc',
        '--cmd',
        FAKE_AGENT_CMD,
        '--dry-run',
      ])

      expect(lines.join('')).toContain('[dry-run]')
      expect(existsSync(join(repo, 'agent-ran.txt'))).toBe(false)
      expect(existsSync(join(executionPath, 'exec', 'plans', 'doc-plan.md'))).toBe(false)
    } finally {
      process.chdir(originalCwd)
      rmSync(repo, { recursive: true, force: true })
    }
  })

  it('rejects --worktree without --task', async () => {
    const { repo } = setupRepository()
    vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
    try {
      process.chdir(repo)
      await runExec(['run', '--project', 'test', '--deliverable', 'doc', '--worktree'])

      expect(process.exitCode).toBe(1)
    } finally {
      process.chdir(originalCwd)
      rmSync(repo, { recursive: true, force: true })
    }
  })
})
