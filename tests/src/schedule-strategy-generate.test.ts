import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Command } from "commander";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import yaml from "js-yaml";
import {
  buildStrategyDocument,
  generateStrategy,
  validateStrategySchema,
  writeStrategyFile,
} from "../../src/schedule-strategy-generate.js";
import { resolveRecommendedApproach } from "../../src/schedule-approach.js";
import { registerScheduleCommands } from "../../src/schedule.js";

let root: string;
let catalogPath: string;
let schedulePath: string;
let timelinePath: string;
let rolesPath: string;
let originalRoot: string;

function write(relPath: string, content: string): void {
  const filePath = join(root, relPath);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, "utf8");
}

function catalog(): Record<string, unknown> {
  return {
    id: "prj-0001:dct-demo",
    type: "project",
    status: "draft",
    title: "成果物カタログ（デモ）",
    rulebook: "specdojo:dct-rulebook",
    project_id: "prj-0001",
    domain: "demo",
    base_path: "/docs/demo",
    groups: [
      {
        deliverables: ["representative", "ordinary"].map((localId) => ({
          local_id: localId,
          name: localId,
          kind: "work",
          depends_on: [],
          overview: `${localId} を定義する`,
          path: `${localId}.md`,
          rulebook: "none",
          done_criteria: [{ text: "完了していること", roles: ["QE"], viewpoint: "vp-qe" }],
        })),
      },
    ],
  };
}

function writeIntentStrategy(): void {
  write(
    "schedule/sch-strategy-demo.yaml",
    yaml.dump({
      kind: "strategy",
      id: "prj-0001:sch-strategy-demo",
      type: "project",
      status: "draft",
      title: "demo",
      rulebook: "specdojo:sch-rulebook",
      track: "demo",
      scope: {
        catalogs: [
          {
            id: "prj-0001:dct-demo",
            path: `/${relative(root, join(catalogPath, "dct-demo.yaml")).replace(/\\/g, "/")}`,
          },
        ],
        include_kinds: ["work"],
      },
      approach_rules: [
        {
          local_ids: ["representative"],
          intent: "bootstrap-kata-set",
          bootstrap_scope: ["rulebook", "recipe", "sample", "template"],
        },
        { local_ids: ["ordinary"], intent: "author-deliverable" },
      ],
      phase_sets: { placeholder: [{ id: "draft" }] },
      owner_rules: [],
    }),
  );
}

beforeEach(() => {
  originalRoot = process.cwd();
  root = mkdtempSync(join(tmpdir(), "specdojo-strategy-generate-"));
  catalogPath = join(root, "catalog");
  schedulePath = join(root, "schedule");
  timelinePath = join(root, "timeline");
  rolesPath = "roles/pm-roles.yaml";
  cpSync(join(originalRoot, "docs/specdojo/schemas/v1"), join(root, "docs/specdojo/schemas/v1"), {
    recursive: true,
  });
  write("catalog/dct-demo.yaml", yaml.dump(catalog()));
  write(
    "timeline/tml-index.yaml",
    yaml.dump({
      id: "prj-0001:tml-index",
      project_id: "prj-0001",
      status: "draft",
      tracks: [
        { track: "demo", domains: ["demo"], catalog_status: "primary", order: 1, depends_on: [] },
      ],
    }),
  );
  write(rolesPath, yaml.dump({ roles: [{ code: "DEV" }, { code: "PO" }, { code: "QE" }] }));
  mkdirSync(schedulePath, { recursive: true });
  writeIntentStrategy();
});

afterEach(() => {
  process.chdir(originalRoot);
  process.exitCode = undefined;
  vi.restoreAllMocks();
  rmSync(root, { recursive: true, force: true });
});

describe("strategy generator", () => {
  it("TaskIntent 7 種を決定論的な approach へ写像する", () => {
    const usable = {
      rulebook: "usable",
      recipe: "usable",
      sample: "usable",
      template: "usable",
    } as const;
    const base = { usability: usable, deliverableExists: true, resolvedEvidenceCount: 1 };
    expect(resolveRecommendedApproach({ ...base, intent: "author-deliverable" }).approach).toBe(
      "fully-guided",
    );
    expect(
      resolveRecommendedApproach({
        ...base,
        intent: "bootstrap-kata-set",
        usability: { ...usable, template: "absent" },
        bootstrapScope: ["template"],
      }).approach,
    ).toBe("bootstrap");
    expect(resolveRecommendedApproach({ ...base, intent: "reflect-implementation" }).approach).toBe(
      "retrofit",
    );
    expect(
      resolveRecommendedApproach({ ...base, intent: "deduplicate-across-deliverables" }).approach,
    ).toBe("cross-deliverable-dedup");
    expect(
      resolveRecommendedApproach({ ...base, intent: "improve-kata", kataTarget: "rulebook" })
        .approach,
    ).toBe("rulebook-maintenance");
    expect(resolveRecommendedApproach({ ...base, intent: "confirm-deliverable" }).approach).toBe(
      "finalize",
    );
    expect(
      resolveRecommendedApproach({
        ...base,
        intent: "confirm-with-kata-set",
        bootstrapScope: ["rulebook"],
      }).approach,
    ).toBe("bootstrap-finalize");
  });

  it("DCT・Timeline・intent・grade から混在 profile、owner、gate、依存を生成する", () => {
    const result = generateStrategy({
      repoRoot: root,
      schedulePath,
      catalogPath,
      timelinePath,
      rolesPath,
      projectId: "prj-0001",
      track: "demo",
      defaultOwner: "DEV",
      gateOwner: "PO",
      milestoneOwner: "PO",
    });

    expect(result.errors).toEqual([]);
    expect(result.doc).not.toBeNull();
    expect(result.taskCount).toBeGreaterThan(0);
    const doc = result.doc!;
    expect(doc.scope).toEqual({
      catalogs: [
        {
          id: "prj-0001:dct-demo",
          path: `/${relative(root, join(catalogPath, "dct-demo.yaml")).replace(/\\/g, "/")}`,
        },
      ],
      include_kinds: ["work"],
    });
    expect(Object.keys(doc.phase_sets as object)).toEqual([
      "bootstrap-pass",
      "freeform-pass",
      "refine-pass",
      "review-pass",
      "retrofit-review-pass",
      "finalize-pass",
    ]);
    expect(doc.cross_domain_dependencies).toEqual([
      expect.objectContaining({ dependent: "ordinary", requires: "representative" }),
    ]);
    expect(validateStrategySchema(doc, root)).toEqual([]);
  });

  it("owner を解決できない場合は推測せず停止する", () => {
    const result = generateStrategy({
      repoRoot: root,
      schedulePath,
      catalogPath,
      timelinePath,
      rolesPath,
      projectId: "prj-0001",
      track: "demo",
      gateOwner: "PO",
      milestoneOwner: "PO",
    });

    expect(result.doc).toBeNull();
    expect(result.errors.join("\n")).toContain("主担当ロールを決定できない");
  });

  it("intent 宣言が不足する場合は候補を返さない", () => {
    const strategy = yaml.load(
      readFileSync(join(schedulePath, "sch-strategy-demo.yaml"), "utf8"),
    ) as Record<string, unknown>;
    strategy.approach_rules = [];
    write("schedule/sch-strategy-demo.yaml", yaml.dump(strategy));
    const result = generateStrategy({
      repoRoot: root,
      schedulePath,
      catalogPath,
      timelinePath,
      rolesPath,
      projectId: "prj-0001",
      track: "demo",
      defaultOwner: "DEV",
      gateOwner: "PO",
      milestoneOwner: "PO",
    });

    expect(result.doc).toBeNull();
    expect(result.errors.join("\n")).toContain("intent 宣言がない");
  });

  it("既存 strategy は --force なしで保護し、同一内容の再実行は unchanged になる", () => {
    const path = join(schedulePath, "sch-strategy-demo.yaml");
    writeFileSync(path, "old: content\n", "utf8");
    const blocked = writeStrategyFile({
      schedulePath,
      track: "demo",
      content: "new: content\n",
      force: false,
      dryRun: false,
    });
    expect(blocked.skippedReason).toBe("exists");
    expect(readFileSync(path, "utf8")).toBe("old: content\n");

    const updated = writeStrategyFile({
      schedulePath,
      track: "demo",
      content: "new: content\n",
      force: true,
      dryRun: false,
    });
    expect(updated.written).toBe(true);
    const unchanged = writeStrategyFile({
      schedulePath,
      track: "demo",
      content: "new: content\n",
      force: false,
      dryRun: false,
    });
    expect(unchanged.skippedReason).toBe("unchanged");
  });

  it("cross-deliverable 判定が複数なら横断 pass を生成する", () => {
    const built = buildStrategyDocument({
      projectId: "prj-0001",
      track: "demo",
      catalogs: [{ id: "prj-0001:dct-demo", path: "/catalog/dct-demo.yaml", domain: "demo" }],
      deliverables: [
        { local_id: "author", catalog_id: "prj-0001:dct-demo", approach: "freeform" },
        { local_id: "one", catalog_id: "prj-0001:dct-demo", approach: "cross-deliverable-dedup" },
        { local_id: "two", catalog_id: "prj-0001:dct-demo", approach: "cross-deliverable-dedup" },
      ],
      dependsOn: new Map(),
      owners: new Map([
        ["author", "DEV"],
        ["one", "DEV"],
        ["two", "DEV"],
      ]),
      gateOwner: "PO",
      milestoneOwner: "PO",
      bootstrapOrdering: true,
      includeKinds: ["work"],
      preserved: { ownerByLocalId: new Map(), approachRules: [] },
    });

    expect(built.errors).toEqual([]);
    expect(built.doc.cross_deliverable_passes).toEqual([
      expect.objectContaining({
        after_gate: "G-DEMO-first-pass",
        before_phase_set: "refine-pass",
        scope: { local_ids: ["one", "two"] },
      }),
    ]);
  });

  it("not-needed の型に対応する maintenance pass を生成しない", () => {
    const built = buildStrategyDocument({
      projectId: "prj-0001",
      track: "demo",
      catalogs: [{ id: "prj-0001:dct-demo", path: "/catalog/dct-demo.yaml", domain: "demo" }],
      deliverables: [
        {
          local_id: "ordinary",
          catalog_id: "prj-0001:dct-demo",
          approach: "recipe-maintenance",
          not_needed_kata: ["recipe"],
        },
      ],
      dependsOn: new Map(),
      owners: new Map([["ordinary", "DEV"]]),
      gateOwner: "PO",
      milestoneOwner: "PO",
      bootstrapOrdering: true,
      includeKinds: ["work"],
      preserved: { ownerByLocalId: new Map(), approachRules: [] },
    });

    expect(built.errors.join("\n")).toContain("recipe-maintenance を生成しない");
    expect(built.doc.phase_sets).not.toHaveProperty("recipe-maintenance-pass");
  });

  it("schedule strategy generate CLI が正準パスへ strategy を生成する", async () => {
    write(
      ".specdojo/specdojo.config.json",
      `${JSON.stringify(
        {
          version: 1,
          current_project: "prj-0001",
          projects: {
            "prj-0001": {
              catalog_path: "catalog",
              schedule_path: "schedule",
              execution_path: "execution",
              timeline_path: "timeline",
              roles_path: rolesPath,
            },
          },
        },
        null,
        2,
      )}\n`,
    );
    const stdout: string[] = [];
    vi.spyOn(process.stdout, "write").mockImplementation((chunk: unknown) => {
      stdout.push(String(chunk));
      return true;
    });
    process.chdir(root);
    try {
      const program = new Command();
      program.exitOverride();
      registerScheduleCommands(program);
      await program.parseAsync(
        [
          "schedule",
          "strategy",
          "generate",
          "--track",
          "demo",
          "--default-owner",
          "DEV",
          "--gate-owner",
          "PO",
          "--milestone-owner",
          "PO",
          "--force",
        ],
        { from: "user" },
      );
    } finally {
      process.chdir(originalRoot);
    }

    expect(stdout.join("")).toContain("Updated:");
    expect(readFileSync(join(schedulePath, "sch-strategy-demo.yaml"), "utf8")).toContain(
      "kind: strategy",
    );
    expect(process.exitCode).toBeUndefined();
  });
});
