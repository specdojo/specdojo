import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { listFilesRecursive, readYaml } from './exec-shared.js'
import { specdojoRootDir } from './specdojo-config.js'
import type { TaskKind, TaskMode } from './exec-types.js'

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
  mode?: TaskMode
  task_kind?: TaskKind
  capabilities?: string[]
  proficiency?: string
}

export type ResolvedRequirements = {
  capabilities: string[]
  proficiency?: string
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
  mode?: TaskMode,
  taskKind?: TaskKind
): boolean {
  const effectiveTaskKind = taskKind ?? 'deliverable'
  if (rule.phase_set !== undefined && rule.phase_set !== phaseSet) return false
  if (rule.phase !== undefined && rule.phase !== phaseId) return false
  if (rule.mode !== undefined && rule.mode !== mode) return false
  if (rule.task_kind !== undefined && rule.task_kind !== effectiveTaskKind) return false
  return true
}

export function resolveAssignment(
  phaseSet: string,
  phaseId: string,
  config: ExecStrategyConfig,
  mode?: TaskMode,
  taskKind?: TaskKind
): ResolvedRequirements | null {
  for (const rule of config.assignment_rules) {
    if (ruleMatches(rule, phaseSet, phaseId, mode, taskKind)) {
      return { capabilities: rule.capabilities ?? [], proficiency: rule.proficiency }
    }
  }
  return null
}
