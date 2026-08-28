import { mkdtempSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  findStaleGeneratedTracks,
  findStaleGeneratedTrackWarnings,
} from "../../src/exec-schedule.js";

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
        "Run: specdojo schedule build --track launch --force before exec refresh.",
    );
  });

  it("returns missing and outdated tracks in deterministic track order", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-exec-validation-"));
    const alphaStrategy = join(dir, "sch-strategy-alpha.yaml");
    const betaStrategy = join(dir, "sch-strategy-beta.yaml");
    const betaTrack = join(dir, "sch-track-beta.yaml");

    writeFileSync(betaStrategy, "kind: strategy\ntrack: beta\n", "utf8");
    writeFileSync(betaTrack, "kind: track\ntrack: beta\ntasks: []\n", "utf8");
    writeFileSync(alphaStrategy, "kind: strategy\ntrack: alpha\n", "utf8");

    const oldTime = new Date("2026-01-01T00:00:00Z");
    const newTime = new Date("2026-01-02T00:00:00Z");
    utimesSync(betaTrack, oldTime, oldTime);
    utimesSync(betaStrategy, newTime, newTime);

    expect(findStaleGeneratedTracks(dir)).toEqual([
      {
        track: "alpha",
        strategyFile: alphaStrategy,
        reason: "missing",
      },
      {
        track: "beta",
        strategyFile: betaStrategy,
        trackFile: betaTrack,
        reason: "outdated",
      },
    ]);
  });

  it("returns no stale track or warning when the generated track is current", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-exec-validation-"));
    const strategyPath = join(dir, "sch-strategy-launch.yaml");
    const trackPath = join(dir, "sch-track-launch.yaml");

    writeFileSync(strategyPath, "kind: strategy\ntrack: launch\n", "utf8");
    writeFileSync(trackPath, "kind: track\ntrack: launch\ntasks: []\n", "utf8");

    const oldTime = new Date("2026-01-01T00:00:00Z");
    const newTime = new Date("2026-01-02T00:00:00Z");
    utimesSync(strategyPath, oldTime, oldTime);
    utimesSync(trackPath, newTime, newTime);

    expect(findStaleGeneratedTracks(dir)).toEqual([]);
    expect(findStaleGeneratedTrackWarnings(dir)).toEqual([]);
  });
});
