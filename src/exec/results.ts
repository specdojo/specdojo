import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { isDeepStrictEqual } from "node:util";
import { buildSpecdojoFrontmatter, parseSpecdojoDocument } from "../docs/frontmatter-namespace.js";
import { escapeMarkdownInline, expandTemplate, stripTerminalControlSequences } from "./shared.js";
import { formatMarkdownFile } from "./format.js";
import type { Approach, ExecResultMeta, TaskMode, TaskOrigin } from "./types.js";
import {
  deriveReporterFacts,
  mechanicallyNotApplicableReason,
  runnerOwnedValidationReason,
  type ReporterOutput,
  type ReviewReporterOutput,
} from "./reporter.js";
import type { ExecEvidence } from "./evidence.js";
import { resolveSpecdojoPath, resolveSpecdojoPathIfExists } from "../docs/template-resolution.js";
import { dump } from "../shared/yaml.js";
import { gitEnvironment } from "../shared/git-environment.js";

export const MAX_INDIVIDUAL_CHANGED_FILES = 50;

export type RenderEditReporterOptions = {
  lineStats?: Map<string, { additions: number; deletions: number }>;
  worktreeDir?: string;
  maxIndividualChangedFiles?: number;
  approach?: Approach;
};

// ---------------------------------------------------------------------------
// Frontmatter helpers
// ---------------------------------------------------------------------------

// frontmatter から読んだ origin を検証して返す。未知の値は採用せず undefined（= schedule）
// として扱う。status 更新のたびに meta を組み直すため、既存値の持ち回しに使う。
function parseOrigin(value: string | undefined): TaskOrigin | undefined {
  return value === "register" || value === "schedule" || value === "job" ? value : undefined;
}

// js-yaml に単一スカラーとして直列化させ、通常の識別子は従来どおり plain style のまま
// 保つ。改行を含む値だけは block scalar を frontmatter の行配列へ安全に埋め込めないため、
// YAML 1.2 でも有効な JSON の二重引用符形式へフォールバックする。
function serializeYamlString(value: string): string {
  const serialized = dump(value, { lineWidth: -1, noRefs: true }).replace(/\n$/, "");
  return serialized.includes("\n") ? JSON.stringify(value) : serialized;
}

function serializeFrontmatter(meta: ExecResultMeta): string {
  const inner = [
    `id: ${serializeYamlString(meta.id)}`,
    `type: ${meta.type}`,
    `task_id: ${serializeYamlString(meta.task_id)}`,
    `mode: ${meta.mode}`,
    `status: ${meta.status}`,
    `project_id: ${serializeYamlString(meta.project_id)}`,
  ];
  if (meta.origin) inner.push(`origin: ${meta.origin}`);
  if (meta.job_id) inner.push(`job_id: ${serializeYamlString(meta.job_id)}`);
  if (meta.run_id) inner.push(`run_id: ${serializeYamlString(meta.run_id)}`);
  if (meta.plan_ref) inner.push(`plan_ref: ${serializeYamlString(meta.plan_ref)}`);
  inner.push(`started_at: ${JSON.stringify(meta.started_at)}`);
  if (meta.completed_at) inner.push(`completed_at: ${JSON.stringify(meta.completed_at)}`);
  if (meta.agent) inner.push(`agent: ${serializeYamlString(meta.agent)}`);
  if (meta.execution) inner.push(`execution: ${meta.execution}`);
  if (meta.approach) inner.push(`approach: ${meta.approach}`);
  if (meta.targets && meta.targets.length > 0) {
    inner.push("targets:");
    for (const target of meta.targets) inner.push(`  - ${serializeYamlString(target)}`);
  }
  // reason は agent stderr や subprocess の生出力由来で任意文字を含みうる。まず ANSI エスケープ
  // シーケンスや制御文字を除去し（色付き hook 出力が result 表示を壊すのを防ぐ）、JSON の
  // 文字列形式で YAML へ埋め込む。改行・引用符・バックスラッシュも値を変えずに保持できる。
  if (meta.block_reason) {
    const safeReason = stripTerminalControlSequences(meta.block_reason);
    inner.push(`block_reason: ${JSON.stringify(safeReason)}`);
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
  if (mode === "edit" && approach === "cross-deliverable-dedup") {
    const crossDeliverablePath = resolveSpecdojoPathIfExists(
      "docs/ja/specdojo/exec-templates/xer-cross-deliverable-dedup-template.md",
    );
    if (crossDeliverablePath) return readFileSync(crossDeliverablePath, "utf8");
  }
  if (mode === "edit" && isFinalizeApproach(approach)) {
    const finalizePath = resolveSpecdojoPathIfExists(
      `docs/ja/specdojo/exec-templates/xer-human-${approach}-template.md`,
    );
    if (finalizePath) return readFileSync(finalizePath, "utf8");
  }
  const templatePath = resolveSpecdojoPath(
    `docs/ja/specdojo/exec-templates/${templateFileName(mode)}`,
  );
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

const APPROACH_SECTION_WITH_APPROACH = [
  "## 4. 進め方と実践の型の適用",
  "",
  "_TODO_: `approach` に従ってどう進めたか、その進め方の中で実践の型（rulebook / recipe / sample / template）をどう適用したかを記入する（`draft` で任された範囲・提案値ごとの出典と選定理由・反映した元の指示、`fully-guided` で rulebook / recipe / sample に沿って既存成果物をどう磨き込んだか、`recipe-guided` で recipe のみを基準にした内容、`freeform` で実践の型より優先した実例やプロジェクト文脈、`retrofit` で実際に参照した実装パス・抽出した現在動作・反映/新設判断・未反映の乖離・未確認範囲、`rulebook-authoring` などの authoring 系で手本から一般化した内容・変更しなかった手本・参照の付け替えまたは見送り、`rulebook-maintenance` などの maintenance 系で見直した実践の型とその根拠、など）。実践の型を基準にしなかった場合は、その判断と代わりに根拠にした内容も記入する。複数文書間に矛盾があり rulebook を正として判断した箇所、参照範囲から外れていた文書とその代わりに根拠にした内容があれば、あわせて記録する。",
].join("\n");

const APPROACH_SECTION_WITHOUT_APPROACH = [
  "## 4. 進め方",
  "",
  "_TODO_: どう進めたか、根拠にした文書や規約を記入する。",
].join("\n");

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

  const values: Record<string, string> = {
    _FRONTMATTER_: serializeFrontmatter(meta),
    _APPROACH_SECTION_: approach
      ? APPROACH_SECTION_WITH_APPROACH
      : APPROACH_SECTION_WITHOUT_APPROACH,
  };
  // Finalize results pre-expand the confirmation record (done_criteria checklist and
  // ready-promotion targets) so every finalize is verified against the same items.
  // When the caller cannot resolve them, leave _TODO_ markers for manual fill-in.
  if (isFinalizeApproach(approach)) {
    values._DONE_CRITERIA_CHECKLIST_ = opts.finalizeSections?.doneCriteriaChecklist ?? "_TODO_";
    values._FINALIZE_TARGETS_CHECKLIST_ = opts.finalizeSections?.targetsChecklist ?? "_TODO_";
  }
  let content = expandTemplate(template, values);
  if (!approach && content.includes("## 4. 進め方と実践の型の適用")) {
    content = content.replace(APPROACH_SECTION_WITH_APPROACH, APPROACH_SECTION_WITHOUT_APPROACH);
  }

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
  // recommendation は review が観点ごとに評価していた時期の xrr-template.md で scaffold された
  // result 用。改訂前の scaffold が未記入のまま完了扱いにならないよう検知を残す。
  review: ["verdict: _TODO_", "recommendation: _TODO_"],
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

// reporter / executor 由来の自由記述は result の Markdown 本文へ直接入る。改行や山括弧を
// 正規化したうえで、強調と解釈される `_` / `*` 入りの ASCII トークンを code span にする。
// escapeMarkdownInline は既存の code span を保持するため、agent が意図して付けた書式は二重化しない。
function reporterFreeText(value: string): string {
  return escapeMarkdownInline(reporterInlineText(value));
}

// reporter や runner の文を `- ` の箇条書きに描くとき、文が自前のリスト記号（`1.`・`1)`・
// `-`・`*`・`+`）で始まると `- 1. ...` が入れ子のリストとして解釈され、markdownlint の
// MD029 などに当たって pre-commit hook で記帳の commit が失敗する。箇条書きの記号は runner が
// 付けるため、先頭の記号は外す（番号の意味は箇条書きの順序で保たれる）。
export function stripLeadingListMarker(text: string): string {
  let current = text.trim();
  for (;;) {
    const next = current.replace(/^(?:\d{1,9}[.)]|[-*+])(?:\s+|$)/u, "").trim();
    if (next === current) return current;
    current = next;
  }
}

function reporterBulletList(values: string[], empty: string): string {
  if (values.length === 0) return `- ${empty}`;
  return values
    .map((value) => reporterFreeText(stripLeadingListMarker(reporterInlineText(value))))
    .map((text) => `- ${text || empty}`)
    .join("\n");
}

function findGitRoot(startDir: string): string | null {
  try {
    let current = resolve(startDir);
    while (true) {
      if (existsSync(join(current, ".git"))) {
        return current;
      }
      const parent = dirname(current);
      if (parent === current) return null;
      current = parent;
    }
  } catch {
    return null;
  }
}

function collectGitLineStats(
  worktreeDir: string,
  files: readonly { path: string; status: string }[],
): Map<string, { additions: number; deletions: number }> {
  const stats = new Map<string, { additions: number; deletions: number }>();
  try {
    const raw = execFileSync("git", ["diff", "--numstat", "-z", "HEAD", "--"], {
      cwd: worktreeDir,
      env: gitEnvironment(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    const parts = raw.split("\0");
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part) continue;
      const match = part.match(/^(\d+|-)\t(\d+|-)\t(.*)$/);
      if (match) {
        const adds = match[1] === "-" ? 0 : parseInt(match[1]!, 10);
        const dels = match[2] === "-" ? 0 : parseInt(match[2]!, 10);
        let p = match[3]!;
        if (!p && i + 2 < parts.length) {
          const oldPath = parts[++i]!;
          const newPath = parts[++i]!;
          p = newPath;
          stats.set(newPath, { additions: adds, deletions: dels });
          stats.set(`${oldPath} -> ${newPath}`, { additions: adds, deletions: dels });
          continue;
        }
        stats.set(p, { additions: adds, deletions: dels });
      }
    }
  } catch {
    // git diff failed or worktree is not a git repository
  }

  for (const file of files) {
    const targetPath = file.path.includes(" -> ") ? file.path.split(" -> ")[1]! : file.path;
    if (!stats.has(targetPath) && !stats.has(file.path)) {
      if (file.status === "??" || file.status.includes("A")) {
        try {
          const fullPath = join(worktreeDir, targetPath);
          if (existsSync(fullPath)) {
            const stat = statSync(fullPath);
            if (stat.isFile()) {
              const fileContent = readFileSync(fullPath, "utf8");
              const lines = fileContent.length === 0 ? 0 : fileContent.split("\n").length;
              const entry = { additions: lines, deletions: 0 };
              stats.set(targetPath, entry);
              if (file.path !== targetPath) {
                stats.set(file.path, entry);
              }
            }
          }
        } catch {
          // ignore unreadable files
        }
      }
    }
  }

  return stats;
}

function formatMissingSummary(
  file: { path: string; status: string },
  stats?: { additions: number; deletions: number },
): string {
  const isRename = file.status.includes("R") || file.path.includes(" -> ");
  const isAdd = file.status === "??" || file.status.includes("A");
  const isDelete = file.status.includes("D");

  let action: string;
  if (isRename) {
    const oldPath = file.path.includes(" -> ") ? file.path.split(" -> ")[0]! : undefined;
    action = oldPath ? `名前の変更（${reporterInlineText(oldPath)} から）` : "名前の変更";
  } else if (isAdd) {
    action = "追加";
  } else if (isDelete) {
    action = "削除";
  } else {
    action = "変更";
  }

  if (stats !== undefined) {
    return `${action}、+${stats.additions} / -${stats.deletions} 行`;
  }
  return action;
}

function getFileDirectory(filePath: string): string {
  let cleanPath = filePath;
  let repoPrefix = "";
  if (filePath.includes(":")) {
    const colonIdx = filePath.indexOf(":");
    repoPrefix = filePath.slice(0, colonIdx + 1);
    cleanPath = filePath.slice(colonIdx + 1);
  }
  const dir = dirname(cleanPath).split(sep).join("/");
  if (dir === "." || dir === "") {
    return repoPrefix ? `${repoPrefix}./` : "./";
  }
  return repoPrefix ? `${repoPrefix}${dir}/` : `${dir}/`;
}

export function renderEditReporterBody(
  output: Extract<ReporterOutput, { mode: "edit" }>,
  evidence: ExecEvidence,
  options?: RenderEditReporterOptions,
): string {
  const facts = deriveReporterFacts(evidence);
  const lineStats =
    options?.lineStats ??
    (options?.worktreeDir
      ? collectGitLineStats(options.worktreeDir, facts.changed_files)
      : undefined);
  const summariesByPath = new Map<string, string>();
  for (const file of output.changed_files) {
    // The evidence path list remains authoritative. Ignore invented paths and keep the first
    // description when a reporter repeats a path so rendering stays deterministic.
    if (!summariesByPath.has(file.path)) summariesByPath.set(file.path, file.summary);
  }

  const maxIndividual = options?.maxIndividualChangedFiles ?? MAX_INDIVIDUAL_CHANGED_FILES;
  let changedFiles: string;

  if (facts.changed_files.length === 0) {
    changedFiles = "- なし";
  } else if (facts.changed_files.length <= maxIndividual) {
    changedFiles = facts.changed_files
      .map((file) => {
        const displayPath = file.path.includes(" -> ") ? file.path.split(" -> ")[1]! : file.path;
        const reporterSummary = summariesByPath.get(displayPath) ?? summariesByPath.get(file.path);
        const summary =
          reporterSummary !== undefined && reporterSummary.trim().length > 0
            ? reporterSummary
            : formatMissingSummary(file, lineStats?.get(displayPath) ?? lineStats?.get(file.path));
        return `- \`${reporterInlineText(displayPath).replace(/`/g, "'")}\`: ${reporterFreeText(summary)}`;
      })
      .join("\n");
  } else {
    // Over threshold: list described files individually, and group undescribed files by directory.
    const describedFiles: Array<{
      displayPath: string;
      summary: string;
    }> = [];
    const undescribedFiles: Array<{
      displayPath: string;
      file: (typeof facts.changed_files)[number];
    }> = [];
    const describedCountByDir = new Map<string, number>();

    for (const file of facts.changed_files) {
      const displayPath = file.path.includes(" -> ") ? file.path.split(" -> ")[1]! : file.path;
      const reporterSummary = summariesByPath.get(displayPath) ?? summariesByPath.get(file.path);
      if (reporterSummary !== undefined && reporterSummary.trim().length > 0) {
        describedFiles.push({ displayPath, summary: reporterSummary });
        const dir = getFileDirectory(displayPath);
        describedCountByDir.set(dir, (describedCountByDir.get(dir) ?? 0) + 1);
      } else {
        undescribedFiles.push({ displayPath, file });
      }
    }

    const lines: string[] = [];
    for (const entry of describedFiles) {
      lines.push(
        `- \`${reporterInlineText(entry.displayPath).replace(/`/g, "'")}\`: ${reporterFreeText(entry.summary)}`,
      );
    }

    type DirGroup = {
      count: number;
      operations: Map<string, number>;
      additions: number;
      deletions: number;
      hasLineStats: boolean;
    };
    const dirGroups = new Map<string, DirGroup>();

    for (const entry of undescribedFiles) {
      const dir = getFileDirectory(entry.displayPath);
      let group = dirGroups.get(dir);
      if (!group) {
        group = {
          count: 0,
          operations: new Map<string, number>(),
          additions: 0,
          deletions: 0,
          hasLineStats: false,
        };
        dirGroups.set(dir, group);
      }
      group.count++;

      const isRename = entry.file.status.includes("R") || entry.file.path.includes(" -> ");
      const isAdd = entry.file.status === "??" || entry.file.status.includes("A");
      const isDelete = entry.file.status.includes("D");
      const op = isRename ? "名前の変更" : isAdd ? "追加" : isDelete ? "削除" : "変更";
      group.operations.set(op, (group.operations.get(op) ?? 0) + 1);

      const stats = lineStats?.get(entry.displayPath) ?? lineStats?.get(entry.file.path);
      if (stats !== undefined) {
        group.additions += stats.additions;
        group.deletions += stats.deletions;
        group.hasLineStats = true;
      }
    }

    const sortedDirs = [...dirGroups.keys()].sort((a, b) => a.localeCompare(b));
    const operationOrder = ["変更", "追加", "削除", "名前の変更"];

    for (const dir of sortedDirs) {
      const group = dirGroups.get(dir)!;
      const describedInDir = describedCountByDir.get(dir) ?? 0;
      const countText = describedInDir > 0 ? `ほか ${group.count} 件` : `${group.count} 件`;

      const sortedOps = [...group.operations.keys()].sort((a, b) => {
        const idxA = operationOrder.indexOf(a);
        const idxB = operationOrder.indexOf(b);
        return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
      });
      const opParts = sortedOps.map((op) => `${op} ${group.operations.get(op)} 件`);
      const lineStatsPart = group.hasLineStats
        ? `、+${group.additions} / -${group.deletions} 行`
        : "";
      lines.push(
        `- \`${reporterInlineText(dir)}\`: ${countText}（${opParts.join("、")}${lineStatsPart}）`,
      );
    }

    changedFiles = lines.length === 0 ? "- なし" : lines.join("\n");
  }
  const unchangedTargetNotes = (evidence?.target_coverage ?? [])
    .filter((entry) => entry.status === "unchanged")
    .map((entry) => {
      const target = reporterInlineText(entry.target).replace(/`/g, "'");
      return `対象 \`${target}\` は未変更: ${reporterFreeText(entry.reason)}`;
    });
  const humanValidationNotes = evidence.validations
    .filter(
      (validation) => validation.source !== "runner" && validation.status === "requires_human",
    )
    .map((validation) => {
      const command = reporterInlineText(validation.command).replace(/`/g, "'");
      const summary = reporterFreeText(validation.summary) || "要約なし";
      return `人の確認が必要: \`${command}\`（${summary}）`;
    });
  const notApplicableValidationNotes = evidence.validations
    .filter(
      (validation) => validation.source !== "runner" && validation.status === "not_applicable",
    )
    .map((validation) => {
      const command = reporterInlineText(validation.command).replace(/`/g, "'");
      const reason = reporterFreeText(validation.reason ?? "") || "理由なし";
      return `適用外の検証: \`${command}\`（${reason}）`;
    });
  const changedPaths = evidence.changes.map((change) => change.path);
  const runnerOwnedValidationNotes = evidence.validations
    .filter((validation) => validation.source !== "runner" && validation.status === "not_run")
    .flatMap((validation) => {
      const reason = runnerOwnedValidationReason(validation.command);
      if (reason === undefined) return [];
      const command = reporterInlineText(validation.command).replace(/`/g, "'");
      return [`runner が担う検証: \`${command}\`（${reporterFreeText(reason)}）`];
    });
  const runnerJudgedNotApplicableNotes = evidence.validations
    .filter((validation) => validation.source !== "runner" && validation.status === "not_run")
    .flatMap((validation) => {
      const reason = mechanicallyNotApplicableReason(validation.command, { changedPaths });
      if (reason === undefined) return [];
      const command = reporterInlineText(validation.command).replace(/`/g, "'");
      return [`適用外の検証（runner の判定）: \`${command}\`（${reporterFreeText(reason)}）`];
    });
  const rateLimitRecoveryNotes = (evidence.rate_limit_events ?? []).map((event) =>
    event.action === "wait"
      ? `rate limit 後に ${event.resume_at ?? "再開可能時刻"} まで待ち、${event.to_actor} で ${event.resumed_at} に再開`
      : `${event.trigger === "connection_error" ? "接続エラー" : "rate limit"}後に ${event.from_actor} から ${event.to_actor} へ切り替え、${event.resumed_at} に再開`,
  );
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
    reporterBulletList(
      [
        ...new Set([...output.handoff, ...(evidence.handoff ?? [])]),
        ...unchangedTargetNotes,
        ...notApplicableValidationNotes,
        ...runnerOwnedValidationNotes,
        ...runnerJudgedNotApplicableNotes,
        ...humanValidationNotes,
        ...rateLimitRecoveryNotes,
      ],
      "なし",
    ),
    "",
    options?.approach ? "## 4. 進め方と実践の型の適用" : "## 4. 進め方",
    "",
    reporterFreeText(output.approach),
  ].join("\n");
}

// review result の章立ては xrr-template.md と一致させる。review は成果物を再評価しないため、
// 観点別の結果ではなく評価結果の確認・判断根拠・改善指示・verdict を記録する。
function renderReviewReporterBody(output: ReviewReporterOutput, evidence: ExecEvidence): string {
  const rateLimitRecoveryNotes = (evidence.rate_limit_events ?? []).map((event) =>
    event.action === "wait"
      ? `rate limit 後に ${event.resume_at ?? "再開可能時刻"} まで待ち、${event.to_actor} で ${event.resumed_at} に再開`
      : `${event.trigger === "connection_error" ? "接続エラー" : "rate limit"}後に ${event.from_actor} から ${event.to_actor} へ切り替え、${event.resumed_at} に再開`,
  );
  return [
    "# Review Result",
    "",
    "## 1. 評価結果の確認",
    "",
    reporterFreeText(output.grade_check),
    "",
    "## 2. 判断根拠",
    "",
    reporterBulletList([...output.rationale, ...rateLimitRecoveryNotes], "なし"),
    "",
    "## 3. 未充足事項・改善指示",
    "",
    reporterBulletList(output.improvements, "なし"),
    "",
    "## 4. approach に応じた確認",
    "",
    reporterFreeText(output.approach),
    "",
    "## 5. decision",
    "",
    `- verdict: ${output.verdict}`,
  ].join("\n");
}

/**
 * Replaces only the result body from schema-validated reporter data. The scaffolded frontmatter
 * remains byte-for-byte runner-owned until the lifecycle status update serializes it.
 */
export async function renderReporterResult(
  resultPath: string,
  output: ReporterOutput,
  evidence: ExecEvidence,
  options?: RenderEditReporterOptions,
): Promise<void> {
  if (!existsSync(resultPath)) throw new Error(`Result not found: ${resultPath}`);
  const content = readFileSync(resultPath, "utf8");
  const parsed = parseSpecdojoDocument(content);
  if (parsed.data.mode !== output.mode) {
    throw new Error(`reporter mode does not match result scaffold: ${output.mode}`);
  }
  const frontmatter = content.match(/^---\r?\n[\s\S]*?\r?\n---/)?.[0];
  if (!frontmatter) throw new Error(`Result frontmatter not found: ${resultPath}`);

  const approach =
    options?.approach ??
    (typeof parsed.data.approach === "string" && parsed.data.approach.trim().length > 0
      ? (parsed.data.approach as Approach)
      : undefined);

  const resolvedOptions: RenderEditReporterOptions = {
    ...options,
    ...(approach ? { approach } : {}),
    worktreeDir: options?.worktreeDir ?? findGitRoot(dirname(resultPath)) ?? undefined,
  };

  const body =
    output.mode === "edit"
      ? renderEditReporterBody(output, evidence, resolvedOptions)
      : renderReviewReporterBody(output, evidence);
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
      "draft",
      "fully-guided",
      "recipe-guided",
      "freeform",
      "bootstrap",
      "catalog-planning",
      "strategy-planning",
      "rulebook-authoring",
      "recipe-authoring",
      "sample-authoring",
      "template-authoring",
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
