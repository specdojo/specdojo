import { randomUUID } from "node:crypto";
import { join, relative } from "node:path";
import { ensureDir, writeJson } from "../shared/fs.js";
import { gitOutput } from "../shared/git.js";
import { redactSensitiveText } from "../shared/text.js";
import type { RoutineRunHistoryEntry } from "./definition.js";

/** Durable diagnostics only when no Job Run exists to explain a failed routine. */
export function recordRoutineFailure(
  repoRoot: string,
  failuresPath: string,
  entry: RoutineRunHistoryEntry,
): string | undefined {
  if (entry.result !== "failure" || entry.job_run_ids.length > 0) return undefined;
  const runId = randomUUID();
  const directory = join(failuresPath, entry.routine_id);
  ensureDir(directory);
  const file = join(directory, `${runId}.json`);
  writeJson(file, {
    ...entry,
    run_id: runId,
    ...(entry.reason ? { reason: redactSensitiveText(entry.reason) } : {}),
  });
  const target = relative(repoRoot, file);
  gitOutput(repoRoot, ["add", "--", target]);
  gitOutput(repoRoot, [
    "commit",
    "--only",
    "-m",
    `chore(routine): record failure ${entry.routine_id}`,
    "--",
    target,
  ]);
  return file;
}
