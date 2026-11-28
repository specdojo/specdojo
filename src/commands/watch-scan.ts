import type { Command } from "commander";
import { relative } from "node:path";
import { loadExecDefaultsConfig } from "../exec/agent-config.js";
import { resolveProjectPaths } from "../exec/project.js";
import { loadRosterForExecutionPath } from "../exec/run/agent.js";
import { ROUTINE_BUSY_SKIP_EXIT_CODE, ROUTINE_EXEC_ENV } from "../exec/run/lock.js";
import {
  pauseWatch,
  readWatchControl,
  resumeWatch,
  WATCH_ALL_TARGETS,
  type WatchControlLine,
} from "../exec/watch-control.js";
import { resolveWatchRemedies } from "../exec/watch-remedy.js";
import { runWatchDiagnosis } from "../exec/watch-diagnosis.js";
import { resolvePlaybookPaths } from "../project/playbook.js";
import { STALL_CATEGORY_LABELS, type StallCategory } from "../exec/watch-scan-classify.js";
import { runWatchScan, type WatchLogLine } from "../exec/watch-scan.js";
import { loadRegisterItems, resolveRegisterPaths } from "../register/register.js";
import { nowUtcIsoSeconds } from "../exec/shared.js";
import { assertValidExecActor, specdojoRootDir } from "../shared/specdojo-config.js";

const DURATION_UNITS: Record<string, number> = { m: 60_000, h: 3_600_000, d: 86_400_000 };

/** 人やオーケストレーターが手で付ける印の既定の主体。 */
export const WATCH_CONTROL_DEFAULT_ACTOR = "specdojo-orchestrator";

export function parseStaleAfter(value: string): number {
  const match = /^([1-9]\d*)([mhd])$/u.exec(value.trim());
  if (!match)
    throw new Error(`--stale-after must be <positive integer><m|h|d> (e.g. 2h): ${value}`);
  return Number(match[1]) * DURATION_UNITS[match[2]!]!;
}

function parseIfBusy(value: string): "scan" | "skip" {
  if (value === "scan" || value === "skip") return value;
  throw new Error(`--if-busy must be scan or skip: ${value}`);
}

/** 人（名簿の `type: human`）とオーケストレーター。この claim の対象には見張りが触らない。 */
function manualActorsFor(executionPath: string): Set<string> {
  const roster = loadRosterForExecutionPath(executionPath);
  const actors = new Set<string>([WATCH_CONTROL_DEFAULT_ACTOR]);
  for (const member of roster?.members ?? [])
    if (member.type === "human") actors.add(member.nickname);
  return actors;
}

type ScanOpts = {
  project?: string;
  staleAfter: string;
  execDefaults?: string;
  remedy: boolean;
  diagnosis: boolean;
  dryRun: boolean;
  ifBusy: string;
};

function formatAppended(line: WatchLogLine, dryRun: boolean): string {
  switch (line.event) {
    case "stalled":
      return `[watch-scan] stalled ${line.target.id} ${line.state} → ${line.category}/${line.detail}\n`;
    case "remedy":
      return `[watch-scan] remedy ${line.target.id} ${line.action} (${line.attempt}/${line.max_attempts}): specdojo ${line.argv.join(" ")}${dryRun ? " [dry-run: not launched]" : ` → ${line.log}`}\n`;
    case "remedy_stopped":
      return `[watch-scan] remedy stopped ${line.target.id}: ${line.reason}\n`;
    default:
      return `[watch-scan] ${line.event} ${line.target.id}\n`;
  }
}

async function scanAction(opts: ScanOpts): Promise<void> {
  const staleMs = parseStaleAfter(opts.staleAfter);
  const ifBusy = parseIfBusy(opts.ifBusy);
  const resolved = resolveProjectPaths({ project: opts.project });
  const projectId = resolved.projectId ?? opts.project;
  if (!projectId) throw new Error("orchestrator watch-scan requires --project <id>.");
  const root = specdojoRootDir();
  const defaults = loadExecDefaultsConfig(opts.execDefaults, resolved.executionPath);
  const remedies = opts.remedy ? resolveWatchRemedies(defaults.watch) : undefined;
  let register: Parameters<typeof runWatchScan>[0]["register"];
  let timeZone = "UTC";
  try {
    const registerPaths = resolveRegisterPaths({ project: projectId });
    timeZone = registerPaths.registerDateTimeZone;
    register = {
      items: loadRegisterItems(registerPaths).map((view) => view.item),
      projectRegisterPath: registerPaths.projectRegisterPath,
    };
  } catch (error) {
    process.stderr.write(
      `[watch-scan] register skipped: ${error instanceof Error ? error.message : String(error)}\n`,
    );
  }
  const outcome = runWatchScan({
    projectId,
    root,
    executionPath: resolved.executionPath,
    schedulePath: resolved.schedulePath,
    ...(register ? { register } : {}),
    timeZone,
    now: new Date(),
    staleMs,
    dryRun: opts.dryRun,
    manualActors: manualActorsFor(resolved.executionPath),
    ifBusy,
    ...(remedies ? { remedies } : {}),
  });
  if (outcome.skipped) {
    // routine は `[<command>] skipped: exec busy` で busy の回を見分け、次の回に流し直す（PJR-KVWH）。
    process.stdout.write(
      outcome.skipped.reason === "busy"
        ? `[watch-scan] skipped: exec busy\n`
        : `[watch-scan] skipped: watch paused (${outcome.skipped.detail})\n`,
    );
    if (process.env[ROUTINE_EXEC_ENV] === "1") process.exitCode = ROUTINE_BUSY_SKIP_EXIT_CODE;
    return;
  }
  for (const line of outcome.appended) process.stdout.write(formatAppended(line, opts.dryRun));
  for (const entry of outcome.held)
    process.stdout.write(
      `[watch-scan] held ${entry.target.id} ${entry.state} (${entry.hold.reason}: ${entry.hold.detail})\n`,
    );
  const byCategory = new Map<StallCategory, number>();
  for (const line of outcome.current)
    byCategory.set(line.category, (byCategory.get(line.category) ?? 0) + 1);
  const summary = [...byCategory]
    .map(([category, count]) => `${STALL_CATEGORY_LABELS[category]}=${count}`)
    .join(", ");
  process.stdout.write(
    `[watch-scan] ${outcome.current.length} stalled (${summary || "none"}), ${outcome.held.length} held, ${outcome.appended.length} new log line(s)${opts.dryRun ? " [dry-run]" : ""}\n`,
  );
  for (const item of outcome.remedy.waiting)
    process.stdout.write(`[watch-scan] waiting ${item.id} until ${item.until}\n`);
  if (outcome.remedy.deferredByLock)
    process.stdout.write("[watch-scan] remedy deferred: another exec run holds the lock\n");
  for (const warning of outcome.warnings)
    process.stderr.write(`[watch-scan] warning: ${warning}\n`);
  if (!opts.dryRun) {
    try {
      await runWatchDiagnosis({
        outcome,
        config: defaults,
        roster: loadRosterForExecutionPath(resolved.executionPath),
        executionPath: resolved.executionPath,
        root,
        playbookPath: resolvePlaybookPaths({ project: projectId }).playbookPath,
        now: new Date(),
        timeZone,
        dryRun: opts.dryRun,
        enabled: opts.diagnosis,
      });
    } catch (error) {
      process.stderr.write(
        `[watch-diagnosis] warning: ${error instanceof Error ? error.message : String(error)}\n`,
      );
    }
    process.stdout.write(`[watch-scan] log: ${relative(root, outcome.logPath)}\n`);
    process.stdout.write(`[watch-scan] morning report: ${relative(root, outcome.reportPath)}\n`);
  }
}

async function runCommand(label: string, body: () => void | Promise<void>): Promise<void> {
  try {
    await body();
  } catch (error) {
    process.stderr.write(`[${label}] ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}

type ControlOpts = { project?: string; id?: string[]; by: string; reason?: string };

function describeControl(id: string): string {
  return id === WATCH_ALL_TARGETS ? "the whole watch" : id;
}

function controlAction(kind: "pause" | "resume", opts: ControlOpts): void {
  const { executionPath } = resolveProjectPaths({ project: opts.project });
  assertValidExecActor(opts.by, loadRosterForExecutionPath(executionPath));
  const change = {
    targets: opts.id ?? [],
    by: opts.by,
    ...(opts.reason ? { reason: opts.reason } : {}),
    now: nowUtcIsoSeconds(),
  };
  const lines: WatchControlLine[] =
    kind === "pause" ? pauseWatch(executionPath, change) : resumeWatch(executionPath, change);
  const label = `watch-${kind}`;
  if (lines.length === 0) {
    process.stdout.write(`[${label}] nothing to change\n`);
    return;
  }
  for (const line of lines)
    process.stdout.write(`[${label}] ${line.event} ${describeControl(line.target.id)}\n`);
}

function statusAction(opts: { project?: string }): void {
  const { executionPath } = resolveProjectPaths({ project: opts.project });
  const control = readWatchControl(executionPath);
  const all = control.all;
  process.stdout.write(
    all
      ? `watch: paused by ${all.by} at ${all.at}${all.reason ? ` (${all.reason})` : ""}\n`
      : "watch: running\n",
  );
  const ids = Object.keys(control.targets);
  if (ids.length === 0) {
    process.stdout.write("excluded targets: none\n");
    return;
  }
  process.stdout.write("excluded targets:\n");
  for (const id of ids) {
    const mark = control.targets[id]!;
    process.stdout.write(
      `  ${id}  by ${mark.by} at ${mark.at}${mark.reason ? ` (${mark.reason})` : ""}\n`,
    );
  }
}

function collectId(value: string, previous: string[] = []): string[] {
  return [...previous, ...value.split(",").map((id) => id.trim())];
}

export function registerWatchScanCommand(orchestrator: Command): void {
  orchestrator
    .command("watch-scan")
    .description(
      "Find and classify stalls, write the watch log and morning report, and launch configured remedies or read-only diagnosis agents (both disabled by default; exclude targets a person or orchestrator is working on)",
    )
    .option("--project <projectId>", "Project id in specdojo.config.json")
    .option(
      "--stale-after <duration>",
      "Treat doing / in-progress / running without a live exec lock as interrupted after this long",
      "2h",
    )
    .option(
      "--if-busy <policy>",
      "When another exec run holds the run lock: scan (read and record anyway) or skip (do nothing until the next round)",
      "scan",
    )
    .option(
      "--exec-defaults <path>",
      "Path to exec-defaults.yaml (default: .specdojo/exec-defaults.yaml)",
    )
    .option(
      "--no-remedy",
      "Launch no remedy even when configured (diagnosis is controlled separately)",
    )
    .option(
      "--no-diagnosis",
      "Launch no diagnosis agent even when watch.diagnosis.by is configured",
    )
    .option("--dry-run", "Print what would be recorded and launched without writing", false)
    .action((opts: ScanOpts) => runCommand("watch-scan", () => scanAction(opts)));

  for (const kind of ["pause", "resume"] as const) {
    orchestrator
      .command(`watch-${kind}`)
      .description(
        kind === "pause"
          ? "Pause the watch for the whole project, or mark targets (--id) as excluded from the watch and its remedies"
          : "Resume the watch for the whole project, or for the targets given with --id",
      )
      .option("--project <projectId>", "Project id in specdojo.config.json")
      .option(
        "--id <ids>",
        "Task, register item, or queue id (repeatable or comma-separated); omit for the whole watch",
        collectId,
      )
      .option(
        "--by <actor>",
        "Who pauses or resumes (recorded in the watch log)",
        WATCH_CONTROL_DEFAULT_ACTOR,
      )
      .option("--reason <text>", "Why (recorded in the watch control and log)")
      .action((opts: ControlOpts) => runCommand(`watch-${kind}`, () => controlAction(kind, opts)));
  }

  orchestrator
    .command("watch-status")
    .description("Show whether the watch is paused and which targets are excluded")
    .option("--project <projectId>", "Project id in specdojo.config.json")
    .action((opts: { project?: string }) => runCommand("watch-status", () => statusAction(opts)));
}
