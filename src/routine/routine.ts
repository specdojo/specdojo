import { registerDeprecatedWhereAlias } from "../shared/where-alias.js";
import { spawnSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { type Command } from "commander";
import { ensureFreshDistBuildForEntry } from "../shared/dist-freshness.js";
import { ROUTINE_BUSY_SKIP_EXIT_CODE, ROUTINE_EXEC_ENV } from "../exec/run/lock.js";
import { ensureDir, listFilesRecursive, readJson, writeJson } from "../shared/fs.js";
import { padEndDisplay } from "../shared/text.js";
import { nowUtcIsoSeconds } from "../shared/time.js";
import {
  jobDeclaresReview,
  jobRunUsesReviewedIntegration,
  loadJobDefinition,
  resolveJobPaths,
  resolveJobReviewAgentNominations,
  type JobDefinition,
} from "../job/job.js";
import {
  cronOccurrences,
  isRecord,
  isRoutineEntryDue,
  isRoutineYamlFile,
  isoWeek,
  loadRoutines,
  resolveRoutinePaths,
  routineActionKindLabel,
  type LoadedRoutine,
  type RoutineAction,
  type RoutineActionResult,
  type RoutineDoc,
  type RoutineExecutionResult,
  type RoutineJobAction,
  type RoutinePaths,
  type RoutineRunHistoryEntry,
  type RoutineSkipReason,
  type RoutineSpecdojoAction,
  type RoutineStateEntry,
  type RoutineStateFile,
} from "./definition.js";
import { selfRunArgs } from "../shared/spawn-self.js";
import { specdojoRootDir } from "../shared/specdojo-config.js";
import { migrateRoutineStorage } from "./storage.js";
import { recordRoutineFailure } from "./failure.js";
import { formatRoutineStatus, readRoutineHistoryLenient } from "./status.js";

export {
  cronMatches,
  cronOccurrences,
  isRoutineDue,
  isRoutineEntryDue,
  isoWeek,
  loadRoutines,
  parseCronExpression,
  parseIntervalMs,
  parseRoutineDoc,
  resolveRoutinePaths,
  routineActionKindLabel,
} from "./definition.js";
export type {
  LoadedRoutine,
  RoutineAction,
  RoutineActionKind,
  RoutineActionList,
  RoutineActionResult,
  RoutineDoc,
  RoutineExecutionResult,
  RoutineJobAction,
  RoutinePaths,
  RoutineRunHistoryEntry,
  RoutineSkipReason,
  RoutineSpecdojoAction,
  RoutineStateEntry,
  RoutineStateResult,
} from "./definition.js";

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
  ensureDir(paths.stateDirectory);
  writeJson(paths.statePath, state);
}

export function recordRoutineStart(
  current: RoutineStateEntry | undefined,
  startedAt: string,
  scheduledAt?: string,
): RoutineStateEntry {
  const next: RoutineStateEntry = {
    ...current,
    last_run: startedAt,
    last_result: "running",
    ...(scheduledAt ? { last_scheduled_for: scheduledAt } : {}),
  };
  delete next.last_reason;
  delete next.last_action_results;
  return next;
}

export function recordRoutineCompletion(
  current: RoutineStateEntry | undefined,
  result: RoutineExecutionResult,
  reason?: string,
  actionResults?: RoutineActionResult[],
): RoutineStateEntry {
  const next: RoutineStateEntry = {
    ...current,
    last_run: current?.last_run ?? nowUtcIsoSeconds(),
    last_result: result,
    ...(reason ? { last_reason: reason } : {}),
    ...(actionResults ? { last_action_results: actionResults } : {}),
  };
  if (!reason) delete next.last_reason;
  if (!actionResults) delete next.last_action_results;
  return next;
}

// busy skip の回を流し直す上限（同じ routine で続いた回数）。毎時の `routine run --due` で
// おおよそ 1 日ぶん試し、超えたらその回を済んだ回として扱い、理由を last_reason と履歴に残す。
export const ROUTINE_BUSY_RETRY_LIMIT = 24;

export type RoutineSkipSettlement = {
  entry: RoutineStateEntry;
  skipReason?: RoutineSkipReason;
  retryPending: boolean;
};

/**
 * 完了を記録した state を、skip の内訳に合わせて確定する。別の run の lock による skip（busy）は
 * 済んだ回として扱わず、cron は last_scheduled_for を開始前の値へ戻し、interval は
 * busy_skip_count を正にして次の `routine run --due` で due にする。missed_run が skip の cron、
 * Job の前提条件による skip、skipped 以外の結果は従来どおり済んだ回として扱う。
 */
export function settleRoutineSkip(
  doc: RoutineDoc,
  previous: RoutineStateEntry | undefined,
  completed: RoutineStateEntry,
  result: RoutineExecutionResult,
  busySkipped: boolean,
): RoutineSkipSettlement {
  const entry: RoutineStateEntry = { ...completed };
  delete entry.busy_skip_count;
  delete entry.last_skip_reason;
  if (result !== "skipped") return { entry, retryPending: false };

  const skipReason: RoutineSkipReason = busySkipped ? "busy" : "precondition";
  entry.last_skip_reason = skipReason;
  if (!busySkipped || (doc.trigger && doc.policy?.missed_run === "skip")) {
    return { entry, skipReason, retryPending: false };
  }

  const count = (previous?.busy_skip_count ?? 0) + 1;
  if (count > ROUTINE_BUSY_RETRY_LIMIT) {
    const note = `busy skip retry limit (${ROUTINE_BUSY_RETRY_LIMIT}) reached; occurrence not retried`;
    entry.last_reason = entry.last_reason ? `${entry.last_reason}; ${note}` : note;
    return { entry, skipReason, retryPending: false };
  }

  entry.busy_skip_count = count;
  if (doc.trigger) {
    if (previous?.last_scheduled_for) entry.last_scheduled_for = previous.last_scheduled_for;
    else delete entry.last_scheduled_for;
  }
  return { entry, skipReason, retryPending: true };
}

// exec run / resume が別の run の lock で skip したときの出力（src/exec/run/shared.ts）。
// Job の前提条件による skip も同じ終了コードを返すため、出力で区別する。
export function isExecBusySkipOutput(output: string): boolean {
  return /^\[[a-z-]+\] skipped: exec busy$/m.test(output);
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
function acquireRoutineLock(lockDir: string): string {
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
  const result = ensureFreshDistBuildForEntry(
    fileURLToPath(new URL("../specdojo.js", import.meta.url)),
  );
  if (result.message) {
    const stream = result.outcome === "rebuild-failed" ? process.stderr : process.stdout;
    stream.write(`[routine] ${result.message}\n`);
  }
  return result.outcome !== "rebuild-failed";
}

let lastRoutineSpawnReason: string | undefined;
let lastRoutineSpawnRunId: string | undefined;
let lastRoutineSpawnNoop = false;
let lastRoutineSpawnBusy = false;

function resetRoutineSpawnMarkers(): void {
  lastRoutineSpawnReason = undefined;
  lastRoutineSpawnRunId = undefined;
  lastRoutineSpawnNoop = false;
  lastRoutineSpawnBusy = false;
}

function spawnSelf(args: string[]): RoutineExecutionResult {
  resetRoutineSpawnMarkers();
  const [exe, fullArgs] = selfRunArgs(args);
  const result = spawnSync(exe, fullArgs, {
    encoding: "utf8",
    stdio: ["inherit", "pipe", "pipe"],
    maxBuffer: 128 * 1024 * 1024,
    cwd: specdojoRootDir(),
    env: { ...process.env, [ROUTINE_EXEC_ENV]: "1" },
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
  const marker = [...output.matchAll(/^\[routine-job\]\s+([^\n]+)$/gm)].at(-1)?.[1];
  if (marker) {
    lastRoutineSpawnNoop = /\bstate=noop\b/.test(marker);
    lastRoutineSpawnRunId = marker.match(/\brun_id=([^\s]+)/)?.[1];
    lastRoutineSpawnReason = marker.match(/\breason=(.+)$/)?.[1]?.trim();
  }
  if (!lastRoutineSpawnReason && result.status !== 0) {
    lastRoutineSpawnReason = String(result.stderr ?? "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .at(-1);
  }
  if (result.status === ROUTINE_BUSY_SKIP_EXIT_CODE) {
    lastRoutineSpawnBusy = isExecBusySkipOutput(output);
    return "skipped";
  }
  if (result.status === 0 && marker?.match(/\bstate=([^\s]+)/)?.[1] === "partial") {
    return "partial";
  }
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
  // action.commit is kept for compatibility. A Job that declares task.review is reviewed by
  // exec run regardless of this flag, so the Job's declaration takes precedence.
  if (action.commit) args.push("--worktree");
  for (const [key, value] of Object.entries(action.inputs ?? {}).sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    args.push("--input", `${key}=${renderRoutineInput(value, scheduledAt, timezone)}`);
  }
  return args;
}

/**
 * Describes how a job action's Run is integrated and which review agents the Job nominates.
 * The Job's task.review declaration wins over the legacy routine `commit`; routine never
 * passes --review-by / --reporter-by, so an agent without a Job nomination is auto selected.
 */
export function describeJobActionReview(
  action: RoutineJobAction,
  definition: Pick<JobDefinition, "task">,
): string {
  if (!jobRunUsesReviewedIntegration(definition, { worktree: action.commit === true })) {
    return "review: none (in-place)";
  }
  const source = jobDeclaresReview(definition)
    ? "job task.review"
    : "routine action.commit (compat)";
  const nominations = resolveJobReviewAgentNominations({}, definition);
  return `review: ${source} (executor=${nominations.executor?.nickname ?? "auto"}, reporter=${nominations.reporter?.nickname ?? "auto"})`;
}

export function aggregateRoutineActionResults(
  results: RoutineExecutionResult[],
): RoutineExecutionResult {
  if (results.includes("failure")) return "failure";
  if (results.includes("partial")) return "partial";
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
    resetRoutineSpawnMarkers();
    process.stdout.write(`  [dry-run] specdojo ${args.join(" ")}\n`);
    if (action.kind === "job") {
      try {
        const definition = loadJobDefinition(resolveJobPaths(projectId), action.job);
        process.stdout.write(`  [dry-run] ${describeJobActionReview(action, definition)}\n`);
      } catch (error) {
        process.stdout.write(
          `  [dry-run] review: unknown (${error instanceof Error ? error.message : String(error)})\n`,
        );
      }
    }
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
  reason?: string;
  // いずれかの段が別の run の lock で skip した。
  busySkipped: boolean;
};

function findJobRunId(
  action: RoutineAction,
  projectId: string,
  scheduledAt: Date,
): string | undefined {
  if (action.kind !== "job" || lastRoutineSpawnNoop) return undefined;
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
// 段別結果を返し、全体結果は failure > partial > skipped > success の順に集約する。
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

  const multiple = Array.isArray(doc.action);
  const jobRunIds: string[] = [];
  const reasons: string[] = [];
  let busySkipped = false;
  const actionResults = executeRoutineActions(actions, (action, index) => {
    if (multiple) process.stdout.write(`  action ${index}/${actions.length}: ${action.kind}\n`);
    resetRoutineSpawnMarkers();
    let result: RoutineExecutionResult;
    try {
      result = executeRoutineAction(doc, action, projectId, dryRun, scheduledAt);
    } catch (error) {
      result = "failure";
      lastRoutineSpawnReason = error instanceof Error ? error.message : String(error);
    }
    const runId =
      lastRoutineSpawnRunId ?? (dryRun ? undefined : findJobRunId(action, projectId, scheduledAt));
    if (runId) jobRunIds.push(runId);
    if (lastRoutineSpawnReason) reasons.push(lastRoutineSpawnReason);
    if (result === "skipped" && lastRoutineSpawnBusy) busySkipped = true;
    if (multiple) process.stdout.write(`  action ${index}/${actions.length}: ${result}\n`);
    return result;
  });
  const result = aggregateRoutineActionResults(actionResults.map((item) => item.result));
  if (multiple)
    process.stdout.write(
      `  action summary: ${actionResults.map((item) => `${item.index}:${item.result}`).join(", ")} => ${result}\n`,
    );
  return {
    result,
    ...(multiple ? { actionResults } : {}),
    jobRunIds: [...new Set(jobRunIds)],
    ...(reasons.length ? { reason: reasons.join("; ") } : {}),
    busySkipped,
  };
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

export function printRoutinePaths(opts: { project?: string }): void {
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
}

export function registerRoutineCommands(program: Command): void {
  const routine = program
    .command("routine")
    .description("Periodic task execution from rtn-*.yaml definitions");

  registerDeprecatedWhereAlias(routine, printRoutinePaths);

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

      migrateRoutineStorage(paths.routinesPath);
      const state = readRoutineState(paths.statePath);
      const now = new Date();
      const rows = routines.map(({ doc }) => ({
        id: doc.id,
        enabled: doc.enabled === false ? "disabled" : "enabled",
        interval: doc.interval ?? doc.trigger?.cron ?? "-",
        kind: routineActionKindLabel(doc.action),
        lastRun: formatRoutineLastRun(state.routines[doc.id]),
        due:
          doc.enabled !== false && isRoutineEntryDue(doc, state.routines[doc.id], now)
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

  // --- status ---
  const statusCmd = routine
    .command("status")
    .description("Show each routine's state, busy-skip retries, and recent runs");
  addProjectOption(statusCmd);
  statusCmd.option("--id <routineId>", "Show only this routine");
  statusCmd.option("--limit <count>", "Number of recent runs to show per routine", "5");
  statusCmd.action((opts) => {
    try {
      const limit = Number(opts.limit);
      if (!Number.isSafeInteger(limit) || limit < 0) {
        throw new Error(`--limit must be a non-negative integer (got "${String(opts.limit)}")`);
      }
      const paths = resolveRoutinePaths(opts);
      const { routines, errors } = loadRoutines(paths.routinesPath);
      for (const message of errors) {
        process.stderr.write(`ERROR: ${message}\n`);
      }
      if (errors.length > 0) process.exitCode = 1;
      const routineId = typeof opts.id === "string" ? opts.id.trim() : "";
      const targets = routineId ? routines.filter((entry) => entry.doc.id === routineId) : routines;
      if (routineId && targets.length === 0) {
        throw new Error(`Routine not found: ${routineId} (in ${paths.routinesPath})`);
      }
      migrateRoutineStorage(paths.routinesPath);
      const state = readRoutineState(paths.statePath);
      const history = readRoutineHistoryLenient(paths.runsPath);
      const now = new Date();
      for (const { doc } of targets) {
        const lines = formatRoutineStatus(doc, state.routines[doc.id], history, now, limit);
        process.stdout.write(`${lines.join("\n")}\n`);
      }
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

      if (!opts.dryRun) migrateRoutineStorage(paths.routinesPath);
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
          return isRoutineEntryDue(entry.doc, stateEntry, now) ? [{ entry, scheduledAt: now }] : [];
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
        lockDir = acquireRoutineLock(paths.lockPath);
      }

      let failed = 0;
      let partial = 0;
      let skipped = 0;
      // busy skip した routine の残りの回（missed_run: all）は、この実行では流さない。
      // 後の回だけ進めると last_scheduled_for が skip した回を越え、その回が流し直されなくなる。
      const busyRoutineIds = new Set<string>();
      for (const selectedRun of selected) {
        const { entry, scheduledAt } = selectedRun;
        if (busyRoutineIds.has(entry.doc.id)) {
          process.stdout.write(
            `[routine] deferred ${entry.doc.id} ${scheduledAt.toISOString()}: earlier occurrence skipped as busy\n`,
          );
          continue;
        }
        const previousEntry = state.routines[entry.doc.id];
        const startedAt = nowUtcIsoSeconds();
        // 実行の試行自体を last_run として先に記録する。失敗した routine が次の
        // 発火まで再試行されない代わりに、失敗が高頻度で連続発火することを防ぐ。
        // また、実行中は last_result を "running" とし、前回の結果や理由が表示されるのを防ぐ。
        if (!dryRun) {
          state.routines[entry.doc.id] = recordRoutineStart(
            state.routines[entry.doc.id],
            startedAt,
            entry.doc.trigger ? scheduledAt.toISOString() : undefined,
          );
          writeRoutineState(paths, state);
        }

        let execution: RoutineRunResult;
        try {
          execution = executeRoutine(entry, paths.projectId, dryRun, scheduledAt);
        } catch (error) {
          execution = {
            result: "failure",
            jobRunIds: [],
            reason: error instanceof Error ? error.message : String(error),
            busySkipped: false,
          };
        }
        const { result } = execution;
        if (result === "failure") failed++;
        if (result === "partial") partial++;
        if (result === "skipped") {
          skipped++;
          process.stdout.write(`[routine] skipped ${entry.doc.id}: job action skipped\n`);
        }

        if (!dryRun) {
          const settlement = settleRoutineSkip(
            entry.doc,
            previousEntry,
            recordRoutineCompletion(
              state.routines[entry.doc.id],
              result,
              execution.reason,
              execution.actionResults,
            ),
            result,
            execution.busySkipped,
          );
          state.routines[entry.doc.id] = settlement.entry;
          writeRoutineState(paths, state);
          if (settlement.retryPending) {
            busyRoutineIds.add(entry.doc.id);
            process.stdout.write(
              `[routine] ${entry.doc.id}: busy skip ${settlement.entry.busy_skip_count}/${ROUTINE_BUSY_RETRY_LIMIT}, retried on the next routine run --due\n`,
            );
          }
          const historyReason = settlement.entry.last_reason;
          const history: RoutineRunHistoryEntry = {
            version: 1,
            routine_id: entry.doc.id,
            scheduled_for: scheduledAt.toISOString(),
            started_at: startedAt,
            completed_at: nowUtcIsoSeconds(),
            result,
            job_run_ids: execution.jobRunIds,
            ...(historyReason ? { reason: historyReason } : {}),
            ...(settlement.skipReason ? { skip_reason: settlement.skipReason } : {}),
            ...(settlement.retryPending ? { retry_pending: true } : {}),
          };
          appendRoutineRunHistory(paths.runsPath, history);
          recordRoutineFailure(specdojoRootDir(), paths.failuresPath, history);
        }
      }

      process.stdout.write(
        `[routine] ${selected.length} routine(s) processed, ${partial} partial, ${skipped} skipped, ${failed} failed\n`,
      );
      if (failed > 0) process.exitCode = 1;
    } catch (error) {
      printCommandError(error);
    } finally {
      if (lockDir) releaseRoutineLock(lockDir);
    }
  });
}
