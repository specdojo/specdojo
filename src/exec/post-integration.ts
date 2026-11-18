import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { DIST_BUILD_FAILURE_MARKER } from "../shared/dist-freshness.js";
import {
  matchesParentValidationPaths,
  runParentValidationBatch,
  type ParentValidationInvoker,
} from "./parent-validation.js";
import { redactSensitiveText } from "./evidence.js";
import { gitOutput } from "./worktree.js";

export type PostIntegrationEntry = { id: "build-dist"; paths: readonly string[] };

export function resolvePostIntegrationEntries(value: unknown): PostIntegrationEntry[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) {
    throw new Error("pipeline.post_integration in exec-defaults must be an array");
  }
  const seen = new Set<string>();
  return value.map((entry: unknown, index) => {
    const where = `pipeline.post_integration[${index}] in exec-defaults`;
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error(`${where} must be { id, paths }`);
    }
    const record = entry as Record<string, unknown>;
    if (Object.keys(record).some((key) => key !== "id" && key !== "paths")) {
      throw new Error(`${where} accepts only id and paths`);
    }
    if (record.id !== "build-dist") throw new Error(`${where}: unknown id (allowed: build-dist)`);
    if (seen.has(record.id)) throw new Error(`${where}: duplicate id: ${record.id}`);
    seen.add(record.id);
    if (
      !Array.isArray(record.paths) ||
      record.paths.length === 0 ||
      !record.paths.every((path) => typeof path === "string" && path.trim().length > 0)
    ) {
      throw new Error(`${where}.paths must be a non-empty array of non-empty glob strings`);
    }
    return { id: record.id, paths: record.paths.map((path: string) => path.trim()) };
  });
}

export type PostIntegrationRecord = {
  id: "build-dist";
  command: "npm run build";
  base_commit: string;
  output_commit: string;
  started_at: string;
  completed_at: string;
  status: "passed" | "failed" | "skipped";
  summary: string;
};

/** Locate the original integration, even if other tasks landed before cleanup resumed. */
export function integratedCommitRange(
  repoRoot: string,
  branch: string,
): { baseCommit: string; outputCommit: string } {
  const tip = gitOutput(repoRoot, ["rev-parse", "--verify", `${branch}^{commit}`]).trim();
  const outputCommit = gitOutput(repoRoot, [
    "rev-list",
    "--first-parent",
    "--ancestry-path",
    `${tip}..HEAD`,
  ])
    .trim()
    .split("\n")
    .filter(Boolean)
    .at(-1);
  if (!outputCommit) throw new Error(`could not locate integrated commit for branch: ${branch}`);
  return {
    baseCommit: gitOutput(repoRoot, ["rev-parse", `${outputCommit}^1`]).trim(),
    outputCommit,
  };
}

function recorded(logPath: string, id: string, outputCommit: string): boolean {
  if (!existsSync(logPath)) return false;
  return readFileSync(logPath, "utf8")
    .split("\n")
    .some((line) => {
      try {
        const record = JSON.parse(line) as PostIntegrationRecord;
        return (
          record.id === id &&
          record.output_commit === outputCommit &&
          ["passed", "failed", "skipped"].includes(record.status)
        );
      } catch {
        return false;
      }
    });
}

/** Leave the marker that `dist-freshness` treats as stale after a failed build; clear it on success. */
export function updateDistBuildFailureMarker(
  repoRoot: string,
  failed: boolean,
  content: string,
): void {
  const marker = join(repoRoot, "dist", DIST_BUILD_FAILURE_MARKER);
  if (failed) {
    mkdirSync(dirname(marker), { recursive: true });
    writeFileSync(marker, `${content}\n`, "utf8");
  } else {
    rmSync(marker, { force: true });
  }
}

/** Caller retains the exec/lifecycle lock until this completes. Never undo a merged commit. */
export async function runPostIntegration(params: {
  entries: readonly PostIntegrationEntry[] | undefined;
  repoRoot: string;
  baseCommit: string;
  outputCommit: string;
  logPath: string;
  invoke?: ParentValidationInvoker;
  log?: (line: string) => void;
}): Promise<PostIntegrationRecord[]> {
  const log =
    params.log ??
    ((line: string) => {
      process.stdout.write(line);
    });
  const records: PostIntegrationRecord[] = [];
  for (const entry of resolvePostIntegrationEntries(params.entries)) {
    const startedAt = new Date().toISOString();
    try {
      if (recorded(params.logPath, entry.id, params.outputCommit)) continue;
      // --no-renames includes both the old and new names; -z preserves spaces and newlines.
      const changes = gitOutput(params.repoRoot, [
        "diff",
        "--name-only",
        "--no-renames",
        "-z",
        params.baseCommit,
        params.outputCommit,
        "--",
      ])
        .split("\0")
        .filter(Boolean);
      let status: PostIntegrationRecord["status"] = "skipped";
      let summary = "no integrated paths match paths";
      if (changes.some((path) => matchesParentValidationPaths(path, entry.paths))) {
        log(`  [post-integration] ${entry.id}: running npm run build\n`);
        const batch = await runParentValidationBatch(["build"], params.repoRoot, params.invoke);
        const validation = batch.validations[0];
        status = validation.status === "passed" ? "passed" : "failed";
        summary = validation.summary;
      }
      records.push({
        id: entry.id,
        command: "npm run build",
        base_commit: params.baseCommit,
        output_commit: params.outputCommit,
        started_at: startedAt,
        completed_at: new Date().toISOString(),
        status,
        summary,
      });
    } catch (error) {
      records.push({
        id: entry.id,
        command: "npm run build",
        base_commit: params.baseCommit,
        output_commit: params.outputCommit,
        started_at: startedAt,
        completed_at: new Date().toISOString(),
        status: "failed",
        summary: redactSensitiveText(error instanceof Error ? error.message : String(error)),
      });
    }
    const record = records.at(-1)!;
    if (record.status !== "skipped") {
      try {
        updateDistBuildFailureMarker(
          params.repoRoot,
          record.status === "failed",
          record.output_commit,
        );
      } catch (error) {
        log(
          `  [post-integration] could not update dist failure marker: ${redactSensitiveText(String(error))}\n`,
        );
      }
    }
    log(`  [post-integration] ${record.id}: ${record.status}: ${record.summary}\n`);
    if (record.status === "failed") {
      log(
        "  [post-integration] integration kept; fix the build and run npm run build before the next exec run (dist-freshness check remains enabled).\n",
      );
    }
    try {
      mkdirSync(dirname(params.logPath), { recursive: true });
      appendFileSync(params.logPath, `${JSON.stringify(record)}\n`, "utf8");
    } catch (error) {
      log(`  [post-integration] could not record outcome: ${redactSensitiveText(String(error))}\n`);
    }
  }
  return records;
}
