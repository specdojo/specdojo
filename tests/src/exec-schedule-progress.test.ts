import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildProgressSummaryLines,
  type ProgressSummaryInput,
} from "../../src/exec-schedule-progress.js";
import type { ScheduleIndex } from "../../src/exec-types.js";

function makeSchedule(): ScheduleIndex {
  return {
    nodes: new Map(),
    files: [],
    start_date: null,
    calendar: {
      timezone: "UTC",
      workdays: new Set([1, 2, 3, 4, 5]),
      holidays: new Set<string>(),
      work_hours_per_day: 8,
    },
    section_labels: {},
  };
}

function makeInput(overrides: Partial<ProgressSummaryInput> = {}): ProgressSummaryInput {
  return {
    cpm: {
      schedule_path: "docs/schedule",
      project_start_date: "2026-06-01",
      project_duration_days: 10,
      nodes: {},
      critical_path: [],
    },
    schedule: makeSchedule(),
    stateCounts: { todo: 10, doing: 0, blocked: 0, done: 0, cancelled: 0 },
    totalTaskCount: 10,
    readyCount: 2,
    nextTaskId: "T-001",
    criticalDoingCount: 0,
    ...overrides,
  };
}

function judgementLine(lines: string[]): string {
  const line = lines.find((item) => item.startsWith("- 判定: "));
  expect(line).toBeDefined();
  return line!;
}

// 2026-06-01 は月曜日
describe("buildProgressSummaryLines", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("開始日未設定の場合は「要確認」と判定する", () => {
    const input = makeInput();
    input.cpm.project_start_date = null;

    const lines = buildProgressSummaryLines(input);

    expect(judgementLine(lines)).toBe("- 判定: 要確認");
  });

  it("開始日前かつ未着手の場合は「開始前」と判定する", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(Date.UTC(2026, 4, 25)));

    const lines = buildProgressSummaryLines(makeInput());

    expect(judgementLine(lines)).toBe("- 判定: 開始前");
    expect(lines.join("\n")).toContain("2026-06-01");
  });

  it("開始日前でも着手済みなら「前倒しで進行中」と判定する", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(Date.UTC(2026, 4, 25)));

    const lines = buildProgressSummaryLines(
      makeInput({ stateCounts: { todo: 9, doing: 1, blocked: 0, done: 0, cancelled: 0 } }),
    );

    expect(judgementLine(lines)).toBe("- 判定: 前倒しで進行中");
  });

  it("blocked があると「遅れ気味」と判定し blocked 件数を要因に挙げる", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(Date.UTC(2026, 5, 1)));

    const lines = buildProgressSummaryLines(
      makeInput({ stateCounts: { todo: 9, doing: 0, blocked: 1, done: 0, cancelled: 0 } }),
    );

    expect(judgementLine(lines)).toBe("- 判定: 遅れ気味");
    expect(lines.join("\n")).toContain("blocked が 1 件");
  });

  it("実績が計画進捗を10ポイント超下回ると「遅れ気味」と判定する", () => {
    // 開始から5稼働日経過 / 全10日 → 計画進捗50%、実績0%
    vi.useFakeTimers();
    vi.setSystemTime(new Date(Date.UTC(2026, 5, 8)));

    const lines = buildProgressSummaryLines(makeInput());

    expect(judgementLine(lines)).toBe("- 判定: 遅れ気味");
    expect(lines.join("\n")).toContain("計画消化ペース");
  });

  it("予定完了日を超えて未完了なら「遅延」と判定する", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(Date.UTC(2026, 5, 8)));

    const lines = buildProgressSummaryLines(
      makeInput({
        cpm: {
          schedule_path: "docs/schedule",
          project_start_date: "2026-06-01",
          project_duration_days: 1,
          nodes: {
            "T-001": {
              id: "T-001",
              kind: "task",
              duration_days: 1,
              es: 0,
              ef: 1,
              ls: 0,
              lf: 1,
              slack: 0,
              depends_on: [],
              schedule_file: "schedule.yaml",
            },
          },
          critical_path: ["T-001"],
        },
        totalTaskCount: 1,
        stateCounts: { todo: 1, doing: 0, blocked: 0, done: 0, cancelled: 0 },
      }),
    );

    expect(judgementLine(lines)).toBe("- 判定: 遅延");
    expect(lines.join("\n")).toContain("予定完了日");
  });

  it("計画に対して大きな遅れがなければ「順調」と判定する", () => {
    // 開始日当日は計画進捗0%なので、実績0%でも順調
    vi.useFakeTimers();
    vi.setSystemTime(new Date(Date.UTC(2026, 5, 1)));

    const lines = buildProgressSummaryLines(makeInput());

    expect(judgementLine(lines)).toBe("- 判定: 順調");
  });

  it("done と doing の半分を実績進捗に換算する", () => {
    // done 4 + doing 2 * 0.5 = 5 / 10 → 50.0%
    vi.useFakeTimers();
    vi.setSystemTime(new Date(Date.UTC(2026, 5, 8)));

    const lines = buildProgressSummaryLines(
      makeInput({ stateCounts: { todo: 4, doing: 2, blocked: 0, done: 4, cancelled: 0 } }),
    );

    expect(judgementLine(lines)).toBe("- 判定: 順調");
    expect(lines.join("\n")).toContain("50.0%");
  });

  it("進捗サマリーとアクション案のセクション見出しを出力する", () => {
    const lines = buildProgressSummaryLines(makeInput());

    expect(lines).toContain("## 進捗サマリー");
    expect(lines).toContain("## 今後のアクション案");
  });
});
