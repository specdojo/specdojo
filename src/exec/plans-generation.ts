import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { DEFAULT_PROJECT_CONTEXT } from "../shared/specdojo-config.js";
import { resolveDeliverableSchemaRef, resolveKataRefs, type KataRefs } from "../kata/kata.js";
import { formatMarkdownFile } from "./format.js";
import { expandTemplate } from "./shared.js";
import type { Approach, ExecPlanMeta, ReadyTaskView, TaskMode, TaskOrigin } from "./types.js";
import type { CriteriaItem } from "../catalog/types.js";
import type { ReviewViewpoint } from "../review/types.js";
import type { RoleDefinition } from "./role-types.js";
import type { ReviewGradeOutcome } from "../review/grade.js";
import { isAuthoringApproach, type AuthoringKind } from "../kata/authoring.js";
import { isPlanningApproach } from "../register/planning.js";
import {
  MISSING,
  applicableReviewCriteria,
  crossDeliverableTargetDetails,
  deliverableDependsOn,
  deliverableName,
  deliverableOverview,
  deliverablePath,
  doneCriteriaChecklist,
  doneCriteriaGoals,
  doneCriteriaItems,
  execDocId,
  findDeliverableInfo,
  frontmatter,
  gradeFindingsText,
  gradeFindingTargetPath,
  gradeResultRef,
  gradeTargetKind,
  implementationEvidence,
  injectCommonConventions,
  kataRefState,
  loadPlanTemplate,
  loadRoles,
  loadViewpoints,
  ownerRoleFields,
  phaseDescriptionText,
  projectContextSection,
  repoRelativePath,
  reviewDoneCriteriaRows,
  reviewGradeSummaryText,
  rulebookIncludesText,
  targetDocIds,
  targetDocIdsForTask,
  type DeliverableInfo,
  type PlanTask,
  type ResolvedDeliverable,
} from "./plans-core.js";

function buildEditPlanMarkdown(
  template: string,
  task: PlanTask,
  deliverable: DeliverableInfo | null,
  roleMap: Map<string, RoleDefinition>,
  vpMap: Map<string, ReviewViewpoint>,
  projectId: string,
  catalogPath: string,
  projectContext: readonly string[],
  resultRef: string,
  stem: string,
  crossDeliverables: Map<string, DeliverableInfo> = new Map(),
  planOverrides?: {
    origin?: TaskOrigin;
    targets?: readonly string[];
    refs?: KataRefs;
    authoring?: AuthoringPlanFields;
    additionalConditions?: string;
  },
): string {
  const cpm = task.cpm;
  const onCriticalPath = cpm !== undefined && cpm.slack === 0;
  const targets = planOverrides?.targets
    ? [...planOverrides.targets]
    : targetDocIdsForTask(projectId, task, deliverable, crossDeliverables);

  const meta: ExecPlanMeta = {
    id: execDocId(projectId, "xep", stem),
    type: "exec-plan",
    rulebook: "none",
    task_id: task.id,
    ...(task.name ? { name: task.name } : {}),
    mode: "edit",
    status: "ready",
    project_id: projectId,
    ...(planOverrides?.origin ? { origin: planOverrides.origin } : {}),
    ...(task.owner ? { owner: task.owner } : {}),
    ...(onCriticalPath ? { on_critical_path: true as const } : {}),
    ...(task.approach ? { approach: task.approach } : {}),
    ...(targets.length > 0 ? { targets } : {}),
  };

  const criteria: CriteriaItem[] = deliverable?.deliverable.done_criteria ?? [];
  const ownerRole = ownerRoleFields(task.owner, roleMap, vpMap, deliverable?.deliverable.rulebook);
  const refs =
    planOverrides?.refs ??
    resolveKataRefs(deliverable?.deliverable.rulebook, deliverable?.deliverable.kind);
  const values: Record<string, string> = {
    _FRONTMATTER_: frontmatter(meta),
    _TASK_ID_: task.id,
    _PHASE_DESCRIPTION_: phaseDescriptionText(task),
    _DELIVERABLE_NAME_: deliverableName(deliverable),
    _DELIVERABLE_DEPENDS_ON_: deliverableDependsOn(deliverable, projectId, catalogPath),
    _PROJECT_CONTEXT_: projectContextSection(projectContext, deliverable, task.approach, projectId),
    _DELIVERABLE_OVERVIEW_: deliverableOverview(deliverable),
    _IMPLEMENTATION_EVIDENCE_: deliverable?.catalogless
      ? "個票に指定された実装のパスを読み取り専用の調査入力とする。パスが未指定なら実装反映の前に個票へ明記する。"
      : implementationEvidence(deliverable),
    _DELIVERABLE_PATH_: deliverablePath(deliverable),
    _RESULT_REF_: resultRef,
    _RULEBOOK_REF_: refs.rulebook,
    _RULEBOOK_STATE_: kataRefState(refs.rulebook),
    _RULEBOOK_INCLUDES_: rulebookIncludesText(
      deliverable?.deliverable.rulebook,
      deliverable?.deliverable.kind,
    ),
    _RECIPE_REF_: refs.recipe,
    _RECIPE_STATE_: kataRefState(refs.recipe),
    _SAMPLE_REF_: refs.sample,
    _SAMPLE_STATE_: kataRefState(refs.sample),
    _TEMPLATE_REF_: refs.template,
    _TEMPLATE_STATE_: kataRefState(refs.template),
    _OWNER_ROLE_LABEL_: ownerRole.label,
    _OWNER_ROLE_NOTE_: ownerRole.note,
    _OWNER_ROLE_VIEWPOINTS_: ownerRole.viewpoints,
    _DONE_CRITERIA_GOALS_: deliverable?.catalogless
      ? "カタログの `done_criteria` はない。個票の完了条件と rulebook を完了基準とする。"
      : doneCriteriaGoals(criteria, task.owner),
    _DONE_CRITERIA_CHECKLIST_: doneCriteriaChecklist(criteria),
    _DONE_CRITERIA_ITEMS_: doneCriteriaItems(criteria),
    _GRADE_FINDINGS_: gradeFindingsText(
      projectId,
      gradeFindingTargetPath(task.approach, deliverable, refs),
    ),
    _TARGET_DELIVERABLES_: crossDeliverableTargetDetails(
      projectId,
      task.target_local_ids ?? [],
      crossDeliverables,
      catalogPath,
    ),
    _AUTHORING_KATA_ID_: planOverrides?.authoring?.id ?? MISSING,
    _AUTHORING_KATA_KIND_: planOverrides?.authoring?.kind ?? MISSING,
    _AUTHORING_KATA_PATH_: planOverrides?.authoring?.path ?? MISSING,
    _AUTHORING_STANDARD_ID_: planOverrides?.authoring?.standardId ?? MISSING,
    _AUTHORING_STANDARD_PATH_: planOverrides?.authoring?.standardPath ?? MISSING,
    _AUTHORING_EXEMPLARS_:
      planOverrides?.authoring?.exemplars
        .map(
          (example) =>
            `- \`${example.id}\`: ${example.name}（\`${example.path}\`、${example.catalog ? "現在の参照" : "参照更新"}: \`${example.currentReference}\`）`,
        )
        .join("\n") || "- なし（kata だけを新規作成する）",
  };
  const effectiveTemplate = deliverable?.catalogless
    ? template
        .split("\n")
        .filter(
          (line) =>
            !(["recipe", "sample", "template"] as const).some(
              (kind) => refs[kind] === MISSING && line.includes(`_${kind.toUpperCase()}_REF_`),
            ),
        )
        .join("\n")
    : template;
  let body = expandTemplate(effectiveTemplate, values);
  if (deliverable?.catalogless && task.approach === "retrofit") {
    body = body.replace("成果物カタログの `evidence_refs` から展開した", "個票に明記する");
  }
  if (!planOverrides?.additionalConditions) return body;
  const section = [
    "## 個票の追加完了条件",
    "",
    isPlanningApproach(task.approach)
      ? "次の生成手順・完了条件と、個票が定める追加条件を満たす。"
      : deliverable?.catalogless
        ? "個票が定める次の条件と rulebook を満たす。"
        : "成果物カタログの `done_criteria` に加え、登録簿の個票が定める次の条件も満たす。",
    "",
    planOverrides.additionalConditions.trim(),
    "",
  ].join("\n");
  return body.includes("_COMMON_CONVENTIONS_")
    ? body.replace("_COMMON_CONVENTIONS_", `${section}\n_COMMON_CONVENTIONS_`)
    : `${body.trimEnd()}\n\n${section}`;
}

// review plan は成果物を再評価しない。grade の評価結果（サイドカー）の位置と完了条件を示し、
// 評価結果を事実として受け取ってタスクの完了可否を判断させる（bps-task-completion）。
function buildReviewPlanMarkdown(
  template: string,
  task: PlanTask,
  deliverable: DeliverableInfo | null,
  criteria: CriteriaItem[],
  vpMap: Map<string, ReviewViewpoint>,
  projectId: string,
  catalogPath: string,
  projectContext: readonly string[],
  resultRef: string,
  stem: string,
  reviewGradeOutcome?: ReviewGradeOutcome,
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

  const refs = resolveKataRefs(deliverable?.deliverable.rulebook, deliverable?.deliverable.kind);
  const applicableCriteria = applicableReviewCriteria(
    criteria,
    vpMap,
    deliverable?.deliverable.rulebook,
  );
  const gradeSubjectPath = gradeFindingTargetPath(task.approach, deliverable, refs);
  const values: Record<string, string> = {
    _FRONTMATTER_: frontmatter(meta),
    _TASK_ID_: task.id,
    _PHASE_DESCRIPTION_: phaseDescriptionText(task),
    _DELIVERABLE_NAME_: deliverableName(deliverable),
    _DELIVERABLE_DEPENDS_ON_: deliverableDependsOn(deliverable, projectId, catalogPath),
    _PROJECT_CONTEXT_: projectContextSection(projectContext, deliverable, task.approach, projectId),
    _DELIVERABLE_OVERVIEW_: deliverableOverview(deliverable),
    _IMPLEMENTATION_EVIDENCE_: implementationEvidence(deliverable),
    _DELIVERABLE_PATH_: deliverablePath(deliverable),
    _RESULT_REF_: resultRef,
    _RULEBOOK_REF_: refs.rulebook,
    _RULEBOOK_INCLUDES_: rulebookIncludesText(
      deliverable?.deliverable.rulebook,
      deliverable?.deliverable.kind,
    ),
    _RECIPE_REF_: refs.recipe,
    _SAMPLE_REF_: refs.sample,
    _TEMPLATE_REF_: refs.template,
    _GRADE_SUBJECT_PATH_: gradeSubjectPath,
    _GRADE_TARGET_: gradeTargetKind(task.approach),
    _GRADE_RESULT_PATH_: gradeResultRef(projectId, gradeSubjectPath),
    _GRADE_SUMMARY_: reviewGradeSummaryText(projectId, gradeSubjectPath, reviewGradeOutcome),
    _DONE_CRITERIA_ROWS_: reviewDoneCriteriaRows(applicableCriteria),
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
  roleMap: Map<string, RoleDefinition>;
  projectContext: string[];
  templateCache: Map<string, string>;
  // runner が review の前段で行った grade の結果。review plan にだけ反映する。
  reviewGradeOutcome?: ReviewGradeOutcome;
};

export type AuthoringPlanFields = {
  id: string;
  kind: AuthoringKind;
  path: string;
  standardId: string;
  standardPath: string;
  exemplars: Array<{
    id: string;
    name: string;
    path: string;
    currentReference: string;
    catalog: boolean;
  }>;
};

async function writeTaskPlan(
  ctx: PlanGenContext,
  task: PlanTask,
  override?: {
    deliverable?: DeliverableInfo | null;
    outPath?: string;
    stem?: string;
    origin?: TaskOrigin;
    targets?: readonly string[];
    refs?: KataRefs;
    authoring?: AuthoringPlanFields;
    additionalConditions?: string;
  },
): Promise<string> {
  const mode: TaskMode = task.mode ?? "edit";
  if (
    (isAuthoringApproach(task.approach) || isPlanningApproach(task.approach)) &&
    override?.origin !== "register"
  ) {
    throw new Error(
      `Approach ${task.approach} is register-only because schedule targets cannot express its target contract`,
    );
  }
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
  if (
    task.approach === "retrofit" &&
    !deliverable?.catalogless &&
    implementationEvidence(deliverable) === MISSING
  ) {
    throw new Error(
      `Task ${task.id} uses approach: retrofit but the target deliverable has no evidence_refs.`,
    );
  }
  const template = loadPlanTemplate(mode, task.approach, ctx.templateCache);

  const body =
    mode === "review"
      ? buildReviewPlanMarkdown(
          template,
          planTask,
          deliverable,
          criteria,
          ctx.vpMap,
          ctx.projectId,
          ctx.catalogPath,
          ctx.projectContext,
          resultRef,
          stem,
          ctx.reviewGradeOutcome,
        )
      : buildEditPlanMarkdown(
          template,
          planTask,
          deliverable,
          ctx.roleMap,
          ctx.vpMap,
          ctx.projectId,
          ctx.catalogPath,
          ctx.projectContext,
          resultRef,
          stem,
          crossDeliverables,
          override,
        );
  const schemaRef = resolveDeliverableSchemaRef(deliverable?.resolvedPath);
  const content = injectCommonConventions(body, schemaRef, ctx.templateCache, mode);

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
  reviewGradeOutcome?: ReviewGradeOutcome;
}): Promise<string> {
  if ((opts.task.execution ?? "agent") === "human") {
    throw new Error(
      `Task ${opts.task.id} has execution: human; claim it to create and use its result instead of a plan.`,
    );
  }
  const ctx = newPlanGenContext(opts);
  if (opts.reviewGradeOutcome) ctx.reviewGradeOutcome = opts.reviewGradeOutcome;
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

// Register items with an approach use the same template and catalog/kata resolution as
// schedule tasks, while keeping register identity and target coverage in the plan metadata.
export async function generateRegisterApproachPlan(opts: {
  executionPath: string;
  projectId: string;
  catalogPath: string;
  rolesPath?: string;
  viewpointsPath?: string;
  projectContext?: readonly string[];
  taskId: string;
  title: string;
  description: string;
  owner?: string;
  approach: Approach;
  targets: readonly string[];
  deliverable?: DeliverableInfo | null;
  refs?: KataRefs;
  authoring?: AuthoringPlanFields;
  additionalConditions: string;
  outPath?: string;
  stem: string;
}): Promise<string> {
  const ctx = newPlanGenContext(opts);
  const task: PlanTask = {
    id: opts.taskId,
    name: opts.title,
    description: opts.description,
    mode: "edit",
    approach: opts.approach,
    ...(opts.deliverable ? { local_id: opts.deliverable.deliverable.local_id } : {}),
    ...(opts.owner ? { owner: opts.owner } : {}),
    schedule_file: "",
    fifo_rank: 0,
    critical_first_rank: 0,
  };
  return await writeTaskPlan(ctx, task, {
    deliverable: opts.deliverable ?? null,
    origin: "register",
    targets: opts.targets,
    ...(opts.refs ? { refs: opts.refs } : {}),
    ...(opts.authoring ? { authoring: opts.authoring } : {}),
    additionalConditions: opts.additionalConditions,
    ...(opts.outPath ? { outPath: opts.outPath } : {}),
    stem: opts.stem,
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
