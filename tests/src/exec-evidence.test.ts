import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "js-yaml";
import Ajv2020Module from "ajv/dist/2020.js";
import addFormatsModule from "ajv-formats";
import { describe, expect, it } from "vitest";
import {
  buildExecutorEvidence,
  parseExecutorReport,
  redactSensitiveText,
} from "../../src/exec-evidence.js";

const Ajv2020 = Ajv2020Module.default;
const addFormats = addFormatsModule.default;

describe("executor evidence", () => {
  it("parses the bounded executor report and redacts credentials", () => {
    const stdout = [
      "tool chatter",
      "<specdojo_executor_evidence>",
      JSON.stringify({
        final_message: "done; api_key=super-secret-value",
        validations: [{ command: "npm test", status: "passed", summary: "42 tests passed" }],
      }),
      "</specdojo_executor_evidence>",
    ].join("\n");

    expect(parseExecutorReport(stdout)).toEqual({
      finalMessage: "done; api_key=[REDACTED]",
      validations: [
        {
          source: "executor",
          command: "npm test",
          status: "passed",
          summary: "42 tests passed",
        },
      ],
    });
    expect(redactSensitiveText("Authorization: Bearer abc.def.ghi")).not.toContain("abc.def.ghi");
  });

  it("builds schema-valid run-scoped evidence without raw diffs or secrets", () => {
    const stdout = [
      "api_key=do-not-store",
      "<specdojo_executor_evidence>",
      JSON.stringify({
        final_message: "artifact updated",
        validations: [{ command: "npm test", status: "passed", summary: "ok" }],
      }),
      "</specdojo_executor_evidence>",
    ].join("\n");

    const { evidence, logExcerpt } = buildExecutorEvidence({
      taskId: "T-TEST-doc-010",
      runId: "20260810T070334Z-aabbccdd",
      actor: "executor",
      status: "succeeded",
      startedAt: "2026-08-10T07:03:34Z",
      completedAt: "2026-08-10T07:04:34Z",
      exitCode: 0,
      attempts: 1,
      stdout,
      stderr: "",
      changes: [{ path: "artifact.md", status: "M" }],
      diffStat: " artifact.md | 2 +-",
      logRefPath:
        "docs/execution/exec/evidence/T-TEST-doc-010/20260810T070334Z-aabbccdd/executor.log",
      parentValidations: [
        {
          id: "test-integration",
          source: "runner",
          command: "npm run test:integration",
          status: "passed",
          summary: "exit 0: 66 tests passed",
        },
      ],
    });

    expect(evidence.changes).toContainEqual({ path: "artifact.md", status: "M" });
    expect(evidence.diff_summary.files_changed).toBe(1);
    expect(evidence.final_message).toBe("artifact updated");
    expect(evidence.validations).toEqual([
      { source: "executor", command: "npm test", status: "passed", summary: "ok" },
      {
        id: "test-integration",
        source: "runner",
        command: "npm run test:integration",
        status: "passed",
        summary: "exit 0: 66 tests passed",
      },
    ]);
    expect(evidence.log_refs[0].path).toContain("/exec/evidence/T-TEST-doc-010/");
    expect(JSON.stringify(evidence)).not.toContain("do-not-store");
    expect(logExcerpt).not.toContain("do-not-store");

    const schemaPath = join(
      dirname(fileURLToPath(import.meta.url)),
      "..",
      "..",
      "docs",
      "specdojo",
      "schemas",
      "v1",
      "exec-evidence.schema.yaml",
    );
    const schema = load(readFileSync(schemaPath, "utf8")) as Record<string, unknown>;
    const ajv = new Ajv2020({ allErrors: true, strict: false });
    addFormats(ajv);
    const validate = ajv.compile(schema);
    expect(validate(evidence), JSON.stringify(validate.errors)).toBe(true);
  });

  it("bounds change, validation, final-message, and log payload sizes", () => {
    const validations = Array.from({ length: 55 }, (_, index) => ({
      command: `check-${index}`,
      status: "passed",
      summary: "ok",
    }));
    const stdout = [
      "x".repeat(70_000),
      "<specdojo_executor_evidence>",
      JSON.stringify({ final_message: "m".repeat(5_000), validations }),
      "</specdojo_executor_evidence>",
    ].join("\n");
    const changes = Array.from({ length: 1_005 }, (_, index) => ({
      path: `artifact-${index}.md`,
      status: "M",
    }));

    const { evidence, logExcerpt } = buildExecutorEvidence({
      taskId: "T-TEST-doc-010",
      runId: "run-1",
      actor: "executor",
      status: "succeeded",
      startedAt: "2026-08-10T07:03:34Z",
      completedAt: "2026-08-10T07:04:34Z",
      exitCode: 0,
      attempts: 1,
      stdout,
      stderr: "",
      changes,
      diffStat: "large change",
      logRefPath: "docs/execution/exec/evidence/T-TEST-doc-010/run-1/executor.log",
    });

    expect(evidence.changes).toHaveLength(1_000);
    expect(evidence.validations).toHaveLength(50);
    expect(evidence.final_message.length).toBeLessThanOrEqual(4_000);
    expect(Buffer.byteLength(logExcerpt, "utf8")).toBeLessThanOrEqual(65_536);
    expect(evidence.log_refs[0].truncated).toBe(true);
  });
});
