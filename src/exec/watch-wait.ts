// `exec watch`: 見張りの記録（`execution/watch/watch-events.jsonl`）を読み、指定した種類の
// イベントが新しく足されるまで待つ。記録を読むだけで、記録・状態・worktree を変えない。
import { closeSync, existsSync, openSync, readSync, statSync } from "node:fs";
import type { WatchLogLine } from "./watch-scan.js";
import { parseWatchLog } from "./watch-scan.js";

/** 上限の時間まで待って何も起きなかったときの終了コード（GNU `timeout` と同じ）。 */
export const EXEC_WATCH_TIMEOUT_EXIT_CODE = 124;

export const WATCH_EVENT_KINDS = [
  "stalled",
  "cleared",
  "remedy",
  "remedy_stopped",
  "paused",
  "resumed",
] as const;
export type WatchEventKind = (typeof WATCH_EVENT_KINDS)[number];

export type WatchEventFilter = {
  events: ReadonlySet<WatchEventKind>;
  /** `stalled` の止まった状態、`cleared` の解けた後の状態（`waiting`・`done` など）。 */
  states?: ReadonlySet<string>;
  categories?: ReadonlySet<string>;
  targets?: ReadonlySet<string>;
};

export function matchesWatchEvent(line: WatchLogLine, filter: WatchEventFilter): boolean {
  if (!filter.events.has(line.event)) return false;
  if (filter.targets && !filter.targets.has(line.target.id)) return false;
  if (filter.states) {
    const state = line.event === "stalled" || line.event === "cleared" ? line.state : undefined;
    if (!state || !filter.states.has(state)) return false;
  }
  if (filter.categories) {
    const category =
      line.event === "stalled" || line.event === "remedy" || line.event === "remedy_stopped"
        ? line.category
        : undefined;
    if (!category || !filter.categories.has(category)) return false;
  }
  return true;
}

/** 記録の今の大きさ。待ち始めた位置として使う。ファイルがなければ 0。 */
export function watchLogSize(path: string): number {
  return existsSync(path) ? statSync(path).size : 0;
}

/**
 * `offset` から後ろの記録を読む。最後の行が書きかけなら読まずに位置を残す。
 * 記録が短くなっていれば（作り直された）、先頭から読み直す。
 */
export function readWatchLogFrom(
  path: string,
  offset: number,
): { lines: WatchLogLine[]; offset: number; warnings: string[] } {
  if (!existsSync(path)) return { lines: [], offset: 0, warnings: [] };
  const size = statSync(path).size;
  const start = size < offset ? 0 : offset;
  if (size === start) return { lines: [], offset: start, warnings: [] };
  const buffer = Buffer.alloc(size - start);
  const fd = openSync(path, "r");
  try {
    readSync(fd, buffer, 0, buffer.length, start);
  } finally {
    closeSync(fd);
  }
  const lastNewline = buffer.lastIndexOf(0x0a);
  if (lastNewline < 0) return { lines: [], offset: start, warnings: [] };
  const complete = buffer.subarray(0, lastNewline + 1).toString("utf8");
  const parsed = parseWatchLog(complete, path);
  return { lines: parsed.lines, offset: start + lastNewline + 1, warnings: parsed.warnings };
}

export type WaitForWatchEventsInput = {
  logPath: string;
  filter: WatchEventFilter;
  /** 読み始める位置。既定は待ち始めたときの記録の終わり。 */
  offset?: number;
  /** この時刻以降の行も対象にする（`--since`）。指定すると記録の先頭から読む。 */
  since?: string;
  timeoutMs?: number;
  intervalMs: number;
  now?: () => number;
  sleep?: (ms: number) => Promise<void>;
};

export type WaitForWatchEventsOutcome =
  | { status: "matched"; lines: WatchLogLine[]; warnings: string[] }
  | { status: "timeout"; warnings: string[] };

function defaultSleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 指定した種類のイベントが足されるまで待つ。同じ回に読めた当たる行をすべて返す。 */
export async function waitForWatchEvents(
  input: WaitForWatchEventsInput,
): Promise<WaitForWatchEventsOutcome> {
  const now = input.now ?? Date.now;
  const sleep = input.sleep ?? defaultSleep;
  const deadline = input.timeoutMs === undefined ? undefined : now() + input.timeoutMs;
  const sinceMs = input.since === undefined ? undefined : Date.parse(input.since);
  let offset = sinceMs !== undefined ? 0 : (input.offset ?? watchLogSize(input.logPath));
  const warnings: string[] = [];
  for (;;) {
    const read = readWatchLogFrom(input.logPath, offset);
    offset = read.offset;
    warnings.push(...read.warnings);
    const lines = read.lines.filter(
      (line) =>
        matchesWatchEvent(line, input.filter) &&
        (sinceMs === undefined || Date.parse(line.ts) >= sinceMs),
    );
    if (lines.length > 0) return { status: "matched", lines, warnings };
    if (deadline !== undefined && now() >= deadline) return { status: "timeout", warnings };
    const wait =
      deadline === undefined ? input.intervalMs : Math.min(input.intervalMs, deadline - now());
    await sleep(Math.max(0, wait));
  }
}

/** 人が読む 1 行。`--json` では記録の行をそのまま出す。 */
export function formatWatchEvent(line: WatchLogLine): string {
  switch (line.event) {
    case "stalled":
      return `${line.ts} stalled ${line.target.id} (${line.target.kind}) ${line.state} → ${line.category}/${line.detail}; next: ${line.next_action}`;
    case "cleared":
      return `${line.ts} cleared ${line.target.id} (${line.target.kind})${line.state ? ` → ${line.state}` : ""}`;
    case "remedy":
      return `${line.ts} remedy ${line.target.id} (${line.target.kind}) ${line.action} (${line.attempt}/${line.max_attempts}): specdojo ${line.argv.join(" ")}; log: ${line.log}`;
    case "remedy_stopped":
      return `${line.ts} remedy_stopped ${line.target.id} (${line.target.kind}): ${line.reason}`;
    case "paused":
    case "resumed":
      return `${line.ts} ${line.event} ${line.target.id === "*" ? "the whole watch" : line.target.id} by ${line.by}${line.reason ? ` (${line.reason})` : ""}`;
  }
}
