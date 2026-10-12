import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { isAbsolute, join, posix } from "node:path";

/**
 * Repository layout of one project, resolved from the config (base_path already applied).
 * Paths are repo-root relative. `projectPaths` lists every configured project document path;
 * `executionPath` is where exec run keeps its runtime lock directory.
 */
export type ProjectGitignoreLayout = {
  basePath?: string;
  projectPaths: string[];
  executionPath: string;
};

export type GitignoreMergeResult = {
  content: string;
  added: string[];
  skipped: string[];
};

export type EnsureGitignoreResult = GitignoreMergeResult & {
  gitignorePath: string;
  created: boolean;
  written: boolean;
};

export const GITIGNORE_HEADER = "# 依存と specdojo の生成物（specdojo config init が追記）";

export const NODE_MODULES_PATTERN = "node_modules/";

// このリポジトリの .gitignore と同じ既定の除外。docs/ 配下の配置はすべてこれで覆える。
// README の導入手順は npm install の直後に config init を実行するため、依存の node_modules/ も含める。
export const DEFAULT_GITIGNORE_PATTERNS = [
  NODE_MODULES_PATTERN,
  ".specdojo/doc-index.json",
  "docs/**/generated/*",
  "!docs/**/generated/.gitkeep",
  "docs/**/execution/exec/.locks/",
] as const;

// repo-root 相対の posix パスへ正規化する。リポジトリ外（絶対パス・`..`）や root 自身は
// 除外対象にできないため undefined を返す。
function normalizeRepoPath(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed || isAbsolute(trimmed)) return undefined;
  const normalized = posix.normalize(trimmed.replace(/\\/g, "/")).replace(/\/+$/, "");
  if (normalized === "" || normalized === "." || normalized.startsWith("..")) return undefined;
  return normalized;
}

function isUnderDocs(path: string): boolean {
  return path === "docs" || path.startsWith("docs/");
}

function generatedPatternsFor(root: string): string[] {
  return [`${root}/**/generated/*`, `!${root}/**/generated/.gitkeep`];
}

/**
 * Derive the .gitignore lines that keep specdojo build outputs untracked for the given layouts.
 * Layouts under docs/ are covered by the defaults; other layouts add patterns derived from
 * base_path, or from each configured path when base_path is absent.
 */
export function gitignorePatternsForLayouts(layouts: ProjectGitignoreLayout[]): string[] {
  const patterns: string[] = [...DEFAULT_GITIGNORE_PATTERNS];
  const push = (line: string): void => {
    if (!patterns.includes(line)) patterns.push(line);
  };

  for (const layout of layouts) {
    const base = normalizeRepoPath(layout.basePath);
    const roots = base
      ? [base]
      : layout.projectPaths.flatMap((path) => normalizeRepoPath(path) ?? []);
    for (const root of roots) {
      if (isUnderDocs(root)) continue;
      generatedPatternsFor(root).forEach(push);
    }

    const executionPath = normalizeRepoPath(layout.executionPath);
    if (!executionPath) continue;
    const coveredByDefault =
      isUnderDocs(executionPath) && posix.basename(executionPath) === "execution";
    if (!coveredByDefault) push(`${executionPath}/exec/.locks/`);
  }
  return patterns;
}

// 既存の .gitignore で node_modules/ と同じ意味（root の node_modules を除外する）になる行。
const NODE_MODULES_EQUIVALENTS = [
  "node_modules",
  "node_modules/",
  "/node_modules",
  "/node_modules/",
  "**/node_modules",
  "**/node_modules/",
] as const;

function isAlreadyPresent(present: Set<string>, pattern: string): boolean {
  if (present.has(pattern)) return true;
  if (pattern !== NODE_MODULES_PATTERN) return false;
  return NODE_MODULES_EQUIVALENTS.some((line) => present.has(line));
}

/**
 * Append the missing patterns to existing .gitignore content. Existing lines are never removed
 * or reordered, and the file's line ending (LF / CRLF) is preserved.
 */
export function mergeGitignore(existing: string, patterns: string[]): GitignoreMergeResult {
  const present = new Set(existing.split(/\r?\n/).map((line) => line.trim()));
  const added: string[] = [];
  const skipped: string[] = [];
  for (const pattern of patterns) {
    if (isAlreadyPresent(present, pattern) || added.includes(pattern)) {
      if (!skipped.includes(pattern)) skipped.push(pattern);
      continue;
    }
    added.push(pattern);
  }
  if (added.length === 0) return { content: existing, added, skipped };

  const eol = existing.includes("\r\n") ? "\r\n" : "\n";
  let content = existing;
  if (content.length > 0 && !content.endsWith("\n")) content += eol;
  if (content.length > 0) content += eol;
  content += [GITIGNORE_HEADER, ...added].join(eol) + eol;
  return { content, added, skipped };
}

/** Read `<repoRoot>/.gitignore`, append the missing patterns and write it back unless dryRun. */
export function ensureGitignore(
  repoRoot: string,
  patterns: string[],
  options: { dryRun: boolean },
): EnsureGitignoreResult {
  const gitignorePath = join(repoRoot, ".gitignore");
  const created = !existsSync(gitignorePath);
  const existing = created ? "" : readFileSync(gitignorePath, "utf8");
  const merged = mergeGitignore(existing, patterns);
  const shouldWrite = !options.dryRun && merged.added.length > 0;
  if (shouldWrite) writeFileSync(gitignorePath, merged.content, "utf8");
  return { ...merged, gitignorePath, created, written: shouldWrite };
}

export const UNTRACK_IGNORED_COMMAND =
  "git ls-files -ci --exclude-standard -z | xargs -0 -r git rm -r --cached --quiet";

/** Human-readable report of an ensureGitignore run, including the untrack guidance. */
export function formatGitignoreReport(result: EnsureGitignoreResult, dryRun: boolean): string {
  const lines: string[] = [];
  const addVerb = dryRun ? "Would add" : "Added";
  if (result.added.length === 0) {
    lines.push(
      `.gitignore already excludes node_modules/ and specdojo outputs:${result.gitignorePath}`,
    );
  } else {
    const action = result.created ? (dryRun ? "Would create" : "Created") : "Updated";
    lines.push(`${dryRun ? `${action} (dry-run)` : action}: ${result.gitignorePath}`);
    for (const line of result.added) lines.push(`  ${addVerb}: ${line}`);
  }
  for (const line of result.skipped) lines.push(`  Skipped (already present): ${line}`);
  if (result.added.length > 0) {
    lines.push(
      "If node_modules/ or specdojo outputs are already tracked by git, untrack them once and commit:",
      `  ${UNTRACK_IGNORED_COMMAND}`,
    );
  }
  return lines.join("\n") + "\n";
}
