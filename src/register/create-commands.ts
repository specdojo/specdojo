import { normalizeRegisterInput } from "./input.js";
import type { Command } from "commander";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { inlineCodeAnglePlaceholders } from "../shared/text.js";
import { APPROACHES, type Approach } from "../shared/agent-types.js";
import { appendRegisterEvent, buildRegisterEvent, registerEventFilePath } from "./events.js";
import { nowUtcTimestamp } from "./date.js";
import {
  readRegisterItemContent,
  CELL_NONE,
  CELL_TODO,
  REMOVE_REGISTER_ITEM_FIELD,
  VALID_PRIORITIES,
  VALID_DIFFICULTIES,
  VALID_STATUSES,
  VALID_TYPES,
  VALID_COMMIT_TYPES,
  COMMIT_SCOPE_RE,
  type PjrItem,
  type RegisterItemFieldUpdates,
} from "./item.js";
import { resolveSpecdojoTemplatePath } from "../docs/template-resolution.js";
import type { RegisterAddFields, RegisterCommandDependencies } from "./command-types.js";
import { validateRegisterApproachTargetsForProject } from "./approach.js";
import { normalizeDependsOn, validateRegisterDependencies } from "./dependency.js";
import { normalizeDerivedFrom, validateDerivedFrom } from "./derivation.js";
import { delegateExternalRegisterAdd } from "./external-project.js";
import { validateRegisterTrack } from "./epic.js";
import { isAuthoringApproach } from "../kata/authoring.js";

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

function normalizedSources(
  values: string[] | undefined,
  allowRemove = false,
): string[] | undefined {
  if (values === undefined) return undefined;
  const sources = [...new Set(values.map((value) => value.trim()).filter(Boolean))];
  if (sources.includes("-")) {
    if (!allowRemove) throw new Error("--source - is only valid with register update");
    if (sources.length !== 1) throw new Error("--source - cannot be combined with other sources");
    return undefined;
  }
  if (sources.length === 0) throw new Error("--source must contain a reference");
  return sources;
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
  addCmd.option("--track <track>", "Track governed by an epic (required for epic)");
  addCmd.requiredOption("--title <title>", "Short title for the item");
  addCmd.option("--input <text>", "Premise recorded in the ticket (repeatable)", collectTarget);
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
  addCmd.option("--target-path <path>", "Repository-relative deliverable file path");
  addCmd.option("--target-rulebook <doc-id>", "Deliverable rulebook id (new id for bootstrap)");
  addCmd.option("--approach <approach>", `Execution approach: ${APPROACHES.join(" | ")}`);
  addCmd.option(
    "--target <target>",
    "Document id, domain:<id> for catalog-planning, or track:<id> for strategy-planning (repeatable)",
    collectTarget,
  );
  addCmd.option(
    "--source <ref>",
    "Read-only exemplar for *-authoring (repeatable: doc id, path, or <repo>:<path>)",
    collectTarget,
  );
  addCmd.option(
    "--from <item-id>",
    "Register item this item derives from (repeatable)",
    collectTarget,
  );
  addCmd.option(
    "--depends-on <item-id>",
    "Predecessor item ID (repeatable; use - to remove)",
    collectTarget,
  );
  addCmd.option(
    "--commit-type <type>",
    `Conventional Commits type: ${VALID_COMMIT_TYPES.join(" | ")}`,
  );
  addCmd.option("--commit-scope <scope>", "Conventional Commits scope");
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
    try {
      if (delegateExternalRegisterAdd(opts)) return;
    } catch (error) {
      printCommandError(error);
      return;
    }
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
      if (
        opts.commitType !== undefined &&
        !(VALID_COMMIT_TYPES as readonly string[]).includes(opts.commitType)
      ) {
        throw new Error(
          `Invalid commit type: "${opts.commitType}". Must be one of: ${VALID_COMMIT_TYPES.join(", ")}`,
        );
      }
      const commitScope = opts.commitScope?.trim();
      if (commitScope !== undefined && !COMMIT_SCOPE_RE.test(commitScope)) {
        throw new Error(`Invalid commit scope: "${commitScope}". Must match ${COMMIT_SCOPE_RE}`);
      }
      if (opts.target?.some((target: string) => target.trim() === "-")) {
        throw new Error("--target - is only valid with register update");
      }
      const rawTargets = normalizedTargets(opts.target);
      const authoring = isAuthoringApproach(opts.approach);
      const legacySources = authoring ? (rawTargets ?? []).slice(1) : [];
      const targets = authoring ? rawTargets?.slice(0, 1) : rawTargets;
      const explicitSources = normalizedSources(opts.source);
      const sources =
        legacySources.length > 0 || explicitSources
          ? [...new Set([...legacySources, ...(explicitSources ?? [])])]
          : undefined;
      validateRegisterApproachTargetsForProject({
        projectId: paths.projectId,
        ...(opts.approach !== undefined ? { approach: opts.approach } : {}),
        ...(opts.targetPath !== undefined ? { targetPath: opts.targetPath.trim() } : {}),
        ...(opts.targetRulebook !== undefined
          ? { targetRulebook: opts.targetRulebook.trim() }
          : {}),
        ...(rawTargets !== undefined ? { targets: rawTargets } : {}),
        ...(explicitSources !== undefined ? { sources: explicitSources } : {}),
        validateTargetsWithoutApproach: opts.target !== undefined || opts.source !== undefined,
      });

      const track = opts.track?.trim();
      validateRegisterTrack(paths.projectId, opts.type, track);
      const fields: RegisterAddFields = {
        ...(track !== undefined ? { track } : {}),
        type: opts.type,
        title: opts.title,
        description: opts.description,
        inputs: normalizeRegisterInput(opts.input),
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
        ...(opts.targetPath !== undefined ? { targetPath: opts.targetPath.trim() } : {}),
        ...(opts.targetRulebook !== undefined
          ? { targetRulebook: opts.targetRulebook.trim() }
          : {}),
        ...(sources !== undefined ? { sources } : {}),
        ...(opts.commitType !== undefined ? { commitType: opts.commitType } : {}),
        ...(commitScope !== undefined ? { commitScope } : {}),
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
      fields.dependsOn = normalizeDependsOn(opts.dependsOn);

      const ticketPath = join(paths.projectRegisterPath, ticketFilename);
      const content = buildRegisterItemContent({
        projectId: paths.projectId,
        displayId,
        topic,
        fields,
        templatePath,
      });
      const dependencyItem = readRegisterItemContent(content, ticketFilename)?.item;
      if (!dependencyItem) throw new Error(`Failed to read item ${displayId}`);
      validateRegisterDependencies(paths, dependencyItem);
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
  updateCmd.option("--track <track>", "Replace the track governed by an epic");
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
  updateCmd.option("--target-path <path>", "Replace deliverable path; use - to remove");
  updateCmd.option(
    "--target-rulebook <doc-id>",
    "Replace deliverable rulebook id; use - to remove",
  );
  updateCmd.option(
    "--approach <approach>",
    `Update execution approach (${APPROACHES.join(" | ")}; use - to remove)`,
  );
  updateCmd.option(
    "--target <target>",
    "Replace target document ids (repeatable; legacy authoring exemplars may follow; use - to remove)",
    collectTarget,
  );
  updateCmd.option(
    "--input <text>",
    "Replace ticket premises (repeatable; use - to remove)",
    collectTarget,
  );
  updateCmd.option(
    "--source <ref>",
    "Replace read-only *-authoring exemplars (repeatable; use - to remove)",
    collectTarget,
  );
  updateCmd.option(
    "--from <item-id>",
    "Replace source register item IDs (repeatable; use - to remove)",
    collectTarget,
  );
  updateCmd.option(
    "--depends-on <item-id>",
    "Replace predecessor IDs (repeatable; use - to remove)",
    collectTarget,
  );
  updateCmd.option(
    "--commit-type <type>",
    `Update Conventional Commits type (${VALID_COMMIT_TYPES.join(" | ")}; use - to remove)`,
  );
  updateCmd.option("--commit-scope <scope>", "Update Conventional Commits scope; use - to remove");
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
        "track",
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
        "source",
        "input",
        "targetPath",
        "targetRulebook",
        "from",
        "dependsOn",
        "commitType",
        "commitScope",
        "topic",
      ].some((key) => opts[key] !== undefined);
      if (!hasUpdates) {
        throw new Error(
          "At least one field option must be specified (--track, --title, --description, --priority, --difficulty, --owner, --due, --conclusion, --block-reason, --autopilot, --approach, --target, --source, --input, --from, --depends-on, --commit-type, --commit-scope, --topic)",
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
      if (
        opts.commitType !== undefined &&
        opts.commitType !== "-" &&
        !(VALID_COMMIT_TYPES as readonly string[]).includes(opts.commitType)
      ) {
        throw new Error(
          `Invalid commit type: "${opts.commitType}". Must be one of: ${VALID_COMMIT_TYPES.join(", ")}, -`,
        );
      }
      const commitScope = opts.commitScope?.trim();
      if (commitScope !== undefined && commitScope !== "-" && !COMMIT_SCOPE_RE.test(commitScope)) {
        throw new Error(
          `Invalid commit scope: "${commitScope}". Must match ${COMMIT_SCOPE_RE}, or -`,
        );
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
      const nextTargetPath =
        opts.targetPath === undefined
          ? item.targetPath
          : opts.targetPath.trim() === "-"
            ? undefined
            : opts.targetPath.trim();
      const nextTargetRulebook =
        opts.targetRulebook === undefined
          ? item.targetRulebook
          : opts.targetRulebook.trim() === "-"
            ? undefined
            : opts.targetRulebook.trim();
      const nextApproach =
        opts.approach === undefined
          ? item.approach
          : opts.approach.trim() === "-"
            ? undefined
            : opts.approach.trim();
      const authoring = isAuthoringApproach(nextApproach);
      const providedTargets =
        opts.target === undefined ? undefined : normalizedTargets(opts.target);
      const providedLegacySources = authoring ? (providedTargets ?? []).slice(1) : [];
      const nextTargets =
        opts.target === undefined
          ? authoring
            ? item.targets?.slice(0, 1)
            : item.targets
          : authoring
            ? providedTargets?.slice(0, 1)
            : providedTargets;
      const existingSources = [
        ...(isAuthoringApproach(item.approach) ? (item.targets ?? []).slice(1) : []),
        ...(item.sources ?? []),
      ];
      const explicitSources =
        opts.source === undefined ? undefined : normalizedSources(opts.source, true);
      const nextSources = authoring
        ? opts.source !== undefined
          ? [...new Set([...providedLegacySources, ...(explicitSources ?? [])])]
          : providedLegacySources.length > 0
            ? [...new Set(providedLegacySources)]
            : [...new Set(existingSources)]
        : opts.source !== undefined
          ? explicitSources
          : item.sources;
      const normalizedNextSources = nextSources && nextSources.length > 0 ? nextSources : undefined;
      const nextDependsOn =
        opts.dependsOn === undefined ? item.dependsOn : normalizeDependsOn(opts.dependsOn);
      validateRegisterDependencies(paths, { ...item, dependsOn: nextDependsOn });
      const nextDerivedFrom =
        opts.from === undefined
          ? item.derivedFrom
          : normalizeDerivedFrom(opts.from, { allowRemove: true });
      validateDerivedFrom({
        projectId: paths.projectId,
        itemId: item.id,
        derivedFrom: nextDerivedFrom,
      });
      if (
        opts.approach !== undefined ||
        opts.target !== undefined ||
        opts.source !== undefined ||
        opts.targetPath !== undefined ||
        opts.targetRulebook !== undefined
      ) {
        validateRegisterApproachTargetsForProject({
          projectId: paths.projectId,
          ...(nextTargetPath !== undefined ? { targetPath: nextTargetPath } : {}),
          ...(nextTargetRulebook !== undefined ? { targetRulebook: nextTargetRulebook } : {}),
          ...(nextApproach !== undefined ? { approach: nextApproach } : {}),
          ...(nextTargets !== undefined ? { targets: nextTargets } : {}),
          ...(normalizedNextSources !== undefined ? { sources: normalizedNextSources } : {}),
          validateTargetsWithoutApproach: opts.target !== undefined || opts.source !== undefined,
        });
      }
      const shouldUpdateTargets =
        opts.target !== undefined ||
        (authoring && opts.source !== undefined && (item.targets?.length ?? 0) > 1);
      const shouldUpdateSources =
        opts.source !== undefined || (authoring && providedLegacySources.length > 0);
      const approachTargetUpdates: RegisterItemFieldUpdates = {
        ...(opts.dependsOn !== undefined
          ? { depends_on: nextDependsOn ?? REMOVE_REGISTER_ITEM_FIELD }
          : {}),
        ...(opts.targetPath !== undefined
          ? { target_path: nextTargetPath ?? REMOVE_REGISTER_ITEM_FIELD }
          : {}),
        ...(opts.targetRulebook !== undefined
          ? { target_rulebook: nextTargetRulebook ?? REMOVE_REGISTER_ITEM_FIELD }
          : {}),
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
        ...(shouldUpdateTargets
          ? {
              targets: nextTargets ?? REMOVE_REGISTER_ITEM_FIELD,
            }
          : {}),
        ...(shouldUpdateSources
          ? {
              sources: normalizedNextSources ?? REMOVE_REGISTER_ITEM_FIELD,
            }
          : {}),
        ...(opts.from !== undefined
          ? {
              derived_from: nextDerivedFrom ?? REMOVE_REGISTER_ITEM_FIELD,
            }
          : {}),
        ...(opts.commitType !== undefined
          ? {
              commit_type: opts.commitType === "-" ? REMOVE_REGISTER_ITEM_FIELD : opts.commitType,
            }
          : {}),
        ...(commitScope !== undefined
          ? {
              commit_scope: commitScope === "-" ? REMOVE_REGISTER_ITEM_FIELD : commitScope,
            }
          : {}),
      };

      const track = opts.track === undefined ? item.track : opts.track.trim();
      validateRegisterTrack(paths.projectId, item.type, track);
      const inputs = normalizeRegisterInput(opts.input, true);
      const updated: PjrItem = {
        ...item,
        ...(inputs !== undefined ? { inputs } : {}),
        ...(track !== undefined ? { track } : {}),
        ...(opts.title !== undefined ? { title: opts.title } : {}),
        ...(opts.description !== undefined ? { description: opts.description } : {}),
        ...(opts.priority !== undefined ? { priority: opts.priority } : {}),
        ...(opts.difficulty !== undefined && opts.difficulty !== "-"
          ? { difficulty: opts.difficulty }
          : {}),
        ...(opts.owner !== undefined ? { owner: opts.owner } : {}),
        ...(opts.due !== undefined ? { due: opts.due } : {}),
        ...(opts.conclusion !== undefined ? { conclusion: opts.conclusion } : {}),
        ...(opts.commitType !== undefined && opts.commitType !== "-"
          ? { commitType: opts.commitType }
          : {}),
        ...(commitScope !== undefined && commitScope !== "-" ? { commitScope } : {}),
      };
      if (opts.difficulty === "-") delete updated.difficulty;
      if (opts.commitType === "-") delete updated.commitType;
      if (commitScope === "-") delete updated.commitScope;
      if (opts.autopilot !== undefined) {
        if (opts.autopilot === "-") delete updated.autopilot;
        else updated.autopilot = "approved";
      }
      if (opts.targetPath !== undefined) {
        if (nextTargetPath === undefined) delete updated.targetPath;
        else updated.targetPath = nextTargetPath;
      }
      if (opts.targetRulebook !== undefined) {
        if (nextTargetRulebook === undefined) delete updated.targetRulebook;
        else updated.targetRulebook = nextTargetRulebook;
      }
      if (opts.approach !== undefined) {
        if (nextApproach === undefined) delete updated.approach;
        else updated.approach = nextApproach as Approach;
      }
      if (shouldUpdateTargets) {
        if (nextTargets === undefined) delete updated.targets;
        else updated.targets = nextTargets;
      }
      if (shouldUpdateSources) {
        if (normalizedNextSources === undefined) delete updated.sources;
        else updated.sources = normalizedNextSources;
      }
      if (opts.from !== undefined) {
        if (nextDerivedFrom === undefined) delete updated.derivedFrom;
        else updated.derivedFrom = nextDerivedFrom;
      }
      if (opts.dependsOn !== undefined) {
        if (nextDependsOn === undefined) delete updated.dependsOn;
        else updated.dependsOn = nextDependsOn;
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
          ...(inputs !== undefined ? { inputs } : {}),
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
        ...(inputs !== undefined ? { inputs } : {}),
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
