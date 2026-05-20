import { Command } from 'commander'
import { resolve } from 'node:path'
import { loadEnv, specdojoRootDir } from './specdojo-config.js'
import { buildDocIndex, lookupDocIndex } from './doc-index.js'

function printCommandError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error)
  process.stdout.write(message + '\n')
  process.exitCode = 1
}

export function registerIndexCommands(program: Command): void {
  const idx = program.command('index').description('Document ID index commands')

  idx
    .command('build')
    .description('Scan docs and build docs/.specdojo/doc-index.json')
    .option('--root <path>', 'Root directory to scan', 'docs')
    .option('--output <path>', 'Output path', 'docs/.specdojo/doc-index.json')
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
    .option('--index <path>', 'Index file path', 'docs/.specdojo/doc-index.json')
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
}
