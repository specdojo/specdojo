import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { buildScheduleIndex } from "../shared/schedule-index.js";
import { listFilesRecursive } from "../shared/fs.js";
import { gradeContentHash, gradeFindingCount, readGradeResultForDocument } from "./result.js";
import {
  KATA_DIRS,
  isRecord,
  legacyInlineContentHash,
  parseMarkdown,
  type GradePipelineState,
  type GradeTarget,
  type GradeTargetFilters,
  type MarkdownDocument,
} from "./core.js";
import {
  currentGradePipelineState,
  isIncompleteGradePipelineState,
  loadGradePipelineStates,
} from "./pipeline-state.js";
import {
  comparisonSourceKeys,
  createGradeSourceContext,
  currentSourceHashes,
  dependencySourceKeys,
  gradedComparisonSources,
  isGeneratedGradeTarget,
  isTrashedGradeTarget,
  loadDeliverableCatalog,
  loadViewpointsIfConfigured,
  relativePathFromRoot,
  resolveProject,
  resolveSafeMarkdownPath,
  sourceHashesChanged,
} from "./targets.js";
import type { ReviewViewpointsDoc } from "../review/types.js";
import { getProjectExecutionPath, specdojoRootDir } from "../shared/specdojo-config.js";

export function discoverGradeTargets(
  opts: {
    target: GradeTarget;
    project?: string;
    paths?: string[];
  } & GradeTargetFilters,
  rootDir = specdojoRootDir(),
): string[] {
  validateGradeTargetFilters(opts);
  let candidates: string[];
  if (opts.paths && opts.paths.length > 0) {
    candidates = opts.paths.map((path) => resolveSafeMarkdownPath(path, rootDir));
    const generated = candidates.find((path) => isGeneratedGradeTarget(path, rootDir));
    if (generated) {
      throw new Error(
        `${relativePathFromRoot(generated, rootDir)}: generated documents cannot be graded`,
      );
    }
    const trashed = candidates.find((path) => isTrashedGradeTarget(path, rootDir));
    if (trashed) {
      throw new Error(
        `${relativePathFromRoot(trashed, rootDir)}: trashed documents cannot be graded`,
      );
    }
  } else if (opts.target === "kata") {
    // 対象の列挙は利用リポジトリ限定。eject されていない kata は評価対象にしない。
    candidates = KATA_DIRS.flatMap((dir) =>
      listFilesRecursive(join(rootDir, "docs/ja/specdojo", dir)).filter((entry) =>
        entry.endsWith(".md"),
      ),
    );
  } else {
    candidates = [...loadDeliverableCatalog(opts.project, rootDir).keys()];
  }
  const unique = [...new Set(candidates)]
    .filter((path) => !isGeneratedGradeTarget(path, rootDir))
    .filter((path) => !isTrashedGradeTarget(path, rootDir))
    .sort();
  if (
    !opts.changedOnly &&
    !opts.dependencyChanged &&
    !opts.rulebookChanged &&
    !opts.unreviewed &&
    opts.verdict === undefined &&
    opts.minScore === undefined &&
    opts.maxFindings === undefined &&
    !opts.ungraded &&
    !opts.incomplete &&
    !opts.rubricOutdated
  ) {
    return unique;
  }
  const pipelineStates = opts.incomplete
    ? loadGradePipelineStates(opts.project, rootDir)
    : new Map<string, GradePipelineState>();

  const sourceContext = createGradeSourceContext(opts.project, rootDir);
  const viewpoints =
    opts.changedOnly || opts.rubricOutdated
      ? loadViewpointsIfConfigured(opts.project, rootDir)
      : undefined;
  const currentRubricId = opts.rubricOutdated ? currentGradeRubricId(viewpoints) : undefined;

  let scheduledDocuments: Set<string> | undefined;
  if (opts.unreviewed) {
    const { project } = resolveProject(opts.project);
    const schedulePath = join(rootDir, getProjectExecutionPath(project), "../schedule");
    try {
      const index = buildScheduleIndex(schedulePath);
      scheduledDocuments = new Set();
      for (const node of index.nodes.values()) {
        if (node.local_id) scheduledDocuments.add(node.local_id);
        if (node.target_local_ids) {
          for (const tid of node.target_local_ids) scheduledDocuments.add(tid);
        }
      }
    } catch {
      scheduledDocuments = new Set();
    }
  }

  const gradeDates = new Map<string, number>();
  function getMemoizedGradeDate(p: string) {
    if (!gradeDates.has(p)) {
      const res = readGradeResultForDocument({
        documentPath: relativePathFromRoot(p, rootDir),
        project: opts.project,
        rootDir,
      });
      gradeDates.set(p, res ? new Date(res.graded_at).getTime() : 0);
    }
    return gradeDates.get(p)!;
  }

  function getRulebookPath(rulebookId: string) {
    if (rulebookId.startsWith("specdojo:")) {
      const id = rulebookId.slice("specdojo:".length);
      return join(rootDir, "docs/ja/specdojo/rulebooks", `${id}.md`);
    }
    return undefined;
  }

  return unique.filter((path) => {
    const rel = relativePathFromRoot(path, rootDir);
    const content = readFileSync(path, "utf8");
    const document = parseMarkdown(content, rel);
    const pipelineState = currentGradePipelineState(
      document,
      rel,
      pipelineStates.get(rel),
      opts.target,
    );
    const result = readGradeResultForDocument({
      documentPath: rel,
      project: opts.project,
      rootDir,
    });

    if (opts.verdict !== undefined && (result === undefined || result.verdict !== opts.verdict)) {
      return false;
    }
    if (opts.minScore !== undefined && (result === undefined || result.score < opts.minScore)) {
      return false;
    }
    if (
      opts.maxFindings !== undefined &&
      (result === undefined || gradeFindingCount(result) > opts.maxFindings)
    ) {
      return false;
    }

    if (opts.unreviewed) {
      if (!scheduledDocuments) return false;
      const id = (document.data.specdojo as Record<string, unknown>)?.id as string;
      if (!id || scheduledDocuments.has(id.split(":").pop()!)) return false;
      if (result !== undefined && result.content_hash === gradeContentHash(content)) return false;
    }

    if (opts.incomplete && pipelineState) {
      if (!isIncompleteGradePipelineState(pipelineState)) return false;
    } else if (opts.incomplete) {
      return false;
    }

    if (opts.ungraded && result !== undefined) return false;

    if (currentRubricId !== undefined && !isGradeRubricOutdated(result, currentRubricId)) {
      return false;
    }

    if (result === undefined) {
      if (opts.dependencyChanged || opts.rulebookChanged) return false;
      return true;
    }

    const docDate = new Date(result.graded_at).getTime();

    if (opts.rulebookChanged) {
      const rb = (document.data.specdojo as Record<string, unknown>)?.rulebook as string;
      if (!rb) return false;
      const rbPath = getRulebookPath(rb);
      if (!rbPath || !existsSync(rbPath)) return false;
      if (getMemoizedGradeDate(rbPath) <= docDate) return false;
    }

    // 依存先の評価日時ではなく内容の hash で判定する。再評価しただけの依存先は変更扱いにしない。
    if (opts.dependencyChanged) {
      if (opts.target !== "deliverable") return false;
      const keys = dependencySourceKeys(path, sourceContext);
      if (keys.length === 0) return false;
      const current = currentSourceHashes(keys, path, sourceContext);
      if (!sourceHashesChanged(result.source_hashes, current)) return false;
    }

    if (opts.changedOnly && result.content_hash === gradeContentHash(content)) {
      const metadata = isRecord(document.data.specdojo) ? document.data.specdojo : {};
      const keys = comparisonSourceKeys(
        gradedComparisonSources(viewpoints, opts.target, metadata),
        path,
        sourceContext,
      );
      if (keys.length === 0) return false;
      const current = currentSourceHashes(keys, path, sourceContext);
      if (!sourceHashesChanged(result.source_hashes, current)) return false;
    }

    return true;
  });
}

function currentGradeRubricId(viewpoints: ReviewViewpointsDoc | undefined): string {
  const id = viewpoints?.grade_rubric?.id;
  if (typeof id !== "string" || id.length === 0) {
    throw new Error("--rubric-outdated requires grade_rubric.id in the resolved review viewpoints");
  }
  return id;
}

// 保存済みの結果が現在の rubric 以外で付けられたかを判定する。rubric の記録がない結果は
// どの版で付けたか確かめられないため旧版として扱う。結果がない文書は --ungraded の対象である。
export function isGradeRubricOutdated(
  result: { rubric?: unknown } | undefined,
  currentRubricId: string,
): boolean {
  if (result === undefined) return false;
  if (typeof result.rubric !== "string" || result.rubric.length === 0) return true;
  return result.rubric !== currentRubricId;
}

function validateGradeTargetFilters(filters: GradeTargetFilters): void {
  if (
    filters.verdict !== undefined &&
    filters.verdict !== "pass" &&
    filters.verdict !== "needs-work" &&
    filters.verdict !== "fail"
  ) {
    throw new Error("--verdict must be pass, needs-work, or fail");
  }
  if (
    filters.minScore !== undefined &&
    (!Number.isSafeInteger(filters.minScore) || filters.minScore < 0 || filters.minScore > 100)
  ) {
    throw new Error("--min-score must be an integer between 0 and 100");
  }
  if (
    filters.maxFindings !== undefined &&
    (!Number.isSafeInteger(filters.maxFindings) || filters.maxFindings < 0)
  ) {
    throw new Error("--max-findings must be a non-negative integer");
  }
  if (
    filters.ungraded &&
    (filters.verdict !== undefined ||
      filters.minScore !== undefined ||
      filters.maxFindings !== undefined)
  ) {
    throw new Error("--ungraded cannot be combined with --verdict, --min-score, or --max-findings");
  }
  if (filters.ungraded && filters.rubricOutdated) {
    throw new Error("--ungraded cannot be combined with --rubric-outdated");
  }
}

function storedGradeScore(grade: Record<string, unknown>, path: string): number {
  const score = grade.score;
  if (!Number.isSafeInteger(score) || (score as number) < 0 || (score as number) > 100) {
    throw new Error(`${path}: specdojo.grade.score must be an integer between 0 and 100`);
  }
  return score as number;
}

function storedFindingCount(grade: Record<string, unknown>, path: string): number {
  const findings = grade.findings;
  if (!isRecord(findings)) throw new Error(`${path}: specdojo.grade.findings is missing`);
  return (["blocker", "major", "minor", "note"] as const).reduce((total, severity) => {
    const count = findings[severity];
    if (!Number.isSafeInteger(count) || (count as number) < 0) {
      throw new Error(
        `${path}: specdojo.grade.findings.${severity} must be a non-negative integer`,
      );
    }
    return total + (count as number);
  }, 0);
}

function matchesParsedGradeTargetFilters(
  document: MarkdownDocument,
  path: string,
  filters: GradeTargetFilters,
  incomplete = false,
): boolean {
  if (
    filters.dependencyChanged ||
    filters.rulebookChanged ||
    filters.unreviewed ||
    filters.rubricOutdated
  ) {
    throw new Error(
      "dependencyChanged, rulebookChanged, unreviewed, rubricOutdated cannot be evaluated individually without context",
    );
  }
  const specdojo = document.data.specdojo as Record<string, unknown>;
  const grade = isRecord(specdojo.grade) ? specdojo.grade : undefined;
  if (filters.incomplete && !incomplete) return false;
  if (filters.ungraded && grade !== undefined) return false;
  if (filters.verdict !== undefined && grade?.verdict !== filters.verdict) return false;
  if (
    filters.minScore !== undefined &&
    (grade === undefined || storedGradeScore(grade, path) < filters.minScore)
  ) {
    return false;
  }
  if (
    filters.maxFindings !== undefined &&
    (grade === undefined || storedFindingCount(grade, path) > filters.maxFindings)
  ) {
    return false;
  }
  return !filters.changedOnly || grade?.content_hash !== legacyInlineContentHash(document);
}

export function matchesGradeTargetFilters(
  content: string,
  path: string,
  filters: GradeTargetFilters,
  pipelineState?: GradePipelineState,
): boolean {
  validateGradeTargetFilters(filters);
  const document = parseMarkdown(content, path);
  const currentState = currentGradePipelineState(document, path, pipelineState);
  return matchesParsedGradeTargetFilters(
    document,
    path,
    filters,
    isIncompleteGradePipelineState(currentState),
  );
}

// grade の対象は grade_targets と文書の種類（document_kinds）だけで決まる。
