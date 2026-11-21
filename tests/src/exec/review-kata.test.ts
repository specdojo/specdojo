import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { dump } from "js-yaml";
import { findDeliverableInfo } from "../../../src/exec/plans-core.js";
import { generateSinglePlan } from "../../../src/exec/plans.js";
import {
  enforceKataReviewVerdict,
  kataReviewSummary,
  kataReviewVerdict,
  scheduleKataReviewSubjects,
} from "../../../src/exec/review-kata.js";
import {
  gradeBeforeReviewPlan,
  enforceScheduleKataReview,
} from "../../../src/exec/run/schedule-prepare.js";
import type { ReadyTaskView } from "../../../src/exec/types.js";
import * as reviewGrade from "../../../src/review/grade.js";
import { gradeContentHash, gradeResultPathForDocument } from "../../../src/shared/grade-result.js";
import type { GradeResult } from "../../../src/shared/grade-result.js";

const previous = process.cwd();
let root: string;
const rulebookPath = "docs/ja/specdojo/rulebooks/test-rulebook.md";
const samplePath = "docs/ja/specdojo/samples/test-sample.md";
const secondSample = "docs/ja/specdojo/samples/second-sample.yaml";
const task: ReadyTaskView = {
  id: "T-KATA-overview-090",
  local_id: "overview",
  mode: "review",
  approach: "fully-guided",
  // ready/cpm snapshots store schedule_file relative to the schedule directory (PJR-X05N).
  schedule_file: "sch-track-kata.yaml",
  fifo_rank: 1,
  critical_first_rank: 1,
};

function write(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}
function strategy(intent = "improve-kata"): void {
  write(
    "schedule/sch-strategy-kata.yaml",
    dump({
      track: "kata",
      approach_rules: [
        {
          local_ids: ["overview"],
          intent,
          kata_target: "rulebook",
          ...(intent === "bootstrap-kata-set" ? { bootstrap_scope: ["rulebook", "sample"] } : {}),
        },
      ],
    }),
  );
}
function subjects() {
  return scheduleKataReviewSubjects(task, findDeliverableInfo("catalog", "overview"), "test");
}
function grade(path: string, verdict: GradeResult["verdict"] = "pass"): void {
  const result: GradeResult = {
    version: 1,
    document: path === rulebookPath ? "specdojo:test-rulebook" : "specdojo:test-sample",
    path,
    target: "kata",
    rubric: "grade-rubric-v2",
    verdict,
    score: verdict === "pass" ? 100 : 50,
    graded_at: "2026-11-14T00:00:00Z",
    graded_by: "test",
    content_hash: gradeContentHash(readFileSync(path, "utf8")),
    categories: {},
    viewpoints: {},
    finding_counts: { blocker: 0, major: 0, minor: 0, note: 0 },
    findings: [],
  };
  write(
    gradeResultPathForDocument({ documentPath: path, project: "test", rootDir: root }),
    dump(result),
  );
}

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "specdojo-review-kata-"));
  process.chdir(root);
  write(
    ".specdojo/specdojo.config.json",
    JSON.stringify({
      version: 1,
      current_project: "test",
      projects: { test: { execution_path: "execution" } },
    }),
  );
  write(
    "catalog/dct-test.yaml",
    dump({
      id: "test:dct",
      domain: "test",
      base_path: "/docs",
      groups: [
        {
          deliverables: [
            {
              local_id: "overview",
              name: "Overview",
              kind: "work",
              path: "overview.md",
              rulebook: "specdojo:test-rulebook",
              done_criteria: [],
            },
          ],
        },
      ],
    }),
  );
  write("docs/overview.md", "---\nspecdojo:\n  id: test:overview\n---\n\n# Overview\n");
  write(
    rulebookPath,
    "---\nspecdojo:\n  id: specdojo:test-rulebook\n  sample: specdojo:test-sample\n  recipe: not-needed\n  template: not-needed\n---\n\n# Rulebook\n",
  );
  write(samplePath, "---\nspecdojo:\n  id: specdojo:test-sample\n---\n\n# Sample\n");
  strategy();
});
afterEach(() => {
  vi.restoreAllMocks();
  process.chdir(previous);
  rmSync(root, { recursive: true, force: true });
});

describe("schedule kata review", () => {
  it.each(["improve-kata", "bootstrap-kata-set"])(
    "%s grades the representative and the declared kata sequentially",
    async (intent) => {
      strategy(intent);
      let active = false;
      const invoke = vi.spyOn(reviewGrade, "ensureReviewGrade").mockImplementation(async () => {
        expect(active).toBe(false);
        active = true;
        await Promise.resolve();
        active = false;
        return { action: "executed", runId: "test" };
      });
      await gradeBeforeReviewPlan({
        task,
        projectId: "test",
        catalogPath: "catalog",
        repoRoot: root,
        dryRun: false,
      });
      expect(invoke.mock.calls.map(([options]) => [options.subjectPath, options.target])).toEqual([
        ["docs/overview.md", "deliverable"],
        [rulebookPath, "kata"],
        [samplePath, "kata"],
      ]);
    },
  );

  it("resolves a bootstrap-kata-set strategy from the configured schedule directory, as in kata-wave-2", async () => {
    const wave2Task: ReadyTaskView = {
      ...task,
      id: "T-KATA-WAVE-2-overview-090",
      approach: "retrofit",
      schedule_file: "sch-track-kata-wave-2.yaml",
    };
    write(
      "schedule/sch-strategy-kata-wave-2.yaml",
      dump({
        track: "kata-wave-2",
        approach_rules: [
          {
            local_ids: ["overview"],
            intent: "bootstrap-kata-set",
            bootstrap_scope: ["rulebook", "sample"],
          },
        ],
      }),
    );
    const invoke = vi
      .spyOn(reviewGrade, "ensureReviewGrade")
      .mockResolvedValue({ action: "executed", runId: "test" });

    await gradeBeforeReviewPlan({
      task: wave2Task,
      projectId: "test",
      catalogPath: "catalog",
      repoRoot: root,
      dryRun: false,
    });

    expect(
      invoke.mock.calls
        .filter(([options]) => options.target === "kata")
        .map(([options]) => options.subjectPath),
    ).toEqual([rulebookPath, samplePath]);
  });

  it("keeps ordinary reviews and other tracks out of the kata gate", () => {
    strategy("author-deliverable");
    expect(subjects()).toEqual([]);
    strategy();
    expect(
      scheduleKataReviewSubjects(
        { ...task, schedule_file: "sch-track-other.yaml" },
        findDeliverableInfo("catalog", "overview"),
        "test",
      ),
    ).toEqual([]);
  });

  it("includes every declared sample, recipe and template, including YAML", () => {
    write(secondSample, "id: specdojo:second-sample\n");
    write(
      rulebookPath,
      "---\nspecdojo:\n  id: specdojo:test-rulebook\n  sample: [specdojo:test-sample, specdojo:second-sample]\n  recipe: specdojo:test-recipe\n  template: specdojo:test-template\n---\n",
    );
    expect(subjects().map((subject) => subject.path)).toEqual([
      rulebookPath,
      "docs/ja/specdojo/recipes/test-recipe.md",
      samplePath,
      secondSample,
      "docs/ja/specdojo/templates/test-template.md",
    ]);
  });

  it("does not hide unresolved required kata, while allowing an explicitly unnecessary sample", () => {
    write(rulebookPath, "---\nspecdojo:\n  id: specdojo:test-rulebook\n  sample: undecided\n---\n");
    expect(subjects()).toContainEqual({ label: "sample", path: "_MISSING_" });
    expect(kataReviewVerdict(subjects(), "test", root)).toBe("grade-stale");
    write(
      rulebookPath,
      "---\nspecdojo:\n  id: specdojo:test-rulebook\n  sample: not-needed\n---\n",
    );
    expect(subjects()).toEqual([{ path: rulebookPath, label: "rulebook" }]);
  });

  it.each(["needs-work", "fail"] as const)(
    "a fresh %s prevents both completion verdicts",
    (verdict) => {
      grade(rulebookPath);
      grade(samplePath, verdict);
      expect(kataReviewVerdict(subjects(), "test", root)).toBe("incomplete");
      for (const completion of ["complete", "complete-with-findings"]) {
        write("result.md", `# Review Result\n\n- verdict: ${completion}\n`);
        enforceScheduleKataReview({
          task,
          catalogPath: "catalog",
          resultPath: "result.md",
          projectId: "test",
          rootDir: root,
        });
        expect(readFileSync("result.md", "utf8")).toContain("- verdict: incomplete");
      }
    },
  );

  it("permits pass, retains an incomplete judgement, and detects stale/missing/unreadable grades", () => {
    grade(rulebookPath);
    grade(samplePath);
    expect(kataReviewVerdict(subjects(), "test", root)).toBeUndefined();
    write("result.md", "- verdict: incomplete\n");
    enforceKataReviewVerdict("result.md", subjects(), "test", root);
    expect(readFileSync("result.md", "utf8")).toBe("- verdict: incomplete\n");
    write(samplePath, `${readFileSync(samplePath, "utf8")}changed\n`);
    expect(kataReviewVerdict(subjects(), "test", root)).toBe("grade-stale");
    const sidecar = gradeResultPathForDocument({
      documentPath: samplePath,
      project: "test",
      rootDir: root,
    });
    write(sidecar, "version: 2\n");
    expect(kataReviewVerdict(subjects(), "test", root)).toBe("grade-unavailable");
    rmSync(sidecar);
    expect(kataReviewVerdict(subjects(), "test", root)).toBe("grade-stale");
  });

  it("renders all kata grades and the pass gate in the generated review plan", async () => {
    grade(rulebookPath);
    grade(samplePath, "needs-work");
    const plan = await generateSinglePlan({
      projectId: "test",
      executionPath: "execution",
      catalogPath: "catalog",
      task,
      projectContext: [],
    });
    expect(existsSync(plan)).toBe(true);
    const content = readFileSync(plan, "utf8");
    expect(content).toContain(`\`${rulebookPath}\``);
    expect(content).toContain(`\`${samplePath}\``);
    expect(content).toContain("`needs-work`");
    expect(content).toContain("`complete-with-findings` でも完了扱いにしない");
    expect(kataReviewSummary(subjects(), "test")).toContain("`pass`");
  });
});
