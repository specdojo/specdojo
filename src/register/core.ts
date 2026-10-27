import { randomInt, randomUUID } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { inlineCodeAnglePlaceholders } from "../shared/text.js";
import { appendRegisterEvent, registerEventFilePath, type RegisterEventV1 } from "./events.js";
import {
  REGISTER_TIMESTAMP_RE,
  resolveRegisterDateTimeZone,
  timestampFromDateInTimeZone,
} from "./date.js";
import {
  applyRegisterItemFields,
  CELL_NONE,
  CELL_TODO,
  isPlaceholderCell,
  PJR_ID_ALPHABET,
  PJR_ID_RE,
  registerItemFieldsFromItem,
  setRegisterItemDescription,
  toCell,
  VALID_PRIORITIES,
  VALID_STATUSES,
  VALID_TYPES,
  type PjrDisplayItem,
  type PjrItem,
} from "./item.js";
import type { RegisterAddFields } from "./command-types.js";
import {
  getProjectExecutionPath,
  getProjectRegisterPath,
  loadConfig,
  loadEnv,
  loadMemberRoster,
  resolveRegisterActor,
  specdojoRootDir,
} from "../shared/specdojo-config.js";
import { flattenTemplateFrontmatter } from "../docs/template-frontmatter.js";

// ================================
// Types
// ================================

export type RegisterPaths = {
  projectId: string;
  projectRegisterPath: string;
  // CLI で解決した project の execution path。単体の生成・検証 helper では不要。
  executionPath?: string;
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

export function registerEventActor(opts: { by?: string; project?: string }): string {
  const actor = opts.by?.trim() || process.env.SPECDOJO_ACTOR?.trim() || "SpecDojo";
  const { config } = loadConfig();
  if (!config) throw new Error("register commands require specdojo.config.json");
  const projectId =
    opts.project?.trim() ||
    process.env.SPECDOJO_PROJECT?.trim() ||
    Object.keys(config.projects)[0] ||
    "";
  const project = config.projects[projectId];
  if (!project) throw new Error(`Unknown project: ${projectId}`);
  return resolveRegisterActor(actor, loadMemberRoster(specdojoRootDir(), project));
}

export function atomicWriteFile(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = join(dirname(path), `.${basename(path)}.${randomUUID()}.tmp`);
  try {
    writeFileSync(temporary, content, { encoding: "utf8", flag: "wx" });
    renameSync(temporary, path);
  } finally {
    if (existsSync(temporary)) unlinkSync(temporary);
  }
}

export function findMarkdownReferenceFiles(root: string): string[] {
  const markdownFiles: string[] = [];
  const docsJaPath = join(resolve(root), "docs", "ja");

  function walk(directory: string): void {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.name.startsWith(".")) continue;

      const entryPath = join(directory, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== "generated") walk(entryPath);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        markdownFiles.push(entryPath);
      }
    }
  }

  if (existsSync(docsJaPath)) walk(docsJaPath);
  return markdownFiles.sort((left, right) => left.localeCompare(right));
}

export function prepareRegisterEventFile(
  projectRegisterPath: string,
  displayId: string,
  event: RegisterEventV1,
): { path: string; content: string } {
  const eventPath = registerEventFilePath(projectRegisterPath, displayId);
  const content = existsSync(eventPath) ? readFileSync(eventPath, "utf8") : undefined;
  return { path: eventPath, content: appendRegisterEvent(content, event) };
}

// ================================
// Constants
// ================================

// PJR-ID の乱数部分の桁数。
const PJR_ID_LENGTH = 4;

// 個票ファイル名・文書 ID の論点部分。先頭・末尾や連続ハイフンを許さない。
export const REGISTER_TOPIC_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// 生成した ID が偶然含みうる不適切語の簡易ブロックリスト（4 文字, 大文字, 曖昧文字除外後）。
// 一致した候補は採用せず再抽選する。曖昧文字（I/L/O/U）を含む語は生成されえないため載せない。
const PJR_ID_BLOCKLIST = new Set<string>(["CRAP", "DAMN", "TWAT", "WANK", "SHAG", "FART"]);

// 個票 Frontmatter の文書成熟度（specdojo:pjr-rulebook「個票 status の遷移基準」）。
// pjr-index の処理状態（VALID_STATUSES）とは別の状態軸として扱う。
export const VALID_TICKET_STATUSES = ["draft", "ready", "deprecated"] as const;
export type TicketStatus = (typeof VALID_TICKET_STATUSES)[number];

// 登録項目一覧テーブルは specdojo:pjr-rulebook「本文構成」で章 1 に固定される。
// 見出し文言（言語依存）ではなく章番号でセクションを特定し、i18n 非依存にする。
export const REGISTER_SECTION_RE = /^## 1\.\s/;

// 登録項目一覧（pjr-index）の生成 template。外枠（H1・注記・章見出し）と章 1 の
// 列見出しを所有し、生成処理は行だけを差し込む。列名を定数として持たないことで、
// 一覧の言語は template 側の差し替えだけで切り替えられる。
export const REGISTER_INDEX_TEMPLATE = "pjr-index-template.md";

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
    executionPath: resolve(baseDir, getProjectExecutionPath(project)),
    pjrIndexPath: join(absRegisterPath, "pjr-index.md"),
    generatedPath: join(absRegisterPath, "generated"),
    controlsGeneratedPath: join(dirname(absRegisterPath), "generated"),
    registerDateTimeZone: resolveRegisterDateTimeZone(config, projectId),
  };
}

// ================================
// Markdown Table Parsing
// ================================

export function parseTableCells(line: string): string[] {
  // Replace escaped pipes with placeholder before splitting
  const PIPE = "\x01";
  const normalized = line.replace(/\\\|/g, PIPE);
  const cells = normalized.split("|").map((c) => c.replace(new RegExp(PIPE, "g"), "\\|").trim());
  // Remove first and last empty elements (line starts and ends with |)
  return cells.slice(1, cells.length - 1);
}

export function isTableSeparator(line: string): boolean {
  return line.startsWith("|") && /\|\s*---+\s*\|/.test(line);
}

// 生成ビューが使うテーブルの見出し行と区切り行。
// 定数として持たず登録簿一覧 template から採用し、列名の言語に依存しない。
export type TableHeading = { header: string; separator: string };

// 章 1 の登録項目一覧テーブルの位置。separatorIndex は行配列上の区切り行の添字で、
// 行を差し込む基準になる。
type RegisterTableLocation = { heading: TableHeading; separatorIndex: number };

export function locateRegisterTable(lines: string[]): RegisterTableLocation | undefined {
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

export function formatTableRow(item: PjrDisplayItem): string {
  // frontmatter・本文由来を問わず、表へ展開する全セルを同じ規則で無害化する。
  // 列区切りの `|`、強調記号、改行をエスケープし、素の URL を autolink、山括弧
  // プレースホルダをインラインコード化する。既存の Markdown 記法は変換処理が保持するため、
  // 再生成しても二重に囲まれない。
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
    item.dependsOn?.join(", ") || CELL_NONE,
  ]
    .map(toCell)
    .map(inlineCodeAnglePlaceholders);
  return `| ${cells.join(" | ")} |`;
}

// ================================
// Validation
// ================================

export function validateFields(opts: {
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

export function slugify(text: string): string {
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

// 日本語主体のタイトルから ASCII の断片だけを topic にすると、個票名から内容を
// 推測できなくなる。区切り記号は数えず、文字・数字の過半が非 ASCII で、抽出できた
// ASCII 語が 1 語だけの場合を「意味を失う可能性がある既定 topic」とみなす。
export function derivedTopicNeedsWarning(title: string, topic: string): boolean {
  const asciiWords = title.match(/[a-z0-9]+/giu) ?? [];
  if (topic === "item" && asciiWords.length === 0) return true;
  if (asciiWords.length !== 1) return false;

  const lettersAndNumbers = [...title].filter((char) => /[\p{L}\p{N}]/u.test(char));
  const asciiCount = lettersAndNumbers.filter((char) => /[a-z0-9]/iu.test(char)).length;
  return lettersAndNumbers.length - asciiCount > asciiCount;
}

export function printDerivedTopicWarning(topic: string): void {
  process.stdout.write(
    `Warning: derived topic "${topic}" may not describe the title. ` +
      "Specify --topic with a lowercase, hyphen-separated English slug, or change it later " +
      "with register update --topic.\n",
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
  const safeTitle = inlineCodeAnglePlaceholders(opts.title);
  content = content.replace(
    new RegExp(titlePh.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
    safeTitle,
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
      ...(opts.fields.difficulty ? { difficulty: opts.fields.difficulty } : {}),
      owner: opts.fields.owner,
      registeredAt: opts.fields.registeredAt,
      due: opts.fields.due,
      completedAt: opts.fields.completedAt,
      conclusion: opts.fields.conclusion,
      ticket: "-",
      ...(opts.fields.approach ? { approach: opts.fields.approach } : {}),
      ...(opts.fields.targets ? { targets: opts.fields.targets } : {}),
      ...(opts.fields.targetPath ? { targetPath: opts.fields.targetPath } : {}),
      ...(opts.fields.targetRulebook ? { targetRulebook: opts.fields.targetRulebook } : {}),
      ...(opts.fields.sources ? { sources: opts.fields.sources } : {}),
      ...(opts.fields.derivedFrom ? { derivedFrom: opts.fields.derivedFrom } : {}),
      ...(opts.fields.dependsOn ? { dependsOn: opts.fields.dependsOn } : {}),
    }),
  );
}
