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
} from "../../../src/grade/result.js";

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
      "Add a concrete verification command.",
      "The section `対象を指定する` needs a concrete example.",
    ]);
    const localized = applyGradeFindingTranslations(stored, [
      "具体的な検証コマンドを追加してください。",
      "`対象を指定する` の具体例を追加してください。",
    ]);

    expect(localized.accepted).toBe(true);
    expect(localized.rejections).toEqual([]);
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

  it("rejects every translation when the array count differs", () => {
    const stored = result();
    stored.finding_counts.minor = 2;
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
      {
        id: "F002",
        severity: "minor",
        rule: "vp-qe-verifiability",
        line: 2,
        anchor: "# Example",
        message: "Add a verification command.",
        message_ja: "古い検証翻訳",
      },
    ];

    const countMismatch = applyGradeFindingTranslations(stored, ["テストを追加する。"]);
    expect(countMismatch.accepted).toBe(false);
    expect(countMismatch.rejections.map(({ translation_index }) => translation_index)).toEqual([
      0, 1,
    ]);
    expect(countMismatch.rejections.every(({ reason }) => reason === "count-mismatch")).toBe(true);
    expect(countMismatch.result.findings[0].message_ja).toBe("Add a test.");
    expect(countMismatch.result.findings[1].message_ja).toBe("Add a verification command.");
  });

  it("validates kana and the exact inline code multiset per item while keeping valid translations", () => {
    const stored = result();
    stored.finding_counts.minor = 5;
    stored.findings = [
      {
        id: "F001",
        severity: "minor",
        rule: "vp-qe-verifiability",
        line: 1,
        anchor: "# Example",
        message: "Run `npm test`.",
      },
      {
        id: "F002",
        severity: "minor",
        rule: "vp-qe-verifiability",
        line: 2,
        anchor: "# Example",
        message: "Edit `src/example.ts`.",
      },
      {
        id: "F003",
        severity: "minor",
        rule: "vp-qe-verifiability",
        line: 3,
        anchor: "# Example",
        message: "Add documentation.",
      },
      {
        id: "F004",
        severity: "minor",
        rule: "vp-qe-verifiability",
        line: 4,
        anchor: "# Example",
        message: "Clarify the expected result.",
      },
      {
        id: "F005",
        severity: "minor",
        rule: "vp-qe-verifiability",
        line: 5,
        anchor: "# Example",
        message: "Define the decision owner.",
      },
    ];

    const localized = applyGradeFindingTranslations(stored, [
      "`npm test` を実行してください。",
      "ファイルを修正してください。",
      "Add documentation.",
      " ",
      "`decision owner` を定義してください。",
    ]);

    expect(localized.accepted).toBe(false);
    expect(localized.rejections).toEqual([
      {
        translation_index: 1,
        finding_id: "F002",
        reason: "missing-inline-code",
        detail: "`src/example.ts`",
      },
      { translation_index: 2, finding_id: "F003", reason: "missing-kana" },
      { translation_index: 3, finding_id: "F004", reason: "empty" },
      {
        translation_index: 4,
        finding_id: "F005",
        reason: "extra-inline-code",
        detail: "`decision owner`",
      },
    ]);
    expect(localized.result.findings.map(({ message_ja }) => message_ja)).toEqual([
      "`npm test` を実行してください。",
      "Edit `src/example.ts`.",
      "Add documentation.",
      "Clarify the expected result.",
      "Define the decision owner.",
    ]);
  });

  it("accepts a translation with exactly the same inline code", () => {
    const stored = result();
    stored.finding_counts.minor = 1;
    stored.findings = [
      {
        id: "F001",
        severity: "minor",
        rule: "vp-qe-verifiability",
        line: 1,
        anchor: "# Example",
        message: "Run `npm test`.",
      },
    ];

    const localized = applyGradeFindingTranslations(stored, ["`npm test` を実行してください。"]);

    expect(localized.accepted).toBe(true);
    expect(localized.rejections).toEqual([]);
    expect(localized.result.findings[0].message_ja).toBe("`npm test` を実行してください。");
  });

  it("detects swapped translations when their inline code differs", () => {
    const stored = result();
    stored.findings = [
      {
        id: "F001",
        severity: "minor",
        rule: "vp-qe-verifiability",
        line: 1,
        anchor: "# Example",
        message: "Run `npm test`.",
      },
      {
        id: "F002",
        severity: "minor",
        rule: "vp-qe-verifiability",
        line: 2,
        anchor: "# Example",
        message: "Edit `src/example.ts`.",
      },
    ];

    const localized = applyGradeFindingTranslations(stored, [
      "`src/example.ts` を修正してください。",
      "`npm test` を実行してください。",
    ]);

    expect(localized.rejections.map(({ translation_index }) => translation_index)).toEqual([0, 1]);
    expect(localized.rejections.every(({ reason }) => reason === "missing-inline-code")).toBe(true);
  });

  it("accepts a valid single-item retry and keeps canonical English after a failed retry", () => {
    const stored = result();
    stored.findings = [
      {
        id: "F001",
        severity: "minor",
        rule: "vp-qe-verifiability",
        line: 1,
        anchor: "# Example",
        message: "Run `npm test`.",
      },
      {
        id: "F002",
        severity: "minor",
        rule: "vp-qe-verifiability",
        line: 2,
        anchor: "# Example",
        message: "Add documentation.",
      },
    ];
    const initial = applyGradeFindingTranslations(stored, [
      "テストを実行してください。",
      "文書を追加してください。",
    ]);
    expect(initial.rejections.map(({ translation_index }) => translation_index)).toEqual([0]);

    const retrySucceeded = applyGradeFindingTranslations(
      initial.result,
      ["`npm test` を実行してください。"],
      0,
    );
    expect(retrySucceeded.accepted).toBe(true);
    expect(retrySucceeded.result.findings.map(({ message_ja }) => message_ja)).toEqual([
      "`npm test` を実行してください。",
      "文書を追加してください。",
    ]);

    const retryFailed = applyGradeFindingTranslations(initial.result, ["Run `npm test`."], 0);
    expect(retryFailed.accepted).toBe(false);
    expect(retryFailed.result.findings[0].message_ja).toBe("Run `npm test`.");
    expect(retryFailed.result.findings[1].message_ja).toBe("文書を追加してください。");
  });
});
