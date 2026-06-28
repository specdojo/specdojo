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

export type ReviewViewpointsDoc = {
  id: string;
  type: string;
  status: string;
  project_id: string;
  viewpoints: ReviewViewpoint[];
  coverage_types?: CoverageType[];
  [key: string]: unknown;
};
