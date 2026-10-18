import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import {
  findRegisterItem,
  loadRegisterItems,
  PJR_ID_RE,
  resolveRegisterPaths,
  TERMINAL_STATUSES_SET,
  VALID_PRIORITIES,
  VALID_STATUSES,
  VALID_TYPES,
  type PjrItem,
  type RegisterPaths,
} from "../register/register.js";
import {
  execTemplatePath,
  injectCommonConventions,
  MISSING,
  registerGradeFindingsText,
} from "./plans.js";
import { generateRegisterApproachPlan } from "./plans-generation.js";
import {
  findUniqueDeliverableForKataTarget,
  resolveDeliverableByDocId,
  type DeliverableInfo,
} from "./plans-core.js";
import { collectDocIndexEntries } from "../docs/doc-index.js";
import { resolveKataRefs, type KataRefs } from "../kata/kata.js";
import { buildSpecdojoFrontmatter } from "../docs/frontmatter-namespace.js";
import {
  escapeMarkdownInline,
  expandTemplate,
  inlineCodeAnglePlaceholders,
  stripTerminalControlSequences,
} from "./shared.js";
import { formatMarkdownFile } from "./format.js";
import { specdojoRootDir } from "../shared/specdojo-config.js";

// ---------------------------------------------------------------------------
// Item category
// ---------------------------------------------------------------------------

// 登録項目の実行区分。edit は成果物・実装を変更する対応、investigate は調査して
// 結論案を result に記録する対応（decision / note は実行対象外）。
export type RegisterTaskCategory = "edit" | "investigate";

const EDIT_TYPES: ReadonlySet<string> = new Set(["todo", "issue", "change-request"]);
const INVESTIGATE_TYPES: ReadonlySet<string> = new Set(["question", "risk"]);

export function registerItemCategory(itemType: string): RegisterTaskCategory | null {
  if (EDIT_TYPES.has(itemType)) return "edit";
  if (INVESTIGATE_TYPES.has(itemType)) return "investigate";
  return null;
}

export type RegisterSelectionFilter = {
  types?: string[];
  priorities?: string[];
  statuses?: string[];
  limit?: number;
};

const DEFAULT_SELECTION_TYPES = VALID_TYPES.filter((type) => registerItemCategory(type) !== null);

function parseRegisterFilterList(
  value: string | undefined,
  name: string,
  allowed: readonly string[],
): string[] | undefined {
  if (value === undefined) return undefined;
  const values = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  if (values.length === 0) throw new Error(`${name} must contain at least one value`);
  for (const item of values) {
    if (!allowed.includes(item)) {
      throw new Error(`${name} contains unknown value "${item}". Allowed: ${allowed.join(", ")}`);
    }
  }
  return [...new Set(values)];
}

export function parseRegisterSelectionFilter(opts: {
  types?: string;
  priorities?: string;
  statuses?: string;
  limit?: string;
}): RegisterSelectionFilter {
  const types = parseRegisterFilterList(opts.types, "--register-types", VALID_TYPES);
  const priorities = parseRegisterFilterList(
    opts.priorities,
    "--register-priorities",
    VALID_PRIORITIES,
  );
  const statuses = parseRegisterFilterList(opts.statuses, "--register-statuses", VALID_STATUSES);
  let limit: number | undefined;
  if (opts.limit !== undefined) {
    if (!/^[1-9]\d*$/.test(opts.limit)) {
      throw new Error(`--register-limit must be a positive integer: ${opts.limit}`);
    }
    limit = Number.parseInt(opts.limit, 10);
    if (!Number.isSafeInteger(limit)) {
      throw new Error(`--register-limit must be a positive integer: ${opts.limit}`);
    }
  }
  return {
    ...(types ? { types } : {}),
    ...(priorities ? { priorities } : {}),
    ...(statuses ? { statuses } : {}),
    ...(limit !== undefined ? { limit } : {}),
  };
}

export function selectRegisterItems(
  items: readonly PjrItem[],
  filter: RegisterSelectionFilter,
): PjrItem[] {
  const types = filter.types ?? DEFAULT_SELECTION_TYPES;
  const statuses = filter.statuses ?? ["open"];
  const selected = items
    .filter(
      (item) =>
        registerItemCategory(item.type) !== null &&
        types.includes(item.type) &&
        statuses.includes(item.status) &&
        (!filter.priorities || filter.priorities.includes(item.priority)),
    )
    .sort((a, b) => a.id.localeCompare(b.id));
  return filter.limit === undefined ? selected : selected.slice(0, filter.limit);
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
export type RegisterItemTransition = "review" | "waiting" | "done" | "none";

// ID別の実行結果。commit は
// "committed <sha>" / "no-changes" / "incomplete" / "off" / "skipped"。
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
  if (!PJR_ID_RE.test(id)) {
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
// 無く、実行後（current）に現れた変更パスを返す。ただし runnerManaged に明示された
// 登録簿・派生ビュー・当該 plan/result は、失敗試行などで開始前から dirty でも対象にする。
// これにより利用者の既存変更を保護しつつ、runner 自身の状態遷移は取りこぼさない。
// 戻り値は再現性のため重複除去してソートする。
export function selectRegisterCommitPaths(
  preexisting: Iterable<string>,
  current: Iterable<string>,
  runnerManaged: Iterable<string> = [],
): string[] {
  const before = new Set(preexisting);
  const managed = new Set(runnerManaged);
  const added = new Set<string>();
  for (const path of current) {
    if (!before.has(path) || managed.has(path)) added.add(path);
  }
  return [...added].sort();
}

// 過去の register 実行が未commitのまま残した plan/result を抽出する。現在の実行が
// 生成する前のスナップショットへ適用し、別IDの履歴へ暗黙に混ぜず警告するために使う。
export function selectRegisterRunArtifactResidue(paths: Iterable<string>): string[] {
  const residue = new Set<string>();
  for (const path of paths) {
    const normalized = path.replaceAll("\\", "/");
    if (
      /(?:^|\/)exec\/(?:plans|results)\/pjr-\d{4}-\d{8}T\d{6}Z-[a-f0-9]+-(?:plan|result)\.md$/i.test(
        normalized,
      )
    ) {
      residue.add(path);
    }
  }
  return [...residue].sort();
}

export type RegisterRunTarget = {
  registerPaths: RegisterPaths;
  item: PjrItem;
};

export function resolveRegisterRunTarget(projectId: string, pjrId: string): RegisterRunTarget {
  const registerPaths = resolveRegisterPaths({ project: projectId });
  if (!existsSync(registerPaths.projectRegisterPath)) {
    throw new Error(
      `Project register directory not found: ${registerPaths.projectRegisterPath}\n` +
        `Run: specdojo register scaffold --project ${projectId}`,
    );
  }
  // 登録項目の正本は個票 frontmatter。個票が無い（未移行の）項目は pjr-index の行から読む。
  const view = findRegisterItem(loadRegisterItems(registerPaths), pjrId);
  if (!view) {
    throw new Error(`Register item not found in ${registerPaths.projectRegisterPath}: ${pjrId}`);
  }
  return { registerPaths, item: view.item };
}

// 登録簿の個票列（`[label](./file.md)` 形式）から個票の絶対パスを取り出す。
// 個票なし（`-`）やリンク以外の値は null を返す。
export function ticketPathFromItem(item: PjrItem, projectRegisterPath: string): string | null {
  const match = item.ticket.match(/\]\(\.\/([^)]+)\)/);
  if (!match) return null;
  return join(projectRegisterPath, match[1]);
}

// runner が register の結論列（Markdown 表セル）に書く失敗理由を安全な 1 行へ整形する。
// 失敗理由には subprocess の生出力が含まれうるため、まず ANSI エスケープシーケンスや
// 制御文字を除去する（lefthook 等の色付き出力が結論列を破壊するのを防ぐ）。そのうえで
// セル内の `|` と改行は表を壊すため置換し、読みやすさのため長さも制限する。
const MAX_CONCLUSION_LENGTH = 200;

export function sanitizeRegisterConclusion(reason: string): string {
  const singleLine = stripTerminalControlSequences(reason)
    .replace(/\r?\n/g, " ")
    .replace(/\|/g, "/")
    .trim();
  const truncated =
    singleLine.length <= MAX_CONCLUSION_LENGTH
      ? singleLine
      : `${singleLine.slice(0, MAX_CONCLUSION_LENGTH)}…`;
  return inlineCodeAnglePlaceholders(truncated);
}

// ---------------------------------------------------------------------------
// Plan generation
// ---------------------------------------------------------------------------

const REGISTER_PLAN_TEMPLATES: Record<RegisterTaskCategory, string> = {
  edit: "xep-register-template.md",
  investigate: "xep-register-investigate-template.md",
};

const MAINTENANCE_TARGET_KIND = {
  "rulebook-maintenance": "rulebook",
  "recipe-maintenance": "recipe",
  "sample-maintenance": "sample",
  "template-maintenance": "template",
} as const;

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
    `name: ${JSON.stringify(item.title)}`,
    `mode: edit`,
    `status: ready`,
    `project_id: ${projectId}`,
    // schedule 由来のタスクと区別できるよう出自を明示する（schema の targets 必須判定
    // にも使う）。個票が targets を宣言していれば plan にも転記し、target coverage
    // 検証を有効にする。宣言がない項目は targets を持たず、検証は skip される。
    `origin: register`,
  ];
  if (item.owner && item.owner !== "-" && item.owner !== "_TODO_") {
    inner.push(`owner: ${item.owner}`);
  }
  if (item.targets && item.targets.length > 0) {
    inner.push("targets:");
    for (const target of item.targets) inner.push(`  - ${target}`);
  }
  return buildSpecdojoFrontmatter(inner);
}

function registerCompletionConditions(item: PjrItem, ticketPath: string | null): string {
  if (ticketPath && existsSync(ticketPath)) {
    const content = readFileSync(ticketPath, "utf8");
    const body = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
    const lines = body.split(/\r?\n/);
    const heading = lines.findIndex((line) => /^##\s+(?:\d+\.\s*)?完了条件\s*$/.test(line));
    if (heading >= 0) {
      const endOffset = lines.slice(heading + 1).findIndex((line) => /^##\s+/.test(line));
      const end = endOffset >= 0 ? heading + 1 + endOffset : lines.length;
      const conditions = lines
        .slice(heading + 1, end)
        .join("\n")
        .trim();
      if (conditions) return conditions;
    }
  }
  return item.description && item.description !== "_TODO_"
    ? escapeMarkdownInline(item.description)
    : "- 個票に明示的な完了条件がないため、タイトルと概要を追加条件として扱う。";
}

function indexedDocumentPath(targetId: string): string {
  const repoRoot = specdojoRootDir();
  const indexed = collectDocIndexEntries(join(repoRoot, "docs"), repoRoot)[targetId];
  if (!indexed) {
    throw new Error(`Target document id is not resolvable via the document index: ${targetId}`);
  }
  const withoutLine = indexed.replace(/:\d+$/, "");
  return relative(repoRoot, resolve(repoRoot, withoutLine)).replace(/\\/g, "/");
}

export async function generateRegisterPlan(opts: {
  executionPath: string;
  projectId: string;
  catalogPath?: string;
  rolesPath?: string;
  viewpointsPath?: string;
  projectContext?: readonly string[];
  registerPaths: RegisterPaths;
  item: PjrItem;
  stem: string;
  outPath?: string;
}): Promise<{ planPath: string; category: RegisterTaskCategory }> {
  const { item } = opts;
  const category = requireRunnableRegisterItem(item);
  const ticketPath = ticketPathFromItem(item, opts.registerPaths.projectRegisterPath);

  if (item.approach) {
    const [targetId] = item.targets ?? [];
    if (!targetId || (item.targets?.length ?? 0) !== 1) {
      throw new Error(`Register item ${item.id} approach requires exactly one target document id.`);
    }
    const maintenanceKind = MAINTENANCE_TARGET_KIND[
      item.approach as keyof typeof MAINTENANCE_TARGET_KIND
    ] as keyof KataRefs | undefined;
    let deliverable: DeliverableInfo | null = null;
    let refs: KataRefs | undefined;
    if (maintenanceKind) {
      deliverable = opts.catalogPath
        ? findUniqueDeliverableForKataTarget(opts.catalogPath, targetId, maintenanceKind)
        : null;
      refs = deliverable
        ? resolveKataRefs(deliverable.deliverable.rulebook, deliverable.deliverable.kind)
        : { rulebook: MISSING, recipe: MISSING, sample: MISSING, template: MISSING };
      refs = { ...refs, [maintenanceKind]: indexedDocumentPath(targetId) };
    } else {
      if (!opts.catalogPath) {
        throw new Error(
          `Register item ${item.id} approach requires catalog_path to resolve ${targetId}.`,
        );
      }
      deliverable = resolveDeliverableByDocId(opts.catalogPath, opts.projectId, targetId).info;
    }

    const planPath = await generateRegisterApproachPlan({
      executionPath: opts.executionPath,
      projectId: opts.projectId,
      catalogPath: opts.catalogPath ?? "",
      ...(opts.rolesPath ? { rolesPath: opts.rolesPath } : {}),
      ...(opts.viewpointsPath ? { viewpointsPath: opts.viewpointsPath } : {}),
      ...(opts.projectContext ? { projectContext: opts.projectContext } : {}),
      taskId: item.id,
      title: item.title,
      description: item.description,
      ...(item.owner && item.owner !== "-" && item.owner !== "_TODO_" ? { owner: item.owner } : {}),
      approach: item.approach,
      targets: item.targets ?? [],
      deliverable,
      ...(refs ? { refs } : {}),
      additionalConditions: registerCompletionConditions(item, ticketPath),
      ...(opts.outPath ? { outPath: opts.outPath } : {}),
      stem: opts.stem,
    });
    return { planPath, category };
  }

  const templatePath = execTemplatePath(REGISTER_PLAN_TEMPLATES[category]);
  if (!existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }
  const template = readFileSync(templatePath, "utf8");

  const plansDir = join(opts.executionPath, "exec", "plans");
  mkdirSync(plansDir, { recursive: true });
  const planPath = opts.outPath ?? join(plansDir, `${opts.stem}-plan.md`);
  const resultRef = `${repoRelativePath(opts.executionPath)}/exec/results/${opts.stem}-result.md`;

  const values: Record<string, string> = {
    _FRONTMATTER_: registerPlanFrontmatter(opts.projectId, opts.stem, item),
    _PJR_ID_: item.id,
    // title / description は登録簿の自由記述列に由来し、山括弧プレースホルダや
    // アンダースコア入り識別子、`_TODO_` などを含みうる。plan 本文（H1・説明文）へ
    // そのまま埋め込むと HTML / 強調記号として誤解釈されるため、Markdown 用に保護する。
    _PJR_TITLE_: escapeMarkdownInline(item.title),
    _PJR_DESCRIPTION_:
      item.description && item.description !== "_TODO_"
        ? escapeMarkdownInline(item.description)
        : "-",
    _PJR_TYPE_: item.type,
    _PJR_PRIORITY_: item.priority,
    _PJR_OWNER_: item.owner,
    _PJR_DUE_: item.due,
    _PJR_TICKET_REF_: ticketPath ? `\`${repoRelativePath(ticketPath)}\`` : "-",
    _RESULT_REF_: resultRef,
    _GRADE_FINDINGS_: ticketPath ? registerGradeFindingsText(opts.projectId, ticketPath) : "- なし",
  };

  const body = expandTemplate(template, values);
  // register 項目は対象成果物の schema を特定できないため、schema 検査の項目は落とす。
  const content = injectCommonConventions(body, MISSING, new Map<string, string>());

  writeFileSync(planPath, content, "utf8");
  await formatMarkdownFile(planPath);
  return { planPath, category };
}
