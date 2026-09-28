import { describe, expect, it, vi } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import yaml from "js-yaml";
import type { GradeResult } from "../../src/grade-result.js";
import { gradeContentHash } from "../../src/grade-result.js";
import {
  classifyReviewGrade,
  decideReviewGradeAction,
  ensureReviewGrade,
  renderReviewGradeSummary,
  reviewGradeArgs,
  reviewGradeRunId,
} from "../../src/review-grade.js";
import type { ReviewGradeFreshness } from "../../src/review-grade.js";

const CONTENT = "---\nspecdojo:\n  id: cdfd-action\n---\n\n# CDFD Action\n";
const SIDECAR_PATH = "docs/ja/projects/prj-test/execution/grade/results/cdfd-action.yaml";

function gradeResult(overrides: Partial<GradeResult> = {}): GradeResult {
  return {
    version: 1,
    document: "cdfd-action",
    path: "docs/ja/product/cdfd-action.md",
    target: "deliverable",
    rubric: "grade-rubric-v2",
    verdict: "needs-work",
    score: 69,
    graded_at: "2026-09-27T15:21:10.689Z",
    graded_by: "codex-expert-executor",
    content_hash: gradeContentHash(CONTENT),
    categories: { quality: { score: 56 } },
    viewpoints: {
      "vp-qe-done-criteria": { level: 2, score: 50 },
      "vp-arc-document-structure": { level: 4, score: 100 },
      "vp-po-purpose-alignment": { level: 4, score: 100 },
    },
    finding_counts: { blocker: 0, major: 1, minor: 0, note: 0 },
    findings: [
      {
        id: "F-001",
        severity: "major",
        rule: "vp-qe-done-criteria",
        line: 12,
        anchor: "## 2. 完了条件",
        message: "完了条件の\n判定根拠が不足している",
      },
    ],
    ...overrides,
  };
}

function sidecar(result: GradeResult): string {
  return yaml.dump(result);
}

describe("classifyReviewGrade", () => {
  it("content_hash が一致する評価結果を最新と判定する", () => {
    const actual = classifyReviewGrade({
      content: CONTENT,
      sidecarPath: SIDECAR_PATH,
      sidecarContent: sidecar(gradeResult()),
    });

    expect(actual.state).toBe("fresh");
  });

  it("content_hash が一致しない評価結果を最新でないと判定する", () => {
    const actual = classifyReviewGrade({
      content: `${CONTENT}\n追記\n`,
      sidecarPath: SIDECAR_PATH,
      sidecarContent: sidecar(gradeResult()),
    });

    expect(actual.state).toBe("stale");
  });

  it("サイドカーがない場合は missing と判定する", () => {
    const actual = classifyReviewGrade({
      content: CONTENT,
      sidecarPath: SIDECAR_PATH,
      sidecarContent: undefined,
    });

    expect(actual).toEqual({ state: "missing", sidecarPath: SIDECAR_PATH });
  });

  it("サイドカーを解釈できない場合は理由付きで unreadable と判定する", () => {
    const actual = classifyReviewGrade({
      content: CONTENT,
      sidecarPath: SIDECAR_PATH,
      sidecarContent: "version: 2\n",
    });

    expect(actual.state).toBe("unreadable");
    expect(actual.state === "unreadable" && actual.reason).toMatch(/invalid grade result/);
  });
});

describe("decideReviewGradeAction", () => {
  const fresh: ReviewGradeFreshness = {
    state: "fresh",
    sidecarPath: SIDECAR_PATH,
    result: gradeResult(),
  };
  const stale: ReviewGradeFreshness = {
    state: "stale",
    sidecarPath: SIDECAR_PATH,
    result: gradeResult(),
  };

  it("評価結果が最新なら grade を再実行せず既存の結果を使う", () => {
    const actual = decideReviewGradeAction({
      freshness: fresh,
      scriptAvailable: true,
      dryRun: false,
    });

    expect(actual).toEqual({ run: false, outcome: { action: "skipped" } });
  });

  it.each([
    ["stale", stale],
    ["missing", { state: "missing", sidecarPath: SIDECAR_PATH } as ReviewGradeFreshness],
    [
      "unreadable",
      { state: "unreadable", sidecarPath: SIDECAR_PATH, reason: "bad" } as ReviewGradeFreshness,
    ],
  ])("評価結果が %s なら grade を実行する", (_state, freshness) => {
    const actual = decideReviewGradeAction({ freshness, scriptAvailable: true, dryRun: false });

    expect(actual).toEqual({ run: true });
  });

  it("評価対象を解決できない場合は理由を残して実行しない", () => {
    const actual = decideReviewGradeAction({
      freshness: { state: "unresolved", reason: "評価対象が存在しない: a.md" },
      scriptAvailable: true,
      dryRun: false,
    });

    expect(actual).toEqual({
      run: false,
      outcome: { action: "not-run", detail: "評価対象が存在しない: a.md" },
    });
  });

  it("dry-run と実行スクリプト不在では実行しない", () => {
    const dryRun = decideReviewGradeAction({
      freshness: stale,
      scriptAvailable: true,
      dryRun: true,
    });
    const noScript = decideReviewGradeAction({
      freshness: stale,
      scriptAvailable: false,
      dryRun: false,
    });

    expect(dryRun).toEqual({
      run: false,
      outcome: { action: "not-run", detail: "dry-run のため実行しない" },
    });
    expect(noScript.run === false && noScript.outcome).toEqual({
      action: "not-run",
      detail: "grade の実行スクリプトがリポジトリにない: tools/grade/run-per-document.sh",
    });
  });
});

describe("reviewGradeArgs", () => {
  it("deliverable は評価対象 1 件だけを grade パイプラインへ渡す", () => {
    const actual = reviewGradeArgs({
      runId: "review-T-1-20260928T000000Z",
      projectId: "prj-test",
      target: "deliverable",
      subjectPath: "docs/ja/product/cdfd-action.md",
    });

    expect(actual).toEqual([
      "tools/grade/run-per-document.sh",
      "--run-id",
      "review-T-1-20260928T000000Z",
      "--project",
      "prj-test",
      "--target",
      "deliverable",
      "--path",
      "docs/ja/product/cdfd-action.md",
    ]);
  });

  it("kata は種類を問わず受け付けるよう --kind all を付ける", () => {
    const actual = reviewGradeArgs({
      runId: "r",
      projectId: "prj-test",
      target: "kata",
      subjectPath: "docs/ja/specdojo/rulebooks/cdfd-rulebook.md",
    });

    expect(actual).toContain("--kind");
    expect(actual[actual.indexOf("--kind") + 1]).toBe("all");
  });
});

describe("reviewGradeRunId", () => {
  it("タスク ID の記号を除き UTC 時刻を付ける", () => {
    const actual = reviewGradeRunId("prj-0001:PJR-KCMH", new Date("2026-09-28T09:15:15.123Z"));

    expect(actual).toBe("review-prj-0001-PJR-KCMH-20260928T091515Z");
  });
});

describe("ensureReviewGrade", () => {
  it("評価対象が存在しない場合は grade を起動せず理由を返す", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "specdojo-review-grade-"));
    try {
      const invoke = vi.fn();

      const actual = await ensureReviewGrade({
        taskId: "T-1",
        projectId: "prj-test",
        subjectPath: "docs/missing.md",
        target: "deliverable",
        repoRoot: root,
        dryRun: false,
        invoke,
      });

      expect(actual).toEqual({
        action: "not-run",
        detail: "評価対象が存在しない: docs/missing.md",
      });
      expect(invoke).not.toHaveBeenCalled();
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});

describe("renderReviewGradeSummary", () => {
  it("最新の評価結果を確定済みの事実として verdict と findings 付きで提示する", () => {
    const actual = renderReviewGradeSummary(
      { state: "fresh", sidecarPath: SIDECAR_PATH, result: gradeResult() },
      { action: "skipped" },
    );

    expect(actual).toContain("grade が確定済みの事実であり");
    expect(actual).toContain("観点を評価し直したり、同じ finding を改めて指摘したりしない");
    expect(actual).toContain("- runner の grade 実行: 省略した");
    expect(actual).toContain("- 鮮度: 最新");
    expect(actual).toContain("- `verdict`: `needs-work`");
    expect(actual).toContain("- `score`: 69");
    expect(actual).toContain("- finding 件数: blocker 0 / major 1 / minor 0 / note 0");
    expect(actual).toContain(
      "- `F-001` [major/`vp-qe-done-criteria`; line=12]: 完了条件の 判定根拠が不足している",
    );
  });

  it("evaluation 区分で絞らず、grade が判定した全観点を ID 順に提示する", () => {
    const actual = renderReviewGradeSummary({
      state: "fresh",
      sidecarPath: SIDECAR_PATH,
      result: gradeResult(),
    });

    const rows = actual.split("\n").filter((line) => line.startsWith("| `vp-"));
    expect(rows).toEqual([
      "| `vp-arc-document-structure` | 4 | 100 |",
      "| `vp-po-purpose-alignment` | 4 | 100 |",
      "| `vp-qe-done-criteria` | 2 | 50 |",
    ]);
  });

  it("content_hash が一致しない場合はその旨と変更前の評価であることを示す", () => {
    const actual = renderReviewGradeSummary(
      { state: "stale", sidecarPath: SIDECAR_PATH, result: gradeResult() },
      { action: "failed", runId: "review-T-1", detail: "exit 1: agent limit" },
    );

    expect(actual).toContain(
      "- runner の grade 実行: 失敗した（run id: `review-T-1`; exit 1: agent limit）",
    );
    expect(actual).toContain(
      "- 鮮度: 最新でない（評価対象の `content_hash` が評価結果の `content_hash` と一致しない）",
    );
    expect(actual).toContain("変更前の内容に対する評価結果");
    expect(actual).toContain("- `verdict`: `needs-work`");
  });

  it("評価結果がない場合は評価値を出さずに不在を示す", () => {
    const actual = renderReviewGradeSummary({ state: "missing", sidecarPath: SIDECAR_PATH });

    expect(actual).toContain("- 鮮度: 評価結果がない");
    expect(actual).not.toContain("`verdict`");
  });
});
