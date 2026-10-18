import type {
  AgentAssignment,
  AgentStageRole,
  Approach,
  Proficiency,
  SchedulerStrategy,
  TaskMode,
} from "../shared/agent-types.js";

export type {
  AgentAssignment,
  AgentStageRole,
  Approach,
  Proficiency,
  SchedulerStrategy,
  TaskMode,
} from "../shared/agent-types.js";
export type { ScheduleCalendar, ScheduleIndex, ScheduleNode } from "../shared/schedule-index.js";

export type AgentPipelineStage = {
  stage_role: AgentStageRole;
  capabilities?: string[];
  proficiency?: Proficiency;
};

export type AgentPipeline = {
  stages: [AgentPipelineStage, AgentPipelineStage];
};

export type ExecEventType =
  | "claim"
  | "note"
  | "block"
  | "unblock"
  | "complete"
  | "reopen"
  | "release"
  | "cancel"
  | "link"
  | "estimate";

export type ExecState = "todo" | "doing" | "blocked" | "done" | "cancelled";

export type ExecEventV1 = {
  v: 1;
  ts: string;
  type: ExecEventType;
  task_id: string;
  by: string;
  msg: string;
  run_id?: string;
  refs?: Record<string, string>;
  meta?: Record<string, unknown>;
};

export type ValidateResult = {
  ok: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    events: number;
    event_files: number;
    schedule_ids: number;
    schedule_files: number;
  };
};

export type CurrentState = {
  state: ExecState;
  last_ts?: string;
  last_by?: string;
  last_type?: ExecEventType;
  last_msg?: string;
  refs?: Record<string, string>;
  meta?: Record<string, unknown>;
};

export type StateSnapshot = {
  schedule_path: string;
  tasks: Record<string, CurrentState>;
};

export type CpmNode = {
  id: string;
  name?: string;
  owner?: string;
  kind: "task" | "milestone" | "gate";
  duration_days: number;
  es: number;
  ef: number;
  ls: number;
  lf: number;
  slack: number;
  depends_on: string[];
  schedule_file: string;
  tags?: string[];
};

export type CpmResult = {
  schedule_path: string;
  project_start_date: string | null;
  project_duration_days: number;
  nodes: Record<string, CpmNode>;
  critical_path: string[];
};

export type ScheduleHash = {
  schema_version: 1;
  schedule_path: string;
  schedule_files: string[];
  node_hashes: Record<string, string>;
};

export type ScheduleDiff = {
  schedule_path: string;
  added: string[];
  removed: string[];
  changed: string[];
};

export type SchedulerLockOptions = {
  actor: string;
  lockTimeoutMs: number;
  lockStaleMs: number;
};

export type ReadyTaskView = {
  id: string;
  local_id?: string;
  target_local_ids?: string[];
  phase_suffix?: string;
  phase_set?: string;
  phase_id?: string;
  cycle?: number;
  iteration?: number;
  name?: string;
  owner?: string;
  mode?: TaskMode;
  execution?: "agent" | "human";
  approach?: Approach;
  // Nickname pinned by a Job or Schedule phase. Schedule tasks retain the executor/reporter
  // mapping; legacy Job materialization may retain the executor nickname shorthand.
  agent?: string | AgentAssignment;
  capabilities?: string[];
  proficiency?: Proficiency;
  agent_pipeline?: AgentPipeline;
  schedule_file: string;
  fifo_rank: number;
  critical_first_rank: number;
  cpm?: {
    es: number;
    ef: number;
    ls: number;
    lf: number;
    slack: number;
  };
  description?: string;
};

export type ReadySnapshot = {
  schedule_path: string;
  execution_path: string;
  generated_dir: string;
  ready_count: number;
  default_strategy: SchedulerStrategy;
  strategies: Record<
    SchedulerStrategy,
    {
      next_task_id: string | null;
      ordered_task_ids: string[];
    }
  >;
  tasks: ReadyTaskView[];
};

export type ClaimNextSnapshot = {
  schedule_path: string;
  execution_path: string;
  generated_dir: string;
  default_strategy: SchedulerStrategy;
  strategies: Record<
    SchedulerStrategy,
    {
      next_task_id: string | null;
      ordered_task_ids: string[];
    }
  >;
};

export type ResolvedProjectPaths = {
  projectId?: string;
  schedulePath: string;
  executionPath: string;
  catalogPath?: string;
  rolesPath?: string;
  viewpointsPath?: string;
  projectContext?: string[];
};

// タスクの出自。schedule は成果物カタログ由来のタスクで、対象成果物を持ち targets から
// commit 許可リストを導出する。register は登録簿項目（PJR-XXXX）の実行で、個票が
// targets を宣言していれば plan に転記して target coverage 検証を有効にする（宣言が
// なければ targets を持たず検証は skip される）。job はJob Definitionから
// materializeしたRunで、targetsまたは対象pathをRunスナップショットに保持する。
// 省略時は schedule とみなす。
export type TaskOrigin = "schedule" | "register" | "job";

export type ExecPlanMeta = {
  id: string;
  type: "exec-plan";
  rulebook: string;
  task_id: string;
  name?: string;
  mode: TaskMode;
  status: "ready";
  project_id: string;
  origin?: TaskOrigin;
  job_id?: string;
  run_id?: string;
  owner?: string;
  on_critical_path?: true;
  agent?: string;
  approach?: Approach;
  // タスクが対象とする文書の doc id リスト。先頭は対象成果物（project 修飾 doc id）、
  // 以降は approach に応じて変更・確定しうる参考資料の doc id。
  targets?: string[];
};

export type ExecResultMeta = {
  id: string;
  type: "exec-result";
  task_id: string;
  mode: TaskMode;
  status: "in_progress" | "complete" | "blocked" | "superseded";
  project_id: string;
  origin?: TaskOrigin;
  job_id?: string;
  run_id?: string;
  // human タスクは plan を生成せず result 単体で実行するため省略する。
  plan_ref?: string;
  started_at: string;
  completed_at?: string;
  agent?: string;
  execution?: "agent" | "human";
  approach?: Approach;
  // タスクが対象とする文書の doc id リスト（plan と同じ規則）。
  targets?: string[];
  // status が blocked のとき、runner が記録する異常終了理由（block イベントと同じ抽出文字列）。
  block_reason?: string;
};
