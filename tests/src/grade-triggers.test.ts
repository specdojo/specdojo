import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { discoverGradeTargets, resolveGradeSourceHashes } from "../../src/grade.js";
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

  function writeDeliverableResult(
    localId: string,
    fields: { gradedAt?: number; contentHash?: string; sourceHashes?: Record<string, string> },
  ): void {
    writeGradeResult(
      gradeResultPath(resolveGradeResultsDirectory("prj-0001", rootDir), `prj-0001:${localId}`),
      {
        version: 1,
        document: `prj-0001:${localId}`,
        path: `docs/ja/projects/prj-0001/controls/${localId}.md`,
        target: "deliverable",
        rubric: "r1",
        verdict: "pass",
        score: 100,
        graded_at: new Date(fields.gradedAt ?? 1000).toISOString(),
        graded_by: "executor",
        content_hash: fields.contentHash ?? "hash",
        ...(fields.sourceHashes ? { source_hashes: fields.sourceHashes } : {}),
        categories: {},
        viewpoints: {},
        finding_counts: { blocker: 0, major: 0, minor: 0, note: 0 },
        findings: [],
      },
    );
  }

  function deliverableHash(localId: string): string {
    return gradeContentHash(
      readFileSync(join(rootDir, `docs/ja/projects/prj-0001/controls/${localId}.md`), "utf8"),
    );
  }

  const docAPath = () => join(rootDir, "docs/ja/projects/prj-0001/controls/doc-a.md");

  it("selects a deliverable whose dependency content differs from the recorded hash", () => {
    writeDeliverableResult("doc-a", { sourceHashes: { "dependency:doc-b": "0".repeat(64) } });

    const targets = discoverGradeTargets(
      { target: "deliverable", project: "prj-0001", dependencyChanged: true },
      rootDir,
    );

    expect(targets).toEqual([docAPath()]);
  });

  it("selects a deliverable whose result predates dependency hash tracking", () => {
    writeDeliverableResult("doc-a", {});

    const targets = discoverGradeTargets(
      { target: "deliverable", project: "prj-0001", dependencyChanged: true },
      rootDir,
    );

    expect(targets).toEqual([docAPath()]);
  });

  it("does not select a deliverable when only the dependency was re-graded", () => {
    writeDeliverableResult("doc-a", {
      gradedAt: 1000,
      sourceHashes: { "dependency:doc-b": deliverableHash("doc-b") },
    });
    writeDeliverableResult("doc-b", { gradedAt: 2000 });

    const targets = discoverGradeTargets(
      { target: "deliverable", project: "prj-0001", dependencyChanged: true },
      rootDir,
    );

    expect(targets).not.toContain(docAPath());
  });

  describe("changed-only with comparison sources", () => {
    const viewpointsPath = () =>
      join(rootDir, "docs/ja/projects/prj-0001/030-project-management/pm-review-viewpoints.yaml");
    const membersPath = () =>
      join(rootDir, "docs/ja/projects/prj-0001/030-project-management/pm-members.yaml");

    beforeEach(() => {
      mkdirSync(join(rootDir, "docs/ja/projects/prj-0001/030-project-management"), {
        recursive: true,
      });
      writeFileSync(
        viewpointsPath(),
        [
          "id: prj-0001:pm-review-viewpoints",
          "viewpoints:",
          "  - id: vp-arc-cross-document-consistency",
          "    role: ARC",
          "    category: consistency",
          "    title: 成果物間整合",
          "    check: 突き合わせる",
          "    evidence: 突き合わせ先",
          "    default_severity: major",
          "    evaluation: referential",
          "    continuous: true",
          "    grade_targets: [deliverable]",
          "    comparison_sources: [catalog-entry, dependencies, members]",
          "",
        ].join("\n"),
      );
      writeFileSync(membersPath(), "members: []\n");
    });

    const catalogPath = () =>
      join(rootDir, "docs/ja/projects/prj-0001/010-deliverables-catalog/dct-test.yaml");

    function recordGradeWithCurrentSources(): void {
      writeDeliverableResult("doc-a", {
        contentHash: deliverableHash("doc-a"),
        sourceHashes: resolveGradeSourceHashes(
          { path: docAPath(), target: "deliverable", project: "prj-0001" },
          rootDir,
        ),
      });
    }

    function changedOnlyTargets(): string[] {
      return discoverGradeTargets(
        { target: "deliverable", project: "prj-0001", changedOnly: true },
        rootDir,
      );
    }

    it("records the declared sources and the resolvable dependencies", () => {
      const hashes = resolveGradeSourceHashes(
        { path: docAPath(), target: "deliverable", project: "prj-0001" },
        rootDir,
      );

      expect(Object.keys(hashes)).toEqual(["catalog-entry", "dependency:doc-b", "members"]);
      expect(hashes["dependency:doc-b"]).toBe(deliverableHash("doc-b"));
      expect(hashes.members).toBe(gradeContentHash(readFileSync(membersPath(), "utf8")));
    });

    it("does not select a deliverable whose content and sources are unchanged", () => {
      recordGradeWithCurrentSources();

      expect(changedOnlyTargets()).not.toContain(docAPath());
    });

    it("selects a graded deliverable whose result has no source hashes", () => {
      writeDeliverableResult("doc-a", { contentHash: deliverableHash("doc-a") });

      expect(changedOnlyTargets()).toContain(docAPath());
    });

    it("selects an unchanged deliverable when a member definition changes", () => {
      recordGradeWithCurrentSources();

      writeFileSync(membersPath(), "members:\n  - nickname: new-member\n");

      expect(changedOnlyTargets()).toContain(docAPath());
    });

    it("selects an unchanged deliverable when a dependency changes", () => {
      recordGradeWithCurrentSources();

      const dependency = join(rootDir, "docs/ja/projects/prj-0001/controls/doc-b.md");
      writeFileSync(dependency, `${readFileSync(dependency, "utf8")}changed\n`);

      expect(changedOnlyTargets()).toContain(docAPath());
    });

    it("selects a deliverable only when its own catalog entry changes", () => {
      recordGradeWithCurrentSources();

      writeFileSync(
        catalogPath(),
        readFileSync(catalogPath(), "utf8").replace(
          "      - local_id: doc-c\n        path: doc-c.md\n",
          "      - local_id: doc-c\n        path: doc-c.md\n        depends_on: [doc-b]\n",
        ),
      );
      expect(changedOnlyTargets()).not.toContain(docAPath());

      writeFileSync(
        catalogPath(),
        readFileSync(catalogPath(), "utf8").replace(
          "        depends_on: [doc-b]\n      - local_id: doc-b",
          "        depends_on: [doc-b, doc-c]\n      - local_id: doc-b",
        ),
      );
      expect(changedOnlyTargets()).toContain(docAPath());
    });
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
