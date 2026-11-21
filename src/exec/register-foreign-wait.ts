import { stagedMergeBlocker } from "../shared/git.js";
import { escapeRegExp } from "../shared/text.js";
import { acquireSchedulerLock, releaseSchedulerLock } from "./events.js";
import { currentBranch } from "./worktree-ops-commit.js";
import { abortMerge } from "./worktree-ops-merge.js";
import { gitOutput, gitResult, summarizeGitHookFailure, type ExecWorktree } from "./worktree.js";

// PJR-97KE: job の worktree の中で作られた子の run は、wait の commit が job の branch に入り、
// 本体の作業ツリー（日中の再開の起点）には plan も waiting の記録も無い。wait の後に exec branch
// へ統合先を取り込む merge（`merge <target> after wait`）の第2親が、その記録を持つ統合先の
// commit である。本体の HEAD がこの commit を含まないとき、再開の前に本体へ merge する。
// exec branch の先端ではなくこの commit を取り込むのは、exec branch を本体の祖先にすると
// 統合の段が「merge 済み」と誤認するためである。記録を複製せず履歴として取り込むので、
// 後で job の branch を本体へ統合しても、同じ commit を共有して衝突しない。

const LOCK_TIMEOUT_MS = 10_000;
const LOCK_STALE_MS = 300_000;

export type ForeignWaitRecords = {
  // wait の commit を含む統合先の commit（wait 後の同期 merge の第2親）。
  commit: string;
  // 子の run が統合先にした branch（job の worktree の branch など）。
  target: string;
};

// exec branch の first-parent 履歴から最新の wait 後の同期 merge を探し、その統合先の commit が
// 本体の HEAD に含まれていなければ返す。同期 merge が無い、または含まれている場合は null。
export function findForeignWaitRecords(params: {
  repoRoot: string;
  worktree: Pick<ExecWorktree, "branch">;
  itemId: string;
}): ForeignWaitRecords | null {
  const { repoRoot, worktree, itemId } = params;
  const subject = new RegExp(`^exec\\(register ${escapeRegExp(itemId)}\\): merge (.+) after wait$`);
  const log = gitResult(repoRoot, [
    "log",
    "--first-parent",
    "--merges",
    "--format=%P%x09%s",
    worktree.branch,
    "--",
  ]);
  if (log.status !== 0 || typeof log.stdout !== "string") return null;
  for (const line of log.stdout.split("\n")) {
    const tab = line.indexOf("\t");
    if (tab < 0) continue;
    const match = subject.exec(line.slice(tab + 1));
    if (!match) continue;
    const parents = line.slice(0, tab).trim().split(/\s+/);
    const commit = parents[1];
    if (!commit) return null;
    const contained =
      gitResult(repoRoot, ["merge-base", "--is-ancestor", commit, "HEAD"]).status === 0;
    return contained ? null : { commit, target: match[1] };
  }
  return null;
}

// 統合先の wait の記録を本体の現在の branch へ merge commit 1件で取り込む。取り込めない場合は
// merge を中止して本体を元に戻し、理由を例外で返す。
export function adoptForeignWaitRecords(params: {
  repoRoot: string;
  schedulePath: string;
  itemId: string;
  records: ForeignWaitRecords;
}): void {
  const { repoRoot, schedulePath, itemId, records } = params;
  const targetBranch = currentBranch(repoRoot);
  const lockDir = acquireSchedulerLock(schedulePath, {
    actor: `register-adopt:${itemId}`,
    lockTimeoutMs: LOCK_TIMEOUT_MS,
    lockStaleMs: LOCK_STALE_MS,
  });
  try {
    const staged = stagedMergeBlocker(repoRoot);
    if (staged) throw new Error(staged);
    const message = `exec(register ${itemId}): merge ${records.target} records before resume`;
    const merge = gitResult(repoRoot, ["merge", "--no-ff", "-m", message, records.commit]);
    if (merge.status === 0) return;
    const output = [merge.stdout, merge.stderr]
      .filter((part): part is string => typeof part === "string" && part.length > 0)
      .join("\n");
    if (gitResult(repoRoot, ["rev-parse", "--verify", "--quiet", "MERGE_HEAD"]).status === 0) {
      abortMerge(repoRoot);
    }
    throw new Error(
      `git merge of ${records.target} (${records.commit.slice(0, 12)}) into ${targetBranch} failed: ` +
        summarizeGitHookFailure(output),
    );
  } finally {
    releaseSchedulerLock(lockDir);
  }
}

// 取り込んだ commit のうち、本体に無かったものの数（利用者への表示用）。
export function countForeignCommits(repoRoot: string, records: ForeignWaitRecords): number {
  const count = Number.parseInt(
    gitOutput(repoRoot, ["rev-list", "--count", `HEAD..${records.commit}`]).trim(),
    10,
  );
  return Number.isFinite(count) ? count : 0;
}
