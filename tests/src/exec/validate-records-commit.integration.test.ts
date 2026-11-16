import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { validateRunRecordLayoutAtCommit } from "../../../src/exec/validate-records-commit.js";
import { gitEnvironment } from "../../../src/shared/git-environment.js";
import { runRecordPaths } from "../../../src/shared/run-records.js";

const roots: string[] = [];

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "specdojo-record-layout-commit-test-"));
  roots.push(root);
  const executionPath = join(root, "execution");
  const write = (path: string, content = "{}\n") => {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content, "utf8");
  };
  const git = (...args: string[]) => {
    const result = spawnSync("git", args, { cwd: root, encoding: "utf8", env: gitEnvironment() });
    if (result.status !== 0) throw new Error(result.stderr);
    return result.stdout.trim();
  };
  git("init", "-q");
  write(join(root, "README.md"), "# test\n");
  git("add", "-A");
  git("commit", "-q", "-m", "initial");
  const check = (commit = "HEAD") =>
    validateRunRecordLayoutAtCommit({ repoRoot: root, executionPath, commit });
  return { root, executionPath, write, git, check };
}

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("validateRunRecordLayoutAtCommit", () => {
  it("reports a committed run that has only plan.md", () => {
    const f = fixture();
    const run = runRecordPaths(f.executionPath, "schedule", "T-A-doc-010", "run-1");
    f.write(run.plan, "# Plan\n");
    f.git("add", "-A");
    f.git("commit", "-q", "-m", "plan only");

    const issues = f.check();

    expect(issues.map((issue) => [issue.path, issue.reason])).toEqual([
      ["execution/runs/schedule/T-A-doc-010/run-1/evidence.json", "missing"],
      ["execution/runs/schedule/T-A-doc-010/run-1/result.md", "missing"],
    ]);
  });

  it("passes a committed complete run and ignores uncommitted local runs and empty directories", () => {
    const f = fixture();
    const run = runRecordPaths(f.executionPath, "schedule", "T-A-doc-010", "run-1");
    for (const path of [run.plan, run.result, run.evidence]) f.write(path);
    f.git("add", "-A");
    f.git("commit", "-q", "-m", "complete run");
    const local = runRecordPaths(f.executionPath, "schedule", "T-A-doc-010", "run-2");
    f.write(local.plan, "# Plan\n");
    mkdirSync(runRecordPaths(f.executionPath, "register", "PJR-AAAA", "run-3").directory, {
      recursive: true,
    });

    expect(f.check()).toEqual([]);
  });

  it("checks the given revision, not the latest one", () => {
    const f = fixture();
    const run = runRecordPaths(f.executionPath, "schedule", "T-A-doc-010", "run-1");
    f.write(run.plan, "# Plan\n");
    f.git("add", "-A");
    f.git("commit", "-q", "-m", "plan only");
    const broken = f.git("rev-parse", "HEAD");
    for (const path of [run.result, run.evidence]) f.write(path);
    f.git("add", "-A");
    f.git("commit", "-q", "-m", "complete");

    expect(f.check()).toEqual([]);
    expect(f.check(broken)).toHaveLength(2);
  });

  it("accepts a committed human result read from the tree", () => {
    const f = fixture();
    const run = runRecordPaths(f.executionPath, "schedule", "T-A-doc-140", "T-A-doc-140");
    f.write(run.result, "---\nspecdojo:\n  execution: human\n---\n\n# Result\n");
    f.git("add", "-A");
    f.git("commit", "-q", "-m", "human result");

    expect(f.check()).toEqual([]);
  });

  it("reports a committed runtime lock", () => {
    const f = fixture();
    f.write(join(f.executionPath, "exec", ".locks", "scheduler.lock", "owner.json"));
    f.git("add", "-A");
    f.git("commit", "-q", "-m", "lock");

    expect(f.check().map((issue) => issue.reason)).toContain("lock-not-ignored");
  });

  it("rejects an unknown revision with its name", () => {
    const f = fixture();

    expect(() => f.check("no-such-revision")).toThrow(/no-such-revision/);
  });
});
