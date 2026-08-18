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
import { join } from "node:path";
import { tmpdir } from "node:os";
import yaml from "js-yaml";
import { registerCatalogCommands } from "../../src/catalog.js";

// catalog plan サブコマンドを CLI 経由で確認する。一時リポジトリを cwd にして
// specdojoRootDir() / loadConfig() と plan の出力先を temp 内へ閉じ込める。

const CATALOG_REL = "docs/ja/projects/prj-0001/010-deliverables-catalog";
const DATA_FLOW_DOCS_REL = "docs/ja/product/010-business-specs/010-data-flow";

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

type Fixture = { root: string; catalogDir: string; plansDir: string };

function writeDataFlowCatalog(root: string): void {
  const catalogDir = join(root, CATALOG_REL);
  writeFileSync(
    join(catalogDir, "dct-data-flow.yaml"),
    yaml.dump({
      id: "prj-0001:dct-data-flow",
      type: "project",
      status: "draft",
      title: "成果物カタログ（データフロー）",
      rulebook: "specdojo:dct-rulebook",
      project_id: "prj-0001",
      domain: "data-flow",
      base_path: `/${DATA_FLOW_DOCS_REL}`,
      groups: [
        {
          deliverables: [
            {
              local_id: "cdfd-init",
              name: "概念データフロー図（初期化）",
              kind: "work",
              overview: "初期化フロー",
              path: "cdfd-init.md",
            },
          ],
        },
      ],
    }),
    "utf8",
  );
  mkdirSync(join(root, DATA_FLOW_DOCS_REL), { recursive: true });
  writeFileSync(join(root, DATA_FLOW_DOCS_REL, "cdfd-init.md"), "# 初期化\n", "utf8");
}

function withRepo(fn: (fixture: Fixture) => Promise<void> | void): Promise<void> {
  const originalCwd = process.cwd();
  const root = mkdtempSync(join(tmpdir(), "specdojo-catalog-plan-cli-"));
  return (async () => {
    try {
      mkdirSync(join(root, ".specdojo"), { recursive: true });
      writeFileSync(
        join(root, ".specdojo/specdojo.config.json"),
        `${JSON.stringify(CONFIG, null, 2)}\n`,
        "utf8",
      );
      const catalogDir = join(root, CATALOG_REL);
      mkdirSync(catalogDir, { recursive: true });
      // テンプレートと plan schema は実リポジトリのものを複製し、判定と検証を成立させる。
      cpSync(
        join(originalCwd, "docs/ja/specdojo/templates"),
        join(root, "docs/ja/specdojo/templates"),
        { recursive: true },
      );
      cpSync(
        join(originalCwd, "docs/specdojo/schemas/v1"),
        join(root, "docs/specdojo/schemas/v1"),
        { recursive: true },
      );
      process.chdir(root);
      await fn({ root, catalogDir, plansDir: join(catalogDir, "plans") });
    } finally {
      process.chdir(originalCwd);
      rmSync(root, { recursive: true, force: true });
    }
  })();
}

async function runCatalog(args: string[]): Promise<void> {
  const program = new Command();
  program.exitOverride();
  registerCatalogCommands(program);
  await program.parseAsync(["catalog", ...args], { from: "user" });
}

function captureStdout(): { text: () => string } {
  const chunks: string[] = [];
  vi.spyOn(process.stdout, "write").mockImplementation((chunk: unknown) => {
    chunks.push(String(chunk));
    return true;
  });
  return { text: () => chunks.join("") };
}

function agentPlan(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: "prj-0001:dct-plan-data-flow",
    type: "project",
    status: "draft",
    title: "成果物カタログ判定計画（data-flow）",
    rulebook: "none",
    schema_version: 1,
    project_id: "prj-0001",
    domain: "data-flow",
    template: {
      id: "specdojo:dct-data-flow-template",
      path: "docs/ja/specdojo/templates/dct-data-flow-template.yaml",
    },
    inputs: [{ kind: "data-flow", path: `${DATA_FLOW_DOCS_REL}/cdfd-init.md` }],
    iteration_pattern: "pattern-b",
    deliverables: [
      {
        local_id: "cdfd-init",
        name: "概念データフロー図（初期化）",
        kind: "work",
        template_local_id: "cdfd-_TERM_",
        evidence: [`${DATA_FLOW_DOCS_REL}/cdfd-init.md`],
        rationale: "初期化フローが独立した処理単位として記述されている",
        confidence: "high",
      },
    ],
    exclusions: [],
    open_questions: [],
    confidence: "medium",
    ...overrides,
  };
}

function writeAgentPlan(root: string, plan: Record<string, unknown>): string {
  const path = join(root, "agent-plan.yaml");
  writeFileSync(path, yaml.dump(plan), "utf8");
  return path;
}

describe("catalog plan CLI", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    process.exitCode = undefined;
  });

  it("scaffold は plans 配下に骨組みを作り、未判定であることを警告する", async () => {
    await withRepo(async ({ root, plansDir }) => {
      writeDataFlowCatalog(root);
      const stdout = captureStdout();

      await runCatalog(["plan", "scaffold", "--domain", "data-flow"]);

      const planPath = join(plansDir, "dct-plan-data-flow.yaml");
      expect(existsSync(planPath)).toBe(true);
      expect(readFileSync(planPath, "utf8")).toContain("id: prj-0001:dct-plan-data-flow");
      expect(stdout.text()).toContain("no deliverables planned yet");
      expect(process.exitCode).toBeUndefined();
    });
  });

  it("scaffold は data-flow が無いドメインで入力不足として失敗する", async () => {
    await withRepo(async ({ plansDir }) => {
      const stdout = captureStdout();

      await runCatalog(["plan", "scaffold", "--domain", "architecture"]);

      expect(stdout.text()).toContain("No data-flow document found");
      expect(process.exitCode).toBe(1);
      expect(existsSync(join(plansDir, "dct-plan-architecture.yaml"))).toBe(false);
    });
  });

  it("scaffold --from は agent の判定結果を検証して保存する", async () => {
    await withRepo(async ({ root, plansDir }) => {
      writeDataFlowCatalog(root);
      const from = writeAgentPlan(root, agentPlan());
      captureStdout();

      await runCatalog(["plan", "scaffold", "--domain", "data-flow", "--from", from]);

      const stored = readFileSync(join(plansDir, "dct-plan-data-flow.yaml"), "utf8");
      expect(stored).toContain("iteration_pattern: pattern-b");
      expect(stored).toContain("local_id: cdfd-init");
      expect(process.exitCode).toBeUndefined();
    });
  });

  it("scaffold --from はスキーマ違反を保存せずに失敗する", async () => {
    await withRepo(async ({ root, plansDir }) => {
      writeDataFlowCatalog(root);
      const from = writeAgentPlan(root, agentPlan({ agent_notes: "自由文の判断メモ" }));
      const stdout = captureStdout();

      await runCatalog(["plan", "scaffold", "--domain", "data-flow", "--from", from]);

      expect(stdout.text()).toContain("agent_notes");
      expect(process.exitCode).toBe(1);
      expect(existsSync(join(plansDir, "dct-plan-data-flow.yaml"))).toBe(false);
    });
  });

  it("scaffold --from は placeholder 未解決を保存せずに失敗する", async () => {
    await withRepo(async ({ root, plansDir }) => {
      writeDataFlowCatalog(root);
      const from = writeAgentPlan(
        root,
        agentPlan({
          iteration_pattern: "pattern-a",
          deliverables: [
            {
              local_id: "cdfd-init",
              name: "概念データフロー図（初期化）",
              kind: "work",
              template_local_id: "cdfd-_TERM_",
              evidence: [`${DATA_FLOW_DOCS_REL}/cdfd-init.md`],
              rationale: "根拠不足のまま値を確定した",
              confidence: "high",
            },
          ],
        }),
      );
      const stdout = captureStdout();

      await runCatalog(["plan", "scaffold", "--domain", "data-flow", "--from", from]);

      expect(stdout.text()).toContain("unresolved placeholder(s) _TERM_");
      expect(process.exitCode).toBe(1);
      expect(existsSync(join(plansDir, "dct-plan-data-flow.yaml"))).toBe(false);
    });
  });

  it("既存 plan は --force なしでは上書きせず差分を表示する", async () => {
    await withRepo(async ({ root, plansDir }) => {
      writeDataFlowCatalog(root);
      const first = writeAgentPlan(root, agentPlan());
      captureStdout();
      await runCatalog(["plan", "scaffold", "--domain", "data-flow", "--from", first]);
      vi.restoreAllMocks();

      const second = writeAgentPlan(root, agentPlan({ confidence: "high" }));
      const stdout = captureStdout();
      await runCatalog(["plan", "scaffold", "--domain", "data-flow", "--from", second]);

      expect(stdout.text()).toContain("use --force to overwrite");
      expect(stdout.text()).toContain("+ confidence: high");
      expect(readFileSync(join(plansDir, "dct-plan-data-flow.yaml"), "utf8")).toContain(
        "confidence: medium",
      );
    });
  });

  it("既存 plan は --force で上書きする", async () => {
    await withRepo(async ({ root, plansDir }) => {
      writeDataFlowCatalog(root);
      const first = writeAgentPlan(root, agentPlan());
      captureStdout();
      await runCatalog(["plan", "scaffold", "--domain", "data-flow", "--from", first]);
      vi.restoreAllMocks();

      const second = writeAgentPlan(root, agentPlan({ confidence: "high" }));
      captureStdout();
      await runCatalog(["plan", "scaffold", "--domain", "data-flow", "--from", second, "--force"]);

      expect(readFileSync(join(plansDir, "dct-plan-data-flow.yaml"), "utf8")).toContain(
        "confidence: high",
      );
    });
  });

  it("validate は保存済み plan を検証する", async () => {
    await withRepo(async ({ root }) => {
      writeDataFlowCatalog(root);
      const from = writeAgentPlan(root, agentPlan());
      captureStdout();
      await runCatalog(["plan", "scaffold", "--domain", "data-flow", "--from", from]);
      vi.restoreAllMocks();

      const stdout = captureStdout();
      await runCatalog(["plan", "validate"]);

      expect(stdout.text()).toContain("OK: dct-plan-data-flow.yaml");
      expect(process.exitCode).toBe(0);
    });
  });

  it("validate は plan が無いディレクトリを失敗にしない", async () => {
    await withRepo(async () => {
      const stdout = captureStdout();

      await runCatalog(["plan", "validate"]);

      expect(stdout.text()).toContain("No dct-plan-*.yaml files found");
      expect(process.exitCode).toBeUndefined();
    });
  });

  it("prompt --out は agent 指示をファイルへ書き出す", async () => {
    await withRepo(async ({ root }) => {
      writeDataFlowCatalog(root);
      captureStdout();

      await runCatalog([
        "plan",
        "prompt",
        "--domain",
        "data-flow",
        "--out",
        "logs/dct-plan-prompt.md",
      ]);

      const prompt = readFileSync(join(root, "logs/dct-plan-prompt.md"), "utf8");
      expect(prompt).toContain("# DCT成果物インスタンス判定指示（data-flow）");
      expect(prompt).toContain(`${DATA_FLOW_DOCS_REL}/cdfd-init.md`);
      expect(prompt).toContain("plans/dct-plan-data-flow.yaml");
    });
  });
});
