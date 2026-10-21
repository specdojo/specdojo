import { existsSync, readFileSync } from "node:fs";
import type { Approach, TaskMode } from "./agent-types.js";
import {
  resolveSpecdojoPath,
  resolveSpecdojoPathIfExists,
  specdojoReferencePath,
} from "./template-resolution.js";

export const MISSING = "_MISSING_";

const COMMON_CONVENTIONS_TEMPLATE = "xep-common-conventions-template.md";
const COMMON_CONVENTIONS_PLACEHOLDER = "_COMMON_CONVENTIONS_";
const REVIEW_ONLY_START = "<!-- review-only:start -->";
const REVIEW_ONLY_END = "<!-- review-only:end -->";
const PLAN_ESSENTIALS_START = "<!-- plan-essentials:start -->";
const PLAN_ESSENTIALS_END = "<!-- plan-essentials:end -->";
const DEFAULT_CONVENTIONS_HEADING = "## 共通: 記法・成果物規約";
const SCHEMA_REF_PLACEHOLDER = "_SCHEMA_REF_";

export function execTemplatesDir(): string {
  return resolveSpecdojoPath("docs/ja/specdojo/exec-templates");
}

export function execTemplatePath(fileName: string): string {
  return resolveSpecdojoPath(`docs/ja/specdojo/exec-templates/${fileName}`);
}

function templatePrefix(mode: TaskMode): string {
  return mode === "review" ? "xrp" : "xep";
}

function standardTemplateFileName(mode: TaskMode): string {
  return `${templatePrefix(mode)}-template.md`;
}

function approachTemplateFileName(mode: TaskMode, approach: Approach): string {
  return `${templatePrefix(mode)}-${approach}-template.md`;
}

function resolvePlanTemplatePath(mode: TaskMode, approach: Approach | undefined): string {
  if (approach) {
    const candidatePath = resolveSpecdojoPathIfExists(
      `docs/ja/specdojo/exec-templates/${approachTemplateFileName(mode, approach)}`,
    );
    if (candidatePath) return candidatePath;
  }
  return execTemplatePath(standardTemplateFileName(mode));
}

function readTemplate(templatePath: string, cache: Map<string, string>): string {
  const cached = cache.get(templatePath);
  if (cached !== undefined) return cached;
  if (!existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }
  const content = readFileSync(templatePath, "utf8");
  cache.set(templatePath, content);
  return content;
}

export function loadPlanTemplate(
  mode: TaskMode,
  approach: Approach | undefined,
  cache: Map<string, string>,
): string {
  return readTemplate(resolvePlanTemplatePath(mode, approach), cache);
}

function extractMarkedBlock(text: string, start: string, end: string): string | null {
  const lines = text.split("\n");
  const startIndex = lines.findIndex((line) => line.trim() === start);
  if (startIndex < 0) return null;
  const endOffset = lines.slice(startIndex + 1).findIndex((line) => line.trim() === end);
  if (endOffset < 0) return null;
  return lines
    .slice(startIndex + 1, startIndex + 1 + endOffset)
    .join("\n")
    .trim();
}

function conventionsReferenceSentence(referencePath: string): string {
  return (
    `作業を始める前に、共通の規約の詳細 \`${referencePath}\` を読み、その内容に従う。` +
    "次の箇条書きは、そのうち守らないと失敗に直結する要点である。"
  );
}

function selectReviewOnlyBlock(conventions: string, isReview: boolean): string {
  const kept: string[] = [];
  let inside = false;
  for (const line of conventions.split("\n")) {
    const marker = line.trim();
    if (marker === REVIEW_ONLY_START) {
      inside = true;
      continue;
    }
    if (marker === REVIEW_ONLY_END) {
      inside = false;
      continue;
    }
    if (!inside || isReview) kept.push(line);
  }
  return kept
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd();
}

function planConventionsText(fragment: string, referencePath: string, isReview: boolean): string {
  const essentials = extractMarkedBlock(fragment, PLAN_ESSENTIALS_START, PLAN_ESSENTIALS_END);
  if (essentials === null) return selectReviewOnlyBlock(fragment, isReview);
  const heading =
    fragment.split("\n").find((line) => line.startsWith("## ")) ?? DEFAULT_CONVENTIONS_HEADING;
  const sections = [heading, conventionsReferenceSentence(referencePath), essentials];
  if (isReview) {
    const reviewOnly = extractMarkedBlock(fragment, REVIEW_ONLY_START, REVIEW_ONLY_END);
    if (reviewOnly) sections.push(reviewOnly);
  }
  return sections.join("\n\n");
}

export function injectCommonConventions(
  body: string,
  schemaRef: string,
  cache: Map<string, string>,
  mode: TaskMode = "edit",
): string {
  const fragmentPath = execTemplatePath(COMMON_CONVENTIONS_TEMPLATE);
  let conventions = planConventionsText(
    readTemplate(fragmentPath, cache),
    specdojoReferencePath(fragmentPath),
    mode === "review",
  );
  conventions =
    schemaRef === MISSING
      ? conventions
          .split("\n")
          .filter((line) => !line.includes(SCHEMA_REF_PLACEHOLDER))
          .join("\n")
      : conventions.split(SCHEMA_REF_PLACEHOLDER).join(schemaRef);
  if (body.includes(COMMON_CONVENTIONS_PLACEHOLDER)) {
    return body.split(COMMON_CONVENTIONS_PLACEHOLDER).join(conventions);
  }
  return `${body.trimEnd()}\n\n${conventions}\n`;
}
