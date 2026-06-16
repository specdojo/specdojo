/**
 * On-demand end-to-end check for `specdojo exec run`.
 *
 * Builds a throwaway git project, runs a single edit task through the real CLI with a
 * deterministic agent command, and verifies that the worktree flow integrates the agent's
 * deliverable change back into the root branch:
 *
 *   claim -> checkpoint commit + worktree -> agent -> commit -> merge -> remove -> complete
 *
 * This is intentionally NOT part of `vitest run`: it spawns the built CLI as subprocesses and
 * copies the full template set, which is too heavy for the standard suite. The core git logic
 * is covered by tests/src/exec-worktree-ops.test.ts; this script verifies the end-to-end wiring.
 *
 * Usage: npm run test:e2e   (runs `npm run build` first)
 */
import { execFileSync } from 'node:child_process'
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
const cliPath = join(projectRoot, 'dist', 'specdojo.js')
const templatesDir = join(projectRoot, 'docs', 'ja', 'specdojo', 'templates')

const TASK_ID = 'T-TEST-doc-010'
const EXEC_BRANCH = `exec/${TASK_ID}`
const DELIVERABLE_REL = join('docs', 'project', 'out.md')
const EDITED_CONTENT = '# Edited by agent\n'

function git(cwd: string, ...args: string[]): string {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim()
}

function cli(cwd: string, args: string[]): string {
  try {
    return execFileSync('node', [cliPath, ...args], { cwd, encoding: 'utf8' })
  } catch (error) {
    const e = error as { stdout?: string; stderr?: string }
    const detail = `${e.stdout ?? ''}${e.stderr ?? ''}`.trim()
    throw new Error(`CLI failed: specdojo ${args.join(' ')}\n${detail}`)
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`assertion failed: ${message}`)
}

function setupFixture(repo: string, worktreeBase: string, agentScript: string): void {
  for (const rel of ['.specdojo', 'schedule', 'execution/exec/events', 'docs/project']) {
    mkdirSync(join(repo, rel), { recursive: true })
  }
  // The full template set is required by `exec build` to generate plans.
  cpSync(templatesDir, join(repo, 'docs', 'ja', 'specdojo', 'templates'), { recursive: true })

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
            run: { worktree_base: worktreeBase },
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
      '    owner: ""',
      '',
    ].join('\n'),
    'utf8'
  )
  writeFileSync(join(repo, DELIVERABLE_REL), '# Existing deliverable\n', 'utf8')
  writeFileSync(join(repo, 'README.md'), '# e2e test repo\n', 'utf8')

  // Deterministic agent: read the plan from stdin, then overwrite the deliverable in its CWD
  // (the worktree). Kept outside the repo so it is not part of the project tree.
  writeFileSync(
    agentScript,
    "let s='';process.stdin.on('data',d=>s+=d);process.stdin.on('end',()=>" +
      `require('fs').writeFileSync(${JSON.stringify(DELIVERABLE_REL)},${JSON.stringify(EDITED_CONTENT)}));\n`,
    'utf8'
  )

  git(repo, 'init', '-q')
  git(repo, 'config', 'user.name', 'SpecDojo E2E')
  git(repo, 'config', 'user.email', 'specdojo-e2e@example.invalid')
  git(repo, 'add', '-A')
  git(repo, 'commit', '-qm', 'initial')
}

function pruneWorktrees(repo: string): void {
  try {
    const list = git(repo, 'worktree', 'list', '--porcelain')
    for (const line of list.split('\n')) {
      if (!line.startsWith('worktree ')) continue
      const path = line.slice('worktree '.length)
      if (path !== repo) git(repo, 'worktree', 'remove', '--force', path)
    }
  } catch {
    // best-effort cleanup
  }
}

function run(): void {
  if (!existsSync(cliPath)) {
    throw new Error(`CLI not built: ${cliPath}. Run "npm run build" first.`)
  }

  const repo = mkdtempSync(join(tmpdir(), 'specdojo-e2e-repo-'))
  const worktreeBase = mkdtempSync(join(tmpdir(), 'specdojo-e2e-wt-'))
  const agentScript = join(worktreeBase, 'agent.cjs')

  try {
    setupFixture(repo, worktreeBase, agentScript)

    cli(repo, ['exec', 'build', '--project', 'test'])
    cli(repo, [
      'exec',
      'run',
      '--project',
      'test',
      '--task',
      TASK_ID,
      '--worktree',
      '--agent-cmd',
      `node ${agentScript}`,
    ])

    // The agent's deliverable change must be merged into the root branch.
    const rootDeliverable = readFileSync(join(repo, DELIVERABLE_REL), 'utf8')
    assert(rootDeliverable === EDITED_CONTENT, `root deliverable merged (got: ${JSON.stringify(rootDeliverable)})`)

    // The deliverable must be committed (no uncommitted changes left in root).
    const dirty = git(repo, 'status', '--porcelain', '--', DELIVERABLE_REL)
    assert(dirty === '', `deliverable committed in root (status: ${JSON.stringify(dirty)})`)

    // HEAD must be the merge commit of the exec branch.
    const headSubject = git(repo, 'log', '-1', '--pretty=%s')
    assert(headSubject.includes(`Merge branch '${EXEC_BRANCH}'`), `HEAD is merge commit (got: ${headSubject})`)

    const subjects = git(repo, 'log', '-4', '--pretty=%s')
    assert(subjects.includes(`exec(${TASK_ID}): apply task changes`), 'apply-task-changes commit present')
    assert(subjects.includes(`exec(${TASK_ID}): prepare execution`), 'prepare-execution checkpoint present')

    // The worktree must be removed and the exec branch deleted.
    const worktrees = git(repo, 'worktree', 'list', '--porcelain')
      .split('\n')
      .filter(line => line.startsWith('worktree '))
    assert(worktrees.length === 1, `only root worktree remains (got ${worktrees.length})`)

    let branchExists = true
    try {
      execFileSync('git', ['-C', repo, 'show-ref', '--verify', '--quiet', `refs/heads/${EXEC_BRANCH}`], {
        stdio: 'ignore',
      })
    } catch {
      branchExists = false
    }
    assert(!branchExists, 'exec branch deleted')

    // A complete event must be recorded for the task. Events are not committed, so read the
    // working-tree events directory rather than the git index.
    const events = readdirSync(join(repo, 'execution', 'exec', 'events'))
    assert(
      events.some(name => name.includes(`${TASK_ID}_complete`)),
      `complete event recorded (events: ${events.join(', ')})`
    )

    process.stdout.write('e2e exec run: PASS\n')
  } finally {
    pruneWorktrees(repo)
    rmSync(repo, { recursive: true, force: true })
    rmSync(worktreeBase, { recursive: true, force: true })
  }
}

try {
  run()
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  process.stderr.write(`e2e exec run: FAIL\n${message}\n`)
  process.exitCode = 1
}
