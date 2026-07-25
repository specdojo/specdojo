import type { AgentProvider } from "./specdojo-config.js";
import type { CurrentState, StateSnapshot } from "./exec-types.js";

export type AgentLimitKind =
  | "rate_limit"
  | "session_limit"
  | "quota_exhausted"
  | "overloaded"
  | "timeout"
  | "oom";

export type AgentLimitSignal = {
  availability_state: "limited" | "transient_failure";
  retryable: boolean;
  auto_resume: boolean;
  provider?: AgentProvider;
  kind: AgentLimitKind;
  raw_message: string;
  observed_at: string;
  resume_at?: string;
  resume_source?: "provider_reset" | "retry_after" | "cooldown_policy";
};

export type DeferredLimitTask = {
  taskId: string;
  actor: string;
  provider?: AgentProvider;
  kind: AgentLimitKind;
  resumeAt: string;
  attempts: number;
  worktree?: string;
};

const RAW_MESSAGE_MAX_LENGTH = 500;

function limitKind(output: string): AgentLimitKind {
  const lower = output.toLowerCase();
  if (
    /\b(weekly|monthly|usage)\s+limit\b/.test(lower) ||
    lower.includes("quota exhausted") ||
    lower.includes("quota exceeded") ||
    lower.includes("premium request")
  ) {
    return "quota_exhausted";
  }
  if (lower.includes("session limit") || lower.includes("5-hour limit")) return "session_limit";
  if (lower.includes("overloaded") || lower.includes("over capacity")) return "overloaded";
  if (lower.includes("timeout") || lower.includes("timed out")) return "timeout";
  if (lower.includes("out of memory") || /\boom\b/.test(lower)) return "oom";
  return "rate_limit";
}

function diagnosticLine(output: string, kind: AgentLimitKind): string {
  const patterns: Record<AgentLimitKind, RegExp> = {
    rate_limit: /rate limit|too many requests|\b429\b|retry.after/i,
    session_limit: /session limit|5-hour limit/i,
    quota_exhausted: /weekly limit|monthly limit|usage limit|quota|premium request/i,
    overloaded: /overloaded|over capacity/i,
    timeout: /timeout|timed out/i,
    oom: /out of memory|\boom\b/i,
  };
  const lines = output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const matched =
    lines.find((line) => patterns[kind].test(line)) ?? lines.at(-1) ?? "limit reached";
  return matched.length > RAW_MESSAGE_MAX_LENGTH
    ? `${matched.slice(0, RAW_MESSAGE_MAX_LENGTH)}…`
    : matched;
}

function timezoneOffsetMinutes(token: string | undefined): number | undefined {
  if (!token) return undefined;
  const normalized = token.trim().toUpperCase();
  if (normalized === "UTC" || normalized === "GMT" || normalized === "Z") return 0;
  if (normalized === "JST") return 9 * 60;
  const match = normalized.match(/^(?:UTC|GMT)?([+-])(\d{1,2})(?::?(\d{2}))?$/);
  if (!match) return undefined;
  const hours = Number.parseInt(match[2], 10);
  const minutes = Number.parseInt(match[3] ?? "0", 10);
  if (hours > 23 || minutes > 59) return undefined;
  const sign = match[1] === "+" ? 1 : -1;
  return sign * (hours * 60 + minutes);
}

function nextTimeOfDayUtc(
  observedAt: Date,
  hour: number,
  minute: number,
  offsetMinutes: number,
): Date {
  const localNow = new Date(observedAt.getTime() + offsetMinutes * 60_000);
  let candidateMs =
    Date.UTC(
      localNow.getUTCFullYear(),
      localNow.getUTCMonth(),
      localNow.getUTCDate(),
      hour,
      minute,
    ) -
    offsetMinutes * 60_000;
  if (candidateMs <= observedAt.getTime()) candidateMs += 24 * 60 * 60_000;
  return new Date(candidateMs);
}

function parseRetryAfter(output: string, observedAt: Date): Date | undefined {
  const seconds = output.match(/retry-after\s*[:=]\s*(\d+(?:\.\d+)?)\s*(?:seconds?|secs?|s)?\b/i);
  if (seconds) {
    return new Date(observedAt.getTime() + Number.parseFloat(seconds[1]) * 1000);
  }

  const duration = output.match(
    /(?:retry|try)\s+again\s+(?:after|in)\s+(\d+(?:\.\d+)?)\s*(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h)\b/i,
  );
  if (duration) {
    const value = Number.parseFloat(duration[1]);
    const unit = duration[2].toLowerCase();
    const multiplier = unit.startsWith("h") ? 3_600_000 : unit.startsWith("m") ? 60_000 : 1000;
    return new Date(observedAt.getTime() + value * multiplier);
  }

  const httpDate = output.match(/retry-after\s*[:=]\s*([^\r\n]+)/i)?.[1]?.trim();
  if (httpDate) {
    const parsed = new Date(httpDate);
    if (!Number.isNaN(parsed.getTime()) && parsed > observedAt) return parsed;
  }
  return undefined;
}

function parseProviderReset(output: string, observedAt: Date): Date | undefined {
  const explicit = output.match(
    /(?:resets?|reset(?:s)?\s+at)\s+((?:20\d{2}-\d{2}-\d{2})[t\s]\d{1,2}:\d{2}(?::\d{2})?(?:\.\d+)?(?:z|[+-]\d{2}:?\d{2}|\s+(?:utc|gmt|jst)))\b/i,
  );
  if (explicit) {
    const text = explicit[1].replace(/\s+(UTC|GMT)$/i, "Z").replace(/\s+JST$/i, "+09:00");
    const parsed = new Date(text);
    if (!Number.isNaN(parsed.getTime()) && parsed > observedAt) return parsed;
  }

  const timeOnly = output.match(
    /resets?(?:\s+at)?\s+(\d{1,2}):(\d{2})\s*(am|pm)?(?:\s*\(([^)]+)\)|\s+(UTC|GMT|JST|(?:UTC|GMT)?[+-]\d{1,2}(?::?\d{2})?))?/i,
  );
  if (!timeOnly) return undefined;
  const offset = timezoneOffsetMinutes(timeOnly[4] ?? timeOnly[5]);
  if (offset === undefined) return undefined;
  let hour = Number.parseInt(timeOnly[1], 10);
  const minute = Number.parseInt(timeOnly[2], 10);
  const meridiem = timeOnly[3]?.toLowerCase();
  if (minute > 59 || hour > (meridiem ? 12 : 23) || hour < (meridiem ? 1 : 0)) return undefined;
  if (meridiem) {
    if (hour === 12) hour = 0;
    if (meridiem === "pm") hour += 12;
  }
  return nextTimeOfDayUtc(observedAt, hour, minute, offset);
}

export function normalizeAgentLimit(input: {
  output: string;
  provider?: AgentProvider;
  observedAt?: Date;
  cooldownSeconds?: Partial<Record<AgentLimitKind, number>>;
}): AgentLimitSignal {
  const observedAt = input.observedAt ?? new Date();
  const kind = limitKind(input.output);
  const retryableKind = kind !== "quota_exhausted";
  const retryAfter = retryableKind ? parseRetryAfter(input.output, observedAt) : undefined;
  const providerReset = retryableKind ? parseProviderReset(input.output, observedAt) : undefined;
  const configuredCooldown = input.cooldownSeconds?.[kind];
  const cooldown =
    retryableKind &&
    configuredCooldown !== undefined &&
    Number.isFinite(configuredCooldown) &&
    configuredCooldown > 0
      ? new Date(observedAt.getTime() + configuredCooldown * 1000)
      : undefined;
  const resumeAt = retryAfter ?? providerReset ?? cooldown;
  const resumeSource = retryAfter
    ? "retry_after"
    : providerReset
      ? "provider_reset"
      : cooldown
        ? "cooldown_policy"
        : undefined;

  return {
    availability_state:
      kind === "overloaded" || kind === "timeout" || kind === "oom"
        ? "transient_failure"
        : "limited",
    retryable: retryableKind,
    auto_resume: retryableKind && resumeAt !== undefined,
    ...(input.provider ? { provider: input.provider } : {}),
    kind,
    raw_message: diagnosticLine(input.output, kind),
    observed_at: observedAt.toISOString(),
    ...(resumeAt ? { resume_at: resumeAt.toISOString() } : {}),
    ...(resumeSource ? { resume_source: resumeSource } : {}),
  };
}

function metaString(meta: Record<string, unknown> | undefined, key: string): string | undefined {
  const value = meta?.[key];
  return typeof value === "string" ? value : undefined;
}

function deferredTask(
  taskId: string,
  state: CurrentState,
  now: Date,
): DeferredLimitTask | undefined {
  const autoResume = metaString(state.meta, "limit_auto_resume");
  const retryable = metaString(state.meta, "limit_retryable");
  const resumeAtText = metaString(state.meta, "limit_resume_at");
  const kind = metaString(state.meta, "limit_kind") as AgentLimitKind | undefined;
  if (
    state.state !== "blocked" ||
    autoResume !== "true" ||
    retryable !== "true" ||
    !resumeAtText ||
    !kind
  ) {
    return undefined;
  }
  const resumeAt = new Date(resumeAtText);
  if (Number.isNaN(resumeAt.getTime()) || resumeAt > now) return undefined;
  const attemptsText = metaString(state.meta, "limit_attempts");
  const attempts =
    attemptsText && /^\d+$/.test(attemptsText) ? Number.parseInt(attemptsText, 10) : 0;
  return {
    taskId,
    actor: state.last_by ?? "",
    kind,
    resumeAt: resumeAt.toISOString(),
    attempts,
    ...((metaString(state.meta, "limit_provider") as AgentProvider | undefined)
      ? { provider: metaString(state.meta, "limit_provider") as AgentProvider }
      : {}),
    ...(metaString(state.meta, "limit_worktree")
      ? { worktree: metaString(state.meta, "limit_worktree") }
      : {}),
  };
}

export function selectDueDeferredLimitTasks(
  snapshot: StateSnapshot,
  now = new Date(),
): DeferredLimitTask[] {
  return Object.entries(snapshot.tasks)
    .map(([taskId, state]) => deferredTask(taskId, state, now))
    .filter((task): task is DeferredLimitTask => task !== undefined)
    .sort((a, b) => a.resumeAt.localeCompare(b.resumeAt) || a.taskId.localeCompare(b.taskId));
}

export function limitEventMeta(
  signal: AgentLimitSignal,
  input: { attempts: number; worktree: string },
): Record<string, string> {
  return {
    limit_deferred: signal.auto_resume ? "true" : "false",
    limit_availability_state: signal.availability_state,
    limit_retryable: String(signal.retryable),
    limit_auto_resume: String(signal.auto_resume),
    limit_kind: signal.kind,
    limit_provider: signal.provider ?? "unknown",
    limit_observed_at: signal.observed_at,
    limit_raw_message: signal.raw_message,
    limit_attempts: String(input.attempts),
    limit_worktree: input.worktree,
    ...(signal.resume_at ? { limit_resume_at: signal.resume_at } : {}),
    ...(signal.resume_source ? { limit_resume_source: signal.resume_source } : {}),
  };
}
