import { DEFAULT_REGISTER_DATE_TIMEZONE } from "./specdojo-config.js";
import type { SpecDojoConfig } from "./specdojo-config.js";

// 登録項目の日時（registered_at / completed_at）と、そこから導出する表示日の共通ヘルパー。
//
// 保存形式は UTC・RFC 3339・秒精度（`YYYY-MM-DDTHH:MM:SSZ`）に固定する。瞬間そのものを
// 一意に表せるため、実行環境（OS / コンテナ）の TZ 環境変数にも表示側の都合にも依存しない。
// 一覧・派生ビューの「登録日」「完了日」は、この瞬間をプロジェクトの登録日タイムゾーン
// （run.register_date_timezone、既定 UTC）へ変換した暦日として導出する。
// 期限（due_on）は瞬間ではなく同タイムゾーン上の暦日そのものなので、日付のまま扱う。

// 保存する日時の書式。秒精度・UTC（`Z`）のみを正とする。
export const REGISTER_TIMESTAMP_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

// 旧 registered_on / completed_on から移行する際、時刻が復元できない場合に補う
// プロジェクトタイムゾーン上の時刻。暦日の表示を変えない範囲で、その日の遅い時刻を選ぶ。
export const REGISTER_FALLBACK_TIME_OF_DAY = "21:00:00";

const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;

// 受け付ける入力形式。タイムゾーン（`Z` またはオフセット）を必須にし、
// ローカル時刻の解釈が実行環境に依存する表記は受け付けない。
const RFC3339_RE =
  /^(\d{4})-(\d{2})-(\d{2})[Tt ](\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:[Zz]|[+-]\d{2}:\d{2})$/;

const TIME_OF_DAY_RE = /^(\d{2}):(\d{2}):(\d{2})$/;

// 指定した IANA タイムゾーンでの暦日を YYYY-MM-DD 形式で返す。
// timeZone が不正な場合は Intl.DateTimeFormat が RangeError を投げる。文脈を補って再送出する。
export function formatDateInTimeZone(date: Date, timeZone: string): string {
  const parts = formatPartsInTimeZone(date, timeZone, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const pick = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${pick("year")}-${pick("month")}-${pick("day")}`;
}

// 指定した IANA タイムゾーンでの「今日」の暦日を YYYY-MM-DD 形式で返す。
export function todayInTimeZone(timeZone: string): string {
  return formatDateInTimeZone(new Date(), timeZone);
}

// config から対象プロジェクトの登録日タイムゾーンを解決する。未設定なら既定値（UTC）。
export function resolveRegisterDateTimeZone(
  config: SpecDojoConfig | null,
  projectId: string,
): string {
  const configured = config?.projects[projectId]?.run?.register_date_timezone?.trim();
  return configured || DEFAULT_REGISTER_DATE_TIMEZONE;
}

// ================================
// Timestamps
// ================================

// Date を UTC・RFC 3339・秒精度の文字列へ整形する。ミリ秒は切り捨てる。
export function formatUtcTimestamp(date: Date): string {
  const time = date.getTime();
  if (Number.isNaN(time)) {
    throw new Error("Cannot format an invalid Date as a register timestamp");
  }
  return new Date(Math.floor(time / 1000) * 1000).toISOString().replace(/\.\d{3}Z$/, "Z");
}

// 現在時刻を UTC・RFC 3339・秒精度で返す。register add / close / reject の既定値になる。
export function nowUtcTimestamp(): string {
  return formatUtcTimestamp(new Date());
}

// CLI などから受け取った日時を UTC・秒精度へ正規化する。タイムゾーンを含まない表記は、
// 実行環境のローカル時刻として解釈されうるため受け付けない。
export function normalizeRegisterTimestamp(value: string, label: string): string {
  const text = value.trim();
  if (!RFC3339_RE.test(text)) {
    throw new Error(
      `Invalid ${label}: "${value}". Must be an RFC 3339 date-time with a time zone ` +
        `(e.g., 2026-08-09T14:08:51Z or 2026-08-09T23:08:51+09:00)`,
    );
  }
  const parsed = new Date(text.replace(" ", "T"));
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid ${label}: "${value}". Not a valid date-time`);
  }
  return formatUtcTimestamp(parsed);
}

// 保存済みの日時から、指定タイムゾーン上の表示用暦日を導出する。
export function registerDateFromTimestamp(timestamp: string, timeZone: string): string {
  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid register timestamp: "${timestamp}". Must be RFC 3339 (UTC)`);
  }
  return formatDateInTimeZone(parsed, timeZone);
}

// 指定タイムゾーンの暦日と時刻（壁時計）に対応する瞬間を UTC の日時へ変換する。
// 旧 registered_on / completed_on の移行と、旧一覧の日付セルの読み取りで使う。
export function timestampFromDateInTimeZone(
  date: string,
  timeZone: string,
  timeOfDay: string = REGISTER_FALLBACK_TIME_OF_DAY,
): string {
  if (!DATE_ONLY_RE.test(date)) {
    throw new Error(`Invalid register date: "${date}". Must be YYYY-MM-DD`);
  }
  const time = TIME_OF_DAY_RE.exec(timeOfDay);
  if (!time) {
    throw new Error(`Invalid time of day: "${timeOfDay}". Must be HH:MM:SS`);
  }

  const [year, month, day] = date.split("-").map(Number);
  const wallClockMs = Date.UTC(
    year,
    month - 1,
    day,
    Number(time[1]),
    Number(time[2]),
    Number(time[3]),
  );

  // 壁時計時刻からその瞬間の UTC オフセットは直接は決まらないため、暫定値で1度求めた
  // オフセットを使って補正し、補正後の瞬間で再評価する（DST 切り替え日を跨ぐ場合の補正）。
  let instantMs = wallClockMs - timeZoneOffsetMs(new Date(wallClockMs), timeZone);
  instantMs = wallClockMs - timeZoneOffsetMs(new Date(instantMs), timeZone);
  return formatUtcTimestamp(new Date(instantMs));
}

// ================================
// Internal
// ================================

function formatPartsInTimeZone(
  date: Date,
  timeZone: string,
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormatPart[] {
  try {
    // en-CA ロケールは既定で YYYY-MM-DD 並びだが、formatToParts で桁を明示的に組み立てる。
    return new Intl.DateTimeFormat("en-CA", { timeZone, ...options }).formatToParts(date);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Invalid register_date_timezone: "${timeZone}". Use an IANA time zone name (e.g., UTC, Asia/Tokyo). ${detail}`,
    );
  }
}

// 指定した瞬間における、そのタイムゾーンの UTC オフセット（ミリ秒）を返す。
function timeZoneOffsetMs(instant: Date, timeZone: string): number {
  const parts = formatPartsInTimeZone(instant, timeZone, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const pick = (type: Intl.DateTimeFormatPartTypes): number =>
    Number(parts.find((part) => part.type === type)?.value ?? "0");

  const asIfUtcMs = Date.UTC(
    pick("year"),
    pick("month") - 1,
    pick("day"),
    pick("hour"),
    pick("minute"),
    pick("second"),
  );
  // 秒未満の情報は formatToParts に含まれないため、比較前に瞬間側も秒へ丸める。
  return asIfUtcMs - Math.floor(instant.getTime() / 1000) * 1000;
}
