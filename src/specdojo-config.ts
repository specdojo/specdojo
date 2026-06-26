import { type Command } from 'commander'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import dotenv from 'dotenv'
import yaml from 'js-yaml'
import type { SchedulerStrategy } from './exec-types.js'

export type SpecDojoRunConfig = {
  exec_defaults?: string
  /** @deprecated Use exec_defaults. */
  agent_config?: string
  worktree_base?: string
}

export type SpecDojoProjectConfig = {
  /**
   * Optional repo-root-relative prefix shared by every project document path below
   * (catalog/schedule/execution/members/reviews/roles/viewpoints/project_register). When set, those
   * fields are interpreted relative to `base_path`. `run.*` paths are NOT affected and stay
   * repo-root relative. Resolve project paths via the getProject*Path accessors so base_path is
   * applied consistently.
   */
  base_path?: string
  catalog_path?: string
  schedule_path: string
  execution_path: string
  members_path?: string
  reviews_path?: string
  roles_path?: string
  viewpoints_path?: string
  project_register_path?: string
  run?: SpecDojoRunConfig
}

export type ProjectMember = {
  nickname: string
  display_name: string
  email: string | null
  roles: string[]
  type: 'human' | 'agent'
  persona?: string
  focus?: string[]
  capabilities?: string[]               // agent only: tool access (e.g. web_search)
  proficiency?: 'low' | 'normal' | 'high' | 'expert'  // agent only: quality tier
  priority?: number                     // agent only: tiebreaker within same profile (lower = tried first)
  command?: string                      // agent only: shell command executed by exec run
  mode?: 'edit' | 'review'              // agent only: work mode this agent handles (edit or review)
  scheduler_strategy?: SchedulerStrategy
  note?: string
}

export type MemberRoster = {
  version: number
  project_id: string
  members: ProjectMember[]
}

export type SpecDojoConfig = {
  version: 1
  current_project?: string
  projects: Record<string, SpecDojoProjectConfig>
}

export type ConfigLoadResult = {
  configPath: string
  config: SpecDojoConfig | null
}

function findUpward(startDir: string, name: string): string | null {
  let currentDir = resolve(startDir)

  while (true) {
    const candidate = resolve(currentDir, name)
    if (existsSync(candidate)) return candidate

    const parentDir = resolve(currentDir, '..')
    if (parentDir === currentDir) return null
    currentDir = parentDir
  }
}

export function specdojoRootDir(): string {
  const configPath = findUpward(process.cwd(), join('.specdojo', 'specdojo.config.json'))
  if (configPath) return dirname(dirname(configPath))

  const gitMarker = findUpward(process.cwd(), '.git')
  if (gitMarker) return dirname(gitMarker)

  return process.cwd()
}

export function loadEnv(): void {
  // Load .env from the repository root if present.
  // Safe if missing.
  dotenv.config({ path: resolve(specdojoRootDir(), '.env'), quiet: true })
}

export function defaultConfigPath(): string {
  return join(specdojoRootDir(), '.specdojo', 'specdojo.config.json')
}

// Join a project document path with the project's base_path, returning a repo-root-relative path.
// An empty/undefined base_path leaves the path unchanged (full backward compatibility).
function withBasePath(project: SpecDojoProjectConfig, relPath: string): string {
  const base = project.base_path?.trim()
  const rel = relPath.trim()
  return base ? join(base, rel) : rel
}

function withOptionalBasePath(
  project: SpecDojoProjectConfig,
  relPath: string | undefined
): string | undefined {
  if (!relPath || !relPath.trim()) return undefined
  return withBasePath(project, relPath)
}

export function getProjectSchedulePath(project: SpecDojoProjectConfig): string {
  return withBasePath(project, project.schedule_path)
}

export function getProjectExecutionPath(project: SpecDojoProjectConfig): string {
  return withBasePath(project, project.execution_path)
}

export function getProjectMembersPath(project: SpecDojoProjectConfig): string | undefined {
  return withOptionalBasePath(project, project.members_path)
}

export function getProjectCatalogPath(project: SpecDojoProjectConfig): string | undefined {
  return withOptionalBasePath(project, project.catalog_path)
}

export function getProjectReviewsPath(project: SpecDojoProjectConfig): string | undefined {
  return withOptionalBasePath(project, project.reviews_path)
}

export function getProjectRolesPath(project: SpecDojoProjectConfig): string | undefined {
  return withOptionalBasePath(project, project.roles_path)
}

export function getProjectViewpointsPath(project: SpecDojoProjectConfig): string | undefined {
  return withOptionalBasePath(project, project.viewpoints_path)
}

export function getProjectRegisterPath(project: SpecDojoProjectConfig): string | undefined {
  return withOptionalBasePath(project, project.project_register_path)
}

export function loadMemberRoster(
  baseDir: string,
  project: SpecDojoProjectConfig
): MemberRoster | null {
  const membersPath = getProjectMembersPath(project)
  if (!membersPath) return null

  const fullPath = resolve(baseDir, membersPath)
  if (!existsSync(fullPath)) {
    throw new Error(`members_path not found: ${fullPath}`)
  }

  const raw = readFileSync(fullPath, 'utf8')
  const parsed = yaml.load(raw) as MemberRoster
  if (!parsed || !Array.isArray(parsed.members)) {
    throw new Error(`Invalid members file: ${fullPath} (expected { members: [...] })`)
  }

  return parsed
}

export function assertValidActor(actor: string, roster: MemberRoster | null): void {
  if (!roster) return
  const known = roster.members.map(m => m.nickname)
  if (!known.includes(actor)) {
    throw new Error(
      `Unknown actor: "${actor}". Must be one of: ${known.join(', ')}\n` +
        `Register the nickname in members_path file before use.`
    )
  }
}

function isValidProjectConfig(project: unknown): project is SpecDojoProjectConfig {
  if (!project || typeof project !== 'object' || Array.isArray(project)) return false

  const candidate = project as { schedule_path?: unknown; execution_path?: unknown }
  if (typeof candidate.schedule_path !== 'string' || candidate.schedule_path.trim().length === 0) {
    return false
  }
  if (
    typeof candidate.execution_path !== 'string' ||
    candidate.execution_path.trim().length === 0
  ) {
    return false
  }
  return true
}

export function loadConfig(): ConfigLoadResult {
  loadEnv()

  const configPath = defaultConfigPath()
  if (!existsSync(configPath)) {
    return { configPath, config: null }
  }

  const raw = readFileSync(configPath, 'utf8')
  const parsed = JSON.parse(raw) as SpecDojoConfig

  if (!parsed || parsed.version !== 1 || typeof parsed.projects !== 'object') {
    throw new Error(`Invalid .specdojo/specdojo.config.json: expected { version: 1, projects: { ... } }`)
  }

  for (const [projectId, project] of Object.entries(parsed.projects)) {
    if (!isValidProjectConfig(project)) {
      throw new Error(
        `Invalid .specdojo/specdojo.config.json: projects.${projectId} must be { schedule_path, execution_path }`
      )
    }
  }

  return { configPath, config: parsed }
}

export function writeConfig(config: SpecDojoConfig): void {
  const configPath = defaultConfigPath()
  writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf8')
}

export function registerConfigCommands(program: Command): void {
  const cfg = program.command('config').description('Config helpers (.specdojo/specdojo.config.json)')

  cfg
    .command('init')
    .description('Create .specdojo/specdojo.config.json template (does not overwrite existing)')
    .action(() => {
      const { configPath, config } = loadConfig()
      if (config) {
        process.stdout.write(`Already exists: ${configPath}\n`)
        return
      }
      const template: SpecDojoConfig = {
        version: 1,
        projects: {
          'shj-0001': {
            schedule_path: 'docs/ja/projects/prj-0001/060-schedule',
            execution_path: 'docs/ja/projects/prj-0001/070-execution',
          },
        },
      }
      writeConfig(template)
      process.stdout.write(`Created: ${configPath}\n`)
    })
}

export function registerProjectCommands(program: Command): void {
  const pj = program.command('project').description('Project registry commands')

  pj.command('list')
    .description('List projects from .specdojo/specdojo.config.json')
    .action(() => {
      const { configPath, config } = loadConfig()
      if (!config) {
        process.stdout.write(`No config found: ${configPath}\n`)
        process.stdout.write(`Run: specdojo config init\n`)
        process.exitCode = 1
        return
      }

      const entries = Object.entries(config.projects).sort((a, b) => a[0].localeCompare(b[0]))
      if (entries.length === 0) {
        process.stdout.write(`No projects in ${configPath}\n`)
        return
      }

      for (const [id, project] of entries) {
        const schedulePath = getProjectSchedulePath(project)
        const executionPath = getProjectExecutionPath(project)
        const suffix = executionPath ? `\t${executionPath}` : ''
        process.stdout.write(`${id}\t${schedulePath}${suffix}\n`)
      }
    })
}
