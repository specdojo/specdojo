import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  isResultUnfilled,
  readResultFrontmatterSnapshot,
  parseResultTaskIdentity,
  resetResultForClaim,
  scaffoldResult,
  updateResultStatus,
} from "../../src/exec-results.js";

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

  it("escapes embedded double quotes in block_reason to keep frontmatter valid", async () => {
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
      'cannot read "config.yaml"',
    );

    const frontmatter = readFileSync(resultPath, "utf8").split("\n---")[0];
    expect(frontmatter).toContain("block_reason: \"cannot read 'config.yaml'\"");
    expect(frontmatter).not.toContain('""');
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

  it("expands the review result sections placeholder when reviewSections is provided", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "review",
      projectId: "prj-0001",
      planRef: "exec/plans/prj-overview-plan.md",
      agent: "codex-review-agent",
      startedAt: "2026-06-20T00:00:00.000Z",
      reviewSections: "### RVP-001（BA: vp-ba-business-value）\n\n**確認基準**: x",
    });

    const body = readFileSync(resultPath, "utf8");
    expect(body).toContain("### RVP-001（BA: vp-ba-business-value）");
    expect(body).not.toContain("_REVIEW_RESULT_SECTIONS_");
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

  it("falls back to a language-neutral _TODO_ marker when a review result has no reviewSections", async () => {
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
    // The placeholder is replaced; no Japanese fallback prose is hardcoded in code.
    expect(body).not.toContain("_REVIEW_RESULT_SECTIONS_");
    expect(body).toContain("## 1. レビュー観点別結果");
  });

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

  it("treats a review result with an undecided recommendation as unfilled", async () => {
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
      "recommendation: _TODO_",
      "recommendation: approve",
    );
    writeFileSync(resultPath, decided, "utf8");

    expect(isResultUnfilled(resultPath, "review")).toBe(false);
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
