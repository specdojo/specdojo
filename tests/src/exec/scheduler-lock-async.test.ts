import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  acquireSchedulerLock,
  acquireSchedulerLockAsync,
  releaseSchedulerLock,
} from "../../../src/exec/events.js";

vi.mock("../../../src/exec/project.js", () => ({
  executionRootForProject: (path: string) => path,
}));
const roots: string[] = [];
afterEach(() => {
  vi.useRealTimers();
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("asynchronous scheduler lock", () => {
  it("lets the holder release the same lock while another task waits", async () => {
    vi.useFakeTimers();
    const root = mkdtempSync(join(tmpdir(), "scheduler-async-"));
    roots.push(root);
    const options = { actor: "first", lockTimeoutMs: 1000, lockStaleMs: 300000 };
    const first = acquireSchedulerLock(root, options);
    let acquired = false;
    const second = acquireSchedulerLockAsync(root, { ...options, actor: "second" }).then((lock) => {
      acquired = true;
      return lock;
    });
    await vi.advanceTimersByTimeAsync(100);
    expect(acquired).toBe(false);
    expect(existsSync(first)).toBe(true);
    releaseSchedulerLock(first);
    await vi.advanceTimersByTimeAsync(100);
    expect(await second).toBe(first);
    releaseSchedulerLock(first);
    expect(existsSync(first)).toBe(false);
  });

  it("preserves the holder and timeout error when the lock stays occupied", async () => {
    vi.useFakeTimers();
    const root = mkdtempSync(join(tmpdir(), "scheduler-async-"));
    roots.push(root);
    const first = acquireSchedulerLock(root, {
      actor: "holder",
      lockTimeoutMs: 100,
      lockStaleMs: 300000,
    });
    const second = acquireSchedulerLockAsync(root, {
      actor: "waiter",
      lockTimeoutMs: 100,
      lockStaleMs: 300000,
    });
    const rejected = expect(second).rejects.toThrow(
      "Failed to acquire scheduler lock within 100 ms",
    );
    await vi.advanceTimersByTimeAsync(200);
    await rejected;
    expect(existsSync(first)).toBe(true);
    releaseSchedulerLock(first);
  });
});
