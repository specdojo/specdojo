import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Command } from 'commander'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { registerExecCommands } from '../../src/exec.js'

const originalCwd = process.cwd()
const ENV_KEYS = [
  'SPECDOJO_OWNER',
  'SPECDOJO_PROJECT',
  'SPECDOJO_SCHEDULE_PATH',
  'SPECDOJO_EXECUTION_PATH',
]
const originalEnv = Object.fromEntries(ENV_KEYS.map(key => [key, process.env[key]]))

function clearProjectEnv(): void {
  for (const key of ENV_KEYS) delete process.env[key]
}

async function runScheduler(actor: string): Promise<void> {
  clearProjectEnv()
  process.exitCode = undefined
  const program = new Command()
  program.exitOverride()
  registerExecCommands(program)
  await program.parseAsync([
    'node',
    'specdojo',
    'exec',
    'scheduler',
    '--by',
    actor,
  ])
  expect(process.exitCode).toBe(0)
}

function setupProject(): { repo: string; taskId: string; resultPath: string } {
  const repo = mkdtempSync(join(tmpdir(), 'specdojo-scheduler-command-'))
  const taskId = 'T-TEST-doc-010'
  const schedulePath = join(repo, 'schedule')
  const executionPath = join(repo, 'execution')

  mkdirSync(join(repo, '.specdojo'), { recursive: true })
  mkdirSync(schedulePath, { recursive: true })
  mkdirSync(join(executionPath, 'exec', 'events'), { recursive: true })
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
          },
        },
      },
      null,
      2
    ) + '\n',
    'utf8'
  )
  writeFileSync(
    join(schedulePath, 'sch-track-test.yaml'),
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
    join(repo, 'docs', 'ja', 'specdojo', 'templates', 'xer-template.md'),
    '_FRONTMATTER_\n\n## Result\n',
    'utf8'
  )

  return {
    repo,
    taskId,
    resultPath: join(executionPath, 'exec', 'results', `${taskId}-result.md`),
  }
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

describe('exec scheduler command', () => {
  it('claim event と同時に result を scaffold 生成する', async () => {
    const { repo, taskId, resultPath } = setupProject()
    vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

    try {
      process.chdir(repo)
      await runScheduler('edit-agent')

      expect(existsSync(resultPath)).toBe(true)
      expect(readFileSync(resultPath, 'utf8')).toContain(`task_id: ${taskId}`)
      expect(readFileSync(resultPath, 'utf8')).toContain('status: in_progress')
      expect(readFileSync(resultPath, 'utf8')).toContain('project_id: test')
    } finally {
      process.chdir(originalCwd)
      rmSync(repo, { recursive: true, force: true })
    }
  })
})
