import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { specdojoRootDir } from "./specdojo-config.js";
import { expandTemplate } from "./exec-shared.js";
import { formatMarkdownFile } from "./exec-format.js";
import type { Approach, ExecResultMeta, TaskMode } from "./exec-types.js";

// ---------------------------------------------------------------------------
// Frontmatter helpers
// ---------------------------------------------------------------------------

function serializeFrontmatter(meta: ExecResultMeta): string {
  const lines = [
    "---",
    `id: ${meta.id}`,
    `type: ${meta.type}`,
    `task_id: ${meta.task_id}`,
    `mode: ${meta.mode}`,
    `status: ${meta.status}`,
    `project_id: ${meta.project_id}`,
    `plan_ref: ${meta.plan_ref}`,
    `started_at: "${meta.started_at}"`,
  ];
  if (meta.completed_at) lines.push(`completed_at: "${meta.completed_at}"`);
  if (meta.agent) lines.push(`agent: ${meta.agent}`);
  if (meta.approach) lines.push(`approach: ${meta.approach}`);
  // reason は agent stderr 由来で任意文字を含みうる。YAML として安全にするため二重引用符内へ
  // 収め、内部の二重引用符は単引用符へ置換する（extractBlockReason は単一行を返すため改行は無い）。
  if (meta.block_reason) {
    lines.push(`block_reason: "${meta.block_reason.replace(/"/g, "'")}"`);
  }
  lines.push("---");
  return lines.join("\n");
}

// Strip surrounding quote pairs so re-serialization does not nest them or carry over a foreign
// quoting style. Timestamp fields are written double-quoted; reading them back must yield the raw
// value. Values written by other tooling can arrive single-quoted (`'...'`), and an earlier
// read-modify-write of such a value could leave it double-wrapped around single quotes (`"'...'"`).
// Peel each matching outer pair (double or single) so any of these forms normalizes to the raw
// value, which serializeFrontmatter then re-emits with double quotes only.
function unquote(value: string): string {
  let result = value;
  while (
    result.length >= 2 &&
    ((result.startsWith('"') && result.endsWith('"')) ||
      (result.startsWith("'") && result.endsWith("'")))
  ) {
    result = result.slice(1, -1);
  }
  return result;
}

function parseFrontmatter(content: string): { meta: Record<string, string>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };
  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    meta[line.slice(0, idx).trim()] = unquote(line.slice(idx + 1).trim());
  }
  return { meta, body: match[2] };
}

function frontmatterWithBody(frontmatter: string, body: string): string {
  return `${frontmatter}\n\n${body.replace(/^\n+/, "")}`;
}

// ---------------------------------------------------------------------------
// Template-based generation (edit-result / review-result テンプレートの展開)
// ---------------------------------------------------------------------------

function templateFileName(mode: TaskMode): string {
  return mode === "review" ? "xrr-template.md" : "xer-template.md";
}

function execResultDocId(projectId: string, mode: TaskMode, localBase: string): string {
  const prefix = mode === "review" ? "xrr" : "xer";
  const localId = `${prefix}-${localBase.toLowerCase()}`;
  return projectId ? `${projectId}:${localId}` : localId;
}

function loadResultTemplate(mode: TaskMode): string {
  const templatePath = join(
    specdojoRootDir(),
    "docs/ja/specdojo/templates",
    templateFileName(mode),
  );
  if (!existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }
  return readFileSync(templatePath, "utf8");
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function resultPathForTask(executionPath: string, nameBase: string): string {
  return join(executionPath, "exec", "results", `${nameBase}-result.md`);
}

export async function scaffoldResult(opts: {
  executionPath: string;
  taskId: string;
  mode: TaskMode;
  projectId: string;
  planRef: string;
  agent: string;
  startedAt: string;
  approach?: Approach;
  reviewSections?: string;
  // Shared plan/result stem. Defaults to taskId (fixed-name worktree/claim flow); in-place
  // callers pass a unique stem so file name and doc id stay unique and the result is tied to its plan.
  stem?: string;
}): Promise<{ resultPath: string; created: boolean }> {
  const { executionPath, taskId, mode, projectId, planRef, agent, startedAt, approach } = opts;
  const stem = opts.stem ?? taskId;
  const resultPath = resultPathForTask(executionPath, stem);

  // Idempotent: claim and exec run can both reach this; never clobber an in-progress result.
  if (existsSync(resultPath)) {
    return { resultPath, created: false };
  }

  const resultsDir = join(executionPath, "exec", "results");
  if (!existsSync(resultsDir)) mkdirSync(resultsDir, { recursive: true });

  const template = loadResultTemplate(mode);

  const meta: ExecResultMeta = {
    id: execResultDocId(projectId, mode, stem),
    type: "exec-result",
    task_id: taskId,
    mode,
    status: "in_progress",
    project_id: projectId,
    plan_ref: planRef,
    started_at: startedAt,
    agent,
    ...(approach ? { approach } : {}),
  };

  const values: Record<string, string> = { _FRONTMATTER_: serializeFrontmatter(meta) };
  // Review results pre-expand per-RVP sections (role / viewpoint_id / criterion) so the result
  // is self-contained. When the caller cannot resolve them, leave a language-neutral _TODO_
  // marker; the result template's own prose explains how to fill the sections.
  if (mode === "review") {
    values._REVIEW_RESULT_SECTIONS_ = opts.reviewSections ?? "_TODO_";
  }
  const content = expandTemplate(template, values);

  writeFileSync(resultPath, content, "utf8");
  await formatMarkdownFile(resultPath);
  return { resultPath, created: true };
}

// 必須節が未記入（テンプレートのプレースホルダのまま）かを検知するためのマーカー。
// result テンプレート（xer-template.md / xrr-template.md）の必須節プレースホルダに対応する。
// テンプレート文言を変えた場合はここも合わせて更新する。
const MANDATORY_PLACEHOLDERS: Record<TaskMode, readonly string[]> = {
  edit: ["_TODO_: 実施した内容", "_TODO_: 変更したファイル"],
  review: ["recommendation: _TODO_"],
};

// in-place 実行後の result が「scaffold のまま（必須節が未記入）」かを判定する。
// agent プロセスの終了コードだけでは block を検知できない（例えば claude -p は
// モデルが「blocked」と結論してもターン正常終了で 0 を返す）ため、agent 本来の責務で
// ある result 必須節の記入が行われたかを内容から確認する補助に使う。
// 必須節のプレースホルダが 1 つでも残っていれば未記入とみなす。
export function isResultUnfilled(resultPath: string, mode: TaskMode): boolean {
  if (!existsSync(resultPath)) return false;
  const { body } = parseFrontmatter(readFileSync(resultPath, "utf8"));
  return MANDATORY_PLACEHOLDERS[mode].some((marker) => body.includes(marker));
}

export async function updateResultStatus(
  resultPath: string,
  status: "complete" | "blocked",
  completedAt: string,
  reason?: string,
): Promise<void> {
  if (!existsSync(resultPath)) return;

  const content = readFileSync(resultPath, "utf8");
  const { meta: existingMeta, body } = parseFrontmatter(content);

  // block 理由は blocked のときのみ保持する。新しい reason を優先し、無ければ既存値を残す。
  // complete へ遷移した場合は理由を消す。
  const blockReason =
    status === "blocked" ? (reason ?? existingMeta.block_reason ?? undefined) : undefined;

  const updatedMeta: ExecResultMeta = {
    id: existingMeta.id ?? "",
    type: "exec-result",
    task_id: existingMeta.task_id ?? "",
    mode: (existingMeta.mode as TaskMode) ?? "edit",
    status,
    project_id: existingMeta.project_id ?? "",
    plan_ref: existingMeta.plan_ref ?? "",
    started_at: existingMeta.started_at ?? "",
    completed_at: completedAt,
    agent: existingMeta.agent,
    approach: existingMeta.approach ? (existingMeta.approach as Approach) : undefined,
    ...(blockReason ? { block_reason: blockReason } : {}),
  };

  writeFileSync(resultPath, frontmatterWithBody(serializeFrontmatter(updatedMeta), body), "utf8");
  await formatMarkdownFile(resultPath);
}
