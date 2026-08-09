import { afterEach, describe, expect, it, vi } from "vitest";
import {
  formatDateInTimeZone,
  formatUtcTimestamp,
  normalizeRegisterTimestamp,
  nowUtcTimestamp,
  REGISTER_TIMESTAMP_RE,
  registerDateFromTimestamp,
  resolveRegisterDateTimeZone,
  timestampFromDateInTimeZone,
  todayInTimeZone,
} from "../../src/register-date.js";
import type { SpecDojoConfig } from "../../src/specdojo-config.js";

describe("formatDateInTimeZone", () => {
  it("UTC で暦日を YYYY-MM-DD 形式へ整形する", () => {
    const instant = new Date("2026-08-08T00:30:00Z");

    expect(formatDateInTimeZone(instant, "UTC")).toBe("2026-08-08");
  });

  it("同一 instant でもタイムゾーンにより暦日が変わる（OS TZ 非依存）", () => {
    // UTC 15:30 は Asia/Tokyo(+09:00) では翌日 00:30 になる。
    const instant = new Date("2026-08-08T15:30:00Z");

    expect(formatDateInTimeZone(instant, "UTC")).toBe("2026-08-08");
    expect(formatDateInTimeZone(instant, "Asia/Tokyo")).toBe("2026-08-09");
  });

  it("UTC 直前の instant を America/New_York では前日として解決する", () => {
    // UTC 03:00 は America/New_York(-04:00, 夏時間) では前日 23:00。
    const instant = new Date("2026-08-08T03:00:00Z");

    expect(formatDateInTimeZone(instant, "America/New_York")).toBe("2026-08-07");
  });

  it("月・日を常に 2 桁ゼロ詰めで返す", () => {
    const instant = new Date("2026-01-05T12:00:00Z");

    expect(formatDateInTimeZone(instant, "UTC")).toBe("2026-01-05");
  });

  it("不正なタイムゾーン名は文脈付きエラーで失敗する", () => {
    const instant = new Date("2026-08-08T00:00:00Z");

    expect(() => formatDateInTimeZone(instant, "Not/AZone")).toThrow(
      /Invalid register_date_timezone: "Not\/AZone"/,
    );
  });
});

describe("todayInTimeZone", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("YYYY-MM-DD 形式（時刻・タイムゾーン表記なし）を返す", () => {
    expect(todayInTimeZone("UTC")).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("固定時刻でタイムゾーン設定あり/なしの双方が指定タイムゾーンで暦日を導出する", () => {
    // システム時刻（= OS/コンテナの現在時刻）を UTC の夜遅くへ固定する。
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-08T23:30:00Z"));

    // タイムゾーン未設定相当（既定 UTC）ではその日、Asia/Tokyo では翌日になる。
    expect(todayInTimeZone("UTC")).toBe("2026-08-08");
    expect(todayInTimeZone("Asia/Tokyo")).toBe("2026-08-09");
  });

  it("登録日と完了日は同じヘルパー・同じタイムゾーンで一致する計算基準になる", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-08T23:30:00Z"));

    // register add（登録日）と close/reject（完了日）はいずれも todayInTimeZone を経由する。
    const registered = todayInTimeZone("Asia/Tokyo");
    const completed = todayInTimeZone("Asia/Tokyo");

    expect(registered).toBe(completed);
    expect(registered).toBe("2026-08-09");
  });
});

describe("resolveRegisterDateTimeZone", () => {
  const makeConfig = (timezone?: string): SpecDojoConfig => ({
    version: 1,
    projects: {
      "prj-0001": {
        schedule_path: "s",
        execution_path: "e",
        ...(timezone !== undefined ? { run: { register_date_timezone: timezone } } : {}),
      },
    },
  });

  it("run.register_date_timezone が設定されていればそれを返す", () => {
    expect(resolveRegisterDateTimeZone(makeConfig("Asia/Tokyo"), "prj-0001")).toBe("Asia/Tokyo");
  });

  it("未設定の場合は既定値 UTC を返す", () => {
    expect(resolveRegisterDateTimeZone(makeConfig(), "prj-0001")).toBe("UTC");
  });

  it("config が null の場合は既定値 UTC を返す", () => {
    expect(resolveRegisterDateTimeZone(null, "prj-0001")).toBe("UTC");
  });

  it("空白のみの設定値は既定値 UTC へフォールバックする", () => {
    expect(resolveRegisterDateTimeZone(makeConfig("   "), "prj-0001")).toBe("UTC");
  });
});

describe("formatUtcTimestamp / nowUtcTimestamp", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("UTC の RFC 3339・秒精度へ整形し、ミリ秒を切り捨てる", () => {
    expect(formatUtcTimestamp(new Date("2026-08-09T14:08:51.987Z"))).toBe("2026-08-09T14:08:51Z");
  });

  it("不正な Date は文脈付きエラーで失敗する", () => {
    expect(() => formatUtcTimestamp(new Date("not-a-date"))).toThrow(
      /Cannot format an invalid Date as a register timestamp/,
    );
  });

  it("現在時刻を保存書式（秒精度・UTC）で返す", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-09T14:08:51.500Z"));

    expect(nowUtcTimestamp()).toBe("2026-08-09T14:08:51Z");
    expect(REGISTER_TIMESTAMP_RE.test(nowUtcTimestamp())).toBe(true);
  });
});

describe("normalizeRegisterTimestamp", () => {
  it("オフセット付き RFC 3339 を UTC へ正規化する", () => {
    expect(normalizeRegisterTimestamp("2026-08-09T23:08:51+09:00", "registered")).toBe(
      "2026-08-09T14:08:51Z",
    );
  });

  it("UTC 表記はそのまま秒精度で受け取る", () => {
    expect(normalizeRegisterTimestamp("2026-08-09T14:08:51Z", "registered")).toBe(
      "2026-08-09T14:08:51Z",
    );
  });

  it("秒未満の精度は切り捨てる", () => {
    expect(normalizeRegisterTimestamp("2026-08-09T14:08:51.987Z", "completed")).toBe(
      "2026-08-09T14:08:51Z",
    );
  });

  it("タイムゾーンを含まない表記は、解釈が実行環境に依存するため拒否する", () => {
    expect(() => normalizeRegisterTimestamp("2026-08-09T14:08:51", "registered")).toThrow(
      /Invalid registered: "2026-08-09T14:08:51"\. Must be an RFC 3339 date-time with a time zone/,
    );
  });

  it("日付のみの指定は拒否し、受け付ける書式を例示する", () => {
    expect(() => normalizeRegisterTimestamp("2026-08-09", "completed")).toThrow(
      /2026-08-09T23:08:51\+09:00/,
    );
  });
});

describe("registerDateFromTimestamp", () => {
  it("同じ瞬間でも表示タイムゾーンにより暦日が変わる", () => {
    expect(registerDateFromTimestamp("2026-08-09T15:30:00Z", "UTC")).toBe("2026-08-09");
    expect(registerDateFromTimestamp("2026-08-09T15:30:00Z", "Asia/Tokyo")).toBe("2026-08-10");
  });

  it("保存書式でない値は文脈付きエラーで失敗する", () => {
    expect(() => registerDateFromTimestamp("not-a-timestamp", "UTC")).toThrow(
      /Invalid register timestamp: "not-a-timestamp"/,
    );
  });
});

describe("timestampFromDateInTimeZone", () => {
  it("既定では暦日のプロジェクトタイムゾーン 21:00 を UTC へ変換する", () => {
    expect(timestampFromDateInTimeZone("2026-08-09", "UTC")).toBe("2026-08-09T21:00:00Z");
    expect(timestampFromDateInTimeZone("2026-08-09", "Asia/Tokyo")).toBe("2026-08-09T12:00:00Z");
  });

  it("夏時間のあるタイムゾーンでも、その日のオフセットで変換する", () => {
    // America/New_York は 8 月が -04:00、1 月が -05:00。
    expect(timestampFromDateInTimeZone("2026-08-09", "America/New_York")).toBe(
      "2026-08-10T01:00:00Z",
    );
    expect(timestampFromDateInTimeZone("2026-01-09", "America/New_York")).toBe(
      "2026-01-10T02:00:00Z",
    );
  });

  it("変換した日時から暦日へ戻すと元の日付に一致する", () => {
    for (const timeZone of ["UTC", "Asia/Tokyo", "America/New_York"]) {
      const timestamp = timestampFromDateInTimeZone("2026-03-08", timeZone);

      expect(registerDateFromTimestamp(timestamp, timeZone)).toBe("2026-03-08");
    }
  });

  it("時刻を明示した場合はその壁時計時刻で変換する", () => {
    expect(timestampFromDateInTimeZone("2026-08-09", "Asia/Tokyo", "00:00:00")).toBe(
      "2026-08-08T15:00:00Z",
    );
  });

  it("日付・時刻の書式が不正な場合は文脈付きエラーで失敗する", () => {
    expect(() => timestampFromDateInTimeZone("2026/08/09", "UTC")).toThrow(
      /Invalid register date: "2026\/08\/09"\. Must be YYYY-MM-DD/,
    );
    expect(() => timestampFromDateInTimeZone("2026-08-09", "UTC", "21:00")).toThrow(
      /Invalid time of day: "21:00"\. Must be HH:MM:SS/,
    );
  });
});
