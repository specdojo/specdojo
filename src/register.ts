import { type Command } from "commander";
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import fg from "fast-glob";
import { getProjectRegisterPath, loadConfig, loadEnv, specdojoRootDir } from "./specdojo-config.js";
import { flattenTemplateFrontmatter } from "./template-frontmatter.js";
import { parseSpecdojoDocument } from "./frontmatter-namespace.js";
import { gitOutput, gitResult, listRegisteredWorktrees } from "./exec-worktree.js";

// ================================
// Types
// ================================

export type RegisterPaths = {
  projectId: string;
  projectRegisterPath: string;
  pjrIndexPath: string;
  generatedPath: string;
  controlsGeneratedPath: string;
};

export type PjrItem = {
  id: string;
  status: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  owner: string;
  due: string;
  completed: string;
  conclusion: string;
  ticket: string;
};

// ================================
// Constants
// ================================

export const VALID_STATUSES = [
  "open",
  "in-progress",
  "waiting",
  "review",
  "decided",
  "done",
  "deferred",
  "rejected",
] as const;

export const VALID_TYPES = [
  "todo",
  "question",
  "risk",
  "issue",
  "change-request",
  "decision",
  "note",
] as const;

export const VALID_PRIORITIES = ["high", "medium", "low"] as const;

// 個票 Frontmatter の文書成熟度（specdojo:pjr-rulebook「個票 status の遷移基準」）。
// pjr-index の処理状態（VALID_STATUSES）とは別の状態軸として扱う。
export const VALID_TICKET_STATUSES = ["draft", "ready", "deprecated"] as const;
export type TicketStatus = (typeof VALID_TICKET_STATUSES)[number];

// 登録項目一覧テーブルは specdojo:pjr-rulebook「本文構成」で章 1 に固定される。
// 見出し文言（言語依存）ではなく章番号でセクションを特定し、i18n 非依存にする。
const REGISTER_SECTION_RE = /^## 1\.\s/;

// ================================
// Path Resolution
// ================================

export function resolveRegisterPaths(opts: { project?: string }): RegisterPaths {
  loadEnv();
  const { config, configPath } = loadConfig();
  const baseDir = specdojoRootDir();

  const projectId =
    opts.project?.trim() ||
    process.env.SPECDOJO_PROJECT?.trim() ||
    (config ? Object.keys(config.projects)[0] : "");

  if (!config) {
    throw new Error(`register commands require specdojo.config.json.\nRun: specdojo config init`);
  }
  if (!projectId) {
    throw new Error(`No project specified. Use --project <id> or SPECDOJO_PROJECT.`);
  }

  const project = config.projects[projectId];
  if (!project) {
    throw new Error(`Unknown project: ${projectId} (check ${configPath})`);
  }

  const registerPath = getProjectRegisterPath(project);
  if (!registerPath) {
    throw new Error(
      `project_register_path not set for project '${projectId}' in ${configPath}.\n` +
        `Add "project_register_path": "<path>" to the project config.`,
    );
  }

  const absRegisterPath = resolve(baseDir, registerPath);
  return {
    projectId,
    projectRegisterPath: absRegisterPath,
    pjrIndexPath: join(absRegisterPath, "pjr-index.md"),
    generatedPath: join(absRegisterPath, "generated"),
    controlsGeneratedPath: join(dirname(absRegisterPath), "generated"),
  };
}

// ================================
// Markdown Table Parsing
// ================================

function parseTableCells(line: string): string[] {
  // Replace escaped pipes with placeholder before splitting
  const PIPE = "\x01";
  const normalized = line.replace(/\\\|/g, PIPE);
  const cells = normalized.split("|").map((c) => c.replace(new RegExp(PIPE, "g"), "\\|").trim());
  // Remove first and last empty elements (line starts and ends with |)
  return cells.slice(1, cells.length - 1);
}

function isTableSeparator(line: string): boolean {
  return line.startsWith("|") && /\|\s*---+\s*\|/.test(line);
}

// 生成ビューが使うテーブルの見出し行と区切り行。
// 定数として持たず pjr-index.md（テンプレート由来）から採用し、列名の言語に依存しない。
export type TableHeading = { header: string; separator: string };

export function extractTableHeading(content: string): TableHeading {
  const lines = content.split("\n");
  let inSection = false;
  let header: string | undefined;

  for (const line of lines) {
    if (REGISTER_SECTION_RE.test(line)) {
      inSection = true;
      continue;
    }
    if (inSection && /^## /.test(line)) break;
    if (!inSection || !line.startsWith("|")) continue;

    if (isTableSeparator(line)) {
      if (header === undefined) {
        throw new Error("Register table header row not found before the separator in pjr-index.md");
      }
      return { header: header.trim(), separator: line.trim() };
    }
    if (header === undefined) header = line;
  }

  throw new Error("Register table header row not found in pjr-index.md");
}

export function parsePjrIndex(content: string): PjrItem[] {
  const lines = content.split("\n");
  const items: PjrItem[] = [];
  let inSection = false;

  for (const line of lines) {
    if (REGISTER_SECTION_RE.test(line)) {
      inSection = true;
      continue;
    }
    if (inSection && /^## /.test(line)) break;
    if (!inSection) continue;
    if (!line.startsWith("|") || isTableSeparator(line)) continue;

    const cells = parseTableCells(line);
    if (cells.length < 11) continue;
    if (!/^PJR-\d{4}$/.test(cells[0])) continue;

    items.push({
      id: cells[0],
      status: cells[1],
      title: cells[2],
      description: cells[3],
      type: cells[4],
      priority: cells[5],
      owner: cells[6],
      due: cells[7],
      completed: cells[8],
      conclusion: cells[9],
      ticket: cells[10],
    });
  }

  return items;
}

function getNextPjrId(items: PjrItem[]): string {
  const maxNum = items.reduce((max, item) => {
    const m = item.id.match(/^PJR-(\d{4})$/);
    return m ? Math.max(max, parseInt(m[1], 10)) : max;
  }, 0);
  return `PJR-${String(maxNum + 1).padStart(4, "0")}`;
}

function formatTableRow(item: PjrItem): string {
  return `| ${item.id} | ${item.status} | ${item.title} | ${item.description} | ${item.type} | ${item.priority} | ${item.owner} | ${item.due} | ${item.completed} | ${item.conclusion} | ${item.ticket} |`;
}

function insertRowAfterLast(content: string, newRow: string): string {
  const lines = content.split("\n");
  let inSection = false;
  let lastRowIndex = -1;
  let separatorIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (REGISTER_SECTION_RE.test(line)) {
      inSection = true;
      continue;
    }
    if (inSection && /^## /.test(line)) break;
    if (!inSection) continue;

    if (isTableSeparator(line)) {
      separatorIndex = i;
      continue;
    }

    if (line.startsWith("|")) {
      const cells = parseTableCells(line);
      if (cells.length >= 1 && /^PJR-\d{4}$/.test(cells[0])) {
        lastRowIndex = i;
      }
    }
  }

  const insertAfter = lastRowIndex !== -1 ? lastRowIndex : separatorIndex;
  if (insertAfter === -1) {
    throw new Error("Could not find table structure in pjr-index.md");
  }

  lines.splice(insertAfter + 1, 0, newRow);
  return lines.join("\n");
}

// ================================
// Validation
// ================================

function validateFields(opts: {
  status: string;
  type: string;
  priority: string;
  due: string;
  completed: string;
  id?: string;
}): void {
  const errors: string[] = [];

  if (!(VALID_STATUSES as readonly string[]).includes(opts.status)) {
    errors.push(`Invalid status: "${opts.status}". Must be one of: ${VALID_STATUSES.join(", ")}`);
  }
  if (!(VALID_TYPES as readonly string[]).includes(opts.type)) {
    errors.push(`Invalid type: "${opts.type}". Must be one of: ${VALID_TYPES.join(", ")}`);
  }
  if (!(VALID_PRIORITIES as readonly string[]).includes(opts.priority)) {
    errors.push(
      `Invalid priority: "${opts.priority}". Must be one of: ${VALID_PRIORITIES.join(", ")}`,
    );
  }
  if (opts.id && !/^PJR-\d{4}$/.test(opts.id)) {
    errors.push(`Invalid ID: "${opts.id}". Must match PJR-XXXX (e.g., PJR-0001)`);
  }
  if (!/^(\d{4}-\d{2}-\d{2}|-|_TODO_)$/.test(opts.due)) {
    errors.push(`Invalid due: "${opts.due}". Must be YYYY-MM-DD, -, or _TODO_`);
  }
  if (!/^(\d{4}-\d{2}-\d{2}|-)$/.test(opts.completed)) {
    errors.push(`Invalid completed: "${opts.completed}". Must be YYYY-MM-DD or -`);
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
}

// ================================
// Slug
// ================================

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .trim()
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "item"
  );
}

// ================================
// Ticket Generation
// ================================

function getTitlePlaceholder(type: string): string {
  return `_${type.toUpperCase().replace(/-/g, "_")}_TITLE_`;
}

function generateTicket(opts: {
  projectId: string;
  displayId: string;
  topic: string;
  type: string;
  title: string;
  templatePath: string;
}): string {
  if (!existsSync(opts.templatePath)) {
    throw new Error(`Template not found: ${opts.templatePath}`);
  }

  let content = readFileSync(opts.templatePath, "utf8");
  content = flattenTemplateFrontmatter(content);
  const pjrLower = opts.displayId.toLowerCase();

  // Keep the canonical document ID aligned with the ticket filename.
  content = content.replace(/_PJR_DOCUMENT_ID_/g, `${opts.projectId}:${pjrLower}-${opts.topic}`);
  // Replace remaining project id placeholder
  content = content.replace(/_PROJECT_ID_/g, opts.projectId);
  // Replace display id placeholder with uppercase
  content = content.replace(/_PJR-XXXX_/g, opts.displayId);
  // Replace type-specific title placeholder
  const titlePh = getTitlePlaceholder(opts.type);
  content = content.replace(
    new RegExp(titlePh.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
    opts.title,
  );

  return content;
}

// ================================
// Derived View Generation
// ================================

function adjustTicketLink(ticket: string, prefix: string): string {
  if (ticket === "-") return ticket;
  return ticket.replace(/\]\(\.\//g, `](${prefix}`);
}

function rebaseItems(items: PjrItem[], prefix: string): PjrItem[] {
  return items.map((it) => ({ ...it, ticket: adjustTicketLink(it.ticket, prefix) }));
}

function makeTable(items: PjrItem[], heading: TableHeading): string {
  const rows = items.map(formatTableRow);
  return [heading.header, heading.separator, ...rows].join("\n");
}

type ViewGroup = { label: string; items: PjrItem[] };

// 派生ビューの外枠（H1・note・章見出し・frontmatter）は template が所有する。
// template をロードして生成物形へ平坦化し、`_PROJECT_ID_` を実プロジェクト ID へ置換する。
function loadViewTemplate(templateFileName: string, projectId: string): string {
  const templatePath = join(specdojoRootDir(), "docs/ja/specdojo/templates", templateFileName);
  if (!existsSync(templatePath)) {
    throw new Error(`View template not found: ${templatePath}`);
  }
  const raw = readFileSync(templatePath, "utf8");
  return flattenTemplateFrontmatter(raw).replace(/_PROJECT_ID_/g, projectId);
}

// template 本文中の `<!-- specdojo:view-slot=<key> -->` 行を生成テーブルへ置換する。
// slot と提供テーブルは相互に過不足がないことを検証し、template の不整合を早期に検出する。
export function injectViewSlots(content: string, slots: Record<string, string>): string {
  const used = new Set<string>();
  const injected = content.replace(
    /^<!-- specdojo:view-slot=([a-z-]+) -->$/gm,
    (_match, key: string) => {
      if (!(key in slots)) {
        throw new Error(`Unknown view-slot in template: ${key}`);
      }
      used.add(key);
      return slots[key];
    },
  );
  const missing = Object.keys(slots).filter((key) => !used.has(key));
  if (missing.length > 0) {
    throw new Error(`View-slot not found in template: ${missing.join(", ")}`);
  }
  return injected;
}

// グループ（状態別・優先度別・担当者別など）を `### <chapter>.<n>. <label>` 見出し付きの
// テーブル群へ整形する。章見出しラベルは template 側が持つため、ここでは番号と値のみ扱う。
function renderGroupedTables(groups: ViewGroup[], chapter: number, heading: TableHeading): string {
  return groups
    .map((group, index) =>
      [
        `### ${chapter}.${index + 1}. ${group.label}`,
        "",
        "<!-- prettier-ignore -->",
        makeTable(group.items, heading),
      ].join("\n"),
    )
    .join("\n\n");
}

function groupByOwner(items: PjrItem[]): ViewGroup[] {
  const grouped = new Map<string, PjrItem[]>();
  for (const item of items) {
    const key = item.owner || "-";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(item);
  }
  return [...grouped.keys()].sort().map((owner) => ({ label: owner, items: grouped.get(owner)! }));
}

function generateViewsFile(items: PjrItem[], projectId: string, heading: TableHeading): string {
  const statusGroups = VALID_STATUSES.map((status) => ({
    label: status,
    items: items.filter((it) => it.status === status),
  })).filter((group) => group.items.length > 0);

  const priorityGroups = VALID_PRIORITIES.map((priority) => ({
    label: priority,
    items: items.filter((it) => it.priority === priority),
  }));

  const template = loadViewTemplate("pjr-views-template.md", projectId);
  return injectViewSlots(template, {
    "by-status": renderGroupedTables(statusGroups, 1, heading),
    "by-priority": renderGroupedTables(priorityGroups, 2, heading),
    "by-owner": renderGroupedTables(groupByOwner(items), 3, heading),
  });
}

function generateTypeFilterView(
  items: PjrItem[],
  type: string,
  templateFileName: string,
  projectId: string,
  heading: TableHeading,
): string {
  const filtered = items.filter((it) => it.type === type);
  const template = loadViewTemplate(templateFileName, projectId);
  return injectViewSlots(template, {
    table: ["<!-- prettier-ignore -->", makeTable(filtered, heading)].join("\n"),
  });
}
type BuildScope = "register" | "controls" | "all";
type ViewFile = { path: string; content: string };

const VALID_BUILD_SCOPES: BuildScope[] = ["register", "controls", "all"];

function generateDerivedViewFiles(paths: RegisterPaths, scope: BuildScope): ViewFile[] {
  const content = readFileSync(paths.pjrIndexPath, "utf8");
  const items = parsePjrIndex(content);
  const heading = extractTableHeading(content);

  // Ticket links in pjr-index.md use ./ relative to project-register/.
  // Rebase them so links remain valid from each generated/ directory.
  const pjrDirName = basename(paths.projectRegisterPath);
  const regItems = rebaseItems(items, "../");
  const ctrlItems = rebaseItems(items, `../${pjrDirName}/`);

  const registerViews: ViewFile[] = [];
  const controlsViews: ViewFile[] = [];

  if (scope === "register" || scope === "all") {
    registerViews.push({
      path: join(paths.generatedPath, "pjr-views.md"),
      content: generateViewsFile(regItems, paths.projectId, heading),
    });
  }

  if (scope === "controls" || scope === "all") {
    controlsViews.push(
      {
        path: join(paths.controlsGeneratedPath, "pm-risk-register.md"),
        content: generateTypeFilterView(
          ctrlItems,
          "risk",
          "pm-risk-register-template.md",
          paths.projectId,
          heading,
        ),
      },
      {
        path: join(paths.controlsGeneratedPath, "pm-issue-log.md"),
        content: generateTypeFilterView(
          ctrlItems,
          "issue",
          "pm-issue-log-template.md",
          paths.projectId,
          heading,
        ),
      },
      {
        path: join(paths.controlsGeneratedPath, "pm-change-request-log.md"),
        content: generateTypeFilterView(
          ctrlItems,
          "change-request",
          "pm-change-request-log-template.md",
          paths.projectId,
          heading,
        ),
      },
      {
        path: join(paths.controlsGeneratedPath, "pm-decision-log.md"),
        content: generateTypeFilterView(
          ctrlItems,
          "decision",
          "pm-decision-log-template.md",
          paths.projectId,
          heading,
        ),
      },
    );
  }

  return [...registerViews, ...controlsViews];
}

function writeDerivedViews(paths: RegisterPaths, scope: BuildScope): ViewFile[] {
  const views = generateDerivedViewFiles(paths, scope);
  const hasRegisterViews = views.some((view) => dirname(view.path) === paths.generatedPath);
  const hasControlsViews = views.some((view) => dirname(view.path) === paths.controlsGeneratedPath);

  if (hasRegisterViews) {
    mkdirSync(paths.generatedPath, { recursive: true });
  }
  if (hasControlsViews) {
    mkdirSync(paths.controlsGeneratedPath, { recursive: true });
  }

  for (const view of views) {
    writeFileSync(view.path, view.content, "utf8");
  }

  return views;
}

// ================================
// Item Update Helpers
// ================================

export const TERMINAL_STATUSES_SET = new Set(["done", "decided", "rejected", "deferred"]);

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function findItemById(items: PjrItem[], id: string): PjrItem | undefined {
  return items.find((it) => it.id === id);
}

function replaceRowInContent(content: string, updated: PjrItem): string {
  const newRow = formatTableRow(updated);
  const lines = content.split("\n");
  let inSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (REGISTER_SECTION_RE.test(line)) {
      inSection = true;
      continue;
    }
    if (inSection && /^## /.test(line)) break;
    if (!inSection) continue;
    if (!line.startsWith("|") || isTableSeparator(line)) continue;

    const cells = parseTableCells(line);
    if (cells.length >= 1 && cells[0] === updated.id) {
      lines[i] = newRow;
      return lines.join("\n");
    }
  }

  throw new Error(`Item ${updated.id} not found in table`);
}

function loadItemForUpdate(
  paths: RegisterPaths,
  id: string,
  guard?: "require-active" | "require-terminal",
): { content: string; item: PjrItem } {
  if (!existsSync(paths.pjrIndexPath)) {
    throw new Error(`pjr-index.md not found: ${paths.pjrIndexPath}`);
  }
  if (!/^PJR-\d{4}$/.test(id)) {
    throw new Error(`Invalid ID: "${id}". Must match PJR-XXXX (e.g., PJR-0001)`);
  }
  const content = readFileSync(paths.pjrIndexPath, "utf8");
  const items = parsePjrIndex(content);
  const item = findItemById(items, id);
  if (!item) {
    throw new Error(`Item not found: ${id}`);
  }
  if (guard === "require-active" && TERMINAL_STATUSES_SET.has(item.status)) {
    throw new Error(
      `Cannot change ${id}: status is "${item.status}" (terminal). Use "register reopen" first.`,
    );
  }
  if (guard === "require-terminal" && !TERMINAL_STATUSES_SET.has(item.status)) {
    throw new Error(`Cannot reopen ${id}: status is "${item.status}" (already active).`);
  }
  return { content, item };
}

function applyItemUpdate(opts: {
  paths: RegisterPaths;
  content: string;
  updated: PjrItem;
  dryRun: boolean;
  action?: string;
}): void {
  const label = opts.action ?? `→ ${opts.updated.status}`;
  if (opts.dryRun) {
    process.stdout.write(
      `Would update ${opts.updated.id} (${label}):\n${formatTableRow(opts.updated)}\n`,
    );
    return;
  }
  const updatedContent = replaceRowInContent(opts.content, opts.updated);
  writeFileSync(opts.paths.pjrIndexPath, updatedContent, "utf8");
  process.stdout.write(`Updated: ${opts.paths.pjrIndexPath} (${opts.updated.id} ${label})\n`);
  for (const view of writeDerivedViews(opts.paths, "all")) {
    process.stdout.write(`Generated: ${view.path}\n`);
  }
}

// ================================
// Ticket Frontmatter Status
// ================================

const FRONTMATTER_BLOCK_RE = /^---\r?\n([\s\S]*?)\r?\n---/;

// pjr-index の「個票」セル（例: `[pjr-0001-topic](./pjr-0001-topic.md)`）から
// project-register ディレクトリ相対のファイル名を取り出す。個票なし（`-`）は undefined。
export function parseTicketFilename(ticketCell: string): string | undefined {
  if (ticketCell === "-" || ticketCell.trim() === "") return undefined;
  const match = ticketCell.match(/\]\(\.\/([^)]+\.md)\)/);
  return match ? match[1] : undefined;
}

// type 固有の必須節が固まっているかの判定。見出し文言（言語依存）に依存せず、
// 本文に記入プレースホルダ `_TODO_` が残っていれば「未確定」とみなす。
function ticketBodyHasTodo(content: string): boolean {
  const { body } = parseSpecdojoDocument(content);
  return body.includes("_TODO_");
}

// 個票 Frontmatter（specdojo 名前空間）内の `status:` 行を targetStatus へ書き換える。
// 既に目的の値なら changed=false を返し、内容を変えない（冪等）。
export function updateTicketFrontmatterStatus(
  content: string,
  targetStatus: TicketStatus,
): { content: string; changed: boolean } {
  const block = content.match(FRONTMATTER_BLOCK_RE);
  if (!block) {
    throw new Error("frontmatter not found in ticket file");
  }
  const statusLineRe = /^(\s*status:[ \t]*)(\S+)(.*)$/m;
  const statusLine = block[1].match(statusLineRe);
  if (!statusLine) {
    throw new Error("status field not found in ticket frontmatter");
  }
  if (statusLine[2] === targetStatus) {
    return { content, changed: false };
  }
  const newFrontmatter = block[1].replace(
    statusLineRe,
    (_m, prefix: string, _old: string, suffix: string) => `${prefix}${targetStatus}${suffix}`,
  );
  const newContent = content.replace(block[1], () => newFrontmatter);
  return { content: newContent, changed: true };
}

// close / reject に伴い、対象個票の Frontmatter `status` を昇格・廃止する。
// - 個票なし（個票列が `-`）や個票ファイル不在は、エラーにせず処理状態のみで完了する。
// - `ready` への昇格は必須節に `_TODO_` が残っていないことを条件とし、残る場合は警告して据え置く。
export function updateTicketStatusForItem(opts: {
  paths: RegisterPaths;
  item: PjrItem;
  targetStatus: TicketStatus;
  dryRun: boolean;
}): void {
  const filename = parseTicketFilename(opts.item.ticket);
  if (!filename) return;

  const ticketPath = join(opts.paths.projectRegisterPath, filename);
  if (!existsSync(ticketPath)) {
    process.stdout.write(
      `Warning: ticket file not found; skipped status update for ${opts.item.id}: ${ticketPath}\n`,
    );
    return;
  }

  const content = readFileSync(ticketPath, "utf8");

  if (opts.targetStatus === "ready" && ticketBodyHasTodo(content)) {
    process.stdout.write(
      `Warning: ${opts.item.id} ticket has unresolved _TODO_; kept as draft (not promoted to ready): ${ticketPath}\n`,
    );
    return;
  }

  const { content: updated, changed } = updateTicketFrontmatterStatus(content, opts.targetStatus);
  if (!changed) {
    if (opts.dryRun) {
      process.stdout.write(`Ticket already ${opts.targetStatus}: ${ticketPath}\n`);
    }
    return;
  }

  if (opts.dryRun) {
    process.stdout.write(`Would update ticket status → ${opts.targetStatus}: ${ticketPath}\n`);
    return;
  }

  writeFileSync(ticketPath, updated, "utf8");
  process.stdout.write(`Updated ticket status → ${opts.targetStatus}: ${ticketPath}\n`);
}

// ================================
// Renumber (duplicate ID recovery)
// ================================

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// 個票ファイル名 `pjr-XXXX-<topic>.md` から topic を取り出す。
// ID 接頭辞（`pjr-xxxx-`）と一致しない場合は undefined。
export function ticketTopicFromFilename(id: string, filename: string): string | undefined {
  const prefix = `${id.toLowerCase()}-`;
  const base = filename.replace(/\.md$/, "");
  if (!base.startsWith(prefix)) return undefined;
  const topic = base.slice(prefix.length);
  return topic.length > 0 ? topic : undefined;
}

// pjr-index の登録項目一覧テーブルで fromId の行を updated へ差し替える。
// replaceRowInContent は「同一 ID を書き戻す」用途で updated.id と一致する行を探すため、
// ID を変える再採番には fromId で行を特定する専用処理を使う。
function renumberRowInContent(content: string, fromId: string, updated: PjrItem): string {
  const newRow = formatTableRow(updated);
  const lines = content.split("\n");
  let inSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (REGISTER_SECTION_RE.test(line)) {
      inSection = true;
      continue;
    }
    if (inSection && /^## /.test(line)) break;
    if (!inSection) continue;
    if (!line.startsWith("|") || isTableSeparator(line)) continue;

    const cells = parseTableCells(line);
    if (cells.length >= 1 && cells[0] === fromId) {
      lines[i] = newRow;
      return lines.join("\n");
    }
  }

  throw new Error(`Item ${fromId} not found in table`);
}

// 個票本文の再採番。frontmatter の doc id 断片（`:pjr-XXXX-<topic>`）と
// H1 の表示 ID（`# PJR-XXXX ...`）を新しい ID へ更新する。
export function renumberTicketContent(
  content: string,
  fromId: string,
  toId: string,
  topic: string,
): string {
  const fromFragment = `:${fromId.toLowerCase()}-${topic}`;
  const toFragment = `:${toId.toLowerCase()}-${topic}`;
  let updated = content.split(fromFragment).join(toFragment);
  updated = updated.replace(
    new RegExp(`^(#\\s+)${escapeRegExp(fromId)}(\\s|$)`, "m"),
    (_m, prefix: string, tail: string) => `${prefix}${toId}${tail}`,
  );
  return updated;
}

// 他文書からの参照リンク（wikilink `[[<docId>|...]]`）と
// exec plan / result の `targets` に含まれる doc id を新しい doc id へ置き換える。
export function renumberReferences(
  content: string,
  fromDocId: string,
  toDocId: string,
): { content: string; changed: boolean } {
  if (!content.includes(fromDocId)) return { content, changed: false };
  return { content: content.split(fromDocId).join(toDocId), changed: true };
}

export type RenumberPlan = {
  writes: { path: string; content: string }[];
  ticketRename?: { from: string; to: string };
};

// 再採番で書き換える全ファイルを事前に算出する。
// 途中で衝突・不整合を検出したら例外を投げ、部分適用が起きないようにする。
export function planRenumber(paths: RegisterPaths, fromId: string, toId: string): RenumberPlan {
  const indexContent = readFileSync(paths.pjrIndexPath, "utf8");
  const items = parsePjrIndex(indexContent);

  const fromItem = findItemById(items, fromId);
  if (!fromItem) {
    throw new Error(`Item not found: ${fromId}`);
  }
  if (findItemById(items, toId)) {
    throw new Error(`Target ID already exists in pjr-index.md: ${toId}`);
  }

  const writes: RenumberPlan["writes"] = [];
  let ticketRename: RenumberPlan["ticketRename"];
  let newIndexContent = indexContent;

  const oldFilename = parseTicketFilename(fromItem.ticket);
  let fromDocId: string | undefined;
  let toDocId: string | undefined;

  if (oldFilename) {
    const topic = ticketTopicFromFilename(fromId, oldFilename);
    if (!topic) {
      throw new Error(
        `Ticket filename "${oldFilename}" does not match ID "${fromId}"; ` +
          `fix the ticket link before renumbering.`,
      );
    }
    const newFilename = `${toId.toLowerCase()}-${topic}.md`;
    const oldTicketPath = join(paths.projectRegisterPath, oldFilename);
    const newTicketPath = join(paths.projectRegisterPath, newFilename);
    if (!existsSync(oldTicketPath)) {
      throw new Error(`Ticket file not found: ${oldTicketPath}`);
    }
    if (existsSync(newTicketPath)) {
      throw new Error(`Target ticket file already exists: ${newTicketPath}`);
    }

    fromDocId = `${paths.projectId}:${oldFilename.replace(/\.md$/, "")}`;
    toDocId = `${paths.projectId}:${newFilename.replace(/\.md$/, "")}`;

    const ticketContent = readFileSync(oldTicketPath, "utf8");
    writes.push({
      path: newTicketPath,
      content: renumberTicketContent(ticketContent, fromId, toId, topic),
    });
    ticketRename = { from: oldTicketPath, to: newTicketPath };

    const newTicketRef = `[${newFilename.replace(/\.md$/, "")}](./${newFilename})`;
    const updated: PjrItem = { ...fromItem, id: toId, ticket: newTicketRef };
    newIndexContent = renumberRowInContent(newIndexContent, fromId, updated);
  } else {
    const updated: PjrItem = { ...fromItem, id: toId };
    newIndexContent = renumberRowInContent(newIndexContent, fromId, updated);
  }

  writes.push({ path: paths.pjrIndexPath, content: newIndexContent });

  // 参照リンク・targets の付け替え（doc id を持つ個票がある場合のみ）。
  if (fromDocId && toDocId) {
    const root = specdojoRootDir();
    const referenceFiles = fg
      .sync("docs/ja/**/*.md", { cwd: root, absolute: true, ignore: ["**/generated/**"] })
      .sort((a, b) => a.localeCompare(b));

    for (const absPath of referenceFiles) {
      if (absPath === paths.pjrIndexPath) continue;
      if (ticketRename && absPath === ticketRename.from) continue;
      const content = readFileSync(absPath, "utf8");
      const { content: replaced, changed } = renumberReferences(content, fromDocId, toDocId);
      if (changed) writes.push({ path: absPath, content: replaced });
    }
  }

  return { writes, ticketRename };
}

export function renumberPjrItem(opts: {
  paths: RegisterPaths;
  fromId: string;
  toId: string;
  dryRun: boolean;
}): void {
  const { paths, fromId, toId, dryRun } = opts;

  if (!existsSync(paths.pjrIndexPath)) {
    throw new Error(`pjr-index.md not found: ${paths.pjrIndexPath}`);
  }
  for (const id of [fromId, toId]) {
    if (!/^PJR-\d{4}$/.test(id)) {
      throw new Error(`Invalid ID: "${id}". Must match PJR-XXXX (e.g., PJR-0001)`);
    }
  }
  if (fromId === toId) {
    throw new Error(`--id and --to must differ (both are ${fromId})`);
  }

  const plan = planRenumber(paths, fromId, toId);

  if (dryRun) {
    process.stdout.write(`Would renumber ${fromId} → ${toId}:\n`);
    if (plan.ticketRename) {
      process.stdout.write(`  Rename: ${plan.ticketRename.from} → ${plan.ticketRename.to}\n`);
    }
    for (const write of plan.writes) {
      process.stdout.write(`  Update: ${write.path}\n`);
    }
    return;
  }

  for (const write of plan.writes) {
    writeFileSync(write.path, write.content, "utf8");
    process.stdout.write(`Updated: ${write.path}\n`);
  }
  if (plan.ticketRename) {
    unlinkSync(plan.ticketRename.from);
    process.stdout.write(`Renamed: ${plan.ticketRename.from} → ${plan.ticketRename.to}\n`);
  }
  for (const view of writeDerivedViews(paths, "all")) {
    process.stdout.write(`Generated: ${view.path}\n`);
  }
}

// ================================
// Reserve (delegate row to integration branch worktree)
// ================================

// register add で登録行に書き込む項目値。個票は作らないため ticket セルは常に `-`。
export type ReservationFields = {
  type: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  owner: string;
  due: string;
  completed: string;
  conclusion: string;
};

export type IntegrationWorktree = { path: string; branch: string };

// pjr-index の現在内容から、予約する登録行と割り当て ID を算出する純粋関数。
// I/O を持たず、フィールド検証と ID 衝突検知だけを行う。ID を省略すると最大値 +1 で採番する。
export function planReservationRow(opts: {
  content: string;
  explicitId?: string;
  fields: ReservationFields;
  // 個票を作る場合の topic slug。指定すると ticket セルに個票リンクを埋め、個票ファイル名を返す。
  ticketTopic?: string;
}): { assignedId: string; newContent: string; newRow: string; ticketFilename?: string } {
  const items = parsePjrIndex(opts.content);
  const assignedId = opts.explicitId?.trim() || getNextPjrId(items);

  validateFields({
    status: opts.fields.status,
    type: opts.fields.type,
    priority: opts.fields.priority,
    due: opts.fields.due,
    completed: opts.fields.completed,
    id: assignedId,
  });

  if (items.some((it) => it.id === assignedId)) {
    throw new Error(`ID already exists in pjr-index.md: ${assignedId}`);
  }

  const ticketFilename = opts.ticketTopic
    ? `${assignedId.toLowerCase()}-${opts.ticketTopic}.md`
    : undefined;
  const ticketRef = ticketFilename
    ? `[${ticketFilename.replace(/\.md$/, "")}](./${ticketFilename})`
    : "-";

  const newItem: PjrItem = {
    id: assignedId,
    status: opts.fields.status,
    title: opts.fields.title,
    description: opts.fields.description,
    type: opts.fields.type,
    priority: opts.fields.priority,
    owner: opts.fields.owner,
    due: opts.fields.due,
    completed: opts.fields.completed,
    conclusion: opts.fields.conclusion,
    ticket: ticketRef,
  };
  const newRow = formatTableRow(newItem);
  return {
    assignedId,
    newContent: insertRowAfterLast(opts.content, newRow),
    newRow,
    ticketFilename,
  };
}

// pjr-index.md を所有する統合ブランチの worktree を解決する。
// 明示パス（--integration-worktree）が指定された場合はそれを、無ければ branch 名に一致する
// 登録済み worktree を採用する。予約できない状態（未登録・不在）は書き込み前にエラーにする。
export function resolveIntegrationWorktree(
  repoRoot: string,
  opts: { branch: string; worktreePath?: string },
): IntegrationWorktree {
  const registered = listRegisteredWorktrees(repoRoot);

  if (opts.worktreePath) {
    const abs = resolve(opts.worktreePath);
    const match = registered.find((item) => resolve(item.path) === abs);
    if (!match) {
      throw new Error(`Integration worktree is not a registered git worktree: ${abs}`);
    }
    if (!existsSync(abs)) {
      throw new Error(`Integration worktree path does not exist: ${abs}`);
    }
    return { path: abs, branch: match.branch ?? opts.branch };
  }

  const match = registered.find((item) => item.branch === opts.branch);
  if (!match) {
    throw new Error(
      `No worktree is checked out on integration branch "${opts.branch}". ` +
        `Add one with "git worktree add" or pass --integration-worktree <path>.`,
    );
  }
  if (!existsSync(match.path)) {
    throw new Error(`Integration worktree path does not exist: ${match.path}`);
  }
  return { path: resolve(match.path), branch: opts.branch };
}

// 統合ブランチの worktree へ登録行（と任意で個票）を追記・commit して PJR-ID を予約する。
// - pjr-index.md 不在・未 commit の変更あり・ID 競合・個票の既存衝突は、書き込み前にエラーで終了する。
// - commit は登録行（と個票）の pathspec に限定し、統合ブランチ側の他の変更を巻き込まない。
// - ticket を渡すと、確定した ID に基づく個票内容を makeContent で生成し、同一 commit に含める。
export function reservePjrIdOnIntegration(opts: {
  worktreePath: string;
  pjrIndexRel: string;
  explicitId?: string;
  fields: ReservationFields;
  commitMessage?: string;
  dryRun: boolean;
  ticket?: { topic: string; makeContent: (assignedId: string) => string };
}): { assignedId: string } {
  const pjrIndexPath = resolve(opts.worktreePath, opts.pjrIndexRel);
  if (!existsSync(pjrIndexPath)) {
    throw new Error(`pjr-index.md not found in integration worktree: ${pjrIndexPath}`);
  }

  // commit 対象の pjr-index.md に未 commit の変更があると、予約 commit が既存の変更を
  // 巻き込む。予約 commit を登録行の追加だけに限定するため、書き込み前に清潔さを確認する。
  const status = gitResult(opts.worktreePath, ["status", "--porcelain=v1", "--", opts.pjrIndexRel]);
  if (status.status !== 0) {
    const stderr = typeof status.stderr === "string" ? status.stderr.trim() : "";
    throw new Error(`Failed to inspect integration worktree status${stderr ? `: ${stderr}` : ""}`);
  }
  if (typeof status.stdout === "string" && status.stdout.trim().length > 0) {
    throw new Error(
      `Integration worktree has uncommitted changes to ${opts.pjrIndexRel}; ` +
        `commit or discard them before reserving.`,
    );
  }

  const content = readFileSync(pjrIndexPath, "utf8");
  const { assignedId, newContent, ticketFilename } = planReservationRow({
    content,
    explicitId: opts.explicitId,
    fields: opts.fields,
    ticketTopic: opts.ticket?.topic,
  });

  // 個票の repo 相対パスは pjr-index.md と同じディレクトリに置く。
  const ticketRel =
    ticketFilename !== undefined
      ? [...opts.pjrIndexRel.split("/").slice(0, -1), ticketFilename].join("/")
      : undefined;
  const ticketAbs = ticketRel ? resolve(opts.worktreePath, ticketRel) : undefined;
  if (ticketAbs && existsSync(ticketAbs)) {
    throw new Error(`Target ticket file already exists in integration worktree: ${ticketAbs}`);
  }

  if (opts.dryRun) {
    process.stdout.write(`Would reserve ${assignedId} in ${pjrIndexPath}\n`);
    if (ticketAbs) process.stdout.write(`Would create ticket: ${ticketAbs}\n`);
    process.stdout.write(`${assignedId}\n`);
    return { assignedId };
  }

  writeFileSync(pjrIndexPath, newContent, "utf8");
  const commitPaths = [opts.pjrIndexRel];
  if (ticketAbs && ticketRel && opts.ticket) {
    writeFileSync(ticketAbs, opts.ticket.makeContent(assignedId), "utf8");
    commitPaths.push(ticketRel);
  }
  gitOutput(opts.worktreePath, ["add", "--", ...commitPaths]);
  gitOutput(opts.worktreePath, [
    "commit",
    "-m",
    opts.commitMessage?.trim() || `register(reserve): add ${assignedId}`,
    "--",
    ...commitPaths,
  ]);

  process.stdout.write(`Reserved ${assignedId} on integration worktree: ${pjrIndexPath}\n`);
  if (ticketAbs) process.stdout.write(`Created ticket: ${ticketAbs}\n`);
  process.stdout.write(`${assignedId}\n`);
  return { assignedId };
}

// 統合ブランチ名を解決する。--integration-branch の明示指定を最優先し、
// 次に config の run.register_integration_branch、最後に specdojo:git-branching-standard に従い
// プロジェクト統合ブランチ `project/<project-id>/develop` を既定にする。
export function resolveIntegrationBranchName(projectId: string, override?: string): string {
  const trimmed = override?.trim();
  if (trimmed) return trimmed;
  const { config } = loadConfig();
  const branch = config?.projects[projectId]?.run?.register_integration_branch?.trim();
  return branch || `project/${projectId}/develop`;
}

// 現在の作業ツリーがチェックアウトしているブランチ名を返す。detached HEAD では空文字。
function currentBranchName(repoRoot: string): string {
  return gitOutput(repoRoot, ["branch", "--show-current"]).trim();
}

// ================================
// Error Handling & Shared Helpers
// ================================

function printCommandError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  process.stdout.write(message + "\n");
  process.exitCode = 1;
}

function addProjectOption(cmd: Command): Command {
  return cmd.option("--project <projectId>", "Project id in specdojo.config.json");
}

// ================================
// Command Registration
// ================================

export function registerRegisterCommands(program: Command): void {
  const reg = program.command("register").description("Project register (pjr-index.md) commands");

  // --- scaffold ---
  const scaffoldCmd = reg.command("scaffold").description("Generate pjr-index.md from template");
  addProjectOption(scaffoldCmd);
  scaffoldCmd.option("--project-id <id>", "Project ID to embed (defaults to --project value)");
  scaffoldCmd.option("--force", "Overwrite existing pjr-index.md", false);
  scaffoldCmd.option("--dry-run", "Print generated content to stdout without writing", false);
  scaffoldCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);
      const embedId = opts.projectId?.trim() || paths.projectId;

      const templatePath = join(
        specdojoRootDir(),
        "docs/ja/specdojo/templates/pjr-index-template.md",
      );
      if (!existsSync(templatePath)) {
        throw new Error(`Template not found: ${templatePath}`);
      }

      if (!opts.force && existsSync(paths.pjrIndexPath)) {
        process.stdout.write(
          `Skipped (already exists; use --force to overwrite): ${paths.pjrIndexPath}\n`,
        );
        return;
      }

      let content = readFileSync(templatePath, "utf8");
      content = flattenTemplateFrontmatter(content);
      content = content.replace(/_PROJECT_ID_/g, embedId);

      if (opts.dryRun) {
        process.stdout.write(content);
        return;
      }

      mkdirSync(paths.projectRegisterPath, { recursive: true });
      mkdirSync(paths.generatedPath, { recursive: true });
      writeFileSync(paths.pjrIndexPath, content, "utf8");
      process.stdout.write(`Created: ${paths.pjrIndexPath}\n`);
      process.stdout.write(`Created: ${paths.generatedPath}/\n`);

      for (const view of writeDerivedViews(paths, "all")) {
        process.stdout.write(`Generated: ${view.path}\n`);
      }
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- add ---
  const addCmd = reg.command("add").description("Add a new item to pjr-index.md");
  addProjectOption(addCmd);
  addCmd.requiredOption("--type <type>", `Item type: ${VALID_TYPES.join(" | ")}`);
  addCmd.requiredOption("--title <title>", "Short title for the item");
  addCmd.option("--description <text>", "Description shown in the list", "_TODO_");
  addCmd.option("--priority <priority>", `Priority: ${VALID_PRIORITIES.join(" | ")}`, "medium");
  addCmd.option("--status <status>", `Status: ${VALID_STATUSES.join(" | ")}`, "open");
  addCmd.option("--owner <owner>", "Owner or role", "_TODO_");
  addCmd.option("--due <date>", "Due date (YYYY-MM-DD, -, or _TODO_)", "_TODO_");
  addCmd.option("--completed <date>", "Completion date (YYYY-MM-DD or -)", "-");
  addCmd.option("--conclusion <text>", "Conclusion or resolution summary", "-");
  addCmd.option("--id <id>", "Display ID (e.g., PJR-0061); auto-incremented if omitted");
  addCmd.option("--ticket", "Also generate individual ticket file", false);
  addCmd.option(
    "--topic <topic>",
    "Topic slug for ticket filename; derived from --title if omitted",
  );
  addCmd.option("--force", "Overwrite existing ticket file", false);
  addCmd.option(
    "--reserve",
    "Force reserving the PJR-ID on the integration branch even when already on it (add commits the row)",
    false,
  );
  addCmd.option(
    "--local",
    "Add to the current branch's pjr-index.md without integration-branch routing (may cause ID conflicts across branches)",
    false,
  );
  addCmd.option(
    "--integration-branch <name>",
    "Integration branch that owns pjr-index.md (default: run.register_integration_branch or project/<project-id>/develop)",
  );
  addCmd.option(
    "--integration-worktree <path>",
    "Explicit integration worktree path (overrides integration branch lookup)",
  );
  addCmd.option("--commit-message <text>", "Commit message for the reservation commit");
  addCmd.option("--dry-run", "Print new row and ticket content without writing", false);
  addCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);

      if (opts.local && opts.reserve) {
        throw new Error("--local and --reserve are mutually exclusive.");
      }

      const topic = opts.topic?.trim() || slugify(opts.title);
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(topic)) {
        throw new Error(
          `Invalid topic: "${topic}". Must use lowercase letters, numbers, and single hyphens`,
        );
      }

      // ID 採番の抜本対策（案1）: 単調連番 PJR-ID は分散採番できないため、統合ブランチの
      // pjr-index.md を単一直列化点にする。統合ブランチ上なら従来どおり in-place で追記する
      // （そこが唯一の採番元）。別ブランチ（feature/exec）から実行された場合は、作業ブランチの
      // pjr-index.md を触らず統合ブランチ worktree へ自動ルーティングして採番・commit する。
      // --local は従来の in-place を強制する退避口。
      const repoRoot = specdojoRootDir();
      const integrationBranch = resolveIntegrationBranchName(
        paths.projectId,
        opts.integrationBranch,
      );
      const currentBranch = currentBranchName(repoRoot);
      const routeToIntegration =
        !opts.local && (opts.reserve || currentBranch !== integrationBranch);

      if (routeToIntegration) {
        const makeTemplatePath = (): string =>
          join(specdojoRootDir(), `docs/ja/specdojo/templates/pjr-${opts.type}-template.md`);
        let target: IntegrationWorktree;
        try {
          target = resolveIntegrationWorktree(repoRoot, {
            branch: integrationBranch,
            worktreePath: opts.integrationWorktree?.trim() || undefined,
          });
        } catch (error) {
          const detail = error instanceof Error ? error.message : String(error);
          throw new Error(
            `${detail}\n` +
              `Run register add on the integration branch (${integrationBranch}), ` +
              `check out a worktree there, or pass --local to add to the current branch.`,
          );
        }
        if (!opts.reserve && currentBranch !== integrationBranch) {
          process.stdout.write(
            `Not on integration branch "${integrationBranch}" (current: "${currentBranch || "detached"}"); ` +
              `routing to integration worktree: ${target.path}\n`,
          );
        }
        const pjrIndexRel = relative(repoRoot, paths.pjrIndexPath).split(sep).join("/");
        reservePjrIdOnIntegration({
          worktreePath: target.path,
          pjrIndexRel,
          explicitId: opts.id?.trim() || undefined,
          fields: {
            type: opts.type,
            title: opts.title,
            description: opts.description,
            priority: opts.priority,
            status: opts.status,
            owner: opts.owner,
            due: opts.due,
            completed: opts.completed,
            conclusion: opts.conclusion,
          },
          commitMessage: opts.commitMessage,
          dryRun: opts.dryRun,
          ...(opts.ticket
            ? {
                ticket: {
                  topic,
                  makeContent: (assignedId: string): string =>
                    generateTicket({
                      projectId: paths.projectId,
                      displayId: assignedId,
                      topic,
                      type: opts.type,
                      title: opts.title,
                      templatePath: makeTemplatePath(),
                    }),
                },
              }
            : {}),
        });
        return;
      }

      if (!existsSync(paths.pjrIndexPath)) {
        throw new Error(
          `pjr-index.md not found: ${paths.pjrIndexPath}\n` +
            `Run: specdojo register scaffold --project ${opts.project || paths.projectId}`,
        );
      }

      const originalContent = readFileSync(paths.pjrIndexPath, "utf8");
      const existingItems = parsePjrIndex(originalContent);

      const displayId = opts.id?.trim() || getNextPjrId(existingItems);

      validateFields({
        status: opts.status,
        type: opts.type,
        priority: opts.priority,
        due: opts.due,
        completed: opts.completed,
        id: displayId,
      });

      if (opts.id && existingItems.some((it) => it.id === displayId)) {
        throw new Error(`ID already exists in pjr-index.md: ${displayId}`);
      }

      const ticketFilename = `${displayId.toLowerCase()}-${topic}.md`;
      const ticketRef = opts.ticket
        ? `[${ticketFilename.replace(".md", "")}](./${ticketFilename})`
        : "-";

      const newItem: PjrItem = {
        id: displayId,
        status: opts.status,
        title: opts.title,
        description: opts.description,
        type: opts.type,
        priority: opts.priority,
        owner: opts.owner,
        due: opts.due,
        completed: opts.completed,
        conclusion: opts.conclusion,
        ticket: ticketRef,
      };

      const newRow = formatTableRow(newItem);

      if (opts.dryRun) {
        process.stdout.write(`New row:\n${newRow}\n`);
        if (opts.ticket) {
          const templatePath = join(
            specdojoRootDir(),
            `docs/ja/specdojo/templates/pjr-${opts.type}-template.md`,
          );
          const ticketContent = generateTicket({
            projectId: paths.projectId,
            displayId,
            topic,
            type: opts.type,
            title: opts.title,
            templatePath,
          });
          process.stdout.write(`\nTicket (${ticketFilename}):\n${ticketContent}\n`);
        }
        return;
      }

      const updatedContent = insertRowAfterLast(originalContent, newRow);
      writeFileSync(paths.pjrIndexPath, updatedContent, "utf8");
      process.stdout.write(`Updated: ${paths.pjrIndexPath} (added ${displayId})\n`);

      if (opts.ticket) {
        const ticketPath = join(paths.projectRegisterPath, ticketFilename);
        if (!opts.force && existsSync(ticketPath)) {
          process.stdout.write(
            `Skipped ticket (already exists; use --force to overwrite): ${ticketPath}\n`,
          );
        } else {
          const templatePath = join(
            specdojoRootDir(),
            `docs/ja/specdojo/templates/pjr-${opts.type}-template.md`,
          );
          const ticketContent = generateTicket({
            projectId: paths.projectId,
            displayId,
            topic,
            type: opts.type,
            title: opts.title,
            templatePath,
          });
          writeFileSync(ticketPath, ticketContent, "utf8");
          process.stdout.write(`Created ticket: ${ticketPath}\n`);
        }
      }
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- close ---
  const closeCmd = reg.command("close").description("Set item status to done or decided");
  addProjectOption(closeCmd);
  closeCmd.requiredOption("--id <id>", "Item ID (PJR-XXXX)");
  closeCmd.option("--status <status>", "done or decided (auto from item type if omitted)");
  closeCmd.option("--conclusion <text>", "Conclusion or resolution summary");
  closeCmd.option("--completed <date>", "Completion date (YYYY-MM-DD; defaults to today)");
  closeCmd.option("--dry-run", "Print change without writing", false);
  closeCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);
      const { content, item } = loadItemForUpdate(paths, opts.id, "require-active");

      const targetStatus =
        opts.status ?? (["decision", "question"].includes(item.type) ? "decided" : "done");
      if (targetStatus !== "done" && targetStatus !== "decided") {
        throw new Error(`--status must be "done" or "decided" for the close command`);
      }

      const completed = opts.completed ?? todayIso();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(completed)) {
        throw new Error(`Invalid completed date: "${completed}". Must be YYYY-MM-DD`);
      }

      const updated: PjrItem = {
        ...item,
        status: targetStatus,
        completed,
        ...(opts.conclusion !== undefined ? { conclusion: opts.conclusion } : {}),
      };
      applyItemUpdate({ paths, content, updated, dryRun: opts.dryRun });
      updateTicketStatusForItem({ paths, item, targetStatus: "ready", dryRun: opts.dryRun });
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- reject ---
  const rejectCmd = reg.command("reject").description("Set item status to rejected");
  addProjectOption(rejectCmd);
  rejectCmd.requiredOption("--id <id>", "Item ID (PJR-XXXX)");
  rejectCmd.option("--conclusion <text>", "Reason for rejection");
  rejectCmd.option("--completed <date>", "Rejection date (YYYY-MM-DD; defaults to today)");
  rejectCmd.option("--dry-run", "Print change without writing", false);
  rejectCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);
      const { content, item } = loadItemForUpdate(paths, opts.id, "require-active");

      const completed = opts.completed ?? todayIso();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(completed)) {
        throw new Error(`Invalid completed date: "${completed}". Must be YYYY-MM-DD`);
      }

      const updated: PjrItem = {
        ...item,
        status: "rejected",
        completed,
        ...(opts.conclusion !== undefined ? { conclusion: opts.conclusion } : {}),
      };
      applyItemUpdate({ paths, content, updated, dryRun: opts.dryRun });
      updateTicketStatusForItem({ paths, item, targetStatus: "deprecated", dryRun: opts.dryRun });
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- defer ---
  const deferCmd = reg.command("defer").description("Set item status to deferred");
  addProjectOption(deferCmd);
  deferCmd.requiredOption("--id <id>", "Item ID (PJR-XXXX)");
  deferCmd.option("--conclusion <text>", "Reason for deferral");
  deferCmd.option("--dry-run", "Print change without writing", false);
  deferCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);
      const { content, item } = loadItemForUpdate(paths, opts.id, "require-active");

      const updated: PjrItem = {
        ...item,
        status: "deferred",
        ...(opts.conclusion !== undefined ? { conclusion: opts.conclusion } : {}),
      };
      applyItemUpdate({ paths, content, updated, dryRun: opts.dryRun });
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- reopen ---
  const reopenCmd = reg.command("reopen").description("Reopen a terminal-status item");
  addProjectOption(reopenCmd);
  reopenCmd.requiredOption("--id <id>", "Item ID (PJR-XXXX)");
  reopenCmd.option(
    "--status <status>",
    "Target status: open | in-progress | waiting | review",
    "open",
  );
  reopenCmd.option("--dry-run", "Print change without writing", false);
  reopenCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);
      const { content, item } = loadItemForUpdate(paths, opts.id, "require-terminal");

      const validReopenStatuses = ["open", "in-progress", "waiting", "review"];
      if (!validReopenStatuses.includes(opts.status)) {
        throw new Error(`--status must be one of: ${validReopenStatuses.join(", ")}`);
      }

      const updated: PjrItem = { ...item, status: opts.status, completed: "-" };
      applyItemUpdate({ paths, content, updated, dryRun: opts.dryRun });
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- start ---
  const startCmd = reg.command("start").description("Set item status to in-progress");
  addProjectOption(startCmd);
  startCmd.requiredOption("--id <id>", "Item ID (PJR-XXXX)");
  startCmd.option("--dry-run", "Print change without writing", false);
  startCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);
      const { content, item } = loadItemForUpdate(paths, opts.id, "require-active");
      const updated: PjrItem = { ...item, status: "in-progress" };
      applyItemUpdate({ paths, content, updated, dryRun: opts.dryRun });
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- wait ---
  const waitCmd = reg.command("wait").description("Set item status to waiting");
  addProjectOption(waitCmd);
  waitCmd.requiredOption("--id <id>", "Item ID (PJR-XXXX)");
  waitCmd.option("--conclusion <text>", "Reason for waiting");
  waitCmd.option("--dry-run", "Print change without writing", false);
  waitCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);
      const { content, item } = loadItemForUpdate(paths, opts.id, "require-active");
      const updated: PjrItem = {
        ...item,
        status: "waiting",
        ...(opts.conclusion !== undefined ? { conclusion: opts.conclusion } : {}),
      };
      applyItemUpdate({ paths, content, updated, dryRun: opts.dryRun });
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- review ---
  const reviewCmd = reg.command("review").description("Set item status to review");
  addProjectOption(reviewCmd);
  reviewCmd.requiredOption("--id <id>", "Item ID (PJR-XXXX)");
  reviewCmd.option("--dry-run", "Print change without writing", false);
  reviewCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);
      const { content, item } = loadItemForUpdate(paths, opts.id, "require-active");
      const updated: PjrItem = { ...item, status: "review" };
      applyItemUpdate({ paths, content, updated, dryRun: opts.dryRun });
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- update ---
  const updateCmd = reg.command("update").description("Update fields of a register item");
  addProjectOption(updateCmd);
  updateCmd.requiredOption("--id <id>", "Item ID (PJR-XXXX)");
  updateCmd.option("--title <title>", "Update title");
  updateCmd.option("--description <text>", "Update description");
  updateCmd.option("--priority <priority>", `Update priority: ${VALID_PRIORITIES.join(" | ")}`);
  updateCmd.option("--owner <owner>", "Update owner or role");
  updateCmd.option("--due <date>", "Update due date (YYYY-MM-DD, -, or _TODO_)");
  updateCmd.option("--dry-run", "Print change without writing", false);
  updateCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);
      const { content, item } = loadItemForUpdate(paths, opts.id);

      const hasUpdates = ["title", "description", "priority", "owner", "due"].some(
        (k) => opts[k] !== undefined,
      );
      if (!hasUpdates) {
        throw new Error(
          "At least one field option must be specified (--title, --description, --priority, --owner, --due)",
        );
      }

      if (
        opts.priority !== undefined &&
        !(VALID_PRIORITIES as readonly string[]).includes(opts.priority)
      ) {
        throw new Error(
          `Invalid priority: "${opts.priority}". Must be one of: ${VALID_PRIORITIES.join(", ")}`,
        );
      }
      if (opts.due !== undefined && !/^(\d{4}-\d{2}-\d{2}|-|_TODO_)$/.test(opts.due)) {
        throw new Error(`Invalid due: "${opts.due}". Must be YYYY-MM-DD, -, or _TODO_`);
      }

      const updated: PjrItem = {
        ...item,
        ...(opts.title !== undefined ? { title: opts.title } : {}),
        ...(opts.description !== undefined ? { description: opts.description } : {}),
        ...(opts.priority !== undefined ? { priority: opts.priority } : {}),
        ...(opts.owner !== undefined ? { owner: opts.owner } : {}),
        ...(opts.due !== undefined ? { due: opts.due } : {}),
      };
      applyItemUpdate({ paths, content, updated, dryRun: opts.dryRun, action: "fields updated" });
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- build ---
  const buildCmd = reg.command("build").description("Generate derived views from pjr-index.md");
  addProjectOption(buildCmd);
  buildCmd.option("--scope <scope>", "Generation scope: register | controls | all", "all");
  buildCmd.option("--dry-run", "Print generated content without writing", false);
  buildCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);

      if (!existsSync(paths.pjrIndexPath)) {
        throw new Error(
          `pjr-index.md not found: ${paths.pjrIndexPath}\n` +
            `Run: specdojo register scaffold --project ${opts.project || paths.projectId}`,
        );
      }

      const scope = opts.scope as BuildScope;
      if (!VALID_BUILD_SCOPES.includes(scope)) {
        throw new Error(
          `Invalid scope: "${opts.scope}". Must be one of: ${VALID_BUILD_SCOPES.join(", ")}`,
        );
      }

      const views = generateDerivedViewFiles(paths, scope);

      if (opts.dryRun) {
        for (const view of views) {
          process.stdout.write(`=== ${view.path} ===\n${view.content}\n\n`);
        }
        return;
      }

      for (const view of writeDerivedViews(paths, scope)) {
        process.stdout.write(`Generated: ${view.path}\n`);
      }
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- renumber ---
  const renumberCmd = reg
    .command("renumber")
    .description("Move a duplicated/conflicting PJR-ID to an unused PJR-ID");
  addProjectOption(renumberCmd);
  renumberCmd.requiredOption("--id <id>", "Current item ID (PJR-XXXX)");
  renumberCmd.requiredOption("--to <id>", "Target unused ID (PJR-XXXX)");
  renumberCmd.option("--dry-run", "Print planned changes without writing", false);
  renumberCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);
      renumberPjrItem({ paths, fromId: opts.id, toId: opts.to, dryRun: opts.dryRun });
    } catch (error) {
      printCommandError(error);
    }
  });
}
