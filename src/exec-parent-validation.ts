import { spawn } from "node:child_process";
import type { EvidenceValidation, ExecEvidence } from "./exec-evidence.js";
import { redactSensitiveText } from "./exec-evidence.js";

const MAX_CAPTURE_BYTES = 64 * 1024;
const MAX_SUMMARY_LENGTH = 1_000;

export type ParentValidationId = "test-integration";

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
  "test-integration": {
    id: "test-integration",
    command: process.platform === "win32" ? "npm.cmd" : "npm",
    args: ["run", "test:integration"],
    displayCommand: "npm run test:integration",
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

export function resolveParentValidationDefinitions(
  ids: readonly string[] | undefined,
): ParentValidationDefinition[] {
  if (!ids) return [];
  const seen = new Set<string>();
  return ids.map((id) => {
    if (seen.has(id)) {
      throw new Error(`Duplicate parent validation id in exec-defaults: ${id}`);
    }
    seen.add(id);
    const definition = PARENT_VALIDATION_REGISTRY[id as ParentValidationId];
    if (!definition) {
      throw new Error(
        `Unknown parent validation id in exec-defaults: ${id} (allowed: ${Object.keys(PARENT_VALIDATION_REGISTRY).join(", ")})`,
      );
    }
    return definition;
  });
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
      env: process.env,
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

export async function runParentValidations(
  ids: readonly string[] | undefined,
  cwd: string,
  invoke: ParentValidationInvoker = invokeParentValidation,
): Promise<EvidenceValidation[]> {
  const definitions = resolveParentValidationDefinitions(ids);
  const validations: EvidenceValidation[] = [];
  for (const definition of definitions) {
    const result = await invoke(definition, cwd);
    validations.push({
      id: definition.id,
      source: "runner",
      command: definition.displayCommand,
      status: result.exitCode === 0 && !result.error && !result.timedOut ? "passed" : "failed",
      summary: validationSummary(result),
    });
  }
  return validations;
}

export function failedParentValidationReason(
  validations: readonly EvidenceValidation[],
): string | undefined {
  const failed = validations.filter(
    (validation) => validation.source === "runner" && validation.status !== "passed",
  );
  if (failed.length === 0) return undefined;
  return `parent validation failed: ${failed.map((validation) => validation.id ?? validation.command).join(", ")}`;
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
  configuredIds: readonly string[] | undefined,
): boolean {
  const expectedIds = resolveParentValidationDefinitions(configuredIds).map(
    (definition) => definition.id,
  );
  const recordedIds = validations
    .filter((validation) => validation.source === "runner")
    .map((validation) => validation.id)
    .filter((id): id is string => typeof id === "string");
  return (
    recordedIds.length === expectedIds.length &&
    expectedIds.every((id, index) => recordedIds[index] === id)
  );
}
