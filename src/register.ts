import { type Command } from "commander";
import { randomInt } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import fg from "fast-glob";
import { getProjectRegisterPath, loadConfig, loadEnv, specdojoRootDir } from "./specdojo-config.js";
import { resolveRegisterDateTimeZone, todayInTimeZone } from "./register-date.js";
import { flattenTemplateFrontmatter } from "./template-frontmatter.js";
import { parseSpecdojoDocument } from "./frontmatter-namespace.js";
import { gitOutput, gitResult, listRegisteredWorktrees } from "./exec-worktree.js";
import {
  applyRegisterItemFields,
  compareRegisterItemIds,
  displayIdFromTicketFilename,
  formatRegisterItemFields,
  isPlaceholderCell,
  loadRegisterItemDocs,
  PJR_ID_ALPHABET,
  PJR_ID_RE,
  registerItemFieldsFromItem,
  setRegisterItemDescription,
  setRegisterItemTitle,
  TERMINAL_STATUSES_SET,
  ticketRefCell,
  VALID_PRIORITIES,
  VALID_STATUSES,
  VALID_TYPES,
  type PjrItem,
  type RegisterItemFieldUpdates,
} from "./register-item.js";

// 登録項目の型・enum・ID 書式は register-item.ts が正本。従来どおり register.js からも
// 参照できるよう再輸出する。
export {
  PJR_ID_ALPHABET,
  PJR_ID_RE,
  TERMINAL_STATUSES_SET,
  VALID_PRIORITIES,
  VALID_STATUSES,
  VALID_TYPES,
  type PjrItem,
};

// ================================
// Types
// ================================

export type RegisterPaths = {
  projectId: string;
  projectRegisterPath: string;
  pjrIndexPath: string;
  generatedPath: string;
  controlsGeneratedPath: string;
  // 登録日・完了日を導出する IANA タイムゾーン（run.register_date_timezone、既定 UTC）。
  registerDateTimeZone: string;
};

// 個票（登録項目の正本）を1件指す解決結果。ticketPath が無い項目は、まだ個票へ
// 移行されていない pjr-index の行（読み取り互換）だけが存在する状態を表す。
export type RegisterItemView = {
  id: string;
  item: PjrItem;
  ticketPath?: string;
  ticketFilename?: string;
  // ticket: 個票 frontmatter が正本 / index: 未移行のため pjr-index の行から読んだ項目。
  source: "ticket" | "index";
};

// ================================
// Constants
// ================================

// PJR-ID の乱数部分の桁数。
const PJR_ID_LENGTH = 4;

// 生成した ID が偶然含みうる不適切語の簡易ブロックリスト（4 文字, 大文字, 曖昧文字除外後）。
// 一致した候補は採用せず再抽選する。曖昧文字（I/L/O/U）を含む語は生成されえないため載せない。
const PJR_ID_BLOCKLIST = new Set<string>(["CRAP", "DAMN", "TWAT", "WANK", "SHAG", "FART"]);

// 個票 Frontmatter の文書成熟度（specdojo:pjr-rulebook「個票 status の遷移基準」）。
// pjr-index の処理状態（VALID_STATUSES）とは別の状態軸として扱う。
export const VALID_TICKET_STATUSES = ["draft", "ready", "deprecated"] as const;
export type TicketStatus = (typeof VALID_TICKET_STATUSES)[number];

// 登録項目一覧テーブルは specdojo:pjr-rulebook「本文構成」で章 1 に固定される。
// 見出し文言（言語依存）ではなく章番号でセクションを特定し、i18n 非依存にする。
const REGISTER_SECTION_RE = /^## 1\.\s/;

// 登録項目一覧（pjr-index）の生成 template。外枠（H1・注記・章見出し）と章 1 の
// 列見出しを所有し、生成処理は行だけを差し込む。列名を定数として持たないことで、
// 一覧の言語は template 側の差し替えだけで切り替えられる。
const REGISTER_INDEX_TEMPLATE = "pjr-index-template.md";

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
    registerDateTimeZone: resolveRegisterDateTimeZone(config, projectId),
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
// 定数として持たず登録簿一覧 template から採用し、列名の言語に依存しない。
export type TableHeading = { header: string; separator: string };

// 章 1 の登録項目一覧テーブルの位置。separatorIndex は行配列上の区切り行の添字で、
// 行を差し込む基準になる。
type RegisterTableLocation = { heading: TableHeading; separatorIndex: number };

function locateRegisterTable(lines: string[]): RegisterTableLocation | undefined {
  let inSection = false;
  let header: string | undefined;

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    if (REGISTER_SECTION_RE.test(line)) {
      inSection = true;
      continue;
    }
    if (inSection && /^## /.test(line)) break;
    if (!inSection || !line.startsWith("|")) continue;

    if (isTableSeparator(line)) {
      if (header === undefined) {
        throw new Error(
          "Register table header row not found before the separator in the register list source",
        );
      }
      return {
        heading: { header: header.trim(), separator: line.trim() },
        separatorIndex: index,
      };
    }
    if (header === undefined) header = line;
  }

  return undefined;
}

export function extractTableHeading(content: string): TableHeading {
  const located = locateRegisterTable(content.split("\n"));
  if (!located) {
    throw new Error("Register table header row not found in the register list source");
  }
  return located.heading;
}

// 章 1 の登録項目一覧テーブルの区切り行直後へ、生成した行を差し込む。
// テーブルの列見出しは template が所有するため、生成処理は行だけを注入する。
export function injectRegisterRows(content: string, rows: string[]): string {
  const lines = content.split("\n");
  const located = locateRegisterTable(lines);
  if (!located) {
    throw new Error(`Register table not found in template: ${REGISTER_INDEX_TEMPLATE}`);
  }
  lines.splice(located.separatorIndex + 1, 0, ...rows);
  return lines.join("\n");
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
    if (cells.length < 12) continue;
    if (!PJR_ID_RE.test(cells[0])) continue;

    items.push({
      id: cells[0],
      status: cells[1],
      title: cells[2],
      description: cells[3],
      type: cells[4],
      priority: cells[5],
      owner: cells[6],
      registered: cells[7],
      due: cells[8],
      completed: cells[9],
      conclusion: cells[10],
      ticket: cells[11],
    });
  }

  return items;
}

// 32 文字セットから一様乱択した 4 文字を持つ PJR-ID 候補を 1 件生成する。
function defaultPjrCandidate(): string {
  let suffix = "";
  for (let i = 0; i < PJR_ID_LENGTH; i++) {
    suffix += PJR_ID_ALPHABET[randomInt(0, PJR_ID_ALPHABET.length)];
  }
  return `PJR-${suffix}`;
}

// 既存 ID・不適切語ブロックリストと衝突しない PJR-ID をランダムに採番する。
// 生成候補が既存 ID かブロックリストに一致した場合は再抽選する。nextCandidate は
// テストで抽選列を差し込むための注入点で、既定は 32 文字セットからの一様乱択。
export function generatePjrId(
  existingIds: Iterable<string>,
  nextCandidate: () => string = defaultPjrCandidate,
  maxAttempts = 256,
): string {
  const existing = new Set(existingIds);
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const id = nextCandidate();
    if (!PJR_ID_RE.test(id)) continue;
    if (existing.has(id)) continue;
    if (PJR_ID_BLOCKLIST.has(id.slice("PJR-".length))) continue;
    return id;
  }
  throw new Error(`Failed to generate an unused PJR-ID after ${maxAttempts} attempts`);
}

function formatTableRow(item: PjrItem): string {
  return `| ${item.id} | ${item.status} | ${item.title} | ${item.description} | ${item.type} | ${item.priority} | ${item.owner} | ${item.registered} | ${item.due} | ${item.completed} | ${item.conclusion} | ${item.ticket} |`;
}

// ================================
// Validation
// ================================

function validateFields(opts: {
  status: string;
  type: string;
  priority: string;
  registered: string;
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
  if (opts.id && !PJR_ID_RE.test(opts.id)) {
    errors.push(`Invalid ID: "${opts.id}". Must match PJR-XXXX (e.g., PJR-0001)`);
  }
  if (!/^(\d{4}-\d{2}-\d{2}|_TODO_)$/.test(opts.registered)) {
    errors.push(`Invalid registered: "${opts.registered}". Must be YYYY-MM-DD or _TODO_`);
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

// 個票の完成形（テンプレート展開 + 説明の反映 + 登録項目 frontmatter）を組み立てる。
// 登録項目の構造化フィールドは frontmatter、タイトルは H1、説明は概要段落が正本になる。
function buildRegisterItemContent(opts: {
  projectId: string;
  displayId: string;
  topic: string;
  fields: ReservationFields;
  templatePath: string;
}): string {
  let content = generateTicket({
    projectId: opts.projectId,
    displayId: opts.displayId,
    topic: opts.topic,
    type: opts.fields.type,
    title: opts.fields.title,
    templatePath: opts.templatePath,
  });

  if (!isPlaceholderCell(opts.fields.description)) {
    content = setRegisterItemDescription(content, opts.fields.description);
  }

  return applyRegisterItemFields(
    content,
    registerItemFieldsFromItem({
      id: opts.displayId,
      status: opts.fields.status,
      title: opts.fields.title,
      description: opts.fields.description,
      type: opts.fields.type,
      priority: opts.fields.priority,
      owner: opts.fields.owner,
      registered: opts.fields.registered,
      due: opts.fields.due,
      completed: opts.fields.completed,
      conclusion: opts.fields.conclusion,
      ticket: "-",
    }),
  );
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

// 登録項目一覧（pjr-index）本体を生成する。行は ID 昇順で、列見出しと外枠は template が持つ。
function generateIndexView(items: PjrItem[], projectId: string): string {
  const template = loadViewTemplate(REGISTER_INDEX_TEMPLATE, projectId);
  return injectRegisterRows(template, items.map(formatTableRow));
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
export type BuildScope = "register" | "controls" | "all";
export type ViewFile = { path: string; content: string };

const VALID_BUILD_SCOPES: BuildScope[] = ["register", "controls", "all"];

export function generateDerivedViewFiles(paths: RegisterPaths, scope: BuildScope): ViewFile[] {
  // 項目の値は個票 frontmatter（正本）から集める。列見出しは template から採用するため、
  // 生成処理は作業ツリーの pjr-index.md を入力にしない。
  const items = loadRegisterItems(paths).map((view) => view.item);
  const heading = extractTableHeading(loadViewTemplate(REGISTER_INDEX_TEMPLATE, paths.projectId));

  // 個票セルのリンクは project-register/ 起点の `./` 表記で作られる。
  // 各 generated/ ディレクトリから辿れるよう相対パスを付け替える。
  const pjrDirName = basename(paths.projectRegisterPath);
  const regItems = rebaseItems(items, "../");
  const ctrlItems = rebaseItems(items, `../${pjrDirName}/`);

  const registerViews: ViewFile[] = [];
  const controlsViews: ViewFile[] = [];

  if (scope === "register" || scope === "all") {
    registerViews.push(
      {
        path: join(paths.generatedPath, "pjr-index.md"),
        content: generateIndexView(regItems, paths.projectId),
      },
      {
        path: join(paths.generatedPath, "pjr-views.md"),
        content: generateViewsFile(regItems, paths.projectId, heading),
      },
    );
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

export function findItemById(items: PjrItem[], id: string): PjrItem | undefined {
  return items.find((it) => it.id === id);
}

// 登録項目を全件解決する。正本は個票 frontmatter で、登録項目フィールドを持つ個票を
// 最優先で採用する。まだ個票へ移行していない項目は pjr-index の行から読み取り（互換）、
// 個票ファイルがある場合はそのパスを保持して、次回の更新時に frontmatter へ移す。
export function loadRegisterItems(paths: RegisterPaths): RegisterItemView[] {
  const docs = loadRegisterItemDocs(paths.projectRegisterPath);
  const docById = new Map(docs.map((doc) => [doc.id, doc]));
  const views = new Map<string, RegisterItemView>();

  for (const doc of docs) {
    if (!doc.hasRegisterFields) continue;
    views.set(doc.id, {
      id: doc.id,
      item: doc.item,
      ticketPath: doc.path,
      ticketFilename: doc.filename,
      source: "ticket",
    });
  }

  if (existsSync(paths.pjrIndexPath)) {
    for (const item of parsePjrIndex(readFileSync(paths.pjrIndexPath, "utf8"))) {
      if (views.has(item.id)) continue;
      const doc = docById.get(item.id);
      views.set(item.id, {
        id: item.id,
        item: doc ? { ...item, ticket: ticketRefCell(doc.filename) } : item,
        ticketPath: doc?.path,
        ticketFilename: doc?.filename,
        source: "index",
      });
    }
  }

  return [...views.values()].sort((a, b) => compareRegisterItemIds(a.id, b.id));
}

export function findRegisterItem(
  views: RegisterItemView[],
  id: string,
): RegisterItemView | undefined {
  return views.find((view) => view.id === id);
}

// 更新対象の登録項目を解決する。個票ファイルが無い項目は、書き込み先（正本）が無いため
// 更新できない。移行が済んでいない旧項目に当たった場合は、個票化を促して中断する。
function loadItemForUpdate(
  paths: RegisterPaths,
  id: string,
  guard?: "require-active" | "require-terminal",
): RegisterItemView {
  if (!PJR_ID_RE.test(id)) {
    throw new Error(`Invalid ID: "${id}". Must match PJR-XXXX (e.g., PJR-0001)`);
  }
  const view = findRegisterItem(loadRegisterItems(paths), id);
  if (!view) {
    throw new Error(`Item not found: ${id} (searched ${paths.projectRegisterPath})`);
  }
  if (!view.ticketPath) {
    throw new Error(
      `Item ${id} has no ticket file under ${paths.projectRegisterPath}.\n` +
        `The register item frontmatter is the source of truth; create the ticket file ` +
        `(pjr-${id.slice("PJR-".length).toLowerCase()}-<topic>.md) before updating the item.`,
    );
  }
  if (guard === "require-active" && TERMINAL_STATUSES_SET.has(view.item.status)) {
    throw new Error(
      `Cannot change ${id}: status is "${view.item.status}" (terminal). Use "register reopen" first.`,
    );
  }
  if (guard === "require-terminal" && !TERMINAL_STATUSES_SET.has(view.item.status)) {
    throw new Error(`Cannot reopen ${id}: status is "${view.item.status}" (already active).`);
  }
  return view;
}

// 更新後の項目値を個票 frontmatter へ書き戻す。未移行（source: index）の項目は、
// 行から読んだ値も含めて全フィールドを書き込み、その場で個票正本へ移行する。
// タイトル・説明は frontmatter に持たないため、H1 と概要段落を書き換える。
function applyItemUpdate(opts: {
  paths: RegisterPaths;
  view: RegisterItemView;
  updated: PjrItem;
  dryRun: boolean;
  action?: string;
  title?: string;
  description?: string;
}): void {
  const ticketPath = opts.view.ticketPath;
  if (!ticketPath) {
    throw new Error(`Item ${opts.view.id} has no ticket file to update`);
  }

  const label = opts.action ?? `→ ${opts.updated.status}`;
  const updates: RegisterItemFieldUpdates = registerItemFieldsFromItem(opts.updated);

  if (opts.dryRun) {
    const lines = [`Would update ${ticketPath} (${opts.updated.id} ${label}):`];
    if (opts.title !== undefined) lines.push(`  title: ${opts.title}`);
    if (opts.description !== undefined) lines.push(`  description: ${opts.description}`);
    lines.push(formatRegisterItemFields(updates));
    process.stdout.write(`${lines.join("\n")}\n`);
    return;
  }

  let content = readFileSync(ticketPath, "utf8");
  if (opts.title !== undefined) content = setRegisterItemTitle(content, opts.title);
  if (opts.description !== undefined) {
    content = setRegisterItemDescription(content, opts.description);
  }
  content = applyRegisterItemFields(content, updates);
  writeFileSync(ticketPath, content, "utf8");
  process.stdout.write(`Updated: ${ticketPath} (${opts.updated.id} ${label})\n`);

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
  const views = loadRegisterItems(paths);

  const fromView = findRegisterItem(views, fromId);
  if (!fromView) {
    throw new Error(`Item not found: ${fromId}`);
  }
  if (findRegisterItem(views, toId)) {
    throw new Error(`Target ID already exists: ${toId}`);
  }
  const fromItem = fromView.item;

  const writes: RenumberPlan["writes"] = [];
  let ticketRename: RenumberPlan["ticketRename"];
  // pjr-index に旧 ID の行が残っている場合だけ、その行も新しい ID へ差し替える。
  const hasIndexRow =
    existsSync(paths.pjrIndexPath) &&
    parsePjrIndex(readFileSync(paths.pjrIndexPath, "utf8")).some((it) => it.id === fromId);
  let newIndexContent = hasIndexRow ? readFileSync(paths.pjrIndexPath, "utf8") : "";

  const oldFilename = fromView.ticketFilename;
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

    if (hasIndexRow) {
      const updated: PjrItem = { ...fromItem, id: toId, ticket: ticketRefCell(newFilename) };
      newIndexContent = renumberRowInContent(newIndexContent, fromId, updated);
    }
  } else if (hasIndexRow) {
    const updated: PjrItem = { ...fromItem, id: toId };
    newIndexContent = renumberRowInContent(newIndexContent, fromId, updated);
  }

  if (hasIndexRow) {
    writes.push({ path: paths.pjrIndexPath, content: newIndexContent });
  }

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

  for (const id of [fromId, toId]) {
    if (!PJR_ID_RE.test(id)) {
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
// Reserve (delegate the new item file to the integration branch worktree)
// ================================

// register add が個票へ書き込む項目値。タイトル・説明は個票本文（H1・概要）へ、
// それ以外は frontmatter の登録項目フィールドへ入る。
export type ReservationFields = {
  type: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  owner: string;
  registered: string;
  due: string;
  completed: string;
  conclusion: string;
};

export type IntegrationWorktree = { path: string; branch: string };

// 登録簿ディレクトリに存在する登録項目 ID を集める。個票ファイル名を正とし、
// 未移行の項目のために pjr-index の行からも ID を拾って採番の衝突を避ける。
export function collectRegisterItemIds(projectRegisterPath: string): string[] {
  const ids = new Set<string>();
  if (existsSync(projectRegisterPath)) {
    for (const entry of readdirSync(projectRegisterPath, { withFileTypes: true })) {
      if (!entry.isFile()) continue;
      const id = displayIdFromTicketFilename(entry.name);
      if (id) ids.add(id);
    }
  }
  const pjrIndexPath = join(projectRegisterPath, "pjr-index.md");
  if (existsSync(pjrIndexPath)) {
    for (const item of parsePjrIndex(readFileSync(pjrIndexPath, "utf8"))) ids.add(item.id);
  }
  return [...ids].sort();
}

// 予約する個票ファイル名と割り当て ID を算出する純粋関数。I/O を持たず、
// フィールド検証と ID 衝突検知だけを行う。ID を省略するとランダムに採番する。
export function planReservation(opts: {
  existingIds: Iterable<string>;
  explicitId?: string;
  fields: ReservationFields;
  // 個票ファイル名に使う topic slug。
  topic: string;
}): { assignedId: string; ticketFilename: string } {
  const existing = [...opts.existingIds];
  const assignedId = opts.explicitId?.trim() || generatePjrId(existing);

  validateFields({
    status: opts.fields.status,
    type: opts.fields.type,
    priority: opts.fields.priority,
    registered: opts.fields.registered,
    due: opts.fields.due,
    completed: opts.fields.completed,
    id: assignedId,
  });

  if (existing.includes(assignedId)) {
    throw new Error(`ID already exists in the project register: ${assignedId}`);
  }

  return { assignedId, ticketFilename: `${assignedId.toLowerCase()}-${opts.topic}.md` };
}

// 登録項目の正本（個票）を所有する統合ブランチの worktree を解決する。
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

// 予約の直前に統合 worktree を origin と同期する。分散した複数マシンが別々に採番して
// 起票するときの採番ズレを軽減するのが目的。
// - fetch が失敗した場合（オフライン等）は既定で警告して継続し、strictSync のときは中断する。
// - 追跡ブランチに追随できる場合のみ `merge --ff-only` で最新化する。
// - origin から分岐（ff-only 不可）している場合は、書き込み前にエラーで止めて手動解決を促す。
export function syncIntegrationWorktree(opts: { worktreePath: string; strictSync: boolean }): void {
  const fetched = gitResult(opts.worktreePath, ["fetch"]);
  if (fetched.status !== 0) {
    const stderr = typeof fetched.stderr === "string" ? fetched.stderr.trim() : "";
    const detail = stderr ? `: ${stderr}` : "";
    if (opts.strictSync) {
      throw new Error(`Failed to fetch the integration branch before reserving${detail}`);
    }
    process.stdout.write(
      `Warning: git fetch failed; reserving against the local pjr-index.md ` +
        `(pass --strict-sync to abort instead)${detail}\n`,
    );
    return;
  }

  // 追跡ブランチ（@{upstream}）が未設定なら同期対象が無いので ff-only はスキップする。
  const upstream = gitResult(opts.worktreePath, [
    "rev-parse",
    "--abbrev-ref",
    "--symbolic-full-name",
    "@{upstream}",
  ]);
  const upstreamRef = typeof upstream.stdout === "string" ? upstream.stdout.trim() : "";
  if (upstream.status !== 0 || !upstreamRef) {
    process.stdout.write(
      `Warning: no upstream is configured for the integration branch; skipping fast-forward sync.\n`,
    );
    return;
  }

  const merged = gitResult(opts.worktreePath, ["merge", "--ff-only", upstreamRef]);
  if (merged.status !== 0) {
    const stderr = typeof merged.stderr === "string" ? merged.stderr.trim() : "";
    const detail = stderr ? `: ${stderr}` : "";
    throw new Error(
      `Integration branch has diverged from ${upstreamRef}; fast-forward is not possible${detail}. ` +
        `Reconcile the integration worktree manually (rebase or merge) before reserving.`,
    );
  }
}

// 統合ブランチの worktree へ個票を作成・commit して PJR-ID を予約する。
// - 登録簿ディレクトリ不在・ID 競合・個票の既存衝突は、書き込み前にエラーで終了する。
// - commit は個票の pathspec に限定し、統合ブランチ側の他の変更を巻き込まない。
// - 個票の内容は、確定した ID に基づき makeContent で生成する。
export function reservePjrIdOnIntegration(opts: {
  worktreePath: string;
  // 登録簿ディレクトリの repo 相対パス（POSIX 区切り）。
  registerDirRel: string;
  explicitId?: string;
  fields: ReservationFields;
  topic: string;
  makeContent: (assignedId: string) => string;
  commitMessage?: string;
  dryRun: boolean;
  // fetch 失敗時に警告継続（false, 既定）せず中断する（true）。
  strictSync?: boolean;
}): { assignedId: string } {
  const registerDir = resolve(opts.worktreePath, opts.registerDirRel);
  if (!existsSync(registerDir)) {
    throw new Error(`Project register directory not found in integration worktree: ${registerDir}`);
  }

  // 採番の直前に統合 worktree を最新化して、他マシンとの採番ズレを軽減する。
  // dry-run は書き込みも commit も行わないため、working tree を変える ff-only merge は避ける。
  if (!opts.dryRun) {
    syncIntegrationWorktree({
      worktreePath: opts.worktreePath,
      strictSync: opts.strictSync ?? false,
    });
  }

  const { assignedId, ticketFilename } = planReservation({
    existingIds: collectRegisterItemIds(registerDir),
    explicitId: opts.explicitId,
    fields: opts.fields,
    topic: opts.topic,
  });

  const ticketRel = `${opts.registerDirRel}/${ticketFilename}`;
  const ticketAbs = resolve(opts.worktreePath, ticketRel);
  if (existsSync(ticketAbs)) {
    throw new Error(`Target ticket file already exists in integration worktree: ${ticketAbs}`);
  }

  if (opts.dryRun) {
    process.stdout.write(`Would reserve ${assignedId} in ${registerDir}\n`);
    process.stdout.write(`Would create ticket: ${ticketAbs}\n`);
    process.stdout.write(`${assignedId}\n`);
    return { assignedId };
  }

  writeFileSync(ticketAbs, opts.makeContent(assignedId), "utf8");
  gitOutput(opts.worktreePath, ["add", "--", ticketRel]);
  gitOutput(opts.worktreePath, [
    "commit",
    "-m",
    opts.commitMessage?.trim() || `register(reserve): add ${assignedId}`,
    "--",
    ticketRel,
  ]);

  process.stdout.write(`Reserved ${assignedId} on integration worktree: ${ticketAbs}\n`);
  process.stdout.write(`Created ticket: ${ticketAbs}\n`);
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

// register 系コマンドのエラーは Unix/CLI の慣習に合わせて stderr へ書く。
// 正常出力（更新内容・生成パス・警告など）は stdout のまま残し、エラーだけを分離する。
// とくに `register where` は成功時のパスを stdout へ出す読み取り専用コマンドで、
// その stdout を `git -C "$(... register where --integration)"` のコマンド置換で
// 直接消費する。エラーメッセージを stdout に混ぜると git の -C 引数へ不正パスとして
// 渡り、分かりにくい二重エラーになるため、エラーは必ず stderr へ出す。
export function printCommandError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(message + "\n");
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
  // 一覧（pjr-index）は個票から生成される派生ビューのため、scaffold は追跡対象の
  // pjr-index.md を作らない。登録簿ディレクトリを用意し、generated/ 配下へ初回生成する。
  const scaffoldCmd = reg
    .command("scaffold")
    .description("Initialize the register directory and generate its views");
  addProjectOption(scaffoldCmd);
  scaffoldCmd.option("--dry-run", "Print generated content to stdout without writing", false);
  scaffoldCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);

      if (opts.dryRun) {
        for (const view of generateDerivedViewFiles(paths, "all")) {
          process.stdout.write(`=== ${view.path} ===\n${view.content}\n\n`);
        }
        return;
      }

      mkdirSync(paths.projectRegisterPath, { recursive: true });
      process.stdout.write(`Created: ${paths.projectRegisterPath}/\n`);

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
  addCmd.option(
    "--registered <date>",
    "Registration date (YYYY-MM-DD or _TODO_; defaults to today in run.register_date_timezone)",
  );
  addCmd.option("--due <date>", "Due date (YYYY-MM-DD, -, or _TODO_)", "_TODO_");
  addCmd.option("--completed <date>", "Completion date (YYYY-MM-DD or -)", "-");
  addCmd.option("--conclusion <text>", "Conclusion or resolution summary", "-");
  addCmd.option("--id <id>", "Display ID (e.g., PJR-0061); auto-incremented if omitted");
  addCmd.option(
    "--topic <topic>",
    "Topic slug for ticket filename; derived from --title if omitted",
  );
  addCmd.option("--force", "Overwrite existing ticket file", false);
  addCmd.option(
    "--reserve",
    "Force reserving the PJR-ID on the integration branch even when already on it (add commits the item file)",
    false,
  );
  addCmd.option(
    "--local",
    "Add to the current branch without integration-branch routing (may cause ID conflicts across branches)",
    false,
  );
  addCmd.option(
    "--integration-branch <name>",
    "Integration branch that owns register items (default: run.register_integration_branch or project/<project-id>/develop)",
  );
  addCmd.option(
    "--integration-worktree <path>",
    "Explicit integration worktree path (overrides integration branch lookup)",
  );
  addCmd.option("--commit-message <text>", "Commit message for the reservation commit");
  addCmd.option(
    "--strict-sync",
    "Abort reserving if fetching the integration branch fails (default: warn and continue)",
    false,
  );
  addCmd.option("--dry-run", "Print the generated item file without writing", false);
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

      // 登録日は明示指定が無ければ run.register_date_timezone（既定 UTC）での「今日」を採用する。
      const registered = opts.registered?.trim() || todayInTimeZone(paths.registerDateTimeZone);

      const fields: ReservationFields = {
        type: opts.type,
        title: opts.title,
        description: opts.description,
        priority: opts.priority,
        status: opts.status,
        owner: opts.owner,
        registered,
        due: opts.due,
        completed: opts.completed,
        conclusion: opts.conclusion,
      };
      const templatePath = join(
        specdojoRootDir(),
        `docs/ja/specdojo/templates/pjr-${opts.type}-template.md`,
      );

      // ID 採番の抜本対策（案1）: 分散採番できる ID 体系ではないため、統合ブランチの
      // 登録簿ディレクトリを単一直列化点にする。統合ブランチ上なら in-place で個票を作る
      // （そこが唯一の採番元）。別ブランチ（feature/exec）から実行された場合は、作業ブランチを
      // 触らず統合ブランチ worktree へ自動ルーティングして採番・commit する。
      // --local は従来の in-place を強制する退避口。
      const repoRoot = specdojoRootDir();
      const integrationBranch = resolveIntegrationBranchName(
        paths.projectId,
        opts.integrationBranch,
      );
      // --local はブランチ判定を行わないため、git への問い合わせも行わない。
      const currentBranch = opts.local ? "" : currentBranchName(repoRoot);
      const routeToIntegration =
        !opts.local && (opts.reserve || currentBranch !== integrationBranch);

      if (routeToIntegration) {
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
        const registerDirRel = relative(repoRoot, paths.projectRegisterPath).split(sep).join("/");
        reservePjrIdOnIntegration({
          worktreePath: target.path,
          registerDirRel,
          explicitId: opts.id?.trim() || undefined,
          fields,
          topic,
          makeContent: (assignedId: string): string =>
            buildRegisterItemContent({
              projectId: paths.projectId,
              displayId: assignedId,
              topic,
              fields,
              templatePath,
            }),
          commitMessage: opts.commitMessage,
          dryRun: opts.dryRun,
          strictSync: opts.strictSync,
        });
        return;
      }

      const { assignedId: displayId, ticketFilename } = planReservation({
        existingIds: loadRegisterItems(paths).map((view) => view.id),
        explicitId: opts.id?.trim() || undefined,
        fields,
        topic,
      });

      const ticketPath = join(paths.projectRegisterPath, ticketFilename);
      const content = buildRegisterItemContent({
        projectId: paths.projectId,
        displayId,
        topic,
        fields,
        templatePath,
      });

      if (opts.dryRun) {
        process.stdout.write(`Would create ${ticketPath}:\n${content}\n`);
        return;
      }

      if (!opts.force && existsSync(ticketPath)) {
        throw new Error(`Item file already exists (use --force to overwrite): ${ticketPath}`);
      }

      mkdirSync(paths.projectRegisterPath, { recursive: true });
      writeFileSync(ticketPath, content, "utf8");
      process.stdout.write(`Created: ${ticketPath} (added ${displayId})\n`);

      if (existsSync(paths.pjrIndexPath)) {
        for (const view of writeDerivedViews(paths, "all")) {
          process.stdout.write(`Generated: ${view.path}\n`);
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
      const view = loadItemForUpdate(paths, opts.id, "require-active");
      const item = view.item;

      const targetStatus =
        opts.status ?? (["decision", "question"].includes(item.type) ? "decided" : "done");
      if (targetStatus !== "done" && targetStatus !== "decided") {
        throw new Error(`--status must be "done" or "decided" for the close command`);
      }

      const completed = opts.completed ?? todayInTimeZone(paths.registerDateTimeZone);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(completed)) {
        throw new Error(`Invalid completed date: "${completed}". Must be YYYY-MM-DD`);
      }

      const updated: PjrItem = {
        ...item,
        status: targetStatus,
        completed,
        ...(opts.conclusion !== undefined ? { conclusion: opts.conclusion } : {}),
      };
      applyItemUpdate({ paths, view, updated, dryRun: opts.dryRun });
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
      const view = loadItemForUpdate(paths, opts.id, "require-active");
      const item = view.item;

      const completed = opts.completed ?? todayInTimeZone(paths.registerDateTimeZone);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(completed)) {
        throw new Error(`Invalid completed date: "${completed}". Must be YYYY-MM-DD`);
      }

      const updated: PjrItem = {
        ...item,
        status: "rejected",
        completed,
        ...(opts.conclusion !== undefined ? { conclusion: opts.conclusion } : {}),
      };
      applyItemUpdate({ paths, view, updated, dryRun: opts.dryRun });
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
      const view = loadItemForUpdate(paths, opts.id, "require-active");
      const item = view.item;

      const updated: PjrItem = {
        ...item,
        status: "deferred",
        ...(opts.conclusion !== undefined ? { conclusion: opts.conclusion } : {}),
      };
      applyItemUpdate({ paths, view, updated, dryRun: opts.dryRun });
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
      const view = loadItemForUpdate(paths, opts.id, "require-terminal");
      const item = view.item;

      const validReopenStatuses = ["open", "in-progress", "waiting", "review"];
      if (!validReopenStatuses.includes(opts.status)) {
        throw new Error(`--status must be one of: ${validReopenStatuses.join(", ")}`);
      }

      const updated: PjrItem = { ...item, status: opts.status, completed: "-" };
      applyItemUpdate({ paths, view, updated, dryRun: opts.dryRun });
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
      const view = loadItemForUpdate(paths, opts.id, "require-active");
      const item = view.item;
      const updated: PjrItem = { ...item, status: "in-progress" };
      applyItemUpdate({ paths, view, updated, dryRun: opts.dryRun });
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
      const view = loadItemForUpdate(paths, opts.id, "require-active");
      const item = view.item;
      const updated: PjrItem = {
        ...item,
        status: "waiting",
        ...(opts.conclusion !== undefined ? { conclusion: opts.conclusion } : {}),
      };
      applyItemUpdate({ paths, view, updated, dryRun: opts.dryRun });
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
      const view = loadItemForUpdate(paths, opts.id, "require-active");
      const item = view.item;
      const updated: PjrItem = { ...item, status: "review" };
      applyItemUpdate({ paths, view, updated, dryRun: opts.dryRun });
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
      const view = loadItemForUpdate(paths, opts.id);
      const item = view.item;

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
      applyItemUpdate({
        paths,
        view,
        updated,
        dryRun: opts.dryRun,
        action: "fields updated",
        ...(opts.title !== undefined ? { title: opts.title } : {}),
        ...(opts.description !== undefined ? { description: opts.description } : {}),
      });
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- build ---
  const buildCmd = reg
    .command("build")
    .description("Generate the register list and derived views from register item files");
  addProjectOption(buildCmd);
  buildCmd.option("--scope <scope>", "Generation scope: register | controls | all", "all");
  buildCmd.option("--dry-run", "Print generated content without writing", false);
  buildCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);

      if (!existsSync(paths.projectRegisterPath)) {
        throw new Error(
          `Project register directory not found: ${paths.projectRegisterPath}\n` +
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

  // --- where ---
  // 読み取り専用のパス解決。pull / push は specdojo に組み込まず、このコマンドが返す
  // 統合 worktree パスを素の git コマンド（npm script 側）へ委譲する。
  const whereCmd = reg
    .command("where")
    .description("Print register-related paths (read-only; use with plain git for pull/push)");
  addProjectOption(whereCmd);
  whereCmd.option("--integration", "Print the integration-branch worktree path", false);
  whereCmd.option(
    "--integration-branch <name>",
    "Integration branch that owns pjr-index.md (default: run.register_integration_branch or project/<project-id>/develop)",
  );
  whereCmd.option(
    "--integration-worktree <path>",
    "Explicit integration worktree path (overrides integration branch lookup)",
  );
  whereCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);
      if (!opts.integration) {
        throw new Error("Specify --integration to print the integration worktree path.");
      }
      const repoRoot = specdojoRootDir();
      const branch = resolveIntegrationBranchName(paths.projectId, opts.integrationBranch);
      const target = resolveIntegrationWorktree(repoRoot, {
        branch,
        worktreePath: opts.integrationWorktree?.trim() || undefined,
      });
      process.stdout.write(`${target.path}\n`);
    } catch (error) {
      printCommandError(error);
    }
  });
}
