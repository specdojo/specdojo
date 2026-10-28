import { existsSync, mkdirSync, readFileSync, renameSync, rmSync } from "node:fs";
import { join, relative } from "node:path";
import { specdojoRootDir } from "../shared/specdojo-config.js";
import { nowUtcIsoSeconds, randomHex, tsForFilenameUtc } from "./shared.js";
import type { Approach, TaskMode, TaskOrigin } from "./types.js";
import { readSpecdojoNamespace } from "../docs/frontmatter-namespace.js";
import { gradeResultPathForDocument, readGradeResultForDocument } from "../shared/grade-result.js";
import { lookupDocIndex } from "../docs/doc-index.js";
import { planGradeFindingText } from "./plans-grade-findings.js";

export function archivePlan(
  opts: { executionPath: string; slug: string; delete?: boolean },
  dependencies: {
    now?: () => string;
    randomHex?: (bytes: number) => string;
  } = {},
): {
  from: string;
  to?: string;
  deleted: boolean;
} {
  const plansDir = join(opts.executionPath, "exec", "plans");
  const from = join(plansDir, `${opts.slug}-plan.md`);
  if (!existsSync(from)) throw new Error(`plan not found: ${from}`);

  if (opts.delete) {
    rmSync(from, { force: true });
    return { from, deleted: true };
  }

  const doneDir = join(plansDir, "done");
  mkdirSync(doneDir, { recursive: true });
  const now = dependencies.now ?? nowUtcIsoSeconds;
  const makeRandomHex = dependencies.randomHex ?? randomHex;
  const stamp = tsForFilenameUtc(now());
  const base = `${opts.slug}-${stamp}-${makeRandomHex(4)}`;
  let sequence = 0;
  let to = join(doneDir, `${base}-plan.md`);
  while (existsSync(to)) {
    sequence += 1;
    to = join(doneDir, `${base}-${sequence}-plan.md`);
  }
  renameSync(from, to);
  return { from, to, deleted: false };
}

export function planPathForTask(executionPath: string, taskId: string): string {
  return join(executionPath, "exec", "plans", `${taskId}-plan.md`);
}

export function loadPlan(executionPath: string, taskId: string): string | null {
  const planPath = planPathForTask(executionPath, taskId);
  if (existsSync(planPath)) return readFileSync(planPath, "utf8");
  return null;
}

// Task identity recovered from a plan file's frontmatter, used to scaffold a
// result when running a bring-your-own --plan (no managed task identity exists).
export type PlanTaskIdentity = {
  taskId: string;
  mode: TaskMode;
  projectId: string;
  approach?: Approach;
  // タスクの出自。register は登録簿項目の実行で、対象成果物を持たない。
  origin?: TaskOrigin;
  // plan frontmatter の targets（対象文書の doc id リスト）。先頭は対象成果物。
  targets?: string[];
};

const PLAN_APPROACHES: readonly Approach[] = [
  "fully-guided",
  "recipe-guided",
  "freeform",
  "bootstrap",
  "catalog-planning",
  "strategy-planning",
  "rulebook-authoring",
  "recipe-authoring",
  "sample-authoring",
  "template-authoring",
  "retrofit",
  "cross-deliverable-dedup",
  "rulebook-maintenance",
  "recipe-maintenance",
  "sample-maintenance",
  "template-maintenance",
  "finalize",
  "bootstrap-finalize",
];

// Parse an exec-plan file's frontmatter to recover the task identity. Returns
// null when the frontmatter is missing or has no usable task_id, in which case
// the caller treats the plan as an ad-hoc plan with no managed identity.
export function parsePlanTaskIdentity(planContent: string): PlanTaskIdentity | null {
  // exec-plan frontmatter は `specdojo:` 名前空間配下にある。
  const parsed = readSpecdojoNamespace(planContent);
  const taskId = typeof parsed.task_id === "string" ? parsed.task_id.trim() : "";
  if (!taskId) return null;

  const mode: TaskMode = parsed.mode === "review" ? "review" : "edit";
  const projectId = typeof parsed.project_id === "string" ? parsed.project_id.trim() : "";
  const approach =
    typeof parsed.approach === "string" &&
    (PLAN_APPROACHES as readonly string[]).includes(parsed.approach)
      ? (parsed.approach as Approach)
      : undefined;
  const targets = Array.isArray(parsed.targets)
    ? parsed.targets.filter((entry): entry is string => typeof entry === "string")
    : [];
  // 未知の値は採用せず undefined（= schedule）として扱う。
  const origin =
    parsed.origin === "register" || parsed.origin === "schedule"
      ? (parsed.origin as TaskOrigin)
      : undefined;

  return {
    taskId,
    mode,
    projectId,
    approach,
    ...(origin ? { origin } : {}),
    ...(targets.length > 0 ? { targets } : {}),
  };
}

export function registerGradeFindingsText(projectId: string, ticketPath: string): string {
  if (!existsSync(ticketPath)) return "- なし";
  const content = readFileSync(ticketPath, "utf8");
  const metadata = readSpecdojoNamespace(content);
  const targets = Array.isArray(metadata.targets)
    ? metadata.targets
        .filter((target): target is string => typeof target === "string")
        .map((target) => target.trim())
        .filter((target) => target.length > 0)
    : [];

  if (targets.length === 0) return "- なし";

  const docIndexPath = join(specdojoRootDir(), ".specdojo", "doc-index.json");
  const MAX_DOCS = 10;
  const MAX_FINDINGS = 20;

  const lines: string[] = [];

  let docCount = 0;
  for (const id of targets) {
    if (docCount >= MAX_DOCS) {
      lines.push(`- その他 ${targets.length - MAX_DOCS} 件の文書は省略されました`);
      break;
    }

    const targetPath = lookupDocIndex(id, docIndexPath);
    if (!targetPath) continue;

    const result = readGradeResultForDocument({ documentPath: targetPath, project: projectId });
    if (!result || result.findings.length === 0) {
      lines.push(`- [[${id}]]: finding なし`);
      docCount++;
      continue;
    }

    const sidecarPath = gradeResultPathForDocument({
      documentPath: targetPath,
      project: projectId,
    });
    // Use posix separators
    const sidecarRel = relative(specdojoRootDir(), sidecarPath).replace(/\\/g, "/");
    lines.push(`- [[${id}]] (サイドカー: \`${sidecarRel}\`):`);

    let findingCount = 0;
    for (const finding of result.findings) {
      if (findingCount >= MAX_FINDINGS) {
        lines.push(
          `  - 他 ${result.findings.length - MAX_FINDINGS} 件の finding があります。詳細はサイドカーを参照してください。`,
        );
        break;
      }
      lines.push(`  - ${planGradeFindingText(finding)}`);
      findingCount++;
    }
    docCount++;
  }

  if (lines.length === 0) return "- なし";
  return lines.join("\n");
}
