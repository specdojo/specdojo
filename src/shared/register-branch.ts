import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { CrossProcessMutex, releaseLock, tryAcquirePoolSlot } from "./cross-process-lock.js";
import { gitOutput, gitResult, repoRelative, worktreeStatusPaths } from "./git.js";
import {
  getProjectExecutionPath,
  getProjectRegisterPath,
  getProjectSchedulePath,
  loadConfig,
  specdojoRootDir,
  SYNC_BRANCH_KINDS,
  type SyncBranchKind,
} from "./specdojo-config.js";

/**
 * A dedicated branch that publishes bookkeeping. `kind` is `legacy` for `register_sync`, where
 * one branch carries both the register and the schedule events; `scope` lists the repo-relative
 * directories the branch may change.
 */
export type RegisterBranchTarget = {
  repoRoot: string;
  projectId: string;
  kind: SyncBranchKind | "legacy";
  branch: string;
  remote: string;
  registerPath: string;
  eventsPath: string;
  scope: string[];
};

function validatedBranch(repoRoot: string, setting: string, branch: string): string {
  if (gitResult(repoRoot, ["check-ref-format", "--branch", branch]).status !== 0) {
    throw new Error(`Invalid ${setting}: ${branch}`);
  }
  return branch;
}

/**
 * Every sync branch of the project in intake order (register first, then exec-events), or an
 * empty array when neither `sync` nor `register_sync` is enabled.
 */
export function resolveSyncBranchTargets(projectId: string): RegisterBranchTarget[] {
  const repoRoot = specdojoRootDir();
  const { config } = loadConfig(repoRoot);
  const project = config?.projects[projectId];
  const sync = project?.sync?.enabled ? project.sync : undefined;
  const legacy = project?.register_sync?.enabled ? project.register_sync : undefined;
  if (!project || (!sync && !legacy)) return [];
  const setting = sync ? "sync" : "register_sync";
  const remote = (sync ?? legacy)?.remote?.trim() || "origin";
  // Only named remotes are accepted; never treat the setting as a URL or a Git option.
  if (!/^(?!-)[^\s:]+$/.test(remote)) throw new Error(`Invalid ${setting}.remote: ${remote}`);
  if (!gitOutput(repoRoot, ["remote"]).trim().split(/\r?\n/).includes(remote)) {
    throw new Error(
      `Register remote ${remote} is not configured; add a named remote before enabling ${setting}.`,
    );
  }
  const registerSetting = getProjectRegisterPath(project);
  if (!registerSetting) throw new Error(`project_register_path not set for ${projectId}`);
  const registerPath = repoRelative(repoRoot, resolve(repoRoot, registerSetting));
  const eventsPath = repoRelative(
    repoRoot,
    resolve(repoRoot, getProjectExecutionPath(project), "exec", "events"),
  );
  const base = { repoRoot, projectId, remote, registerPath, eventsPath };
  if (!sync) {
    const branch = legacy?.branch?.trim() || `project/${projectId}/register`;
    return [
      {
        ...base,
        kind: "legacy",
        branch: validatedBranch(repoRoot, "register_sync.branch", branch),
        scope: [registerPath, eventsPath],
      },
    ];
  }
  const targets = SYNC_BRANCH_KINDS.map((kind): RegisterBranchTarget => {
    const branch = sync.branches?.[kind]?.branch?.trim() || `project/${projectId}/sync/${kind}`;
    return {
      ...base,
      kind,
      branch: validatedBranch(repoRoot, `sync.branches.${kind}.branch`, branch),
      scope: [kind === "register" ? registerPath : eventsPath],
    };
  });
  if (targets[0]!.branch === targets[1]!.branch) {
    throw new Error(
      `sync.branches.register and sync.branches.exec-events must name different branches: ` +
        targets[0]!.branch,
    );
  }
  return targets;
}

/** The branch that carries register tickets and events, or undefined when sync is disabled. */
export function resolveRegisterBranchTarget(projectId: string): RegisterBranchTarget | undefined {
  return resolveSyncBranchTargets(projectId).find((target) => target.kind !== "exec-events");
}

/** The branch that carries `execution/exec/events/`, or undefined when sync is disabled. */
export function resolveExecEventsBranchTarget(projectId: string): RegisterBranchTarget | undefined {
  return resolveSyncBranchTargets(projectId).find((target) => target.kind !== "register");
}

/** The sync branch selected by kind; `legacy` targets answer for both kinds. */
export function resolveSyncBranchTarget(
  projectId: string,
  kind: SyncBranchKind,
): RegisterBranchTarget | undefined {
  return kind === "register"
    ? resolveRegisterBranchTarget(projectId)
    : resolveExecEventsBranchTarget(projectId);
}

/** True when `path` (repo-relative) is published through one of the project's sync branches. */
export function isInSyncScope(targets: readonly RegisterBranchTarget[], path: string): boolean {
  return targets.some((target) => isInBranchScope(target, path));
}

export function isInBranchScope(target: RegisterBranchTarget, path: string): boolean {
  return target.scope.some((prefix) => path.startsWith(`${prefix}/`));
}

export function execEventsBranchForSchedule(
  schedulePath: string,
): RegisterBranchTarget | undefined {
  const repoRoot = specdojoRootDir();
  const { config } = loadConfig(repoRoot);
  const entry = Object.entries(config?.projects ?? {}).find(
    ([, project]) => resolve(repoRoot, getProjectSchedulePath(project)) === resolve(schedulePath),
  );
  return entry ? resolveExecEventsBranchTarget(entry[0]) : undefined;
}

export function assertRegisterBranchPaths(
  target: RegisterBranchTarget,
  paths: readonly string[],
): void {
  const outside = paths.filter((path) => !isInBranchScope(target, path));
  if (outside.length) {
    throw new Error(
      `Sync branch ${target.branch} cannot include paths outside ${target.scope.join(", ")}: ` +
        outside.join(", "),
    );
  }
}

function branchStoragePaths(target: RegisterBranchTarget): {
  storage: string;
  pool: string;
  worktree: string;
} {
  const commonDir = resolve(
    target.repoRoot,
    gitOutput(target.repoRoot, ["rev-parse", "--git-common-dir"]).trim(),
  );
  const key = createHash("sha256").update(target.branch).digest("hex").slice(0, 16);
  // Legacy register_sync keeps its original place; sync branches live under specdojo/sync/<kind>.
  const storage =
    target.kind === "legacy"
      ? join(commonDir, "specdojo", "register", key)
      : join(commonDir, "specdojo", "sync", target.kind, key);
  // Branch creation and worktree discovery share repository metadata across projects.
  return {
    storage,
    pool: join(commonDir, "specdojo", "register", "lock"),
    worktree: join(storage, "worktree"),
  };
}

function branchStorage(target: RegisterBranchTarget): { pool: string; worktree: string } {
  const paths = branchStoragePaths(target);
  mkdirSync(paths.storage, { recursive: true });
  return { pool: paths.pool, worktree: paths.worktree };
}

/** The worktree that has the register branch checked out, and where the sync would create one. */
export function registerBranchWorktree(target: RegisterBranchTarget): {
  worktree: string | undefined;
  fallback: string;
} {
  return {
    worktree: worktreeForBranch(target) ?? rebasingWorktreeForBranch(target),
    fallback: branchStoragePaths(target).worktree,
  };
}

/** A stopped rebase detaches HEAD, so the worktree is found through the rebase's head-name. */
function rebasingWorktreeForBranch(target: RegisterBranchTarget): string | undefined {
  const detached: string[] = [];
  let path: string | undefined;
  for (const line of gitOutput(target.repoRoot, ["worktree", "list", "--porcelain", "-z"]).split(
    "\0",
  )) {
    if (line.startsWith("worktree ")) path = line.slice(9);
    if (line === "detached" && path && existsSync(path)) detached.push(path);
  }
  return detached.find((worktree) =>
    ["rebase-merge", "rebase-apply"].some((name) => {
      const headName = resolve(
        worktree,
        gitOutput(worktree, ["rev-parse", "--git-path", `${name}/head-name`]).trim(),
      );
      return (
        existsSync(headName) &&
        readFileSync(headName, "utf8").trim() === `refs/heads/${target.branch}`
      );
    }),
  );
}

/** True while a rebase is stopped in the worktree (for example on a conflict). */
export function isRegisterRebaseInProgress(worktree: string): boolean {
  return ["rebase-merge", "rebase-apply"].some((name) =>
    existsSync(resolve(worktree, gitOutput(worktree, ["rev-parse", "--git-path", name]).trim())),
  );
}

/** Clears the marker left by a failed sync once the bookkeeping has been published. */
export function clearRegisterRecovery(worktree: string): void {
  const marker = recoveryMarker(worktree);
  if (existsSync(marker)) unlinkSync(marker);
}

/**
 * Runs `operation` under the lock shared with every register sync, without preparing the
 * worktree. `register branch-push` uses it to create, publish and recover the branch itself.
 */
export async function inRegisterBranchLock<T>(
  target: RegisterBranchTarget,
  operation: () => Promise<T> | T,
): Promise<T> {
  const storage = branchStorage(target);
  const mutex = new CrossProcessMutex(storage.pool, { actor: "SpecDojo", label: "register sync" });
  return mutex.runExclusive(async () => operation());
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
  if (isRegisterRebaseInProgress(worktree))
    throw new Error("Register worktree has an unfinished rebase");
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

/** The `register branch-push` command that publishes or recovers exactly this sync branch. */
export function branchPushCommand(target: RegisterBranchTarget): string {
  const sync = target.kind === "legacy" ? "" : ` --sync ${target.kind}`;
  return `specdojo register branch-push --project ${target.projectId}${sync}`;
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
  const command = branchPushCommand(target);
  return new Error(
    `${cause}\nRegister bookkeeping is preserved locally; inspect worktree ${worktree} ` +
      `and branch ${target.branch}. If the remote branch is missing, create it from the project ` +
      `develop branch with ${command}. Fix ` +
      `connectivity/permissions, resolve conflicts (git add the resolved files) and commit any ` +
      `remaining bookkeeping in that worktree, then run ${command}; it finishes git rebase --continue, rebases onto ` +
      `${target.remote}/${target.branch} and pushes (git rebase --abort returns to the local commits). ` +
      `Do not repeat add to retry a push.`,
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
