import type { Command } from "commander";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { gitEnvironment } from "../shared/git-environment.js";
import { selfRunArgs } from "../shared/spawn-self.js";
import { specdojoRootDir } from "../shared/specdojo-config.js";
import { addProjectOptions, printCommandError, resolveProjectId } from "./core.js";
import { runParentValidationBatch } from "./parent-validation.js";
import { updateDistBuildFailureMarker } from "./post-integration.js";
import { resolveProjectPaths } from "./project.js";
import {
  cancelQueue,
  createQueueRecord,
  formatQueueSummary,
  isQueueFinished,
  listQueueRecords,
  loadQueueRecord,
  queueLockPath,
  queueRecordPath,
  queueStepDisplay,
  runQueue,
  validateQueueId,
  writeQueueRecord,
  type QueueOnFailure,
  type QueueStep,
  type QueueStepOutcome,
} from "./queue.js";
import { acquireExecRunLock, releaseExecRunLock } from "./run/lock.js";

/** Spawn the specdojo CLI without a shell and resolve when that process exits. */
function runSpecdojoStep(argv: string[]): Promise<QueueStepOutcome> {
  const [executable, args] = selfRunArgs(argv);
  return new Promise((resolveOutcome) => {
    const child = spawn(executable, args, {
      cwd: specdojoRootDir(),
      env: gitEnvironment(),
      shell: false,
      stdio: "inherit",
    });
    child.once("error", (error) => resolveOutcome({ exitCode: null, summary: error.message }));
    child.once("close", (code, signal) =>
      resolveOutcome({
        exitCode: code,
        summary: signal ? `terminated by ${signal}` : `exit code ${code ?? "unknown"}`,
      }),
    );
  });
}

/** `post-integration build-dist`: the PJR-8KXJ allowlisted build, under the project exec lock. */
async function runBuildDistStep(executionPath: string): Promise<QueueStepOutcome> {
  const handle = await acquireExecRunLock(executionPath, {
    actor: "exec-queue",
    ifBusy: "wait",
    onWait: () => process.stdout.write("[queue] exec busy — waiting to run build-dist\n"),
  });
  if (!handle) return { exitCode: null, summary: "could not acquire the exec lock" };
  try {
    const repoRoot = specdojoRootDir();
    const batch = await runParentValidationBatch(["build"], repoRoot);
    const validation = batch.validations[0];
    const failed = validation?.status !== "passed";
    updateDistBuildFailureMarker(repoRoot, failed, "exec queue build-dist");
    return { exitCode: failed ? 1 : 0, summary: validation?.summary ?? "build did not run" };
  } finally {
    releaseExecRunLock(handle);
  }
}

function executeQueueStep(executionPath: string) {
  return (step: QueueStep): Promise<QueueStepOutcome> =>
    step.kind === "post-integration" ? runBuildDistStep(executionPath) : runSpecdojoStep(step.argv);
}

export function registerExecQueueCommands(exec: Command): void {
  const queue = exec
    .command("queue")
    .description("Reserve grade / exec run / post-integration steps and run them in order");

  // Shared by --step and --step-continue so the order of the options is the order of the steps.
  const collected: Array<{ spec: string; onFailure: QueueOnFailure }> = [];
  const collect = (onFailure: QueueOnFailure) => (spec: string) => {
    collected.push({ spec, onFailure });
    return collected;
  };
  const add = queue
    .command("add <queueId>")
    .description("Create a queue file under execution/queues/")
    .option(
      "--step <spec>",
      'Step that stops the queue on failure (e.g. "exec run --register PJR-XXXX")',
      collect("stop"),
    )
    .option(
      "--step-continue <spec>",
      "Step whose failure does not stop the queue",
      collect("continue"),
    );
  addProjectOptions(add);
  add.action((queueId: string, opts: { project?: string }) => {
    try {
      const { executionPath } = resolveProjectPaths({ project: opts.project });
      const path = queueRecordPath(executionPath, validateQueueId(queueId));
      if (existsSync(path)) throw new Error(`Queue already exists: ${path}`);
      const record = createQueueRecord({
        queueId,
        projectId: resolveProjectId(opts),
        steps: collected,
      });
      writeQueueRecord(path, record);
      process.stdout.write(`Created queue: ${path}\n`);
      for (const step of record.steps) {
        process.stdout.write(`  ${step.index}. [${step.on_failure}] ${queueStepDisplay(step)}\n`);
      }
    } catch (error) {
      printCommandError(error);
    }
  });

  const run = queue.command("run <queueId>").description("Run (or resume) a queue in order");
  addProjectOptions(run);
  run.action(async (queueId: string, opts: { project?: string }) => {
    try {
      const { executionPath } = resolveProjectPaths({ project: opts.project });
      validateQueueId(queueId);
      const record = await runQueue({
        recordPath: queueRecordPath(executionPath, queueId),
        lockDir: queueLockPath(executionPath, queueId),
        execute: executeQueueStep(executionPath),
      });
      process.exitCode = record.state === "succeeded" ? 0 : 1;
    } catch (error) {
      printCommandError(error);
    }
  });

  const status = queue
    .command("status [queueId]")
    .description("Show queues, or the steps of one queue");
  addProjectOptions(status);
  status.action((queueId: string | undefined, opts: { project?: string }) => {
    try {
      const { executionPath } = resolveProjectPaths({ project: opts.project });
      if (queueId) {
        validateQueueId(queueId);
        const record = loadQueueRecord(queueRecordPath(executionPath, queueId));
        process.stdout.write(
          `${formatQueueSummary(record, queueLockPath(executionPath, queueId))}\n`,
        );
        for (const step of record.steps) {
          const detail = step.summary ? ` (${step.summary})` : "";
          process.stdout.write(
            `  ${step.index}. ${step.status} [${step.on_failure}] ${queueStepDisplay(step)}${detail}\n`,
          );
        }
        return;
      }
      const { records, errors } = listQueueRecords(executionPath);
      if (records.length === 0) process.stdout.write("No queues.\n");
      for (const record of records) {
        process.stdout.write(
          `${formatQueueSummary(record, queueLockPath(executionPath, record.queue_id))}\n`,
        );
      }
      for (const error of errors) process.stderr.write(`ERROR: ${error}\n`);
      if (errors.length) process.exitCode = 1;
    } catch (error) {
      printCommandError(error);
    }
  });

  const cancel = queue
    .command("cancel <queueId>")
    .description("Cancel a queue; a running queue stops before its next step")
    .requiredOption("--msg <message>", "Reason for cancelling");
  addProjectOptions(cancel);
  cancel.action((queueId: string, opts: { project?: string; msg: string }) => {
    try {
      const { executionPath } = resolveProjectPaths({ project: opts.project });
      validateQueueId(queueId);
      const record = cancelQueue(queueRecordPath(executionPath, queueId), opts.msg);
      process.stdout.write(`Cancelled queue: ${record.queue_id}\n`);
    } catch (error) {
      printCommandError(error);
    }
  });
}

/** Unfinished queues appended to `exec status`, so reservations stay visible next to tasks. */
export function writeActiveQueueSummary(executionPath: string): void {
  const { records } = listQueueRecords(executionPath);
  const active = records.filter((record) => !isQueueFinished(record));
  if (active.length === 0) return;
  process.stdout.write("\nqueues:\n");
  for (const record of active) {
    process.stdout.write(
      `  ${formatQueueSummary(record, queueLockPath(executionPath, record.queue_id))}\n`,
    );
  }
}
