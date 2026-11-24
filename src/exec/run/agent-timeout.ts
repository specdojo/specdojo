import type { ChildProcess } from "node:child_process";
import type { AgentTimeout } from "../agent-config.js";
import {
  hasValidationProcessTreeSurvivors,
  signalValidationProcessTree,
  trackValidationProcessGroup,
  VALIDATION_USES_PROCESS_GROUP,
} from "../validation-process-group.js";

/** Wait after SIGTERM to the agent's process group before SIGKILL (PJR-K8F1). */
export const AGENT_KILL_GRACE_MS = 10_000;
/** Wait after SIGKILL for the output pipes to close before returning without them. */
export const AGENT_CLOSE_GRACE_MS = 5_000;

/** Start of the block reason the runner writes when it stops an agent at its time limit. */
export const AGENT_TIMEOUT_REASON_PREFIX = "agent timed out after";

export function agentTimeoutReason(timeout: AgentTimeout): string {
  return (
    `${AGENT_TIMEOUT_REASON_PREFIX} ${timeout.seconds}s (${timeout.key}); ` +
    "the runner stopped its process group with SIGTERM, then SIGKILL"
  );
}

/**
 * Only a time-limited agent gets its own process group: a detached group no longer receives the
 * terminal's Ctrl-C, so an agent without a limit keeps the historical spawn unchanged.
 */
export function usesAgentProcessGroup(timeout: AgentTimeout | undefined): boolean {
  return timeout !== undefined && VALIDATION_USES_PROCESS_GROUP;
}

export type AgentStopOptions = {
  killGraceMs?: number;
  closeGraceMs?: number;
};

export type AgentExit = {
  exitCode: number | null;
  timedOut: boolean;
  spawnError?: string;
};

/**
 * Wait for an agent process to close. Without a limit this waits indefinitely as before. With a
 * limit the runner stops the agent's process group (SIGTERM, then SIGKILL after a grace period)
 * and, if a descendant outside the group still holds the output pipes, returns without them.
 */
export async function waitForAgentExit(
  child: ChildProcess,
  timeout: AgentTimeout | undefined,
  options: AgentStopOptions = {},
): Promise<AgentExit> {
  const killGraceMs = options.killGraceMs ?? AGENT_KILL_GRACE_MS;
  const closeGraceMs = options.closeGraceMs ?? AGENT_CLOSE_GRACE_MS;
  return await new Promise((resolveExit) => {
    let settled = false;
    let timedOut = false;
    let killTimer: NodeJS.Timeout | undefined;
    let closeTimer: NodeJS.Timeout | undefined;
    const untrack = timeout ? trackValidationProcessGroup(child) : () => undefined;
    const stop = (): void => {
      timedOut = true;
      signalValidationProcessTree(child, "SIGTERM");
      killTimer = setTimeout(() => {
        signalValidationProcessTree(child, "SIGKILL");
        closeTimer = setTimeout(() => {
          // group の外へ出た子孫が pipe を持ち続けても、close を待たずに時間切れとして返す。
          child.stdout?.destroy();
          child.stderr?.destroy();
          finish({ exitCode: child.exitCode, timedOut: true });
        }, closeGraceMs);
      }, killGraceMs);
    };
    const timer = timeout ? setTimeout(stop, timeout.seconds * 1000) : undefined;
    const finish = (exit: AgentExit): void => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      clearTimeout(killTimer);
      clearTimeout(closeTimer);
      // SIGTERM で親のシェルだけが終わっても、group に残った孫は止めておく。
      if (timedOut && hasValidationProcessTreeSurvivors(child)) {
        signalValidationProcessTree(child, "SIGKILL");
      }
      untrack();
      resolveExit(exit);
    };
    child.once("error", (error) => finish({ exitCode: null, timedOut, spawnError: error.message }));
    child.once("close", (code) => finish({ exitCode: code, timedOut }));
  });
}
