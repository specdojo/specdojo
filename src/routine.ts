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

// ================================
// Types
// ================================

export type RoutineActionKind = "register" | "exec-auto";

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
  // kind: exec-auto — exec run --auto へ引き渡すオプション
  strategy?: "critical-first" | "fifo";
  parallel?: number;
  loop?: boolean;
  max_rounds?: number;
};

export type RoutineDoc = {
  id: string;
  name?: string;
  description?: string;
  enabled?: boolean;
  interval: string;
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

type RoutineStateEntry = {
  last_run: string;
  last_result?: "success" | "failure";
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
  if (!lastRun) return true;
  const last = new Date(lastRun);
  if (Number.isNaN(last.getTime())) return true;
  return now.getTime() - last.getTime() >= parseIntervalMs(doc.interval);
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
  if (!interval) {
    errors.push("interval is required (e.g. 30m, 6h, 1d, 1w)");
  } else {
    try {
      parseIntervalMs(interval);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  if (!isRecord(value.action)) {
    errors.push("action is required and must be a mapping with kind");
    return { errors: errors.map((message) => `${fileName}: ${message}`) };
  }

  const action = value.action;
  const kind = typeof action.kind === "string" ? action.kind : "";
  if (kind !== "register" && kind !== "exec-auto") {
    errors.push(`action.kind must be one of: register, exec-auto (got "${kind}")`);
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
    interval,
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

function spawnSelf(args: string[]): boolean {
  const [exe, fullArgs] = selfRunArgs(args);
  const result = spawnSync(exe, fullArgs, { stdio: "inherit", cwd: specdojoRootDir() });
  return result.status === 0;
}

// exec-auto action を exec run --auto の引数リストへ変換する（dry-run 表示と実行で共用）。
export function buildExecAutoArgs(action: RoutineAction, projectId: string): string[] {
  const args = ["exec", "run", "--auto", "--project", projectId];
  if (action.strategy) args.push("--strategy", action.strategy);
  if (action.parallel !== undefined) args.push("--parallel", String(action.parallel));
  if (action.loop) {
    args.push("--loop");
    if (action.max_rounds !== undefined) args.push("--max-rounds", String(action.max_rounds));
  }
  return args;
}

function buildRegisterRunArgs(pjrId: string, projectId: string): string[] {
  return ["exec", "run", "--register", pjrId, "--project", projectId];
}

// 1 routine を実行する。register kind は対象項目ごとに失敗を記録して継続し、
// 最後に集約する（1 件の失敗で残りの項目を止めない）。
function executeRoutine(routine: LoadedRoutine, projectId: string, dryRun: boolean): boolean {
  const { doc } = routine;
  process.stdout.write(`[routine] ${doc.id}: ${doc.name ?? doc.action.kind}\n`);

  if (doc.action.kind === "exec-auto") {
    const args = buildExecAutoArgs(doc.action, projectId);
    if (dryRun) {
      process.stdout.write(`  [dry-run] specdojo ${args.join(" ")}\n`);
      return true;
    }
    return spawnSelf(args);
  }

  // kind: register
  const registerPaths = resolveRegisterPaths({ project: projectId });
  if (!existsSync(registerPaths.pjrIndexPath)) {
    process.stderr.write(`  pjr-index.md not found: ${registerPaths.pjrIndexPath}\n`);
    return false;
  }
  const items = parsePjrIndex(readFileSync(registerPaths.pjrIndexPath, "utf8"));
  const selected = selectRegisterItems(items, doc.action);
  if (selected.length === 0) {
    process.stdout.write(`  no matching register items\n`);
    return true;
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
    if (!spawnSelf(args)) {
      allOk = false;
      failedIds.push(item.id);
    }
  }
  if (failedIds.length > 0) {
    process.stderr.write(`  failed register item(s): ${failedIds.join(", ")}\n`);
  }
  return allOk;
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

function formatLastRun(entry: RoutineStateEntry | undefined): string {
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
        interval: doc.interval,
        kind: doc.action.kind,
        lastRun: formatLastRun(state.routines[doc.id]),
        due:
          doc.enabled === false
            ? "-"
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

      let selected: LoadedRoutine[];
      if (opts.id) {
        const routineId = (opts.id as string).trim();
        const found = routines.find((entry) => entry.doc.id === routineId);
        if (!found) {
          throw new Error(`Routine not found: ${routineId} (in ${paths.routinesPath})`);
        }
        selected = [found];
      } else {
        selected = routines.filter(
          (entry) =>
            entry.doc.enabled !== false &&
            isRoutineDue(entry.doc, state.routines[entry.doc.id]?.last_run, now),
        );
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
      for (const entry of selected) {
        // 実行の試行自体を last_run として先に記録する。失敗した routine が次の
        // 発火まで再試行されない代わりに、失敗が高頻度で連続発火することを防ぐ。
        if (!dryRun) {
          state.routines[entry.doc.id] = { last_run: nowUtcIsoSeconds() };
          writeRoutineState(paths, state);
        }

        const ok = executeRoutine(entry, paths.projectId, dryRun);
        if (!ok) failed++;

        if (!dryRun) {
          state.routines[entry.doc.id] = {
            ...state.routines[entry.doc.id],
            last_result: ok ? "success" : "failure",
          };
          writeRoutineState(paths, state);
        }
      }

      process.stdout.write(`[routine] ${selected.length} routine(s) executed, ${failed} failed\n`);
      if (failed > 0) process.exitCode = 1;
    } catch (error) {
      printCommandError(error);
    } finally {
      if (lockDir) releaseRoutineLock(lockDir);
    }
  });
}
