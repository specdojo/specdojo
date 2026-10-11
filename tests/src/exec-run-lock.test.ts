import { mkdtemp, rm, stat, utimes } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  acquireExecRunLock,
  collectExecLockUsage,
  EXEC_RUN_LOCK_TOKEN_ENV,
  execRunLockPath,
  ExecRunBusyError,
  formatExecLockUsage,
  inheritsExecRunLock,
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
  it("親 runner の一致する token だけを継承済み lock として扱う", async () => {
    await withTempExecution(async (executionPath) => {
      const handle = await acquireExecRunLock(executionPath, {
        actor: "parent-job",
        ifBusy: "fail",
      });
      expect(handle).not.toBeNull();
      const previous = process.env[EXEC_RUN_LOCK_TOKEN_ENV];
      try {
        process.env[EXEC_RUN_LOCK_TOKEN_ENV] = "different-token";
        expect(inheritsExecRunLock(executionPath)).toBe(false);
        process.env[EXEC_RUN_LOCK_TOKEN_ENV] = handle!.token;
        expect(inheritsExecRunLock(executionPath)).toBe(true);
      } finally {
        if (previous === undefined) delete process.env[EXEC_RUN_LOCK_TOKEN_ENV];
        else process.env[EXEC_RUN_LOCK_TOKEN_ENV] = previous;
        releaseExecRunLock(handle!);
      }
    });
  });

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

describe("exec run --join", () => {
  it("排他の主 run が動いている間は join を busy にする", async () => {
    await withTempExecution(async (executionPath) => {
      const primary = await acquireExecRunLock(executionPath, { actor: "cycle", ifBusy: "fail" });

      const joined = await acquireExecRunLock(executionPath, {
        actor: "joiner",
        ifBusy: "skip",
        join: { limit: 3 },
      });

      expect(joined).toBeNull();
      releaseExecRunLock(primary!);
    });
  });

  it("shareable な主 run へ join の枠数まで合流でき、枠が埋まると skip する", async () => {
    await withTempExecution(async (executionPath) => {
      const primary = await acquireExecRunLock(executionPath, {
        actor: "primary",
        ifBusy: "fail",
        shareable: true,
      });
      const first = await acquireExecRunLock(executionPath, {
        actor: "join-1",
        ifBusy: "fail",
        join: { limit: 2 },
      });
      const second = await acquireExecRunLock(executionPath, {
        actor: "join-2",
        ifBusy: "fail",
        join: { limit: 2 },
      });

      const third = await acquireExecRunLock(executionPath, {
        actor: "join-3",
        ifBusy: "skip",
        join: { limit: 2 },
      });

      expect(first).not.toBeNull();
      expect(second).not.toBeNull();
      expect(third).toBeNull();
      for (const handle of [second, first, primary]) releaseExecRunLock(handle!);
    });
  });

  it("--join なしの2つ目は shareable な主 run に対しても従来どおり busy になる", async () => {
    await withTempExecution(async (executionPath) => {
      const primary = await acquireExecRunLock(executionPath, {
        actor: "primary",
        ifBusy: "fail",
        shareable: true,
      });

      await expect(
        acquireExecRunLock(executionPath, { actor: "second", ifBusy: "fail", shareable: true }),
      ).rejects.toBeInstanceOf(ExecRunBusyError);

      releaseExecRunLock(primary!);
    });
  });

  it("join run が残っている間は排他の run を busy にし、shareable な run は受け入れる", async () => {
    await withTempExecution(async (executionPath) => {
      const joined = await acquireExecRunLock(executionPath, {
        actor: "joiner",
        ifBusy: "fail",
        join: { limit: 1 },
      });

      const exclusive = await acquireExecRunLock(executionPath, { actor: "cycle", ifBusy: "skip" });
      const shareable = await acquireExecRunLock(executionPath, {
        actor: "register",
        ifBusy: "skip",
        shareable: true,
      });

      expect(exclusive).toBeNull();
      expect(shareable).not.toBeNull();
      releaseExecRunLock(shareable!);
      releaseExecRunLock(joined!);
    });
  });

  it("join run の token も継承済み lock として扱う", async () => {
    await withTempExecution(async (executionPath) => {
      const joined = await acquireExecRunLock(executionPath, {
        actor: "joiner",
        ifBusy: "fail",
        join: { limit: 1 },
      });
      const previous = process.env[EXEC_RUN_LOCK_TOKEN_ENV];
      try {
        process.env[EXEC_RUN_LOCK_TOKEN_ENV] = joined!.token;

        expect(inheritsExecRunLock(executionPath)).toBe(true);
      } finally {
        if (previous === undefined) delete process.env[EXEC_RUN_LOCK_TOKEN_ENV];
        else process.env[EXEC_RUN_LOCK_TOKEN_ENV] = previous;
        releaseExecRunLock(joined!);
      }
    });
  });

  it("使用中の枠と上限を一覧できる", async () => {
    await withTempExecution(async (executionPath) => {
      const primary = await acquireExecRunLock(executionPath, {
        actor: "primary",
        ifBusy: "fail",
        shareable: true,
      });
      const joined = await acquireExecRunLock(executionPath, {
        actor: "joiner",
        ifBusy: "fail",
        join: { limit: 3 },
      });

      const usage = collectExecLockUsage(executionPath, { joinLimit: 3, pools: [] });

      expect(usage.map((entry) => [entry.name, entry.holders.length, entry.limit])).toEqual([
        ["exec run (primary)", 1, 1],
        ["exec run (--join)", 1, 3],
        ["register lifecycle", 0, 1],
      ]);
      expect(usage[0]!.holders[0]).toMatch(/^primary \(pid \d+, since .+, joinable\)$/);
      expect(formatExecLockUsage(usage)).toContain("exec run (--join): 1/3\n  slot-1: joiner");
      releaseExecRunLock(joined!);
      releaseExecRunLock(primary!);
    });
  });
});
