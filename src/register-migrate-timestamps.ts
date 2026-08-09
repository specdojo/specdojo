// 個票の起票日・完了日（旧 `registered_on` / `completed_on`）を、UTC の日時
// （`registered_at` / `completed_at`）へ移す一度限りの移行処理。
//
// 時刻は次の優先順で決める。
//   1. Git 履歴から復元する。起票は個票ファイルを追加したコミット、完了は終端状態
//      （done / decided / rejected）へ遷移したコミットの author 時刻を採る。
//   2. 復元した時刻の暦日（プロジェクトタイムゾーン）が旧日付と一致しない場合、または
//      履歴から復元できない場合は、旧日付にプロジェクトタイムゾーンの 21:00 を補う。
//
// 2 の一致判定を挟むのは、日付そのものが登録簿の記録として正であり、移行によって
// 一覧・派生ビューに出る暦日を変えないためである（個票ファイルの作成が起票より
// 後になっている項目では、追加コミットの時刻は起票時刻ではない）。

import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import {
  applyRegisterItemTimestamps,
  displayIdFromTicketFilename,
  readRegisterItemContent,
  readRegisterItemLegacyDates,
} from "./register-item.js";
import {
  normalizeRegisterTimestamp,
  REGISTER_FALLBACK_TIME_OF_DAY,
  registerDateFromTimestamp,
  timestampFromDateInTimeZone,
} from "./register-date.js";
import { gitResult } from "./exec-worktree.js";

// ================================
// Types & Constants
// ================================

// 時刻の決定根拠。移行結果の記録と要約に使う。
export type TimestampSource = "git" | "fallback";

export type RegisterTimestampMigrationEntry = {
  id: string;
  path: string;
  filename: string;
  registeredAt?: string;
  registeredSource?: TimestampSource;
  completedAt?: string;
  completedSource?: TimestampSource;
};

export type RegisterTimestampMigrationFile = {
  path: string;
  content: string;
  originalContent: string;
};

export type RegisterTimestampMigrationPlan = {
  // 旧日付キーを持っていた個票の件数。
  targetCount: number;
  entries: RegisterTimestampMigrationEntry[];
  files: RegisterTimestampMigrationFile[];
};

export type RegisterItemGitTimestamps = {
  addedAt?: string;
  closedAt?: string;
};

// 個票1件分の Git 時刻を解決する関数。テストでは履歴を注入して差し替える。
export type GitTimestampResolver = (opts: {
  path: string;
  filename: string;
}) => RegisterItemGitTimestamps;

// git log の1行書式。コミットハッシュも ISO 日付も空白を含まないため、空白で分割できる。
const COMMIT_LOG_FORMAT = "--format=%H %aI";

// 完了日を記録する終端状態。deferred は終端だが完了日を持たないため含めない。
const CLOSED_STATUSES = new Set(["done", "decided", "rejected"]);

// ================================
// Git timestamps
// ================================

function gitLines(repoRoot: string, args: string[]): string[] {
  const result = gitResult(repoRoot, args);
  if (result.status !== 0) return [];
  const stdout = typeof result.stdout === "string" ? result.stdout : "";
  return stdout.split(/\r?\n/).filter((line) => line.trim() !== "");
}

// git のパス限定はリポジトリルート起点の POSIX 表記で渡す。
function repoRelativePath(repoRoot: string, target: string): string | undefined {
  const value = relative(repoRoot, target);
  if (!value || value === ".." || value.startsWith(`..${sep}`)) return undefined;
  return value.split(sep).join("/");
}

function toUtcTimestamp(authorDate: string): string | undefined {
  try {
    return normalizeRegisterTimestamp(authorDate, "git author date");
  } catch {
    return undefined;
  }
}

function isClosedContent(content: string, filename: string): boolean {
  const parsed = readRegisterItemContent(content, filename);
  return parsed ? CLOSED_STATUSES.has(parsed.item.status) : false;
}

// 作業ツリーの Git 履歴から、個票の追加時刻と終端状態への遷移時刻を取り出す。
// 履歴が読めない場合（未コミット・git 不在など）は該当項目を undefined のままにする。
export function createGitTimestampResolver(repoRoot: string): GitTimestampResolver {
  return ({ path, filename }) => {
    const relativePath = repoRelativePath(repoRoot, path);
    if (!relativePath) return {};

    const addedDates = gitLines(repoRoot, [
      "log",
      "--follow",
      "--diff-filter=A",
      "--format=%aI",
      "--",
      relativePath,
    ]);
    // git log は新しい順に出力するため、最初の追加コミットは末尾の行になる。
    const addedAt =
      addedDates.length > 0 ? toUtcTimestamp(addedDates[addedDates.length - 1]) : undefined;

    // 終端状態は最新側から遡り、終端が連続している最古のコミットを遷移時点とみなす。
    // 大半の個票では close コミットが最新側にあるため、走査は数リビジョンで止まる。
    const commits = gitLines(repoRoot, ["log", COMMIT_LOG_FORMAT, "--", relativePath]);
    let closedAt: string | undefined;
    for (const line of commits) {
      const [commit, authorDate] = line.trim().split(" ");
      if (!commit || !authorDate) break;
      const shown = gitResult(repoRoot, ["show", `${commit}:${relativePath}`]);
      if (shown.status !== 0 || typeof shown.stdout !== "string") break;
      if (!isClosedContent(shown.stdout, filename)) break;
      closedAt = toUtcTimestamp(authorDate) ?? closedAt;
    }

    return { addedAt, closedAt };
  };
}

// ================================
// Planning
// ================================

// Git 履歴から復元した時刻が旧日付と同じ暦日を指す場合だけ採用し、それ以外は 21:00 を補う。
function resolveTimestamp(
  legacyDate: string,
  restoredAt: string | undefined,
  timeZone: string,
): { timestamp: string; source: TimestampSource } {
  if (restoredAt && registerDateFromTimestamp(restoredAt, timeZone) === legacyDate) {
    return { timestamp: restoredAt, source: "git" };
  }
  return {
    timestamp: timestampFromDateInTimeZone(legacyDate, timeZone, REGISTER_FALLBACK_TIME_OF_DAY),
    source: "fallback",
  };
}

// 登録簿ディレクトリを走査し、旧日付キーを持つ個票の書き換え内容を組み立てる。
// 書き込みは行わず、対象・決定した日時・その根拠を計画として返す。
export function planRegisterTimestampMigration(opts: {
  projectRegisterPath: string;
  timeZone: string;
  resolveGitTimestamps: GitTimestampResolver;
}): RegisterTimestampMigrationPlan {
  const entries: RegisterTimestampMigrationEntry[] = [];
  const files: RegisterTimestampMigrationFile[] = [];

  const filenames = readdirSync(opts.projectRegisterPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && displayIdFromTicketFilename(entry.name) !== undefined)
    .map((entry) => entry.name)
    .sort((a, b) => (a === b ? 0 : a < b ? -1 : 1));

  for (const filename of filenames) {
    const id = displayIdFromTicketFilename(filename);
    if (!id) continue;

    const path = join(opts.projectRegisterPath, filename);
    const originalContent = readFileSync(path, "utf8");
    const legacy = readRegisterItemLegacyDates(originalContent);
    if (!legacy.registeredOn && !legacy.completedOn) continue;

    const gitTimestamps = opts.resolveGitTimestamps({ path, filename });
    const entry: RegisterTimestampMigrationEntry = { id, path, filename };

    if (legacy.registeredOn) {
      const resolved = resolveTimestamp(legacy.registeredOn, gitTimestamps.addedAt, opts.timeZone);
      entry.registeredAt = resolved.timestamp;
      entry.registeredSource = resolved.source;
    }
    if (legacy.completedOn) {
      const resolved = resolveTimestamp(legacy.completedOn, gitTimestamps.closedAt, opts.timeZone);
      entry.completedAt = resolved.timestamp;
      entry.completedSource = resolved.source;
    }

    const content = applyRegisterItemTimestamps(originalContent, {
      registeredAt: entry.registeredAt,
      completedAt: entry.completedAt,
    });
    assertDisplayDatesPreserved(entry, legacy, content, filename, opts.timeZone);

    entries.push(entry);
    if (content !== originalContent) files.push({ path, content, originalContent });
  }

  return { targetCount: entries.length, entries, files };
}

// 移行によって一覧・派生ビューへ出る暦日が変わっていないことを、書き込み前に検証する。
function assertDisplayDatesPreserved(
  entry: RegisterTimestampMigrationEntry,
  legacy: { registeredOn?: string; completedOn?: string },
  content: string,
  filename: string,
  timeZone: string,
): void {
  const parsed = readRegisterItemContent(content, filename);
  if (!parsed) {
    throw new Error(`Failed to read migrated register item: ${filename}`);
  }

  const mismatches: string[] = [];
  const check = (label: string, expected: string | undefined, actualAt: string): void => {
    if (expected === undefined) return;
    const actual = registerDateFromTimestamp(actualAt, timeZone);
    if (actual !== expected) mismatches.push(`${label}: ${expected} -> ${actual}`);
  };

  check("registered", legacy.registeredOn, parsed.item.registeredAt);
  check("completed", legacy.completedOn, parsed.item.completedAt);

  const missing: string[] = [];
  if (entry.registeredAt && parsed.item.registeredAt !== entry.registeredAt) {
    missing.push("registered_at");
  }
  if (entry.completedAt && parsed.item.completedAt !== entry.completedAt) {
    missing.push("completed_at");
  }
  if (missing.length > 0) {
    throw new Error(`Timestamp migration did not write ${missing.join(", ")} for ${entry.id}`);
  }
  if (mismatches.length > 0) {
    throw new Error(
      `Timestamp migration would change displayed dates for ${entry.id}: ${mismatches.join(", ")}`,
    );
  }
}

// 移行結果を「復元できた件数 / 補完した件数」で要約する。対応結果へそのまま記録できる形にする。
export function summarizeTimestampMigration(plan: RegisterTimestampMigrationPlan): string {
  const count = (key: "registeredSource" | "completedSource", source: TimestampSource): number =>
    plan.entries.filter((entry) => entry[key] === source).length;

  return (
    `items=${plan.targetCount}, ` +
    `registered(git=${count("registeredSource", "git")}, fallback=${count("registeredSource", "fallback")}), ` +
    `completed(git=${count("completedSource", "git")}, fallback=${count("completedSource", "fallback")})`
  );
}
