import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import type { Command } from "commander";
import { spawnSelf } from "../exec/run/mode-shared.js";
import {
  isQueueFinished,
  listQueueRecords,
  queueLockPath,
  queueStepDisplay,
  type QueueRecord,
} from "../exec/queue.js";
import { execRunJoinPoolPath, execRunLockPath } from "../exec/run/lock.js";
import { loadRegisterItems, resolveRegisterPaths } from "../register/register.js";
import {
  isLiveLock,
  livePoolHolders,
  readLockOwner,
  type LockOwner,
} from "../shared/cross-process-lock.js";
import { specdojoRootDir } from "../shared/specdojo-config.js";

/**
 * `specdojo orchestrator handoff`（PJR-5N1Q）。登録簿と exec の状態から、handoff の個票の
 * 「進行中」と「判断待ち」を組み立てて `register add --type handoff` で起票する。
 * register は exec を import しない決まりのため、組み立ては register の外に置く（PJR-5RY7）。
 */

export const HANDOFF_IN_PROGRESS_SECTION = "進行中";
export const HANDOFF_PENDING_SECTION = "判断待ち";

export type HandoffQueue = {
  queueId: string;
  state: string;
  done: number;
  total: number;
  current?: string;
  stoppedStep?: number;
  reason?: string;
};

export type HandoffRun = {
  // 主の exec run ロックは "primary"、`--join` の枠は slot 名。
  slot: string;
  actor: string;
  pid: number;
  acquiredAt: string;
  label?: string;
};

export type HandoffItem = {
  id: string;
  title: string;
  type: string;
  status: string;
  // 個票の project 修飾 doc id。個票の無い項目は undefined（ID だけを出す）。
  docId?: string;
};

export type HandoffSnapshot = {
  queues: HandoffQueue[];
  runs: HandoffRun[];
  items: HandoffItem[];
};

function itemReference(item: HandoffItem): string {
  const link = item.docId ? `[[${item.docId}|${item.id}]]` : item.id;
  return `${link} ${item.title}`;
}

function queueLine(queue: HandoffQueue): string {
  const parts = [queue.state, `${queue.done}/${queue.total}`];
  if (queue.current) parts.push(`現在: \`${queue.current}\``);
  if (queue.stoppedStep !== undefined) parts.push(`止まった段: ${queue.stoppedStep}`);
  if (queue.reason) parts.push(`理由: ${queue.reason}`);
  return `\`${queue.queueId}\`（${parts.join("、")}）`;
}

function runLine(run: HandoffRun): string {
  const parts = [`pid ${run.pid}`];
  if (run.acquiredAt) parts.push(`${run.acquiredAt} から`);
  if (run.label) parts.push(run.label);
  const slot = run.slot === "primary" ? "" : `（\`--join\` の ${run.slot}）`;
  return `\`${run.actor}\`${slot}（${parts.join("、")}）`;
}

function group(heading: string, lines: readonly string[]): string[] {
  if (lines.length === 0) return [];
  return [`- ${heading}:`, ...lines.map((line) => `  - ${line}`)];
}

function itemsWithStatus(snapshot: HandoffSnapshot, status: string): HandoffItem[] {
  return snapshot.items.filter((item) => item.status === status);
}

/** 「進行中」の章の本文。流している列・実行中の run・in-progress / review / waiting の項目。 */
export function buildInProgressSection(snapshot: HandoffSnapshot): string {
  const lines = [
    ...group("流している列（`exec queue`）", snapshot.queues.map(queueLine)),
    ...group("実行中の run（exec run のロック）", snapshot.runs.map(runLine)),
    ...group("in-progress の項目", itemsWithStatus(snapshot, "in-progress").map(itemReference)),
    ...group("review の項目", itemsWithStatus(snapshot, "review").map(itemReference)),
    ...group("waiting の項目", itemsWithStatus(snapshot, "waiting").map(itemReference)),
  ];
  return lines.length === 0 ? "-\n" : `${lines.join("\n")}\n`;
}

const OPEN_QUESTION_STATUSES = new Set(["open", "in-progress", "waiting", "review"]);

/** 「判断待ち」の章の本文。開いている question と waiting の項目への参照だけを置く。 */
export function buildPendingDecisionsSection(snapshot: HandoffSnapshot): string {
  const questions = snapshot.items.filter(
    (item) => item.type === "question" && OPEN_QUESTION_STATUSES.has(item.status),
  );
  const waiting = itemsWithStatus(snapshot, "waiting").filter((item) => item.type !== "question");
  const lines = [
    ...group("開いている question", questions.map(itemReference)),
    ...group("waiting の項目", waiting.map(itemReference)),
  ];
  return lines.length === 0 ? "-\n" : `${lines.join("\n")}\n`;
}

/** まだ受け取られていない（open の）handoff。 */
export function findOpenHandoffs(items: readonly HandoffItem[]): HandoffItem[] {
  return items.filter((item) => item.type === "handoff" && item.status === "open");
}

export function formatOpenHandoffNotice(openHandoffs: readonly HandoffItem[]): string {
  if (openHandoffs.length === 0) return "";
  const lines = openHandoffs.map((item) => `  ${item.id} ${item.title}`);
  return (
    `Open handoff already exists (read it and close it with register close --by <actor>):\n` +
    `${lines.join("\n")}\n`
  );
}

function toHandoffQueue(record: QueueRecord, lockDir: string): HandoffQueue {
  const done = record.steps.filter(
    (step) => step.status === "succeeded" || step.status === "failed",
  ).length;
  const running = record.steps.find((step) => step.status === "running");
  const state =
    record.state === "running" && !isLiveLock(lockDir)
      ? "running (runner not alive)"
      : record.state;
  return {
    queueId: record.queue_id,
    state,
    done,
    total: record.steps.length,
    ...(running ? { current: queueStepDisplay(running) } : {}),
    ...(record.stopped_step !== undefined ? { stoppedStep: record.stopped_step } : {}),
    ...(record.reason ? { reason: record.reason } : {}),
  };
}

function toHandoffRun(slot: string, owner: LockOwner): HandoffRun {
  return {
    slot,
    actor: owner.actor,
    pid: owner.pid,
    acquiredAt: owner.acquired_at_utc,
    ...(owner.label ? { label: owner.label } : {}),
  };
}

/** 登録簿・列・exec run のロックから引き継ぎの材料を集める。 */
export function collectHandoffSnapshot(opts: { project?: string }): {
  projectId: string;
  snapshot: HandoffSnapshot;
} {
  const paths = resolveRegisterPaths(opts);
  const executionPath = paths.executionPath;
  if (!executionPath) {
    throw new Error(`Execution path is not configured for project ${paths.projectId}`);
  }

  const { records } = listQueueRecords(executionPath);
  const queues = records
    .filter((record) => !isQueueFinished(record))
    .map((record) => toHandoffQueue(record, queueLockPath(executionPath, record.queue_id)));

  const runs: HandoffRun[] = [];
  const primary = execRunLockPath(executionPath);
  const primaryOwner = isLiveLock(primary) ? readLockOwner(primary) : null;
  if (primaryOwner) runs.push(toHandoffRun("primary", primaryOwner));
  for (const slot of livePoolHolders(execRunJoinPoolPath(executionPath))) {
    if (slot.owner) runs.push(toHandoffRun(slot.name, slot.owner));
  }

  const items = loadRegisterItems(paths).map((view) => ({
    id: view.id,
    title: view.item.title,
    type: view.item.type,
    status: view.item.status,
    ...(view.ticketFilename
      ? { docId: `${paths.projectId}:${basename(view.ticketFilename, ".md")}` }
      : {}),
  }));

  return { projectId: paths.projectId, snapshot: { queues, runs, items } };
}

export type OrchestratorHandoffOptions = {
  project?: string;
  title?: string;
  topic?: string;
  owner?: string;
  priority?: string;
  by?: string;
  reason?: string;
  dryRun?: boolean;
  commit?: boolean;
  message?: string[];
};

function defaultTimestamp(now: Date): { title: string; topic: string } {
  const iso = now.toISOString();
  const date = iso.slice(0, 10);
  const time = iso.slice(11, 16);
  return {
    title: `オーケストレーターの引き継ぎ（${date} ${time} UTC）`,
    topic: `orchestrator-handoff-${date.replaceAll("-", "")}-${time.replace(":", "")}`,
  };
}

/**
 * `register add --type handoff` に渡す引数。章の本文は sectionFiles のパスで渡す。
 * 一覧の説明は第 1 章（引き継ぎ元と先）の段落から読まれるため `--description` は渡さず、
 * 手で書く章を `_TODO_` のまま残す。
 */
export function buildHandoffRegisterAddArgs(
  opts: OrchestratorHandoffOptions,
  sectionFiles: { inProgress: string; pending: string },
  now: Date = new Date(),
): string[] {
  const defaults = defaultTimestamp(now);
  const args = [
    "register",
    "add",
    "--type",
    "handoff",
    "--title",
    opts.title?.trim() || defaults.title,
    "--topic",
    opts.topic?.trim() || defaults.topic,
    "--priority",
    opts.priority?.trim() || "medium",
    "--due",
    "-",
    "--section",
    HANDOFF_IN_PROGRESS_SECTION,
    "--section-file",
    sectionFiles.inProgress,
    "--section",
    HANDOFF_PENDING_SECTION,
    "--section-file",
    sectionFiles.pending,
  ];
  if (opts.owner?.trim()) args.push("--owner", opts.owner.trim());
  if (opts.by?.trim()) args.push("--by", opts.by.trim());
  if (opts.reason?.trim()) args.push("--reason", opts.reason.trim());
  if (opts.project?.trim()) args.push("--project", opts.project.trim());
  if (opts.dryRun) args.push("--dry-run");
  if (opts.commit) args.push("--commit");
  for (const paragraph of opts.message ?? []) args.push("-m", paragraph);
  return args;
}

export function runOrchestratorHandoff(
  opts: OrchestratorHandoffOptions,
  spawn: (args: string[], cwd: string) => boolean = spawnSelf,
): number {
  const { snapshot } = collectHandoffSnapshot(opts);
  const notice = formatOpenHandoffNotice(findOpenHandoffs(snapshot.items));
  if (notice) process.stderr.write(notice);

  const directory = mkdtempSync(join(tmpdir(), "specdojo-handoff-"));
  try {
    const sectionFiles = {
      inProgress: join(directory, "in-progress.md"),
      pending: join(directory, "pending.md"),
    };
    writeFileSync(sectionFiles.inProgress, buildInProgressSection(snapshot), "utf8");
    writeFileSync(sectionFiles.pending, buildPendingDecisionsSection(snapshot), "utf8");
    const ok = spawn(buildHandoffRegisterAddArgs(opts, sectionFiles), specdojoRootDir());
    return ok ? 0 : 1;
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function collectRepeatable(value: string, previous: string[] = []): string[] {
  return [...previous, value];
}

export function registerOrchestratorHandoffCommand(orchestrator: Command): void {
  orchestrator
    .command("handoff")
    .description(
      "Open a handoff item whose in-progress and pending sections are built from the register and exec state",
    )
    .option("--project <projectId>", "Project id in specdojo.config.json")
    .option("--title <title>", "Handoff title (defaults to the current UTC time)")
    .option("--topic <topic>", "Topic slug for the ticket filename")
    .option("--owner <owner>", "Owner or role")
    .option("--priority <priority>", "Priority: high | medium | low")
    .option("--by <actor>", "Actor recorded in the register event")
    .option("--reason <text>", "Reason recorded in the register event")
    .option("--dry-run", "Print the generated handoff without writing", false)
    .option("--commit", "Commit the new handoff through register add --commit", false)
    .option("-m, --message <message>", "Override the register commit message", collectRepeatable)
    .action((opts: OrchestratorHandoffOptions) => {
      try {
        const exitCode = runOrchestratorHandoff(opts);
        if (exitCode !== 0) process.exitCode = exitCode;
      } catch (error) {
        process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
        process.exitCode = 1;
      }
    });
}
