import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { localJobNoopPath, snapshotJobOutput } from "../../../src/job/noop.js";
import { taskRecordPaths } from "../../../src/shared/run-records.js";
import { storePlanConventions } from "../../../src/shared/plan-conventions.js";
import type { JobRunRecord } from "../../../src/job/job.js";

const git = vi.hoisted(() => ({ paths: [] as string[], committed: "", unborn: false }));
vi.mock("../../../src/shared/git.js", () => ({
  worktreeStatusPaths: () => git.paths,
  gitOutput: (_root: string, args: string[]) => (args[0] === "diff" ? git.committed : "head"),
  gitResult: () => ({ status: git.unborn ? 128 : 0, stdout: "head" }),
}));

const directories: string[] = [];
afterEach(() => {
  vi.unstubAllEnvs();
  git.paths = [];
  git.committed = "";
  git.unborn = false;
  for (const directory of directories.splice(0))
    rmSync(directory, { recursive: true, force: true });
});

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "specdojo-job-noop-"));
  directories.push(root);
  const repo = join(root, "repo");
  mkdirSync(repo);
  vi.stubEnv("XDG_STATE_HOME", join(root, "state"));
  const execution = join(repo, "execution");
  const record: JobRunRecord = {
    version: 1,
    run_id: "JBR-test",
    job_id: "job-test",
    project_id: "test",
    trigger: "routine",
    idempotency_key: "test",
    scheduled_at: "2026-11-07T00:00:00Z",
    created_at: "2026-11-07T00:00:00Z",
    updated_at: "2026-11-07T00:01:00Z",
    state: "succeeded",
    inputs: {},
    task: { mode: "command", command: "true" },
    checkpoint_before: {},
    checkpoint_after: { revision: "head" },
    plan_ref: "exec/plans/JBR-test-plan.md",
    result_ref: "exec/results/JBR-test-result.md",
    attempts: [{ attempt: 1, started_at: "2026-11-07T00:00:00Z", status: "succeeded" }],
  };
  const write = (path: string, content: string) => {
    mkdirSync(dirname(join(repo, path)), { recursive: true });
    writeFileSync(join(repo, path), content);
  };
  return { repo, execution, record, write };
}

describe("Job output without precondition", () => {
  it.each([false, true])(
    "ignores conventions and preserves a shared snapshot (shared: %s)",
    (shared) => {
      const { repo, execution, record, write } = fixture();
      const snapshot = snapshotJobOutput(repo, execution, record);
      const planPath = join(execution, record.plan_ref);
      const ref = storePlanConventions("## Rules\n\n- common rule", execution, planPath);
      write(`execution/${record.plan_ref}`, ref);
      const hash = ref.match(/sha256:([a-f0-9]{64})/)![1];
      const version = `execution/conventions/${hash}.txt`;
      if (shared) {
        const other = join(execution, "exec/plans/other-plan.md");
        write(
          "execution/exec/plans/other-plan.md",
          storePlanConventions("## Rules\n\n- common rule", execution, other),
        );
      }
      git.paths = [`execution/${record.plan_ref}`, version];
      expect(snapshot.hasChanges()).toBe(false);
      snapshot.discard(record);
      expect(existsSync(planPath)).toBe(false);
      expect(existsSync(join(repo, version))).toBe(shared);
    },
  );

  it("discards only Run artifacts, preserves existing user edits and stores idempotency/checkpoint locally", () => {
    const { repo, execution, record, write } = fixture();
    write("user.txt", "user edit");
    git.paths = ["user.txt"];
    const snapshot = snapshotJobOutput(repo, execution, record);
    const run = "execution/jobs/runs/JBR-test.json";
    const plan = `execution/${record.plan_ref}`;
    const result = `execution/${record.result_ref}`;
    const evidence = "execution/exec/evidence/JBR-test/attempt-1/evidence.json";
    for (const file of [run, plan, result, evidence]) write(file, "record");
    git.paths.push(run, plan, result, evidence);
    expect(snapshot.hasChanges()).toBe(false);
    snapshot.discard(record);
    for (const file of [run, plan, result, evidence])
      expect(existsSync(join(repo, file))).toBe(false);
    expect(readFileSync(join(repo, "user.txt"), "utf8")).toBe("user edit");
    const local = JSON.parse(
      readFileSync(localJobNoopPath(execution, record.run_id, repo), "utf8"),
    );
    expect(local.state).toBe("noop");
    expect(local.checkpoint_after).toEqual({ revision: "head" });
  });

  it("restores previous failed attempt artifacts rather than deleting history", () => {
    const { repo, execution, record, write } = fixture();
    const file = `execution/${record.result_ref}`;
    write(file, "old failure");
    const snapshot = snapshotJobOutput(repo, execution, record);
    write(file, "new result");
    snapshot.discard(record);
    expect(readFileSync(join(repo, file), "utf8")).toBe("old failure");
  });

  it("excludes and removes the complete Run directory from the shared path module", () => {
    const { repo, execution, record, write } = fixture();
    const paths = taskRecordPaths(execution, record.run_id, record.run_id, "job");
    record.plan_ref = paths.plan.slice(execution.length + 1);
    record.result_ref = paths.result.slice(execution.length + 1);
    const snapshot = snapshotJobOutput(repo, execution, record);
    for (const file of [
      paths.plan,
      paths.result,
      paths.evidence,
      paths.state,
      paths.log("command.stdout.log"),
    ]) {
      const relative = file.slice(repo.length + 1);
      write(relative, "Run bookkeeping");
      git.paths.push(relative);
    }
    expect(snapshot.hasChanges()).toBe(false);
    snapshot.discard(record);
    expect(existsSync(paths.directory)).toBe(false);
  });

  it("restores a previous attempt's evidence and removes only the new files", () => {
    const { repo, execution, record, write } = fixture();
    const paths = taskRecordPaths(execution, record.run_id, record.run_id, "job");
    const evidence = paths.evidence.slice(repo.length + 1);
    const log = paths.log("executor.log").slice(repo.length + 1);
    write(evidence, "previous failure evidence");
    const snapshot = snapshotJobOutput(repo, execution, record);
    write(evidence, "new evidence");
    write(log, "new log");
    snapshot.discard(record);
    expect(readFileSync(paths.evidence, "utf8")).toBe("previous failure evidence");
    expect(existsSync(paths.log("executor.log"))).toBe(false);
  });

  it("supports an initialized repository without a first commit", () => {
    const { repo, execution, record, write } = fixture();
    git.unborn = true;
    const snapshot = snapshotJobOutput(repo, execution, record);
    expect(snapshot.hasChanges()).toBe(false);
    write("output.txt", "first output");
    git.paths.push("output.txt");
    expect(snapshot.hasChanges()).toBe(true);
  });

  it.each(["output.txt", "execution/exec/events/nested.json", "execution/grade/results/doc.yaml"])(
    "retains material changes to %s",
    (file) => {
      const { repo, execution, record, write } = fixture();
      const snapshot = snapshotJobOutput(repo, execution, record);
      write(file, "changed");
      git.paths = [file];
      expect(snapshot.hasChanges()).toBe(true);
    },
  );

  it("detects modifications to an already dirty file and nested committed output", () => {
    const { repo, execution, record, write } = fixture();
    write("output.txt", "before");
    git.paths = ["output.txt"];
    const snapshot = snapshotJobOutput(repo, execution, record);
    write("output.txt", "after");
    expect(snapshot.hasChanges()).toBe(true);
    git.paths = [];
    git.committed = "output.txt\0";
    expect(snapshot.hasChanges()).toBe(true);
  });
});
