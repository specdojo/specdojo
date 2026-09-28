import { describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import yaml from "js-yaml";
import {
  buildViewpointsOverlay,
  documentKind,
  resolveViewpointsDoc,
  scaffoldViewpoints,
  viewpointAppliesToDocument,
} from "../../src/review-plan.js";
import type { ReviewViewpointsDoc } from "../../src/review-types.js";
import { buildValidator, formatErrors } from "../helpers/schema.js";

const COMMON_PATH = "docs/ja/specdojo/defaults/pm-review-viewpoints.yaml";

function withTempDir<T>(fn: (dir: string) => T): T {
  const dir = mkdtempSync(join(tmpdir(), "specdojo-test-"));
  try {
    return fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function writeOverlay(dir: string, patch: Record<string, unknown> = {}): string {
  const path = join(dir, "pm-review-viewpoints.yaml");
  writeFileSync(
    path,
    yaml.dump({ ...buildViewpointsOverlay(resolve(COMMON_PATH), "prj-0001"), ...patch }),
    "utf8",
  );
  return path;
}

describe("resolveViewpointsDoc", () => {
  it("共通集合を継承し、プロジェクトの追加・上書き・無効化を宣言順で解決する", () => {
    withTempDir((dir) => {
      const projectPath = writeOverlay(dir, {
        viewpoints: [
          {
            id: "vp-po-purpose-alignment",
            role: "PO",
            category: "purpose",
            title: "プロジェクト固有の目的整合",
            check: "固有方針と整合するか。",
            evidence: "固有方針。",
            default_severity: "major",
          },
          {
            id: "vp-sec-threat-model",
            role: "SEC",
            category: "quality",
            title: "脅威モデル",
            check: "脅威と対策が対応しているか。",
            evidence: "脅威モデルと対策一覧。",
            default_severity: "major",
          },
        ],
        role_viewpoint_sets: [
          { role: "SEC", viewpoints: ["vp-sec-threat-model"] },
          {
            role: "OPS",
            viewpoints: ["vp-ops-release-readiness", "vp-ops-operability"],
          },
        ],
        disabled: {
          viewpoints: ["vp-ops-agent-boundary"],
          role_viewpoint_sets: [],
        },
      });

      const resolved = resolveViewpointsDoc(projectPath, resolve(COMMON_PATH));
      const viewpoints = resolved.viewpoints ?? [];

      expect(viewpoints.find((item) => item.id === "vp-po-purpose-alignment")?.title).toBe(
        "プロジェクト固有の目的整合",
      );
      expect(viewpoints.some((item) => item.id === "vp-sec-threat-model")).toBe(true);
      expect(viewpoints.some((item) => item.id === "vp-ops-agent-boundary")).toBe(false);
      expect(resolved.role_viewpoint_sets?.find((item) => item.role === "SEC")?.viewpoints).toEqual(
        ["vp-sec-threat-model"],
      );
      expect(resolved).not.toHaveProperty("extends");
      expect(resolved).not.toHaveProperty("disabled");
    });
  });

  it("共通側の更新をプロジェクトファイルの再生成なしで反映する", () => {
    withTempDir((dir) => {
      const common = yaml.load(readFileSync(resolve(COMMON_PATH), "utf8")) as ReviewViewpointsDoc;
      const first = common.viewpoints?.[0];
      if (!first) throw new Error("common viewpoints fixture is empty");
      first.title = "更新された共通タイトル";
      const commonPath = join(dir, "common.yaml");
      writeFileSync(commonPath, yaml.dump(common), "utf8");
      const projectPath = writeOverlay(dir);

      const resolved = resolveViewpointsDoc(projectPath, commonPath);

      expect(resolved.viewpoints?.[0]?.title).toBe("更新された共通タイトル");
    });
  });

  it("同じキーの上書きと無効化を同時に宣言した場合は拒否する", () => {
    withTempDir((dir) => {
      const projectPath = writeOverlay(dir, {
        viewpoints: [
          {
            id: "vp-po-purpose-alignment",
            role: "PO",
            category: "purpose",
            title: "上書き",
            check: "確認する。",
            evidence: "根拠。",
            default_severity: "major",
          },
        ],
        disabled: { viewpoints: ["vp-po-purpose-alignment"] },
      });

      expect(() => resolveViewpointsDoc(projectPath, resolve(COMMON_PATH))).toThrow(
        /both upserted and disabled.*vp-po-purpose-alignment/,
      );
    });
  });

  it("プロジェクトの観点が削除済みの evaluation を使う場合は新しい値を示して拒否する", () => {
    withTempDir((dir) => {
      const projectPath = writeOverlay(dir, {
        viewpoints: [
          {
            id: "vp-po-purpose-alignment",
            role: "PO",
            category: "purpose",
            title: "目的整合",
            check: "確認する。",
            evidence: "根拠。",
            default_severity: "major",
            evaluation: "human",
          },
        ],
      });

      expect(() => resolveViewpointsDoc(projectPath, resolve(COMMON_PATH))).toThrow(
        /vp-po-purpose-alignment.*removed evaluation 'human'.*referential or discretionary/,
      );
    });
  });

  it("プロジェクトの観点が削除済みの continuous を持つ場合は無視せず拒否する", () => {
    withTempDir((dir) => {
      const projectPath = writeOverlay(dir, {
        viewpoints: [
          {
            id: "vp-po-purpose-alignment",
            role: "PO",
            category: "purpose",
            title: "目的整合",
            check: "確認する。",
            evidence: "根拠。",
            default_severity: "major",
            evaluation: "referential",
            continuous: false,
          },
        ],
      });

      expect(() => resolveViewpointsDoc(projectPath, resolve(COMMON_PATH))).toThrow(
        /vp-po-purpose-alignment.*removed field 'continuous'.*grade_targets or document_kinds/,
      );
    });
  });

  it("extends のない全量ファイルでも削除済みの continuous を拒否する", () => {
    withTempDir((dir) => {
      const path = join(dir, "legacy.yaml");
      writeFileSync(
        path,
        yaml.dump({
          id: "test:viewpoints",
          viewpoints: [{ id: "vp-qe-sample", evaluation: "referential", continuous: true }],
        }),
      );

      expect(() => resolveViewpointsDoc(path)).toThrow(/vp-qe-sample.*removed field 'continuous'/);
    });
  });

  it("extends のない全量ファイルでも削除済みの evaluation を拒否する", () => {
    withTempDir((dir) => {
      const path = join(dir, "legacy.yaml");
      writeFileSync(
        path,
        yaml.dump({
          id: "test:viewpoints",
          viewpoints: [{ id: "vp-qe-sample", evaluation: "agent" }],
        }),
        "utf8",
      );

      expect(() => resolveViewpointsDoc(path)).toThrow(
        /vp-qe-sample.*removed evaluation 'agent'.*allowed: deterministic, referential, discretionary/,
      );
    });
  });

  it("verdict_definitions の旧値を移行先の値を示して拒否する", () => {
    withTempDir((dir) => {
      const projectPath = writeOverlay(dir, {
        verdict_definitions: [{ id: "conditional_pass", description: "旧値" }],
      });

      expect(() => resolveViewpointsDoc(projectPath, resolve(COMMON_PATH))).toThrow(
        /verdict_definitions has removed verdict 'conditional_pass'; use complete-with-findings \(allowed: complete, complete-with-findings, incomplete, grade-stale, grade-unavailable, changed-during-review\)/,
      );
    });
  });

  it("extends のない全量ファイルでも grade_rubric の旧 review_verdict を拒否する", () => {
    withTempDir((dir) => {
      const path = join(dir, "legacy.yaml");
      writeFileSync(
        path,
        yaml.dump({
          id: "test:viewpoints",
          viewpoints: [],
          grade_rubric: {
            id: "grade-rubric-test",
            levels: [
              { level: 2, name: "L2", description: "d", review_verdict: "changes_requested" },
            ],
          },
        }),
        "utf8",
      );

      expect(() => resolveViewpointsDoc(path)).toThrow(
        /grade_rubric level 2 review_verdict has removed verdict 'changes_requested'; use incomplete \(allowed: complete, complete-with-findings, incomplete\)/,
      );
    });
  });

  it("grade の level から決まらない verdict を review_verdict に使えない", () => {
    withTempDir((dir) => {
      const path = join(dir, "legacy.yaml");
      writeFileSync(
        path,
        yaml.dump({
          id: "test:viewpoints",
          viewpoints: [],
          grade_rubric: {
            id: "grade-rubric-test",
            levels: [{ level: 0, name: "L0", description: "d", review_verdict: "grade-stale" }],
          },
        }),
        "utf8",
      );

      expect(() => resolveViewpointsDoc(path)).toThrow(
        /grade_rubric level 0 review_verdict has unknown verdict 'grade-stale'/,
      );
    });
  });

  it("共通正本の verdict_definitions は review の verdict と同じ 6 値である", () => {
    withTempDir((dir) => {
      const resolved = resolveViewpointsDoc(writeOverlay(dir), resolve(COMMON_PATH)) as Record<
        string,
        unknown
      >;
      const ids = (resolved["verdict_definitions"] as { id: string }[]).map((item) => item.id);

      expect(ids).toEqual([
        "complete",
        "complete-with-findings",
        "incomplete",
        "grade-stale",
        "grade-unavailable",
        "changed-during-review",
      ]);
      expect(resolved["grade_rubric"]).toMatchObject({
        levels: [
          { level: 0, review_verdict: "incomplete" },
          { level: 1, review_verdict: "incomplete" },
          { level: 2, review_verdict: "incomplete" },
          { level: 3, review_verdict: "complete-with-findings" },
          { level: 4, review_verdict: "complete" },
        ],
      });
    });
  });

  it("extends のない既存の全量ファイルは互換読み込みする", () => {
    withTempDir((dir) => {
      const path = join(dir, "legacy.yaml");
      writeFileSync(
        path,
        "id: test:viewpoints\ntype: review-viewpoints\nstatus: draft\nviewpoints: []\n",
        "utf8",
      );

      expect(resolveViewpointsDoc(path)).toMatchObject({ id: "test:viewpoints", viewpoints: [] });
    });
  });
});

describe("viewpoint document-kind applicability", () => {
  const viewpoint = {
    id: "vp-arc-example",
    role: "ARC",
    category: "architecture",
    title: "example",
    check: "check",
    evidence: "evidence",
    default_severity: "major",
    document_kinds: {
      exclude: ["specdojo:dct-index-rulebook"],
      unclassified: "exclude" as const,
    },
  };

  it("rulebook・成果物・template を同じ rulebook ID へ正規化する", () => {
    expect(
      documentKind({
        id: "specdojo:bps-rulebook",
        type: "rulebook",
      }),
    ).toBe("specdojo:bps-rulebook");
    expect(documentKind({ rulebook: "specdojo:bps-rulebook" })).toBe("specdojo:bps-rulebook");
    expect(
      documentKind({
        type: "template",
        frontmatter_template: { specdojo: { rulebook: "specdojo:bps-rulebook" } },
      }),
    ).toBe("specdojo:bps-rulebook");
  });

  it("除外した種類と未分類だけを対象外にする", () => {
    expect(
      viewpointAppliesToDocument(viewpoint, {
        rulebook: "specdojo:dct-index-rulebook",
      }),
    ).toBe(false);
    expect(
      viewpointAppliesToDocument(viewpoint, {
        rulebook: "specdojo:bps-rulebook",
      }),
    ).toBe(true);
    expect(viewpointAppliesToDocument(viewpoint, { rulebook: "none" })).toBe(false);
  });

  it("confirmed_default は判断の記録であり、適用判定を変えない", () => {
    const recorded = {
      ...viewpoint,
      document_kinds: {
        ...viewpoint.document_kinds,
        confirmed_default: ["specdojo:bps-rulebook"],
      },
    };
    const includeOnly = {
      ...viewpoint,
      document_kinds: {
        include: ["specdojo:bps-rulebook"],
        confirmed_default: ["specdojo:dct-rulebook"],
      },
    };

    expect(viewpointAppliesToDocument(recorded, { rulebook: "specdojo:bps-rulebook" })).toBe(true);
    expect(viewpointAppliesToDocument(recorded, { rulebook: "specdojo:dct-index-rulebook" })).toBe(
      false,
    );
    expect(viewpointAppliesToDocument(includeOnly, { rulebook: "specdojo:dct-rulebook" })).toBe(
      false,
    );
  });
});

describe("scaffoldViewpoints", () => {
  it("共通定義の全量コピーではなく空のプロジェクト差分を生成する", () => {
    withTempDir((dir) => {
      const outputPath = join(dir, "nested", "pm-review-viewpoints.yaml");

      const actual = scaffoldViewpoints({
        commonPath: resolve(COMMON_PATH),
        projectId: "prj-0001",
        outputPath,
        force: false,
      });

      expect(actual).toEqual({ written: true, skipped: false });
      const doc = yaml.load(readFileSync(outputPath, "utf8")) as Record<string, unknown>;
      expect(doc).toMatchObject({
        id: "prj-0001:pm-review-viewpoints",
        project_id: "prj-0001",
        extends: "specdojo:pm-review-viewpoints",
        viewpoints: [],
      });
      expect(doc).not.toHaveProperty("categories");
      expect(doc).not.toHaveProperty("coverage_types");
    });
  });

  it("既存ファイルは force なしで保持し、force ありで差分雛形へ置き換える", () => {
    withTempDir((dir) => {
      const outputPath = join(dir, "pm-review-viewpoints.yaml");
      writeFileSync(outputPath, "existing: true\n", "utf8");

      expect(
        scaffoldViewpoints({
          commonPath: resolve(COMMON_PATH),
          projectId: "prj-0001",
          outputPath,
          force: false,
        }),
      ).toEqual({ written: false, skipped: true });
      expect(readFileSync(outputPath, "utf8")).toBe("existing: true\n");

      expect(
        scaffoldViewpoints({
          commonPath: resolve(COMMON_PATH),
          projectId: "prj-0001",
          outputPath,
          force: true,
        }),
      ).toEqual({ written: true, skipped: false });
      expect(readFileSync(outputPath, "utf8")).toContain("extends: specdojo:pm-review-viewpoints");
    });
  });
});

describe("pm-review-viewpoints schema", () => {
  it("共通正本、プロジェクト差分、解決後の全量定義が適合する", () => {
    withTempDir((dir) => {
      const validator = buildValidator("docs/specdojo/schemas/v1/pm-review-viewpoints.schema.yaml");
      const common = yaml.load(readFileSync(resolve(COMMON_PATH), "utf8"));
      expect(validator(common), formatErrors(validator.errors)).toBe(true);

      const overlay = buildViewpointsOverlay(resolve(COMMON_PATH), "prj-0001");
      expect(validator(overlay), formatErrors(validator.errors)).toBe(true);

      const projectPath = writeOverlay(dir);
      const resolved = resolveViewpointsDoc(projectPath, resolve(COMMON_PATH));
      expect(validator(resolved), formatErrors(validator.errors)).toBe(true);
    });
  });
});
