import { spawnSync } from "node:child_process";
import {
  appendFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { load } from "../shared/yaml.js";
import {
  deliverableDocPath,
  parsePlanTaskIdentity,
  targetReferenceDirsForApproach,
} from "./plans.js";
import { parseResultTaskIdentity } from "./results.js";
import { stripTerminalControlSequences } from "./shared.js";
import {
  agentProtectedConfigPaths,
  agentProtectedConfigViolation,
  qualifiedRepoPaths,
  type AgentRepoPathChanges,
} from "./agent-protected-config.js";
import { recordProtectedConfigBlockAcrossRepos } from "./protection-handoff.js";
import { assertNoPendingProductChanges, productIntegrationTarget } from "./task-repos.js";
import { specdojoPackageRootDir } from "../shared/package-paths.js";
import {
  appendGitFailureLog,
  appendGitResultFailureLog,
  formatGitResultFailure,
  gitEnvironment,
  gitOutput,
  gitResult,
  summarizeGitHookFailure,
  worktreeNameFromTaskId,
  type ExecWorktree,
} from "./worktree.js";

const MAX_COMMIT_STABILIZATION_ATTEMPTS = 3;

// Minimal context shared by worktree operations. Structurally compatible with the
// ProjectContext used by the CLI commands and the resolved paths used by exec run.
export type WorktreeOpsContext = {
  repoRoot: string;
  schedulePath: string;
  executionPath: string;
  // 成果物カタログのルート。commit 許可リストで、doc-index 未登録の新規成果物の
  // 宣言パスを解決するために使う（省略時は catalog フォールバックなし）。
  catalogPath?: string;
};

export function repoRelative(repoRoot: string, path: string): string {
  const value = relative(repoRoot, path);
  if (!value || value === ".." || value.startsWith(`..${sep}`)) {
    throw new Error(`Path is outside repository root: ${path}`);
  }
  return value.split(sep).join("/");
}

export function currentBranch(repoRoot: string): string {
  const branch = gitOutput(repoRoot, ["branch", "--show-current"]).trim();
  if (!branch) throw new Error("Detached HEAD is not supported for exec worktree commands.");
  return branch;
}

function statusPaths(repoRoot: string): string[] {
  const output = gitOutput(repoRoot, ["status", "--porcelain=v1", "-z", "--untracked-files=all"]);
  const records = output.split("\0").filter(Boolean);
  const paths: string[] = [];
  for (let index = 0; index < records.length; index++) {
    const record = records[index];
    if (record.length < 4) continue;
    const status = record.slice(0, 2);
    paths.push(record.slice(3));
    if ((status.includes("R") || status.includes("C")) && records[index + 1]) {
      paths.push(records[++index]);
    }
  }
  return paths;
}

export function worktreeStatusPaths(repoRoot: string): string[] {
  return statusPaths(repoRoot);
}

export function taskPaths(
  context: WorktreeOpsContext,
  taskId: string,
): {
  planRel: string;
  resultRel: string;
  executionRel: string;
} {
  const executionRel = repoRelative(context.repoRoot, context.executionPath);
  return {
    executionRel,
    planRel: `${executionRel}/exec/plans/${taskId}-plan.md`,
    resultRel: `${executionRel}/exec/results/${taskId}-result.md`,
  };
}

export function isCommitTargetPath(path: string, executionRel: string, resultRel: string): boolean {
  const normalized = path.replaceAll("\\", "/");
  if (normalized === resultRel) return true;
  // doc-index は root と worktree の双方で再生成される生成物。commit-target に含めると
  // merge 時の overlap ガードで衝突するため除外する。
  if (normalized === ".specdojo/doc-index.json") return false;
  if (normalized === "tmp" || normalized.startsWith("tmp/")) return false;
  if (normalized.startsWith(`${executionRel}/exec/plans/`)) return false;
  if (normalized.startsWith(`${executionRel}/exec/results/`)) return false;
  if (normalized.startsWith(`${executionRel}/exec/events/`)) return false;
  if (normalized.startsWith(`${executionRel}/generated/`)) return false;
  return true;
}

// Reads a deliverable's frontmatter `status`. Markdown deliverables carry it in the
// leading `---` frontmatter block; yaml/json deliverables carry it as a top-level field.
// Returns undefined when absent or unparsable (treated as "not ready").
export function deliverableStatus(content: string, relPath: string): string | undefined {
  const isMarkdown = /\.md$/i.test(relPath);
  let source = content;
  if (isMarkdown) {
    const fm = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!fm) return undefined;
    source = fm[1];
  }
  let parsed: unknown;
  try {
    parsed = load(source);
  } catch {
    return undefined;
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return undefined;
  // Markdown deliverables carry status in the `specdojo:` namespace; yaml/json data
  // files carry it as a top-level field.
  const container = isMarkdown
    ? (parsed as Record<string, unknown>).specdojo
    : (parsed as Record<string, unknown>);
  if (!container || typeof container !== "object" || Array.isArray(container)) return undefined;
  const status = (container as Record<string, unknown>).status;
  return typeof status === "string" ? status : undefined;
}

// Promotion of a deliverable's frontmatter status to "ready" is a human-only gate.
// Agents commit their changes through commitWorktreeChanges, so reject (block) any run
// that transitions a deliverable to "ready" here; humans promote out-of-band via a direct
// edit and git commit, which never passes through this path.
function assertNoAgentReadyPromotion(
  context: WorktreeOpsContext,
  worktree: ExecWorktree,
  taskId: string,
  paths: string[],
): void {
  const { resultRel } = taskPaths(context, taskId);
  const resultContent = readWorktreeHeadFile(worktree.path, resultRel);
  if (resultContent && parseResultTaskIdentity(resultContent)?.execution === "human") {
    return;
  }
  const promoted: string[] = [];
  for (const relPath of paths) {
    if (relPath === resultRel) continue;
    const absPath = resolve(worktree.path, relPath);
    if (!existsSync(absPath)) continue; // deletion is not a promotion
    if (deliverableStatus(readFileSync(absPath, "utf8"), relPath) !== "ready") continue;
    const base = gitResult(worktree.path, ["show", `HEAD:${relPath}`]);
    const baseStatus =
      base.status === 0 && typeof base.stdout === "string"
        ? deliverableStatus(base.stdout, relPath)
        : undefined;
    if (baseStatus !== "ready") promoted.push(relPath);
  }
  if (promoted.length > 0) {
    throw new Error(
      `Deliverable status promotion to "ready" is human-only and must not be done by an agent run: ${promoted.join(", ")}`,
    );
  }
}

function isHumanWorktreeExecution(
  context: WorktreeOpsContext,
  worktree: ExecWorktree,
  taskId: string,
): boolean {
  const { resultRel } = taskPaths(context, taskId);
  const resultContent = readWorktreeHeadFile(worktree.path, resultRel);
  return !!resultContent && parseResultTaskIdentity(resultContent)?.execution === "human";
}

// worktree の未 commit 差分に加え、agent が provider 側の git 制約を回避して直接
// commit した差分も検査する。human execution と通常の人間 / orchestrator commit は
// agent 統合経路ではないため、このガードの対象外。
function assertNoAgentProtectedConfigChanges(
  context: WorktreeOpsContext,
  worktree: ExecWorktree,
  taskId: string,
): void {
  if (isHumanWorktreeExecution(context, worktree, taskId)) return;

  const { resultRel } = taskPaths(context, taskId);
  const rootHead = gitOutput(context.repoRoot, ["rev-parse", "HEAD"]).trim();
  const compareBase = gitOutput(worktree.path, ["merge-base", "HEAD", rootHead]).trim();
  const committed = zeroSeparatedPaths(worktree.path, [
    "diff",
    "--no-renames",
    "--name-only",
    "-z",
    `${compareBase}..HEAD`,
  ]);
  const protectedPaths = agentProtectedConfigPaths(worktree.path, [
    ...statusPaths(worktree.path),
    ...committed,
  ]);
  const changes: AgentRepoPathChanges[] = [
    ...(protectedPaths.length > 0
      ? [{ repo: { root: worktree.path }, paths: protectedPaths }]
      : []),
    ...productProtectedConfigChanges(worktree),
  ];
  if (changes.length > 0) {
    const reason = agentProtectedConfigViolation(qualifiedRepoPaths(changes));
    // commit 前の再検査でも、対象と提案差分を result の申し送りへ残してから block する。
    recordProtectedConfigBlockAcrossRepos({
      resultPath: resolve(worktree.path, resultRel),
      changes,
      reason,
    });
    throw new Error(reason);
  }
}

// プロダクト worktree の未 commit 差分と、統合先から進んだ exec branch の commit を保護パスで検査する。
function productProtectedConfigChanges(worktree: ExecWorktree): AgentRepoPathChanges[] {
  return (worktree.repos ?? []).flatMap((product) => {
    if (!existsSync(product.path)) return [];
    const target = productIntegrationTarget(product);
    const base = gitResult(product.path, ["merge-base", "HEAD", target]);
    const compareBase = typeof base.stdout === "string" ? base.stdout.trim() : "";
    const committed =
      base.status === 0 && compareBase
        ? zeroSeparatedPaths(product.path, [
            "diff",
            "--no-renames",
            "--name-only",
            "-z",
            `${compareBase}..HEAD`,
          ])
        : [];
    const paths = agentProtectedConfigPaths(product.path, [
      ...statusPaths(product.path),
      ...committed,
    ]);
    return paths.length > 0 ? [{ repo: { name: product.name, root: product.path }, paths }] : [];
  });
}

const DOC_INDEX_REL = ".specdojo/doc-index.json";

// worktree の HEAD（CLI が checkpoint した版）からファイル内容を読む。
// agent は working tree を書き換えられるが HEAD は書き換えられないため、
// ここから読む情報はプロンプトインジェクションに対して改ざん耐性がある。
function readWorktreeHeadFile(worktreePath: string, relPath: string): string | undefined {
  const result = gitResult(worktreePath, ["show", `HEAD:${relPath}`]);
  return result.status === 0 && typeof result.stdout === "string" ? result.stdout : undefined;
}

// HEAD の doc-index から doc id → repo 相対パスを引く。"path:line" 形式は path 部を使う。
function headDocIndexLookup(worktreePath: string): (id: string) => string | undefined {
  const content = readWorktreeHeadFile(worktreePath, DOC_INDEX_REL);
  let entries: Record<string, unknown> = {};
  if (content) {
    try {
      const parsed: unknown = JSON.parse(content);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        const candidate = (parsed as Record<string, unknown>).entries;
        if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) {
          entries = candidate as Record<string, unknown>;
        }
      }
    } catch {
      // 壊れた index は「引けない」として扱い、catalog フォールバックに委ねる。
    }
  }
  return (id: string) => {
    const value = entries[id];
    if (typeof value !== "string") return undefined;
    const match = value.match(/^(.+):\d+$/);
    return match ? match[1] : value;
  };
}

// commit を許可する範囲。mode 別の許可リスト（review は result のみ、edit は result と
// 対象成果物、maintenance / bootstrap 系 approach は参考資料ディレクトリも追加）。
export type CommitScope = {
  mode: "edit" | "review";
  allowedFiles: string[];
  // 末尾 "/" 付きの repo 相対ディレクトリ prefix
  allowedDirPrefixes: string[];
};

// agent は HEAD の plan、human は HEAD の result frontmatter から commit 許可リストを
// 導出する。いずれも task 識別を復元できない場合は null を返し、呼び出し側は従来の
// 除外リスト方式へフォールバックする。checkpoint 済みの HEAD を読むため、agent の
// working tree 改変からは影響を受けない。
export function resolveCommitScope(
  context: WorktreeOpsContext,
  worktree: ExecWorktree,
  taskId: string,
): { scope: CommitScope | null; unresolvedTargets: string[] } {
  const { executionRel, planRel, resultRel } = taskPaths(context, taskId);
  const resultContent = readWorktreeHeadFile(worktree.path, resultRel);
  const resultIdentity = resultContent ? parseResultTaskIdentity(resultContent) : null;
  const planContent = readWorktreeHeadFile(worktree.path, planRel);
  const planIdentity = planContent ? parsePlanTaskIdentity(planContent) : null;
  // 旧版で生成済みの human plan が残っていても、明示された execution を優先して
  // result の targets を正本に切り替える。
  const identity = resultIdentity?.execution === "human" ? resultIdentity : planIdentity;
  if (!identity) return { scope: null, unresolvedTargets: [] };

  if (identity.mode === "review") {
    return {
      scope: { mode: "review", allowedFiles: [resultRel], allowedDirPrefixes: [] },
      unresolvedTargets: [],
    };
  }

  // register 由来のタスクは許可リスト方式ではなく、作業ツリー差分による commit を使う。
  // 個票が targets を宣言している場合でも、commit scope は従来どおり除外リスト方式へ
  // フォールバックする（target coverage 検証は evidence 側で行い、ここでは使わない）。
  if (identity.origin === "register") return { scope: null, unresolvedTargets: [] };

  // schedule 由来の edit タスクは targets から commit 許可リストを導出する。targets が
  // 無いと許可リストが result 1 件へ縮退し、成果物の変更が commit されないまま worktree に
  // 残る。静かに縮退させず、ここで失敗させる。
  if ((identity.targets ?? []).length === 0) {
    throw new Error(
      `commit-scope: no targets in plan/result frontmatter for edit task ${taskId}. ` +
        `Schedule-originated edit tasks must declare targets; ` +
        `register-originated tasks must declare "origin: register".`,
    );
  }

  const allowedFiles = new Set<string>([resultRel]);
  const unresolvedTargets: string[] = [];
  const lookup = headDocIndexLookup(worktree.path);
  for (const target of identity.targets ?? []) {
    // `<repo>:<path>` はプロダクトリポジトリの対象で、プロダクト側の commit 対象に入る
    // （exec-repo-integration）。プロジェクト側の doc id としては解決しない。
    if (isProductRepoTarget(worktree, target)) continue;
    const fromIndex = lookup(target);
    if (fromIndex) {
      allowedFiles.add(fromIndex);
      continue;
    }
    // doc-index 未登録（未作成の新規成果物など）は catalog が宣言するパスへ解決する。
    const localId =
      identity.projectId && target.startsWith(`${identity.projectId}:`)
        ? target.slice(identity.projectId.length + 1)
        : target;
    const fromCatalog = context.catalogPath
      ? deliverableDocPath(context.catalogPath, localId)
      : undefined;
    if (fromCatalog) {
      allowedFiles.add(fromCatalog);
      continue;
    }
    unresolvedTargets.push(target);
  }
  const allowedDirPrefixes = targetReferenceDirsForApproach(identity.approach).map(
    (dir) => `${dir}/`,
  );
  // Pipeline evidence is runner-owned and stored per task/run. It must be committed together with
  // the eventual reporter-generated result so the structured executor record survives worktree
  // removal. Legacy tasks create no files under this prefix, so their commit scope is unchanged.
  allowedDirPrefixes.push(`${executionRel}/exec/evidence/${worktreeNameFromTaskId(taskId)}/`);
  return {
    scope: { mode: "edit", allowedFiles: [...allowedFiles], allowedDirPrefixes },
    unresolvedTargets,
  };
}

// checkpoint 済みの HEAD の plan（human は result）frontmatter の targets。agent の working tree
// 改変の影響を受けない。プロダクトリポジトリの commit 対象（`<repo>:<path>`）の導出に使う。
export function taskTargetsAtHead(
  context: WorktreeOpsContext,
  worktree: ExecWorktree,
  taskId: string,
): string[] {
  const { planRel, resultRel } = taskPaths(context, taskId);
  const resultContent = readWorktreeHeadFile(worktree.path, resultRel);
  const resultIdentity = resultContent ? parseResultTaskIdentity(resultContent) : null;
  if (resultIdentity?.execution === "human") return resultIdentity.targets ?? [];
  const planContent = readWorktreeHeadFile(worktree.path, planRel);
  return (planContent ? parsePlanTaskIdentity(planContent) : null)?.targets ?? [];
}

// `<repo>:<path>` 形式で、接頭辞がタスクのプロダクト worktree のリポジトリ名である値。
function isProductRepoTarget(worktree: ExecWorktree, target: string): boolean {
  const separator = target.indexOf(":");
  if (separator <= 0) return false;
  const prefix = target.slice(0, separator);
  return (worktree.repos ?? []).some((product) => product.name === prefix);
}

// register 由来のタスクで新規ファイルの作成を許す既知の成果物ディレクトリ。HEAD に追跡
// ファイルを持つ最上位ディレクトリもこれに加える（利用プロジェクト固有の構成に追従するため）。
export const REGISTER_NEW_FILE_DIR_PREFIXES: readonly string[] = [
  "docs/",
  "src/",
  "tests/",
  "tools/",
  "scripts/",
  "packages/",
];

// register 由来のタスクは作業ツリー差分を commit するため、agent が作業用に作った一時ファイル
// （リポジトリ直下の modify.py、patch.js など）まで commit 対象に入る。HEAD に存在しない新規
// ファイルは、既知の成果物ディレクトリ・HEAD の追跡済み最上位ディレクトリ・result・task の
// evidence 配下・個票 targets から解決したパスに限り、それ以外を commit 範囲外とする。
// 既存ファイルの変更と削除は従来どおり除外リスト方式で判定する。
function registerNewFileIsAllowed(
  worktree: ExecWorktree,
  context: WorktreeOpsContext,
  taskId: string,
): (path: string) => boolean {
  const { executionRel, planRel, resultRel } = taskPaths(context, taskId);
  const topLevelDirs = zeroSeparatedPaths(worktree.path, [
    "ls-tree",
    "-d",
    "--name-only",
    "-z",
    "HEAD",
  ]).map((dir) => `${dir}/`);
  const allowedDirPrefixes = [
    ...REGISTER_NEW_FILE_DIR_PREFIXES,
    ...topLevelDirs,
    `${executionRel}/exec/evidence/${worktreeNameFromTaskId(taskId)}/`,
  ];
  const planContent = readWorktreeHeadFile(worktree.path, planRel);
  const targets = (planContent ? parsePlanTaskIdentity(planContent) : null)?.targets ?? [];
  const lookup = headDocIndexLookup(worktree.path);
  const allowedFiles = new Set<string>([resultRel]);
  for (const target of targets) {
    const resolved = lookup(target);
    if (resolved) allowedFiles.add(resolved);
  }
  return (path: string) =>
    !path.includes("/") ||
    allowedFiles.has(path) ||
    allowedDirPrefixes.some((prefix) => path.startsWith(prefix));
}

function pathsTrackedAtHead(worktreePath: string, paths: readonly string[]): Set<string> {
  if (paths.length === 0) return new Set();
  return new Set(
    zeroSeparatedPaths(worktreePath, [
      "ls-tree",
      "-r",
      "--name-only",
      "--full-tree",
      "-z",
      "HEAD",
      "--",
      ...paths,
    ]),
  );
}

function isRegisterOriginTask(
  context: WorktreeOpsContext,
  worktree: ExecWorktree,
  taskId: string,
): boolean {
  const planContent = readWorktreeHeadFile(worktree.path, taskPaths(context, taskId).planRel);
  return (planContent ? parsePlanTaskIdentity(planContent) : null)?.origin === "register";
}

// worktree の変更を「commit するパス」「許可リスト外のため commit しないパス」に分ける。
// 除外リスト（isCommitTargetPath）は許可リストの内側でも引き続き適用する。
export function partitionCommitTargets(
  context: WorktreeOpsContext,
  worktree: ExecWorktree,
  taskId: string,
): { targets: string[]; outOfScope: string[]; unresolvedTargets: string[] } {
  const { executionRel, resultRel } = taskPaths(context, taskId);
  const candidates = statusPaths(worktree.path).filter((path) =>
    isCommitTargetPath(path, executionRel, resultRel),
  );
  const { scope, unresolvedTargets } = resolveCommitScope(context, worktree, taskId);
  if (!scope) {
    // 人間の作業は agent の一時ファイル対策の対象外とし、従来どおり除外リスト方式で commit する。
    if (
      !isRegisterOriginTask(context, worktree, taskId) ||
      isHumanWorktreeExecution(context, worktree, taskId)
    ) {
      return { targets: candidates, outOfScope: [], unresolvedTargets };
    }
    const tracked = pathsTrackedAtHead(worktree.path, candidates);
    const isAllowedNewFile = registerNewFileIsAllowed(worktree, context, taskId);
    const targets: string[] = [];
    const outOfScope: string[] = [];
    for (const path of candidates) {
      const allowed = tracked.has(path) || isAllowedNewFile(path);
      (allowed ? targets : outOfScope).push(path);
    }
    return { targets, outOfScope, unresolvedTargets };
  }

  const targets: string[] = [];
  const outOfScope: string[] = [];
  for (const path of candidates) {
    const allowed =
      scope.allowedFiles.includes(path) ||
      scope.allowedDirPrefixes.some((prefix) => path.startsWith(prefix));
    (allowed ? targets : outOfScope).push(path);
  }
  return { targets, outOfScope, unresolvedTargets };
}

export function commitTargetPaths(
  context: WorktreeOpsContext,
  worktree: ExecWorktree,
  taskId: string,
): string[] {
  return partitionCommitTargets(context, worktree, taskId).targets;
}

// `git add` の pathspec は作業ツリーと index だけを照合する。削除が既に index へ入っている
// パスはそのどちらにも存在しないため、`-A` を付けても「pathspec did not match any files」で
// fatal になる。このようなパスは追加で stage する内容が無いので、add の対象から除外する。
// commit / commit --amend の pathspec は HEAD も照合するため、対象から外さずに削除を記録できる。
export function selectStageablePaths(repoRoot: string, paths: readonly string[]): string[] {
  if (paths.length === 0) return [];
  const indexed = new Set(
    zeroSeparatedPaths(repoRoot, ["ls-files", "--full-name", "-z", "--", ...paths]),
  );
  // 作業ツリー側の存在確認は lstat で行う。git は symlink 自体を追跡するため、リンク先が
  // 無い symlink も add の対象になる（existsSync はリンク先を辿るため false になる）。
  const existsInWorktree = (path: string): boolean =>
    lstatSync(resolve(repoRoot, path), { throwIfNoEntry: false }) !== undefined;
  return paths.filter((path) => indexed.has(path) || existsInWorktree(path));
}

// commit 対象を stage する。stage できる対象が無い場合（staged 済みの削除だけが残る場合）は
// git add を実行しない。commit 対象の限定は呼び出し側の paths が担うため、範囲は変わらない。
export function stageCommitTargets(repoRoot: string, paths: readonly string[]): void {
  const stageable = selectStageablePaths(repoRoot, paths);
  if (stageable.length === 0) return;
  gitOutput(repoRoot, ["add", "-A", "--", ...stageable]);
}

// runner が stage した対象だけを index から戻す。利用者や別処理が stage 済みの無関係な
// パスは保持し、commit / hook の失敗を後続の exec run へ持ち越さない。
export function unstageCommitTargets(repoRoot: string, paths: readonly string[]): void {
  const unique = [...new Set(paths)];
  if (unique.length === 0) return;
  gitOutput(repoRoot, ["reset", "--quiet", "--", ...unique]);
}

// markdownlint-cli の終了コード。1 だけが記法違反を表し、それ以外は実行環境の問題である。
const MARKDOWNLINT_EXIT_LINT_ERRORS = 1;

// worktree または SpecDojo package の node_modules から markdownlint-cli を探す。
// markdownlint-cli は devDependency のため、配布先の利用プロジェクトでは存在しないことがある。
function findMarkdownlintExecutable(worktreePath: string): string | undefined {
  const executableName = process.platform === "win32" ? "markdownlint.cmd" : "markdownlint";
  const candidates = [
    join(worktreePath, "node_modules", ".bin", executableName),
    join(specdojoPackageRootDir(), "node_modules", ".bin", executableName),
  ];
  return candidates.find(existsSync);
}

// result は commit hook の Prettier 実行対象から除外するため（.prettierignore）、runner が
// commit 前に markdownlint を直接実行する。hook 由来の汎用的な git commit 失敗ではなく、
// result の記法違反として block 理由を残せるようにする。
// markdownlint-cli が見つからない環境では検査を省略し、hook 側の検査に委ねる。
// 行末の空白を除き、ファイル末尾を改行 1 つに揃える。強調記法など内容に関わる置換は行わない。
export function normalizeResultWhitespace(resultPath: string): void {
  const content = readFileSync(resultPath, "utf8");
  const normalized = content.replace(/[ \t]+$/gm, "").replace(/\n*$/, "\n");
  if (normalized !== content) writeFileSync(resultPath, normalized, "utf8");
}

export function assertResultMarkdownlint(
  context: WorktreeOpsContext,
  worktree: ExecWorktree,
  taskId: string,
): void {
  const { resultRel } = taskPaths(context, taskId);
  const resultPath = resolve(worktree.path, resultRel);
  if (!existsSync(resultPath)) {
    process.stdout.write(
      `result-markdownlint: result ${resultRel} not found; skipped pre-commit lint\n`,
    );
    return;
  }

  // reporter の出力に由来する行末の空白と末尾改行の不足は、内容に影響しない空白だけの違反
  // （MD009 / MD047）であり、以前は commit hook の Prettier が黙って整えていた。Prettier の
  // 対象外にした分をここで補い、記法違反として block するのは内容に関わる違反に限る。
  normalizeResultWhitespace(resultPath);

  const executable = findMarkdownlintExecutable(worktree.path);
  if (!executable) {
    process.stdout.write(
      `result-markdownlint: markdownlint-cli not found; skipped pre-commit lint of ${resultRel}\n`,
    );
    return;
  }

  const result = spawnSync(executable, [resultRel], {
    cwd: worktree.path,
    encoding: "utf8",
    env: gitEnvironment(),
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (!result.error && result.status === 0) return;

  const output = stripTerminalControlSequences(
    [result.stdout, result.stderr, result.error?.message].filter(Boolean).join("\n"),
  )
    .trim()
    .replace(/\s+/g, " ");
  const detail = output ? output.slice(0, 1_000) : `exit ${result.status ?? "unknown"}`;
  if (!result.error && result.status === MARKDOWNLINT_EXIT_LINT_ERRORS) {
    throw new Error(`Result Markdown notation violation before commit: ${detail}`);
  }
  throw new Error(`Failed to run markdownlint on ${resultRel} before commit: ${detail}`);
}

export function stabilizeCommitTargets(
  repoRoot: string,
  listRemainingPaths: () => string[],
  maxAttempts = MAX_COMMIT_STABILIZATION_ATTEMPTS,
  failureLogPath?: string,
): void {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const paths = listRemainingPaths();
    if (paths.length === 0) return;

    stageCommitTargets(repoRoot, paths);
    const stagedArgs = ["diff", "--cached", "--quiet", "--", ...paths];
    const staged = gitResult(repoRoot, stagedArgs);
    if (staged.status === 0) {
      // pathspec commit は hook が再stageした内容を commit した後、元の index を復元して
      // HEAD と逆向きの差分を残す場合がある。この場合は add が index を HEAD へ揃えて
      // 差分を解消するため、再取得して消えていれば正常な収束として扱う。
      const remaining = listRemainingPaths();
      if (remaining.length === 0) return;
      throw new Error(`Failed to stage post-hook commit-target changes: ${remaining.join(", ")}`);
    }
    if (staged.status !== 1) {
      appendGitResultFailureLog(failureLogPath, "git diff post-hook worktree inspection", staged);
      throw new Error(
        `Failed to inspect post-hook worktree changes: ${formatGitResultFailure(stagedArgs, staged)}`,
      );
    }

    const commitArgs = ["commit", "--amend", "--no-edit", "--", ...paths];
    const commit = gitResult(repoRoot, commitArgs);
    if (commit.status !== 0) {
      const output = [commit.stdout, commit.stderr]
        .filter((part): part is string => typeof part === "string" && part.length > 0)
        .join("\n");
      appendGitFailureLog(failureLogPath, [
        `=== ${new Date().toISOString()} git commit --amend ===`,
        `exit: ${commit.status ?? "unknown"}`,
        "--- stdout ---",
        typeof commit.stdout === "string" ? commit.stdout : "",
        "--- stderr ---",
        typeof commit.stderr === "string" ? commit.stderr : "",
        "",
      ]);
      throw new Error(`git commit --amend failed: ${summarizeGitHookFailure(output)}`);
    }
  }

  const dirty = listRemainingPaths();
  if (dirty.length > 0) {
    throw new Error(`Pre-commit hooks kept changing commit-target files: ${dirty.join(", ")}`);
  }
}

export function zeroSeparatedPaths(repoRoot: string, args: string[]): string[] {
  return gitOutput(repoRoot, args).split("\0").filter(Boolean);
}

export function rootDirtyPaths(repoRoot: string): Set<string> {
  return new Set([
    ...zeroSeparatedPaths(repoRoot, ["diff", "--no-renames", "--name-only", "-z"]),
    ...zeroSeparatedPaths(repoRoot, ["diff", "--cached", "--no-renames", "--name-only", "-z"]),
    ...zeroSeparatedPaths(repoRoot, ["ls-files", "--others", "--exclude-standard", "-z"]),
  ]);
}

export const ROOT_NEW_FILES_HANDOFF_LABEL = "最上位に追加したファイル";

export function applyRootNewFilesHandoff(content: string, files: readonly string[]): string {
  const normalized = content.replace(/\r\n/g, "\n");
  const uniqueFiles = [...new Set(files)];
  if (uniqueFiles.length === 0) return normalized;

  const linePattern = new RegExp(`^[ \\t]*- +${ROOT_NEW_FILES_HANDOFF_LABEL}: *(.*)$`, "m");
  const match = linePattern.exec(normalized);
  if (match) {
    const existingMatches = [...match[1].matchAll(/`([^`]+)`/g)].map((m) => m[1]);
    const merged = [...new Set([...existingMatches, ...uniqueFiles])];
    const newLine = `- ${ROOT_NEW_FILES_HANDOFF_LABEL}: ${merged.map((f) => `\`${f}\``).join(", ")}`;
    return normalized.replace(match[0], newLine);
  }

  const handoffHeading = /^## +\d+\. +申し送り[ \t]*$/m.exec(normalized);
  if (handoffHeading) {
    const start = handoffHeading.index + handoffHeading[0].length;
    const rest = normalized.slice(start);
    const nextHeading = /^##\s+/m.exec(rest);
    const end = nextHeading ? start + nextHeading.index : normalized.length;
    const sectionBody = normalized.slice(start, end);

    const newLine = `- ${ROOT_NEW_FILES_HANDOFF_LABEL}: ${uniqueFiles.map((f) => `\`${f}\``).join(", ")}`;

    const markerIndex = sectionBody.indexOf("<!-- specdojo:agent-protection-handoff -->");
    const beforeMarker = markerIndex === -1 ? sectionBody : sectionBody.slice(0, markerIndex);
    const afterMarker = markerIndex === -1 ? "" : sectionBody.slice(markerIndex);

    const trimmedBefore = beforeMarker.trim();
    let updatedBefore: string;
    if (
      trimmedBefore === "" ||
      trimmedBefore === "- なし" ||
      trimmedBefore === "なし" ||
      trimmedBefore.includes("_TODO_")
    ) {
      updatedBefore = newLine;
    } else {
      updatedBefore = `${trimmedBefore}\n${newLine}`;
    }

    const newSectionBody = afterMarker
      ? `\n\n${updatedBefore}\n\n${afterMarker}\n\n`
      : `\n\n${updatedBefore}\n\n`;

    const updated = `${normalized.slice(0, start)}${newSectionBody}${normalized.slice(end)}`;
    return updated.replace(/\n{3,}/g, "\n\n").replace(/\n*$/, "\n");
  }

  const numbers = [...normalized.matchAll(/^##\s+(\d+)\./gm)].map((m) => Number(m[1]));
  const nextNum = numbers.length === 0 ? 1 : Math.max(...numbers) + 1;
  const newLine = `- ${ROOT_NEW_FILES_HANDOFF_LABEL}: ${uniqueFiles.map((f) => `\`${f}\``).join(", ")}`;
  return `${normalized.trimEnd()}\n\n## ${nextNum}. 申し送り\n\n${newLine}\n`;
}

export function recordRootNewFilesHandoff(
  resultPath: string | undefined,
  files: readonly string[],
): boolean {
  if (!resultPath || !existsSync(resultPath) || files.length === 0) return false;
  try {
    const content = readFileSync(resultPath, "utf8");
    const updated = applyRootNewFilesHandoff(content, files);
    if (updated === content) return false;
    writeFileSync(resultPath, updated, "utf8");
    return true;
  } catch {
    return false;
  }
}

// Commit the task result and deliverable changes inside the worktree onto its exec branch.
// The commit is limited to the mode-based allowlist (resolveCommitScope); out-of-scope
// changes stay uncommitted in the worktree and are reported. Excludes plans, events,
// generated files, and other tasks' results (see isCommitTargetPath).
export function commitWorktreeChanges(params: {
  context: WorktreeOpsContext;
  worktree: ExecWorktree;
  taskId: string;
  message?: string;
  dryRun?: boolean;
  // commit-scope の警告を追記する evidence 側のログ（run ディレクトリの integrate.log）。
  // worktree 内の evidence 配下を指す場合は、同じ commit に含まれる。
  scopeLogPath?: string;
  // commit hook 失敗の秘匿済み stdout / stderr を保存する run 単位のログ。
  failureLogPath?: string;
  // 呼び出し側（exec run の統合段）がプロダクトリポジトリの commit と統合を行う場合に true。
  // false（手動の `exec worktree commit` など）では、プロダクトに未統合の変更が残るタスクの
  // プロジェクト側だけを commit しない。統合後の撤去でプロダクトの変更を失わないため。
  productsIntegratedByCaller?: boolean;
  productRootNewFiles?: readonly string[];
}): { targets: string[]; committed: boolean } {
  const { context, worktree, taskId } = params;
  assertNoAgentProtectedConfigChanges(context, worktree, taskId);
  if (!params.productsIntegratedByCaller) assertNoPendingProductChanges(worktree);
  let partition = partitionCommitTargets(context, worktree, taskId);
  const scopeWarnings = [
    ...partition.unresolvedTargets.map(
      (target) => `commit-scope: unresolved target doc id (not committable): ${target}\n`,
    ),
    ...(partition.outOfScope.length > 0
      ? [
          `commit-scope: skipped non-target changes (left in worktree):\n${partition.outOfScope
            .map((path) => `  ${path}`)
            .join("\n")}\n`,
        ]
      : []),
  ];
  for (const warning of scopeWarnings) process.stdout.write(warning);
  if (scopeWarnings.length > 0 && params.scopeLogPath && !params.dryRun) {
    mkdirSync(resolve(params.scopeLogPath, ".."), { recursive: true });
    appendFileSync(params.scopeLogPath, scopeWarnings.join(""), "utf8");
    // 追記したログ自体を commit 対象に含めるため、分類をやり直す。
    partition = partitionCommitTargets(context, worktree, taskId);
  }

  const { resultRel } = taskPaths(context, taskId);
  const trackedAtHead = pathsTrackedAtHead(worktree.path, partition.targets);
  const projectRootNewFiles = partition.targets.filter(
    (path) => !path.includes("/") && !trackedAtHead.has(path) && path !== resultRel,
  );
  if (projectRootNewFiles.length > 0) {
    const rootNewWarning =
      `最上位に追加したファイル:\n` +
      `${projectRootNewFiles.map((path) => `  ${path}`).join("\n")}\n`;
    process.stdout.write(rootNewWarning);
    if (params.scopeLogPath && !params.dryRun) {
      mkdirSync(resolve(params.scopeLogPath, ".."), { recursive: true });
      appendFileSync(params.scopeLogPath, rootNewWarning, "utf8");
      partition = partitionCommitTargets(context, worktree, taskId);
    }
  }

  const allRootNewFiles = [...(params.productRootNewFiles ?? []), ...projectRootNewFiles];
  if (allRootNewFiles.length > 0 && !params.dryRun) {
    const resultPath = resolve(worktree.path, resultRel);
    if (recordRootNewFilesHandoff(resultPath, allRootNewFiles)) {
      partition = partitionCommitTargets(context, worktree, taskId);
    }
  }

  const paths = partition.targets;
  if (paths.length === 0) {
    process.stdout.write("No commit-target changes.\n");
    return { targets: [], committed: false };
  }
  assertNoAgentReadyPromotion(context, worktree, taskId, paths);
  process.stdout.write(`commit-targets:\n${paths.map((path) => `  ${path}`).join("\n")}\n`);
  if (params.dryRun) return { targets: paths, committed: false };

  assertResultMarkdownlint(context, worktree, taskId);
  stageCommitTargets(worktree.path, paths);
  const stagedArgs = ["diff", "--cached", "--quiet", "--", ...paths];
  const staged = gitResult(worktree.path, stagedArgs);
  if (staged.status === 0) {
    process.stdout.write("No staged commit-target changes.\n");
    return { targets: paths, committed: false };
  }
  if (staged.status !== 1) {
    appendGitResultFailureLog(params.failureLogPath, "git diff staged worktree inspection", staged);
    throw new Error(
      `Failed to inspect staged worktree changes: ${formatGitResultFailure(stagedArgs, staged)}`,
    );
  }
  const commitArgs = [
    "commit",
    "-m",
    params.message?.trim() || `exec(${taskId}): apply task changes`,
    "--",
    ...paths,
  ];
  const commit = gitResult(worktree.path, commitArgs);
  if (commit.status !== 0) {
    const output = [commit.stdout, commit.stderr]
      .filter((part): part is string => typeof part === "string" && part.length > 0)
      .join("\n");
    appendGitFailureLog(params.failureLogPath, [
      `=== ${new Date().toISOString()} git commit task changes ===`,
      `exit: ${commit.status ?? "unknown"}`,
      "--- stdout ---",
      typeof commit.stdout === "string" ? commit.stdout : "",
      "--- stderr ---",
      typeof commit.stderr === "string" ? commit.stderr : "",
      "",
    ]);
    throw new Error(`git commit failed: ${summarizeGitHookFailure(output)}`);
  }
  stabilizeCommitTargets(
    worktree.path,
    () => commitTargetPaths(context, worktree, taskId),
    undefined,
    params.failureLogPath,
  );
  return { targets: paths, committed: true };
}
