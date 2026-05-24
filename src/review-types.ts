export type ReviewStage = 'draft' | 'first' | 'final' | 'ready-candidate'

export type ReviewViewpoint = {
  id: string
  role: string
  category: string
  title: string
  check: string
  evidence: string
  coverage_types?: string[]
  default_severity: string
}

export type ReviewViewpointsDoc = {
  id: string
  type: string
  status: string
  project_id: string
  viewpoints: ReviewViewpoint[]
  [key: string]: unknown
}

export type MachineCheck = {
  name: string
  required: boolean
}

export type ReviewItem = {
  id: string
  role: string
  viewpoint_id: string
  done_criterion: string
  coverage_required: string[]
  evidence_required: string[]
  expected_output: string[]
}

export type ReviewPlanDoc = {
  id: string
  project_id: string
  target: {
    local_id: string
    path: string
    stage: ReviewStage
    version_ref: string
  }
  inputs: {
    deliverable_catalog: string
    rulebook: string
    viewpoints: string
    related_documents: string[]
  }
  machine_checks_required: MachineCheck[]
  review_items: ReviewItem[]
}

export type MachineCheckResult = {
  name: string
  result: 'pass' | 'fail' | 'skipped'
  notes: string
}

export type ReviewResultEntry = {
  plan_item_id: string
  viewpoint_id: string
  result: string
  coverage_checked: string[]
  evidence: string[]
  notes: string
}

export type UnverifiedScopeEntry = {
  plan_item_id: string
  coverage_type: string
  reason: string
}

export type Finding = {
  id: string
  plan_item_id: string
  viewpoint_id: string
  coverage_type: string
  severity: 'blocker' | 'major' | 'minor' | 'note'
  category: string
  location: string
  summary: string
  recommendation: string
}

export type ReviewResultDoc = {
  id: string
  project_id: string
  based_on: string[]
  target: {
    local_id: string
    path: string
    stage: ReviewStage
  }
  review: {
    role: string
    reviewer: string
    status: string
    reviewed_at: string
  }
  machine_checks: MachineCheckResult[]
  review_results: ReviewResultEntry[]
  unverified_scope: UnverifiedScopeEntry[]
  findings: Finding[]
  decision: {
    recommendation: string
    approver_required: string
  }
}
