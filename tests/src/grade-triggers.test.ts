import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { discoverGradeTargets } from "../../src/grade.js";
import {
  gradeContentHash,
  resolveGradeResultsDirectory,
  gradeResultPath,
} from "../../src/grade-result.js";
import { writeGradeResult } from "../../src/grade-result.js";
import { tmpdir } from "node:os";
import { randomBytes } from "node:crypto";

describe("grade triggers", () => {
  let rootDir: string;
  let executionPath: string;

  beforeEach(() => {
    rootDir = join(tmpdir(), "specdojo-test-" + randomBytes(4).toString("hex"));
    executionPath = join(rootDir, "docs/ja/projects/prj-0001/execution");
    mkdirSync(join(rootDir, "docs/ja/specdojo/rulebooks"), { recursive: true });
    mkdirSync(join(rootDir, "docs/ja/specdojo/recipes"), { recursive: true });
    mkdirSync(join(rootDir, "docs/ja/projects/prj-0001/010-deliverables-catalog"), {
      recursive: true,
    });
    mkdirSync(join(rootDir, "docs/ja/projects/prj-0001/schedule"), { recursive: true });
    mkdirSync(executionPath, { recursive: true });

    // Config
    writeFileSync(
      join(rootDir, "docs/ja/specdojo/specdojo-config.yaml"),
      "version: 1\nprojects:\n  - id: prj-0001\n",
    );

    // Rulebook
    writeFileSync(
      join(rootDir, "docs/ja/specdojo/rulebooks/pjr-rulebook.md"),
      "---\nspecdojo:\n  id: specdojo:pjr-rulebook\n---\nbody\n",
    );

    // Recipe Kata
    writeFileSync(
      join(rootDir, "docs/ja/specdojo/recipes/my-recipe.md"),
      "---\nspecdojo:\n  id: specdojo:my-recipe\n  rulebook: specdojo:pjr-rulebook\n---\nbody\n",
    );

    // Unreviewed Kata
    writeFileSync(
      join(rootDir, "docs/ja/specdojo/recipes/unreviewed-recipe.md"),
      "---\nspecdojo:\n  id: specdojo:unreviewed-recipe\n  rulebook: specdojo:other-rulebook\n---\nbody\n",
    );

    // Catalog
    writeFileSync(
      join(rootDir, "docs/ja/projects/prj-0001/010-deliverables-catalog/dct-test.yaml"),
      "version: 1\nproject_id: prj-0001\nbase_path: docs/ja/projects/prj-0001/controls\ngroups:\n  - id: g1\n    deliverables:\n      - local_id: doc-a\n        path: doc-a.md\n        depends_on: [doc-b]\n      - local_id: doc-b\n        path: doc-b.md\n      - local_id: doc-c\n        path: doc-c.md\n",
    );

    // Deliverables
    mkdirSync(join(rootDir, "docs/ja/projects/prj-0001/controls"), { recursive: true });
    writeFileSync(
      join(rootDir, "docs/ja/projects/prj-0001/controls/doc-a.md"),
      "---\nspecdojo:\n  id: prj-0001:doc-a\n---\nbody\n",
    );
    writeFileSync(
      join(rootDir, "docs/ja/projects/prj-0001/controls/doc-b.md"),
      "---\nspecdojo:\n  id: prj-0001:doc-b\n---\nbody\n",
    );
    writeFileSync(
      join(rootDir, "docs/ja/projects/prj-0001/controls/doc-c.md"),
      "---\nspecdojo:\n  id: prj-0001:doc-c\n---\nbody\n",
    );

    // Schedule
    writeFileSync(
      join(rootDir, "docs/ja/projects/prj-0001/schedule/sch-track-test.yaml"),
      'kind: track\nid: prj-0001:sch-track-test\ntrack: test\ntasks:\n  - local_id: my-recipe\n    phase_id: recipe-consolidate\n    phase_suffix: "10"\n  - local_id: doc-a\n    phase_id: review\n    phase_suffix: "20"\n  - local_id: doc-b\n    phase_id: review\n    phase_suffix: "30"\n',
    );
  });

  afterEach(() => {
    rmSync(rootDir, { recursive: true, force: true });
  });

  it("should detect dependency changed", () => {
    writeGradeResult(
      gradeResultPath(resolveGradeResultsDirectory("prj-0001", rootDir), "prj-0001:doc-a"),
      {
        version: 1,
        document: "prj-0001:doc-a",
        path: "docs/ja/projects/prj-0001/controls/doc-a.md",
        target: "deliverable",
        rubric: "r1",
        verdict: "pass",
        score: 100,
        graded_at: new Date(1000).toISOString(),
        graded_by: "executor",
        content_hash: "hash",
        categories: {},
        viewpoints: {},
        finding_counts: { blocker: 0, major: 0, minor: 0, note: 0 },
        findings: [],
      },
    );

    writeGradeResult(
      gradeResultPath(resolveGradeResultsDirectory("prj-0001", rootDir), "prj-0001:doc-b"),
      {
        version: 1,
        document: "prj-0001:doc-b",
        path: "docs/ja/projects/prj-0001/controls/doc-b.md",
        target: "deliverable",
        rubric: "r1",
        verdict: "pass",
        score: 100,
        graded_at: new Date(2000).toISOString(),
        graded_by: "executor",
        content_hash: "hash",
        categories: {},
        viewpoints: {},
        finding_counts: { blocker: 0, major: 0, minor: 0, note: 0 },
        findings: [],
      },
    );

    const targets = discoverGradeTargets(
      {
        target: "deliverable",
        project: "prj-0001",
        dependencyChanged: true,
      },
      rootDir,
    );

    expect(targets).toContain(join(rootDir, "docs/ja/projects/prj-0001/controls/doc-a.md"));
    expect(targets).not.toContain(join(rootDir, "docs/ja/projects/prj-0001/controls/doc-b.md"));
  });

  it("should not detect dependency changed if dependency is older", () => {
    writeGradeResult(
      gradeResultPath(resolveGradeResultsDirectory("prj-0001", rootDir), "prj-0001:doc-a"),
      {
        version: 1,
        document: "prj-0001:doc-a",
        path: "docs/ja/projects/prj-0001/controls/doc-a.md",
        target: "deliverable",
        rubric: "r1",
        verdict: "pass",
        score: 100,
        graded_at: new Date(2000).toISOString(),
        graded_by: "executor",
        content_hash: "hash",
        categories: {},
        viewpoints: {},
        finding_counts: { blocker: 0, major: 0, minor: 0, note: 0 },
        findings: [],
      },
    );

    writeGradeResult(
      gradeResultPath(resolveGradeResultsDirectory("prj-0001", rootDir), "prj-0001:doc-b"),
      {
        version: 1,
        document: "prj-0001:doc-b",
        path: "docs/ja/projects/prj-0001/controls/doc-b.md",
        target: "deliverable",
        rubric: "r1",
        verdict: "pass",
        score: 100,
        graded_at: new Date(1000).toISOString(),
        graded_by: "executor",
        content_hash: "hash",
        categories: {},
        viewpoints: {},
        finding_counts: { blocker: 0, major: 0, minor: 0, note: 0 },
        findings: [],
      },
    );

    const targets = discoverGradeTargets(
      {
        target: "deliverable",
        project: "prj-0001",
        dependencyChanged: true,
      },
      rootDir,
    );

    expect(targets).not.toContain(join(rootDir, "docs/ja/projects/prj-0001/controls/doc-a.md"));
  });

  it("should detect kata rulebook updated", () => {
    writeGradeResult(
      gradeResultPath(resolveGradeResultsDirectory("prj-0001", rootDir), "specdojo:my-recipe"),
      {
        version: 1,
        document: "specdojo:my-recipe",
        path: "docs/ja/specdojo/recipes/my-recipe.md",
        target: "kata",
        rubric: "r1",
        verdict: "pass",
        score: 100,
        graded_at: new Date(1000).toISOString(),
        graded_by: "executor",
        content_hash: "hash",
        categories: {},
        viewpoints: {},
        finding_counts: { blocker: 0, major: 0, minor: 0, note: 0 },
        findings: [],
      },
    );

    writeGradeResult(
      gradeResultPath(resolveGradeResultsDirectory("prj-0001", rootDir), "specdojo:pjr-rulebook"),
      {
        version: 1,
        document: "specdojo:pjr-rulebook",
        path: "docs/ja/specdojo/rulebooks/pjr-rulebook.md",
        target: "kata",
        rubric: "r1",
        verdict: "pass",
        score: 100,
        graded_at: new Date(2000).toISOString(),
        graded_by: "executor",
        content_hash: "hash",
        categories: {},
        viewpoints: {},
        finding_counts: { blocker: 0, major: 0, minor: 0, note: 0 },
        findings: [],
      },
    );

    const targets = discoverGradeTargets(
      {
        target: "kata",
        project: "prj-0001",
        rulebookChanged: true,
      },
      rootDir,
    );

    expect(targets).toContain(join(rootDir, "docs/ja/specdojo/recipes/my-recipe.md"));
  });

  it("should detect unreviewed documents", () => {
    const kataPath = join(rootDir, "docs/ja/specdojo/recipes/unreviewed-recipe.md");
    const deliverablePath = join(rootDir, "docs/ja/projects/prj-0001/controls/doc-c.md");
    const targets = discoverGradeTargets(
      {
        target: "kata",
        project: "prj-0001",
        unreviewed: true,
      },
      rootDir,
    );

    expect(targets).toContain(kataPath);
    expect(targets).not.toContain(join(rootDir, "docs/ja/specdojo/recipes/my-recipe.md"));

    const targetsDel = discoverGradeTargets(
      {
        target: "deliverable",
        project: "prj-0001",
        unreviewed: true,
      },
      rootDir,
    );

    expect(targetsDel).toContain(deliverablePath);
    expect(targetsDel).not.toContain(join(rootDir, "docs/ja/projects/prj-0001/controls/doc-a.md"));

    for (const [path, document, target] of [
      [kataPath, "specdojo:unreviewed-recipe", "kata"],
      [deliverablePath, "prj-0001:doc-c", "deliverable"],
    ] as const) {
      const content = readFileSync(path, "utf8");
      writeGradeResult(
        gradeResultPath(resolveGradeResultsDirectory("prj-0001", rootDir), document),
        {
          version: 1,
          document,
          path: path.slice(rootDir.length + 1),
          target,
          rubric: "r1",
          verdict: "pass",
          score: 100,
          graded_at: new Date(1000).toISOString(),
          graded_by: "executor",
          content_hash: gradeContentHash(content),
          categories: {},
          viewpoints: {},
          finding_counts: { blocker: 0, major: 0, minor: 0, note: 0 },
          findings: [],
        },
      );
    }

    expect(
      discoverGradeTargets({ target: "kata", project: "prj-0001", unreviewed: true }, rootDir),
    ).not.toContain(kataPath);
    expect(
      discoverGradeTargets(
        { target: "deliverable", project: "prj-0001", unreviewed: true },
        rootDir,
      ),
    ).not.toContain(deliverablePath);

    writeFileSync(kataPath, `${readFileSync(kataPath, "utf8")}changed\n`);
    writeFileSync(deliverablePath, `${readFileSync(deliverablePath, "utf8")}changed\n`);

    expect(
      discoverGradeTargets({ target: "kata", project: "prj-0001", unreviewed: true }, rootDir),
    ).toContain(kataPath);
    expect(
      discoverGradeTargets(
        { target: "deliverable", project: "prj-0001", unreviewed: true },
        rootDir,
      ),
    ).toContain(deliverablePath);
  });
});
