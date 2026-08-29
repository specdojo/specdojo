import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { format } from "prettier";
import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import {
  buildInPlaceStem,
  finalizeResultSectionsForDeliverable,
  generateSinglePlan,
  ownerRoleFields,
  parsePlanTaskIdentity,
  targetDocIdsForDeliverable,
  reviewResultSections,
  reviewViewpointDetails,
  stemFromPlanPath,
} from "../../src/exec-plans.js";
import type { CriteriaItem } from "../../src/catalog-types.js";
import type { RoleDefinition } from "../../src/role-types.js";
import type { CoverageType, ReviewViewpoint } from "../../src/review-types.js";

function roleMapOf(roles: RoleDefinition[]): Map<string, RoleDefinition> {
  return new Map(roles.map((role) => [role.code, role]));
}

function vpMapOf(viewpoints: ReviewViewpoint[]): Map<string, ReviewViewpoint> {
  return new Map(viewpoints.map((vp) => [vp.id, vp]));
}

const PO_VIEWPOINTS: ReviewViewpoint[] = [
  {
    id: "vp-po-purpose-alignment",
    role: "PO",
    category: "purpose",
    title: "目的・スコープとの整合",
    check: "目的、スコープ、優先順位、公開方針と矛盾していないか。",
    evidence: "目的、対象範囲、判断理由。",
    coverage_types: ["business_goal", "scope_boundary"],
    default_severity: "major",
  },
  {
    id: "vp-ba-business-value",
    role: "BA",
    category: "business",
    title: "業務価値との対応",
    check: "業務目的、利用者、期待効果と対応しているか。",
    evidence: "背景、目的、利用者。",
    default_severity: "major",
  },
];

describe("ownerRoleFields", () => {
  it("owner 未設定の場合は全フィールドを MISSING にする", () => {
    const actual = ownerRoleFields(undefined, roleMapOf([]), vpMapOf([]));

    expect(actual).toEqual({ label: "_MISSING_", note: "_MISSING_", viewpoints: "_MISSING_" });
  });

  it("owner の責務（project_note）と該当 role の観点を値として返す", () => {
    const roles = roleMapOf([
      { code: "PO", name: "Project Owner", project_note: "最終判断・スコープを担う。" },
    ]);
    const actual = ownerRoleFields("PO", roles, vpMapOf(PO_VIEWPOINTS));

    expect(actual.label).toBe("PO（Project Owner）");
    expect(actual.note).toBe("最終判断・スコープを担う。");
    expect(actual.viewpoints).toBe(
      "- 目的・スコープとの整合: 目的、スコープ、優先順位、公開方針と矛盾していないか。",
    );
  });

  it("owner と一致しない role の観点は含めない", () => {
    const roles = roleMapOf([{ code: "PO", name: "Project Owner", project_note: "note" }]);
    const actual = ownerRoleFields("PO", roles, vpMapOf(PO_VIEWPOINTS));

    expect(actual.viewpoints).not.toContain("業務価値との対応");
  });

  it("roles に未登録の owner では label を code のみ・note を MISSING にする", () => {
    const actual = ownerRoleFields("PO", roleMapOf([]), vpMapOf(PO_VIEWPOINTS));

    expect(actual.label).toBe("PO");
    expect(actual.note).toBe("_MISSING_");
    expect(actual.viewpoints).toContain("- 目的・スコープとの整合:");
  });

  it("該当 role の観点が無い場合は viewpoints を MISSING にする", () => {
    const roles = roleMapOf([{ code: "DEV", name: "Developer", project_note: "note" }]);
    const actual = ownerRoleFields("DEV", roles, vpMapOf(PO_VIEWPOINTS));

    expect(actual.viewpoints).toBe("_MISSING_");
  });
});

// detail テンプレートの prose ラベルは本物のテンプレートファイル側にあるため、
// テストでは値の差し込みだけを検証する最小の断片を使う。
const DETAIL_TEMPLATE = [
  "### _VP_ID_（_VP_ROLES_: _VP_VIEWPOINT_）",
  "",
  "criterion: _VP_CRITERION_",
  "",
  "_VP_COVERAGE_check: _VP_CHECK_",
  "evidence: _VP_EVIDENCE_",
].join("\n");

describe("reviewResultSections", () => {
  // Prose labels come from the detail template; the test supplies a minimal one and asserts
  // that code injects only the data values (id / roles / viewpoint / criterion).
  const DETAIL_TEMPLATE = [
    "### _VP_ID_（_VP_ROLES_: _VP_VIEWPOINT_）",
    "",
    "基準: _VP_CRITERION_",
    "",
    "- result: _TODO_",
  ].join("\n");

  it("criteria が空の場合は MISSING を返す", () => {
    expect(reviewResultSections([], DETAIL_TEMPLATE)).toBe("_MISSING_");
  });

  it("各 RVP に role / viewpoint_id / criterion を展開する", () => {
    const criteria: CriteriaItem[] = [
      { text: "業務価値が確認できる", roles: ["BA"], viewpoint: "vp-ba-business-value" },
      { text: "スコープが承認できる", roles: ["PO"], viewpoint: "vp-po-purpose-alignment" },
    ];

    const actual = reviewResultSections(criteria, DETAIL_TEMPLATE);

    expect(actual).toContain("### RVP-001（BA: vp-ba-business-value）");
    expect(actual).toContain("基準: 業務価値が確認できる");
    expect(actual).toContain("### RVP-002（PO: vp-po-purpose-alignment）");
    expect(actual).toContain("- result: _TODO_");
  });
});

describe("reviewViewpointDetails", () => {
  it("criteria が空の場合は MISSING を返す", () => {
    expect(reviewViewpointDetails([], vpMapOf([]), DETAIL_TEMPLATE)).toBe("_MISSING_");
  });

  it("観点ごとにテンプレートへ値を差し込み RVP 連番を付ける", () => {
    const criteria: CriteriaItem[] = [
      { text: "目的と整合しているか。", roles: ["PO"], viewpoint: "vp-po-purpose-alignment" },
    ];
    const actual = reviewViewpointDetails(criteria, vpMapOf(PO_VIEWPOINTS), DETAIL_TEMPLATE);

    expect(actual).toContain("### RVP-001（PO: vp-po-purpose-alignment）");
    expect(actual).toContain("criterion: 目的と整合しているか。");
    expect(actual).toContain("check: 目的、スコープ、優先順位、公開方針と矛盾していないか。");
    expect(actual).toContain("evidence: 目的、対象範囲、判断理由。");
  });

  it("coverage_types を持つ観点は coverage_required ブロックを出力する", () => {
    const criteria: CriteriaItem[] = [
      { text: "t", roles: ["PO"], viewpoint: "vp-po-purpose-alignment" },
    ];
    const actual = reviewViewpointDetails(criteria, vpMapOf(PO_VIEWPOINTS), DETAIL_TEMPLATE);

    expect(actual).toContain("**coverage_required:**");
    expect(actual).toContain("- business_goal");
    expect(actual).toContain("- scope_boundary");
  });

  it("coverageMap がある場合は coverage_required を id: description に展開する", () => {
    const criteria: CriteriaItem[] = [
      { text: "t", roles: ["PO"], viewpoint: "vp-po-purpose-alignment" },
    ];
    const coverageMap = new Map<string, CoverageType>([
      ["business_goal", { id: "business_goal", description: "業務目的との対応が説明できるか。" }],
    ]);
    const actual = reviewViewpointDetails(
      criteria,
      vpMapOf(PO_VIEWPOINTS),
      DETAIL_TEMPLATE,
      coverageMap,
    );

    expect(actual).toContain("- business_goal: 業務目的との対応が説明できるか。");
    // 定義に無い id は説明なしのまま id だけを出力する
    expect(actual).toContain("- scope_boundary\n");
  });

  it("coverage_types が無い観点は coverage_required ブロックごと省略する", () => {
    const criteria: CriteriaItem[] = [
      { text: "t", roles: ["BA"], viewpoint: "vp-ba-business-value" },
    ];
    const actual = reviewViewpointDetails(criteria, vpMapOf(PO_VIEWPOINTS), DETAIL_TEMPLATE);

    expect(actual).not.toContain("coverage_required");
    expect(actual).not.toContain("_MISSING_");
  });

  it("viewpoint が map に無い場合は check / evidence を MISSING にする", () => {
    const criteria: CriteriaItem[] = [{ text: "t", roles: ["QE"], viewpoint: "vp-unknown" }];
    const actual = reviewViewpointDetails(criteria, vpMapOf(PO_VIEWPOINTS), DETAIL_TEMPLATE);

    expect(actual).toContain("check: _MISSING_");
    expect(actual).toContain("evidence: _MISSING_");
  });

  it("複数観点は空行区切りで連番が増える", () => {
    const criteria: CriteriaItem[] = [
      { text: "a", roles: ["PO"], viewpoint: "vp-po-purpose-alignment" },
      { text: "b", roles: ["BA"], viewpoint: "vp-ba-business-value" },
    ];
    const actual = reviewViewpointDetails(criteria, vpMapOf(PO_VIEWPOINTS), DETAIL_TEMPLATE);

    expect(actual).toContain("### RVP-001（PO: vp-po-purpose-alignment）");
    expect(actual).toContain("### RVP-002（BA: vp-ba-business-value）");
    expect(actual).toContain("）\n\ncriterion: a");
  });
});

describe("buildInPlaceStem / stemFromPlanPath", () => {
  it("builds a stem prefixed by the slug and unique across calls", () => {
    const a = buildInPlaceStem("prj-overview");
    const b = buildInPlaceStem("prj-overview");

    expect(a.startsWith("prj-overview-")).toBe(true);
    // Two generations of the same slug must not collide (UTC + random suffix).
    expect(a).not.toBe(b);
  });

  it("recovers the stem from a plan path (round-trips with the plan file name)", () => {
    const stem = buildInPlaceStem("overview");

    expect(stemFromPlanPath(`/repo/exec/plans/${stem}-plan.md`)).toBe(stem);
    expect(stemFromPlanPath("prj-overview-result-plan.md")).toBe("prj-overview-result");
  });
});

describe("parsePlanTaskIdentity", () => {
  function planWithApproach(approach: string): string {
    return [
      "---",
      "specdojo:",
      "  id: test:xep-t-test-overview-010",
      "  type: exec-plan",
      "  task_id: T-TEST-overview-010",
      "  mode: edit",
      "  project_id: test",
      `  approach: ${approach}`,
      "---",
      "",
      "# Edit Plan: T-TEST-overview-010",
      "",
    ].join("\n");
  }

  it.each(["bootstrap", "retrofit", "finalize", "bootstrap-finalize", "fully-guided"])(
    "approach %s を frontmatter から復元する",
    (approach) => {
      const identity = parsePlanTaskIdentity(planWithApproach(approach));

      expect(identity).toEqual({
        taskId: "T-TEST-overview-010",
        mode: "edit",
        projectId: "test",
        approach,
      });
    },
  );

  it("未知の approach は無視して identity のみ復元する", () => {
    const identity = parsePlanTaskIdentity(planWithApproach("unknown-approach"));

    expect(identity).toEqual({
      taskId: "T-TEST-overview-010",
      mode: "edit",
      projectId: "test",
      approach: undefined,
    });
  });

  it("frontmatter の targets を doc id リストとして復元する", () => {
    const plan = [
      "---",
      "specdojo:",
      "  id: test:xep-t-test-overview-140",
      "  type: exec-plan",
      "  task_id: T-TEST-overview-140",
      "  mode: edit",
      "  project_id: test",
      "  approach: bootstrap-finalize",
      "  targets:",
      "    - test:overview",
      "    - overview-rulebook",
      "---",
      "",
      "# Finalize Plan: T-TEST-overview-140",
      "",
    ].join("\n");

    const identity = parsePlanTaskIdentity(plan);

    expect(identity?.targets).toEqual(["test:overview", "overview-rulebook"]);
  });

  it("origin: register を復元し、targets が無くても identity を返す", () => {
    const plan = [
      "---",
      "specdojo:",
      "  id: test:xep-pjr-0137",
      "  type: exec-plan",
      "  task_id: PJR-0137",
      "  mode: edit",
      "  project_id: test",
      "  origin: register",
      "---",
      "",
      "# Edit Plan: PJR-0137",
      "",
    ].join("\n");

    const identity = parsePlanTaskIdentity(plan);

    expect(identity).toEqual({
      taskId: "PJR-0137",
      mode: "edit",
      projectId: "test",
      approach: undefined,
      origin: "register",
    });
  });

  it("未知の origin は無視して schedule 扱い（undefined）にする", () => {
    const plan = [
      "---",
      "specdojo:",
      "  id: test:xep-t-test-overview-010",
      "  type: exec-plan",
      "  task_id: T-TEST-overview-010",
      "  mode: edit",
      "  project_id: test",
      "  origin: adhoc",
      "  targets:",
      "    - test:overview",
      "---",
      "",
      "# Edit Plan: T-TEST-overview-010",
      "",
    ].join("\n");

    expect(parsePlanTaskIdentity(plan)?.origin).toBeUndefined();
  });
});

describe("plan generation (edit done_criteria goals)", () => {
  it("通常 edit plan は完了の狙いを done_criteria 箇条書きで展開し自己レビュー節を持たない", async () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-exec-plans-"));
    const executionPath = join(root, "execution");
    const catalogPath = join(root, "catalog");
    const rolesPath = join(root, "pm-roles.yaml");
    const viewpointsPath = join(root, "pm-review-viewpoints.yaml");

    try {
      mkdirSync(catalogPath, { recursive: true });
      writeFileSync(
        join(catalogPath, "dct-test.yaml"),
        [
          "id: test:dct",
          "type: project",
          "status: draft",
          "project_id: test",
          "domain: test",
          "base_path: /docs/test",
          "groups:",
          "  - deliverables:",
          "      - local_id: overview",
          "        name: Overview",
          "        kind: work",
          "        overview: Test overview",
          "        path: overview.md",
          "        done_criteria:",
          "          - text: Business value is clear",
          "            roles: [BA]",
          "            viewpoint: vp-ba-business-value",
          "          - text: Purpose is approved",
          "            roles: [PO]",
          "            viewpoint: vp-po-purpose-alignment",
        ].join("\n"),
      );
      writeFileSync(
        rolesPath,
        [
          "id: test:roles",
          "type: roles",
          "status: draft",
          "project_id: test",
          "roles:",
          "  - code: BA",
          "    name: Business Analyst",
          "    project_note: Analyze requirements.",
        ].join("\n"),
      );
      writeFileSync(
        viewpointsPath,
        [
          "id: test:viewpoints",
          "type: review-viewpoints",
          "status: draft",
          "project_id: test",
          "viewpoints:",
          ...PO_VIEWPOINTS.flatMap((vp) => [
            `  - id: ${vp.id}`,
            `    role: ${vp.role}`,
            `    category: ${vp.category}`,
            `    title: ${vp.title}`,
            `    check: ${vp.check}`,
            `    evidence: ${vp.evidence}`,
            `    default_severity: ${vp.default_severity}`,
          ]),
        ].join("\n"),
      );

      const base = { executionPath, projectId: "test", catalogPath, rolesPath, viewpointsPath };
      await generateSinglePlan({
        ...base,
        task: {
          id: "T-TEST-overview-020",
          local_id: "overview",
          name: "補強",
          owner: "BA",
          mode: "edit",
          approach: "recipe-guided",
          schedule_file: "",
          fifo_rank: 0,
          critical_first_rank: 0,
        },
      });
      await generateSinglePlan({
        ...base,
        task: {
          id: "T-TEST-overview-030",
          local_id: "overview",
          name: "Recipe メンテナンス",
          owner: "BA",
          mode: "edit",
          approach: "recipe-maintenance",
          schedule_file: "",
          fifo_rank: 0,
          critical_first_rank: 0,
        },
      });

      const editPlan = readFileSync(
        join(executionPath, "exec/plans/T-TEST-overview-020-plan.md"),
        "utf8",
      );
      // Catalog base_path is root-anchored (/docs/test) but the emitted deliverable path
      // must be canonical repo-relative (no leading slash) so the agent resolves it from
      // the run CWD.
      expect(editPlan).toContain("`path`: `docs/test/overview.md`");
      expect(editPlan).not.toContain("/docs/test");
      expect(editPlan).not.toContain("viewpoints_ref:");
      expect(editPlan).toContain("## 5. 完了の狙い");
      // owner（BA）の done_criteria は作成目標として素の箇条書きで提示する。
      expect(editPlan).toContain("owner として達成する狙い");
      expect(editPlan).toContain("- Business value is clear");
      // 下流ロール（PO）の done_criteria は role タグ付きで入力適合として提示する。
      expect(editPlan).toContain("下流ロールの入力適合");
      expect(editPlan).toContain("- [PO] Purpose is approved");
      expect(editPlan).not.toContain("全 role 観点による自己レビュー");
      expect(editPlan).not.toContain("RVP-001");
      expect(editPlan).not.toContain("自己レビューは初回を含めて最大3回まで行う");
      // 共通記法規約（リンク記法）が全 plan へ注入される。見出し文言ではなく安定した本文で検証。
      expect(editPlan).toContain("`[[id|title]]` 形式");
      // unit test の対象限定・全件を連続実行しない規約も全 plan へ注入される。
      expect(editPlan).toContain("全件を1回だけ実行して対象限定の実行を省く");
      // 親検証に設定されたコマンドを executor が sandbox 内で実行しない規約も注入される。
      expect(editPlan).toContain(
        "executor は親検証と同じコマンドの対象限定版も追加せず、二重実行しない",
      );
      // 配置制御: テンプレートの _COMMON_CONVENTIONS_ 位置（末尾・異常終了の条件の後）に入る。
      expect(editPlan.indexOf("`[[id|title]]` 形式")).toBeGreaterThan(
        editPlan.indexOf("異常終了の条件"),
      );
      // markdown 成果物（rulebook/schema 無し）の plan からは YAML schema 検証行が落ち、
      // プレースホルダ（_SCHEMA_REF_）も漏れない。
      expect(editPlan).not.toContain("validate:schema:file");
      expect(editPlan).not.toContain("_SCHEMA_REF_");
      expect(editPlan).toContain("### プロジェクトコンテキスト");
      expect(editPlan).toContain("- [[test:prj-overview]]");
      expect(editPlan).toContain("Why は判断軸として参照し、全文を成果物へ再掲しない");

      const maintenancePlan = readFileSync(
        join(executionPath, "exec/plans/T-TEST-overview-030-plan.md"),
        "utf8",
      );
      expect(maintenancePlan).not.toContain("viewpoints_ref:");
      expect(maintenancePlan).not.toContain("全 role 観点による自己レビュー");
      // approach 違い（recipe-maintenance）の plan にも同じ共通規約が注入される。
      expect(maintenancePlan).toContain("`[[id|title]]` 形式");
      expect(maintenancePlan).not.toContain("### プロジェクトコンテキスト");
      expect(maintenancePlan).not.toContain("_PROJECT_CONTEXT_");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe("plan generation (rulebook includes)", () => {
  // specdojoRootDir() は cwd から上方探索するため、実リポジトリのテンプレートと
  // 移行済み specdojo:cdfd-rulebook（includes: specdojo:cdfd-mermaid-rulebook）を用いて注入を検証する。
  async function generateFullyGuidedPlan(rulebook: string | undefined): Promise<string> {
    const root = mkdtempSync(join(tmpdir(), "specdojo-exec-inc-"));
    const executionPath = join(root, "execution");
    const catalogPath = join(root, "catalog");
    const rolesPath = join(root, "pm-roles.yaml");
    try {
      mkdirSync(catalogPath, { recursive: true });
      writeFileSync(
        join(catalogPath, "dct-test.yaml"),
        [
          "id: test:dct",
          "type: project",
          "status: draft",
          "project_id: test",
          "domain: test",
          "base_path: /docs/test",
          "groups:",
          "  - deliverables:",
          "      - local_id: overview",
          "        name: Overview",
          "        kind: work",
          "        overview: Test overview",
          "        path: overview.md",
          ...(rulebook ? [`        rulebook: ${rulebook}`] : []),
          "        done_criteria:",
          "          - text: Business value is clear",
          "            roles: [BA]",
        ].join("\n"),
      );
      writeFileSync(
        rolesPath,
        [
          "id: test:roles",
          "type: roles",
          "status: draft",
          "project_id: test",
          "roles:",
          "  - code: BA",
          "    name: Business Analyst",
          "    project_note: Analyze requirements.",
        ].join("\n"),
      );
      await generateSinglePlan({
        executionPath,
        projectId: "test",
        catalogPath,
        rolesPath,
        task: {
          id: "T-TEST-overview-020",
          local_id: "overview",
          name: "作成",
          owner: "BA",
          mode: "edit",
          approach: "fully-guided",
          schedule_file: "",
          fifo_rank: 0,
          critical_first_rank: 0,
        },
      });
      return readFileSync(join(executionPath, "exec/plans/T-TEST-overview-020-plan.md"), "utf8");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }

  it("include を宣言する rulebook では併せて適用する rulebook のパスを注入する", async () => {
    const plan = await generateFullyGuidedPlan("specdojo:cdfd-rulebook");

    expect(plan).toContain("併せて適用する rulebook（記法など）:");
    expect(plan).toContain("`docs/ja/specdojo/rulebooks/cdfd-mermaid-rulebook.md`");
    expect(plan).not.toContain("_RULEBOOK_INCLUDES_");
  });

  it("rulebook 未宣言の成果物では併せて適用する rulebook は _MISSING_ になる", async () => {
    const plan = await generateFullyGuidedPlan(undefined);

    expect(plan).toContain("併せて適用する rulebook（記法など）: _MISSING_");
    expect(plan).not.toContain("_RULEBOOK_INCLUDES_");
  });
});

describe("review plan templates", () => {
  const reviewTemplates = [
    "xrp-template.md",
    "xrp-fully-guided-template.md",
    "xrp-recipe-guided-template.md",
    "xrp-freeform-template.md",
    "xrp-retrofit-template.md",
    "xrp-rulebook-maintenance-template.md",
    "xrp-recipe-maintenance-template.md",
    "xrp-sample-maintenance-template.md",
    "xrp-template-maintenance-template.md",
  ];

  it("Prettier 保存後もレビュー観点テーブルと行プレースホルダの間に空行を入れない", async () => {
    for (const template of reviewTemplates) {
      const path = join("docs/ja/specdojo/templates", template);
      const source = readFileSync(path, "utf8");
      const formatted = await format(source, { parser: "markdown" });

      expect(formatted, template).toContain(
        "| --- | ------ | ------------ | -------- |\n_REVIEW_VIEWPOINT_ROWS_",
      );
      expect(formatted, template).not.toContain(
        "| --- | ------ | ------------ | -------- |\n\n_REVIEW_VIEWPOINT_ROWS_",
      );
    }
  });
});

describe("generateSinglePlan", () => {
  function writeCatalog(catalogPath: string, withEvidence = true): void {
    mkdirSync(catalogPath, { recursive: true });
    writeFileSync(
      join(catalogPath, "dct-test.yaml"),
      [
        "id: test:dct",
        "type: project",
        "status: draft",
        "project_id: test",
        "domain: test",
        "base_path: /docs/test",
        "groups:",
        "  - deliverables:",
        "      - local_id: overview",
        "        name: Overview",
        "        kind: work",
        "        overview: Test overview",
        "        path: overview.md",
        ...(withEvidence
          ? [
              "        evidence_refs:",
              "          - kind: implementation",
              "            path: src/exec-plans.ts",
              "            purpose: plan生成の現在動作",
            ]
          : []),
        "        done_criteria:",
        "          - text: Business value is clear",
        "            roles: [BA]",
        "            viewpoint: vp-ba-business-value",
        "      - local_id: summary",
        "        name: Summary",
        "        kind: work",
        "        overview: Test summary",
        "        path: summary.md",
        "        depends_on: [overview]",
        "        done_criteria:",
        "          - text: Summary remains traceable",
        "            roles: [ARC]",
        "            viewpoint: vp-arc-traceability",
      ].join("\n"),
    );
  }

  it("対象タスクの plan を再生成し、他の plan や index には触れない", async () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-single-plan-"));
    const executionPath = join(root, "execution");
    const catalogPath = join(root, "catalog");
    const plansDir = join(executionPath, "exec", "plans");

    try {
      writeCatalog(catalogPath);
      // Pre-existing sibling artifacts that must survive a single-task regeneration.
      mkdirSync(plansDir, { recursive: true });
      writeFileSync(join(plansDir, "T-TEST-overview-099-plan.md"), "keep me\n", "utf8");
      writeFileSync(join(plansDir, "index.md"), "# existing index\n", "utf8");

      const outPath = await generateSinglePlan({
        executionPath,
        projectId: "test",
        catalogPath,
        task: {
          id: "T-TEST-overview-020",
          local_id: "overview",
          name: "補強",
          owner: "BA",
          mode: "edit",
          schedule_file: "sch-track-test.yaml",
          fifo_rank: 0,
          critical_first_rank: 0,
        },
      });

      expect(outPath).toBe(join(plansDir, "T-TEST-overview-020-plan.md"));
      const plan = readFileSync(outPath, "utf8");
      expect(plan).toContain("task_id: T-TEST-overview-020");
      expect(plan).toContain("rulebook: none");
      expect(plan).toContain("Business value is clear");

      // Sibling plan and index are untouched (single-task generation must not wipe them).
      expect(readFileSync(join(plansDir, "T-TEST-overview-099-plan.md"), "utf8")).toBe("keep me\n");
      expect(readFileSync(join(plansDir, "index.md"), "utf8")).toBe("# existing index\n");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it.each(["edit", "review"] as const)(
    "retrofit %s plan へ実装エビデンスを展開し targets には追加しない",
    async (mode) => {
      const root = mkdtempSync(join(tmpdir(), "specdojo-retrofit-plan-"));
      const executionPath = join(root, "execution");
      const catalogPath = join(root, "catalog");
      try {
        writeCatalog(catalogPath);
        const outPath = await generateSinglePlan({
          executionPath,
          projectId: "test",
          catalogPath,
          task: {
            id: `T-TEST-overview-${mode === "edit" ? "020" : "030"}`,
            local_id: "overview",
            name: "実装反映",
            mode,
            approach: "retrofit",
            schedule_file: "sch-track-test.yaml",
            fifo_rank: 0,
            critical_first_rank: 0,
          },
        });

        const plan = readFileSync(outPath, "utf8");
        expect(plan).toContain("approach: retrofit");
        expect(plan).toContain("## 3. 実装エビデンス");
        expect(plan).toContain("`src/exec-plans.ts`（implementation）: plan生成の現在動作");
        expect(plan).toContain("targets:\n    - test:overview");
        expect(plan).not.toContain("targets:\n    - test:overview\n    - src/exec-plans.ts");
        expect(plan).not.toContain("_IMPLEMENTATION_EVIDENCE_");
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    },
  );

  it("retrofit 対象に evidence_refs がなければ plan 生成を拒否する", async () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-retrofit-missing-"));
    const executionPath = join(root, "execution");
    const catalogPath = join(root, "catalog");
    try {
      writeCatalog(catalogPath, false);

      await expect(
        generateSinglePlan({
          executionPath,
          projectId: "test",
          catalogPath,
          task: {
            id: "T-TEST-overview-020",
            local_id: "overview",
            mode: "edit",
            approach: "retrofit",
            schedule_file: "sch-track-test.yaml",
            fifo_rank: 0,
            critical_first_rank: 0,
          },
        }),
      ).rejects.toThrow(/has no evidence_refs/);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("横断 pass は複数成果物を targets と本文へ列挙する", async () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-cross-plan-"));
    const executionPath = join(root, "execution");
    const catalogPath = join(root, "catalog");

    try {
      writeCatalog(catalogPath);
      const outPath = await generateSinglePlan({
        executionPath,
        projectId: "test",
        catalogPath,
        task: {
          id: "T-TEST-project-dedup-060",
          target_local_ids: ["overview", "summary"],
          name: "Project dedup",
          owner: "ARC",
          mode: "edit",
          approach: "cross-deliverable-dedup",
          schedule_file: "sch-track-test.yaml",
          fifo_rank: 0,
          critical_first_rank: 0,
        },
      });

      const plan = readFileSync(outPath, "utf8");
      expect(plan).toContain("approach: cross-deliverable-dedup");
      expect(plan).toContain("targets:\n    - test:overview\n    - test:summary");
      expect(plan).toContain("document: [[test:overview]]");
      expect(plan).toContain("document: [[test:summary]]");
      expect(plan).toContain("Summary remains traceable");
      expect(plan).toContain("意図的に残した重複");
      expect(plan).not.toContain("_TARGET_DELIVERABLES_");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("stem を渡すとユニーク名でファイル・id・result 参照を出力し task_id は保持する", async () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-single-plan-"));
    const executionPath = join(root, "execution");
    const catalogPath = join(root, "catalog");
    const stem = "overview-20260620t125519z-0328";

    try {
      writeCatalog(catalogPath);

      const outPath = await generateSinglePlan({
        executionPath,
        projectId: "test",
        catalogPath,
        stem,
        task: {
          id: "T-TEST-overview-020",
          local_id: "overview",
          mode: "edit",
          schedule_file: "sch-track-test.yaml",
          fifo_rank: 0,
          critical_first_rank: 0,
        },
      });

      // File name uses the stem; the fixed-name plan must not also be written.
      expect(outPath).toBe(join(executionPath, "exec", "plans", `${stem}-plan.md`));
      expect(existsSync(join(executionPath, "exec", "plans", "T-TEST-overview-020-plan.md"))).toBe(
        false,
      );

      const plan = readFileSync(outPath, "utf8");
      // id is unique per stem; the embedded result ref shares the stem; task_id stays the task id.
      expect(plan).toContain(`id: test:xep-${stem}`);
      expect(plan).toContain(`exec/results/${stem}-result.md`);
      expect(plan).toContain("task_id: T-TEST-overview-020");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("plans ディレクトリが無くても作成して書き込む", async () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-single-plan-"));
    const executionPath = join(root, "execution");
    const catalogPath = join(root, "catalog");

    try {
      writeCatalog(catalogPath);
      expect(existsSync(join(executionPath, "exec", "plans"))).toBe(false);

      const outPath = await generateSinglePlan({
        executionPath,
        projectId: "test",
        catalogPath,
        task: {
          id: "T-TEST-overview-020",
          local_id: "overview",
          mode: "edit",
          schedule_file: "sch-track-test.yaml",
          fifo_rank: 0,
          critical_first_rank: 0,
        },
      });

      expect(existsSync(outPath)).toBe(true);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("review plan のレビュー観点テーブルは区切り行の直後に RVP 行を出力する", async () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-single-plan-"));
    const executionPath = join(root, "execution");
    const catalogPath = join(root, "catalog");

    try {
      writeCatalog(catalogPath);

      const outPath = await generateSinglePlan({
        executionPath,
        projectId: "test",
        catalogPath,
        task: {
          id: "T-TEST-overview-090",
          local_id: "overview",
          mode: "review",
          schedule_file: "sch-track-test.yaml",
          fifo_rank: 0,
          critical_first_rank: 0,
        },
      });

      const plan = readFileSync(outPath, "utf8");
      expect(plan).toContain("| --- | ------ | ------------ | -------- |\n| RVP-001 |");
      expect(plan).not.toContain("| --- | ------ | ------------ | -------- |\n\n| RVP-001 |");
      expect(plan).toContain("### プロジェクトコンテキスト");
      expect(plan).toContain("- [[test:prj-overview]]");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("review plan はプロジェクト差分から共通レビュー観点を解決して展開する", async () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-single-plan-"));
    const executionPath = join(root, "execution");
    const catalogPath = join(root, "catalog");
    const viewpointsPath = join(root, "pm-review-viewpoints.yaml");

    try {
      writeCatalog(catalogPath);
      writeFileSync(
        viewpointsPath,
        [
          "id: prj-9999:pm-review-viewpoints",
          "type: project",
          "status: draft",
          "title: レビュー観点一覧",
          "rulebook: none",
          "project_id: prj-9999",
          "extends: specdojo:pm-review-viewpoints",
          "viewpoints: []",
          "role_viewpoint_sets: []",
          "disabled:",
          "  viewpoints: []",
          "  role_viewpoint_sets: []",
        ].join("\n"),
        "utf8",
      );

      const outPath = await generateSinglePlan({
        executionPath,
        projectId: "test",
        catalogPath,
        viewpointsPath,
        task: {
          id: "T-TEST-overview-091",
          local_id: "overview",
          mode: "review",
          schedule_file: "sch-track-test.yaml",
          fifo_rank: 0,
          critical_first_rank: 0,
        },
      });

      const plan = readFileSync(outPath, "utf8");
      expect(plan).toContain("業務価値を定義・展開する成果物で");
      expect(plan).toContain("vp-ba-business-value");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("project_context は空配列で opt-out でき、context 文書自身には自己参照を出さない", async () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-single-plan-"));
    const executionPath = join(root, "execution");
    const catalogPath = join(root, "catalog");

    try {
      writeCatalog(catalogPath);

      const optOutPath = await generateSinglePlan({
        executionPath,
        projectId: "test",
        catalogPath,
        projectContext: [],
        stem: "opt-out",
        task: {
          id: "T-TEST-overview-020",
          local_id: "overview",
          mode: "edit",
          schedule_file: "sch-track-test.yaml",
          fifo_rank: 0,
          critical_first_rank: 0,
        },
      });
      const selfPath = await generateSinglePlan({
        executionPath,
        projectId: "test",
        catalogPath,
        projectContext: ["overview"],
        stem: "self-context",
        task: {
          id: "T-TEST-overview-090",
          local_id: "overview",
          mode: "review",
          schedule_file: "sch-track-test.yaml",
          fifo_rank: 0,
          critical_first_rank: 0,
        },
      });

      expect(readFileSync(optOutPath, "utf8")).not.toContain("### プロジェクトコンテキスト");
      expect(readFileSync(selfPath, "utf8")).not.toContain("### プロジェクトコンテキスト");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe("execution: human results", () => {
  function writeCatalog(catalogPath: string): void {
    mkdirSync(catalogPath, { recursive: true });
    writeFileSync(
      join(catalogPath, "dct-test.yaml"),
      [
        "id: test:dct",
        "type: project",
        "status: draft",
        "project_id: test",
        "domain: test",
        "base_path: /docs/test",
        "groups:",
        "  - deliverables:",
        "      - local_id: overview",
        "        name: Overview",
        "        kind: work",
        "        overview: Test overview",
        "        path: overview.md",
        "        done_criteria:",
        "          - text: Business value is clear",
        "            roles: [BA]",
        "            viewpoint: vp-ba-business-value",
      ].join("\n"),
    );
  }

  it("execution: human のタスクでは plan を生成しない", async () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-human-plan-"));
    const executionPath = join(root, "execution");
    const catalogPath = join(root, "catalog");

    try {
      writeCatalog(catalogPath);

      await expect(
        generateSinglePlan({
          executionPath,
          projectId: "test",
          catalogPath,
          task: {
            id: "T-TEST-overview-140",
            local_id: "overview",
            name: "完成版確定",
            owner: "BA",
            mode: "edit",
            execution: "human",
            approach: "finalize",
            schedule_file: "sch-track-test.yaml",
            fifo_rank: 0,
            critical_first_rank: 0,
          },
        }),
      ).rejects.toThrow(/execution: human.*result instead of a plan/);
      expect(existsSync(join(executionPath, "exec", "plans"))).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("finalizeResultSectionsForDeliverable は roles/viewpoint 注記付きチェックリストと確定対象を返す", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-finalize-sections-"));
    const catalogPath = join(root, "catalog");

    try {
      writeCatalog(catalogPath);

      const sections = finalizeResultSectionsForDeliverable(
        catalogPath,
        "overview",
        "bootstrap-finalize",
      );

      expect(sections?.doneCriteriaChecklist).toBe(
        "- [ ] Business value is clear（BA / vp-ba-business-value）",
      );
      // rulebook 未宣言の成果物では実践の型は解決されず、確定対象は成果物のみになる。
      expect(sections?.targetsChecklist).toContain("- [ ] 成果物: `");
      expect(sections?.targetsChecklist).not.toContain("rulebook");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("finalizeResultSectionsForDeliverable は成果物を解決できない場合 undefined を返す", () => {
    expect(finalizeResultSectionsForDeliverable("", "overview", "finalize")).toBeUndefined();
    const root = mkdtempSync(join(tmpdir(), "specdojo-finalize-sections-"));
    const catalogPath = join(root, "catalog");

    try {
      writeCatalog(catalogPath);

      expect(
        finalizeResultSectionsForDeliverable(catalogPath, "missing", "finalize"),
      ).toBeUndefined();
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("targetDocIdsForDeliverable は成果物の project 修飾 doc id を先頭に返す", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-targets-"));
    const catalogPath = join(root, "catalog");

    try {
      writeCatalog(catalogPath);

      // rulebook 未宣言の成果物では実践の型は解決されず、成果物のみになる。
      expect(
        targetDocIdsForDeliverable(catalogPath, "overview", "test", "bootstrap-finalize"),
      ).toEqual(["test:overview"]);
      // 実践の型を対象にしない approach でも成果物は常に含む。
      expect(targetDocIdsForDeliverable(catalogPath, "overview", "test", "fully-guided")).toEqual([
        "test:overview",
      ]);
      // targets は必須項目のため、catalog で解決できなくても成果物の doc id へフォールバックする。
      expect(targetDocIdsForDeliverable(catalogPath, "missing", "test", "finalize")).toEqual([
        "test:missing",
      ]);
      expect(targetDocIdsForDeliverable("", "overview", "test", "finalize")).toEqual([
        "test:overview",
      ]);
      // localId 不明の場合のみ undefined。
      expect(
        targetDocIdsForDeliverable(catalogPath, undefined, "test", "finalize"),
      ).toBeUndefined();
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
