import { spawn } from "node:child_process";
import { join } from "node:path";
import { gitEnvironment } from "./exec-worktree.js";
import { acquirePoolSlot, getActiveExecLocksDir, releaseLock } from "./exec-slot-lock.js";
import type { EvidenceValidation, ExecEvidence } from "./exec-evidence.js";
import { redactSensitiveText } from "./exec-evidence.js";
import { PROJECT_REPO_WORKTREE_DIRNAME, REPO_NAME_PATTERN } from "./specdojo-config.js";

const MAX_CAPTURE_BYTES = 64 * 1024;
const MAX_SUMMARY_LENGTH = 1_000;

export type ParentValidationId =
  | "validate-schema"
  | "typecheck"
  | "test-unit"
  | "test-integration"
  | "lint-ts"
  | "lint-fm"
  | "lint-md";

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
};

function truncate(value: string, limit: number): string {
  if (value.length <= limit) return value;
  return `${value.slice(0, Math.max(0, limit - 1))}…`;
}

function appendBounded(chunks: Buffer[], chunk: Buffer, currentBytes: number): number {
  if (currentBytes >= MAX_CAPTURE_BYTES) return currentBytes;
  const remaining = MAX_CAPTURE_BYTES - currentBytes;
  chunks.push(chunk.subarray(0, remaining));
  return currentBytes + Math.min(chunk.length, remaining);
}

// PJR-V96B: `pipeline.parent_validations` の要素は ID の文字列か `{ id, repo }`。文字列は
// プロジェクトリポジトリ（`project`）で実行する。ID が同じなら、どのリポジトリでも同じ固定 argv
// を実行する（リポジトリ別の command 指定は受け付けない）。
export const PARENT_VALIDATION_PROJECT_REPO = PROJECT_REPO_WORKTREE_DIRNAME;

/** One element of `pipeline.parent_validations` in exec-defaults. */
export type ParentValidationEntry = string | { id: string; repo: string };

export type ParentValidationAssignment = {
  definition: ParentValidationDefinition;
  /** Repository name: `project` or a product repository declared in `projects.<id>.repos`. */
  repo: string;
  /** `<id>` for the project repository, `<repo>:<id>` for a product repository. */
  label: string;
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

function parseEntry(entry: unknown, index: number): { id: string; repo: string } {
  const where = `pipeline.parent_validations[${index}] in exec-defaults`;
  if (typeof entry === "string") return { id: entry, repo: PARENT_VALIDATION_PROJECT_REPO };
  if (!isRecord(entry)) {
    throw new Error(`${where} must be a validation id or { id, repo }: ${JSON.stringify(entry)}`);
  }
  const unknownKeys = Object.keys(entry)
    .filter((key) => key !== "id" && key !== "repo")
    .sort();
  if (unknownKeys.length > 0) {
    throw new Error(`${where}: unknown key(s) ${unknownKeys.map((key) => `"${key}"`).join(", ")}`);
  }
  if (typeof entry.id !== "string" || entry.id.length === 0) {
    throw new Error(`${where}.id must be a non-empty string`);
  }
  if (typeof entry.repo !== "string" || !REPO_NAME_PATTERN.test(entry.repo)) {
    throw new Error(
      `${where}.repo must match ${String(REPO_NAME_PATTERN)} (got ${JSON.stringify(entry.repo)})`,
    );
  }
  return { id: entry.id, repo: entry.repo };
}

export function resolveParentValidationAssignments(
  entries: readonly unknown[] | undefined,
): ParentValidationAssignment[] {
  if (!entries) return [];
  const seen = new Set<string>();
  return entries.map((entry, index) => {
    const { id, repo } = parseEntry(entry, index);
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
    return { definition, repo, label };
  });
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

async function invokeParentValidation(
  definition: ParentValidationDefinition,
  cwd: string,
): Promise<ParentValidationProcessResult> {
  return await new Promise((resolve) => {
    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];
    let stdoutBytes = 0;
    let stderrBytes = 0;
    let settled = false;
    let timedOut = false;
    const child = spawn(definition.command, [...definition.args], {
      cwd,
      env: gitEnvironment(),
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });
    child.stdout.on("data", (chunk: Buffer) => {
      stdoutBytes = appendBounded(stdoutChunks, chunk, stdoutBytes);
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderrBytes = appendBounded(stderrChunks, chunk, stderrBytes);
    });
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
    }, definition.timeoutMs);
    const finish = (result: ParentValidationProcessResult): void => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(result);
    };
    child.on("error", (error) => {
      finish({
        exitCode: null,
        stdout: Buffer.concat(stdoutChunks).toString("utf8"),
        stderr: Buffer.concat(stderrChunks).toString("utf8"),
        error: error.message,
        timedOut,
      });
    });
    child.on("close", (exitCode) => {
      finish({
        exitCode,
        stdout: Buffer.concat(stdoutChunks).toString("utf8"),
        stderr: Buffer.concat(stderrChunks).toString("utf8"),
        timedOut,
      });
    });
  });
}

function validationSummary(result: ParentValidationProcessResult): string {
  const output = redactSensitiveText(
    [result.stdout, result.stderr].filter(Boolean).join("\n").trim(),
  );
  const prefix = result.timedOut
    ? "timed out"
    : result.error
      ? `spawn failed: ${result.error}`
      : `exit ${result.exitCode ?? "unknown"}`;
  return truncate(output ? `${prefix}: ${output}` : prefix, MAX_SUMMARY_LENGTH);
}

/**
 * Run the configured parent validations in order. Each validation runs with the worktree of its
 * assigned repository as cwd, whether or not that repository changed (to detect breakage of the
 * integration target). A validation assigned to a repository without a worktree in `cwd` fails
 * without spawning anything. Results carry `repo` when the run spans product repositories or the
 * assignment names one, so single-repository evidence keeps its previous shape.
 */
export async function runParentValidations(
  entries: readonly unknown[] | undefined,
  cwd: string | ParentValidationRoots,
  invoke: ParentValidationInvoker = invokeParentValidation,
): Promise<EvidenceValidation[]> {
  const assignments = resolveParentValidationAssignments(entries);
  const roots = typeof cwd === "string" ? { project: cwd } : cwd;
  const recordsRepo =
    Object.keys(roots.repos ?? {}).length > 0 ||
    assignments.some((assignment) => assignment.repo !== PARENT_VALIDATION_PROJECT_REPO);
  const validations: EvidenceValidation[] = [];
  for (const { definition, repo } of assignments) {
    const repoField = recordsRepo ? { repo } : {};
    const root =
      repo === PARENT_VALIDATION_PROJECT_REPO
        ? roots.project
        : Object.hasOwn(roots.repos ?? {}, repo)
          ? roots.repos?.[repo]
          : undefined;
    if (!root) {
      validations.push({
        id: definition.id,
        source: "runner",
        ...repoField,
        command: definition.displayCommand,
        status: "failed",
        summary: truncate(
          `repository "${repo}" has no worktree for this task; declare it in projects.<project-id>.repos ` +
            `or assign ${definition.id} to another repository in pipeline.parent_validations`,
          MAX_SUMMARY_LENGTH,
        ),
      });
      continue;
    }
    const result = await invoke(definition, root);
    validations.push({
      id: definition.id,
      source: "runner",
      ...repoField,
      command: definition.displayCommand,
      status: result.exitCode === 0 && !result.error && !result.timedOut ? "passed" : "failed",
      summary: validationSummary(result),
    });
  }
  return validations;
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
    await this.acquire(label, ids);
    try {
      if (!this.lockRoot) return await task();
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
  const failed = validations.filter(
    (validation) => validation.source === "runner" && validation.status !== "passed",
  );
  if (failed.length === 0) return undefined;
  return `parent validation failed: ${failed.map(recordedParentValidationLabel).join(", ")}`;
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
