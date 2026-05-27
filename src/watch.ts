import { type Command } from 'commander'
import { watch as fsWatch, existsSync, readdirSync } from 'node:fs'
import type { FSWatcher } from 'node:fs'
import { spawn } from 'node:child_process'
import { join, resolve } from 'node:path'
import { loadConfig, loadEnv, specdojoRootDir } from './specdojo-config.js'
import { selfRunArgs } from './spawn-self.js'

// ================================
// Types
// ================================

type WatchScope = 'exec' | 'catalog' | 'register' | 'index' | 'all'

type ScopeState = {
  timer: ReturnType<typeof setTimeout> | null
  running: boolean
  queued: boolean
}

type WatchContext = {
  projectId: string | undefined
  schedulePath: string | undefined
  eventsPath: string | undefined
  catalogPath: string | undefined
  projectRegisterPath: string | undefined
  docsRootPath: string
}

const VALID_SCOPES: WatchScope[] = ['exec', 'catalog', 'register', 'index', 'all']

const SKIP_DIRS = new Set(['.git', 'node_modules', 'generated', 'dist', '.vitepress'])

// ================================
// Path Resolution
// ================================

function resolveWatchContext(opts: { project?: string }): WatchContext {
  loadEnv()
  const { config, configPath } = loadConfig()
  const baseDir = specdojoRootDir()

  const projectId =
    opts.project?.trim() ||
    process.env.SPECDOJO_PROJECT?.trim() ||
    (config ? Object.keys(config.projects)[0] : undefined)

  const docsRootPath = resolve(specdojoRootDir(), 'docs')

  if (!config || !projectId) {
    return {
      projectId: undefined,
      schedulePath: undefined,
      eventsPath: undefined,
      catalogPath: undefined,
      projectRegisterPath: undefined,
      docsRootPath,
    }
  }

  const project = config.projects[projectId]
  if (!project) {
    throw new Error(`Unknown project: ${projectId} (check ${configPath})`)
  }

  const executionPath = project.execution_path
    ? resolve(baseDir, project.execution_path)
    : undefined

  return {
    projectId,
    schedulePath: project.schedule_path ? resolve(baseDir, project.schedule_path) : undefined,
    eventsPath: executionPath ? join(executionPath, 'exec', 'events') : undefined,
    catalogPath: project.catalog_path ? resolve(baseDir, project.catalog_path) : undefined,
    projectRegisterPath: project.project_register_path
      ? resolve(baseDir, project.project_register_path)
      : undefined,
    docsRootPath,
  }
}

// ================================
// File Pattern Matching
// ================================

function matchesExec(filename: string, watchedDir: string, ctx: WatchContext): boolean {
  if (ctx.schedulePath && watchedDir === ctx.schedulePath) {
    return /^sch-.+\.yaml$/.test(filename)
  }
  if (ctx.eventsPath && watchedDir === ctx.eventsPath) {
    return filename.endsWith('.json')
  }
  return false
}

function matchesCatalog(filename: string): boolean {
  return /^dct-.+\.yaml$/.test(filename)
}

function matchesRegister(filename: string): boolean {
  return filename === 'pjr-index.md'
}

function matchesIndex(filename: string): boolean {
  return filename.endsWith('.md') || filename.endsWith('.yaml')
}

// ================================
// Build Runner
// ================================

function buildCommand(
  scope: Exclude<WatchScope, 'all'>,
  ctx: WatchContext
): { label: string; subArgs: string[] } | null {
  const projectArgs = ctx.projectId ? ['--project', ctx.projectId] : []

  switch (scope) {
    case 'exec':
      return {
        label: `specdojo exec build${ctx.projectId ? ` --project ${ctx.projectId}` : ''}`,
        subArgs: ['exec', 'build', ...projectArgs],
      }
    case 'catalog':
      return {
        label: `specdojo catalog build${ctx.projectId ? ` --project ${ctx.projectId}` : ''}`,
        subArgs: ['catalog', 'build', ...projectArgs],
      }
    case 'register':
      return {
        label: `specdojo register build${ctx.projectId ? ` --project ${ctx.projectId}` : ''}`,
        subArgs: ['register', 'build', ...projectArgs],
      }
    case 'index':
      return { label: 'specdojo index build', subArgs: ['index', 'build'] }
  }
}

function runBuild(
  scope: Exclude<WatchScope, 'all'>,
  ctx: WatchContext,
  states: Map<string, ScopeState>
): void {
  const state = states.get(scope)
  if (!state) return
  if (state.running) {
    state.queued = true
    return
  }

  const build = buildCommand(scope, ctx)
  if (!build) return

  state.running = true
  state.queued = false

  log(`running: ${build.label}`)

  const start = Date.now()
  const [cmd, spawnArgs] = selfRunArgs(build.subArgs)
  const child = spawn(cmd, spawnArgs, { stdio: ['ignore', 'pipe', 'pipe'] })

  child.stdout.on('data', (chunk: Buffer) => process.stdout.write(chunk))
  child.stderr.on('data', (chunk: Buffer) => process.stderr.write(chunk))

  child.on('close', code => {
    const elapsed = ((Date.now() - start) / 1000).toFixed(1)
    state.running = false
    if (code === 0) {
      log(`done: ${build.label} (${elapsed}s)`)
    } else {
      logError(`error: ${build.label} exited with code ${code}`)
    }
    if (state.queued) {
      state.queued = false
      runBuild(scope, ctx, states)
    }
  })
}

// ================================
// Debounce Trigger
// ================================

function triggerScope(
  scope: Exclude<WatchScope, 'all'>,
  changedPath: string,
  debounceMs: number,
  ctx: WatchContext,
  states: Map<string, ScopeState>
): void {
  const state = states.get(scope)
  if (!state) return

  log(`change detected: ${changedPath}`)

  if (state.timer !== null) {
    clearTimeout(state.timer)
  }
  state.timer = setTimeout(() => {
    state.timer = null
    runBuild(scope, ctx, states)
  }, debounceMs)
}

// ================================
// Logging
// ================================

function log(msg: string): void {
  process.stdout.write(`[watch] ${msg}\n`)
}

function logError(msg: string): void {
  process.stderr.write(`[watch] ${msg}\n`)
}

// ================================
// Directory Watching
// ================================

function addWatcher(
  dir: string,
  watchers: FSWatcher[],
  onChange: (filename: string, watchedDir: string) => void
): void {
  if (!existsSync(dir)) return
  try {
    const w = fsWatch(dir, (_event, filename) => {
      if (filename) onChange(filename, dir)
    })
    w.on('error', () => {
      // Silently ignore watcher errors (e.g., directory deleted)
    })
    watchers.push(w)
  } catch {
    // Directory may not be watchable; skip it
  }
}

function watchRecursive(
  dir: string,
  watchers: FSWatcher[],
  onChange: (filename: string, watchedDir: string) => void
): void {
  addWatcher(dir, watchers, onChange)

  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue
      if (SKIP_DIRS.has(entry.name) || entry.name.startsWith('.')) continue
      watchRecursive(join(dir, entry.name), watchers, onChange)
    }
  } catch {
    // Unreadable directory; skip
  }
}

// ================================
// Watcher Setup
// ================================

function setupWatchers(
  scope: WatchScope,
  ctx: WatchContext,
  debounceMs: number,
  states: Map<string, ScopeState>,
  watchers: FSWatcher[]
): void {
  const activeScopes: Exclude<WatchScope, 'all'>[] =
    scope === 'all' ? ['exec', 'catalog', 'register', 'index'] : [scope]

  for (const s of activeScopes) {
    switch (s) {
      case 'exec': {
        if (ctx.schedulePath) {
          addWatcher(ctx.schedulePath, watchers, (filename, watchedDir) => {
            if (matchesExec(filename, watchedDir, ctx)) {
              triggerScope('exec', join(watchedDir, filename), debounceMs, ctx, states)
            }
          })
        }
        if (ctx.eventsPath) {
          addWatcher(ctx.eventsPath, watchers, (filename, watchedDir) => {
            if (matchesExec(filename, watchedDir, ctx)) {
              triggerScope('exec', join(watchedDir, filename), debounceMs, ctx, states)
            }
          })
        }
        break
      }
      case 'catalog': {
        if (ctx.catalogPath) {
          addWatcher(ctx.catalogPath, watchers, (filename, watchedDir) => {
            if (matchesCatalog(filename)) {
              triggerScope('catalog', join(watchedDir, filename), debounceMs, ctx, states)
            }
          })
        }
        break
      }
      case 'register': {
        if (ctx.projectRegisterPath) {
          addWatcher(ctx.projectRegisterPath, watchers, (filename, watchedDir) => {
            if (matchesRegister(filename)) {
              triggerScope('register', join(watchedDir, filename), debounceMs, ctx, states)
            }
          })
        }
        break
      }
      case 'index': {
        watchRecursive(ctx.docsRootPath, watchers, (filename, watchedDir) => {
          if (matchesIndex(filename)) {
            triggerScope('index', join(watchedDir, filename), debounceMs, ctx, states)
          }
        })
        break
      }
    }
  }
}

// ================================
// Command Registration
// ================================

export function registerWatchCommand(program: Command): void {
  program
    .command('watch')
    .description('Watch project files and run builds automatically on change')
    .option('--project <id>', 'Project ID (specdojo.config.json)')
    .option(
      '--scope <scope>',
      `Watch scope: ${VALID_SCOPES.join(' | ')}`,
      'all'
    )
    .option('--debounce <ms>', 'Milliseconds to wait before triggering a build', '300')
    .action(opts => {
      const scope = opts.scope as WatchScope
      if (!VALID_SCOPES.includes(scope)) {
        process.stderr.write(
          `[watch] Invalid scope: "${scope}". Must be one of: ${VALID_SCOPES.join(', ')}\n`
        )
        process.exitCode = 1
        return
      }

      const debounceMs = parseInt(opts.debounce, 10)
      if (isNaN(debounceMs) || debounceMs < 0) {
        process.stderr.write(`[watch] Invalid --debounce value: "${opts.debounce}"\n`)
        process.exitCode = 1
        return
      }

      let ctx: WatchContext
      try {
        ctx = resolveWatchContext({ project: opts.project })
      } catch (error) {
        process.stderr.write(
          `[watch] ${error instanceof Error ? error.message : String(error)}\n`
        )
        process.exitCode = 1
        return
      }

      const activeScopes: Exclude<WatchScope, 'all'>[] =
        scope === 'all' ? ['exec', 'catalog', 'register', 'index'] : [scope]

      const states = new Map<string, ScopeState>()
      for (const s of activeScopes) {
        states.set(s, { timer: null, running: false, queued: false })
      }

      const watchers: FSWatcher[] = []
      setupWatchers(scope, ctx, debounceMs, states, watchers)

      const watchedCount = watchers.length
      if (watchedCount === 0) {
        process.stderr.write(
          `[watch] No watchable paths found for scope "${scope}".\n` +
            `Ensure paths are configured in specdojo.config.json.\n`
        )
        process.exitCode = 1
        return
      }

      const projectLabel = ctx.projectId ? ` (project: ${ctx.projectId})` : ''
      log(`started — scope: ${scope}, debounce: ${debounceMs}ms${projectLabel}`)
      log(`watching ${watchedCount} director${watchedCount === 1 ? 'y' : 'ies'}`)

      function cleanup(): void {
        for (const w of watchers) {
          try {
            w.close()
          } catch {
            // Already closed
          }
        }
        for (const state of states.values()) {
          if (state.timer !== null) clearTimeout(state.timer)
        }
        log('stopped')
        process.exit(0)
      }

      process.on('SIGINT', cleanup)
      process.on('SIGTERM', cleanup)
    })
}
