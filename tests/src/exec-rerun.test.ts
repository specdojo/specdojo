import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
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

async function runExecRerun(args: string[]): Promise<void> {
  clearProjectEnv()
  process.exitCode = undefined
  const program = new Command()
  program.exitOverride()
  registerExecCommands(program)
  await program.parseAsync(['node', 'specdojo', 'exec', 'rerun', ...args])
}

function setupRepository(): { repo: string; taskId: string; planPath: string } {
  const repo = mkdtempSync(join(tmpdir(), 'specdojo-rerun-repo-'))
  const taskId = 'T-TEST-doc-010'

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
          test: {
            schedule_path: 'schedule',
            execution_path: 'execution',
            catalog_path: 'catalog',
          },
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
  // Minimal templates so plan generation succeeds without the full repo docs.
  writeFileSync(
    join(repo, 'docs', 'ja', 'specdojo', 'templates', 'xep-template.md'),
    '_FRONTMATTER_\n\n# Edit Plan: _TASK_ID_\n\n_DONE_CRITERIA_ITEMS_\n',
    'utf8'
  )
  writeFileSync(
    join(repo, 'docs', 'ja', 'specdojo', 'templates', 'xrp-viewpoint-detail-template.md'),
    '### _VP_ID_\n\n_VP_CHECK_\n',
    'utf8'
  )
  // A completed claim/complete history: rerun must ignore this `done` state.
  writeFileSync(
    join(repo, 'execution', 'exec', 'events', '20260101T000000Z_dev_T-TEST-doc-010_complete.json'),
    JSON.stringify(
      { v: 1, ts: '2026-01-01T00:00:00Z', type: 'complete', task_id: taskId, by: 'dev', msg: 'done' },
      null,
      2
    ) + '\n',
    'utf8'
  )

  const planPath = join(repo, 'execution', 'exec', 'plans', `${taskId}-plan.md`)
  return { repo, taskId, planPath }
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

describe('exec rerun', () => {
  it('regenerates the plan, runs the agent with it, and removes the plan afterward', async () => {
    const { repo, taskId, planPath } = setupRepository()
    vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
    try {
      process.chdir(repo)
      await runExecRerun([
        '--project',
        'test',
        '--task',
        taskId,
        '--agent-cmd',
        FAKE_AGENT_CMD,
      ])

      // The agent received the regenerated plan as its prompt.
      const received = readFileSync(join(repo, 'agent-ran.txt'), 'utf8')
      expect(received).toContain(`# Edit Plan: ${taskId}`)
      expect(received).toContain('Content is complete')

      // Plan is a transient artifact and is deleted after a successful run.
      expect(existsSync(planPath)).toBe(false)
      expect(process.exitCode).toBeUndefined()
    } finally {
      process.chdir(originalCwd)
      rmSync(repo, { recursive: true, force: true })
    }
  })

  it('keeps the plan file when --keep-plan is set', async () => {
    const { repo, taskId, planPath } = setupRepository()
    vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
    try {
      process.chdir(repo)
      await runExecRerun([
        '--project',
        'test',
        '--task',
        taskId,
        '--agent-cmd',
        FAKE_AGENT_CMD,
        '--keep-plan',
      ])

      expect(existsSync(planPath)).toBe(true)
      expect(readFileSync(planPath, 'utf8')).toContain(`# Edit Plan: ${taskId}`)
    } finally {
      process.chdir(originalCwd)
      rmSync(repo, { recursive: true, force: true })
    }
  })

  it('dry-run prints the resolved command without executing the agent', async () => {
    const { repo, taskId, planPath } = setupRepository()
    const lines: string[] = []
    vi.spyOn(process.stdout, 'write').mockImplementation((chunk: string | Uint8Array) => {
      lines.push(String(chunk))
      return true
    })
    try {
      process.chdir(repo)
      await runExecRerun([
        '--project',
        'test',
        '--task',
        taskId,
        '--agent-cmd',
        FAKE_AGENT_CMD,
        '--dry-run',
      ])

      const output = lines.join('')
      expect(output).toContain('[dry-run]')
      expect(output).toContain('state ignored')
      // The agent never ran and the transient plan is cleaned up.
      expect(existsSync(join(repo, 'agent-ran.txt'))).toBe(false)
      expect(existsSync(planPath)).toBe(false)
    } finally {
      process.chdir(originalCwd)
      rmSync(repo, { recursive: true, force: true })
    }
  })
})
