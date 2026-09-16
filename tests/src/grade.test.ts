import { describe, expect, it } from "vitest";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import yaml from "js-yaml";
import { format } from "prettier";
import {
  applyGradeSubmission,
  discoverGradeTargets,
  doneCriteriaDetailPath,
  gradeMarkdownContent,
  gradeMarkdownDocument,
  matchesGradeTargetFilters,
  parseGradeExecutorAnalysis,
  parseGradeSubmission,
  renderGradePlan,
  renderGradeReporterPlan,
  resolveGradeActor,
  resolveGradeReferenceId,
  resolveGradeReferencePaths,
  selectGradeReferenceExample,
  validateGradeReporterFidelity,
  validateGradeSubmission,
  validateGradedMarkdown,
  writeGradePlans,
  type GradeDoneCriterion,
  type GradePipelineState,
  type GradeSubmission,
  pipelineContentHash,
} from "../../src/grade.js";
import type { ReviewViewpointsDoc } from "../../src/review-types.js";
import type { MemberRoster } from "../../src/specdojo-config.js";

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

describe("grade target filters", () => {
  const passSubmission: GradeSubmission = {
    rubric: "grade-rubric-v1",
    documents: [
      {
        path: "docs/ja/specdojo/rulebooks/example-rulebook.md",
        viewpoints: [
          { id: "vp-qe-kata-conformance", level: 4, findings: [] },
          { id: "vp-arc-conciseness", level: 4, findings: [] },
        ],
      },
    ],
  };

  it("discovers artifact templates but excludes internal exec templates from kata", () => {
    const targets = discoverGradeTargets({ target: "kata" });

    expect(targets).toContainEqual(expect.stringContaining("/templates/prj-overview-template.md"));
    expect(targets).not.toContainEqual(expect.stringContaining("/exec-templates/"));
  });

  it("excludes generated documents and rejects their explicit selection", () => {
    const directory = mkdtempSync(join(tmpdir(), "specdojo-grade-target-"));
    const generatedRoot = join(directory, "docs/ja/specdojo/samples/generated");
    const generatedPath = join(generatedRoot, "example.md");
    mkdirSync(generatedRoot, { recursive: true });
    writeFileSync(generatedPath, markdown, "utf8");

    try {
      const targets = discoverGradeTargets({ target: "kata" }, directory);

      expect(targets).toEqual([]);
      expect(() =>
        discoverGradeTargets(
          { target: "kata", paths: ["docs/ja/specdojo/samples/generated/example.md"] },
          directory,
        ),
      ).toThrow(
        "docs/ja/specdojo/samples/generated/example.md: generated documents cannot be graded",
      );
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("excludes trashed deliverables for every selection mode and rejects explicit selection", () => {
    const directory = mkdtempSync(join(tmpdir(), "specdojo-grade-target-"));
    const catalogRoot = join(directory, "docs/ja/projects/prj-0001/010-deliverables-catalog");
    const currentPath = join(directory, "docs/ja/product/current.md");
    const trashedPath = join(directory, "docs/ja/product/trash/retired.md");
    mkdirSync(catalogRoot, { recursive: true });
    mkdirSync(join(directory, "docs/ja/product/trash"), { recursive: true });
    writeFileSync(currentPath, markdown, "utf8");
    writeFileSync(trashedPath, markdown, "utf8");
    writeFileSync(
      join(catalogRoot, "dct-test.yaml"),
      yaml.dump({
        id: "prj-0001:dct-test",
        type: "project",
        status: "draft",
        title: "Test catalog",
        rulebook: "specdojo:dct-rulebook",
        project_id: "prj-0001",
        domain: "test",
        base_path: "/docs/ja/product",
        groups: [
          {
            deliverables: [
              {
                local_id: "current",
                name: "Current",
                kind: "work",
                overview: "Current deliverable",
                path: "current.md",
              },
              {
                local_id: "retired",
                name: "Retired",
                kind: "work",
                overview: "Retired deliverable",
                path: "trash/retired.md",
              },
            ],
          },
        ],
      }),
      "utf8",
    );

    try {
      for (const filters of [{}, { changedOnly: true }, { ungraded: true }]) {
        expect(discoverGradeTargets({ target: "deliverable", ...filters }, directory)).toEqual([
          currentPath,
        ]);
      }
      expect(() =>
        discoverGradeTargets(
          { target: "deliverable", paths: ["docs/ja/product/trash/retired.md"] },
          directory,
        ),
      ).toThrow("docs/ja/product/trash/retired.md: trashed documents cannot be graded");
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("combines verdict, score, finding-count, and changed-only filters", () => {
    const graded = gradeMarkdownContent({
      content: markdown,
      path: passSubmission.documents[0].path,
      input: passSubmission.documents[0],
      viewpoints,
      target: "kata",
      gradedBy: "test-agent",
      now: new Date("2026-08-31T00:00:00.000Z"),
    });

    expect(
      matchesGradeTargetFilters(graded, "example.md", {
        verdict: "pass",
        minScore: 100,
        maxFindings: 0,
      }),
    ).toBe(true);
    expect(
      matchesGradeTargetFilters(graded, "example.md", {
        verdict: "needs-work",
        minScore: 100,
        maxFindings: 0,
      }),
    ).toBe(false);
    expect(
      matchesGradeTargetFilters(graded, "example.md", {
        verdict: "pass",
        minScore: 100,
        maxFindings: 0,
        changedOnly: true,
      }),
    ).toBe(false);
    expect(
      matchesGradeTargetFilters(
        graded.replace("本文です。", "本文を変更しました。"),
        "example.md",
        {
          verdict: "pass",
          minScore: 100,
          maxFindings: 0,
          changedOnly: true,
        },
      ),
    ).toBe(true);

    const lowerScore = gradeMarkdownContent({
      content: markdown,
      path: submission.documents[0].path,
      input: submission.documents[0],
      viewpoints,
      target: "kata",
      gradedBy: "test-agent",
      now: new Date("2026-08-31T00:00:00.000Z"),
    });
    expect(
      matchesGradeTargetFilters(lowerScore, "example.md", {
        verdict: "pass",
        minScore: 96,
        maxFindings: 1,
      }),
    ).toBe(false);
  });

  it("counts all stored finding severities against the maximum", () => {
    const needsWork = structuredClone(passSubmission);
    needsWork.documents[0].viewpoints[0] = {
      id: "vp-qe-kata-conformance",
      level: 2,
      findings: [{ severity: "major", message: "必須事項が欠落している。", line: 1 }],
    };
    const graded = gradeMarkdownContent({
      content: markdown,
      path: needsWork.documents[0].path,
      input: needsWork.documents[0],
      viewpoints,
      target: "kata",
      gradedBy: "test-agent",
      now: new Date("2026-08-31T00:00:00.000Z"),
    });

    expect(
      matchesGradeTargetFilters(graded, "example.md", {
        verdict: "needs-work",
        maxFindings: 1,
      }),
    ).toBe(true);
    expect(matchesGradeTargetFilters(graded, "example.md", { maxFindings: 0 })).toBe(false);
  });

  it("defines ungraded as the absence of specdojo.grade", () => {
    expect(matchesGradeTargetFilters(markdown, "example.md", { ungraded: true })).toBe(true);
    expect(
      matchesGradeTargetFilters(markdown, "example.md", {
        ungraded: true,
        changedOnly: true,
      }),
    ).toBe(true);
    expect(() =>
      matchesGradeTargetFilters(markdown, "example.md", {
        ungraded: true,
        verdict: "pass",
      }),
    ).toThrow("--ungraded cannot be combined");
    expect(() =>
      matchesGradeTargetFilters(markdown, "example.md", {
        ungraded: true,
        minScore: 96,
      }),
    ).toThrow("--ungraded cannot be combined");
  });

  it("selects only current, retryable pipeline state as incomplete", () => {
    const graded = gradeMarkdownContent({
      content: markdown,
      path: passSubmission.documents[0].path,
      input: passSubmission.documents[0],
      viewpoints,
      target: "kata",
      gradedBy: "test-agent",
      now: new Date("2026-08-31T00:00:00.000Z"),
    });
    const parts = graded.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    const frontmatter = yaml.load(parts?.[1] ?? "") as Record<string, unknown>;
    const state: GradePipelineState = {
      version: 1,
      project_id: "prj-0001",
      target: "kata",
      document: "example.md",
      content_hash: pipelineContentHash({ data: frontmatter, body: parts?.[2] ?? "" }),
      stage_completed: 2,
      stage_failed: 3,
      stage_total: 3,
      consecutive_failures: 1,
      max_failures: 3,
      last_run_id: "fixture-run",
      updated_at: "2026-08-31T00:00:00.000Z",
    };

    expect(matchesGradeTargetFilters(graded, "example.md", { incomplete: true }, state)).toBe(true);
    expect(
      matchesGradeTargetFilters(
        graded,
        "example.md",
        { incomplete: true },
        { ...state, consecutive_failures: 3 },
      ),
    ).toBe(false);
    expect(
      matchesGradeTargetFilters(
        graded,
        "example.md",
        { incomplete: true },
        { ...state, content_hash: "0".repeat(64) },
      ),
    ).toBe(false);
  });

  it("rejects invalid score and finding thresholds", () => {
    expect(() => matchesGradeTargetFilters(markdown, "example.md", { minScore: -1 })).toThrow(
      "--min-score must be an integer between 0 and 100",
    );
    expect(() => matchesGradeTargetFilters(markdown, "example.md", { minScore: 101 })).toThrow(
      "--min-score must be an integer between 0 and 100",
    );
    expect(() => matchesGradeTargetFilters(markdown, "example.md", { maxFindings: -1 })).toThrow(
      "--max-findings must be a non-negative integer",
    );
  });
});

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

  it("accepts submissions without the legacy agent-supplied graded_by", () => {
    const withoutActor = structuredClone(submission);
    delete withoutActor.graded_by;
    expect(parseGradeSubmission(JSON.stringify(withoutActor))).toEqual(withoutActor);
    expect(validateGradeSubmission(withoutActor, viewpoints, "kata")).toEqual([]);
  });

  it("resolves the grading actor from the member roster", () => {
    const roster: MemberRoster = {
      version: 1,
      project_id: "prj-0001",
      members: [
        {
          nickname: "codex-executor",
          display_name: "Codex Executor",
          email: null,
          roles: [],
          type: "agent",
        },
      ],
    };

    expect(resolveGradeActor(" codex-executor ", roster)).toBe("codex-executor");
    expect(() => resolveGradeActor("/root", roster)).toThrow('Unknown actor: "/root"');
    expect(() => resolveGradeActor("codex-executor", null)).toThrow(
      "members_path is required for grade apply --by",
    );
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
  it("writes an idempotent compact grade snapshot that Prettier preserves", async () => {
    const now = new Date("2026-08-29T00:00:00.000Z");
    const first = gradeMarkdownContent({
      content: markdown,
      path: submission.documents[0].path,
      input: submission.documents[0],
      viewpoints,
      target: "kata",
      gradedBy: "codex-executor",
      now,
    });
    const second = gradeMarkdownContent({
      content: first,
      path: submission.documents[0].path,
      input: submission.documents[0],
      viewpoints,
      target: "kata",
      gradedBy: "codex-executor",
      now,
    });

    expect(second).toBe(first);
    expect(first).toContain("verdict: pass");
    expect(first).toContain("score: 90");
    expect(first).toContain("graded_by: codex-executor");
    expect(first).not.toContain("graded_by: test-agent");
    expect(first).toContain("architecture: { score: 100 }");
    expect(first).toContain("vp-qe-kata-conformance: { level: 4, score: 100 }");
    expect(first).toContain("findings: { blocker: 0, major: 0, minor: 1, note: 0 }");
    expect(first.match(/specdojo:finding/g)).toHaveLength(1);
    expect(first).toContain("rule=vp-arc-conciseness line=3 前置きが重複している。");
    expect(validateGradedMarkdown(first, submission.documents[0].path)).toEqual([]);
    const formatted = await format(first, { parser: "markdown" });
    expect(formatted).toContain("architecture: { score: 100 }");
    expect(formatted).toContain("vp-qe-kata-conformance: { level: 4, score: 100 }");
    expect(formatted).toContain("findings: { blocker: 0, major: 0, minor: 1, note: 0 }");
    const frontmatterOf = (value: string) => yaml.load(value.match(/^---\n([\s\S]*?)\n---/)![1]);
    expect(frontmatterOf(formatted)).toEqual(frontmatterOf(first));
    expect(validateGradedMarkdown(formatted, submission.documents[0].path)).toEqual([]);
    expect(
      matchesGradeTargetFilters(formatted, submission.documents[0].path, {
        changedOnly: true,
      }),
    ).toBe(false);
  });

  it("normalizes repeated blank lines and trailing whitespace for content hashes", () => {
    const withoutFindings = structuredClone(submission.documents[0]);
    withoutFindings.viewpoints[1].findings = [];
    const graded = gradeMarkdownContent({
      content: markdown,
      path: withoutFindings.path,
      input: withoutFindings,
      viewpoints,
      target: "kata",
      gradedBy: "codex-executor",
      now: new Date("2026-08-29T00:00:00.000Z"),
    });
    const formattingOnlyChange = graded.replace(
      "# Example\n\n本文です。",
      "# Example  \n\n \n本文です。\t",
    );

    expect(validateGradedMarkdown(formattingOnlyChange, withoutFindings.path)).toEqual([]);
    expect(
      matchesGradeTargetFilters(formattingOnlyChange, withoutFindings.path, {
        changedOnly: true,
      }),
    ).toBe(false);
    expect(
      matchesGradeTargetFilters(
        formattingOnlyChange.replace("本文です。", "本文を変更しました。"),
        withoutFindings.path,
        { changedOnly: true },
      ),
    ).toBe(true);
  });

  it("normalizes trailing blank lines to exactly one newline", () => {
    const content = markdown.replace(/\n$/, "\n\n\n");
    const first = gradeMarkdownContent({
      content,
      path: submission.documents[0].path,
      input: submission.documents[0],
      viewpoints,
      target: "kata",
      gradedBy: "codex-executor",
      now: new Date("2026-08-29T00:00:00.000Z"),
    });
    const second = gradeMarkdownContent({
      content: first,
      path: submission.documents[0].path,
      input: submission.documents[0],
      viewpoints,
      target: "kata",
      gradedBy: "codex-executor",
      now: new Date("2026-08-29T00:00:00.000Z"),
    });

    expect(first).toMatch(/[^\n]\n$/);
    expect(first).toContain("本文です。");
    expect(second).toBe(first);
  });

  it("keeps mappings outside grade in block style", () => {
    const withExternalMetadata = markdown.replace(
      "---\n\n# Example",
      `external:
  nested:
    mapping:
      remains:
        first: one
        second: two
---

# Example`,
    );
    const graded = gradeMarkdownContent({
      content: withExternalMetadata,
      path: submission.documents[0].path,
      input: submission.documents[0],
      viewpoints,
      target: "kata",
      gradedBy: "codex-executor",
      now: new Date("2026-08-29T00:00:00.000Z"),
    });

    expect(graded).toContain(`external:
  nested:
    mapping:
      remains:
        first: one
        second: two`);
    expect(graded).not.toContain("remains: { first: one, second: two }");
  });

  it.each([
    {
      name: "nested list",
      body: "- Frontmatter:\n\n  - `id`: example\n  - `title`: Example",
      line: 5,
      blockStart: "- Frontmatter:",
    },
    {
      name: "table",
      body: "| key | value |\n| --- | --- |\n| id | example |",
      line: 5,
      blockStart: "| key | value |",
    },
    {
      name: "fenced code",
      body: "```ts\nconst example = true;\n```",
      line: 4,
      blockStart: "```ts",
    },
  ])("places a finding before the containing $name block", ({ body, line, blockStart }) => {
    const content = markdown.replace("本文です。", body);
    const input = structuredClone(submission.documents[0]);
    input.viewpoints[1].findings![0].line = line;

    const graded = gradeMarkdownContent({
      content,
      path: input.path,
      input,
      viewpoints,
      target: "kata",
      gradedBy: "codex-executor",
      now: new Date("2026-08-29T00:00:00.000Z"),
    });
    const repeated = gradeMarkdownContent({
      content: graded,
      path: input.path,
      input,
      viewpoints,
      target: "kata",
      gradedBy: "codex-executor",
      now: new Date("2026-08-29T00:00:00.000Z"),
    });

    expect(graded).toContain(
      `rule=vp-arc-conciseness line=${line} 前置きが重複している。 -->\n${blockStart}`,
    );
    expect(graded).not.toMatch(/\n{3,}/);
    expect(repeated).toBe(graded);
  });

  it("places a finding before a directive comment attached to its block", async () => {
    const body = `<!-- prettier-ignore -->
| key | value |
| --- | --- |
| id | example |`;
    const content = markdown.replace("本文です。", body);
    const input = structuredClone(submission.documents[0]);
    input.viewpoints[1].findings![0].line = 6;
    const finding =
      "<!-- specdojo:finding id=F001 severity=minor rule=vp-arc-conciseness line=6 前置きが重複している。 -->";

    const graded = gradeMarkdownContent({
      content,
      path: input.path,
      input,
      viewpoints,
      target: "kata",
      gradedBy: "codex-executor",
      now: new Date("2026-08-29T00:00:00.000Z"),
    });
    const legacyOrder = graded.replace(
      `${finding}\n<!-- prettier-ignore -->`,
      `<!-- prettier-ignore -->\n${finding}`,
    );
    const repaired = gradeMarkdownContent({
      content: legacyOrder,
      path: input.path,
      input,
      viewpoints,
      target: "kata",
      gradedBy: "codex-executor",
      now: new Date("2026-08-29T00:00:00.000Z"),
    });

    expect(graded).toContain(`${finding}\n<!-- prettier-ignore -->\n| key | value |`);
    expect(await format(graded, { parser: "markdown" })).toBe(graded);
    expect(validateGradedMarkdown(graded, input.path)).toEqual([]);
    expect(matchesGradeTargetFilters(graded, input.path, { changedOnly: true })).toBe(false);
    expect(repaired).toBe(graded);
  });

  it("detects count drift and edits after grading", () => {
    const graded = gradeMarkdownContent({
      content: markdown,
      path: submission.documents[0].path,
      input: submission.documents[0],
      viewpoints,
      target: "kata",
      gradedBy: "codex-executor",
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

  it("preserves the severity and level cap across repeated grading", () => {
    const content = markdown.replace(
      "本文です。",
      "<!-- specdojo:finding id=F042 severity=major rule=vp-qe-kata-conformance 必須の禁止事項が欠落している。 -->\n本文です。",
    );
    const input = structuredClone(submission.documents[0]);
    input.viewpoints = [
      { id: "vp-qe-kata-conformance", level: 4, findings: [] },
      {
        id: "vp-arc-conciseness",
        level: 3,
        findings: [{ severity: "minor", message: "必須の禁止事項が欠落している。", line: 1 }],
      },
    ];

    const graded = gradeMarkdownContent({
      content,
      path: input.path,
      input,
      viewpoints,
      target: "kata",
      gradedBy: "codex-executor",
      now: new Date("2026-08-30T00:00:00.000Z"),
    });

    expect(graded).toContain(
      "severity=major rule=vp-arc-conciseness line=1 必須の禁止事項が欠落している。",
    );
    expect(graded).toContain("vp-arc-conciseness: { level: 2, score: 50 }");
    expect(graded).toContain("major: 1");
    expect(graded).toContain("verdict: needs-work");

    const repeatedInput = structuredClone(input);
    repeatedInput.viewpoints[1].level = 4;
    repeatedInput.viewpoints[1].findings![0].severity = "note";
    const repeated = gradeMarkdownContent({
      content: graded,
      path: repeatedInput.path,
      input: repeatedInput,
      viewpoints,
      target: "kata",
      gradedBy: "codex-executor",
      now: new Date("2026-08-30T01:00:00.000Z"),
    });

    expect(repeated).toContain(
      "severity=major rule=vp-arc-conciseness line=1 必須の禁止事項が欠落している。",
    );
    expect(repeated).toContain("vp-arc-conciseness: { level: 2, score: 50 }");
    expect(repeated).toContain("major: 1");
    expect(repeated).toContain("verdict: needs-work");
  });

  it("allows a lower severity for a different residual finding with rationale", () => {
    const content = markdown.replace(
      "本文です。",
      "<!-- specdojo:finding id=F042 severity=major rule=vp-qe-kata-conformance 必須の禁止事項が欠落している。 -->\n本文です。",
    );
    const input = structuredClone(submission.documents[0]);
    input.viewpoints[1].findings = [
      {
        severity: "minor",
        message: "必須の禁止事項は追加済みだが、例示が一部不足しているため軽微な問題だけが残る。",
        line: 1,
      },
    ];

    const graded = gradeMarkdownContent({
      content,
      path: input.path,
      input,
      viewpoints,
      target: "kata",
      gradedBy: "codex-executor",
      now: new Date("2026-08-30T00:00:00.000Z"),
    });

    expect(graded).toContain(
      "severity=minor rule=vp-arc-conciseness line=1 必須の禁止事項は追加済みだが、例示が一部不足しているため軽微な問題だけが残る。",
    );
    expect(graded).toContain("minor: 1");
  });
});

describe("grade plan", () => {
  it("renders an executor plan without a GradeSubmission JSON contract", () => {
    const path = "docs/ja/specdojo/rulebooks/pm-quality-management-plan-rulebook.md";
    const plan = renderGradePlan({
      target: "kata",
      path,
      references: [],
      viewpoints,
      projectId: "prj-0001",
    });
    expect(plan).toContain("type: exec-plan");
    expect(plan).toContain(`- \`評価対象\`: \`${path}\``);
    expect(plan).toContain("## 1. このタスクで行うこと");
    expect(plan).toContain("## 2. 対象項目");
    expect(plan).toContain("## 3. 進め方");
    expect(plan).toContain("## 4. 完了手順");
    expect(plan).toContain("## 5. 異常終了の条件");
    expect(plan).toContain("実行ログに読み取り操作を残す");
    expect(plan).toContain("[VIEWPOINT vp-qe-kata-conformance]");
    expect(plan).toContain("根拠や検討過程を自由形式で詳しく記述してよい");
    expect(plan).toContain("GradeSubmission JSON は作成しない");
    expect(plan).not.toContain('"documents"');
    expect(plan).not.toContain('"graded_by"');
    expect(plan).toContain("vp-qe-kata-conformance");
    expect(plan).toContain("vp-arc-conciseness");
    expect(plan).not.toContain("vp-arc-document-structure [");
    expect(plan).not.toContain("## Document:");
    expect(plan).not.toContain("Frontmatter（CLI の決定的判定対象）");
  });

  it("renders a reporter plan that only structures the executor declaration", () => {
    const path = "docs/ja/specdojo/rulebooks/pm-quality-management-plan-rulebook.md";
    const plan = renderGradeReporterPlan({
      target: "kata",
      path,
      viewpoints,
      projectId: "prj-0001",
    });

    expect(plan).toContain("grade pipeline の reporter stage");
    expect(plan).toContain("評価やファイル読み取りは行わず");
    expect(plan).toContain("追加・省略・変更せず");
    expect(plan).toContain(`"path": "${path}"`);
    expect(plan).toContain('"rubric": "grade-rubric-v1"');
    expect(plan).toContain("message の要約、言い換え、校正を行わない");
  });

  it("parses free-form executor rationale and rejects reporter judgment changes", () => {
    const executorOutput = `前置きの分析も許容する。
[VIEWPOINT vp-qe-kata-conformance]
LEVEL: 2
規約の必須事項と比較した。
FINDING major line=7: 必須の禁止事項が欠落している。
[END VIEWPOINT]
[VIEWPOINT vp-arc-conciseness]
LEVEL: 4
重複は見つからなかった。
[END VIEWPOINT]
`;
    const expectedPath = "docs/ja/specdojo/rulebooks/example-rulebook.md";
    const reporterSubmission: GradeSubmission = {
      rubric: "grade-rubric-v1",
      documents: [
        {
          path: expectedPath,
          viewpoints: [
            {
              id: "vp-qe-kata-conformance",
              level: 2,
              findings: [{ severity: "major", line: 7, message: "必須の禁止事項が欠落している。" }],
            },
            { id: "vp-arc-conciseness", level: 4, findings: [] },
          ],
        },
      ],
    };

    expect(parseGradeExecutorAnalysis(executorOutput).viewpoints).toHaveLength(2);
    expect(
      validateGradeReporterFidelity({
        executorOutput,
        submission: reporterSubmission,
        viewpoints,
        target: "kata",
        expectedPath,
      }),
    ).toEqual([]);
    expect(validateGradeSubmission(reporterSubmission, viewpoints, "kata")).toEqual([]);

    const changed = structuredClone(reporterSubmission);
    changed.documents[0].viewpoints[0].level = 1;
    changed.documents[0].viewpoints[0].findings![0].severity = "blocker";
    expect(
      validateGradeReporterFidelity({
        executorOutput,
        submission: changed,
        viewpoints,
        target: "kata",
        expectedPath,
      }),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.stringContaining("differs from executor level"),
        }),
        expect.objectContaining({
          message: expect.stringContaining("severity executor=major reporter=blocker"),
        }),
      ]),
    );

    const omitted = structuredClone(reporterSubmission);
    omitted.documents[0].viewpoints[0].findings = [];
    expect(
      validateGradeReporterFidelity({
        executorOutput,
        submission: omitted,
        viewpoints,
        target: "kata",
        expectedPath,
      }),
    ).toEqual([
      expect.objectContaining({
        message: expect.stringContaining("reporter omitted executor finding"),
      }),
    ]);

    const added = structuredClone(reporterSubmission);
    added.documents[0].viewpoints[0].findings!.push({
      severity: "note",
      message: "executor が申告していない指摘。",
    });
    expect(
      validateGradeReporterFidelity({
        executorOutput,
        submission: added,
        viewpoints,
        target: "kata",
        expectedPath,
      }),
    ).toEqual([
      expect.objectContaining({
        message: expect.stringContaining("reporter added finding not declared by executor"),
      }),
    ]);
  });

  it("accepts presentation-only punctuation and whitespace differences in finding messages", () => {
    const executorOutput = `[VIEWPOINT vp-qe-kata-conformance]
LEVEL: 2
FINDING major line=7: 一方、 必須の禁止事項が欠落している。
[END VIEWPOINT]
[VIEWPOINT vp-arc-conciseness]
LEVEL: 4
[END VIEWPOINT]
`;
    const expectedPath = "docs/ja/specdojo/rulebooks/example-rulebook.md";
    const reporterSubmission: GradeSubmission = {
      rubric: "grade-rubric-v1",
      documents: [
        {
          path: expectedPath,
          viewpoints: [
            {
              id: "vp-qe-kata-conformance",
              level: 2,
              findings: [
                {
                  severity: "major",
                  line: 7,
                  message: "一方,必須の禁止事項が欠落している．",
                },
              ],
            },
            { id: "vp-arc-conciseness", level: 4, findings: [] },
          ],
        },
      ],
    };

    expect(
      validateGradeReporterFidelity({
        executorOutput,
        submission: reporterSubmission,
        viewpoints,
        target: "kata",
        expectedPath,
      }),
    ).toEqual([]);
  });

  it("rejects semantic finding changes and reports the changed fields", () => {
    const executorOutput = `[VIEWPOINT vp-qe-kata-conformance]
LEVEL: 2
FINDING major line=7: 必須の禁止事項が欠落している。
[END VIEWPOINT]
[VIEWPOINT vp-arc-conciseness]
LEVEL: 4
[END VIEWPOINT]
`;
    const expectedPath = "docs/ja/specdojo/rulebooks/example-rulebook.md";
    const reporterSubmission: GradeSubmission = {
      rubric: "grade-rubric-v1",
      documents: [
        {
          path: expectedPath,
          viewpoints: [
            {
              id: "vp-qe-kata-conformance",
              level: 2,
              findings: [
                {
                  severity: "minor",
                  line: 8,
                  message: "任意の推奨事項が記載されている。",
                },
              ],
            },
            { id: "vp-arc-conciseness", level: 4, findings: [] },
          ],
        },
      ],
    };

    expect(
      validateGradeReporterFidelity({
        executorOutput,
        submission: reporterSubmission,
        viewpoints,
        target: "kata",
        expectedPath,
      }),
    ).toEqual([
      expect.objectContaining({
        message: expect.stringMatching(
          /severity executor=major reporter=minor; line executor=7 reporter=8; message executor=/,
        ),
      }),
    ]);
  });

  it("resolves declared and reverse-linked Kata references", () => {
    const references = resolveGradeReferencePaths("docs/ja/specdojo/samples/opr-batch-sample.md");
    expect(references).toEqual(
      expect.arrayContaining([
        expect.stringContaining("/rulebooks/opd-rulebook.md"),
        expect.stringContaining("/rulebooks/opr-rulebook.md"),
        expect.stringContaining("/templates/opr-template.md"),
      ]),
    );
  });

  it("lists reference paths without embedding target or reference contents", () => {
    const path = "docs/ja/specdojo/samples/opr-batch-sample.md";
    const references = resolveGradeReferencePaths(path);
    const plan = renderGradePlan({
      target: "kata",
      path,
      references,
      viewpoints,
      projectId: "prj-0001",
    });
    expect(plan).toContain(`- \`評価対象\`: \`${path}\``);
    expect(plan).toContain("`docs/ja/specdojo/rulebooks/opr-rulebook.md`");
    expect(plan).not.toContain("本文（finding.line");
    expect(plan).not.toContain("# 運用手順: バッチ再実行・失敗対応 サンプル");
    expect(plan).not.toContain("# 運用手順 作成ルール");
    expect(plan.length).toBeLessThan(20_000);
  });

  it("selects a ready reference example from the same Kata kind on each run", () => {
    const path = "docs/ja/specdojo/rulebooks/pm-quality-management-plan-rulebook.md";
    const candidates = [
      path,
      "docs/ja/specdojo/rulebooks/atc-rulebook.md",
      "docs/ja/specdojo/rulebooks/cdfd-overview-rulebook.md",
      "docs/ja/specdojo/rulebooks/cdfd-rulebook.md",
      "docs/ja/specdojo/recipes/cdfd-recipe.md",
    ];
    const first = selectGradeReferenceExample({
      target: "kata",
      path,
      candidates,
      random: () => 0,
    });
    const second = selectGradeReferenceExample({
      target: "kata",
      path,
      candidates,
      random: () => 0.999,
    });

    expect(first).toMatch(/\/rulebooks\/cdfd-overview-rulebook\.md$/);
    expect(second).toMatch(/\/rulebooks\/cdfd-rulebook\.md$/);
    expect(first).not.toBe(second);
  });

  it("records the comparison reference as a document id", () => {
    // パスで保存すると文書を移動したときに参照が壊れる。ID なら移動しても解決できる。
    const id = resolveGradeReferenceId("docs/ja/specdojo/rulebooks/prj-overview-rulebook.md");

    expect(id).toBe("specdojo:prj-overview-rulebook");
  });

  it("keeps an already resolved id as is", () => {
    expect(resolveGradeReferenceId("specdojo:prj-overview-rulebook")).toBe(
      "specdojo:prj-overview-rulebook",
    );
  });

  it("writes the reference id into the grade and omits the key when unused", () => {
    const graded = gradeMarkdownContent({
      content: markdown,
      path: submission.documents[0].path,
      input: submission.documents[0],
      viewpoints,
      target: "kata",
      gradedBy: "gemma-expert-executor",
      reference: "docs/ja/specdojo/rulebooks/prj-overview-rulebook.md",
      now: new Date("2026-08-31T00:00:00.000Z"),
    });
    const without = gradeMarkdownContent({
      content: markdown,
      path: submission.documents[0].path,
      input: submission.documents[0],
      viewpoints,
      target: "kata",
      gradedBy: "gemma-expert-executor",
      now: new Date("2026-08-31T00:00:00.000Z"),
    });

    expect(graded).toContain("reference: specdojo:prj-overview-rulebook");
    expect(without).not.toContain("reference:");
  });

  it("omits the reference section entirely when no example is given", () => {
    // 空の節に「なし」と記すと、候補が存在しないのか指定していないのかを読み手が
    // 区別できない。
    const plan = renderGradePlan({
      target: "kata",
      path: "docs/ja/specdojo/rulebooks/pm-quality-management-plan-rulebook.md",
      references: [],
      viewpoints,
      projectId: "prj-0001",
    });

    expect(plan).not.toContain("### 良い実例（比較リファレンス）");
    expect(plan).not.toContain("該当候補なし");
  });

  it("uses the given reference instead of selecting one", () => {
    const directory = mkdtempSync(join(tmpdir(), "specdojo-grade-plan-"));
    try {
      const override = "docs/ja/specdojo/rulebooks/prj-overview-rulebook.md";
      const plans = writeGradePlans({
        target: "kata",
        paths: ["docs/ja/specdojo/rulebooks/pm-quality-management-plan-rulebook.md"],
        referenceExampleCandidates: ["docs/ja/specdojo/rulebooks/cdfd-rulebook.md"],
        referenceExampleOverride: override,
        viewpoints,
        projectId: "prj-0001",
        outputDirectory: "logs/grade-plan-test",
        random: () => 0,
      });

      expect(plans).toHaveLength(1);
      expect(plans[0].referenceExample).toBe(override);
    } finally {
      rmSync(directory, { recursive: true, force: true });
      rmSync("logs/grade-plan-test", { recursive: true, force: true });
    }
  });

  it("reports no reference when candidates are empty", () => {
    // 候補を渡さない場合はリファレンスなしになる。CLI はこの結果を見て警告する。
    try {
      const plans = writeGradePlans({
        target: "kata",
        paths: ["docs/ja/specdojo/rulebooks/pm-quality-management-plan-rulebook.md"],
        referenceExampleCandidates: [],
        viewpoints,
        projectId: "prj-0001",
        outputDirectory: "logs/grade-plan-empty",
        random: () => 0,
      });

      expect(plans[0].referenceExample).toBeUndefined();
      expect(plans[0].target).toMatch(/pm-quality-management-plan-rulebook\.md$/);
    } finally {
      rmSync("logs/grade-plan-empty", { recursive: true, force: true });
    }
  });

  it("returns nothing when no ready document shares the target kind", () => {
    // 種別が違うと構造も目的も異なり、記載水準の基準として誤りを招く。代用せず
    // リファレンスなしで評価する。
    const path = "docs/ja/specdojo/recipes/cdfd-recipe.md";
    const candidates = [path, "docs/ja/specdojo/rulebooks/cdfd-rulebook.md"];

    const selected = selectGradeReferenceExample({
      target: "kata",
      path,
      candidates,
      random: () => 0,
    });

    expect(selected).toBeUndefined();
  });

  it("records a good example as comparison material without evaluating it", () => {
    const path = "docs/ja/specdojo/rulebooks/pm-quality-management-plan-rulebook.md";
    const referenceExample = "docs/ja/specdojo/rulebooks/cdfd-rulebook.md";
    const plan = renderGradePlan({
      target: "kata",
      path,
      references: [],
      referenceExample,
      viewpoints,
      projectId: "prj-0001",
    });

    expect(plan).toContain("### 良い実例（比較リファレンス）");
    expect(plan).toContain(`- \`${referenceExample}\``);
    expect(plan).toContain("評価対象へ含めず");
    expect(plan).toContain("内容を正解として機械的に模倣しない");
    expect(plan).toContain("参考資料や良い実例を評価対象と混同しない");
    expect(plan).not.toContain("# CDFD 作成ルール");
    expect(plan.length).toBeLessThan(20_000);
  });

  it("carries previous finding facts into the next plan without previous scores", () => {
    const path = "tests/fixtures/grade/previous-findings.md";
    const plan = renderGradePlan({
      target: "kata",
      path,
      references: [],
      viewpoints,
      projectId: "prj-0001",
    });
    const previousSection = plan.match(/### 3\.1\. 前回の指摘\n([\s\S]*?)\n### 3\.2\. Rubric/)?.[1];

    expect(previousSection).toBeDefined();
    expect(previousSection).toContain('"rule": "vp-qe-kata-conformance"');
    expect(previousSection).toContain('"severity": "major"');
    expect(previousSection).toContain('"message": "必須の禁止事項が欠落している。"');
    expect(previousSection).not.toContain("F042");
    expect(previousSection).not.toContain("level");
    expect(previousSection).not.toContain("score");
    expect(previousSection).not.toContain("verdict");
    expect(plan).toContain("未解消なら前回の message を変更せず今回の finding に含め");
    expect(plan).toContain("severity は前回と同等以上を指定する");
    expect(plan).toContain(
      "severity を引き下げる場合は、その根拠を新しい finding の message に含める",
    );
    expect(plan).toContain("各 viewpoint は現在の根拠から独立に評価する");
    expect(plan).toContain("前回の指摘にない問題もすべての viewpoint で独立して検出する");
  });
});

describe("grade done_criteria for deliverables", () => {
  const deliverablePath = "docs/ja/specdojo/rulebooks/pm-quality-management-plan-rulebook.md";
  const doneCriteria: GradeDoneCriterion[] = [
    {
      id: "DC-001",
      text: "品質目標が数値で定義されていること",
      roles: ["QE"],
      viewpoint: "vp-qe-verifiability",
    },
    {
      id: "DC-002",
      text: "承認者と承認時点が明記されていること",
      roles: ["PO", "PM"],
      viewpoint: "vp-po-decision-readiness",
    },
  ];
  const deliverableMarkdown = markdown.replace("specdojo:example-rulebook", "prj-0001:example-doc");
  const deliverableInput = {
    path: "docs/ja/specdojo/rulebooks/example-rulebook.md",
    viewpoints: [{ id: "vp-arc-conciseness", level: 4, findings: [] }],
    done_criteria: [
      { id: "DC-001", status: "satisfied" as const },
      { id: "DC-002", status: "unsatisfied" as const, reason: "承認時点の記載がない。" },
    ],
  };
  const executorOutput = `[VIEWPOINT vp-arc-conciseness]
LEVEL: 4
重複はない。
[END VIEWPOINT]
[DONE_CRITERIA]
DC-001: satisfied
DC-002: unsatisfied: 承認時点の記載がない。
[END DONE_CRITERIA]
`;

  it("lists catalog done_criteria in the executor plan with roles, viewpoint, and markers", () => {
    const plan = renderGradePlan({
      target: "deliverable",
      path: deliverablePath,
      references: [],
      viewpoints,
      projectId: "prj-0001",
      doneCriteria,
    });

    expect(plan).toContain("### 3.4. 完了条件（done_criteria）");
    expect(plan).toContain(
      "- DC-001 [roles=QE; viewpoint=vp-qe-verifiability]: 品質目標が数値で定義されていること",
    );
    expect(plan).toContain("- DC-002 [roles=PO,PM; viewpoint=vp-po-decision-readiness]:");
    expect(plan).toContain("score や level の高低から充足を推論せず");
    expect(plan).toContain("[DONE_CRITERIA]");
    expect(plan).toContain("DC-002: <satisfied|unsatisfied>:");
    expect(plan).toContain("[END DONE_CRITERIA]");
    expect(plan).toContain("列挙された完了条件のいずれかを判定できない場合は異常終了する");
  });

  it("ignores done_criteria for kata plans", () => {
    const plan = renderGradePlan({
      target: "kata",
      path: deliverablePath,
      references: [],
      viewpoints,
      projectId: "prj-0001",
      doneCriteria,
    });

    expect(plan).not.toContain("done_criteria");
    expect(plan).not.toContain("[DONE_CRITERIA]");
  });

  it("adds a done_criteria template to the reporter plan", () => {
    const plan = renderGradeReporterPlan({
      target: "deliverable",
      path: deliverablePath,
      viewpoints,
      projectId: "prj-0001",
      doneCriteria,
    });

    expect(plan).toContain('"done_criteria": [');
    expect(plan).toContain('"id": "DC-002"');
    expect(plan).toContain("`reason` へ一字一句コピーする");
  });

  it("parses the DONE_CRITERIA block and rejects malformed entries", () => {
    const analysis = parseGradeExecutorAnalysis(executorOutput);

    expect(analysis.doneCriteria).toEqual([
      { id: "DC-001", status: "satisfied" },
      { id: "DC-002", status: "unsatisfied", reason: "承認時点の記載がない。" },
    ]);
    expect(
      parseGradeExecutorAnalysis("[VIEWPOINT a]\nLEVEL: 4\n[END VIEWPOINT]\n").doneCriteria,
    ).toBeUndefined();
    expect(() =>
      parseGradeExecutorAnalysis(executorOutput.replace("DC-001: satisfied", "DC-001 = ok")),
    ).toThrow(/line 6: malformed DONE_CRITERIA entry/);
    expect(() =>
      parseGradeExecutorAnalysis(executorOutput.replace("[END DONE_CRITERIA]\n", "")),
    ).toThrow("END DONE_CRITERIA marker is required");
  });

  it("requires every catalog criterion exactly once with a reason for unsatisfied", () => {
    const expected = new Map([[deliverableInput.path, doneCriteria]]);
    const valid: GradeSubmission = { rubric: "grade-rubric-v1", documents: [deliverableInput] };
    expect(
      validateGradeSubmission(valid, viewpoints, "deliverable", { doneCriteriaByPath: expected }),
    ).toEqual([]);

    const missing = structuredClone(valid);
    missing.documents[0].done_criteria = [{ id: "DC-001", status: "satisfied" }];
    expect(
      validateGradeSubmission(missing, viewpoints, "deliverable", { doneCriteriaByPath: expected }),
    ).toContainEqual({ path: "documents[0]", message: "missing criterion: DC-002" });

    const unknown = structuredClone(valid);
    unknown.documents[0].done_criteria!.push({ id: "DC-009", status: "satisfied" });
    expect(
      validateGradeSubmission(unknown, viewpoints, "deliverable", { doneCriteriaByPath: expected }),
    ).toContainEqual({
      path: "documents[0].done_criteria[2]",
      message: "unknown criterion: DC-009",
    });

    const withoutReason = structuredClone(valid);
    delete withoutReason.documents[0].done_criteria![1].reason;
    expect(
      validateGradeSubmission(withoutReason, viewpoints, "deliverable", {
        doneCriteriaByPath: expected,
      }),
    ).toContainEqual({
      path: "documents[0].done_criteria[1]",
      message: "unsatisfied requires a non-empty reason",
    });

    const omitted = structuredClone(valid);
    delete omitted.documents[0].done_criteria;
    expect(
      validateGradeSubmission(omitted, viewpoints, "deliverable", { doneCriteriaByPath: expected }),
    ).toContainEqual({
      path: "documents[0]",
      message: "done_criteria[] is required for this deliverable",
    });

    expect(validateGradeSubmission(valid, viewpoints, "kata")).toContainEqual({
      path: "documents[0].done_criteria",
      message: "done_criteria is accepted only for deliverable targets",
    });

    const aliasedPath = structuredClone(valid);
    aliasedPath.documents[0].path = `./${deliverableInput.path}`;
    delete aliasedPath.documents[0].done_criteria;
    expect(
      validateGradeSubmission(aliasedPath, viewpoints, "deliverable", {
        doneCriteriaByPath: expected,
      }),
    ).toContainEqual({
      path: "documents[0]",
      message: "done_criteria[] is required for this deliverable",
    });
  });

  it("rejects reporter changes to criterion status or reason", () => {
    const faithful: GradeSubmission = { rubric: "grade-rubric-v1", documents: [deliverableInput] };
    expect(
      validateGradeReporterFidelity({
        executorOutput,
        submission: faithful,
        viewpoints,
        target: "deliverable",
        expectedPath: deliverableInput.path,
        doneCriteria,
      }),
    ).toEqual([]);

    const flipped = structuredClone(faithful);
    flipped.documents[0].done_criteria![1] = { id: "DC-002", status: "satisfied" };
    expect(
      validateGradeReporterFidelity({
        executorOutput,
        submission: flipped,
        viewpoints,
        target: "deliverable",
        expectedPath: deliverableInput.path,
        doneCriteria,
      }),
    ).toEqual([
      expect.objectContaining({
        path: "documents[0].done_criteria.DC-002",
        message: "reporter status satisfied differs from executor status unsatisfied",
      }),
      expect.objectContaining({
        message: expect.stringContaining("reporter changed executor reason"),
      }),
    ]);

    const dropped = structuredClone(faithful);
    delete dropped.documents[0].done_criteria;
    expect(
      validateGradeReporterFidelity({
        executorOutput,
        submission: dropped,
        viewpoints,
        target: "deliverable",
        expectedPath: deliverableInput.path,
        doneCriteria,
      }),
    ).toEqual([
      expect.objectContaining({ message: "reporter omitted executor criterion: DC-001" }),
      expect.objectContaining({ message: "reporter omitted executor criterion: DC-002" }),
    ]);
  });

  it("records a summary in the frontmatter and keeps score independent of satisfaction", async () => {
    const now = new Date("2026-09-11T00:00:00.000Z");
    const graded = gradeMarkdownDocument({
      content: deliverableMarkdown,
      path: deliverableInput.path,
      input: deliverableInput,
      viewpoints,
      target: "deliverable",
      gradedBy: "codex-executor",
      now,
      doneCriteria: { definitions: doneCriteria, detailRef: "prj-0001:example-doc-grade-criteria" },
    });

    // score と verdict は viewpoint と finding だけで決まり、未充足条件では下がらない。
    expect(graded.content).toContain("verdict: pass");
    expect(graded.content).toContain("score: 100");
    expect(graded.content).toContain(
      "    done_criteria:\n      satisfied: 1\n      total: 2\n      unsatisfied:\n        DC-002: [PO, PM]\n      detail_ref: prj-0001:example-doc-grade-criteria\n",
    );
    expect(graded.content).not.toContain("承認時点の記載がない。");
    expect(graded.content).not.toContain("品質目標が数値で定義されていること");
    expect(validateGradedMarkdown(graded.content, deliverableInput.path)).toEqual([]);

    const formatted = await format(graded.content, { parser: "markdown" });
    expect(formatted).toContain("DC-002: [PO, PM]");
    expect(matchesGradeTargetFilters(formatted, deliverableInput.path, { changedOnly: true })).toBe(
      false,
    );

    const grade = (
      yaml.load(graded.content.match(/^---\n([\s\S]*?)\n---/)![1]) as {
        specdojo: { grade: { content_hash: string } };
      }
    ).specdojo.grade;
    expect(graded.detail).toEqual({
      id: "prj-0001:example-doc-grade-criteria",
      document: "prj-0001:example-doc",
      path: deliverableInput.path,
      graded_at: "2026-09-11T00:00:00.000Z",
      graded_by: "codex-executor",
      content_hash: grade.content_hash,
      summary: { satisfied: 1, unsatisfied: 1, total: 2 },
      criteria: [
        { ...doneCriteria[0], status: "satisfied" },
        { ...doneCriteria[1], status: "unsatisfied", reason: "承認時点の記載がない。" },
      ],
    });

    const allSatisfied = structuredClone(deliverableInput);
    allSatisfied.done_criteria = [
      { id: "DC-001", status: "satisfied" },
      { id: "DC-002", status: "satisfied" },
    ];
    const regraded = gradeMarkdownDocument({
      content: graded.content,
      path: deliverableInput.path,
      input: allSatisfied,
      viewpoints,
      target: "deliverable",
      gradedBy: "codex-executor",
      now,
      doneCriteria: { definitions: doneCriteria, detailRef: "prj-0001:example-doc-grade-criteria" },
    });
    expect(regraded.content).toContain("      satisfied: 2\n      total: 2\n      detail_ref:");
    expect(regraded.content).not.toContain("unsatisfied:");
  });

  it("omits the summary when the document has no catalog criteria or is a kata", () => {
    const withoutDefinitions = gradeMarkdownContent({
      content: deliverableMarkdown,
      path: deliverableInput.path,
      input: { ...deliverableInput, done_criteria: undefined },
      viewpoints,
      target: "deliverable",
      gradedBy: "codex-executor",
      now: new Date("2026-09-11T00:00:00.000Z"),
    });

    expect(withoutDefinitions).not.toContain("done_criteria");
  });

  it("writes one overwritten detail file per deliverable next to the grade", () => {
    const directory = "logs/grade-apply-criteria-test";
    const documentPath = `${directory}/example-doc.md`;
    const criteriaDirectory = `${directory}/criteria`;
    mkdirSync(directory, { recursive: true });
    writeFileSync(documentPath, deliverableMarkdown, "utf8");
    try {
      const submission: GradeSubmission = {
        rubric: "grade-rubric-v1",
        documents: [{ ...deliverableInput, path: documentPath }],
      };
      const options = {
        submission,
        viewpoints,
        target: "deliverable" as const,
        gradedBy: "codex-executor",
        now: new Date("2026-09-11T00:00:00.000Z"),
        doneCriteriaByPath: new Map([[documentPath, doneCriteria]]),
        criteriaDirectory,
      };
      const detailPath = doneCriteriaDetailPath(criteriaDirectory, documentPath);

      const changed = applyGradeSubmission(options);

      expect(changed).toEqual([expect.stringMatching(/-done-criteria\.yaml$/), documentPath]);
      expect(detailPath).toMatch(/\/criteria\/example-doc-[0-9a-f]{10}-done-criteria\.yaml$/);
      const detail = readFileSync(detailPath, "utf8");
      expect(detail).toMatch(
        /^# yaml-language-server: \$schema=(?:\.\.\/)+docs\/specdojo\/schemas\/v1\/grade-done-criteria\.schema\.yaml\n/,
      );
      expect(yaml.load(detail.split("\n").slice(1).join("\n"))).toMatchObject({
        id: "prj-0001:example-doc-grade-criteria",
        summary: { satisfied: 1, unsatisfied: 1, total: 2 },
      });
      expect(readFileSync(documentPath, "utf8")).toContain(
        "detail_ref: prj-0001:example-doc-grade-criteria",
      );

      // 同じ結果を再適用しても履歴は増えず、成果物も詳細ファイルも変更なしになる。
      expect(applyGradeSubmission(options)).toEqual([]);
      expect(existsSync(detailPath)).toBe(true);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});

describe("pipelineContentHash", () => {
  const data = { specdojo: { id: "x", type: "flow", status: "draft" } };

  it("ignores blank lines and finding comments introduced by grade apply between stages", () => {
    const before = { data, body: "# T\n\n<!-- prettier-ignore -->\n| a | b |\n| --- | --- |\n" };
    const after = {
      data,
      body: "# T\n\n<!-- specdojo:finding id=F001 severity=minor rule=vp-ux-readability line=3 x -->\n\n<!-- prettier-ignore -->\n\n| a | b |\n| --- | --- |\n",
    };

    expect(pipelineContentHash(after)).toBe(pipelineContentHash(before));
  });

  it("changes when non-blank content changes", () => {
    const before = { data, body: "# T\n\n本文\n" };
    const after = { data, body: "# T\n\n本文を修正\n" };

    expect(pipelineContentHash(after)).not.toBe(pipelineContentHash(before));
  });
});
