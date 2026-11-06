import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { aggregateRoutines } from "../../../src/dashboard/routines.js";
import { migrateRoutineStorage, routineStoragePaths } from "../../../src/routine/storage.js";
import { recordRoutineFailure } from "../../../src/routine/failure.js";
import { gitOutput } from "../../../src/shared/git.js";
import type { RoutineRunHistoryEntry } from "../../../src/routine/definition.js";

vi.mock("../../../src/shared/git.js", () => ({ gitOutput: vi.fn(() => "") }));

const directories: string[] = [];
afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
  for (const dir of directories.splice(0)) rmSync(dir, { recursive: true, force: true });
});

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "specdojo-routine-storage-"));
  directories.push(root);
  const repo = join(root, "repo");
  const routines = join(repo, "routines");
  mkdirSync(join(routines, "generated"), { recursive: true });
  vi.stubEnv("XDG_STATE_HOME", join(root, "state"));
  return { root, repo, routines };
}

const history: RoutineRunHistoryEntry = {
  version: 1,
  routine_id: "rtn-test",
  scheduled_for: "2026-11-07T00:00:00Z",
  started_at: "2026-11-07T00:00:01Z",
  completed_at: "2026-11-07T00:00:02Z",
  result: "failure",
  job_run_ids: [],
  reason: "command failed",
};

describe("routine machine-local storage", () => {
  it("keeps state, history and locks outside docs and isolates routine trees", () => {
    const { root, repo, routines } = fixture();
    const paths = routineStoragePaths(routines, repo);
    for (const file of [paths.statePath, paths.runsPath, paths.lockPath]) {
      expect(relative(join(root, "state"), file).startsWith("..")).toBe(false);
      expect(file.startsWith(repo)).toBe(false);
      expect(existsSync(file)).toBe(false);
    }
    expect(routineStoragePaths(join(repo, "other-routines"), repo).statePath).not.toBe(
      paths.statePath,
    );
  });

  it("copies legacy state/history once and the dashboard reads the new authority", () => {
    const { repo, routines } = fixture();
    const legacyState = join(routines, "generated", "routine-state.json");
    const legacyHistory = join(routines, "generated", "routine-runs.jsonl");
    writeFileSync(
      legacyState,
      JSON.stringify({
        routines: { "rtn-test": { last_run: history.started_at, last_result: "failure" } },
      }),
    );
    writeFileSync(legacyHistory, `${JSON.stringify(history)}\n`);
    writeFileSync(
      join(routines, "rtn-test.yaml"),
      "id: rtn-test\ninterval: 1d\naction:\n  kind: job\n  job: job-test\n",
    );
    const paths = migrateRoutineStorage(routines, repo);
    expect(readFileSync(paths.runsPath, "utf8")).toBe(readFileSync(legacyHistory, "utf8"));
    writeFileSync(
      paths.statePath,
      JSON.stringify({
        routines: { "rtn-test": { last_run: history.completed_at, last_result: "skipped" } },
      }),
    );
    migrateRoutineStorage(routines, repo);
    const dashboard = aggregateRoutines(routines, repo);
    expect(dashboard.rows[0].lastRun).toBe(`${history.completed_at} (skipped)`);
    expect(dashboard.history).toEqual([history]);
    expect(readFileSync(legacyState, "utf8")).toContain("failure");
  });
});

describe("routine failure retention", () => {
  it.each(["success", "skipped", "partial"] as const)("does not save or commit %s", (result) => {
    const { repo } = fixture();
    const failures = join(repo, "execution/routines/failures");
    expect(recordRoutineFailure(repo, failures, { ...history, result })).toBeUndefined();
    expect(existsSync(failures)).toBe(false);
    expect(gitOutput).not.toHaveBeenCalled();
  });

  it("uses the Job Run instead of duplicating its failure record", () => {
    const { repo } = fixture();
    expect(
      recordRoutineFailure(repo, join(repo, "failures"), { ...history, job_run_ids: ["JBR-test"] }),
    ).toBeUndefined();
    expect(gitOutput).not.toHaveBeenCalled();
  });

  it("saves a redacted failure without a Job Run and commits only that file", () => {
    const { repo } = fixture();
    const file = recordRoutineFailure(repo, join(repo, "execution/routines/failures"), {
      ...history,
      reason: "Bearer test-credential-value",
    });
    expect(file).toBeDefined();
    const record = JSON.parse(readFileSync(file!, "utf8"));
    expect(record).toMatchObject({ ...history, reason: "Bearer [REDACTED]" });
    expect(record.run_id).toBeTruthy();
    expect(gitOutput).toHaveBeenLastCalledWith(repo, [
      "commit",
      "--only",
      "-m",
      "chore(routine): record failure rtn-test",
      "--",
      relative(repo, file!),
    ]);
  });
});
