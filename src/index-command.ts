import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { type Command } from 'commander'
import { resolve } from 'node:path'
import { loadEnv, specdojoRootDir } from './specdojo-config.js'
import {
  buildDocIndex,
  lookupDocIndex,
  replaceDocIndexRefs,
  type DocIndexMissingMode,
  type DocIndexReplaceFormat,
} from './doc-index.js'

function printCommandError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error)
  process.stdout.write(message + '\n')
  process.exitCode = 1
}

export function registerIndexCommands(program: Command): void {
  const idx = program.command('index').description('Document ID index commands')

  idx
    .command('build')
    .description('Scan docs and build .specdojo/doc-index.json')
    .option('--root <path>', 'Root directory to scan', 'docs')
    .option('--output <path>', 'Output path', '.specdojo/doc-index.json')
    .action(opts => {
      try {
        loadEnv()
        const repoRoot = specdojoRootDir()
        const rootDir = resolve(repoRoot, opts.root as string)
        const outputPath = resolve(repoRoot, opts.output as string)
        const { count } = buildDocIndex(rootDir, outputPath, repoRoot)
        process.stdout.write(`Built index: ${count} entries → ${opts.output}\n`)
      } catch (error) {
        printCommandError(error)
      }
    })

  idx
    .command('lookup <id>')
    .description('Look up a document path by ID')
    .option('--index <path>', 'Index file path', '.specdojo/doc-index.json')
    .action((id: string, opts) => {
      try {
        loadEnv()
        const indexPath = resolve(specdojoRootDir(), opts.index as string)
        const path = lookupDocIndex(id, indexPath)
        if (path) {
          process.stdout.write(path + '\n')
        } else {
          process.stdout.write(`ID not found: ${id}\n`)
          process.exitCode = 1
        }
      } catch (error) {
        printCommandError(error)
      }
    })

  idx
    .command('replace <file>')
    .description('Replace [[id]] references using .specdojo/doc-index.json')
    .option('--index <path>', 'Index file path', '.specdojo/doc-index.json')
    .option('--build', 'Rebuild the index before replacing references', false)
    .option('--root <path>', 'Root directory to scan when using --build', 'docs')
    .option('--format <type>', 'Replacement format: markdown|path', 'markdown')
    .option('--missing <mode>', 'Missing ID handling: keep|marker', 'keep')
    .option('--write', 'Rewrite the input file instead of printing to stdout', false)
    .action((file: string, opts) => {
      try {
        loadEnv()
        const repoRoot = specdojoRootDir()
        const format = opts.format as DocIndexReplaceFormat
        const missing = opts.missing as DocIndexMissingMode
        if (format !== 'markdown' && format !== 'path') {
          throw new Error('--format must be "markdown" or "path"')
        }
        if (missing !== 'keep' && missing !== 'marker') {
          throw new Error('--missing must be "keep" or "marker"')
        }

        const filePath = resolve(repoRoot, file)
        if (!existsSync(filePath)) throw new Error(`File not found: ${file}`)

        const indexPath = resolve(repoRoot, opts.index as string)
        if (opts.build) {
          const rootDir = resolve(repoRoot, opts.root as string)
          const { count } = buildDocIndex(rootDir, indexPath, repoRoot)
          process.stderr.write(`Built index: ${count} entries → ${opts.index}\n`)
        }

        const input = readFileSync(filePath, 'utf8')
        const result = replaceDocIndexRefs(input, indexPath, { format, missing })

        if (result.missingIds.length > 0) {
          process.stderr.write(
            `Unresolved ID reference(s): ${result.missingIds.join(', ')}\n`
          )
        }

        if (opts.write) {
          writeFileSync(filePath, result.content, 'utf8')
        } else {
          process.stdout.write(result.content)
        }
      } catch (error) {
        printCommandError(error)
      }
    })
}
