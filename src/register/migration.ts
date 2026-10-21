import { randomUUID } from "node:crypto";
import { existsSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import {
  buildRegisterItemContent,
  locateRegisterTable,
  parsePjrIndex,
  slugify,
  validateFields,
} from "./core.js";
import type { RegisterPaths } from "./command-types.js";
import {
  applyRegisterItemFields,
  loadRegisterItemDocs,
  prependRegisterItemDescription,
  readRegisterItemContent,
  registerItemFieldsFromItem,
  setRegisterItemTitle,
  type PjrItem,
} from "./item.js";
import { resolveSpecdojoTemplatePath } from "../docs/template-resolution.js";
import { loadRegisterItems } from "./views.js";

// ================================
// Legacy Register Migration
// ================================

export type RegisterMigrationFile = {
  path: string;
  content: string;
  originalContent?: string;
};

export type RegisterMigrationPlan = {
  sourceCount: number;
  createdCount: number;
  updatedCount: number;
  unchangedCount: number;
  files: RegisterMigrationFile[];
  sourceIndexPath?: string;
  sourceIndexContent?: string;
};

const REGISTER_ITEM_VALUE_KEYS: (keyof PjrItem)[] = [
  "id",
  "status",
  "title",
  "description",
  "type",
  "priority",
  "owner",
  "registeredAt",
  "due",
  "completedAt",
  "conclusion",
];

// pjr-index の表セルだけで必要だった pipe のエスケープを本文へ持ち込まない。
function tableCellToBody(value: string): string {
  return value.replace(/\\\|/g, "|");
}

function migrationTopic(title: string): string {
  return slugify(tableCellToBody(title)).slice(0, 64).replace(/-+$/g, "") || "item";
}

function assertMigratedItemMatches(source: PjrItem, content: string, filename: string): void {
  const migrated = readRegisterItemContent(content, filename)?.item;
  if (!migrated) {
    throw new Error(`Failed to read planned register item: ${filename}`);
  }

  const mismatches = REGISTER_ITEM_VALUE_KEYS.filter((key) => migrated[key] !== source[key]);
  if (mismatches.length > 0) {
    const detail = mismatches
      .map((key) => `${key}: ${JSON.stringify(source[key])} -> ${JSON.stringify(migrated[key])}`)
      .join(", ");
    throw new Error(`Migration verification failed for ${source.id}: ${detail}`);
  }
}

// 追跡対象の旧 pjr-index と、すでに frontmatter 正本へ移った個票を統合して移行計画を作る。
// この段階では書き込みを行わず、全件の変換結果が元の項目値と一致してから計画を返す。
export function planRegisterMigration(paths: RegisterPaths): RegisterMigrationPlan {
  const docs = loadRegisterItemDocs(paths.projectRegisterPath);
  const duplicateDocIds = docs
    .map((doc) => doc.id)
    .filter((id, index, ids) => ids.indexOf(id) !== index);
  if (duplicateDocIds.length > 0) {
    throw new Error(
      `Duplicate register item ticket IDs: ${[...new Set(duplicateDocIds)].join(", ")}`,
    );
  }

  if (!existsSync(paths.pjrIndexPath)) {
    const notMigrated = docs.filter((doc) => !doc.hasRegisterFields);
    if (notMigrated.length > 0) {
      throw new Error(
        `Legacy pjr-index.md is missing, but ${notMigrated.length} ticket(s) have no register item fields: ` +
          notMigrated.map((doc) => doc.id).join(", "),
      );
    }
    return {
      sourceCount: docs.length,
      createdCount: 0,
      updatedCount: 0,
      unchangedCount: docs.length,
      files: [],
    };
  }

  const sourceIndexContent = readFileSync(paths.pjrIndexPath, "utf8");
  const timeZone = paths.registerDateTimeZone;
  // 旧構成の pjr-index.md が一覧テーブルを持たない参照案内だった場合もある。
  // その案内ページは、旧一覧が存在しない場合と同じ no-op として扱う。
  if (!locateRegisterTable(sourceIndexContent.split("\n"))) {
    const notMigrated = docs.filter((doc) => !doc.hasRegisterFields);
    if (notMigrated.length > 0) {
      throw new Error(
        `Legacy pjr-index table is missing, but ${notMigrated.length} ticket(s) have no register item fields: ` +
          notMigrated.map((doc) => doc.id).join(", "),
      );
    }
    return {
      sourceCount: docs.length,
      createdCount: 0,
      updatedCount: 0,
      unchangedCount: docs.length,
      files: [],
    };
  }
  const indexItems = parsePjrIndex(sourceIndexContent, timeZone);
  const duplicateIndexIds = indexItems
    .map((item) => item.id)
    .filter((id, index, ids) => ids.indexOf(id) !== index);
  if (duplicateIndexIds.length > 0) {
    throw new Error(`Duplicate pjr-index IDs: ${[...new Set(duplicateIndexIds)].join(", ")}`);
  }

  // loadRegisterItems は移行済み個票を優先し、未移行項目だけ旧一覧を読む。これにより、
  // runner がすでに遷移させた item_status を古い一覧行で巻き戻さない。
  const sources = loadRegisterItems(paths);
  if (sources.length !== indexItems.length) {
    throw new Error(
      `Register item count mismatch before migration: index=${indexItems.length}, resolved=${sources.length}`,
    );
  }

  const docsById = new Map(docs.map((doc) => [doc.id, doc]));
  const files: RegisterMigrationFile[] = [];
  let createdCount = 0;
  let updatedCount = 0;
  let unchangedCount = 0;

  for (const source of sources) {
    validateFields({
      type: source.item.type,
      priority: source.item.priority,
      status: source.item.status,
      registeredAt: source.item.registeredAt,
      due: source.item.due,
      completedAt: source.item.completedAt,
    });
    const existing = docsById.get(source.id);
    let filename: string;
    let path: string;
    let originalContent: string | undefined;
    let content: string;

    if (existing) {
      filename = existing.filename;
      path = existing.path;
      originalContent = readFileSync(path, "utf8");
      content = originalContent;

      if (source.source === "index") {
        if (existing.item.title !== source.item.title) {
          content = setRegisterItemTitle(content, tableCellToBody(source.item.title));
        }
        if (existing.item.description !== source.item.description) {
          content = prependRegisterItemDescription(
            content,
            tableCellToBody(source.item.description),
          );
        }
        content = applyRegisterItemFields(content, registerItemFieldsFromItem(source.item));
      }
    } else {
      const topic = migrationTopic(source.item.title);
      filename = `pjr-${source.id.slice("PJR-".length).toLowerCase()}-${topic}.md`;
      path = join(paths.projectRegisterPath, filename);
      if (existsSync(path)) {
        throw new Error(`Migration target already exists: ${path}`);
      }
      const templatePath = resolveSpecdojoTemplatePath(`pjr-${source.item.type}-template.md`);
      content = buildRegisterItemContent({
        projectId: paths.projectId,
        displayId: source.item.id,
        topic,
        fields: {
          type: source.item.type,
          title: tableCellToBody(source.item.title),
          description: tableCellToBody(source.item.description),
          priority: source.item.priority,
          ...(source.item.difficulty ? { difficulty: source.item.difficulty } : {}),
          status: source.item.status,
          owner: source.item.owner,
          registeredAt: source.item.registeredAt,
          due: source.item.due,
          completedAt: source.item.completedAt,
          conclusion: source.item.conclusion,
        },
        templatePath,
      });
      // 旧一覧のセルでは問題にならなかった `_CAPITAL_CASE_` などを本文へ移すと、
      // markdownlint が underscore emphasis と解釈する。表示値を変えずに規則だけ抑止する。
      if (/_[A-Z][A-Z0-9_]*_/.test(`${source.item.title}\n${source.item.description}`)) {
        content = content.replace(
          /^(---\r?\n[\s\S]*?\r?\n---\r?\n)/,
          "$1\n<!-- markdownlint-disable MD049 -->\n",
        );
      }
    }

    assertMigratedItemMatches(source.item, content, filename);
    if (content === originalContent) {
      unchangedCount++;
    } else {
      files.push({ path, content, originalContent });
      if (originalContent === undefined) createdCount++;
      else updatedCount++;
    }
  }

  return {
    sourceCount: sources.length,
    createdCount,
    updatedCount,
    unchangedCount,
    files,
    sourceIndexPath: paths.pjrIndexPath,
    sourceIndexContent,
  };
}

type StagedMigrationFile = RegisterMigrationFile & {
  stagedPath: string;
  backupPath?: string;
};

// 全出力を同一ディレクトリ内の一時ファイルへ書いてから切り替える。切り替え途中で失敗した
// 場合は既存ファイルと旧一覧を戻し、作成途中の個票を除去して部分適用を残さない。
export function applyRegisterMigrationPlan(plan: RegisterMigrationPlan): void {
  if (plan.files.length === 0 && !plan.sourceIndexPath) return;

  if (plan.sourceIndexPath) {
    if (!existsSync(plan.sourceIndexPath)) {
      throw new Error(`Migration source changed after planning: missing ${plan.sourceIndexPath}`);
    }
    if (readFileSync(plan.sourceIndexPath, "utf8") !== plan.sourceIndexContent) {
      throw new Error(`Migration source changed after planning: ${plan.sourceIndexPath}`);
    }
  }
  for (const file of plan.files) {
    if (file.originalContent === undefined) {
      if (existsSync(file.path)) {
        throw new Error(`Migration target appeared after planning: ${file.path}`);
      }
    } else if (!existsSync(file.path) || readFileSync(file.path, "utf8") !== file.originalContent) {
      throw new Error(`Migration target changed after planning: ${file.path}`);
    }
  }

  const transactionId = randomUUID();
  const staged: StagedMigrationFile[] = [];
  let indexBackupPath: string | undefined;

  try {
    for (const file of plan.files) {
      const stagedPath = join(
        dirname(file.path),
        `.specdojo-migrate-${transactionId}-${basename(file.path)}`,
      );
      staged.push({ ...file, stagedPath });
      writeFileSync(stagedPath, file.content, { encoding: "utf8", flag: "wx" });
    }

    for (const file of staged) {
      if (file.originalContent !== undefined) {
        file.backupPath = `${file.stagedPath}.backup`;
        renameSync(file.path, file.backupPath);
      }
      renameSync(file.stagedPath, file.path);
    }

    if (plan.sourceIndexPath) {
      indexBackupPath = join(
        dirname(plan.sourceIndexPath),
        `.specdojo-migrate-${transactionId}-${basename(plan.sourceIndexPath)}.backup`,
      );
      renameSync(plan.sourceIndexPath, indexBackupPath);
    }
  } catch (error) {
    if (indexBackupPath && existsSync(indexBackupPath) && plan.sourceIndexPath) {
      if (existsSync(plan.sourceIndexPath)) unlinkSync(plan.sourceIndexPath);
      renameSync(indexBackupPath, plan.sourceIndexPath);
    }
    for (const file of [...staged].reverse()) {
      if (existsSync(file.stagedPath)) unlinkSync(file.stagedPath);
      if (file.backupPath && existsSync(file.backupPath)) {
        if (existsSync(file.path)) unlinkSync(file.path);
        renameSync(file.backupPath, file.path);
      } else if (file.originalContent === undefined && existsSync(file.path)) {
        unlinkSync(file.path);
      }
    }
    throw error;
  }

  // バックアップ除去は切り替え完了後に行う。ここで一時ファイルの除去に失敗しても、
  // 正本の切り替え自体は完了しているため migration を巻き戻さない。
  for (const file of staged) {
    if (file.backupPath && existsSync(file.backupPath)) {
      try {
        unlinkSync(file.backupPath);
      } catch {
        // 正本は切り替え済み。一時バックアップは次回の手動清掃対象として残す。
      }
    }
  }
  if (indexBackupPath && existsSync(indexBackupPath)) {
    try {
      unlinkSync(indexBackupPath);
    } catch {
      // 正本は切り替え済み。一時バックアップは次回の手動清掃対象として残す。
    }
  }
}
