import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import yaml from "js-yaml";
import { describe, expect, it } from "vitest";
import { buildInitialStateFromStrategy } from "../../src/exec-schedule-initial.js";
import { buildScheduleIndex } from "../../src/exec-schedule-index.js";
import { buildScheduleTrack } from "../../src/schedule-build.js";

function writeCatalog(dir: string): void {
  writeFileSync(
    join(dir, "catalog.yaml"),
    yaml.dump({
      groups: [
        {
          name: "sample",
          deliverables: [
            {
              local_id: "doc",
              name: "Document",
              kind: "work",
              path: "doc.md",
              depends_on: [],
            },
          ],
        },
      ],
    }),
    "utf8",
  );
}

function writeTrack(dir: string, tasks: unknown[]): void {
  writeFileSync(
    join(dir, "sch-track-test.yaml"),
    yaml.dump({
      kind: "track",
      id: "prj-test:sch-track-test",
      type: "project",
      status: "draft",
      version: 1,
      project_id: "prj-test",
      track: "test",
      settings: {},
      tasks,
    }),
    "utf8",
  );
}

describe("buildScheduleTrack phase set repetition", () => {
  it("keeps catalog dependencies inside the earliest shared phase gate", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-schedule-gate-dependency-"));
    try {
      writeFileSync(
        join(dir, "catalog.yaml"),
        yaml.dump({
          groups: [
            {
              name: "sample",
              deliverables: [
                { local_id: "a", name: "A", kind: "work", path: "a.md", depends_on: [] },
                { local_id: "b", name: "B", kind: "work", path: "b.md", depends_on: ["a"] },
              ],
            },
          ],
        }),
        "utf8",
      );
      const strategyPath = join(dir, "sch-strategy-test.yaml");
      writeFileSync(
        strategyPath,
        yaml.dump({
          kind: "strategy",
          id: "prj-test:sch-strategy-test",
          type: "project",
          status: "draft",
          track: "test",
          scope: {
            catalogs: [{ id: "prj-test:catalog", path: "/catalog.yaml" }],
            include_kinds: ["work"],
          },
          phase_sets: {
            first: [{ id: "draft", name: "Draft", task_suffix: "010", duration_days: 1 }],
            align: [{ id: "align", name: "Align", task_suffix: "020", duration_days: 1 }],
            review: [{ id: "review", name: "Review", task_suffix: "030", duration_days: 1 }],
          },
          default_phase_sets: ["first", "align", "review"],
          owner_rules: [{ local_ids: ["a", "b"], owner: "BA" }],
          phase_gates: [
            {
              id: "G-TEST-first",
              name: "First complete",
              after_phase_sets: ["first"],
              owner: "BA",
              scope: { local_ids: ["a", "b"] },
            },
            {
              id: "G-TEST-align",
              name: "Align complete",
              after_phase_sets: ["align"],
              owner: "BA",
              scope: { local_ids: ["a", "b"] },
            },
          ],
        }),
        "utf8",
      );

      const result = buildScheduleTrack(strategyPath, dir);

      expect(result.errors).toEqual([]);
      const bFirst = result.tasks.find(
        (task) => task.local_id === "b" && task.phase_suffix === "010",
      );
      expect(bFirst?.depends_on).toEqual(["T-TEST-a-010"]);
      expect(
        result.tasks.find((task) => task.local_id === "a" && task.phase_suffix === "020")
          ?.depends_on,
      ).toContain("G-TEST-first");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("expands cycles and iterations and creates a gate for each cycle", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-schedule-repeat-"));
    try {
      writeCatalog(dir);
      const strategyPath = join(dir, "sch-strategy-test.yaml");
      writeFileSync(
        strategyPath,
        yaml.dump({
          kind: "strategy",
          id: "prj-test:sch-strategy-test",
          type: "project",
          status: "draft",
          track: "test",
          scope: {
            catalogs: [{ id: "prj-test:catalog", path: "/catalog.yaml" }],
            include_kinds: ["work"],
          },
          phase_sets: {
            first: [{ id: "draft", name: "Draft", task_suffix: "010", duration_days: 1 }],
            final: [{ id: "finalize", name: "Finalize", task_suffix: "020", duration_days: 1 }],
            review: [{ id: "review", name: "Review", task_suffix: "030", duration_days: 1 }],
          },
          default_phase_sets: {
            cycles: 2,
            sequence: [
              { phase_set: "first", iterations: 2 },
              { phase_set: "final" },
              { phase_set: "review" },
            ],
          },
          owner_rules: [{ local_ids: ["doc"], owner: "BA" }],
          phase_gates: [
            {
              id: "G-TEST-first",
              name: "First complete",
              after_phase_sets: ["first"],
              owner: "BA",
              scope: { local_ids: ["doc"] },
            },
            {
              id: "G-TEST-final",
              name: "Final complete",
              after_phase_sets: ["final"],
              owner: "BA",
              scope: { local_ids: ["doc"] },
            },
          ],
        }),
        "utf8",
      );

      const result = buildScheduleTrack(strategyPath, dir);
      expect(result.errors).toEqual([]);
      expect(result.tasks).toHaveLength(8);
      expect(result.tasks.map((task) => [task.phase_suffix, task.cycle, task.iteration])).toEqual([
        ["010", 1, 1],
        ["010", 1, 2],
        ["020", 1, undefined],
        ["030", 1, undefined],
        ["010", 2, 1],
        ["010", 2, 2],
        ["020", 2, undefined],
        ["030", 2, undefined],
      ]);
      expect(result.tasks[1].depends_on).toEqual(["T-TEST-doc-010-C01-I01"]);
      expect(result.tasks[2].depends_on).toEqual(["T-TEST-doc-010-C01-I02", "G-TEST-first-C01"]);
      expect(result.tasks[3].depends_on).toEqual(["T-TEST-doc-020-C01", "G-TEST-final-C01"]);
      expect(result.tasks[4].depends_on).toEqual(["T-TEST-doc-030-C01"]);
      expect(result.tasks[6].depends_on).toEqual(["T-TEST-doc-010-C02-I02", "G-TEST-first-C02"]);
      expect(result.tasks[7].depends_on).toEqual(["T-TEST-doc-020-C02", "G-TEST-final-C02"]);
      expect(result.milestones.map((milestone) => milestone.id)).toEqual([
        "G-TEST-first-C01",
        "G-TEST-first-C02",
        "G-TEST-final-C01",
        "G-TEST-final-C02",
      ]);

      writeTrack(dir, result.tasks);
      const schedule = buildScheduleIndex(dir);
      expect(schedule.nodes.get("T-TEST-doc-010-C01-I02")).toMatchObject({
        phase_suffix: "010",
        phase_set: "first",
        phase_id: "draft",
        cycle: 1,
        iteration: 2,
      });
      expect(schedule.nodes.has("T-TEST-doc-030-C02")).toBe(true);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("keeps existing task IDs for the array shorthand", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-schedule-compatible-"));
    try {
      writeCatalog(dir);
      const strategyPath = join(dir, "sch-strategy-test.yaml");
      writeFileSync(
        strategyPath,
        yaml.dump({
          kind: "strategy",
          id: "prj-test:sch-strategy-test",
          type: "project",
          status: "draft",
          track: "test",
          scope: {
            catalogs: [{ id: "prj-test:catalog", path: "/catalog.yaml" }],
            include_kinds: ["work"],
          },
          phase_sets: {
            first: [{ id: "draft", name: "Draft", task_suffix: "010", duration_days: 1 }],
            final: [{ id: "finalize", name: "Finalize", task_suffix: "020", duration_days: 1 }],
          },
          default_phase_sets: ["first", "final"],
          owner_rules: [{ local_ids: ["doc"], owner: "BA" }],
        }),
        "utf8",
      );

      const result = buildScheduleTrack(strategyPath, dir);
      expect(result.errors).toEqual([]);
      expect(result.tasks.every((task) => task.cycle === undefined)).toBe(true);
      expect(result.tasks.every((task) => task.iteration === undefined)).toBe(true);
      writeTrack(dir, result.tasks);
      const schedule = buildScheduleIndex(dir);
      expect(schedule.nodes.has("T-TEST-doc-010")).toBe(true);
      expect(schedule.nodes.has("T-TEST-doc-020")).toBe(true);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("applies completed_through to an exact cycle and iteration", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-schedule-initial-repeat-"));
    try {
      writeCatalog(dir);
      const strategyPath = join(dir, "sch-strategy-test.yaml");
      writeFileSync(
        strategyPath,
        yaml.dump({
          kind: "strategy",
          id: "prj-test:sch-strategy-test",
          type: "project",
          status: "draft",
          track: "test",
          scope: {
            catalogs: [{ id: "prj-test:catalog", path: "/catalog.yaml" }],
            include_kinds: ["work"],
          },
          phase_sets: {
            first: [{ id: "draft", name: "Draft", task_suffix: "010", duration_days: 1 }],
            final: [{ id: "finalize", name: "Finalize", task_suffix: "020", duration_days: 1 }],
          },
          default_phase_sets: {
            cycles: 2,
            sequence: [{ phase_set: "first", iterations: 2 }, { phase_set: "final" }],
          },
          owner_rules: [{ local_ids: ["doc"], owner: "BA" }],
          initial_state: {
            completed_deliverables: [
              {
                local_id: "doc",
                completed_through: {
                  phase_set: "first",
                  phase: "draft",
                  cycle: 1,
                  iteration: 2,
                },
                completed_on: "2026-01-01",
                by: "tester",
              },
            ],
          },
        }),
        "utf8",
      );

      const result = buildScheduleTrack(strategyPath, dir);
      expect(result.errors).toEqual([]);
      expect(result.tasks).toHaveLength(6);
      writeTrack(dir, result.tasks);
      const schedule = buildScheduleIndex(dir);
      const initial = buildInitialStateFromStrategy(dir, schedule);
      expect(Object.keys(initial).sort()).toEqual([
        "T-TEST-doc-010-C01-I01",
        "T-TEST-doc-010-C01-I02",
      ]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe("buildScheduleTrack status propagation", () => {
  function writeStrategy(dir: string, status: string | undefined): string {
    const strategyPath = join(dir, "sch-strategy-test.yaml");
    const doc: Record<string, unknown> = {
      kind: "strategy",
      id: "prj-test:sch-strategy-test",
      type: "project",
      track: "test",
      scope: {
        catalogs: [{ id: "prj-test:catalog", path: "/catalog.yaml" }],
        include_kinds: ["work"],
      },
      phase_sets: {
        first: [{ id: "draft", name: "Draft", task_suffix: "010", duration_days: 1 }],
      },
      default_phase_sets: ["first"],
      owner_rules: [{ local_ids: ["doc"], owner: "BA" }],
    };
    if (status !== undefined) doc.status = status;
    writeFileSync(strategyPath, yaml.dump(doc), "utf8");
    return strategyPath;
  }

  it("carries the strategy status into the build result", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-schedule-status-"));
    try {
      writeCatalog(dir);
      const strategyPath = writeStrategy(dir, "ready");

      const result = buildScheduleTrack(strategyPath, dir);

      expect(result.errors).toEqual([]);
      expect(result.status).toBe("ready");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("falls back to draft when the strategy omits status", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-schedule-status-default-"));
    try {
      writeCatalog(dir);
      const strategyPath = writeStrategy(dir, undefined);

      const result = buildScheduleTrack(strategyPath, dir);

      expect(result.errors).toEqual([]);
      expect(result.status).toBe("draft");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe("buildScheduleIndex start_date precedence", () => {
  function writeDefaults(dir: string, defaultStartDate: string): void {
    writeFileSync(
      join(dir, "sch-defaults.yaml"),
      yaml.dump({
        kind: "defaults",
        id: "prj-test:sch-defaults",
        type: "project",
        status: "ready",
        version: 1,
        calendar: { timezone: "Asia/Tokyo", work_hours_per_day: 8 },
        settings: { default_start_date: defaultStartDate },
      }),
      "utf8",
    );
  }

  function writeTrackWithStartDate(dir: string, startDate: string | null): void {
    writeFileSync(
      join(dir, "sch-track-test.yaml"),
      yaml.dump({
        kind: "track",
        id: "prj-test:sch-track-test",
        type: "project",
        status: "ready",
        version: 1,
        project_id: "prj-test",
        track: "test",
        settings: startDate !== null ? { start_date: startDate } : {},
        tasks: [
          { id: "T-TEST-doc-010", name: "Doc", duration_days: 1, depends_on: [], owner: "BA" },
        ],
      }),
      "utf8",
    );
  }

  it("prefers the track's explicit start_date over an earlier default_start_date", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-schedule-startdate-"));
    try {
      writeDefaults(dir, "2026-05-24");
      writeTrackWithStartDate(dir, "2026-06-15");

      const schedule = buildScheduleIndex(dir);

      expect(schedule.start_date).toBe("2026-06-15");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("falls back to default_start_date when no track specifies start_date", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-schedule-startdate-fallback-"));
    try {
      writeDefaults(dir, "2026-05-24");
      writeTrackWithStartDate(dir, null);

      const schedule = buildScheduleIndex(dir);

      expect(schedule.start_date).toBe("2026-05-24");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
