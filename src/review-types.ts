/** Where the criterion that decides correctness lives: machine rules, a referenced definition, or the judge. */
export type ViewpointEvaluation = "deterministic" | "referential" | "discretionary";

export type ReviewViewpoint = {
  id: string;
  role: string;
  category: string;
  title: string;
  check: string;
  evidence: string;
  coverage_types?: string[];
  default_severity: string;
  evaluation?: ViewpointEvaluation;
  grade_targets?: ("kata" | "deliverable")[];
  /** Documents this viewpoint compares against; their hashes decide re-grading under --changed-only. */
  comparison_sources?: string[];
  document_kinds?: {
    include?: string[];
    exclude?: string[];
    unclassified?: "include" | "exclude";
    /** Rulebook IDs whose unlisted outcome was reviewed; does not change applicability. */
    confirmed_default?: string[];
  };
};

// review の verdict。タスクの完了可否を表す唯一の語彙であり、bps-task-completion の検証・受入観点
// 6 区分と一対一に対応する。pm-review-viewpoints.yaml の verdict_definitions と review result の
// verdict はこの値を共有する（PJR-XTAN）。grade の文書 verdict（pass / needs-work / fail）は成果物の
// 品質という別の対象を判定するため、この語彙へ統一しない。
export const REVIEW_VERDICTS = [
  "complete",
  "complete-with-findings",
  "incomplete",
  "grade-stale",
  "grade-unavailable",
  "changed-during-review",
] as const;

export type ReviewVerdict = (typeof REVIEW_VERDICTS)[number];

// grade の level から写像できる verdict。鮮度や評価不能は grade の level から決まらないため含めない。
export const GRADE_LEVEL_REVIEW_VERDICTS = [
  "complete",
  "complete-with-findings",
  "incomplete",
] as const satisfies readonly ReviewVerdict[];

export type GradeLevelReviewVerdict = (typeof GRADE_LEVEL_REVIEW_VERDICTS)[number];

// タスクの完了可否を表していた旧語彙と、その移行先。旧値は無視せず、移行先を示して拒否する。
// verdict_definitions の旧値と、xrr-template.md の decision.recommendation の旧値を含む。
export const LEGACY_REVIEW_VERDICTS: Readonly<Record<string, string>> = {
  pass: "complete",
  conditional_pass: "complete-with-findings",
  changes_requested: "incomplete",
  blocked: "grade-stale, grade-unavailable, or changed-during-review",
  approve: "complete or complete-with-findings",
  revise: "incomplete",
  reject: "incomplete",
};

export function isReviewVerdict(value: unknown): value is ReviewVerdict {
  return typeof value === "string" && (REVIEW_VERDICTS as readonly string[]).includes(value);
}

/** Explain why a value is not a review verdict, naming the replacement for a legacy value. */
export function describeInvalidReviewVerdict(
  value: unknown,
  allowed: readonly string[] = REVIEW_VERDICTS,
): string {
  const shown = typeof value === "string" ? `'${value}'` : String(value);
  if (typeof value === "string" && Object.hasOwn(LEGACY_REVIEW_VERDICTS, value)) {
    return `removed verdict ${shown}; use ${LEGACY_REVIEW_VERDICTS[value]} (allowed: ${allowed.join(", ")})`;
  }
  return `unknown verdict ${shown}; allowed: ${allowed.join(", ")}`;
}

export type GradeRubricLevel = {
  level: number;
  name: string;
  description: string;
  /** The verdict this level suggests to review as its starting point (review input rule). */
  review_verdict: GradeLevelReviewVerdict;
};

export type GradeRubric = {
  id: string;
  pass_score: number;
  levels: GradeRubricLevel[];
  weights: Record<"kata" | "deliverable", Record<string, number>>;
};

export type CoverageType = {
  id: string;
  name?: string;
  description?: string;
  applies_to?: string[];
};

export type ReviewViewpointSet = {
  role: string;
  viewpoints: string[];
};

export type DisabledReviewViewpoints = {
  categories?: string[];
  coverage_types?: string[];
  severity_levels?: string[];
  verdict_definitions?: string[];
  viewpoints?: string[];
  role_viewpoint_sets?: string[];
};

export type ReviewViewpointsDoc = {
  id: string;
  type: string;
  status: string;
  project_id?: string;
  extends?: string;
  viewpoints?: ReviewViewpoint[];
  coverage_types?: CoverageType[];
  role_viewpoint_sets?: ReviewViewpointSet[];
  disabled?: DisabledReviewViewpoints;
  grade_rubric?: GradeRubric;
  [key: string]: unknown;
};
