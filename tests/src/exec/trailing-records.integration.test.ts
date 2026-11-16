import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { taskRecordPaths } from "../../../src/exec/run-records.js";
import {
  branchOwnedRunRecordPaths,
  commitTrailingRunRecords,
  reportTrailingRunRecords,
  selectTrailingRunRecords,
  TRAILING_RECORDS_COMMIT_SUBJECT,
  type TrailingRecordsContext,
} from "../../../src/exec/trailing-records.js";
import {
  checkpointAndEnsureWorktree,
  mergeWorktreeIntoCurrent,
  worktreeStatusPaths,
} from "../../../src/exec/worktree-ops.js";
import { validateRunRecordLayoutAtCommit } from "../../../src/exec/validate-records-commit.js";
import { gitOutput } from "../../../src/exec/worktree.js";

const ENV_KEYS = ["SPECDOJO_PROJECT", "SPECDOJO_SCHEDULE_PATH", "SPECDOJO_EXECUTION_PATH"];
const originalEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));
const RUNNER = "edit-agent";
const HUMAN = "indie";

type Fixture = {
  repo: string;
  worktreeBase: string;
  context: TrailingRecordsContext;
};

const fixtures: Fixture[] = [];

function git(cwd: string, ...args: string[]): string {
  return gitOutput(cwd, args).trim();
}

function writeFile(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function setupRepository(): Fixture {
  const repo = mkdtempSync(join(tmpdir(), "specdojo-trailing-records-repo-"));
  const worktreeBase = mkdtempSync(join(tmpdir(), "specdojo-trailing-records-base-"));
  const schedulePath = join(repo, "schedule");
  const executionPath = join(repo, "execution");
  mkdirSync(schedulePath, { recursive: true });
  mkdirSync(join(executionPath, "exec", "events"), { recursive: true });
  writeFile(join(repo, ".gitignore"), "execution/exec/.locks/\n");
  writeFile(join(repo, "README.md"), "# test\n");
  git(repo, "init");
  git(repo, "add", ".gitignore", "README.md");
  git(repo, "commit", "-m", "initial");

  process.env.SPECDOJO_SCHEDULE_PATH = schedulePath;
  process.env.SPECDOJO_EXECUTION_PATH = executionPath;
  delete process.env.SPECDOJO_PROJECT;

  const fixture: Fixture = {
    repo,
    worktreeBase,
    context: {
      repoRoot: repo,
      schedulePath,
      executionPath,
      isRunnerActor: (actor) => actor === RUNNER,
    },
  };
  fixtures.push(fixture);
  return fixture;
}

function writeEvent(fixture: Fixture, taskId: string, type: string, by: string): string {
  const path = join(
    fixture.context.executionPath,
    "exec",
    "events",
    `20261115T00000${type.length % 10}Z_${by}_${taskId}_${type}.json`,
  );
  writeFile(
    path,
    `${JSON.stringify({ v: 1, ts: "2026-11-15T00:00:00Z", type, task_id: taskId, by, msg: type }, null, 2)}\n`,
  );
  return path;
}

function writeRunRecords(fixture: Fixture, taskId: string, runId: string) {
  const records = taskRecordPaths(fixture.context.executionPath, taskId, runId);
  writeFile(records.plan, `# Plan ${taskId}\n`);
  writeFile(records.result, `# Result ${taskId}\n\nstatus: in_progress\n`);
  return records;
}

function relativePaths(fixture: Fixture, paths: string[]): string[] {
  return paths.map((path) => path.slice(fixture.repo.length + 1)).sort();
}

function dirtyRecords(fixture: Fixture): string[] {
  return worktreeStatusPaths(fixture.repo).filter((path) => path.startsWith("execution/"));
}

afterEach(() => {
  vi.restoreAllMocks();
  while (fixtures.length > 0) {
    const fixture = fixtures.pop()!;
    for (const line of git(fixture.repo, "worktree", "list", "--porcelain").split("\n")) {
      if (!line.startsWith("worktree ")) continue;
      const path = line.slice("worktree ".length);
      if (path === fixture.repo) continue;
      try {
        git(fixture.repo, "worktree", "remove", "--force", path);
      } catch {
        // best effort cleanup
      }
    }
    rmSync(fixture.repo, { recursive: true, force: true });
    rmSync(fixture.worktreeBase, { recursive: true, force: true });
  }
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

describe("selectTrailingRunRecords", () => {
  it("selects runner events and the run records of their tasks, not human events", () => {
    const fixture = setupRepository();
    const complete = writeEvent(fixture, "T-A-doc-010", "complete", RUNNER);
    const block = writeEvent(fixture, "T-B-doc-010", "block", RUNNER);
    const release = writeEvent(fixture, "T-C-doc-010", "release", HUMAN);
    const runnerRun = writeRunRecords(fixture, "T-B-doc-010", "T-B-doc-010-20261115T000000Z-aaaa");
    const humanRun = writeRunRecords(fixture, "T-C-doc-140", "T-C-doc-140");

    const selection = selectTrailingRunRecords(fixture.context);

    expect(selection.paths).toEqual(
      relativePaths(fixture, [complete, block, runnerRun.plan, runnerRun.result]),
    );
    expect(selection.paths).not.toContain(relativePaths(fixture, [release])[0]);
    expect(selection.paths).not.toContain(relativePaths(fixture, [humanRun.result])[0]);
  });
});

describe("commitTrailingRunRecords", () => {
  it("commits runner records in one bookkeeping commit and leaves no runner record in git status", () => {
    const fixture = setupRepository();
    writeEvent(fixture, "T-A-doc-010", "complete", RUNNER);
    writeEvent(fixture, "T-B-doc-010", "block", RUNNER);
    writeRunRecords(fixture, "T-B-doc-010", "T-B-doc-010-20261115T000000Z-aaaa");
    const release = writeEvent(fixture, "T-C-doc-010", "release", HUMAN);
    const before = git(fixture.repo, "rev-list", "--count", "HEAD");

    const report = commitTrailingRunRecords(fixture.context);

    expect(report.error).toBeUndefined();
    expect(report.committed).toHaveLength(4);
    expect(report.remaining).toEqual([]);
    expect(Number(git(fixture.repo, "rev-list", "--count", "HEAD"))).toBe(Number(before) + 1);
    expect(git(fixture.repo, "log", "-1", "--format=%s")).toBe(TRAILING_RECORDS_COMMIT_SUBJECT);
    // 人が書いたイベントは記帳する人が commit するため、作業ツリーに残す。
    expect(dirtyRecords(fixture)).toEqual(relativePaths(fixture, [release]));
  });

  it("leaves a run stopped at setup uncommitted so the committed tree passes the layout check", () => {
    const fixture = setupRepository();
    const taskId = "T-B-doc-010";
    const block = writeEvent(fixture, taskId, "block", RUNNER);
    // setup で止まった run は plan だけを残す。
    const stopped = taskRecordPaths(
      fixture.context.executionPath,
      taskId,
      `${taskId}-20261115T000000Z-aaaa`,
    );
    writeFile(stopped.plan, `# Plan ${taskId}\n`);
    const completed = writeRunRecords(fixture, taskId, `${taskId}-20261115T010000Z-bbbb`);
    writeFile(completed.evidence, "{}\n");
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    const stderr = vi.spyOn(process.stderr, "write").mockImplementation(() => true);

    const report = commitTrailingRunRecords(fixture.context);
    reportTrailingRunRecords(report, "test");

    expect(report.committed).toEqual(
      relativePaths(fixture, [block, completed.plan, completed.result, completed.evidence]),
    );
    expect(report.incompleteRuns).toEqual(relativePaths(fixture, [stopped.directory]));
    expect(dirtyRecords(fixture)).toEqual(relativePaths(fixture, [stopped.plan]));
    expect(stderr.mock.calls.join("")).toContain(relativePaths(fixture, [stopped.directory])[0]);
    expect(
      validateRunRecordLayoutAtCommit({
        repoRoot: fixture.repo,
        executionPath: fixture.context.executionPath,
        commit: "HEAD",
      }),
    ).toEqual([]);
  });

  it("drops the whole run when result.md is rejected and HEAD has no result for it", () => {
    const fixture = setupRepository();
    const taskId = "T-B-doc-010";
    const block = writeEvent(fixture, taskId, "block", RUNNER);
    const records = writeRunRecords(fixture, taskId, `${taskId}-20261115T000000Z-aaaa`);
    writeFile(records.evidence, "{}\n");
    const hook = join(fixture.repo, ".git", "hooks", "pre-commit");
    writeFile(
      hook,
      "#!/bin/sh\nif git diff --cached --name-only | grep -q 'result.md$'; then exit 1; fi\n",
    );
    chmodSync(hook, 0o755);
    vi.spyOn(process.stderr, "write").mockImplementation(() => true);

    const report = commitTrailingRunRecords(fixture.context);

    expect(report.error).toBeUndefined();
    expect(report.committed).toEqual(relativePaths(fixture, [block]));
    expect(report.incompleteRuns).toEqual(relativePaths(fixture, [records.directory]));
    expect(
      validateRunRecordLayoutAtCommit({
        repoRoot: fixture.repo,
        executionPath: fixture.context.executionPath,
        commit: "HEAD",
      }),
    ).toEqual([]);
  });

  it("does nothing when no runner record is uncommitted", () => {
    const fixture = setupRepository();
    const before = git(fixture.repo, "rev-parse", "HEAD");

    const report = commitTrailingRunRecords(fixture.context);

    expect(report).toEqual({ committed: [], remaining: [] });
    expect(git(fixture.repo, "rev-parse", "HEAD")).toBe(before);
  });

  it("reports the remaining files when the commit is rejected", () => {
    const fixture = setupRepository();
    const event = writeEvent(fixture, "T-A-doc-010", "complete", RUNNER);
    const hook = join(fixture.repo, ".git", "hooks", "pre-commit");
    writeFile(hook, "#!/bin/sh\necho rejected by hook >&2\nexit 1\n");
    chmodSync(hook, 0o755);

    const report = commitTrailingRunRecords(fixture.context);

    expect(report.committed).toEqual([]);
    expect(report.remaining).toEqual(relativePaths(fixture, [event]));
    expect(report.error).toMatch(/git commit failed/);
    // 記帳の失敗で stage を残さない。
    expect(git(fixture.repo, "diff", "--cached", "--name-only")).toBe("");
  });

  it("lets a failed run's records be committed before its exec branch merges cleanly later", () => {
    const fixture = setupRepository();
    const taskId = "T-B-doc-010";
    const runId = `${taskId}-20261115T000000Z-aaaa`;
    const claim = writeEvent(fixture, taskId, "claim", RUNNER);
    const records = writeRunRecords(fixture, taskId, runId);
    const checkpointPaths = [records.plan, records.result, claim];
    const worktree = checkpointAndEnsureWorktree({
      context: fixture.context,
      worktreeTaskId: taskId,
      base: fixture.worktreeBase,
      checkpointPaths,
      commitMessage: `exec(${taskId}): prepare execution`,
    });
    // 失敗: runner は root に block を書き、worktree は保持する。
    writeEvent(fixture, taskId, "block", RUNNER);

    const failed = commitTrailingRunRecords(fixture.context);

    expect(failed.error).toBeUndefined();
    expect(dirtyRecords(fixture)).toEqual([]);

    // 再開後に exec branch 側で result が更新され、統合される。
    const worktreeResult = join(worktree.path, relativePaths(fixture, [records.result])[0]!);
    writeFile(worktreeResult, `# Result ${taskId}\n\nstatus: complete\n`);
    git(worktree.path, "add", "-A");
    git(worktree.path, "commit", "-m", `exec(${taskId}): apply task changes`);
    writeEvent(fixture, taskId, "unblock", RUNNER);
    commitTrailingRunRecords(fixture.context);

    mergeWorktreeIntoCurrent({
      context: fixture.context,
      worktree,
      taskId,
      message: `exec(${taskId}): doc`,
      releaseRootPaths: checkpointPaths,
      resolveConflictsWithBranchPaths: [
        ...checkpointPaths,
        ...branchOwnedRunRecordPaths({
          repoRoot: fixture.repo,
          executionPath: fixture.context.executionPath,
          branch: worktree.branch,
          taskId,
        }),
      ],
    });

    expect(readFileSync(records.result, "utf8")).toContain("status: complete");
    expect(dirtyRecords(fixture)).toEqual([]);
  });
});
