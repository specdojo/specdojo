import {
  copyFileSync,
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { readSpecdojoNamespace } from "./frontmatter-namespace.js";

function pathSegment(value: string): string {
  const segment = value.trim().replace(/[^A-Za-z0-9._-]/g, "_");
  if (!segment || segment === "." || segment === "..")
    throw new Error(`Invalid run record identity: ${value}`);
  return segment;
}

export const RUN_ORIGINS = ["register", "schedule", "job"] as const;
export type RunOrigin = (typeof RUN_ORIGINS)[number];
export type RecordKind = "plan" | "result";

export function runRecordsDirectory(executionPath: string): string {
  return join(executionPath, "runs");
}

/** Accept only an exact origin/item/run directory produced by the path policy. */
export function runRecordLocation(executionPath: string, directory: string) {
  const parts = relative(runRecordsDirectory(executionPath), directory).split(/[\\/]/);
  if (parts.length !== 3 || !RUN_ORIGINS.includes(parts[0] as RunOrigin)) return undefined;
  try {
    const paths = runRecordPaths(executionPath, parts[0] as RunOrigin, parts[1], parts[2]);
    return resolve(paths.directory) === resolve(directory) ? paths : undefined;
  } catch {
    return undefined;
  }
}

export function planConventionsDirectory(executionPath: string): string {
  return join(executionPath, "conventions");
}

export function planConventionsPath(executionPath: string, hash: string): string {
  if (!/^[a-f0-9]{64}$/.test(hash)) throw new Error(`Invalid conventions SHA-256: ${hash}`);
  return join(planConventionsDirectory(executionPath), `${hash}.txt`);
}

/** All managed execution record paths. */
export function runRecordPaths(
  executionPath: string,
  origin: RunOrigin,
  itemId: string,
  runId: string,
) {
  if (!RUN_ORIGINS.includes(origin)) throw new Error(`Invalid run origin: ${origin}`);
  const directory = join(runItemDirectory(executionPath, origin, itemId), pathSegment(runId));
  return {
    directory,
    plan: join(directory, "plan.md"),
    result: join(directory, "result.md"),
    evidence: join(directory, "evidence.json"),
    state: join(directory, "pipeline-state.json"),
    log: (name: string) => join(directory, basename(name)),
  };
}

export function recordIdentity(taskId: string, origin?: RunOrigin) {
  const local = taskId.replace(/^[^:]+:/, "");
  const inferred =
    origin ?? (/^pjr-/i.test(local) ? "register" : /^JBR-/i.test(local) ? "job" : "schedule");
  const itemId =
    inferred === "register"
      ? (local.match(/^pjr-[a-z0-9]+/i)?.[0] ?? local).toUpperCase()
      : inferred === "job"
        ? local.replace(/-review$/, "")
        : local;
  return { origin: inferred, itemId };
}

export function runItemDirectory(executionPath: string, origin: RunOrigin, itemId: string): string {
  return join(runRecordsDirectory(executionPath), origin, pathSegment(itemId));
}

export function taskRecordPaths(
  executionPath: string,
  taskId: string,
  runId = taskId,
  origin?: RunOrigin,
) {
  const identity = recordIdentity(taskId, origin);
  return runRecordPaths(executionPath, identity.origin, identity.itemId, runId);
}

export function taskEvidencePaths(executionPath: string, taskId: string, runId: string) {
  const records = taskRecordPaths(executionPath, taskId, runId);
  return { directory: records.directory, evidence: records.evidence, state: records.state };
}

export function runRecordPrefixes(executionPath: string, taskId: string, runId: string): string[] {
  return [`${taskRecordPaths(executionPath, taskId, runId).directory.replaceAll("\\", "/")}/`];
}

function filesBelow(path: string): string[] {
  if (!existsSync(path)) return [];
  return readdirSync(path, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      const child = join(path, entry.name);
      return entry.isDirectory() ? filesBelow(child) : entry.isFile() ? [child] : [];
    });
}

export function listRunRecords(executionPath: string, kind: RecordKind): string[] {
  return filesBelow(join(executionPath, "runs")).filter((path) => basename(path) === `${kind}.md`);
}

/** Find the latest run for an item, or a run with the requested stem. */

export function findRunRecord(
  executionPath: string,
  kind: RecordKind,
  taskOrStem: string,
): string | undefined {
  const identity = recordIdentity(taskOrStem);
  const itemDirectory = runItemDirectory(executionPath, identity.origin, identity.itemId);
  const newFiles = filesBelow(
    existsSync(itemDirectory) ? itemDirectory : join(executionPath, "runs"),
  ).filter((path) => basename(path) === `${kind}.md`);
  const matches = newFiles.filter((path) => {
    if (recordStem(path) === taskOrStem) return true;
    try {
      return readSpecdojoNamespace(readFileSync(path, "utf8")).task_id === taskOrStem;
    } catch {
      return false;
    }
  });
  const latest = (paths: string[]) =>
    paths
      .sort((a, b) => {
        const time = (path: string) => {
          if (kind === "result") {
            try {
              const started = readSpecdojoNamespace(readFileSync(path, "utf8")).started_at;
              const timestamp = typeof started === "string" ? Date.parse(started) : NaN;
              if (Number.isFinite(timestamp)) return timestamp;
            } catch {
              /* Fall back to the file timestamp for malformed historical records. */
            }
          }
          return statSync(path).birthtimeMs || statSync(path).mtimeMs;
        };
        return time(a) - time(b) || a.localeCompare(b);
      })
      .at(-1);
  return latest(matches);
}

export function recordPathForRead(
  executionPath: string,
  kind: RecordKind,
  taskOrStem: string,
): string {
  return (
    findRunRecord(executionPath, kind, taskOrStem) ??
    taskRecordPaths(executionPath, taskOrStem)[kind]
  );
}

export function isRunRecordPath(path: string): boolean {
  return /(?:^|\/)runs\/(?:register|schedule|job)\/[^/]+\/[^/]+\//.test(path.replaceAll("\\", "/"));
}
export function recordStem(path: string): string {
  return isRunRecordPath(path)
    ? basename(dirname(path))
    : basename(path).replace(/-(plan|result)\.md$/, "");
}
export function resultForPlan(planPath: string): string {
  return isRunRecordPath(planPath)
    ? join(dirname(planPath), "result.md")
    : planPath.replace(/-plan\.md$/, "-result.md");
}
export function recordRef(executionPath: string, path: string): string {
  return relative(executionPath, path).replaceAll("\\", "/");
}
export function runnerRecordPrefixes(executionPath: string): string[] {
  return [planConventionsDirectory(executionPath), join(executionPath, "runs")].map(
    (path) => `${path.replaceAll("\\", "/")}/`,
  );
}
export function taskRecordPrefixes(executionPath: string, taskId: string): string[] {
  const identity = recordIdentity(taskId);
  return [
    planConventionsDirectory(executionPath),
    runItemDirectory(executionPath, identity.origin, identity.itemId),
  ].map((path) => `${path.replaceAll("\\", "/")}/`);
}
export function resumeStatePaths(executionPath: string, taskId: string): string[] {
  const identity = recordIdentity(taskId);
  return [runItemDirectory(executionPath, identity.origin, identity.itemId)]
    .flatMap(filesBelow)
    .filter((path) => basename(path) === "pipeline-state.json");
}
export function runEvidencePath(statePath: string): string {
  return join(dirname(statePath), "evidence.json");
}
export function runLogPath(statePath: string, name: string): string {
  return join(dirname(statePath), basename(name));
}

export function executionRecordLink(file: string, kind: RecordKind): string {
  return join(
    "..",
    "exec",
    file.includes("/") ? file : `${kind === "plan" ? "plans" : "results"}/${file}`,
  ).replaceAll("\\", "/");
}

export function isPlanOrResultRecord(path: string): boolean {
  // Recognize obsolete names for commit-scope protection without reading that layout.
  return (
    /(?:^|\/)exec\/(?:plans|results)\//.test(path.replaceAll("\\", "/")) ||
    (isRunRecordPath(path) && /\/(plan|result)\.md$/.test(path.replaceAll("\\", "/")))
  );
}
export function isOtherRunRecord(path: string, resultPath: string): boolean {
  return isRunRecordPath(path) && dirname(path) !== dirname(resultPath);
}

/** Keep previous checkpoint evidence when the executor restarts within the same run. */
export function snapshotRunAttempt(statePath: string): void {
  if (!existsSync(statePath)) return;
  const directory = dirname(statePath);
  let attempt = 1;
  while (existsSync(join(directory, `pipeline-state.attempt-${attempt}.json`))) attempt++;
  for (const name of readdirSync(directory).filter(
    (file) => file === "pipeline-state.json" || file === "evidence.json" || file.endsWith(".log"),
  )) {
    if (name.includes(".attempt-")) continue;
    const dot = name.lastIndexOf(".");
    const destination = join(
      directory,
      `${name.slice(0, dot)}.attempt-${attempt}${name.slice(dot)}`,
    );
    copyFileSync(join(directory, name), destination);
    if (name === "evidence.json") {
      try {
        const evidence = JSON.parse(readFileSync(destination, "utf8"));
        if (Array.isArray(evidence.log_refs)) {
          evidence.log_refs = evidence.log_refs.map((ref: { path: string }) => {
            const dot = ref.path.lastIndexOf(".");
            return {
              ...ref,
              path: `${ref.path.slice(0, dot)}.attempt-${attempt}${ref.path.slice(dot)}`,
            };
          });
          writeFileSync(destination, `${JSON.stringify(evidence, null, 2)}\n`);
        }
      } catch {
        /* Preserve malformed evidence verbatim for diagnosis. */
      }
    }
  }
}

export function resolveRunPlanRef(executionPath: string, ref: string): string {
  return ref.replaceAll("\\", "/").startsWith("runs/") ? resolve(executionPath, ref) : resolve(ref);
}
