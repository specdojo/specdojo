import { mkdtemp, rm, utimes } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  CrossProcessMutex,
  livePoolHolders,
  poolSlotPath,
  readLockOwner,
  releaseLock,
  tryAcquirePoolSlot,
} from "../../src/exec-slot-lock.js";

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
