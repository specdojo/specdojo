import { type Command } from 'commander'
import { join, resolve } from 'node:path'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import yaml from 'js-yaml'
import { loadConfig, loadEnv, specdojoRootDir } from './specdojo-config.js'
import {
  buildCatalog,
  collectCatalogLocalIds,
  validateBasedOn,
  validateDctDoc,
} from './catalog-build.js'
import { collectDocIndexEntries } from './doc-index.js'
import { runScaffold, type ProjectSize } from './catalog-scaffold.js'
import type { DctDoc } from './catalog-types.js'

function readSizeFromIndex(catalogPath: string): ProjectSize | null {
  const indexPath = join(catalogPath, 'dct-index.md')
  if (!existsSync(indexPath)) return null
  const content = readFileSync(indexPath, 'utf8')
  const fm = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!fm) return null
  const m = fm[1].match(/^size:\s*(.+)$/m)
  const size = m?.[1]?.trim()
  if (size === 'small' || size === 'medium' || size === 'large') return size
  return null
}

function resolveCatalogPath(opts: { project?: string }): string {
  loadEnv()
  const { config, configPath } = loadConfig()
  const baseDir = specdojoRootDir()

  const projectId =
    opts.project?.trim() ||
    process.env.SPECDOJO_PROJECT?.trim() ||
    (config ? Object.keys(config.projects)[0] : '')

  if (!config) {
    throw new Error(`catalog commands require specdojo.config.json.\nRun: specdojo config init`)
  }

  if (!projectId) {
    throw new Error(`No project specified. Use --project <id> or SPECDOJO_PROJECT.`)
  }

  const project = config.projects[projectId]
  if (!project) {
    throw new Error(`Unknown project: ${projectId} (check ${configPath})`)
  }

  const catalogPath = project.catalog_path
  if (!catalogPath || !catalogPath.trim()) {
    throw new Error(
      `catalog_path not set for project '${projectId}' in ${configPath}.\n` +
        `Add "catalog_path": "<path>" to the project config.`
    )
  }

  return resolve(baseDir, catalogPath.trim())
}

function printCommandError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error)
  process.stdout.write(message + '\n')
  process.exitCode = 1
}

function addProjectOption(cmd: Command): Command {
  return cmd.option('--project <projectId>', 'Project id in specdojo.config.json')
}

export function registerCatalogCommands(program: Command): void {
  const cat = program.command('catalog').description('Deliverables catalog (dct-*.yaml) commands')

  const wcmd = cat.command('where').description('Print resolved catalog paths')
  addProjectOption(wcmd)
  wcmd.action(opts => {
    try {
      const catalogPath = resolveCatalogPath(opts)
      process.stdout.write(`catalog-path: ${catalogPath}\n`)
      process.stdout.write(`generated   : ${join(catalogPath, 'generated')}\n`)
    } catch (error) {
      printCommandError(error)
    }
  })

  const vcmd = cat.command('validate').description('Validate dct-*.yaml files')
  addProjectOption(vcmd)
  vcmd.action(opts => {
    try {
      const catalogPath = resolveCatalogPath(opts)
      const files = readdirSync(catalogPath)
        .filter(f => /^dct-.+\.yaml$/.test(f))
        .sort()

      if (files.length === 0) {
        process.stdout.write(`No dct-*.yaml files found in: ${catalogPath}\n`)
        return
      }

      const knownLocalIds = collectCatalogLocalIds(catalogPath)
      let allOk = true
      for (const f of files) {
        const filePath = `${catalogPath}/${f}`
        try {
          const raw = readFileSync(filePath, 'utf8')
          const doc = yaml.load(raw) as DctDoc
          const result = validateDctDoc(doc, filePath, knownLocalIds)
          for (const err of result.errors) {
            process.stdout.write(`ERROR: ${err}\n`)
          }
          for (const warn of result.warnings) {
            process.stdout.write(`WARN:  ${warn}\n`)
          }
          if (result.ok) {
            process.stdout.write(`OK: ${f}\n`)
          } else {
            allOk = false
          }
        } catch (err) {
          process.stdout.write(
            `ERROR: ${filePath}: ${err instanceof Error ? err.message : String(err)}\n`
          )
          allOk = false
        }
      }

      // Cross-check: same-project based_on must be within the depends_on closure.
      // Build a fresh document-id universe so resolve-or-error does not depend on
      // a possibly-stale .specdojo/doc-index.json.
      const repoRoot = specdojoRootDir()
      const knownIds = new Set(
        Object.keys(collectDocIndexEntries(resolve(repoRoot, 'docs'), repoRoot))
      )
      const basedOnResult = validateBasedOn(catalogPath, repoRoot, knownIds)
      for (const err of basedOnResult.errors) {
        process.stdout.write(`ERROR: ${err}\n`)
      }
      for (const warn of basedOnResult.warnings) {
        process.stdout.write(`WARN:  ${warn}\n`)
      }
      if (!basedOnResult.ok) {
        allOk = false
      }

      process.exitCode = allOk ? 0 : 1
    } catch (error) {
      printCommandError(error)
    }
  })

  const bcmd = cat.command('build').description('Generate dct-*.md from dct-*.yaml')
  addProjectOption(bcmd)
  bcmd.action(opts => {
    try {
      const catalogPath = resolveCatalogPath(opts)
      const { generated, errors } = buildCatalog(catalogPath)

      for (const err of errors) {
        process.stdout.write(`ERROR: ${err}\n`)
      }
      for (const path of generated) {
        process.stdout.write(`Generated: ${path}\n`)
      }

      if (errors.length > 0) {
        process.exitCode = 1
      }
    } catch (error) {
      printCommandError(error)
    }
  })

  const scCmd = cat
    .command('scaffold')
    .description('Create dct-*.yaml from templates (small|medium|large)')
  addProjectOption(scCmd)
  scCmd.option(
    '--size <size>',
    'Project size: small|medium|large (default: read from dct-index.md)'
  )
  scCmd.option(
    '--project-id <projectId>',
    'Project ID to embed (e.g. prj-0001); derived from catalog_path if omitted'
  )
  scCmd.option('--force', 'Overwrite existing files', false)
  scCmd.action(opts => {
    try {
      const catalogPath = resolveCatalogPath(opts)

      const explicitSize = opts.size as string | undefined
      if (explicitSize && !['small', 'medium', 'large'].includes(explicitSize)) {
        throw new Error(`Invalid --size: "${explicitSize}". Must be one of: small|medium|large`)
      }
      const size: ProjectSize =
        (explicitSize as ProjectSize | undefined) ??
        readSizeFromIndex(catalogPath) ??
        (() => {
          throw new Error(
            `--size not specified and dct-index.md has no "size" field.\n` +
              `Use --size <small|medium|large> or add size: to dct-index.md frontmatter.`
          )
        })()

      const templatesPath = resolve(specdojoRootDir(), 'docs/ja/specdojo/templates')
      if (!existsSync(templatesPath)) {
        throw new Error(`Templates directory not found: ${templatesPath}`)
      }

      const { written, skipped, errors } = runScaffold({
        catalogPath,
        templatesPath,
        size,
        projectId: opts.projectId ?? null,
        force: !!opts.force,
      })

      for (const err of errors) {
        process.stdout.write(`ERROR: ${err}\n`)
      }
      for (const p of written) {
        process.stdout.write(`Created: ${p}\n`)
      }
      for (const p of skipped) {
        process.stdout.write(`Skipped (already exists; use --force to overwrite): ${p}\n`)
      }

      if (errors.length > 0) process.exitCode = 1
    } catch (error) {
      printCommandError(error)
    }
  })
}
