import { readPlanFile } from "../../../src/shared/plan-conventions.js";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { generateSinglePlan, targetDocIdsForDeliverable } from "../../../src/exec/plans.js";
import type { Approach, TaskMode } from "../../../src/exec/types.js";

// kata-slim-2 で止まった 4 件（PJR-DM9B）と同じ形の宣言。kind: generated で rulebook を宣言する。
const GENERATED_WITH_RULEBOOK = [
  ["pjr-index", "specdojo:pjr-rulebook", "pjr-rulebook"],
  ["pm-issue-log", "specdojo:pm-issue-log-rulebook", "pm-issue-log-rulebook"],
  ["pm-risk-register", "specdojo:pm-risk-register-rulebook", "pm-risk-register-rulebook"],
  [
    "pm-change-request-log",
    "specdojo:pm-change-request-log-rulebook",
    "pm-change-request-log-rulebook",
  ],
] as const;

function writeCatalog(catalogPath: string): void {
  mkdirSync(catalogPath, { recursive: true });
  const generated = GENERATED_WITH_RULEBOOK.flatMap(([localId, rulebook]) => [
    `      - local_id: ${localId}`,
    `        name: ${localId}`,
    "        kind: generated",
    "        depends_on: [pjr-entry]",
    `        overview: ${localId} の生成物`,
    `        path: generated/${localId}.md`,
    `        rulebook: ${rulebook}`,
  ]);
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
      "      - local_id: pjr-entry",
      "        name: 登録項目",
      "        kind: control",
      "        overview: 個別の登録項目",
      "        path: pjr-entry.md",
      "        rulebook: specdojo:pjr-rulebook",
      ...generated,
      "      - local_id: plain-generated",
      "        name: 宣言なしの生成物",
      "        kind: generated",
      "        overview: rulebook を宣言しない生成物",
      "        path: generated/plain-generated.md",
      "      - local_id: overview",
      "        name: Overview",
      "        kind: work",
      "        overview: 作業成果物",
      "        path: overview.md",
      "        rulebook: specdojo:prj-overview-rulebook",
    ].join("\n"),
    "utf8",
  );
}

describe("kind: generated の成果物の実践の型の解決", () => {
  let root: string;
  let catalogPath: string;
  let executionPath: string;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "specdojo-generated-kata-"));
    catalogPath = join(root, "catalog");
    executionPath = join(root, "execution");
    writeCatalog(catalogPath);
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  async function planFor(localId: string, approach: Approach, mode: TaskMode = "edit") {
    const outPath = await generateSinglePlan({
      executionPath,
      projectId: "test",
      catalogPath,
      task: {
        id: `T-TEST-${localId}-${approach}-${mode}`,
        local_id: localId,
        mode,
        approach,
        schedule_file: "sch-track-test.yaml",
        fifo_rank: 0,
        critical_first_rank: 0,
      },
    });
    return readPlanFile(outPath);
  }

  it.each(GENERATED_WITH_RULEBOOK)(
    "rulebook を宣言した %s の rulebook-maintenance plan は宣言された rulebook を編集対象にする",
    async (localId, rulebookId, fileStem) => {
      const plan = await planFor(localId, "rulebook-maintenance");

      expect(plan).toContain("- `kind`: rulebook");
      expect(plan).toContain(`- \`path\`: \`docs/ja/specdojo/rulebooks/${fileStem}.md\``);
      expect(plan).toContain("- `state`: `existing`");
      expect(plan).not.toContain("- `state`: `unresolved`");
      expect(plan).toContain(`    - ${rulebookId}`);
    },
  );

  it("rulebook を宣言した generated の review plan は rulebook を評価対象として示す", async () => {
    const plan = await planFor("pm-issue-log", "rulebook-maintenance", "review");

    expect(plan).toContain("docs/ja/specdojo/rulebooks/pm-issue-log-rulebook.md");
  });

  it("型の整備の段の targets に generated が宣言した rulebook を含める", () => {
    expect(
      targetDocIdsForDeliverable(catalogPath, "pjr-index", "test", "rulebook-maintenance"),
    ).toEqual(["test:pjr-index", "specdojo:pjr-rulebook"]);
  });

  it("型の整備以外の段では generated の実践の型を今までどおり解決しない", () => {
    expect(
      targetDocIdsForDeliverable(catalogPath, "pjr-index", "test", "bootstrap-finalize"),
    ).toEqual(["test:pjr-index"]);
  });

  it("rulebook を宣言しない generated の rulebook-maintenance plan は今までどおり unresolved にする", async () => {
    const plan = await planFor("plain-generated", "rulebook-maintenance");

    expect(plan).toContain("- `path`: `_MISSING_`");
    expect(plan).toContain("- `state`: `unresolved`");
    expect(
      targetDocIdsForDeliverable(catalogPath, "plain-generated", "test", "rulebook-maintenance"),
    ).toEqual(["test:plain-generated"]);
  });

  it("kind: work の成果物の rulebook-maintenance の解決は変わらない", async () => {
    const plan = await planFor("overview", "rulebook-maintenance");

    expect(plan).toContain("- `path`: `docs/ja/specdojo/rulebooks/prj-overview-rulebook.md`");
    expect(plan).toContain("- `state`: `existing`");
    expect(
      targetDocIdsForDeliverable(catalogPath, "overview", "test", "rulebook-maintenance"),
    ).toEqual(["test:overview", "specdojo:prj-overview-rulebook"]);
  });
});
