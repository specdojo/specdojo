export type DctKind = 'work' | 'control' | 'generated'
export type DctStatus = 'draft' | 'ready' | 'deprecated'

export type DctDeliverableItem = {
  local_id: string
  artifact_code?: string
  name: string
  kind: DctKind
  depends_on?: string[]
  overview: string
  path?: string
  done_criteria?: string[]
  note?: string
  min_size?: string // template-only: 'small' | 'medium' | 'large'
}

export type DctSection = {
  name?: string
  base_path?: string
  note?: string
  min_size?: string // template-only: 'small' | 'medium' | 'large'
  groups?: DctSection[]
  deliverables?: DctDeliverableItem[]
}

export type DctDoc = {
  id: string
  type: 'project'
  status: DctStatus
  part_of?: string[]
  project_id: string
  domain: string
  domain_code?: string
  base_path?: string
  groups: DctSection[]
}

export type DctValidationResult = {
  ok: boolean
  errors: string[]
  warnings: string[]
}
