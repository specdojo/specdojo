import type { Command } from "commander";
import type { RegisterEventAction } from "./events.js";
import type { PjrItem, RegisterItemFieldUpdates } from "./item.js";

export type RegisterPaths = {
  projectId: string;
  projectRegisterPath: string;
  executionPath?: string;
  pjrIndexPath: string;
  generatedPath: string;
  controlsGeneratedPath: string;
  registerDateTimeZone: string;
};

export type RegisterItemView = {
  id: string;
  item: PjrItem;
  ticketPath?: string;
  ticketFilename?: string;
  source: "ticket" | "index";
};

export type RegisterAddFields = {
  type: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  owner: string;
  registeredAt: string;
  due: string;
  completedAt: string;
  conclusion: string;
};

export type BuildScope = "register" | "controls" | "all";
export type ViewFile = { path: string; content: string };

export type RegisterMigrationPlan = {
  sourceCount: number;
  createdCount: number;
  updatedCount: number;
  unchangedCount: number;
  files: { path: string; content: string; originalContent?: string }[];
  sourceIndexPath?: string;
  sourceIndexContent?: string;
};

export type RenumberPlan = {
  writes: { path: string; content: string }[];
  ticketRename?: { from: string; to: string };
};

export type RetopicPlan = {
  writes: { path: string; content: string }[];
  ticketRename: { from: string; to: string };
  fromTopic: string;
  fromDocId: string;
  toDocId: string;
};

export type RegisterMutationOptions = {
  project?: string;
  by?: string;
  dryRun?: boolean;
  commit?: boolean;
  message?: string;
};

export type RegisterMutationResult = { id: string; title: string };

export type RegisterMutationContext = {
  paths: RegisterPaths;
  assertCommitTargetsClean: (targets: readonly string[]) => void;
};

export type ApplyItemUpdateOptions = {
  paths: RegisterPaths;
  view: RegisterItemView;
  updated: PjrItem;
  dryRun: boolean;
  action?: string;
  title?: string;
  description?: string;
  fieldUpdates?: RegisterItemFieldUpdates;
  eventAction: RegisterEventAction;
  eventActor: string;
  eventReason: string;
};

export type RegisterCommandDependencies = {
  registerTopicPattern: RegExp;
  validBuildScopes: readonly BuildScope[];
  atomicWriteFile: (path: string, content: string) => void;
  addProjectOption: (cmd: Command) => Command;
  addRegisterCommitOptions: (cmd: Command) => Command;
  resolveRegisterPaths: (opts: { project?: string }) => RegisterPaths;
  printCommandError: (error: unknown) => void;
  generateDerivedViewFiles: (paths: RegisterPaths, scope: BuildScope) => ViewFile[];
  writeDerivedViews: (paths: RegisterPaths, scope: BuildScope) => ViewFile[];
  runRegisterMutation: (
    command: string,
    opts: RegisterMutationOptions,
    mutate: (context: RegisterMutationContext) => RegisterMutationResult,
  ) => Promise<void>;
  registerEventActor: (opts: { by?: string }) => string;
  loadRegisterItems: (paths: RegisterPaths) => RegisterItemView[];
  loadItemForUpdate: (
    paths: RegisterPaths,
    id: string,
    guard?: "require-active" | "require-terminal",
  ) => RegisterItemView;
  assertRegisterItemCommitTargetsClean: (
    context: RegisterMutationContext,
    view: RegisterItemView,
  ) => void;
  assertTerminalOperationAllowed: (item: PjrItem, command: "close" | "reject" | "defer") => void;
  applyItemUpdate: (opts: ApplyItemUpdateOptions) => void;
  updateTicketStatusForItem: (opts: {
    paths: RegisterPaths;
    item: PjrItem;
    targetStatus: "draft" | "ready" | "deprecated";
    dryRun: boolean;
  }) => void;
  parseRegisterTimestampOption: (
    value: string | undefined,
    label: string,
    placeholder: string,
  ) => string | undefined;
  slugify: (text: string) => string;
  derivedTopicNeedsWarning: (title: string, topic: string) => boolean;
  printDerivedTopicWarning: (topic: string) => void;
  planRegisterItem: (opts: {
    existingIds: Iterable<string>;
    explicitId?: string;
    fields: RegisterAddFields;
    topic: string;
  }) => { assignedId: string; ticketFilename: string };
  buildRegisterItemContent: (opts: {
    projectId: string;
    displayId: string;
    topic: string;
    fields: RegisterAddFields;
    templatePath: string;
  }) => string;
  ticketTopicFromFilename: (id: string, filename: string) => string | undefined;
  planRetopic: (paths: RegisterPaths, id: string, topic: string) => RetopicPlan;
  retopicPjrItem: (opts: {
    paths: RegisterPaths;
    id: string;
    topic: string;
    updated: PjrItem;
    fieldUpdates?: RegisterItemFieldUpdates;
    dryRun: boolean;
    title?: string;
    description?: string;
    actor?: string;
    reason?: string;
  }) => void;
  planRegisterMigration: (paths: RegisterPaths) => RegisterMigrationPlan;
  applyRegisterMigrationPlan: (plan: RegisterMigrationPlan) => void;
  migrateEmbeddedRegisterEvents: (
    paths: RegisterPaths,
    dryRun: boolean,
  ) => { items: number; events: number };
  migrateRegisterEventsFromGit: (
    paths: RegisterPaths,
    dryRun: boolean,
  ) => { items: number; events: number; skipped: number; available: boolean };
  parseHistoryIds: (values: string[] | undefined) => string[] | undefined;
  repoRelativePathspec: (repoRoot: string, target: string) => string;
  planRenumber: (paths: RegisterPaths, fromId: string, toId: string) => RenumberPlan;
  renumberPjrItem: (opts: {
    paths: RegisterPaths;
    fromId: string;
    toId: string;
    dryRun: boolean;
    actor?: string;
    reason?: string;
  }) => void;
};
