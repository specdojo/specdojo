import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
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
  productIntegrationTarget,
  productRepoEnvironment,
  pruneOrphanedProductExecBranches,
  withProductWorktrees,
  type ProductRepo,
} from "../../src/exec-task-repos.js";
import { gitOutput, gitResult, type ExecWorktree } from "../../src/exec-worktree.js";
import {
  commitProductWorktrees,
  integrateTaskRepositories,
  projectMergeBlockers,
  syncTaskWorktreesWithIntegrationTargets,
  type RepoIntegrationRecorder,
} from "../../src/exec-repo-integration.js";
import {
  productIntegrationTrace,
  recordResultTrace,
  refsTrailer,
  withCommitTrailers,
} from "../../src/exec-repo-trace.js";
import {
  checkpointAndEnsureWorktree,
  commitWorktreeChanges,
  currentBranch,
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

function commitIntegrationFixture(worktree: ExecWorktree): void {
  for (const product of worktree.repos ?? []) {
    writeFile(join(product.path, `${product.name}.txt`), `${product.name} change\n`);
    git(product.path, "add", `${product.name}.txt`);
    git(product.path, "commit", "-m", `change ${product.name}`);
  }
  writeFile(join(worktree.path, "project.txt"), "project change\n");
  git(worktree.path, "add", "project.txt");
  git(worktree.path, "commit", "-m", "change project");
}

function rejectMergeCommit(repoRoot: string): () => void {
  const hook = join(repoRoot, ".git", "hooks", "pre-merge-commit");
  writeFile(hook, "#!/bin/sh\necho intentional merge failure >&2\nexit 1\n");
  chmodSync(hook, 0o755);
  return () => rmSync(hook, { force: true });
}

function integrateFixture(
  fixture: Fixture,
  worktree: ExecWorktree,
  record: RepoIntegrationRecorder = () => undefined,
): void {
  // checkpointAndEnsureWorktree leaves the runner-owned plan / result / claim copies visible in
  // the integration-target checkout. The production register path releases exactly these paths
  // before merging, so the preflight fixture must apply the same exclusion instead of treating
  // its own bookkeeping as an overlapping user change.
  const releasePaths = checkpointPaths(fixture);
  integrateTaskRepositories({
    worktree,
    mergeMessage: `exec(${TASK_ID}): integrate repositories`,
    checkProject: () =>
      projectMergeBlockers({
        context: fixture.context,
        worktree,
        taskId: TASK_ID,
        releasePaths,
      }),
    beforeProjectMerge: () => undefined,
    mergeProject: () =>
      mergeWorktreeIntoCurrent({
        context: fixture.context,
        worktree,
        taskId: TASK_ID,
        message: `exec(${TASK_ID}): integrate repositories`,
        releaseRootPaths: releasePaths,
      }),
    record,
  });
}

function lastRecordedStatus(
  records: ReadonlyArray<readonly [repo: string, status: string | undefined]>,
  repo: string,
): string | undefined {
  for (let index = records.length - 1; index >= 0; index -= 1) {
    if (records[index]?.[0] === repo) return records[index]?.[1];
  }
  return undefined;
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

  it("refuses to commit the project side while a product worktree has changes outside exec run integration", () => {
    const fixture = setup();
    const worktree = prepare(fixture);
    writeFile(join(worktree.path, "docs", "a.md"), "project change\n");
    writeFile(join(worktree.repos![1]!.path, "src", "feature.ts"), "export {};\n");

    expect(() =>
      commitWorktreeChanges({ context: fixture.context, worktree, taskId: TASK_ID }),
    ).toThrow(
      /product repository changes are not integrated: app2 \(uncommitted app2:src\/feature\.ts\)/,
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

  it("keeps every repository pending when the first product merge fails, then resumes", () => {
    const fixture = setup();
    const worktree = prepare(fixture);
    commitIntegrationFixture(worktree);
    const app1 = worktree.repos![0]!;
    const removeHook = rejectMergeCommit(app1.repoRoot);
    const records: Array<readonly [string, string | undefined]> = [];
    const record: RepoIntegrationRecorder = (repo, patch) => {
      records.push([repo, patch.status]);
    };

    expect(() => integrateFixture(fixture, worktree, record)).toThrow(
      /integrated repositories: none; not integrated: app1, app2, project/,
    );
    expect(lastRecordedStatus(records, "app1")).toBe("failed");
    expect(lastRecordedStatus(records, "app2")).toBe("pending");
    expect(lastRecordedStatus(records, "project")).toBe("pending");
    expect(
      gitResult(app1.repoRoot, [
        "merge-base",
        "--is-ancestor",
        app1.branch,
        productIntegrationTarget(app1),
      ]).status,
    ).toBe(1);

    removeHook();
    integrateFixture(fixture, worktree, record);
    expect(lastRecordedStatus(records, "app1")).toBe("merged");
    expect(lastRecordedStatus(records, "app2")).toBe("merged");
    expect(lastRecordedStatus(records, "project")).toBe("merged");
    for (const product of worktree.repos!) {
      expect(
        gitResult(product.repoRoot, [
          "merge-base",
          "--is-ancestor",
          product.branch,
          productIntegrationTarget(product),
        ]).status,
      ).toBe(0);
    }
    expect(
      gitResult(fixture.repo, ["merge-base", "--is-ancestor", worktree.branch, "HEAD"]).status,
    ).toBe(0);
  });

  it("does not merge an earlier product when a later repository fails preflight", () => {
    const fixture = setup();
    const worktree = prepare(fixture);
    commitIntegrationFixture(worktree);
    const [app1, app2] = worktree.repos!;
    git(app2!.repoRoot, "checkout", "release");
    writeFile(join(app2!.repoRoot, "app2.txt"), "conflicting target change\n");
    git(app2!.repoRoot, "add", "app2.txt");
    git(app2!.repoRoot, "commit", "-m", "conflict on integration target");

    expect(() => integrateFixture(fixture, worktree)).toThrow(
      /pre-integration check failed \(no repository was integrated in this attempt\)/,
    );
    expect(
      gitResult(app1!.repoRoot, [
        "merge-base",
        "--is-ancestor",
        app1!.branch,
        productIntegrationTarget(app1!),
      ]).status,
    ).toBe(1);
    expect(
      gitResult(fixture.repo, ["merge-base", "--is-ancestor", worktree.branch, "HEAD"]).status,
    ).toBe(1);
  });

  it("allows unrelated uncommitted files on product and project integration targets", () => {
    const fixture = setup();
    const worktree = prepare(fixture);
    commitIntegrationFixture(worktree);
    const app1 = worktree.repos![0]!;
    writeFile(join(app1.repoRoot, "local-notes.txt"), "unrelated product work\n");
    writeFile(join(fixture.repo, "local-notes.txt"), "unrelated project work\n");

    integrateFixture(fixture, worktree);

    expect(readFileSync(join(app1.repoRoot, "local-notes.txt"), "utf8")).toBe(
      "unrelated product work\n",
    );
    expect(readFileSync(join(fixture.repo, "local-notes.txt"), "utf8")).toBe(
      "unrelated project work\n",
    );
    expect(
      gitResult(fixture.repo, ["merge-base", "--is-ancestor", worktree.branch, "HEAD"]).status,
    ).toBe(0);
  });

  it("records the first product as integrated when the second fails and skips it on resume", () => {
    const fixture = setup();
    const worktree = prepare(fixture);
    commitIntegrationFixture(worktree);
    const [app1, app2] = worktree.repos!;
    git(app2!.repoRoot, "checkout", "release");
    const removeHook = rejectMergeCommit(app2!.repoRoot);
    const records: Array<readonly [string, string | undefined]> = [];
    const record: RepoIntegrationRecorder = (repo, patch) => {
      records.push([repo, patch.status]);
    };

    expect(() => integrateFixture(fixture, worktree, record)).toThrow(
      /integrated repositories: app1; not integrated: app2, project/,
    );
    expect(lastRecordedStatus(records, "app1")).toBe("merged");
    expect(lastRecordedStatus(records, "app2")).toBe("failed");
    expect(lastRecordedStatus(records, "project")).toBe("pending");
    const firstMerge = git(app1!.repoRoot, "rev-parse", productIntegrationTarget(app1!));
    expect(
      gitResult(app1!.repoRoot, [
        "merge-base",
        "--is-ancestor",
        app1!.branch,
        productIntegrationTarget(app1!),
      ]).status,
    ).toBe(0);
    expect(
      gitResult(app2!.repoRoot, ["merge-base", "--is-ancestor", app2!.branch, "release"]).status,
    ).toBe(1);

    removeHook();
    integrateFixture(fixture, worktree, record);
    expect(lastRecordedStatus(records, "app1")).toBe("merged");
    expect(lastRecordedStatus(records, "app2")).toBe("merged");
    expect(lastRecordedStatus(records, "project")).toBe("merged");
    expect(git(app1!.repoRoot, "rev-parse", productIntegrationTarget(app1!))).toBe(firstMerge);
    expect(
      gitResult(app2!.repoRoot, ["merge-base", "--is-ancestor", app2!.branch, "release"]).status,
    ).toBe(0);
  });

  it("keeps both products integrated when the project fails and resumes at the project", () => {
    const fixture = setup();
    const worktree = prepare(fixture);
    commitIntegrationFixture(worktree);
    const removeHook = rejectMergeCommit(fixture.repo);
    const records: Array<readonly [string, string | undefined]> = [];
    const record: RepoIntegrationRecorder = (repo, patch) => {
      records.push([repo, patch.status]);
    };

    expect(() => integrateFixture(fixture, worktree, record)).toThrow(
      /integrated repositories: app1, app2; not integrated: project/,
    );
    expect(lastRecordedStatus(records, "app1")).toBe("merged");
    expect(lastRecordedStatus(records, "app2")).toBe("merged");
    expect(lastRecordedStatus(records, "project")).toBe("failed");
    const productHeads = worktree.repos!.map((product) =>
      git(product.repoRoot, "rev-parse", productIntegrationTarget(product)),
    );
    expect(
      gitResult(fixture.repo, ["merge-base", "--is-ancestor", worktree.branch, "HEAD"]).status,
    ).toBe(1);

    removeHook();
    integrateFixture(fixture, worktree, record);
    expect(lastRecordedStatus(records, "app1")).toBe("merged");
    expect(lastRecordedStatus(records, "app2")).toBe("merged");
    expect(lastRecordedStatus(records, "project")).toBe("merged");
    expect(
      worktree.repos!.map((product) =>
        git(product.repoRoot, "rev-parse", productIntegrationTarget(product)),
      ),
    ).toEqual(productHeads);
    expect(
      gitResult(fixture.repo, ["merge-base", "--is-ancestor", worktree.branch, "HEAD"]).status,
    ).toBe(0);
  });

  it("adds the qualified Refs trailer to product commits and records the trace after integration", () => {
    const fixture = setup();
    const worktree = prepare(fixture);
    const [app1, app2] = worktree.repos!;
    writeFile(join(app1!.path, "src", "feature.ts"), "export const feature = 1;\n");
    writeFile(join(worktree.path, "project.txt"), "project change\n");
    git(worktree.path, "add", "project.txt");
    git(worktree.path, "commit", "-m", "change project");
    const subject = "exec(register PJR-30SW): trace product integration";
    const productMessage = withCommitTrailers(subject, [refsTrailer("prj-0001", "PJR-30SW")]);
    const resultPath = join(fixture.parent, "result.md");
    writeFile(resultPath, "# Edit Result\n\n## 1. 実施内容\n\n- done\n");
    const releasePaths = checkpointPaths(fixture);

    const outcomes = commitProductWorktrees({ worktree, message: productMessage });
    integrateTaskRepositories({
      worktree,
      mergeMessage: `${subject}\n\nTransition: start → review\nRefs: prj-0001:PJR-30SW`,
      productMergeMessage: productMessage,
      checkProject: () =>
        projectMergeBlockers({ context: fixture.context, worktree, taskId: TASK_ID, releasePaths }),
      beforeProjectMerge: () =>
        recordResultTrace({
          resultPath,
          traceKey: "prj-0001:PJR-30SW",
          traces: worktree.repos!.map(productIntegrationTrace),
          recordedAt: "2026-10-01T00:00:00.000Z",
        }),
      mergeProject: () =>
        mergeWorktreeIntoCurrent({
          context: fixture.context,
          worktree,
          taskId: TASK_ID,
          message: subject,
          releaseRootPaths: releasePaths,
        }),
    });

    expect(outcomes.map((outcome) => [outcome.repo, outcome.committed])).toEqual([
      ["app1", true],
      ["app2", false],
    ]);
    expect(git(app1!.path, "log", "-1", "--format=%B")).toBe(
      `${subject}\n\nRefs: prj-0001:PJR-30SW`,
    );
    const target = productIntegrationTarget(app1!);
    const mergeCommit = git(app1!.repoRoot, "rev-parse", target);
    const mergeBody = git(app1!.repoRoot, "log", "-1", "--format=%B", target);
    expect(git(app1!.repoRoot, "rev-list", "--parents", "-n", "1", target).split(" ")).toHaveLength(
      3,
    );
    expect(mergeBody).toBe(`${subject}\n\nRefs: prj-0001:PJR-30SW`);
    expect(mergeBody).not.toContain("Transition:");
    expect(
      git(app1!.repoRoot, "log", target, "--grep=^Refs: prj-0001:PJR-30SW$", "--format=%H"),
    ).toBe([mergeCommit, git(app1!.repoRoot, "rev-parse", app1!.branch)].join("\n"));
    expect(git(app2!.repoRoot, "log", "-1", "--format=%s", "release")).toBe("release commit");

    const result = readFileSync(resultPath, "utf8");
    expect(result).toContain("## 2. トレーサビリティ\n");
    expect(result).toMatch(
      new RegExp(`\\| \`app1\` +\\| \`${target}\` +\\| not applicable \\| \`${mergeCommit}\``),
    );
    expect(result).toMatch(
      /\| `app2` +\| `release` +\| not applicable \| not applicable \(no changes\)/,
    );
  });

  it("records the merge commit of a product that a resumed integration skips", () => {
    const fixture = setup();
    const worktree = prepare(fixture);
    commitIntegrationFixture(worktree);
    const [app1, app2] = worktree.repos!;
    git(app2!.repoRoot, "checkout", "release");
    const removeHook = rejectMergeCommit(app2!.repoRoot);
    expect(() => integrateFixture(fixture, worktree)).toThrow(/not integrated: app2, project/);
    const firstMerge = git(app1!.repoRoot, "rev-parse", productIntegrationTarget(app1!));
    removeHook();
    // 統合先が先へ進んでも、記録するのは exec branch を取り込んだ merge commit とする。
    git(app1!.repoRoot, "commit", "--allow-empty", "-m", "later work on the target");

    integrateFixture(fixture, worktree);
    const traces = worktree.repos!.map(productIntegrationTrace);

    expect(traces.map((trace) => [trace.repo, trace.state, trace.commit])).toEqual([
      ["app1", "merged", firstMerge],
      ["app2", "merged", git(app2!.repoRoot, "rev-parse", "release")],
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

  it("keeps the single-repository integration callback order without repos", () => {
    const fixture = setup({ withProducts: false });
    const worktree = prepare(fixture);
    const calls: string[] = [];

    integrateTaskRepositories({
      worktree,
      mergeMessage: "single repository integration",
      checkProject: () => {
        calls.push("check");
        return [];
      },
      beforeProjectMerge: () => calls.push("before-project"),
      mergeProject: () => calls.push("merge-project"),
    });

    expect(calls).toEqual(["before-project", "merge-project"]);
  });
});

// PJR-GENJ: reporter 段・統合段の再開前に、統合先で直した変更を exec branch と worktree へ取り込む。
describe("syncTaskWorktreesWithIntegrationTargets", () => {
  function commitOn(repoRoot: string, file: string, content: string): void {
    writeFile(join(repoRoot, file), content);
    git(repoRoot, "add", file);
    git(repoRoot, "commit", "-m", `fix ${file}`);
  }

  it("merges a fix committed on the project integration branch while keeping uncommitted executor changes", () => {
    const fixture = setup({ withProducts: false });
    const worktree = prepare(fixture);
    writeFile(join(worktree.path, "docs", "artifact.md"), "# executor artifact\n");
    commitOn(fixture.repo, "FIX.md", "fixed on the integration branch\n");

    const synced = syncTaskWorktreesWithIntegrationTargets({
      worktree,
      projectTarget: currentBranch(fixture.repo),
      message: "merge integration target before resume",
    });

    expect(synced.map((entry) => [entry.repo, entry.status])).toEqual([["project", "merged"]]);
    expect(readFileSync(join(worktree.path, "FIX.md"), "utf8")).toBe(
      "fixed on the integration branch\n",
    );
    expect(readFileSync(join(worktree.path, "docs", "artifact.md"), "utf8")).toBe(
      "# executor artifact\n",
    );
    expect(git(worktree.path, "log", "-1", "--format=%s")).toBe(
      "merge integration target before resume",
    );
    expect(git(worktree.path, "rev-list", "--parents", "-n", "1", "HEAD").split(" ")).toHaveLength(
      3,
    );
  });

  it("reports up-to-date and creates no commit when the integration branch has nothing new", () => {
    const fixture = setup({ withProducts: false });
    const worktree = prepare(fixture);
    const before = git(worktree.path, "rev-parse", "HEAD");

    const synced = syncTaskWorktreesWithIntegrationTargets({
      worktree,
      projectTarget: currentBranch(fixture.repo),
      message: "merge integration target before resume",
    });

    expect(synced.map((entry) => entry.status)).toEqual(["up-to-date"]);
    expect(git(worktree.path, "rev-parse", "HEAD")).toBe(before);
  });

  it("merges each product integration branch and the project for multi-repository tasks", () => {
    const fixture = setup();
    const worktree = prepare(fixture);
    const [app1, app2] = fixture.products;
    commitOn(app1!.repoRoot, "APP1_FIX.md", "app1 fix\n");
    commitOn(fixture.repo, "FIX.md", "project fix\n");

    // app2 integrates into "release", which is not checked out; the fix lands there.
    git(app2!.repoRoot, "checkout", "release");
    commitOn(app2!.repoRoot, "APP2_FIX.md", "app2 fix\n");
    git(app2!.repoRoot, "checkout", "-");

    const synced = syncTaskWorktreesWithIntegrationTargets({
      worktree,
      projectTarget: currentBranch(fixture.repo),
      message: "merge integration target before resume",
    });

    expect(synced.map((entry) => [entry.repo, entry.target, entry.status])).toEqual([
      ["app1", productIntegrationTarget(app1!), "merged"],
      ["app2", "release", "merged"],
      ["project", currentBranch(fixture.repo), "merged"],
    ]);
    const [app1Worktree, app2Worktree] = worktree.repos ?? [];
    expect(existsSync(join(app1Worktree!.path, "APP1_FIX.md"))).toBe(true);
    expect(existsSync(join(app2Worktree!.path, "APP2_FIX.md"))).toBe(true);
    expect(existsSync(join(worktree.path, "FIX.md"))).toBe(true);
  });

  it("aborts and throws without touching the worktree when the fix overlaps uncommitted changes", () => {
    const fixture = setup({ withProducts: false });
    const worktree = prepare(fixture);
    const before = git(worktree.path, "rev-parse", "HEAD");
    writeFile(join(worktree.path, "README.md"), "executor edit\n");
    commitOn(fixture.repo, "README.md", "integration branch edit\n");

    expect(() =>
      syncTaskWorktreesWithIntegrationTargets({
        worktree,
        projectTarget: currentBranch(fixture.repo),
        message: "merge integration target before resume",
      }),
    ).toThrow(/project: cannot merge .* into the exec branch/);
    expect(git(worktree.path, "rev-parse", "HEAD")).toBe(before);
    expect(readFileSync(join(worktree.path, "README.md"), "utf8")).toBe("executor edit\n");
    expect(
      gitResult(worktree.path, ["rev-parse", "--verify", "--quiet", "MERGE_HEAD"]).status,
    ).not.toBe(0);
  });

  it("aborts on a committed conflict outside the item's bookkeeping paths", () => {
    const fixture = setup({ withProducts: false });
    const worktree = prepare(fixture);
    commitOn(worktree.path, "README.md", "exec branch edit\n");
    const before = git(worktree.path, "rev-parse", "HEAD");
    commitOn(fixture.repo, "README.md", "integration branch edit\n");

    expect(() =>
      syncTaskWorktreesWithIntegrationTargets({
        worktree,
        projectTarget: currentBranch(fixture.repo),
        message: "merge integration target before resume",
      }),
    ).toThrow(/project: merge conflicts with .*: README\.md/);
    expect(git(worktree.path, "rev-parse", "HEAD")).toBe(before);
    expect(readFileSync(join(worktree.path, "README.md"), "utf8")).toBe("exec branch edit\n");
  });

  it("resolves conflicts on the item's bookkeeping paths with the integration branch content", () => {
    const fixture = setup({ withProducts: false });
    const worktree = prepare(fixture);
    commitOn(worktree.path, "ticket.md", "exec branch ticket\n");
    commitOn(fixture.repo, "ticket.md", "integration branch ticket\n");

    const synced = syncTaskWorktreesWithIntegrationTargets({
      worktree,
      projectTarget: currentBranch(fixture.repo),
      message: "merge integration target before resume",
      projectTheirsPaths: ["ticket.md"],
    });

    expect(synced.map((entry) => entry.status)).toEqual(["merged"]);
    expect(readFileSync(join(worktree.path, "ticket.md"), "utf8")).toBe(
      "integration branch ticket\n",
    );
  });
});
