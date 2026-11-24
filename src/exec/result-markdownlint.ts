import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { join, relative, sep } from "node:path";
import type { MarkdownItFactory, Rule } from "markdownlint";
import type { ExecEvidence } from "./evidence.js";
import type { ReporterOutput } from "./reporter-output.js";
import { markdownlintApi, planLintConfig } from "./plan-markdownlint.js";
import { renderReporterResultContent } from "./results.js";

// The repository's lint:md adds this rule to markdownlint-cli. The commit check does not load
// it, but the parent lint-md validation does, so the pre-write check applies it when present.
const CHINESE_GLYPHS_RULE_PATH = join(
  "packages",
  "docs-lint",
  "src",
  "markdownlint-rule-no-chinese-glyphs.cjs",
);

export type ResultLintIssue = {
  lineNumber: number;
  rule: string;
  description: string;
  detail?: string;
  line: string;
};

// Same whitespace normalization as normalizeResultWhitespace before the commit check.
export function normalizeResultWhitespaceContent(content: string): string {
  return content.replace(/[ \t]+$/gm, "").replace(/\n*$/, "\n");
}

// The custom rule needs the markdown-it parser; markdownlint-cli supplies it the same way.
// When the rule or markdown-it is unavailable, lint with the commit check's rules only.
function repositoryCustomRules(
  repoRoot: string,
): { customRules: Rule[]; markdownItFactory: MarkdownItFactory } | undefined {
  const rulePath = join(repoRoot, CHINESE_GLYPHS_RULE_PATH);
  if (!existsSync(rulePath)) return undefined;
  for (const require of [
    createRequire(join(repoRoot, "package.json")),
    createRequire(import.meta.url),
  ]) {
    try {
      const markdownIt = require("markdown-it") as (options: {
        html: boolean;
      }) => Awaited<ReturnType<MarkdownItFactory>>;
      const rule = require(rulePath) as Rule;
      return { customRules: [rule], markdownItFactory: () => markdownIt({ html: true }) };
    } catch {
      // Try the next installation.
    }
  }
  return undefined;
}

/**
 * Lints result Markdown with the rules of the pre-commit result check (repository
 * markdownlint configuration, or SpecDojo defaults). Returns undefined when markdownlint is
 * unavailable, matching the commit check, which then defers to the commit hook.
 */
export async function lintResultMarkdown(
  repoRoot: string,
  resultPath: string,
  content: string,
): Promise<ResultLintIssue[] | undefined> {
  let api: Awaited<ReturnType<typeof markdownlintApi>>;
  try {
    api = await markdownlintApi(repoRoot);
  } catch {
    return undefined;
  }
  const name = relative(repoRoot, resultPath).split(sep).join("/");
  const normalized = normalizeResultWhitespaceContent(content);
  const lines = normalized.split("\n");
  const issues =
    api.lint({
      strings: { [name]: normalized },
      config: planLintConfig(repoRoot, api),
      configParsers: api.parsers,
      ...repositoryCustomRules(repoRoot),
    })[name] ?? [];
  return issues.map((issue) => ({
    lineNumber: issue.lineNumber,
    rule: issue.ruleNames.join("/"),
    description: issue.ruleDescription,
    ...(issue.errorDetail ? { detail: issue.errorDetail } : {}),
    line: lines[issue.lineNumber - 1] ?? "",
  }));
}

export function formatResultLintIssues(issues: ResultLintIssue[]): string {
  const listed = issues.slice(0, 20).map((issue) => {
    const detail = issue.detail ? ` [${issue.detail}]` : "";
    return `line ${issue.lineNumber} ${issue.rule} ${issue.description}${detail}: ${JSON.stringify(issue.line.slice(0, 200))}`;
  });
  if (issues.length > listed.length) listed.push(`... ${issues.length - listed.length} more`);
  return `result Markdown notation violation before writing (fix the JSON prose that produced these rendered lines; do not put Markdown headings, code fences, bare URLs, escaped backticks, or Chinese simplified glyphs in free-text fields):\n${listed.join("\n")}`;
}

/**
 * Returns a reporter output validator that renders the result in memory and lints it before
 * the runner writes it. A violation message is fed back to the reporter as a format retry.
 */
export function resultMarkdownlintValidator(params: {
  repoRoot: string;
  resultPath: string | undefined;
  evidence: ExecEvidence;
}): ((output: ReporterOutput) => Promise<string | undefined>) | undefined {
  const { resultPath } = params;
  if (!resultPath) return undefined;
  return async (output) => {
    let content: string;
    try {
      content = renderReporterResultContent(resultPath, output, params.evidence);
    } catch {
      // Rendering errors are reported by renderReporterResult after the retry loop.
      return undefined;
    }
    const issues = await lintResultMarkdown(params.repoRoot, resultPath, content);
    return issues && issues.length > 0 ? formatResultLintIssues(issues) : undefined;
  };
}
