import { describe, expect, it } from "vitest";
import type { ExecEvidence } from "../../../src/exec/evidence.js";
import { runReporterWithFormatRetry } from "../../../src/exec/reporter.js";
import type { ReviewReporterOutput } from "../../../src/exec/reporter-output.js";
import { repairReporterOutput, repairReporterText } from "../../../src/exec/reporter-repair.js";

const evidence = {} as ExecEvidence;

function reviewOutput(overrides: Partial<ReviewReporterOutput> = {}): ReviewReporterOutput {
  return {
    schema_version: 1,
    mode: "review",
    grade_check: "評価結果を確認した。",
    rationale: ["根拠を確認した。"],
    improvements: [],
    approach: "grade result と照合した。",
    verdict: "complete",
    ...overrides,
  } as ReviewReporterOutput;
}

describe("repairReporterText", () => {
  it("removes spaces inside a code span (MD038)", () => {
    expect(repairReporterText("`depends_on ` を直した。")).toBe("`depends_on` を直した。");
  });

  it("removes trailing punctuation from a heading line (MD026)", () => {
    expect(repairReporterText("## 結果。\n本文。")).toBe("## 結果\n本文。");
  });

  it("drops code fence lines and keeps their content", () => {
    expect(repairReporterText("例:\n```sh\nnpm test\n```")).toBe("例:\nnpm test");
  });

  it("leaves clean text unchanged", () => {
    expect(repairReporterText("`a` と `b` を比べた。")).toBe("`a` と `b` を比べた。");
  });
});

describe("repairReporterOutput", () => {
  it("repairs nested strings and keeps the verdict value", () => {
    const repaired = repairReporterOutput(reviewOutput({ rationale: ["`x ` を確認"] }));

    expect(repaired).toMatchObject({ rationale: ["`x` を確認"], verdict: "complete" });
  });
});

describe("runReporterWithFormatRetry format fallback", () => {
  const invalid = JSON.stringify({ ...reviewOutput(), verdict: undefined });

  it("repairs a fixable violation without another attempt", async () => {
    let calls = 0;
    const outcome = await runReporterWithFormatRetry({
      plan: "# Plan",
      evidence,
      mode: "review",
      validateOutput: async (candidate) =>
        JSON.stringify(candidate).includes("`x `") ? "MD038" : undefined,
      invoke: async () => {
        calls++;
        return {
          result: "success",
          stdout: JSON.stringify(reviewOutput({ rationale: ["`x ` を確認"] })),
          stderr: "",
        };
      },
    });

    expect(calls).toBe(1);
    expect(outcome).toMatchObject({ result: "success", formatAttempts: 1 });
  });

  it("retries once with the fallback reporter when verdict stays missing", async () => {
    let calls = 0;
    const outcome = await runReporterWithFormatRetry({
      plan: "# Plan",
      evidence,
      mode: "review",
      invoke: async () => {
        calls++;
        return { result: "success", stdout: invalid, stderr: "" };
      },
      fallbackInvoke: async (prompt) => {
        expect(prompt).toContain("verdict");
        return { result: "success", stdout: JSON.stringify(reviewOutput()), stderr: "" };
      },
    });

    expect(calls).toBe(3);
    expect(outcome).toMatchObject({
      result: "success",
      formatAttempts: 4,
      usedFormatFallback: true,
    });
  });

  it("fails when the fallback reporter output is also invalid", async () => {
    const outcome = await runReporterWithFormatRetry({
      plan: "# Plan",
      evidence,
      mode: "review",
      invoke: async () => ({ result: "success", stdout: invalid, stderr: "" }),
      fallbackInvoke: async () => ({ result: "success", stdout: invalid, stderr: "" }),
    });

    expect(outcome).toMatchObject({
      result: "failure",
      reason: expect.stringContaining("reporter output invalid after 3 format attempts"),
    });
  });
});
