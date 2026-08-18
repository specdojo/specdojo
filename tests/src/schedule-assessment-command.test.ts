import { afterEach, describe, expect, it, vi } from "vitest";
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
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import yaml from "js-yaml";
import { registerScheduleCommands } from "../../src/schedule.js";
import type { AssessmentJudgment, SchAssessment } from "../../src/schedule-assessment.js";

// schedule assessment サブコマンドを CLI 経由で確認する。一時リポジトリを cwd にして
// specdojoRootDir() / loadConfig() と判定結果の出力先を temp 内へ閉じ込める。

const CATALOG_REL = "docs/ja/projects/prj-0001/010-deliverables-catalog/dct-sample.yaml";
const SCHEDULE_REL = "docs/ja/projects/prj-0001/schedule";
const DOCS_BASE = "docs/ja/product/010-specs";

const CONFIG = {
  version: 1,
  current_project: "prj-0001",
  projects: {
    "prj-0001": {
      base_path: "docs/ja/projects/prj-0001",
      catalog_path: "010-deliverables-catalog",
      schedule_path: "schedule",
      execution_path: "execution",
    },
  },
};

function write(root: string, relPath: string, content: string): void {
  const filePath = join(root, relPath);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, "utf8");
}

function withRepo(fn: (root: string) => Promise<void> | void): Promise<void> {
  const originalCwd = process.cwd();
  const root = mkdtempSync(join(tmpdir(), "specdojo-sch-assessment-cli-"));
  return (async () => {
    try {
      write(root, ".specdojo/specdojo.config.json", `${JSON.stringify(CONFIG, null, 2)}\n`);
      // schema は実リポジトリのものを複製し、検証を成立させる。
      cpSync(
        join(originalCwd, "docs/specdojo/schemas/v1"),
        join(root, "docs/specdojo/schemas/v1"),
        {
          recursive: true,
        },
      );

      write(
        root,
        "docs/ja/specdojo/rulebooks/full-rulebook.md",
        [
          "---",
          "specdojo:",
          "  id: specdojo:full-rulebook",
          "  type: rulebook",
          "  status: draft",
          "  recipe: specdojo:full-recipe",
          "  sample: specdojo:full-sample",
          "  template: specdojo:full-template",
          "---",
          "",
          "# full-rulebook",
          "",
          "本文",
          "",
        ].join("\n"),
      );
      for (const [dir, id] of [
        ["recipes", "full-recipe"],
        ["samples", "full-sample"],
        ["templates", "full-template"],
      ]) {
        write(
          root,
          `docs/ja/specdojo/${dir}/${id}.md`,
          `---\nspecdojo:\n  id: specdojo:${id}\n  type: recipe\n  status: draft\n---\n\n# ${id}\n\n本文\n`,
        );
      }

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
                  overview: "判定対象",
                  path: "full-kata-doc.md",
                  rulebook: "specdojo:full-rulebook",
                },
              ],
            },
          ],
        }),
      );

      write(
        root,
        `${SCHEDULE_REL}/sch-strategy-launch.yaml`,
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

      process.chdir(root);
      await fn(root);
    } finally {
      process.chdir(originalCwd);
      rmSync(root, { recursive: true, force: true });
    }
  })();
}

async function runSchedule(args: string[]): Promise<void> {
  const program = new Command();
  program.exitOverride();
  registerScheduleCommands(program);
  await program.parseAsync(["schedule", ...args], { from: "user" });
}

function captureStdout(): { text: () => string } {
  const chunks: string[] = [];
  vi.spyOn(process.stdout, "write").mockImplementation((chunk: unknown) => {
    chunks.push(String(chunk));
    return true;
  });
  return { text: () => chunks.join("") };
}

// 準備段階のコマンド出力はテスト結果に関係しないため、標準出力を抑止して実行する。
async function runSilently(fn: () => Promise<void>): Promise<void> {
  const spy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
  try {
    await fn();
  } finally {
    spy.mockRestore();
  }
}

function assessmentPath(root: string): string {
  return join(root, SCHEDULE_REL, "assessments", "sch-assessment-launch.yaml");
}

function loadWritten(root: string): SchAssessment {
  return yaml.load(readFileSync(assessmentPath(root), "utf8")) as SchAssessment;
}

function fullyGuidedJudgment(): AssessmentJudgment {
  const kata = {
    usability: "usable" as const,
    checks: [
      { check: "target-fit" as const, result: "pass" as const, note: "対象成果物向け" },
      { check: "substantive-content" as const, result: "pass" as const, note: "記述がある" },
      { check: "internal-consistency" as const, result: "pass" as const, note: "矛盾なし" },
      { check: "standard-alignment" as const, result: "pass" as const, note: "rulebook と整合" },
    ],
    rationale: "内容を確認した",
    confidence: "high" as const,
  };
  return {
    intent: "author-deliverable",
    intent_rationale: "初稿を作成する",
    kata: { rulebook: kata, recipe: kata, sample: kata, template: kata },
    recommended_approach: "fully-guided",
    rationale: "4種の実践の型が利用できる",
    evidence: ["docs/ja/specdojo/rulebooks/full-rulebook.md"],
    confidence: "high",
  };
}

// scaffold で収集した事実をそのまま使い、agent の出力に相当する判定を足す。
async function writeAgentOutput(
  root: string,
  mutate: (assessment: SchAssessment) => void,
): Promise<string> {
  await runSilently(() => runSchedule(["assessment", "scaffold", "--track", "launch"]));
  const assessment = loadWritten(root);
  mutate(assessment);
  const outPath = join(root, "agent-assessment.yaml");
  writeFileSync(outPath, yaml.dump(assessment), "utf8");
  return outPath;
}

describe("schedule assessment CLI", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    process.exitCode = undefined;
  });

  it("scaffold は assessments 配下に事実だけの骨組みを作り、未判定であることを警告する", async () => {
    await withRepo(async (root) => {
      const stdout = captureStdout();

      await runSchedule(["assessment", "scaffold", "--track", "launch"]);

      expect(existsSync(assessmentPath(root))).toBe(true);
      const assessment = loadWritten(root);
      expect(assessment.id).toBe("prj-0001:sch-assessment-launch");
      expect(assessment.deliverables[0].facts.kata.recipe.exists).toBe(true);
      expect(assessment.deliverables[0].judgment).toBeUndefined();
      expect(stdout.text()).toContain("まだ 1 件も判定されていない");
      expect(process.exitCode).toBeUndefined();
    });
  });

  it("scaffold --from は agent の判定結果を検証して正準パスへ保存する", async () => {
    await withRepo(async (root) => {
      const agentPath = await writeAgentOutput(root, (assessment) => {
        assessment.deliverables[0].judgment = fullyGuidedJudgment();
        assessment.open_questions = [];
        assessment.confidence = "high";
      });
      const stdout = captureStdout();

      await runSchedule([
        "assessment",
        "scaffold",
        "--track",
        "launch",
        "--from",
        agentPath,
        "--force",
      ]);

      expect(stdout.text()).toContain("Updated:");
      expect(loadWritten(root).deliverables[0].judgment?.recommended_approach).toBe("fully-guided");
      expect(process.exitCode).toBeUndefined();
    });
  });

  it("scaffold --from は facts を書き換えた出力を拒否する", async () => {
    await withRepo(async (root) => {
      const agentPath = await writeAgentOutput(root, (assessment) => {
        assessment.deliverables[0].judgment = fullyGuidedJudgment();
        assessment.deliverables[0].facts.kata.template.exists = false;
        assessment.open_questions = [];
      });
      const stdout = captureStdout();

      await runSchedule([
        "assessment",
        "scaffold",
        "--track",
        "launch",
        "--from",
        agentPath,
        "--force",
      ]);

      expect(stdout.text()).toContain("facts が実際の解決結果と一致しない");
      expect(process.exitCode).toBe(1);
      expect(loadWritten(root).deliverables[0].judgment).toBeUndefined();
    });
  });

  it("scaffold は既存の判定結果を上書きせず差分を表示する", async () => {
    await withRepo(async (root) => {
      const agentPath = await writeAgentOutput(root, (assessment) => {
        assessment.deliverables[0].judgment = fullyGuidedJudgment();
        assessment.open_questions = [];
      });
      const stdout = captureStdout();

      await runSchedule(["assessment", "scaffold", "--track", "launch", "--from", agentPath]);

      expect(stdout.text()).toContain("Skipped (already exists; use --force to overwrite)");
      expect(stdout.text()).toMatch(/\+\s+judgment:/);
      expect(loadWritten(root).deliverables[0].judgment).toBeUndefined();
    });
  });

  it("prompt は収集済みの事実を含む判定指示を出力する", async () => {
    await withRepo(async () => {
      const stdout = captureStdout();

      await runSchedule(["assessment", "prompt", "--track", "launch"]);

      const text = stdout.text();
      expect(text).toContain("# 成果物・実践の型の利用可能性判定指示（launch）");
      expect(text).toContain("`full-kata-doc` 実践の型がそろう成果物");
      expect(text).toContain("docs/ja/specdojo/recipes/full-recipe.md");
      expect(text).toContain(
        `docs/ja/projects/prj-0001/schedule/assessments/sch-assessment-launch.yaml`,
      );
    });
  });

  it("prompt --out は指示をファイルへ書き出す", async () => {
    await withRepo(async (root) => {
      captureStdout();

      await runSchedule([
        "assessment",
        "prompt",
        "--track",
        "launch",
        "--out",
        "logs/assessment-prompt.md",
      ]);

      expect(readFileSync(join(root, "logs/assessment-prompt.md"), "utf8")).toContain(
        "利用可能性判定指示",
      );
    });
  });

  it("validate は保存済みの判定結果を検証する", async () => {
    await withRepo(async (root) => {
      const agentPath = await writeAgentOutput(root, (assessment) => {
        assessment.deliverables[0].judgment = fullyGuidedJudgment();
        assessment.open_questions = [];
      });
      await runSilently(() =>
        runSchedule([
          "assessment",
          "scaffold",
          "--track",
          "launch",
          "--from",
          agentPath,
          "--force",
        ]),
      );
      const stdout = captureStdout();

      await runSchedule(["assessment", "validate", "--track", "launch"]);

      expect(stdout.text()).toContain("OK: sch-assessment-launch.yaml");
      expect(process.exitCode).toBeUndefined();
      expect(existsSync(assessmentPath(root))).toBe(true);
    });
  });

  it("validate は推奨フローが判定規則と矛盾する場合に失敗する", async () => {
    await withRepo(async (root) => {
      await runSilently(() => runSchedule(["assessment", "scaffold", "--track", "launch"]));
      const assessment = loadWritten(root);
      assessment.deliverables[0].judgment = {
        ...fullyGuidedJudgment(),
        recommended_approach: "bootstrap",
      };
      assessment.open_questions = [];
      writeFileSync(assessmentPath(root), yaml.dump(assessment), "utf8");
      const stdout = captureStdout();

      await runSchedule(["assessment", "validate"]);

      expect(stdout.text()).toContain("判定規則の結果 'fully-guided'");
      expect(process.exitCode).toBe(1);
    });
  });

  it("validate は判定結果が無い場合にその旨を表示する", async () => {
    await withRepo(async () => {
      const stdout = captureStdout();

      await runSchedule(["assessment", "validate"]);

      expect(stdout.text()).toContain("No sch-assessment-*.yaml files found");
      expect(process.exitCode).toBeUndefined();
    });
  });

  it("strategy が無い track はエラーで終了する", async () => {
    await withRepo(async () => {
      const stdout = captureStdout();

      await runSchedule(["assessment", "scaffold", "--track", "missing"]);

      expect(stdout.text()).toContain("Strategy file not found");
      expect(process.exitCode).toBe(1);
    });
  });
});
