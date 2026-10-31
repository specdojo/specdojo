// 登録項目（PJR-XXXX）の正本は個票ファイル `pjr-XXXX-<topic>.md` の frontmatter である
// （register-item-frontmatter.schema.yaml）。本モジュールは個票の読み取り・派生値の導出・
// frontmatter の書き込みを担い、pjr-index の表は生成される一覧ビューとして扱う。
//
// 表示 ID・タイトル・説明は frontmatter に重複させず、`id` / H1 / 本文から導出する。

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { dump, load } from "../shared/yaml.js";
import { inlineCodeAnglePlaceholders } from "../shared/text.js";
import type { Approach } from "../shared/agent-types.js";
import type { SpecDojoProjectConfig, SpecDojoRepoConfig } from "../shared/specdojo-config.js";
import { readRegisterInput } from "./input.js";
import { registerDateFromTimestamp } from "./date.js";

// ================================
// Types & Constants
// ================================

// 登録項目1件分の値。frontmatter の省略キーは、表示用プレースホルダ（`-` / `_TODO_`）へ
// 変換してから格納する。起票・完了は瞬間（UTC・RFC 3339・秒精度）で保持し、
// 一覧に出す暦日は表示時にプロジェクトタイムゾーンへ変換して導出する。
export type PjrItem = {
  id: string;
  status: string;
  title: string;
  description: string;
  inputs?: string[];
  type: string;
  track?: string;
  priority: string;
  // executor / reporter pipeline の振り分けに使う作業難易度。未指定なら従来の自動選択。
  difficulty?: RegisterDifficulty;
  owner: string;
  registeredAt: string;
  due: string;
  completedAt: string;
  conclusion: string;
  ticket: string;
  // 通常の approach は target 1 件、authoring は新規 kata ID と任意の手本を組み合わせ、
  // 起票・更新時に対象種別を検証する。
  approach?: Approach;
  // 個票が宣言する対象文書の doc id リスト。plan frontmatter の targets へ転記され、
  // target coverage 検証に使われる。宣言がない項目は undefined（検証 skip）。
  targets?: string[];
  // kata authoring の読み取り専用の手本。doc id、project repository path、または
  // `<repo>:<path>` を保持し、起票時と plan 生成時に展開・検証する。
  sources?: string[];
  targetPath?: string;
  targetRulebook?: string;
  // この項目を起票する元になった register 項目。project 内は PJR-XXXX、project 間は
  // <project-id>:PJR-XXXX で保持し、派生先ビューと監査履歴へ展開する。
  derivedFrom?: string[];
  dependsOn?: string[];
  // 人が完了条件を確認し、夜間 orchestrator の実行対象として承認した印。
  autopilot?: "approved";
  commitType?: string;
  commitScope?: string;
};

export type RegisterDifficulty = "hard" | "medium" | "easy";

// 一覧ビュー1行分の表示値。日時は暦日へ変換済みで、テーブル生成と履歴の比較に使う。
export type PjrDisplayItem = Omit<PjrItem, "registeredAt" | "completedAt"> & {
  registered: string;
  completed: string;
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
  "epic",
  "question",
  "risk",
  "issue",
  "change-request",
  "decision",
  "note",
] as const;

export const VALID_PRIORITIES = ["high", "medium", "low"] as const;
export const VALID_DIFFICULTIES = ["hard", "medium", "easy"] as const;

export { VALID_COMMIT_TYPES, COMMIT_SCOPE_RE, type CommitType } from "../shared/commit-types.js";

export const DEFAULT_ITEM_TYPE_COMMIT_TYPE_MAP: Record<string, string> = {
  issue: "fix",
  todo: "feat",
  "change-request": "feat",
  decision: "docs",
  note: "docs",
  question: "docs",
  risk: "docs",
  epic: "feat",
};

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
  track?: string | typeof REMOVE_REGISTER_ITEM_FIELD;
  item_status?: string | typeof REMOVE_REGISTER_ITEM_FIELD;
  priority?: string | typeof REMOVE_REGISTER_ITEM_FIELD;
  difficulty?: RegisterDifficulty | typeof REMOVE_REGISTER_ITEM_FIELD;
  owner?: string | null | typeof REMOVE_REGISTER_ITEM_FIELD;
  registered_at?: string | null | typeof REMOVE_REGISTER_ITEM_FIELD;
  due_on?: string | null | typeof REMOVE_REGISTER_ITEM_FIELD;
  completed_at?: string | null | typeof REMOVE_REGISTER_ITEM_FIELD;
  block_reason?: string | null | typeof REMOVE_REGISTER_ITEM_FIELD;
  conclusion?: string | null | typeof REMOVE_REGISTER_ITEM_FIELD;
  approach?: string | typeof REMOVE_REGISTER_ITEM_FIELD;
  targets?: string[] | typeof REMOVE_REGISTER_ITEM_FIELD;
  sources?: string[] | typeof REMOVE_REGISTER_ITEM_FIELD;
  target_path?: string | typeof REMOVE_REGISTER_ITEM_FIELD;
  target_rulebook?: string | typeof REMOVE_REGISTER_ITEM_FIELD;
  derived_from?: string[] | typeof REMOVE_REGISTER_ITEM_FIELD;
  depends_on?: string[] | typeof REMOVE_REGISTER_ITEM_FIELD;
  autopilot?: "approved" | typeof REMOVE_REGISTER_ITEM_FIELD;
  commit_type?: string | typeof REMOVE_REGISTER_ITEM_FIELD;
  commit_scope?: string | typeof REMOVE_REGISTER_ITEM_FIELD;
};

// 日時へ移行する前の個票が持っていた日付フィールド。移行処理だけが読み書きする。
export const LEGACY_REGISTERED_KEY = "registered_on";
export const LEGACY_COMPLETED_KEY = "completed_on";

export type RegisterItemLegacyDates = {
  registeredOn?: string;
  completedOn?: string;
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
  "track",
  "item_status",
  "priority",
  "difficulty",
  "owner",
  "registered_at",
  "due_on",
  "completed_at",
  "block_reason",
  "conclusion",
  "derived_from",
  "depends_on",
  "autopilot",
  "commit_type",
  "commit_scope",
  "approach",
  "targets",
  "sources",
  "target_path",
  "target_rulebook",
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

// Markdown のコードスパン。コードとして明示された内容は、表セルでも著者の記法を保持する。
const MARKDOWN_CODE_SPAN = /(`+)[\s\S]*?\1/g;

// URL の囲みを適用しない Markdown の範囲。コードスパン、山括弧、リンク（shortcut / reference
// link を含む）は著者がすでに選んだ記法として保持する。
const MARKDOWN_URL_PROTECTED_SPAN =
  /(`+)[\s\S]*?\1|<[^<>\r\n]*>|!?\[[^\]\r\n]*\](?:\([^\r\n)]*\)|\[[^\]\r\n]*\])?/g;

// 全角の閉じ括弧・句読点と半角の閉じ括弧は URL の直後に続く本文として扱う。
// ASCII の句読点は query に使えるため一度 URL 候補へ含め、末尾にあるものだけ戻す。
const BARE_HTTP_URL = /https?:\/\/[^\s<>"'`）］｝〉》」』】〕〗〙〛。、，！？；：…)\]}]+/g;
const TRAILING_ASCII_URL_PUNCTUATION = /[.,;:!?]+$/;

function encloseBareHttpUrls(text: string): string {
  const encloseSegment = (segment: string): string =>
    segment.replace(BARE_HTTP_URL, (candidate) => {
      const trailing = candidate.match(TRAILING_ASCII_URL_PUNCTUATION)?.[0] ?? "";
      const url = trailing ? candidate.slice(0, -trailing.length) : candidate;
      return url ? `<${url}>${trailing}` : candidate;
    });

  let result = "";
  let lastIndex = 0;
  for (const match of text.matchAll(MARKDOWN_URL_PROTECTED_SPAN)) {
    const start = match.index ?? 0;
    result += encloseSegment(text.slice(lastIndex, start));
    result += match[0];
    lastIndex = start + match[0].length;
  }
  return result + encloseSegment(text.slice(lastIndex));
}

// コードスパン外の未エスケープな強調記号をエスケープする。
// 記号の直前に偶数個のバックスラッシュがある場合は Markdown 上で未エスケープなので、
// バックスラッシュを 1 個加える。奇数個なら既にエスケープ済みとして保持する。
function escapeTableCellEmphasis(text: string): string {
  const escapeSegment = (segment: string): string =>
    segment.replace(/(?<!\\)((?:\\\\)*)[*_]/g, (match) => {
      return `${match.slice(0, -1)}\\${match.slice(-1)}`;
    });

  let result = "";
  let lastIndex = 0;
  // URL 内の `*` / `_` は URL の一部なので変えない。bare URL はこの処理より先に
  // autolink 化されるが、Markdown link のリンク先にある URL も同じ規則で保持する。
  const protectedSpan = new RegExp(`${MARKDOWN_CODE_SPAN.source}|${BARE_HTTP_URL.source}`, "g");
  for (const match of text.matchAll(protectedSpan)) {
    const start = match.index ?? 0;
    result += escapeSegment(text.slice(lastIndex, start));
    result += match[0];
    lastIndex = start + match[0].length;
  }
  return result + escapeSegment(text.slice(lastIndex));
}

// 表セルへ埋め込むために1行化し、素の HTTP(S) URL を autolink にしてから、列区切りの
// `|` と強調記号の `*` / `_` をエスケープする。既存コードスパン、Markdown link、
// autolink、エスケープ済みの記号は保持し、複数回の呼び出しに対して冪等にする。
export function toCell(text: string): string {
  if (typeof text !== "string") return "";
  const normalized = text
    .replace(/\r?\n/g, " ")
    .replace(/\s+/g, " ")
    .replace(/(?<!\\)((\\\\)*)\|/g, "$1\\|")
    .trim();
  return escapeTableCellEmphasis(encloseBareHttpUrls(normalized));
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

  const text = paragraph.join(" ");
  if (text.startsWith(CELL_TODO)) return CELL_TODO;
  return toCell(text);
}

// ================================
// Reading
// ================================

// 個票の内容から一覧1行分の値と、登録項目フィールドの有無を導出する。
// ファイル名から ID を導出できない（命名規約外の）ファイルは undefined を返す。
export function readRegisterItemContent(
  content: string,
  filename: string,
): { id: string; item: PjrItem; hasRegisterFields: boolean; blockReason: string } | undefined {
  const id = displayIdFromTicketFilename(filename);
  if (!id) return undefined;

  const match = content.match(FRONTMATTER_RE);
  const body = match ? (match[2] ?? "") : content;
  let fields: Record<string, unknown> = {};
  if (match) {
    let parsed: unknown;
    try {
      parsed = load(match[1]);
    } catch {
      parsed = undefined;
    }
    if (isRecord(parsed) && isRecord(parsed.specdojo)) fields = parsed.specdojo;
  }

  const targets = Array.isArray(fields.targets)
    ? fields.targets.filter(
        (entry): entry is string => typeof entry === "string" && entry.trim() !== "",
      )
    : undefined;
  const sources = Array.isArray(fields.sources)
    ? fields.sources.filter(
        (entry): entry is string => typeof entry === "string" && entry.trim() !== "",
      )
    : undefined;
  const approach = asString(fields.approach) as Approach | undefined;
  const derivedFrom = Array.isArray(fields.derived_from)
    ? fields.derived_from.filter(
        (entry): entry is string => typeof entry === "string" && entry.trim() !== "",
      )
    : undefined;
  const dependsOn = Array.isArray(fields.depends_on)
    ? fields.depends_on.filter(
        (value): value is string => typeof value === "string" && value.trim() !== "",
      )
    : undefined;
  const autopilot = fields.autopilot === "approved" ? "approved" : undefined;
  const commitType = asString(fields.commit_type);
  const commitScope = asString(fields.commit_scope);
  const difficulty = asString(fields.difficulty) as RegisterDifficulty | undefined;

  const inputs = readRegisterInput(content);
  const item: PjrItem = {
    id,
    status: asString(fields.item_status) ?? "open",
    title: titleFromBody(body, id),
    description: descriptionFromBody(body),
    ...(inputs ? { inputs } : {}),
    type: asString(fields.item_type) ?? CELL_TODO,
    ...(asString(fields.track) ? { track: asString(fields.track) } : {}),
    priority: asString(fields.priority) ?? "medium",
    ...(difficulty ? { difficulty } : {}),
    owner: asString(fields.owner) ?? CELL_TODO,
    registeredAt: asString(fields.registered_at) ?? CELL_TODO,
    due:
      fields.due_on === null
        ? CELL_NONE
        : (asString(fields.due_on) ??
          (Object.prototype.hasOwnProperty.call(fields, "due_on") ? CELL_NONE : CELL_TODO)),
    completedAt: asString(fields.completed_at) ?? CELL_NONE,
    conclusion: asString(fields.conclusion) ?? CELL_NONE,
    ticket: ticketRefCell(filename),
    ...(approach ? { approach } : {}),
    ...(asString(fields.target_path) ? { targetPath: asString(fields.target_path) } : {}),
    ...(asString(fields.target_rulebook)
      ? { targetRulebook: asString(fields.target_rulebook) }
      : {}),
    ...(targets && targets.length > 0 ? { targets } : {}),
    ...(sources && sources.length > 0 ? { sources } : {}),
    ...(derivedFrom && derivedFrom.length > 0 ? { derivedFrom } : {}),
    ...(dependsOn && dependsOn.length > 0 ? { dependsOn } : {}),
    ...(autopilot ? { autopilot } : {}),
    ...(commitType ? { commitType } : {}),
    ...(commitScope ? { commitScope } : {}),
  };

  return {
    id,
    item,
    hasRegisterFields: asString(fields.item_status) !== undefined,
    blockReason: asString(fields.block_reason) ?? CELL_NONE,
  };
}

// 個票の日時を、指定タイムゾーン上の暦日へ変換した表示値へ写す。
// プレースホルダ（`-` / `_TODO_`）はそのまま残す。
export function toDisplayItem(item: PjrItem, timeZone: string): PjrDisplayItem {
  const { registeredAt, completedAt, ...rest } = item;
  return {
    ...rest,
    registered: isPlaceholderCell(registeredAt)
      ? registeredAt
      : registerDateFromTimestamp(registeredAt, timeZone),
    completed: isPlaceholderCell(completedAt)
      ? completedAt
      : registerDateFromTimestamp(completedAt, timeZone),
  };
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
        const parsed = load(match[1]);
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

// 登録項目1件分の値を frontmatter フィールドへ写す。表示プレースホルダはキー削除（null）にする。
export function registerItemFieldsFromItem(item: PjrItem): RegisterItemFieldUpdates {
  return {
    item_type: item.type,
    item_status: item.status,
    priority: item.priority,
    ...(item.difficulty ? { difficulty: item.difficulty } : {}),
    owner: isPlaceholderCell(item.owner) ? null : item.owner.trim(),
    registered_at: isPlaceholderCell(item.registeredAt) ? null : item.registeredAt.trim(),
    due_on:
      item.due.trim() === CELL_TODO
        ? REMOVE_REGISTER_ITEM_FIELD
        : item.due.trim() === CELL_NONE || item.due.trim() === ""
          ? null
          : item.due.trim(),
    completed_at: isPlaceholderCell(item.completedAt) ? null : item.completedAt.trim(),
    conclusion: isPlaceholderCell(item.conclusion)
      ? null
      : inlineCodeAnglePlaceholders(item.conclusion.trim()),
    ...(item.track ? { track: item.track } : {}),
    ...(item.approach ? { approach: item.approach } : {}),
    ...(item.targetPath ? { target_path: item.targetPath } : {}),
    ...(item.targetRulebook ? { target_rulebook: item.targetRulebook } : {}),
    ...(item.targets && item.targets.length > 0 ? { targets: item.targets } : {}),
    ...(item.sources && item.sources.length > 0 ? { sources: item.sources } : {}),
    ...(item.derivedFrom && item.derivedFrom.length > 0 ? { derived_from: item.derivedFrom } : {}),
    ...(item.dependsOn && item.dependsOn.length > 0 ? { depends_on: item.dependsOn } : {}),
    ...(item.autopilot ? { autopilot: item.autopilot } : {}),
    ...(item.commitType ? { commit_type: item.commitType } : {}),
    ...(item.commitScope ? { commit_scope: item.commitScope } : {}),
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

// 個票 frontmatter の `specdojo:` 名前空間を読み書きする共通処理。
// mutate はキーの追加・更新・削除だけを行い、frontmatter 以外（本文）は書き換えない。
export function updateSpecdojoFields(
  content: string,
  mutate: (fields: Record<string, unknown>) => void,
): string {
  const match = content.match(FRONTMATTER_RE);
  if (!match) {
    throw new Error("frontmatter not found in register item file");
  }

  const parsed = parseFrontmatterDocument(match[1]);
  if (!isRecord(parsed.specdojo)) {
    throw new Error("register item frontmatter has no specdojo namespace");
  }

  const fields: Record<string, unknown> = { ...parsed.specdojo };
  mutate(fields);

  const document = { ...parsed, specdojo: orderSpecdojoKeys(fields) };
  const dumped = dump(document, { lineWidth: -1, noRefs: true, quoteStyle: "double" });
  return `---\n${dumped}---\n${match[2] ?? ""}`;
}

// 個票 frontmatter の `specdojo:` 名前空間を、イベント検証などの読み取り用途へ返す。
// 呼び出し側が誤って元の文書を変更しないよう shallow copy にする。
export function readSpecdojoFields(content: string): Record<string, unknown> {
  const match = content.match(FRONTMATTER_RE);
  if (!match) {
    throw new Error("frontmatter not found in register item file");
  }
  const parsed = parseFrontmatterDocument(match[1]);
  if (!isRecord(parsed.specdojo)) {
    throw new Error("register item frontmatter has no specdojo namespace");
  }
  return { ...parsed.specdojo };
}

function parseFrontmatterDocument(frontmatter: string): Record<string, unknown> {
  let parsed: unknown;
  try {
    parsed = load(frontmatter);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to parse register item frontmatter: ${detail}`);
  }
  if (!isRecord(parsed)) {
    throw new Error("register item frontmatter must be a mapping");
  }
  return parsed;
}

// 個票 frontmatter の `specdojo:` 名前空間へ登録項目フィールドを反映する。
// 値 null のキーは削除する。frontmatter 以外（本文）は書き換えない。
export function applyRegisterItemFields(
  content: string,
  updates: RegisterItemFieldUpdates,
): string {
  return updateSpecdojoFields(content, (fields) => {
    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined) continue;
      if (value === REMOVE_REGISTER_ITEM_FIELD || (value === null && key !== "due_on")) {
        delete fields[key];
        continue;
      }
      fields[key] = value;
    }
  });
}

// 日時移行前の個票が持つ `registered_on` / `completed_on` を読み出す。
// 移行済み（どちらのキーも無い）個票では両方 undefined を返す。
export function readRegisterItemLegacyDates(content: string): RegisterItemLegacyDates {
  const match = content.match(FRONTMATTER_RE);
  if (!match) return {};

  let parsed: unknown;
  try {
    parsed = load(match[1]);
  } catch {
    return {};
  }
  if (!isRecord(parsed) || !isRecord(parsed.specdojo)) return {};

  const fields = parsed.specdojo;
  return {
    registeredOn: asString(fields[LEGACY_REGISTERED_KEY]),
    completedOn: asString(fields[LEGACY_COMPLETED_KEY]),
  };
}

// 旧日付キーを取り除き、UTC の日時キーへ置き換える。移行処理だけが使う。
export function applyRegisterItemTimestamps(
  content: string,
  timestamps: { registeredAt?: string; completedAt?: string },
): string {
  return updateSpecdojoFields(content, (fields) => {
    delete fields[LEGACY_REGISTERED_KEY];
    delete fields[LEGACY_COMPLETED_KEY];
    if (timestamps.registeredAt) fields.registered_at = timestamps.registeredAt;
    if (timestamps.completedAt) fields.completed_at = timestamps.completedAt;
  });
}

// H1 のタイトル部分（表示 ID の後ろ）を差し替える。ID 接頭辞は保持する。
export function setRegisterItemTitle(content: string, title: string): string {
  const heading = content.match(/^#\s+(.+)$/m);
  if (!heading) {
    throw new Error("H1 heading not found in register item file");
  }
  const idPrefix = heading[1].match(/^(PJR-[0-9A-Za-z]{4})\s+/);
  const safeTitle = inlineCodeAnglePlaceholders(title);
  const replacement = idPrefix ? `# ${idPrefix[1]} ${safeTitle}` : `# ${safeTitle}`;
  return content.replace(/^#\s+.+$/m, () => replacement);
}

// 説明の導出元（最初の `##` 見出し直後の段落）を差し替える。段落が無い場合は見出し直後へ挿入する。
export function setRegisterItemDescription(content: string, description: string): string {
  const safeDescription = inlineCodeAnglePlaceholders(description);
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
    lines.splice(sectionIndex + 1, 0, "", safeDescription);
    return lines.join("\n");
  }

  lines.splice(start, end - start, safeDescription);
  return lines.join("\n");
}

// 一覧に記録されていた要約を最初の章の先頭段落へ移し、既存段落はその後ろへ残す。
// 既存個票の詳細を失わず、本文から生成する一覧の「説明」を移行前と一致させるために使う。
export function prependRegisterItemDescription(content: string, description: string): string {
  const safeDescription = inlineCodeAnglePlaceholders(description);
  const lines = content.split("\n");
  const sectionIndex = lines.findIndex((line) => /^##\s/.test(line));
  if (sectionIndex === -1) {
    throw new Error("section heading (## ) not found in register item file");
  }

  let insertAt = sectionIndex + 1;
  while (insertAt < lines.length && lines[insertAt].trim() === "") insertAt++;
  lines.splice(insertAt, 0, safeDescription, "");
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

// ================================
// Commit Type & Scope Resolution
// ================================

export type ResolvedCommitTypeAndScope = {
  type: string;
  scope?: string;
};

/**
 * 登録項目の commit の type と scope を解決する。
 * 後続の項目（PJR-Z7GX・PJR-M1DH）から 1 つの関数で引ける共通関数。
 *
 * 解決優先順序:
 * 1. 個票の `commit_type` / `commit_scope`（指定があれば最優先）
 * 2. プロダクトリポジトリ設定（`repoConfig.commit_types`）
 * 3. プロジェクト設定（`projectConfig.commit_types`）
 * 4. 既定の対応マッピング（issue -> fix, todo -> feat, change-request -> feat 等）
 * 5. 上記に該当しない未知の type は "chore"
 */
export function resolveItemCommitTypeAndScope(
  item: Pick<PjrItem, "type"> & Partial<Pick<PjrItem, "commitType" | "commitScope">>,
  options?: {
    projectConfig?: Pick<SpecDojoProjectConfig, "commit_types">;
    repoConfig?: Pick<SpecDojoRepoConfig, "commit_types">;
  },
): ResolvedCommitTypeAndScope {
  const scope = item.commitScope?.trim() ? item.commitScope.trim() : undefined;

  // 1. 個票の明示指定
  if (item.commitType && item.commitType.trim() !== "") {
    return { type: item.commitType.trim(), ...(scope ? { scope } : {}) };
  }

  // 2. repoConfig の指定
  const repoTypes = options?.repoConfig?.commit_types;
  const repoType =
    repoTypes && Object.hasOwn(repoTypes, item.type) ? repoTypes[item.type] : undefined;
  if (repoType && repoType.trim() !== "") {
    return { type: repoType.trim(), ...(scope ? { scope } : {}) };
  }

  // 3. projectConfig の指定
  const projectTypes = options?.projectConfig?.commit_types;
  const projectType =
    projectTypes && Object.hasOwn(projectTypes, item.type) ? projectTypes[item.type] : undefined;
  if (projectType && projectType.trim() !== "") {
    return { type: projectType.trim(), ...(scope ? { scope } : {}) };
  }

  // 4. 既定マッピング
  const defaultType = Object.hasOwn(DEFAULT_ITEM_TYPE_COMMIT_TYPE_MAP, item.type)
    ? DEFAULT_ITEM_TYPE_COMMIT_TYPE_MAP[item.type]
    : undefined;
  if (defaultType) {
    return { type: defaultType, ...(scope ? { scope } : {}) };
  }

  // 5. フォールバック
  return { type: "chore", ...(scope ? { scope } : {}) };
}
