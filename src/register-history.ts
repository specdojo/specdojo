// 登録項目（PJR-XXXX）の変更履歴を git から再構成する。個票 frontmatter を正本にした結果、
// 台帳全体を1ファイル（旧 pjr-index.md）の差分で追う手段が失われたため、その代替として
// 個票群のコミット履歴から「追加・状態遷移・フィールド変更・削除」を時系列で組み立てる。
//
// 比較対象は生成される登録項目一覧の列（ステータス・タイトル・説明・分類・優先度・担当・
// 登録日・期限・完了日・結論）に揃える。旧一覧の差分で見えていた変化と同じ粒度になる。

import { basename } from "node:path";
import {
  displayIdFromTicketFilename,
  isPlaceholderCell,
  readRegisterItemContent,
  toDisplayItem,
} from "./register-item.js";
import { gitOutput, gitResult } from "./exec-worktree.js";
import { DEFAULT_REGISTER_DATE_TIMEZONE } from "./specdojo-config.js";

// ================================
// Types & Constants
// ================================

export type RegisterCommitFileChange = {
  // git の name-status 文字（A / M / D / R100 など）。
  status: string;
  path: string;
  // rename（R）の場合のみ、変更前のパス。
  oldPath?: string;
};

export type RegisterCommitEntry = {
  commit: string;
  date: string;
  author: string;
  subject: string;
  files: RegisterCommitFileChange[];
};

export type RegisterHistoryEventKind = "added" | "updated" | "removed";

export type RegisterHistoryChange = {
  field: string;
  from: string;
  to: string;
};

export type RegisterHistoryEvent = {
  id: string;
  commit: string;
  date: string;
  author: string;
  subject: string;
  kind: RegisterHistoryEventKind;
  file: string;
  changes: RegisterHistoryChange[];
};

// 比較する項目と出力順。登録項目一覧の列順（ID と個票リンクを除く）に合わせる。
export const REGISTER_HISTORY_FIELDS = [
  "status",
  "title",
  "description",
  "type",
  "priority",
  "owner",
  "registered",
  "due",
  "completed",
  "conclusion",
] as const;

export type RegisterHistoryField = (typeof REGISTER_HISTORY_FIELDS)[number];

// git log の1コミット分の区切り（レコード分離子）とヘッダー項目の区切り（単位分離子）。
// コミットメッセージ本文には現れない制御文字を使い、subject にタブや `|` があっても壊れない。
const RECORD_SEPARATOR = "\u001e";
const UNIT_SEPARATOR = "\u001f";
const LOG_PRETTY_FORMAT = `format:${RECORD_SEPARATOR}%H${UNIT_SEPARATOR}%ad${UNIT_SEPARATOR}%an${UNIT_SEPARATOR}%s`;

// `--status-only` で残すフィールド。状態遷移そのものと、遷移に伴って記録される値に限る。
const STATUS_ONLY_FIELDS = new Set(["id", "status", "type", "completed", "conclusion"]);

// 値なしを表す表示文字列。frontmatter のキー省略と、一覧のプレースホルダの両方を含む。
const EMPTY_VALUE = "(none)";

// テキスト出力で1つの値を表示する最大長。説明・結論は長文になりうるため省略する。
const MAX_VALUE_LENGTH = 60;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// ================================
// Parsing
// ================================

// `git log --name-status` の出力をコミット単位へ分解する。
export function parseRegisterLogOutput(output: string): RegisterCommitEntry[] {
  const entries: RegisterCommitEntry[] = [];

  for (const record of output.split(RECORD_SEPARATOR)) {
    if (record.trim() === "") continue;

    const lines = record.split(/\r?\n/);
    const header = lines[0]?.split(UNIT_SEPARATOR) ?? [];
    if (header.length < 4) continue;

    const files: RegisterCommitFileChange[] = [];
    for (const line of lines.slice(1)) {
      if (line.trim() === "") continue;
      const columns = line.split("\t");
      const status = columns[0]?.trim() ?? "";
      if (!status || columns.length < 2) continue;
      if (status.startsWith("R") || status.startsWith("C")) {
        if (columns.length < 3) continue;
        files.push({ status, path: columns[2], oldPath: columns[1] });
        continue;
      }
      files.push({ status, path: columns[1] });
    }

    entries.push({
      commit: header[0],
      date: header[1],
      author: header[2],
      subject: header.slice(3).join(UNIT_SEPARATOR),
      files,
    });
  }

  return entries;
}

// ================================
// Event Construction
// ================================

// 個票の内容から、比較対象フィールドの値を取り出す。個票として読めない内容は undefined。
// 登録日・完了日は保存された日時を表示タイムゾーンの暦日へ変換した値で比較する。
function itemFieldValues(
  content: string | undefined,
  filename: string,
  timeZone: string,
): Record<RegisterHistoryField, string> | undefined {
  if (content === undefined) return undefined;
  const parsed = readRegisterItemContent(content, filename);
  if (!parsed) return undefined;

  const item = toDisplayItem(parsed.item, timeZone);
  return {
    status: item.status,
    title: item.title,
    description: item.description,
    type: item.type,
    priority: item.priority,
    owner: item.owner,
    registered: item.registered,
    due: item.due,
    completed: item.completed,
    conclusion: item.conclusion,
  };
}

function kindFromStatus(status: string): RegisterHistoryEventKind {
  if (status.startsWith("A")) return "added";
  if (status.startsWith("D")) return "removed";
  return "updated";
}

function diffFieldValues(
  before: Record<RegisterHistoryField, string> | undefined,
  after: Record<RegisterHistoryField, string> | undefined,
): RegisterHistoryChange[] {
  const changes: RegisterHistoryChange[] = [];
  for (const field of REGISTER_HISTORY_FIELDS) {
    const from = before?.[field] ?? "";
    const to = after?.[field] ?? "";
    if (from === to) continue;
    changes.push({ field, from, to });
  }
  return changes;
}

// 個票以外のファイル（生成物・一覧・添付など）は台帳の項目変更ではないため除外する。
function registerItemIdForPath(path: string): string | undefined {
  if (path.includes("/generated/")) return undefined;
  return displayIdFromTicketFilename(basename(path));
}

// コミット列と「あるリビジョン時点のファイル内容を返す関数」から、項目単位の変更イベントを作る。
// 入力の順序（git log --reverse なら古い順）をそのまま保つ。
export function buildRegisterHistoryEvents(
  commits: readonly RegisterCommitEntry[],
  readAt: (revision: string, path: string) => string | undefined,
  options: { ids?: readonly string[]; statusOnly?: boolean; timeZone?: string } = {},
): RegisterHistoryEvent[] {
  const idFilter = options.ids && options.ids.length > 0 ? new Set(options.ids) : undefined;
  const timeZone = options.timeZone ?? DEFAULT_REGISTER_DATE_TIMEZONE;
  const events: RegisterHistoryEvent[] = [];

  for (const commit of commits) {
    const files = [...commit.files].sort((a, b) =>
      a.path === b.path ? 0 : a.path < b.path ? -1 : 1,
    );

    for (const file of files) {
      const id = registerItemIdForPath(file.path);
      if (!id) continue;
      if (idFilter && !idFilter.has(id)) continue;

      const kind = kindFromStatus(file.status);
      const sourcePath = file.oldPath ?? file.path;
      const before =
        kind === "added"
          ? undefined
          : itemFieldValues(
              readAt(`${commit.commit}^`, sourcePath),
              basename(sourcePath),
              timeZone,
            );
      const after =
        kind === "removed"
          ? undefined
          : itemFieldValues(readAt(commit.commit, file.path), basename(file.path), timeZone);

      let changes = kind === "removed" ? [] : diffFieldValues(before, after);

      // renumber による ID 付け替えは、フィールド値が変わらないため rename から検出する。
      const oldId = file.oldPath ? registerItemIdForPath(file.oldPath) : undefined;
      if (oldId && oldId !== id) {
        changes.unshift({ field: "id", from: oldId, to: id });
      }

      if (kind === "updated" && changes.length === 0) continue;
      if (options.statusOnly) {
        if (kind === "updated" && !changes.some((change) => change.field === "status")) continue;
        // 状態遷移の監査に必要な項目だけへ絞る。説明・タイトルの推敲差分は落とす。
        changes = changes.filter((change) => STATUS_ONLY_FIELDS.has(change.field));
      }

      events.push({
        id,
        commit: commit.commit,
        date: commit.date,
        author: commit.author,
        subject: commit.subject,
        kind,
        file: file.path,
        changes,
      });
    }
  }

  return events;
}

// ================================
// Formatting
// ================================

function displayValue(value: string): string {
  const text = value.trim();
  if (text === "") return EMPTY_VALUE;
  if (text.length <= MAX_VALUE_LENGTH) return text;
  return `${text.slice(0, MAX_VALUE_LENGTH)}...`;
}

function formatChanges(event: RegisterHistoryEvent): string {
  if (event.kind === "removed") return "(register item file removed)";
  if (event.kind === "added") {
    // 起票時点で未定の項目（`-` / `_TODO_`）は、値が入った時点の updated で拾えるため出さない。
    const assignments = event.changes
      .filter((change) => !isPlaceholderCell(change.to))
      .map((change) => `${change.field}=${displayValue(change.to)}`);
    return assignments.length > 0 ? assignments.join(", ") : "(no fields)";
  }
  return event.changes
    .map((change) => `${change.field}: ${displayValue(change.from)} -> ${displayValue(change.to)}`)
    .join("; ");
}

// 監査時に上から読める1行1イベントの形へ整形する。
export function formatRegisterHistoryEvents(events: readonly RegisterHistoryEvent[]): string {
  return events
    .map((event) => {
      const commit = event.commit.slice(0, 7);
      const kind = event.kind.padEnd(7);
      return `${event.date}  ${commit}  ${event.id}  ${kind}  ${formatChanges(event)}  # ${event.subject}`;
    })
    .join("\n");
}

// ================================
// Git Collection
// ================================

export type RegisterHistoryQuery = {
  repoRoot: string;
  // リポジトリルートからの登録簿ディレクトリの相対パス（POSIX 区切り）。
  registerPathspec: string;
  since?: string;
  until?: string;
  limit?: number;
  ids?: readonly string[];
  statusOnly?: boolean;
  // 登録日・完了日を暦日へ変換する IANA タイムゾーン（run.register_date_timezone）。
  timeZone?: string;
};

export function assertHistoryDate(value: string, option: string): void {
  if (!DATE_RE.test(value)) {
    throw new Error(`Invalid ${option} date: "${value}". Must be YYYY-MM-DD`);
  }
}

function buildLogArgs(query: RegisterHistoryQuery): string[] {
  const args = [
    "log",
    "--reverse",
    "--no-merges",
    "--date=short",
    `--pretty=${LOG_PRETTY_FORMAT}`,
    "--name-status",
    "--find-renames",
  ];
  if (query.since) {
    assertHistoryDate(query.since, "--since");
    args.push(`--since=${query.since} 00:00:00`);
  }
  if (query.until) {
    assertHistoryDate(query.until, "--until");
    args.push(`--until=${query.until} 23:59:59`);
  }
  if (query.limit !== undefined) {
    if (!Number.isInteger(query.limit) || query.limit <= 0) {
      throw new Error(`Invalid --limit: "${query.limit}". Must be a positive integer`);
    }
    args.push(`--max-count=${query.limit}`);
  }
  args.push("--", query.registerPathspec);
  return args;
}

// 指定リビジョン時点のファイル内容を返す。そのリビジョンに存在しない場合は undefined。
function readFileAtRevision(repoRoot: string, revision: string, path: string): string | undefined {
  const result = gitResult(repoRoot, ["show", `${revision}:${path}`]);
  if (result.status !== 0) return undefined;
  return typeof result.stdout === "string" ? result.stdout : undefined;
}

// git 履歴から登録項目の変更イベントを古い順に集める。
export function collectRegisterHistoryEvents(query: RegisterHistoryQuery): RegisterHistoryEvent[] {
  const output = gitOutput(query.repoRoot, buildLogArgs(query));
  const commits = parseRegisterLogOutput(output);
  return buildRegisterHistoryEvents(
    commits,
    (revision, path) => readFileAtRevision(query.repoRoot, revision, path),
    { ids: query.ids, statusOnly: query.statusOnly, timeZone: query.timeZone },
  );
}
