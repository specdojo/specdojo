import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { load } from "js-yaml";
import { DEFAULT_PROJECT_CONTEXT, specdojoRootDir } from "./specdojo-config.js";
import {
  kataDirsForKinds,
  resolveDeliverableSchemaRef,
  resolveIncludedRulebooks,
  resolveKataRefs,
} from "./kata.js";
import type { KataRefs } from "./kata.js";
import { resolveBasePath, resolveDeliverablePath } from "./catalog-paths.js";
import { isDctPlanFileName } from "./catalog-plan.js";
import { buildSpecdojoFrontmatter, readSpecdojoNamespace } from "./frontmatter-namespace.js";
import { formatMarkdownFile } from "./exec-format.js";
import { qualifyPracticeId, SPECDOJO_PRACTICE_AUTHORITY } from "./practice-id.js";
import {
  expandTemplate,
  listFilesRecursive,
  nowUtcIsoSeconds,
  randomHex,
  tsForFilenameUtc,
} from "./exec-shared.js";
import type { Approach, ExecPlanMeta, ReadyTaskView, TaskMode, TaskOrigin } from "./exec-types.js";
import type { CriteriaItem, DctDeliverableItem, DctDoc, DctSection } from "./catalog-types.js";
import type { CoverageType, ReviewViewpoint, ReviewViewpointsDoc } from "./review-types.js";
import type { RoleDefinition, RolesDoc } from "./role-types.js";

// ---------------------------------------------------------------------------
// Internal types
// ---------------------------------------------------------------------------

type PlanTask = ReadyTaskView & { mode: TaskMode };

type DeliverableInfo = {
  deliverable: DctDeliverableItem;
  resolvedPath: string;
};

export const MISSING = "_MISSING_";

function execDocId(projectId: string, prefix: "xep" | "xrp", localBase: string): string {
  const localId = `${prefix}-${localBase.toLowerCase()}`;
  return projectId ? `${projectId}:${localId}` : localId;
}

// In-place plan/result share one unique stem (`<slug>-<UTC>-<rand>`) so each run keeps a
// distinct file and id (no doc-index collision) and the result name is derivable from the
// plan. Mirrors the done/ archive naming convention (tsForFilenameUtc + randomHex).
export function buildInPlaceStem(slug: string): string {
  return `${slug}-${tsForFilenameUtc(nowUtcIsoSeconds())}-${randomHex(2)}`;
}

// Recover the shared stem from a plan path: `.../exec/plans/<stem>-plan.md` → `<stem>`.
// Used when re-running `--plan <path>` so the tied result is overwritten in place.
export function stemFromPlanPath(planPath: string): string {
  return basename(planPath).replace(/-plan\.md$/, "");
}

// ---------------------------------------------------------------------------
// Catalog helpers
// ---------------------------------------------------------------------------

function searchSections(
  sections: DctSection[],
  parentBase: string,
  localId: string,
): DeliverableInfo | null {
  for (const section of sections) {
    const sectionBase = resolveBasePath(parentBase, section.base_path);
    for (const d of section.deliverables ?? []) {
      if (d.local_id === localId) {
        return {
          deliverable: d,
          resolvedPath: resolveDeliverablePath(sectionBase, d.path),
        };
      }
    }
    const found = searchSections(section.groups ?? [], sectionBase, localId);
    if (found) return found;
  }
  return null;
}

function findDeliverableInfo(catalogPath: string, localId: string): DeliverableInfo | null {
  if (!catalogPath || !existsSync(catalogPath)) return null;
  // Catalog scans walk subdirectories, so agent judgment plans (plans/dct-plan-*.yaml)
  // must be excluded; they share the dct- prefix but carry no catalog structure.
  const files = listFilesRecursive(catalogPath)
    .filter((f) => {
      const name = f.split("/").pop() ?? "";
      return /^dct-.+\.ya?ml$/i.test(name) && !isDctPlanFileName(name);
    })
    .sort();

  for (const filePath of files) {
    let doc: DctDoc;
    try {
      doc = load(readFileSync(filePath, "utf8")) as DctDoc;
    } catch {
      continue;
    }
    const found = searchSections(doc.groups, resolveBasePath("", doc.base_path), localId);
    if (found) return found;
  }
  return null;
}

export type ResolvedDeliverable = {
  domain: string;
  localId: string;
  // Filename slug for ad-hoc plans. `local_id` is unique project-wide (catalog
  // validate warns otherwise), so the bare local_id is used.
  slug: string;
  info: DeliverableInfo;
};

function loadCatalogDocs(catalogPath: string): DctDoc[] {
  if (!catalogPath || !existsSync(catalogPath)) return [];
  // Catalog scans walk subdirectories, so agent judgment plans (plans/dct-plan-*.yaml)
  // must be excluded; they share the dct- prefix but carry no catalog structure.
  const files = listFilesRecursive(catalogPath)
    .filter((f) => {
      const name = f.split("/").pop() ?? "";
      return /^dct-.+\.ya?ml$/i.test(name) && !isDctPlanFileName(name);
    })
    .sort();

  const docs: DctDoc[] = [];
  for (const filePath of files) {
    try {
      docs.push(load(readFileSync(filePath, "utf8")) as DctDoc);
    } catch {
      continue;
    }
  }
  return docs;
}

// Resolve a `--deliverable` identifier (a bare `local_id`) to a catalog deliverable.
// `local_id` is unique project-wide (catalog validate warns otherwise); an ambiguous
// match is an error rather than a silent first match.
export function resolveDeliverableTarget(catalogPath: string, value: string): ResolvedDeliverable {
  const localId = value.trim();
  if (!localId) throw new Error("deliverable identifier is empty");
  const docs = loadCatalogDocs(catalogPath);

  const matches: ResolvedDeliverable[] = [];
  for (const doc of docs) {
    const info = searchSections(doc.groups, resolveBasePath("", doc.base_path), localId);
    if (info) matches.push({ domain: doc.domain, localId, slug: localId, info });
  }
  if (matches.length === 0) throw new Error(`deliverable not found: ${localId}`);
  if (matches.length > 1) {
    const domains = matches.map((m) => m.domain).join(", ");
    throw new Error(
      `ambiguous deliverable: ${localId} (defined in domains: ${domains}). ` +
        `local_id must be unique project-wide; run catalog validate.`,
    );
  }
  return matches[0];
}

function loadViewpoints(viewpointsPath: string): Map<string, ReviewViewpoint> {
  if (!viewpointsPath || !existsSync(viewpointsPath)) return new Map();
  try {
    const doc = load(readFileSync(viewpointsPath, "utf8")) as ReviewViewpointsDoc;
    return new Map((doc.viewpoints ?? []).map((vp) => [vp.id, vp]));
  } catch {
    return new Map();
  }
}

function loadCoverageTypes(viewpointsPath: string): Map<string, CoverageType> {
  if (!viewpointsPath || !existsSync(viewpointsPath)) return new Map();
  try {
    const doc = load(readFileSync(viewpointsPath, "utf8")) as ReviewViewpointsDoc;
    return new Map((doc.coverage_types ?? []).map((ct) => [ct.id, ct]));
  } catch {
    return new Map();
  }
}

function loadRoles(rolesPath: string | undefined): Map<string, RoleDefinition> {
  if (!rolesPath || !existsSync(rolesPath)) return new Map();
  try {
    const doc = load(readFileSync(rolesPath, "utf8")) as RolesDoc;
    return new Map((doc.roles ?? []).map((role) => [role.code, role]));
  } catch {
    return new Map();
  }
}

// Canonical repo-root-relative path: POSIX separators, no leading slash. Agents and
// tools resolve it from the run CWD (repo root for in-place, worktree root otherwise),
// so a leading slash (filesystem-absolute) must not be emitted.
function repoRelativePath(absPath: string): string {
  return relative(specdojoRootDir(), absPath).replace(/\\/g, "/");
}

// ---------------------------------------------------------------------------
// Markdown builders
// ---------------------------------------------------------------------------

function frontmatter(meta: ExecPlanMeta): string {
  const inner = [
    `id: ${meta.id}`,
    `type: ${meta.type}`,
    `rulebook: ${meta.rulebook}`,
    `task_id: ${meta.task_id}`,
    ...(meta.name ? [`name: ${meta.name}`] : []),
    `mode: ${meta.mode}`,
    `status: ${meta.status}`,
    `project_id: ${meta.project_id}`,
  ];
  if (meta.origin) inner.push(`origin: ${meta.origin}`);
  if (meta.owner) inner.push(`owner: ${meta.owner}`);
  if (meta.on_critical_path) inner.push(`on_critical_path: true`);
  if (meta.approach) inner.push(`approach: ${meta.approach}`);
  if (meta.targets && meta.targets.length > 0) {
    inner.push("targets:");
    for (const target of meta.targets) inner.push(`  - ${target}`);
  }
  return buildSpecdojoFrontmatter(inner);
}

// ---------------------------------------------------------------------------
// Template-based generation (edit-plan / review-plan テンプレートの展開)
// ---------------------------------------------------------------------------

// レビュー観点 1 件ぶんの記述ブロック断片。prose ラベル（確認基準・チェック観点など）は
// 言語別 docs/<lang>/.../templates のこの断片に置き、コードは値のみを供給する。
const REVIEW_VIEWPOINT_DETAIL_TEMPLATE = "xrp-viewpoint-detail-template.md";

// Per-RVP fragment for a review *result* (section 1). Prose labels for result/evidence/notes
// live here; code supplies only data values.
const REVIEW_RESULT_VIEWPOINT_DETAIL_TEMPLATE = "xrr-viewpoint-detail-template.md";

// Shared conventions (link notation など) appended to every generated plan. The plan is the
// only context guaranteed to reach the executing agent regardless of tool (it is piped via
// stdin), so cross-tool rules must travel with the plan rather than tool-specific instruction
// files. Kept as a single fragment to avoid duplicating the rule across every plan template.
const COMMON_CONVENTIONS_TEMPLATE = "xep-common-conventions-template.md";

export function templatesDir(): string {
  return join(specdojoRootDir(), "docs/ja/specdojo/templates");
}

function templatePrefix(mode: TaskMode): string {
  return mode === "review" ? "xrp" : "xep";
}

function standardTemplateFileName(mode: TaskMode): string {
  return `${templatePrefix(mode)}-template.md`;
}

function approachTemplateFileName(mode: TaskMode, approach: Approach): string {
  return `${templatePrefix(mode)}-${approach}-template.md`;
}

// Selects <prefix>-<approach>-template.md when it exists, falling back
// to the standard <prefix>-template.md. Any missing variant falls through to the
// next candidate so a plan is always produced.
function resolvePlanTemplatePath(mode: TaskMode, approach: Approach | undefined): string {
  if (approach) {
    const candidatePath = join(templatesDir(), approachTemplateFileName(mode, approach));
    if (existsSync(candidatePath)) return candidatePath;
  }
  return join(templatesDir(), standardTemplateFileName(mode));
}

function readTemplate(templatePath: string, cache: Map<string, string>): string {
  const cached = cache.get(templatePath);
  if (cached !== undefined) return cached;
  if (!existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }
  const content = readFileSync(templatePath, "utf8");
  cache.set(templatePath, content);
  return content;
}

function loadPlanTemplate(
  mode: TaskMode,
  approach: Approach | undefined,
  cache: Map<string, string>,
): string {
  return readTemplate(resolvePlanTemplatePath(mode, approach), cache);
}

function loadViewpointDetailTemplate(cache: Map<string, string>): string {
  return readTemplate(join(templatesDir(), REVIEW_VIEWPOINT_DETAIL_TEMPLATE), cache);
}

// Marker a plan template places to control where the shared conventions fragment lands.
const COMMON_CONVENTIONS_PLACEHOLDER = "_COMMON_CONVENTIONS_";
// Placeholder in the conventions fragment for the resolved schema path. The agent cannot derive
// the schema path on its own (it would have to hunt for it and risks burning its turn before
// filling the result), so the generator resolves it deterministically and bakes it in here.
const SCHEMA_REF_PLACEHOLDER = "_SCHEMA_REF_";

// Injects the shared conventions fragment into a built plan body so every generated plan carries
// the same rules (e.g. link notation) in its own text, independent of the executing tool. A
// template controls placement via the COMMON_CONVENTIONS_PLACEHOLDER marker; templates without the
// marker get the block appended so the rules are never silently dropped.
// schemaRef is the resolved schema path: when MISSING (non-yaml deliverable or no schema), the
// schema-validation bullet is dropped so the plan never asks for a check it cannot specify.
export function injectCommonConventions(
  body: string,
  schemaRef: string,
  cache: Map<string, string>,
): string {
  let conventions = readTemplate(
    join(templatesDir(), COMMON_CONVENTIONS_TEMPLATE),
    cache,
  ).trimEnd();
  conventions =
    schemaRef === MISSING
      ? conventions
          .split("\n")
          .filter((line) => !line.includes(SCHEMA_REF_PLACEHOLDER))
          .join("\n")
      : conventions.split(SCHEMA_REF_PLACEHOLDER).join(schemaRef);
  if (body.includes(COMMON_CONVENTIONS_PLACEHOLDER)) {
    return body.split(COMMON_CONVENTIONS_PLACEHOLDER).join(conventions);
  }
  return `${body.trimEnd()}\n\n${conventions}\n`;
}

function phaseDescriptionText(task: PlanTask): string {
  if (task.description) return task.description.trimEnd();
  return task.name ?? task.id;
}

function deliverablePath(deliverable: DeliverableInfo | null): string {
  return deliverable?.resolvedPath ?? MISSING;
}

function deliverableName(deliverable: DeliverableInfo | null): string {
  return deliverable?.deliverable.name ?? MISSING;
}

// 対象成果物の depends_on を、依存先 doc の [[id]] 参照の入れ子リストで提示する。
// id は project 修飾 doc id（<projectId>:<local_id>）にする。素の local_id は doc-index で
// 解決しないため。agent へ plan を渡すときに expandPromptRefs（src/exec-run.ts, format:'path'）が
// この [[id]] を doc-index 経由でリポジトリ相対パスへ展開し、agent が先行成果物を直接開ける。
// テンプレート側はラベル直後にこの値を差し込むため、件数 0・成果物未解決時は先頭スペース付きの
// インライン値、依存ありの場合は改行始まりの入れ子リストを返す。
function deliverableDependsOn(deliverable: DeliverableInfo | null, projectId: string): string {
  if (!deliverable) return ` ${MISSING}`;
  const deps = deliverable.deliverable.depends_on ?? [];
  if (deps.length === 0) return " -";
  const lines = deps.map((dep) => `  - [[${projectId ? `${projectId}:${dep}` : dep}]]`);
  return `\n${lines.join("\n")}`;
}

const PROJECT_CONTEXT_EXCLUDED_APPROACHES = new Set<Approach>([
  "cross-deliverable-dedup",
  "rulebook-maintenance",
  "recipe-maintenance",
  "sample-maintenance",
  "template-maintenance",
  "finalize",
  "bootstrap-finalize",
]);

// Project context is project-level guidance, not an ordering/evidence edge. It is rendered only
// for deliverable edit/review work, separately from depends_on, and is deliberately omitted for
// maintenance/finalize work and when the target itself is the configured context document.
function projectContextSection(
  refs: readonly string[],
  deliverable: DeliverableInfo | null,
  approach: Approach | undefined,
  projectId: string,
): string {
  if (!deliverable || (approach && PROJECT_CONTEXT_EXCLUDED_APPROACHES.has(approach))) return "";

  const targetId = qualifiedDocId(projectId, deliverable.deliverable.local_id);
  const qualifiedRefs = [
    ...new Set(
      refs
        .map((ref) => ref.trim())
        .filter(Boolean)
        .map((ref) => (ref.includes(":") ? ref : qualifiedDocId(projectId, ref)))
        .filter((ref) => ref !== targetId),
    ),
  ];
  if (qualifiedRefs.length === 0) return "";

  return [
    "### プロジェクトコンテキスト",
    "",
    "以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。",
    "",
    ...qualifiedRefs.map((ref) => `- [[${ref}]]`),
    "",
    "プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。",
  ].join("\n");
}

function deliverableOverview(deliverable: DeliverableInfo | null): string {
  return deliverable?.deliverable.overview ?? MISSING;
}

function implementationEvidence(deliverable: DeliverableInfo | null): string {
  const refs = deliverable?.deliverable.evidence_refs ?? [];
  if (refs.length === 0) return MISSING;
  return refs.map((ref) => `- \`${ref.path}\`（${ref.kind}）: ${ref.purpose}`).join("\n");
}

// edit plan の「完了の狙い」用。一文書一責務のため、done_criteria を owner ロールの狙いと
// 下流ロールの入力適合に分けて提示する。owner の狙いを作成目標とし、下流は入力として最低限
// 成立させる範囲にとどめる（各ロールの内容を作り込まない）。下流の適合性検証や観点別の自己
// レビューは edit plan では行わず、多観点検証は独立した review plan に委ねる。
// owner が done_criteria に現れない場合は分割せず全件を素の箇条書きにフォールバックする。
function doneCriteriaGoals(criteria: CriteriaItem[], owner: string | undefined): string {
  if (criteria.length === 0) return MISSING;
  const ownerCriteria = owner ? criteria.filter((c) => c.roles.includes(owner)) : [];
  if (ownerCriteria.length === 0) {
    return criteria.map((c) => `- ${c.text}`).join("\n");
  }
  const downstream = criteria.filter((c) => !c.roles.includes(owner as string));
  const lines: string[] = ["owner として達成する狙い:", ""];
  for (const c of ownerCriteria) lines.push(`- ${c.text}`);
  if (downstream.length > 0) {
    lines.push("");
    lines.push(
      "下流ロールの入力適合（最低ライン。各ロールの内容は作り込まず、入力として成立させる）:",
    );
    lines.push("");
    for (const c of downstream) lines.push(`- [${c.roles.join(", ")}] ${c.text}`);
  }
  return lines.join("\n");
}

// done_criteria を人間の最終確認用チェックリストに整形する。owner/下流の分割はせず、
// 各項目を `- [ ] <text>` の素のチェック項目にする（human finalize は多観点の作り込みでは
// なく、完成版が done_criteria を満たすかの確認が目的のため）。criteria が空なら MISSING。
function doneCriteriaChecklist(criteria: CriteriaItem[]): string {
  if (criteria.length === 0) return MISSING;
  return criteria.map((c) => `- [ ] ${c.text}`).join("\n");
}

// done_criteria を plan 提示用の素の箇条書きに整形する。チェックの記録は result 側の
// チェックリストで行うため、plan では「何を確認するか」の列挙にとどめる。
function doneCriteriaItems(criteria: CriteriaItem[]): string {
  if (criteria.length === 0) return MISSING;
  return criteria.map((c) => `- ${c.text}`).join("\n");
}

// 主 rulebook が include する rulebook を plan へ注入する表記に整形する。
// 併せて適用する rulebook（記法など）を backtick 付きパスのカンマ区切りで示す。
// include が無い場合は他の参照と同様に MISSING を返す。
function rulebookIncludesText(rulebookId: string | undefined): string {
  const paths = resolveIncludedRulebooks(rulebookId);
  if (paths.length === 0) return MISSING;
  return paths.map((p) => `\`${p}\``).join(", ");
}

// 実践の型の doc id を正準パス（docs/ja/specdojo/<kind>s/<id>.<ext>）の basename から導出する。
// 実践の型の frontmatter id はファイル名と一致する規約（specdojo:docs-structure-guide）を前提にする。
function refDocIdFromPath(refPath: string): string {
  const localId = basename(refPath).replace(/\.(md|yaml|json)$/, "");
  const parts = refPath.split("/");
  const authority =
    parts[0] === "docs" && /^[a-z]{2}$/.test(parts[1] ?? "")
      ? parts[2]
      : SPECDOJO_PRACTICE_AUTHORITY;
  return qualifyPracticeId(authority ?? SPECDOJO_PRACTICE_AUTHORITY, localId);
}

// approach ごとに、成果物に加えて変更・確定の対象になる実践の型の種別。
const TARGET_REF_KINDS: Partial<Record<Approach, readonly (keyof KataRefs)[]>> = {
  bootstrap: ["rulebook", "recipe", "sample", "template"],
  "bootstrap-finalize": ["rulebook", "recipe", "sample", "template"],
  "rulebook-maintenance": ["rulebook"],
  "recipe-maintenance": ["recipe"],
  "sample-maintenance": ["sample"],
  "template-maintenance": ["template"],
};

function qualifiedDocId(projectId: string, localId: string): string {
  return projectId ? `${projectId}:${localId}` : localId;
}

// タスクが対象とする文書の doc id リスト。先頭は対象成果物（project 修飾 doc id）、
// 以降は approach に応じて変更・確定しうる実践の型の doc id。いずれも doc-index で
// パスへ解決できる id にし、schedule やファイル名の命名規約に依存せず対象を機械的に
// 取得できるようにする。解決できない実践の型（_MISSING_）は含めない。
// targets は frontmatter の必須項目のため、catalog で成果物を解決できない場合も
// fallbackLocalId から成果物の doc id だけは組み立てる。
function targetDocIds(
  projectId: string,
  deliverable: DeliverableInfo | null,
  approach: Approach | undefined,
  fallbackLocalId?: string,
): string[] {
  if (!deliverable) {
    return fallbackLocalId ? [qualifiedDocId(projectId, fallbackLocalId)] : [];
  }
  const ids = [qualifiedDocId(projectId, deliverable.deliverable.local_id)];
  const kinds = approach ? (TARGET_REF_KINDS[approach] ?? []) : [];
  if (kinds.length === 0) return ids;
  const refs = resolveKataRefs(deliverable.deliverable.rulebook, deliverable.deliverable);
  for (const kind of kinds) {
    const refPath = refs[kind];
    if (refPath !== MISSING) ids.push(refDocIdFromPath(refPath));
  }
  return ids;
}

function targetDocIdsForTask(
  projectId: string,
  task: Pick<ReadyTaskView, "local_id" | "target_local_ids" | "approach">,
  deliverable: DeliverableInfo | null,
): string[] {
  if (task.target_local_ids && task.target_local_ids.length > 0) {
    return [...new Set(task.target_local_ids)].map((localId) => qualifiedDocId(projectId, localId));
  }
  return targetDocIds(projectId, deliverable, task.approach, task.local_id);
}

// approach が実践の型の変更を伴う場合に、変更を許可するディレクトリ（repo ルート相対）。
// commit 許可リスト（exec-worktree-ops）から使う。
export function targetReferenceDirsForApproach(approach: Approach | undefined): string[] {
  const kinds = approach ? (TARGET_REF_KINDS[approach] ?? []) : [];
  return kataDirsForKinds(kinds);
}

// catalog から成果物 local_id の文書パス（repo ルート相対）を解決する。
// 未作成の成果物でも catalog が宣言するパスを返せるため、doc-index に載る前の
// 新規成果物の commit 許可判定に使う。
export function deliverableDocPath(catalogPath: string, localId: string): string | undefined {
  return findDeliverableInfo(catalogPath, localId)?.resolvedPath;
}

// Resolve the target doc ids for a deliverable by local_id (result scaffold 用)。
// localId が不明な場合のみ undefined を返す。catalog で成果物を解決できない場合は
// 成果物の doc id 1 件へフォールバックする（targets は必須項目のため）。
export function targetDocIdsForDeliverable(
  catalogPath: string,
  localId: string | undefined,
  projectId: string,
  approach: Approach | undefined,
): string[] | undefined {
  if (!localId) return undefined;
  const info = catalogPath ? findDeliverableInfo(catalogPath, localId) : null;
  const ids = targetDocIds(projectId, info, approach, localId);
  return ids.length > 0 ? ids : undefined;
}

// Resolve every target of a scheduled task. Cross-deliverable tasks carry an explicit
// target_local_ids list; ordinary tasks keep the single-deliverable/reference-material behavior.
export function targetDocIdsForScheduledTask(
  catalogPath: string,
  task: Pick<ReadyTaskView, "local_id" | "target_local_ids" | "approach">,
  projectId: string,
): string[] | undefined {
  if (task.target_local_ids && task.target_local_ids.length > 0) {
    const ids = [...new Set(task.target_local_ids)].map((localId) =>
      qualifiedDocId(projectId, localId),
    );
    return ids.length > 0 ? ids : undefined;
  }
  return targetDocIdsForDeliverable(catalogPath, task.local_id, projectId, task.approach);
}

function crossDeliverableTargetDetails(
  projectId: string,
  localIds: readonly string[],
  deliverables: Map<string, DeliverableInfo>,
): string {
  const lines: string[] = [];
  for (const localId of localIds) {
    const info = deliverables.get(localId);
    lines.push(`### ${qualifiedDocId(projectId, localId)}`);
    lines.push("");
    lines.push(`- document: [[${qualifiedDocId(projectId, localId)}]]`);
    lines.push(`- name: ${deliverableName(info ?? null)}`);
    lines.push(`- path: \`${deliverablePath(info ?? null)}\``);
    lines.push(`- overview: ${deliverableOverview(info ?? null)}`);
    lines.push(`- depends_on:${deliverableDependsOn(info ?? null, projectId)}`);
    lines.push("- done_criteria:");
    const criteria = info?.deliverable.done_criteria ?? [];
    if (criteria.length === 0) lines.push(`  - ${MISSING}`);
    else {
      for (const criterion of criteria) {
        lines.push(
          `  - [${criterion.roles.join(", ")} / ${criterion.viewpoint}] ${criterion.text}`,
        );
      }
    }
    lines.push("");
  }
  return lines.join("\n").trimEnd();
}

function reviewViewpointRows(criteria: CriteriaItem[]): string {
  if (criteria.length === 0) return MISSING;
  const lines: string[] = [];
  criteria.forEach((c, i) => {
    const vpId = `RVP-${String(i + 1).padStart(3, "0")}`;
    lines.push(`| ${vpId} | ${c.roles.join(", ")} | ${c.viewpoint} | ${c.text} |`);
  });
  return lines.join("\n");
}

// Per-RVP skeleton for a review result's section 1. Each block carries the role,
// viewpoint_id and criterion as context so the result is self-contained, and leaves
// result / evidence / notes as _TODO_ for the agent to fill. Prose labels live in the
// detailTemplate (language-specific docs/<lang>/.../templates); code supplies only values.
export function reviewResultSections(criteria: CriteriaItem[], detailTemplate: string): string {
  if (criteria.length === 0) return MISSING;
  return criteria
    .map((c, i) => {
      const vpId = `RVP-${String(i + 1).padStart(3, "0")}`;
      return expandTemplate(detailTemplate, {
        _VP_ID_: vpId,
        _VP_ROLES_: c.roles.join(", "),
        _VP_VIEWPOINT_: c.viewpoint,
        _VP_CRITERION_: c.text,
      }).trimEnd();
    })
    .join("\n\n");
}

// Resolve the review result sections for a deliverable by local_id. Returns undefined when
// the catalog, deliverable, or its done_criteria cannot be resolved; the caller then falls
// back to a generic result body.
export function reviewResultSectionsForDeliverable(
  catalogPath: string,
  localId: string | undefined,
): string | undefined {
  if (!catalogPath || !localId) return undefined;
  const info = findDeliverableInfo(catalogPath, localId);
  const criteria = info?.deliverable.done_criteria ?? [];
  if (criteria.length === 0) return undefined;
  const detailTemplate = readTemplate(
    join(templatesDir(), REVIEW_RESULT_VIEWPOINT_DETAIL_TEMPLATE),
    new Map<string, string>(),
  );
  return reviewResultSections(criteria, detailTemplate);
}

// finalize / bootstrap-finalize の result に焼き込む確認記録セクション。
export type FinalizeResultSections = {
  doneCriteriaChecklist: string;
  targetsChecklist: string;
};

// done_criteria を確認記録用チェックボックスに整形する。各項目に roles / viewpoint
// （review-viewpoints の観点 ID）を注記し、どの観点で確認したかが result に残るようにする。
function doneCriteriaResultChecklist(criteria: CriteriaItem[]): string {
  return criteria
    .map((c) => {
      const annotation = [c.roles.join(", "), c.viewpoint].filter(Boolean).join(" / ");
      return annotation ? `- [ ] ${c.text}（${annotation}）` : `- [ ] ${c.text}`;
    })
    .join("\n");
}

// 確定対象（status を ready へ昇格する対象）のチェックリスト。成果物を先頭に、
// bootstrap-finalize では解決できた実践の型（_MISSING_ 以外）を続ける。
function finalizeTargetsChecklist(deliverable: DeliverableInfo, approach: Approach): string {
  const lines = [`- [ ] 成果物: \`${deliverablePath(deliverable)}\``];
  if (approach === "bootstrap-finalize") {
    const refs = resolveKataRefs(deliverable.deliverable.rulebook, deliverable.deliverable);
    const entries: [string, string][] = [
      ["rulebook", refs.rulebook],
      ["recipe", refs.recipe],
      ["sample", refs.sample],
      ["template", refs.template],
    ];
    for (const [kind, ref] of entries) {
      if (ref !== MISSING) lines.push(`- [ ] ${kind}: \`${ref}\``);
    }
  }
  return lines.join("\n");
}

// Resolve the finalize result sections for a deliverable by local_id. Returns undefined when
// the catalog, deliverable, or its done_criteria cannot be resolved; the caller then falls
// back to a generic result body (placeholders stay _TODO_).
export function finalizeResultSectionsForDeliverable(
  catalogPath: string,
  localId: string | undefined,
  approach: Approach,
): FinalizeResultSections | undefined {
  if (!catalogPath || !localId) return undefined;
  const info = findDeliverableInfo(catalogPath, localId);
  if (!info) return undefined;
  const criteria = info.deliverable.done_criteria ?? [];
  if (criteria.length === 0) return undefined;
  return {
    doneCriteriaChecklist: doneCriteriaResultChecklist(criteria),
    targetsChecklist: finalizeTargetsChecklist(info, approach),
  };
}

// coverage_types はビューポート任意項目。持たない観点では coverage_required ブロック
// ごと省略し、持つ観点では見出し付きブロックを返す。末尾の空行で後続の `**チェック観点:**`
// と段落を分離する。各項目は `id: description` 形式で展開し、id 単独では意味が読み取れない
// 問題を避ける。pm-review-viewpoints.yaml の coverage_types 定義に説明が無い id は id のみ出力する。
function viewpointCoverage(
  vp: ReviewViewpoint | undefined,
  coverageMap: Map<string, CoverageType>,
): string {
  if (!vp?.coverage_types || vp.coverage_types.length === 0) return "";
  const items = vp.coverage_types
    .map((ct) => {
      const description = coverageMap.get(ct)?.description;
      return description ? `- ${ct}: ${description}` : `- ${ct}`;
    })
    .join("\n");
  return `**coverage_required:**\n\n${items}\n\n`;
}

// レビュー観点ごとに detail 断片テンプレートを展開して結合する。prose ラベルは
// detailTemplate 側にあり、ここでは値を差し込むだけ。値が無い項目は他のプレースホルダと
// 同様に MISSING にし、表示構造はテンプレート側に委ねる。
export function reviewViewpointDetails(
  criteria: CriteriaItem[],
  vpMap: Map<string, ReviewViewpoint>,
  detailTemplate: string,
  coverageMap: Map<string, CoverageType> = new Map(),
): string {
  if (criteria.length === 0) return MISSING;
  return criteria
    .map((c, i) => {
      const vpId = `RVP-${String(i + 1).padStart(3, "0")}`;
      const vp = vpMap.get(c.viewpoint);
      return expandTemplate(detailTemplate, {
        _VP_ID_: vpId,
        _VP_ROLES_: c.roles.join(", "),
        _VP_VIEWPOINT_: c.viewpoint,
        _VP_CRITERION_: c.text,
        _VP_COVERAGE_: viewpointCoverage(vp, coverageMap),
        _VP_CHECK_: vp?.check ?? MISSING,
        _VP_EVIDENCE_: vp?.evidence ?? MISSING,
      }).trimEnd();
    })
    .join("\n\n");
}

// owner ロール視点の記述ガイドを構成するデータ値。prose ラベルや見出しは
// テンプレート側（言語別 docs/<lang>/.../templates）に置き、ここでは値のみを供給する。
type OwnerRoleFields = {
  // owner の Role code（role 名が pm-roles.yaml にあれば `code（name）` 形式）。
  label: string;
  // pm-roles.yaml の責務（project_note）。
  note: string;
  // pm-review-viewpoints.yaml の該当 role 観点（`- title: check` の箇条書き）。
  viewpoints: string;
};

// owner の Role code から、pm-roles.yaml の責務（project_note）と
// pm-review-viewpoints.yaml の該当 role 観点を取り出す。owner 未設定や情報欠落時は
// 他のプレースホルダと同様に MISSING を返し、表示構造はテンプレート側に委ねる。
export function ownerRoleFields(
  owner: string | undefined,
  roleMap: Map<string, RoleDefinition>,
  vpMap: Map<string, ReviewViewpoint>,
): OwnerRoleFields {
  if (!owner) {
    return { label: MISSING, note: MISSING, viewpoints: MISSING };
  }

  const role = roleMap.get(owner);
  const label = role?.name ? `${owner}（${role.name}）` : owner;
  const note = role?.project_note ?? MISSING;

  const roleViewpoints = [...vpMap.values()].filter((vp) => vp.role === owner);
  const viewpoints =
    roleViewpoints.length > 0
      ? roleViewpoints.map((vp) => `- ${vp.title}: ${vp.check}`).join("\n")
      : MISSING;

  return { label, note, viewpoints };
}

// edit plan は観点別の自己レビューを行わない。done_criteria は §3 の owner 視点とは別に
// 「完了の狙い」として素の箇条書きで提示し、多観点検証は独立した review plan に委ねる。
function buildEditPlanMarkdown(
  template: string,
  task: PlanTask,
  deliverable: DeliverableInfo | null,
  roleMap: Map<string, RoleDefinition>,
  vpMap: Map<string, ReviewViewpoint>,
  projectId: string,
  projectContext: readonly string[],
  resultRef: string,
  stem: string,
  crossDeliverables: Map<string, DeliverableInfo> = new Map(),
): string {
  const cpm = task.cpm;
  const onCriticalPath = cpm !== undefined && cpm.slack === 0;
  const targets = targetDocIdsForTask(projectId, task, deliverable);

  const meta: ExecPlanMeta = {
    id: execDocId(projectId, "xep", stem),
    type: "exec-plan",
    rulebook: "none",
    task_id: task.id,
    ...(task.name ? { name: task.name } : {}),
    mode: "edit",
    status: "ready",
    project_id: projectId,
    ...(task.owner ? { owner: task.owner } : {}),
    ...(onCriticalPath ? { on_critical_path: true as const } : {}),
    ...(task.approach ? { approach: task.approach } : {}),
    ...(targets.length > 0 ? { targets } : {}),
  };

  const criteria: CriteriaItem[] = deliverable?.deliverable.done_criteria ?? [];
  const ownerRole = ownerRoleFields(task.owner, roleMap, vpMap);
  const refs = resolveKataRefs(deliverable?.deliverable.rulebook, deliverable?.deliverable ?? {});
  const values: Record<string, string> = {
    _FRONTMATTER_: frontmatter(meta),
    _TASK_ID_: task.id,
    _PHASE_DESCRIPTION_: phaseDescriptionText(task),
    _DELIVERABLE_NAME_: deliverableName(deliverable),
    _DELIVERABLE_DEPENDS_ON_: deliverableDependsOn(deliverable, projectId),
    _PROJECT_CONTEXT_: projectContextSection(projectContext, deliverable, task.approach, projectId),
    _DELIVERABLE_OVERVIEW_: deliverableOverview(deliverable),
    _IMPLEMENTATION_EVIDENCE_: implementationEvidence(deliverable),
    _DELIVERABLE_PATH_: deliverablePath(deliverable),
    _RESULT_REF_: resultRef,
    _RULEBOOK_REF_: refs.rulebook,
    _RULEBOOK_INCLUDES_: rulebookIncludesText(deliverable?.deliverable.rulebook),
    _RECIPE_REF_: refs.recipe,
    _SAMPLE_REF_: refs.sample,
    _TEMPLATE_REF_: refs.template,
    _OWNER_ROLE_LABEL_: ownerRole.label,
    _OWNER_ROLE_NOTE_: ownerRole.note,
    _OWNER_ROLE_VIEWPOINTS_: ownerRole.viewpoints,
    _DONE_CRITERIA_GOALS_: doneCriteriaGoals(criteria, task.owner),
    _DONE_CRITERIA_CHECKLIST_: doneCriteriaChecklist(criteria),
    _DONE_CRITERIA_ITEMS_: doneCriteriaItems(criteria),
    _TARGET_DELIVERABLES_: crossDeliverableTargetDetails(
      projectId,
      task.target_local_ids ?? [],
      crossDeliverables,
    ),
  };
  return expandTemplate(template, values);
}

function buildReviewPlanMarkdown(
  template: string,
  detailTemplate: string,
  task: PlanTask,
  deliverable: DeliverableInfo | null,
  criteria: CriteriaItem[],
  vpMap: Map<string, ReviewViewpoint>,
  coverageMap: Map<string, CoverageType>,
  projectId: string,
  projectContext: readonly string[],
  resultRef: string,
  stem: string,
): string {
  const cpm = task.cpm;
  const onCriticalPath = cpm !== undefined && cpm.slack === 0;

  const targets = targetDocIds(projectId, deliverable, task.approach, task.local_id);

  const meta: ExecPlanMeta = {
    id: execDocId(projectId, "xrp", stem),
    type: "exec-plan",
    rulebook: "none",
    task_id: task.id,
    ...(task.name ? { name: task.name } : {}),
    mode: "review",
    status: "ready",
    project_id: projectId,
    ...(task.owner ? { owner: task.owner } : {}),
    ...(onCriticalPath ? { on_critical_path: true as const } : {}),
    ...(task.approach ? { approach: task.approach } : {}),
    ...(targets.length > 0 ? { targets } : {}),
  };

  const refs = resolveKataRefs(deliverable?.deliverable.rulebook, deliverable?.deliverable ?? {});
  const values: Record<string, string> = {
    _FRONTMATTER_: frontmatter(meta),
    _TASK_ID_: task.id,
    _PHASE_DESCRIPTION_: phaseDescriptionText(task),
    _DELIVERABLE_NAME_: deliverableName(deliverable),
    _DELIVERABLE_DEPENDS_ON_: deliverableDependsOn(deliverable, projectId),
    _PROJECT_CONTEXT_: projectContextSection(projectContext, deliverable, task.approach, projectId),
    _DELIVERABLE_OVERVIEW_: deliverableOverview(deliverable),
    _IMPLEMENTATION_EVIDENCE_: implementationEvidence(deliverable),
    _DELIVERABLE_PATH_: deliverablePath(deliverable),
    _RESULT_REF_: resultRef,
    _RULEBOOK_REF_: refs.rulebook,
    _RULEBOOK_INCLUDES_: rulebookIncludesText(deliverable?.deliverable.rulebook),
    _RECIPE_REF_: refs.recipe,
    _SAMPLE_REF_: refs.sample,
    _TEMPLATE_REF_: refs.template,
    _REVIEW_VIEWPOINT_ROWS_: reviewViewpointRows(criteria),
    _REVIEW_VIEWPOINT_DETAILS_: reviewViewpointDetails(
      criteria,
      vpMap,
      detailTemplate,
      coverageMap,
    ),
  };
  return expandTemplate(template, values);
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

// Shared per-task plan rendering. Used by the full generatePlans loop and the
// single-task generateSinglePlan (manual re-run support).
type PlanGenContext = {
  plansDir: string;
  executionPath: string;
  projectId: string;
  catalogPath: string;
  vpMap: Map<string, ReviewViewpoint>;
  coverageMap: Map<string, CoverageType>;
  roleMap: Map<string, RoleDefinition>;
  projectContext: string[];
  templateCache: Map<string, string>;
};

async function writeTaskPlan(
  ctx: PlanGenContext,
  task: PlanTask,
  override?: { deliverable?: DeliverableInfo | null; outPath?: string; stem?: string },
): Promise<string> {
  const mode: TaskMode = task.mode ?? "edit";
  const localId = task.local_id;
  const targetLocalIds = [...new Set(task.target_local_ids ?? [])];
  const crossDeliverables = new Map<string, DeliverableInfo>();
  for (const targetLocalId of targetLocalIds) {
    const info = ctx.catalogPath ? findDeliverableInfo(ctx.catalogPath, targetLocalId) : null;
    if (info) crossDeliverables.set(targetLocalId, info);
  }
  const deliverable =
    override?.deliverable !== undefined
      ? override.deliverable
      : localId && ctx.catalogPath
        ? findDeliverableInfo(ctx.catalogPath, localId)
        : null;
  // The stem links a plan to its result (both share `<stem>-{plan,result}.md` and the doc id).
  // Defaults to the task id (fixed-name worktree/claim flow); in-place callers pass a unique stem.
  const stem = override?.stem ?? task.id;
  const resultRef = `${repoRelativePath(ctx.executionPath)}/exec/results/${stem}-result.md`;
  const outPath = override?.outPath ?? join(ctx.plansDir, `${stem}-plan.md`);
  const criteria: CriteriaItem[] = deliverable?.deliverable.done_criteria ?? [];
  if ((task.execution ?? "agent") === "human") {
    throw new Error(
      `Task ${task.id} has execution: human; claim it to create and use its result instead of a plan.`,
    );
  }
  const planTask: PlanTask = { ...task, mode };
  if (task.approach === "retrofit" && implementationEvidence(deliverable) === MISSING) {
    throw new Error(
      `Task ${task.id} uses approach: retrofit but the target deliverable has no evidence_refs.`,
    );
  }
  const template = loadPlanTemplate(mode, task.approach, ctx.templateCache);

  const body =
    mode === "review"
      ? buildReviewPlanMarkdown(
          template,
          loadViewpointDetailTemplate(ctx.templateCache),
          planTask,
          deliverable,
          criteria,
          ctx.vpMap,
          ctx.coverageMap,
          ctx.projectId,
          ctx.projectContext,
          resultRef,
          stem,
        )
      : buildEditPlanMarkdown(
          template,
          planTask,
          deliverable,
          ctx.roleMap,
          ctx.vpMap,
          ctx.projectId,
          ctx.projectContext,
          resultRef,
          stem,
          crossDeliverables,
        );
  const schemaRef = resolveDeliverableSchemaRef(
    deliverable?.deliverable.rulebook,
    deliverable?.deliverable.local_id,
  );
  const content = injectCommonConventions(body, schemaRef, ctx.templateCache);

  writeFileSync(outPath, content, "utf8");
  await formatMarkdownFile(outPath);
  return outPath;
}

// Generate the plan for a single agent task without touching other plan files,
// the index, or task state. Human tasks are result-only and are rejected here.
export async function generateSinglePlan(opts: {
  executionPath: string;
  projectId: string;
  catalogPath: string;
  rolesPath?: string;
  viewpointsPath?: string;
  projectContext?: readonly string[];
  task: ReadyTaskView;
  outPath?: string;
  stem?: string;
}): Promise<string> {
  if ((opts.task.execution ?? "agent") === "human") {
    throw new Error(
      `Task ${opts.task.id} has execution: human; claim it to create and use its result instead of a plan.`,
    );
  }
  const ctx = newPlanGenContext(opts);
  const override =
    opts.outPath || opts.stem
      ? {
          ...(opts.outPath ? { outPath: opts.outPath } : {}),
          ...(opts.stem ? { stem: opts.stem } : {}),
        }
      : undefined;
  return await writeTaskPlan(ctx, { ...opts.task, mode: opts.task.mode ?? "edit" }, override);
}

// Generate a plan directly from a catalog deliverable, independent of the
// schedule. The slug (`<domain>-<local_id>`) names the plan unless `outPath`
// overrides it. CPM is absent for ad-hoc targets; owner is absent unless the
// caller resolves it (e.g. from sch-strategy owner_rules via a track).
export async function generateDeliverablePlan(opts: {
  executionPath: string;
  projectId: string;
  catalogPath: string;
  rolesPath?: string;
  viewpointsPath?: string;
  projectContext?: readonly string[];
  target: ResolvedDeliverable;
  mode?: TaskMode;
  approach?: Approach;
  owner?: string;
  outPath?: string;
  stem?: string;
}): Promise<string> {
  const ctx = newPlanGenContext(opts);
  const task: PlanTask = {
    id: opts.target.slug,
    local_id: opts.target.localId,
    name: opts.target.info.deliverable.name,
    mode: opts.mode ?? "edit",
    ...(opts.approach ? { approach: opts.approach } : {}),
    ...(opts.owner ? { owner: opts.owner } : {}),
    schedule_file: "",
    fifo_rank: 0,
    critical_first_rank: 0,
  };
  return await writeTaskPlan(ctx, task, {
    deliverable: opts.target.info,
    ...(opts.outPath ? { outPath: opts.outPath } : {}),
    ...(opts.stem ? { stem: opts.stem } : {}),
  });
}

function newPlanGenContext(opts: {
  executionPath: string;
  projectId: string;
  catalogPath: string;
  rolesPath?: string;
  viewpointsPath?: string;
  projectContext?: readonly string[];
}): PlanGenContext {
  const plansDir = join(opts.executionPath, "exec", "plans");
  mkdirSync(plansDir, { recursive: true });

  return {
    plansDir,
    executionPath: opts.executionPath,
    projectId: opts.projectId,
    catalogPath: opts.catalogPath,
    vpMap: opts.viewpointsPath
      ? loadViewpoints(opts.viewpointsPath)
      : new Map<string, ReviewViewpoint>(),
    coverageMap: opts.viewpointsPath
      ? loadCoverageTypes(opts.viewpointsPath)
      : new Map<string, CoverageType>(),
    roleMap: loadRoles(opts.rolesPath),
    projectContext: [
      ...(opts.projectContext ??
        (opts.projectId ? DEFAULT_PROJECT_CONTEXT : ([] as readonly string[]))),
    ],
    templateCache: new Map<string, string>(),
  };
}

// Move a completed plan to exec/plans/done/ with a unique UTC + random suffix
// (same convention as event filenames), or delete it. The plan is regenerable
// from the catalog, so deletion is safe; the result remains as the record.
export function archivePlan(opts: { executionPath: string; slug: string; delete?: boolean }): {
  from: string;
  to?: string;
  deleted: boolean;
} {
  const plansDir = join(opts.executionPath, "exec", "plans");
  const from = join(plansDir, `${opts.slug}-plan.md`);
  if (!existsSync(from)) throw new Error(`plan not found: ${from}`);

  if (opts.delete) {
    rmSync(from, { force: true });
    return { from, deleted: true };
  }

  const doneDir = join(plansDir, "done");
  mkdirSync(doneDir, { recursive: true });
  const stamp = tsForFilenameUtc(nowUtcIsoSeconds());
  const to = join(doneDir, `${opts.slug}-${stamp}-${randomHex(2)}-plan.md`);
  renameSync(from, to);
  return { from, to, deleted: false };
}

export function planPathForTask(executionPath: string, taskId: string): string {
  return join(executionPath, "exec", "plans", `${taskId}-plan.md`);
}

export function loadPlan(executionPath: string, taskId: string): string | null {
  const planPath = planPathForTask(executionPath, taskId);
  if (existsSync(planPath)) return readFileSync(planPath, "utf8");
  return null;
}

// Task identity recovered from a plan file's frontmatter, used to scaffold a
// result when running a bring-your-own --plan (no managed task identity exists).
export type PlanTaskIdentity = {
  taskId: string;
  mode: TaskMode;
  projectId: string;
  approach?: Approach;
  // タスクの出自。register は登録簿項目の実行で、対象成果物を持たない。
  origin?: TaskOrigin;
  // plan frontmatter の targets（対象文書の doc id リスト）。先頭は対象成果物。
  targets?: string[];
};

const PLAN_APPROACHES: readonly Approach[] = [
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
];

// Parse an exec-plan file's frontmatter to recover the task identity. Returns
// null when the frontmatter is missing or has no usable task_id, in which case
// the caller treats the plan as an ad-hoc plan with no managed identity.
export function parsePlanTaskIdentity(planContent: string): PlanTaskIdentity | null {
  // exec-plan frontmatter は `specdojo:` 名前空間配下にある。
  const parsed = readSpecdojoNamespace(planContent);
  const taskId = typeof parsed.task_id === "string" ? parsed.task_id.trim() : "";
  if (!taskId) return null;

  const mode: TaskMode = parsed.mode === "review" ? "review" : "edit";
  const projectId = typeof parsed.project_id === "string" ? parsed.project_id.trim() : "";
  const approach =
    typeof parsed.approach === "string" &&
    (PLAN_APPROACHES as readonly string[]).includes(parsed.approach)
      ? (parsed.approach as Approach)
      : undefined;
  const targets = Array.isArray(parsed.targets)
    ? parsed.targets.filter((entry): entry is string => typeof entry === "string")
    : [];
  // 未知の値は採用せず undefined（= schedule）として扱う。
  const origin =
    parsed.origin === "register" || parsed.origin === "schedule"
      ? (parsed.origin as TaskOrigin)
      : undefined;

  return {
    taskId,
    mode,
    projectId,
    approach,
    ...(origin ? { origin } : {}),
    ...(targets.length > 0 ? { targets } : {}),
  };
}
