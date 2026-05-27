import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { readYaml } from './exec-shared.js'
import { specdojoRootDir } from './specdojo-config.js'

export type Tier = 'small' | 'full' | 'expert'

export type PhaseTierRule = {
  phase_set: string
  phase: string
  tier: Tier
  capabilities?: string[]
}

export type DifficultyOverride = {
  difficulty: string
  min_tier: Tier
}

export type TierRoutingEntry = {
  cmd: string
  by: string
}

export type RateLimitRetry = {
  max_attempts: number
  initial_wait_seconds: number
  backoff_multiplier: number
  max_wait_seconds: number
}

export type RateLimitPolicy = {
  detection: {
    exit_codes?: number[]
    stderr_patterns?: string[]
  }
  on_non_critical: {
    action: 'skip'
  }
  on_critical: {
    action: 'retry_with_fallback'
    fallback_tier: string
    retry: RateLimitRetry
  }
}

export type ExecAgentConfig = {
  phase_tier_rules: PhaseTierRule[]
  difficulty_overrides: DifficultyOverride[]
  tier_routing: Record<string, TierRoutingEntry>
  capabilities?: Record<string, { description: string }>
  rate_limit_policy?: RateLimitPolicy
  agent_commands: Record<string, string>
}

export type ResolvedRouting = {
  cmd: string
  agentBy: string
  tier: Tier
  capabilities: string[]
}

const TIER_ORDER: Record<Tier, number> = { small: 0, full: 1, expert: 2 }

function promoteTier(current: Tier, minTier: Tier): Tier {
  return TIER_ORDER[current] >= TIER_ORDER[minTier] ? current : minTier
}

export function defaultAgentConfigPath(): string {
  return join(specdojoRootDir(), '.specdojo', 'exec-agent.yaml')
}

export function loadExecAgentConfig(configPath?: string): ExecAgentConfig {
  const path = configPath ?? defaultAgentConfigPath()
  if (!existsSync(path)) {
    throw new Error(`exec-agent.yaml not found: ${path}`)
  }
  const raw = readYaml(path) as ExecAgentConfig
  if (!raw || !Array.isArray(raw.phase_tier_rules)) {
    throw new Error(`Invalid exec-agent.yaml: missing phase_tier_rules`)
  }
  if (!raw.agent_commands || typeof raw.agent_commands !== 'object') {
    throw new Error(`Invalid exec-agent.yaml: missing agent_commands`)
  }
  return raw
}

export function resolveTier(
  phaseSet: string,
  phaseId: string,
  difficulty: string,
  config: ExecAgentConfig
): { tier: Tier; capabilities: string[] } | null {
  const rule = config.phase_tier_rules.find(r => r.phase_set === phaseSet && r.phase === phaseId)
  if (!rule) return null

  let tier = rule.tier
  const capabilities = rule.capabilities ?? []

  for (const override of config.difficulty_overrides) {
    if (override.difficulty === difficulty) {
      tier = promoteTier(tier, override.min_tier)
    }
  }

  return { tier, capabilities }
}

export function resolveRouting(
  tier: Tier,
  capabilities: string[],
  config: ExecAgentConfig
): ResolvedRouting | null {
  for (const cap of capabilities) {
    const compositeKey = `${tier}+${cap}`
    const entry = config.tier_routing[compositeKey]
    if (entry) {
      return { cmd: entry.cmd, agentBy: entry.by, tier, capabilities }
    }
  }
  const entry = config.tier_routing[tier]
  if (!entry) return null
  return { cmd: entry.cmd, agentBy: entry.by, tier, capabilities }
}

export function resolveAgentCommand(
  routing: ResolvedRouting,
  config: ExecAgentConfig
): string | null {
  return config.agent_commands[routing.cmd] ?? null
}
