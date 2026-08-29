import { afterEach, describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import {
  approachPurpose,
  assessmentFileName,
  buildAssessmentSkeleton,
  collectAssessmentFacts,
  dumpAssessment,
  effectiveUsability,
  isHumanConfirmationApproach,
  loadStrategyScope,
  resolveAssessmentPath,
  resolveRecommendedApproach,
  trackFromAssessmentFileName,
  validateAssessment,
  validateAssessmentSchema,
  writeAssessment,
  type AssessedDeliverable,
  type AssessmentJudgment,
  type EffectiveUsability,
  type KataCheck,
  type KataJudgment,
  type KataKindKey,
  type SchAssessment,
} from "../../src/schedule-assessment.js";
import { renderAssessmentPrompt } from "../../src/schedule-assessment-prompt.js";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

const CATALOG_REL = "docs/ja/projects/prj-0001/010-deliverables-catalog/dct-sample.yaml";
const SCHEDULE_REL = "docs/ja/projects/prj-0001/schedule";
const STRATEGY_REL = `${SCHEDULE_REL}/sch-strategy-launch.yaml`;
const DOCS_BASE = "docs/ja/product/010-specs";

// --- fixture ------------------------------------------------------------------

function write(root: string, relPath: string, content: string): void {
  const filePath = join(root, relPath);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, "utf8");
}

function markdownDoc(id: string, status: string, body: string): string {
  return `---\nspecdojo:\n  id: ${id}\n  type: rulebook\n  status: ${status}\n---\n\n# ${id}\n\n${body}\n`;
}

function rulebookDoc(id: string, refs: Record<string, string>, status = "draft"): string {
  const declared = Object.entries(refs)
    .map(([key, value]) => `  ${key}: ${value}\n`)
    .join("");
  return `---\nspecdojo:\n  id: ${id}\n  type: rulebook\n  status: ${status}\n${declared}---\n\n# ${id}\n\n本文\n`;
}

// 一時リポジトリを cwd にして specdojoRootDir() と実践の型の解決先を temp 内へ閉じ込める。
// 判定条件（4種そろい／一部のみ／宣言先不在／not-needed 宣言／実装エビデンス／既存成果物の有無）を
// 1 つのカタログに集約し、事実収集の分岐を網羅する。
function withRepo(fn: (root: string) => void): void {
  const originalCwd = process.cwd();
  const root = mkdtempSync(join(tmpdir(), "specdojo-sch-assessment-"));
  try {
    write(
      root,
      ".specdojo/specdojo.config.json",
      `${JSON.stringify({ version: 1, projects: {} })}\n`,
    );

    // 4種がそろう実践の型。sample は draft のまま利用可能なケースに使う。
    write(
      root,
      "docs/ja/specdojo/rulebooks/full-rulebook.md",
      rulebookDoc("specdojo:full-rulebook", {
        recipe: "specdojo:full-recipe",
        sample: "specdojo:full-sample",
        template: "specdojo:full-template",
      }),
    );
    write(
      root,
      "docs/ja/specdojo/recipes/full-recipe.md",
      markdownDoc("specdojo:full-recipe", "ready", "問い"),
    );
    write(
      root,
      "docs/ja/specdojo/samples/full-sample.md",
      markdownDoc("specdojo:full-sample", "draft", "例"),
    );
    write(
      root,
      "docs/ja/specdojo/templates/full-template.md",
      markdownDoc("specdojo:full-template", "draft", "雛形"),
    );

    // 宣言なしで慣例ファイルだけが実在する recipe と、宣言先が存在しない sample。
    write(
      root,
      "docs/ja/specdojo/rulebooks/partial-rulebook.md",
      rulebookDoc("specdojo:partial-rulebook", {
        sample: "specdojo:missing-sample",
        template: "not-needed",
      }),
    );
    write(
      root,
      "docs/ja/specdojo/recipes/partial-recipe.md",
      markdownDoc("specdojo:partial-recipe", "draft", "問い"),
    );

    write(
      root,
      CATALOG_REL,
      yaml.dump({
        id: "prj-0001:dct-sample",
        type: "project",
        status: "draft",
        project_id: "prj-0001",
        domain: "sample",
        base_path: `/${DOCS_BASE}`,
        groups: [
          {
            deliverables: [
              {
                local_id: "full-kata-doc",
                name: "実践の型がそろう成果物",
                kind: "work",
                overview: "4種の実践の型が実在する成果物",
                path: "full-kata-doc.md",
                rulebook: "specdojo:full-rulebook",
              },
              {
                local_id: "partial-kata-doc",
                name: "一部だけ整備された成果物",
                kind: "work",
                overview: "慣例 recipe のみ実在し、sample の宣言先が不在",
                path: "partial-kata-doc.md",
                rulebook: "specdojo:partial-rulebook",
              },
              {
                local_id: "no-kata-doc",
                name: "実践の型が無い成果物",
                kind: "work",
                overview: "rulebook 未宣言",
                path: "no-kata-doc.md",
                evidence_refs: [
                  { kind: "implementation", path: "src/existing-impl.ts", purpose: "現在動作" },
                  { kind: "implementation", path: "src/gone-impl.ts", purpose: "不在" },
                ],
              },
              {
                local_id: "undecided-kata-doc",
                name: "実践の型の要否が未判断の成果物",
                kind: "work",
                overview: "4種の実践の型の要否を bootstrap で判断する成果物",
                path: "undecided-kata-doc.md",
                rulebook: "undecided",
              },
              {
                local_id: "control-doc",
                name: "対象外の管理成果物",
                kind: "control",
                overview: "include_kinds に含まれない",
                path: "control-doc.md",
              },
            ],
          },
        ],
      }),
    );

    write(
      root,
      STRATEGY_REL,
      yaml.dump({
        kind: "strategy",
        id: "prj-0001:sch-strategy-launch",
        type: "project",
        status: "draft",
        track: "launch",
        scope: {
          catalogs: [{ id: "prj-0001:dct-sample", path: `/${CATALOG_REL}` }],
          include_kinds: ["work"],
        },
      }),
    );

    // 既存成果物あり（full-kata-doc）／なし（partial-kata-doc, no-kata-doc）。
    write(
      root,
      `${DOCS_BASE}/full-kata-doc.md`,
      markdownDoc("prj-0001:full-kata-doc", "draft", "本文"),
    );
    write(root, "src/existing-impl.ts", "export const impl = 1;\n");

    process.chdir(root);
    fn(root);
  } finally {
    process.chdir(originalCwd);
    rmSync(root, { recursive: true, force: true });
  }
}

function collect(root: string): AssessedDeliverable[] {
  const scope = loadStrategyScope(join(root, STRATEGY_REL));
  const result = collectAssessmentFacts({ repoRoot: root, scope });
  expect(result.errors).toEqual([]);
  return result.deliverables;
}

function byLocalId(deliverables: AssessedDeliverable[], localId: string): AssessedDeliverable {
  const found = deliverables.find((item) => item.local_id === localId);
  if (!found) throw new Error(`fixture missing deliverable: ${localId}`);
  return found;
}

// --- judgment helpers ---------------------------------------------------------

function checks(result: KataCheck["result"] = "pass"): KataCheck[] {
  return [
    { check: "target-fit", result, note: "対象成果物向けの章立て" },
    { check: "substantive-content", result, note: "placeholder ではない記述がある" },
    { check: "internal-consistency", result, note: "他の型と矛盾しない" },
    { check: "standard-alignment", result, note: "現行 rulebook と整合" },
  ];
}

function kataJudgment(result: KataCheck["result"] = "pass"): KataJudgment {
  return {
    usability: result === "pass" ? "usable" : result === "fail" ? "unusable" : "unknown",
    checks: checks(result),
    rationale: "内容を確認した",
    confidence: "high",
  };
}

function judgment(overrides: Partial<AssessmentJudgment> = {}): AssessmentJudgment {
  return {
    intent: "author-deliverable",
    intent_rationale: "成果物の初稿を作成する",
    kata: {
      rulebook: kataJudgment(),
      recipe: kataJudgment(),
      sample: kataJudgment(),
      template: kataJudgment(),
    },
    recommended_approach: "fully-guided",
    rationale: "4種の実践の型が利用できる",
    evidence: ["docs/ja/specdojo/rulebooks/full-rulebook.md"],
    confidence: "high",
    ...overrides,
  };
}

function assessmentOf(deliverables: AssessedDeliverable[]): SchAssessment {
  return buildAssessmentSkeleton({
    scope: {
      strategyId: "prj-0001:sch-strategy-launch",
      track: "launch",
      projectId: "prj-0001",
      catalogs: [{ id: "prj-0001:dct-sample", path: `/${CATALOG_REL}` }],
      includeKinds: ["work"],
    },
    strategyRelPath: STRATEGY_REL,
    deliverables,
  });
}

function usabilityOf(overrides: Partial<Record<KataKindKey, EffectiveUsability>> = {}) {
  return {
    rulebook: "absent" as EffectiveUsability,
    recipe: "absent" as EffectiveUsability,
    sample: "absent" as EffectiveUsability,
    template: "absent" as EffectiveUsability,
    ...overrides,
  };
}

// --- tests --------------------------------------------------------------------

describe("collectAssessmentFacts", () => {
  it("rulebook 正本の宣言・未宣言・not-needed・宣言先不在を区別して事実を収集する", () => {
    withRepo((root) => {
      const deliverables = collect(root);

      const full = byLocalId(deliverables, "full-kata-doc");
      expect(full.facts.kata.rulebook).toEqual({
        declaration: "declared",
        id: "specdojo:full-rulebook",
        path: "docs/ja/specdojo/rulebooks/full-rulebook.md",
        exists: true,
        status: "draft",
        broken_reference: false,
      });
      expect(full.facts.kata.recipe.declaration).toBe("declared");
      expect(full.facts.kata.recipe.status).toBe("ready");
      // status: draft でもファイルは実在し、利用可否は agent 判定に委ねる。
      expect(full.facts.kata.sample).toMatchObject({ exists: true, status: "draft" });

      const partial = byLocalId(deliverables, "partial-kata-doc");
      expect(partial.facts.kata.recipe).toMatchObject({
        declaration: "unresolved",
        exists: false,
      });
      expect(partial.facts.kata.sample).toMatchObject({
        declaration: "declared",
        exists: false,
        broken_reference: true,
      });
      expect(partial.facts.kata.template).toMatchObject({
        declaration: "not-needed",
        exists: false,
        broken_reference: false,
      });

      const none = byLocalId(deliverables, "no-kata-doc");
      for (const kind of ["rulebook", "recipe", "sample", "template"] as KataKindKey[]) {
        expect(none.facts.kata[kind]).toMatchObject({ declaration: "unresolved", exists: false });
      }

      const undecided = byLocalId(deliverables, "undecided-kata-doc");
      for (const kind of ["rulebook", "recipe", "sample", "template"] as KataKindKey[]) {
        expect(undecided.facts.kata[kind]).toMatchObject({
          declaration: "undecided",
          exists: false,
          broken_reference: false,
        });
      }
    });
  });

  it("成果物の実在・status と実装エビデンスの解決結果を収集する", () => {
    withRepo((root) => {
      const deliverables = collect(root);

      expect(byLocalId(deliverables, "full-kata-doc").facts.deliverable).toEqual({
        path: `${DOCS_BASE}/full-kata-doc.md`,
        exists: true,
        status: "draft",
      });
      expect(byLocalId(deliverables, "partial-kata-doc").facts.deliverable).toEqual({
        path: `${DOCS_BASE}/partial-kata-doc.md`,
        exists: false,
      });
      expect(byLocalId(deliverables, "no-kata-doc").facts.evidence_refs).toEqual([
        { path: "src/existing-impl.ts", purpose: "現在動作", exists: true },
        { path: "src/gone-impl.ts", purpose: "不在", exists: false },
      ]);
    });
  });

  it("include_kinds に含まれない成果物を対象にしない", () => {
    withRepo((root) => {
      const localIds = collect(root).map((item) => item.local_id);

      expect(localIds).toEqual([
        "full-kata-doc",
        "no-kata-doc",
        "partial-kata-doc",
        "undecided-kata-doc",
      ]);
    });
  });

  it("カタログが見つからない場合はエラーを返す", () => {
    withRepo((root) => {
      const scope = loadStrategyScope(join(root, STRATEGY_REL));
      const broken = { ...scope, catalogs: [{ id: "x", path: "/docs/ja/missing.yaml" }] };

      const result = collectAssessmentFacts({ repoRoot: root, scope: broken });

      expect(result.errors).toEqual(["Catalog not found: /docs/ja/missing.yaml"]);
    });
  });
});

describe("resolveRecommendedApproach", () => {
  const base = {
    deliverableExists: true,
    resolvedEvidenceCount: 0,
  };

  it("4種が利用可能なら fully-guided を選ぶ", () => {
    const decision = resolveRecommendedApproach({
      ...base,
      intent: "author-deliverable",
      usability: usabilityOf({
        rulebook: "usable",
        recipe: "usable",
        sample: "usable",
        template: "usable",
      }),
    });

    expect(decision.approach).toBe("fully-guided");
  });

  it("not-needed を欠落扱いせず、必要な型が揃えば fully-guided を選ぶ", () => {
    const decision = resolveRecommendedApproach({
      ...base,
      intent: "author-deliverable",
      usability: usabilityOf({
        rulebook: "usable",
        recipe: "not-needed",
        sample: "usable",
        template: "not-needed",
      }),
    });

    expect(decision.approach).toBe("fully-guided");
  });

  it("recipe だけ利用可能なら recipe-guided を選ぶ", () => {
    const decision = resolveRecommendedApproach({
      ...base,
      intent: "author-deliverable",
      usability: usabilityOf({ recipe: "usable", sample: "unusable" }),
    });

    expect(decision.approach).toBe("recipe-guided");
  });

  it("基準にできる型が無くても bootstrap を自動選択せず freeform にする", () => {
    const decision = resolveRecommendedApproach({
      ...base,
      intent: "author-deliverable",
      usability: usabilityOf({ rulebook: "unusable" }),
    });

    expect(decision.approach).toBe("freeform");
    expect(decision.reasons.join()).toContain("bootstrap-kata-set");
  });

  it("利用可否が判定できない型が残る場合は undecided で停止する", () => {
    const decision = resolveRecommendedApproach({
      ...base,
      intent: "author-deliverable",
      usability: usabilityOf({ recipe: "usable", sample: "unknown" }),
    });

    expect(decision.approach).toBe("undecided");
    expect(decision.reasons.join()).toContain("sample");
  });

  it("bootstrap は bootstrap_scope が無いと undecided になる", () => {
    const decision = resolveRecommendedApproach({
      ...base,
      intent: "bootstrap-kata-set",
      usability: usabilityOf(),
    });

    expect(decision.approach).toBe("undecided");
  });

  it("bootstrap_scope の型がすべて利用可能なら初期整備の対象にしない", () => {
    const decision = resolveRecommendedApproach({
      ...base,
      intent: "bootstrap-kata-set",
      usability: usabilityOf({ recipe: "usable", sample: "usable" }),
      bootstrapScope: ["recipe", "sample"],
    });

    expect(decision.approach).toBe("undecided");
  });

  it("成果物と型一式を初期整備する場合に bootstrap を選ぶ", () => {
    const decision = resolveRecommendedApproach({
      ...base,
      deliverableExists: false,
      intent: "bootstrap-kata-set",
      usability: usabilityOf(),
      bootstrapScope: ["rulebook", "recipe", "sample", "template"],
    });

    expect(decision.approach).toBe("bootstrap");
  });

  it("実装エビデンスが解決できない場合は retrofit にしない", () => {
    const decision = resolveRecommendedApproach({
      ...base,
      intent: "reflect-implementation",
      usability: usabilityOf(),
    });

    expect(decision.approach).toBe("undecided");
  });

  it("解決済みの実装エビデンスがあれば retrofit を選ぶ", () => {
    const decision = resolveRecommendedApproach({
      ...base,
      intent: "reflect-implementation",
      usability: usabilityOf(),
      resolvedEvidenceCount: 2,
    });

    expect(decision.approach).toBe("retrofit");
  });

  it("目的別フェーズを intent から選ぶ", () => {
    expect(
      resolveRecommendedApproach({
        ...base,
        intent: "improve-kata",
        usability: usabilityOf({ recipe: "usable" }),
        kataTarget: "recipe",
      }).approach,
    ).toBe("recipe-maintenance");
    expect(
      resolveRecommendedApproach({
        ...base,
        intent: "confirm-deliverable",
        usability: usabilityOf(),
      }).approach,
    ).toBe("finalize");
    expect(
      resolveRecommendedApproach({
        ...base,
        intent: "confirm-with-kata-set",
        usability: usabilityOf(),
        bootstrapScope: ["rulebook"],
      }).approach,
    ).toBe("bootstrap-finalize");
    expect(
      resolveRecommendedApproach({
        ...base,
        intent: "deduplicate-across-deliverables",
        usability: usabilityOf(),
      }).approach,
    ).toBe("cross-deliverable-dedup");
  });

  it("improve-kata は kata_target が無いと undecided になる", () => {
    const decision = resolveRecommendedApproach({
      ...base,
      intent: "improve-kata",
      usability: usabilityOf({ recipe: "usable" }),
    });

    expect(decision.approach).toBe("undecided");
  });

  it("not-needed の型は maintenance 対象にしない", () => {
    const decision = resolveRecommendedApproach({
      ...base,
      intent: "improve-kata",
      usability: usabilityOf({ recipe: "not-needed" }),
      kataTarget: "recipe",
    });

    expect(decision.approach).toBe("undecided");
    expect(decision.reasons.join("\n")).toContain("not-needed");
  });
});

describe("approachPurpose", () => {
  it("整備状況で決まる進め方と目的別フェーズを区別する", () => {
    expect(approachPurpose("fully-guided")).toBe("readiness");
    expect(approachPurpose("recipe-guided")).toBe("readiness");
    expect(approachPurpose("freeform")).toBe("readiness");
    expect(approachPurpose("bootstrap")).toBe("kata-bootstrap");
    expect(approachPurpose("retrofit")).toBe("implementation");
    expect(approachPurpose("cross-deliverable-dedup")).toBe("cross-deliverable");
    expect(approachPurpose("sample-maintenance")).toBe("kata-maintenance");
    expect(approachPurpose("finalize")).toBe("human-confirmation");
    expect(approachPurpose("bootstrap-finalize")).toBe("human-confirmation");
    expect(isHumanConfirmationApproach("finalize")).toBe(true);
    expect(isHumanConfirmationApproach("bootstrap")).toBe(false);
    expect(isHumanConfirmationApproach("undecided")).toBe(false);
  });
});

describe("effectiveUsability", () => {
  it("ファイルが存在しない型は absent、未判定は unknown として扱う", () => {
    withRepo((root) => {
      const deliverables = collect(root);
      const partial = byLocalId(deliverables, "partial-kata-doc");
      const full = byLocalId(deliverables, "full-kata-doc");

      expect(effectiveUsability(partial.facts, undefined, "sample")).toBe("absent");
      expect(effectiveUsability(partial.facts, undefined, "recipe")).toBe("absent");
      // 実体が無い型は、判定があっても absent のままとする。慣例ファイルの探索を廃止したため、
      // rulebook が宣言していない型は「必要だが未整備」であり、判定で埋められない。
      expect(
        effectiveUsability(partial.facts, judgment({ kata: { recipe: kataJudgment() } }), "recipe"),
      ).toBe("absent");
      // 実体がある型は、判定が無ければ unknown、判定があればその usability を返す。
      expect(effectiveUsability(full.facts, undefined, "recipe")).toBe("unknown");
      expect(
        effectiveUsability(full.facts, judgment({ kata: { recipe: kataJudgment() } }), "recipe"),
      ).toBe("usable");
    });
  });
});

describe("validateAssessment", () => {
  it("骨組みは検証に通り、未判定であることを警告する", () => {
    withRepo((root) => {
      const assessment = assessmentOf(collect(root));

      expect(validateAssessmentSchema(assessment, repoRoot)).toEqual([]);
      const result = validateAssessment(assessment, { fileName: assessmentFileName("launch") });

      expect(result.ok).toBe(true);
      expect(result.warnings.join()).toContain("まだ 1 件も判定されていない");
    });
  });

  it("status: draft の実践の型でも利用可能と判定できる", () => {
    withRepo((root) => {
      const deliverables = collect(root);
      const assessment = assessmentOf(deliverables);
      byLocalId(assessment.deliverables, "full-kata-doc").judgment = judgment();

      const result = validateAssessment(assessment, {
        fileName: assessmentFileName("launch"),
        currentFacts: new Map(deliverables.map((item) => [item.local_id, item.facts])),
      });

      expect(result.errors).toEqual([]);
    });
  });

  it("存在する実践の型の判定が欠けている場合はエラーにする", () => {
    withRepo((root) => {
      const assessment = assessmentOf(collect(root));
      byLocalId(assessment.deliverables, "full-kata-doc").judgment = judgment({
        kata: { rulebook: kataJudgment(), recipe: kataJudgment(), sample: kataJudgment() },
      });

      const result = validateAssessment(assessment);

      expect(result.errors.join()).toContain("kata.template");
    });
  });

  it("存在しない実践の型を判定している場合はエラーにする", () => {
    withRepo((root) => {
      const assessment = assessmentOf(collect(root));
      byLocalId(assessment.deliverables, "partial-kata-doc").judgment = judgment({
        intent: "author-deliverable",
        kata: { recipe: kataJudgment(), sample: kataJudgment() },
        recommended_approach: "recipe-guided",
      });

      const result = validateAssessment(assessment);

      expect(result.errors.join()).toContain("kata.sample はファイルが存在しない");
    });
  });

  it("checks と usability が矛盾する場合はエラーにする", () => {
    withRepo((root) => {
      const assessment = assessmentOf(collect(root));
      byLocalId(assessment.deliverables, "full-kata-doc").judgment = judgment({
        kata: {
          rulebook: { ...kataJudgment(), checks: checks("fail") },
          recipe: kataJudgment(),
          sample: kataJudgment(),
          template: kataJudgment(),
        },
      });

      const result = validateAssessment(assessment);

      expect(result.errors.join()).toContain("checks から導かれる 'unusable'");
    });
  });

  it("推奨フローが判定規則の結果と異なる場合はエラーにする", () => {
    withRepo((root) => {
      const assessment = assessmentOf(collect(root));
      byLocalId(assessment.deliverables, "full-kata-doc").judgment = judgment({
        recommended_approach: "bootstrap",
      });

      const result = validateAssessment(assessment);

      expect(result.errors.join()).toContain("判定規則の結果 'fully-guided'");
    });
  });

  it("undecided は blocking な open_questions が無いとエラーにする", () => {
    withRepo((root) => {
      const assessment = assessmentOf(collect(root));
      assessment.open_questions = [];
      byLocalId(assessment.deliverables, "full-kata-doc").judgment = judgment({
        kata: {
          rulebook: kataJudgment("unknown"),
          recipe: kataJudgment(),
          sample: kataJudgment(),
          template: kataJudgment(),
        },
        recommended_approach: "undecided",
      });

      const result = validateAssessment(assessment);

      expect(result.errors.join()).toContain("blocking な open_questions が必要");
    });
  });

  it("undecided でも対象 local_id の blocking な open_questions があれば通る", () => {
    withRepo((root) => {
      const assessment = assessmentOf(collect(root));
      assessment.open_questions = [
        {
          topic: "full-kata-doc",
          question: "rulebook が現行 schema と整合するか確認できない",
          blocking: true,
          reason: "schema の版が不明",
          next_action: "schema の版を確認する",
        },
      ];
      byLocalId(assessment.deliverables, "full-kata-doc").judgment = judgment({
        kata: {
          rulebook: kataJudgment("unknown"),
          recipe: kataJudgment(),
          sample: kataJudgment(),
          template: kataJudgment(),
        },
        recommended_approach: "undecided",
      });

      const result = validateAssessment(assessment);

      expect(result.errors).toEqual([]);
    });
  });

  it("facts が実際の解決結果と異なる場合はエラーにする", () => {
    withRepo((root) => {
      const deliverables = collect(root);
      const assessment = assessmentOf(deliverables.map((item) => ({ ...item })));
      const target = byLocalId(assessment.deliverables, "partial-kata-doc");
      target.facts = {
        ...target.facts,
        kata: { ...target.facts.kata, sample: { ...target.facts.kata.sample, exists: true } },
      };

      const result = validateAssessment(assessment, {
        currentFacts: new Map(deliverables.map((item) => [item.local_id, item.facts])),
      });

      expect(result.errors.join()).toContain("facts が実際の解決結果と一致しない");
    });
  });

  it("scope の成果物が欠けている場合はエラーにする", () => {
    withRepo((root) => {
      const deliverables = collect(root);
      const assessment = assessmentOf(deliverables.slice(0, 1));

      const result = validateAssessment(assessment, {
        currentFacts: new Map(deliverables.map((item) => [item.local_id, item.facts])),
      });

      expect(result.errors.join()).toContain("deliverables に無い");
    });
  });

  it("id と track の不一致を検出する", () => {
    withRepo((root) => {
      const assessment = assessmentOf(collect(root));
      assessment.id = "prj-0001:sch-assessment-other";

      const result = validateAssessment(assessment, { fileName: assessmentFileName("launch") });

      expect(result.errors.join()).toContain("id must be 'prj-0001:sch-assessment-launch'");
    });
  });

  it("human 確定フェーズであることを警告として残す", () => {
    withRepo((root) => {
      const assessment = assessmentOf(collect(root));
      byLocalId(assessment.deliverables, "full-kata-doc").judgment = judgment({
        intent: "confirm-deliverable",
        intent_rationale: "内容が完成し human が確定する",
        recommended_approach: "finalize",
      });

      const result = validateAssessment(assessment);

      expect(result.errors).toEqual([]);
      expect(result.warnings.join()).toContain("human が実行する確定フェーズ");
    });
  });
});

describe("validateAssessmentSchema", () => {
  it("スキーマ外の項目と観点不足を検出する", () => {
    withRepo((root) => {
      const assessment = assessmentOf(collect(root));
      const target = byLocalId(assessment.deliverables, "full-kata-doc");
      target.judgment = judgment({
        kata: {
          rulebook: { ...kataJudgment(), checks: checks().slice(0, 3) },
          recipe: kataJudgment(),
          sample: kataJudgment(),
          template: kataJudgment(),
        },
      });
      (target as unknown as Record<string, unknown>).extra = "not allowed";

      const errors = validateAssessmentSchema(assessment, repoRoot);

      expect(errors.join()).toContain("extra");
      expect(errors.join()).toContain("checks");
    });
  });
});

describe("writeAssessment", () => {
  it("既存ファイルは上書きせず差分を返し、--force で更新する", () => {
    withRepo((root) => {
      const schedulePath = join(root, SCHEDULE_REL);
      const assessment = assessmentOf(collect(root));

      const created = writeAssessment({ schedulePath, assessment, force: false, dryRun: false });
      expect(created.written).toBe(true);
      expect(created.path).toBe(resolveAssessmentPath(schedulePath, "launch"));

      const unchanged = writeAssessment({ schedulePath, assessment, force: false, dryRun: false });
      expect(unchanged.skippedReason).toBe("unchanged");

      const modified: SchAssessment = { ...assessment, notes: "再判定した" };
      const blocked = writeAssessment({
        schedulePath,
        assessment: modified,
        force: false,
        dryRun: false,
      });
      expect(blocked.written).toBe(false);
      expect(blocked.skippedReason).toBe("exists");
      expect(blocked.diff.join("\n")).toContain("+ notes: 再判定した");

      const forced = writeAssessment({
        schedulePath,
        assessment: modified,
        force: true,
        dryRun: false,
      });
      expect(forced.written).toBe(true);
      expect(readFileSync(forced.path, "utf8")).toContain("notes: 再判定した");
    });
  });

  it("dry-run では書き込まない", () => {
    withRepo((root) => {
      const schedulePath = join(root, SCHEDULE_REL);
      const assessment = assessmentOf(collect(root));

      const result = writeAssessment({ schedulePath, assessment, force: false, dryRun: true });

      expect(result.written).toBe(false);
      expect(result.skippedReason).toBe("dry-run");
    });
  });
});

describe("dumpAssessment", () => {
  it("キー順を固定して差分をレビュー可能にする", () => {
    withRepo((root) => {
      const assessment = assessmentOf(collect(root));

      const lines = dumpAssessment({ ...assessment, notes: "備考" }).split("\n");

      expect(lines[0]).toBe("kind: assessment");
      expect(lines[1]).toBe("id: prj-0001:sch-assessment-launch");
      expect(lines.at(-2)).toBe("notes: 備考");
    });
  });
});

describe("assessment file naming", () => {
  it("track 名とファイル名を相互に変換する", () => {
    expect(assessmentFileName("launch")).toBe("sch-assessment-launch.yaml");
    expect(trackFromAssessmentFileName("sch-assessment-data-flow.yaml")).toBe("data-flow");
    expect(trackFromAssessmentFileName("sch-strategy-launch.yaml")).toBeNull();
  });
});

describe("renderAssessmentPrompt", () => {
  it("収集済みの事実と判定観点を指示に含め、探索と strategy 編集を禁止する", () => {
    withRepo((root) => {
      const deliverables = collect(root);

      const prompt = renderAssessmentPrompt({
        projectId: "prj-0001",
        track: "launch",
        strategyRelPath: STRATEGY_REL,
        assessmentRelPath: `${SCHEDULE_REL}/assessments/sch-assessment-launch.yaml`,
        schemaRelPath: "docs/specdojo/schemas/v1/sch-assessment.schema.yaml",
        deliverables,
        assessmentExists: false,
      });

      expect(prompt).toContain(
        "docs/ja/specdojo/rulebooks/full-rulebook.md（status: draft, grade: 未評価）",
      );
      expect(prompt).toContain("宣言先が存在しない");
      expect(prompt).toContain("not-needed（不要と判断済み）");
      expect(prompt).toContain("undecided（要否未判断）");
      expect(prompt).toContain("src/existing-impl.ts");
      expect(prompt).toContain("`facts` はコードが収集した事実であり、編集しない");
      expect(prompt).toContain("ファイル探索・ID 導出・存在判定はコードが済ませてある");
      expect(prompt).toContain("target-fit");
      expect(prompt).toContain("standard-alignment");
      expect(prompt).toContain(
        "specdojo schedule assessment validate --project prj-0001 --track launch",
      );
    });
  });

  it("既存の判定結果がある場合は更新理由の記録を求める", () => {
    withRepo((root) => {
      const prompt = renderAssessmentPrompt({
        projectId: "prj-0001",
        track: "launch",
        strategyRelPath: STRATEGY_REL,
        assessmentRelPath: `${SCHEDULE_REL}/assessments/sch-assessment-launch.yaml`,
        schemaRelPath: "docs/specdojo/schemas/v1/sch-assessment.schema.yaml",
        deliverables: collect(root),
        assessmentExists: true,
      });

      expect(prompt).toContain("無条件に置き換えず");
    });
  });
});

afterEach(() => {
  process.exitCode = undefined;
});
