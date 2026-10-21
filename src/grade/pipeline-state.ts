import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, isAbsolute, join, resolve } from "node:path";
import { listFilesRecursive } from "../shared/fs.js";
import {
  isRecord,
  parseMarkdown,
  pipelineContentHash,
  type GradePipelineState,
  type GradeTarget,
  type MarkdownDocument,
} from "./core.js";
import {
  relativePathFromRoot,
  repoRelativePath,
  resolveProject,
  resolveSafeMarkdownPath,
} from "./targets.js";
import { getProjectExecutionPath, specdojoRootDir } from "../shared/specdojo-config.js";

function gradePipelineStateDirectory(projectOption?: string, rootDir = specdojoRootDir()): string {
  const { project } = resolveProject(projectOption);
  return resolve(rootDir, getProjectExecutionPath(project), "grade", "pipeline");
}

function gradePipelineStatePath(
  documentPath: string,
  projectOption?: string,
  rootDir = specdojoRootDir(),
): string {
  const relativeDocument = relativePathFromRoot(resolve(rootDir, documentPath), rootDir);
  const stem = basename(relativeDocument, extname(relativeDocument)).replace(
    /[^A-Za-z0-9._-]/g,
    "-",
  );
  const digest = createHash("sha256").update(relativeDocument).digest("hex").slice(0, 12);
  return join(gradePipelineStateDirectory(projectOption, rootDir), `${stem}-${digest}.json`);
}

function parseGradePipelineState(value: unknown, path: string): GradePipelineState {
  if (!isRecord(value)) throw new Error(`${path}: grade pipeline state must be an object`);
  const integer = (key: keyof GradePipelineState, minimum: number): number => {
    const candidate = value[key];
    if (!Number.isSafeInteger(candidate) || (candidate as number) < minimum) {
      throw new Error(`${path}: ${key} must be an integer >= ${minimum}`);
    }
    return candidate as number;
  };
  const text = (key: keyof GradePipelineState): string => {
    const candidate = value[key];
    if (typeof candidate !== "string" || !candidate.trim()) {
      throw new Error(`${path}: ${key} must be a non-empty string`);
    }
    return candidate;
  };
  const target = value.target;
  if (target !== "kata" && target !== "deliverable") {
    throw new Error(`${path}: target must be kata or deliverable`);
  }
  const stageFailed = value.stage_failed;
  if (stageFailed !== null && (!Number.isSafeInteger(stageFailed) || (stageFailed as number) < 1)) {
    throw new Error(`${path}: stage_failed must be null or a positive integer`);
  }
  const state: GradePipelineState = {
    version: integer("version", 1) as 1,
    project_id: text("project_id"),
    target,
    document: text("document"),
    content_hash: text("content_hash"),
    stage_completed: integer("stage_completed", 0),
    stage_failed: stageFailed as number | null,
    stage_total: integer("stage_total", 1),
    consecutive_failures: integer("consecutive_failures", 0),
    max_failures: integer("max_failures", 1),
    last_run_id: text("last_run_id"),
    updated_at: text("updated_at"),
  };
  if (state.version !== 1) throw new Error(`${path}: unsupported grade pipeline state version`);
  if (!/^[a-f0-9]{64}$/.test(state.content_hash)) {
    throw new Error(`${path}: content_hash must be a SHA-256 hex digest`);
  }
  if (
    isAbsolute(state.document) ||
    !state.document.startsWith("docs/") ||
    state.document.split("/").includes("..")
  ) {
    throw new Error(`${path}: document must be a repository-relative path below docs/`);
  }
  if (state.stage_completed >= state.stage_total) {
    throw new Error(`${path}: completed pipeline state must be removed`);
  }
  if (state.stage_failed !== null && state.stage_failed !== state.stage_completed + 1) {
    throw new Error(`${path}: stage_failed must immediately follow stage_completed`);
  }
  if (
    (state.stage_failed === null && state.consecutive_failures !== 0) ||
    (state.stage_failed !== null && state.consecutive_failures < 1)
  ) {
    throw new Error(`${path}: consecutive_failures does not match stage_failed`);
  }
  return state;
}

export function loadGradePipelineStates(
  projectOption?: string,
  rootDir = specdojoRootDir(),
): Map<string, GradePipelineState> {
  const states = new Map<string, GradePipelineState>();
  const projectId = resolveProject(projectOption).id;
  for (const path of listFilesRecursive(gradePipelineStateDirectory(projectOption, rootDir))) {
    if (!path.endsWith(".json")) continue;
    const state = parseGradePipelineState(
      JSON.parse(readFileSync(path, "utf8")),
      relativePathFromRoot(path, rootDir),
    );
    if (state.project_id !== projectId) {
      throw new Error(`${relativePathFromRoot(path, rootDir)}: project_id must be ${projectId}`);
    }
    states.set(state.document, state);
  }
  return states;
}

export function currentGradePipelineState(
  document: MarkdownDocument,
  path: string,
  state: GradePipelineState | undefined,
  target?: GradeTarget,
): GradePipelineState | undefined {
  if (!state || state.document !== path || (target !== undefined && state.target !== target)) {
    return undefined;
  }
  return state.content_hash === pipelineContentHash(document) ? state : undefined;
}

export function isIncompleteGradePipelineState(state: GradePipelineState | undefined): boolean {
  return state !== undefined && state.consecutive_failures < state.max_failures;
}

export function readGradePipelineState(opts: {
  target: GradeTarget;
  project?: string;
  path: string;
}): GradePipelineState | undefined {
  const absolute = resolveSafeMarkdownPath(opts.path);
  const relativeDocument = repoRelativePath(absolute);
  const statePath = gradePipelineStatePath(relativeDocument, opts.project);
  if (!existsSync(statePath)) return undefined;
  const state = parseGradePipelineState(
    JSON.parse(readFileSync(statePath, "utf8")),
    repoRelativePath(statePath),
  );
  const projectId = resolveProject(opts.project).id;
  if (state.project_id !== projectId) {
    throw new Error(`${repoRelativePath(statePath)}: project_id must be ${projectId}`);
  }
  const document = parseMarkdown(readFileSync(absolute, "utf8"), relativeDocument);
  return currentGradePipelineState(document, relativeDocument, state, opts.target);
}

export function listExhaustedGradePipelineStates(opts: {
  target: GradeTarget;
  project?: string;
}): GradePipelineState[] {
  const states = loadGradePipelineStates(opts.project);
  return [...states.values()]
    .filter((state) => {
      if (state.target !== opts.target || state.consecutive_failures < state.max_failures)
        return false;
      const absolute = resolve(specdojoRootDir(), state.document);
      if (!existsSync(absolute)) return false;
      const document = parseMarkdown(readFileSync(absolute, "utf8"), state.document);
      return currentGradePipelineState(document, state.document, state, opts.target) !== undefined;
    })
    .sort((left, right) => left.document.localeCompare(right.document));
}

export function recordGradePipelineStage(opts: {
  target: GradeTarget;
  project?: string;
  path: string;
  runId: string;
  stage: number;
  stageTotal: number;
  maxFailures: number;
  status: "passed" | "failed" | "complete";
  now?: Date;
}): GradePipelineState | undefined {
  const absolute = resolveSafeMarkdownPath(opts.path);
  const relativeDocument = repoRelativePath(absolute);
  const statePath = gradePipelineStatePath(relativeDocument, opts.project);
  if (opts.status === "complete") {
    if (existsSync(statePath)) unlinkSync(statePath);
    return undefined;
  }
  if (
    !Number.isSafeInteger(opts.stage) ||
    opts.stage < 1 ||
    !Number.isSafeInteger(opts.stageTotal) ||
    opts.stageTotal < opts.stage ||
    !Number.isSafeInteger(opts.maxFailures) ||
    opts.maxFailures < 1
  ) {
    throw new Error("grade pipeline stage, total, and failure limit are invalid");
  }
  const document = parseMarkdown(readFileSync(absolute, "utf8"), relativeDocument);
  const previous = readGradePipelineState({
    target: opts.target,
    project: opts.project,
    path: relativeDocument,
  });
  const previousCompleted = previous?.stage_completed ?? 0;
  if (opts.stage !== previousCompleted + 1) {
    throw new Error(
      `grade pipeline stage ${opts.stage} must immediately follow completed stage ${previousCompleted}`,
    );
  }
  const stageCompleted =
    opts.status === "passed" ? opts.stage : Math.min(previousCompleted, opts.stage - 1);
  if (stageCompleted >= opts.stageTotal) {
    if (existsSync(statePath)) unlinkSync(statePath);
    return undefined;
  }
  const state: GradePipelineState = {
    version: 1,
    project_id: resolveProject(opts.project).id,
    target: opts.target,
    document: relativeDocument,
    content_hash: pipelineContentHash(document),
    stage_completed: stageCompleted,
    stage_failed: opts.status === "failed" ? opts.stage : null,
    stage_total: opts.stageTotal,
    consecutive_failures:
      opts.status === "failed"
        ? previous?.stage_failed === opts.stage
          ? previous.consecutive_failures + 1
          : 1
        : 0,
    max_failures: opts.maxFailures,
    last_run_id: opts.runId,
    updated_at: (opts.now ?? new Date()).toISOString(),
  };
  mkdirSync(dirname(statePath), { recursive: true });
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
  return state;
}
