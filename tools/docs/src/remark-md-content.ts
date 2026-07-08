import { readFileSync } from "node:fs";
import { resolve, relative, sep } from "node:path";
import { load } from "js-yaml";
import type { Plugin } from "unified";
import type { Root, Table, TableRow } from "mdast";
import type { VFile } from "vfile";

// ── Schema types ─────────────────────────────────────────────────────────────

interface ColumnRule {
  enum?: string[];
  pattern?: string;
}

interface TableSchema {
  required_columns: string[];
  optional_columns?: string[];
  column_rules?: Record<string, ColumnRule>;
  at_least_one_of?: string[][];
}

interface Section {
  number: number | string;
  heading: string | string[];
  level: number;
  required?: boolean;
  table?: TableSchema;
}

interface MdContentSchema {
  sections: Section[];
  column_aliases?: Record<string, string[]>;
}

export interface MdContentOptions {
  schemas?: Record<string, string[]>;
  workspaceRoot?: string;
}

// ── Path / glob helpers ──────────────────────────────────────────────────────

function toPosix(p: string): string {
  return p.split(sep).join("/");
}

function globToRegExp(globPattern: string): RegExp {
  const pattern = toPosix(String(globPattern || ""));
  let source = "^";
  for (let i = 0; i < pattern.length; i += 1) {
    const ch = pattern[i];
    const next = pattern[i + 1];
    const next2 = pattern[i + 2];
    if (ch === "*" && next === "*" && next2 === "/") {
      source += "(?:.*/)?";
      i += 2;
      continue;
    }
    if (ch === "*" && next === "*") {
      source += ".*";
      i += 1;
      continue;
    }
    if (ch === "*") {
      source += "[^/]*";
      continue;
    }
    if (ch === "?") {
      source += "[^/]";
      continue;
    }
    source += ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  source += "$";
  return new RegExp(source);
}

function matchesAnyGlob(relativePath: string, globs: string[]): boolean {
  const posix = toPosix(relativePath);
  return globs.some((g) => globToRegExp(g).test(posix));
}

// ── Schema cache ─────────────────────────────────────────────────────────────

const schemaCache = new Map<string, MdContentSchema>();

function loadSchema(absPath: string): MdContentSchema {
  const cached = schemaCache.get(absPath);
  if (cached) return cached;
  const schema = load(readFileSync(absPath, "utf8")) as MdContentSchema;
  schemaCache.set(absPath, schema);
  return schema;
}

// ── AST helpers ──────────────────────────────────────────────────────────────

function extractText(node: unknown): string {
  if (typeof node !== "object" || node === null) return "";
  const n = node as Record<string, unknown>;
  if (typeof n.value === "string") return n.value;
  if (Array.isArray(n.children)) {
    const inner = (n.children as unknown[]).map(extractText).join("");
    // `_TODO_` のようなプレースホルダは Markdown 上は強調として解釈される。
    // スキーマの enum / pattern は `_TODO_` を字面どおりの値として扱うため、
    // 強調マーカーを `_` で復元してから照合する。
    if (n.type === "emphasis") return `_${inner}_`;
    return inner;
  }
  return "";
}

function buildAliasMap(aliases: Record<string, string[]> | undefined): Record<string, string> {
  const map: Record<string, string> = {};
  for (const [canonical, aliasList] of Object.entries(aliases ?? {})) {
    for (const alias of aliasList) map[alias] = canonical;
  }
  return map;
}

function primaryHeading(section: Section): string {
  return Array.isArray(section.heading) ? section.heading[0] : section.heading;
}

function findHeadingIndex(children: Root["children"], section: Section): number {
  const candidates = (Array.isArray(section.heading) ? section.heading : [section.heading]).map(
    (h) => `${section.number}. ${h}`,
  );
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    if (node.type !== "heading") continue;
    if (node.depth !== section.level) continue;
    if (candidates.includes(extractText(node).trim())) return i;
  }
  return -1;
}

function findSectionEnd(children: Root["children"], startIndex: number, level: number): number {
  for (let i = startIndex + 1; i < children.length; i++) {
    const node = children[i];
    if (node.type === "heading" && node.depth <= level) return i;
  }
  return children.length;
}

function findTable(children: Root["children"], start: number, end: number): Table | null {
  for (let i = start; i < end; i++) {
    const node = children[i];
    if (node.type === "table") return node;
  }
  return null;
}

function getHeaders(table: Table, aliasMap: Record<string, string>): string[] {
  if (table.children.length === 0) return [];
  return table.children[0].children.map((cell) => {
    const raw = extractText(cell).trim();
    return aliasMap[raw] !== undefined ? aliasMap[raw] : raw;
  });
}

// ── Validation ────────────────────────────────────────────────────────────────

function validateTable(
  table: Table,
  schema: TableSchema,
  aliasMap: Record<string, string>,
  file: VFile,
): void {
  const headers = getHeaders(table, aliasMap);
  const headerSet = new Set(headers);

  for (const col of schema.required_columns) {
    if (!headerSet.has(col)) {
      file.message(`必須列 "${col}" がテーブルにありません`, table);
    }
  }

  const knownColumns = new Set([...schema.required_columns, ...(schema.optional_columns ?? [])]);
  for (const h of headers) {
    if (!knownColumns.has(h)) {
      file.message(`スキーマ未定義の列 "${h}" があります`, table);
    }
  }

  const rules = schema.column_rules ?? {};
  const atLeastOneOf = schema.at_least_one_of ?? [];

  for (const row of table.children.slice(1) as TableRow[]) {
    const cellValues: Record<string, string> = {};
    for (let i = 0; i < headers.length; i++) {
      const cell = row.children[i];
      cellValues[headers[i]] = cell ? extractText(cell).trim() : "";
    }
    const rowId = cellValues["ID"] ?? "(unknown)";

    for (const [colName, rule] of Object.entries(rules)) {
      const value = cellValues[colName];
      if (value === undefined) continue;
      if (rule.enum && !rule.enum.includes(value)) {
        file.message(
          `${rowId}: 列 "${colName}" の値 "${value}" は無効です（許容値: ${rule.enum.join(" | ")}）`,
          row,
        );
      }
      if (rule.pattern && !new RegExp(rule.pattern).test(value)) {
        file.message(
          `${rowId}: 列 "${colName}" の値 "${value}" がパターン ${rule.pattern} に一致しません`,
          row,
        );
      }
    }

    for (const group of atLeastOneOf) {
      const hasValue = group.some((col) => {
        const v = cellValues[col];
        return v !== undefined && v !== "-" && v !== "";
      });
      if (!hasValue) {
        file.message(`${rowId}: [${group.join(", ")}] のうち少なくとも1列に値が必要です`, row);
      }
    }
  }
}

function validateTree(tree: Root, schema: MdContentSchema, file: VFile): void {
  const aliasMap = buildAliasMap(schema.column_aliases);
  for (const section of schema.sections) {
    const idx = findHeadingIndex(tree.children, section);
    if (idx === -1) {
      if (section.required) {
        file.message(
          `必須セクション "${section.number}. ${primaryHeading(section)}" が見つかりません`,
        );
      }
      continue;
    }
    if (!section.table) continue;

    const end = findSectionEnd(tree.children, idx, section.level);
    const table = findTable(tree.children, idx + 1, end);
    if (!table) {
      file.message(
        `セクション "${section.number}. ${primaryHeading(section)}" にテーブルがありません`,
        tree.children[idx],
      );
      continue;
    }
    validateTable(table, section.table, aliasMap, file);
  }
}

// ── Plugin ────────────────────────────────────────────────────────────────────

const remarkMdContent: Plugin<[MdContentOptions], Root> = function (options) {
  const schemas = options.schemas ?? {};
  const workspaceRoot = options.workspaceRoot ?? process.cwd();

  return function transformer(tree: Root, file: VFile): void {
    const currentPath = file.path ? resolve(String(file.path)) : "";
    if (!currentPath) return;
    const relativePath = toPosix(relative(workspaceRoot, currentPath));

    for (const [schemaRelPath, globs] of Object.entries(schemas)) {
      if (!matchesAnyGlob(relativePath, globs)) continue;
      const absSchemaPath = resolve(workspaceRoot, schemaRelPath);
      let schema: MdContentSchema;
      try {
        schema = loadSchema(absSchemaPath);
      } catch (err) {
        file.message(`スキーマ読み込みエラー (${schemaRelPath}): ${(err as Error).message}`);
        continue;
      }
      validateTree(tree, schema, file);
    }
  };
};

export default remarkMdContent;
