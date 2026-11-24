import { describe, expect, it } from "vitest";
import { classifyStall, type StallObservation } from "../../../src/exec/watch-scan-classify.js";

const RUN = "docs/ja/projects/prj-0001/execution/runs/schedule/T-X/T-X-20261113T155150Z-4c2aa06a";

function observation(overrides: Partial<StallObservation>): StallObservation {
  return {
    kind: "schedule-task",
    id: "T-X",
    state: "blocked",
    since: "2026-11-13T16:14:18Z",
    logs: [],
    ...overrides,
  };
}

// 2026-11-13〜14 の夜に止まった実例を、記録の文言のまま分類の場面にする。
describe("classifyStall with the 2026-11-13 to 14 night", () => {
  it("classifies the codex usage limit from the block event meta", () => {
    const actual = classifyStall(
      observation({
        id: "T-KATA-WAVE-1-dct-index-040",
        state: "deferred",
        message: {
          source: "events/20261113T142356Z_block.json",
          text: "quota_exhausted reached; resume_at=2026-11-13T14:37:00.000Z",
        },
        meta: {
          limit_deferred: "true",
          limit_kind: "quota_exhausted",
          limit_resume_at: "2026-11-13T14:37:00.000Z",
        },
      }),
    );

    expect(actual).toMatchObject({
      category: "usage_limit",
      detail: "quota_exhausted",
      basis: {
        source: "events/20261113T142356Z_block.json",
        excerpt: "limit_kind=quota_exhausted limit_resume_at=2026-11-13T14:37:00.000Z",
      },
    });
  });

  it("classifies a register wait reason that only says the rate limit was reached", () => {
    const actual = classifyStall(
      observation({
        kind: "register-item",
        id: "PJR-AAAA",
        state: "waiting",
        message: { source: "events/pjr-aaaa.yaml", text: "rate limit reached" },
      }),
    );

    expect(actual.category).toBe("usage_limit");
    expect(actual.basis.excerpt).toBe("rate limit reached");
  });

  it("classifies the missing kata menu entry from the failed test-unit log", () => {
    const actual = classifyStall(
      observation({
        id: "T-KATA-WAVE-1-bes-index-005",
        message: { source: "events/block.json", text: "parent validation failed: test-unit" },
        logs: [
          {
            source: `${RUN}/parent-validation-attempt-1-test-unit.log`,
            text: [
              "parent validation: test-unit",
              "exit code: 1",
              "timed out: no",
              " FAIL  tests/packages/docs-site/sidebar-kata.test.ts > specdojo sidebar kata menus > covers all non-deprecated rulebooks, recipes, samples, and templates",
            ].join("\n"),
          },
        ],
      }),
    );

    expect(actual).toMatchObject({
      category: "needs_decision",
      detail: "kata_rule",
      basis: { source: `${RUN}/parent-validation-attempt-1-test-unit.log` },
    });
    expect(actual.basis.excerpt).toContain("specdojo sidebar kata menus");
  });

  it("classifies changes left out of the commit from the integration failure", () => {
    const actual = classifyStall(
      observation({
        id: "T-KATA-WAVE-1-sf-index-005",
        message: {
          source: "events/block.json",
          text: "integration failed: uncommitted=1; log=docs/ja/projects/prj-0001/execution/runs/schedule/x/integrate.log",
        },
      }),
    );

    expect(actual).toMatchObject({ category: "needs_decision", detail: "out_of_commit_scope" });
  });

  it("classifies a hook that runs newer tests than the branch as needing a target sync", () => {
    const actual = classifyStall(
      observation({
        id: "T-KATA-WAVE-1-sysd-cross-cutting-policy-005",
        message: {
          source: "events/block.json",
          text: "project: git commit failed: test: error: unknown option '--reserve'; FAIL  |integration| tests/src/exec/pipeline-e2e.integration.test.ts",
        },
      }),
    );

    expect(actual).toMatchObject({ category: "needs_target_sync", detail: "target_ahead" });
    expect(actual.basis.excerpt).toContain("unknown option '--reserve'");
  });

  it("classifies a test timeout under load from the failed test-unit log", () => {
    const actual = classifyStall(
      observation({
        id: "T-KATA-WAVE-1-cnd-specdojo-070",
        message: { source: "events/block.json", text: "parent validation failed: test-unit" },
        logs: [
          {
            source: `${RUN}/parent-validation-attempt-1-test-unit.log`,
            text: [
              "exit code: 1",
              "timed out: no",
              " FAIL  tests/src/register/approach.test.ts > validateRegisterApproachTargets",
              "Error: Test timed out in 5000ms.",
            ].join("\n"),
          },
        ],
      }),
    );

    expect(actual).toMatchObject({
      category: "load_timeout",
      detail: "load_timeout",
      basis: { excerpt: "Error: Test timed out in 5000ms." },
    });
  });
});

describe("classifyStall rule order", () => {
  it("prefers the block message over the integrate log", () => {
    const actual = classifyStall(
      observation({
        message: {
          source: "events/block.json",
          text: "project: git commit failed: catalog-validate: ERROR: dct-business-model-bes.yaml: bes-index: based_on 'cdfd-overview'",
        },
        logs: [
          {
            source: `${RUN}/integrate.log`,
            text: "commit-scope: skipped non-target changes (left in worktree):",
          },
        ],
      }),
    );

    expect(actual.detail).toBe("kata_rule");
  });

  it("keeps a failure that needs a decision even when a timeout also appears", () => {
    const actual = classifyStall(
      observation({
        message: { source: "events/block.json", text: "parent validation failed: test-unit" },
        logs: [
          { source: "a.log", text: "Error: Test timed out in 5000ms." },
          { source: "b.log", text: "agent-config-write: protected configuration changes detected" },
        ],
      }),
    );

    expect(actual.detail).toBe("protected_config");
  });

  it("does not read a usage limit from the wording of a run log", () => {
    const actual = classifyStall(
      observation({
        message: { source: "events/block.json", text: "parent validation failed: test-unit" },
        logs: [
          { source: "a.log", text: " FAIL  tests/src/exec/limit.test.ts > rate limit reached" },
        ],
      }),
    );

    expect(actual).toMatchObject({ category: "needs_decision", detail: "validation_failure" });
  });

  it("does not take the timed out header of a log that did not time out", () => {
    const actual = classifyStall(
      observation({
        message: { source: "events/block.json", text: "parent validation failed: lint-md" },
        logs: [{ source: "a.log", text: "exit code: 1\ntimed out: no\nMD022 error" }],
      }),
    );

    expect(actual.detail).toBe("validation_failure");
  });
});

describe("classifyStall without a matching rule", () => {
  it("treats a block without a pipeline stage as a manual block", () => {
    const actual = classifyStall(
      observation({
        message: { source: "events/block.json", text: "差し戻し: 完了条件が未充足のため" },
        manual: true,
      }),
    );

    expect(actual).toMatchObject({ category: "needs_decision", detail: "manual_block" });
  });

  it("names the stopped queue step when the summary gives no reason", () => {
    const actual = classifyStall(
      observation({
        kind: "queue",
        id: "morning-a-2026-11-22",
        state: "stopped",
        message: {
          source: "queues/morning-a-2026-11-22.json",
          text: "step 2 (exec-run): specdojo exec run --register PJR-QTZ7\nstep 2 failed: exit code 1",
        },
      }),
    );

    expect(actual).toMatchObject({
      category: "needs_decision",
      detail: "queue_step_failed",
      basis: { excerpt: "step 2 (exec-run): specdojo exec run --register PJR-QTZ7" },
    });
  });

  it("classifies a stale doing task as interrupted", () => {
    const actual = classifyStall(observation({ state: "doing", interrupted: true }));

    expect(actual).toMatchObject({ category: "interrupted", detail: "stale_doing" });
  });

  it("asks for a review decision on a register item in review", () => {
    const actual = classifyStall(
      observation({
        kind: "register-item",
        state: "review",
        message: { source: "events/pjr-aaaa.yaml", text: "ready for review" },
      }),
    );

    expect(actual).toMatchObject({ category: "needs_decision", detail: "review_pending" });
  });

  it("falls back to unknown with the message as the basis", () => {
    const actual = classifyStall(
      observation({ message: { source: "events/block.json", text: "something new" } }),
    );

    expect(actual).toMatchObject({
      category: "unknown",
      basis: { source: "events/block.json", excerpt: "something new" },
    });
  });
});
