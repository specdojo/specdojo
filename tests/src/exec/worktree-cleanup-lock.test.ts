import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  isWorktreeCleanupInProgress,
  releaseWorktreeCleanupLock,
  tryAcquireWorktreeCleanupLock,
  worktreeCleanupLockDir,
} from "../../../src/exec/worktree-cleanup-lock.js";

describe("worktree cleanup lock", () => {
  it("refuses a second cleanup of the same worktree until the first one releases it", async () => {
    const executionPath = await mkdtemp(path.join(tmpdir(), "specdojo-worktree-cleanup-lock-"));
    try {
      const first = tryAcquireWorktreeCleanupLock(executionPath, "prj-0001:PJR-NHT7", "runner");
      expect(first).not.toBeNull();
      try {
        expect(isWorktreeCleanupInProgress(executionPath, "prj-0001:PJR-NHT7")).toBe(true);
        expect(
          tryAcquireWorktreeCleanupLock(executionPath, "prj-0001:PJR-NHT7", "other"),
        ).toBeNull();
        expect(isWorktreeCleanupInProgress(executionPath, "prj-0001:PJR-OTHR")).toBe(false);
      } finally {
        releaseWorktreeCleanupLock(first!);
      }

      expect(isWorktreeCleanupInProgress(executionPath, "prj-0001:PJR-NHT7")).toBe(false);
    } finally {
      await rm(executionPath, { recursive: true, force: true });
    }
  });

  it("places the lock under the exec locks directory named after the worktree", () => {
    expect(worktreeCleanupLockDir("/repo/execution", "prj-0001:PJR-NHT7")).toBe(
      path.join("/repo/execution", "exec", ".locks", "worktree-cleanup", "prj-0001-PJR-NHT7"),
    );
  });
});
