import { Command } from "commander";
import { runDevcontainerScaffold } from "./devcontainer-scaffold.js";
import { specdojoPackageRootDir } from "./package-paths.js";
import { specdojoRootDir } from "./specdojo-config.js";

export function registerDevcontainerCommands(program: Command): void {
  const dc = program.command("devcontainer").description("Dev Container helpers");

  dc.command("scaffold")
    .description("Scaffold .devcontainer/ configuration for the repository")
    .option(
      "--provider <names>",
      "Comma-separated list of agent providers to install (e.g. claude,codex,opencode,antigravity)",
      "",
    )
    .option("--ollama", "Add Ollama connection settings", false)
    .option("--cron", "Add cron support", false)
    .option("--tmux", "Add tmux", false)
    .option("--force", "Overwrite existing .devcontainer/", false)
    .option("--dry-run", "Show planned files without writing", false)
    .action(async (opts) => {
      try {
        await runDevcontainerScaffold({
          packageRoot: specdojoPackageRootDir(),
          repoRoot: specdojoRootDir(),
          providers: opts.provider
            ? String(opts.provider)
                .split(",")
                .map((s) => s.trim())
            : [],
          ollama: !!opts.ollama,
          cron: !!opts.cron,
          tmux: !!opts.tmux,
          force: !!opts.force,
          dryRun: !!opts.dryRun,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        process.stderr.write(`${message}\n`);
        process.exitCode = 1;
      }
    });
}
