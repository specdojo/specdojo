import { basename, join, resolve } from "node:path";
import {
  getProjectRoutinesPath,
  loadConfig,
  loadEnv,
  specdojoRootDir,
} from "../shared/specdojo-config.js";
import { listFilesRecursive, readYaml } from "../exec-shared.js";

// ================================
// Types
// ================================

export type RoutineActionKind = "job" | "specdojo";

export type RoutineJobAction = {
  kind: "job";
  job: string;
  inputs?: Record<string, string>;
  commit?: boolean;
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
  last_reason?: string;
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
  reason?: string;
};

export function routineActionKindLabel(action: RoutineActionList): string {
  const actions = Array.isArray(action) ? action : [action];
  return actions.length > 0 ? actions.map((item) => item.kind).join(" -> ") : "-";
}

export type RoutineStateFile = {
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

export function isRecord(value: unknown): value is Record<string, unknown> {
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
    (key) => key !== "kind" && key !== "job" && key !== "inputs" && key !== "commit",
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
  if (value.commit !== undefined && typeof value.commit !== "boolean") {
    errors.push(`${fieldName}.commit must be a boolean`);
  }

  return {
    kind: "job",
    job: typeof value.job === "string" ? value.job : "",
    ...(isRecord(value.inputs) ? { inputs: value.inputs as Record<string, string> } : {}),
    ...(typeof value.commit === "boolean" ? { commit: value.commit } : {}),
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

export function isRoutineYamlFile(filePath: string): boolean {
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
