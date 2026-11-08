import { mkdirSync, existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import type { Command } from "commander";
import type { ExecEventV1, ReadyTaskView, StateSnapshot } from "../exec/types.js";
import { toArtifactPath } from "../shared/artifact-path.js";
import { listFilesRecursive, readJson } from "../shared/fs.js";
import {
  getProjectExecutionPath,
  getProjectCatalogPath,
  getProjectRegisterPath,
  getProjectRoutinesPath,
  getProjectSchedulePath,
  getProjectTimelinePath,
  loadConfig,
  loadEnv,
  specdojoRootDir,
} from "../shared/specdojo-config.js";
import type { SpecDojoProjectConfig } from "../shared/specdojo-config.js";
import {
  resolveRegisterPaths,
  loadRegisterItems,
  TERMINAL_STATUSES_SET,
  type PjrItem,
  type RegisterItemView,
  type RegisterPaths,
} from "../register/register.js";
import {
  readRegisterEventsFromContent,
  registerEventFilePath,
  type RegisterEventV1,
} from "../register/events.js";
import {
  loadTimelineIndex,
  buildTimeline,
  renderCatalogScaffoldMarkdown,
} from "./timeline-build.js";
import { loadEpicSchedules } from "./epic-plan.js";
import { resolveRegisterDateTimeZone } from "../register/date.js";
import {
  buildTimelineGanttSvg,
  computeTimelineTrackSchedules,
  resolveDashboardCalendar,
} from "./dashboard-timeline.js";
import {
  aggregateRoutines,
  buildDailyRoutineRows,
  formatZonedDateTime,
  zonedDateKey,
} from "./routines.js";
import { buildExecRecordsMarkdown, collectExecRecords, EXEC_RECORDS_FILE } from "./exec-records.js";
import { sanitizeDashboardCell } from "./shared.js";
import { gradeFindingCount, parseGradeResult, type GradeResult } from "../grade/result.js";
import { load } from "../shared/yaml.js";
import type { DctDoc } from "../catalog/types.js";
import { isDctCatalogFileName } from "../catalog/types.js";
import {
  collectResolvedDeliverables,
  type ResolvedDeliverable,
} from "../catalog/build-references.js";
import { resolveBasePath } from "../catalog/paths.js";
import { extractLocalId } from "../schedule/phase-sets.js";
import { buildScheduleIndex } from "../exec/schedule/schedule.js";
import { type ScheduleNode } from "../shared/schedule-index.js";
import { readReadySnapshot } from "../exec/schedule/ready.js";
import { findRunRecord } from "../shared/run-records.js";

// ================================
// Types
// ================================

function generatedBanner(command: string): string {
  return `> このページは \`${command}\` が生成した派生ビューです。正本は Schedule / epic を含む登録簿個票・event / exec event / routine 定義（rtn-*.yaml）と端末側の状態・履歴（routine-state.json・routine-runs.jsonl）であり、このページを手編集しても次回のビルドで失われます。`;
}

export type DashboardPaths = {
  projectId: string;
  projectPath: string;
  schedulePath?: string;
  timelinePath: string;
  catalogPath?: string | null;
  repoRoot?: string;
  registerPath?: string;
  registerDateTimeZone?: string;
  executionGeneratedPath: string;
  routinesPath?: string;
  gradeResultsPath?: string;
};

// ================================
// Path resolution
// ================================

function resolveProjectConfig(opts: { project?: string }): {
  projectId: string;
  project: SpecDojoProjectConfig;
} {
  loadEnv();
  const { config, configPath } = loadConfig();
  const resolvedId =
    opts.project?.trim() ||
    process.env.SPECDOJO_PROJECT?.trim() ||
    (config ? Object.keys(config.projects)[0] : "");

  if (!config) {
    throw new Error(`dashboard commands require specdojo.config.json.\nRun: specdojo config init`);
  }
  if (!resolvedId) {
    throw new Error("No project specified. Use --project <id> or SPECDOJO_PROJECT.");
  }
  const project = config.projects[resolvedId];
  if (!project) {
    throw new Error(`Unknown project: ${resolvedId} (check ${configPath})`);
  }

  return { projectId: resolvedId, project };
}

export function resolveDashboardPaths(opts: { project?: string }): DashboardPaths {
  const { projectId, project } = resolveProjectConfig(opts);
  const baseDir = specdojoRootDir();

  return {
    projectId,
    projectPath: join(baseDir, project.base_path ?? ""),
    catalogPath: getProjectCatalogPath(project)
      ? join(baseDir, getProjectCatalogPath(project)!)
      : null,
    repoRoot: baseDir,
    registerPath: getProjectRegisterPath(project)
      ? join(baseDir, getProjectRegisterPath(project)!)
      : undefined,
    registerDateTimeZone: resolveRegisterDateTimeZone(loadConfig().config, projectId),
    schedulePath: join(baseDir, getProjectSchedulePath(project)),
    executionGeneratedPath: join(join(baseDir, getProjectExecutionPath(project)), "generated"),
    timelinePath: join(baseDir, getProjectTimelinePath(project)),
    routinesPath: (() => {
      const p = getProjectRoutinesPath(project);
      return p ? join(baseDir, p) : undefined;
    })(),
    gradeResultsPath: join(baseDir, getProjectExecutionPath(project), "grade", "results"),
  };
}

export { buildTimelineGanttSvg, computeTimelineTrackSchedules, resolveDashboardCalendar };
export type { TimelineTrackSchedule } from "./dashboard-timeline.js";

const EXECUTABLE_REGISTER_TYPES = new Set(["todo", "issue", "change-request", "question", "risk"]);
const PRIORITY_RANK: Record<string, number> = { high: 0, medium: 1, low: 2 };

export type DashboardRegisterCandidate = {
  id: string;
  title: string;
  type: string;
  priority: string;
  due: string;
  registeredAt: string;
  relatedOpenPjrCount: number;
  ticketPath?: string;
  dependsOn?: string[];
};

export type DashboardActionRequiredRow = {
  kind: string;
  id: string;
  link: string;
  nextAction: string;
};

export function buildCatalogDocMap(catalogPath?: string | null): Map<string, string> {
  const map = new Map<string, string>();
  if (!catalogPath || !existsSync(catalogPath)) return map;
  try {
    const files = readdirSync(catalogPath).filter(isDctCatalogFileName).sort();
    for (const f of files) {
      const filePath = join(catalogPath, f);
      try {
        const doc = load(readFileSync(filePath, "utf8")) as DctDoc;
        if (!doc || !Array.isArray(doc.groups)) continue;
        const deliverables: ResolvedDeliverable[] = [];
        collectResolvedDeliverables(doc.groups, resolveBasePath("", doc.base_path), deliverables);
        for (const { item, resolvedPath } of deliverables) {
          if (item.path) {
            map.set(item.local_id, resolvedPath);
          }
        }
      } catch {
        // ignore malformed catalog
      }
    }
  } catch {
    // ignore directory read error
  }
  return map;
}

export function formatTicketLink(
  view: { id: string; ticketPath?: string },
  generatedDir: string,
): string {
  if (view.ticketPath && existsSync(view.ticketPath)) {
    const rel = relative(generatedDir, view.ticketPath).replaceAll("\\", "/");
    return `[${view.id}](${rel})`;
  }
  return `\`${view.id}\``;
}

export function formatTaskLink(
  taskId: string,
  paths: DashboardPaths,
  catalogDocMap: Map<string, string>,
): string {
  const execDir = join(paths.executionGeneratedPath, "..");
  if (paths.schedulePath && existsSync(execDir)) {
    try {
      const plan = findRunRecord(execDir, "plan", taskId);
      if (plan && existsSync(plan)) {
        const rel = relative(paths.executionGeneratedPath, plan).replaceAll("\\", "/");
        return `[${taskId}](${rel})`;
      }
      const result = findRunRecord(execDir, "result", taskId);
      if (result && existsSync(result)) {
        const rel = relative(paths.executionGeneratedPath, result).replaceAll("\\", "/");
        return `[${taskId}](${rel})`;
      }
    } catch {
      // ignore run record lookup error
    }
  }
  const localId = extractLocalId(taskId);
  if (localId && catalogDocMap.has(localId)) {
    const docRel = catalogDocMap.get(localId)!;
    const docFull = join(paths.repoRoot ?? specdojoRootDir(), docRel);
    if (existsSync(docFull)) {
      const rel = relative(paths.executionGeneratedPath, docFull).replaceAll("\\", "/");
      return `[${taskId}](${rel})`;
    }
  }
  return `\`${taskId}\``;
}

function dateOnlyMs(value: string): number | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const time = Date.parse(`${value}T00:00:00Z`);
  return Number.isNaN(time) ? undefined : time;
}

export function rankRegisterCandidates(
  candidates: DashboardRegisterCandidate[],
  today: string,
): DashboardRegisterCandidate[] {
  const todayMs = dateOnlyMs(today) ?? 0;
  const dueRank = (item: DashboardRegisterCandidate): number => dateOnlyMs(item.due) ?? Infinity;
  const registeredRank = (item: DashboardRegisterCandidate): number =>
    Date.parse(item.registeredAt) || Infinity;

  return [...candidates].sort((a, b) => {
    const aDue = dueRank(a);
    const bDue = dueRank(b);
    const aOverdue = aDue < todayMs ? 0 : 1;
    const bOverdue = bDue < todayMs ? 0 : 1;
    return (
      aOverdue - bOverdue ||
      aDue - bDue ||
      (PRIORITY_RANK[a.priority] ?? 99) - (PRIORITY_RANK[b.priority] ?? 99) ||
      Number(a.relatedOpenPjrCount > 0) - Number(b.relatedOpenPjrCount > 0) ||
      registeredRank(a) - registeredRank(b) ||
      a.id.localeCompare(b.id)
    );
  });
}

function pjrLinks(content: string): string[] {
  return [
    ...content.matchAll(/\[\[[^\]\n|]*:pjr-([0-9a-z]{4})(?:-[^\]\n|]*)?(?:\|[^\]\n]*)?\]\]/gi),
  ].map((match) => `PJR-${match[1].toUpperCase()}`);
}

export function buildRegisterCandidates(
  paths: ReturnType<typeof resolveRegisterPaths>,
): DashboardRegisterCandidate[] {
  const views = loadRegisterItems(paths);
  const itemMap = new Map<string, PjrItem>(views.map((v) => [v.id, v.item]));
  const openIds = new Set(
    views.filter((view) => view.item.status === "open").map((view) => view.id),
  );
  return views
    .filter((view) => {
      const status: string = view.item.status;
      // 1. deferred, rejected, 終端（done, decided）の除外
      if (status === "deferred" || TERMINAL_STATUSES_SET.has(status)) {
        return false;
      }
      // 2. open かつ着手可能タイプ
      if (status !== "open" || !EXECUTABLE_REGISTER_TYPES.has(view.item.type)) {
        return false;
      }
      // 3. 先行の項目（depends_on）がすべて終わり（done または decided）
      const deps = view.item.dependsOn ?? [];
      for (const depId of deps) {
        const depItem = itemMap.get(depId);
        if (!depItem || (depItem.status !== "done" && depItem.status !== "decided")) {
          return false;
        }
      }
      return true;
    })
    .map((view) => {
      const links = view.ticketPath
        ? pjrLinks(readFileSync(view.ticketPath, "utf8")).filter(
            (id) => id !== view.id && openIds.has(id),
          )
        : [];
      return {
        id: view.id,
        title: view.item.title,
        type: view.item.type,
        priority: view.item.priority,
        due: view.item.due,
        registeredAt: view.item.registeredAt,
        relatedOpenPjrCount: new Set(links).size,
        ticketPath: view.ticketPath,
        dependsOn: view.item.dependsOn,
      };
    });
}

export function latestRegisterWaitReason(events: RegisterEventV1[]): string | undefined {
  return [...events].reverse().find((event) => event.action === "wait")?.reason;
}

export function latestExecBlockReasons(
  blockedIds: Iterable<string>,
  events: ExecEventV1[],
): Map<string, string> {
  const blocked = new Set(blockedIds);
  const reasons = new Map<string, string>();
  for (const event of events) {
    if (blocked.has(event.task_id) && event.type === "block") reasons.set(event.task_id, event.msg);
  }
  return reasons;
}

function readRegisterEvents(view: RegisterItemView, registerPath: string): RegisterEventV1[] {
  const path = registerEventFilePath(registerPath, view.id);
  if (!existsSync(path)) return [];
  return readRegisterEventsFromContent(readFileSync(path, "utf8"), path);
}

export function aggregateActionRequired(
  paths: DashboardPaths,
  views: RegisterItemView[],
  catalogDocMap: Map<string, string>,
): DashboardActionRequiredRow[] {
  const rows: DashboardActionRequiredRow[] = [];
  const registerPath =
    paths.registerPath ?? join(paths.projectPath, "controls", "project-register");

  // 1. review の項目（close の確認待ち）
  for (const view of views.filter((v) => v.item.status === "review")) {
    rows.push({
      kind: "review",
      id: view.id,
      link: formatTicketLink(view, paths.executionGeneratedPath),
      nextAction: "close の確認待ち",
    });
  }

  // 2. 人の判断を待つ open の decision・question
  for (const view of views.filter(
    (v) => v.item.status === "open" && (v.item.type === "decision" || v.item.type === "question"),
  )) {
    rows.push({
      kind: view.item.type,
      id: view.id,
      link: formatTicketLink(view, paths.executionGeneratedPath),
      nextAction:
        view.item.type === "decision" ? "意思決定を行い状態を更新" : "回答・判断を行い状態を更新",
    });
  }

  // 3. waiting の項目
  for (const view of views.filter((v) => v.item.status === "waiting")) {
    const waitReason = latestRegisterWaitReason(readRegisterEvents(view, registerPath));
    rows.push({
      kind: "waiting",
      id: view.id,
      link: formatTicketLink(view, paths.executionGeneratedPath),
      nextAction: waitReason
        ? `待機理由を解消: ${sanitizeDashboardCell(waitReason)}`
        : "待機理由の解消",
    });
  }

  // 4. 人が行う schedule のタスク（execution が human のもの）
  if (paths.schedulePath && existsSync(paths.executionGeneratedPath)) {
    const readyPath = join(paths.executionGeneratedPath, "ready.json");
    const statePath = join(paths.executionGeneratedPath, "state.json");
    const humanTaskIds = new Set<string>();

    if (existsSync(readyPath)) {
      try {
        const ready = readReadySnapshot(readyPath);
        for (const task of ready.tasks) {
          if (task.execution === "human") {
            humanTaskIds.add(task.id);
            rows.push({
              kind: "human",
              id: task.id,
              link: formatTaskLink(task.id, paths, catalogDocMap),
              nextAction: task.name
                ? `${sanitizeDashboardCell(task.name)}を実施`
                : "人手による作業を実施",
            });
          }
        }
      } catch {
        // ignore ready.json read error
      }
    }

    if (existsSync(statePath)) {
      try {
        const state = readJson(statePath) as StateSnapshot;
        for (const [taskId, taskState] of Object.entries(state.tasks)) {
          if (
            (taskState.state === "doing" || taskState.state === "blocked") &&
            !humanTaskIds.has(taskId)
          ) {
            rows.push({
              kind: taskState.state === "blocked" ? "blocked" : "human",
              id: taskId,
              link: formatTaskLink(taskId, paths, catalogDocMap),
              nextAction:
                taskState.state === "blocked"
                  ? `ブロッキング原因を解消: ${sanitizeDashboardCell(taskState.last_msg ?? "-")}`
                  : "作業の継続・完了",
            });
          }
        }
      } catch {
        // ignore state.json read error
      }
    }
  }

  return rows;
}

export {
  buildDailyRoutineRows,
  collapseFrequentRoutineRows,
  computeRoutineDue,
  formatZonedDateTime,
  readRoutineRunHistory,
} from "./routines.js";
export type {
  DashboardDailyRoutineRow,
  DashboardRoutineRow,
  DashboardRoutineStateEntry,
} from "./routines.js";

// ================================
// Markdown rendering
// ================================

export { sanitizeDashboardCell };

const STATUS_ORDER = [
  "open",
  "in-progress",
  "waiting",
  "review",
  "decided",
  "done",
  "deferred",
  "rejected",
];
const PRIORITY_ORDER = ["high", "medium", "low"];

function countTable(
  keyLabel: string,
  counts: Record<string, number>,
  order: readonly string[],
): string {
  const orderedKeys = Object.keys(counts)
    .sort((a, b) => {
      const ai = order.indexOf(a);
      const bi = order.indexOf(b);
      const rankA = ai === -1 ? order.length : ai;
      const rankB = bi === -1 ? order.length : bi;
      return rankA !== rankB ? rankA - rankB : a.localeCompare(b);
    })
    .filter((key) => counts[key] > 0);

  if (orderedKeys.length === 0) return "（該当項目なし）";

  const lines: string[] = [];
  lines.push(`| ${keyLabel} | 件数 |`);
  lines.push("| --- | ---: |");
  for (const key of orderedKeys) lines.push(`| \`${key}\` | ${counts[key]} |`);

  return lines.join("\n");
}

function dashboardEpicPlan(paths: DashboardPaths) {
  return loadEpicSchedules({
    registerPath: paths.registerPath ?? join(paths.projectPath, "controls", "project-register"),
    projectId: paths.projectId,
    calendar: resolveDashboardCalendar(paths.schedulePath ?? paths.projectPath),
    timeZone: paths.registerDateTimeZone ?? "UTC",
  });
}

export function readDashboardGradeResults(resultsPath: string): GradeResult[] {
  if (!existsSync(resultsPath)) return [];
  return listFilesRecursive(resultsPath)
    .filter((path) => path.endsWith(".yaml") || path.endsWith(".yml"))
    .sort()
    .flatMap((path) => {
      try {
        return [parseGradeResult(readFileSync(path, "utf8"), path)];
      } catch {
        return [];
      }
    });
}

// ================================
// Section renderers (Action-first layout)
// ================================

function renderActionRequiredSection(
  paths: DashboardPaths,
  views: RegisterItemView[],
  catalogDocMap: Map<string, string>,
): string[] {
  const lines = ["## 1. 人の対応が要るもの", ""];
  const rows = aggregateActionRequired(paths, views, catalogDocMap);
  if (rows.length === 0) {
    lines.push("- ありません", "");
    return lines;
  }

  lines.push("| 種別 | 項目 | 次にすること |");
  lines.push("| --- | --- | --- |");
  for (const row of rows) {
    lines.push(`| \`${row.kind}\` | ${row.link} | ${sanitizeDashboardCell(row.nextAction)} |`);
  }
  lines.push("");
  return lines;
}

function getRegisterPathsForDashboard(paths: DashboardPaths): RegisterPaths | null {
  if (paths.registerPath) {
    return {
      projectId: paths.projectId,
      projectRegisterPath: paths.registerPath,
      pjrIndexPath: join(paths.registerPath, "pjr-index.md"),
      generatedPath: join(paths.registerPath, "generated"),
      controlsGeneratedPath: join(paths.registerPath, "generated"),
      registerDateTimeZone: paths.registerDateTimeZone ?? "UTC",
    };
  }
  try {
    return resolveRegisterPaths({ project: paths.projectId });
  } catch {
    return null;
  }
}

function renderRecommendedRegisterSection(
  paths: DashboardPaths,
  _views: RegisterItemView[],
): string[] {
  const lines = ["## 2. おすすめの登録項目", ""];
  let rows: DashboardRegisterCandidate[] = [];
  const today = zonedDateKey(new Date(), paths.registerDateTimeZone ?? "UTC");
  try {
    const regPaths = getRegisterPathsForDashboard(paths);
    if (regPaths) {
      rows = rankRegisterCandidates(buildRegisterCandidates(regPaths), today).slice(0, 10);
    }
  } catch {
    rows = [];
  }
  if (rows.length === 0) {
    lines.push("- ありません", "");
    return lines;
  }
  lines.push("| 順位 | id | type | title | 期日 | 優先度 | 関連 open PJR | 登録日時 | 理由 |");
  lines.push("| ---: | --- | --- | --- | --- | --- | ---: | --- | --- |");
  const todayMs = dateOnlyMs(today) ?? 0;
  rows.forEach((row, index) => {
    const dueMs = dateOnlyMs(row.due);
    const dueReason =
      dueMs === undefined
        ? "期日なし"
        : dueMs < todayMs
          ? `期日超過 ${Math.ceil((todayMs - dueMs) / 86_400_000)}日`
          : `期日まで ${Math.ceil((dueMs - todayMs) / 86_400_000)}日`;
    const link = formatTicketLink(
      { id: row.id, ticketPath: row.ticketPath },
      paths.executionGeneratedPath,
    );
    lines.push(
      `| ${index + 1} | ${link} | \`${row.type}\` | ${sanitizeDashboardCell(row.title)} | ${row.due} | \`${row.priority}\` | ${row.relatedOpenPjrCount} | ${row.registeredAt} | ${dueReason}、優先度 ${row.priority}、関連 open PJR ${row.relatedOpenPjrCount}件 |`,
    );
  });
  lines.push("");
  return lines;
}

function renderActiveEpicsSection(
  paths: DashboardPaths,
  views: RegisterItemView[],
  catalogDocMap: Map<string, string>,
): string[] {
  const lines = ["## 3. 実行中の epic", ""];
  const activeEpics = views.filter(
    (v) => v.item.type === "epic" && (v.item.status === "open" || v.item.status === "in-progress"),
  );

  if (activeEpics.length === 0) {
    lines.push("- ありません", "");
    return lines;
  }

  let scheduleNodes: Map<string, ScheduleNode> = new Map();
  if (paths.schedulePath && existsSync(paths.schedulePath)) {
    try {
      const schedule = buildScheduleIndex(paths.schedulePath);
      scheduleNodes = schedule.nodes;
    } catch {
      // ignore
    }
  }

  let readyTasks: ReadyTaskView[] = [];
  if (existsSync(join(paths.executionGeneratedPath, "ready.json"))) {
    try {
      const ready = readReadySnapshot(join(paths.executionGeneratedPath, "ready.json"));
      readyTasks = ready.tasks;
    } catch {
      // ignore
    }
  }

  let state: StateSnapshot | undefined;
  if (existsSync(join(paths.executionGeneratedPath, "state.json"))) {
    try {
      state = readJson(join(paths.executionGeneratedPath, "state.json")) as StateSnapshot;
    } catch {
      // ignore
    }
  }

  for (const epic of activeEpics) {
    const epicLink = formatTicketLink(epic, paths.executionGeneratedPath);
    lines.push(`### ${epicLink} ${sanitizeDashboardCell(epic.item.title)}`, "");
    const track = epic.item.track;
    lines.push(`- track: \`${track ?? "-"}\``);

    if (track && scheduleNodes.size > 0) {
      const trackTasks = [...scheduleNodes.values()].filter(
        (node) =>
          node.kind === "task" &&
          (node.schedule_file.includes(`sch-track-${track}.yaml`) ||
            node.id.startsWith(`T-${track.toUpperCase()}-`)),
      );
      if (trackTasks.length > 0) {
        const stages: Array<{ name: string; total: number; done: number }> = [];
        const stageIndex = new Map<string, number>();

        for (const task of trackTasks) {
          const stageName = task.name || task.phase_id || task.phase_set || "作業";
          let idx = stageIndex.get(stageName);
          if (idx === undefined) {
            idx = stages.length;
            stageIndex.set(stageName, idx);
            stages.push({ name: stageName, total: 0, done: 0 });
          }
          stages[idx].total++;
          if (state?.tasks[task.id]?.state === "done") {
            stages[idx].done++;
          }
        }

        const stageStr = stages.map((s) => `${s.name} ${s.done}/${s.total}`).join(", ");
        lines.push(`- 段ごとの進捗: ${stageStr}`);
      } else {
        lines.push("- 段ごとの進捗: schedule 未登録");
      }
    } else {
      lines.push("- 段ごとの進捗: schedule 未登録");
    }

    if (track && readyTasks.length > 0) {
      const nextForTrack = readyTasks
        .filter(
          (t) =>
            t.schedule_file?.includes(`sch-track-${track}.yaml`) ||
            t.id.startsWith(`T-${track.toUpperCase()}-`),
        )
        .slice(0, 3);
      if (nextForTrack.length > 0) {
        lines.push("- 次に流せるタスク:");
        for (const t of nextForTrack) {
          lines.push(`  - ${formatTaskLink(t.id, paths, catalogDocMap)}`);
        }
      } else {
        lines.push("- 次に流せるタスク: なし");
      }
    } else {
      lines.push("- 次に流せるタスク: なし");
    }

    const children = views.filter((v) => v.item.derivedFrom?.includes(epic.id));
    const openChildren = children.filter((v) => !TERMINAL_STATUSES_SET.has(v.item.status));
    const doneChildren = children.filter((v) => TERMINAL_STATUSES_SET.has(v.item.status));

    if (children.length === 0) {
      lines.push("- 子の項目: なし");
    } else {
      lines.push("- 子の項目:");
      if (openChildren.length > 0) {
        for (const child of openChildren) {
          const childLink = formatTicketLink(child, paths.executionGeneratedPath);
          lines.push(
            `  - ${childLink} (\`${child.item.status}\`): ${sanitizeDashboardCell(child.item.title)}`,
          );
        }
      } else {
        lines.push("  - （未完了の項目はありません）");
      }

      if (doneChildren.length > 0) {
        lines.push("");
        lines.push(`::: details 完了した子項目（${doneChildren.length}件）`);
        lines.push("");
        for (const child of doneChildren) {
          const childLink = formatTicketLink(child, paths.executionGeneratedPath);
          lines.push(
            `- ${childLink} (\`${child.item.status}\`): ${sanitizeDashboardCell(child.item.title)}`,
          );
        }
        lines.push("");
        lines.push(":::");
      }
    }

    lines.push("");
  }

  return lines;
}

function renderCompletedEpicsSection(paths: DashboardPaths, views: RegisterItemView[]): string[] {
  const lines = ["## 4. 終わった epic", ""];
  const completedEpics = views.filter(
    (v) => v.item.type === "epic" && TERMINAL_STATUSES_SET.has(v.item.status),
  );

  if (completedEpics.length === 0) {
    lines.push("- ありません", "");
    return lines;
  }

  lines.push(`::: details 終わった epic の一覧（${completedEpics.length}件）`);
  lines.push("");
  lines.push("| id | title | track | 終了日 |");
  lines.push("| --- | --- | --- | --- |");
  for (const epic of completedEpics) {
    const epicLink = formatTicketLink(epic, paths.executionGeneratedPath);
    const completedDate = epic.item.completedAt ? epic.item.completedAt.slice(0, 10) : "-";
    lines.push(
      `| ${epicLink} | ${sanitizeDashboardCell(epic.item.title)} | \`${epic.item.track ?? "-"}\` | ${completedDate} |`,
    );
  }
  lines.push("");
  lines.push(":::");
  lines.push("");
  return lines;
}

function renderRoutineSection(paths: DashboardPaths): string[] {
  const lines = ["## 5. routine", ""];
  const agg = aggregateRoutines(paths.routinesPath, paths.repoRoot);

  if (agg.error) lines.push(`- routine 集計に失敗しました: ${agg.error}`);
  if (agg.rows.length === 0) {
    lines.push("- ありません", "");
    return lines;
  }

  const now = new Date();
  const cutoff24h = now.getTime() - 24 * 60 * 60 * 1000;
  const recentFailures = agg.history.filter((h) => {
    const t = Date.parse(h.completed_at || h.started_at);
    return !Number.isNaN(t) && t >= cutoff24h && h.result === "failure";
  });

  if (recentFailures.length === 0) {
    lines.push("- 直近 24 時間に失敗した routine はありません。");
  } else {
    lines.push("### 直近 24 時間に失敗した routine");
    lines.push("");
    lines.push("| routine | 実行時刻 | 結果 | Job Run |");
    lines.push("| --- | --- | --- | --- |");
    for (const f of recentFailures) {
      lines.push(
        `| \`${f.routine_id}\` | ${f.completed_at || f.started_at} | \`${f.result}\` | ${f.job_run_ids.map((id) => `\`${id}\``).join(", ") || "-"} |`,
      );
    }
    lines.push("");
  }

  // 次に動くもの
  const dailyRows = buildDailyRoutineRows(agg.docs, agg.history, now);
  const futureRuns = dailyRows.filter(
    (r) => r.day === "本日" && r.result === "予定" && Date.parse(r.scheduledFor) >= now.getTime(),
  );
  if (futureRuns.length > 0) {
    const next = futureRuns[0];
    lines.push(
      `- 次に動くもの: \`${next.routineId}\`（予定: ${formatZonedDateTime(next.scheduledFor, "Asia/Tokyo")}）`,
    );
  } else {
    lines.push("- 次に動くもの: 予定なし");
  }
  lines.push("");

  lines.push(`::: details routine 定義一覧（${agg.rows.length}件）`);
  lines.push("");
  lines.push("| id | name | enabled | 間隔 / cron | kind | 最終実行 / 結果 | due |");
  lines.push("| --- | --- | --- | --- | --- | --- | :---: |");
  for (const row of agg.rows) {
    lines.push(
      `| \`${row.id}\` | ${sanitizeDashboardCell(row.name ?? "-")} | ${row.enabled ? "enabled" : "disabled"} | \`${sanitizeDashboardCell(row.schedule)}\` | \`${row.kind}\` | ${sanitizeDashboardCell(row.lastRun)} | ${row.due} |`,
    );
  }
  lines.push("");
  lines.push(":::");
  lines.push("");

  return lines;
}

function renderGradeSection(paths: DashboardPaths): string[] {
  const lines = ["## 6. Grade", ""];
  const results = paths.gradeResultsPath ? readDashboardGradeResults(paths.gradeResultsPath) : [];
  if (results.length === 0) {
    lines.push("- ありません", "");
    return lines;
  }

  const verdictCounts: Record<string, number> = {};
  for (const r of results) {
    verdictCounts[r.verdict] = (verdictCounts[r.verdict] ?? 0) + 1;
  }
  const verdictSummary = Object.entries(verdictCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([v, count]) => `${v}=${count}`)
    .join(", ");
  lines.push(`- verdict 別件数: \`${verdictSummary}\``);
  lines.push("");

  const lowest5 = [...results]
    .sort((a, b) => a.score - b.score || a.document.localeCompare(b.document))
    .slice(0, 5);

  lines.push("### 点の低い 5 件");
  lines.push("");
  lines.push("| 成果物 | 対象 | verdict | score | findings |");
  lines.push("| --- | --- | --- | ---: | ---: |");
  for (const r of lowest5) {
    lines.push(
      `| \`${sanitizeDashboardCell(r.document)}\` | \`${r.target}\` | \`${r.verdict}\` | ${r.score} | ${gradeFindingCount(r)} |`,
    );
  }
  lines.push("");

  lines.push(`::: details 全体の表（${results.length}件）`);
  lines.push("");
  lines.push("| 成果物 | 対象 | verdict | score | findings |");
  lines.push("| --- | --- | --- | ---: | ---: |");
  for (const r of results) {
    lines.push(
      `| \`${sanitizeDashboardCell(r.document)}\` | \`${r.target}\` | \`${r.verdict}\` | ${r.score} | ${gradeFindingCount(r)} |`,
    );
  }
  lines.push("");
  lines.push(":::");
  lines.push("");

  return lines;
}

function renderScheduleSectionContent(paths: DashboardPaths): string[] {
  const lines: string[] = [];

  if (!existsSync(paths.executionGeneratedPath)) {
    lines.push("- Schedule はまだ生成されていません。");
    lines.push("");
    return lines;
  }

  try {
    const state = existsSync(join(paths.executionGeneratedPath, "state.json"))
      ? (readJson(join(paths.executionGeneratedPath, "state.json")) as StateSnapshot)
      : undefined;

    if (state) {
      const counts: Record<string, number> = {
        todo: 0,
        doing: 0,
        blocked: 0,
        done: 0,
        cancelled: 0,
      };
      for (const taskState of Object.values(state.tasks)) {
        const s = taskState.state;
        if (s in counts) counts[s] += 1;
      }
      const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
      const doneEquivalent = counts.done + counts.doing * 0.5;
      const percent = total > 0 ? ((doneEquivalent / total) * 100).toFixed(1) : "0.0";
      lines.push(`- 進捗率（done＋doing×0.5）: \`${percent}%\``);
      lines.push(
        `- 状態別: \`todo=${counts.todo}, doing=${counts.doing}, blocked=${counts.blocked}, done=${counts.done}, cancelled=${counts.cancelled}\``,
      );
      lines.push("");
    }
  } catch {
    lines.push("- Schedule の集計に失敗しました。");
    lines.push("");
  }

  lines.push("- 詳細ガントチャート: [`execution/generated/gantt-chart.md`](./gantt-chart.md)");
  lines.push("![Scheduleガントチャート](./gantt-chart.svg)");
  lines.push("");
  return lines;
}

function renderRegisterSectionContent(views: RegisterItemView[]): string[] {
  const lines: string[] = [];
  const statusCounts: Record<string, number> = {};
  const priorityCounts: Record<string, number> = {};
  for (const view of views) {
    statusCounts[view.item.status] = (statusCounts[view.item.status] ?? 0) + 1;
    priorityCounts[view.item.priority] = (priorityCounts[view.item.priority] ?? 0) + 1;
  }

  lines.push(`- 総件数: \`${views.length}\``);
  lines.push("");
  lines.push("#### 状態別");
  lines.push("");
  lines.push(countTable("状態", statusCounts, STATUS_ORDER));
  lines.push("");
  lines.push("#### 優先度別");
  lines.push("");
  lines.push(countTable("優先度", priorityCounts, PRIORITY_ORDER));
  lines.push("");
  return lines;
}

function renderAggregationSection(paths: DashboardPaths, views: RegisterItemView[]): string[] {
  const lines = ["## 7. 全体の集計", ""];

  const hasSchedule =
    existsSync(paths.executionGeneratedPath) &&
    existsSync(join(paths.executionGeneratedPath, "state.json"));
  const hasRegister = views.length > 0;

  if (!hasSchedule && !hasRegister) {
    lines.push("- ありません", "");
    return lines;
  }

  lines.push("::: details 全体の集計");
  lines.push("");

  lines.push("### Schedule 進捗");
  lines.push("");
  lines.push(...renderScheduleSectionContent(paths));

  lines.push("### 登録簿状況");
  lines.push("");
  lines.push(...renderRegisterSectionContent(views));

  lines.push("### 全体計画ガントチャート");
  lines.push("");
  lines.push("![全体計画ガントチャート](./dashboard-timeline-gantt.svg)");
  lines.push("");

  lines.push(":::");
  lines.push("");
  return lines;
}

// ================================
// 8. Exec records (plan / result 一覧)
// ================================

export { buildExecRecordsMarkdown, collectExecRecords, EXEC_RECORDS_FILE };
export type { ExecRecordRow } from "./exec-records.js";

function execRecordsPath(paths: DashboardPaths): string {
  return join(paths.executionGeneratedPath, "..", "exec");
}

function renderExecRecordsSection(paths: DashboardPaths): string[] {
  const lines = ["## 8. 実行記録", ""];
  const rows = collectExecRecords(execRecordsPath(paths));
  const plans = rows.filter((row) => row.planFile).length;
  const results = rows.filter((row) => row.resultFile).length;
  lines.push(
    `- [実行記録一覧](./${EXEC_RECORDS_FILE})（plan ${plans} 件、result ${results} 件）`,
    "",
  );
  return lines;
}

// ================================
// Build entry
// ================================

export type DashboardBuildResult = {
  projectId: string;
  generatedFiles: string[];
  errors: string[];
  warnings: string[];
};

export function buildDashboardMarkdown(paths: DashboardPaths): string {
  const lines: string[] = [];
  const nowLabel = new Date().toISOString().replace(/\.\d{3}Z$/, "");

  lines.push("# プロジェクトダッシュボード");
  lines.push("");
  lines.push(`- project_id: \`${paths.projectId}\``);
  lines.push(`- generated_at: \`${nowLabel}\``);
  lines.push(`- 再生成: \`specdojo dashboard build --project ${paths.projectId}\``);
  lines.push("");
  lines.push(generatedBanner("specdojo dashboard build"));
  lines.push("");

  let views: RegisterItemView[] = [];
  try {
    const regPaths = getRegisterPathsForDashboard(paths);
    if (regPaths) {
      views = loadRegisterItems(regPaths);
    }
  } catch {
    views = [];
  }
  const catalogDocMap = buildCatalogDocMap(paths.catalogPath);

  lines.push(...renderActionRequiredSection(paths, views, catalogDocMap));
  lines.push(...renderRecommendedRegisterSection(paths, views));
  lines.push(...renderActiveEpicsSection(paths, views, catalogDocMap));
  lines.push(...renderCompletedEpicsSection(paths, views));
  lines.push(...renderRoutineSection(paths));
  lines.push(...renderGradeSection(paths));
  lines.push(...renderAggregationSection(paths, views));
  lines.push(...renderExecRecordsSection(paths));

  // 各セクションは次のセクションとの区切りとして空行で終わる。最後のセクションの空行を
  // そのまま残すと、書き出し時に付ける改行と合わさって末尾が空行2行になり markdownlint の
  // MD012 に触れるため、ここで末尾の空行を落とす。
  return lines.join("\n").replace(/\n+$/, "");
}

export function writeDashboard(paths: DashboardPaths): {
  markdown: string;
  generatedFiles: string[];
} {
  mkdirSync(paths.executionGeneratedPath, { recursive: true });

  const markdown = buildDashboardMarkdown(paths);
  const generatedFiles: string[] = [];

  const mdPath = join(paths.executionGeneratedPath, "dashboard.md");
  writeFileSync(mdPath, markdown + "\n", "utf8");
  generatedFiles.push(toArtifactPath(mdPath));

  // 実行記録はサイドバーに載せないため、ダッシュボードから辿る一覧ページを並置する。
  const recordsPath = join(paths.executionGeneratedPath, EXEC_RECORDS_FILE);
  const recordsMarkdown = buildExecRecordsMarkdown(
    paths.projectId,
    collectExecRecords(execRecordsPath(paths)),
  );
  writeFileSync(recordsPath, recordsMarkdown + "\n", "utf8");
  generatedFiles.push(toArtifactPath(recordsPath));

  const { schedule: epicSchedule, plannedStartDate: epicStart } = dashboardEpicPlan(paths);
  const indexPath = join(paths.timelinePath, "tml-index.yaml");
  if (epicSchedule.length > 0 || existsSync(indexPath)) {
    let svg: string;
    if (epicSchedule.length > 0) {
      svg = buildTimelineGanttSvg(
        epicSchedule,
        epicStart,
        "全体計画（epic）",
        "登録簿の予定開始日・着手記録・先行 epic と、完了日時・期限から算出。日付の逆転がある期間は未定。",
      );
    } else {
      const { index, errors } = loadTimelineIndex(indexPath);
      if (errors.length) throw new Error(errors.join("; "));
      const { schedule, plannedStartDate } = computeTimelineTrackSchedules(
        index,
        resolveDashboardCalendar(paths.schedulePath ?? paths.timelinePath),
      );
      svg = buildTimelineGanttSvg(schedule, plannedStartDate);
    }
    const svgPath = join(paths.executionGeneratedPath, "dashboard-timeline-gantt.svg");
    writeFileSync(svgPath, svg + "\n", "utf8");
    generatedFiles.push(toArtifactPath(svgPath));
  }
  const catalogPlan = buildTimeline({
    timelinePath: paths.timelinePath,
    catalogPath: paths.catalogPath ?? null,
    registerPath: paths.registerPath ?? join(paths.projectPath, "controls", "project-register"),
    schedulePath: paths.schedulePath,
    projectId: paths.projectId,
    repoRoot: paths.repoRoot ?? specdojoRootDir(),
  });
  if (catalogPlan.errors.length > 0) throw new Error(catalogPlan.errors.join("; "));
  const scaffoldPath = join(paths.executionGeneratedPath, "catalog-scaffold.md");
  writeFileSync(scaffoldPath, renderCatalogScaffoldMarkdown(catalogPlan), "utf8");
  generatedFiles.push(toArtifactPath(scaffoldPath));

  return { markdown, generatedFiles };
}

export function buildDashboard(opts: { project?: string }): DashboardBuildResult {
  const paths = resolveDashboardPaths(opts);
  const { generatedFiles } = writeDashboard(paths);
  return { projectId: paths.projectId, generatedFiles, errors: [], warnings: [] };
}

// build-command ステップで使う出力先の解決を公開する。
export function dashboardOutputFiles(paths: DashboardPaths): string[] {
  return [
    "dashboard.md",
    EXEC_RECORDS_FILE,
    "dashboard-timeline-gantt.svg",
    "catalog-scaffold.md",
  ].map((name) => toArtifactPath(join(paths.executionGeneratedPath, name)));
}

// ================================
// CLI command
// ================================

function printCommandError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  process.stdout.write(message + "\n");
  process.exitCode = 1;
}

export function registerDashboardCommands(program: Command): void {
  const dash = program.command("dashboard").description("Per-project dashboard build commands");

  const bcmd = dash
    .command("build")
    .description(
      "Generate per-project dashboard.md, epic Gantt chart SVG and catalog scaffold targets",
    )
    .option("--project <id>", "Project id in specdojo.config.json")
    .option("--dry-run", "Print generated content to stdout without writing", false);

  bcmd.action((opts) => {
    try {
      if (opts.dryRun) {
        const paths = resolveDashboardPaths(opts);
        process.stdout.write(`\n# --- (dry-run) dashboard.md ---\n\n`);
        process.stdout.write(buildDashboardMarkdown(paths) + "\n");
        return;
      }

      const result = buildDashboard(opts);
      if (result.errors.length > 0) {
        for (const error of result.errors) printCommandError(new Error(error));
        return;
      }

      process.stdout.write(
        `Generated dashboard: ${result.generatedFiles.map((f) => `\n   ${f}`).join("")}\n`,
      );
    } catch (error) {
      printCommandError(error);
    }
  });
}

// build-command で使う path 解決ヘルパーを公開する。
export {
  getProjectExecutionPath,
  getProjectRegisterPath,
  getProjectRoutinesPath,
  getProjectSchedulePath,
  getProjectTimelinePath,
};
