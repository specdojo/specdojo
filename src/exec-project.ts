import { join, resolve } from 'node:path'
import {
  getProjectExecutionPath,
  getProjectSchedulePath,
  loadConfig,
  loadEnv,
  specdojoRootDir,
} from './specdojo-config.js'
import { type ResolvedProjectPaths } from './exec-types.js'

function projectBaseDir(): string {
  return specdojoRootDir()
}

function resolveProjectRelative(baseDir: string, pathValue: string): string {
  return resolve(baseDir, pathValue.trim())
}

export function activateResolvedProjectPaths(paths: ResolvedProjectPaths): void {
  process.env.SPECDOJO_SCHEDULE_PATH = paths.schedulePath
  process.env.SPECDOJO_EXECUTION_PATH = paths.executionPath
}

export function executionRootForProject(projectPath: string): string {
  loadEnv()
  const baseDir = projectBaseDir()

  const envSchedulePath = process.env.SPECDOJO_SCHEDULE_PATH
  const envExecutionPath = process.env.SPECDOJO_EXECUTION_PATH
  if (
    envSchedulePath &&
    envSchedulePath.trim() &&
    envExecutionPath &&
    envExecutionPath.trim() &&
    resolveProjectRelative(baseDir, envSchedulePath) === projectPath
  ) {
    return resolveProjectRelative(baseDir, envExecutionPath)
  }

  const { config } = loadConfig()
  if (config) {
    for (const project of Object.values(config.projects)) {
      const schedulePath = resolveProjectRelative(baseDir, getProjectSchedulePath(project))
      if (schedulePath !== projectPath) continue

      return resolveProjectRelative(baseDir, getProjectExecutionPath(project))
    }
  }

  throw new Error(
    `Execution path not specified for schedule path: ${projectPath}\n` +
      `Provide --project <id>, or SPECDOJO_PROJECT, or SPECDOJO_SCHEDULE_PATH together with SPECDOJO_EXECUTION_PATH.`
  )
}

export function generatedDirForProject(projectPath: string): string {
  return join(executionRootForProject(projectPath), 'generated')
}

export function eventsDirForProject(projectPath: string): string {
  return join(executionRootForProject(projectPath), 'exec', 'events')
}

export function resolveProjectPaths(opts: { project?: string }): ResolvedProjectPaths {
  loadEnv()
  const { config, configPath } = loadConfig()
  const baseDir = specdojoRootDir()

  const envSchedulePath = process.env.SPECDOJO_SCHEDULE_PATH
  const envExecutionPath = process.env.SPECDOJO_EXECUTION_PATH
  const envProject = process.env.SPECDOJO_PROJECT

  function fromProjectId(
    projectId: string,
    source: '--project' | 'SPECDOJO_PROJECT' | 'current_project'
  ): ResolvedProjectPaths {
    if (!config) {
      throw new Error(
        `${source} requires specdojo.config.json: ${configPath}\n` +
          `Define the project id there, or use SPECDOJO_SCHEDULE_PATH/SPECDOJO_EXECUTION_PATH.`
      )
    }
    const project = config.projects[projectId]
    if (!project) {
      throw new Error(`Unknown ${source} value: ${projectId} (check ${configPath})`)
    }
    return {
      schedulePath: resolveProjectRelative(baseDir, getProjectSchedulePath(project)),
      executionPath: resolveProjectRelative(baseDir, getProjectExecutionPath(project)),
      catalogPath: project.catalog_path
        ? resolveProjectRelative(baseDir, project.catalog_path)
        : undefined,
    }
  }

  if (opts.project && opts.project.trim()) {
    return fromProjectId(opts.project.trim(), '--project')
  }

  if (
    (envSchedulePath && envSchedulePath.trim()) ||
    (envExecutionPath && envExecutionPath.trim())
  ) {
    if (
      !envSchedulePath ||
      !envSchedulePath.trim() ||
      !envExecutionPath ||
      !envExecutionPath.trim()
    ) {
      throw new Error(
        `SPECDOJO_SCHEDULE_PATH and SPECDOJO_EXECUTION_PATH must be specified together when using direct environment path overrides.`
      )
    }
    return {
      schedulePath: resolveProjectRelative(baseDir, envSchedulePath),
      executionPath: resolveProjectRelative(baseDir, envExecutionPath),
    }
  }

  if (envProject && envProject.trim()) {
    return fromProjectId(envProject.trim(), 'SPECDOJO_PROJECT')
  }

  if (config?.current_project && config.current_project.trim()) {
    return fromProjectId(config.current_project.trim(), 'current_project')
  }

  const defaultProjectId = config ? Object.keys(config.projects)[0] : ''
  if (defaultProjectId) {
    return fromProjectId(defaultProjectId, 'current_project')
  }

  throw new Error(
    `Project path not specified.\n` +
      `Provide --project <id>, set current_project in specdojo.config.json, or set SPECDOJO_PROJECT.\n` +
      `The value must match a project id in ${configPath}.`
  )
}
