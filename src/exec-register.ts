import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import {
  findItemById,
  parsePjrIndex,
  resolveRegisterPaths,
  TERMINAL_STATUSES_SET,
  type PjrItem,
  type RegisterPaths,
} from "./register.js";
import { injectCommonConventions, MISSING, templatesDir } from "./exec-plans.js";
import { buildSpecdojoFrontmatter } from "./frontmatter-namespace.js";
import { expandTemplate } from "./exec-shared.js";
import { formatMarkdownFile } from "./exec-format.js";
import { specdojoRootDir } from "./specdojo-config.js";

// ---------------------------------------------------------------------------
// Item category
// ---------------------------------------------------------------------------

// 登録項目の実行区分。edit は成果物・実装を変更する対応、investigate は調査して
// 結論案を result に記録する対応（decision / dependency / note は実行対象外）。
export type RegisterTaskCategory = "edit" | "investigate";

const EDIT_TYPES: ReadonlySet<string> = new Set(["todo", "issue", "change-request"]);
const INVESTIGATE_TYPES: ReadonlySet<string> = new Set(["question", "risk"]);

export function registerItemCategory(itemType: string): RegisterTaskCategory | null {
  if (EDIT_TYPES.has(itemType)) return "edit";
  if (INVESTIGATE_TYPES.has(itemType)) return "investigate";
  return null;
}

// 実行可能な登録項目かを検証し、実行区分を返す。実行対象外の type と終端状態は
// 実行前に理由つきで拒否する（終端状態は `register reopen` での復帰を促す）。
export function requireRunnableRegisterItem(item: PjrItem): RegisterTaskCategory {
  const category = registerItemCategory(item.type);
  if (!category) {
    throw new Error(
      `Register item ${item.id} has type "${item.type}", which is not executable. ` +
        `Executable types: ${[...EDIT_TYPES, ...INVESTIGATE_TYPES].join(", ")}`,
    );
  }
  if (TERMINAL_STATUSES_SET.has(item.status)) {
    throw new Error(
      `Register item ${item.id} has terminal status "${item.status}". Use "register reopen" first.`,
    );
  }
  return category;
}

// ---------------------------------------------------------------------------
// Run summary (aggregate display for serial multi-ID runs)
// ---------------------------------------------------------------------------

export type RegisterItemOutcome = "success" | "failure" | "skipped";
export type RegisterItemTransition = "review" | "waiting" | "none";

// ID別の実行結果。commit は "committed <sha>" / "no-changes" / "off" / "skipped"。
export type RegisterItemSummary = {
  id: string;
  title: string;
  outcome: RegisterItemOutcome;
  transition: RegisterItemTransition;
  commit: string;
  reason?: string;
};

// 全ID処理後にID別の成否・状態遷移・commit結果・理由を一覧表示するための整形。
export function formatRegisterRunSummary(summaries: readonly RegisterItemSummary[]): string {
  const lines = ["Register run summary:"];
  for (const summary of summaries) {
    const parts = [
      `  ${summary.id}`,
      summary.outcome.padEnd(7),
      `transition=${summary.transition}`,
      `commit=${summary.commit}`,
    ];
    if (summary.reason) parts.push(`reason=${summary.reason}`);
    lines.push(parts.join("  "));
  }
  return lines.join("\n");
}

// いずれかのIDが failure なら異常終了（exit 1）とする。skipped は失敗とは扱わないが、
// 停止（stop）は先行する failure を伴うため結果的に exit 1 になる。
export function registerRunExitCode(summaries: readonly RegisterItemSummary[]): number {
  return summaries.some((summary) => summary.outcome === "failure") ? 1 : 0;
}

// ---------------------------------------------------------------------------
// Item resolution
// ---------------------------------------------------------------------------

export function normalizePjrId(value: string): string {
  const id = value.trim().toUpperCase();
  if (!/^PJR-\d{4}$/.test(id)) {
    throw new Error(`Invalid register item ID: "${value}". Must match PJR-XXXX (e.g., PJR-0012)`);
  }
  return id;
}

// ---------------------------------------------------------------------------
// Multiple-ID parsing (serial execution input)
// ---------------------------------------------------------------------------

// 失敗時に残りのIDを止めるか継続するか。既定は stop（最初の失敗で残りを skip する）。
export type RegisterFailureMode = "stop" | "continue";

export function isRegisterFailureMode(value: string): value is RegisterFailureMode {
  return value === "stop" || value === "continue";
}

// `--register` の入力（単一文字列・カンマ区切り・variadic 配列・その混在）を
// PJR-ID の実行順リストへ正規化する。各要素は normalizePjrId で検証し、指定順を
// 保持したまま重複は最初の出現のみ残す。除外した重複IDは duplicates に記録する。
export function parseRegisterIds(raw: string | string[] | undefined): {
  ids: string[];
  duplicates: string[];
} {
  const tokens: string[] = [];
  const rawValues = raw === undefined ? [] : Array.isArray(raw) ? raw : [raw];
  for (const value of rawValues) {
    for (const part of value.split(",")) {
      const trimmed = part.trim();
      if (trimmed !== "") tokens.push(trimmed);
    }
  }
  if (tokens.length === 0) {
    throw new Error("No register item ID specified. Provide at least one PJR-XXXX id.");
  }
  const ids: string[] = [];
  const duplicates: string[] = [];
  const seen = new Set<string>();
  for (const token of tokens) {
    const id = normalizePjrId(token);
    if (seen.has(id)) {
      duplicates.push(id);
      continue;
    }
    seen.add(id);
    ids.push(id);
  }
  return { ids, duplicates };
}

// ID単位 commit の対象パスを算出する。項目実行の開始前スナップショット（preexisting）に
// 無く、実行後（current）に現れた変更パスだけを返す。これにより「実行前から存在する
// 利用者の変更」は commit 対象から除外され、当該IDが生成した plan/result/events/成果物
// および register の状態遷移による変更だけが対象になる。戻り値は再現性のためソートする。
export function selectRegisterCommitPaths(
  preexisting: Iterable<string>,
  current: Iterable<string>,
): string[] {
  const before = new Set(preexisting);
  const added = new Set<string>();
  for (const path of current) {
    if (!before.has(path)) added.add(path);
  }
  return [...added].sort();
}

export type RegisterRunTarget = {
  registerPaths: RegisterPaths;
  item: PjrItem;
};

export function resolveRegisterRunTarget(projectId: string, pjrId: string): RegisterRunTarget {
  const registerPaths = resolveRegisterPaths({ project: projectId });
  if (!existsSync(registerPaths.pjrIndexPath)) {
    throw new Error(
      `pjr-index.md not found: ${registerPaths.pjrIndexPath}\n` +
        `Run: specdojo register scaffold --project ${projectId}`,
    );
  }
  const items = parsePjrIndex(readFileSync(registerPaths.pjrIndexPath, "utf8"));
  const item = findItemById(items, pjrId);
  if (!item) {
    throw new Error(`Register item not found in ${registerPaths.pjrIndexPath}: ${pjrId}`);
  }
  return { registerPaths, item };
}

// 登録簿の個票列（`[label](./file.md)` 形式）から個票の絶対パスを取り出す。
// 個票なし（`-`）やリンク以外の値は null を返す。
export function ticketPathFromItem(item: PjrItem, projectRegisterPath: string): string | null {
  const match = item.ticket.match(/\]\(\.\/([^)]+)\)/);
  if (!match) return null;
  return join(projectRegisterPath, match[1]);
}

// runner が register の結論列（Markdown 表セル）に書く失敗理由を安全な 1 行へ整形する。
// セル内の `|` と改行は表を壊すため置換し、読みやすさのため長さも制限する。
const MAX_CONCLUSION_LENGTH = 200;

export function sanitizeRegisterConclusion(reason: string): string {
  const singleLine = reason.replace(/\r?\n/g, " ").replace(/\|/g, "/").trim();
  if (singleLine.length <= MAX_CONCLUSION_LENGTH) return singleLine;
  return `${singleLine.slice(0, MAX_CONCLUSION_LENGTH)}…`;
}

// ---------------------------------------------------------------------------
// Plan generation
// ---------------------------------------------------------------------------

const REGISTER_PLAN_TEMPLATES: Record<RegisterTaskCategory, string> = {
  edit: "xep-register-template.md",
  investigate: "xep-register-investigate-template.md",
};

// Canonical repo-root-relative path (POSIX separators, no leading slash); mirrors the
// convention used by exec-plans for agent-consumed paths.
function repoRelativePath(absPath: string): string {
  return relative(specdojoRootDir(), absPath).replace(/\\/g, "/");
}

// register plan の frontmatter。exec-plan と同じ規約（specdojo 名前空間・xep doc id）に
// 合わせるが、task_id は schedule のタスクではなく登録項目 ID（PJR-XXXX）を指す。
// title は利用者入力で `:` などを含みうるため引用符で囲む。
function registerPlanFrontmatter(projectId: string, stem: string, item: PjrItem): string {
  const localId = `xep-${stem.toLowerCase()}`;
  const docId = projectId ? `${projectId}:${localId}` : localId;
  const inner = [
    `id: ${docId}`,
    `type: exec-plan`,
    `rulebook: none`,
    `task_id: ${item.id}`,
    `name: "${item.title.replace(/"/g, "'")}"`,
    `mode: edit`,
    `status: ready`,
    `project_id: ${projectId}`,
    // 登録簿項目は対象成果物を特定できないため targets を持たない。schedule 由来の
    // タスクと区別できるよう出自を明示する（schema の targets 必須判定にも使う）。
    `origin: register`,
  ];
  if (item.owner && item.owner !== "-" && item.owner !== "_TODO_") {
    inner.push(`owner: ${item.owner}`);
  }
  return buildSpecdojoFrontmatter(inner);
}

export async function generateRegisterPlan(opts: {
  executionPath: string;
  projectId: string;
  registerPaths: RegisterPaths;
  item: PjrItem;
  stem: string;
  outPath?: string;
}): Promise<{ planPath: string; category: RegisterTaskCategory }> {
  const { item } = opts;
  const category = requireRunnableRegisterItem(item);

  const templatePath = join(templatesDir(), REGISTER_PLAN_TEMPLATES[category]);
  if (!existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }
  const template = readFileSync(templatePath, "utf8");

  const plansDir = join(opts.executionPath, "exec", "plans");
  mkdirSync(plansDir, { recursive: true });
  const planPath = opts.outPath ?? join(plansDir, `${opts.stem}-plan.md`);
  const resultRef = `${repoRelativePath(opts.executionPath)}/exec/results/${opts.stem}-result.md`;

  const ticketPath = ticketPathFromItem(item, opts.registerPaths.projectRegisterPath);
  const values: Record<string, string> = {
    _FRONTMATTER_: registerPlanFrontmatter(opts.projectId, opts.stem, item),
    _PJR_ID_: item.id,
    _PJR_TITLE_: item.title,
    _PJR_DESCRIPTION_: item.description && item.description !== "_TODO_" ? item.description : "-",
    _PJR_TYPE_: item.type,
    _PJR_PRIORITY_: item.priority,
    _PJR_OWNER_: item.owner,
    _PJR_DUE_: item.due,
    _PJR_INDEX_PATH_: repoRelativePath(opts.registerPaths.pjrIndexPath),
    _PJR_TICKET_REF_: ticketPath ? `\`${repoRelativePath(ticketPath)}\`` : "-",
    _RESULT_REF_: resultRef,
  };

  const body = expandTemplate(template, values);
  // register 項目は対象成果物の schema を特定できないため、schema 検査の項目は落とす。
  const content = injectCommonConventions(body, MISSING, new Map<string, string>());

  writeFileSync(planPath, content, "utf8");
  await formatMarkdownFile(planPath);
  return { planPath, category };
}
