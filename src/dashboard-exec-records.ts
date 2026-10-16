import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { load } from "./yaml.js";
import { sanitizeDashboardCell } from "./dashboard-shared.js";

export const EXEC_RECORDS_FILE = "exec-records.md";

export type ExecRecordRow = {
  stem: string;
  taskId?: string;
  mode?: string;
  status?: string;
  startedAt?: string;
  planFile?: string;
  resultFile?: string;
};

function readSpecdojoFrontmatter(filePath: string): Record<string, unknown> {
  try {
    const content = readFileSync(filePath, "utf8");
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return {};
    const parsed: unknown = load(match[1]);
    if (typeof parsed !== "object" || parsed === null) return {};
    const specdojo: unknown = (parsed as Record<string, unknown>).specdojo;
    return typeof specdojo === "object" && specdojo !== null && !Array.isArray(specdojo)
      ? (specdojo as Record<string, unknown>)
      : {};
  } catch {
    // 壊れた frontmatter の記録も一覧から辿れるよう、属性なしの行として残す。
    return {};
  }
}

function frontmatterText(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (value instanceof Date) return value.toISOString();
  return undefined;
}

function listMarkdownFiles(dir: string, suffix: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith(suffix))
    .sort();
}

// execution/exec/{plans,results} の記録を実行単位（ファイル名の stem）でまとめる。
// 並びは開始日時の新しい順、開始日時が無いものは後ろに stem 順で置く。
export function collectExecRecords(execPath: string): ExecRecordRow[] {
  const rows = new Map<string, ExecRecordRow>();
  const rowFor = (stem: string): ExecRecordRow => {
    const existing = rows.get(stem);
    if (existing) return existing;
    const created: ExecRecordRow = { stem };
    rows.set(stem, created);
    return created;
  };

  for (const name of listMarkdownFiles(join(execPath, "plans"), "-plan.md")) {
    const row = rowFor(name.slice(0, -"-plan.md".length));
    const fm = readSpecdojoFrontmatter(join(execPath, "plans", name));
    row.planFile = name;
    row.taskId ??= frontmatterText(fm.task_id);
    row.mode ??= frontmatterText(fm.mode);
  }

  for (const name of listMarkdownFiles(join(execPath, "results"), "-result.md")) {
    const row = rowFor(name.slice(0, -"-result.md".length));
    const fm = readSpecdojoFrontmatter(join(execPath, "results", name));
    row.resultFile = name;
    row.taskId = frontmatterText(fm.task_id) ?? row.taskId;
    row.mode = frontmatterText(fm.mode) ?? row.mode;
    row.status = frontmatterText(fm.status);
    row.startedAt = frontmatterText(fm.started_at);
  }

  return [...rows.values()].sort((a, b) => {
    if (a.startedAt && b.startedAt && a.startedAt !== b.startedAt) {
      return a.startedAt < b.startedAt ? 1 : -1;
    }
    if (a.startedAt && !b.startedAt) return -1;
    if (!a.startedAt && b.startedAt) return 1;
    return a.stem.localeCompare(b.stem);
  });
}

function execRecordLink(dir: "plans" | "results", file: string | undefined, label: string): string {
  return file ? `[${label}](../exec/${dir}/${file})` : "-";
}

export function buildExecRecordsMarkdown(projectId: string, rows: ExecRecordRow[]): string {
  const lines: string[] = [
    "# 実行記録一覧",
    "",
    `- project_id: \`${projectId}\``,
    `- 再生成: \`specdojo dashboard build --project ${projectId}\``,
    "",
    "> このページは `specdojo dashboard build` が生成した派生ビューです。正本は `execution/exec/` 配下の plan / result であり、このページを手編集しても次回のビルドで失われます。実行記録はサイドバーに載せないため、このページから辿ります。",
    "",
  ];

  if (rows.length === 0) {
    lines.push("- 実行記録はまだありません。");
    return lines.join("\n");
  }

  lines.push(`- 件数: ${rows.length}`, "");
  lines.push("| 開始日時 | task | mode | status | plan | result |");
  lines.push("| --- | --- | --- | --- | --- | --- |");
  for (const row of rows) {
    const task = row.taskId ? `\`${sanitizeDashboardCell(row.taskId)}\`` : "-";
    const mode = row.mode ? `\`${sanitizeDashboardCell(row.mode)}\`` : "-";
    const status = row.status ? `\`${sanitizeDashboardCell(row.status)}\`` : "-";
    lines.push(
      `| ${row.startedAt ? sanitizeDashboardCell(row.startedAt) : "-"} | ${task} | ${mode} | ${status} | ${execRecordLink("plans", row.planFile, "plan")} | ${execRecordLink("results", row.resultFile, "result")} |`,
    );
  }
  return lines.join("\n");
}
