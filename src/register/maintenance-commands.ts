import type { Command } from "commander";
import { existsSync, writeFileSync } from "node:fs";
import { collectRegisterHistoryEvents, formatRegisterHistoryEvents } from "./history.js";
import {
  createGitTimestampResolver,
  planRegisterTimestampMigration,
  summarizeTimestampMigration,
} from "./migrate-timestamps.js";
import { registerEventFilePath, validateRegisterEventDocs } from "./events.js";
import { validateRegisterItemDocs } from "./item.js";
import { specdojoRootDir } from "../shared/specdojo-config.js";
import type { BuildScope, RegisterCommandDependencies } from "./command-types.js";
import { validateRegisterDependencyDocs } from "./dependency.js";
import { validateDerivedFromDocs } from "./derivation.js";

export function registerMaintenanceCommands(
  reg: Command,
  dependencies: RegisterCommandDependencies,
): void {
  const {
    addProjectOption,
    addRegisterCommitOptions,
    applyRegisterMigrationPlan,
    generateDerivedViewFiles,
    loadItemForUpdate,
    migrateEmbeddedRegisterEvents,
    migrateRegisterEventsFromGit,
    parseHistoryIds,
    planRegisterMigration,
    planRenumber,
    printCommandError,
    registerEventActor,
    renumberPjrItem,
    repoRelativePathspec,
    resolveRegisterPaths,
    runRegisterMutation,
    validBuildScopes,
    writeDerivedViews,
  } = dependencies;

  // --- migrate ---
  const migrateCmd = reg
    .command("migrate")
    .description("Migrate legacy register data (index rows, dates, and embedded register events)");
  addProjectOption(migrateCmd);
  migrateCmd.option("--dry-run", "Validate and print the migration summary without writing", false);
  migrateCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);
      const plan = planRegisterMigration(paths);
      const summary =
        `items=${plan.sourceCount}, create=${plan.createdCount}, update=${plan.updatedCount}, ` +
        `unchanged=${plan.unchangedCount}`;

      if (opts.dryRun) {
        process.stdout.write(`Would migrate register items: ${summary}\n`);
        if (plan.sourceIndexPath) {
          process.stdout.write(`Would remove legacy index: ${plan.sourceIndexPath}\n`);
        }
      } else {
        applyRegisterMigrationPlan(plan);
        process.stdout.write(`Migrated register items: ${summary}\n`);
        if (plan.sourceIndexPath) {
          process.stdout.write(`Removed legacy index: ${plan.sourceIndexPath}\n`);
        }
      }

      const timestampPlan = planRegisterTimestampMigration({
        projectRegisterPath: paths.projectRegisterPath,
        timeZone: paths.registerDateTimeZone,
        resolveGitTimestamps: createGitTimestampResolver(specdojoRootDir()),
      });
      const timestampSummary = summarizeTimestampMigration(timestampPlan);

      if (opts.dryRun) {
        const embeddedMigration = migrateEmbeddedRegisterEvents(paths, true);
        const eventMigration = migrateRegisterEventsFromGit(paths, true);
        const eventSummary = eventMigration.available
          ? `items=${eventMigration.items}, events=${eventMigration.events}, skipped=${eventMigration.skipped}`
          : "unavailable (Git history not found; legacy fallback remains active)";
        process.stdout.write(`Would migrate register timestamps: ${timestampSummary}\n`);
        process.stdout.write(
          `Would separate embedded register events: items=${embeddedMigration.items}, events=${embeddedMigration.events}\n`,
        );
        process.stdout.write(`Would migrate register events: ${eventSummary}\n`);
        return;
      }

      for (const file of timestampPlan.files) {
        writeFileSync(file.path, file.content, "utf8");
      }
      process.stdout.write(`Migrated register timestamps: ${timestampSummary}\n`);
      const embeddedMigration = migrateEmbeddedRegisterEvents(paths, false);
      process.stdout.write(
        `Separated embedded register events: items=${embeddedMigration.items}, events=${embeddedMigration.events}\n`,
      );
      const eventMigration = migrateRegisterEventsFromGit(paths, false);
      const eventSummary = eventMigration.available
        ? `items=${eventMigration.items}, events=${eventMigration.events}, skipped=${eventMigration.skipped}`
        : "unavailable (Git history not found; legacy fallback remains active)";
      process.stdout.write(`Migrated register events: ${eventSummary}\n`);

      for (const view of writeDerivedViews(paths, "all")) {
        process.stdout.write(`Generated: ${view.path}\n`);
      }
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- build ---
  const buildCmd = reg
    .command("build")
    .description("Generate the register list and derived views from register item files");
  addProjectOption(buildCmd);
  buildCmd.option("--scope <scope>", "Generation scope: register | controls | all", "all");
  buildCmd.option("--dry-run", "Print generated content without writing", false);
  buildCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);

      if (!existsSync(paths.projectRegisterPath)) {
        throw new Error(
          `Project register directory not found: ${paths.projectRegisterPath}\n` +
            `Run: specdojo register scaffold --project ${opts.project || paths.projectId}`,
        );
      }

      const scope = opts.scope as BuildScope;
      if (!validBuildScopes.includes(scope)) {
        throw new Error(
          `Invalid scope: "${opts.scope}". Must be one of: ${validBuildScopes.join(", ")}`,
        );
      }

      const validation = validateRegisterItemDocs(paths.projectRegisterPath);
      const derivationErrors = [
        ...validateDerivedFromDocs(paths),
        ...validateRegisterDependencyDocs(paths),
      ];
      const eventErrors = validateRegisterEventDocs(
        paths.projectRegisterPath,
        paths.registerDateTimeZone,
      );
      if (validation.errors.length > 0 || derivationErrors.length > 0 || eventErrors.length > 0) {
        throw new Error(
          `Invalid register item files:\n${[
            ...validation.errors,
            ...derivationErrors,
            ...eventErrors,
          ].join("\n")}`,
        );
      }

      const views = generateDerivedViewFiles(paths, scope);

      if (opts.dryRun) {
        for (const view of views) {
          process.stdout.write(`=== ${view.path} ===\n${view.content}\n\n`);
        }
        return;
      }

      for (const view of writeDerivedViews(paths, scope)) {
        process.stdout.write(`Generated: ${view.path}\n`);
      }
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- history ---
  const historyCmd = reg
    .command("history")
    .description("Show register item changes from append-only events and legacy Git history");
  addProjectOption(historyCmd);
  historyCmd.option("--since <date>", "Include commits on or after this date (YYYY-MM-DD)");
  historyCmd.option("--until <date>", "Include commits on or before this date (YYYY-MM-DD)");
  historyCmd.option(
    "--id <id...>",
    "Limit output to these item IDs (PJR-XXXX; space/comma separated)",
  );
  historyCmd.option(
    "--status-only",
    "Show only additions, removals, and status transitions",
    false,
  );
  historyCmd.option("--limit <count>", "Maximum number of commits to inspect");
  historyCmd.option("--json", "Print events as JSON", false);
  historyCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);
      const ids = parseHistoryIds(opts.id);
      const limit = opts.limit === undefined ? undefined : Number(opts.limit);

      const events = collectRegisterHistoryEvents({
        repoRoot: specdojoRootDir(),
        registerPathspec: repoRelativePathspec(specdojoRootDir(), paths.projectRegisterPath),
        since: opts.since?.trim() || undefined,
        until: opts.until?.trim() || undefined,
        limit,
        ids,
        statusOnly: Boolean(opts.statusOnly),
        timeZone: paths.registerDateTimeZone,
      });

      if (opts.json) {
        process.stdout.write(`${JSON.stringify(events, null, 2)}\n`);
        return;
      }
      if (events.length === 0) {
        process.stdout.write("No register item changes found for the given range.\n");
        return;
      }

      process.stdout.write(`${formatRegisterHistoryEvents(events)}\n`);
      const itemCount = new Set(events.map((event) => event.id)).size;
      const gitCommitCount = new Set(
        events.filter((event) => event.source !== "event").map((event) => event.commit),
      ).size;
      const storedEventCount = events.filter((event) => event.source === "event").length;
      process.stdout.write(
        `events=${events.length} items=${itemCount} stored=${storedEventCount} legacy_commits=${gitCommitCount}\n`,
      );
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- renumber ---
  const renumberCmd = reg
    .command("renumber")
    .description("Resolve a random PJR-ID collision by moving one item to an unused ID");
  addProjectOption(renumberCmd);
  renumberCmd.requiredOption("--id <id>", "Current item ID (PJR-XXXX)");
  renumberCmd.requiredOption("--to <id>", "Target unused ID (PJR-XXXX)");
  renumberCmd.option("--by <actor>", "Actor recorded in the append-only register event");
  renumberCmd.option("--reason <text>", "Reason recorded in the append-only register event");
  renumberCmd.option("--dry-run", "Print planned changes without writing", false);
  addRegisterCommitOptions(renumberCmd);
  renumberCmd.action(async (opts) => {
    await runRegisterMutation("renumber", opts, (context) => {
      const { paths } = context;
      const source = loadItemForUpdate(paths, opts.id);
      const renumberPlan = planRenumber(paths, opts.id, opts.to);
      context.assertCommitTargetsClean([
        ...(renumberPlan.ticketRename
          ? [renumberPlan.ticketRename.from, renumberPlan.ticketRename.to]
          : []),
        ...renumberPlan.writes.map((write) => write.path),
        registerEventFilePath(paths.projectRegisterPath, opts.id),
        registerEventFilePath(paths.projectRegisterPath, opts.to),
      ]);
      renumberPjrItem({
        paths,
        fromId: opts.id,
        toId: opts.to,
        dryRun: opts.dryRun,
        actor: registerEventActor(opts),
        reason: opts.reason,
      });
      return { id: opts.to, title: source.item.title };
    });
  });
}
