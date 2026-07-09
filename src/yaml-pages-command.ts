import { type Command } from "commander";
import { resolve } from "node:path";
import { loadEnv, specdojoRootDir } from "./specdojo-config.js";
import { buildYamlPages } from "./yaml-pages.js";

function printCommandError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  process.stdout.write(message + "\n");
  process.exitCode = 1;
}

export function registerYamlPagesCommands(program: Command): void {
  const cmd = program.command("yaml-pages").description("YAML display page commands");

  cmd
    .command("build")
    .description("Generate generated/<name>.md display pages for indexed YAML files")
    .option("--root <path>", "Root directory to scan", "docs")
    .action((opts) => {
      try {
        loadEnv();
        const repoRoot = specdojoRootDir();
        const rootDir = resolve(repoRoot, opts.root as string);
        const result = buildYamlPages(rootDir, repoRoot);
        process.stdout.write(
          `Generated YAML pages: ${result.written.length} written, ` +
            `${result.unchanged.length} unchanged, ${result.skippedForeign.length} skipped\n`,
        );
      } catch (error) {
        printCommandError(error);
      }
    });
}
