import { readFileSync, renameSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { ensureDir, safeSlug } from "./exec-shared.js";
import { gitOutput } from "./exec-worktree.js";
import type { AgentStageRole } from "./exec-types.js";

const MAX_LOG_BYTES = 64 * 1024;
const MAX_CHANGE_FILES = 1_000;
const MAX_FINAL_MESSAGE_LENGTH = 4_000;
const MAX_DIFF_SUMMARY_LENGTH = 4_000;
const MAX_VALIDATIONS = 50;
const MAX_VALIDATION_COMMAND_LENGTH = 500;
const MAX_VALIDATION_SUMMARY_LENGTH = 1_000;

export type EvidenceValidation = {
  id?: string;
  source?: "executor" | "runner";
  command: string;
  status: "passed" | "failed" | "not_run";
  summary: string;
};

export type ExecEvidence = {
  schema_version: 1;
  task_id: string;
  run_id: string;
  stage: {
    role: AgentStageRole;
    actor: string;
    status: "succeeded" | "failed" | "rate_limited";
    started_at: string;
    completed_at: string;
    exit_code: number | null;
    attempts: number;
  };
  changes: Array<{ path: string; status: string }>;
  diff_summary: {
    files_changed: number;
    summary: string;
  };
  validations: EvidenceValidation[];
  final_message: string;
  log_refs: Array<{
    kind: "agent-output-excerpt";
    path: string;
    bytes: number;
    truncated: boolean;
  }>;
};

export type RecordExecutorEvidenceInput = {
  repoRoot: string;
  worktreePath: string;
  executionPath: string;
  taskId: string;
  runId: string;
  actor: string;
  status: ExecEvidence["stage"]["status"];
  startedAt: string;
  completedAt: string;
  exitCode: number | null;
  attempts: number;
  stdout: string;
  stderr: string;
  parentValidations?: EvidenceValidation[];
};

export type BuildExecutorEvidenceInput = Omit<
  RecordExecutorEvidenceInput,
  "repoRoot" | "worktreePath" | "executionPath"
> & {
  changes: ExecEvidence["changes"];
  diffStat: string;
  logRefPath: string;
  parentValidations?: EvidenceValidation[];
};

type ExecutorReport = {
  final_message?: unknown;
  validations?: unknown;
};

const REPORT_PATTERN =
  /<specdojo_executor_evidence>\s*([\s\S]*?)\s*<\/specdojo_executor_evidence>/giu;

function truncate(value: string, limit: number): string {
  if (value.length <= limit) return value;
  return `${value.slice(0, Math.max(0, limit - 1))}…`;
}

/** Redacts common credential forms before agent output is persisted as evidence or a log excerpt. */
export function redactSensitiveText(value: string): string {
  return value
    .replace(/\bBearer\s+[A-Za-z0-9._~+/=-]+/giu, "Bearer [REDACTED]")
    .replace(/\b(sk-(?:proj-)?[A-Za-z0-9_-]{8,}|gh[opsu]_[A-Za-z0-9_]{8,})\b/gu, "[REDACTED]")
    .replace(
      /\b(api[_-]?key|access[_-]?token|auth(?:orization)?|password|passwd|secret)\b(\s*[:=]\s*)([^\s,;]+)/giu,
      "$1$2[REDACTED]",
    );
}

function boundedText(value: unknown, limit: number): string {
  return truncate(redactSensitiveText(typeof value === "string" ? value.trim() : ""), limit);
}

export function parseExecutorReport(stdout: string): {
  finalMessage: string;
  validations: EvidenceValidation[];
} {
  const matches = [...stdout.matchAll(REPORT_PATTERN)];
  const raw = matches.at(-1)?.[1];
  let report: ExecutorReport = {};
  if (raw) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        report = parsed as ExecutorReport;
      }
    } catch {
      // A malformed optional report must not discard the executor's process outcome.
    }
  }

  const validations: EvidenceValidation[] = [];
  if (Array.isArray(report.validations)) {
    for (const item of report.validations.slice(0, MAX_VALIDATIONS)) {
      if (!item || typeof item !== "object" || Array.isArray(item)) continue;
      const candidate = item as Record<string, unknown>;
      const command = boundedText(candidate.command, MAX_VALIDATION_COMMAND_LENGTH);
      const status = candidate.status;
      if (!command || (status !== "passed" && status !== "failed" && status !== "not_run")) {
        continue;
      }
      validations.push({
        source: "executor",
        command,
        status,
        summary: boundedText(candidate.summary, MAX_VALIDATION_SUMMARY_LENGTH),
      });
    }
  }

  const fallback = stdout.replace(REPORT_PATTERN, "").trim();
  return {
    finalMessage: boundedText(report.final_message ?? fallback, MAX_FINAL_MESSAGE_LENGTH),
    validations,
  };
}

function parseStatusPaths(worktreePath: string): Array<{ path: string; status: string }> {
  const output = gitOutput(worktreePath, [
    "status",
    "--porcelain=v1",
    "-z",
    "--untracked-files=all",
  ]);
  const records = output.split("\0").filter(Boolean);
  const changes: Array<{ path: string; status: string }> = [];
  for (let index = 0; index < records.length; index++) {
    const record = records[index];
    if (record.length < 4) continue;
    const status = record.slice(0, 2).trim() || "modified";
    let path = record.slice(3);
    if ((status.includes("R") || status.includes("C")) && records[index + 1]) {
      path = `${records[++index]} -> ${path}`;
    }
    changes.push({ path: path.split(sep).join("/"), status });
  }
  return changes;
}

function repoRelative(repoRoot: string, path: string): string {
  return relative(repoRoot, path).split(sep).join("/");
}

export function buildExecutorEvidence(input: BuildExecutorEvidenceInput): {
  evidence: ExecEvidence;
  logExcerpt: string;
} {
  const report = parseExecutorReport(input.stdout);
  const parentValidations = input.parentValidations ?? [];
  const validations = [
    ...report.validations.slice(0, Math.max(0, MAX_VALIDATIONS - parentValidations.length)),
    ...parentValidations.slice(0, MAX_VALIDATIONS),
  ].slice(0, MAX_VALIDATIONS);
  const changes = input.changes.slice(0, MAX_CHANGE_FILES).map((change) => ({
    path: boundedText(change.path, 1_000),
    status: boundedText(change.status, 40),
  }));
  const output = redactSensitiveText(`${input.stdout}\n${input.stderr}`.trim());
  const logExcerpt = Buffer.from(output, "utf8").subarray(0, MAX_LOG_BYTES).toString("utf8");
  const logTruncated = Buffer.byteLength(output, "utf8") > MAX_LOG_BYTES;
  return {
    logExcerpt,
    evidence: {
      schema_version: 1,
      task_id: input.taskId,
      run_id: input.runId,
      stage: {
        role: "executor",
        actor: input.actor,
        status: input.status,
        started_at: input.startedAt,
        completed_at: input.completedAt,
        exit_code: input.exitCode,
        attempts: input.attempts,
      },
      changes,
      diff_summary: {
        files_changed: changes.length,
        summary: truncate(redactSensitiveText(input.diffStat.trim()), MAX_DIFF_SUMMARY_LENGTH),
      },
      validations,
      final_message: report.finalMessage,
      log_refs: [
        {
          kind: "agent-output-excerpt",
          path: input.logRefPath,
          bytes: Buffer.byteLength(logExcerpt, "utf8"),
          truncated: logTruncated,
        },
      ],
    },
  };
}

export function recordExecutorEvidence(input: RecordExecutorEvidenceInput): {
  evidence: ExecEvidence;
  evidencePath: string;
} {
  const executionRel = repoRelative(input.repoRoot, input.executionPath);
  const runnerManagedPrefixes = [
    `${executionRel}/exec/plans/`,
    `${executionRel}/exec/results/`,
    `${executionRel}/exec/events/`,
    `${executionRel}/exec/evidence/`,
    `${executionRel}/generated/`,
  ];
  const changesBeforeEvidence = parseStatusPaths(input.worktreePath).filter((change) =>
    runnerManagedPrefixes.every((prefix) => !change.path.startsWith(prefix)),
  );
  const diffStat = gitOutput(input.worktreePath, ["diff", "--stat", "HEAD", "--"]);

  const executionInWorktree = join(input.worktreePath, executionRel);
  const evidenceDir = join(
    executionInWorktree,
    "exec",
    "evidence",
    safeSlug(input.taskId),
    safeSlug(input.runId),
  );
  ensureDir(evidenceDir);
  const logPath = join(evidenceDir, "executor.log");
  const evidencePath = join(evidenceDir, "evidence.json");
  const { evidence, logExcerpt } = buildExecutorEvidence({
    taskId: input.taskId,
    runId: input.runId,
    actor: input.actor,
    status: input.status,
    startedAt: input.startedAt,
    completedAt: input.completedAt,
    exitCode: input.exitCode,
    attempts: input.attempts,
    stdout: input.stdout,
    stderr: input.stderr,
    changes: changesBeforeEvidence,
    diffStat,
    logRefPath: repoRelative(input.worktreePath, logPath),
    parentValidations: input.parentValidations,
  });
  writeFileSync(logPath, logExcerpt, "utf8");
  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
  return { evidence, evidencePath };
}

export function readExecutorEvidence(path: string): ExecEvidence {
  return JSON.parse(readFileSync(path, "utf8")) as ExecEvidence;
}

/** Persists runner-refreshed evidence without exposing a partially written JSON checkpoint. */
export function writeExecutorEvidence(path: string, evidence: ExecEvidence): void {
  const temporaryPath = `${path}.tmp`;
  writeFileSync(temporaryPath, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
  renameSync(temporaryPath, path);
}
