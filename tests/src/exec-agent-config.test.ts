import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  createProviderCapacityTracker,
  loadExecDefaultsConfig,
  ProviderConcurrencyGate,
  resolveMaxConcurrency,
  resolveRateLimitDetection,
  resolveRateLimitPolicy,
  type ExecDefaultsConfig,
  type RateLimitPolicy,
} from "../../src/exec-agent-config.js";

describe("parent validation config", () => {
  it("loads allowlisted IDs and rejects unknown IDs", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-parent-validation-config-"));
    try {
      const validPath = join(root, "valid.yaml");
      writeFileSync(
        validPath,
        "pipeline:\n  parent_validations:\n    - validate-schema\n    - test-unit\n    - test-integration\n",
        "utf8",
      );
      expect(loadExecDefaultsConfig(validPath).pipeline?.parent_validations).toEqual([
        "validate-schema",
        "test-unit",
        "test-integration",
      ]);

      const invalidPath = join(root, "invalid.yaml");
      writeFileSync(
        invalidPath,
        "pipeline:\n  parent_validations:\n    - npm-run-arbitrary\n",
        "utf8",
      );
      expect(() => loadExecDefaultsConfig(invalidPath)).toThrow(/Unknown parent validation id/);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

const globalPolicy: RateLimitPolicy = {
  on_non_critical: { action: "skip" },
  on_critical: {
    action: "try_next",
    retry: {
      max_attempts: 3,
      initial_wait_seconds: 60,
      backoff_multiplier: 3,
      max_wait_seconds: 600,
    },
    on_exhausted: "block",
  },
};

const config: ExecDefaultsConfig = {
  rate_limit_detection: {
    exit_codes: [1],
    stderr_patterns: ["rate limit", "429"],
  },
  rate_limit_policy: globalPolicy,
  providers: {
    claude: {
      rate_limit_detection: {
        stderr_patterns: ["rate limit", "429", "overloaded", "session limit"],
      },
    },
    opencode: {
      max_concurrency: 1,
      rate_limit_detection: {
        exit_codes: [],
        stderr_patterns: ["timeout", "out of memory"],
      },
      rate_limit_policy: {
        on_non_critical: { action: "skip" },
        on_critical: {
          action: "try_next",
          retry: {
            max_attempts: 3,
            initial_wait_seconds: 120,
            backoff_multiplier: 2,
            max_wait_seconds: 600,
          },
          on_exhausted: "block",
        },
      },
    },
  },
};

describe("resolveRateLimitDetection", () => {
  it("returns the provider override when present", () => {
    const actual = resolveRateLimitDetection(config, "claude");

    expect(actual?.stderr_patterns).toEqual(["rate limit", "429", "overloaded", "session limit"]);
  });

  it("lets a provider drop generic exit_codes via its own override", () => {
    const actual = resolveRateLimitDetection(config, "opencode");

    expect(actual?.exit_codes).toEqual([]);
    expect(actual?.stderr_patterns).toEqual(["timeout", "out of memory"]);
  });

  it("falls back to the global detection for a provider without an override", () => {
    const actual = resolveRateLimitDetection(config, "codex");

    expect(actual).toBe(config.rate_limit_detection);
  });

  it("falls back to the global detection when no provider is given", () => {
    const actual = resolveRateLimitDetection(config, undefined);

    expect(actual).toBe(config.rate_limit_detection);
  });
});

describe("resolveRateLimitPolicy", () => {
  it("returns the provider override policy when present", () => {
    const actual = resolveRateLimitPolicy(config, "opencode");

    expect(actual?.on_critical.retry.initial_wait_seconds).toBe(120);
  });

  it("resolves detection and policy independently", () => {
    // claude overrides detection only, so its policy must fall back to the global one.
    const actual = resolveRateLimitPolicy(config, "claude");

    expect(actual).toBe(globalPolicy);
  });

  it("falls back to the global policy for a provider without an override", () => {
    const actual = resolveRateLimitPolicy(config, "codex");

    expect(actual).toBe(globalPolicy);
  });
});

describe("resolveMaxConcurrency", () => {
  it("returns the provider cap when set to a positive integer", () => {
    expect(resolveMaxConcurrency(config, "opencode")).toBe(1);
  });

  it("returns undefined for a provider without a cap", () => {
    expect(resolveMaxConcurrency(config, "claude")).toBeUndefined();
  });

  it("returns undefined when no provider is given", () => {
    expect(resolveMaxConcurrency(config, undefined)).toBeUndefined();
  });

  it("treats a non-positive or non-integer cap as no limit", () => {
    const bad: ExecDefaultsConfig = {
      providers: {
        opencode: { max_concurrency: 0 },
        codex: { max_concurrency: 2.5 },
      },
    };

    expect(resolveMaxConcurrency(bad, "opencode")).toBeUndefined();
    expect(resolveMaxConcurrency(bad, "codex")).toBeUndefined();
  });
});

describe("createProviderCapacityTracker", () => {
  it("stops granting capacity once a capped provider reaches its limit", () => {
    const tracker = createProviderCapacityTracker(config);

    expect(tracker.hasCapacity("opencode")).toBe(true);
    tracker.reserve("opencode");

    expect(tracker.hasCapacity("opencode")).toBe(false);
  });

  it("releases capacity when a capped provider's running task finishes", () => {
    const tracker = createProviderCapacityTracker(config);

    tracker.reserve("opencode");
    expect(tracker.hasCapacity("opencode")).toBe(false);

    tracker.release("opencode");
    expect(tracker.hasCapacity("opencode")).toBe(true);
  });

  it("never limits a provider that has no cap", () => {
    const tracker = createProviderCapacityTracker(config);

    tracker.reserve("claude");
    tracker.reserve("claude");

    expect(tracker.hasCapacity("claude")).toBe(true);
  });

  it("tracks each provider independently", () => {
    const tracker = createProviderCapacityTracker(config);

    tracker.reserve("opencode");

    expect(tracker.hasCapacity("opencode")).toBe(false);
    expect(tracker.hasCapacity("codex")).toBe(true);
  });

  it("grants capacity when the provider is undefined", () => {
    const tracker = createProviderCapacityTracker(config);

    expect(tracker.hasCapacity(undefined)).toBe(true);
  });
});

describe("ProviderConcurrencyGate", () => {
  it("同じ provider の処理を max_concurrency までに制限する", async () => {
    const gate = new ProviderConcurrencyGate(config);
    const events: string[] = [];
    let releaseFirst!: () => void;
    let markFirstStarted!: () => void;
    const firstStarted = new Promise<void>((resolve) => {
      markFirstStarted = resolve;
    });
    const holdFirst = new Promise<void>((resolve) => {
      releaseFirst = resolve;
    });

    const first = gate.run("opencode", async () => {
      events.push("first:start");
      markFirstStarted();
      await holdFirst;
      events.push("first:end");
    });
    await firstStarted;
    const second = gate.run("opencode", async () => {
      events.push("second:start");
    });
    await Promise.resolve();

    expect(events).toEqual(["first:start"]);
    releaseFirst();
    await Promise.all([first, second]);
    expect(events).toEqual(["first:start", "first:end", "second:start"]);
  });

  it("別 provider の処理は待たせない", async () => {
    const gate = new ProviderConcurrencyGate(config);
    let releaseOpencode!: () => void;
    let markOpencodeStarted!: () => void;
    const opencodeStarted = new Promise<void>((resolve) => {
      markOpencodeStarted = resolve;
    });
    const holdOpencode = new Promise<void>((resolve) => {
      releaseOpencode = resolve;
    });

    const capped = gate.run("opencode", async () => {
      markOpencodeStarted();
      await holdOpencode;
    });
    await opencodeStarted;
    await expect(gate.run("claude", async () => "done")).resolves.toBe("done");
    releaseOpencode();
    await capped;
  });
});
