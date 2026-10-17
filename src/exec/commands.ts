import { type Command } from "commander";
import { existsSync } from "node:fs";
import { join, resolve as pathResolve } from "node:path";
import { validateCatalogLocalIds, validateRulebookKata } from "../catalog/build.js";
import {
  acquireSchedulerLock,
  canBlockTask,
  canCancelTask,
  canClaimTask,
  canCompleteTask,
  canReleaseTask,
  canReopenTask,
  canUnblockTask,
  computeReadyIds,
  readAllEventFiles,
  releaseSchedulerLock,
  schedulerLockPath,
  writeEventFile,
} from "./events.js";
import { eventsDirForProject, generatedDirForProject } from "./project.js";
import {
  assertValidActor,
  getProjectViewpointsPath,
  loadConfig,
  specdojoRootDir,
} from "../shared/specdojo-config.js";
import {
  buildScheduleIndex,
  computeCpm,
  exitWithCode,
  printValidateResult,
  selectNextTask,
  validateAll,
  writeCpmFiles,
  writeGeneratedCore,
  writeScheduleHashAndDiff,
} from "./schedule/schedule.js";
import { readReadySnapshot } from "./schedule/ready.js";
import type { ExecEventType, ExecEventV1, StateSnapshot } from "./types.js";
import { displayWidth, nowUtcIsoSeconds, padEndDisplay, requireNonEmpty } from "./shared.js";
import {
  archivePlan,
  buildInPlaceStem,
  generateDeliverablePlan,
  generateSinglePlan,
  resolveDeliverableTarget,
  stemFromPlanPath,
} from "./plans.js";
import { runProviderScaffold, specdojoPackageRootDir } from "./provider-scaffold.js";
import { generateRegisterPlan, normalizePjrId, resolveRegisterRunTarget } from "./register.js";
import { scaffoldViewpoints } from "../review/plan.js";
import {
  registerCycleCommand,
  registerResumeCommand,
  registerRunCommand,
  registerSlotsCommand,
} from "./run/run.js";
import { buildTaskView } from "./task-view.js";
import { registerExecWorktreeCommands } from "./worktree-command.js";
import { registerExecTrialCommands } from "./trial.js";
import { registerExecHandoffCommands } from "./handoff.js";
import { resolveOwnerForLocalId } from "./strategy.js";
import {
  DEFAULT_EVENT_MESSAGES,
  KNOWN_OWNER_LABELS,
  KNOWN_OWNER_LABELS_TEXT,
  addCommonAddOptions,
  addForceOption,
  addLockOptions,
  addOwnerOptions,
  addProjectOptions,
  ensureActorCanClaimNext,
  findRosterMember,
  loadRosterForOpts,
  loadValidatedExecState,
  parseApproach,
  parseTaskMode,
  printCommandError,
  resolveClaimOwner,
  resolveForceOverride,
  resolveProjectContext,
  resolveProjectId,
  resolveSchedulerStrategy,
  runLockedEventCommand,
  runReleaseAllBlocked,
  runSimpleEventCommand,
  scaffoldClaimResult,
  type LockedEventAction,
} from "./core.js";

export function registerExecCommands(program: Command): void {
  const exec = program.command("exec").description("Execution helpers");
  registerExecHandoffCommands(exec);
  const lockedActions: Record<LockedEventAction["type"], LockedEventAction> = {
    claim: {
      type: "claim",
      requireSingleDoing: true,
      check: ({ schedule, snapshot }, taskId, actor, opts) => {
        const taskOwner = schedule.nodes.get(taskId)?.owner;
        return canClaimTask(
          schedule,
          snapshot,
          taskId,
          resolveClaimOwner(opts, actor, loadRosterForOpts(opts), taskOwner),
          !!opts.allowOwnerMismatch,
        );
      },
    },
    complete: {
      type: "complete",
      check: ({ schedule, snapshot }, taskId, actor, opts) =>
        canCompleteTask(schedule, snapshot, taskId, actor, resolveForceOverride(opts, actor)),
    },
    reopen: {
      type: "reopen",
      check: ({ schedule, snapshot }, taskId, actor, opts) =>
        canReopenTask(
          schedule,
          snapshot,
          taskId,
          findRosterMember(loadRosterForOpts(opts), actor)?.type === "human",
        ),
    },
    block: {
      type: "block",
      check: ({ schedule, snapshot }, taskId, actor, opts) =>
        canBlockTask(schedule, snapshot, taskId, actor, resolveForceOverride(opts, actor)),
    },
    unblock: {
      type: "unblock",
      check: ({ schedule, snapshot }, taskId) => canUnblockTask(schedule, snapshot, taskId),
    },
    release: {
      type: "release",
      check: ({ schedule, snapshot }, taskId, actor, opts) =>
        canReleaseTask(schedule, snapshot, taskId, actor, resolveForceOverride(opts, actor)),
    },
    cancel: {
      type: "cancel",
      check: ({ schedule, snapshot }, taskId) => canCancelTask(schedule, snapshot, taskId),
    },
  };

  const types: ExecEventType[] = [
    "claim",
    "note",
    "block",
    "unblock",
    "complete",
    "reopen",
    "release",
    "cancel",
    "link",
    "estimate",
  ];

  for (const t of types) {
    const cmd = exec.command(t).description(`Write ${t} event JSON into exec/events/ (UTC)`);
    addCommonAddOptions(cmd, {
      requireTask: t !== "release" && t !== "complete",
      msgDefault: DEFAULT_EVENT_MESSAGES[t],
    });

    if (t in lockedActions) addLockOptions(cmd);
    if (t === "claim") addOwnerOptions(cmd);
    if (t === "complete" || t === "block" || t === "release") addForceOption(cmd);
    if (t === "release") {
      cmd.option(
        "--reset-worktree",
        "Discard the task's exec worktree and branch after releasing (force removal)",
        false,
      );
      cmd.option(
        "--all-blocked",
        "Release every blocked task in the project back to todo (ignores --task)",
        false,
      );
    }

    if (t in lockedActions) {
      const action = lockedActions[t as LockedEventAction["type"]];
      cmd.action(async (opts) => {
        if (action.type === "release" && opts.allBlocked) {
          await runReleaseAllBlocked(opts);
          return;
        }
        await runLockedEventCommand(opts, action);
      });
    } else {
      cmd.action((opts) => runSimpleEventCommand(opts, t));
    }
  }

  const vcmd = exec.command("validate").description("Validate schedule + events");
  addProjectOptions(vcmd);
  vcmd.action((opts) => {
    try {
      const { schedulePath, catalogPath } = resolveProjectContext(opts);
      const res = validateAll(schedulePath);
      printValidateResult(res);
      // Scheduled tasks resolve their deliverable by bare local_id, so warn when a
      // local_id is not unique project-wide across the catalogs.
      if (catalogPath && existsSync(catalogPath)) {
        for (const warn of validateCatalogLocalIds(catalogPath).warnings) {
          process.stdout.write(`WARN:  ${warn}\n`);
        }
        // Warn when a rulebook declares recipe/sample/template or includes rulebooks
        // that do not exist (or self-reference / non-rulebook includes).
        for (const warn of validateRulebookKata(catalogPath).warnings) {
          process.stdout.write(`WARN:  ${warn}\n`);
        }
      }
      exitWithCode(res.ok);
    } catch (error) {
      printCommandError(error, false);
    }
  });

  const refreshCmd = exec
    .command("refresh")
    .description("Refresh derived execution state under generated/");
  addProjectOptions(refreshCmd);
  refreshCmd.action(async (opts) => {
    try {
      const { schedulePath } = resolveProjectContext(opts);

      const res = validateAll(schedulePath);
      printValidateResult(res);
      if (!res.ok) {
        exitWithCode(false);
        return;
      }

      const schedule = buildScheduleIndex(schedulePath);
      const events = readAllEventFiles(schedulePath);
      const cpm = computeCpm(schedule, schedulePath);

      const snapshot = writeGeneratedCore(schedulePath, events, schedule, cpm);
      writeScheduleHashAndDiff(schedulePath, schedule);
      writeCpmFiles(schedulePath, cpm, snapshot);

      process.stdout.write(`\nGenerated: ${generatedDirForProject(schedulePath)}\n`);
      exitWithCode(true);
    } catch (error) {
      printCommandError(error, false);
    }
  });

  const planCmd = exec
    .command("plan")
    .description(
      "Generate a plan for an agent task or catalog deliverable (schedule-independent; does not change state or events)",
    );
  addProjectOptions(planCmd);
  planCmd.option("--task <taskId>", "Scheduled task ID to generate the plan for");
  planCmd.option("--deliverable <localId>", "Catalog deliverable local_id (unique project-wide)");
  planCmd.option("--register <pjrId>", "Project register item ID (PJR-XXXX)");
  planCmd.option("--mode <mode>", "edit|review (deliverable target)", "edit");
  planCmd.option("--approach <approach>", "Approach template (deliverable target)");
  planCmd.option(
    "--track <track>",
    "Track to resolve the owner role from sch-strategy owner_rules (deliverable target)",
  );
  planCmd.option("--out <path>", "Override output path");
  planCmd.action(async (opts) => {
    try {
      const {
        schedulePath,
        executionPath,
        catalogPath,
        rolesPath,
        viewpointsPath,
        projectContext,
      } = resolveProjectContext(opts);
      const hasTask = typeof opts.task === "string" && opts.task.trim() !== "";
      const hasDeliverable = typeof opts.deliverable === "string" && opts.deliverable.trim() !== "";
      const hasRegister = typeof opts.register === "string" && opts.register.trim() !== "";
      if ([hasTask, hasDeliverable, hasRegister].filter(Boolean).length !== 1) {
        throw new Error("Specify exactly one of --task, --deliverable, or --register.");
      }
      const projectId = resolveProjectId(opts);
      const outOverride =
        typeof opts.out === "string" && opts.out.trim() ? opts.out.trim() : undefined;

      // Stem priority: --out → derive from the given filename (overwrite it); else --task → the
      // fixed task id, so the plan/result share one canonical name with claim / run --track-state
      // and an in-place run can be adopted without renaming; else --deliverable / --register → a
      // new unique stem per generation (no task identity; avoids doc-index id collisions).
      let outPath: string;
      if (hasRegister) {
        const pjrId = normalizePjrId(opts.register as string);
        const { registerPaths, item } = resolveRegisterRunTarget(projectId, pjrId);
        const stem = outOverride
          ? stemFromPlanPath(outOverride)
          : buildInPlaceStem(pjrId.toLowerCase());
        const generated = await generateRegisterPlan({
          executionPath,
          projectId,
          registerPaths,
          item,
          stem,
          ...(outOverride ? { outPath: outOverride } : {}),
        });
        outPath = generated.planPath;
      } else if (hasTask) {
        const task = buildTaskView(schedulePath, executionPath, (opts.task as string).trim());
        const stem = outOverride ? stemFromPlanPath(outOverride) : (opts.task as string).trim();
        outPath = await generateSinglePlan({
          executionPath,
          projectId,
          catalogPath: catalogPath ?? "",
          rolesPath,
          viewpointsPath,
          projectContext,
          task,
          stem,
          ...(outOverride ? { outPath: outOverride } : {}),
        });
      } else {
        const target = resolveDeliverableTarget(
          catalogPath ?? "",
          (opts.deliverable as string).trim(),
        );
        const track =
          typeof opts.track === "string" && opts.track.trim() ? opts.track.trim() : undefined;
        const owner = resolveOwnerForLocalId(schedulePath, target.localId, track);
        const stem = outOverride ? stemFromPlanPath(outOverride) : buildInPlaceStem(target.slug);
        outPath = await generateDeliverablePlan({
          executionPath,
          projectId,
          catalogPath: catalogPath ?? "",
          rolesPath,
          viewpointsPath,
          projectContext,
          target,
          mode: parseTaskMode(opts.mode),
          ...(opts.approach ? { approach: parseApproach(opts.approach) } : {}),
          ...(owner ? { owner } : {}),
          stem,
          ...(outOverride ? { outPath: outOverride } : {}),
        });
      }
      process.stdout.write(`Generated: ${outPath}\n`);
      exitWithCode(true);
    } catch (error) {
      printCommandError(error, false);
    }
  });

  const archiveCmd = exec
    .command("archive")
    .description("Archive a completed plan to exec/plans/done/ (or delete it)");
  addProjectOptions(archiveCmd);
  archiveCmd.option("--task <taskId>", "Scheduled task ID whose plan to archive");
  archiveCmd.option(
    "--deliverable <localId>",
    "Catalog deliverable local_id (unique project-wide)",
  );
  archiveCmd.option("--plan <path>", "Plan file to archive (for unique-named in-place plans)");
  archiveCmd.option("--delete", "Delete the plan instead of moving it to done/", false);
  archiveCmd.action((opts) => {
    try {
      const { executionPath, catalogPath } = resolveProjectContext(opts);
      const hasTask = typeof opts.task === "string" && opts.task.trim() !== "";
      const hasDeliverable = typeof opts.deliverable === "string" && opts.deliverable.trim() !== "";
      const hasPlan = typeof opts.plan === "string" && opts.plan.trim() !== "";
      if ([hasTask, hasDeliverable, hasPlan].filter(Boolean).length !== 1) {
        throw new Error("Specify exactly one of --task, --deliverable, or --plan.");
      }
      // `archivePlan` rebuilds `<slug>-plan.md`; for --plan the stem recovered from the filename
      // is that slug, so a unique-named in-place plan archives to done/ like a fixed-name one.
      const slug = hasPlan
        ? stemFromPlanPath((opts.plan as string).trim())
        : hasTask
          ? (opts.task as string).trim()
          : resolveDeliverableTarget(catalogPath ?? "", (opts.deliverable as string).trim()).slug;

      const result = archivePlan({ executionPath, slug, delete: !!opts.delete });
      process.stdout.write(
        result.deleted ? `Deleted: ${result.from}\n` : `Archived: ${result.from} -> ${result.to}\n`,
      );
      exitWithCode(true);
    } catch (error) {
      printCommandError(error, false);
    }
  });

  const scmd = exec
    .command("scheduler")
    .description("Auto-claim next task safely (with project-level lock).");
  addProjectOptions(scmd);
  scmd.requiredOption("--by <actor>", "Actor (agent name)");
  addOwnerOptions(scmd);
  scmd.option(
    "--strategy <strategy>",
    "critical-first|fifo (defaults to member profile or critical-first)",
  );
  scmd.option("--dry-run", "Do not write; print selected task only", false);
  scmd.option("--msg <message>", "Claim message", "auto-claim");
  addLockOptions(scmd);

  scmd.action(async (opts) => {
    let lockDir = "";

    try {
      const { schedulePath, executionPath, catalogPath } = resolveProjectContext(opts);
      const actor = requireNonEmpty("by", opts.by);
      const roster = loadRosterForOpts(opts);
      assertValidActor(actor, roster);
      const strategy = resolveSchedulerStrategy(opts, actor, roster);
      const dryRun = !!opts.dryRun;
      const msg = String(opts.msg ?? "auto-claim");
      const claimOwner = resolveClaimOwner(opts, actor, roster);
      const allowOwnerMismatch = !!opts.allowOwnerMismatch;
      const allowMultipleDoing = !!opts.allowMultipleDoing;
      const lockTimeoutMs = Number(opts.lockTimeoutMs);
      const lockStaleMs = Number(opts.lockStaleMs);

      lockDir = acquireSchedulerLock(schedulePath, { actor, lockTimeoutMs, lockStaleMs });

      const state = loadValidatedExecState(schedulePath);
      if (!state) return;
      if (!ensureActorCanClaimNext(state.snapshot, actor, allowMultipleDoing)) return;

      const ready = computeReadyIds(state.schedule, state.snapshot);

      let cpm = null;
      try {
        cpm = computeCpm(state.schedule, schedulePath);
      } catch {
        cpm = null;
      }

      // Collect all valid owner labels for this actor.
      // Single-role actors use claimOwner; multi-role actors (e.g. indie) check every role.
      const actorAllRoles =
        findRosterMember(roster, actor)
          ?.roles?.map((r) => r.trim().toUpperCase())
          .filter((r) => KNOWN_OWNER_LABELS.includes(r as (typeof KNOWN_OWNER_LABELS)[number])) ??
        [];
      const ownerCandidates =
        actorAllRoles.length > 1 ? actorAllRoles : claimOwner ? [claimOwner] : [];

      const readyForOwner = ready.filter((taskId) => {
        if (ownerCandidates.length === 0) {
          return canClaimTask(
            state.schedule,
            state.snapshot,
            taskId,
            claimOwner,
            allowOwnerMismatch,
          ).ok;
        }
        // Pass if any of the actor's roles can claim the task
        return ownerCandidates.some(
          (role) =>
            canClaimTask(state.schedule, state.snapshot, taskId, role, allowOwnerMismatch).ok,
        );
      });

      // Filter by actor mode and execution type from ready.json.
      // Agent actors (with mode set) skip tasks with wrong mode or execution: human.
      const actorMember = findRosterMember(roster, actor);
      const actorMode = actorMember?.mode;
      const isAgent = actorMember?.type === "agent";
      let readyForMode = readyForOwner;
      if (actorMode || isAgent) {
        const readyJsonPath = join(generatedDirForProject(schedulePath), "ready.json");
        if (existsSync(readyJsonPath)) {
          const readySnapshot = readReadySnapshot(readyJsonPath);
          const taskInfoMap = new Map(readySnapshot.tasks.map((t) => [t.id, t]));
          readyForMode = readyForOwner.filter((taskId) => {
            const taskInfo = taskInfoMap.get(taskId);
            if (!taskInfo) return true;
            // Agents skip manual tasks
            if (isAgent && (taskInfo.execution ?? "agent") === "human") return false;
            // Mode filter: skip tasks with different mode
            if (actorMode && (taskInfo.mode ?? "edit") !== actorMode) return false;
            return true;
          });
        }
      }

      const next = selectNextTask(readyForMode, cpm, strategy);
      if (!next) {
        if (readyForOwner.length > 0 && (actorMode || isAgent)) {
          process.stdout.write(
            `No ready ${actorMode ?? "agent"} task for ${actor}. ` +
              `${readyForOwner.length} task(s) ready but require different mode or are human-only.\n`,
          );
        } else if (ready.length > 0 && !allowOwnerMismatch) {
          process.stdout.write(
            `No ready task assigned to owner ${claimOwner}. Use --owner <${KNOWN_OWNER_LABELS_TEXT}>, SPECDOJO_OWNER, or --allow-owner-mismatch.\n`,
          );
        } else {
          process.stdout.write("No ready task to claim.\n");
        }
        exitWithCode(true);
        return;
      }

      if (dryRun) {
        process.stdout.write(next + "\n");
        exitWithCode(true);
        return;
      }

      // For multi-role actors, use the role that matches the selected task's owner.
      const plannedOwner = state.schedule.nodes.get(next)?.owner ?? "";
      const effectiveClaimOwner =
        ownerCandidates.length > 1 && ownerCandidates.includes(plannedOwner)
          ? plannedOwner
          : claimOwner;

      const ev: ExecEventV1 = {
        v: 1,
        ts: nowUtcIsoSeconds(),
        type: "claim",
        task_id: next,
        by: actor,
        msg,
        meta: {
          claim_owner: effectiveClaimOwner,
          planned_owner: plannedOwner || undefined,
          scheduler_strategy: strategy,
          claimed_via: "dojo-exec-scheduler",
        },
      };
      if (
        ev.meta?.planned_owner &&
        ev.meta.claim_owner !== ev.meta.planned_owner &&
        allowOwnerMismatch
      ) {
        ev.meta.owner_override = true;
      }

      const out = writeEventFile(schedulePath, ev);
      // Await the scaffold (it formats the result with Prettier asynchronously). Firing it without
      // awaiting leaks a promise that can read/write the result after the caller tears down its
      // working directory, surfacing as an ENOENT unhandled rejection.
      await scaffoldClaimResult({
        schedulePath,
        executionPath,
        catalogPath,
        state,
        taskId: next,
        projectId: resolveProjectId(opts),
        actor,
        startedAt: ev.ts,
      });
      process.stdout.write(out + "\n");
      exitWithCode(true);
    } catch (error) {
      printCommandError(error);
    } finally {
      if (lockDir) {
        try {
          releaseSchedulerLock(lockDir);
        } catch {
          // ignore
        }
      }
    }
  });

  registerRunCommand(exec);
  registerResumeCommand(exec);
  registerCycleCommand(exec);
  registerSlotsCommand(exec);
  registerExecWorktreeCommands(exec);
  registerExecTrialCommands(exec);

  // exec scaffold: creates project setup files (viewpoints etc.) or provider templates
  const scaffoldCmd = exec
    .command("scaffold")
    .description(
      "Scaffold project setup files (pm-review-viewpoints.yaml) or provider templates (--provider)",
    );
  addProjectOptions(scaffoldCmd);
  scaffoldCmd.option("--force", "Overwrite existing files", false);
  scaffoldCmd.option(
    "--provider <name>",
    "Copy the provider's agent/settings templates (templates/<name>) into the repository",
  );
  scaffoldCmd.option("--dry-run", "Show planned files without writing", false);
  scaffoldCmd.option(
    "--global",
    "Merge provider permissions into user-level settings (currently antigravity only)",
    false,
  );
  scaffoldCmd.action(async (opts) => {
    try {
      if (opts.global && !opts.provider) {
        throw new Error("--global requires --provider <name>");
      }
      if (opts.provider) {
        await runProviderScaffold(String(opts.provider), {
          packageRoot: specdojoPackageRootDir(),
          repoRoot: specdojoRootDir(),
          force: !!opts.force,
          dryRun: !!opts.dryRun,
          global: !!opts.global,
        });
        return;
      }

      const { config } = loadConfig();
      if (!config) throw new Error("specdojo.config.json not found. Run: specdojo config init");

      const projectId =
        opts.project?.trim() ||
        process.env.SPECDOJO_PROJECT?.trim() ||
        config.current_project?.trim() ||
        Object.keys(config.projects)[0] ||
        "";
      if (!projectId) throw new Error("No project specified. Use --project <id>.");

      const project = config.projects[projectId];
      if (!project) throw new Error(`Unknown project: ${projectId}`);

      const baseDir = specdojoRootDir();
      const commonPath = join(
        baseDir,
        "docs",
        "ja",
        "specdojo",
        "standards",
        "pm-review-viewpoints.yaml",
      );

      const viewpointsRel = getProjectViewpointsPath(project);
      if (viewpointsRel) {
        const outputPath = pathResolve(baseDir, viewpointsRel);
        const result = scaffoldViewpoints({
          commonPath,
          projectId,
          outputPath,
          force: !!opts.force,
        });
        if (result.written) {
          process.stdout.write(`Written: ${outputPath}\n`);
        } else {
          process.stdout.write(`Skipped (already exists): ${outputPath}\n`);
        }
      } else {
        process.stdout.write(
          `viewpoints_path not set for project '${projectId}'. Add it to specdojo.config.json.\n`,
        );
      }
    } catch (error) {
      printCommandError(error, false);
    }
  });

  const statusCmd = exec.command("status").description("Show tasks filtered by state and actor");
  addProjectOptions(statusCmd);
  statusCmd.option("--by <actor>", "Filter by actor nickname");
  statusCmd.option(
    "--state <state>",
    "Filter by state: todo|doing|blocked|done|cancelled (default: doing)",
    "doing",
  );
  statusCmd.action((opts) => {
    try {
      const { schedulePath } = resolveProjectContext(opts);

      // Compute state directly from events (not from cached state.json)
      const state = loadValidatedExecState(schedulePath);
      if (!state) return;
      const snapshot: StateSnapshot = state.snapshot;
      const schedule = state.schedule;

      const filterState = String(opts.state ?? "doing");
      const filterBy = typeof opts.by === "string" ? opts.by.trim() : undefined;

      const entries = Object.entries(snapshot.tasks)
        .filter(([, cs]) => cs.state === filterState)
        .filter(([, cs]) => !filterBy || cs.last_by === filterBy)
        .sort(([a], [b]) => a.localeCompare(b));

      if (entries.length === 0) {
        const byMsg = filterBy ? ` for ${filterBy}` : "";
        process.stdout.write(`No ${filterState} tasks${byMsg}.\n`);
        exitWithCode(true);
        return;
      }

      const byMsg = filterBy ? ` for ${filterBy}` : "";
      process.stdout.write(`${filterState} tasks${byMsg}:\n\n`);

      const rows = entries.map(([taskId, cs]) => ({
        taskId,
        name: schedule.nodes.get(taskId)?.name ?? "-",
        by: cs.last_by ?? "-",
        ts: cs.last_ts ?? "-",
      }));

      // Size every column to its longest value (including the header) so nothing is truncated.
      // displayWidth counts full-width (CJK) characters as 2 columns so the table stays aligned.
      const taskWidth = Math.max("task_id".length, ...rows.map((r) => displayWidth(r.taskId)));
      const nameWidth = Math.max("name".length, ...rows.map((r) => displayWidth(r.name)));
      const byWidth = Math.max("by".length, ...rows.map((r) => displayWidth(r.by)));
      const tsWidth = Math.max("claimed_at".length, ...rows.map((r) => displayWidth(r.ts)));

      process.stdout.write(
        `  ${padEndDisplay("task_id", taskWidth)} ${padEndDisplay("name", nameWidth)} ${padEndDisplay("by", byWidth)} claimed_at\n`,
      );
      process.stdout.write(
        `  ${"-".repeat(taskWidth)} ${"-".repeat(nameWidth)} ${"-".repeat(byWidth)} ${"-".repeat(tsWidth)}\n`,
      );
      for (const r of rows) {
        // The trailing claimed_at column is left unpadded to avoid stray trailing whitespace.
        process.stdout.write(
          `  ${padEndDisplay(r.taskId, taskWidth)} ${padEndDisplay(r.name, nameWidth)} ${padEndDisplay(r.by, byWidth)} ${r.ts}\n`,
        );
      }
      exitWithCode(true);
    } catch (error) {
      printCommandError(error, false);
    }
  });

  const wcmd = exec.command("where").description("Print resolved paths");
  addProjectOptions(wcmd);
  wcmd.action((opts) => {
    try {
      const resolvedPaths = resolveProjectContext(opts);
      process.stdout.write(`schedule-path: ${resolvedPaths.schedulePath}\n`);
      process.stdout.write(`execution-path: ${resolvedPaths.executionPath}\n`);
      const projectPath = resolvedPaths.schedulePath;
      process.stdout.write(`exec/events : ${eventsDirForProject(projectPath)}\n`);
      process.stdout.write(`generated   : ${generatedDirForProject(projectPath)}\n`);
      process.stdout.write(`scheduler-lock: ${schedulerLockPath(projectPath)}\n`);
    } catch (error) {
      printCommandError(error, false);
    }
  });
}
