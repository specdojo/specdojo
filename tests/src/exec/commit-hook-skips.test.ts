import { describe, expect, it } from "vitest";
import {
  integrationCommitHookExclusions,
  lefthookExcludeEnvironment,
  resolveCommitHookSkips,
} from "../../../src/exec/commit-hook-skips.js";
import type { EvidenceValidation } from "../../../src/exec/evidence.js";

const parentValidations = ["typecheck", "test-unit", "test-integration"];

function runner(id: string, status: EvidenceValidation["status"]): EvidenceValidation {
  return { id, source: "runner", command: `npm run ${id}`, status, summary: status };
}

describe("resolveCommitHookSkips", () => {
  it("accepts hooks covered by configured parent validations", () => {
    expect(
      resolveCommitHookSkips(
        [{ hook: "test", covered_by: ["test-unit", "test-integration"] }],
        parentValidations,
      ),
    ).toEqual([{ hook: "test", covered_by: ["test-unit", "test-integration"] }]);
  });

  it("rejects labels missing from parent_validations and hook names unsafe for LEFTHOOK_EXCLUDE", () => {
    expect(() =>
      resolveCommitHookSkips([{ hook: "test", covered_by: ["lint-ts"] }], parentValidations),
    ).toThrow(/covered_by is not in pipeline\.parent_validations: lint-ts/);
    expect(() =>
      resolveCommitHookSkips([{ hook: "a,b", covered_by: ["typecheck"] }], parentValidations),
    ).toThrow(/\.hook must match/);
    expect(() =>
      resolveCommitHookSkips([{ hook: "test", covered_by: [] }], parentValidations),
    ).toThrow(/covered_by must be a non-empty array/);
  });
});

describe("integrationCommitHookExclusions", () => {
  const skips = [
    { hook: "typecheck", covered_by: ["typecheck"] },
    { hook: "test", covered_by: ["test-unit", "test-integration"] },
  ];

  it("skips a hook only when every covering parent validation passed", () => {
    const validations = [
      runner("typecheck", "passed"),
      runner("test-unit", "passed"),
      runner("test-integration", "failed"),
    ];

    expect(integrationCommitHookExclusions(skips, validations)).toEqual(["typecheck"]);
  });

  it("keeps a hook whose validation was skipped by change type or reported by the executor", () => {
    const validations: EvidenceValidation[] = [
      runner("typecheck", "not_applicable"),
      { ...runner("test-unit", "passed"), source: "executor" },
      runner("test-integration", "passed"),
    ];

    expect(integrationCommitHookExclusions(skips, validations)).toEqual([]);
  });
});

describe("lefthookExcludeEnvironment", () => {
  it("merges with an inherited LEFTHOOK_EXCLUDE and omits the variable when nothing is skipped", () => {
    expect(lefthookExcludeEnvironment(["test", "typecheck"], "format, test")).toEqual({
      LEFTHOOK_EXCLUDE: "format,test,typecheck",
    });
    expect(lefthookExcludeEnvironment([], "format")).toBeUndefined();
  });
});
