import { existsSync } from "node:fs";
import { join } from "node:path";
import { buildScheduleIndex } from "./exec-schedule.js";
import { readJson } from "./exec-shared.js";
import {
  buildPhaseModeIndex,
  resolveApproach,
  resolveTaskCapabilities,
  resolveTaskExecution,
  resolveTaskMode,
  resolveTaskProficiency,
} from "./exec-strategy.js";
import { extractLocalId, extractPhaseSuffix } from "./schedule-phase-sets.js";
import { type ReadySnapshot, type ReadyTaskView } from "./exec-types.js";

// Reconstruct a full ReadyTaskView for a task from the schedule (+ ready.json when
// present), filling mode/execution/approach/capabilities/proficiency from strategy
// metadata. Works for any scheduled task regardless of its current state.
export function buildTaskView(
  schedulePath: string,
  executionPath: string,
  taskId: string,
): ReadyTaskView {
  const schedule = buildScheduleIndex(schedulePath);
  const node = schedule.nodes.get(taskId);
  if (!node || node.kind !== "task") throw new Error(`Task not found in schedule: ${taskId}`);

  let task: ReadyTaskView = {
    id: taskId,
    local_id: node.local_id,
    phase_suffix: node.phase_suffix,
    phase_set: node.phase_set,
    phase_id: node.phase_id,
    cycle: node.cycle,
    iteration: node.iteration,
    name: node.name,
    owner: node.owner,
    schedule_file: node.schedule_file,
    fifo_rank: 0,
    critical_first_rank: 0,
  };
  const readyPath = join(executionPath, "generated", "ready.json");
  if (existsSync(readyPath)) {
    const ready = readJson(readyPath) as ReadySnapshot;
    task = ready.tasks.find((item) => item.id === taskId) ?? task;
  }
  if (!task.local_id) {
    task.local_id = extractLocalId(taskId);
    task.phase_suffix = extractPhaseSuffix(taskId);
  }
  if (task.local_id) {
    const phaseIndex = buildPhaseModeIndex(schedulePath);
    task.mode =
      task.mode ??
      resolveTaskMode(task.local_id, task.id, phaseIndex, task.phase_suffix, task.phase_set);
    task.execution =
      task.execution ??
      resolveTaskExecution(task.local_id, task.id, phaseIndex, task.phase_suffix, task.phase_set);
    task.approach =
      task.approach ??
      resolveApproach(task.local_id, task.id, phaseIndex, task.phase_suffix, task.phase_set);
    task.capabilities =
      task.capabilities ??
      resolveTaskCapabilities(
        task.local_id,
        task.id,
        phaseIndex,
        task.phase_suffix,
        task.phase_set,
      );
    task.proficiency =
      task.proficiency ??
      resolveTaskProficiency(task.local_id, task.id, phaseIndex, task.phase_suffix, task.phase_set);
  }
  return task;
}
