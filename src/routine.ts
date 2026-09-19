import { spawnSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { type Command } from "commander";
import { ensureFreshDistBuildForEntry } from "./dist-freshness.js";
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
import { ROUTINE_BUSY_SKIP_EXIT_CODE, ROUTINE_EXEC_ENV } from "./exec-run-lock.js";
import { resolveJobPaths } from "./job.js";

// ================================
// Types
// ================================

export type RoutineActionKind = "job" | "specdojo";

export type RoutineJobAction = {
  kind: "job";
  job: string;
  inputs?: Record<string, string>;
};

// exec の実行ロックを取らずに specdojo サブコマンドを直接起動する action。dashboard build のように
// 読み取りと派生生成だけを行い、agent を呼ばず他の実行と衝突しない処理に限って使う。
export type RoutineSpecdojoAction = {
  kind: "specdojo";
  args: string[];
};

export type RoutineAction = RoutineJobAction | RoutineSpecdojoAction;

export type RoutineActionList = RoutineAction | RoutineAction[];

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
    missed_run?: "skip" | "latest" | "all";
    overlap?: "skip";
  };
  action: RoutineActionList;
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
  runsPath: string;
};

export type RoutineExecutionResult = "success" | "failure" | "skipped";

export type RoutineStateEntry = {
  last_run: string;
  last_result?: RoutineExecutionResult;
  last_scheduled_for?: string;
  last_action_results?: RoutineActionResult[];
};

export type RoutineActionResult = {
  index: number;
  kind: RoutineActionKind;
  result: RoutineExecutionResult;
};

export type RoutineRunHistoryEntry = {
  version: 1;
  routine_id: string;
  scheduled_for: string;
  started_at: string;
  completed_at: string;
  result: RoutineExecutionResult;
  job_run_ids: string[];
};

export function routineActionKindLabel(action: RoutineActionList): string {
  const actions = Array.isArray(action) ? action : [action];
  return actions.length > 0 ? actions.map((item) => item.kind).join(" -> ") : "-";
}

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

  if (doc.policy?.missed_run === "skip") {
    const lastMinute = parsedLast
      ? Math.floor(parsedLast.getTime() / 60_000) * 60_000
      : Number.NEGATIVE_INFINITY;
    return nowMinute.getTime() > lastMinute &&
      cronMatches(doc.trigger.cron, doc.trigger.timezone, nowMinute)
      ? [nowMinute]
      : [];
  }

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

function parseRoutineAction(
  value: unknown,
  fieldName: string,
  errors: string[],
): RoutineAction | undefined {
  if (!isRecord(value)) {
    errors.push(`${fieldName} must be a mapping with kind`);
    return undefined;
  }

  const kind = typeof value.kind === "string" ? value.kind : "";
  if (kind === "specdojo") {
    const unknownKeys = Object.keys(value).filter((key) => key !== "kind" && key !== "args");
    if (unknownKeys.length > 0) {
      errors.push(`${fieldName} has unknown key(s): ${unknownKeys.sort().join(", ")}`);
    }
    const args = value.args;
    if (
      !Array.isArray(args) ||
      args.length === 0 ||
      args.some((item) => typeof item !== "string" || item.length === 0)
    ) {
      errors.push(`${fieldName}.args must be a non-empty list of strings`);
      return undefined;
    }
    if (args.includes("exec") || args.includes("--project")) {
      errors.push(`${fieldName}.args must not include exec or --project (project is appended)`);
      return undefined;
    }
    return { kind: "specdojo", args: args as string[] };
  }

  const unknownKeys = Object.keys(value).filter(
    (key) => key !== "kind" && key !== "job" && key !== "inputs",
  );
  if (unknownKeys.length > 0) {
    errors.push(`${fieldName} has unknown key(s): ${unknownKeys.sort().join(", ")}`);
  }
  if (kind !== "job") {
    errors.push(`${fieldName}.kind must be job or specdojo (got "${kind}")`);
  }
  if (typeof value.job !== "string" || !/^job-[a-z0-9][a-z0-9-]*$/.test(value.job)) {
    errors.push(`${fieldName}.job must match job-<slug>`);
  }
  if (
    value.inputs !== undefined &&
    (!isRecord(value.inputs) ||
      Object.values(value.inputs).some((item) => typeof item !== "string"))
  ) {
    errors.push(`${fieldName}.inputs must be a mapping of string values`);
  }

  return {
    kind: "job",
    job: typeof value.job === "string" ? value.job : "",
    ...(isRecord(value.inputs) ? { inputs: value.inputs as Record<string, string> } : {}),
  };
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
      if (missed !== undefined && missed !== "skip" && missed !== "latest" && missed !== "all") {
        errors.push("policy.missed_run must be skip, latest, or all");
      }
      if (overlap !== undefined && overlap !== "skip") errors.push("policy.overlap must be skip");
      policy = {
        ...(missed === "skip" || missed === "latest" || missed === "all"
          ? { missed_run: missed }
          : {}),
        ...(overlap === "skip" ? { overlap } : {}),
      };
    }
  }

  let action: RoutineActionList | undefined;
  if (Array.isArray(value.action)) {
    if (value.action.length === 0) errors.push("action must contain at least one action");
    const parsed = value.action.map((item, index) =>
      parseRoutineAction(item, `action[${index}]`, errors),
    );
    if (parsed.every((item): item is RoutineAction => item !== undefined)) action = parsed;
  } else {
    action = parseRoutineAction(value.action, "action", errors);
  }

  if (errors.length > 0 || action === undefined) {
    return { errors: errors.map((message) => `${fileName}: ${message}`) };
  }

  const doc: RoutineDoc = {
    id,
    ...(typeof value.name === "string" ? { name: value.name } : {}),
    ...(typeof value.description === "string" ? { description: value.description } : {}),
    ...(typeof value.enabled === "boolean" ? { enabled: value.enabled } : {}),
    ...(interval ? { interval } : {}),
    ...(parsedTrigger ? { trigger: parsedTrigger } : {}),
    ...(policy ? { policy } : {}),
    action,
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
    runsPath: join(generatedPath, "routine-runs.jsonl"),
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

export function appendRoutineRunHistory(runsPath: string, entry: RoutineRunHistoryEntry): void {
  ensureDir(resolve(runsPath, ".."));
  appendFileSync(runsPath, `${JSON.stringify(entry)}\n`, "utf8");
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

/**
 * routine は bin（dist/specdojo.js）を子プロセスとして起動するため、dist が古いと
 * 子プロセスも古い挙動で動き、設定済みの検証が沈黙して省略される。routine 実行の
 * 先頭で dist を最新化し、再ビルドに失敗した場合は実行を中止する。
 * tsx で src を直接実行している場合と配布環境では no-op になる。
 */
function ensureFreshDistForRoutineRun(): boolean {
  const result = ensureFreshDistBuildForEntry(fileURLToPath(import.meta.url));
  if (result.message) {
    const stream = result.outcome === "rebuild-failed" ? process.stderr : process.stdout;
    stream.write(`[routine] ${result.message}\n`);
  }
  return result.outcome !== "rebuild-failed";
}

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

function renderRoutineInput(value: string, scheduledAt: Date, timezone: string): string {
  return value.replace(/\{\{\s*scheduled_at(?:\s*\|\s*iso_week)?\s*\}\}/g, (match) =>
    match.includes("iso_week") ? isoWeek(scheduledAt, timezone) : scheduledAt.toISOString(),
  );
}

export function buildJobRunArgs(
  action: RoutineJobAction,
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

export function aggregateRoutineActionResults(
  results: RoutineExecutionResult[],
): RoutineExecutionResult {
  if (results.includes("failure")) return "failure";
  if (results.includes("skipped")) return "skipped";
  return "success";
}

export function executeRoutineActions(
  actions: RoutineAction[],
  execute: (action: RoutineAction, index: number) => RoutineExecutionResult,
): RoutineActionResult[] {
  return actions.map((action, offset) => {
    const index = offset + 1;
    return { index, kind: action.kind, result: execute(action, index) };
  });
}

// routine は時刻条件と Job への委譲だけを持つ。実行内容と入力検証は Job Definition が担う。
function executeRoutineAction(
  doc: RoutineDoc,
  action: RoutineAction,
  projectId: string,
  dryRun: boolean,
  scheduledAt = new Date(),
): RoutineExecutionResult {
  const args =
    action.kind === "specdojo"
      ? buildSpecdojoActionArgs(action, projectId)
      : buildJobRunArgs(action, projectId, scheduledAt, doc.trigger?.timezone ?? "UTC");
  if (dryRun) {
    process.stdout.write(`  [dry-run] specdojo ${args.join(" ")}\n`);
    return "success";
  }
  return spawnSelf(args);
}

// specdojo action は exec run を経由せず、指定したサブコマンドに --project を付けて起動する。
export function buildSpecdojoActionArgs(
  action: RoutineSpecdojoAction,
  projectId: string,
): string[] {
  return [...action.args, "--project", projectId];
}

type RoutineRunResult = {
  result: RoutineExecutionResult;
  actionResults?: RoutineActionResult[];
  jobRunIds: string[];
};

function findJobRunId(
  action: RoutineAction,
  projectId: string,
  scheduledAt: Date,
): string | undefined {
  if (action.kind !== "job") return undefined;
  const runsPath = resolveJobPaths(projectId).runsPath;
  if (!existsSync(runsPath)) return undefined;
  const scheduledFor = scheduledAt.toISOString();
  for (const file of readdirSync(runsPath)
    .filter((name) => name.endsWith(".json"))
    .sort()) {
    try {
      const run = readJson(join(runsPath, file)) as Record<string, unknown>;
      if (
        run.job_id === action.job &&
        run.scheduled_at === scheduledFor &&
        typeof run.run_id === "string"
      ) {
        return run.run_id;
      }
    } catch {
      // Job Run の検証は job 側の責務。履歴追記では壊れた別 Run を無視する。
    }
  }
  return undefined;
}

// action が配列なら、前段の結果にかかわらず先頭から全段を順次実行する。
// 段別結果を返し、全体結果は failure > skipped > success の順に集約する。
function executeRoutine(
  routine: LoadedRoutine,
  projectId: string,
  dryRun: boolean,
  scheduledAt = new Date(),
): RoutineRunResult {
  const { doc } = routine;
  const actions = Array.isArray(doc.action) ? doc.action : [doc.action];
  const label = doc.name ?? (actions.length === 1 ? actions[0].kind : `${actions.length} actions`);
  process.stdout.write(`[routine] ${doc.id}: ${label}\n`);

  if (!Array.isArray(doc.action)) {
    const result = executeRoutineAction(doc, doc.action, projectId, dryRun, scheduledAt);
    const jobRunId = dryRun ? undefined : findJobRunId(doc.action, projectId, scheduledAt);
    return {
      result,
      jobRunIds: jobRunId ? [jobRunId] : [],
    };
  }

  const actionResults = executeRoutineActions(actions, (action, index) => {
    process.stdout.write(`  action ${index}/${actions.length}: ${action.kind}\n`);
    const result = executeRoutineAction(doc, action, projectId, dryRun, scheduledAt);
    process.stdout.write(`  action ${index}/${actions.length}: ${result}\n`);
    return result;
  });
  const result = aggregateRoutineActionResults(actionResults.map((item) => item.result));
  process.stdout.write(
    `  action summary: ${actionResults.map((item) => `${item.index}:${item.result}`).join(", ")} => ${result}\n`,
  );
  const jobRunIds = dryRun
    ? []
    : doc.action.flatMap((action) => {
        const runId = findJobRunId(action, projectId, scheduledAt);
        return runId ? [runId] : [];
      });
  return { result, actionResults, jobRunIds };
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
      process.stdout.write(`runs:     ${paths.runsPath}\n`);
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
        kind: routineActionKindLabel(doc.action),
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
        if (!ensureFreshDistForRoutineRun()) {
          process.exitCode = 1;
          return;
        }
        lockDir = acquireRoutineLock(paths.routinesPath);
      }

      let failed = 0;
      let skipped = 0;
      for (const selectedRun of selected) {
        const { entry, scheduledAt } = selectedRun;
        const startedAt = nowUtcIsoSeconds();
        // 実行の試行自体を last_run として先に記録する。失敗した routine が次の
        // 発火まで再試行されない代わりに、失敗が高頻度で連続発火することを防ぐ。
        if (!dryRun) {
          state.routines[entry.doc.id] = {
            ...state.routines[entry.doc.id],
            last_run: startedAt,
            ...(entry.doc.trigger ? { last_scheduled_for: scheduledAt.toISOString() } : {}),
          };
          writeRoutineState(paths, state);
        }

        const execution = executeRoutine(entry, paths.projectId, dryRun, scheduledAt);
        const { result } = execution;
        if (result === "failure") failed++;
        if (result === "skipped") {
          skipped++;
          process.stdout.write(`[routine] skipped ${entry.doc.id}: job action skipped\n`);
        }

        if (!dryRun) {
          state.routines[entry.doc.id] = {
            ...state.routines[entry.doc.id],
            last_result: result,
            last_action_results: execution.actionResults,
          };
          writeRoutineState(paths, state);
          appendRoutineRunHistory(paths.runsPath, {
            version: 1,
            routine_id: entry.doc.id,
            scheduled_for: scheduledAt.toISOString(),
            started_at: startedAt,
            completed_at: nowUtcIsoSeconds(),
            result,
            job_run_ids: execution.jobRunIds,
          });
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
