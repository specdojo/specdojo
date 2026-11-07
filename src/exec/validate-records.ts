import { spawnSync } from "node:child_process";
import { existsSync, lstatSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import { readSpecdojoNamespace } from "../shared/frontmatter-namespace.js";
import { gitEnvironment } from "../shared/git-environment.js";
import { runRecordLocation, runRecordsDirectory } from "../shared/run-records.js";

export type RecordLayoutIssue = {
  path: string;
  reason: "misplaced" | "missing" | "lock-not-ignored" | "git-check-failed";
  message: string;
};

/** Read-only layout audit. Logs, evidence and checkpoint contents are never read. */
export function validateRunRecordLayout(options: {
  executionPath: string;
  repoRoot: string;
  routinesPath?: string;
}): RecordLayoutIssue[] {
  const { executionPath, repoRoot, routinesPath } = options;
  const issues: RecordLayoutIssue[] = [];
  const locks = new Set<string>();
  const report = (path: string, reason: RecordLayoutIssue["reason"], message: string) => {
    issues.push({ path: relative(repoRoot, path).replaceAll("\\", "/"), reason, message });
  };
  const entries = (directory: string) =>
    readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
  const isFile = (path: string) => existsSync(path) && lstatSync(path).isFile();

  function collectLocks(path: string): boolean {
    if (lstatSync(path).isDirectory()) {
      // Empty directory trees cannot contain runtime locks and Git cannot track them.
      const children = entries(path).map((entry) => collectLocks(join(path, entry.name)));
      if (!children.some(Boolean)) return false;
    }
    locks.add(resolve(path));
    return true;
  }

  const itemHasPair = new Map<string, boolean>();
  function hasSiblingPair(directory: string): boolean {
    const item = dirname(directory);
    if (!itemHasPair.has(item)) {
      itemHasPair.set(
        item,
        entries(item).some((entry) => {
          if (!entry.isDirectory() || entry.name === basename(directory)) return false;
          const paths = runRecordLocation(executionPath, join(item, entry.name));
          return paths !== undefined && isFile(paths.plan) && isFile(paths.result);
        }),
      );
    }
    return itemHasPair.get(item)!;
  }

  function checkRun(directory: string): void {
    const paths = runRecordLocation(executionPath, directory);
    if (!paths) return;
    // Before evidence existed, a plan/result pair was a complete run.
    if (
      isFile(paths.plan) &&
      isFile(paths.result) &&
      !existsSync(paths.state) &&
      !existsSync(paths.evidence)
    )
      return;
    // Migration consolidated shared plan/result pairs into another run of the same item.
    if (
      !existsSync(paths.plan) &&
      !existsSync(paths.result) &&
      isFile(paths.state) &&
      isFile(paths.evidence) &&
      hasSiblingPair(directory)
    )
      return;
    // Human work is explicitly result-only; absent or malformed metadata gets no exemption.
    const human =
      isFile(paths.result) &&
      readSpecdojoNamespace(readFileSync(paths.result, "utf8")).execution === "human";
    for (const path of human ? [paths.result] : [paths.plan, paths.result, paths.evidence]) {
      if (!isFile(path))
        report(path, "missing", "required run record is missing or not a regular file");
    }
  }

  const runs = resolve(runRecordsDirectory(executionPath));
  // These have independent formats and lifecycles (PJR-VH8D / PJR-9BY9 / PJR-PZBP).
  const separateTrees = new Set([
    "grade/results",
    "grade/generated",
    "jobs/runs",
    "exec/events",
    "exec/trials",
    "exec/plans",
    "exec/results",
    "exec/evidence",
    "conventions",
    "generated",
    "routines/failures",
  ]);
  function walk(directory: string): void {
    checkRun(directory);
    for (const entry of entries(directory)) {
      const path = join(directory, entry.name);
      const rel = relative(executionPath, path).replaceAll("\\", "/");
      if (entry.name === ".locks" || entry.name.endsWith(".lock")) {
        collectLocks(path);
        continue;
      }
      if (separateTrees.has(rel)) continue;
      const inRuns = resolve(path).startsWith(`${runs}${sep}`);
      if (entry.isDirectory()) {
        // Validate empty run directories too; reject unknown origins and extra nesting.
        const depth = relative(runs, path).split(/[\\/]/).length;
        if (inRuns && depth >= 3 && !runRecordLocation(executionPath, path)) {
          report(path, "misplaced", "expected runs/<origin>/<item ID>/<run ID>/");
        }
        walk(path);
      } else if (
        inRuns
          ? !entry.isFile() || !runRecordLocation(executionPath, directory)
          : /^(?:plan\.md|result\.md|evidence(?:\.attempt-\d+)?\.json|pipeline-state(?:\.attempt-\d+)?\.json)$/.test(
              basename(path),
            ) || /(?:-(?:plan|result)\.md|\.log)$/.test(entry.name)
      ) {
        report(
          path,
          "misplaced",
          "execution record must be a regular file directly in runs/<origin>/<item ID>/<run ID>/",
        );
      }
    }
  }
  if (existsSync(executionPath)) walk(executionPath);
  const oldRoutineLocks = routinesPath && join(routinesPath, ".locks");
  if (oldRoutineLocks && existsSync(oldRoutineLocks)) collectLocks(oldRoutineLocks);

  if (locks.size) {
    const candidates = [...locks].sort();
    // Without --no-index, tracked locks are correctly rejected even if a rule now ignores them.
    const result = spawnSync("git", ["check-ignore", "-z", "--stdin"], {
      cwd: repoRoot,
      env: gitEnvironment(),
      input: `${candidates.join("\0")}\0`,
      encoding: "utf8",
      timeout: 10_000,
    });
    if (result.error || (result.status !== 0 && result.status !== 1)) {
      report(
        candidates[0],
        "git-check-failed",
        "cannot verify lock exclusion with git check-ignore",
      );
    } else {
      const ignored = new Set(result.stdout.split("\0"));
      for (const path of candidates) {
        if (!ignored.has(path))
          report(path, "lock-not-ignored", "runtime lock is tracked or not ignored by Git");
      }
    }
  }
  return issues.sort((a, b) => a.path.localeCompare(b.path) || a.reason.localeCompare(b.reason));
}
