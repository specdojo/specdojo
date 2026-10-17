import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { type Command } from "commander";
import { extractJsonArrayText } from "../shared/agent-response.js";
import {
  applyGradeSubmission,
  buildGradeSubmissionFromAnalysis,
  parseGradeSubmission,
  validateGradeReporterFidelity,
} from "./apply.js";
import {
  addGradeSelectionOptions as addSelection,
  commandError,
  requireNonNegativeInteger,
  requireTarget,
} from "./command-shared.js";
import type { GradeSubmission } from "./core.js";
import { discoverGradeTargets } from "./target-discovery.js";
import {
  applyGradeFindingTranslations,
  gradeFindingTranslationInput,
  gradeResultPathForDocument,
  readGradeResult,
  readGradeResultForDocument,
  writeGradeResult,
  type GradeResult,
} from "./result.js";
import {
  loadViewpoints,
  repoRelativePath,
  resolveDeliverableDoneCriteria,
  resolveGradeActor,
  resolveProject,
  resolveSafeRepositoryPath,
} from "./targets.js";
import {
  getProjectExecutionPath,
  loadMemberRoster,
  specdojoRootDir,
} from "../shared/specdojo-config.js";

export function renderGradeFindingTranslationPlan(
  result: GradeResult,
  translationIndex?: number,
): string {
  const messages = gradeFindingTranslationInput(result, translationIndex);
  return [
    "# Grade finding translation",
    "",
    "次の JSON 文字列配列に含まれる英語の finding だけを、簡潔で自然な日本語へ翻訳してください。入力と同じ件数・同じ順序の、訳文だけの JSON 文字列配列を返してください。元の文にあるインラインコード（バッククォートで囲んだ部分）は一字一句変えずに残し、元の文にないインラインコードやバッククォートは追加しないでください。インラインコード以外の英語の語句は、固有名詞・識別子を除いて日本語に訳してください。Markdown fence、説明、番号、token、判定の変更は不要です。",
    "",
    "```json",
    JSON.stringify(messages, null, 2),
    "```",
    "",
  ].join("\n");
}

export function registerGradeApplyCommands(grade: Command): void {
  addSelection(
    grade
      .command("apply")
      .description(
        "Convert executor markers (or validate reporter JSON), calculate scores, and update documents",
      ),
  )
    .option(
      "--from <path>",
      "GradeSubmission JSON produced by an LLM reporter; omit to convert --analysis-from mechanically",
    )
    .requiredOption("--by <nickname>", "Grading agent nickname from agent-members.yaml")
    .option(
      "--analysis-from <path>",
      "Executor analysis converted to GradeSubmission, or used to verify --from fidelity",
    )
    .option(
      "--submission-out <path>",
      "Write the GradeSubmission converted from --analysis-from to this repository path",
    )
    .option(
      "--reference <pathOrId>",
      "Comparison reference used during grading; recorded as a document id",
    )
    .option("--dry-run", "Validate and list updates without writing", false)
    .action((options) => {
      try {
        const target = requireTarget(options.target);
        const viewpoints = loadViewpoints(options.project);
        const { project } = resolveProject(options.project);
        const gradedBy = resolveGradeActor(
          options.by,
          loadMemberRoster(specdojoRootDir(), project),
        );
        if (!options.from && !options.analysisFrom) {
          throw new Error("grade apply requires --analysis-from, --from, or both");
        }
        if (options.submissionOut && (options.from || !options.analysisFrom)) {
          throw new Error("--submission-out requires --analysis-from without --from");
        }
        const selected = new Set(
          discoverGradeTargets({
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
          }).map(repoRelativePath),
        );
        const doneCriteriaByPath =
          target === "deliverable"
            ? resolveDeliverableDoneCriteria([...selected], options.project)
            : undefined;
        let submission: GradeSubmission;
        if (options.analysisFrom) {
          if (selected.size !== 1) {
            throw new Error("--analysis-from requires exactly one selected --path");
          }
          const expectedPath = [...selected][0];
          const executorOutput = readFileSync(
            resolveSafeRepositoryPath(options.analysisFrom, "--analysis-from"),
            "utf8",
          );
          const conversionOptions = {
            executorOutput,
            viewpoints,
            target,
            expectedPath,
            doneCriteria: doneCriteriaByPath?.get(expectedPath),
          };
          if (options.from) {
            // LLM reporter の JSON を executor marker と照合する互換・比較用の経路。
            submission = parseGradeSubmission(
              readFileSync(resolveSafeRepositoryPath(options.from, "--from"), "utf8"),
            );
            const fidelityIssues = validateGradeReporterFidelity({
              ...conversionOptions,
              submission,
            });
            if (fidelityIssues.length > 0) {
              throw new Error(
                fidelityIssues.map((issue) => `${issue.path}: ${issue.message}`).join("\n"),
              );
            }
            const converted = buildGradeSubmissionFromAnalysis(conversionOptions);
            if (converted.submission === undefined) {
              throw new Error(
                converted.issues.map((issue) => `${issue.path}: ${issue.message}`).join("\n"),
              );
            }
            const convertedDocument = converted.submission.documents[0];
            const correctedLevels = new Map(
              convertedDocument.viewpoints.map((viewpoint) => [viewpoint.id, viewpoint.level]),
            );
            submission.documents[0] = {
              ...submission.documents[0],
              viewpoints: submission.documents[0].viewpoints.map((viewpoint) => ({
                ...viewpoint,
                level: correctedLevels.get(viewpoint.id) ?? viewpoint.level,
              })),
              ...(convertedDocument.level_corrections
                ? { level_corrections: convertedDocument.level_corrections }
                : {}),
            };
          } else {
            const converted = buildGradeSubmissionFromAnalysis(conversionOptions);
            if (converted.submission === undefined) {
              throw new Error(
                [
                  "executor analysis rejected; rerun the executor",
                  ...converted.issues.map((issue) => `${issue.path}: ${issue.message}`),
                ].join("\n"),
              );
            }
            submission = converted.submission;
            if (options.submissionOut && !options.dryRun) {
              const submissionOut = resolveSafeRepositoryPath(
                options.submissionOut,
                "--submission-out",
              );
              mkdirSync(dirname(submissionOut), { recursive: true });
              writeFileSync(submissionOut, `${JSON.stringify(submission, null, 2)}\n`, "utf8");
            }
          }
        } else {
          submission = parseGradeSubmission(
            readFileSync(resolveSafeRepositoryPath(options.from, "--from"), "utf8"),
          );
        }
        for (const document of submission.documents)
          if (!selected.has(repoRelativePath(resolve(specdojoRootDir(), document.path))))
            throw new Error(`${document.path}: not selected by the current grade filters`);
        const changed = applyGradeSubmission({
          submission,
          viewpoints,
          target,
          gradedBy,
          reference: options.reference,
          dryRun: options.dryRun,
          doneCriteriaByPath,
          criteriaDirectory: join(getProjectExecutionPath(project), "grade", "criteria"),
          resultsDirectory: join(getProjectExecutionPath(project), "grade", "results"),
          project: options.project,
        });
        for (const path of changed)
          process.stdout.write(`${options.dryRun ? "would update" : "updated"}: ${path}\n`);
        process.stdout.write(
          `Graded: ${submission.documents.length}, updated: ${changed.length}\n`,
        );
      } catch (error) {
        commandError(error);
      }
    });

  addSelection(
    grade
      .command("translation-plan")
      .description("Create a Japanese translation request for the latest canonical findings"),
  )
    .requiredOption("--out <path>", "Write the translation plan to this repository path")
    .option(
      "--translation-index <index>",
      "Translate only this zero-based index from the translatable findings",
      requireNonNegativeInteger,
    )
    .action((options) => {
      try {
        const target = requireTarget(options.target);
        const selected = discoverGradeTargets({
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
        }).map(repoRelativePath);
        if (selected.length !== 1) {
          throw new Error("grade translation-plan requires exactly one selected --path");
        }
        const result = readGradeResultForDocument({
          documentPath: selected[0],
          project: options.project,
        });
        if (!result) throw new Error(`${selected[0]}: grade result not found`);
        if (result.target !== target) {
          throw new Error(
            `${selected[0]}: grade result target=${result.target}, expected=${target}`,
          );
        }
        const output = resolveSafeRepositoryPath(options.out, "--out");
        mkdirSync(dirname(output), { recursive: true });
        const messages = gradeFindingTranslationInput(result, options.translationIndex);
        writeFileSync(
          output,
          renderGradeFindingTranslationPlan(result, options.translationIndex),
          "utf8",
        );
        process.stdout.write(
          `written: ${repoRelativePath(output)}\nTranslations: ${messages.length}\n`,
        );
      } catch (error) {
        commandError(error);
      }
    });

  addSelection(
    grade
      .command("localize")
      .description("Attach Japanese display messages to the latest canonical grade findings"),
  )
    .requiredOption("--from <path>", "JSON string array returned by the translation agent")
    .option(
      "--translation-index <index>",
      "Apply a retry for this zero-based index from the translatable findings",
      requireNonNegativeInteger,
    )
    .requiredOption(
      "--rejections-out <path>",
      "Write machine-readable rejected translation details as JSON",
    )
    .action((options) => {
      try {
        const target = requireTarget(options.target);
        const selected = discoverGradeTargets({
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
        }).map(repoRelativePath);
        if (selected.length !== 1) {
          throw new Error("grade localize requires exactly one selected --path");
        }
        const resultPath = gradeResultPathForDocument({
          documentPath: selected[0],
          project: options.project,
        });
        const result = readGradeResult(resultPath);
        if (!result) throw new Error(`${selected[0]}: grade result not found`);
        if (result.target !== target) {
          throw new Error(
            `${selected[0]}: grade result target=${result.target}, expected=${target}`,
          );
        }
        let translations: unknown;
        try {
          translations = JSON.parse(
            extractJsonArrayText(
              readFileSync(resolveSafeRepositoryPath(options.from, "--from"), "utf8"),
            ),
          );
        } catch (error) {
          translations = undefined;
          process.stderr.write(
            `warning: could not parse grade finding translations: ${error instanceof Error ? error.message : String(error)}\n`,
          );
        }
        const localized = applyGradeFindingTranslations(
          result,
          translations,
          options.translationIndex,
        );
        if (!localized.accepted) {
          process.stderr.write(
            `warning: rejected grade finding translations: ${localized.reason ?? "invalid output"}\n`,
          );
        }
        const rejectionsPath = resolveSafeRepositoryPath(options.rejectionsOut, "--rejections-out");
        mkdirSync(dirname(rejectionsPath), { recursive: true });
        writeFileSync(
          rejectionsPath,
          `${JSON.stringify({ version: 1, rejections: localized.rejections }, null, 2)}\n`,
          "utf8",
        );
        const changed = writeGradeResult(resultPath, localized.result);
        process.stdout.write(
          `${changed ? "updated" : "unchanged"}: ${repoRelativePath(resultPath)}\n`,
        );
      } catch (error) {
        commandError(error);
      }
    });
}
