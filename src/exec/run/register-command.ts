import { type Command } from "commander";
import { loadExecDefaultsConfig, resolveRegisterPostReview } from "../agent-config.js";
import { resolveProjectPaths } from "../project.js";
import { isRegisterFailureMode } from "../register.js";
import { configuredProductRepos } from "../task-repos.js";
import {
  EXCLUSIVE_EXEC_RUN,
  parseParallel,
  resolveExecDefaultsPath,
  resolveRegisterWorktree,
  withProjectExecRunLock,
  type ExecRunLockSharing,
  type RunOpts,
} from "./shared.js";
import { runBatchMode, runManualMode } from "./schedule-mode.js";
import { runInPlaceMode } from "./in-place.js";
import { runJobMode } from "./job.js";
import { spawnRefresh, spawnValidate } from "./mode-shared.js";
import { resolveRegisterPipelineCommand } from "./register-core.js";
import { runRegisterMode } from "./register-mode.js";

export function registerRunCommand(exec: Command): void {
  const rcmd = exec
    .command("run")
    .description("Run AI agent for a ready task (--auto selects next by strategy)");

  rcmd.option("--project <projectId>", "Project id in .specdojo/specdojo.config.json");
  rcmd.option("--by <nickname>", "Select an agent-members.yaml agent for a manual target");
  rcmd.option("--auto", "Automatically select and run next ready task", false);
  rcmd.option("--task <taskId>", "Task ID to run (manual selection)");
  rcmd.option(
    "--deliverable <localId>",
    "Catalog deliverable local_id target (unique project-wide)",
  );
  rcmd.option("--plan <path>", "Run an existing plan file (in-place; no generation)");
  rcmd.option(
    "--register <pjrIds...>",
    "One or more project register item IDs (PJR-XXXX) to run; execution location defaults to run.register_execution in exec-defaults (in-place when unset)",
  );
  rcmd.option(
    "--register-filter",
    "Select register items deterministically with --register-types/--register-priorities/--register-statuses/--register-limit",
    false,
  );
  rcmd.option("--register-types <types>", "Comma-separated register item types");
  rcmd.option("--register-priorities <priorities>", "Comma-separated register priorities");
  rcmd.option("--register-statuses <statuses>", "Comma-separated register statuses");
  rcmd.option("--register-limit <n>", "Maximum selected register items");
  rcmd.option("--job <jobId>", "Materialize and run a reusable job definition");
  rcmd.option(
    "--input <key=value...>",
    "Job input values (repeat or provide multiple key=value pairs)",
  );
  rcmd.option("--scheduled-at <dateTime>", "Scheduled occurrence time for a Job Run");
  rcmd.option("--job-trigger <source>", "Job trigger source: manual|routine|ci", "manual");
  rcmd.option(
    "--register-commit",
    "With in-place --register: commit each successful item's changes as a separate commit (default: leave changes in the working tree). Ignored in worktree mode, which always commits",
    false,
  );
  rcmd.option(
    "--post-review",
    "After integrating a register worktree, run a read-only completion review and automatically close eligible todo/issue items",
  );
  rcmd.option(
    "--on-failure <mode>",
    "With --register: stop|continue remaining items after a failure (default: stop)",
  );
  rcmd.option(
    "--resume",
    "With register worktree mode: resume the stage where a run stopped (executor, reporter, or integration), reusing the existing worktree and checkpoints",
    false,
  );
  rcmd.option(
    "--resume-from <stage>",
    "With --resume: resume a reporter-stage run from executor instead (accepted value: executor)",
  );
  rcmd.option(
    "--force-restart",
    "With register worktree mode: re-run the whole item even when a resumable executor result exists (discards the worktree and its uncommitted changes)",
    false,
  );
  rcmd.option(
    "--worktree",
    "Use a git worktree and integrate back (requires --task, --register, or --job; Job runs are committed and reviewed before merge)",
    false,
  );
  rcmd.option(
    "--in-place",
    "Run a register item in the current working tree (overrides run.register_execution; cannot be combined with --worktree)",
    false,
  );
  rcmd.option(
    "--track-state",
    "Record claim/complete events (requires --task; --by optional, actor auto-derived from the resolved agent)",
    false,
  );
  rcmd.option(
    "--archive-on-success",
    "Archive the generated plan to exec/plans/done/ after a successful in-place run",
    false,
  );
  rcmd.option(
    "--integration-branch <repo=branch>",
    "With register worktree mode: integrate the declared product repository <repo> into the local branch <branch> for this run (repeatable; overrides repos[].integration_branch; resume reuses the value recorded at the start)",
    (value: string, previous: string[] = []) => [...previous, value],
  );
  rcmd.option("--parallel <n>", "Number of worktree instances to run in parallel", "1");
  rcmd.option("--worktree-base <path>", "Override worktree base directory");
  rcmd.option(
    "--strategy <s>",
    "Task selection strategy: critical-first|fifo (default: critical-first)",
  );
  rcmd.option(
    "--loop",
    "Repeat rounds until no ready tasks remain, rebuilding doc-index and running exec refresh between rounds",
    false,
  );
  rcmd.option(
    "--max-rounds <n>",
    "Maximum number of rounds when using --loop (ignored without --loop)",
  );
  rcmd.option(
    "--if-busy <policy>",
    "When another exec is running for the project: skip|wait|fail (default: fail)",
    "fail",
  );
  rcmd.option(
    "--join",
    "With register worktree mode: run next to a running register worktree exec instead of waiting for it, sharing its provider caps, lifecycle serialization, and parent-validation slots (up to run.max_concurrent_runs; --if-busy applies when all join slots are taken)",
    false,
  );
  rcmd.option(
    "--exec-defaults <path>",
    "Path to exec-defaults.yaml global config (default: .specdojo/exec-defaults.yaml)",
  );
  rcmd.option("--agent-config <path>", "Deprecated alias for --exec-defaults");
  rcmd.option(
    "--edit-by <nickname>",
    "agent-members.yaml nickname for edit-mode tasks in --auto batch runs",
  );
  rcmd.option(
    "--review-by <nickname>",
    "agent-members.yaml nickname for review-mode tasks in --auto batch runs or register post-review",
  );
  rcmd.option(
    "--executor-by <nickname>",
    "Executor nickname; with --register, also accepts PJR-ID=nickname assignments separated by commas. With --plan / --deliverable, runs the executor/reporter pipeline",
  );
  rcmd.option(
    "--reporter-by <nickname>",
    "agent-members.yaml reporter nickname for agent_pipeline tasks (with --plan / --deliverable, runs the executor/reporter pipeline)",
  );
  rcmd.option(
    "--on-rate-limit <action>",
    "Pinned-agent rate-limit action: stop|wait|fallback (overrides rate_limit_policy.pinned)",
  );
  rcmd.option(
    "--fallback-executor-by <nickname>",
    "Fallback executor for a selected rate-limit fallback or configured connection error",
  );
  rcmd.option(
    "--fallback-reporter-by <nickname>",
    "Fallback reporter for a selected rate-limit fallback or configured connection error",
  );
  rcmd.option("--dry-run", "Print resolved command without executing", false);

  rcmd.action(async (opts: RunOpts) => {
    try {
      const isAuto = !!opts.auto;
      const hasTask = !!opts.task;
      const hasDeliverable = !!opts.deliverable;
      const hasPlan = !!opts.plan;
      const hasRegisterIds = !!opts.register;
      const hasRegisterFilter = !!opts.registerFilter;
      const hasRegister = hasRegisterIds || hasRegisterFilter;
      const hasJob = !!opts.job;
      const isManual = hasTask || hasDeliverable || hasPlan || hasRegister || hasJob;
      const isBatch = isAuto;

      if (hasRegisterIds && hasRegisterFilter) {
        process.stdout.write("Specify either --register or --register-filter, not both.\n");
        process.exitCode = 1;
        return;
      }
      if (
        (opts.registerTypes ||
          opts.registerPriorities ||
          opts.registerStatuses ||
          opts.registerLimit) &&
        !hasRegisterFilter
      ) {
        process.stdout.write(
          "--register-types, --register-priorities, --register-statuses, and --register-limit require --register-filter.\n",
        );
        process.exitCode = 1;
        return;
      }

      if (!isAuto && !isManual) {
        process.stdout.write(
          "Specify --auto, --by (with a manual target), --task, --deliverable, --plan, --register, or --job.\n",
        );
        process.exitCode = 1;
        return;
      }
      if ([hasTask, hasDeliverable, hasPlan, hasRegister, hasJob].filter(Boolean).length > 1) {
        process.stdout.write(
          "Specify at most one of --task, --deliverable, --plan, --register, --job.\n",
        );
        process.exitCode = 1;
        return;
      }
      if (hasRegister && opts.trackState) {
        process.stdout.write(
          "--track-state cannot be used with --register (state is tracked in the register itself).\n",
        );
        process.exitCode = 1;
        return;
      }
      if (opts.worktree && opts.inPlace) {
        process.stdout.write("Specify either --worktree or --in-place, not both.\n");
        process.exitCode = 1;
        return;
      }
      if (opts.inPlace && !hasRegister) {
        process.stdout.write("--in-place requires --register or --register-filter.\n");
        process.exitCode = 1;
        return;
      }
      if (hasRegister) {
        const { schedulePath, executionPath } = resolveProjectPaths({ project: opts.project });
        const execDefaults = loadExecDefaultsConfig(
          resolveExecDefaultsPath(opts, schedulePath),
          executionPath,
        );
        opts.worktree = resolveRegisterWorktree(opts, execDefaults);
        opts.postReview = opts.postReview || resolveRegisterPostReview(execDefaults);
      }
      if (opts.postReview && !(hasRegister && opts.worktree)) {
        process.stdout.write(
          "--post-review (or run.register_post_review) requires --register in worktree mode.\n",
        );
        process.exitCode = 1;
        return;
      }
      if (hasRegister && !opts.worktree && parseParallel(opts.parallel) !== 1) {
        process.stdout.write(
          "--parallel with --register requires worktree mode; use --worktree or configure run.register_execution: worktree.\n",
        );
        process.exitCode = 1;
        return;
      }
      const integrationBranches = opts.integrationBranch ?? [];
      if (integrationBranches.length > 0) {
        if (!(hasRegister && opts.worktree)) {
          process.stdout.write(
            "--integration-branch requires --register (or --register-filter) in worktree mode.\n",
          );
          process.exitCode = 1;
          return;
        }
        // 形式・宣言済みリポジトリ・ローカルブランチの存在を、register の状態を変える前に確かめる。
        configuredProductRepos(
          resolveProjectPaths({ project: opts.project }).schedulePath,
          integrationBranches,
        );
      }
      if (opts.join && !(hasRegister && opts.worktree)) {
        process.stdout.write(
          "--join requires --register (or --register-filter) in worktree mode.\n",
        );
        process.exitCode = 1;
        return;
      }
      if (hasRegister && opts.worktree && opts.registerCommit) {
        process.stdout.write(
          "Note: --register-commit is ignored in worktree mode; worktree runs always commit (checkpoint + merge back).\n",
        );
      }
      if ((opts.registerCommit || opts.onFailure) && !hasRegister) {
        process.stdout.write("--register-commit and --on-failure require --register.\n");
        process.exitCode = 1;
        return;
      }
      if ((opts.resume || opts.forceRestart) && !hasRegister) {
        process.stdout.write("--resume and --force-restart require --register.\n");
        process.exitCode = 1;
        return;
      }
      if (opts.resumeFrom && !opts.resume) {
        process.stdout.write("--resume-from requires --resume.\n");
        process.exitCode = 1;
        return;
      }
      if (opts.resumeFrom && opts.resumeFrom !== "executor") {
        process.stdout.write('--resume-from must be "executor".\n');
        process.exitCode = 1;
        return;
      }
      // 再開は既存 worktree の成果を再利用する操作のため、worktree 実行に限る。in-place 実行は
      // executor の変更が作業ツリーに残り、再開時のID単位 commit が対象を判別できない。
      if ((opts.resume || opts.forceRestart) && !opts.worktree) {
        process.stdout.write(
          "--resume and --force-restart require register worktree mode; use --worktree or configure run.register_execution: worktree.\n",
        );
        process.exitCode = 1;
        return;
      }
      if (opts.resume && opts.forceRestart) {
        process.stdout.write("Specify either --resume or --force-restart, not both.\n");
        process.exitCode = 1;
        return;
      }
      if ((opts.input || opts.scheduledAt) && !hasJob) {
        process.stdout.write("--input and --scheduled-at require --job.\n");
        process.exitCode = 1;
        return;
      }
      if (opts.jobTrigger && !["manual", "routine", "ci"].includes(opts.jobTrigger)) {
        process.stdout.write("--job-trigger must be manual, routine, or ci.\n");
        process.exitCode = 1;
        return;
      }
      if (opts.onFailure && !isRegisterFailureMode(opts.onFailure)) {
        process.stdout.write(`--on-failure must be "stop" or "continue": ${opts.onFailure}\n`);
        process.exitCode = 1;
        return;
      }
      if (isAuto && isManual) {
        process.stdout.write("Specify either --auto or a manual target, not both.\n");
        process.exitCode = 1;
        return;
      }
      if (isAuto && opts.by) {
        process.stdout.write(
          "--by requires a manual target; use --edit-by / --review-by with --auto.\n",
        );
        process.exitCode = 1;
        return;
      }
      if (opts.by && opts.executorBy) {
        process.stdout.write("Specify either --by or --executor-by, not both.\n");
        process.exitCode = 1;
        return;
      }
      if (opts.onRateLimit && !["stop", "wait", "fallback"].includes(opts.onRateLimit)) {
        process.stdout.write('--on-rate-limit must be "stop", "wait", or "fallback".\n');
        process.exitCode = 1;
        return;
      }
      if (opts.worktree && !hasTask && !hasRegister && !hasJob) {
        process.stdout.write("--worktree requires --task, --register, or --job.\n");
        process.exitCode = 1;
        return;
      }
      // --parallel is allowed for register worktree runs (handled above); reject it for other
      // manual targets, which run a single instance.
      if (isManual && !hasRegister && parseParallel(opts.parallel) !== 1) {
        process.stdout.write("--parallel cannot be used with a manual target.\n");
        process.exitCode = 1;
        return;
      }

      // register worktree 実行だけが共有資源をプロセス横断で統制するため、後から --join する
      // run を受け入れる。それ以外の run は従来どおり project 全体を排他する。
      const registerWorktreeLockSharing: ExecRunLockSharing =
        hasRegister && opts.worktree ? { shareable: true, join: !!opts.join } : EXCLUSIVE_EXEC_RUN;
      await withProjectExecRunLock(
        opts,
        "run",
        async () => {
          // Register-item run: use the configured location or an explicit CLI override, with state tracked
          // via register transitions (start → review / waiting) instead of exec events.
          if (hasRegister) {
            await runRegisterMode(opts);
            return;
          }

          if (hasJob) {
            await runJobMode(opts, resolveRegisterPipelineCommand);
            return;
          }

          // In-place manual run (default): generate the plan on demand and run in the
          // current repository. No validate/refresh pass — that is orchestration only.
          if (isManual && !opts.worktree) {
            await runInPlaceMode(opts);
            return;
          }

          process.stdout.write("[run] validate...\n");
          if (!spawnValidate(opts.project)) {
            process.stdout.write("[run] validate failed — exit\n");
            process.exitCode = 1;
            return;
          }
          process.stdout.write("[run] validate: ok\n[run] refresh...\n");
          if (!spawnRefresh(opts.project)) {
            process.stdout.write("[run] refresh failed — exit\n");
            process.exitCode = 1;
            return;
          }
          process.stdout.write("[run] refresh: ok\n");

          if (isBatch) {
            await runBatchMode(opts);
          } else {
            await runManualMode(opts);
          }
        },
        registerWorktreeLockSharing,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      process.stdout.write(message + "\n");
      process.exitCode = 1;
    }
  });
}
