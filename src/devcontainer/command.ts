import type { Command } from "commander";
import { runDevcontainerScaffold } from "./scaffold.js";
import { specdojoPackageRootDir } from "../shared/package-paths.js";
import { specdojoRootDir } from "../shared/specdojo-config.js";

export function registerDevcontainerCommands(program: Command): void {
  const dc = program.command("devcontainer").description("Dev Container helpers");

  dc.command("scaffold")
    .description("Scaffold .devcontainer/ configuration for the repository")
    .option("--preset <name>", "Apply a bundled preset (available: recommended)")
    .option(
      "--provider <names>",
      "Comma-separated list of agent providers to install (e.g. claude,codex,opencode,antigravity)",
      "",
    )
    .option(
      "--editor <names>",
      "Comma-separated list of editors to install and configure (emacs,vim)",
      "",
    )
    .option("--ollama", "Add Ollama connection settings", false)
    .option("--cron", "Add cron support", false)
    .option("--tmux", "Add tmux", false)
    .option("--workspace-name <name>", "Override the workspace parent name used under /workspaces")
    .option("--force", "Overwrite existing .devcontainer/", false)
    .option("--dry-run", "Show planned files without writing", false)
    .action(async (opts) => {
      try {
        await runDevcontainerScaffold({
          packageRoot: specdojoPackageRootDir(),
          repoRoot: specdojoRootDir(),
          workspaceName: opts.workspaceName === undefined ? undefined : String(opts.workspaceName),
          preset: opts.preset === undefined ? undefined : String(opts.preset),
          providers: opts.provider
            ? String(opts.provider)
                .split(",")
                .map((s) => s.trim())
            : [],
          editors: opts.editor
            ? String(opts.editor)
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
