import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import {
  buildInPlaceStem,
  generateSinglePlan,
  ownerRoleFields,
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
      // 配置制御: テンプレートの _COMMON_CONVENTIONS_ 位置（末尾・異常終了の条件の後）に入る。
      expect(editPlan.indexOf("`[[id|title]]` 形式")).toBeGreaterThan(
        editPlan.indexOf("異常終了の条件"),
      );
      // markdown 成果物（rulebook/schema 無し）の plan からは YAML schema 検証行が落ち、
      // プレースホルダ（_SCHEMA_REF_）も漏れない。
      expect(editPlan).not.toContain("validate:schema:file");
      expect(editPlan).not.toContain("_SCHEMA_REF_");

      const maintenancePlan = readFileSync(
        join(executionPath, "exec/plans/T-TEST-overview-030-plan.md"),
        "utf8",
      );
      expect(maintenancePlan).not.toContain("viewpoints_ref:");
      expect(maintenancePlan).not.toContain("全 role 観点による自己レビュー");
      // approach 違い（recipe-maintenance）の plan にも同じ共通規約が注入される。
      expect(maintenancePlan).toContain("`[[id|title]]` 形式");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe("generateSinglePlan", () => {
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
      expect(plan).toContain("Business value is clear");

      // Sibling plan and index are untouched (single-task generation must not wipe them).
      expect(readFileSync(join(plansDir, "T-TEST-overview-099-plan.md"), "utf8")).toBe("keep me\n");
      expect(readFileSync(join(plansDir, "index.md"), "utf8")).toBe("# existing index\n");
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
});
