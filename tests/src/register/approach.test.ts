import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { validateRegisterApproachTargets } from "../../../src/register/approach.js";
import { MAX_AUTHORING_SOURCE_FILES } from "../../../src/register/authoring-sources.js";

describe("validateRegisterApproachTargets", () => {
  let root: string;
  let catalogPath: string;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "specdojo-register-approach-"));
    catalogPath = join(root, "docs/ja/projects/prj-test/catalog");
    mkdirSync(catalogPath, { recursive: true });
    mkdirSync(join(root, "docs/ja/product"), { recursive: true });
    mkdirSync(join(root, "docs/ja/specdojo/rulebooks"), { recursive: true });
    mkdirSync(join(root, "docs/ja/specdojo/recipes"), { recursive: true });
    mkdirSync(join(root, "docs/ja/specdojo/templates"), { recursive: true });
    mkdirSync(join(root, ".specdojo"), { recursive: true });
    writeFileSync(
      join(root, ".specdojo/specdojo.config.json"),
      JSON.stringify({ version: 1, kata_authority: "example-repo", projects: {} }),
      "utf8",
    );
    writeFileSync(join(root, "package.json"), '{"name":"example-repo"}\n', "utf8");

    writeFileSync(
      join(root, "docs/ja/product/deliverable.md"),
      [
        "---",
        "specdojo:",
        "  id: deliverable-doc",
        "  type: project",
        "  status: draft",
        "---",
        "",
        "# Deliverable",
        "",
      ].join("\n"),
      "utf8",
    );
    writeFileSync(
      join(root, "docs/ja/specdojo/rulebooks/example-rulebook.md"),
      [
        "---",
        "specdojo:",
        "  id: specdojo:example-rulebook",
        "  type: rulebook",
        "  status: draft",
        "---",
        "",
        "# Rulebook",
        "",
      ].join("\n"),
      "utf8",
    );
    writeFileSync(
      join(root, "docs/ja/specdojo/recipes/example-recipe.md"),
      [
        "---",
        "specdojo:",
        "  id: specdojo:example-recipe",
        "  type: recipe",
        "  status: draft",
        "---",
        "",
        "# Recipe",
        "",
      ].join("\n"),
      "utf8",
    );
    writeFileSync(
      join(root, "docs/ja/specdojo/templates/example-template.yaml"),
      [
        "id: specdojo:example-template",
        "type: template",
        "status: draft",
        "metadata_template: {}",
        "",
      ].join("\n"),
      "utf8",
    );
    writeFileSync(
      join(catalogPath, "dct-example.yaml"),
      [
        "id: prj-test:dct-example",
        "type: project",
        "status: draft",
        "project_id: prj-test",
        "domain: example",
        "base_path: /docs/ja/product",
        "groups:",
        "  - deliverables:",
        "      - local_id: deliverable",
        "        name: Deliverable",
        "        kind: work",
        "        overview: Example",
        "        path: deliverable.md",
        "        done_criteria: []",
        "",
      ].join("\n"),
      "utf8",
    );
    writeFileSync(
      join(catalogPath, "dct-uncreated.yaml"),
      [
        "id: prj-test:dct-uncreated",
        "type: project",
        "status: draft",
        "project_id: prj-test",
        "domain: uncreated",
        "base_path: /docs/ja/product/specs",
        "groups:",
        "  - deliverables:",
        "      - local_id: uncreated",
        "        name: Uncreated",
        "        kind: work",
        "        overview: Example",
        "        path: uncreated.md",
        "        done_criteria: []",
        "",
      ].join("\n"),
      "utf8",
    );
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("成果物 approach は文書索引と DCT の両方にある対象を受け付ける", () => {
    expect(() =>
      validateRegisterApproachTargets({
        repoRoot: root,
        projectId: "prj-test",
        catalogPath,
        approach: "fully-guided",
        targets: ["deliverable-doc"],
      }),
    ).not.toThrow();
  });

  it("成果物 approach は文書が未作成でも DCT の doc id を受け付ける", () => {
    expect(() =>
      validateRegisterApproachTargets({
        repoRoot: root,
        projectId: "prj-test",
        catalogPath,
        approach: "bootstrap",
        targets: ["prj-test:uncreated"],
      }),
    ).not.toThrow();
  });

  it("maintenance approach は対応する kata 種別だけを受け付ける", () => {
    expect(() =>
      validateRegisterApproachTargets({
        repoRoot: root,
        projectId: "prj-test",
        catalogPath,
        approach: "rulebook-maintenance",
        targets: ["specdojo:example-rulebook"],
      }),
    ).not.toThrow();

    expect(() =>
      validateRegisterApproachTargets({
        repoRoot: root,
        projectId: "prj-test",
        catalogPath,
        approach: "rulebook-maintenance",
        targets: ["specdojo:example-recipe"],
      }),
    ).toThrow(/requires a rulebook document target/);

    expect(() =>
      validateRegisterApproachTargets({
        repoRoot: root,
        projectId: "prj-test",
        catalogPath,
        approach: "template-maintenance",
        targets: ["specdojo:example-template"],
      }),
    ).not.toThrow();
  });

  it("approach には解決可能な target を 1 件だけ要求する", () => {
    expect(() =>
      validateRegisterApproachTargets({
        repoRoot: root,
        projectId: "prj-test",
        catalogPath,
        approach: "freeform",
        targets: [],
      }),
    ).toThrow(/requires exactly one --target/);
    expect(() =>
      validateRegisterApproachTargets({
        repoRoot: root,
        projectId: "prj-test",
        catalogPath,
        approach: "freeform",
        targets: ["deliverable-doc", "specdojo:example-rulebook"],
      }),
    ).toThrow(/requires exactly one --target/);
    expect(() =>
      validateRegisterApproachTargets({
        repoRoot: root,
        projectId: "prj-test",
        catalogPath,
        approach: "freeform",
        targets: ["missing-doc"],
      }),
    ).toThrow(/is not a catalog deliverable/);
  });

  it("authoring approach は新しい kata id と任意の手本成果物を受け付ける", () => {
    expect(() =>
      validateRegisterApproachTargets({
        repoRoot: root,
        projectId: "prj-test",
        catalogPath,
        approach: "rulebook-authoring",
        targets: ["example-repo:payment-rulebook", "deliverable-doc"],
      }),
    ).not.toThrow();

    expect(() =>
      validateRegisterApproachTargets({
        repoRoot: root,
        projectId: "prj-test",
        catalogPath,
        approach: "sample-authoring",
        targets: ["example-repo:payment-sample"],
      }),
    ).not.toThrow();
  });

  it("authoring source は doc id・project path・repo path を見分けて展開する", () => {
    const productRoot = join(root, "product");
    mkdirSync(join(root, "docs/ja/examples/nested"), { recursive: true });
    mkdirSync(join(productRoot, "lessons"), { recursive: true });
    writeFileSync(join(root, "docs/ja/examples/one.md"), "# One\n", "utf8");
    writeFileSync(join(root, "docs/ja/examples/nested/two.md"), "# Two\n", "utf8");
    writeFileSync(join(productRoot, "lessons/three.md"), "# Three\n", "utf8");

    expect(() =>
      validateRegisterApproachTargets({
        repoRoot: root,
        projectId: "prj-test",
        approach: "rulebook-authoring",
        targets: ["example-repo:payment-rulebook"],
        sources: ["deliverable-doc", "docs/ja/examples/**/*.md", "product:lessons/"],
        project: { repos: [{ name: "product", path: "product" }] },
      }),
    ).not.toThrow();
  });

  it("authoring source はカタログなしでも使え、見つからない手本は拒否する", () => {
    const base = {
      repoRoot: root,
      projectId: "prj-test",
      approach: "rulebook-authoring",
      targets: ["example-repo:payment-rulebook"],
    } as const;
    expect(() =>
      validateRegisterApproachTargets({ ...base, sources: ["deliverable-doc"] }),
    ).not.toThrow();
    expect(() => validateRegisterApproachTargets({ ...base, sources: ["missing-doc"] })).toThrow(
      /not resolvable via the document index/,
    );
    expect(() =>
      validateRegisterApproachTargets({ ...base, sources: ["docs/missing/*.md"] }),
    ).toThrow(/did not match any files/);
  });

  it("authoring source の展開件数を 100 ファイルまでに制限する", () => {
    const sourceDir = join(root, "examples");
    mkdirSync(sourceDir, { recursive: true });
    for (let index = 0; index <= MAX_AUTHORING_SOURCE_FILES; index += 1) {
      writeFileSync(join(sourceDir, `${index}.md`), `# ${index}\n`, "utf8");
    }
    expect(() =>
      validateRegisterApproachTargets({
        repoRoot: root,
        projectId: "prj-test",
        approach: "rulebook-authoring",
        targets: ["example-repo:payment-rulebook"],
        sources: ["examples/*.md"],
      }),
    ).toThrow(/more than 100 files/);
  });

  it("authoring approach は authority・末尾・手本・既存 id を検証する", () => {
    const base = {
      repoRoot: root,
      projectId: "prj-test",
      catalogPath,
      approach: "rulebook-authoring",
    } as const;
    expect(() =>
      validateRegisterApproachTargets({ ...base, targets: ["specdojo:payment-rulebook"] }),
    ).toThrow(/reserved for the SpecDojo repository/);
    expect(() =>
      validateRegisterApproachTargets({ ...base, targets: ["other:payment-rulebook"] }),
    ).toThrow(/kata_authority "example-repo"/);
    expect(() =>
      validateRegisterApproachTargets({ ...base, targets: ["example-repo:payment-recipe"] }),
    ).toThrow(/must end with -rulebook/);
    expect(() =>
      validateRegisterApproachTargets({
        ...base,
        targets: ["example-repo:payment-rulebook", "missing-doc"],
      }),
    ).toThrow(/not resolvable via the document index/);

    mkdirSync(join(root, "docs/ja/specdojo/rulebooks/example-repo"), { recursive: true });
    writeFileSync(
      join(root, "docs/ja/specdojo/rulebooks/example-repo/payment-rulebook.md"),
      "---\nspecdojo:\n  id: example-repo:payment-rulebook\n  type: rulebook\n  status: draft\n---\n",
      "utf8",
    );
    expect(() =>
      validateRegisterApproachTargets({ ...base, targets: ["example-repo:payment-rulebook"] }),
    ).toThrow(/use rulebook-maintenance instead/);
  });
});
