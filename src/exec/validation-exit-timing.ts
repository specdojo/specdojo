import { performance } from "node:perf_hooks";

// PJR-P8SX: 親の検証が枠を持つ時間を、子の実際の時間と runner が終わりに気づくまでの遅れに分ける。

const EVENT_LOOP_TICK_MS = 20;

/**
 * Longest gap between ticks of an unref'd interval, including the gap still open when stopped.
 * The settle of a validation can run in the same loop turn that ends a stall, before any timer
 * fires, so the open gap is what shows the stall that delayed it.
 */
export class EventLoopStallTracker {
  private last = performance.now();
  private maxStall = 0;
  private readonly timer = setInterval(() => this.observe(), EVENT_LOOP_TICK_MS).unref();

  private observe(): void {
    const now = performance.now();
    this.maxStall = Math.max(this.maxStall, now - this.last - EVENT_LOOP_TICK_MS);
    this.last = now;
  }

  /** Stop ticking and return the longest stall in milliseconds. */
  stop(): number {
    clearInterval(this.timer);
    this.observe();
    return Math.max(0, this.maxStall);
  }
}

export type ValidationExitTiming = {
  /** Spawn to the moment the runner settled the validation (what holds the gate). */
  duration_ms: number;
  /** Spawn to the child's last output write; approximates the child's own run time. */
  last_output_ms?: number;
  /** Last output write to settle: how long the runner took to notice the end. */
  detection_lag_ms?: number;
  /** Longest single event-loop stall seen while the validation ran. */
  event_loop_delay_max_ms: number;
};

/**
 * Split a validation's gate-holding time into the child's work and the runner's detection lag
 * (PJR-P8SX). Inputs are wall-clock milliseconds; the last write comes from the output files'
 * mtime, which the kernel advances even while the runner's event loop is blocked.
 */
export function validationExitTiming(input: {
  spawnedAt: number;
  settledAt: number;
  lastWriteAt?: number;
  eventLoopDelayMaxMs: number;
}): ValidationExitTiming {
  const duration = Math.max(0, input.settledAt - input.spawnedAt);
  const timing: ValidationExitTiming = {
    duration_ms: Math.round(duration),
    event_loop_delay_max_ms: Math.round(input.eventLoopDelayMaxMs),
  };
  if (input.lastWriteAt === undefined) return timing;
  const lastOutput = Math.min(duration, Math.max(0, input.lastWriteAt - input.spawnedAt));
  return {
    ...timing,
    last_output_ms: Math.round(lastOutput),
    detection_lag_ms: Math.round(duration - lastOutput),
  };
}
