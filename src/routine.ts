import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { type Command } from "commander";
import { selfRunArgs } from "./spawn-self.js";
import { getProjectRoutinesPath, loadConfig, loadEnv, specdojoRootDir } from "./specdojo-config.js";
import {
  ensureDir,
  listFilesRecursive,
  nowUtcIsoSeconds,
  padEndDisplay,
  readJson,
  readYaml,
  writeJson,
} from "./exec-shared.js";
import {
  parsePjrIndex,
  resolveRegisterPaths,
  VALID_PRIORITIES,
  VALID_STATUSES,
  VALID_TYPES,
  type PjrItem,
} from "./register.js";
import { registerItemCategory } from "./exec-register.js";
import { ROUTINE_BUSY_SKIP_EXIT_CODE, ROUTINE_EXEC_ENV } from "./exec-run-lock.js";

// ================================
// Types
// ================================

export type RoutineActionKind = "register" | "exec-auto" | "exec-resume" | "job";

export type RoutineRegisterFilter = {
  types?: string[];
  priorities?: string[];
  statuses?: string[];
};

export type RoutineAction = {
  kind: RoutineActionKind;
  // kind: register — 登録簿から実行対象を選ぶフィルタと件数上限
  filter?: RoutineRegisterFilter;
  limit?: number;
  // kind: exec-auto / exec-resume — exec run / resume へ引き渡すオプション
  strategy?: "critical-first" | "fifo";
  parallel?: number;
  loop?: boolean;
  max_rounds?: number;
  // kind: job — materialize する Job Definition と入力
  job?: string;
  inputs?: Record<string, string>;
};

export type RoutineDoc = {
  id: string;
  name?: string;
  description?: string;
  enabled?: boolean;
  interval?: string;
  trigger?: {
    cron: string;
    timezone: string;
  };
  policy?: {
    missed_run?: "latest" | "all";
    overlap?: "skip";
  };
  action: RoutineAction;
};

export type LoadedRoutine = {
  filePath: string;
  doc: RoutineDoc;
};

export type RoutinePaths = {
  projectId: string;
  routinesPath: string;
  generatedPath: string;
  statePath: string;
};

export type RoutineExecutionResult = "success" | "failure" | "skipped";

export type RoutineStateEntry = {
  last_run: string;
  last_result?: RoutineExecutionResult;
  last_scheduled_for?: string;
};

type RoutineStateFile = {
  routines: Record<string, RoutineStateEntry>;
};

// ================================
// Interval / due
// ================================

const INTERVAL_UNIT_MS: Record<string, number> = {
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
  w: 604_800_000,
};

// interval は `<正の整数><単位>` 形式（m: 分, h: 時間, d: 日, w: 週）。
export function parseIntervalMs(text: string): number {
  const match = text.trim().match(/^([1-9]\d*)(m|h|d|w)$/);
  if (!match) {
    throw new Error(
      `Invalid interval: "${text}". Use <positive integer><unit> with unit m|h|d|w (e.g. 30m, 6h, 1d, 1w)`,
    );
  }
  return Number.parseInt(match[1], 10) * INTERVAL_UNIT_MS[match[2]];
}

// last_run が無い（未実行）または不正な場合は due とみなす。
export function isRoutineDue(doc: RoutineDoc, lastRun: string | undefined, now: Date): boolean {
  if (!doc.interval) return cronOccurrences(doc, lastRun, now).length > 0;
  if (!lastRun) return true;
  const last = new Date(lastRun);
  if (Number.isNaN(last.getTime())) return true;
  return now.getTime() - last.getTime() >= parseIntervalMs(doc.interval);
}

type CronField = Set<number>;

function parseCronField(text: string, min: number, max: number, label: string): CronField {
  const result = new Set<number>();
  for (const token of text.split(",")) {
    const [base, stepText] = token.split("/");
    const step = stepText === undefined ? 1 : Number(stepText);
    if (!Number.isSafeInteger(step) || step < 1) throw new Error(`Invalid cron ${label}: ${text}`);
    let start: number;
    let end: number;
    if (base === "*") {
      start = min;
      end = max;
    } else if (base.includes("-")) {
      const parts = base.split("-").map(Number);
      if (parts.length !== 2) throw new Error(`Invalid cron ${label}: ${text}`);
      [start, end] = parts;
    } else {
      start = Number(base);
      end = start;
    }
    if (
      !Number.isSafeInteger(start) ||
      !Number.isSafeInteger(end) ||
      start < min ||
      end > max ||
      start > end
    ) {
      throw new Error(`Invalid cron ${label}: ${text}`);
    }
    for (let value = start; value <= end; value += step) result.add(value);
  }
  return result;
}

export function parseCronExpression(expression: string): CronField[] {
  const fields = expression.trim().split(/\s+/);
  if (fields.length !== 5)
    throw new Error(`Invalid cron expression: "${expression}" (expected 5 fields)`);
  return [
    parseCronField(fields[0], 0, 59, "minute"),
    parseCronField(fields[1], 0, 23, "hour"),
    parseCronField(fields[2], 1, 31, "day-of-month"),
    parseCronField(fields[3], 1, 12, "month"),
    parseCronField(fields[4], 0, 6, "day-of-week"),
  ];
}

function zonedParts(date: Date, timezone: string): [number, number, number, number, number] {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    minute: "numeric",
    hour: "numeric",
    day: "numeric",
    month: "numeric",
    weekday: "short",
    hourCycle: "h23",
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(value("weekday"));
  return [
    Number(value("minute")),
    Number(value("hour")),
    Number(value("day")),
    Number(value("month")),
    weekday,
  ];
}

export function cronMatches(expression: string, timezone: string, date: Date): boolean {
  const fields = parseCronExpression(expression);
  const parts = zonedParts(date, timezone);
  return fields.every((field, index) => field.has(parts[index]));
}

const MAX_CRON_LOOKBACK_MINUTES = 366 * 24 * 60;

export function cronOccurrences(
  doc: RoutineDoc,
  lastScheduledFor: string | undefined,
  now: Date,
): Date[] {
  if (!doc.trigger) return [];
  const nowMinute = new Date(Math.floor(now.getTime() / 60_000) * 60_000);
  const parsedLast = lastScheduledFor ? new Date(lastScheduledFor) : null;
  if (parsedLast && Number.isNaN(parsedLast.getTime())) return cronOccurrences(doc, undefined, now);

  if (!parsedLast) {
    for (let offset = 0; offset <= MAX_CRON_LOOKBACK_MINUTES; offset++) {
      const candidate = new Date(nowMinute.getTime() - offset * 60_000);
      if (cronMatches(doc.trigger.cron, doc.trigger.timezone, candidate)) return [candidate];
    }
    return [];
  }

  const occurrences: Date[] = [];
  let cursor = Math.floor(parsedLast.getTime() / 60_000) * 60_000 + 60_000;
  const maxStart = nowMinute.getTime() - MAX_CRON_LOOKBACK_MINUTES * 60_000;
  if (cursor < maxStart) cursor = maxStart;
  for (; cursor <= nowMinute.getTime(); cursor += 60_000) {
    const candidate = new Date(cursor);
    if (cronMatches(doc.trigger.cron, doc.trigger.timezone, candidate)) occurrences.push(candidate);
    if (occurrences.length > 1000)
      throw new Error(`Too many missed cron occurrences for ${doc.id}`);
  }
  return doc.policy?.missed_run === "all" ? occurrences : occurrences.slice(-1);
}

export function isoWeek(date: Date, timezone: string): string {
  const local = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
  const [year, month, day] = local.split("-").map(Number);
  const value = new Date(Date.UTC(year, month - 1, day));
  const weekday = value.getUTCDay() || 7;
  value.setUTCDate(value.getUTCDate() + 4 - weekday);
  const weekYear = value.getUTCFullYear();
  const first = new Date(Date.UTC(weekYear, 0, 1));
  const week = Math.ceil(((value.getTime() - first.getTime()) / 86_400_000 + 1) / 7);
  return `${weekYear}-W${String(week).padStart(2, "0")}`;
}

// ================================
// Validation
// ================================

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateStringListField(
  errors: string[],
  value: unknown,
  fieldName: string,
  allowed: readonly string[],
): void {
  if (value === undefined) return;
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== "string")) {
    errors.push(`${fieldName} must be a list of strings`);
    return;
  }
  for (const entry of value) {
    if (!allowed.includes(entry)) {
      errors.push(`${fieldName} contains unknown value "${entry}". Allowed: ${allowed.join(", ")}`);
    }
  }
}

function validatePositiveIntegerField(errors: string[], value: unknown, fieldName: string): void {
  if (value === undefined) return;
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 1) {
    errors.push(`${fieldName} must be a positive integer`);
  }
}

// rtn-*.yaml 1 ファイルぶんを検証し、妥当なら RoutineDoc として返す。
// id はファイル名（拡張子なし）と一致させ、doc-index と同じ「ファイル名 = id」規約に揃える。
export function parseRoutineDoc(
  value: unknown,
  fileName: string,
): { doc?: RoutineDoc; errors: string[] } {
  const errors: string[] = [];
  if (!isRecord(value)) {
    return { errors: [`${fileName}: routine file must be a YAML mapping`] };
  }

  const expectedId = fileName.replace(/\.(yaml|yml)$/, "");
  const id = typeof value.id === "string" ? value.id.trim() : "";
  if (!id) {
    errors.push("id is required");
  } else {
    if (!/^rtn-[a-z0-9][a-z0-9-]*$/.test(id)) {
      errors.push(`id "${id}" must match rtn-<slug> (lowercase letters, digits, hyphens)`);
    }
    if (id !== expectedId) {
      errors.push(`id "${id}" must match the file name base "${expectedId}"`);
    }
  }

  if (value.enabled !== undefined && typeof value.enabled !== "boolean") {
    errors.push("enabled must be a boolean");
  }

  const interval = typeof value.interval === "string" ? value.interval.trim() : "";
  const trigger = isRecord(value.trigger) ? value.trigger : undefined;
  if (!interval && !trigger) {
    errors.push("interval or trigger is required");
  }
  if (interval && trigger) errors.push("specify either interval or trigger, not both");
  if (interval) {
    try {
      parseIntervalMs(interval);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }
  let parsedTrigger: RoutineDoc["trigger"];
  if (trigger) {
    const cron = typeof trigger.cron === "string" ? trigger.cron.trim() : "";
    const timezone = typeof trigger.timezone === "string" ? trigger.timezone.trim() : "";
    if (!cron) errors.push("trigger.cron is required");
    else {
      try {
        parseCronExpression(cron);
      } catch (error) {
        errors.push(error instanceof Error ? error.message : String(error));
      }
    }
    if (!timezone) errors.push("trigger.timezone is required");
    else {
      try {
        new Intl.DateTimeFormat("en-US", { timeZone: timezone }).format();
      } catch {
        errors.push(`Invalid trigger.timezone: ${timezone}`);
      }
    }
    if (cron && timezone) parsedTrigger = { cron, timezone };
  }

  let policy: RoutineDoc["policy"];
  if (value.policy !== undefined) {
    if (!isRecord(value.policy)) errors.push("policy must be a mapping");
    else {
      const missed = value.policy.missed_run;
      const overlap = value.policy.overlap;
      if (missed !== undefined && missed !== "latest" && missed !== "all") {
        errors.push("policy.missed_run must be latest or all");
      }
      if (overlap !== undefined && overlap !== "skip") errors.push("policy.overlap must be skip");
      policy = {
        ...(missed === "latest" || missed === "all" ? { missed_run: missed } : {}),
        ...(overlap === "skip" ? { overlap } : {}),
      };
    }
  }

  if (!isRecord(value.action)) {
    errors.push("action is required and must be a mapping with kind");
    return { errors: errors.map((message) => `${fileName}: ${message}`) };
  }

  const action = value.action;
  const kind = typeof action.kind === "string" ? action.kind : "";
  if (kind !== "register" && kind !== "exec-auto" && kind !== "exec-resume" && kind !== "job") {
    errors.push(
      `action.kind must be one of: register, exec-auto, exec-resume, job (got "${kind}")`,
    );
  }

  if (kind === "register") {
    if (action.filter !== undefined && !isRecord(action.filter)) {
      errors.push("action.filter must be a mapping");
    } else if (isRecord(action.filter)) {
      validateStringListField(errors, action.filter.types, "action.filter.types", VALID_TYPES);
      validateStringListField(
        errors,
        action.filter.priorities,
        "action.filter.priorities",
        VALID_PRIORITIES,
      );
      validateStringListField(
        errors,
        action.filter.statuses,
        "action.filter.statuses",
        VALID_STATUSES,
      );
    }
    validatePositiveIntegerField(errors, action.limit, "action.limit");
  }

  if (kind === "exec-auto") {
    if (
      action.strategy !== undefined &&
      action.strategy !== "critical-first" &&
      action.strategy !== "fifo"
    ) {
      errors.push('action.strategy must be "critical-first" or "fifo"');
    }
    validatePositiveIntegerField(errors, action.parallel, "action.parallel");
    validatePositiveIntegerField(errors, action.max_rounds, "action.max_rounds");
    if (action.loop !== undefined && typeof action.loop !== "boolean") {
      errors.push("action.loop must be a boolean");
    }
  }

  if (kind === "exec-resume") {
    validatePositiveIntegerField(errors, action.parallel, "action.parallel");
  }

  if (kind === "job") {
    if (typeof action.job !== "string" || !/^job-[a-z0-9][a-z0-9-]*$/.test(action.job)) {
      errors.push("action.job must match job-<slug>");
    }
    if (
      action.inputs !== undefined &&
      (!isRecord(action.inputs) ||
        Object.values(action.inputs).some((item) => typeof item !== "string"))
    ) {
      errors.push("action.inputs must be a mapping of string values");
    }
  }

  if (errors.length > 0) {
    return { errors: errors.map((message) => `${fileName}: ${message}`) };
  }

  const filter = isRecord(action.filter)
    ? {
        ...(Array.isArray(action.filter.types) ? { types: action.filter.types as string[] } : {}),
        ...(Array.isArray(action.filter.priorities)
          ? { priorities: action.filter.priorities as string[] }
          : {}),
        ...(Array.isArray(action.filter.statuses)
          ? { statuses: action.filter.statuses as string[] }
          : {}),
      }
    : undefined;

  const doc: RoutineDoc = {
    id,
    ...(typeof value.name === "string" ? { name: value.name } : {}),
    ...(typeof value.description === "string" ? { description: value.description } : {}),
    ...(typeof value.enabled === "boolean" ? { enabled: value.enabled } : {}),
    ...(interval ? { interval } : {}),
    ...(parsedTrigger ? { trigger: parsedTrigger } : {}),
    ...(policy ? { policy } : {}),
    action: {
      kind: kind as RoutineActionKind,
      ...(filter && Object.keys(filter).length > 0 ? { filter } : {}),
      ...(typeof action.limit === "number" ? { limit: action.limit } : {}),
      ...(action.strategy === "critical-first" || action.strategy === "fifo"
        ? { strategy: action.strategy }
        : {}),
      ...(typeof action.parallel === "number" ? { parallel: action.parallel } : {}),
      ...(typeof action.loop === "boolean" ? { loop: action.loop } : {}),
      ...(typeof action.max_rounds === "number" ? { max_rounds: action.max_rounds } : {}),
      ...(typeof action.job === "string" ? { job: action.job } : {}),
      ...(isRecord(action.inputs) ? { inputs: action.inputs as Record<string, string> } : {}),
    },
  };
  return { doc, errors: [] };
}

// ================================
// Path resolution / loading
// ================================

export function resolveRoutinePaths(opts: { project?: string }): RoutinePaths {
  loadEnv();
  const { config, configPath } = loadConfig();
  const baseDir = specdojoRootDir();

  if (!config) {
    throw new Error(`routine commands require specdojo.config.json.\nRun: specdojo config init`);
  }

  const projectId =
    opts.project?.trim() ||
    process.env.SPECDOJO_PROJECT?.trim() ||
    config.current_project?.trim() ||
    Object.keys(config.projects)[0] ||
    "";
  if (!projectId) {
    throw new Error(`No project specified. Use --project <id> or SPECDOJO_PROJECT.`);
  }

  const project = config.projects[projectId];
  if (!project) {
    throw new Error(`Unknown project: ${projectId} (check ${configPath})`);
  }

  const routinesPath = getProjectRoutinesPath(project);
  if (!routinesPath) {
    throw new Error(
      `routines_path not set for project '${projectId}' in ${configPath}.\n` +
        `Add "routines_path": "<path>" to the project config.`,
    );
  }

  const absRoutinesPath = resolve(baseDir, routinesPath);
  const generatedPath = join(absRoutinesPath, "generated");
  return {
    projectId,
    routinesPath: absRoutinesPath,
    generatedPath,
    statePath: join(generatedPath, "routine-state.json"),
  };
}

function isRoutineYamlFile(filePath: string): boolean {
  return /^rtn-.+\.(yaml|yml)$/.test(basename(filePath));
}

// routines ディレクトリ配下の rtn-*.yaml を読み込む。ファイル列挙順に依存しないよう
// ソートし、パース失敗・検証エラー・id 重複はファイル名つきで集約して返す。
export function loadRoutines(routinesPath: string): {
  routines: LoadedRoutine[];
  errors: string[];
} {
  const routines: LoadedRoutine[] = [];
  const errors: string[] = [];
  const seenIds = new Map<string, string>();

  const files = listFilesRecursive(routinesPath).filter(isRoutineYamlFile).sort();
  for (const filePath of files) {
    const fileName = basename(filePath);
    let raw: unknown;
    try {
      raw = readYaml(filePath);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${fileName}: YAML parse error: ${message}`);
      continue;
    }

    const parsed = parseRoutineDoc(raw, fileName);
    if (!parsed.doc) {
      errors.push(...parsed.errors);
      continue;
    }

    const duplicatePath = seenIds.get(parsed.doc.id);
    if (duplicatePath) {
      errors.push(
        `${fileName}: duplicate routine id "${parsed.doc.id}" (also in ${duplicatePath})`,
      );
      continue;
    }
    seenIds.set(parsed.doc.id, fileName);
    routines.push({ filePath, doc: parsed.doc });
  }

  return { routines, errors };
}

// ================================
// State
// ================================

function readRoutineState(statePath: string): RoutineStateFile {
  if (!existsSync(statePath)) return { routines: {} };
  try {
    const raw = readJson(statePath);
    if (isRecord(raw) && isRecord(raw.routines)) {
      return raw as RoutineStateFile;
    }
  } catch {
    // fall through: 壊れた state は空として扱い、次の書き込みで再生成する
  }
  return { routines: {} };
}

function writeRoutineState(paths: RoutinePaths, state: RoutineStateFile): void {
  ensureDir(paths.generatedPath);
  writeJson(paths.statePath, state);
}

// ================================
// Register item selection
// ================================

// 実行可能 type（registerItemCategory が非 null）の既定リスト。
const DEFAULT_FILTER_TYPES = VALID_TYPES.filter((t) => registerItemCategory(t) !== null);
const DEFAULT_FILTER_STATUSES = ["open"];

// routine の filter に従って登録簿から実行対象を選ぶ。statuses 既定は open のみ、
// types 既定は実行可能 type 全部。ID 昇順で安定させ、limit で件数を制限する。
export function selectRegisterItems(items: PjrItem[], action: RoutineAction): PjrItem[] {
  const types = action.filter?.types ?? DEFAULT_FILTER_TYPES;
  const statuses = action.filter?.statuses ?? DEFAULT_FILTER_STATUSES;
  const priorities = action.filter?.priorities;

  const matched = items
    .filter(
      (item) =>
        registerItemCategory(item.type) !== null &&
        types.includes(item.type) &&
        statuses.includes(item.status) &&
        (priorities === undefined || priorities.includes(item.priority)),
    )
    .sort((a, b) => a.id.localeCompare(b.id));

  return action.limit !== undefined ? matched.slice(0, action.limit) : matched;
}

// ================================
// Lock
// ================================

const ROUTINE_LOCK_STALE_MS = 60 * 60 * 1000;

// routine run の多重起動（外部スケジューラの重複発火）を防ぐ簡易 lock。
// 生存中の lock があれば即座に失敗し、stale（1 時間超）な lock は奪う。
function acquireRoutineLock(routinesPath: string): string {
  const lockDir = join(routinesPath, ".locks", "routine-run.lock");
  ensureDir(resolve(lockDir, ".."));
  try {
    mkdirSync(lockDir);
    return lockDir;
  } catch (error) {
    if ((error as NodeJS.ErrnoException | null)?.code !== "EEXIST") throw error;
    const ageMs = Date.now() - statSync(lockDir).mtimeMs;
    if (ageMs > ROUTINE_LOCK_STALE_MS) {
      rmSync(lockDir, { recursive: true, force: true });
      mkdirSync(lockDir);
      return lockDir;
    }
    throw new Error(
      `Another routine run is in progress (lock: ${lockDir}). ` +
        `Remove the lock directory if no other run is active.`,
    );
  }
}

function releaseRoutineLock(lockDir: string): void {
  rmSync(lockDir, { recursive: true, force: true });
}

// ================================
// Execution
// ================================

function spawnSelf(args: string[]): RoutineExecutionResult {
  const [exe, fullArgs] = selfRunArgs(args);
  const result = spawnSync(exe, fullArgs, {
    stdio: "inherit",
    cwd: specdojoRootDir(),
    env: { ...process.env, [ROUTINE_EXEC_ENV]: "1" },
  });
  if (result.status === ROUTINE_BUSY_SKIP_EXIT_CODE) return "skipped";
  return result.status === 0 ? "success" : "failure";
}

// exec-auto action を exec run --auto の引数リストへ変換する（dry-run 表示と実行で共用）。
export function buildExecAutoArgs(action: RoutineAction, projectId: string): string[] {
  const args = ["exec", "run", "--auto", "--project", projectId, "--if-busy", "skip"];
  if (action.strategy) args.push("--strategy", action.strategy);
  if (action.parallel !== undefined) args.push("--parallel", String(action.parallel));
  if (action.loop) {
    args.push("--loop");
    if (action.max_rounds !== undefined) args.push("--max-rounds", String(action.max_rounds));
  }
  return args;
}

export function buildExecResumeArgs(action: RoutineAction, projectId: string): string[] {
  const args = ["exec", "resume", "--due", "--project", projectId, "--if-busy", "skip"];
  if (action.parallel !== undefined) args.push("--parallel", String(action.parallel));
  return args;
}

export function buildRegisterRunArgs(pjrId: string, projectId: string): string[] {
  return ["exec", "run", "--register", pjrId, "--project", projectId, "--if-busy", "skip"];
}

function renderRoutineInput(value: string, scheduledAt: Date, timezone: string): string {
  return value.replace(/\{\{\s*scheduled_at(?:\s*\|\s*iso_week)?\s*\}\}/g, (match) =>
    match.includes("iso_week") ? isoWeek(scheduledAt, timezone) : scheduledAt.toISOString(),
  );
}

export function buildJobRunArgs(
  action: RoutineAction,
  projectId: string,
  scheduledAt: Date,
  timezone = "UTC",
): string[] {
  if (!action.job) throw new Error("job action requires action.job");
  const args = [
    "exec",
    "run",
    "--job",
    action.job,
    "--project",
    projectId,
    "--scheduled-at",
    scheduledAt.toISOString(),
    "--job-trigger",
    "routine",
    "--if-busy",
    "skip",
  ];
  for (const [key, value] of Object.entries(action.inputs ?? {}).sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    args.push("--input", `${key}=${renderRoutineInput(value, scheduledAt, timezone)}`);
  }
  return args;
}

// 1 routine を実行する。register kind は対象項目ごとに失敗を記録して継続し、
// 最後に集約する（1 件の失敗で残りの項目を止めない）。
function executeRoutine(
  routine: LoadedRoutine,
  projectId: string,
  dryRun: boolean,
  scheduledAt = new Date(),
): RoutineExecutionResult {
  const { doc } = routine;
  process.stdout.write(`[routine] ${doc.id}: ${doc.name ?? doc.action.kind}\n`);

  if (doc.action.kind === "exec-auto") {
    const args = buildExecAutoArgs(doc.action, projectId);
    if (dryRun) {
      process.stdout.write(`  [dry-run] specdojo ${args.join(" ")}\n`);
      return "success";
    }
    return spawnSelf(args);
  }

  if (doc.action.kind === "exec-resume") {
    const args = buildExecResumeArgs(doc.action, projectId);
    if (dryRun) {
      process.stdout.write(`  [dry-run] specdojo ${args.join(" ")}\n`);
      return "success";
    }
    return spawnSelf(args);
  }

  if (doc.action.kind === "job") {
    const args = buildJobRunArgs(
      doc.action,
      projectId,
      scheduledAt,
      doc.trigger?.timezone ?? "UTC",
    );
    if (dryRun) {
      process.stdout.write(`  [dry-run] specdojo ${args.join(" ")}\n`);
      return "success";
    }
    return spawnSelf(args);
  }

  // kind: register
  const registerPaths = resolveRegisterPaths({ project: projectId });
  if (!existsSync(registerPaths.pjrIndexPath)) {
    process.stderr.write(`  pjr-index.md not found: ${registerPaths.pjrIndexPath}\n`);
    return "failure";
  }
  const items = parsePjrIndex(readFileSync(registerPaths.pjrIndexPath, "utf8"));
  const selected = selectRegisterItems(items, doc.action);
  if (selected.length === 0) {
    process.stdout.write(`  no matching register items\n`);
    return "success";
  }

  let allOk = true;
  const failedIds: string[] = [];
  for (const item of selected) {
    const args = buildRegisterRunArgs(item.id, projectId);
    if (dryRun) {
      process.stdout.write(`  [dry-run] specdojo ${args.join(" ")}  (${item.title})\n`);
      continue;
    }
    process.stdout.write(`  run: ${item.id} — ${item.title}\n`);
    const result = spawnSelf(args);
    if (result === "skipped") return "skipped";
    if (result === "failure") {
      allOk = false;
      failedIds.push(item.id);
    }
  }
  if (failedIds.length > 0) {
    process.stderr.write(`  failed register item(s): ${failedIds.join(", ")}\n`);
  }
  return allOk ? "success" : "failure";
}

// ================================
// Command registration
// ================================

function printCommandError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  process.stdout.write(message + "\n");
  process.exitCode = 1;
}

function addProjectOption(cmd: Command): Command {
  return cmd.option("--project <projectId>", "Project id in specdojo.config.json");
}

export function formatRoutineLastRun(entry: RoutineStateEntry | undefined): string {
  if (!entry?.last_run) return "-";
  return entry.last_result ? `${entry.last_run} (${entry.last_result})` : entry.last_run;
}

export function registerRoutineCommands(program: Command): void {
  const routine = program
    .command("routine")
    .description("Periodic task execution from rtn-*.yaml definitions");

  // --- where ---
  const whereCmd = routine.command("where").description("Print resolved routine paths and files");
  addProjectOption(whereCmd);
  whereCmd.action((opts) => {
    try {
      const paths = resolveRoutinePaths(opts);
      process.stdout.write(`project:  ${paths.projectId}\n`);
      process.stdout.write(`routines: ${paths.routinesPath}\n`);
      process.stdout.write(`state:    ${paths.statePath}\n`);
      const files = listFilesRecursive(paths.routinesPath).filter(isRoutineYamlFile).sort();
      for (const filePath of files) {
        process.stdout.write(`  ${filePath}\n`);
      }
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- validate ---
  const validateCmd = routine.command("validate").description("Validate rtn-*.yaml definitions");
  addProjectOption(validateCmd);
  validateCmd.action((opts) => {
    try {
      const paths = resolveRoutinePaths(opts);
      const { routines, errors } = loadRoutines(paths.routinesPath);
      for (const message of errors) {
        process.stderr.write(`ERROR: ${message}\n`);
      }
      process.stdout.write(`Validated: ${routines.length} routine(s), ${errors.length} error(s)\n`);
      if (errors.length > 0) process.exitCode = 1;
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- list ---
  const listCmd = routine
    .command("list")
    .description("List routines with due status and last run time");
  addProjectOption(listCmd);
  listCmd.action((opts) => {
    try {
      const paths = resolveRoutinePaths(opts);
      const { routines, errors } = loadRoutines(paths.routinesPath);
      for (const message of errors) {
        process.stderr.write(`ERROR: ${message}\n`);
      }
      if (routines.length === 0) {
        process.stdout.write(`No routines found in ${paths.routinesPath}\n`);
        if (errors.length > 0) process.exitCode = 1;
        return;
      }

      const state = readRoutineState(paths.statePath);
      const now = new Date();
      const rows = routines.map(({ doc }) => ({
        id: doc.id,
        enabled: doc.enabled === false ? "disabled" : "enabled",
        interval: doc.interval ?? doc.trigger?.cron ?? "-",
        kind: doc.action.kind,
        lastRun: formatRoutineLastRun(state.routines[doc.id]),
        due:
          doc.enabled === false
            ? "-"
            : doc.trigger
              ? cronOccurrences(doc, state.routines[doc.id]?.last_scheduled_for, now).length > 0
                ? "due"
                : "-"
              : isRoutineDue(doc, state.routines[doc.id]?.last_run, now)
                ? "due"
                : "-",
      }));

      const idWidth = Math.max(2, ...rows.map((row) => row.id.length));
      for (const row of rows) {
        process.stdout.write(
          `${padEndDisplay(row.id, idWidth)}  ${padEndDisplay(row.enabled, 8)}  ` +
            `${padEndDisplay(row.interval, 8)}  ${padEndDisplay(row.kind, 9)}  ` +
            `${padEndDisplay(row.due, 4)}  ${row.lastRun}\n`,
        );
      }
      if (errors.length > 0) process.exitCode = 1;
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- run ---
  const runCmd = routine
    .command("run")
    .description("Run due routines (--due) or a specific routine (--id)");
  addProjectOption(runCmd);
  runCmd.option("--due", "Run every enabled routine whose interval has elapsed", false);
  runCmd.option("--id <routineId>", "Run this routine now, regardless of due state");
  runCmd.option("--dry-run", "Print planned commands without executing or recording", false);
  runCmd.action((opts) => {
    let lockDir: string | null = null;
    try {
      if (!opts.due && !opts.id) {
        throw new Error("Specify --due or --id <routine-id>.");
      }
      if (opts.due && opts.id) {
        throw new Error("Specify either --due or --id, not both.");
      }

      const paths = resolveRoutinePaths(opts);
      const { routines, errors } = loadRoutines(paths.routinesPath);
      for (const message of errors) {
        process.stderr.write(`ERROR: ${message}\n`);
      }
      if (errors.length > 0) process.exitCode = 1;

      const state = readRoutineState(paths.statePath);
      const now = new Date();

      let selected: Array<{ entry: LoadedRoutine; scheduledAt: Date }>;
      if (opts.id) {
        const routineId = (opts.id as string).trim();
        const found = routines.find((entry) => entry.doc.id === routineId);
        if (!found) {
          throw new Error(`Routine not found: ${routineId} (in ${paths.routinesPath})`);
        }
        selected = [{ entry: found, scheduledAt: now }];
      } else {
        selected = routines.flatMap((entry) => {
          if (entry.doc.enabled === false) return [];
          const stateEntry = state.routines[entry.doc.id];
          if (entry.doc.trigger) {
            return cronOccurrences(entry.doc, stateEntry?.last_scheduled_for, now).map(
              (scheduledAt) => ({ entry, scheduledAt }),
            );
          }
          return isRoutineDue(entry.doc, stateEntry?.last_run, now)
            ? [{ entry, scheduledAt: now }]
            : [];
        });
      }

      if (selected.length === 0) {
        process.stdout.write("[routine] no due routines — exit\n");
        return;
      }

      const dryRun = !!opts.dryRun;
      if (!dryRun) {
        lockDir = acquireRoutineLock(paths.routinesPath);
      }

      let failed = 0;
      let skipped = 0;
      for (const selectedRun of selected) {
        const { entry, scheduledAt } = selectedRun;
        // 実行の試行自体を last_run として先に記録する。失敗した routine が次の
        // 発火まで再試行されない代わりに、失敗が高頻度で連続発火することを防ぐ。
        if (!dryRun) {
          state.routines[entry.doc.id] = {
            ...state.routines[entry.doc.id],
            last_run: nowUtcIsoSeconds(),
            ...(entry.doc.trigger ? { last_scheduled_for: scheduledAt.toISOString() } : {}),
          };
          writeRoutineState(paths, state);
        }

        const result = executeRoutine(entry, paths.projectId, dryRun, scheduledAt);
        if (result === "failure") failed++;
        if (result === "skipped") {
          skipped++;
          process.stdout.write(`[routine] skipped ${entry.doc.id}: exec busy\n`);
        }

        if (!dryRun) {
          state.routines[entry.doc.id] = {
            ...state.routines[entry.doc.id],
            last_result: result,
          };
          writeRoutineState(paths, state);
        }
      }

      process.stdout.write(
        `[routine] ${selected.length} routine(s) processed, ${skipped} skipped, ${failed} failed\n`,
      );
      if (failed > 0) process.exitCode = 1;
    } catch (error) {
      printCommandError(error);
    } finally {
      if (lockDir) releaseRoutineLock(lockDir);
    }
  });
}
