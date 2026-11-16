import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  configureIndexLockWait,
  DEFAULT_INDEX_LOCK_WAIT_MS,
  formatGitCommandFailure,
  gitIndexLockPath,
  hasRunningGitProcess,
  INDEX_LOCK_LONG_RETRY_WAIT_MS,
  INDEX_LOCK_RETRY_ATTEMPTS,
  INDEX_LOCK_RETRY_WAIT_MS,
  isGitIndexLockContention,
  isIndexLockOrphaned,
  runGitWithTransientRetry,
  type TransientGitRetryNotice,
} from "../../../src/shared/git.js";

const englishLockFailure =
  "fatal: Unable to create '/repo/.git/index.lock': File exists.\n\n" +
  "Another git process seems to be running in this repository.";
const japaneseLockFailure =
  "fatal: '/repo/.git/index.lock' を作成できません: ファイルが存在します。\n\n" +
  "別の git プロセスがこのリポジトリで実行中のようです。";

describe("index.lock contention detection", () => {
  it("detects the English and Japanese index.lock failures", () => {
    expect(isGitIndexLockContention(englishLockFailure)).toBe(true);
    expect(isGitIndexLockContention(japaneseLockFailure)).toBe(true);
  });

  it("extracts the lock path from either language", () => {
    expect(gitIndexLockPath(englishLockFailure)).toBe("/repo/.git/index.lock");
    expect(gitIndexLockPath(japaneseLockFailure)).toBe("/repo/.git/index.lock");
    expect(gitIndexLockPath("error: pathspec 'a.md' did not match any file(s)")).toBeUndefined();
  });
});

describe("runGitWithTransientRetry for index.lock contention", () => {
  it("retries with a fixed wait until the lock is released", () => {
    const results = [
      { status: 128, stderr: englishLockFailure },
      { status: 128, stderr: japaneseLockFailure },
      { status: 128, stderr: englishLockFailure },
      { status: 0, stderr: "" },
    ];
    let calls = 0;
    const waits: number[] = [];
    const notices: TransientGitRetryNotice[] = [];

    const actual = runGitWithTransientRetry(
      () => results[calls++]!,
      (notice) => notices.push(notice),
      (milliseconds) => waits.push(milliseconds),
    );

    expect(actual.status).toBe(0);
    expect(calls).toBe(4);
    expect(waits).toEqual([1500, 1500, 1500]);
    // 短い取り合いは最初の 1 回だけ告げる。
    expect(notices.map(({ attempt, reason }) => ({ attempt, reason }))).toEqual([
      { attempt: 1, reason: "index.lock contention" },
    ]);
  });

  it("waits up to 20 minutes by default, switching to the long interval after 10 attempts", () => {
    let clock = 0;
    let calls = 0;
    const waits: number[] = [];
    const notices: TransientGitRetryNotice[] = [];
    // hook が 17 分 lock を握った 2026-11-15 の事例を再現する。
    const releasedAt = 17 * 60 * 1000;

    const actual = runGitWithTransientRetry(
      () => {
        calls += 1;
        return clock < releasedAt
          ? { status: 128, stderr: englishLockFailure }
          : { status: 0, stderr: "" };
      },
      (notice) => notices.push(notice),
      (milliseconds) => {
        waits.push(milliseconds);
        clock += milliseconds;
      },
      undefined,
      undefined,
      { now: () => clock, isLockOrphaned: () => false },
    );

    expect(actual.status).toBe(0);
    expect(DEFAULT_INDEX_LOCK_WAIT_MS).toBe(20 * 60 * 1000);
    expect(waits.slice(0, INDEX_LOCK_RETRY_ATTEMPTS)).toEqual(
      Array.from({ length: INDEX_LOCK_RETRY_ATTEMPTS }, () => INDEX_LOCK_RETRY_WAIT_MS),
    );
    expect(new Set(waits.slice(INDEX_LOCK_RETRY_ATTEMPTS))).toEqual(
      new Set([INDEX_LOCK_LONG_RETRY_WAIT_MS]),
    );
    expect(calls).toBe(waits.length + 1);
  });

  it("reports the elapsed time periodically instead of on every retry", () => {
    let clock = 0;
    const notices: TransientGitRetryNotice[] = [];

    runGitWithTransientRetry(
      () => ({ status: clock < 95_000 ? 128 : 0, stderr: englishLockFailure }),
      (notice) => notices.push(notice),
      (milliseconds) => {
        clock += milliseconds;
      },
      undefined,
      undefined,
      { now: () => clock, isLockOrphaned: () => false },
    );

    expect(notices.map(({ elapsedMilliseconds }) => elapsedMilliseconds)).toEqual([
      0, 30_000, 60_000, 90_000,
    ]);
    expect(notices[0]).toMatchObject({
      reason: "index.lock contention",
      limitMilliseconds: DEFAULT_INDEX_LOCK_WAIT_MS,
      lockPath: "/repo/.git/index.lock",
    });
  });

  it("gives up after the configured wait and names the limit in stderr", () => {
    let clock = 0;

    const actual = runGitWithTransientRetry(
      () => ({ status: 128, stderr: englishLockFailure }),
      () => undefined,
      (milliseconds) => {
        clock += milliseconds;
      },
      undefined,
      undefined,
      { limitMilliseconds: 60_000, now: () => clock, isLockOrphaned: () => false },
    );

    expect(actual.status).toBe(128);
    expect(clock).toBe(60_000);
    expect(actual.stderr).toBe(
      `${englishLockFailure}\nerror: index.lock was not released within 1m` +
        " (run.git_index_lock_wait_seconds in exec-defaults)\n",
    );
  });

  it("uses the wait configured from exec-defaults", () => {
    let clock = 0;
    configureIndexLockWait(10_000);
    try {
      runGitWithTransientRetry(
        () => ({ status: 128, stderr: englishLockFailure }),
        () => undefined,
        (milliseconds) => {
          clock += milliseconds;
        },
        undefined,
        undefined,
        { now: () => clock, isLockOrphaned: () => false },
      );
    } finally {
      configureIndexLockWait();
    }

    expect(clock).toBe(10_000);
  });

  it("stops early on a stale lock once the short retries are used up", () => {
    let clock = 0;
    let calls = 0;
    const checkedPaths: string[] = [];

    const actual = runGitWithTransientRetry(
      () => {
        calls += 1;
        return { status: 128, stderr: englishLockFailure };
      },
      () => undefined,
      (milliseconds) => {
        clock += milliseconds;
      },
      undefined,
      undefined,
      {
        now: () => clock,
        isLockOrphaned: (lockPath) => {
          checkedPaths.push(lockPath);
          return true;
        },
      },
    );

    expect(calls).toBe(INDEX_LOCK_RETRY_ATTEMPTS + 1);
    expect(clock).toBe(INDEX_LOCK_RETRY_ATTEMPTS * INDEX_LOCK_RETRY_WAIT_MS);
    expect(checkedPaths).toEqual(["/repo/.git/index.lock"]);
    expect(actual.stderr).toMatch(
      /error: index\.lock looks stale: no running git process holds \/repo\/\.git\/index\.lock after 15s;/,
    );
  });
});

describe("isIndexLockOrphaned", () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "specdojo-index-lock-"));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  async function addProcess(pid: string, name: string): Promise<void> {
    await mkdir(path.join(dir, "proc", pid), { recursive: true });
    await writeFile(path.join(dir, "proc", pid, "comm"), `${name}\n`, "utf8");
  }

  it("treats a remaining lock without any git process as stale", async () => {
    const lockPath = path.join(dir, "index.lock");
    await writeFile(lockPath, "", "utf8");
    await addProcess("10", "node");
    await addProcess("11", "lefthook");

    expect(isIndexLockOrphaned(lockPath, path.join(dir, "proc"))).toBe(true);
  });

  it("keeps waiting while a git process such as a committing hook is running", async () => {
    const lockPath = path.join(dir, "index.lock");
    await writeFile(lockPath, "", "utf8");
    await addProcess("10", "git");

    expect(isIndexLockOrphaned(lockPath, path.join(dir, "proc"))).toBe(false);
  });

  it("does not call a released lock stale", async () => {
    await mkdir(path.join(dir, "proc"), { recursive: true });

    expect(isIndexLockOrphaned(path.join(dir, "index.lock"), path.join(dir, "proc"))).toBe(false);
  });

  it("keeps waiting when the process table cannot be read", async () => {
    const lockPath = path.join(dir, "index.lock");
    await writeFile(lockPath, "", "utf8");

    expect(hasRunningGitProcess(path.join(dir, "missing-proc"))).toBeUndefined();
    expect(isIndexLockOrphaned(lockPath, path.join(dir, "missing-proc"))).toBe(false);
  });
});

describe("formatGitCommandFailure for index.lock contention", () => {
  it("names the held lock file ahead of the stderr summary", () => {
    const message = formatGitCommandFailure(
      ["restore", "--source=HEAD", "--", "a.md"],
      japaneseLockFailure,
    );

    expect(message).toMatch(
      /^git restore failed: index\.lock is still held \(lock: \/repo\/\.git\/index\.lock; a git hook such as pre-commit may still be running, or a crashed git left a stale lock\) \/ /,
    );
  });

  it("does not add a lock notice to other failures", () => {
    const message = formatGitCommandFailure(["status"], "fatal: not a git repository");

    expect(message).toBe("git status failed: fatal: not a git repository");
  });
});
