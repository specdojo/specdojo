import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, isAbsolute, join, relative } from "node:path";
import type { DeliverableInfo } from "../catalog/document-target.js";
import { declaredKata, loadRulebookRefs, resolveKataRefs } from "../kata/kata.js";
import { reviewGradeFreshness, renderReviewGradeSummary } from "../review/grade.js";
import type { ReviewVerdict } from "../review/types.js";
import { getProjectSchedulePath, loadConfig, specdojoRootDir } from "../shared/specdojo-config.js";
import { load } from "../shared/yaml.js";
import type { ReadyTaskView } from "./types.js";

export type KataReviewSubject = { path: string; label: string };

/**
 * `schedule_file` in ready/cpm snapshots is relative to the project's schedule directory, not to
 * the process cwd (PJR-X05N). Resolve it against the configured schedule path first and keep the
 * cwd-relative and absolute forms for callers that already pass a resolvable path.
 */
function strategyDirectories(scheduleFile: string, projectId: string | undefined): string[] {
  const directories: string[] = [];
  if (!isAbsolute(scheduleFile) && projectId) {
    const rootDir = specdojoRootDir();
    const project = loadConfig(rootDir).config?.projects[projectId];
    if (project)
      directories.push(join(rootDir, getProjectSchedulePath(project), dirname(scheduleFile)));
  }
  directories.push(dirname(scheduleFile));
  return directories;
}

/** Read the intent from the task's own track, even when the review approach is fully-guided. */
export function scheduleKataReviewSubjects(
  task: Pick<ReadyTaskView, "id" | "local_id" | "schedule_file">,
  deliverable: DeliverableInfo | null,
  projectId: string | undefined,
): KataReviewSubject[] {
  if (!task.local_id || !task.schedule_file) return [];
  const track = basename(task.schedule_file).match(/^sch-track-(.+)\.ya?ml$/)?.[1];
  if (!track || !task.id.startsWith(`T-${track.toUpperCase()}-`)) return [];
  const strategyPath = strategyDirectories(task.schedule_file, projectId)
    .flatMap((directory) =>
      ["yaml", "yml"].map((ext) => join(directory, `sch-strategy-${track}.${ext}`)),
    )
    .find(existsSync);
  if (!strategyPath) return [];
  const strategy = load(readFileSync(strategyPath, "utf8")) as {
    approach_rules?: Array<{ local_ids: string[]; intent: string; bootstrap_scope?: string[] }>;
  };
  const rule = strategy.approach_rules?.find((rule) => rule.local_ids.includes(task.local_id!));
  if (!rule || !["improve-kata", "bootstrap-kata-set"].includes(rule.intent)) return [];
  const rulebook = deliverable?.deliverable.rulebook;
  // improve-kata・bootstrap-kata-set の段は実践の型そのものを評価するため、kind: generated の
  // 成果物でも宣言された rulebook を解決する（PJR-DM9B）。generated の扱いだけを外す。
  const kind = deliverable?.deliverable.kind;
  const refs = resolveKataRefs(rulebook, kind === "generated" ? undefined : kind);
  const subjects: KataReviewSubject[] = [{ path: refs.rulebook, label: "rulebook" }];
  const declarations = rulebook ? loadRulebookRefs(rulebook) : {};
  const declared = rulebook ? declaredKata(rulebook) : [];
  for (const kind of ["recipe", "sample", "template"] as const) {
    const matches = declared.filter((item) => item.kind === kind);
    if (matches.length) {
      subjects.push(
        ...matches.map((item) => ({
          path: relative(specdojoRootDir(), item.fsPath).replaceAll("\\", "/"),
          label: `${kind}: ${item.id}`,
        })),
      );
    } else if (
      (kind === "sample" && declarations.sample !== "not-needed") ||
      rule.bootstrap_scope?.includes(kind)
    ) {
      // An absent/undecided required reference must hold the review, not disappear from it.
      subjects.push({ path: "_MISSING_", label: kind });
    }
  }
  return subjects.filter(
    (subject, index) =>
      subjects.findIndex(
        (other) => other.path === subject.path && other.label === subject.label,
      ) === index,
  );
}

export function kataReviewVerdict(
  subjects: readonly KataReviewSubject[],
  projectId: string,
  rootDir: string,
): ReviewVerdict | undefined {
  const grades = subjects.map((subject) =>
    reviewGradeFreshness({
      subjectPath: subject.path === "_MISSING_" ? "" : subject.path,
      projectId,
      rootDir,
    }),
  );
  if (grades.some((grade) => grade.state === "unreadable")) return "grade-unavailable";
  if (grades.some((grade) => grade.state !== "fresh")) return "grade-stale";
  if (
    grades.some(
      (grade) =>
        grade.state === "fresh" &&
        (grade.result.target !== "kata" || grade.result.verdict !== "pass"),
    )
  )
    return "incomplete";
  return undefined;
}

export function kataReviewSummary(
  subjects: readonly KataReviewSubject[],
  projectId: string,
): string {
  if (!subjects.length) return "";
  return [
    "型の整備を含む schedule の追加完了条件: 以下の型すべてに最新の `--target kata` の `pass` が必要。`needs-work` / `fail` は `incomplete` とし、`complete-with-findings` でも完了扱いにしない。未評価・未解決・古い結果は `grade-stale`、読取不能は `grade-unavailable` とする。各対象の鮮度を判定前にも確認し、review 中の変更は `changed-during-review` とする。",
    ...subjects.flatMap((subject) => {
      const freshness = reviewGradeFreshness({
        subjectPath: subject.path === "_MISSING_" ? "" : subject.path,
        projectId,
        rootDir: specdojoRootDir(),
      });
      return [
        "",
        `型の評価対象（\`${subject.label}\`、\`--target kata\`）: \`${subject.path}\``,
        "sidecarPath" in freshness && freshness.sidecarPath
          ? `評価結果サイドカー: \`${relative(specdojoRootDir(), freshness.sidecarPath).replaceAll("\\", "/")}\``
          : "評価結果サイドカー: 解決できない",
        "",
        renderReviewGradeSummary(freshness),
      ];
    }),
  ].join("\n");
}

/** Guard the recorded verdict as well as the reviewer prompt, including legacy non-pipeline runs. */
export function enforceKataReviewVerdict(
  resultPath: string,
  subjects: readonly KataReviewSubject[],
  projectId: string,
  rootDir: string,
): void {
  if (!subjects.length || !existsSync(resultPath)) return;
  const verdict = kataReviewVerdict(subjects, projectId, rootDir);
  if (!verdict) return;
  const content = readFileSync(resultPath, "utf8");
  const updated = content.replace(
    /^- verdict:\s*(complete|complete-with-findings)\s*$/m,
    `- verdict: ${verdict}`,
  );
  if (updated !== content)
    writeFileSync(
      resultPath,
      `${updated.trimEnd()}\n\n型の grade の追加完了条件を満たさないため、runner が verdict を \`${verdict}\` に制限した。\n`,
    );
}
