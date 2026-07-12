import { type Command } from "commander";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { getProjectRegisterPath, loadConfig, loadEnv, specdojoRootDir } from "./specdojo-config.js";
import { flattenTemplateFrontmatter } from "./template-frontmatter.js";
import { buildSpecdojoFrontmatter } from "./frontmatter-namespace.js";

// ================================
// Types
// ================================

export type RegisterPaths = {
  projectId: string;
  projectRegisterPath: string;
  pjrIndexPath: string;
  generatedPath: string;
  controlsGeneratedPath: string;
};

export type PjrItem = {
  id: string;
  status: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  owner: string;
  due: string;
  completed: string;
  conclusion: string;
  ticket: string;
};

// ================================
// Constants
// ================================

export const VALID_STATUSES = [
  "open",
  "in-progress",
  "waiting",
  "review",
  "decided",
  "done",
  "deferred",
  "rejected",
] as const;

export const VALID_TYPES = [
  "todo",
  "question",
  "risk",
  "issue",
  "change-request",
  "decision",
  "dependency",
  "note",
] as const;

export const VALID_PRIORITIES = ["high", "medium", "low"] as const;

const TABLE_HEADER =
  "| ID | ステータス | タイトル | 説明 | 分類 | 優先度 | 担当 | 期限 | 完了日 | 結論 | 個票 |";
const TABLE_SEPARATOR = "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |";

// ================================
// Path Resolution
// ================================

export function resolveRegisterPaths(opts: { project?: string }): RegisterPaths {
  loadEnv();
  const { config, configPath } = loadConfig();
  const baseDir = specdojoRootDir();

  const projectId =
    opts.project?.trim() ||
    process.env.SPECDOJO_PROJECT?.trim() ||
    (config ? Object.keys(config.projects)[0] : "");

  if (!config) {
    throw new Error(`register commands require specdojo.config.json.\nRun: specdojo config init`);
  }
  if (!projectId) {
    throw new Error(`No project specified. Use --project <id> or SPECDOJO_PROJECT.`);
  }

  const project = config.projects[projectId];
  if (!project) {
    throw new Error(`Unknown project: ${projectId} (check ${configPath})`);
  }

  const registerPath = getProjectRegisterPath(project);
  if (!registerPath) {
    throw new Error(
      `project_register_path not set for project '${projectId}' in ${configPath}.\n` +
        `Add "project_register_path": "<path>" to the project config.`,
    );
  }

  const absRegisterPath = resolve(baseDir, registerPath);
  return {
    projectId,
    projectRegisterPath: absRegisterPath,
    pjrIndexPath: join(absRegisterPath, "pjr-index.md"),
    generatedPath: join(absRegisterPath, "generated"),
    controlsGeneratedPath: join(dirname(absRegisterPath), "generated"),
  };
}

// ================================
// Markdown Table Parsing
// ================================

function parseTableCells(line: string): string[] {
  // Replace escaped pipes with placeholder before splitting
  const PIPE = "\x01";
  const normalized = line.replace(/\\\|/g, PIPE);
  const cells = normalized.split("|").map((c) => c.replace(new RegExp(PIPE, "g"), "\\|").trim());
  // Remove first and last empty elements (line starts and ends with |)
  return cells.slice(1, cells.length - 1);
}

function isTableSeparator(line: string): boolean {
  return line.startsWith("|") && /\|\s*---+\s*\|/.test(line);
}

export function parsePjrIndex(content: string): PjrItem[] {
  const lines = content.split("\n");
  const items: PjrItem[] = [];
  let inSection = false;

  for (const line of lines) {
    if (/^## 1\.\s+登録項目一覧/.test(line)) {
      inSection = true;
      continue;
    }
    if (inSection && /^## /.test(line)) break;
    if (!inSection) continue;
    if (!line.startsWith("|") || isTableSeparator(line)) continue;

    const cells = parseTableCells(line);
    if (cells.length < 11) continue;
    if (!/^PJR-\d{4}$/.test(cells[0])) continue;

    items.push({
      id: cells[0],
      status: cells[1],
      title: cells[2],
      description: cells[3],
      type: cells[4],
      priority: cells[5],
      owner: cells[6],
      due: cells[7],
      completed: cells[8],
      conclusion: cells[9],
      ticket: cells[10],
    });
  }

  return items;
}

function getNextPjrId(items: PjrItem[]): string {
  const maxNum = items.reduce((max, item) => {
    const m = item.id.match(/^PJR-(\d{4})$/);
    return m ? Math.max(max, parseInt(m[1], 10)) : max;
  }, 0);
  return `PJR-${String(maxNum + 1).padStart(4, "0")}`;
}

function formatTableRow(item: PjrItem): string {
  return `| ${item.id} | ${item.status} | ${item.title} | ${item.description} | ${item.type} | ${item.priority} | ${item.owner} | ${item.due} | ${item.completed} | ${item.conclusion} | ${item.ticket} |`;
}

function insertRowAfterLast(content: string, newRow: string): string {
  const lines = content.split("\n");
  let inSection = false;
  let lastRowIndex = -1;
  let separatorIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^## 1\.\s+登録項目一覧/.test(line)) {
      inSection = true;
      continue;
    }
    if (inSection && /^## /.test(line)) break;
    if (!inSection) continue;

    if (isTableSeparator(line)) {
      separatorIndex = i;
      continue;
    }

    if (line.startsWith("|")) {
      const cells = parseTableCells(line);
      if (cells.length >= 1 && /^PJR-\d{4}$/.test(cells[0])) {
        lastRowIndex = i;
      }
    }
  }

  const insertAfter = lastRowIndex !== -1 ? lastRowIndex : separatorIndex;
  if (insertAfter === -1) {
    throw new Error("Could not find table structure in pjr-index.md");
  }

  lines.splice(insertAfter + 1, 0, newRow);
  return lines.join("\n");
}

// ================================
// Validation
// ================================

function validateFields(opts: {
  status: string;
  type: string;
  priority: string;
  due: string;
  completed: string;
  id?: string;
}): void {
  const errors: string[] = [];

  if (!(VALID_STATUSES as readonly string[]).includes(opts.status)) {
    errors.push(`Invalid status: "${opts.status}". Must be one of: ${VALID_STATUSES.join(", ")}`);
  }
  if (!(VALID_TYPES as readonly string[]).includes(opts.type)) {
    errors.push(`Invalid type: "${opts.type}". Must be one of: ${VALID_TYPES.join(", ")}`);
  }
  if (!(VALID_PRIORITIES as readonly string[]).includes(opts.priority)) {
    errors.push(
      `Invalid priority: "${opts.priority}". Must be one of: ${VALID_PRIORITIES.join(", ")}`,
    );
  }
  if (opts.id && !/^PJR-\d{4}$/.test(opts.id)) {
    errors.push(`Invalid ID: "${opts.id}". Must match PJR-XXXX (e.g., PJR-0001)`);
  }
  if (!/^(\d{4}-\d{2}-\d{2}|-|_TODO_)$/.test(opts.due)) {
    errors.push(`Invalid due: "${opts.due}". Must be YYYY-MM-DD, -, or _TODO_`);
  }
  if (!/^(\d{4}-\d{2}-\d{2}|-)$/.test(opts.completed)) {
    errors.push(`Invalid completed: "${opts.completed}". Must be YYYY-MM-DD or -`);
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
}

// ================================
// Slug
// ================================

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .trim()
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "item"
  );
}

// ================================
// Ticket Generation
// ================================

function getTitlePlaceholder(type: string): string {
  return `_${type.toUpperCase().replace(/-/g, "_")}_TITLE_`;
}

function generateTicket(opts: {
  projectId: string;
  displayId: string;
  type: string;
  title: string;
  templatePath: string;
}): string {
  if (!existsSync(opts.templatePath)) {
    throw new Error(`Template not found: ${opts.templatePath}`);
  }

  let content = readFileSync(opts.templatePath, "utf8");
  content = flattenTemplateFrontmatter(content);
  const pjrLower = opts.displayId.toLowerCase();

  // Replace frontmatter id pattern first to keep it lowercase
  content = content.replace(/_PROJECT_ID_:_PJR-XXXX_/g, `${opts.projectId}:${pjrLower}`);
  // Replace remaining project id placeholder
  content = content.replace(/_PROJECT_ID_/g, opts.projectId);
  // Replace display id placeholder with uppercase
  content = content.replace(/_PJR-XXXX_/g, opts.displayId);
  // Replace type-specific title placeholder
  const titlePh = getTitlePlaceholder(opts.type);
  content = content.replace(
    new RegExp(titlePh.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
    opts.title,
  );

  return content;
}

// ================================
// Derived View Generation
// ================================

function adjustTicketLink(ticket: string, prefix: string): string {
  if (ticket === "-") return ticket;
  return ticket.replace(/\]\(\.\//g, `](${prefix}`);
}

function rebaseItems(items: PjrItem[], prefix: string): PjrItem[] {
  return items.map((it) => ({ ...it, ticket: adjustTicketLink(it.ticket, prefix) }));
}

function makeTable(items: PjrItem[]): string {
  const rows = items.map(formatTableRow);
  return [TABLE_HEADER, TABLE_SEPARATOR, ...rows].join("\n");
}

function derivedViewNote(): string {
  return "> このファイルは `pjr-index.md` から生成された派生ビューです。正本は `pjr-index.md` と各 `pjr-XXXX-<topic>.md` であり、このファイルは再生成可能です。";
}

// pjr-index.md の派生ビュー（pjr-views / pm-risk-register など）の frontmatter。
// pjr-index.md と整合させ、派生元を part_of で示す（deliverable-frontmatter スキーマに準拠）。
function derivedViewFrontmatter(projectId: string, localId: string): string {
  return buildSpecdojoFrontmatter([
    `id: ${projectId}:${localId}`,
    "type: project",
    "status: ready",
    "part_of:",
    `  - ${projectId}:pjr-index`,
    "rulebook: pjr-index-rulebook",
  ]);
}

function generateViewsFile(items: PjrItem[], projectId: string): string {
  const sections: string[] = [
    derivedViewFrontmatter(projectId, "pjr-views"),
    "",
    "# 台帳ビュー",
    "",
    derivedViewNote(),
  ];

  // 1. 状態別
  sections.push("", "## 1. 状態別");
  let statusNum = 1;
  for (const status of VALID_STATUSES) {
    const filtered = items.filter((it) => it.status === status);
    if (filtered.length === 0) continue;
    sections.push(
      "",
      `### 1.${statusNum}. ${status}`,
      "",
      "<!-- prettier-ignore -->",
      makeTable(filtered),
    );
    statusNum++;
  }

  // 2. 優先度別
  sections.push("", "## 2. 優先度別");
  let priorityNum = 1;
  for (const priority of VALID_PRIORITIES) {
    const filtered = items.filter((it) => it.priority === priority);
    sections.push(
      "",
      `### 2.${priorityNum}. ${priority}`,
      "",
      "<!-- prettier-ignore -->",
      makeTable(filtered),
    );
    priorityNum++;
  }

  // 3. 担当者別
  sections.push("", "## 3. 担当者別");
  const grouped = new Map<string, PjrItem[]>();
  for (const item of items) {
    const key = item.owner || "-";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(item);
  }
  let ownerNum = 1;
  for (const owner of [...grouped.keys()].sort()) {
    sections.push(
      "",
      `### 3.${ownerNum}. ${owner}`,
      "",
      "<!-- prettier-ignore -->",
      makeTable(grouped.get(owner)!),
    );
    ownerNum++;
  }

  return sections.join("\n") + "\n";
}

function generateTypeFilterView(
  items: PjrItem[],
  type: string,
  title: string,
  localId: string,
  projectId: string,
): string {
  const filtered = items.filter((it) => it.type === type);
  return [
    derivedViewFrontmatter(projectId, localId),
    "",
    `# ${title}`,
    "",
    derivedViewNote(),
    "",
    "<!-- prettier-ignore -->",
    makeTable(filtered),
    "",
  ].join("\n");
}
type BuildScope = "register" | "controls" | "all";
type ViewFile = { path: string; content: string };

const VALID_BUILD_SCOPES: BuildScope[] = ["register", "controls", "all"];

function generateDerivedViewFiles(paths: RegisterPaths, scope: BuildScope): ViewFile[] {
  const content = readFileSync(paths.pjrIndexPath, "utf8");
  const items = parsePjrIndex(content);

  // Ticket links in pjr-index.md use ./ relative to project-register/.
  // Rebase them so links remain valid from each generated/ directory.
  const pjrDirName = basename(paths.projectRegisterPath);
  const regItems = rebaseItems(items, "../");
  const ctrlItems = rebaseItems(items, `../${pjrDirName}/`);

  const registerViews: ViewFile[] = [];
  const controlsViews: ViewFile[] = [];

  if (scope === "register" || scope === "all") {
    registerViews.push({
      path: join(paths.generatedPath, "pjr-views.md"),
      content: generateViewsFile(regItems, paths.projectId),
    });
  }

  if (scope === "controls" || scope === "all") {
    controlsViews.push(
      {
        path: join(paths.controlsGeneratedPath, "pm-risk-register.md"),
        content: generateTypeFilterView(
          ctrlItems,
          "risk",
          "リスク登録簿",
          "pm-risk-register",
          paths.projectId,
        ),
      },
      {
        path: join(paths.controlsGeneratedPath, "pm-issue-log.md"),
        content: generateTypeFilterView(
          ctrlItems,
          "issue",
          "課題ログ",
          "pm-issue-log",
          paths.projectId,
        ),
      },
      {
        path: join(paths.controlsGeneratedPath, "pm-change-request-log.md"),
        content: generateTypeFilterView(
          ctrlItems,
          "change-request",
          "変更要求ログ",
          "pm-change-request-log",
          paths.projectId,
        ),
      },
      {
        path: join(paths.controlsGeneratedPath, "pm-decision-log.md"),
        content: generateTypeFilterView(
          ctrlItems,
          "decision",
          "決定記録",
          "pm-decision-log",
          paths.projectId,
        ),
      },
    );
  }

  return [...registerViews, ...controlsViews];
}

function writeDerivedViews(paths: RegisterPaths, scope: BuildScope): ViewFile[] {
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

export const TERMINAL_STATUSES_SET = new Set(["done", "decided", "rejected", "deferred"]);

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function findItemById(items: PjrItem[], id: string): PjrItem | undefined {
  return items.find((it) => it.id === id);
}

function replaceRowInContent(content: string, updated: PjrItem): string {
  const newRow = formatTableRow(updated);
  const lines = content.split("\n");
  let inSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^## 1\.\s+登録項目一覧/.test(line)) {
      inSection = true;
      continue;
    }
    if (inSection && /^## /.test(line)) break;
    if (!inSection) continue;
    if (!line.startsWith("|") || isTableSeparator(line)) continue;

    const cells = parseTableCells(line);
    if (cells.length >= 1 && cells[0] === updated.id) {
      lines[i] = newRow;
      return lines.join("\n");
    }
  }

  throw new Error(`Item ${updated.id} not found in table`);
}

function loadItemForUpdate(
  paths: RegisterPaths,
  id: string,
  guard?: "require-active" | "require-terminal",
): { content: string; item: PjrItem } {
  if (!existsSync(paths.pjrIndexPath)) {
    throw new Error(`pjr-index.md not found: ${paths.pjrIndexPath}`);
  }
  if (!/^PJR-\d{4}$/.test(id)) {
    throw new Error(`Invalid ID: "${id}". Must match PJR-XXXX (e.g., PJR-0001)`);
  }
  const content = readFileSync(paths.pjrIndexPath, "utf8");
  const items = parsePjrIndex(content);
  const item = findItemById(items, id);
  if (!item) {
    throw new Error(`Item not found: ${id}`);
  }
  if (guard === "require-active" && TERMINAL_STATUSES_SET.has(item.status)) {
    throw new Error(
      `Cannot change ${id}: status is "${item.status}" (terminal). Use "register reopen" first.`,
    );
  }
  if (guard === "require-terminal" && !TERMINAL_STATUSES_SET.has(item.status)) {
    throw new Error(`Cannot reopen ${id}: status is "${item.status}" (already active).`);
  }
  return { content, item };
}

function applyItemUpdate(opts: {
  paths: RegisterPaths;
  content: string;
  updated: PjrItem;
  dryRun: boolean;
  action?: string;
}): void {
  const label = opts.action ?? `→ ${opts.updated.status}`;
  if (opts.dryRun) {
    process.stdout.write(
      `Would update ${opts.updated.id} (${label}):\n${formatTableRow(opts.updated)}\n`,
    );
    return;
  }
  const updatedContent = replaceRowInContent(opts.content, opts.updated);
  writeFileSync(opts.paths.pjrIndexPath, updatedContent, "utf8");
  process.stdout.write(`Updated: ${opts.paths.pjrIndexPath} (${opts.updated.id} ${label})\n`);
  for (const view of writeDerivedViews(opts.paths, "all")) {
    process.stdout.write(`Generated: ${view.path}\n`);
  }
}

// ================================
// Error Handling & Shared Helpers
// ================================

function printCommandError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  process.stdout.write(message + "\n");
  process.exitCode = 1;
}

function addProjectOption(cmd: Command): Command {
  return cmd.option("--project <projectId>", "Project id in specdojo.config.json");
}

// ================================
// Command Registration
// ================================

export function registerRegisterCommands(program: Command): void {
  const reg = program.command("register").description("Project register (pjr-index.md) commands");

  // --- scaffold ---
  const scaffoldCmd = reg.command("scaffold").description("Generate pjr-index.md from template");
  addProjectOption(scaffoldCmd);
  scaffoldCmd.option("--project-id <id>", "Project ID to embed (defaults to --project value)");
  scaffoldCmd.option("--force", "Overwrite existing pjr-index.md", false);
  scaffoldCmd.option("--dry-run", "Print generated content to stdout without writing", false);
  scaffoldCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);
      const embedId = opts.projectId?.trim() || paths.projectId;

      const templatePath = join(
        specdojoRootDir(),
        "docs/ja/specdojo/templates/pjr-index-template.md",
      );
      if (!existsSync(templatePath)) {
        throw new Error(`Template not found: ${templatePath}`);
      }

      if (!opts.force && existsSync(paths.pjrIndexPath)) {
        process.stdout.write(
          `Skipped (already exists; use --force to overwrite): ${paths.pjrIndexPath}\n`,
        );
        return;
      }

      let content = readFileSync(templatePath, "utf8");
      content = flattenTemplateFrontmatter(content);
      content = content.replace(/_PROJECT_ID_/g, embedId);

      if (opts.dryRun) {
        process.stdout.write(content);
        return;
      }

      mkdirSync(paths.projectRegisterPath, { recursive: true });
      mkdirSync(paths.generatedPath, { recursive: true });
      writeFileSync(paths.pjrIndexPath, content, "utf8");
      process.stdout.write(`Created: ${paths.pjrIndexPath}\n`);
      process.stdout.write(`Created: ${paths.generatedPath}/\n`);

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
  addCmd.option("--status <status>", `Status: ${VALID_STATUSES.join(" | ")}`, "open");
  addCmd.option("--owner <owner>", "Owner or role", "_TODO_");
  addCmd.option("--due <date>", "Due date (YYYY-MM-DD, -, or _TODO_)", "_TODO_");
  addCmd.option("--completed <date>", "Completion date (YYYY-MM-DD or -)", "-");
  addCmd.option("--conclusion <text>", "Conclusion or resolution summary", "-");
  addCmd.option("--id <id>", "Display ID (e.g., PJR-0061); auto-incremented if omitted");
  addCmd.option("--ticket", "Also generate individual ticket file", false);
  addCmd.option(
    "--topic <topic>",
    "Topic slug for ticket filename; derived from --title if omitted",
  );
  addCmd.option("--force", "Overwrite existing ticket file", false);
  addCmd.option("--dry-run", "Print new row and ticket content without writing", false);
  addCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);

      if (!existsSync(paths.pjrIndexPath)) {
        throw new Error(
          `pjr-index.md not found: ${paths.pjrIndexPath}\n` +
            `Run: specdojo register scaffold --project ${opts.project || paths.projectId}`,
        );
      }

      const originalContent = readFileSync(paths.pjrIndexPath, "utf8");
      const existingItems = parsePjrIndex(originalContent);

      const displayId = opts.id?.trim() || getNextPjrId(existingItems);

      validateFields({
        status: opts.status,
        type: opts.type,
        priority: opts.priority,
        due: opts.due,
        completed: opts.completed,
        id: displayId,
      });

      if (opts.id && existingItems.some((it) => it.id === displayId)) {
        throw new Error(`ID already exists in pjr-index.md: ${displayId}`);
      }

      const topic = opts.topic?.trim() || slugify(opts.title);
      const ticketFilename = `${displayId.toLowerCase()}-${topic}.md`;
      const ticketRef = opts.ticket
        ? `[${ticketFilename.replace(".md", "")}](./${ticketFilename})`
        : "-";

      const newItem: PjrItem = {
        id: displayId,
        status: opts.status,
        title: opts.title,
        description: opts.description,
        type: opts.type,
        priority: opts.priority,
        owner: opts.owner,
        due: opts.due,
        completed: opts.completed,
        conclusion: opts.conclusion,
        ticket: ticketRef,
      };

      const newRow = formatTableRow(newItem);

      if (opts.dryRun) {
        process.stdout.write(`New row:\n${newRow}\n`);
        if (opts.ticket) {
          const templatePath = join(
            specdojoRootDir(),
            `docs/ja/specdojo/templates/pjr-${opts.type}-template.md`,
          );
          const ticketContent = generateTicket({
            projectId: paths.projectId,
            displayId,
            type: opts.type,
            title: opts.title,
            templatePath,
          });
          process.stdout.write(`\nTicket (${ticketFilename}):\n${ticketContent}\n`);
        }
        return;
      }

      const updatedContent = insertRowAfterLast(originalContent, newRow);
      writeFileSync(paths.pjrIndexPath, updatedContent, "utf8");
      process.stdout.write(`Updated: ${paths.pjrIndexPath} (added ${displayId})\n`);

      if (opts.ticket) {
        const ticketPath = join(paths.projectRegisterPath, ticketFilename);
        if (!opts.force && existsSync(ticketPath)) {
          process.stdout.write(
            `Skipped ticket (already exists; use --force to overwrite): ${ticketPath}\n`,
          );
        } else {
          const templatePath = join(
            specdojoRootDir(),
            `docs/ja/specdojo/templates/pjr-${opts.type}-template.md`,
          );
          const ticketContent = generateTicket({
            projectId: paths.projectId,
            displayId,
            type: opts.type,
            title: opts.title,
            templatePath,
          });
          writeFileSync(ticketPath, ticketContent, "utf8");
          process.stdout.write(`Created ticket: ${ticketPath}\n`);
        }
      }
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- close ---
  const closeCmd = reg.command("close").description("Set item status to done or decided");
  addProjectOption(closeCmd);
  closeCmd.requiredOption("--id <id>", "Item ID (PJR-XXXX)");
  closeCmd.option("--status <status>", "done or decided (auto from item type if omitted)");
  closeCmd.option("--conclusion <text>", "Conclusion or resolution summary");
  closeCmd.option("--completed <date>", "Completion date (YYYY-MM-DD; defaults to today)");
  closeCmd.option("--dry-run", "Print change without writing", false);
  closeCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);
      const { content, item } = loadItemForUpdate(paths, opts.id, "require-active");

      const targetStatus =
        opts.status ?? (["decision", "question"].includes(item.type) ? "decided" : "done");
      if (targetStatus !== "done" && targetStatus !== "decided") {
        throw new Error(`--status must be "done" or "decided" for the close command`);
      }

      const completed = opts.completed ?? todayIso();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(completed)) {
        throw new Error(`Invalid completed date: "${completed}". Must be YYYY-MM-DD`);
      }

      const updated: PjrItem = {
        ...item,
        status: targetStatus,
        completed,
        ...(opts.conclusion !== undefined ? { conclusion: opts.conclusion } : {}),
      };
      applyItemUpdate({ paths, content, updated, dryRun: opts.dryRun });
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- reject ---
  const rejectCmd = reg.command("reject").description("Set item status to rejected");
  addProjectOption(rejectCmd);
  rejectCmd.requiredOption("--id <id>", "Item ID (PJR-XXXX)");
  rejectCmd.option("--conclusion <text>", "Reason for rejection");
  rejectCmd.option("--completed <date>", "Rejection date (YYYY-MM-DD; defaults to today)");
  rejectCmd.option("--dry-run", "Print change without writing", false);
  rejectCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);
      const { content, item } = loadItemForUpdate(paths, opts.id, "require-active");

      const completed = opts.completed ?? todayIso();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(completed)) {
        throw new Error(`Invalid completed date: "${completed}". Must be YYYY-MM-DD`);
      }

      const updated: PjrItem = {
        ...item,
        status: "rejected",
        completed,
        ...(opts.conclusion !== undefined ? { conclusion: opts.conclusion } : {}),
      };
      applyItemUpdate({ paths, content, updated, dryRun: opts.dryRun });
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- defer ---
  const deferCmd = reg.command("defer").description("Set item status to deferred");
  addProjectOption(deferCmd);
  deferCmd.requiredOption("--id <id>", "Item ID (PJR-XXXX)");
  deferCmd.option("--conclusion <text>", "Reason for deferral");
  deferCmd.option("--dry-run", "Print change without writing", false);
  deferCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);
      const { content, item } = loadItemForUpdate(paths, opts.id, "require-active");

      const updated: PjrItem = {
        ...item,
        status: "deferred",
        ...(opts.conclusion !== undefined ? { conclusion: opts.conclusion } : {}),
      };
      applyItemUpdate({ paths, content, updated, dryRun: opts.dryRun });
    } catch (error) {
      printCommandError(error);
    }
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
  reopenCmd.option("--dry-run", "Print change without writing", false);
  reopenCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);
      const { content, item } = loadItemForUpdate(paths, opts.id, "require-terminal");

      const validReopenStatuses = ["open", "in-progress", "waiting", "review"];
      if (!validReopenStatuses.includes(opts.status)) {
        throw new Error(`--status must be one of: ${validReopenStatuses.join(", ")}`);
      }

      const updated: PjrItem = { ...item, status: opts.status, completed: "-" };
      applyItemUpdate({ paths, content, updated, dryRun: opts.dryRun });
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- start ---
  const startCmd = reg.command("start").description("Set item status to in-progress");
  addProjectOption(startCmd);
  startCmd.requiredOption("--id <id>", "Item ID (PJR-XXXX)");
  startCmd.option("--dry-run", "Print change without writing", false);
  startCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);
      const { content, item } = loadItemForUpdate(paths, opts.id, "require-active");
      const updated: PjrItem = { ...item, status: "in-progress" };
      applyItemUpdate({ paths, content, updated, dryRun: opts.dryRun });
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- wait ---
  const waitCmd = reg.command("wait").description("Set item status to waiting");
  addProjectOption(waitCmd);
  waitCmd.requiredOption("--id <id>", "Item ID (PJR-XXXX)");
  waitCmd.option("--conclusion <text>", "Reason for waiting");
  waitCmd.option("--dry-run", "Print change without writing", false);
  waitCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);
      const { content, item } = loadItemForUpdate(paths, opts.id, "require-active");
      const updated: PjrItem = {
        ...item,
        status: "waiting",
        ...(opts.conclusion !== undefined ? { conclusion: opts.conclusion } : {}),
      };
      applyItemUpdate({ paths, content, updated, dryRun: opts.dryRun });
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- review ---
  const reviewCmd = reg.command("review").description("Set item status to review");
  addProjectOption(reviewCmd);
  reviewCmd.requiredOption("--id <id>", "Item ID (PJR-XXXX)");
  reviewCmd.option("--dry-run", "Print change without writing", false);
  reviewCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);
      const { content, item } = loadItemForUpdate(paths, opts.id, "require-active");
      const updated: PjrItem = { ...item, status: "review" };
      applyItemUpdate({ paths, content, updated, dryRun: opts.dryRun });
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- update ---
  const updateCmd = reg.command("update").description("Update fields of a register item");
  addProjectOption(updateCmd);
  updateCmd.requiredOption("--id <id>", "Item ID (PJR-XXXX)");
  updateCmd.option("--title <title>", "Update title");
  updateCmd.option("--description <text>", "Update description");
  updateCmd.option("--priority <priority>", `Update priority: ${VALID_PRIORITIES.join(" | ")}`);
  updateCmd.option("--owner <owner>", "Update owner or role");
  updateCmd.option("--due <date>", "Update due date (YYYY-MM-DD, -, or _TODO_)");
  updateCmd.option("--dry-run", "Print change without writing", false);
  updateCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);
      const { content, item } = loadItemForUpdate(paths, opts.id);

      const hasUpdates = ["title", "description", "priority", "owner", "due"].some(
        (k) => opts[k] !== undefined,
      );
      if (!hasUpdates) {
        throw new Error(
          "At least one field option must be specified (--title, --description, --priority, --owner, --due)",
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
      if (opts.due !== undefined && !/^(\d{4}-\d{2}-\d{2}|-|_TODO_)$/.test(opts.due)) {
        throw new Error(`Invalid due: "${opts.due}". Must be YYYY-MM-DD, -, or _TODO_`);
      }

      const updated: PjrItem = {
        ...item,
        ...(opts.title !== undefined ? { title: opts.title } : {}),
        ...(opts.description !== undefined ? { description: opts.description } : {}),
        ...(opts.priority !== undefined ? { priority: opts.priority } : {}),
        ...(opts.owner !== undefined ? { owner: opts.owner } : {}),
        ...(opts.due !== undefined ? { due: opts.due } : {}),
      };
      applyItemUpdate({ paths, content, updated, dryRun: opts.dryRun, action: "fields updated" });
    } catch (error) {
      printCommandError(error);
    }
  });

  // --- build ---
  const buildCmd = reg.command("build").description("Generate derived views from pjr-index.md");
  addProjectOption(buildCmd);
  buildCmd.option("--scope <scope>", "Generation scope: register | controls | all", "all");
  buildCmd.option("--dry-run", "Print generated content without writing", false);
  buildCmd.action((opts) => {
    try {
      const paths = resolveRegisterPaths(opts);

      if (!existsSync(paths.pjrIndexPath)) {
        throw new Error(
          `pjr-index.md not found: ${paths.pjrIndexPath}\n` +
            `Run: specdojo register scaffold --project ${opts.project || paths.projectId}`,
        );
      }

      const scope = opts.scope as BuildScope;
      if (!VALID_BUILD_SCOPES.includes(scope)) {
        throw new Error(
          `Invalid scope: "${opts.scope}". Must be one of: ${VALID_BUILD_SCOPES.join(", ")}`,
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
}
