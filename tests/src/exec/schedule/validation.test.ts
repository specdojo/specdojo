import { mkdtempSync, readFileSync, rmSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  findEditedGeneratedTrackWarnings,
  findEditedGeneratedTracks,
  findStaleGeneratedTracks,
  findStaleGeneratedTrackWarnings,
} from "../../../../src/exec/schedule/schedule.js";
import { buildScheduleTrack } from "../../../../src/schedule/build.js";
import { createScheduleTrackDocument } from "../../../../src/schedule/schedule.js";
import { dump, load } from "../../../../src/shared/yaml.js";

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

describe("findEditedGeneratedTracks", () => {
  let dir: string;
  let strategyPath: string;
  let trackPath: string;

  function writeStrategy(phaseOverrides: unknown[] | undefined): void {
    writeFileSync(
      join(dir, "catalog.yaml"),
      dump({
        groups: [
          {
            name: "sample",
            deliverables: [
              { local_id: "doc", name: "Document", kind: "work", path: "doc.md", depends_on: [] },
            ],
          },
        ],
      }),
      "utf8",
    );
    writeFileSync(
      strategyPath,
      dump({
        kind: "strategy",
        id: "prj-test:sch-strategy-launch",
        type: "project",
        status: "draft",
        track: "launch",
        scope: {
          catalogs: [{ id: "prj-test:catalog", path: "/catalog.yaml" }],
          include_kinds: ["work"],
        },
        phase_sets: {
          review: [
            {
              id: "review",
              name: "Review",
              task_suffix: "090",
              duration_days: 1,
              agent: { executor: "phase-executor" },
            },
          ],
        },
        default_phase_sets: ["review"],
        owner_rules: [
          {
            local_ids: ["doc"],
            owner: "ARC",
            ...(phaseOverrides ? { phase_overrides: phaseOverrides } : {}),
          },
        ],
      }),
      "utf8",
    );
  }

  // Write the track exactly as `schedule build` would, then make it newer than the strategy so
  // only the content comparison (not the mtime rule) can flag it.
  function writeGeneratedTrack(): void {
    const result = buildScheduleTrack(strategyPath, dir);
    expect(result.errors).toEqual([]);
    const doc = createScheduleTrackDocument({
      projectId: result.projectId,
      track: result.track,
      status: result.status,
      startDate: result.startDate,
      tasks: result.tasks,
    });
    writeFileSync(trackPath, dump(doc), "utf8");
    touchTrackNewer();
  }

  function touchTrackNewer(): void {
    utimesSync(strategyPath, new Date("2026-01-01T00:00:00Z"), new Date("2026-01-01T00:00:00Z"));
    utimesSync(trackPath, new Date("2026-01-02T00:00:00Z"), new Date("2026-01-02T00:00:00Z"));
  }

  function editTrackAgent(executor: string): void {
    const doc = load(readFileSync(trackPath, "utf8")) as { tasks: Array<Record<string, unknown>> };
    doc.tasks[0].agent = { executor };
    writeFileSync(trackPath, dump(doc), "utf8");
    touchTrackNewer();
  }

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "specdojo-exec-edited-track-"));
    strategyPath = join(dir, "sch-strategy-launch.yaml");
    trackPath = join(dir, "sch-track-launch.yaml");
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("reports nothing for a track that matches the strategy rebuild", () => {
    writeStrategy(undefined);
    writeGeneratedTrack();

    expect(findEditedGeneratedTracks(dir, dir)).toEqual([]);
    expect(findEditedGeneratedTrackWarnings(dir, dir)).toEqual([]);
  });

  it("reports nothing for a track rebuilt from a strategy with phase_overrides", () => {
    writeStrategy([{ phase: "review", agent: { executor: "override-executor" } }]);
    writeGeneratedTrack();

    expect(findEditedGeneratedTracks(dir, dir)).toEqual([]);
  });

  it("reports the task and field of an agent edited directly into the track", () => {
    writeStrategy(undefined);
    writeGeneratedTrack();
    editTrackAgent("edited-executor");

    expect(findEditedGeneratedTracks(dir, dir)).toEqual([
      {
        track: "launch",
        strategyFile: strategyPath,
        trackFile: trackPath,
        differences: ["doc-090 phase_set=review: agent"],
      },
    ]);
  });

  it("names the track, the differing item and the rebuild command in the warning", () => {
    writeStrategy([{ phase: "review", agent: { executor: "override-executor" } }]);
    writeGeneratedTrack();
    editTrackAgent("phase-executor");

    const [warning] = findEditedGeneratedTrackWarnings(dir, dir);

    expect(warning).toContain("sch-track-launch.yaml (track launch)");
    expect(warning).toContain("doc-090 phase_set=review: agent");
    expect(warning).toContain("Run: specdojo schedule build --track launch --force");
  });

  it("leaves a track older than its strategy to the stale-track warning", () => {
    writeStrategy(undefined);
    writeGeneratedTrack();
    editTrackAgent("edited-executor");
    utimesSync(trackPath, new Date("2025-12-31T00:00:00Z"), new Date("2025-12-31T00:00:00Z"));

    expect(findEditedGeneratedTracks(dir, dir)).toEqual([]);
    expect(findStaleGeneratedTracks(dir).map((stale) => stale.reason)).toEqual(["outdated"]);
  });
});
