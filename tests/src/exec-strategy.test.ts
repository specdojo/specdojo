import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  buildPhaseModeIndex,
  resolveAgentAssignment,
  resolveAgentPipeline,
  resolveApproach,
  resolveOwnerForLocalId,
  resolveTaskExecution,
  resolveTaskMode,
  resolveTaskProficiency,
} from "../../src/exec-strategy.js";

describe("resolveOwnerForLocalId", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "specdojo-strategy-"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  function writeStrategy(name: string, body: string): void {
    writeFileSync(join(dir, name), body, "utf8");
  }

  it("resolves the owner whose owner_rule covers the local_id", () => {
    writeStrategy(
      "sch-strategy-launch.yaml",
      [
        "kind: strategy",
        "track: launch",
        "owner_rules:",
        "  - local_ids: [prj-overview]",
        "    owner: BA",
        "",
      ].join("\n"),
    );

    expect(resolveOwnerForLocalId(dir, "prj-overview", "launch")).toBe("BA");
  });

  it("resolves without a track when a single strategy file covers the local_id", () => {
    writeStrategy(
      "sch-strategy-launch.yaml",
      [
        "kind: strategy",
        "track: launch",
        "owner_rules:",
        "  - local_ids: [prj-charter]",
        "    owner: PO",
        "",
      ].join("\n"),
    );

    expect(resolveOwnerForLocalId(dir, "prj-charter")).toBe("PO");
  });

  it("ignores strategy files whose track does not match the requested track", () => {
    writeStrategy(
      "sch-strategy-launch.yaml",
      [
        "kind: strategy",
        "track: launch",
        "owner_rules:",
        "  - local_ids: [pm-plan]",
        "    owner: PM",
        "",
      ].join("\n"),
    );
    writeStrategy(
      "sch-strategy-recovery.yaml",
      [
        "kind: strategy",
        "track: recovery",
        "owner_rules:",
        "  - local_ids: [pm-plan]",
        "    owner: ARC",
        "",
      ].join("\n"),
    );

    expect(resolveOwnerForLocalId(dir, "pm-plan", "recovery")).toBe("ARC");
    expect(resolveOwnerForLocalId(dir, "pm-plan", "launch")).toBe("PM");
  });

  it("returns undefined when no owner_rule covers the local_id", () => {
    writeStrategy(
      "sch-strategy-launch.yaml",
      [
        "kind: strategy",
        "track: launch",
        "owner_rules:",
        "  - local_ids: [prj-overview]",
        "    owner: BA",
        "",
      ].join("\n"),
    );

    expect(resolveOwnerForLocalId(dir, "unknown-deliverable", "launch")).toBeUndefined();
  });
});

describe("cross-deliverable pass metadata", () => {
  it("resolves task metadata by generated task id without a primary local_id", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-strategy-cross-"));
    try {
      writeFileSync(
        join(dir, "sch-strategy-launch.yaml"),
        [
          "kind: strategy",
          "track: launch",
          "phase_sets:",
          "  first:",
          "    - id: draft",
          "      task_suffix: '010'",
          "owner_rules: []",
          "cross_deliverable_passes:",
          "  - id: project-definition-dedup",
          "    task_suffix: '060'",
          "    execution: agent",
          "    mode: edit",
          "    approach: cross-deliverable-dedup",
          "    proficiency: expert",
          "",
        ].join("\n"),
        "utf8",
      );

      const index = buildPhaseModeIndex(dir);
      const taskId = "T-LAUNCH-project-definition-dedup-060";
      expect(resolveTaskMode(undefined, taskId, index, "060")).toBe("edit");
      expect(resolveTaskExecution(undefined, taskId, index, "060")).toBe("agent");
      expect(resolveApproach(undefined, taskId, index, "060")).toBe("cross-deliverable-dedup");
      expect(resolveTaskProficiency(undefined, taskId, index, "060")).toBe("expert");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe("agent pipeline metadata", () => {
  it("resolves the executor/reporter stages declared on the selected phase", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-strategy-pipeline-"));
    try {
      writeFileSync(
        join(dir, "sch-strategy-launch.yaml"),
        [
          "kind: strategy",
          "track: launch",
          "phase_sets:",
          "  first:",
          "    - id: draft",
          "      task_suffix: '010'",
          "      agent_pipeline:",
          "        stages:",
          "          - stage_role: executor",
          "            capabilities: [exec]",
          "            proficiency: expert",
          "          - stage_role: reporter",
          "            proficiency: normal",
          "owner_rules:",
          "  - local_ids: [doc]",
          "    owner: ARC",
          "    phase_set: first",
          "",
        ].join("\n"),
        "utf8",
      );

      const index = buildPhaseModeIndex(dir);
      expect(resolveAgentPipeline("doc", "T-LAUNCH-doc-010", index, "010", "first")).toEqual({
        stages: [
          { stage_role: "executor", capabilities: ["exec"], proficiency: "expert" },
          { stage_role: "reporter", proficiency: "normal" },
        ],
      });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("resolves a phase assignment and a per-deliverable override without dropping proficiency", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-strategy-agent-"));
    try {
      writeFileSync(
        join(dir, "sch-strategy-launch.yaml"),
        [
          "kind: strategy",
          "track: launch",
          "phase_sets:",
          "  review-pass:",
          "    - id: review",
          "      task_suffix: '090'",
          "      proficiency: expert",
          "      agent:",
          "        executor: codex-expert-review-executor",
          "        reporter: gemma-reporter",
          "owner_rules:",
          "  - local_ids: [doc]",
          "    owner: ARC",
          "    phase_set: review-pass",
          "  - local_ids: [special]",
          "    owner: ARC",
          "    phase_set: review-pass",
          "    phase_overrides:",
          "      - phase: review",
          "        agent:",
          "          executor: claude-expert-review-executor",
          "",
        ].join("\n"),
        "utf8",
      );

      const index = buildPhaseModeIndex(dir);
      expect(resolveTaskProficiency("doc", "T-LAUNCH-doc-090", index, "090", "review-pass")).toBe(
        "expert",
      );
      expect(
        resolveAgentAssignment("doc", "T-LAUNCH-doc-090", index, "090", "review-pass"),
      ).toEqual({
        executor: "codex-expert-review-executor",
        reporter: "gemma-reporter",
      });
      expect(
        resolveAgentAssignment("special", "T-LAUNCH-special-090", index, "090", "review-pass"),
      ).toEqual({ executor: "claude-expert-review-executor" });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("keeps same-named phase sets isolated by track", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-strategy-track-scope-"));
    try {
      for (const [track, localId, proficiency, executor] of [
        ["alpha", "alpha-doc", "expert", "alpha-executor"],
        ["beta", "beta-doc", "normal", "beta-executor"],
      ] as const) {
        writeFileSync(
          join(dir, `sch-strategy-${track}.yaml`),
          [
            "kind: strategy",
            `track: ${track}`,
            "phase_sets:",
            "  review-pass:",
            "    - id: review",
            "      task_suffix: '090'",
            `      proficiency: ${proficiency}`,
            "      agent:",
            `        executor: ${executor}`,
            "owner_rules:",
            `  - local_ids: [${localId}]`,
            "    owner: ARC",
            "    phase_set: review-pass",
            "",
          ].join("\n"),
          "utf8",
        );
      }

      const index = buildPhaseModeIndex(dir);
      expect(
        resolveTaskProficiency("alpha-doc", "T-ALPHA-alpha-doc-090", index, "090", "review-pass"),
      ).toBe("expert");
      expect(
        resolveAgentAssignment("alpha-doc", "T-ALPHA-alpha-doc-090", index, "090", "review-pass"),
      ).toEqual({ executor: "alpha-executor" });
      expect(
        resolveAgentAssignment("beta-doc", "T-BETA-beta-doc-090", index, "090", "review-pass"),
      ).toEqual({ executor: "beta-executor" });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
