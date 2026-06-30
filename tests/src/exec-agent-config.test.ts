import { describe, expect, it } from "vitest";
import {
  createProviderCapacityTracker,
  resolveMaxConcurrency,
  resolveRateLimitDetection,
  resolveRateLimitPolicy,
  type ExecDefaultsConfig,
  type RateLimitPolicy,
} from "../../src/exec-agent-config.js";

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
