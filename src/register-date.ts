import { DEFAULT_REGISTER_DATE_TIMEZONE } from "./specdojo-config.js";
import type { SpecDojoConfig } from "./specdojo-config.js";

// pjr-index の「登録日」「完了日」を導出する共通の日付ヘルパー。
// 日付計算は Intl.DateTimeFormat の timeZone オプションで明示的にタイムゾーンを指定し、
// 実行環境（OS / コンテナ）の TZ 環境変数には依存させない。登録日・完了日の双方が
// このヘルパーを経由することで、計算基準を一致させる。

// 指定した IANA タイムゾーンでの暦日を YYYY-MM-DD 形式で返す。
// timeZone が不正な場合は Intl.DateTimeFormat が RangeError を投げる。文脈を補って再送出する。
export function formatDateInTimeZone(date: Date, timeZone: string): string {
  let parts: Intl.DateTimeFormatPart[];
  try {
    // en-CA ロケールは既定で YYYY-MM-DD 並びだが、formatToParts で桁を明示的に組み立てる。
    parts = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Invalid register_date_timezone: "${timeZone}". Use an IANA time zone name (e.g., UTC, Asia/Tokyo). ${detail}`,
    );
  }

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
