import { type Command } from "commander";
import { randomInt, randomUUID } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import fg from "fast-glob";
import { getProjectRegisterPath, loadConfig, loadEnv, specdojoRootDir } from "./specdojo-config.js";
import {
  normalizeRegisterTimestamp,
  nowUtcTimestamp,
  REGISTER_TIMESTAMP_RE,
  resolveRegisterDateTimeZone,
  timestampFromDateInTimeZone,
} from "./register-date.js";
import { inlineCodeAnglePlaceholders } from "./exec-shared.js";
import {
  createGitTimestampResolver,
  planRegisterTimestampMigration,
  summarizeTimestampMigration,
} from "./register-migrate-timestamps.js";
import { flattenTemplateFrontmatter } from "./template-frontmatter.js";
import { parseSpecdojoDocument } from "./frontmatter-namespace.js";
import { collectRegisterHistoryEvents, formatRegisterHistoryEvents } from "./register-history.js";
import {
  appendRegisterEvent,
  buildRegisterEvent,
  deterministicRegisterEventId,
  readRegisterEventsFromContent,
  validateRegisterEventDocs,
  type RegisterEventAction,
  type RegisterEventV1,
} from "./register-events.js";
import {
  applyRegisterItemFields,
  CELL_NONE,
  CELL_TODO,
  compareRegisterItemIds,
  formatRegisterItemFields,
  isPlaceholderCell,
  loadRegisterItemDocs,
  PJR_ID_ALPHABET,
  PJR_ID_RE,
  prependRegisterItemDescription,
  readRegisterItemContent,
  registerItemFieldsFromItem,
  setRegisterItemDescription,
  setRegisterItemTitle,
  TERMINAL_STATUSES_SET,
  ticketRefCell,
  toDisplayItem,
  validateRegisterItemDocs,
  VALID_PRIORITIES,
  VALID_STATUSES,
  VALID_TYPES,
  type PjrDisplayItem,
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
  type PjrDisplayItem,
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

function registerEventActor(opts: { by?: string }): string {
  return opts.by?.trim() || process.env.SPECDOJO_ACTOR?.trim() || "manual";
}

function atomicWriteFile(path: string, content: string): void {
  const temporary = join(dirname(path), `.${basename(path)}.${randomUUID()}.tmp`);
  try {
    writeFileSync(temporary, content, { encoding: "utf8", flag: "wx" });
    renameSync(temporary, path);
  } finally {
    if (existsSync(temporary)) unlinkSync(temporary);
  }
}

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

// 旧一覧（追跡対象だった頃の pjr-index.md）の表を読む互換経路。日付セルは暦日しか持たない
// ため、移行と同じ規則でプロジェクトタイムゾーンの 21:00 を補って日時へ変換する。
export function parsePjrIndex(content: string, timeZone: string): PjrItem[] {
  const lines = content.split("\n");
  const items: PjrItem[] = [];
  let inSection = false;

  const toTimestamp = (cell: string): string =>
    isPlaceholderCell(cell) ? cell.trim() : timestampFromDateInTimeZone(cell.trim(), timeZone);

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
      registeredAt: toTimestamp(cells[7]),
      due: cells[8],
      completedAt: toTimestamp(cells[9]),
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

function formatTableRow(item: PjrDisplayItem): string {
  // frontmatter・本文由来を問わず、表へ展開する全セルを同じ規則で無害化する。
  // 既存コードスパンは変換処理が保持するため、再生成しても二重に囲まれない。
  const cells = [
    item.id,
    item.status,
    item.title,
    item.description,
    item.type,
    item.priority,
    item.owner,
    item.registered,
    item.due,
    item.completed,
    item.conclusion,
    item.ticket,
  ].map(inlineCodeAnglePlaceholders);
  return `| ${cells.join(" | ")} |`;
}

// ================================
// Validation
// ================================

function validateFields(opts: {
  status: string;
  type: string;
  priority: string;
  registeredAt: string;
  due: string;
  completedAt: string;
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
  if (opts.registeredAt !== CELL_TODO && !REGISTER_TIMESTAMP_RE.test(opts.registeredAt)) {
    errors.push(
      `Invalid registered: "${opts.registeredAt}". Must be an RFC 3339 UTC date-time (YYYY-MM-DDTHH:MM:SSZ) or _TODO_`,
    );
  }
  if (!/^(\d{4}-\d{2}-\d{2}|-|_TODO_)$/.test(opts.due)) {
    errors.push(`Invalid due: "${opts.due}". Must be YYYY-MM-DD, -, or _TODO_`);
  }
  if (opts.completedAt !== CELL_NONE && !REGISTER_TIMESTAMP_RE.test(opts.completedAt)) {
    errors.push(
      `Invalid completed: "${opts.completedAt}". Must be an RFC 3339 UTC date-time (YYYY-MM-DDTHH:MM:SSZ) or -`,
    );
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
export function buildRegisterItemContent(opts: {
  projectId: string;
  displayId: string;
  topic: string;
  fields: RegisterAddFields;
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
      registeredAt: opts.fields.registeredAt,
      due: opts.fields.due,
      completedAt: opts.fields.completedAt,
      conclusion: opts.fields.conclusion,
      ticket: "-",
    }),
  );
}

// ================================
// Legacy Register Migration
// ================================

export type RegisterMigrationFile = {
  path: string;
  content: string;
  originalContent?: string;
};

export type RegisterMigrationPlan = {
  sourceCount: number;
  createdCount: number;
  updatedCount: number;
  unchangedCount: number;
  files: RegisterMigrationFile[];
  sourceIndexPath?: string;
  sourceIndexContent?: string;
};

const REGISTER_ITEM_VALUE_KEYS: (keyof PjrItem)[] = [
  "id",
  "status",
  "title",
  "description",
  "type",
  "priority",
  "owner",
  "registeredAt",
  "due",
  "completedAt",
  "conclusion",
];

// pjr-index の表セルだけで必要だった pipe のエスケープを本文へ持ち込まない。
function tableCellToBody(value: string): string {
  return value.replace(/\\\|/g, "|");
}

function migrationTopic(title: string): string {
  return slugify(tableCellToBody(title)).slice(0, 64).replace(/-+$/g, "") || "item";
}

function assertMigratedItemMatches(source: PjrItem, content: string, filename: string): void {
  const migrated = readRegisterItemContent(content, filename)?.item;
  if (!migrated) {
    throw new Error(`Failed to read planned register item: ${filename}`);
  }

  const mismatches = REGISTER_ITEM_VALUE_KEYS.filter((key) => migrated[key] !== source[key]);
  if (mismatches.length > 0) {
    const detail = mismatches
      .map((key) => `${key}: ${JSON.stringify(source[key])} -> ${JSON.stringify(migrated[key])}`)
      .join(", ");
    throw new Error(`Migration verification failed for ${source.id}: ${detail}`);
  }
}

// 追跡対象の旧 pjr-index と、すでに frontmatter 正本へ移った個票を統合して移行計画を作る。
// この段階では書き込みを行わず、全件の変換結果が元の項目値と一致してから計画を返す。
export function planRegisterMigration(paths: RegisterPaths): RegisterMigrationPlan {
  const docs = loadRegisterItemDocs(paths.projectRegisterPath);
  const duplicateDocIds = docs
    .map((doc) => doc.id)
    .filter((id, index, ids) => ids.indexOf(id) !== index);
  if (duplicateDocIds.length > 0) {
    throw new Error(
      `Duplicate register item ticket IDs: ${[...new Set(duplicateDocIds)].join(", ")}`,
    );
  }

  if (!existsSync(paths.pjrIndexPath)) {
    const notMigrated = docs.filter((doc) => !doc.hasRegisterFields);
    if (notMigrated.length > 0) {
      throw new Error(
        `Legacy pjr-index.md is missing, but ${notMigrated.length} ticket(s) have no register item fields: ` +
          notMigrated.map((doc) => doc.id).join(", "),
      );
    }
    return {
      sourceCount: docs.length,
      createdCount: 0,
      updatedCount: 0,
      unchangedCount: docs.length,
      files: [],
    };
  }

  const sourceIndexContent = readFileSync(paths.pjrIndexPath, "utf8");
  const timeZone = paths.registerDateTimeZone;
  // 旧構成の pjr-index.md が一覧テーブルを持たない参照案内だった場合もある。
  // その案内ページは、旧一覧が存在しない場合と同じ no-op として扱う。
  if (!locateRegisterTable(sourceIndexContent.split("\n"))) {
    const notMigrated = docs.filter((doc) => !doc.hasRegisterFields);
    if (notMigrated.length > 0) {
      throw new Error(
        `Legacy pjr-index table is missing, but ${notMigrated.length} ticket(s) have no register item fields: ` +
          notMigrated.map((doc) => doc.id).join(", "),
      );
    }
    return {
      sourceCount: docs.length,
      createdCount: 0,
      updatedCount: 0,
      unchangedCount: docs.length,
      files: [],
    };
  }
  const indexItems = parsePjrIndex(sourceIndexContent, timeZone);
  const duplicateIndexIds = indexItems
    .map((item) => item.id)
    .filter((id, index, ids) => ids.indexOf(id) !== index);
  if (duplicateIndexIds.length > 0) {
    throw new Error(`Duplicate pjr-index IDs: ${[...new Set(duplicateIndexIds)].join(", ")}`);
  }

  // loadRegisterItems は移行済み個票を優先し、未移行項目だけ旧一覧を読む。これにより、
  // runner がすでに遷移させた item_status を古い一覧行で巻き戻さない。
  const sources = loadRegisterItems(paths);
  if (sources.length !== indexItems.length) {
    throw new Error(
      `Register item count mismatch before migration: index=${indexItems.length}, resolved=${sources.length}`,
    );
  }

  const docsById = new Map(docs.map((doc) => [doc.id, doc]));
  const files: RegisterMigrationFile[] = [];
  let createdCount = 0;
  let updatedCount = 0;
  let unchangedCount = 0;

  for (const source of sources) {
    validateFields({
      type: source.item.type,
      priority: source.item.priority,
      status: source.item.status,
      registeredAt: source.item.registeredAt,
      due: source.item.due,
      completedAt: source.item.completedAt,
    });
    const existing = docsById.get(source.id);
    let filename: string;
    let path: string;
    let originalContent: string | undefined;
    let content: string;

    if (existing) {
      filename = existing.filename;
      path = existing.path;
      originalContent = readFileSync(path, "utf8");
      content = originalContent;

      if (source.source === "index") {
        if (existing.item.title !== source.item.title) {
          content = setRegisterItemTitle(content, tableCellToBody(source.item.title));
        }
        if (existing.item.description !== source.item.description) {
          content = prependRegisterItemDescription(
            content,
            tableCellToBody(source.item.description),
          );
        }
        content = applyRegisterItemFields(content, registerItemFieldsFromItem(source.item));
      }
    } else {
      const topic = migrationTopic(source.item.title);
      filename = `pjr-${source.id.slice("PJR-".length).toLowerCase()}-${topic}.md`;
      path = join(paths.projectRegisterPath, filename);
      if (existsSync(path)) {
        throw new Error(`Migration target already exists: ${path}`);
      }
      const templatePath = join(
        specdojoRootDir(),
        `docs/ja/specdojo/templates/pjr-${source.item.type}-template.md`,
      );
      content = buildRegisterItemContent({
        projectId: paths.projectId,
        displayId: source.item.id,
        topic,
        fields: {
          type: source.item.type,
          title: tableCellToBody(source.item.title),
          description: tableCellToBody(source.item.description),
          priority: source.item.priority,
          status: source.item.status,
          owner: source.item.owner,
          registeredAt: source.item.registeredAt,
          due: source.item.due,
          completedAt: source.item.completedAt,
          conclusion: source.item.conclusion,
        },
        templatePath,
      });
      // 旧一覧のセルでは問題にならなかった `_CAPITAL_CASE_` などを本文へ移すと、
      // markdownlint が underscore emphasis と解釈する。表示値を変えずに規則だけ抑止する。
      if (/_[A-Z][A-Z0-9_]*_/.test(`${source.item.title}\n${source.item.description}`)) {
        content = content.replace(
          /^(---\r?\n[\s\S]*?\r?\n---\r?\n)/,
          "$1\n<!-- markdownlint-disable MD049 -->\n",
        );
      }
    }

    assertMigratedItemMatches(source.item, content, filename);
    if (content === originalContent) {
      unchangedCount++;
    } else {
      files.push({ path, content, originalContent });
      if (originalContent === undefined) createdCount++;
      else updatedCount++;
    }
  }

  return {
    sourceCount: sources.length,
    createdCount,
    updatedCount,
    unchangedCount,
    files,
    sourceIndexPath: paths.pjrIndexPath,
    sourceIndexContent,
  };
}

type StagedMigrationFile = RegisterMigrationFile & {
  stagedPath: string;
  backupPath?: string;
};

// 全出力を同一ディレクトリ内の一時ファイルへ書いてから切り替える。切り替え途中で失敗した
// 場合は既存ファイルと旧一覧を戻し、作成途中の個票を除去して部分適用を残さない。
export function applyRegisterMigrationPlan(plan: RegisterMigrationPlan): void {
  if (plan.files.length === 0 && !plan.sourceIndexPath) return;

  if (plan.sourceIndexPath) {
    if (!existsSync(plan.sourceIndexPath)) {
      throw new Error(`Migration source changed after planning: missing ${plan.sourceIndexPath}`);
    }
    if (readFileSync(plan.sourceIndexPath, "utf8") !== plan.sourceIndexContent) {
      throw new Error(`Migration source changed after planning: ${plan.sourceIndexPath}`);
    }
  }
  for (const file of plan.files) {
    if (file.originalContent === undefined) {
      if (existsSync(file.path)) {
        throw new Error(`Migration target appeared after planning: ${file.path}`);
      }
    } else if (!existsSync(file.path) || readFileSync(file.path, "utf8") !== file.originalContent) {
      throw new Error(`Migration target changed after planning: ${file.path}`);
    }
  }

  const transactionId = randomUUID();
  const staged: StagedMigrationFile[] = [];
  let indexBackupPath: string | undefined;

  try {
    for (const file of plan.files) {
      const stagedPath = join(
        dirname(file.path),
        `.specdojo-migrate-${transactionId}-${basename(file.path)}`,
      );
      staged.push({ ...file, stagedPath });
      writeFileSync(stagedPath, file.content, { encoding: "utf8", flag: "wx" });
    }

    for (const file of staged) {
      if (file.originalContent !== undefined) {
        file.backupPath = `${file.stagedPath}.backup`;
        renameSync(file.path, file.backupPath);
      }
      renameSync(file.stagedPath, file.path);
    }

    if (plan.sourceIndexPath) {
      indexBackupPath = join(
        dirname(plan.sourceIndexPath),
        `.specdojo-migrate-${transactionId}-${basename(plan.sourceIndexPath)}.backup`,
      );
      renameSync(plan.sourceIndexPath, indexBackupPath);
    }
  } catch (error) {
    if (indexBackupPath && existsSync(indexBackupPath) && plan.sourceIndexPath) {
      if (existsSync(plan.sourceIndexPath)) unlinkSync(plan.sourceIndexPath);
      renameSync(indexBackupPath, plan.sourceIndexPath);
    }
    for (const file of [...staged].reverse()) {
      if (existsSync(file.stagedPath)) unlinkSync(file.stagedPath);
      if (file.backupPath && existsSync(file.backupPath)) {
        if (existsSync(file.path)) unlinkSync(file.path);
        renameSync(file.backupPath, file.path);
      } else if (file.originalContent === undefined && existsSync(file.path)) {
        unlinkSync(file.path);
      }
    }
    throw error;
  }

  // バックアップ除去は切り替え完了後に行う。ここで一時ファイルの除去に失敗しても、
  // 正本の切り替え自体は完了しているため migration を巻き戻さない。
  for (const file of staged) {
    if (file.backupPath && existsSync(file.backupPath)) {
      try {
        unlinkSync(file.backupPath);
      } catch {
        // 正本は切り替え済み。一時バックアップは次回の手動清掃対象として残す。
      }
    }
  }
  if (indexBackupPath && existsSync(indexBackupPath)) {
    try {
      unlinkSync(indexBackupPath);
    } catch {
      // 正本は切り替え済み。一時バックアップは次回の手動清掃対象として残す。
    }
  }
}

// ================================
// Derived View Generation
// ================================

function adjustTicketLink(ticket: string, prefix: string): string {
  if (ticket === "-") return ticket;
  return ticket.replace(/\]\(\.\//g, `](${prefix}`);
}

function rebaseItems(items: PjrDisplayItem[], prefix: string): PjrDisplayItem[] {
  return items.map((it) => ({ ...it, ticket: adjustTicketLink(it.ticket, prefix) }));
}

function makeTable(items: PjrDisplayItem[], heading: TableHeading): string {
  const rows = items.map(formatTableRow);
  return [heading.header, heading.separator, ...rows].join("\n");
}

type ViewGroup = { label: string; items: PjrDisplayItem[] };

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

function groupByOwner(items: PjrDisplayItem[]): ViewGroup[] {
  const grouped = new Map<string, PjrDisplayItem[]>();
  for (const item of items) {
    const key = item.owner || "-";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(item);
  }
  return [...grouped.keys()].sort().map((owner) => ({ label: owner, items: grouped.get(owner)! }));
}

// 登録項目一覧（pjr-index）本体を生成する。行は ID 昇順で、列見出しと外枠は template が持つ。
function generateIndexView(items: PjrDisplayItem[], projectId: string): string {
  const template = loadViewTemplate(REGISTER_INDEX_TEMPLATE, projectId);
  return injectRegisterRows(template, items.map(formatTableRow));
}

// 状態別・優先度別・担当者別のビューは、非追跡の生成物になったことで単一ファイルへ
// まとめる理由（共有編集時の git 差分・マージ競合の回避）が無くなったため、
// 軸ごとに別ファイルへ分割する（見やすさを優先する）。
function generateViewsByStatusFile(
  items: PjrDisplayItem[],
  projectId: string,
  heading: TableHeading,
): string {
  const statusGroups = VALID_STATUSES.map((status) => ({
    label: status,
    items: items.filter((it) => it.status === status),
  })).filter((group) => group.items.length > 0);

  const template = loadViewTemplate("pjr-views-by-status-template.md", projectId);
  return injectViewSlots(template, {
    "by-status": renderGroupedTables(statusGroups, 1, heading),
  });
}

function generateViewsByPriorityFile(
  items: PjrDisplayItem[],
  projectId: string,
  heading: TableHeading,
): string {
  const priorityGroups = VALID_PRIORITIES.map((priority) => ({
    label: priority,
    items: items.filter((it) => it.priority === priority),
  }));

  const template = loadViewTemplate("pjr-views-by-priority-template.md", projectId);
  return injectViewSlots(template, {
    "by-priority": renderGroupedTables(priorityGroups, 1, heading),
  });
}

function generateViewsByOwnerFile(
  items: PjrDisplayItem[],
  projectId: string,
  heading: TableHeading,
): string {
  const template = loadViewTemplate("pjr-views-by-owner-template.md", projectId);
  return injectViewSlots(template, {
    "by-owner": renderGroupedTables(groupByOwner(items), 1, heading),
  });
}

function generateTypeFilterView(
  items: PjrDisplayItem[],
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
  // 「登録日」「完了日」は保存された日時をプロジェクトの登録日タイムゾーンへ変換して導出する。
  const items = loadRegisterItems(paths).map((view) =>
    toDisplayItem(view.item, paths.registerDateTimeZone),
  );
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
        path: join(paths.generatedPath, "pjr-views-by-status.md"),
        content: generateViewsByStatusFile(regItems, paths.projectId, heading),
      },
      {
        path: join(paths.generatedPath, "pjr-views-by-priority.md"),
        content: generateViewsByPriorityFile(regItems, paths.projectId, heading),
      },
      {
        path: join(paths.generatedPath, "pjr-views-by-owner.md"),
        content: generateViewsByOwnerFile(regItems, paths.projectId, heading),
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
    for (const item of parsePjrIndex(
      readFileSync(paths.pjrIndexPath, "utf8"),
      paths.registerDateTimeZone,
    )) {
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
  fieldUpdates?: RegisterItemFieldUpdates;
  eventAction: RegisterEventAction;
  eventActor: string;
  eventReason: string;
}): void {
  const ticketPath = opts.view.ticketPath;
  if (!ticketPath) {
    throw new Error(`Item ${opts.view.id} has no ticket file to update`);
  }

  const label = opts.action ?? `→ ${opts.updated.status}`;
  const updates: RegisterItemFieldUpdates = {
    ...registerItemFieldsFromItem(opts.updated),
    ...opts.fieldUpdates,
  };

  if (opts.dryRun) {
    const lines = [`Would update ${ticketPath} (${opts.updated.id} ${label}):`];
    if (opts.title !== undefined) lines.push(`  title: ${opts.title}`);
    if (opts.description !== undefined) lines.push(`  description: ${opts.description}`);
    lines.push(formatRegisterItemFields(updates));
    process.stdout.write(`${lines.join("\n")}\n`);
    return;
  }

  const beforeContent = readFileSync(ticketPath, "utf8");
  let content = beforeContent;
  if (opts.title !== undefined) content = setRegisterItemTitle(content, opts.title);
  if (opts.description !== undefined) {
    content = setRegisterItemDescription(content, opts.description);
  }
  content = applyRegisterItemFields(content, updates);
  const event = buildRegisterEvent({
    beforeContent,
    afterContent: content,
    filename: basename(ticketPath),
    timeZone: opts.paths.registerDateTimeZone,
    action: opts.eventAction,
    actor: opts.eventActor,
    reason: opts.eventReason,
  });
  if (!event) {
    process.stdout.write(`Unchanged: ${ticketPath} (${opts.updated.id})\n`);
    return;
  }
  content = appendRegisterEvent(content, event);
  atomicWriteFile(ticketPath, content);
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

function stripFencedCode(markdown: string): string {
  let fence: { marker: "`" | "~"; length: number } | undefined;

  return markdown
    .split(/(?<=\n)/)
    .map((lineWithEnding) => {
      const line = lineWithEnding.replace(/\r?\n$/, "");
      const lineEnding = lineWithEnding.slice(line.length);

      if (fence) {
        const closing = line.match(/^ {0,3}(`+|~+)[ \t]*$/);
        if (closing && closing[1][0] === fence.marker && closing[1].length >= fence.length) {
          fence = undefined;
        }
        return lineEnding;
      }

      const opening = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
      if (opening && !(opening[1][0] === "`" && opening[2].includes("`"))) {
        fence = { marker: opening[1][0] as "`" | "~", length: opening[1].length };
        return lineEnding;
      }

      return lineWithEnding;
    })
    .join("");
}

function isEscapedMarkdownCharacter(markdown: string, index: number): boolean {
  let backslashes = 0;
  for (let cursor = index - 1; cursor >= 0 && markdown[cursor] === "\\"; cursor--) {
    backslashes++;
  }
  return backslashes % 2 === 1;
}

function findClosingBacktickRun(markdown: string, start: number, length: number): number {
  for (let cursor = start; cursor < markdown.length; ) {
    if (markdown[cursor] !== "`") {
      cursor++;
      continue;
    }

    const runStart = cursor;
    while (markdown[cursor] === "`") cursor++;
    if (cursor - runStart === length && !isEscapedMarkdownCharacter(markdown, runStart)) {
      return runStart;
    }
  }
  return -1;
}

function stripInlineCode(markdown: string): string {
  let result = "";

  for (let cursor = 0; cursor < markdown.length; ) {
    if (markdown[cursor] !== "`" || isEscapedMarkdownCharacter(markdown, cursor)) {
      result += markdown[cursor];
      cursor++;
      continue;
    }

    const runStart = cursor;
    while (markdown[cursor] === "`") cursor++;
    const runLength = cursor - runStart;
    const closing = findClosingBacktickRun(markdown, cursor, runLength);
    if (closing === -1) {
      result += markdown.slice(runStart, cursor);
      continue;
    }

    cursor = closing + runLength;
  }

  return result;
}

// type 固有の必須節が固まっているかの判定。見出し文言（言語依存）に依存せず、
// Markdown のコード範囲を除く本文に記入プレースホルダ `_TODO_` が残っていれば
// 「未確定」とみなす。コード範囲は記法の説明や例示に使えるため判定対象外とする。
function ticketBodyHasTodo(content: string): boolean {
  const { body } = parseSpecdojoDocument(content);
  return stripInlineCode(stripFencedCode(body)).includes("_TODO_");
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

  atomicWriteFile(ticketPath, updated);
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
function renumberRowInContent(content: string, fromId: string, updated: PjrDisplayItem): string {
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
    parsePjrIndex(readFileSync(paths.pjrIndexPath, "utf8"), paths.registerDateTimeZone).some(
      (it) => it.id === fromId,
    );
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
      newIndexContent = renumberRowInContent(
        newIndexContent,
        fromId,
        toDisplayItem(updated, paths.registerDateTimeZone),
      );
    }
  } else if (hasIndexRow) {
    const updated: PjrItem = { ...fromItem, id: toId };
    newIndexContent = renumberRowInContent(
      newIndexContent,
      fromId,
      toDisplayItem(updated, paths.registerDateTimeZone),
    );
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
  actor?: string;
  reason?: string;
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

  if (!dryRun && plan.ticketRename) {
    const ticketWrite = plan.writes.find((write) => write.path === plan.ticketRename?.to);
    if (!ticketWrite)
      throw new Error(`Renumbered ticket content not found: ${plan.ticketRename.to}`);
    const beforeContent = readFileSync(plan.ticketRename.from, "utf8");
    const event = buildRegisterEvent({
      beforeContent,
      afterContent: ticketWrite.content,
      filename: basename(plan.ticketRename.to),
      timeZone: paths.registerDateTimeZone,
      action: "renumber",
      actor: opts.actor?.trim() || "manual",
      reason: opts.reason?.trim() || `renumbered ${fromId} to ${toId}`,
      extraChanges: [{ field: "id", from: fromId, to: toId }],
    });
    if (!event) throw new Error(`Failed to build renumber event for ${fromId}`);
    ticketWrite.content = appendRegisterEvent(ticketWrite.content, event);
  }

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
    atomicWriteFile(write.path, write.content);
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
// Register item creation
// ================================

// register add が個票へ書き込む項目値。タイトル・説明は個票本文（H1・概要）へ、
// それ以外は frontmatter の登録項目フィールドへ入る。
export type RegisterAddFields = {
  type: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  owner: string;
  // 起票・完了は UTC・RFC 3339・秒精度の日時。期限だけは暦日のまま扱う。
  registeredAt: string;
  due: string;
  completedAt: string;
  conclusion: string;
};

// 作成する個票ファイル名と割り当て ID を算出する純粋関数。I/O を持たず、
// フィールド検証と ID 衝突検知だけを行う。ID を省略するとランダムに採番する。
export function planRegisterItem(opts: {
  existingIds: Iterable<string>;
  explicitId?: string;
  fields: RegisterAddFields;
  // 個票ファイル名に使う topic slug。
  topic: string;
}): { assignedId: string; ticketFilename: string } {
  const existing = [...opts.existingIds];
  const assignedId = opts.explicitId?.trim() || generatePjrId(existing);

  validateFields({
    status: opts.fields.status,
    type: opts.fields.type,
    priority: opts.fields.priority,
    registeredAt: opts.fields.registeredAt,
    due: opts.fields.due,
    completedAt: opts.fields.completedAt,
    id: assignedId,
  });

  if (existing.includes(assignedId)) {
    throw new Error(`ID already exists in the project register: ${assignedId}`);
  }

  return { assignedId, ticketFilename: `${assignedId.toLowerCase()}-${opts.topic}.md` };
}

// ================================
// Error Handling & Shared Helpers
// ================================

// register 系コマンドのエラーは Unix/CLI の慣習に合わせて stderr へ書く。
// 正常出力（更新内容・生成パス・警告など）は stdout のまま残し、エラーだけを分離する。
export function printCommandError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(message + "\n");
  process.exitCode = 1;
}

function addProjectOption(cmd: Command): Command {
  return cmd.option("--project <projectId>", "Project id in specdojo.config.json");
}

// CLI で明示された日時オプションを UTC の秒精度へ正規化する。未指定は undefined を返し、
// 呼び出し側の既定値（実行時刻・プレースホルダ）へ委ねる。
function parseRegisterTimestampOption(
  value: string | undefined,
  label: string,
  placeholder: string,
): string | undefined {
  const text = value?.trim();
  if (!text) return undefined;
  if (text === placeholder) return placeholder;
  return normalizeRegisterTimestamp(text, label);
}

// git のパス限定（pathspec）はリポジトリルート起点の POSIX 表記で渡す。
function repoRelativePathspec(repoRoot: string, target: string): string {
  const value = relative(repoRoot, target);
  if (!value || value === ".." || value.startsWith(`..${sep}`)) {
    throw new Error(`Register directory is outside the repository root: ${target}`);
  }
  return value.split(sep).join("/");
}

// `--id PJR-AAAA PJR-BBBB` と `--id PJR-AAAA,PJR-BBBB` の両方を受け付ける。
function parseHistoryIds(values: string[] | undefined): string[] | undefined {
  if (!values || values.length === 0) return undefined;

  const ids: string[] = [];
  for (const value of values.flatMap((entry) => entry.split(/[\s,]+/))) {
    const id = value.trim().toUpperCase();
    if (id === "") continue;
    if (!PJR_ID_RE.test(id)) {
      throw new Error(`Invalid item ID: "${value}". Must match PJR-XXXX`);
    }
    if (!ids.includes(id)) ids.push(id);
  }
  return ids.length > 0 ? ids : undefined;
}

function actionFromLegacyHistory(
  kind: "added" | "updated" | "removed",
  changes: readonly { field: string; from: string; to: string }[],
): RegisterEventAction {
  if (kind === "added") return "add";
  const statusChange = changes.find((change) => change.field === "status");
  const status = statusChange?.to;
  if (
    statusChange &&
    TERMINAL_STATUSES_SET.has(statusChange.from) &&
    !TERMINAL_STATUSES_SET.has(statusChange.to)
  ) {
    return "reopen";
  }
  if (status === "in-progress") return "start";
  if (status === "waiting") return "wait";
  if (status === "review") return "review";
  if (status === "done" || status === "decided") return "close";
  if (status === "rejected") return "reject";
  if (status === "deferred") return "defer";
  const idChange = changes.some((change) => change.field === "id");
  if (idChange) return "renumber";
  return "update";
}

// Git 履歴から復元した1件の変更を Register event へ変換する。状態連鎖を成立させるための
// 接続処理を含むため、移行本体から切り離して単体で検証できるようにしている。
export function legacyHistoryEventToRegisterEvent(
  historyEvent: {
    id: string;
    commit: string;
    date: string;
    author: string;
    subject: string;
    kind: "added" | "updated" | "removed";
    changes: readonly { field: string; from: string; to: string }[];
  },
  context: { isFirst: boolean; currentStatus: string | null; fallbackStatus: string },
): RegisterEventV1 {
  // 過去の revision には、山括弧のエスケープ規約（PJR-B1SJ / PJR-ZWMH）より前に書かれた
  // `<domain>` のようなプレースホルダが素のまま残っている。event へ写すと個票 frontmatter の
  // 検証に落ちるため、現行の規約に合わせてインラインコードで囲んでから記録する。
  const escape = (text: string): string => inlineCodeAnglePlaceholders(text);
  const statusChange = historyEvent.changes.find((change) => change.field === "status");
  // 同じ個票が Git 履歴上で複数回 `added` として現れることがある。worktree のブランチで
  // 作成した個票が統合ブランチへ再度追加された場合などで、走査は両方の commit を見る。
  // 起票は状態連鎖の起点であり1件しか置けないため、2件目以降は追加ではなく更新として扱う。
  const kind = historyEvent.kind === "added" && !context.isFirst ? "updated" : historyEvent.kind;
  // 再追加の差分は「無」との比較になるため status の from が空になる。空のときは直前の
  // event の到達状態へ接続し、状態連鎖が途切れないようにする。
  const fromStatus: string | null =
    kind === "added" ? null : statusChange?.from || context.currentStatus || context.fallbackStatus;
  const toStatus: string = statusChange?.to ?? fromStatus ?? context.fallbackStatus;
  return {
    v: 1,
    id: deterministicRegisterEventId(
      `${historyEvent.commit}\0${historyEvent.id}\0${JSON.stringify(historyEvent.changes)}`,
    ),
    ts: normalizeRegisterTimestamp(historyEvent.date, "legacy event date"),
    action: actionFromLegacyHistory(kind, historyEvent.changes),
    actor: historyEvent.author.trim() || "git-author-unknown",
    from_status: fromStatus,
    to_status: toStatus,
    reason:
      escape(historyEvent.subject.trim()) || `migrated from ${historyEvent.commit.slice(0, 7)}`,
    // 再追加を更新として扱う場合、status の差分は「無 -> open」のまま残ると from_status /
    // to_status と食い違う。接続先の状態に合わせ、実際に変化していなければ差分から落とす。
    changes: historyEvent.changes.flatMap((change) => {
      const from = change.field === "status" ? (fromStatus ?? change.from) : change.from;
      if (change.field === "status" && from === change.to) return [];
      return [
        {
          field: change.field as RegisterEventV1["changes"][number]["field"],
          from: escape(from),
          to: escape(change.to),
        },
      ];
    }),
    legacy_commit: historyEvent.commit,
  };
}

function migrateRegisterEventsFromGit(
  paths: RegisterPaths,
  dryRun: boolean,
): { items: number; events: number; skipped: number; available: boolean } {
  let history: ReturnType<typeof collectRegisterHistoryEvents>;
  try {
    history = collectRegisterHistoryEvents({
      repoRoot: specdojoRootDir(),
      registerPathspec: repoRelativePathspec(specdojoRootDir(), paths.projectRegisterPath),
      timeZone: paths.registerDateTimeZone,
    });
  } catch {
    return { items: 0, events: 0, skipped: 0, available: false };
  }

  const byId = new Map<string, typeof history>();
  for (const event of history) {
    if (event.source === "event" || event.kind === "removed") continue;
    const entries = byId.get(event.id) ?? [];
    entries.push(event);
    byId.set(event.id, entries);
  }

  let itemCount = 0;
  let eventCount = 0;
  let skipped = 0;
  for (const doc of loadRegisterItemDocs(paths.projectRegisterPath)) {
    let content = readFileSync(doc.path, "utf8");
    if (readRegisterEventsFromContent(content, doc.filename).length > 0) {
      skipped++;
      continue;
    }
    const legacyEvents = byId.get(doc.id) ?? [];
    if (legacyEvents.length === 0) continue;

    let currentStatus: string | null = null;
    let appended = 0;
    for (const historyEvent of legacyEvents) {
      const event = legacyHistoryEventToRegisterEvent(historyEvent, {
        isFirst: appended === 0,
        currentStatus,
        fallbackStatus: doc.item.status,
      });
      content = appendRegisterEvent(content, event);
      currentStatus = event.to_status;
      appended++;
    }
    if (appended === 0) continue;
    if (!dryRun) atomicWriteFile(doc.path, content);
    itemCount++;
    eventCount += appended;
  }
  return { items: itemCount, events: eventCount, skipped, available: true };
}

// ================================
// Command Registration
// ================================

export function registerRegisterCommands(program: Command): void {
  const reg = program.command("register").description("Project register (pjr-index.md) commands");

  // --- scaffold ---
  // 一覧は generated/ 配下の派生ビューとして生成する。controls/**/generated は doc-index の
  // 限定的な走査対象なので、一覧自身が個票の part_of と wikilink の解決先になる。
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
    "--registered <datetime>",
    "Registration date-time (RFC 3339 with time zone, or _TODO_; defaults to now in UTC)",
  );
  addCmd.option("--due <date>", "Due date (YYYY-MM-DD, -, or _TODO_)", "_TODO_");
  addCmd.option(
    "--completed <datetime>",
    "Completion date-time (RFC 3339 with time zone, or -)",
    "-",
  );
  addCmd.option("--conclusion <text>", "Conclusion or resolution summary", "-");
  addCmd.option("--id <id>", "Display ID (e.g., PJR-0061); auto-incremented if omitted");
  addCmd.option(
    "--topic <topic>",
    "Topic slug for ticket filename; derived from --title if omitted",
  );
  addCmd.option("--by <actor>", "Actor recorded in the append-only register event");
  addCmd.option("--reason <text>", "Reason recorded in the append-only register event");
  addCmd.option("--force", "Overwrite existing ticket file", false);
  addCmd.option("--dry-run", "Print the generated item file without writing", false);
  addCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);

      const topic = opts.topic?.trim() || slugify(opts.title);
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(topic)) {
        throw new Error(
          `Invalid topic: "${topic}". Must use lowercase letters, numbers, and single hyphens`,
        );
      }

      // 起票日時は明示指定が無ければ実行時刻を採る。明示された場合はタイムゾーン付きの
      // RFC 3339 を受け付け、UTC の秒精度へ正規化してから保存する。
      const registeredAt = parseRegisterTimestampOption(opts.registered, "registered", CELL_TODO);
      const completedAt = parseRegisterTimestampOption(opts.completed, "completed", CELL_NONE);

      const fields: RegisterAddFields = {
        type: opts.type,
        title: opts.title,
        description: opts.description,
        priority: opts.priority,
        status: opts.status,
        owner: opts.owner,
        registeredAt: registeredAt ?? nowUtcTimestamp(),
        due: opts.due,
        completedAt: completedAt ?? CELL_NONE,
        conclusion: opts.conclusion,
      };
      const templatePath = join(
        specdojoRootDir(),
        `docs/ja/specdojo/templates/pjr-${opts.type}-template.md`,
      );

      const { assignedId: displayId, ticketFilename } = planRegisterItem({
        existingIds: loadRegisterItems(paths).map((view) => view.id),
        explicitId: opts.id?.trim() || undefined,
        fields,
        topic,
      });

      const ticketPath = join(paths.projectRegisterPath, ticketFilename);
      let content = buildRegisterItemContent({
        projectId: paths.projectId,
        displayId,
        topic,
        fields,
        templatePath,
      });
      const addEvent = buildRegisterEvent({
        afterContent: content,
        filename: ticketFilename,
        timeZone: paths.registerDateTimeZone,
        action: "add",
        actor: registerEventActor(opts),
        reason: opts.reason?.trim() || "item added",
      });
      if (!addEvent) throw new Error(`Failed to build add event for ${displayId}`);
      content = appendRegisterEvent(content, addEvent);

      if (opts.dryRun) {
        process.stdout.write(`Would create ${ticketPath}:\n${content}\n`);
        return;
      }

      if (!opts.force && existsSync(ticketPath)) {
        throw new Error(`Item file already exists (use --force to overwrite): ${ticketPath}`);
      }

      mkdirSync(paths.projectRegisterPath, { recursive: true });
      atomicWriteFile(ticketPath, content);
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
  closeCmd.option(
    "--completed <datetime>",
    "Completion date-time (RFC 3339 with time zone; defaults to now in UTC)",
  );
  closeCmd.option("--by <actor>", "Actor recorded in the append-only register event");
  closeCmd.option("--reason <text>", "Reason recorded in the append-only register event");
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

      const completedAt =
        parseRegisterTimestampOption(opts.completed, "completed", CELL_NONE) ?? nowUtcTimestamp();
      if (completedAt === CELL_NONE) {
        throw new Error(
          `Invalid completed: "${opts.completed}". A completion date-time is required`,
        );
      }

      const updated: PjrItem = {
        ...item,
        status: targetStatus,
        completedAt,
        ...(opts.conclusion !== undefined ? { conclusion: opts.conclusion } : {}),
      };
      applyItemUpdate({
        paths,
        view,
        updated,
        dryRun: opts.dryRun,
        eventAction: "close",
        eventActor: registerEventActor(opts),
        eventReason: opts.reason?.trim() || opts.conclusion?.trim() || `closed as ${targetStatus}`,
      });
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
  rejectCmd.option(
    "--completed <datetime>",
    "Rejection date-time (RFC 3339 with time zone; defaults to now in UTC)",
  );
  rejectCmd.option("--by <actor>", "Actor recorded in the append-only register event");
  rejectCmd.option("--reason <text>", "Reason recorded in the append-only register event");
  rejectCmd.option("--dry-run", "Print change without writing", false);
  rejectCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);
      const view = loadItemForUpdate(paths, opts.id, "require-active");
      const item = view.item;

      const completedAt =
        parseRegisterTimestampOption(opts.completed, "completed", CELL_NONE) ?? nowUtcTimestamp();
      if (completedAt === CELL_NONE) {
        throw new Error(
          `Invalid completed: "${opts.completed}". A rejection date-time is required`,
        );
      }

      const updated: PjrItem = {
        ...item,
        status: "rejected",
        completedAt,
        ...(opts.conclusion !== undefined ? { conclusion: opts.conclusion } : {}),
      };
      applyItemUpdate({
        paths,
        view,
        updated,
        dryRun: opts.dryRun,
        eventAction: "reject",
        eventActor: registerEventActor(opts),
        eventReason: opts.reason?.trim() || opts.conclusion?.trim() || "item rejected",
      });
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
  deferCmd.option("--by <actor>", "Actor recorded in the append-only register event");
  deferCmd.option("--reason <text>", "Reason recorded in the append-only register event");
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
      applyItemUpdate({
        paths,
        view,
        updated,
        dryRun: opts.dryRun,
        eventAction: "defer",
        eventActor: registerEventActor(opts),
        eventReason: opts.reason?.trim() || opts.conclusion?.trim() || "item deferred",
      });
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
  reopenCmd.option("--by <actor>", "Actor recorded in the append-only register event");
  reopenCmd.option("--reason <text>", "Reason recorded in the append-only register event");
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

      // reopen は完了日時のキーを取り除き、活動中の項目として扱えるようにする。
      const updated: PjrItem = { ...item, status: opts.status, completedAt: CELL_NONE };
      applyItemUpdate({
        paths,
        view,
        updated,
        dryRun: opts.dryRun,
        eventAction: "reopen",
        eventActor: registerEventActor(opts),
        eventReason: opts.reason?.trim() || `reopened as ${opts.status}`,
      });
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- start ---
  const startCmd = reg.command("start").description("Set item status to in-progress");
  addProjectOption(startCmd);
  startCmd.requiredOption("--id <id>", "Item ID (PJR-XXXX)");
  startCmd.option("--by <actor>", "Actor recorded in the append-only register event");
  startCmd.option("--reason <text>", "Reason recorded in the append-only register event");
  startCmd.option("--dry-run", "Print change without writing", false);
  startCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);
      const view = loadItemForUpdate(paths, opts.id, "require-active");
      const item = view.item;
      const updated: PjrItem = { ...item, status: "in-progress" };
      applyItemUpdate({
        paths,
        view,
        updated,
        dryRun: opts.dryRun,
        eventAction: "start",
        eventActor: registerEventActor(opts),
        eventReason: opts.reason?.trim() || "work started",
      });
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- wait ---
  const waitCmd = reg.command("wait").description("Set item status to waiting");
  addProjectOption(waitCmd);
  waitCmd.requiredOption("--id <id>", "Item ID (PJR-XXXX)");
  waitCmd.option("--reason <text>", "Reason for waiting");
  waitCmd.option("--conclusion <text>", "Deprecated alias for --reason");
  waitCmd.option("--by <actor>", "Actor recorded in the append-only register event");
  waitCmd.option("--dry-run", "Print change without writing", false);
  waitCmd.action((opts) => {
    try {
      if (opts.reason !== undefined && opts.conclusion !== undefined) {
        throw new Error("Specify only one of --reason or --conclusion");
      }
      const paths = resolveRegisterPaths(opts);
      const view = loadItemForUpdate(paths, opts.id, "require-active");
      const item = view.item;
      const reason = (opts.reason ?? opts.conclusion)?.trim();
      if (reason !== undefined && reason === "") {
        throw new Error("Waiting reason must not be empty");
      }
      const updated: PjrItem = {
        ...item,
        status: "waiting",
      };
      applyItemUpdate({
        paths,
        view,
        updated,
        dryRun: opts.dryRun,
        ...(reason !== undefined
          ? { fieldUpdates: { block_reason: inlineCodeAnglePlaceholders(reason) } }
          : {}),
        eventAction: "wait",
        eventActor: registerEventActor(opts),
        eventReason: reason || "item waiting",
      });
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- review ---
  const reviewCmd = reg.command("review").description("Set item status to review");
  addProjectOption(reviewCmd);
  reviewCmd.requiredOption("--id <id>", "Item ID (PJR-XXXX)");
  reviewCmd.option("--by <actor>", "Actor recorded in the append-only register event");
  reviewCmd.option("--reason <text>", "Reason recorded in the append-only register event");
  reviewCmd.option("--dry-run", "Print change without writing", false);
  reviewCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);
      const view = loadItemForUpdate(paths, opts.id, "require-active");
      const item = view.item;
      const updated: PjrItem = { ...item, status: "review" };
      applyItemUpdate({
        paths,
        view,
        updated,
        dryRun: opts.dryRun,
        eventAction: "review",
        eventActor: registerEventActor(opts),
        eventReason: opts.reason?.trim() || "ready for review",
      });
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
  updateCmd.option("--conclusion <text>", "Update conclusion or use - to remove it");
  updateCmd.option("--by <actor>", "Actor recorded in the append-only register event");
  updateCmd.option("--reason <text>", "Reason recorded in the append-only register event");
  updateCmd.option("--dry-run", "Print change without writing", false);
  updateCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);
      const view = loadItemForUpdate(paths, opts.id);
      const item = view.item;

      const hasUpdates = ["title", "description", "priority", "owner", "due", "conclusion"].some(
        (k) => opts[k] !== undefined,
      );
      if (!hasUpdates) {
        throw new Error(
          "At least one field option must be specified (--title, --description, --priority, --owner, --due, --conclusion)",
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
        ...(opts.conclusion !== undefined ? { conclusion: opts.conclusion } : {}),
      };
      applyItemUpdate({
        paths,
        view,
        updated,
        dryRun: opts.dryRun,
        action: "fields updated",
        ...(opts.title !== undefined ? { title: opts.title } : {}),
        ...(opts.description !== undefined ? { description: opts.description } : {}),
        eventAction: "update",
        eventActor: registerEventActor(opts),
        eventReason: opts.reason?.trim() || "fields updated",
      });
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- migrate ---
  const migrateCmd = reg
    .command("migrate")
    .description(
      "Migrate legacy register data (pjr-index rows and registered_on / completed_on dates)",
    );
  addProjectOption(migrateCmd);
  migrateCmd.option("--dry-run", "Validate and print the migration summary without writing", false);
  migrateCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);
      const plan = planRegisterMigration(paths);
      const summary =
        `items=${plan.sourceCount}, create=${plan.createdCount}, update=${plan.updatedCount}, ` +
        `unchanged=${plan.unchangedCount}`;

      if (opts.dryRun) {
        process.stdout.write(`Would migrate register items: ${summary}\n`);
        if (plan.sourceIndexPath) {
          process.stdout.write(`Would remove legacy index: ${plan.sourceIndexPath}\n`);
        }
      } else {
        applyRegisterMigrationPlan(plan);
        process.stdout.write(`Migrated register items: ${summary}\n`);
        if (plan.sourceIndexPath) {
          process.stdout.write(`Removed legacy index: ${plan.sourceIndexPath}\n`);
        }
      }

      // 旧日付キーの移行は個票が正本になった後の状態を入力にするため、行の個票化より後に行う。
      const timestampPlan = planRegisterTimestampMigration({
        projectRegisterPath: paths.projectRegisterPath,
        timeZone: paths.registerDateTimeZone,
        resolveGitTimestamps: createGitTimestampResolver(specdojoRootDir()),
      });
      const timestampSummary = summarizeTimestampMigration(timestampPlan);

      if (opts.dryRun) {
        const eventMigration = migrateRegisterEventsFromGit(paths, true);
        const eventSummary = eventMigration.available
          ? `items=${eventMigration.items}, events=${eventMigration.events}, skipped=${eventMigration.skipped}`
          : "unavailable (Git history not found; legacy fallback remains active)";
        process.stdout.write(`Would migrate register timestamps: ${timestampSummary}\n`);
        process.stdout.write(`Would migrate register events: ${eventSummary}\n`);
        return;
      }

      for (const file of timestampPlan.files) {
        writeFileSync(file.path, file.content, "utf8");
      }
      process.stdout.write(`Migrated register timestamps: ${timestampSummary}\n`);
      const eventMigration = migrateRegisterEventsFromGit(paths, false);
      const eventSummary = eventMigration.available
        ? `items=${eventMigration.items}, events=${eventMigration.events}, skipped=${eventMigration.skipped}`
        : "unavailable (Git history not found; legacy fallback remains active)";
      process.stdout.write(`Migrated register events: ${eventSummary}\n`);

      for (const view of writeDerivedViews(paths, "all")) {
        process.stdout.write(`Generated: ${view.path}\n`);
      }
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

      const validation = validateRegisterItemDocs(paths.projectRegisterPath);
      const eventErrors = validateRegisterEventDocs(
        paths.projectRegisterPath,
        paths.registerDateTimeZone,
      );
      if (validation.errors.length > 0 || eventErrors.length > 0) {
        throw new Error(
          `Invalid register item files:\n${[...validation.errors, ...eventErrors].join("\n")}`,
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

  // --- history ---
  // 新しい変更は個票内の追記型 event、event 導入前の変更は Git 履歴から再構成する。
  const historyCmd = reg
    .command("history")
    .description("Show register item changes from append-only events and legacy Git history");
  addProjectOption(historyCmd);
  historyCmd.option("--since <date>", "Include commits on or after this date (YYYY-MM-DD)");
  historyCmd.option("--until <date>", "Include commits on or before this date (YYYY-MM-DD)");
  historyCmd.option(
    "--id <id...>",
    "Limit output to these item IDs (PJR-XXXX; space/comma separated)",
  );
  historyCmd.option(
    "--status-only",
    "Show only additions, removals, and status transitions",
    false,
  );
  historyCmd.option("--limit <count>", "Maximum number of commits to inspect");
  historyCmd.option("--json", "Print events as JSON", false);
  historyCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);
      const ids = parseHistoryIds(opts.id);
      const limit = opts.limit === undefined ? undefined : Number(opts.limit);

      const events = collectRegisterHistoryEvents({
        repoRoot: specdojoRootDir(),
        registerPathspec: repoRelativePathspec(specdojoRootDir(), paths.projectRegisterPath),
        since: opts.since?.trim() || undefined,
        until: opts.until?.trim() || undefined,
        limit,
        ids,
        statusOnly: Boolean(opts.statusOnly),
        timeZone: paths.registerDateTimeZone,
      });

      if (opts.json) {
        process.stdout.write(`${JSON.stringify(events, null, 2)}\n`);
        return;
      }
      if (events.length === 0) {
        process.stdout.write("No register item changes found for the given range.\n");
        return;
      }

      process.stdout.write(`${formatRegisterHistoryEvents(events)}\n`);
      const itemCount = new Set(events.map((event) => event.id)).size;
      const gitCommitCount = new Set(
        events.filter((event) => event.source !== "event").map((event) => event.commit),
      ).size;
      const storedEventCount = events.filter((event) => event.source === "event").length;
      process.stdout.write(
        `events=${events.length} items=${itemCount} stored=${storedEventCount} legacy_commits=${gitCommitCount}\n`,
      );
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- renumber ---
  const renumberCmd = reg
    .command("renumber")
    .description("Resolve a random PJR-ID collision by moving one item to an unused ID");
  addProjectOption(renumberCmd);
  renumberCmd.requiredOption("--id <id>", "Current item ID (PJR-XXXX)");
  renumberCmd.requiredOption("--to <id>", "Target unused ID (PJR-XXXX)");
  renumberCmd.option("--by <actor>", "Actor recorded in the append-only register event");
  renumberCmd.option("--reason <text>", "Reason recorded in the append-only register event");
  renumberCmd.option("--dry-run", "Print planned changes without writing", false);
  renumberCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);
      renumberPjrItem({
        paths,
        fromId: opts.id,
        toId: opts.to,
        dryRun: opts.dryRun,
        actor: registerEventActor(opts),
        reason: opts.reason,
      });
    } catch (error) {
      printCommandError(error);
    }
  });
}
