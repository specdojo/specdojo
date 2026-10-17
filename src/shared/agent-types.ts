/** Execution mode shared by configuration and exec modules. */
export type TaskMode = "edit" | "review";

/** Pipeline role shared by agent configuration and exec modules. */
export type AgentStageRole = "executor" | "reporter";

/** Task scheduling strategy shared by configuration and exec modules. */
export type SchedulerStrategy = "critical-first" | "fifo";
