import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { readSpecdojoNamespace } from "../../../src/docs/frontmatter-namespace.js";
import {
  generateRegisterApproachPlan,
  generateSinglePlan,
} from "../../../src/exec/plans-generation.js";
import type { Approach, TaskMode } from "../../../src/exec/types.js";
import type { DeliverableInfo } from "../../../src/catalog/document-target.js";
import { dump } from "../../../src/shared/yaml.js";

const approaches = ["draft", "fully-guided", "recipe-guided"] as const;

describe("edit plan implementation evidence and missing dependencies", () => {
  let root: string;
  let catalogPath: string;
  let info: DeliverableInfo;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "specdojo-plan-evidence-"));
    catalogPath = join(root, "catalog");
    mkdirSync(catalogPath);
    info = {
      resolvedPath: join(root, "proposal.md"),
      deliverable: {
        local_id: "proposal",
        name: "Proposal",
        kind: "work",
        overview: "現在動作を記述する。",
        path: "proposal.md",
        rulebook: "specdojo:tsd-rulebook",
        depends_on: ["existing", "future", "product-future", "unknown"],
        evidence_refs: [
          { kind: "implementation", path: "src/exec/plans-generation.ts", purpose: "現在動作" },
          { kind: "implementation", path: "tests/src/exec/plans.test.ts", purpose: "生成の検証" },
        ],
      },
    };
    writeFileSync(info.resolvedPath, "---\nspecdojo:\n  id: test:proposal\n---\n\n# Proposal\n");
    writeFileSync(join(root, "existing.md"), "---\nspecdojo:\n  id: test:actual-id\n---\n");
  });

  afterEach(() => rmSync(root, { recursive: true, force: true }));

  function writeCatalog(): void {
    writeFileSync(
      join(catalogPath, "dct-test.yaml"),
      dump({
        id: "test:dct-test",
        project_id: "test",
        domain: "test",
        base_path: `/${relative(process.cwd(), root)}`,
        groups: [
          {
            deliverables: [
              info.deliverable,
              { local_id: "existing", path: "existing.md" },
              { local_id: "future", path: "future.md" },
              { local_id: "product-future", path: "/docs/ja/product/product-future.md" },
            ],
          },
        ],
      }),
    );
  }

  async function schedulePlan(approach: Approach, mode: TaskMode = "edit"): Promise<string> {
    writeCatalog();
    const path = await generateSinglePlan({
      executionPath: join(root, "execution"),
      projectId: "test",
      catalogPath,
      projectContext: [],
      task: {
        id: `T-TEST-proposal-${approach}-${mode}`,
        local_id: "proposal",
        mode,
        approach,
        schedule_file: "sch-test.yaml",
        fifo_rank: 0,
        critical_first_rank: 0,
      },
    });
    return readFileSync(path, "utf8");
  }

  it.each(approaches)(
    "%s edit は宣言した実装とテストを読み取り専用で展開する",
    async (approach) => {
      const plan = await schedulePlan(approach);
      expect(plan).toContain("実装エビデンスと未作成の依存");
      expect(plan).toContain("`src/exec/plans-generation.ts`（implementation）: 現在動作");
      expect(plan).toContain("`tests/src/exec/plans.test.ts`（implementation）: 生成の検証");
      expect(plan).toContain("`targets`、変更許可範囲、commit 対象には含めない");
      expect(readSpecdojoNamespace(plan).targets).toEqual(["test:proposal"]);
      expect(plan).toContain("承認根拠のある現在動作だけを反映");
      expect(plan).toContain("未承認の乖離は意図された仕様を保持");
      expect(plan).not.toContain("_IMPLEMENTATION_EVIDENCE_");
    },
  );

  it.each(approaches)("%s edit は evidence_refs がなくても生成できる", async (approach) => {
    delete info.deliverable.evidence_refs;
    const plan = await schedulePlan(approach);
    expect(plan).toContain("なし（`evidence_refs` 未指定またはカタログなし）");
    expect(plan).not.toContain("_IMPLEMENTATION_EVIDENCE_");
  });

  it.each(approaches)("%s register edit はカタログなしでも生成できる", async (approach) => {
    delete info.deliverable.evidence_refs;
    info.catalogless = true;
    const path = await generateRegisterApproachPlan({
      executionPath: join(root, "execution"),
      projectId: "test",
      catalogPath: "",
      projectContext: [],
      taskId: "PJR-AB12",
      title: "Proposal",
      description: "現在動作を記述する。",
      approach,
      targets: ["test:proposal"],
      deliverable: info,
      registerInput: ["現在動作を記述する。"],
      additionalConditions: "対象範囲を完了する。",
      stem: `register-${approach}`,
    });
    const plan = readFileSync(path, "utf8");
    expect(plan).toContain("なし（`evidence_refs` 未指定またはカタログなし）");
    expect(plan).not.toContain("パスが未指定なら実装反映の前に個票へ明記する");
    expect(plan).toContain("## 個票の入力（前提）");
    expect(readSpecdojoNamespace(plan).targets).toEqual(["test:proposal"]);
  });

  it.each(approaches)("%s edit は既存の依存だけを wikilink にする", async (approach) => {
    const plan = await schedulePlan(approach);
    expect(plan).toContain("[[test:actual-id]]");
    for (const id of ["test:future", "product-future", "test:unknown"]) {
      expect(plan).toContain(`\`${id}\`（未作成）`);
      expect(plan).not.toContain(`[[${id}]]`);
    }
    expect(plan).toContain("未作成の依存だけを理由に異常終了せず");
    expect(plan).toContain("内容を推測で埋めず、必要な箇所は _TODO_ / _ASSUMPTION_");
    const failureConditions = plan.split("## 7. 異常終了の条件")[1];
    expect(failureConditions).toContain("実行に必要なツール・パッケージの依存");
    expect(failureConditions).toContain(
      "未作成の `depends_on` と `evidence_refs` の欠落だけでは異常終了しない",
    );
    expect(failureConditions).toContain("_TODO_ / _ASSUMPTION_ と次のアクションを残す");
  });

  it.each([
    ...approaches.map((approach) => ({ approach, mode: "review" as const })),
    { approach: "condense" as const, mode: "edit" as const },
    { approach: "freeform" as const, mode: "edit" as const },
  ])("$approach $mode は従来の参照範囲と依存表示を維持する", async ({ approach, mode }) => {
    const plan = await schedulePlan(approach, mode);
    if (approach === "condense") {
      expect(plan).not.toContain("`depends_on`:");
    } else {
      expect(plan).toContain("[[test:future]]");
    }
    expect(plan).not.toContain("`test:future`（未作成）");
    expect(plan).not.toContain("実装エビデンスと未作成の依存");
    expect(plan).not.toContain("`src/exec/plans-generation.ts`（implementation）");
  });
});
