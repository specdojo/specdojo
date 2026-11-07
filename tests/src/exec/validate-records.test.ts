import { Command } from "commander";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerExecCommands } from "../../../src/exec/commands.js";
import { validateRunRecordLayout } from "../../../src/exec/validate-records.js";
import { gitEnvironment } from "../../../src/shared/git-environment.js";
import { runRecordPaths } from "../../../src/shared/run-records.js";

const roots: string[] = [];
const originalCwd = process.cwd();
const envKeys = ["SPECDOJO_PROJECT", "SPECDOJO_SCHEDULE_PATH", "SPECDOJO_EXECUTION_PATH"];
const originalEnv = envKeys.map((key) => [key, process.env[key]] as const);
const originalExitCode = process.exitCode;
function fixture() {
  const root = mkdtempSync(join(tmpdir(), "specdojo-record-layout-"));
  roots.push(root);
  const executionPath = join(root, "execution");
  const routinesPath = join(root, "custom-routines");
  const options = { repoRoot: root, executionPath, routinesPath };
  const write = (path: string, content = "{}") => {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
  };
  const git = (...args: string[]) => {
    const result = spawnSync("git", args, { cwd: root, encoding: "utf8", env: gitEnvironment() });
    if (result.status !== 0) throw new Error(result.stderr);
    return result.stdout;
  };
  git("init", "-q");
  return { ...options, options, write, git, check: () => validateRunRecordLayout(options) };
}
afterEach(() => {
  process.chdir(originalCwd);
  process.exitCode = originalExitCode;
  for (const [key, value] of originalEnv) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  vi.restoreAllMocks();
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("run record layout audit", () => {
  it("accepts all origins, review/attempt logs and independent record trees without findings", () => {
    const f = fixture();
    for (const origin of ["register", "schedule", "job"] as const) {
      const paths = runRecordPaths(f.executionPath, origin, "item", "run-review");
      for (const path of [
        paths.plan,
        paths.result,
        paths.evidence,
        paths.state,
        paths.log("executor.log"),
        paths.log("parent-validation-attempt-1-lint.log"),
        paths.log("evidence.attempt-1.json"),
        paths.log("pipeline-state.attempt-1.json"),
        paths.log("integrate.log"),
      ])
        f.write(path);
    }
    for (const path of [
      "grade/results/result.md",
      "jobs/runs/run.json",
      "exec/events/event.json",
      "exec/trials/trial/plan.md",
      "exec/trials/trial/executor.log",
      "generated/report.md",
      "conventions/hash.txt",
      "routines/failures/routine/run.json",
    ]) {
      f.write(join(f.executionPath, path));
    }
    expect(f.check()).toEqual([]);
  });

  it("reports exact missing paths, including runs containing only state or logs and empty runs", () => {
    const f = fixture();
    const paths = runRecordPaths(f.executionPath, "register", "PJR-TEST", "run-1");
    f.write(paths.plan);
    expect(f.check()).toEqual(
      [paths.evidence, paths.result].map((path) => ({
        path: relative(f.repoRoot, path),
        reason: "missing",
        message: "required run record is missing or not a regular file",
      })),
    );
    rmSync(paths.plan);
    for (const path of [paths.state, paths.log("executor.log")]) f.write(path);
    expect(f.check().filter((issue) => issue.reason === "missing")).toHaveLength(3);
    rmSync(paths.directory, { recursive: true });
    mkdirSync(paths.directory, { recursive: true });
    expect(f.check()).toHaveLength(3);
  });

  it("exempts explicit human results, but not missing or malformed metadata", () => {
    const f = fixture();
    const paths = runRecordPaths(f.executionPath, "schedule", "T-HUMAN", "run-1");
    f.write(paths.result, "---\nspecdojo:\n  execution: human\n---\n");
    expect(f.check()).toEqual([]);
    f.write(paths.result, "---\nspecdojo: [\n---\n");
    expect(f.check()).toHaveLength(2);
  });

  it("rejects legacy, unknown-origin, shallow, nested and stray execution records", () => {
    const f = fixture();
    const paths = [
      "exec/plans/old-plan.md",
      "exec/results/old-result.md",
      "exec/evidence/item/run/arbitrary.json",
      "runs/other/item/run/plan.md",
      "runs/register/plan.md",
      "runs/register/item/run/nested/evidence.json",
      "runs/register/item/run with spaces/plan.md",
      "loose/evidence.json",
      "executor.log",
      "pipeline-state.json",
    ];
    for (const path of paths) f.write(join(f.executionPath, path));
    const findings = f.check().filter((issue) => issue.reason === "misplaced");
    for (const path of paths)
      expect(findings).toContainEqual(
        expect.objectContaining({
          path: `execution/${path}`,
          message: expect.any(String),
        }),
      );
  });

  it("does not accept a directory or symlink in place of a required record", () => {
    const f = fixture();
    const paths = runRecordPaths(f.executionPath, "register", "PJR-TEST", "run-1");
    mkdirSync(paths.plan, { recursive: true });
    f.write(join(f.repoRoot, "outside.json"));
    symlinkSync(join(f.repoRoot, "outside.json"), paths.evidence);
    f.write(paths.result);
    expect(f.check().filter((issue) => issue.reason === "missing")).toHaveLength(2);
    expect(f.check().filter((issue) => issue.reason === "misplaced")).toHaveLength(2);
  });

  it("detects unignored and tracked locks, accepts ignored locks, and catches negated rules", () => {
    const f = fixture();
    const execLock = join(f.executionPath, "exec/.locks/exec-run.lock/owner.json");
    const routineLock = join(f.routinesPath, ".locks/routine-run.lock/owner.json");
    f.write(execLock);
    f.write(routineLock);
    expect(f.check().some((issue) => issue.path.endsWith("exec-run.lock/owner.json"))).toBe(true);
    expect(f.check().some((issue) => issue.path.startsWith("custom-routines/.locks"))).toBe(true);
    f.write(join(f.repoRoot, ".gitignore"), "execution/exec/.locks/\ncustom-routines/.locks/\n");
    expect(f.check()).toEqual([]);
    f.git("add", "-f", "execution/exec/.locks/exec-run.lock/owner.json");
    expect(f.check()).toContainEqual(
      expect.objectContaining({
        path: "execution/exec/.locks/exec-run.lock/owner.json",
        reason: "lock-not-ignored",
      }),
    );
    f.write(
      join(f.repoRoot, ".gitignore"),
      "custom-routines/.locks/*\n!custom-routines/.locks/routine-run.lock/\n",
    );
    expect(f.check().some((issue) => issue.path.startsWith("custom-routines/.locks"))).toBe(true);
  });

  it("reports failure to query Git rather than silently accepting locks", () => {
    const f = fixture();
    f.write(join(f.executionPath, "exec/.locks/owner.json"));
    rmSync(join(f.repoRoot, ".git"), { recursive: true });
    expect(f.check()).toContainEqual(expect.objectContaining({ reason: "git-check-failed" }));
  });

  it.each([{ flags: [] }, { flags: ["--records-only"] }])(
    "exec validate $flags returns failure with path and reason",
    async ({ flags }) => {
      const f = fixture();
      for (const key of envKeys) delete process.env[key];
      f.write(
        join(f.repoRoot, ".specdojo/specdojo.config.json"),
        JSON.stringify({
          version: 1,
          current_project: "test",
          projects: {
            test: {
              schedule_path: "schedule",
              execution_path: "execution",
              routines_path: "custom-routines",
            },
          },
        }),
      );
      mkdirSync(join(f.repoRoot, "schedule"));
      const paths = runRecordPaths(f.executionPath, "register", "PJR-TEST", "run-1");
      f.write(paths.plan);
      f.write(join(f.routinesPath, ".locks/routine-run.lock/owner.json"));
      process.chdir(f.repoRoot);
      let output = "";
      vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
        output += String(chunk);
        return true;
      });
      const run = async (scope: string[]) => {
        const program = new Command();
        registerExecCommands(program);
        await program.parseAsync(["node", "specdojo", "exec", "validate", ...scope]);
      };
      await run(flags);
      expect(process.exitCode).toBe(1);
      expect(output).toContain("execution/runs/register/PJR-TEST/run-1/result.md: [missing]");
      expect(output).toContain("custom-routines/.locks");

      // Startup/resume must tolerate partial records and live locks, while still
      // rejecting invalid events. The public default audit remains strict above.
      output = "";
      await run(["--schedule-only"]);
      expect(process.exitCode).toBe(0);
      expect(output).not.toContain("[missing]");
      expect(output).not.toContain("lock-not-ignored");
      const invalidEvent = join(f.executionPath, "exec/events/invalid.json");
      f.write(invalidEvent, "{");
      output = "";
      await run(["--schedule-only"]);
      expect(process.exitCode).toBe(1);
      expect(output).toContain("failed to parse JSON");
      rmSync(invalidEvent);

      f.write(paths.result);
      f.write(paths.evidence);
      rmSync(join(f.routinesPath, ".locks"), { recursive: true });
      output = "";
      await run(flags);
      expect(process.exitCode).toBe(0);
      expect(output).not.toContain("[missing]");
    },
  );

  it("rejects conflicting validation scopes", async () => {
    const program = new Command();
    program.exitOverride().configureOutput({ writeErr: () => {} });
    registerExecCommands(program);
    await expect(
      program.parseAsync([
        "node",
        "specdojo",
        "exec",
        "validate",
        "--schedule-only",
        "--records-only",
      ]),
    ).rejects.toMatchObject({ code: "commander.conflictingOption" });
  });
});
