import { type Command } from "commander";
import { existsSync, readFileSync } from "node:fs";
import { relative, sep } from "node:path";
import { CrossProcessMutex } from "../shared/cross-process-lock.js";
import {
  gitOutput,
  gitResult,
  repoRelative,
  stageCommitTargets,
  worktreeStatusPaths,
} from "../shared/git.js";
import { inlineCodeAnglePlaceholders } from "../shared/text.js";
import type { Approach } from "../shared/agent-types.js";
import {
  atomicWriteFile,
  buildRegisterItemContent,
  derivedTopicNeedsWarning,
  generatePjrId,
  printDerivedTopicWarning,
  registerEventActor,
  REGISTER_TOPIC_RE,
  resolveRegisterPaths,
  slugify,
  type RegisterItemView,
  type RegisterPaths,
  validateFields,
} from "./core.js";
import { registerCreateCommands, registerUpdateCommand } from "./create-commands.js";
import type { RegisterCommandDependencies } from "./command-types.js";
import { normalizeRegisterTimestamp } from "./date.js";
import { validateRegisterDependencyDocs } from "./dependency.js";
import { validateDerivedFromDocs } from "./derivation.js";
import {
  appendRegisterEvent,
  deterministicRegisterEventId,
  readEmbeddedRegisterEvents,
  readRegisterEventsFromContent,
  registerEventFilePath,
  removeEmbeddedRegisterEvents,
  serializeRegisterEvents,
  validateRegisterEventDocs,
  type RegisterEventAction,
  type RegisterEventV1,
} from "./events.js";
import { collectRegisterHistoryEvents } from "./history.js";
import {
  loadRegisterItemDocs,
  PJR_ID_ALPHABET,
  PJR_ID_RE,
  TERMINAL_STATUSES_SET,
  toCell,
  validateRegisterItemDocs,
  VALID_PRIORITIES,
  VALID_DIFFICULTIES,
  VALID_STATUSES,
  VALID_TYPES,
  VALID_COMMIT_TYPES,
  COMMIT_SCOPE_RE,
  DEFAULT_ITEM_TYPE_COMMIT_TYPE_MAP,
  resolveItemCommitTypeAndScope,
  type CommitType,
  type ResolvedCommitTypeAndScope,
  type PjrDisplayItem,
  type PjrItem,
  type RegisterDifficulty,
} from "./item.js";
import { registerMaintenanceCommands } from "./maintenance-commands.js";
import { applyRegisterMigrationPlan, planRegisterMigration } from "./migration.js";
import {
  planRenumber,
  planRetopic,
  renumberPjrItem,
  retopicPjrItem,
  ticketTopicFromFilename,
} from "./renumber.js";
import { registerTransitionCommands } from "./transition-commands.js";
import {
  applyItemUpdate,
  assertTerminalOperationAllowed,
  loadItemForUpdate,
  updateTicketStatusForItem,
} from "./update.js";
import {
  generateDerivedViewFiles,
  loadRegisterItems,
  VALID_BUILD_SCOPES,
  writeDerivedViews,
} from "./views.js";
import { specdojoRootDir } from "../shared/specdojo-config.js";
import { registerLifecyclePoolPath } from "./lifecycle-lock.js";
import { inCrossProjectWorktree, resolveCrossProjectMutationTarget } from "./cross-project.js";

export {
  PJR_ID_ALPHABET,
  PJR_ID_RE,
  TERMINAL_STATUSES_SET,
  toCell,
  VALID_PRIORITIES,
  VALID_DIFFICULTIES,
  VALID_STATUSES,
  VALID_TYPES,
  VALID_COMMIT_TYPES,
  COMMIT_SCOPE_RE,
  DEFAULT_ITEM_TYPE_COMMIT_TYPE_MAP,
  resolveItemCommitTypeAndScope,
  type CommitType,
  type ResolvedCommitTypeAndScope,
  type PjrDisplayItem,
  type PjrItem,
};
export {
  REGISTER_TOPIC_RE,
  VALID_TICKET_STATUSES,
  buildRegisterItemContent,
  extractTableHeading,
  findMarkdownReferenceFiles,
  generatePjrId,
  injectRegisterRows,
  parsePjrIndex,
  resolveRegisterPaths,
  type RegisterItemView,
  type RegisterPaths,
  type TableHeading,
  type TicketStatus,
} from "./core.js";
export {
  applyRegisterMigrationPlan,
  planRegisterMigration,
  type RegisterMigrationFile,
  type RegisterMigrationPlan,
} from "./migration.js";
export {
  findItemById,
  findRegisterItem,
  generateDerivedViewFiles,
  injectViewSlots,
  loadRegisterItems,
  sortByRegisteredDesc,
  type BuildScope,
  type ViewFile,
} from "./views.js";
export {
  parseTicketFilename,
  updateTicketFrontmatterStatus,
  updateTicketStatusForItem,
} from "./update.js";
export {
  planRenumber,
  planRetopic,
  renumberPjrItem,
  renumberReferences,
  renumberTicketContent,
  retopicPjrItem,
  ticketTopicFromFilename,
  type RenumberPlan,
  type RetopicPlan,
} from "./renumber.js";

// ================================
// Register item creation
// ================================

// register add が個票へ書き込む項目値。タイトル・説明は個票本文（H1・概要）へ、
// それ以外は frontmatter の登録項目フィールドへ入る。
export type RegisterAddFields = {
  type: string;
  title: string;
  description: string;
  priority: string;
  difficulty?: RegisterDifficulty;
  status: string;
  owner: string;
  // 起票・完了は UTC・RFC 3339・秒精度の日時。期限だけは暦日のまま扱う。
  registeredAt: string;
  due: string;
  completedAt: string;
  conclusion: string;
  approach?: Approach;
  targets?: string[];
  sources?: string[];
  derivedFrom?: string[];
  dependsOn?: string[];
  commitType?: string;
  commitScope?: string;
};

// 作成する個票ファイル名と割り当て ID を算出する純粋関数。I/O を持たず、
// フィールド検証と ID 衝突検知だけを行う。ID を省略するとランダムに採番する。
export function planRegisterItem(opts: {
  existingIds: Iterable<string>;
  explicitId?: string;
  fields: RegisterAddFields;
  // 個票ファイル名に使う topic slug。
  topic: string;
}): { assignedId: string; ticketFilename: string } {
  const existing = [...opts.existingIds];
  const assignedId = opts.explicitId?.trim() || generatePjrId(existing);

  validateFields({
    status: opts.fields.status,
    type: opts.fields.type,
    priority: opts.fields.priority,
    registeredAt: opts.fields.registeredAt,
    due: opts.fields.due,
    completedAt: opts.fields.completedAt,
    id: assignedId,
  });

  if (existing.includes(assignedId)) {
    throw new Error(`ID already exists in the project register: ${assignedId}`);
  }

  return { assignedId, ticketFilename: `${assignedId.toLowerCase()}-${opts.topic}.md` };
}

// ================================
// Error Handling & Shared Helpers
// ================================

// register 系コマンドのエラーは Unix/CLI の慣習に合わせて stderr へ書く。
// 正常出力（更新内容・生成パス・警告など）は stdout のまま残し、エラーだけを分離する。
export function printCommandError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(message + "\n");
  process.exitCode = 1;
}

function addProjectOption(cmd: Command): Command {
  return cmd.option("--project <projectId>", "Project id in specdojo.config.json");
}

type RegisterMutationOptions = {
  project?: string;
  by?: string;
  dryRun?: boolean;
  commit?: boolean;
  message?: string;
};

type RegisterMutationResult = {
  id: string;
  title: string;
};

type RegisterMutationContext = {
  paths: RegisterPaths;
  assertCommitTargetsClean: (targets: readonly string[]) => void;
};

function assertRegisterItemCommitTargetsClean(
  context: RegisterMutationContext,
  view: RegisterItemView,
): void {
  if (!view.ticketPath) return;
  context.assertCommitTargetsClean([
    view.ticketPath,
    registerEventFilePath(context.paths.projectRegisterPath, view.id),
  ]);
}

function addRegisterCommitOptions(cmd: Command): Command {
  return cmd
    .option(
      "--commit",
      "Take the register lifecycle lock, rebuild views, and commit only this command's changes",
      false,
    )
    .option("-m, --message <message>", "Override the register commit message");
}

const REGISTER_COMMIT_SUBJECT_MAX_LENGTH = 100;
const REGISTER_COMMIT_STABILIZATION_ATTEMPTS = 3;

function defaultRegisterCommitMessage(command: string, result: RegisterMutationResult): string {
  const prefix = `docs(register ${result.id}): ${command} `;
  const flatTitle = result.title.replace(/\s+/g, " ").trim();
  const subject = `${prefix}${flatTitle}`;
  if (subject.length <= REGISTER_COMMIT_SUBJECT_MAX_LENGTH) return subject;
  return `${subject.slice(0, REGISTER_COMMIT_SUBJECT_MAX_LENGTH - 1)}…`;
}

function rebuildRegisterViews(paths: RegisterPaths): void {
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
  writeDerivedViews(paths, "all");
}

function isGeneratedRegisterPath(repoRoot: string, paths: RegisterPaths, path: string): boolean {
  const normalized = path.replaceAll("\\", "/");
  const generatedPrefixes = [paths.generatedPath, paths.controlsGeneratedPath].map(
    (target) => `${repoRelative(repoRoot, target)}/`,
  );
  return (
    normalized === ".specdojo/doc-index.json" ||
    generatedPrefixes.some((prefix) => normalized.startsWith(prefix))
  );
}

function commitRegisterMutation(
  repoRoot: string,
  paths: RegisterPaths,
  command: string,
  result: RegisterMutationResult,
  preexisting: ReadonlySet<string>,
  message?: string,
): void {
  const changed = worktreeStatusPaths(repoRoot).filter(
    (path) => !preexisting.has(path) && !isGeneratedRegisterPath(repoRoot, paths, path),
  );
  if (changed.length === 0) {
    process.stdout.write(`No register changes to commit for ${result.id}.\n`);
    return;
  }

  stageCommitTargets(repoRoot, changed);
  const staged = gitResult(repoRoot, ["diff", "--cached", "--quiet", "--", ...changed]);
  if (staged.status === 0) {
    process.stdout.write(`No register changes to commit for ${result.id}.\n`);
    return;
  }
  if (staged.status !== 1) throw new Error("Failed to inspect staged register changes.");

  const commitMessage = message?.trim() || defaultRegisterCommitMessage(command, result);
  if (commitMessage === "") throw new Error("Register commit message must not be empty");
  gitOutput(repoRoot, ["commit", "-m", commitMessage, "--", ...changed]);

  for (let attempt = 0; attempt < REGISTER_COMMIT_STABILIZATION_ATTEMPTS; attempt++) {
    const remaining = worktreeStatusPaths(repoRoot).filter((path) => changed.includes(path));
    if (remaining.length === 0) {
      const sha = gitOutput(repoRoot, ["rev-parse", "--short", "HEAD"]).trim();
      process.stdout.write(`Committed: ${sha} (${result.id})\n`);
      return;
    }
    stageCommitTargets(repoRoot, remaining);
    gitOutput(repoRoot, ["commit", "--amend", "--no-edit", "--", ...remaining]);
  }

  const remaining = worktreeStatusPaths(repoRoot).filter((path) => changed.includes(path));
  if (remaining.length === 0) {
    const sha = gitOutput(repoRoot, ["rev-parse", "--short", "HEAD"]).trim();
    process.stdout.write(`Committed: ${sha} (${result.id})\n`);
    return;
  }
  throw new Error(
    `Register commit incomplete: target paths remained dirty after hook stabilization:\n` +
      remaining.map((path) => `  ${path}`).join("\n"),
  );
}

async function runRegisterMutationInCurrentWorktree(
  command: string,
  opts: RegisterMutationOptions,
  mutate: (context: RegisterMutationContext) => RegisterMutationResult,
  requireCleanRegister: boolean,
): Promise<void> {
  const paths = resolveRegisterPaths(opts);
  if (!opts.commit || opts.dryRun) {
    mutate({ paths, assertCommitTargetsClean: () => undefined });
    return;
  }

  const repoRoot = specdojoRootDir();
  if (!paths.executionPath) {
    throw new Error(`Execution path is not configured for project ${paths.projectId}`);
  }
  const mutex = new CrossProcessMutex(
    registerLifecyclePoolPath(paths.executionPath),
    {
      actor: registerEventActor(opts),
      label: `register ${command}`,
    },
    {
      onWait: () =>
        process.stdout.write("Waiting for the register lifecycle lock held by another operation\n"),
    },
  );

  await mutex.runExclusive(() => {
    const preexisting = new Set(worktreeStatusPaths(repoRoot));
    if (requireCleanRegister) {
      const registerPrefix = `${repoRelative(repoRoot, paths.projectRegisterPath)}/`;
      const dirtyRegisterPaths = [...preexisting].filter(
        (path) => path === registerPrefix.slice(0, -1) || path.startsWith(registerPrefix),
      );
      if (dirtyRegisterPaths.length > 0) {
        throw new Error(
          `Cannot add to project ${paths.projectId} because its register has uncommitted changes:\n` +
            dirtyRegisterPaths.map((path) => `  ${path}`).join("\n"),
        );
      }
    }
    const assertCommitTargetsClean = (targets: readonly string[]): void => {
      const overlapping = targets
        .map((target) => repoRelative(repoRoot, target))
        .filter((target) => preexisting.has(target));
      if (overlapping.length === 0) return;
      throw new Error(
        `Cannot use --commit because register targets already have uncommitted changes:\n` +
          overlapping.map((path) => `  ${path}`).join("\n"),
      );
    };
    const result = mutate({ paths, assertCommitTargetsClean });
    rebuildRegisterViews(paths);
    commitRegisterMutation(repoRoot, paths, command, result, preexisting, opts.message);
  });
}

async function runRegisterMutation(
  command: string,
  opts: RegisterMutationOptions,
  mutate: (context: RegisterMutationContext) => RegisterMutationResult,
): Promise<void> {
  try {
    const crossProjectTarget = resolveCrossProjectMutationTarget(command, opts);
    if (crossProjectTarget) {
      await inCrossProjectWorktree(crossProjectTarget, () =>
        runRegisterMutationInCurrentWorktree(command, opts, mutate, true),
      );
      return;
    }
    await runRegisterMutationInCurrentWorktree(command, opts, mutate, false);
  } catch (error) {
    printCommandError(error);
  }
}

// CLI で明示された日時オプションを UTC の秒精度へ正規化する。未指定は undefined を返し、
// 呼び出し側の既定値（実行時刻・プレースホルダ）へ委ねる。
function parseRegisterTimestampOption(
  value: string | undefined,
  label: string,
  placeholder: string,
): string | undefined {
  const text = value?.trim();
  if (!text) return undefined;
  if (text === placeholder) return placeholder;
  return normalizeRegisterTimestamp(text, label);
}

// git のパス限定（pathspec）はリポジトリルート起点の POSIX 表記で渡す。
function repoRelativePathspec(repoRoot: string, target: string): string {
  const value = relative(repoRoot, target);
  if (!value || value === ".." || value.startsWith(`..${sep}`)) {
    throw new Error(`Register directory is outside the repository root: ${target}`);
  }
  return value.split(sep).join("/");
}

// `--id PJR-AAAA PJR-BBBB` と `--id PJR-AAAA,PJR-BBBB` の両方を受け付ける。
function parseHistoryIds(values: string[] | undefined): string[] | undefined {
  if (!values || values.length === 0) return undefined;

  const ids: string[] = [];
  for (const value of values.flatMap((entry) => entry.split(/[\s,]+/))) {
    const id = value.trim().toUpperCase();
    if (id === "") continue;
    if (!PJR_ID_RE.test(id)) {
      throw new Error(`Invalid item ID: "${value}". Must match PJR-XXXX`);
    }
    if (!ids.includes(id)) ids.push(id);
  }
  return ids.length > 0 ? ids : undefined;
}

function actionFromLegacyHistory(
  kind: "added" | "updated" | "removed",
  changes: readonly { field: string; from: string; to: string }[],
): RegisterEventAction {
  if (kind === "added") return "add";
  const statusChange = changes.find((change) => change.field === "status");
  const status = statusChange?.to;
  if (
    statusChange &&
    TERMINAL_STATUSES_SET.has(statusChange.from) &&
    !TERMINAL_STATUSES_SET.has(statusChange.to)
  ) {
    return "reopen";
  }
  if (status === "in-progress") return "start";
  if (status === "waiting") return "wait";
  if (status === "review") return "review";
  if (status === "done" || status === "decided") return "close";
  if (status === "rejected") return "reject";
  if (status === "deferred") return "defer";
  const idChange = changes.some((change) => change.field === "id");
  if (idChange) return "renumber";
  return "update";
}

// Git 履歴から復元した1件の変更を Register event へ変換する。状態連鎖を成立させるための
// 接続処理を含むため、移行本体から切り離して単体で検証できるようにしている。
export function legacyHistoryEventToRegisterEvent(
  historyEvent: {
    id: string;
    commit: string;
    date: string;
    author: string;
    subject: string;
    kind: "added" | "updated" | "removed";
    changes: readonly { field: string; from: string; to: string }[];
  },
  context: { isFirst: boolean; currentStatus: string | null; fallbackStatus: string },
): RegisterEventV1 {
  // 過去の revision には、山括弧のエスケープ規約（PJR-B1SJ / PJR-ZWMH）より前に書かれた
  // `<domain>` のようなプレースホルダが素のまま残っている。event へ写すと個票 frontmatter の
  // 検証に落ちるため、現行の規約に合わせてインラインコードで囲んでから記録する。
  const escape = (text: string): string => inlineCodeAnglePlaceholders(text);
  const statusChange = historyEvent.changes.find((change) => change.field === "status");
  // 同じ個票が Git 履歴上で複数回 `added` として現れることがある。worktree のブランチで
  // 作成した個票が統合ブランチへ再度追加された場合などで、走査は両方の commit を見る。
  // 起票は状態連鎖の起点であり1件しか置けないため、2件目以降は追加ではなく更新として扱う。
  const kind = historyEvent.kind === "added" && !context.isFirst ? "updated" : historyEvent.kind;
  // 再追加の差分は「無」との比較になるため status の from が空になる。空のときは直前の
  // event の到達状態へ接続し、状態連鎖が途切れないようにする。
  const fromStatus: string | null =
    kind === "added" ? null : statusChange?.from || context.currentStatus || context.fallbackStatus;
  const toStatus: string = statusChange?.to ?? fromStatus ?? context.fallbackStatus;
  return {
    v: 1,
    id: deterministicRegisterEventId(
      `${historyEvent.commit}\0${historyEvent.id}\0${JSON.stringify(historyEvent.changes)}`,
    ),
    ts: normalizeRegisterTimestamp(historyEvent.date, "legacy event date"),
    action: actionFromLegacyHistory(kind, historyEvent.changes),
    actor: historyEvent.author.trim() || "git-author-unknown",
    from_status: fromStatus,
    to_status: toStatus,
    reason:
      escape(historyEvent.subject.trim()) || `migrated from ${historyEvent.commit.slice(0, 7)}`,
    // 再追加を更新として扱う場合、status の差分は「無 -> open」のまま残ると from_status /
    // to_status と食い違う。接続先の状態に合わせ、実際に変化していなければ差分から落とす。
    changes: historyEvent.changes.flatMap((change) => {
      const from = change.field === "status" ? (fromStatus ?? change.from) : change.from;
      if (change.field === "status" && from === change.to) return [];
      return [
        {
          field: change.field as RegisterEventV1["changes"][number]["field"],
          from: escape(from),
          to: escape(change.to),
        },
      ];
    }),
    legacy_commit: historyEvent.commit,
  };
}

function migrateEmbeddedRegisterEvents(
  paths: RegisterPaths,
  dryRun: boolean,
): { items: number; events: number } {
  let itemCount = 0;
  let eventCount = 0;
  for (const doc of loadRegisterItemDocs(paths.projectRegisterPath)) {
    const ticketContent = readFileSync(doc.path, "utf8");
    const embedded = readEmbeddedRegisterEvents(ticketContent, doc.filename);
    if (embedded.length === 0) continue;
    const eventPath = registerEventFilePath(paths.projectRegisterPath, doc.id);
    if (existsSync(eventPath)) {
      const existing = readRegisterEventsFromContent(readFileSync(eventPath, "utf8"), eventPath);
      if (JSON.stringify(existing) !== JSON.stringify(embedded)) {
        throw new Error(`${doc.filename}: embedded and external register events differ`);
      }
    }
    if (!dryRun) {
      atomicWriteFile(eventPath, serializeRegisterEvents(embedded));
      atomicWriteFile(doc.path, removeEmbeddedRegisterEvents(ticketContent));
    }
    itemCount++;
    eventCount += embedded.length;
  }
  return { items: itemCount, events: eventCount };
}

function migrateRegisterEventsFromGit(
  paths: RegisterPaths,
  dryRun: boolean,
): { items: number; events: number; skipped: number; available: boolean } {
  let history: ReturnType<typeof collectRegisterHistoryEvents>;
  try {
    history = collectRegisterHistoryEvents({
      repoRoot: specdojoRootDir(),
      registerPathspec: repoRelativePathspec(specdojoRootDir(), paths.projectRegisterPath),
      timeZone: paths.registerDateTimeZone,
    });
  } catch {
    return { items: 0, events: 0, skipped: 0, available: false };
  }

  const byId = new Map<string, typeof history>();
  for (const event of history) {
    if (event.source === "event" || event.kind === "removed") continue;
    const entries = byId.get(event.id) ?? [];
    entries.push(event);
    byId.set(event.id, entries);
  }

  let itemCount = 0;
  let eventCount = 0;
  let skipped = 0;
  for (const doc of loadRegisterItemDocs(paths.projectRegisterPath)) {
    const eventPath = registerEventFilePath(paths.projectRegisterPath, doc.id);
    const ticketContent = readFileSync(doc.path, "utf8");
    if (
      existsSync(eventPath) ||
      (dryRun && readEmbeddedRegisterEvents(ticketContent, doc.filename).length > 0)
    ) {
      skipped++;
      continue;
    }
    const legacyEvents = byId.get(doc.id) ?? [];
    if (legacyEvents.length === 0) continue;

    let currentStatus: string | null = null;
    let appended = 0;
    let eventContent: string | undefined;
    for (const historyEvent of legacyEvents) {
      const event = legacyHistoryEventToRegisterEvent(historyEvent, {
        isFirst: appended === 0,
        currentStatus,
        fallbackStatus: doc.item.status,
      });
      eventContent = appendRegisterEvent(eventContent, event);
      currentStatus = event.to_status;
      appended++;
    }
    if (appended === 0) continue;
    if (!dryRun && eventContent) atomicWriteFile(eventPath, eventContent);
    itemCount++;
    eventCount += appended;
  }
  return { items: itemCount, events: eventCount, skipped, available: true };
}

// ================================
// Command Registration
// ================================

const REGISTER_COMMAND_DEPENDENCIES: RegisterCommandDependencies = {
  registerTopicPattern: REGISTER_TOPIC_RE,
  validBuildScopes: VALID_BUILD_SCOPES,
  addProjectOption,
  addRegisterCommitOptions,
  applyItemUpdate,
  applyRegisterMigrationPlan,
  assertRegisterItemCommitTargetsClean,
  assertTerminalOperationAllowed,
  atomicWriteFile,
  buildRegisterItemContent,
  derivedTopicNeedsWarning,
  generateDerivedViewFiles,
  loadItemForUpdate,
  loadRegisterItems,
  migrateEmbeddedRegisterEvents,
  migrateRegisterEventsFromGit,
  parseHistoryIds,
  parseRegisterTimestampOption,
  planRegisterItem,
  planRegisterMigration,
  planRenumber,
  planRetopic,
  printCommandError,
  printDerivedTopicWarning,
  registerEventActor,
  renumberPjrItem,
  repoRelativePathspec,
  resolveRegisterPaths,
  retopicPjrItem,
  runRegisterMutation,
  slugify,
  ticketTopicFromFilename,
  updateTicketStatusForItem,
  writeDerivedViews,
};

export function registerRegisterCommands(program: Command): void {
  const reg = program.command("register").description("Project register (pjr-index.md) commands");
  registerCreateCommands(reg, REGISTER_COMMAND_DEPENDENCIES);
  registerTransitionCommands(reg, REGISTER_COMMAND_DEPENDENCIES);
  registerUpdateCommand(reg, REGISTER_COMMAND_DEPENDENCIES);
  registerMaintenanceCommands(reg, REGISTER_COMMAND_DEPENDENCIES);
}
