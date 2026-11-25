import type { Command } from "commander";
import { addProjectOptions, printCommandError } from "./core.js";
import { resolveProjectPaths } from "./project.js";
import { isQueueRunning } from "./queue-command.js";
import { validateQueueId } from "./queue.js";
import {
  EXEC_STOP_EXIT_CODE,
  cancelStopRequest,
  describeStopTarget,
  formatStopRequest,
  listLiveAutoRuns,
  listStopRequests,
  parseStopTarget,
  requestStop,
  type StopRequest,
} from "./stop-request.js";

type StopOpts = {
  project?: string;
  track?: string;
  queue?: string;
  msg?: string;
  cancel?: boolean;
};

// `exec stop`: drain a running `exec run --auto` / `exec cycle` or exec queue (PJR-32PN).
export function registerExecStopCommand(exec: Command): void {
  const cmd = exec
    .command("stop")
    .description(
      "Ask a running exec run --auto / exec cycle (or exec queue) to claim no new tasks, " +
        `finish the running ones through integration, and exit with code ${EXEC_STOP_EXIT_CODE}`,
    )
    .option("--track <track>", "Stop only the auto run started with this --track")
    .option("--queue <queueId>", "Stop the exec queue (and its running auto run step)")
    .option("--msg <message>", "Reason for stopping (required unless --cancel)")
    .option("--cancel", "Withdraw the stop request; a run that has not exited keeps going", false);
  addProjectOptions(cmd);
  cmd.action((opts: StopOpts) => {
    try {
      const { executionPath } = resolveProjectPaths({ project: opts.project });
      if (opts.queue !== undefined) validateQueueId(opts.queue);
      const target = parseStopTarget(opts);
      if (opts.cancel) {
        const request = cancelStopRequest(executionPath, target);
        process.stdout.write(
          `Withdrew the stop request for ${describeStopTarget(target)} (requested at ${request.requested_at})\n`,
        );
        return;
      }
      if (opts.msg === undefined) throw new Error("--msg <message> is required");
      const { request, runs } = requestStop({
        executionPath,
        target,
        message: opts.msg,
        isQueueRunning: (queueId) => isQueueRunning(executionPath, queueId),
      });
      process.stdout.write(`Requested stop for ${describeStopTarget(target)}\n`);
      for (const run of runs) {
        const scope = run.track ? ` --track ${run.track}` : "";
        const queue = run.queue_id ? ` (queue ${run.queue_id})` : "";
        process.stdout.write(
          `  exec ${run.command} --auto${scope}${queue}: pid ${run.pid}, started ${run.started_at}\n`,
        );
      }
      process.stdout.write(
        "  It claims no new tasks and exits after the running tasks integrate. " +
          'Watch it with "exec status"; withdraw with "exec stop --cancel".\n',
      );
      process.stdout.write(`  ${formatStopRequest(request, runs)}\n`);
    } catch (error) {
      printCommandError(error);
    }
  });
}

/** Open stop requests appended to `exec status`, so a draining run is visible next to its tasks. */
export function writeStopRequestSummary(executionPath: string): void {
  let requests: StopRequest[];
  try {
    requests = listStopRequests(executionPath);
  } catch (error) {
    process.stderr.write(`ERROR: ${error instanceof Error ? error.message : String(error)}\n`);
    return;
  }
  if (requests.length === 0) return;
  const runs = listLiveAutoRuns(executionPath);
  process.stdout.write("\nstop requests:\n");
  for (const request of requests) {
    process.stdout.write(`  ${formatStopRequest(request, runs)}\n`);
  }
}
