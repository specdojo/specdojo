import { gitOutput, gitResult, worktreeStatusPaths } from "../shared/git.js";
import {
  clearRegisterRecovery,
  inRegisterBranchLock,
  isRegisterRebaseInProgress,
  pushRegisterBranch,
  registerBranchWorktree,
  resolveRegisterBranchTarget,
  type RegisterBranchTarget,
} from "../shared/register-branch.js";
import { loadConfig } from "../shared/specdojo-config.js";
import { resolveProjectIntegrationBranch } from "./cross-project.js";
import { checkRegisterPush, formatRegisterPushReport } from "./push-check.js";

export type RegisterBranchPushOptions = { dryRun?: boolean };

export type RegisterBranchPushOutcome = {
  /** 実際に行った（`--dry-run` では行う予定の）操作。 */
  action: "create" | "track" | "publish" | "sync";
  /** 出力する行。 */
  lines: string[];
  /** `--dry-run` で、実際の実行が止まる理由（検査の違反・衝突・未 commit）があるとき true。 */
  wouldStop: boolean;
};

type PushCheck = { scopeViolations: string[]; shapeViolations: string[] };

type BranchState = {
  target: RegisterBranchTarget;
  timeZone: string;
  integrationBranch: string;
  localTip: string | undefined;
  remoteTip: string | undefined;
  worktree: string | undefined;
  fallback: string;
};

function short(commit: string): string {
  return commit.slice(0, 12);
}

function revision(cwd: string, spec: string): string | undefined {
  const result = gitResult(cwd, ["rev-parse", "--verify", "--quiet", `${spec}^{commit}`]);
  return result.status === 0 ? String(result.stdout).trim() : undefined;
}

function hasObject(cwd: string, commit: string): boolean {
  return gitResult(cwd, ["cat-file", "-e", `${commit}^{commit}`]).status === 0;
}

function isAncestor(cwd: string, ancestor: string, descendant: string): boolean {
  return gitResult(cwd, ["merge-base", "--is-ancestor", ancestor, descendant]).status === 0;
}

/** リモートのブランチ（省略時は register のブランチ）の先端。無ければ undefined。fetch はしない。 */
function remoteBranchTip(
  target: RegisterBranchTarget,
  branch: string = target.branch,
): string | undefined {
  const ref = `refs/heads/${branch}`;
  const output = gitOutput(target.repoRoot, ["ls-remote", "--heads", target.remote, ref]);
  const line = output.split(/\r?\n/u).find((entry) => entry.endsWith(`\t${ref}`));
  return line?.split("\t")[0];
}

function conflictPaths(worktree: string): string[] {
  return gitOutput(worktree, ["diff", "--name-only", "--diff-filter=U", "-z"])
    .split("\0")
    .filter(Boolean);
}

/** `base` が無いときは、リモートのどのブランチにもない commit を数える。 */
function outgoingCommits(cwd: string, remote: string, commit: string, base?: string): string[] {
  const range = base ? [`${base}..${commit}`] : [commit, "--not", `--remotes=${remote}`];
  const output = gitOutput(cwd, ["rev-list", "--reverse", ...range, "--"]).trim();
  return output ? output.split("\n") : [];
}

function describeRange(state: BranchState, commit: string, base?: string): string {
  const commits = outgoingCommits(state.target.repoRoot, state.target.remote, commit, base);
  const range = base
    ? `${short(base)}..${short(commit)}`
    : `${short(commit)} (commits not on ${state.target.remote})`;
  return `${range}, ${commits.length} commit(s)`;
}

function runCheck(state: BranchState, commit: string, base?: string): PushCheck {
  const result = checkRegisterPush(state.target.projectId, state.timeZone, {
    commit,
    base,
    remoteRef: `refs/heads/${state.target.branch}`,
  });
  if (result.status !== "checked") {
    throw new Error(`Register push check did not run for ${state.target.branch}`);
  }
  return { scopeViolations: result.scopeViolations, shapeViolations: result.shapeViolations };
}

function hasViolations(check: PushCheck): boolean {
  return check.scopeViolations.length > 0 || check.shapeViolations.length > 0;
}

function assertCheckPassed(state: BranchState, check: PushCheck, hint?: string): void {
  if (!hasViolations(check)) return;
  throw new Error(
    `Register push checks failed; nothing was pushed to ${state.target.remote}/${state.target.branch}.\n` +
      formatRegisterPushReport(state.target, check) +
      (hint ? `\n${hint}` : ""),
  );
}

/** `--dry-run` の検査結果の行。止まるときは本番と同じ案内（`hint`）を添える。 */
export function checkLines(
  check: PushCheck,
  target: Pick<RegisterBranchTarget, "registerPath" | "eventsPath" | "branch">,
  hint?: string,
): string[] {
  if (!hasViolations(check)) return ["Checks: passed."];
  return [
    "Checks: failed; the push would stop.",
    formatRegisterPushReport(target, check),
    ...(hint ? [hint] : []),
  ];
}

function conflictError(state: BranchState, worktree: string, conflicts: string[]): Error {
  const command = `specdojo register branch-push --project ${state.target.projectId}`;
  return new Error(
    `Register worktree ${worktree} has conflicts while rebasing onto ` +
      `${state.target.remote}/${state.target.branch}:\n` +
      conflicts.map((path) => `  ${path}`).join("\n") +
      `\nHow to fix: in that worktree, edit each file to keep both sides of the bookkeeping, ` +
      `git add it, then rerun \`${command}\`. To return to the local commits instead, run ` +
      `git rebase --abort there. Local commits and bookkeeping are kept.`,
  );
}

function dirtyError(state: BranchState, worktree: string, dirty: string[]): Error {
  return new Error(
    `Register worktree ${worktree} has uncommitted changes:\n` +
      dirty.map((path) => `  ${path}`).join("\n") +
      `\nReview them in that worktree and commit the bookkeeping to publish (for parallel claims, ` +
      `keep only the adopted claim), then rerun ` +
      `\`specdojo register branch-push --project ${state.target.projectId}\`.`,
  );
}

export const INITIAL_CHECK_HINT =
  "On the first push, push the integration branch to the remote first so that only register " +
  "commits remain outside it.";

function loadState(projectId: string, timeZone: string): BranchState {
  const target = resolveRegisterBranchTarget(projectId);
  if (!target) {
    throw new Error(
      `register_sync is not enabled for ${projectId}; nothing to push. ` +
        `Set projects.${projectId}.register_sync.enabled to true first.`,
    );
  }
  const { config } = loadConfig(target.repoRoot);
  const project = config?.projects[projectId] ?? {};
  const { worktree, fallback } = registerBranchWorktree(target);
  return {
    target,
    timeZone,
    integrationBranch: resolveProjectIntegrationBranch(projectId, project),
    localTip: revision(target.repoRoot, `refs/heads/${target.branch}`),
    remoteTip: remoteBranchTip(target),
    worktree,
    fallback,
  };
}

function integrationTip(state: BranchState): string {
  const tip = revision(state.target.repoRoot, `refs/heads/${state.integrationBranch}`);
  if (!tip) {
    throw new Error(
      `Integration branch ${state.integrationBranch} does not exist locally; create it or set ` +
        `projects.${state.target.projectId}.integration_branch before the first register push.`,
    );
  }
  return tip;
}

/** 初回に専用ブランチを作る起点。 */
type InitialBase = {
  /** 起点の commit。`--dry-run` でリモートの先端がまだ手元に無いときは undefined。 */
  commit: string | undefined;
  /** 起点の表示名（`origin/<integration_branch>` または手元の統合ブランチ名）。 */
  label: string;
  /** リモートの統合ブランチの先端。リモートに無いときは undefined（手元の先端から作る）。 */
  remoteTip: string | undefined;
};

function noRemoteIntegrationNotice(state: BranchState): string {
  const { remote, branch } = state.target;
  return (
    `${remote}/${state.integrationBranch} does not exist; creating ${branch} from the local ` +
    `${state.integrationBranch}. Its commits that are not on ${remote} are checked as register ` +
    `commits; push ${state.integrationBranch} to ${remote} first if the check fails.`
  );
}

/**
 * 初回の起点を決める。リモートに統合ブランチがあれば、その先端（本番は fetch して読む）から作り、
 * 手元にしかない統合ブランチの commit を専用ブランチに含めない。無いときだけ手元の先端から作る。
 */
function initialBase(state: BranchState, dryRun: boolean): InitialBase {
  const { target } = state;
  const remoteTip = remoteBranchTip(target, state.integrationBranch);
  if (!remoteTip) {
    return { commit: integrationTip(state), label: state.integrationBranch, remoteTip };
  }
  const label = `${target.remote}/${state.integrationBranch}`;
  if (dryRun) {
    const commit = hasObject(target.repoRoot, remoteTip) ? remoteTip : undefined;
    return { commit, label, remoteTip };
  }
  // Fetch the exact ref even if a single-branch clone has a narrower fetch refspec.
  gitOutput(target.repoRoot, [
    "fetch",
    "--",
    target.remote,
    `refs/heads/${state.integrationBranch}`,
  ]);
  const fetched = gitOutput(target.repoRoot, ["rev-parse", "FETCH_HEAD"]).trim();
  return { commit: fetched, label, remoteTip: fetched };
}

function worktreeLine(state: BranchState, dryRun: boolean): string {
  if (state.worktree) return `Worktree: ${state.worktree}`;
  return `Worktree: ${dryRun ? "would create" : "created"} ${state.fallback}`;
}

function ensureWorktree(state: BranchState): string {
  if (state.worktree) return state.worktree;
  gitOutput(state.target.repoRoot, ["worktree", "add", "--", state.fallback, state.target.branch]);
  return state.fallback;
}

/** 初回の push。リモートのブランチがまだ無いので、取り合いで拒否されたら再実行を促す。 */
function pushNewBranch(state: BranchState, worktree: string): void {
  const { remote, branch } = state.target;
  const result = gitResult(worktree, [
    "push",
    "--porcelain",
    "--",
    remote,
    `HEAD:refs/heads/${branch}`,
  ]);
  if (result.status === 0) return;
  throw new Error(
    `Register push failed: ${`${String(result.stdout ?? "")}\n${String(result.stderr ?? "")}`.trim()}\n` +
      `The local branch ${branch} and worktree ${worktree} are kept. If the remote branch was ` +
      `created meanwhile, rerun \`specdojo register branch-push --project ${state.target.projectId}\`.`,
  );
}

function describeDryRun(state: BranchState): RegisterBranchPushOutcome {
  const { target } = state;
  const lines = ["Dry run: nothing is changed."];
  if (!state.localTip && !state.remoteTip) {
    const base = initialBase(state, true);
    const tip = base.commit ?? base.remoteTip ?? "";
    lines.push(`Would create branch ${target.branch} from ${base.label} (${short(tip)}).`);
    if (!base.remoteTip) lines.push(noRemoteIntegrationNotice(state));
    lines.push(worktreeLine(state, true));
    if (!base.commit) {
      lines.push(
        `Would fetch ${base.label} first; its commits are already on ${target.remote}, so ` +
          "no other commit would be pushed.",
        "Checks: not run before the fetch; the run checks the register files at the fetched tip.",
      );
      return { action: "create", lines, wouldStop: false };
    }
    const check = runCheck(state, base.commit, base.remoteTip);
    lines.push(
      `Would push to ${target.remote}/${target.branch}: ` +
        describeRange(state, base.commit, base.remoteTip),
      ...checkLines(check, target, INITIAL_CHECK_HINT),
    );
    return { action: "create", lines, wouldStop: hasViolations(check) };
  }
  if (!state.localTip && state.remoteTip) {
    lines.push(
      `Would create local branch ${target.branch} from ${target.remote}/${target.branch} ` +
        `(${short(state.remoteTip)}); nothing to push.`,
      worktreeLine(state, true),
    );
    return { action: "track", lines, wouldStop: false };
  }
  const localTip = state.localTip!;
  lines.push(worktreeLine(state, true));
  let wouldStop = false;
  if (state.worktree && isRegisterRebaseInProgress(state.worktree)) {
    const conflicts = conflictPaths(state.worktree);
    if (conflicts.length) {
      wouldStop = true;
      lines.push(
        "Unfinished rebase with conflicts; the run would stop:",
        ...conflicts.map((path) => `  ${path}`),
      );
    } else {
      lines.push("Unfinished rebase without conflicts; would continue it.");
    }
  } else if (state.worktree) {
    const dirty = worktreeStatusPaths(state.worktree);
    if (dirty.length) {
      wouldStop = true;
      lines.push("Uncommitted changes; the run would stop:", ...dirty.map((path) => `  ${path}`));
    }
  }
  if (!state.remoteTip) {
    const check = runCheck(state, localTip);
    lines.push(
      `Would push the local branch to new ${target.remote}/${target.branch}: ${describeRange(state, localTip)}`,
      ...checkLines(check, target, INITIAL_CHECK_HINT),
    );
    return { action: "publish", lines, wouldStop: wouldStop || hasViolations(check) };
  }
  if (!hasObject(target.repoRoot, state.remoteTip)) {
    const check = runCheck(state, localTip);
    lines.push(
      `${target.remote}/${target.branch} (${short(state.remoteTip)}) has commits not fetched yet; ` +
        "would pull --rebase before pushing.",
      `Would push: ${describeRange(state, localTip)} before the rebase`,
      ...checkLines(check, target),
    );
    return { action: "sync", lines, wouldStop: wouldStop || hasViolations(check) };
  }
  if (isAncestor(target.repoRoot, localTip, state.remoteTip)) {
    lines.push(`${target.branch} is already on ${target.remote} (${short(state.remoteTip)}).`);
    return { action: "sync", lines, wouldStop };
  }
  const check = runCheck(state, localTip, state.remoteTip);
  if (!isAncestor(target.repoRoot, state.remoteTip, localTip)) {
    lines.push(`Would pull --rebase onto ${target.remote}/${target.branch} before pushing.`);
  }
  lines.push(`Would push: ${describeRange(state, localTip, state.remoteTip)}`);
  lines.push(...checkLines(check, target));
  return { action: "sync", lines, wouldStop: wouldStop || hasViolations(check) };
}

function createBranch(state: BranchState): RegisterBranchPushOutcome {
  const { target } = state;
  const base = initialBase(state, false);
  // Outside --dry-run the remote tip is always fetched, so the commit is known here.
  const commit = base.commit ?? integrationTip(state);
  const notice = base.remoteTip ? [] : [noRemoteIntegrationNotice(state)];
  assertCheckPassed(
    state,
    runCheck(state, commit, base.remoteTip),
    [...notice, INITIAL_CHECK_HINT].join("\n"),
  );
  const range = describeRange(state, commit, base.remoteTip);
  gitOutput(target.repoRoot, ["branch", "--no-track", "--", target.branch, commit]);
  const lines = [
    `Created branch ${target.branch} from ${base.label} (${short(commit)}).`,
    ...notice,
    worktreeLine(state, false),
  ];
  const worktree = ensureWorktree(state);
  pushNewBranch(state, worktree);
  lines.push(`Pushed to ${target.remote}/${target.branch}: ${range}`);
  return { action: "create", lines, wouldStop: false };
}

function trackRemoteBranch(state: BranchState): RegisterBranchPushOutcome {
  const { target } = state;
  gitOutput(target.repoRoot, ["fetch", "--", target.remote, `refs/heads/${target.branch}`]);
  const fetched = gitOutput(target.repoRoot, ["rev-parse", "FETCH_HEAD"]).trim();
  gitOutput(target.repoRoot, ["branch", "--no-track", "--", target.branch, fetched]);
  const lines = [
    `Created local branch ${target.branch} from ${target.remote}/${target.branch} ` +
      `(${short(fetched)}); nothing to push.`,
    worktreeLine(state, false),
  ];
  ensureWorktree(state);
  return { action: "track", lines, wouldStop: false };
}

/** 止まった rebase を続ける。衝突が残っていれば止まる。 */
function continueRebase(state: BranchState, worktree: string): string[] {
  if (!isRegisterRebaseInProgress(worktree)) return [];
  const conflicts = conflictPaths(worktree);
  if (conflicts.length) throw conflictError(state, worktree, conflicts);
  const result = gitResult(worktree, ["rebase", "--continue"], undefined, { GIT_EDITOR: "true" });
  if (result.status !== 0) {
    const remaining = conflictPaths(worktree);
    if (remaining.length) throw conflictError(state, worktree, remaining);
    throw new Error(
      `git rebase --continue failed in ${worktree}: ` +
        `${String(result.stdout ?? "")}${String(result.stderr ?? "")}`.trim(),
    );
  }
  return ["Continued the unfinished rebase."];
}

function syncBranch(state: BranchState): RegisterBranchPushOutcome {
  const { target } = state;
  const lines = [worktreeLine(state, false)];
  const worktree = ensureWorktree(state);
  lines.push(...continueRebase(state, worktree));
  const dirty = worktreeStatusPaths(worktree);
  if (dirty.length) throw dirtyError(state, worktree, dirty);
  const head = (): string => gitOutput(worktree, ["rev-parse", "HEAD"]).trim();

  if (!state.remoteTip) {
    const localTip = head();
    assertCheckPassed(state, runCheck(state, localTip), INITIAL_CHECK_HINT);
    const range = describeRange(state, localTip);
    pushNewBranch(state, worktree);
    clearRegisterRecovery(worktree);
    lines.push(`Pushed the local branch to new ${target.remote}/${target.branch}: ${range}`);
    return { action: "publish", lines, wouldStop: false };
  }

  // Fetch the exact ref even if a single-branch clone has a narrower fetch refspec.
  gitOutput(worktree, ["fetch", "--", target.remote, `refs/heads/${target.branch}`]);
  const remoteHead = gitOutput(worktree, ["rev-parse", "FETCH_HEAD"]).trim();
  // Never rebase unrelated, locally accumulated product commits onto the register branch.
  const before = runCheck(state, head(), remoteHead);
  assertCheckPassed(state, { scopeViolations: before.scopeViolations, shapeViolations: [] });
  const pull = gitResult(worktree, [
    "pull",
    "--rebase",
    "--no-autostash",
    "--",
    target.remote,
    target.branch,
  ]);
  if (pull.status !== 0) {
    const conflicts = conflictPaths(worktree);
    if (conflicts.length) throw conflictError(state, worktree, conflicts);
    throw new Error(
      `git pull --rebase ${target.remote} ${target.branch} failed in ${worktree}: ` +
        `${String(pull.stdout ?? "")}${String(pull.stderr ?? "")}`.trim(),
    );
  }
  if (isAncestor(worktree, head(), remoteHead)) {
    clearRegisterRecovery(worktree);
    lines.push(`${target.branch} is already on ${target.remote} (${short(remoteHead)}).`);
    return { action: "sync", lines, wouldStop: false };
  }
  assertCheckPassed(state, runCheck(state, head(), remoteHead));
  const range = describeRange(state, head(), remoteHead);
  pushRegisterBranch(target, worktree, () => {
    const latest = gitOutput(worktree, ["rev-parse", "FETCH_HEAD"]).trim();
    assertCheckPassed(state, runCheck(state, head(), latest));
  });
  clearRegisterRecovery(worktree);
  lines.push(`Pushed to ${target.remote}/${target.branch}: ${range}`);
  return { action: "sync", lines, wouldStop: false };
}

/**
 * `register branch-push`（PJR-M120）。push の先は `register_sync` の remote と branch だけ。
 * 初回の作成と push、リモートにだけあるブランチの取り込み、止まった同期の復旧を受け持つ。
 */
export async function pushRegisterBranchForProject(
  projectId: string,
  timeZone: string,
  options: RegisterBranchPushOptions = {},
): Promise<RegisterBranchPushOutcome> {
  const initial = loadState(projectId, timeZone);
  // --dry-run は読むだけにし、ロックのファイルも作らない。
  if (options.dryRun) return describeDryRun(initial);
  return inRegisterBranchLock(initial.target, () => {
    // ロックを待つ間に別の同期がブランチや worktree を作っていることがある。
    const state = loadState(projectId, timeZone);
    if (!state.localTip && !state.remoteTip) return createBranch(state);
    if (!state.localTip) return trackRemoteBranch(state);
    return syncBranch(state);
  });
}
