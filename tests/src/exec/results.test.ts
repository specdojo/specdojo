import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { lint } from "markdownlint/sync";
import { load } from "js-yaml";
import {
  isResultUnfilled,
  readResultFrontmatterSnapshot,
  parseResultTaskIdentity,
  resetResultForClaim,
  renderReporterResult,
  scaffoldResult,
  updateResultStatus,
} from "../../../src/exec/results.js";
import { buildExecutorEvidence, type ExecEvidence } from "../../../src/exec/evidence.js";
import { evidenceForReporter } from "../../../src/exec/reporter.js";
import { specdojoRootDir } from "../../../src/shared/specdojo-config.js";
import { load as loadCompatibleYaml } from "../../../src/shared/yaml.js";

function reporterEvidence(changes: ExecEvidence["changes"]): ExecEvidence {
  return {
    schema_version: 1,
    task_id: "prj-overview",
    run_id: "run-1",
    stage: {
      role: "executor",
      actor: "pipeline-executor",
      status: "succeeded",
      started_at: "2026-08-10T07:00:00.000Z",
      completed_at: "2026-08-10T07:01:00.000Z",
      exit_code: 0,
      attempts: 1,
    },
    changes,
    diff_summary: { files_changed: changes.length, summary: "" },
    validations: [],
    final_message: "executor completed",
    log_refs: [],
  };
}

function markdownlintErrors(content: string): unknown[] {
  const parsed = load(readFileSync(join(specdojoRootDir(), ".markdownlint.yaml"), "utf8"));
  const config =
    typeof parsed === "object" && parsed !== null ? (parsed as Record<string, unknown>) : {};
  const results = lint({
    strings: { result: content },
    config,
  });
  return results.result ?? [];
}

describe("scaffoldResult + updateResultStatus round-trip", () => {
  let executionPath: string;

  beforeEach(() => {
    // Output goes to a temp execution path; the xer template is read from the repo.
    executionPath = join(mkdtempSync(join(tmpdir(), "specdojo-exec-results-")), "execution");
  });

  afterEach(() => {
    rmSync(executionPath, { recursive: true, force: true });
  });

  it("keeps started_at single-quoted after the status update re-serializes frontmatter", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/prj-overview-plan.md",
      agent: "opencode-edit-agent",
      startedAt: "2026-06-20T00:00:00.000Z",
    });

    await updateResultStatus(resultPath, "complete", "2026-06-20T00:01:00.000Z");

    const frontmatter = readFileSync(resultPath, "utf8").split("\n---")[0];
    // Re-serialization must not nest the quotes that scaffoldResult wrote.
    expect(frontmatter).toContain('started_at: "2026-06-20T00:00:00.000Z"');
    expect(frontmatter).not.toContain('""');
    expect(frontmatter).toContain('completed_at: "2026-06-20T00:01:00.000Z"');
    expect(frontmatter).toContain("status: complete");
    expect(frontmatter).toContain("id: prj-0001:xer-prj-overview");

    const content = readFileSync(resultPath, "utf8");
    expect(content).toContain("---\n\n# Edit Result");
  });

  it("normalizes foreign single-quoted timestamps to double quotes on the status update", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/prj-overview-plan.md",
      agent: "opencode-edit-agent",
      startedAt: "2026-06-20T00:00:00.000Z",
    });

    // Simulate a result written by other tooling that single-quotes the timestamp. Reading it back
    // and re-serializing must not preserve or nest the single quotes (the cause of `"'...'"`).
    const scaffolded = readFileSync(resultPath, "utf8");
    writeFileSync(
      resultPath,
      scaffolded.replace(
        'started_at: "2026-06-20T00:00:00.000Z"',
        "started_at: '2026-06-20T00:00:00.000Z'",
      ),
      "utf8",
    );

    await updateResultStatus(resultPath, "complete", "2026-06-20T00:01:00.000Z");

    const frontmatter = readFileSync(resultPath, "utf8").split("\n---")[0];
    expect(frontmatter).toContain('started_at: "2026-06-20T00:00:00.000Z"');
    expect(frontmatter).toContain('completed_at: "2026-06-20T00:01:00.000Z"');
    // No single quotes around timestamps and no double-wrapped nesting remain.
    expect(frontmatter).not.toContain("'2026-06-20T00:00:00.000Z'");
    expect(frontmatter).not.toContain("\"'");
  });

  it("records block_reason in frontmatter when blocked with a reason", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/prj-overview-plan.md",
      agent: "opencode-edit-agent",
      startedAt: "2026-06-20T00:00:00.000Z",
    });

    await updateResultStatus(
      resultPath,
      "blocked",
      "2026-06-20T00:01:00.000Z",
      "agent exited with non-zero code: blocked: dep unresolved; need=resolve; ref=docs/foo.md",
    );

    const frontmatter = readFileSync(resultPath, "utf8").split("\n---")[0];
    expect(frontmatter).toContain("status: blocked");
    expect(frontmatter).toContain(
      'block_reason: "agent exited with non-zero code: blocked: dep unresolved; need=resolve; ref=docs/foo.md"',
    );
  });

  it("preserves multiline block_reason through both supported YAML schemas", async () => {
    const agent = 'agent: "quoted"\\name';
    const planRef = "exec/plans/path: with space\\plan.md";
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "edit",
      projectId: "prj-0001",
      planRef,
      agent,
      startedAt: "2026-06-20T00:00:00.000Z",
    });

    const reason = 'cannot read "config.yaml": C:\\tmp\\config\nretry: later';
    await updateResultStatus(resultPath, "blocked", "2026-06-20T00:01:00.000Z", reason);

    const content = readFileSync(resultPath, "utf8");
    const yaml = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
    expect(yaml).toBeDefined();
    expect(yaml).toContain(
      'block_reason: "cannot read \\"config.yaml\\": C:\\\\tmp\\\\config\\nretry: later"',
    );

    for (const parse of [loadCompatibleYaml, load]) {
      const parsed = parse(yaml ?? "") as {
        specdojo: { agent: string; block_reason: string; plan_ref: string };
      };
      expect(parsed.specdojo.agent).toBe(agent);
      expect(parsed.specdojo.block_reason).toBe(reason);
      expect(parsed.specdojo.plan_ref).toBe(planRef);
    }
  });

  it("clears block_reason when a previously blocked result transitions to complete", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/prj-overview-plan.md",
      agent: "opencode-edit-agent",
      startedAt: "2026-06-20T00:00:00.000Z",
    });

    await updateResultStatus(
      resultPath,
      "blocked",
      "2026-06-20T00:01:00.000Z",
      "transient failure",
    );
    await updateResultStatus(resultPath, "complete", "2026-06-20T00:02:00.000Z");

    const frontmatter = readFileSync(resultPath, "utf8").split("\n---")[0];
    expect(frontmatter).toContain("status: complete");
    expect(frontmatter).not.toContain("block_reason:");
  });

  it("supersedes prior unfinished unique-name results without changing completed results", async () => {
    const first = await scaffoldResult({
      executionPath,
      taskId: "PJR-TEST",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/pjr-test-first-plan.md",
      agent: "codex-edit-agent",
      startedAt: "2026-06-20T00:00:00.000Z",
      stem: "pjr-test-first",
    });
    await updateResultStatus(first.resultPath, "complete", "2026-06-20T00:01:00.000Z");

    const second = await scaffoldResult({
      executionPath,
      taskId: "PJR-TEST",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/pjr-test-second-plan.md",
      agent: "codex-edit-agent",
      startedAt: "2026-06-20T00:02:00.000Z",
      stem: "pjr-test-second",
    });
    const third = await scaffoldResult({
      executionPath,
      taskId: "PJR-TEST",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/pjr-test-third-plan.md",
      agent: "codex-edit-agent",
      startedAt: "2026-06-20T00:03:00.000Z",
      stem: "pjr-test-third",
    });
    await updateResultStatus(
      third.resultPath,
      "blocked",
      "2026-06-20T00:04:00.000Z",
      "retry required",
    );

    const fourth = await scaffoldResult({
      executionPath,
      taskId: "PJR-TEST",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/pjr-test-fourth-plan.md",
      agent: "codex-edit-agent",
      startedAt: "2026-06-20T00:05:00.000Z",
      stem: "pjr-test-fourth",
    });

    const completed = readFileSync(first.resultPath, "utf8").split("\n---")[0];
    const supersededInProgress = readFileSync(second.resultPath, "utf8").split("\n---")[0];
    const supersededBlocked = readFileSync(third.resultPath, "utf8").split("\n---")[0];
    expect(completed).toContain("status: complete");
    expect(completed).toContain('completed_at: "2026-06-20T00:01:00.000Z"');
    expect(supersededInProgress).toContain("status: superseded");
    expect(supersededInProgress).toContain('completed_at: "2026-06-20T00:03:00.000Z"');
    expect(supersededBlocked).toContain("status: superseded");
    expect(supersededBlocked).toContain('completed_at: "2026-06-20T00:05:00.000Z"');
    expect(supersededBlocked).not.toContain("block_reason:");
    expect(third.supersededPaths).toEqual([second.resultPath]);
    expect(fourth.supersededPaths).toEqual([third.resultPath]);
  });

  it("does not supersede a fixed-name result reused by the same run identity", async () => {
    const first = await scaffoldResult({
      executionPath,
      taskId: "T-TEST",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/T-TEST-plan.md",
      agent: "codex-edit-agent",
      startedAt: "2026-06-20T00:00:00.000Z",
    });
    const reused = await scaffoldResult({
      executionPath,
      taskId: "T-TEST",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/T-TEST-plan.md",
      agent: "codex-edit-agent",
      startedAt: "2026-06-20T00:01:00.000Z",
    });

    expect(reused.created).toBe(false);
    expect(reused.supersededPaths).toEqual([]);
    expect(readFileSync(first.resultPath, "utf8")).toContain("status: in_progress");
  });

  it("resets lifecycle fields for a new claim while preserving the result body", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/prj-overview-plan.md",
      agent: "opencode-edit-agent",
      startedAt: "2026-06-20T00:00:00.000Z",
      targets: ["prj-0001:prj-overview"],
    });
    await updateResultStatus(resultPath, "blocked", "2026-06-20T00:01:00.000Z", "missing input");
    const before = readFileSync(resultPath, "utf8").replace(
      "_TODO_: 実施した内容",
      "前回試行の実施内容",
    );
    writeFileSync(resultPath, before, "utf8");

    await resetResultForClaim(resultPath, "codex-edit-agent", "2026-06-21T00:00:00.000Z");

    const content = readFileSync(resultPath, "utf8");
    const frontmatter = content.split("\n---")[0];
    expect(frontmatter).toContain("status: in_progress");
    expect(frontmatter).toContain('started_at: "2026-06-21T00:00:00.000Z"');
    expect(frontmatter).toContain("agent: codex-edit-agent");
    expect(frontmatter).toContain("targets:\n    - prj-0001:prj-overview");
    expect(frontmatter).not.toContain("completed_at:");
    expect(frontmatter).not.toContain("block_reason:");
    expect(content).toContain("前回試行の実施内容");
  });

  it("re-claiming a legacy human result adds execution and removes its stale plan_ref", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "T-TEST-overview-140",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/T-TEST-overview-140-plan.md",
      agent: "indie",
      startedAt: "2026-07-06T00:00:00.000Z",
      approach: "finalize",
      targets: ["prj-0001:prj-overview"],
    });

    await resetResultForClaim(resultPath, "indie", "2026-07-07T00:00:00.000Z", "human");

    const frontmatter = readFileSync(resultPath, "utf8").split("\n---")[0];
    expect(frontmatter).toContain("execution: human");
    expect(frontmatter).not.toContain("plan_ref:");
    expect(frontmatter).toContain("targets:\n    - prj-0001:prj-overview");
  });

  it("cross-deliverable-dedup は重複整理の専用 result セクションを使う", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "T-TEST-project-dedup-060",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/T-TEST-project-dedup-060-plan.md",
      agent: "codex-expert-edit-agent",
      startedAt: "2026-07-25T00:00:00.000Z",
      approach: "cross-deliverable-dedup",
      targets: ["prj-0001:overview", "prj-0001:summary"],
    });

    const body = readFileSync(resultPath, "utf8");
    expect(body).toContain("## 3. 正本へ集約した記述");
    expect(body).toContain("## 4. 要約・参照へ置き換えた重複");
    expect(body).toContain("## 5. 意図的に残した重複");
    expect(body).toContain("## 6. 維持確認");
  });

  it("scaffolds a review result with the judgement sections instead of per-viewpoint results", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "review",
      projectId: "prj-0001",
      planRef: "exec/plans/prj-overview-plan.md",
      agent: "codex-review-agent",
      startedAt: "2026-06-20T00:00:00.000Z",
    });

    const body = readFileSync(resultPath, "utf8");
    expect(body).toContain("## 1. 評価結果の確認");
    expect(body).toContain("## 2. 判断根拠");
    expect(body).toContain("## 3. 未充足事項・改善指示");
    expect(body).toContain("## 5. decision");
    expect(body).toContain("- verdict: _TODO_");
    expect(body).not.toContain("レビュー観点別結果");
    expect(body).not.toContain("RVP-");
  });

  it.each(["human", "agent"] as const)(
    "draft の %s result は human の文脈記入案内を実行種別で選ぶ",
    async (execution) => {
      const { resultPath } = await scaffoldResult({
        executionPath,
        taskId: "T-TEST-proposal-010",
        mode: "edit",
        projectId: "prj-0001",
        agent: "writer",
        startedAt: "2026-10-30T00:00:00.000Z",
        execution,
        approach: "draft",
        targets: ["prj-0001:proposal"],
      });
      const body = readFileSync(resultPath, "utf8");
      expect(parseResultTaskIdentity(body)).toMatchObject({
        execution,
        approach: "draft",
        targets: ["prj-0001:proposal"],
      });
      if (execution === "human") {
        expect(body).toContain("deliverable scaffold --project <project-id> --dct <catalog>");
        expect(body).toContain("`_CONTEXT_:` を付け");
        expect(body).toContain("claim / complete");
        expect(body).toContain("exec complete --project");
        expect(body).not.toContain("plan_ref:");
      } else {
        expect(body).not.toContain("deliverable scaffold");
      }
    },
  );

  it("approach: bootstrap-finalize は finalize result テンプレートを使いチェックリストを焼き込む", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "T-TEST-overview-140",
      mode: "edit",
      projectId: "prj-0001",
      agent: "indie",
      startedAt: "2026-07-07T00:00:00.000Z",
      execution: "human",
      approach: "bootstrap-finalize",
      targets: ["prj-0001:prj-scope", "specdojo:prj-scope-rulebook"],
      finalizeSections: {
        doneCriteriaChecklist: "- [ ] Business value is clear（BA / vp-ba-business-value）",
        targetsChecklist:
          "- [ ] 成果物: `docs/test/overview.md`\n- [ ] rulebook: `docs/ja/specdojo/rulebooks/overview-rulebook.md`",
      },
    });

    const body = readFileSync(resultPath, "utf8");
    expect(body).toContain("# Finalize Result");
    // targets は frontmatter にリストとして残り、機械的に対象文書を取得できる。
    expect(body).toContain("targets:\n    - prj-0001:prj-scope\n    - specdojo:prj-scope-rulebook");
    expect(body).toContain("execution: human");
    expect(body).not.toContain("plan_ref:");
    expect(body).toContain("[[specdojo:exec-human-finalize-recipe|Human Finalize 実行レシピ]]");
    expect(body).toContain("[[specdojo:exec-human-finalize-standard|Human Finalize 実行標準]]");
    expect(body).toContain("- [ ] Business value is clear（BA / vp-ba-business-value）");
    expect(body).toContain(
      "- [ ] 確定対象の成果物と実践の型の本文に未反映の `_CONTEXT_:` が残っていない",
    );
    expect(body).toContain("## 3. 実践の型の確認");
    expect(body).toContain("- [ ] rulebook: `docs/ja/specdojo/rulebooks/overview-rulebook.md`");
    expect(body).toContain("- judgement: _TODO_（承認 / 差し戻し）");
    // agent 向けの「進め方と実践の型の適用」節は human finalize には載せない。
    expect(body).not.toContain("進め方と実践の型の適用");
    expect(body).not.toContain("_DONE_CRITERIA_CHECKLIST_");
    expect(body).not.toContain("_FINALIZE_TARGETS_CHECKLIST_");

    expect(parseResultTaskIdentity(body)).toMatchObject({
      taskId: "T-TEST-overview-140",
      mode: "edit",
      projectId: "prj-0001",
      execution: "human",
      approach: "bootstrap-finalize",
      targets: ["prj-0001:prj-scope", "specdojo:prj-scope-rulebook"],
    });
  });

  it("targets は status 更新の再シリアライズ後も frontmatter に保持される", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "T-TEST-overview-140",
      mode: "edit",
      projectId: "prj-0001",
      agent: "indie",
      startedAt: "2026-07-07T00:00:00.000Z",
      execution: "human",
      approach: "bootstrap-finalize",
      targets: ["prj-0001:prj-scope", "specdojo:prj-scope-rulebook"],
    });

    await updateResultStatus(resultPath, "complete", "2026-07-07T01:00:00.000Z");

    const frontmatter = readFileSync(resultPath, "utf8").split("\n---")[0];
    expect(frontmatter).toContain(
      "targets:\n    - prj-0001:prj-scope\n    - specdojo:prj-scope-rulebook",
    );
    expect(frontmatter).toContain("execution: human");
    expect(frontmatter).not.toContain("plan_ref:");
    expect(frontmatter).toContain("status: complete");
  });

  it("origin: register は status 更新と再 claim の再シリアライズ後も保持される", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "PJR-0137",
      mode: "edit",
      projectId: "prj-0001",
      origin: "register",
      planRef: "exec/plans/pjr-0137-plan.md",
      agent: "codex-edit-agent",
      startedAt: "2026-07-25T00:00:00.000Z",
    });

    await updateResultStatus(resultPath, "complete", "2026-07-25T01:00:00.000Z");
    expect(readFileSync(resultPath, "utf8").split("\n---")[0]).toContain("origin: register");

    await resetResultForClaim(resultPath, "codex-edit-agent", "2026-07-25T02:00:00.000Z");
    expect(readFileSync(resultPath, "utf8").split("\n---")[0]).toContain("origin: register");
  });

  it("origin 省略時は frontmatter に origin を書かない", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "T-TEST-overview-140",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/t-test-overview-140-plan.md",
      agent: "indie",
      startedAt: "2026-07-25T00:00:00.000Z",
      targets: ["prj-0001:prj-overview"],
    });

    expect(readFileSync(resultPath, "utf8").split("\n---")[0]).not.toContain("origin:");
  });

  it("approach: finalize で sections 未解決なら _TODO_ にフォールバックする", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "T-TEST-overview-140",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/T-TEST-overview-140-plan.md",
      agent: "indie",
      startedAt: "2026-07-07T00:00:00.000Z",
      approach: "finalize",
    });

    const body = readFileSync(resultPath, "utf8");
    expect(body).toContain("# Finalize Result");
    // finalize（成果物のみ）は実践の型の確認節を持たない。
    expect(body).toContain("- [ ] 確定対象の本文に未反映の `_CONTEXT_:` が残っていない");
    expect(body).toContain("draft へ差し戻す");
    expect(body).not.toContain("## 2. 実践の型の確認");
    expect(body).not.toContain("_DONE_CRITERIA_CHECKLIST_");
    expect(body).not.toContain("_FINALIZE_TARGETS_CHECKLIST_");
    expect(body).toContain("_TODO_");
  });

  it("finalize 系でない approach は従来どおり汎用 edit テンプレートを使う", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "T-TEST-overview-010",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/T-TEST-overview-010-plan.md",
      agent: "indie",
      startedAt: "2026-07-07T00:00:00.000Z",
      approach: "bootstrap",
    });

    const body = readFileSync(resultPath, "utf8");
    expect(body).toContain("# Edit Result");
    expect(body).toContain("## 4. 進め方と実践の型の適用");
  });

  it("approach のない実行は第4章の見出しを「進め方」とし、記入指示を変える", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "PJR-0138",
      mode: "edit",
      projectId: "prj-0001",
      origin: "register",
      planRef: "exec/plans/pjr-0138-plan.md",
      agent: "codex-edit-agent",
      startedAt: "2026-07-25T00:00:00.000Z",
    });

    const body = readFileSync(resultPath, "utf8");
    expect(body).toContain("# Edit Result");
    expect(body).toContain("## 4. 進め方");
    expect(body).toContain("_TODO_: どう進めたか、根拠にした文書や規約を記入する。");
    expect(body).not.toContain("進め方と実践の型の適用");
  });

  it("treats a freshly scaffolded edit result as unfilled", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/prj-overview-plan.md",
      agent: "claude-edit-agent",
      startedAt: "2026-06-20T00:00:00.000Z",
    });

    expect(isResultUnfilled(resultPath, "edit")).toBe(true);
  });

  it("treats an edit result as filled once the mandatory sections are written", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/prj-overview-plan.md",
      agent: "claude-edit-agent",
      startedAt: "2026-06-20T00:00:00.000Z",
    });
    const scaffoldContent = readFileSync(resultPath, "utf8");
    const scaffoldFrontmatter = readResultFrontmatterSnapshot(resultPath);
    const filled = scaffoldContent
      .replace("_TODO_: 実施した内容の要約を記入する。", "組織定義を整備した。")
      .replace("_TODO_: 変更したファイルのパスを記入する。", "- docs/foo.md");
    writeFileSync(resultPath, filled, "utf8");

    expect(isResultUnfilled(resultPath, "edit", scaffoldFrontmatter)).toBe(false);
  });

  it("deterministically renders a validated edit reporter result without changing frontmatter", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/prj-overview-plan.md",
      agent: "pipeline-executor",
      startedAt: "2026-08-10T07:00:00.000Z",
    });
    const scaffoldFrontmatter = readResultFrontmatterSnapshot(resultPath);
    const output = {
      schema_version: 1 as const,
      mode: "edit" as const,
      summary: ["成果物とテストを更新した。"],
      changed_files: [{ path: "docs/test.md", summary: "記述を追加した。" }],
      handoff: [],
      approach: "plan と evidence の範囲だけを根拠にした。",
    };
    const evidence = reporterEvidence([{ path: "docs/test.md", status: "M" }]);

    await renderReporterResult(resultPath, output, evidence);
    const first = readFileSync(resultPath, "utf8");
    await renderReporterResult(resultPath, output, evidence);
    const second = readFileSync(resultPath, "utf8");

    expect(second).toBe(first);
    expect(readResultFrontmatterSnapshot(resultPath)).toEqual(scaffoldFrontmatter);
    expect(first).toContain("`docs/test.md`: 記述を追加した。");
    expect(first).toContain("## 4. 進め方\n\nplan と evidence の範囲だけを根拠にした。");
    expect(first).not.toContain("進め方と実践の型の適用");
    expect(first).not.toContain("_TODO_");
    expect(isResultUnfilled(resultPath, "edit", scaffoldFrontmatter)).toBe(false);
    expect(markdownlintErrors(first)).toEqual([]);
  });

  it("renderReporterResult は approach のある実行で第4章の見出しを「進め方と実践の型の適用」にする", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/prj-overview-plan.md",
      agent: "pipeline-executor",
      startedAt: "2026-08-10T07:00:00.000Z",
      approach: "fully-guided",
    });
    const output = {
      schema_version: 1 as const,
      mode: "edit" as const,
      summary: ["成果物を更新した。"],
      changed_files: [{ path: "docs/test.md", summary: "記述を追加した。" }],
      handoff: [],
      approach: "rulebook と recipe に沿って進めた。",
    };
    const evidence = reporterEvidence([{ path: "docs/test.md", status: "M" }]);

    await renderReporterResult(resultPath, output, evidence);
    const content = readFileSync(resultPath, "utf8");
    expect(content).toContain(
      "## 4. 進め方と実践の型の適用\n\nrulebook と recipe に沿って進めた。",
    );
  });

  it("matches descriptions by path and tolerates missing, extra, and reordered entries", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/prj-overview-plan.md",
      agent: "pipeline-executor",
      startedAt: "2026-08-10T07:00:00.000Z",
    });

    await renderReporterResult(
      resultPath,
      {
        schema_version: 1,
        mode: "edit",
        summary: ["成果物を更新した。"],
        changed_files: [
          { path: "docs/b.md", summary: "B を更新した。" },
          { path: "docs/not-in-evidence.md", summary: "未知の変更。" },
        ],
        handoff: [],
        approach: "evidence を照合した。",
      },
      reporterEvidence([
        { path: "docs/a.md", status: "M" },
        { path: "docs/b.md", status: "M" },
      ]),
    );

    const content = readFileSync(resultPath, "utf8");
    expect(content).toContain("`docs/a.md`: 変更");
    expect(content).toContain("`docs/b.md`: B を更新した。");
    expect(content.indexOf("`docs/a.md`")).toBeLessThan(content.indexOf("`docs/b.md`"));
    expect(content).not.toContain("docs/not-in-evidence.md");
    expect(markdownlintErrors(content)).toEqual([]);
  });

  it("formats undescribed changed files using git operations and line stats", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/prj-overview-plan.md",
      agent: "pipeline-executor",
      startedAt: "2026-08-10T07:00:00.000Z",
    });

    const lineStats = new Map<string, { additions: number; deletions: number }>([
      ["src/exec/run.ts", { additions: 12, deletions: 3 }],
      ["src/exec-run.ts -> src/exec/run.ts", { additions: 12, deletions: 3 }],
      ["docs/add.md", { additions: 10, deletions: 0 }],
      ["docs/del.md", { additions: 0, deletions: 45 }],
      ["src/mod.ts", { additions: 5, deletions: 2 }],
    ]);

    await renderReporterResult(
      resultPath,
      {
        schema_version: 1,
        mode: "edit",
        summary: ["成果物を更新した。"],
        changed_files: [{ path: "docs/described.md", summary: "説明済みの成果物。" }],
        handoff: [],
        approach: "evidence を照合した。",
      },
      reporterEvidence([
        { path: "docs/described.md", status: "M" },
        { path: "src/exec-run.ts -> src/exec/run.ts", status: "R" },
        { path: "docs/add.md", status: "A" },
        { path: "docs/del.md", status: "D" },
        { path: "src/mod.ts", status: "M" },
      ]),
      { lineStats },
    );

    const content = readFileSync(resultPath, "utf8");
    expect(content).toContain("`docs/described.md`: 説明済みの成果物。");
    expect(content).toContain("`src/exec/run.ts`: 名前の変更（src/exec-run.ts から）、+12 / -3 行");
    expect(content).toContain("`docs/add.md`: 追加、+10 / -0 行");
    expect(content).toContain("`docs/del.md`: 削除、+0 / -45 行");
    expect(content).toContain("`src/mod.ts`: 変更、+5 / -2 行");
    expect(markdownlintErrors(content)).toEqual([]);
  });

  it("formats undescribed changed files without line stats as fallback operations", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/prj-overview-plan.md",
      agent: "pipeline-executor",
      startedAt: "2026-08-10T07:00:00.000Z",
    });

    await renderReporterResult(
      resultPath,
      {
        schema_version: 1,
        mode: "edit",
        summary: ["成果物を更新した。"],
        changed_files: [],
        handoff: [],
        approach: "evidence を照合した。",
      },
      reporterEvidence([
        { path: "src/exec-run.ts -> src/exec/run.ts", status: "R" },
        { path: "docs/add.md", status: "??" },
        { path: "docs/del.md", status: "D" },
        { path: "src/mod.ts", status: "M" },
      ]),
    );

    const content = readFileSync(resultPath, "utf8");
    expect(content).toContain("`src/exec/run.ts`: 名前の変更（src/exec-run.ts から）");
    expect(content).toContain("`docs/add.md`: 追加");
    expect(content).toContain("`docs/del.md`: 削除");
    expect(content).toContain("`src/mod.ts`: 変更");
    expect(markdownlintErrors(content)).toEqual([]);
  });

  it("groups undescribed files by directory when changed files exceed 50", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/prj-overview-plan.md",
      agent: "pipeline-executor",
      startedAt: "2026-08-10T07:00:00.000Z",
    });

    // 55 files total: 2 described, 28 in src/exec/, 25 in tests/src/exec/
    const changes: Array<{ path: string; status: string }> = [
      { path: "src/exec/results.ts", status: "M" },
      { path: "tests/src/exec/results.test.ts", status: "M" },
    ];
    const lineStats = new Map<string, { additions: number; deletions: number }>();

    for (let i = 0; i < 28; i++) {
      const p = `src/exec/file-${i}.ts`;
      changes.push({ path: p, status: i < 5 ? "A" : "M" });
      lineStats.set(p, { additions: 10, deletions: 2 });
    }
    for (let i = 0; i < 25; i++) {
      const p = `tests/src/exec/test-${i}.test.ts`;
      changes.push({ path: p, status: "M" });
      lineStats.set(p, { additions: 4, deletions: 1 });
    }

    expect(changes.length).toBe(55);

    await renderReporterResult(
      resultPath,
      {
        schema_version: 1,
        mode: "edit",
        summary: ["成果物を更新した。"],
        changed_files: [
          { path: "src/exec/results.ts", summary: "結果描画を改善した。" },
          { path: "tests/src/exec/results.test.ts", summary: "テストを追加した。" },
        ],
        handoff: [],
        approach: "evidence を照合した。",
      },
      reporterEvidence(changes),
      { lineStats },
    );

    const content = readFileSync(resultPath, "utf8");
    // Described files are listed individually first
    expect(content).toContain("`src/exec/results.ts`: 結果描画を改善した。");
    expect(content).toContain("`tests/src/exec/results.test.ts`: テストを追加した。");

    // Undescribed files are grouped by directory
    expect(content).toContain("`src/exec/`: ほか 28 件（変更 23 件、追加 5 件、+280 / -56 行）");
    expect(content).toContain("`tests/src/exec/`: ほか 25 件（変更 25 件、+100 / -25 行）");
    expect(markdownlintErrors(content)).toEqual([]);
  });

  it("lists all files individually when changed files count is at or below threshold", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/prj-overview-plan.md",
      agent: "pipeline-executor",
      startedAt: "2026-08-10T07:00:00.000Z",
    });

    const changes = Array.from({ length: 50 }, (_, i) => ({
      path: `src/feature/file-${i}.ts`,
      status: "M",
    }));

    await renderReporterResult(
      resultPath,
      {
        schema_version: 1,
        mode: "edit",
        summary: ["成果物を更新した。"],
        changed_files: [],
        handoff: [],
        approach: "evidence を照合した。",
      },
      reporterEvidence(changes),
    );

    const content = readFileSync(resultPath, "utf8");
    // Exactly 50 files: all listed individually, no directory grouping
    expect(content).toContain("`src/feature/file-0.ts`: 変更");
    expect(content).toContain("`src/feature/file-49.ts`: 変更");
    expect(content).not.toContain("`src/feature/`: 50 件");
    expect(markdownlintErrors(content)).toEqual([]);
  });

  it("preserves an unchanged target reason from resumed executor evidence in the result", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/prj-overview-plan.md",
      agent: "pipeline-executor",
      startedAt: "2026-08-10T07:00:00.000Z",
    });
    await renderReporterResult(
      resultPath,
      {
        schema_version: 1,
        mode: "edit",
        summary: ["全対象を確認した。"],
        changed_files: [{ path: "docs/a.md", summary: "記述を更新した。" }],
        handoff: [],
        approach: "再開前後の差分と plan を照合した。",
      },
      {
        schema_version: 1,
        task_id: "prj-overview",
        run_id: "resume-1",
        stage: {
          role: "executor",
          actor: "pipeline-executor",
          status: "succeeded",
          started_at: "2026-08-10T07:00:00.000Z",
          completed_at: "2026-08-10T07:01:00.000Z",
          exit_code: 0,
          attempts: 1,
        },
        changes: [{ path: "docs/a.md", status: "M" }],
        diff_summary: { files_changed: 1, summary: "docs/a.md | 1 +" },
        validations: [],
        target_coverage: [
          {
            target: "test:doc-b",
            status: "unchanged",
            reason: "現行内容が完了条件を満たしていた。",
          },
        ],
        final_message: "全対象を確認した。",
        log_refs: [],
      },
    );

    const content = readFileSync(resultPath, "utf8");
    expect(content).toContain("対象 `test:doc-b` は未変更: 現行内容が完了条件を満たしていた。");
    expect(markdownlintErrors(content)).toEqual([]);
  });

  it.each([{ handoff: [] }, { handoff: ["人が設定案を適用する。", "reporter の補足。"] }])(
    "preserves executor handoff through reporter rendering with $handoff",
    async ({ handoff: reporterHandoff }) => {
      const { resultPath } = await scaffoldResult({
        executionPath,
        taskId: "prj-overview",
        mode: "edit",
        projectId: "prj-0001",
        planRef: "exec/plans/prj-overview-plan.md",
        agent: "pipeline-executor",
        startedAt: "2026-08-10T07:00:00.000Z",
      });
      const frontmatter = readResultFrontmatterSnapshot(resultPath);
      const { evidence } = buildExecutorEvidence({
        taskId: "prj-overview",
        runId: "handoff-run",
        actor: "pipeline-executor",
        status: "succeeded",
        startedAt: "2026-08-10T07:00:00.000Z",
        completedAt: "2026-08-10T07:01:00.000Z",
        exitCode: 0,
        attempts: 1,
        stdout: `<specdojo_executor_evidence>${JSON.stringify({
          final_message: "実装と個票を更新した。",
          handoff: ["人が設定案を適用する。", "`depends_on` の判断は利用者に確認する。"],
        })}</specdojo_executor_evidence>`,
        stderr: "",
        changes: [{ path: "docs/ticket.md", status: "M" }],
        diffStat: "docs/ticket.md | 1 +",
        logRefPath: "execution/exec/evidence/handoff-run/executor.log",
      });
      const selected = evidenceForReporter(evidence, {
        repoRoot: executionPath,
        worktreePath: executionPath,
        executionPath,
        resultPath,
        factOptions: { specdojoConfig: null },
      });
      const output = {
        schema_version: 1 as const,
        mode: "edit" as const,
        summary: ["実装を更新した。"],
        changed_files: [{ path: "docs/ticket.md", summary: "設定案と判断を記録した。" }],
        handoff: reporterHandoff,
        approach: "個票の完了条件に従った。",
      };
      await renderReporterResult(resultPath, output, selected);
      const first = readFileSync(resultPath, "utf8");
      await renderReporterResult(resultPath, output, selected);
      expect(readFileSync(resultPath, "utf8")).toBe(first);
      const handoff = first.split("## 3. 申し送り")[1].split("## 4.")[0];
      if (reporterHandoff.length > 0) expect(handoff).toContain("- reporter の補足。");
      expect(handoff.match(/人が設定案を適用する。/gu)).toHaveLength(1);
      expect(handoff).toContain("- `depends_on` の判断は利用者に確認する。");
      expect(readResultFrontmatterSnapshot(resultPath)).toEqual(frontmatter);
      expect(markdownlintErrors(first)).toEqual([]);
    },
  );

  it("adds requires_human validations to the result handoff mechanically", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/prj-overview-plan.md",
      agent: "pipeline-executor",
      startedAt: "2026-08-10T07:00:00.000Z",
    });
    const evidence = reporterEvidence([]);
    evidence.validations = [
      {
        source: "executor",
        command: "real-agent-cli --version",
        status: "requires_human",
        summary: "実 agent CLI をホスト側で起動する",
      },
    ];

    await renderReporterResult(
      resultPath,
      {
        schema_version: 1,
        mode: "edit",
        summary: ["sandbox 内の作業を完了した。"],
        changed_files: [],
        handoff: [],
        approach: "evidence を照合した。",
      },
      evidence,
    );

    const content = readFileSync(resultPath, "utf8");
    expect(content).toContain(
      "人の確認が必要: `real-agent-cli --version`（実 agent CLI をホスト側で起動する）",
    );
    expect(markdownlintErrors(content)).toEqual([]);
  });

  it("adds not_applicable validations and their reasons to the result handoff", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/prj-overview-plan.md",
      agent: "pipeline-executor",
      startedAt: "2026-08-10T07:00:00.000Z",
    });
    const evidence = reporterEvidence([]);
    evidence.validations = [
      {
        source: "executor",
        command: "npx prettier --write docs/test.md",
        status: "not_applicable",
        summary: "適用外",
        reason: "prettier が package.json の依存にない",
      },
    ];

    await renderReporterResult(
      resultPath,
      {
        schema_version: 1,
        mode: "edit",
        summary: ["適用条件を確認した。"],
        changed_files: [],
        handoff: [],
        approach: "evidence を照合した。",
      },
      evidence,
    );

    const content = readFileSync(resultPath, "utf8");
    expect(content).toContain(
      "適用外の検証: `npx prettier --write docs/test.md`（prettier が package.json の依存にない）",
    );
    expect(markdownlintErrors(content)).toEqual([]);
  });

  it("makes glob tokens in validation reasons safe without changing existing code spans", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/prj-overview-plan.md",
      agent: "pipeline-executor",
      startedAt: "2026-08-10T07:00:00.000Z",
    });
    const evidence = reporterEvidence([]);
    evidence.validations = [
      {
        source: "executor",
        command: "npm run validate:schema:file",
        status: "not_applicable",
        summary: "適用外",
        reason: "No *.yaml or *.yml files were changed; `*.md` was already code.",
      },
    ];

    await renderReporterResult(
      resultPath,
      {
        schema_version: 1,
        mode: "edit",
        summary: ["適用条件を確認した。"],
        changed_files: [],
        handoff: [],
        approach: "evidence を照合した。",
      },
      evidence,
    );

    const content = readFileSync(resultPath, "utf8");
    expect(content).toContain(
      "適用外の検証: `npm run validate:schema:file`（No `*.yaml` or `*.yml` files were changed; `*.md` was already code.）",
    );
    expect(content).not.toContain("``*.md``");
    expect(markdownlintErrors(content)).toEqual([]);
  });

  it("adds mechanically inapplicable not_run validations to the result handoff", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/prj-overview-plan.md",
      agent: "pipeline-executor",
      startedAt: "2026-08-10T07:00:00.000Z",
    });
    const evidence = reporterEvidence([]);
    evidence.validations = [
      {
        source: "executor",
        command: "npm run command-that-does-not-exist",
        status: "not_run",
        summary: "script がないため未実行",
      },
    ];

    await renderReporterResult(
      resultPath,
      {
        schema_version: 1,
        mode: "edit",
        summary: ["適用条件を確認した。"],
        changed_files: [],
        handoff: [],
        approach: "evidence を照合した。",
      },
      evidence,
    );

    const content = readFileSync(resultPath, "utf8");
    expect(content).toContain(
      "適用外の検証（runner の判定）: `npm run command-that-does-not-exist`（package.json に npm script 'command-that-does-not-exist' がない）",
    );
    expect(markdownlintErrors(content)).toEqual([]);
  });

  it("renders the review judgement sections and verdict from reporter output", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "T-TEST-doc-020",
      mode: "review",
      projectId: "prj-0001",
      planRef: "exec/plans/T-TEST-doc-020-plan.md",
      agent: "pipeline-executor",
      startedAt: "2026-08-10T07:00:00.000Z",
    });
    const output = {
      schema_version: 1 as const,
      mode: "review" as const,
      grade_check: "評価結果は最新で、grade は pass、finding は minor 1 件だった。",
      rationale: ["完了条件を満たし、minor の finding は今回の範囲外である。"],
      improvements: ["minor の finding を次回の見直しで扱う。"],
      approach: "fully-guided で求めた作成が行われたことを確認した。",
      verdict: "complete-with-findings" as const,
    };

    await renderReporterResult(resultPath, output, reporterEvidence([]));
    const content = readFileSync(resultPath, "utf8");
    expect(content).toContain("## 1. 評価結果の確認");
    expect(content).toContain("- 完了条件を満たし、minor の finding は今回の範囲外である。");
    expect(content).toContain("- minor の finding を次回の見直しで扱う。");
    expect(content).toContain("- verdict: complete-with-findings");
    expect(content).not.toContain("_TODO_");
    expect(markdownlintErrors(content)).toEqual([]);
    expect(isResultUnfilled(resultPath, "review")).toBe(false);
  });

  it("drops self-numbered prefixes from review rationale so the result passes markdownlint", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "T-TEST-doc-020",
      mode: "review",
      projectId: "prj-0001",
      planRef: "exec/plans/T-TEST-doc-020-plan.md",
      agent: "pipeline-executor",
      startedAt: "2026-08-10T07:00:00.000Z",
    });
    const output = {
      schema_version: 1 as const,
      mode: "review" as const,
      grade_check: "評価結果は最新で、grade は pass だった。",
      rationale: [
        "1. 完了条件の 1 つ目を満たす。",
        "2. 完了条件の 2 つ目を満たす。",
        "3) 1.5 倍の余裕を残している。",
      ],
      improvements: ["- 2. 次回の見直しで扱う。"],
      approach: "fully-guided で求めた作成が行われたことを確認した。",
      verdict: "complete" as const,
    };

    await renderReporterResult(resultPath, output, reporterEvidence([]));
    const content = readFileSync(resultPath, "utf8");

    expect(content).toContain(
      "- 完了条件の 1 つ目を満たす。\n- 完了条件の 2 つ目を満たす。\n- 1.5 倍の余裕を残している。",
    );
    expect(content).toContain("## 3. 未充足事項・改善指示\n\n- 次回の見直しで扱う。");
    expect(markdownlintErrors(content)).toEqual([]);
  });

  it("drops self-numbered prefixes from edit summary and handoff so the result passes markdownlint", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/prj-overview-plan.md",
      agent: "pipeline-executor",
      startedAt: "2026-08-10T07:00:00.000Z",
    });
    const output = {
      schema_version: 1 as const,
      mode: "edit" as const,
      summary: ["1. 成果物を更新した。", "2) 表を整えた。"],
      changed_files: [{ path: "docs/test.md", summary: "記述を追加した。" }],
      handoff: ["3. 次の版で見直す。"],
      approach: "rulebook に沿って進めた。",
    };

    await renderReporterResult(
      resultPath,
      output,
      reporterEvidence([{ path: "docs/test.md", status: "M" }]),
    );
    const content = readFileSync(resultPath, "utf8");

    expect(content).toContain("## 1. 実施内容\n\n- 成果物を更新した。\n- 表を整えた。");
    expect(content).toContain("## 3. 申し送り\n\n- 次の版で見直す。");
    expect(markdownlintErrors(content)).toEqual([]);
  });

  it.each([
    ["必須項目の欠落", "  task_id: prj-overview\n", ""],
    ["必須項目の空値", "  project_id: prj-0001", '  project_id: ""'],
    ["scaffold 値の改変", "  agent: claude-edit-agent", "  agent: local-edit-agent"],
    [
      "scaffold にない項目の追加",
      "  agent: claude-edit-agent",
      "  agent: claude-edit-agent\n  summary: custom",
    ],
  ])("frontmatter の%sを未完了として扱う", async (_label, from, to) => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/prj-overview-plan.md",
      agent: "claude-edit-agent",
      startedAt: "2026-06-20T00:00:00.000Z",
    });
    const scaffoldContent = readFileSync(resultPath, "utf8");
    const scaffoldFrontmatter = readResultFrontmatterSnapshot(resultPath);
    const changed = scaffoldContent
      .replace("_TODO_: 実施した内容の要約を記入する。", "組織定義を整備した。")
      .replace("_TODO_: 変更したファイルのパスを記入する。", "- docs/foo.md")
      .replace(from, to);
    writeFileSync(resultPath, changed, "utf8");

    expect(isResultUnfilled(resultPath, "edit", scaffoldFrontmatter)).toBe(true);
  });

  it("specdojo 名前空間を独自 frontmatter に置換した result を未完了として扱う", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/prj-overview-plan.md",
      agent: "claude-edit-agent",
      startedAt: "2026-06-20T00:00:00.000Z",
    });
    const scaffoldContent = readFileSync(resultPath, "utf8");
    const scaffoldFrontmatter = readResultFrontmatterSnapshot(resultPath);
    const body = scaffoldContent
      .slice(scaffoldContent.indexOf("# Edit Result"))
      .replace("_TODO_: 実施した内容の要約を記入する。", "組織定義を整備した。")
      .replace("_TODO_: 変更したファイルのパスを記入する。", "- docs/foo.md");
    writeFileSync(resultPath, `---\nresult: done\n---\n\n${body}`, "utf8");

    expect(isResultUnfilled(resultPath, "edit", scaffoldFrontmatter)).toBe(true);
  });

  it("YAML の表記だけが変わった frontmatter は scaffold と一致していると扱う", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/prj-overview-plan.md",
      agent: "claude-edit-agent",
      startedAt: "2026-06-20T00:00:00.000Z",
    });
    const scaffoldContent = readFileSync(resultPath, "utf8");
    const scaffoldFrontmatter = readResultFrontmatterSnapshot(resultPath);
    const changed = scaffoldContent
      .replace("agent: claude-edit-agent", 'agent: "claude-edit-agent"')
      .replace("_TODO_: 実施した内容の要約を記入する。", "組織定義を整備した。")
      .replace("_TODO_: 変更したファイルのパスを記入する。", "- docs/foo.md");
    writeFileSync(resultPath, changed, "utf8");

    expect(isResultUnfilled(resultPath, "edit", scaffoldFrontmatter)).toBe(false);
  });

  it("rate-limit 後の runner 管理 lifecycle 差分を許容して resume の完了を認識する", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/prj-overview-plan.md",
      agent: "claude-edit-agent",
      startedAt: "2026-06-20T00:00:00.000Z",
    });
    const originalScaffold = readResultFrontmatterSnapshot(resultPath);
    await updateResultStatus(
      resultPath,
      "blocked",
      "2026-06-20T00:05:00.000Z",
      "rate limit reached",
    );
    const resumeScaffold = readResultFrontmatterSnapshot(resultPath);
    const filled = readFileSync(resultPath, "utf8")
      .replace("_TODO_: 実施した内容の要約を記入する。", "再開後に処理を完了した。")
      .replace("_TODO_: 変更したファイルのパスを記入する。", "- docs/foo.md");
    writeFileSync(resultPath, filled, "utf8");

    expect(isResultUnfilled(resultPath, "edit", resumeScaffold, originalScaffold)).toBe(false);
  });

  it("前回試行から持ち越された不変 frontmatter の改変は resume 後も拒否する", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/prj-overview-plan.md",
      agent: "claude-edit-agent",
      startedAt: "2026-06-20T00:00:00.000Z",
    });
    const originalScaffold = readResultFrontmatterSnapshot(resultPath);
    const corrupted = readFileSync(resultPath, "utf8").replace(
      "project_id: prj-0001",
      "project_id: prj-corrupted",
    );
    writeFileSync(resultPath, corrupted, "utf8");
    await updateResultStatus(
      resultPath,
      "blocked",
      "2026-06-20T00:05:00.000Z",
      "rate limit reached",
    );
    const resumeScaffold = readResultFrontmatterSnapshot(resultPath);
    const filled = readFileSync(resultPath, "utf8")
      .replace("_TODO_: 実施した内容の要約を記入する。", "再開後に処理を完了した。")
      .replace("_TODO_: 変更したファイルのパスを記入する。", "- docs/foo.md");
    writeFileSync(resultPath, filled, "utf8");

    expect(isResultUnfilled(resultPath, "edit", resumeScaffold, originalScaffold)).toBe(true);
  });

  it("approach と targets の scaffold 値を改変した result を未完了として扱う", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "T-TEST-overview-010",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/T-TEST-overview-010-plan.md",
      agent: "claude-edit-agent",
      startedAt: "2026-06-20T00:00:00.000Z",
      approach: "fully-guided",
      targets: ["prj-0001:prj-overview", "specdojo:prj-overview-rulebook"],
    });
    const scaffoldContent = readFileSync(resultPath, "utf8");
    const scaffoldFrontmatter = readResultFrontmatterSnapshot(resultPath);
    const changed = scaffoldContent
      .replace("approach: fully-guided", "approach: freeform")
      .replace("specdojo:prj-overview-rulebook", "specdojo:prj-overview-recipe")
      .replace("_TODO_: 実施した内容の要約を記入する。", "組織定義を整備した。")
      .replace("_TODO_: 変更したファイルのパスを記入する。", "- docs/foo.md");
    writeFileSync(resultPath, changed, "utf8");

    expect(isResultUnfilled(resultPath, "edit", scaffoldFrontmatter)).toBe(true);
  });

  it("treats a review result with an undecided verdict as unfilled", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "review",
      projectId: "prj-0001",
      planRef: "exec/plans/prj-overview-plan.md",
      agent: "claude-review-agent",
      startedAt: "2026-06-20T00:00:00.000Z",
    });

    expect(isResultUnfilled(resultPath, "review")).toBe(true);

    const decided = readFileSync(resultPath, "utf8").replace(
      /verdict: _TODO_[^\n]*/,
      "verdict: incomplete",
    );
    writeFileSync(resultPath, decided, "utf8");

    expect(isResultUnfilled(resultPath, "review")).toBe(false);
  });

  it("still treats a review result scaffolded before the verdict revision as unfilled", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "review",
      projectId: "prj-0001",
      planRef: "exec/plans/prj-overview-plan.md",
      agent: "claude-review-agent",
      startedAt: "2026-06-20T00:00:00.000Z",
    });
    // 改訂前の xrr-template.md は decision に recommendation を置いていた。
    const legacy = readFileSync(resultPath, "utf8").replace(
      /verdict: _TODO_[^\n]*/,
      "recommendation: _TODO_（approve / revise / reject）",
    );
    writeFileSync(resultPath, legacy, "utf8");

    expect(isResultUnfilled(resultPath, "review")).toBe(true);
  });

  it("returns false for a missing result path", () => {
    expect(isResultUnfilled(join(executionPath, "nope-result.md"), "edit")).toBe(false);
  });

  it("scaffold 後に result 自体が削除された場合は未完了として扱う", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/prj-overview-plan.md",
      agent: "claude-edit-agent",
      startedAt: "2026-06-20T00:00:00.000Z",
    });
    const scaffoldFrontmatter = readResultFrontmatterSnapshot(resultPath);
    rmSync(resultPath);

    expect(isResultUnfilled(resultPath, "edit", scaffoldFrontmatter)).toBe(true);
  });

  it("uses the stem for the result file name and doc id while keeping task_id", async () => {
    const stem = "prj-overview-20260620t125519z-0328";
    const { resultPath, created } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      stem,
      mode: "review",
      projectId: "prj-0001",
      planRef: `exec/plans/${stem}-plan.md`,
      agent: "codex-review-agent",
      startedAt: "2026-06-20T00:00:00.000Z",
    });

    expect(created).toBe(true);
    expect(resultPath.endsWith(`${stem}-result.md`)).toBe(true);
    const frontmatter = readFileSync(resultPath, "utf8").split("\n---")[0];
    // id is unique per stem (no doc-index collision); task_id stays the bare task id.
    expect(frontmatter).toContain(`id: prj-0001:xrr-${stem}`);
    expect(frontmatter).toContain("task_id: prj-overview");
    expect(frontmatter).toContain(`plan_ref: exec/plans/${stem}-plan.md`);
  });
});
