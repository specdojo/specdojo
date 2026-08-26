import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildComparisonRecord,
  buildTrialBaseValidation,
  classifyReporterFailure,
  extractPlanRepoPaths,
  updateObjectiveMetrics,
} from "../../src/exec-trial.js";
import type { ExecEvidence } from "../../src/exec-evidence.js";
import { gitEnvironment } from "../../src/exec-worktree.js";

function git(cwd: string, ...args: string[]): string {
  return execFileSync("git", args, { cwd, encoding: "utf8", env: gitEnvironment() }).trim();
}

describe("exec trial comparison record", () => {
  it("pins one plan and prompt hash for every agent while assigning distinct worktrees", () => {
    const plan = "---\nspecdojo:\n  task_id: T-TEST-001\n---\n\nDo the task.\n";
    const prompt = `${plan}\nshared trial contract`;
    const record = buildComparisonRecord({
      comparisonId: "cmp-001",
      projectId: "prj-0001",
      taskId: "T-TEST-001",
      createdAt: "2026-08-26T00:00:00.000Z",
      baseCommit: "abc123",
      planPath: "docs/project/exec/plans/T-TEST-001-plan.md",
      planContent: plan,
      prompt,
      agents: ["agent-a", "agent-b"],
      reporter: "reporter-a",
      worktreeBase: "/tmp/trial-worktrees",
    });

    expect(record.plan.sha256).toBe(createHash("sha256").update(plan).digest("hex"));
    expect(record.plan.prompt_sha256).toBe(createHash("sha256").update(prompt).digest("hex"));
    expect(record.trials.map((trial) => trial.branch)).toEqual([
      "exec/prj-0001-trial-cmp-001-agent-a",
      "exec/prj-0001-trial-cmp-001-agent-b",
    ]);
    expect(new Set(record.trials.map((trial) => trial.worktree)).size).toBe(2);
    expect(record.trials.every((trial) => trial.reporter_agent === "reporter-a")).toBe(true);
    expect(record.reporter_mode).toBe("shared");
    expect(record.base).toMatchObject({
      requested_revision: "HEAD",
      resolved_commit: "abc123",
      head_commit_at_start: "abc123",
      base_is_ancestor_of_head: true,
      defaulted_to_head: true,
    });
  });

  it("separates objective metrics from empty human ratings", () => {
    const record = buildComparisonRecord({
      comparisonId: "cmp-002",
      projectId: "prj-0001",
      taskId: "T-TEST-002",
      createdAt: "2026-08-26T00:00:00.000Z",
      baseCommit: "def456",
      planPath: "plan.md",
      planContent: "plan",
      prompt: "prompt",
      agents: ["agent-a", "agent-b"],
      worktreeBase: "/tmp/trial-worktrees",
    });

    expect(record.trials[0].executor).toMatchObject({
      attempts: 0,
      duration_ms: null,
      files_changed: 0,
      validations_reported: 0,
      validations_passed: 0,
      validations_failed: 0,
      validations_not_run: 0,
    });
    expect(record.trials[0].parent_validation).toEqual({
      configured_ids: [],
      status: "not_configured",
      duration_ms: null,
      validations_passed: 0,
      validations_failed: 0,
      validations_not_run: 0,
    });
    expect(record.trials[0].subjective).toEqual({
      judgment_quality: null,
      writing_quality: null,
      scope_adherence: null,
      notes: "",
    });
    expect(record.agent_selection.policy).toBe("manual");
    expect(record.agent_selection.target).toBe("pm-members.yaml");
    expect(record.reporter_mode).toBe("none");
    expect(record.trials[0].reporter).toMatchObject({
      status: "not_run",
      format_attempts: 0,
      format_retries: 0,
      failure_category: null,
    });
  });

  it("separates executor validation reporting from runner-owned validations", () => {
    const record = buildComparisonRecord({
      comparisonId: "cmp-validations",
      projectId: "prj-0001",
      taskId: "T-TEST-VALIDATIONS",
      createdAt: "2026-08-26T00:00:00.000Z",
      baseCommit: "abc123",
      planPath: "plan.md",
      planContent: "plan",
      prompt: "prompt",
      agents: ["agent-a", "agent-b"],
      worktreeBase: "/tmp/trial-worktrees",
    });
    const evidence = {
      schema_version: 1,
      task_id: "T-TEST-VALIDATIONS",
      run_id: "run-1",
      stage: {
        role: "executor",
        actor: "agent-a",
        status: "succeeded",
        started_at: "2026-08-26T00:00:00.000Z",
        completed_at: "2026-08-26T00:01:00.000Z",
        exit_code: 0,
        attempts: 1,
      },
      changes: [],
      diff_summary: { files_changed: 0, summary: "" },
      validations: [
        { source: "executor", command: "npm run lint:ts", status: "passed", summary: "ok" },
        {
          source: "executor",
          command: "npm run lint:md",
          status: "not_run",
          summary: "No Markdown files changed.",
        },
        {
          id: "test-unit",
          source: "runner",
          command: "npm run test:unit",
          status: "passed",
          summary: "ok",
        },
      ],
      final_message: "done",
      log_refs: [],
    } satisfies ExecEvidence;

    updateObjectiveMetrics(record.trials[0], evidence, true);

    expect(record.trials[0].executor).toMatchObject({
      validations_reported: 2,
      validations_passed: 1,
      validations_failed: 0,
      validations_not_run: 1,
    });
    expect(record.trials[0].parent_validation).toMatchObject({
      validations_passed: 1,
      validations_failed: 0,
      validations_not_run: 0,
    });
  });

  it("records distinct executor/reporter pairs as end-to-end trials", () => {
    const record = buildComparisonRecord({
      comparisonId: "cmp-paired",
      projectId: "prj-0001",
      taskId: "T-TEST-003",
      createdAt: "2026-08-26T00:00:00.000Z",
      baseCommit: "123abc",
      planPath: "plan.md",
      planContent: "plan",
      prompt: "prompt",
      pairs: [
        { executor: "qwen-executor", reporter: "qwen-reporter" },
        { executor: "gemma-executor", reporter: "gemma-reporter" },
      ],
      worktreeBase: "/tmp/trial-worktrees",
    });

    expect(record.reporter_mode).toBe("paired");
    expect(record.trials.map((trial) => trial.trial_id)).toEqual([
      "qwen-executor-qwen-reporter",
      "gemma-executor-gemma-reporter",
    ]);
    expect(record.trials.map((trial) => trial.reporter_agent)).toEqual([
      "qwen-reporter",
      "gemma-reporter",
    ]);
  });

  it("records configured parent validations before a trial starts", () => {
    const record = buildComparisonRecord({
      comparisonId: "cmp-parent-validations",
      projectId: "prj-0001",
      taskId: "T-TEST-PARENT",
      createdAt: "2026-08-26T00:00:00.000Z",
      baseCommit: "abc123",
      planPath: "plan.md",
      planContent: "plan",
      prompt: "prompt",
      agents: ["agent-a", "agent-b"],
      worktreeBase: "/tmp/trial-worktrees",
      parentValidationIds: ["test-unit", "validate-schema"],
    });

    expect(record.trials[0].parent_validation).toMatchObject({
      configured_ids: ["test-unit", "validate-schema"],
      status: "not_run",
    });
  });

  it("extracts repository paths from a plan and classifies reporter failures", () => {
    const plan = [
      "Edit `src/exec-trial.ts:42` and [the guide](docs/ja/guide.md).",
      "Run `npm run typecheck`; do not read `.env` or `secrets/token`.",
    ].join("\n");

    expect(extractPlanRepoPaths(plan)).toEqual(["docs/ja/guide.md", "src/exec-trial.ts"]);
    expect(
      classifyReporterFailure(
        "failure",
        "reporter output invalid after 3 format attempts: invalid JSON",
      ),
    ).toBe("invalid_output");
    expect(classifyReporterFailure("failure", "agent exited with code 1")).toBe(
      "invocation_failure",
    );
    expect(classifyReporterFailure("rate_limit", "limited")).toBe("rate_limit");
  });

  it("checks plan path references against an isolated historical base", () => {
    const repo = mkdtempSync(join(tmpdir(), "specdojo-trial-base-"));
    try {
      git(repo, "init");
      mkdirSync(join(repo, "src"));
      writeFileSync(join(repo, "src/existing.ts"), "export {};\n", "utf8");
      git(repo, "add", "src/existing.ts");
      git(repo, "commit", "-m", "base");
      const baseCommit = git(repo, "rev-parse", "HEAD");

      mkdirSync(join(repo, "docs"));
      writeFileSync(join(repo, "docs/plan.md"), "plan\n", "utf8");
      git(repo, "add", "docs/plan.md");
      git(repo, "commit", "-m", "add plan");
      const headCommit = git(repo, "rev-parse", "HEAD");

      const validation = buildTrialBaseValidation({
        repoRoot: repo,
        requestedRevision: "HEAD^",
        resolvedCommit: baseCommit,
        headCommit,
        defaultedToHead: false,
        planPath: "docs/plan.md",
        planContent: "Use `src/existing.ts` and `src/missing.ts`.",
      });

      expect(validation).toMatchObject({
        resolved_commit: baseCommit,
        head_commit_at_start: headCommit,
        base_is_ancestor_of_head: true,
        plan_path_exists_at_base: false,
        compatible: false,
        missing_referenced_paths: ["src/missing.ts"],
      });
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });
});
