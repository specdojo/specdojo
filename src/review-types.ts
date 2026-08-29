export type ReviewViewpoint = {
  id: string;
  role: string;
  category: string;
  title: string;
  check: string;
  evidence: string;
  coverage_types?: string[];
  default_severity: string;
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
  [key: string]: unknown;
};
