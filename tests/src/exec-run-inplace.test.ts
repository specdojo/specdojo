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
    '_FRONTMATTER_\n\n# Edit Plan: _TASK_ID_\n\n_DONE_CRITERIA_GOALS_\n',
    'utf8'
  )
  writeFileSync(
    join(repo, 'docs', 'ja', 'specdojo', 'templates', 'xer-template.md'),
    '_FRONTMATTER_\n\n## 1. 実施内容\n',
    'utf8'
  )
  writeFileSync(
    join(repo, 'docs', 'ja', 'specdojo', 'templates', 'xrp-viewpoint-detail-template.md'),
    '### _VP_ID_\n\n_VP_CHECK_\n',
    'utf8'
  )
  writeFileSync(
    join(repo, 'docs', 'ja', 'specdojo', 'templates', 'xep-common-conventions-template.md'),
    '## 記法・リンク規約（共通）\n\n- リンクは `[[id|title]]` 形式。\n',
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

      // --task is task identity, so the plan uses the fixed `<task-id>` name (shared with the
      // claim / run --track-state path), even without worktree or events.
      const planFiles = readdirSync(join(executionPath, 'exec', 'plans')).filter(f =>
        f.endsWith('-plan.md')
      )
      expect(planFiles).toHaveLength(1)
      expect(planFiles[0]).toBe('T-TEST-doc-010-plan.md')
      expect(readdirSync(join(executionPath, 'exec', 'events'))).toHaveLength(0)
      expect(process.exitCode).toBeUndefined()

      // The result is scaffolded so the agent fills a frontmatter-complete file (incl. mode),
      // shares the plan's stem, and its status reflects the successful exit even without events.
      const resultFiles = readdirSync(join(executionPath, 'exec', 'results')).filter(f =>
        f.endsWith('-result.md')
      )
      expect(resultFiles).toHaveLength(1)
      expect(resultFiles[0]).toBe('T-TEST-doc-010-result.md')
      // Plan and result share one stem (1:1 linkage).
      expect(resultFiles[0].replace(/-result\.md$/, '')).toBe(planFiles[0].replace(/-plan\.md$/, ''))
      const result = readFileSync(join(executionPath, 'exec', 'results', resultFiles[0]), 'utf8')
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
      const planFiles = readdirSync(join(executionPath, 'exec', 'plans')).filter(f =>
        f.endsWith('-plan.md')
      )
      expect(planFiles).toHaveLength(1)
      expect(planFiles[0]).toMatch(/^doc-\d{8}T\d{6}Z-[0-9a-f]{4}-plan\.md$/)
    } finally {
      process.chdir(originalCwd)
      rmSync(repo, { recursive: true, force: true })
    }
  })

  it('accumulates a distinct plan+result per lightweight run (audit trail)', async () => {
    const { repo, executionPath } = setupRepository()
    vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
    try {
      process.chdir(repo)
      await runExec(['run', '--project', 'test', '--deliverable', 'doc', '--cmd', FAKE_AGENT_CMD])
      await runExec(['run', '--project', 'test', '--deliverable', 'doc', '--cmd', FAKE_AGENT_CMD])

      const planFiles = readdirSync(join(executionPath, 'exec', 'plans')).filter(f =>
        f.endsWith('-plan.md')
      )
      const resultFiles = readdirSync(join(executionPath, 'exec', 'results')).filter(f =>
        f.endsWith('-result.md')
      )
      // Each run leaves its own plan and result; nothing is overwritten (the trail is preserved).
      expect(planFiles).toHaveLength(2)
      expect(resultFiles).toHaveLength(2)
      expect(new Set(resultFiles).size).toBe(2)
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

      // The unique-named plan is moved out of plans/ into done/.
      const remaining = readdirSync(join(executionPath, 'exec', 'plans')).filter(f =>
        f.endsWith('-plan.md')
      )
      expect(remaining).toHaveLength(0)
      const doneFiles = readdirSync(join(executionPath, 'exec', 'plans', 'done'))
      expect(doneFiles).toHaveLength(1)
      expect(doneFiles[0]).toMatch(/^doc-\d{8}T\d{6}Z-[0-9a-f]{4}-.*-plan\.md$/)
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
      const plansDir = join(executionPath, 'exec', 'plans')
      const planFiles = existsSync(plansDir)
        ? readdirSync(plansDir).filter(f => f.endsWith('-plan.md'))
        : []
      expect(planFiles).toHaveLength(0)
    } finally {
      process.chdir(originalCwd)
      rmSync(repo, { recursive: true, force: true })
    }
  })

  it('scaffolds a frontmatter-complete result from a bring-your-own --plan', async () => {
    const { repo, executionPath } = setupRepository()
    vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
    try {
      process.chdir(repo)
      // A bring-your-own plan carries its task identity in frontmatter; the run
      // must recover it and scaffold the result before launching the agent so the
      // agent fills a frontmatter-complete file instead of inventing one.
      const planPath = join(executionPath, 'exec', 'plans', 'custom-plan.md')
      mkdirSync(join(executionPath, 'exec', 'plans'), { recursive: true })
      writeFileSync(
        planPath,
        [
          '---',
          'id: test:xep-custom',
          'type: exec-plan',
          'task_id: custom',
          'mode: edit',
          'status: ready',
          'project_id: test',
          'approach: fully-guided',
          '---',
          '',
          '# Edit Plan: custom',
          '',
        ].join('\n'),
        'utf8'
      )

      await runExec(['run', '--project', 'test', '--plan', planPath, '--cmd', FAKE_AGENT_CMD])

      const result = readFileSync(
        join(executionPath, 'exec', 'results', 'custom-result.md'),
        'utf8'
      )
      expect(result).toContain('id: test:xer-custom')
      expect(result).toContain('mode: edit')
      expect(result).toContain('approach: fully-guided')
      expect(result).toContain('status: complete')
    } finally {
      process.chdir(originalCwd)
      rmSync(repo, { recursive: true, force: true })
    }
  })

  it('marks the result blocked (exit 1) when the agent exits 0 but leaves the result unfilled', async () => {
    const { repo, executionPath } = setupRepository()
    // Use the real result template placeholders so the unfilled-result check can fire.
    // The fake agent never fills the result, mirroring an agent (e.g. claude -p) that
    // concludes "blocked" yet still exits 0.
    writeFileSync(
      join(repo, 'docs', 'ja', 'specdojo', 'templates', 'xer-template.md'),
      [
        '_FRONTMATTER_',
        '',
        '## 1. 実施内容',
        '',
        '_TODO_: 実施した内容の要約を記入する。',
        '',
        '## 2. 変更ファイル',
        '',
        '_TODO_: 変更したファイルのパスを記入する。',
        '',
      ].join('\n'),
      'utf8'
    )
    vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
    try {
      process.chdir(repo)
      await runExec(['run', '--project', 'test', '--task', 'T-TEST-doc-010', '--cmd', FAKE_AGENT_CMD])

      // The agent ran (exit 0) but produced no result content.
      expect(existsSync(join(repo, 'agent-ran.txt'))).toBe(true)
      expect(process.exitCode).toBe(1)

      const resultFiles = readdirSync(join(executionPath, 'exec', 'results')).filter(f =>
        f.endsWith('-result.md')
      )
      expect(resultFiles).toHaveLength(1)
      const result = readFileSync(join(executionPath, 'exec', 'results', resultFiles[0]), 'utf8')
      expect(result).toContain('status: blocked')
      expect(result).toContain('block_reason:')
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

describe('exec plan (command naming)', () => {
  it('generates a fixed `<task-id>-plan.md` for --task (no --out)', async () => {
    const { repo, executionPath } = setupRepository()
    vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
    try {
      process.chdir(repo)
      await runExec(['plan', '--project', 'test', '--task', 'T-TEST-doc-010'])

      // task identity → the fixed name shared with claim / run --track-state, so a later
      // claim/complete adopts this plan/result without renaming.
      const planFiles = readdirSync(join(executionPath, 'exec', 'plans')).filter(f =>
        f.endsWith('-plan.md')
      )
      expect(planFiles).toEqual(['T-TEST-doc-010-plan.md'])
      expect(process.exitCode).toBe(0)
    } finally {
      process.chdir(originalCwd)
      rmSync(repo, { recursive: true, force: true })
    }
  })

  it('generates a unique-named plan for --deliverable (no task identity)', async () => {
    const { repo, executionPath } = setupRepository()
    vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
    try {
      process.chdir(repo)
      await runExec(['plan', '--project', 'test', '--deliverable', 'doc'])

      const planFiles = readdirSync(join(executionPath, 'exec', 'plans')).filter(f =>
        f.endsWith('-plan.md')
      )
      expect(planFiles).toHaveLength(1)
      expect(planFiles[0]).toMatch(/^doc-\d{8}T\d{6}Z-[0-9a-f]{4}-plan\.md$/)
      expect(process.exitCode).toBe(0)
    } finally {
      process.chdir(originalCwd)
      rmSync(repo, { recursive: true, force: true })
    }
  })
})
