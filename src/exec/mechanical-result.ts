import { MAX_TEXT_LENGTH, type EditReporterOutput } from "./reporter-output.js";
import { deriveReporterFacts, type ReporterEvidence } from "./reporter.js";

const MAX_SUMMARY_ITEMS = 100;

export const MECHANICAL_RESULT_APPROACH =
  "reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。";

function bounded(text: string): string {
  return text.length <= MAX_TEXT_LENGTH ? text : `${text.slice(0, MAX_TEXT_LENGTH - 1)}…`;
}

// executor の `final_message` は箇条書きや複数行の要約になることがある。行頭の箇条書きの記号を
// 外し、1 行を実施内容の 1 項目にする。
function summaryItems(finalMessage: string): string[] {
  return finalMessage
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:[-*+]|\d+\.)\s+/, "").trim())
    .filter(Boolean)
    .slice(0, MAX_SUMMARY_ITEMS)
    .map(bounded);
}

/**
 * PJR-T01P: the edit result fields the runner can fill without the reporter agent. Returns
 * `undefined` when a field needs summarising or judgement, so the caller runs the reporter:
 * review mode (verdict), a blocked outcome (the reporter explains partial work), or an executor
 * report without `final_message`.
 *
 * - `summary`: the lines of the executor's `final_message`.
 * - `changed_files`: empty; the renderer lists the evidence changes with git line counts.
 * - `handoff`: empty; the renderer keeps the executor `handoff` and the runner-derived notes.
 * - `approach`: a fixed sentence stating that the runner wrote the result.
 */
export function mechanicalEditReporterOutput(
  evidence: ReporterEvidence,
  mode: "edit" | "review" = "edit",
): EditReporterOutput | undefined {
  if (mode !== "edit") return undefined;
  const summary = summaryItems(evidence.final_message ?? "");
  if (summary.length === 0) return undefined;
  if (deriveReporterFacts(evidence, { mode }).outcome !== "complete") return undefined;
  return {
    schema_version: 1,
    mode: "edit",
    summary,
    changed_files: [],
    handoff: [],
    approach: MECHANICAL_RESULT_APPROACH,
  };
}
