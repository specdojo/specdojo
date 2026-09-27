import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

// PJR-H220 / PJR-VJP8: 観点の document_kinds は rulebook ID の列挙で宣言する。rulebook を
// 追加したときに観点ごとの扱いの判断が漏れないよう、include / exclude / confirmed_default の
// どれにも載っていない rulebook を一覧にする。confirmed_default は判断の記録であり、適用判定
// （review-plan.ts の viewpointAppliesToDocument）には影響しない。

export const DEFAULT_VIEWPOINTS_PATH = "docs/ja/specdojo/defaults/pm-review-viewpoints.yaml";
export const DEFAULT_RULEBOOK_DIR = "docs/ja/specdojo/rulebooks";

const DECISION_FIELDS = ["include", "exclude", "confirmed_default"] as const;
type DecisionField = (typeof DECISION_FIELDS)[number];

export type ViewpointDocumentKindsFinding =
  | { kind: "undecided"; viewpointId: string; rulebookId: string }
  | { kind: "unknown-rulebook"; viewpointId: string; field: DecisionField; rulebookId: string }
  | { kind: "duplicate"; viewpointId: string; rulebookId: string; fields: DecisionField[] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function rulebookIdFromMarkdown(markdown: string, filePath: string): string | undefined {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return undefined;
  let parsed: unknown;
  try {
    parsed = yaml.load(match[1]);
  } catch (error) {
    throw new Error(`Invalid rulebook frontmatter: ${filePath}`, { cause: error });
  }
  const specdojo = isRecord(parsed) && isRecord(parsed["specdojo"]) ? parsed["specdojo"] : {};
  const id = specdojo["id"];
  if (specdojo["type"] !== "rulebook" || typeof id !== "string" || !id.trim()) return undefined;
  return id;
}

/** Collect rulebook IDs from `*-rulebook.md` frontmatter, sorted for stable output. */
export function collectRulebookIds(rulebookDir = DEFAULT_RULEBOOK_DIR): string[] {
  const ids = readdirSync(rulebookDir)
    .filter((name) => name.endsWith("-rulebook.md"))
    .flatMap((name) => {
      const filePath = path.join(rulebookDir, name);
      const id = rulebookIdFromMarkdown(readFileSync(filePath, "utf8"), filePath);
      return id ? [id] : [];
    });
  return [...new Set(ids)].sort((left, right) => left.localeCompare(right));
}

/**
 * A viewpoint that enumerates rulebook IDs in `document_kinds` must decide every rulebook:
 * list it in include / exclude, or record in confirmed_default that the unlisted outcome
 * was reviewed. Viewpoints without any of those lists apply to every kind and are skipped.
 */
export function lintViewpointDocumentKinds(
  viewpointsDoc: unknown,
  rulebookIds: readonly string[],
): ViewpointDocumentKindsFinding[] {
  const viewpoints =
    isRecord(viewpointsDoc) && Array.isArray(viewpointsDoc["viewpoints"])
      ? viewpointsDoc["viewpoints"]
      : [];
  const known = new Set(rulebookIds);
  const findings: ViewpointDocumentKindsFinding[] = [];

  for (const viewpoint of viewpoints) {
    if (!isRecord(viewpoint) || typeof viewpoint["id"] !== "string") continue;
    const declaration = viewpoint["document_kinds"];
    if (!isRecord(declaration)) continue;
    if (!DECISION_FIELDS.some((field) => declaration[field] !== undefined)) continue;

    const viewpointId = viewpoint["id"];
    const decided = new Map<string, DecisionField[]>();
    for (const field of DECISION_FIELDS) {
      for (const rulebookId of stringList(declaration[field])) {
        decided.set(rulebookId, [...(decided.get(rulebookId) ?? []), field]);
        if (!known.has(rulebookId)) {
          findings.push({ kind: "unknown-rulebook", viewpointId, field, rulebookId });
        }
      }
    }
    for (const [rulebookId, fields] of decided) {
      if (fields.length > 1) findings.push({ kind: "duplicate", viewpointId, rulebookId, fields });
    }
    for (const rulebookId of rulebookIds) {
      if (!decided.has(rulebookId)) findings.push({ kind: "undecided", viewpointId, rulebookId });
    }
  }
  return findings;
}

export function formatViewpointDocumentKindsFinding(
  finding: ViewpointDocumentKindsFinding,
): string {
  switch (finding.kind) {
    case "undecided":
      return `${finding.viewpointId}: ${finding.rulebookId} is not decided (add it to document_kinds.include / exclude, or to confirmed_default to keep the default)`;
    case "unknown-rulebook":
      return `${finding.viewpointId}: document_kinds.${finding.field} lists unknown rulebook ${finding.rulebookId}`;
    case "duplicate":
      return `${finding.viewpointId}: ${finding.rulebookId} is listed in more than one of document_kinds.${finding.fields.join(" / ")}`;
  }
}

/** Returns error lines; an empty array means every enumerating viewpoint is fully decided. */
export function checkViewpointDocumentKinds(
  viewpointsPath = DEFAULT_VIEWPOINTS_PATH,
  rulebookDir = DEFAULT_RULEBOOK_DIR,
): { rulebookCount: number; errors: string[] } {
  const rulebookIds = collectRulebookIds(rulebookDir);
  if (rulebookIds.length === 0) {
    return { rulebookCount: 0, errors: [`No rulebooks found: ${rulebookDir}`] };
  }
  const doc = yaml.load(readFileSync(viewpointsPath, "utf8"));
  const errors = lintViewpointDocumentKinds(doc, rulebookIds).map(
    formatViewpointDocumentKindsFinding,
  );
  return { rulebookCount: rulebookIds.length, errors };
}

function main(): void {
  const { rulebookCount, errors } = checkViewpointDocumentKinds();
  if (errors.length === 0) {
    process.stdout.write(
      `${DEFAULT_VIEWPOINTS_PATH}: document_kinds decisions cover all ${rulebookCount} rulebooks\n`,
    );
    return;
  }
  process.stderr.write(`${DEFAULT_VIEWPOINTS_PATH}: document_kinds decisions are incomplete\n`);
  for (const line of errors) process.stderr.write(`  - ${line}\n`);
  process.exitCode = 1;
}

const invokedPath = process.argv[1];
if (invokedPath && path.resolve(invokedPath) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    process.stderr.write(
      `viewpoint document_kinds check failed: ${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 1;
  }
}
