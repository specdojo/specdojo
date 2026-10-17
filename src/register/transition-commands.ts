import type { Command } from "commander";
import { inlineCodeAnglePlaceholders } from "../shared/text.js";
import { nowUtcTimestamp } from "./date.js";
import { CELL_NONE, type PjrItem } from "./item.js";
import type { RegisterCommandDependencies } from "./command-types.js";

export function registerTransitionCommands(
  reg: Command,
  dependencies: RegisterCommandDependencies,
): void {
  const {
    addProjectOption,
    addRegisterCommitOptions,
    applyItemUpdate,
    assertRegisterItemCommitTargetsClean,
    assertTerminalOperationAllowed,
    loadItemForUpdate,
    parseRegisterTimestampOption,
    registerEventActor,
    runRegisterMutation,
    updateTicketStatusForItem,
  } = dependencies;

  // --- close ---
  const closeCmd = reg.command("close").description("Set item status to done or decided");
  addProjectOption(closeCmd);
  closeCmd.requiredOption("--id <id>", "Item ID (PJR-XXXX)");
  closeCmd.option("--status <status>", "done or decided (auto from item type if omitted)");
  closeCmd.option("--conclusion <text>", "Conclusion or resolution summary");
  closeCmd.option(
    "--completed <datetime>",
    "Completion date-time (RFC 3339 with time zone; defaults to now in UTC)",
  );
  closeCmd.option("--by <actor>", "Actor recorded in the append-only register event");
  closeCmd.option("--reason <text>", "Reason recorded in the append-only register event");
  closeCmd.option("--dry-run", "Print change without writing", false);
  addRegisterCommitOptions(closeCmd);
  closeCmd.action(async (opts) => {
    await runRegisterMutation("close", opts, (context) => {
      const { paths } = context;
      const view = loadItemForUpdate(paths, opts.id, "require-active");
      const item = view.item;
      assertTerminalOperationAllowed(item, "close");
      assertRegisterItemCommitTargetsClean(context, view);

      const targetStatus =
        opts.status ?? (["decision", "question"].includes(item.type) ? "decided" : "done");
      if (targetStatus !== "done" && targetStatus !== "decided") {
        throw new Error(`--status must be "done" or "decided" for the close command`);
      }

      const completedAt =
        parseRegisterTimestampOption(opts.completed, "completed", CELL_NONE) ?? nowUtcTimestamp();
      if (completedAt === CELL_NONE) {
        throw new Error(
          `Invalid completed: "${opts.completed}". A completion date-time is required`,
        );
      }

      const updated: PjrItem = {
        ...item,
        status: targetStatus,
        completedAt,
        ...(opts.conclusion !== undefined ? { conclusion: opts.conclusion } : {}),
      };
      applyItemUpdate({
        paths,
        view,
        updated,
        dryRun: opts.dryRun,
        eventAction: "close",
        eventActor: registerEventActor(opts),
        eventReason: opts.reason?.trim() || opts.conclusion?.trim() || `closed as ${targetStatus}`,
      });
      updateTicketStatusForItem({ paths, item, targetStatus: "ready", dryRun: opts.dryRun });
      return { id: item.id, title: item.title };
    });
  });

  // --- reject ---
  const rejectCmd = reg.command("reject").description("Set item status to rejected");
  addProjectOption(rejectCmd);
  rejectCmd.requiredOption("--id <id>", "Item ID (PJR-XXXX)");
  rejectCmd.option("--conclusion <text>", "Reason for rejection");
  rejectCmd.option(
    "--completed <datetime>",
    "Rejection date-time (RFC 3339 with time zone; defaults to now in UTC)",
  );
  rejectCmd.option("--by <actor>", "Actor recorded in the append-only register event");
  rejectCmd.option("--reason <text>", "Reason recorded in the append-only register event");
  rejectCmd.option("--dry-run", "Print change without writing", false);
  addRegisterCommitOptions(rejectCmd);
  rejectCmd.action(async (opts) => {
    await runRegisterMutation("reject", opts, (context) => {
      const { paths } = context;
      const view = loadItemForUpdate(paths, opts.id, "require-active");
      const item = view.item;
      assertTerminalOperationAllowed(item, "reject");
      assertRegisterItemCommitTargetsClean(context, view);

      const completedAt =
        parseRegisterTimestampOption(opts.completed, "completed", CELL_NONE) ?? nowUtcTimestamp();
      if (completedAt === CELL_NONE) {
        throw new Error(
          `Invalid completed: "${opts.completed}". A rejection date-time is required`,
        );
      }

      const updated: PjrItem = {
        ...item,
        status: "rejected",
        completedAt,
        ...(opts.conclusion !== undefined ? { conclusion: opts.conclusion } : {}),
      };
      applyItemUpdate({
        paths,
        view,
        updated,
        dryRun: opts.dryRun,
        eventAction: "reject",
        eventActor: registerEventActor(opts),
        eventReason: opts.reason?.trim() || opts.conclusion?.trim() || "item rejected",
      });
      updateTicketStatusForItem({ paths, item, targetStatus: "deprecated", dryRun: opts.dryRun });
      return { id: item.id, title: item.title };
    });
  });

  // --- defer ---
  const deferCmd = reg.command("defer").description("Set item status to deferred");
  addProjectOption(deferCmd);
  deferCmd.requiredOption("--id <id>", "Item ID (PJR-XXXX)");
  deferCmd.option("--conclusion <text>", "Reason for deferral");
  deferCmd.option("--by <actor>", "Actor recorded in the append-only register event");
  deferCmd.option("--reason <text>", "Reason recorded in the append-only register event");
  deferCmd.option("--dry-run", "Print change without writing", false);
  addRegisterCommitOptions(deferCmd);
  deferCmd.action(async (opts) => {
    await runRegisterMutation("defer", opts, (context) => {
      const { paths } = context;
      const view = loadItemForUpdate(paths, opts.id, "require-active");
      const item = view.item;
      assertTerminalOperationAllowed(item, "defer");
      assertRegisterItemCommitTargetsClean(context, view);

      const updated: PjrItem = {
        ...item,
        status: "deferred",
        ...(opts.conclusion !== undefined ? { conclusion: opts.conclusion } : {}),
      };
      applyItemUpdate({
        paths,
        view,
        updated,
        dryRun: opts.dryRun,
        eventAction: "defer",
        eventActor: registerEventActor(opts),
        eventReason: opts.reason?.trim() || opts.conclusion?.trim() || "item deferred",
      });
      return { id: item.id, title: item.title };
    });
  });

  // --- reopen ---
  const reopenCmd = reg.command("reopen").description("Reopen a terminal-status item");
  addProjectOption(reopenCmd);
  reopenCmd.requiredOption("--id <id>", "Item ID (PJR-XXXX)");
  reopenCmd.option(
    "--status <status>",
    "Target status: open | in-progress | waiting | review",
    "open",
  );
  reopenCmd.option("--by <actor>", "Actor recorded in the append-only register event");
  reopenCmd.option("--reason <text>", "Reason recorded in the append-only register event");
  reopenCmd.option("--dry-run", "Print change without writing", false);
  addRegisterCommitOptions(reopenCmd);
  reopenCmd.action(async (opts) => {
    await runRegisterMutation("reopen", opts, (context) => {
      const { paths } = context;
      const view = loadItemForUpdate(paths, opts.id, "require-terminal");
      const item = view.item;
      assertRegisterItemCommitTargetsClean(context, view);

      const validReopenStatuses = ["open", "in-progress", "waiting", "review"];
      if (!validReopenStatuses.includes(opts.status)) {
        throw new Error(`--status must be one of: ${validReopenStatuses.join(", ")}`);
      }

      const updated: PjrItem = { ...item, status: opts.status, completedAt: CELL_NONE };
      applyItemUpdate({
        paths,
        view,
        updated,
        dryRun: opts.dryRun,
        eventAction: "reopen",
        eventActor: registerEventActor(opts),
        eventReason: opts.reason?.trim() || `reopened as ${opts.status}`,
      });
      return { id: item.id, title: item.title };
    });
  });

  // --- start ---
  const startCmd = reg.command("start").description("Set item status to in-progress");
  addProjectOption(startCmd);
  startCmd.requiredOption("--id <id>", "Item ID (PJR-XXXX)");
  startCmd.option("--by <actor>", "Actor recorded in the append-only register event");
  startCmd.option("--reason <text>", "Reason recorded in the append-only register event");
  startCmd.option("--dry-run", "Print change without writing", false);
  addRegisterCommitOptions(startCmd);
  startCmd.action(async (opts) => {
    await runRegisterMutation("start", opts, (context) => {
      const { paths } = context;
      const view = loadItemForUpdate(paths, opts.id, "require-active");
      const item = view.item;
      assertRegisterItemCommitTargetsClean(context, view);
      const updated: PjrItem = { ...item, status: "in-progress" };
      applyItemUpdate({
        paths,
        view,
        updated,
        dryRun: opts.dryRun,
        eventAction: "start",
        eventActor: registerEventActor(opts),
        eventReason: opts.reason?.trim() || "work started",
      });
      return { id: item.id, title: item.title };
    });
  });

  // --- wait ---
  const waitCmd = reg.command("wait").description("Set item status to waiting");
  addProjectOption(waitCmd);
  waitCmd.requiredOption("--id <id>", "Item ID (PJR-XXXX)");
  waitCmd.option("--reason <text>", "Reason for waiting");
  waitCmd.option("--conclusion <text>", "Deprecated alias for --reason");
  waitCmd.option("--by <actor>", "Actor recorded in the append-only register event");
  waitCmd.option("--dry-run", "Print change without writing", false);
  addRegisterCommitOptions(waitCmd);
  waitCmd.action(async (opts) => {
    await runRegisterMutation("wait", opts, (context) => {
      if (opts.reason !== undefined && opts.conclusion !== undefined) {
        throw new Error("Specify only one of --reason or --conclusion");
      }
      const { paths } = context;
      const view = loadItemForUpdate(paths, opts.id, "require-active");
      const item = view.item;
      assertRegisterItemCommitTargetsClean(context, view);
      const reason = (opts.reason ?? opts.conclusion)?.trim();
      if (reason !== undefined && reason === "") {
        throw new Error("Waiting reason must not be empty");
      }
      const updated: PjrItem = { ...item, status: "waiting" };
      applyItemUpdate({
        paths,
        view,
        updated,
        dryRun: opts.dryRun,
        ...(reason !== undefined
          ? { fieldUpdates: { block_reason: inlineCodeAnglePlaceholders(reason) } }
          : {}),
        eventAction: "wait",
        eventActor: registerEventActor(opts),
        eventReason: reason || "item waiting",
      });
      return { id: item.id, title: item.title };
    });
  });

  // --- review ---
  const reviewCmd = reg.command("review").description("Set item status to review");
  addProjectOption(reviewCmd);
  reviewCmd.requiredOption("--id <id>", "Item ID (PJR-XXXX)");
  reviewCmd.option("--by <actor>", "Actor recorded in the append-only register event");
  reviewCmd.option("--reason <text>", "Reason recorded in the append-only register event");
  reviewCmd.option("--dry-run", "Print change without writing", false);
  addRegisterCommitOptions(reviewCmd);
  reviewCmd.action(async (opts) => {
    await runRegisterMutation("review", opts, (context) => {
      const { paths } = context;
      const view = loadItemForUpdate(paths, opts.id, "require-active");
      const item = view.item;
      assertRegisterItemCommitTargetsClean(context, view);
      const updated: PjrItem = { ...item, status: "review" };
      applyItemUpdate({
        paths,
        view,
        updated,
        dryRun: opts.dryRun,
        eventAction: "review",
        eventActor: registerEventActor(opts),
        eventReason: opts.reason?.trim() || "ready for review",
      });
      return { id: item.id, title: item.title };
    });
  });
}
