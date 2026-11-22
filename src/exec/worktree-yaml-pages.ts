import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { YAML_PAGE_MARKER, yamlPageRelPath } from "../docs/yaml-pages.js";
import { gitResult } from "../shared/git.js";
import { redactSensitiveText } from "./evidence.js";
import {
  PARENT_VALIDATION_PROJECT_REPO,
  type ParentValidationBatchResult,
  type ParentValidationRoots,
} from "./parent-validation.js";
import { resolveWorktreeBuildCommand, worktreeBuildEnvironment } from "./worktree.js";

// PJR-TF6F: YAML の表示のページ（同じ階層の generated/<名前>.md）は git の管理外で、worktree の
// 準備のときに 1 回だけ作られる。executor が YAML を変えた後や、再開で統合先を取り込んだ後に
// 古いページのまま親の検証を流すと、壊れたページを統合の後まで見逃すため、親の検証の前に作り直す。

const SPECDOJO_CONFIG_REL = join(".specdojo", "specdojo.config.json");
const PAGE_SOURCE_DIRS = ["docs/ja", "docs/en"];
const YAML_SOURCE_RE = /^docs\/(?:ja|en)\/(?:.+\/)?[^/]+\.ya?ml$/;
const BUILD_OUTPUT_MAX_BUFFER = 16 * 1024 * 1024;

export type YamlPageSourceState = {
  /** mtime of the YAML source in ms. */
  sourceMtimeMs: number;
  /** mtime of the generated page in ms, or undefined when the page does not exist. */
  pageMtimeMs?: number;
  /** Whether the existing page carries the yaml-pages marker (foreign pages are never rebuilt). */
  pageIsYamlPage?: boolean;
};

/**
 * YAML sources whose display page is older than the source, plus changed YAML (uncommitted or
 * untracked) that has no page yet. YAML without a page and without changes is not a page target
 * (for example, YAML outside the doc index) and is ignored.
 */
export function selectStaleYamlPageSources(params: {
  yamlPaths: readonly string[];
  changedPaths: readonly string[];
  state: (yamlPath: string) => YamlPageSourceState | undefined;
}): string[] {
  const changed = new Set(params.changedPaths);
  const stale = new Set<string>();
  for (const yamlPath of params.yamlPaths) {
    if (!YAML_SOURCE_RE.test(yamlPath) || yamlPath.includes("/generated/")) continue;
    const state = params.state(yamlPath);
    if (!state) continue;
    if (state.pageMtimeMs === undefined) {
      if (changed.has(yamlPath)) stale.add(yamlPath);
      continue;
    }
    if (state.pageIsYamlPage === false) continue;
    if (state.sourceMtimeMs > state.pageMtimeMs) stale.add(yamlPath);
  }
  return [...stale].sort();
}

function gitPaths(cwd: string, args: readonly string[]): string[] {
  const result = gitResult(cwd, [...args]);
  if (result.status !== 0 || typeof result.stdout !== "string") {
    const stderr = typeof result.stderr === "string" ? result.stderr.trim() : "";
    throw new Error(
      `git ${args.join(" ")} failed in ${cwd}: ${stderr || `exit ${result.status ?? "unknown"}`}`,
    );
  }
  return result.stdout.split("\0").filter((path) => path.length > 0);
}

function readSourceState(root: string, yamlPath: string): YamlPageSourceState | undefined {
  const sourcePath = join(root, yamlPath);
  if (!existsSync(sourcePath)) return undefined;
  const sourceMtimeMs = statSync(sourcePath).mtimeMs;
  const pagePath = join(root, yamlPageRelPath(yamlPath));
  if (!existsSync(pagePath)) return { sourceMtimeMs };
  const pageMtimeMs = statSync(pagePath).mtimeMs;
  // マーカーの確認はページが古いときだけでよい（読み込みを最小にする）。
  if (sourceMtimeMs <= pageMtimeMs) return { sourceMtimeMs, pageMtimeMs };
  return {
    sourceMtimeMs,
    pageMtimeMs,
    pageIsYamlPage: readFileSync(pagePath, "utf8").includes(YAML_PAGE_MARKER),
  };
}

/** Repository-relative YAML sources in the worktree whose display page needs rebuilding. */
export function staleYamlPageSources(worktreePath: string): string[] {
  const root = resolve(worktreePath);
  if (!existsSync(join(root, SPECDOJO_CONFIG_REL))) return [];
  const yamlPaths = gitPaths(root, [
    "ls-files",
    "-z",
    "--cached",
    "--others",
    "--exclude-standard",
    "--",
    ...PAGE_SOURCE_DIRS,
  ]);
  const changedPaths = [
    ...gitPaths(root, ["diff", "--name-only", "-z", "--diff-filter=ACMR", "HEAD"]),
    ...gitPaths(root, ["ls-files", "-z", "--others", "--exclude-standard"]),
  ];
  return selectStaleYamlPageSources({
    yamlPaths: [...new Set(yamlPaths)].sort(),
    changedPaths,
    state: (yamlPath) => readSourceState(root, yamlPath),
  });
}

export type YamlPagesBuildResult = {
  exitCode: number | null;
  output: string;
  error?: string;
};

/** Returns undefined when the worktree has no SpecDojo CLI to build with. */
export type YamlPagesBuilder = (worktreePath: string) => YamlPagesBuildResult | undefined;

// worktree の準備と同じく worktree の checkout にある CLI で `specdojo build --only yaml-pages` を流す。
// CLI が無い worktree は準備のときもページを作らないため、作り直しも行わない。
function runWorktreeYamlPagesBuild(worktreePath: string): YamlPagesBuildResult | undefined {
  const resolved = resolveWorktreeBuildCommand(worktreePath);
  if (!resolved) return undefined;
  const result = spawnSync(resolved.command, [...resolved.args, "--only", "yaml-pages"], {
    cwd: worktreePath,
    env: worktreeBuildEnvironment(worktreePath),
    encoding: "utf8",
    maxBuffer: BUILD_OUTPUT_MAX_BUFFER,
  });
  return {
    exitCode: result.status,
    output: [result.stdout, result.stderr].filter(Boolean).join("\n").trim(),
    ...(result.error ? { error: result.error.message } : {}),
  };
}

export type YamlPagesRefresh =
  | { status: "skipped" }
  | { status: "rebuilt"; sources: string[] }
  | { status: "failed"; sources: string[]; summary: string; output: string };

/**
 * Rebuild the YAML display pages of a worktree before parent validations, only when a YAML source
 * changed after its page was generated. A failed rebuild names the changed YAML and keeps the
 * build output, which names the YAML whose page could not be generated.
 */
export function refreshWorktreeYamlPages(
  worktreePath: string,
  options: { stale?: (path: string) => string[]; build?: YamlPagesBuilder } = {},
): YamlPagesRefresh {
  const sources = (options.stale ?? staleYamlPageSources)(worktreePath);
  if (sources.length === 0) return { status: "skipped" };
  const result = (options.build ?? runWorktreeYamlPagesBuild)(worktreePath);
  if (!result) {
    process.stdout.write(
      `Skipping YAML display page rebuild: no SpecDojo CLI in ${worktreePath}\n`,
    );
    return { status: "skipped" };
  }
  if (result.exitCode === 0 && !result.error) return { status: "rebuilt", sources };
  const detail = result.error
    ? `could not start: ${result.error}`
    : `exited with ${result.exitCode ?? "unknown"}`;
  return {
    status: "failed",
    sources,
    summary:
      `yaml-pages rebuild for changed YAML (${sources.join(", ")}) ${detail}` +
      (result.output ? `: ${result.output}` : ""),
    output: result.output,
  };
}

/** Runner validation ID recorded when the rebuild before parent validations fails. */
export const YAML_PAGES_VALIDATION_ID = "yaml-pages";
const YAML_PAGES_DISPLAY_COMMAND = "specdojo build --only yaml-pages";
const MAX_REFRESH_SUMMARY_LENGTH = 1_000;

/**
 * Rebuild stale YAML display pages in each worktree root before parent validations. Successful or
 * skipped rebuilds record nothing, so the recorded validations keep the configured order. A failed
 * rebuild becomes a failed runner validation (and a failure output log), which fails the batch.
 */
export function refreshYamlPagesBeforeParentValidations(
  roots: ParentValidationRoots,
  refresh: (worktreePath: string) => YamlPagesRefresh = refreshWorktreeYamlPages,
): ParentValidationBatchResult {
  const targets: { repo: string; path: string }[] = [
    { repo: PARENT_VALIDATION_PROJECT_REPO, path: roots.project },
    ...Object.entries(roots.repos ?? {}).map(([repo, path]) => ({ repo, path })),
  ];
  const recordsRepo = targets.length > 1;
  const batch: ParentValidationBatchResult = { validations: [], failureOutputs: [] };
  for (const target of targets) {
    let outcome: YamlPagesRefresh;
    try {
      outcome = refresh(target.path);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      outcome = {
        status: "failed",
        sources: [],
        summary: `yaml-pages rebuild check failed: ${message}`,
        output: message,
      };
    }
    if (outcome.status === "skipped") continue;
    if (outcome.status === "rebuilt") {
      process.stdout.write(
        `  Rebuilt YAML display pages before parent validations (${target.repo}): ${outcome.sources.join(", ")}\n`,
      );
      continue;
    }
    const summary = redactSensitiveText(outcome.summary);
    batch.validations.push({
      id: YAML_PAGES_VALIDATION_ID,
      source: "runner",
      ...(recordsRepo ? { repo: target.repo } : {}),
      command: YAML_PAGES_DISPLAY_COMMAND,
      status: "failed",
      summary:
        summary.length > MAX_REFRESH_SUMMARY_LENGTH
          ? `${summary.slice(0, MAX_REFRESH_SUMMARY_LENGTH - 1)}…`
          : summary,
    });
    batch.failureOutputs.push({
      id: YAML_PAGES_VALIDATION_ID,
      ...(recordsRepo ? { repo: target.repo } : {}),
      label:
        target.repo === PARENT_VALIDATION_PROJECT_REPO
          ? YAML_PAGES_VALIDATION_ID
          : `${target.repo}:${YAML_PAGES_VALIDATION_ID}`,
      exitCode: null,
      stdout: outcome.output,
      stderr: "",
    });
  }
  return batch;
}
