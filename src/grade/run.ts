import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import type { GradeAgentRuntime } from "../shared/agent-plan.js";
import { getProjectExecutionPath, specdojoRootDir } from "../shared/specdojo-config.js";
import { delay, LOCK_POLL_MS, tryAcquireLock, releaseLock } from "../shared/cross-process-lock.js";
import { applyGradeSubmission, buildGradeSubmissionFromAnalysis } from "./apply.js";
import { type GradeTarget, type GradeTargetFilters } from "./core.js";
import { readGradePipelineState, recordGradePipelineStage } from "./pipeline-state.js";
import { writeGradePlans } from "./plan.js";
import { gradeContentHash, gradeFindingCount, readGradeResultForDocument } from "./result.js";
import { discoverGradeTargets } from "./target-discovery.js";
import {
  loadViewpoints,
  repoRelativePath,
  resolveDeliverableDoneCriteria,
  resolveGradeSourceHashes,
  resolveKataBatchTargets,
  resolveProject,
  resolveSafeMarkdownPath,
  resolveSafeRepositoryPath,
} from "./targets.js";

export type GradeRunOptions = GradeTargetFilters & {
  target: GradeTarget;
  project?: string;
  paths?: string[];
  kata?: string[];
  kind?: string;
  runId: string;
  by?: string;
  workDir?: string;
  isolatePipelineState?: boolean;
  ifBusy?: "fail" | "wait";
  reference?: string;
  /** Kata only: compare each document with the same-kind prj-overview document. */
  referencePerKind?: boolean;
  embedDocuments?: boolean;
  maxStageFailures?: number;
  limit?: number;
  dryRun?: boolean;
  execDefaultsPath?: string;
};

type DocumentRun = {
  path: string;
  fingerprint: string;
  status: "pending" | "failed" | "complete";
  actor?: string;
  error?: string;
  resultHash?: string;
  appliedAt?: string;
};
type RunState = { version: 1; request: string; documents: DocumentRun[] };

/**
 * A run that stopped with documents left ungraded. Callers such as scheduled jobs tell a
 * partial run (2) from a run without any completed document (1) and from a rate limit (75),
 * after which the same run id resumes.
 */
export class GradeRunIncompleteError extends Error {
  constructor(
    message: string,
    readonly exitCode: 1 | 2 | 75,
  ) {
    super(message);
    this.name = "GradeRunIncompleteError";
  }
}

export const GRADE_RUN_PARTIAL_EXIT_CODE = 2;
export const GRADE_RUN_RATE_LIMIT_EXIT_CODE = 75;

const PER_KIND_REFERENCES: Record<string, string> = {
  rulebooks: "docs/ja/specdojo/rulebooks/prj-overview-rulebook.md",
  recipes: "docs/ja/specdojo/recipes/prj-overview-recipe.md",
  samples: "docs/ja/specdojo/samples/prj-overview-sample.md",
  templates: "docs/ja/specdojo/templates/prj-overview-template.md",
};

function perKindReference(documentPath: string): string | undefined {
  const kindDirectory = documentPath.split("/").find((part) => part in PER_KIND_REFERENCES);
  if (!kindDirectory) throw new Error(`${documentPath}: cannot determine the Kata kind`);
  const reference = PER_KIND_REFERENCES[kindDirectory]!;
  if (existsSync(resolve(specdojoRootDir(), reference))) return reference;
  process.stderr.write(
    `grade run: ${documentPath}: same-kind reference not found; continuing without a reference: ${reference}\n`,
  );
  return undefined;
}

const digest = (value: unknown): string =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");

function referenceHash(reference: string | undefined, project: string): string | undefined {
  return reference
    ? gradeContentHash(
        readFileSync(resolveSafeMarkdownPath(reference, specdojoRootDir(), project), "utf8"),
      )
    : undefined;
}

function writeState(path: string, state: RunState): void {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(state, null, 2)}\n`, "utf8");
  renameSync(temporary, path);
}

/** Native single-document pipeline. A stable run id freezes selection and completed work. */
export async function runGrade(
  opts: GradeRunOptions,
  runtime: GradeAgentRuntime,
): Promise<{ documents: DocumentRun[] }> {
  if (opts.ifBusy !== undefined && opts.ifBusy !== "fail" && opts.ifBusy !== "wait")
    throw new Error("Invalid --if-busy; expected fail or wait");
  // Serialize all runs for a project: different run ids still write the same canonical sidecars.
  if (opts.dryRun) return runGradeUnlocked(opts, runtime);
  const { project } = resolveProject(opts.project);
  const lockPath = resolveSafeRepositoryPath(
    join(getProjectExecutionPath(project), "grade", "generated", "run.lock"),
    "grade lock",
  );
  mkdirSync(dirname(lockPath), { recursive: true });
  const owner = { actor: opts.by ?? "grade", label: opts.runId };
  let lock = tryAcquireLock(lockPath, owner);
  if (!lock && opts.ifBusy === "wait") {
    process.stdout.write("grade run is busy for this project; waiting for the active run\n");
    while (!lock) {
      await delay(LOCK_POLL_MS);
      lock = tryAcquireLock(lockPath, owner);
    }
  }
  if (!lock)
    throw new Error("grade run is busy for this project; retry after the active run finishes");
  try {
    return await runGradeUnlocked(opts, runtime);
  } finally {
    releaseLock(lock);
  }
}

async function runGradeUnlocked(
  opts: GradeRunOptions,
  runtime: GradeAgentRuntime,
): Promise<{ documents: DocumentRun[] }> {
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(opts.runId)) throw new Error("Invalid --run-id");
  const kind = opts.kind ?? "all";
  if (!["all", "rulebook", "recipe", "sample", "template"].includes(kind))
    throw new Error("Invalid --kind");
  if (opts.target !== "kata" && opts.kind !== undefined)
    throw new Error("--kind is only valid for kata");
  if (opts.target !== "kata" && (opts.kata?.length ?? 0) > 0)
    throw new Error("--kata is only valid for kata");
  if (opts.paths?.length && (opts.kata?.length ?? 0) > 0)
    throw new Error("Use either --path or --kata");
  let documentsByKata: Map<string, string[]> | undefined;
  if (opts.kata && opts.kata.length > 0) {
    documentsByKata = resolveKataBatchTargets(opts.kata, specdojoRootDir()).documentsByKata;
  }
  const maxFailures = opts.maxStageFailures ?? 3;
  if (!Number.isSafeInteger(maxFailures) || maxFailures < 1)
    throw new Error("Invalid --max-stage-failures");
  if (opts.limit !== undefined && (!Number.isSafeInteger(opts.limit) || opts.limit < 1))
    throw new Error("Invalid --limit");
  if (opts.referencePerKind && opts.target !== "kata")
    throw new Error("--reference-per-kind is only valid for kata");
  if (opts.referencePerKind && opts.reference !== undefined)
    throw new Error("Use either --reference or --reference-per-kind");
  const { id: projectId, project } = resolveProject(opts.project);
  const viewpoints = loadViewpoints(projectId);
  const executionPath = getProjectExecutionPath(project);
  const execDefaultsPath =
    opts.execDefaultsPath ??
    (project.run?.exec_defaults
      ? resolve(specdojoRootDir(), project.run.exec_defaults)
      : undefined);
  const directory = resolveSafeRepositoryPath(
    opts.workDir ?? join(executionPath, "grade", "generated", "runs", opts.runId),
    "--work-dir",
  );
  const statePath = join(directory, "run.json");
  // Review preparation runs in the integration worktree. Its failures must never mutate
  // shared retry state that another task may already have included in its checkpoint.
  const pipelineStateDirectory = opts.isolatePipelineState
    ? join(directory, "pipeline")
    : undefined;
  const requestOptions = Object.fromEntries(
    Object.entries(opts).filter(([key]) => key !== "dryRun" && key !== "ifBusy"),
  );
  const request = digest({ ...requestOptions, project: projectId });
  let state: RunState;
  if (existsSync(statePath)) {
    const stored: unknown = JSON.parse(readFileSync(statePath, "utf8"));
    if (
      !stored ||
      typeof stored !== "object" ||
      !("version" in stored) ||
      stored.version !== 1 ||
      !("request" in stored) ||
      stored.request !== request ||
      !("documents" in stored) ||
      !Array.isArray(stored.documents)
    ) {
      throw new Error(
        "Run configuration changed or invalid run state; use a new --run-id / --work-dir",
      );
    }
    state = stored as RunState;
    for (const document of state.documents) {
      if (
        !document ||
        typeof document.path !== "string" ||
        typeof document.fingerprint !== "string" ||
        !["pending", "failed", "complete"].includes(document.status)
      )
        throw new Error("Invalid grade run document state");
    }
  } else {
    let paths: string[];
    if (documentsByKata) {
      const flattened = Array.from(documentsByKata.values()).flat();
      paths = Array.from(new Set(flattened));
    } else {
      paths = discoverGradeTargets({ ...opts, project: projectId });
      if (opts.target === "kata" && kind !== "all")
        paths = paths.filter((path) => repoRelativePath(path).split("/").includes(`${kind}s`));
      if (opts.limit !== undefined) paths = paths.slice(0, opts.limit);
    }
    state = {
      version: 1,
      request,
      documents: paths.map((path) => ({
        path: repoRelativePath(path),
        fingerprint: "",
        status: "pending",
      })),
    };
  }
  const criteria =
    opts.target === "deliverable"
      ? resolveDeliverableDoneCriteria(
          state.documents.map((document) => document.path),
          projectId,
        )
      : undefined;
  const references = new Map<string, string | undefined>(
    state.documents.map((document) => [
      document.path,
      opts.referencePerKind ? perKindReference(document.path) : opts.reference,
    ]),
  );
  // Validate all subjects before starting any agent or writing run files.
  for (const document of state.documents) {
    const path = resolveSafeMarkdownPath(document.path, specdojoRootDir(), projectId);
    const fingerprint = digest({
      content: gradeContentHash(readFileSync(path, "utf8")),
      reference: referenceHash(references.get(document.path), projectId),
      viewpoints,
      criteria: criteria?.get(document.path),
      sources: resolveGradeSourceHashes({
        path,
        target: opts.target,
        project: projectId,
        viewpoints,
      }),
    });
    if (document.fingerprint && document.fingerprint !== fingerprint)
      throw new Error(`${document.path}: grading context changed; use a new --run-id`);
    document.fingerprint = fingerprint;
    if (document.status === "complete" || document.appliedAt) {
      const result = readGradeResultForDocument({
        documentPath: document.path,
        project: projectId,
      });
      // The canonical result is written after the criteria detail. Recover the narrow
      // interruption between apply and persisting completion without reapplying the stage.
      if (
        document.status !== "complete" &&
        result &&
        result.graded_at === document.appliedAt &&
        result.graded_by === document.actor &&
        result.content_hash === gradeContentHash(readFileSync(path, "utf8")) &&
        result.target === opts.target &&
        result.path === document.path
      ) {
        document.status = "complete";
        document.resultHash = digest(result);
      }
      if (document.status !== "complete") continue;
      if (!result || digest(result) !== document.resultHash)
        throw new Error(
          `${document.path}: completed grade was replaced or removed; use a new --run-id`,
        );
    }
  }
  if (state.documents.length === 0) return { documents: [] };
  const actor = state.documents.some((document) => document.status !== "complete")
    ? runtime.resolveActor({ ...opts, execDefaultsPath })
    : undefined;
  if (opts.dryRun) {
    for (const document of state.documents)
      process.stdout.write(
        `[dry-run] ${document.path} actor=${actor ?? document.actor} status=${document.status}\n`,
      );
    return { documents: state.documents };
  }
  writeState(statePath, state);
  const failures: string[] = [];
  let rateLimited = false;
  let rateLimitedActor: string | undefined;
  for (const [index, document] of state.documents.entries()) {
    const reference = references.get(document.path);
    if (document.status === "complete") {
      recordGradePipelineStage({
        directory: pipelineStateDirectory,
        target: opts.target,
        project: projectId,
        path: document.path,
        runId: opts.runId,
        stage: 1,
        stageTotal: 1,
        maxFailures,
        status: "complete",
      });
      process.stdout.write(`resumed complete: ${document.path}\n`);
      continue;
    }
    const prior = readGradePipelineState({
      directory: pipelineStateDirectory,
      target: opts.target,
      project: projectId,
      path: document.path,
    });
    if (prior && prior.stage_total === 1 && prior.consecutive_failures >= prior.max_failures) {
      failures.push(`${document.path}: stage failure limit reached`);
      continue;
    }
    // The native runner has one stage. Old experimental three-stage retries cannot be reused.
    if (prior && prior.stage_total !== 1)
      recordGradePipelineStage({
        directory: pipelineStateDirectory,
        target: opts.target,
        project: projectId,
        path: document.path,
        runId: opts.runId,
        stage: 1,
        stageTotal: 1,
        maxFailures,
        status: "complete",
      });
    const stageDirectory = join(directory, String(index + 1), "stage-1");
    try {
      const [plan] = writeGradePlans({
        target: opts.target,
        paths: [document.path],
        referenceExampleCandidates: [],
        referenceExampleOverride: reference,
        viewpoints,
        projectId,
        outputDirectory: stageDirectory,
        embedDocuments: opts.embedDocuments,
        doneCriteriaByPath: criteria,
      });
      document.actor = actor;
      document.status = "pending";
      delete document.error;
      writeState(statePath, state);
      const { execution, actor: actualActor } = await runtime.executePlan({
        planPath: resolve(specdojoRootDir(), plan.path),
        nickname: actor!,
        project: projectId,
        execDefaultsPath,
        quiet: true,
      });
      document.actor = actualActor;
      if (!execution) throw new Error("Agent returned no execution result");
      if (execution.result === "rate_limit") {
        // A rate limit is not a document failure: keep the stage retryable in this run id.
        document.status = "pending";
        writeState(statePath, state);
        rateLimited = true;
        rateLimitedActor = actualActor;
        continue;
      }
      writeFileSync(join(stageDirectory, "executor-output.txt"), execution.stdout, "utf8");
      if (execution.result !== "success")
        throw new Error(
          `agent ${actualActor}: ${execution.result} exit=${execution.exitCode ?? "null"}`,
        );
      // Refuse output if the agent (or another process) changed the grading context while running.
      const currentPath = resolveSafeMarkdownPath(document.path, specdojoRootDir(), projectId);
      const currentFingerprint = digest({
        content: gradeContentHash(readFileSync(currentPath, "utf8")),
        reference: referenceHash(reference, projectId),
        viewpoints: loadViewpoints(projectId),
        criteria:
          opts.target === "deliverable"
            ? resolveDeliverableDoneCriteria([document.path], projectId).get(document.path)
            : undefined,
        sources: resolveGradeSourceHashes({
          path: currentPath,
          target: opts.target,
          project: projectId,
        }),
      });
      if (currentFingerprint !== document.fingerprint)
        throw new Error("grading context changed during agent execution; use a new --run-id");
      const converted = buildGradeSubmissionFromAnalysis({
        executorOutput: execution.stdout,
        viewpoints,
        target: opts.target,
        expectedPath: document.path,
        doneCriteria: criteria?.get(document.path),
      });
      if (!converted.submission)
        throw new Error(
          converted.issues.map((issue) => `${issue.path}: ${issue.message}`).join("\n"),
        );
      document.appliedAt = new Date().toISOString();
      writeState(statePath, state);
      applyGradeSubmission({
        submission: converted.submission,
        viewpoints,
        target: opts.target,
        gradedBy: actualActor,
        reference,
        doneCriteriaByPath: criteria,
        criteriaDirectory: join(executionPath, "grade", "criteria"),
        resultsDirectory: join(executionPath, "grade", "results"),
        project: projectId,
        now: new Date(document.appliedAt),
      });
      const result = readGradeResultForDocument({
        documentPath: document.path,
        project: projectId,
      });
      if (!result) throw new Error("grade result missing after apply");
      document.status = "complete";
      document.resultHash = digest(result);
      writeState(statePath, state);
      recordGradePipelineStage({
        directory: pipelineStateDirectory,
        target: opts.target,
        project: projectId,
        path: document.path,
        runId: opts.runId,
        stage: 1,
        stageTotal: 1,
        maxFailures,
        status: "complete",
      });
      process.stdout.write(
        `graded: ${document.path} actor=${actualActor} verdict=${result.verdict} score=${result.score} findings=${gradeFindingCount(result)}\n`,
      );
    } catch (error) {
      if (error instanceof GradeRunIncompleteError) throw error;
      document.status = "failed";
      document.error = error instanceof Error ? error.message : String(error);
      writeState(statePath, state);
      recordGradePipelineStage({
        directory: pipelineStateDirectory,
        target: opts.target,
        project: projectId,
        path: document.path,
        runId: opts.runId,
        stage: 1,
        stageTotal: 1,
        maxFailures,
        status: "failed",
      });
      failures.push(`${document.path}: ${document.error}`);
    }
  }
  if (documentsByKata && documentsByKata.size > 0) {
    process.stdout.write("kata results:\n");
    for (const [name, docs] of documentsByKata) {
      const statuses = docs.map((docPath) => {
        const repoPath = repoRelativePath(docPath);
        const doc = state.documents.find((item) => item.path === repoPath);
        return doc?.status ?? "pending";
      });
      let verdictJa = "未実行";
      let verdictEn = "pending";
      if (statuses.every((s) => s === "complete")) {
        verdictJa = "完了";
        verdictEn = "complete";
      } else if (statuses.some((s) => s === "failed")) {
        verdictJa = "失敗";
        verdictEn = "failed";
      }
      process.stdout.write(`  ${name}: ${verdictJa} (${verdictEn})\n`);
    }
  }
  if (rateLimited) {
    const unstarted = state.documents
      .filter((item) => item.status !== "complete")
      .map((item) => item.path);
    throw new GradeRunIncompleteError(
      [
        `grade run stopped by rate limit: agent=${rateLimitedActor ?? actor} run_id=${opts.runId}; rerun with the same --run-id to resume`,
        ...unstarted.map((path) => `grade run remaining: ${path}`),
      ].join("\n"),
      GRADE_RUN_RATE_LIMIT_EXIT_CODE,
    );
  }
  if (failures.length) {
    const completed = state.documents.filter((document) => document.status === "complete").length;
    throw new GradeRunIncompleteError(
      `grade run incomplete: completed=${completed} failed=${failures.length} run_id=${opts.runId}\n${failures.join("\n")}`,
      completed > 0 ? GRADE_RUN_PARTIAL_EXIT_CODE : 1,
    );
  }
  return { documents: state.documents };
}
