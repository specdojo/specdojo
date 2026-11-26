import type { Command } from "commander";
import { relative } from "node:path";
import { specdojoRootDir } from "../shared/specdojo-config.js";
import { addProjectOptions } from "./core.js";
import { resolveProjectPaths } from "./project.js";
import { watchEventsLogPath } from "./watch-control.js";
import {
  EXEC_WATCH_TIMEOUT_EXIT_CODE,
  formatWatchEvent,
  waitForWatchEvents,
  WATCH_EVENT_KINDS,
  type WatchEventFilter,
  type WatchEventKind,
} from "./watch-wait.js";

const DURATION_UNITS: Record<string, number> = {
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
};

export function parseWatchDuration(option: string, value: string): number {
  const match = /^([1-9]\d*)([smhd])$/u.exec(value.trim());
  if (!match) throw new Error(`${option} must be <positive integer><s|m|h|d> (e.g. 30m): ${value}`);
  return Number(match[1]) * DURATION_UNITS[match[2]!]!;
}

function listValues(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function optionalSet(value: string | undefined): Set<string> | undefined {
  const values = listValues(value);
  return values.length > 0 ? new Set(values) : undefined;
}

export function parseWatchEventFilter(opts: {
  event?: string;
  state?: string;
  category?: string;
  target?: string;
}): WatchEventFilter {
  const events = listValues(opts.event ?? "stalled");
  for (const event of events)
    if (!(WATCH_EVENT_KINDS as readonly string[]).includes(event))
      throw new Error(`--event must be one of ${WATCH_EVENT_KINDS.join(", ")}: ${event}`);
  if (events.length === 0) throw new Error("--event needs at least one event kind");
  const states = optionalSet(opts.state);
  const categories = optionalSet(opts.category);
  const targets = optionalSet(opts.target);
  return {
    events: new Set(events as WatchEventKind[]),
    ...(states ? { states } : {}),
    ...(categories ? { categories } : {}),
    ...(targets ? { targets } : {}),
  };
}

type WatchOpts = {
  project?: string;
  event?: string;
  state?: string;
  category?: string;
  target?: string;
  since?: string;
  timeout?: string;
  interval: string;
  json: boolean;
};

async function watchAction(opts: WatchOpts): Promise<void> {
  const filter = parseWatchEventFilter(opts);
  const timeoutMs = opts.timeout ? parseWatchDuration("--timeout", opts.timeout) : undefined;
  const intervalMs = parseWatchDuration("--interval", opts.interval);
  if (opts.since !== undefined && !Number.isFinite(Date.parse(opts.since)))
    throw new Error(`--since must be an ISO 8601 time (e.g. 2026-11-25T00:00:00Z): ${opts.since}`);
  const { executionPath } = resolveProjectPaths({ project: opts.project });
  const logPath = watchEventsLogPath(executionPath);
  process.stderr.write(
    `[exec watch] waiting for ${[...filter.events].join(", ")} in ${relative(specdojoRootDir(), logPath)}${timeoutMs === undefined ? "" : ` (timeout ${opts.timeout})`}\n`,
  );
  const outcome = await waitForWatchEvents({
    logPath,
    filter,
    ...(opts.since !== undefined ? { since: opts.since } : {}),
    ...(timeoutMs !== undefined ? { timeoutMs } : {}),
    intervalMs,
  });
  for (const warning of outcome.warnings)
    process.stderr.write(`[exec watch] warning: ${warning}\n`);
  if (outcome.status === "timeout") {
    process.stderr.write(`[exec watch] timed out after ${opts.timeout} with no matching event\n`);
    process.exitCode = EXEC_WATCH_TIMEOUT_EXIT_CODE;
    return;
  }
  for (const line of outcome.lines)
    process.stdout.write(`${opts.json ? JSON.stringify(line) : formatWatchEvent(line)}\n`);
}

// `exec watch`: 見張りの記録に指定した種類のイベントが新しく足されるまで待つ（PJR-T4E0）。
export function registerExecWatchCommand(exec: Command): void {
  const cmd = exec
    .command("watch")
    .description(
      "Wait until the watch log (orchestrator watch-scan) records a new event of the given kinds, print it, and exit " +
        `(exit ${EXEC_WATCH_TIMEOUT_EXIT_CODE} when --timeout passes first)`,
    )
    .option(
      "--event <kinds>",
      `Comma-separated event kinds: ${WATCH_EVENT_KINDS.join(", ")}`,
      "stalled",
    )
    .option(
      "--state <states>",
      "Only events whose state matches (stalled: blocked, deferred, waiting, review, stopped, ...; cleared: the state after, e.g. done)",
    )
    .option(
      "--category <categories>",
      "Only stalled, remedy, or remedy_stopped events of these categories (e.g. needs_decision)",
    )
    .option("--target <ids>", "Only events about these task, register item, or queue ids")
    .option("--since <time>", "Also match events recorded at or after this ISO 8601 time")
    .option("--timeout <duration>", "Stop waiting after <positive integer><s|m|h|d>")
    .option("--interval <duration>", "How often to read the watch log", "5s")
    .option("--json", "Print each matching log line as JSON", false);
  addProjectOptions(cmd);
  cmd.action(async (opts: WatchOpts) => {
    try {
      await watchAction(opts);
    } catch (error) {
      process.stderr.write(
        `[exec watch] ${error instanceof Error ? error.message : String(error)}\n`,
      );
      process.exitCode = 1;
    }
  });
}
