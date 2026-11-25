import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { dump } from "js-yaml";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { applyGradeSubmission } from "../../../src/grade/apply.js";
import { levelCapForFindings } from "../../../src/grade/core.js";
import { renderGradePlan } from "../../../src/grade/plan.js";
import {
  combineSizeFindings,
  countSizeCharacters,
  measureOperationsCharacters,
  measureSizeMetrics,
  sizeLimitFindings,
} from "../../../src/grade/size-metrics.js";
import { assertRubric, loadViewpoints } from "../../../src/grade/targets.js";
import {
  gradeResultPathForDocument,
  parseGradeResult,
  readGradeResult,
} from "../../../src/grade/result.js";
import type { GradeSizeLimits, ReviewViewpointsDoc } from "../../../src/review/types.js";
import type { GradeSizeMetrics } from "../../../src/shared/grade-result.js";
import { load } from "../../../src/shared/yaml.js";
import { writeGradeRunFixture } from "../../helpers/grade-run-fixture.js";

// 既定の観点定義の上限で判定する。上限の数値は PJR-8S4T と膨らんだ例の実測を根拠にしている。
const defaultLimits = (
  load(readFileSync("docs/ja/specdojo/defaults/pm-review-viewpoints.yaml", "utf8")) as {
    grade_rubric: { size_limits: GradeSizeLimits };
  }
).grade_rubric.size_limits;

const severities = (metrics: GradeSizeMetrics): string[] =>
  sizeLimitFindings(metrics, defaultLimits).map((finding) => finding.severity);

describe("countSizeCharacters", () => {
  it("counts non-whitespace characters without table separators and finding comments", () => {
    const body = [
      "# 題 名",
      "",
      "| 列 | 値 |",
      "| --- | :---: |",
      "| a | b |",
      "<!-- specdojo:finding id=F001 severity=minor rule=vp-x line=1 指摘 -->",
    ].join("\n");

    // 「#題名」「|列|値|」「|a|b|」
    expect(countSizeCharacters(body)).toBe(3 + 5 + 5);
  });
});

describe("measureOperationsCharacters", () => {
  it("assigns each line to its innermost heading and ignores headings in code fences", () => {
    const body = [
      "# 検証の手引き",
      "前文",
      "## 1. 対応と検証",
      "親",
      "### 1.1. 隣接仕様との対応",
      "対応表",
      "### 1.2. 受入条件",
      "条件",
      "```text",
      "## 2. 承認",
      "```",
      "## 2. 本文",
      "内容",
    ].join("\n");

    const actual = measureOperationsCharacters(body, ["検証", "受入", "承認"]);

    // 「## 1. 対応と検証」と「親」、「### 1.2. 受入条件」からフェンスの終わりまでを数える。
    expect(actual).toBe(
      countSizeCharacters(
        [
          "## 1. 対応と検証",
          "親",
          "### 1.2. 受入条件",
          "条件",
          "```text",
          "## 2. 承認",
          "```",
        ].join("\n"),
      ),
    );
  });
});

describe("sizeLimitFindings with the default limits", () => {
  it("catches the PJR-CPZH rework of the comparison of alternatives as major", () => {
    // 手直し前 8,991 字、手直し後 19,906 字、sample 6,061 字（本文の空白を除く実測）。
    const metrics = measureSizeMetrics({
      body: "字".repeat(19_906),
      limits: defaultLimits,
      sample: { id: "specdojo:prj-comparison-of-alternatives-sample", characters: 6_061 },
      previousCharacters: 8_991,
    });

    expect(metrics).toMatchObject({ sample_ratio: 3.28, growth_ratio: 2.21 });
    expect(severities(metrics)).toEqual(["major", "major"]);
  });

  it("catches the current quality management plan grown by PJR-Y5AC", () => {
    // 手直し前 1,513 字、今の版 5,514 字、sample 3,203 字。
    const metrics = measureSizeMetrics({
      body: "字".repeat(5_514),
      limits: defaultLimits,
      sample: { id: "specdojo:pm-quality-management-plan-sample", characters: 3_203 },
      previousCharacters: 1_513,
    });

    expect(metrics).toMatchObject({ sample_ratio: 1.72, growth_ratio: 3.64 });
    expect(severities(metrics)).toEqual(["minor", "major"]);
  });

  it("catches the operations chapters of sld-sample before PJR-8S4T but not the current one", () => {
    const before: GradeSizeMetrics = {
      characters: 9_648,
      operations_characters: 2_750,
      operations_ratio: 0.29,
    };
    const current: GradeSizeMetrics = {
      characters: 5_642,
      previous_characters: 5_691,
      growth_ratio: 0.99,
      operations_characters: 542,
      operations_ratio: 0.1,
    };

    expect(severities(before)).toEqual(["minor"]);
    expect(severities(current)).toEqual([]);
  });

  it("does not flag a small document whose increase is below min_characters", () => {
    const metrics = measureSizeMetrics({
      body: "字".repeat(900),
      limits: defaultLimits,
      sample: { id: "specdojo:tiny-sample", characters: 300 },
      previousCharacters: 300,
    });

    expect(metrics.sample_ratio).toBe(3);
    expect(severities(metrics)).toEqual([]);
  });

  it("records only the character count when the rubric has no size limits", () => {
    expect(measureSizeMetrics({ body: "## 1. 検証\n本文" })).toEqual({ characters: 8 });
    expect(sizeLimitFindings({ characters: 9 }, undefined)).toEqual([]);
  });
});

describe("combineSizeFindings", () => {
  const metric = {
    severity: "major" as const,
    line: 1,
    message: "大きさの指標: 前回から 2 倍に増えた。",
  };

  it("downgrades the metric to note when the agent finds nothing removable", () => {
    const [actual] = combineSizeFindings(
      [{ id: "vp-arc-conciseness", level: 4, findings: [] }],
      [metric],
      levelCapForFindings,
    );

    expect(actual).toEqual({
      id: "vp-arc-conciseness",
      level: 4,
      findings: [{ ...metric, severity: "note" }],
    });
  });

  it("keeps the metric severity when the agent points out removable text", () => {
    const removable = {
      severity: "minor" as const,
      line: 12,
      message: "2.1 と 4.2 が同じ判断を言い直す。",
    };

    const [actual] = combineSizeFindings(
      [{ id: "vp-arc-conciseness", level: 3, findings: [removable] }],
      [metric],
      levelCapForFindings,
    );

    expect(actual.level).toBe(2);
    expect(actual.findings).toEqual([removable, metric]);
  });

  it("drops metric findings that the agent restated and leaves other viewpoints alone", () => {
    const other = { id: "vp-content", level: 4, findings: [] };

    const actual = combineSizeFindings(
      [other, { id: "vp-arc-conciseness", level: 3, findings: [{ ...metric, severity: "minor" }] }],
      [metric],
      levelCapForFindings,
    );

    expect(actual[0]).toBe(other);
    expect(actual[1].findings).toEqual([{ ...metric, severity: "note" }]);
    expect(actual[1].level).toBe(3);
  });
});

describe("grade result compatibility", () => {
  const base = {
    version: 1,
    document: "doc",
    path: "doc.md",
    target: "deliverable",
    rubric: "grade-rubric-v2",
    verdict: "pass",
    score: 100,
    graded_at: "2026-11-25T00:00:00.000Z",
    graded_by: "grader",
    content_hash: "a".repeat(64),
    categories: {},
    viewpoints: {},
    finding_counts: { blocker: 0, major: 0, minor: 0, note: 0 },
    findings: [],
  };

  it("reads a result recorded before size metrics", () => {
    expect(parseGradeResult(dump(base), "old.yaml").size_metrics).toBeUndefined();
  });

  it("rejects size metrics that are not numeric", () => {
    expect(() =>
      parseGradeResult(dump({ ...base, size_metrics: { characters: "many" } }), "bad.yaml"),
    ).toThrow(/bad\.yaml: size_metrics must record numeric size metrics/);
  });
});

describe("assertRubric size limits", () => {
  it("rejects a threshold whose major is below minor", () => {
    const doc: ReviewViewpointsDoc = {
      id: "x",
      type: "project",
      status: "draft",
      grade_rubric: {
        id: "grade-rubric-test",
        pass_score: 75,
        levels: [],
        weights: { kata: {}, deliverable: {} },
        size_limits: { growth_ratio: { minor: 2, major: 1 } },
      },
    };

    expect(() => assertRubric(doc)).toThrow(/size_limits\.growth_ratio/);
  });
});

describe("grade apply records size metrics", () => {
  const originalCwd = process.cwd();
  let directory: string;
  const documentPath = "docs/deliverable.md";
  const write = (path: string, text: string): void => {
    mkdirSync(dirname(join(directory, path)), { recursive: true });
    writeFileSync(join(directory, path), text, "utf8");
  };
  const deliverable = (paragraphs: number): string =>
    [
      "---",
      "specdojo:",
      "  id: demo-deliverable",
      "  type: project",
      "  status: draft",
      "  rulebook: specdojo:demo-rulebook",
      "---",
      "",
      "# 成果物",
      "",
      "## 1. 本文",
      "",
      ...Array.from({ length: paragraphs }, (_, index) => `段落${index}。${"判断".repeat(200)}`),
      "",
    ].join("\n");

  beforeEach(() => {
    directory = mkdtempSync(join(tmpdir(), "specdojo-grade-size-"));
    writeGradeRunFixture(directory);
    const viewpoints = load(
      readFileSync(join(directory, "viewpoints.yaml"), "utf8"),
    ) as ReviewViewpointsDoc;
    viewpoints.grade_rubric = {
      ...viewpoints.grade_rubric!,
      id: "grade-rubric-v3",
      weights: {
        kata: { quality: 100, usability: 20 },
        deliverable: { quality: 100, usability: 20 },
      },
      size_limits: {
        sample_ratio: { minor: 1.5, major: 2.5, min_characters: 1000 },
        growth_ratio: { minor: 1.3, major: 1.8, min_characters: 1000 },
      },
    };
    viewpoints.viewpoints = [
      ...(viewpoints.viewpoints ?? []),
      {
        id: "vp-arc-conciseness",
        role: "ARC",
        category: "usability",
        title: "冗長性・簡潔性",
        check: "冗長な記述がないか。",
        evidence: "本文。",
        default_severity: "minor",
        evaluation: "referential",
      },
    ];
    write("viewpoints.yaml", dump(viewpoints));
    write(
      "docs/ja/specdojo/rulebooks/demo-rulebook.md",
      "---\nspecdojo:\n  id: specdojo:demo-rulebook\n  type: rulebook\n  status: draft\n  sample: specdojo:demo-sample\n---\n\n# Demo rulebook\n",
    );
    write(
      "docs/ja/specdojo/samples/demo-sample.md",
      `---\nspecdojo:\n  id: specdojo:demo-sample\n  type: sample\n  status: draft\n  rulebook: specdojo:demo-rulebook\n---\n\n# Demo\n\n${"例".repeat(1_000)}\n`,
    );
    write(documentPath, deliverable(2));
    process.chdir(directory);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    rmSync(directory, { recursive: true, force: true });
  });

  const apply = (
    concisenessFindings: Array<{ severity: "minor"; message: string; line: number }>,
  ) =>
    applyGradeSubmission({
      submission: {
        rubric: "grade-rubric-v3",
        documents: [
          {
            path: documentPath,
            viewpoints: [
              { id: "vp-content", level: 4 },
              {
                id: "vp-arc-conciseness",
                level: concisenessFindings.length > 0 ? 3 : 4,
                findings: concisenessFindings,
              },
            ],
          },
        ],
      },
      target: "deliverable",
      project: "test",
      viewpoints: loadViewpoints("test"),
      gradedBy: "actual-grader",
      resultsDirectory: "execution/grade/results",
    });
  const result = () =>
    readGradeResult(
      gradeResultPathForDocument({
        documentPath,
        project: "test",
        resultsDirectory: "execution/grade/results",
      }),
    )!;

  it("records the sample ratio and the growth since the previous grade, and lowers the verdict", () => {
    apply([]);
    const first = result();
    expect(first.size_metrics).toMatchObject({
      sample: "specdojo:demo-sample",
      // 「#Demo」の 5 字と本文の 1,000 字。
      sample_characters: 1_005,
    });
    expect(first.size_metrics?.previous_characters).toBeUndefined();

    write(documentPath, deliverable(9));
    apply([{ severity: "minor", message: "1 章の段落が同じ判断を言い直している。", line: 3 }]);
    const second = result();

    expect(second.size_metrics?.previous_characters).toBe(first.size_metrics?.characters);
    expect(second.size_metrics?.growth_ratio).toBeGreaterThanOrEqual(1.8);
    expect(second.findings.filter((finding) => finding.rule === "vp-arc-conciseness")).toEqual([
      expect.objectContaining({ severity: "minor", line: 3 }),
      expect.objectContaining({
        severity: "major",
        message: expect.stringMatching(/^大きさの指標: 本文が宣言された sample/),
      }),
      expect.objectContaining({
        severity: "major",
        message: expect.stringMatching(/^大きさの指標: 本文が前回の grade/),
      }),
    ]);
    expect(second.viewpoints["vp-arc-conciseness"].level).toBe(1);
    expect(second.verdict).toBe("needs-work");
  });

  it("shows the metrics in the grade plan and keeps metric findings out of the prior findings", () => {
    write(documentPath, deliverable(9));
    apply([]);
    expect(result().findings.map((finding) => finding.severity)).toEqual(["note"]);

    const plan = renderGradePlan({
      target: "deliverable",
      path: documentPath,
      projectId: "test",
      viewpoints: loadViewpoints("test"),
    });

    expect(plan).toContain("### 3.4. 大きさの指標");
    expect(plan).toMatch(/宣言された sample（specdojo:demo-sample）との比: [0-9.]+ 倍/);
    expect(plan).toContain("上限を超えた指標: major");
    expect(plan).not.toContain('"message": "大きさの指標:');
  });
});
