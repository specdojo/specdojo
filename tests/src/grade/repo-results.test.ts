import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { applyGradeSubmission } from "../../../src/grade/apply.js";
import { renderGradePlan } from "../../../src/grade/plan.js";
import { migrateInlineGrades } from "../../../src/grade/markdown.js";
import { loadViewpoints } from "../../../src/grade/targets.js";
import {
  gradeResultPathForDocument,
  readGradeResult,
  readGradeResultForDocument,
} from "../../../src/grade/result.js";
import { readDashboardGradeResults } from "../../../src/dashboard/dashboard.js";
import { writeGradeRunFixture } from "../../helpers/grade-run-fixture.js";

const originalCwd = process.cwd();
const documents = [
  { path: "document.md", result: "shared-document.yaml", message: "Project finding." },
  {
    path: "../api-checkout/document.md",
    result: "api/shared-document.yaml",
    message: "API finding.",
  },
  {
    path: "../web-checkout/document.md",
    result: "web/shared-document.yaml",
    message: "Web finding.",
  },
];
const markdown = `---
specdojo:
  id: shared-document
  type: project
  status: draft
  rulebook: none
---

# Shared document

Content to grade.
`;
let directory: string;
let projectRoot: string;

beforeEach(() => {
  directory = mkdtempSync(join(tmpdir(), "specdojo-grade-repos-"));
  projectRoot = join(directory, "project");
  writeGradeRunFixture(projectRoot);
  const configPath = join(projectRoot, ".specdojo/specdojo.config.json");
  const config = JSON.parse(readFileSync(configPath, "utf8"));
  config.projects.test.repos = [
    { name: "api", path: "../api-checkout" },
    { name: "web", path: "../web-checkout" },
  ];
  // Explicit project selection must also control the result namespace.
  config.current_project = "other";
  config.projects.other = {};
  writeFileSync(configPath, JSON.stringify(config));
  for (const document of documents) {
    const path = join(projectRoot, document.path);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, markdown);
  }
  process.chdir(projectRoot);
});

afterEach(() => {
  process.chdir(originalCwd);
  rmSync(directory, { recursive: true, force: true });
});

describe("grade results across repositories", () => {
  it.each([undefined, "custom/results"])(
    "isolates apply, prior findings and dashboard results (directory=%s)",
    (customDirectory) => {
      const resultsDirectory = customDirectory ?? "execution/grade/results";
      const viewpoints = loadViewpoints("test");
      const apply = (selected: typeof documents) =>
        applyGradeSubmission({
          submission: {
            rubric: "grade-rubric-v1",
            documents: selected.map(({ path, message }) => ({
              path,
              viewpoints: [
                { id: "vp-content", level: 2, findings: [{ severity: "major", message }] },
              ],
            })),
          },
          target: "deliverable",
          project: "test",
          viewpoints,
          gradedBy: "actual-grader",
          resultsDirectory,
        });

      // An existing unscoped result still belongs to the project repository.
      apply([documents[0]]);
      expect(
        readGradeResult(
          gradeResultPathForDocument({
            documentPath: documents[1].path,
            project: "test",
            resultsDirectory: customDirectory,
          }),
        ),
      ).toBeUndefined();
      expect(
        renderGradePlan({
          target: "deliverable",
          path: documents[1].path,
          projectId: "test",
          viewpoints,
          resultsDirectory: customDirectory,
        }),
      ).not.toContain(documents[0].message);

      apply(documents.slice(1));
      for (const document of documents) {
        const path = gradeResultPathForDocument({
          documentPath: document.path,
          project: "test",
          resultsDirectory: customDirectory,
        });
        expect(path).toBe(join(projectRoot, resultsDirectory, document.result));
        const result = readGradeResult(path);
        expect(result).toMatchObject({
          document: "shared-document",
          path: document.path,
          findings: [expect.objectContaining({ message: document.message })],
        });
        if (!customDirectory) {
          expect(
            readGradeResultForDocument({ documentPath: document.path, project: "test" }),
          ).toEqual(result);
        }
        const plan = renderGradePlan({
          target: "deliverable",
          path: document.path,
          projectId: "test",
          viewpoints,
          resultsDirectory: customDirectory,
        });
        expect(plan).toContain(document.message);
        for (const other of documents.filter((entry) => entry !== document)) {
          expect(plan).not.toContain(other.message);
        }
      }
      expect(
        readDashboardGradeResults(resultsDirectory)
          .map((result) => result.path)
          .sort(),
      ).toEqual(documents.map((document) => document.path).sort());

      const snapshots = documents.map((document) =>
        readFileSync(join(resultsDirectory, document.result), "utf8"),
      );
      apply([{ ...documents[1], message: "Updated API finding." }]);
      expect(readFileSync(join(resultsDirectory, documents[0].result), "utf8")).toBe(snapshots[0]);
      expect(readFileSync(join(resultsDirectory, documents[2].result), "utf8")).toBe(snapshots[2]);
      expect(readFileSync(join(resultsDirectory, documents[1].result), "utf8")).toContain(
        "Updated API finding.",
      );
      expect(documents.map((document) => readFileSync(document.path, "utf8"))).toEqual(
        documents.map(() => markdown),
      );
    },
  );

  it("uses the supplied root and handles nested repositories without matching path prefixes", () => {
    const configPath = ".specdojo/specdojo.config.json";
    const config = JSON.parse(readFileSync(configPath, "utf8"));
    config.projects.test.repos.push({ name: "nested", path: "products/api" });
    writeFileSync(configPath, JSON.stringify(config));
    for (const path of ["products/api/document.md", "products/api-other/document.md"]) {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, markdown);
    }
    process.chdir(originalCwd);
    expect(
      gradeResultPathForDocument({
        documentPath: "products/api/document.md",
        project: "test",
        rootDir: projectRoot,
      }),
    ).toBe(join(projectRoot, "execution/grade/results/nested/shared-document.yaml"));
    expect(
      gradeResultPathForDocument({
        documentPath: "products/api-other/document.md",
        project: "test",
        rootDir: projectRoot,
      }),
    ).toBe(join(projectRoot, "execution/grade/results/shared-document.yaml"));
  });

  it("uses repository names for sibling worktrees instead of the main checkout paths", () => {
    const gitDirectory = join(directory, "git-metadata");
    mkdirSync(gitDirectory);
    writeFileSync(join(projectRoot, ".git"), `gitdir: ${gitDirectory}\n`);
    const taskName = basename(directory);
    writeFileSync(join(gitDirectory, "HEAD"), `ref: refs/heads/exec/${taskName}\n`);
    for (const repo of ["api", "web"]) {
      mkdirSync(join(directory, repo));
      writeFileSync(join(directory, repo, "document.md"), markdown);
    }
    // Config validation checks every declared sibling worktree on each lookup.
    for (const repo of ["api", "web"]) {
      expect(
        gradeResultPathForDocument({ documentPath: `../${repo}/document.md`, project: "test" }),
      ).toBe(join(projectRoot, `execution/grade/results/${repo}/shared-document.yaml`));
    }
    expect(gradeResultPathForDocument({ documentPath: "document.md", project: "test" })).toBe(
      join(projectRoot, "execution/grade/results/shared-document.yaml"),
    );
  });

  it("migrates inline grades into repository-specific result files", () => {
    const legacy = markdown.replace(
      "  rulebook: none\n",
      `  rulebook: none
  grade:
    target: deliverable
    rubric: grade-rubric-v1
    verdict: pass
    score: 100
    graded_at: "2026-10-27T00:00:00Z"
    graded_by: actual-grader
    categories: {}
    viewpoints: {}
`,
    );
    for (const document of documents) writeFileSync(document.path, legacy);
    migrateInlineGrades({
      project: "test",
      target: "deliverable",
      paths: documents.map((document) => document.path),
    });
    for (const document of documents) {
      expect(
        readGradeResultForDocument({ documentPath: document.path, project: "test" }),
      ).toMatchObject({ document: "shared-document", path: document.path, score: 100 });
      expect(readFileSync(document.path, "utf8")).not.toContain("  grade:");
    }
  });
});
