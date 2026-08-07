import { mkdtemp, rm, stat, utimes } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  acquireExecRunLock,
  execRunLockPath,
  ExecRunBusyError,
  releaseExecRunLock,
} from "../../src/exec-run-lock.js";

async function withTempExecution(test: (executionPath: string) => Promise<void>): Promise<void> {
  const executionPath = await mkdtemp(path.join(tmpdir(), "specdojo-exec-run-lock-"));
  try {
    await test(executionPath);
  } finally {
    await rm(executionPath, { recursive: true, force: true });
  }
}

describe("exec run project lock", () => {
  it("同じ project の2つ目の fail / skip を busy にする", async () => {
    await withTempExecution(async (executionPath) => {
      const first = await acquireExecRunLock(executionPath, {
        actor: "first",
        ifBusy: "fail",
      });
      expect(first).not.toBeNull();

      await expect(
        acquireExecRunLock(executionPath, { actor: "second", ifBusy: "fail" }),
      ).rejects.toBeInstanceOf(ExecRunBusyError);
      await expect(
        acquireExecRunLock(executionPath, { actor: "second", ifBusy: "skip" }),
      ).resolves.toBeNull();

      releaseExecRunLock(first!);
    });
  });

  it("wait は先行 run の解放後にロックを取得する", async () => {
    await withTempExecution(async (executionPath) => {
      const first = await acquireExecRunLock(executionPath, {
        actor: "first",
        ifBusy: "fail",
      });
      expect(first).not.toBeNull();

      let waits = 0;
      const waiting = acquireExecRunLock(executionPath, {
        actor: "second",
        ifBusy: "wait",
        pollMs: 5,
        onWait: () => waits++,
      });
      setTimeout(() => releaseExecRunLock(first!), 20);

      const second = await waiting;
      expect(second).not.toBeNull();
      expect(waits).toBe(1);
      releaseExecRunLock(second!);
    });
  });

  it("heartbeat で lock の更新時刻を進める", async () => {
    await withTempExecution(async (executionPath) => {
      const handle = await acquireExecRunLock(executionPath, {
        actor: "heartbeat",
        ifBusy: "fail",
        heartbeatMs: 10,
      });
      expect(handle).not.toBeNull();
      const before = (await stat(execRunLockPath(executionPath))).mtimeMs;
      await new Promise((resolve) => setTimeout(resolve, 35));
      const after = (await stat(execRunLockPath(executionPath))).mtimeMs;
      expect(after).toBeGreaterThan(before);
      releaseExecRunLock(handle!);
    });
  });

  it("heartbeat が止まった stale lock を奪取し、旧所有者の解放では消さない", async () => {
    await withTempExecution(async (executionPath) => {
      const first = await acquireExecRunLock(executionPath, {
        actor: "crashed",
        ifBusy: "fail",
        heartbeatMs: 60_000,
      });
      expect(first).not.toBeNull();
      first!.heartbeat.kill();
      await new Promise((resolve) => first!.heartbeat.once("exit", resolve));
      const old = new Date(Date.now() - 1_000);
      await utimes(execRunLockPath(executionPath), old, old);

      const recovered = await acquireExecRunLock(executionPath, {
        actor: "recovered",
        ifBusy: "fail",
        staleMs: 10,
      });
      expect(recovered).not.toBeNull();

      releaseExecRunLock(first!);
      await expect(stat(execRunLockPath(executionPath))).resolves.toBeDefined();
      releaseExecRunLock(recovered!);
    });
  });
});
