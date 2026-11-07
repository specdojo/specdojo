import { createHash } from "node:crypto";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { gitOutput, gitResult, worktreeStatusPaths } from "../shared/git.js";
import { listFilesRecursive, writeJson } from "../shared/fs.js";
import { localStateDirectory } from "../shared/local-state.js";
import {
  legacyEvidenceDirectory,
  listRunRecords,
  planConventionsDirectory,
  taskRecordPaths,
} from "../shared/run-records.js";
import { planConventionsFiles } from "../shared/plan-conventions.js";
import { specdojoRootDir } from "../shared/specdojo-config.js";
import type { JobRunRecord } from "./definition.js";

export function jobNoopDirectory(executionPath: string, repoRoot = specdojoRootDir()): string {
  const key = createHash("sha256").update(relative(repoRoot, executionPath)).digest("hex");
  return join(localStateDirectory(repoRoot), "jobs", key, "noops");
}

export function localJobNoopPath(
  executionPath: string,
  runId: string,
  repoRoot = specdojoRootDir(),
): string {
  return join(jobNoopDirectory(executionPath, repoRoot), `${runId}.json`);
}

function fingerprint(file: string): string {
  if (!existsSync(file)) return "missing";
  const stat = lstatSync(file);
  const value = stat.isSymbolicLink()
    ? readlinkSync(file)
    : stat.isFile()
      ? readFileSync(file)
      : "directory";
  return `${stat.mode}:${createHash("sha256").update(value).digest("hex")}`;
}

/** Only this Run's bookkeeping is excluded; nested exec events and grade results are output. */
export function jobBookkeepingPaths(executionPath: string, record: JobRunRecord): string[] {
  const directory = taskRecordPaths(executionPath, record.run_id, record.run_id, "job").directory;
  const paths = [
    ...new Set([
      join(executionPath, "jobs", "runs", `${record.run_id}.json`),
      directory,
      join(executionPath, record.plan_ref),
      join(executionPath, record.result_ref),
      legacyEvidenceDirectory(executionPath, record.run_id),
    ]),
  ];
  return paths.filter(
    (file) => !paths.some((parent) => file !== parent && file.startsWith(`${parent}${sep}`)),
  );
}

export function snapshotJobOutput(repoRoot: string, executionPath: string, record: JobRunRecord) {
  const artifacts = jobBookkeepingPaths(executionPath, record);
  const conventionsDirectory = planConventionsDirectory(executionPath);
  const previousVersions = new Set(
    existsSync(conventionsDirectory) ? readdirSync(conventionsDirectory) : [],
  );
  const ignored = artifacts.map((file) => relative(repoRoot, file).split(sep).join("/"));
  ignored.push(
    relative(repoRoot, conventionsDirectory).split(sep).join("/"),
    relative(repoRoot, join(executionPath, "exec", ".locks"))
      .split(sep)
      .join("/"),
  );
  const substantive = (file: string) =>
    !ignored.some((item) => file === item || file.startsWith(`${item}/`)) &&
    !file.split("/").includes("generated");
  const changes = new Map(
    worktreeStatusPaths(repoRoot)
      .filter(substantive)
      .map((file) => [file, fingerprint(join(repoRoot, file))]),
  );
  const previous = new Map<string, Buffer>();
  for (const file of artifacts.flatMap((item) =>
    existsSync(item) && lstatSync(item).isDirectory() ? listFilesRecursive(item) : [item],
  )) {
    if (existsSync(file)) previous.set(file, readFileSync(file));
  }
  // An initialized repository need not have its first commit yet.
  const headResult = gitResult(repoRoot, ["rev-parse", "--verify", "HEAD"]);
  const head = headResult.status === 0 ? String(headResult.stdout).trim() : undefined;
  return {
    hasChanges(): boolean {
      const after = new Map(
        worktreeStatusPaths(repoRoot)
          .filter(substantive)
          .map((file) => [file, fingerprint(join(repoRoot, file))]),
      );
      if (
        [...new Set([...changes.keys(), ...after.keys()])].some(
          (file) => changes.get(file) !== after.get(file),
        )
      )
        return true;
      return (
        !!head &&
        gitOutput(repoRoot, ["diff", "--name-only", "-z", head, "HEAD", "--"])
          .split("\0")
          .filter(Boolean)
          .some(substantive)
      );
    },
    discard(record: JobRunRecord): void {
      // Keep idempotency and checkpoints locally even though no Run artifacts enter Git.
      const local = localJobNoopPath(executionPath, record.run_id, repoRoot);
      mkdirSync(dirname(local), { recursive: true });
      const noop: JobRunRecord = {
        ...record,
        state: "noop",
        attempts: record.attempts.map((attempt, index) =>
          index === record.attempts.length - 1 ? { ...attempt, status: "noop" } : attempt,
        ),
      };
      writeJson(local, noop);
      const versions = existsSync(join(executionPath, record.plan_ref))
        ? planConventionsFiles(
            readFileSync(join(executionPath, record.plan_ref), "utf8"),
            dirname(join(executionPath, record.plan_ref)),
          )
        : [];
      for (const file of artifacts) rmSync(file, { recursive: true, force: true });
      for (const [file, content] of previous) {
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, content);
      }
      // Remove only snapshots introduced by this discarded Run. Preserve versions
      // referenced by retained plans, including archived legacy plans.
      const retained = new Set(
        [
          ...new Set([
            ...listRunRecords(executionPath, "plan"),
            ...listFilesRecursive(join(executionPath, "exec", "plans")).filter((path) =>
              path.endsWith("-plan.md"),
            ),
          ]),
        ].flatMap((plan) => planConventionsFiles(readFileSync(plan, "utf8"), dirname(plan))),
      );
      for (const version of versions) {
        if (
          !previousVersions.has(version.slice(conventionsDirectory.length + 1)) &&
          !retained.has(version)
        )
          rmSync(version);
      }
    },
  };
}
