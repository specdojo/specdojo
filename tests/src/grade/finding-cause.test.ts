import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { dump } from "../../../src/shared/yaml.js";
import { buildValidator } from "../../helpers/schema.js";
import { writeGradeRunFixture } from "../../helpers/grade-run-fixture.js";
import {
  applyGradeSubmission,
  buildGradeSubmissionFromAnalysis,
  parseGradeExecutorAnalysis,
  validateGradeReporterFidelity,
  validateGradeSubmission,
} from "../../../src/grade/apply.js";
import { renderGradePlan, renderGradeReporterPlan } from "../../../src/grade/plan.js";
import { loadViewpoints } from "../../../src/grade/targets.js";
import {
  applyGradeFindingTranslations,
  gradeFindingTranslationInput,
  gradeResultPathForDocument,
  readGradeResultForDocument,
  writeGradeResult,
  type GradeResult,
} from "../../../src/grade/result.js";
import { findingCause, type FindingCause } from "../../../src/shared/finding-cause.js";
import { kataCauseFindingsText } from "../../../src/exec/plans-kata-findings.js";
import { gradeFindingsText } from "../../../src/exec/plans-core.js";
import { generateRegisterApproachPlan } from "../../../src/exec/plans.js";
import { resolveKataRefs } from "../../../src/kata/kata.js";
import type { Approach } from "../../../src/exec/types.js";

const originalCwd = process.cwd();
const validateResult = buildValidator("docs/specdojo/schemas/v1/grade-result.schema.yaml");
const kinds = ["rulebook", "recipe", "sample", "template"] as const;
let root: string;

function write(path: string, content: string): void {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), content);
}

function document(id: string, rulebook = "specdojo:example-rulebook"): string {
  return `---\nspecdojo:\n  id: test:${id}\n  type: project\n  status: draft\n  rulebook: ${rulebook}\n---\n\n# Example\n\nContent.\n`;
}

function markers(cause?: FindingCause, severity = "minor"): string {
  return `[VIEWPOINT vp-content]\nLEVEL: 3\nFINDING ${severity} line=3: Add a concrete example.\n${cause ? `CAUSE: ${JSON.stringify(cause)}\n` : ""}[END VIEWPOINT]\n`;
}

function apply(path: string, cause?: FindingCause, severity = "minor"): GradeResult {
  const viewpoints = loadViewpoints("test");
  const converted = buildGradeSubmissionFromAnalysis({
    executorOutput: markers(cause, severity),
    viewpoints,
    target: "deliverable",
    expectedPath: path,
  });
  expect(converted.issues).toEqual([]);
  applyGradeSubmission({
    submission: converted.submission!,
    viewpoints,
    target: "deliverable",
    project: "test",
    gradedBy: "actual-grader",
    resultsDirectory: "execution/grade/results",
  });
  return readGradeResultForDocument({ documentPath: path, project: "test" })!;
}

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "specdojo-finding-cause-"));
  writeGradeRunFixture(root);
  write("document.md", document("document"));
  write(
    "docs/ja/specdojo/rulebooks/example-rulebook.md",
    `---\nspecdojo:\n  id: specdojo:example-rulebook\n  type: rulebook\n  status: draft\n  recipe: specdojo:example-recipe\n  sample: specdojo:example-sample\n  template: specdojo:example-template\n---\n\n# Rulebook\n`,
  );
  for (const kind of ["recipe", "sample", "template"]) {
    write(
      `docs/ja/specdojo/${kind}s/example-${kind}.md`,
      `---\nspecdojo:\n  id: specdojo:example-${kind}\n  type: ${kind}\n  status: draft\n---\n\n# ${kind}\n`,
    );
  }
  process.chdir(root);
});

afterEach(() => {
  process.chdir(originalCwd);
  rmSync(root, { recursive: true, force: true });
});

describe("finding causes", () => {
  it.each([
    undefined,
    { type: "document" },
    ...kinds.map((kind) => ({ type: "kata", kind, location: "## Questions, item 2" })),
  ] as Array<FindingCause | undefined>)(
    "round-trips and validates optional cause %j without changing scores",
    (cause) => {
      const legacy = apply("document.md");
      const stored = apply("document.md", cause);
      expect(stored.findings[0].cause).toEqual(cause);
      expect(validateResult(stored), JSON.stringify(validateResult.errors)).toBe(true);
      expect(stored.score).toBe(legacy.score);
      expect(stored.verdict).toBe(legacy.verdict);
      expect(stored.viewpoints).toEqual(legacy.viewpoints);
      expect(findingCause(stored.findings[0])).toEqual(cause ?? { type: "document" });
    },
  );

  it.each([
    { type: "unknown" },
    { type: "document", location: "extra" },
    { type: "kata", kind: "recipe" },
    { type: "kata", kind: "other", location: "heading" },
    { type: "kata", kind: "recipe", location: " " },
    { type: "kata", kind: "recipe", location: "heading", extra: true },
  ])("rejects malformed cause %j in both schema and submissions", (cause) => {
    const stored = apply("document.md");
    const input = buildGradeSubmissionFromAnalysis({
      executorOutput: markers(),
      viewpoints: loadViewpoints("test"),
      target: "deliverable",
      expectedPath: "document.md",
    }).submission!;
    Object.assign(stored.findings[0], { cause });
    Object.assign(input.documents[0].viewpoints[0].findings![0], { cause });
    expect(validateResult(stored)).toBe(false);
    expect(
      validateGradeSubmission(input, loadViewpoints("test"), "deliverable").some((issue) =>
        issue.path.endsWith(".cause"),
      ),
    ).toBe(true);
    expect(() =>
      parseGradeExecutorAnalysis(
        markers().replace("[END VIEWPOINT]", `CAUSE: ${JSON.stringify(cause)}\n[END VIEWPOINT]`),
      ),
    ).toThrow();
  });

  it("keeps carry-over matching and Japanese translation independent of the cause", () => {
    apply("document.md", { type: "document" }, "major");
    const cause: FindingCause = { type: "kata", kind: "recipe", location: "## Questions" };
    const stored = apply("document.md", cause);
    expect(stored.findings[0].severity).toBe("major");
    expect(stored.viewpoints["vp-content"].level).toBe(2);
    expect(gradeFindingTranslationInput(stored)).toEqual(["Add a concrete example."]);
    const translated = applyGradeFindingTranslations(stored, ["具体例を追加してください。"]);
    expect(translated.accepted).toBe(true);
    expect(translated.result.findings[0].cause).toEqual(cause);
    expect(translated.result.score).toBe(stored.score);
    expect(translated.result.verdict).toBe(stored.verdict);
  });

  it("preserves causes through reporter fidelity and rejects cause changes", () => {
    const executorOutput = markers({ type: "kata", kind: "recipe", location: "## Questions" });
    const viewpoints = loadViewpoints("test");
    const submission = buildGradeSubmissionFromAnalysis({
      executorOutput,
      viewpoints,
      target: "deliverable",
      expectedPath: "document.md",
    }).submission!;
    const options = {
      executorOutput,
      viewpoints,
      target: "deliverable" as const,
      expectedPath: "document.md",
      submission,
    };
    expect(validateGradeReporterFidelity(options)).toEqual([]);
    delete submission.documents[0].viewpoints[0].findings![0].cause;
    expect(validateGradeReporterFidelity(options)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: expect.stringContaining("cause executor=") }),
      ]),
    );
  });

  it("requests causes only for deliverables and rejects causes on Kata submissions", () => {
    const viewpoints = loadViewpoints("test");
    const options = { path: "document.md", viewpoints, projectId: "test" };
    const plan = renderGradePlan({ ...options, target: "deliverable" });
    expect(plan).toContain('CAUSE: {"type":"document"}');
    expect(plan).toContain("箇所を示せない場合は document");
    const kataPlan = renderGradePlan({ ...options, target: "kata" });
    expect(kataPlan).not.toContain('CAUSE: {"type":"document"}');
    expect(kataPlan).toContain("原因を付けず");
    expect(renderGradeReporterPlan({ ...options, target: "deliverable" })).toContain(
      "finding の `cause`",
    );
    const input = buildGradeSubmissionFromAnalysis({
      executorOutput: markers({ type: "document" }),
      viewpoints,
      target: "deliverable",
      expectedPath: "document.md",
    }).submission!;
    expect(
      validateGradeSubmission(input, viewpoints, "kata").some((issue) =>
        issue.path.endsWith(".cause"),
      ),
    ).toBe(true);
  });

  it.each(kinds)(
    "routes current %s findings into the maintenance plan with evidence",
    async (kind) => {
      const refs = resolveKataRefs("specdojo:example-rulebook");
      const cause: FindingCause = {
        type: "kata",
        kind,
        location: "## Questions `depends_on` | [link](elsewhere.md)",
      };
      apply("document.md", cause);
      write("other.md", document("other"));
      apply("other.md", { type: "document" });
      write("legacy.md", document("legacy"));
      apply("legacy.md");
      write("stale.md", document("stale"));
      apply("stale.md", cause);
      write("stale.md", `${document("stale")}Changed after grade.\n`);
      write("unrelated.md", document("unrelated", "none"));
      apply("unrelated.md", cause);
      write("wrong-kind.md", document("wrong-kind"));
      apply("wrong-kind.md", {
        type: "kata",
        kind: kind === "recipe" ? "sample" : "recipe",
        location: "## Other",
      });
      const text = kataCauseFindingsText("test", kind, refs[kind]);
      expect(text).toContain("source=grade");
      expect(text).toContain("test:document");
      expect(text).toContain("document.md");
      expect(text).toContain("line=3");
      expect(text).toContain("vp-content");
      expect(text).toContain("Add a concrete example.");
      expect(text).toContain(`cause=kata:${kind}`);
      expect(text).toContain(cause.location);
      for (const id of ["other", "legacy", "stale", "unrelated", "wrong-kind"])
        expect(text).not.toContain(`test:${id}`);

      const planPath = await generateRegisterApproachPlan({
        projectId: "test",
        catalogPath: "",
        executionPath: join(root, "execution"),
        projectContext: [],
        taskId: `T-${kind}`,
        title: "Maintain Kata",
        description: "Maintain the declared Kata.",
        approach: `${kind}-maintenance` as Approach,
        owner: "QE",
        refs,
        targets: [`specdojo:example-${kind}`],
        stem: `test-${kind}`,
        additionalConditions: "",
      });
      const plan = readFileSync(planPath, "utf8");
      expect(plan).toContain("### 成果物から届いた Kata が原因の finding");
      expect(plan).toContain("test:document");
      expect(plan).not.toContain("_KATA_CAUSE_FINDINGS_");
    },
  );

  it("uses only the canonical latest sidecar and keeps all fully-guided findings with their causes", async () => {
    const stored = apply("document.md", { type: "kata", kind: "recipe", location: "## Questions" });
    stored.findings.push({
      ...stored.findings[0],
      id: "F002",
      message: "Document-only issue.",
      message_ja: "Document-only issue.",
      cause: { type: "document" },
    });
    stored.finding_counts.minor += 1;
    writeGradeResult(
      gradeResultPathForDocument({ documentPath: "document.md", project: "test" }),
      stored,
    );
    write(
      "execution/grade/results/historical-copy.yaml",
      dump({ ...stored, findings: [{ ...stored.findings[0], message: "Superseded finding." }] }),
    );
    const maintenance = kataCauseFindingsText(
      "test",
      "recipe",
      resolveKataRefs("specdojo:example-rulebook").recipe,
    );
    expect(maintenance).not.toContain("Superseded finding.");
    expect(maintenance).not.toContain("Document-only issue.");
    const fullyGuided = gradeFindingsText("test", "document.md", true);
    expect(fullyGuided).toContain("Add a concrete example.");
    expect(fullyGuided).toContain("Document-only issue.");
    expect(fullyGuided).toContain("cause=kata:recipe");
    expect(fullyGuided).toContain("cause=document");
    const planPath = await generateRegisterApproachPlan({
      projectId: "test",
      catalogPath: "",
      executionPath: join(root, "execution"),
      projectContext: [],
      taskId: "T-refine",
      title: "Refine document",
      description: "Resolve all document findings.",
      approach: "fully-guided",
      deliverable: {
        catalogless: true,
        resolvedPath: "document.md",
        deliverable: {
          local_id: "document",
          name: "Document",
          kind: "work",
          overview: "Example",
          rulebook: "specdojo:example-rulebook",
          path: "document.md",
        },
      },
      targets: ["test:document"],
      stem: "test-refine",
      additionalConditions: "",
    });
    const plan = readFileSync(planPath, "utf8");
    expect(plan).toContain("cause=kata:recipe");
    expect(plan).toContain("cause=document");
    expect(plan).toContain("Document-only issue.");
  });
});
