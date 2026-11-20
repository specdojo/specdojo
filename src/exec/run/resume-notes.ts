import { readFileSync, writeFileSync } from "node:fs";
import { insertBeforePlanConventions } from "../../shared/plan-conventions.js";
import type { PipelineResumeNote } from "../pipeline-state.js";
import { parseRegisterIds } from "../register.js";
import type { RunOpts } from "./shared.js";

// PJR-5F1Y: 再開の前に plan へ指示を足す `--resume-note`。worktree の plan を書き換えるため、
// plan の変更を統合で許す executor の明示再開（--resume-from executor）に限る。

export const RESUME_NOTES_HEADING = "再開の指示";

/** Returns the reason to stop before any project path, lock, or register state is touched. */
export function resumeNoteOptionError(
  opts: Pick<RunOpts, "resumeNote" | "resume" | "resumeFrom" | "register" | "registerFilter">,
): string | undefined {
  const notes = opts.resumeNote;
  if (notes === undefined || notes.length === 0) return undefined;
  if (notes.some((note) => !note.trim())) return "--resume-note requires a non-empty text.";
  if (!opts.resume || opts.resumeFrom !== "executor") {
    return "--resume-note requires --resume --resume-from executor.";
  }
  if (opts.registerFilter || !opts.register) {
    return "--resume-note requires --register with a single item ID.";
  }
  let ids: string[];
  try {
    ids = parseRegisterIds(opts.register).ids;
  } catch {
    return "--resume-note requires --register with a single item ID.";
  }
  if (ids.length !== 1) return "--resume-note requires --register with a single item ID.";
  return undefined;
}

/** Markdown section added to the plan; continuation lines stay inside their list item. */
export function resumeNotesSection(entry: PipelineResumeNote): string {
  const items = entry.notes.map((note) => `- ${note.trim().split(/\r?\n/).join("\n  ")}`);
  return [
    `## ${RESUME_NOTES_HEADING}（${entry.at}）`,
    "",
    "利用者が再開の前に足した指示である。これまでの申し送りとあわせて、この指示に従って作業を続ける。",
    "",
    ...items,
  ].join("\n");
}

/** Insert the section before the conventions reference and keep that reference unchanged. */
export function appendResumeNotesToPlan(planPath: string, entry: PipelineResumeNote): void {
  const plan = readFileSync(planPath, "utf8");
  writeFileSync(planPath, insertBeforePlanConventions(plan, resumeNotesSection(entry)), "utf8");
}

/** Earlier resume notes carried over from the checkpoint, plus this resume's entry if any. */
export function nextResumeNotes(
  recorded: readonly PipelineResumeNote[] | undefined,
  entry: PipelineResumeNote | undefined,
): PipelineResumeNote[] {
  return [...(recorded ?? []), ...(entry ? [entry] : [])];
}
