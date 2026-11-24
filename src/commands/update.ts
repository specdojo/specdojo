import { createInterface } from "node:readline/promises";
import type { Command } from "commander";
import { specdojoRootDir } from "../shared/specdojo-config.js";
import { runUpdate } from "../update/run.js";
import {
  materializePackage,
  readTarballVersion,
  resolveRegistryVersion,
  runCommand,
} from "../update/system.js";

interface UpdateCommandOptions {
  to?: string;
  dryRun?: boolean;
  interactive?: boolean;
}

export function registerUpdateCommand(program: Command): void {
  program
    .command("update")
    .description(
      "Update specdojo: compare versions, show the CHANGELOG, update with the package manager, and review distributed files",
    )
    .option("--to <spec>", "Version, range, tag, or tarball path to update to (default: latest)")
    .option("--dry-run", "Show what would be done without changing any file", false)
    .option("--no-interactive", "List distributed files to update without asking or rewriting")
    .action(async (opts: UpdateCommandOptions) => {
      const isInteractiveTerminal = !!process.stdin.isTTY;
      const readline =
        isInteractiveTerminal && opts.interactive !== false && !opts.dryRun
          ? createInterface({ input: process.stdin, output: process.stdout })
          : undefined;
      try {
        await runUpdate(
          {
            repoRoot: specdojoRootDir(),
            to: opts.to,
            dryRun: !!opts.dryRun,
            interactive: opts.interactive !== false,
            cwd: process.cwd(),
          },
          {
            write: (text) => process.stdout.write(text),
            resolveRegistryVersion,
            readTarballVersion,
            materializePackage,
            runCommand,
            ask: (question) => (readline ? readline.question(question) : Promise.resolve("")),
            isInteractiveTerminal: readline !== undefined,
          },
        );
      } catch (error) {
        process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
        process.exitCode = 1;
      } finally {
        readline?.close();
      }
    });
}
