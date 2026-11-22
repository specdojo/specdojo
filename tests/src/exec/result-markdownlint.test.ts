import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import type { ExecEvidence } from "../../../src/exec/evidence.js";
import type { EditReporterOutput } from "../../../src/exec/reporter-output.js";
import { runReporterWithFormatRetry } from "../../../src/exec/reporter.js";
import {
  lintResultMarkdown,
  resultMarkdownlintValidator,
} from "../../../src/exec/result-markdownlint.js";
import { scaffoldResult } from "../../../src/exec/results.js";
import { specdojoRootDir } from "../../../src/shared/specdojo-config.js";

function evidence(): ExecEvidence {
  return {
    schema_version: 1,
    task_id: "T-TEST-doc-010",
    run_id: "run-1",
    stage: {
      role: "executor",
      actor: "pipeline-executor",
      status: "succeeded",
      started_at: "2026-11-22T07:00:00.000Z",
      completed_at: "2026-11-22T07:01:00.000Z",
      exit_code: 0,
      attempts: 1,
    },
    changes: [{ path: "docs/test.md", status: "M" }],
    diff_summary: { files_changed: 1, summary: "" },
    validations: [],
    final_message: "文書を更新した。",
    log_refs: [],
  };
}

function output(overrides: Partial<EditReporterOutput> = {}): EditReporterOutput {
  return {
    schema_version: 1,
    mode: "edit",
    summary: ["文書を更新した。"],
    changed_files: [{ path: "docs/test.md", summary: "内容を追加した。" }],
    handoff: [],
    approach: "plan と evidence を照合した。",
    ...overrides,
  };
}

// The repository root carries .markdownlint.yaml and the docs-lint Chinese glyph rule.
const repoRoot = specdojoRootDir();

describe("resultMarkdownlintValidator", () => {
  let executionPath: string;
  let resultPath: string;

  beforeEach(async () => {
    executionPath = join(mkdtempSync(join(tmpdir(), "specdojo-result-lint-")), "execution");
    ({ resultPath } = await scaffoldResult({
      executionPath,
      taskId: "T-TEST-doc-010",
      mode: "edit",
      projectId: "prj-0001",
      planRef: "exec/plans/t-test-doc-010-plan.md",
      agent: "pipeline-executor",
      startedAt: "2026-11-22T07:00:00.000Z",
    }));
  });

  afterEach(() => {
    rmSync(dirname(executionPath), { recursive: true, force: true });
  });

  function validate(reporterOutput: EditReporterOutput): Promise<string | undefined> {
    const validator = resultMarkdownlintValidator({ repoRoot, resultPath, evidence: evidence() });
    if (!validator) throw new Error("expected a validator for an existing result path");
    return validator(reporterOutput);
  }

  it("accepts plain reporter prose without writing the result", async () => {
    const before = readFileSync(resultPath, "utf8");

    await expect(validate(output())).resolves.toBeUndefined();
    expect(readFileSync(resultPath, "utf8")).toBe(before);
  });

  it.each([
    {
      name: "a heading inside a bullet that ends with a full stop",
      overrides: { summary: ["### 確認した内容。", "#### 詳細。"] },
      rules: ["MD022", "MD026"],
      line: "- ### 確認した内容。",
    },
    {
      name: "a bare URL",
      overrides: { approach: "詳細は https://example.com/report を見た。" },
      rules: ["MD034"],
      line: "詳細は https://example.com/report を見た。",
    },
    {
      name: "a heading and a code block collapsed into one line",
      overrides: { approach: "### 結果\n```text\nnpm run lint:md\n```" },
      rules: ["MD038"],
      line: "### 結果 ```text npm run lint:md ```",
    },
    {
      name: "escaped backticks mixed with a code span",
      overrides: { summary: ["`npm test` と \\\\` npm run lint\\\\` を通した。"] },
      rules: ["MD038"],
      line: "- `npm test` と \\\\` npm run lint\\\\` を通した。",
    },
    {
      name: "a simplified Chinese glyph",
      overrides: { summary: ["一个の確認をした。"] },
      rules: ["MD061"],
      line: "- 一个の確認をした。",
    },
  ])("reports the rule and rendered line for $name", async ({ overrides, rules, line }) => {
    const message = await validate(output(overrides));

    expect(message).toMatch(/^result Markdown notation violation before writing/);
    for (const rule of rules) expect(message).toMatch(new RegExp(`line \\d+ ${rule}/`));
    expect(message).toContain(JSON.stringify(line));
  });

  it("returns no validator when the result path is unavailable", () => {
    expect(
      resultMarkdownlintValidator({ repoRoot, resultPath: undefined, evidence: evidence() }),
    ).toBeUndefined();
  });
});

describe("lintResultMarkdown", () => {
  it("ignores trailing whitespace that the commit check normalizes", async () => {
    const issues = await lintResultMarkdown(
      repoRoot,
      join(repoRoot, "tmp", "result.md"),
      "# 結果  \n\n本文。  \n\n\n",
    );

    expect(issues).toEqual([]);
  });
});

describe("runReporterWithFormatRetry with the result lint", () => {
  const badOutput = output({ approach: "詳細は https://example.com/report を見た。" });

  it("asks the reporter to rewrite with the violation and accepts the corrected output", async () => {
    const prompts: string[] = [];
    const outputs = [badOutput, output()];

    const outcome = await runReporterWithFormatRetry({
      plan: "# Plan",
      evidence: evidence(),
      mode: "edit",
      validateOutput: async (candidate) =>
        candidate.approach.includes("https://")
          ? "line 30 MD034/no-bare-urls Bare URL used"
          : undefined,
      invoke: async (prompt) => {
        prompts.push(prompt);
        return {
          result: "success",
          stdout: JSON.stringify(outputs[prompts.length - 1]),
          stderr: "",
        };
      },
    });

    expect(outcome).toMatchObject({ result: "success", formatAttempts: 2, output: output() });
    expect(prompts[1]).toContain(
      "The previous response failed validation: line 30 MD034/no-bare-urls Bare URL used",
    );
  });

  it("fails with the violation after the same format attempt limit", async () => {
    let calls = 0;

    const outcome = await runReporterWithFormatRetry({
      plan: "# Plan",
      evidence: evidence(),
      mode: "edit",
      validateOutput: async () => "line 30 MD034/no-bare-urls Bare URL used",
      invoke: async () => {
        calls++;
        return { result: "success", stdout: JSON.stringify(badOutput), stderr: "" };
      },
    });

    expect(calls).toBe(3);
    expect(outcome).toMatchObject({
      result: "failure",
      formatAttempts: 3,
      reason:
        "reporter output invalid after 3 format attempts: line 30 MD034/no-bare-urls Bare URL used",
    });
  });
});
