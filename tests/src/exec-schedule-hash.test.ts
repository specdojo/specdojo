import { afterEach, describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeScheduleHashAndDiff } from "../../src/exec-schedule-hash.js";
import type { ScheduleHash, ScheduleIndex, ScheduleNode } from "../../src/exec-types.js";

const ENV_KEYS = ["SPECDOJO_PROJECT", "SPECDOJO_SCHEDULE_PATH", "SPECDOJO_EXECUTION_PATH"];
const originalEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));
const originalCwd = process.cwd();

function restoreEnv(): void {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

function makeSchedule(
  projectPath: string,
  tasks: Array<Partial<ScheduleNode> & { id: string }>,
): ScheduleIndex {
  const scheduleFile = join(projectPath, "sch-track-main.yaml");
  const nodes = new Map<string, ScheduleNode>();
  for (const t of tasks) {
    nodes.set(t.id, {
      id: t.id,
      name: t.name ?? t.id,
      owner: t.owner,
      depends_on: t.depends_on ?? [],
      duration_days: t.duration_days ?? 1,
      kind: t.kind ?? "task",
      schedule_file: t.schedule_file ?? scheduleFile,
    });
  }
  return {
    nodes,
    files: [scheduleFile],
    start_date: null,
    calendar: {
      timezone: "UTC",
      workdays: new Set([1, 2, 3, 4, 5]),
      holidays: new Set<string>(),
      work_hours_per_day: 8,
    },
    section_labels: {},
  };
}

function withRepo<T>(fn: (projectPath: string, generatedDir: string) => T): T {
  const dir = mkdtempSync(join(tmpdir(), "specdojo-test-"));
  try {
    mkdirSync(join(dir, ".specdojo"), { recursive: true });
    writeFileSync(
      join(dir, ".specdojo", "specdojo.config.json"),
      JSON.stringify({ version: 1, projects: {} }),
      "utf8",
    );
    const projectPath = join(dir, "docs", "schedule");
    mkdirSync(projectPath, { recursive: true });
    process.chdir(dir);
    process.env.SPECDOJO_SCHEDULE_PATH = "docs/schedule";
    process.env.SPECDOJO_EXECUTION_PATH = "docs/execution";
    return fn(projectPath, join(dir, "docs", "execution", "generated"));
  } finally {
    process.chdir(originalCwd);
    rmSync(dir, { recursive: true, force: true });
    restoreEnv();
  }
}

function readHash(generatedDir: string): ScheduleHash {
  return JSON.parse(readFileSync(join(generatedDir, "schedule-hash.json"), "utf8"));
}

function readDiff(generatedDir: string): string {
  return readFileSync(join(generatedDir, "schedule-diff.md"), "utf8");
}

afterEach(() => {
  process.chdir(originalCwd);
  restoreEnv();
});

describe("writeScheduleHashAndDiff", () => {
  it("初回実行で schedule-hash.json に全ノードのハッシュを書き出す", () => {
    withRepo((projectPath, generatedDir) => {
      const schedule = makeSchedule(projectPath, [{ id: "T-001" }, { id: "T-002" }]);

      writeScheduleHashAndDiff(projectPath, schedule);

      const hash = readHash(generatedDir);
      expect(hash.schema_version).toBe(1);
      expect(hash.schedule_path).toBe("docs/schedule");
      expect(hash.schedule_files).toEqual(["sch-track-main.yaml"]);
      expect(Object.keys(hash.node_hashes).sort()).toEqual(["T-001", "T-002"]);
    });
  });

  it("初回実行の schedule-diff.md では全ノードが Added になる", () => {
    withRepo((projectPath, generatedDir) => {
      writeScheduleHashAndDiff(projectPath, makeSchedule(projectPath, [{ id: "T-001" }]));

      const diff = readDiff(generatedDir);
      expect(diff).toContain("## Added");
      expect(diff).toContain("- `T-001`");
      expect(diff).toMatch(/## Removed\n\n_none_/);
      expect(diff).toMatch(/## Changed\n\n_none_/);
    });
  });

  it("2回目実行で追加・削除・変更を diff に反映する", () => {
    withRepo((projectPath, generatedDir) => {
      writeScheduleHashAndDiff(
        projectPath,
        makeSchedule(projectPath, [{ id: "T-001" }, { id: "T-002" }]),
      );
      writeScheduleHashAndDiff(
        projectPath,
        makeSchedule(projectPath, [{ id: "T-001", duration_days: 3 }, { id: "T-003" }]),
      );

      const diff = readDiff(generatedDir);
      expect(diff).toMatch(/## Added\n\n- `T-003`/);
      expect(diff).toMatch(/## Removed\n\n- `T-002`/);
      expect(diff).toMatch(/## Changed\n\n- `T-001`/);
    });
  });

  it("depends_on の並び順だけの違いは変更として扱わない", () => {
    withRepo((projectPath, generatedDir) => {
      writeScheduleHashAndDiff(
        projectPath,
        makeSchedule(projectPath, [{ id: "T-003", depends_on: ["T-001", "T-002"] }]),
      );
      writeScheduleHashAndDiff(
        projectPath,
        makeSchedule(projectPath, [{ id: "T-003", depends_on: ["T-002", "T-001"] }]),
      );

      expect(readDiff(generatedDir)).toMatch(/## Changed\n\n_none_/);
    });
  });

  it("壊れた前回ハッシュファイルは無視して全ノードを Added にする", () => {
    withRepo((projectPath, generatedDir) => {
      mkdirSync(generatedDir, { recursive: true });
      writeFileSync(join(generatedDir, "schedule-hash.json"), "{ broken json", "utf8");

      writeScheduleHashAndDiff(projectPath, makeSchedule(projectPath, [{ id: "T-001" }]));

      expect(readDiff(generatedDir)).toMatch(/## Added\n\n- `T-001`/);
      expect(readHash(generatedDir).schema_version).toBe(1);
    });
  });
});
