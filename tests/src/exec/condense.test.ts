import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { dump } from "../../../src/shared/yaml.js";
import {
  CONDENSE_CATEGORIES,
  isCondenseRecords,
  type CondenseRecord,
} from "../../../src/shared/condense-records.js";
import { readSpecdojoNamespace } from "../../../src/docs/frontmatter-namespace.js";
import { kataCauseFindingsText } from "../../../src/exec/plans-kata-findings.js";
import { generateRegisterApproachPlan } from "../../../src/exec/plans.js";
import { buildExecutorEvidence, parseExecutorReport } from "../../../src/exec/evidence.js";
import {
  scaffoldResult,
  renderReporterResult,
  updateResultStatus,
  resetResultForClaim,
  readResultFrontmatterSnapshot,
  isResultUnfilled,
} from "../../../src/exec/results.js";
import { resolveKataRefs } from "../../../src/kata/kata.js";
import {
  STRATEGY_PHASE_SETS,
  STRATEGY_PROFILES,
  PHASE_SET_ORDER,
} from "../../../src/schedule/strategy-profiles.js";
import { buildValidator } from "../../helpers/schema.js";
import type { Approach } from "../../../src/shared/agent-types.js";

const sourceRoot = process.cwd();
const originalPackageRoot = process.env.SPECDOJO_PACKAGE_ROOT;
const validateResult = buildValidator(
  "docs/specdojo/schemas/v1/exec-result-frontmatter.schema.yaml",
);
const validateRecords = buildValidator("docs/specdojo/schemas/v1/condense-records.schema.yaml");
const validateEvidence = buildValidator("docs/specdojo/schemas/v1/exec-evidence.schema.yaml");
const kinds = ["rulebook", "recipe", "sample", "template"] as const;
let root: string;

function write(path: string, content: string): void {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), content);
}

function record(overrides: Partial<CondenseRecord> = {}): CondenseRecord {
  return {
    location: "## Example `depends_on` | item 2",
    category: "table-prose",
    action: "merge",
    reason: "Keep the constraint in the table.",
    cause: { type: "document" },
    ...overrides,
  };
}

function report(records: unknown): string {
  return `<specdojo_executor_evidence>${JSON.stringify({ completion_status: "complete", final_message: "condensed", condense_records: records })}</specdojo_executor_evidence>`;
}

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "specdojo-condense-"));
  write(
    ".specdojo/specdojo.config.json",
    JSON.stringify({
      version: 1,
      current_project: "test",
      kata_authority: "customer",
      projects: { test: { execution_path: "execution" } },
    }),
  );
  write("package.json", '{"name":"condense-fixture"}');
  write(
    "docs/ja/product/note.md",
    "---\nspecdojo:\n  id: test:note\n  type: project\n  status: draft\n  rulebook: customer:note-rulebook\n---\n\n# Example\n\nContent.\n",
  );
  for (const kind of kinds) {
    write(
      `docs/ja/specdojo/${kind}s/customer/note-${kind}.md`,
      `---\nspecdojo:\n  id: customer:note-${kind}\n  type: ${kind}\n  status: draft\n${kind === "rulebook" ? "  recipe: customer:note-recipe\n  sample: customer:note-sample\n  template: customer:note-template\n" : ""}---\n\n# ${kind}\n`,
    );
  }
  process.env.SPECDOJO_PACKAGE_ROOT = sourceRoot;
  process.chdir(root);
});

afterEach(() => {
  process.chdir(sourceRoot);
  if (originalPackageRoot === undefined) delete process.env.SPECDOJO_PACKAGE_ROOT;
  else process.env.SPECDOJO_PACKAGE_ROOT = originalPackageRoot;
  rmSync(root, { recursive: true, force: true });
});

describe("condense records and standard phases", () => {
  it("puts normal edit 080 between every standard refinement and review", () => {
    expect(STRATEGY_PHASE_SETS["condense-pass"][0]).toMatchObject({
      id: "condense",
      task_suffix: "080",
      execution: "agent",
      mode: "edit",
      approach: "condense",
      pipeline: { executor: "normal", reporter: "normal" },
    });
    for (const profile of Object.values(STRATEGY_PROFILES)) {
      const index = profile.phase_sets.indexOf("refine-pass");
      if (index < 0) continue;
      expect(profile.phase_sets[index + 1]).toBe("condense-pass");
      expect(profile.phase_sets[index + 2]).toMatch(/review-pass$/);
    }
    expect(PHASE_SET_ORDER.indexOf("condense-pass")).toBe(
      PHASE_SET_ORDER.indexOf("refine-pass") + 1,
    );
  });

  it.each(CONDENSE_CATEGORIES)("round-trips category %s and both causes", (category) => {
    const records = [
      record({ category }),
      ...kinds.map((kind) =>
        record({
          category,
          action: "retain",
          cause: { type: "kata" as const, kind, location: "## Questions" },
        }),
      ),
    ];
    expect(isCondenseRecords(records)).toBe(true);
    expect(validateRecords(records), JSON.stringify(validateRecords.errors)).toBe(true);
    const { evidence } = buildExecutorEvidence({
      taskId: "PJR-TEST",
      runId: "run-1",
      actor: "executor",
      status: "succeeded",
      startedAt: "2026-11-04T00:00:00Z",
      completedAt: "2026-11-04T00:01:00Z",
      exitCode: 0,
      attempts: 1,
      stdout: report(records),
      stderr: "",
      changes: [],
      diffStat: "",
      logRefPath: "executor.log",
    });
    expect(evidence.condense_records).toEqual(records);
    expect(validateEvidence(evidence), JSON.stringify(validateEvidence.errors)).toBe(true);
  });

  it.each(
    [
      [{ ...record(), category: "unknown" }],
      [{ ...record(), action: "rewrite" }],
      [{ ...record(), reason: " " }],
      [{ ...record(), cause: { type: "kata", kind: "recipe", location: " " } }],
      [{ ...record(), cause: { type: "document", kind: "recipe" } }],
      [{ ...record(), extra: "ignored?" }],
      "records",
    ].map((records) => ({ records })),
  )("rejects malformed records %j without reporting complete", ({ records }) => {
    expect(isCondenseRecords(records)).toBe(false);
    expect(validateRecords(records)).toBe(false);
    expect(parseExecutorReport(report(records)).completionStatus).toBe("incomplete");
  });

  it("renders executor records mechanically and preserves them through lifecycle updates", async () => {
    const { resultPath } = await scaffoldResult({
      executionPath: join(root, "execution"),
      taskId: "PJR-TEST",
      agent: "executor",
      mode: "edit",
      projectId: "test",
      planRef: "plan.md",
      startedAt: "2026-11-04T00:00:00Z",
      origin: "register",
      approach: "condense",
      targets: ["test:note"],
    });
    expect(readFileSync(resultPath, "utf8")).toContain("# Condense Result");
    const snapshot = readResultFrontmatterSnapshot(resultPath);
    const records = [
      record(),
      record({
        action: "retain",
        cause: { type: "kata", kind: "recipe", location: "## Questions | `depends_on`" },
      }),
    ];
    const { evidence } = buildExecutorEvidence({
      taskId: "PJR-TEST",
      runId: "run-1",
      actor: "executor",
      status: "succeeded",
      startedAt: "2026-11-04T00:00:00Z",
      completedAt: "2026-11-04T00:01:00Z",
      exitCode: 0,
      attempts: 1,
      stdout: report(records),
      stderr: "",
      changes: [],
      diffStat: "",
      logRefPath: "executor.log",
    });
    const output = {
      schema_version: 1 as const,
      mode: "edit" as const,
      summary: ["Condensed without changing decisions."],
      changed_files: [],
      handoff: [],
      approach: "Preserved required constraints.",
    };
    const validMeta = { ...snapshot, condense_records: records };
    expect(validateResult({ specdojo: validMeta }), JSON.stringify(validateResult.errors)).toBe(
      true,
    );
    expect(
      validateResult({
        specdojo: {
          ...validMeta,
          condense_records: [record({ cause: { type: "kata", kind: "recipe", location: " " } })],
        },
      }),
    ).toBe(false);
    expect(
      validateResult({ specdojo: { ...validMeta, targets: ["test:note", "test:other"] } }),
    ).toBe(false);
    await expect(
      renderReporterResult(resultPath, output, { ...evidence, condense_records: undefined }),
    ).rejects.toThrow(/condense_records/);
    await renderReporterResult(resultPath, output, evidence);
    let content = readFileSync(resultPath, "utf8");
    expect(content).toContain("# Condense Result");
    expect(content).toContain("## 5. 修正・保持の記録");
    expect(content).toContain("table-prose");
    expect(content).toContain("kata:recipe");
    expect(content).toContain("\\|");
    expect(isResultUnfilled(resultPath, "edit", snapshot)).toBe(false);
    for (const status of ["complete", "blocked", "superseded"] as const) {
      await updateResultStatus(resultPath, status, "2026-11-04T00:02:00Z");
      content = readFileSync(resultPath, "utf8");
      const meta = readSpecdojoNamespace(content);
      expect(meta.condense_records).toEqual(records);
      expect(validateResult({ specdojo: meta }), JSON.stringify(validateResult.errors)).toBe(true);
    }
    await resetResultForClaim(resultPath, "executor", "2026-11-04T00:03:00Z");
    expect(readSpecdojoNamespace(readFileSync(resultPath, "utf8")).condense_records).toEqual(
      records,
    );
    const resetSnapshot = readResultFrontmatterSnapshot(resultPath);
    writeFileSync(
      resultPath,
      readFileSync(resultPath, "utf8").replace("task_id: PJR-TEST", "task_id: PJR-OTHER"),
    );
    expect(isResultUnfilled(resultPath, "edit", resetSnapshot)).toBe(true);
  });
});

describe("condense feedback to Kata maintenance", { timeout: 30_000 }, () => {
  function result(stem: string, started: string, records: unknown, overrides = {}): void {
    write(
      `execution/exec/results/${stem}-result.md`,
      `---\n${dump({ specdojo: { id: `test:xer-${stem}`, type: "exec-result", project_id: "test", mode: "edit", approach: "condense", status: "complete", started_at: started, targets: ["test:note"], condense_records: records, ...overrides } })}---\n\n# Result\n`,
    );
  }

  it("routes a YAML deliverable through its declared rulebook", () => {
    write(
      "docs/ja/product/data.yaml",
      dump({
        id: "test:data",
        type: "project",
        status: "draft",
        rulebook: "customer:note-rulebook",
      }),
    );
    result(
      "yaml",
      "2026-11-04T00:00:00Z",
      [record({ cause: { type: "kata", kind: "recipe", location: "## Questions" } })],
      { targets: ["test:data"] },
    );
    const refs = resolveKataRefs("customer:note-rulebook");
    expect(kataCauseFindingsText("test", "recipe", refs.recipe)).toContain("test:data");
  });

  it.each(kinds)(
    "includes latest %s feedback and excludes document or unrelated causes",
    async (kind) => {
      const refs = resolveKataRefs("customer:note-rulebook");
      result("old", "2026-11-03T00:00:00Z", [
        record({
          location: "Superseded",
          cause: { type: "kata", kind, location: "Old Kata section" },
        }),
      ]);
      result("new", "2026-11-04T00:00:00Z", [
        record({
          location: "Current candidate",
          cause: { type: "kata", kind, location: "## Questions" },
        }),
        record({ location: "Document-only candidate" }),
        record({
          location: "Other kind",
          cause: {
            type: "kata",
            kind: kind === "recipe" ? "sample" : "recipe",
            location: "## Other",
          },
        }),
      ]);
      result("foreign", "2026-11-05T00:00:00Z", [record()], { project_id: "other" });
      result("blocked", "2026-11-05T00:00:00Z", [], { status: "blocked" });
      const planPath = await generateRegisterApproachPlan({
        projectId: "test",
        catalogPath: "",
        executionPath: join(root, "execution"),
        projectContext: [],
        taskId: "PJR-KATA",
        title: "Maintain",
        description: "Use condense feedback",
        approach: `${kind}-maintenance` as Approach,
        refs,
        targets: [`customer:note-${kind}`],
        stem: `maintain-${kind}`,
        additionalConditions: "",
      });
      const text = readFileSync(planPath, "utf8");
      expect(text).toContain("成果物から届いた Kata が原因の finding");
      expect(text).toContain("source=condense");
      expect(text).toContain("test:xer-new");
      expect(text).toContain("Current candidate");
      expect(text).toContain("## Questions");
      for (const absent of ["Superseded", "Document-only candidate", "Other kind"])
        expect(text).not.toContain(absent);
      result("newest", "2026-11-06T00:00:00Z", []);
      expect(kataCauseFindingsText("test", kind, refs[kind])).toBe("- なし");
      result("newest", "2026-11-06T00:00:00Z", [
        record({ cause: { type: "kata", kind, location: "## Questions" } }),
      ]);
      const path = "docs/ja/product/note.md";
      write(path, readFileSync(path, "utf8").replace("customer:note-rulebook", "none"));
      expect(kataCauseFindingsText("test", kind, refs[kind])).toBe("- なし");
    },
  );
});
