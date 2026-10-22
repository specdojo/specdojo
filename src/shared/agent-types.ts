/** Execution mode shared by configuration and exec modules. */
export type TaskMode = "edit" | "review";

/** Pipeline role shared by agent configuration and exec modules. */
export type AgentStageRole = "executor" | "reporter";

/** Task scheduling strategy shared by configuration and exec modules. */
export type SchedulerStrategy = "critical-first" | "fifo";

// タスクの進め方プロファイル。前3者は成果物作業で参考資料をどの程度参照するかを表し、
// <kind>-maintenance は成果物や finding が指す規範を根拠に対象の参考資料を見直す進め方
// （参照の向きが逆転する）。
// bootstrap は成果物とその参考資料一式（rulebook/recipe/sample/template）を一貫した一組として
// 同一タスクで作成・整備する進め方（初期立ち上げ専用）。
// retrofit は宣言済みの実装エビデンスを現在動作の根拠として読み、成果物へ反映・新設する。
// cross-deliverable-dedup は明示した成果物群を横断して正本を選び、重複を要約と参照へ置換する。
// finalize は human が成果物のみを最終確認して status を ready へ確定する進め方、
// bootstrap-finalize は bootstrap と対になり、成果物と参考資料一式をまとめて確定する進め方。
export const APPROACHES = [
  "fully-guided",
  "recipe-guided",
  "freeform",
  "bootstrap",
  "rulebook-authoring",
  "recipe-authoring",
  "sample-authoring",
  "template-authoring",
  "retrofit",
  "cross-deliverable-dedup",
  "rulebook-maintenance",
  "recipe-maintenance",
  "sample-maintenance",
  "template-maintenance",
  "finalize",
  "bootstrap-finalize",
] as const;

export type Approach = (typeof APPROACHES)[number];

export type Proficiency = "low" | "normal" | "high" | "expert";

export type AgentAssignment = {
  executor: string;
  reporter?: string;
};
