import { Command } from 'commander'
import { dirname, join, resolve } from 'node:path'
import { existsSync, readdirSync, writeFileSync } from 'node:fs'
import yaml from 'js-yaml'
import { loadConfig, loadEnv } from './specdojo-config.js'
import { generateScheduleTrack } from './schedule-generate.js'

function resolveSchedulePath(opts: { project?: string }): { schedulePath: string; baseDir: string } {
  loadEnv()
  const { config, configPath } = loadConfig()
  const baseDir = dirname(configPath)

  const projectId =
    opts.project?.trim() ||
    process.env.SPECDOJO_PROJECT?.trim() ||
    (config ? Object.keys(config.projects)[0] : '')

  if (!config) {
    throw new Error(`schedule commands require specdojo.config.json.\nRun: specdojo config init`)
  }
  if (!projectId) {
    throw new Error(`No project specified. Use --project <id> or SPECDOJO_PROJECT.`)
  }

  const project = config.projects[projectId]
  if (!project) {
    throw new Error(`Unknown project: ${projectId} (check ${configPath})`)
  }

  const rawPath = project.schedule_path
  if (!rawPath?.trim()) {
    throw new Error(`schedule_path not set for project '${projectId}' in ${configPath}.`)
  }

  return { schedulePath: resolve(baseDir, rawPath.trim()), baseDir }
}

function printCommandError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error)
  process.stdout.write(message + '\n')
  process.exitCode = 1
}

function addProjectOption(cmd: Command): Command {
  return cmd.option('--project <projectId>', 'Project id in specdojo.config.json')
}

export function registerScheduleCommands(program: Command): void {
  const sch = program.command('schedule').description('Schedule generation commands')

  // --- where ---
  const wcmd = sch.command('where').description('Print resolved schedule paths and file list')
  addProjectOption(wcmd)
  wcmd.action(opts => {
    try {
      const { schedulePath } = resolveSchedulePath(opts)
      process.stdout.write(`schedule-path: ${schedulePath}\n`)

      if (!existsSync(schedulePath)) {
        process.stdout.write(`(path does not exist)\n`)
        return
      }

      const files = readdirSync(schedulePath)
        .filter(f => /^sch-.+\.yaml$/.test(f))
        .sort()
      const strategyFiles = files.filter(f => f.startsWith('sch-strategy-'))
      const trackFiles = files.filter(f => f.startsWith('sch-track-'))

      process.stdout.write(`strategy-files:\n`)
      if (strategyFiles.length === 0) {
        process.stdout.write(`  (none)\n`)
      } else {
        for (const f of strategyFiles) process.stdout.write(`  - ${f}\n`)
      }

      process.stdout.write(`track-files:\n`)
      if (trackFiles.length === 0) {
        process.stdout.write(`  (none)\n`)
      } else {
        for (const f of trackFiles) process.stdout.write(`  - ${f}\n`)
      }
    } catch (error) {
      printCommandError(error)
    }
  })

  // --- generate ---
  const gcmd = sch
    .command('generate')
    .description('Generate sch-track-<track>.yaml from sch-strategy-<track>.yaml and catalogs')
  addProjectOption(gcmd)
  gcmd.requiredOption('--track <track>', 'Track name (e.g. launch)')
  gcmd.option('--force', 'Overwrite existing sch-track-<track>.yaml', false)
  gcmd.option('--dry-run', 'Print generated YAML to stdout without writing', false)
  gcmd.action(opts => {
    try {
      const { schedulePath, baseDir } = resolveSchedulePath(opts)
      const track = opts.track.trim()

      const strategyFile = join(schedulePath, `sch-strategy-${track}.yaml`)
      if (!existsSync(strategyFile)) {
        throw new Error(`Strategy file not found: ${strategyFile}`)
      }

      const outFile = join(schedulePath, `sch-track-${track}.yaml`)
      if (existsSync(outFile) && !opts.force && !opts.dryRun) {
        throw new Error(
          `${outFile} already exists. Use --force to overwrite or --dry-run to preview.`
        )
      }

      const { projectId, tasks, errors, warnings } = generateScheduleTrack(strategyFile, baseDir)

      for (const w of warnings) process.stdout.write(`WARN: ${w}\n`)
      for (const e of errors) process.stdout.write(`ERROR: ${e}\n`)

      if (errors.length > 0) {
        process.exitCode = 1
        return
      }

      const outDoc = {
        kind: 'track',
        version: 1,
        project_id: projectId,
        track,
        settings: {},
        tasks,
      }

      const outYaml = yaml.dump(outDoc, {
        lineWidth: 120,
        quotingType: '"' as const,
        forceQuotes: false,
        noRefs: true,
      })

      if (opts.dryRun) {
        process.stdout.write(outYaml)
        process.stdout.write(`\n# dry-run: ${tasks.length} tasks — not written to disk\n`)
        return
      }

      writeFileSync(outFile, outYaml, 'utf8')
      process.stdout.write(`Generated: ${outFile} (${tasks.length} tasks)\n`)
    } catch (error) {
      printCommandError(error)
    }
  })
}
