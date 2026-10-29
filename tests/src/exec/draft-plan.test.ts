import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  generateRegisterApproachPlan,
  generateSinglePlan,
} from "../../../src/exec/plans-generation.js";
import type { DeliverableInfo } from "../../../src/catalog/document-target.js";
import { parseApproach } from "../../../src/exec/core.js";
import { buildPhaseModeIndex, resolveApproach } from "../../../src/exec/strategy.js";
import { dump } from "../../../src/shared/yaml.js";

describe("draft and fully-guided plans", () => {
  let root: string;
  let info: DeliverableInfo;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "specdojo-draft-plan-"));
    info = {
      resolvedPath: join(root, "proposal.md"),
      deliverable: {
        local_id: "proposal",
        name: "Proposal",
        kind: "work",
        overview: "Draft a proposal",
        path: "proposal.md",
        rulebook: "specdojo:tsd-rulebook",
        depends_on: ["upstream"],
        done_criteria: [],
      },
    };
    writeFileSync(
      info.resolvedPath,
      "---\nspecdojo:\n  id: test:proposal\n  based_on: [test:upstream]\n---\n\n_CONTEXT_: 技術の選定を任せる。\n",
    );
  });

  afterEach(() => rmSync(root, { recursive: true, force: true }));

  async function registerPlan(
    approach: "draft" | "fully-guided",
    registerInput?: string[],
  ): Promise<string> {
    const path = await generateRegisterApproachPlan({
      executionPath: join(root, "execution"),
      projectId: "test",
      catalogPath: "",
      taskId: "PJR-AB12",
      title: "Proposal",
      description: "技術の選定を任せる。",
      approach,
      targets: ["test:proposal"],
      deliverable: info,
      registerInput,
      additionalConditions: "指定範囲を完了する。",
      stem: `register-${approach}`,
    });
    return readFileSync(path, "utf8");
  }

  it("draft の register plan は参照範囲と委任範囲内の具体化・提案・根拠記録を示す", async () => {
    expect(parseApproach("draft")).toBe("draft");
    const plan = await registerPlan("draft");
    expect(plan).toContain("approach: draft");
    expect(plan).toContain("文脈で任された範囲に限り「根拠のない具体化の禁止」を外し");
    expect(plan).toContain("外部の情報を調べて値を決めてよい");
    expect(plan).toContain("成果物で「提案」と分かる形");
    expect(plan).toContain("出典と選定理由を result");
    expect(plan).toContain("任されていない範囲は従来どおり _TODO_ / _ASSUMPTION_");
    expect(plan).toContain("元の指示を result に写す");
    expect(plan).toContain("目印と元の指示を消し");
    expect(plan).toContain("元の指示と反映箇所を報告の `handoff` に書き");
    expect(plan).toContain("反映できない指示は削除せず");
    for (const text of [
      "- rulebook",
      "- recipe",
      "- sample",
      "- template",
      "`depends_on`",
      "[[test:upstream]]",
      "`project_context`",
      "出典つき",
      "成果物内の文脈",
    ]) {
      expect(plan).toContain(text);
    }
    expect(plan).not.toMatch(/^- カタログの `brief`:/m);
    for (const placeholder of [
      "_DELIVERABLE_BASED_ON_",
      "_REGISTER_INPUT_",
      "_DELIVERABLE_BRIEF_",
      "_TEMPLATE_REF_",
    ]) {
      expect(plan).not.toContain(placeholder);
    }
  });

  it.each(["draft", "fully-guided"] as const)(
    "%s の入力がない register plan は前提節と入力の参照行を省く",
    async (approach) => {
      const plan = await registerPlan(approach);
      expect(plan).not.toContain("## 個票の入力（前提）");
      expect(plan).not.toMatch(/^- 個票の `入力`:/m);
      expect(plan).not.toContain("_REGISTER_INPUT_");
    },
  );

  it.each(["draft", "fully-guided"] as const)(
    "%s の入力を完了条件と別の前提に載せる",
    async (approach) => {
      const plan = await registerPlan(approach, ["技術調査を任せる", "対象は `api_version`"]);
      expect(plan).toContain("## 個票の入力（前提）");
      expect(plan).toContain("- 技術調査を任せる");
      expect(plan).toContain("対象は `api_version`");
      expect(plan).toContain("- 個票の `入力`: 下記「個票の入力（前提）」を参照。");
      const inputPosition = plan.indexOf("## 個票の入力（前提）");
      const conditionPosition = plan.indexOf("## 個票の追加完了条件");
      expect(inputPosition).toBeLessThan(conditionPosition);
      expect(plan.slice(conditionPosition)).not.toContain("技術調査を任せる");
      expect(plan).not.toContain("_REGISTER_INPUT_");
    },
  );

  it("fully-guided の register plan は based_on を読み、宣言された参照だけで磨く", async () => {
    const plan = await registerPlan("fully-guided");
    expect(plan).toContain("磨き込み専用");
    expect(plan).toContain("宣言された文書だけ");
    expect(plan).toContain("`based_on`（対象成果物の frontmatter）: [[test:upstream]]");
    expect(plan).not.toMatch(/^- カタログの `brief`:/m);
    expect(plan).toContain("磨き込みでは template は読み込まない");
    expect(plan).toContain("`_CONTEXT_:` が残っている場合");
    expect(plan).toContain("その指示を本文へ反映・削除せず");
    expect(plan).toContain("必要な下書きを論点として result");
    expect(plan).toContain("報告の `handoff` に記載");
  });

  it.each(["draft", "fully-guided"] as const)(
    "schedule の %s plan にも参照を展開する",
    async (approach) => {
      const catalogPath = join(root, "catalog");
      mkdirSync(catalogPath);
      writeFileSync(
        join(catalogPath, "dct-test.yaml"),
        dump({
          id: "test:dct-test",
          type: "project",
          status: "draft",
          project_id: "test",
          domain: "test",
          groups: [
            {
              deliverables: [
                { ...info.deliverable, path: relative(process.cwd(), info.resolvedPath) },
              ],
            },
          ],
        }),
      );
      const path = await generateSinglePlan({
        executionPath: join(root, "execution"),
        projectId: "test",
        catalogPath,
        task: {
          id: "T-TEST-proposal-010",
          local_id: "proposal",
          mode: "edit",
          approach,
          schedule_file: "sch-test.yaml",
          fifo_rank: 0,
          critical_first_rank: 0,
        },
      });
      const plan = readFileSync(path, "utf8");
      expect(plan).toContain(`approach: ${approach}`);
      expect(plan).toContain("[[test:upstream]]");
      expect(plan).toContain("個票の `入力`: なし");
      if (approach === "draft") {
        expect(plan).toContain("目印と元の指示を消し、元の指示を result に写す");
      } else {
        expect(plan).toContain("その指示を本文へ反映・削除せず");
        expect(plan).toContain("必要な下書きを論点として result");
      }
    },
  );

  it("fully-guided review も based_on を表示し、下書きの再作成を求めない", async () => {
    // Use a catalog entry pointing at the existing document so review follows the schedule path.
    const catalogPath = join(root, "catalog");
    mkdirSync(catalogPath);
    writeFileSync(
      join(catalogPath, "dct-test.yaml"),
      dump({
        id: "test:dct-test",
        type: "project",
        status: "draft",
        project_id: "test",
        domain: "test",
        groups: [
          {
            deliverables: [
              { ...info.deliverable, path: relative(process.cwd(), info.resolvedPath) },
            ],
          },
        ],
      }),
    );
    const path = await generateSinglePlan({
      executionPath: join(root, "execution"),
      projectId: "test",
      catalogPath,
      task: {
        id: "T-TEST-proposal-020",
        local_id: "proposal",
        mode: "review",
        approach: "fully-guided",
        schedule_file: "sch-test.yaml",
        fifo_rank: 0,
        critical_first_rank: 0,
      },
    });
    const plan = readFileSync(path, "utf8");
    expect(plan).toContain("[[test:upstream]]");
    expect(plan).toContain("宣言された文書だけ");
    expect(plan).toContain("既存成果物を磨き込む");
    expect(plan).not.toMatch(/^- カタログの `brief`:/m);
    expect(plan).not.toContain("_RULEBOOK_INCLUDES_");
  });

  it.each(["draft", "fully-guided"] as const)(
    "%s の register plan に brief を前提として載せる",
    async (approach) => {
      info.deliverable.brief = "静的サイトで主流の技術スタックで書く。";
      const plan = await registerPlan(approach);
      expect(plan).toContain("- カタログの `brief`: 静的サイトで主流の技術スタックで書く。");

      info.deliverable.brief = "- Astro と Tailwind CSS を採用する。\n- 外部 API は使わない。";
      const multilinePlan = await registerPlan(approach);
      expect(multilinePlan).toContain(
        "- カタログの `brief`:\n  - Astro と Tailwind CSS を採用する。\n  - 外部 API は使わない。",
      );
    },
  );

  it("schedule の plan にも brief を前提として載せ、YAML アンカーでの共有を反映する", async () => {
    const catalogPath = join(root, "catalog");
    mkdirSync(catalogPath);
    writeFileSync(
      join(catalogPath, "dct-test.yaml"),
      `id: test:dct-test
type: project
status: draft
project_id: test
domain: test
groups:
  - deliverables:
      - local_id: proposal
        name: Proposal
        kind: work
        overview: Draft a proposal
        brief: &shared_brief |
          - TypeScript と React を用いる。
          - 状態管理は標準フックに留める。
        path: ${relative(process.cwd(), info.resolvedPath)}
        done_criteria: []
      - local_id: companion
        name: Companion
        kind: work
        overview: Companion deliverable
        brief: *shared_brief
        path: companion.md
        done_criteria: []
`,
    );

    const path = await generateSinglePlan({
      executionPath: join(root, "execution"),
      projectId: "test",
      catalogPath,
      task: {
        id: "T-TEST-proposal-010",
        local_id: "proposal",
        mode: "edit",
        approach: "draft",
        schedule_file: "sch-test.yaml",
        fifo_rank: 0,
        critical_first_rank: 0,
      },
    });
    const plan = readFileSync(path, "utf8");
    expect(plan).toContain(
      "- カタログの `brief`:\n  - TypeScript と React を用いる。\n  - 状態管理は標準フックに留める。",
    );

    const reviewPath = await generateSinglePlan({
      executionPath: join(root, "execution"),
      projectId: "test",
      catalogPath,
      task: {
        id: "T-TEST-proposal-020",
        local_id: "proposal",
        mode: "review",
        approach: "fully-guided",
        schedule_file: "sch-test.yaml",
        fifo_rank: 0,
        critical_first_rank: 0,
      },
    });
    const reviewPlan = readFileSync(reviewPath, "utf8");
    expect(reviewPlan).toContain(
      "- カタログの `brief`:\n  - TypeScript と React を用いる。\n  - 状態管理は標準フックに留める。",
    );
  });

  it("未作成または based_on がない成果物は「なし」と表示する", async () => {
    rmSync(info.resolvedPath);
    expect(await registerPlan("draft")).toContain("`based_on`（対象成果物の frontmatter）: なし");
    writeFileSync(info.resolvedPath, "---\nspecdojo:\n  id: test:proposal\n---\n");
    expect(await registerPlan("fully-guided")).toContain(
      "`based_on`（対象成果物の frontmatter）: なし",
    );
  });

  it("strategy の phase approach から draft を復元する", () => {
    writeFileSync(
      join(root, "sch-strategy-test.yaml"),
      dump({
        kind: "strategy",
        track: "test",
        phase_sets: {
          main: [{ id: "draft", task_suffix: "010", mode: "edit", approach: "draft" }],
        },
        owner_rules: [{ local_ids: ["proposal"], owner: "DEV", phase_set: "main" }],
      }),
    );
    expect(resolveApproach("proposal", "T-TEST-proposal-010", buildPhaseModeIndex(root))).toBe(
      "draft",
    );
  });
});
