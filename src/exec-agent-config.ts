import { existsSync } from "node:fs";
import { join } from "node:path";
import { listFilesRecursive, readYaml } from "./exec-shared.js";
import { specdojoRootDir } from "./specdojo-config.js";

// ── Types for .specdojo/exec-defaults.yaml (global) ───────────────────────────

export type RateLimitDetection = {
  exit_codes?: number[];
  stderr_patterns?: string[];
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

export type ExecDefaultsConfig = {
  rate_limit_detection?: RateLimitDetection;
  rate_limit_policy?: RateLimitPolicy;
};

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
