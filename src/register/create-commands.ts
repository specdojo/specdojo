import type { Command } from "commander";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { inlineCodeAnglePlaceholders } from "../shared/text.js";
import { APPROACHES, type Approach } from "../shared/agent-types.js";
import { appendRegisterEvent, buildRegisterEvent, registerEventFilePath } from "./events.js";
import { nowUtcTimestamp } from "./date.js";
import {
  CELL_NONE,
  CELL_TODO,
  REMOVE_REGISTER_ITEM_FIELD,
  VALID_PRIORITIES,
  VALID_DIFFICULTIES,
  VALID_STATUSES,
  VALID_TYPES,
  type PjrItem,
  type RegisterItemFieldUpdates,
} from "./item.js";
import { resolveSpecdojoTemplatePath } from "../docs/template-resolution.js";
import type { RegisterAddFields, RegisterCommandDependencies } from "./command-types.js";
import { validateRegisterApproachTargetsForProject } from "./approach.js";
import { normalizeDerivedFrom, validateDerivedFrom } from "./derivation.js";

function collectTarget(value: string, previous: string[] = []): string[] {
  return [...previous, value];
}

function normalizedTargets(values: string[] | undefined): string[] | undefined {
  if (values === undefined) return undefined;
  const targets = [...new Set(values.map((value) => value.trim()).filter(Boolean))];
  if (targets.includes("-")) {
    if (targets.length !== 1) throw new Error("--target - cannot be combined with other targets");
    return undefined;
  }
  if (targets.length === 0) throw new Error("--target must contain a document id");
  return targets;
}

export function registerCreateCommands(
  reg: Command,
  dependencies: RegisterCommandDependencies,
): void {
  const {
    addProjectOption,
    addRegisterCommitOptions,
    atomicWriteFile,
    buildRegisterItemContent,
    derivedTopicNeedsWarning,
    generateDerivedViewFiles,
    loadRegisterItems,
    parseRegisterTimestampOption,
    planRegisterItem,
    printCommandError,
    printDerivedTopicWarning,
    registerEventActor,
    registerTopicPattern,
    resolveRegisterPaths,
    runRegisterMutation,
    slugify,
    writeDerivedViews,
  } = dependencies;

  // --- scaffold ---
  const scaffoldCmd = reg
    .command("scaffold")
    .description("Initialize the register directory and generate its views");
  addProjectOption(scaffoldCmd);
  scaffoldCmd.option("--dry-run", "Print generated content to stdout without writing", false);
  scaffoldCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);

      if (opts.dryRun) {
        for (const view of generateDerivedViewFiles(paths, "all")) {
          process.stdout.write(`=== ${view.path} ===\n${view.content}\n\n`);
        }
        return;
      }

      mkdirSync(paths.projectRegisterPath, { recursive: true });
      process.stdout.write(`Created: ${paths.projectRegisterPath}/\n`);

      for (const view of writeDerivedViews(paths, "all")) {
        process.stdout.write(`Generated: ${view.path}\n`);
      }
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- add ---
  const addCmd = reg.command("add").description("Add a new item to pjr-index.md");
  addProjectOption(addCmd);
  addCmd.requiredOption("--type <type>", `Item type: ${VALID_TYPES.join(" | ")}`);
  addCmd.requiredOption("--title <title>", "Short title for the item");
  addCmd.option("--description <text>", "Description shown in the list", "_TODO_");
  addCmd.option("--priority <priority>", `Priority: ${VALID_PRIORITIES.join(" | ")}`, "medium");
  addCmd.option("--difficulty <difficulty>", `Difficulty: ${VALID_DIFFICULTIES.join(" | ")}`);
  addCmd.option("--status <status>", `Status: ${VALID_STATUSES.join(" | ")}`, "open");
  addCmd.option("--owner <owner>", "Owner or role", "_TODO_");
  addCmd.option(
    "--registered <datetime>",
    "Registration date-time (RFC 3339 with time zone, or _TODO_; defaults to now in UTC)",
  );
  addCmd.option("--due <date>", "Due date (YYYY-MM-DD, -, or _TODO_)", "_TODO_");
  addCmd.option(
    "--completed <datetime>",
    "Completion date-time (RFC 3339 with time zone, or -)",
    "-",
  );
  addCmd.option("--conclusion <text>", "Conclusion or resolution summary", "-");
  addCmd.option("--approach <approach>", `Execution approach: ${APPROACHES.join(" | ")}`);
  addCmd.option(
    "--target <doc-id>",
    "Target document id (repeatable; approach requires exactly one)",
    collectTarget,
  );
  addCmd.option(
    "--from <item-id>",
    "Register item this item derives from (repeatable)",
    collectTarget,
  );
  addCmd.option("--id <id>", "Display ID (e.g., PJR-0061); auto-incremented if omitted");
  addCmd.option(
    "--topic <topic>",
    "Topic slug for ticket filename; derived from --title if omitted",
  );
  addCmd.option("--by <actor>", "Actor recorded in the append-only register event");
  addCmd.option("--reason <text>", "Reason recorded in the append-only register event");
  addCmd.option("--force", "Overwrite existing ticket file", false);
  addCmd.option("--dry-run", "Print the generated item file without writing", false);
  addRegisterCommitOptions(addCmd);
  addCmd.action(async (opts) => {
    await runRegisterMutation("add", opts, ({ paths, assertCommitTargetsClean }) => {
      const explicitTopic = opts.topic?.trim();
      const topic = explicitTopic || slugify(opts.title);
      const warnAboutDerivedTopic =
        explicitTopic === undefined && derivedTopicNeedsWarning(opts.title, topic);
      if (!registerTopicPattern.test(topic)) {
        throw new Error(
          `Invalid topic: "${topic}". Must use lowercase letters, numbers, and single hyphens`,
        );
      }

      const registeredAt = parseRegisterTimestampOption(opts.registered, "registered", CELL_TODO);
      const completedAt = parseRegisterTimestampOption(opts.completed, "completed", CELL_NONE);
      if (
        opts.difficulty !== undefined &&
        !(VALID_DIFFICULTIES as readonly string[]).includes(opts.difficulty)
      ) {
        throw new Error(
          `Invalid difficulty: "${opts.difficulty}". Must be one of: ${VALID_DIFFICULTIES.join(", ")}`,
        );
      }
      if (opts.target?.some((target: string) => target.trim() === "-")) {
        throw new Error("--target - is only valid with register update");
      }
      const targets = normalizedTargets(opts.target);
      validateRegisterApproachTargetsForProject({
        projectId: paths.projectId,
        ...(opts.approach !== undefined ? { approach: opts.approach } : {}),
        ...(targets !== undefined ? { targets } : {}),
        validateTargetsWithoutApproach: opts.target !== undefined,
      });

      const fields: RegisterAddFields = {
        type: opts.type,
        title: opts.title,
        description: opts.description,
        priority: opts.priority,
        ...(opts.difficulty !== undefined ? { difficulty: opts.difficulty } : {}),
        status: opts.status,
        owner: opts.owner,
        registeredAt: registeredAt ?? nowUtcTimestamp(),
        due: opts.due,
        completedAt: completedAt ?? CELL_NONE,
        conclusion: opts.conclusion,
        ...(opts.approach !== undefined ? { approach: opts.approach as Approach } : {}),
        ...(targets !== undefined ? { targets } : {}),
      };
      const templatePath = resolveSpecdojoTemplatePath(`pjr-${opts.type}-template.md`);

      const { assignedId: displayId, ticketFilename } = planRegisterItem({
        existingIds: loadRegisterItems(paths).map((view) => view.id),
        explicitId: opts.id?.trim() || undefined,
        fields,
        topic,
      });
      const derivedFrom = normalizeDerivedFrom(opts.from, { allowRemove: false });
      validateDerivedFrom({
        projectId: paths.projectId,
        itemId: displayId,
        derivedFrom,
      });
      if (derivedFrom !== undefined) fields.derivedFrom = derivedFrom;

      const ticketPath = join(paths.projectRegisterPath, ticketFilename);
      const content = buildRegisterItemContent({
        projectId: paths.projectId,
        displayId,
        topic,
        fields,
        templatePath,
      });
      const addEvent = buildRegisterEvent({
        afterContent: content,
        filename: ticketFilename,
        timeZone: paths.registerDateTimeZone,
        action: "add",
        actor: registerEventActor(opts),
        reason: opts.reason?.trim() || "item added",
      });
      if (!addEvent) throw new Error(`Failed to build add event for ${displayId}`);
      if (opts.dryRun) {
        process.stdout.write(`Would create ${ticketPath}:\n${content}\n`);
        process.stdout.write(
          `Would create ${registerEventFilePath(paths.projectRegisterPath, displayId)}:\n` +
            `${appendRegisterEvent(undefined, addEvent)}\n`,
        );
        if (warnAboutDerivedTopic) printDerivedTopicWarning(topic);
        return { id: displayId, title: opts.title };
      }

      if (!opts.force && existsSync(ticketPath)) {
        throw new Error(`Item file already exists (use --force to overwrite): ${ticketPath}`);
      }
      const eventPath = registerEventFilePath(paths.projectRegisterPath, displayId);
      assertCommitTargetsClean([ticketPath, eventPath]);
      if (!opts.force && existsSync(eventPath)) {
        throw new Error(
          `Register event file already exists (use --force to overwrite): ${eventPath}`,
        );
      }

      mkdirSync(paths.projectRegisterPath, { recursive: true });
      atomicWriteFile(ticketPath, content);
      atomicWriteFile(eventPath, appendRegisterEvent(undefined, addEvent));
      process.stdout.write(`Created: ${ticketPath} (added ${displayId})\n`);
      process.stdout.write(`Created: ${eventPath}\n`);

      if (existsSync(paths.pjrIndexPath)) {
        for (const view of writeDerivedViews(paths, "all")) {
          process.stdout.write(`Generated: ${view.path}\n`);
        }
      }
      if (warnAboutDerivedTopic) printDerivedTopicWarning(topic);
      return { id: displayId, title: opts.title };
    });
  });
}

export function registerUpdateCommand(
  reg: Command,
  dependencies: RegisterCommandDependencies,
): void {
  const {
    addProjectOption,
    addRegisterCommitOptions,
    applyItemUpdate,
    assertRegisterItemCommitTargetsClean,
    loadItemForUpdate,
    planRetopic,
    registerEventActor,
    registerTopicPattern,
    retopicPjrItem,
    runRegisterMutation,
    ticketTopicFromFilename,
  } = dependencies;

  // --- update ---
  const updateCmd = reg.command("update").description("Update fields of a register item");
  addProjectOption(updateCmd);
  updateCmd.requiredOption("--id <id>", "Item ID (PJR-XXXX)");
  updateCmd.option("--title <title>", "Update title");
  updateCmd.option("--description <text>", "Update description");
  updateCmd.option("--priority <priority>", `Update priority: ${VALID_PRIORITIES.join(" | ")}`);
  updateCmd.option(
    "--difficulty <difficulty>",
    `Update difficulty: ${VALID_DIFFICULTIES.join(" | ")}; use - to remove`,
  );
  updateCmd.option("--owner <owner>", "Update owner or role");
  updateCmd.option("--due <date>", "Update due date (YYYY-MM-DD, -, or _TODO_)");
  updateCmd.option("--conclusion <text>", "Update conclusion or use - to remove it");
  updateCmd.option("--block-reason <text>", "Update the waiting reason or use - to remove it");
  updateCmd.option(
    "--autopilot <approval>",
    "Night orchestrator approval: approved, or - to revoke",
  );
  updateCmd.option(
    "--approach <approach>",
    `Update execution approach (${APPROACHES.join(" | ")}; use - to remove)`,
  );
  updateCmd.option(
    "--target <doc-id>",
    "Replace target document ids (repeatable; use - to remove)",
    collectTarget,
  );
  updateCmd.option(
    "--from <item-id>",
    "Replace source register item IDs (repeatable; use - to remove)",
    collectTarget,
  );
  updateCmd.option(
    "--topic <topic>",
    "Update the topic slug in the ticket filename and document ID",
  );
  updateCmd.option("--by <actor>", "Actor recorded in the append-only register event");
  updateCmd.option("--reason <text>", "Reason recorded in the append-only register event");
  updateCmd.option("--dry-run", "Print change without writing", false);
  addRegisterCommitOptions(updateCmd);
  updateCmd.action(async (opts) => {
    await runRegisterMutation("update", opts, (context) => {
      const { paths } = context;
      const view = loadItemForUpdate(paths, opts.id);
      const item = view.item;

      const hasUpdates = [
        "title",
        "description",
        "priority",
        "difficulty",
        "owner",
        "due",
        "conclusion",
        "blockReason",
        "autopilot",
        "approach",
        "target",
        "from",
        "topic",
      ].some((key) => opts[key] !== undefined);
      if (!hasUpdates) {
        throw new Error(
          "At least one field option must be specified (--title, --description, --priority, --difficulty, --owner, --due, --conclusion, --block-reason, --autopilot, --approach, --target, --from, --topic)",
        );
      }

      if (
        opts.priority !== undefined &&
        !(VALID_PRIORITIES as readonly string[]).includes(opts.priority)
      ) {
        throw new Error(
          `Invalid priority: "${opts.priority}". Must be one of: ${VALID_PRIORITIES.join(", ")}`,
        );
      }
      if (
        opts.difficulty !== undefined &&
        opts.difficulty !== "-" &&
        !(VALID_DIFFICULTIES as readonly string[]).includes(opts.difficulty)
      ) {
        throw new Error(
          `Invalid difficulty: "${opts.difficulty}". Must be one of: ${VALID_DIFFICULTIES.join(", ")}, -`,
        );
      }
      if (opts.due !== undefined && !/^(\d{4}-\d{2}-\d{2}|-|_TODO_)$/.test(opts.due)) {
        throw new Error(`Invalid due: "${opts.due}". Must be YYYY-MM-DD, -, or _TODO_`);
      }
      const topic = opts.topic?.trim();
      if (topic !== undefined && !registerTopicPattern.test(topic)) {
        throw new Error(
          `Invalid topic: "${topic}". Must use lowercase letters, numbers, and single hyphens`,
        );
      }
      const blockReason = opts.blockReason?.trim();
      if (blockReason !== undefined && blockReason === "") {
        throw new Error("Block reason must not be empty; use - to remove it");
      }
      if (blockReason !== undefined && blockReason !== "-" && item.status !== "waiting") {
        throw new Error(
          `Cannot set block reason for ${item.id}: status is "${item.status}" (expected "waiting"). Use - to remove it.`,
        );
      }
      const blockReasonUpdates: RegisterItemFieldUpdates | undefined =
        blockReason === undefined
          ? undefined
          : {
              block_reason:
                blockReason === "-"
                  ? REMOVE_REGISTER_ITEM_FIELD
                  : inlineCodeAnglePlaceholders(blockReason),
            };
      if (opts.autopilot !== undefined && !["approved", "-"].includes(opts.autopilot)) {
        throw new Error('Invalid autopilot approval. Use "approved" or "-".');
      }
      if (opts.autopilot === "approved" && item.type !== "todo" && item.type !== "issue") {
        throw new Error(
          `Cannot approve ${item.id} for night autopilot: type is "${item.type}" (expected todo or issue).`,
        );
      }
      const autopilotUpdates: RegisterItemFieldUpdates | undefined =
        opts.autopilot === undefined
          ? undefined
          : {
              autopilot:
                opts.autopilot === "-" ? REMOVE_REGISTER_ITEM_FIELD : ("approved" as const),
            };
      const nextApproach =
        opts.approach === undefined
          ? item.approach
          : opts.approach.trim() === "-"
            ? undefined
            : opts.approach.trim();
      const nextTargets = opts.target === undefined ? item.targets : normalizedTargets(opts.target);
      const nextDerivedFrom =
        opts.from === undefined
          ? item.derivedFrom
          : normalizeDerivedFrom(opts.from, { allowRemove: true });
      validateDerivedFrom({
        projectId: paths.projectId,
        itemId: item.id,
        derivedFrom: nextDerivedFrom,
      });
      validateRegisterApproachTargetsForProject({
        projectId: paths.projectId,
        ...(nextApproach !== undefined ? { approach: nextApproach } : {}),
        ...(nextTargets !== undefined ? { targets: nextTargets } : {}),
        validateTargetsWithoutApproach: opts.target !== undefined,
      });
      const approachTargetUpdates: RegisterItemFieldUpdates = {
        ...(opts.difficulty !== undefined
          ? {
              difficulty: opts.difficulty === "-" ? REMOVE_REGISTER_ITEM_FIELD : opts.difficulty,
            }
          : {}),
        ...(opts.approach !== undefined
          ? {
              approach: nextApproach === undefined ? REMOVE_REGISTER_ITEM_FIELD : nextApproach,
            }
          : {}),
        ...(opts.target !== undefined
          ? {
              targets: nextTargets ?? REMOVE_REGISTER_ITEM_FIELD,
            }
          : {}),
        ...(opts.from !== undefined
          ? {
              derived_from: nextDerivedFrom ?? REMOVE_REGISTER_ITEM_FIELD,
            }
          : {}),
      };

      const updated: PjrItem = {
        ...item,
        ...(opts.title !== undefined ? { title: opts.title } : {}),
        ...(opts.description !== undefined ? { description: opts.description } : {}),
        ...(opts.priority !== undefined ? { priority: opts.priority } : {}),
        ...(opts.difficulty !== undefined && opts.difficulty !== "-"
          ? { difficulty: opts.difficulty }
          : {}),
        ...(opts.owner !== undefined ? { owner: opts.owner } : {}),
        ...(opts.due !== undefined ? { due: opts.due } : {}),
        ...(opts.conclusion !== undefined ? { conclusion: opts.conclusion } : {}),
      };
      if (opts.difficulty === "-") delete updated.difficulty;
      if (opts.autopilot !== undefined) {
        if (opts.autopilot === "-") delete updated.autopilot;
        else updated.autopilot = "approved";
      }
      if (opts.approach !== undefined) {
        if (nextApproach === undefined) delete updated.approach;
        else updated.approach = nextApproach as Approach;
      }
      if (opts.target !== undefined) {
        if (nextTargets === undefined) delete updated.targets;
        else updated.targets = nextTargets;
      }
      if (opts.from !== undefined) {
        if (nextDerivedFrom === undefined) delete updated.derivedFrom;
        else updated.derivedFrom = nextDerivedFrom;
      }
      const currentTopic = view.ticketFilename
        ? ticketTopicFromFilename(opts.id, view.ticketFilename)
        : undefined;
      if (topic !== undefined && topic !== currentTopic) {
        const retopicPlan = planRetopic(paths, opts.id, topic);
        context.assertCommitTargetsClean([
          retopicPlan.ticketRename.from,
          ...retopicPlan.writes.map((write) => write.path),
          registerEventFilePath(paths.projectRegisterPath, item.id),
        ]);
        retopicPjrItem({
          paths,
          id: opts.id,
          topic,
          updated,
          dryRun: opts.dryRun,
          ...(blockReasonUpdates ||
          autopilotUpdates ||
          Object.keys(approachTargetUpdates).length > 0
            ? {
                fieldUpdates: {
                  ...blockReasonUpdates,
                  ...autopilotUpdates,
                  ...approachTargetUpdates,
                },
              }
            : {}),
          ...(opts.title !== undefined ? { title: opts.title } : {}),
          ...(opts.description !== undefined ? { description: opts.description } : {}),
          actor: registerEventActor(opts),
          reason: opts.reason?.trim() || "",
        });
        return { id: item.id, title: updated.title };
      }
      assertRegisterItemCommitTargetsClean(context, view);
      applyItemUpdate({
        paths,
        view,
        updated,
        dryRun: opts.dryRun,
        action: "fields updated",
        ...(opts.title !== undefined ? { title: opts.title } : {}),
        ...(opts.description !== undefined ? { description: opts.description } : {}),
        ...(blockReasonUpdates || autopilotUpdates || Object.keys(approachTargetUpdates).length > 0
          ? {
              fieldUpdates: {
                ...blockReasonUpdates,
                ...autopilotUpdates,
                ...approachTargetUpdates,
              },
            }
          : {}),
        eventAction: "update",
        eventActor: registerEventActor(opts),
        eventReason: opts.reason?.trim() || "fields updated",
      });
      return { id: item.id, title: updated.title };
    });
  });
}
