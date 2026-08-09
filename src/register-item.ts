// 登録項目（PJR-XXXX）の正本は個票ファイル `pjr-XXXX-<topic>.md` の frontmatter である
// （register-item-frontmatter.schema.yaml）。本モジュールは個票の読み取り・派生値の導出・
// frontmatter の書き込みを担い、pjr-index の表は生成される一覧ビューとして扱う。
//
// 表示 ID・タイトル・説明は frontmatter に重複させず、`id` / H1 / 本文から導出する。

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";

// ================================
// Types & Constants
// ================================

// 一覧ビュー1行分の値。frontmatter の省略キーは、表示用プレースホルダ（`-` / `_TODO_`）へ
// 変換してから格納する。
export type PjrItem = {
  id: string;
  status: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  owner: string;
  registered: string;
  due: string;
  completed: string;
  conclusion: string;
  ticket: string;
};

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

export const TERMINAL_STATUSES_SET = new Set(["done", "decided", "rejected", "deferred"]);

// PJR-ID の乱数部分に使う 32 文字セット。曖昧文字（`I` / `L` / `O` / `U`）を除いた
// 英大文字（単一ケース）と数字で構成し、目視・手入力時の誤読を避ける。
export const PJR_ID_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

// PJR-ID の書式。旧来の数字4桁（例: `PJR-0163`）も 0-9 が集合に含まれるため引き続き一致する。
export const PJR_ID_RE = /^PJR-[0-9ABCDEFGHJKMNPQRSTVWXYZ]{4}$/;

// 個票ファイル名 `pjr-XXXX-<topic>.md`。ID 部分は PJR-ID の 32 文字セットの小文字表記。
const TICKET_FILENAME_RE = /^pjr-([0-9abcdefghjkmnpqrstvwxyz]{4})-[a-z0-9-]+\.md$/;

// 表示用プレースホルダ。値未定は frontmatter のキー省略で表し、一覧に出す時だけ補う。
export const CELL_NONE = "-";
export const CELL_TODO = "_TODO_";

// optional field を明示的に削除する内部値。`due_on: null` は「期限なし」を表すため、
// キー削除と YAML null を区別する必要がある。
export const REMOVE_REGISTER_ITEM_FIELD = Symbol("remove-register-item-field");

// 個票 frontmatter が持つ登録項目フィールド。値 null は「キーを削除する」を意味する。
export type RegisterItemFieldUpdates = {
  item_type?: string | typeof REMOVE_REGISTER_ITEM_FIELD;
  item_status?: string | typeof REMOVE_REGISTER_ITEM_FIELD;
  priority?: string | typeof REMOVE_REGISTER_ITEM_FIELD;
  owner?: string | null | typeof REMOVE_REGISTER_ITEM_FIELD;
  registered_on?: string | null | typeof REMOVE_REGISTER_ITEM_FIELD;
  due_on?: string | null | typeof REMOVE_REGISTER_ITEM_FIELD;
  completed_on?: string | null | typeof REMOVE_REGISTER_ITEM_FIELD;
  conclusion?: string | null | typeof REMOVE_REGISTER_ITEM_FIELD;
};

export type RegisterItemDoc = {
  id: string;
  path: string;
  filename: string;
  item: PjrItem;
  // 登録項目フィールド（item_status）が frontmatter にあるか。未移行の個票は false。
  hasRegisterFields: boolean;
};

export type RegisterItemValidationResult = {
  errors: string[];
};

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

// frontmatter の specdojo 名前空間で使うキー順。書き戻しのたびに同じ並びへ整えて、
// 生成物としての差分を安定させる。表に無いキーは末尾へ元の順序で残す。
const SPECDOJO_KEY_ORDER = [
  "id",
  "type",
  "status",
  "rulebook",
  "part_of",
  "based_on",
  "item_type",
  "item_status",
  "priority",
  "owner",
  "registered_on",
  "due_on",
  "completed_on",
  "conclusion",
];

// ================================
// Derivation helpers
// ================================

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

// 一覧の行順は表示 ID の昇順に固定する。localeCompare は ICU の照合順（環境・ロケール差）に
// 依存するため、生成物の再現性を保つために code unit 比較で並べ替える。
export function compareRegisterItemIds(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

// 個票ファイル名から表示 ID（PJR-XXXX）を取り出す。命名規約に合わない名前は undefined。
export function displayIdFromTicketFilename(filename: string): string | undefined {
  const match = TICKET_FILENAME_RE.exec(filename);
  return match ? `PJR-${match[1].toUpperCase()}` : undefined;
}

// 一覧の「個票」セル（`[pjr-xxxx-topic](./pjr-xxxx-topic.md)`）を組み立てる。
export function ticketRefCell(filename: string): string {
  return `[${filename.replace(/\.md$/, "")}](./${filename})`;
}

// 表セルへ埋め込むために1行化し、列区切りの `|` をエスケープする。
function toCell(text: string): string {
  return text.replace(/\r?\n/g, " ").replace(/\s+/g, " ").replace(/\|/g, "\\|").trim();
}

// H1（`# PJR-XXXX タイトル`）からタイトルを導出する。表示 ID の接頭辞は取り除く。
export function titleFromBody(body: string, id: string): string {
  const match = body.match(/^#\s+(.+)$/m);
  if (!match) return CELL_TODO;
  const heading = match[1].trim();
  const withoutId = heading.replace(new RegExp(`^${id}\\s+`, "i"), "").trim();
  return toCell(withoutId || heading) || CELL_TODO;
}

// 本文から説明を導出する。最初の `##` 見出し（`## 1. 概要` など）直後の段落を採用し、
// 未記入プレースホルダ（`_TODO_` 始まり）はそのまま `_TODO_` として扱う。
export function descriptionFromBody(body: string): string {
  const lines = body.split(/\r?\n/);
  let sectionIndex = lines.findIndex((line) => /^##\s/.test(line));
  if (sectionIndex === -1) {
    // 章が無い個票は H1 直後の段落を説明とみなす。
    sectionIndex = lines.findIndex((line) => /^#\s/.test(line));
    if (sectionIndex === -1) return CELL_TODO;
  }

  const paragraph: string[] = [];
  for (const line of lines.slice(sectionIndex + 1)) {
    if (/^#{1,4}\s/.test(line)) break;
    if (line.trim() === "") {
      if (paragraph.length > 0) break;
      continue;
    }
    paragraph.push(line.trim());
  }
  if (paragraph.length === 0) return CELL_TODO;

  const text = toCell(paragraph.join(" "));
  if (text.startsWith(CELL_TODO)) return CELL_TODO;
  return text;
}

// ================================
// Reading
// ================================

// 個票の内容から一覧1行分の値と、登録項目フィールドの有無を導出する。
// ファイル名から ID を導出できない（命名規約外の）ファイルは undefined を返す。
export function readRegisterItemContent(
  content: string,
  filename: string,
): { id: string; item: PjrItem; hasRegisterFields: boolean } | undefined {
  const id = displayIdFromTicketFilename(filename);
  if (!id) return undefined;

  const match = content.match(FRONTMATTER_RE);
  const body = match ? (match[2] ?? "") : content;
  let fields: Record<string, unknown> = {};
  if (match) {
    let parsed: unknown;
    try {
      parsed = yaml.load(match[1]);
    } catch {
      parsed = undefined;
    }
    if (isRecord(parsed) && isRecord(parsed.specdojo)) fields = parsed.specdojo;
  }

  const item: PjrItem = {
    id,
    status: asString(fields.item_status) ?? "open",
    title: titleFromBody(body, id),
    description: descriptionFromBody(body),
    type: asString(fields.item_type) ?? CELL_TODO,
    priority: asString(fields.priority) ?? "medium",
    owner: asString(fields.owner) ?? CELL_TODO,
    registered: asString(fields.registered_on) ?? CELL_TODO,
    due:
      fields.due_on === null
        ? CELL_NONE
        : (asString(fields.due_on) ??
          (Object.prototype.hasOwnProperty.call(fields, "due_on") ? CELL_NONE : CELL_TODO)),
    completed: asString(fields.completed_on) ?? CELL_NONE,
    conclusion: asString(fields.conclusion) ?? CELL_NONE,
    ticket: ticketRefCell(filename),
  };

  return { id, item, hasRegisterFields: asString(fields.item_status) !== undefined };
}

// 登録簿ディレクトリ直下の個票ファイルを走査し、ID 昇順で返す。走査順（readdir の列挙順）は
// 結果に影響しない。一覧本体（pjr-index.md）と生成ビュー（generated/）は対象外。
export function loadRegisterItemDocs(projectRegisterPath: string): RegisterItemDoc[] {
  if (!existsSync(projectRegisterPath)) return [];

  const docs: RegisterItemDoc[] = [];
  for (const entry of readdirSync(projectRegisterPath, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    if (!displayIdFromTicketFilename(entry.name)) continue;
    const path = join(projectRegisterPath, entry.name);
    const parsed = readRegisterItemContent(readFileSync(path, "utf8"), entry.name);
    if (!parsed) continue;
    docs.push({
      id: parsed.id,
      path,
      filename: entry.name,
      item: parsed.item,
      hasRegisterFields: parsed.hasRegisterFields,
    });
  }

  return docs.sort((a, b) => compareRegisterItemIds(a.id, b.id));
}

// 個票正本を横断して検証する。frontmatter の単票スキーマでは表現できない、表示 ID の一意性と
// ファイル名・frontmatter ID の対応をここで保証する。エディタでは .remarkrc.yaml の schema rule が
// 単票の enum / 必須項目を検証し、CI では register build がこの検証を実行する。
export function validateRegisterItemDocs(
  projectRegisterPath: string,
): RegisterItemValidationResult {
  if (!existsSync(projectRegisterPath)) return { errors: [] };

  const errors: string[] = [];
  const ids = new Map<string, string>();
  const entries = readdirSync(projectRegisterPath, { withFileTypes: true }).sort((a, b) =>
    a.name === b.name ? 0 : a.name < b.name ? -1 : 1,
  );
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const displayId = displayIdFromTicketFilename(entry.name);
    if (!displayId) continue;

    const filePath = join(projectRegisterPath, entry.name);
    const content = readFileSync(filePath, "utf8");
    const match = content.match(FRONTMATTER_RE);
    let frontmatterId: string | undefined;
    if (match) {
      try {
        const parsed = yaml.load(match[1]);
        if (isRecord(parsed) && isRecord(parsed.specdojo)) {
          frontmatterId = asString(parsed.specdojo.id);
        }
      } catch {
        // YAML の構文エラー自体は frontmatter schema が報告する。ここでは対応検証だけを担う。
      }
    }

    const expectedLocalId = entry.name.replace(/\.md$/, "");
    if (!frontmatterId) {
      errors.push(`${entry.name}: missing frontmatter specdojo.id for ${displayId}`);
    } else if (!frontmatterId.endsWith(`:${expectedLocalId}`)) {
      errors.push(
        `${entry.name}: ${displayId} must match frontmatter id "${frontmatterId}" (expected *:${expectedLocalId})`,
      );
    }

    const previous = ids.get(displayId);
    if (previous) {
      errors.push(`${displayId}: duplicate register item ID in ${previous} and ${entry.name}`);
    } else {
      ids.set(displayId, entry.name);
    }
  }

  return { errors };
}

// ================================
// Writing
// ================================

// 表示用プレースホルダ（`-` / `_TODO_` / 空文字）は「値なし」を意味する。
export function isPlaceholderCell(value: string | undefined): boolean {
  const trimmed = value?.trim() ?? "";
  return trimmed === "" || trimmed === CELL_NONE || trimmed === CELL_TODO;
}

// 一覧1行分の値を frontmatter フィールドへ写す。表示プレースホルダはキー削除（null）にする。
export function registerItemFieldsFromItem(item: PjrItem): RegisterItemFieldUpdates {
  return {
    item_type: item.type,
    item_status: item.status,
    priority: item.priority,
    owner: isPlaceholderCell(item.owner) ? null : item.owner.trim(),
    registered_on: isPlaceholderCell(item.registered) ? null : item.registered.trim(),
    due_on:
      item.due.trim() === CELL_TODO
        ? REMOVE_REGISTER_ITEM_FIELD
        : item.due.trim() === CELL_NONE || item.due.trim() === ""
          ? null
          : item.due.trim(),
    completed_on: isPlaceholderCell(item.completed) ? null : item.completed.trim(),
    conclusion: isPlaceholderCell(item.conclusion) ? null : item.conclusion.trim(),
  };
}

function orderSpecdojoKeys(fields: Record<string, unknown>): Record<string, unknown> {
  const ordered: Record<string, unknown> = {};
  for (const key of SPECDOJO_KEY_ORDER) {
    if (key in fields) ordered[key] = fields[key];
  }
  for (const [key, value] of Object.entries(fields)) {
    if (!(key in ordered)) ordered[key] = value;
  }
  return ordered;
}

// 個票 frontmatter の `specdojo:` 名前空間へ登録項目フィールドを反映する。
// 値 null のキーは削除する。frontmatter 以外（本文）は書き換えない。
export function applyRegisterItemFields(
  content: string,
  updates: RegisterItemFieldUpdates,
): string {
  const match = content.match(FRONTMATTER_RE);
  if (!match) {
    throw new Error("frontmatter not found in register item file");
  }

  let parsed: unknown;
  try {
    parsed = yaml.load(match[1]);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to parse register item frontmatter: ${detail}`);
  }
  if (!isRecord(parsed)) {
    throw new Error("register item frontmatter must be a mapping");
  }
  if (!isRecord(parsed.specdojo)) {
    throw new Error("register item frontmatter has no specdojo namespace");
  }

  const fields: Record<string, unknown> = { ...parsed.specdojo };
  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined) continue;
    if (value === REMOVE_REGISTER_ITEM_FIELD || (value === null && key !== "due_on")) {
      delete fields[key];
      continue;
    }
    fields[key] = value;
  }

  const document = { ...parsed, specdojo: orderSpecdojoKeys(fields) };
  const dumped = yaml.dump(document, { lineWidth: -1, noRefs: true, quotingType: '"' });
  return `---\n${dumped}---\n${match[2] ?? ""}`;
}

// H1 のタイトル部分（表示 ID の後ろ）を差し替える。ID 接頭辞は保持する。
export function setRegisterItemTitle(content: string, title: string): string {
  const heading = content.match(/^#\s+(.+)$/m);
  if (!heading) {
    throw new Error("H1 heading not found in register item file");
  }
  const idPrefix = heading[1].match(/^(PJR-[0-9A-Za-z]{4})\s+/);
  const replacement = idPrefix ? `# ${idPrefix[1]} ${title}` : `# ${title}`;
  return content.replace(/^#\s+.+$/m, () => replacement);
}

// 説明の導出元（最初の `##` 見出し直後の段落）を差し替える。段落が無い場合は見出し直後へ挿入する。
export function setRegisterItemDescription(content: string, description: string): string {
  const lines = content.split("\n");
  const sectionIndex = lines.findIndex((line) => /^##\s/.test(line));
  if (sectionIndex === -1) {
    throw new Error("section heading (## ) not found in register item file");
  }

  let start = sectionIndex + 1;
  while (start < lines.length && lines[start].trim() === "") start++;

  let end = start;
  while (end < lines.length && lines[end].trim() !== "" && !/^#{1,4}\s/.test(lines[end])) end++;

  if (start >= lines.length || /^#{1,4}\s/.test(lines[start] ?? "")) {
    lines.splice(sectionIndex + 1, 0, "", description);
    return lines.join("\n");
  }

  lines.splice(start, end - start, description);
  return lines.join("\n");
}

// 一覧に記録されていた要約を最初の章の先頭段落へ移し、既存段落はその後ろへ残す。
// 既存個票の詳細を失わず、本文から生成する一覧の「説明」を移行前と一致させるために使う。
export function prependRegisterItemDescription(content: string, description: string): string {
  const lines = content.split("\n");
  const sectionIndex = lines.findIndex((line) => /^##\s/.test(line));
  if (sectionIndex === -1) {
    throw new Error("section heading (## ) not found in register item file");
  }

  let insertAt = sectionIndex + 1;
  while (insertAt < lines.length && lines[insertAt].trim() === "") insertAt++;
  lines.splice(insertAt, 0, description, "");
  return lines.join("\n");
}

// dry-run 表示用に、書き込む登録項目フィールドを1行ずつ整形する。
export function formatRegisterItemFields(updates: RegisterItemFieldUpdates): string {
  return Object.entries(updates)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => {
      if (value === REMOVE_REGISTER_ITEM_FIELD || (value === null && key !== "due_on")) {
        return `  ${key}: (removed)`;
      }
      return `  ${key}: ${value === null ? "null" : value}`;
    })
    .join("\n");
}
