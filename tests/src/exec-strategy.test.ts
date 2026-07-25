import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  buildPhaseModeIndex,
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
