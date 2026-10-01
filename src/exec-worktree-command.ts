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
  agentGitStateViolation,
  captureAgentGitStateAcrossRepos,
  changedAgentGitStateAcrossRepos,
  qualifiedGitStateFields,
} from "./exec-agent-git-state.js";
import {
  agentProtectedConfigViolation,
  captureAgentProtectedConfigAcrossRepos,
  changedAgentProtectedConfigAcrossRepos,
  qualifiedRepoPaths,
} from "./exec-agent-protected-config.js";
import {
  recordGitStateBlockAcrossRepos,
  recordProtectedConfigBlockAcrossRepos,
} from "./exec-protection-handoff.js";
import {
  configuredProductRepos,
  missingProductWorktrees,
  plannedProjectWorktreePath,
  pruneOrphanedProductExecBranches,
  productRepoEnvironment,
  withAgentExtraRoots,
  withoutInheritedRepoEnvironment,
  withProductRepoPrompt,
  withProductWorktrees,
} from "./exec-task-repos.js";
import type { AgentProvider } from "./specdojo-config.js";
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
  gitEnvironment,
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
  pruneOrphanedExecBranches,
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

type PruneOpts = {
  project?: string;
  dryRun?: boolean;
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

// PJR-98G4: repos を宣言した project では、プロダクトの worktree もタスクの worktree として扱う。
function requireWorktree(context: ProjectContext, worktreeTaskId: string): ExecWorktree {
  const found = findExecWorktree(context.repoRoot, worktreeTaskId);
  if (!found) throw new Error(`Worktree is not prepared for task: ${worktreeTaskId}`);
  if (!existsSync(found.path)) {
    throw new Error(`Registered worktree path does not exist: ${found.path}`);
  }
  const products = configuredProductRepos(context.schedulePath);
  const worktree = withProductWorktrees(found, products, worktreeTaskId);
  const missing = missingProductWorktrees(products, worktree);
  if (missing.length > 0) {
    throw new Error(
      `Product worktrees are not prepared for task ${worktreeTaskId}: ${missing.join(", ")}`,
    );
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
  provider?: AgentProvider;
  prompt: string;
} {
  const state = requireDoingTask(context.schedulePath, taskId);
  const task = buildTaskView(context.schedulePath, context.executionPath, taskId);
  const roster = loadRosterForExecutionPath(context.executionPath);
  const execDefaults = loadExecDefaultsConfig(undefined, context.executionPath);
  const nickname = opts.by?.trim() || state.actor;
  if ((task.execution ?? "agent") === "human" && !opts.by) {
    throw new Error(`Task requires human execution. Use --by <nickname> to override: ${taskId}`);
  }
  const member = roster?.members.find(
    (item) =>
      item.nickname === nickname &&
      item.type === "agent" &&
      hasMemberCommandSource(execDefaults, item),
  );
  const command = member ? resolveMemberCommand(execDefaults, member) : undefined;
  if (!command) {
    throw new Error(`Agent command not found for actor: ${nickname}`);
  }

  if (!opts.by) {
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
    if (!candidates.some((candidate) => candidate.nickname === nickname)) {
      throw new Error(`Claim actor does not satisfy task agent requirements: ${nickname}`);
    }
  }

  const prompt = loadPrompt(context.executionPath, taskId);
  if (!prompt) throw new Error(`Plan not found for task: ${taskId}`);
  return { actor: nickname, command, provider: member?.provider, prompt };
}

function printWorktree(worktree: ExecWorktree): void {
  process.stdout.write(`worktree: ${worktree.path}\nbranch: ${worktree.branch}\n`);
  for (const product of worktree.repos ?? []) {
    process.stdout.write(`repo ${product.name}: ${product.path} (${product.branch})\n`);
  }
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
  const products = configuredProductRepos(context.schedulePath);
  const planned: ExecWorktree = {
    path: plannedProjectWorktreePath(base, worktreeTaskId, products),
    branch,
    name,
    created: false,
    ...(products.length > 0
      ? {
          repos: products.map((product) => ({
            name: product.name,
            repoRoot: product.repoRoot,
            path: resolve(base, name, product.name),
            branch,
            created: false,
          })),
        }
      : {}),
  };

  if (opts.dryRun) {
    process.stdout.write(`[dry-run] claim actor: ${state.actor}\n`);
    process.stdout.write(`[dry-run] checkpoint: exec(${opts.task}): prepare execution\n`);
    const existing = findExecWorktree(context.repoRoot, worktreeTaskId);
    printWorktree(existing ? withProductWorktrees(existing, products, worktreeTaskId) : planned);
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

    // Plans are generated on demand (exec refresh does not manage them). Generate
    // one if absent; keep an existing plan so a hand-edited plan is not clobbered.
    if (!existsSync(planPath)) {
      await generateSinglePlan({
        executionPath: context.executionPath,
        projectId: opts.project ?? process.env.SPECDOJO_PROJECT ?? "",
        catalogPath: context.catalogPath ?? "",
        rolesPath: context.rolesPath,
        viewpointsPath: context.viewpointsPath,
        projectContext: context.projectContext,
        task: buildTaskView(context.schedulePath, context.executionPath, opts.task),
      });
    }

    for (const path of [planPath, resultPath, lockedState.claimEventPath]) {
      if (!existsSync(path)) throw new Error(`Required execution file not found: ${path}`);
    }

    const worktree = checkpointAndEnsureWorktree({
      context,
      worktreeTaskId,
      base,
      checkpointPaths: [planPath, resultPath, lockedState.claimEventPath],
      commitMessage: `exec(${opts.task}): prepare execution`,
      products,
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
  const found = findExecWorktree(context.repoRoot, worktreeTaskId);
  const products = configuredProductRepos(context.schedulePath);
  const branch = `exec/${worktreeNameFromTaskId(worktreeTaskId)}`;
  process.stdout.write(`task: ${opts.task}\nstate: ${state.state}\n`);
  process.stdout.write(`claim-actor: ${state.actor ?? "not found"}\n`);
  if (!found) {
    const base = resolveWorktreeBase(
      context.repoRoot,
      opts.worktreeBase,
      configuredWorktreeBase(context.schedulePath),
    );
    const expected = plannedProjectWorktreePath(base, worktreeTaskId, products);
    process.stdout.write(`worktree: not prepared (expected ${expected})\n`);
    process.stdout.write(`branch: ${branch}\n`);
    return;
  }
  const worktree = withProductWorktrees(found, products, worktreeTaskId);

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
  for (const name of missingProductWorktrees(products, worktree)) {
    process.stdout.write(`repo ${name}: not prepared\n`);
  }
  for (const product of worktree.repos ?? []) {
    const productChanges = worktreeStatusPaths(product.path).map(
      (path) => `${product.name}:${path}`,
    );
    process.stdout.write(
      `repo ${product.name} uncommitted: ${productChanges.length > 0 ? productChanges.join(", ") : "none"}\n`,
    );
  }
}

async function agent(opts: AgentOpts): Promise<void> {
  const context = resolveContext(opts);
  const worktree = requireWorktree(context, qualifyTaskId(context.projectId, opts.task));
  requireInsideWorktree(context.repoRoot, worktree);
  const resolved = resolveAgent(context, opts.task, opts);
  const productDirs = (worktree.repos ?? []).map((product) => product.path);
  const command = withAgentExtraRoots(resolved.command, resolved.provider, productDirs);
  if (opts.dryRun) {
    process.stdout.write(`[dry-run] actor: ${resolved.actor}\n`);
    process.stdout.write(`[dry-run] command: ${command}\n`);
    process.stdout.write(`[dry-run] cwd: ${worktree.path}\n`);
    process.stdout.write(`[dry-run] plan: ${resolved.prompt.length} chars\n`);
    return;
  }

  const agentRepos = [
    { root: worktree.path },
    ...(worktree.repos ?? []).map((product) => ({ name: product.name, root: product.path })),
  ];
  const protectedConfigBefore = captureAgentProtectedConfigAcrossRepos(agentRepos);
  const gitStateBefore = captureAgentGitStateAcrossRepos(agentRepos);
  const child = spawn(command, {
    cwd: worktree.path,
    env: {
      ...withoutInheritedRepoEnvironment(gitEnvironment()),
      SPECDOJO_SCHEDULE_PATH: context.schedulePath,
      SPECDOJO_EXECUTION_PATH: context.executionPath,
      ...productRepoEnvironment(worktree.path, worktree.repos),
    },
    shell: true,
    stdio: ["pipe", "inherit", "inherit"],
  });
  child.stdin.end(withProductRepoPrompt(resolved.prompt, worktree.repos));
  const exitCode = await new Promise<number>((resolveExit) => {
    child.once("error", () => resolveExit(1));
    child.once("close", (code) => resolveExit(code ?? 1));
  });
  // 保護機構が block した場合も、対象と提案差分を worktree 側 result の申し送りへ残す。
  const worktreeResultPath = resolve(worktree.path, taskPaths(context, opts.task).resultRel);
  const protectedConfigChanges = changedAgentProtectedConfigAcrossRepos(protectedConfigBefore);
  if (protectedConfigChanges.length > 0) {
    const reason = agentProtectedConfigViolation(qualifiedRepoPaths(protectedConfigChanges));
    process.stderr.write(`blocked: ${reason}\n`);
    recordProtectedConfigBlockAcrossRepos({
      resultPath: worktreeResultPath,
      changes: protectedConfigChanges,
      reason,
    });
    process.exitCode = 1;
    return;
  }
  const gitStateChanges = changedAgentGitStateAcrossRepos(gitStateBefore);
  if (gitStateChanges.length > 0) {
    const reason = agentGitStateViolation(qualifiedGitStateFields(gitStateChanges));
    process.stderr.write(`blocked: ${reason}\n`);
    recordGitStateBlockAcrossRepos({
      resultPath: worktreeResultPath,
      changes: gitStateChanges,
      reason,
    });
    process.exitCode = 1;
    return;
  }
  if (exitCode !== 0) process.exitCode = exitCode;
}

function commit(opts: CommitOpts): void {
  const context = resolveContext(opts);
  requireDoingTask(context.schedulePath, opts.task);
  const worktree = requireWorktree(context, qualifyTaskId(context.projectId, opts.task));
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
  const worktree = requireWorktree(context, qualifyTaskId(context.projectId, opts.task));
  // prepare left the root's own copies of the checkpoint files uncommitted (the exec branch
  // carries the commit). Release them so the merge can bring the committed versions in.
  const { claimEventPath } = taskExecutionState(context.schedulePath, opts.task);
  const releaseRootPaths = [
    join(context.executionPath, "exec", "plans", `${opts.task}-plan.md`),
    join(context.executionPath, "exec", "results", `${opts.task}-result.md`),
    ...(claimEventPath ? [claimEventPath] : []),
  ];
  mergeWorktreeIntoCurrent({
    context,
    worktree,
    taskId: opts.task,
    releaseRootPaths,
    ffOnly: opts.ffOnly,
    dryRun: opts.dryRun,
  });
}

function remove(opts: RemoveOpts): void {
  const context = resolveContext(opts);
  const worktree = requireWorktree(context, qualifyTaskId(context.projectId, opts.task));
  removeWorktree({
    context,
    worktree,
    taskId: opts.task,
    force: opts.force,
    deleteBranch: opts.deleteBranch,
    dryRun: opts.dryRun,
  });
}

function prune(opts: PruneOpts): void {
  const context = resolveContext(opts);
  const projectId = context.projectId?.trim();
  if (!projectId) {
    throw new Error("Project id is required. Use --project or set current_project.");
  }
  const orphaned = pruneOrphanedExecBranches({
    repoRoot: context.repoRoot,
    projectId,
    dryRun: opts.dryRun,
  });
  // PJR-98G4: 宣言済みのプロダクトリポジトリでも、同じ project の孤児 exec branch を検出する。
  const productOrphaned = pruneOrphanedProductExecBranches({
    products: configuredProductRepos(context.schedulePath),
    projectId,
    dryRun: opts.dryRun,
  });
  if (orphaned.length === 0 && productOrphaned.length === 0) {
    process.stdout.write(`No orphaned exec branches for project ${projectId}.\n`);
    return;
  }
  const describe = (merged: boolean): string =>
    merged ? (opts.dryRun ? "would delete (merged)" : "deleted (merged)") : "kept (not merged)";
  for (const item of orphaned) {
    process.stdout.write(`${item.branch}: ${describe(item.mergedIntoCurrent)}\n`);
  }
  for (const item of productOrphaned) {
    process.stdout.write(`${item.repo}:${item.branch}: ${describe(item.mergedIntoTarget)}\n`);
  }
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
  agentCommand.option("--by <nickname>", "Select a pm-members.yaml agent nickname");
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

  const pruneCommand = worktree
    .command("prune")
    .description("Inspect and delete merged exec branches that have no worktree")
    .option("--project <projectId>", "Project id in .specdojo/specdojo.config.json")
    .option("--dry-run", "Inspect orphaned branches without deleting them", false);
  pruneCommand.action((opts: PruneOpts) => {
    try {
      prune(opts);
    } catch (error) {
      commandError(error);
    }
  });
}
