import { existsSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import {
  type CpmResult,
  type ExecEventV1,
  type ScheduleIndex,
  type StateSnapshot,
  type ValidateResult,
} from "./exec-types.js";
import {
  computeReadyIds,
  foldEventsToState,
  isExecEventV1,
  validateEventShape,
} from "./exec-events.js";
import {
  ensureDir,
  formatDays,
  listFilesRecursive,
  readJson,
  toArtifactPath,
  toScheduleFilePath,
  writeJson,
} from "./exec-shared.js";
import {
  eventsDirForProject,
  executionRootForProject,
  generatedDirForProject,
} from "./exec-project.js";
import {
  buildProgressSummaryLines,
  buildTimelineMarkdown,
  buildTimelineSvg,
} from "./exec-schedule-timeline.js";
import { buildScheduleIndex } from "./exec-schedule-index.js";
import {
  buildTimelineScopeSpecs,
  filterCpmNodes,
  scheduleTrackNames,
} from "./exec-schedule-timeline-scope.js";
import { computeCpm, topoSort } from "./exec-schedule-cpm.js";
import {
  buildReadySnapshot,
  orderReadyIds,
  writeReadyFiles,
  selectNextTask,
} from "./exec-schedule-ready.js";
import { writeScheduleHashAndDiff } from "./exec-schedule-hash.js";
import { buildInitialStateFromStrategy } from "./exec-schedule-initial.js";
import {
  buildPhaseModeIndex,
  resolveAgentPipeline,
  resolveApproach,
  resolveTaskCapabilities,
  resolveTaskExecution,
  resolveTaskMode,
  resolveTaskProficiency,
} from "./exec-strategy.js";

export function findStaleGeneratedTrackWarnings(projectPath: string): string[] {
  const files = listFilesRecursive(projectPath);
  const trackFiles = new Map<string, string>();

  for (const file of files) {
    const match = basename(file).match(/^sch-track-(.+)\.yaml$/);
    if (match) trackFiles.set(match[1], file);
  }

  const warnings: string[] = [];
  for (const strategyFile of files) {
    const match = basename(strategyFile).match(/^sch-strategy-(.+)\.yaml$/);
    if (!match) continue;

    const track = match[1];
    const trackFile = trackFiles.get(track);
    if (!trackFile) {
      warnings.push(
        `${basename(strategyFile)} has no generated sch-track-${track}.yaml. ` +
          `Run: specdojo schedule build --track ${track}`,
      );
      continue;
    }

    if (statSync(strategyFile).mtimeMs > statSync(trackFile).mtimeMs) {
      warnings.push(
        `${basename(strategyFile)} is newer than ${basename(trackFile)}. ` +
          `Run: specdojo schedule build --track ${track} --force before exec refresh.`,
      );
    }
  }

  return warnings;
}

export function validateAll(projectPath: string): ValidateResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const schedule = buildScheduleIndex(projectPath);
  const scheduleIds = new Set<string>(Array.from(schedule.nodes.keys()));

  if (schedule.nodes.size === 0) {
    warnings.push(`No schedule nodes loaded from sch-*.yaml under: ${projectPath}`);
  }
  warnings.push(...findStaleGeneratedTrackWarnings(projectPath));

  for (const node of schedule.nodes.values()) {
    for (const dep of node.depends_on) {
      if (!schedule.nodes.has(dep)) {
        errors.push(`${node.schedule_file}: ${node.id} depends_on missing id: ${dep}`);
      }
    }
  }

  const topo = topoSort(schedule);
  if (topo.cycle && topo.cycle.length) {
    errors.push(`schedule dependency cycle detected (nodes involved): ${topo.cycle.join(", ")}`);
  }

  const eventsDir = eventsDirForProject(projectPath);
  if (!existsSync(eventsDir)) warnings.push(`No exec/events directory: ${eventsDir}`);

  const files = listFilesRecursive(eventsDir).filter((p) => extname(p).toLowerCase() === ".json");
  let parsedEvents = 0;

  for (const f of files) {
    let obj: unknown;
    try {
      obj = readJson(f);
    } catch {
      errors.push(`${f}: failed to parse JSON`);
      continue;
    }
    const shapeErrs = validateEventShape(obj, f);
    errors.push(...shapeErrs);
    if (isExecEventV1(obj, f)) {
      parsedEvents++;
      const ev = obj;
      if (!scheduleIds.has(ev.task_id))
        warnings.push(
          `${f}: task_id ${ev.task_id} not found in current sch-*.yaml; ` +
            `the historical event will be ignored when building state`,
        );
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    stats: {
      events: parsedEvents,
      event_files: files.length,
      schedule_ids: schedule.nodes.size,
      schedule_files: schedule.files.length,
    },
  };
}

export function printValidateResult(res: ValidateResult): void {
  process.stdout.write(res.ok ? "OK: validation passed\n" : "NG: validation failed\n");
  process.stdout.write(
    `stats: events=${res.stats.events}, event_files=${res.stats.event_files}, schedule_ids=${res.stats.schedule_ids}, schedule_files=${res.stats.schedule_files}\n`,
  );
  if (res.warnings.length) {
    process.stdout.write("\nWarnings:\n");
    for (const w of res.warnings) process.stdout.write(`- ${w}\n`);
  }
  if (res.errors.length) {
    process.stdout.write("\nErrors:\n");
    for (const e of res.errors) process.stdout.write(`- ${e}\n`);
  }
}

export function exitWithCode(ok: boolean): void {
  process.exitCode = ok ? 0 : 1;
}

export function writeCpmFiles(
  projectPath: string,
  cpm: CpmResult,
  stateSnapshot?: StateSnapshot,
): void {
  const genDir = generatedDirForProject(projectPath);
  ensureDir(genDir);

  writeJson(join(genDir, "cpm.json"), cpm);

  const rows = Object.values(cpm.nodes).sort((a, b) => a.es - b.es || a.id.localeCompare(b.id));
  const lines: string[] = [];
  lines.push(`# CPM`);
  lines.push("");
  lines.push(`- project_duration_days: \`${formatDays(cpm.project_duration_days)}\``);
  lines.push("");
  lines.push(`| id | owner | kind | dur | ES | EF | LS | LF | slack | depends_on |`);
  lines.push(`|---|---|---:|---:|---:|---:|---:|---:|---:|---|`);
  for (const r of rows) {
    lines.push(
      `| \`${r.id}\` | ${r.owner ?? "-"} | ${r.kind} | ${formatDays(r.duration_days)} | ${formatDays(r.es)} | ${formatDays(r.ef)} | ${formatDays(r.ls)} | ${formatDays(r.lf)} | ${formatDays(r.slack)} | ${r.depends_on.join(", ")} |`,
    );
  }
  lines.push("");
  writeFileSync(join(genDir, "cpm.md"), lines.join("\n"), "utf8");

  const cp: string[] = [];
  cp.push(`# Critical Path`);
  cp.push("");
  cp.push(`- project_duration_days: \`${formatDays(cpm.project_duration_days)}\``);
  cp.push("");
  if (!cpm.critical_path.length) cp.push("_No critical path computed._");
  else {
    cp.push(`Critical path (one path, tie-broken):`);
    cp.push("");
    for (const id of cpm.critical_path) {
      const n = cpm.nodes[id];
      cp.push(
        `- \`${id}\`${n.name ? ` — ${n.name}` : ""} (ES=${formatDays(n.es)}, EF=${formatDays(n.ef)})`,
      );
    }
  }
  cp.push("");
  writeFileSync(join(genDir, "critical-path.md"), cp.join("\n"), "utf8");

  const schedule = buildScheduleIndex(projectPath);
  const allTaskRows = rows.filter((row) => row.kind === "task");
  const tasksState = stateSnapshot?.tasks ?? {};
  const readyAll = computeReadyIds(schedule, {
    schedule_path: cpm.schedule_path,
    tasks: tasksState,
  });
  const readyOrderedAll = orderReadyIds(readyAll, cpm, "critical-first");

  const stateOf = (id: string): "todo" | "doing" | "blocked" | "done" | "cancelled" =>
    stateSnapshot?.tasks[id]?.state ?? "todo";

  for (const scope of buildTimelineScopeSpecs(cpm)) {
    // SVG: scope の描画対象ノードだけを持つ CpmResult（full は cpm そのまま）。
    const renderCpm = scope.renderIds
      ? filterCpmNodes(cpm, scope.renderIds, scope.keepCriticalPath)
      : cpm;

    // 進捗サマリー: scope の母集団（track なら track の task、full/milestones は全 task）。
    const progressCpm = scope.progressIds
      ? filterCpmNodes(cpm, scope.progressIds, scope.keepCriticalPath)
      : cpm;
    const progressTaskRows = scope.progressIds
      ? allTaskRows.filter((row) => scope.progressIds!.has(row.id))
      : allTaskRows;

    const stateCounts: Record<"todo" | "doing" | "blocked" | "done" | "cancelled", number> = {
      todo: 0,
      doing: 0,
      blocked: 0,
      done: 0,
      cancelled: 0,
    };
    for (const row of progressTaskRows) stateCounts[stateOf(row.id)] += 1;

    const doneCount = stateCounts.done;
    const totalTaskCount = progressTaskRows.length;
    const progressPercent =
      totalTaskCount > 0 ? ((doneCount / totalTaskCount) * 100).toFixed(1) : "0.0";

    const readyScope = scope.progressIds
      ? readyAll.filter((id) => scope.progressIds!.has(id))
      : readyAll;
    const nextTaskId =
      (scope.progressIds
        ? readyOrderedAll.filter((id) => scope.progressIds!.has(id))
        : readyOrderedAll)[0] ?? null;

    const progressCriticalSet = new Set(progressCpm.critical_path);
    const criticalDoingCount = progressTaskRows.filter(
      (row) => progressCriticalSet.has(row.id) && stateOf(row.id) === "doing",
    ).length;

    const progressSummaryLines = buildProgressSummaryLines({
      cpm: progressCpm,
      schedule,
      stateCounts,
      totalTaskCount,
      readyCount: readyScope.length,
      nextTaskId,
      criticalDoingCount,
    });

    writeFileSync(
      join(genDir, `${scope.fileBase}.svg`),
      buildTimelineSvg(renderCpm, schedule, stateSnapshot, { title: scope.title }),
      "utf8",
    );
    writeFileSync(
      join(genDir, `${scope.fileBase}.md`),
      buildTimelineMarkdown(
        progressCpm,
        {
          criticalPathTaskCount: new Set(renderCpm.critical_path).size,
          progressPercent,
          doneTasks: `${doneCount}/${totalTaskCount}`,
          taskStateCounts: `todo=${stateCounts.todo}, doing=${stateCounts.doing}, blocked=${stateCounts.blocked}, done=${stateCounts.done}, cancelled=${stateCounts.cancelled}`,
          progressSummaryLines,
        },
        {
          title: scope.title,
          svgFileName: `${scope.fileBase}.svg`,
          scopeLabel: scope.scopeLabel,
        },
      ),
      "utf8",
    );
  }
}

export function writeGeneratedCore(
  projectPath: string,
  events: { path: string; event: ExecEventV1 }[],
  schedule: ScheduleIndex,
  cpm: CpmResult | null,
): StateSnapshot {
  const genDir = generatedDirForProject(projectPath);
  ensureDir(genDir);

  const jsonl = events.map((x) => JSON.stringify(x.event)).join("\n") + (events.length ? "\n" : "");
  writeFileSync(join(genDir, "exec.jsonl"), jsonl, "utf8");

  const initialTasks = buildInitialStateFromStrategy(projectPath, schedule);
  const snapshot = foldEventsToState(events, schedule, projectPath, initialTasks);
  writeJson(join(genDir, "state.json"), snapshot);

  const ready = computeReadyIds(schedule, snapshot);
  const readySnapshot = buildReadySnapshot(projectPath, schedule, ready, cpm);
  const phaseModeIndex = buildPhaseModeIndex(projectPath);
  for (const task of readySnapshot.tasks) {
    task.mode = resolveTaskMode(
      task.local_id,
      task.id,
      phaseModeIndex,
      task.phase_suffix,
      task.phase_set,
    );
    task.execution = resolveTaskExecution(
      task.local_id,
      task.id,
      phaseModeIndex,
      task.phase_suffix,
      task.phase_set,
    );
    task.approach = resolveApproach(
      task.local_id,
      task.id,
      phaseModeIndex,
      task.phase_suffix,
      task.phase_set,
    );
    const capabilities = resolveTaskCapabilities(
      task.local_id,
      task.id,
      phaseModeIndex,
      task.phase_suffix,
      task.phase_set,
    );
    if (capabilities.length > 0) task.capabilities = capabilities;
    const proficiency = resolveTaskProficiency(
      task.local_id,
      task.id,
      phaseModeIndex,
      task.phase_suffix,
      task.phase_set,
    );
    if (proficiency !== undefined) task.proficiency = proficiency;
    const agentPipeline = resolveAgentPipeline(
      task.local_id,
      task.id,
      phaseModeIndex,
      task.phase_suffix,
      task.phase_set,
    );
    if (agentPipeline !== undefined) task.agent_pipeline = agentPipeline;
  }
  writeReadyFiles(projectPath, readySnapshot);

  const timelineFiles = ["timeline", "timeline-milestones"]
    .concat(scheduleTrackNames(schedule).map((track) => `timeline-track-${track}`))
    .flatMap((base) => [`${base}.md`, `${base}.svg`]);

  writeJson(join(genDir, "metadata.json"), {
    schedule_path: toArtifactPath(projectPath),
    execution_path: toArtifactPath(executionRootForProject(projectPath)),
    generated_dir: toArtifactPath(genDir),
    schedule_files: schedule.files.map((p) => toScheduleFilePath(projectPath, p)).sort(),
    event_files_count: events.length,
    default_scheduler_strategy: "critical-first",
    derived_files: [
      "claim-next.json",
      "cpm.json",
      "cpm.md",
      "critical-path.md",
      "exec.jsonl",
      "metadata.json",
      "ready.json",
      "ready.md",
      "schedule-diff.md",
      "schedule-hash.json",
      "state.json",
      ...timelineFiles,
    ].sort(),
  });

  return snapshot;
}

export { buildScheduleIndex, computeCpm, selectNextTask, writeScheduleHashAndDiff };
