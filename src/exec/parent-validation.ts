import { spawn } from "node:child_process";
import { join } from "node:path";
import { performance } from "node:perf_hooks";
import { StringDecoder } from "node:string_decoder";
import {
  recordValidationGateWait,
  validationMetric,
  ValidationTestFiles,
} from "./validation-metrics.js";
import { gitEnvironment } from "./worktree.js";
import {
  hasValidationProcessTreeSurvivors,
  signalValidationProcessTree,
  trackValidationProcessGroup,
  VALIDATION_CLOSE_GRACE_MS,
  VALIDATION_KILL_GRACE_MS,
  VALIDATION_USES_PROCESS_GROUP,
} from "./validation-process-group.js";
import { acquirePoolSlot, getActiveExecLocksDir, releaseLock } from "./slot-lock.js";
import type { EvidenceValidation, ExecEvidence } from "./evidence.js";
import { MAX_CHANGE_FILES, redactSensitiveText } from "./evidence.js";
import type { RelatedTestKind, RelatedTestSelection } from "./related-tests.js";
import { buildTestDependencyGraph, selectRelatedTests } from "./related-tests.js";
import { PROJECT_REPO_WORKTREE_DIRNAME, REPO_NAME_PATTERN } from "../shared/specdojo-config.js";

export const MAX_PARENT_VALIDATION_STREAM_BYTES = 1024 * 1024;
const MAX_SUMMARY_LENGTH = 1_000;
const CAPTURE_MARKER_RESERVE_BYTES = 256;
/** Upper bound of the selected and omitted test files recorded in one validation. */
export const MAX_RECORDED_TEST_FILES = 500;

export type ParentValidationId =
  | "validate-schema"
  | "typecheck"
  | "test-unit"
  | "test-integration"
  | "lint-ts"
  | "lint-fm"
  | "lint-md"
  | "lint-fm-changed"
  | "lint-md-changed"
  | "test-docs"
  | "lint-mermaid"
  | "lint-d2"
  | "build"
  | "format-check";

export type ParentValidationDefinition = {
  id: ParentValidationId;
  command: string;
  args: readonly string[];
  displayCommand: string;
  timeoutMs: number;
};

export type ParentValidationProcessResult = {
  exitCode: number | null;
  stdout: string;
  stderr: string;
  error?: string;
  timedOut?: boolean;
  stdoutTruncated?: boolean;
  stderrTruncated?: boolean;
};

export type ParentValidationFailureOutput = ParentValidationProcessResult & {
  // `yaml-pages` は親の検証の前の表示のページの作り直しの失敗を表す（PJR-TF6F）。
  id: ParentValidationId | "yaml-pages";
  repo?: string;
  label: string;
};

export type ParentValidationBatchResult = {
  validations: EvidenceValidation[];
  failureOutputs: ParentValidationFailureOutput[];
};

export type ParentValidationInvoker = (
  definition: ParentValidationDefinition,
  cwd: string,
) => Promise<ParentValidationProcessResult>;

const PARENT_VALIDATION_REGISTRY: Record<ParentValidationId, ParentValidationDefinition> = {
  "validate-schema": {
    id: "validate-schema",
    command: process.platform === "win32" ? "npm.cmd" : "npm",
    args: ["run", "validate:schema"],
    displayCommand: "npm run validate:schema",
    timeoutMs: 10 * 60 * 1_000,
  },
  typecheck: {
    id: "typecheck",
    command: process.platform === "win32" ? "npm.cmd" : "npm",
    args: ["run", "typecheck"],
    displayCommand: "npm run typecheck",
    timeoutMs: 10 * 60 * 1_000,
  },
  "test-unit": {
    id: "test-unit",
    command: process.platform === "win32" ? "npm.cmd" : "npm",
    args: ["run", "test:unit"],
    displayCommand: "npm run test:unit",
    timeoutMs: 10 * 60 * 1_000,
  },
  "test-integration": {
    id: "test-integration",
    command: process.platform === "win32" ? "npm.cmd" : "npm",
    args: ["run", "test:integration"],
    displayCommand: "npm run test:integration",
    timeoutMs: 10 * 60 * 1_000,
  },
  "lint-ts": {
    id: "lint-ts",
    command: process.platform === "win32" ? "npm.cmd" : "npm",
    args: ["run", "lint:ts"],
    displayCommand: "npm run lint:ts",
    timeoutMs: 10 * 60 * 1_000,
  },
  "lint-fm": {
    id: "lint-fm",
    command: process.platform === "win32" ? "npm.cmd" : "npm",
    args: ["run", "lint:fm"],
    displayCommand: "npm run lint:fm",
    timeoutMs: 10 * 60 * 1_000,
  },
  "lint-md": {
    id: "lint-md",
    command: process.platform === "win32" ? "npm.cmd" : "npm",
    args: ["run", "lint:md"],
    displayCommand: "npm run lint:md",
    timeoutMs: 10 * 60 * 1_000,
  },
  "lint-fm-changed": {
    id: "lint-fm-changed",
    command: process.platform === "win32" ? "npm.cmd" : "npm",
    args: ["run", "lint:fm:changed"],
    displayCommand: "npm run lint:fm:changed",
    timeoutMs: 10 * 60 * 1_000,
  },
  "lint-md-changed": {
    id: "lint-md-changed",
    command: process.platform === "win32" ? "npm.cmd" : "npm",
    args: ["run", "lint:md:changed"],
    displayCommand: "npm run lint:md:changed",
    timeoutMs: 10 * 60 * 1_000,
  },
  "test-docs": {
    id: "test-docs",
    command: process.platform === "win32" ? "npm.cmd" : "npm",
    args: ["run", "test:docs"],
    displayCommand: "npm run test:docs",
    timeoutMs: 10 * 60 * 1_000,
  },
  "lint-mermaid": {
    id: "lint-mermaid",
    command: process.platform === "win32" ? "npm.cmd" : "npm",
    args: ["run", "lint:mermaid"],
    displayCommand: "npm run lint:mermaid",
    timeoutMs: 10 * 60 * 1_000,
  },
  "lint-d2": {
    id: "lint-d2",
    command: process.platform === "win32" ? "npm.cmd" : "npm",
    args: ["run", "lint:d2"],
    displayCommand: "npm run lint:d2",
    timeoutMs: 10 * 60 * 1_000,
  },
  build: {
    id: "build",
    command: process.platform === "win32" ? "npm.cmd" : "npm",
    args: ["run", "build"],
    displayCommand: "npm run build",
    timeoutMs: 10 * 60 * 1_000,
  },
  "format-check": {
    id: "format-check",
    command: process.platform === "win32" ? "npm.cmd" : "npm",
    args: ["run", "format:check"],
    displayCommand: "npm run format:check",
    timeoutMs: 10 * 60 * 1_000,
  },
};

function truncateHead(value: string, limit: number): string {
  if (value.length <= limit) return value;
  return `${value.slice(0, Math.max(0, limit - 1))}…`;
}

function truncateMiddle(value: string, limit: number): string {
  if (value.length <= limit) return value;
  const marker = "\n… output omitted …\n";
  if (limit <= marker.length) return truncateHead(value, limit);
  const retained = limit - marker.length;
  const headLength = Math.ceil(retained / 2);
  return `${value.slice(0, headLength)}${marker}${value.slice(-Math.floor(retained / 2))}`;
}

type BoundedCapture = {
  chunks: Buffer[];
  head?: Buffer;
  tail?: Buffer;
  totalBytes: number;
};

function appendBounded(capture: BoundedCapture, chunk: Buffer): void {
  capture.totalBytes += chunk.length;
  const payloadBytes = MAX_PARENT_VALIDATION_STREAM_BYTES - CAPTURE_MARKER_RESERVE_BYTES;
  const headBytes = Math.ceil(payloadBytes / 2);
  const tailBytes = Math.floor(payloadBytes / 2);
  if (!capture.head && capture.totalBytes <= MAX_PARENT_VALIDATION_STREAM_BYTES) {
    capture.chunks.push(chunk);
    return;
  }
  if (!capture.head) {
    const buffered = Buffer.concat([...capture.chunks, chunk]);
    capture.chunks = [];
    capture.head = buffered.subarray(0, headBytes);
    capture.tail = buffered.subarray(-tailBytes);
    return;
  }
  const tail = Buffer.concat([capture.tail ?? Buffer.alloc(0), chunk]);
  capture.tail = tail.subarray(Math.max(0, tail.length - tailBytes));
}

function completeUtf8Prefix(buffer: Buffer): Buffer {
  if (buffer.length === 0) return buffer;
  let start = buffer.length - 1;
  while (start > 0 && (buffer[start] & 0xc0) === 0x80) start--;
  const lead = buffer[start];
  const expectedBytes =
    (lead & 0x80) === 0 ? 1 : (lead & 0xe0) === 0xc0 ? 2 : (lead & 0xf0) === 0xe0 ? 3 : 4;
  return buffer.length - start < expectedBytes ? buffer.subarray(0, start) : buffer;
}

function capturedOutput(capture: BoundedCapture): { output: string; truncated: boolean } {
  if (!capture.head) {
    return { output: Buffer.concat(capture.chunks).toString("utf8"), truncated: false };
  }
  const omitted = Math.max(
    0,
    capture.totalBytes - capture.head.length - (capture.tail?.length ?? 0),
  );
  const marker = Buffer.from(`\n… ${omitted} bytes omitted …\n`, "utf8");
  const head = completeUtf8Prefix(capture.head);
  const tail = capture.tail ?? Buffer.alloc(0);
  let tailStart = 0;
  while (tailStart < tail.length && (tail[tailStart] & 0xc0) === 0x80) tailStart++;
  return {
    output: Buffer.concat([head, marker, tail.subarray(tailStart)]).toString("utf8"),
    truncated: true,
  };
}

// PJR-V96B: `pipeline.parent_validations` の要素は ID の文字列か `{ id, repo }`。文字列は
// プロジェクトリポジトリ（`project`）で実行する。ID が同じなら、どのリポジトリでも同じ固定 argv
// を実行する（リポジトリ別の command 指定は受け付けない）。
export const PARENT_VALIDATION_PROJECT_REPO = PROJECT_REPO_WORKTREE_DIRNAME;

/** One element of `pipeline.parent_validations` in exec-defaults. */
export type ParentValidationEntry =
  | string
  | { id: string; repo?: string; paths?: readonly string[]; parallel?: boolean; related?: boolean };

export type ParentValidationAssignment = {
  definition: ParentValidationDefinition;
  /** Repository name: `project` or a product repository declared in `projects.<id>.repos`. */
  repo: string;
  /** `<id>` for the project repository, `<repo>:<id>` for a product repository. */
  label: string;
  /**
   * PJR-T01P: repository-relative glob patterns that select this validation by change type.
   * Absent means the validation always runs.
   */
  paths?: readonly string[];
  /** PJR-50RQ: validation may run alongside adjacent `parallel` validations (light lint). */
  parallel?: boolean;
  /** PJR-9X52: run only the test files related to the changed files (vitest validations). */
  related?: boolean;
};

/** Validations whose vitest run can be narrowed to the related test files, by test kind. */
export const RELATED_TEST_VALIDATIONS: Partial<Record<ParentValidationId, RelatedTestKind>> = {
  "test-unit": "unit",
  "test-integration": "integration",
};

/**
 * Changed files that select the validations declared with `paths`. An absent `changedPaths`
 * means the change set is unknown (or truncated), in which case every validation runs.
 */
export type ParentValidationSelection = {
  changedPaths?: readonly string[];
};

/** Worktree roots the parent validations may run in (project worktree and product worktrees). */
export type ParentValidationRoots = {
  project: string;
  repos?: Readonly<Record<string, string>>;
};

export function parentValidationRoots(
  projectPath: string,
  productWorktrees?: readonly { name: string; path: string }[],
): ParentValidationRoots {
  if (!productWorktrees || productWorktrees.length === 0) return { project: projectPath };
  return {
    project: projectPath,
    repos: Object.fromEntries(productWorktrees.map((product) => [product.name, product.path])),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assignmentLabel(id: string, repo: string): string {
  return repo === PARENT_VALIDATION_PROJECT_REPO ? id : `${repo}:${id}`;
}

type ParsedEntry = {
  id: string;
  repo: string;
  paths?: readonly string[];
  parallel?: boolean;
  related?: boolean;
};

function parsePaths(value: unknown, where: string): readonly string[] | undefined {
  if (value === undefined) return undefined;
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    !value.every((pattern) => typeof pattern === "string" && pattern.trim().length > 0)
  ) {
    throw new Error(`${where}.paths must be a non-empty array of non-empty glob strings`);
  }
  return value.map((pattern: string) => pattern.trim());
}

function parseEntry(entry: unknown, index: number): ParsedEntry {
  const where = `pipeline.parent_validations[${index}] in exec-defaults`;
  if (typeof entry === "string") return { id: entry, repo: PARENT_VALIDATION_PROJECT_REPO };
  if (!isRecord(entry)) {
    throw new Error(
      `${where} must be a validation id or { id, repo?, paths? }: ${JSON.stringify(entry)}`,
    );
  }
  const unknownKeys = Object.keys(entry)
    .filter((key) => !["id", "repo", "paths", "parallel", "related"].includes(key))
    .sort();
  if (unknownKeys.length > 0) {
    throw new Error(`${where}: unknown key(s) ${unknownKeys.map((key) => `"${key}"`).join(", ")}`);
  }
  if (typeof entry.id !== "string" || entry.id.length === 0) {
    throw new Error(`${where}.id must be a non-empty string`);
  }
  const paths = parsePaths(entry.paths, where);
  if (entry.parallel !== undefined && typeof entry.parallel !== "boolean") {
    throw new Error(`${where}.parallel must be a boolean`);
  }
  if (entry.related !== undefined && typeof entry.related !== "boolean") {
    throw new Error(`${where}.related must be a boolean`);
  }
  if (entry.related === true && !Object.hasOwn(RELATED_TEST_VALIDATIONS, entry.id)) {
    throw new Error(
      `${where}.related is supported only for ${Object.keys(RELATED_TEST_VALIDATIONS).join(", ")} (got ${entry.id})`,
    );
  }
  if (
    entry.repo === undefined &&
    paths === undefined &&
    entry.parallel === undefined &&
    entry.related === undefined
  ) {
    throw new Error(`${where} must set repo, paths, parallel or related when written as an object`);
  }
  const repo = entry.repo ?? PARENT_VALIDATION_PROJECT_REPO;
  if (typeof repo !== "string" || !REPO_NAME_PATTERN.test(repo)) {
    throw new Error(
      `${where}.repo must match ${String(REPO_NAME_PATTERN)} (got ${JSON.stringify(entry.repo)})`,
    );
  }
  return {
    id: entry.id,
    repo,
    ...(paths ? { paths } : {}),
    ...(entry.parallel === true ? { parallel: true } : {}),
    ...(entry.related === true ? { related: true } : {}),
  };
}

export function resolveParentValidationAssignments(
  entries: readonly unknown[] | undefined,
): ParentValidationAssignment[] {
  if (!entries) return [];
  const seen = new Set<string>();
  return entries.map((entry, index) => {
    const { id, repo, paths, parallel, related } = parseEntry(entry, index);
    const label = assignmentLabel(id, repo);
    if (seen.has(label)) {
      throw new Error(`Duplicate parent validation id in exec-defaults: ${label}`);
    }
    seen.add(label);
    const definition = Object.hasOwn(PARENT_VALIDATION_REGISTRY, id)
      ? PARENT_VALIDATION_REGISTRY[id as ParentValidationId]
      : undefined;
    if (!definition) {
      throw new Error(
        `Unknown parent validation id in exec-defaults: ${id} (allowed: ${Object.keys(PARENT_VALIDATION_REGISTRY).join(", ")})`,
      );
    }
    return {
      definition,
      repo,
      label,
      ...(paths ? { paths } : {}),
      ...(parallel ? { parallel } : {}),
      ...(related ? { related } : {}),
    };
  });
}

function escapeRegExp(value: string): string {
  return value.replace(/[.+^${}()|[\]\\]/g, "\\$&");
}

// lefthook の glob と同じ書き方のうち、`**`・`*`・`?`・入れ子のない `{a,b}` だけを扱う。
function globSource(pattern: string): string {
  let source = "";
  for (let index = 0; index < pattern.length; index++) {
    const char = pattern[index];
    if (char === "*" && pattern[index + 1] === "*") {
      const followedBySlash = pattern[index + 2] === "/";
      source += followedBySlash ? "(?:.*/)?" : ".*";
      index += followedBySlash ? 2 : 1;
    } else if (char === "*") {
      source += "[^/]*";
    } else if (char === "?") {
      source += "[^/]";
    } else if (char === "{" && pattern.indexOf("}", index) > index) {
      const end = pattern.indexOf("}", index);
      const alternatives = pattern
        .slice(index + 1, end)
        .split(",")
        .map(globSource);
      source += `(?:${alternatives.join("|")})`;
      index = end;
    } else {
      source += escapeRegExp(char);
    }
  }
  return source;
}

export function matchesParentValidationPaths(path: string, patterns: readonly string[]): boolean {
  return patterns.some((pattern) => new RegExp(`^${globSource(pattern)}$`).test(path));
}

// evidence の変更一覧は、プロジェクトの変更を相対パス、プロダクトの変更を `<repo>:<path>`、
// 名前の変更を `old -> new` で記録する。割り当てたリポジトリの相対パスへ戻して照合する。
function changedPathsForRepo(
  changedPaths: readonly string[],
  repo: string,
  productRepos: readonly string[],
): string[] {
  const sides = changedPaths.flatMap((path) => path.split(" -> "));
  if (repo !== PARENT_VALIDATION_PROJECT_REPO) {
    const prefix = `${repo}:`;
    return sides.filter((path) => path.startsWith(prefix)).map((path) => path.slice(prefix.length));
  }
  return sides.filter((path) => !productRepos.some((name) => path.startsWith(`${name}:`)));
}

/**
 * Selection from the executor's recorded changes. A truncated change list (the evidence keeps at
 * most MAX_CHANGE_FILES entries) is treated as unknown so no validation is skipped.
 */
export function parentValidationSelectionForEvidence(
  evidence: Pick<ExecEvidence, "changes">,
): ParentValidationSelection {
  if (evidence.changes.length >= MAX_CHANGE_FILES) return {};
  return { changedPaths: evidence.changes.map((change) => change.path) };
}

/**
 * Whether a validation declared with `paths` is skipped for the given change set. Validations
 * without `paths` always run, and so does every validation when the change set is unknown.
 */
export function isParentValidationSkipped(
  assignment: ParentValidationAssignment,
  selection: ParentValidationSelection | undefined,
  productRepos: readonly string[] = [],
): boolean {
  const patterns = assignment.paths;
  const changedPaths = selection?.changedPaths;
  if (!patterns || changedPaths === undefined) return false;
  return !changedPathsForRepo(changedPaths, assignment.repo, productRepos).some((path) =>
    matchesParentValidationPaths(path, patterns),
  );
}

/**
 * PJR-9X52: the test files a `related` validation runs for the change set. Returns undefined for
 * validations without `related`. A change set that is unknown, or a dependency graph that cannot
 * be read, selects the full run.
 */
export async function relatedTestSelectionFor(
  assignment: ParentValidationAssignment,
  root: string,
  selection: ParentValidationSelection | undefined,
  productRepos: readonly string[] = [],
): Promise<RelatedTestSelection | undefined> {
  const kind = RELATED_TEST_VALIDATIONS[assignment.definition.id];
  if (!assignment.related || !kind) return undefined;
  const changedPaths = selection?.changedPaths;
  if (changedPaths === undefined)
    return { mode: "full", reason: "change set is unknown or truncated" };
  try {
    const graph = await buildTestDependencyGraph(root, kind);
    return selectRelatedTests(
      graph,
      changedPathsForRepo(changedPaths, assignment.repo, productRepos),
    );
  } catch (error) {
    return {
      mode: "full",
      reason: `related test selection failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/** The fixed argv with the selected test files appended after `--` for a related selection. */
export function definitionForTestSelection(
  definition: ParentValidationDefinition,
  testSelection: RelatedTestSelection | undefined,
): ParentValidationDefinition {
  if (testSelection?.mode !== "related") return definition;
  return { ...definition, args: [...definition.args, "--", ...testSelection.selected] };
}

function evidenceTestSelection(
  testSelection: RelatedTestSelection,
): NonNullable<EvidenceValidation["test_selection"]> {
  const reason = truncateHead(testSelection.reason, MAX_SUMMARY_LENGTH);
  if (testSelection.mode === "full") return { mode: "full", reason };
  return {
    mode: "related",
    reason,
    selected_tests: testSelection.selected.slice(0, MAX_RECORDED_TEST_FILES),
    omitted_tests: testSelection.omitted.slice(0, MAX_RECORDED_TEST_FILES),
  };
}

function testSelectionSummaryPrefix(testSelection: RelatedTestSelection | undefined): string {
  if (!testSelection) return "";
  return testSelection.mode === "related"
    ? `related tests only (${testSelection.reason}): `
    : `full run (${testSelection.reason}): `;
}

export function resolveParentValidationDefinitions(
  entries: readonly unknown[] | undefined,
): ParentValidationDefinition[] {
  return resolveParentValidationAssignments(entries).map((assignment) => assignment.definition);
}

/** Labels (`<id>` or `<repo>:<id>`) of the configured parent validations, in order. */
export function parentValidationLabels(entries: readonly unknown[] | undefined): string[] {
  return resolveParentValidationAssignments(entries).map((assignment) => assignment.label);
}

/** Display command with the repository for product assignments (`npm run test:unit (in app1)`). */
export function parentValidationDisplayCommands(entries: readonly unknown[] | undefined): string[] {
  return resolveParentValidationAssignments(entries).map((assignment) =>
    assignment.repo === PARENT_VALIDATION_PROJECT_REPO
      ? assignment.definition.displayCommand
      : `${assignment.definition.displayCommand} (in ${assignment.repo})`,
  );
}

export type ParentValidationStopOptions = {
  /** Wait after SIGTERM before SIGKILL to the process tree. */
  killGraceMs?: number;
  /** Wait after SIGKILL for the output pipes to close. */
  closeGraceMs?: number;
};

/**
 * Spawn one parent validation. On timeout the runner stops the whole process tree (SIGTERM, then
 * SIGKILL after a grace period) and, if a descendant outside the group still holds the output
 * pipes, returns without waiting for them so the batch moves on (PJR-V277). Runs that finish
 * before the timeout settle on `close` exactly as before.
 */
export async function invokeParentValidation(
  definition: ParentValidationDefinition,
  cwd: string,
  options: ParentValidationStopOptions = {},
): Promise<ParentValidationProcessResult> {
  const killGraceMs = options.killGraceMs ?? VALIDATION_KILL_GRACE_MS;
  const closeGraceMs = options.closeGraceMs ?? VALIDATION_CLOSE_GRACE_MS;
  return await new Promise((resolve) => {
    const stdoutCapture: BoundedCapture = { chunks: [], totalBytes: 0 };
    const stderrCapture: BoundedCapture = { chunks: [], totalBytes: 0 };
    let settled = false;
    let timedOut = false;
    let timeoutStartedAt = 0;
    let survivorsAfterTerm: boolean | undefined;
    let killSent = false;
    let killTimer: NodeJS.Timeout | undefined;
    let closeTimer: NodeJS.Timeout | undefined;
    const testFiles = new ValidationTestFiles();
    const stdoutDecoder = new StringDecoder("utf8");
    const child = spawn(definition.command, [...definition.args], {
      cwd,
      env: { ...gitEnvironment(), SPECDOJO_PARENT_VALIDATION_METRICS: "1" },
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
      detached: VALIDATION_USES_PROCESS_GROUP,
    });
    const untrack = trackValidationProcessGroup(child);
    child.stdout.on("data", (chunk: Buffer) => {
      appendBounded(stdoutCapture, chunk);
      testFiles.observe(stdoutDecoder.write(chunk));
    });
    child.stderr.on("data", (chunk: Buffer) => {
      appendBounded(stderrCapture, chunk);
    });
    const forceKill = (): void => {
      survivorsAfterTerm = hasValidationProcessTreeSurvivors(child) || child.exitCode === null;
      killSent = signalValidationProcessTree(child, "SIGKILL") || killSent;
    };
    const settle = (exitCode: number | null, pipesClosed: boolean): void => {
      const stdout = capturedOutput(stdoutCapture);
      const stderr = capturedOutput(stderrCapture);
      finish(
        {
          exitCode,
          stdout: stdout.output,
          stderr: stderr.output,
          timedOut,
          stdoutTruncated: stdout.truncated,
          stderrTruncated: stderr.truncated,
        },
        pipesClosed,
      );
    };
    const timer = setTimeout(() => {
      timedOut = true;
      timeoutStartedAt = performance.now();
      validationMetric("validation-timeout", {
        id: definition.id,
        cwd,
        timeout_ms: definition.timeoutMs,
        ...testFiles.snapshot(),
      });
      signalValidationProcessTree(child, "SIGTERM");
      killTimer = setTimeout(() => {
        forceKill();
        closeTimer = setTimeout(() => {
          // group の外へ出た子孫が pipe を持ち続けても、close を待たずに時間切れとして返す。
          child.stdout.destroy();
          child.stderr.destroy();
          settle(child.exitCode, false);
        }, closeGraceMs);
      }, killGraceMs);
    }, definition.timeoutMs);
    const recordStop = (pipesClosed: boolean): void => {
      if (!timedOut) return;
      // 猶予の前に close した場合も、group に残った子孫は pipe を持たなくても止めておく。
      if (survivorsAfterTerm === undefined && hasValidationProcessTreeSurvivors(child)) forceKill();
      validationMetric("validation-timeout-stop", {
        id: definition.id,
        cwd,
        process_group: VALIDATION_USES_PROCESS_GROUP && child.pid !== undefined,
        survivors_after_term: survivorsAfterTerm === true,
        kill_sent: killSent,
        pipes_closed: pipesClosed,
        stop_ms: performance.now() - timeoutStartedAt,
      });
    };
    const finish = (result: ParentValidationProcessResult, pipesClosed = true): void => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      clearTimeout(killTimer);
      clearTimeout(closeTimer);
      recordStop(pipesClosed);
      untrack();
      resolve(result);
    };
    child.on("error", (error) => {
      const stdout = capturedOutput(stdoutCapture);
      const stderr = capturedOutput(stderrCapture);
      finish({
        exitCode: null,
        stdout: stdout.output,
        stderr: stderr.output,
        error: error.message,
        timedOut,
        stdoutTruncated: stdout.truncated,
        stderrTruncated: stderr.truncated,
      });
    });
    child.on("close", (exitCode) => settle(exitCode, true));
  });
}

function validationSummary(result: ParentValidationProcessResult): string {
  const output = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
  const prefix = result.timedOut
    ? "timed out"
    : result.error
      ? `spawn failed: ${result.error}`
      : `exit ${result.exitCode ?? "unknown"}`;
  return truncateMiddle(
    redactSensitiveText(output ? `${prefix}: ${output}` : prefix),
    MAX_SUMMARY_LENGTH,
  );
}

/**
 * Run the configured parent validations in order. Each validation runs with the worktree of its
 * assigned repository as cwd, whether or not that repository changed (to detect breakage of the
 * integration target). A validation assigned to a repository without a worktree in `cwd` fails
 * without spawning anything. Results carry `repo` when the run spans product repositories or the
 * assignment names one, so single-repository evidence keeps its previous shape.
 */
export async function runParentValidationBatch(
  entries: readonly unknown[] | undefined,
  cwd: string | ParentValidationRoots,
  invoke: ParentValidationInvoker = invokeParentValidation,
  selection?: ParentValidationSelection,
): Promise<ParentValidationBatchResult> {
  const assignments = resolveParentValidationAssignments(entries);
  const roots = typeof cwd === "string" ? { project: cwd } : cwd;
  const recordsRepo =
    Object.keys(roots.repos ?? {}).length > 0 ||
    assignments.some((assignment) => assignment.repo !== PARENT_VALIDATION_PROJECT_REPO);
  const validations: EvidenceValidation[] = [];
  const failureOutputs: ParentValidationFailureOutput[] = [];
  const productRepos = Object.keys(roots.repos ?? {});
  const runOne = async (
    assignment: ParentValidationAssignment,
  ): Promise<{ validation: EvidenceValidation; failure?: ParentValidationFailureOutput }> => {
    const { definition, repo } = assignment;
    const repoField = recordsRepo ? { repo } : {};
    if (isParentValidationSkipped(assignment, selection, productRepos)) {
      // 変更の種類に合わない検証は流さず、記録だけを残す（PJR-T01P）。ラベルの並びを保つため、
      // 再開時の hasRecordedParentValidations は流し直しを要求しない。
      const reason = truncateHead(
        `skipped by change type: no changed file matches paths (${(assignment.paths ?? []).join(", ")})`,
        MAX_SUMMARY_LENGTH,
      );
      validationMetric("validation-skipped", { id: definition.id, repo, reason });
      return {
        validation: {
          id: definition.id,
          source: "runner",
          ...repoField,
          command: definition.displayCommand,
          status: "not_applicable",
          summary: reason,
          reason,
        },
      };
    }
    const root =
      repo === PARENT_VALIDATION_PROJECT_REPO
        ? roots.project
        : Object.hasOwn(roots.repos ?? {}, repo)
          ? roots.repos?.[repo]
          : undefined;
    if (!root) {
      return {
        validation: {
          id: definition.id,
          source: "runner",
          ...repoField,
          command: definition.displayCommand,
          status: "failed",
          summary: truncateHead(
            `repository "${repo}" has no worktree for this task; declare it in projects.<project-id>.repos ` +
              `or assign ${definition.id} to another repository in pipeline.parent_validations`,
            MAX_SUMMARY_LENGTH,
          ),
        },
      };
    }
    const testSelection = await relatedTestSelectionFor(assignment, root, selection, productRepos);
    if (testSelection) {
      validationMetric("validation-test-selection", {
        id: definition.id,
        repo,
        mode: testSelection.mode,
        reason: testSelection.reason,
        ...(testSelection.mode === "related"
          ? { selected: testSelection.selected.length, omitted: testSelection.omitted.length }
          : {}),
      });
    }
    const startedAt = new Date().toISOString();
    const started = performance.now();
    validationMetric("validation-start", {
      id: definition.id,
      repo,
      started_at: startedAt,
      timeout_ms: definition.timeoutMs,
    });
    let result: ParentValidationProcessResult;
    try {
      result = await invoke(definitionForTestSelection(definition, testSelection), root);
    } catch (error) {
      validationMetric("validation-end", {
        id: definition.id,
        repo,
        started_at: startedAt,
        duration_ms: performance.now() - started,
        error: String(error),
      });
      throw error;
    }
    const passed = result.exitCode === 0 && !result.error && !result.timedOut;
    validationMetric("validation-end", {
      id: definition.id,
      repo,
      started_at: startedAt,
      duration_ms: performance.now() - started,
      exit_code: result.exitCode,
      timed_out: result.timedOut === true,
      status: passed ? "passed" : "failed",
    });
    const validation: EvidenceValidation = {
      id: definition.id,
      source: "runner",
      ...repoField,
      command: definition.displayCommand,
      status: passed ? "passed" : "failed",
      summary: truncateHead(
        `${testSelectionSummaryPrefix(testSelection)}${validationSummary(result)}`,
        MAX_SUMMARY_LENGTH,
      ),
      ...(testSelection ? { test_selection: evidenceTestSelection(testSelection) } : {}),
    };
    if (passed) return { validation };
    return {
      validation,
      failure: {
        ...result,
        id: definition.id,
        ...(recordsRepo ? { repo } : {}),
        label: assignmentLabel(definition.id, repo),
      },
    };
  };
  // PJR-50RQ: `parallel` が続く検証は同時に流し、それ以外は 1 本ずつ流す。結果は設定の並びで記録する。
  for (let start = 0; start < assignments.length;) {
    let end = start + 1;
    if (assignments[start].parallel) {
      while (end < assignments.length && assignments[end].parallel) end++;
    }
    const settled = await Promise.all(assignments.slice(start, end).map(runOne));
    for (const { validation, failure } of settled) {
      validations.push(validation);
      if (failure) failureOutputs.push(failure);
    }
    start = end;
  }
  return { validations, failureOutputs };
}

export async function runParentValidations(
  entries: readonly unknown[] | undefined,
  cwd: string | ParentValidationRoots,
  invoke: ParentValidationInvoker = invokeParentValidation,
  selection?: ParentValidationSelection,
): Promise<EvidenceValidation[]> {
  return (await runParentValidationBatch(entries, cwd, invoke, selection)).validations;
}

/** `<id>` or `<repo>:<id>` of a recorded runner validation (no `repo` means the project). */
export function recordedParentValidationLabel(validation: EvidenceValidation): string {
  const id = validation.id ?? validation.command;
  return assignmentLabel(id, validation.repo ?? PARENT_VALIDATION_PROJECT_REPO);
}

// 並列の worktree 実行で親検証（vitest など複数 worker を起動するコマンド）が重なると、
// コンテナの負荷で成果物と無関係なタイムアウトが起きる。既定では 1 つの exec run 内の
// 親検証を直列化し、executor / reporter の並列性は維持する。
export const DEFAULT_PARENT_VALIDATION_CONCURRENCY = 1;

export function resolveParentValidationConcurrency(value: unknown): number {
  if (value === undefined) return DEFAULT_PARENT_VALIDATION_CONCURRENCY;
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    throw new Error(
      `pipeline.parent_validation_concurrency in exec-defaults must be a positive integer: ${String(value)}`,
    );
  }
  return value;
}

type ParentValidationWaiter = { label: string; resolve: () => void };

export function parentValidationPoolPath(lockRoot: string): string {
  return join(lockRoot, "parent-validation");
}

/**
 * Limits how many parent-validation batches run at once within one `exec run` process.
 * Waiters are served in arrival order and each waiting item is logged with the validations it
 * is waiting to run.
 *
 * When `lockRoot` is given, the same limit also holds across the `exec run` processes that share
 * the project's lock directory (a primary run and its `--join` runs): after the in-process slot,
 * the batch takes one of the slot locks under `<lockRoot>/parent-validation/`.
 */
export class ParentValidationGate {
  private readonly active: string[] = [];
  private readonly waiters: ParentValidationWaiter[] = [];

  constructor(
    readonly limit: number,
    private readonly log: (line: string) => void = (line) => {
      process.stdout.write(line);
    },
    readonly lockRoot?: string,
  ) {}

  async run<T>(label: string, ids: readonly string[], task: () => Promise<T>): Promise<T> {
    const queued = performance.now();
    validationMetric("gate-queued", {
      ids,
      running: [...this.active],
      queued: this.waiters.length,
    });
    await this.acquire(label, ids);
    const localWaitMs = performance.now() - queued;
    try {
      if (!this.lockRoot) {
        recordValidationGateWait(queued, localWaitMs);
        return await task();
      }
      const slot = await acquirePoolSlot(
        parentValidationPoolPath(this.lockRoot),
        this.limit,
        { actor: "parent-validation", label },
        {
          onWait: () =>
            this.log(
              `  Waiting for parent validation slot held by another exec run: ${label} (${ids.join(", ")})\n`,
            ),
        },
      );
      try {
        recordValidationGateWait(queued, localWaitMs);
        return await task();
      } finally {
        releaseLock(slot);
      }
    } finally {
      this.release(label);
    }
  }

  private async acquire(label: string, ids: readonly string[]): Promise<void> {
    if (this.active.length < this.limit) {
      this.active.push(label);
      return;
    }
    this.log(
      `  Waiting for parent validation slot: ${label} (${ids.join(", ")}); running: ${this.active.join(", ")}\n`,
    );
    await new Promise<void>((resolve) => {
      this.waiters.push({ label, resolve });
    });
    this.log(`  Parent validation slot acquired: ${label}\n`);
  }

  private release(label: string): void {
    const index = this.active.indexOf(label);
    if (index >= 0) this.active.splice(index, 1);
    const next = this.waiters.shift();
    if (!next) return;
    // Hand the freed slot directly to the oldest waiter so later arrivals cannot overtake it.
    this.active.push(next.label);
    next.resolve();
  }
}

// exec-defaults は 1 回の exec run につき 1 度だけ読み込まれ、その run の全項目・全 stage で
// 同じオブジェクトが共有される。設定オブジェクトをキーにすることで、呼び出し経路へ gate を
// 引き回さずに run 全体の排他を得る。別プロセスの exec run（主 run と `--join` run）とは、
// exec-run lock を取得したプロセスが設定する project のロックディレクトリを介して枠を共有する。
const gatesByConfig = new WeakMap<object, ParentValidationGate>();

export function parentValidationGateFor(
  execDefaults: {
    pipeline?: { parent_validation_concurrency?: number };
  },
  lockRoot: string | undefined = getActiveExecLocksDir(),
): ParentValidationGate {
  const existing = gatesByConfig.get(execDefaults);
  if (existing) return existing;
  const gate = new ParentValidationGate(
    resolveParentValidationConcurrency(execDefaults.pipeline?.parent_validation_concurrency),
    undefined,
    lockRoot,
  );
  gatesByConfig.set(execDefaults, gate);
  return gate;
}

export function failedParentValidationReason(
  validations: readonly EvidenceValidation[],
): string | undefined {
  // runner の `not_applicable` は、`paths` に合う変更が無く流さなかった検証である（PJR-T01P）。
  const failed = validations.filter(
    (validation) =>
      validation.source === "runner" &&
      validation.status !== "passed" &&
      validation.status !== "not_applicable",
  );
  if (failed.length === 0) return undefined;
  return `parent validation failed: ${failed.map(recordedParentValidationLabel).join(", ")}`;
}

// PJR-Q2AT: executor が親検証をまとめて 1 行（例: `parent runner: lint-ts, lint-fm`、
// `親 runner 指定検査（lint-ts, lint-fm）`）に書いた場合に、末尾の区切り列を検証ラベルとして取り出す。
const AGGREGATE_LABEL_PATTERN = "(?:[A-Za-z0-9][A-Za-z0-9_-]*:)?[a-z][a-z0-9-]*";
const AGGREGATE_LINE_PATTERN = new RegExp(
  `^(\\S.*?)(?:[:：(（\\[]|\\s)\\s*(${AGGREGATE_LABEL_PATTERN}(?:\\s*[,、]\\s*${AGGREGATE_LABEL_PATTERN})*)\\s*[)）\\]]?\\s*$`,
  "u",
);
// コマンドそのもの（`npm run lint:md` など）をまとめた行と取り違えない。
const COMMAND_PREFIX_PATTERN = /^(?:npm|npx|pnpm|yarn|node|tsx|specdojo)(?:\s|$)/u;

function aggregatedParentValidationLabels(command: string): string[] | undefined {
  const normalized = command.trim().replace(/\s+/gu, " ");
  if (COMMAND_PREFIX_PATTERN.test(normalized)) return undefined;
  const match = AGGREGATE_LINE_PATTERN.exec(normalized);
  if (!match) return undefined;
  return match[2].split(/\s*[,、]\s*/u).filter((label) => label.length > 0);
}

/**
 * Whether an executor validation line that lists parent validation labels together
 * (e.g. `parent runner: lint-ts, lint-fm`) is covered by the runner's own results.
 * Every listed label must have a runner record (so it is configured in
 * `pipeline.parent_validations`) that passed or was skipped by change type.
 */
export function isAggregatedParentValidationSatisfied(
  command: string,
  validations: readonly EvidenceValidation[],
): boolean {
  const labels = aggregatedParentValidationLabels(command);
  if (!labels || labels.length === 0) return false;
  const runnerStatuses = new Map<string, EvidenceValidation["status"][]>();
  for (const validation of validations) {
    if (validation.source !== "runner" || typeof validation.id !== "string") continue;
    const label = recordedParentValidationLabel(validation);
    runnerStatuses.set(label, [...(runnerStatuses.get(label) ?? []), validation.status]);
  }
  return labels.every((label) => {
    const statuses = runnerStatuses.get(label);
    return (
      statuses !== undefined &&
      statuses.length > 0 &&
      statuses.every((status) => status === "passed" || status === "not_applicable")
    );
  });
}

/**
 * Replaces stale runner-owned validation results while preserving executor-owned evidence.
 * The caller must supply results produced from the fixed parent-validation allowlist.
 */
export function replaceParentValidationResults(
  evidence: ExecEvidence,
  parentValidations: readonly EvidenceValidation[],
): ExecEvidence {
  if (
    parentValidations.some(
      (validation) => validation.source !== "runner" || typeof validation.id !== "string",
    )
  ) {
    throw new Error("Refreshed parent validations must be runner-owned and include an id.");
  }
  return {
    ...evidence,
    validations: [
      ...evidence.validations.filter((validation) => validation.source !== "runner"),
      ...parentValidations,
    ],
  };
}

export function hasRecordedParentValidations(
  validations: readonly EvidenceValidation[],
  configuredEntries: readonly unknown[] | undefined,
): boolean {
  // Compare `<repo>:<id>` pairs so a changed repository assignment re-runs the validations.
  const expectedLabels = parentValidationLabels(configuredEntries);
  const recordedLabels = validations
    .filter((validation) => validation.source === "runner" && typeof validation.id === "string")
    .map(recordedParentValidationLabel);
  return (
    recordedLabels.length === expectedLabels.length &&
    expectedLabels.every((label, index) => recordedLabels[index] === label)
  );
}
