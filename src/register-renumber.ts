import { existsSync, readFileSync, unlinkSync } from "node:fs";
import { basename, join } from "node:path";
import {
  atomicWriteFile,
  findMarkdownReferenceFiles,
  formatTableRow,
  isTableSeparator,
  parsePjrIndex,
  parseTableCells,
  prepareRegisterEventFile,
  REGISTER_SECTION_RE,
  REGISTER_TOPIC_RE,
} from "./register-core.js";
import type { RegisterPaths } from "./register-command-types.js";
import {
  appendRegisterEvent,
  buildRegisterEvent,
  registerEventFilePath,
} from "./register-events.js";
import { parseSpecdojoDocument } from "./frontmatter-namespace.js";
import {
  applyRegisterItemFields,
  PJR_ID_RE,
  registerItemFieldsFromItem,
  REMOVE_REGISTER_ITEM_FIELD,
  setRegisterItemDescription,
  setRegisterItemTitle,
  ticketRefCell,
  toDisplayItem,
  type PjrDisplayItem,
  type PjrItem,
  type RegisterItemFieldUpdates,
} from "./register-item.js";
import { specdojoRootDir } from "./specdojo-config.js";
import { loadItemForUpdate } from "./register-update.js";
import { findRegisterItem, loadRegisterItems, writeDerivedViews } from "./register-views.js";

// ================================
// Renumber (duplicate ID recovery)
// ================================

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// 個票ファイル名 `pjr-XXXX-<topic>.md` から topic を取り出す。
// ID 接頭辞（`pjr-xxxx-`）と一致しない場合は undefined。
export function ticketTopicFromFilename(id: string, filename: string): string | undefined {
  const prefix = `${id.toLowerCase()}-`;
  const base = filename.replace(/\.md$/, "");
  if (!base.startsWith(prefix)) return undefined;
  const topic = base.slice(prefix.length);
  return topic.length > 0 ? topic : undefined;
}

// pjr-index の登録項目一覧テーブルで fromId の行を updated へ差し替える。
// replaceRowInContent は「同一 ID を書き戻す」用途で updated.id と一致する行を探すため、
// ID を変える再採番には fromId で行を特定する専用処理を使う。
function renumberRowInContent(content: string, fromId: string, updated: PjrDisplayItem): string {
  const newRow = formatTableRow(updated);
  const lines = content.split("\n");
  let inSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (REGISTER_SECTION_RE.test(line)) {
      inSection = true;
      continue;
    }
    if (inSection && /^## /.test(line)) break;
    if (!inSection) continue;
    if (!line.startsWith("|") || isTableSeparator(line)) continue;

    const cells = parseTableCells(line);
    if (cells.length >= 1 && cells[0] === fromId) {
      lines[i] = newRow;
      return lines.join("\n");
    }
  }

  throw new Error(`Item ${fromId} not found in table`);
}

// 個票本文の再採番。frontmatter の doc id 断片（`:pjr-XXXX-<topic>`）と
// H1 の表示 ID（`# PJR-XXXX ...`）を新しい ID へ更新する。
export function renumberTicketContent(
  content: string,
  fromId: string,
  toId: string,
  topic: string,
): string {
  const fromFragment = `:${fromId.toLowerCase()}-${topic}`;
  const toFragment = `:${toId.toLowerCase()}-${topic}`;
  let updated = content.split(fromFragment).join(toFragment);
  updated = updated.replace(
    new RegExp(`^(#\\s+)${escapeRegExp(fromId)}(\\s|$)`, "m"),
    (_m, prefix: string, tail: string) => `${prefix}${toId}${tail}`,
  );
  return updated;
}

// 他文書からの参照リンク（wikilink `[[<docId>|...]]`）と
// exec plan / result の `targets` に含まれる doc id を新しい doc id へ置き換える。
export function renumberReferences(
  content: string,
  fromDocId: string,
  toDocId: string,
): { content: string; changed: boolean } {
  if (!content.includes(fromDocId)) return { content, changed: false };
  return { content: content.split(fromDocId).join(toDocId), changed: true };
}

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

// topic 変更で書き換える全ファイルを事前に算出する。参照の更新範囲は renumber と
// 同じく docs/ja 配下（生成物を除く）とし、文書 ID を含む wikilink / targets を
// 付け替える。衝突や個票 ID の不整合は、書き込み前に検出する。
export function planRetopic(paths: RegisterPaths, id: string, topic: string): RetopicPlan {
  if (!PJR_ID_RE.test(id)) {
    throw new Error(`Invalid ID: "${id}". Must match PJR-XXXX (e.g., PJR-0001)`);
  }
  if (!REGISTER_TOPIC_RE.test(topic)) {
    throw new Error(
      `Invalid topic: "${topic}". Must use lowercase letters, numbers, and single hyphens`,
    );
  }

  const view = loadItemForUpdate(paths, id);
  const oldFilename = view.ticketFilename;
  if (!oldFilename || !view.ticketPath) {
    throw new Error(`Item ${id} has no ticket file to change topic`);
  }
  const fromTopic = ticketTopicFromFilename(id, oldFilename);
  if (!fromTopic) {
    throw new Error(
      `Ticket filename "${oldFilename}" does not match ID "${id}"; fix it before changing topic.`,
    );
  }

  const fromDocId = `${paths.projectId}:${oldFilename.replace(/\.md$/, "")}`;
  const newFilename = `${id.toLowerCase()}-${topic}.md`;
  const toDocId = `${paths.projectId}:${newFilename.replace(/\.md$/, "")}`;
  const newTicketPath = join(paths.projectRegisterPath, newFilename);
  const ticketContent = readFileSync(view.ticketPath, "utf8");
  const currentDocId = parseSpecdojoDocument(ticketContent).data.id;
  if (currentDocId !== fromDocId) {
    throw new Error(
      `Ticket ${oldFilename} must have frontmatter id "${fromDocId}" before changing topic`,
    );
  }
  if (existsSync(newTicketPath)) {
    throw new Error(`Target ticket file already exists: ${newTicketPath}`);
  }

  const writes: RetopicPlan["writes"] = [
    {
      path: newTicketPath,
      content: renumberReferences(ticketContent, fromDocId, toDocId).content,
    },
  ];
  const root = specdojoRootDir();
  const referenceFiles = findMarkdownReferenceFiles(root);

  for (const absPath of referenceFiles) {
    if (absPath === view.ticketPath) continue;
    const content = readFileSync(absPath, "utf8");
    const referenceUpdate = renumberReferences(content, fromDocId, toDocId);
    // 旧構成の pjr-index に登録項目行が残っている場合は、文書 ID だけでなく個票リンクの
    // ファイル名も追随させる。現行の generated ビューは適用後に再生成する。
    const replaced =
      absPath === paths.pjrIndexPath
        ? referenceUpdate.content.split(oldFilename).join(newFilename)
        : referenceUpdate.content;
    if (referenceUpdate.changed || replaced !== content) {
      writes.push({ path: absPath, content: replaced });
    }
  }

  return {
    writes,
    ticketRename: { from: view.ticketPath, to: newTicketPath },
    fromTopic,
    fromDocId,
    toDocId,
  };
}

export function retopicPjrItem(opts: {
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
}): void {
  const plan = planRetopic(opts.paths, opts.id, opts.topic);
  const ticketWrite = plan.writes.find((write) => write.path === plan.ticketRename.to);
  if (!ticketWrite) throw new Error(`Retopiced ticket content not found: ${plan.ticketRename.to}`);

  if (opts.title !== undefined)
    ticketWrite.content = setRegisterItemTitle(ticketWrite.content, opts.title);
  if (opts.description !== undefined) {
    ticketWrite.content = setRegisterItemDescription(ticketWrite.content, opts.description);
  }
  ticketWrite.content = applyRegisterItemFields(ticketWrite.content, {
    ...registerItemFieldsFromItem(opts.updated),
    ...(opts.updated.status === "waiting" ? {} : { block_reason: REMOVE_REGISTER_ITEM_FIELD }),
    ...opts.fieldUpdates,
  });

  if (opts.dryRun) {
    process.stdout.write(`Would change topic for ${opts.id}: ${plan.fromTopic} → ${opts.topic}\n`);
    process.stdout.write(`  Rename: ${plan.ticketRename.from} → ${plan.ticketRename.to}\n`);
    for (const write of plan.writes) process.stdout.write(`  Update: ${write.path}\n`);
    return;
  }

  const beforeContent = readFileSync(plan.ticketRename.from, "utf8");
  const event = buildRegisterEvent({
    beforeContent,
    afterContent: ticketWrite.content,
    filename: basename(plan.ticketRename.to),
    timeZone: opts.paths.registerDateTimeZone,
    action: "update",
    actor: opts.actor?.trim() || "manual",
    reason: opts.reason?.trim() || `topic changed from ${plan.fromTopic} to ${opts.topic}`,
    extraChanges: [{ field: "id", from: plan.fromDocId, to: plan.toDocId }],
  });
  if (!event) throw new Error(`Failed to build topic update event for ${opts.id}`);
  const eventWrite = prepareRegisterEventFile(opts.paths.projectRegisterPath, opts.id, event);
  for (const write of plan.writes) {
    atomicWriteFile(write.path, write.content);
    process.stdout.write(`Updated: ${write.path}\n`);
  }
  unlinkSync(plan.ticketRename.from);
  process.stdout.write(`Renamed: ${plan.ticketRename.from} → ${plan.ticketRename.to}\n`);
  atomicWriteFile(eventWrite.path, eventWrite.content);
  process.stdout.write(`Updated: ${eventWrite.path}\n`);
  for (const view of writeDerivedViews(opts.paths, "all")) {
    process.stdout.write(`Generated: ${view.path}\n`);
  }
}

// 再採番で書き換える全ファイルを事前に算出する。
// 途中で衝突・不整合を検出したら例外を投げ、部分適用が起きないようにする。
export function planRenumber(paths: RegisterPaths, fromId: string, toId: string): RenumberPlan {
  const views = loadRegisterItems(paths);

  const fromView = findRegisterItem(views, fromId);
  if (!fromView) {
    throw new Error(`Item not found: ${fromId}`);
  }
  if (findRegisterItem(views, toId)) {
    throw new Error(`Target ID already exists: ${toId}`);
  }
  const fromItem = fromView.item;

  const writes: RenumberPlan["writes"] = [];
  let ticketRename: RenumberPlan["ticketRename"];
  // pjr-index に旧 ID の行が残っている場合だけ、その行も新しい ID へ差し替える。
  const hasIndexRow =
    existsSync(paths.pjrIndexPath) &&
    parsePjrIndex(readFileSync(paths.pjrIndexPath, "utf8"), paths.registerDateTimeZone).some(
      (it) => it.id === fromId,
    );
  let newIndexContent = hasIndexRow ? readFileSync(paths.pjrIndexPath, "utf8") : "";

  const oldFilename = fromView.ticketFilename;
  let fromDocId: string | undefined;
  let toDocId: string | undefined;

  if (oldFilename) {
    const topic = ticketTopicFromFilename(fromId, oldFilename);
    if (!topic) {
      throw new Error(
        `Ticket filename "${oldFilename}" does not match ID "${fromId}"; ` +
          `fix the ticket link before renumbering.`,
      );
    }
    const newFilename = `${toId.toLowerCase()}-${topic}.md`;
    const oldTicketPath = join(paths.projectRegisterPath, oldFilename);
    const newTicketPath = join(paths.projectRegisterPath, newFilename);
    if (!existsSync(oldTicketPath)) {
      throw new Error(`Ticket file not found: ${oldTicketPath}`);
    }
    if (existsSync(newTicketPath)) {
      throw new Error(`Target ticket file already exists: ${newTicketPath}`);
    }

    fromDocId = `${paths.projectId}:${oldFilename.replace(/\.md$/, "")}`;
    toDocId = `${paths.projectId}:${newFilename.replace(/\.md$/, "")}`;

    const ticketContent = readFileSync(oldTicketPath, "utf8");
    writes.push({
      path: newTicketPath,
      content: renumberTicketContent(ticketContent, fromId, toId, topic),
    });
    ticketRename = { from: oldTicketPath, to: newTicketPath };

    if (hasIndexRow) {
      const updated: PjrItem = { ...fromItem, id: toId, ticket: ticketRefCell(newFilename) };
      newIndexContent = renumberRowInContent(
        newIndexContent,
        fromId,
        toDisplayItem(updated, paths.registerDateTimeZone),
      );
    }
  } else if (hasIndexRow) {
    const updated: PjrItem = { ...fromItem, id: toId };
    newIndexContent = renumberRowInContent(
      newIndexContent,
      fromId,
      toDisplayItem(updated, paths.registerDateTimeZone),
    );
  }

  if (hasIndexRow) {
    writes.push({ path: paths.pjrIndexPath, content: newIndexContent });
  }

  // 参照リンク・targets の付け替え（doc id を持つ個票がある場合のみ）。
  if (fromDocId && toDocId) {
    const root = specdojoRootDir();
    const referenceFiles = findMarkdownReferenceFiles(root);

    for (const absPath of referenceFiles) {
      if (absPath === paths.pjrIndexPath) continue;
      if (ticketRename && absPath === ticketRename.from) continue;
      const content = readFileSync(absPath, "utf8");
      const { content: replaced, changed } = renumberReferences(content, fromDocId, toDocId);
      if (changed) writes.push({ path: absPath, content: replaced });
    }
  }

  return { writes, ticketRename };
}

export function renumberPjrItem(opts: {
  paths: RegisterPaths;
  fromId: string;
  toId: string;
  dryRun: boolean;
  actor?: string;
  reason?: string;
}): void {
  const { paths, fromId, toId, dryRun } = opts;

  for (const id of [fromId, toId]) {
    if (!PJR_ID_RE.test(id)) {
      throw new Error(`Invalid ID: "${id}". Must match PJR-XXXX (e.g., PJR-0001)`);
    }
  }
  if (fromId === toId) {
    throw new Error(`--id and --to must differ (both are ${fromId})`);
  }

  const plan = planRenumber(paths, fromId, toId);

  if (!dryRun && plan.ticketRename) {
    const ticketWrite = plan.writes.find((write) => write.path === plan.ticketRename?.to);
    if (!ticketWrite)
      throw new Error(`Renumbered ticket content not found: ${plan.ticketRename.to}`);
    const beforeContent = readFileSync(plan.ticketRename.from, "utf8");
    const event = buildRegisterEvent({
      beforeContent,
      afterContent: ticketWrite.content,
      filename: basename(plan.ticketRename.to),
      timeZone: paths.registerDateTimeZone,
      action: "renumber",
      actor: opts.actor?.trim() || "manual",
      reason: opts.reason?.trim() || `renumbered ${fromId} to ${toId}`,
      extraChanges: [{ field: "id", from: fromId, to: toId }],
    });
    if (!event) throw new Error(`Failed to build renumber event for ${fromId}`);
    const oldEventPath = registerEventFilePath(paths.projectRegisterPath, fromId);
    const newEventPath = registerEventFilePath(paths.projectRegisterPath, toId);
    if (!existsSync(oldEventPath)) {
      throw new Error(`Register event file not found: ${oldEventPath}`);
    }
    if (existsSync(newEventPath)) {
      throw new Error(`Target register event file already exists: ${newEventPath}`);
    }
    const eventContent = appendRegisterEvent(readFileSync(oldEventPath, "utf8"), event);
    plan.writes.push({ path: newEventPath, content: eventContent });
  }

  if (dryRun) {
    process.stdout.write(`Would renumber ${fromId} → ${toId}:\n`);
    if (plan.ticketRename) {
      process.stdout.write(`  Rename: ${plan.ticketRename.from} → ${plan.ticketRename.to}\n`);
    }
    for (const write of plan.writes) {
      process.stdout.write(`  Update: ${write.path}\n`);
    }
    return;
  }

  for (const write of plan.writes) {
    atomicWriteFile(write.path, write.content);
    process.stdout.write(`Updated: ${write.path}\n`);
  }
  if (plan.ticketRename) {
    unlinkSync(plan.ticketRename.from);
    process.stdout.write(`Renamed: ${plan.ticketRename.from} → ${plan.ticketRename.to}\n`);
    const oldEventPath = registerEventFilePath(paths.projectRegisterPath, fromId);
    unlinkSync(oldEventPath);
    process.stdout.write(
      `Renamed: ${oldEventPath} → ${registerEventFilePath(paths.projectRegisterPath, toId)}\n`,
    );
  }
  for (const view of writeDerivedViews(paths, "all")) {
    process.stdout.write(`Generated: ${view.path}\n`);
  }
}
