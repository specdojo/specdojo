// `orchestrator watch-scan`: 止まった schedule のタスク・register 項目・列を見つけて理由の種類に分け、
// 見張りのイベントの記録へ 1 件 1 行で足し、朝の報告を書き直す。claim・再開・release・commit はしない。
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { livePoolHolders, isLiveLock } from "../shared/cross-process-lock.js";
import { buildScheduleIndex } from "../shared/schedule-index.js";
import { readRegisterEventsFromContent, registerEventFilePath } from "../register/events.js";
import type { PjrItem } from "../register/item.js";
import { foldEventsToState, readAllEventFiles } from "./events.js";
import { listQueueRecords, queueLockPath, type QueueRecord } from "./queue.js";
import { execRunJoinPoolPath, execRunLockPath } from "./run/lock.js";
import { buildInitialStateFromStrategy } from "./schedule/initial.js";
import type { ExecEventV1 } from "./types.js";
import {
  classifyStall,
  STALL_CATEGORY_LABELS,
  type StallCategory,
  type StallObservation,
  type StallTargetKind,
  type StallText,
} from "./watch-scan-classify.js";

export const WATCH_SCAN_ACTOR = "watch-scan";
const LOG_TAIL_BYTES = 256 * 1024;

export type WatchStalledLine = {
  v: 1;
  ts: string;
  event: "stalled";
  key: string;
  target: { kind: StallTargetKind; id: string };
  state: string;
  since: string;
  category: StallCategory;
  detail: string;
  basis: { source: string; excerpt: string };
  next_action: string;
  by: string;
};

export type WatchClearedLine = {
  v: 1;
  ts: string;
  event: "cleared";
  key: string;
  target: { kind: StallTargetKind; id: string };
  by: string;
};

export type WatchLogLine = WatchStalledLine | WatchClearedLine;

export function watchEventsLogPath(executionPath: string): string {
  return join(executionPath, "watch", "watch-events.jsonl");
}

export function watchReportsDirectory(executionPath: string): string {
  return join(executionPath, "reports", "watch-scan");
}

/** 同じ止まりを見分ける鍵。状態に入った時刻が変われば別の止まりとして数える。 */
export function stallKey(observation: Pick<StallObservation, "kind" | "id" | "state" | "since">) {
  return `${observation.kind}:${observation.id}:${observation.state}:${observation.since}`;
}

// ================================
// Event log
// ================================

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isWatchLogLine(value: unknown): value is WatchLogLine {
  return (
    isRecord(value) &&
    value.v === 1 &&
    (value.event === "stalled" || value.event === "cleared") &&
    typeof value.key === "string" &&
    typeof value.ts === "string" &&
    isRecord(value.target)
  );
}

/** 記録を読む。壊れた行は飛ばし、行番号を warnings へ返す。 */
export function parseWatchLog(
  text: string,
  source: string,
): {
  lines: WatchLogLine[];
  warnings: string[];
} {
  const lines: WatchLogLine[] = [];
  const warnings: string[] = [];
  text.split(/\r?\n/u).forEach((raw, index) => {
    if (!raw.trim()) return;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (isWatchLogLine(parsed)) lines.push(parsed);
      else warnings.push(`${source}:${index + 1}: not a watch-scan line`);
    } catch {
      warnings.push(`${source}:${index + 1}: invalid JSON`);
    }
  });
  return { lines, warnings };
}

/** 記録の上でまだ解けていない止まり（stalled の後に cleared がない鍵）。 */
export function openStalls(lines: readonly WatchLogLine[]): Map<string, WatchStalledLine> {
  const open = new Map<string, WatchStalledLine>();
  for (const line of lines) {
    if (line.event === "stalled") open.set(line.key, line);
    else open.delete(line.key);
  }
  return open;
}

export type WatchScanDiff = {
  appended: WatchLogLine[];
  current: WatchStalledLine[];
};

/**
 * 今回見つけた止まりと記録を比べ、足す行を決める。記録にまだ開いている鍵は足し直さず、
 * 今回見つからなかった開いている鍵には cleared を足す。`current` は報告に載せる今の止まりで、
 * 記録に先にあったものは最初に見つけた行（時刻）を使う。
 */
export function diffWatchScan(
  previous: readonly WatchLogLine[],
  observations: readonly StallObservation[],
  now: string,
): WatchScanDiff {
  const open = openStalls(previous);
  const appended: WatchLogLine[] = [];
  const current: WatchStalledLine[] = [];
  const seen = new Set<string>();
  for (const observation of observations) {
    const key = stallKey(observation);
    if (seen.has(key)) continue;
    seen.add(key);
    const existing = open.get(key);
    if (existing) {
      current.push(existing);
      continue;
    }
    const classified = classifyStall(observation);
    const line: WatchStalledLine = {
      v: 1,
      ts: now,
      event: "stalled",
      key,
      target: { kind: observation.kind, id: observation.id },
      state: observation.state,
      since: observation.since,
      category: classified.category,
      detail: classified.detail,
      basis: classified.basis,
      next_action: classified.nextAction,
      by: WATCH_SCAN_ACTOR,
    };
    appended.push(line);
    current.push(line);
  }
  for (const [key, line] of open) {
    if (seen.has(key)) continue;
    appended.push({
      v: 1,
      ts: now,
      event: "cleared",
      key,
      target: line.target,
      by: WATCH_SCAN_ACTOR,
    });
  }
  return { appended, current };
}

// ================================
// Observations
// ================================

function readTail(path: string): string {
  const size = statSync(path).size;
  const text = readFileSync(path, "utf8");
  return size > LOG_TAIL_BYTES ? text.slice(-LOG_TAIL_BYTES) : text;
}

function repoPath(root: string, path: string): string {
  return relative(root, path).split("\\").join("/");
}

const PARENT_LOG_RE = /^parent-validation-attempt-(\d+)-(.+)\.log$/u;

/**
 * run の記録から分類の材料を読む。親の検証は検査ごとに最後の試行で、失敗したものだけを読む。
 * executor.log は plan と成果物の本文を含み、文言で誤って分けるため読まない。
 */
export function readRunLogs(runDir: string, root: string): StallText[] {
  if (!existsSync(runDir)) return [];
  const latest = new Map<string, { attempt: number; name: string }>();
  for (const name of readdirSync(runDir).sort()) {
    const match = PARENT_LOG_RE.exec(name);
    if (!match) continue;
    const attempt = Number(match[1]);
    const check = match[2]!;
    const prior = latest.get(check);
    if (!prior || prior.attempt < attempt) latest.set(check, { attempt, name });
  }
  const logs: StallText[] = [];
  for (const check of [...latest.keys()].sort()) {
    const path = join(runDir, latest.get(check)!.name);
    const text = readTail(path);
    if (/^exit code: 0$/mu.test(text)) continue;
    logs.push({ source: repoPath(root, path), text });
  }
  const integrate = join(runDir, "integrate.log");
  if (existsSync(integrate))
    logs.push({ source: repoPath(root, integrate), text: readTail(integrate) });
  return logs;
}

function stringMeta(meta: Record<string, unknown> | undefined): Record<string, string> | undefined {
  if (!meta) return undefined;
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(meta)) {
    if (typeof value === "string") result[key] = value;
    else if (typeof value === "number" || typeof value === "boolean") result[key] = String(value);
  }
  return result;
}

export type WatchScanContext = {
  root: string;
  executionPath: string;
  now: Date;
  staleMs: number;
  /** 実行ロックが生きている間は、実行中の状態を中断と見なさない。 */
  runLive: boolean;
};

function isStale(context: WatchScanContext, since: string | undefined): boolean {
  if (!since) return false;
  const time = Date.parse(since);
  return Number.isFinite(time) && context.now.getTime() - time >= context.staleMs;
}

export function isProjectRunLive(executionPath: string): boolean {
  return (
    isLiveLock(execRunLockPath(executionPath)) ||
    livePoolHolders(execRunJoinPoolPath(executionPath)).length > 0
  );
}

/** schedule のタスクのうち、blocked（延期を含む）と、更新が止まった doing。 */
export function collectScheduleObservations(
  schedulePath: string,
  context: WatchScanContext,
): StallObservation[] {
  const schedule = buildScheduleIndex(schedulePath);
  const events = readAllEventFiles(schedulePath);
  const snapshot = foldEventsToState(
    events,
    schedule,
    schedulePath,
    buildInitialStateFromStrategy(schedulePath, schedule),
  );
  const lastBlock = new Map<string, { path: string; event: ExecEventV1 }>();
  for (const entry of events)
    if (entry.event.type === "block") lastBlock.set(entry.event.task_id, entry);
  const observations: StallObservation[] = [];
  for (const taskId of Object.keys(snapshot.tasks).sort()) {
    const state = snapshot.tasks[taskId]!;
    if (state.state === "blocked") {
      const block = lastBlock.get(taskId);
      const meta = stringMeta(block?.event.meta ?? state.meta);
      const evidence = meta?.evidence_ref;
      observations.push({
        kind: "schedule-task",
        id: taskId,
        state: meta?.limit_deferred === "true" ? "deferred" : "blocked",
        since: block?.event.ts ?? state.last_ts ?? "-",
        ...(state.claimed_by ? { actor: state.claimed_by } : {}),
        ...(block
          ? { message: { source: repoPath(context.root, block.path), text: block.event.msg } }
          : {}),
        ...(meta ? { meta } : {}),
        // runner の block は pipeline の段か limit の印を持つ。どちらもないものは手で止めたもの。
        ...(block && !meta?.pipeline_stage && meta?.limit_deferred === undefined
          ? { manual: true }
          : {}),
        logs: evidence ? readRunLogs(dirname(resolve(context.root, evidence)), context.root) : [],
      });
    } else if (state.state === "doing" && !context.runLive && isStale(context, state.last_ts)) {
      observations.push({
        kind: "schedule-task",
        id: taskId,
        state: "doing",
        since: state.last_ts ?? "-",
        ...(state.claimed_by ? { actor: state.claimed_by } : {}),
        logs: [],
        interrupted: true,
      });
    }
  }
  return observations;
}

function latestRegisterRunDir(executionPath: string, id: string): string | undefined {
  const directory = join(executionPath, "runs", "register", id);
  if (!existsSync(directory)) return undefined;
  const runs = readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const last = runs[runs.length - 1];
  return last ? join(directory, last) : undefined;
}

const REGISTER_WATCHED_STATUSES = new Set(["in-progress", "waiting", "review"]);

/** register 項目のうち、`waiting`・`review` と、更新が止まった `in-progress`。 */
export function collectRegisterObservations(
  items: readonly PjrItem[],
  projectRegisterPath: string,
  context: WatchScanContext,
): StallObservation[] {
  const observations: StallObservation[] = [];
  for (const item of [...items].sort((a, b) => a.id.localeCompare(b.id))) {
    if (!REGISTER_WATCHED_STATUSES.has(item.status)) continue;
    const eventsPath = registerEventFilePath(projectRegisterPath, item.id);
    const events = existsSync(eventsPath)
      ? readRegisterEventsFromContent(readFileSync(eventsPath, "utf8"), eventsPath)
      : [];
    const last = events[events.length - 1];
    const since = last?.ts ?? item.registeredAt;
    if (item.status === "in-progress" && (context.runLive || !isStale(context, since))) continue;
    const runDir =
      item.status === "waiting" ? latestRegisterRunDir(context.executionPath, item.id) : undefined;
    observations.push({
      kind: "register-item",
      id: item.id,
      state: item.status,
      since,
      ...(last ? { actor: last.actor } : {}),
      ...(last
        ? { message: { source: repoPath(context.root, eventsPath), text: last.reason } }
        : {}),
      logs: runDir ? readRunLogs(runDir, context.root) : [],
      ...(item.status === "in-progress" ? { interrupted: true } : {}),
    });
  }
  return observations;
}

/** 列のうち、止まった（stopped）ものと、ロックがなく更新が止まった running。 */
export function collectQueueObservations(
  records: readonly QueueRecord[],
  context: WatchScanContext,
  isQueueLive: (queueId: string) => boolean,
): StallObservation[] {
  const observations: StallObservation[] = [];
  for (const record of records) {
    const source = repoPath(
      context.root,
      join(context.executionPath, "queues", `${record.queue_id}.json`),
    );
    if (record.state === "stopped") {
      const step = record.steps.find((item) => item.index === record.stopped_step);
      // 根拠の抜き出しは 1 行目を使うため、止まった段の対象が分かる行を先に置く。
      const text = [
        step ? `step ${step.index} (${step.kind}): specdojo ${step.argv.join(" ")}` : undefined,
        record.reason,
        step?.summary,
      ]
        .filter(Boolean)
        .join("\n");
      observations.push({
        kind: "queue",
        id: record.queue_id,
        state: "stopped",
        since: record.updated_at,
        ...(text ? { message: { source, text } } : {}),
        logs: [],
      });
    } else if (
      record.state === "running" &&
      !isQueueLive(record.queue_id) &&
      isStale(context, record.updated_at)
    ) {
      observations.push({
        kind: "queue",
        id: record.queue_id,
        state: "running",
        since: record.updated_at,
        message: { source, text: "" },
        logs: [],
        interrupted: true,
      });
    }
  }
  return observations;
}

export function isQueueLockLive(executionPath: string, queueId: string): boolean {
  return isLiveLock(queueLockPath(executionPath, queueId));
}

// ================================
// Morning report
// ================================

const TARGET_LABELS: Record<StallTargetKind, string> = {
  "schedule-task": "schedule のタスク",
  "register-item": "register 項目",
  queue: "列",
};

const CATEGORY_ORDER: readonly StallCategory[] = [
  "needs_decision",
  "needs_target_sync",
  "usage_limit",
  "load_timeout",
  "interrupted",
  "unknown",
];

function code(text: string): string {
  const safe = text.replace(/`/gu, "'").replace(/\r?\n/gu, " ").trim() || "-";
  return `\`${safe}\``;
}

/** 報告の日付（register の日付と同じ時間帯）。 */
export function reportDate(now: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function renderWatchReport(options: {
  projectId: string;
  date: string;
  scannedAt: string;
  current: readonly WatchStalledLine[];
  clearedToday: readonly WatchClearedLine[];
  warnings: readonly string[];
}): string {
  const counts = CATEGORY_ORDER.map((category) => {
    const count = options.current.filter((line) => line.category === category).length;
    return `- ${STALL_CATEGORY_LABELS[category]}（${code(category)}）: ${count}`;
  });
  const sections: string[] = [];
  let index = 0;
  for (const category of CATEGORY_ORDER) {
    const lines = options.current
      .filter((line) => line.category === category)
      .sort((a, b) => a.target.id.localeCompare(b.target.id));
    if (lines.length === 0) continue;
    index += 1;
    const items = lines.map((line) =>
      [
        `- ${code(line.target.id)}（${TARGET_LABELS[line.target.kind]}、${code(line.state)}、${code(line.since)} から）`,
        `  - 理由: ${STALL_CATEGORY_LABELS[line.category]}（${code(line.detail)}）`,
        `  - 根拠: ${code(line.basis.source)} の ${code(line.basis.excerpt)}`,
        `  - 次にすべきこと: ${line.next_action}`,
        `  - 最初に見つけた時刻: ${code(line.ts)}`,
      ].join("\n"),
    );
    sections.push(`### 2.${index}. ${STALL_CATEGORY_LABELS[category]}\n\n${items.join("\n")}`);
  }
  const cleared = options.clearedToday.length
    ? options.clearedToday
        .map(
          (line) =>
            `- ${code(line.target.id)}（${TARGET_LABELS[line.target.kind]}、${code(line.ts)}）`,
        )
        .join("\n")
    : "- なし";
  const warnings = options.warnings.length
    ? options.warnings.map((warning) => `- ${code(warning)}`).join("\n")
    : "- なし";
  return `---
specdojo:
  id: ${options.projectId}:watch-scan-report-${options.date.replaceAll("-", "")}
  type: project
  status: draft
  rulebook: none
---

# 見張りの朝報告 ${options.date}

- 最後に見た時刻: ${code(options.scannedAt)}
- 見張りは手を打たない。次にすべきことは人かオーケストレーターが行う。

## 1. 集計

${counts.join("\n")}

## 2. 止まっているもの

${sections.join("\n\n") || "止まっているものはない。"}

## 3. この日に解けたもの

${cleared}

## 4. 読めなかった記録

${warnings}
`;
}

// ================================
// Scan
// ================================

export type WatchScanInput = {
  projectId: string;
  root: string;
  executionPath: string;
  schedulePath?: string;
  register?: { items: readonly PjrItem[]; projectRegisterPath: string };
  timeZone: string;
  now: Date;
  staleMs: number;
  dryRun: boolean;
};

export type WatchScanOutcome = {
  current: WatchStalledLine[];
  appended: WatchLogLine[];
  warnings: string[];
  logPath: string;
  reportPath: string;
};

function attempt<T>(label: string, warnings: string[], read: () => T[]): T[] {
  try {
    return read();
  } catch (error) {
    warnings.push(`${label}: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}

export function runWatchScan(input: WatchScanInput): WatchScanOutcome {
  const warnings: string[] = [];
  const context: WatchScanContext = {
    root: input.root,
    executionPath: input.executionPath,
    now: input.now,
    staleMs: input.staleMs,
    runLive: isProjectRunLive(input.executionPath),
  };
  const observations: StallObservation[] = [
    ...(input.schedulePath
      ? attempt("schedule", warnings, () =>
          collectScheduleObservations(input.schedulePath!, context),
        )
      : []),
    ...(input.register
      ? attempt("register", warnings, () =>
          collectRegisterObservations(
            input.register!.items,
            input.register!.projectRegisterPath,
            context,
          ),
        )
      : []),
    ...attempt("queue", warnings, () => {
      const { records, errors } = listQueueRecords(input.executionPath);
      warnings.push(...errors.map((error) => `queue: ${error}`));
      return collectQueueObservations(records, context, (id) =>
        isQueueLockLive(input.executionPath, id),
      );
    }),
  ];
  const logPath = watchEventsLogPath(input.executionPath);
  const previous = existsSync(logPath)
    ? parseWatchLog(readFileSync(logPath, "utf8"), repoPath(input.root, logPath))
    : { lines: [], warnings: [] };
  warnings.push(...previous.warnings);
  const now = input.now.toISOString().replace(/\.\d{3}Z$/u, "Z");
  const diff = diffWatchScan(previous.lines, observations, now);
  const date = reportDate(input.now, input.timeZone);
  const reportPath = join(
    watchReportsDirectory(input.executionPath),
    `watch-scan-${date.replaceAll("-", "")}.md`,
  );
  const clearedToday = [...previous.lines, ...diff.appended].filter(
    (line): line is WatchClearedLine =>
      line.event === "cleared" && reportDate(new Date(line.ts), input.timeZone) === date,
  );
  if (!input.dryRun) {
    if (diff.appended.length > 0) {
      mkdirSync(dirname(logPath), { recursive: true });
      appendFileSync(
        logPath,
        diff.appended.map((line) => `${JSON.stringify(line)}\n`).join(""),
        "utf8",
      );
    }
    mkdirSync(dirname(reportPath), { recursive: true });
    writeFileSync(
      reportPath,
      renderWatchReport({
        projectId: input.projectId,
        date,
        scannedAt: now,
        current: diff.current,
        clearedToday,
        warnings,
      }),
      "utf8",
    );
  }
  return { current: diff.current, appended: diff.appended, warnings, logPath, reportPath };
}
