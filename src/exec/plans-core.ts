import { existsSync, readFileSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";
import { load } from "../shared/yaml.js";
import { specdojoRootDir } from "../shared/specdojo-config.js";
import { kataDirsForKinds, resolveIncludedRulebooks, resolveKataRefs } from "../kata/kata.js";
import type { KataRefs } from "../kata/kata.js";
import { resolveBasePath, resolveDeliverablePath } from "../catalog/paths.js";
import { isDctPlanFileName } from "../catalog/plan.js";
import { buildSpecdojoFrontmatter, readSpecdojoNamespace } from "../docs/frontmatter-namespace.js";
import { qualifyPracticeId, SPECDOJO_PRACTICE_AUTHORITY } from "../shared/practice-id.js";
import { MISSING } from "../shared/plan-templates.js";
export {
  MISSING,
  execTemplatePath,
  execTemplatesDir,
  injectCommonConventions,
  loadPlanTemplate,
} from "../shared/plan-templates.js";
import { resolveViewpointsDoc, viewpointAppliesToDocument } from "../review/plan.js";
import { listFilesRecursive, nowUtcIsoSeconds, randomHex, tsForFilenameUtc } from "./shared.js";
import type { Approach, ExecPlanMeta, ReadyTaskView, TaskMode } from "./types.js";
import type { CriteriaItem, DctDeliverableItem, DctDoc, DctSection } from "../catalog/types.js";
import type { ReviewViewpoint } from "../review/types.js";
import type { RoleDefinition, RolesDoc } from "./role-types.js";
import {
  gradeFindingDisplayMessage,
  gradeResultPathForDocument,
  readGradeResultForDocument,
} from "../shared/grade-result.js";
import { renderReviewGradeSummary, reviewGradeFreshness } from "../review/grade.js";
import type { ReviewGradeOutcome, ReviewGradeTarget } from "../review/grade.js";

// Internal types
// ---------------------------------------------------------------------------

export type PlanTask = ReadyTaskView & { mode: TaskMode };

export type DeliverableInfo = {
  deliverable: DctDeliverableItem;
  resolvedPath: string;
};

export function execDocId(projectId: string, prefix: "xep" | "xrp", localBase: string): string {
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

export function findDeliverableInfo(catalogPath: string, localId: string): DeliverableInfo | null {
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

export function loadCatalogDocs(catalogPath: string): DctDoc[] {
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

function resolvedDeliverablesInCatalog(catalogPath: string): ResolvedDeliverable[] {
  const deliverables: ResolvedDeliverable[] = [];
  const visit = (sections: DctSection[], parentBase: string, domain: string): void => {
    for (const section of sections) {
      const sectionBase = resolveBasePath(parentBase, section.base_path);
      for (const item of section.deliverables ?? []) {
        deliverables.push({
          domain,
          localId: item.local_id,
          slug: item.local_id,
          info: {
            deliverable: item,
            resolvedPath: resolveDeliverablePath(sectionBase, item.path),
          },
        });
      }
      visit(section.groups ?? [], sectionBase, domain);
    }
  };
  for (const doc of loadCatalogDocs(catalogPath)) {
    visit(doc.groups, resolveBasePath("", doc.base_path), doc.domain);
  }
  return deliverables;
}

// Register targets use document IDs rather than schedule local_ids. Resolve the document ID
// back to its catalog entry so register-originated approach plans can share schedule rendering.
export function resolveDeliverableByDocId(
  catalogPath: string,
  projectId: string,
  targetId: string,
): ResolvedDeliverable {
  const matches = resolvedDeliverablesInCatalog(catalogPath).filter((target) => {
    const docId = deliverableDocId(
      projectId,
      target.info.deliverable.local_id,
      target.info.resolvedPath,
    );
    return (
      targetId === docId ||
      targetId === target.localId ||
      targetId === qualifiedDocId(projectId, target.localId)
    );
  });
  if (matches.length === 0) {
    throw new Error(`catalog deliverable target not found for document id: ${targetId}`);
  }
  if (matches.length > 1) {
    throw new Error(
      `ambiguous catalog deliverable target for document id ${targetId}: ${matches
        .map((match) => match.localId)
        .join(", ")}`,
    );
  }
  return matches[0];
}

// A kata may be declared by zero, one, or several deliverables. Only a unique declaration is
// used as the maintenance plan's evidence context; otherwise the explicitly targeted kata remains
// executable without selecting an arbitrary deliverable.
export function findUniqueDeliverableForKataTarget(
  catalogPath: string,
  targetId: string,
  kind: keyof KataRefs,
): DeliverableInfo | null {
  const matches = resolvedDeliverablesInCatalog(catalogPath).filter((target) => {
    const refs = resolveKataRefs(target.info.deliverable.rulebook, target.info.deliverable.kind);
    const refPath = refs[kind];
    return refPath !== MISSING && refDocIdFromPath(refPath) === targetId;
  });
  return matches.length === 1 ? matches[0].info : null;
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

export function loadViewpoints(viewpointsPath: string): Map<string, ReviewViewpoint> {
  if (!viewpointsPath || !existsSync(viewpointsPath)) return new Map();
  const doc = resolveViewpointsDoc(viewpointsPath);
  return new Map((doc.viewpoints ?? []).map((vp) => [vp.id, vp]));
}

export function loadRoles(rolesPath: string | undefined): Map<string, RoleDefinition> {
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
export function repoRelativePath(absPath: string): string {
  return relative(specdojoRootDir(), absPath).replace(/\\/g, "/");
}

// ---------------------------------------------------------------------------
// Markdown builders
// ---------------------------------------------------------------------------

export function frontmatter(meta: ExecPlanMeta): string {
  const inner = [
    `id: ${meta.id}`,
    `type: ${meta.type}`,
    `rulebook: ${meta.rulebook}`,
    `task_id: ${meta.task_id}`,
    ...(meta.name ? [`name: ${JSON.stringify(meta.name)}`] : []),
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
export function phaseDescriptionText(task: PlanTask): string {
  if (task.description) return task.description.trimEnd();
  return task.name ?? task.id;
}

export function deliverablePath(deliverable: DeliverableInfo | null): string {
  return deliverable?.resolvedPath ?? MISSING;
}

export function deliverableName(deliverable: DeliverableInfo | null): string {
  return deliverable?.deliverable.name ?? MISSING;
}

export function gradeFindingsText(projectId: string, targetPath: string): string {
  if (!targetPath || targetPath === MISSING || !existsSync(join(specdojoRootDir(), targetPath))) {
    return "- なし";
  }
  try {
    const result = readGradeResultForDocument({ documentPath: targetPath, project: projectId });
    if (!result || result.findings.length === 0) return "- なし";
    return result.findings
      .map(
        (finding) =>
          `- ${finding.id} [${finding.severity}/${finding.rule}; line=${finding.line}; anchor=${JSON.stringify(finding.anchor)}]: ${gradeFindingDisplayMessage(finding)}`,
      )
      .join("\n");
  } catch {
    return "- なし";
  }
}

export function gradeFindingTargetPath(
  approach: Approach | undefined,
  deliverable: DeliverableInfo | null,
  refs: KataRefs,
): string {
  if (approach === "rulebook-maintenance") return refs.rulebook;
  if (approach === "recipe-maintenance") return refs.recipe;
  if (approach === "sample-maintenance") return refs.sample;
  if (approach === "template-maintenance") return refs.template;
  return deliverablePath(deliverable);
}

// grade の --target。実践の型メンテナンス系は実践の型そのものを評価対象にする。
export function gradeTargetKind(approach: Approach | undefined): "kata" | "deliverable" {
  return approach === "rulebook-maintenance" ||
    approach === "recipe-maintenance" ||
    approach === "sample-maintenance" ||
    approach === "template-maintenance"
    ? "kata"
    : "deliverable";
}

// review の前段で runner が grade を実行する評価対象（PJR-KCMH）。review plan の「評価結果」章と
// 同じ規則で決めるため、plan 生成と runner の実行対象が食い違わない。
export function reviewGradeSubject(
  catalogPath: string,
  task: Pick<ReadyTaskView, "local_id" | "approach">,
): { path: string; target: ReviewGradeTarget } | undefined {
  const deliverable =
    task.local_id && catalogPath ? findDeliverableInfo(catalogPath, task.local_id) : null;
  const refs = resolveKataRefs(deliverable?.deliverable.rulebook, deliverable?.deliverable.kind);
  const path = gradeFindingTargetPath(task.approach, deliverable, refs);
  if (!path || path === MISSING) return undefined;
  return { path, target: gradeTargetKind(task.approach) };
}

// review plan に提示する評価結果。runner の grade 実行結果があれば併記する。
export function reviewGradeSummaryText(
  projectId: string,
  subjectPath: string,
  outcome: ReviewGradeOutcome | undefined,
): string {
  return renderReviewGradeSummary(
    reviewGradeFreshness({
      subjectPath: subjectPath === MISSING ? "" : subjectPath,
      projectId,
      rootDir: specdojoRootDir(),
    }),
    outcome,
  );
}

// 評価対象に対応する評価結果サイドカーのリポジトリ相対パス。評価対象が未作成、または
// frontmatter の id を解決できない場合は MISSING を返す（サイドカーの有無は問わない）。
export function gradeResultRef(projectId: string, subjectPath: string): string {
  if (!subjectPath || subjectPath === MISSING) return MISSING;
  if (!existsSync(join(specdojoRootDir(), subjectPath))) return MISSING;
  try {
    return repoRelativePath(
      gradeResultPathForDocument({ documentPath: subjectPath, project: projectId }),
    );
  } catch {
    return MISSING;
  }
}

// plan に表示する実践の型の状態。宣言からパスを解決できたがファイルが無い場合と、
// 宣言不足・対象外などでパス自体を解決できない場合を分ける。これにより executor は
// 既存文書の編集、宣言済みパスへの新規作成、前提確認が必要な状態を推測せず判別できる。
export function kataRefState(refPath: string): "existing" | "missing" | "unresolved" {
  if (refPath === MISSING) return "unresolved";
  return existsSync(join(specdojoRootDir(), refPath)) ? "existing" : "missing";
}

// 対象成果物の depends_on を、依存先 doc の [[id]] 参照の入れ子リストで提示する。
// id は依存先の frontmatter、未作成なら配置規約から解決する。agent へ plan を渡すときに
// expandPromptRefs（src/exec/run/agent.ts, format:'path'）が
// この [[id]] を doc-index 経由でリポジトリ相対パスへ展開し、agent が先行成果物を直接開ける。
// テンプレート側はラベル直後にこの値を差し込むため、件数 0・成果物未解決時は先頭スペース付きの
// インライン値、依存ありの場合は改行始まりの入れ子リストを返す。
export function deliverableDependsOn(
  deliverable: DeliverableInfo | null,
  projectId: string,
  catalogPath: string,
): string {
  if (!deliverable) return ` ${MISSING}`;
  const deps = deliverable.deliverable.depends_on ?? [];
  if (deps.length === 0) return " -";
  const lines = deps.map((dep) => {
    const info = findDeliverableInfo(catalogPath, dep);
    return `  - [[${deliverableDocId(projectId, dep, info?.resolvedPath)}]]`;
  });
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
export function projectContextSection(
  refs: readonly string[],
  deliverable: DeliverableInfo | null,
  approach: Approach | undefined,
  projectId: string,
): string {
  if (!deliverable || (approach && PROJECT_CONTEXT_EXCLUDED_APPROACHES.has(approach))) return "";

  const targetId = deliverableDocId(
    projectId,
    deliverable.deliverable.local_id,
    deliverable.resolvedPath,
  );
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

export function deliverableOverview(deliverable: DeliverableInfo | null): string {
  return deliverable?.deliverable.overview ?? MISSING;
}

export function implementationEvidence(deliverable: DeliverableInfo | null): string {
  const refs = deliverable?.deliverable.evidence_refs ?? [];
  if (refs.length === 0) return MISSING;
  return refs.map((ref) => `- \`${ref.path}\`（${ref.kind}）: ${ref.purpose}`).join("\n");
}

// edit plan の「完了の狙い」用。一文書一責務のため、done_criteria を owner ロールの狙いと
// 下流ロールの入力適合に分けて提示する。owner の狙いを作成目標とし、下流は入力として最低限
// 成立させる範囲にとどめる（各ロールの内容を作り込まない）。下流の適合性検証や観点別の自己
// レビューは edit plan では行わず、多観点検証は独立した review plan に委ねる。
// owner が done_criteria に現れない場合は分割せず全件を素の箇条書きにフォールバックする。
export function doneCriteriaGoals(criteria: CriteriaItem[], owner: string | undefined): string {
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
export function doneCriteriaChecklist(criteria: CriteriaItem[]): string {
  if (criteria.length === 0) return MISSING;
  return criteria.map((c) => `- [ ] ${c.text}`).join("\n");
}

// done_criteria を plan 提示用の素の箇条書きに整形する。チェックの記録は result 側の
// チェックリストで行うため、plan では「何を確認するか」の列挙にとどめる。
export function doneCriteriaItems(criteria: CriteriaItem[]): string {
  if (criteria.length === 0) return MISSING;
  return criteria.map((c) => `- ${c.text}`).join("\n");
}

// 主 rulebook が include する rulebook を plan へ注入する表記に整形する。
// 併せて適用する rulebook（記法など）を backtick 付きパスのカンマ区切りで示す。
// include が無い場合は他の参照と同様に MISSING を返す。
export function rulebookIncludesText(
  rulebookId: string | undefined,
  targetKind: DctDeliverableItem["kind"] | undefined,
): string {
  if (targetKind === "generated") return MISSING;
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

// 成果物の doc id は、既存文書では frontmatter を正本とする。author 前など文書が
// 未作成の場合は配置規約に従い、product 配下だけをローカル ID、projects 配下を含む
// その他の配置を従来どおり project 修飾 ID とする。
export function deliverableDocId(
  projectId: string,
  localId: string,
  resolvedPath: string | undefined,
): string {
  if (resolvedPath) {
    const absolutePath = resolve(specdojoRootDir(), resolvedPath);
    if (existsSync(absolutePath)) {
      try {
        const id = readSpecdojoNamespace(readFileSync(absolutePath, "utf8")).id;
        if (typeof id === "string" && id.trim()) return id.trim();
      } catch {
        // 読み取り不能・不正 frontmatter は配置によるフォールバックへ進む。
      }
    }

    const normalizedPath = resolvedPath.replaceAll("\\", "/").replace(/^\/+/, "");
    if (/^docs\/[a-z]{2}\/product(?:\/|$)/.test(normalizedPath)) return localId;
  }
  return qualifiedDocId(projectId, localId);
}

// タスクが対象とする文書の doc id リスト。先頭は対象成果物（配置に対応する doc id）、
// 以降は approach に応じて変更・確定しうる実践の型の doc id。いずれも doc-index で
// パスへ解決できる id にし、schedule やファイル名の命名規約に依存せず対象を機械的に
// 取得できるようにする。解決できない実践の型（_MISSING_）は含めない。
// targets は frontmatter の必須項目のため、catalog で成果物を解決できない場合も
// fallbackLocalId から成果物の doc id だけは組み立てる。
export function targetDocIds(
  projectId: string,
  deliverable: DeliverableInfo | null,
  approach: Approach | undefined,
  fallbackLocalId?: string,
): string[] {
  if (!deliverable) {
    return fallbackLocalId ? [qualifiedDocId(projectId, fallbackLocalId)] : [];
  }
  const ids = [
    deliverableDocId(projectId, deliverable.deliverable.local_id, deliverable.resolvedPath),
  ];
  const kinds = approach ? (TARGET_REF_KINDS[approach] ?? []) : [];
  if (kinds.length === 0) return ids;
  const refs = resolveKataRefs(deliverable.deliverable.rulebook, deliverable.deliverable.kind);
  for (const kind of kinds) {
    const refPath = refs[kind];
    if (refPath !== MISSING) ids.push(refDocIdFromPath(refPath));
  }
  return ids;
}

export function targetDocIdsForTask(
  projectId: string,
  task: Pick<ReadyTaskView, "local_id" | "target_local_ids" | "approach">,
  deliverable: DeliverableInfo | null,
  crossDeliverables: ReadonlyMap<string, DeliverableInfo>,
): string[] {
  if (task.target_local_ids && task.target_local_ids.length > 0) {
    return [...new Set(task.target_local_ids)].map((localId) => {
      const info = crossDeliverables.get(localId);
      return deliverableDocId(projectId, localId, info?.resolvedPath);
    });
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
    const ids = [...new Set(task.target_local_ids)].map((localId) => {
      const info = findDeliverableInfo(catalogPath, localId);
      return deliverableDocId(projectId, localId, info?.resolvedPath);
    });
    return ids.length > 0 ? ids : undefined;
  }
  return targetDocIdsForDeliverable(catalogPath, task.local_id, projectId, task.approach);
}

export function crossDeliverableTargetDetails(
  projectId: string,
  localIds: readonly string[],
  deliverables: Map<string, DeliverableInfo>,
  catalogPath: string,
): string {
  const lines: string[] = [];
  for (const localId of localIds) {
    const info = deliverables.get(localId);
    const docId = deliverableDocId(projectId, localId, info?.resolvedPath);
    lines.push(`### ${docId}`);
    lines.push("");
    lines.push(`- document: [[${docId}]]`);
    lines.push(`- name: ${deliverableName(info ?? null)}`);
    lines.push(`- path: \`${deliverablePath(info ?? null)}\``);
    lines.push(`- overview: ${deliverableOverview(info ?? null)}`);
    lines.push(`- depends_on:${deliverableDependsOn(info ?? null, projectId, catalogPath)}`);
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

// review plan の完了条件表の行。review は観点ごとに評価せず、done_criteria をタスクの
// 完了条件として照合するため、ID は DC-NNN とする。
export function reviewDoneCriteriaRows(criteria: CriteriaItem[]): string {
  if (criteria.length === 0) return MISSING;
  const lines: string[] = [];
  criteria.forEach((c, i) => {
    const criterionId = `DC-${String(i + 1).padStart(3, "0")}`;
    lines.push(`| ${criterionId} | ${c.roles.join(", ")} | ${c.viewpoint} | ${c.text} |`);
  });
  return lines.join("\n");
}

export function applicableReviewCriteria(
  criteria: CriteriaItem[],
  vpMap: Map<string, ReviewViewpoint>,
  rulebook: string | undefined,
): CriteriaItem[] {
  const metadata = rulebook ? { rulebook } : {};
  return criteria.filter((criterion) => {
    const viewpoint = vpMap.get(criterion.viewpoint);
    return viewpoint === undefined || viewpointAppliesToDocument(viewpoint, metadata);
  });
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
    const refs = resolveKataRefs(deliverable.deliverable.rulebook, deliverable.deliverable.kind);
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

// owner ロール視点の記述ガイドを構成するデータ値。prose ラベルや見出しは
// テンプレート側（言語別 docs/<lang>/.../exec-templates）に置き、ここでは値のみを供給する。
export type OwnerRoleFields = {
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
  rulebook?: string,
): OwnerRoleFields {
  if (!owner) {
    return { label: MISSING, note: MISSING, viewpoints: MISSING };
  }

  const role = roleMap.get(owner);
  const label = role?.name ? `${owner}（${role.name}）` : owner;
  const note = role?.project_note ?? MISSING;

  const metadata = rulebook ? { rulebook } : {};
  const roleViewpoints = [...vpMap.values()].filter(
    (vp) => vp.role === owner && viewpointAppliesToDocument(vp, metadata),
  );
  const viewpoints =
    roleViewpoints.length > 0
      ? roleViewpoints.map((vp) => `- ${vp.title}: ${vp.check}`).join("\n")
      : MISSING;

  return { label, note, viewpoints };
}

// edit plan は観点別の自己レビューを行わない。done_criteria は §3 の owner 視点とは別に
// 「完了の狙い」として素の箇条書きで提示し、多観点検証は独立した review plan に委ねる。
