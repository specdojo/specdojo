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

export type RunOrigin = "register" | "schedule" | "job";
export type RecordKind = "plan" | "result";

/** All managed execution record paths, including the temporary legacy read layout. */
export function runRecordPaths(
  executionPath: string,
  origin: RunOrigin,
  itemId: string,
  runId: string,
) {
  if (!["register", "schedule", "job"].includes(origin))
    throw new Error(`Invalid run origin: ${origin}`);
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
  return join(executionPath, "runs", origin, pathSegment(itemId));
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

export function legacyRecordDirectory(executionPath: string, kind: RecordKind): string {
  return join(executionPath, "exec", kind === "plan" ? "plans" : "results");
}
export function legacyRecordPath(executionPath: string, kind: RecordKind, stem: string): string {
  return join(legacyRecordDirectory(executionPath, kind), `${stem}-${kind}.md`);
}
export function legacyEvidenceDirectory(executionPath: string, taskId: string): string {
  // Match the historical safeSlug convention, including its 80-character limit.
  const legacyTaskId = taskId
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^A-Za-z0-9._-]/g, "_")
    .slice(0, 80);
  return join(executionPath, "exec", "evidence", pathSegment(legacyTaskId));
}

/** Resume legacy checkpoints in place; fresh runs always use the new layout. */
export function taskEvidencePaths(executionPath: string, taskId: string, runId: string) {
  const records = taskRecordPaths(executionPath, taskId, runId);
  const legacy = join(legacyEvidenceDirectory(executionPath, taskId), pathSegment(runId));
  const directory = existsSync(join(legacy, "pipeline-state.json")) ? legacy : records.directory;
  return {
    directory,
    evidence: join(directory, "evidence.json"),
    state: join(directory, "pipeline-state.json"),
  };
}

/** Both layouts can contain records of the same run after an interrupted upgrade. */
export function runRecordPrefixes(executionPath: string, taskId: string, runId: string): string[] {
  return [
    taskRecordPaths(executionPath, taskId, runId).directory,
    join(legacyEvidenceDirectory(executionPath, taskId), pathSegment(runId)),
  ].map((path) => `${path.replaceAll("\\", "/")}/`);
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
  return [
    ...filesBelow(join(executionPath, "runs")).filter((path) => basename(path) === `${kind}.md`),
    ...filesBelow(legacyRecordDirectory(executionPath, kind)).filter(
      (path) => path.endsWith(`-${kind}.md`) && basename(dirname(path)) !== "done",
    ),
  ];
}

/** Prefer the new layout; fall back to old records without ever creating old paths. */
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
  const legacyFiles = filesBelow(legacyRecordDirectory(executionPath, kind)).filter(
    (path) =>
      basename(dirname(path)) !== "done" &&
      basename(path).toLowerCase().startsWith(taskOrStem.toLowerCase()) &&
      path.endsWith(`-${kind}.md`),
  );
  const matches = [...newFiles, ...legacyFiles].filter((path) => {
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
  const legacy = legacyRecordPath(executionPath, kind, taskOrStem);
  return (
    latest(matches.filter(isRunRecordPath)) ??
    latest(matches) ??
    (existsSync(legacy) ? legacy : undefined)
  );
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
  return [
    join(executionPath, "runs"),
    join(executionPath, "exec", "plans"),
    join(executionPath, "exec", "results"),
    join(executionPath, "exec", "evidence"),
  ].map((path) => `${path.replaceAll("\\", "/")}/`);
}
export function taskRecordPrefixes(executionPath: string, taskId: string): string[] {
  const identity = recordIdentity(taskId);
  return [
    runItemDirectory(executionPath, identity.origin, identity.itemId),
    legacyEvidenceDirectory(executionPath, taskId),
  ].map((path) => `${path.replaceAll("\\", "/")}/`);
}
export function resumeStatePaths(executionPath: string, taskId: string): string[] {
  const identity = recordIdentity(taskId);
  return [
    runItemDirectory(executionPath, identity.origin, identity.itemId),
    legacyEvidenceDirectory(executionPath, taskId),
  ]
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

/** Only the legacy archive command uses this path; new run plans stay beside their result. */
export function legacyArchivePlanPath(executionPath: string, base: string, sequence = 0): string {
  return join(
    legacyRecordDirectory(executionPath, "plan"),
    "done",
    `${base}${sequence ? `-${sequence}` : ""}-plan.md`,
  );
}

export function resolveRunPlanRef(executionPath: string, ref: string): string {
  return ref.replaceAll("\\", "/").startsWith("runs/") ? resolve(executionPath, ref) : resolve(ref);
}
