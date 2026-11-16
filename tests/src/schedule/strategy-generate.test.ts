import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Command } from "commander";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { dump, load } from "../../../src/shared/yaml.js";
import {
  buildStrategyDocument,
  generateStrategy,
  validateStrategySchema,
  writeStrategyFile,
} from "../../../src/schedule/strategy-generate.js";
import { resolveRecommendedApproach } from "../../../src/schedule/approach.js";
import { registerScheduleCommands } from "../../../src/schedule/schedule.js";
import { buildScheduleTrack } from "../../../src/schedule/build.js";
import {
  buildPhaseModeIndex,
  resolveApproach,
  resolveTaskExecution,
  resolveTaskMode,
} from "../../../src/exec/strategy.js";

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
    dump({
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
  write("catalog/dct-demo.yaml", dump(catalog()));
  write(
    "timeline/tml-index.yaml",
    dump({
      id: "prj-0001:tml-index",
      project_id: "prj-0001",
      status: "draft",
      tracks: [
        { track: "demo", domains: ["demo"], catalog_status: "primary", order: 1, depends_on: [] },
      ],
    }),
  );
  write(rolesPath, dump({ roles: [{ code: "DEV" }, { code: "PO" }, { code: "QE" }] }));
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
  it("TaskIntent 8 種を決定論的な approach へ写像する", () => {
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
    expect(resolveRecommendedApproach({ ...base, intent: "draft-with-context" }).approach).toBe(
      "draft",
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

  it.each(["unknown", "absent", "unusable"] as const)(
    "文脈付き profile は必要な型が %s なら生成しない",
    (template) => {
      expect(
        resolveRecommendedApproach({
          intent: "draft-with-context",
          usability: { rulebook: "usable", recipe: "usable", sample: "usable", template },
          deliverableExists: false,
          resolvedEvidenceCount: 0,
        }).approach,
      ).toBe("undecided");
    },
  );

  it("intent から文脈付き profile を生成し、human と agent の段・approach・依存順を保つ", () => {
    const dct = catalog();
    // No kata is required for this catalog; separate selection tests cover required kata grades.
    const groups = dct.groups as Array<{ deliverables: Array<Record<string, unknown>> }>;
    for (const item of groups[0].deliverables) item.rulebook = "not-needed";
    write("catalog/dct-demo.yaml", dump(dct));
    const strategy = load(
      readFileSync(join(schedulePath, "sch-strategy-demo.yaml"), "utf8"),
    ) as Record<string, unknown>;
    strategy.approach_rules = [
      { local_ids: ["representative", "ordinary"], intent: "draft-with-context" },
    ];
    write("schedule/sch-strategy-demo.yaml", dump(strategy));
    const generated = generateStrategy({
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
    expect(generated.errors).toEqual([]);
    expect(validateStrategySchema(generated.doc, root)).toEqual([]);
    write("schedule/sch-strategy-demo.yaml", generated.content);
    const built = buildScheduleTrack(join(schedulePath, "sch-strategy-demo.yaml"), root);
    expect(built.errors).toEqual([]);
    const index = buildPhaseModeIndex(schedulePath);
    const tasks = built.tasks
      .filter((task) => task.local_id === "ordinary")
      .map((task) => ({ ...task, id: `T-DEMO-ordinary-${task.phase_suffix}` }));
    expect(tasks.map((task) => task.phase_set)).toEqual([
      "context-pass",
      "guided-pass",
      "refine-pass",
      "condense-pass",
      "review-pass",
      "finalize-pass",
    ]);
    expect(
      tasks.map((task) =>
        resolveApproach(task.local_id, task.id, index, task.phase_suffix, task.phase_set),
      ),
    ).toEqual(["draft", "draft", "fully-guided", "condense", "fully-guided", "finalize"]);
    expect(
      tasks.map((task) =>
        resolveTaskExecution(task.local_id, task.id, index, task.phase_suffix, task.phase_set),
      ),
    ).toEqual(["human", "agent", "agent", "agent", "agent", "human"]);
    expect(
      tasks.map((task) =>
        resolveTaskMode(task.local_id, task.id, index, task.phase_suffix, task.phase_set),
      ),
    ).toEqual(["edit", "edit", "edit", "edit", "review", "edit"]);
    for (let i = 1; i < tasks.length; i++) {
      expect(tasks[i].depends_on).toContain(tasks[i - 1].id);
    }
    const phases = generated.doc!.phase_sets as Record<string, Array<Record<string, unknown>>>;
    expect(phases["context-pass"][0]).not.toHaveProperty("agent_pipeline");
    expect(phases["context-pass"][0].description).toContain("deliverable scaffold");
    expect(phases["context-pass"][0].description).toContain("_CONTEXT_:");
    expect(phases["guided-pass"][0]).toHaveProperty("agent_pipeline");
    expect(phases["finalize-pass"][0]).not.toHaveProperty("agent_pipeline");
    expect(generated.doc!.phase_gates).toEqual(
      expect.arrayContaining([expect.objectContaining({ after_phase_sets: ["guided-pass"] })]),
    );
  });

  it("生成した strategy の task_suffix を引用符付きの文字列で書く", () => {
    const generated = generateStrategy({
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

    expect(generated.errors).toEqual([]);
    const suffixLines = generated.content
      .split("\n")
      .filter((line) => /^\s*(- )?task_suffix:/.test(line));
    expect(suffixLines.length).toBeGreaterThan(0);
    for (const line of suffixLines) {
      expect(line).toMatch(/task_suffix: "[0-9]{3}"$/);
    }
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
      "rulebook-maintenance-pass",
      "recipe-maintenance-pass",
      "sample-maintenance-pass",
      "template-maintenance-pass",
      "refine-pass",
      "condense-pass",
      "review-pass",
      "retrofit-review-pass",
      "finalize-pass",
    ]);
    expect(doc.cross_domain_dependencies).toEqual([
      expect.objectContaining({ dependent: "ordinary", requires: "representative" }),
    ]);
    expect(validateStrategySchema(doc, root)).toEqual([]);
  });

  it.each(["bootstrap-kata-set", "improve-kata"] as const)(
    "%s が wave-1 と同じ型の整備段・suffix・依存順を生成する",
    (intent) => {
      const strategy = load(
        readFileSync(join(schedulePath, "sch-strategy-demo.yaml"), "utf8"),
      ) as Record<string, unknown>;
      strategy.approach_rules = [
        intent === "bootstrap-kata-set"
          ? {
              local_ids: ["representative", "ordinary"],
              intent,
              bootstrap_scope: ["rulebook", "recipe", "sample", "template"],
            }
          : { local_ids: ["representative", "ordinary"], intent, kata_target: "rulebook" },
      ];
      write("schedule/sch-strategy-demo.yaml", dump(strategy));
      const generated = generateStrategy({
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
      expect(generated.errors).toEqual([]);
      expect(validateStrategySchema(generated.doc, root)).toEqual([]);
      const wave = load(
        readFileSync(
          join(originalRoot, "docs/ja/projects/prj-0001/schedule/sch-strategy-kata-wave-1.yaml"),
          "utf8",
        ),
      ) as {
        default_phase_sets: Array<{ phase_set: string }>;
        phase_sets: Record<string, Array<Record<string, unknown>>>;
      };
      const phaseSets = generated.doc!.phase_sets as typeof wave.phase_sets;
      const maintenance = wave.default_phase_sets
        .map((entry) => entry.phase_set)
        .filter((name) => name.endsWith("-maintenance-pass"));
      expect(maintenance).toHaveLength(4);
      for (const name of maintenance) {
        const { id, approach, task_suffix, execution, mode, agent_pipeline } =
          wave.phase_sets[name][0];
        expect(phaseSets[name][0]).toMatchObject({
          id,
          approach,
          task_suffix,
          execution,
          mode,
          agent_pipeline,
        });
      }
      expect(generated.doc!.default_phase_sets).toEqual(
        intent === "bootstrap-kata-set"
          ? wave.default_phase_sets
          : [...maintenance, "review-pass", "finalize-pass"].map((phase_set) => ({ phase_set })),
      );
      for (const name of [
        ...(intent === "bootstrap-kata-set" ? ["bootstrap-pass"] : []),
        ...maintenance,
      ]) {
        const description = phaseSets[name][0].description as string;
        expect(description).toContain("[[specdojo:rulebook-authoring-standard|");
        expect(description).toContain("[[specdojo:clis-sample|");
        expect(description).toContain("良い例・悪い例");
        expect(description).toContain("not-needed");
        expect(description).toContain("正本を参照");
      }
      write("schedule/sch-strategy-demo.yaml", generated.content);
      const built = buildScheduleTrack(join(schedulePath, "sch-strategy-demo.yaml"), root);
      expect(built.errors).toEqual([]);
      const tasks = built.tasks.filter((task) => task.local_id === "representative");
      expect(tasks.map((task) => task.phase_set)).toEqual(
        (generated.doc!.default_phase_sets as Array<{ phase_set: string }>).map(
          (entry) => entry.phase_set,
        ),
      );
      expect(new Set(tasks.map((task) => task.phase_suffix)).size).toBe(tasks.length);
      for (let i = 1; i < tasks.length; i++) {
        expect(tasks[i].depends_on).toContain(`T-DEMO-representative-${tasks[i - 1].phase_suffix}`);
      }
      expect(generated.doc!.phase_gates).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            after_phase_sets: [
              ...(intent === "bootstrap-kata-set" ? ["bootstrap-pass"] : []),
              ...maintenance,
            ],
          }),
        ]),
      );
    },
  );

  it.each(["bootstrap", "rulebook-maintenance"] as const)(
    "%s で同じ owner の成果物も not-needed の宣言ごとに段を分ける",
    (approach) => {
      const built = buildStrategyDocument({
        projectId: "prj-0001",
        track: "demo",
        catalogs: [{ id: "prj-0001:dct-demo", path: "/catalog/dct-demo.yaml", domain: "demo" }],
        deliverables: [
          { local_id: "representative", catalog_id: "prj-0001:dct-demo", approach },
          {
            local_id: "ordinary",
            catalog_id: "prj-0001:dct-demo",
            approach,
            not_needed_kata: ["recipe", "template"],
          },
        ],
        dependsOn: new Map(),
        owners: new Map([
          ["representative", "DEV"],
          ["ordinary", "DEV"],
        ]),
        gateOwner: "PO",
        milestoneOwner: "PO",
        bootstrapOrdering: true,
        includeKinds: ["work"],
        preserved: {
          ownerByLocalId: new Map(),
          approachRules:
            approach === "bootstrap"
              ? [
                  {
                    local_ids: ["representative"],
                    intent: "bootstrap-kata-set",
                    bootstrap_scope: ["rulebook", "recipe", "sample", "template"],
                  },
                  {
                    local_ids: ["ordinary"],
                    intent: "bootstrap-kata-set",
                    bootstrap_scope: ["rulebook", "sample"],
                  },
                ]
              : [
                  {
                    local_ids: ["representative", "ordinary"],
                    intent: "improve-kata",
                    kata_target: "rulebook",
                  },
                ],
        },
      });
      expect(built.errors).toEqual([]);
      expect(validateStrategySchema(built.doc, root)).toEqual([]);
      write("schedule/sch-strategy-demo.yaml", dump(built.doc));
      const schedule = buildScheduleTrack(join(schedulePath, "sch-strategy-demo.yaml"), root);
      expect(schedule.errors).toEqual([]);
      const phasesOf = (localId: string) =>
        schedule.tasks.filter((task) => task.local_id === localId).map((task) => task.phase_set);
      const full = phasesOf("representative");
      expect(full).toContain("recipe-maintenance-pass");
      expect(full).toContain("template-maintenance-pass");
      expect(phasesOf("ordinary")).toEqual(
        full.filter(
          (name) => name !== "recipe-maintenance-pass" && name !== "template-maintenance-pass",
        ),
      );
      expect(built.doc.owner_rules).toHaveLength(2);
    },
  );

  it.each(["recipe", "sample", "template"] as const)(
    "improve-kata の %s 直接指定は指定した型だけを見直す",
    (kind) => {
      const strategy = load(
        readFileSync(join(schedulePath, "sch-strategy-demo.yaml"), "utf8"),
      ) as Record<string, unknown>;
      strategy.approach_rules = [
        {
          local_ids: ["representative", "ordinary"],
          intent: "improve-kata",
          kata_target: kind,
        },
      ];
      write("schedule/sch-strategy-demo.yaml", dump(strategy));
      const generated = generateStrategy({
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
      expect(generated.errors).toEqual([]);
      expect(Object.keys(generated.doc!.phase_sets as object)).toEqual([
        `${kind}-maintenance-pass`,
        "review-pass",
        "finalize-pass",
      ]);
    },
  );

  it("既存 scope の local_ids を保ち、選択した成果物だけの strategy を再生成する", () => {
    const path = join(schedulePath, "sch-strategy-demo.yaml");
    const strategy = load(readFileSync(path, "utf8")) as Record<string, unknown>;
    const scope = strategy.scope as { catalogs: Array<Record<string, unknown>> };
    scope.catalogs[0].local_ids = ["representative"];
    strategy.approach_rules = [
      {
        local_ids: ["representative"],
        intent: "bootstrap-kata-set",
        bootstrap_scope: ["rulebook", "recipe", "sample", "template"],
      },
    ];
    write("schedule/sch-strategy-demo.yaml", dump(strategy));

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
    expect(result.doc?.scope).toMatchObject({
      catalogs: [{ local_ids: ["representative"] }],
    });
    expect(result.doc?.owner_rules).toEqual([
      expect.objectContaining({ local_ids: ["representative"] }),
    ]);
    expect(result.doc?.approach_rules).toEqual([
      expect.objectContaining({ local_ids: ["representative"] }),
    ]);
    expect(result.doc?.cross_domain_dependencies).toBeUndefined();
  });

  it("既存 scope の local_ids がカタログに存在しない場合は停止する", () => {
    const path = join(schedulePath, "sch-strategy-demo.yaml");
    const strategy = load(readFileSync(path, "utf8")) as Record<string, unknown>;
    const scope = strategy.scope as { catalogs: Array<Record<string, unknown>> };
    scope.catalogs[0].local_ids = ["missing"];
    strategy.approach_rules = [{ local_ids: ["missing"], intent: "author-deliverable" }];
    write("schedule/sch-strategy-demo.yaml", dump(strategy));

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
    expect(result.errors.join("\n")).toContain(
      "scope.local_ids の 'missing' がカタログに存在しない",
    );
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
    const strategy = load(
      readFileSync(join(schedulePath, "sch-strategy-demo.yaml"), "utf8"),
    ) as Record<string, unknown>;
    strategy.approach_rules = [];
    write("schedule/sch-strategy-demo.yaml", dump(strategy));
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

  it("新規に書く strategy の先頭へ schema を解決できる modeline を付ける", () => {
    rmSync(join(schedulePath, "sch-strategy-demo.yaml"));
    const written = writeStrategyFile({
      schedulePath,
      track: "demo",
      content: "kind: strategy\n",
      force: false,
      dryRun: false,
      repoRoot: root,
    });

    expect(written.written).toBe(true);
    expect(readFileSync(written.path, "utf8")).toBe(
      "# yaml-language-server: $schema=../docs/specdojo/schemas/v1/sch-strategy.schema.yaml\nkind: strategy\n",
    );
  });

  it("--force で書き直すときは既存の modeline を保つ", () => {
    const path = join(schedulePath, "sch-strategy-demo.yaml");
    const modeline = "# yaml-language-server: $schema=../custom/sch-strategy.schema.yaml";
    writeFileSync(path, `${modeline}\nold: content\n`, "utf8");

    const written = writeStrategyFile({
      schedulePath,
      track: "demo",
      content: "new: content\n",
      force: true,
      dryRun: false,
      repoRoot: root,
    });

    expect(written.written).toBe(true);
    const content = readFileSync(path, "utf8");
    expect(content).toBe(`${modeline}\nnew: content\n`);
    expect(content.match(/yaml-language-server/g)).toHaveLength(1);
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
    const strategyPath = join(schedulePath, "sch-strategy-demo.yaml");
    const content = readFileSync(strategyPath, "utf8");
    expect(content).toContain("kind: strategy");
    // validate:schema --modeline と同じく、先頭の modeline から schema を解決して検証する。
    const schemaRef = /^# yaml-language-server: \$schema=(\S+)\n/.exec(content)?.[1];
    expect(schemaRef).toBe("../docs/specdojo/schemas/v1/sch-strategy.schema.yaml");
    expect(resolve(schedulePath, schemaRef ?? "")).toBe(
      join(root, "docs/specdojo/schemas/v1/sch-strategy.schema.yaml"),
    );
    expect(existsSync(resolve(schedulePath, schemaRef ?? ""))).toBe(true);
    expect(validateStrategySchema(load(content), root)).toEqual([]);
    expect(process.exitCode).toBeUndefined();
  });
});
