import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import {
  applyGradeFindingTranslations,
  gradeContentHash,
  gradeFindingDisplayMessage,
  gradeFindingTranslationInput,
  gradeResultPath,
  parseGradeResult,
  validateGradeResult,
  writeGradeResult,
  type GradeResult,
} from "../../src/grade-result.js";

const markdown = `---
specdojo:
  id: prj-0001:example
  type: project
  status: draft
---

# Example
`;

function result(): GradeResult {
  return {
    version: 1,
    document: "prj-0001:example",
    path: "docs/example.md",
    target: "deliverable",
    rubric: "grade-rubric-v1",
    verdict: "pass",
    score: 100,
    graded_at: "2026-09-20T00:00:00.000Z",
    graded_by: "codex-executor",
    content_hash: gradeContentHash(markdown),
    categories: { quality: { score: 100 } },
    viewpoints: { "vp-qe-verifiability": { level: 4, score: 100 } },
    finding_counts: { blocker: 0, major: 0, minor: 0, note: 0 },
    findings: [],
  };
}

describe("grade result sidecar", () => {
  it("writes one schema-tagged YAML file per document id", () => {
    const directory = mkdtempSync(join(tmpdir(), "specdojo-grade-result-"));
    try {
      const path = gradeResultPath(directory, "prj-0001:example");
      expect(writeGradeResult(path, result())).toBe(true);
      expect(writeGradeResult(path, result())).toBe(false);
      const content = readFileSync(path, "utf8");
      expect(content).toContain("grade-result.schema.yaml");
      expect(parseGradeResult(content, path)).toEqual(result());
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("detects document changes and finding count drift", () => {
    const stored = result();
    stored.finding_counts.minor = 1;
    expect(
      validateGradeResult(stored, `${markdown}\nchanged`, "docs/example.md", "deliverable"),
    ).toEqual(
      expect.arrayContaining([
        "docs/example.md: content changed after the last grade",
        "docs/example.md: finding_counts.minor=1, findings=0",
      ]),
    );
  });

  it("keeps canonical messages separate from ordered Japanese display translations", () => {
    const stored = result();
    stored.finding_counts.minor = 4;
    stored.findings = [
      {
        id: "F001",
        severity: "minor",
        rule: "vp-qe-verifiability",
        line: 1,
        anchor: "# Example",
        message: "Add a concrete verification command.",
      },
      {
        id: "F002",
        severity: "minor",
        rule: "vp-qe-verifiability",
        line: 1,
        anchor: "# Example",
        message: "検証結果を追記してください。",
      },
      {
        id: "F003",
        severity: "minor",
        rule: "vp-qe-verifiability",
        line: 1,
        anchor: "# Example",
        message: "The section `対象を指定する` needs a concrete example.",
      },
      {
        id: "F004",
        severity: "minor",
        rule: "vp-qe-verifiability",
        line: 1,
        anchor: "# Example",
        message: "必須章欠落",
      },
    ];

    expect(gradeFindingTranslationInput(stored)).toEqual([
      "[T001] Add a concrete verification command.",
      "[T002] The section `対象を指定する` needs a concrete example.",
    ]);
    const localized = applyGradeFindingTranslations(stored, [
      "[T001] 具体的な検証コマンドを追加してください。",
      "[T002] `対象を指定する` の具体例を追加してください。",
    ]);

    expect(localized.accepted).toBe(true);
    expect(localized.result.findings[0].message).toBe("Add a concrete verification command.");
    expect(gradeFindingDisplayMessage(localized.result.findings[0])).toBe(
      "具体的な検証コマンドを追加してください。",
    );
    expect(gradeFindingDisplayMessage(localized.result.findings[1])).toBe(
      "検証結果を追記してください。",
    );
    expect(gradeFindingDisplayMessage(localized.result.findings[2])).toBe(
      "`対象を指定する` の具体例を追加してください。",
    );
    expect(gradeFindingDisplayMessage(localized.result.findings[3])).toBe("必須章欠落");
  });

  it("discards translations when their count or order token differs", () => {
    const stored = result();
    stored.finding_counts.minor = 1;
    stored.findings = [
      {
        id: "F001",
        severity: "minor",
        rule: "vp-qe-verifiability",
        line: 1,
        anchor: "# Example",
        message: "Add a test.",
        message_ja: "古い翻訳",
      },
    ];

    const countMismatch = applyGradeFindingTranslations(stored, []);
    expect(countMismatch.accepted).toBe(false);
    expect(countMismatch.result.findings[0].message_ja).toBe("Add a test.");

    const orderMismatch = applyGradeFindingTranslations(stored, [
      "[T002] テストを追加する。",
    ]).result;
    expect(orderMismatch.findings[0].message_ja).toBe("Add a test.");
  });
});
