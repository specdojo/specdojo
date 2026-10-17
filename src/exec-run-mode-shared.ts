import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { selfRunArgs } from "./shared/spawn-self.js";
import { specdojoRootDir } from "./shared/specdojo-config.js";
import {
  readPipelineState,
  updatePipelineRepoIntegration,
  updatePipelineStage,
  writePipelineState,
  type PipelineRepoIntegrationState,
  type PipelineStageState,
  type PipelineStageRole,
} from "./exec-pipeline-state.js";

export function spawnSelf(args: string[], cwd = specdojoRootDir()): boolean {
  const [exe, fullArgs] = selfRunArgs(args);
  const result = spawnSync(exe, fullArgs, { stdio: "inherit", cwd });
  return result.status === 0;
}

export function spawnValidate(projectId: string | undefined): boolean {
  const args = ["exec", "validate"];
  if (projectId) args.push("--project", projectId);
  return spawnSelf(args);
}

export function spawnRefresh(projectId: string | undefined): boolean {
  const refreshArgs = ["exec", "refresh"];
  if (projectId) refreshArgs.push("--project", projectId);
  return spawnSelf(refreshArgs);
}

export function spawnScheduleBuild(projectId: string | undefined, track: string): boolean {
  const args = ["schedule", "build", "--track", track, "--force"];
  if (projectId) args.push("--project", projectId);
  return spawnSelf(args);
}

// doc-index is project-independent (it scans the whole docs/ tree), so no --project is passed.
// Rebuilding it before Ready selection lets tasks resolve wikilinks/IDs to deliverables that a
// prior round or a prior cycle step just created (see scheduleAvailable and runCycleMode).
export function spawnIndexBuild(): boolean {
  return spawnSelf(["index", "build"]);
}

export function spawnClaim(projectId: string | undefined, taskId: string, by: string): boolean {
  const args = [
    "exec",
    "claim",
    "--task",
    taskId,
    "--by",
    by,
    "--msg",
    "auto-run",
    "--allow-multiple-doing",
  ];
  if (projectId) args.push("--project", projectId);
  return spawnSelf(args);
}

export function spawnComplete(projectId: string | undefined, taskId: string, by: string): void {
  const args = ["exec", "complete", "--task", taskId, "--by", by, "--msg", "auto-complete"];
  if (projectId) args.push("--project", projectId);
  spawnSelf(args);
}

// Release a just-made claim (doing → todo) when setup fails after the claim, so the task is not
// stranded in "doing" with no worktree. Uses the claiming actor, so no cross-actor override needed.
export function spawnRelease(
  projectId: string | undefined,
  taskId: string,
  by: string,
  reason: string,
): void {
  const args = [
    "exec",
    "release",
    "--task",
    taskId,
    "--by",
    by,
    "--msg",
    reason,
    "--allow-multiple-doing",
  ];
  if (projectId) args.push("--project", projectId);
  spawnSelf(args);
}

// block 上限。block イベントログを読みやすく保つため、stderr から取り出した理由を切り詰める。
export function pipelineRecoveryMeta(input: {
  stage: PipelineStageRole;
  evidenceRef?: string;
  stateRef?: string;
  runId?: string;
}): Record<string, string> {
  return {
    pipeline_stage: input.stage,
    ...(input.evidenceRef ? { evidence_ref: input.evidenceRef } : {}),
    ...(input.stateRef ? { pipeline_state_ref: input.stateRef } : {}),
    ...(input.runId ? { pipeline_run_id: input.runId } : {}),
  };
}

export function spawnBlock(
  projectId: string | undefined,
  taskId: string,
  by: string,
  reason: string,
  meta: Record<string, string> = { limit_deferred: "false" },
): void {
  const args = ["exec", "block", "--task", taskId, "--by", by, "--msg", reason];
  for (const [key, value] of Object.entries(meta)) args.push("--meta", `${key}=${value}`);
  if (projectId) args.push("--project", projectId);
  spawnSelf(args);
}

export function repoRelativePath(repoRoot: string, path: string): string {
  return relative(repoRoot, path).split(sep).join("/");
}

// commitlint (config-conventional) rejects headers longer than 100 characters. Task names and
// register titles are free text, so clip the subject instead of failing the commit or merge.
const COMMIT_SUBJECT_MAX_LENGTH = 100;

export function commitSubject(prefix: string, title: string): string {
  const flat = title.replace(/\s+/g, " ").trim();
  const subject = `${prefix}${flat}`;
  if (subject.length <= COMMIT_SUBJECT_MAX_LENGTH) return subject;
  return `${subject.slice(0, COMMIT_SUBJECT_MAX_LENGTH - 1)}…`;
}

// 統合段（commit → merge → worktree 撤去）の進捗を pipeline-state へ記録する。Schedule は
// succeeded を exec branch へ commit してから merge し、register は開始と失敗を worktree に
// 記録する。記帳の失敗で統合自体を止めない。
export function recordIntegrateStage(
  statePath: string | undefined,
  updatedAt: string,
  buildPatch: (current: PipelineStageState | undefined) => Partial<PipelineStageState>,
): void {
  if (!statePath || !existsSync(statePath)) return;
  try {
    const state = readPipelineState(statePath);
    const patch = buildPatch(state.stages.integrate);
    writePipelineState(statePath, updatePipelineStage(state, "integrate", patch, updatedAt));
  } catch (error) {
    process.stderr.write(
      `warning: could not record the integrate stage in ${statePath}: ` +
        `${error instanceof Error ? error.message : String(error)}\n`,
    );
  }
}

// 複数リポジトリ統合の進捗を同じ pipeline state へ追記する。プロダクトを統合するたびに
// project worktree 側へ書くため、途中で失敗しても `--resume` は Git の実状態とこの記録の両方を
// 手掛かりに、統合済みリポジトリを飛ばせる。
export function recordRepoIntegration(
  statePath: string | undefined,
  repo: string,
  patch: Partial<PipelineRepoIntegrationState>,
): void {
  if (!statePath || !existsSync(statePath)) return;
  const updatedAt = new Date().toISOString();
  try {
    const state = readPipelineState(statePath);
    writePipelineState(statePath, updatePipelineRepoIntegration(state, repo, patch, updatedAt));
  } catch (error) {
    process.stderr.write(
      `warning: could not record repository ${repo} in ${statePath}: ` +
        `${error instanceof Error ? error.message : String(error)}\n`,
    );
  }
}

export function integrateLogPath(statePath: string | undefined): string | undefined {
  return statePath ? join(dirname(statePath), "integrate.log") : undefined;
}
