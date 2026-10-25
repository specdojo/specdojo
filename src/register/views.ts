import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, sep } from "node:path";
import {
  extractTableHeading,
  formatTableRow,
  injectRegisterRows,
  parsePjrIndex,
  REGISTER_INDEX_TEMPLATE,
  type TableHeading,
} from "./core.js";
import type { RegisterItemView, RegisterPaths } from "./command-types.js";
import { readRegisterEventsFromContent, registerEventFilePath } from "./events.js";
import {
  compareRegisterItemIds,
  loadRegisterItemDocs,
  ticketRefCell,
  toCell,
  toDisplayItem,
  VALID_PRIORITIES,
  VALID_STATUSES,
  type PjrDisplayItem,
  type PjrItem,
} from "./item.js";
import { flattenTemplateFrontmatter } from "../docs/template-frontmatter.js";
import { resolveSpecdojoTemplatePath } from "../docs/template-resolution.js";
import { collectDerivedRegisterRelations } from "./derivation.js";

// ================================
// Derived View Generation
// ================================

function adjustTicketLink(ticket: string, prefix: string): string {
  if (ticket === "-") return ticket;
  return ticket.replace(/\]\(\.\//g, `](${prefix}`);
}

function rebaseItems(items: PjrDisplayItem[], prefix: string): PjrDisplayItem[] {
  return items.map((it) => ({ ...it, ticket: adjustTicketLink(it.ticket, prefix) }));
}

function makeTable(items: PjrDisplayItem[], heading: TableHeading): string {
  const rows = items.map(formatTableRow);
  return [heading.header, heading.separator, ...rows].join("\n");
}

type ViewGroup = { label: string; items: PjrDisplayItem[] };

// 派生ビューの外枠（H1・note・章見出し・frontmatter）は template が所有する。
// template をロードして生成物形へ平坦化し、`_PROJECT_ID_` を実プロジェクト ID へ置換する。
function loadViewTemplate(templateFileName: string, projectId: string): string {
  const templatePath = resolveSpecdojoTemplatePath(templateFileName);
  const raw = readFileSync(templatePath, "utf8");
  return flattenTemplateFrontmatter(raw).replace(/_PROJECT_ID_/g, projectId);
}

// template 本文中の `<!-- specdojo:view-slot=<key> -->` 行を生成テーブルへ置換する。
// slot と提供テーブルは相互に過不足がないことを検証し、template の不整合を早期に検出する。
export function injectViewSlots(content: string, slots: Record<string, string>): string {
  const used = new Set<string>();
  const injected = content.replace(
    /^<!-- specdojo:view-slot=([a-z-]+) -->$/gm,
    (_match, key: string) => {
      if (!(key in slots)) {
        throw new Error(`Unknown view-slot in template: ${key}`);
      }
      used.add(key);
      return slots[key];
    },
  );
  const missing = Object.keys(slots).filter((key) => !used.has(key));
  if (missing.length > 0) {
    throw new Error(`View-slot not found in template: ${missing.join(", ")}`);
  }
  return injected;
}

// グループ（状態別・優先度別・担当者別など）を `### <chapter>.<n>. <label>` 見出し付きの
// テーブル群へ整形する。章見出しラベルは template 側が持つため、ここでは番号と値のみ扱う。
// 項目がない場合は空文字列を差し込むと前後の空行が重なり MD012 に当たるため、「該当なし」を書く。
function renderGroupedTables(groups: ViewGroup[], chapter: number, heading: TableHeading): string {
  if (groups.length === 0) return "該当なし";
  return groups
    .map((group, index) =>
      [
        `### ${chapter}.${index + 1}. ${group.label}`,
        "",
        "<!-- prettier-ignore -->",
        makeTable(group.items, heading),
      ].join("\n"),
    )
    .join("\n\n");
}

// ビューの行順に使う起票時刻を解決する。`registered` は移行前の項目で `_TODO_` になるため、
// 追記型イベントの `add` の `ts` で補う。表示 ID はランダムな 4 文字で、ID 順には時系列の意味が
// ないため、並びの根拠は時刻に置く。
function resolveRegisteredOrder(
  item: PjrDisplayItem,
  paths: RegisterPaths,
  cache: Map<string, string>,
): string {
  const cached = cache.get(item.id);
  if (cached !== undefined) return cached;

  let value = "";
  if (item.registered && item.registered !== "_TODO_" && item.registered !== "-") {
    value = item.registered;
  } else {
    const eventPath = registerEventFilePath(paths.projectRegisterPath, item.id);
    if (existsSync(eventPath)) {
      const events = readRegisterEventsFromContent(readFileSync(eventPath, "utf8"), eventPath);
      const added = events.find((event) => event.action === "add");
      if (added?.ts) value = added.ts;
    }
  }
  cache.set(item.id, value);
  return value;
}

// 新しい起票を先頭へ置く。時刻が並ぶ場合と時刻を解決できない場合は ID で安定させる。
// 時刻を解決できない項目は末尾へ送り、解決できた項目の並びを乱さない。
export function sortByRegisteredDesc(
  items: PjrDisplayItem[],
  paths: RegisterPaths,
): PjrDisplayItem[] {
  const cache = new Map<string, string>();
  return [...items].sort((a, b) => {
    const left = resolveRegisteredOrder(a, paths, cache);
    const right = resolveRegisteredOrder(b, paths, cache);
    if (left !== right) {
      if (!left) return 1;
      if (!right) return -1;
      return left < right ? 1 : -1;
    }
    return compareRegisterItemIds(a.id, b.id);
  });
}

function groupByOwner(items: PjrDisplayItem[]): ViewGroup[] {
  const grouped = new Map<string, PjrDisplayItem[]>();
  for (const item of items) {
    const key = item.owner || "-";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(item);
  }
  return [...grouped.keys()].sort().map((owner) => ({ label: owner, items: grouped.get(owner)! }));
}

// 登録項目一覧（pjr-index）本体を生成する。行は ID 昇順で、列見出しと外枠は template が持つ。
function generateIndexView(items: PjrDisplayItem[], projectId: string): string {
  const template = loadViewTemplate(REGISTER_INDEX_TEMPLATE, projectId);
  return injectRegisterRows(template, items.map(formatTableRow));
}

// 状態別・優先度別・担当者別のビューは、非追跡の生成物になったことで単一ファイルへ
// まとめる理由（共有編集時の git 差分・マージ競合の回避）が無くなったため、
// 軸ごとに別ファイルへ分割する（見やすさを優先する）。
function generateViewsByStatusFile(
  items: PjrDisplayItem[],
  projectId: string,
  heading: TableHeading,
): string {
  const statusGroups = VALID_STATUSES.map((status) => ({
    label: status,
    items: items.filter((it) => it.status === status),
  })).filter((group) => group.items.length > 0);

  const template = loadViewTemplate("pjr-views-by-status-template.md", projectId);
  return injectViewSlots(template, {
    "by-status": renderGroupedTables(statusGroups, 1, heading),
  });
}

function generateViewsByPriorityFile(
  items: PjrDisplayItem[],
  projectId: string,
  heading: TableHeading,
): string {
  const priorityGroups = VALID_PRIORITIES.map((priority) => ({
    label: priority,
    items: items.filter((it) => it.priority === priority),
  }));

  const template = loadViewTemplate("pjr-views-by-priority-template.md", projectId);
  return injectViewSlots(template, {
    "by-priority": renderGroupedTables(priorityGroups, 1, heading),
  });
}

function generateViewsByOwnerFile(
  items: PjrDisplayItem[],
  projectId: string,
  heading: TableHeading,
): string {
  const template = loadViewTemplate("pjr-views-by-owner-template.md", projectId);
  return injectViewSlots(template, {
    "by-owner": renderGroupedTables(groupByOwner(items), 1, heading),
  });
}

function markdownLink(label: string, fromDirectory: string, targetPath: string): string {
  const path = relative(fromDirectory, targetPath).split(sep).join("/");
  const href = path.startsWith(".") ? path : `./${path}`;
  return `[${toCell(label)}](${href})`;
}

function generateDerivedItemsFile(
  paths: RegisterPaths,
  items: readonly RegisterItemView[],
): string {
  const sourceDocs = new Map(
    items.flatMap((view) => (view.ticketPath ? [[view.id, view.ticketPath] as const] : [])),
  );
  const rows = collectDerivedRegisterRelations(paths, items).map((relation) => {
    const sourcePath = sourceDocs.get(relation.sourceId);
    const sourceCell = sourcePath
      ? markdownLink(relation.sourceId, paths.generatedPath, sourcePath)
      : relation.sourceId;
    const derivedLabel =
      relation.derivedProjectId === paths.projectId
        ? relation.derivedItem.id
        : `${relation.derivedProjectId}:${relation.derivedItem.id}`;
    const derivedCell = markdownLink(derivedLabel, paths.generatedPath, relation.derivedTicketPath);
    return `| ${[
      sourceCell,
      derivedCell,
      relation.derivedItem.type,
      relation.derivedItem.status,
      relation.derivedItem.title,
    ]
      .map(toCell)
      .join(" | ")} |`;
  });
  const table = [
    "<!-- prettier-ignore -->",
    "| 元の項目 | 派生先 | 分類 | ステータス | タイトル |",
    "| --- | --- | --- | --- | --- |",
    ...rows,
  ].join("\n");
  const template = loadViewTemplate("pjr-derived-items-template.md", paths.projectId);
  return injectViewSlots(template, { "derived-items": table });
}

function generateTypeFilterView(
  items: PjrDisplayItem[],
  type: string,
  templateFileName: string,
  projectId: string,
  heading: TableHeading,
): string {
  const filtered = items.filter((it) => it.type === type);
  const template = loadViewTemplate(templateFileName, projectId);
  return injectViewSlots(template, {
    table: ["<!-- prettier-ignore -->", makeTable(filtered, heading)].join("\n"),
  });
}
export type BuildScope = "register" | "controls" | "all";
export type ViewFile = { path: string; content: string };

export const VALID_BUILD_SCOPES: BuildScope[] = ["register", "controls", "all"];

export function generateDerivedViewFiles(paths: RegisterPaths, scope: BuildScope): ViewFile[] {
  // 項目の値は個票 frontmatter（正本）から集める。列見出しは template から採用するため、
  // 生成処理は作業ツリーの pjr-index.md を入力にしない。
  // 「登録日」「完了日」は保存された日時をプロジェクトの登録日タイムゾーンへ変換して導出する。
  const itemViews = loadRegisterItems(paths);
  const items = itemViews.map((view) => toDisplayItem(view.item, paths.registerDateTimeZone));
  const heading = extractTableHeading(loadViewTemplate(REGISTER_INDEX_TEMPLATE, paths.projectId));

  // 個票セルのリンクは project-register/ 起点の `./` 表記で作られる。
  // 各 generated/ ディレクトリから辿れるよう相対パスを付け替える。
  const pjrDirName = basename(paths.projectRegisterPath);
  const regItems = rebaseItems(items, "../");
  const ctrlItems = rebaseItems(items, `../${pjrDirName}/`);

  const registerViews: ViewFile[] = [];
  const controlsViews: ViewFile[] = [];

  if (scope === "register" || scope === "all") {
    // 本体（pjr-index）は ID で引く用途があるため ID 昇順を保つ。軸別ビューは状況の把握が目的で、
    // 新しい起票を先頭へ置く。
    const viewItems = sortByRegisteredDesc(regItems, paths);
    registerViews.push(
      {
        path: join(paths.generatedPath, "pjr-index.md"),
        content: generateIndexView(regItems, paths.projectId),
      },
      {
        path: join(paths.generatedPath, "pjr-views-by-status.md"),
        content: generateViewsByStatusFile(viewItems, paths.projectId, heading),
      },
      {
        path: join(paths.generatedPath, "pjr-views-by-priority.md"),
        content: generateViewsByPriorityFile(viewItems, paths.projectId, heading),
      },
      {
        path: join(paths.generatedPath, "pjr-views-by-owner.md"),
        content: generateViewsByOwnerFile(viewItems, paths.projectId, heading),
      },
      {
        path: join(paths.generatedPath, "pjr-derived-items.md"),
        content: generateDerivedItemsFile(paths, itemViews),
      },
    );
  }

  if (scope === "controls" || scope === "all") {
    controlsViews.push(
      {
        path: join(paths.controlsGeneratedPath, "pm-risk-register.md"),
        content: generateTypeFilterView(
          ctrlItems,
          "risk",
          "pm-risk-register-template.md",
          paths.projectId,
          heading,
        ),
      },
      {
        path: join(paths.controlsGeneratedPath, "pm-issue-log.md"),
        content: generateTypeFilterView(
          ctrlItems,
          "issue",
          "pm-issue-log-template.md",
          paths.projectId,
          heading,
        ),
      },
      {
        path: join(paths.controlsGeneratedPath, "pm-change-request-log.md"),
        content: generateTypeFilterView(
          ctrlItems,
          "change-request",
          "pm-change-request-log-template.md",
          paths.projectId,
          heading,
        ),
      },
      {
        path: join(paths.controlsGeneratedPath, "pm-decision-log.md"),
        content: generateTypeFilterView(
          ctrlItems,
          "decision",
          "pm-decision-log-template.md",
          paths.projectId,
          heading,
        ),
      },
    );
  }

  return [...registerViews, ...controlsViews];
}

export function writeDerivedViews(paths: RegisterPaths, scope: BuildScope): ViewFile[] {
  const views = generateDerivedViewFiles(paths, scope);
  const hasRegisterViews = views.some((view) => dirname(view.path) === paths.generatedPath);
  const hasControlsViews = views.some((view) => dirname(view.path) === paths.controlsGeneratedPath);

  if (hasRegisterViews) {
    mkdirSync(paths.generatedPath, { recursive: true });
  }
  if (hasControlsViews) {
    mkdirSync(paths.controlsGeneratedPath, { recursive: true });
  }

  for (const view of views) {
    writeFileSync(view.path, view.content, "utf8");
  }

  return views;
}

// ================================
// Item Update Helpers
// ================================

export function findItemById(items: PjrItem[], id: string): PjrItem | undefined {
  return items.find((it) => it.id === id);
}

// 登録項目を全件解決する。正本は個票 frontmatter で、登録項目フィールドを持つ個票を
// 最優先で採用する。まだ個票へ移行していない項目は pjr-index の行から読み取り（互換）、
// 個票ファイルがある場合はそのパスを保持して、次回の更新時に frontmatter へ移す。
export function loadRegisterItems(paths: RegisterPaths): RegisterItemView[] {
  const docs = loadRegisterItemDocs(paths.projectRegisterPath);
  const docById = new Map(docs.map((doc) => [doc.id, doc]));
  const views = new Map<string, RegisterItemView>();

  for (const doc of docs) {
    if (!doc.hasRegisterFields) continue;
    views.set(doc.id, {
      id: doc.id,
      item: doc.item,
      ticketPath: doc.path,
      ticketFilename: doc.filename,
      source: "ticket",
    });
  }

  if (existsSync(paths.pjrIndexPath)) {
    for (const item of parsePjrIndex(
      readFileSync(paths.pjrIndexPath, "utf8"),
      paths.registerDateTimeZone,
    )) {
      if (views.has(item.id)) continue;
      const doc = docById.get(item.id);
      views.set(item.id, {
        id: item.id,
        item: doc ? { ...item, ticket: ticketRefCell(doc.filename) } : item,
        ticketPath: doc?.path,
        ticketFilename: doc?.filename,
        source: "index",
      });
    }
  }

  return [...views.values()].sort((a, b) => compareRegisterItemIds(a.id, b.id));
}

export function findRegisterItem(
  views: RegisterItemView[],
  id: string,
): RegisterItemView | undefined {
  return views.find((view) => view.id === id);
}
