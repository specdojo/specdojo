import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { listFilesRecursive, readYaml } from './exec-shared.js'
import { specdojoRootDir } from './specdojo-config.js'

// ── Types for .specdojo/exec-agent.yaml (global) ──────────────────────────────

export type RateLimitDetection = {
  exit_codes?: number[]
  stderr_patterns?: string[]
}

export type ExecAgentGlobalConfig = {
  rate_limit_detection?: RateLimitDetection
}

// ── Types for execution/exec-strategy-<track>.yaml ────────────────────────────

export type AssignmentRule = {
  phase_set?: string
  phase?: string
  difficulty?: string
  members: string[]
}

export type RateLimitRetry = {
  max_attempts: number
  initial_wait_seconds: number
  backoff_multiplier: number
  max_wait_seconds: number
}

export type RateLimitPolicy = {
  on_non_critical: {
    action: 'skip'
  }
  on_critical: {
    action: 'try_next'
    retry: RateLimitRetry
    on_exhausted: 'block'
  }
}

export type ExecStrategyConfig = {
  assignment_rules: AssignmentRule[]
  rate_limit_policy?: RateLimitPolicy
}

// ── Loaders ───────────────────────────────────────────────────────────────────

export function defaultAgentConfigPath(): string {
  return join(specdojoRootDir(), '.specdojo', 'exec-agent.yaml')
}

export function loadExecAgentGlobalConfig(configPath?: string): ExecAgentGlobalConfig {
  const path = configPath ?? defaultAgentConfigPath()
  if (!existsSync(path)) return {}
  const raw = readYaml(path) as ExecAgentGlobalConfig
  return raw ?? {}
}

export function loadExecStrategyConfig(executionPath: string): ExecStrategyConfig {
  const files = listFilesRecursive(executionPath)
    .filter(f => /exec-strategy-.*\.(yaml|yml)$/.test(f))
    .sort()

  const allRules: AssignmentRule[] = []
  let policy: RateLimitPolicy | undefined

  for (const file of files) {
    let raw: ExecStrategyConfig
    try {
      raw = readYaml(file) as ExecStrategyConfig
    } catch {
      continue
    }
    if (!raw) continue
    if (Array.isArray(raw.assignment_rules)) {
      allRules.push(...raw.assignment_rules)
    }
    if (!policy && raw.rate_limit_policy) {
      policy = raw.rate_limit_policy
    }
  }

  return { assignment_rules: allRules, rate_limit_policy: policy }
}

// ── Resolution ────────────────────────────────────────────────────────────────

function ruleMatches(
  rule: AssignmentRule,
  phaseSet: string,
  phaseId: string,
  difficulty: string
): boolean {
  if (rule.phase_set !== undefined || rule.phase !== undefined) {
    if (rule.phase_set !== phaseSet || rule.phase !== phaseId) return false
    if (rule.difficulty !== undefined && rule.difficulty !== difficulty) return false
    return true
  }
  if (rule.difficulty !== undefined) {
    return rule.difficulty === difficulty
  }
  return true
}

export function resolveAssignment(
  phaseSet: string,
  phaseId: string,
  difficulty: string,
  config: ExecStrategyConfig
): string[] | null {
  for (const rule of config.assignment_rules) {
    if (ruleMatches(rule, phaseSet, phaseId, difficulty)) {
      return rule.members.length > 0 ? rule.members : null
    }
  }
  return null
}
