import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { execLifecyclePoolPath } from "../../../../src/exec/run/lock.js";
import { withExecLifecycleMutex } from "../../../../src/exec/run/schedule-task.js";
import { SerialAsyncLock } from "../../../../src/exec/run/shared.js";
import {
  CrossProcessMutex,
  livePoolHolders,
  releaseLock,
  tryAcquirePoolSlot,
} from "../../../../src/exec/slot-lock.js";

async function withTempDir(test: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(tmpdir(), "specdojo-schedule-integration-lock-"));
  try {
    await test(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

describe("withExecLifecycleMutex", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("register --commit が lifecycle ロックを持つ間は schedule の統合を始めない", async () => {
    vi.spyOn(process.stdout, "write").mockReturnValue(true);
    await withTempDir(async (execution) => {
      const register = new CrossProcessMutex(
        execLifecyclePoolPath(execution),
        { actor: "orchestrator", label: "register add" },
        { pollMs: 5 },
      );
      let releaseRegister!: () => void;
      let registerHolding!: () => void;
      const held = new Promise<void>((resolve) => {
        registerHolding = resolve;
      });
      const recording = register.runExclusive(async () => {
        registerHolding();
        await new Promise<void>((resolve) => {
          releaseRegister = resolve;
        });
      });
      await held;

      const integration = withExecLifecycleMutex(new SerialAsyncLock(), execution, {
        actor: "runner",
        label: "integrate T-1",
      });
      let integrated = false;
      const integrating = integration.runExclusive(() => {
        integrated = true;
      });
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(integrated).toBe(false);

      releaseRegister();
      await recording;
      await integrating;

      expect(integrated).toBe(true);
      expect(livePoolHolders(execLifecyclePoolPath(execution))).toEqual([]);
    });
  });

  it("統合の処理中は lifecycle ロックの枠を持ち、終わると解放する", async () => {
    await withTempDir(async (execution) => {
      const pool = execLifecyclePoolPath(execution);
      const integration = withExecLifecycleMutex(undefined, execution, {
        actor: "runner",
        label: "integrate T-1",
      });

      const contender = await integration.runExclusive(() =>
        tryAcquirePoolSlot(pool, 1, { actor: "x" }),
      );
      if (contender) releaseLock(contender);

      expect(contender).toBeNull();
      expect(livePoolHolders(pool)).toEqual([]);
    });
  });
});
