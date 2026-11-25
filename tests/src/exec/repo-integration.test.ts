import { describe, expect, it } from "vitest";
import { withTaskIntegrationLock } from "../../../src/exec/repo-integration.js";

function deferred(): { promise: Promise<void>; resolve: () => void } {
  let resolve: () => void = () => undefined;
  const promise = new Promise<void>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

// PJR-P8SX: 統合の commit を非同期にしても、同じ process のタスクの統合は 1 件ずつ進む。
describe("withTaskIntegrationLock", () => {
  it("runs a later integration only after the earlier one finishes", async () => {
    const events: string[] = [];
    const firstCommit = deferred();

    const first = withTaskIntegrationLock(async () => {
      events.push("first:start");
      await firstCommit.promise;
      events.push("first:end");
    });
    const second = withTaskIntegrationLock(async () => {
      events.push("second:start");
      await Promise.resolve();
      events.push("second:end");
    });
    await new Promise((resolveTick) => setImmediate(resolveTick));
    expect(events).toEqual(["first:start"]);

    firstCommit.resolve();
    await Promise.all([first, second]);

    expect(events).toEqual(["first:start", "first:end", "second:start", "second:end"]);
  });

  it("releases the lock when an integration fails", async () => {
    const failed = withTaskIntegrationLock(() => Promise.reject(new Error("merge failed: T-1")));

    await expect(failed).rejects.toThrow(/merge failed: T-1/);
    await expect(withTaskIntegrationLock(() => Promise.resolve("next"))).resolves.toBe("next");
  });
});
