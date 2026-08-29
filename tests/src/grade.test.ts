import { describe, expect, it } from "vitest";
import {
  gradeMarkdownContent,
  parseGradeSubmission,
  renderGradePrompt,
  validateGradeSubmission,
  validateGradedMarkdown,
  type GradeSubmission,
} from "../../src/grade.js";
import type { ReviewViewpointsDoc } from "../../src/review-types.js";

const viewpoints: ReviewViewpointsDoc = {
  id: "specdojo:pm-review-viewpoints",
  type: "standard",
  status: "draft",
  grade_rubric: {
    id: "grade-rubric-v1",
    pass_score: 70,
    levels: [0, 1, 2, 3, 4].map((level) => ({
      level,
      name: `L${level}`,
      description: `level ${level}`,
      review_verdict: level === 4 ? "pass" : level === 3 ? "conditional_pass" : "changes_requested",
    })),
    weights: {
      kata: { architecture: 20, quality: 40, usability: 40 },
      deliverable: { architecture: 20, quality: 40, usability: 40 },
    },
  },
  viewpoints: [
    {
      id: "vp-arc-document-structure",
      role: "ARC",
      category: "architecture",
      title: "structure",
      check: "check structure",
      evidence: "frontmatter and headings",
      default_severity: "major",
      evaluation: "deterministic",
      continuous: true,
    },
    {
      id: "vp-qe-kata-conformance",
      role: "QE",
      category: "quality",
      title: "kata",
      check: "check Kata",
      evidence: "authoring standard",
      default_severity: "major",
      evaluation: "agent",
      continuous: true,
      grade_targets: ["kata"],
    },
    {
      id: "vp-arc-conciseness",
      role: "ARC",
      category: "usability",
      title: "concise",
      check: "check repetition",
      evidence: "paragraphs",
      default_severity: "minor",
      evaluation: "agent",
      continuous: true,
    },
  ],
};

const submission: GradeSubmission = {
  rubric: "grade-rubric-v1",
  graded_by: "test-agent",
  documents: [
    {
      path: "docs/ja/specdojo/rulebooks/example-rulebook.md",
      viewpoints: [
        { id: "vp-qe-kata-conformance", level: 4, findings: [] },
        {
          id: "vp-arc-conciseness",
          level: 3,
          findings: [{ severity: "minor", message: "前置きが重複している。", line: 3 }],
        },
      ],
    },
  ],
};

const markdown = `---
specdojo:
  id: specdojo:example-rulebook
  type: rulebook
  status: draft
---

# Example

本文です。
`;

describe("grade submission", () => {
  it("parses JSON and enforces severity level caps", () => {
    expect(parseGradeSubmission(JSON.stringify(submission))).toEqual(submission);
    expect(validateGradeSubmission(submission, viewpoints, "kata")).toEqual([]);

    const invalid = structuredClone(submission);
    invalid.documents[0].viewpoints[1].level = 4;
    expect(validateGradeSubmission(invalid, viewpoints, "kata")).toContainEqual({
      path: "documents[0].viewpoints[1]",
      message: "finding severity caps level at 3",
    });
  });

  it("requires every continuous agent viewpoint and excludes deterministic viewpoints", () => {
    const missing = structuredClone(submission);
    missing.documents[0].viewpoints.pop();
    expect(validateGradeSubmission(missing, viewpoints, "kata")).toContainEqual({
      path: "documents[0]",
      message: "missing agent viewpoint: vp-arc-conciseness",
    });
  });
});

describe("grade markdown update", () => {
  it("writes an idempotent grade snapshot and inline findings", () => {
    const now = new Date("2026-08-29T00:00:00.000Z");
    const first = gradeMarkdownContent({
      content: markdown,
      path: submission.documents[0].path,
      input: submission.documents[0],
      viewpoints,
      target: "kata",
      gradedBy: submission.graded_by,
      now,
    });
    const second = gradeMarkdownContent({
      content: first,
      path: submission.documents[0].path,
      input: submission.documents[0],
      viewpoints,
      target: "kata",
      gradedBy: submission.graded_by,
      now,
    });

    expect(second).toBe(first);
    expect(first).toContain("verdict: pass");
    expect(first).toContain("score: 90");
    expect(first.match(/specdojo:finding/g)).toHaveLength(1);
    expect(validateGradedMarkdown(first, submission.documents[0].path)).toEqual([]);
  });

  it("detects count drift and edits after grading", () => {
    const graded = gradeMarkdownContent({
      content: markdown,
      path: submission.documents[0].path,
      input: submission.documents[0],
      viewpoints,
      target: "kata",
      gradedBy: submission.graded_by,
      now: new Date("2026-08-29T00:00:00.000Z"),
    });
    expect(
      validateGradedMarkdown(graded.replace("severity=minor", "severity=note"), "test.md"),
    ).toEqual(
      expect.arrayContaining([
        expect.stringContaining("findings.minor"),
        expect.stringContaining("findings.note"),
      ]),
    );
    expect(validateGradedMarkdown(`${graded}\n追記`, "test.md")).toContain(
      "test.md: content changed after the last grade",
    );
  });
});

describe("grade prompt", () => {
  it("includes only continuous agent viewpoints", () => {
    const prompt = renderGradePrompt({ target: "kata", paths: [], viewpoints });
    expect(prompt).toContain("vp-qe-kata-conformance");
    expect(prompt).toContain("vp-arc-conciseness");
    expect(prompt).not.toContain("vp-arc-document-structure [");
  });
});
