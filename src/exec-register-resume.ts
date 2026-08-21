import { existsSync, readdirSync } from "node:fs";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import type { ExecEvidence } from "./exec-evidence.js";
import { loadPipelineResumeCheckpoint, type PipelineState } from "./exec-pipeline-state.js";
import { safeSlug } from "./exec-shared.js";

// register 項目の executor/reporter pipeline を reporter 段から再開するための、
// run 特定と入力復元。executor が成功したまま reporter だけが失敗した run は、worktree の
// 未コミット成果と `pipeline-state.json` / `evidence.json` が残っている。ここではその run を
// 特定し、reporter へ渡す plan / result / evidence を復元する（実行は exec-run 側が行う）。

export type RegisterResumeCandidate = {
  runId: string;
  stateRef: string;
  statePath: string;
  state: PipelineState;
  evidence?: ExecEvidence;
};

export type RegisterResumeTarget = {
  runId: string;
  stateRef: string;
  statePath: string;
  state: PipelineState;
  evidence: ExecEvidence;
  evidenceRef: string;
};

export type RegisterResumeLookup =
  | { kind: "resumable"; target: RegisterResumeTarget }
  | { kind: "not-resumable"; reason: string };

export function registerEvidenceDir(input: {
  repoRoot: string;
  worktreePath: string;
  executionPath: string;
  taskId: string;
}): string {
  const executionRel = relative(input.repoRoot, input.executionPath);
  return join(input.worktreePath, executionRel, "exec", "evidence", safeSlug(input.taskId));
}

// worktree に残っている run ディレクトリを読み、pipeline-state.json を持つものを候補にする。
// 壊れた state・別 task の state は loadPipelineResumeCheckpoint が弾くため、ここでは黙って
// 候補から外す（再開可否の判定は selectResumableRegisterRun が理由つきで行う）。
export function loadRegisterResumeCandidates(input: {
  repoRoot: string;
  worktreePath: string;
  executionPath: string;
  taskId: string;
}): RegisterResumeCandidate[] {
  const evidenceDir = registerEvidenceDir(input);
  if (!existsSync(evidenceDir)) return [];
  const runIds = readdirSync(evidenceDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const candidates: RegisterResumeCandidate[] = [];
  for (const runId of runIds) {
    const statePath = join(evidenceDir, runId, "pipeline-state.json");
    if (!existsSync(statePath)) continue;
    const stateRef = relative(input.worktreePath, statePath).split(sep).join("/");
    const checkpoint = loadPipelineResumeCheckpoint({
      worktreePath: input.worktreePath,
      stateRef,
      taskId: input.taskId,
    });
    if (!checkpoint) continue;
    candidates.push({
      runId,
      stateRef,
      statePath: checkpoint.statePath,
      state: checkpoint.state,
      ...(checkpoint.evidence ? { evidence: checkpoint.evidence } : {}),
    });
  }
  return candidates;
}

// 再開対象は「最新の run」だけに限定する。より古い run へ遡ると、後続 run が作った
// 未コミット成果や result と食い違うため、最新 run が再開できない場合は理由を返して止める。
export function selectResumableRegisterRun(
  candidates: readonly RegisterResumeCandidate[],
): RegisterResumeLookup {
  if (candidates.length === 0) {
    return { kind: "not-resumable", reason: "no pipeline run state found in the worktree" };
  }
  const latest = [...candidates].sort((a, b) => {
    if (a.state.updated_at !== b.state.updated_at) {
      return a.state.updated_at < b.state.updated_at ? -1 : 1;
    }
    return a.runId < b.runId ? -1 : a.runId > b.runId ? 1 : 0;
  })[candidates.length - 1];

  if (latest.state.stages.reporter.status === "succeeded") {
    return {
      kind: "not-resumable",
      reason: `reporter already succeeded for run ${latest.runId}`,
    };
  }
  if (latest.state.stages.executor.status !== "succeeded") {
    return {
      kind: "not-resumable",
      reason: `executor stage is "${latest.state.stages.executor.status}" for run ${latest.runId}; re-run the item instead`,
    };
  }
  const evidenceRef = latest.state.stages.executor.artifact_ref;
  if (!latest.evidence || !evidenceRef) {
    return {
      kind: "not-resumable",
      reason: `executor evidence is missing or invalid for run ${latest.runId}`,
    };
  }
  return {
    kind: "resumable",
    target: {
      runId: latest.runId,
      stateRef: latest.stateRef,
      statePath: latest.statePath,
      state: latest.state,
      evidence: latest.evidence,
      evidenceRef,
    },
  };
}

export function findResumableRegisterRun(input: {
  repoRoot: string;
  worktreePath: string;
  executionPath: string;
  taskId: string;
}): RegisterResumeLookup {
  return selectResumableRegisterRun(loadRegisterResumeCandidates(input));
}

// plan / result のファイル名は `<pjr-id>-<UTC>-<rand>-(plan|result).md`（buildInPlaceStem）。
// state に artifacts が無い旧 run のために、worktree の result 一覧から最新の stem を復元する。
export function selectLatestRegisterResultStem(
  fileNames: readonly string[],
  pjrId: string,
): string | null {
  const pattern = new RegExp(
    `^(${pjrId.toLowerCase()}-\\d{8}T\\d{6}Z-[0-9a-f]+)-result\\.md$`,
    "i",
  );
  const stems: string[] = [];
  for (const name of fileNames) {
    const match = name.match(pattern);
    if (match) stems.push(match[1]);
  }
  if (stems.length === 0) return null;
  return stems.sort()[stems.length - 1];
}

export type RegisterResumeArtifacts = {
  // repo 相対（POSIX 区切り）。worktree と root で同じ相対パスを指す。
  planRef: string;
  resultRef: string;
  stem: string;
};

// state はエージェントが書き込める worktree 内のファイルのため、参照が root の外へ出ないことを
// 確認してから使う（絶対パスや `..` を含む参照は受け付けない）。
function isContainedRef(root: string, ref: string): boolean {
  if (!ref) return false;
  const rel = relative(root, resolve(root, ref));
  return rel !== "" && rel !== ".." && !rel.startsWith(`..${sep}`) && !isAbsolute(rel);
}

// reporter 段の入力（plan と result）を state から復元する。state に artifacts がある場合は
// それを正本とし、無い旧 run では worktree の result ファイル名から stem を復元する。
export function resolveRegisterResumeArtifacts(input: {
  repoRoot: string;
  worktreePath: string;
  executionPath: string;
  taskId: string;
  state: PipelineState;
}): RegisterResumeArtifacts | null {
  const executionRel = relative(input.repoRoot, input.executionPath).split(sep).join("/");
  const artifacts = input.state.artifacts;
  if (artifacts) {
    if (
      !isContainedRef(input.repoRoot, artifacts.plan_ref) ||
      !isContainedRef(input.worktreePath, artifacts.result_ref)
    ) {
      return null;
    }
    const stem = artifacts.result_ref.replace(/^.*\//, "").replace(/-result\.md$/, "");
    return { planRef: artifacts.plan_ref, resultRef: artifacts.result_ref, stem };
  }

  const resultsDir = join(input.worktreePath, executionRel, "exec", "results");
  if (!existsSync(resultsDir)) return null;
  const stem = selectLatestRegisterResultStem(readdirSync(resultsDir), input.taskId);
  if (!stem) return null;
  return {
    planRef: `${executionRel}/exec/plans/${stem}-plan.md`,
    resultRef: `${executionRel}/exec/results/${stem}-result.md`,
    stem,
  };
}
