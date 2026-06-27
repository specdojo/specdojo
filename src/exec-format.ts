import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { specdojoRootDir } from './specdojo-config.js'

const require = createRequire(import.meta.url)

function prettierCommand(): { command: string; argsPrefix: string[] } {
  try {
    return {
      command: process.execPath,
      argsPrefix: [require.resolve('prettier/bin/prettier.cjs')],
    }
  } catch {
    return { command: 'prettier', argsPrefix: [] }
  }
}

export function formatMarkdownFile(path: string): void {
  const { command, argsPrefix } = prettierCommand()
  try {
    execFileSync(command, [...argsPrefix, '--write', path], {
      cwd: specdojoRootDir(),
      stdio: 'ignore',
    })
  } catch (error) {
    const cause = error instanceof Error ? `: ${error.message}` : ''
    throw new Error(`Failed to format Markdown with Prettier: ${path}${cause}`)
  }
}
