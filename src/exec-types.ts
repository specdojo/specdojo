export type TaskMode = 'edit' | 'review'

export type ExecEventType =
  | 'claim'
  | 'note'
  | 'block'
  | 'unblock'
  | 'complete'
  | 'cancel'
  | 'link'
  | 'estimate'

export type ExecState = 'todo' | 'doing' | 'blocked' | 'done' | 'cancelled'

export type SchedulerStrategy = 'critical-first' | 'fifo'

export type ExecEventV1 = {
  v: 1
  ts: string
  type: ExecEventType
  task_id: string
  by: string
  msg: string
  run_id?: string
  refs?: Record<string, string>
  meta?: Record<string, unknown>
}

export type ValidateResult = {
  ok: boolean
  errors: string[]
  warnings: string[]
  stats: {
    events: number
    event_files: number
    schedule_ids: number
    schedule_files: number
  }
}

export type CurrentState = {
  state: ExecState
  last_ts?: string
  last_by?: string
  last_type?: ExecEventType
  last_msg?: string
  refs?: Record<string, string>
  meta?: Record<string, unknown>
}

export type StateSnapshot = {
  schedule_path: string
  tasks: Record<string, CurrentState>
}

export type ScheduleNode = {
  id: string
  local_id?: string
  phase_suffix?: string
  artifact_name?: string
  name?: string
  owner?: string
  depends_on: string[]
  duration_days: number
  kind: 'task' | 'milestone' | 'gate'
  schedule_file: string
  tags?: string[]
  description?: string
}

export type ScheduleCalendar = {
  timezone: string
  workdays: Set<number>
  holidays: Set<string>
  work_hours_per_day: number
}

export type ScheduleIndex = {
  nodes: Map<string, ScheduleNode>
  files: string[]
  start_date: string | null
  calendar: ScheduleCalendar
  section_labels: Record<string, string>
}

export type CpmNode = {
  id: string
  name?: string
  owner?: string
  kind: 'task' | 'milestone' | 'gate'
  duration_days: number
  es: number
  ef: number
  ls: number
  lf: number
  slack: number
  depends_on: string[]
  schedule_file: string
  tags?: string[]
}

export type CpmResult = {
  schedule_path: string
  project_start_date: string | null
  project_duration_days: number
  nodes: Record<string, CpmNode>
  critical_path: string[]
}

export type ScheduleHash = {
  schema_version: 1
  schedule_path: string
  schedule_files: string[]
  node_hashes: Record<string, string>
}

export type ScheduleDiff = {
  schedule_path: string
  added: string[]
  removed: string[]
  changed: string[]
}

export type SchedulerLockOptions = {
  actor: string
  lockTimeoutMs: number
  lockStaleMs: number
}

export type ReadyTaskView = {
  id: string
  local_id?: string
  name?: string
  owner?: string
  mode?: TaskMode
  execution?: 'agent' | 'human'
  schedule_file: string
  fifo_rank: number
  critical_first_rank: number
  cpm?: {
    es: number
    ef: number
    ls: number
    lf: number
    slack: number
  }
  description?: string
}

export type ReadySnapshot = {
  schedule_path: string
  execution_path: string
  generated_dir: string
  ready_count: number
  default_strategy: SchedulerStrategy
  strategies: Record<
    SchedulerStrategy,
    {
      next_task_id: string | null
      ordered_task_ids: string[]
    }
  >
  tasks: ReadyTaskView[]
}

export type ClaimNextSnapshot = {
  schedule_path: string
  execution_path: string
  generated_dir: string
  default_strategy: SchedulerStrategy
  strategies: Record<
    SchedulerStrategy,
    {
      next_task_id: string | null
      ordered_task_ids: string[]
    }
  >
}

export type ResolvedProjectPaths = {
  schedulePath: string
  executionPath: string
  catalogPath?: string
  viewpointsPath?: string
}

export type ExecPlanMeta = {
  id: string
  type: 'exec-plan'
  rulebook: string
  task_id: string
  name?: string
  mode: TaskMode
  status: 'ready'
  project_id: string
  owner?: string
  on_critical_path?: true
  agent?: string
  viewpoints_ref?: string
}

export type ExecResultMeta = {
  id: string
  type: 'exec-result'
  task_id: string
  mode: TaskMode
  status: 'in_progress' | 'complete' | 'blocked'
  project_id: string
  plan_ref: string
  started_at: string
  completed_at?: string
  agent?: string
}
