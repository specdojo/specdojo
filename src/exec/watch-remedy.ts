// 見張り（`orchestrator watch-scan`）が分けた止まりのうち、使用量の上限・負荷による時間切れ・
// 統合先の同期に、exec-defaults の `watch.remedies` で選んだ決まった手当てを打つ（PJR-3M4M）。
// 手当ては既存の再開のコマンド（`exec resume`・`exec run --register --resume`）を固定の引数で
// 起動するだけで、判断が要るもの・中断・分けられなかったものには手を打たない。
import { closeSync, mkdirSync, openSync } from "node:fs";
import { spawn } from "node:child_process";
import { dirname } from "node:path";
import { gitEnvironment } from "../shared/git-environment.js";
import { selfRunArgs } from "../shared/spawn-self.js";
import type { StallCategory, StallTargetKind } from "./watch-scan-classify.js";

// ================================
// Config
// ================================

export type UsageLimitRemedyAction = "none" | "wait" | "fallback";
export type LoadTimeoutRemedyAction = "none" | "rerun";
export type TargetSyncRemedyAction = "none" | "sync";

/** exec-defaults の `watch`。省略した手当ては `none`（手を打たない）。 */
export type WatchRemedyConfig = {
  remedies?: {
    usage_limit?: {
      action?: UsageLimitRemedyAction;
      fallback_executor_by?: string;
      fallback_reporter_by?: string;
      switch_after?: string;
      unknown_resume_wait?: string;
    };
    load_timeout?: { action?: LoadTimeoutRemedyAction };
    needs_target_sync?: { action?: TargetSyncRemedyAction };
  };
  max_attempts?: number;
  attempt_window?: string;
};

export type ResolvedWatchRemedies = {
  usageLimit: {
    action: UsageLimitRemedyAction;
    fallbackExecutorBy?: string;
    fallbackReporterBy?: string;
    switchAfterMs: number;
    unknownResumeWaitMs: number;
  };
  loadTimeout: LoadTimeoutRemedyAction;
  targetSync: TargetSyncRemedyAction;
  maxAttempts: number;
  attemptWindowMs: number;
};

const DURATION_UNITS: Record<string, number> = { m: 60_000, h: 3_600_000, d: 86_400_000 };
const NICKNAME_RE = /^[a-z0-9][a-z0-9_-]{0,62}$/u;
const DEFAULT_MAX_ATTEMPTS = 3;

/** `30m`・`12h`・`2d` の形の期間をミリ秒にする。 */
export function parseWatchDuration(value: string, label: string): number {
  const match = /^([1-9]\d*)([mhd])$/u.exec(value.trim());
  if (!match) throw new Error(`${label} must be <positive integer><m|h|d> (e.g. 12h): ${value}`);
  return Number(match[1]) * DURATION_UNITS[match[2]!]!;
}

function oneOf<T extends string>(
  value: unknown,
  allowed: readonly T[],
  label: string,
): T | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "string" && (allowed as readonly string[]).includes(value))
    return value as T;
  throw new Error(`${label} must be one of ${allowed.join(", ")}: ${String(value)}`);
}

function nickname(value: unknown, label: string): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "string" && NICKNAME_RE.test(value)) return value;
  throw new Error(`${label} must be an agent-members.yaml nickname: ${String(value)}`);
}

/** `watch` の設定を検証して既定値で埋める。不正な値は設定の場所が分かるエラーにする。 */
export function resolveWatchRemedies(config: WatchRemedyConfig | undefined): ResolvedWatchRemedies {
  const prefix = "exec-defaults watch";
  const usage = config?.remedies?.usage_limit;
  const usageAction =
    oneOf(
      usage?.action,
      ["none", "wait", "fallback"] as const,
      `${prefix}.remedies.usage_limit.action`,
    ) ?? "none";
  const fallbackExecutorBy = nickname(
    usage?.fallback_executor_by,
    `${prefix}.remedies.usage_limit.fallback_executor_by`,
  );
  const fallbackReporterBy = nickname(
    usage?.fallback_reporter_by,
    `${prefix}.remedies.usage_limit.fallback_reporter_by`,
  );
  if (usageAction === "fallback" && !fallbackExecutorBy && !fallbackReporterBy) {
    throw new Error(
      `${prefix}.remedies.usage_limit.action: fallback requires fallback_executor_by or fallback_reporter_by`,
    );
  }
  const maxAttempts = config?.max_attempts ?? DEFAULT_MAX_ATTEMPTS;
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
    throw new Error(`${prefix}.max_attempts must be a positive integer: ${String(maxAttempts)}`);
  }
  return {
    usageLimit: {
      action: usageAction,
      ...(fallbackExecutorBy ? { fallbackExecutorBy } : {}),
      ...(fallbackReporterBy ? { fallbackReporterBy } : {}),
      switchAfterMs: parseWatchDuration(
        usage?.switch_after ?? "12h",
        `${prefix}.remedies.usage_limit.switch_after`,
      ),
      unknownResumeWaitMs: parseWatchDuration(
        usage?.unknown_resume_wait ?? "1h",
        `${prefix}.remedies.usage_limit.unknown_resume_wait`,
      ),
    },
    loadTimeout:
      oneOf(
        config?.remedies?.load_timeout?.action,
        ["none", "rerun"] as const,
        `${prefix}.remedies.load_timeout.action`,
      ) ?? "none",
    targetSync:
      oneOf(
        config?.remedies?.needs_target_sync?.action,
        ["none", "sync"] as const,
        `${prefix}.remedies.needs_target_sync.action`,
      ) ?? "none",
    maxAttempts,
    attemptWindowMs: parseWatchDuration(
      config?.attempt_window ?? "24h",
      `${prefix}.attempt_window`,
    ),
  };
}

export function hasAnyRemedy(config: ResolvedWatchRemedies): boolean {
  return (
    config.usageLimit.action !== "none" ||
    config.loadTimeout !== "none" ||
    config.targetSync !== "none"
  );
}

// ================================
// Decision
// ================================

export type RemedyAction =
  "resume_due" | "resume" | "switch_agent" | "rerun_checks" | "sync_target";

export type RemedyPlan = { action: RemedyAction; argv: string[]; summary: string };

export type RemedyDecision =
  | { kind: "launch"; plan: RemedyPlan }
  | { kind: "wait"; until: string }
  | { kind: "none"; reason: string }
  | { kind: "stop"; attempts: number };

/** 手当ての判定に使う止まり。見張りの記録の 1 行と、その観測の meta・文言。 */
export type RemedyStall = {
  key: string;
  target: { kind: StallTargetKind; id: string };
  state: string;
  since: string;
  category: StallCategory;
  meta?: Record<string, string>;
  message?: string;
};

const PIPELINE_STAGES = new Set(["executor", "reporter", "integrate"]);
const REMEDIABLE: ReadonlySet<StallCategory> = new Set([
  "usage_limit",
  "load_timeout",
  "needs_target_sync",
]);

function isConfigured(category: StallCategory, config: ResolvedWatchRemedies): boolean {
  if (category === "usage_limit") return config.usageLimit.action !== "none";
  if (category === "load_timeout") return config.loadTimeout !== "none";
  if (category === "needs_target_sync") return config.targetSync !== "none";
  return false;
}

/** 止まった pipeline の段と state の参照があり、`exec resume --task` で続けられる schedule のタスク。 */
function hasResumablePipelineStage(stall: RemedyStall): boolean {
  const stage = stall.meta?.pipeline_stage;
  return Boolean(stage && PIPELINE_STAGES.has(stage) && stall.meta?.pipeline_state_ref);
}

function agentArgs(config: ResolvedWatchRemedies): string[] {
  return [
    ...(config.usageLimit.fallbackExecutorBy
      ? ["--executor-by", config.usageLimit.fallbackExecutorBy]
      : []),
    ...(config.usageLimit.fallbackReporterBy
      ? ["--reporter-by", config.usageLimit.fallbackReporterBy]
      : []),
  ];
}

function hasFallbackAgent(config: ResolvedWatchRemedies): boolean {
  return Boolean(config.usageLimit.fallbackExecutorBy || config.usageLimit.fallbackReporterBy);
}

function validTime(text: string | undefined): number | undefined {
  if (!text) return undefined;
  const time = Date.parse(text);
  return Number.isFinite(time) ? time : undefined;
}

/**
 * 上限の解除の時刻。schedule のタスクは block の meta の `limit_resume_at`、register 項目は
 * 理由の文言の `resume_at=` を使う。読めなければ、止まった時刻から `unknown_resume_wait` 後とする。
 */
export function usageLimitResumeAt(stall: RemedyStall, config: ResolvedWatchRemedies): number {
  const fromMeta = validTime(stall.meta?.limit_resume_at);
  if (fromMeta !== undefined) return fromMeta;
  const fromMessage = validTime(/\bresume_at=(\S+?)(?:[;,\s]|$)/u.exec(stall.message ?? "")?.[1]);
  if (fromMessage !== undefined) return fromMessage;
  return (validTime(stall.since) ?? 0) + config.usageLimit.unknownResumeWaitMs;
}

function scheduleBase(projectId: string, stall: RemedyStall): string[] {
  return ["exec", "resume", "--project", projectId, "--task", stall.target.id, "--if-busy", "skip"];
}

function registerBase(projectId: string, stall: RemedyStall): string[] {
  return [
    "exec",
    "run",
    "--project",
    projectId,
    "--register",
    stall.target.id,
    "--worktree",
    "--resume",
    "--if-busy",
    "skip",
  ];
}

function decideUsageLimit(
  stall: RemedyStall,
  config: ResolvedWatchRemedies,
  projectId: string,
  now: Date,
): RemedyDecision {
  const isSchedule = stall.target.kind === "schedule-task";
  const canSwitch = !isSchedule || hasResumablePipelineStage(stall);
  const base = isSchedule ? scheduleBase(projectId, stall) : registerBase(projectId, stall);
  const switchPlan: RemedyDecision = {
    kind: "launch",
    plan: {
      action: "switch_agent",
      argv: [...base, ...agentArgs(config)],
      summary: "代わりの agent で流し直す",
    },
  };
  if (config.usageLimit.action === "fallback") {
    return canSwitch
      ? switchPlan
      : {
          kind: "none",
          reason: "pipeline の段を持たない schedule のタスクは agent を替えられない",
        };
  }
  const resumeAt = usageLimitResumeAt(stall, config);
  const remaining = resumeAt - now.getTime();
  if (remaining > config.usageLimit.switchAfterMs && hasFallbackAgent(config) && canSwitch) {
    return switchPlan;
  }
  if (remaining > 0) return { kind: "wait", until: new Date(resumeAt).toISOString() };
  if (isSchedule && stall.meta?.limit_auto_resume === "true") {
    return {
      kind: "launch",
      plan: {
        action: "resume_due",
        argv: [...base, "--due"],
        summary: "解除の時刻を過ぎたので同じ agent で再開する",
      },
    };
  }
  if (!canSwitch) {
    return { kind: "none", reason: "pipeline の段を持たない schedule のタスクは再開できない" };
  }
  return {
    kind: "launch",
    plan: { action: "resume", argv: base, summary: "解除の時刻を過ぎたので同じ agent で再開する" },
  };
}

/**
 * 止まり 1 件に打つ手当てを決める。設定で選んでいない種類と判断が要る種類には手を打たず、
 * 同じ対象に `attempt_window` の間に打った回数が `max_attempts` に達していれば止める。
 */
export function decideRemedy(input: {
  stall: RemedyStall;
  config: ResolvedWatchRemedies;
  projectId: string;
  now: Date;
  attempts: number;
}): RemedyDecision {
  const { stall, config, projectId, now } = input;
  if (!REMEDIABLE.has(stall.category)) return { kind: "none", reason: "手当ての対象外の種類" };
  if (!isConfigured(stall.category, config))
    return { kind: "none", reason: "手当てを選んでいない" };
  const isSchedule = stall.target.kind === "schedule-task";
  const isRegister = stall.target.kind === "register-item" && stall.state === "waiting";
  if (!isSchedule && !isRegister) return { kind: "none", reason: "手当ての対象外の止まり" };
  if (input.attempts >= config.maxAttempts) return { kind: "stop", attempts: input.attempts };
  if (stall.category === "usage_limit") return decideUsageLimit(stall, config, projectId, now);
  if (isSchedule && !hasResumablePipelineStage(stall)) {
    return { kind: "none", reason: "pipeline の段を持たない schedule のタスクは再開できない" };
  }
  const base = isSchedule ? scheduleBase(projectId, stall) : registerBase(projectId, stall);
  if (stall.category === "load_timeout") {
    return {
      kind: "launch",
      plan: {
        action: "rerun_checks",
        argv: base,
        summary: "止まった段から再開し、失敗した親の検証を流し直す",
      },
    };
  }
  // 統合の段の再試行と register の再開は、統合先を取り込んでから続ける。schedule のタスクの
  // executor・reporter の段は、統合先を取り込む `--resume-from executor` で続ける。
  const argv =
    isSchedule && stall.meta?.pipeline_stage !== "integrate"
      ? [...base, "--resume-from", "executor"]
      : base;
  return {
    kind: "launch",
    plan: { action: "sync_target", argv, summary: "worktree を統合先に同期してから再開する" },
  };
}

// ================================
// Log lines
// ================================

export type WatchRemedyLine = {
  v: 1;
  ts: string;
  event: "remedy";
  key: string;
  target: { kind: StallTargetKind; id: string };
  category: StallCategory;
  action: RemedyAction;
  summary: string;
  argv: string[];
  attempt: number;
  max_attempts: number;
  log: string;
  by: string;
};

export type WatchRemedyStoppedLine = {
  v: 1;
  ts: string;
  event: "remedy_stopped";
  key: string;
  target: { kind: StallTargetKind; id: string };
  category: StallCategory;
  attempts: number;
  reason: string;
  by: string;
};

/** 同じ対象に、`now` から `attempt_window` の間に打った手当ての回数。 */
export function countRecentRemedies(
  lines: readonly { event: string; ts: string; target: { kind: string; id: string } }[],
  target: { kind: StallTargetKind; id: string },
  now: Date,
  windowMs: number,
): number {
  const from = now.getTime() - windowMs;
  return lines.filter((line) => {
    if (line.event !== "remedy") return false;
    if (line.target.kind !== target.kind || line.target.id !== target.id) return false;
    const time = Date.parse(line.ts);
    return Number.isFinite(time) && time >= from;
  }).length;
}

// ================================
// Launch
// ================================

/** 手当てのコマンドを起動する。`logPath` に出力を書く。 */
export type RemedyLauncher = (argv: readonly string[], logPath: string, cwd: string) => void;

/**
 * 手当ての `specdojo` を切り離して起動する。routine は見張りの出力をパイプで待つため、子の
 * 出力はパイプを継がずにログのファイルへ書き、見張りは子の終わりを待たずに終える。
 */
export const launchDetachedRemedy: RemedyLauncher = (argv, logPath, cwd) => {
  mkdirSync(dirname(logPath), { recursive: true });
  const fd = openSync(logPath, "a");
  try {
    const [executable, args] = selfRunArgs([...argv]);
    const child = spawn(executable, args, {
      cwd,
      detached: true,
      stdio: ["ignore", fd, fd],
      env: gitEnvironment(),
    });
    child.unref();
  } finally {
    closeSync(fd);
  }
};
