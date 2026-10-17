import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import {
  sanitizeRegisterConclusion,
  type RegisterItemSummary,
  type RegisterItemTransition,
} from "./register.js";
import { type PjrItem, type RegisterPaths } from "../register/register.js";
import {
  applyRegisterItemFields,
  CELL_NONE,
  readRegisterItemContent,
  registerItemFieldsFromItem,
} from "../register/item.js";
import {
  appendGitFailureLog,
  gitOutput,
  gitResult,
  summarizeGitHookFailure,
  type ExecWorktree,
} from "./worktree.js";
import {
  abortMerge,
  currentBranch,
  normalizeResultWhitespace,
  releaseRootWorkingCopies,
  stabilizeCommitTargets,
  stageCommitTargets,
  unstageCommitTargets,
  worktreeStatusPaths,
} from "./worktree-ops.js";
import { pathInsideWorktree } from "./run-agent.js";
import { repoRelativePath } from "./run-mode-shared.js";
import {
  spawnRegisterTransition,
  registerEventPathForTicket,
  registerRunnerManagedPaths,
} from "./run-register-core.js";

// register の状態遷移（start/review/wait）が変更した調整状態（pjr-index と派生ビュー）だけを
// 抽出する。worktree モードでは成功時の遷移を exec branch、失敗時の wait を root で commit
// する。plan/result は checkpoint と worktree merge が扱うため、ここでは含めない。
export function registerStatePaths(
  repoRoot: string,
  registerPaths: RegisterPaths,
  ticketPath?: string | null,
): string[] {
  const changed = worktreeStatusPaths(repoRoot);
  const exact = new Set([repoRelativePath(repoRoot, registerPaths.pjrIndexPath)]);
  if (ticketPath) exact.add(repoRelativePath(repoRoot, ticketPath));
  const eventPath = registerEventPathForTicket(registerPaths, ticketPath);
  if (eventPath) exact.add(repoRelativePath(repoRoot, eventPath));
  const prefixes = [registerPaths.generatedPath, registerPaths.controlsGeneratedPath].map(
    (path) => `${repoRelativePath(repoRoot, path)}/`,
  );
  const selected = new Set<string>();
  for (const path of changed) {
    const normalized = path.replaceAll("\\", "/");
    if (exact.has(normalized) || prefixes.some((prefix) => normalized.startsWith(prefix))) {
      selected.add(path);
    }
  }
  return [...selected].sort();
}

// register 状態遷移の pjr-index / 派生ビュー変更を root へ 1 コミットする。hook が対象を
// 整形した場合は同じ commit へ収束するまで amend する。commit 対象が無ければ何もしない。
export function commitRegisterState(
  repoRoot: string,
  registerPaths: RegisterPaths,
  message: string,
  ticketPath?: string | null,
  additionalPaths: readonly string[] = [],
  failureLogPath?: string,
): void {
  const paths = [
    ...new Set([
      ...registerStatePaths(repoRoot, registerPaths, ticketPath),
      ...additionalPaths.map((path) => repoRelativePath(repoRoot, path)),
    ]),
  ];
  if (paths.length === 0) return;
  const remainingPaths = (): string[] => registerStatePaths(repoRoot, registerPaths, ticketPath);
  try {
    stageCommitTargets(repoRoot, paths);
    const staged = gitResult(repoRoot, ["diff", "--cached", "--quiet", "--", ...paths]);
    if (staged.status === 0) return;
    if (staged.status !== 1) throw new Error("Failed to inspect staged register-state changes.");
    const commit = gitResult(repoRoot, ["commit", "-m", message, "--", ...paths]);
    if (commit.status !== 0) {
      const output = [commit.stdout, commit.stderr]
        .filter((part): part is string => typeof part === "string" && part.length > 0)
        .join("\n");
      appendGitFailureLog(failureLogPath, [
        `=== ${new Date().toISOString()} git commit register state ===`,
        `exit: ${commit.status ?? "unknown"}`,
        "--- stdout ---",
        typeof commit.stdout === "string" ? commit.stdout : "",
        "--- stderr ---",
        typeof commit.stderr === "string" ? commit.stderr : "",
        "",
      ]);
      throw new Error(`git commit failed: ${summarizeGitHookFailure(output)}`);
    }
    stabilizeCommitTargets(repoRoot, remainingPaths, undefined, failureLogPath);
  } catch (error) {
    unstageCommitTargets(repoRoot, [...paths, ...remainingPaths()]);
    throw error;
  }
}

export function registerPathsInsideWorktree(
  repoRoot: string,
  worktreePath: string,
  paths: RegisterPaths,
): RegisterPaths {
  return {
    ...paths,
    projectRegisterPath: pathInsideWorktree(repoRoot, worktreePath, paths.projectRegisterPath),
    pjrIndexPath: pathInsideWorktree(repoRoot, worktreePath, paths.pjrIndexPath),
    generatedPath: pathInsideWorktree(repoRoot, worktreePath, paths.generatedPath),
    controlsGeneratedPath: pathInsideWorktree(repoRoot, worktreePath, paths.controlsGeneratedPath),
  };
}

// root と task worktree の間で、同じ repo 相対パスのファイルを複製する。複製元に無いパスは
// 複製先からも消す（superseded result のような削除も追従させる）。
export function copyRepoPaths(
  sourceRoot: string,
  targetRoot: string,
  repoRoot: string,
  paths: readonly string[],
): void {
  for (const path of paths) {
    const rel = repoRelativePath(repoRoot, path);
    const source = resolve(sourceRoot, rel);
    const target = resolve(targetRoot, rel);
    if (!existsSync(source)) {
      rmSync(target, { recursive: true, force: true });
      continue;
    }
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(source, target);
  }
}

// 失敗時に root へ戻すのは runner が生成・更新した plan / result だけに限定する。個票と
// event は agent が編集した未検証の本文を含みうるため、root に残してある checkpoint 版を
// wait 遷移の入力にする。派生ビューは遷移後に root で再生成する。
export function registerFailureArtifactPaths(repoRoot: string, paths: readonly string[]): string[] {
  return paths.filter((path) =>
    /(?:^|\/)exec\/(?:plans|results)\//.test(repoRelativePath(repoRoot, path)),
  );
}

export type PreservedRegisterTicket = {
  path: string;
  content: string;
};

// wait commit の個票は検証済みの root 本文を使う一方、exec branch には agent が編集した本文を
// 残す。root の frontmatter から lifecycle フィールドだけを重ね、resume 後も waiting 状態と
// 未統合の作業内容の両方を保持する。
export function restorePreservedRegisterTicket(
  worktreePath: string,
  repoRoot: string,
  preserved: PreservedRegisterTicket | undefined,
): void {
  if (!preserved) return;
  const rel = repoRelativePath(repoRoot, preserved.path);
  const rootTicketPath = resolve(repoRoot, rel);
  const worktreeTicketPath = resolve(worktreePath, rel);
  if (!existsSync(rootTicketPath)) {
    mkdirSync(dirname(worktreeTicketPath), { recursive: true });
    writeFileSync(worktreeTicketPath, preserved.content, "utf8");
    return;
  }
  try {
    const rootContent = readFileSync(rootTicketPath, "utf8");
    const parsed = readRegisterItemContent(rootContent, basename(rel));
    if (!parsed) throw new Error(`could not parse register item: ${rel}`);
    const content = applyRegisterItemFields(preserved.content, {
      ...registerItemFieldsFromItem(parsed.item),
      block_reason: parsed.blockReason === CELL_NONE ? null : parsed.blockReason,
    });
    mkdirSync(dirname(worktreeTicketPath), { recursive: true });
    writeFileSync(worktreeTicketPath, content, "utf8");
  } catch (error) {
    // frontmatter 自体が壊れている場合も agent の作業を失わない。root の wait commit はすでに
    // clean な checkpoint 版で確定しているため、worktree 側だけ元の内容へ戻して警告する。
    mkdirSync(dirname(worktreeTicketPath), { recursive: true });
    writeFileSync(worktreeTicketPath, preserved.content, "utf8");
    process.stderr.write(
      `warning: could not apply the waiting lifecycle to ${rel} in the exec branch: ` +
        `${error instanceof Error ? error.message : String(error)}\n`,
    );
  }
}

// register の状態遷移（start / wait / review）が書き換える追跡ファイル（root 側の絶対パス）:
// 個票、append-only のイベント、存在する場合は登録簿本体（移行前のレイアウト）。gitignore 済みの
// 派生ビューは含めない。
export function registerTransitionPaths(
  registerPaths: RegisterPaths,
  ticketPath: string | null,
): string[] {
  const paths: string[] = [];
  if (ticketPath) paths.push(ticketPath);
  const eventPath = registerEventPathForTicket(registerPaths, ticketPath);
  if (eventPath) paths.push(eventPath);
  if (existsSync(registerPaths.pjrIndexPath)) paths.push(registerPaths.pjrIndexPath);
  return paths;
}

// register 項目の実行管理ファイル（root 側の絶対パス）。再開時は plan / result /
// 遷移ファイルに加え、start 遷移で再生成された派生ビューも、初回 checkpoint と同じ基準で
// runner 管理パスとして扱う。この集合を失敗時の wait commit、merge 前の root 解放で使う。
export function registerBookkeepingPaths(params: {
  repoRoot: string;
  registerPaths: RegisterPaths;
  planPath: string;
  resultPath: string;
  ticketPath: string | null;
}): string[] {
  const { repoRoot, registerPaths, planPath, resultPath, ticketPath } = params;
  return registerRunnerManagedPaths(
    repoRoot,
    registerPaths,
    planPath,
    resultPath,
    worktreeStatusPaths(repoRoot),
    ticketPath,
  ).map((path) => resolve(repoRoot, path));
}

// root の登録簿派生ビュー（pjr-index / generated）は非追跡の生成物で、merge や複製では更新され
// ない。個票の状態を root 側へ反映したあとに再生成して、root の表示を個票と揃える。失敗しても
// 実行結果には影響しないため警告に留める。
export function rebuildRootRegisterViews(projectId: string, itemId: string): void {
  if (!spawnRegisterTransition(projectId, ["build"])) {
    process.stderr.write(`warning: could not rebuild register views at root for ${itemId}\n`);
  }
}

// register worktree 実行の失敗確定。worktree 側の plan / blocked result だけを root へ写し、
// 個票・event は root に残る検証済み checkpoint 版を基準に waiting へ遷移する。統合ブランチには
// `exec(register X): wait` commit 1件だけを作り、未検証の個票本文は exec branch に保持する。
// worktree が無い（checkpoint 前の失敗）場合は root の実行管理ファイルをそのまま commit する。
export function registerWaitSummary(params: {
  repoRoot: string;
  projectId: string;
  registerPaths: RegisterPaths;
  item: PjrItem;
  ticketPath: string | null;
  reason: string;
  actor: string;
  // root 側の絶対パス。worktree がある場合は plan / result だけを root へ写してから遷移する。
  bookkeepingPaths: readonly string[];
  worktree?: ExecWorktree;
}): RegisterItemSummary {
  const { repoRoot, projectId, registerPaths, item, ticketPath, actor, worktree } = params;
  const blockReason = sanitizeRegisterConclusion(params.reason);
  const bookkeepingPaths = [...params.bookkeepingPaths];
  const preservedTicketPath =
    worktree && ticketPath ? pathInsideWorktree(repoRoot, worktree.path, ticketPath) : undefined;
  const preservedTicket: PreservedRegisterTicket | undefined =
    ticketPath && preservedTicketPath && existsSync(preservedTicketPath)
      ? { path: ticketPath, content: readFileSync(preservedTicketPath, "utf8") }
      : undefined;
  if (worktree) {
    copyRepoPaths(
      worktree.path,
      repoRoot,
      repoRoot,
      registerFailureArtifactPaths(repoRoot, bookkeepingPaths),
    );
  }
  let transition: RegisterItemTransition = "waiting";
  if (
    !spawnRegisterTransition(projectId, [
      "wait",
      "--id",
      item.id,
      "--reason",
      blockReason,
      "--by",
      actor,
    ])
  ) {
    process.stderr.write(`register wait transition failed: ${item.id}\n`);
    transition = "none";
  } else {
    const message = `exec(register ${item.id}): wait`;
    const committedPaths = commitRegisterWaitState({
      repoRoot,
      registerPaths,
      item,
      ticketPath,
      bookkeepingPaths,
      message,
    });
    if (worktree)
      syncExecBranchAfterWait({
        repoRoot,
        worktree,
        item,
        bookkeepingPaths: committedPaths,
        preservedTicket,
      });
  }
  return {
    id: item.id,
    title: item.title,
    outcome: "failure",
    transition,
    commit: "off",
    reason: blockReason,
  };
}

// waiting 遷移と実行管理ファイルを root へ 1 commit する。result は commit hook の markdownlint
// 対象で、失敗した run の result（scaffold のまま、または reporter の出力）が記法違反を含むと
// commit ごと失敗する。その場合は result を外して遷移だけを commit し（result は root に未 commit
// のまま残り、merge 前の解放で退避される）、実際に commit した集合を返す。
export function commitRegisterWaitState(params: {
  repoRoot: string;
  registerPaths: RegisterPaths;
  item: PjrItem;
  ticketPath: string | null;
  bookkeepingPaths: readonly string[];
  message: string;
}): string[] {
  const { repoRoot, registerPaths, item, ticketPath, message } = params;
  const paths = [...params.bookkeepingPaths];
  const resultPaths = paths.filter((path) => isRegisterResultPath(repoRoot, path));
  for (const path of resultPaths) {
    if (existsSync(path)) normalizeResultWhitespace(path);
  }
  try {
    commitRegisterState(repoRoot, registerPaths, message, ticketPath, paths);
    return paths;
  } catch (error) {
    if (resultPaths.length === 0) throw error;
    const withoutResult = paths.filter((path) => !resultPaths.includes(path));
    process.stderr.write(
      `warning: wait commit of ${item.id} failed with the result included; retrying without it: ` +
        `${error instanceof Error ? error.message : String(error)}\n`,
    );
    gitResult(repoRoot, [
      "reset",
      "--quiet",
      "--",
      ...resultPaths.map((path) => repoRelativePath(repoRoot, path)),
    ]);
    commitRegisterState(repoRoot, registerPaths, message, ticketPath, withoutResult);
    return withoutResult;
  }
}

export function isRegisterResultPath(repoRoot: string, path: string): boolean {
  return /\/exec\/results\/[^/]+-result\.md$/.test(repoRelativePath(repoRoot, path));
}

// wait commit と、その時点までに統合先へ入った変更を exec branch へ通常 merge する。
// worktree の記帳パスには、root へ複製した blocked result などが未 commit のまま残っている。
// そのままでは root の wait commit に上書きされるとして merge 開始前に拒否されるため、root に
// commit 済みの記帳パスだけを先に exec branch の HEAD へ戻す。checkpoint と wait commit は
// 共通祖先に存在しないイベントファイルなどを双方で追加するため、記帳パスの競合だけは root 側の
// 内容で解決する。それ以外の競合は自動解決せず、merge を abort する。
// merge commit は runner 内部の同期であり、失敗原因となった統合 hook を再実行しないよう
// --no-verify を指定する。同期に失敗した場合は root の記帳内容を worktree へ戻して保持する。
export function syncExecBranchAfterWait(params: {
  repoRoot: string;
  worktree: ExecWorktree;
  item: PjrItem;
  bookkeepingPaths: readonly string[];
  preservedTicket?: PreservedRegisterTicket;
}): void {
  const { repoRoot, worktree, item } = params;
  const bookkeepingPaths = params.bookkeepingPaths.map((path) => repoRelativePath(repoRoot, path));
  try {
    const targetBranch = currentBranch(repoRoot);
    // The same content is already durable in the root wait commit. Releasing these working copies
    // is what lets a normal merge start; all other dirty paths remain untouched.
    releaseRootWorkingCopies(worktree.path, bookkeepingPaths);
    const mergeMessage = `exec(register ${item.id}): merge ${targetBranch} after wait`;
    const mergeResult = gitResult(worktree.path, [
      "merge",
      "--no-commit",
      "--no-ff",
      "--no-verify",
      "-m",
      mergeMessage,
      targetBranch,
    ]);
    if (mergeResult.status !== 0) {
      const mergeHead = gitResult(worktree.path, [
        "rev-parse",
        "--verify",
        "--quiet",
        "MERGE_HEAD",
      ]);
      if (mergeHead.status !== 0) {
        const stderr = typeof mergeResult.stderr === "string" ? mergeResult.stderr.trim() : "";
        throw new Error(
          `git merge failed before conflict resolution${stderr ? `: ${stderr}` : ""}`,
        );
      }
      const conflicted = gitOutput(worktree.path, ["diff", "--name-only", "--diff-filter=U", "-z"])
        .split("\0")
        .filter((path) => path.length > 0);
      const allowed = new Set(bookkeepingPaths);
      const unexpected = conflicted.filter((path) => !allowed.has(path));
      if (unexpected.length > 0) {
        throw new Error(
          `wait sync conflicts outside register bookkeeping: ${unexpected.join(", ")}`,
        );
      }
    }

    copyRepoPaths(repoRoot, worktree.path, repoRoot, params.bookkeepingPaths);
    restorePreservedRegisterTicket(worktree.path, repoRoot, params.preservedTicket);
    stageCommitTargets(worktree.path, bookkeepingPaths);
    const unresolved = gitOutput(worktree.path, ["diff", "--name-only", "--diff-filter=U"]).trim();
    if (unresolved) throw new Error(`wait sync has unresolved conflicts: ${unresolved}`);
    gitOutput(worktree.path, ["commit", "--no-verify", "-m", mergeMessage]);
  } catch (error) {
    abortMerge(worktree.path);
    // The pre-merge release is safe to repeat from root and restores the visible waiting state even
    // when the merge was rejected before MERGE_HEAD was created.
    copyRepoPaths(repoRoot, worktree.path, repoRoot, params.bookkeepingPaths);
    restorePreservedRegisterTicket(worktree.path, repoRoot, params.preservedTicket);
    process.stderr.write(
      `warning: could not sync the exec branch of ${item.id} with the wait commit; ` +
        `the resumed merge may still conflict: ` +
        `${error instanceof Error ? error.message : String(error)}\n`,
    );
  }
}
