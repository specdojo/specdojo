import { mkdtempSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { findStaleGeneratedTrackWarnings } from "../../src/exec-schedule.js";

describe("validateAll schedule generation warnings", () => {
  it("warns when a strategy is newer than its generated track", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-exec-validation-"));
    const strategyPath = join(dir, "sch-strategy-launch.yaml");
    const trackPath = join(dir, "sch-track-launch.yaml");

    writeFileSync(strategyPath, "kind: strategy\ntrack: launch\n", "utf8");
    writeFileSync(
      trackPath,
      [
        "kind: track",
        "track: launch",
        "tasks:",
        "  - id: T-LAUNCH-example-010",
        "    duration_days: 1",
        "    depends_on: []",
        "",
      ].join("\n"),
      "utf8",
    );

    const oldTime = new Date("2026-01-01T00:00:00Z");
    const newTime = new Date("2026-01-02T00:00:00Z");
    utimesSync(trackPath, oldTime, oldTime);
    utimesSync(strategyPath, newTime, newTime);

    const warnings = findStaleGeneratedTrackWarnings(dir);

    expect(warnings).toContain(
      "sch-strategy-launch.yaml is newer than sch-track-launch.yaml. " +
        "Run: specdojo schedule build --track launch --force before exec build.",
    );
  });
});
