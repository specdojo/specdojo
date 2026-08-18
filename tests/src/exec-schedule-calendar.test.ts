import { describe, expect, it } from "vitest";
import {
  addWorkingDaysToDate,
  addWorkingDayOffset,
  buildWorkingTaskSegments,
  countWorkingDaysBetween,
  dateForWorkingOffset,
  isWorkingDateUtc,
  ganttChartPositionX,
  ganttChartStartDate,
  workingMinutesPerDay,
} from "../../src/exec-schedule-calendar.js";
import type { ScheduleCalendar } from "../../src/exec-types.js";

// 2026-01-02 は金曜日、2026-01-05 は月曜日
function makeCalendar(overrides: Partial<ScheduleCalendar> = {}): ScheduleCalendar {
  return {
    timezone: "UTC",
    workdays: new Set([1, 2, 3, 4, 5]),
    holidays: new Set<string>(),
    work_hours_per_day: 8,
    ...overrides,
  };
}

describe("workingMinutesPerDay", () => {
  it("8時間勤務は480分を返す", () => {
    expect(workingMinutesPerDay(makeCalendar())).toBe(480);
  });

  it("0時間勤務でも最低1分を返す", () => {
    expect(workingMinutesPerDay(makeCalendar({ work_hours_per_day: 0 }))).toBe(1);
  });
});

describe("isWorkingDateUtc", () => {
  it("平日は稼働日", () => {
    expect(isWorkingDateUtc(new Date(Date.UTC(2026, 0, 2)), makeCalendar())).toBe(true);
  });

  it("土曜日は非稼働日", () => {
    expect(isWorkingDateUtc(new Date(Date.UTC(2026, 0, 3)), makeCalendar())).toBe(false);
  });

  it("holidays に含まれる平日は非稼働日", () => {
    const calendar = makeCalendar({ holidays: new Set(["2026-01-02"]) });
    expect(isWorkingDateUtc(new Date(Date.UTC(2026, 0, 2)), calendar)).toBe(false);
  });
});

describe("addWorkingDayOffset", () => {
  it("オフセット0は稼働日の始業時刻を返す", () => {
    const actual = addWorkingDayOffset("2026-01-02", 0, makeCalendar());
    expect(actual.toISOString()).toBe("2026-01-02T00:00:00.000Z");
  });

  it("非稼働日開始はまず次の稼働日に進める", () => {
    // 2026-01-03 は土曜日
    const actual = addWorkingDayOffset("2026-01-03", 0, makeCalendar());
    expect(actual.toISOString()).toBe("2026-01-05T00:00:00.000Z");
  });

  it("金曜日に1日進めると週末を跨いで月曜日になる", () => {
    const actual = addWorkingDayOffset("2026-01-02", 1, makeCalendar());
    expect(actual.toISOString()).toBe("2026-01-05T00:00:00.000Z");
  });

  it("0.5日は稼働時間の半分（4時間）だけ進める", () => {
    const actual = addWorkingDayOffset("2026-01-02", 0.5, makeCalendar());
    expect(actual.toISOString()).toBe("2026-01-02T04:00:00.000Z");
  });

  it("翌稼働日が holidays ならさらに翌日に進める", () => {
    const calendar = makeCalendar({ holidays: new Set(["2026-01-05"]) });
    const actual = addWorkingDayOffset("2026-01-02", 1, calendar);
    expect(actual.toISOString()).toBe("2026-01-06T00:00:00.000Z");
  });

  it("有効な稼働曜日がなければ無限ループせずエラーにする", () => {
    const calendar = makeCalendar({ workdays: new Set() });
    expect(() => addWorkingDayOffset("2026-01-02", 1, calendar)).toThrow(
      "calendar.workdays must contain at least one weekday",
    );
  });
});

describe("buildWorkingTaskSegments", () => {
  it("1日タスクは1稼働日分のセグメントを返す", () => {
    const segments = buildWorkingTaskSegments("2026-01-02", 0, 1, makeCalendar());
    expect(segments).toHaveLength(1);
    expect(segments[0].start.toISOString()).toBe("2026-01-02T00:00:00.000Z");
    expect(segments[0].end.toISOString()).toBe("2026-01-02T08:00:00.000Z");
  });

  it("週末を跨ぐ2日タスクは金曜と月曜の2セグメントに分割する", () => {
    const segments = buildWorkingTaskSegments("2026-01-02", 0, 2, makeCalendar());
    expect(segments).toHaveLength(2);
    expect(segments[0].start.toISOString()).toBe("2026-01-02T00:00:00.000Z");
    expect(segments[0].end.toISOString()).toBe("2026-01-02T08:00:00.000Z");
    expect(segments[1].start.toISOString()).toBe("2026-01-05T00:00:00.000Z");
    expect(segments[1].end.toISOString()).toBe("2026-01-05T08:00:00.000Z");
  });

  it("0.5日タスクは半日分のセグメントを返す", () => {
    const segments = buildWorkingTaskSegments("2026-01-02", 0, 0.5, makeCalendar());
    expect(segments).toHaveLength(1);
    expect(segments[0].end.toISOString()).toBe("2026-01-02T04:00:00.000Z");
  });

  it("開始オフセット付きタスクはオフセット後の稼働時刻から開始する", () => {
    const segments = buildWorkingTaskSegments("2026-01-02", 1, 1, makeCalendar());
    expect(segments).toHaveLength(1);
    expect(segments[0].start.toISOString()).toBe("2026-01-05T00:00:00.000Z");
  });
});

describe("dateForWorkingOffset", () => {
  it("startDate があれば稼働日ベースで進めた日付を返す", () => {
    const actual = dateForWorkingOffset(1, "2026-01-02", makeCalendar());
    expect(actual.toISOString()).toBe("2026-01-05T00:00:00.000Z");
  });

  it("startDate がなければ 2000-01-01 起点の連続時間で計算する", () => {
    const actual = dateForWorkingOffset(1, null, makeCalendar());
    expect(actual.toISOString()).toBe("2000-01-01T08:00:00.000Z");
  });
});

describe("ganttChartPositionX", () => {
  it("稼働時間の途中は日内比率を dayWidth に掛けた位置になる", () => {
    const ganttChartStart = new Date(Date.UTC(2026, 0, 2));
    const dt = new Date(Date.UTC(2026, 0, 2, 4, 0));
    expect(ganttChartPositionX(dt, ganttChartStart, makeCalendar(), 10)).toBe(5);
  });

  it("翌日の始業時刻は dayWidth 1日分進んだ位置になる", () => {
    const ganttChartStart = new Date(Date.UTC(2026, 0, 2));
    const dt = new Date(Date.UTC(2026, 0, 3, 0, 0));
    expect(ganttChartPositionX(dt, ganttChartStart, makeCalendar(), 10)).toBe(10);
  });
});

describe("ganttChartStartDate", () => {
  it("startDate を UTC 日付として解釈する", () => {
    expect(ganttChartStartDate("2026-01-02").toISOString()).toBe("2026-01-02T00:00:00.000Z");
  });

  it("startDate がなければ 2000-01-01 を返す", () => {
    expect(ganttChartStartDate(null).toISOString()).toBe("2000-01-01T00:00:00.000Z");
  });
});

describe("addWorkingDaysToDate", () => {
  it("週末を跨いでもカーソルを進め、指定した稼働日数を加算する", () => {
    expect(addWorkingDaysToDate("2026-01-02", 2, makeCalendar())).toBe("2026-01-06");
  });

  it("翌稼働日が休日ならさらに次の稼働日まで進める", () => {
    const calendar = makeCalendar({ holidays: new Set(["2026-01-05"]) });
    expect(addWorkingDaysToDate("2026-01-02", 1, calendar)).toBe("2026-01-06");
  });

  it("有効な稼働曜日がなければ無限ループせずエラーにする", () => {
    const calendar = makeCalendar({ workdays: new Set() });
    expect(() => addWorkingDaysToDate("2026-01-02", 1, calendar)).toThrow(
      "calendar.workdays must contain at least one weekday",
    );
  });

  it("不正な日付ならエラーにする", () => {
    expect(() => addWorkingDaysToDate("2026-02-30", 1, makeCalendar())).toThrow(
      "invalid date-only value",
    );
  });
});

describe("countWorkingDaysBetween", () => {
  it("開始日と終了日を含めず、間にある稼働日だけを数える", () => {
    expect(countWorkingDaysBetween("2026-01-05", "2026-01-09", makeCalendar())).toBe(3);
  });

  it("週末を除外して数える", () => {
    expect(countWorkingDaysBetween("2026-01-02", "2026-01-06", makeCalendar())).toBe(1);
  });
});
