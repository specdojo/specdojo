import { type Command } from "commander";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  getProjectCatalogPath,
  getProjectTimelinePath,
  loadConfig,
  loadEnv,
  specdojoRootDir,
} from "./specdojo-config.js";
import {
  buildTimeline,
  renderCatalogScaffoldMarkdown,
  renderTimelineOrderMarkdown,
  type TimelineBuildResult,
} from "./timeline-build.js";

function resolveTimelinePaths(opts: { project?: string }): {
  timelinePath: string;
  catalogPath: string | null;
} {
  loadEnv();
  const { config, configPath } = loadConfig();
  const baseDir = specdojoRootDir();

  const projectId =
    opts.project?.trim() ||
    process.env.SPECDOJO_PROJECT?.trim() ||
    (config ? Object.keys(config.projects)[0] : "");

  if (!config) {
    throw new Error(`timeline commands require specdojo.config.json.\nRun: specdojo config init`);
  }
  if (!projectId) {
    throw new Error(`No project specified. Use --project <id> or SPECDOJO_PROJECT.`);
  }

  const project = config.projects[projectId];
  if (!project) {
    throw new Error(`Unknown project: ${projectId} (check ${configPath})`);
  }

  const catalogPath = getProjectCatalogPath(project);

  return {
    timelinePath: resolve(baseDir, getProjectTimelinePath(project)),
    catalogPath: catalogPath ? resolve(baseDir, catalogPath) : null,
  };
}

function printCommandError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  process.stdout.write(message + "\n");
  process.exitCode = 1;
}

function addProjectOption(cmd: Command): Command {
  return cmd.option("--project <projectId>", "Project id in specdojo.config.json");
}

function buildTimelineJson(result: TimelineBuildResult): string {
  return (
    JSON.stringify(
      {
        project_id: result.projectId,
        schedule_ready_tracks: result.scheduleReadyTracks,
        waves: result.waves.map((wave) => ({
          wave: wave.wave,
          tracks: wave.tracks.map((track) => track.track),
        })),
        catalog_scaffold_targets: result.scaffolds.map((scaffold) => ({
          track: scaffold.track,
          domain: scaffold.domain,
        })),
      },
      null,
      2,
    ) + "\n"
  );
}

export function registerTimelineCommands(program: Command): void {
  const tml = program.command("timeline").description("Timeline build commands");

  const wcmd = tml.command("where").description("Print resolved timeline paths");
  addProjectOption(wcmd);
  wcmd.action((opts) => {
    try {
      const { timelinePath, catalogPath } = resolveTimelinePaths(opts);
      process.stdout.write(`timeline-path: ${timelinePath}\n`);
      process.stdout.write(`catalog-path: ${catalogPath ?? "(not configured)"}\n`);

      const indexFile = join(timelinePath, "tml-index.yaml");
      process.stdout.write(
        `tml-index: ${indexFile}${existsSync(indexFile) ? "" : " (does not exist)"}\n`,
      );
    } catch (error) {
      printCommandError(error);
    }
  });

  const bcmd = tml
    .command("build")
    .description("Derive track start order and catalog scaffold targets from tml-index.yaml");
  addProjectOption(bcmd);
  bcmd.option("--dry-run", "Print generated content to stdout without writing", false);
  bcmd.action((opts) => {
    try {
      const { timelinePath, catalogPath } = resolveTimelinePaths(opts);
      const result = buildTimeline({ timelinePath, catalogPath });

      for (const warning of result.warnings) process.stdout.write(`WARN: ${warning}\n`);
      for (const error of result.errors) process.stdout.write(`ERROR: ${error}\n`);
      if (result.errors.length > 0) {
        process.exitCode = 1;
        return;
      }

      const outputs = [
        { name: "timeline-order.md", content: renderTimelineOrderMarkdown(result) },
        { name: "catalog-scaffold.md", content: renderCatalogScaffoldMarkdown(result) },
        { name: "timeline.json", content: buildTimelineJson(result) },
      ];

      if (opts.dryRun) {
        for (const output of outputs) {
          process.stdout.write(`\n# --- (dry-run) ${output.name} ---\n`);
          process.stdout.write(output.content);
        }
        return;
      }

      const genDir = join(timelinePath, "generated");
      mkdirSync(genDir, { recursive: true });
      for (const output of outputs) {
        writeFileSync(join(genDir, output.name), output.content, "utf8");
      }

      process.stdout.write(
        `Generated: ${genDir} (${result.waves.length} waves, ` +
          `${result.scaffolds.length} catalog scaffold targets)\n`,
      );
    } catch (error) {
      printCommandError(error);
    }
  });
}
