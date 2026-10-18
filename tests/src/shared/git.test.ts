import { describe, expect, it } from "vitest";
import {
  formatGitCommandFailure,
  gitIndexLockPath,
  INDEX_LOCK_RETRY_ATTEMPTS,
  INDEX_LOCK_RETRY_WAIT_MS,
  isGitIndexLockContention,
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
    expect(notices.map(({ attempt, reason }) => ({ attempt, reason }))).toEqual([
      { attempt: 1, reason: "index.lock contention" },
      { attempt: 2, reason: "index.lock contention" },
      { attempt: 3, reason: "index.lock contention" },
    ]);
  });

  it("gives up after the retry limit and returns the last failure", () => {
    let calls = 0;
    const waits: number[] = [];

    const actual = runGitWithTransientRetry(
      () => {
        calls += 1;
        return { status: 128, stderr: englishLockFailure };
      },
      () => undefined,
      (milliseconds) => waits.push(milliseconds),
    );

    expect(actual).toEqual({ status: 128, stderr: englishLockFailure });
    expect(INDEX_LOCK_RETRY_ATTEMPTS).toBe(10);
    expect(calls).toBe(INDEX_LOCK_RETRY_ATTEMPTS + 1);
    expect(waits).toEqual(Array.from({ length: 10 }, () => INDEX_LOCK_RETRY_WAIT_MS));
  });
});

describe("formatGitCommandFailure for index.lock contention", () => {
  it("names the held lock file ahead of the stderr summary", () => {
    const message = formatGitCommandFailure(
      ["restore", "--source=HEAD", "--", "a.md"],
      japaneseLockFailure,
    );

    expect(message).toMatch(
      /^git restore failed: index\.lock is still held \(lock: \/repo\/\.git\/index\.lock\) \/ /,
    );
  });

  it("does not add a lock notice to other failures", () => {
    const message = formatGitCommandFailure(["status"], "fatal: not a git repository");

    expect(message).toBe("git status failed: fatal: not a git repository");
  });
});
