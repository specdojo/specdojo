import { existsSync, readFileSync } from "node:fs";
import type { Approach, TaskMode } from "./agent-types.js";
import {
  resolveSpecdojoPath,
  resolveSpecdojoPathIfExists,
  specdojoReferencePath,
} from "./template-resolution.js";

export const MISSING = "_MISSING_";

const COMMON_CONVENTIONS_TEMPLATE = "xp-common-conventions-template.md";
const COMMON_CONVENTIONS_PLACEHOLDER = "_COMMON_CONVENTIONS_";
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

function conventionsReferenceSentence(referencePaths: string[]): string {
  const references = referencePaths.map((path) => `\`${path}\``).join("、");
  return (
    `作業を始める前に、共通の規約の詳細 ${references} を読み、その内容に従う。` +
    "次の箇条書きは、そのうち守らないと失敗に直結する要点である。"
  );
}

function planConventionsText(fragmentPaths: string[], cache: Map<string, string>): string {
  const fragments = fragmentPaths.map((path) => readTemplate(path, cache));
  const essentials = fragments.map((fragment) =>
    extractMarkedBlock(fragment, PLAN_ESSENTIALS_START, PLAN_ESSENTIALS_END),
  );
  // マーカーのないローカル断片は全文を載せる従来の契約を維持する。
  if (essentials.every((block) => block === null)) {
    return fragments
      .map((fragment) => fragment.trim())
      .filter(Boolean)
      .join("\n\n");
  }
  const heading =
    fragments[0].split("\n").find((line) => line.startsWith("## ")) ?? DEFAULT_CONVENTIONS_HEADING;
  const content = fragments
    .map((fragment, index) => {
      const essential = essentials[index];
      if (essential !== null && essential !== undefined) return essential;
      // 共通断片の見出しは上で案内とともに配置するため、全文との重複を避ける。
      return (index === 0 ? fragment.replace(/^## .+$/m, "") : fragment).trim();
    })
    .filter(Boolean)
    .reduce((previous, next) => {
      const continuesList = previous.split("\n").at(-1)?.startsWith("- ") && next.startsWith("- ");
      return previous ? `${previous}${continuesList ? "\n" : "\n\n"}${next}` : next;
    }, "");
  return [
    heading,
    conventionsReferenceSentence(fragmentPaths.map((path) => specdojoReferencePath(path))),
    content,
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function injectCommonConventions(
  body: string,
  schemaRef: string,
  cache: Map<string, string>,
  mode: TaskMode = "edit",
): string {
  const fragmentPaths = [
    execTemplatePath(COMMON_CONVENTIONS_TEMPLATE),
    execTemplatePath(`${templatePrefix(mode)}-common-conventions-template.md`),
  ];
  let conventions = planConventionsText(fragmentPaths, cache);
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
