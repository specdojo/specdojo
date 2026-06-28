import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { findExecWorktree, type ExecWorktree } from "../../src/exec-worktree.js";
import {
  checkpointAndEnsureWorktree,
  commitWorktreeChanges,
  deliverableStatus,
  discardStaleExecWorktree,
  mergeWorktreeIntoCurrent,
  removeWorktree,
  type WorktreeOpsContext,
} from "../../src/exec-worktree-ops.js";

const ENV_KEYS = ["SPECDOJO_PROJECT", "SPECDOJO_SCHEDULE_PATH", "SPECDOJO_EXECUTION_PATH"];
const originalEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));

// Git sets these per-invocation env vars when running hooks (e.g. pre-commit). If inherited by
// git commands targeting the test's linked worktrees (where `.git` is a gitlink file, not a dir),
// they break index access with "`.git/index`: Not a directory". Strip them, like production does.
const GIT_LOCAL_ENV_VARS = [
  "GIT_ALTERNATE_OBJECT_DIRECTORIES",
  "GIT_COMMON_DIR",
  "GIT_DIR",
  "GIT_GRAFT_FILE",
  "GIT_IMPLICIT_WORK_TREE",
  "GIT_INDEX_FILE",
  "GIT_NO_REPLACE_OBJECTS",
  "GIT_OBJECT_DIRECTORY",
  "GIT_PREFIX",
  "GIT_REPLACE_REF_BASE",
  "GIT_SHALLOW_FILE",
  "GIT_WORK_TREE",
];

function gitEnv(): NodeJS.ProcessEnv {
  const env = { ...process.env };
  for (const name of GIT_LOCAL_ENV_VARS) delete env[name];
  return env;
}

function git(cwd: string, ...args: string[]): string {
  return execFileSync("git", args, { cwd, encoding: "utf8", env: gitEnv() }).trim();
}

type Fixture = {
  repo: string;
  worktreeBase: string;
  schedulePath: string;
  executionPath: string;
  context: WorktreeOpsContext;
};

const fixtures: Fixture[] = [];

function writeFile(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function setupRepository(): Fixture {
  const repo = mkdtempSync(join(tmpdir(), "specdojo-worktree-ops-repo-"));
  const worktreeBase = mkdtempSync(join(tmpdir(), "specdojo-worktree-ops-base-"));
  const schedulePath = join(repo, "schedule");
  const executionPath = join(repo, "execution");
  mkdirSync(schedulePath, { recursive: true });
  mkdirSync(join(executionPath, "exec", "events"), { recursive: true });
  mkdirSync(join(executionPath, "exec", "plans"), { recursive: true });
  mkdirSync(join(executionPath, "exec", "results"), { recursive: true });

  writeFileSync(join(repo, "README.md"), "# test\n", "utf8");
  git(repo, "init");
  git(repo, "config", "user.name", "SpecDojo Test");
  git(repo, "config", "user.email", "specdojo@example.invalid");
  git(repo, "add", "README.md");
  git(repo, "commit", "-m", "initial");

  // The scheduler lock used by merge resolves the execution root from these env vars.
  process.env.SPECDOJO_SCHEDULE_PATH = schedulePath;
  process.env.SPECDOJO_EXECUTION_PATH = executionPath;
  delete process.env.SPECDOJO_PROJECT;

  const fixture: Fixture = {
    repo,
    worktreeBase,
    schedulePath,
    executionPath,
    context: { repoRoot: repo, schedulePath, executionPath },
  };
  fixtures.push(fixture);
  return fixture;
}

// Scaffold the execution-management files a claimed task starts with: plan, result, claim event.
function scaffoldTask(
  fixture: Fixture,
  taskId: string,
): { planPath: string; resultPath: string; claimEventPath: string } {
  const planPath = join(fixture.executionPath, "exec", "plans", `${taskId}-plan.md`);
  const resultPath = join(fixture.executionPath, "exec", "results", `${taskId}-result.md`);
  const claimEventPath = join(
    fixture.executionPath,
    "exec",
    "events",
    `20260613T000000Z_agent_${taskId}_claim.json`,
  );
  writeFile(planPath, `# Plan ${taskId}\n`);
  writeFile(resultPath, `# Result ${taskId}\n\nstatus: in_progress\n`);
  writeFile(
    claimEventPath,
    JSON.stringify({
      v: 1,
      ts: "2026-06-13T00:00:00Z",
      type: "claim",
      task_id: taskId,
      by: "edit-agent",
    }) + "\n",
  );
  return { planPath, resultPath, claimEventPath };
}

function prepare(fixture: Fixture, taskId: string, worktreeTaskId: string = taskId): ExecWorktree {
  const { planPath, resultPath, claimEventPath } = scaffoldTask(fixture, taskId);
  return checkpointAndEnsureWorktree({
    context: fixture.context,
    taskId,
    worktreeTaskId,
    base: fixture.worktreeBase,
    planPath,
    resultPath,
    claimEventPath,
  });
}

afterEach(() => {
  while (fixtures.length > 0) {
    const fixture = fixtures.pop()!;
    const registered = git(fixture.repo, "worktree", "list", "--porcelain");
    for (const line of registered.split("\n")) {
      if (!line.startsWith("worktree ")) continue;
      const path = line.slice("worktree ".length);
      if (path !== fixture.repo) {
        try {
          git(fixture.repo, "worktree", "remove", "--force", path);
        } catch {
          // best effort cleanup
        }
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

describe("exec worktree ops", () => {
  it("checkpoints, commits, and merges a task so its deliverable lands on root", () => {
    const fixture = setupRepository();
    const taskId = "T-T-doc-010";

    const worktree = prepare(fixture, taskId);
    expect(git(fixture.repo, "log", "-1", "--pretty=%s")).toBe(
      `exec(${taskId}): prepare execution`,
    );

    // Agent edits a deliverable and updates its result inside the worktree.
    writeFile(join(worktree.path, "docs", "a.md"), "v1 from task 010\n");
    writeFile(
      join(worktree.path, "execution", "exec", "results", `${taskId}-result.md`),
      `# Result ${taskId}\n\nstatus: complete\n`,
    );

    const committed = commitWorktreeChanges({ context: fixture.context, worktree, taskId });
    expect(committed.committed).toBe(true);
    expect(committed.targets).toContain("docs/a.md");
    expect(committed.targets).toContain(`execution/exec/results/${taskId}-result.md`);

    mergeWorktreeIntoCurrent({ context: fixture.context, worktree, taskId });
    expect(readFileSync(join(fixture.repo, "docs", "a.md"), "utf8")).toBe("v1 from task 010\n");
    expect(
      readFileSync(
        join(fixture.repo, "execution", "exec", "results", `${taskId}-result.md`),
        "utf8",
      ),
    ).toContain("status: complete");
  });

  it("discards a stale worktree/branch left by a prior lifecycle so a fresh claim checkpoints cleanly", () => {
    const fixture = setupRepository();
    const taskId = "T-T-doc-010";

    // Prior lifecycle: the task was prepared (worktree + exec branch) but ended blocked and was
    // never merged. Rewind root HEAD so the checkpoint commit is gone but the exec branch remains,
    // exactly the residue a re-claim faces.
    const stale = prepare(fixture, taskId);
    expect(findExecWorktree(fixture.repo, taskId)).not.toBeNull();
    git(fixture.repo, "reset", "--hard", "HEAD~1");

    // Fresh claim rewrites the root scaffold as untracked files.
    scaffoldTask(fixture, taskId);

    const discarded = discardStaleExecWorktree({
      context: fixture.context,
      worktreeTaskId: taskId,
    });

    expect(discarded).toBe(stale.branch);
    expect(findExecWorktree(fixture.repo, taskId)).toBeNull();
    expect(() =>
      git(fixture.repo, "rev-parse", "--verify", `refs/heads/${stale.branch}`),
    ).toThrow();

    // Re-preparing now creates a fresh worktree and commits the root scaffold as a new checkpoint.
    const worktree = prepare(fixture, taskId);
    expect(worktree.created).toBe(true);
    expect(git(fixture.repo, "log", "-1", "--pretty=%s")).toBe(
      `exec(${taskId}): prepare execution`,
    );
  });

  it("returns null when no stale worktree or branch exists for the task", () => {
    const fixture = setupRepository();

    expect(
      discardStaleExecWorktree({ context: fixture.context, worktreeTaskId: "T-T-doc-999" }),
    ).toBeNull();
  });

  it("makes a merged task deliverable visible to the next task worktree", () => {
    const fixture = setupRepository();

    // Task 010: edit a shared deliverable, then commit + merge + remove.
    const wt1 = prepare(fixture, "T-T-doc-010");
    writeFile(join(wt1.path, "docs", "shared.md"), "produced by task 010\n");
    commitWorktreeChanges({ context: fixture.context, worktree: wt1, taskId: "T-T-doc-010" });
    mergeWorktreeIntoCurrent({ context: fixture.context, worktree: wt1, taskId: "T-T-doc-010" });
    removeWorktree({
      context: fixture.context,
      worktree: wt1,
      taskId: "T-T-doc-010",
      deleteBranch: true,
    });

    // Task 020 branches from the updated root HEAD and must see task 010's deliverable.
    const wt2 = prepare(fixture, "T-T-doc-020");
    expect(readFileSync(join(wt2.path, "docs", "shared.md"), "utf8")).toBe(
      "produced by task 010\n",
    );
  });

  it("aborts a conflicting merge so the tree is not left mid-merge", () => {
    const fixture = setupRepository();
    const taskId = "T-T-doc-010";
    const worktree = prepare(fixture, taskId);

    // Root and the exec branch both add the same deliverable with different content: an add/add
    // conflict that git cannot auto-resolve.
    writeFile(join(fixture.repo, "docs", "conflict.md"), "root version\n");
    git(fixture.repo, "add", "docs/conflict.md");
    git(fixture.repo, "commit", "-m", "root edits conflict.md");

    writeFile(join(worktree.path, "docs", "conflict.md"), "branch version\n");
    commitWorktreeChanges({ context: fixture.context, worktree, taskId });

    expect(() =>
      mergeWorktreeIntoCurrent({ context: fixture.context, worktree, taskId }),
    ).toThrow();

    // The failed merge must be rolled back: no merge in progress and the working tree is clean.
    expect(() => git(fixture.repo, "rev-parse", "--verify", "MERGE_HEAD")).toThrow();
    expect(git(fixture.repo, "status", "--porcelain")).toBe("");
    expect(readFileSync(join(fixture.repo, "docs", "conflict.md"), "utf8")).toBe("root version\n");
  });

  it("excludes plans, events, and generated files from the task commit", () => {
    const fixture = setupRepository();
    const taskId = "T-T-doc-010";
    const worktree = prepare(fixture, taskId);

    // Simulate an agent that also touches a plan and a generated file (must not be committed).
    writeFile(join(worktree.path, "docs", "a.md"), "deliverable\n");
    writeFile(
      join(worktree.path, "execution", "exec", "plans", `${taskId}-plan.md`),
      "# Plan edited\n",
    );
    writeFile(join(worktree.path, "execution", "generated", "state.json"), "{}\n");
    writeFile(
      join(worktree.path, "execution", "exec", "results", `${taskId}-result.md`),
      `# Result ${taskId}\n\nstatus: complete\n`,
    );

    const committed = commitWorktreeChanges({ context: fixture.context, worktree, taskId });
    expect(committed.targets).toEqual(
      expect.arrayContaining(["docs/a.md", `execution/exec/results/${taskId}-result.md`]),
    );
    expect(committed.targets).not.toContain(`execution/exec/plans/${taskId}-plan.md`);
    expect(committed.targets).not.toContain("execution/generated/state.json");

    // Excluded files remain uncommitted in the worktree.
    const stillDirty = git(worktree.path, "status", "--porcelain");
    expect(stillDirty).toContain(`execution/exec/plans/${taskId}-plan.md`);
    expect(stillDirty).toContain("execution/generated/");
  });

  it("namespaces the branch and worktree by project while keeping the bare task id for the checkpoint", () => {
    const fixture = setupRepository();
    const taskId = "T-T-doc-010";
    const worktreeTaskId = `prj-0001:${taskId}`;

    const worktree = prepare(fixture, taskId, worktreeTaskId);

    // Branch and worktree name are project-qualified (`:` normalized to `-`).
    expect(worktree.branch).toBe("exec/prj-0001-T-T-doc-010");
    expect(worktree.name).toBe("prj-0001-T-T-doc-010");

    // The checkpoint commit and lookup keep the bare task id.
    expect(git(fixture.repo, "log", "-1", "--pretty=%s")).toBe(
      `exec(${taskId}): prepare execution`,
    );
    expect(findExecWorktree(fixture.repo, worktreeTaskId)).toEqual({ ...worktree, created: false });
    expect(findExecWorktree(fixture.repo, taskId)).toBeNull();
  });

  it("removes a merged worktree and deletes its exec branch", () => {
    const fixture = setupRepository();
    const taskId = "T-T-doc-010";
    const worktree = prepare(fixture, taskId);
    writeFile(join(worktree.path, "docs", "a.md"), "deliverable\n");
    commitWorktreeChanges({ context: fixture.context, worktree, taskId });
    mergeWorktreeIntoCurrent({ context: fixture.context, worktree, taskId });

    removeWorktree({ context: fixture.context, worktree, taskId, deleteBranch: true });

    expect(findExecWorktree(fixture.repo, taskId)).toBeNull();
    expect(() =>
      git(fixture.repo, "show-ref", "--verify", `refs/heads/${worktree.branch}`),
    ).toThrow();
  });

  it('blocks committing when an agent promotes a new deliverable to "ready"', () => {
    const fixture = setupRepository();
    const taskId = "T-T-doc-010";
    const worktree = prepare(fixture, taskId);

    // Agent creates a deliverable already promoted to ready (ready is a human-only gate).
    writeFile(join(worktree.path, "docs", "d.yaml"), "id: d\ntype: spec\nstatus: ready\n");

    expect(() => commitWorktreeChanges({ context: fixture.context, worktree, taskId })).toThrow(
      /promotion to "ready" is human-only.*docs\/d\.yaml/,
    );

    // Nothing was committed: the worktree HEAD is still the prepare checkpoint.
    expect(git(worktree.path, "log", "-1", "--pretty=%s")).toBe(
      `exec(${taskId}): prepare execution`,
    );
  });

  it('blocks committing when an agent flips an existing deliverable from draft to "ready"', () => {
    const fixture = setupRepository();
    // A draft deliverable exists at root before the task runs.
    writeFile(join(fixture.repo, "docs", "d.yaml"), "id: d\ntype: spec\nstatus: draft\n");
    git(fixture.repo, "add", "docs/d.yaml");
    git(fixture.repo, "commit", "-m", "add draft deliverable");

    const taskId = "T-T-doc-010";
    const worktree = prepare(fixture, taskId);
    writeFile(join(worktree.path, "docs", "d.yaml"), "id: d\ntype: spec\nstatus: ready\n");

    expect(() => commitWorktreeChanges({ context: fixture.context, worktree, taskId })).toThrow(
      /promotion to "ready" is human-only/,
    );
  });

  it("allows committing deliverable edits that keep the status unpromoted", () => {
    const fixture = setupRepository();
    const taskId = "T-T-doc-010";
    const worktree = prepare(fixture, taskId);

    writeFile(
      join(worktree.path, "docs", "d.yaml"),
      "id: d\ntype: spec\nstatus: draft\nbody: edited\n",
    );

    const committed = commitWorktreeChanges({ context: fixture.context, worktree, taskId });
    expect(committed.committed).toBe(true);
    expect(committed.targets).toContain("docs/d.yaml");
  });

  it("removes a merged worktree even when only regenerated bookkeeping is dirty", () => {
    const fixture = setupRepository();
    const taskId = "T-T-doc-010";
    const worktree = prepare(fixture, taskId);
    writeFile(join(worktree.path, "docs", "a.md"), "deliverable\n");
    commitWorktreeChanges({ context: fixture.context, worktree, taskId });
    mergeWorktreeIntoCurrent({ context: fixture.context, worktree, taskId });

    // A regenerated, non-commit-target file (e.g. doc-index) left dirty in the worktree must not
    // block removal: git would refuse without --force, but the tool forces past it automatically.
    writeFile(join(worktree.path, ".specdojo", "doc-index.json"), '{"regenerated":true}\n');

    removeWorktree({ context: fixture.context, worktree, taskId, deleteBranch: true });

    expect(findExecWorktree(fixture.repo, taskId)).toBeNull();
  });
});

describe("deliverableStatus", () => {
  it("reads status from markdown frontmatter", () => {
    expect(deliverableStatus("---\nid: d\nstatus: ready\n---\n\n# Title\n", "docs/d.md")).toBe(
      "ready",
    );
  });

  it("reads top-level status from yaml deliverables", () => {
    expect(deliverableStatus("id: d\nstatus: draft\n", "docs/d.yaml")).toBe("draft");
  });

  it("reads top-level status from json deliverables", () => {
    expect(deliverableStatus('{"id":"d","status":"ready"}', "docs/d.json")).toBe("ready");
  });

  it("returns undefined when status is absent or content is unparsable", () => {
    expect(deliverableStatus("# Title only\n", "docs/d.md")).toBeUndefined();
    expect(deliverableStatus("id: d\n", "docs/d.yaml")).toBeUndefined();
  });
});
