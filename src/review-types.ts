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
  continuous?: boolean;
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

export type GradeRubricLevel = {
  level: number;
  name: string;
  description: string;
  review_verdict: "pass" | "conditional_pass" | "changes_requested";
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
