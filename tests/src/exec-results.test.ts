import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { isResultUnfilled, scaffoldResult, updateResultStatus } from "../../src/exec-results.js";

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
      planRef: "exec/plans/T-TEST-overview-140-plan.md",
      agent: "indie",
      startedAt: "2026-07-07T00:00:00.000Z",
      approach: "bootstrap-finalize",
      targets: ["prj-0001:prj-scope", "prj-scope-rulebook"],
      finalizeSections: {
        doneCriteriaChecklist: "- [ ] Business value is clear（BA / vp-ba-business-value）",
        targetsChecklist:
          "- [ ] 成果物: `docs/test/overview.md`\n- [ ] rulebook: `docs/ja/specdojo/rulebooks/overview-rulebook.md`",
      },
    });

    const body = readFileSync(resultPath, "utf8");
    expect(body).toContain("# Finalize Result");
    // targets は frontmatter にリストとして残り、機械的に対象文書を取得できる。
    expect(body).toContain("targets:\n    - prj-0001:prj-scope\n    - prj-scope-rulebook");
    expect(body).toContain("- [ ] Business value is clear（BA / vp-ba-business-value）");
    expect(body).toContain("## 2. 参考資料の確認");
    expect(body).toContain("- [ ] rulebook: `docs/ja/specdojo/rulebooks/overview-rulebook.md`");
    expect(body).toContain("- judgement: _TODO_（承認 / 差し戻し）");
    // agent 向けの「参考資料の活用」節は human finalize には載せない。
    expect(body).not.toContain("参考資料の活用");
    expect(body).not.toContain("_DONE_CRITERIA_CHECKLIST_");
    expect(body).not.toContain("_FINALIZE_TARGETS_CHECKLIST_");
  });

  it("targets は status 更新の再シリアライズ後も frontmatter に保持される", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "T-TEST-overview-140",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/T-TEST-overview-140-plan.md",
      agent: "indie",
      startedAt: "2026-07-07T00:00:00.000Z",
      approach: "bootstrap-finalize",
      targets: ["prj-0001:prj-scope", "prj-scope-rulebook"],
    });

    await updateResultStatus(resultPath, "complete", "2026-07-07T01:00:00.000Z");

    const frontmatter = readFileSync(resultPath, "utf8").split("\n---")[0];
    expect(frontmatter).toContain("targets:\n    - prj-0001:prj-scope\n    - prj-scope-rulebook");
    expect(frontmatter).toContain("status: complete");
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
    // finalize（成果物のみ）は参考資料の確認節を持たない。
    expect(body).not.toContain("## 2. 参考資料の確認");
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
    expect(body).toContain("## 4. 参考資料の活用");
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
    const filled = readFileSync(resultPath, "utf8")
      .replace("_TODO_: 実施した内容の要約を記入する。", "組織定義を整備した。")
      .replace("_TODO_: 変更したファイルのパスを記入する。", "- docs/foo.md");
    writeFileSync(resultPath, filled, "utf8");

    expect(isResultUnfilled(resultPath, "edit")).toBe(false);
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
