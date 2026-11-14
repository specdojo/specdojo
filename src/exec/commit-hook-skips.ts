import type { EvidenceValidation } from "./evidence.js";
import { parentValidationLabels, recordedParentValidationLabel } from "./parent-validation.js";
import { recordedRunValidations } from "./pipeline-state.js";

/**
 * One element of `pipeline.commit_hook_skips` in exec-defaults (PJR-T01P). The runner's
 * integration commit skips the Git hook command `hook` when every parent validation in
 * `covered_by` (`<id>` or `<repo>:<id>`) passed for the integrated changes.
 */
export type CommitHookSkip = {
  hook: string;
  covered_by: string[];
};

// LEFTHOOK_EXCLUDE はコンマ区切りのため、hook のコマンド名にコンマや空白を許さない。
const HOOK_NAME_PATTERN = /^[A-Za-z0-9_.-]+$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Validates `pipeline.commit_hook_skips` against the configured parent validations. */
export function resolveCommitHookSkips(
  value: unknown,
  parentValidationEntries: readonly unknown[] | undefined,
): CommitHookSkip[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) {
    throw new Error("pipeline.commit_hook_skips in exec-defaults must be an array");
  }
  const labels = new Set(parentValidationLabels(parentValidationEntries));
  const seen = new Set<string>();
  return value.map((entry: unknown, index) => {
    const where = `pipeline.commit_hook_skips[${index}] in exec-defaults`;
    if (!isRecord(entry)) throw new Error(`${where} must be { hook, covered_by }`);
    const unknownKeys = Object.keys(entry).filter((key) => key !== "hook" && key !== "covered_by");
    if (unknownKeys.length > 0) {
      throw new Error(`${where}: unknown key(s) ${unknownKeys.sort().join(", ")}`);
    }
    if (typeof entry.hook !== "string" || !HOOK_NAME_PATTERN.test(entry.hook)) {
      throw new Error(`${where}.hook must match ${String(HOOK_NAME_PATTERN)}`);
    }
    if (seen.has(entry.hook)) throw new Error(`${where}: duplicate hook ${entry.hook}`);
    seen.add(entry.hook);
    const coveredBy = entry.covered_by;
    if (
      !Array.isArray(coveredBy) ||
      coveredBy.length === 0 ||
      !coveredBy.every((label) => typeof label === "string")
    ) {
      throw new Error(`${where}.covered_by must be a non-empty array of parent validation ids`);
    }
    const unknownLabels = coveredBy.filter((label: string) => !labels.has(label));
    if (unknownLabels.length > 0) {
      throw new Error(
        `${where}.covered_by is not in pipeline.parent_validations: ${unknownLabels.join(", ")}`,
      );
    }
    return { hook: entry.hook, covered_by: [...(coveredBy as string[])] };
  });
}

/**
 * Hook commands the integration commit may skip: those whose every covering parent validation
 * is recorded by the runner as `passed`. A validation skipped by change type (`not_applicable`)
 * does not cover the hook, so the hook still runs when its own glob matches.
 */
export function integrationCommitHookExclusions(
  skips: readonly CommitHookSkip[],
  validations: readonly EvidenceValidation[],
): string[] {
  const passed = new Set(
    validations
      .filter((validation) => validation.source === "runner" && validation.status === "passed")
      .map(recordedParentValidationLabel),
  );
  return skips
    .filter((skip) => skip.covered_by.every((label) => passed.has(label)))
    .map((skip) => skip.hook);
}

/** Environment for the integration commit; merges with an inherited LEFTHOOK_EXCLUDE. */
export function lefthookExcludeEnvironment(
  hooks: readonly string[],
  inherited: string | undefined = process.env.LEFTHOOK_EXCLUDE,
): Record<string, string> | undefined {
  if (hooks.length === 0) return undefined;
  const names = [
    ...new Set([
      ...(inherited ?? "")
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean),
      ...hooks,
    ]),
  ];
  return { LEFTHOOK_EXCLUDE: names.join(",") };
}

/** Hook commands to skip in a run's integration commit, from its recorded parent validations. */
export function integrationCommitSkipHooks(params: {
  pipeline: { parent_validations?: readonly unknown[]; commit_hook_skips?: unknown } | undefined;
  worktreePath: string;
  pipelineStatePath: string | undefined;
}): string[] {
  const skips = resolveCommitHookSkips(
    params.pipeline?.commit_hook_skips,
    params.pipeline?.parent_validations,
  );
  if (skips.length === 0) return [];
  return integrationCommitHookExclusions(
    skips,
    recordedRunValidations(params.worktreePath, params.pipelineStatePath),
  );
}
