import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { gitEnvironment } from "../../src/exec-worktree.js";
import { applyTrash, planTrash } from "../../src/deliverable-trash.js";

function git(cwd: string, ...args: string[]): string {
  return execFileSync("git", args, { cwd, encoding: "utf8", env: gitEnvironment() }).trim();
}

const CATALOG_YAML = `id: prj-0001:dct-data-flow
type: project
status: draft
title: 成果物カタログ（データフロー）
rulebook: specdojo:dct-rulebook
project_id: prj-0001
domain: data-flow
base_path: /docs/ja/product/010-business-specs/010-data-flow
groups:
  - name: プロジェクト推進
    deliverables:
      - local_id: cdfd-register-operation
        name: 概念データフロー図（登録簿運用）
        kind: work
        overview: 廃止済み
        path: cdfd-register-operation.md
        rulebook: specdojo:cdfd-rulebook
        # 実装エビデンス（evidence_refs[].path は同名フィールドだが対象外）
        evidence_refs:
          - kind: implementation
            path: src/register.ts
            purpose: 登録簿項目の生成
        done_criteria:
          - text: something
            roles: [BA]
            viewpoint: vp-ba-business-value
`;

function createRepo(): string {
  const repo = mkdtempSync(join(tmpdir(), "specdojo-deliverable-trash-"));
  git(repo, "init");
  git(repo, "config", "user.name", "SpecDojo Test");
  git(repo, "config", "user.email", "specdojo@example.invalid");

  const catalogDir = join(repo, "docs/ja/projects/prj-0001/010-deliverables-catalog");
  mkdirSync(catalogDir, { recursive: true });
  writeFileSync(join(catalogDir, "dct-data-flow.yaml"), CATALOG_YAML, "utf8");

  const docDir = join(repo, "docs/ja/product/010-business-specs/010-data-flow");
  mkdirSync(docDir, { recursive: true });
  writeFileSync(
    join(docDir, "cdfd-register-operation.md"),
    [
      "---",
      "specdojo:",
      "  id: prj-0001:cdfd-register-operation",
      "  type: flow",
      "  status: deprecated",
      "---",
      "",
      "# 概念データフロー図（登録簿運用）: SpecDojo",
      "",
      "moved.",
      "",
    ].join("\n"),
    "utf8",
  );

  git(repo, "add", ".");
  git(repo, "commit", "-m", "initial");
  return repo;
}

describe("deliverable trash", () => {
  const repos: string[] = [];

  afterEach(() => {
    for (const repo of repos.splice(0)) {
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("plans the trash destination without touching the filesystem", () => {
    const repo = createRepo();
    repos.push(repo);
    const catalogDir = join(repo, "docs/ja/projects/prj-0001/010-deliverables-catalog");

    const plan = planTrash(repo, catalogDir, "cdfd-register-operation");

    expect(plan).toEqual({
      localId: "cdfd-register-operation",
      catalogFile: "docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-flow.yaml",
      oldDocPath: "docs/ja/product/010-business-specs/010-data-flow/cdfd-register-operation.md",
      newDocPath: "docs/ja/product/trash/cdfd-register-operation.md",
      frontmatterStatus: "deprecated",
    });
    expect(
      existsSync(
        join(repo, "docs/ja/product/010-business-specs/010-data-flow/cdfd-register-operation.md"),
      ),
    ).toBe(true);
    expect(existsSync(join(repo, "docs/ja/product/trash/cdfd-register-operation.md"))).toBe(false);
  });

  it("moves the file with git mv and rewrites only the deliverable's own path field", () => {
    const repo = createRepo();
    repos.push(repo);
    const catalogDir = join(repo, "docs/ja/projects/prj-0001/010-deliverables-catalog");

    const plan = planTrash(repo, catalogDir, "cdfd-register-operation");
    const result = applyTrash(repo, plan);

    expect(result.moved).toBe(true);
    expect(
      existsSync(
        join(repo, "docs/ja/product/010-business-specs/010-data-flow/cdfd-register-operation.md"),
      ),
    ).toBe(false);
    expect(existsSync(join(repo, "docs/ja/product/trash/cdfd-register-operation.md"))).toBe(true);

    const catalogContent = readFileSync(join(catalogDir, "dct-data-flow.yaml"), "utf8");
    expect(catalogContent).toContain("path: /docs/ja/product/trash/cdfd-register-operation.md");
    // The unrelated evidence_refs[].path (same field name, different nesting) is untouched.
    expect(catalogContent).toContain("path: src/register.ts");
    // Comments survive because the catalog is edited as text, not re-dumped.
    expect(catalogContent).toContain(
      "# 実装エビデンス（evidence_refs[].path は同名フィールドだが対象外）",
    );

    const status = git(repo, "status", "--porcelain");
    expect(status).toContain(
      "R  docs/ja/product/010-business-specs/010-data-flow/cdfd-register-operation.md -> docs/ja/product/trash/cdfd-register-operation.md",
    );
  });

  it("throws when the local_id is not found in any catalog", () => {
    const repo = createRepo();
    repos.push(repo);
    const catalogDir = join(repo, "docs/ja/projects/prj-0001/010-deliverables-catalog");

    expect(() => planTrash(repo, catalogDir, "does-not-exist")).toThrow(/not found/);
  });

  it("throws when the destination already exists", () => {
    const repo = createRepo();
    repos.push(repo);
    const catalogDir = join(repo, "docs/ja/projects/prj-0001/010-deliverables-catalog");
    mkdirSync(join(repo, "docs/ja/product/trash"), { recursive: true });
    writeFileSync(
      join(repo, "docs/ja/product/trash/cdfd-register-operation.md"),
      "existing",
      "utf8",
    );

    const plan = planTrash(repo, catalogDir, "cdfd-register-operation");

    expect(() => applyTrash(repo, plan)).toThrow(/already exists/);
  });
});
