import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  findResumableRegisterRun,
  loadRegisterResumeCandidates,
  resolveRegisterResumeArtifacts,
  selectLatestRegisterResultStem,
  selectResumableRegisterRun,
  type RegisterResumeCandidate,
} from "../../src/exec-register-resume.js";
import {
  resolveRegisterResumeExecutor,
  resolveRegisterResumeReporter,
} from "../../src/exec-run.js";
import type { ExecEvidence } from "../../src/exec-evidence.js";
import { createPipelineState, type PipelineState } from "../../src/exec-pipeline-state.js";
import type { MemberRoster, ProjectMember } from "../../src/specdojo-config.js";

const TASK_ID = "PJR-AB12";
const EXECUTION_REL = path.join("docs", "ja", "projects", "test", "execution");

function makeEvidence(runId: string): ExecEvidence {
  return {
    schema_version: 1,
    task_id: TASK_ID,
    run_id: runId,
    stage: {
      role: "executor",
      actor: "exec-1",
      status: "succeeded",
      started_at: "2026-08-20T00:00:00Z",
      completed_at: "2026-08-20T00:10:00Z",
      exit_code: 0,
      attempts: 1,
    },
    changes: [{ path: "docs/sample.md", status: "M" }],
    diff_summary: { files_changed: 1, summary: "1 file changed" },
    validations: [{ command: "npm run test:unit", status: "passed", summary: "ok" }],
    final_message: "done",
    log_refs: [],
  };
}

function makeState(
  overrides: {
    runId?: string;
    updatedAt?: string;
    executorStatus?: PipelineState["stages"]["executor"]["status"];
    reporterStatus?: PipelineState["stages"]["reporter"]["status"];
    integrateStatus?: PipelineState["stages"]["executor"]["status"];
    evidenceRef?: string | null;
  } = {},
): PipelineState {
  const runId = overrides.runId ?? "20260820T000000Z-aaaa";
  const state = createPipelineState({
    taskId: TASK_ID,
    runId,
    updatedAt: overrides.updatedAt ?? "2026-08-20T00:10:00Z",
    executorActor: "exec-1",
    reporterActor: "report-1",
  });
  return {
    ...state,
    stages: {
      executor: {
        ...state.stages.executor,
        status: overrides.executorStatus ?? "succeeded",
        attempts: 1,
        artifact_ref:
          overrides.evidenceRef === undefined
            ? `${EXECUTION_REL}/exec/evidence/${TASK_ID}/${runId}/evidence.json`
                .split(path.sep)
                .join("/")
            : overrides.evidenceRef,
      },
      reporter: {
        ...state.stages.reporter,
        status: overrides.reporterStatus ?? "failed",
      },
      ...(overrides.integrateStatus
        ? {
            integrate: {
              status: overrides.integrateStatus,
              actor: "report-1",
              attempts: 1,
              started_at: "2026-08-20T00:20:00Z",
              completed_at: "2026-08-20T00:21:00Z",
              artifact_ref: null,
            },
          }
        : {}),
    },
  };
}

function makeCandidate(
  overrides: Partial<RegisterResumeCandidate> & { state: PipelineState },
): RegisterResumeCandidate {
  return {
    runId: overrides.state.run_id,
    stateRef: `state/${overrides.state.run_id}.json`,
    statePath: `/tmp/state/${overrides.state.run_id}.json`,
    evidence: makeEvidence(overrides.state.run_id),
    evidenceRef: overrides.state.stages.executor.artifact_ref ?? undefined,
    ...overrides,
  };
}

function makeAgent(overrides: Partial<ProjectMember> = {}): ProjectMember {
  return {
    nickname: "report-1",
    display_name: "Reporter 1",
    email: null,
    roles: [],
    type: "agent",
    stage_role: "reporter",
    command: "run-report-1",
    ...overrides,
  };
}

function makeRoster(members: ProjectMember[]): MemberRoster {
  return { version: 1, project_id: "test", members };
}

describe("selectResumableRegisterRun", () => {
  it("run が1件も無い場合は理由つきで再開不可を返す", () => {
    const actual = selectResumableRegisterRun([]);

    expect(actual).toEqual({
      kind: "not-resumable",
      reason: "no pipeline run state found in the worktree",
    });
  });

  it("executor が succeeded で reporter 未完了の最新 run を再開対象にする", () => {
    const older = makeCandidate({
      state: makeState({ runId: "run-old", updatedAt: "2026-08-20T00:00:00Z" }),
    });
    const latest = makeCandidate({
      state: makeState({ runId: "run-new", updatedAt: "2026-08-21T00:00:00Z" }),
    });

    const actual = selectResumableRegisterRun([older, latest]);

    expect(actual.kind).toBe("resumable");
    if (actual.kind !== "resumable") return;
    expect(actual.target.stage).toBe("reporter");
    if (actual.target.stage !== "reporter") return;
    expect(actual.target.runId).toBe("run-new");
    expect(actual.target.evidence.run_id).toBe("run-new");
    expect(actual.target.evidenceRef).toContain("run-new/evidence.json");
  });

  it("executor が running のまま残った最新 run を executor 再開対象にする", () => {
    const candidate = makeCandidate({
      state: makeState({ executorStatus: "running", evidenceRef: null }),
      evidence: undefined,
    });

    const actual = selectResumableRegisterRun([candidate]);

    expect(actual.kind).toBe("resumable");
    if (actual.kind !== "resumable") return;
    expect(actual.target.stage).toBe("executor");
    expect(actual.target.runId).toBe(candidate.runId);
  });

  it("executor evidence 保存後に running のまま中断した run は reporter 再開対象にする", () => {
    const evidenceRef = `${EXECUTION_REL}/exec/evidence/${TASK_ID}/run-interrupted/evidence.json`
      .split(path.sep)
      .join("/");
    const candidate = makeCandidate({
      state: makeState({
        runId: "run-interrupted",
        executorStatus: "running",
        evidenceRef: null,
      }),
      evidence: makeEvidence("run-interrupted"),
      evidenceRef,
    });

    const actual = selectResumableRegisterRun([candidate]);

    expect(actual.kind).toBe("resumable");
    if (actual.kind !== "resumable") return;
    expect(actual.target.stage).toBe("reporter");
    expect(actual.target.state.stages.executor.status).toBe("succeeded");
    expect(actual.target.state.stages.executor.artifact_ref).toBe(evidenceRef);
  });

  it("executor が rate_limited の run は evidence があっても executor 再開対象にする", () => {
    const evidenceRef = `${EXECUTION_REL}/exec/evidence/${TASK_ID}/run-rate-limited/evidence.json`
      .split(path.sep)
      .join("/");
    const candidate = makeCandidate({
      state: makeState({
        runId: "run-rate-limited",
        executorStatus: "rate_limited",
        evidenceRef: null,
      }),
      evidence: makeEvidence("run-rate-limited"),
      evidenceRef,
    });

    const actual = selectResumableRegisterRun([candidate]);

    expect(actual.kind).toBe("resumable");
    if (actual.kind !== "resumable") return;
    // rate limit で打ち切られた executor は作業を完了していないため、evidence があっても
    // reporter へ進めない。
    expect(actual.target.stage).toBe("executor");
    expect(actual.target.runId).toBe("run-rate-limited");
  });

  it("保護機構で blocked になった run は evidence があっても executor 再開対象にする", () => {
    const candidate = makeCandidate({
      state: makeState({
        runId: "run-protection-blocked",
        executorStatus: "blocked",
      }),
    });

    const actual = selectResumableRegisterRun([candidate]);

    expect(actual.kind).toBe("resumable");
    if (actual.kind !== "resumable") return;
    expect(actual.target.stage).toBe("executor");
    expect(actual.target.runId).toBe("run-protection-blocked");
  });

  it("最新 run の executor が未完了なら、古い再開可能な run へ遡らない", () => {
    const resumable = makeCandidate({
      state: makeState({ runId: "run-old", updatedAt: "2026-08-20T00:00:00Z" }),
    });
    const latest = makeCandidate({
      state: makeState({
        runId: "run-new",
        updatedAt: "2026-08-21T00:00:00Z",
        executorStatus: "failed",
      }),
    });

    const actual = selectResumableRegisterRun([resumable, latest]);

    expect(actual).toEqual({
      kind: "not-resumable",
      reason: 'executor stage is "failed" for run run-new; re-run the item instead',
    });
  });

  it("reporter が succeeded の run は統合段からの再開対象にする", () => {
    const candidate = makeCandidate({ state: makeState({ reporterStatus: "succeeded" }) });

    const actual = selectResumableRegisterRun([candidate]);

    expect(actual.kind).toBe("resumable");
    if (actual.kind !== "resumable") return;
    expect(actual.target.stage).toBe("integrate");
    expect(actual.target.runId).toBe(candidate.runId);
  });

  it("統合が失敗した run も統合段から再開できる", () => {
    const candidate = makeCandidate({
      state: makeState({ reporterStatus: "succeeded", integrateStatus: "failed" }),
    });

    const actual = selectResumableRegisterRun([candidate]);

    expect(actual.kind).toBe("resumable");
    if (actual.kind !== "resumable") return;
    expect(actual.target.stage).toBe("integrate");
  });

  it("統合が succeeded として記録済みでも、worktree が残る run は統合段から再開できる", () => {
    // worktree は統合が完了したときにだけ撤去されるため、state 上の succeeded より
    // worktree が残っている事実を優先する（merge 後の撤去失敗から回復するため）。
    const candidate = makeCandidate({
      state: makeState({ reporterStatus: "succeeded", integrateStatus: "succeeded" }),
    });

    const actual = selectResumableRegisterRun([candidate]);

    expect(actual.kind).toBe("resumable");
    if (actual.kind !== "resumable") return;
    expect(actual.target.stage).toBe("integrate");
  });

  it("executor evidence が欠けている run は再開不可にする", () => {
    const candidate = makeCandidate({ state: makeState({}), evidence: undefined });

    const actual = selectResumableRegisterRun([candidate]);

    expect(actual).toEqual({
      kind: "not-resumable",
      reason: `executor evidence is missing or invalid for run ${candidate.runId}`,
    });
  });
});

describe("loadRegisterResumeCandidates / findResumableRegisterRun", () => {
  let root = "";

  beforeEach(() => {
    root = mkdtempSync(path.join(tmpdir(), "specdojo-register-resume-"));
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  function writeRun(runId: string, state: PipelineState, evidence?: ExecEvidence): void {
    const dir = path.join(root, EXECUTION_REL, "exec", "evidence", TASK_ID, runId);
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      path.join(dir, "pipeline-state.json"),
      `${JSON.stringify(state, null, 2)}\n`,
      "utf8",
    );
    if (evidence) {
      writeFileSync(
        path.join(dir, "evidence.json"),
        `${JSON.stringify(evidence, null, 2)}\n`,
        "utf8",
      );
    }
  }

  it("worktree の run ディレクトリから state と executor evidence を読み出す", () => {
    const runId = "20260820T000000Z-aaaa";
    writeRun(runId, makeState({ runId }), makeEvidence(runId));

    const candidates = loadRegisterResumeCandidates({
      repoRoot: root,
      worktreePath: root,
      executionPath: path.join(root, EXECUTION_REL),
      taskId: TASK_ID,
    });

    expect(candidates).toHaveLength(1);
    expect(candidates[0].runId).toBe(runId);
    expect(candidates[0].evidence?.run_id).toBe(runId);
  });

  it("evidence.json が無い run は再開不可として理由を返す", () => {
    const runId = "20260820T000000Z-bbbb";
    writeRun(runId, makeState({ runId }));

    const actual = findResumableRegisterRun({
      repoRoot: root,
      worktreePath: root,
      executionPath: path.join(root, EXECUTION_REL),
      taskId: TASK_ID,
    });

    expect(actual).toEqual({
      kind: "not-resumable",
      reason: `executor evidence is missing or invalid for run ${runId}`,
    });
  });

  it("running state の直前に保存された executor evidence を復元する", () => {
    const runId = "20260820T000000Z-checkpoint";
    const state = makeState({ runId, executorStatus: "running", evidenceRef: null });
    writeRun(runId, state, makeEvidence(runId));

    const actual = findResumableRegisterRun({
      repoRoot: root,
      worktreePath: root,
      executionPath: path.join(root, EXECUTION_REL),
      taskId: TASK_ID,
    });

    expect(actual.kind).toBe("resumable");
    if (actual.kind !== "resumable") return;
    expect(actual.target.stage).toBe("reporter");
    expect(actual.target.state.stages.executor.status).toBe("succeeded");
  });

  it("evidence ディレクトリが無い worktree は再開不可になる", () => {
    const actual = findResumableRegisterRun({
      repoRoot: root,
      worktreePath: root,
      executionPath: path.join(root, EXECUTION_REL),
      taskId: TASK_ID,
    });

    expect(actual).toEqual({
      kind: "not-resumable",
      reason: "no pipeline run state found in the worktree",
    });
  });
});

describe("selectLatestRegisterResultStem", () => {
  it("同じ項目の result のうち最新のタイムスタンプの stem を返す", () => {
    const actual = selectLatestRegisterResultStem(
      [
        "pjr-ab12-20260820T101010Z-0001-result.md",
        "pjr-ab12-20260821T090000Z-abcd-result.md",
        "pjr-cd34-20260822T090000Z-abcd-result.md",
        "pjr-ab12-20260821T090000Z-abcd-plan.md",
      ],
      "PJR-AB12",
    );

    expect(actual).toBe("pjr-ab12-20260821T090000Z-abcd");
  });

  it("対象項目の result が無ければ null を返す", () => {
    expect(
      selectLatestRegisterResultStem(["pjr-cd34-20260821T090000Z-abcd-result.md"], "PJR-AB12"),
    ).toBeNull();
  });
});

describe("resolveRegisterResumeArtifacts", () => {
  let root = "";

  beforeEach(() => {
    root = mkdtempSync(path.join(tmpdir(), "specdojo-register-resume-artifacts-"));
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("state の artifacts を正本として plan / result / stem を復元する", () => {
    const state: PipelineState = {
      ...makeState({}),
      artifacts: {
        plan_ref:
          "docs/ja/projects/test/execution/exec/plans/pjr-ab12-20260821T090000Z-abcd-plan.md",
        result_ref:
          "docs/ja/projects/test/execution/exec/results/pjr-ab12-20260821T090000Z-abcd-result.md",
      },
    };

    const actual = resolveRegisterResumeArtifacts({
      repoRoot: root,
      worktreePath: root,
      executionPath: path.join(root, EXECUTION_REL),
      taskId: TASK_ID,
      state,
    });

    expect(actual).toEqual({
      planRef: state.artifacts?.plan_ref,
      resultRef: state.artifacts?.result_ref,
      stem: "pjr-ab12-20260821T090000Z-abcd",
    });
  });

  it("artifacts を持たない旧 run では worktree の result 一覧から復元する", () => {
    const resultsDir = path.join(root, EXECUTION_REL, "exec", "results");
    mkdirSync(resultsDir, { recursive: true });
    writeFileSync(path.join(resultsDir, "pjr-ab12-20260820T080000Z-0001-result.md"), "", "utf8");
    writeFileSync(path.join(resultsDir, "pjr-ab12-20260821T090000Z-abcd-result.md"), "", "utf8");

    const actual = resolveRegisterResumeArtifacts({
      repoRoot: root,
      worktreePath: root,
      executionPath: path.join(root, EXECUTION_REL),
      taskId: TASK_ID,
      state: makeState({}),
    });

    expect(actual).toEqual({
      planRef: `${EXECUTION_REL.split(path.sep).join("/")}/exec/plans/pjr-ab12-20260821T090000Z-abcd-plan.md`,
      resultRef: `${EXECUTION_REL.split(path.sep).join("/")}/exec/results/pjr-ab12-20260821T090000Z-abcd-result.md`,
      stem: "pjr-ab12-20260821T090000Z-abcd",
    });
  });

  it("root の外を指す artifacts は受け付けずに null を返す", () => {
    const state: PipelineState = {
      ...makeState({}),
      artifacts: {
        plan_ref: "../outside/plan.md",
        result_ref: "docs/ja/projects/test/execution/exec/results/pjr-ab12-result.md",
      },
    };

    const actual = resolveRegisterResumeArtifacts({
      repoRoot: root,
      worktreePath: root,
      executionPath: path.join(root, EXECUTION_REL),
      taskId: TASK_ID,
      state,
    });

    expect(actual).toBeNull();
  });

  it("result が1件も無ければ復元できずに null を返す", () => {
    mkdirSync(path.join(root, EXECUTION_REL, "exec", "results"), { recursive: true });

    const actual = resolveRegisterResumeArtifacts({
      repoRoot: root,
      worktreePath: root,
      executionPath: path.join(root, EXECUTION_REL),
      taskId: TASK_ID,
      state: makeState({}),
    });

    expect(actual).toBeNull();
  });
});

describe("resolveRegisterResumeReporter", () => {
  it("--reporter-by を最優先で解決する", () => {
    const roster = makeRoster([
      makeAgent({ nickname: "report-1", command: "run-report-1" }),
      makeAgent({ nickname: "report-2", command: "run-report-2" }),
    ]);

    const actual = resolveRegisterResumeReporter(
      roster,
      { reporterBy: "report-2" },
      {},
      "report-1",
    );

    expect(actual).toEqual({
      kind: "command",
      candidate: { command: "run-report-2", actor: "report-2", provider: undefined },
    });
  });

  it("--reporter-by 省略時は pipeline-state に記録された reporter actor を使う", () => {
    const roster = makeRoster([makeAgent({ nickname: "report-1", command: "run-report-1" })]);

    const actual = resolveRegisterResumeReporter(roster, {}, {}, "report-1");

    expect(actual).toEqual({
      kind: "command",
      candidate: { command: "run-report-1", actor: "report-1", provider: undefined },
    });
  });

  it("reporter を特定できない場合は --reporter-by の指定を促す", () => {
    const actual = resolveRegisterResumeReporter(makeRoster([]), {}, {}, null);

    expect(actual).toEqual({
      kind: "error",
      message: "reporter agent is unknown for this run; specify --reporter-by <nickname>",
    });
  });

  it("stage_role が reporter でない nickname はエラーにする", () => {
    const roster = makeRoster([
      makeAgent({ nickname: "exec-1", stage_role: "executor", command: "run-exec-1" }),
    ]);

    const actual = resolveRegisterResumeReporter(roster, { reporterBy: "exec-1" }, {}, null);

    expect(actual.kind).toBe("error");
    if (actual.kind !== "error") return;
    expect(actual.message).toMatch(/--reporter-by agent must have stage_role: reporter/);
  });
});

describe("resolveRegisterResumeExecutor", () => {
  it("--executor-by 省略時は pipeline-state に記録された executor actor を使う", () => {
    const roster = makeRoster([
      makeAgent({ nickname: "exec-1", stage_role: "executor", command: "run-exec-1" }),
    ]);

    const actual = resolveRegisterResumeExecutor(roster, {}, {}, "exec-1");

    expect(actual).toEqual({
      kind: "command",
      candidate: { command: "run-exec-1", actor: "exec-1", provider: undefined },
    });
  });
});
