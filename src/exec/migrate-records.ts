import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import type { Command } from "commander";
import { readSpecdojoNamespace } from "../shared/frontmatter-namespace.js";
import { listFilesRecursive } from "../shared/fs.js";
import { gitEnvironment } from "../shared/git.js";
import { rebasePlanConventions } from "../shared/plan-conventions.js";
import { recordIdentity, taskRecordPaths } from "../shared/run-records.js";
import { specdojoRootDir } from "../shared/specdojo-config.js";
import { addProjectOptions, resolveProjectContext, resolveProjectId } from "./core.js";
import { qualifyTaskId } from "./shared.js";
import { listRegisteredWorktrees, worktreeNameFromTaskId } from "./worktree.js";

type Move = { from: string; to: string };
type Pair = { stem: string; task: string; plan?: string; result?: string };
type Group = { task: string; run: string; files: string[]; refs: string[]; updated: string };
export type RecordMigration = {
  moves: Move[];
  updates: { path: string; content: string }[];
  missing: { stem: string; missing: "plan" | "result" }[];
  skipped: { path: string; reason: string }[];
};
const posix = (path: string) => path.split(sep).join("/");
const json = (path: string): Record<string, unknown> => JSON.parse(readFileSync(path, "utf8"));

/** Retain formatting and every non-reference value, including historical change paths. */
function rewriteJsonPaths(source: string, rewrite: (value: string) => string): string {
  JSON.parse(source);
  const stack: { field: string; key: string }[] = [];
  return source.replace(/"(?:[^"\\]|\\.)*"|[{}[\]]/g, (token, offset: number) => {
    const parent = stack.at(-1);
    if (token === "{" || token === "[") {
      stack.push({ field: parent?.key ?? "", key: "" });
    } else if (token === "}" || token === "]") {
      stack.pop();
    } else if (/^\s*:/.test(source.slice(offset + token.length))) {
      if (parent) parent.key = JSON.parse(token) as string;
    } else if (
      parent &&
      (/(?:_ref|_path)$/.test(parent.key) ||
        (parent.key === "path" && stack.some((frame) => frame.field === "log_refs")))
    ) {
      return JSON.stringify(rewrite(JSON.parse(token) as string));
    }
    return token;
  });
}

/** Plan first, validate every destination, then mutate. No clock or random identity is used. */
export function planRecordMigration(
  repoRoot: string,
  executionPath: string,
  projectId?: string,
): RecordMigration {
  const root = resolve(repoRoot);
  const execution = resolve(executionPath);
  const repoRef = (path: string) => posix(relative(root, path));
  const pairs = new Map<string, Pair>();
  for (const kind of ["plan", "result"] as const) {
    for (const path of listFilesRecursive(join(execution, "exec", `${kind}s`)).sort()) {
      if (!path.endsWith(`-${kind}.md`)) throw new Error(`Unknown legacy record: ${path}`);
      const stem = basename(path).replace(new RegExp(`-${kind}\\.md$`), "");
      const fm = readSpecdojoNamespace(readFileSync(path, "utf8"));
      if (typeof fm.task_id !== "string" || !fm.task_id.trim())
        throw new Error(`Missing task_id: ${path}`);
      const pair = pairs.get(stem) ?? { stem, task: fm.task_id };
      if (pair[kind] || pair.task !== fm.task_id) throw new Error(`Ambiguous pair: ${stem}`);
      pair[kind] = path;
      pairs.set(stem, pair);
    }
  }

  const evidenceRoot = join(execution, "exec", "evidence");
  const directories = new Map<string, string[]>();
  for (const path of listFilesRecursive(evidenceRoot).sort()) {
    const directory = dirname(path);
    directories.set(directory, [...(directories.get(directory) ?? []), path]);
  }
  const groups: Group[] = [];
  for (const [directory, files] of directories) {
    const parts = relative(evidenceRoot, directory).split(sep);
    if (parts.length !== 2) throw new Error(`Unknown evidence directory: ${directory}`);
    const metadata = ["pipeline-state.json", "evidence.json"]
      .map((name) => join(directory, name))
      .filter(existsSync)
      .map(json);
    const state = metadata.find((record) => record.artifacts);
    const artifacts = state?.artifacts as Record<string, string> | undefined;
    const task = metadata[0]?.task_id ?? parts[0];
    const run = metadata[0]?.run_id ?? parts[1];
    if (typeof task !== "string" || typeof run !== "string")
      throw new Error(`Invalid evidence identity: ${directory}`);
    if (metadata.some((record) => record.task_id !== task || record.run_id !== run))
      throw new Error(`Conflicting evidence identities: ${directory}`);
    groups.push({
      task,
      run,
      files,
      refs: Object.values(artifacts ?? {}).filter((value) => typeof value === "string"),
      updated: String(metadata[0]?.updated_at ?? run),
    });
  }

  // A retained exec worktree may still resume with the old paths and its own index.
  // Refuse even dry-runs before planning updates; stopped processes alone are insufficient.
  const tasks = new Set([...pairs.values(), ...groups].map(({ task }) => task));
  if (tasks.size) {
    for (const worktree of listRegisteredWorktrees(root)) {
      if (!worktree.branch?.startsWith("exec/") || !existsSync(worktree.path)) continue;
      for (const task of tasks) {
        const names = [task, recordIdentity(task).itemId].map(worktreeNameFromTaskId);
        const branchTask = worktree.branch.slice("exec/".length);
        const matches = names.some(
          (name) =>
            branchTask === name ||
            (projectId
              ? branchTask === worktreeNameFromTaskId(qualifyTaskId(projectId, name))
              : branchTask.endsWith(`-${name}`)),
        );
        if (matches)
          throw new Error(
            `Migration target ${task} has a retained exec worktree: ${worktree.path} ` +
              `(${worktree.branch}). Finish or discard the run and remove its worktree before migrating`,
          );
      }
    }
  }

  const virtualRefs: Move[] = [];
  const moves: Move[] = [];
  const add = (from: string, to: string) => moves.push({ from: repoRef(from), to: repoRef(to) });
  for (const group of groups) {
    const records = taskRecordPaths(execution, group.task, group.run);
    for (const path of group.files) add(path, records.log(basename(path)));
    virtualRefs.push({ from: repoRef(dirname(group.files[0])), to: repoRef(records.directory) });
  }
  const missing: RecordMigration["missing"] = [];
  for (const pair of pairs.values()) {
    if (!pair.plan || !pair.result)
      missing.push({ stem: pair.stem, missing: pair.plan ? "result" : "plan" });
    // Exact checkpoint refs are authoritative. For pre-checkpoint records, associate only
    // an unambiguous task/pair; otherwise retain separate runs instead of guessing by time.
    let candidates = groups.filter((group) =>
      group.refs.some((ref) =>
        [pair.plan, pair.result].some(
          (path) => path && (ref === repoRef(path) || ref === posix(relative(execution, path))),
        ),
      ),
    );
    if (
      candidates.length === 0 &&
      [...pairs.values()].filter((p) => p.task === pair.task).length === 1
    )
      candidates = groups.filter((group) => group.task === pair.task && group.refs.length === 0);
    const latest = candidates
      .sort((a, b) => a.updated.localeCompare(b.updated) || a.run.localeCompare(b.run))
      .at(-1);
    const records = taskRecordPaths(execution, pair.task, latest?.run ?? pair.stem);
    if (pair.plan) add(pair.plan, records.plan);
    if (pair.result) add(pair.result, records.result);
    for (const kind of ["plan", "result"] as const) {
      if (!pair[kind])
        virtualRefs.push({
          from: repoRef(join(execution, "exec", `${kind}s`, `${pair.stem}-${kind}.md`)),
          to: repoRef(records[kind]),
        });
    }
  }
  moves.sort((a, b) => a.from.localeCompare(b.from));
  const destinations = new Set<string>();
  for (const move of moves) {
    if (destinations.has(move.to) || existsSync(join(root, move.to)))
      throw new Error(`Migration destination already exists: ${move.to}`);
    if (isAbsolute(move.to) || move.to.startsWith("../"))
      throw new Error(`Migration destination outside repository: ${move.to}`);
    destinations.add(move.to);
  }

  // References can be repository-relative, execution-relative, or absolute under a previous
  // checkout. Match the execution suffix without changing prose, commands, IDs, or log bodies.
  const refs = new Map<string, string>();
  for (const move of [...moves, ...virtualRefs]) {
    refs.set(move.from, move.to);
    refs.set(
      posix(relative(execution, join(root, move.from))),
      posix(relative(execution, join(root, move.to))),
    );
  }
  const rewrite = (value: string): string => {
    const direct = refs.get(value);
    if (direct) return direct;
    for (let slash = value.indexOf("/"); slash >= 0; slash = value.indexOf("/", slash + 1)) {
      const target = refs.get(value.slice(slash + 1));
      if (target) return `${value.slice(0, slash + 1)}${target}`;
    }
    return value;
  };
  const updates: RecordMigration["updates"] = [];
  const targets = new Map(moves.map((move) => [move.from, move.to]));
  const structured = [
    ...moves.map((move) => join(root, move.from)),
    ...listFilesRecursive(join(execution, "jobs", "runs")),
  ];
  for (const path of structured) {
    if (!/\.(json|md)$/.test(path)) continue;
    const original = readFileSync(path, "utf8");
    let content = original;
    if (path.endsWith(".json")) {
      content = rewriteJsonPaths(original, rewrite);
    } else if (path.endsWith(".md")) {
      content = original.replace(/^---\r?\n[\s\S]*?\r?\n---/, (fm) =>
        fm.replace(
          /^(\s*[\w]+(?:_ref|_path):\s*)([^\r\n]+)$/gm,
          (_line, key: string, raw: string) => {
            const quote = raw.startsWith('"') ? '"' : raw.startsWith("'") ? "'" : "";
            const value = quote ? raw.slice(1, -1) : raw;
            return `${key}${quote}${rewrite(value)}${quote}`;
          },
        ),
      );
      if (path.endsWith("-plan.md"))
        content = rebasePlanConventions(content, path, join(root, targets.get(repoRef(path))!));
    }
    if (content !== original)
      updates.push({ path: targets.get(repoRef(path)) ?? repoRef(path), content });
  }
  return { moves, updates, missing, skipped: [] };
}

export function applyRecordMigration(repoRoot: string, plan: RecordMigration): void {
  if (!plan.moves.length && !plan.updates.length) return;
  const tracked = spawnSync("git", ["ls-files", "-z"], {
    cwd: repoRoot,
    env: gitEnvironment(),
    encoding: "utf8",
  });
  if (tracked.status !== 0) throw new Error(`git ls-files failed: ${tracked.stderr}`);
  const files = new Set(tracked.stdout.split("\0"));
  for (const move of plan.moves) {
    if (!files.has(move.from)) throw new Error(`Migration source is not tracked: ${move.from}`);
  }
  for (const move of plan.moves) {
    mkdirSync(dirname(join(repoRoot, move.to)), { recursive: true });
    const result = spawnSync("git", ["mv", "--", move.from, move.to], {
      cwd: repoRoot,
      env: gitEnvironment(),
      encoding: "utf8",
    });
    if (result.status !== 0) throw new Error(`git mv failed: ${move.from}: ${result.stderr}`);
  }
  for (const update of plan.updates) writeFileSync(join(repoRoot, update.path), update.content);
}

export function registerRecordMigrationCommand(exec: Command): void {
  const command = exec
    .command("migrate-records")
    .description("Move tracked legacy run records with git mv");
  addProjectOptions(command);
  command.option("--dry-run", "List moves and reference updates without writing", false);
  command.action((opts) => {
    try {
      const { executionPath } = resolveProjectContext(opts);
      const root = specdojoRootDir();
      const plan = planRecordMigration(root, executionPath, resolveProjectId(opts));
      process.stdout.write(
        `${JSON.stringify({ ...plan, updates: plan.updates.map(({ path }) => path) }, null, 2)}\n`,
      );
      if (!opts.dryRun) applyRecordMigration(root, plan);
    } catch (error) {
      process.stderr.write(
        `blocked: ${error instanceof Error ? error.message : String(error)}; need=resolve migration precondition; ref=${opts.project ?? "current project"}\n`,
      );
      process.exitCode = 1;
    }
  });
}
