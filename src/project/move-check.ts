import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, join, relative, resolve } from "node:path";
import { foldEventsToState, readAllEventFiles } from "../exec/events.js";
import { buildInitialStateFromStrategy } from "../exec/schedule/initial.js";
import { listRegisteredWorktrees } from "../exec/worktree.js";
import { loadRegisterItems } from "../register/views.js";
import { resolveRegisterDateTimeZone } from "../register/date.js";
import { loadRoutines } from "../routine/definition.js";
import { DEFAULT_BRANCH_TEMPLATE } from "../shared/branch-template.js";
import { listFilesRecursive } from "../shared/fs.js";
import { gitResult } from "../shared/git.js";
import { LOCAL_CONFIG_RELATIVE_PATH } from "../shared/local-config.js";
import { buildScheduleIndex } from "../shared/schedule-index.js";
import {
  DEFAULT_AGENT_MEMBERS_PATH,
  getKataAuthority,
  getProjectExecutionPath,
  getProjectRegisterPath,
  getProjectRepos,
  getProjectRoutinesPath,
  getProjectSchedulePath,
  isSpecdojoSourceRepository,
  resolveRepoRoot,
  type SpecDojoConfig,
  type SpecDojoProjectConfig,
} from "../shared/specdojo-config.js";

/**
 * ok: nothing to do before the move. needs-cleanup: finish or remove in-flight work first.
 * check-manually: the move itself must carry or rewrite something the check cannot decide.
 */
export type MoveCheckStatus = "ok" | "needs-cleanup" | "check-manually";

export type MoveCheckId =
  | "register-items"
  | "schedule-tasks"
  | "exec-worktrees"
  | "integration-branches"
  | "routines"
  | "cross-project-links"
  | "config"
  | "kata";

export type MoveCheckItem = {
  id: MoveCheckId;
  status: MoveCheckStatus;
  summary: string;
  details: string[];
};

export type MoveCheckReport = {
  projectId: string;
  rootDir: string;
  items: MoveCheckItem[];
};

export type MoveCheckContext = {
  rootDir: string;
  config: SpecDojoConfig;
  projectId: string;
  project: SpecDojoProjectConfig;
};

const MAX_LISTED_DETAILS = 20;

function item(
  id: MoveCheckId,
  status: MoveCheckStatus,
  summary: string,
  details: string[] = [],
): MoveCheckItem {
  return { id, status, summary, details };
}

function capDetails(lines: string[]): string[] {
  if (lines.length <= MAX_LISTED_DETAILS) return lines;
  return [
    ...lines.slice(0, MAX_LISTED_DETAILS),
    `... and ${lines.length - MAX_LISTED_DETAILS} more`,
  ];
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function displayPath(rootDir: string, path: string): string {
  const rel = relative(rootDir, path);
  return rel && !rel.startsWith("..") && !isAbsolute(rel) ? rel : path;
}

function gitLines(repoRoot: string, args: string[]): string[] | null {
  const result = gitResult(repoRoot, args);
  if (result.status !== 0 || result.error) return null;
  return String(result.stdout ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== "");
}

// ================================
// In-flight work
// ================================

const IN_FLIGHT_REGISTER_STATUSES = new Set(["in-progress", "waiting"]);

export function checkRegisterItems(context: MoveCheckContext): MoveCheckItem {
  const registerPath = getProjectRegisterPath(context.project);
  if (!registerPath) {
    return item("register-items", "ok", "project_register_path is not set; no register to check");
  }
  const absRegisterPath = resolve(context.rootDir, registerPath);
  let views;
  try {
    views = loadRegisterItems({
      projectId: context.projectId,
      projectRegisterPath: absRegisterPath,
      pjrIndexPath: join(absRegisterPath, "pjr-index.md"),
      generatedPath: join(absRegisterPath, "generated"),
      controlsGeneratedPath: join(absRegisterPath, "..", "generated"),
      registerDateTimeZone: resolveRegisterDateTimeZone(context.config, context.projectId),
    });
  } catch (error) {
    return item("register-items", "check-manually", "could not read the register", [
      errorMessage(error),
    ]);
  }
  const inFlight = views.filter((view) => IN_FLIGHT_REGISTER_STATUSES.has(view.item.status));
  if (inFlight.length === 0) {
    return item("register-items", "ok", `no in-progress or waiting items (${views.length} items)`);
  }
  return item(
    "register-items",
    "needs-cleanup",
    `${inFlight.length} in-progress or waiting items; finish, release, or defer them first`,
    capDetails(inFlight.map((view) => `${view.id} ${view.item.status} ${view.item.title}`)),
  );
}

export function checkScheduleTasks(context: MoveCheckContext): MoveCheckItem {
  const schedulePath = resolve(context.rootDir, getProjectSchedulePath(context.project));
  if (!existsSync(schedulePath)) {
    return item("schedule-tasks", "ok", "no schedule directory");
  }
  try {
    const schedule = buildScheduleIndex(schedulePath);
    if (schedule.nodes.size === 0) return item("schedule-tasks", "ok", "no schedule tasks");
    const events = readAllEventFiles(schedulePath);
    const initial = buildInitialStateFromStrategy(schedulePath, schedule);
    const snapshot = foldEventsToState(events, schedule, schedulePath, initial);
    const claimed = Object.entries(snapshot.tasks)
      .filter(([, state]) => state.state === "doing" || state.state === "blocked")
      .sort(([a], [b]) => a.localeCompare(b));
    if (claimed.length === 0) {
      return item("schedule-tasks", "ok", "no doing or blocked tasks");
    }
    return item(
      "schedule-tasks",
      "needs-cleanup",
      `${claimed.length} doing or blocked tasks; complete or release them first`,
      capDetails(
        claimed.map(
          ([id, state]) =>
            `${id} ${state.state}${state.claimed_by ? ` (claimed by ${state.claimed_by})` : ""}`,
        ),
      ),
    );
  } catch (error) {
    return item("schedule-tasks", "check-manually", "could not fold the schedule state", [
      errorMessage(error),
    ]);
  }
}

/** Branch name prefix shared by this project's exec branches, or undefined if not derivable. */
export function execBranchPrefix(template: string, projectId: string): string | undefined {
  const expanded = template.replace(/\{project\}/g, projectId);
  const prefix = expanded.split("{")[0];
  return prefix.includes(projectId) ? prefix : undefined;
}

function listExecBranches(
  label: string,
  repoRoot: string,
  prefix: string,
): { lines: string[]; error?: string } {
  const branches = gitLines(repoRoot, [
    "for-each-ref",
    "--format=%(refname:short)",
    `refs/heads/${prefix}*`,
  ]);
  if (branches === null) return { lines: [], error: `${label}: could not list branches` };
  const worktrees = new Map(
    listRegisteredWorktrees(repoRoot)
      .filter((worktree) => worktree.branch)
      .map((worktree) => [worktree.branch as string, worktree.path]),
  );
  return {
    lines: branches.sort().map((branch) => {
      const worktree = worktrees.get(branch);
      return `${label}: ${branch}${worktree ? ` (worktree ${worktree})` : ""}`;
    }),
  };
}

export function checkExecWorktrees(context: MoveCheckContext): MoveCheckItem {
  const lines: string[] = [];
  const problems: string[] = [];
  const projectPrefix = execBranchPrefix(DEFAULT_BRANCH_TEMPLATE, context.projectId) as string;
  try {
    const listed = listExecBranches("project", context.rootDir, projectPrefix);
    lines.push(...listed.lines);
    if (listed.error) problems.push(listed.error);
  } catch (error) {
    problems.push(`project: ${errorMessage(error)}`);
  }
  for (const repo of getProjectRepos(context.project)) {
    const repoRoot = resolveRepoRoot(context.rootDir, repo);
    const template = repo.branch_template ?? DEFAULT_BRANCH_TEMPLATE;
    const prefix = execBranchPrefix(template, context.projectId);
    if (!existsSync(repoRoot)) {
      problems.push(`${repo.name}: repository not found at ${repoRoot}`);
      continue;
    }
    if (!prefix) {
      problems.push(`${repo.name}: branch_template "${template}" does not name the project`);
      continue;
    }
    try {
      const listed = listExecBranches(repo.name, repoRoot, prefix);
      lines.push(...listed.lines);
      if (listed.error) problems.push(listed.error);
    } catch (error) {
      problems.push(`${repo.name}: ${errorMessage(error)}`);
    }
  }
  if (lines.length > 0) {
    return item(
      "exec-worktrees",
      "needs-cleanup",
      `${lines.length} exec branches remain; integrate or remove them (specdojo exec worktree remove)`,
      capDetails([...lines, ...problems]),
    );
  }
  if (problems.length > 0) {
    return item("exec-worktrees", "check-manually", "some repositories could not be checked", [
      ...problems,
    ]);
  }
  return item("exec-worktrees", "ok", "no exec branches or worktrees for this project");
}

export function checkIntegrationBranches(context: MoveCheckContext): MoveCheckItem {
  const details: string[] = [];
  let manual = false;
  const projectBranch = context.project.integration_branch?.trim();
  if (projectBranch) {
    manual = true;
    const exists =
      gitLines(context.rootDir, [
        "rev-parse",
        "--verify",
        "--quiet",
        `refs/heads/${projectBranch}`,
      ]) !== null;
    details.push(
      `project: integration_branch ${projectBranch}${exists ? "" : " (missing)"}; create it in the new repository`,
    );
  }
  for (const repo of getProjectRepos(context.project)) {
    const branch = repo.integration_branch?.trim();
    if (!branch) {
      details.push(`${repo.name}: no integration_branch (uses the current branch)`);
      continue;
    }
    const repoRoot = resolveRepoRoot(context.rootDir, repo);
    const exists =
      existsSync(repoRoot) &&
      gitLines(repoRoot, ["rev-parse", "--verify", "--quiet", `refs/heads/${branch}`]) !== null;
    if (!exists) manual = true;
    details.push(`${repo.name}: ${branch}${exists ? "" : " (missing)"}`);
  }
  if (details.length === 0) {
    return item("integration-branches", "ok", "no integration branches configured");
  }
  return item(
    "integration-branches",
    manual ? "check-manually" : "ok",
    manual
      ? "recreate or fix the listed integration branches for the new repository"
      : "integration branches exist; product repositories stay where they are",
    details,
  );
}

export function checkRoutines(context: MoveCheckContext): MoveCheckItem {
  const routinesPath = getProjectRoutinesPath(context.project);
  if (!routinesPath) return item("routines", "ok", "routines_path is not set");
  const absPath = resolve(context.rootDir, routinesPath);
  const { routines, errors } = loadRoutines(absPath);
  const enabled = routines.filter((routine) => routine.doc.enabled !== false);
  if (enabled.length === 0 && errors.length === 0) {
    return item("routines", "ok", `no enabled routines (${routines.length} defined)`);
  }
  return item(
    "routines",
    "check-manually",
    `${enabled.length} enabled routines; stop the scheduler here and set it up again in the new repository`,
    capDetails([
      ...enabled.map(
        (routine) => `${routine.doc.id} ${displayPath(context.rootDir, routine.filePath)}`,
      ),
      ...errors,
    ]),
  );
}

// ================================
// Links and copied configuration
// ================================

const SCANNED_EXTENSIONS = /\.(md|ya?ml)$/;
const WIKILINK_RE = /\[\[([^\]|#\n]+)/g;
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function scannedFiles(dir: string): string[] {
  return listFilesRecursive(dir)
    .filter((path) => SCANNED_EXTENSIONS.test(path))
    .filter((path) => !path.split(/[\\/]/).includes("generated"))
    .sort();
}

/**
 * Collect `<prefix>:<id>` references from wikilinks anywhere and from plain values in the
 * frontmatter (or the whole file for YAML), e.g. `derived_from: [prj-0001:PJR-XXXX]` or
 * `rulebook: specdojo:pjr-rulebook`. Prose outside frontmatter is not scanned so that command
 * names such as `specdojo:build` are not mistaken for references.
 */
export function collectPrefixedReferences(
  content: string,
  isYaml: boolean,
  prefixes: readonly string[],
): string[] {
  if (prefixes.length === 0) return [];
  const found: string[] = [];
  const prefixSet = new Set(prefixes);
  for (const match of content.matchAll(WIKILINK_RE)) {
    const id = match[1].trim();
    const prefix = id.split(":")[0];
    if (id.includes(":") && prefixSet.has(prefix)) found.push(id);
  }
  const plainSource = isYaml ? content : (FRONTMATTER_RE.exec(content)?.[1] ?? "");
  const plainRe = new RegExp(
    `(?<![\\w./\\[-])(${prefixes.map(escapeRegExp).join("|")}):([A-Za-z0-9][A-Za-z0-9._-]*)`,
    "g",
  );
  for (const match of plainSource.matchAll(plainRe)) found.push(`${match[1]}:${match[2]}`);
  return found;
}

type ReferenceTally = Map<string, Set<string>>;

function tallyReferences(
  rootDir: string,
  dir: string,
  prefixes: readonly string[],
  tally: ReferenceTally,
): void {
  for (const file of scannedFiles(dir)) {
    const content = readFileSync(file, "utf8");
    const refs = new Set(collectPrefixedReferences(content, !file.endsWith(".md"), prefixes));
    for (const ref of refs) {
      const files = tally.get(ref) ?? new Set<string>();
      files.add(displayPath(rootDir, file));
      tally.set(ref, files);
    }
  }
}

function formatTally(direction: string, tally: ReferenceTally): string[] {
  return [...tally.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([ref, files]) => `${direction} ${ref} (${files.size} files)`);
}

function projectBaseDir(context: MoveCheckContext, project: SpecDojoProjectConfig): string | null {
  const base = project.base_path?.trim();
  return base ? resolve(context.rootDir, base) : null;
}

export function checkCrossProjectLinks(context: MoveCheckContext): MoveCheckItem {
  const targetBase = projectBaseDir(context, context.project);
  if (!targetBase) {
    return item("cross-project-links", "check-manually", "base_path is not set; links not scanned");
  }
  const others = Object.entries(context.config.projects)
    .filter(([id]) => id !== context.projectId)
    .sort(([a], [b]) => a.localeCompare(b));
  const outbound: ReferenceTally = new Map();
  const inbound: ReferenceTally = new Map();
  tallyReferences(
    context.rootDir,
    targetBase,
    others.map(([id]) => id),
    outbound,
  );
  for (const [, project] of others) {
    const base = projectBaseDir(context, project);
    if (base && existsSync(base)) {
      tallyReferences(context.rootDir, base, [context.projectId], inbound);
    }
  }
  if (outbound.size === 0 && inbound.size === 0) {
    return item("cross-project-links", "ok", "no links to or from other projects");
  }
  return item(
    "cross-project-links",
    "check-manually",
    `${outbound.size} outbound and ${inbound.size} inbound referenced ids will cross repositories`,
    capDetails([...formatTally("out", outbound), ...formatTally("in", inbound)]),
  );
}

function fileLine(rootDir: string, label: string, path: string): string {
  const absPath = resolve(rootDir, path);
  return `${label}: ${displayPath(rootDir, absPath)}${existsSync(absPath) ? "" : " (missing)"}`;
}

export function checkConfig(context: MoveCheckContext): MoveCheckItem {
  const { rootDir, config, project, projectId } = context;
  const details = [`.specdojo/specdojo.config.json: copy projects.${projectId}`];
  if (config.current_project === projectId) {
    details.push(`.specdojo/specdojo.config.json: current_project is ${projectId}; change it here`);
  }
  if (!project.base_path?.trim()) {
    details.push("base_path is not set; project paths are repository-root relative");
  }
  for (const repo of getProjectRepos(project)) {
    const repoRoot = resolveRepoRoot(rootDir, repo);
    details.push(
      `repos ${repo.name}: path ${repo.path} -> ${repoRoot}${existsSync(repoRoot) ? "" : " (missing)"}; rewrite it relative to the new repository`,
    );
  }
  details.push(
    fileLine(rootDir, "agent members", config.agent_members_path ?? DEFAULT_AGENT_MEMBERS_PATH),
  );
  const execDefaults = project.run?.exec_defaults ?? project.run?.agent_config;
  if (execDefaults) details.push(fileLine(rootDir, "exec defaults", execDefaults));
  if (project.run?.worktree_base) {
    details.push(
      `run.worktree_base: ${project.run.worktree_base}; choose one for the new repository`,
    );
  }
  const executionPath = resolve(rootDir, getProjectExecutionPath(project));
  if (project.base_path && !executionPath.startsWith(resolve(rootDir, project.base_path))) {
    details.push(`execution_path outside base_path: ${displayPath(rootDir, executionPath)}`);
  }
  if (existsSync(join(rootDir, LOCAL_CONFIG_RELATIVE_PATH))) {
    details.push(
      `${LOCAL_CONFIG_RELATIVE_PATH}: copy local overrides of projects.${projectId} by hand`,
    );
  }
  return item(
    "config",
    "check-manually",
    "copy the listed configuration into the new repository",
    details,
  );
}

function readPackageDependency(rootDir: string, name: string): string | undefined {
  try {
    const parsed: unknown = JSON.parse(readFileSync(join(rootDir, "package.json"), "utf8"));
    if (typeof parsed !== "object" || parsed === null) return undefined;
    for (const key of ["dependencies", "devDependencies"]) {
      const deps = (parsed as Record<string, unknown>)[key];
      if (typeof deps === "object" && deps !== null) {
        const value = (deps as Record<string, unknown>)[name];
        if (typeof value === "string") return value;
      }
    }
  } catch {
    return undefined;
  }
  return undefined;
}

export function checkKata(context: MoveCheckContext): MoveCheckItem {
  const targetBase = projectBaseDir(context, context.project);
  const authority = getKataAuthority(context.config, context.rootDir);
  const tally: ReferenceTally = new Map();
  if (targetBase) tallyReferences(context.rootDir, targetBase, ["specdojo", authority], tally);
  const kataRefs = [...tally.keys()].filter((ref) => ref.startsWith("specdojo:"));
  const localRefs = [...tally.keys()].filter((ref) => ref.startsWith(`${authority}:`));
  const details = [`${kataRefs.length} distinct specdojo kata ids referenced`];
  if (localRefs.length > 0) {
    details.push(
      `${localRefs.length} local kata ids (${authority}:) referenced; copy or publish that kata`,
      ...capDetails(localRefs.sort()),
    );
  }
  if (isSpecdojoSourceRepository(context.rootDir)) {
    details.push(
      "kata are read from this repository's docs/ja/specdojo; install the specdojo npm package with a pinned version in the new repository",
    );
    return item("kata", "check-manually", "kata source changes after the move", details);
  }
  const range = readPackageDependency(context.rootDir, "specdojo");
  if (!range) {
    details.push("specdojo is not in package.json; pin the version used by the new repository");
    return item("kata", "check-manually", "kata version is not pinned", details);
  }
  const pinned = /^\d+\.\d+\.\d+(?:-[\w.]+)?$/.test(range);
  details.push(`package.json specdojo: ${range}${pinned ? "" : " (not an exact version)"}`);
  if (!pinned || localRefs.length > 0) {
    return item(
      "kata",
      "check-manually",
      "pin the same kata version in the new repository",
      details,
    );
  }
  return item("kata", "ok", `kata come from specdojo ${range}; use the same version`, details);
}

// ================================
// Report
// ================================

export function runMoveCheck(context: MoveCheckContext): MoveCheckReport {
  return {
    projectId: context.projectId,
    rootDir: context.rootDir,
    items: [
      checkRegisterItems(context),
      checkScheduleTasks(context),
      checkExecWorktrees(context),
      checkIntegrationBranches(context),
      checkRoutines(context),
      checkCrossProjectLinks(context),
      checkConfig(context),
      checkKata(context),
    ],
  };
}

export function moveCheckHasBlockers(report: MoveCheckReport): boolean {
  return report.items.some((entry) => entry.status === "needs-cleanup");
}

export function formatMoveCheckReport(report: MoveCheckReport): string {
  const lines = [`Move check for ${report.projectId} (read-only; nothing was changed)`, ""];
  for (const entry of report.items) {
    lines.push(`[${entry.status}] ${entry.id}: ${entry.summary}`);
    for (const detail of entry.details) lines.push(`  - ${detail}`);
  }
  const count = (status: MoveCheckStatus): number =>
    report.items.filter((entry) => entry.status === status).length;
  lines.push(
    "",
    `Summary: ok ${count("ok")}, needs-cleanup ${count("needs-cleanup")}, check-manually ${count("check-manually")}`,
  );
  return `${lines.join("\n")}\n`;
}
