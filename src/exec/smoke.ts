import type { Command } from "commander";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { atomicWriteFile, registerEventActor } from "../register/core.js";
import {
  readRegisterEventsFromContent,
  registerEventFilePath,
  type RegisterEventV1,
} from "../register/events.js";
import {
  resolveRegisterPaths,
  runRegisterMutationInCurrentWorktree,
  type RegisterPaths,
} from "../register/register.js";
import { loadItemForUpdate } from "../register/update.js";
import { CrossProcessMutex } from "../shared/cross-process-lock.js";
import { loadExecDefaultsConfig } from "./agent-config.js";
import { resolveProjectPaths } from "./project.js";
import { normalizePjrId, parseRegisterIds, requireRunnableRegisterItem } from "./register.js";
import { loadRosterForExecutionPath } from "./run/agent.js";
import { spawnSelf } from "./run/mode-shared.js";
import { resolveRegisterPipelineCommand } from "./run/register-core.js";
import { resolveExecDefaultsPath } from "./run/shared.js";

type SmokeOptions = {
  project?: string;
  register: string;
  targets: string;
  executorBy: string;
  reporterBy: string;
  by: string;
  worktreeBase?: string;
  dryRun?: boolean;
};

// New tickets delimit the list explicitly. The legacy JSEY completion condition remains usable.
export function appendSmokeTargets(content: string, targets: readonly string[]): string {
  const marked = /<!-- specdojo:smoke-targets -->[\s\S]*?<!-- \/specdojo:smoke-targets -->/g;
  const legacy = /（PJR-[0-9A-Z]{4}(?:・PJR-[0-9A-Z]{4})*）(?=のうち)/g;
  const markedLists = [...content.matchAll(marked)];
  const lists = markedLists.length ? markedLists : [...content.matchAll(legacy)];
  if (lists.length !== 1)
    throw new Error(
      "Expected one smoke target list; delimit it with <!-- specdojo:smoke-targets --> and <!-- /specdojo:smoke-targets -->",
    );
  const match = lists[0];
  const list = match[0];
  const existing = new Set(list.match(/PJR-[0-9A-Z]{4}/g) ?? []);
  const added = [...new Set(targets)].filter((id) => !existing.has(id));
  if (!added.length) return content;
  const updated = markedLists.length
    ? list.replace(
        /\s*<!-- \/specdojo:smoke-targets -->$/,
        `\n${added.join("・")}\n<!-- /specdojo:smoke-targets -->`,
      )
    : list.slice(0, -1) + "・" + added.join("・") + "）";
  return content.slice(0, match.index) + updated + content.slice(match.index! + list.length);
}

export function verifySmokeEvents(
  before: readonly RegisterEventV1[],
  after: readonly RegisterEventV1[],
  actor: string,
): { start: RegisterEventV1; review: RegisterEventV1 } {
  if (before.some((event, index) => JSON.stringify(event) !== JSON.stringify(after[index])))
    throw new Error("Register event history changed during smoke run");
  const fresh = after.slice(before.length);
  const starts = fresh.filter((event) => event.action === "start");
  const reviews = fresh.filter((event) => event.action === "review");
  if (starts.length !== 1 || reviews.length !== 1)
    throw new Error("Expected one new start and one new review event from this run");
  const start = starts[0];
  const review = reviews[0];
  if (
    fresh.indexOf(start) >= fresh.indexOf(review) ||
    fresh.at(-1) !== review ||
    start.to_status !== "in-progress" ||
    review.from_status !== "in-progress" ||
    review.to_status !== "review" ||
    fresh.some((event) => event.action === "wait" || event.action === "reopen")
  )
    throw new Error("Smoke run did not proceed from start to review without interruption");
  if (start.actor !== actor || review.actor !== actor)
    throw new Error(
      `Expected concrete actor ${actor}; start=${start.actor}, review=${review.actor}`,
    );
  return { start, review };
}

function readEvents(paths: RegisterPaths, id: string): RegisterEventV1[] {
  const path = registerEventFilePath(paths.projectRegisterPath, id);
  return readRegisterEventsFromContent(readFileSync(path, "utf8"), path);
}

function checkTickets(paths: RegisterPaths, id: string, targets: readonly string[]) {
  if (targets.includes(id)) throw new Error("Smoke item cannot also be a target");
  for (const target of targets) {
    const view = loadItemForUpdate(paths, target);
    if (!["review", "done"].includes(view.item.status))
      throw new Error(`Target ${target} must be review or done; actual=${view.item.status}`);
  }
  const view = loadItemForUpdate(paths, id);
  if (!["done", "open", "review"].includes(view.item.status))
    throw new Error(
      `Smoke item ${id} must be done, open or review; actual=${view.item.status}. Resolve or resume the existing run first.`,
    );
  if (requireRunnableRegisterItem({ ...view.item, status: "open" }) !== "edit")
    throw new Error(`Smoke item ${id} must be an edit task`);
  appendSmokeTargets(readFileSync(view.ticketPath!, "utf8"), targets);
  return view;
}

export async function runExecSmoke(opts: SmokeOptions): Promise<void> {
  let stage = "preflight";
  const step = (name: string, description: string): void => {
    stage = name;
    process.stdout.write(`[smoke:${name}] ${description}\n`);
  };
  try {
    const id = normalizePjrId(opts.register);
    const targets = parseRegisterIds(opts.targets).ids;
    if (!targets.length) throw new Error("--targets requires at least one item ID");
    const paths = resolveRegisterPaths(opts);
    const project = paths.projectId;
    const executionPath = paths.executionPath!;
    const projectPaths = resolveProjectPaths({ project });
    const defaults = loadExecDefaultsConfig(
      resolveExecDefaultsPath({}, projectPaths.schedulePath),
      executionPath,
    );
    const roster = loadRosterForExecutionPath(executionPath);
    const { executor } = resolveRegisterPipelineCommand(roster, opts, defaults);
    const actor = executor.actor;
    const by = registerEventActor({ project, by: opts.by });
    const view = checkTickets(paths, id, targets);
    readEvents(paths, id);
    const reason = `${targets.join("・")} の統合後の動作確認`;
    const runArgs = [
      "exec",
      "run",
      "--project",
      project,
      "--register",
      id,
      "--worktree",
      "--executor-by",
      opts.executorBy,
      "--reporter-by",
      opts.reporterBy,
      "--on-rate-limit",
      "stop",
    ];
    if (opts.worktreeBase) runArgs.push("--worktree-base", opts.worktreeBase);
    if (opts.dryRun) {
      const content = readFileSync(view.ticketPath!, "utf8");
      step(
        "targets",
        appendSmokeTargets(content, targets) === content
          ? `Would keep ${view.ticketPath}; all targets are already listed, no target commit needed`
          : `Would append missing IDs from ${targets.join(", ")} to ${view.ticketPath} and commit the ticket under exec-lifecycle lock`,
      );
      step(
        "reopen",
        view.item.status === "done"
          ? `Would register reopen ${id} --by ${by} --commit`
          : `Would skip reopen (${view.item.status})`,
      );
      step("run", `Would run specdojo ${runArgs.join(" ")}`);
      step(
        "verify",
        `Would require new start → review events with concrete actor ${actor}; leave items for register close`,
      );
      return;
    }
    const mutex = new CrossProcessMutex(join(executionPath, "exec", ".locks", "exec-smoke"), {
      actor: by,
      label: `smoke ${id}`,
    });
    await mutex.runExclusive(async () => {
      step("targets", `Record ${targets.join(", ")} in ${id}`);
      await runRegisterMutationInCurrentWorktree(
        "smoke-targets",
        { project, by, commit: true },
        (context) => {
          const current = checkTickets(context.paths, id, targets);
          const path = current.ticketPath!;
          const eventPath = registerEventFilePath(context.paths.projectRegisterPath, id);
          context.assertCommitTargetsClean([path, eventPath]);
          const content = readFileSync(path, "utf8");
          const updated = appendSmokeTargets(content, targets);
          if (updated !== content) atomicWriteFile(path, updated);
          return { id, title: current.item.title };
        },
      );
      step("reopen", `Open ${id} if terminal`);
      if (loadItemForUpdate(paths, id).item.status === "done") {
        if (
          !spawnSelf([
            "register",
            "reopen",
            "--project",
            project,
            "--id",
            id,
            "--by",
            by,
            "--reason",
            reason,
            "--commit",
          ])
        )
          throw new Error(`register reopen failed for ${id}; see command output above`);
      }
      const before = readEvents(paths, id);
      step("run", `Run ${id} with ${opts.executorBy} (${actor})`);
      if (!spawnSelf(runArgs))
        throw new Error(
          `exec run failed for ${id}; see command output above; inspect the run before retrying`,
        );
      step("verify", "Check this run's events and final item status");
      const { start, review } = verifySmokeEvents(before, readEvents(paths, id), actor);
      if (loadItemForUpdate(paths, id).item.status !== "review")
        throw new Error(`${id} did not reach review`);
      process.stdout.write(
        `Smoke passed: ${id}; targets=${targets.join(",")}; actor=${actor}; start=${start.id}; review=${review.id}\nClose ${id} and the targets with register close after checking their completion conditions.\n`,
      );
    });
  } catch (error) {
    process.stderr.write(
      `[smoke:${stage}] failed: ${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 1;
  }
}

export function registerExecSmokeCommand(exec: Command): void {
  exec
    .command("smoke")
    .description(
      "Record integration targets, reopen a smoke item, run it in a worktree, and verify concrete event actors",
    )
    .option("--project <id>", "Project id")
    .requiredOption("--register <id>", "Smoke register item ID (project-specific)")
    .requiredOption("--targets <ids>", "Comma-separated integrated register item IDs")
    .requiredOption("--executor-by <nickname>", "Executor nickname or alias")
    .requiredOption("--reporter-by <nickname>", "Reporter nickname or alias")
    .option("--by <actor>", "Actor for target recording and reopen", "specdojo-orchestrator")
    .option("--worktree-base <path>", "Base directory for execution worktrees")
    .option("--dry-run", "Print steps without writing, committing or launching agents", false)
    .action(runExecSmoke);
}
