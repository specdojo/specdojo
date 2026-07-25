import { describe, expect, it } from "vitest";
import { runCompletionDrivenWorkerPool } from "../../src/exec-run.js";

function deferred<T>(): { promise: Promise<T>; resolve: (value: T) => void } {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

async function waitFor(assertion: () => void): Promise<void> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 20; attempt++) {
    try {
      assertion();
      return;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }
  throw lastError;
}

describe("runCompletionDrivenWorkerPool", () => {
  it("fills a freed slot as soon as one task completes", async () => {
    const available = ["long", "short", "next"];
    const started: string[] = [];
    const running = new Map<string, ReturnType<typeof deferred<string>>>();
    const openSlots: number[] = [];

    const pool = runCompletionDrivenWorkerPool({
      maxParallel: 2,
      fillSlots: (openSlotCount) => {
        openSlots.push(openSlotCount);
        return available.splice(0, openSlotCount);
      },
      runItem: (item: string) => {
        started.push(item);
        const pending = deferred<string>();
        running.set(item, pending);
        return pending.promise;
      },
    });

    await waitFor(() => expect(started).toEqual(["long", "short"]));

    running.get("short")?.resolve("short-done");
    await waitFor(() => expect(started).toEqual(["long", "short", "next"]));

    running.get("next")?.resolve("next-done");
    running.get("long")?.resolve("long-done");

    await expect(pool).resolves.toEqual({ launched: 3, completed: 3 });
    expect(openSlots.slice(0, 2)).toEqual([2, 1]);
  });

  it("stops launching new work after a stop result while draining running tasks", async () => {
    const available = ["critical", "long", "next"];
    const started: string[] = [];
    const running = new Map<string, ReturnType<typeof deferred<string>>>();

    const pool = runCompletionDrivenWorkerPool({
      maxParallel: 2,
      fillSlots: (openSlotCount) => available.splice(0, openSlotCount),
      runItem: (item: string) => {
        started.push(item);
        const pending = deferred<string>();
        running.set(item, pending);
        return pending.promise;
      },
      onSettled: (_item, result) => (result === "stop" ? { stop: true } : undefined),
    });

    await waitFor(() => expect(started).toEqual(["critical", "long"]));

    running.get("critical")?.resolve("stop");
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(started).toEqual(["critical", "long"]);

    running.get("long")?.resolve("done");

    await expect(pool).resolves.toEqual({ launched: 2, completed: 2 });
  });
});
