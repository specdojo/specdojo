import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  captureAgentProtectedConfigAcrossRepos,
  changedAgentProtectedConfigAcrossRepos,
  qualifiedRepoPaths,
} from "../../src/exec-agent-protected-config.js";
import {
  captureAgentGitStateAcrossRepos,
  changedAgentGitStateAcrossRepos,
  qualifiedGitStateFields,
} from "../../src/exec-agent-git-state.js";
import { recordExecutorEvidence, snapshotWorktreeChanges } from "../../src/exec-evidence.js";
import {
  listOrphanedProductExecBranches,
  productRepoEnvironment,
  pruneOrphanedProductExecBranches,
  withProductWorktrees,
  type ProductRepo,
} from "../../src/exec-task-repos.js";
import { gitOutput, gitResult, type ExecWorktree } from "../../src/exec-worktree.js";
import {
  checkpointAndEnsureWorktree,
  commitWorktreeChanges,
  discardStaleExecWorktree,
  mergeWorktreeIntoCurrent,
  removeWorktree,
  type WorktreeOpsContext,
} from "../../src/exec-worktree-ops.js";

const ENV_KEYS = ["SPECDOJO_PROJECT", "SPECDOJO_SCHEDULE_PATH", "SPECDOJO_EXECUTION_PATH"];
const originalEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));

const TASK_ID = "T-T-doc-010";
const WORKTREE_TASK_ID = `prj-0001:${TASK_ID}`;
const TASK_DIR_NAME = "prj-0001-T-T-doc-010";

function git(cwd: string, ...args: string[]): string {
  return gitOutput(cwd, args).trim();
}

function writeFile(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

type Fixture = {
  parent: string;
  repo: string;
  worktreeBase: string;
  schedulePath: string;
  executionPath: string;
  context: WorktreeOpsContext;
  products: ProductRepo[];
};

const fixtures: Fixture[] = [];

function initRepository(path: string): void {
  mkdirSync(path, { recursive: true });
  writeFileSync(join(path, "README.md"), `# ${path}\n`, "utf8");
  git(path, "init");
  git(path, "add", "README.md");
  git(path, "commit", "-m", "initial");
}

// <parent>/app1-specdojo is the project repository; app1 and app2 are product repositories
// beside it. app2 declares integration_branch "release", which is ahead of its current branch.
function setup(options: { withProducts?: boolean } = {}): Fixture {
  const parent = mkdtempSync(join(tmpdir(), "specdojo-task-repos-"));
  const repo = join(parent, "app1-specdojo");
  const worktreeBase = join(parent, "worktrees");
  const schedulePath = join(repo, "schedule");
  const executionPath = join(repo, "execution");
  initRepository(repo);
  mkdirSync(schedulePath, { recursive: true });
  for (const dir of ["events", "plans", "results"]) {
    mkdirSync(join(executionPath, "exec", dir), { recursive: true });
  }

  const products: ProductRepo[] = [];
  if (options.withProducts !== false) {
    const app1 = join(parent, "app1");
    const app2 = join(parent, "app2");
    initRepository(app1);
    initRepository(app2);
    git(app2, "branch", "release");
    git(app2, "checkout", "release");
    writeFile(join(app2, "RELEASE.md"), "release only\n");
    git(app2, "add", "RELEASE.md");
    git(app2, "commit", "-m", "release commit");
    git(app2, "checkout", "-");
    products.push(
      { name: "app1", repoRoot: app1, install: true, build: true },
      { name: "app2", repoRoot: app2, integrationBranch: "release", install: true, build: true },
    );
  }

  process.env.SPECDOJO_SCHEDULE_PATH = schedulePath;
  process.env.SPECDOJO_EXECUTION_PATH = executionPath;
  delete process.env.SPECDOJO_PROJECT;

  const fixture: Fixture = {
    parent,
    repo,
    worktreeBase,
    schedulePath,
    executionPath,
    context: { repoRoot: repo, schedulePath, executionPath },
    products,
  };
  fixtures.push(fixture);
  return fixture;
}

function checkpointPaths(fixture: Fixture): string[] {
  const planPath = join(fixture.executionPath, "exec", "plans", `${TASK_ID}-plan.md`);
  const resultPath = join(fixture.executionPath, "exec", "results", `${TASK_ID}-result.md`);
  const claimPath = join(
    fixture.executionPath,
    "exec",
    "events",
    `20260613T000000Z_agent_${TASK_ID}_claim.json`,
  );
  if (!existsSync(planPath)) writeFile(planPath, `# Plan ${TASK_ID}\n`);
  if (!existsSync(resultPath)) writeFile(resultPath, `# Result ${TASK_ID}\n`);
  if (!existsSync(claimPath)) {
    writeFile(
      claimPath,
      JSON.stringify({ v: 1, ts: "2026-06-13T00:00:00Z", type: "claim", task_id: TASK_ID }) + "\n",
    );
  }
  return [planPath, resultPath, claimPath];
}

function prepare(fixture: Fixture): ExecWorktree {
  return checkpointAndEnsureWorktree({
    context: fixture.context,
    worktreeTaskId: WORKTREE_TASK_ID,
    base: fixture.worktreeBase,
    checkpointPaths: checkpointPaths(fixture),
    commitMessage: `exec(${TASK_ID}): prepare execution`,
    products: fixture.products,
  });
}

function branchExists(repoRoot: string, branch: string): boolean {
  return (
    gitResult(repoRoot, ["show-ref", "--verify", "--quiet", `refs/heads/${branch}`]).status === 0
  );
}

function removeRegisteredWorktrees(repoRoot: string): void {
  if (!existsSync(repoRoot)) return;
  for (const line of git(repoRoot, "worktree", "list", "--porcelain").split("\n")) {
    if (!line.startsWith("worktree ")) continue;
    const path = line.slice("worktree ".length);
    if (path === repoRoot) continue;
    try {
      git(repoRoot, "worktree", "remove", "--force", path);
    } catch {
      // best effort cleanup
    }
  }
}

afterEach(() => {
  while (fixtures.length > 0) {
    const fixture = fixtures.pop()!;
    try {
      removeRegisteredWorktrees(fixture.repo);
      for (const product of fixture.products) removeRegisteredWorktrees(product.repoRoot);
    } finally {
      rmSync(fixture.parent, { recursive: true, force: true });
    }
  }
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

describe("multi-repository task worktrees", () => {
  it("creates <base>/<task>/project and one worktree per product repository", () => {
    const fixture = setup();

    const worktree = prepare(fixture);

    const taskDir = join(fixture.worktreeBase, TASK_DIR_NAME);
    expect(worktree.path).toBe(join(taskDir, "project"));
    expect(worktree.branch).toBe(`exec/${TASK_DIR_NAME}`);
    expect(worktree.repos?.map((product) => [product.name, product.path, product.branch])).toEqual([
      ["app1", join(taskDir, "app1"), `exec/${TASK_DIR_NAME}`],
      ["app2", join(taskDir, "app2"), `exec/${TASK_DIR_NAME}`],
    ]);
    expect(git(worktree.path, "log", "-1", "--pretty=%s")).toBe(
      `exec(${TASK_ID}): prepare execution`,
    );
    // Product branches start from the integration target without the project checkpoint.
    expect(git(join(taskDir, "app1"), "log", "-1", "--pretty=%s")).toBe("initial");
    expect(git(join(taskDir, "app2"), "log", "-1", "--pretty=%s")).toBe("release commit");
  });

  it("reuses every worktree of the task on a second prepare", () => {
    const fixture = setup();
    prepare(fixture);

    const reused = prepare(fixture);

    expect(reused.created).toBe(false);
    expect(reused.repos?.map((product) => product.created)).toEqual([false, false]);
  });

  it("passes product worktree paths to the agent as SPECDOJO_REPO_<NAME>", () => {
    const fixture = setup();
    const worktree = prepare(fixture);

    const env = productRepoEnvironment(worktree.path, worktree.repos);

    expect(env).toEqual({
      SPECDOJO_REPO_PROJECT: worktree.path,
      SPECDOJO_REPO_NAMES: "app1,app2",
      SPECDOJO_REPO_APP1: worktree.repos?.[0]?.path,
      SPECDOJO_REPO_APP2: worktree.repos?.[1]?.path,
    });
  });

  it("refuses to commit the project side while a product worktree has changes", () => {
    const fixture = setup();
    const worktree = prepare(fixture);
    writeFile(join(worktree.path, "docs", "a.md"), "project change\n");
    writeFile(join(worktree.repos![1]!.path, "src", "feature.ts"), "export {};\n");

    expect(() =>
      commitWorktreeChanges({ context: fixture.context, worktree, taskId: TASK_ID }),
    ).toThrow(
      /product repository changes cannot be integrated yet: app2 \(uncommitted app2:src\/feature\.ts\)/,
    );
    expect(git(worktree.path, "log", "-1", "--pretty=%s")).toBe(
      `exec(${TASK_ID}): prepare execution`,
    );
  });

  it("removes every repository worktree, branch, and the task directory after integration", () => {
    const fixture = setup();
    const worktree = prepare(fixture);
    writeFile(join(worktree.path, "docs", "a.md"), "project change\n");
    commitWorktreeChanges({ context: fixture.context, worktree, taskId: TASK_ID });
    mergeWorktreeIntoCurrent({
      context: fixture.context,
      worktree,
      taskId: TASK_ID,
      releaseRootPaths: checkpointPaths(fixture),
    });

    removeWorktree({ context: fixture.context, worktree, taskId: TASK_ID, deleteBranch: true });

    expect(existsSync(join(fixture.worktreeBase, TASK_DIR_NAME))).toBe(false);
    expect(branchExists(fixture.repo, worktree.branch)).toBe(false);
    for (const product of fixture.products) {
      expect(branchExists(product.repoRoot, worktree.branch)).toBe(false);
    }
    expect(readFileSync(join(fixture.repo, "docs", "a.md"), "utf8")).toBe("project change\n");
  });

  it("removes no worktree while any product worktree cannot be removed", () => {
    const fixture = setup();
    const worktree = prepare(fixture);
    writeFile(join(worktree.path, "docs", "a.md"), "project change\n");
    commitWorktreeChanges({ context: fixture.context, worktree, taskId: TASK_ID });
    mergeWorktreeIntoCurrent({
      context: fixture.context,
      worktree,
      taskId: TASK_ID,
      releaseRootPaths: checkpointPaths(fixture),
    });
    writeFile(join(worktree.repos![0]!.path, "late.txt"), "late product change\n");

    expect(() =>
      removeWorktree({ context: fixture.context, worktree, taskId: TASK_ID, deleteBranch: true }),
    ).toThrow(/Product worktrees cannot be removed: app1 has uncommitted changes: app1:late\.txt/);
    expect(existsSync(worktree.path)).toBe(true);
    expect(worktree.repos?.every((product) => existsSync(product.path))).toBe(true);
  });

  it("discards stale worktrees and exec branches of every repository", () => {
    const fixture = setup();
    const worktree = prepare(fixture);
    writeFile(join(worktree.repos![0]!.path, "abandoned.txt"), "abandoned\n");

    const discarded = discardStaleExecWorktree({
      context: fixture.context,
      worktreeTaskId: WORKTREE_TASK_ID,
      products: fixture.products,
    });

    expect(discarded).toBe(
      `exec/${TASK_DIR_NAME}, app1:exec/${TASK_DIR_NAME}, app2:exec/${TASK_DIR_NAME}`,
    );
    expect(existsSync(join(fixture.worktreeBase, TASK_DIR_NAME))).toBe(false);
    for (const repoRoot of [fixture.repo, ...fixture.products.map((product) => product.repoRoot)]) {
      expect(branchExists(repoRoot, worktree.branch)).toBe(false);
    }
  });

  it("detects orphaned product exec branches and prunes only merged ones", () => {
    const fixture = setup();
    const [app1, app2] = fixture.products;
    git(app1!.repoRoot, "branch", "exec/prj-0001-T-merged");
    git(app2!.repoRoot, "branch", "exec/prj-0001-T-unmerged", "release");
    git(app2!.repoRoot, "checkout", "exec/prj-0001-T-unmerged");
    writeFile(join(app2!.repoRoot, "unmerged.txt"), "work\n");
    git(app2!.repoRoot, "add", "unmerged.txt");
    git(app2!.repoRoot, "commit", "-m", "unmerged work");
    git(app2!.repoRoot, "checkout", "-");
    git(app1!.repoRoot, "branch", "exec/prj-0002-T-other");

    const orphaned = listOrphanedProductExecBranches(fixture.products, "prj-0001");
    const pruned = pruneOrphanedProductExecBranches({
      products: fixture.products,
      projectId: "prj-0001",
    });

    expect(orphaned).toEqual([
      { repo: "app1", branch: "exec/prj-0001-T-merged", mergedIntoTarget: true },
      { repo: "app2", branch: "exec/prj-0001-T-unmerged", mergedIntoTarget: false },
    ]);
    expect(pruned).toEqual(orphaned);
    expect(branchExists(app1!.repoRoot, "exec/prj-0001-T-merged")).toBe(false);
    expect(branchExists(app2!.repoRoot, "exec/prj-0001-T-unmerged")).toBe(true);
    expect(branchExists(app1!.repoRoot, "exec/prj-0002-T-other")).toBe(true);
  });

  it("detects protected configuration and Git state changes per repository", () => {
    const fixture = setup();
    const worktree = prepare(fixture);
    const repos = [
      { root: worktree.path },
      ...worktree.repos!.map((product) => ({ name: product.name, root: product.path })),
    ];
    const protectedBefore = captureAgentProtectedConfigAcrossRepos(repos);
    const gitStateBefore = captureAgentGitStateAcrossRepos(repos);

    writeFile(join(worktree.repos![0]!.path, "package.json"), "{}\n");
    writeFile(join(worktree.repos![1]!.path, "agent.txt"), "agent commit\n");
    git(worktree.repos![1]!.path, "add", "agent.txt");
    git(worktree.repos![1]!.path, "commit", "-m", "agent commit");

    expect(qualifiedRepoPaths(changedAgentProtectedConfigAcrossRepos(protectedBefore))).toEqual([
      "app1:package.json",
    ]);
    expect(qualifiedGitStateFields(changedAgentGitStateAcrossRepos(gitStateBefore))).toEqual([
      "app2:HEAD",
    ]);
  });

  it("records product changes in executor evidence as <repo>:<path>", () => {
    const fixture = setup();
    const worktree = prepare(fixture);
    const products = worktree.repos!.map((product) => ({ name: product.name, path: product.path }));
    writeFile(join(worktree.path, "docs", "a.md"), "project change\n");
    writeFile(join(worktree.repos![0]!.path, "src", "index.ts"), "export {};\n");
    const before = snapshotWorktreeChanges(worktree.path, products);

    const recorded = recordExecutorEvidence({
      repoRoot: fixture.repo,
      worktreePath: worktree.path,
      executionPath: fixture.executionPath,
      taskId: TASK_ID,
      runId: "run-1",
      actor: "edit-agent",
      status: "succeeded",
      startedAt: "2026-06-13T00:00:00Z",
      completedAt: "2026-06-13T00:01:00Z",
      exitCode: 0,
      attempts: 1,
      stdout: "",
      stderr: "",
      productWorktrees: products,
    });

    expect([...before.keys()].sort()).toEqual(["app1:src/index.ts", "docs/a.md"]);
    expect(recorded.evidence.changes.map((change) => change.path).sort()).toEqual([
      "app1:src/index.ts",
      "docs/a.md",
    ]);
  });

  it("keeps the single <base>/<task>/ worktree for projects without repos", () => {
    const fixture = setup({ withProducts: false });

    const worktree = prepare(fixture);

    expect(worktree.path).toBe(join(fixture.worktreeBase, TASK_DIR_NAME));
    expect(worktree.repos).toBeUndefined();
    expect(withProductWorktrees(worktree, [], WORKTREE_TASK_ID)).toBe(worktree);
    removeWorktree({
      context: fixture.context,
      worktree,
      taskId: TASK_ID,
      force: true,
      deleteBranch: false,
    });
    expect(existsSync(worktree.path)).toBe(false);
  });
});
