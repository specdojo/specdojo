import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "js-yaml";
import Ajv2020Module from "ajv/dist/2020.js";
import { describe, expect, it } from "vitest";
import type { ExecEvidence } from "../../src/exec-evidence.js";
import {
  buildReporterPrompt,
  parseReporterOutput,
  runReporterWithFormatRetry,
} from "../../src/exec-reporter.js";

const Ajv2020 = Ajv2020Module.default;

function evidence(): ExecEvidence {
  return {
    schema_version: 1,
    task_id: "T-TEST-doc-010",
    run_id: "run-1",
    stage: {
      role: "executor",
      actor: "executor",
      status: "succeeded",
      started_at: "2026-08-10T07:00:00.000Z",
      completed_at: "2026-08-10T07:01:00.000Z",
      exit_code: 0,
      attempts: 1,
    },
    changes: [{ path: "docs/test.md", status: "M" }],
    diff_summary: { files_changed: 1, summary: "docs/test.md | 2 ++" },
    validations: [{ command: "npm test", status: "passed", summary: "10 tests passed" }],
    final_message: "updated the document",
    log_refs: [
      {
        kind: "agent-output-excerpt",
        path: "execution/exec/evidence/T-TEST-doc-010/run-1/executor.log",
        bytes: 100,
        truncated: false,
      },
    ],
  };
}

const validEditOutput = {
  schema_version: 1,
  mode: "edit",
  outcome: "complete",
  summary: ["文書を更新した。"],
  changed_files: [{ path: "docs/test.md", summary: "内容を追加した。" }],
  handoff: [],
  approach: "plan と evidence を照合した。",
  block_reason: "",
} as const;

const validReviewOutput = {
  schema_version: 1,
  mode: "review",
  outcome: "complete",
  viewpoint_results: [
    {
      id: "RVP-001",
      result: "pass",
      evidence: ["検証が成功した。"],
      notes: "",
    },
  ],
  findings: [],
  approach: "done criteria と evidence を照合した。",
  recommendation: "approve",
  block_reason: "",
} as const;

describe("reporter structured output", () => {
  it("accepts the strict edit shape and rejects additional properties", () => {
    expect(parseReporterOutput(JSON.stringify(validEditOutput), "edit").output).toEqual(
      validEditOutput,
    );
    expect(
      parseReporterOutput(JSON.stringify({ ...validEditOutput, commentary: "extra" }), "edit")
        .error,
    ).toMatch(/additional properties/);
    expect(
      parseReporterOutput(`\`\`\`json\n${JSON.stringify(validEditOutput)}\n\`\`\``, "edit").error,
    ).toMatch(/single JSON value/);
  });

  it("keeps the published JSON schema aligned with valid reporter output", () => {
    const schemaPath = join(
      dirname(fileURLToPath(import.meta.url)),
      "..",
      "..",
      "docs",
      "specdojo",
      "schemas",
      "v1",
      "exec-reporter-output.schema.yaml",
    );
    const schema = load(readFileSync(schemaPath, "utf8")) as Record<string, unknown>;
    const validate = new Ajv2020({ allErrors: true, strict: true }).compile(schema);
    expect(validate(validEditOutput), JSON.stringify(validate.errors)).toBe(true);
    expect(validate(validReviewOutput), JSON.stringify(validate.errors)).toBe(true);
    expect(parseReporterOutput(JSON.stringify(validReviewOutput), "review").output).toEqual(
      validReviewOutput,
    );
  });

  it("passes only plan, bounded evidence, and schema to the reporter", () => {
    const prompt = buildReporterPrompt({
      plan: "# Plan\n\nDo the work.",
      evidence: evidence(),
      mode: "edit",
    });

    expect(prompt).toContain("<specdojo_plan>");
    expect(prompt).toContain('"diff_summary"');
    expect(prompt).toContain("<specdojo_reporter_output_schema");
    expect(prompt).not.toContain("raw_diff");
    expect(prompt).not.toContain("executor log body");
  });

  it("retries only the reporter after a format error and reuses the same evidence", async () => {
    const prompts: string[] = [];
    const invoke = async (prompt: string) => {
      prompts.push(prompt);
      return {
        result: "success" as const,
        stdout: prompts.length === 1 ? "not-json" : JSON.stringify(validEditOutput),
        stderr: "",
      };
    };

    const outcome = await runReporterWithFormatRetry({
      plan: "# Plan",
      evidence: evidence(),
      mode: "edit",
      invoke,
    });

    expect(outcome.result).toBe("success");
    expect(prompts).toHaveLength(2);
    expect(prompts[1]).toContain("previous response failed validation");
    const evidenceBlocks = prompts.map(
      (prompt) =>
        prompt.match(
          /<specdojo_executor_evidence>\n([\s\S]*?)\n<\/specdojo_executor_evidence>/,
        )?.[1],
    );
    expect(evidenceBlocks[1]).toBe(evidenceBlocks[0]);
  });

  it("stops after the bounded reporter format attempts", async () => {
    let calls = 0;
    const outcome = await runReporterWithFormatRetry({
      plan: "# Plan",
      evidence: evidence(),
      mode: "edit",
      invoke: async () => {
        calls++;
        return { result: "success", stdout: "{}", stderr: "" };
      },
    });

    expect(outcome).toMatchObject({ result: "failure", formatAttempts: 3 });
    expect(calls).toBe(3);
  });
});
