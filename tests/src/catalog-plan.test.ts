import { describe, expect, it } from "vitest";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import {
  buildPlanSkeleton,
  diffPlanText,
  domainFromPlanFileName,
  dumpPlan,
  isDctPlanFileName,
  listPlanFiles,
  loadTemplateForDomain,
  resolvePlanInputs,
  resolvePlanPath,
  validateDctPlan,
  validatePlanSchema,
  writePlan,
  type DctPlan,
  type DctPlanDeliverable,
} from "../../src/catalog-plan.js";
import { renderPlanPrompt } from "../../src/catalog-plan-prompt.js";
import type { DctTemplateDoc } from "../../src/catalog-types.js";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

const dataFlowTemplate: DctTemplateDoc = {
  id: "specdojo:dct-data-flow-template",
  type: "template",
  status: "draft",
  title: "成果物カタログ（データフロー）",
  rulebook: "specdojo:dct-rulebook",
  domain: "data-flow",
  base_path: "/docs/ja/product/010-business-specs/010-data-flow",
  groups: [
    {
      deliverables: [
        {
          local_id: "cdfd-_TERM_",
          name: "概念データフロー図",
          kind: "work",
          overview: "対象業務の全体構成・情報の流れ・業務主体を可視化し定義する",
          path: "cdfd-_TERM_.md",
        },
      ],
    },
  ],
};

function planDeliverable(overrides: Partial<DctPlanDeliverable> = {}): DctPlanDeliverable {
  return {
    local_id: "cdfd-sales",
    name: "概念データフロー図（販売）",
    kind: "work",
    template_local_id: "cdfd-_TERM_",
    variables: [
      {
        name: "TERM",
        value: "sales",
        evidence: ["docs/ja/product/010-business-specs/010-data-flow/cdfd-overview.md"],
        rationale: "業務領域として販売が独立して記述されている",
      },
    ],
    evidence: ["docs/ja/product/010-business-specs/010-data-flow/cdfd-overview.md"],
    rationale: "販売業務のデータフローを個別に定義する必要がある",
    confidence: "high",
    ...overrides,
  };
}

function basePlan(overrides: Partial<DctPlan> = {}): DctPlan {
  return {
    id: "prj-0001:dct-plan-data-flow",
    type: "project",
    status: "draft",
    title: "成果物カタログ判定計画（data-flow）",
    rulebook: "none",
    schema_version: 1,
    project_id: "prj-0001",
    domain: "data-flow",
    template: {
      id: "specdojo:dct-data-flow-template",
      path: "docs/ja/specdojo/templates/dct-data-flow-template.yaml",
    },
    inputs: [
      {
        kind: "data-flow",
        path: "docs/ja/product/010-business-specs/010-data-flow/cdfd-overview.md",
      },
    ],
    iteration_pattern: "pattern-a",
    deliverables: [planDeliverable()],
    exclusions: [],
    open_questions: [],
    confidence: "high",
    ...overrides,
  };
}

describe("validatePlanSchema", () => {
  it("accepts a plan that fills every required field", () => {
    expect(validatePlanSchema(basePlan(), repoRoot)).toEqual([]);
  });

  it("rejects a deliverable without evidence so judgments stay traceable", () => {
    const plan = basePlan({
      deliverables: [{ ...planDeliverable(), evidence: [] }],
    });

    const errors = validatePlanSchema(plan, repoRoot);

    expect(errors.join("\n")).toMatch(/\/deliverables\/0\/evidence/);
  });

  it("rejects unknown fields so free-form agent output cannot leak in", () => {
    const plan = { ...basePlan(), agent_notes: "自由文" };

    const errors = validatePlanSchema(plan, repoRoot);

    expect(errors.join("\n")).toMatch(/agent_notes/);
  });

  it("rejects catalog structure fields that belong to the template", () => {
    const plan = { ...basePlan(), groups: [] };

    expect(validatePlanSchema(plan, repoRoot).join("\n")).toMatch(/groups/);
  });
});

describe("validateDctPlan", () => {
  it("accepts a pattern-a plan whose local_id equals the expanded template id", () => {
    const result = validateDctPlan(basePlan(), {
      template: dataFlowTemplate,
      fileName: "dct-plan-data-flow.yaml",
    });

    expect(result.errors).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it("reports an unresolved placeholder instead of letting the agent guess a value", () => {
    const plan = basePlan({
      deliverables: [{ ...planDeliverable(), variables: [] }],
    });

    const result = validateDctPlan(plan, { template: dataFlowTemplate });

    expect(result.ok).toBe(false);
    expect(result.errors.join("\n")).toMatch(/unresolved placeholder\(s\) _TERM_/);
    expect(result.errors.join("\n")).toMatch(/open_questions/);
  });

  it("rejects a local_id that does not match the expanded template_local_id", () => {
    const plan = basePlan({
      deliverables: [{ ...planDeliverable(), local_id: "cdfd-selling" }],
    });

    const result = validateDctPlan(plan, { template: dataFlowTemplate });

    expect(result.errors.join("\n")).toMatch(/local_id must equal the expanded template_local_id/);
  });

  it("accepts a pattern-b plan that splits one area into fixed local_ids", () => {
    const plan = basePlan({
      iteration_pattern: "pattern-b",
      deliverables: [
        {
          ...planDeliverable(),
          local_id: "cdfd-register-operation",
          name: "概念データフロー図（登録簿運用）",
          variables: [],
        },
        {
          ...planDeliverable(),
          local_id: "cdfd-task-execution",
          name: "概念データフロー図（タスク実行）",
          variables: [],
        },
      ],
    });

    const result = validateDctPlan(plan, { template: dataFlowTemplate });

    expect(result.errors).toEqual([]);
  });

  it("rejects variables in a pattern-b plan", () => {
    const plan = basePlan({
      iteration_pattern: "pattern-b",
      deliverables: [{ ...planDeliverable(), local_id: "cdfd-register-operation" }],
    });

    const result = validateDctPlan(plan, { template: dataFlowTemplate });

    expect(result.errors.join("\n")).toMatch(/pattern-b entries must not define variables/);
  });

  it("rejects a template_local_id that the domain template does not define", () => {
    const plan = basePlan({
      deliverables: [{ ...planDeliverable(), template_local_id: "bdd-_TERM_" }],
    });

    const result = validateDctPlan(plan, { template: dataFlowTemplate });

    expect(result.errors.join("\n")).toMatch(/template_local_id 'bdd-_TERM_' is not defined/);
  });

  it("rejects duplicate local_ids", () => {
    const plan = basePlan({ deliverables: [planDeliverable(), planDeliverable()] });

    const result = validateDctPlan(plan, { template: dataFlowTemplate });

    expect(result.errors.join("\n")).toMatch(/duplicate local_id/);
  });

  it("rejects depends_on that resolves neither in the plan nor in the catalog", () => {
    const plan = basePlan({
      deliverables: [{ ...planDeliverable(), depends_on: ["cdfd-unknown"] }],
    });

    const result = validateDctPlan(plan, {
      template: dataFlowTemplate,
      knownLocalIds: new Set(["gl-terms"]),
    });

    expect(result.errors.join("\n")).toMatch(/depends_on 'cdfd-unknown'/);
  });

  it("accepts depends_on that resolves to an existing catalog local_id", () => {
    const plan = basePlan({
      deliverables: [{ ...planDeliverable(), depends_on: ["gl-terms"] }],
    });

    const result = validateDctPlan(plan, {
      template: dataFlowTemplate,
      knownLocalIds: new Set(["gl-terms"]),
    });

    expect(result.errors).toEqual([]);
  });

  it("rejects a domain that disagrees with the plan file name", () => {
    const result = validateDctPlan(basePlan(), { fileName: "dct-plan-data-model.yaml" });

    expect(result.errors.join("\n")).toMatch(/does not match the file name domain 'data-model'/);
  });

  it("warns that generation stops while a blocking open question remains", () => {
    const plan = basePlan({
      open_questions: [
        {
          topic: "TERM",
          question: "会計業務を別データフローに分けるか",
          blocking: true,
          reason: "上流文書に会計業務の記述がない",
        },
      ],
    });

    const result = validateDctPlan(plan, { template: dataFlowTemplate });

    expect(result.ok).toBe(true);
    expect(result.warnings.join("\n")).toMatch(/blocking open question/);
  });
});

describe("buildPlanSkeleton", () => {
  it("creates a schema-valid skeleton that blocks generation until an agent fills it", () => {
    const plan = buildPlanSkeleton({
      projectId: "prj-0001",
      domain: "data-flow",
      template: {
        id: "specdojo:dct-data-flow-template",
        path: "docs/ja/specdojo/templates/dct-data-flow-template.yaml",
      },
      inputs: [{ kind: "data-flow", path: "docs/ja/product/cdfd-overview.md" }],
    });

    expect(validatePlanSchema(plan, repoRoot)).toEqual([]);
    expect(plan.id).toBe("prj-0001:dct-plan-data-flow");
    expect(plan.deliverables).toEqual([]);
    expect(plan.open_questions[0].blocking).toBe(true);
    expect(validateDctPlan(plan, { template: dataFlowTemplate }).ok).toBe(true);
  });
});

describe("resolvePlanInputs", () => {
  async function withCatalog(
    run: (paths: { root: string; catalogPath: string }) => Promise<void>,
  ): Promise<void> {
    const root = await mkdtemp(join(tmpdir(), "specdojo-plan-inputs-"));
    try {
      const catalogPath = join(root, "docs/ja/projects/prj-0001/010-deliverables-catalog");
      await mkdir(catalogPath, { recursive: true });
      await run({ root, catalogPath });
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  }

  async function writeDataFlowCatalog(catalogPath: string, localIds: string[]): Promise<void> {
    await writeFile(
      join(catalogPath, "dct-data-flow.yaml"),
      yaml.dump({
        id: "prj-0001:dct-data-flow",
        type: "project",
        status: "draft",
        title: "成果物カタログ（データフロー）",
        rulebook: "specdojo:dct-rulebook",
        project_id: "prj-0001",
        domain: "data-flow",
        base_path: "/docs/ja/product/010-data-flow",
        groups: [
          {
            deliverables: localIds.map((localId) => ({
              local_id: localId,
              name: localId,
              kind: "work",
              overview: "データフロー",
              path: `${localId}.md`,
            })),
          },
        ],
      }),
      "utf8",
    );
  }

  it("lists every existing data-flow document in sorted order", async () => {
    await withCatalog(async ({ root, catalogPath }) => {
      await writeDataFlowCatalog(catalogPath, ["cdfd-task-execution", "cdfd-register-operation"]);
      const docsDir = join(root, "docs/ja/product/010-data-flow");
      await mkdir(docsDir, { recursive: true });
      await writeFile(join(docsDir, "cdfd-task-execution.md"), "# task\n", "utf8");
      await writeFile(join(docsDir, "cdfd-register-operation.md"), "# register\n", "utf8");

      const resolution = resolvePlanInputs({ catalogPath, repoRoot: root, domain: "architecture" });

      expect(resolution.errors).toEqual([]);
      expect(resolution.inputs.map((input) => input.path)).toEqual([
        "docs/ja/product/010-data-flow/cdfd-register-operation.md",
        "docs/ja/product/010-data-flow/cdfd-task-execution.md",
      ]);
    });
  });

  it("skips deprecated data-flow documents that were moved to trash", async () => {
    await withCatalog(async ({ root, catalogPath }) => {
      await writeFile(
        join(catalogPath, "dct-data-flow.yaml"),
        yaml.dump({
          id: "prj-0001:dct-data-flow",
          type: "project",
          status: "draft",
          title: "成果物カタログ（データフロー）",
          rulebook: "specdojo:dct-rulebook",
          project_id: "prj-0001",
          domain: "data-flow",
          base_path: "/docs/ja/product/010-data-flow",
          groups: [
            {
              deliverables: [
                {
                  local_id: "cdfd-current",
                  name: "cdfd-current",
                  kind: "work",
                  overview: "現行",
                  path: "cdfd-current.md",
                },
                {
                  local_id: "cdfd-retired",
                  name: "cdfd-retired",
                  kind: "work",
                  overview: "廃止済み",
                  path: "/docs/ja/product/trash/cdfd-retired.md",
                },
              ],
            },
          ],
        }),
        "utf8",
      );
      await mkdir(join(root, "docs/ja/product/010-data-flow"), { recursive: true });
      await mkdir(join(root, "docs/ja/product/trash"), { recursive: true });
      await writeFile(
        join(root, "docs/ja/product/010-data-flow/cdfd-current.md"),
        "# current\n",
        "utf8",
      );
      await writeFile(join(root, "docs/ja/product/trash/cdfd-retired.md"), "# retired\n", "utf8");

      const resolution = resolvePlanInputs({ catalogPath, repoRoot: root, domain: "architecture" });

      expect(resolution.inputs.map((input) => input.path)).toEqual([
        "docs/ja/product/010-data-flow/cdfd-current.md",
      ]);
    });
  });

  it("fails when the project has no data-flow document and no explicit input", async () => {
    await withCatalog(async ({ root, catalogPath }) => {
      const resolution = resolvePlanInputs({ catalogPath, repoRoot: root, domain: "architecture" });

      expect(resolution.inputs).toEqual([]);
      expect(resolution.errors.join("\n")).toMatch(/No data-flow document found/);
      expect(resolution.errors.join("\n")).toMatch(/--input/);
    });
  });

  it("accepts explicit upstream inputs when no data-flow document exists", async () => {
    await withCatalog(async ({ root, catalogPath }) => {
      const upstream = join(root, "docs/ja/product/system-overview.md");
      await mkdir(dirname(upstream), { recursive: true });
      await writeFile(upstream, "# overview\n", "utf8");

      const resolution = resolvePlanInputs({
        catalogPath,
        repoRoot: root,
        domain: "architecture",
        extraInputs: [upstream],
      });

      expect(resolution.errors).toEqual([]);
      expect(resolution.inputs).toEqual([
        { kind: "upstream-deliverable", path: "docs/ja/product/system-overview.md" },
      ]);
    });
  });

  it("records an existing catalog for the domain as a baseline input and warns", async () => {
    await withCatalog(async ({ root, catalogPath }) => {
      await writeDataFlowCatalog(catalogPath, ["cdfd-register-operation"]);
      const docsDir = join(root, "docs/ja/product/010-data-flow");
      await mkdir(docsDir, { recursive: true });
      await writeFile(join(docsDir, "cdfd-register-operation.md"), "# register\n", "utf8");

      const resolution = resolvePlanInputs({ catalogPath, repoRoot: root, domain: "data-flow" });

      expect(resolution.inputs.map((input) => input.kind)).toEqual([
        "data-flow",
        "existing-catalog",
      ]);
      expect(resolution.warnings.join("\n")).toMatch(/already has a catalog/);
    });
  });
});

describe("writePlan", () => {
  async function withCatalogDir(run: (catalogPath: string) => Promise<void>): Promise<void> {
    const root = await mkdtemp(join(tmpdir(), "specdojo-plan-write-"));
    try {
      const catalogPath = join(root, "catalog");
      await mkdir(catalogPath, { recursive: true });
      await run(catalogPath);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  }

  it("creates the plan under the catalog plans directory", async () => {
    await withCatalogDir(async (catalogPath) => {
      const result = writePlan({ catalogPath, plan: basePlan(), force: false, dryRun: false });

      expect(result.written).toBe(true);
      expect(result.path).toBe(resolvePlanPath(catalogPath, "data-flow"));
      expect(listPlanFiles(catalogPath)).toEqual(["dct-plan-data-flow.yaml"]);
    });
  });

  it("keeps an existing plan and returns a reviewable diff without --force", async () => {
    await withCatalogDir(async (catalogPath) => {
      writePlan({ catalogPath, plan: basePlan(), force: false, dryRun: false });
      const changed = basePlan({
        deliverables: [
          planDeliverable({
            local_id: "cdfd-purchase",
            variables: [
              {
                name: "TERM",
                value: "purchase",
                evidence: ["docs/ja/product/cdfd-overview.md"],
                rationale: "調達業務が独立している",
              },
            ],
          }),
        ],
      });

      const result = writePlan({ catalogPath, plan: changed, force: false, dryRun: false });

      expect(result.written).toBe(false);
      expect(result.skippedReason).toBe("exists");
      expect(result.diff.join("\n")).toMatch(/[-+].*cdfd-purchase|cdfd-sales/);
      const stored = readFileSync(resolvePlanPath(catalogPath, "data-flow"), "utf8");
      expect(stored).toContain("cdfd-sales");
      expect(stored).not.toContain("cdfd-purchase");
    });
  });

  it("overwrites only with --force", async () => {
    await withCatalogDir(async (catalogPath) => {
      writePlan({ catalogPath, plan: basePlan(), force: false, dryRun: false });
      const changed = basePlan({ confidence: "medium" });

      const result = writePlan({ catalogPath, plan: changed, force: true, dryRun: false });

      expect(result.written).toBe(true);
      expect(readFileSync(result.path, "utf8")).toContain("confidence: medium");
    });
  });

  it("reports an unchanged plan without rewriting it", async () => {
    await withCatalogDir(async (catalogPath) => {
      writePlan({ catalogPath, plan: basePlan(), force: false, dryRun: false });

      const result = writePlan({ catalogPath, plan: basePlan(), force: false, dryRun: false });

      expect(result.skippedReason).toBe("unchanged");
      expect(result.diff).toEqual([]);
    });
  });

  it("writes nothing on --dry-run", async () => {
    await withCatalogDir(async (catalogPath) => {
      const result = writePlan({ catalogPath, plan: basePlan(), force: false, dryRun: true });

      expect(result.written).toBe(false);
      expect(result.skippedReason).toBe("dry-run");
      expect(listPlanFiles(catalogPath)).toEqual([]);
    });
  });

  it("emits a stable key order so re-judgment produces reviewable diffs", () => {
    const plan = basePlan();
    // An agent may emit the same judgment with the keys in any order; the stored file
    // must not differ because of that. Object.fromEntries loses the plan type, so the
    // reversed copy is re-typed here after being built from a valid plan.
    const reordered = Object.fromEntries(Object.entries(plan).reverse()) as unknown as DctPlan;

    expect(dumpPlan(reordered)).toBe(dumpPlan(plan));
  });
});

describe("diffPlanText", () => {
  it("marks removed and added lines", () => {
    expect(diffPlanText("a\nb\n", "a\nc\n")).toEqual(["- b", "+ c"]);
  });

  it("returns no lines for identical content", () => {
    expect(diffPlanText("a\nb\n", "a\nb\n")).toEqual([]);
  });

  it("treats an absent file as no lines rather than one empty line", () => {
    expect(diffPlanText("", "a\n")).toEqual(["+ a"]);
  });
});

describe("isDctPlanFileName", () => {
  it("recognizes plan files that share the dct- prefix with catalogs", () => {
    expect(isDctPlanFileName("dct-plan-data-flow.yaml")).toBe(true);
    expect(isDctPlanFileName("catalog/plans/dct-plan-data-flow.yaml")).toBe(true);
  });

  it("does not treat catalogs as plans", () => {
    expect(isDctPlanFileName("dct-data-flow.yaml")).toBe(false);
    expect(isDctPlanFileName("dct-planning.yaml")).toBe(false);
  });
});

describe("domainFromPlanFileName", () => {
  it("extracts the domain from the plan file name", () => {
    expect(domainFromPlanFileName("dct-plan-data-model-ccd.yaml")).toBe("data-model-ccd");
  });

  it("returns null for a non-plan file", () => {
    expect(domainFromPlanFileName("dct-data-flow.yaml")).toBeNull();
  });
});

describe("loadTemplateForDomain", () => {
  it("finds the shipped template by domain rather than by file name", () => {
    const loaded = loadTemplateForDomain(
      join(repoRoot, "docs/ja/specdojo/templates"),
      "data-flow",
      repoRoot,
    );

    expect(loaded?.relPath).toBe("docs/ja/specdojo/templates/dct-data-flow-template.yaml");
    expect(loaded?.template.id).toBe("specdojo:dct-data-flow-template");
  });

  it("returns null for a domain without a template", () => {
    expect(
      loadTemplateForDomain(
        join(repoRoot, "docs/ja/specdojo/templates"),
        "no-such-domain",
        repoRoot,
      ),
    ).toBeNull();
  });
});

describe("renderPlanPrompt", () => {
  const prompt = renderPlanPrompt({
    projectId: "prj-0001",
    domain: "data-flow",
    templateId: "specdojo:dct-data-flow-template",
    templateRelPath: "docs/ja/specdojo/templates/dct-data-flow-template.yaml",
    planRelPath: "docs/ja/projects/prj-0001/010-deliverables-catalog/plans/dct-plan-data-flow.yaml",
    schemaRelPath: "docs/specdojo/schemas/v1/dct-plan.schema.yaml",
    inputs: [
      { kind: "data-flow", path: "docs/ja/product/cdfd-overview.md" },
      { kind: "existing-catalog", path: "docs/ja/projects/prj-0001/dct-data-flow.yaml" },
    ],
    planExists: true,
  });

  it("states the output path and schema the agent must conform to", () => {
    expect(prompt).toContain(
      "docs/ja/projects/prj-0001/010-deliverables-catalog/plans/dct-plan-data-flow.yaml",
    );
    expect(prompt).toContain("docs/specdojo/schemas/v1/dct-plan.schema.yaml");
  });

  it("lists the inputs the agent may read", () => {
    expect(prompt).toContain("docs/ja/product/cdfd-overview.md");
    expect(prompt).toContain("既存カタログ");
  });

  it("distinguishes pattern-a from pattern-b", () => {
    expect(prompt).toContain("pattern-a");
    expect(prompt).toContain("pattern-b");
  });

  it("forbids guessing and points undecided items to open_questions", () => {
    expect(prompt).toContain("open_questions");
    expect(prompt).toMatch(/推測で確定しない/);
  });

  it("warns that an existing plan must not be replaced unconditionally", () => {
    expect(prompt).toMatch(/無条件に置き換えず/);
  });

  it("ends with the validation command for the domain", () => {
    expect(prompt).toContain(
      "specdojo catalog plan validate --project prj-0001 --domain data-flow",
    );
  });
});
