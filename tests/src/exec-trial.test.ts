import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { buildComparisonRecord } from "../../src/exec-trial.js";

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
      files_changed: 0,
      validations_passed: 0,
      validations_failed: 0,
    });
    expect(record.trials[0].subjective).toEqual({
      judgment_quality: null,
      writing_quality: null,
      scope_adherence: null,
      notes: "",
    });
    expect(record.agent_selection.policy).toBe("manual");
    expect(record.agent_selection.target).toBe("pm-members.yaml");
  });
});
