import { type Command } from "commander";
import {
  addGradeSelectionOptions as addSelection,
  commandError,
  collectPathOption,
  requirePipelineStatus,
  requirePositiveInteger,
  requireTarget,
} from "./grade-command-shared.js";
import { discoverGradeTargets } from "./grade-target-discovery.js";
import {
  listExhaustedGradePipelineStates,
  readGradePipelineState,
  recordGradePipelineStage,
} from "./grade-pipeline-state.js";
import { migrateInlineGrades, validateGradeResultForDocument } from "./grade-markdown.js";
import { readGradeResultForDocument } from "./grade-result.js";
import { repoRelativePath, resolveSafeMarkdownPath } from "./grade-targets.js";

export function registerGradeInspectionCommands(grade: Command): void {
  addSelection(
    grade.command("validate").description("Validate stored grade hashes and finding counts"),
  ).action((options) => {
    try {
      const target = requireTarget(options.target);
      const paths = discoverGradeTargets({
        target,
        project: options.project,
        paths: options.path,
        changedOnly: options.changedOnly,
        dependencyChanged: options.dependencyChanged,
        rulebookChanged: options.rulebookChanged,
        unreviewed: options.unreviewed,
        verdict: options.verdict,
        minScore: options.minScore,
        maxFindings: options.maxFindings,
        ungraded: options.ungraded,
        incomplete: options.incomplete,
        rubricOutdated: options.rubricOutdated,
      });
      const errors = paths.flatMap((path) =>
        validateGradeResultForDocument({ path, target, project: options.project }),
      );
      for (const error of errors) process.stderr.write(`ERROR: ${error}\n`);
      process.stdout.write(`Validated: ${paths.length} document(s), ${errors.length} error(s)\n`);
      if (errors.length > 0) process.exitCode = 1;
    } catch (error) {
      commandError(error);
    }
  });

  grade
    .command("result")
    .description("Print the stored grade result sidecar for one document as JSON")
    .requiredOption("--path <path>", "Markdown document whose grade result is read")
    .option("--project <projectId>", "Project id in specdojo.config.json")
    .action((options) => {
      try {
        const absolute = resolveSafeMarkdownPath(options.path);
        const rel = repoRelativePath(absolute);
        const result = readGradeResultForDocument({ documentPath: rel, project: options.project });
        if (result) process.stdout.write(`${JSON.stringify(result)}\n`);
      } catch (error) {
        commandError(error);
      }
    });

  grade
    .command("state")
    .description("Read or update persistent per-document grade pipeline state")
    .requiredOption("--target <target>", "kata or deliverable")
    .option("--project <projectId>", "Project id in specdojo.config.json")
    .option("--path <path>", "Markdown document whose pipeline state is read or updated")
    .option("--status <status>", "Record passed, failed, or complete", requirePipelineStatus)
    .option("--stage <number>", "Current pipeline stage", requirePositiveInteger)
    .option("--stage-total <number>", "Total pipeline stages", requirePositiveInteger, 3)
    .option(
      "--max-failures <number>",
      "Consecutive failures allowed before reporting only",
      requirePositiveInteger,
      3,
    )
    .option("--run-id <id>", "Job Run id that observed this state")
    .option("--exhausted", "List documents whose consecutive failure limit was reached", false)
    .action((options) => {
      try {
        const target = requireTarget(options.target);
        if (options.exhausted) {
          if (options.path || options.status) {
            throw new Error("--exhausted cannot be combined with --path or --status");
          }
          for (const state of listExhaustedGradePipelineStates({
            target,
            project: options.project,
          })) {
            process.stdout.write(`${state.document}\n`);
          }
          return;
        }
        if (!options.path) throw new Error("--path is required unless --exhausted is used");
        if (options.status) {
          if (!options.runId) throw new Error("--run-id is required with --status");
          if (!options.stage) throw new Error("--stage is required with --status");
          const state = recordGradePipelineStage({
            target,
            project: options.project,
            path: options.path,
            runId: options.runId,
            stage: options.stage,
            stageTotal: options.stageTotal,
            maxFailures: options.maxFailures,
            status: options.status,
          });
          if (state) process.stdout.write(`${JSON.stringify(state)}\n`);
          return;
        }
        const state = readGradePipelineState({
          target,
          project: options.project,
          path: options.path,
        });
        if (state) process.stdout.write(`${JSON.stringify(state)}\n`);
      } catch (error) {
        commandError(error);
      }
    });

  grade
    .command("migrate")
    .description("Move legacy inline grade snapshots and findings to result sidecars")
    .option("--target <target>", "Restrict migration to kata or deliverable", requireTarget)
    .option("--project <projectId>", "Project id in specdojo.config.json")
    .option(
      "--path <path>",
      "Migrate only this Markdown document (repeatable)",
      collectPathOption,
      [],
    )
    .option("--dry-run", "List updates without writing", false)
    .action((options) => {
      try {
        const changed = migrateInlineGrades({
          project: options.project,
          target: options.target,
          paths: options.path,
          dryRun: options.dryRun,
        });
        for (const path of changed) {
          process.stdout.write(`${options.dryRun ? "would update" : "updated"}: ${path}\n`);
        }
        process.stdout.write(`Migrated updates: ${changed.length}\n`);
      } catch (error) {
        commandError(error);
      }
    });
}
