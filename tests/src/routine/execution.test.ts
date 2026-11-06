import { Command } from "commander";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerRoutineCommands, resolveRoutinePaths } from "../../../src/routine/routine.js";
import { gitOutput } from "../../../src/shared/git.js";
import type * as ChildProcessModule from "node:child_process";
import type * as GitModule from "../../../src/shared/git.js";
import type * as SpawnSelfModule from "../../../src/shared/spawn-self.js";

vi.mock("node:child_process", async (original) => ({
  ...(await original<typeof ChildProcessModule>()),
  spawnSync: vi.fn(),
}));
vi.mock("../../../src/shared/spawn-self.js", async (original) => ({
  ...(await original<typeof SpawnSelfModule>()),
  selfRunArgs: (args: string[]) => ["specdojo-test", args],
}));
vi.mock("../../../src/shared/dist-freshness.js", () => ({
  ensureFreshDistBuildForEntry: () => ({ outcome: "fresh" }),
}));
vi.mock("../../../src/shared/git.js", async (original) => ({
  ...(await original<typeof GitModule>()),
  gitOutput: vi.fn(() => ""),
}));

const originalCwd = process.cwd();
const directories: string[] = [];
afterEach(() => {
  process.chdir(originalCwd);
  process.exitCode = undefined;
  vi.restoreAllMocks();
  vi.clearAllMocks();
  vi.unstubAllEnvs();
  for (const directory of directories.splice(0))
    rmSync(directory, { recursive: true, force: true });
});

function fixture(action: string) {
  const root = mkdtempSync(join(tmpdir(), "specdojo-routine-execution-"));
  directories.push(root);
  const repo = join(root, "repo");
  mkdirSync(join(repo, ".specdojo"), { recursive: true });
  mkdirSync(join(repo, "routines"));
  writeFileSync(
    join(repo, ".specdojo/specdojo.config.json"),
    JSON.stringify({
      version: 1,
      current_project: "test",
      projects: {
        test: { routines_path: "routines", execution_path: "execution", jobs_path: "jobs" },
      },
    }),
  );
  writeFileSync(
    join(repo, "routines/rtn-test.yaml"),
    `id: rtn-test\ninterval: 1d\naction:\n${action}\n`,
  );
  vi.stubEnv("XDG_STATE_HOME", join(root, "state"));
  vi.stubEnv("SPECDOJO_PROJECT", "test");
  process.chdir(repo);
  vi.spyOn(process.stdout, "write").mockImplementation(() => true);
  vi.spyOn(process.stderr, "write").mockImplementation(() => true);
  vi.mocked(spawnSync).mockReturnValue({
    pid: 1,
    output: [],
    signal: null,
    status: 128,
    stdout: "",
    stderr: "",
  });
  const paths = resolveRoutinePaths({ project: "test" });
  return { repo, paths };
}

async function runRoutine() {
  process.exitCode = undefined;
  const program = new Command();
  registerRoutineCommands(program);
  await program.parseAsync([
    "node",
    "specdojo",
    "routine",
    "run",
    "--project",
    "test",
    "--id",
    "rtn-test",
  ]);
}

describe("routine execution persistence", () => {
  it.each([0, 75])(
    "keeps success/skip (%s) and locks outside the document tree",
    async (status) => {
      const { paths } = fixture("  kind: job\n  job: job-empty");
      vi.mocked(spawnSync).mockImplementation((command) => ({
        pid: 1,
        output: [],
        signal: null,
        status: command === "git" ? 128 : status,
        stdout: status === 0 ? "[routine-job] noop state=noop\n" : "",
        stderr: "",
      }));
      await runRoutine();
      const history = JSON.parse(readFileSync(paths.runsPath, "utf8"));
      expect(history.result).toBe(status === 0 ? "success" : "skipped");
      expect(history.job_run_ids).toEqual([]);
      expect(existsSync(paths.lockPath)).toBe(false);
      expect(existsSync(join(paths.routinesPath, ".locks"))).toBe(false);
      expect(existsSync(paths.generatedPath)).toBe(false);
      expect(existsSync(paths.failuresPath)).toBe(false);
      expect(gitOutput).not.toHaveBeenCalled();
    },
  );

  it("records a failure without a Job Run in Git and releases its local lock", async () => {
    const { paths } = fixture("  kind: job\n  job: job-missing");
    vi.mocked(spawnSync).mockReturnValue({
      pid: 1,
      output: [],
      signal: null,
      status: 1,
      stdout: "",
      stderr: "Job not found",
    });
    await runRoutine();
    const history = JSON.parse(readFileSync(paths.runsPath, "utf8"));
    expect(history).toMatchObject({ result: "failure", job_run_ids: [], reason: "Job not found" });
    expect(gitOutput).toHaveBeenCalledTimes(2);
    expect(existsSync(paths.lockPath)).toBe(false);
    expect(process.exitCode).toBe(1);
  });

  it("retains a preceding worktree Job Run ID when a later action throws", async () => {
    const { paths } = fixture(
      "  - kind: job\n    job: job-review\n  - kind: job\n    job: job-next",
    );
    let action = 0;
    vi.mocked(spawnSync).mockImplementation((command) => {
      if (command === "git")
        return { pid: 1, output: [], signal: null, status: 128, stdout: "", stderr: "" };
      if (++action === 2) throw new Error("spawn failed");
      return {
        pid: 1,
        output: [],
        signal: null,
        status: 1,
        stdout: "[routine-job] waiting run_id=JBR-review-123 state=failed reason=review failed\n",
        stderr: "",
      };
    });
    await runRoutine();
    expect(JSON.parse(readFileSync(paths.runsPath, "utf8"))).toMatchObject({
      result: "failure",
      job_run_ids: ["JBR-review-123"],
      reason: "review failed; spawn failed",
    });
    expect(existsSync(paths.failuresPath)).toBe(false);
    expect(gitOutput).not.toHaveBeenCalled();
    expect(existsSync(paths.lockPath)).toBe(false);
  });
});
