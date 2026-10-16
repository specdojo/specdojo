import { existsSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { atomicWriteFile, prepareRegisterEventFile, type TicketStatus } from "./register-core.js";
import type { RegisterItemView, RegisterPaths } from "./register-command-types.js";
import { buildRegisterEvent, type RegisterEventAction } from "./register-events.js";
import { parseSpecdojoDocument } from "./frontmatter-namespace.js";
import {
  applyRegisterItemFields,
  formatRegisterItemFields,
  PJR_ID_RE,
  registerItemFieldsFromItem,
  REMOVE_REGISTER_ITEM_FIELD,
  setRegisterItemDescription,
  setRegisterItemTitle,
  TERMINAL_STATUSES_SET,
  type PjrItem,
  type RegisterItemFieldUpdates,
} from "./register-item.js";
import { findRegisterItem, loadRegisterItems, writeDerivedViews } from "./register-views.js";

// 更新対象の登録項目を解決する。個票ファイルが無い項目は、書き込み先（正本）が無いため
// 更新できない。移行が済んでいない旧項目に当たった場合は、個票化を促して中断する。
export function loadItemForUpdate(
  paths: RegisterPaths,
  id: string,
  guard?: "require-active" | "require-terminal",
): RegisterItemView {
  if (!PJR_ID_RE.test(id)) {
    throw new Error(`Invalid ID: "${id}". Must match PJR-XXXX (e.g., PJR-0001)`);
  }
  const view = findRegisterItem(loadRegisterItems(paths), id);
  if (!view) {
    throw new Error(`Item not found: ${id} (searched ${paths.projectRegisterPath})`);
  }
  if (!view.ticketPath) {
    throw new Error(
      `Item ${id} has no ticket file under ${paths.projectRegisterPath}.\n` +
        `The register item frontmatter is the source of truth; create the ticket file ` +
        `(pjr-${id.slice("PJR-".length).toLowerCase()}-<topic>.md) before updating the item.`,
    );
  }
  if (guard === "require-active" && TERMINAL_STATUSES_SET.has(view.item.status)) {
    throw new Error(
      `Cannot change ${id}: status is "${view.item.status}" (terminal). Use "register reopen" first.`,
    );
  }
  if (guard === "require-terminal" && !TERMINAL_STATUSES_SET.has(view.item.status)) {
    throw new Error(`Cannot reopen ${id}: status is "${view.item.status}" (already active).`);
  }
  return view;
}

type TerminalRegisterCommand = "close" | "reject" | "defer";

// note は未対応項目ではなく、open のまま更新し続ける記録である。終端操作による書き込みを
// 始める前に共通ガードを通し、対応・回答・判断が必要な場合は別項目の起票へ誘導する。
export function assertTerminalOperationAllowed(
  item: PjrItem,
  command: TerminalRegisterCommand,
): void {
  if (item.type !== "note") return;
  throw new Error(
    `Cannot ${command} ${item.id}: item type "note" is non-terminal and must remain open. ` +
      `Create a todo, question, decision, or another appropriate item type when action, ` +
      `an answer, or a decision is required.`,
  );
}

// 更新後の項目値を個票 frontmatter へ書き戻す。未移行（source: index）の項目は、
// 行から読んだ値も含めて全フィールドを書き込み、その場で個票正本へ移行する。
// タイトル・説明は frontmatter に持たないため、H1 と概要段落を書き換える。
export function applyItemUpdate(opts: {
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
}): void {
  const ticketPath = opts.view.ticketPath;
  if (!ticketPath) {
    throw new Error(`Item ${opts.view.id} has no ticket file to update`);
  }

  const label = opts.action ?? `→ ${opts.updated.status}`;
  const updates: RegisterItemFieldUpdates = {
    ...registerItemFieldsFromItem(opts.updated),
    // block_reason は waiting の現在値にだけ属する。waiting 以外への遷移や、
    // stale な個票に対する更新では削除し、削除前の値は event の差分へ残す。
    ...(opts.updated.status === "waiting" ? {} : { block_reason: REMOVE_REGISTER_ITEM_FIELD }),
    ...opts.fieldUpdates,
  };

  if (opts.dryRun) {
    const lines = [`Would update ${ticketPath} (${opts.updated.id} ${label}):`];
    if (opts.title !== undefined) lines.push(`  title: ${opts.title}`);
    if (opts.description !== undefined) lines.push(`  description: ${opts.description}`);
    lines.push(formatRegisterItemFields(updates));
    process.stdout.write(`${lines.join("\n")}\n`);
    return;
  }

  const beforeContent = readFileSync(ticketPath, "utf8");
  let content = beforeContent;
  if (opts.title !== undefined) content = setRegisterItemTitle(content, opts.title);
  if (opts.description !== undefined) {
    content = setRegisterItemDescription(content, opts.description);
  }
  content = applyRegisterItemFields(content, updates);
  const event = buildRegisterEvent({
    beforeContent,
    afterContent: content,
    filename: basename(ticketPath),
    timeZone: opts.paths.registerDateTimeZone,
    action: opts.eventAction,
    actor: opts.eventActor,
    reason: opts.eventReason,
  });
  if (!event) {
    process.stdout.write(`Unchanged: ${ticketPath} (${opts.updated.id})\n`);
    return;
  }
  const eventWrite = prepareRegisterEventFile(
    opts.paths.projectRegisterPath,
    opts.updated.id,
    event,
  );
  atomicWriteFile(ticketPath, content);
  atomicWriteFile(eventWrite.path, eventWrite.content);
  process.stdout.write(`Updated: ${ticketPath} (${opts.updated.id} ${label})\n`);
  process.stdout.write(`Updated: ${eventWrite.path}\n`);

  for (const view of writeDerivedViews(opts.paths, "all")) {
    process.stdout.write(`Generated: ${view.path}\n`);
  }
}

// ================================
// Ticket Frontmatter Status
// ================================

const FRONTMATTER_BLOCK_RE = /^---\r?\n([\s\S]*?)\r?\n---/;

// pjr-index の「個票」セル（例: `[pjr-0001-topic](./pjr-0001-topic.md)`）から
// project-register ディレクトリ相対のファイル名を取り出す。個票なし（`-`）は undefined。
export function parseTicketFilename(ticketCell: string): string | undefined {
  if (ticketCell === "-" || ticketCell.trim() === "") return undefined;
  const match = ticketCell.match(/\]\(\.\/([^)]+\.md)\)/);
  return match ? match[1] : undefined;
}

function stripFencedCode(markdown: string): string {
  let fence: { marker: "`" | "~"; length: number } | undefined;

  return markdown
    .split(/(?<=\n)/)
    .map((lineWithEnding) => {
      const line = lineWithEnding.replace(/\r?\n$/, "");
      const lineEnding = lineWithEnding.slice(line.length);

      if (fence) {
        const closing = line.match(/^ {0,3}(`+|~+)[ \t]*$/);
        if (closing && closing[1][0] === fence.marker && closing[1].length >= fence.length) {
          fence = undefined;
        }
        return lineEnding;
      }

      const opening = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
      if (opening && !(opening[1][0] === "`" && opening[2].includes("`"))) {
        fence = { marker: opening[1][0] as "`" | "~", length: opening[1].length };
        return lineEnding;
      }

      return lineWithEnding;
    })
    .join("");
}

function isEscapedMarkdownCharacter(markdown: string, index: number): boolean {
  let backslashes = 0;
  for (let cursor = index - 1; cursor >= 0 && markdown[cursor] === "\\"; cursor--) {
    backslashes++;
  }
  return backslashes % 2 === 1;
}

function findClosingBacktickRun(markdown: string, start: number, length: number): number {
  for (let cursor = start; cursor < markdown.length;) {
    if (markdown[cursor] !== "`") {
      cursor++;
      continue;
    }

    const runStart = cursor;
    while (markdown[cursor] === "`") cursor++;
    if (cursor - runStart === length && !isEscapedMarkdownCharacter(markdown, runStart)) {
      return runStart;
    }
  }
  return -1;
}

function stripInlineCode(markdown: string): string {
  let result = "";

  for (let cursor = 0; cursor < markdown.length;) {
    if (markdown[cursor] !== "`" || isEscapedMarkdownCharacter(markdown, cursor)) {
      result += markdown[cursor];
      cursor++;
      continue;
    }

    const runStart = cursor;
    while (markdown[cursor] === "`") cursor++;
    const runLength = cursor - runStart;
    const closing = findClosingBacktickRun(markdown, cursor, runLength);
    if (closing === -1) {
      result += markdown.slice(runStart, cursor);
      continue;
    }

    cursor = closing + runLength;
  }

  return result;
}

// type 固有の必須節が固まっているかの判定。見出し文言（言語依存）に依存せず、
// Markdown のコード範囲を除く本文に記入プレースホルダ `_TODO_` が残っていれば
// 「未確定」とみなす。コード範囲は記法の説明や例示に使えるため判定対象外とする。
function ticketBodyHasTodo(content: string): boolean {
  const { body } = parseSpecdojoDocument(content);
  return stripInlineCode(stripFencedCode(body)).includes("_TODO_");
}

// 個票 Frontmatter（specdojo 名前空間）内の `status:` 行を targetStatus へ書き換える。
// 既に目的の値なら changed=false を返し、内容を変えない（冪等）。
export function updateTicketFrontmatterStatus(
  content: string,
  targetStatus: TicketStatus,
): { content: string; changed: boolean } {
  const block = content.match(FRONTMATTER_BLOCK_RE);
  if (!block) {
    throw new Error("frontmatter not found in ticket file");
  }
  const statusLineRe = /^(\s*status:[ \t]*)(\S+)(.*)$/m;
  const statusLine = block[1].match(statusLineRe);
  if (!statusLine) {
    throw new Error("status field not found in ticket frontmatter");
  }
  if (statusLine[2] === targetStatus) {
    return { content, changed: false };
  }
  const newFrontmatter = block[1].replace(
    statusLineRe,
    (_m, prefix: string, _old: string, suffix: string) => `${prefix}${targetStatus}${suffix}`,
  );
  const newContent = content.replace(block[1], () => newFrontmatter);
  return { content: newContent, changed: true };
}

// close / reject に伴い、対象個票の Frontmatter `status` を昇格・廃止する。
// - 個票なし（個票列が `-`）や個票ファイル不在は、エラーにせず処理状態のみで完了する。
// - `ready` への昇格は必須節に `_TODO_` が残っていないことを条件とし、残る場合は警告して据え置く。
export function updateTicketStatusForItem(opts: {
  paths: RegisterPaths;
  item: PjrItem;
  targetStatus: TicketStatus;
  dryRun: boolean;
}): void {
  const filename = parseTicketFilename(opts.item.ticket);
  if (!filename) return;

  const ticketPath = join(opts.paths.projectRegisterPath, filename);
  if (!existsSync(ticketPath)) {
    process.stdout.write(
      `Warning: ticket file not found; skipped status update for ${opts.item.id}: ${ticketPath}\n`,
    );
    return;
  }

  const content = readFileSync(ticketPath, "utf8");

  if (opts.targetStatus === "ready" && ticketBodyHasTodo(content)) {
    process.stdout.write(
      `Warning: ${opts.item.id} ticket has unresolved _TODO_; kept as draft (not promoted to ready): ${ticketPath}\n`,
    );
    return;
  }

  const { content: updated, changed } = updateTicketFrontmatterStatus(content, opts.targetStatus);
  if (!changed) {
    if (opts.dryRun) {
      process.stdout.write(`Ticket already ${opts.targetStatus}: ${ticketPath}\n`);
    }
    return;
  }

  if (opts.dryRun) {
    process.stdout.write(`Would update ticket status → ${opts.targetStatus}: ${ticketPath}\n`);
    return;
  }

  atomicWriteFile(ticketPath, updated);
  process.stdout.write(`Updated ticket status → ${opts.targetStatus}: ${ticketPath}\n`);
}
