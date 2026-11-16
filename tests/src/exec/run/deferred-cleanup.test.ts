import { describe, expect, it } from "vitest";
import {
  DeferredCleanup,
  runWithDeferredCleanup,
  type CleanupOutcome,
} from "../../../../src/exec/run/deferred-cleanup.js";
import { SerialAsyncLock, type AsyncLock } from "../../../../src/exec/run/shared.js";

// runExclusive の出入りを記録するロック。片付けがロックの外で走ったかを確かめる。
class RecordingLock implements AsyncLock {
  readonly events: string[] = [];
  held = false;
  private readonly inner = new SerialAsyncLock();

  runExclusive<T>(fn: () => Promise<T> | T): Promise<T> {
    return this.inner.runExclusive(async () => {
      this.held = true;
      this.events.push("acquire");
      try {
        return await fn();
      } finally {
        this.held = false;
        this.events.push("release");
      }
    });
  }
}

describe("runWithDeferredCleanup", () => {
  it("releases the lock before the cleanup and reacquires it for the bookkeeping after it", async () => {
    const lock = new RecordingLock();
    let heldDuringCleanup: boolean | undefined;
    let heldAfterCleanup: boolean | undefined;

    const actual = await runWithDeferredCleanup<string>(lock, () => {
      lock.events.push("integrate");
      return new DeferredCleanup<string>(
        () => {
          heldDuringCleanup = lock.held;
          lock.events.push("cleanup");
        },
        () => {
          heldAfterCleanup = lock.held;
          lock.events.push("after");
          return "done";
        },
      );
    });

    expect(actual).toBe("done");
    expect(heldDuringCleanup).toBe(false);
    expect(heldAfterCleanup).toBe(true);
    expect(lock.events).toEqual([
      "acquire",
      "integrate",
      "release",
      "cleanup",
      "acquire",
      "after",
      "release",
    ]);
  });

  it("lets another lock holder run while the cleanup is still in progress", async () => {
    const lock = new SerialAsyncLock();
    const order: string[] = [];

    await runWithDeferredCleanup<void>(
      lock,
      () =>
        new DeferredCleanup<void>(
          async () => {
            order.push("cleanup start");
            // 片付けがロックを持ったままなら、この待ちは終わらない。
            await lock.runExclusive(() => {
              order.push("other bookkeeping");
            });
            order.push("cleanup end");
          },
          () => {
            order.push("after");
          },
        ),
    );

    expect(order).toEqual(["cleanup start", "other bookkeeping", "cleanup end", "after"]);
  });

  it("passes a cleanup failure to the bookkeeping step instead of throwing it", async () => {
    const failure = new Error("git worktree remove failed");
    let received: CleanupOutcome | undefined;

    const actual = await runWithDeferredCleanup<string>(
      undefined,
      () =>
        new DeferredCleanup<string>(
          () => {
            throw failure;
          },
          (outcome) => {
            received = outcome;
            return "blocked";
          },
        ),
    );

    expect(actual).toBe("blocked");
    expect(received).toEqual({ ok: false, error: failure });
  });

  it("returns the integration result as is when no cleanup is deferred", async () => {
    const lock = new RecordingLock();

    const actual = await runWithDeferredCleanup<string>(lock, () => "waiting");

    expect(actual).toBe("waiting");
    expect(lock.events).toEqual(["acquire", "release"]);
  });
});
