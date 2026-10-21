import { join } from "node:path";
import { type Command } from "commander";
import { discoverGradeTargets } from "./target-discovery.js";
import { writeGradePlans } from "./plan.js";
import {
  loadViewpoints,
  repoRelativePath,
  resolveDeliverableDoneCriteria,
  resolveProject,
} from "./targets.js";
import { getProjectExecutionPath } from "../shared/specdojo-config.js";
import {
  addGradeSelectionOptions as addSelection,
  commandError,
  requireTarget,
} from "./command-shared.js";

export function registerGradePlanCommands(grade: Command): void {
  addSelection(
    grade.command("list").description("Print selected document paths without writing grade plans"),
  ).action((options) => {
    try {
      const paths = discoverGradeTargets({
        target: requireTarget(options.target),
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
      for (const path of paths) process.stdout.write(`${repoRelativePath(path)}\n`);
    } catch (error) {
      commandError(error);
    }
  });

  addSelection(
    grade
      .command("plan")
      .description("Write reusable executor and reporter plans per selected document"),
  )
    .option("--out <directory>", "Write plans below this repository-relative directory")
    .option("--reference <path>", "Use this document as the comparison reference")
    .option(
      "--embed-documents",
      "Embed the target and reference documents in the executor plan",
      false,
    )
    .option(
      "--random-reference",
      "Select a comparison reference at random from ready documents",
      false,
    )
    .action((options) => {
      try {
        const target = requireTarget(options.target);
        const viewpoints = loadViewpoints(options.project);
        const { id: projectId, project } = resolveProject(options.project);
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
        if (options.reference && options.randomReference) {
          throw new Error("--reference and --random-reference cannot be combined");
        }
        // 比較リファレンスは既定で付けない。効果が未実証であり、付けると executor の
        // 読み込み対象が増えるためである。利用する場合は明示的に指定する。
        const referenceExampleCandidates = options.randomReference
          ? discoverGradeTargets({ target, project: options.project, changedOnly: false })
          : [];
        const outputDirectory =
          options.out ??
          join(getProjectExecutionPath(project), "grade", "generated", "plans", target);
        const plans = writeGradePlans({
          target,
          paths,
          referenceExampleCandidates,
          referenceExampleOverride: options.reference,
          viewpoints,
          projectId,
          outputDirectory,
          embedDocuments: options.embedDocuments,
          doneCriteriaByPath:
            target === "deliverable"
              ? resolveDeliverableDoneCriteria(paths, options.project)
              : undefined,
        });
        for (const plan of plans) {
          // 無作為選定を求めたのに同種別の ready が無い場合は、種別を跨いで代用せず
          // リファレンスなしで続行する。種別が違うと記載水準の基準として誤りを招く。
          // 気づかないまま基準なしで評価し続けることを避けるため警告する。
          if (options.randomReference && !plan.referenceExample) {
            process.stderr.write(
              `warning: no ready reference of the same kind for ${plan.target}; grading without a reference\n`,
            );
          }
          if (options.embedDocuments && !plan.documentsEmbedded) {
            process.stderr.write(
              `warning: embedded documents for ${plan.target} would use ${plan.embeddingCharacterCount} characters and exceed the ${plan.embeddingCharacterLimit} character limit; falling back to path references\n`,
            );
          }
          process.stdout.write(`${plan.changed ? "written" : "unchanged"}: ${plan.path}\n`);
          process.stdout.write(
            `${plan.reporterChanged ? "written" : "unchanged"}: ${plan.reporterPath}\n`,
          );
        }
        process.stdout.write(`Planned: ${plans.length} document(s)\n`);
      } catch (error) {
        commandError(error);
      }
    });
}
