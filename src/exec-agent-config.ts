import { existsSync } from "node:fs";
import { join } from "node:path";
import { listFilesRecursive, readYaml } from "./exec-shared.js";
import { specdojoRootDir, type AgentProvider } from "./specdojo-config.js";

// ── Types for .specdojo/exec-defaults.yaml (global + per-provider) ─────────────

export type RateLimitDetection = {
  exit_codes?: number[];
  stderr_patterns?: string[];
  // When true (the default), stderr_patterns only count as a rate-limit signal if the
  // agent process also exited non-zero. This avoids false positives where a successful
  // run merely echoes a pattern phrase (e.g. an agent editing a file that contains the
  // literal text "rate limit"). Set to false to match stderr patterns regardless of exit code.
  stderr_requires_nonzero_exit?: boolean;
};

export type RateLimitRetry = {
  max_attempts: number;
  initial_wait_seconds: number;
  backoff_multiplier: number;
  max_wait_seconds: number;
};

export type RateLimitPolicy = {
  on_non_critical: {
    action: "skip";
  };
  on_critical: {
    action: "try_next";
    retry: RateLimitRetry;
    on_exhausted: "block";
  };
};

// Per-provider override. Each present key fully replaces the matching global
// value for members of this provider; absent keys fall back to the global value.
export type ProviderOverride = {
  rate_limit_detection?: RateLimitDetection;
  rate_limit_policy?: RateLimitPolicy;
};

export type ExecDefaultsConfig = {
  rate_limit_detection?: RateLimitDetection;
  rate_limit_policy?: RateLimitPolicy;
  providers?: Partial<Record<AgentProvider, ProviderOverride>>;
};

// ── Provider resolution ─────────────────────────────────────────────────────
// Detection and policy are resolved independently: a provider override for one
// key does not drop the global value for the other.

export function resolveRateLimitDetection(
  config: ExecDefaultsConfig,
  provider?: AgentProvider,
): RateLimitDetection | undefined {
  const override = provider ? config.providers?.[provider]?.rate_limit_detection : undefined;
  return override ?? config.rate_limit_detection;
}

export function resolveRateLimitPolicy(
  config: ExecDefaultsConfig,
  provider?: AgentProvider,
): RateLimitPolicy | undefined {
  const override = provider ? config.providers?.[provider]?.rate_limit_policy : undefined;
  return override ?? config.rate_limit_policy;
}

// ── Loaders ───────────────────────────────────────────────────────────────────

export function defaultExecDefaultsPath(): string {
  return join(specdojoRootDir(), ".specdojo", "exec-defaults.yaml");
}

function legacyAgentConfigPath(): string {
  return join(specdojoRootDir(), ".specdojo", "exec-agent.yaml");
}

function loadLegacyRateLimitPolicy(executionPath?: string): RateLimitPolicy | undefined {
  if (!executionPath || !existsSync(executionPath)) return undefined;
  const files = listFilesRecursive(executionPath).filter((f) =>
    /exec-strategy-.*\.(yaml|yml)$/.test(f),
  );
  for (const file of files) {
    let raw: { rate_limit_policy?: RateLimitPolicy } | undefined;
    try {
      raw = readYaml(file) as { rate_limit_policy?: RateLimitPolicy };
    } catch {
      continue;
    }
    if (raw?.rate_limit_policy) return raw.rate_limit_policy;
  }
  return undefined;
}

export function loadExecDefaultsConfig(
  configPath?: string,
  executionPath?: string,
): ExecDefaultsConfig {
  const path = configPath ?? defaultExecDefaultsPath();
  let defaults: ExecDefaultsConfig = {};

  if (existsSync(path)) {
    defaults = (readYaml(path) as ExecDefaultsConfig) ?? {};
  } else {
    const legacyPath = legacyAgentConfigPath();
    if (existsSync(legacyPath)) {
      defaults = (readYaml(legacyPath) as ExecDefaultsConfig) ?? {};
    }
  }

  if (!defaults.rate_limit_policy) {
    const legacyPolicy = loadLegacyRateLimitPolicy(executionPath);
    if (legacyPolicy) defaults.rate_limit_policy = legacyPolicy;
  }

  return defaults;
}
