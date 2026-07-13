import { existsSync } from "node:fs";
import { join } from "node:path";
import { listFilesRecursive, readYaml } from "./exec-shared.js";
import { specdojoRootDir, type AgentProvider, type ProjectMember } from "./specdojo-config.js";
import type { Proficiency, TaskMode } from "./exec-types.js";

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

// Placeholder name -> value pairs inserted into command_template as-is.
export type CommandVariableSet = Record<string, string>;

// Extra command_template variables resolved by member attributes. by_mode is keyed by the
// member's mode, by_proficiency by the member's proficiency. A variable name appearing in
// both tables is a definition error (resolution would be ambiguous).
export type CommandParams = {
  by_mode?: Partial<Record<TaskMode, CommandVariableSet>>;
  by_proficiency?: Partial<Record<Proficiency, CommandVariableSet>>;
};

// Per-provider override. Each present key fully replaces the matching global
// value for members of this provider; absent keys fall back to the global value.
// command_template / command_params have no global counterpart.
export type ProviderOverride = {
  // Non-interactive launch command template for this provider's agents. Built-in
  // placeholders {nickname}, {mode}, {proficiency} expand to the member's attributes;
  // additional placeholders come from command_params.
  command_template?: string;
  command_params?: CommandParams;
  rate_limit_detection?: RateLimitDetection;
  rate_limit_policy?: RateLimitPolicy;
  // Maximum number of this provider's agents allowed to run concurrently within a single
  // `exec run` round. Caps a provider that shares a constrained resource (e.g. opencode's
  // local single-model Ollama host) without lowering the global `--parallel` for other
  // providers. Absent or non-positive means no per-provider limit.
  max_concurrency?: number;
};

export type ExecDefaultsConfig = {
  rate_limit_detection?: RateLimitDetection;
  rate_limit_policy?: RateLimitPolicy;
  providers?: Partial<Record<AgentProvider, ProviderOverride>>;
};

// ── Launch command resolution ───────────────────────────────────────────────
// A member's launch command comes from its provider's command_template expanded with
// member attributes. The member-level `command` is an escape hatch for template-less
// setups (e.g. provider: custom) and always wins when present.

type CommandMemberAttributes = Pick<
  ProjectMember,
  "nickname" | "provider" | "mode" | "proficiency" | "command"
>;

const PLACEHOLDER_PATTERN = /\{([a-z][a-z0-9_]*)\}/g;
const BUILTIN_VARIABLE_NAMES = new Set(["nickname", "mode", "proficiency"]);

// True when the member has any command source: an explicit override or a provider
// command_template. Used to filter selectable agents without expanding the template.
export function hasMemberCommandSource(
  config: ExecDefaultsConfig,
  member: CommandMemberAttributes,
): boolean {
  if (member.command?.trim()) return true;
  if (!member.provider) return false;
  return Boolean(config.providers?.[member.provider]?.command_template);
}

function buildCommandVariables(
  provider: AgentProvider,
  member: CommandMemberAttributes,
  params: CommandParams | undefined,
): Map<string, string> {
  const variables = new Map<string, string>();
  variables.set("nickname", member.nickname);
  if (member.mode) variables.set("mode", member.mode);
  if (member.proficiency) variables.set("proficiency", member.proficiency);

  const byMode = member.mode ? params?.by_mode?.[member.mode] : undefined;
  const byProficiency = member.proficiency
    ? params?.by_proficiency?.[member.proficiency]
    : undefined;
  // Collision checks look at the full tables (not just the member's rows) so a broken
  // definition fails for every member of the provider, not only for some modes.
  const modeKeys = Object.values(params?.by_mode ?? {}).flatMap((set) => Object.keys(set ?? {}));
  const proficiencyKeys = Object.values(params?.by_proficiency ?? {}).flatMap((set) =>
    Object.keys(set ?? {}),
  );
  for (const key of [...modeKeys, ...proficiencyKeys]) {
    if (BUILTIN_VARIABLE_NAMES.has(key)) {
      throw new Error(
        `exec-defaults providers.${provider}.command_params must not redefine built-in variable {${key}}`,
      );
    }
  }
  const duplicated = modeKeys.filter((key) => proficiencyKeys.includes(key));
  if (duplicated.length > 0) {
    throw new Error(
      `exec-defaults providers.${provider}.command_params defines ${[...new Set(duplicated)].map((k) => `{${k}}`).join(", ")} in both by_mode and by_proficiency`,
    );
  }

  for (const [key, value] of Object.entries(byMode ?? {})) variables.set(key, value);
  for (const [key, value] of Object.entries(byProficiency ?? {})) variables.set(key, value);
  return variables;
}

// Resolve the shell command that launches a member's agent. Returns undefined when the
// member has neither a command override nor a provider command_template (such a member is
// not runnable by exec run). Throws when a template exists but cannot be fully expanded,
// so a broken definition surfaces as an error instead of launching a malformed command.
export function resolveMemberCommand(
  config: ExecDefaultsConfig,
  member: CommandMemberAttributes,
): string | undefined {
  const override = member.command?.trim();
  if (override) return override;

  const provider = member.provider;
  const template = provider ? config.providers?.[provider]?.command_template : undefined;
  if (!provider || !template) return undefined;

  const variables = buildCommandVariables(
    provider,
    member,
    config.providers?.[provider]?.command_params,
  );
  const expanded = template.replace(PLACEHOLDER_PATTERN, (match, name: string) => {
    return variables.get(name) ?? match;
  });

  const unresolved = [...expanded.matchAll(PLACEHOLDER_PATTERN)].map((m) => m[0]);
  if (unresolved.length > 0) {
    throw new Error(
      `Cannot resolve ${[...new Set(unresolved)].join(", ")} in providers.${provider}.command_template for member ${member.nickname} (mode: ${member.mode ?? "-"}, proficiency: ${member.proficiency ?? "-"})`,
    );
  }
  return expanded;
}

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

// Resolve a provider's concurrency cap, validating the YAML-sourced value. A missing,
// non-integer, or non-positive value means "no limit" (returns undefined).
export function resolveMaxConcurrency(
  config: ExecDefaultsConfig,
  provider?: AgentProvider,
): number | undefined {
  if (!provider) return undefined;
  const raw = config.providers?.[provider]?.max_concurrency;
  if (typeof raw !== "number" || !Number.isInteger(raw) || raw <= 0) return undefined;
  return raw;
}

// Tracks how many agents of each provider have been reserved within a single `exec run`
// round, so the scheduler can keep a capped provider (e.g. opencode) from launching more
// than its `max_concurrency` instances at once. A fresh tracker is created per round.
export type ProviderCapacityTracker = {
  // Whether another agent of this provider may start now (true when uncapped or below cap).
  hasCapacity: (provider?: AgentProvider) => boolean;
  // Record that one agent of this provider has been reserved for the current round.
  reserve: (provider?: AgentProvider) => void;
};

export function createProviderCapacityTracker(config: ExecDefaultsConfig): ProviderCapacityTracker {
  const counts = new Map<AgentProvider, number>();
  return {
    hasCapacity(provider?: AgentProvider): boolean {
      const cap = resolveMaxConcurrency(config, provider);
      if (cap === undefined || !provider) return true;
      return (counts.get(provider) ?? 0) < cap;
    },
    reserve(provider?: AgentProvider): void {
      if (!provider) return;
      counts.set(provider, (counts.get(provider) ?? 0) + 1);
    },
  };
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
