import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { generateRegisterPlan } from "../../../src/exec/register.js";
import type { PjrItem, RegisterPaths } from "../../../src/register/register.js";
import { load } from "../../../src/shared/yaml.js";
import { validateDctDoc } from "../../../src/catalog/build.js";
import type { DctDoc } from "../../../src/catalog/types.js";

describe("kata authoring register integration", () => {
  const originalCwd = process.cwd();
  const originalPackageRoot = process.env.SPECDOJO_PACKAGE_ROOT;
  let root: string | undefined;

  afterEach(() => {
    process.chdir(originalCwd);
    if (originalPackageRoot === undefined) delete process.env.SPECDOJO_PACKAGE_ROOT;
    else process.env.SPECDOJO_PACKAGE_ROOT = originalPackageRoot;
    if (root) rmSync(root, { recursive: true, force: true });
    root = undefined;
  });

  it("creates a rulebook from an exemplar and replaces its undecided catalog reference", async () => {
    root = mkdtempSync(join(tmpdir(), "specdojo-kata-authoring-integration-"));
    const sourceRoot = originalCwd;
    const catalogPath = join(root, "docs/ja/projects/prj-test/catalog");
    const registerPath = join(root, "docs/ja/projects/prj-test/register");
    const executionPath = join(root, "docs/ja/projects/prj-test/execution");
    const exemplarPath = join(root, "docs/ja/product/payment.md");
    const catalogFile = join(catalogPath, "dct-payment.yaml");
    mkdirSync(join(root, ".specdojo"), { recursive: true });
    mkdirSync(catalogPath, { recursive: true });
    mkdirSync(registerPath, { recursive: true });
    mkdirSync(join(root, "docs/ja/product"), { recursive: true });
    writeFileSync(
      join(root, ".specdojo/specdojo.config.json"),
      JSON.stringify({ version: 1, kata_authority: "customer", projects: {} }),
      "utf8",
    );
    writeFileSync(join(root, "package.json"), '{"name":"customer"}\n', "utf8");
    const exemplar =
      "---\nspecdojo:\n  id: payment-spec\n  type: project\n  status: ready\n---\n\n# Payment\n";
    writeFileSync(exemplarPath, exemplar, "utf8");
    writeFileSync(
      catalogFile,
      [
        "id: prj-test:dct-payment",
        "type: project",
        "status: draft",
        "project_id: prj-test",
        "domain: payment",
        "base_path: /docs/ja/product",
        "groups:",
        "  - deliverables:",
        "      - local_id: payment",
        "        name: Payment specification",
        "        kind: work",
        "        overview: Payment behavior",
        "        path: payment.md",
        "        rulebook: undecided",
        "        done_criteria:",
        "          - text: Payment behavior is documented",
        "            roles: [ARC]",
        "",
      ].join("\n"),
      "utf8",
    );

    process.env.SPECDOJO_PACKAGE_ROOT = sourceRoot;
    process.chdir(root);
    const paths: RegisterPaths = {
      projectId: "prj-test",
      projectRegisterPath: registerPath,
      pjrIndexPath: join(registerPath, "pjr-index.md"),
      generatedPath: join(registerPath, "generated"),
      controlsGeneratedPath: join(root, "docs/ja/projects/prj-test/controls/generated"),
      registerDateTimeZone: "UTC",
    };
    const item: PjrItem = {
      id: "PJR-AB12",
      status: "open",
      title: "Author payment rulebook",
      description: "Create a reusable rulebook from the existing payment specification.",
      type: "todo",
      priority: "medium",
      owner: "ARC",
      registeredAt: "2026-10-23T00:00:00Z",
      due: "-",
      completedAt: "-",
      conclusion: "-",
      ticket: "-",
      approach: "rulebook-authoring",
      targets: ["customer:payment-rulebook", "payment-spec"],
    };
    const { planPath } = await generateRegisterPlan({
      executionPath,
      projectId: "prj-test",
      catalogPath,
      registerPaths: paths,
      item,
      stem: "pjr-ab12-authoring",
    });

    const plan = readFileSync(planPath, "utf8");
    expect(plan).toContain("docs/ja/specdojo/rulebooks/customer/payment-rulebook.md");
    expect(plan).toContain("手本ファイルは読み取り専用");
    expect(plan).toContain("`undecided` または未記入なら");

    // The fake executor follows the generated plan's externally observable contract.
    const authoredPath = join(root, "docs/ja/specdojo/rulebooks/customer/payment-rulebook.md");
    mkdirSync(dirname(authoredPath), { recursive: true });
    writeFileSync(
      authoredPath,
      "---\nspecdojo:\n  id: customer:payment-rulebook\n  type: rulebook\n  status: draft\n---\n\n# Payment Rulebook\n",
      "utf8",
    );
    writeFileSync(
      catalogFile,
      readFileSync(catalogFile, "utf8").replace(
        "rulebook: undecided",
        "rulebook: customer:payment-rulebook",
      ),
      "utf8",
    );

    const catalog = load(readFileSync(catalogFile, "utf8")) as DctDoc;
    expect(readFileSync(exemplarPath, "utf8")).toBe(exemplar);
    expect(readFileSync(authoredPath, "utf8")).toContain("status: draft");
    expect(catalog.groups[0]?.deliverables?.[0]?.rulebook).toBe("customer:payment-rulebook");
    expect(validateDctDoc(catalog, catalogFile, undefined, root).errors).toEqual([]);
  });

  it("creates a plan from product-repository sources without a catalog", async () => {
    root = mkdtempSync(join(tmpdir(), "specdojo-kata-authoring-product-source-"));
    const sourceRoot = originalCwd;
    const registerPath = join(root, "docs/ja/projects/prj-test/register");
    const executionPath = join(root, "docs/ja/projects/prj-test/execution");
    const productRoot = join(root, "product");
    mkdirSync(join(root, ".specdojo"), { recursive: true });
    mkdirSync(registerPath, { recursive: true });
    mkdirSync(join(productRoot, "lessons"), { recursive: true });
    writeFileSync(join(productRoot, "lessons/intro.md"), "# Intro\n", "utf8");
    writeFileSync(
      join(root, ".specdojo/specdojo.config.json"),
      JSON.stringify({
        version: 1,
        kata_authority: "customer",
        projects: { "prj-test": { repos: [{ name: "lessons", path: "product" }] } },
      }),
      "utf8",
    );
    writeFileSync(join(root, "package.json"), '{"name":"customer"}\n', "utf8");

    process.env.SPECDOJO_PACKAGE_ROOT = sourceRoot;
    process.chdir(root);
    const paths: RegisterPaths = {
      projectId: "prj-test",
      projectRegisterPath: registerPath,
      pjrIndexPath: join(registerPath, "pjr-index.md"),
      generatedPath: join(registerPath, "generated"),
      controlsGeneratedPath: join(root, "docs/ja/projects/prj-test/controls/generated"),
      registerDateTimeZone: "UTC",
    };
    const item: PjrItem = {
      id: "PJR-CD34",
      status: "open",
      title: "Author lesson rulebook",
      description: "Create a reusable rulebook from a product repository lesson.",
      type: "todo",
      priority: "medium",
      owner: "ARC",
      registeredAt: "2026-10-24T00:00:00Z",
      due: "-",
      completedAt: "-",
      conclusion: "-",
      ticket: "-",
      approach: "rulebook-authoring",
      targets: ["customer:lesson-rulebook"],
      sources: ["lessons:lessons/*.md"],
    };

    const { planPath } = await generateRegisterPlan({
      executionPath,
      projectId: "prj-test",
      registerPaths: paths,
      item,
      stem: "pjr-cd34-product-source",
    });

    const plan = readFileSync(planPath, "utf8");
    expect(plan).toContain("`$SPECDOJO_REPO_LESSONS/lessons/intro.md`");
    expect(plan).toContain("カタログ外のため参照の付け替え対象外");
    expect(plan).toContain("targets:\n    - customer:lesson-rulebook");
  });
});
