// 見張り（`orchestrator watch-scan`）と、立ち上げたままのオーケストレーターや人の作業を共存させる。
// 見張りの停止と再開（全体・対象ごと）の印と、手で始めた run や直しの途中の対象を見分ける規則を持つ。
// 手当て（PJR-3M4M）も、ここの `decideWatchHold` と `watchActionGate` を通してから手を打つ。
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, sep } from "node:path";
import { isLiveLock, livePoolHolders } from "../shared/cross-process-lock.js";
import { execRunJoinPoolPath, execRunLockPath } from "./run/lock.js";
import type { StallObservation } from "./watch-scan-classify.js";

/** プロジェクトの実行ロック（主と `--join` の枠）を、生きている run が持っている。 */
export function isProjectRunLive(executionPath: string): boolean {
  return (
    isLiveLock(execRunLockPath(executionPath)) ||
    livePoolHolders(execRunJoinPoolPath(executionPath)).length > 0
  );
}

export const WATCH_ALL_TARGETS = "*";

export function watchDirectory(executionPath: string): string {
  return join(executionPath, "watch");
}

export function watchEventsLogPath(executionPath: string): string {
  return join(watchDirectory(executionPath), "watch-events.jsonl");
}

export function watchControlPath(executionPath: string): string {
  return join(watchDirectory(executionPath), "watch-control.json");
}

export type WatchPauseMark = { by: string; at: string; reason?: string };

/** 見張りの停止の印。`all` は全体、`targets` は対象 ID ごとの「見張りの対象外」の印。 */
export type WatchControl = {
  v: 1;
  all?: WatchPauseMark;
  targets: Record<string, WatchPauseMark>;
};

/** 停止と再開を見張りの記録へ残す行。`exec watch` はこの行も待てる。 */
export type WatchControlLine = {
  v: 1;
  ts: string;
  event: "paused" | "resumed";
  key: string;
  target: { kind: "watch-control"; id: string };
  by: string;
  reason?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseMark(value: unknown): WatchPauseMark | undefined {
  if (!isRecord(value) || typeof value.by !== "string" || typeof value.at !== "string")
    return undefined;
  return {
    by: value.by,
    at: value.at,
    ...(typeof value.reason === "string" && value.reason ? { reason: value.reason } : {}),
  };
}

/** 印を読む。ファイルがなければ止めていないものとする。壊れていれば場所を添えて失敗する。 */
export function readWatchControl(executionPath: string): WatchControl {
  const path = watchControlPath(executionPath);
  if (!existsSync(path)) return { v: 1, targets: {} };
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    throw new Error(
      `watch control is not valid JSON: ${path}: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error },
    );
  }
  if (!isRecord(parsed) || parsed.v !== 1)
    throw new Error(`watch control must be an object with v: 1: ${path}`);
  const targets: Record<string, WatchPauseMark> = {};
  if (isRecord(parsed.targets)) {
    for (const id of Object.keys(parsed.targets).sort()) {
      const mark = parseMark(parsed.targets[id]);
      if (mark) targets[id] = mark;
    }
  }
  const all = parseMark(parsed.all);
  return { v: 1, ...(all ? { all } : {}), targets };
}

function writeWatchControl(executionPath: string, control: WatchControl): void {
  const path = watchControlPath(executionPath);
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.${process.pid}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(control, null, 2)}\n`, "utf8");
  renameSync(temporary, path);
}

export type WatchControlChange = {
  /** `*` は全体。ほかは対象 ID。 */
  targets: readonly string[];
  by: string;
  reason?: string;
  now: string;
};

function controlLine(
  event: WatchControlLine["event"],
  id: string,
  change: WatchControlChange,
): WatchControlLine {
  return {
    v: 1,
    ts: change.now,
    event,
    key: `watch-control:${id}`,
    target: { kind: "watch-control", id },
    by: change.by,
    ...(change.reason ? { reason: change.reason } : {}),
  };
}

function appendControlLines(executionPath: string, lines: readonly WatchControlLine[]): void {
  if (lines.length === 0) return;
  const path = watchEventsLogPath(executionPath);
  mkdirSync(dirname(path), { recursive: true });
  appendFileSync(path, lines.map((line) => `${JSON.stringify(line)}\n`).join(""), "utf8");
}

function normalizeTargets(targets: readonly string[]): string[] {
  const ids = [...new Set(targets.map((id) => id.trim()).filter(Boolean))].sort();
  return ids.length > 0 ? ids : [WATCH_ALL_TARGETS];
}

/**
 * 見張りを止める。既に止めている対象は印を書き直さず、記録にも足さない。
 * 足した行を返す。
 */
export function pauseWatch(executionPath: string, change: WatchControlChange): WatchControlLine[] {
  const control = readWatchControl(executionPath);
  const mark: WatchPauseMark = {
    by: change.by,
    at: change.now,
    ...(change.reason ? { reason: change.reason } : {}),
  };
  const lines: WatchControlLine[] = [];
  for (const id of normalizeTargets(change.targets)) {
    if (id === WATCH_ALL_TARGETS) {
      if (control.all) continue;
      control.all = mark;
    } else {
      if (control.targets[id]) continue;
      control.targets[id] = mark;
    }
    lines.push(controlLine("paused", id, change));
  }
  if (lines.length > 0) writeWatchControl(executionPath, control);
  appendControlLines(executionPath, lines);
  return lines;
}

/** 見張りを再開する。止めていない対象は何もしない。足した行を返す。 */
export function resumeWatch(executionPath: string, change: WatchControlChange): WatchControlLine[] {
  const control = readWatchControl(executionPath);
  const lines: WatchControlLine[] = [];
  for (const id of normalizeTargets(change.targets)) {
    if (id === WATCH_ALL_TARGETS) {
      if (!control.all) continue;
      delete control.all;
    } else {
      if (!control.targets[id]) continue;
      delete control.targets[id];
    }
    lines.push(controlLine("resumed", id, change));
  }
  if (lines.length > 0) writeWatchControl(executionPath, control);
  appendControlLines(executionPath, lines);
  return lines;
}

// ================================
// Processes
// ================================

export type ProcessInfo = { pid: number; argv: string[]; cwd?: string };

/** Linux の /proc から動いているプロセスの引数と作業ディレクトリを読む。読めなければ空。 */
export function listProcesses(procRoot = "/proc"): ProcessInfo[] {
  let entries: string[];
  try {
    entries = readdirSync(procRoot);
  } catch {
    return [];
  }
  const processes: ProcessInfo[] = [];
  for (const name of entries) {
    if (!/^\d+$/u.test(name)) continue;
    const pid = Number(name);
    if (pid === process.pid) continue;
    let argv: string[];
    try {
      argv = readFileSync(join(procRoot, name, "cmdline"), "utf8")
        .split("\0")
        .filter(Boolean);
    } catch {
      continue; // 読んでいる間に終わったプロセス
    }
    if (argv.length === 0) continue;
    let cwd: string | undefined;
    try {
      cwd = readlinkSync(join(procRoot, name, "cwd"));
    } catch {
      cwd = undefined; // ほかの利用者のプロセスは cwd を読めない
    }
    processes.push({ pid, argv, ...(cwd ? { cwd } : {}) });
  }
  return processes.sort((a, b) => a.pid - b.pid);
}

// 見張りと待つコマンド自身は対象を名指しするが、作業ではないため数えない。
const WATCHER_TOKENS = new Set([
  "watch",
  "watch-scan",
  "watch-pause",
  "watch-resume",
  "watch-status",
]);

function namesTarget(argument: string, id: string): boolean {
  const lower = argument.toLowerCase();
  const target = id.toLowerCase();
  return (
    lower === target ||
    lower.endsWith(`=${target}`) ||
    lower.endsWith(`:${target}`) ||
    lower.split(",").includes(target)
  );
}

/** 作業ディレクトリの道のりに、対象の worktree の名前（`<project>-<id>` または `<id>`）がある。 */
function worksInTargetWorktree(cwd: string, id: string): boolean {
  const target = id
    .replace(/[^A-Za-z0-9._-]+/gu, "-")
    .toLowerCase()
    .replace(/^-+|-+$/gu, "");
  if (!target) return false;
  return cwd.split(sep).some((segment) => {
    const lower = segment.toLowerCase();
    return lower === target || lower.endsWith(`-${target}`);
  });
}

/** 対象を名指しする、または対象の worktree で動いているプロセス。見張り自身は除く。 */
export function findTargetProcess(
  processes: readonly ProcessInfo[],
  id: string,
): ProcessInfo | undefined {
  return processes.find((info) => {
    if (info.argv.some((argument) => WATCHER_TOKENS.has(argument))) return false;
    if (info.argv.some((argument) => namesTarget(argument, id))) return true;
    return info.cwd !== undefined && worksInTargetWorktree(info.cwd, id);
  });
}

// ================================
// Hold decision
// ================================

export type WatchHoldReason = "paused" | "manual_actor" | "live_process";

export type WatchHold = { reason: WatchHoldReason; detail: string };

export const WATCH_HOLD_LABELS: Record<WatchHoldReason, string> = {
  paused: "見張りの対象外の印",
  manual_actor: "人かオーケストレーターの claim",
  live_process: "動いているプロセス",
};

export type WatchHoldContext = {
  control: WatchControl;
  /** 人（名簿の `type: human`）とオーケストレーターの名前。 */
  manualActors: ReadonlySet<string>;
  processes: readonly ProcessInfo[];
};

/**
 * actor が作業の claim を表すか。schedule のタスクは claim した主体を持つ。register 項目は最後の event の
 * 主体のため、作業中の `in-progress` だけを claim と見なす。`review`・`waiting` を人が書いても、
 * 判断を待つ止まりとして見張りに残す。
 */
function isClaim(observation: Pick<StallObservation, "kind" | "state">): boolean {
  return (
    observation.kind === "schedule-task" ||
    (observation.kind === "register-item" && observation.state === "in-progress")
  );
}

function describeMark(mark: WatchPauseMark): string {
  return `paused by ${mark.by} at ${mark.at}${mark.reason ? `: ${mark.reason}` : ""}`;
}

/**
 * 見張りと手当てが触らない対象かを決める。手で付けた印、人やオーケストレーターの claim、
 * 対象を名指しするか対象の worktree で動いているプロセスの順に見る。
 */
export function decideWatchHold(
  observation: Pick<StallObservation, "kind" | "id" | "state" | "actor">,
  context: WatchHoldContext,
): WatchHold | undefined {
  const mark = context.control.targets[observation.id];
  if (mark) return { reason: "paused", detail: describeMark(mark) };
  if (observation.actor && isClaim(observation) && context.manualActors.has(observation.actor))
    return { reason: "manual_actor", detail: `claimed by ${observation.actor}` };
  const info = findTargetProcess(context.processes, observation.id);
  if (info)
    return {
      reason: "live_process",
      detail: `pid ${info.pid}: ${info.argv.join(" ").slice(0, 160)}`,
    };
  return undefined;
}

export type WatchActionGate =
  { allowed: true } | { allowed: false; reason: "paused" | "busy"; detail: string };

/**
 * 手当てを打ってよいか。見張りを全体で止めているか、別の run が実行ロックを持っている間は打たず、
 * 次の回に回す（routine の busy skip と同じ扱い）。対象ごとの判断は `decideWatchHold` で行う。
 */
export function watchActionGate(
  executionPath: string,
  control: WatchControl = readWatchControl(executionPath),
  isRunLive: (executionPath: string) => boolean = isProjectRunLive,
): WatchActionGate {
  if (control.all) return { allowed: false, reason: "paused", detail: describeMark(control.all) };
  if (isRunLive(executionPath))
    return { allowed: false, reason: "busy", detail: "another exec run holds the run lock" };
  return { allowed: true };
}
