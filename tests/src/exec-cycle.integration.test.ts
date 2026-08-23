import { mkdirSync, mkdtempSync, readFileSync, rmSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Command } from "commander";
import yaml from "js-yaml";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerExecCommands } from "../../src/exec.js";
import { rebuildStaleGeneratedTracksForCycle } from "../../src/exec-run.js";
import { registerScheduleCommands } from "../../src/schedule.js";

const originalCwd = process.cwd();
const ENV_KEYS = ["SPECDOJO_PROJECT", "SPECDOJO_SCHEDULE_PATH", "SPECDOJO_EXECUTION_PATH"];
const originalEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));

function clearProjectEnv(): void {
  for (const key of ENV_KEYS) delete process.env[key];
}

function setupProject(): { repo: string; schedulePath: string; trackPath: string } {
  const repo = mkdtempSync(join(tmpdir(), "specdojo-exec-cycle-"));
  const schedulePath = join(repo, "schedule");
  const executionPath = join(repo, "execution");
  const strategyPath = join(schedulePath, "sch-strategy-launch.yaml");
  const trackPath = join(schedulePath, "sch-track-launch.yaml");

  mkdirSync(join(repo, ".specdojo"), { recursive: true });
  mkdirSync(schedulePath, { recursive: true });
  mkdirSync(join(executionPath, "exec", "events"), { recursive: true });
  writeFileSync(
    join(repo, ".specdojo", "specdojo.config.json"),
    JSON.stringify(
      {
        version: 1,
        current_project: "test",
        projects: { test: { schedule_path: "schedule", execution_path: "execution" } },
      },
      null,
      2,
    ) + "\n",
    "utf8",
  );
  writeFileSync(
    join(repo, "catalog.yaml"),
    yaml.dump({
      groups: [
        {
          name: "launch",
          deliverables: [
            { local_id: "launch-doc", name: "Launch document", kind: "work", path: "doc.md" },
          ],
        },
      ],
    }),
    "utf8",
  );
  writeFileSync(
    strategyPath,
    yaml.dump({
      kind: "strategy",
      id: "test:sch-strategy-launch",
      type: "project",
      status: "draft",
      track: "launch",
      scope: {
        catalogs: [{ id: "test:catalog", path: "/catalog.yaml" }],
        include_kinds: ["work"],
      },
      phase_sets: {
        delivery: [{ id: "draft", name: "Draft", task_suffix: "010", duration_days: 1 }],
      },
      default_phase_sets: ["delivery"],
      owner_rules: [{ local_ids: ["launch-doc"], owner: "DEV" }],
    }),
    "utf8",
  );
  writeFileSync(
    trackPath,
    [
      "kind: track",
      "id: test:sch-track-launch",
      "type: project",
      "status: draft",
      "version: 1",
      "project_id: test",
      "track: launch",
      "tasks: []",
      "",
    ].join("\n"),
    "utf8",
  );
  const oldTime = new Date("2026-01-01T00:00:00Z");
  const newTime = new Date("2026-01-02T00:00:00Z");
  utimesSync(trackPath, oldTime, oldTime);
  utimesSync(strategyPath, newTime, newTime);

  return { repo, schedulePath, trackPath };
}

async function runScheduleBuild(track: string): Promise<boolean> {
  process.exitCode = undefined;
  const program = new Command();
  program.exitOverride();
  registerScheduleCommands(program);
  await program.parseAsync([
    "node",
    "specdojo",
    "schedule",
    "build",
    "--project",
    "test",
    "--track",
    track,
    "--force",
  ]);
  return (process.exitCode ?? 0) === 0;
}

async function runExec(args: string[]): Promise<void> {
  process.exitCode = undefined;
  const program = new Command();
  program.exitOverride();
  registerExecCommands(program);
  await program.parseAsync(["node", "specdojo", "exec", ...args]);
}

afterEach(() => {
  process.chdir(originalCwd);
  clearProjectEnv();
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  process.exitCode = undefined;
  vi.restoreAllMocks();
});

describe("exec cycle stale track rebuild", () => {
  it("rebuilds a stale track before refresh so its new task becomes Ready", async () => {
    const { repo, schedulePath, trackPath } = setupProject();
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);

    try {
      process.chdir(repo);
      clearProjectEnv();
      const rebuild = await rebuildStaleGeneratedTracksForCycle(schedulePath, "test", false, {
        buildTrack: runScheduleBuild,
      });
      expect(rebuild).toEqual({ status: "success", tracks: ["launch"] });
      expect(readFileSync(trackPath, "utf8")).toContain("local_id: launch-doc");

      await runExec(["refresh", "--project", "test"]);
      expect(process.exitCode).toBe(0);
      const ready = JSON.parse(
        readFileSync(join(repo, "execution", "generated", "ready.json"), "utf8"),
      ) as { tasks: Array<{ id: string }> };
      expect(ready.tasks.map((task) => task.id)).toContain("T-LAUNCH-launch-doc-010");
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("places the dry-run rebuild between index build and validate/refresh", async () => {
    const { repo } = setupProject();
    const output: string[] = [];
    vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
      output.push(String(chunk));
      return true;
    });

    try {
      process.chdir(repo);
      clearProjectEnv();
      await runExec(["cycle", "--project", "test", "--dry-run"]);
      expect(process.exitCode ?? 0).toBe(0);

      const text = output.join("");
      const indexPosition = text.indexOf("[dry-run] specdojo index build");
      const buildPosition = text.indexOf(
        "[dry-run] specdojo schedule build --track launch --force --project test",
      );
      const validatePosition = text.indexOf("[dry-run] specdojo exec validate");
      expect(indexPosition).toBeGreaterThanOrEqual(0);
      expect(buildPosition).toBeGreaterThan(indexPosition);
      expect(validatePosition).toBeGreaterThan(buildPosition);
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });
});
