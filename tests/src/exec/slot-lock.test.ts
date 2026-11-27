import { rmSync } from "node:fs";
import { mkdir, mkdtemp, rm, utimes, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import {
  acquirePoolSlotSync,
  CrossProcessMutex,
  livePoolHolders,
  poolSlotPath,
  readLockOwner,
  releaseLock,
  tryAcquirePoolSlot,
} from "../../../src/exec/slot-lock.js";

async function withTempDir(test: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(tmpdir(), "specdojo-exec-slot-lock-"));
  try {
    await test(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

describe("tryAcquirePoolSlot", () => {
  it("上限の数まで枠を渡し、それを超えると null を返す", async () => {
    await withTempDir(async (dir) => {
      const pool = path.join(dir, "pool");
      const first = tryAcquirePoolSlot(pool, 2, { actor: "a", label: "PJR-AAAA" });
      const second = tryAcquirePoolSlot(pool, 2, { actor: "b" });

      const third = tryAcquirePoolSlot(pool, 2, { actor: "c" });

      expect(first?.lockDir).toBe(poolSlotPath(pool, 1));
      expect(second?.lockDir).toBe(poolSlotPath(pool, 2));
      expect(third).toBeNull();
      expect(readLockOwner(first!.lockDir)).toMatchObject({ actor: "a", label: "PJR-AAAA" });
      expect(livePoolHolders(pool).map((slot) => slot.owner?.actor)).toEqual(["a", "b"]);
      releaseLock(first!);
      releaseLock(second!);
    });
  });

  it("解放された枠を次の取得者が使える", async () => {
    await withTempDir(async (dir) => {
      const pool = path.join(dir, "pool");
      const first = tryAcquirePoolSlot(pool, 1, { actor: "a" });
      releaseLock(first!);

      const second = tryAcquirePoolSlot(pool, 1, { actor: "b" });

      expect(second).not.toBeNull();
      releaseLock(second!);
    });
  });

  it("heartbeat が止まった stale な枠を奪取する", async () => {
    await withTempDir(async (dir) => {
      const pool = path.join(dir, "pool");
      const crashed = tryAcquirePoolSlot(pool, 1, { actor: "crashed" }, { heartbeatMs: 60_000 });
      crashed!.heartbeat.kill();
      await new Promise((resolve) => crashed!.heartbeat.once("exit", resolve));
      const old = new Date(Date.now() - 1_000);
      await utimes(crashed!.lockDir, old, old);

      const recovered = tryAcquirePoolSlot(pool, 1, { actor: "recovered" }, { staleMs: 10 });

      expect(recovered).not.toBeNull();
      expect(readLockOwner(recovered!.lockDir)?.actor).toBe("recovered");
      releaseLock(crashed!);
      expect(readLockOwner(recovered!.lockDir)?.actor).toBe("recovered");
      releaseLock(recovered!);
    });
  });
});

describe("acquirePoolSlotSync", () => {
  // A slot held by another process; this process cannot release it.
  async function holdForeignSlot(pool: string): Promise<string> {
    const slot = poolSlotPath(pool, 1);
    await mkdir(slot, { recursive: true });
    await writeFile(
      path.join(slot, "owner.json"),
      JSON.stringify({ actor: "other", pid: 2_147_483_646, token: "t" }),
      "utf8",
    );
    return slot;
  }

  it("枠が使用中の間は待ち、解放された後に枠を取る", async () => {
    await withTempDir(async (dir) => {
      const pool = path.join(dir, "pool");
      const slot = await holdForeignSlot(pool);
      const sleeps: number[] = [];

      const result = acquirePoolSlotSync(
        pool,
        1,
        { actor: "writer" },
        {
          timeoutMs: 10_000,
          pollMs: 50,
          sleep: (milliseconds) => {
            sleeps.push(milliseconds);
            if (sleeps.length === 3) rmSync(slot, { recursive: true, force: true });
          },
        },
      );

      expect(sleeps).toEqual([50, 50, 50]);
      expect(result.kind).toBe("acquired");
      if (result.kind === "acquired") {
        expect(readLockOwner(result.handle.lockDir)?.actor).toBe("writer");
        releaseLock(result.handle);
      }
    });
  });

  it("上限の時間を超えると、待った時間とともに timeout を返す", async () => {
    await withTempDir(async (dir) => {
      const pool = path.join(dir, "pool");
      await holdForeignSlot(pool);
      let clock = 0;

      const result = acquirePoolSlotSync(
        pool,
        1,
        { actor: "writer" },
        {
          timeoutMs: 1_000,
          pollMs: 400,
          now: () => clock,
          sleep: (milliseconds) => {
            clock += milliseconds;
          },
        },
      );

      expect(result).toEqual({ kind: "timeout", waitedMs: 1_000 });
    });
  });

  it("同じプロセスが枠を持っているときは待たずに返す", async () => {
    await withTempDir(async (dir) => {
      const pool = path.join(dir, "pool");
      const held = tryAcquirePoolSlot(pool, 1, { actor: "async-writer" });
      const sleep = vi.fn();

      const result = acquirePoolSlotSync(
        pool,
        1,
        { actor: "writer" },
        { timeoutMs: 10_000, sleep, now: () => 0 },
      );

      expect(result).toEqual({ kind: "held-by-this-process", waitedMs: 0 });
      expect(sleep).not.toHaveBeenCalled();
      releaseLock(held!);
    });
  });
});

describe("CrossProcessMutex", () => {
  it("同じディレクトリを使う別インスタンス（別プロセス相当）の処理を直列化する", async () => {
    await withTempDir(async (dir) => {
      const mutexDir = path.join(dir, "lifecycle");
      const first = new CrossProcessMutex(mutexDir, { actor: "run-a" }, { pollMs: 5 });
      const second = new CrossProcessMutex(mutexDir, { actor: "run-b" }, { pollMs: 5 });
      let active = 0;
      let maxActive = 0;
      const work = async (): Promise<void> => {
        active++;
        maxActive = Math.max(maxActive, active);
        await new Promise((resolve) => setTimeout(resolve, 20));
        active--;
      };

      await Promise.all([
        first.runExclusive(work),
        second.runExclusive(work),
        first.runExclusive(work),
      ]);

      expect(maxActive).toBe(1);
      expect(livePoolHolders(mutexDir)).toEqual([]);
    });
  });

  it("処理が失敗しても枠を解放する", async () => {
    await withTempDir(async (dir) => {
      const mutex = new CrossProcessMutex(path.join(dir, "lifecycle"), { actor: "run" });

      await expect(
        mutex.runExclusive(async () => {
          throw new Error("merge failed");
        }),
      ).rejects.toThrow("merge failed");

      await expect(mutex.runExclusive(() => "next")).resolves.toBe("next");
    });
  });
});
