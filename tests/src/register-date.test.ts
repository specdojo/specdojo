import { afterEach, describe, expect, it, vi } from "vitest";
import {
  formatDateInTimeZone,
  resolveRegisterDateTimeZone,
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
