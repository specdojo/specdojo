import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { isDeepStrictEqual } from "node:util";
import { specdojoRootDir } from "./specdojo-config.js";
import { buildSpecdojoFrontmatter, parseSpecdojoDocument } from "./frontmatter-namespace.js";
import { expandTemplate, stripTerminalControlSequences } from "./exec-shared.js";
import { formatMarkdownFile } from "./exec-format.js";
import type { Approach, ExecResultMeta, TaskMode, TaskOrigin } from "./exec-types.js";
import type { ReporterOutput, ReviewReporterOutput } from "./exec-reporter.js";

// ---------------------------------------------------------------------------
// Frontmatter helpers
// ---------------------------------------------------------------------------

// frontmatter から読んだ origin を検証して返す。未知の値は採用せず undefined（= schedule）
// として扱う。status 更新のたびに meta を組み直すため、既存値の持ち回しに使う。
function parseOrigin(value: string | undefined): TaskOrigin | undefined {
  return value === "register" || value === "schedule" || value === "job" ? value : undefined;
}

function serializeFrontmatter(meta: ExecResultMeta): string {
  const inner = [
    `id: ${meta.id}`,
    `type: ${meta.type}`,
    `task_id: ${meta.task_id}`,
    `mode: ${meta.mode}`,
    `status: ${meta.status}`,
    `project_id: ${meta.project_id}`,
  ];
  if (meta.origin) inner.push(`origin: ${meta.origin}`);
  if (meta.job_id) inner.push(`job_id: ${meta.job_id}`);
  if (meta.run_id) inner.push(`run_id: ${meta.run_id}`);
  if (meta.plan_ref) inner.push(`plan_ref: ${meta.plan_ref}`);
  inner.push(`started_at: "${meta.started_at}"`);
  if (meta.completed_at) inner.push(`completed_at: "${meta.completed_at}"`);
  if (meta.agent) inner.push(`agent: ${meta.agent}`);
  if (meta.execution) inner.push(`execution: ${meta.execution}`);
  if (meta.approach) inner.push(`approach: ${meta.approach}`);
  if (meta.targets && meta.targets.length > 0) {
    inner.push("targets:");
    for (const target of meta.targets) inner.push(`  - ${target}`);
  }
  // reason は agent stderr や subprocess の生出力由来で任意文字を含みうる。まず ANSI エスケープ
  // シーケンスや制御文字を除去し（色付き hook 出力が result 表示を壊すのを防ぐ）、YAML として
  // 安全にするため二重引用符内へ収め、内部の二重引用符は単引用符へ置換する（extractBlockReason は
  // 単一行を返すため改行は無い）。
  if (meta.block_reason) {
    const safeReason = stripTerminalControlSequences(meta.block_reason).replace(/"/g, "'");
    inner.push(`block_reason: "${safeReason}"`);
  }
  return buildSpecdojoFrontmatter(inner);
}

// exec-result frontmatter は `specdojo:` 名前空間配下にある。YAML パース後、スカラー値を
// 文字列へ寄せて Record<string, string> として返す（引用符の正規化は js-yaml が行う）。
// targets はリスト値のため meta とは別に返し、再シリアライズで欠落しないようにする。
function parseFrontmatter(content: string): {
  meta: Record<string, string>;
  targets?: string[];
  body: string;
} {
  const { data, body } = parseSpecdojoDocument(content);
  const meta: Record<string, string> = {};
  let targets: string[] | undefined;
  for (const [key, value] of Object.entries(data)) {
    if (key === "targets" && Array.isArray(value)) {
      const list = value.filter((entry): entry is string => typeof entry === "string");
      if (list.length > 0) targets = list;
      continue;
    }
    if (typeof value === "string") meta[key] = value;
    else if (typeof value === "number" || typeof value === "boolean") meta[key] = String(value);
  }
  return { meta, ...(targets ? { targets } : {}), body };
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

// finalize / bootstrap-finalize は human 確定タスクの approach。result は確認記録
// （done_criteria チェックリスト・確定対象・確定判断）を持つ専用テンプレートを使う。
function isFinalizeApproach(approach: Approach | undefined): boolean {
  return approach === "finalize" || approach === "bootstrap-finalize";
}

function execResultDocId(projectId: string, mode: TaskMode, localBase: string): string {
  const prefix = mode === "review" ? "xrr" : "xer";
  const localId = `${prefix}-${localBase.toLowerCase()}`;
  return projectId ? `${projectId}:${localId}` : localId;
}

// approach が finalize 系なら xer-human-<approach>-template.md を優先し、無ければ
// mode 別の標準テンプレートへフォールバックする（plan 側の human × approach 解決と対称）。
function loadResultTemplate(mode: TaskMode, approach: Approach | undefined): string {
  const templatesPath = join(specdojoRootDir(), "docs/ja/specdojo/templates");
  if (mode === "edit" && approach === "cross-deliverable-dedup") {
    const crossDeliverablePath = join(templatesPath, "xer-cross-deliverable-dedup-template.md");
    if (existsSync(crossDeliverablePath)) return readFileSync(crossDeliverablePath, "utf8");
  }
  if (mode === "edit" && isFinalizeApproach(approach)) {
    const finalizePath = join(templatesPath, `xer-human-${approach}-template.md`);
    if (existsSync(finalizePath)) return readFileSync(finalizePath, "utf8");
  }
  const templatePath = join(templatesPath, templateFileName(mode));
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

// A unique-name run retains every attempt as a separate result. When a new result is scaffolded,
// close older unfinished attempts for the same task so they no longer look active or actionable.
// Fixed-name runs return before this helper is reached and continue to reuse their single result.
async function supersedePriorResults(
  resultsDir: string,
  taskId: string,
  nextResultPath: string,
  supersededAt: string,
): Promise<string[]> {
  const supersededPaths: string[] = [];
  for (const fileName of readdirSync(resultsDir).sort()) {
    if (!fileName.endsWith("-result.md")) continue;
    const candidatePath = join(resultsDir, fileName);
    if (candidatePath === nextResultPath) continue;

    let meta: Record<string, string>;
    try {
      meta = parseFrontmatter(readFileSync(candidatePath, "utf8")).meta;
    } catch {
      // A malformed unrelated historical result must not prevent a new run from starting. It will
      // remain visible to the normal frontmatter/schema validation and can be repaired separately.
      continue;
    }
    if (
      meta.type !== "exec-result" ||
      meta.task_id !== taskId ||
      (meta.status !== "in_progress" && meta.status !== "blocked")
    ) {
      continue;
    }
    await updateResultStatus(candidatePath, "superseded", supersededAt);
    supersededPaths.push(candidatePath);
  }
  return supersededPaths;
}

export async function scaffoldResult(opts: {
  executionPath: string;
  taskId: string;
  mode: TaskMode;
  projectId: string;
  planRef?: string;
  agent: string;
  startedAt: string;
  execution?: "agent" | "human";
  approach?: Approach;
  // 登録簿項目は "register"、Job Runは "job"。省略時はschedule由来として扱う。
  origin?: TaskOrigin;
  jobId?: string;
  runId?: string;
  // タスクが対象とする文書の doc id リスト（plan frontmatter の targets と同じ規則）。
  targets?: string[];
  reviewSections?: string;
  // finalize / bootstrap-finalize の result に焼き込む確認記録セクション（catalog から解決）。
  finalizeSections?: { doneCriteriaChecklist: string; targetsChecklist: string };
  // Shared plan/result stem. Defaults to taskId (fixed-name worktree/claim flow); in-place
  // callers pass a unique stem so file name and doc id stay unique and the result is tied to its plan.
  stem?: string;
}): Promise<{ resultPath: string; created: boolean; supersededPaths: string[] }> {
  const { executionPath, taskId, mode, projectId, planRef, agent, startedAt, approach } = opts;
  const stem = opts.stem ?? taskId;
  const resultPath = resultPathForTask(executionPath, stem);

  // Idempotent: claim and exec run can both reach this; never clobber an in-progress result.
  if (existsSync(resultPath)) {
    return { resultPath, created: false, supersededPaths: [] };
  }

  const resultsDir = join(executionPath, "exec", "results");
  if (!existsSync(resultsDir)) mkdirSync(resultsDir, { recursive: true });

  const template = loadResultTemplate(mode, approach);

  const meta: ExecResultMeta = {
    id: execResultDocId(projectId, mode, stem),
    type: "exec-result",
    task_id: taskId,
    mode,
    status: "in_progress",
    project_id: projectId,
    started_at: startedAt,
    agent,
    ...(opts.origin ? { origin: opts.origin } : {}),
    ...(opts.jobId ? { job_id: opts.jobId } : {}),
    ...(opts.runId ? { run_id: opts.runId } : {}),
    ...(planRef ? { plan_ref: planRef } : {}),
    ...(opts.execution ? { execution: opts.execution } : {}),
    ...(approach ? { approach } : {}),
    ...(opts.targets && opts.targets.length > 0 ? { targets: opts.targets } : {}),
  };

  const values: Record<string, string> = { _FRONTMATTER_: serializeFrontmatter(meta) };
  // Review results pre-expand per-RVP sections (role / viewpoint_id / criterion) so the result
  // is self-contained. When the caller cannot resolve them, leave a language-neutral _TODO_
  // marker; the result template's own prose explains how to fill the sections.
  if (mode === "review") {
    values._REVIEW_RESULT_SECTIONS_ = opts.reviewSections ?? "_TODO_";
  }
  // Finalize results pre-expand the confirmation record (done_criteria checklist and
  // ready-promotion targets) so every finalize is verified against the same items.
  // When the caller cannot resolve them, leave _TODO_ markers for manual fill-in.
  if (isFinalizeApproach(approach)) {
    values._DONE_CRITERIA_CHECKLIST_ = opts.finalizeSections?.doneCriteriaChecklist ?? "_TODO_";
    values._FINALIZE_TARGETS_CHECKLIST_ = opts.finalizeSections?.targetsChecklist ?? "_TODO_";
  }
  const content = expandTemplate(template, values);

  writeFileSync(resultPath, content, "utf8");
  await formatMarkdownFile(resultPath);
  const supersededPaths = await supersedePriorResults(resultsDir, taskId, resultPath, startedAt);
  return { resultPath, created: true, supersededPaths };
}

// 必須節が未記入（テンプレートのプレースホルダのまま）かを検知するためのマーカー。
// result テンプレート（xer-template.md / xrr-template.md）の必須節プレースホルダに対応する。
// テンプレート文言を変えた場合はここも合わせて更新する。
const MANDATORY_PLACEHOLDERS: Record<TaskMode, readonly string[]> = {
  edit: ["_TODO_: 実施した内容", "_TODO_: 変更したファイル"],
  review: ["recommendation: _TODO_"],
};

// runner が scaffold 時に必ず設定する識別・ライフサイクル項目。agent が frontmatter を
// 独自形式へ置換しても本文の _TODO_ だけでは検知できないため、終了時に非空を確認する。
const REQUIRED_SCAFFOLD_FIELDS = [
  "id",
  "type",
  "task_id",
  "mode",
  "status",
  "project_id",
  "started_at",
  "agent",
] as const;

// runner が試行間で更新する lifecycle 項目。rate-limit 後の resume では worktree 側だけが
// blocked へ更新されるため、元 scaffold との不変項目比較からは除外する。一方、同じ試行の
// 開始時スナップショットとの比較ではこれらも含め、agent による変更を許可しない。
const RUNNER_MANAGED_LIFECYCLE_FIELDS = new Set(["status", "completed_at", "block_reason"]);

function immutableScaffoldFields(data: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(data).filter(([field]) => !RUNNER_MANAGED_LIFECYCLE_FIELDS.has(field)),
  );
}

function hasNonEmptyScaffoldFields(data: Record<string, unknown>, mode: TaskMode): boolean {
  if (
    data.type !== "exec-result" ||
    data.mode !== mode ||
    !["in_progress", "complete", "blocked", "superseded"].includes(String(data.status))
  ) {
    return false;
  }
  if (
    !REQUIRED_SCAFFOLD_FIELDS.every((field) => {
      const value = data[field];
      return typeof value === "string" && value.trim().length > 0;
    })
  ) {
    return false;
  }

  const optionalScalars = ["origin", "job_id", "run_id", "plan_ref", "execution", "approach"];
  if (
    optionalScalars.some((field) => {
      if (!(field in data)) return false;
      const value = data[field];
      return typeof value !== "string" || value.trim().length === 0;
    })
  ) {
    return false;
  }

  if ("targets" in data) {
    const targets = data.targets;
    if (
      !Array.isArray(targets) ||
      targets.length === 0 ||
      targets.some((target) => typeof target !== "string" || target.trim().length === 0)
    ) {
      return false;
    }
  }

  return true;
}

// in-place 実行後の result が「scaffold のまま（必須節が未記入）」かを判定する。
// agent プロセスの終了コードだけでは block を検知できない（例えば claude -p は
// モデルが「blocked」と結論してもターン正常終了で 0 を返す）ため、agent 本来の責務で
// ある result 必須節の記入が行われたかを内容から確認する補助に使う。
// 必須節のプレースホルダが 1 つでも残っている、必須 frontmatter が非空でない、または
// agent 起動前に保持した scaffold の specdojo 名前空間からキー・値が変わっていれば未完了と
// みなす。YAML の引用符やキー順など表記だけの変更は、パース後の値が同じなら許容する。
export function isResultUnfilled(
  resultPath: string,
  mode: TaskMode,
  scaffoldFrontmatter?: Record<string, unknown>,
  originalScaffoldFrontmatter?: Record<string, unknown>,
): boolean {
  if (!existsSync(resultPath)) return scaffoldFrontmatter !== undefined;
  const current = parseSpecdojoDocument(readFileSync(resultPath, "utf8"));
  if (MANDATORY_PLACEHOLDERS[mode].some((marker) => current.body.includes(marker))) return true;
  if (!hasNonEmptyScaffoldFields(current.data, mode)) return true;

  if (scaffoldFrontmatter !== undefined) {
    if (!hasNonEmptyScaffoldFields(scaffoldFrontmatter, mode)) return true;
    if (!isDeepStrictEqual(current.data, scaffoldFrontmatter)) return true;
  }

  // resume 時は、実行直前の worktree result を上の厳密比較に使う。さらに root に保持した
  // 元 scaffold と不変項目を比較し、前回試行で生じた frontmatter 破壊を新しい基準として
  // 取り込まない。status / completed_at / block_reason のみ runner 管理差分として許容する。
  if (originalScaffoldFrontmatter !== undefined) {
    if (!hasNonEmptyScaffoldFields(originalScaffoldFrontmatter, mode)) return true;
    if (
      !isDeepStrictEqual(
        immutableScaffoldFields(current.data),
        immutableScaffoldFields(originalScaffoldFrontmatter),
      )
    ) {
      return true;
    }
  }

  return false;
}

// agent 起動前の result から、完了ガードで比較する specdojo frontmatter だけを保持する。
// 本文や YAML の表記差ではなく、scaffold されたキーと値を実行単位の正本にする。
export function readResultFrontmatterSnapshot(resultPath: string): Record<string, unknown> {
  if (!existsSync(resultPath)) return {};
  return parseSpecdojoDocument(readFileSync(resultPath, "utf8")).data;
}

function reporterInlineText(value: string): string {
  return value
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .trim();
}

function reporterBulletList(values: string[], empty: string): string {
  if (values.length === 0) return `- ${empty}`;
  return values.map((value) => `- ${reporterInlineText(value)}`).join("\n");
}

function renderEditReporterBody(output: Extract<ReporterOutput, { mode: "edit" }>): string {
  const changedFiles =
    output.changed_files.length === 0
      ? "- なし"
      : output.changed_files
          .map(
            (file) =>
              `- \`${reporterInlineText(file.path).replace(/`/g, "'")}\`: ${reporterInlineText(file.summary)}`,
          )
          .join("\n");
  return [
    "# Edit Result",
    "",
    "## 1. 実施内容",
    "",
    reporterBulletList(output.summary, "実施内容なし"),
    "",
    "## 2. 変更ファイル",
    "",
    changedFiles,
    "",
    "## 3. 申し送り",
    "",
    reporterBulletList(output.handoff, "なし"),
    "",
    "## 4. 進め方と実践の型の適用",
    "",
    reporterInlineText(output.approach),
  ].join("\n");
}

type ReviewViewpointContext = { id: string; suffix: string; criterion: string };

function reviewViewpointContexts(body: string): ReviewViewpointContext[] {
  const contexts: ReviewViewpointContext[] = [];
  const pattern = /^### (RVP-[0-9]{3})([^\n]*)\n\n\*\*確認基準\*\*: ([^\n]+)$/gmu;
  for (const match of body.matchAll(pattern)) {
    contexts.push({ id: match[1], suffix: match[2], criterion: match[3] });
  }
  return contexts;
}

function renderReviewReporterBody(output: ReviewReporterOutput, scaffoldBody: string): string {
  const contexts = reviewViewpointContexts(scaffoldBody);
  const expectedIds = contexts.map((context) => context.id);
  const actualIds = output.viewpoint_results.map((viewpoint) => viewpoint.id);
  if (!isDeepStrictEqual(actualIds, expectedIds)) {
    throw new Error(
      `reporter viewpoint ids must match scaffold order: expected=[${expectedIds.join(", ")}], actual=[${actualIds.join(", ")}]`,
    );
  }
  const byId = new Map(output.viewpoint_results.map((viewpoint) => [viewpoint.id, viewpoint]));
  const viewpointSections =
    contexts.length === 0
      ? "- 観点別結果: 該当なし"
      : contexts
          .map((context) => {
            const viewpoint = byId.get(context.id);
            if (!viewpoint) throw new Error(`reporter viewpoint missing: ${context.id}`);
            return [
              `### ${context.id}${context.suffix}`,
              "",
              `**確認基準**: ${context.criterion}`,
              "",
              `- result: ${viewpoint.result}`,
              `- evidence: ${viewpoint.evidence.map(reporterInlineText).join(" / ")}`,
              `- notes: ${viewpoint.notes ? reporterInlineText(viewpoint.notes) : "なし"}`,
            ].join("\n");
          })
          .join("\n\n");
  return [
    "# Review Result",
    "",
    "## 1. レビュー観点別結果",
    "",
    viewpointSections,
    "",
    "## 2. findings",
    "",
    reporterBulletList(output.findings, "なし"),
    "",
    "## 3. 実践の型との整合確認",
    "",
    reporterInlineText(output.approach),
    "",
    "## 4. decision",
    "",
    `- recommendation: ${output.recommendation}`,
  ].join("\n");
}

/**
 * Replaces only the result body from schema-validated reporter data. The scaffolded frontmatter
 * remains byte-for-byte runner-owned until the lifecycle status update serializes it.
 */
export async function renderReporterResult(
  resultPath: string,
  output: ReporterOutput,
): Promise<void> {
  if (!existsSync(resultPath)) throw new Error(`Result not found: ${resultPath}`);
  const content = readFileSync(resultPath, "utf8");
  const parsed = parseSpecdojoDocument(content);
  if (parsed.data.mode !== output.mode) {
    throw new Error(`reporter mode does not match result scaffold: ${output.mode}`);
  }
  const frontmatter = content.match(/^---\r?\n[\s\S]*?\r?\n---/)?.[0];
  if (!frontmatter) throw new Error(`Result frontmatter not found: ${resultPath}`);
  const body =
    output.mode === "edit"
      ? renderEditReporterBody(output)
      : renderReviewReporterBody(output, parsed.body);
  writeFileSync(resultPath, frontmatterWithBody(frontmatter, body), "utf8");
  await formatMarkdownFile(resultPath);
}

export async function updateResultStatus(
  resultPath: string,
  status: "complete" | "blocked" | "superseded",
  completedAt: string,
  reason?: string,
): Promise<void> {
  if (!existsSync(resultPath)) return;

  const content = readFileSync(resultPath, "utf8");
  const { meta: existingMeta, targets: existingTargets, body } = parseFrontmatter(content);

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
    started_at: existingMeta.started_at ?? "",
    completed_at: completedAt,
    agent: existingMeta.agent,
    ...(parseOrigin(existingMeta.origin) ? { origin: parseOrigin(existingMeta.origin) } : {}),
    ...(existingMeta.job_id ? { job_id: existingMeta.job_id } : {}),
    ...(existingMeta.run_id ? { run_id: existingMeta.run_id } : {}),
    ...(existingMeta.plan_ref ? { plan_ref: existingMeta.plan_ref } : {}),
    ...(existingMeta.execution === "human" || existingMeta.execution === "agent"
      ? { execution: existingMeta.execution }
      : {}),
    approach: existingMeta.approach ? (existingMeta.approach as Approach) : undefined,
    ...(existingTargets ? { targets: existingTargets } : {}),
    ...(blockReason ? { block_reason: blockReason } : {}),
  };

  writeFileSync(resultPath, frontmatterWithBody(serializeFrontmatter(updatedMeta), body), "utf8");
  await formatMarkdownFile(resultPath);
}

// A fixed-name result is retained across attempts. Re-claiming starts a new attempt by resetting
// harness-owned lifecycle fields while preserving the prior body as handoff context; Git and exec
// events retain the previous completion record.
export async function resetResultForClaim(
  resultPath: string,
  agent: string,
  startedAt: string,
  execution?: "agent" | "human",
): Promise<void> {
  if (!existsSync(resultPath)) return;

  const content = readFileSync(resultPath, "utf8");
  const { meta: existingMeta, targets: existingTargets, body } = parseFrontmatter(content);
  const existingExecution =
    existingMeta.execution === "human" || existingMeta.execution === "agent"
      ? existingMeta.execution
      : undefined;
  const nextExecution = execution ?? existingExecution;
  const updatedMeta: ExecResultMeta = {
    id: existingMeta.id ?? "",
    type: "exec-result",
    task_id: existingMeta.task_id ?? "",
    mode: (existingMeta.mode as TaskMode) ?? "edit",
    status: "in_progress",
    project_id: existingMeta.project_id ?? "",
    started_at: startedAt,
    agent,
    ...(parseOrigin(existingMeta.origin) ? { origin: parseOrigin(existingMeta.origin) } : {}),
    ...(existingMeta.job_id ? { job_id: existingMeta.job_id } : {}),
    ...(existingMeta.run_id ? { run_id: existingMeta.run_id } : {}),
    ...(execution !== "human" && existingMeta.plan_ref ? { plan_ref: existingMeta.plan_ref } : {}),
    ...(nextExecution ? { execution: nextExecution } : {}),
    approach: existingMeta.approach ? (existingMeta.approach as Approach) : undefined,
    ...(existingTargets ? { targets: existingTargets } : {}),
  };

  writeFileSync(resultPath, frontmatterWithBody(serializeFrontmatter(updatedMeta), body), "utf8");
  await formatMarkdownFile(resultPath);
}

export type ResultTaskIdentity = {
  taskId: string;
  mode: TaskMode;
  projectId: string;
  execution?: "agent" | "human";
  approach?: Approach;
  origin?: TaskOrigin;
  targets?: string[];
};

// human タスクの commit scope を、plan ではなく checkpoint 済み result から復元する。
// 不正な値は採用せず、呼び出し側が既存の plan 由来解決へフォールバックできるようにする。
export function parseResultTaskIdentity(resultContent: string): ResultTaskIdentity | null {
  const { meta, targets } = parseFrontmatter(resultContent);
  const taskId = meta.task_id?.trim() ?? "";
  if (!taskId) return null;

  const mode: TaskMode = meta.mode === "review" ? "review" : "edit";
  const projectId = meta.project_id?.trim() ?? "";
  const execution =
    meta.execution === "human" || meta.execution === "agent" ? meta.execution : undefined;
  const approach =
    meta.approach &&
    [
      "fully-guided",
      "recipe-guided",
      "freeform",
      "bootstrap",
      "retrofit",
      "cross-deliverable-dedup",
      "rulebook-maintenance",
      "recipe-maintenance",
      "sample-maintenance",
      "template-maintenance",
      "finalize",
      "bootstrap-finalize",
    ].includes(meta.approach)
      ? (meta.approach as Approach)
      : undefined;

  const origin = parseOrigin(meta.origin);

  return {
    taskId,
    mode,
    projectId,
    ...(execution ? { execution } : {}),
    ...(approach ? { approach } : {}),
    ...(origin ? { origin } : {}),
    ...(targets ? { targets } : {}),
  };
}
