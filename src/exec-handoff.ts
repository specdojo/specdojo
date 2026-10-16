import { spawnSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { createInterface } from "node:readline/promises";
import { join, posix, resolve } from "node:path";
import type { Command } from "commander";
import { isAgentProtectedConfigPath } from "./exec-agent-protected-config.js";
import { PROTECTION_HANDOFF_MARKER } from "./exec-protection-handoff.js";
import { normalizePjrId, resolveRegisterRunTarget } from "./exec-register.js";
import { refsTrailer, withCommitTrailers } from "./exec-repo-trace.js";
import { configuredProductReposForProject } from "./exec-task-repos.js";
import { parseSpecdojoDocument } from "./docs/frontmatter-namespace.js";
import { qualifyTaskId } from "./exec-shared.js";
import { specdojoRootDir } from "./specdojo-config.js";
import { findExecWorktree, gitEnvironment, gitOutput, gitResult } from "./exec-worktree.js";
import {
  stageCommitTargets,
  stabilizeCommitTargets,
  unstageCommitTargets,
  worktreeStatusPaths,
} from "./exec-worktree-ops.js";

type HandoffApplyOptions = {
  project?: string;
  register: string;
  yes?: boolean;
};

export type ProtectedConfigHandoff = {
  subjects: string[];
  patch: string;
};

type RepoPatch = {
  name?: string;
  root: string;
  patch: string;
  paths: string[];
};

const HANDOFF_MECHANISM = "agent-config-write";
const TRUNCATED_EVIDENCE_RE = /^\.\.\. \((?:\d+ 行を省略|文字数上限で切り詰め)\)$/m;

function sectionAfterMarker(content: string): string {
  const marker = content.lastIndexOf(PROTECTION_HANDOFF_MARKER);
  if (marker < 0) throw new Error("The latest result has no protection handoff.");
  const rest = content.slice(marker);
  const nextHeading = /^##\s+/m.exec(rest.slice(PROTECTION_HANDOFF_MARKER.length));
  return nextHeading ? rest.slice(0, PROTECTION_HANDOFF_MARKER.length + nextHeading.index) : rest;
}

/** Extract the machine-recorded protected-config subjects and fenced proposed patch. */
export function extractProtectedConfigHandoff(content: string): ProtectedConfigHandoff {
  const section = sectionAfterMarker(content);
  if (!section.includes(`\`${HANDOFF_MECHANISM}\``)) {
    throw new Error(`The latest protection handoff is not ${HANDOFF_MECHANISM}.`);
  }

  const subjectLine = section.match(/^- 対象パス:\s*(.+)$/m)?.[1] ?? "";
  const subjects = [...subjectLine.matchAll(/`([^`]+)`/g)].map((match) => match[1].trim());
  if (subjects.length === 0) throw new Error("The protection handoff has no target paths.");

  const lines = section.split(/\r?\n/);
  const label = lines.findIndex((line) => line.trim() === "提案差分:");
  if (label < 0) throw new Error("The protection handoff has no proposed patch.");
  const fenceStart = lines.findIndex((line, index) => index > label && /^`{3,}diff$/.test(line));
  if (fenceStart < 0) throw new Error("The protection handoff has no applicable proposed patch.");
  const fence = lines[fenceStart].slice(0, -"diff".length);
  const fenceEnd = lines.findIndex((line, index) => index > fenceStart && line === fence);
  if (fenceEnd < 0) throw new Error("The proposed patch fence is incomplete.");
  const patch = lines
    .slice(fenceStart + 1, fenceEnd)
    .join("\n")
    .trimEnd();
  if (!patch) throw new Error("The protection handoff has an empty proposed patch.");
  if (TRUNCATED_EVIDENCE_RE.test(patch)) {
    throw new Error("The proposed patch was truncated and cannot be applied safely.");
  }
  return { subjects, patch: `${patch}\n` };
}

function latestResultForTask(executionPath: string, taskId: string): string {
  const resultsDir = join(executionPath, "exec", "results");
  if (!existsSync(resultsDir)) throw new Error(`Result directory not found: ${resultsDir}`);
  const candidates = readdirSync(resultsDir)
    .filter((name) => name.endsWith("-result.md"))
    .flatMap((name) => {
      const path = join(resultsDir, name);
      const data = parseSpecdojoDocument(readFileSync(path, "utf8")).data;
      if (data.task_id !== taskId) return [];
      return [{ path, startedAt: typeof data.started_at === "string" ? data.started_at : "" }];
    })
    .sort((left, right) =>
      left.startedAt === right.startedAt
        ? left.path.localeCompare(right.path)
        : left.startedAt.localeCompare(right.startedAt),
    );
  const latest = candidates.at(-1);
  if (!latest) throw new Error(`No result found for ${taskId}.`);
  return latest.path;
}

function splitPatchByRepo(patch: string, knownRepos: ReadonlySet<string>): Map<string, string> {
  const sections = new Map<string, string[]>();
  let repo = "project";
  sections.set(repo, []);
  for (const line of patch.split("\n")) {
    const header = /^# repo: ([a-z0-9-]+)$/.exec(line);
    if (header) {
      if (!knownRepos.has(header[1])) {
        throw new Error(`The proposed patch names an undeclared repository: ${header[1]}`);
      }
      repo = header[1];
      if (!sections.has(repo)) sections.set(repo, []);
      continue;
    }
    sections.get(repo)!.push(line);
  }
  return new Map(
    [...sections.entries()]
      .map(([name, lines]) => [name, `${lines.join("\n").replace(/^\n+|\n+$/g, "")}\n`] as const)
      .filter(([, body]) => body.trim() !== ""),
  );
}

function runGitApply(
  repoRoot: string,
  args: readonly string[],
  patch: string,
): ReturnType<typeof spawnSync> {
  const temporaryDir = mkdtempSync(join(tmpdir(), "specdojo-handoff-"));
  const patchPath = join(temporaryDir, "proposed.patch");
  try {
    writeFileSync(patchPath, patch, "utf8");
    return spawnSync("git", ["-C", resolve(repoRoot), "apply", ...args, patchPath], {
      cwd: resolve(repoRoot),
      env: gitEnvironment(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } finally {
    rmSync(temporaryDir, { recursive: true, force: true });
  }
}

function gitApplyError(result: ReturnType<typeof spawnSync>): string {
  return (
    result.error?.message ||
    (typeof result.stderr === "string" ? result.stderr.trim() : "") ||
    `git apply exited with ${result.status ?? "unknown"}`
  );
}

function patchPaths(repoRoot: string, patch: string): string[] {
  if (/^(?:rename|copy) (?:from|to) /m.test(patch)) {
    throw new Error("Rename and copy patches are not supported by handoff apply.");
  }
  const result = runGitApply(repoRoot, ["--numstat", "-z"], patch);
  if (result.error || result.status !== 0) throw new Error(gitApplyError(result));
  const stdout = typeof result.stdout === "string" ? result.stdout : "";
  const paths = stdout
    .split("\0")
    .filter(Boolean)
    .map((record) => {
      const firstTab = record.indexOf("\t");
      const secondTab = firstTab < 0 ? -1 : record.indexOf("\t", firstTab + 1);
      if (secondTab < 0) throw new Error("Could not read a path from the proposed patch.");
      return record.slice(secondTab + 1);
    });
  if (paths.length === 0) throw new Error("The proposed patch contains no file changes.");
  for (const path of paths) {
    const normalized = posix.normalize(path.replaceAll("\\", "/"));
    if (
      path !== normalized ||
      posix.isAbsolute(normalized) ||
      normalized === ".." ||
      normalized.startsWith("../")
    ) {
      throw new Error(`The proposed patch contains an unsafe path: ${path}`);
    }
  }
  return [...new Set(paths)].sort();
}

function qualifiedSubject(name: string | undefined, path: string): string {
  return name ? `${name}:${path}` : path;
}

function assertSubjectCoverage(
  handoff: ProtectedConfigHandoff,
  patches: readonly RepoPatch[],
): void {
  const subjects = [...new Set(handoff.subjects)].sort();
  const patchSubjects = patches
    .flatMap((repo) => repo.paths.map((path) => qualifiedSubject(repo.name, path)))
    .sort();
  if (subjects.join("\0") !== patchSubjects.join("\0")) {
    throw new Error(
      `The proposed patch paths do not match the handoff targets (targets: ${subjects.join(", ")}; patch: ${patchSubjects.join(", ")}).`,
    );
  }
}

function assertCleanPaths(repo: RepoPatch): void {
  const status = gitOutput(repo.root, [
    "status",
    "--porcelain=v1",
    "--untracked-files=all",
    "--",
    ...repo.paths,
  ]).trim();
  if (status) {
    throw new Error(
      `${repo.name ?? "project"} has existing changes on handoff paths; commit or restore them first: ${repo.paths.join(", ")}`,
    );
  }
}

function commitSubject(itemId: string): string {
  return `exec(handoff ${itemId}): apply protected configuration`;
}

function applyAndCommit(repo: RepoPatch, message: string): string {
  const applied = runGitApply(repo.root, [], repo.patch);
  if (applied.error || applied.status !== 0) throw new Error(gitApplyError(applied));
  try {
    stageCommitTargets(repo.root, repo.paths);
    const staged = gitResult(repo.root, ["diff", "--cached", "--quiet", "--", ...repo.paths]);
    if (staged.status !== 1) {
      if (staged.status === 0) throw new Error("The proposed patch produced no staged change.");
      throw new Error("Could not inspect the staged handoff change.");
    }
    const commit = gitResult(repo.root, ["commit", "-m", message, "--", ...repo.paths]);
    if (commit.status !== 0) {
      const output = [commit.stdout, commit.stderr]
        .filter((value): value is string => typeof value === "string" && value.trim() !== "")
        .join("\n");
      throw new Error(output || "git commit failed");
    }
    stabilizeCommitTargets(repo.root, () =>
      worktreeStatusPaths(repo.root).filter((path) => repo.paths.includes(path)),
    );
    return gitOutput(repo.root, ["rev-parse", "--short", "HEAD"]).trim();
  } catch (error) {
    unstageCommitTargets(repo.root, repo.paths);
    // The paths were clean before application, so restoring this exact allowlist cannot discard
    // pre-existing user work. It also removes formatting changes made by a failed commit hook.
    const tracked: string[] = [];
    for (const path of repo.paths) {
      if (gitResult(repo.root, ["cat-file", "-e", `HEAD:${path}`]).status === 0) {
        tracked.push(path);
        continue;
      }
      const absolute = resolve(repo.root, path);
      if (lstatSync(absolute, { throwIfNoEntry: false })?.isFile()) unlinkSync(absolute);
    }
    if (tracked.length > 0) {
      gitOutput(repo.root, [
        "restore",
        "--source=HEAD",
        "--staged",
        "--worktree",
        "--",
        ...tracked,
      ]);
    }
    throw error;
  }
}

async function confirmed(options: HandoffApplyOptions): Promise<boolean> {
  if (options.yes) return true;
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error("Confirmation is required; inspect the patch above and rerun with --yes.");
  }
  const prompt = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = (await prompt.question("Apply and commit this protected configuration? [y/N]: "))
      .trim()
      .toLowerCase();
    return answer === "y" || answer === "yes";
  } finally {
    prompt.close();
  }
}

export async function applyRegisterProtectionHandoff(
  options: HandoffApplyOptions,
): Promise<{ applied: boolean; commits: Array<{ repo: string; sha: string }> }> {
  const itemId = normalizePjrId(options.register);
  const root = specdojoRootDir();
  const projectId = options.project?.trim() || undefined;
  const { registerPaths, item } = resolveRegisterRunTarget(projectId ?? "", itemId);
  if (item.status !== "waiting") {
    throw new Error(`${itemId} must be waiting before its protection handoff can be applied.`);
  }
  const worktree = findExecWorktree(root, qualifyTaskId(registerPaths.projectId, itemId));
  if (!worktree) throw new Error(`No blocked exec worktree found for ${itemId}.`);
  if (resolve(worktree.path) === resolve(root)) {
    throw new Error("Run handoff apply from the integration checkout, not the task worktree.");
  }

  const resultPath = latestResultForTask(registerPaths.executionPath ?? "", itemId);
  const handoff = extractProtectedConfigHandoff(readFileSync(resultPath, "utf8"));
  const products = configuredProductReposForProject(registerPaths.projectId);
  const productByName = new Map(products.map((product) => [product.name, product]));
  const sections = splitPatchByRepo(handoff.patch, new Set(productByName.keys()));
  const patches: RepoPatch[] = [];
  for (const [name, patch] of sections) {
    const product = name === "project" ? undefined : productByName.get(name);
    if (name !== "project" && !product) throw new Error(`Unknown repository in patch: ${name}`);
    const repoRoot = product?.repoRoot ?? root;
    if (product?.integrationBranch) {
      const branch = gitOutput(repoRoot, ["branch", "--show-current"]).trim();
      if (branch !== product.integrationBranch) {
        throw new Error(
          `${name} must have integration branch ${product.integrationBranch} checked out (current: ${branch || "detached"}).`,
        );
      }
    }
    const paths = patchPaths(repoRoot, patch);
    for (const path of paths) {
      if (!isAgentProtectedConfigPath(path)) {
        throw new Error(`The proposed patch contains a non-protected path: ${name}:${path}`);
      }
    }
    patches.push({ ...(name === "project" ? {} : { name }), root: repoRoot, patch, paths });
  }
  if (patches.length === 0)
    throw new Error("The protection handoff has no applicable repository patch.");
  assertSubjectCoverage(handoff, patches);
  for (const repo of patches) {
    assertCleanPaths(repo);
    const checked = runGitApply(repo.root, ["--check"], repo.patch);
    if (checked.error || checked.status !== 0) {
      throw new Error(
        `${repo.name ?? "project"}: proposed patch does not apply: ${gitApplyError(checked)}`,
      );
    }
  }

  process.stdout.write(`Protection handoff: ${itemId}\nSource: ${resultPath}\n\n${handoff.patch}`);
  if (!(await confirmed(options))) {
    process.stdout.write("Handoff application cancelled; no changes were made.\n");
    return { applied: false, commits: [] };
  }

  const message = withCommitTrailers(commitSubject(itemId), [
    refsTrailer(registerPaths.projectId, itemId),
  ]);
  const commits: Array<{ repo: string; sha: string }> = [];
  // Product configuration is committed before project configuration, matching normal integration.
  patches.sort((left, right) => (left.name ? 0 : 1) - (right.name ? 0 : 1));
  for (const repo of patches) {
    const sha = applyAndCommit(repo, message);
    const name = repo.name ?? "project";
    commits.push({ repo: name, sha });
    process.stdout.write(`Committed ${name}: ${sha}\n`);
  }
  if (patches.some((repo) => repo.paths.some((path) => path.endsWith("package.json")))) {
    process.stdout.write(
      "If dependency declarations changed, regenerate and commit the matching lock file before resuming.\n",
    );
  }
  process.stdout.write(
    `Resume with: specdojo exec run --project ${registerPaths.projectId} --register ${itemId} --worktree --resume\n`,
  );
  return { applied: true, commits };
}

export function registerExecHandoffCommands(exec: Command): void {
  const handoff = exec
    .command("handoff")
    .description("Inspect and apply protected-configuration handoffs");
  const apply = handoff
    .command("apply")
    .description("Apply a blocked register run's proposed protected-configuration patch");
  apply.option("--project <projectId>", "Project id in .specdojo/specdojo.config.json");
  apply.requiredOption("--register <pjrId>", "Project register item ID (PJR-XXXX)");
  apply.option("--yes", "Apply and commit after printing the proposed patch", false);
  apply.action(async (options: HandoffApplyOptions) => {
    try {
      await applyRegisterProtectionHandoff(options);
    } catch (error) {
      process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
      process.exitCode = 1;
    }
  });
}
