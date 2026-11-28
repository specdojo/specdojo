import { describe, expect, it } from "vitest";
import { markdownlintApi, planLintConfig } from "../../../src/exec/plan-markdownlint.js";
import { renderWatchDiagnosisBody } from "../../../src/exec/watch-diagnosis.js";
import { WATCH_DIAGNOSIS_HEADING } from "../../../src/exec/watch-scan.js";

// specdojo-docs-lint markdownlint と同じく、リポジトリの .markdownlint.yaml で検査する。
const repoRoot = process.cwd();

function record(id: string, proposal: string) {
  return {
    target: { kind: "schedule-task" as const, id },
    by: "opus",
    status: "proposed" as const,
    started_at: "2026-11-28T01:00:00.000Z",
    proposal,
  };
}

async function lintReport(body: string): Promise<string[]> {
  const content = `# 見回りの報告\n\n## 1. 概要\n\n- なし\n${WATCH_DIAGNOSIS_HEADING}\n${body}`;
  const api = await markdownlintApi(repoRoot);
  const result = api.lint({
    strings: { "watch-scan.md": content },
    config: planLintConfig(repoRoot, api),
    configParsers: api.parsers,
  });
  return (result["watch-scan.md"] ?? []).map(
    (issue) => `${issue.lineNumber} ${issue.ruleNames.join("/")}`,
  );
}

describe("renderWatchDiagnosisBody", () => {
  it("renders a single diagnosis that passes markdownlint", async () => {
    const body = renderWatchDiagnosisBody([record("T-A", "案の 1 行目\n\n案の 3 行目")], []);

    expect(body).toContain(">     案の 1 行目\n>     \n>     案の 3 行目");
    expect(await lintReport(body)).toEqual([]);
  });

  it("renders several diagnoses and warnings without blank lines between quotes", async () => {
    const body = renderWatchDiagnosisBody(
      [record("T-A", "案 A"), record("T-B", "案 B")],
      ["診断を実行できなかった: boom\nsecond line"],
    );

    expect(body).toContain("- 注記\n\n>     診断を実行できなかった: boom second line");
    expect(await lintReport(body)).toEqual([]);
  });

  it("renders the nightly limit note after a diagnosis without MD028", async () => {
    const body = renderWatchDiagnosisBody(
      [record("T-A", "案 A")],
      [
        "1 晩 3 回の診断上限。残りは人が確認するか次の晩に診断する。",
        "診断を実行できなかった: later",
      ],
    );

    expect(body).not.toMatch(/^>.*\n\n>/mu);
    expect(await lintReport(body)).toEqual([]);
  });

  it("renders an empty section as a single list item", async () => {
    const body = renderWatchDiagnosisBody([], []);

    expect(body).toBe("診断は案であり、手は打っていない。\n\n- なし\n");
    expect(await lintReport(body)).toEqual([]);
  });
});
