import { createHash } from "node:crypto";
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { CrossProcessMutex, releaseLock, tryAcquirePoolSlot } from "./cross-process-lock.js";
import { gitOutput, gitResult, repoRelative, worktreeStatusPaths } from "./git.js";
import {
  getProjectExecutionPath,
  getProjectRegisterPath,
  getProjectSchedulePath,
  loadConfig,
  specdojoRootDir,
} from "./specdojo-config.js";

export type RegisterBranchTarget = {
  repoRoot: string;
  projectId: string;
  branch: string;
  remote: string;
  registerPath: string;
  eventsPath: string;
};

export function resolveRegisterBranchTarget(projectId: string): RegisterBranchTarget | undefined {
  const repoRoot = specdojoRootDir();
  const { config } = loadConfig(repoRoot);
  const project = config?.projects[projectId];
  if (!project?.register_sync?.enabled) return undefined;
  const branch = project.register_sync.branch?.trim() || `project/${projectId}/register`;
  const remote = project.register_sync.remote?.trim() || "origin";
  if (gitResult(repoRoot, ["check-ref-format", "--branch", branch]).status !== 0) {
    throw new Error(`Invalid register_sync.branch: ${branch}`);
  }
  // Only named remotes are accepted; never treat the setting as a URL or a Git option.
  if (!/^(?!-)[^\s:]+$/.test(remote)) throw new Error(`Invalid register_sync.remote: ${remote}`);
  if (!gitOutput(repoRoot, ["remote"]).trim().split(/\r?\n/).includes(remote)) {
    throw new Error(
      `Register remote ${remote} is not configured; add a named remote before enabling register_sync.`,
    );
  }
  const registerPath = getProjectRegisterPath(project);
  if (!registerPath) throw new Error(`project_register_path not set for ${projectId}`);
  return {
    repoRoot,
    projectId,
    branch,
    remote,
    registerPath: repoRelative(repoRoot, resolve(repoRoot, registerPath)),
    eventsPath: repoRelative(
      repoRoot,
      resolve(repoRoot, getProjectExecutionPath(project), "exec", "events"),
    ),
  };
}

export function registerBranchForSchedule(schedulePath: string): RegisterBranchTarget | undefined {
  const repoRoot = specdojoRootDir();
  const { config } = loadConfig(repoRoot);
  const entry = Object.entries(config?.projects ?? {}).find(
    ([, project]) => resolve(repoRoot, getProjectSchedulePath(project)) === resolve(schedulePath),
  );
  return entry ? resolveRegisterBranchTarget(entry[0]) : undefined;
}

export function assertRegisterBranchPaths(
  target: RegisterBranchTarget,
  paths: readonly string[],
): void {
  const prefixes = [target.registerPath, target.eventsPath];
  const outside = paths.filter((path) => !prefixes.some((prefix) => path.startsWith(`${prefix}/`)));
  if (outside.length) {
    throw new Error(
      `Register branch cannot include paths outside bookkeeping: ${outside.join(", ")}`,
    );
  }
}

function branchStorage(target: RegisterBranchTarget): { pool: string; worktree: string } {
  const commonDir = resolve(
    target.repoRoot,
    gitOutput(target.repoRoot, ["rev-parse", "--git-common-dir"]).trim(),
  );
  const key = createHash("sha256").update(target.branch).digest("hex").slice(0, 16);
  const storage = join(commonDir, "specdojo", "register", key);
  mkdirSync(storage, { recursive: true });
  // Branch creation and worktree discovery share repository metadata across projects.
  return {
    pool: join(commonDir, "specdojo", "register", "lock"),
    worktree: join(storage, "worktree"),
  };
}

function worktreeForBranch(target: RegisterBranchTarget): string | undefined {
  let path: string | undefined;
  for (const line of gitOutput(target.repoRoot, ["worktree", "list", "--porcelain", "-z"]).split(
    "\0",
  )) {
    if (line.startsWith("worktree ")) path = line.slice(9);
    if (line === `branch refs/heads/${target.branch}`) return path;
  }
  return undefined;
}

function assertClean(worktree: string): void {
  const dirty = worktreeStatusPaths(worktree);
  if (dirty.length) {
    throw new Error(`Register worktree has uncommitted changes: ${dirty.join(", ")}`);
  }
  const rebase = ["rebase-merge", "rebase-apply"].some((name) =>
    existsSync(resolve(worktree, gitOutput(worktree, ["rev-parse", "--git-path", name]).trim())),
  );
  if (rebase) throw new Error("Register worktree has an unfinished rebase");
}

function recoveryMarker(worktree: string): string {
  return resolve(
    worktree,
    gitOutput(worktree, ["rev-parse", "--git-path", "specdojo-register-recovery"]).trim(),
  );
}

function assertRecovered(worktree: string, remoteHead: string): void {
  const marker = recoveryMarker(worktree);
  if (!existsSync(marker)) return;
  if (gitResult(worktree, ["merge-base", "--is-ancestor", "HEAD", remoteHead]).status !== 0) {
    throw new Error(
      "A previous register sync failed with unpublished bookkeeping. Recover and push it before another operation.",
    );
  }
  unlinkSync(marker);
}

function assertOutgoingCommits(
  target: RegisterBranchTarget,
  worktree: string,
  remoteHead: string,
): void {
  const commits = gitOutput(worktree, ["rev-list", "--parents", `${remoteHead}..HEAD`]).trim();
  for (const line of commits ? commits.split("\n") : []) {
    const [commit, parent] = line.split(" ");
    // Inspect each commit, rather than a net diff that could hide an unrelated edit and revert.
    const paths = gitOutput(
      worktree,
      parent
        ? ["diff", "--name-only", "-z", parent, commit!]
        : ["diff-tree", "--root", "--no-commit-id", "--name-only", "-r", "-z", commit!],
    );
    assertRegisterBranchPaths(target, paths.split("\0").filter(Boolean));
  }
}

function prepareWorktree(target: RegisterBranchTarget, fallback: string): string {
  // Fetch the exact ref even if a single-branch clone has a narrower fetch refspec.
  gitOutput(target.repoRoot, ["fetch", "--", target.remote, `refs/heads/${target.branch}`]);
  // FETCH_HEAD is per worktree. Carry the fetched object to a newly created worktree explicitly.
  const remoteHead = gitOutput(target.repoRoot, ["rev-parse", "FETCH_HEAD"]).trim();
  if (
    gitResult(target.repoRoot, ["show-ref", "--verify", "--quiet", `refs/heads/${target.branch}`])
      .status !== 0
  ) {
    gitOutput(target.repoRoot, ["branch", "--", target.branch, remoteHead]);
  }
  let worktree = worktreeForBranch(target);
  if (!worktree) {
    gitOutput(target.repoRoot, ["worktree", "add", "--", fallback, target.branch]);
    worktree = fallback;
  }
  assertClean(worktree);
  assertRecovered(worktree, remoteHead);
  // Never rebase unrelated, locally accumulated product commits onto the register branch.
  assertOutgoingCommits(target, worktree, remoteHead);
  gitOutput(worktree, ["pull", "--rebase", "--no-autostash", "--", target.remote, target.branch]);
  return worktree;
}

export function pushRegisterBranch(
  target: RegisterBranchTarget,
  worktree: string,
  afterRebase?: () => void,
): void {
  for (let attempt = 0; attempt < 3; attempt++) {
    assertClean(worktree);
    assertOutgoingCommits(target, worktree, "FETCH_HEAD");
    const result = gitResult(worktree, [
      "push",
      "--porcelain",
      "--",
      target.remote,
      `HEAD:refs/heads/${target.branch}`,
    ]);
    if (result.status === 0) return;
    const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
    if (!/\[rejected\].*\((?:fetch first|non-fast-forward)\)/i.test(output)) {
      throw new Error(`Register push failed: ${output.trim()}`);
    }
    if (attempt === 2)
      throw new Error(`Register push still rejected after retries: ${output.trim()}`);
    assertClean(worktree);
    gitOutput(worktree, ["pull", "--rebase", "--no-autostash", "--", target.remote, target.branch]);
    afterRebase?.();
  }
}

function recoveryError(target: RegisterBranchTarget, worktree: string, error: unknown): Error {
  const cause = error instanceof Error ? error.message : String(error);
  // Prevent a later unrelated command from accidentally publishing an unresolved claim or
  // a partial mutation. The marker clears once manual recovery is clean and present remotely.
  if (existsSync(join(worktree, ".git"))) {
    if (
      worktreeStatusPaths(worktree).length ||
      gitResult(worktree, ["merge-base", "--is-ancestor", "HEAD", "FETCH_HEAD"]).status === 1
    ) {
      writeFileSync(
        recoveryMarker(worktree),
        "Recover unpublished register bookkeeping before continuing.\n",
      );
    }
  }
  return new Error(
    `${cause}\nRegister bookkeeping is preserved locally; inspect worktree ${worktree} ` +
      `and branch ${target.branch}. If the remote branch is missing, create it from the project ` +
      `develop branch as described in the register operation guide. Fix connectivity/permissions ` +
      `or resolve conflicts, then in that worktree finish git rebase --continue (or git rebase --abort), ` +
      `commit any remaining bookkeeping, and run git pull --rebase ${target.remote} ${target.branch} ` +
      `followed by git push ${target.remote} HEAD:refs/heads/${target.branch}. Do not repeat add to retry a push.`,
    { cause: error },
  );
}

/** Serializes all writers sharing this branch across linked worktrees. Keeps the worktree on failure. */
export async function inRegisterBranch<T>(
  target: RegisterBranchTarget,
  operation: (worktree: string) => Promise<T>,
): Promise<T> {
  const storage = branchStorage(target);
  const mutex = new CrossProcessMutex(storage.pool, { actor: "SpecDojo", label: "register sync" });
  return mutex.runExclusive(async () => {
    let worktree = worktreeForBranch(target) ?? storage.worktree;
    try {
      worktree = prepareWorktree(target, storage.worktree);
      return await operation(worktree);
    } catch (error) {
      throw recoveryError(target, worktree, error);
    }
  });
}

/** Event APIs are synchronous. Busy callers retry instead of blocking an async writer in this process. */
export function inRegisterBranchSync<T>(
  target: RegisterBranchTarget,
  operation: (worktree: string) => T,
): T {
  const storage = branchStorage(target);
  const handle = tryAcquirePoolSlot(storage.pool, 1, { actor: "SpecDojo", label: "schedule sync" });
  if (!handle)
    throw new Error(`Register branch ${target.branch} is busy; retry the schedule operation.`);
  let worktree = worktreeForBranch(target) ?? storage.worktree;
  try {
    worktree = prepareWorktree(target, storage.worktree);
    return operation(worktree);
  } catch (error) {
    throw recoveryError(target, worktree, error);
  } finally {
    releaseLock(handle);
  }
}
