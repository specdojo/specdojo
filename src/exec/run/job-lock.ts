import { join } from "node:path";
import { mkdirSync } from "node:fs";
import {
  isJobCommandTask,
  loadJobDefinition,
  materializeJobRun,
  resolveJobPaths,
} from "../../job/job.js";
import { resolveProjectPaths } from "../project.js";
import { releaseLock, tryAcquireLock } from "../slot-lock.js";
import { runJobMode, type JobPipelineAgentResolver } from "./job.js";
import { execLocksDir, ExecRunLockTimeoutError, inheritsExecRunLock } from "./lock.js";
import { withProjectExecRunLock, type RunOpts } from "./shared.js";

/** A sequence waits for exclusive access, including when invoked by routine/cron. */
export async function runJobWithProjectLock(
  opts: RunOpts,
  resolver: JobPipelineAgentResolver,
): Promise<void> {
  const paths = resolveProjectPaths({ project: opts.project });
  const definition = loadJobDefinition(
    resolveJobPaths(paths.projectId ?? opts.project),
    String(opts.job),
  );
  if (!isJobCommandTask(definition.task) || !definition.task.steps) {
    await withProjectExecRunLock(opts, "run", () => runJobMode(opts, resolver));
    return;
  }
  if (opts.dryRun) {
    await runJobMode(opts, resolver);
    return;
  }
  if (inheritsExecRunLock(paths.executionPath)) {
    await withProjectExecRunLock(opts, "run", () => runJobMode(opts, resolver));
    return;
  }
  const preview = await materializeJobRun({
    projectId: paths.projectId ?? opts.project,
    jobId: String(opts.job),
    inputs: opts.input,
    scheduledAt: opts.scheduledAt,
    dryRun: true,
  });
  // Guard the logical Run while waiting too. A duplicate caller must not overwrite a
  // running attempt with a timeout result. Different Runs still queue on the project lock.
  mkdirSync(execLocksDir(paths.executionPath), { recursive: true });
  const guard = tryAcquireLock(
    join(execLocksDir(paths.executionPath), `${preview.record.run_id}.sequence.lock`),
    { actor: "job-sequence" },
  );
  if (!guard) throw new Error(`Job sequence already running: ${preview.record.run_id}`);
  const frozenOpts = { ...opts, scheduledAt: preview.record.scheduled_at };
  const waitSeconds = isJobCommandTask(preview.record.task)
    ? (preview.record.task.lock_wait_seconds ?? 3600)
    : 3600;
  try {
    if (preview.duplicateComplete) {
      await runJobMode(frozenOpts, resolver);
      return;
    }
    try {
      await withProjectExecRunLock(
        {
          ...frozenOpts,
          ifBusy: "wait",
          lockWaitMs: waitSeconds * 1000,
        },
        "run",
        () => runJobMode(frozenOpts, resolver),
      );
    } catch (error) {
      if (!(error instanceof ExecRunLockTimeoutError)) throw error;
      await runJobMode(
        {
          ...frozenOpts,
          sequenceDeferredReason: `project lock wait timed out after ${waitSeconds} seconds`,
        },
        resolver,
      );
    }
  } finally {
    releaseLock(guard);
  }
}
