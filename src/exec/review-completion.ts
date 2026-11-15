import { existsSync, readFileSync } from "node:fs";
import type { ReviewGradeOutcome } from "../review/grade.js";
import { isReviewVerdict, type ReviewVerdict } from "../review/types.js";

// review の verdict のうち、タスクの完了可否を判断していない（保留を表す）値。review result を
// 記録できても、runner はこの verdict のタスクを done にせず blocked にする（PJR-M18B）。
export const PENDING_REVIEW_VERDICTS: ReadonlySet<ReviewVerdict> = new Set<ReviewVerdict>([
  "grade-stale",
  "grade-unavailable",
  "changed-during-review",
]);

const PENDING_VERDICT_NEXT_ACTION: Readonly<Record<string, string>> = {
  "grade-stale":
    "run `specdojo grade run` for the review subject until it succeeds, then re-run the review task",
  "grade-unavailable":
    "repair the unreadable grade result sidecar or re-run `specdojo grade run`, then re-run the review task",
  "changed-during-review":
    "re-run the review task against the current content of the review subject",
};

/** Read the review verdict recorded in a review result. */
export function reviewResultVerdict(resultPath: string): ReviewVerdict | undefined {
  if (!existsSync(resultPath)) return undefined;
  const value = readFileSync(resultPath, "utf8").match(/^- verdict:\s*(\S+)\s*$/m)?.[1];
  return isReviewVerdict(value) ? value : undefined;
}

/**
 * Decide whether a review task must be blocked instead of completed. A grade that still failed
 * after its retries, or a pending verdict, leaves the subject without a usable grade.
 * Returns the block reason with the next action, or undefined when completion may proceed.
 */
export function reviewCompletionBlockReason(params: {
  verdict: ReviewVerdict | undefined;
  gradeOutcome?: ReviewGradeOutcome;
}): string | undefined {
  const { verdict, gradeOutcome } = params;
  if (gradeOutcome?.action === "failed") {
    return (
      `review grade failed after ${gradeOutcome.attempts} attempt(s): ${gradeOutcome.detail}` +
      `; need=fix the grade failure (for example the grade output format) and re-run the review task` +
      `; ref=grade run ${gradeOutcome.runId}`
    );
  }
  if (verdict && PENDING_REVIEW_VERDICTS.has(verdict)) {
    return `review verdict is ${verdict}; need=${PENDING_VERDICT_NEXT_ACTION[verdict]}`;
  }
  return undefined;
}

/** Read the result verdict and decide the block reason for a review-mode task. */
export function reviewTaskBlockReason(params: {
  mode: string | undefined;
  resultPath: string;
  gradeOutcome?: ReviewGradeOutcome;
}): string | undefined {
  if (params.mode !== "review") return undefined;
  return reviewCompletionBlockReason({
    verdict: reviewResultVerdict(params.resultPath),
    ...(params.gradeOutcome ? { gradeOutcome: params.gradeOutcome } : {}),
  });
}
