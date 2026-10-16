import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { load } from "../yaml.js";
import { readJson } from "../exec-shared.js";
import {
  type RoutineDoc,
  cronMatches,
  cronOccurrences,
  isRoutineDue,
  routineActionKindLabel,
  type RoutineExecutionResult,
  type RoutineRunHistoryEntry,
} from "../routine/routine.js";

export type DashboardRoutineRow = {
  id: string;
  name?: string;
  enabled: boolean;
  schedule: string;
  kind: string;
  lastRun: string;
  due: "due" | "-" | "disabled";
};

type RoutineAggregates = {
  rows: DashboardRoutineRow[];
  docs: RoutineDoc[];
  history: RoutineRunHistoryEntry[];
  error?: string;
};

export type DashboardRoutineStateEntry = {
  last_run?: string;
  last_result?: string;
  last_scheduled_for?: string;
};

// routine ファイル（rtn-*.yaml）を読み、状態ファイル generated/routine-state.json と突き合わせて
// 最終実行・実行結果・due 状況を得る。CLI 出力（routine list）の転記に依存しない。
export function aggregateRoutines(routinesPath: string | undefined): RoutineAggregates {
  if (!routinesPath || !existsSync(routinesPath)) return { rows: [], docs: [], history: [] };

  const result: RoutineAggregates = {
    rows: [],
    docs: [],
    history: readRoutineRunHistory(join(routinesPath, "generated", "routine-runs.jsonl")),
    error: undefined,
  };
  const stateEntries = readRoutineStateEntries(
    join(routinesPath, "generated", "routine-state.json"),
  );
  const now = new Date();

  const files = readdirSync(routinesPath)
    .filter((name) => /^rtn-.*\.(ya?ml)$/.test(name))
    .sort();

  for (const file of files) {
    try {
      const doc = parseRoutineFileSafe(join(routinesPath, file));
      if (!doc?.id || typeof doc.id !== "string") continue;
      result.docs.push(doc);
      buildRoutineRow(result, doc, stateEntries, now);
    } catch {
      result.error = `routine file parse failed: ${file}`;
    }
  }

  result.rows.sort((a, b) => a.id.localeCompare(b.id));
  return result;
}

export function readRoutineRunHistory(historyPath: string): RoutineRunHistoryEntry[] {
  if (!existsSync(historyPath)) return [];
  const entries: RoutineRunHistoryEntry[] = [];
  for (const [index, line] of readFileSync(historyPath, "utf8").split(/\r?\n/).entries()) {
    if (!line.trim()) continue;
    try {
      const value = JSON.parse(line) as RoutineRunHistoryEntry;
      if (
        value.version === 1 &&
        typeof value.routine_id === "string" &&
        typeof value.scheduled_for === "string" &&
        typeof value.started_at === "string" &&
        typeof value.completed_at === "string" &&
        ["success", "failure", "skipped"].includes(value.result) &&
        Array.isArray(value.job_run_ids)
      ) {
        entries.push(value);
      } else {
        throw new Error("invalid routine history entry");
      }
    } catch {
      throw new Error(`routine history parse failed at line ${index + 1}`);
    }
  }
  return entries;
}

export type DashboardDailyRoutineRow = {
  day: "昨日" | "本日";
  routineId: string;
  scheduledFor: string;
  startedAt: string;
  completedAt: string;
  result: RoutineExecutionResult | "予定" | "未実行";
  jobRunIds: string[];
  /** 同じ routine・同じ日の実行をまとめた件数。1 は単独行。 */
  runCount: number;
};

// 毎時の dashboard 更新のように 1 日に何度も動く routine は、日ごとに 1 行へまとめる。
export const ROUTINE_ROW_COLLAPSE_THRESHOLD = 3;

export function formatZonedDateTime(iso: string, timeZone: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string): string => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("month")}-${get("day")} ${get("hour")}:${get("minute")}`;
}

export function zonedDateKey(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function previousDateKey(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const previous = new Date(Date.UTC(year, month - 1, day - 1));
  return previous.toISOString().slice(0, 10);
}

function scheduledToday(doc: RoutineDoc, today: string, now: Date, timeZone: string): Date[] {
  if (!doc.trigger || doc.enabled === false) return [];
  const start = Math.floor((now.getTime() - 36 * 60 * 60 * 1000) / 60_000) * 60_000;
  const end = Math.floor((now.getTime() + 36 * 60 * 60 * 1000) / 60_000) * 60_000;
  const matches: Date[] = [];
  for (let cursor = start; cursor <= end; cursor += 60_000) {
    const candidate = new Date(cursor);
    if (
      zonedDateKey(candidate, timeZone) === today &&
      cronMatches(doc.trigger.cron, doc.trigger.timezone, candidate)
    ) {
      matches.push(candidate);
    }
  }
  return matches;
}

export function buildDailyRoutineRows(
  docs: RoutineDoc[],
  history: RoutineRunHistoryEntry[],
  now: Date,
  timeZone = "Asia/Tokyo",
): DashboardDailyRoutineRow[] {
  const today = zonedDateKey(now, timeZone);
  const yesterday = previousDateKey(today);
  const rows: DashboardDailyRoutineRow[] = history
    .filter((entry) => {
      const key = zonedDateKey(new Date(entry.scheduled_for), timeZone);
      return key === yesterday || key === today;
    })
    .map((entry) => ({
      day: zonedDateKey(new Date(entry.scheduled_for), timeZone) === yesterday ? "昨日" : "本日",
      routineId: entry.routine_id,
      scheduledFor: entry.scheduled_for,
      startedAt: entry.started_at,
      completedAt: entry.completed_at,
      result: entry.result,
      jobRunIds: entry.job_run_ids,
      runCount: 1,
    }));
  const completedKeys = new Set(
    history.map(
      (entry) => `${entry.routine_id}:${new Date(entry.scheduled_for).toISOString().slice(0, 16)}`,
    ),
  );
  for (const doc of docs) {
    for (const scheduledFor of scheduledToday(doc, today, now, timeZone)) {
      const key = `${doc.id}:${scheduledFor.toISOString().slice(0, 16)}`;
      if (completedKeys.has(key)) continue;
      rows.push({
        day: "本日",
        routineId: doc.id,
        scheduledFor: scheduledFor.toISOString(),
        startedAt: "-",
        completedAt: "-",
        // 予定時刻を過ぎても履歴がなければ、skip や cron 停止で動かなかったことを示す。
        result: scheduledFor.getTime() <= now.getTime() ? "未実行" : "予定",
        jobRunIds: [],
        runCount: 1,
      });
    }
  }
  return collapseFrequentRoutineRows(rows).sort(
    (a, b) =>
      a.scheduledFor.localeCompare(b.scheduledFor) || a.routineId.localeCompare(b.routineId),
  );
}

// 同じ routine・同じ日の行が閾値以上あれば、最新の実行 1 行に件数をまとめる。
export function collapseFrequentRoutineRows(
  rows: DashboardDailyRoutineRow[],
): DashboardDailyRoutineRow[] {
  const groups = new Map<string, DashboardDailyRoutineRow[]>();
  for (const row of rows) {
    const key = `${row.day}:${row.routineId}`;
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }
  const collapsed: DashboardDailyRoutineRow[] = [];
  for (const group of groups.values()) {
    if (group.length < ROUTINE_ROW_COLLAPSE_THRESHOLD) {
      collapsed.push(...group);
      continue;
    }
    const executed = group.filter((row) => row.result !== "予定" && row.result !== "未実行");
    const latest = [...(executed.length > 0 ? executed : group)].sort((a, b) =>
      b.scheduledFor.localeCompare(a.scheduledFor),
    )[0];
    const failures = executed.filter((row) => row.result === "failure").length;
    collapsed.push({
      ...latest,
      runCount: executed.length > 0 ? executed.length : group.length,
      jobRunIds: [],
      result: failures > 0 ? "failure" : latest.result,
    });
  }
  return collapsed;
}

// generated/routine-state.json の routines.<id> が状態の正本。破損時は空。
function readRoutineStateEntries(statePath: string): Record<string, DashboardRoutineStateEntry> {
  const entries: Record<string, DashboardRoutineStateEntry> = {};
  if (!existsSync(statePath)) return entries;

  try {
    const parsed = readJson(statePath) as Record<string, unknown>;
    const routines = parsed?.routines;
    if (routines && typeof routines === "object") {
      for (const [id, value] of Object.entries(routines as Record<string, unknown>)) {
        if (value && typeof value === "object") {
          const entry = value as Record<string, unknown>;
          entries[id] = {
            last_run: typeof entry.last_run === "string" ? entry.last_run : undefined,
            last_result: typeof entry.last_result === "string" ? entry.last_result : undefined,
            last_scheduled_for:
              typeof entry.last_scheduled_for === "string" ? entry.last_scheduled_for : undefined,
          };
        }
      }
    }
  } catch {
    return {};
  }

  return entries;
}

function parseRoutineFileSafe(filePath: string): RoutineDoc | undefined {
  let parsed: unknown;
  try {
    parsed = load(readFileSync(filePath, "utf8"));
  } catch {
    return undefined;
  }
  if (!parsed || typeof parsed !== "object") return undefined;
  return parsed as RoutineDoc;
}

// routine 1 行を機械可読な正本から集計し、due は now と状態から判定する。
function buildRoutineRow(
  result: RoutineAggregates,
  doc: RoutineDoc,
  stateEntries: Record<string, DashboardRoutineStateEntry>,
  now: Date,
): void {
  const id = String(doc.id);
  const enabled = doc.enabled === undefined ? true : (doc.enabled as boolean);
  const kind = doc.action ? routineActionKindLabel(doc.action) : "-";

  const stateEntry = stateEntries[id];
  let lastRun = "-";
  if (stateEntry?.last_run) {
    lastRun = stateEntry.last_result
      ? `${stateEntry.last_run} (${stateEntry.last_result})`
      : stateEntry.last_run;
  }

  result.rows.push({
    id,
    name: typeof doc.name === "string" ? doc.name : undefined,
    enabled,
    schedule: routineScheduleLabel(doc),
    kind,
    lastRun,
    due: computeRoutineDue(doc, stateEntry, enabled, now),
  });
}

// interval / trigger + 現在時刻 + 状態（last_run / last_scheduled_for）から due を機械的に判定する。
export function computeRoutineDue(
  doc: RoutineDoc,
  stateEntry: DashboardRoutineStateEntry | undefined,
  enabled: boolean,
  now: Date,
): "due" | "-" | "disabled" {
  if (!enabled) return "disabled";

  if (doc.trigger) {
    const occurrences = cronOccurrences(doc, stateEntry?.last_scheduled_for, now);
    return occurrences.length > 0 ? "due" : "-";
  }
  if (doc.interval) {
    return isRoutineDue(doc, stateEntry?.last_run, now) ? "due" : "-";
  }

  return "-";
}

// interval / trigger を表すラベル。interval 優先、なければ trigger.cron。
function routineScheduleLabel(doc: RoutineDoc): string {
  if (typeof doc.interval === "string") return doc.interval;
  const trigger = doc.trigger;
  if (trigger && typeof trigger.cron === "string") return `cron: ${trigger.cron}`;
  return "-";
}
