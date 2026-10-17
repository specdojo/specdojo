import { mkdirSync, existsSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { Command } from "commander";
import type { ExecEventV1, StateSnapshot } from "../exec/types.js";
import { toArtifactPath } from "../shared/artifact-path.js";
import { readJson } from "../shared/fs.js";
import { readAllEventFiles } from "../exec/events.js";
import {
  getProjectExecutionPath,
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
  type PjrItem,
  type RegisterItemView,
} from "../register/register.js";
import {
  readRegisterEventsFromContent,
  registerEventFilePath,
  type RegisterEventV1,
} from "../register/events.js";
import { buildTimelineWaves, loadTimelineIndex, type TimelineTrackPlan } from "./timeline-build.js";
import {
  buildTimelineGanttSvg,
  computeTimelineTrackSchedules,
  resolveDashboardCalendar,
} from "./dashboard-timeline.js";
import {
  aggregateRoutines,
  buildDailyRoutineRows,
  formatZonedDateTime,
  ROUTINE_ROW_COLLAPSE_THRESHOLD,
  zonedDateKey,
} from "./routines.js";
import { buildExecRecordsMarkdown, collectExecRecords, EXEC_RECORDS_FILE } from "./exec-records.js";
import { sanitizeDashboardCell } from "./shared.js";
import { gradeFindingCount, parseGradeResult, type GradeResult } from "../grade/result.js";

// ================================
// Types
// ================================

function generatedBanner(command: string): string {
  return `> このページは \`${command}\` が生成した派生ビューです。正本は Schedule / Timeline（tml-index.yaml）/ 登録簿個票・event / exec event / routine（rtn-*.yaml・generated/routine-state.json・generated/routine-runs.jsonl）の機械可読な成果物であり、このページを手編集しても次回のビルドで失われます。`;
}

export type DashboardPaths = {
  projectId: string;
  projectPath: string;
  schedulePath?: string;
  timelinePath: string;
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
    projectPath: join(baseDir, getProjectTimelinePath(project), ".."),
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

// ================================
// 3. Register aggregation (ticket frontmatter = source of truth)
// ================================

type RegisterAggregates = {
  statusCounts: Record<string, number>;
  priorityCounts: Record<string, number>;
  total: number;
  error?: string;
};

function aggregateRegister(projectId: string): RegisterAggregates {
  const result: RegisterAggregates = {
    statusCounts: {},
    priorityCounts: {},
    total: 0,
  };
  try {
    const paths = resolveRegisterPaths({ project: projectId });
    const items = loadRegisterItems(paths);
    for (const view of items) {
      const item: PjrItem = view.item;
      result.statusCounts[item.status] = (result.statusCounts[item.status] ?? 0) + 1;
      result.priorityCounts[item.priority] = (result.priorityCounts[item.priority] ?? 0) + 1;
    }
    result.total = items.length;
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
  }
  return result;
}

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
};

export type DashboardAttentionRow = {
  source: "register" | "exec";
  id: string;
  reason: string;
  nextAction: string;
};

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

function buildRegisterCandidates(
  paths: ReturnType<typeof resolveRegisterPaths>,
): DashboardRegisterCandidate[] {
  const views = loadRegisterItems(paths);
  const openIds = new Set(
    views.filter((view) => view.item.status === "open").map((view) => view.id),
  );
  return views
    .filter((view) => view.item.status === "open" && EXECUTABLE_REGISTER_TYPES.has(view.item.type))
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

function aggregateAttention(paths: DashboardPaths): DashboardAttentionRow[] {
  const rows: DashboardAttentionRow[] = [];
  const registerPaths = resolveRegisterPaths({ project: paths.projectId });
  const views = loadRegisterItems(registerPaths);
  for (const view of views.filter((item) => item.item.status === "waiting")) {
    rows.push({
      source: "register",
      id: view.id,
      reason:
        latestRegisterWaitReason(readRegisterEvents(view, registerPaths.projectRegisterPath)) ??
        "-",
      nextAction: `待機理由を解消し \`specdojo register start --project ${paths.projectId} --id ${view.id}\``,
    });
  }

  if (!paths.schedulePath) return rows;
  const statePath = join(paths.executionGeneratedPath, "state.json");
  if (!existsSync(statePath)) return rows;
  const state = readJson(statePath) as StateSnapshot;
  const blockedIds = Object.entries(state.tasks)
    .filter(([, task]) => task.state === "blocked")
    .map(([id]) => id);
  const reasons = latestExecBlockReasons(
    blockedIds,
    readAllEventFiles(paths.schedulePath).map(({ event }) => event),
  );
  for (const id of blockedIds.sort()) {
    rows.push({
      source: "exec",
      id,
      reason: reasons.get(id) ?? state.tasks[id].last_msg ?? "-",
      nextAction: `原因を解消し \`specdojo exec unblock --project ${paths.projectId} --task ${id} --by <actor> --msg <reason>\``,
    });
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

// ================================
// Section renderers
// ================================

function renderScheduleSection(paths: DashboardPaths): string[] {
  const lines = ["## 1. Schedule進捗", ""];

  if (!existsSync(paths.executionGeneratedPath)) {
    lines.push(
      "- Schedule はまだ生成されていません（`specdojo exec refresh` を実行してください）。",
    );
    lines.push("");
    return lines;
  }

  try {
    const state = existsSync(join(paths.executionGeneratedPath, "state.json"))
      ? (readJson(join(paths.executionGeneratedPath, "state.json")) as StateSnapshot)
      : undefined;

    const ready = existsSync(join(paths.executionGeneratedPath, "ready.json"))
      ? readJson(join(paths.executionGeneratedPath, "ready.json"))
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

    if (ready && typeof ready === "object") {
      const r = ready as {
        ready_count?: number;
        strategies?: Record<string, { next_task_id?: string | null }>;
      };
      lines.push(`- 着手可能タスク（ready）: \`${r.ready_count ?? 0}\`件`);
      if (r.strategies?.["critical-first"]?.next_task_id) {
        lines.push(
          `- 次の着手候補（critical-first）: \`${r.strategies["critical-first"].next_task_id}\``,
        );
      }
      lines.push("");
    }
  } catch {
    lines.push("- Schedule の集計に失敗しました（state.json / ready.json が不正）。");
    lines.push("");
  }

  lines.push("- 詳細ガントチャート: [`execution/generated/gantt-chart.md`](./gantt-chart.md)");
  lines.push("![Scheduleガントチャート](./gantt-chart.svg)");
  lines.push("");
  return lines;
}

function renderTimelineSection(paths: DashboardPaths): string[] {
  const lines = ["## 2. タイムライン（トラック着手順序）", ""];
  const indexPath = join(paths.timelinePath, "tml-index.yaml");

  if (!existsSync(indexPath)) {
    lines.push("- タイムラインデータを読み込めませんでした（tml-index.yaml が存在しません）。");
    lines.push("");
    return lines;
  }

  try {
    const { index } = loadTimelineIndex(indexPath);
    const scheduleReadyTracks = index.tracks
      .filter((t) => t.catalog_status === "primary")
      .map((t) => t.track)
      .sort();

    const waves = buildTimelineWaves(index.tracks);

    const calendar = resolveDashboardCalendar(paths.schedulePath ?? paths.timelinePath);
    const { schedule, plannedStartDate } = computeTimelineTrackSchedules(index, calendar);

    lines.push(`- 計画開始日（planned_start_date）: \`${plannedStartDate ?? "-"}\``);
    lines.push(`- wave数: \`${waves.length}\``);
    lines.push(
      `- Schedule展開準備状況（catalog_status=primary）: \`${scheduleReadyTracks.join(", ") || "-"}\``,
    );
    lines.push("");

    lines.push("### Wave・トラック一覧");
    lines.push("");
    lines.push(
      "| wave | track | catalog_status | 推定稼働日数 | 予定開始日 | 予定終了日 | parallel_group | depends_on |",
    );
    lines.push("| ---: | --- | --- | ---: | --- | --- | --- | --- |");
    for (const wave of waves) {
      for (const tk of wave.tracks) {
        const row = schedule.find((s) => s.track === tk.track);
        if (!row) continue;
        lines.push(
          `| ${wave.wave} | \`${tk.track}\` | \`${tk.catalog_status}\` | ${formatEstimate(tk)} | ${row.startDate ?? "-"} | ${row.endDate ?? "-"} | ${sanitizeDashboardCell(row.parallel_group ?? "-")} | ${sanitizeDashboardCell(row.depends_on.join(", ") || "-")} |`,
        );
      }
    }
    lines.push("");

    lines.push("### トラック計画ガントチャート");
    lines.push("");
    lines.push("![トラック計画ガントチャート](./dashboard-timeline-gantt.svg)");
    lines.push("");

    return lines;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    lines.push(`- タイムラインの集計に失敗しました: ${message}`);
    lines.push("");
    return lines;
  }
}

function formatEstimate(track: TimelineTrackPlan): string {
  return track.catalog_duration_estimate_days === undefined
    ? "-"
    : String(track.catalog_duration_estimate_days);
}

function renderRegisterSection(projectId: string): string[] {
  const agg = aggregateRegister(projectId);
  const lines = ["## 3. 登録簿状況", ""];

  if (agg.error) {
    lines.push(`- 登録簿の集計に失敗しました: ${agg.error}`);
    lines.push("");
    return lines;
  }

  lines.push(`- 総件数: \`${agg.total}\``);
  lines.push("");
  lines.push("### 状態別");
  lines.push("");
  lines.push(countTable("状態", agg.statusCounts, STATUS_ORDER));
  lines.push("");
  lines.push("### 優先度別");
  lines.push("");
  lines.push(countTable("優先度", agg.priorityCounts, PRIORITY_ORDER));
  lines.push("");

  return lines;
}

function renderRoutineSection(paths: DashboardPaths): string[] {
  const agg = aggregateRoutines(paths.routinesPath);
  const lines = ["## 4. routine定義・最終実行", ""];

  if (agg.error) lines.push(`- routine 集計に失敗しました: ${agg.error}`);
  if (agg.rows.length === 0) {
    lines.push("- （定義された routine がありません）");
    lines.push("");
    return lines;
  }

  lines.push("| id | name | enabled | 間隔 / cron | kind | 最終実行 / 結果 | due |");
  lines.push("| --- | --- | --- | --- | --- | --- | :---: |");
  for (const row of agg.rows) {
    lines.push(
      `| \`${row.id}\` | ${sanitizeDashboardCell(row.name ?? "-")} | ${row.enabled ? "enabled" : "disabled"} | \`${sanitizeDashboardCell(row.schedule)}\` | \`${row.kind}\` | ${sanitizeDashboardCell(row.lastRun)} | ${row.due} |`,
    );
  }

  lines.push("");
  return lines;
}

function renderDailyRoutineSection(paths: DashboardPaths): string[] {
  const lines = ["## 5. routine 実行状況（昨日・本日）", ""];
  const agg = aggregateRoutines(paths.routinesPath);
  const rows = buildDailyRoutineRows(agg.docs, agg.history, new Date());
  if (rows.length === 0) {
    lines.push("- （昨日の実行履歴・本日の予定はありません）", "");
    return lines;
  }
  const timeZone = "Asia/Tokyo";
  lines.push(
    `- 時刻は ${timeZone}。1 日に ${ROUTINE_ROW_COLLAPSE_THRESHOLD} 回以上動く routine は最新の実行 1 行に件数をまとめる。`,
  );
  lines.push("");
  lines.push("| 日 | routine | 予定 | 開始 | 完了 | 結果 | 回数 | Job Run |");
  lines.push("| --- | --- | --- | --- | --- | --- | ---: | --- |");
  for (const row of rows) {
    const fmt = (value: string): string =>
      value === "-" ? "-" : formatZonedDateTime(value, timeZone);
    lines.push(
      `| ${row.day} | \`${row.routineId}\` | ${fmt(row.scheduledFor)} | ${fmt(row.startedAt)} | ${fmt(row.completedAt)} | ${row.result} | ${row.runCount} | ${row.jobRunIds.map((id) => `\`${id}\``).join(", ") || "-"} |`,
    );
  }
  lines.push("");
  return lines;
}

export function readDashboardGradeResults(resultsPath: string): GradeResult[] {
  if (!existsSync(resultsPath)) return [];
  return readdirSync(resultsPath)
    .filter((name) => name.endsWith(".yaml") || name.endsWith(".yml"))
    .sort()
    .flatMap((name) => {
      const path = join(resultsPath, name);
      try {
        return [parseGradeResult(readFileSync(path, "utf8"), path)];
      } catch {
        return [];
      }
    });
}

function renderGradeSection(paths: DashboardPaths): string[] {
  const lines = ["## 8. Grade", ""];
  const results = paths.gradeResultsPath ? readDashboardGradeResults(paths.gradeResultsPath) : [];
  if (results.length === 0) {
    lines.push("- grade result はまだありません。", "");
    return lines;
  }
  lines.push("| 成果物 | 対象 | verdict | score | findings |", "| --- | --- | --- | ---: | ---: |");
  for (const result of results) {
    lines.push(
      `| \`${sanitizeDashboardCell(result.document)}\` | \`${result.target}\` | \`${result.verdict}\` | ${result.score} | ${gradeFindingCount(result)} |`,
    );
  }
  lines.push("");
  return lines;
}

function renderRecommendedRegisterSection(projectId: string): string[] {
  const lines = ["## 6. 着手可能な登録項目（おすすめ順）", ""];
  let rows: DashboardRegisterCandidate[];
  let today: string;
  try {
    const paths = resolveRegisterPaths({ project: projectId });
    today = zonedDateKey(new Date(), paths.registerDateTimeZone);
    rows = rankRegisterCandidates(buildRegisterCandidates(paths), today).slice(0, 10);
  } catch (error) {
    lines.push(
      `- 登録簿の集計に失敗しました: ${error instanceof Error ? error.message : String(error)}`,
      "",
    );
    return lines;
  }
  if (rows.length === 0) {
    lines.push("- （着手可能な登録項目はありません）", "");
    return lines;
  }
  lines.push("| 順位 | id | type | title | 期日 | 優先度 | 関連 open PJR | 登録日時 | 根拠 |");
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
    lines.push(
      `| ${index + 1} | \`${row.id}\` | \`${row.type}\` | ${sanitizeDashboardCell(row.title)} | ${row.due} | \`${row.priority}\` | ${row.relatedOpenPjrCount} | ${row.registeredAt} | ${dueReason}、優先度 ${row.priority}、関連 open PJR ${row.relatedOpenPjrCount}件 |`,
    );
  });
  lines.push("");
  return lines;
}

function renderAttentionSection(paths: DashboardPaths): string[] {
  const lines = ["## 7. 要対応（解除待ち）", ""];
  try {
    const rows = aggregateAttention(paths);
    if (rows.length === 0) {
      lines.push("- （解除待ちの登録項目・exec タスクはありません）", "");
      return lines;
    }
    lines.push("| 種別 | id | 理由 | 次の行動 |");
    lines.push("| --- | --- | --- | --- |");
    for (const row of rows) {
      lines.push(
        `| ${row.source} | \`${row.id}\` | ${sanitizeDashboardCell(row.reason)} | ${sanitizeDashboardCell(row.nextAction)} |`,
      );
    }
  } catch (error) {
    lines.push(
      `- 要対応一覧の集計に失敗しました: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  lines.push("");
  return lines;
}

// ================================
// 9. Exec records (plan / result 一覧)
// ================================

export { buildExecRecordsMarkdown, collectExecRecords, EXEC_RECORDS_FILE };
export type { ExecRecordRow } from "./exec-records.js";

function execRecordsPath(paths: DashboardPaths): string {
  return join(paths.executionGeneratedPath, "..", "exec");
}

function renderExecRecordsSection(paths: DashboardPaths): string[] {
  const lines = ["## 9. 実行記録", ""];
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

  lines.push(...renderScheduleSection(paths));
  lines.push(...renderTimelineSection(paths));
  lines.push(...renderRegisterSection(paths.projectId));
  lines.push(...renderRoutineSection(paths));
  lines.push(...renderDailyRoutineSection(paths));
  lines.push(...renderRecommendedRegisterSection(paths.projectId));
  lines.push(...renderAttentionSection(paths));
  lines.push(...renderGradeSection(paths));
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

  // timeline gantt SVG を並置。tml-index が無い／壊れている場合はスキップ。
  const indexPath = join(paths.timelinePath, "tml-index.yaml");
  if (existsSync(indexPath)) {
    try {
      const { index } = loadTimelineIndex(indexPath);
      const calendar = resolveDashboardCalendar(paths.schedulePath ?? paths.timelinePath);
      const { schedule, plannedStartDate } = computeTimelineTrackSchedules(index, calendar);
      const svgPath = join(paths.executionGeneratedPath, "dashboard-timeline-gantt.svg");
      writeFileSync(svgPath, buildTimelineGanttSvg(schedule, plannedStartDate) + "\n", "utf8");
      generatedFiles.push(toArtifactPath(svgPath));
    } catch {
      // SVG 生成失敗は markdown に影響しないため破棄（renderTimelineSection でエラー表示済み）。
    }
  }

  return { markdown, generatedFiles };
}

export function buildDashboard(opts: { project?: string }): DashboardBuildResult {
  const paths = resolveDashboardPaths(opts);
  const { generatedFiles } = writeDashboard(paths);
  return { projectId: paths.projectId, generatedFiles, errors: [], warnings: [] };
}

// build-command ステップで使う出力先の解決を公開する。
export function dashboardOutputFiles(paths: DashboardPaths): string[] {
  return ["dashboard.md", EXEC_RECORDS_FILE, "dashboard-timeline-gantt.svg"].map((name) =>
    toArtifactPath(join(paths.executionGeneratedPath, name)),
  );
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
    .description("Generate per-project dashboard.md and timeline Gantt chart SVG")
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
  getProjectRoutinesPath,
  getProjectSchedulePath,
  getProjectTimelinePath,
};
