import type { Command } from "commander";
import { loadConfig, loadEnv, specdojoRootDir } from "../shared/specdojo-config.js";
import { formatMoveCheckReport, moveCheckHasBlockers, runMoveCheck } from "./move-check.js";

type ProjectMoveOptions = {
  check?: boolean;
  json?: boolean;
};

/**
 * `specdojo project move <project-id> --check` lists what must be cleaned up or carried over
 * before a project is moved to another repository. Only the read-only check exists; the move
 * itself is not automated yet, so `--check` is required.
 */
export function registerProjectMoveCommand(projectCommand: Command): void {
  projectCommand
    .command("move")
    .description(
      "Check, without changing anything, whether a project can move to another repository",
    )
    .argument("<project-id>", "Project id in .specdojo/specdojo.config.json")
    .option("--check", "Run the read-only check (required; the move itself is not automated)")
    .option("--json", "Print the report as JSON")
    .action((projectId: string, options: ProjectMoveOptions) => {
      if (!options.check) {
        process.stderr.write(
          "specdojo project move only supports --check; move the project by hand after the check passes\n",
        );
        process.exitCode = 1;
        return;
      }
      loadEnv();
      const rootDir = specdojoRootDir();
      const { config, configPath } = loadConfig(rootDir);
      if (!config) {
        process.stderr.write(`No config found: ${configPath}\n`);
        process.exitCode = 1;
        return;
      }
      const project = config.projects[projectId];
      if (!project) {
        process.stderr.write(`Unknown project: ${projectId} (check ${configPath})\n`);
        process.exitCode = 1;
        return;
      }
      const report = runMoveCheck({ rootDir, config, projectId, project });
      process.stdout.write(
        options.json ? `${JSON.stringify(report, null, 2)}\n` : formatMoveCheckReport(report),
      );
      if (moveCheckHasBlockers(report)) process.exitCode = 1;
    });
}
