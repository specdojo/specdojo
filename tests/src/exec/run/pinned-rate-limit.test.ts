import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type { ExecDefaultsConfig } from "../../../../src/exec/agent-config.js";
import { runWithRetry } from "../../../../src/exec/run/agent.js";

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

function fixture(): string {
  const directory = mkdtempSync(join(tmpdir(), "specdojo-pinned-rate-limit-"));
  temporaryDirectories.push(directory);
  return directory;
}

const defaults: ExecDefaultsConfig = {
  rate_limit_detection: { stderr_patterns: ["rate limit"] },
  rate_limit_policy: {
    cooldown_seconds: { rate_limit: 60 },
    on_non_critical: { action: "skip" },
    on_critical: {
      action: "try_next",
      retry: {
        max_attempts: 1,
        initial_wait_seconds: 1,
        backoff_multiplier: 1,
        max_wait_seconds: 1,
      },
      on_exhausted: "block",
    },
  },
};

describe("pinned-agent rate-limit recovery", () => {
  it("reads retry-after and resumes the same agent without a real wait", async () => {
    const directory = fixture();
    const marker = join(directory, "attempted");
    const script = join(directory, "wait-agent.cjs");
    writeFileSync(
      script,
      `const fs = require("node:fs");\n` +
        `const marker = ${JSON.stringify(marker)};\n` +
        `if (!fs.existsSync(marker)) {\n` +
        `  fs.writeFileSync(marker, "1");\n` +
        `  console.error("rate limit; retry-after: 60 seconds");\n` +
        `  process.exit(1);\n` +
        `}\n` +
        `console.log("resumed");\n`,
      "utf8",
    );
    const sleeps: number[] = [];

    const outcome = await runWithRetry(
      [{ command: `node ${JSON.stringify(script)}`, actor: "pinned", provider: "custom" }],
      "prompt",
      defaults,
      process.cwd(),
      process.env,
      undefined,
      {
        action: "wait",
        maxWaitSeconds: 120,
        sleep: async (milliseconds) => {
          sleeps.push(milliseconds);
        },
      },
    );

    expect(outcome.result).toBe("success");
    expect(outcome.attempts).toBe(2);
    expect(sleeps).toHaveLength(1);
    expect(sleeps[0]).toBeGreaterThan(50_000);
    expect(outcome.rateLimitEvents).toMatchObject([
      { action: "wait", from_actor: "pinned", to_actor: "pinned" },
    ]);
  });

  it("switches once to the configured fallback agent", async () => {
    const directory = fixture();
    const limited = join(directory, "limited.cjs");
    const fallback = join(directory, "fallback.cjs");
    writeFileSync(limited, `console.error("rate limit"); process.exit(1);\n`, "utf8");
    writeFileSync(fallback, `console.log("fallback complete");\n`, "utf8");

    const outcome = await runWithRetry(
      [{ command: `node ${JSON.stringify(limited)}`, actor: "primary", provider: "custom" }],
      "prompt",
      defaults,
      process.cwd(),
      process.env,
      undefined,
      {
        action: "fallback",
        maxWaitSeconds: 0,
        fallbackCandidate: {
          command: `node ${JSON.stringify(fallback)}`,
          actor: "fallback",
          provider: "custom",
        },
      },
    );

    expect(outcome.result).toBe("success");
    expect(outcome.actor).toBe("fallback");
    expect(outcome.rateLimitEvents).toMatchObject([
      { action: "fallback", from_actor: "primary", to_actor: "fallback" },
    ]);
  });
});
