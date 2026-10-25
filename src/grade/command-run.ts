import type { Command } from "commander";
import type { GradeAgentRuntime } from "../shared/agent-plan.js";
import {
  addGradeSelectionOptions,
  commandError,
  requirePositiveInteger,
  requireTarget,
} from "./command-shared.js";
import { runGrade } from "./run.js";

export function registerGradeRunCommand(grade: Command, runtime?: GradeAgentRuntime): void {
  addGradeSelectionOptions(
    grade
      .command("run")
      .description(
        "Grade selected documents with the native single-stage pipeline; reuse run-id to resume",
      ),
  )
    .requiredOption("--run-id <id>", "Stable id for persisted selection and completed stages")
    .option("--kind <kind>", "Kata kind: rulebook, recipe, sample, template, all")
    .option("--by <nickname>", "Grading executor (default: roster auto-selection)")
    .option("--stage-1-executor <nickname>", "Alias for --by")
    .option("--stages <count>", "Native pipeline stage count (1)", "1")
    .option("--work-dir <directory>", "Repository-relative run state directory")
    .option("--reference <path>", "Comparison reference document")
    .option("--embed-documents", "Embed target and reference contents", false)
    .option("--max-stage-failures <count>", "Consecutive failure limit", requirePositiveInteger, 3)
    .option("--limit <count>", "Maximum number of documents", requirePositiveInteger)
    .option("--exec-defaults <path>", "Override exec-defaults.yaml")
    .option(
      "--dry-run",
      "Print selection and actual actor without writing or running an agent",
      false,
    )
    .action(async (options) => {
      try {
        if (!runtime) throw new Error("Grade agent runtime is not configured");
        if (options.stages !== "1") throw new Error("grade run supports --stages 1");
        if (options.by && options.stage1Executor)
          throw new Error("Use either --by or --stage-1-executor");
        await runGrade(
          {
            ...options,
            target: requireTarget(options.target),
            paths: options.path,
            by: options.by ?? options.stage1Executor,
            execDefaultsPath: options.execDefaults,
          },
          runtime,
        );
      } catch (error) {
        commandError(error);
      }
    });
}
