import { existsSync, readFileSync } from "node:fs";
import {
  isRecord,
  isRoutineEntryDue,
  type RoutineDoc,
  type RoutineRunHistoryEntry,
  type RoutineStateEntry,
} from "./definition.js";

// routine status が読む履歴。壊れた行は読み飛ばし、状態の表示を止めない（検証は dashboard 側）。
export function readRoutineHistoryLenient(runsPath: string): RoutineRunHistoryEntry[] {
  if (!existsSync(runsPath)) return [];
  const entries: RoutineRunHistoryEntry[] = [];
  for (const line of readFileSync(runsPath, "utf8").split(/\r?\n/)) {
    if (!line.trim()) continue;
    let value: unknown;
    try {
      value = JSON.parse(line);
    } catch {
      continue;
    }
    if (
      isRecord(value) &&
      typeof value.routine_id === "string" &&
      typeof value.scheduled_for === "string" &&
      typeof value.started_at === "string" &&
      typeof value.result === "string"
    ) {
      entries.push(value as RoutineRunHistoryEntry);
    }
  }
  return entries;
}

function formatHistoryEntry(entry: RoutineRunHistoryEntry): string {
  const details = [
    entry.skip_reason,
    entry.retry_pending ? "retry pending" : undefined,
    entry.reason,
  ].filter((item): item is string => typeof item === "string" && item.length > 0);
  const suffix = details.length ? ` (${details.join(", ")})` : "";
  return `    ${entry.started_at}  scheduled_for=${entry.scheduled_for}  ${entry.result}${suffix}`;
}

/**
 * 1 routine ぶんの状態を行の配列で返す。busy skip の流し直し待ちは `busy skips` 行で示し、
 * 直近の履歴には skip の内訳（busy / precondition）と流し直し待ちを添える。
 */
export function formatRoutineStatus(
  doc: RoutineDoc,
  entry: RoutineStateEntry | undefined,
  history: RoutineRunHistoryEntry[],
  now: Date,
  limit: number,
): string[] {
  const enabled = doc.enabled !== false;
  const lines = [
    `${doc.id}${doc.name ? `  ${doc.name}` : ""}`,
    `  schedule:     ${doc.interval ?? (doc.trigger ? `cron ${doc.trigger.cron} (${doc.trigger.timezone})` : "-")}${doc.policy?.missed_run ? `  missed_run=${doc.policy.missed_run}` : ""}`,
    `  enabled:      ${enabled ? "yes" : "no"}`,
    `  due:          ${enabled && isRoutineEntryDue(doc, entry, now) ? "due" : "-"}`,
    `  last run:     ${entry?.last_run ? `${entry.last_run} (${entry.last_result ?? "-"}${entry.last_skip_reason ? `, ${entry.last_skip_reason}` : ""})` : "-"}`,
  ];
  if (doc.trigger) lines.push(`  scheduled to: ${entry?.last_scheduled_for ?? "-"}`);
  if (entry?.last_reason) lines.push(`  last reason:  ${entry.last_reason}`);
  if ((entry?.busy_skip_count ?? 0) > 0) {
    lines.push(`  busy skips:   ${entry?.busy_skip_count} (retried on the next routine run --due)`);
  }
  const recent = history.filter((item) => item.routine_id === doc.id).slice(-limit);
  lines.push(`  recent runs:${recent.length ? "" : " -"}`);
  for (const item of recent) lines.push(formatHistoryEntry(item));
  return lines;
}
