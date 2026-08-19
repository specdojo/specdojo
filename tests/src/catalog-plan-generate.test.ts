import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import yaml from "js-yaml";
import {
  generateCatalogsFromPlan,
  writeGeneratedCatalogs,
} from "../../src/catalog-plan-generate.js";
import type { DctPlan } from "../../src/catalog-plan.js";

let root: string;
let catalogPath: string;
let templatesPath: string;

function write(path: string, content: string): void {
  mkdirSync(path.slice(0, path.lastIndexOf("/")), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function template(domain: string, localId: string, part = ""): string {
  return yaml.dump({
    id: `specdojo:dct-${domain}${part}-template`,
    type: "template",
    status: "draft",
    title: `成果物カタログ（${domain}${part}）`,
    rulebook: "specdojo:dct-rulebook",
    part_of: ["specdojo:dct-index-template"],
    domain,
    base_path: `/docs/${domain}`,
    groups: [
      {
        deliverables: [
          {
            local_id: localId,
            name: "テンプレート成果物",
            kind: "work",
            depends_on: [],
            overview: "成果物を定義する",
            path: `${localId}.md`,
            rulebook: "none",
            done_criteria: [{ text: "完了していること", roles: ["QE"], viewpoint: "vp-qe" }],
          },
        ],
      },
    ],
  });
}

function plan(domain: string, deliverables: DctPlan["deliverables"]): DctPlan {
  return {
    id: `prj-0001:dct-plan-${domain}`,
    type: "project",
    status: "draft",
    title: `判定計画（${domain}）`,
    rulebook: "none",
    schema_version: 1,
    project_id: "prj-0001",
    domain,
    template: {
      id: `specdojo:dct-${domain}-template`,
      path: `templates/dct-${domain}-template.yaml`,
    },
    inputs: [{ kind: "data-flow", path: "docs/data-flow.md" }],
    iteration_pattern: "pattern-a",
    deliverables,
    exclusions: [],
    open_questions: [],
    confidence: "high",
  };
}

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "specdojo-plan-generate-"));
  catalogPath = join(root, "catalog");
  templatesPath = join(root, "templates");
  mkdirSync(catalogPath, { recursive: true });
  mkdirSync(templatesPath, { recursive: true });
});

afterEach(() => rmSync(root, { recursive: true, force: true }));

describe("DCT plan generator", () => {
  it("pattern-a の複数インスタンスを scaffold 規則で展開し、再生成しても同じ内容になる", () => {
    write(join(templatesPath, "dct-flow-template.yaml"), template("flow", "cdfd-_TERM_"));
    const input = plan(
      "flow",
      ["sales", "billing"].map((term) => ({
        local_id: `cdfd-${term}`,
        name: `${term} データフロー`,
        kind: "work" as const,
        template_local_id: "cdfd-_TERM_",
        variables: [{ name: "TERM", value: term, evidence: ["flow"], rationale: "処理単位" }],
        evidence: ["flow"],
        rationale: "独立した処理単位",
        confidence: "high" as const,
      })),
    );

    const first = generateCatalogsFromPlan({
      catalogPath,
      templatesPath,
      repoRoot: root,
      projectId: "prj-0001",
      size: "small",
      plan: input,
    });
    expect(first.errors).toEqual([]);
    expect(first.files).toHaveLength(1);
    const content = first.files[0].content;
    expect(content).toContain("local_id: cdfd-sales");
    expect(content).toContain("path: cdfd-sales.md");
    expect(content).toContain("local_id: cdfd-billing");

    expect(
      writeGeneratedCatalogs({ catalogPath, files: first.files, force: false, dryRun: false })[0]
        .written,
    ).toBe(true);
    const second = generateCatalogsFromPlan({
      catalogPath,
      templatesPath,
      repoRoot: root,
      projectId: "prj-0001",
      size: "small",
      plan: input,
    });
    expect(second.files[0].content).toBe(content);
    expect(
      writeGeneratedCatalogs({ catalogPath, files: second.files, force: false, dryRun: false })[0]
        .skippedReason,
    ).toBe("unchanged");
  });

  it("同一 domain の物理分割 template を別々の DCT として生成する", () => {
    write(join(templatesPath, "dct-model-a-template.yaml"), template("model", "model-a", "-a"));
    write(join(templatesPath, "dct-model-b-template.yaml"), template("model", "model-b", "-b"));
    const input = plan(
      "model",
      ["a", "b"].map((part) => ({
        local_id: `model-${part}`,
        name: `モデル ${part}`,
        kind: "work" as const,
        template_local_id: `model-${part}`,
        evidence: ["model"],
        rationale: "物理分割された成果物",
        confidence: "high" as const,
      })),
    );
    input.iteration_pattern = "pattern-b";

    const result = generateCatalogsFromPlan({
      catalogPath,
      templatesPath,
      repoRoot: root,
      projectId: "prj-0001",
      size: "small",
      plan: input,
    });

    expect(result.errors).toEqual([]);
    expect(result.files.map((file) => file.fileName)).toEqual([
      "dct-model-a.yaml",
      "dct-model-b.yaml",
    ]);
  });

  it("blocking な未確定事項では生成を失敗させる", () => {
    write(join(templatesPath, "dct-flow-template.yaml"), template("flow", "cdfd-_TERM_"));
    const input = plan("flow", []);
    input.open_questions = [
      { topic: "TERM", question: "名称は何か", blocking: true, reason: "根拠不足" },
    ];

    const result = generateCatalogsFromPlan({
      catalogPath,
      templatesPath,
      repoRoot: root,
      projectId: "prj-0001",
      size: "small",
      plan: input,
    });

    expect(result.errors.join("\n")).toContain("blocking");
    expect(existsSync(join(catalogPath, "dct-flow.yaml"))).toBe(false);
  });

  it("plan で採否を判定していない固定 template entry を暗黙に出力しない", () => {
    write(join(templatesPath, "dct-model-template.yaml"), template("model", "model-a"));
    const input = plan("model", []);
    input.iteration_pattern = "pattern-b";

    const result = generateCatalogsFromPlan({
      catalogPath,
      templatesPath,
      repoRoot: root,
      projectId: "prj-0001",
      size: "small",
      plan: input,
    });

    expect(result.errors.join("\n")).toContain("deliverables / exclusions");
  });

  it("物理分割の一方が既存ファイルと競合すると全ファイルを書き込まない", () => {
    const files = [
      {
        path: join(catalogPath, "dct-model-a.yaml"),
        fileName: "dct-model-a.yaml",
        doc: {} as never,
        content: "a: next\n",
      },
      {
        path: join(catalogPath, "dct-model-b.yaml"),
        fileName: "dct-model-b.yaml",
        doc: {} as never,
        content: "b: next\n",
      },
    ];
    write(files[0].path, "a: current\n");

    const outcomes = writeGeneratedCatalogs({ catalogPath, files, force: false, dryRun: false });

    expect(outcomes.every((outcome) => !outcome.written)).toBe(true);
    expect(readFileSync(files[0].path, "utf8")).toBe("a: current\n");
    expect(existsSync(files[1].path)).toBe(false);
  });
});
