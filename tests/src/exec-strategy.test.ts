import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { resolveOwnerForLocalId } from "../../src/exec-strategy.js";

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
