import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { type Command } from "commander";
import {
  acquireSchedulerLock,
  foldEventsToState,
  readAllEventFiles,
  releaseSchedulerLock,
} from "./exec-events.js";
import {
  hasMemberCommandSource,
  loadExecDefaultsConfig,
  resolveMemberCommand,
} from "./exec-agent-config.js";
import { activateResolvedProjectPaths, resolveProjectPaths } from "./exec-project.js";
import {
  buildTaskPhaseMap,
  loadPrompt,
  loadRosterForExecutionPath,
  resolveTaskPhaseContext,
  selectCandidates,
} from "./exec-run.js";
import { buildScheduleIndex } from "./exec-schedule.js";
import { buildInitialStateFromStrategy } from "./exec-schedule-initial.js";
import { generateSinglePlan } from "./exec-plans.js";
import { qualifyTaskId } from "./exec-shared.js";
import { buildTaskView } from "./exec-task-view.js";
import {
  findExecWorktree,
  gitOutput,
  gitResult,
  resolveWorktreeBase,
  worktreeNameFromTaskId,
  type ExecWorktree,
} from "./exec-worktree.js";
import {
  checkpointAndEnsureWorktree,
  commitWorktreeChanges,
  mergeWorktreeIntoCurrent,
  removeWorktree,
  taskPaths,
  worktreeStatusPaths,
} from "./exec-worktree-ops.js";
import { getProjectSchedulePath, loadConfig, specdojoRootDir } from "./specdojo-config.js";

export { isCommitTargetPath, stabilizeCommitTargets } from "./exec-worktree-ops.js";

type CommonOpts = {
  project?: string;
  task: string;
  dryRun?: boolean;
  worktreeBase?: string;
};

type AgentOpts = CommonOpts & {
  by?: string;
  agentCmd?: string;
};

type CommitOpts = CommonOpts & {
  message?: string;
};

type MergeOpts = CommonOpts & {
  ffOnly?: boolean;
};

type RemoveOpts = CommonOpts & {
  deleteBranch?: boolean;
  force?: boolean;
};

type TaskExecutionState = {
  actor?: string;
  claimEventPath?: string;
  state: string;
};

type ProjectContext = ReturnType<typeof resolveProjectPaths> & {
  repoRoot: string;
};

const DEFAULT_LOCK_TIMEOUT_MS = 10_000;
const DEFAULT_LOCK_STALE_MS = 300_000;

function commandError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}

function resolveContext(opts: { project?: string }): ProjectContext {
  const paths = resolveProjectPaths({ project: opts.project });
  activateResolvedProjectPaths(paths);
  return { ...paths, repoRoot: specdojoRootDir() };
}

function configuredWorktreeBase(schedulePath: string): string | undefined {
  const { config } = loadConfig();
  if (!config) return undefined;
  const rootDir = specdojoRootDir();
  for (const project of Object.values(config.projects)) {
    if (resolve(rootDir, getProjectSchedulePath(project)) === schedulePath) {
      return project.run?.worktree_base;
    }
  }
  return undefined;
}

function taskExecutionState(schedulePath: string, taskId: string): TaskExecutionState {
  const schedule = buildScheduleIndex(schedulePath);
  if (!schedule.nodes.has(taskId)) throw new Error(`Task not found in schedule: ${taskId}`);
  const events = readAllEventFiles(schedulePath);
  const initial = buildInitialStateFromStrategy(schedulePath, schedule);
  const snapshot = foldEventsToState(events, schedule, schedulePath, initial);
  const claims = events.filter(
    (item) => item.event.task_id === taskId && item.event.type === "claim",
  );
  const claim = claims[claims.length - 1];
  return {
    actor: claim?.event.by,
    claimEventPath: claim?.path,
    state: snapshot.tasks[taskId]?.state ?? "todo",
  };
}

function requireDoingTask(schedulePath: string, taskId: string): Required<TaskExecutionState> {
  const state = taskExecutionState(schedulePath, taskId);
  if (state.state !== "doing") {
    throw new Error(`Task must be doing before worktree execution: ${taskId} (${state.state})`);
  }
  if (!state.actor || !state.claimEventPath) {
    throw new Error(`Claim event not found for doing task: ${taskId}`);
  }
  return state as Required<TaskExecutionState>;
}

function requireWorktree(repoRoot: string, worktreeTaskId: string): ExecWorktree {
  const worktree = findExecWorktree(repoRoot, worktreeTaskId);
  if (!worktree) throw new Error(`Worktree is not prepared for task: ${worktreeTaskId}`);
  if (!existsSync(worktree.path)) {
    throw new Error(`Registered worktree path does not exist: ${worktree.path}`);
  }
  return worktree;
}

function requireInsideWorktree(repoRoot: string, worktree: ExecWorktree): void {
  if (resolve(repoRoot) !== resolve(worktree.path)) {
    throw new Error(`Run this command inside the task worktree: ${worktree.path}`);
  }
}

function resolveAgent(
  context: ProjectContext,
  taskId: string,
  opts: AgentOpts,
): {
  actor: string;
  command: string;
  prompt: string;
} {
  const state = requireDoingTask(context.schedulePath, taskId);
  if (opts.by && opts.by !== state.actor) {
    throw new Error(`--by ${opts.by} does not match claim actor ${state.actor}.`);
  }
  const task = buildTaskView(context.schedulePath, context.executionPath, taskId);
  const roster = loadRosterForExecutionPath(context.executionPath);
  const execDefaults = loadExecDefaultsConfig(undefined, context.executionPath);
  let command = opts.agentCmd?.trim() ?? "";

  if (command) {
    const member = roster?.members.find(
      (item) =>
        item.type === "agent" &&
        hasMemberCommandSource(execDefaults, item) &&
        item.nickname === command,
    );
    const resolved = member ? resolveMemberCommand(execDefaults, member) : undefined;
    command = resolved ?? command;
  } else {
    if ((task.execution ?? "agent") === "human") {
      throw new Error(`Task requires human execution. Use --agent-cmd to override: ${taskId}`);
    }
    const member = roster?.members.find(
      (item) => item.nickname === state.actor && item.type === "agent",
    );
    const resolved = member ? resolveMemberCommand(execDefaults, member) : undefined;
    if (!resolved) {
      throw new Error(`Agent command not found for claim actor: ${state.actor}`);
    }
    const maps = buildTaskPhaseMap(context.schedulePath);
    if (!resolveTaskPhaseContext(task, maps.localIdToPhaseSets, maps.phaseSetSuffixToId)) {
      throw new Error(`Cannot resolve phase context for task: ${taskId}`);
    }
    const candidates = selectCandidates(
      { capabilities: task.capabilities ?? [], proficiency: task.proficiency },
      roster,
      task.mode ?? "edit",
      undefined,
      execDefaults,
    );
    if (!candidates.some((candidate) => candidate.nickname === state.actor)) {
      throw new Error(`Claim actor does not satisfy task agent requirements: ${state.actor}`);
    }
    command = resolved;
  }

  const prompt = loadPrompt(context.executionPath, taskId);
  if (!prompt) throw new Error(`Plan not found for task: ${taskId}`);
  return { actor: state.actor, command, prompt };
}

function printWorktree(worktree: ExecWorktree): void {
  process.stdout.write(`worktree: ${worktree.path}\nbranch: ${worktree.branch}\n`);
}

async function prepare(opts: CommonOpts): Promise<void> {
  const context = resolveContext(opts);
  const state = requireDoingTask(context.schedulePath, opts.task);
  const worktreeTaskId = qualifyTaskId(context.projectId, opts.task);
  const name = worktreeNameFromTaskId(worktreeTaskId);
  const branch = `exec/${name}`;
  const base = resolveWorktreeBase(
    context.repoRoot,
    opts.worktreeBase,
    configuredWorktreeBase(context.schedulePath),
  );
  const planned: ExecWorktree = {
    path: resolve(base, name),
    branch,
    name,
    created: false,
  };

  if (opts.dryRun) {
    process.stdout.write(`[dry-run] claim actor: ${state.actor}\n`);
    process.stdout.write(`[dry-run] checkpoint: exec(${opts.task}): prepare execution\n`);
    printWorktree(findExecWorktree(context.repoRoot, worktreeTaskId) ?? planned);
    return;
  }

  let lockDir = "";
  try {
    lockDir = acquireSchedulerLock(context.schedulePath, {
      actor: `worktree-prepare:${state.actor}`,
      lockTimeoutMs: DEFAULT_LOCK_TIMEOUT_MS,
      lockStaleMs: DEFAULT_LOCK_STALE_MS,
    });
    const lockedState = requireDoingTask(context.schedulePath, opts.task);
    const planPath = join(context.executionPath, "exec", "plans", `${opts.task}-plan.md`);
    const resultPath = join(context.executionPath, "exec", "results", `${opts.task}-result.md`);

    // Plans are generated on demand (exec build no longer manages them). Generate
    // one if absent; keep an existing plan so a hand-edited plan is not clobbered.
    if (!existsSync(planPath)) {
      await generateSinglePlan({
        executionPath: context.executionPath,
        projectId: opts.project ?? process.env.SPECDOJO_PROJECT ?? "",
        catalogPath: context.catalogPath ?? "",
        rolesPath: context.rolesPath,
        viewpointsPath: context.viewpointsPath,
        task: buildTaskView(context.schedulePath, context.executionPath, opts.task),
      });
    }

    for (const path of [planPath, resultPath, lockedState.claimEventPath]) {
      if (!existsSync(path)) throw new Error(`Required execution file not found: ${path}`);
    }

    const worktree = checkpointAndEnsureWorktree({
      context,
      taskId: opts.task,
      worktreeTaskId,
      base,
      planPath,
      resultPath,
      claimEventPath: lockedState.claimEventPath,
    });
    printWorktree(worktree);
  } finally {
    if (lockDir) releaseSchedulerLock(lockDir);
  }
}

function status(opts: CommonOpts): void {
  const context = resolveContext(opts);
  const state = taskExecutionState(context.schedulePath, opts.task);
  const worktreeTaskId = qualifyTaskId(context.projectId, opts.task);
  const worktree = findExecWorktree(context.repoRoot, worktreeTaskId);
  const branch = `exec/${worktreeNameFromTaskId(worktreeTaskId)}`;
  process.stdout.write(`task: ${opts.task}\nstate: ${state.state}\n`);
  process.stdout.write(`claim-actor: ${state.actor ?? "not found"}\n`);
  if (!worktree) {
    const base = resolveWorktreeBase(
      context.repoRoot,
      opts.worktreeBase,
      configuredWorktreeBase(context.schedulePath),
    );
    process.stdout.write(
      `worktree: not prepared (expected ${resolve(base, worktreeNameFromTaskId(worktreeTaskId))})\n`,
    );
    process.stdout.write(`branch: ${branch}\n`);
    return;
  }

  const { planRel, resultRel } = taskPaths(context, opts.task);
  const compareBase = gitOutput(context.repoRoot, ["merge-base", "HEAD", branch]).trim();
  const merged =
    gitResult(context.repoRoot, ["merge-base", "--is-ancestor", branch, "HEAD"]).status === 0;
  const resultChanged =
    gitResult(worktree.path, ["diff", "--quiet", compareBase, "--", resultRel]).status === 1;
  let agentCommand = "unavailable";
  try {
    agentCommand = resolveAgent(context, opts.task, { ...opts, task: opts.task }).command;
  } catch {}

  printWorktree(worktree);
  process.stdout.write(`compare-base: ${compareBase}\n`);
  process.stdout.write(`agent-command: ${agentCommand}\n`);
  process.stdout.write(
    `plan: ${existsSync(resolve(worktree.path, planRel)) ? "present" : "missing"}\n`,
  );
  process.stdout.write(
    `result: ${existsSync(resolve(worktree.path, resultRel)) ? "present" : "missing"}\n`,
  );
  process.stdout.write(`result-changed: ${resultChanged ? "yes" : "no"}\n`);
  const changes = worktreeStatusPaths(worktree.path);
  process.stdout.write(`uncommitted: ${changes.length > 0 ? changes.join(", ") : "none"}\n`);
  process.stdout.write(`merged-into-current: ${merged ? "yes" : "no"}\n`);
}

async function agent(opts: AgentOpts): Promise<void> {
  const context = resolveContext(opts);
  const worktree = requireWorktree(context.repoRoot, qualifyTaskId(context.projectId, opts.task));
  requireInsideWorktree(context.repoRoot, worktree);
  const resolved = resolveAgent(context, opts.task, opts);
  if (opts.dryRun) {
    process.stdout.write(`[dry-run] actor: ${resolved.actor}\n`);
    process.stdout.write(`[dry-run] command: ${resolved.command}\n`);
    process.stdout.write(`[dry-run] cwd: ${worktree.path}\n`);
    process.stdout.write(`[dry-run] plan: ${resolved.prompt.length} chars\n`);
    return;
  }

  const child = spawn(resolved.command, {
    cwd: worktree.path,
    env: {
      ...process.env,
      SPECDOJO_SCHEDULE_PATH: context.schedulePath,
      SPECDOJO_EXECUTION_PATH: context.executionPath,
    },
    shell: true,
    stdio: ["pipe", "inherit", "inherit"],
  });
  child.stdin.end(resolved.prompt);
  const exitCode = await new Promise<number>((resolveExit) => {
    child.once("error", () => resolveExit(1));
    child.once("close", (code) => resolveExit(code ?? 1));
  });
  if (exitCode !== 0) process.exitCode = exitCode;
}

function commit(opts: CommitOpts): void {
  const context = resolveContext(opts);
  requireDoingTask(context.schedulePath, opts.task);
  const worktree = requireWorktree(context.repoRoot, qualifyTaskId(context.projectId, opts.task));
  requireInsideWorktree(context.repoRoot, worktree);
  commitWorktreeChanges({
    context,
    worktree,
    taskId: opts.task,
    message: opts.message,
    dryRun: opts.dryRun,
  });
}

function merge(opts: MergeOpts): void {
  const context = resolveContext(opts);
  const worktree = requireWorktree(context.repoRoot, qualifyTaskId(context.projectId, opts.task));
  mergeWorktreeIntoCurrent({
    context,
    worktree,
    taskId: opts.task,
    ffOnly: opts.ffOnly,
    dryRun: opts.dryRun,
  });
}

function remove(opts: RemoveOpts): void {
  const context = resolveContext(opts);
  const worktree = requireWorktree(context.repoRoot, qualifyTaskId(context.projectId, opts.task));
  removeWorktree({
    context,
    worktree,
    taskId: opts.task,
    force: opts.force,
    deleteBranch: opts.deleteBranch,
    dryRun: opts.dryRun,
  });
}

function addCommonOptions(command: Command): Command {
  return command
    .option("--project <projectId>", "Project id in .specdojo/specdojo.config.json")
    .requiredOption("--task <taskId>", "Task ID");
}

export function registerExecWorktreeCommands(exec: Command): void {
  const worktree = exec.command("worktree").description("Manually manage task execution worktrees");

  const prepareCommand = addCommonOptions(
    worktree.command("prepare").description("Commit execution checkpoint and prepare worktree"),
  );
  prepareCommand.option("--worktree-base <path>", "Override worktree base directory");
  prepareCommand.option("--dry-run", "Print planned operations without changing files", false);
  prepareCommand.action(async (opts: CommonOpts) => {
    try {
      await prepare(opts);
    } catch (error) {
      commandError(error);
    }
  });

  const statusCommand = addCommonOptions(
    worktree.command("status").description("Show task worktree and Git status"),
  );
  statusCommand.option("--worktree-base <path>", "Override worktree base directory");
  statusCommand.action((opts: CommonOpts) => {
    try {
      status(opts);
    } catch (error) {
      commandError(error);
    }
  });

  const agentCommand = addCommonOptions(
    worktree.command("agent").description("Run the task agent once inside its worktree"),
  );
  agentCommand.option("--by <actor>", "Validate the claim actor");
  agentCommand.option("--agent-cmd <command>", "Override agent command");
  agentCommand.option("--dry-run", "Print the resolved command without executing", false);
  agentCommand.action(async (opts: AgentOpts) => {
    try {
      await agent(opts);
    } catch (error) {
      commandError(error);
    }
  });

  const commitCommand = addCommonOptions(
    worktree.command("commit").description("Commit task result and deliverable changes"),
  );
  commitCommand.option("--message <message>", "Override commit message");
  commitCommand.option("--dry-run", "Print commit targets without committing", false);
  commitCommand.action((opts: CommitOpts) => {
    try {
      commit(opts);
    } catch (error) {
      commandError(error);
    }
  });

  const mergeCommand = addCommonOptions(
    worktree.command("merge").description("Merge the task exec branch into the current branch"),
  );
  mergeCommand.option("--ff-only", "Require a fast-forward merge", false);
  mergeCommand.option("--dry-run", "Print the merge command without merging", false);
  mergeCommand.action((opts: MergeOpts) => {
    try {
      merge(opts);
    } catch (error) {
      commandError(error);
    }
  });

  const removeCommand = addCommonOptions(
    worktree.command("remove").description("Remove a merged task worktree"),
  );
  removeCommand.option(
    "--delete-branch",
    "Delete the merged exec branch with git branch -d",
    false,
  );
  removeCommand.option("--force", "Force worktree removal even when dirty or unmerged", false);
  removeCommand.option("--dry-run", "Print removal operations without changing Git state", false);
  removeCommand.action((opts: RemoveOpts) => {
    try {
      remove(opts);
    } catch (error) {
      commandError(error);
    }
  });
}
