import { PJR_ID_RE } from "../../register/item.js";
import { foldEventsToState, readAllEventFiles } from "../events.js";
import { resolveRegisterRunTarget } from "../register.js";
import { buildInitialStateFromStrategy } from "../schedule/initial.js";
import { buildScheduleIndex } from "../schedule/schedule.js";
import { qualifyTaskId } from "../shared.js";
import { findExecWorktree } from "../worktree.js";

// Register and schedule runs share the reservation directory. Either entry point must be able
// to recover a preparation failure from the other, using current state rather than ready.json.
export function isUnstartedScopeReservation(params: {
  item: string;
  projectId: string | undefined;
  repoRoot: string;
  schedulePath: string;
}): boolean {
  const { item, projectId, repoRoot, schedulePath } = params;
  try {
    let unstarted: boolean;
    if (PJR_ID_RE.test(item)) {
      if (!projectId) return false;
      unstarted = resolveRegisterRunTarget(projectId, item).item.status === "open";
    } else {
      const schedule = buildScheduleIndex(schedulePath);
      const snapshot = foldEventsToState(
        readAllEventFiles(schedulePath),
        schedule,
        schedulePath,
        buildInitialStateFromStrategy(schedulePath, schedule),
      );
      unstarted = snapshot.tasks[item]?.state === "todo";
    }
    return unstarted && !findExecWorktree(repoRoot, qualifyTaskId(projectId, item));
  } catch {
    // Unknown state or an unavailable worktree registry cannot prove a reservation is unused.
    return false;
  }
}
