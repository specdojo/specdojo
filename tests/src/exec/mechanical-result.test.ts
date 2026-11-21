import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { lint } from "markdownlint/sync";
import { load } from "js-yaml";
import type { ExecEvidence } from "../../../src/exec/evidence.js";
import {
  MECHANICAL_RESULT_APPROACH,
  mechanicalEditReporterOutput,
} from "../../../src/exec/mechanical-result.js";
import { parseReporterOutput } from "../../../src/exec/reporter-output.js";
import {
  isResultUnfilled,
  readResultFrontmatterSnapshot,
  renderReporterResult,
  scaffoldResult,
} from "../../../src/exec/results.js";
import { specdojoRootDir } from "../../../src/shared/specdojo-config.js";

function evidence(overrides: Partial<ExecEvidence> = {}): ExecEvidence {
  return {
    schema_version: 1,
    task_id: "prj-overview",
    run_id: "run-1",
    stage: {
      role: "executor",
      actor: "pipeline-executor",
      status: "succeeded",
      started_at: "2026-11-14T07:00:00.000Z",
      completed_at: "2026-11-14T07:01:00.000Z",
      exit_code: 0,
      attempts: 1,
    },
    changes: [{ path: "docs/test.md", status: "M" }],
    diff_summary: { files_changed: 1, summary: "" },
    validations: [],
    final_message: "- 設計書を更新した。\n- 個票の対応結果を書いた。",
    handoff: ["保護された設定の変更案を個票に書いた。"],
    log_refs: [],
    ...overrides,
  };
}

function markdownlintErrors(content: string): unknown[] {
  const parsed = load(readFileSync(join(specdojoRootDir(), ".markdownlint.yaml"), "utf8"));
  const config =
    typeof parsed === "object" && parsed !== null ? (parsed as Record<string, unknown>) : {};
  return lint({ strings: { result: content }, config }).result ?? [];
}

describe("mechanicalEditReporterOutput", () => {
  it("fills the edit output from final_message and passes the reporter JSON Schema", () => {
    const output = mechanicalEditReporterOutput(evidence());

    expect(output).toEqual({
      schema_version: 1,
      mode: "edit",
      summary: ["設計書を更新した。", "個票の対応結果を書いた。"],
      changed_files: [],
      handoff: [],
      approach: MECHANICAL_RESULT_APPROACH,
    });
    expect(parseReporterOutput(JSON.stringify(output), "edit")).toEqual({ output });
  });

  it("leaves review mode, blocked runs and an empty final_message to the reporter", () => {
    expect(mechanicalEditReporterOutput(evidence(), "review")).toBeUndefined();
    expect(mechanicalEditReporterOutput(evidence({ final_message: " \n" }))).toBeUndefined();
    expect(
      mechanicalEditReporterOutput(evidence({ completion_status: "incomplete" })),
    ).toBeUndefined();
    expect(
      mechanicalEditReporterOutput(
        evidence({
          validations: [
            {
              id: "test-unit",
              source: "runner",
              command: "npm run test:unit",
              status: "failed",
              summary: "exit 1",
            },
          ],
        }),
      ),
    ).toBeUndefined();
  });
});

describe("mechanical result rendering", () => {
  let executionPath: string;

  beforeEach(() => {
    executionPath = join(mkdtempSync(join(tmpdir(), "specdojo-mechanical-result-")), "execution");
  });

  afterEach(() => {
    rmSync(dirname(executionPath), { recursive: true, force: true });
  });

  it("renders a filled result that keeps the frontmatter and passes markdownlint", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath,
      taskId: "prj-overview",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/prj-overview-plan.md",
      agent: "pipeline-executor",
      startedAt: "2026-11-14T07:00:00.000Z",
    });
    const scaffoldFrontmatter = readResultFrontmatterSnapshot(resultPath);
    const source = evidence();
    const output = mechanicalEditReporterOutput(source);
    if (!output) throw new Error("expected a mechanical output");

    await renderReporterResult(resultPath, output, source);
    const content = readFileSync(resultPath, "utf8");

    expect(readResultFrontmatterSnapshot(resultPath)).toEqual(scaffoldFrontmatter);
    expect(content).toContain("- 設計書を更新した。");
    expect(content).toContain("`docs/test.md`");
    expect(content).toContain("- 保護された設定の変更案を個票に書いた。");
    expect(content).toContain("`pipeline.mechanical_result`");
    expect(content).not.toContain("_TODO_");
    expect(isResultUnfilled(resultPath, "edit", scaffoldFrontmatter)).toBe(false);
    expect(markdownlintErrors(content)).toEqual([]);
  });
});
