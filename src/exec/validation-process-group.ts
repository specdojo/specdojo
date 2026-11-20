import type { ChildProcess } from "node:child_process";

/** Wait after SIGTERM to the validation's process tree before SIGKILL (PJR-V277). */
export const VALIDATION_KILL_GRACE_MS = 10_000;
/** Wait after SIGKILL for the output pipes to close before returning without them. */
export const VALIDATION_CLOSE_GRACE_MS = 5_000;

/**
 * POSIX runs each parent validation in its own process group so a timeout reaches npm's
 * descendants (vitest and the CLIs it spawns). Windows has no process groups; there the runner
 * signals the direct child only and relies on the bounded pipe wait to return.
 */
export const VALIDATION_USES_PROCESS_GROUP = process.platform !== "win32";

const FORWARDED_SIGNALS = ["SIGINT", "SIGTERM", "SIGHUP"] as const;
const activeGroups = new Set<number>();

function signalGroup(pid: number, signal: NodeJS.Signals | 0): boolean {
  try {
    process.kill(-pid, signal);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ESRCH") return false;
    throw error;
  }
}

/**
 * Send `signal` to the child's process group, or to the child itself when it has no group.
 * Returns false when no process of the group remained to receive it.
 */
export function signalValidationProcessTree(child: ChildProcess, signal: NodeJS.Signals): boolean {
  if (VALIDATION_USES_PROCESS_GROUP && child.pid !== undefined) {
    try {
      return signalGroup(child.pid, signal);
    } catch {
      // EPERM などで group へ送れない場合は、直接の子にだけ送る従来の動きへ戻す。
    }
  }
  return child.kill(signal);
}

/** Whether any process of the child's group is still alive (always false without a group). */
export function hasValidationProcessTreeSurvivors(child: ChildProcess): boolean {
  if (!VALIDATION_USES_PROCESS_GROUP || child.pid === undefined) return false;
  try {
    return signalGroup(child.pid, 0);
  } catch {
    // EPERM は別ユーザーの同じ group が残っていることを示すため、生存として扱う。
    return true;
  }
}

function terminateActiveGroups(): void {
  for (const pid of activeGroups) {
    try {
      signalGroup(pid, "SIGTERM");
    } catch {
      // 終了処理の途中のため、送れない group は残して先へ進む。
    }
  }
}

function forwardSignal(signal: NodeJS.Signals): void {
  terminateActiveGroups();
  // 他に listener が無い場合は既定の動き（終了）を保つため、外してから送り直す。
  if (process.listenerCount(signal) > 1) return;
  removeForwarding();
  process.kill(process.pid, signal);
}

const signalHandlers = new Map<NodeJS.Signals, () => void>(
  FORWARDED_SIGNALS.map((signal) => [signal, () => forwardSignal(signal)]),
);

function installForwarding(): void {
  for (const [signal, handler] of signalHandlers) process.on(signal, handler);
  process.on("exit", terminateActiveGroups);
}

function removeForwarding(): void {
  for (const [signal, handler] of signalHandlers) process.off(signal, handler);
  process.off("exit", terminateActiveGroups);
}

/**
 * A detached group no longer receives the terminal's Ctrl-C, so the runner forwards SIGINT,
 * SIGTERM and SIGHUP (and its own exit) to the active validation groups while they run.
 * Returns the function that stops tracking the group.
 */
export function trackValidationProcessGroup(child: ChildProcess): () => void {
  const pid = child.pid;
  if (!VALIDATION_USES_PROCESS_GROUP || pid === undefined) return () => undefined;
  if (activeGroups.size === 0) installForwarding();
  activeGroups.add(pid);
  return () => {
    if (!activeGroups.delete(pid)) return;
    if (activeGroups.size === 0) removeForwarding();
  };
}
