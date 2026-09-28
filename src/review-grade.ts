import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { gitEnvironment } from "./git-environment.js";
import type { GradeResult } from "./grade-result.js";
import { gradeContentHash, gradeResultPathForDocument, parseGradeResult } from "./grade-result.js";

// review フェーズの前段で runner が行う grade の実行判断と、その結果を review plan へ提示する
// 文面を扱う（PJR-KCMH）。評価は grade が 1 回だけ行い、review は評価結果を事実として受け取る
// （PJR-2ZVS）。鮮度は評価対象の content_hash と評価結果サイドカーの content_hash で判定する。

export type ReviewGradeTarget = "kata" | "deliverable";

export type ReviewGradeFreshness =
  | { state: "fresh"; sidecarPath: string; result: GradeResult }
  | { state: "stale"; sidecarPath: string; result: GradeResult }
  | { state: "missing"; sidecarPath: string }
  | { state: "unresolved"; reason: string }
  | { state: "unreadable"; sidecarPath?: string; reason: string };

export type ReviewGradeOutcome =
  | { action: "skipped" }
  | { action: "executed"; runId: string }
  | { action: "failed"; runId: string; detail: string }
  | { action: "not-run"; detail: string };

export type ReviewGradeAction = { run: true } | { run: false; outcome: ReviewGradeOutcome };

export type ReviewGradeInvoke = (
  command: string,
  args: readonly string[],
  cwd: string,
) => Promise<{ exitCode: number; stderr: string }>;

export const REVIEW_GRADE_SCRIPT = join("tools", "grade", "run-per-document.sh");

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Classify a stored grade against the current content of its subject. Only content_hash decides
 * freshness here; comparison-source changes are left to `grade list --dependency-changed`.
 */
export function classifyReviewGrade(opts: {
  content: string;
  sidecarPath: string;
  sidecarContent: string | undefined;
}): ReviewGradeFreshness {
  const { content, sidecarPath, sidecarContent } = opts;
  if (sidecarContent === undefined) return { state: "missing", sidecarPath };
  let result: GradeResult;
  try {
    result = parseGradeResult(sidecarContent, sidecarPath);
  } catch (error) {
    return { state: "unreadable", sidecarPath, reason: errorMessage(error) };
  }
  return result.content_hash === gradeContentHash(content)
    ? { state: "fresh", sidecarPath, result }
    : { state: "stale", sidecarPath, result };
}

/** Read the subject and its sidecar from disk and classify the stored grade. */
export function reviewGradeFreshness(opts: {
  subjectPath: string;
  projectId: string;
  rootDir: string;
}): ReviewGradeFreshness {
  const { subjectPath, projectId, rootDir } = opts;
  if (!subjectPath) return { state: "unresolved", reason: "評価対象のパスを解決できない" };
  const absolute = join(rootDir, subjectPath);
  if (!existsSync(absolute)) {
    return { state: "unresolved", reason: `評価対象が存在しない: ${subjectPath}` };
  }
  let sidecarPath: string;
  let content: string;
  try {
    content = readFileSync(absolute, "utf8");
    sidecarPath = gradeResultPathForDocument({
      documentPath: subjectPath,
      project: projectId,
      rootDir,
    });
  } catch (error) {
    return { state: "unresolved", reason: errorMessage(error) };
  }
  let sidecarContent: string | undefined;
  try {
    sidecarContent = existsSync(sidecarPath) ? readFileSync(sidecarPath, "utf8") : undefined;
  } catch (error) {
    return { state: "unreadable", sidecarPath, reason: errorMessage(error) };
  }
  return classifyReviewGrade({ content, sidecarPath, sidecarContent });
}

/**
 * Decide whether the runner grades the subject before the review plan is written. A fresh grade is
 * reused; an unresolved subject or a repository without the grade pipeline cannot be graded.
 */
export function decideReviewGradeAction(opts: {
  freshness: ReviewGradeFreshness;
  scriptAvailable: boolean;
  dryRun: boolean;
}): ReviewGradeAction {
  const { freshness, scriptAvailable, dryRun } = opts;
  if (freshness.state === "fresh") return { run: false, outcome: { action: "skipped" } };
  if (freshness.state === "unresolved") {
    return { run: false, outcome: { action: "not-run", detail: freshness.reason } };
  }
  if (dryRun)
    return { run: false, outcome: { action: "not-run", detail: "dry-run のため実行しない" } };
  if (!scriptAvailable) {
    return {
      run: false,
      outcome: {
        action: "not-run",
        detail: `grade の実行スクリプトがリポジトリにない: ${REVIEW_GRADE_SCRIPT.split("\\").join("/")}`,
      },
    };
  }
  return { run: true };
}

export function reviewGradeRunId(taskId: string, now: Date): string {
  const safeTaskId = taskId.replace(/[^A-Za-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || "task";
  const stamp = now
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d+Z$/, "Z");
  return `review-${safeTaskId}-${stamp}`;
}

export function reviewGradeArgs(opts: {
  runId: string;
  projectId: string;
  target: ReviewGradeTarget;
  subjectPath: string;
}): string[] {
  const args = [
    REVIEW_GRADE_SCRIPT.split("\\").join("/"),
    "--run-id",
    opts.runId,
    "--project",
    opts.projectId,
    "--target",
    opts.target,
  ];
  // kata の対象範囲は --kind で決まる。評価対象の種類を問わず受け付けるよう all を渡す。
  if (opts.target === "kata") args.push("--kind", "all");
  args.push("--path", opts.subjectPath);
  return args;
}

const defaultInvoke: ReviewGradeInvoke = (command, args, cwd) =>
  new Promise((resolvePromise) => {
    const child = spawn(command, [...args], {
      cwd,
      env: gitEnvironment(),
      stdio: ["ignore", "inherit", "pipe"],
    });
    let stderr = "";
    child.stderr?.on("data", (chunk: Buffer) => {
      const text = chunk.toString("utf8");
      stderr += text;
      process.stderr.write(text);
    });
    child.on("error", (error) => resolvePromise({ exitCode: 1, stderr: errorMessage(error) }));
    child.on("close", (code) => resolvePromise({ exitCode: code ?? 1, stderr }));
  });

function lastLine(text: string): string {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.at(-1) ?? "";
}

/**
 * Runner-side grade before a review plan is generated. The executor never grades (PJR-2ZVS 3.6).
 * Failures are reported in the outcome instead of thrown so the review can still record
 * grade-stale / grade-unavailable as its verdict.
 */
export async function ensureReviewGrade(opts: {
  taskId: string;
  projectId: string;
  subjectPath: string;
  target: ReviewGradeTarget;
  repoRoot: string;
  dryRun: boolean;
  now?: Date;
  invoke?: ReviewGradeInvoke;
}): Promise<ReviewGradeOutcome> {
  const freshness = reviewGradeFreshness({
    subjectPath: opts.subjectPath,
    projectId: opts.projectId,
    rootDir: opts.repoRoot,
  });
  const decision = decideReviewGradeAction({
    freshness,
    scriptAvailable: existsSync(join(opts.repoRoot, REVIEW_GRADE_SCRIPT)),
    dryRun: opts.dryRun,
  });
  if (!decision.run) return decision.outcome;

  const runId = reviewGradeRunId(opts.taskId, opts.now ?? new Date());
  const args = reviewGradeArgs({
    runId,
    projectId: opts.projectId,
    target: opts.target,
    subjectPath: opts.subjectPath,
  });
  const invoke = opts.invoke ?? defaultInvoke;
  try {
    const { exitCode, stderr } = await invoke("bash", args, opts.repoRoot);
    if (exitCode === 0) return { action: "executed", runId };
    const reason = lastLine(stderr);
    return {
      action: "failed",
      runId,
      detail: `exit ${exitCode}${reason ? `: ${reason}` : ""}`,
    };
  } catch (error) {
    return { action: "failed", runId, detail: errorMessage(error) };
  }
}

function outcomeLine(outcome: ReviewGradeOutcome | undefined): string | undefined {
  if (!outcome) return undefined;
  switch (outcome.action) {
    case "skipped":
      return "- runner の grade 実行: 省略した（評価対象の `content_hash` が評価結果と一致したため、既存の評価結果を使う）";
    case "executed":
      return `- runner の grade 実行: 実行した（run id: \`${outcome.runId}\`）`;
    case "failed":
      return `- runner の grade 実行: 失敗した（run id: \`${outcome.runId}\`; ${outcome.detail}）`;
    case "not-run":
      return `- runner の grade 実行: 実行していない（${outcome.detail}）`;
  }
}

function freshnessLine(freshness: ReviewGradeFreshness): string {
  switch (freshness.state) {
    case "fresh":
      return "- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）";
    case "stale":
      return "- 鮮度: 最新でない（評価対象の `content_hash` が評価結果の `content_hash` と一致しない）。以下は変更前の内容に対する評価結果であり、現在の内容の評価ではない";
    case "missing":
      return "- 鮮度: 評価結果がない（評価結果サイドカーが存在しない）";
    case "unresolved":
      return `- 鮮度: 確認できない（${freshness.reason}）`;
    case "unreadable":
      return `- 鮮度: 確認できない（評価結果サイドカーを読み取れない: ${freshness.reason}）`;
  }
}

function inlineText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function gradeResultLines(result: GradeResult): string[] {
  const counts = result.finding_counts;
  const lines = [
    `- \`verdict\`: \`${result.verdict}\``,
    `- \`score\`: ${result.score}`,
    `- \`graded_at\`: ${result.graded_at}（\`graded_by\`: ${result.graded_by}）`,
    `- finding 件数: blocker ${counts.blocker ?? 0} / major ${counts.major ?? 0} / minor ${counts.minor ?? 0} / note ${counts.note ?? 0}`,
    "",
    "grade が判定した観点（全観点）:",
    "",
  ];
  const viewpoints = Object.entries(result.viewpoints).sort(([a], [b]) => a.localeCompare(b));
  if (viewpoints.length === 0) {
    lines.push("- なし");
  } else {
    lines.push("| 観点 | level | score |", "| --- | --- | --- |");
    for (const [id, value] of viewpoints) {
      lines.push(`| \`${id}\` | ${value.level} | ${value.score} |`);
    }
  }
  lines.push("", "finding:", "");
  if (result.findings.length === 0) {
    lines.push("- なし");
  } else {
    for (const finding of result.findings) {
      lines.push(
        `- \`${finding.id}\` [${finding.severity}/\`${finding.rule}\`; line=${finding.line}]: ${inlineText(finding.message)}`,
      );
    }
  }
  return lines;
}

/**
 * Render the grade result presented in a review plan. The wording states facts that grade has
 * already settled; it does not ask the reviewer to re-evaluate viewpoints or to raise findings
 * again. Every viewpoint in the result is listed regardless of its evaluation class.
 */
export function renderReviewGradeSummary(
  freshness: ReviewGradeFreshness,
  outcome?: ReviewGradeOutcome,
): string {
  const lines = [
    "runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。",
    "",
  ];
  const runLine = outcomeLine(outcome);
  if (runLine) lines.push(runLine);
  lines.push(freshnessLine(freshness));
  if (freshness.state === "fresh" || freshness.state === "stale") {
    lines.push(...gradeResultLines(freshness.result));
  }
  return lines.join("\n");
}
