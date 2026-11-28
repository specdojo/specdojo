import { EventEmitter } from "node:events";
import { PassThrough } from "node:stream";
import type { ChildProcess } from "node:child_process";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveAgentTimeout, type ExecDefaultsConfig } from "../../../../src/exec/agent-config.js";
import { extractBlockReason } from "../../../../src/exec/run/agent.js";
import {
  agentTimeoutReason,
  usesAgentProcessGroup,
  waitForAgentExit,
} from "../../../../src/exec/run/agent-timeout.js";

// pid を持たない偽の子プロセス。process group へは送らず child.kill だけを記録する。
function fakeChild(): ChildProcess & { signals: string[] } {
  const signals: string[] = [];
  const child = Object.assign(new EventEmitter(), {
    pid: undefined,
    exitCode: null,
    stdout: new PassThrough(),
    stderr: new PassThrough(),
    signals,
    kill: (signal: string) => {
      signals.push(signal);
      return true;
    },
  });
  return child as unknown as ChildProcess & { signals: string[] };
}

afterEach(() => {
  vi.useRealTimers();
});

describe("resolveAgentTimeout", () => {
  it("returns the provider's limit with the key it came from", () => {
    const config: ExecDefaultsConfig = { providers: { claude: { agent_timeout_seconds: 7200 } } };

    expect(resolveAgentTimeout(config, "claude")).toEqual({
      seconds: 7200,
      key: "providers.claude.agent_timeout_seconds",
    });
  });

  it("returns no limit when the provider or the key is absent", () => {
    const config: ExecDefaultsConfig = { providers: { claude: { agent_timeout_seconds: 60 } } };

    expect(resolveAgentTimeout(config, "codex")).toBeUndefined();
    expect(resolveAgentTimeout(config, undefined)).toBeUndefined();
    expect(resolveAgentTimeout({}, "claude")).toBeUndefined();
  });

  it.each([0, -1, 1.5, 2_147_484, "60"])("rejects an invalid limit %s with the key", (value) => {
    const config = {
      providers: { opencode: { agent_timeout_seconds: value } },
    } as unknown as ExecDefaultsConfig;

    expect(() => resolveAgentTimeout(config, "opencode")).toThrow(
      /providers\.opencode\.agent_timeout_seconds in exec-defaults must be an integer from 1 to 2147483/,
    );
  });
});

describe("usesAgentProcessGroup", () => {
  it("keeps an agent without a limit in the runner's process group", () => {
    expect(usesAgentProcessGroup(undefined)).toBe(false);
  });
});

describe("waitForAgentExit", () => {
  it("keeps waiting for the agent when no limit is configured", async () => {
    vi.useFakeTimers();
    const child = fakeChild();
    let settled = false;
    const pending = waitForAgentExit(child, undefined).then((exit) => {
      settled = true;
      return exit;
    });

    await vi.advanceTimersByTimeAsync(24 * 60 * 60 * 1000);
    expect(settled).toBe(false);
    expect(child.signals).toEqual([]);

    child.emit("close", 0);
    expect(await pending).toEqual({ exitCode: 0, timedOut: false });
  });

  it("sends SIGTERM at the limit and settles as timed out when the agent closes", async () => {
    vi.useFakeTimers();
    const child = fakeChild();
    const pending = waitForAgentExit(child, { seconds: 5, key: "providers.claude.x" });

    await vi.advanceTimersByTimeAsync(4_999);
    expect(child.signals).toEqual([]);
    await vi.advanceTimersByTimeAsync(1);
    expect(child.signals).toEqual(["SIGTERM"]);

    child.emit("close", null);
    expect(await pending).toEqual({ exitCode: null, timedOut: true });
  });

  it("sends SIGKILL after the grace period and returns without the pipes closing", async () => {
    vi.useFakeTimers();
    const child = fakeChild();
    const pending = waitForAgentExit(
      child,
      { seconds: 1, key: "providers.claude.x" },
      { killGraceMs: 200, closeGraceMs: 100 },
    );

    await vi.advanceTimersByTimeAsync(1_200);
    expect(child.signals).toEqual(["SIGTERM", "SIGKILL"]);
    await vi.advanceTimersByTimeAsync(100);

    expect(await pending).toEqual({ exitCode: null, timedOut: true });
  });

  it("reports a spawn error without treating it as a timeout", async () => {
    const child = fakeChild();
    const pending = waitForAgentExit(child, { seconds: 60, key: "providers.claude.x" });

    child.emit("error", new Error("spawn sh ENOENT"));

    expect(await pending).toEqual({
      exitCode: null,
      timedOut: false,
      spawnError: "spawn sh ENOENT",
    });
  });
});

describe("timeout block reason", () => {
  it("names the limit and the key", () => {
    expect(agentTimeoutReason({ seconds: 90, key: "providers.codex.agent_timeout_seconds" })).toBe(
      "agent timed out after 90s (providers.codex.agent_timeout_seconds); " +
        "the runner stopped its process group with SIGTERM, then SIGKILL",
    );
  });

  it("is preferred over a block line the agent printed before it hung", () => {
    const reason = agentTimeoutReason({
      seconds: 90,
      key: "providers.codex.agent_timeout_seconds",
    });
    const stderr = `blocked: missing plan; need=plan\nworking...\nblocked: ${reason}\n`;

    expect(extractBlockReason(stderr)).toBe(`agent exited with non-zero code: blocked: ${reason}`);
  });
});
