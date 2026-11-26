import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { appendFile, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import type { WatchLogLine } from "../../../src/exec/watch-scan.js";
import {
  formatWatchEvent,
  matchesWatchEvent,
  readWatchLogFrom,
  waitForWatchEvents,
  watchLogSize,
} from "../../../src/exec/watch-wait.js";

const STALLED: WatchLogLine = {
  v: 1,
  ts: "2026-11-14T00:00:00Z",
  event: "stalled",
  key: "register-item:PJR-AAAA:waiting:2026-11-13T15:00:00Z",
  target: { kind: "register-item", id: "PJR-AAAA" },
  state: "waiting",
  since: "2026-11-13T15:00:00Z",
  category: "usage_limit",
  detail: "usage_limit",
  basis: { source: "events/pjr-aaaa.yaml", excerpt: "rate limit reached" },
  next_action: "wait",
  by: "watch-scan",
};

const CLEARED: WatchLogLine = {
  v: 1,
  ts: "2026-11-14T01:00:00Z",
  event: "cleared",
  key: STALLED.key,
  target: STALLED.target,
  state: "done",
  by: "watch-scan",
};

const REMEDY: WatchLogLine = {
  v: 1,
  ts: "2026-11-14T00:05:00Z",
  event: "remedy",
  key: STALLED.key,
  target: STALLED.target,
  category: "usage_limit",
  action: "resume",
  summary: "resume",
  argv: ["exec", "run", "--register", "PJR-AAAA", "--resume"],
  attempt: 1,
  max_attempts: 3,
  log: "execution/watch/remedies/20261114T000500Z-PJR-AAAA.log",
  by: "watch-scan",
};

describe("remedy events from the watch-scan remedies", () => {
  it("matches a remedy event by its category", () => {
    expect(
      matchesWatchEvent(REMEDY, {
        events: new Set(["remedy"]),
        categories: new Set(["usage_limit"]),
      }),
    ).toBe(true);
  });

  it("prints the action, attempt, command, and log of a remedy event", () => {
    expect(formatWatchEvent(REMEDY)).toBe(
      "2026-11-14T00:05:00Z remedy PJR-AAAA (register-item) resume (1/3): specdojo exec run --register PJR-AAAA --resume; log: execution/watch/remedies/20261114T000500Z-PJR-AAAA.log",
    );
  });
});

function jsonl(...lines: WatchLogLine[]): string {
  return lines.map((line) => `${JSON.stringify(line)}\n`).join("");
}

describe("matchesWatchEvent", () => {
  it("matches a stalled event that became waiting", () => {
    expect(
      matchesWatchEvent(STALLED, { events: new Set(["stalled"]), states: new Set(["waiting"]) }),
    ).toBe(true);
  });

  it("matches a cleared event by the state it reached", () => {
    expect(
      matchesWatchEvent(CLEARED, { events: new Set(["cleared"]), states: new Set(["done"]) }),
    ).toBe(true);
  });

  it("rejects an event of another target, category, or kind", () => {
    expect(matchesWatchEvent(STALLED, { events: new Set(["cleared"]) })).toBe(false);
    expect(
      matchesWatchEvent(STALLED, { events: new Set(["stalled"]), targets: new Set(["PJR-BBBB"]) }),
    ).toBe(false);
    expect(
      matchesWatchEvent(STALLED, {
        events: new Set(["stalled"]),
        categories: new Set(["needs_decision"]),
      }),
    ).toBe(false);
  });
});

describe("formatWatchEvent", () => {
  it("prints the target, state, category, and next action of a stalled event", () => {
    expect(formatWatchEvent(STALLED)).toBe(
      "2026-11-14T00:00:00Z stalled PJR-AAAA (register-item) waiting → usage_limit/usage_limit; next: wait",
    );
  });
});

describe("watch log reading", () => {
  let dir: string;
  let logPath: string;

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "specdojo-watch-wait-"));
    logPath = path.join(dir, "watch-events.jsonl");
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("leaves a half-written last line for the next read", async () => {
    await writeFile(logPath, `${jsonl(STALLED)}{"v":1`, "utf8");

    const actual = readWatchLogFrom(logPath, 0);

    expect(actual.lines).toEqual([STALLED]);
    expect(actual.offset).toBe(jsonl(STALLED).length);
  });

  it("reads from the start again when the log became shorter", async () => {
    await writeFile(logPath, jsonl(CLEARED), "utf8");

    const actual = readWatchLogFrom(logPath, 10_000);

    expect(actual.lines).toEqual([CLEARED]);
  });

  it("returns only events added after it started waiting", async () => {
    await writeFile(logPath, jsonl(STALLED), "utf8");
    const offset = watchLogSize(logPath);

    const actual = await waitForWatchEvents({
      logPath,
      filter: { events: new Set(["stalled", "cleared"]) },
      offset,
      intervalMs: 1,
      sleep: () => appendFile(logPath, jsonl(CLEARED), "utf8"),
    });

    expect(actual).toEqual({ status: "matched", lines: [CLEARED], warnings: [] });
  });

  it("also returns earlier events at or after --since", async () => {
    await writeFile(logPath, jsonl(STALLED, CLEARED), "utf8");

    const actual = await waitForWatchEvents({
      logPath,
      filter: { events: new Set(["stalled", "cleared"]) },
      since: "2026-11-14T00:30:00Z",
      intervalMs: 1,
    });

    expect(actual).toMatchObject({ status: "matched", lines: [CLEARED] });
  });

  it("times out when no matching event arrives before the limit", async () => {
    let clock = 0;

    const actual = await waitForWatchEvents({
      logPath,
      filter: { events: new Set(["stalled"]) },
      timeoutMs: 3_000,
      intervalMs: 1_000,
      now: () => clock,
      sleep: async (ms) => {
        clock += ms;
      },
    });

    expect(actual).toEqual({ status: "timeout", warnings: [] });
    expect(clock).toBe(3_000);
  });
});
